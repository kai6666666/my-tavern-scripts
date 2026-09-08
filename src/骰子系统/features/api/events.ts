// @ts-nocheck
/**
 * features/api/events.ts
 * Feature-Sliced: 对外 API 的事件总线（on/off/emit）。
 * 通过 DI 注入 dice 事件副作用钩子（DiceHistoryStatsDB.recordEvent + gacha 骰运结算），
 * 使事件分发逻辑与 monolith 解耦。
 */

export interface AcuDiceEventsDeps {
  /** check/contest 事件触发时的副作用钩子（由 app 层注入） */
  onDiceEvent?: (event: string, data: unknown) => void;
}

export class AcuDiceEvents {
  private handlers: Map<string, Set<Function>> = new Map();
  private onDiceEvent?: (event: string, data: unknown) => void;

  constructor(deps?: AcuDiceEventsDeps) {
    this.onDiceEvent = deps?.onDiceEvent;
  }

  on(event: string, handler: Function): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(event: string, data: unknown): void {
    this.onDiceEvent?.(event, data);
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error('[AcuDice] Event handler error:', e);
        }
      });
    }
  }
}