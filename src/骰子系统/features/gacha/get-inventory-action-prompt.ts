// @ts-nocheck
/**
 * get-inventory-action-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryActionPrompt(deps: any) {
  const getInventoryActionPrompt = item => {
    const action = deps.getInventoryActionLabel(item.type);
    if (action === '检查') return `<user>检查${item.name}。`;
    if (action === '查看') return `<user>查看${item.name}。`;
    return `<user>使用${item.name}。`;
  };
  return getInventoryActionPrompt;
}
