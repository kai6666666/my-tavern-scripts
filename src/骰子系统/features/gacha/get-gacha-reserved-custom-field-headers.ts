// @ts-nocheck
/**
 * get-gacha-reserved-custom-field-headers.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaReservedCustomFieldHeaders(deps: any) {
  const getGachaReservedCustomFieldHeaders = (
    target: GachaRewardTarget,
    targetColumns?: GachaRewardTargetColumns,
  ): Set<string> => {
    const headers = new Set(
      target === 'equipment'
        ? ['row_id', '装备名称', '类型', '数量', '品质', '标签', '效果', '状态', '描述']
        : ['row_id', '物品名称', '类型', '数量', '品质', '标签', '效果', '描述'],
    );
    const writtenKeys =
      target === 'equipment' ? deps.getGACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS() : deps.getGACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS();
    deps.getGachaTargetColumnEntries(targetColumns).forEach(([key, headerName]) => {
      if (writtenKeys.has(key)) headers.add(headerName);
    });
    return headers;
  };
  return getGachaReservedCustomFieldHeaders;
}
