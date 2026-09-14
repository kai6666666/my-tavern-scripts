// @ts-nocheck
/**
 * create-element-from-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateElementFromHtml(deps: any) {
  const createElementFromHtml = (targetDocument: Document, html: string): HTMLElement | null => {
    const template = targetDocument.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild as HTMLElement | null;
  };
  return createElementFromHtml;
}
