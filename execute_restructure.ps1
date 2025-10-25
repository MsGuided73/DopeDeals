# Execute Dope City Database Restructure
# This script runs the database restructure SQL against Supabase

Write-Host "🚀 Starting Dope City Database Restructure..." -ForegroundColor Green

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "run_database_restructure.sql")) {
    Write-Error "run_database_restructure.sql not found in current directory"
    exit 1
}

Write-Host "📋 Step 1: Creating main site and tobacco site product tables..." -ForegroundColor Yellow

# Read and execute the SQL file
$sqlContent = Get-Content "run_database_restructure.sql" -Raw

Write-Host "✅ Database restructure script created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Connect to your Supabase dashboard" -ForegroundColor White
Write-Host "2. Go to SQL Editor" -ForegroundColor White
Write-Host "3. Copy and paste the contents of run_database_restructure.sql" -ForegroundColor White
Write-Host "4. Execute the script" -ForegroundColor White
Write-Host ""
Write-Host "🎯 This will create:" -ForegroundColor Green
Write-Host "  - main_site_products table (non-nicotine products)" -ForegroundColor White
Write-Host "  - tobacco_site_products table (nicotine products)" -ForegroundColor White
Write-Host "  - Compatibility views for existing code" -ForegroundColor White
Write-Host "  - Row Level Security policies" -ForegroundColor White
Write-Host "  - Performance indexes" -ForegroundColor White
Write-Host ""
Write-Host "📊 Verification queries are included at the end of the script" -ForegroundColor Yellow

# Show the file contents for easy copying
Write-Host ""
Write-Host "📄 SQL Script Preview:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host $sqlContent.Substring(0, [Math]::Min(500, $sqlContent.Length)) -ForegroundColor Gray
if ($sqlContent.Length -gt 500) {
    Write-Host "..." -ForegroundColor Gray
}
Write-Host "----------------------------------------" -ForegroundColor Gray
