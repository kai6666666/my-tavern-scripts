// @ts-nocheck
/**
 * get-gacha-dice-event-detail.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CHECK_REWARD } from '../../entities/gacha-items';
export function createGetGachaDiceEventDetail(deps: any) {
  const getGachaDiceEventDetail = (event: string, payload: unknown): string => {
    const record = deps.getObjectRecord(payload);
    if (event === 'check') {
      const attrName = String(record.attrName || '检定').trim() || '检定';
      const resultText = String(record.outcomeText || (record.success ? '成功' : '失败')).trim();
      const shortResult = resultText.includes('成功')
        ? '成功'
        : resultText.includes('失败')
          ? '失败'
          : resultText || (record.success ? '成功' : '失败');
      return `检定：${attrName} ${shortResult} +${GACHA_CHECK_REWARD}`;
    }

    const winner = String(record.winner || '').trim();
    const resultText = winner === 'tie' ? '平局' : '胜负已定';
    return `对抗检定：${resultText} +${GACHA_CHECK_REWARD}`;
  };
  return getGachaDiceEventDetail;
}
