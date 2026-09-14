// @ts-nocheck
/**
 * build-new-attribute-preset-jsonc-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildNewAttributePresetJsoncTemplate(deps: any) {
  const buildNewAttributePresetJsoncTemplate = (): string => `{
  // 这里只填写属性配置本体；预设名称和描述在上方输入框填写。
  // baseAttributes：基础属性，会作为表格生成和属性快捷选择的主要属性池。
  "baseAttributes": [
    {
      // name：属性显示名，也会作为快捷检定按钮和提示词里的属性名。
      "name": "力量",

      // formula：生成属性值时使用的骰子表达式，支持 3d6、3d6*5、4d6kh3、1d10-5 等。
      "formula": "3d6",

      // range：属性合理范围，用于提示词约束和结果检查。
      "range": [3, 18],

      // modifier：可选，属性微调用的随机修正表达式；不需要时可以删除。
      "modifier": "1d4-2"
    },
    {
      "name": "敏捷",
      "formula": "3d6",
      "range": [3, 18],
      "modifier": "1d4-2"
    },
    {
      "name": "体质",
      "formula": "3d6",
      "range": [3, 18],
      "modifier": "1d4-2"
    }
  ],

  // specialAttributes：技能、派生属性或世界观专属属性；没有时保留空数组。
  "specialAttributes": [
    {
      "name": "幸运",
      "formula": "3d6",
      "range": [3, 18]
    }
  ],

  // quickSelect：点击属性快捷检定时，属性值默认填入哪个检定字段。
  // 可选目标：attribute（主属性/技能值）、skillMod（技能加值）、mod（临时修正）。
  "quickSelect": {
    "baseTarget": "attribute",
    "specialTarget": "attribute",
    "fallbackTarget": "attribute",

    // nameTargetMapping：少数属性名需要填入不同字段时在这里覆盖。
    "nameTargetMapping": {
      "skillMod": ["幸运"]
    }
  }
}`;
  return buildNewAttributePresetJsoncTemplate;
}
