// @ts-nocheck
/**
 * strip-jsonc-syntax.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStripJsoncSyntax(deps: any) {
  const stripJsoncSyntax = (jsonText: string): string => {
    const withoutComments = deps.stripJsonComments(String(jsonText || ''));
    let result = '';
    let inString = false;
    let quote = '';
    let escaped = false;

    for (let index = 0; index < withoutComments.length; index++) {
      const char = withoutComments[index];

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

      if (char === ',') {
        let nextIndex = index + 1;
        while (nextIndex < withoutComments.length && /\s/.test(withoutComments[nextIndex])) {
          nextIndex++;
        }
        if (withoutComments[nextIndex] === '}' || withoutComments[nextIndex] === ']') continue;
      }

      result += char;
    }

    return result;
  };
  return stripJsoncSyntax;
}
