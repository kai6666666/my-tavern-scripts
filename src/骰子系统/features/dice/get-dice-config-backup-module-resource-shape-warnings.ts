// @ts-nocheck
/**
 * get-dice-config-backup-module-resource-shape-warnings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupModuleResourceShapeWarnings(deps: any) {
  const getDiceConfigBackupModuleResourceShapeWarnings = (
    moduleId: DiceConfigBackupModuleId,
    resources?: Record<string, unknown>,
  ): string[] => {
    if (!resources) return [];
    const warnings: string[] = [];
    const pushUnknownResourceWarnings = (knownKeys: ReadonlySet<string>) => {
      const unknownKeys = Object.keys(resources).filter(key => !knownKeys.has(key));
      if (unknownKeys.length > 0) {
        warnings.push(`模块包含当前版本无法恢复的扩展资源：${unknownKeys.join('、')}。`);
      }
    };
    if (moduleId === 'tableTemplate') {
      if (
        deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY in resources &&
        !deps.isDiceConfigBackupRecord(resources[deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY])
      ) {
        warnings.push('当前数据库表格模板: 模板资源结构无效，无法恢复该模板。');
      }
      pushUnknownResourceWarnings(new Set([deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY]));
      return warnings;
    }
    if (moduleId === 'gachaSettings') {
      if (deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY in resources) {
        const value = resources[deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY];
        if (!Array.isArray(value)) {
          warnings.push('骰子商城配置与自定义物品: 自定义目录资源不是数组，无法恢复该目录。');
        } else {
          const resourceWarnings: string[] = [];
          const runtimeRawData = deps.getRuntimeGachaRawData();
          const validCount = value.filter(record =>
            deps.normalizeDiceConfigBackupGachaCatalogResourceRecord(record, resourceWarnings, runtimeRawData),
          ).length;
          if (resourceWarnings.length > 0) {
            const maybeDeferredByTemplateRestore = Boolean(deps.isDiceConfigBackupRecord(resources) && runtimeRawData);
            warnings.push(
              ...Array.from(new Set(resourceWarnings)).map(warning =>
                maybeDeferredByTemplateRestore
                  ? `${warning} 若本次同时恢复“当前数据库表格模板”，最终会在模板导入后重新校验。`
                  : warning,
              ),
            );
          }
          if (value.length > 0 && validCount === 0) {
            warnings.push(
              '骰子商城配置与自定义物品: 自定义目录资源在当前模板下没有有效物品；若本次同时恢复“当前数据库表格模板”，最终会在模板导入后重新校验。',
            );
          }
        }
      }
      pushUnknownResourceWarnings(new Set([deps.DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY]));
      return warnings;
    }
    pushUnknownResourceWarnings(new Set());
    return warnings;
  };
  return getDiceConfigBackupModuleResourceShapeWarnings;
}
