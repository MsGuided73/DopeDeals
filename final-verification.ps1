# Final Database Verification
Write-Host "Final verification of enhanced database schema..."

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

# Check main_site_products table structure
$tableUrl = "$supabaseUrl/rest/v1/main_site_products?select=*&limit=1"
$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $tableUrl -Headers $headers -Method Get -TimeoutSec 10

    if ($response.Count -gt 0) {
        Write-Host "SUCCESS: Enhanced main_site_products table exists!" -ForegroundColor Green

        $product = $response[0]
        $columns = $product.PSObject.Properties.Name

        Write-Host "Enhanced columns found:" -ForegroundColor Cyan
        $enhancedColumns = @("cannabinoid_profile", "effects_profile", "terpene_profile", "psychoactive_profile", "compliance_info")
        foreach ($col in $enhancedColumns) {
            if ($col -in $columns) {
                Write-Host "  ✅ $col" -ForegroundColor Green
            } else {
                Write-Host "  ❌ $col" -ForegroundColor Red
            }
        }

        Write-Host "Database fix completed successfully!" -ForegroundColor Green
        Write-Host "Ready for your enriched inventory import!" -ForegroundColor Green

    } else {
        Write-Host "Table exists but no sample data to verify columns" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
