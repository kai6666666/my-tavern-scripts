// @ts-nocheck
/**
 * sanitize-dice-config-backup-custom-only-preset-array-for-export.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS } from '../../shared/storage-keys';
import { normalizeTableTemplateRequirementPreset } from '../../features/table/table-template-requirements';
export function createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport(deps: any) {
  const sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport = (value: unknown, key: string): unknown => {
    if (!Array.isArray(value)) return value;
    const builtinPresetIds = new Set(deps.getDiceConfigBackupBuiltinPresetIds(key));
    const presetsById = new Map<string, Record<string, unknown>>();
    value.forEach(item => {
      if (!deps.isDiceConfigBackupRecord(item)) return;
      const sourceId = deps.getDiceConfigBackupPresetRecordId(item);
      if (!sourceId || builtinPresetIds.has(sourceId) || item.builtin === true) return;
      const normalized =
        key === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS
          ? normalizeTableTemplateRequirementPreset(item, sourceId)
          : deps.cloneDiceConfigBackupValue(item);
      if (!normalized || !deps.isDiceConfigBackupRecord(normalized)) return;
      const id = deps.getDiceConfigBackupPresetRecordId(normalized) || sourceId;
      if (!id || builtinPresetIds.has(id) || normalized.builtin === true) return;
      presetsById.set(id, { ...deps.cloneDiceConfigBackupValue(normalized), id, builtin: false });
    });
    const sanitized = Array.from(presetsById.values());
    return sanitized.length > 0 ? sanitized : undefined;
  };
  return sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport;
}
