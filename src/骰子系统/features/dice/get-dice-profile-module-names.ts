// @ts-nocheck
/**
 * get-dice-profile-module-names.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceProfileModuleNames(deps: any) {
  const getDiceProfileModuleNames = (moduleIds: readonly DiceConfigBackupModuleId[]): string =>
    moduleIds
      .map(moduleId => deps.getDiceConfigBackupModuleDefinition(moduleId)?.name || moduleId)
      .join('、');
  return getDiceProfileModuleNames;
}
