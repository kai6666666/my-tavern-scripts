// @ts-nocheck
/**
 * update-changes-count.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_VALIDATION_MODE } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createUpdateChangesCount(deps: any) {
  const updateChangesCount = rawData => {
    const { $ } = deps.getCore();
    const snapshot = deps.loadSnapshot();
    const changesCount = deps.countRuntimeDataChanges(snapshot, rawData);

    // 获取验证错误数量
    const validationErrorCount = rawData ? deps.ValidationEngine.getErrorCount(rawData) : 0;

    // 根据模式决定显示的数量：数据验证模式只计错误数，完整审核模式只计变更数
    const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
    const displayCount = isValidationMode ? validationErrorCount : changesCount;
    // 警告图标只在数据验证模式下且有错误时显示
    const showWarningIcon = isValidationMode && validationErrorCount > 0;

    const $btn = $('#acu-btn-changes');
    const $span = $btn.find('span');
    $span.html(displayCount > 0 ? `审核(${displayCount})` : '审核');

    // 更新警告图标
    if (showWarningIcon) {
      if (!$btn.find('.acu-nav-warning-icon').length) {
        $span.append(' <i class="fa-solid fa-triangle-exclamation acu-nav-warning-icon"></i>');
      }
      $btn.addClass('has-validation-errors');
    } else {
      $btn.find('.acu-nav-warning-icon').remove();
      $btn.removeClass('has-validation-errors');
    }
  };
  return updateChangesCount;
}
