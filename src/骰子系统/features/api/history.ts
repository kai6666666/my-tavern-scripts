// @ts-nocheck
/**
 * features/api/history.ts
 * Feature-Sliced: 对外 API 的历史记录读取（getLatestCheck/getLatestContest/getHistory）。
 * 通过 DI 注入检查/对抗历史数组读取函数，与 monolith 存储解耦。
 */

export interface AcuDiceHistoryDeps {
  getCheckHistory: () => unknown[];
  getContestHistory: () => unknown[];
}

export class AcuDiceHistory {
  constructor(private readonly deps: AcuDiceHistoryDeps) {}

  getLatestCheck(): (Record<string, unknown> & { timestamp: number }) | null {
    const h = this.deps.getCheckHistory();
    return h.length > 0 ? (h[h.length - 1] as Record<string, unknown> & { timestamp: number }) : null;
  }

  getLatestContest(): (Record<string, unknown> & { timestamp: number }) | null {
    const h = this.deps.getContestHistory();
    return h.length > 0 ? (h[h.length - 1] as Record<string, unknown> & { timestamp: number }) : null;
  }

  getHistory(options?: { limit?: number; type?: 'check' | 'contest' }): Array<Record<string, unknown>> {
    const limit = options?.limit;
    const type = options?.type;

    let results: Array<Record<string, unknown>> = [];

    if (!type || type === 'check') {
      results = results.concat(this.deps.getCheckHistory().map(item => ({ ...(item as object), _type: 'check' } as Record<string, unknown>)));
    }
    if (!type || type === 'contest') {
      results = results.concat(this.deps.getContestHistory().map(item => ({ ...(item as object), _type: 'contest' } as Record<string, unknown>)));
    }

    results.sort((a, b) => (b as { timestamp: number }).timestamp - (a as { timestamp: number }).timestamp);

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  }
}