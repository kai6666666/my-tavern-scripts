// @ts-nocheck
/**
 * features/gacha/gacha-types.ts
 * Feature-Sliced: features/gacha 域的纯类型模型（运行时全部被擦除，零运行时影响）。
 * 由 index.ts(app 层) 与 gacha 相关模块引用。
 */
import type { GachaPoolDefinition, GachaItemDefinition, GachaPoolTag, GachaRarity, GachaRewardTarget } from '../entities/gacha-items';

export type GachaShardWallet = Record<GachaRarity, number>;

export type GachaCatalog = {
  version: number;
  items: GachaItemDefinition[];
  updatedAt: number;
};

export type GachaCatalogRecord = GachaCatalog & {
  scopeKey: string;
};

export type GachaCatalogCache = {
  scopeKey: string;
  catalog: GachaCatalog;
};

export type GachaCatalogLoadTask = {
  scopeKey: string;
  promise: Promise<GachaCatalog>;
};

export type GachaCatalogImportMode = 'overwrite' | 'skip' | 'rename';

export type NormalizedGachaCatalogItem = GachaItemDefinition & {
  generatedId: boolean;
};

export type GachaCatalogImportAnalysis = {
  items: NormalizedGachaCatalogItem[];
  pools: GachaPoolDefinition[];
  skipped: number;
  errors: string[];
  conflictIds: string[];
};

export type GachaCatalogImportStats = {
  added: number;
  updated: number;
  renamed: number;
  skipped: number;
  warnings: string[];
};

export type GachaSettingsItemSourceFilter = 'all' | 'custom' | 'builtin';
export type GachaSettingsItemStatusFilter = 'all' | 'enabled' | 'disabled';
export type GachaSettingsItemSortMode =
  | 'default'
  | 'nameAsc'
  | 'nameDesc'
  | 'createdDesc'
  | 'createdAsc'
  | 'qualityDesc'
  | 'weightDesc';

export type GachaSettingsItemFilterState = {
  search: string;
  source: GachaSettingsItemSourceFilter;
  status: GachaSettingsItemStatusFilter;
  sort: GachaSettingsItemSortMode;
};

export type GachaSettingsFilterField = 'source' | 'status' | 'sort';

export type GachaSettingsFilterOption<T extends string> = {
  readonly value: T;
  readonly label: string;
  readonly iconClass: string;
};

export type NormalizedImportedGachaPools = {
  pools: GachaPoolDefinition[];
  tagAliases: Record<string, GachaPoolTag>;
};

export type GachaPoolSettingsRecord = {
  version: number;
  pools: GachaPoolDefinition[];
  updatedAt: number;
};

export type GachaItemSettingsEntry = {
  enabled: boolean;
  order: number;
};

export type GachaItemSettingsRecord = {
  version: number;
  items: Record<string, GachaItemSettingsEntry>;
  updatedAt: number;
};

export type GachaPityState = {
  rare: number;
  legend: number;
};

export type GachaRecentRewardRecord = {
  itemId: string;
  name: string;
  quality: GachaRarity;
  quantity: number;
  duplicateConverted: boolean;
  shardGain: number;
  poolTag: GachaPoolTag;
  rewardTarget: GachaRewardTarget;
  createdAt: string;
};

export type GachaInputStats = {
  totalTypedChars: number;
  totalTypedMessages: number;
  totalActiveMinutes: number;
  pendingCharCarry: number;
  pendingActiveMs: number;
  lastActiveAt: number;
  lastHeartbeatAt: number;
  lastFortuneGain: number;
  lastFortuneReason: string;
  lastFortuneDetail: string;
  lastFortuneAt: number;
  lastSettledMessageId: string;
  totalRewardedChecks: number;
  lastSettledCheckId: string;
};

export type GachaState = {
  wallet: {
    fortune: number;
    shards: GachaShardWallet;
  };
  activePoolTag: GachaPoolTag;
  pity: GachaPityState;
  recentRewards: GachaRecentRewardRecord[];
  totalDraws: number;
  inputStats: GachaInputStats;
};

export type GachaFortuneProgressView = {
  fortune: number;
  charProgress: number;
  charGoal: number;
  charPercent: number;
  charNote: string;
  activePercent: number;
  activeRemainingText: string;
  activeNote: string;
  lastGainText: string;
  lastGainTime: string;
  shouldFlashActiveReward: boolean;
};

export type GachaDrawOutcome =
  | {
      kind: 'item';
      item: GachaItemDefinition;
      quantity: number;
      duplicateConverted: boolean;
      shardGain: number;
    }
  | {
      kind: 'shards';
      item: GachaItemDefinition;
      quantity: number;
      duplicateConverted: true;
      shardGain: number;
    };