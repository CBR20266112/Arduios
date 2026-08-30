/* ==========================================================================
   Tutorial Manager & Example Circuit Loader (tutorial.js)
   ========================================================================== */

/* -------------------------------------------------------------------------
   튜토리얼 슬라이드 데이터 (한/영 통합)
   -------------------------------------------------------------------------*/
const TUTORIAL_SLIDES = {
  ko: [
    {
      step: 1,
      icon: '🧰',
      title: '부품을 꺼내세요',
      desc: '화면 아래 <strong>[부품]</strong> 버튼을 누르면 부품 보관함이 열립니다. <br><br>아두이노 UNO, LED, 저항을 꺼내 작업 공간에 놓아 보세요.',
      tip: '부품을 꺼내면 파란 점(핀 포트)이 나타납니다.'
    },
    {
      step: 2,
      icon: '🔌',
      title: '핀을 연결하세요',
      desc: '파란 점(핀 포트)을 누르면 빨간 링이 생깁니다. <br><br>첫 번째 핀을 누른 뒤, 연결하고 싶은 다른 부품의 핀을 누르면 두 핀이 선으로 이어집니다.',
      tip: '선을 지우려면 선 위를 눌러 "선 연결 해제"를 선택하세요.'
    },
    {
      step: 3,
      icon: '💡',
      title: '예시 회로를 따라해보세요',
      desc: '아래 <strong>[예시 회로 불러오기]</strong> 버튼을 누르면 <br>"LED 켜기" 기초 회로가 자동으로 배치됩니다. <br><br>D13 → 저항 → LED(+) → LED(-) → GND 흐름을 확인해 보세요.',
      tip: '이 연결 흐름이 아두이노 기초 회로의 핵심입니다!'
    }
  ],
  en: [
    {
      step: 1,
      icon: '🧰',
      title: 'Add Components',
      desc: 'Tap the <strong>[Components]</strong> button at the bottom to open the component drawer. <br><br>Place an Arduino UNO, LED, and Resistor on the workspace.',
      tip: 'Blue dots (pin ports) appear on each component.'
    },
    {
      step: 2,
      icon: '🔌',
      title: 'Connect Pins',
      desc: 'Tap a blue dot to select it (a red ring appears). <br><br>Then tap another pin on a different component — they will be connected by a wire.',
      tip: 'To remove a wire, tap it and select "Disconnect Wire".'
    },
    {
      step: 3,
      icon: '💡',
      title: 'Try the Example Circuit',
      desc: 'Tap <strong>[Load Example Circuit]</strong> below to automatically place the "LED ON" starter circuit. <br><br>Follow the D13 → Resistor → LED(+) → LED(-) → GND connection flow.',
      tip: 'This connection pattern is the foundation of Arduino circuits!'
    }
  ]
};

/* -------------------------------------------------------------------------
   예시 회로 데이터: Arduino UNO + 저항 + LED
   D13 → 저항(pin_1), 저항(pin_2) → LED(anode), LED(cathode) → GND
   -------------------------------------------------------------------------*/
const EXAMPLE_CIRCUIT = {
  components: [
    { typeId: 'arduino_uno', x: 60, y: 80 },
    { typeId: 'resistor',    x: 230, y: 70 },
    { typeId: 'led_red',     x: 290, y: 110 }
  ],
  wires: [
    // D13 → 저항 pin_1
    { fromTypeId: 'arduino_uno', fromPinId: 'D13',     toTypeId: 'resistor',  toPinId: 'pin_1', color: '#E63946' },
    // 저항 pin_2 → LED anode(+)
    { fromTypeId: 'resistor',    fromPinId: 'pin_2',   toTypeId: 'led_red',   toPinId: 'anode', color: '#E63946' },
    // LED cathode(-) → GND
    { fromTypeId: 'led_red',     fromPinId: 'cathode', toTypeId: 'arduino_uno', toPinId: 'GND',  color: '#0077B6' }
  ]
};

/* -------------------------------------------------------------------------
   TutorialManager 클래스
   -------------------------------------------------------------------------*/
class TutorialManager {
  constructor() {
    this.currentSlide = 0;
    this.modalEl = null;
    this.init();
  }

