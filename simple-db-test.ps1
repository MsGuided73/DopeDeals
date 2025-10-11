# Simple Supabase Connection Test
Write-Host "🔄 Testing Supabase connection..." -ForegroundColor Yellow

# Load .env.local file
$envContent = Get-Content .env.local -Raw

# Extract credentials
foreach ($line in ($envContent -split "`n")) {
    if ($line -match "NEXT_PUBLIC_SUPABASE_URL=(.+)") {
        $supabaseUrl = $matches[1]
    }
    if ($line -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)") {
        $supabaseKey = $matches[1]
    }
}

Write-Host "📍 URL: $supabaseUrl" -ForegroundColor Cyan
Write-Host "🔑 Key: $($supabaseKey.Substring(0, 20))..." -ForegroundColor Cyan

# Test connection
$testUrl = "$supabaseUrl/rest/v1/products?select=count&limit=1"

$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "✅ SUCCESS: Database connection working!" -ForegroundColor Green
    Write-Host "📊 Found $($response.count) products" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red

    if ($_.Exception.Message -like "*404*") {
        Write-Host "💡 Issue: Products table doesn't exist" -ForegroundColor Yellow
        Write-Host "   Solution: Need to create/run migrations" -ForegroundColor Yellow
    }
    elseif ($_.Exception.Message -like "*401*") {
        Write-Host "💡 Issue: Authentication failed" -ForegroundColor Yellow
        Write-Host "   Solution: Check API key" -ForegroundColor Yellow
    }
    elseif ($_.Exception.Message -like "*timeout*") {
        Write-Host "💡 Issue: Network timeout" -ForegroundColor Yellow
        Write-Host "   Solution: Check internet connection" -ForegroundColor Yellow
    }

    exit 1
}
