# Test Supabase Connection Script
Write-Host "🔄 Testing Supabase connection..." -ForegroundColor Yellow

# Check if .env.local file exists (preferred)
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    Write-Host "📄 Using .env.local file" -ForegroundColor Cyan
} elseif (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    Write-Host "📄 Using .env file" -ForegroundColor Cyan
} else {
    Write-Host "❌ No .env or .env.local file found" -ForegroundColor Red
    exit 1
}
$supabaseUrl = $null
$supabaseKey = $null

# Extract Supabase credentials
foreach ($line in ($envContent -split "`n")) {
    if ($line -match "NEXT_PUBLIC_SUPABASE_URL=(.+)") {
        $supabaseUrl = $matches[1]
    }
    if ($line -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)") {
        $supabaseKey = $matches[1]
    }
}

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Missing Supabase credentials in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found Supabase credentials" -ForegroundColor Green

# Test connection using curl
$testUrl = "$supabaseUrl/rest/v1/products?select=count&limit=1"

try {
    $headers = @{
        "apikey" = $supabaseKey
        "Authorization" = "Bearer $supabaseKey"
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "✅ Supabase connection successful!" -ForegroundColor Green
    Write-Host "📊 Database is responding correctly" -ForegroundColor Cyan
    exit 0
}
catch {
    Write-Host "❌ Supabase connection failed:" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red

    # Check if it's a network/timeout issue
    if ($_.Exception.Message -like "*timeout*") {
        Write-Host "   This might be a network connectivity issue" -ForegroundColor Yellow
    }
    elseif ($_.Exception.Message -like "*404*") {
        Write-Host "   Products table might not exist or URL is incorrect" -ForegroundColor Yellow
    }
    elseif ($_.Exception.Message -like "*401*") {
        Write-Host "   Authentication failed - check API key" -ForegroundColor Yellow
    }

    exit 1
}
