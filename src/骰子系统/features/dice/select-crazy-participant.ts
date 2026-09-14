// @ts-nocheck
/**
 * select-crazy-participant.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSelectCrazyParticipant(deps: any) {
  const selectCrazyParticipant = () => {
    const config = deps.getCrazyModeConfig();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    if (!rawData) return null;

    const allTables = deps.processJsonData(rawData || {});
    const playerResult = deps.getDashboardDataParser().findTable(allTables, 'player');
    const npcResult = deps.getDashboardDataParser().findTable(allTables, 'npc');

    // 构建候选列表
    const candidates = [];

    // 主角
    if (playerResult?.data?.rows?.length > 0) {
      const playerName = deps.getDisplayPlayerName() || '主角';
      const playerAttrs = deps.getFullAttributesForCharacter('<user>');
      candidates.push({
        name: playerName,
        attrs: playerAttrs,
        isPlayer: true,
        inScene: true,
        weight: config.playerWeight,
      });
    }

    // NPC
    if (npcResult) {
      const npcParsed = deps.getDashboardDataParser().parseRows(npcResult, 'npc');
      npcParsed.forEach(npc => {
        if (!npc.name) return;
        const inSceneVal = String(npc.inScene || '').toLowerCase();
        const isInScene = inSceneVal === 'true' || inSceneVal === '在场';
        const npcAttrs = deps.getFullAttributesForCharacter(npc.name);
        candidates.push({
          name: npc.name,
          attrs: npcAttrs,
          isPlayer: false,
          inScene: isInScene,
          weight: isInScene ? config.inSceneNpcWeight : config.offSceneNpcWeight,
        });
      });
    }

    if (candidates.length === 0) return null;
    return deps.weightedRandomSelect(candidates);
  };
  return selectCrazyParticipant;
}
