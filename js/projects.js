/* ==========================================================================
   Project Manager (projects.js)
   5개 슬롯 기반 프로젝트 저장, 불러오기, 삭제, 이름 변경 및 confirmation 관리
   ========================================================================== */

class ProjectManager {
  constructor() {
    this.modalEl = null;
    this.slotsContainerEl = null;
    this.nameInputEl = null;
    this.init();
  }

  init() {
    this.modalEl = document.getElementById('project-modal');
    this.slotsContainerEl = document.getElementById('project-slots-list');
    this.nameInputEl = document.getElementById('project-name-input');

    if (!this.modalEl) return;

    // Header 💾 저장 버튼 & 프로젝트 드롭다운 클릭시 모달 오픈
    const openModal = () => this.open();
    document.getElementById('btn-save-project')?.addEventListener('click', openModal);
    document.getElementById('project-select')?.addEventListener('click', openModal);

    // 닫기 버튼 & 배경 클릭
    document.getElementById('btn-close-project-modal')?.addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // 프로젝트 이름 변경 입력창 이벤트
    this.nameInputEl?.addEventListener('change', (e) => {
      const newName = e.target.value.trim() || '내 회로 프로젝트';
      window.store.setCurrentProjectName(newName);
    });

    // 새 프로젝트 시작 버튼
    document.getElementById('btn-new-project-action')?.addEventListener('click', () => {
      this.handleNewProject();
    });

    // Store 구독하여 모달 토글 및 UI 업데이트
    window.store.subscribe((state) => {
      if (state.isProjectModalOpen) {
        if (this.nameInputEl && document.activeElement !== this.nameInputEl) {
          this.nameInputEl.value = state.currentProjectName || '내 회로 프로젝트';
        }
        this.render();
        this.modalEl.classList.remove('hidden');
        this.modalEl.classList.add('active');
      } else {
        this.modalEl.classList.add('hidden');
        this.modalEl.classList.remove('active');
      }
    });
  }

  open() {
    window.store.setProjectModalOpen(true);
  }

  close() {
    window.store.setProjectModalOpen(false);
  }

  render() {
    if (!this.slotsContainerEl) return;
    const { slots, currentSlotIndex, currentProjectName } = window.store.state;
    const locale = window.store?.state?.settings?.language || 'ko';

    this.slotsContainerEl.innerHTML = '';

    for (let i = 0; i < 5; i++) {
      const slot = slots[i];
      const isCurrent = currentSlotIndex === i;
      const isEmpty = !slot;

      const card = document.createElement('div');
      card.className = `slot-card ${isCurrent ? 'current' : ''} ${isEmpty ? 'empty' : ''}`;

      let slotInfoHTML = '';
      if (isEmpty) {
        slotInfoHTML = `
          <div class="slot-header">
            <span class="slot-badge">${locale === 'ko' ? `슬롯 ${i + 1}` : `Slot ${i + 1}`}</span>
            <span class="slot-status empty-tag">${locale === 'ko' ? '비어 있음' : 'Empty'}</span>
          </div>
          <div class="slot-body">
            <p class="slot-empty-msg">${locale === 'ko' ? '저장된 프로젝트가 없습니다' : 'No saved project'}</p>
          </div>
          <div class="slot-actions">
            <button class="btn-slot btn-slot-save" data-slot="${i}">💾 ${locale === 'ko' ? '여기에 저장' : 'Save Here'}</button>
          </div>
        `;
      } else {
        const compCount = slot.workspace?.placedComponents?.length || 0;
        const wireCount = slot.workspace?.wires?.length || 0;
        const savedTime = slot.savedAt ? this.formatDate(slot.savedAt) : '';

        slotInfoHTML = `
          <div class="slot-header">
            <span class="slot-badge">${locale === 'ko' ? `슬롯 ${i + 1}` : `Slot ${i + 1}`}</span>
            ${isCurrent ? `<span class="slot-status active-tag">${locale === 'ko' ? '현재 작업 중' : 'Active'}</span>` : ''}
          </div>
          <div class="slot-body">
            <h4 class="slot-title">${this.escapeHTML(slot.name || '무제 프로젝트')}</h4>
            <div class="slot-meta">
              <span>🕒 ${savedTime}</span>
              <span>📦 ${locale === 'ko' ? `부품 ${compCount}개` : `${compCount} parts`}</span>
              <span>🔌 ${locale === 'ko' ? `선 ${wireCount}개` : `${wireCount} wires`}</span>
            </div>
          </div>
          <div class="slot-actions">
            <button class="btn-slot btn-slot-load" data-slot="${i}">📂 ${locale === 'ko' ? '불러오기' : 'Load'}</button>
            <button class="btn-slot btn-slot-save" data-slot="${i}">💾 ${locale === 'ko' ? '덮어쓰기' : 'Overwrite'}</button>
            <button class="btn-slot btn-slot-delete" data-slot="${i}">🗑️</button>
          </div>
        `;
      }

      card.innerHTML = slotInfoHTML;

      // 액션 버튼 이벤트 바인딩
      card.querySelector('.btn-slot-save')?.addEventListener('click', () => this.handleSaveSlot(i));
      card.querySelector('.btn-slot-load')?.addEventListener('click', () => this.handleLoadSlot(i));
      card.querySelector('.btn-slot-delete')?.addEventListener('click', () => this.handleDeleteSlot(i));

      this.slotsContainerEl.appendChild(card);
    }
  }

