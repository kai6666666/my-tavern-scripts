// @ts-nocheck
/**
 * save-data-to-database.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createSaveDataToDatabase(deps: any) {
  const saveDataToDatabase = async (tableData, skipRender = false, commitDeletes = false) => {
    if (deps.getIsSaving()) {
      console.warn('[DICE]保存操作正在进行中，跳过重复请求');
      return;
    }
    console.info('[DICE]开始通过数据库 CRUD 保存数据...');
    deps.setIsSaving(true);
    const { $ } = deps.getCore();
    const $saveBtn = $('#acu-btn-save-global');

    if (!skipRender && $saveBtn.length) {
      $saveBtn.find('i').removeClass('fa-save').addClass('fa-spinner fa-spin');
      $saveBtn.prop('disabled', true);
    }

    try {
      const dataToSave = await deps.applyRuntimeDataViaCrud(tableData, undefined, { commitDeletes });
      deps.saveSnapshot(dataToSave);
      deps.setHasUnsavedChanges(false);
      deps.setCurrentDiffMap(new Set());
      if (window.acuModifiedSet) window.acuModifiedSet.clear();
      console.info('[DICE]本地状态已更新，未保存更改已清除');

      if (!skipRender) {
        deps.renderInterface();
      }
    } catch (e) {
      const errorMessage = e.message || '保存出错，请检查数据格式和数据库版本';
      console.error('[DICE]保存数据失败:', {
        error: e,
        message: errorMessage,
        stack: e.stack,
      });
      if (window.toastr) {
        showActionableErrorToast(errorMessage, { title: '保存失败', suggestion: 'save', toastrOptions: { timeOut: 7000 } });
      } else {
        void deps.showDiceSystemConfirmDialog({
          title: '保存失败',
          message: errorMessage,
          iconClass: 'fa-triangle-exclamation',
          confirmText: '知道了',
          tone: 'danger',
          hideCancel: true,
        });
      }
      throw e;
    } finally {
      deps.setIsSaving(false);
      console.info('[DICE]保存操作完成');
      if (!skipRender && $saveBtn.length) {
        $saveBtn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-save');
        $saveBtn.prop('disabled', false);
      }
    }
  };
  return saveDataToDatabase;
}
