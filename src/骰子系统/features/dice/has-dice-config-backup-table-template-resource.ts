// @ts-nocheck
/**
 * has-dice-config-backup-table-template-resource.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasDiceConfigBackupTableTemplateResource(deps: any) {
  const hasDiceConfigBackupTableTemplateResource = (payload?: DiceConfigBackupModulePayload): boolean =>
    deps.isDiceConfigBackupRecord(payload?.resources?.[deps.getDICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY()]);
  return hasDiceConfigBackupTableTemplateResource;
}
