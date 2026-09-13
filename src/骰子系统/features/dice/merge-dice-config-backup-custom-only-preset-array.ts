// @ts-nocheck
/**
 * merge-dice-config-backup-custom-only-preset-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { normalizeTableTemplateRequirementPreset } from '../../features/table/table-template-requirements';
export function createMergeDiceConfigBackupCustomOnlyPresetArray(deps: any) {
  const mergeDiceConfigBackupCustomOnlyPresetArray = (
    current: unknown,
    incoming: unknown,
    moduleName: string,
    key: string,
  ): DiceConfigBackupPresetMergeResult => {
    const result: DiceConfigBackupPresetMergeResult = {
      value: [],
      idMap: new Map<string, string>(),
      added: 0,
      overwritten: 0,
      skipped: 0,
      warnings: [],
    };
    const builtinPresetIds = new Set(deps.getDiceConfigBackupBuiltinPresetIds(key));
    const indexById = new Map<string, number>();
    const currentIndexByName = new Map<string, number>();
    const consumedCurrentNameIndexes = new Set<number>();
    const normalizeCustomPreset = (item: unknown, fallbackId: string): Record<string, unknown> | null => {
      let normalized: unknown = null;
      if (key === deps.STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS) {
        normalized = normalizeTableTemplateRequirementPreset(item, fallbackId);
      } else if (deps.isDiceConfigBackupRecord(item)) {
        normalized = deps.cloneDiceConfigBackupValue(item);
      }
      if (!normalized || !deps.isDiceConfigBackupRecord(normalized)) return null;
      const id = deps.getDiceConfigBackupPresetRecordId(normalized);
      if (!id || builtinPresetIds.has(id)) return null;
      return { ...deps.cloneDiceConfigBackupValue(normalized), id, builtin: false };
    };
    const keepCurrentPresets = (items: readonly unknown[]): void => {
      const currentById = new Map<string, Record<string, unknown>>();
      items.forEach(item => {
        const sourceId = deps.isDiceConfigBackupRecord(item) ? deps.getDiceConfigBackupPresetRecordId(item) : '';
        const preset = normalizeCustomPreset(item, sourceId);
        if (!preset) return;
        const id = deps.getDiceConfigBackupPresetRecordId(preset);
        currentById.set(id, preset);
      });
      currentById.forEach(preset => {
        const id = deps.getDiceConfigBackupPresetRecordId(preset);
        const targetIndex = result.value.length;
        result.value.push(preset);
        indexById.set(id, targetIndex);
        const name = deps.getDiceConfigBackupPresetRecordName(preset);
        if (name && !currentIndexByName.has(name)) currentIndexByName.set(name, targetIndex);
      });
    };
    if (Array.isArray(current)) keepCurrentPresets(current);
    const addIncomingPreset = (preset: Record<string, unknown>, sourceId: string): void => {
      const nextPreset = { ...preset, id: sourceId, builtin: false };
      result.value.push(nextPreset);
      indexById.set(sourceId, result.value.length - 1);
      result.idMap.set(sourceId, sourceId);
      result.added += 1;
    };

    if (!Array.isArray(incoming)) {
      result.skipped += 1;
      result.warnings.push(`${moduleName}: ${key} 不是预设数组，已跳过。`);
      return result;
    }

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
      const normalized = normalizeCustomPreset(imported, sourceId);
      if (!normalized) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 预设 "${sourceName || sourceId}" 结构无效，已跳过。`);
        return;
      }

      if (indexById.has(sourceId)) {
        const targetIndex = indexById.get(sourceId)!;
        const currentRecord = deps.isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        result.value[targetIndex] = { ...currentRecord, ...normalized, id: sourceId, builtin: false };
        result.idMap.set(sourceId, sourceId);
        result.overwritten += 1;
        consumedCurrentNameIndexes.add(targetIndex);
        return;
      }

      if (sourceName && currentIndexByName.has(sourceName)) {
        const targetIndex = currentIndexByName.get(sourceName)!;
        if (consumedCurrentNameIndexes.has(targetIndex)) {
          addIncomingPreset(normalized, sourceId);
          return;
        }
        const currentRecord = deps.isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        const targetId = deps.getDiceConfigBackupPresetRecordId(currentRecord) || sourceId;
        result.value[targetIndex] = { ...currentRecord, ...normalized, id: targetId, builtin: false };
        result.idMap.set(sourceId, targetId);
        result.overwritten += 1;
        consumedCurrentNameIndexes.add(targetIndex);
        indexById.set(targetId, targetIndex);
        return;
      }

      addIncomingPreset(normalized, sourceId);
    });

    return result;
  };
  return mergeDiceConfigBackupCustomOnlyPresetArray;
}
