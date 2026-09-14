// @ts-nocheck
/**
 * features/gacha/gacha-store.ts
 * Feature-Sliced: features/gacha 域的状态持久化层（DI 注入外部依赖）。
 * 依赖最小：仅注入 store（全局 storage）、getCurrentContextFingerprint、storageKeyBase。
 * 重型的状态规范化（normalize/createDefault）留在 index.ts，后续再切。
 */
import { cloneGachaState } from './gacha-helpers';
import type { GachaState } from './gacha-types';

export interface GachaStoreDeps {
  store: {
    get(key: string, def: unknown): unknown;
    set(key: string, val: unknown): boolean;
  };
  getCurrentContextFingerprint: () => string | undefined;
  storageKeyBase: string;
}

export class GachaStore {
  constructor(private readonly deps: GachaStoreDeps) {}

  getStorageKey(): string {
    const contextId = String(this.deps.getCurrentContextFingerprint() || 'unknown_context').trim() || 'unknown_context';
    return `${this.deps.storageKeyBase}_${contextId}`;
  }

  getMigrationKey(): string {
    return `${this.getStorageKey()}_legacy_migrated`;
  }

  hasMigrated(): boolean {
    return this.deps.store.get(this.getMigrationKey(), false) === true;
  }

  markMigrated(): void {
    this.deps.store.set(this.getMigrationKey(), true);
  }

  load(): Record<string, unknown> | null {
    const scoped = this.deps.store.get(this.getStorageKey(), null);
    if (scoped && typeof scoped === 'object') return scoped as Record<string, unknown>;
    const legacy = this.deps.store.get(this.deps.storageKeyBase, null);
    return legacy && typeof legacy === 'object' ? (legacy as Record<string, unknown>) : null;
  }

  save(state: GachaState): boolean {
    const saved = this.deps.store.set(this.getStorageKey(), cloneGachaState(state));
    if (!saved) {
      console.error('[DICE][GACHA]骰子商店状态保存失败');
      return false;
    }
    try {
      localStorage.removeItem(this.deps.storageKeyBase);
    } catch (error) {
      console.warn('[DICE][GACHA]清理旧版骰运缓存失败:', error);
    }
    return true;
  }

  assertSave(state: GachaState): void {
    if (!this.save(state)) throw new Error('骰子商店状态保存失败');
  }
}