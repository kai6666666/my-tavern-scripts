// @ts-nocheck
/**
 * process-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createProcessTemplate(deps: any) {
  const processTemplate = (template, cardData, headers) => {
    if (!template || !cardData) return template;
    let result = template;
    const name = cardData[1] || '未知';
    result = result.replace(/\{Name\}/gi, name);
    result = result.replace(/\{RowIndex\}/gi, cardData[0] || '0');
    if (headers && headers.length > 0) {
      headers.forEach((header, idx) => {
        if (header && idx < cardData.length) {
          const value = cardData[idx] || '未知';
          const regex = new RegExp(`\\{${header}\\}`, 'gi');
          result = result.replace(regex, value);
        }
      });
    }
    result = result.replace(/\{[^}]+\}/g, '未知');
    return result;
  };
  return processTemplate;
}
