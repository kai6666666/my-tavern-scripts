// @ts-nocheck
/**
 * get-resolved-composer-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetResolvedComposerText(deps: any) {
  const getResolvedComposerText = (): string => {
    const textarea = deps.getComposerTextarea();
    if (!textarea) return '';
    const visibleText = deps.readTextareaVisibleValue(textarea);
    return deps.syncTextareaDiceCacheFromVisibleText(textarea, visibleText).trim();
  };
  return getResolvedComposerText;
}
