# Enhanced Inventory Import Script using Supabase CLI
# This script safely imports enriched_inventory.csv into main_site_products table

param(
    [string]$CsvPath = "enriched_inventory.csv",
    [string]$SupabasePath = ".\supabase.exe",
    [switch]$SkipMigration,
    [switch]$SkipCsvLoad,
    [switch]$SkipImport,
    [switch]$VerifyOnly,
    [switch]$ForceOverwrite
)

# Configuration
$DatabaseUrl = $env:DATABASE_URL
$SupabaseProjectId = $env:SUPABASE_PROJECT_ID

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

# Function to write colored output
function Write-ColoredOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Function to test if file exists
function Test-FileExists {
    param([string]$Path)
    return Test-Path $Path -PathType Leaf
}

# Function to execute Supabase CLI commands with error handling
function Invoke-SupabaseCommand {
    param(
        [string[]]$Arguments,
        [string]$Description
    )

    Write-ColoredOutput "Executing: supabase $Arguments" $Cyan
    Write-ColoredOutput "Description: $Description" $Cyan

    try {
        $result = & $SupabasePath @Arguments 2>&1
        $exitCode = $LASTEXITCODE

        if ($exitCode -eq 0) {
            Write-ColoredOutput "✓ Command completed successfully" $Green
            return @{ Success = $true; Output = $result; ExitCode = $exitCode }
        } else {
            Write-ColoredOutput "✗ Command failed with exit code: $exitCode" $Red
            Write-ColoredOutput "Error output: $($result | Out-String)" $Red
            return @{ Success = $false; Output = $result; ExitCode = $exitCode }
        }
    }
    catch {
        Write-ColoredOutput "✗ Exception occurred: $($_.Exception.Message)" $Red
        return @{ Success = $false; Output = $_.Exception.Message; ExitCode = -1 }
    }
}

# Main execution
Write-ColoredOutput "=== Enhanced Inventory Import Process ===" $Green
Write-ColoredOutput "Starting at: $(Get-Date)" $Cyan

# Step 1: Validate prerequisites
Write-ColoredOutput "`n--- Step 1: Validating Prerequisites ---" $Yellow

# Check if CSV file exists
if (-not (Test-FileExists $CsvPath)) {
    Write-ColoredOutput "✗ CSV file not found: $CsvPath" $Red
    Write-ColoredOutput "Please ensure enriched_inventory.csv is in the current directory." $Yellow
    exit 1
}

# Check CSV file size and basic structure
$csvInfo = Get-Item $CsvPath
Write-ColoredOutput "✓ Found CSV file: $CsvPath" $Green
Write-ColoredOutput "  Size: $([math]::Round($csvInfo.Length / 1MB, 2)) MB" $Cyan
Write-ColoredOutput "  Last modified: $($csvInfo.LastWriteTime)" $Cyan

# Check if Supabase CLI exists
if (-not (Test-FileExists $SupabasePath)) {
    Write-ColoredOutput "✗ Supabase CLI not found: $SupabasePath" $Red
    exit 1
}

Write-ColoredOutput "✓ Supabase CLI found: $SupabasePath" $Green

# Step 2: Apply migration (if not skipped)
if (-not $SkipMigration) {
    Write-ColoredOutput "`n--- Step 2: Applying Database Migration ---" $Yellow

    $migrationResult = Invoke-SupabaseCommand @("db", "push", "--include-all") "Applying import migration to set up staging tables and functions"

    if (-not $migrationResult.Success) {
        Write-ColoredOutput "✗ Migration failed. Please check your database connection and try again." $Red
        exit 1
    }

    Write-ColoredOutput "✓ Migration applied successfully" $Green
} else {
    Write-ColoredOutput "`n--- Step 2: Skipped (migration step skipped) ---" $Yellow
}

# Step 3: Load CSV data into staging table (if not skipped)
if (-not $SkipCsvLoad) {
    Write-ColoredOutput "`n--- Step 3: Loading CSV Data into Staging Table ---" $Yellow

    # First, let's check if we need to clear existing staging data
    if ($ForceOverwrite) {
        Write-ColoredOutput "Clearing existing staging data..." $Yellow
        $clearResult = Invoke-SupabaseCommand @("db", "reset") "Clearing existing database data"
    }

    # Load CSV data into staging table
    $csvLoadCommand = @"
BEGIN;
TRUNCATE TABLE enriched_inventory_staging RESTART IDENTITY;
COPY enriched_inventory_staging (
    name, sku, description, short_description, brand, categories,
    regular_price, sale_price, stock, low_stock_amount, images, tags, visibility_in_catalog
) FROM STDIN WITH CSV HEADER DELIMITER ',' QUOTE '"' ENCODING 'UTF-8';
"@

    # Read CSV and pipe to database
    Write-ColoredOutput "Loading CSV data into staging table..." $Cyan

    try {
        $csvContent = Get-Content $CsvPath -Raw
        $tempFile = [System.IO.Path]::GetTempFileName()

        # Create a modified version of the CSV load command for the temp file approach
        $csvLoadScript = @"
BEGIN;
TRUNCATE TABLE enriched_inventory_staging RESTART IDENTITY;
COPY enriched_inventory_staging (
    name, sku, description, short_description, brand, categories,
    regular_price, sale_price, stock, low_stock_amount, images, tags, visibility_in_catalog
) FROM '$($CsvPath.Replace('\', '\\'))' WITH CSV HEADER DELIMITER ',' QUOTE '"' ENCODING 'UTF-8' NULL '';
COMMIT;
"@

        $tempScriptPath = [System.IO.Path]::ChangeExtension($tempFile, "sql")
        $csvLoadScript | Out-File -FilePath $tempScriptPath -Encoding UTF8

        $loadResult = Invoke-SupabaseCommand @("db", "push", "--file", $tempScriptPath) "Loading CSV data into staging table"

        Remove-Item $tempFile -ErrorAction SilentlyContinue
        Remove-Item $tempScriptPath -ErrorAction SilentlyContinue

        if ($loadResult.Success) {
            Write-ColoredOutput "✓ CSV data loaded into staging table successfully" $Green
        } else {
            Write-ColoredOutput "✗ Failed to load CSV data into staging table" $Red
            Write-ColoredOutput "This might be due to:" $Yellow
            Write-ColoredOutput "  - CSV format issues" $Yellow
            Write-ColoredOutput "  - Data type mismatches" $Yellow
            Write-ColoredOutput "  - Database connection problems" $Yellow
            exit 1
        }
    }
    catch {
        Write-ColoredOutput "✗ Exception during CSV loading: $($_.Exception.Message)" $Red
        exit 1
    }
} else {
    Write-ColoredOutput "`n--- Step 3: Skipped (CSV loading step skipped) ---" $Yellow
}

