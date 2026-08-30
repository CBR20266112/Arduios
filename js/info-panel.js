/* ==========================================================================
   Info Panel Manager (info-panel.js)
   선택된 부품 / 핀 / 와이어 정보를 하단 슬라이드업 패널에 표시합니다.
   ========================================================================== */

class InfoPanelManager {
  constructor() {
    this.panelEl = null;
    this.bodyEl  = null;
    this.isOpen  = false;
    this.init();
  }

  init() {
    this.panelEl = document.getElementById('info-panel');
    this.bodyEl  = document.getElementById('info-panel-body');
    if (!this.panelEl) return;

    // 탭(핸들) 클릭 → 접기/펼치기 토글
    document.getElementById('info-panel-tab')?.addEventListener('click', () => {
      this.isOpen ? this.collapse() : this.expand();
    });

    // 기본 안내 상태로 초기화
    this.reset();
  }

  /* -----------------------------------------------------------------------
     상태별 표시
     ----------------------------------------------------------------------- */

  /** 부품 선택 시 호출 */
  showComponent(comp, def) {
    const { wires } = window.store.state.workspace;
    const connectedWires = wires.filter(
      w => w.fromComponentId === comp.id || w.toComponentId === comp.id
    );
    const locale = window.store?.state?.settings?.language || 'ko';

    const name  = locale === 'ko' ? def.nameKo : def.nameEn;
    const pins  = def.pins?.length ?? 0;
    const wCnt  = connectedWires.length;

    const pinsLabel  = locale === 'ko' ? '핀' : 'pins';
    const wLabel     = locale === 'ko' ? '연결된 선' : 'wires connected';
    const clickLabel = locale === 'ko' ? '파란 점을 눌러 핀을 선택하세요' : 'Tap a blue dot to select a pin';

    this.bodyEl.innerHTML = `
      <div class="info-row">
        <span class="info-icon">${def.icon || '🔲'}</span>
        <div class="info-main">
          <span class="info-name">${name}</span>
          <span class="info-meta">${pins} ${pinsLabel} &nbsp;·&nbsp; ${wCnt} ${wLabel}</span>
        </div>
      </div>
      <div class="info-hint">${clickLabel}</div>
    `;
    this.expand();
  }

  /** 핀 포트 선택 시 호출 (첫 번째 선택 단계) */
  showPin(comp, pin, def) {
    const { wires, placedComponents } = window.store.state.workspace;
    const locale = window.store?.state?.settings?.language || 'ko';

    const compName = locale === 'ko' ? def.nameKo : def.nameEn;

    // 이 핀에 연결된 와이어 찾기
    const connected = wires.filter(
      w => (w.fromComponentId === comp.id && w.fromPinId === pin.id) ||
           (w.toComponentId   === comp.id && w.toPinId   === pin.id)
    );

    let connectedHTML = '';
    if (connected.length === 0) {
      connectedHTML = `<span class="info-empty">${locale === 'ko' ? '아직 연결 없음' : 'No connections yet'}</span>`;
    } else {
      connectedHTML = connected.map(wire => {
        // 상대 핀 정보 파악
        const isFrom = wire.fromComponentId === comp.id && wire.fromPinId === pin.id;
        const otherCompId = isFrom ? wire.toComponentId   : wire.fromComponentId;
        const otherPinId  = isFrom ? wire.toPinId         : wire.fromPinId;
        const otherComp   = placedComponents.find(c => c.id === otherCompId);
        const otherDef    = window.COMPONENT_DEFINITIONS?.find(d => d.id === otherComp?.typeId);
        const otherPin    = otherDef?.pins?.find(p => p.id === otherPinId);
        const otherName   = otherDef ? (locale === 'ko' ? otherDef.nameKo : otherDef.nameEn) : '?';
        return `<div class="info-wire-row" style="color:${wire.color}">
          🔌 <strong>${otherName}</strong> [${otherPin?.label || otherPinId}]
        </div>`;
      }).join('');
    }

    const selectingLabel = locale === 'ko'
      ? '📍 핀 선택 중 — 다른 핀을 눌러 연결하세요'
      : '📍 Pin selected — tap another pin to connect';

    this.bodyEl.innerHTML = `
      <div class="info-row">
        <span class="info-icon" style="background:#E63946">📍</span>
        <div class="info-main">
          <span class="info-name">${pin.label} <span class="info-dim">(${compName})</span></span>
          <span class="info-meta selecting-badge">${selectingLabel}</span>
        </div>
      </div>
      <div class="info-connections">${connectedHTML}</div>
    `;
    this.expand();
  }

  /** 와이어 클릭 시 호출 */
  showWire(wire) {
    const { placedComponents } = window.store.state.workspace;
    const locale = window.store?.state?.settings?.language || 'ko';

    const fromComp = placedComponents.find(c => c.id === wire.fromComponentId);
    const toComp   = placedComponents.find(c => c.id === wire.toComponentId);
    const fromDef  = window.COMPONENT_DEFINITIONS?.find(d => d.id === fromComp?.typeId);
    const toDef    = window.COMPONENT_DEFINITIONS?.find(d => d.id === toComp?.typeId);
    const fromPin  = fromDef?.pins?.find(p => p.id === wire.fromPinId);
    const toPin    = toDef?.pins?.find(p => p.id === wire.toPinId);

    const fromName = fromDef ? (locale === 'ko' ? fromDef.nameKo : fromDef.nameEn) : '?';
    const toName   = toDef   ? (locale === 'ko' ? toDef.nameKo   : toDef.nameEn)   : '?';
    const tapLabel = locale === 'ko' ? '선을 눌러 연결 해제 가능' : 'Tap wire to disconnect';

    this.bodyEl.innerHTML = `
      <div class="info-row">
        <span class="info-icon wire-color-dot" style="background:${wire.color}">🔌</span>
        <div class="info-main">
          <span class="info-name">
            <strong>${fromName}</strong> <span class="info-pin-badge">${fromPin?.label || wire.fromPinId}</span>
            <span class="info-arrow">→</span>
            <strong>${toName}</strong> <span class="info-pin-badge">${toPin?.label || wire.toPinId}</span>
          </span>
          <span class="info-meta">${tapLabel}</span>
        </div>
      </div>
    `;
    this.expand();
  }

  /** 선택 해제 / 빈 공간 클릭 시 */
  reset() {
    const locale = window.store?.state?.settings?.language || 'ko';
    const msg = locale === 'ko'
      ? '💡 부품이나 선을 눌러 정보를 확인하세요'
      : '💡 Tap a component or wire to see info';
    if (this.bodyEl) {
      this.bodyEl.innerHTML = `<div class="info-placeholder">${msg}</div>`;
    }
    this.collapse();
  }

  /* -----------------------------------------------------------------------
     패널 열기 / 닫기
     ----------------------------------------------------------------------- */
  expand() {
    if (!this.panelEl) return;
    this.panelEl.classList.add('open');
    this.isOpen = true;
    const tabIcon = document.getElementById('info-panel-tab-icon');
    if (tabIcon) tabIcon.textContent = '▼';
  }

  collapse() {
    if (!this.panelEl) return;
    this.panelEl.classList.remove('open');
    this.isOpen = false;
    const tabIcon = document.getElementById('info-panel-tab-icon');
    if (tabIcon) tabIcon.textContent = '▲';
  }
}

window.infoPanel = new InfoPanelManager();
