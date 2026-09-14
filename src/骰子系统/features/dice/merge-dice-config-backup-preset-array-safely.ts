// @ts-nocheck
/**
 * merge-dice-config-backup-preset-array-safely.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
export function createMergeDiceConfigBackupPresetArraySafely(deps: any) {
  const mergeDiceConfigBackupPresetArraySafely = (
    current: unknown,
    incoming: unknown,
    moduleName: string,
    key: string,
  ): DiceConfigBackupPresetMergeResult => {
    const result: DiceConfigBackupPresetMergeResult = {
      value: deps.getDiceConfigBackupSafeCurrentPresets(key, current),
      idMap: new Map<string, string>(),
      added: 0,
      overwritten: 0,
      skipped: 0,
      warnings: [],
    };
    if (!Array.isArray(incoming)) {
      result.skipped += 1;
      result.warnings.push(`${moduleName}: ${key} 不是预设数组，已跳过。`);
      return result;
    }

    const mergeRules =
      key === deps.STORAGE_KEY_PRESETS ? deps.mergeDiceConfigBackupValidationRules : deps.mergeDiceConfigBackupRegexRules;
    const builtinPresetIds = new Set(deps.getDiceConfigBackupBuiltinPresetIds(key));
    const indexById = new Map<string, number>();
    const customIndexByName = new Map<string, number>();
    result.value.forEach((item, index) => {
      if (!deps.isDiceConfigBackupRecord(item)) return;
      const id = deps.getDiceConfigBackupPresetRecordId(item);
      const name = deps.getDiceConfigBackupPresetRecordName(item);
      if (id) indexById.set(id, index);
      if (name && !builtinPresetIds.has(id) && item.builtin !== true && !customIndexByName.has(name)) {
        customIndexByName.set(name, index);
      }
    });

    incoming.forEach(item => {
      if (!deps.isDiceConfigBackupRecord(item)) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: ${key} 中存在非对象预设，已跳过。`);
        return;
      }
      const imported = deps.cloneDiceConfigBackupValue(item);
      const sourceId = deps.getDiceConfigBackupPresetRecordId(imported);
      const sourceName = deps.getDiceConfigBackupPresetRecordName(imported);
      if (!sourceId) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 存在缺少 id 的预设 "${sourceName || '未命名'}"，已跳过。`);
        return;
      }

      const sourceIsBuiltin = builtinPresetIds.has(sourceId) || imported.builtin === true;
      const targetIndex = indexById.get(sourceId) ?? (sourceIsBuiltin ? undefined : customIndexByName.get(sourceName));
      if (targetIndex !== undefined) {
        const currentRecord = deps.isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        const targetId = deps.getDiceConfigBackupPresetRecordId(currentRecord) || sourceId;
        const targetIsBuiltin = builtinPresetIds.has(targetId) || currentRecord.builtin === true;
        const mergedRules = mergeRules(currentRecord.rules, imported.rules);
        result.value[targetIndex] = targetIsBuiltin
          ? {
              ...currentRecord,
              id: targetId,
              builtin: true,
              version: PRESET_FORMAT_VERSION,
              rules: mergedRules,
            }
          : {
              ...currentRecord,
              ...imported,
              id: targetId,
              builtin: false,
              version: PRESET_FORMAT_VERSION,
              rules: mergedRules,
            };
        result.idMap.set(sourceId, targetId);
        result.overwritten += 1;
        return;
      }

      if (sourceIsBuiltin) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 内置预设 "${sourceName || sourceId}" 在当前版本中不存在，已跳过。`);
        return;
      }

      const nextPreset = {
        ...imported,
        builtin: false,
        version: PRESET_FORMAT_VERSION,
        rules: mergeRules([], imported.rules),
      };
      result.value.push(nextPreset);
      const nextIndex = result.value.length - 1;
      indexById.set(sourceId, nextIndex);
      if (sourceName) customIndexByName.set(sourceName, nextIndex);
      result.idMap.set(sourceId, sourceId);
      result.added += 1;
    });

    return result;
  };
  return mergeDiceConfigBackupPresetArraySafely;
}
