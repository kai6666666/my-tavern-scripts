// @ts-nocheck
/**
 * get-dice-config-backup-table-template-rollback-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupTableTemplateRollbackSnapshot(deps: any) {
  const getDiceConfigBackupTableTemplateRollbackSnapshot = (): DiceConfigBackupTableTemplateRollbackSnapshot => {
    const api = deps.getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.getTableTemplate !== 'function') {
      return { warning: '当前数据库表格模板: 数据库模板读取 API 不可用，已取消恢复以避免无法回滚。' };
    }
    try {
      const template = api.getTableTemplate();
      if (!deps.isDiceConfigBackupRecord(template)) {
        return { warning: '当前数据库表格模板: 恢复前没有可用模板快照，已取消恢复以避免无法回滚。' };
      }
      return { template: deps.cloneDiceConfigBackupValue(template) };
    } catch (error) {
      console.warn('[DICE]配置备份读取数据库表格模板回滚快照失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      return { warning: `当前数据库表格模板: 读取回滚快照失败，已取消恢复：${message}` };
    }
  };
  return getDiceConfigBackupTableTemplateRollbackSnapshot;
}
