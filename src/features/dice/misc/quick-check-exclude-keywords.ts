// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=10「快捷检定显示排除词」
// 原行范围：3586-3631（含 banner/说明 3582-3631）；拆分批次 1；外部 closure 依赖：0
  // ========================================
  // 快捷检定显示排除词
  // ========================================
  // 旧版变量过滤黑名单的存储键只用于迁移；是否显示骰子图标统一走 RenderPresetManager.shouldShowQuickCheck()。
  const STORAGE_KEY_BLACKLIST = 'acu_filter_blacklist_v1';
  const DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = [
    '时间',
    '地点',
    '备忘',
    '总结',
    '概览',
    '日期',
    '选项',
    '任务',
    '纪要',
    '服装',
    '头像',
    '进度',
    '编码',
    '上限',
    '经验值',
    '消耗',
    '数量',
    '等级',
    '位置',
    'ID',
    '编号',
    '三围',
    'measurements',
    'ages',
    '年龄',
    'order',
    '号码',
    'time',
    'cost',
    'chapter',
    'location',
    'calendar',
    'day',
    'year',
    'month',
  ];
  const LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS.filter(
    keyword => keyword !== '概览',
  );

  const isSameKeywordSet = (left: string[], right: readonly string[]): boolean => {
    const rightSet = new Set(right);
    return left.length === rightSet.size && left.every(item => rightSet.has(item));
  };
export {
  STORAGE_KEY_BLACKLIST,
  DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  isSameKeywordSet,
};
