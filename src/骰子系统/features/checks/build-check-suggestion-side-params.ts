// @ts-nocheck
/**
 * build-check-suggestion-side-params.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCheckSuggestionSideParams(deps: any) {
  const buildCheckSuggestionSideParams = (
    params: CheckSuggestionParams,
    side: 'left' | 'right',
  ): CheckSuggestionParams => {
    const result: CheckSuggestionParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'preset') return;
      const lowerKey = key.toLowerCase();
      const isLeft = lowerKey.startsWith('left');
      const isRight = lowerKey.startsWith('right');
      if (!isLeft && !isRight) {
        result[key] = value;
        return;
      }
      if ((side === 'left' && isLeft) || (side === 'right' && isRight)) {
        const prefixLength = side === 'left' ? 4 : 5;
        const stripped = key.slice(prefixLength);
        const normalizedKey = stripped ? stripped.charAt(0).toLowerCase() + stripped.slice(1) : key;
        result[normalizedKey] = value;
      }
    });
    return result;
  };
  return buildCheckSuggestionSideParams;
}
