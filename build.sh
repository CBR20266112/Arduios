#!/bin/bash
# ==========================================================================
# build.sh — 아두이노 시뮬레이터 www/ 빌드 스크립트 (Bash / macOS / Linux)
# npx cap sync 전에 실행해야 합니다.
# ==========================================================================

echo "🔨 www/ 빌드 폴더 생성 중..."

# www/ 폴더 초기화
rm -rf www
mkdir -p www/css www/js www/icons

# 핵심 파일 복사
cp index.html    www/index.html
cp manifest.json www/manifest.json
cp sw.js         www/sw.js

# CSS 복사
cp css/style.css www/css/style.css

# JS 파일 복사
for f in i18n.js store.js components-data.js workspace.js app.js tutorial.js info-panel.js projects.js; do
  cp "js/$f" "www/js/$f"
done

# 아이콘 복사
cp icons/icon-192.png www/icons/icon-192.png
cp icons/icon-512.png www/icons/icon-512.png

echo "✅ www/ 빌드 완료! 다음 명령을 실행하세요:"
echo "   npx cap sync"
