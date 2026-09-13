// @ts-nocheck
/**
 * format-gacha-relative-time.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatGachaRelativeTime(deps: any) {
  const formatGachaRelativeTime = (timestamp: number): string => {
    if (!timestamp) return '暂无';
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (elapsedSeconds < 60) return '刚刚';
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) return `${elapsedMinutes}分钟前`;
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) return `${elapsedHours}小时前`;
    return `${Math.floor(elapsedHours / 24)}天前`;
  };
  return formatGachaRelativeTime;
}
