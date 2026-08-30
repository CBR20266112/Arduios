/* ==========================================================================
   Workspace Canvas & Wire Connections Manager (workspace.js)
   ========================================================================== */

class WorkspaceManager {
  constructor() {
    this.canvasEl = document.getElementById('circuit-canvas');
    this.componentsLayerEl = document.getElementById('placed-components-layer');
    this.wiresSvgEl = document.getElementById('wires-layer');
    this.emptyNoticeEl = document.getElementById('empty-workspace-notice');
    this.zoomBadgeEl = document.getElementById('zoom-level-badge');

    this.activeDragItem = null;
    this.activePointerId = null;
    this.startClientX = 0;
    this.startClientY = 0;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.longPressTimer = null;

    // Pin connection state
    this.activeStartPin = null; // { componentId, pinId, x, y }

    this.init();
  }

  init() {
    // Subscribe to store updates
    window.store.subscribe((state) => this.render(state));

    // Zoom control buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      window.store.setZoomScale(window.store.state.workspace.zoomScale + 0.1);
    });

    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      window.store.setZoomScale(window.store.state.workspace.zoomScale - 0.1);
    });

    document.getElementById('btn-zoom-fit')?.addEventListener('click', () => {
      window.store.setZoomScale(1.0);
    });

    // Global Pointer move & up handlers for drag & drop
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    // Canvas background click — 선택 취소 + 정보 패널 초기화
    // e.target이 캔버스, SVG 레이어, 컴포넌트 레이어 컨테이너 자체일 때만 처리
    this.canvasEl?.addEventListener('click', (e) => {
      const isBackground =
        e.target === this.canvasEl ||
        e.target === this.wiresSvgEl ||
        e.target === this.componentsLayerEl;
      if (isBackground) {
        this.clearActiveStartPin();
        window.infoPanel?.reset();
      }
    });
  }

  render(state) {
    const { zoomScale, placedComponents, wires } = state.workspace;
    const { showGrid } = state.settings;

    // 1. Grid Toggle
    if (showGrid) {
      this.canvasEl.classList.add('grid-enabled');
    } else {
      this.canvasEl.classList.remove('grid-enabled');
    }

    // 2. Zoom level badge & canvas transform
    if (this.zoomBadgeEl) {
      this.zoomBadgeEl.textContent = `${Math.round(zoomScale * 100)}%`;
    }
    this.componentsLayerEl.style.transform = `scale(${zoomScale})`;
    this.componentsLayerEl.style.transformOrigin = 'top left';
    this.wiresSvgEl.style.transform = `scale(${zoomScale})`;
    this.wiresSvgEl.style.transformOrigin = 'top left';

    // 3. Empty notice toggle
    if (placedComponents.length === 0) {
      this.emptyNoticeEl.style.display = 'flex';
    } else {
      this.emptyNoticeEl.style.display = 'none';
    }

    // 4. Render placed components & their pin ports
    this.componentsLayerEl.innerHTML = '';
    placedComponents.forEach((comp) => {
      const def = window.COMPONENT_DEFINITIONS.find(d => d.id === comp.typeId);
      if (!def) return;

      const compEl = document.createElement('div');
      compEl.className = 'placed-component';
      compEl.dataset.id = comp.id;
      compEl.style.left = `${comp.x}px`;
      compEl.style.top = `${comp.y}px`;
      compEl.style.cursor = 'grab';
      compEl.innerHTML = def.renderSvg;

      // Render Pin Ports on Component
      if (def.pins && Array.isArray(def.pins)) {
        def.pins.forEach(pin => {
          const pinEl = document.createElement('div');
          pinEl.className = 'pin-port';
          pinEl.dataset.compId = comp.id;
          pinEl.dataset.pinId = pin.id;
          pinEl.title = `${def.nameKo} - ${pin.label}`;
          pinEl.style.left = `${pin.xRel}px`;
          pinEl.style.top = `${pin.yRel}px`;

          if (this.activeStartPin &&
              this.activeStartPin.componentId === comp.id &&
              this.activeStartPin.pinId === pin.id) {
            pinEl.classList.add('active');
          }

          pinEl.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
          });

          pinEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handlePinClick(comp.id, pin.id, pin.label);
          });

          compEl.appendChild(pinEl);
        });
      }

      // Pointer down event for drag & long-press
      compEl.addEventListener('pointerdown', (e) => this.handlePointerDown(e, comp));

      // Component body TAP (click without drag) — 정보 패널 표시
      compEl.addEventListener('click', (e) => {
        // pin click 이벤트가 stopPropagation하므로, 여기는 오직 바디 영역 클릭만 소마
        if (!e.target.classList.contains('pin-port')) {
          const def = window.COMPONENT_DEFINITIONS?.find(d => d.id === comp.typeId);
          if (def) window.infoPanel?.showComponent(comp, def);
        }
      });

      this.componentsLayerEl.appendChild(compEl);
    });

    // 5. Render wires
    this.renderWires(wires, placedComponents);
  }

  handlePinClick(componentId, pinId, pinLabel) {
    const { placedComponents } = window.store.state.workspace;
    const comp = placedComponents.find(c => c.id === componentId);
    const def  = window.COMPONENT_DEFINITIONS?.find(d => d.id === comp?.typeId);
    const pin  = def?.pins?.find(p => p.id === pinId);

    if (!this.activeStartPin) {
      // First pin selection — 정보 패널 표시
      this.activeStartPin = { componentId, pinId };
      if (comp && def && pin) window.infoPanel?.showPin(comp, pin, def);
      this.render(window.store.state);
    } else {
      // Second pin selection
      if (this.activeStartPin.componentId === componentId && this.activeStartPin.pinId === pinId) {
        // Same pin clicked: cancel
        this.clearActiveStartPin();
        window.infoPanel?.reset();
      } else {
        // Connect wire
        const wireColors = ['#E63946', '#0077B6', '#38B000', '#FFB703', '#9C27B0', '#000000'];
        const color = wireColors[Math.floor(Math.random() * wireColors.length)];

        window.store.addWire({
          fromComponentId: this.activeStartPin.componentId,
          fromPinId: this.activeStartPin.pinId,
          toComponentId: componentId,
          toPinId: pinId,
          color: color
        });

        this.clearActiveStartPin();
        window.infoPanel?.reset();
      }
    }
  }

  clearActiveStartPin() {
    this.activeStartPin = null;
    this.render(window.store.state);
  }

  renderWires(wires = [], components = []) {
    this.wiresSvgEl.innerHTML = '';
    if (!wires || wires.length === 0) return;

    // Enable pointer events at the SVG level for wire paths
    this.wiresSvgEl.style.pointerEvents = 'none';

    wires.forEach(wire => {
      const fromComp = components.find(c => c.id === wire.fromComponentId);
      const toComp = components.find(c => c.id === wire.toComponentId);
      if (!fromComp || !toComp) return;

      const fromDef = window.COMPONENT_DEFINITIONS.find(d => d.id === fromComp.typeId);
      const toDef = window.COMPONENT_DEFINITIONS.find(d => d.id === toComp.typeId);
      if (!fromDef || !toDef) return;

      const fromPin = fromDef.pins?.find(p => p.id === wire.fromPinId);
      const toPin = toDef.pins?.find(p => p.id === wire.toPinId);
      if (!fromPin || !toPin) return;

      const x1 = fromComp.x + fromPin.xRel;
      const y1 = fromComp.y + fromPin.yRel;
      const x2 = toComp.x + toPin.xRel;
      const y2 = toComp.y + toPin.yRel;

      const dx = Math.abs(x2 - x1) * 0.4;
      const dy = Math.abs(y2 - y1) * 0.4;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1 + dy + 20}, ${x2 - dx} ${y2 + dy + 20}, ${x2} ${y2}`;

      // Invisible thick hit-area path for easy touch/click
      const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitPath.setAttribute('d', d);
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '18');
      hitPath.setAttribute('fill', 'none');
      hitPath.style.cursor = 'pointer';
      hitPath.style.pointerEvents = 'stroke';

      hitPath.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showWireDeleteTooltip(wire, e.clientX, e.clientY);
        window.infoPanel?.showWire(wire);
      });

      // Visible wire path (no pointer events – hit-area handles events)
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.classList.add('wire-path');
      pathEl.dataset.id = wire.id;
      pathEl.setAttribute('stroke', wire.color || '#E63946');
      pathEl.setAttribute('d', d);
      pathEl.style.pointerEvents = 'none';

      this.wiresSvgEl.appendChild(hitPath);
      this.wiresSvgEl.appendChild(pathEl);
    });
  }

  updateWiresForComponent(compId) {
    const { wires, placedComponents } = window.store.state.workspace;
    if (!wires || wires.length === 0) return;

    wires.forEach(wire => {
      if (wire.fromComponentId !== compId && wire.toComponentId !== compId) return;

      const fromComp = placedComponents.find(c => c.id === wire.fromComponentId);
      const toComp = placedComponents.find(c => c.id === wire.toComponentId);
      if (!fromComp || !toComp) return;

      const fromDef = window.COMPONENT_DEFINITIONS.find(d => d.id === fromComp.typeId);
      const toDef = window.COMPONENT_DEFINITIONS.find(d => d.id === toComp.typeId);
      if (!fromDef || !toDef) return;

      const fromPin = fromDef.pins?.find(p => p.id === wire.fromPinId);
      const toPin = toDef.pins?.find(p => p.id === wire.toPinId);
      if (!fromPin || !toPin) return;

      const x1 = fromComp.x + fromPin.xRel;
      const y1 = fromComp.y + fromPin.yRel;
      const x2 = toComp.x + toPin.xRel;
      const y2 = toComp.y + toPin.yRel;

      const dx = Math.abs(x2 - x1) * 0.4;
      const dy = Math.abs(y2 - y1) * 0.4;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1 + dy + 20}, ${x2 - dx} ${y2 + dy + 20}, ${x2} ${y2}`;

      // Update both visible path and hit-area path (data-id is only on visible path)
      const visiblePath = this.wiresSvgEl.querySelector(`path[data-id="${wire.id}"]`);
      if (visiblePath) visiblePath.setAttribute('d', d);

      // Hit-area is immediately before the visible path in the DOM
      if (visiblePath && visiblePath.previousSibling) {
        visiblePath.previousSibling.setAttribute('d', d);
      }
    });
  }

  showWireDeleteTooltip(wire, clientX, clientY) {
    const existing = document.getElementById('wire-delete-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.id = 'wire-delete-tooltip';
    tooltip.className = 'putback-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${clientX - 45}px`;
    tooltip.style.top = `${clientY - 45}px`;
    tooltip.style.zIndex = '1000';
    tooltip.style.background = '#E63946';
    tooltip.style.color = '#FFF';
    tooltip.style.padding = '6px 12px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.fontSize = '0.85rem';
    tooltip.style.fontWeight = 'bold';
    tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    tooltip.style.cursor = 'pointer';
    tooltip.innerHTML = `✂️ 선 연결 해제`;

    tooltip.addEventListener('click', () => {
      window.store.removeWire(wire.id);
      tooltip.remove();
    });

    document.body.appendChild(tooltip);

    setTimeout(() => {
      if (tooltip.parentNode) tooltip.remove();
    }, 3000);
  }

  spawnComponent(typeId) {
    const def = window.COMPONENT_DEFINITIONS.find(d => d.id === typeId);
    if (!def) return;

    // Calculate center placement
    const canvasRect = this.canvasEl.getBoundingClientRect();
    const centerX = (canvasRect.width / 2) - (def.width / 2);
    const centerY = (canvasRect.height / 2) - (def.height / 2);

    const newComponent = {
      id: 'comp_' + Date.now() + '_' + Math.floor(Math.random()*1000),
      typeId: typeId,
      x: Math.max(20, centerX),
      y: Math.max(20, centerY),
      rotation: 0
    };

    window.store.addPlacedComponent(newComponent);
  }

  handlePointerDown(e, comp) {
    e.stopPropagation();
    const compEl = e.currentTarget;
    compEl.style.cursor = 'grabbing';

    try {
      compEl.setPointerCapture(e.pointerId);
    } catch (err) {}

    this.activeDragItem = comp;
    this.activePointerId = e.pointerId;
    this.startClientX = e.clientX;
    this.startClientY = e.clientY;
    this.dragOffsetX = e.clientX - comp.x;
    this.dragOffsetY = e.clientY - comp.y;

    // Start 2-second Long-Press Timer for Put-Back (집어넣기)
    clearTimeout(this.longPressTimer);
    this.longPressTimer = setTimeout(() => {
      this.showPutBackPopup(comp, e.clientX, e.clientY);
    }, window.store.state.settings.longPressMs || 2000);
  }

  handlePointerMove(e) {
    if (!this.activeDragItem) return;

    // Calculate move distance threshold (6px)
    const moveDist = Math.hypot(e.clientX - this.startClientX, e.clientY - this.startClientY);
    if (moveDist > 6) {
      clearTimeout(this.longPressTimer);
    }

    const newX = e.clientX - this.dragOffsetX;
    const newY = e.clientY - this.dragOffsetY;

    this.activeDragItem.x = newX;
    this.activeDragItem.y = newY;

    const compEl = this.componentsLayerEl.querySelector(`[data-id="${this.activeDragItem.id}"]`);
    if (compEl) {
      compEl.style.left = `${newX}px`;
      compEl.style.top = `${newY}px`;
    }

    // Real-time update connected wires position as component moves!
    this.updateWiresForComponent(this.activeDragItem.id);
  }

  handlePointerUp(e) {
    clearTimeout(this.longPressTimer);
    if (this.activeDragItem) {
      const compEl = this.componentsLayerEl.querySelector(`[data-id="${this.activeDragItem.id}"]`);
      if (compEl) {
        compEl.style.cursor = 'grab';
        if (this.activePointerId !== null) {
          try {
            compEl.releasePointerCapture(this.activePointerId);
          } catch (err) {}
        }
      }
      this.activeDragItem = null;
      this.activePointerId = null;
      window.store.saveToStorage();
    }
  }

  showPutBackPopup(comp, clientX, clientY) {
    const existing = document.getElementById('putback-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.id = 'putback-tooltip';
    tooltip.className = 'putback-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${clientX - 40}px`;
    tooltip.style.top = `${clientY - 50}px`;
    tooltip.style.zIndex = '1000';
    tooltip.style.background = '#2B2D42';
    tooltip.style.color = '#FFF';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.fontSize = '0.85rem';
    tooltip.style.fontWeight = 'bold';
    tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    tooltip.style.cursor = 'pointer';
    tooltip.innerHTML = `🗑️ ${window.i18n.t('putBack')}`;

    tooltip.addEventListener('click', () => {
      window.store.removePlacedComponent(comp.id);
      tooltip.remove();
    });

    document.body.appendChild(tooltip);

    setTimeout(() => {
      if (tooltip.parentNode) tooltip.remove();
    }, 3000);
  }
}

window.workspaceManager = new WorkspaceManager();
