# Simple schema check
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
        Write-Host "SUCCESS: Products table exists" -ForegroundColor Green
        Write-Host "Current product columns:" -ForegroundColor Cyan
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
            Write-Host "SUCCESS: Enhanced schema is already applied!" -ForegroundColor Green
        } else {
            Write-Host "ISSUE: Missing enhanced columns:" -ForegroundColor Red
            $missingColumns | ForEach-Object {
                Write-Host "   - $_" -ForegroundColor Red
            }
            Write-Host "SOLUTION: Need to apply enhanced migration" -ForegroundColor Yellow
        }
    } else {
        Write-Host "WARNING: Products table exists but is empty" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
