# 📱 아두이노 시뮬레이터 — APK 빌드 가이드

이 문서는 현재 웹앱을 **Android APK** 또는 **iOS IPA**로 빌드하는 단계별 가이드입니다.  
Capacitor 6 기반으로 준비되어 있으며, Node.js 설치 후 몇 가지 명령만 실행하면 됩니다.

---

## ✅ 사전 준비

| 항목 | 버전 | 다운로드 |
|---|---|---|
| Node.js | 18 LTS 이상 | https://nodejs.org |
| Android Studio | 최신 안정 버전 | https://developer.android.com/studio |
| JDK | 17 이상 | Android Studio 내장 또는 https://adoptium.net |
| Xcode (iOS 전용) | 15 이상 | Mac App Store |

---

## 🚀 Android APK 빌드 순서

### 1단계: 의존성 설치
```bash
npm install
```

### 2단계: Android 플랫폼 추가 (최초 1회)
```bash
npx cap add android
```

### 3단계: www/ 빌드 & 웹 파일 동기화
```bash
npm run cap:sync
```
> `npm run cap:sync`는 웹 정적 파일만 `www/` 폴더로 모은 후 (`build.ps1`/`build.sh` 자동 실행),  
> Node_modules 불필요 용량 없이 깔끔하게 Android 프로젝트로 동기화합니다.

### 4단계: Android Studio에서 빌드
```bash
npx cap open android
```
> Android Studio가 열리면:  
> `Build → Build Bundle(s) / APK(s) → Build APK(s)`

### 5단계: APK 위치
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🍎 iOS IPA 빌드 순서 (Mac 전용)

### 1단계: iOS 플랫폼 추가 (최초 1회)
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```
> Xcode에서 열리면:  
> `Product → Archive → Distribute App`

---

## 🌐 PWA 로컬 설치 (Android Chrome)

별도 빌드 없이 **바로 홈 화면에 설치**할 수 있습니다.

1. Android Chrome에서 `http://localhost:8080` 접속  
2. 주소창 우측 `⋮` 메뉴 → `홈 화면에 추가`  
3. 아이콘 탭 후 앱처럼 실행

---

## 🔑 앱 서명 (Play Store 배포 시)

Play Store 배포를 위한 릴리스 APK 서명이 필요합니다.

```bash
# 키스토어 생성 (최초 1회)
keytool -genkey -v -keystore arduino-sim.keystore \
  -alias arduino-sim -keyalg RSA -keysize 2048 -validity 10000
```

`android/app/build.gradle` 에서 `signingConfigs` 섹션에 키스토어 경로를 지정한 후  
Android Studio에서 `Generate Signed Bundle / APK` 로 빌드합니다.

---

## 📂 프로젝트 구조

```
Adios/
├── index.html          ← 앱 진입점
├── css/style.css       ← 스타일
├── js/                 ← 앱 로직
│   ├── i18n.js
│   ├── store.js
│   ├── workspace.js
│   ├── app.js
│   ├── tutorial.js
│   ├── info-panel.js
│   └── projects.js
├── icons/              ← 앱 아이콘
│   ├── icon-192.png
│   └── icon-512.png
├── manifest.json       ← PWA 매니페스트
├── sw.js               ← 서비스 워커
├── package.json        ← Capacitor 의존성
└── capacitor.config.json ← Capacitor 앱 설정
```

---

## ⚙️ Capacitor 앱 정보

| 항목 | 값 |
|---|---|
| App ID | `com.adios.arduinosimulator` |
| App Name | `아두이노 시뮬레이터` |
| Web Dir | `www` (빌드 출력 폴더) |
| Capacitor | v6.x |
| Android 배경색 | `#0d1b2a` |

---

## 🐛 트러블슈팅

| 문제 | 해결 방법 |
|---|---|
| `Cannot find webDir` | `capacitor.config.json`의 `webDir`가 `"www"` 인지 및 `npm run build` 실행 여부 확인 |
| 폰트 로드 안 됨 (오프라인) | `sw.js` PRECACHE_URLS에 Google Fonts URL 추가 또는 폰트 로컬 저장 |
| 화면이 가로로 뒤집힘 | `capacitor.config.json`에 `"orientation": "portrait"` 확인 |
| 빌드 후 빈 화면 | `webDir` 경로가 index.html 위치와 일치하는지 확인 |
