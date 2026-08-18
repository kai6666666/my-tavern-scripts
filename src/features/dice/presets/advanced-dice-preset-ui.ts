// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=38「高级骰子预设UI」
// 原行范围：45536-46636（含 banner 45533-46636）；拆分批次 9A；外部 closure 依赖：30（getCore@29 / Store@29 / AdvancedDicePresetManager@24 / STORAGE_KEY_ACTIVE_ADVANCED_PRESET@24 / STORAGE_KEY_LAST_PRESET@3 / escapeHtml@3 / getConfig@30 / pushModal@29 / getTutorialButtonHtml@30 / bindTutorialButtonsIn@30 / popModal@29 / showActionableErrorToast(import) / downloadJsonFile@29 / showDiceSystemConfirmDialog@29 / readTextFile@29 / getAdvancedPresetErrorMessage@24 / setupOverlayClose@3 / clearModalStack@29 / getDiceConfig@21 / showAttributePresetManager@37 / getCrazyModeConfig@27 / saveCrazyModeConfig@27 / saveDiceConfig@21 / hideDiceResultsInUserMessages@21 / parseJsoncRecord@29 / buildAdvancedPresetAgentPrompt@24 / downloadAiPromptFile@29 / validateJsoncEditorConfig@29 / parseAdvancedPresetText@24 / PRESET_FORMAT_VERSION@3）
// 接线说明：AdvancedDicePresetManager/STORAGE_KEY_ACTIVE_ADVANCED_PRESET/getAdvancedPresetErrorMessage/buildAdvancedPresetAgentPrompt/parseAdvancedPresetText 已拆至 presets/advanced-dice-preset-manager.ts、
//   STORAGE_KEY_LAST_PRESET/PRESET_FORMAT_VERSION 已拆至 engine/preset-constants.ts、escapeHtml/setupOverlayClose 已拆至 favorites/bookmark-manager.ts、
//   getDiceConfig/saveDiceConfig/hideDiceResultsInUserMessages 已拆至 engine/mvu-visualizer.ts、showAttributePresetManager 已拆至 presets/attribute-preset-manager-ui.ts、
//   getCrazyModeConfig/saveCrazyModeConfig 已拆至 presets/crazy-mode.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   getCore/Store/pushModal/popModal/downloadJsonFile/showDiceSystemConfirmDialog/readTextFile/clearModalStack/parseJsoncRecord/downloadAiPromptFile/validateJsoncEditorConfig@29、getConfig/getTutorialButtonHtml/bindTutorialButtonsIn@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireAdvancedDicePresetUiDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。
// 注：本文件导出的 buildActionPresetAgentPromptFilename/buildRenderPresetAgentPromptFilename/buildDashboardPresetAgentPromptFilename
//   同时供 idx 39/41/40（interaction-rule-preset-manager/render-preset-manager-ui/dashboard-preset-manager-ui）直连 import，
//   index.ts 侧对应 __wire 接线调用已同步移除（批次 9A 顺手优化）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { AdvancedDicePresetManager, STORAGE_KEY_ACTIVE_ADVANCED_PRESET, getAdvancedPresetErrorMessage, buildAdvancedPresetAgentPrompt, parseAdvancedPresetText } from './advanced-dice-preset-manager';
import { STORAGE_KEY_LAST_PRESET, PRESET_FORMAT_VERSION } from '../engine/preset-constants';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';
import { getDiceConfig, saveDiceConfig, hideDiceResultsInUserMessages } from '../engine/mvu-visualizer';
import { showAttributePresetManager } from './attribute-preset-manager-ui';
import { getCrazyModeConfig, saveCrazyModeConfig } from './crazy-mode';

let getCore = null;
let Store = null;
let getConfig = null;
let pushModal = null;
let getTutorialButtonHtml = null;
let bindTutorialButtonsIn = null;
let popModal = null;
let downloadJsonFile = null;
let showDiceSystemConfirmDialog = null;
let readTextFile = null;
let clearModalStack = null;
let parseJsoncRecord = null;
let downloadAiPromptFile = null;
let validateJsoncEditorConfig = null;

