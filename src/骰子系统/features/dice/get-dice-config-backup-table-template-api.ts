// @ts-nocheck
/**
 * get-dice-config-backup-table-template-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupTableTemplateApi(deps: any) {
  const getDiceConfigBackupTableTemplateApi = (): DiceConfigBackupTableTemplateApi | null => {
    const api = deps.getCore().getDB() as DiceConfigBackupTableTemplateApi | null | undefined;
    return api || null;
  };
  return getDiceConfigBackupTableTemplateApi;
}
