// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-candidates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerCandidates(deps: any) {
  const getCustomTableNameIconManagerCandidates = (): CustomTableNameIconManagerCandidate[] => {
    const candidateMap = new Map<string, CustomTableNameIconManagerCandidate>();
    const addCandidate = (candidate: CustomTableNameIconManagerCandidate | null): void => {
      if (!candidate || candidateMap.has(candidate.key)) return;
      candidateMap.set(candidate.key, candidate);
    };

    const sheets = deps.getCustomTableNameIconManagerRawSheets();
    sheets.forEach(sheet => {
      const headers = sheet.content[0] || [];
      const rows = sheet.content.slice(1);
      const dashboardContextInfo = deps.resolveDashboardCustomTableNameIconContextInfo(sheet.name);
      const directSection = deps.resolveCustomTableNameIconManagerDirectSection(sheet.name);
      const directModuleId = directSection
        ? deps.CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION[directSection]
        : undefined;
      if (!dashboardContextInfo && !directModuleId) {
        rows.forEach((row, rowIndex) => {
          const name = deps.resolveCustomTableNameIconRowName(sheet.name, headers, row, rowIndex);
          addCandidate(
            deps.createCustomTableNameIconManagerCandidate(
              { moduleId: 'table-name', tableName: sheet.name, section: 'table', name },
              sheet.key,
              'direct',
            ),
          );
        });
      }
      if (dashboardContextInfo) {
        rows.forEach((row, rowIndex) => {
          const name = deps.resolveCustomTableNameIconRowName(sheet.name, headers, row, rowIndex);
          addCandidate(
            deps.createCustomTableNameIconManagerCandidate(
              { ...dashboardContextInfo, tableName: sheet.name, name },
              sheet.key,
              'direct',
            ),
          );
        });
      }
      if (directSection && directModuleId) {
        rows.forEach((row, rowIndex) => {
          const name = deps.resolveGlobalInteractionRowTitle(headers, row, rowIndex);
          addCandidate(
            deps.createCustomTableNameIconManagerCandidate(
              { moduleId: directModuleId, tableName: sheet.name, section: directSection, name },
              sheet.key,
              'direct',
            ),
          );
        });
      }
    });

    const rawData = deps.getTableData({ silent: true }) as unknown;
    deps.buildGlobalInteractionGroups(rawData).forEach(group => {
      const meta = deps.resolveGlobalInteractionSectionMeta(group.tableName);
      const section = meta.kind as CustomTableNameIconSection;
      const moduleId: CustomTableNameIconModuleId =
        section === 'map' ? 'global-interaction-map-marker' : 'global-interaction-panel';
      group.rows.forEach(row => {
        addCandidate(
          deps.createCustomTableNameIconManagerCandidate(
            { moduleId, tableName: group.tableName, section, name: row.title },
            group.tableKey,
            'interaction',
          ),
        );
      });
    });

    deps.CustomTableNameIconStoreManager.getAll().forEach(entry => {
      addCandidate(deps.createCustomTableNameIconManagerCandidate(entry, 'saved', 'saved'));
    });

    return [...candidateMap.values()].sort((left, right) => {
      const moduleCompare = deps.getCustomTableNameIconManagerModuleLabel(left.context.moduleId).localeCompare(
        deps.getCustomTableNameIconManagerModuleLabel(right.context.moduleId),
        'zh-CN',
      );
      if (moduleCompare !== 0) return moduleCompare;
      const tableCompare = left.context.tableName.localeCompare(right.context.tableName, 'zh-CN');
      if (tableCompare !== 0) return tableCompare;
      return left.context.name.localeCompare(right.context.name, 'zh-CN');
    });
  };
  return getCustomTableNameIconManagerCandidates;
}
