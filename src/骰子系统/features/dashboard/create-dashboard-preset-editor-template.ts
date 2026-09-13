// @ts-nocheck
/**
 * create-dashboard-preset-editor-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateDashboardPresetEditorTemplate(deps: any) {
  const createDashboardPresetEditorTemplate = (): string => `{
  // 预设名称和描述在上方输入框填写；这里配置各区域如何抓取表格。
  // 每个区域保持现有渲染方式，只替换表名关键词和字段列关键词。
  // 这里可以直接填写 modules 对象；导入完整预设文件时也支持 format / name / description / modules 包装。
  // 示例对比：重要对象表 → 恋爱对象表；装备表 → 装扮表；任务表 → 备忘录。
  "global": {
    // 全局数据区：当前地点、时间等
    "tableKeywords": ["全局数据表", "全局数据", "全局"],
    "columns": {
      "detailLocation": { "keywords": ["当前详细地点", "详细地点", "具体位置", "当前位置"] },
      "currentLocation": { "keywords": ["当前次要地区", "当前所在地点", "当前地点", "所在地点"] },
      "currentTime": { "keywords": ["当前时间", "时间", "当前日期时间", "当前日期", "日期时间"] }
    }
  },
  "player": {
    // 主角区：属性、资源、当前位置
    "tableKeywords": ["主角信息", "主角", "玩家", "角色信息", "user", "<user>"],
    "columns": {
      "name": { "keywords": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"] },
      "status": { "keywords": ["近况", "当前状态", "状态关键词", "状态关键字", "状态标签", "状态"] },
      "position": { "keywords": ["具体位置", "位置", "所在地"] },
      "money": { "keywords": ["金钱", "资金", "金币", "货币", "余额"] },
      "resources": { "keywords": ["资源数据", "资源", "resources"] }
    }
  },
  "location": {
    // 地点区：保持地点列表和当前地点高亮
    "tableKeywords": ["世界地图点", "地图点", "地图", "地点", "地点表", "地图表"],
    "columns": {
      "name": { "keywords": ["详细地点", "具体位置", "当前地点", "地区", "地点名", "名称"] },
      "description": { "keywords": ["环境描述", "描述", "说明", "介绍"] }
    }
  },
  "npc": {
    // 角色区：示例把默认的“重要对象表”改成“恋爱对象表”，仍保持在场/离场分组和头像
    "tableKeywords": ["恋爱对象表", "恋爱对象"],
    "columns": {
      "name": { "keywords": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"] },
      "status": { "keywords": ["当前情绪", "对主角态度", "自身状态", "状态"] },
      "position": { "keywords": ["具体位置", "位置", "所在地点", "所在"] },
      "inScene": { "keywords": ["在场状态", "在场", "是否离场", "离场"] }
    }
  },
  "relationshipGraph": {
    // 人物关系图：sources 可配置多个来源，并按 mode 决定关系解析方式
    // fixedTarget：当前行角色固定连到 target；适合“恋爱对象表.与主角关系”
    // relationList：沿用“角色名:关系词;角色名:关系词”；适合“重要角色表.人际关系”
    "sources": [
      {
        "mode": "fixedTarget",
        "tableKeywords": ["恋爱对象表", "恋爱对象"],
        "nameColumn": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"],
        "relationColumn": ["与主角关系"],
        "target": "player"
      },
      {
        "mode": "relationList",
        "tableKeywords": ["重要角色表", "重要人物表"],
        "nameColumn": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"],
        "relationColumn": ["人际关系"]
      }
    ]
  },
  "quest": {
    // 任务区：示例把默认的“任务表”改成“备忘录”，仍保持进度条、状态排序等渲染
    "tableKeywords": ["备忘录", "备忘表", "备忘"],
    "columns": {
      "name": { "keywords": ["备忘标题", "事项名称", "任务名", "名称"] },
      "type": { "keywords": ["类型", "分类", "事项类型"] },
      "progress": { "keywords": ["后续结果", "进度", "完成度", "进度/结果"] },
      "status": { "keywords": ["当前状态", "状态"] },
      "priority": { "keywords": ["重要程度", "重要性", "优先级", "紧急程度"] }
    }
  },
  "bag": {
    // 物品区：保持物品列表和物品栏入口
    "tableKeywords": ["背包物品", "背包", "物品", "道具", "库存", "持有物品表"],
    "columns": {
      "name": { "keywords": ["物品名称", "名称", "物品名"] },
      "type": { "keywords": ["类型", "分类", "物品类型"] },
      "count": { "keywords": ["数量", "个数", "持有数"] }
    }
  },
  "equip": {
    // 装备区：示例把默认的“装备表”改成“装扮表”，并把“正在穿/已佩戴”识别为展示项
    "tableKeywords": ["装扮表", "装扮"],
    "columns": {
      "name": { "keywords": ["装扮名称", "装备名称", "名称", "装备名"] },
      "type": { "keywords": ["类型", "分类"] },
      "part": { "keywords": ["适用场景", "部位", "装备部位", "位置"] },
      "isEquipped": { "keywords": ["当前状态", "状态", "是否装备", "装备状态", "装备中"] }
    },
    "filters": {
      "equipped": {
        "includes": ["正在穿", "已佩戴", "已穿戴", "穿着中", "已装备"],
        "excludes": ["收纳中", "收纳", "损坏", "遗失", "借出", "已更换", "纪念保存", "未穿戴", "未装备"]
      }
    }
  }
}`;
  return createDashboardPresetEditorTemplate;
}
