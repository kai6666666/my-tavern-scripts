// @ts-nocheck
/**
 * build-new-action-preset-rules-jsonc-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildNewActionPresetRulesJsoncTemplate(deps: any) {
  const buildNewActionPresetRulesJsoncTemplate = (): string => `[
  // 这里填写规则数组；每个规则组按表名关键词匹配一类表格。
  {
    // table_keywords：表名中包含任意关键词时，这组 actions 会显示在该表的条目上。
    "table_keywords": ["地点", "地图", "场所"],

    // actions：匹配后显示的快捷按钮。至少需要一个动作。
    "actions": [
      {
        // label：按钮文字，必填，建议短一些。
        "label": "前往",

        // icon：可选 Font Awesome 图标 class；不填时使用默认按钮样式。
        "icon": "fa-location-arrow",

        // template：点击按钮后写入输入框的文本；{Name} 会替换为当前条目的名称。
        "template": "<user>前往{Name}。"
      },
      {
        "label": "调查",
        "icon": "fa-magnifying-glass",
        "template": "<user>仔细调查{Name}的情况。"
      }
    ]
  },
  {
    // 同一预设可以包含多个规则组；后续规则不会覆盖前面的规则，而是按命中的表格一起提供动作。
    "table_keywords": ["人物", "NPC", "角色"],
    "actions": [
      {
        // template 可以使用 <user>、{Name} 和普通文本；复杂提示词建议保持一句话可读。
        "label": "交谈",
        "icon": "fa-comments",
        "template": "<user>与{Name}交谈。"
      },
      {
        "label": "观察",
        "icon": "fa-eye",
        "template": "<user>观察{Name}。"
      }
    ]
  }
]`;
  return buildNewActionPresetRulesJsoncTemplate;
}
