// @ts-nocheck
/**
 * get-table-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetTableData(deps: any) {
  const getTableData = (options?: RuntimeTableReadOptions) => {
    const api = deps.getCore().getDB();
    if (!api || !deps.hasRuntimeTableReadApi(api)) {
      console.warn('[DICE]数据库 API 不可用，无法获取表格数据');
      return null;
    }
    try {
      const data = deps.cloneRuntimeDataValue(deps.readRuntimeTableData(api));
      if (data && !options?.silent) {
        const sheetCount = Object.keys(data).filter(k => k.startsWith('sheet_')).length;
        console.info(`[DICE]已加载表格数据，包含 ${sheetCount} 个工作表`);
      }
      return data;
    } catch (e) {
      console.error('[DICE]获取表格数据失败:', e);
      return null;
    }
  };
  return getTableData;
}
