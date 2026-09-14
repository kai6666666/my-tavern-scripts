// @ts-nocheck
/**
 * get-tavern-host-document.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetTavernHostDocument(deps: any) {
  const getTavernHostDocument = (): Document => deps.getAccessibleDocument(deps.getTavernHostWindow()) || document;
  return getTavernHostDocument;
}
