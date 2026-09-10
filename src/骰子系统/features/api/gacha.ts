// @ts-nocheck
/**
 * features/api/gacha.ts
 * Feature-Sliced: 对外 API 的骰子商店子接口（AcuDice.gacha）。
 * 用工厂函数返回与原对象字面量同形的对象（自引用走 api.*，保解构安全），
 * 全部依赖以 DI 注入，与 monolith 解耦。
 */

export function createAcuDiceGachaApi(deps: {
  costs: { singleDraw: any; tenDraw: any };
  currencyName: any;
  rarityOrder: any[];
  rewardTargets: any[];
  buildStateSnapshot: (...a: any[]) => any;
  changeFortune: (...a: any[]) => any;
  confirmDialog: (opts: any) => Promise<boolean>;
  serializeDrawResult: (...a: any[]) => any;
  performDraw: (...a: any[]) => any;
  emitEvent: (event: string, payload: any) => void;
  normalizePoolId: (...a: any[]) => any;
  getVisiblePools: (...a: any[]) => any;
  updatePoolTag: (...a: any[]) => any;
  getRuntimeRaw: (...a: any[]) => any;
  ensureCatalogLoaded: (...a: any[]) => any;
  getAllPools: (...a: any[]) => any;
  serializePool: (...a: any[]) => any;
  getCustomItems: (...a: any[]) => any;
  getAllItems: (...a: any[]) => any;
  getActivePoolTags: (...a: any[]) => any;
  isItemEnabled: (...a: any[]) => any;
  compareItems: (...a: any[]) => any;
  serializeItem: (...a: any[]) => any;
  exportCatalogJson: (...a: any[]) => any;
  importCatalog: (...a: any[]) => any;
  upsertPoolApi: (...a: any[]) => any;
  removeCustomItemApi: (...a: any[]) => any;
  removeCustomPoolApi: (...a: any[]) => any;
  showShop: (...a: any[]) => any;
  closeShopApi: (...a: any[]) => any;
  showShardShop: (...a: any[]) => any;
  showSettings: (...a: any[]) => any;
}) {
  const api = {
    costs: {
      singleDraw: deps.costs.singleDraw,
      tenDraw: deps.costs.tenDraw,
    },
    currencyName: deps.currencyName,
    rarities: [...deps.rarityOrder],
    rewardTargets: [...deps.rewardTargets],

    getState() {
      return deps.buildStateSnapshot();
    },

    async setFortune(amount: number, options: { silent?: boolean; reason?: string; detail?: string } = {}) {
      return await deps.changeFortune('set', amount, options);
    },

    async addFortune(delta: number, options: { silent?: boolean; reason?: string; detail?: string } = {}) {
      return await deps.changeFortune('add', delta, options);
    },

    async clearFortune(options: { silent?: boolean; confirm?: boolean; reason?: string; detail?: string } = {}) {
      if (options.confirm === true) {
        const currentFortune = deps.buildStateSnapshot().fortune;
        if (currentFortune > 0) {
          const confirmed = await deps.confirmDialog({
            title: `清空${deps.currencyName}`,
            message: `确定要清空当前${deps.currencyName}余额吗？`,
            detail: `当前余额：${currentFortune}\n这次调用来自 AcuDice.gacha API。`,
            iconClass: 'fa-eraser',
            confirmText: `清空${deps.currencyName}`,
            cancelText: '取消',
            tone: 'danger',
          });
          if (!confirmed) {
            const state = deps.buildStateSnapshot();
            return { before: currentFortune, after: currentFortune, delta: 0, canceled: true, state };
          }
        }
      }
      const result = await deps.changeFortune('set', 0, {
        silent: options.silent,
        reason: options.reason || 'API清空',
        detail: options.detail || `清空${deps.currencyName}`,
      });
      return { ...result, canceled: false };
    },

    async draw(count: number = 1) {
      const result = deps.serializeDrawResult(await deps.performDraw(count));
      deps.emitEvent('gacha:draw', result);
      return result;
    },

    async singleDraw() {
      return await api.draw(1);
    },

    async tenDraw() {
      return await api.draw(10);
    },

    setActivePool(poolTag: string) {
      const id = deps.normalizePoolId(poolTag);
      if (!id) throw new Error('[AcuDice][Gacha] setActivePool() 需要卡池 id');
      const visiblePools = deps.getVisiblePools();
      if (!visiblePools.some(pool => pool.id === id)) throw new Error(`[AcuDice][Gacha] 未找到可见卡池: ${id}`);
      deps.updatePoolTag(id);
      const state = deps.buildStateSnapshot();
      deps.emitEvent('gacha:pool_change', { poolTag: id, state });
      return state;
    },

    setPool(poolTag: string) {
      return api.setActivePool(poolTag);
    },

    async listPools(options: { includeHidden?: boolean } = {}) {
      const rawData = deps.getRuntimeRaw();
      await deps.ensureCatalogLoaded(rawData);
      const pools = options.includeHidden ? deps.getAllPools(rawData) : deps.getVisiblePools(rawData);
      return pools.map(deps.serializePool);
    },

    async listItems(
      options: { poolTag?: string; includeDisabled?: boolean; customOnly?: boolean; source?: 'all' | 'custom' | 'builtin' } = {},
    ) {
      const rawData = deps.getRuntimeRaw();
      await deps.ensureCatalogLoaded(rawData);
      const customIds = new Set(deps.getCustomItems(rawData).map(item => item.id));
      let items = deps.getAllItems(rawData);
      const poolTag = deps.normalizePoolId(options.poolTag);
      if (poolTag) {
        const activeTags = deps.getActivePoolTags(poolTag);
        items = items.filter(item => item.poolTags.some(tag => activeTags.includes(tag)));
      }
      if (options.includeDisabled !== true) items = items.filter(deps.isItemEnabled);
      if (options.customOnly === true || options.source === 'custom') items = items.filter(item => customIds.has(item.id));
      if (options.source === 'builtin') items = items.filter(item => !customIds.has(item.id));
      return items.sort(deps.compareItems).map(item => deps.serializeItem(item, customIds));
    },

    async exportCatalog(options: { poolTag?: string } = {}) {
      const rawData = deps.getRuntimeRaw();
      await deps.ensureCatalogLoaded(rawData);
      return deps.exportCatalogJson(rawData, deps.normalizePoolId(options.poolTag));
    },

    async importCatalog(input: unknown, options: { mode?: any; silent?: boolean } = {}) {
      return await deps.importCatalog(input, options);
    },

    async upsertItems(input: unknown, options: { mode?: any; silent?: boolean } = {}) {
      return await deps.importCatalog(input, { mode: options.mode || 'overwrite', silent: options.silent });
    },

    async upsertPool(input: unknown, options: { silent?: boolean } = {}) {
      return await deps.upsertPoolApi(input, options);
    },

    async removeCustomItem(itemId: string, options: { silent?: boolean } = {}) {
      return await deps.removeCustomItemApi(itemId, options);
    },

    async removeCustomPool(poolId: string, options: { silent?: boolean } = {}) {
      return await deps.removeCustomPoolApi(poolId, options);
    },

    async openShop() {
      await deps.showShop();
      return deps.buildStateSnapshot();
    },

    closeShop() {
      deps.closeShopApi();
    },

    async openShardShop() {
      await deps.showShardShop();
      return deps.buildStateSnapshot();
    },

    async openSettings() {
      await deps.showSettings();
    },
  };

  return api;
}