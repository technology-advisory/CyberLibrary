param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot ".."))
)

$ErrorActionPreference = "Stop"
$Manifest = Join-Path $PSScriptRoot "INTEGRITY.sha256"
if (-not (Test-Path -LiteralPath $Manifest)) {
  Write-Error "No se encuentra el manifest: $Manifest"
  exit 2
}

$expected = @{}
Get-Content -LiteralPath $Manifest -Encoding UTF8 | ForEach-Object {
  if ($_ -match '^([0-9a-fA-F]{64})  (.+)$') {
    $expected[$matches[2].Replace('\','/')] = $matches[1].ToLowerInvariant()
  }
}

$fail = $false
foreach ($rel in ($expected.Keys | Sort-Object)) {
  $native = $rel.Replace('/', [IO.Path]::DirectorySeparatorChar)
  $path = Join-Path $Root $native
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    Write-Host "FALTA    $rel" -ForegroundColor Red
    $fail = $true
    continue
  }
  $actual = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($actual -ne $expected[$rel]) {
    Write-Host "CAMBIADO $rel" -ForegroundColor Red
    $fail = $true
  }
}

$ignore = @('security/INTEGRITY.sha256')
$current = Get-ChildItem -LiteralPath $Root -File -Recurse | ForEach-Object {
  $_.FullName.Substring($Root.Length).TrimStart('\','/').Replace('\','/')
} | Where-Object { $ignore -notcontains $_ }

foreach ($rel in ($current | Sort-Object)) {
  if (-not $expected.ContainsKey($rel)) {
    Write-Host "EXTRA    $rel" -ForegroundColor Yellow
    $fail = $true
  }
}

if ($fail) {
  Write-Host "
RESULTADO: integridad NO conforme con la baseline." -ForegroundColor Red
  exit 1
}

Write-Host "RESULTADO: integridad conforme con la baseline SHA-256." -ForegroundColor Green
exit 0
