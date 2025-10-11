# Basic Supabase Connection Test
Write-Host "Testing Supabase connection..."

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

Write-Host "URL: $supabaseUrl"
Write-Host "Key: $($supabaseKey.Substring(0, 20))..."

$testUrl = "$supabaseUrl/rest/v1/products?select=count&limit=1"
$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "SUCCESS: Database connection working!"
    Write-Host "Found $($response.count) products"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"

    if ($_.Exception.Message -like "*404*") {
        Write-Host "Issue: Products table doesn't exist"
        Write-Host "Solution: Need to create/run migrations"
    } elseif ($_.Exception.Message -like "*401*") {
        Write-Host "Issue: Authentication failed"
        Write-Host "Solution: Check API key"
    } elseif ($_.Exception.Message -like "*timeout*") {
        Write-Host "Issue: Network timeout"
        Write-Host "Solution: Check internet connection"
    }
}
