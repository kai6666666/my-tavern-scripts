// @ts-nocheck
/**
 * upsert-acu-dice-gacha-pool.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from './gacha-helpers';
export function createUpsertAcuDiceGachaPool(deps: any) {
  const upsertAcuDiceGachaPool = async (input: unknown, options: { silent?: boolean } = {}) => {
    const normalizedPool =
      typeof input === 'string'
        ? deps.normalizeGachaPoolDefinition({ id: input, name: input, includeInAll: true, visibleInTabs: true })
        : deps.normalizeGachaPoolDefinition(input);
    if (!normalizedPool || !normalizedPool.id || normalizedPool.id === GACHA_ALL_POOL_TAG) {
      throw new Error('[AcuDice][Gacha] upsertPool() 需要有效卡池 id');
    }

    const pools = deps.getConfiguredGachaPoolDefinitions();
    const index = pools.findIndex(pool => pool.id === normalizedPool.id);
    const existing = index >= 0 ? pools[index] : null;
    const nextPool = {
      ...(existing || deps.buildDefaultGachaPoolDefinition(normalizedPool.id, normalizedPool)),
      ...normalizedPool,
      builtin: existing?.builtin === true || deps.isBuiltinGachaPoolId(normalizedPool.id),
      visibleInTabs: normalizedPool.includeInAll === true,
      includeInAll: normalizedPool.includeInAll === true,
    };
    if (index >= 0) pools[index] = nextPool;
    else pools.push(nextPool);
    deps.saveGachaPoolSettings(pools);
    deps.refreshGachaVisualization();
    deps.refreshGachaShardShop();
    if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
    const result = deps.serializeAcuDiceGachaPool(nextPool);
    if (!options.silent && window.toastr) window.toastr.success(`卡池「${result.name}」已保存`, '骰子商店');
    deps.emitEvent('gacha:catalog', { action: 'upsertPool', pool: result });
    return result;
  };
  return upsertAcuDiceGachaPool;
}
