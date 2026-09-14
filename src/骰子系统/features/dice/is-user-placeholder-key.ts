// @ts-nocheck
/**
 * is-user-placeholder-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsUserPlaceholderKey(deps: any) {
  const isUserPlaceholderKey = (name: string): boolean =>
    deps.getUSER_PLACEHOLDER_KEYS().some(key => name.toLowerCase() === key.toLowerCase());
  return isUserPlaceholderKey;
}
