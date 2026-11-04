param(
  [string]$Message = "Update game"
)

$ErrorActionPreference = "Stop"
$source = "C:\Users\wuyiy\Documents\world_end_store_plan"
$dest = $PSScriptRoot

if (-not (Test-Path -LiteralPath $source)) {
  throw "Source project not found: $source"
}

foreach ($name in @("index.html", "styles.css", "game.js", "content.js", "audio.js")) {
  Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $dest $name) -Force
}

$sourceAssets = Join-Path $source "assets"
$destAssets = Join-Path $dest "assets"
New-Item -ItemType Directory -Path $destAssets -Force | Out-Null
Copy-Item -Path (Join-Path $sourceAssets "*") -Destination $destAssets -Recurse -Force

node --check (Join-Path $dest "game.js")
node --check (Join-Path $dest "content.js")
node --check (Join-Path $dest "audio.js")
if ($LASTEXITCODE -ne 0) {
  throw "Syntax check failed; publish stopped."
}

Push-Location $dest
try {
  git add -A
  if (git diff --cached --quiet) {
    Write-Host "No changes to publish."
    return
  }
  git commit -m $Message
  git push origin main
  Write-Host "Pushed. GitHub Pages will publish automatically: https://wyyy008.github.io/world-end-store/"
} finally {
  Pop-Location
}
