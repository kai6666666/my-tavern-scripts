// @ts-nocheck
/**
 * relocate-db-payload-to-anchor.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRelocateDbPayloadToAnchor(deps: any) {
  const relocateDbPayloadToAnchor = async (anchorIndex: number): Promise<void> => {
    if (anchorIndex < 0) return;
    const chat = deps.getDbChatMessages();
    if (!chat || anchorIndex >= chat.length) return;
    const latestIndex = deps.findLatestDbMessageIndex(true);
    if (latestIndex < 0 || latestIndex === anchorIndex) return;

    const source = chat[latestIndex];
    const target = chat[anchorIndex];
    if (!source || !target) return;
    if (target.is_user && !deps.hasDbPayload(target)) return;

    let moved = false;

    const sourceIsolated = deps.parseIsolatedData(source.TavernDB_ACU_IsolatedData);
    if (sourceIsolated) {
      const targetIsolated = deps.parseIsolatedData(target.TavernDB_ACU_IsolatedData) || {};
      const isolationKey = deps.resolveIsolationKey(source, sourceIsolated);
      if (isolationKey !== null) {
        if (Object.prototype.hasOwnProperty.call(sourceIsolated, isolationKey)) {
          targetIsolated[isolationKey] = sourceIsolated[isolationKey];
          const nextSource = { ...sourceIsolated };
          delete nextSource[isolationKey];
          if (Object.keys(nextSource).length > 0) {
            source.TavernDB_ACU_IsolatedData = nextSource;
          } else {
            delete source.TavernDB_ACU_IsolatedData;
          }
          target.TavernDB_ACU_IsolatedData = targetIsolated;
          moved = true;
        }
      } else {
        target.TavernDB_ACU_IsolatedData = sourceIsolated;
        delete source.TavernDB_ACU_IsolatedData;
        moved = true;
      }
    }

    if (source.TavernDB_ACU_Identity !== undefined) {
      target.TavernDB_ACU_Identity = source.TavernDB_ACU_Identity;
      delete source.TavernDB_ACU_Identity;
      moved = true;
    }
    if (source.TavernDB_ACU_IndependentData !== undefined) {
      target.TavernDB_ACU_IndependentData = source.TavernDB_ACU_IndependentData;
      delete source.TavernDB_ACU_IndependentData;
      moved = true;
    }
    if (source.TavernDB_ACU_ModifiedKeys !== undefined) {
      target.TavernDB_ACU_ModifiedKeys = source.TavernDB_ACU_ModifiedKeys;
      delete source.TavernDB_ACU_ModifiedKeys;
      moved = true;
    }
    if (source.TavernDB_ACU_UpdateGroupKeys !== undefined) {
      target.TavernDB_ACU_UpdateGroupKeys = source.TavernDB_ACU_UpdateGroupKeys;
      delete source.TavernDB_ACU_UpdateGroupKeys;
      moved = true;
    }
    if (source.TavernDB_ACU_Data !== undefined) {
      target.TavernDB_ACU_Data = source.TavernDB_ACU_Data;
      delete source.TavernDB_ACU_Data;
      moved = true;
    }
    if (source.TavernDB_ACU_SummaryData !== undefined) {
      target.TavernDB_ACU_SummaryData = source.TavernDB_ACU_SummaryData;
      delete source.TavernDB_ACU_SummaryData;
      moved = true;
    }

    if (moved) {
      await triggerSlash('savechat');
    }
  };
  return relocateDbPayloadToAnchor;
}
