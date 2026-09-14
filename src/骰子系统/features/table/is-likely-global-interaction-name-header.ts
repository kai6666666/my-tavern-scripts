// @ts-nocheck
/**
 * is-likely-global-interaction-name-header.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsLikelyGlobalInteractionNameHeader(deps: any) {
  const isLikelyGlobalInteractionNameHeader = (header: unknown): boolean => {
    const headerText = deps.normalizeGlobalInteractionHeader(header);
    if (!headerText) return false;
    if (deps.getGLOBAL_INTERACTION_NAME_HEADERS().some(keyword => headerText === keyword.toLowerCase())) return true;
    if (deps.getGLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS().some(keyword => headerText.includes(keyword.toLowerCase())))
      return false;
    return deps.getGLOBAL_INTERACTION_NAME_HEADER_KEYWORDS().some(keyword => headerText.includes(keyword.toLowerCase()));
  };
  return isLikelyGlobalInteractionNameHeader;
}
