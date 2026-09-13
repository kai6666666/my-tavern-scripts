// @ts-nocheck
/**
 * build-new-table-template-requirement-preset-jsonc-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildNewTableTemplateRequirementPresetJsoncTemplate(deps: any) {
  const buildNewTableTemplateRequirementPresetJsoncTemplate = (): string => {
    return `{
  // name：预设名称，必填。
  "name": "新的模板检验预设",
  "description": "用于检查当前聊天模板是否满足指定表格结构要求。",

  // requirementLevels：可选。把要求分成 error / warning / info。
  // - error：缺失后核心功能会失败，例如检定找不到角色名或属性列。
  // - warning：功能会降级或体验明显变差，例如地点层级或所在地点缺失。
  // - info：建议保留，用于提示词、排序、注入配置等辅助能力。
  "requirementLevels": {
    "defaults": {
      "sheet": "warning",
      "header": "warning",
      "ddl": "warning",
      "sourceData": {
        "note": "info"
      },
      "mate": "info"
    },
    "sheets": {
      "sheet_protagonist": {
        "sheet": "error",
        "headers": {
          "姓名": "error",
          "基础属性": "error",
          "特有属性": "warning"
        }
      },
      "sheet_important_npc": {
        "sheet": "error",
        "headers": {
          "姓名": "error",
          "基础属性": "error",
          "特有属性": "error"
        }
      },
      "sheet_inventory": {
        "sheet": "error",
        "header": "error"
      },
      "sheet_equipment": {
        "sheet": "error",
        "header": "error"
      },
      "sheet_world_map": {
        "sheet": "warning",
        "header": "warning"
      },
      "sheet_map_elements": {
        "sheet": "warning",
        "header": "warning"
      }
    }
  },

  // template：只放你想校验的表和业务列；不要把整份表格模板塞进来。
  // row_id、普通展示表、纯提示用列不必写，除非你的预设真的要检查它们。
  "template": {
    "sheet_protagonist": {
      "name": "主角信息",
      "content": [["姓名", "基础属性", "特有属性"]],
      "sourceData": {
        "note": "主角信息需要姓名和属性列，属性建议写成 力量:55; 敏捷:40"
      }
    },
    "sheet_important_npc": {
      "name": "重要角色表",
      "content": [["姓名", "基础属性", "特有属性", "所在地点", "在场状态"]]
    },
    "sheet_world_map": {
      "name": "世界地图点",
      "content": [["详细地点", "次要地区", "主要地区"]]
    },
    "sheet_map_elements": {
      "name": "地图元素表",
      "content": [["元素名称", "所在地点"]]
    },
    "sheet_inventory": {
      "name": "物品表",
      "content": [["物品名称", "类型", "数量", "品质", "描述"]]
    },
    "sheet_equipment": {
      "name": "装备表",
      "content": [["装备名称", "类型", "品质", "状态", "描述"]]
    }
  }
}`;
  };
  return buildNewTableTemplateRequirementPresetJsoncTemplate;
}
