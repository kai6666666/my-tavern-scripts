// @ts-nocheck
/**
 * features/gacha/gacha-state.ts
 * Feature-Sliced: features/gacha 域的状态"规范化/构造"助手（DI 注入配置依赖）。
 * createDefault / normalizeShardWallet / normalizeRecentRewards。
 * 重型 normalizeGachaStateRecord 留在 index.ts（最终片）。
 */
import { createEmptyShardWallet, normalizeGachaPoolId, GACHA_ALL_POOL_TAG } from './gacha-helpers';
import { GACHA_RARITY_ORDER, type GachaRarity, type GachaPoolDefinition } from '../../entities/gacha-items';
import type { GachaState, GachaShardWallet, GachaRecentRewardRecord } from './gacha-types';

export interface GachaStateCoreDeps {
  getConfiguredGachaPoolDefinitions: () => readonly GachaPoolDefinition[];
  testDefaultFortune: number;
  recentRewardLimit: number;
}

export class GachaStateCore {
  constructor(private readonly deps: GachaStateCoreDeps) {}

  createDefault(): GachaState {
    return {
      wallet: {
        fortune: this.deps.testDefaultFortune,
        shards: createEmptyShardWallet(),
      },
      activePoolTag: '全部',
      pity: {
        rare: 0,
        legend: 0,
      },
      recentRewards: [],
      totalDraws: 0,
      inputStats: {
        totalTypedChars: 0,
        totalTypedMessages: 0,
        totalActiveMinutes: 0,
        pendingCharCarry: 0,
        pendingActiveMs: 0,
        lastActiveAt: 0,
        lastHeartbeatAt: 0,
        lastFortuneGain: 0,
        lastFortuneReason: '',
        lastFortuneDetail: '',
        lastFortuneAt: 0,
        lastSettledMessageId: '',
        totalRewardedChecks: 0,
        lastSettledCheckId: '',
      },
    };
  }

  normalizeShardWallet(rawValue: unknown): GachaShardWallet {
    const base = createEmptyShardWallet();
    if (!rawValue || typeof rawValue !== 'object') return base;
    GACHA_RARITY_ORDER.forEach(rarity => {
      const value = Number((rawValue as Record<string, unknown>)[rarity] || 0);
      base[rarity] = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
    });
    return base;
  }

  normalizeRecentRewards(rawValue: unknown): GachaRecentRewardRecord[] {
    if (!Array.isArray(rawValue)) return [];
    return rawValue
      .map(record => {
        if (!record || typeof record !== 'object') return null;
        const quality = GACHA_RARITY_ORDER.includes((record as Record<string, unknown>).quality as GachaRarity)
          ? ((record as Record<string, unknown>).quality as GachaRarity)
          : '普通';
        const rewardTarget =
          (record as Record<string, unknown>).rewardTarget === 'equipment' ? 'equipment' : 'inventory';
        const normalizedPoolTag = normalizeGachaPoolId((record as Record<string, unknown>).poolTag);
        const poolTag = this.deps.getConfiguredGachaPoolDefinitions().some(pool => pool.id === normalizedPoolTag)
          ? normalizedPoolTag
          : GACHA_ALL_POOL_TAG;
        return {
          itemId: String((record as Record<string, unknown>).itemId || ''),
          name: String((record as Record<string, unknown>).name || ''),
          quality,
          quantity: Math.max(1, Number.parseInt(String((record as Record<string, unknown>).quantity || '1'), 10) || 1),
          duplicateConverted: (record as Record<string, unknown>).duplicateConverted === true,
          shardGain: Math.max(
            0,
            Number.parseInt(String((record as Record<string, unknown>).shardGain || '0'), 10) || 0,
          ),
          poolTag,
          rewardTarget,
          createdAt: String((record as Record<string, unknown>).createdAt || '').trim(),
        } as GachaRecentRewardRecord;
      })
      .filter((record): record is GachaRecentRewardRecord => Boolean(record))
      .slice(0, this.deps.recentRewardLimit);
  }
}