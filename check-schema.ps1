# Check current database schema
Write-Host "Checking current database schema..."

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

# Check if products table exists and get its structure
$tableUrl = "$supabaseUrl/rest/v1/products?select=*&limit=1"

$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

try {
    $response = Invoke-RestMethod -Uri $tableUrl -Headers $headers -Method Get -TimeoutSec 10

    if ($response.Count -gt 0) {
        Write-Host "✅ Products table exists" -ForegroundColor Green
        Write-Host "📊 Current product columns:" -ForegroundColor Cyan
        $response[0].PSObject.Properties.Name | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor Gray
        }

        # Check if this is the enhanced schema
        $enhancedColumns = @("cannabinoid_profile", "effects_profile", "terpene_profile", "compliance_info", "zoho_item_id")
        $missingColumns = @()

        foreach ($col in $enhancedColumns) {
            if ($col -notin $response[0].PSObject.Properties.Name) {
                $missingColumns += $col
            }
        }

        if ($missingColumns.Count -eq 0) {
            Write-Host "✅ Enhanced schema is already applied!" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing enhanced columns:" -ForegroundColor Red
            $missingColumns | ForEach-Object {
                Write-Host "   - $_" -ForegroundColor Red
            }
            Write-Host "💡 Need to apply enhanced migration" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️ Products table exists but is empty" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error checking schema: $($_.Exception.Message)" -ForegroundColor Red
}
