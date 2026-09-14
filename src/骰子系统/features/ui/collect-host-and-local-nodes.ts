// @ts-nocheck
/**
 * collect-host-and-local-nodes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCollectHostAndLocalNodes(deps: any) {
  const collectHostAndLocalNodes = <T extends Element>(selector: string): T[] => {
    const nodes = new Set<T>();
    deps.getTavernHostDocument()
      .querySelectorAll<T>(selector)
      .forEach(node => nodes.add(node));
    document.querySelectorAll<T>(selector).forEach(node => nodes.add(node));
    return Array.from(nodes);
  };
  return collectHostAndLocalNodes;
}
