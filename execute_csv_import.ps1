# Execute Dope City CSV Import
# This script helps you import the enriched inventory CSV into your database

Write-Host "Starting Dope City CSV Import Process..." -ForegroundColor Green

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "csv_to_database_mapping.sql")) {
Write-Host "ERROR: csv_to_database_mapping.sql not found in current directory" -ForegroundColor Red
    Write-Host "   Make sure you're running this from the Highway420 directory" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "enriched_inventory.csv")) {
    Write-Host "ERROR: enriched_inventory.csv not found in current directory" -ForegroundColor Red
    Write-Host "   The CSV file should be downloaded first" -ForegroundColor Yellow
    exit 1
}

Write-Host "SUCCESS: Both SQL mapping script and CSV file found!" -ForegroundColor Green
Write-Host ""
Write-Host "CSV Import Process:" -ForegroundColor Cyan
Write-Host "1. Connect to your Supabase dashboard" -ForegroundColor White
Write-Host "2. Go to SQL Editor" -ForegroundColor White
Write-Host "3. Copy and paste the contents of csv_to_database_mapping.sql" -ForegroundColor White
Write-Host "4. Execute the script (this sets up the import functions)" -ForegroundColor White
Write-Host "5. Use pgAdmin or DBeaver to import the CSV file into temp_csv_import table" -ForegroundColor White
Write-Host "6. Run: SELECT * FROM import_enriched_inventory()" -ForegroundColor White
Write-Host "7. Run: SELECT * FROM verify_csv_import()" -ForegroundColor White
Write-Host ""
Write-Host "This import process will:" -ForegroundColor Green
Write-Host "  - Map WooCommerce CSV columns to your new database schema" -ForegroundColor White
Write-Host "  - Handle product categories, brands, pricing, and inventory" -ForegroundColor White
Write-Host "  - Process product attributes, specifications, and dimensions" -ForegroundColor White
Write-Host "  - Import product images and descriptions" -ForegroundColor White
Write-Host "  - Skip nicotine products (for main site)" -ForegroundColor White
Write-Host ""
Write-Host "CSV Analysis:" -ForegroundColor Yellow
$csvContent = Get-Content "enriched_inventory.csv"
$totalLines = $csvContent.Count
$headerLine = $csvContent[0]
$headerColumns = $headerLine.Split(',').Count
Write-Host "  - Total rows: $($totalLines - 1) products" -ForegroundColor White
Write-Host "  - Columns per product: $headerColumns" -ForegroundColor White
Write-Host "  - File size: $([math]::Round((Get-Item enriched_inventory.csv).Length / 1MB, 2)) MB" -ForegroundColor White

# Show column mapping preview
Write-Host ""
Write-Host "Column Mapping Preview:" -ForegroundColor Cyan
Write-Host "  CSV Column → Database Field" -ForegroundColor White
Write-Host "  SKU → sku" -ForegroundColor Gray
Write-Host "  Name → name" -ForegroundColor Gray
Write-Host "  Description → description" -ForegroundColor Gray
Write-Host "  Regular price → price" -ForegroundColor Gray
Write-Host "  Sale price → compare_at_price" -ForegroundColor Gray
Write-Host "  Categories → category_id" -ForegroundColor Gray
Write-Host "  Brands → brand_id" -ForegroundColor Gray
Write-Host "  Stock → stock_quantity" -ForegroundColor Gray
Write-Host "  Images → image_url, image_urls" -ForegroundColor Gray
Write-Host "  Weight (lbs) → weight" -ForegroundColor Gray
Write-Host "  Attributes → attributes (JSONB)" -ForegroundColor Gray
Write-Host "  Tags → tags (array)" -ForegroundColor Gray

Write-Host ""
Write-Host "Tip: Copy the entire contents of csv_to_database_mapping.sql" -ForegroundColor Yellow
Write-Host "   The file contains the complete import functions and mapping logic" -ForegroundColor Yellow

# Ask if they want to see the full SQL script
$showFull = Read-Host "Would you like to see the full SQL script? (y/N)"
if ($showFull -eq 'y' -or $showFull -eq 'Y') {
    Write-Host ""
Write-Host "FULL SQL Script:" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    $sqlContent = Get-Content "csv_to_database_mapping.sql" -Raw
    Write-Host $sqlContent -ForegroundColor Gray
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Ready to import your enriched inventory data!" -ForegroundColor Green
