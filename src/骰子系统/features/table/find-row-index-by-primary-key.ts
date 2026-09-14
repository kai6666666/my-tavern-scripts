// @ts-nocheck
/**
 * find-row-index-by-primary-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRIMARY_KEYS } from '../../shared/constants';
export function createFindRowIndexByPrimaryKey(deps: any) {
  function findRowIndexByPrimaryKey(sheetKey: string, tableName: string, primaryKeyValue: string): number | null {
    try {
      const data = deps.getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      const sheet = data?.[sheetKey];
      if (!sheet || !sheet.content || !Array.isArray(sheet.content) || sheet.content.length < 2) {
        return null;
      }

      const headers = sheet.content[0] as string[];
      const pkField = PRIMARY_KEYS[tableName as keyof typeof PRIMARY_KEYS];

      // 处理特殊情况：全局数据表等没有主键的情况
      if (pkField === null) {
        return primaryKeyValue === '_row_0' ? 0 : null;
      }

      if (!pkField) return null;

      const pkIndex = headers.indexOf(pkField);
      if (pkIndex === -1) {
        console.warn(`[DICE]findRowIndexByPrimaryKey: 在表 ${tableName} 中找不到主键字段 ${pkField}`);
        return null;
      }

      // 【修复】解析 primaryKeyValue，提取实际值
      // getRowKey() 返回格式: "姓名=张三" -> 需要提取 "张三"
      let actualValue = primaryKeyValue;
      const eqIdx = primaryKeyValue.indexOf('=');
      if (eqIdx !== -1) {
        actualValue = primaryKeyValue.substring(eqIdx + 1);
      }

      // 遍历数据行（从索引1开始）
      for (let i = 1; i < sheet.content.length; i++) {
        const row = sheet.content[i];
        if (row && String(row[pkIndex]) === String(actualValue)) {
          // 数据库的 rowIndex 是从 0 开始的数据行索引（对应 content[1]）
          return i - 1;
        }
      }
    } catch (e) {
      console.warn('[DICE]findRowIndexByPrimaryKey 失败:', e);
    }
    return null;
  }
  return findRowIndexByPrimaryKey;
}
