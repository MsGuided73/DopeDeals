# Create brands_new table from SQL file
Write-Host "Creating brands_new table..."

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

Write-Host "Using service role key for admin operations..."

# Read the SQL file
$sqlContent = Get-Content "create_brands_structure.sql" -Raw

# Split into individual statements (basic approach)
$sqlStatements = $sqlContent -split ";"

$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

$successCount = 0
$errorCount = 0

foreach ($statement in $sqlStatements) {
    $statement = $statement.Trim()
    if ($statement -eq "" -or $statement.StartsWith("--")) {
        continue
    }

    try {
        $sqlUrl = "$supabaseUrl/rest/v1/rpc/execute_sql"
        $body = @{
            query = $statement
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri $sqlUrl -Headers $headers -Method Post -Body $body -TimeoutSec 30
        $successCount++
        Write-Host "SUCCESS: Executed statement" -ForegroundColor Green
    } catch {
        $errorCount++
        Write-Host "ERROR in statement: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Statement: $statement" -ForegroundColor Gray
    }
}

Write-Host "Brands table creation completed: $successCount successful, $errorCount errors" -ForegroundColor Cyan
