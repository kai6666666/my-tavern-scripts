// @ts-nocheck
/**
 * apply-dice-config-backup-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createApplyDiceConfigBackupValue(deps: any) {
  const applyDiceConfigBackupValue = (
    key: string,
    value: unknown,
    moduleName: string,
    stats: DiceConfigBackupApplyStats,
    idMappings: Map<string, Map<string, string>>,
  ): void => {
    const strategy = deps.getDiceConfigBackupKeyStrategy(key);
    const currentExists = localStorage.getItem(key) !== null;
    const current = strategy === 'rawString' ? localStorage.getItem(key) : Store.get(key, undefined);

    if (strategy === 'gachaPoolSettings' || strategy === 'gachaItemSettings') {
      const merged =
        strategy === 'gachaPoolSettings'
          ? deps.mergeDiceConfigBackupGachaPoolSettings(current, value)
          : deps.mergeDiceConfigBackupGachaItemSettings(current, value);
      if (!merged) {
        stats.skipped += 1;
        stats.warnings.push(`${moduleName}: ${key} 不是有效的商城配置，已跳过。`);
        return;
      }
      if (deps.isDiceConfigBackupSameValue(current, merged)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        deps.setDiceConfigBackupValue(key, merged);
      }
      return;
    }

    if (strategy === 'object' || strategy === 'map') {
      if (!deps.isDiceConfigBackupRecord(value)) {
        stats.skipped += 1;
        stats.warnings.push(`${moduleName}: ${key} 不是对象配置，已跳过。`);
        return;
      }
      const currentRecord = deps.isDiceConfigBackupRecord(current) ? current : {};
      const merged = { ...currentRecord, ...value };
      if (deps.isDiceConfigBackupSameValue(current, merged)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        deps.setDiceConfigBackupValue(key, merged);
      }
      return;
    }

    if (strategy === 'setArray') {
      const merged = deps.mergeDiceConfigBackupSetArray(current, value);
      if (!merged) {
        stats.skipped += 1;
        stats.warnings.push(`${moduleName}: ${key} 不是数组配置，已跳过。`);
        return;
      }
      if (deps.isDiceConfigBackupSameValue(current, merged)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        deps.setDiceConfigBackupValue(key, merged);
      }
      return;
    }

    if (key === deps.STORAGE_KEY_VALIDATION_RULES) {
      const currentRules = deps.getDiceConfigBackupRuleRecords(current, deps.sanitizeDiceConfigBackupValidationRule);
      const incomingRules = deps.getDiceConfigBackupRuleRecords(value, deps.sanitizeDiceConfigBackupValidationRule);
      const builtinKeys = new Set(
        deps.BUILTIN_VALIDATION_RULES.map(rule =>
          deps.getDiceConfigBackupValidationRuleKey(rule as Record<string, unknown>),
        ).filter(Boolean),
      );
      const mergedRules = deps.mergeDiceConfigBackupCustomRules(
        currentRules,
        incomingRules,
        builtinKeys,
        deps.getDiceConfigBackupValidationRuleKey,
      );
      if (deps.isDiceConfigBackupSameValue(current, mergedRules)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        deps.setDiceConfigBackupValue(key, mergedRules);
      }
      return;
    }

    if (key === deps.STORAGE_KEY_REGEX_RULES) {
      const mergedRules = deps.mergeDiceConfigBackupRegexRules(current, value);
      if (deps.isDiceConfigBackupSameValue(current, mergedRules)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        deps.setDiceConfigBackupValue(key, mergedRules);
      }
      return;
    }

    if (strategy === 'presetArray') {
      const merged =
        key === deps.STORAGE_KEY_PRESETS || key === deps.STORAGE_KEY_REGEX_PRESETS
          ? deps.mergeDiceConfigBackupPresetArraySafely(current, value, moduleName, key)
          : key === deps.STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS
            ? deps.mergeDiceConfigBackupCustomOnlyPresetArray(current, value, moduleName, key)
          : deps.mergeDiceConfigBackupPresetArray(current, deps.sanitizeDiceConfigBackupStoredValue(key, value), moduleName, key);
      idMappings.set(key, merged.idMap);
      stats.added += merged.added;
      stats.overwritten += merged.overwritten;
      stats.skipped += merged.skipped;
      stats.warnings.push(...merged.warnings);
      if (!deps.isDiceConfigBackupSameValue(current, merged.value)) deps.setDiceConfigBackupValue(key, merged.value);
      return;
    }

    if (deps.isDiceConfigBackupSameValue(current, value)) {
      stats.skipped += 1;
    } else {
      if (currentExists) {
        stats.overwritten += 1;
      } else {
        stats.added += 1;
      }
      deps.setDiceConfigBackupValue(key, deps.cloneDiceConfigBackupValue(value));
    }
  };
  return applyDiceConfigBackupValue;
}
