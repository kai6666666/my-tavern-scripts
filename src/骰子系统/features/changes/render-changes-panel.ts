// @ts-nocheck
/**
 * render-changes-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createRenderChangesPanel(deps: any) {
  const renderChangesPanel = rawData => {
    const snapshot = deps.loadSnapshot();
    const config = deps.getConfig();

    // 运行数据验证
    const validationErrors = rawData ? deps.ValidationEngine.validateAllData(rawData) : [];

    if (!snapshot || !rawData) {
      // 即使没有快照，如果有验证错误也显示
      if (validationErrors.length === 0) {
        return `
                <div class="acu-panel-header">
                    <div class="acu-panel-title">
                        <div class="acu-title-main"><i class="fa-solid fa-code-compare"></i> <span class="acu-title-text">更新审核</span></div>
                        <div class="acu-title-sub">对比上次保存的快照</div>
                    </div>
                    <div class="acu-header-actions">
                        ${deps.getTutorialButtonHtml('changes', '查看审核面板教程')}
                        <button class="acu-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <div class="acu-panel-content acu-changes-content" style="display:flex;align-items:center;justify-content:center;">
                    <div class="acu-empty-hint">暂无快照数据</div>
                </div>`;
      }
    }

    // 收集所有变更
    const changes = [];
    const matchedSnapshotKeys = new Set<string>();

    for (const sheetId in rawData) {
      if (!sheetId.startsWith('sheet_')) continue;
      const newSheet = rawData[sheetId];
      if (!newSheet?.name || !newSheet?.content) continue;
      const snapshotEntry = deps.findDiffSnapshotEntry(snapshot, sheetId, newSheet);
      const oldSheet = snapshotEntry?.sheet;
      if (snapshotEntry) matchedSnapshotKeys.add(snapshotEntry.key);

      const tableName = newSheet.name;
      const headers = newSheet.content[0] || [];
      if (!oldSheet?.content) {
        changes.push({
          type: 'table_added',
          tableName,
          tableKey: sheetId,
        });
        continue;
      }
      if (JSON.stringify(headers) !== JSON.stringify(oldSheet.content[0] || [])) {
        changes.push({
          type: 'table_structure_changed',
          tableName,
          tableKey: sheetId,
        });
        continue;
      }
      const newRows = newSheet.content.slice(1);
      const oldRows = oldSheet.content.slice(1) || [];
      const oldHeaders = oldSheet.content[0] || headers;
      const rowMatcher = deps.createDiffRowMatcher(oldHeaders, oldRows.map(deps.normalizeDiffRow));

      newRows.forEach((row, rowIdx) => {
        const safeRow = deps.normalizeDiffRow(row);
        const matched = deps.takeDiffRowMatch(rowMatcher, headers, safeRow, rowIdx);
        const oldRow = matched?.row;
        const rowTitle = deps.getDiffRowDisplayTitle(headers, safeRow, rowIdx);

        if (!oldRow) {
          // 整行新增
          changes.push({
            type: 'row_added',
            tableName,
            tableKey: sheetId,
            rowIndex: rowIdx,
            headers,
            row: safeRow,
            title: rowTitle,
          });
        } else {
          // 检查单元格变化，收集同一行的所有修改
          const rowChanges: Array<{
            colIndex: number;
            header: string;
            oldValue: string;
            newValue: string;
          }> = [];
          safeRow.forEach((cell, colIdx) => {
            if (colIdx === 0) return; // 跳过索引列
            const oldVal = String(oldRow[colIdx] ?? '');
            const newVal = String(cell ?? '');
            if (oldVal !== newVal) {
              rowChanges.push({
                colIndex: colIdx,
                header: headers[colIdx] || `列${colIdx}`,
                oldValue: oldVal,
                newValue: newVal,
              });
            }
          });

          if (rowChanges.length === 1) {
            // 单字段修改
            const c = rowChanges[0];
            changes.push({
              type: 'cell_modified',
              tableName,
              tableKey: sheetId,
              rowIndex: rowIdx,
              colIndex: c.colIndex,
              header: c.header,
              oldValue: c.oldValue,
              newValue: c.newValue,
              rowTitle,
            });
          } else if (rowChanges.length > 1) {
            // 多字段修改，合并为一条
            changes.push({
              type: 'row_modified',
              tableName,
              tableKey: sheetId,
              rowIndex: rowIdx,
              headers,
              row: safeRow,
              oldRow,
              changedFields: rowChanges,
              rowTitle,
            });
          }
        }
      });

      oldRows.forEach((oldRow, rIdx) => {
        if (rowMatcher.usedIndices.has(rIdx)) return;
        const safeOldRow = deps.normalizeDiffRow(oldRow);
        changes.push({
          type: 'row_deleted',
          tableName,
          tableKey: sheetId,
          rowIndex: rIdx,
          headers,
          row: safeOldRow,
          title: deps.getDiffRowDisplayTitle(oldHeaders, safeOldRow, rIdx),
        });
      });
    }

    // 检测整个表被删除
    const snapshotRecord = deps.asDiffRecord(snapshot);
    if (snapshotRecord) {
      for (const sheetId in snapshotRecord) {
        if (!sheetId.startsWith('sheet_')) continue;
        if (matchedSnapshotKeys.has(sheetId) || rawData[sheetId]) continue;
        const oldSheet = snapshotRecord[sheetId];
        changes.push({
          type: 'table_deleted',
          tableName: deps.getDiffSheetIdentity(oldSheet).name || sheetId,
          tableKey: sheetId,
        });
      }
    }

    // 获取数据验证模式状态
    const isValidationMode = Store.get(deps.STORAGE_KEY_VALIDATION_MODE, false);
    const hasStructuralChanges = changes.some(
      change =>
        change.type === 'table_deleted' || change.type === 'table_added' || change.type === 'table_structure_changed',
    );

    // 根据模式渲染不同的标题和按钮
    const panelTitle = isValidationMode ? '数据验证' : '完整审核';
    const panelDeprecatedBadgeHtml = isValidationMode
      ? deps.renderDeprecatedBadge(deps.DATA_VALIDATION_DEPRECATED_META.deprecatedReason)
      : '';
    const panelIcon = isValidationMode ? 'fa-shield-halved' : 'fa-code-compare';
    const toggleTitle = isValidationMode ? '切换到完整审核模式' : '切换到数据验证模式';

    // 渲染 HTML
    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
                    <div class="acu-title-main"><i class="fa-solid ${panelIcon}"></i> <span class="acu-title-text">${panelTitle}</span>${panelDeprecatedBadgeHtml}</div>
                </div>
                <div class="acu-header-actions">
                    ${deps.getTutorialButtonHtml('changes', '查看审核面板教程')}
                    <span class="acu-changes-batch-actions">
                    ${!isValidationMode && !hasStructuralChanges ? '<button type="button" class="acu-changes-batch-btn acu-batch-accept" title="接受全部变更" aria-label="接受全部变更"><i class="fa-solid fa-check-double"></i></button>' : ''}
                    ${!hasStructuralChanges ? `<button type="button" class="acu-changes-batch-btn acu-batch-reject" title="${isValidationMode ? '全部回滚' : '拒绝全部变更'}" aria-label="${isValidationMode ? '全部回滚' : '拒绝全部变更'}"><i class="fa-solid fa-rotate-left"></i></button>` : ''}
                    <button type="button" class="acu-changes-batch-btn acu-simple-mode-toggle ${isValidationMode ? 'active' : ''}" title="${toggleTitle}" aria-label="${toggleTitle}">
                        <i class="fa-solid ${isValidationMode ? 'fa-filter-circle-xmark' : 'fa-filter'}"></i>
                    </button>
                    </span>
                    <div class="acu-height-control">
                        <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="审核面板" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                    </div>
                    <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭审核面板"><i class="fa-solid fa-times"></i></button>
                </div>
            </div>`;

    html += `<div class="acu-panel-content acu-changes-content ${config.layout === 'horizontal' ? 'acu-changes-horizontal' : ''}">`;

    // === 数据验证模式：只渲染验证错误，使用变更列表的卡片样式 ===
    if (isValidationMode) {
      if (validationErrors.length === 0) {
        html += `<div class="acu-empty-hint" style="padding:40px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <i class="fa-solid fa-check-circle" style="font-size:32px;color:var(--acu-success-text);margin-bottom:10px;display:block;"></i>
                数据验证通过，无违规项
            </div>`;
      } else {
        // 使用变更列表的卡片样式渲染验证错误
        const groupedErrors = deps.ValidationEngine.groupErrorsByTable(validationErrors);
        const collapsedGroups = Store.get('acu_validation_collapsed_groups', []);

        html += `<div class="acu-changes-list">`;

        for (const tableName in groupedErrors) {
          const tableErrors = groupedErrors[tableName];
          const isCollapsed = collapsedGroups.includes(tableName);

          html += `<div class="acu-changes-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="acu-changes-group-header acu-validation-group-header" data-table="${deps.escapeHtml(tableName)}" style="cursor:pointer;">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                        <i class="fa-solid ${deps.getIconForTableName(tableName)}"></i> ${deps.escapeHtml(tableName)}
                        <span class="acu-changes-count" style="background:var(--acu-error-text);">${tableErrors.length}</span>
                    </div>
                    <div class="acu-changes-group-body" style="${isCollapsed ? 'display:none;' : ''}">`;

          tableErrors.forEach(error => {
            const ruleData = error.rule
              ? deps.escapeHtml(
                  JSON.stringify({
                    ruleId: error.ruleId,
                    ruleType: error.ruleType,
                    tableName: error.tableName,
                    rowIndex: error.rowIndex,
                    columnName: error.columnName || '',
                    currentValue: error.currentValue || '',
                    rowTitle: error.rowTitle || '', // 添加 rowTitle 到 ruleData
                    rule: error.rule,
                  }),
                )
              : '';

            html += `<div class="acu-change-item acu-validation-error-item"
                         data-table="${deps.escapeHtml(error.tableName)}"
                         data-row="${error.rowIndex}"
                         data-column="${deps.escapeHtml(error.columnName || '')}"
                         data-rule-id="${deps.escapeHtml(error.ruleId || '')}"
                         data-rule-type="${deps.escapeHtml(error.ruleType || '')}"
                         data-rule-data="${ruleData}">
                        <span class="acu-change-badge" style="background:var(--acu-hl-manual-bg);color:var(--acu-hl-manual);">!</span>
                        ${error.rowTitle && error.rowIndex >= 0 ? `<div class="acu-validation-row-title" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:2px;">${deps.escapeHtml(error.rowTitle)}</div>` : ''}
                        <span class="acu-change-title">${deps.escapeHtml(error.columnName || (error.rowIndex < 0 ? '整表' : '整行'))}${error.currentValue ? `: ${deps.escapeHtml(error.currentValue.length > 15 ? error.currentValue.substring(0, 15) + '...' : error.currentValue)}` : ''}</span>
                        <span class="acu-validation-error-msg">${deps.escapeHtml(error.errorMessage.length > 25 ? error.errorMessage.substring(0, 25) + '...' : error.errorMessage)}</span>
                        <div class="acu-change-actions">
                            ${error.rowIndex >= 0 ? '<button class="acu-change-action-btn acu-action-reject" title="回滚"><i class="fa-solid fa-rotate-left"></i></button>' : ''}
                            <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                        </div>
                    </div>`;
          });

          html += `</div></div>`;
        }

        html += `</div>`;
      }
    } else {
      // === 完整审核模式：只渲染变更列表，不包含验证错误 ===
      if (changes.length === 0) {
        html += `<div class="acu-empty-hint" style="padding:40px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <i class="fa-solid fa-check-circle" style="font-size:32px;color:var(--acu-success-text);margin-bottom:10px;display:block;"></i>
                当前数据与快照一致，无变更
            </div>`;
      } else {
        // 按表名分组
        const groupedChanges = {};
        changes.forEach(c => {
          const key = c.tableName;
          if (!groupedChanges[key]) groupedChanges[key] = [];
          groupedChanges[key].push(c);
        });

        html += `<div class="acu-changes-list">`;

        const collapsedGroups = Store.get('acu_changes_collapsed_groups', []);

        for (const tableName in groupedChanges) {
          const tableChanges = groupedChanges[tableName];
          const isCollapsed = collapsedGroups.includes(tableName);
          html += `<div class="acu-changes-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="acu-changes-group-header" data-table="${deps.escapeHtml(tableName)}" style="cursor:pointer;">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                        <i class="fa-solid ${deps.getIconForTableName(tableName)}"></i> ${deps.escapeHtml(tableName)}
                        <span class="acu-changes-count">${tableChanges.length}</span>
                    </div>
                    <div class="acu-changes-group-body" style="${isCollapsed ? 'display:none;' : ''}">`;

          tableChanges.forEach(change => {
            if (change.type === 'row_added') {
              html += `<div class="acu-change-item acu-change-added"
                            data-change-type="row_added"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}">
                            <span class="acu-change-badge acu-badge-added">新</span>
                            <span class="acu-change-title">${deps.escapeHtml(change.title)}</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-reject" title="拒绝"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'row_deleted') {
              html += `<div class="acu-change-item acu-change-deleted"
                            data-change-type="row_deleted"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}">
                            <span class="acu-change-badge acu-badge-deleted">删</span>
                            <span class="acu-change-title" style="text-decoration:line-through;opacity:0.6;">${deps.escapeHtml(change.title)}</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受删除"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-restore" title="恢复此行到表尾"><i class="fa-solid fa-undo"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'cell_modified') {
              const oldShort = change.oldValue.length > 15 ? change.oldValue.substring(0, 15) + '...' : change.oldValue;
              const newShort = change.newValue.length > 15 ? change.newValue.substring(0, 15) + '...' : change.newValue;

              const isOptionTable = change.tableName && change.tableName.includes('选项');
              let fieldDisplay;
              if (isOptionTable) {
                fieldDisplay = `${deps.escapeHtml(change.tableName)}.${deps.escapeHtml(change.header)}`;
              } else {
                fieldDisplay = `${deps.escapeHtml(change.rowTitle)}.${deps.escapeHtml(change.header)}`;
              }

              html += `<div class="acu-change-item acu-change-modified"
                            data-change-type="cell_modified"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}"
                            data-col-index="${change.colIndex}"
  data-old-value="${deps.safeEncodeURIComponent(change.oldValue)}">
                            <span class="acu-change-badge acu-badge-modified">更</span>
                            <span class="acu-change-field">${fieldDisplay}</span>
                            <span class="acu-change-diff">
                                <span class="acu-diff-old">${deps.escapeHtml(oldShort || '(空)')}</span>
                                <span class="acu-diff-arrow">→</span>
                                <span class="acu-diff-new">${deps.escapeHtml(newShort || '(空)')}</span>
                            </span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-reject" title="拒绝"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'row_modified') {
              // 多字段修改，显示修改数量
              const fieldCount = change.changedFields.length;
              const fieldNames = change.changedFields
                .slice(0, 2)
                .map(f => f.header)
                .join('、');
              const moreText = fieldCount > 2 ? ` 等${fieldCount}项` : '';

              html += `<div class="acu-change-item acu-change-modified"
                            data-change-type="row_modified"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}">
                            <span class="acu-change-badge acu-badge-modified">更</span>
                            <span class="acu-change-title">${deps.escapeHtml(change.rowTitle)}</span>
                            <span class="acu-change-field-count">${deps.escapeHtml(fieldNames)}${moreText}</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-reject" title="拒绝"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>`;
            } else if (
              change.type === 'table_deleted' ||
              change.type === 'table_added' ||
              change.type === 'table_structure_changed'
            ) {
              const structuralText =
                change.type === 'table_deleted'
                  ? '整表已删除（仅标注）'
                  : change.type === 'table_added'
                    ? '新增整表（仅标注）'
                    : '表结构已变化（仅标注）';
              const structuralBadge =
                change.type === 'table_deleted' ? '删' : change.type === 'table_added' ? '新' : '构';
              html += `<div class="acu-change-item acu-change-deleted"
                            data-change-type="${change.type}"
                            data-table-key="${change.tableKey}">
                            <span class="acu-change-badge acu-badge-deleted">${structuralBadge}</span>
                            <span class="acu-change-title" style="opacity:0.6;">${deps.escapeHtml(structuralText)}</span>
                            <div class="acu-change-actions">
                                <span class="acu-change-field-count">无快捷操作</span>
                            </div>
                        </div>`;
            }
          });

          html += `</div></div>`;
        }

        html += `</div>`;
      }
    }

    html += `</div>`;
    return html;
  };
  return renderChangesPanel;
}
