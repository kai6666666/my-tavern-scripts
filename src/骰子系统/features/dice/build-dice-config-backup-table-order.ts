// @ts-nocheck
/**
 * build-dice-config-backup-table-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * 根据配置方案中的数据库表格模板（每张表的 orderNo）生成导航盘顺序：
 * 特殊项（仪表盘/投掷/审核/MVU/收藏夹/交互总览）→ 表格（按 orderNo 升序）。
 * 用于导入配置方案时覆盖导航盘管理的顺序。
 */
export function createBuildDiceConfigBackupTableOrder(deps: any) {
  const buildDiceConfigBackupTableOrder = (tableTemplatePayload: any): string[] => {
    try {
      const resourceKey = deps.DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY || 'tableTemplate';
      const resources = tableTemplatePayload?.resources || {};
      const templateMap = resources[resourceKey];
      if (!templateMap || typeof templateMap !== 'object') return [];
      const tables = [];
      Object.keys(templateMap).forEach(key => {
        const entry = templateMap[key];
        if (!entry || typeof entry !== 'object') return;
        const name = typeof entry.name === 'string' ? entry.name.trim() : '';
        if (!name) return;
        const rawOrder = Number(entry.orderNo);
        tables.push({ name, orderNo: Number.isFinite(rawOrder) ? rawOrder : Number.MAX_SAFE_INTEGER });
      });
      tables.sort((left, right) =>
        left.orderNo !== right.orderNo ? left.orderNo - right.orderNo : left.name.localeCompare(right.name, 'zh-CN'),
      );
      const seen = new Set();
      const result = [];
      (deps.TABLE_NAV_SPECIAL_KEYS || []).forEach(key => {
        if (!key || seen.has(key)) return;
        seen.add(key);
        result.push(String(key));
      });
      tables.forEach(table => {
        if (seen.has(table.name)) return;
        seen.add(table.name);
        result.push(table.name);
      });
      return result;
    } catch (error) {
      console.warn('[DICE]根据配置方案生成导航盘顺序失败:', error);
      return [];
    }
  };
  return buildDiceConfigBackupTableOrder;
}
