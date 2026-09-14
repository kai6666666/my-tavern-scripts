// @ts-nocheck
/**
 * template-table-requirements.ts
 * Feature-Sliced 模块（数据常量）。
 */

export const TEMPLATE_TABLE_REQUIREMENTS: TemplateTableRequirement[] = [
    {
      title: '全局状态表不完整',
      severity: 'warning',
      tableLabel: '全局数据表',
      tableMatches: ['全局数据表', '全局数据', '全局'],
      requiredColumns: [
        { label: '当前详细地点', matches: ['当前详细地点', 'current_location'] },
        { label: '当前次要地区', matches: ['当前次要地区', 'current_minor_region'] },
        { label: '当前时间', matches: ['当前时间', 'cur_time'] },
      ],
      impact: '仪表盘无法稳定显示当前位置、次要地区和当前时间，地图/角色位置联动也会变弱。',
      suggestion: '保留默认“全局数据表”，或在仪表盘预设中映射当前地点和时间字段。',
    },
    {
      title: '主角表不完整',
      severity: 'error',
      tableLabel: '主角信息',
      tableMatches: ['主角信息', '主角', '玩家', '角色信息', 'user', '<user>'],
      requiredColumns: [
        { label: '姓名/名称', matches: ['姓名', '名称', 'name'] },
        { label: '基础属性/属性', matches: ['基础属性', '属性'] },
        { label: '所在地点/位置', matches: ['所在地点', '位置', '所在地'] },
      ],
      impact: '普通检定、属性生成/清空/自动改值和主角仪表盘可能无法找到目标角色或属性列。',
      suggestion: '建议保留“主角信息”的姓名、所在地点、基础属性；生成属性默认会写入“基础属性”。',
    },
    {
      title: 'NPC/重要角色表不完整',
      severity: 'error',
      tableLabel: '重要角色表/重要人物表',
      tableMatches: ['重要角色表', '重要人物表', 'npc', '人物', '角色', '伙伴', '队友'],
      requiredColumns: [
        { label: '姓名/名称', matches: ['姓名', '名称', 'name'] },
        { label: '基础属性/属性', matches: ['基础属性', '属性'] },
        { label: '人际关系', matches: ['人际关系'] },
        { label: '在场状态', matches: ['在场状态'] },
      ],
      impact: 'NPC 检定、对抗检定、关系图、角色头像预设和角色仪表盘可能无法识别角色或关系。',
      suggestion: '优先使用“重要角色表”，至少保留姓名、基础属性、人际关系、在场状态；旧名“重要人物表”仍可兼容。',
    },
    {
      title: '地图地点表不完整',
      severity: 'warning',
      tableLabel: '世界地图点',
      tableMatches: ['世界地图点', '地图点', '地图', '地点', '场景', '区域'],
      requiredColumns: [
        { label: '详细地点/地点名/名称', matches: ['详细地点', '地点名', '名称'] },
        { label: '次要地区', matches: ['次要地区'] },
        { label: '环境描述/描述', matches: ['环境描述', '描述'] },
      ],
      impact: '地图模块、当前位置跳转和地点卡片展示可能缺少地点名或环境信息。',
      suggestion: '建议保留“世界地图点.详细地点”，所有所在地点字段填写这里的详细地点名。',
    },
    {
      title: '地图元素表不完整',
      severity: 'warning',
      tableLabel: '地图元素表',
      tableMatches: ['地图元素', '元素表', '地图要素', '机关', '线索'],
      requiredColumns: [
        { label: '元素名称', matches: ['元素名称', '名称'] },
        { label: '元素类型', matches: ['元素类型', '类型'] },
        { label: '所在地点', matches: ['所在地点', '位置'] },
      ],
      impact: '地图元素、机关/线索展示和地点筛选可能无法按位置归类。',
      suggestion: '保留元素名称、元素类型、所在地点；所在地点应对应世界地图点里的详细地点名。',
    },
    {
      title: '物品表不完整',
      severity: 'warning',
      tableLabel: '物品表',
      tableMatches: ['物品表', '物品', '背包', '道具', '库存', '持有物品表'],
      requiredColumns: [
        { label: '物品名称/名称', matches: ['物品名称', '名称'] },
        { label: '类型', matches: ['类型'] },
        { label: '数量', matches: ['数量'] },
        { label: '品质', matches: ['品质'] },
        { label: '描述', matches: ['描述'] },
      ],
      impact: '物品栏、赠与、骰子商店奖励写入、堆叠数量、筛选和详情展示会受影响。',
      suggestion: '默认“物品表”最完整；至少保留物品名称、类型、数量，想保留详情请保留品质和描述。',
    },
    {
      title: '装备表不完整',
      severity: 'warning',
      tableLabel: '装备表',
      tableMatches: ['装备表', '装备', '武器', '防具', '法宝'],
      requiredColumns: [
        { label: '装备名称/名称', matches: ['装备名称', '名称'] },
        { label: '类型', matches: ['类型'] },
        { label: '状态', matches: ['状态'] },
        { label: '品质', matches: ['品质'] },
        { label: '描述', matches: ['描述'] },
      ],
      impact: '装备展示、当前装备识别、骰子商店装备奖励和装备详情可能失效。',
      suggestion:
        '保留装备名称、类型、品质、状态、描述；状态写“已装备/装备中/是”可被仪表盘识别。部位/位置只影响仪表盘预设的更细分展示，不作为默认模板必需列。',
    },
    {
      title: '任务表不完整',
      severity: 'info',
      tableLabel: '任务表',
      tableMatches: ['任务表', '任务', '事项', '目标', '待办', '委托'],
      requiredColumns: [
        { label: '名称', matches: ['名称'] },
        { label: '类型', matches: ['类型'] },
        { label: '进度', matches: ['进度'] },
        { label: '状态', matches: ['状态'] },
        { label: '优先级', matches: ['优先级'] },
      ],
      impact: '任务仪表盘可能无法显示任务类型、进度、状态或按优先级排序。',
      suggestion: '保留名称、类型、进度、状态；需要排序时保留优先级。',
    },
    {
      title: '检定建议表不完整',
      severity: 'warning',
      tableLabel: '检定建议表',
      tableMatches: ['检定建议'],
      requiredColumns: [
        { label: '展示文本', matches: ['展示文本'] },
        { label: '骰子命令', matches: ['骰子命令'] },
      ],
      requiredNoteTags: ['检定规则'],
      impact: '检定建议按钮可能无法生成正确展示文本/骰子命令，切换检定预设时也无法同步 AI 规则说明。',
      suggestion: '保留“检定建议表”的展示文本、骰子命令，并在 note 中保留 <检定规则>...</检定规则>。',
    },
  ];
