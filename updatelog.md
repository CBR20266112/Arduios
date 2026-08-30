## [2026-08-31 05:30] - Phase 7: 최종 배포 전 점검 및 빌드 파이프라인 보정 완료

### 📌 주요 점검 및 보정 사항

1. **Capacitor `webDir` 심각한 설정 오류 교정**:
   - 기존 `webDir: "."` 설정 시 `npm install` 진행 후 `node_modules` (수백 MB) 전체가 Android 원본 프로젝트에 복사되는 문제 발견.
   - `webDir: "www"`로 변경하고 Capacitor 6 구버전 속성(`bundledWebRuntime`) 제거.

2. **자동 빌드 스크립트 작성 (`build.ps1` & `build.sh`)**:
   - `index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `icons/` 정적 파일만 `www/` 폴더로 모으는 크로스 플랫폼 빌드 스크립트 구축.
   - `package.json`의 `npm run cap:sync` 실행 시 `npm run build`가 자동으로 먼저 실행되도록 훅 연결.

3. **`README_APK.md` 최신화**:
   - `npm run cap:sync` 명령어 중심으로 Android/iOS 빌드 흐름 및 트러블슈팅 업데이트.

### ✅ 검증 항목
- `capacitor.config.json`과 PWA `manifest.json` 설정 충돌 점검 통과.
- `webDir`가 `"www"`로 지정되어 node_modules 복사 방지.
- `build.ps1` / `build.sh`로 배포 정적 자산만 분리 준비 완료.
- Node.js 설치 후 `npm install && npm run cap:sync` 한 줄로 즉시 빌드 가능 상태 확보.

### 📝 수정/생성 파일
- [NEW] `build.ps1`
- [NEW] `build.sh`
- [UPDATE] `capacitor.config.json` (`webDir: "www"`)
- [UPDATE] `package.json` (`npm run build` 스크립트 훅)
- [UPDATE] `README_APK.md`
- [UPDATE] `updatelog.md`

---

## [2026-08-31 05:25] - Phase 6: Capacitor APK 포팅 준비 & PWA 보강 완료

### 📌 주요 구현 내용

1. **`package.json` (신규)**:
   - `@capacitor/core`, `@capacitor/android`, `@capacitor/ios` v6.x 의존성 정의.
   - `cap:add:android`, `cap:sync`, `cap:run:android`, `cap:open:android` npm 스크립트 준비.

2. **`capacitor.config.json` (신규)**:
   - 앱 ID: `com.adios.arduinosimulator`, 앱 이름: `아두이노 시뮬레이터`, `webDir: "."`.
   - Android/iOS 배경색 `#0d1b2a`, 스플래시 스크린 2초, StatusBar 다크 모드 설정.

3. **`manifest.json` (신규)**:
   - PWA 매니페스트: `display: standalone`, `orientation: portrait`, `theme_color: #0d1b2a`.
   - 아이콘 `192×192`, `512×512` 참조, `lang: ko`, 카테고리 `education`.

4. **`sw.js` (신규)**:
   - 네트워크 우선 / 캐시 폴백 서비스 워커.
   - 핵심 파일 사전 캐싱 (index.html, CSS, JS 7개, manifest, 아이콘 2개).
   - 구버전 캐시 자동 삭제, `skipWaiting()` + `clients.claim()` 즉시 활성화.

5. **`icons/` (신규)**:
   - `icon-192.png`, `icon-512.png` — 앱 아이콘 (Arduino UNO + LED 다크 배경 디자인).

6. **`index.html` 갱신**:
   - `<link rel="manifest">`, `theme-color`, `apple-mobile-web-app-capable`, `apple-touch-icon` 메타태그 추가.
   - 서비스워커 등록 스크립트 (`if 'serviceWorker' in navigator`) 추가.

7. **`README_APK.md` (신규)**:
   - Node.js 설치 → `npm install` → `npx cap add android` → APK 빌드 단계별 가이드.
   - PWA 홈 화면 설치 방법, Play Store 서명 방법, 트러블슈팅 포함.

