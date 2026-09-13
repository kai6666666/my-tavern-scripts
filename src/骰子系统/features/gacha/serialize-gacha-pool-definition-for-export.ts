// @ts-nocheck
/**
 * serialize-gacha-pool-definition-for-export.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition } from '../../entities/gacha-items';
  export const buildGachaExportNamePartImpl = (value: string): string =>
    String(value || '自定义物品')
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 48) || '自定义物品';
export function createSerializeGachaPoolDefinitionForExport(deps: any) {
  const serializeGachaPoolDefinitionForExport = (pool: GachaPoolDefinition) => ({
    id: pool.id,
    name: pool.name,
    builtin: pool.builtin,
    includeInAll: pool.includeInAll === true,
    order: pool.order,
  });

  const buildGachaExportNamePart = (value: string): string =>
    String(value || '自定义物品')
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 48) || '自定义物品';
  return serializeGachaPoolDefinitionForExport;
}
