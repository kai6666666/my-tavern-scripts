// @ts-nocheck
/**
 * get-gacha-catalog-import-failure-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogImportAnalysis } from './gacha-types';
export function createGetGachaCatalogImportFailureMessage(deps: any) {
  const getGachaCatalogImportFailureMessage = (analysis: GachaCatalogImportAnalysis | null): string => {
    if (!analysis) {
      return '导入失败：JSON / JSONC 格式错误，或顶层结构无法解析。请确认文件是对象，且包含 items 数组。';
    }
    const errorText = deps.formatGachaCatalogImportErrors(analysis.errors);
    if (errorText) return `导入失败：没有有效物品。${errorText}`;
    return '导入失败：没有有效物品。请确认 items 是非空数组，并且每个物品都包含 name、quality、poolTags、weight、grantQuantity。';
  };
  return getGachaCatalogImportFailureMessage;
}
