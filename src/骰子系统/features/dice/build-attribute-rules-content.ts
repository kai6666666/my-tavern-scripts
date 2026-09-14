// @ts-nocheck
/**
 * build-attribute-rules-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DEFAULT_SPECIAL_ATTR_TEMPLATE } from '../../shared/defaults-config';
export function createBuildAttributeRulesContent(deps: any) {
  const buildAttributeRulesContent = (
    presetId: string | null | undefined,
  ): {
    preset: AttributeRulePresetConfig;
    content: string;
    debug: Record<string, string | number>;
  } => {
    const preset = deps.getAttributeRulePresetById(presetId);
    const attrs = deps.generateRPGAttributes(preset.id === '__default__' ? null : preset) as GeneratedAttributeRules;
    const baseEntries = Object.entries(attrs.base || {});
    const specialEntries = Object.entries(attrs.special || {});
    const [baseRangeMin, baseRangeMax] = deps.getAttributeRangeBounds(preset.baseAttributes, [0, 100]);
    const [specialRangeMin, specialRangeMax] = deps.getAttributeRangeBounds(preset.specialAttributes, [0, 100]);
    const attributeScaleStr = deps.generateAttributeScale(baseRangeMin, baseRangeMax);
    const baseRangeStr = `[${baseRangeMin},${baseRangeMax}]`;
    const specialRangeStr =
      specialEntries.length > 0
        ? `[${specialRangeMin},${specialRangeMax}]`
        : `[${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[0]},${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[1]}]`;
    const baseExampleStr =
      baseEntries.length > 0
        ? baseEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : '力量:35; 敏捷:50; 体质:52; 智力:35; 感知:40; 魅力:64';
    const specialExampleStr =
      specialEntries.length > 0
        ? specialEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : DEFAULT_SPECIAL_ATTR_TEMPLATE.example;

    return {
      preset,
      content: `基础属性: "{基础属性}:{数值}"，数值范围${baseRangeStr}
示例: "${baseExampleStr}"

特有属性: 角色的特殊能力与技能，体现世界观特色与个体差异。
格式: "{特有属性}:{数值}"，数值范围${specialRangeStr}
示例: "${specialExampleStr}"

【属性标尺】
${attributeScaleStr}`,
      debug: {
        baseRangeStr,
        specialRangeStr,
        baseExampleStr,
        specialExampleStr,
        attributeScaleStr,
      },
    };
  };
  return buildAttributeRulesContent;
}
