// @ts-nocheck
/**
 * normalize-imported-gacha-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_RARITY_ORDER, GACHA_REWARD_TARGETS, GACHA_UNIQUE_RARITY } from '../../entities/gacha-items';
export function createNormalizeImportedGachaItem(deps: any) {
  const normalizeImportedGachaItem = (
    rawItem: unknown,
    index: number,
    errors: string[],
    tagAliases: Record<string, GachaPoolTag> = {},
  ): NormalizedGachaCatalogItem | null => {
    if (!rawItem || typeof rawItem !== 'object') {
      errors.push(`第 ${index + 1} 项不是有效对象`);
      return null;
    }
    const record = rawItem as Record<string, unknown>;
    const name = String(record.name || '').trim();
    if (!name) {
      errors.push(`第 ${index + 1} 项缺少 name，已跳过`);
      return null;
    }
    const quality = String(record.quality || '').trim() as GachaRarity;
    if (!GACHA_RARITY_ORDER.includes(quality)) {
      errors.push(`「${name}」的 quality 无效，已跳过`);
      return null;
    }
    const legacyPoolTags = Array.isArray(record.tags) ? record.tags : undefined;
    const poolTags = deps.normalizeImportedGachaPoolTags(
      record.poolTags ?? record.poolTag ?? record.pools ?? legacyPoolTags ?? record.pool,
      tagAliases,
    );
    if (poolTags.length === 0) {
      errors.push(`「${name}」没有有效 poolTags，已跳过`);
      return null;
    }
    const weight = Number(record.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      errors.push(`「${name}」的 weight 必须为正数，已跳过`);
      return null;
    }
    const grantQuantity = Math.floor(Number(record.grantQuantity));
    if (!Number.isFinite(grantQuantity) || grantQuantity <= 0) {
      errors.push(`「${name}」的 grantQuantity 必须为正整数，已跳过`);
      return null;
    }
    const rewardTarget = GACHA_REWARD_TARGETS.includes(record.rewardTarget as GachaRewardTarget)
      ? (record.rewardTarget as GachaRewardTarget)
      : 'inventory';
    const description = String(record.description || '').trim();
    const rawCustomFields =
      record.customFields && typeof record.customFields === 'object' && !Array.isArray(record.customFields)
        ? (record.customFields as Record<string, unknown>)
        : {};
    const readLegacyStandardField = (aliases: readonly string[]): string => {
      for (const [key, value] of Object.entries(rawCustomFields)) {
        if (deps.isGachaFieldAlias(key, aliases) && (typeof value === 'string' || typeof value === 'number')) {
          const text = String(value).trim();
          if (text) return text;
        }
      }
      return '';
    };
    const tags =
      (typeof record.tags === 'string' ? String(record.tags).trim() : '') ||
      readLegacyStandardField(deps.GACHA_TAG_FIELD_ALIASES);
    const effect =
      String(record.effect ?? record.effects ?? '').trim() || readLegacyStandardField(deps.GACHA_EFFECT_FIELD_ALIASES);
    const rawType = String(record.type || '').trim();
    const type =
      rewardTarget === 'equipment'
        ? deps.inferEquipmentTableTypeForGachaItem({ id: String(record.id || '').trim(), name, type: rawType, description })
        : rawType || '道具';
    const generatedId = !String(record.id || '').trim();
    const order = Number(record.order);
    const customFields = deps.normalizeGachaCustomFields(
      Object.fromEntries(
        Object.entries(rawCustomFields).filter(
          ([key]) =>
            !deps.isGachaFieldAlias(key, deps.GACHA_TAG_FIELD_ALIASES) &&
            !deps.isGachaFieldAlias(key, deps.GACHA_EFFECT_FIELD_ALIASES),
        ),
      ),
    );
    const targetTable = deps.normalizeGachaTargetTable(record.targetTable);
    const targetColumns = deps.normalizeGachaTargetColumns(record.targetColumns);
    const item: NormalizedGachaCatalogItem = {
      id: generatedId ? deps.buildStableGachaCustomItemId({ name, quality, type }) : String(record.id || '').trim(),
      name,
      type,
      quality,
      ...(tags ? { tags } : {}),
      ...(effect ? { effect } : {}),
      description,
      poolTags,
      icon: String(record.icon || '').trim() || undefined,
      enabled: deps.normalizeGachaItemEnabled(record.enabled),
      order: Number.isFinite(order) ? deps.normalizeGachaItemOrder(order) : undefined,
      createdAt: deps.normalizeGachaTimestamp(record.createdAt || record.created_at),
      updatedAt: deps.normalizeGachaTimestamp(record.updatedAt || record.updated_at),
      weight,
      stackable: record.stackable === true,
      unique: record.unique === true || quality === GACHA_UNIQUE_RARITY,
      grantQuantity,
      rewardTarget,
      generatedId,
    };
    if (targetTable) item.targetTable = targetTable;
    if (targetColumns) item.targetColumns = targetColumns;
    if (customFields) item.customFields = customFields;
    return item;
  };
  return normalizeImportedGachaItem;
}
