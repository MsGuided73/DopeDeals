# Setup Supabase Authentication for CLI
Write-Host "Setting up Supabase CLI authentication..."

# Load .env.local file and set environment variables
$envContent = Get-Content .env.local -Raw

foreach ($line in ($envContent -split "`n")) {
    $line = $line.Trim()
    if ($line -and !$line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()

        # Remove quotes if present
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        Write-Host "Set: $name" -ForegroundColor Gray
    }
}

# Verify the token is loaded
$token = [Environment]::GetEnvironmentVariable('SUPABASE_ACCESS_TOKEN', 'Process')
if ($token) {
    Write-Host "SUCCESS: SUPABASE_ACCESS_TOKEN loaded" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Cyan
} else {
    Write-Host "ERROR: SUPABASE_ACCESS_TOKEN not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "Supabase CLI is now authenticated!" -ForegroundColor Green
