// @ts-nocheck
/**
 * fonts-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFontsList(deps: any) {
  const FONTS = [
    { id: 'default', name: '系统默认 (Modern)', val: `'Segoe UI', 'Microsoft YaHei', sans-serif` },
    { id: 'hanchan', name: '寒蝉全圆体', val: `"寒蝉全圆体", sans-serif` },
    { id: 'maple', name: 'Maple Mono (代码风)', val: `"Maple Mono NF CN", monospace` },
    { id: 'huiwen', name: '汇文明朝体 (Huiwen)', val: `"Huiwen-mincho", serif` },
    { id: 'cooper', name: 'Cooper正楷', val: `"CooperZhengKai", serif` },
    { id: 'yffyt', name: 'YFFYT (艺术体)', val: `"YFFYT", sans-serif` },
    { id: 'fusion', name: 'Fusion Pixel (像素风)', val: `"Fusion Pixel 12px M latin", monospace` },
    { id: 'wenkai', name: '霞鹜文楷 (WenKai)', val: `"LXGW WenKai", serif` },
    { id: 'notosans', name: '思源黑体 (Noto Sans)', val: `"Noto Sans CJK", sans-serif` },
    { id: 'zhuque', name: '朱雀仿宋 (Zhuque)', val: `"Zhuque Fangsong (technical preview)", serif` },
  ];
  return FONTS;
}
