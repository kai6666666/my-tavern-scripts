// @ts-nocheck
/**
 * is-relationship-cell.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsRelationshipCell(deps: any) {
  const isRelationshipCell = (value, headerName) => {
    if (!value) return false;
    const str = String(value).trim();
    const lowerHeader = (headerName || '').toLowerCase();
    // 表头包含"关系"关键词
    if (lowerHeader.includes('关系') || lowerHeader.includes('人际')) {
      return true;
    }
    // 非关系字段里常见 "名称(说明)"，单个括号不应被误判为人际关系。
    // 仅对旧式括号格式做内容兜底识别：如 "张三(朋友);李四(同事)"。
    // 冒号格式请优先放在列名包含“关系/人际”的关系列中。
    return /^[^(（;；]+[(（][^)）]+[)）](?:[;；][^(（;；]+[(（][^)）]+[)）])+$/.test(str);
  };
  return isRelationshipCell;
}
