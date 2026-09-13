// @ts-nocheck
/**
 * attribute-quick-select-defaults.ts
 * Feature-Sliced 模块（数据常量）。
 */

export const ATTRIBUTE_QUICK_SELECT_DEFAULT: NormalizedAttributeQuickSelectConfig = {
    baseTarget: 'attribute',
    specialTarget: 'attribute',
    fallbackTarget: 'attribute',
    nameTargetMapping: {},
  };

export const ATTRIBUTE_QUICK_SELECT_DND: NormalizedAttributeQuickSelectConfig = {
    baseTarget: 'attribute',
    specialTarget: 'skillMod',
    fallbackTarget: 'attribute',
    nameTargetMapping: {
      skillMod: [
        '运动',
        '杂技',
        '巧手',
        '隐匿',
        '奥秘',
        '历史',
        '调查',
        '自然',
        '宗教',
        '驯兽',
        '洞悉',
        '医药',
        '察觉',
        '求生',
        '欺瞒',
        '威吓',
        '表演',
        '游说',
        '先攻',
      ],
    },
  };
