// @ts-nocheck
/**
 * gacha-target-column-labels.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumnKey } from '../../entities/gacha-items';
export function createGachaTargetColumnLabels(deps: any) {
  const GACHA_TARGET_COLUMN_LABELS: Record<GachaRewardTargetColumnKey, string> = {
    name: '名称列',
    type: '类型列',
    quantity: '数量列',
    quality: '品质列',
    tags: '标签列',
    effect: '效果列',
    description: '描述列',
    part: '部位列',
    status: '状态列',
  };
  return GACHA_TARGET_COLUMN_LABELS;
}
