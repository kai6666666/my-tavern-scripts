// @ts-nocheck
/**
 * has-db-payload.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasDbPayload(deps: any) {
  const hasDbPayload = (msg: DbChatMessage): boolean => {
    if (deps.hasSheetKeys(msg.TavernDB_ACU_IndependentData)) return true;
    if (deps.hasSheetKeys(msg.TavernDB_ACU_Data)) return true;
    if (deps.hasSheetKeys(msg.TavernDB_ACU_SummaryData)) return true;
    const isolated = deps.parseIsolatedData(msg.TavernDB_ACU_IsolatedData);
    if (!isolated) return false;
    return Object.values(isolated).some(tagData => {
      if (!tagData || typeof tagData !== 'object') return false;
      const data = (tagData as Record<string, unknown>).independentData;
      return deps.hasSheetKeys(data);
    });
  };
  return hasDbPayload;
}
