# Execute Dope City Categories Restructure
# This script helps you execute the categories restructure SQL against Supabase

Write-Host "🚀 Starting Dope City Categories Restructure..." -ForegroundColor Green

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "clear_and_recreate_categories.sql")) {
    Write-Host "❌ clear_and_recreate_categories.sql not found in current directory" -ForegroundColor Red
    Write-Host "   Make sure you're running this from the DopeDeals directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Categories restructure script found!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Connect to your Supabase dashboard" -ForegroundColor White
Write-Host "2. Go to SQL Editor" -ForegroundColor White
Write-Host "3. Copy and paste the contents of clear_and_recreate_categories.sql" -ForegroundColor White
Write-Host "4. Execute the script" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  WARNING: This will DELETE all existing categories!" -ForegroundColor Red
Write-Host "   Make sure you want to clear your current categories first" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 This script will create:" -ForegroundColor Green
Write-Host "  - 7 Main Categories - THCA and More, Glass Pieces, Dab Rigs, etc." -ForegroundColor White
Write-Host "  - 25+ Subcategories - THCA Flower, Bongs, Vaporizers, etc." -ForegroundColor White
Write-Host "  - 3 Bong Types" -ForegroundColor White
Write-Host "  - Complete hierarchical structure" -ForegroundColor White
Write-Host ""
Write-Host "📊 Verification queries are included at the end" -ForegroundColor Yellow

# Show the file contents for easy copying
Write-Host ""
Write-Host "📄 SQL Script Preview (First 300 chars):" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
$sqlContent = Get-Content "clear_and_recreate_categories.sql" -Raw
Write-Host $sqlContent.Substring(0, [Math]::Min(300, $sqlContent.Length)) -ForegroundColor Gray
Write-Host "..." -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tip: Copy the entire contents of clear_and_recreate_categories.sql" -ForegroundColor Yellow
Write-Host "   The file contains the complete script with all categories" -ForegroundColor Yellow

# Ask if they want to see the full script
$showFull = Read-Host "Would you like to see the full SQL script? (y/N)"
if ($showFull -eq 'y' -or $showFull -eq 'Y') {
    Write-Host ""
    Write-Host "📄 FULL SQL Script:" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host $sqlContent -ForegroundColor Gray
    Write-Host "----------------------------------------" -ForegroundColor Gray
}
