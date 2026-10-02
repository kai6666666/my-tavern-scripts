/**
 * restore-dice-config-backup-module-resources.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type DiceConfigBackupApplyStats = Record<string, any>;

type DiceConfigBackupModuleId =
  | 'uiLayout'
  | 'diceConfig'
  | 'advancedPresets'
  | 'attributePresets'
  | 'actionGm'
  | 'dashboardPresets'
  | 'renderPresets'
  | 'tableTemplate'
  | 'tableTemplateRequirementPresets'
  | 'validation'
  | 'regex'
  | 'avatarMap'
  | 'customIcons'
  | 'gachaSettings';

interface DiceConfigBackupModulePayload {
  storage: Record<string, unknown>;
  resources?: Record<string, unknown>;
  warnings?: string[];
}

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
