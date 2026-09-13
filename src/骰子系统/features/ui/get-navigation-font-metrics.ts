// @ts-nocheck
/**
 * get-navigation-font-metrics.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DEFAULT_CONFIG } from '../../shared/defaults-config';
export function createGetNavigationFontMetrics(deps: any) {
  const getNavigationFontMetrics = (size: unknown) => {
    const rawFontSize = typeof size === 'number' && Number.isFinite(size) ? size : DEFAULT_CONFIG.navFontSize;
    const fontSize = Math.max(10, Math.min(20, Math.round(rawFontSize)));

    return {
      fontSize,
      buttonSize: Math.max(28, Math.min(48, Math.round(fontSize * 2.46))),
      iconSize: Math.max(14, Math.min(22, Math.round(fontSize * 1.08))),
      paddingX: Math.max(10, Math.min(20, Math.round(fontSize * 0.92))),
    };
  };
  return getNavigationFontMetrics;
}
