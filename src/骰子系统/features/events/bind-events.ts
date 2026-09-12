// @ts-nocheck
/**
 * bind-events.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
import { GACHA_RARITY_ORDER } from '../../entities/gacha-items';
import { Store } from '../../shared/storage/store';
import { getDbLockAPI } from '../../shared/misc-utils';
import { getDisplayName, isCharacterTable } from '../../entities/name-alias';
import { getRowKey } from '../../shared/table-utils';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createBindEvents(deps: any) {
  const bindEvents = tables => {
    const { $ } = deps.getCore();
    const $wrapper = $(DICE_ROOT_SELECTOR);
    if (!deps.getTutorialButtonEventsBound()) {
      $('body').on('click.acu_panel_tutorial', '.acu-panel-tutorial-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.startTutorialFromButton(this);
      });
      deps.setTutorialButtonEventsBound(true);
    }

    $wrapper
      .off('click.acu_dashboard_preset_settings')
      .on('click.acu_dashboard_preset_settings', '.acu-dashboard-preset-settings-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.showDashboardPresetManager();
      });

    // [新增] 仪表盘-人物关系图按钮
    $wrapper
      .off('click.acu_dash_relation_graph', '.acu-dash-relation-graph-btn')
      .on('click.acu_dash_relation_graph', '.acu-dash-relation-graph-btn', function (e) {
        e.stopPropagation();
        const allTables = deps.processJsonData(deps.getCachedRawData() || deps.getTableData()) as Record<string, RelationGraphTableInput>;
        const graphSources = deps.getActiveDashboardRelationshipGraphSources();
        if (graphSources.length > 0) {
          const graphTable = deps.buildRelationshipGraphTableFromPreset(allTables, graphSources);
          if (graphTable) {
            deps.showRelationshipGraph(graphTable, { includePlayerRelations: false });
          } else if (window.toastr) {
            window.toastr.warning('自定义人物关系图未解析到关系数据');
          }
          return;
        }
        const npcResult = deps.DashboardDataParser.findTable(allTables, 'npc');
        if (npcResult && npcResult.data) {
          deps.showRelationshipGraph(npcResult.data);
        } else {
          if (window.toastr) window.toastr.warning('未找到人物数据');
        }
      });

    // [新增] 仪表盘-地图可视化按钮
    $wrapper.on('click', '.acu-dash-map-btn', function (e) {
      e.stopPropagation();
      deps.showMapVisualization();
    });

    // 仪表盘-物品栏可视化按钮
    $wrapper.on('click', '.acu-dash-inventory-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      deps.showInventoryVisualization();
    });

    // 仪表盘-骰子商店按钮
    $wrapper.on('click', '.acu-dash-gacha-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      void deps.showGachaVisualization();
    });

    // [新增] 仪表盘-头像管理按钮
    $wrapper.on('click', '.acu-dash-avatar-manager-btn', function (e) {
      e.stopPropagation();

      try {
        // 获取表格数据
        let allTables;
        try {
          const rawData = deps.getCachedRawData() || deps.getTableData();
          allTables = deps.processJsonData(rawData);
        } catch (dataError) {
          console.error('获取表格数据失败:', dataError);
          throw new Error('无法读取表格数据');
        }

        if (!allTables || allTables.length === 0) {
          if (window.toastr) window.toastr.warning('仪表盘数据为空，请先添加表格数据');
          return;
        }

        const nodeArr = deps.collectCurrentChatAvatarNodes(allTables as Record<string, RelationGraphTableInput>);

        // 检查是否有可管理的角色
        if (nodeArr.length === 0) {
          if (window.toastr) {
            window.toastr.warning('未找到角色数据，请先在仪表盘中添加主角或NPC');
          }
          return;
        }

        const $currentRoot = $(this).closest<HTMLElement>(DICE_ROOT_SELECTOR);
        const refreshDashboardFromAvatarManager = () => {
          const $targetRoot = $currentRoot.length ? $currentRoot : $(DICE_ROOT_SELECTOR).last();
          const $panel = deps.getDataAreaForRoot($targetRoot);
          if (!$panel.length || !Store.get(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false)) return;

          const rawData = deps.getCachedRawData() || deps.getTableData();
          const tables = deps.processJsonData(rawData || {});
          $panel.html(deps.renderDashboard(tables));
          deps.hydrateCustomTableNameIconsIn($panel as JQuery<HTMLElement>);
          bindEvents(tables);
          deps.loadDashboardNpcAvatars();
          requestAnimationFrame(() => deps.ensurePanelNavigationVisible($targetRoot));
        };

        // 调用头像管理器（捕获其内部可能的错误）
        try {
          deps.showAvatarManager(nodeArr, refreshDashboardFromAvatarManager);
        } catch (managerError) {
          console.error('showAvatarManager 执行失败:', managerError);
          throw new Error('角色头像预设初始化失败');
        }
      } catch (error) {
        // 记录详细错误到控制台（用于开发者调试）
        console.error('角色头像预设按钮错误:', error);

        // 向用户显示友好的错误提示
        const errorMsg = error instanceof Error ? error.message : '未知错误';
        if (window.toastr) {
          showActionableErrorToast(`打开角色头像预设失败: ${errorMsg}`, { developerHint: true });
        }
      }
    });
    // 仪表盘模块标题点击跳转
    $wrapper.off('click.acu_dash_table_link').on('click.acu_dash_table_link', '.acu-dash-table-link', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const tableNameValue = $(this).data('table');
      const tableName = deps.resolveExistingTableName(tableNameValue);
      if (!tableName) {
        deps.warnMissingTableTarget(tableNameValue);
        return;
      }

      // 关闭仪表盘，切换到对应表格
      Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
      Store.set('acu_changes_panel_active', false); // 同时关闭审核面板
      // [防闪烁] 先更新导航按钮状态，再延迟渲染
      deps.setActiveTableNavButton(tableName);
      deps.saveActiveTabState(tableName);
      setTimeout(() => deps.renderInterface(), 0);
    });

    // [修复] 阻止横向滑动冒泡到 SillyTavern，防止触发"滑动重新生成"
    $('.acu-panel-content')
      .off('touchstart.acu_swipe touchmove.acu_swipe')
      .on('touchstart.acu_swipe', function (e) {
        this._touchStartX = e.originalEvent.touches[0].clientX;
        this._touchStartY = e.originalEvent.touches[0].clientY;
      })
      .on('touchmove.acu_swipe', function (e) {
        if (!this._touchStartX) return;
        const deltaX = Math.abs(e.originalEvent.touches[0].clientX - this._touchStartX);
        const deltaY = Math.abs(e.originalEvent.touches[0].clientY - this._touchStartY);
        // 如果是横向滑动（角度小于45度），阻止冒泡
        if (deltaX > deltaY && deltaX > 10) {
          e.stopPropagation();
        }
      });

    $('body')
      .off('click.acu_nav_toggle')
      .on('click.acu_nav_toggle', '.acu-nav-toggle-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (deps.getIsEditingOrder()) return;
        const currentState = deps.getCollapsedState();
        deps.saveCollapsedState(!currentState);
        deps.renderInterface();
      });

    // [新增] 选项面板折叠事件绑定
    $('body')
      .off('click.acu_opt_toggle')
      .on('click.acu_opt_toggle', '.acu-opt-header[data-action="toggle-options"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const currentState = deps.getOptionsCollapsedState();
        deps.saveOptionsCollapsedState(!currentState);
        deps.renderInterface();
      });

    const $panel = $('.acu-panel-content');
    if ($panel.length) {
      // [优化] 滚动防抖，避免频繁写入硬盘导致卡顿
      let scrollTimer = null;
      $panel.off('scroll.acu_save').on('scroll.acu_save', function () {
        const $this = $(this);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const activeTab = deps.getActiveTabState();
          if (activeTab) {
            if (!deps.getTableScrollStates()[activeTab]) deps.getTableScrollStates()[activeTab] = { top: 0, left: 0, inner: {} };
            deps.getTableScrollStates()[activeTab].top = $this.scrollTop();
            deps.getTableScrollStates()[activeTab].left = $this.scrollLeft();
            // 不再每次滚动都写入，只更新内存，页面卸载时统一保存
          }
        }, 200);
      });
    }

    $('body')
      .off('click.acu_delegate')
      .on('click.acu_delegate', DICE_ROOT_SELECTOR, function (e) {
        if (deps.getIsEditingOrder()) return;
        const $target = $(e.target);

        // [修复] 设置按钮特殊处理 - 无论在哪个位置都优先响应
        const $settingsBtn = $target.closest('#acu-btn-settings');
        if ($settingsBtn.length) {
          e.stopPropagation();
          e.preventDefault();
          deps.showSettingsModal();
          return;
        }

        const $navBtn = $target.closest('.acu-nav-btn');
        if ($navBtn.length) {
          const $currentRoot = $(this as HTMLElement);
          const $rootPanel = deps.getDataAreaForRoot($currentRoot);
          const $rootNavButtons = $currentRoot.find('.acu-nav-btn');

          if ($navBtn.attr('id') === 'acu-btn-dice-nav') {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (deps.getIsEditingOrder()) return false;
            deps.showDicePanel({
              targetValue: null,
              targetName: '',
            });
            return false;
          }

          // [新增] 仪表盘按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-dashboard') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isDashboardActive = Store.get(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isDashboardActive && isPanelVisible) {
              // 仪表盘已打开，关闭面板（直接淡出）
              Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              deps.syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开仪表盘（使用平滑过渡）
              deps.clearAllPanelStates();
              Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, true);
              deps.saveActiveTabState(null);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              deps.switchPanel(
                $panel => {
                  const rawData = deps.getCachedRawData() || deps.getTableData();
                  const tables = deps.processJsonData(rawData || {});
                  $panel.html(deps.renderDashboard(tables));
                  deps.hydrateCustomTableNameIconsIn($panel as JQuery<HTMLElement>);
                  bindEvents(tables);
                  deps.loadDashboardNpcAvatars();
                },
                $currentRoot,
                '仪表盘',
              );
            }
            return false;
          }
          // [新增] 变更审核按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-changes') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isChangesActive = Store.get('acu_changes_panel_active', false);
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isChangesActive && isPanelVisible) {
              // 变更面板已打开，关闭面板（直接淡出）
              Store.set('acu_changes_panel_active', false);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              deps.syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开变更面板（使用平滑过渡）
              deps.clearAllPanelStates(); // [修复] 统一清理所有面板状态
              Store.set('acu_changes_panel_active', true);
              deps.saveActiveTabState(null);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              deps.switchPanel(
                $panel => {
                  const rawData = deps.getCachedRawData() || deps.getTableData();
                  $panel.html(deps.renderChangesPanel(rawData));
                  deps.bindChangesEvents();
                },
                $currentRoot,
                '审核面板',
              );
            }
            return false;
          }
          // [新增] 收藏夹按钮特殊处理 - 使用面板模式
          if ($navBtn.attr('id') === 'acu-btn-favorites') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isFavoritesActive = Store.get('acu_favorites_panel_active', false);
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isFavoritesActive && isPanelVisible) {
              // 收藏夹面板已打开，关闭面板
              Store.set('acu_favorites_panel_active', false);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              deps.syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开收藏夹面板
              deps.clearAllPanelStates(); // [修复] 统一清理所有面板状态
              Store.set('acu_favorites_panel_active', true);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              deps.switchPanel(
                async $panel => {
                  $panel.html(await deps.renderFavoritesPanel());
                  deps.bindFavoritesEvents($panel);
                },
                $currentRoot,
                '收藏夹',
              );
            }
            return false;
          }
          if ($navBtn.attr('id') === 'acu-btn-global-interactions') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isGlobalInteractionsActive = Store.get(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isGlobalInteractionsActive && isPanelVisible) {
              deps.cleanupGlobalInteractionFloatingMenus();
              Store.set(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              deps.syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              deps.clearAllPanelStates();
              Store.set(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, true);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              deps.switchPanel(
                $panel => {
                  const rawData = deps.getCachedRawData() || deps.getTableData();
                  $panel.html(deps.renderGlobalInteractionsPanel(rawData));
                  deps.hydrateCustomTableNameIconsIn($panel);
                  deps.bindGlobalInteractionEvents($panel);
                },
                $currentRoot,
                '交互总览',
              );
            }
            return false;
          }
          // [新增] MVU变量按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-mvu') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isMvuActive = deps.getActiveTabState() === deps.MvuModule.MODULE_ID;
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isMvuActive && isPanelVisible) {
              // 变量面板已打开，关闭面板（直接淡出）
              deps.saveActiveTabState(null);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              deps.syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开变量面板（使用平滑过渡）
              deps.clearAllPanelStates(); // [修复] 统一清理所有面板状态
              deps.saveActiveTabState(deps.MvuModule.MODULE_ID);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              deps.switchPanel(
                $panel => {
                  try {
                    const panelHtml = deps.MvuModule.renderPanel();
                    $panel.html('<div class="acu-mvu-panel">' + panelHtml + '</div>');
                    deps.MvuModule.bindEvents($panel);
                  } catch (error) {
                    console.error('[MVU] Error rendering panel:', error);
                  }

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
                },
                $currentRoot,
                deps.MvuModule.MODULE_ID,
              );
            }
            return false;
          }
          e.stopPropagation();
          const tableNameValue = $navBtn.data('table');
          const tableName = deps.resolveExistingTableName(tableNameValue);
          if (!tableName) {
            deps.warnMissingTableTarget(tableNameValue);
            return false;
          }
          const currentActiveTab = deps.getActiveTabState();
          if (currentActiveTab === tableName && $rootPanel.hasClass('visible')) {
            deps.closePanel($currentRoot);
            return;
          }
          // [修复] 点击普通表格时，清理所有面板状态
          deps.clearAllPanelStates();
          deps.setActiveTableNavButton(tableName);
          if ($('.acu-panel-content').length && currentActiveTab) {
            deps.saveCurrentTabState();
          }
          deps.saveActiveTabState(tableName);
          setTimeout(() => deps.renderInterface(), 0);
          return;
        }
        const $cell = $target.closest('.acu-cell');
        if ($cell.length) {
          e.stopPropagation();
          deps.showCellMenu(e, $cell[0]);
          return;
        }
        const $pageBtn = $target.closest('.acu-page-btn');
        if ($pageBtn.length) {
          e.stopPropagation();
          if ($pageBtn.hasClass('disabled') || $pageBtn.hasClass('active')) return;
          const newPage = parseInt($pageBtn.data('page'));
          const activeTab = deps.getActiveTabState();
          if (activeTab) {
            deps.getTablePageStates()[activeTab] = newPage;
            deps.renderInterface();
            requestAnimationFrame(() => {
              $('.acu-panel-content').scrollTop(0);
            });
          }
          return;
        }
        return;
      });

    const $expandButton = $('#acu-btn-expand') as JQuery<HTMLElement>;
    deps.bindFloatingCollapseDrag($expandButton);
    $expandButton.off('click').on('click', e => {
      e.stopPropagation();
      const $button = $(e.currentTarget);
      if ($button.hasClass('acu-col-floating') && deps.getSuppressNextFloatingCollapseClick()) {
        deps.setSuppressNextFloatingCollapseClick(false);
        return;
      }
      if (deps.getIsEditingOrder()) return;
      deps.saveCollapsedState(false);
      deps.renderInterface();
    });
    // [回归] 收起按钮逻辑
    $('#acu-btn-collapse')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        deps.saveCollapsedState(true);
        deps.renderInterface();
      });

    // 打开可视化表格编辑器按钮
    $('#acu-btn-open-visualizer')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        void deps.openDatabaseVisualizerInterface();
      });

    // [修改] 将收起按钮改为手动更新按钮
    $('#acu-btn-force-update')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        const result = await deps.runDatabaseManualUpdate();
        if (result.status === 'updated') return;

        if (result.status === 'failed') {
          console.error('[DICE]ACU 手动更新失败:', result.error);
          deps.showDatabaseManualUpdateFailure(
            '更新失败',
            deps.getDatabaseManualUpdateErrorMessage(result.error, '更新过程中出现错误'),
          );
          return;
        }

        console.warn('[DICE]ACU manualUpdate API 不可用');
        if (window.toastr) {
          window.toastr.warning('⚠ 后端脚本未提供 manualUpdate 接口，请确保同时也更新了最新的后端脚本', '', {
            timeOut: 5000,
          });
        }
      });

    $('body')
      .off('click.acu_settings')
      .on('click.acu_settings', '#acu-btn-settings', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (deps.getIsEditingOrder()) return;
        deps.showSettingsModal();
      });
    // [新增] 导航栏掷骰按钮
    $('#acu-btn-dice-nav')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        deps.showDicePanel({
          targetValue: null,
          targetName: '', // 留空让 placeholder 显示
          // 不传 diceType，让函数内部使用保存的值
        });
      });

    // 打开数据库
    $('#acu-btn-open-editor')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        void deps.openDatabaseInterface();
      });

    // 重新填表按钮
    $('#acu-btn-refill')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        const result = await deps.runDatabaseManualUpdate();
        if (result.status === 'updated') return;

        if (result.status === 'failed') {
          console.error('[DICE]ACU 手动填表失败:', result.error);
          deps.showDatabaseManualUpdateFailure(
            '填表失败',
            deps.getDatabaseManualUpdateErrorMessage(result.error, '填表过程中出现错误'),
          );
          return;
        }

        console.warn('[DICE]ACU manualUpdate API 不可用');
        if (window.toastr) {
          window.toastr.warning('后端脚本未提供 manualUpdate 接口，请确保同时也更新了最新的后端脚本', '', {
            timeOut: 5000,
          });
        }
      });
    $('#acu-btn-save-global')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        if (deps.getIsEditingOrder()) return;
        let dataToSave = null;
        if (deps.getHasUnsavedChanges() && deps.getCachedRawData()) {
          dataToSave = deps.getCachedRawData();
        } else {
          dataToSave = deps.getTableData();
        }

        if (dataToSave) {
          // 1. 【核心修改】把中间的 false 改为 true，禁止保存后重绘界面
          await deps.saveDataToDatabase(dataToSave, true, true);

          // 2. 【手动善后】因为不重绘了，我们需要手动把界面上的“未保存”红字变回普通颜色
          // 移除所有手动修改的高亮类
          $('.acu-highlight-manual').removeClass('acu-highlight-manual');

          // 3. 清理内部的脏数据标记
          if (window.acuModifiedSet) window.acuModifiedSet.clear();
          deps.setHasUnsavedChanges(false);

          // 4. 手动重置保存按钮的状态（去掉呼吸灯，变回灰色）
          const $btn = $(this);
          const $icon = $btn.find('i');
          $icon.removeClass('acu-icon-breathe fa-spinner fa-spin').addClass('fa-save');
          $btn.attr('title', '保存所有修改').css('color', '');
          $btn.prop('disabled', false);

          // 5. 提示用户
        } else {
          if (window.toastr) showActionableErrorToast('无法获取有效数据，保存失败', { suggestion: 'table' });
        }
      });

    const $searchInput = $('.acu-search-input');
    if ($searchInput.length) {
      deps.bindCompositionSafeSearchInput(
        { root: $searchInput },
        {
          delay: 300,
          onCommit: ({ value, selectionStart, selectionEnd }) => {
            const activeTab = deps.getActiveTabState();
            if (activeTab) {
              deps.getTableSearchStates()[activeTab] = value;
              deps.getTablePageStates()[activeTab] = 1;
              const isFocus = document.activeElement && document.activeElement.classList.contains('acu-search-input');
              deps.renderInterface();
              if (isFocus) {
                const $newInput = $('.acu-search-input');
                $newInput.focus();
                if ($newInput.length && $newInput[0].setSelectionRange) {
                  try {
                    $newInput[0].setSelectionRange(selectionStart, selectionEnd);
                  } catch (e) {}
                }
              }
            }
          },
        },
      );
    }
    // 人物关系图按钮
    $('#acu-btn-relation-graph')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = String($(this).data('table') || '');
        const rawData = deps.getCachedRawData() || deps.getTableData();
        if (rawData) {
          const allTables = deps.processJsonData(rawData) as Record<string, RelationGraphTableInput>;
          const graphSources = deps.getActiveDashboardRelationshipGraphSources();
          if (graphSources.length > 0) {
            const graphTable = deps.buildRelationshipGraphTableFromPreset(allTables, graphSources, { tableName });
            if (graphTable) {
              deps.showRelationshipGraph(graphTable, { includePlayerRelations: false });
              return;
            }
          }

          const currentTable = allTables[tableName];
          if (currentTable) {
            deps.showRelationshipGraph(currentTable, graphSources.length > 0 ? { includePlayerRelations: false } : {});
            return;
          }

          for (const key in rawData) {
            const sheet = rawData[key];
            if (sheet?.name === tableName) {
              const tableData = {
                headers: sheet.content?.[0] || [],
                rows: sheet.content?.slice(1) || [],
                key: key,
              };
              deps.showRelationshipGraph(tableData, graphSources.length > 0 ? { includePlayerRelations: false } : {});
              return;
            }
          }
        }
        if (window.toastr) window.toastr.warning('无法获取表格数据');
      });
    // 表格面板地图可视化按钮
    $('.acu-table-map-btn')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        deps.showMapVisualization();
      });
    $('.acu-table-inventory-btn')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        deps.showInventoryVisualization();
      });
    $('.acu-gacha-open-btn')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        void deps.showGachaVisualization();
      });
    // --- [新增] 移植功能的事件绑定 ---

    // 1. 视图切换
    $('#acu-btn-switch-style')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const styles = deps.getTableStyles();
        const current = styles[tableName] || 'list';
        styles[tableName] = current === 'grid' ? 'list' : 'grid'; // 切换
        deps.saveTableStyles(styles);
        deps.renderInterface(); // 重绘
      });

    // 2. 高度拖拽
    $('.acu-height-drag-handle')
      .off('pointerdown')
      .on('pointerdown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const handle = this;
        handle.setPointerCapture(e.pointerId);
        $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
        const $currentRoot = $(handle).closest<HTMLElement>(DICE_ROOT_SELECTOR);
        const $panel = deps.getDataAreaForRoot($currentRoot);
        const startHeight = deps.getPanelDragStartHeight($panel);
        let requestedHeight = startHeight;
        const startY = e.clientY;
        const tableName = $(handle).data('table');

        handle.onpointermove = function (moveE) {
          const dy = moveE.clientY - startY;
          requestedHeight = deps.setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
        };
        handle.onpointerup = function (upE) {
          $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
          handle.releasePointerCapture(upE.pointerId);
          handle.onpointermove = null;
          handle.onpointerup = null;
          if (tableName) {
            deps.savePanelRequestedHeight(tableName, requestedHeight);
          }
        };
      });

    // 3. 双击重置高度 - 支持整个头部区域触发
    $('.acu-height-drag-handle')
      .off('dblclick')
      .on('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        if (tableName) {
          const $currentRoot = $(this).closest<HTMLElement>(DICE_ROOT_SELECTOR);
          deps.resetPanelRequestedHeight(deps.getDataAreaForRoot($currentRoot), tableName);
        }
      });

    // [新增] 倒序按钮点击事件
    $wrapper.on('click', '.acu-reverse-btn', function (e) {
      e.stopPropagation();
      const tName = $(this).data('table');
      if (!tName) return;

      deps.toggleTableReverse(tName);

      // 重新渲染当前表格
      deps.renderInterface();
    });
    // [新增] 双击头部任意位置也可重置高度
    $('.acu-panel-header')
      .off('dblclick.acu')
      .on('dblclick.acu', function (e) {
        if ($(e.target).closest('.acu-search-input, .acu-close-btn, .acu-view-btn').length) return;
        e.preventDefault();
        e.stopPropagation();
        const tableName = deps.getActiveTabState();
        if (tableName) {
          const $currentRoot = $(this).closest<HTMLElement>(DICE_ROOT_SELECTOR);
          deps.resetPanelRequestedHeight(deps.getDataAreaForRoot($currentRoot), tableName);
        }
      });

    $wrapper
      .find('.acu-close-btn')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $currentRoot = $(this).closest<HTMLElement>(DICE_ROOT_SELECTOR);
        const $currentPanel = deps.getDataAreaForRoot($currentRoot);
        const $input = $currentPanel.find('.acu-search-input');

        // 如果搜索框有内容，清空搜索框
        if ($input.length && $input.val()) {
          $input.val('').trigger('input').focus();
          return;
        }

        // 检查是否是仪表盘状态
        const isDashboardActive = Store.get(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
        if (isDashboardActive) {
          // 仪表盘状态：关闭仪表盘，重新渲染到默认状态
          Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
          deps.saveActiveTabState(null);
          deps.renderInterface();
          return;
        }

        // 检查是否是变量面板状态
        const isMvuActive = deps.getActiveTabState() === deps.MvuModule.MODULE_ID;
        if (isMvuActive) {
          // 变量面板状态：关闭变量面板，重新渲染到默认状态
          deps.saveActiveTabState(null);
          deps.renderInterface();
          return;
        }

        // 普通表格状态：正常关闭面板
        deps.closePanel($currentRoot);
      });
    // [新增] bookmark图标点击事件
    $('body')
      .off('click.acu_bookmark')
      .on('click.acu_bookmark', '.acu-bookmark-icon', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const $icon = $(this);
        const tableName = $icon.data('table');
        const rowKey = $icon.data('row-key');

        if (!tableName || !rowKey) return;

        // 切换bookmark状态
        deps.BookmarkManager.toggleBookmark(tableName, rowKey);

        // 重新渲染表格以更新显示
        if (typeof deps.renderInterface === 'function') {
          deps.renderInterface();
        }
      });

    // [新增] 动作按钮点击事件
    $('body')
      .off('click.acu_action')
      .on('click.acu_action', '.acu-action-item', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const $btn = $(this);
        const rowIdx = parseInt($btn.data('row'), 10);
        const actionIdx = parseInt($btn.data('action-idx'), 10);

        // 获取当前表格信息
        const $card = $btn.closest('.acu-data-card');
        const $title = $card.find('.acu-editable-title');
        const tableKey = $title.data('key');
        const tableName = $title.data('tname') || '';

        // 获取行数据
        const rawData = deps.getCachedRawData() || deps.getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const headers = rawData[tableKey].content[0] || [];
        const rowData = rawData[tableKey].content[rowIdx + 1] || [];

        // [统一] 使用公共函数获取交互选项（默认动作 + AI生成的自定义动作）
        const actions = deps.getInteractOptionsForRow(tableName, headers, rowData);
        const action = actions[actionIdx];
        deps.executeTableInteractionAction(action, headers, rowData);
      });

    // [新增] 全局骰子按钮（面板右上角）
    $('body')
      .off('click.acu_global_dice')
      .on('click.acu_global_dice', '#acu-btn-dice', function (e) {
        e.stopPropagation();
        deps.showDicePanel({
          targetValue: 50,
          targetName: '自定义检定',
          diceType: '1d100',
        });
      });
    // ========== [新增代码开始] ==========
    // 仪表盘地点列表的展开/收起交互
    $('body')
      .off('click.acu_location_toggle')
      .on('click.acu_location_toggle', '.acu-location-header', function (e) {
        e.stopPropagation();
        const $group = $(this).closest('.acu-location-group');
        $group.toggleClass('expanded');
      });

    // [新增] 仪表盘跳转功能：点击"查看全部"或地点项，跳转到对应表格
    $('body')
      .off('click.acu_dash_jump')
      .on('click.acu_dash_jump', '.acu-dash-jump-link, .acu-dash-loc-item', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const tableNameValue = $(this).data('table');
        const tableName = deps.resolveExistingTableName(tableNameValue);
        const searchTerm = $(this).data('search') || '';

        if (!tableName) {
          deps.warnMissingTableTarget(tableNameValue);
          return;
        }

        // 1. 关闭仪表盘
        Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);

        // 2. 切换到目标表格
        deps.saveActiveTabState(tableName);
        deps.setActiveTableNavButton(tableName);

        // 3. 如果有搜索词，设置搜索状态
        if (searchTerm) {
          deps.getTableSearchStates()[tableName] = searchTerm;
          deps.getTablePageStates()[tableName] = 1;
        }

        // 4. 重新渲染
        deps.renderInterface();

        // 5. 聚焦搜索框（如果有搜索词）
        if (searchTerm) {
          setTimeout(() => {
            const $input = $('.acu-search-input');
            if ($input.length) $input.focus();
          }, 100);
        }
      });
    // ========== [新增代码结束] ==========
    // [新增] 表格卡片内联骰子图标点击事件
    $('body')
      .off('click.acu_inline_dice')
      .on('click.acu_inline_dice', '.acu-inline-dice-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // 使用 .attr() 直接读取，避免 jQuery 驼峰转换问题
        const attrName = $(this).attr('data-attr-name') || '属性';
        const attrValue = parseInt($(this).attr('data-attr-value'), 10) || 50;

        // 获取卡片标题作为实体名称（NPC名字等）
        const $card = $(this).closest('.acu-data-card');
        const cardTitle = $card.find('.acu-editable-title').text().trim();

        // 判断是否是主角相关表格（如果是主角表，仍用<user>）
        const tableName = $card.find('.acu-editable-title').data('tname') || '';
        const isPlayerTable = tableName.includes('主角');
        const initiatorName = isPlayerTable ? '<user>' : cardTitle;

        deps.showDicePanel({
          attrValue: attrValue,
          targetValue: null, // 让showDicePanel根据模式自动计算
          targetName: attrName,
          initiatorName: initiatorName,
          // 不传 diceType，使用保存的值
        });
      });
    // [新增] 仪表盘骰子检定按钮
    $('body')
      .off('click.acu_dash_dice')
      .on('click.acu_dash_dice', '.acu-dash-dice-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const targetValue = parseInt($(this).data('target'), 10) || 50;
        const targetName = $(this).data('name') || '属性';
        const npcName = $(this).data('npc') || '';

        // 如果是NPC的属性，直接打开对抗检定
        if (npcName) {
          // 修复：尝试获取主角的同名属性值
          const playerAttrValue = deps.getAttributeValue('<user>', targetName) || 50;
          deps.showContestPanel({
            initiatorName: '<user>',
            initiatorValue: playerAttrValue,
            opponentName: npcName,
            opponentValue: targetValue,
          });
        } else {
          deps.showDicePanel({
            attrValue: targetValue,
            targetValue: null,
            targetName: targetName,
            initiatorName: '<user>',
          });
        }
      });
    // [新增] 已知地区"前往"按钮
    $('body')
      .off('click.acu_dash_goto')
      .on('click.acu_dash_goto', '.acu-dash-goto-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const locationName = $(this).data('location') || '未知地点';
        const promptText = `<user>前往${locationName}。`;
        deps.smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    // [新增] 背包物品"使用"按钮
    $('body')
      .off('click.acu_dash_use_item')
      .on('click.acu_dash_use_item', '.acu-dash-use-item-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const itemName = $(this).data('item') || '物品';
        const promptText = `<user>使用${itemName}。`;
        deps.smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    deps.bindCompositionSafeSearchInput(
      {
        root: $('body'),
        selector: '.acu-inventory-filter[data-filter="search"]',
        namespace: 'acu_inventory_filter',
      },
      {
        delay: 140,
        onCommit: ({ input, value, selectionStart }) => {
          const filterKey = String(input.dataset.filter || '');
          if (!filterKey) return;
          deps.saveInventoryFilters({ [filterKey]: value });
          deps.refreshInventoryVisualization({ focusSearch: true, cursor: selectionStart });
        },
      },
    );
    $('body')
      .off('click.acu_inventory_filter_collapse')
      .on('click.acu_inventory_filter_collapse', '.acu-inventory-filter-collapse-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const $collapsible = $(this).closest('.acu-inventory-filter-collapsible');
        const nextCollapsed = !$collapsible.hasClass('collapsed');
        $collapsible.toggleClass('collapsed', nextCollapsed);
        deps.saveInventoryFiltersCollapsedState(nextCollapsed);
      });
    $('body')
      .off('click.acu_inventory_filter_btn')
      .on('click.acu_inventory_filter_btn', '.acu-inventory-filter-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const filterKey = String($(this).data('filter') || '');
        const rawValue = String($(this).data('value') || '');
        if (!filterKey || !rawValue) return;
        const filters = deps.getInventoryFilters();
        const nextValue =
          filterKey === 'sort' ? rawValue : filters[filterKey as 'type' | 'quality'] === rawValue ? '全部' : rawValue;
        deps.saveInventoryFilters({ [filterKey]: nextValue });
        deps.refreshInventoryVisualization();
      });
    $('body')
      .off('click.acu_gacha_pool_btn')
      .on('click.acu_gacha_pool_btn', '.acu-gacha-pool-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const nextPoolTag = String($(this).data('pool-tag') || '').trim() as GachaPoolTag;
        if (!deps.getConfiguredGachaPoolDefinitions().some(pool => pool.id === nextPoolTag)) return;
        void deps.updateGachaPoolTag(nextPoolTag);
      });
    $('body')
      .off('click.acu_gacha_draw_btn')
      .on('click.acu_gacha_draw_btn', '.acu-gacha-draw-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const drawCount = Number.parseInt(String($(this).data('draw-count') || '1'), 10);
        void deps.performGachaDraw(drawCount >= 10 ? 10 : 1);
      });
    $('body')
      .off('click.acu_gacha_fortune_clear')
      .on('click.acu_gacha_fortune_clear', '.acu-gacha-fortune-clear', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void deps.clearGachaFortune();
      });
    $('body')
      .off('click.acu_gacha_shard_shop_open')
      .on('click.acu_gacha_shard_shop_open', '.acu-gacha-shard-shop-open', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void deps.showGachaShardShop();
      });
    $('body')
      .off('click.acu_gacha_settings_open')
      .on('click.acu_gacha_settings_open', '.acu-gacha-settings-open', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void deps.showGachaSettingsDialog();
      });
    $('body')
      .off('click.acu_gacha_shard_shop_close')
      .on('click.acu_gacha_shard_shop_close', '.acu-gacha-shard-shop-close', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $('.acu-gacha-shard-shop-overlay').remove();
      });
    $('body')
      .off('click.acu_gacha_shard_tab')
      .on('click.acu_gacha_shard_tab', '.acu-gacha-shard-tab', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const rarity = String($(this).data('rarity') || '').trim() as GachaRarity;
        if (!GACHA_RARITY_ORDER.includes(rarity)) return;
        deps.saveStoredGachaShardShopRarity(rarity);
        deps.refreshGachaShardShop();
      });
    $('body')
      .off('click.acu_gacha_shard_pool_tab')
      .on('click.acu_gacha_shard_pool_tab', '.acu-gacha-shard-pool-tab', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const nextPoolTag = String($(this).data('pool-tag') || '').trim() as GachaPoolTag;
        if (!deps.getVisibleGachaPoolConfigDefinitions().some(pool => pool.id === nextPoolTag)) return;
        deps.updateGachaPoolTag(nextPoolTag);
      });
    const debugWindow = window as Window & { _acuGachaShardDebugBound?: boolean };
    if (!debugWindow._acuGachaShardDebugBound) {
      document.addEventListener(
        'click',
        event => {
          const target = event.target instanceof Element ? event.target : null;
          if (!target?.closest('.acu-gacha-shard-shop-overlay')) return;
          const buyButton = target.closest('.acu-gacha-shard-buy-btn');
          const itemCard = target.closest('.acu-gacha-shard-item-card');
          console.debug('[ACU][GachaShard] click capture', {
            target,
            buyButton,
            itemCard,
            itemId: buyButton?.getAttribute('data-item-id') || itemCard?.getAttribute('data-item-id') || '',
            targetClasses: target.getAttribute('class') || '',
          });
        },
        true,
      );
      debugWindow._acuGachaShardDebugBound = true;
    }
    $('body')
      .off('click.acu_gacha_shard_exchange')
      .on('click.acu_gacha_shard_exchange', '.acu-gacha-shard-buy-btn', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        const itemId = String($(this).data('item-id') || '').trim();
        console.debug('[ACU][GachaShard] buy button handler', {
          itemId,
          currentTarget: this,
          target: e.target,
        });
        if (!itemId) return;
        deps.showGachaShardExchangeConfirm(itemId);
      });
    $('body')
      .off('click.acu_gacha_shard_detail')
      .on('click.acu_gacha_shard_detail', '.acu-gacha-shard-detail-btn', function (e) {
        if ($(e.target).closest('.acu-gacha-shard-buy-btn').length) {
          console.debug('[ACU][GachaShard] detail handler skipped for buy button', {
            target: e.target,
            currentTarget: this,
          });
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        const itemId = String($(this).data('item-id') || '').trim();
        console.debug('[ACU][GachaShard] detail handler', {
          itemId,
          currentTarget: this,
          target: e.target,
        });
        if (!itemId) return;
        deps.showGachaPickupItemDetail(itemId);
      });
    $('body')
      .off('click.acu_gacha_pickup_detail')
      .on('click.acu_gacha_pickup_detail', '.acu-gacha-pickup-detail-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const itemId = String($(this).data('item-id') || '').trim();
        if (!itemId) return;
        deps.showGachaPickupItemDetail(itemId);
      });
    $('body')
      .off('click.acu_gacha_recent_detail')
      .on('click.acu_gacha_recent_detail', '.acu-gacha-recent-detail-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const itemId = String($(this).data('item-id') || '').trim();
        const itemName = String($(this).data('item-name') || '').trim();
        const itemQuality = String($(this).data('item-quality') || '').trim();
        deps.showGachaRecentRewardDetail(itemId, itemName, itemQuality);
      });
    $('body')
      .off('click.acu_gacha_open_btn')
      .on('click.acu_gacha_open_btn', '.acu-gacha-open-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void deps.showGachaVisualization();
      });
    $('body')
      .off('click.acu_gacha_inventory_open')
      .on('click.acu_gacha_inventory_open', '.acu-gacha-inventory-open', function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.showInventoryVisualization();
      });
    $('body')
      .off('click.acu_gacha_open_table')
      .on('click.acu_gacha_open_table', '.acu-gacha-open-table', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const tableNameValue = $(this).data('table');
        const tableName = deps.resolveExistingTableName(tableNameValue);
        if (!tableName) {
          deps.warnMissingTableTarget(tableNameValue);
          return;
        }
        deps.closeGachaVisualization();
        Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
        Store.set('acu_changes_panel_active', false);
        deps.saveActiveTabState(tableName);
        deps.setActiveTableNavButton(tableName);
        setTimeout(() => deps.renderInterface(), 0);
      });
    $('body')
      .off('click.acu_gacha_close')
      .on('click.acu_gacha_close', '.acu-gacha-close', function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.closeGachaVisualization();
      });
    $('body')
      .off('click.acu_inventory_card')
      .on('click.acu_inventory_card', '.acu-inventory-card [data-action]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const $card = $(this).closest('.acu-inventory-card');
        const rowIndex = Number.parseInt(String($card.data('row-index')), 10);
        const action = String($(this).data('action') || 'detail');
        if (Number.isNaN(rowIndex)) return;
        deps.handleInventoryAction(rowIndex, action);
        if (action !== 'detail' && action !== 'gift') $('#send_textarea').focus();
      });
    $('body')
      .off('click.acu_inventory_detail_menu')
      .on('click.acu_inventory_detail_menu', '.acu-inventory-detail-menu-target', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const $target = $(this);
        const rowIndex = Number.parseInt(String($target.closest('.acu-inventory-detail').data('row-index')), 10);
        if (Number.isNaN(rowIndex)) return;
        const menuScope = String($target.data('menu-scope') || 'card') as InventoryMenuScope;
        const fieldKey = String($target.data('field-key') || '') as InventoryEditableField;
        deps.showInventoryDetailMenu(e, rowIndex, menuScope, fieldKey || undefined, this as HTMLElement);
      });
    $('body')
      .off('click.acu_inventory_open_table')
      .on('click.acu_inventory_open_table', '.acu-inventory-open-table', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const tableNameValue = $(this).data('table');
        const tableName = deps.resolveExistingTableName(tableNameValue);
        if (!tableName) {
          deps.warnMissingTableTarget(tableNameValue);
          return;
        }
        deps.closeInventoryVisualization();
        Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
        Store.set('acu_changes_panel_active', false);
        deps.saveActiveTabState(tableName);
        deps.setActiveTableNavButton(tableName);
        deps.renderInterface();
      });
    $('body')
      .off('click.acu_inventory_close')
      .on('click.acu_inventory_close', '.acu-inventory-close', function (e) {
        e.stopPropagation();
        e.preventDefault();
        deps.closeInventoryVisualization();
      });
    // [新增] 技能列表"使用"按钮 - 使用技能并进行检定
    $('body')
      .off('click.acu_dash_use_skill')
      .on('click.acu_dash_use_skill', '.acu-dash-use-skill-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const skillName = $(this).data('skill') || '技能';

        // 查找该技能的属性值或熟练度
        const rawData = deps.getCachedRawData() || deps.getTableData();
        let checkValue = null;

        if (rawData) {
          // 查找技能表
          for (const key in rawData) {
            const sheet = rawData[key];
            if (!sheet || !sheet.name || !sheet.content) continue;
            if (sheet.name.includes('技能') || sheet.name.includes('能力')) {
              const headers = sheet.content[0] || [];
              // 动态查找列索引
              const foundNameIdx = headers.findIndex(h => h && (h.includes('名称') || h.includes('技能名')));
              const nameIdx = foundNameIdx >= 0 ? foundNameIdx : 1;
              const attrValIdx = headers.findIndex(h => h && h.includes('属性值'));
              const profIdx = headers.findIndex(h => h && (h.includes('熟练') || h.includes('等级')));

              for (let i = 1; i < sheet.content.length; i++) {
                const row = sheet.content[i];
                if (row && row[nameIdx === -1 ? 1 : nameIdx] === skillName) {
                  // 优先取属性值
                  if (attrValIdx > 0 && row[attrValIdx]) {
                    const val = deps.extractNumericValue(row[attrValIdx]);
                    if (val > 0) {
                      checkValue = val;
                      break;
                    }
                  }
                  // 回退到熟练度
                  if (profIdx > 0 && row[profIdx]) {
                    const val = deps.extractNumericValue(row[profIdx]);
                    if (val > 0) {
                      checkValue = val;
                      break;
                    }
                  }
                  break;
                }
              }
              if (checkValue !== null) break;
            }
          }
        }

        // 先填入使用技能的文本
        const promptText = `<user>使用${skillName}。`;
        deps.smartInsertToTextarea(promptText, 'action');

        // 如果有有效数值，打开掷骰面板进行检定
        if (checkValue !== null && checkValue > 0) {
          deps.showDicePanel({
            attrValue: checkValue,
            targetValue: null,
            targetName: skillName,
            initiatorName: '<user>',
          });
        } else {
          // 没有有效数值，只聚焦输入框
          $('#send_textarea').focus();
        }
      });
    // [新增] 进行中任务"追踪"按钮
    $('body')
      .off('click.acu_dash_track_task')
      .on('click.acu_dash_track_task', '.acu-dash-track-task-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const taskName = $(this).data('task') || '任务';
        const promptText = `<user>将${taskName}设为当前追踪目标。`;
        deps.smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    // [新增] 重要人物"发消息"按钮
    $('body')
      .off('click.acu_dash_msg')
      .on('click.acu_dash_msg', '.acu-dash-msg-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const npcName = $(this).data('npc') || '对方';
        const config = deps.getConfig();

        // 移除已有的弹窗
        $('.acu-msg-overlay').remove();

        const overlay = $(`
            <div class="acu-msg-overlay acu-theme-${config.theme}" role="dialog" aria-modal="true" aria-label="发送消息">
                <div class="acu-msg-dialog">
                    <div class="acu-msg-title">
                        <i class="fa-solid fa-comment"></i> 发送消息给 ${deps.escapeHtml(npcName)}
                    </div>
                    <input type="text" id="acu-msg-input" class="acu-msg-input" placeholder="输入消息内容..." autofocus>
                    <div class="acu-msg-actions">
                        <button type="button" id="acu-msg-cancel" class="acu-msg-cancel">取消</button>
                        <button type="button" id="acu-msg-send" class="acu-msg-send">发送</button>
                    </div>
                </div>
            </div>
        `);

        $('body').append(overlay);
        const overlayEl = overlay[0];
        overlayEl.style.setProperty('position', 'fixed', 'important');
        overlayEl.style.setProperty('top', '0', 'important');
        overlayEl.style.setProperty('left', '0', 'important');
        overlayEl.style.setProperty('right', '0', 'important');
        overlayEl.style.setProperty('bottom', '0', 'important');
        overlayEl.style.setProperty('width', '100vw', 'important');
        overlayEl.style.setProperty('height', '100vh', 'important');
        overlayEl.style.setProperty('display', 'flex', 'important');
        overlayEl.style.setProperty('justify-content', 'center', 'important');
        overlayEl.style.setProperty('align-items', 'center', 'important');
        overlayEl.style.setProperty('z-index', '31100', 'important');
        setTimeout(() => overlay.find('#acu-msg-input').focus(), 50);

        const sendMessage = () => {
          const msg = overlay.find('#acu-msg-input').val().trim();
          if (msg) {
            const promptText = `<user>对${npcName}说："${msg}"`;
            deps.smartInsertToTextarea(promptText, 'action');
            $('#send_textarea').focus();
          }
          overlay.remove();
        };

        // 点击发送
        overlay.find('#acu-msg-send').click(sendMessage);

        // 回车发送
        overlay.find('#acu-msg-input').on('keydown', function (ev) {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            sendMessage();
          }
        });

        // 点击取消或背景关闭
        overlay.find('#acu-msg-cancel').click(() => overlay.remove());
        deps.setupOverlayClose(overlay, 'acu-msg-overlay', () => overlay.remove());
      });
    // [新增] NPC对抗检定按钮
    $('body')
      .off('click.acu_dash_contest')
      .on('click.acu_dash_contest', '.acu-dash-contest-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const npcName = $(this).data('npc') || '';

        const playerAttr = deps.getFullAttributesForCharacter('<user>')[0];
        const npcAttr = npcName ? deps.getFullAttributesForCharacter(String(npcName))[0] : null;
        const playerAttrValue = playerAttr?.value ?? 50;
        const npcAttrValue = npcAttr?.value ?? 50;

        deps.showContestPanel({
          initiatorName: '<user>',
          initiatorValue: playerAttrValue,
          opponentName: npcName,
          opponentValue: npcAttrValue,
          diceType: '1d100',
        });
      });

    // [新增] 弹窗内单元格点击菜单支持（全局委托）
    // 使用 $('body') 而非 $(document)，确保在 iframe 环境下正确工作
    $('body')
      .off('click.acu_preview_cell_menu')
      .on('click.acu_preview_cell_menu', '.acu-preview-overlay .acu-cell', function (e) {
        console.log('[DICE] preview cell click triggered', this, $(this).data());
        // 排除关闭按钮
        if ($(e.target).closest('.acu-preview-close').length) return;

        const $this = $(this);
        const existingMenu = $('.acu-cell-menu');

        // [修复] Toggle 行为：同一单元格再次点击则关闭菜单
        if (existingMenu.length) {
          const menuCellId = existingMenu.data('cell-id');
          const thisCellId = `${$this.data('key')}-${$this.data('row')}-${$this.data('col')}`;
          if (menuCellId === thisCellId) {
            $('.acu-cell-menu, .acu-menu-backdrop').remove();
            return;
          }
        }

        e.stopPropagation();
        e.preventDefault();
        deps.showCellMenu(e, this);

        // 记录当前菜单对应的单元格ID，用于 toggle 判断
        const cellId = `${$this.data('key')}-${$this.data('row')}-${$this.data('col')}`;
        $('.acu-cell-menu').data('cell-id', cellId);
      });

    // [重构] 仪表盘预览功能：复用表格卡片渲染，完整功能
    $('body')
      .off('click.acu_dash_preview')
      .on('click.acu_dash_preview', '.acu-dash-preview-trigger', function (e) {
        e.stopPropagation();

        const tableKey = deps.safeDecodeURIComponent(String($(this).data('table-key') ?? ''));
        const rowIndex = parseInt(deps.safeDecodeURIComponent(String($(this).data('row-index') ?? '')), 10);

        if (!tableKey || isNaN(rowIndex)) return;

        const rawData = deps.getCachedRawData() || deps.getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const table = rawData[tableKey];
        const tableName = table.name || '详情';
        const headers = table.content[0] || [];
        const rowData = table.content[rowIndex + 1];

        if (!rowData) return;

        const config = deps.getConfig();
        const title = rowData[1] || '未命名';
        const titleDisplay = isCharacterTable(tableName) ? getDisplayName(String(title)) : String(title);

        // 复用 renderTableContent 中的卡片渲染逻辑
        const titleColIndex = 1;
        const realRowIdx = rowIndex;

        // [新增] 获取数据库锁定状态API
        const dbLockApi = getDbLockAPI();
        const sheetKey = dbLockApi ? deps.getSheetKeyByTableName(tableName) : null;
        const lockState = dbLockApi && sheetKey ? dbLockApi.getTableLockState(sheetKey) : null;

        // [新增] 计算行锁定状态（在循环外部计算一次）
        const lockRowKey = getRowKey(tableName, rowData, headers);
        const dbRowIndex = sheetKey && lockRowKey ? deps.findRowIndexByPrimaryKey(sheetKey, tableName, lockRowKey) : null;
        const isCardRowLocked =
          lockState && dbRowIndex !== null ? (lockState.rows?.includes(dbRowIndex) ?? false) : false;

        // [新增] 计算标题列锁定状态
        const isTitleLocked =
          isCardRowLocked ||
          (lockState && dbRowIndex !== null
            ? (lockState.cells?.includes(`${dbRowIndex}:${titleColIndex - 1}`) ?? false)
            : false);

        // 构建卡片内容（复用主表格的渲染逻辑）
        let cardBody = '';
        rowData.forEach((cell, cIdx) => {
          if (cIdx <= 0 || cIdx === titleColIndex) return;
          const currentHeader = headers[cIdx] || '';
          if (currentHeader.includes('交互')) return; // 隐藏交互选项列

          // [修复] 计算锁定状态：整行锁定或单元格锁定
          // [修复] cIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
          const isThisCellLocked =
            lockState && dbRowIndex !== null
              ? (lockState.cells?.includes(`${dbRowIndex}:${cIdx - 1}`) ?? false)
              : false;
          const isThisFieldLocked = isCardRowLocked || isThisCellLocked;

          const renderedCell = deps.renderDataCardCellContent({
            rawHeaderName: headers[cIdx] || '属性' + cIdx,
            cell,
            isFieldLocked: isThisFieldLocked,
            numericDiceMarginLeft: true,
          });
          if (!renderedCell.shouldRender) return;
          const { headerName, contentHtml, hideLabel } = renderedCell;

          const rowClass = 'acu-card-row acu-cell' + (hideLabel ? ' acu-hide-label' : '');
          cardBody += `<div class="${rowClass}" data-key="${deps.escapeHtml(tableKey)}" data-tname="${deps.escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${cIdx}" data-val="${deps.safeEncodeURIComponent(cell ?? '')}">
                <div class="acu-card-label"><span data-locked="${isThisFieldLocked}">${deps.escapeHtml(headerName)}</span></div>
                <div class="acu-card-value">${contentHtml}</div>
            </div>`;
        });

        // [统一] 使用公共函数获取交互选项（默认动作 + AI生成的自定义动作）
        // [修复] 原逻辑直接覆盖默认选项，现改为追加合并
        const tableActions = deps.getInteractOptionsForRow(tableName, headers, rowData);
        let actionsHtml = '';
        if (tableActions.length > 0) {
          const actionBtns = tableActions
            .map(
              (act, actIdx) =>
                `<button class="acu-action-item ${act.type === 'check' ? 'check-type' : ''}" data-action-idx="${actIdx}" data-row="${realRowIdx}"><i class="fa-solid ${act.icon || 'fa-play'}"></i> ${deps.escapeHtml(act.label)}</button>`,
            )
            .join('');
          actionsHtml = `<div class="acu-card-actions">${actionBtns}</div>`;
        }

        // 构建完整卡片
        const cardHtml = `
            <div class="acu-preview-overlay acu-theme-${config.theme}" style="--acu-card-width:${config.cardWidth}px;--acu-font-size:${config.fontSize}px;">
                <div class="acu-data-card" style="width:90vw;max-width:420px;max-height:85vh;overflow-y:auto;">
                    <div class="acu-card-header">
                        <span class="acu-card-index">#${realRowIdx + 1}</span>
                    <span class="acu-cell acu-editable-title" data-key="${deps.escapeHtml(tableKey)}" data-tname="${deps.escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${titleColIndex}" data-val="${deps.safeEncodeURIComponent(title)}" data-locked="${isTitleLocked}">${deps.escapeHtml(titleDisplay)}</span>
                        <button type="button" class="acu-preview-close acu-card-preview-close" title="关闭" aria-label="关闭卡片预览"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-card-body view-list">${cardBody}</div>
                    ${actionsHtml}
                </div>
            </div>
        `;

        $('.acu-preview-overlay').remove();
        $('body').append(cardHtml);

        // 强制样式修复
        const overlayEl = $('.acu-preview-overlay')[0];
        if (overlayEl) {
          overlayEl.style.setProperty('position', 'fixed', 'important');
          overlayEl.style.setProperty('top', '0', 'important');
          overlayEl.style.setProperty('left', '0', 'important');
          overlayEl.style.setProperty('right', '0', 'important');
          overlayEl.style.setProperty('bottom', '0', 'important');
          overlayEl.style.setProperty('width', '100vw', 'important');
          overlayEl.style.setProperty('height', '100vh', 'important');
          overlayEl.style.setProperty('display', 'flex', 'important');
          overlayEl.style.setProperty('justify-content', 'center', 'important');
          overlayEl.style.setProperty('align-items', 'center', 'important');
        }

        // 关闭事件
        const $previewOverlay = $('.acu-preview-overlay');
        deps.setupOverlayClose($previewOverlay, 'acu-preview-overlay', () => $previewOverlay.remove());
        $previewOverlay.on('click', function (ev) {
          if ($(ev.target).closest('.acu-preview-close').length) {
            $(this).remove();
          }
        });
      });

    // === [修复] 移动端审核面板：阻止水平滑动冒泡，防止触发 ST 的 swipe regenerate ===
    (function () {
      const $doc = $(document);
      let touchStartX = 0;
      let touchStartY = 0;

      // 使用事件委托，监听整个 data-area
      $doc.on('touchstart.acuSwipeFix', '#acu-data-area', function (e) {
        if (e.originalEvent.touches.length === 1) {
          touchStartX = e.originalEvent.touches[0].clientX;
          touchStartY = e.originalEvent.touches[0].clientY;
        }
      });

      $doc.on('touchmove.acuSwipeFix', '#acu-data-area', function (e) {
        if (e.originalEvent.touches.length !== 1) return;

        const touch = e.originalEvent.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        // 如果是水平滑动为主（X位移 > Y位移 * 1.5），阻止冒泡
        if (deltaX > deltaY * 1.5 && deltaX > 10) {
          e.stopPropagation();
          console.log('[DICE]ACU 阻止水平滑动冒泡，防止 ST swipe');
        }
      });
    })();
  };
  return bindEvents;
}
