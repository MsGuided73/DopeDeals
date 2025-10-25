
Find-RouteCollisions.ps1
Usage: .\Find-RouteCollisions.ps1 -Root 'app' [-VerboseOutput]
#>

param(
[string] $Root = 'app',
[switch] $VerboseOutput
)

$rootFull = Resolve-Path -LiteralPath $Root -ErrorAction SilentlyContinue
if (-not $rootFull) {
Write-Error "Root path '$Root' not found. Run from repo root or pass correct -Root."
exit 2
}
$rootFull = $rootFull.Path

# Match route-related filenames (page.*, route.*, layout.*, error.*, loading.*)
$routeFileNamePattern = '^(page|route|layout|error|loading)\.(tsx?|jsx?|ts|js)$'

$files = Get-ChildItem -Path $rootFull -Recurse -File -ErrorAction SilentlyContinue |
Where-Object {
 ($_.FullName -notmatch '\\node_modules\\') -and
 ($_.FullName -notmatch '\\\.next\\') -and
 ($_.FullName -notmatch '\\dist\\') -and
 ($_.FullName -notmatch '\\out\\')
} |
Where-Object { $_.Name -match $routeFileNamePattern }

if ($files.Count -eq 0) {
Write-Output "No route-related files found under '$Root' using the configured patterns."
exit 0
}

function Normalize-Route {
param([string]$FileFullPath, [string]$RootFullPath)

$rel = [IO.Path]::GetRelativePath($RootFullPath, $FileFullPath)
$dirOnly = [IO.Path]::GetDirectoryName($rel)
$sep = [IO.Path]::DirectorySeparatorChar
$segments = if ([string]::IsNullOrEmpty($dirOnly)) { @() } else { $dirOnly -split [regex]::Escape($sep) }

# remove route-group folders e.g. (admin)
$publicSegments = $segments | Where-Object { -not ($_ -match '^\(.*\)$') }

$paramNames = @()
$normalizedSegments = @()
foreach ($seg in $publicSegments) {
 if ($seg -match '^\[([^\]]+)\]$') {
   $paramNames += $Matches[1]
   $normalizedSegments += ':D'
 } else {
   $normalizedSegments += $seg
 }
}

$normalizedPath = '/' + ($normalizedSegments -join '/')
if ($normalizedPath -eq '/') { $normalizedPath = '/' }

return [PSCustomObject]@{
 FileFullPath   = (Resolve-Path -LiteralPath $FileFullPath).Path
 RelativeDir    = $dirOnly
 NormalizedPath = $normalizedPath
 ParamNames     = $paramNames
}
}

$map = @{}
foreach ($f in $files) {
$entry = Normalize-Route -FileFullPath $f.FullName -RootFullPath $rootFull
$key = $entry.NormalizedPath
if (-not $map.ContainsKey($key)) { $map[$key] = @() }
$map[$key] += $entry
}

$conflictsFound = $false
foreach ($key in $map.Keys | Sort-Object) {
$group = $map[$key]
$paramSignatures = $group | ForEach-Object {
 if ($_.ParamNames.Count -eq 0) { '(none)' } else { ($_.ParamNames -join ',') }
} | Sort-Object -Unique

if ($paramSignatures.Count -gt 1) {
 $conflictsFound = $true
 Write-Host "=== CONFLICT for normalized route: $key" -ForegroundColor Yellow
 foreach ($sig in $paramSignatures) {
   Write-Host "  - Signature: $sig"
   $group | Where-Object {
     if ($_.ParamNames.Count -eq 0) { '(none)' } else { ($_.ParamNames -join ',') } -eq $sig
   } | ForEach-Object {
     Write-Host "      • $($_.FileFullPath)   (dir: $($_.RelativeDir))"
   }
 }
 Write-Host ""
} elseif ($VerboseOutput) {
 $one = $group[0]
 Write-Host "OK: $key  ->  paramNames: " -NoNewline
 if ($one.ParamNames.Count -eq 0) { Write-Host "(none)" } else { Write-Host ($one.ParamNames -join ',') }
}
}

if (-not $conflictsFound) {
Write-Host "No slug-name collisions detected under '$Root'." -ForegroundColor Green
exit 0
} else {
Write-Host "Fix collisions by normalizing bracket names across the listed files (choose one canonical name per dynamic segment)." -ForegroundColor Cyan
exit 1
}
