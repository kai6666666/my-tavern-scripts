// @ts-nocheck
/**
 * get-accessible-document.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAccessibleDocument(deps: any) {
  const getAccessibleDocument = (targetWindow: Window | null | undefined): Document | null => {
    if (!targetWindow) return null;
    try {
      return targetWindow.document || null;
    } catch {
      return null;
    }
  };
  return getAccessibleDocument;
}
