// @ts-nocheck
/**
 * remove-acu-dice-gacha-custom-pool.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
export function createRemoveAcuDiceGachaCustomPool(deps: any) {
  const removeAcuDiceGachaCustomPool = async (poolId: unknown, options: { silent?: boolean } = {}) => {
    const id = normalizeGachaPoolId(poolId);
    if (!id || id === GACHA_ALL_POOL_TAG) throw new Error('[AcuDice][Gacha] removeCustomPool() 需要有效的自定义卡池 id');
    let removed = false;

    await deps.runInSaveQueue(async () => {
      const rawData = deps.getRuntimeGachaRawData();
      await deps.ensureGachaCatalogLoaded(rawData);
      const pool = deps.getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === id);
      if (pool && !deps.canDeleteGachaPoolDefinition(pool)) {
        throw new Error('内置卡池不能通过 API 删除，只能调整是否参与全部池');
      }
      removed = await deps.deleteGachaPoolConfig(id, rawData);
      deps.refreshGachaVisualization();
      deps.refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
    });

    const result = { removed, poolId: id };
    if (removed && !options.silent && window.toastr) window.toastr.success(`卡池「${id}」已删除`, '骰子商店');
    deps.emitEvent('gacha:catalog', { action: 'removeCustomPool', ...result });
    return result;
  };
  return removeAcuDiceGachaCustomPool;
}
