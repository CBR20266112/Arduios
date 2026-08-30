/* ==========================================================================
   State Management & Storage Manager (Store.js)
   ========================================================================== */

const STORAGE_KEY = 'arduino_simulator_v1_store';

class AppStore {
  constructor() {
    this.state = {
      currentScreen: 'title', // 'title' | 'workspace'
      isDrawerOpen: false,
      isSettingsOpen: false,
      isProjectModalOpen: false,
      currentProjectName: '내 회로 프로젝트 #1',
      currentSlotIndex: null, // null or 0..4
      slots: [null, null, null, null, null], // 5 slots
      settings: {
        language: 'ko',
        showGrid: true,
        highContrast: false,
        longPressMs: 2000
      },
      workspace: {
        zoomScale: 1.0,
        placedComponents: [],
        wires: []
      }
    };
    
    this.listeners = [];
    this.loadFromStorage();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
    this.saveToStorage();
  }

  setScreen(screenName) {
    this.state.currentScreen = screenName;
    this.notify();
  }

  setDrawerOpen(isOpen) {
    this.state.isDrawerOpen = isOpen;
    this.notify();
  }

  setSettingsOpen(isOpen) {
    this.state.isSettingsOpen = isOpen;
    this.notify();
  }

  setProjectModalOpen(isOpen) {
    this.state.isProjectModalOpen = isOpen;
    this.notify();
  }

  setCurrentProjectName(name) {
    this.state.currentProjectName = name;
    this.notify();
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    if (newSettings.language) {
      window.i18n.setLocale(newSettings.language);
    }
    this.notify();
  }

  setZoomScale(scale) {
    // Clamped between 50% and 200%
    const clamped = Math.max(0.5, Math.min(2.0, scale));
    this.state.workspace.zoomScale = parseFloat(clamped.toFixed(2));
    this.notify();
  }

  addPlacedComponent(componentData) {
    this.state.workspace.placedComponents.push(componentData);
    this.notify();
  }

  removePlacedComponent(id) {
    this.state.workspace.placedComponents = this.state.workspace.placedComponents.filter(c => c.id !== id);
    // Also remove any connected wires
    this.state.workspace.wires = this.state.workspace.wires.filter(
      w => w.fromComponentId !== id && w.toComponentId !== id
    );
    this.notify();
  }

  addWire(wireData) {
    // Avoid duplicate wires between same pins
    const exists = this.state.workspace.wires.some(
      w => (w.fromComponentId === wireData.fromComponentId && w.fromPinId === wireData.fromPinId &&
            w.toComponentId === wireData.toComponentId && w.toPinId === wireData.toPinId) ||
           (w.fromComponentId === wireData.toComponentId && w.fromPinId === wireData.toPinId &&
            w.toComponentId === wireData.fromComponentId && w.toPinId === wireData.fromPinId)
    );

    if (!exists) {
      this.state.workspace.wires.push({
        id: 'wire_' + Date.now() + '_' + Math.floor(Math.random()*1000),
        ...wireData
      });
      this.notify();
    }
  }

  removeWire(id) {
    this.state.workspace.wires = this.state.workspace.wires.filter(w => w.id !== id);
    this.notify();
  }

  clearWorkspace() {
    this.state.workspace.placedComponents = [];
    this.state.workspace.wires = [];
    this.state.workspace.zoomScale = 1.0;
    this.notify();
  }

  /* 예시 회로 일괄 로드 */
  loadExampleCircuit({ placedComponents, wires }) {
    this.state.workspace.placedComponents = placedComponents;
    this.state.workspace.wires = wires;
    this.state.workspace.zoomScale = 1.0;
    this.state.currentProjectName = 'LED 켜기 예시 회로';
    this.notify();
  }

  /* -----------------------------------------------------------------------
     슬롯 관리 메서드 (saveToSlot, loadFromSlot, deleteSlot, startNewProject)
     ----------------------------------------------------------------------- */
  saveToSlot(slotIndex, projectName) {
    if (slotIndex < 0 || slotIndex >= 5) return;

    const nameToSave = projectName || this.state.currentProjectName || `프로젝트 #${slotIndex + 1}`;
    this.state.currentProjectName = nameToSave;
    this.state.currentSlotIndex = slotIndex;

    this.state.slots[slotIndex] = {
      name: nameToSave,
      savedAt: new Date().toISOString(),
      workspace: JSON.parse(JSON.stringify(this.state.workspace))
    };

    this.notify();
  }

  loadFromSlot(slotIndex) {
    if (slotIndex < 0 || slotIndex >= 5) return;
    const slot = this.state.slots[slotIndex];
    if (!slot || !slot.workspace) return;

    this.state.currentSlotIndex = slotIndex;
    this.state.currentProjectName = slot.name || `프로젝트 #${slotIndex + 1}`;
    this.state.workspace = JSON.parse(JSON.stringify(slot.workspace));

    this.notify();
  }

  deleteSlot(slotIndex) {
    if (slotIndex < 0 || slotIndex >= 5) return;
    this.state.slots[slotIndex] = null;
    if (this.state.currentSlotIndex === slotIndex) {
      this.state.currentSlotIndex = null;
    }
    this.notify();
  }

  startNewProject() {
    this.state.currentSlotIndex = null;
    this.state.currentProjectName = `내 회로 프로젝트 #${Date.now().toString().slice(-3)}`;
    this.state.workspace = {
      zoomScale: 1.0,
      placedComponents: [],
      wires: []
    };
    this.notify();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.settings && typeof parsed.settings === 'object') {
          this.state.settings = { ...this.state.settings, ...parsed.settings };
          if (this.state.settings.language) {
            window.i18n.setLocale(this.state.settings.language);
          }
        }
        if (parsed.workspace && typeof parsed.workspace === 'object') {
          if (Array.isArray(parsed.workspace.placedComponents)) {
            this.state.workspace.placedComponents = parsed.workspace.placedComponents;
          }
          if (Array.isArray(parsed.workspace.wires)) {
            this.state.workspace.wires = parsed.workspace.wires;
          } else {
            this.state.workspace.wires = [];
          }
          if (typeof parsed.workspace.zoomScale === 'number') {
            this.state.workspace.zoomScale = parsed.workspace.zoomScale;
          }
        }
        if (typeof parsed.currentProjectName === 'string') {
          this.state.currentProjectName = parsed.currentProjectName;
        }
        if (typeof parsed.currentSlotIndex === 'number' || parsed.currentSlotIndex === null) {
          this.state.currentSlotIndex = parsed.currentSlotIndex;
        }
        if (Array.isArray(parsed.slots) && parsed.slots.length === 5) {
          this.state.slots = parsed.slots;
        }
      }
    } catch (e) {
      console.warn('Failed to load store from localStorage, resetting to default', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: this.state.settings,
        workspace: this.state.workspace,
        currentProjectName: this.state.currentProjectName,
        currentSlotIndex: this.state.currentSlotIndex,
        slots: this.state.slots
      }));
    } catch (e) {
      console.warn('Failed to save store to localStorage', e);
    }
  }
}

window.store = new AppStore();
