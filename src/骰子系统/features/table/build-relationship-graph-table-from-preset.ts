// @ts-nocheck
/**
 * build-relationship-graph-table-from-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { findNameColumnIndex } from '../../entities/name-alias';
export function createBuildRelationshipGraphTableFromPreset(deps: any) {
  const buildRelationshipGraphTableFromPreset = (
    allTables: Record<string, RelationGraphTableInput>,
    sources: DashboardRelationshipGraphSourceConfig[],
    options: RelationshipGraphBuildOptions = {},
  ): RelationGraphTableInput | null => {
    const rows: RelationGraphRow[] = [];
    const headers: RelationGraphCell[] = ['row_id', '姓名', '人际关系', '在场状态'];
    const usedSources: string[] = [];
    const matchedTableKeys = new Set<string>();
    const targetTableName = String(options.tableName || '').trim();

    sources.forEach((source, sourceIndex) => {
      const sourceTableResults = deps.findRelationshipGraphSourceTables(allTables, source.tableKeywords);
      if (sourceTableResults.length === 0) {
        console.info(
          deps.withTableTemplateCheckHint(
            `[DICE]人物关系图预设: 来源${sourceIndex + 1}未找到表格 (关键词: ${source.tableKeywords.join(', ')})`,
          ),
        );
        return;
      }

      const tableResults = targetTableName
        ? sourceTableResults.filter(tableResult => tableResult.tableName === targetTableName)
        : sourceTableResults;

      tableResults.forEach(tableResult => {
        const sourceHeaders = (tableResult.table.headers || []).map(header => String(header || ''));
        const configuredNameIdx = deps.findRelationGraphColumnIndex(sourceHeaders, source.nameColumn);
        const nameIdx = configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(sourceHeaders, -1);
        const relationColumnMatch = deps.findRelationGraphRelationColumnMatch(sourceHeaders, source.relationColumn);
        const relationIdx = relationColumnMatch.index;
        if (nameIdx < 0 || relationIdx < 0) {
          console.warn(
            deps.withTableTemplateCheckHint(
              `[DICE]人物关系图预设: 表格"${tableResult.tableName}"缺少名称列或关系列 (名称关键词: ${source.nameColumn.join(', ')}; 关系关键词: ${source.relationColumn.join(', ')})`,
            ),
          );
          return;
        }

        const inSceneIdx = sourceHeaders.findIndex(header => header.includes('在场'));
        const sourceRows = tableResult.table.rows || [];
        sourceRows.forEach((row, rowIndex) => {
          const name = String(row[nameIdx] || '').trim();
          const relationValue = String(row[relationIdx] || '').trim();
          if (!name || !relationValue) return;

          const relationText =
            source.mode === 'fixedTarget' && relationColumnMatch.isConfigured
              ? `${source.target && source.target !== 'player' ? source.target : deps.USER_NODE_KEY}:${relationValue}`
              : relationValue;

          rows.push([row[0] ?? rowIndex + 1, name, relationText, inSceneIdx >= 0 ? row[inSceneIdx] : '']);
        });
        if (tableResult.table.key) matchedTableKeys.add(tableResult.table.key);
        usedSources.push(`${tableResult.tableName}.${sourceHeaders[relationIdx] || '关系列'}`);
      });
    });

    if (rows.length === 0) {
      console.warn('[DICE]人物关系图预设: 未从配置来源中解析到关系数据');
      return null;
    }

    console.info(`[DICE]人物关系图预设: 已合并来源 ${usedSources.join('、')}，共${rows.length}行`);
    return {
      headers,
      rows,
      key: matchedTableKeys.size === 1 ? Array.from(matchedTableKeys)[0] : '',
    };
  };
  return buildRelationshipGraphTableFromPreset;
}
