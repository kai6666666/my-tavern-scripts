// @ts-nocheck
/**
 * resolve-batch-location-emojis.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveBatchLocationEmojis(deps: any) {
  const resolveBatchLocationEmojis = (names: string[]): Map<string, string | null> => {
    // 1. 计算每个地点的候选列表
    const candidatesMap = new Map<string, string[]>();
    for (const name of names) {
      candidatesMap.set(name, deps.getEmojiCandidates(name));
    }

    // 2. 按长度排序（最短优先），同长度按字母序
    const sortedNames = [...names].sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });

    // 3. 贪心分配
    const usedEmojis = new Set<string>();
    const result = new Map<string, string | null>();

    for (const name of sortedNames) {
      const candidates = candidatesMap.get(name) || [];
      const available = candidates.find(e => !usedEmojis.has(e));
      if (available) {
        result.set(name, available);
        usedEmojis.add(available);
      } else {
        // 所有候选都被占用，回退到第一个候选（允许重复显示）
        result.set(name, candidates.length > 0 ? candidates[0] : null);
      }
    }

    return result;
  };
  return resolveBatchLocationEmojis;
}
