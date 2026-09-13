// @ts-nocheck
/**
 * normalize-imported-gacha-pools.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, GACHA_CUSTOM_ONLY_POOL_TAG, normalizeGachaPoolId, normalizeGachaPoolName } from '../../features/gacha/gacha-helpers';
export function createNormalizeImportedGachaPools(deps: any) {
  const normalizeImportedGachaPools = (rawPools: unknown): NormalizedImportedGachaPools => {
    const result: NormalizedImportedGachaPools = { pools: [], tagAliases: {} };
    if (!Array.isArray(rawPools)) return result;
    result.pools = rawPools
      .map((rawPool, index) => {
        if (typeof rawPool === 'string') {
          const id = normalizeGachaPoolId(rawPool);
          if (!id || id === GACHA_ALL_POOL_TAG) return null;
          return deps.buildDefaultGachaPoolDefinition(id, {
            name: id,
            builtin: deps.isBuiltinGachaPoolId(id),
            visibleInTabs: true,
            includeInAll: true,
            order: 100 + index * 10,
          });
        }
        if (!rawPool || typeof rawPool !== 'object') return null;
        const record = rawPool as Record<string, unknown>;
        const rawId = normalizeGachaPoolId(record.id || record.tag || record.name);
        const rawName = normalizeGachaPoolName(
          record.name || record.label || rawId,
          rawId || GACHA_CUSTOM_ONLY_POOL_TAG,
        );
        const shouldUseNameAsCustomId =
          rawId &&
          rawId !== GACHA_ALL_POOL_TAG &&
          rawName !== rawId &&
          (rawId === GACHA_CUSTOM_ONLY_POOL_TAG || (deps.isBuiltinGachaPoolId(rawId) && record.builtin !== true));
        const normalized = deps.normalizeGachaPoolDefinition({
          ...record,
          id: shouldUseNameAsCustomId ? rawName : rawId,
          name: rawName,
        });
        if (!normalized || normalized.id === GACHA_ALL_POOL_TAG) return null;
        if (shouldUseNameAsCustomId) {
          result.tagAliases[rawId] = normalized.id;
        }
        return {
          ...normalized,
          builtin: deps.isBuiltinGachaPoolId(normalized.id),
          order: Number.isFinite(Number(normalized.order)) ? Number(normalized.order) : 100 + index * 10,
        };
      })
      .filter((pool): pool is GachaPoolDefinition => Boolean(pool));
    return result;
  };
  return normalizeImportedGachaPools;
}
