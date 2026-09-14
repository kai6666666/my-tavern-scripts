// @ts-nocheck
/**
 * normalize-dice-config-backup-gacha-catalog-resource-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
import type { GachaCatalogRecord } from '../../features/gacha/gacha-types';
export function createNormalizeDiceConfigBackupGachaCatalogResourceRecord(deps: any) {
  const normalizeDiceConfigBackupGachaCatalogResourceRecord = (
    rawRecord: unknown,
    warnings: string[],
    rawData?: unknown,
  ): GachaCatalogRecord | null => {
    if (!deps.isDiceConfigBackupRecord(rawRecord)) {
      warnings.push('骰子商城配置与自定义物品: 存在无效的自定义目录记录，已跳过。');
      return null;
    }
    const scopeKey = String(rawRecord.scopeKey || '').trim();
    if (!scopeKey) {
      warnings.push('骰子商城配置与自定义物品: 存在缺少 scopeKey 的自定义目录记录，已跳过。');
      return null;
    }
    if (!Array.isArray(rawRecord.items)) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 的自定义物品不是数组，已跳过。`);
      return null;
    }
    const items = deps.normalizeDiceConfigBackupGachaCatalogItems(rawRecord.items, warnings, scopeKey, rawData);
    if (items.length === 0) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 没有有效自定义物品，已跳过。`);
      return null;
    }
    return {
      scopeKey,
      version: Number(rawRecord.version) || GACHA_CATALOG_VERSION,
      items,
      updatedAt: Math.max(0, Number(rawRecord.updatedAt) || 0),
    };
  };
  return normalizeDiceConfigBackupGachaCatalogResourceRecord;
}
