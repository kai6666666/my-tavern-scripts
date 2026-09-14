// @ts-nocheck
/**
 * is-numeric-cell.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsNumericCell(deps: any) {
  const isNumericCell = value => {
    if (value === null || value === undefined || value === '') return false;
    const str = String(value).trim();
    // 匹配: 纯数字、百分比、分数(50/100)、任意中文/英文标签:数字 格式
    return (
      /^-?\d+(\.\d+)?%?$/.test(str) ||
      /^\d+\/\d+$/.test(str) ||
      /^[\u4e00-\u9fa5a-zA-Z]+[:\s：]\s*\d+/i.test(str) ||
      /\d+/.test(str)
    );
  };
  return isNumericCell;
}
