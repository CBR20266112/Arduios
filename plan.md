# 아두이노 교육용 시뮬레이터 앱 - 구현 계획서 (plan.md)

## 1. 개발 전략 & 아키텍처 방향
- **웹 우선 개발, 모바일 APK 확장을 대비한 모듈화**:
  - Pure HTML/CSS/JS (또는 lightweight SVG/Canvas 마운트) 기반으로 빌드 툴 의존성을 최소화하고 반응형 모바일 뷰(390px ~ 430px 세로 비율 + 태블릿/데스크톱 대응) 구현.
  - State Manager / UI Component / Renderer Layer 분리.
- **이미지 시안 (100% Pixel Match & Sense)**:
  - 제공된 7종 시안 이미지(`0c9323ac...` ~ `e9b3f77f...`)의 UI 색상 톤, 라운드 섀도우, 아이콘 배치, 여백 감각 반영.

---

## 2. 단계별 마일스톤 (Milestones)

### Phase 1: 기본 프레임워크 & 시안 디자인 시스템 구축
- 반응형 컨테이너 및 폰트/컬러 변수 정의 (`styles/design-tokens.css`).
- 화면 전환 엔진 (Title Screen ↔ Workspace ↔ Settings Modal).

### Phase 2: 시작 화면 (Title Screen) 구현
- 실물 아두이노 키트 상자 비주얼 패널 구현.
- `▶ Touch to start` 인터랙션 및 메인 조립 화면 진입 애니메이션.

### Phase 3: 메인 회로 작업 화면 (Circuit Workspace Screen) 레이아웃
- 상단 노트북 영역 & `🟢 USB 연결됨` 뱃지.
- 다크 톤 격자 캔버스(Grid Workspace) 및 뷰포트 확대/축소/전체보기 툴바.
- 빈 조립 화면 가이드 ("부품 버튼을 눌러 조립을 시작하세요").
- 하단 `[🔄 리셋]` 및 `[🧰 부품]` 버튼 바.

### Phase 4: 부품 보관함 팝업 & 부품 꺼내기/배치 인터랙션
- 부품 보관함 Modal UI (아두이노, 브레드보드, LED, 저항, 점퍼선, 버튼, 센서).
- `[꺼내기]` 버튼 클릭 시 캔버스 내 부품 생성 및 드래그/배치 기능.

### Phase 5: 부품 회수 (집어넣기) & 터치 인터랙션
- 부품 2초 Long-Press (또는 터치 선택) 시 선택 링 및 `집어넣기` 팝업 툴팁 노출.
- 부품 제거 및 캔버스 초기화 `[🔄 리셋]` 연동.

### Phase 6: 설정 모달 (Settings) & 다국어(i18n) 시스템
- i18n 언어 변경 (한국어 / English).
- 격자 표시 토글, 확대 배율 설정, 고대비 모드, 팝업 표시 방식 등 설정 변경 적용.

### Phase 7: 세션 저장/복원 & APK 패키징 준비
- LocalStorage 기반 저장/복원 (`새 프로젝트 v`).
- 모바일 PWA / Capacitor / APK 호환 체크 및 검증.
