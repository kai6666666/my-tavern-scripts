// @ts-nocheck
/**
 * update-validation-indicator.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createUpdateValidationIndicator(deps: any) {
  const updateValidationIndicator = count => {
    const { $ } = deps.getCore();
    const $indicator = $('.acu-validation-indicator');

    if (count > 0) {
      if ($indicator.length) {
        $indicator.find('.acu-validation-count').text(count);
        $indicator.show();
      }
    } else {
      $indicator.hide();
    }
  };
  return updateValidationIndicator;
}
