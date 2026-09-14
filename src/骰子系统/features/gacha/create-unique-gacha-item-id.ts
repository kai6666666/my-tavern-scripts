// @ts-nocheck
/**
 * create-unique-gacha-item-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateUniqueGachaItemId(deps: any) {
  const createUniqueGachaItemId = (baseId: string, existingIds: Set<string>): string => {
    const safeBase =
      String(baseId || 'custom_item')
        .trim()
        .replace(/[^\w-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 64) || 'custom_item';
    let nextId = safeBase;
    let suffix = 2;
    while (existingIds.has(nextId)) {
      nextId = `${safeBase}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(nextId);
    return nextId;
  };
  return createUniqueGachaItemId;
}
