// @ts-nocheck
/**
 * dice-config-backup-privacy-risk-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDiceConfigBackupPrivacyRiskText(deps: any) {
  const DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT: Record<DiceConfigBackupModuleId, string> = {
    uiLayout: '风险较低，但会暴露主题、布局、表格顺序、隐藏项、折叠状态等使用偏好。',
    diceConfig: '可能暴露当前检定玩法偏好、疯狂模式权重、头像与图标联动开关、当前激活检定模式。',
    advancedPresets: '可能包含自定义检定规则、公式、输出文本、资源消耗与结果分支。',
    attributePresets: '可能包含角色属性模板、属性名、默认值、世界观或规则体系关键词。',
    actionGm: '可能包含交互按钮、发送模板、表名关键词，以及旧版 GM 引擎配置。',
    dashboardPresets: '可能包含仪表盘模块、表名、列名、关系图和展示规则。',
    renderPresets: '可能包含列名别名、关系/属性解析规则、正文头像渲染白名单与黑名单。',
    tableTemplate: '不包含当前表格行数据，但可能包含模板名、字段、说明、示例 SQL 或世界观设定。',
    tableTemplateRequirementPresets: '可能包含模板检验规则、核心表名、列名、DDL、说明文本和世界观模板要求。',
    validation: '可能包含数据验证预设、表名、列名、枚举值、错误提示与拦截偏好。',
    regex: '可能包含正则表达式、替换文本、测试用例、表名/列名关键词和文本处理偏好。',
    avatarMap: '可能包含角色名、别名、头像 URL、裁剪偏移、缩放和颜色信息。',
    customIcons: '可能包含表名、物品、装备、势力等名称，以及图标 URL 或本地图标引用元数据。',
    gachaSettings: '可能包含自定义物品、卡池、描述、自定义字段、外链图标和剧情偏好内容。',
  };
  return DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT;
}
