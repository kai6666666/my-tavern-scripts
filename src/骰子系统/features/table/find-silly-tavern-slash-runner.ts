// @ts-nocheck
/**
 * find-silly-tavern-slash-runner.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindSillyTavernSlashRunner(deps: any) {
  const findSillyTavernSlashRunner = () => {
    for (const runtimeWindow of deps.getRuntimeWindowCandidates()) {
      const ST = runtimeWindow?.SillyTavern;
      if (typeof ST?.executeSlashCommandsWithOptions === 'function') {
        return ST.executeSlashCommandsWithOptions.bind(ST);
      }
    }
    return null;
  };
  return findSillyTavernSlashRunner;
}
