// @ts-nocheck
/**
 * merge-dice-config-backup-preset-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMergeDiceConfigBackupPresetArray(deps: any) {
  const mergeDiceConfigBackupPresetArray = (
    current: unknown,
    incoming: unknown,
    moduleName: string,
    key: string,
  ): DiceConfigBackupPresetMergeResult => {
    const builtinPresetIds = new Set(deps.getDiceConfigBackupBuiltinPresetIds(key));
    const result: DiceConfigBackupPresetMergeResult = {
      value: Array.isArray(current)
        ? deps.cloneDiceConfigBackupValue(current).filter(item => {
            if (!deps.isDiceConfigBackupRecord(item)) return true;
            const id = deps.getDiceConfigBackupPresetRecordId(item);
            return !id || !builtinPresetIds.has(id);
          })
        : [],
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

    const indexById = new Map<string, number>();
    const indexByName = new Map<string, number>();
    result.value.forEach((item, index) => {
      if (!deps.isDiceConfigBackupRecord(item)) return;
      const id = deps.getDiceConfigBackupPresetRecordId(item);
      const name = deps.getDiceConfigBackupPresetRecordName(item);
      if (id) indexById.set(id, index);
      if (name && !indexByName.has(name)) indexByName.set(name, index);
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
      if (builtinPresetIds.has(sourceId) || imported.builtin === true) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 内置预设 "${sourceName || sourceId}" 以当前脚本版本为准，已跳过备份中的同名记录。`);
        return;
      }

      if (indexById.has(sourceId)) {
        const targetIndex = indexById.get(sourceId)!;
        const currentRecord = deps.isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        result.value[targetIndex] = { ...currentRecord, ...imported, id: sourceId };
        result.idMap.set(sourceId, sourceId);
        result.overwritten += 1;
        if (sourceName) indexByName.set(sourceName, targetIndex);
        return;
      }

      if (sourceName && indexByName.has(sourceName)) {
        const targetIndex = indexByName.get(sourceName)!;
        const currentRecord = deps.isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        const targetId = deps.getDiceConfigBackupPresetRecordId(currentRecord) || sourceId;
        result.value[targetIndex] = { ...currentRecord, ...imported, id: targetId };
        result.idMap.set(sourceId, targetId);
        result.overwritten += 1;
        indexById.set(targetId, targetIndex);
        return;
      }

      result.value.push(imported);
      const targetIndex = result.value.length - 1;
      indexById.set(sourceId, targetIndex);
      if (sourceName) indexByName.set(sourceName, targetIndex);
      result.idMap.set(sourceId, sourceId);
      result.added += 1;
    });

    return result;
  };
  return mergeDiceConfigBackupPresetArray;
}
