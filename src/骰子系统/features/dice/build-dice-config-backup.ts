// @ts-nocheck
/**
 * build-dice-config-backup.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION, SCRIPT_VERSION } from '../../shared/constants';
export function createBuildDiceConfigBackup(deps: any) {
  const buildDiceConfigBackup = async (
    selectedModuleIds: readonly DiceConfigBackupModuleId[],
  ): Promise<DiceConfigBackupDocument> => {
    const selectedIds = deps.normalizeDiceConfigBackupSelectedModuleIds(selectedModuleIds);
    if (selectedIds.length === 0) {
      throw new Error('请至少选择一个要备份的模块');
    }

    const modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>> = {};
    for (const moduleId of selectedIds) {
      const definition = deps.getDiceConfigBackupModuleDefinition(moduleId);
      if (!definition) continue;
      const storage: Record<string, unknown> = {};
      definition.storageKeys.forEach(key => {
        const value = deps.sanitizeDiceConfigBackupStoredValue(key, deps.getDiceConfigBackupStoredValue(key));
        if (value !== undefined) storage[key] = deps.cloneDiceConfigBackupValue(value);
      });
      const resources: Record<string, unknown> = {};
      if (moduleId === 'gachaSettings') {
        const records = await deps.collectDiceConfigBackupGachaCatalogRecords();
        if (records.length > 0) {
          resources[deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY] = records;
        }
      }
      const extraWarnings: string[] = [];
      if (moduleId === 'tableTemplate') {
        const templateResult = deps.collectDiceConfigBackupTableTemplate();
        if (templateResult.template !== undefined) {
          resources[deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY] = templateResult.template;
        }
        extraWarnings.push(...templateResult.warnings);
      }
      const warnings = [...deps.getDiceConfigBackupModuleWarnings(moduleId, storage, resources), ...extraWarnings];
      if (Object.keys(storage).length === 0 && Object.keys(resources).length === 0 && warnings.length === 0) continue;
      modules[moduleId] = {
        storage,
        ...(Object.keys(resources).length > 0 ? { resources: deps.cloneDiceConfigBackupValue(resources) } : {}),
        ...(warnings.length > 0 ? { warnings } : {}),
      };
    }

    return {
      format: deps.DICE_CONFIG_BACKUP_FORMAT,
      schemaVersion: deps.DICE_CONFIG_BACKUP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      scriptVersion: SCRIPT_VERSION,
      presetFormatVersion: PRESET_FORMAT_VERSION,
      modules,
    };
  };
  return buildDiceConfigBackup;
}
