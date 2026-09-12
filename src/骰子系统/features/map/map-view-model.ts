// @ts-nocheck
/**
 * map-view-model.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDisplayName } from '../../entities/name-alias';
export function createBuildMapViewModel(deps: any) {
  const buildMapViewModel = async () => {
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const allTables = deps.processJsonData(rawData || {});
    deps.NameAliasRegistry.rebuild(allTables);
    if (!rawData || Object.keys(allTables).length === 0) return null;

    const globalResult = deps.DashboardDataParser.findTable(allTables, 'global');
    const locationResult = deps.DashboardDataParser.findTable(allTables, 'location');
    const npcResult = deps.DashboardDataParser.findTable(allTables, 'npc');
    const playerResult = deps.DashboardDataParser.findTable(allTables, 'player');
    const elementResult = (() => {
      const keywords = ['地图元素', '元素表', '地图要素', '机关', '线索'];
      for (const tableName in allTables) {
        if (keywords.some(keyword => tableName.includes(keyword))) {
          return {
            data: allTables[tableName],
            name: tableName,
            key: allTables[tableName].key,
          };
        }
      }
      return null;
    })();

    const globalHeaders = globalResult?.data?.headers || [];
    const globalRows = globalResult?.data?.rows || [];
    const globalRow = globalRows[0] || [];
    const globalConfig = globalResult?.config || deps.getDashboardModuleConfig('global') || deps.DASHBOARD_TABLE_CONFIG.global;
    const detailIdx = deps.DashboardDataParser.findColumnIndex(globalHeaders, 'detailLocation', globalConfig);
    const regionIdx = deps.DashboardDataParser.findColumnIndex(globalHeaders, 'currentLocation', globalConfig);
    const detailLocation = detailIdx >= 0 ? String(globalRow[detailIdx] || '').trim() : '';
    const currentRegion = regionIdx >= 0 ? String(globalRow[regionIdx] || '').trim() : '';

    if (!locationResult?.data) return null;

    const findColumnIndex = (headers, keywords, fallbackIndex = null) => {
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').toLowerCase();
        if (keywords.some(keyword => h.includes(keyword.toLowerCase()))) return i;
      }
      return fallbackIndex ?? -1;
    };

    const locations = new Map();
    const locationHeaders = locationResult.data.headers || [];
    const locationRows = locationResult.data.rows || [];
    const locationConfig =
      locationResult.config || deps.getDashboardModuleConfig('location') || deps.DASHBOARD_TABLE_CONFIG.location;
    const locationNameIdx = deps.DashboardDataParser.findColumnIndex(locationHeaders, 'name', locationConfig);
    const locationRegionIdx = findColumnIndex(locationHeaders, ['次要地区', '次要区域', '区域', '地区'], null);
    const locationTypeIdx = findColumnIndex(locationHeaders, ['地点类型', '地点类别', '类型'], null);
    const locationDescIdx = deps.DashboardDataParser.findColumnIndex(locationHeaders, 'description', locationConfig);
    const locationImportanceIdx = findColumnIndex(locationHeaders, ['重要度', '重要性'], null);
    const locationExploreIdx = findColumnIndex(locationHeaders, ['探索状态', '探索进度', '状态'], null);

    // 先收集所有地点名，用于批量emoji分配（去重）
    const allLocationNames: string[] = [];
    locationRows.forEach(row => {
      const name = String(row[locationNameIdx] || '')
        .trim()
        .replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (name) allLocationNames.push(name);
    });
    const emojiMap = deps.resolveBatchLocationEmojis(allLocationNames);

    locationRows.forEach((row, idx) => {
      const name = String(row[locationNameIdx] || '')
        .trim()
        .replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (!name) return;
      const region = locationRegionIdx >= 0 ? String(row[locationRegionIdx] || '').trim() : '';

      const location = {
        name,
        region,
        locationType: locationTypeIdx >= 0 ? row[locationTypeIdx] || '' : '',
        description: locationDescIdx >= 0 ? row[locationDescIdx] || '' : '',
        importance: locationImportanceIdx >= 0 ? row[locationImportanceIdx] || '' : '',
        exploreStatus: locationExploreIdx >= 0 ? row[locationExploreIdx] || '' : '',
        emoji: emojiMap.get(name) ?? null,
        tableName: locationResult.name || '',
        tableKey: locationResult.key || '',
        rowIndex: idx,
      };
      locations.set(name, location);
    });

    const elements = new Map();
    const addElement = (locationName, element) => {
      if (!elements.has(locationName)) {
        elements.set(locationName, []);
      }
      elements.get(locationName).push(element);
    };

    if (elementResult?.data) {
      const elementHeaders = elementResult.data.headers || [];
      const elementRows = elementResult.data.rows || [];
      const elementNameIdx = findColumnIndex(elementHeaders, ['元素名称', '名称', '元素名'], 1);
      const elementTypeIdx = findColumnIndex(elementHeaders, ['元素类型', '类型', '元素分类'], 2);
      const elementLocationIdx = findColumnIndex(elementHeaders, ['所在地点', '位置', '地点'], 3);
      const elementDescIdx = findColumnIndex(elementHeaders, ['元素描述', '描述', '说明'], null);
      const elementStatusIdx = findColumnIndex(elementHeaders, ['状态', '交互状态'], null);
      const elementInteractIdx = findColumnIndex(elementHeaders, ['交互选项', '交互', '互动', '可交互'], null);

      elementRows.forEach((row, idx) => {
        const name = String(row[elementNameIdx] || '').trim();
        if (!name) return;
        const locationName = String(row[elementLocationIdx] || '').trim();
        if (!locationName) return;
        if (currentRegion && locations.size > 0 && !locations.has(locationName)) return;

        const rawInteractions = elementInteractIdx >= 0 ? row[elementInteractIdx] : '';
        const interactions = String(rawInteractions || '')
          .split(/[,，、;；]/)
          .map(item => item.trim())
          .filter(Boolean);
        const typeValue = elementTypeIdx >= 0 ? row[elementTypeIdx] || '' : '';
        const element = {
          name,
          type: typeValue,
          location: locationName,
          description: elementDescIdx >= 0 ? row[elementDescIdx] || '' : '',
          status: elementStatusIdx >= 0 ? row[elementStatusIdx] || '' : '',
          interactions,
          emoji: deps.getElementEmoji(name, typeValue),
          tableName: elementResult.name || '',
          tableKey: elementResult.key || '',
          rowIndex: idx,
        };
        addElement(locationName, element);
      });
    }

    const characters = new Map();
    const resolveMapAvatarLookupName = (name: unknown): string => {
      const rawName = String(name || '').trim();
      if (!rawName) return '';
      return deps.resolveUserGraphName(deps.NameAliasRegistry.resolve(rawName));
    };

    const addCharacter = async character => {
      const avatarLookupName = resolveMapAvatarLookupName(character.name) || character.name;
      const avatarUrl = await deps.AvatarManager.getAsync(avatarLookupName);
      const full = {
        ...character,
        avatarLookupName,
        avatarUrl,
        avatarOffsetX: deps.AvatarManager.getOffsetX(avatarLookupName),
        avatarOffsetY: deps.AvatarManager.getOffsetY(avatarLookupName),
        avatarScale: deps.AvatarManager.getScale(avatarLookupName),
      };
      if (!characters.has(full.location)) {
        characters.set(full.location, []);
      }
      characters.get(full.location).push(full);
    };

    let playerLocation = '';

    if (playerResult?.data) {
      const playerConfig = playerResult.config || deps.getDashboardModuleConfig('player') || deps.DASHBOARD_TABLE_CONFIG.player;
      const playerHeaders = playerResult.data.headers || [];
      const playerRows = playerResult.data.rows || [];
      const playerRow = playerRows[0] || [];
      const playerNameIdx = deps.DashboardDataParser.findColumnIndex(playerHeaders, 'name', playerConfig);
      const playerPosIdx = deps.DashboardDataParser.findColumnIndex(playerHeaders, 'position', playerConfig);
      const playerNameRaw = playerNameIdx >= 0 ? playerRow[playerNameIdx] : deps.getPlayerName();
      const playerPosRaw = playerPosIdx >= 0 ? playerRow[playerPosIdx] : '';
      const playerName = getDisplayName(String(playerNameRaw || '').trim());
      playerLocation = String(playerPosRaw || '').trim();

      if (!playerLocation && detailLocation) {
        playerLocation = detailLocation;
      }

      if (playerName && playerLocation) {
        await addCharacter({
          name: playerName,
          location: playerLocation,
          isPlayer: true,
          isInScene: true,
          tableKey: playerResult.key || '',
          rowIndex: 0,
        });
      }
    }

    if (npcResult?.data) {
      const npcConfig = npcResult.config || deps.getDashboardModuleConfig('npc') || deps.DASHBOARD_TABLE_CONFIG.npc;
      const npcHeaders = npcResult.data.headers || [];
      const npcRows = npcResult.data.rows || [];
      const npcNameIdx = deps.DashboardDataParser.findColumnIndex(npcHeaders, 'name', npcConfig);
      const npcPosIdx = deps.DashboardDataParser.findColumnIndex(npcHeaders, 'position', npcConfig);
      const npcInSceneIdx = deps.DashboardDataParser.findColumnIndex(npcHeaders, 'inScene', npcConfig);

      for (let idx = 0; idx < npcRows.length; idx++) {
        const row = npcRows[idx];
        const npcName = getDisplayName(String(row[npcNameIdx] || '').trim());
        if (!npcName) continue;
        const locationName = String(row[npcPosIdx] || '').trim();
        if (!locationName) continue;
        if (currentRegion && locations.size > 0 && !locations.has(locationName)) continue;
        const inSceneValue = npcInSceneIdx >= 0 ? row[npcInSceneIdx] : '';
        const inSceneHeader = npcHeaders[npcInSceneIdx] || '';
        const isInScene = deps.parseInSceneStatus(inSceneValue, inSceneHeader);

        await addCharacter({
          name: npcName,
          location: locationName,
          isPlayer: false,
          isInScene,
          tableKey: npcResult.key || '',
          rowIndex: idx,
        });
      }
    }

    const locationIterator = locations.values();
    const firstLocation = locationIterator.next().value;

    const allRegions = [...new Set(Array.from(locations.values()).map(l => l.region || '其他'))].sort();
    // 确保"其他"标签页始终在最后
    const otherIndex = allRegions.indexOf('其他');
    if (otherIndex > -1) {
      allRegions.splice(otherIndex, 1);
      allRegions.push('其他');
    }

    const getHotLocationsInRegion = region => {
      const regionName = region || '其他';
      return Array.from(locations.values())
        .filter(l => (l.region || '其他') === regionName)
        .sort((a, b) => {
          const scoreA = (characters.get(a.name)?.length || 0) + (elements.get(a.name)?.length || 0);
          const scoreB = (characters.get(b.name)?.length || 0) + (elements.get(b.name)?.length || 0);
          return scoreB - scoreA;
        });
    };

    const focusLocation = (() => {
      if (detailLocation && locations.has(detailLocation)) return detailLocation;
      if (playerLocation && locations.has(playerLocation)) return playerLocation;
      const fallbackRegion = allRegions[0];
      if (fallbackRegion) {
        const regionLocations = getHotLocationsInRegion(fallbackRegion);
        if (regionLocations.length > 0) return regionLocations[0].name;
      }
      return firstLocation ? firstLocation.name : '';
    })();

    return {
      currentRegion: currentRegion || locations.get(playerLocation)?.region || '其他',
      detailLocation,
      focusLocation,
      playerLocation,
      locations,
      elements,
      characters,
      allRegions,
    };
  };
  return buildMapViewModel;
}
