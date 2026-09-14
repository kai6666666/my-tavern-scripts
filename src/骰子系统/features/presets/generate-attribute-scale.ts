// @ts-nocheck
/**
 * generate-attribute-scale.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGenerateAttributeScale(deps: any) {
  const generateAttributeScale = (min: number, max: number): string => {
    const range = max - min;

    // 计算各区间的边界值（向下取整）
    const threshold1 = Math.floor(min + range * 0.1); // 能力缺失上限
    const threshold2 = Math.floor(min + range * 0.4); // 弱项上限
    const threshold3 = Math.floor(min + range * 0.6); // 平均上限
    const threshold4 = Math.floor(min + range * 0.8); // 精英上限
    const threshold5 = Math.floor(min + range * 0.9); // 极限上限

    // 生成标尺字符串，处理边界情况（避免出现 "3-3" 这样的区间）
    const formatRange = (start: number, end: number): string => {
      if (start === end) return `${start}`;
      return `${start}-${end}`;
    };

    const scales = [
      `${formatRange(min, threshold1)}:能力缺失`,
      `${formatRange(threshold1 + 1, threshold2)}:弱项`,
      `${formatRange(threshold2 + 1, threshold3)}:平均`,
      `${formatRange(threshold3 + 1, threshold4)}:精英`,
      `${formatRange(threshold4 + 1, threshold5)}:极限`,
      `${formatRange(threshold5 + 1, max)}:破格`,
    ];

    const scaleStr = scales.join(' | ');

    // 计算基准说明中的动态数值
    // "聚集在40-60" → 平均区间
    // "90+呈断崖式稀缺" → 极限区间起点
    // "重伤→0-10" → 能力缺失区间
    // "肾上腺素→80" → 精英区间的高端值
    const avgStart = threshold2 + 1;
    const avgEnd = threshold3;
    const rareThreshold = threshold5 + 1; // 破格区间起点
    const debuffRange = formatRange(min, threshold1); // 能力缺失区间
    const buffRange = formatRange(threshold4 + 1, threshold5); // 精英区间上限

    const baseDescription = `基准: 数值呈指数增长；分布呈长尾状(绝大多数聚集在${avgStart}-${avgEnd}，${rareThreshold}+呈断崖式稀缺)，依角色[身份背景]生成，当前值受[当前状态]修正。如:重伤→${debuffRange}; 肾上腺素→${buffRange}`;

    return `${scaleStr}。${baseDescription}`;
  };
  return generateAttributeScale;
}
