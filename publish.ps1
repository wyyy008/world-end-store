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

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path -LiteralPath $gh)) {
  $ghCommand = Get-Command gh -ErrorAction SilentlyContinue
  if (-not $ghCommand) {
    throw "GitHub CLI not found. Install it with: winget install GitHub.cli"
  }
  $gh = $ghCommand.Source
}

$repo = "wyyy008/world-end-store"
$branch = "main"
$files = @()
foreach ($name in @("index.html", "styles.css", "game.js", "content.js", "audio.js", "README.md", "publish.ps1")) {
  $files += @{ path = $name; source = Join-Path $dest $name }
}
Get-ChildItem -LiteralPath $destAssets -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($dest.Length + 1).Replace("\", "/")
  $files += @{ path = $relative; source = $_.FullName }
}

$parentSha = (& $gh api "repos/$repo/git/ref/heads/$branch" --jq ".object.sha").Trim()
if ($LASTEXITCODE -ne 0) { throw "Could not read the current GitHub branch." }
$baseTree = (& $gh api "repos/$repo/git/commits/$parentSha" --jq ".tree.sha").Trim()
if ($LASTEXITCODE -ne 0) { throw "Could not read the current GitHub commit." }

$entries = @()
foreach ($file in $files) {
  $encoded = [Convert]::ToBase64String([IO.File]::ReadAllBytes($file.source))
  $blobBody = @{ content = $encoded; encoding = "base64" } | ConvertTo-Json -Compress
  $blobSha = ($blobBody | & $gh api --method POST "repos/$repo/git/blobs" --input - --jq ".sha").Trim()
  if ($LASTEXITCODE -ne 0) { throw "Could not upload $($file.path)." }
  $entries += @{ path = $file.path; mode = "100644"; type = "blob"; sha = $blobSha }
}

$treeBody = @{ base_tree = $baseTree; tree = $entries } | ConvertTo-Json -Depth 6 -Compress
$newTree = ($treeBody | & $gh api --method POST "repos/$repo/git/trees" --input - --jq ".sha").Trim()
if ($LASTEXITCODE -ne 0) { throw "Could not create the new GitHub tree." }
if ($newTree -eq $baseTree) {
  Write-Host "No changes to publish."
  return
}

$commitBody = @{ message = $Message; tree = $newTree; parents = @($parentSha) } | ConvertTo-Json -Depth 4 -Compress
$newCommit = ($commitBody | & $gh api --method POST "repos/$repo/git/commits" --input - --jq ".sha").Trim()
if ($LASTEXITCODE -ne 0) { throw "Could not create the GitHub commit." }

$refBody = @{ sha = $newCommit; force = $false } | ConvertTo-Json -Compress
$refBody | & $gh api --method PATCH "repos/$repo/git/refs/heads/$branch" --input - | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Could not update the GitHub branch." }

Write-Host "Published via GitHub API. GitHub Pages will update automatically: https://wyyy008.github.io/world-end-store/"
