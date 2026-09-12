// @ts-nocheck
/**
 * gacha-recent-reward-detail.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaRecentRewardDetail(deps: any) {
  const showGachaRecentRewardDetail = (itemId: string, itemName: string, itemQuality: string): void => {
    if (itemId && deps.showGachaPickupItemDetail(itemId)) return;
    const fallbackItem = deps.findGachaDefinitionByNameQuality(itemName, itemQuality);
    if (fallbackItem) deps.showGachaPickupItemDetail(fallbackItem.id);
  };
  return showGachaRecentRewardDetail;
}
