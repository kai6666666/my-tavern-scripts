// @ts-nocheck
/**
 * get-gacha-local-date-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaLocalDateKey(deps: any) {
  const getGachaLocalDateKey = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  };
  return getGachaLocalDateKey;
}
