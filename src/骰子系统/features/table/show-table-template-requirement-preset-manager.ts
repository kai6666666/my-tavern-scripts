// @ts-nocheck
/**
 * show-table-template-requirement-preset-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT, cloneTemplateValue } from '../../features/table/table-template-requirements';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowTableTemplateRequirementPresetManager(deps: any) {
  const showTableTemplateRequirementPresetManager = (): void => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showTableTemplateRequirementPresetManager', showTableTemplateRequirementPresetManager);

    const config = deps.getConfig();
    const presets = deps.TableTemplateRequirementPresetManager.getAllPresets();
    const activeId = deps.TableTemplateRequirementPresetManager.getActivePresetId();
    const presetsHtml = presets
            .map(preset => {
              const isActive = preset.id === activeId;
              const isBuiltin = preset.builtin === true;
              const stats = deps.getTableTemplateRequirementPresetStats(preset);
              return `
          <div class="acu-preset-item acu-table-template-requirement-preset-item" data-id="${deps.escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name" title="${deps.escapeHtml(preset.name)}">
                ${deps.escapeHtml(preset.name)}
                ${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}
                ${isActive ? `<span class="acu-preset-badge">当前</span>` : ''}
              </div>
              ${preset.description ? `<div class="acu-preset-desc">${deps.escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats" title="${deps.escapeHtml(preset.format || TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT)}">${stats.sheetCount} 张表 · ${stats.headerCount} 列</div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle" title="设为当前模板检验预设">
                <input type="checkbox" class="acu-table-template-requirement-preset-toggle" data-id="${deps.escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${deps.escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-table-template-requirement-preset-copy" data-id="${deps.escapeHtml(preset.id)}" title="复制为自定义预设" aria-label="复制 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-table-template-requirement-preset-edit" data-id="${deps.escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-table-template-requirement-preset-export" data-id="${deps.escapeHtml(preset.id)}" title="导出" aria-label="导出 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-table-template-requirement-preset-delete" data-id="${deps.escapeHtml(preset.id)}" title="删除" aria-label="删除 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>`;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-manager-dialog acu-table-template-requirement-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3><i class="fa-solid fa-table-list"></i> 模板检验预设管理</h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('tableTemplateRequirementPresetManager', '查看模板检验预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭模板检验预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-table-template-requirement-presets-list">
              ${presetsHtml || `<div class="acu-empty-state">暂无模板检验预设</div>`}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-table-template-requirement-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建模板检验预设" aria-label="新建模板检验预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-table-template-requirement-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-table-template-requirement-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-table-template-requirement-preset-back').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.on('change', '.acu-table-template-requirement-preset-toggle', function () {
      const $toggle = $(this);
      const id = String($toggle.data('id') || '');
      if (!$toggle.is(':checked')) {
        $toggle.prop('checked', true);
        return;
      }
      const success = deps.TableTemplateRequirementPresetManager.setActivePresetId(id);
      if (!success) {
        showActionableErrorToast('切换模板检验预设失败', { suggestion: 'tableTemplate' });
        return;
      }
      overlay.find('.acu-table-template-requirement-preset-toggle').each(function () {
        if (String($(this).data('id') || '') !== id) $(this).prop('checked', false);
      });
      if (window.toastr) window.toastr.success('已切换模板检验预设');
      overlay.remove();
      showTableTemplateRequirementPresetManager();
    });

    overlay.on('click', '.acu-table-template-requirement-preset-copy', function () {
      const id = String($(this).data('id') || '');
      const preset = deps.TableTemplateRequirementPresetManager.getPresetById(id);
      if (!preset) return;
      const copy = deps.TableTemplateRequirementPresetManager.createPreset({
        name: `${preset.name} (副本)`,
        description: preset.description || '',
        requirementLevels: preset.requirementLevels ? cloneTemplateValue(preset.requirementLevels) : undefined,
        template: cloneTemplateValue(preset.template),
      });
      if (copy && window.toastr) window.toastr.success(`已创建副本：${copy.name}`);
      overlay.remove();
      showTableTemplateRequirementPresetManager();
    });

    overlay.on('click', '.acu-table-template-requirement-preset-edit', function () {
      const id = String($(this).data('id') || '');
      overlay.remove();
      deps.popModal();
      deps.showTableTemplateRequirementPresetEditor(id);
    });

    overlay.on('click', '.acu-table-template-requirement-preset-export', function () {
      const id = String($(this).data('id') || '');
      const preset = deps.TableTemplateRequirementPresetManager.getPresetById(id);
      const json = deps.TableTemplateRequirementPresetManager.exportPreset(id);
      if (!json) {
        showActionableErrorToast('导出失败', { title: '模板检验预设导出失败', suggestion: 'importExport' });
        return;
      }
      deps.downloadJsonFile(json, `${preset?.name || '模板检验预设'}.json`);
      if (window.toastr) window.toastr.success('已导出文件');
    });

    overlay.on('click', '.acu-table-template-requirement-preset-delete', async function () {
      const id = String($(this).data('id') || '');
      const preset = deps.TableTemplateRequirementPresetManager.getPresetById(id);
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除模板检验预设',
        message: `确定要删除「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。内置默认预设不会被删除。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;
      try {
        const success = deps.TableTemplateRequirementPresetManager.deletePreset(id);
        if (!success) {
          showActionableErrorToast('删除失败', { title: '模板检验预设删除失败', suggestion: 'save' });
          return;
        }
        overlay.remove();
        showTableTemplateRequirementPresetManager();
      } catch (error) {
        showActionableErrorToast('删除失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'save' });
      }
    });

    overlay.find('#acu-table-template-requirement-preset-new').on('click', () => {
      overlay.remove();
      deps.popModal();
      deps.showTableTemplateRequirementPresetEditor();
    });

    overlay.find('#acu-table-template-requirement-preset-import').on('click', () => {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const preset = deps.TableTemplateRequirementPresetManager.importPreset(selected.text);
          if (!preset) {
            showActionableErrorToast('导入失败，请检查 JSONC 格式和 template 内容', { suggestion: 'importExport' });
            return;
          }
          if (window.toastr) window.toastr.success(`导入成功：${preset.name}`);
          overlay.remove();
          showTableTemplateRequirementPresetManager();
        } catch (error) {
          console.error('[DICE]ACU 模板检验预设导入失败:', error);
          showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showTableTemplateRequirementPresetManager;
}
