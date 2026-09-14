// @ts-nocheck
/**
 * repair-current-table-template-from-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { buildTableTemplateAppendRepairPlan } from '../../features/table/table-template-requirements';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createRepairCurrentTableTemplateFromPreset(deps: any) {
  const repairCurrentTableTemplateFromPreset = async (presetId: string, currentOverlay?: JQuery<HTMLElement>): Promise<void> => {
    const dbApi = deps.getCore().getDB() as Record<string, unknown> | null | undefined;
    if (!dbApi || typeof dbApi.getTableTemplate !== 'function' || typeof dbApi.importTemplateFromData !== 'function') {
      showActionableErrorToast('数据库模板 API 不可用，无法修复当前聊天表格模板。', { developerHint: true });
      return;
    }

    const preset = deps.TableTemplateRequirementPresetManager.getPresetById(presetId) || deps.TableTemplateRequirementPresetManager.getActivePreset();
    if (!preset) {
      showActionableErrorToast('找不到当前模板检验预设。', { suggestion: 'tableTemplate' });
      return;
    }

    try {
      const currentTemplate = (dbApi.getTableTemplate as () => unknown).call(dbApi);
      const plan = buildTableTemplateAppendRepairPlan(currentTemplate, preset);
      if (plan.manualIssues.length > 0 && plan.actions.length === 0) {
        showActionableErrorToast(`当前模板存在需要手动处理的问题：${plan.manualIssues[0]}`, {
          suggestion: 'tableTemplate',
        });
        return;
      }
      if (!plan.changed || !plan.repairedTemplate) {
        if (window.toastr) window.toastr.info('当前聊天模板已经满足可自动追加的要求。');
        currentOverlay?.remove();
        deps.showTemplateInspectionModal();
        return;
      }

      const actionPreview = plan.actions.slice(0, 12).map(action => `• ${action}`);
      const hiddenActionCount = Math.max(0, plan.actions.length - actionPreview.length);
      if (hiddenActionCount > 0) actionPreview.push(`• 还有 ${hiddenActionCount} 项追加动作`);
      const manualPreview = plan.manualIssues.slice(0, 6).map(issue => `• ${issue}`);
      const detailParts = [
        '将只修复当前聊天模板，不会修改全局模板，也不会直接写入运行时表格数据。',
        '',
        '将追加：',
        ...actionPreview,
      ];
      if (manualPreview.length > 0) {
        detailParts.push('', '仍需手动处理：', ...manualPreview);
      }

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '修复当前聊天表格模板',
        message: '将把缺失表、缺失列、建表说明和模板说明追加到当前聊天模板末尾。',
        detail: detailParts.join('\n'),
        iconClass: 'fa-wrench',
        confirmText: '修复当前聊天模板',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;

      const importResult = await (dbApi.importTemplateFromData as Function).call(dbApi, plan.repairedTemplate, {
        scope: 'chat',
      });
      if (importResult && typeof importResult === 'object' && importResult.success === false) {
        throw new Error(importResult.error || importResult.message || '数据库本体拒绝导入修复后的模板');
      }

      if (window.toastr) window.toastr.success(`已追加修复 ${plan.actions.length} 项当前聊天模板要求`);
      currentOverlay?.remove();
      deps.showTemplateInspectionModal();
    } catch (error) {
      console.error('[DICE]智能修复表格模板失败:', error);
      showActionableErrorToast(`智能修复失败: ${(error as Error).message || error}`, {
        suggestion: 'tableTemplate',
        developerHint: true,
      });
    }
  };
  return repairCurrentTableTemplateFromPreset;
}
