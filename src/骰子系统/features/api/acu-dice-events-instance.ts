// @ts-nocheck
/**
 * acu-dice-events-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceEvents } from './events';
export function createAcuDiceEventsInstance(deps: any) {
  const acuDiceEvents = new AcuDiceEvents({
    onDiceEvent: (event: string, data: unknown): void => {
      if (event === 'check' || event === 'contest') {
        void deps.getDiceHistoryStatsDB().recordEvent(event, data);
        void deps.settleGachaFortuneForDiceEvent(event, data);
      }
    },
  });
  return acuDiceEvents;
}
