// @ts-nocheck
/**
 * get-icon-for-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetIconForTableName(deps: any) {
  const getIconForTableName = name => {
    if (!name) return 'fa-table';
    const n = name.toLowerCase();
    if (n.includes('主角') || n.includes('角色')) return 'fa-user-circle';
    if (n.includes('通用') || n.includes('全局')) return 'fa-globe-asia';
    if (n.includes('装扮') || n.includes('服装') || n.includes('外观')) return 'fa-shirt';
    if (n.includes('装备') || n.includes('背包')) return 'fa-briefcase';
    if (n.includes('技能') || n.includes('武魂')) return 'fa-dragon';
    if (n.includes('恋爱日记') || n.includes('日记')) return 'fa-book-open';
    if (n.includes('恋爱对象') || n.includes('恋爱')) return 'fa-heart';
    if (n.includes('关系') || n.includes('周边')) return 'fa-user-friends';
    if (n.includes('备忘') || n.includes('便签')) return 'fa-note-sticky';
    if (n.includes('任务') || n.includes('日志')) return 'fa-scroll';
    if (n.includes('人物') || n.includes('关键人物')) return 'fa-address-book';
    if (n.includes('纪要')) return 'fa-clipboard-list';
    if (n.includes('总结') || n.includes('大纲')) return 'fa-book-reader';
    if (n.includes('地图点') || n.includes('世界地图')) return 'fa-map-location-dot';
    if (n.includes('地图元素') || n.includes('机关') || n.includes('线索')) return 'fa-bullseye';
    if (n.includes('势力') || n.includes('阵营')) return 'fa-shield-halved';
    if (n.includes('物品')) return 'fa-gem';
    if (n.includes('情报') || n.includes('信息')) return 'fa-file-lines';
    if (n.includes('检定建议')) return 'fa-dice-d20';
    if (n.includes('选项')) return 'fa-list-check';
    return 'fa-table';
  };
  return getIconForTableName;
}