### ✅ 검증 항목
- `manifest.json`이 `index.html` `<link rel="manifest">`에 연결됨.
- `sw.js`가 `window.load` 이벤트 후 등록되도록 스크립트 추가됨.
- `capacitor.config.json` 형식이 Capacitor 6 공식 스펙에 맞음.
- Node.js 설치 후 `npm install && npx cap add android && npx cap sync`로 바로 이어질 수 있음.
- 기존 웹앱 기능(튜토리얼, 예시 회로, 정보 패널, 프로젝트 저장 등) 전부 유지.

### 📝 신규/수정 파일
- [NEW] `package.json`
- [NEW] `capacitor.config.json`
- [NEW] `manifest.json`
- [NEW] `sw.js`
- [NEW] `icons/icon-192.png`, `icons/icon-512.png`
- [NEW] `README_APK.md`
- [UPDATE] `index.html` (PWA 메타태그 + SW 등록)
- [UPDATE] `updatelog.md`

### 🔜 다음 단계 후보
- Node.js 설치 후 `npm install && npx cap add android && npx cap sync` 실행.
- Android Studio에서 실제 APK 빌드 및 에뮬레이터 테스트.
- Play Store 배포 준비 (앱 설명, 스크린샷, 서명).
- 세부 UX 다듬기 (선택 피드백, 애니메이션 추가 등).

---

## [2026-08-31 05:03] - Phase 5: 저장/복원 UI 정리 및 프로젝트 슬롯 관리 구현 완료

### 📌 주요 구현 내용
1. **`js/projects.js` (신규 생성)**:
   - `ProjectManager` 클래스: 5개 저장 슬롯 기반 프로젝트 저장, 불러오기, 삭제, 이름 변경 모달 UI 제어.
   - 프로젝트 이름 입력 폼 (`project-name-input`) & `✨ 새 프로젝트` 시작 액션.
   - 5개 저장 슬롯 카드 렌더링 (슬롯 상태: `비어 있음` / `현재 작업 중`, 프로젝트명, 최종 저장 시각, 부품 수, 와이어 수).
   - **실수 방지 Confirmation 팝업**:
     - **덮어쓰기**: 기존 저장 데이터가 존재하는 슬롯에 저장 시 덮어쓰기 확인.
     - **불러오기**: 현재 캔버스가 대체되는 확인 팝업.
     - **삭제**: 슬롯 데이터 삭제 확인.
     - **새 프로젝트**: 현재 작업 비우고 새 프로젝트 시작 확인.
   - 액션 성공 시 피드백 토스트 메시지 렌더링.
2. **`js/store.js` 슬롯 데이터 상태 및 메서드 추가**:
   - `currentProjectName`, `currentSlotIndex`, `slots` (5개 배열) 상태 추가 및 LocalStorage 동기화.
   - `saveToSlot(slotIndex, projectName)`, `loadFromSlot(slotIndex)`, `deleteSlot(slotIndex)`, `startNewProject()` 메서드 추가.
3. **`index.html` 갱신**:
   - 워크스페이스 상단 헤더의 프로젝트 이름을 클릭 가능한 `📁 [프로젝트명] ▼` 버튼으로 변경.
   - `#project-modal` 모달 HTML 추가.
   - `<script src="js/projects.js"></script>` 추가.
4. **`css/style.css` 스타일 추가**:
   - 다크 글래스모피즘 프로젝트 모달, 이름 입력 폼, 슬롯 카드 hover/current/empty 디테일, 슬롯 뱃지, 저장/불러오기/삭제 버튼 스타일 추가.
5. **`js/i18n.js` 번역 키 추가**:
   - `projectModalTitle`, `projectModalSub`, `labelProjectName`, `btnStartNewProject`, `slotsHeading` 한/영 지원.

### ✅ 검증 항목
- 헤더 `📁 [프로젝트명] ▼` 및 `💾` 저장 버튼 클릭 시 프로젝트 모달 오픈.
- 프로젝트 이름 입력 및 선택한 슬롯에 저장 성공.
- 슬롯 카드에 저장 시각, 부품 수, 와이어 수 정확히 노출.
- 불러오기 / 덮어쓰기 / 삭제 / 새 프로젝트 시 확인 팝업 정상 작동.
- 새로고침(F5) 후에도 5개 슬롯 데이터 및 설정이 LocalStorage에 그대로 유지.

