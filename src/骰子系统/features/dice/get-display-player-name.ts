// @ts-nocheck
/**
 * get-display-player-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDisplayPlayerName(deps: any) {
  const getDisplayPlayerName = () => {
    return deps.getPersonaName() || deps.getPlayerName() || '主角';
  };
  return getDisplayPlayerName;
}