  init() {
    this.modalEl = document.getElementById('tutorial-modal');
    if (!this.modalEl) return;

    document.getElementById('btn-tutorial-close')?.addEventListener('click', () => this.close());
    document.getElementById('btn-tutorial-prev')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('btn-tutorial-next')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('btn-load-example')?.addEventListener('click', () => {
      this.close();
      this.loadExampleCircuit();
    });

    // 빈 화면 "따라해보기" 버튼
    document.getElementById('btn-try-tutorial')?.addEventListener('click', () => this.open());

    // ? 버튼 (타이틀 / 워크스페이스 공통)
    document.getElementById('btn-title-help')?.addEventListener('click', () => this.open());
    document.getElementById('btn-workspace-help')?.addEventListener('click', () => this.open());

    // 모달 배경 클릭 시 닫기
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });
  }

  open() {
    this.currentSlide = 0;
    this.renderSlide();
    this.modalEl.classList.remove('hidden');
    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.add('hidden');
    this.modalEl.classList.remove('active');
  }

  renderSlide() {
    const locale = window.store?.state?.settings?.language || 'ko';
    const slides = TUTORIAL_SLIDES[locale] || TUTORIAL_SLIDES.ko;
    const slide = slides[this.currentSlide];
    const total = slides.length;

    // 아이콘, 제목, 설명 업데이트
    document.getElementById('tut-icon').textContent = slide.icon;
    document.getElementById('tut-title').textContent = slide.title;
    document.getElementById('tut-desc').innerHTML = slide.desc;
    document.getElementById('tut-tip').textContent = `💡 ${slide.tip}`;

    // 스텝 인디케이터
    const dots = document.querySelectorAll('.tut-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentSlide));

    // 이전/다음 버튼 상태
    const prevBtn = document.getElementById('btn-tutorial-prev');
    const nextBtn = document.getElementById('btn-tutorial-next');
    if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = this.currentSlide === total - 1;

    // 마지막 슬라이드일 때 예시 회로 버튼 노출
    const exampleBtn = document.getElementById('btn-load-example');
    if (exampleBtn) {
      exampleBtn.style.display = this.currentSlide === total - 1 ? 'block' : 'none';
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.renderSlide();
    }
  }

  nextSlide() {
    const locale = window.store?.state?.settings?.language || 'ko';
    const total = (TUTORIAL_SLIDES[locale] || TUTORIAL_SLIDES.ko).length;
    if (this.currentSlide < total - 1) {
      this.currentSlide++;
      this.renderSlide();
    }
  }

  /* -----------------------------------------------------------------------
     예시 회로 자동 로드
     -----------------------------------------------------------------------*/
  loadExampleCircuit() {
    const hasComponents = window.store.state.workspace.placedComponents.length > 0;
    if (hasComponents) {
      const locale = window.store?.state?.settings?.language || 'ko';
      const msg = locale === 'ko'
        ? '현재 작업 중인 부품과 연결선이 모두 지워집니다.\n예시 회로를 불러올까요?'
        : 'All current components and wires will be cleared.\nLoad the example circuit?';
      if (!confirm(msg)) return;
    }

    // 기존 작업 초기화
    window.store.clearWorkspace();

    // 부품 + 연결선 자동 배치
    const placedComponents = [];
    EXAMPLE_CIRCUIT.components.forEach(template => {
      const id = 'comp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      placedComponents.push({ id, typeId: template.typeId, x: template.x, y: template.y });
    });

    const wires = [];
    EXAMPLE_CIRCUIT.wires.forEach(wireTemplate => {
      const fromComp = placedComponents.find(c => c.typeId === wireTemplate.fromTypeId);
      const toComp   = placedComponents.find(c => c.typeId === wireTemplate.toTypeId);
      if (!fromComp || !toComp) return;
      wires.push({
        id: 'wire_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        fromComponentId: fromComp.id,
        fromPinId: wireTemplate.fromPinId,
        toComponentId: toComp.id,
        toPinId: wireTemplate.toPinId,
        color: wireTemplate.color || '#E63946'
      });
    });

    window.store.loadExampleCircuit({ placedComponents, wires });

    // 워크스페이스 화면 전환 (타이틀 화면에 있을 경우)
    if (window.store.state.currentScreen !== 'workspace') {
      window.store.setScreen('workspace');
    }

    // 회로 설명 토스트 메시지 표시
    this.showCircuitToast();
  }

  /* 예시 회로 설명 토스트 */
  showCircuitToast() {
    const locale = window.store?.state?.settings?.language || 'ko';
    const msg = locale === 'ko'
      ? '💡 LED 켜기 회로가 배치됐습니다!\nD13 → 저항 → LED(+) → LED(-) → GND 흐름을 확인해보세요.'
      : '💡 LED ON circuit loaded!\nCheck the D13 → Resistor → LED(+) → LED(-) → GND connections.';

    const toast = document.createElement('div');
    toast.className = 'circuit-toast';
    toast.innerHTML = msg.replace('\n', '<br>');
    document.body.appendChild(toast);

    // 3.5초 후 자동 제거
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

window.tutorialManager = new TutorialManager();
