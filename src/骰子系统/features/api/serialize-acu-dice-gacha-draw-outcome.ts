// @ts-nocheck
/**
 * serialize-acu-dice-gacha-draw-outcome.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaDrawOutcome } from '../gacha/gacha-types';
export function createSerializeAcuDiceGachaDrawOutcome(deps: any) {
  const serializeAcuDiceGachaDrawOutcome = (outcome: GachaDrawOutcome) => ({
    kind: outcome.kind,
    item: deps.serializeAcuDiceGachaItem(outcome.item),
    quantity: outcome.quantity,
    duplicateConverted: outcome.duplicateConverted,
    shardGain: outcome.shardGain,
  });
  return serializeAcuDiceGachaDrawOutcome;
}
