// @ts-nocheck
/**
 * features/api/ready.ts
 * Feature-Sliced: 对外 API 的就绪（onReady）机制。
 * 自己维护 ready 状态与待执行回调队列，与 monolith 解耦。
 */

export class AcuDiceReadyState {
  private ready = false;
  private callbacks: Array<() => void> = [];

  onReady(callback: () => void): void {
    if (typeof callback !== 'function') {
      console.warn('[AcuDice] onReady() 需要一个函数');
      return;
    }
    if (this.ready) {
      this.run(callback);
      return;
    }
    this.callbacks.push(callback);
  }

  markReady(): void {
    if (this.ready) return;
    this.ready = true;
    for (const callback of this.callbacks) {
      this.run(callback);
    }
    this.callbacks = [];
  }

  private run(callback: () => void): void {
    try {
      callback();
    } catch (error) {
      console.error('[AcuDice] onReady 回调出错', error);
    }
  }
}