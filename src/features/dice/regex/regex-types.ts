// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=6「正则转换系统 - 类型定义 (Phase 1.1)」
// 原行范围：2873-3004（含 banner 2862-3004 与正则存储键）；拆分批次 3；外部 closure 依赖：0
  // ========================================
  // 正则转换系统 - 类型定义 (Phase 1.1)
  // ========================================

  /**
   * 正则转换操作类型
   * - replace: 替换匹配的内容
   * - extract: 提取匹配的内容(暂未实现)
   * - delete: 删除匹配的内容
   * - validate: 验证格式(与ValidationEngine不同,这是转换验证)
   */
  type RegexOperation = 'replace' | 'extract' | 'delete' | 'validate';

  /**
   * 正则转换作用域类型
   * - global: 所有表格的所有列
   * - table: 指定表格的所有列
   * - column: 指定表格的指定列
   */
  type RegexScopeType = 'global' | 'table' | 'column';

  /**
   * 正则转换执行模式
   * - auto: 数据更新时自动执行
   * - manual: 用户手动触发
   * - preview: 预览影响,确认后应用
   */
  type RegexExecutionMode = 'auto' | 'manual' | 'preview';

  /**
   * 正则标志位选项
   */
  interface RegexFlags {
    caseInsensitive?: boolean; // i - 忽略大小写
    global?: boolean; // g - 全局匹配
    multiline?: boolean; // m - 多行模式
    unicode?: boolean; // u - Unicode模式
    sticky?: boolean; // y - 粘性匹配
  }

  /**
   * 作用域配置
   */
  interface RegexScopeConfig {
    type: RegexScopeType;
    tableNames?: string[]; // 作用域为table或column时指定表格名
    columnNames?: string[]; // 作用域为column时指定列名
  }

  /**
   * 安全配置
   */
  interface RegexSecurityConfig {
    maxMatchTime: number; // 单次匹配最大耗时(毫秒),默认100
    maxMatches: number; // 最大匹配次数,默认1000
    maxInputLength: number; // 最大输入长度,默认10000
  }

  /**
   * 测试用例
   */
  interface RegexTestCase {
    input: string;
    expected: string;
    description?: string;
  }

  /**
   * 表格正则规则
   */
  interface RegexTransformationRule {
    id: string; // 唯一标识
    name: string; // 规则名称
    description?: string; // 规则描述
    operation: RegexOperation; // 操作类型
    pattern: string; // 正则表达式字符串
    flags?: RegexFlags; // 正则标志位
    replacement?: string; // 替换内容(仅replace操作)
    scope: RegexScopeConfig; // 作���域配置
    enabled: boolean; // 是否启用
    priority: number; // 优先级(1-100),数值越大优先级越高
    executeMode: RegexExecutionMode; // 执行模式
    testCases?: RegexTestCase[]; // 测试用例
    security?: RegexSecurityConfig; // 安全配置
    createdAt?: number; // 创建时间戳
    updatedAt?: number; // 更新时间戳
  }

  /**
   * 转换结果
   */
  interface RegexTransformResult {
    success: boolean;
    oldValue: string;
    newValue: string;
    matched: boolean;
    error?: string;
  }

  /**
   * 批量转换结果
   */
  interface RegexBatchTransformResult {
    tableName: string;
    columnIndex: number;
    rowIndex: number;
    result: RegexTransformResult;
  }

  /**
   * 预览结果
   */
  interface RegexPreviewResult {
    rule: RegexTransformationRule;
    affectedCells: Array<{
      tableName: string;
      rowIndex: number;
      columnIndex: number;
      columnName: string;
      oldValue: string;
      newValue: string;
    }>;
    totalAffected: number;
  }

  /**
   * 预设配置
   */
  interface RegexPreset {
    id: string;
    name: string;
    description?: string;
    version: string;
    rules: RegexTransformationRule[];
    createdAt?: number;
    updatedAt?: number;
  }

  // 正则转换系统存储键
  const STORAGE_KEY_REGEX_RULES = 'acu_regex_rules_v1';
  const STORAGE_KEY_REGEX_PRESETS = 'acu_regex_presets_v1';
  const STORAGE_KEY_REGEX_ACTIVE_PRESET = 'acu_regex_active_preset_v1';
  const STORAGE_KEY_REGEX_ENABLED = 'acu_regex_enabled_v1';
export type {
  RegexOperation,
  RegexScopeType,
  RegexExecutionMode,
  RegexFlags,
  RegexScopeConfig,
  RegexSecurityConfig,
  RegexTestCase,
  RegexTransformationRule,
  RegexTransformResult,
  RegexBatchTransformResult,
  RegexPreviewResult,
  RegexPreset,
};

export {
  STORAGE_KEY_REGEX_RULES,
  STORAGE_KEY_REGEX_PRESETS,
  STORAGE_KEY_REGEX_ACTIVE_PRESET,
  STORAGE_KEY_REGEX_ENABLED,
};
