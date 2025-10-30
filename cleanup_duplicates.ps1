# Script to clean up duplicate GlobalMasthead and Footer imports from page files
# This removes imports and usage since they're now handled globally

Write-Host "Finding TypeScript React files to clean..."

$files = Get-ChildItem -Path "app" -Include "*.tsx" -Recurse -File | Where-Object {
    $_.FullName -notmatch "node_modules" -and
    $_.FullName -notmatch "templates\\?" -and
    $_.FullName -notmatch "components\\.*GlobalMasthead" -and
    $_.FullName -notmatch "components\\.*[Ff]ooter"
}

Write-Host "Found $($files.Count) files to process"

$totalCleaned = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        $modified = $false

        # Remove GlobalMasthead import lines (supports single quotes, double quotes, and template literals)
        if ($content -match "import.*GlobalMasthead.*from.*[`'""']") {
            $content = $content -replace "import\s+GlobalMasthead\s+from\s+[`'""'][^`'""']*GlobalMasthead[^`'""']*[`'""'];\s*\r?\n?", ""
            $modified = $true
            Write-Host "  - Removed GlobalMasthead import from $($file.Name)"
        }

        # Remove Highway420Footer import lines
        if ($content -match "import.*Highway420Footer.*from.*[`'""']") {
            $content = $content -replace "import\s+Highway420Footer\s+from\s+[`'""'][^`'""']*Highway420Footer[^`'""']*[`'""'];\s*\r?\n?", ""
            $modified = $true
            Write-Host "  - Removed Highway420Footer import from $($file.Name)"
        }

        # Remove DopeCityFooter import lines
        if ($content -match "import.*DopeCityFooter.*from.*[`'""']") {
            $content = $content -replace "import\s+DopeCityFooter\s+from\s+[`'""'][^`'""']*DopeCityFooter[^`'""']*[`'""'];\s*\r?\n?", ""
            $modified = $true
            Write-Host "  - Removed DopeCityFooter import from $($file.Name)"
        }

        # Remove GlobalMasthead usage (clean the tags with surrounding whitespace)
        if ($content.Contains("<GlobalMasthead />")) {
            $content = $content -replace "\r?\n?\s*<GlobalMasthead\s*/>\s*\r?\n?", "`n"
            $modified = $true
            Write-Host "  - Removed GlobalMasthead component usage from $($file.Name)"
        }

        # Remove Highway420Footer usage (clean the tags with surrounding whitespace)
        if ($content.Contains("<Highway420Footer />")) {
            $content = $content -replace "\r?\n?\s*<Highway420Footer\s*/>\s*\r?\n?", "`n"
            $modified = $true
            Write-Host "  - Removed Highway420Footer component usage from $($file.Name)"
        }

        # Remove DopeCityFooter usage (if any)
        if ($content.Contains("<DopeCityFooter />")) {
            $content = $content -replace "\r?\n?\s*<DopeCityFooter\s*/>\s*\r?\n?", "`n"
            $modified = $true
            Write-Host "  - Removed DopeCityFooter component usage from $($file.Name)"
        }

        if ($modified -and ($content -ne $originalContent)) {
            # Clean up extra whitespace that might have been left
            $content = $content -replace "(\r?\n){3,}", "`n`n"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "✓ Cleaned: $($file.FullName)" -ForegroundColor Green
            $totalCleaned++
        }
    } catch {
        Write-Host "✗ Error processing $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cleanup Complete! Processed $($files.Count) files, cleaned $totalCleaned files." -ForegroundColor Green
Write-Host "All duplicate GlobalMasthead and Footer imports/usage have been removed." -ForegroundColor Yellow
