/* ==========================================================================
   i18n Translation Dictionary (한국어 기본 / English)
   ========================================================================== */

const translations = {
  ko: {
    appTitle: "아두이노 시뮬레이터",
    touchToStart: "Touch to start",
    touchSubtext: "화면을 터치하여 시작",
    appSubCaption: "아두이노 회로 학습 시뮬레이터",
    newProject: "새 프로젝트",
    usbConnected: "USB 연결됨",
    adjustWorkspace: "작업 공간 크기 조절",
    circuitWorkspaceTitle: "회로 작업 공간",
    emptyNoticeTitle: "부품 버튼을 눌러 조립을 시작하세요",
    emptyNoticeSub: "아직 배치된 부품이 없습니다",
    btnReset: "리셋",
    btnComponents: "부품",
    componentsDrawerTitle: "부품 보관함",
    settingsTitle: "설정",
    settingsDesc: "앱 사용 환경을 설정할 수 있습니다",
    secLanguage: "언어",
    appLanguage: "앱 언어",
    secWorkspace: "회로 작업 공간",
    showGrid: "격자 표시",
    highContrast: "고대비 모드",
    resetSettings: "설정 초기화",
    takeOut: "꺼내기",
    putBack: "집어넣기",
    longPressGuide: "2초 길게 누름",
    // Tutorial & Example
    tutorialTitle: "도움말",
    btnTryTutorial: "📖 따라해보기",
    tutPrev: "◀ 이전",
    tutNext: "다음 ▶",
    btnLoadExample: "⚡ 예시 회로 불러오기",
    // Info Panel
    infoPanelLabel: "🔍 회로 정보",
    infoPanelDefault: "💡 부품이나 선을 눌러 정보를 확인하세요",
    // Project Manager
    projectModalTitle: "📁 회로 프로젝트 관리",
    projectModalSub: "회로 작업 저장 슬롯을 안심하고 관리하세요",
    labelProjectName: "프로젝트 이름",
    btnStartNewProject: "✨ 새 프로젝트",
    slotsHeading: "💾 저장 슬롯 (5개)",
    // Component Names
    arduino_uno: "아두이노 UNO",
    breadboard: "브레드보드",
    led_red: "LED (적색)",
    resistor: "저항 (220Ω)",
    jumper_wire: "점퍼선",
    button: "푸시 버튼",
    sensor: "조도 센서"
  },
  en: {
    appTitle: "Arduino Simulator",
    touchToStart: "Touch to start",
    touchSubtext: "Touch the screen to start",
    appSubCaption: "Arduino Circuit Learning Simulator",
    newProject: "New Project",
    usbConnected: "USB Connected",
    adjustWorkspace: "Adjust Workspace Size",
    circuitWorkspaceTitle: "Circuit Workspace",
    emptyNoticeTitle: "Tap components button to start building",
    emptyNoticeSub: "No components placed yet",
    btnReset: "Reset",
    btnComponents: "Components",
    componentsDrawerTitle: "Component Drawer",
    settingsTitle: "Settings",
    settingsDesc: "Configure application environment",
    secLanguage: "Language",
    appLanguage: "App Language",
    secWorkspace: "Circuit Workspace",
    showGrid: "Show Grid",
    highContrast: "High Contrast Mode",
    resetSettings: "Reset Settings",
    takeOut: "Add",
    putBack: "Put back",
    longPressGuide: "Hold 2 sec",
    // Tutorial & Example
    tutorialTitle: "Help",
    btnTryTutorial: "📖 Follow Along",
    tutPrev: "◀ Prev",
    tutNext: "Next ▶",
    btnLoadExample: "⚡ Load Example Circuit",
    // Info Panel
    infoPanelLabel: "🔍 Circuit Info",
    infoPanelDefault: "💡 Tap a component or wire to see info",
    // Project Manager
    projectModalTitle: "📁 Project Manager",
    projectModalSub: "Manage your circuit save slots safely",
    labelProjectName: "Project Name",
    btnStartNewProject: "✨ New Project",
    slotsHeading: "💾 Save Slots (5 Slots)",
    // Component Names
    arduino_uno: "Arduino UNO",
    breadboard: "Breadboard",
    led_red: "LED (Red)",
    resistor: "Resistor (220Ω)",
    jumper_wire: "Jumper Wire",
    button: "Push Button",
    sensor: "Light Sensor"
  }
};

class I18nManager {
  constructor() {
    this.currentLocale = 'ko';
  }

  setLocale(locale) {
    if (translations[locale]) {
      this.currentLocale = locale;
      this.updateDOM();
    }
  }

  t(key) {
    return translations[this.currentLocale][key] || key;
  }

  updateDOM() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[this.currentLocale][key]) {
        el.textContent = translations[this.currentLocale][key];
      }
    });
  }
}

window.i18n = new I18nManager();
