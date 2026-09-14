// @ts-nocheck
/**
 * refresh-dialogue-indent-render.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshDialogueIndentRender(deps: any) {
  const refreshDialogueIndentRender = (): void => deps.getDialogueIndentRenderer().refreshNow();
  return refreshDialogueIndentRender;
}
