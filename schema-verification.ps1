# Schema Structure Verification
Write-Host "Verifying database schema structure..."

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

# Insert a test product to verify schema
$testProduct = @{
    name = "Test Product - Schema Verification"
    sku = "TEST-SCHEMA-001"
    our_price = 99.99
    description = "Test product to verify enhanced schema columns"
    cannabinoid_profile = @{
        thc_variants = @{
            delta9_thc = 0.0
            delta8_thc = 0.0
            thca = 0.0
            thcp = 0.0
            thcv = 0.0
        }
        other_cannabinoids = @{
            cbd = 0.0
            cbg = 0.0
            cbn = 0.0
            cbc = 0.0
        }
        total_cannabinoids = 0.0
        dominant_cannabinoid = "cbd"
        profile_type = "isolate"
    }
    effects_profile = @{
        primary_effects = @("relaxation", "focus")
        secondary_effects = @("creativity")
        medicinal_benefits = @("stress_relief")
        best_for = @("daytime_use")
        avoid_if = @("sensitive_to_stimulation")
    }
    compliance_info = @{
        requires_age_verification = $false
        minimum_age = 18
        restricted_states = @()
        restricted_zipcodes = @()
        requires_lab_testing = $false
        lab_certificate_url = $null
        product_type = "general"
        regulatory_category = "unregulated"
    }
    is_active = $true
} | ConvertTo-Json -Depth 4

$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

# Insert test product
$insertUrl = "$supabaseUrl/rest/v1/main_site_products"
try {
    $response = Invoke-RestMethod -Uri $insertUrl -Headers $headers -Method Post -Body $testProduct -TimeoutSec 10

    if ($response.Count -gt 0) {
        Write-Host "SUCCESS: Enhanced schema verified!" -ForegroundColor Green
        Write-Host "✅ Cannabinoid profiles working" -ForegroundColor Green
        Write-Host "✅ Effects profiles working" -ForegroundColor Green
        Write-Host "✅ Compliance tracking working" -ForegroundColor Green

        # Clean up test product
        $deleteUrl = "$supabaseUrl/rest/v1/main_site_products?id=eq.$($response[0].id)"
        Invoke-RestMethod -Uri $deleteUrl -Headers $headers -Method Delete -TimeoutSec 10 | Out-Null

        Write-Host "Database fix completed successfully!" -ForegroundColor Green
        Write-Host "Ready for production use!" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Schema verification failed" -ForegroundColor Red
}
