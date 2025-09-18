# PowerShell script to run the essential cart migration
Write-Host "🚀 Running DopeDeals Cart Migration..." -ForegroundColor Green

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✅ Loaded environment variables" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
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
$migrationPath = "scripts/essential-cart-migration.sql"
if (-not (Test-Path $migrationPath)) {
    Write-Host "❌ Migration file not found: $migrationPath" -ForegroundColor Red
    exit 1
}

$migrationSQL = Get-Content $migrationPath -Raw
Write-Host "📁 Migration file loaded: $migrationPath" -ForegroundColor Cyan

try {
    Write-Host "⚡ Executing migration..." -ForegroundColor Yellow
    
    # Use the REST API to execute SQL
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $SERVICE_ROLE_KEY"
        "apikey" = $SERVICE_ROLE_KEY
    }
    
    # Split into individual statements and execute them
    $statements = $migrationSQL -split ";\s*\n" | Where-Object { 
        $_.Trim() -ne "" -and -not $_.Trim().StartsWith("--") 
    }
    
    Write-Host "📊 Found $($statements.Count) SQL statements to execute" -ForegroundColor Cyan
    
    $successCount = 0
    $errorCount = 0
    
    foreach ($statement in $statements) {
        $cleanStatement = $statement.Trim()
        if ($cleanStatement -eq "") { continue }
        
        try {
            # For PostgreSQL, we need to use the PostgREST API differently
            # Let's try a direct approach using the SQL endpoint
            $body = @{
                query = $cleanStatement + ";"
            } | ConvertTo-Json -Depth 10
            
            $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body -ErrorAction Stop
            
            $successCount++
            Write-Host "✅ Executed: $($cleanStatement.Substring(0, [Math]::Min(60, $cleanStatement.Length)))..." -ForegroundColor Green
            
        } catch {
            $errorCount++
            Write-Host "❌ Error executing: $($cleanStatement.Substring(0, [Math]::Min(60, $cleanStatement.Length)))..." -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n📊 Migration Summary:" -ForegroundColor Cyan
    Write-Host "✅ Successful statements: $successCount" -ForegroundColor Green
    Write-Host "❌ Failed statements: $errorCount" -ForegroundColor Red
    
    if ($errorCount -eq 0) {
        Write-Host "`n🎉 Migration completed successfully!" -ForegroundColor Green
        Write-Host "Your cart system is ready to use!" -ForegroundColor Green
        
        # Test if tables were created
        Write-Host "`n🔍 Verifying tables..." -ForegroundColor Cyan
        try {
            $testResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/shopping_cart?limit=1" -Headers $headers
            Write-Host "✅ shopping_cart table verified" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ shopping_cart table verification failed" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "`n⚠️ Migration completed with some errors." -ForegroundColor Yellow
        Write-Host "Please check the errors above. You may need to run some statements manually." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Migration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
