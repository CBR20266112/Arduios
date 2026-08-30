# ==========================================================================
# build.ps1 — 아두이노 시뮬레이터 www/ 빌드 스크립트 (PowerShell)
# npx cap sync 전에 실행해야 합니다.
# ==========================================================================

Write-Host "🔨 www/ 빌드 폴더 생성 중..." -ForegroundColor Cyan

# www/ 폴더 초기화
if (Test-Path "www") { Remove-Item -Recurse -Force "www" }
New-Item -ItemType Directory -Path "www" | Out-Null
New-Item -ItemType Directory -Path "www/css" | Out-Null
New-Item -ItemType Directory -Path "www/js" | Out-Null
New-Item -ItemType Directory -Path "www/icons" | Out-Null

# 핵심 파일 복사
Copy-Item "index.html"   "www/index.html"
Copy-Item "manifest.json" "www/manifest.json"
Copy-Item "sw.js"         "www/sw.js"

# CSS 복사
Copy-Item "css/style.css" "www/css/style.css"

# JS 파일 복사
$jsFiles = @("i18n.js","store.js","components-data.js","workspace.js","app.js","tutorial.js","info-panel.js","projects.js")
foreach ($f in $jsFiles) {
    Copy-Item "js/$f" "www/js/$f"
}

# 아이콘 복사
Copy-Item "icons/icon-192.png" "www/icons/icon-192.png"
Copy-Item "icons/icon-512.png" "www/icons/icon-512.png"

Write-Host "✅ www/ 빌드 완료! 다음 명령을 실행하세요:" -ForegroundColor Green
Write-Host "   npx cap sync" -ForegroundColor Yellow
