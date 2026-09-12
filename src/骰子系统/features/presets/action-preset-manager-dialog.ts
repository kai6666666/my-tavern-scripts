// @ts-nocheck
/**
 * action-preset-manager-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowActionPresetManager(deps: any) {
  const showActionPresetManager = () => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showActionPresetManager', showActionPresetManager);

    const config = deps.getConfig();
    const presets = deps.ActionPresetManager.getAllPresets();
    const activeId = deps.ActionPresetManager.getActivePresetId();

    // 生成预设列表HTML
    const presetsHtml =
      presets.length === 0
        ? `<div class="acu-empty-state">暂无交互规则预设，点击下方按钮创建</div>`
        : presets
            .map(preset => {
              const isActive = preset.id === activeId;
              const isBuiltin = preset.builtin === true;
              const keywordsSummary =
                (preset.rules || [])
                  .flatMap(r => r.table_keywords || [])
                  .slice(0, 3)
                  .join('、') || '无';
              const actionsSummary =
                (preset.rules || [])
                  .flatMap(r => (r.actions || []).map(a => a.label))
                  .slice(0, 4)
                  .join('、') || '无';

              return `
          <div class="acu-preset-item" data-id="${deps.escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name">${deps.escapeHtml(preset.name)}${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}</div>
              ${preset.description ? `<div class="acu-preset-desc">${deps.escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats">
                关键词: ${deps.escapeHtml(keywordsSummary)} | 动作: ${deps.escapeHtml(actionsSummary)}
              </div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle">
                <input type="checkbox" class="acu-action-preset-toggle" data-id="${deps.escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${deps.escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-action-preset-copy" data-id="${deps.escapeHtml(preset.id)}" title="复制为交互规则预设" aria-label="复制 ${deps.escapeHtml(preset.name)} 为交互规则预设"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-action-preset-edit" data-id="${deps.escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-action-preset-export" data-id="${deps.escapeHtml(preset.id)}" title="导出" aria-label="导出 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-action-preset-delete" data-id="${deps.escapeHtml(preset.id)}" title="删除" aria-label="删除 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        `;
            })
            .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-action-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-wand-magic-sparkles"></i> 交互规则预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('actionPresetManager', '查看交互规则预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭交互规则预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-action-presets-list">
              ${presetsHtml}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-action-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建交互规则预设" aria-label="新建交互规则预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-action-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-action-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn, #acu-action-preset-back').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    // Toggle切换预设激活状态（单选）
    overlay.on('change', '.acu-action-preset-toggle', function () {
      const $toggle = $(this);
      const id = $toggle.data('id');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        deps.ActionPresetManager.setActivePresetId(id);
        // 取消其他toggle
        overlay.find('.acu-action-preset-toggle').each(function () {
          if ($(this).data('id') !== id) {
            $(this).prop('checked', false);
          }
        });
      } else {
        // 只有当取消的是当前激活的预设时，才清空
        if (deps.ActionPresetManager.getActivePresetId() === id) {
          deps.ActionPresetManager.setActivePresetId(null);
          if (window.toastr) window.toastr.info('所有交互规则已禁用');
        }
      }
    });

    // 编辑预设
    overlay.on('click', '.acu-action-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      deps.showActionPresetEditor(id);
    });

    // 导出预设 - 下载为JSON文件
    overlay.on('click', '.acu-action-preset-export', function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);
      const json = deps.ActionPresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '动作预设导出失败', suggestion: 'importExport' });
        return;
      }

      deps.downloadJsonFile(json, `${preset?.name || '交互规则预设'}.json`);
      if (window.toastr) window.toastr.success('已导出文件');
    });

    // 复制内置预设为自定义预设
    overlay.on('click', '.acu-action-preset-copy', function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);
      if (!preset) return;

      const copyData = {
        name: preset.name + ' (副本)',
        description: preset.description || '',
        rules: JSON.parse(JSON.stringify(preset.rules)),
      };

      const newPreset = deps.ActionPresetManager.createPreset(copyData);
      if (newPreset) {
        if (window.toastr)
          window.toastr.success(`已创建副本：${newPreset.name}，包含 ${newPreset.rules.length} 个规则组`);
        overlay.remove();
        showActionPresetManager(); // 刷新列表而不是打开编辑器
      }
    });

    // 删除预设
    overlay.on('click', '.acu-action-preset-delete', async function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除交互规则预设',
        message: `确定要删除交互规则预设「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = deps.ActionPresetManager.deletePreset(id);
        if (success) {
          overlay.remove();
          showActionPresetManager();
        } else {
          if (window.toastr) showActionableErrorToast('删除失败', { title: '动作预设删除失败', suggestion: 'save' });
        }
      }
    });

    // 新建预设
    overlay.find('#acu-action-preset-new').on('click', () => {
      overlay.remove();
      deps.showActionPresetEditor();
    });

    // 导入预设 - 选择 JSON/JSONC 文件上传
    overlay.find('#acu-action-preset-import').on('click', () => {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const jsonStr = selected.text;
          if (!jsonStr?.trim()) {
            if (window.toastr) showActionableErrorToast('文件内容为空', { suggestion: 'importExport' });
            return;
          }

          const result = deps.ActionPresetManager.importPreset(jsonStr.trim());
          if (result) {
            if (window.toastr) window.toastr.success(`导入成功：${result.name}`);
            overlay.remove();
            showActionPresetManager();
          } else {
            if (window.toastr) showActionableErrorToast('导入失败，请检查 JSONC 格式', { suggestion: 'importExport' });
          }
        } catch (error) {
          console.error('[DICE]ACU 交互规则导入失败:', error);
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    // 点击遮罩关闭
    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showActionPresetManager;
}
