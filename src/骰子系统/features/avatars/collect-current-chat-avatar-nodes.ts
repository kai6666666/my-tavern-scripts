// @ts-nocheck
/**
 * collect-current-chat-avatar-nodes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { findNameColumnIndex } from '../../entities/name-alias';
export function createCollectCurrentChatAvatarNodes(deps: any) {
  const collectCurrentChatAvatarNodes = (allTables: Record<string, RelationGraphTableInput>): AvatarManagerNode[] => {
    const npcListData = deps.getDashboardNpcListData(allTables);
    const playerResult = deps.DashboardDataParser.findTable(allTables, 'player');
    const nodeArr: AvatarManagerNode[] = [];

    if (playerResult?.data?.rows?.[0]) {
      const playerNameIdx = findNameColumnIndex(playerResult.data.headers || []);
      const playerName = playerResult.data.rows[0][playerNameIdx];
      if (playerName && typeof playerName === 'string' && playerName.trim()) {
        nodeArr.push({ name: playerName.trim(), isPlayer: true });
      }
    }

    npcListData.entries.forEach(npc => {
      const npcName = String(npc.name || '').trim();
      if (npcName) {
        nodeArr.push({ name: npcName, isPlayer: false, rowIndex: npc.index, tableKey: npc.tableKey });
      }
    });

    return nodeArr;
  };
  return collectCurrentChatAvatarNodes;
}
