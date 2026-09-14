// @ts-nocheck
/**
 * get-dice-profile-silly-tavern.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceProfileSillyTavern(deps: any) {
  const getDiceProfileSillyTavern = (): any => window.SillyTavern || window.parent?.SillyTavern || null;
  return getDiceProfileSillyTavern;
}