### 🔧 보정 사항
- `app.js`와 `projects.js` 간 중복 버튼 바인딩 제거 → `projects.js` 단독 관리로 정리.
- `project-selector` CSS를 `<select>` 기반에서 클릭 가능한 `<div>` 버튼형으로 업데이트 (hover, overflow ellipsis 처리).

### 📝 수정/생성 파일
- [NEW] `js/projects.js`
- [UPDATE] `js/store.js` (슬롯 상태 & 메서드)
- [UPDATE] `index.html` (헤더 셀렉터, 프로젝트 모달, script 태그)
- [UPDATE] `js/app.js` (헤더 제목 동기화)
- [UPDATE] `css/style.css` (프로젝트 모달 스타일)
- [UPDATE] `js/i18n.js` (번역 키)
- [UPDATE] `updatelog.md`

### 🔜 다음 단계 후보
- **APK 포팅 준비** (Capacitor 환경 설정, Android/iOS 빌드 스크립트 작성).

---

## [2026-08-31 04:47] - Phase 4: 회로 상태 설명 패널 (Info Panel) 구현 완료

### 📌 주요 구현 내용
1. **`js/info-panel.js` (신규 생성)**:
   - `InfoPanelManager` 클래스: 슬라이드업 bottom-sheet 패널 관리.
   - `showComponent(comp, def)`: 부품 클릭 시 이름·핀 수·연결된 와이어 수 표시.
   - `showPin(comp, pin, def)`: 핀 포트 첫 번째 선택 시 핀 이름·소속 부품·연결된 상대 핀 목록 표시. 선택 중 상태에는 빨간 펄스 뱃지 애니메이션.
   - `showWire(wire)`: 와이어 클릭 시 `[부품A] 핀X → [부품B] 핀Y` 경로 표시 (와이어 색상 그대로 반영).
   - `reset()`: 빈 공간 클릭 또는 선 연결 완료 시 기본 안내 문구로 복귀 + 패널 접힘.
   - `expand() / collapse()`: 토글 접기/펼치기 (탭 버튼으로 수동 제어도 가능).
2. **`js/workspace.js` 훅 추가**:
   - 부품 click → `infoPanel.showComponent()`
   - 핀 포트 click (첫 번째 선택) → `infoPanel.showPin()`
   - 와이어 hit-area click → `infoPanel.showWire()`
   - 빈 캔버스 click → `infoPanel.reset()`
   - 핀 취소/연결 완료 → `infoPanel.reset()`
3. **`index.html` 갱신**:
   - `#info-panel` 슬라이드업 패널 HTML (탭 핸들 + 본문) 워크스페이스 footer 위에 삽입.
   - `<script src="js/info-panel.js">` 추가.
4. **`css/style.css` 스타일 추가**:
   - 슬라이드업 패널 (`max-height` transition 0.25s), 탭 버튼, 정보 행, 핀 뱃지, 연결선 화살표, `pulse-text` 애니메이션.
5. **`js/i18n.js` 번역 키 추가**:
   - `infoPanelLabel`, `infoPanelDefault` 한/영 양쪽 추가.

### ✅ 검증 항목
- 부품 클릭 → 이름·핀 수·연결 와이어 수 표시, 패널 자동 펼침.
- 핀 포트 클릭 → 핀 이름·소속 부품·연결 상대 표시 + 빨간 펄스 선택 중 뱃지.
- 와이어 클릭 → `[부품A] 핀 → [부품B] 핀` 경로 표시.
- 빈 공간 클릭 (캔버스/SVG/컴포넌트 레이어 배경) → 패널 기본 안내로 복귀 + 자동 접힘.
- 탭 버튼 수동 토글 동작.

