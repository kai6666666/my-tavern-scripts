// @ts-nocheck
/**
 * build-gacha-dice-event-settlement-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGachaDiceEventSettlementKey(deps: any) {
  const buildGachaDiceEventSettlementKey = (event: string, payload: unknown): string => {
    const record = deps.getObjectRecord(payload);
    const detailId = String(record.detailId || '').trim();
    if (detailId) return `${event}:detail:${detailId}`;

    const timestamp = String(record.timestamp || Date.now()).trim();
    if (event === 'check') {
      return [
        event,
        timestamp,
        String(record.attrName || '').trim(),
        String(record.formula || '').trim(),
        String(record.total || '').trim(),
        String(record.target || '').trim(),
      ].join(':');
    }

    const left = deps.getObjectRecord(record.left);
    const right = deps.getObjectRecord(record.right);
    return [
      event,
      timestamp,
      String(left.attribute || '').trim(),
      String(right.attribute || '').trim(),
      String(left.roll || '').trim(),
      String(right.roll || '').trim(),
      String(record.winner || '').trim(),
    ].join(':');
  };
  return buildGachaDiceEventSettlementKey;
}
