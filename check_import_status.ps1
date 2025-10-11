# Simple script to check import status using PowerShell and psql
# This will connect to the database and run our status check

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

# Load environment variables from .env file if not already set
if (-not $DatabaseUrl) {
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
        $DatabaseUrl = $env:DATABASE_URL
    }
}

# Check if database URL is available
if (-not $DatabaseUrl) {
    Write-Host "Database URL not found. Please set DATABASE_URL in .env file." -ForegroundColor Red
    exit 1
}

Write-Host "=== Checking Enriched Inventory Import Status ===" -ForegroundColor Green
Write-Host "Database: $DatabaseUrl" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psqlAvailable = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlAvailable) {
    Write-Host "psql not found. Please install PostgreSQL client tools." -ForegroundColor Red
    Write-Host "You can install it from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== 1. STAGING TABLE STATUS ===" -ForegroundColor Yellow
try {
    $query1 = "SELECT COUNT(*) as total_records, COUNT(CASE WHEN import_status = 'pending' THEN 1 END) as pending_records, COUNT(CASE WHEN import_status = 'completed' THEN 1 END) as completed_records, COUNT(CASE WHEN import_status = 'failed' THEN 1 END) as failed_records FROM enriched_inventory_staging;"
    Write-Host "Running: $query1" -ForegroundColor Gray
    $result1 = & psql $DatabaseUrl -c $query1 -t
    Write-Host $result1 -ForegroundColor White
} catch {
    Write-Host "Error checking staging table: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 2. SAMPLE DATA ===" -ForegroundColor Yellow
try {
    $query2 = "SELECT import_row_number, `"Name`" as product_name, `"SKU`" as sku, `"Brands`" as brand, `"Categories`" as categories, `"Regular price`" as regular_price, `"Stock`" as stock_quantity, import_status FROM enriched_inventory_staging ORDER BY import_row_number LIMIT 5;"
    Write-Host "Running: SELECT ... FROM enriched_inventory_staging LIMIT 5" -ForegroundColor Gray
    $result2 = & psql $DatabaseUrl -c $query2
    Write-Host $result2 -ForegroundColor White
} catch {
    Write-Host "Error getting sample data: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 3. VALIDATION RESULTS ===" -ForegroundColor Yellow
try {
    $query3 = "SELECT COUNT(*) as total_validated, COUNT(CASE WHEN validation_error IS NULL THEN 1 END) as valid_records, COUNT(CASE WHEN validation_error IS NOT NULL THEN 1 END) as invalid_records FROM validate_enriched_staging_data();"
    Write-Host "Running: SELECT COUNT(*) FROM validate_enriched_staging_data()" -ForegroundColor Gray
    $result3 = & psql $DatabaseUrl -c $query3 -t
    Write-Host $result3 -ForegroundColor White
} catch {
    Write-Host "Error running validation: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 4. MAIN PRODUCTS TABLE ===" -ForegroundColor Yellow
try {
    $query4 = "SELECT COUNT(*) as total_products, COUNT(CASE WHEN is_active THEN 1 END) as active_products FROM main_site_products;"
    Write-Host "Running: $query4" -ForegroundColor Gray
    $result4 = & psql $DatabaseUrl -c $query4 -t
    Write-Host $result4 -ForegroundColor White
} catch {
    Write-Host "Error checking main products table: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 5. VALIDATION ERRORS (if any) ===" -ForegroundColor Yellow
try {
    $query5 = "SELECT import_row_number, `"Name`" as product_name, `"SKU`" as sku, validation_error FROM validate_enriched_staging_data() WHERE validation_error IS NOT NULL ORDER BY import_row_number LIMIT 10;"
    Write-Host "Running: SELECT validation errors (LIMIT 10)" -ForegroundColor Gray
    $result5 = & psql $DatabaseUrl -c $query5
    Write-Host $result5 -ForegroundColor White
} catch {
    Write-Host "Error checking validation errors: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Green
Write-Host "✓ Staging table status checked" -ForegroundColor Green
Write-Host "✓ Sample data reviewed" -ForegroundColor Green
Write-Host "✓ Validation results obtained" -ForegroundColor Green
Write-Host "✓ Main products table status checked" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. If validation shows no errors, run the import process" -ForegroundColor White
Write-Host "2. Use execute_enriched_inventory_import() function to move data" -ForegroundColor White
Write-Host "3. Check final results with get_import_summary()" -ForegroundColor White
