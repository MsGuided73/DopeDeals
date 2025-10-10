# Execute Dope City Direct CSV Import to Products Table
# This script runs the direct import script that imports CSV data straight into main_site_products

Write-Host "🚀 Starting Direct CSV Import to main_site_products table..." -ForegroundColor Green

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "scripts/csv-import-direct-to-products.js")) {
    Write-Host "❌ scripts/csv-import-direct-to-products.js not found in current directory" -ForegroundColor Red
    Write-Host "   Make sure you're running this from the DopeDeals directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Direct import script found!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Direct Import Process:" -ForegroundColor Cyan
Write-Host "1. This script imports CSV data directly into main_site_products table" -ForegroundColor White
Write-Host "2. No staging table - data goes straight to production" -ForegroundColor White
Write-Host "3. Includes JSONB fields for cannabinoids, effects, and terpenes" -ForegroundColor White
Write-Host "4. Handles all product attributes and compliance fields" -ForegroundColor White
Write-Host "5. Validates data before import" -ForegroundColor White
Write-Host ""
Write-Host "🎯 This import will:" -ForegroundColor Green
Write-Host "  - Import products directly to main_site_products table" -ForegroundColor White
Write-Host "  - Set up cannabinoid profiles (THC, CBD, etc.)" -ForegroundColor White
Write-Host "  - Configure effects profiles (relaxed, euphoric, etc.)" -ForegroundColor White
Write-Host "  - Set terpene profiles for aroma and effects" -ForegroundColor White
Write-Host "  - Handle psychoactive compound tracking" -ForegroundColor White
Write-Host "  - Ensure Farm Bill compliance flags" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  WARNING: This imports directly to production table!" -ForegroundColor Red
Write-Host "   Make sure your CSV data is clean and ready for production" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Expected JSONB Structure:" -ForegroundColor Yellow
Write-Host "  Cannabinoid Profile: THC variants, CBD, CBG, etc." -ForegroundColor Gray
Write-Host "  Effects Profile: Primary/secondary effects, benefits" -ForegroundColor Gray
Write-Host "  Terpene Profile: Aroma notes and effects influence" -ForegroundColor Gray
Write-Host "  Psychoactive Profile: 7-Hydroxy, Mitragynine, etc." -ForegroundColor Gray

# Check if CSV file exists
if (Test-Path "enriched_inventory.csv") {
    Write-Host ""
    Write-Host "📄 CSV File Analysis:" -ForegroundColor Cyan
    $csvContent = Get-Content "enriched_inventory.csv"
    $totalLines = $csvContent.Count
    $headerLine = $csvContent[0]
    $headerColumns = $headerLine.Split(',').Count
    Write-Host "  - Total rows: $($totalLines - 1) products" -ForegroundColor White
    Write-Host "  - Columns per product: $headerColumns" -ForegroundColor White
    Write-Host "  - File size: $([math]::Round((Get-Item enriched_inventory.csv).Length / 1MB, 2)) MB" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  Warning: enriched_inventory.csv not found in root directory" -ForegroundColor Yellow
    Write-Host "   The script will still run but may not find data to import" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Script Configuration:" -ForegroundColor Cyan
Write-Host "  - Batch Size: 100 products per batch" -ForegroundColor White
Write-Host "  - Rate Limiting: 100ms delay between batches" -ForegroundColor White
Write-Host "  - Error Handling: Stops on first error with details" -ForegroundColor White
Write-Host "  - Validation: Filters out empty/invalid products" -ForegroundColor White

# Ask if they want to run the import
$runImport = Read-Host "`nWould you like to run the direct import now? (y/N)"
if ($runImport -ne 'y' -and $runImport -ne 'Y') {
    Write-Host "Import cancelled. Run this script again when ready." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🎬 Starting import..." -ForegroundColor Green

try {
    # Run the Node.js import script
    node scripts/csv-import-direct-to-products.js
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "🎉 Direct import completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "✨ Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Verify products in Supabase dashboard" -ForegroundColor White
        Write-Host "2. Check cannabinoid and effects data" -ForegroundColor White
        Write-Host "3. Test search and filtering functionality" -ForegroundColor White
        Write-Host "4. Validate compliance flags are set correctly" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Import failed with exit code: $exitCode" -ForegroundColor Red
        Write-Host "   Check the error messages above for details" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ Import failed with error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
