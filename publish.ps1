param(
  [string]$Message = "Update game"
)

$ErrorActionPreference = "Stop"
$dest = $PSScriptRoot
$currentBranch = (& git -C $dest branch --show-current).Trim()
if ($currentBranch -ne "main") {
  throw "当前分支是 $currentBranch。此脚本只发布 main，V4 开发分支请先完成审阅再合并。"
}
$destAssets = Join-Path $dest "assets"
$scripts = @("content.js", "audio.js", "game.js", "save-tools.js", "scene-manager.js", "chapter-transition.js", "opening.js")
$releaseFiles = @("index.html", "styles.css", "exploration.css", "chapter-transition.css", "opening.css", "README.md", "FIRST_NIGHT_V3.md", "FIRST_NIGHT_V4.md", "publish.ps1") + $scripts

# Bust browser caches for the app's local CSS/JS on every publish.
$indexPath = Join-Path $dest "index.html"
$cacheStamp = Get-Date -Format "yyyyMMddHHmmss"
$indexHtml = Get-Content -LiteralPath $indexPath -Raw -Encoding UTF8
$indexHtml = [regex]::Replace(
  $indexHtml,
  '((?:styles|exploration|chapter-transition|opening)\.css|(?:content|audio|game|save-tools|scene-manager|chapter-transition|opening)\.js)(\?v=[^"]*)?',
  '$1?v=' + $cacheStamp
)
Set-Content -LiteralPath $indexPath -Value $indexHtml -Encoding UTF8 -NoNewline

foreach ($script in $scripts) {
  node --check (Join-Path $dest $script)
  if ($LASTEXITCODE -ne 0) { throw "Syntax check failed for $script" }
}

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path -LiteralPath $gh)) {
  $ghCommand = Get-Command gh -ErrorAction SilentlyContinue
  if (-not $ghCommand) {
    throw "GitHub CLI not found. Install it with: winget install GitHub.cli"
  }
  $gh = $ghCommand.Source
}

$tokenPath = Join-Path $dest ".gh-token"
if (-not $env:GH_TOKEN -and (Test-Path -LiteralPath $tokenPath)) {
  $env:GH_TOKEN = (Get-Content -LiteralPath $tokenPath -Raw).Trim()
}
if (-not $env:GH_TOKEN) {
  $tokenFromGh = (& $gh auth token 2>$null)
  if ($tokenFromGh) {
    $env:GH_TOKEN = $tokenFromGh.Trim()
  }
}
if (-not $env:GH_TOKEN) {
  throw "GitHub auth not found. Run: gh auth login"
}

$repo = "wyyy008/world-end-store"
$branch = "main"
$files = @()
foreach ($name in $releaseFiles) {
  $files += @{ path = $name; source = Join-Path $dest $name }
}
$workflowPath = ".github/workflows/pages.yml"
$files += @{ path = $workflowPath; source = Join-Path $dest $workflowPath }
Get-ChildItem -LiteralPath $destAssets -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($dest.Length + 1).Replace("\", "/")
  $files += @{ path = $relative; source = $_.FullName }
}

$parentRaw = & $gh api "repos/$repo/git/ref/heads/$branch" --jq ".object.sha"
if ($LASTEXITCODE -ne 0 -or -not $parentRaw) { throw "Could not read the current GitHub branch." }
$parentSha = "$parentRaw".Trim()

$treeRaw = & $gh api "repos/$repo/git/commits/$parentSha" --jq ".tree.sha"
if ($LASTEXITCODE -ne 0 -or -not $treeRaw) { throw "Could not read the current GitHub commit." }
$baseTree = "$treeRaw".Trim()

$entries = @()
foreach ($file in $files) {
  $encoded = [Convert]::ToBase64String([IO.File]::ReadAllBytes($file.source))
  $blobBody = @{ content = $encoded; encoding = "base64" } | ConvertTo-Json -Compress
  $blobRaw = $blobBody | & $gh api --method POST "repos/$repo/git/blobs" --input - --jq ".sha"
  if ($LASTEXITCODE -ne 0 -or -not $blobRaw) { throw "Could not upload $($file.path)." }
  $blobSha = "$blobRaw".Trim()
  $entries += @{ path = $file.path; mode = "100644"; type = "blob"; sha = $blobSha }
}

$treeBody = @{ base_tree = $baseTree; tree = $entries } | ConvertTo-Json -Depth 6 -Compress
$newTreeRaw = $treeBody | & $gh api --method POST "repos/$repo/git/trees" --input - --jq ".sha"
if ($LASTEXITCODE -ne 0 -or -not $newTreeRaw) { throw "Could not create the new GitHub tree." }
$newTree = "$newTreeRaw".Trim()
if ($newTree -eq $baseTree) {
  Write-Host "No changes to publish."
  return
}

$commitBody = @{ message = $Message; tree = $newTree; parents = @($parentSha) } | ConvertTo-Json -Depth 4 -Compress
$newCommitRaw = $commitBody | & $gh api --method POST "repos/$repo/git/commits" --input - --jq ".sha"
if ($LASTEXITCODE -ne 0 -or -not $newCommitRaw) { throw "Could not create the GitHub commit." }
$newCommit = "$newCommitRaw".Trim()

$refBody = @{ sha = $newCommit; force = $false } | ConvertTo-Json -Compress
$refBody | & $gh api --method PATCH "repos/$repo/git/refs/heads/$branch" --input - | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Could not update the GitHub branch." }

Write-Host "Published via GitHub API. GitHub Pages will update automatically: https://wyyy008.github.io/world-end-store/"
