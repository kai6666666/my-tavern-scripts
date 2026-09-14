// @ts-nocheck
/**
 * dashboard-table-config.ts
 * Feature-Sliced 模块（数据常量）。
 */
import { CHARACTER_NAME_COLUMN_KEYS } from '../../entities/name-alias';

export const DASHBOARD_TABLE_CONFIG: DashboardConfigMap = {
    global: {
      tableKeywords: ['全局数据表', '全局数据', '全局'],
      columns: {
        detailLocation: { keywords: ['当前详细地点', '详细地点', '具体位置', '当前位置'], fallbackIndex: null },
        currentLocation: { keywords: ['当前次要地区', '当前所在地点', '当前地点', '所在地点'], fallbackIndex: 2 },
        currentTime: { keywords: ['当前时间', '时间', '当前日期时间', '当前日期', '日期时间'], fallbackIndex: null },
      },
    },
    player: {
      // 新增: user, <user>
      tableKeywords: ['主角信息', '主角', '玩家', '角色信息', 'player', '用户', 'user', '<user>'],
      columns: {
        name: { keywords: CHARACTER_NAME_COLUMN_KEYS, fallbackIndex: 1 },
        status: { keywords: ['状态关键词', '状态关键字', '状态标签', '状态'], fallbackIndex: null },
        position: { keywords: ['具体位置', '位置', '所在地'], fallbackIndex: null },
        attrs: { keywords: ['基础属性', '属性'], fallbackIndex: null, isMultiple: true },
        // 新增: 灵石, 积分, 代币, 信用点
        money: {
          keywords: ['金钱', '资金', '金币', '货币', '余额', '灵石', '积分', '代币', '信用点'],
          fallbackIndex: null,
        },
        resources: { keywords: ['资源数据', '资源', 'resources'], fallbackIndex: null },
      },
    },
    location: {
      // 新增: 秘境, 副本, 洞府, 空间, 位面, 界域
      tableKeywords: [
        '世界地图点',
        '地图点',
        '地图',
        '地点',
        '地点表',
        '地图表',
        '场景',
        '区域',
        '秘境',
        '副本',
        '洞府',
        '空间',
        '位面',
        '界域',
      ],
      columns: {
        name: {
          keywords: ['详细地点', '具体位置', '当前地点', '次要地区', '主要地区', '地区', '地点名', '名称'],
          fallbackIndex: 1,
        },
        description: { keywords: ['环境描述', '描述', '说明', '介绍', '氛围描述'], fallbackIndex: null },
      },
    },
    npc: {
      // 新增: 弟子, 成员, 队友, 伙伴, 宠物, 灵宠
      tableKeywords: [
        '重要人物表',
        '重要角色表',
        '重要人物',
        'NPC',
        '人物表',
        '人物',
        '角色表',
        '角色',
        'character',
        '弟子',
        '成员',
        '队友',
        '伙伴',
        '宠物',
        '灵宠',
      ],
      columns: {
        name: { keywords: CHARACTER_NAME_COLUMN_KEYS, fallbackIndex: 1 },
        status: { keywords: ['自身状态', '状态'], fallbackIndex: null },
        position: { keywords: ['具体位置', '位置', '所在地点', '所在'], fallbackIndex: null },
        inScene: { keywords: ['在场状态', '在场', '是否离场', '离场'], fallbackIndex: null },
      },
    },
    quest: {
      // 新增: 委托, 悬赏
      tableKeywords: ['任务表', '备忘事项', '任务', '事项', '目标', '待办', '主线', '支线', '委托', '悬赏'],
      columns: {
        name: { keywords: ['事项名称', '任务名', '名称'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类', '事项类型'], fallbackIndex: 2 },
        progress: { keywords: ['进度', '完成度', '进度/结果'], fallbackIndex: 5 },
        status: { keywords: ['状态'], fallbackIndex: 6 },
      },
      filters: {
        active: { column: 'status', includes: ['活跃', '进行中', '进行'], excludeColumn: 'type', excludes: ['规则'] },
      },
    },
    bag: {
      // 新增: 储物袋, 空间戒指
      tableKeywords: ['背包物品', '背包', '物品', '道具', '库存', '储物袋', '空间戒指', '持有物品表'],
      columns: {
        name: { keywords: ['物品名称', '名称', '物品名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类', '物品类型'], fallbackIndex: 2 },
        count: { keywords: ['数量', '个数', '持有数'], fallbackIndex: 3 },
      },
    },
    skill: {
      // 新增: 神通, 道法, 功法, 血脉, 天赋, 义体改造, 超凡能力, 词条
      tableKeywords: [
        '主角技能',
        '技能表',
        '技能',
        '能力',
        '魔法',
        '超能力',
        '异能',
        '神通',
        '道法',
        '功法',
        '血脉',
        '天赋',
        '义体改造',
        '超凡能力',
        '词条',
      ],
      columns: {
        name: { keywords: ['技能名称', '名称', '技能名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类'], fallbackIndex: 2 },
        level: { keywords: ['等级', '级别', '熟练度', 'lv'], fallbackIndex: 3 },
      },
    },
    equip: {
      // 新增: 法宝, 灵器, 仙器, 神器, 义体, 神装
      tableKeywords: ['装备表', '装备', '武器', '防具', '法宝', '灵器', '仙器', '神器', '义体', '神装'],
      columns: {
        name: { keywords: ['装备名称', '名称', '装备名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类'], fallbackIndex: 2 },
        part: { keywords: ['部位', '装备部位', '位置'], fallbackIndex: 3 },
        isEquipped: { keywords: ['状态', '是否装备', '装备状态', '装备中'], fallbackIndex: 4 },
      },
      filters: {
        equipped: { column: 'isEquipped', includes: ['已装备', '装备中', 'true', '是', 'yes', 'equipped'] },
      },
    },
  };
