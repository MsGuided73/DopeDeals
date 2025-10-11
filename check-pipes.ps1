# Check if main_site_products table has data and pipe products
try {
    # Import environment variables
    $envFile = Get-Content ".env" -ErrorAction SilentlyContinue
    if ($envFile) {
        $envFile | ForEach-Object {
            if ($_ -match "^(SUPABASE_URL|NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)=(.*)$") {
                Set-Item -Path "env:$($matches[1])" -Value $matches[2]
            }
        }
    }

    $supabaseUrl = $env:SUPABASE_URL
    if (-not $supabaseUrl) {
        $supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
    }
    $supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

    Write-Host "=== CHECKING DATABASE CONNECTION ===" -ForegroundColor Cyan
    if ($supabaseUrl) {
        Write-Host "Supabase URL: Found" -ForegroundColor Green
    } else {
        Write-Host "Supabase URL: Not found" -ForegroundColor Red
    }
    if ($supabaseKey) {
        Write-Host "Service Key: Found" -ForegroundColor Green
    } else {
        Write-Host "Service Key: Not found" -ForegroundColor Red
    }

    if (-not $supabaseUrl -or -not $supabaseKey) {
        Write-Host "Missing Supabase credentials. Please check your .env.local file." -ForegroundColor Red
        exit 1
    }

    Write-Host "`n=== CHECKING AVAILABLE TABLES ===" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/" -Method Get -Headers @{
        "apikey" = $supabaseKey
        "Authorization" = "Bearer $supabaseKey"
        "Content-Type" = "application/json"
    }

    Write-Host "Available tables:" -ForegroundColor Yellow
    $response | ForEach-Object {
        Write-Host "- $($_.name)" -ForegroundColor Gray
    }

    Write-Host "`n=== CHECKING MAIN_SITE_PRODUCTS TABLE ===" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/main_site_products?select=id,name,our_price,image_url,is_active&is_active=true&limit=20" -Method Get -Headers @{
            "apikey" = $supabaseKey
            "Authorization" = "Bearer $supabaseKey"
            "Content-Type" = "application/json"
        }
    } catch {
        Write-Host "main_site_products table not found. Checking products table..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/products?select=id,name,price,imageUrl,is_active&is_active=true&limit=20" -Method Get -Headers @{
            "apikey" = $supabaseKey
            "Authorization" = "Bearer $supabaseKey"
            "Content-Type" = "application/json"
        }
    }

    Write-Host "Total products found: $($response.Count)" -ForegroundColor Green

    if ($response.Count -gt 0) {
        Write-Host "`nSample products:" -ForegroundColor Yellow
        $response | Select-Object -First 5 | ForEach-Object {
            $price = if ($_.our_price) { '$' + $_.our_price } else { 'No price' }
            $image = if ($_.image_url) { 'Has image' } else { 'No image' }
            Write-Host "- $($_.name) - $price - $image" -ForegroundColor Gray
        }

        # Check for pipe-related products
        $pipeKeywords = @('PIPE', 'CHILLUM', 'SPOON', 'BOWL', 'HAND PIPE')
        $pipeProducts = $response | Where-Object { $_.name -and ($pipeKeywords | Where-Object { $_.name.ToUpper().Contains($_) } | Measure-Object).Count -gt 0 }

        Write-Host "`n=== PIPE PRODUCTS (containing keywords) ===" -ForegroundColor Cyan
        Write-Host "Pipe products found: $($pipeProducts.Count)" -ForegroundColor Green

        if ($pipeProducts.Count -gt 0) {
            $pipeProducts | ForEach-Object {
                $price = if ($_.our_price) { '$' + $_.our_price } else { 'No price' }
                Write-Host "- $($_.name) - $price" -ForegroundColor Gray
            }
        } else {
            Write-Host "No pipe products found with current keywords." -ForegroundColor Yellow
            Write-Host "Available products that might be pipes:" -ForegroundColor Yellow
            $response | Where-Object { $_.name -like "*pipe*" -or $_.name -like "*bowl*" -or $_.name -like "*chillum*" } | ForEach-Object {
                Write-Host "- $($_.name)" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "No active products found in main_site_products table." -ForegroundColor Red
    }

} catch {
    Write-Host "Error checking database: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "This might indicate the table doesn't exist or credentials are wrong." -ForegroundColor Yellow
}