export function __wireAdvancedDicePresetUiDeps(deps) {
  getCore = deps.getCore;
  Store = deps.Store;
  getConfig = deps.getConfig;
  pushModal = deps.pushModal;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  bindTutorialButtonsIn = deps.bindTutorialButtonsIn;
  popModal = deps.popModal;
  downloadJsonFile = deps.downloadJsonFile;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  readTextFile = deps.readTextFile;
  clearModalStack = deps.clearModalStack;
  parseJsoncRecord = deps.parseJsoncRecord;
  downloadAiPromptFile = deps.downloadAiPromptFile;
  validateJsoncEditorConfig = deps.validateJsoncEditorConfig;
}
  // ========================================
  // 高级骰子预设UI
  // ========================================
  type SortableListOptions = {
    container: JQuery | HTMLElement;
    itemSelector: string;
    handleSelector?: string;
    cancelSelector?: string;
    onOrderChange: (newOrder: string[]) => void;
    getItemId: (item: HTMLElement) => string | null;
    canStartDrag?: () => boolean;
    ghostClass?: string;
    dragClass?: string;
    placeholderClass?: string;
    indicatorClass?: string;
    longPressDelay?: number;
  };

  const createSortableList = (options: SortableListOptions) => {
    const containerEl = options.container instanceof HTMLElement ? options.container : options.container[0];
    if (!containerEl) return;

    const ghostClass = options.ghostClass ?? 'acu-drag-ghost';
    const dragClass = options.dragClass ?? 'acu-dragging';
    const placeholderClass = options.placeholderClass ?? 'acu-drag-placeholder';
    const indicatorClass = options.indicatorClass ?? 'acu-drag-indicator';
    const longPressDelay = options.longPressDelay ?? 350;

    const state = {
      isDragging: false,
      draggedItem: null as HTMLElement | null,
      ghost: null as HTMLElement | null,
      indicator: null as HTMLElement | null,
      timer: null as number | null,
      startX: 0,
      startY: 0,
      pointerId: null as number | null,
      offsetX: 0,
      offsetY: 0,
      startOrder: [] as string[],
    };

    const buildOrder = () => {
      const ids: string[] = [];
      const items = containerEl.querySelectorAll<HTMLElement>(options.itemSelector);
      items.forEach(item => {
        const id = options.getItemId(item);
        if (id) ids.push(id);
      });
      return ids;
    };

    const clearTimer = () => {
      if (state.timer) {
        window.clearTimeout(state.timer);
        state.timer = null;
      }
    };

    const cleanupGhost = () => {
      if (state.ghost && state.ghost.parentElement) {
        state.ghost.parentElement.removeChild(state.ghost);
      }
      state.ghost = null;
    };

    const cleanupIndicator = () => {
      if (state.indicator && state.indicator.parentElement) {
        state.indicator.parentElement.removeChild(state.indicator);
      }
      state.indicator = null;
    };

    const updateGhostPosition = (clientX: number, clientY: number) => {
      if (!state.ghost) return;
      state.ghost.style.left = `${clientX - state.offsetX}px`;
      state.ghost.style.top = `${clientY - state.offsetY}px`;
    };

    const ensureIndicator = () => {
      if (!state.indicator) {
        const indicator = document.createElement('div');
        indicator.className = indicatorClass;
        state.indicator = indicator;
      }
      return state.indicator;
    };

    const placeIndicator = (clientY: number) => {
      if (!state.draggedItem) return;
      const items = Array.from(containerEl.querySelectorAll<HTMLElement>(options.itemSelector)).filter(
        item => item !== state.draggedItem,
      );
      let target: HTMLElement | null = null;
      let insertBefore = true;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (clientY < midY) {
          target = item;
          insertBefore = true;
          break;
        }
        if (clientY >= rect.top && clientY <= rect.bottom) {
          target = item;
          insertBefore = false;
        }
      }

      const indicator = ensureIndicator();
      if (target) {
        if (insertBefore) containerEl.insertBefore(indicator, target);
        else containerEl.insertBefore(indicator, target.nextSibling);
      } else {
        containerEl.appendChild(indicator);
      }
    };

    const startDrag = (
      item: HTMLElement,
      clientX: number,
      clientY: number,
      pointerId: number,
      captureEl: HTMLElement,
    ) => {
      if (state.isDragging) return;
      state.isDragging = true;
      state.draggedItem = item;
      state.pointerId = pointerId;
      state.startOrder = buildOrder();

      const rect = item.getBoundingClientRect();
      state.offsetX = clientX - rect.left;
      state.offsetY = clientY - rect.top;

      const ghost = item.cloneNode(true) as HTMLElement;
      ghost.classList.add(ghostClass);
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      ghost.style.left = `${rect.left}px`;
      ghost.style.top = `${rect.top}px`;
      ghost.style.position = 'fixed';
      ghost.style.margin = '0';
      ghost.style.pointerEvents = 'none';
      document.body.appendChild(ghost);
      state.ghost = ghost;

      item.classList.add(placeholderClass);
      item.classList.add(dragClass);

      updateGhostPosition(clientX, clientY);
      placeIndicator(clientY);

      if (captureEl.setPointerCapture) {
        captureEl.setPointerCapture(pointerId);
      }
    };

    const finishDrag = () => {
      if (!state.isDragging || !state.draggedItem) {
        clearTimer();
        cleanupIndicator();
        cleanupGhost();
        return;
      }

      if (state.indicator && state.indicator.parentElement === containerEl) {
        containerEl.replaceChild(state.draggedItem, state.indicator);
      }

      const finalRect = state.draggedItem.getBoundingClientRect();
      const draggedItem = state.draggedItem;
      const ghost = state.ghost;
      if (ghost) {
        ghost.style.transition = 'left 0.18s ease, top 0.18s ease, opacity 0.18s ease';
        ghost.style.left = `${finalRect.left}px`;
        ghost.style.top = `${finalRect.top}px`;
        ghost.style.opacity = '0';
        window.setTimeout(() => {
          if (ghost.parentElement) ghost.parentElement.removeChild(ghost);
        }, 180);
      }

      window.setTimeout(() => {
        draggedItem.classList.remove(placeholderClass);
        draggedItem.classList.remove(dragClass);
      }, 180);

      cleanupIndicator();
      if (!ghost) cleanupGhost();

      const newOrder = buildOrder();
      const orderChanged = state.startOrder.join('|') !== newOrder.join('|');

      state.isDragging = false;
      state.draggedItem = null;
      state.pointerId = null;
      state.startOrder = [];
      clearTimer();

      if (orderChanged) options.onOrderChange(newOrder);
    };

    containerEl.addEventListener(
      'pointerdown',
      e => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (options.cancelSelector && target.closest(options.cancelSelector)) return;
        if (options.canStartDrag && !options.canStartDrag()) return;

        const item = target.closest(options.itemSelector) as HTMLElement | null;
        if (!item) return;

        const handle = options.handleSelector ? (target.closest(options.handleSelector) as HTMLElement | null) : null;

        if (handle) {
          e.preventDefault();
          startDrag(item, e.clientX, e.clientY, e.pointerId, handle);
          return;
        }

        if (!options.handleSelector) {
          e.preventDefault();
          startDrag(item, e.clientX, e.clientY, e.pointerId, item);
          return;
        }

        state.startX = e.clientX;
        state.startY = e.clientY;
        state.pointerId = e.pointerId;
        clearTimer();
        state.timer = window.setTimeout(() => {
          startDrag(item, state.startX, state.startY, state.pointerId ?? e.pointerId, item);
        }, longPressDelay);
      },
      { passive: false },
    );

    containerEl.addEventListener(
      'pointermove',
      e => {
        if (state.timer && (Math.abs(e.clientY - state.startY) > 8 || Math.abs(e.clientX - state.startX) > 8)) {
          clearTimer();
        }

        if (!state.isDragging || !state.draggedItem) return;
        e.preventDefault();
        updateGhostPosition(e.clientX, e.clientY);
        placeIndicator(e.clientY);
      },
      { passive: false },
    );

    containerEl.addEventListener('pointerup', finishDrag);
    containerEl.addEventListener('pointercancel', finishDrag);
    containerEl.addEventListener(
      'touchmove',
      e => {
        if (state.isDragging) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
  };

  // 刷新已打开的检定面板的预设按钮
  const refreshDicePanelPresets = () => {
    const { $ } = getCore();
    const $panel = $('.acu-dice-panel');
    if ($panel.length === 0) return; // 面板未打开，无需刷新

    // 重新生成预设按钮HTML
    const presets = AdvancedDicePresetManager.getAllPresets()
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const activePresetId = Store.get(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null) as string | null;
    const lastPresetId = localStorage.getItem(STORAGE_KEY_LAST_PRESET);
    const activeButtonId = activePresetId || lastPresetId || '__custom__';

    let html = `<button type="button" class="acu-dice-quick-preset-btn${activeButtonId === '__custom__' ? ' active' : ''}" data-id="__custom__">自定义</button>`;
    presets.forEach(p => {
      const activeClass = p.id === activeButtonId ? ' active' : '';
      html += `<button type="button" class="acu-dice-quick-preset-btn${activeClass}" data-id="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`;
    });

    // 替换预设按钮区域内容
    $panel.find('#dice-normal-presets').html(html);
  };

  const showPresetListDialog = (options: { fromDicePanel?: boolean } = {}, pushToStack = true) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();

    const config = getConfig();
    const presets = AdvancedDicePresetManager.getAllPresets();
    const fromDicePanel = options.fromDicePanel === true;

    // 将当前弹窗推入栈中；内部刷新列表时复用当前栈项，避免关闭时需要多次返回
    if (pushToStack) {
      pushModal('showPresetListDialog', () => showPresetListDialog(options));
    }

    const presetsHtml = presets
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map(preset => {
        const isBuiltin = preset.builtin;
        const isVisible = preset.visible !== false;

        return `
        <div class="acu-preset-item${!isVisible ? ' acu-preset-hidden' : ''}" data-id="${escapeHtml(preset.id)}" draggable="false">
           <div class="acu-preset-check" title="点击切换显示/隐藏" aria-label="${isVisible ? '隐藏预设' : '显示预设'}">
            <i class="fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>
          </div>
          <div class="acu-preset-info">
            <div class="acu-preset-name">
              ${escapeHtml(preset.name)}
              ${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}
            </div>
            ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
            <div class="acu-preset-stats">
              骰子: ${escapeHtml(preset.diceExpression)} | 判定分支: ${preset.outcomes?.length || 0}个
            </div>
          </div>
          <div class="acu-preset-actions">
            ${
              isBuiltin
                ? `<button type="button" class="acu-preset-btn acu-advanced-preset-copy" data-id="${escapeHtml(preset.id)}" title="复制为自定义预设" aria-label="复制为自定义预设"><i class="fa-solid fa-copy"></i></button>`
                : `<button type="button" class="acu-preset-btn acu-advanced-preset-edit" data-id="${escapeHtml(preset.id)}" title="编辑" aria-label="编辑预设"><i class="fa-solid fa-pen"></i></button>`
            }
            <button type="button" class="acu-preset-btn acu-advanced-preset-export" data-id="${escapeHtml(preset.id)}" title="导出" aria-label="导出预设"><i class="fa-solid fa-download"></i></button>
            ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-advanced-preset-delete" data-id="${escapeHtml(preset.id)}" title="删除" aria-label="删除预设"><i class="fa-solid fa-trash"></i></button>` : ''}
          </div>
          <div class="acu-preset-handle" title="拖拽排序" aria-label="拖拽排序">
            <i class="fa-solid fa-grip-vertical"></i>
          </div>
        </div>
      `;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-sliders"></i> 检定预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('advancedPresetManager', '查看检定预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭检定预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div class="acu-advanced-preset-hint">
              <i class="fa-solid fa-info-circle"></i> 点击眼睛图标切换显示，拖拽条目或手柄排序
            </div>
            <div id="acu-advanced-presets-list">
              ${presetsHtml || `<div class="acu-empty-state"><i class="fa-solid fa-sliders"></i><span>暂无检定预设</span></div>`}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button type="button" id="acu-advanced-preset-new" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建检定预设" aria-label="新建检定预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button type="button" id="acu-advanced-preset-import" class="acu-dialog-btn">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button type="button" id="acu-advanced-preset-back" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>

          <input type="file" id="acu-advanced-preset-file-input" class="acu-advanced-preset-file-input" accept=".json,.jsonc,application/json,application/jsonc" />
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-advanced-preset-back').on('click', () => {
      overlay.remove();
      popModal(); // 返回上一个弹窗
    });

    overlay.on('click', '.acu-preset-check', function (e) {
      e.stopPropagation();
      const $item = $(this).closest('.acu-preset-item');
      const id = $item.data('id');
      const preset = presets.find(p => p.id === id);
      if (!preset) return;

      const isVisible = preset.visible !== false;
      if (preset.builtin) {
        AdvancedDicePresetManager.setBuiltinPresetVisibility(id, !isVisible);
      } else {
        AdvancedDicePresetManager.updatePreset(id, { visible: !isVisible });
      }
      showPresetListDialog({ fromDicePanel }, false);
      refreshDicePanelPresets();
    });

    overlay.on('click', '.acu-advanced-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      showAdvancedPresetEditor(id);
    });

    overlay.on('click', '.acu-advanced-preset-copy', function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);
      if (!preset) return;

      const copied = {
        ...preset,
        name: preset.name + ' (副本)',
        id: undefined,
        builtin: false,
      };
      AdvancedDicePresetManager.createPreset(copied);
      overlay.remove();
      showPresetListDialog({ fromDicePanel }, false);
      refreshDicePanelPresets();
    });

    overlay.on('click', '.acu-advanced-preset-export', function () {
      const id = $(this).data('id');
      const json = AdvancedDicePresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '高级骰子预设导出失败', suggestion: 'importExport' });
        return;
      }
      const preset = presets.find(p => p.id === id);
      const filename = `acu_advanced_preset_${preset?.name || id}_${Date.now()}.json`;

      downloadJsonFile(json, filename);
    });

    overlay.on('click', '.acu-advanced-preset-delete', async function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除检定预设',
        message: `确定要删除预设「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        try {
          AdvancedDicePresetManager.deletePreset(id);
          overlay.remove();
          showPresetListDialog({ fromDicePanel }, false);
          refreshDicePanelPresets();
        } catch (err) {
          if (window.toastr) showActionableErrorToast('删除失败: ' + err.message, { title: '高级骰子预设删除失败', suggestion: 'save' });
        }
      }
    });

    overlay.find('#acu-advanced-preset-new').on('click', () => {
      overlay.remove();
      showAdvancedPresetEditor();
    });

    overlay.find('#acu-advanced-preset-import').on('click', () => {
      overlay.find('#acu-advanced-preset-file-input').trigger('click');
    });

    const $list = overlay.find('#acu-advanced-presets-list');
    createSortableList({
      container: $list,
      itemSelector: '.acu-preset-item',
      handleSelector: '.acu-preset-handle',
      cancelSelector: '.acu-preset-actions button, .acu-toggle, .acu-preset-check',
      getItemId: item => {
        const id = $(item).data('id');
        if (typeof id === 'string') return id;
        if (id !== undefined && id !== null) return String(id);
        return null;
      },
      onOrderChange: newOrderIds => {
        newOrderIds.forEach((id, index) => {
          AdvancedDicePresetManager.setPresetOrder(id, index);
        });
        refreshDicePanelPresets();
      },
    });

    overlay.find('#acu-advanced-preset-file-input').on('change', function (e) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      void (async () => {
        try {
          const jsonStr = await readTextFile(file);
          const result = AdvancedDicePresetManager.importPreset(jsonStr);
          if (result) {
            overlay.remove();
            showPresetListDialog({ fromDicePanel }, false);
            refreshDicePanelPresets();
          } else {
            const importError = AdvancedDicePresetManager.getLastImportError();
            if (window.toastr) showActionableErrorToast('导入失败: ' + (importError || '格式错误'), { suggestion: 'importExport' });
          }
        } catch (err) {
          if (window.toastr) showActionableErrorToast('导入失败: ' + getAdvancedPresetErrorMessage(err), { suggestion: 'importExport' });
        } finally {
          input.value = '';
        }
      })();
    });

    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal(); // 返回上一个弹窗
    });
  };

  const showAdvancedPresetManager = (options: { fromDicePanel?: boolean } = {}) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    const fromDicePanel = options.fromDicePanel === true;
    if (fromDicePanel) {
      clearModalStack();
    }
    pushModal('showAdvancedPresetManager', () => showAdvancedPresetManager(options));

    const config = getConfig();
    const diceCfg = getDiceConfig();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-dice-settings-dialog acu-theme-${config.theme}">
          <div class="acu-dice-settings-header">
            <h3><i class="fa-solid fa-dice-d20"></i> 检定设置</h3>
            <div class="acu-dice-settings-actions">
              ${getTutorialButtonHtml('diceSettings', '查看检定设置教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭检定设置" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

           <div class="acu-dice-settings-body">
            <div class="acu-dice-settings-section">
              <div class="acu-setting-row" id="dice-settings-preset-row">
                  <div class="acu-setting-info">
                      <span class="acu-setting-label"><i class="fa-solid fa-sliders"></i> 检定预设</span>
                  </div>
                  <button type="button" id="acu-open-preset-list" class="acu-setting-action-btn acu-dice-settings-action">
                      <i class="fa-solid fa-cog"></i> 管理
                  </button>
              </div>
              <div class="acu-setting-row" id="dice-settings-attr-preset-row">
                  <div class="acu-setting-info">
                      <span class="acu-setting-label"><i class="fa-solid fa-gem"></i> 属性预设</span>
                  </div>
                  <button type="button" id="acu-open-attr-preset" class="acu-setting-action-btn acu-dice-settings-action">
                      <i class="fa-solid fa-cog"></i> 管理
                  </button>
              </div>
              <div class="acu-setting-row" id="dice-settings-crazy-mode-row">
                  <div class="acu-setting-info">
                      <span class="acu-setting-label"><i class="fa-solid fa-fire"></i> 疯狂模式</span>
                  </div>
                  <select id="cfg-crazy-mode" class="acu-setting-select acu-dice-settings-select">
                      <option value="0">○ 关闭</option>
                      <option value="25">◔ 低</option>
                      <option value="50">◑ 中</option>
                      <option value="75">◕ 高</option>
                      <option value="100">● 极限</option>
                  </select>
              </div>
            </div>
              <div id="dice-result-display-settings" class="acu-dice-settings-section">
                <div class="acu-setting-row acu-setting-row-toggle">
                    <div class="acu-setting-info">
                        <span class="acu-setting-label">隐藏输入栏中的检定结果</span>
                    </div>
                    <label class="acu-toggle">
                        <input type="checkbox" id="cfg-hide-dice-result" ${diceCfg.hideDiceResultFromUser ? 'checked' : ''}>
                        <span class="acu-toggle-slider"></span>
                    </label>
                </div>
                <div class="acu-setting-row acu-setting-row-toggle">
                    <div class="acu-setting-info">
                        <span class="acu-setting-label">覆盖上一次检定结果</span>
                    </div>
                    <label class="acu-toggle">
                        <input type="checkbox" id="cfg-overwrite-last-dice-result" ${diceCfg.overwriteLastDiceResult !== false ? 'checked' : ''}>
                        <span class="acu-toggle-slider"></span>
                    </label>
                </div>
                 <div class="acu-setting-row acu-setting-row-toggle">
                    <div class="acu-setting-info">
                        <span class="acu-setting-label">隐藏聊天记录中的检定结果</span>
                    </div>
                    <label class="acu-toggle">
                        <input type="checkbox" id="cfg-hide-dice-result-chat" ${diceCfg.hideDiceResultInChat ? 'checked' : ''}>
                        <span class="acu-toggle-slider"></span>
                    </label>
                </div>
            </div>
           </div>
         </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.find('#acu-open-preset-list').on('click', () => {
      overlay.remove();
      showPresetListDialog({ fromDicePanel });
    });

    overlay.find('#acu-open-attr-preset').on('click', () => {
      overlay.remove();
      showAttributePresetManager();
    });

    // 疯狂模式设置
    const initCrazyModeUI = () => {
      const crazyConfig = getCrazyModeConfig();
      // 根据enabled和crazyLevel设置下拉框的值
      const selectValue = crazyConfig.enabled ? crazyConfig.crazyLevel : 0;
      overlay.find('#cfg-crazy-mode').val(selectValue);

      // 下拉选择事件
      overlay.find('#cfg-crazy-mode').on('change', function () {
        const value = parseInt($(this).val() as string, 10);
        if (value === 0) {
          saveCrazyModeConfig({ enabled: false, crazyLevel: 50 });
        } else {
          saveCrazyModeConfig({ enabled: true, crazyLevel: value });
        }
      });
    };
    initCrazyModeUI();

    // 隐藏设置开关
    overlay.find('#cfg-hide-dice-result').on('change', function () {
      const hide = $(this).is(':checked');
      saveDiceConfig({ hideDiceResultFromUser: hide });
      console.info('[DICE]应用投骰结果隐藏/显示设置(输入栏)...', hide);
      hideDiceResultsInUserMessages();
    });

    overlay.find('#cfg-overwrite-last-dice-result').on('change', function () {
      const overwrite = $(this).is(':checked');
      saveDiceConfig({ overwriteLastDiceResult: overwrite });
      console.info('[DICE]应用投骰结果覆盖设置...', overwrite);
    });

    overlay.find('#cfg-hide-dice-result-chat').on('change', function () {
      const hide = $(this).is(':checked');
      saveDiceConfig({ hideDiceResultInChat: hide });
      console.info('[DICE]应用投骰结果隐藏/显示设置(聊天记录)...', hide);
      // 这里不需要立即重新渲染聊天，因为只有新生成的才会受影响，
      // 或者如果需要立即生效可能需要重新处理dom，但通常只需保存配置
    });

    // 点击遮罩关闭
    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };

  const buildNewAdvancedPresetJsoncTemplate = (): string => `{
  // 这是一个可直接使用的 CoC7 风格高级检定预设示例。
  // 预设名称和描述可以在上方输入框填写；如果这里也写 name / description，保存时会以最终解析结果为准。
  // diceExpression / customFields / outcomes / outcomePolicy 决定实际投骰与判定。
  // checkSuggestionGuide 决定“检定建议表”里 <检定规则> 展示给 AI 的提示词；删除其中任意段时会自动生成缺失段。
  // checkSuggestionAliases 决定 DSL 参数名和值的中文别名，只处理 key=value 参数，不处理角色名或属性名别名。
  "kind": "advanced",
  "name": "自定义检定预设",
  "description": "1d100 小于等于属性值成功，支持最低成功等级与奖惩骰",

  // diceExpression：基础投骰公式。dicePatches 可以在它后面追加 b/p 奖惩骰。
  "diceExpression": "1d100",

  // attribute：普通检定的主输入字段；这里表示技能值，不填时默认 50。
  "attribute": {
    "label": "技能值",
    "placeholder": "留空=50",
    "defaultValue": 50,
    "key": "技能值"
  },

  // dc / mod / skillMod 是内置字段；不使用时隐藏并给出默认值，避免表达式里出现空值。
  "dc": {
    "hidden": true,
    "defaultValue": 0
  },
  "mod": {
    "hidden": true,
    "defaultValue": 0
  },

  // customFields：规则专属输入。select 适合固定选项，number 适合奖惩骰、难度值等数字。
  "customFields": [
    {
      "id": "bonusPenalty",
      "type": "number",
      "label": "奖惩骰",
      "defaultValue": "",
      "placeholder": "+1 奖励，-1 惩罚"
    },
    {
      "id": "requiredRank",
      "type": "select",
      "label": "最低成功等级",
      "defaultValue": 1,
      "options": [
        { "label": "成功", "value": 1 },
        { "label": "困难成功", "value": 2 },
        { "label": "极难成功", "value": 3 }
      ],
      "contestOverride": { "hidden": true }
    }
  ],

  // derivedVars：中间变量，适合复用复杂公式；下面把奖惩骰绝对值提取为 $absBp。
  "derivedVars": [
    { "id": "absBp", "expr": "abs($bonusPenalty)" }
  ],

  // dicePatches：按条件修改投骰公式。append 会把 template 追加到 diceExpression 后。
  "dicePatches": [
    { "when": "$bonusPenalty > 0", "op": "append", "template": "b$absBp" },
    { "when": "$bonusPenalty < 0", "op": "append", "template": "p$absBp" }
  ],

  // outcomes：判定分支。condition 先匹配 priority 更小的项；兜底分支可用较大 priority。
  "outcomes": [
    { "id": "crit_success", "name": "大成功", "condition": "$roll.total === 1", "priority": 1, "rank": 4, "contestRank": 100 },
    { "id": "extreme_success", "name": "极难成功", "condition": "$roll.total <= $attr / 5", "priority": 10, "rank": 3, "contestRank": 100 },
    { "id": "hard_success", "name": "困难成功", "condition": "$roll.total <= $attr / 2", "priority": 20, "rank": 2, "contestRank": 80 },
    { "id": "success", "name": "成功", "condition": "$roll.total <= $attr", "priority": 30, "rank": 1, "contestRank": 60 },
    { "id": "failure", "name": "失败", "condition": "$roll.total > $attr", "displayExpr": "$roll.total <= $attr", "priority": 50, "rank": 0, "contestRank": 40 },
    { "id": "crit_failure", "name": "大失败", "condition": "($attr < 50 && $roll.total >= 96) || ($attr >= 50 && $roll.total === 100)", "priority": 5, "rank": -1, "contestRank": 20 },
    { "id": "unmet", "name": "失败", "condition": "false", "priority": 999, "rank": -2 }
  ],

  // outcomePolicy：命中 outcome 后再做二次裁决；这里用于“最低成功等级”。
  "outcomePolicy": {
    "kind": "minRank",
    "requiredRankVarId": "requiredRank",
    "unmetOutcomeId": "unmet",
    "keepActualOutcome": true
  },

  // contestRule：对抗检定规则；mode=rank 时先比较成功等级，再按 tieBreakers 破平。
  "contestRule": {
    "mode": "rank",
    "tieBreakers": ["higher_attr", "initiator_wins"]
  },

  // outputTemplate / contestOutputTemplate 必须保留 <meta:检定结果> 包裹，方便隐藏投骰结果和后续解析。
  "outputTemplate": "<meta:检定结果>\\n$outcomeText\\n元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】\\n</meta:检定结果>",
  "contestOutputTemplate": "<meta:检定结果>\\n元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的对抗检定。\\n$initiator $initAttrName：$initFormula=$initRoll，判定 $initConditionExpr？$initJudgeResult，判定为【$initSuccessName】；\\n$opponent $oppAttrName：$oppFormula=$oppRoll，判定 $oppConditionExpr？$oppJudgeResult，判定为【$oppSuccessName】。\\n最终结果：【$winner】\\n</meta:检定结果>",

  // checkSuggestionGuide：同步到表格模板 <检定规则>，让 AI 知道如何生成“检定/对抗”命令。
  "checkSuggestionGuide": {
    "rule": "使用 CoC7 的 1d100 检定：掷 1d100，结果小于等于属性值则成功。需要更高门槛时，可写 难度=困难 或 难度=极难。",
    "dsl": "普通检定：检定 <角色> <属性> [难度=普通|困难|极难] [奖惩=奖励1|惩罚1]\\n对抗检定：对抗 <发起者> <属性> vs <对手> <属性> [难度=普通|困难|极难] [奖惩=奖励1|惩罚1]\\n固定成功：必成\\n固定失败：必败\\n无需检定：无",
    "examples": "1. 展示文本：<user>在昏暗走廊里寻找血迹。\\n   骰子命令：检定 <user> 侦查 难度=困难\\n2. 展示文本：<user>盯紧<角色>的眼睛，尝试判断她是否隐瞒了真相。\\n   骰子命令：对抗 <user> 心理学 vs <角色> 话术"
  },

  // checkSuggestionAliases：把中文 DSL 参数和值映射到 customFields / 内部变量。
  "checkSuggestionAliases": {
    "params": {
      "难度": "requiredRank",
      "最低成功等级": "requiredRank",
      "奖惩": "bonusPenalty",
      "奖惩骰": "bonusPenalty"
    },
    "values": {
      "requiredRank": {
        "普通": 1,
        "成功": 1,
        "普通成功": 1,
        "困难": 2,
        "困难成功": 2,
        "极难": 3,
        "极难成功": 3
      },
      "bonusPenalty": {
        "奖励1": 1,
        "奖励骰1": 1,
        "惩罚1": -1,
        "惩罚骰1": -1
      }
    }
  }
}`;

  const buildAdvancedPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_advanced_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildDashboardPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'dashboard_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_dashboard_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildActionPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'action_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_action_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildRenderPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'render_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_render_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildTableTemplateRequirementPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'table_template_requirement_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_table_template_requirement_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildGachaCatalogAgentPromptFilename = (poolName: string): string => {
    const safeName =
      poolName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'gacha_catalog';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_gacha_catalog_ai_prompt_${safeName}_${datePart}.md`;
  };

  const showAdvancedPresetEditor = (presetId: string | null = null) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showAdvancedPresetEditor', () => showAdvancedPresetEditor(presetId));

    const config = getConfig();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId) : null;

    const defaultJsonText = existingPreset
      ? JSON.stringify(JSON.parse(JSON.stringify(existingPreset)), null, 2)
      : buildNewAdvancedPresetJsoncTemplate();
    const defaultData = parseJsoncRecord(defaultJsonText, '检定预设配置');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-pen"></i> ${isEdit ? '编辑' : '新建'}检定预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('advancedPresetEditor', '查看新建检定预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭检定预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="advanced-preset-name">预设名称</label>
                <input id="advanced-preset-name" type="text" value="${escapeHtml(defaultData.name)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="advanced-preset-desc">描述</label>
                <input id="advanced-preset-desc" type="text" value="${escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="advanced-preset-json">
                  JSONC配置
                  <span>支持 AI 回复、Markdown 代码块、// 与 /* */ 注释、尾随逗号</span>
                </label>
              </div>
              <textarea id="advanced-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea"></textarea>
              <div id="advanced-preset-format-help-summary" class="acu-advanced-preset-format-help-summary">
                <strong>配置格式：</strong>
                <span>检定预设由骰子公式、输入字段、判定结果、对抗规则和输出模板组成。下方列出常用结构；完整协议请优先参考下载的 AI 提示词。</span>
              </div>
              <div id="advanced-preset-format-help" class="acu-advanced-preset-format-help">
              <strong>骰子表达式 (diceExpression)</strong><br/>
              • 基础: "1d20", "3d6", "4dF" (Fate骰)<br/>
              • 复合加减: "1d20+3", "2d6+1d4-1"<br/>
              • 重掷: "4d6r1" (持续重掷1), "4d6ro1" (只重掷一次), "4d6r&lt;=2"<br/>
              • 保留/舍弃: "4d6kh3" (保留最高3个), "2d20kl1" (保留最低1个)<br/>
              • 成功计数: "4d6=3" (统计=3的个数), "6d10>=7" (统计≥7的个数)<br/>
              • CoC奖惩骰: "1d100b1" (奖励骰), "1d100p2" (2个惩罚骰)<br/>
              • 爆炸骰: "4d6!" (最大值爆炸), "4d6!!" (累加爆炸), "4d6!>=6"<br/>
              • 修饰符顺序: b/p → r/ro → !/!! → kh/kl/dh/dl → 成功计数<br/>
              <br/>
              <strong>表达式变量</strong><br/>
              • $roll.total: 骰子结果总和（或成功计数）<br/>
              • $roll.hasTag('nat20') / $roll.hasTag('nat1'): 仅 d20 自动产生<br/>
              • $attr, $attrMod, $dc, $mod, $skillMod: 内置输入字段值<br/>
              • $字段ID: customFields 或 derivedVars 提供的变量<br/>
              <br/>
              <strong>输入字段配置</strong><br/>
              • attribute: 主属性/技能值 { label, placeholder, defaultValue, hidden, key?, computeModifier? }<br/>
              • dc / mod / skillMod: 目标值、临时修正、技能加值；不用时设 hidden=true 和 defaultValue=0<br/>
              • customFields: 规则专属控件；新预设优先使用 number / text / select，选项型参数用 select<br/>
              • derivedVars: 内部数字变量；长目标值公式先放这里，再在 condition/displayExpr 中引用<br/>
              <br/>
              <strong>判定结果 (outcomes)</strong><br/>
              • 每项必填: { id, name, condition, priority }<br/>
              • 常用可选: rank, contestRank, displayExpr, outputText, style, effects<br/>
              • condition: 表达式如 "$roll.total >= $dc", "$roll.total == 4"<br/>
              • displayExpr: 投骰按钮里的短判定式，不要放纯目标值长公式<br/>
              • priority: 数字越小越优先匹配；兜底分支常用 condition="true" 和较大 priority<br/>
              <br/>
              <strong>高级功能</strong><br/>
              • dicePatches: 条件骰子 [{ when?, op, template }]<br/>
              • contestRule: 对抗规则 { disabled?, mode, tieBreakers }<br/>
              • outcomePolicy: 命中 outcome 后的二次裁决，例如最低成功等级<br/>
              • checkSuggestionGuide: 检定建议表中给 AI 看的规则/命令/示例<br/>
              • checkSuggestionAliases: DSL 参数名和值的中文别名<br/>
              <br/>
              <strong>输出模板变量</strong><br/>
              • 常用: $initiator, $attrName, $formula, $roll, $conditionExpr, $judgeResult, $outcomeName, $outcomeText<br/>
              • 对抗: $initFormula, $oppFormula, $initRoll, $oppRoll, $initTotal, $oppTotal, $winner<br/>
              • 默认会输出 &lt;meta:检定结果&gt;；自定义 outputTemplate 时也必须保留这个包裹<br/>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="advanced-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="advanced-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button type="button" id="advanced-preset-save" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button type="button" id="advanced-preset-cancel" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#advanced-preset-json');

    // 初始化 JSON / JSONC
    $jsonTextarea.val(defaultJsonText);

    const getEditorPresetParseOptions = (
      name: string,
      description: string,
    ): { idOverride?: string; nameOverride?: string; descriptionOverride?: string } => {
      const initialName = String(defaultData.name || '').trim();
      const initialDescription = String(defaultData.description || '').trim();
      return {
        idOverride: presetId || undefined,
        nameOverride: isEdit || name !== initialName ? name : undefined,
        descriptionOverride: isEdit || description !== initialDescription ? description : undefined,
      };
    };

    // 关闭
    overlay.find('.acu-close-btn, #advanced-preset-cancel').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.find('#advanced-preset-download-ai-prompt').on('click', () => {
      const promptText = buildAdvancedPresetAgentPrompt();
      const presetName = String(overlay.find('#advanced-preset-name').val() || defaultData.name || 'preset');
      const filename = buildAdvancedPresetAgentPromptFilename(presetName);
      downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#advanced-preset-validate').on('click', () => {
      const name = String(overlay.find('#advanced-preset-name').val() || '').trim();
      const description = String(overlay.find('#advanced-preset-desc').val() || '').trim();
      validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: text => parseAdvancedPresetText(text, getEditorPresetParseOptions(name, description)),
        successMessage: result => {
          const testText = result.tests.length > 0 ? `，测试 ${result.tests.length} 条` : '';
          return `配置有效：${result.preset.name}${testText}`;
        },
        errorMessage: getAdvancedPresetErrorMessage,
        logLabel: '[DICE]ACU 高级预设验证失败:',
      });
    });

    // 保存
    overlay.find('#advanced-preset-save').on('click', () => {
      try {
        const name = String(overlay.find('#advanced-preset-name').val() || '').trim();
        const description = String(overlay.find('#advanced-preset-desc').val() || '').trim();
        const jsonStr = String($jsonTextarea.val() || '').trim();

        const parseResult = parseAdvancedPresetText(jsonStr, getEditorPresetParseOptions(name, description));
        const finalName = parseResult.preset.name || name;
        const finalDescription = parseResult.preset.description || description;

        if (!finalName) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }

        // 构建预设
        const preset = {
          ...(isEdit && existingPreset ? existingPreset : {}),
          ...parseResult.preset,
          kind: 'advanced' as const,
          version: PRESET_FORMAT_VERSION,
          id: presetId || `custom_${Date.now()}`,
          builtin: false,
          name: finalName,
          description: finalDescription,
        };

        // 保存
        if (isEdit && presetId) {
          AdvancedDicePresetManager.updatePreset(presetId, preset);
        } else {
          AdvancedDicePresetManager.createPreset(preset);
        }

        overlay.remove();
        popModal();
        refreshDicePanelPresets(); // 刷新检定面板预设按钮
      } catch (err) {
        console.error('[DICE]ACU 保存高级预设失败:', err);
        if (window.toastr) showActionableErrorToast('保存失败：' + getAdvancedPresetErrorMessage(err), { suggestion: 'save' });
      }
    });

    // 点击遮罩关闭
    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };
export {
  createSortableList,
  refreshDicePanelPresets,
  showPresetListDialog,
  showAdvancedPresetManager,
  buildNewAdvancedPresetJsoncTemplate,
  buildAdvancedPresetAgentPromptFilename,
  buildDashboardPresetAgentPromptFilename,
  buildActionPresetAgentPromptFilename,
  buildRenderPresetAgentPromptFilename,
  buildTableTemplateRequirementPresetAgentPromptFilename,
  buildGachaCatalogAgentPromptFilename,
  showAdvancedPresetEditor,
}; // __wireAdvancedDicePresetUiDeps 已由头部 export function 导出
export type { SortableListOptions };
