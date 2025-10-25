# Verify Enhanced Schema
Write-Host "Verifying enhanced schema..."

$envContent = Get-Content .env.local -Raw
$supabaseUrl = $null
$supabaseKey = $null

foreach ($line in ($envContent -split "`n")) {
    $line = $line.Trim()
    if ($line -match "NEXT_PUBLIC_SUPABASE_URL=(.+)") {
        $supabaseUrl = $matches[1].Trim()
    }
    if ($line -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)") {
        $supabaseKey = $matches[1].Trim()
    }
}

# Test 1: Check if main_site_products table exists
$tableUrl = "$supabaseUrl/rest/v1/main_site_products?select=id,name,cannabinoid_profile&limit=1"
$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $tableUrl -Headers $headers -Method Get -TimeoutSec 10

    if ($response.Count -gt 0) {
        Write-Host "SUCCESS: Enhanced main_site_products table exists!" -ForegroundColor Green

        # Check if enhanced columns exist
        $sampleProduct = $response[0]
        $enhancedColumns = @("cannabinoid_profile", "effects_profile", "terpene_profile", "compliance_info")
        $foundColumns = @()

        foreach ($col in $enhancedColumns) {
            if ($sampleProduct.PSObject.Properties.Name -contains $col) {
                $foundColumns += $col
            }
        }

        Write-Host "Found enhanced columns: $($foundColumns -join ', ')" -ForegroundColor Cyan

        if ($foundColumns.Count -eq $enhancedColumns.Count) {
            Write-Host "PERFECT: All enhanced columns are present!" -ForegroundColor Green
            Write-Host "Database fix completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "PARTIAL: Some enhanced columns missing" -ForegroundColor Yellow
            Write-Host "Missing: $($enhancedColumns | Where-Object { $_ -notin $foundColumns } | Join-String -Separator ', ')" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ISSUE: main_site_products table exists but is empty" -ForegroundColor Yellow
    }
} catch {
    if ($_.Exception.Message -like "*404*") {
        Write-Host "ISSUE: main_site_products table does not exist" -ForegroundColor Red
        Write-Host "SOLUTION: Enhanced migration needs to be applied" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To apply manually:" -ForegroundColor Cyan
        Write-Host "1. Go to Supabase Dashboard" -ForegroundColor White
        Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
        Write-Host "3. Copy and paste the contents of:" -ForegroundColor White
        Write-Host "   supabase/migrations/20251010190649_enhanced_products_schema_fixed.sql" -ForegroundColor Gray
        Write-Host "4. Execute the SQL" -ForegroundColor White
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
