// @ts-nocheck
/**
 * gacha-custom-field-reserved-keys.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGachaCustomFieldReservedKeys(deps: any) {
  const GACHA_CUSTOM_FIELD_RESERVED_KEYS = new Set([
    'row_id',
    '物品名称',
    '装备名称',
    '类型',
    '数量',
    '品质',
    '标签',
    '效果',
    '描述',
    '状态',
  ]);
  return GACHA_CUSTOM_FIELD_RESERVED_KEYS;
}
