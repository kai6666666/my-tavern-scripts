// @ts-nocheck
/**
 * build-gacha-catalog-template-jsonc.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_EXPORT_KIND, GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
export function createBuildGachaCatalogTemplateJsonc(deps: any) {
  const buildGachaCatalogTemplateJsonc = (): string => `{
  // 骰子商店自定义物品与卡池导入模板。
  // 注意：抽到或兑换的奖励默认写入当前仪表盘预设解析到的物品/装备区，也可以用 targetTable 固定到指定表。
  // 建议让 name、type、quality、description、rewardTarget 等字段满足当前 DDL 的 NOT NULL、CHECK、LENGTH 等检验。
  // 如果世界观需要更长名称/描述、新类型、新品质，或额外必填列，请先到数据库本体修改对应表 DDL 并重新校验 DDL。
  // 使用方法：
  // 1. 复制下面被 /* ... */ 注释包住的示例物品。
  // 2. 删除包住某个物品的 /* 和 */，再按你的设定修改字段。
  // 3. 如果要写多个物品，用英文逗号分隔每个物品对象。
  // 4. 保存后从骰子商店点击“导入自定义物品”。
  "kind": "${GACHA_CATALOG_EXPORT_KIND}",
  "version": ${GACHA_CATALOG_VERSION},
  "exportedAt": ${Date.now()},
  "pools": [
    /*
    {
      // id：卡池唯一标识。物品的 poolTags 使用这个值。
      "id": "赛博朋克",

      // name：卡池显示名。
      "name": "赛博朋克",

      // includeInAll：是否启用该卡池。启用后会显示快捷标签，并加入“全部”卡池抽取范围。
      "includeInAll": true,

      // order：排序，越小越靠前。
      "order": 100
    }
    */
  ],
  "items": [
    /*
    {
      // id：物品唯一标识。建议只用英文、数字、下划线。留空或删除 id 时会按名称/品质/类型自动生成。
      "id": "custom_lucky_coin",

      // name：物品显示名称，必填。默认模板中物品表名称 ≤10 字、装备表建议 ≤12 字；若你的 DDL 更严格/更宽松，以当前数据库本体为准。
      "name": "幸运硬币",

      // type：写入对应表格的类型。默认模板已放松为 TEXT NOT NULL，可按世界观填写；若你的 DDL 仍有 CHECK 枚举，请填写允许值或先修改 DDL。
      "type": "道具",

      // quality：必填。仙SQL 支持 普通、优秀、稀有、史诗、传说、神话、唯一。
      "quality": "稀有",

      // tags：可选，对应仙SQL的“标签”列；省略时自动生成 [类型][品质]。
      "tags": "[幸运][检定]",

      // effect：可选，对应仙SQL的“效果”列；省略时回退使用 description。
      "effect": "下一次普通检定获得轻微好运。",

      // description：外观、来历或补充说明，对应仙SQL的“描述”列，也会在商店第二行展示。
      "description": "一枚总能落在正面的硬币。",

      // poolTags：出现在哪些卡池。可填写内置卡池或自定义卡池 id；写 全部 会自动展开为当前加入“全部”的卡池。
      "poolTags": ["赛博朋克"],

      // icon：可选，符号图标。支持 fa:box、ti:wand 这类格式，也可直接写一个 emoji。图片类图标请到“图标管理预设”里配置。
      "icon": "fa:coins",

      // enabled：是否参与抽取和碎片商城兑换；设置页仍会显示禁用物品。
      "enabled": true,

      // order：物品排序，越小越靠前。留空时按品质与名称兜底排序。
      "order": 100,

      // weight：同品质内的抽取权重，必须大于 0。越大越容易被抽到。
      "weight": 1,

      // stackable：是否可堆叠。true 表示抽到已有物品时增加数量；false 表示已有时转成碎片。
      "stackable": false,

      // unique：是否唯一。true 通常配合 stackable:false 使用，碎片商城也会阻止重复兑换。
      "unique": true,

      // grantQuantity：抽到时发放数量，必须是正整数。写入物品表时会增加 quantity；装备表默认无数量列，重复装备通常转为碎片。
      "grantQuantity": 1,

      // targetTable：可选。填写当前数据库里用户可见的表名，例如“装扮表”；留空则跟随当前仪表盘预设的物品/装备区。
      "targetTable": "",

      // targetColumns：可选。目标表的基础字段表头和默认/仪表盘关键词不一致时再填；值必须与表头完全一致。
      "targetColumns": { "name": "物品名称", "type": "类型", "quantity": "数量", "tags": "标签", "effect": "效果", "description": "描述" },

      // customFields：可选，自定义字段。键名必须与目标表的列标题完全一致，值会按文本保存；不会自动读取未知顶层字段。
      "customFields": { "情感分量": "怀旧" },

      // rewardTarget：inventory 走物品型写入逻辑；equipment 走装备型写入逻辑。目标表必须存在，且对应行数据要能通过该表 DDL 检验。
      "rewardTarget": "inventory"
    }
    */
  ]
}
`;
  return buildGachaCatalogTemplateJsonc;
}
