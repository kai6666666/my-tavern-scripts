// @ts-nocheck
/**
 * preset-list-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowPresetListDialog(deps: any) {
  const showPresetListDialog = (options: { fromDicePanel?: boolean } = {}, pushToStack = true) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();

    const config = deps.getConfig();
    const presets = deps.AdvancedDicePresetManager.getAllPresets();
    const fromDicePanel = options.fromDicePanel === true;

    // 将当前弹窗推入栈中；内部刷新列表时复用当前栈项，避免关闭时需要多次返回
    if (pushToStack) {
      deps.pushModal('showPresetListDialog', () => showPresetListDialog(options));
    }

    const presetsHtml = presets
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map(preset => {
        const isBuiltin = preset.builtin;
        const isVisible = preset.visible !== false;

        return `
        <div class="acu-preset-item${!isVisible ? ' acu-preset-hidden' : ''}" data-id="${deps.escapeHtml(preset.id)}" draggable="false">
           <div class="acu-preset-check" title="点击切换显示/隐藏" aria-label="${isVisible ? '隐藏预设' : '显示预设'}">
            <i class="fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>
          </div>
          <div class="acu-preset-info">
            <div class="acu-preset-name">
              ${deps.escapeHtml(preset.name)}
              ${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}
            </div>
            ${preset.description ? `<div class="acu-preset-desc">${deps.escapeHtml(preset.description)}</div>` : ''}
            <div class="acu-preset-stats">
              骰子: ${deps.escapeHtml(preset.diceExpression)} | 判定分支: ${preset.outcomes?.length || 0}个
            </div>
          </div>
          <div class="acu-preset-actions">
            ${
              isBuiltin
                ? `<button type="button" class="acu-preset-btn acu-advanced-preset-copy" data-id="${deps.escapeHtml(preset.id)}" title="复制为自定义预设" aria-label="复制为自定义预设"><i class="fa-solid fa-copy"></i></button>`
                : `<button type="button" class="acu-preset-btn acu-advanced-preset-edit" data-id="${deps.escapeHtml(preset.id)}" title="编辑" aria-label="编辑预设"><i class="fa-solid fa-pen"></i></button>`
            }
            <button type="button" class="acu-preset-btn acu-advanced-preset-export" data-id="${deps.escapeHtml(preset.id)}" title="导出" aria-label="导出预设"><i class="fa-solid fa-download"></i></button>
            ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-advanced-preset-delete" data-id="${deps.escapeHtml(preset.id)}" title="删除" aria-label="删除预设"><i class="fa-solid fa-trash"></i></button>` : ''}
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
              ${deps.getTutorialButtonHtml('advancedPresetManager', '查看检定预设管理教程', 'acu-help-btn')}
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
    deps.bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-advanced-preset-back').on('click', () => {
      overlay.remove();
      deps.popModal(); // 返回上一个弹窗
    });

    overlay.on('click', '.acu-preset-check', function (e) {
      e.stopPropagation();
      const $item = $(this).closest('.acu-preset-item');
      const id = $item.data('id');
      const preset = presets.find(p => p.id === id);
      if (!preset) return;

      const isVisible = preset.visible !== false;
      if (preset.builtin) {
        deps.AdvancedDicePresetManager.setBuiltinPresetVisibility(id, !isVisible);
      } else {
        deps.AdvancedDicePresetManager.updatePreset(id, { visible: !isVisible });
      }
      showPresetListDialog({ fromDicePanel }, false);
      deps.refreshDicePanelPresets();
    });

    overlay.on('click', '.acu-advanced-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      deps.showAdvancedPresetEditor(id);
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
      deps.AdvancedDicePresetManager.createPreset(copied);
      overlay.remove();
      showPresetListDialog({ fromDicePanel }, false);
      deps.refreshDicePanelPresets();
    });

    overlay.on('click', '.acu-advanced-preset-export', function () {
      const id = $(this).data('id');
      const json = deps.AdvancedDicePresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '高级骰子预设导出失败', suggestion: 'importExport' });
        return;
      }
      const preset = presets.find(p => p.id === id);
      const filename = `acu_advanced_preset_${preset?.name || id}_${Date.now()}.json`;

      deps.downloadJsonFile(json, filename);
    });

    overlay.on('click', '.acu-advanced-preset-delete', async function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      const confirmed = await deps.showDiceSystemConfirmDialog({
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
          deps.AdvancedDicePresetManager.deletePreset(id);
          overlay.remove();
          showPresetListDialog({ fromDicePanel }, false);
          deps.refreshDicePanelPresets();
        } catch (err) {
          if (window.toastr) showActionableErrorToast('删除失败: ' + err.message, { title: '高级骰子预设删除失败', suggestion: 'save' });
        }
      }
    });

    overlay.find('#acu-advanced-preset-new').on('click', () => {
      overlay.remove();
      deps.showAdvancedPresetEditor();
    });

    overlay.find('#acu-advanced-preset-import').on('click', () => {
      overlay.find('#acu-advanced-preset-file-input').trigger('click');
    });

    const $list = overlay.find('#acu-advanced-presets-list');
    deps.createSortableList({
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
          deps.AdvancedDicePresetManager.setPresetOrder(id, index);
        });
        deps.refreshDicePanelPresets();
      },
    });

    overlay.find('#acu-advanced-preset-file-input').on('change', function (e) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      void (async () => {
        try {
          const jsonStr = await deps.readTextFile(file);
          const result = deps.AdvancedDicePresetManager.importPreset(jsonStr);
          if (result) {
            overlay.remove();
            showPresetListDialog({ fromDicePanel }, false);
            deps.refreshDicePanelPresets();
          } else {
            const importError = deps.AdvancedDicePresetManager.getLastImportError();
            if (window.toastr) showActionableErrorToast('导入失败: ' + (importError || '格式错误'), { suggestion: 'importExport' });
          }
        } catch (err) {
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getAdvancedPresetErrorMessage(err), { suggestion: 'importExport' });
        } finally {
          input.value = '';
        }
      })();
    });

    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal(); // 返回上一个弹窗
    });
  };
  return showPresetListDialog;
}
