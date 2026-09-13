// @ts-nocheck
/**
 * update-save-button-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createUpdateSaveButtonState(deps: any) {
  const updateSaveButtonState = () => {
    const { $ } = deps.getCore();
    const $btn = $('#acu-btn-save-global');
    const $icon = $btn.find('i');
    const deletions = deps.getPendingDeletions();
    let hasDeletions = false;
    if (deletions) {
      for (const key in deletions) {
        if (deletions[key] && deletions[key].length > 0) {
          hasDeletions = true;
          break;
        }
      }
    }
    if (deps.hasUnsavedChanges || hasDeletions) {
      $icon.addClass('acu-icon-breathe');
      $btn.attr('title', '你有未保存的手动修改或删除操作');
    } else {
      $icon.removeClass('acu-icon-breathe');
      $btn.attr('title', '保存');
      $btn.css('color', '');
    }
  };
  return updateSaveButtonState;
}
