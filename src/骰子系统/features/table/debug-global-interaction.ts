// @ts-nocheck
/**
 * debug-global-interaction.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDebugGlobalInteraction(deps: any) {
  const debugGlobalInteraction = (event: string, details: Record<string, unknown> = {}): void => {
    const debugWindow = window as Window & { ACU_GLOBAL_INTERACTION_DEBUG?: boolean };
    if (!debugWindow.ACU_GLOBAL_INTERACTION_DEBUG) return;
    console.log(deps.getGLOBAL_INTERACTION_DEBUG_PREFIX(), event, details);
  };
  return debugGlobalInteraction;
}