### 📝 수정/생성 파일
- [NEW] `js/info-panel.js`
- [UPDATE] `js/workspace.js` (infoPanel 훅 4곳)
- [UPDATE] `index.html` (패널 HTML, script 태그)
- [UPDATE] `css/style.css` (패널 스타일 ~200줄)
- [UPDATE] `js/i18n.js` (infoPanelLabel, infoPanelDefault)
- [UPDATE] `updatelog.md`

### 🔜 다음 단계 후보
- **저장/복원 UI 정리** (프로젝트 이름 입력, 슬롯 관리, 불러오기 확인창).
- APK 포팅 준비 (Capacitor 설정).

---

## [2026-08-28 10:36] - Phase 3: 기초 회로 예시 + 도움말/튜토리얼 구현 완료

### 📌 주요 구현 내용
1. **`js/tutorial.js` (신규 생성)**:
   - `TUTORIAL_SLIDES` 한/영 데이터 정의 (3단 슬라이드: 부품 꺼내기 → 핀 연결 → 예시 회로 따라하기).
   - `EXAMPLE_CIRCUIT` 예시 회로 정의 (Arduino UNO + 저항 + LED, `D13 → 저항 pin_1`, `저항 pin_2 → LED anode`, `LED cathode → GND`).
   - `TutorialManager` 클래스: 슬라이드 렌더링, 이전/다음 내비게이션, `?` 버튼/따라해보기 버튼 바인딩.
   - `loadExampleCircuit()`: 작업 내용 있을 시 확인 팝업 → 초기화 → 예시 부품+연결선 일괄 배치 → 토스트 메시지 표시.
2. **`js/store.js` 메서드 추가**:
   - `loadExampleCircuit({ placedComponents, wires })`: 컴포넌트와 와이어를 원자적으로 일괄 적재하고 `notify()` + 로컬 스토리지 저장.
3. **`index.html` 갱신**:
   - 빈 작업 화면에 `📖 따라해보기` 버튼 추가.
   - 튜토리얼 모달 HTML (3단 슬라이드 + 스텝 인디케이터 + 이전/다음 버튼 + 예시 회로 불러오기 버튼) 추가.
   - `<script src="js/tutorial.js">` 추가.
4. **`js/i18n.js` 번역 키 추가**:
   - `tutorialTitle`, `btnTryTutorial`, `tutPrev`, `tutNext`, `btnLoadExample` 키를 한/영 양쪽에 추가.
5. **`css/style.css` 스타일 추가**:
   - 튜토리얼 모달 (다크 글래스모피즘 카드, 슬라이드 애니메이션, 스텝 인디케이터 점, 이전/다음 버튼).
   - 예시 회로 버튼 (빨간 그라디언트 + 그림자).
   - 회로 배치 토스트 알림 (`slideUp` + `fadeOut` 애니메이션).
   - `따라해보기` 버튼 (파란 그라디언트 + hover lift).

### ✅ 검증 항목
- `?` 버튼 클릭 시 3단 슬라이드 튜토리얼 모달 열림.
- 빈 화면 "따라해보기" 버튼 → 튜토리얼 바로 연결.
- 마지막 슬라이드에서만 `⚡ 예시 회로 불러오기` 버튼 노출.
- 예시 회로 불러오기 → 부품이 있을 경우 확인 팝업 → Arduino UNO + LED + 저항 + 연결선 자동 배치.
- 한국어/영어 전환 시 튜토리얼 슬라이드 텍스트 동기화.
- 새로고침 후 LocalStorage 복원 유지.

### 📝 수정/생성 파일
- [NEW] `js/tutorial.js`
- [UPDATE] `js/store.js` (loadExampleCircuit 메서드)
- [UPDATE] `index.html` (튜토리얼 모달, 따라해보기 버튼, script 태그)
- [UPDATE] `js/i18n.js` (튜토리얼 번역 키)
- [UPDATE] `css/style.css` (튜토리얼 스타일, 토스트 스타일, 애니메이션)
- [UPDATE] `updatelog.md`

### 🔜 다음 단계 후보
- 회로 상태 설명 (현재 선택 핀/선 정보 표시 패널).
- 저장/복원 UI 정리 (프로젝트 이름 저장, 슬롯 관리).
- APK 포팅 준비 (Capacitor 설정).

