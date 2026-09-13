// @ts-nocheck
/**
 * strip-json-comments.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStripJsonComments(deps: any) {
  const stripJsonComments = (jsonText: string): string => {
    let result = '';
    let inString = false;
    let quote = '';
    let escaped = false;

    for (let i = 0; i < jsonText.length; i++) {
      const char = jsonText[i];
      const next = jsonText[i + 1];

      if (inString) {
        result += char;
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          inString = false;
          quote = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quote = char;
        result += char;
        continue;
      }

      if (char === '/' && next === '/') {
        while (i < jsonText.length && jsonText[i] !== '\n') i++;
        result += '\n';
        continue;
      }

      if (char === '/' && next === '*') {
        i += 2;
        while (i < jsonText.length && !(jsonText[i] === '*' && jsonText[i + 1] === '/')) {
          if (jsonText[i] === '\n') result += '\n';
          i++;
        }
        i++;
        continue;
      }

      result += char;
    }

    return result;
  };
  return stripJsonComments;
}
