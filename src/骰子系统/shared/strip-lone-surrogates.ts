// @ts-nocheck
/**
 * strip-lone-surrogates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStripLoneSurrogates(deps: any) {
  const stripLoneSurrogates = (value: string): string => {
    let sanitized = '';
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff) {
        const next = value.charCodeAt(i + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          sanitized += value[i] + value[i + 1];
          i++;
        } else {
          sanitized += '\uFFFD';
        }
        continue;
      }
      if (code >= 0xdc00 && code <= 0xdfff) {
        sanitized += '\uFFFD';
        continue;
      }
      sanitized += value[i];
    }
    return sanitized;
  };
  return stripLoneSurrogates;
}
