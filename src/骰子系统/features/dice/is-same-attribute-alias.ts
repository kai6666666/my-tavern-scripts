// @ts-nocheck
/**
 * is-same-attribute-alias.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsSameAttributeAlias(deps: any) {
  const isSameAttributeAlias = (left: string, right: string): boolean => {
    const a = deps.normalizeAttributeName(left);
    const b = deps.normalizeAttributeName(right);
    return Boolean(a) && Boolean(b) && a === b;
  };
  return isSameAttributeAlias;
}