---

## [2026-08-28 10:11] - Phase 2.1: 연결선 렌더링 버그 보정

### 📌 수정 내용
1. **SVG 와이어 레이어 포인터 이벤트 버그 수정 (`css/style.css`)**:
   - `.wires-layer`의 `pointer-events: none` 을 유지하되, 각 점퍼선마다 두껍고 투명한 hit-area `<path>`(stroke-width 18px)를 추가하여 손가락/마우스 클릭이 확실하게 잡히도록 구조 변경.
   - pin-port z-index를 20 → 30으로 올려 와이어 레이어 위에 포트가 확실히 노출.
2. **hit-area + visible-path 분리 구조 (`js/workspace.js`)**:
   - 각 점퍼선을 `hitPath` (투명, 클릭 감지) + `pathEl` (채색, `data-id` 포함) 두 SVG 엘리먼트로 분리.
   - `updateWiresForComponent` 실시간 드래그 추적도 `previousSibling`으로 hit-area까지 동기화.

### 📝 수정 파일
- [UPDATE] `css/style.css` (pointer-events, z-index 보정)
- [UPDATE] `js/workspace.js` (hit-area path, updateWiresForComponent 보정)
- [UPDATE] `updatelog.md`

### 🔜 다음 단계 후보
- 기초 회로 예시 1개 (아두이노 UNO ↔ LED 최단 회로 자동 안내).
- 도움말/튜토리얼 첫 화면.



### 📌 주요 구현 내용
1. **부품별 핀 포트 상대 좌표 정의 (`js/components-data.js`)**:
   - Arduino UNO (5V, GND, D13, D12, D11), Breadboard (+, -, A10, J10, A20, J20), LED (Anode, Cathode), Resistor (pin1, pin2) 등 핀 포트 좌표 추가.
2. **SVG 와이어 레이어 & 스타일링 (`index.html`, `css/style.css`)**:
   - `#wires-layer` SVG 레이어 추가.
   - 핀 포트 마커 (`.pin-port`, 펄스 애니메이션 `.active`) 및 베지어 곡선 점퍼선 (`.wire-path`) 스타일 적용.
3. **포트 터치/클릭 2단계 선 연결 인터랙션 (`js/workspace.js`)**:
   - 첫 번째 핀 터치 시 강조 링 표시 ➔ 두 번째 핀 터치 시 자동 점퍼선 추가 (`addWire`).
   - 6가지 무작위 색상 점퍼선 시각적 연결.
4. **부품 이동 시 연결선 실시간 동적 추적 (`js/workspace.js`)**:
   - 부품 드래그 이동 (`handlePointerMove`) 시 해당 부품에 연결된 점퍼선의 SVG `<path>` `d` 좌표를 실시간으로 재계산하여 연결 유지.
5. **연결선 삭제 & LocalStorage 세션 복원 (`js/store.js`, `js/workspace.js`)**:
   - 점퍼선 터치 시 `✂️ 선 연결 해제` 툴팁 노출 및 삭제 지원.
   - `workspace.wires` 배열 LocalStorage 저장 및 새로고침 후 복원.

### 📝 수정된 파일 목록
- [UPDATE] `index.html` (Added `<svg id="wires-layer">`)
- [UPDATE] `css/style.css` (Added `.wires-layer`, `.wire-path`, `.pin-port`)
- [UPDATE] `js/components-data.js` (Added `pins` relative coordinate arrays)
- [UPDATE] `js/store.js` (Added `addWire`, `removeWire`, and `wires` storage state)
- [UPDATE] `js/workspace.js` (Added `handlePinClick`, `renderWires`, `updateWiresForComponent`, `showWireDeleteTooltip`)
- [UPDATE] `tasks.md` (Updated task checklist)
- [UPDATE] `updatelog.md` (Recorded Wire Connection feature update)

### 🔜 다음에 할 일
- 부품 간 선 연결 테스트 및 검증 결과 보고서 작성.
- 다음 단계 후보: 기초 회로 예시 1개 / 도움말 튜토리얼 화면 추가.
