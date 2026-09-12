// @ts-nocheck
/**
 * render-interface-impl.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_CLASS, DICE_ROOT_SELECTOR } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
export function createRenderInterfaceImpl(deps: any) {
  const _renderInterfaceImpl = () => {
    console.info('[DICE]开始渲染界面...');
    const { $ } = deps.getCore();

    // [修复] Observer 延迟创建保险 (带节流优化)
    if (!deps.getObserver() && $('#chat').length) {
      const $chat = $('#chat');
      let mutationLock = false;
      const handleMutation = () => {
        if (mutationLock) return;
        mutationLock = true;
        requestAnimationFrame(() => {
          const config = deps.getConfig();
          if (
            config.positionMode === 'embedded' ||
            config.positionMode === 'viewport' ||
            deps.isFloatingCollapseActive(config)
          ) {
            mutationLock = false;
            return;
          }
          const children = $chat.children();
          const lastChild = children.last()[0];
          const wrapper = $(DICE_ROOT_SELECTOR)[0];
          if (wrapper && lastChild && lastChild !== wrapper) {
            if ($(lastChild).hasClass('mes') || $(lastChild).hasClass('message-body')) {
              $chat.append(wrapper);
            }
          }

          // [新增] 检测到新消息时，应用投骰结果隐藏逻辑（消除闪烁）
          const diceCfg = deps.getDiceConfig();
          if (diceCfg && diceCfg.hideDiceResultInChat) {
            // 步骤1：立即对新消息应用遮罩样式，避免闪烁
            const children = $chat.children();
            const lastChild = children.last();
            if (lastChild.hasClass('mes') || lastChild.hasClass('message-body')) {
              lastChild.addClass('acu-dice-result-revealing');
            }

            // 步骤2：使用RAF在下一帧快速执行隐藏逻辑
            requestAnimationFrame(() => {
              deps.hideDiceResultsInUserMessages();

              // 步骤3：隐藏完成后移除遮罩，触发揭示动画
              requestAnimationFrame(() => {
                lastChild.removeClass('acu-dice-result-revealing').addClass('acu-dice-result-revealed');
                // 动画结束后清理类名
                setTimeout(() => {
                  lastChild.removeClass('acu-dice-result-revealed');
                }, 200);
              });
            });
          }

          mutationLock = false;
        });
      };
      deps.setObserver(new MutationObserver(handleMutation));
      deps.getObserver().observe($chat[0], { childList: true });
    }
    let rawData;
    let isDataFromDatabase = false; // 标记数据是否来自数据库（需要检查自动替换）
    if (deps.getHasUnsavedChanges() && deps.getCachedRawData()) {
      rawData = deps.getCachedRawData();
    } else {
      rawData = deps.getTableData();
      isDataFromDatabase = true; // 数据来自数据库，需要检查自动替换

      // [自动替换] 应用auto模式的表格正则规则
      // 注意：只在非自动转换过程中执行，防止循环触发
      // 只在从数据库获取新数据时执行自动替换
      if (rawData && !deps.getIsAutoTransforming() && isDataFromDatabase) {
        try {
          const enabledRules = deps.RegexTransformationManager.getEnabledRules();

          if (enabledRules.length > 0) {
            const transformKey = deps.createAutoRegexTransformKey(rawData, enabledRules);
            if (deps.shouldSkipAutoRegexTransform(transformKey)) {
              console.debug('[DICE]自动转换跳过：相同数据和规则仍在冷却时间内');
            } else {
              console.info(`[DICE]检测到数据更新，应用 ${enabledRules.length} 条规则...`);

              deps.setIsAutoTransforming(true); // 设置标志，防止循环触发
              const transformResult = deps.RegexTransformationEngine.applyToTable(rawData, enabledRules);
              deps.rememberAutoRegexTransform(deps.createAutoRegexTransformKey(rawData, enabledRules) || transformKey);
              if (transformResult.totalApplied > 0) {
                console.info(`[DICE]自动替换完成，共影响 ${transformResult.totalApplied} 处数据`);

                deps.saveSheetsViaJsonFloorWithoutTracking(rawData, transformResult.modifiedSheetKeys)
                  .catch(err => {
                    console.warn('[DICE]自动转换后保存数据失败:', err);
                  })
                  .finally(() => {
                    deps.setIsAutoTransforming(false);
                  });
              }
              if (transformResult.errors.length > 0) {
                console.warn(`[DICE]自动转换遇到 ${transformResult.errors.length} 个错误:`, transformResult.errors);
              } else if (transformResult.totalApplied === 0) {
                console.info('[DICE]自动转换执行完成，但没有匹配到需要转换的数据');
              }
              if (transformResult.totalApplied === 0) {
                deps.setIsAutoTransforming(false);
              }
            }
          } else {
            deps.setIsAutoTransforming(false); // 清除标志
          }
        } catch (transformError) {
          deps.setIsAutoTransforming(false); // 确保异常时也清除标志
          const errorMsg = transformError instanceof Error ? transformError.message : String(transformError);
          console.error('[DICE]自动转换失败:', transformError);
        }
      }

      if (rawData) {
        deps.setCachedRawData(typeof structuredClone === 'function' ? structuredClone(rawData) : JSON.parse(JSON.stringify(rawData)));

        const existingSnapshot = deps.loadSnapshot();
        const currentCtx = deps.getCurrentContextFingerprint();

        // 检查快照是否有效（存在且包含实际表数据）
        const hasValidSnapshotData =
          existingSnapshot && Object.keys(existingSnapshot).some(k => k.startsWith('sheet_'));

        if (!existingSnapshot || !hasValidSnapshotData) {
          // 情况1：没有快照 或 快照数据为空 → 保存新快照
          deps.saveSnapshot({ ...deps.getCachedRawData(), _contextId: currentCtx });
        } else if (!existingSnapshot._contextId) {
          // 情况2：旧版快照（无 ID）→ 打上当前上下文标记，但不覆盖数据
          deps.saveSnapshot({ ...existingSnapshot, _contextId: currentCtx });
        } else if (existingSnapshot._contextId !== currentCtx) {
          // 情况3：确认切换了聊天 → 覆盖为新数据
          deps.getCachedRawData()._contextId = currentCtx;
          deps.saveSnapshot(deps.getCachedRawData());
        }
        // 情况4：同一聊天且快照有效 → 不动，保持高亮正常
      }
    }

    const $searchInput = $('.acu-search-input');
    if ($(DICE_ROOT_SELECTOR).length && $searchInput.is(':focus')) {
      if (rawData) {
        if (!deps.getIsSaving()) deps.setCurrentDiffMap(deps.generateDiffMap(rawData));
        const tables = deps.processJsonData(rawData);
        const activeTab = deps.getActiveTabState();
        const currentTabName = activeTab && tables[activeTab] ? activeTab : null;

        if (currentTabName && tables[currentTabName]) {
          const newHtml = deps.renderTableContent(tables[currentTabName], currentTabName);
          const $virtualDom = $('<div>').html(newHtml);
          $('.acu-card-grid').replaceWith($virtualDom.find('.acu-card-grid'));
          $('.acu-panel-title').html($virtualDom.find('.acu-panel-title').html());
          // [修复] 修正函数名错误，复用主事件绑定
          deps.bindEvents(tables);
          deps.bindOptionEvents(); // <--- 加上这一句，以此确保万无一失
          deps.syncHostRegenerateButtonVisibility($(DICE_ROOT_SELECTOR).last());
          return;
        }
      }
    }

    let lastScrollX = 0;
    let lastScrollY = 0;

    const $oldContent = $('.acu-panel-content');
    if ($oldContent.length) {
      lastScrollX = $oldContent.scrollLeft();
      lastScrollY = $oldContent.scrollTop();
    }

    const tables = deps.processJsonData(rawData || {});

    if (deps.getIsSaving()) {
      deps.setCurrentDiffMap(new Set());
    } else {
      deps.setCurrentDiffMap(deps.generateDiffMap(rawData));
    }

    const savedOrder = deps.getSavedTableOrder();
    let orderedNames = Object.keys(tables);
    if (savedOrder)
      orderedNames = savedOrder.filter(n => tables[n]).concat(orderedNames.filter(n => !savedOrder.includes(n)));

    const hiddenList = deps.getHiddenTables();
    orderedNames = orderedNames.filter(n => !hiddenList.includes(n));

    const activeTab = deps.getActiveTabState();
    let currentTabName = activeTab && tables[activeTab] && !hiddenList.includes(activeTab) ? activeTab : null;

    const config = deps.getConfig();
    const isCollapsed = deps.getCollapsedState();
    const isDashboardActive = !isCollapsed && Store.get(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
    const isChangesPanelActive = !isCollapsed && Store.get('acu_changes_panel_active', false);
    const isGlobalInteractionsActive = !isCollapsed && Store.get(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    const isMvuActive = !isCollapsed && deps.getActiveTabState() === deps.MvuModule.MODULE_ID;
    const shouldShowPanel =
      !isCollapsed &&
      Boolean(isDashboardActive || isChangesPanelActive || isGlobalInteractionsActive || isMvuActive || currentTabName);

    const layoutClass = config.layout === 'vertical' ? 'acu-layout-vertical' : '';
    const horizontalScrollbarClass = config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : '';
    const desktopNavClass = config.desktopNavAligned === true ? 'acu-desktop-nav-aligned' : '';
    const visiblePanelClass = shouldShowPanel ? 'acu-has-visible-panel' : '';
    // [补回这行] 定义导航盘位置样式 (悬浮/嵌入)
    const positionClass = `acu-mode-${config.positionMode || 'fixed'}`;
    const collapseStyle = deps.normalizeCollapseStyle(config.collapseStyle);
    const isFloatingCollapsed = isCollapsed && collapseStyle === 'floating';
    const collapsedStateClass = isCollapsed ? `acu-is-collapsed acu-collapse-${collapseStyle}` : 'acu-is-expanded';

    // [新增] 自动列数 (智能填满) 逻辑
    let finalGridCols = config.gridColumns;
    if (finalGridCols === 'auto') {
      const n = orderedNames.length;

      if (n <= 4) {
        finalGridCols = n < 2 ? 2 : n;
      } else {
        const empty3 = Math.ceil(n / 3) * 3 - n;
        const empty4 = Math.ceil(n / 4) * 4 - n;
        finalGridCols = empty4 <= empty3 ? 4 : 3;
      }
    }

    // --- [修改] 提取选项数据 + 变化检测 ---
    let optionHtml = '';
    let currentOptionHash = null; // 当前选项的指纹

    if (config.showOptionPanel !== false) {
      const checkSuggestionTables = [];
      const optionTables = [];
      Object.keys(tables).forEach(k => {
        const table = tables[k];
        const tableName = table?.name || k;
        if (deps.isCheckSuggestionTableName(tableName)) {
          checkSuggestionTables.push(table);
        } else if (deps.isOptionTableName(tableName)) {
          optionTables.push(table);
        }
      });

      // [修改开始] 添加收起面板的开关 - 叙事书页风重设计
      if (checkSuggestionTables.length > 0 || optionTables.length > 0) {
        const isOptionsCollapsed = deps.getOptionsCollapsedState();
        const collapsedClass = isOptionsCollapsed ? 'collapsed' : '';

        // [修改结束]
        const checkSuggestionItems = checkSuggestionTables.flatMap(table => deps.getCheckSuggestionItemsFromTable(table));
        const optionItems = optionTables.flatMap(table => deps.getOptionItemsFromTable(table));
        const optionCount = checkSuggestionItems.length + optionItems.length;
        const optionValues: string[] = []; // 用于生成指纹

        // 生成标题栏
        let buttonsHtml = `
                    <div class="acu-opt-header" data-action="toggle-options">
                        <span>
                            <span class="acu-opt-chevron" aria-hidden="true"></span>
                            选项面板 (${optionCount})
                        </span>
                    </div>`;

        checkSuggestionItems.forEach(item => {
          buttonsHtml += deps.renderCheckSuggestionOptionButtonHtml(item.displayText, item.commandText);
          optionValues.push(`check:${item.displayText}=>${item.commandText}`);
        });

        optionItems.forEach(item => {
          buttonsHtml += deps.renderOptionButtonHtml(item.text);
          optionValues.push(`option:${item.text}`);
        });

        if (optionCount > 0) {
          optionHtml = `<div class="acu-option-panel acu-theme-${config.theme} ${collapsedClass}">${buttonsHtml}</div>`;
          // 生成选项内容的指纹 (简单拼接)
          // [修复] 将收起状态加入指纹，强制触发重绘
          currentOptionHash =
            optionValues.join('|||') +
            (isOptionsCollapsed ? '_collapsed' : '_expanded') +
            `_theme_${config.theme}` +
            `_optSize_${config.optionFontSize || 12}`;
        }
      }
    }

    // [修改] 判断选项是否变化，并控制可见性
    const optionChanged = currentOptionHash !== deps.getLastOptionHash();
    // [修复] 只要有选项数据，就应该显示面板（而不是仅在内容变化时）
    // 这修复了用户发送消息后 optionPanelVisible 被设为 false 且选项内容未变时无法恢复的问题
    if (currentOptionHash !== null) {
      deps.setOptionPanelVisible(true);
    }
    deps.setLastOptionHash(currentOptionHash); // 更新缓存

    // [修复] 悬浮收起模式需要特殊类，防止 wrapper 坍塌导致按钮消失
    const navMetrics = deps.getNavigationFontMetrics(config.navFontSize);
    const floatingCollapsePosition = isFloatingCollapsed
      ? deps.clampFloatingCollapsePosition(deps.getFloatingCollapsePosition(config))
      : null;
    const floatingCollapseStyle = floatingCollapsePosition
      ? `; position:fixed; left:${floatingCollapsePosition.left}px; top:${floatingCollapsePosition.top}px; right:auto; bottom:auto; width:${deps.FLOATING_COLLAPSE_SIZE}px; height:${deps.FLOATING_COLLAPSE_SIZE}px; max-width:${deps.FLOATING_COLLAPSE_SIZE}px; display:block; visibility:visible; opacity:1; margin:0; transform:none; overflow:visible; pointer-events:none; z-index:1000`
      : '';
    let html = `<div class="acu-wrapper ${DICE_ROOT_CLASS} ${positionClass} ${collapsedStateClass} ${visiblePanelClass} acu-theme-${config.theme} ${layoutClass} ${horizontalScrollbarClass} ${desktopNavClass}" style="--acu-card-width:${config.cardWidth}px; --acu-font-size:${config.fontSize}px; --acu-opt-font-size:${config.optionFontSize || 12}px; --acu-nav-button-size:${navMetrics.buttonSize}px; --acu-nav-font-size:${navMetrics.fontSize}px; --acu-nav-icon-size:${navMetrics.iconSize}px; --acu-nav-button-padding-x:${navMetrics.paddingX}px; --acu-grid-cols:${finalGridCols}${floatingCollapseStyle}">`;

    if (isCollapsed) {
      const colStyleClass = collapseStyle === 'floating' ? 'acu-col-floating' : `acu-col-${collapseStyle}`;
      const alignClass = collapseStyle === 'floating' ? '' : `acu-align-${config.collapseAlign || 'right'}`;
      const expandTitle = collapseStyle === 'floating' ? '打开数据库助手，拖动可移动位置' : '打开数据库助手';

      html += `
                <div class="acu-expand-trigger ${colStyleClass} ${alignClass}" id="acu-btn-expand" role="button" tabindex="0" title="${expandTitle}" aria-label="${expandTitle}">
                    <i class="fa-solid fa-table"></i> <span>数据库助手 (${Object.keys(tables).length})</span>
                </div>
            `;
    } else {
      // [修改] 读取保存的高度
      const activePanelHeightKey = deps.getActivePanelHeightKey();
      const finalSavedHeight = deps.getStoredPanelHeight(activePanelHeightKey);

      html += `
                <div class="acu-data-display ${shouldShowPanel ? 'visible' : ''} ${finalSavedHeight ? 'acu-manual-mode' : ''}" id="acu-data-area" style="${finalSavedHeight ? 'height:' + finalSavedHeight + 'px;' : ''}">
                    ${
                      isGlobalInteractionsActive
                        ? deps.renderGlobalInteractionsPanel(rawData)
                        : isChangesPanelActive
                          ? deps.renderChangesPanel(rawData)
                          : isDashboardActive
                            ? deps.renderDashboard(tables)
                            : isMvuActive
                              ? '<div class="acu-mvu-panel">' + deps.MvuModule.renderPanel() + '</div>'
                              : currentTabName
                                ? deps.renderTableContent(tables[currentTabName], currentTabName)
                                : ''
                    }
                </div>
                `;

      // [修复] 强制写入网格列数，防止浏览器初次渲染时卡成单列
      // PC端(>768px) CSS使用了 display:flex !important，会自动忽略这个 grid 属性，所以很安全
      const gridFixStyle = `grid-template-columns: repeat(${finalGridCols}, 1fr);`;

      html += `
                <div class="acu-nav-container ${config.actionsPosition === 'top' ? 'acu-pos-top' : ''}" id="acu-nav-bar" style="${gridFixStyle}">
                    <div class="acu-order-controls" id="acu-order-hint"><i class="fa-solid fa-arrows-alt"></i> 拖动调整顺序，完成后点击保存退出</div>
                    <div class="acu-nav-items" id="acu-nav-items">
            `;

      // === 计算变更数量 + 验证错误数量（供审核按钮显示） ===
      const isChangesActive = Store.get('acu_changes_panel_active', false);
      const isFavoritesActive = Store.get('acu_favorites_panel_active', false);
      const isSimpleModeNav = Store.get(deps.STORAGE_KEY_VALIDATION_MODE, false);
      let changesCount = 0;
      let validationErrorCount = 0;
      if (rawData) {
        const snapshot = deps.loadSnapshot();
        changesCount = deps.countRuntimeDataChanges(snapshot, rawData);
        // 计算验证错误数量
        validationErrorCount = deps.ValidationEngine.getErrorCount(rawData);
      }
      // 数据验证模式只显示验证错误数量，完整审核模式只显示变更数量
      const isValidationMode = isSimpleModeNav;
      const displayCount = isValidationMode ? validationErrorCount : changesCount;
      // 警告图标只在数据验证模式下且有错误时显示
      const showWarningIcon = isValidationMode && validationErrorCount > 0;

      // === 构建导航按钮（支持排序和隐藏） ===
      const navHiddenList = deps.getHiddenTables();
      const navSavedOrder = deps.getSavedTableOrder() || [];

      // 定义所有导航项（特殊按钮 + 表格）
      const SPECIAL_NAV_ITEMS: SpecialNavigationItem[] = [
        {
          key: '__dashboard__',
          icon: 'fa-chart-line',
          label: '仪表盘',
          id: 'acu-btn-dashboard',
          extraClass: 'acu-dashboard-btn',
          isActive: isDashboardActive,
        },
        { key: '__dice__', icon: 'fa-dice-d20', label: '掷骰', id: 'acu-btn-dice-nav', extraClass: 'acu-dice-nav-btn' },
        {
          key: '__changes__',
          icon: 'fa-code-compare',
          label: `审核${displayCount > 0 ? '(' + displayCount + ')' : ''}`,
          id: 'acu-btn-changes',
          extraClass: `acu-changes-btn${showWarningIcon ? ' has-validation-errors' : ''}`,
          isActive: isChangesActive,
          warningIcon: showWarningIcon,
        },
        {
          key: '__mvu__',
          icon: 'fa-code-branch',
          label: '变量',
          id: 'acu-btn-mvu',
          extraClass: 'acu-mvu-btn',
          isActive: deps.getActiveTabState() === deps.MvuModule.MODULE_ID,
        },
        {
          key: '__favorites__',
          icon: 'fa-star',
          label: '收藏夹',
          id: 'acu-btn-favorites',
          extraClass: 'acu-favorites-btn',
          isActive: isFavoritesActive,
        },
        {
          key: '__global_interactions__',
          icon: 'fa-hand-pointer',
          label: '交互总览',
          id: 'acu-btn-global-interactions',
          extraClass: 'acu-global-interactions-btn',
          isActive: Store.get(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false),
        },
      ];

      // 构建完整的导航项列表
      const allNavItems: NavigationItem[] = [];

      // 添加特殊按钮
      SPECIAL_NAV_ITEMS.forEach(item => {
        // 先检查是否被用户隐藏
        if (navHiddenList.includes(item.key)) return;

        // 对于MVU按钮，总是显示（不再检查是否可用）
        if (item.key === '__mvu__') {
          allNavItems.push({ ...item, isSpecial: true });
          return;
        }

        // 其他按钮的checkAvailable检查
        if (item.checkAvailable && !item.checkAvailable()) return;
        allNavItems.push({ ...item, isSpecial: true });
      });

      // 添加表格标签
      orderedNames.forEach(name => {
        allNavItems.push({
          key: name,
          icon: deps.getIconForTableName(name),
          label: name,
          isSpecial: false,
          isActive: !isDashboardActive && !isChangesActive && currentTabName === name,
        });
      });

      // 应用保存的排序
      if (navSavedOrder.length > 0) {
        const orderMap = new Map(navSavedOrder.map((k, i) => [k, i]));
        allNavItems.sort((a, b) => {
          const aIdx = orderMap.has(a.key) ? orderMap.get(a.key) : a.key === '__dashboard__' ? -1 : 9999;
          const bIdx = orderMap.has(b.key) ? orderMap.get(b.key) : b.key === '__dashboard__' ? -1 : 9999;
          return aIdx - bIdx;
        });
      }

      // 渲染所有导航项（order 从 1 开始，避免移动端 Grid 布局问题）
      allNavItems.forEach((item, idx) => {
        const activeClass = item.isActive ? 'active' : '';
        const extraClass = item.extraClass || '';
        const orderVal = idx + 1;

        if (item.isSpecial) {
          // 特殊按钮
          const warningIconHtml = item.warningIcon
            ? '<i class="fa-solid fa-triangle-exclamation acu-nav-warning-icon"></i>'
            : '';
          html += `<button type="button" class="acu-nav-btn ${extraClass} ${activeClass}" id="${item.id}" data-nav-key="${deps.escapeHtml(item.key)}" style="order: ${orderVal};" title="${deps.escapeHtml(item.label)}" aria-label="${deps.escapeHtml(item.label)}" aria-pressed="${item.isActive ? 'true' : 'false'}">
                        <i class="fa-solid ${item.icon}"></i><span>${deps.escapeHtml(item.label)}</span>${warningIconHtml}
                    </button>`;
        } else {
          // 表格标签
          html += `<button type="button" class="acu-nav-btn acu-nav-table-btn ${activeClass}" data-table="${deps.escapeHtml(item.key)}" style="order: ${orderVal};" title="${deps.escapeHtml(item.label)}" aria-label="打开${deps.escapeHtml(item.label)}" aria-pressed="${item.isActive ? 'true' : 'false'}">
                        <i class="fa-solid ${item.icon}"></i><span>${deps.escapeHtml(item.label)}</span>
                    </button>`;
        }
      });

      html += `</div>`;

      // 渲染固定功能按钮（order 设为最大值，确保在最后）
      html += `<div class="acu-actions-group" id="acu-active-actions" style="order: 9999;">`;
      deps.ACTION_BUTTONS.forEach(btn => {
        html += `<button type="button" class="acu-action-btn" id="${btn.id}" title="${btn.title}" aria-label="${btn.title}"><i class="fa-solid ${btn.icon}"></i></button>`;
      });
      html += `</div>`;

      html += `</div>`; // 关闭 acu-nav-container
    }

    // 嵌入模式使用 column-reverse，选项要写在导航之后，视觉上才会先出现选项再出现导航盘。
    if (config.positionMode === 'embedded' && optionHtml && deps.getOptionPanelVisible() && !isFloatingCollapsed) {
      html += optionHtml;
    }

    html += `</div>`; // 关闭 acu-wrapper

    if (isFloatingCollapsed) {
      const hostDocument = deps.getTavernHostDocument();
      const wrapperNodes = deps.collectHostAndLocalNodes<HTMLElement>(DICE_ROOT_SELECTOR);

      let replaced = false;
      for (const node of wrapperNodes) {
        if (!replaced && node.classList.contains('acu-collapse-floating') && node.parentElement === hostDocument.body) {
          const replacement = deps.createElementFromHtml(hostDocument, html);
          if (replacement) {
            node.replaceWith(replacement);
            replaced = true;
          } else {
            node.remove();
          }
          continue;
        }
        node.remove();
      }

      if (!replaced) {
        const wrapper = deps.createElementFromHtml(hostDocument, html);
        if (wrapper) {
          hostDocument.body.appendChild(wrapper);
        } else {
          $(hostDocument.body).append(html);
        }
      }
    } else if (config.positionMode === 'viewport') {
      const hostDocument = deps.getTavernHostDocument();
      const wrapperNodes = deps.collectHostAndLocalNodes<HTMLElement>(DICE_ROOT_SELECTOR);

      let replaced = false;
      for (const node of wrapperNodes) {
        if (!replaced && node.classList.contains('acu-mode-viewport') && node.parentElement === hostDocument.body) {
          const replacement = deps.createElementFromHtml(hostDocument, html);
          if (replacement) {
            node.replaceWith(replacement);
            replaced = true;
          } else {
            node.remove();
          }
          continue;
        }
        node.remove();
      }
      if (!replaced) deps.insertHtmlToPage(html);
    } else {
      if (config.positionMode === 'embedded') {
        deps.insertHtmlToPage(html);
      } else {
        const $existing = $(DICE_ROOT_SELECTOR);
        if ($existing.length) {
          $existing.replaceWith(html);
        } else {
          deps.insertHtmlToPage(html);
        }
      }
    }
    deps.syncHostRegenerateButtonVisibility($(DICE_ROOT_SELECTOR).last());
    deps.applyStoredPanelHeight(deps.getDataAreaForRoot(), deps.getActivePanelHeightKey());
    requestAnimationFrame(() => {
      deps.applyStoredPanelHeight(deps.getDataAreaForRoot(), deps.getActivePanelHeightKey());
    });
    deps.setupViewportBoundsListeners();
    deps.setupFixedWrapperBoundsListeners();
    deps.setupFloatingCollapseBoundsListeners();
    deps.updateViewportWrapperBounds();
    deps.updateFixedWrapperBounds();
    deps.updateFloatingCollapseBounds();
    requestAnimationFrame(deps.updateViewportWrapperBounds);
    requestAnimationFrame(deps.updateFixedWrapperBounds);
    requestAnimationFrame(() => deps.updateFloatingCollapseBounds());
    requestAnimationFrame(() => {
      deps.ensurePanelNavigationVisible($(DICE_ROOT_SELECTOR).last());
      deps.syncHostRegenerateButtonVisibility($(DICE_ROOT_SELECTOR).last());
    });

    // --- [修改] 悬浮模式下，只有选项变化且可见时才插入 ---
    if (config.positionMode !== 'embedded' && optionHtml && deps.getOptionPanelVisible()) {
      if (optionChanged) {
        // 选项有变化，重新插入到最新 AI 消息
        deps.injectIndependentOptions(optionHtml);
      } else {
        // 选项没变化，检查容器是否还存在且在正确位置
        const $existing = $('.acu-embedded-options-container');
        if ($existing.length === 0) {
          // 容器不存在了（可能被删掉了），重新插入
          deps.injectIndependentOptions(optionHtml);
        } else {
          // [修复] 检查容器是否在最新的 AI 消息上，而不是旧消息
          const $lastAiMes = $('#chat .mes')
            .filter(function () {
              const $this = $(this);
              if ($this.attr('is_user') === 'true' || $this.attr('is_system') === 'true' || $this.hasClass('sys_mes'))
                return false;
              if ($this.find('.name_text').text().trim() === 'System' || $this.attr('data-is-system') === 'true')
                return false;
              if ($this.find('.mes_text').length === 0) return false;
              if ($this.css('display') === 'none') return false;
              return true;
            })
            .last();

          const isOnLatestMessage =
            $lastAiMes.length > 0 && $lastAiMes.find('.acu-embedded-options-container').length > 0;

          if (!isOnLatestMessage) {
            // 容器存在但不在最新消息上，需要重新插入
            deps.injectIndependentOptions(optionHtml);
          } else {
            // [修复] 如果容器存在但不可见（被fadeOut隐藏），强制重新插入
            const containerVisible = $existing.is(':visible');
            const containerDisplay = $existing.css('display');
            const containerHtmlLength = $existing.html()?.length || 0;
            if (!containerVisible || containerDisplay === 'none' || containerHtmlLength === 0) {
              deps.injectIndependentOptions(optionHtml);
            }
          }
        }
      }
    } else if (config.positionMode !== 'embedded') {
      // 没有选项数据时，清理旧的容器
      $('.acu-embedded-options-container').remove();
    } else {
      // [修复] 嵌入式模式：清理悬浮模式遗留的独立选项容器
      $('.acu-embedded-options-container').remove();
    }

    deps.bindEvents(tables);
    deps.bindOptionEvents();
    deps.updateSaveButtonState();
    if (Store.get(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false)) {
      deps.hydrateCustomTableNameIconsIn($('#acu-data-area'));
    }
    // [修复] 仪表盘NPC头像异步加载
    deps.loadDashboardNpcAvatars();
    // [修复] 如果审核面板激活，绑定其事件
    if (Store.get('acu_changes_panel_active', false)) {
      deps.bindChangesEvents();
    }
    if (Store.get(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) {
      deps.hydrateCustomTableNameIconsIn($('#acu-data-area'));
      deps.bindGlobalInteractionEvents($('#acu-data-area'));
    }
    // [修复] 如果变量面板激活，绑定其事件并尝试获取数据
    if (deps.canWriteMvuPanel()) {
      const $panel = $('#acu-data-area');
      if ($panel.length) {
        // 总是尝试获取数据（带重试，增加重试次数）
        // 简化逻辑：直接显示面板，不等待数据加载
        // 用户可以通过刷新按钮来获取数据
        $panel.html('<div class="acu-mvu-panel">' + deps.MvuModule.renderPanel() + '</div>');
        deps.MvuModule.bindEvents($panel);

        // 可选：在后台尝试获取数据（不阻塞界面显示）
        deps.MvuModule.getDataWithRetry(5, 800)
          .then(mvuData => {
            // 如果获取到数据，刷新面板显示
            if (mvuData && deps.canWriteMvuPanel()) {
              $panel.html('<div class="acu-mvu-panel">' + deps.MvuModule.renderPanel() + '</div>');
              deps.MvuModule.bindEvents($panel);
            }
          })
          .catch(err => {
            console.error('[DICE]MvuModule Error getting data:', err);
            if (deps.canWriteMvuPanel()) {
              // 错误时也刷新面板，显示错误状态
              $panel.html('<div class="acu-mvu-panel">' + deps.MvuModule.renderPanel() + '</div>');
              deps.MvuModule.bindEvents($panel);
            }
          });
      }
    }

    setTimeout(() => {
      const $newContent = $('.acu-panel-content');
      const activeTab = deps.getActiveTabState();
      const savedState = deps.getTableScrollStates()[activeTab];

      if ($newContent.length) {
        // 1. 恢复面板整体位置
        // 优先使用 savedState (记忆)，其次使用 lastScrollY (防抖)
        if (savedState) {
          $newContent.scrollTop(savedState.top);
          $newContent.scrollLeft(savedState.left);
        } else {
          if (lastScrollY > 0) $newContent.scrollTop(lastScrollY);
          if (lastScrollX > 0) $newContent.scrollLeft(lastScrollX);
        }

        // 2. 恢复卡片内部滚动位置 (针对长文本)
        if (savedState && savedState.inner) {
          Object.keys(savedState.inner).forEach(key => {
            const scrollTop = savedState.inner[key];
            // 找到对应的行
            const $targetTitle = $newContent.find(`.acu-editable-title[data-row="${key}"]`);
            if ($targetTitle.length) {
              const $card = $targetTitle.closest('.acu-data-card');
              // 恢复卡片本身的滚动 (如果样式是 overflow on card)
              $card.scrollTop(scrollTop);
              // 同时也尝试恢复 body 的滚动 (如果样式是 overflow on body)
              $card.find('.acu-card-body').scrollTop(scrollTop);
            }
          });
        }
      }
    }, 0);

    console.info('[DICE]界面渲染完成');
  };
  return _renderInterfaceImpl;
}
