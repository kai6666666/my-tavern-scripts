// @ts-nocheck
/**
 * create-render-preset-editor-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateRenderPresetEditorTemplate(deps: any) {
  const createRenderPresetEditorTemplate = (): string => `{
  // 渲染预设只改变“怎么显示”，不会修改数据库里的真实列名和真实内容。
  // 影响范围：主表格卡片、收藏夹卡片、仪表盘预览、MVU 数值面板的快捷检定按钮。
  // 这里可以直接填写 rules 对象；导入完整预设文件时也支持 format / name / description / rules 包装。

  // columnDisplay：控制列名显示。
  // 例：真实列名是“一句话介绍（给 AI 看）”，显示时会先去掉括号内容，再按 aliases 改成“介绍”。
  "columnDisplay": {
    // true：移除列名里 ()、（） 、[]、【】 及其中内容。
    // 只影响显示名，不影响表头、锁定 key、搜索和写入。
    "stripBracketContent": true,

    // aliases：列名显示别名。左边是真实列名或清理括号后的列名，右边是你想显示给用户看的名字。
    // 例：“外貌特征”显示为“外貌”；真实表头仍然叫“外貌特征”。
    "aliases": {
      "一句话介绍": "介绍",
      "外貌特征": "外貌"
    }
  },

  // invalidValues：这些值会被当作“空内容”处理。
  // 在表格卡片里会隐藏这一行；在关系和短标签拆分里会被过滤掉。
  "invalidValues": ["-", "--", "—", "null", "none", "无", "空", "n/a", "undefined", "/", "nil"],

  // identityHeaderKeywords：身份字段例外。
  // 列名包含这些词时，不拆“属性:数值”、不拆“人名:关系”、不拆分号标签，尽量保留普通文本或标签。
  // 例：“身份”列里的“侦探;调查员”不会被拆成两个短标签。
  "identityHeaderKeywords": ["身份"],

  // relationship：控制“人名:关系”这类内容的显示方式。
  // 推荐格式是“张三:朋友;李四:竞争”，会显示成两条关系：张三=朋友、李四=竞争；界面上不再重复显示原列名。
  "relationship": {
    // false：完全关闭关系拆分，回退为普通文本。
    "enabled": true,

    // headerKeywords：按“列名”判断是否属于关系列。
    // 例：列名是“人际关系”“NPC关系”时，会尝试把这一列里的“张三:朋友;李四:竞争”拆成多条关系显示。
    "headerKeywords": ["关系", "人际"],

    // autoDetectMultipleParen：按“内容”兜底判断。
    // true 时：即使列名是“备注”这类普通名字，只要内容里有多个旧式“人名(关系)”，也会自动拆成多条关系显示。
    // 注意：冒号格式“张三:朋友;李四:竞争”建议放在列名包含 headerKeywords 的关系列里。
    "autoDetectMultipleParen": true
  },

  // attributes：控制属性键值对渲染。
  // 会把“力量:80; 敏捷:70”或 {"力量":80,"敏捷":70} 拆成两行，显示“属性名 + 数值”，并隐藏原列名。
  // 拆出的数值属性会按 quickCheck 规则决定是否显示快捷检定按钮。
  "attributes": {
    // false：完全关闭属性拆分，回退为普通文本。
    "enabled": true,

    // true：支持 JSON 对象格式，如 {"力量":80,"敏捷":70}。
    "parseJsonObject": true,

    // true：支持 属性名:数值 / 属性名：数值，也支持分号、逗号、空格分隔。
    "parseKeyValuePairs": true
  },

  // shortTags：控制短标签渲染。
  // 例：“受伤;潜行;警觉”会显示成三个标签。
  // 如果任意一项超过 maxLength，会回退为普通文本，避免长句被切成一堆标签。
  "shortTags": {
    "enabled": true,
    "maxLength": 6
  },

  // badges（小标签）：控制普通短文本是否显示成紧凑的小标签。
  // 短文本、百分比、Lv.N、状态词可以沿用当前小标签样式。
  "badges": {
    "enabled": true,

    // 长度不超过这个值的普通文本可以显示为标签。
    "shortTextMaxLength": 6,

    // true：百分比、分数、Lv.N 这类数值短文本也可以显示为小标签。
    "numericPattern": true,

    // 常见状态词。可以增删，比如加入“昏迷”“中毒”“失踪”。
    "statusValues": ["是", "否", "有", "无", "死亡", "存活"]
  },

  // quickCheck：控制快捷检定按钮。
  // 启用时，表格里的纯数值、属性键值对数值、MVU 数值面板包含数字时会渲染快捷检定用骰子图标。
  "quickCheck": {
    // false：所有渲染位置都不显示快捷检定按钮。
    "enabled": true,

    // excludeKeywords：列名或属性名包含这些词时，不显示快捷检定按钮。
    // 用来排除“描述”“身份”“外貌”等虽然可能含数字、但不适合检定的字段。
    "excludeKeywords": ${JSON.stringify(deps.DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, null, 6).replace(/\n/g, '\n    ')}
  },

  // dialogueIndent：控制“正文头像渲染”只在哪些消息标签内生效。
  // 白名单和黑名单是“且”的关系：文本必须命中白名单，且不能处在黑名单标签内。
  // 黑名单优先。例：whitelist=["content"] 且 blacklist=["tag1"] 时，
  // <content><tag1>...</tag1><tag2>...</tag2></content> 只会尝试渲染 tag2 里的正文头像。
  "dialogueIndent": {
    // whitelist：为空或包含 "*" 时，不限制标签范围，维持默认全局识别。
    // 如果只想处理 <content></content> 内的正文，可改成 ["content"]。
    // 也支持逗号分隔字符串，如 "content, tag2, tag3"。
    "whitelist": ["*"],

    // blacklist：处在这些标签内的内容永远不做正文头像渲染。
    // 用来排除摘要、分析、变量更新、检定结果、选项、图片等系统内容。
    "blacklist": ${JSON.stringify(deps.DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST, null, 6).replace(/\n/g, '\n    ')}
  }
}`;
  return createRenderPresetEditorTemplate;
}
