// @ts-nocheck
/**
 * render-dashboard.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDisplayName } from '../../entities/name-alias';
export function createRenderDashboard(deps: any) {
  const renderDashboard = allTables => {
    console.info('[DICE]开始抓取仪表盘数据...');
    // 重建角色名别名注册表
    deps.NameAliasRegistry.rebuild(allTables);
    const config = deps.getConfig();

    // [重构] 使用统一配置中心查找表格
    const globalResult = deps.DashboardDataParser.findTable(allTables, 'global');
    const playerResult = deps.DashboardDataParser.findTable(allTables, 'player');
    const locationResult = deps.DashboardDataParser.findTable(allTables, 'location');
    const questResult = deps.DashboardDataParser.findTable(allTables, 'quest');
    const bagResult = deps.DashboardDataParser.findTable(allTables, 'bag');
    const equipResult = deps.DashboardDataParser.findTable(allTables, 'equip');

    // [重构] 主角数据 - 使用新解析器
    let player = { name: '主角', status: '正常', position: '', attrs: '', money: '0' };
    const playerParsed = deps.DashboardDataParser.parseRows(playerResult, 'player');

    if (playerParsed.length > 0) {
      const p = playerParsed[0];
      player.name = p.name || '主角';
      player.status = p.status || '正常';
      player.position = p.position || '';
      player.money = p.money || '';
      player.resources = '';

      // [特殊处理] 属性列可能有多个，需要合并
      if (playerResult?.data?.headers && playerResult?.data?.rows?.[0]) {
        const headers = playerResult.data.headers;
        const row = playerResult.data.rows[0];
        let allAttrsStr = '';
        headers.forEach((h, idx) => {
          if (h && h.includes('属性')) {
            const val = row[idx];
            if (val) allAttrsStr += (allAttrsStr ? '; ' : '') + val;
          }
        });
        player.attrs = allAttrsStr;

        // 解析资源数据
        headers.forEach((h, idx) => {
          if (h && (h.includes('资源') || h.includes('金钱'))) {
            const val = row[idx];
            if (val) player.resources = val;
          }
        });
      }
    }

    // [兼容] 保留旧变量供后续HTML渲染使用
    const playerRows = playerResult?.data?.rows || [];
    const playerHeaders = playerResult?.data?.headers || [];

    // [重构] 从全局数据表获取当前地点信息 - 使用新解析器
    let globalDetailLocation = ''; // 详细地点（用于高亮匹配）
    let globalLocation = ''; // 次要地区（备选）

    if (globalResult?.data?.rows?.length > 0) {
      const headers = globalResult.data.headers || [];
      const row = globalResult.data.rows[0];

      // 优先获取详细地点
      const detailIdx = deps.DashboardDataParser.findColumnIndex(headers, 'detailLocation', globalResult.config);
      if (detailIdx >= 0 && row[detailIdx]) {
        globalDetailLocation = row[detailIdx];
      }

      // 备选：次要地区
      const locIdx = deps.DashboardDataParser.findColumnIndex(headers, 'currentLocation', globalResult.config);
      globalLocation = locIdx >= 0 && row[locIdx] ? row[locIdx] : row[2] || '';
    }

    // currentPlaceName 优先使用详细地点，其次次要地区，最后从主角位置提取
    let currentPlaceName =
      globalDetailLocation ||
      globalLocation ||
      (player.position.includes('-') ? player.position.split('-')[0].trim() : player.position);

    // [重构] NPC数据 - 角色区优先复用人物关系图 sources，可拼接多个来源
    const npcListData = deps.getDashboardNpcListData(allTables);
    const npcTableName = npcListData.tableName;
    const npcTableKey = npcListData.tableKey;

    // 分离在场和离场的NPC
    let inSceneNPCs = [];
    let offSceneNPCs = [];
    npcListData.entries.forEach(npc => {
      if (npc.isInScene) {
        inSceneNPCs.push(npc);
      } else {
        offSceneNPCs.push(npc);
      }
    });
    // 合并：在场的排前面
    let allNPCs = [...inSceneNPCs, ...offSceneNPCs];

    // [重构] 任务数据 - 使用新解析器（显示所有任务，按状态/类型/优先级/进度排序）
    const questTableName = questResult?.name || '备忘事项';
    const questParsed = deps.DashboardDataParser.parseRows(questResult, 'quest');

    // 任务排序辅助函数
    const questStatusOrder = (status: string) => {
      const s = String(status || '').toLowerCase();
      // 进行中排前面，已完成/已失败/已放弃排后面
      if (s.includes('进行中') || s.includes('进行')) return 0;
      return 1; // 已完成、已失败、已放弃等终态
    };
    const questTypeOrder = (type: string) => {
      const t = String(type || '').toLowerCase();
      if (t.includes('主线')) return 0;
      if (t.includes('支线')) return 1;
      if (t.includes('日常')) return 2;
      return 3;
    };
    const questPriorityOrder = (priority: string) => {
      const p = String(priority || '').toLowerCase();
      if (p.includes('紧急')) return 0;
      if (p.includes('重要')) return 1;
      if (p.includes('普通')) return 2;
      return 3;
    };
    const parseProgress = (progress: string) => {
      const match = String(progress || '').match(/(\d+)\s*%/);
      return match ? parseInt(match[1], 10) : 0;
    };

    let activeTasks = questParsed
      .map(q => ({
        name: q.name || '任务',
        type: q.type || '',
        status: q.status || '',
        priority: q.priority || '',
        progress: q.progress || '',
        _rowIndex: q._rowIndex,
      }))
      .sort((a, b) => {
        // 1. 状态：进行中 > 已完成
        const aStatusOrder = questStatusOrder(a.status);
        const bStatusOrder = questStatusOrder(b.status);
        const statusDiff = aStatusOrder - bStatusOrder;
        if (statusDiff !== 0) return statusDiff;

        // 已完成任务：按行号倒序（行号低的靠后）
        if (aStatusOrder === 1) {
          return (b._rowIndex ?? 0) - (a._rowIndex ?? 0);
        }

        // 进行中任务的排序规则：
        // 2. 类型：主线 > 支线 > 日常
        const typeDiff = questTypeOrder(a.type) - questTypeOrder(b.type);
        if (typeDiff !== 0) return typeDiff;
        // 3. 优先级：紧急 > 重要 > 普通
        const priorityDiff = questPriorityOrder(a.priority) - questPriorityOrder(b.priority);
        if (priorityDiff !== 0) return priorityDiff;
        // 4. 进度：低 → 高
        return parseProgress(a.progress) - parseProgress(b.progress);
      });
    // [重构] 背包物品数据 - 使用新解析器
    const bagTableName = bagResult?.name || '背包物品表';

    const bagParsed = deps.DashboardDataParser.parseRows(bagResult, 'bag');
    let bagItems = bagParsed.map(item => ({
      name: item.name || '未知物品',
      count: item.count || '1',
      type: item.type || '',
    }));

    // [重构] 装备数据 - 使用新解析器 + 过滤器
    const equipTableName = equipResult?.name || '装备表';

    const equipParsed = deps.DashboardDataParser.parseRows(equipResult, 'equip');
    const equippedParsed = deps.DashboardDataParser.applyFilter(equipParsed, 'equipped', 'equip');

    let equippedItems = equippedParsed.map(e => ({
      name: e.name || '未知装备',
      type: e.type || '',
      part: e.part || '',
    }));
    // [重构] 地点数据 - 使用新解析器
    const locationTableName = locationResult?.name || '世界地图点';
    const locationTableKey = locationResult?.key || '';

    const locationParsed = deps.DashboardDataParser.parseRows(locationResult, 'location');

    // 构建HTML
    let html = `
        <div class="acu-panel-header">
            <div class="acu-panel-title">
                <div class="acu-title-main"><i class="fa-solid fa-chart-line"></i> <span class="acu-title-text">仪表盘</span></div>
                <div class="acu-title-sub">综合状态总览</div>
            </div>
            <div class="acu-header-actions acu-dashboard-header-actions">
                ${deps.getTutorialButtonHtml('core', '播放核心引导教程', 'acu-dashboard-tutorial-btn')}
                <button type="button" class="acu-view-btn acu-dashboard-preset-settings-btn" title="仪表盘预设" aria-label="仪表盘预设">
                    <i class="fa-solid fa-gear"></i>
                </button>
                <div class="acu-height-control">
                    <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="仪表盘" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                </div>
                <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭仪表盘"><i class="fa-solid fa-times"></i></button>
            </div>
        </div>
        <div class="acu-panel-content acu-dashboard-content">
            <div class="acu-dash-body ${config.layout === 'horizontal' ? 'acu-dash-horizontal' : ''}">
            <!-- 左列：主角状态 + 基础属性 + 特有属性 -->
                <div class="acu-dash-player acu-dashboard-section">
                    <h3 class="acu-dash-section-heading acu-dash-clickable acu-dash-preview-trigger"
                        data-table-key="${playerResult?.key || ''}"
                        data-row-index="0"
                        data-preview-type="player">
                        <span><i class="fa-solid fa-user-circle"></i> ${deps.escapeHtml(deps.replaceUserPlaceholders(getDisplayName(player.name)))}</span>
                        <span class="acu-dash-status-badge" title="${deps.escapeHtml(player.status)}">${deps.escapeHtml(player.status.length > 6 ? player.status.substring(0, 6) + '..' : player.status)}</span>
                    </h3>
                    ${(() => {
                      // 解析资源数据
                      const resourcesStr = player.resources || player.money || '';
                      const parsedResources = deps.parseAttributeString(resourcesStr);

                      // 分别收集基础属性和特有属性
                      let baseAttrs = [];
                      let specialAttrs = [];
                      if (playerRows.length > 0 && playerHeaders.length > 0) {
                        const row = playerRows[0];
                        playerHeaders.forEach((h, idx) => {
                          if (h && h.includes('基础属性')) {
                            const parsed = deps.parseAttributeString(row[idx] || '');
                            parsed.forEach(attr => {
                              if (!baseAttrs.some(a => a.name === attr.name)) {
                                baseAttrs.push(attr);
                              }
                            });
                          } else if (h && h.includes('特有属性')) {
                            const parsed = deps.parseAttributeString(row[idx] || '');
                            parsed.forEach(attr => {
                              if (!specialAttrs.some(a => a.name === attr.name)) {
                                specialAttrs.push(attr);
                              }
                            });
                          }
                        });
                      }

                      let html = '';

                      // 资源区块
                      if (parsedResources.length > 0) {
                        html += `<div class="acu-dash-resource-list">
                                ${parsedResources
                                  .map(
                                    res => `
                                    <div class="acu-dash-metric-row">
                                        <span class="acu-dash-metric-label" title="${deps.escapeHtml(res.name)}">${deps.escapeHtml(res.name.substring(0, 3))}</span>
                                        <div class="acu-dash-metric-value-group">
                                            <span class="acu-dash-metric-value">${res.value}</span>
                                            <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${res.value}" data-name="${deps.escapeHtml(res.name)}" title="以${res.name}(${res.value})进行检定"></i>
                                        </div>
                                    </div>
                                `,
                                  )
                                  .join('')}
                            </div>`;
                      }

                      // 属性区块标题（合并基础属性和特有属性），点击打开主角卡片
                      html += `<h4 class="acu-dash-subheading acu-dash-clickable acu-dash-preview-trigger"
                          data-table-key="${playerResult?.key || ''}"
                          data-row-index="0"
                          data-preview-type="player"><i class="fa-solid fa-chart-bar"></i> 属性 (${baseAttrs.length + specialAttrs.length})</h4>`;

                      // 合并所有属性：3列，最多4行（移动端行高更大，按约24px计算，4行≈96px），超出滚动
                      const allAttrs = [...baseAttrs, ...specialAttrs];
                      if (allAttrs.length > 0) {
                        html += `<div class="acu-dash-attr-list">
                                ${allAttrs
                                  .map(
                                    attr => `
                                    <div class="acu-dash-attr-row">
                                        <span class="acu-dash-metric-label" title="${deps.escapeHtml(attr.name)}">${deps.escapeHtml(attr.name.substring(0, 2))}</span>
                                        <div class="acu-dash-metric-value-group">
                                            <span class="acu-dash-attr-value">${attr.value}</span>
                                            <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${attr.value}" data-name="${deps.escapeHtml(attr.name)}" title="以${attr.name}(${attr.value})进行检定"></i>
                                        </div>
                                    </div>
                                `,
                                  )
                                  .join('')}
                            </div>`;
                      } else {
                        html += `<div class="acu-empty-hint">暂无属性</div>`;
                      }

                      return html;
                    })()}
                </div>

                <!-- 中列：地点 + NPC -->
                <div class="acu-dash-locations acu-dashboard-section">
                    <div class="acu-dash-location-group">
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-location-title" data-table="${deps.escapeHtml(locationTableName)}">
                        <span><i class="fa-solid fa-map"></i> 地点 (${locationParsed.length})</span>
                        <i class="fa-solid fa-map acu-dash-map-btn acu-dash-section-action" title="地图可视化"></i>
                    </h3>
                    <div class="acu-dash-location-list">
                    ${
                      locationParsed.length > 0
                        ? locationParsed
                            .map((loc, idx) => {
                              const areaName = loc.name || '未知';
                              const isCurrent =
                                currentPlaceName &&
                                (areaName.includes(currentPlaceName) || currentPlaceName.includes(areaName));
                              const emoji = deps.getElementEmoji(areaName, null);
                              let iconHtml = '';
                              if (emoji) {
                                if (emoji.startsWith('fa:')) {
                                  iconHtml = `<i class="fa-solid fa-${emoji.slice(3)}" style="font-size:10px;opacity:0.7;"></i>`;
                                } else if (emoji.startsWith('ti:')) {
                                  iconHtml = `<i class="ti ti-${emoji.slice(3)}" style="font-size:10px;opacity:0.7;"></i>`;
                                } else {
                                  iconHtml = `<span style="font-size:10px;">${emoji}</span>`;
                                }
                              } else {
                                iconHtml = isCurrent
                                  ? '<i class="fa-solid fa-location-dot"></i>'
                                  : '<i class="fa-solid fa-map-pin" style="font-size:9px;opacity:0.4;"></i>';
                              }
                              return `<div class="acu-location-item acu-dash-clickable acu-dash-preview-trigger ${isCurrent ? 'acu-current-location' : ''}"
                            data-table-key="${deps.escapeHtml(locationTableKey)}"
                            data-row-index="${loc._rowIndex}"
                            data-preview-type="location">
                            <span style="display:flex;align-items:center;gap:4px;">
                                ${iconHtml}
                                <span title="${deps.escapeHtml(areaName)}">${deps.escapeHtml(areaName)}</span>
                            </span>
                            ${!isCurrent ? `<i class="fa-solid fa-walking acu-dash-goto-btn" data-location="${deps.escapeHtml(areaName)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;flex-shrink:0;" title="前往${areaName}"></i>` : '<i class="fa-solid fa-street-view" style="flex-shrink:0;" title="您在这里"></i>'}
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无地点数据</div>'
                    }
                    </div>
                    </div>

                    <div class="acu-dash-role-group">
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-role-title" data-table="${deps.escapeHtml(npcTableName)}">
                        <span><i class="fa-solid fa-users"></i> 角色 (${allNPCs.length})</span>
                        <span class="acu-dash-section-actions">
                            <i class="fa-solid fa-project-diagram acu-dash-relation-graph-btn acu-dash-section-action" title="人物关系图"></i>
                            <i class="fa-solid fa-user-circle acu-dash-avatar-manager-btn acu-dash-section-action" title="角色头像预设"></i>
                        </span>
                    </h3>
                    <div class="acu-dash-role-list">
                    ${
                      allNPCs.length > 0
                        ? allNPCs
                            .map((npc, npcIdx) => {
                              const npcName = String(npc.name || '').trim() || '未知';
                              const npcDisplayName = deps.replaceUserPlaceholders(getDisplayName(npcName)).trim() || '未知';
                              const npcDisplayShort =
                                npcDisplayName.length > 4 ? npcDisplayName.substring(0, 4) + '..' : npcDisplayName;
                              const npcFallbackChar = npcDisplayName.charAt(0) || '？';
                              const isInScene = npc.isInScene === true;
                              const isLastNpc = npcIdx === allNPCs.length - 1;
                              const npcAvatar = deps.AvatarManager.get(npcName);
                              const avatarOffsetX = deps.AvatarManager.getOffsetX(npcName);
                              const avatarOffsetY = deps.AvatarManager.getOffsetY(npcName);
                              const avatarScale = deps.AvatarManager.getScale(npcName);
                              const avatarStyle = deps.escapeHtml(
                                deps.buildAvatarBackgroundStyle(npcAvatar, avatarOffsetX, avatarOffsetY, avatarScale),
                              );
                              const offSceneFilter = isInScene
                                ? ''
                                : 'filter:grayscale(80%) brightness(0.7);opacity:0.5;';
                              return `<div class="acu-dash-person-row acu-dash-clickable acu-dash-preview-trigger ${!isLastNpc ? 'acu-dash-row-separated' : ''}"
                            data-table-key="${deps.escapeHtml(npc.tableKey || npcTableKey)}"
                            data-row-index="${npc.index}"
                            data-preview-type="npc">
                            <div class="acu-dash-row-main">
                                <span class="acu-dash-name-with-avatar">
                                    <span class="acu-dash-npc-avatar" data-npc-name="${deps.escapeHtml(npcName)}" style="width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--acu-badge-bg, rgba(0,255,255,0.12));border:1.5px solid ${isInScene ? 'var(--acu-accent)' : 'var(--acu-border)'};${avatarStyle}${offSceneFilter}" title="${isInScene ? '在场' : '不在场'}">
                                        ${!avatarStyle ? `<span class="acu-dash-npc-avatar-fallback" style="font-size:10px;font-weight:bold;color:var(--acu-accent);">${deps.escapeHtml(npcFallbackChar)}</span>` : ''}
                                    </span>
                                    <span class="${isInScene ? '' : 'acu-dash-muted'}" title="${deps.escapeHtml(npcDisplayName)}">${deps.escapeHtml(npcDisplayShort)}</span>
                                </span>
                                <div class="acu-dash-row-actions">
                                    <i class="fa-solid fa-people-arrows acu-dash-contest-btn" data-npc="${deps.escapeHtml(npcName)}" title="与${deps.escapeHtml(npcDisplayName)}进行对抗检定"></i>
                                </div>
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无重要人物</div>'
                    }
                    </div>
                    </div>
                </div>

                <!-- 右列：背包 + 技能 + 任务 -->
                <div class="acu-dash-intel acu-dashboard-section">
                    <div class="acu-dash-items-group">
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-items-title" data-table="${deps.escapeHtml(bagTableName)}">
                        <span><i class="fa-solid fa-bag-shopping"></i> 物品 (${bagParsed.length})</span>
                        <span class="acu-dash-section-actions">
                            <i class="fa-solid fa-store acu-dash-gacha-btn acu-dash-section-action" title="骰子商店"></i>
                            <i class="fa-solid fa-box-open acu-dash-inventory-btn acu-dash-section-action" title="物品栏可视化"></i>
                        </span>
                    </h3>
                    <div class="acu-dash-items-list">
                    ${
                      bagItems.length > 0
                        ? bagItems
                            .map((item, idx) => {
                              const isLastBag = idx === bagItems.length - 1;
                              const emoji = deps.getElementEmoji(item.name, null);
                              const iconContext = deps.createCustomTableNameIconContext(
                                'item',
                                bagTableName,
                                'item',
                                item.name,
                              );
                              let iconHtml = '';
                              if (emoji) {
                                if (emoji.startsWith('fa:')) {
                                  iconHtml = `<i class="fa-solid fa-${emoji.slice(3)}" style="font-size:10px;opacity:0.7;"></i>`;
                                } else if (emoji.startsWith('ti:')) {
                                  iconHtml = `<i class="ti ti-${emoji.slice(3)}" style="font-size:10px;opacity:0.7;"></i>`;
                                } else {
                                  iconHtml = `<span style="font-size:10px;">${emoji}</span>`;
                                }
                              } else {
                                iconHtml = '<i class="fa-solid fa-cube" style="font-size:9px;opacity:0.4;"></i>';
                              }
                              iconHtml = deps.renderCustomTableNameIconContent(iconHtml, iconContext);
                              return `<div class="acu-dash-item-row acu-dash-clickable acu-dash-preview-trigger ${!isLastBag ? 'acu-dash-row-separated' : ''}"
                            data-table-key="${bagResult?.key || ''}"
                            data-row-index="${idx}"
                            data-preview-type="bag">
                            <span class="acu-dash-item-name" title="${deps.escapeHtml(item.name)}">
                                ${iconHtml}
                                ${deps.escapeHtml(item.name.length > 4 ? item.name.substring(0, 4) + '..' : item.name)}
                            </span>
                            <div class="acu-dash-row-actions">
                                <i class="fa-solid fa-hand-pointer acu-dash-use-item-btn" data-item="${deps.escapeHtml(item.name)}" title="使用${item.name}"></i>
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无物品</div>'
                    }
                    </div>
                    </div>

                    <div class="acu-dash-equipment-task-group">
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-equipment-title" data-table="${deps.escapeHtml(equipTableName)}"><span><i class="fa-solid fa-shield-halved"></i> 装备 (${equippedItems.length})</span></h3>
                    <div class="acu-dash-equipment-list">
                    ${
                      equippedItems.length > 0
                        ? equippedItems
                            .map((item, idx) => {
                              const isLast = idx === equippedItems.length - 1;
                              const emoji = deps.getElementEmoji(item.name, null);
                              const iconContext = deps.createCustomTableNameIconContext(
                                'equipment',
                                equipTableName,
                                'equipment',
                                item.name,
                              );
                              let iconHtml = '';
                              if (emoji) {
                                if (emoji.startsWith('fa:')) {
                                  iconHtml = `<i class="fa-solid fa-${emoji.slice(3)}" style="font-size:10px;opacity:0.7;"></i>`;
                                } else if (emoji.startsWith('ti:')) {
                                  iconHtml = `<i class="ti ti-${emoji.slice(3)}" style="font-size:10px;opacity:0.7;"></i>`;
                                } else {
                                  iconHtml = `<span style="font-size:10px;">${emoji}</span>`;
                                }
                              } else {
                                iconHtml = '<i class="fa-solid fa-shirt" style="font-size:9px;opacity:0.4;"></i>';
                              }
                              iconHtml = deps.renderCustomTableNameIconContent(iconHtml, iconContext);
                              return `<div class="acu-dash-equipment-row acu-dash-clickable acu-dash-preview-trigger ${!isLast ? 'acu-dash-row-separated' : ''}"
                            data-table-key="${equipResult?.key || ''}"
                            data-row-index="${equipParsed.findIndex(r => r.name === item.name)}"
                            data-preview-type="equipment">
                            ${iconHtml}
                            <span title="${deps.escapeHtml(item.name)}">${deps.escapeHtml(item.name)}</span>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无装备</div>'
                    }
                    </div>

                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-quest-title" data-table="${deps.escapeHtml(questTableName)}"><span><i class="fa-solid fa-clipboard-list"></i> 任务 (${activeTasks.length})</span></h3>
                    <div class="acu-dash-quest-list">
                    ${
                      activeTasks.length > 0
                        ? activeTasks
                            .map((t, idx) => {
                              const isMain = String(t.type || '').includes('主线');
                              // 解析进度百分比
                              let progressPercent = null;
                              const progressMatch = String(t.progress || '').match(/(\d+)\s*%/);
                              if (progressMatch) {
                                progressPercent = Math.min(100, Math.max(0, parseInt(progressMatch[1], 10)));
                              }
                              const progressBar =
                                progressPercent !== null
                                  ? `<div style="width:40px;height:4px;background:var(--acu-border);border-radius:2px;overflow:hidden;"><div style="width:${progressPercent}%;height:100%;background:var(--acu-accent);"></div></div>`
                                  : '';
                              return `<div class="acu-task-item acu-dash-clickable acu-dash-preview-trigger"
                            data-table-key="${questResult?.key || ''}"
                            data-row-index="${t._rowIndex !== undefined ? t._rowIndex : questParsed.findIndex(q => q.name === t.name)}"
                            data-preview-type="quest"
                            >
                            <div class="acu-dash-row-main">
                                <div class="acu-task-name ${isMain ? 'acu-task-main' : ''}">${deps.escapeHtml(t.name)}</div>
                                ${progressBar}
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无任务</div>'
                    }
                    </div>
                    </div>
                </div>
            </div>
    `;

    // 统计已加载的模块数量
    const loadedModules = [
      globalResult ? '全局数据' : null,
      playerResult ? '主角信息' : null,
      locationResult ? '地点' : null,
      npcListData.hasTable ? 'NPC' : null,
      questResult ? '任务' : null,
      bagResult ? '背包' : null,
      equipResult ? '装备' : null,
    ].filter(Boolean);

    console.info(`[DICE]仪表盘数据抓取完成，共${loadedModules.length}个模块: ${loadedModules.join(', ')}`);
    return html;
  };
  return renderDashboard;
}