  handleSaveSlot(slotIndex) {
    const slot = window.store.state.slots[slotIndex];
    const locale = window.store?.state?.settings?.language || 'ko';
    const nameInput = this.nameInputEl?.value?.trim() || '내 회로 프로젝트';

    if (slot) {
      const confirmMsg = locale === 'ko'
        ? `[슬롯 ${slotIndex + 1}]에 이미 '${slot.name}' 프로젝트가 저장되어 있습니다.\n덮어씌우시겠습니까?`
        : `[Slot ${slotIndex + 1}] already has '${slot.name}'.\nOverwrite it?`;
      if (!confirm(confirmMsg)) return;
    }

    window.store.saveToSlot(slotIndex, nameInput);
    this.close();

    const toastMsg = locale === 'ko'
      ? `💾 [슬롯 ${slotIndex + 1}]에 '${nameInput}' 프로젝트가 저장되었습니다!`
      : `💾 Saved '${nameInput}' to [Slot ${slotIndex + 1}]!`;
    this.showToast(toastMsg);
  }

  handleLoadSlot(slotIndex) {
    const slot = window.store.state.slots[slotIndex];
    if (!slot) return;

    const locale = window.store?.state?.settings?.language || 'ko';
    const confirmMsg = locale === 'ko'
      ? `현재 작업 공간의 내용이 대체됩니다.\n[슬롯 ${slotIndex + 1}] '${slot.name}'을(를) 불러올까요?`
      : `Current workspace will be replaced.\nLoad '${slot.name}' from [Slot ${slotIndex + 1}]?`;

    if (!confirm(confirmMsg)) return;

    window.store.loadFromSlot(slotIndex);
    this.close();

    const toastMsg = locale === 'ko'
      ? `📂 [슬롯 ${slotIndex + 1}] '${slot.name}' 프로젝트를 불러왔습니다!`
      : `📂 Loaded '${slot.name}' from [Slot ${slotIndex + 1}]!`;
    this.showToast(toastMsg);
  }

  handleDeleteSlot(slotIndex) {
    const slot = window.store.state.slots[slotIndex];
    if (!slot) return;

    const locale = window.store?.state?.settings?.language || 'ko';
    const confirmMsg = locale === 'ko'
      ? `[슬롯 ${slotIndex + 1}] '${slot.name}' 저장 데이터를 삭제하시겠습니까?`
      : `Delete saved data for [Slot ${slotIndex + 1}] '${slot.name}'?`;

    if (!confirm(confirmMsg)) return;

    window.store.deleteSlot(slotIndex);

    const toastMsg = locale === 'ko'
      ? `🗑️ [슬롯 ${slotIndex + 1}] 데이터가 삭제되었습니다.`
      : `🗑️ Deleted [Slot ${slotIndex + 1}] data.`;
    this.showToast(toastMsg);
  }

  handleNewProject() {
    const locale = window.store?.state?.settings?.language || 'ko';
    const confirmMsg = locale === 'ko'
      ? '현재 회로 작업을 비우고 새 프로젝트를 시작하시겠습니까?'
      : 'Clear current workspace and start a new project?';

    if (!confirm(confirmMsg)) return;

    window.store.startNewProject();
    this.close();

    const toastMsg = locale === 'ko'
      ? '✨ 새 프로젝트가 시작되었습니다.'
      : '✨ New project started.';
    this.showToast(toastMsg);
  }

  formatDate(isoString) {
    try {
      const d = new Date(isoString);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day   = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const mins  = String(d.getMinutes()).padStart(2, '0');
      return `${month}-${day} ${hours}:${mins}`;
    } catch (e) {
      return '';
    }
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  showToast(msg) {
    const existing = document.querySelector('.circuit-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'circuit-toast';
    toast.innerHTML = msg.replace('\n', '<br>');
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

window.projectManager = new ProjectManager();
