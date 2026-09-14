// @ts-nocheck
/**
 * normalize-shard-wallet.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaShardWallet } from './gacha-types';
export function createNormalizeShardWallet(deps: any) {
  const normalizeShardWallet = (rawValue: unknown): GachaShardWallet => deps.getGachaStateCore().normalizeShardWallet(rawValue);
  return normalizeShardWallet;
}
