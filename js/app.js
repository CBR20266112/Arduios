/* ==========================================================================
   Main Application Entry Point (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n DOM translations
  window.i18n.updateDOM();

  // Elements
  const titleScreen = document.getElementById('title-screen');
  const workspaceScreen = document.getElementById('workspace-screen');
  const drawerModal = document.getElementById('drawer-modal');
  const settingsModal = document.getElementById('settings-modal');

  // 1. Navigation: Start Button -> Workspace
  document.getElementById('btn-start')?.addEventListener('click', () => {
    window.store.setScreen('workspace');
  });

  // 2. Navigation: Header Settings Buttons
  const openSettings = () => window.store.setSettingsOpen(true);
  document.getElementById('btn-title-settings')?.addEventListener('click', openSettings);
  document.getElementById('btn-workspace-settings')?.addEventListener('click', openSettings);
  document.getElementById('btn-close-settings')?.addEventListener('click', () => {
    window.store.setSettingsOpen(false);
  });

  // 3. Navigation: Drawer Modal (Components)
  document.getElementById('btn-open-drawer')?.addEventListener('click', () => {
    window.store.setDrawerOpen(true);
  });
  document.getElementById('btn-close-drawer')?.addEventListener('click', () => {
    window.store.setDrawerOpen(false);
  });

  // 3.5 Project Modal element reference (버튼 바인딩은 projects.js에서 전담)
  const projectModal = document.getElementById('project-modal');

  // 4. Navigation: Reset Workspace Button
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (confirm('회로 작업 공간의 모든 부품을 초기화하시겠습니까?')) {
      window.store.clearWorkspace();
    }
  });

  // 5. Populate Component Drawer List
  const componentsListEl = document.getElementById('components-list');
  const renderComponentsDrawer = () => {
    if (componentsListEl && window.COMPONENT_DEFINITIONS) {
      componentsListEl.innerHTML = '';
      window.COMPONENT_DEFINITIONS.forEach((def) => {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.innerHTML = `
          <div class="icon">${def.icon}</div>
          <div class="name">${window.i18n.t(def.id) || def.nameKo}</div>
          <button class="btn-takeout" data-id="${def.id}">${window.i18n.t('takeOut')}</button>
        `;

        card.querySelector('.btn-takeout').addEventListener('click', () => {
          window.workspaceManager.spawnComponent(def.id);
          window.store.setDrawerOpen(false);
        });

        componentsListEl.appendChild(card);
      });
    }
  };
  renderComponentsDrawer();

  // 6. Settings Change Handlers
  const langSelect = document.getElementById('setting-language');
  if (langSelect) {
    langSelect.value = window.store.state.settings.language;
    langSelect.addEventListener('change', (e) => {
      window.store.updateSettings({ language: e.target.value });
      window.i18n.updateDOM();
      renderComponentsDrawer(); // Re-render component drawer for translated component names
    });
  }

  const gridCheckbox = document.getElementById('setting-show-grid');
  if (gridCheckbox) {
    gridCheckbox.checked = window.store.state.settings.showGrid;
    gridCheckbox.addEventListener('change', (e) => {
      window.store.updateSettings({ showGrid: e.target.checked });
    });
  }

  const highContrastCheckbox = document.getElementById('setting-high-contrast');
  if (highContrastCheckbox) {
    highContrastCheckbox.checked = window.store.state.settings.highContrast;
    highContrastCheckbox.addEventListener('change', (e) => {
      window.store.updateSettings({ highContrast: e.target.checked });
      if (e.target.checked) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    });
  }

  document.getElementById('btn-reset-settings')?.addEventListener('click', () => {
    window.store.updateSettings({
      language: 'ko',
      showGrid: true,
      highContrast: false
    });
    if (langSelect) langSelect.value = 'ko';
    if (gridCheckbox) gridCheckbox.checked = true;
    if (highContrastCheckbox) highContrastCheckbox.checked = false;
    document.body.classList.remove('high-contrast');
    alert('설정이 초기화되었습니다.');
  });

  // 7. Subscribe UI to Store Changes
  window.store.subscribe((state) => {
    // Screen toggle
    if (state.currentScreen === 'title') {
      titleScreen.classList.add('active');
      titleScreen.classList.remove('hidden');
      workspaceScreen.classList.remove('active');
      workspaceScreen.classList.add('hidden');
    } else {
      titleScreen.classList.remove('active');
      titleScreen.classList.add('hidden');
      workspaceScreen.classList.add('active');
      workspaceScreen.classList.remove('hidden');
    }

    // Modal toggles
    if (state.isDrawerOpen) {
      drawerModal.classList.remove('hidden');
    } else {
      drawerModal.classList.add('hidden');
    }

    if (state.isSettingsOpen) {
      settingsModal.classList.remove('hidden');
    } else {
      settingsModal.classList.add('hidden');
    }

    if (state.isProjectModalOpen) {
      projectModal?.classList.remove('hidden');
      projectModal?.classList.add('active');
    } else {
      projectModal?.classList.add('hidden');
      projectModal?.classList.remove('active');
    }

    // Update header project title
    const projectTitleEl = document.getElementById('current-project-title-text');
    if (projectTitleEl) {
      projectTitleEl.textContent = `📁 ${state.currentProjectName || '내 회로 프로젝트'}`;
    }
  });

  // Initial render for workspace canvas (Session restore)
  if (window.workspaceManager) {
    window.workspaceManager.render(window.store.state);
  }
});
