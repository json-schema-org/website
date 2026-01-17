# PowerShell script to update yarn.lock file
# This script should be run after updating package.json dependencies

Write-Host "Enabling Corepack..." -ForegroundColor Cyan
corepack enable

Write-Host "Installing dependencies to update yarn.lock..." -ForegroundColor Cyan
yarn install

Write-Host "Checking if yarn.lock was updated..." -ForegroundColor Cyan
$status = git status yarn.lock --porcelain
if ($status) {
    Write-Host "✓ yarn.lock has been updated" -ForegroundColor Green
    Write-Host "Please commit and push the updated yarn.lock file" -ForegroundColor Yellow
} else {
    Write-Host "✗ yarn.lock was not updated (it may already be in sync)" -ForegroundColor Yellow
}
