# 아두이노 시뮬레이터 - 데이터 모델 및 상태 명세서 (data-model.md)

## 1. 개요
본 문서는 아두이노 교육용 시뮬레이터의 UI 뷰 렌더링 레이어와 완전히 독립된 **상태 데이터 모델(State Data Model)**을 정의합니다.
UI 렌더링과 데이터 로직을 분리함으로써 웹앱 실행 시의 높은 유지보수성과 향후 **Capacitor / PWA 기반 Android (APK) 및 iOS 모바일 앱 포팅 시의 호환성**을 완벽하게 보장합니다.

---

## 2. 앱 전역 상태 (AppState)

```typescript
interface AppState {
  currentScreen: 'title' | 'workspace' | 'settings'; // 현재 노출 화면
  locale: 'ko' | 'en';                              // 현재 UI 언어 (기본: ko)
  isSettingsOpen: boolean;                          // 설정 모달 열림 여부
  isComponentsDrawerOpen: boolean;                 // 부품 보관함 팝업 열림 여부
  selectedComponentId: string | null;               // 현재 선택/Long-Press된 부품 ID
  longPressTimer: number | null;                    // Long-Press (2초) 타이머 핸들
}
```

---

## 3. 환경 설정 데이터 (SettingsData)

```typescript
interface SettingsData {
  language: 'ko' | 'en';                           // 앱 언어
  brightness: number;                              // 화면 밝기 (0 ~ 100)
  fontSize: 'small' | 'medium' | 'large';          // 글자 크기
  highContrast: boolean;                           // 고대비 모드
  longPressDurationMs: number;                     // 길게 누르기 시간 (기본 2000ms)
  touchVibration: boolean;                         // 터치 진동 피드백
  showGrid: boolean;                               // 회로 작업 공간 격자 표시 여부
  snapToGrid: boolean;                             // 부품 격자 자동 정렬
  defaultZoomScale: number;                        // 기본 확대 배율 (1.0 = 100%)
  workspaceSize: 'standard' | 'large' | 'expand';  // 작업 공간 기본 크기
  popupStyle: 'blur' | 'dark' | 'opaque';          // 팝업 배경 표시 방식 (배경 흐림 / 어둡게 / 불투명)
}
```

---

## 4. 회로 작업 공간 상태 (WorkspaceState)

```typescript
interface WorkspaceState {
  projectName: string;                             // 프로젝트 이름 (예: "새 프로젝트")
  isConnectedToUsb: boolean;                      // 상단 노트북 USB 연결 상태 (기본: true)
  viewport: {
    zoomScale: number;                             // 뷰포트 확대/축소 배율 (0.5 ~ 2.0)
    panX: number;                                  // X축 이동 값
    panY: number;                                  // Y축 이동 값
  };
  components: PlacedComponent[];                  // 배치된 부품 목록
  wires: WireConnection[];                        // 부품 핀 간 점퍼선 연결 목록
}
```

---

## 5. 부품 데이터 구조 (PlacedComponent & ComponentDefinition)

```typescript
// 부품 데이터 베이스 정적 정의
interface ComponentDefinition {
  typeId: 'arduino_uno' | 'breadboard' | 'led_red' | 'resistor_220' | 'jumper_wire' | 'button' | 'sensor';
  nameKo: string;
  nameEn: string;
  category: 'board' | 'breadboard' | 'output' | 'passive' | 'input' | 'sensor';
  pins: { pinId: string; label: string; xRel: number; yRel: number }[];
  defaultWidth: number;
  defaultHeight: number;
  iconSvg: string;
}

// 회로 작업 공간 내 실제 배치된 부품 인스턴스
interface PlacedComponent {
  id: string;                                      // 고유 인스턴스 ID (uuid/timestamp)
  typeId: string;                                  // ComponentDefinition typeId 참조
  x: number;                                       // 캔버스 내 X 좌표
  y: number;                                       // 캔버스 내 Y 좌표
  rotation: number;                                // 회전 각도 (0, 90, 180, 270)
  state: Record<string, any>;                      // 부품 상태 (예: LED ON/OFF, 버튼 pressed 등)
}
```

---

## 6. 점퍼선 연결 구조 (WireConnection)

```typescript
interface WireConnection {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color: string;                                   // 선 색상 (red, yellow, green, black 등)
}
```

---

## 7. 저장소 데이터 구조 (StorageSchema)

```typescript
interface SavedSession {
  version: string;
  savedAt: string;
  settings: SettingsData;
  workspace: WorkspaceState;
}
```
`localStorage` 키: `arduino_simulator_v1_session` (웹 & 모바일 로컬 앱 공용)
