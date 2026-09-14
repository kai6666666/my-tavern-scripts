// @ts-nocheck
/**
 * find-gacha-column-by-keywords.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindGachaColumnByKeywords(deps: any) {
  const findGachaColumnByKeywords = (headers: unknown[], keywords: readonly string[], fallbackIndex = -1): number => {
    const normalizedHeaders = headers.map(header => String(header || '').trim().toLowerCase());
    const normalizedKeywords = keywords.map(keyword => String(keyword || '').trim().toLowerCase()).filter(Boolean);

    // 先按关键词优先级精确匹配，避免“效果”列抢先命中“描述”的宽泛别名。
    for (const keyword of normalizedKeywords) {
      const exactIndex = normalizedHeaders.findIndex(header => header === keyword);
      if (exactIndex >= 0) return exactIndex;
    }
    for (const keyword of normalizedKeywords) {
      const partialIndex = normalizedHeaders.findIndex(header => header.includes(keyword));
      if (partialIndex >= 0) return partialIndex;
    }
    return fallbackIndex;
  };
  return findGachaColumnByKeywords;
}
