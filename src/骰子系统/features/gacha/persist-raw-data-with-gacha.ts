// @ts-nocheck
/**
 * persist-raw-data-with-gacha.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from '../../features/gacha/gacha-types';
export function createPersistRawDataWithGacha(deps: any) {
  const persistRawDataWithGacha = async (rawData: unknown, modifiedSheetKeys?: string[], state?: GachaState | null) => {
    const safeModifiedSheetKeys = (modifiedSheetKeys || [])
      .map(key => String(key || '').trim())
      .filter(key => key.startsWith('sheet_'));
    if (safeModifiedSheetKeys.length === 0) {
      if (state) deps.assertSaveStoredGachaStateSnapshot(state);
      return;
    }
    if (!deps.hasSheetKeys(rawData)) {
      console.warn('[DICE][GACHA]跳过扭蛋状态数据库保存：当前表格数据缺少 sheet_* 工作表');
      return;
    }
    // 抽卡、拆解、碎片兑换调用方已经在保存队列内，这里直接执行底层 CRUD 保存，避免队列自等待。
    await deps.performSaveDataOnly(rawData, safeModifiedSheetKeys);
    if (state) deps.assertSaveStoredGachaStateSnapshot(state);
  };
  return persistRawDataWithGacha;
}
