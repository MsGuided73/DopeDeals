# PowerShell script to add missing GlobalMasthead imports to all .tsx files that use it

# Get all .tsx files containing <GlobalMasthead but missing the import
$filesWithUsage = Get-ChildItem -Path . -Recurse -Include "*.tsx" |
    Select-String -Pattern "<GlobalMasthead" -SimpleMatch |
    ForEach-Object { $_.Path } |
    Sort-Object -Unique

$filesWithImport = Get-ChildItem -Path . -Recurse -Include "*.tsx" |
    Select-String -Pattern "import.*GlobalMasthead" -SimpleMatch |
    ForEach-Object { $_.Path } |
    Sort-Object -Unique

# Find files that have usage but don't have import
$missingImports = $filesWithUsage | Where-Object { $_ -notin $filesWithImport }

Write-Host "Files missing GlobalMasthead import:"
foreach ($file in $missingImports) {
    Write-Host $file

    # Read the file content
    $content = Get-Content $file -Raw

    # Check if the import statement already exists (double-check)
    if ($content -notmatch "import.*GlobalMasthead") {
        # Determine the correct import path based on file location
        $importPath = ""
        if ($file -match "app.*\.tsx$") {
            if ($file -match "app/components.*\.tsx$") {
                $importPath = "../components/GlobalMasthead"
            } else {
                $importPath = "../components/GlobalMasthead"
            }
        }
        Write-Host "  Adding import to: $file"
        Write-Host "  Import path will be: $importPath"

        # This would normally add the import, but we'll just report for now
        Write-Host "  Would add: import GlobalMasthead from '$importPath';"
        Write-Host ""
    }
}

Write-Host "Total files to fix: $($missingImports.Count)"
