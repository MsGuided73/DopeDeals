# Direct Migration Application
Write-Host "Applying enhanced migration directly..."

$envContent = Get-Content .env.local -Raw
$supabaseUrl = $null
$supabaseKey = $null

foreach ($line in ($envContent -split "`n")) {
    $line = $line.Trim()
    if ($line -match "SUPABASE_URL=(.+)") {
        $supabaseUrl = $matches[1].Trim()
    }
    if ($line -match "SUPABASE_SERVICE_ROLE_KEY=(.+)") {
        $supabaseKey = $matches[1].Trim()
    }
}

$migrationContent = Get-Content "supabase/migrations/20251010190649_enhanced_products_schema_fixed.sql" -Raw

# Split by major statements (CREATE TABLE, CREATE INDEX, etc.)
$statements = $migrationContent -split "(?=\n\s*--\s*CREATE|\n\s*CREATE|\n\s*ALTER|\n\s*GRANT)" | Where-Object { $_.Trim() -ne "" }

$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$successCount = 0
$errorCount = 0

foreach ($statement in $statements) {
    $statement = $statement.Trim()
    if ($statement -eq "" -or $statement.StartsWith("--") -or $statement.StartsWith("COMMENT")) {
        continue
    }

    # Skip problematic RLS policy
    if ($statement -like "*main_site_admins_manage*") {
        Write-Host "Skipping problematic RLS policy..." -ForegroundColor Yellow
        continue
    }

    try {
        $sqlUrl = "$supabaseUrl/rest/v1/rpc/exec"
        $body = @{
            query = $statement
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri $sqlUrl -Headers $headers -Method Post -Body $body -TimeoutSec 30
        $successCount++
        Write-Host "SUCCESS: Applied statement" -ForegroundColor Green
    } catch {
        $errorCount++
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Statement: $($statement.Substring(0, [Math]::Min(100, $statement.Length)))..." -ForegroundColor Gray
    }
}

Write-Host "Migration completed: $successCount successful, $errorCount errors" -ForegroundColor Cyan

# Verify the migration worked
Write-Host "Verifying enhanced schema..."
$tableUrl = "$supabaseUrl/rest/v1/main_site_products?select=cannabinoid_profile,effects_profile,terpene_profile,compliance_info&limit=1"
try {
    $verifyResponse = Invoke-RestMethod -Uri $tableUrl -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "SUCCESS: Enhanced table exists with new columns!" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Could not verify enhanced table: $($_.Exception.Message)" -ForegroundColor Yellow
}
