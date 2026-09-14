// @ts-nocheck
/**
 * dashboard-preset-manager-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDashboardPresetManager(deps: any) {
  const showDashboardPresetManager = () => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showDashboardPresetManager', showDashboardPresetManager);

    const config = deps.getConfig();
    const presets = deps.DashboardPresetManager.getAllPresets();
    const activeId = deps.DashboardPresetManager.getActivePresetId();

    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin === true;
        const hasRelationshipGraph = Boolean(preset.modules[deps.DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY]?.sources?.length);
        const moduleNames = [
          ...deps.DASHBOARD_PRESET_MODULE_KEYS.filter(moduleKey => Boolean(preset.modules[moduleKey])),
          ...(hasRelationshipGraph ? ['relationshipGraph'] : []),
        ];
        const moduleSummary = moduleNames.join('、') || '无';
        const keywordSummary =
          Object.values(preset.modules)
            .flatMap(moduleConfig => [
              ...(moduleConfig.tableKeywords || []),
              ...(moduleConfig.sources || []).flatMap(source => source.tableKeywords),
            ])
            .slice(0, 5)
            .join('、') || '无';

        return `
          <div class="acu-preset-item" data-id="${deps.escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name">${deps.escapeHtml(preset.name)}${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}</div>
              ${preset.description ? `<div class="acu-preset-desc">${deps.escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats">
                区域: ${deps.escapeHtml(moduleSummary)} | 关键词: ${deps.escapeHtml(keywordSummary)}
              </div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle">
                <input type="checkbox" class="acu-dashboard-preset-toggle" data-id="${deps.escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${deps.escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-dashboard-preset-copy" data-id="${deps.escapeHtml(preset.id)}" title="复制为仪表盘预设" aria-label="复制 ${deps.escapeHtml(preset.name)} 为仪表盘预设"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-dashboard-preset-edit" data-id="${deps.escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-dashboard-preset-export" data-id="${deps.escapeHtml(preset.id)}" title="导出" aria-label="导出 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-dashboard-preset-delete" data-id="${deps.escapeHtml(preset.id)}" title="删除" aria-label="删除 ${deps.escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-dashboard-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-chart-line"></i> 仪表盘预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('dashboardPresetManager', '查看仪表盘预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭仪表盘预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-dashboard-presets-list">
              ${presetsHtml}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-dashboard-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建仪表盘预设" aria-label="新建仪表盘预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-dashboard-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-dashboard-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-dashboard-preset-back').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.on('change', '.acu-dashboard-preset-toggle', function () {
      const $toggle = $(this);
      const id = String($toggle.data('id') || '');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        deps.DashboardPresetManager.setActivePresetId(id);
        overlay.find('.acu-dashboard-preset-toggle').each(function () {
          if (String($(this).data('id') || '') !== id) {
            $(this).prop('checked', false);
          }
        });
        if (window.toastr) window.toastr.success('仪表盘预设已启用');
        return;
      }

      deps.DashboardPresetManager.setActivePresetId(deps.DASHBOARD_DEFAULT_PRESET_ID);
      overlay.find('.acu-dashboard-preset-toggle').each(function () {
        const toggleId = String($(this).data('id') || '');
        $(this).prop('checked', toggleId === deps.DASHBOARD_DEFAULT_PRESET_ID);
      });
      if (window.toastr) window.toastr.info('已切回默认仪表盘预设');
    });

    overlay.on('click', '.acu-dashboard-preset-edit', function () {
      const id = String($(this).data('id') || '');
      overlay.remove();
      deps.showDashboardPresetEditor(id);
    });

    overlay.on('click', '.acu-dashboard-preset-export', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      const json = deps.DashboardPresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '仪表盘预设导出失败', suggestion: 'importExport' });
        return;
      }

      deps.downloadJsonFile(json, `${preset?.name || '仪表盘预设'}.json`);
      if (window.toastr) window.toastr.success('已导出仪表盘预设');
    });

    overlay.on('click', '.acu-dashboard-preset-copy', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset) return;

      const copy = deps.DashboardPresetManager.createPreset({
        name: `${preset.name} (副本)`,
        description: preset.description || '',
        modules: preset.modules,
      });
      if (window.toastr) window.toastr.success(`已创建副本：${copy.name}`);
      overlay.remove();
      showDashboardPresetManager();
    });

    overlay.on('click', '.acu-dashboard-preset-delete', async function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset || preset.builtin) return;

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除仪表盘预设',
        message: `确定要删除仪表盘预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = deps.DashboardPresetManager.deletePreset(id);
        if (success) {
          overlay.remove();
          showDashboardPresetManager();
        } else if (window.toastr) {
          showActionableErrorToast('删除失败', { title: '仪表盘预设删除失败', suggestion: 'save' });
        }
      }
    });

    overlay.find('#acu-dashboard-preset-new').on('click', () => {
      overlay.remove();
      deps.showDashboardPresetEditor();
    });

    overlay.find('#acu-dashboard-preset-import').on('click', () => {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const jsonText = selected.text.trim();
          if (!jsonText) {
            if (window.toastr) showActionableErrorToast('文件内容为空', { suggestion: 'importExport' });
            return;
          }

          const imported = deps.DashboardPresetManager.importPreset(jsonText);
          if (imported) {
            if (window.toastr) window.toastr.success(`导入成功：${imported.name}`);
            overlay.remove();
            showDashboardPresetManager();
          }
        } catch (error) {
          console.error('[DICE]ACU 仪表盘预设导入失败:', error);
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showDashboardPresetManager;
}
