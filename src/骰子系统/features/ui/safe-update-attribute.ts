// @ts-nocheck
/**
 * safe-update-attribute.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRIMARY_KEYS } from '../../shared/constants';
export function createSafeUpdateAttribute(deps: any) {
  async function safeUpdateAttribute(
    characterName: string,
    attrName: string,
    operation: 'add' | 'subtract' | 'set',
    value: number,
    options?: { initValue?: number; min?: number; max?: number },
  ): Promise<{ success: boolean; oldValue: number; newValue: number; error?: string }> {
    console.info(`[DICE]safeUpdateAttribute: ${characterName}.${attrName} ${operation} ${value}`);

    try {
      // 1. 获取 DbLockAPI
      const api = deps.getDbLockAPI();
      if (!api || typeof api.updateCell !== 'function') {
        const error = '数据库 API 不可用';
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 2. 读取当前运行时数据
      const data = deps.getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      if (!data) {
        const error = '无法读取表格数据';
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 3. 查找角色所在表格和行索引
      let targetSheetKey: string | null = null;
      let targetRowIndex: number | null = null;
      let targetColIndex: number = -1;

      // 遍历所有表格查找角色
      for (const sheetKey in data) {
        if (!sheetKey.startsWith('sheet_')) continue;
        const sheet = data[sheetKey];
        if (!sheet || !sheet.content || !Array.isArray(sheet.content) || sheet.content.length < 2) continue;

        const headers = sheet.content[0] as string[];
        const pkField = PRIMARY_KEYS[sheet.name as keyof typeof PRIMARY_KEYS];

        // 跳过无主键的表格
        if (pkField === undefined) continue;

        // 处理特殊情况：全局数据表等没有主键的情况
        if (pkField === null) {
          if (characterName === '_row_0') {
            targetSheetKey = sheetKey;
            targetRowIndex = 0;
            targetColIndex = headers.indexOf(attrName);
            break;
          }
          continue;
        }

        // 查找主键列索引
        const pkIndex = headers.indexOf(pkField);
        if (pkIndex === -1) continue;

        // 遍历数据行查找角色
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && String(row[pkIndex]) === String(characterName)) {
            targetSheetKey = sheetKey;
            targetRowIndex = i - 1; // 数据库的 rowIndex 是从 0 开始的数据行索引
            targetColIndex = headers.indexOf(attrName);
            break;
          }
        }

        if (targetSheetKey) break;
      }

      if (!targetSheetKey || targetRowIndex === null) {
        const error = `找不到角色: ${characterName}`;
        console.warn(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      if (targetColIndex === -1) {
        const error = `角色 ${characterName} 中找不到属性: ${attrName}`;
        console.warn(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 4. 检查锁定状态
      const lockState = api.getTableLockState?.(targetSheetKey);
      if (lockState) {
        // 检查行锁定
        const isRowLocked = lockState.rows?.includes(targetRowIndex) ?? false;
        if (isRowLocked) {
          const error = `角色 ${characterName} 的整行已被锁定`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }

        // 检查单元格锁定
        // 注意: targetColIndex 包含行号列，数据库的 colIndex 不包含行号列，需要 -1
        const cellKey = `${targetRowIndex}:${targetColIndex - 1}`;
        const isCellLocked = lockState.cells?.includes(cellKey) ?? false;
        if (isCellLocked) {
          const error = `属性 ${characterName}.${attrName} 已被锁定`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      }

      // 5. 获取旧值或初始化
      const sheet = data[targetSheetKey];
      const currentValue = sheet.content[targetRowIndex + 1][targetColIndex]; // +1 因为 content[0] 是表头
      let oldValue: number;

      if (currentValue === null || currentValue === undefined || currentValue === '') {
        if (options?.initValue !== undefined) {
          oldValue = options.initValue;
          console.info(`[DICE]safeUpdateAttribute: 属性 ${attrName} 不存在，初始化为 ${oldValue}`);
        } else {
          const error = `属性 ${attrName} 不存在且未提供 initValue`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      } else {
        oldValue = typeof currentValue === 'number' ? currentValue : parseFloat(String(currentValue));
        if (isNaN(oldValue)) {
          const error = `属性 ${attrName} 的值 "${currentValue}" 无法转换为数字`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      }

      // 6. 执行操作
      let newValue: number;
      switch (operation) {
        case 'add':
          newValue = oldValue + value;
          break;
        case 'subtract':
          newValue = oldValue - value;
          break;
        case 'set':
          newValue = value;
          break;
        default:
          const error = `不支持的操作类型: ${operation}`;
          console.error(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue, newValue: oldValue, error };
      }

      // 7. 应用 min/max 约束
      const min = options?.min ?? -Infinity;
      const max = options?.max ?? Infinity;
      newValue = Math.max(min, Math.min(max, newValue));

      console.info(
        `[DICE]safeUpdateAttribute: ${characterName}.${attrName} ${oldValue} → ${newValue} (${operation} ${value})`,
      );

      // 8. 通过新版 CRUD API 更新数据
      const updateResult = await api.updateCell({
        tableName: sheet.name,
        rowIndex: targetRowIndex + 1,
        colIdentifier: attrName,
        value: newValue,
        skipNotify: true,
      });
      if (updateResult === false) {
        const error = `更新 ${sheet.name}.${attrName} 失败`;
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue, newValue: oldValue, error };
      }
      const refreshedData = deps.getTableData({ silent: true });
      if (refreshedData) deps.setCachedRawData(refreshedData);

      console.info(`[DICE]safeUpdateAttribute: 成功修改 ${characterName}.${attrName}`);
      return { success: true, oldValue, newValue };
    } catch (e) {
      const error = `修改属性时发生异常: ${e instanceof Error ? e.message : String(e)}`;
      console.error(`[DICE]safeUpdateAttribute: ${error}`, e);
      return { success: false, oldValue: 0, newValue: 0, error };
    }
  }
  return safeUpdateAttribute;
}
