// @ts-nocheck
/**
 * set-dice-config-backup-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createSetDiceConfigBackupValue(deps: any) {
  const setDiceConfigBackupValue = (key: string, value: unknown): void => {
    if (deps.getDiceConfigBackupKeyStrategy(key) === 'rawString') {
      localStorage.setItem(key, String(value ?? ''));
      return;
    }
    if (!Store.set(key, value)) throw new Error(`存储项 ${key} 保存失败`);
  };
  return setDiceConfigBackupValue;
}
