// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=1「表主键配置 (用于行标识转换)」
// 原行范围：85-141（含 banner 83-141）；拆分批次 2；外部 closure 依赖：0
// 接线说明：showActionableErrorToast 来自 ../ui/actionable-error-toast（该模块不引用 index.ts，无循环 import）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
  // ========================================
  // 表主键配置 (用于行标识转换)
  const PRIMARY_KEYS = {
    全局数据表: null,
    世界地图点: '详细地点',
    地图元素表: '元素名称',
    主角信息: '姓名',
    重要人物表: '姓名',
    重要角色表: '姓名',
    技能表: '技能名称',
    物品表: '物品名称',
    装备表: '装备名称',
    任务表: '名称',
    总结表: '编码索引',
    总体大纲: '编码索引',
    重要情报: '情报名称',
    势力: '名称',
  };

  // 兼容新旧模板表名（重要人物表 = 旧名, 重要角色表 = 新名）
  const isNpcTableName = (name: string): boolean => name === '重要人物表' || name === '重要角色表';

  const TABLE_TEMPLATE_CHECK_HINT = '请在高级设置中使用“检验表格模板”检查当前表格模板。';

  const withTableTemplateCheckHint = (message: string): string => {
    const text = String(message || '').trim();
    if (!text) return TABLE_TEMPLATE_CHECK_HINT;
    if (text.includes('检验表格模板')) return text;
    const separator = /[。！？!?]$/.test(text) ? '' : '。';
    return `${text}${separator}${TABLE_TEMPLATE_CHECK_HINT}`;
  };

  const warnTableTemplateIssue = (message: string): void => {
    window.toastr?.warning(withTableTemplateCheckHint(message));
  };

  const errorTableTemplateIssue = (message: string): void => {
    showActionableErrorToast(message, { suggestion: 'tableTemplate' });
  };

  /**
   * 获取行的主键值
   * @param tableName 表名
   * @param row 行数据
   * @param headers 表头
   */
  function getRowKey(tableName, row, headers) {
    const pkField = PRIMARY_KEYS[tableName];
    if (pkField === null) return '_row_0';

    let fieldIndex = 1;
    if (pkField) {
      const idx = headers.indexOf(pkField);
      if (idx !== -1) fieldIndex = idx;
    }

    if (!row[fieldIndex]) return null;
    return `${pkField || headers[fieldIndex]}=${row[fieldIndex]}`;
  }
export {
  PRIMARY_KEYS,
  isNpcTableName,
  TABLE_TEMPLATE_CHECK_HINT,
  withTableTemplateCheckHint,
  warnTableTemplateIssue,
  errorTableTemplateIssue,
  getRowKey,
};
