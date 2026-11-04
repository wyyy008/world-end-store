param(
  [string]$Message = "Update game"
)

$ErrorActionPreference = "Stop"
$source = "C:\Users\wuyiy\Documents\world_end_store_plan"
$dest = $PSScriptRoot

if (-not (Test-Path -LiteralPath $source)) {
  throw "找不到源项目：$source"
}

foreach ($name in @("index.html", "styles.css", "game.js", "content.js", "audio.js")) {
  Copy-Item -LiteralPath (Join-Path $source $name) -Destination (Join-Path $dest $name) -Force
}

$sourceAssets = Join-Path $source "assets"
$destAssets = Join-Path $dest "assets"
New-Item -ItemType Directory -Path $destAssets -Force | Out-Null
Copy-Item -Path (Join-Path $sourceAssets "*") -Destination $destAssets -Recurse -Force

Push-Location $dest
try {
  git add -A
  if (git diff --cached --quiet) {
    Write-Host "没有变化，无需发布。"
    return
  }
  git commit -m $Message
  git push origin main
  Write-Host "已推送。GitHub Pages 会自动发布：https://wyyy008.github.io/world-end-store/"
} finally {
  Pop-Location
}
