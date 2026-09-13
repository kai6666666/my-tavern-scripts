// @ts-nocheck
/**
 * restore-dice-config-backup-module-resources.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreDiceConfigBackupModuleResources(deps: any) {
  const restoreDiceConfigBackupModuleResources = async (
    moduleId: DiceConfigBackupModuleId,
    payload: DiceConfigBackupModulePayload,
    stats: DiceConfigBackupApplyStats,
    options: {
      gachaItemIdMap?: Map<string, string>;
      onTableTemplateImportAttempt?: () => void;
      rawData?: unknown;
    } = {},
  ): Promise<void> => {
    if (moduleId === 'tableTemplate') {
      await deps.restoreDiceConfigBackupTableTemplate(
        payload.resources?.[deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY],
        stats,
        options.onTableTemplateImportAttempt,
      );
      return;
    }
    if (moduleId !== 'gachaSettings') return;
    await deps.restoreDiceConfigBackupGachaCatalogRecords(
      payload.resources?.[deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY],
      stats,
      options.gachaItemIdMap,
      options.rawData,
    );
  };
  return restoreDiceConfigBackupModuleResources;
}