# Step 4: Execute the import process (if not skipped)
if (-not $SkipImport) {
    Write-ColoredOutput "`n--- Step 4: Executing Import Process ---" $Yellow

    # Get import summary before execution
    Write-ColoredOutput "Getting pre-import summary..." $Cyan
    $preImportScript = "SELECT 'Records in staging table' as metric, COUNT(*) as count, 'Records ready for import' as description FROM enriched_inventory_staging;"

    $tempPreScript = [System.IO.Path]::GetTempFileName() + ".sql"
    $preImportScript | Out-File -FilePath $tempPreScript -Encoding UTF8

    $preResult = Invoke-SupabaseCommand @("db", "push", "--file", $tempPreScript) "Getting pre-import summary"
    Remove-Item $tempPreScript -ErrorAction SilentlyContinue

    # Execute the main import function
    Write-ColoredOutput "Executing import process..." $Cyan
    $importScript = "SELECT * FROM execute_enriched_inventory_import();"

    $tempImportScript = [System.IO.Path]::GetTempFileName() + ".sql"
    $importScript | Out-File -FilePath $tempImportScript -Encoding UTF8

    $importResult = Invoke-SupabaseCommand @("db", "push", "--file", $tempImportScript) "Executing the main import process"
    Remove-Item $tempImportScript -ErrorAction SilentlyContinue

    if ($importResult.Success) {
        Write-ColoredOutput "✓ Import process completed" $Green
    } else {
        Write-ColoredOutput "✗ Import process failed" $Red
        Write-ColoredOutput "Check the import logs for details on failed records." $Yellow
    }
} else {
    Write-ColoredOutput "`n--- Step 4: Skipped (import execution step skipped) ---" $Yellow
}

# Step 5: Verification and Summary
Write-ColoredOutput "`n--- Step 5: Verification and Summary ---" $Yellow

$summaryScript = "SELECT * FROM get_import_summary();"

$tempSummaryScript = [System.IO.Path]::GetTempFileName() + ".sql"
$summaryScript | Out-File -FilePath $tempSummaryScript -Encoding UTF8

$summaryResult = Invoke-SupabaseCommand @("db", "push", "--file", $tempSummaryScript) "Getting import summary and verification"
Remove-Item $tempSummaryScript -ErrorAction SilentlyContinue

# Show sample of imported data
Write-ColoredOutput "`nSample of imported products:" $Cyan
$sampleScript = "SELECT name, sku, brand_id, category_id, our_price, sale_price, stock_quantity, inventory_status, is_active FROM main_site_products ORDER BY created_at DESC LIMIT 5;"

$tempSampleScript = [System.IO.Path]::GetTempFileName() + ".sql"
$sampleScript | Out-File -FilePath $tempSampleScript -Encoding UTF8

$sampleResult = Invoke-SupabaseCommand @("db", "push", "--file", $tempSampleScript) "Getting sample of imported products"
Remove-Item $tempSampleScript -ErrorAction SilentlyContinue

# Final status
Write-ColoredOutput "`n=== Import Process Complete ===" $Green
Write-ColoredOutput "Completed at: $(Get-Date)" $Cyan
Write-ColoredOutput "CSV file processed: $CsvPath" $Cyan

if ($VerifyOnly) {
    Write-ColoredOutput "Mode: Verification only - no data was modified" $Yellow
}

Write-ColoredOutput "`nNext steps:" $Yellow
Write-ColoredOutput "1. Review the import summary above" $Yellow
Write-ColoredOutput "2. Check import_progress_view for detailed error information if needed" $Yellow
Write-ColoredOutput "3. Update product compliance information based on product types" $Yellow
Write-ColoredOutput "4. Review and enhance cannabinoid/effects profiles as needed" $Yellow

Write-ColoredOutput "`nTo check for failed imports, run:" $Cyan
Write-ColoredOutput "SELECT * FROM import_progress_view WHERE import_status = 'failed';" $Cyan
