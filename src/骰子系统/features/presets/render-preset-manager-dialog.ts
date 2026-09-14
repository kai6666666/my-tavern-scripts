// @ts-nocheck
/**
 * render-preset-manager-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowRenderPresetManager(deps: any) {
  const showRenderPresetManager = () => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showRenderPresetManager', showRenderPresetManager);

    const config = deps.getConfig();
    const presets = deps.RenderPresetManager.getAllPresets();
    const activeId = deps.RenderPresetManager.getActivePresetId();

    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin === true;
        const aliasCount = Object.keys(preset.rules.columnDisplay.aliases).length;
        const excludedCount = preset.rules.quickCheck.excludeKeywords.length;
        const dialogueWhitelist = preset.rules.dialogueIndent.whitelist;
        const dialogueBlacklistCount = preset.rules.dialogueIndent.blacklist.length;
        const dialogueScope =
          dialogueWhitelist.length === 0 || dialogueWhitelist.includes('*')
            ? '正文头像渲染全局'
            : `正文头像渲染白名单 ${dialogueWhitelist.length}`;
        const ruleSummary = [
          preset.rules.attributes.enabled ? '属性键值对' : '',
          preset.rules.relationship.enabled ? '关系拆分' : '',
          preset.rules.shortTags.enabled ? '短标签' : '',
          preset.rules.quickCheck.enabled ? '快捷检定过滤' : '',
          '正文头像渲染标签过滤',
        ]
          .filter(Boolean)
          .join('、');

        return `
          <div class="acu-preset-item" data-id="${deps.escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name">${deps.escapeHtml(preset.name)}${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}</div>
              ${preset.description ? `<div class="acu-preset-desc">${deps.escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats">
                规则: ${deps.escapeHtml(ruleSummary || '基础文本')} | 列名别名: ${aliasCount} | 快捷检定排除: ${excludedCount} | ${deps.escapeHtml(dialogueScope)}，黑名单: ${dialogueBlacklistCount}
              </div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle">
                <input type="checkbox" class="acu-render-preset-toggle" data-id="${deps.escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${deps.escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-render-preset-copy" data-id="${deps.escapeHtml(preset.id)}" title="复制为自定义渲染预设" aria-label="复制 ${deps.escapeHtml(preset.name)} 为自定义渲染预设"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-render-preset-edit" data-id="${deps.escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-render-preset-export" data-id="${deps.escapeHtml(preset.id)}" title="导出" aria-label="导出 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-render-preset-delete" data-id="${deps.escapeHtml(preset.id)}" title="删除" aria-label="删除 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-render-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-table-cells-large"></i> 渲染预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('renderPresetManager', '查看渲染预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭渲染预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-render-presets-list">
              ${presetsHtml}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-render-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建渲染预设" aria-label="新建渲染预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-render-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-render-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-render-preset-back').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.on('change', '.acu-render-preset-toggle', function () {
      const $toggle = $(this);
      const id = String($toggle.data('id') || '');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        deps.RenderPresetManager.setActivePresetId(id);
        overlay.find('.acu-render-preset-toggle').each(function () {
          if (String($(this).data('id') || '') !== id) {
            $(this).prop('checked', false);
          }
        });
        deps.renderInterface();
        deps.refreshDialogueIndentRender();
        if (window.toastr) window.toastr.success('渲染预设已启用');
        return;
      }

      deps.RenderPresetManager.setActivePresetId(deps.RENDER_DEFAULT_PRESET_ID);
      overlay.find('.acu-render-preset-toggle').each(function () {
        const toggleId = String($(this).data('id') || '');
        $(this).prop('checked', toggleId === deps.RENDER_DEFAULT_PRESET_ID);
      });
      deps.renderInterface();
      deps.refreshDialogueIndentRender();
      if (window.toastr) window.toastr.info('已切回默认渲染预设');
    });

    overlay.on('click', '.acu-render-preset-edit', function () {
      const id = String($(this).data('id') || '');
      overlay.remove();
      deps.showRenderPresetEditor(id);
    });

    overlay.on('click', '.acu-render-preset-export', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      const json = deps.RenderPresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '渲染预设导出失败', suggestion: 'importExport' });
        return;
      }

      deps.downloadJsonFile(json, `${preset?.name || '渲染预设'}.json`);
      if (window.toastr) window.toastr.success('已导出渲染预设');
    });

    overlay.on('click', '.acu-render-preset-copy', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset) return;

      const copy = deps.RenderPresetManager.createPreset({
        name: `${preset.name} (副本)`,
        description: preset.description || '',
        rules: preset.rules,
      });
      if (window.toastr) window.toastr.success(`已创建副本：${copy.name}`);
      overlay.remove();
      showRenderPresetManager();
    });

    overlay.on('click', '.acu-render-preset-delete', async function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset || preset.builtin) return;

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除渲染预设',
        message: `确定要删除渲染预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除渲染预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;

      const success = deps.RenderPresetManager.deletePreset(id);
      if (success) {
        deps.renderInterface();
        deps.refreshDialogueIndentRender();
        overlay.remove();
        showRenderPresetManager();
      } else if (window.toastr) {
        showActionableErrorToast('删除失败', { title: '渲染预设删除失败', suggestion: 'save' });
      }
    });

    overlay.find('#acu-render-preset-new').on('click', () => {
      overlay.remove();
      deps.showRenderPresetEditor();
    });

    overlay.find('#acu-render-preset-import').on('click', () => {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const jsonText = selected.text.trim();
          if (!jsonText) {
            if (window.toastr) showActionableErrorToast('文件内容为空', { suggestion: 'importExport' });
            return;
          }

          const imported = deps.RenderPresetManager.importPreset(jsonText);
          if (imported) {
            if (window.toastr) window.toastr.success(`导入成功：${imported.name}`);
            overlay.remove();
            showRenderPresetManager();
          }
        } catch (error) {
          console.error('[DICE]ACU 渲染预设导入失败:', error);
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showRenderPresetManager;
}
