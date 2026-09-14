// @ts-nocheck
/**
 * get-viewport-anchor-rect.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetViewportAnchorRect(deps: any) {
  const getViewportAnchorRect = (): DOMRect | null => {
    const targetDocument = deps.getTavernHostDocument();

    const chat = targetDocument.querySelector<HTMLElement>('#chat');
    if (!chat) return null;

    const rect = chat.getBoundingClientRect();
    return rect.width > 0 ? rect : null;
  };
  return getViewportAnchorRect;
}
