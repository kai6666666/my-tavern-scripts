// @ts-nocheck
/**
 * format-output-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatOutputTemplate(deps: any) {
  const formatOutputTemplate = (template: string, context: Record<string, string | number | undefined>): string => {
    const missingKeys = new Set<string>();

    // [修复] 先替换带点的变量（如 $roll.total），再替换普通变量（如 $roll）
    // 这样可以避免 $roll.total 被错误地替换为 "3.total"
    let result = template.replace(/\$([a-zA-Z_]\w*\.[a-zA-Z_]\w*)/g, match => {
      const key = match.slice(1); // 去掉 $ 前缀，得到 "roll.total"
      const value = context[key];
      if (value === undefined || value === null) {
        if (!missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[DICE] formatOutputTemplate: 未定义变量 $${key}`);
        }
        return '';
      }
      return String(value);
    });

    // 再替换普通变量
    result = result.replace(/\$([a-zA-Z_]\w*)(?=\W|$)/g, match => {
      const key = match.slice(1);
      const value = context[key];
      if (value === undefined || value === null) {
        if (!missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[DICE] formatOutputTemplate: 未定义变量 $${key}`);
        }
        return '';
      }
      return String(value);
    });
    // 清理空行：将连续多个换行符替换为单个换行符
    return result.replace(/\n\s*\n/g, '\n');
  };
  return formatOutputTemplate;
}
