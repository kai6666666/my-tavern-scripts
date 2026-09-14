// @ts-nocheck
/**
 * get-gacha-shop-progress-containers.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaShopProgressContainers(deps: any) {
  const getGachaShopProgressContainers = (): HTMLElement[] => {
    const roots = new Set<HTMLElement>();
    if (deps.getGachaShopRootElement()?.isConnected && deps.getGachaShopRootElement().querySelector('.acu-gacha-fortune-progress')) {
      roots.add(deps.getGachaShopRootElement());
    }
    deps.collectHostAndLocalNodes<HTMLElement>('.acu-gacha-overlay').forEach(element => {
      if (element.isConnected && element.querySelector('.acu-gacha-fortune-progress')) roots.add(element);
    });
    if (roots.size > 0) return Array.from(roots);
    deps.collectHostAndLocalNodes<HTMLElement>('.acu-gacha-shell').forEach(element => {
      if (element.isConnected && element.querySelector('.acu-gacha-fortune-progress')) roots.add(element);
    });
    return Array.from(roots);
  };
  return getGachaShopProgressContainers;
}
