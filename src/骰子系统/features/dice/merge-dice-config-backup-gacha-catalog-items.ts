// @ts-nocheck
/**
 * merge-dice-config-backup-gacha-catalog-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMergeDiceConfigBackupGachaCatalogItems(deps: any) {
  const mergeDiceConfigBackupGachaCatalogItems = (
    currentItems: readonly GachaItemDefinition[],
    incomingItems: readonly GachaItemDefinition[],
    stats: DiceConfigBackupApplyStats,
    itemIdMap?: Map<string, string>,
  ): GachaItemDefinition[] => {
    const result = deps.cloneGachaCatalogItems(currentItems);
    const indexById = new Map<string, number>();
    const indexByName = new Map<string, number>();
    result.forEach((item, index) => {
      const id = String(item.id || '').trim();
      const nameKey = deps.getDiceConfigBackupGachaItemNameKey(item);
      if (id) indexById.set(id, index);
      if (nameKey && !indexByName.has(nameKey)) indexByName.set(nameKey, index);
    });

    incomingItems.forEach(item => {
      const imported = deps.cloneDiceConfigBackupValue(item);
      const id = String(imported.id || '').trim();
      const nameKey = deps.getDiceConfigBackupGachaItemNameKey(imported);
      const idIndex = id ? indexById.get(id) : undefined;
      const targetIndex = idIndex ?? (nameKey ? indexByName.get(nameKey) : undefined);
      if (targetIndex !== undefined) {
        const existing = result[targetIndex];
        const targetId = existing.id || id;
        result[targetIndex] = {
          ...existing,
          ...imported,
          id: targetId,
          createdAt: existing.createdAt || imported.createdAt,
          updatedAt: imported.updatedAt || Date.now(),
        };
        if (id && targetId && id !== targetId) itemIdMap?.set(id, targetId);
        stats.overwritten += 1;
        return;
      }
      result.push({
        ...imported,
        id,
        createdAt: imported.createdAt || Date.now(),
        updatedAt: imported.updatedAt || Date.now(),
      });
      const nextIndex = result.length - 1;
      if (id) indexById.set(id, nextIndex);
      if (nameKey) indexByName.set(nameKey, nextIndex);
      stats.added += 1;
    });

    return result;
  };
  return mergeDiceConfigBackupGachaCatalogItems;
}
