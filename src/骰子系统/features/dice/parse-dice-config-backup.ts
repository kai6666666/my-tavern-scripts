// @ts-nocheck
/**
 * parse-dice-config-backup.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseDiceConfigBackup(deps: any) {
  const parseDiceConfigBackup = (text: string): DiceConfigBackupParseResult => {
    const parsed = deps.parseJsoncDocument({
      text,
      emptyMessage: '备份文件内容为空',
      invalidJsonMessage: '备份文件不是有效的 JSON/JSONC',
      validate: value => {
        if (!deps.isDiceConfigBackupRecord(value)) throw new Error('备份文件结构无效');
        return value;
      },
    });
    if (parsed.format !== deps.DICE_CONFIG_BACKUP_FORMAT) throw new Error('备份格式不匹配，无法作为骰子系统配置备份导入');
    if (parsed.schemaVersion !== deps.DICE_CONFIG_BACKUP_SCHEMA_VERSION) {
      throw new Error(`仅支持 schemaVersion ${deps.DICE_CONFIG_BACKUP_SCHEMA_VERSION} 的备份文件`);
    }
    if (!deps.isDiceConfigBackupRecord(parsed.modules)) throw new Error('备份文件缺少 modules 配置');

    const warnings: string[] = [];
    const modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>> = {};

    Object.entries(parsed.modules).forEach(([rawModuleId, rawPayload]) => {
      if (!deps.isDiceConfigBackupModuleId(rawModuleId)) {
        warnings.push(`备份文件包含未知模块 "${rawModuleId}"，已跳过。`);
        return;
      }
      if (!deps.isDiceConfigBackupRecord(rawPayload)) {
        warnings.push(`模块 "${rawModuleId}" 的结构无效，已跳过。`);
        return;
      }
      const storageValue = rawPayload.storage;
      const moduleStorage = deps.isDiceConfigBackupRecord(storageValue)
        ? deps.cloneDiceConfigBackupValue(storageValue)
        : {};
      if (storageValue !== undefined && !deps.isDiceConfigBackupRecord(storageValue)) {
        warnings.push(`模块 "${rawModuleId}" 的 storage 结构无效，已按空对象处理。`);
      }
      const warningsValue = rawPayload.warnings;
      const moduleWarnings = Array.isArray(warningsValue)
        ? warningsValue.map(item => String(item || '').trim()).filter(Boolean)
        : [];
      const resourcesValue = rawPayload.resources;
      const moduleResources = deps.isDiceConfigBackupRecord(resourcesValue)
        ? deps.cloneDiceConfigBackupValue(resourcesValue)
        : undefined;
      if (resourcesValue !== undefined && !moduleResources) {
        warnings.push(`模块 "${rawModuleId}" 的扩展资源结构无效，已忽略。`);
      }
      const resourceShapeWarnings = deps.getDiceConfigBackupModuleResourceShapeWarnings(rawModuleId, moduleResources);
      modules[rawModuleId] = {
        storage: moduleStorage,
        ...(moduleResources ? { resources: moduleResources } : {}),
        ...(moduleWarnings.length > 0 || resourceShapeWarnings.length > 0
          ? { warnings: [...moduleWarnings, ...resourceShapeWarnings] }
          : {}),
      };
    });

    return {
      backup: {
        format: deps.DICE_CONFIG_BACKUP_FORMAT,
        schemaVersion: deps.DICE_CONFIG_BACKUP_SCHEMA_VERSION,
        exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
        scriptVersion: typeof parsed.scriptVersion === 'string' ? parsed.scriptVersion : '',
        presetFormatVersion: typeof parsed.presetFormatVersion === 'string' ? parsed.presetFormatVersion : '',
        modules,
      },
      warnings,
    };
  };
  return parseDiceConfigBackup;
}
