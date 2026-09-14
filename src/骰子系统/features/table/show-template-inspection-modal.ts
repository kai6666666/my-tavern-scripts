// @ts-nocheck
/**
 * show-template-inspection-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { inspectTableTemplateWithPreset } from './table-template-requirements';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowTemplateInspectionModal(deps: any) {
  const showTemplateInspectionModal = (): void => {
    const dbApi = deps.getCore().getDB() as Record<string, unknown> | null | undefined;
    if (!dbApi || typeof dbApi.getTableTemplate !== 'function') {
      showActionableErrorToast('数据库模板 API 不可用，无法读取当前聊天表格模板。', { developerHint: true });
      return;
    }

    try {
      const template = (dbApi.getTableTemplate as () => unknown).call(dbApi);
      const preset = deps.TableTemplateRequirementPresetManager.getActivePreset();
      const result = inspectTableTemplateWithPreset(template, preset);
      deps.showTemplateInspectionResultModal(result);
    } catch (error) {
      console.error('[DICE]检验表格模板失败:', error);
      showActionableErrorToast(`检验表格模板失败: ${(error as Error).message || error}`, {
        suggestion: 'tableTemplate',
        developerHint: true,
      });
    }
  };
  return showTemplateInspectionModal;
}
