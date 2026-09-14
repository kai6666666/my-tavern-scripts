// @ts-nocheck
/**
 * should-show-reverse-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShouldShowReverseButton(deps: any) {
  const shouldShowReverseButton = tableName => {
    return typeof tableName === 'string' && tableName.trim().length > 0;
  };
  return shouldShowReverseButton;
}
