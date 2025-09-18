# PowerShell script to run Supabase migration
param(
    [string]$EnvFile = ".env.local"
)

Write-Host "🚀 Running DopeDeals Database Migration..." -ForegroundColor Green

# Load environment variables from .env.local
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✅ Loaded environment variables from $EnvFile" -ForegroundColor Green
} else {
    Write-Host "❌ Environment file $EnvFile not found!" -ForegroundColor Red
    exit 1
}

# Get Supabase credentials
$SUPABASE_URL = [Environment]::GetEnvironmentVariable("SUPABASE_URL")
$SERVICE_ROLE_KEY = [Environment]::GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY")

if (-not $SUPABASE_URL -or -not $SERVICE_ROLE_KEY) {
    Write-Host "❌ Missing Supabase environment variables!" -ForegroundColor Red
    exit 1
}

# Read migration file
$migrationPath = "supabase/migrations/2025-09-17_cart_orders_system.sql"
if (-not (Test-Path $migrationPath)) {
    Write-Host "❌ Migration file not found: $migrationPath" -ForegroundColor Red
    exit 1
}

$migrationSQL = Get-Content $migrationPath -Raw
Write-Host "📁 Migration file loaded: $migrationPath" -ForegroundColor Cyan

# Split SQL into individual statements (simple approach)
$statements = $migrationSQL -split ";\s*\n" | Where-Object { $_.Trim() -ne "" }

Write-Host "📊 Found $($statements.Count) SQL statements to execute" -ForegroundColor Cyan

# Execute each statement
$successCount = 0
$errorCount = 0

foreach ($statement in $statements) {
    $cleanStatement = $statement.Trim()
    if ($cleanStatement -eq "" -or $cleanStatement.StartsWith("--")) {
        continue
    }
    
    try {
        Write-Host "⚡ Executing: $($cleanStatement.Substring(0, [Math]::Min(50, $cleanStatement.Length)))..." -ForegroundColor Yellow
        
        $body = @{
            query = $cleanStatement
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method POST -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $SERVICE_ROLE_KEY"
            "apikey" = $SERVICE_ROLE_KEY
        } -Body $body -ErrorAction Stop
        
        $successCount++
        Write-Host "✅ Success" -ForegroundColor Green
        
    } catch {
        $errorCount++
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        
        # Continue with other statements even if one fails
    }
}

Write-Host "`n📊 Migration Summary:" -ForegroundColor Cyan
Write-Host "✅ Successful statements: $successCount" -ForegroundColor Green
Write-Host "❌ Failed statements: $errorCount" -ForegroundColor Red

if ($errorCount -eq 0) {
    Write-Host "`n🎉 Migration completed successfully!" -ForegroundColor Green
    Write-Host "Your cart and orders system is ready to use!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Migration completed with some errors." -ForegroundColor Yellow
    Write-Host "Please check the errors above and run individual statements if needed." -ForegroundColor Yellow
}
