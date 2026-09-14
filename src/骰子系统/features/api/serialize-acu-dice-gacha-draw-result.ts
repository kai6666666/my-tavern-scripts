// @ts-nocheck
/**
 * serialize-acu-dice-gacha-draw-result.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSerializeAcuDiceGachaDrawResult(deps: any) {
  const serializeAcuDiceGachaDrawResult = (result: Awaited<ReturnType<typeof deps.performGachaDraw>>) => ({
    success: result.success === true,
    drawCount: result.drawCount,
    cost: result.cost,
    outcomes: result.outcomes.map(deps.serializeAcuDiceGachaDrawOutcome),
    state: deps.buildAcuDiceGachaStateSnapshot(result.state),
    message: result.message,
    error: result.error || undefined,
  });
  return serializeAcuDiceGachaDrawResult;
}
