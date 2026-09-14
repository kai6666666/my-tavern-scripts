// @ts-nocheck
/**
 * delete-gacha-item-setting.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDeleteGachaItemSetting(deps: any) {
  const deleteGachaItemSetting = (itemId: string): boolean => {
    const id = String(itemId || '').trim();
    if (!id) return false;
    const record = deps.getStoredGachaItemSettings();
    if (!record.items[id]) return false;
    const nextSettings = { ...record.items };
    delete nextSettings[id];
    deps.saveGachaItemSettingsRecord(nextSettings);
    return true;
  };
  return deleteGachaItemSetting;
}
