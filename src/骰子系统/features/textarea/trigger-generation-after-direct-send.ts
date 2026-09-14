// @ts-nocheck
/**
 * trigger-generation-after-direct-send.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createTriggerGenerationAfterDirectSend(deps: any) {
  const triggerGenerationAfterDirectSend = async (): Promise<boolean> => {
    const triggerSlashFn = deps.findRuntimeFunction('triggerSlash');
    if (triggerSlashFn) {
      await triggerSlashFn('/trigger');
      return true;
    }
    const runSlash = deps.findSillyTavernSlashRunner();
    if (runSlash) {
      await runSlash('/trigger');
      return true;
    }
    return false;
  };
  return triggerGenerationAfterDirectSend;
}
