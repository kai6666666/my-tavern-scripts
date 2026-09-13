// @ts-nocheck
/**
 * delete-gacha-pool-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, GACHA_CUSTOM_ONLY_POOL_TAG, normalizeGachaPoolId } from '../../features/gacha/gacha-helpers';
import { Store } from '../../shared/storage/store';
export function createDeleteGachaPoolConfig(deps: any) {
  const deleteGachaPoolConfig = async (poolId: GachaPoolTag, rawData): Promise<boolean> => {
    const id = normalizeGachaPoolId(poolId);
    if (!id || id === GACHA_ALL_POOL_TAG) return false;
    const pool = deps.getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === id);
    if (!pool || !deps.canDeleteGachaPoolDefinition(pool)) return false;

    await deps.ensureGachaCatalogLoaded(rawData);
    const originalItems = deps.cloneGachaCatalogItems(deps.getCustomGachaItemDefinitions(rawData));
    const deletingFallbackPool = id === GACHA_CUSTOM_ONLY_POOL_TAG;
    const nextItems: GachaItemDefinition[] = [];
    const removedItemIds: string[] = [];
    let needsFallbackPool = false;

    deps.getCustomGachaItemDefinitions(rawData).forEach(item => {
      if (!item.poolTags.includes(id)) {
        nextItems.push(item);
        return;
      }
      const nextTags = item.poolTags.filter(tag => tag !== id);
      if (nextTags.length > 0) {
        nextItems.push({
          ...item,
          poolTags: nextTags,
        });
        return;
      }
      if (deletingFallbackPool) {
        removedItemIds.push(item.id);
        return;
      }
      needsFallbackPool = true;
      nextItems.push({
        ...item,
        poolTags: [GACHA_CUSTOM_ONLY_POOL_TAG],
      });
    });

    const savedCatalog = await deps.saveStoredGachaCatalog(nextItems);
    if (!savedCatalog) return false;
    const localStorageSnapshot = deps.collectGachaLocalStorageSnapshot([
      deps.STORAGE_KEY_GACHA_POOL_SETTINGS,
      deps.STORAGE_KEY_GACHA_ITEM_SETTINGS,
      deps.STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
      deps.STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
    ]);
    try {
      const pools = deps.getConfiguredGachaPoolDefinitions().filter(candidate => candidate.id !== id);
      if (needsFallbackPool && !pools.some(candidate => candidate.id === GACHA_CUSTOM_ONLY_POOL_TAG)) {
        const nextOrder = pools.reduce((max, candidate) => Math.max(max, Number(candidate.order) || 0), 0) + 10;
        pools.push(
          deps.buildDefaultGachaPoolDefinition(GACHA_CUSTOM_ONLY_POOL_TAG, {
            name: GACHA_CUSTOM_ONLY_POOL_TAG,
            builtin: false,
            visibleInTabs: false,
            includeInAll: false,
            order: nextOrder,
          }),
        );
      }
      deps.saveGachaPoolSettings(pools);
      removedItemIds.forEach(deps.deleteGachaItemSetting);
      if (deps.getStoredGachaActivePoolTag(GACHA_ALL_POOL_TAG) === id) deps.saveStoredGachaActivePoolTag(GACHA_ALL_POOL_TAG);
      if (normalizeGachaPoolId(Store.get(deps.STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, GACHA_ALL_POOL_TAG)) === id) {
        deps.saveStoredGachaSettingsPoolTag(GACHA_ALL_POOL_TAG);
      }
    } catch (error) {
      const rolledBackCatalog = await deps.saveStoredGachaCatalog(originalItems);
      const rollbackWarnings = deps.restoreGachaLocalStorageSnapshot(localStorageSnapshot);
      const message = deps.getRuntimeErrorMessage(error) || '删除卡池配置失败';
      const rollbackMessage = [
        !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
        ...rollbackWarnings,
      ].filter(Boolean).join('；');
      if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
      throw error;
    }
    return true;
  };
  return deleteGachaPoolConfig;
}
