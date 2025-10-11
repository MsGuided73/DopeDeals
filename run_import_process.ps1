# Script to run the import process using Supabase CLI
# This will execute the import functions to move data from staging to main products table

param(
    [switch]$ValidateOnly,
    [switch]$ImportOnly,
    [switch]$VerifyOnly
)

# Load environment variables from .env file
if (Test-Path ".env") {
    Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan
    $envContent = Get-Content ".env" -Raw
    $envContent -split "`n" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace '^"(.*)"$', '$1' -replace "^'(.*)'$", '$1'
            [Environment]::SetEnvironmentVariable($key, $value)
        }
    }
}

Write-Host "=== Enriched Inventory Import Process ===" -ForegroundColor Green
Write-Host "Starting at: $(Get-Date)" -ForegroundColor Cyan

# Check if Supabase CLI exists
if (-not (Test-Path ".\supabase.exe")) {
    Write-Host "Supabase CLI not found. Please ensure supabase.exe is in the current directory." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Supabase CLI found" -ForegroundColor Green

# Step 1: Check current status
if (-not $ImportOnly) {
    Write-Host ""
    Write-Host "=== STEP 1: CURRENT STATUS ===" -ForegroundColor Yellow

    $statusScript = "SELECT 'Staging table records' as metric, COUNT(*) as count FROM enriched_inventory_staging UNION ALL SELECT 'Pending records' as metric, COUNT(*) as count FROM enriched_inventory_staging WHERE import_status = 'pending' UNION ALL SELECT 'Products in main table' as metric, COUNT(*) as count FROM main_site_products;"

    $tempStatusFile = [System.IO.Path]::GetTempFileName() + ".sql"
    $statusScript | Out-File -FilePath $tempStatusFile -Encoding UTF8

    try {
        $statusResult = & .\supabase.exe db push --file $tempStatusFile 2>&1
        Write-Host $statusResult -ForegroundColor White
    } catch {
        Write-Host "Error checking status: $($_.Exception.Message)" -ForegroundColor Red
    }

    Remove-Item $tempStatusFile -ErrorAction SilentlyContinue
}

# Step 2: Validate data (if not ImportOnly)
if (-not $ImportOnly -and -not $VerifyOnly) {
    Write-Host ""
    Write-Host "=== STEP 2: VALIDATING DATA ===" -ForegroundColor Yellow

    $validationScript = "SELECT 'Total records validated' as metric, COUNT(*) as count FROM validate_enriched_staging_data() UNION ALL SELECT 'Valid records' as metric, COUNT(*) as count FROM validate_enriched_staging_data() WHERE validation_error IS NULL UNION ALL SELECT 'Invalid records' as metric, COUNT(*) as count FROM validate_enriched_staging_data() WHERE validation_error IS NOT NULL;"

    $tempValidationFile = [System.IO.Path]::GetTempFileName() + ".sql"
    $validationScript | Out-File -FilePath $tempValidationFile -Encoding UTF8

    try {
        $validationResult = & .\supabase.exe db push --file $tempValidationFile 2>&1
        Write-Host $validationResult -ForegroundColor White
    } catch {
        Write-Host "Error during validation: $($_.Exception.Message)" -ForegroundColor Red
    }

    Remove-Item $tempValidationFile -ErrorAction SilentlyContinue

    # Show validation errors if any
    Write-Host ""
    Write-Host "Validation errors (first 10):" -ForegroundColor Cyan

    $errorScript = "SELECT import_row_number, `"Name`" as product_name, `"SKU`" as sku, validation_error FROM validate_enriched_staging_data() WHERE validation_error IS NOT NULL ORDER BY import_row_number LIMIT 10;"

    $tempErrorFile = [System.IO.Path]::GetTempFileName() + ".sql"
    $errorScript | Out-File -FilePath $tempErrorFile -Encoding UTF8

    try {
        $errorResult = & .\supabase.exe db push --file $tempErrorFile 2>&1
        Write-Host $errorResult -ForegroundColor White
    } catch {
        Write-Host "Error checking validation errors: $($_.Exception.Message)" -ForegroundColor Red
    }

    Remove-Item $tempErrorFile -ErrorAction SilentlyContinue
}

# Step 3: Execute import (if not ValidateOnly and not VerifyOnly)
if (-not $ValidateOnly -and -not $VerifyOnly) {
    Write-Host ""
    Write-Host "=== STEP 3: EXECUTING IMPORT ===" -ForegroundColor Yellow

    $importScript = "SELECT * FROM execute_enriched_inventory_import();"

    $tempImportFile = [System.IO.Path]::GetTempFileName() + ".sql"
    $importScript | Out-File -FilePath $tempImportFile -Encoding UTF8

    try {
        Write-Host "Executing import process..." -ForegroundColor Cyan
        $importResult = & .\supabase.exe db push --file $tempImportFile 2>&1
        Write-Host $importResult -ForegroundColor White

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Import completed successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Import failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error during import: $($_.Exception.Message)" -ForegroundColor Red
    }

    Remove-Item $tempImportFile -ErrorAction SilentlyContinue
}

# Step 4: Verify results
Write-Host ""
Write-Host "=== STEP 4: VERIFICATION ===" -ForegroundColor Yellow

$verifyScript = "SELECT 'Records in staging' as metric, COUNT(*) as count FROM enriched_inventory_staging UNION ALL SELECT 'Successfully imported' as metric, COUNT(*) as count FROM enriched_inventory_staging WHERE import_status = 'completed' UNION ALL SELECT 'Failed imports' as metric, COUNT(*) as count FROM enriched_inventory_staging WHERE import_status = 'failed' UNION ALL SELECT 'Products in main table' as metric, COUNT(*) as count FROM main_site_products UNION ALL SELECT 'Active products' as metric, COUNT(*) as count FROM main_site_products WHERE is_active = true;"

$tempVerifyFile = [System.IO.Path]::GetTempFileName() + ".sql"
$verifyScript | Out-File -FilePath $tempVerifyFile -Encoding UTF8

try {
    $verifyResult = & .\supabase.exe db push --file $tempVerifyFile 2>&1
    Write-Host $verifyResult -ForegroundColor White
} catch {
    Write-Host "Error during verification: $($_.Exception.Message)" -ForegroundColor Red
}

Remove-Item $tempVerifyFile -ErrorAction SilentlyContinue

# Show sample of imported products
Write-Host ""
Write-Host "Sample of recently imported products:" -ForegroundColor Cyan

$sampleScript = "SELECT name, sku, brand_id, category_id, our_price, sale_price, stock_quantity, inventory_status, is_active, created_at FROM main_site_products ORDER BY created_at DESC LIMIT 5;"

$tempSampleFile = [System.IO.Path]::GetTempFileName() + ".sql"
$sampleScript | Out-File -FilePath $tempSampleFile -Encoding UTF8

try {
    $sampleResult = & .\supabase.exe db push --file $tempSampleFile 2>&1
    Write-Host $sampleResult -ForegroundColor White
} catch {
    Write-Host "Error getting sample products: $($_.Exception.Message)" -ForegroundColor Red
}

Remove-Item $tempSampleFile -ErrorAction SilentlyContinue

# Final summary
Write-Host ""
Write-Host "=== IMPORT PROCESS COMPLETE ===" -ForegroundColor Green
Write-Host "Completed at: $(Get-Date)" -ForegroundColor Cyan

if ($ValidateOnly) {
    Write-Host "Mode: Validation only - no data was imported" -ForegroundColor Yellow
}

if ($VerifyOnly) {
    Write-Host "Mode: Verification only - showing current status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the results above" -ForegroundColor White
Write-Host "2. If there are validation errors, fix them in the CSV and re-import" -ForegroundColor White
Write-Host "3. Update product compliance information based on product types" -ForegroundColor White
Write-Host "4. Review and enhance cannabinoid/effects profiles as needed" -ForegroundColor White

Write-Host ""
Write-Host "To check for failed imports:" -ForegroundColor Cyan
Write-Host "SELECT * FROM import_progress_view WHERE import_status = 'failed';" -ForegroundColor White
