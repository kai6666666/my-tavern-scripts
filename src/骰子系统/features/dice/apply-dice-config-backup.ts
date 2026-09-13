// @ts-nocheck
/**
 * apply-dice-config-backup.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyDiceConfigBackup(deps: any) {
  const applyDiceConfigBackup = async (
    backup: DiceConfigBackupDocument,
    selectedModuleIds: readonly DiceConfigBackupModuleId[],
  ): Promise<DiceConfigBackupApplyStats> => {
    if (backup.format !== deps.DICE_CONFIG_BACKUP_FORMAT || backup.schemaVersion !== deps.DICE_CONFIG_BACKUP_SCHEMA_VERSION) {
      throw new Error('备份文件版本不兼容');
    }
    const selectedIds = deps.normalizeDiceConfigBackupSelectedModuleIds(selectedModuleIds);
    if (selectedIds.length === 0) throw new Error('请至少选择一个要恢复的模块');

    const stats: DiceConfigBackupApplyStats = {
      added: 0,
      overwritten: 0,
      skipped: 0,
      restoredModules: [],
      warnings: [],
    };
    const idMappings = new Map<string, Map<string, string>>();
    const pendingActiveWrites: DiceConfigBackupPendingActiveWrite[] = [];
    const affectedKeys = new Set<string>();
    const hasGachaCatalogResource =
      selectedIds.includes('gachaSettings') &&
      Array.isArray(backup.modules.gachaSettings?.resources?.[deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY]);
    const incomingGachaItemSettings = deps.normalizeDiceConfigBackupGachaItemSettings(
      selectedIds.includes('gachaSettings')
        ? backup.modules.gachaSettings?.storage?.[deps.STORAGE_KEY_GACHA_ITEM_SETTINGS]
        : undefined,
    );
    const gachaItemSettingSourceIds = new Set(Object.keys(incomingGachaItemSettings?.items || {}));

    selectedIds.forEach(moduleId => {
      const definition = deps.getDiceConfigBackupModuleDefinition(moduleId);
      const payload = backup.modules[moduleId];
      if (!definition || !payload) return;
      Object.keys(payload.storage).forEach(key => {
        if (definition.storageKeys.includes(key)) affectedKeys.add(key);
      });
    });
    if (selectedIds.includes('regex')) affectedKeys.add(deps.STORAGE_KEY_REGEX_RULES);
    if (hasGachaCatalogResource) affectedKeys.add(deps.STORAGE_KEY_GACHA_POOL_SETTINGS);

    const rollbackValues = new Map<string, string | null>();
    affectedKeys.forEach(key => rollbackValues.set(key, localStorage.getItem(key)));
    const gachaCatalogRollbackSnapshot =
      hasGachaCatalogResource
        ? await deps.collectDiceConfigBackupGachaCatalogRollbackSnapshot()
        : null;
    if (gachaCatalogRollbackSnapshot?.warning) throw new Error(gachaCatalogRollbackSnapshot.warning);
    const tableTemplateRollbackSnapshot =
      selectedIds.includes('tableTemplate') && deps.hasDiceConfigBackupTableTemplateResource(backup.modules.tableTemplate)
        ? deps.getDiceConfigBackupTableTemplateRollbackSnapshot()
        : undefined;
    if (tableTemplateRollbackSnapshot?.warning) throw new Error(tableTemplateRollbackSnapshot.warning);
    const deferredTableTemplatePayload =
      selectedIds.includes('tableTemplate') && backup.modules.tableTemplate
        ? backup.modules.tableTemplate
        : null;
    const deferredGachaPayload =
      selectedIds.includes('gachaSettings') && backup.modules.gachaSettings ? backup.modules.gachaSettings : null;
    const gachaItemIdMap = new Map<string, string>();
    let tableTemplateResourceImportAttempted = false;
    let latestRestoreRawData: unknown = deps.getRuntimeGachaRawData();
    const getTouchedCount = () => stats.added + stats.overwritten + stats.skipped;
    const pushRestoredModule = (moduleId: DiceConfigBackupModuleId, touchedBefore: number) => {
      const definition = deps.getDiceConfigBackupModuleDefinition(moduleId);
      if (!definition || getTouchedCount() <= touchedBefore) return;
      if (!stats.restoredModules.includes(definition.name)) stats.restoredModules.push(definition.name);
    };

    try {
      for (const moduleId of selectedIds) {
        const definition = deps.getDiceConfigBackupModuleDefinition(moduleId);
        const payload = backup.modules[moduleId];
        if (!definition || !payload) continue;
        const moduleTouchedBefore = getTouchedCount();
        if (payload.warnings?.length) stats.warnings.push(...payload.warnings);

        Object.entries(payload.storage).forEach(([key, value]) => {
          if (!definition.storageKeys.includes(key)) {
            stats.skipped += 1;
            stats.warnings.push(`${definition.name}: 未知存储项 ${key} 已跳过。`);
            return;
          }
          if (deps.DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY[key]) {
            pendingActiveWrites.push({ key, value, moduleName: definition.name });
            return;
          }
          deps.applyDiceConfigBackupValue(key, value, definition.name, stats, idMappings);
        });
        pushRestoredModule(moduleId, moduleTouchedBefore);
      }

      pendingActiveWrites.forEach(write => deps.applyDiceConfigBackupActiveValue(write, stats, idMappings));
      if (deferredTableTemplatePayload) {
        const moduleTouchedBefore = getTouchedCount();
        const resourceAddedBefore = stats.added;
        await deps.restoreDiceConfigBackupModuleResources('tableTemplate', deferredTableTemplatePayload, stats, {
          onTableTemplateImportAttempt: () => {
            tableTemplateResourceImportAttempted = true;
          },
        });
        const tableTemplateResourceImported = stats.added > resourceAddedBefore;
        pushRestoredModule('tableTemplate', moduleTouchedBefore);
        if (tableTemplateResourceImported) {
          deps.setCachedRawData(null);
          deps.syncDiceConfigBackupRuntimeAfterRestore(selectedIds, { closeSettings: true });
          latestRestoreRawData = deps.getTableData({ silent: true }) || deps.getRuntimeGachaRawData();
        }
      }
      if (deferredGachaPayload) {
        const moduleTouchedBefore = getTouchedCount();
        await deps.restoreDiceConfigBackupModuleResources('gachaSettings', deferredGachaPayload, stats, {
          gachaItemIdMap,
          rawData: latestRestoreRawData,
        });
        deps.remapDiceConfigBackupGachaItemSettings(gachaItemIdMap, gachaItemSettingSourceIds);
        pushRestoredModule('gachaSettings', moduleTouchedBefore);
      }
      deps.syncDiceConfigBackupRuntimeAfterRestore(selectedIds, { closeSettings: true });
      return stats;
    } catch (error) {
      const rollbackWarnings: string[] = [];
      rollbackValues.forEach((value, key) => {
        try {
          if (value === null) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, value);
          }
        } catch (rollbackError) {
          const message = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);
          rollbackWarnings.push(`${key} 回滚失败：${message}`);
        }
      });
      rollbackWarnings.push(
        ...(await deps.restoreDiceConfigBackupGachaCatalogSnapshot(gachaCatalogRollbackSnapshot)),
        ...(tableTemplateResourceImportAttempted
          ? await deps.restoreDiceConfigBackupTableTemplateRollbackSnapshot(tableTemplateRollbackSnapshot)
          : []),
      );
      try {
        deps.syncDiceConfigBackupRuntimeAfterRestore(selectedIds);
      } catch (syncError) {
        const message = syncError instanceof Error ? syncError.message : String(syncError);
        rollbackWarnings.push(`恢复失败后的界面刷新也失败：${message}`);
      }
      if (rollbackWarnings.length > 0) {
        stats.warnings.push(...rollbackWarnings);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message}；回滚提示：${rollbackWarnings.join('；')}`);
      }
      throw error;
    }
  };
  return applyDiceConfigBackup;
}
