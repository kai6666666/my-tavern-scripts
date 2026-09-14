// @ts-nocheck
/**
 * features/gacha/gacha-helpers.ts
 * Feature-Sliced: features/gacha 域的纯运行时助手与常量。
 * 全部为纯函数/纯值（无闭包、无外部可变状态），仅服务于 gacha 子系统。
 */
import { GACHA_RARITY_ORDER, type GachaRarity, type GachaRewardTarget, type GachaPoolTag } from '../../entities/gacha-items';
import type { GachaState, GachaShardWallet } from './gacha-types';

export const createEmptyShardWallet = (): GachaShardWallet =>
  GACHA_RARITY_ORDER.reduce((acc, rarity) => {
    acc[rarity] = 0;
    return acc;
  }, {} as GachaShardWallet);

export const GACHA_DUPLICATE_REROLL_LIMIT = 8;
export const GACHA_PICKUP_WEIGHT_MULTIPLIER = 10;
export const GACHA_PICKUP_CHAT_DEPTH_BUCKET = 30;
export const GACHA_PICKUP_RARITIES: GachaRarity[] = ['史诗', '传说', '神话'];
export const GACHA_PICKUP_FALLBACK_LIMIT = 3;
export const GACHA_ALL_POOL_TAG: GachaPoolTag = '全部';
export const GACHA_CUSTOM_ONLY_POOL_TAG: GachaPoolTag = '自定义';
export const GACHA_REWARD_FIELD_LIMITS: Record<GachaRewardTarget, { name: number; description: number }> = {
  inventory: { name: 10, description: 60 },
  equipment: { name: 12, description: 40 },
};

export const normalizeGachaPoolId = (value: unknown): GachaPoolTag =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 40);

export const normalizeGachaPoolName = (value: unknown, fallback: GachaPoolTag): string =>
  String(value ?? fallback)
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 40) || fallback;

export const cloneGachaState = (state: GachaState): GachaState => JSON.parse(JSON.stringify(state)) as GachaState;

export const getGachaStateBalanceScore = (state: GachaState): number =>
  state.wallet.fortune +
  GACHA_RARITY_ORDER.reduce((sum, rarity) => sum + Math.max(0, Number(state.wallet.shards[rarity] || 0)), 0) +
  state.totalDraws +
  state.pity.rare +
  state.pity.legend;

export const mergeLegacyGachaStateForLocalStorage = (localState: GachaState, legacyState: GachaState): GachaState =>
  getGachaStateBalanceScore(legacyState) > getGachaStateBalanceScore(localState)
    ? cloneGachaState(legacyState)
    : cloneGachaState(localState);
