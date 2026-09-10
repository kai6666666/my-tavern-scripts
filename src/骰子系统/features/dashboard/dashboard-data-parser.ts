// @ts-nocheck
/**
 * dashboard-data-parser.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

export function createDashboardDataParser(deps: any) {
  const DashboardDataParser = {
    // 根据配置查找所有匹配表
    findTables(allTables, moduleKey) {
      const config = deps.getDashboardModuleConfig(moduleKey);
      if (!config) {
        console.info(`[DICE]仪表盘查找表格: 模块"${moduleKey}"配置不存在`);
        return [];
      }

      const results = [];
      const matchedTableNames = new Set();
      for (const keyword of config.tableKeywords) {
        for (const tableName in allTables) {
          if (tableName.includes(keyword) && !matchedTableNames.has(tableName)) {
            matchedTableNames.add(tableName);
            console.info(`[DICE]仪表盘查找表格: 模块"${moduleKey}"找到表格"${tableName}" (关键词: "${keyword}")`);
            results.push({
              data: allTables[tableName],
              name: tableName,
              key: allTables[tableName].key,
              config: config,
            });
          }
        }
      }

      if (results.length === 0) {
        console.info(
          `[DICE]仪表盘查找表格: 模块"${moduleKey}"未找到匹配表格 (关键词: ${config.tableKeywords.join(', ')})`,
        );
      }
      return results;
    },

    // 根据配置查找表
    findTable(allTables, moduleKey) {
      return this.findTables(allTables, moduleKey)[0] || null;
    },

    // 根据配置查找列索引
    findColumnIndex(headers, columnKey, moduleConfig) {
      const colConfig = moduleConfig.columns[columnKey];
      if (!colConfig) return -1;

      // 先尝试关键词匹配
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').toLowerCase();
        if (colConfig.keywords.some(kw => h.includes(kw.toLowerCase()))) {
          return i;
        }
      }

      // 回退到默认索引
      return colConfig.fallbackIndex ?? -1;
    },

    // 从行中提取指定列的值
    getValue(row, headers, columnKey, moduleConfig) {
      const idx = this.findColumnIndex(headers, columnKey, moduleConfig);
      if (idx < 0 || idx >= row.length) return null;
      return row[idx];
    },

    // 获取模块的所有列索引映射
    getColumnMap(headers, moduleKey) {
      const config = deps.getDashboardModuleConfig(moduleKey);
      if (!config) return {};

      const map = {};
      for (const colKey in config.columns) {
        map[colKey] = this.findColumnIndex(headers, colKey, config);
      }
      return map;
    },

    // 解析表格数据为结构化对象数组
    parseRows(tableResult, moduleKey) {
      if (!tableResult || !tableResult.data) {
        console.info(`[DICE]仪表盘解析数据: 模块"${moduleKey}"无数据，跳过解析`);
        return [];
      }

      const { data, config } = tableResult;
      const headers = data.headers || [];
      const rows = data.rows || [];
      const colMap = this.getColumnMap(headers, moduleKey);

      const parsed = rows.map((row, idx) => {
        const obj = { _rowIndex: idx, _raw: row };
        for (const colKey in colMap) {
          const colIdx = colMap[colKey];
          obj[colKey] = colIdx >= 0 && colIdx < row.length ? row[colIdx] : null;
        }
        return obj;
      });

      console.info(`[DICE]仪表盘解析数据: 模块"${moduleKey}"解析完成，共${parsed.length}行`);
      return parsed;
    },

    // 应用过滤器（容错：当目标列不存在时返回全部数据）
    applyFilter(parsedRows, filterKey, moduleKey) {
      const config = deps.getDashboardModuleConfig(moduleKey);
      if (!config || !config.filters || !config.filters[filterKey]) return parsedRows;

      const filter = config.filters[filterKey];

      // 容错：检查过滤列是否存在（即parsedRows中是否有该字段的有效值）
      const hasFilterColumn = parsedRows.some(row => row[filter.column] !== null && row[filter.column] !== undefined);
      if (!hasFilterColumn) {
        // 过滤列不存在，返回全部数据
        return parsedRows;
      }

      return parsedRows.filter(row => {
        const value = String(row[filter.column] || '').toLowerCase();
        const matchInclude = filter.includes.some(inc => value.includes(inc.toLowerCase()));

        if (filter.excludes && filter.excludes.length > 0) {
          const excludeColumn = filter.excludeColumn || filter.column;
          const excludeValue = String(row[excludeColumn] || '').toLowerCase();
          const matchExclude = filter.excludes.some(exc => excludeValue.includes(exc.toLowerCase()));
          return matchInclude && !matchExclude;
        }

        return matchInclude;
      });
    },
  };


  return DashboardDataParser;
}
