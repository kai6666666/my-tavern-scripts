// @ts-nocheck
/**
 * themes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createThemes(deps: any) {
  const THEMES = [
    { id: 'native', name: '跟随酒馆 (Adaptive)', icon: 'fa-circle-half-stroke' },
    { id: 'retro', name: '复古羊皮 (Retro)', icon: 'fa-scroll' },
    { id: 'dark', name: '极夜深空 (Dark)', icon: 'fa-moon' },
    { id: 'modern', name: '现代清爽 (Modern)', icon: 'fa-sun' },
    { id: 'forest', name: '森之物语 (Forest)', icon: 'fa-tree' },
    { id: 'ocean', name: '深海幽蓝 (Ocean)', icon: 'fa-water' },
    { id: 'cyber', name: '赛博霓虹 (Cyber)', icon: 'fa-bolt' },
    { id: 'nightowl', name: '深蓝磨砂 (Night Owl)', icon: 'fa-feather' },
    { id: 'sakura', name: '暖粉手账 (Warm Pink)', icon: 'fa-heart' },
    { id: 'minepink', name: '量产地雷 (Mine Pink)', icon: 'fa-skull' },
    { id: 'galgame', name: '粉梦物语 (Galgame Pink)', icon: 'fa-heart' },
    { id: 'purple', name: '紫罗兰梦 (Purple)', icon: 'fa-gem' },
    { id: 'wechat', name: '绿色泡泡 (Green Bubble)', icon: 'fa-weixin' },
    { id: 'educational', name: '学习资料 (Educational)', icon: 'fa-book' },
    { id: 'vaporwave', name: '霓虹怀旧 (Vaporwave)', icon: 'fa-palette' },
    { id: 'classicpackaging', name: '经典包装 (Classic Packaging)', icon: 'fa-box' },
    { id: 'terminal', name: '终端绿屏 (Terminal)', icon: 'fa-terminal' },
    { id: 'dreamcore', name: '梦核迷离 (Dreamcore)', icon: 'fa-cloud-moon' },
    { id: 'aurora', name: '极光幻境 (Aurora)', icon: 'fa-snowflake' },
    { id: 'chouten', name: '幻夜霓虹 (Cyber Kawaii)', icon: 'fa-star' },
  ];
  return THEMES;
}
