// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=45「收藏夹面板 (旧弹窗版本 - 已废弃，保留用于兼容)」
// 原行范围：bak 50711-70757（当前文件 274-20319，含 banner 268-272）；拆分批次 13；外部 closure 依赖：275（36 条直连 import 268 名 + 35 个共享 let 读写回调）
// 落点说明：本段为「收藏夹面板（旧弹窗版本）+ 模板检查/设置弹窗 + 视口锚定/渲染调度 + gacha 卡池运行时（数据层/抽卡/背包/商店/可视化）+
//   收藏面板绑定/编辑弹窗」多子模块连续体（sections.json 中无子 banner，无法按子模块拆分），其中 gacha 运行时与面板绑定占正文 70% 以上；
//   语义上属收藏夹族（FavoritesManager/BookmarkManager 依赖方向一致），故落点 favorites/legacy-favorites-panel.ts
//   （与 bookmark-manager/favorites-manager/favorites-db/local-avatar-db 平级，均为单向引用、不引用 index.ts）。
// 接线说明：
//   已拆模块直连 import 25 条（268 个名字，见下；均不引用本文件，模块图无环）；共享 let 状态（批次6/10/11/12模式）声明保留 index.ts IIFE 内
//   （ESM import 绑定只读），本文件经 __wireLegacyFavoritesPanelDeps 注入 35 个 get/set 读写回调：
//   cachedRawData/hasUnsavedChanges/currentDiffMap/isSaving/isSettingsOpen 复用批次11 回调；isEditingOrder/observer 复用批次10 回调
//   （新增 setIsEditingOrder/getOptionPanelVisible）；isAutoTransforming/tablePageStates/tableSearchStates/tableScrollStates/lastOptionHash/
//   gachaHeartbeatTimer/gachaShopUiRefreshTimer/gachaShopRootElement/tutorialButtonEventsBound 为新增回调；
//   cleanupGlobalInteractionOutsideCapture 复用批次12 回调（仅写）；未注入时模块级引用为 null（全部仅在运行时函数内调用，
//   注入先于任何调用，与 IIFE 内原时序等价）。
//   gachaCatalogCache/gachaCatalogLoadTask 声明随本文件迁移（正文模块内状态，index.ts 批次11 的 get/set 回调删除，
//   改由本文件导出的 getGachaCatalogCache/setGachaCatalogCache/getGachaCatalogLoadTask/setGachaCatalogLoadTask 直连 import 提供）。
// 正文改写（批次13 记录在案，EXACT-MATCH 其余逐字一致）：共享 let 读写改写 182 处——cachedRawData 69 处（68 读 getCachedRawData() +
//   1 处多行赋值 setCachedRawData(structuredClone(...))）、hasUnsavedChanges 4、currentDiffMap 17（10 赋值 setCurrentDiffMap / 7 读 getCurrentDiffMap().has）、
//   isSaving 2、isSettingsOpen 12、isEditingOrder 16、observer 3、isAutoTransforming 6、tablePageStates 9 / tableSearchStates 8 /
//   tableScrollStates 6（属性访问改 getXxx()[k]，共享对象原地变更）、lastOptionHash 2、optionPanelVisible 3、
//   gachaHeartbeatTimer 2、gachaShopUiRefreshTimer 11、gachaShopRootElement 9、tutorialButtonEventsBound 2、
//   cleanupGlobalInteractionOutsideCapture 1（setCleanupGlobalInteractionOutsideCapture(() => {...})）。
// 类型（GachaCatalogRecord/DiceRawData/AdvancedDicePreset 等定义于已拆模块或 IIFE 内）仅作类型标注，@ts-nocheck 下无运行时影响。
import { executeCheckSuggestionCommand } from '../api';
import { ACTION_BUTTONS, ACTION_ICON_MAP, DASHBOARD_TABLE_CONFIG, DashboardDataParser, FONTS, Store, THEMES, applyStoredPanelHeight, areAllTablesReversed, buildGlobalInteractionGroups, buildRelationshipGraphTableFromPreset, canWriteMvuPanel, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGlobalInteractionOutsideCapture, clearModalStack, collectCurrentChatAvatarNodes, collectHostAndLocalNodes, createAutoRegexTransformKey, createElementFromHtml, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, downloadAiPromptFile, downloadJsonFile, downloadJsoncFile, executeTableInteractionAction, extractNumericValue, getActiveDashboardRelationshipGraphSources, getActivePanelHeightKey, getActiveTabState, getAttributeValue, getBadgeStyle, getCheckSuggestionItemsFromTable, getCollapsedState, getCore, getCurrentChatAvatarNodes, getCurrentContextFingerprint, getDashboardModuleConfig, getDashboardNpcListData, getDatabaseManualUpdateErrorMessage, getFullAttributesForCharacter, getHiddenTables, getIconForTableName, getInteractOptionsForRow, getJsonLikeErrorMessage, getNavigationFontMetrics, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getSavedTableOrder, getStoredPanelHeight, getTableStyles, getTavernHostDocument, getTavernHostWindow, isCheckSuggestionTableName, isOptionTableName, isRecord, isRecordValue, isTableReversed, isTwoDimensionalArray, loadSnapshot, normalizeCollapseStyle, normalizeInteractionLabel, openDatabaseInterface, openDatabaseVisualizerInterface, parseAttributeString, parseJsoncRecord, parseJsoncValue, pickTextFile, popModal, pushModal, rememberAutoRegexTransform, renderCheckSuggestionOptionButtonHtml, renderDataCardCellContent, renderOptionButtonHtml, resetPanelRequestedHeight, runDatabaseManualUpdate, saveActiveTabState, saveCollapsedState, saveHiddenTables, saveOptionsCollapsedState, savePanelRequestedHeight, saveSnapshot, saveTableOrder, saveTableStyles, setAllTablesReverse, setPanelRequestedHeight, shouldShowReverseButton, shouldSkipAutoRegexTransform, showContestPanel, showCustomTableNameIconManager, showDatabaseManualUpdateFailure, showDicePanel, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showMapVisualization, showRelationshipGraph, toggleTableReverse, updateSaveButtonState, validateJsoncEditorConfig } from '../dashboard/dashboard';
import { NameAliasRegistry, createCustomTableNameIconContext, createGlobalInteractionCustomTableNameIconContext, getDisplayName, getElementEmoji, getGachaItemCustomTableNameIconContext, getLocationEmoji, hydrateCustomTableNameIconsIn, isCharacterTable, refreshDialogueIndentRender, renderCustomTableNameIconContent, renderGachaItemIconContent, renderIcon, renderThemeIconContent, scheduleDialogueIndentRender } from '../engine/character-name-resolver';
import { DICE_ROOT_CLASS, DICE_ROOT_SELECTOR, HOST_REGENERATE_BUTTON_SELECTOR, HOST_REGENERATE_HIDDEN_CLASS } from '../engine/constants';
import { BUILTIN_GACHA_POOL_DEFINITIONS, FORTUNE_CURRENCY_NAME, GACHA_ACTIVE_HEARTBEAT_MS, GACHA_ACTIVE_SECONDS_PER_FORTUNE, GACHA_CATALOG_EXPORT_KIND, GACHA_CATALOG_VERSION, GACHA_CHARS_PER_FORTUNE, GACHA_CHECK_REWARD, GACHA_DRAW_COST_SINGLE, GACHA_DRAW_COST_TEN, GACHA_ITEM_DEFINITIONS, GACHA_LEGEND_PITY_THRESHOLD, GACHA_MESSAGE_REWARD, GACHA_POOL_TAGS, GACHA_RARE_PITY_THRESHOLD, GACHA_RARITY_ORDER, GACHA_RARITY_WEIGHTS, GACHA_RECENT_REWARD_LIMIT, GACHA_REWARD_TARGETS, GACHA_SHARD_VALUES, GACHA_UNIQUE_RARITY } from '../engine/gacha-items';
import { MvuModule, getDiceConfig, hideDiceResultsInUserMessages } from '../engine/mvu-visualizer';
import { PRESET_FORMAT_VERSION, SCRIPT_VERSION } from '../engine/preset-constants';
import { getRowKey, isNpcTableName, warnTableTemplateIssue, withTableTemplateCheckHint } from '../engine/primary-keys';
import { BookmarkManager, DATA_VALIDATION_DEPRECATED_META, GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_CATALOG_RAW_ROW_INDEX_PROP, GACHA_SHARD_EXCHANGE_COST, GACHA_SHOP_UI_REFRESH_MS, GACHA_TEST_DEFAULT_FORTUNE, MAX_ACTION_BUTTONS, STORAGE_KEY_ACTION_ORDER, STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, STORAGE_KEY_GACHA_STATE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_INVENTORY_FILTERS, STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, STORAGE_KEY_INVENTORY_METADATA, buildAvatarBackgroundStyle, clearComposerIfCurrentText, consumePendingHumanInputSnapshot, countUnicodeCharacters, escapeHtml, formatCssImageUrl, getResolvedComposerText, lastHumanInputActivityAt, renderDeprecatedBadge, safeDecodeURIComponent, safeEncodeURIComponent, sendChatTextAndTrigger, setupOverlayClose, showPresetConflictDialog, smartInsertToTextarea, stripSystemInjectedContent } from './bookmark-manager';
import { AvatarManager, FavoritesManager, replaceUserPlaceholders } from './favorites-manager';
import { LocalAvatarDB } from './local-avatar-db';
import { findRowIndexByPrimaryKey, getDbLockAPI, getSheetKeyByTableName } from '../infra/db-adapter';
import { showDebugConsoleModal } from '../misc/show-debug-console-modal';
import { showSmartFixModal } from '../misc/smart-edit-modal';
import { TableTemplateRequirementPresetManager, buildGachaCatalogAgentPrompt, buildNewTableTemplateRequirementPresetJsoncTemplate, buildTableTemplateRequirementPresetAgentPrompt, getTableTemplateRequirementPresetStats, parseTableTemplateRequirementPresetJson } from '../presets/advanced-dice-preset-manager';
import { buildGachaCatalogAgentPromptFilename, buildTableTemplateRequirementPresetAgentPromptFilename, createSortableList, showPresetListDialog } from '../presets/advanced-dice-preset-ui';
import { showAttributePresetManager } from '../presets/attribute-preset-manager-ui';
import { showDashboardPresetManager } from '../presets/dashboard-preset-manager-ui';
import { showActionPresetManager } from '../presets/interaction-rule-preset-manager';
import { showRenderPresetManager } from '../presets/render-preset-manager-ui';
import { BUILTIN_REGEX_RULES } from '../regex/builtin-regex-rules';
import { refreshRegexRulesList } from '../regex/regex-list-refresh';
import { RegexPresetManager } from '../regex/regex-preset-manager';
import { RegexTransformationEngine } from '../regex/regex-transformation-engine';
import { RegexTransformationManager } from '../regex/regex-transformation-manager';
import { STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_RULES } from '../regex/regex-types';
import { showAddRegexRuleModal } from '../regex/show-add-regex-rule-modal';
import { convertTavernRegexToRule } from '../regex/tavern-regex-import';
import { appendRowInstantly, asDiffRecord, assertCrudEnumConstraints, assertCrudInsertRequiredCells, assertCrudLengthConstraints, assertCrudRequiredColumnsRepresented, bindTutorialButtonsIn, buildCrudColumnAliasMap, buildCrudEnumConstraintMap, buildCrudRequiredHeaderSet, clearDiceLocalCacheData, cloneDiceConfigBackupValue, cloneRuntimeDataValue, countRuntimeDataChanges, createDiffRowMatcher, deleteRowInstantly, findDiffSnapshotEntry, findRuntimeSheetEntryForMutation, generateDiffMap, getConfig, getCrudColumnNameForHeader, getCrudSqlTableName, getDbChatMessages, getDiffDataRow, getDiffRowDisplayTitle, getDiffSheetByKey, getDiffSheetIdentity, getRuntimeErrorMessage, getSheetHeaders, getTableData, getTutorialButtonHtml, hasSheetKeys, normalizeDiffRow, normalizeDiffText, performSaveDataOnly, processJsonData, removeDiffDataRow, restoreMutableRuntimeValue, runInSaveQueue, saveConfig, saveDataToDatabase, saveRowInstantly, saveSheetsViaJsonFloorWithoutTracking, setDiffDataCell, setDiffDataRow, showAvatarManager, showCardEditModal, showDiceConfigBackupDialog, showManualUpdateDialog, startTutorialFromButton, takeDiffRowMatch } from '../settings/dice-settings';
import { TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT, buildTableTemplateAppendRepairPlan, cloneTemplateValue, inspectTableTemplateWithPreset, normalizeTableTemplateRequirementPreset } from '../template/table-template-requirements';
import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { normalizeDialogueIndentStrategy } from '../ui/dialogue-indent-renderer';
import { PresetManager, ValidationRuleManager } from '../validation/preset-manager';
import { ValidationEngine } from '../validation/validation-engine';
import { RULE_TYPE_INFO, STORAGE_KEY_VALIDATION_MODE } from '../validation/validation-rule-manager';
import { showAddValidationRuleModal } from '../validation/validation-rule-modal';

let getCachedRawData = null;
let setCachedRawData = null;
let getHasUnsavedChanges = null;
let setHasUnsavedChanges = null;
let getCurrentDiffMap = null;
let setCurrentDiffMap = null;
let getIsSaving = null;
let setIsSaving = null;
let getIsSettingsOpen = null;
let setIsSettingsOpen = null;
let getIsEditingOrder = null;
let setIsEditingOrder = null;
let getObserver = null;
let setObserver = null;
let getIsAutoTransforming = null;
let setIsAutoTransforming = null;
let getTablePageStates = null;
let setTablePageStates = null;
let getTableSearchStates = null;
let setTableSearchStates = null;
let getTableScrollStates = null;
let setTableScrollStates = null;
let getLastOptionHash = null;
let setLastOptionHash = null;
let getOptionPanelVisible = null;
let setOptionPanelVisible = null;
let getGachaHeartbeatTimer = null;
let setGachaHeartbeatTimer = null;
let getGachaShopUiRefreshTimer = null;
let setGachaShopUiRefreshTimer = null;
let getGachaShopRootElement = null;
let setGachaShopRootElement = null;
let getTutorialButtonEventsBound = null;
let setTutorialButtonEventsBound = null;
let setCleanupGlobalInteractionOutsideCapture = null;

export function __wireLegacyFavoritesPanelDeps(deps) {
  getCachedRawData = deps.getCachedRawData;
  setCachedRawData = deps.setCachedRawData;
  getHasUnsavedChanges = deps.getHasUnsavedChanges;
  setHasUnsavedChanges = deps.setHasUnsavedChanges;
  getCurrentDiffMap = deps.getCurrentDiffMap;
  setCurrentDiffMap = deps.setCurrentDiffMap;
  getIsSaving = deps.getIsSaving;
  setIsSaving = deps.setIsSaving;
  getIsSettingsOpen = deps.getIsSettingsOpen;
  setIsSettingsOpen = deps.setIsSettingsOpen;
  getIsEditingOrder = deps.getIsEditingOrder;
  setIsEditingOrder = deps.setIsEditingOrder;
  getObserver = deps.getObserver;
  setObserver = deps.setObserver;
  getIsAutoTransforming = deps.getIsAutoTransforming;
  setIsAutoTransforming = deps.setIsAutoTransforming;
  getTablePageStates = deps.getTablePageStates;
  setTablePageStates = deps.setTablePageStates;
  getTableSearchStates = deps.getTableSearchStates;
  setTableSearchStates = deps.setTableSearchStates;
  getTableScrollStates = deps.getTableScrollStates;
  setTableScrollStates = deps.setTableScrollStates;
  getLastOptionHash = deps.getLastOptionHash;
  setLastOptionHash = deps.setLastOptionHash;
  getOptionPanelVisible = deps.getOptionPanelVisible;
  setOptionPanelVisible = deps.setOptionPanelVisible;
  getGachaHeartbeatTimer = deps.getGachaHeartbeatTimer;
  setGachaHeartbeatTimer = deps.setGachaHeartbeatTimer;
  getGachaShopUiRefreshTimer = deps.getGachaShopUiRefreshTimer;
  setGachaShopUiRefreshTimer = deps.setGachaShopUiRefreshTimer;
  getGachaShopRootElement = deps.getGachaShopRootElement;
  setGachaShopRootElement = deps.setGachaShopRootElement;
  getTutorialButtonEventsBound = deps.getTutorialButtonEventsBound;
  setTutorialButtonEventsBound = deps.setTutorialButtonEventsBound;
  setCleanupGlobalInteractionOutsideCapture = deps.setCleanupGlobalInteractionOutsideCapture;
}

export function getGachaCatalogCache() { return gachaCatalogCache; }
export function setGachaCatalogCache(value) { gachaCatalogCache = value; }
export function getGachaCatalogLoadTask() { return gachaCatalogLoadTask; }
export function setGachaCatalogLoadTask(value) { gachaCatalogLoadTask = value; }
  // ========================================
  // ========================================
  // 收藏夹面板 (旧弹窗版本 - 已废弃，保留用于兼容)
  // 新版本使用 renderFavoritesPanel() + bindFavoritesEvents() 面板模式
  // ========================================
  /** @deprecated 使用新的面板模式 renderFavoritesPanel() 替代 */
  const showFavoritesPanel = async () => {
    const { $ } = getCore();
    $('.acu-favorites-overlay').remove();

    const config = getConfig();

    // 获取所有收藏和标签
    const allFavorites = await FavoritesManager.getAll();
    const allTags = await FavoritesManager.getAllTags();

    // 获取当前聊天的表格（用于新建卡片选择模板）
    const rawData = getCachedRawData() || getTableData();
    const currentTables = rawData || {};

    // 按标签分组
    const groupedByTag: Record<string, FavoriteItem[]> = {};
    const untagged: FavoriteItem[] = [];

    for (const fav of allFavorites) {
      if (fav.tags && fav.tags.length > 0) {
        for (const tag of fav.tags) {
          if (!groupedByTag[tag]) groupedByTag[tag] = [];
          groupedByTag[tag].push(fav);
        }
      } else {
        untagged.push(fav);
      }
    }

    // 生成卡片HTML
    const renderFavoriteCard = (fav: FavoriteItem) => {
      const preview = fav.header
        .slice(0, 3)
        .map(
          (h, i) =>
            `<span class="acu-fav-preview-item"><b>${escapeHtml(h)}:</b> ${escapeHtml(String(fav.rowData[i] || ''))}</span>`,
        )
        .join('');
      const tagsHtml = fav.tags.map(tag => `<span class="acu-favorites-tag">${escapeHtml(tag)}</span>`).join('');
      const sourceInfo = fav.sourceInfo ? `来自: ${escapeHtml(fav.sourceInfo.tableName)}` : '';

      return `
        <div class="acu-favorites-card" data-id="${escapeHtml(fav.id)}">
          <div class="acu-favorites-card-header">
            <div class="acu-favorites-card-preview">${preview}</div>
            <div class="acu-favorites-card-source">${sourceInfo}</div>
          </div>
          <div class="acu-favorites-card-tags">${tagsHtml}</div>
          <div class="acu-favorites-card-actions">
            <button class="acu-fav-btn acu-fav-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
            <button class="acu-fav-btn acu-fav-copy" title="复制"><i class="fa-solid fa-copy"></i></button>
            <button class="acu-fav-btn acu-fav-send" title="发送到表格"><i class="fa-solid fa-paper-plane"></i></button>
            <button class="acu-fav-btn acu-fav-delete" title="删除"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    };

    // 生成分组内容HTML
    let contentHtml = '';

    // 按标签分组显示
    for (const tag of Object.keys(groupedByTag).sort()) {
      contentHtml += `
        <div class="acu-favorites-group">
          <div class="acu-favorites-group-title"><i class="fa-solid fa-tag"></i> ${escapeHtml(tag)} (${groupedByTag[tag].length})</div>
          <div class="acu-favorites-group-cards">
            ${groupedByTag[tag].map(renderFavoriteCard).join('')}
          </div>
        </div>
      `;
    }

    // 无标签的平铺显示
    if (untagged.length > 0) {
      contentHtml += `
        <div class="acu-favorites-group">
          <div class="acu-favorites-group-title"><i class="fa-solid fa-inbox"></i> 未分类 (${untagged.length})</div>
          <div class="acu-favorites-group-cards">
            ${untagged.map(renderFavoriteCard).join('')}
          </div>
        </div>
      `;
    }

    if (allFavorites.length === 0) {
      contentHtml = `
        <div class="acu-favorites-empty">
          <i class="fa-solid fa-star" style="font-size: 48px; opacity: 0.3;"></i>
          <p>暂无收藏</p>
          <p style="font-size: 12px; opacity: 0.7;">右键点击表格行 → 选择"收藏此行"</p>
        </div>
      `;
    }

    // 标签筛选下拉
    const tagFilterOptions = allTags
      .map(tag => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`)
      .join('');

    const overlayHtml = `
      <div class="acu-favorites-overlay acu-theme-${config.theme}">
        <div class="acu-favorites-panel">
          <div class="acu-favorites-header">
            <h3><i class="fa-solid fa-star"></i> 收藏夹</h3>
            <div class="acu-favorites-header-actions">
              <button class="acu-fav-header-btn" id="acu-fav-new" title="新建卡片"><i class="fa-solid fa-plus"></i> 新建</button>
              <button class="acu-fav-header-btn" id="acu-fav-import" title="导入"><i class="fa-solid fa-file-import"></i> 导入</button>
              <button class="acu-fav-header-btn" id="acu-fav-export" title="导出"><i class="fa-solid fa-file-export"></i> 导出</button>
              <button class="acu-fav-header-btn acu-fav-close" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-favorites-filter">
            <select id="acu-fav-tag-filter">
              <option value="">全部标签</option>
              ${tagFilterOptions}
            </select>
            <input type="text" id="acu-fav-search" placeholder="搜索收藏..." />
          </div>
          <div class="acu-favorites-content">
            ${contentHtml}
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-favorites-overlay');
    const $panel = $overlay.find('.acu-favorites-panel');

    // 关闭面板
    const closePanel = () => {
      $overlay.remove();
    };

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-favorites-overlay')) {
        closePanel();
      }
    });

    $panel.find('.acu-fav-close').on('click', closePanel);

    // 标签筛选
    $panel.find('#acu-fav-tag-filter').on('change', async function () {
      const tag = $(this).val() as string;
      const filtered = tag ? await FavoritesManager.getByTag(tag) : await FavoritesManager.getAll();
      const $content = $panel.find('.acu-favorites-content');

      if (filtered.length === 0) {
        $content.html('<div class="acu-favorites-empty"><p>没有匹配的收藏</p></div>');
      } else {
        $content.html(`<div class="acu-favorites-group-cards">${filtered.map(renderFavoriteCard).join('')}</div>`);
      }
    });

    // 搜索
    $panel.find('#acu-fav-search').on('input', async function () {
      const query = ($(this).val() as string).toLowerCase().trim();
      const all = await FavoritesManager.getAll();
      const filtered = query
        ? all.filter(fav => {
            const headerMatch = fav.header.some(h => h.toLowerCase().includes(query));
            const dataMatch = fav.rowData.some(d => String(d).toLowerCase().includes(query));
            const tagMatch = fav.tags.some(t => t.toLowerCase().includes(query));
            return headerMatch || dataMatch || tagMatch;
          })
        : all;

      const $content = $panel.find('.acu-favorites-content');
      if (filtered.length === 0) {
        $content.html('<div class="acu-favorites-empty"><p>没有匹配的收藏</p></div>');
      } else {
        $content.html(`<div class="acu-favorites-group-cards">${filtered.map(renderFavoriteCard).join('')}</div>`);
      }
    });

    // 编辑卡片
    $panel.on('click', '.acu-fav-edit', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const fav = await FavoritesManager.getById(id);
      if (!fav) return;

      showFavoriteEditModal(fav, async updated => {
        await FavoritesManager.updateFavorite(id, updated);
        toastr.success('保存成功');
        closePanel();
        showFavoritesPanel();
      });
    });

    // 复制卡片
    $panel.on('click', '.acu-fav-copy', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const result = await FavoritesManager.duplicateFavorite(id);
      if (result) {
        toastr.success('复制成功');
        closePanel();
        showFavoritesPanel();
      } else {
        showActionableErrorToast('复制失败', { suggestion: '请重试复制；如果仍失败，请刷新收藏面板后再试。' });
      }
    });

    // 发送到表格
    $panel.on('click', '.acu-fav-send', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const fav = await FavoritesManager.getById(id);
      if (!fav) return;

      const compatible = FavoritesManager.findCompatibleTables(fav, currentTables);
      if (compatible.length === 0) {
        toastr.warning('当前聊天没有兼容的表格');
        return;
      }

      showSendToTableModal(fav, compatible, currentTables, () => {
        toastr.success('发送成功');
        closePanel();
        renderInterface();
      });
    });

    // 删除卡片
    $panel.on('click', '.acu-fav-delete', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除收藏',
        message: '确定要删除这个收藏吗？',
        detail: '删除后需要重新从表格行收藏才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除收藏',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;

      const result = await FavoritesManager.deleteFavorite(id);
      if (result) {
        toastr.success('删除成功');
        $(this)
          .closest('.acu-favorites-card')
          .fadeOut(200, function () {
            $(this).remove();
          });
      } else {
        showActionableErrorToast('删除失败', { title: '收藏删除失败', suggestion: 'save' });
      }
    });

    // 新建卡片
    $panel.find('#acu-fav-new').on('click', () => {
      const tableKeys = Object.keys(currentTables);
      if (tableKeys.length === 0) {
        toastr.warning('当前聊天没有表格模板');
        return;
      }

      showNewFavoriteModal(currentTables, async (header, tableName) => {
        const emptyRowData = header.map(() => '');
        const newFav = await FavoritesManager.addFavorite('', tableName, header, emptyRowData, []);
        if (newFav) {
          toastr.success('创建成功');
          closePanel();
          showFavoritesPanel();
          // 立即打开编辑
          setTimeout(async () => {
            const freshFav = await FavoritesManager.getById(newFav.id);
            if (freshFav) {
              showFavoriteEditModal(freshFav, async updated => {
                await FavoritesManager.updateFavorite(newFav.id, updated);
                toastr.success('保存成功');
                $('.acu-favorites-overlay').remove();
                showFavoritesPanel();
              });
            }
          }, 100);
        }
      });
    });

    // 导出
    $panel.find('#acu-fav-export').on('click', async () => {
      const json = await FavoritesManager.exportFavorites();
      if (!json) {
        showActionableErrorToast('导出失败', { title: '收藏导出失败', suggestion: 'importExport' });
        return;
      }

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      a.href = url;
      a.download = `favorites_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toastr.success('导出成功');
    });

    // 导入
    $panel.find('#acu-fav-import').on('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const result = await FavoritesManager.importFavorites(text);
          if (result) {
            toastr.success(`导入成功: ${result.added}项新增, ${result.updated}项更新`);
            closePanel();
            showFavoritesPanel();
          } else {
            showActionableErrorToast('导入失败: 格式无效', { suggestion: 'importExport' });
          }
        } catch (err) {
          showActionableErrorToast('导入失败: ' + (err instanceof Error ? err.message : String(err)), {
            suggestion: 'importExport',
          });
        }
      };
      input.click();
    });
  };

  // 收藏卡片编辑弹窗
  const showFavoriteEditModal = (fav: FavoriteItem, onSave: (updated: Partial<FavoriteItem>) => void) => {
    const { $ } = getCore();
    $('.acu-fav-edit-overlay').remove();

    const config = getConfig();

    // 生成编辑行HTML
    const renderEditRows = (header: string[], rowData: (string | number)[]) => {
      return header
        .map(
          (h, i) => `
        <div class="acu-fav-edit-row" data-index="${i}">
          <input type="text" class="acu-fav-edit-header" value="${escapeHtml(h)}" placeholder="列名" />
          <input type="text" class="acu-fav-edit-value" value="${escapeHtml(String(rowData[i] || ''))}" placeholder="值" />
          <button class="acu-fav-edit-remove" title="删除列"><i class="fa-solid fa-minus"></i></button>
        </div>
      `,
        )
        .join('');
    };

    const overlayHtml = `
      <div class="acu-fav-edit-overlay acu-theme-${config.theme}">
        <div class="acu-fav-edit-modal">
          <div class="acu-fav-edit-modal-header">
            <h4>编辑收藏</h4>
            <button class="acu-fav-edit-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-fav-edit-modal-body">
            <div class="acu-fav-edit-tags-section">
              <label>标签 (逗号分隔):</label>
              <input type="text" id="acu-fav-edit-tags" value="${escapeHtml(fav.tags.join(', '))}" />
            </div>
            <div class="acu-fav-edit-rows">
              ${renderEditRows(fav.header, fav.rowData)}
            </div>
            <button class="acu-fav-edit-add-col"><i class="fa-solid fa-plus"></i> 添加列</button>
          </div>
          <div class="acu-fav-edit-modal-footer">
            <button class="acu-fav-edit-cancel">取消</button>
            <button class="acu-fav-edit-save">保存</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-fav-edit-overlay');
    const $modal = $overlay.find('.acu-fav-edit-modal');

    const closeModal = () => $overlay.remove();

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-fav-edit-overlay')) closeModal();
    });

    $modal.find('.acu-fav-edit-close, .acu-fav-edit-cancel').on('click', closeModal);

    // 删除列
    $modal.on('click', '.acu-fav-edit-remove', function () {
      $(this).closest('.acu-fav-edit-row').remove();
    });

    // 添加列
    $modal.find('.acu-fav-edit-add-col').on('click', () => {
      const newIndex = $modal.find('.acu-fav-edit-row').length;
      const newRowHtml = `
        <div class="acu-fav-edit-row" data-index="${newIndex}">
          <input type="text" class="acu-fav-edit-header" value="" placeholder="列名" />
          <input type="text" class="acu-fav-edit-value" value="" placeholder="值" />
          <button class="acu-fav-edit-remove" title="删除列"><i class="fa-solid fa-minus"></i></button>
        </div>
      `;
      $modal.find('.acu-fav-edit-rows').append(newRowHtml);
    });

    // 保存
    $modal.find('.acu-fav-edit-save').on('click', () => {
      const newHeader: string[] = [];
      const newRowData: (string | number)[] = [];

      $modal.find('.acu-fav-edit-row').each(function () {
        const h = $(this).find('.acu-fav-edit-header').val() as string;
        const v = $(this).find('.acu-fav-edit-value').val() as string;
        if (h.trim()) {
          newHeader.push(h.trim());
          newRowData.push(v);
        }
      });

      const tagsStr = ($modal.find('#acu-fav-edit-tags').val() as string) || '';
      const newTags = tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      onSave({
        header: newHeader,
        rowData: newRowData,
        tags: newTags,
      });

      closeModal();
    });
  };

  // 标签输入弹窗（替代浏览器原生 prompt）
  const showTagInputModal = (): Promise<string | null> => {
    const { $ } = getCore();
    const config = getConfig();

    return new Promise(resolve => {
      $('.acu-fav-tag-overlay').remove();

      const overlayHtml = `
        <div class="acu-fav-tag-overlay acu-theme-${config.theme}">
          <div class="acu-fav-tag-modal">
            <div class="acu-fav-tag-modal-header">
              <h4><i class="fa-solid fa-tags"></i> 添加标签</h4>
              <button class="acu-fav-tag-close"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="acu-fav-tag-modal-body">
              <div class="acu-fav-tag-input-section">
                <label>标签（多个标签用逗号分隔，留空则无标签）</label>
                <input type="text" id="acu-fav-tag-input" placeholder="例如：武器, 稀有, 攻击" />
              </div>
            </div>
            <div class="acu-fav-tag-modal-footer">
              <button class="acu-fav-tag-cancel">取消</button>
              <button class="acu-fav-tag-confirm">确认收藏</button>
            </div>
          </div>
        </div>
      `;

      $('body').append(overlayHtml);

      const $overlay = $('.acu-fav-tag-overlay');
      // 内联样式确保移动端层叠上下文正确（与发送到表格弹窗同策略）
      $overlay.css({
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100vw',
        height: '100vh',
        'z-index': '31300',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        padding: '16px',
        'box-sizing': 'border-box',
      });
      const $modal = $overlay.find('.acu-fav-tag-modal');
      const $input = $modal.find('#acu-fav-tag-input');
      let resolved = false;

      const closeModal = (result: string | null) => {
        if (resolved) return;
        resolved = true;
        $overlay.remove();
        resolve(result);
      };

      // 点击遮罩关闭
      $overlay.on('click', e => {
        if ($(e.target).hasClass('acu-fav-tag-overlay')) closeModal(null);
      });

      // 关闭/取消按钮
      $modal.find('.acu-fav-tag-close, .acu-fav-tag-cancel').on('click', () => closeModal(null));

      // 确认按钮
      $modal.find('.acu-fav-tag-confirm').on('click', () => {
        closeModal(($input.val() as string) || '');
      });

      // 回车确认
      $input.on('keydown', (e: JQuery.KeyDownEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          closeModal(($input.val() as string) || '');
        }
      });

      // 自动聚焦输入框
      setTimeout(() => $input.trigger('focus'), 100);
    });
  };

  // 新建收藏弹窗（选择模板）
  const showNewFavoriteModal = (
    currentTables: Record<string, any>,
    onCreate: (header: string[], tableName: string) => void,
  ) => {
    const { $ } = getCore();
    $('.acu-fav-new-overlay').remove();

    const config = getConfig();

    const tableOptions = Object.keys(currentTables)
      .map(key => {
        const table = currentTables[key];
        const name = table.name || key;
        return `<option value="${escapeHtml(key)}">${escapeHtml(name)}</option>`;
      })
      .join('');

    const overlayHtml = `
      <div class="acu-fav-new-overlay acu-theme-${config.theme}">
        <div class="acu-fav-new-modal">
          <div class="acu-fav-new-modal-header">
            <h4>选择模板</h4>
            <button class="acu-fav-new-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-fav-new-modal-body">
            <label>从以下表格中选择结构作为模板:</label>
            <select id="acu-fav-new-template">
              ${tableOptions}
            </select>
          </div>
          <div class="acu-fav-new-modal-footer">
            <button class="acu-fav-new-cancel">取消</button>
            <button class="acu-fav-new-create">创建</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-fav-new-overlay');
    const $modal = $overlay.find('.acu-fav-new-modal');

    const closeModal = () => $overlay.remove();

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-fav-new-overlay')) closeModal();
    });

    $modal.find('.acu-fav-new-close, .acu-fav-new-cancel').on('click', closeModal);

    $modal.find('.acu-fav-new-create').on('click', () => {
      const key = $modal.find('#acu-fav-new-template').val() as string;
      const table = currentTables[key];
      if (!table || !table.content || !table.content[0]) {
        showActionableErrorToast('无效的表格模板', { suggestion: 'tableTemplate' });
        return;
      }

      const fullHeader = table.content[0];
      const header: string[] = fullHeader.slice(1).map((h: any) => String(h || ''));
      const tableName = table.name || key;

      onCreate(header, tableName);
      closeModal();
    });
  };

  // 发送到表格弹窗
  const showSendToTableModal = (
    fav: FavoriteItem,
    compatible: TableCompatibility[],
    currentTables: Record<string, any>,
    onSuccess: () => void,
  ) => {
    const { $ } = getCore();
    $('.acu-fav-send-overlay').remove();

    const config = getConfig();

    const tableListHtml = compatible
      .map(c => {
        const modeLabel =
          c.mode === 'strict'
            ? '<span class="acu-match-full">✓ 完全匹配</span>'
            : `<span class="acu-match-partial">⚠ 部分匹配 (${c.matchedCols.length}/${fav.header.length}列)</span>`;
        const unmatchedInfo =
          c.unmatchedCols.length > 0
            ? `<div class="acu-fav-send-unmatched">未匹配: ${c.unmatchedCols.join(', ')}</div>`
            : '';

        return `
        <div class="acu-fav-send-option" data-uid="${escapeHtml(c.tableUid)}" data-mode="${c.mode}">
          <div class="acu-fav-send-option-name">${escapeHtml(c.tableName)}</div>
          <div class="acu-fav-send-option-mode">${modeLabel}</div>
          ${unmatchedInfo}
        </div>
      `;
      })
      .join('');

    const overlayHtml = `
      <div class="acu-fav-send-overlay acu-theme-${config.theme}">
        <div class="acu-fav-send-modal">
          <div class="acu-fav-send-modal-header">
            <h4>选择目标表格</h4>
            <button class="acu-fav-send-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-fav-send-modal-body">
            ${tableListHtml}
          </div>
          <div class="acu-fav-send-modal-footer">
            <button class="acu-fav-send-cancel">取消</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-fav-send-overlay');
    // 内联样式确保移动端层叠上下文正确（与骰子配置弹窗同策略）
    $overlay.css({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      'z-index': '31300',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '16px',
      'box-sizing': 'border-box',
    });
    const $modal = $overlay.find('.acu-fav-send-modal');

    const closeModal = () => $overlay.remove();

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-fav-send-overlay')) closeModal();
    });

    $modal.find('.acu-fav-send-close, .acu-fav-send-cancel').on('click', closeModal);

    // 点击选项发送
    $modal.on('click', '.acu-fav-send-option', async function () {
      const uid = $(this).data('uid') as string;
      const mode = $(this).data('mode') as string;
      const table = currentTables[uid];

      if (!table || !table.content) {
        showActionableErrorToast('无法获取目标表格', { suggestion: 'table' });
        return;
      }

      const targetHeader: string[] = table.content[0].slice(1).map((h: any) => String(h || ''));
      const newRow = FavoritesManager.mapRowToTable(fav, targetHeader);

      try {
        await appendRowInstantly(uid, newRow);
        console.log('[DICE]FavoritesManager 发送成功，已写入数据库');
      } catch (err) {
        console.error('[DICE]FavoritesManager 写入数据库失败:', err);
        showActionableErrorToast('写入数据库失败: ' + (err.message || err), {
          title: '写入收藏失败',
          suggestion: 'save',
          developerHint: true,
        });
        return;
      }

      // 提示未匹配列
      if (mode === 'loose') {
        const unmatchedCount = fav.header.filter(h => !targetHeader.includes(h)).length;
        if (unmatchedCount > 0) {
          toastr.info(`${unmatchedCount}列未匹配，已填充空值`);
        }
      }

      closeModal();
      onSuccess();
    });
  };

  type TemplateInspectionSeverity = 'error' | 'warning' | 'info';

  type TemplateInspectionSheet = {
    key: string;
    name: string;
    headers: string[];
    note: string;
  };

  type TemplateInspectionIssue = {
    severity: TemplateInspectionSeverity;
    groupName: string;
    title: string;
    missing: string[];
    impact: string;
    suggestion: string;
  };

  type TemplateInspectionIssueGroup = {
    name: string;
    severity: TemplateInspectionSeverity;
    issues: TemplateInspectionIssue[];
  };

  type TemplateInspectionResult = {
    sheets: TemplateInspectionSheet[];
    issues: TemplateInspectionIssue[];
    checkedAt: string;
  };

  type TemplateTableRequirement = {
    title: string;
    severity: TemplateInspectionSeverity;
    tableLabel: string;
    tableMatches: string[];
    requiredColumns?: { label: string; matches: string[] }[];
    requiredNoteTags?: string[];
    impact: string;
    suggestion: string;
  };

  const LATEST_TABLE_TEMPLATE_URL = 'https://discord.com/channels/1134557553011998840/1455849435325010046';

  const TEMPLATE_TABLE_REQUIREMENTS: TemplateTableRequirement[] = [
    {
      title: '全局状态表不完整',
      severity: 'warning',
      tableLabel: '全局数据表',
      tableMatches: ['全局数据表', '全局数据', '全局'],
      requiredColumns: [
        { label: '当前详细地点', matches: ['当前详细地点', 'current_location'] },
        { label: '当前次要地区', matches: ['当前次要地区', 'current_minor_region'] },
        { label: '当前时间', matches: ['当前时间', 'cur_time'] },
      ],
      impact: '仪表盘无法稳定显示当前位置、次要地区和当前时间，地图/角色位置联动也会变弱。',
      suggestion: '保留默认“全局数据表”，或在仪表盘预设中映射当前地点和时间字段。',
    },
    {
      title: '主角表不完整',
      severity: 'error',
      tableLabel: '主角信息',
      tableMatches: ['主角信息', '主角', '玩家', '角色信息', 'user', '<user>'],
      requiredColumns: [
        { label: '姓名/名称', matches: ['姓名', '名称', 'name'] },
        { label: '基础属性/属性', matches: ['基础属性', '属性'] },
        { label: '所在地点/位置', matches: ['所在地点', '位置', '所在地'] },
      ],
      impact: '普通检定、属性生成/清空/自动改值和主角仪表盘可能无法找到目标角色或属性列。',
      suggestion: '建议保留“主角信息”的姓名、所在地点、基础属性；生成属性默认会写入“基础属性”。',
    },
    {
      title: 'NPC/重要角色表不完整',
      severity: 'error',
      tableLabel: '重要角色表/重要人物表',
      tableMatches: ['重要角色表', '重要人物表', 'npc', '人物', '角色', '伙伴', '队友'],
      requiredColumns: [
        { label: '姓名/名称', matches: ['姓名', '名称', 'name'] },
        { label: '基础属性/属性', matches: ['基础属性', '属性'] },
        { label: '人际关系', matches: ['人际关系'] },
        { label: '在场状态', matches: ['在场状态'] },
      ],
      impact: 'NPC 检定、对抗检定、关系图、角色头像预设和角色仪表盘可能无法识别角色或关系。',
      suggestion: '优先使用“重要角色表”，至少保留姓名、基础属性、人际关系、在场状态；旧名“重要人物表”仍可兼容。',
    },
    {
      title: '地图地点表不完整',
      severity: 'warning',
      tableLabel: '世界地图点',
      tableMatches: ['世界地图点', '地图点', '地图', '地点', '场景', '区域'],
      requiredColumns: [
        { label: '详细地点/地点名/名称', matches: ['详细地点', '地点名', '名称'] },
        { label: '次要地区', matches: ['次要地区'] },
        { label: '环境描述/描述', matches: ['环境描述', '描述'] },
      ],
      impact: '地图模块、当前位置跳转和地点卡片展示可能缺少地点名或环境信息。',
      suggestion: '建议保留“世界地图点.详细地点”，所有所在地点字段填写这里的详细地点名。',
    },
    {
      title: '地图元素表不完整',
      severity: 'warning',
      tableLabel: '地图元素表',
      tableMatches: ['地图元素', '元素表', '地图要素', '机关', '线索'],
      requiredColumns: [
        { label: '元素名称', matches: ['元素名称', '名称'] },
        { label: '元素类型', matches: ['元素类型', '类型'] },
        { label: '所在地点', matches: ['所在地点', '位置'] },
      ],
      impact: '地图元素、机关/线索展示和地点筛选可能无法按位置归类。',
      suggestion: '保留元素名称、元素类型、所在地点；所在地点应对应世界地图点里的详细地点名。',
    },
    {
      title: '物品表不完整',
      severity: 'warning',
      tableLabel: '物品表',
      tableMatches: ['物品表', '物品', '背包', '道具', '库存', '持有物品表'],
      requiredColumns: [
        { label: '物品名称/名称', matches: ['物品名称', '名称'] },
        { label: '类型', matches: ['类型'] },
        { label: '数量', matches: ['数量'] },
        { label: '品质', matches: ['品质'] },
        { label: '描述', matches: ['描述'] },
      ],
      impact: '物品栏、赠与、骰子商店奖励写入、堆叠数量、筛选和详情展示会受影响。',
      suggestion: '默认“物品表”最完整；至少保留物品名称、类型、数量，想保留详情请保留品质和描述。',
    },
    {
      title: '装备表不完整',
      severity: 'warning',
      tableLabel: '装备表',
      tableMatches: ['装备表', '装备', '武器', '防具', '法宝'],
      requiredColumns: [
        { label: '装备名称/名称', matches: ['装备名称', '名称'] },
        { label: '类型', matches: ['类型'] },
        { label: '状态', matches: ['状态'] },
        { label: '品质', matches: ['品质'] },
        { label: '描述', matches: ['描述'] },
      ],
      impact: '装备展示、当前装备识别、骰子商店装备奖励和装备详情可能失效。',
      suggestion:
        '保留装备名称、类型、品质、状态、描述；状态写“已装备/装备中/是”可被仪表盘识别。部位/位置只影响仪表盘预设的更细分展示，不作为默认模板必需列。',
    },
    {
      title: '任务表不完整',
      severity: 'info',
      tableLabel: '任务表',
      tableMatches: ['任务表', '任务', '事项', '目标', '待办', '委托'],
      requiredColumns: [
        { label: '名称', matches: ['名称'] },
        { label: '类型', matches: ['类型'] },
        { label: '进度', matches: ['进度'] },
        { label: '状态', matches: ['状态'] },
        { label: '优先级', matches: ['优先级'] },
      ],
      impact: '任务仪表盘可能无法显示任务类型、进度、状态或按优先级排序。',
      suggestion: '保留名称、类型、进度、状态；需要排序时保留优先级。',
    },
    {
      title: '检定建议表不完整',
      severity: 'warning',
      tableLabel: '检定建议表',
      tableMatches: ['检定建议'],
      requiredColumns: [
        { label: '展示文本', matches: ['展示文本'] },
        { label: '骰子命令', matches: ['骰子命令'] },
      ],
      requiredNoteTags: ['检定规则'],
      impact: '检定建议按钮可能无法生成正确展示文本/骰子命令，切换检定预设时也无法同步 AI 规则说明。',
      suggestion: '保留“检定建议表”的展示文本、骰子命令，并在 note 中保留 <检定规则>...</检定规则>。',
    },
  ];

  const normalizeTemplateInspectText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toLowerCase();

  const templateTextIncludesAny = (value: string, matches: string[]): boolean => {
    const normalizedValue = normalizeTemplateInspectText(value);
    return matches.some(match => normalizedValue.includes(normalizeTemplateInspectText(match)));
  };

  const getTemplateInspectionSheets = (template: unknown): TemplateInspectionSheet[] => {
    if (!template || typeof template !== 'object') return [];
    return Object.entries(template as Record<string, unknown>)
      .filter(([key, value]) => key.startsWith('sheet_') && value && typeof value === 'object')
      .map(([key, value]) => {
        const record = value as Record<string, unknown>;
        const content = Array.isArray(record.content) ? record.content : [];
        const headerRow = Array.isArray(content[0]) ? content[0] : [];
        const sourceData = record.sourceData && typeof record.sourceData === 'object' ? record.sourceData : {};
        return {
          key,
          name: String(record.name || key),
          headers: headerRow.map(header => String(header ?? '').trim()).filter(Boolean),
          note: String((sourceData as Record<string, unknown>).note || ''),
        };
      });
  };

  const findTemplateRequirementSheet = (
    sheets: TemplateInspectionSheet[],
    requirement: TemplateTableRequirement,
  ): TemplateInspectionSheet | null =>
    sheets.find(sheet => templateTextIncludesAny(sheet.name, requirement.tableMatches)) || null;

  const inspectTableTemplate = (template: unknown): TemplateInspectionResult => {
    const sheets = getTemplateInspectionSheets(template);
    const issues: TemplateInspectionIssue[] = [];

    TEMPLATE_TABLE_REQUIREMENTS.forEach(requirement => {
      const sheet = findTemplateRequirementSheet(sheets, requirement);
      if (!sheet) {
        issues.push({
          severity: requirement.severity,
          groupName: requirement.tableLabel,
          title: `缺少${requirement.tableLabel}`,
          missing: [`表名需包含：${requirement.tableMatches.join(' / ')}`],
          impact: requirement.impact,
          suggestion: requirement.suggestion,
        });
        return;
      }

      const missingColumns = (requirement.requiredColumns || [])
        .filter(column => !sheet.headers.some(header => templateTextIncludesAny(header, column.matches)))
        .map(column => `${sheet.name}.${column.label}`);
      const missingTags = (requirement.requiredNoteTags || [])
        .filter(tag => !sheet.note.includes(`<${tag}>`) || !sheet.note.includes(`</${tag}>`))
        .map(tag => `${sheet.name}.note 缺少 <${tag}>...</${tag}>`);
      const missing = [...missingColumns, ...missingTags];
      if (missing.length > 0) {
        issues.push({
          severity: requirement.severity,
          groupName: sheet.name,
          title: `${sheet.name}缺少关键内容`,
          missing,
          impact: requirement.impact,
          suggestion: requirement.suggestion,
        });
      }
    });

    const attributeRuleSheets = sheets.filter(
      sheet => sheet.note.includes('<属性规则>') && sheet.note.includes('</属性规则>'),
    );
    if (attributeRuleSheets.length === 0) {
      issues.push({
        severity: 'warning',
        groupName: '属性预设',
        title: '缺少 <属性规则> 同步标签',
        missing: ['任意相关表 note 中的 <属性规则>...</属性规则>'],
        impact: '切换属性预设时，数据库模板不会同步更新属性生成说明。',
        suggestion: '建议在主角信息和重要角色表的 note 中保留闭合的 <属性规则>...</属性规则>。',
      });
    }

    const sheetsWithoutStableFirstColumn = sheets.filter(sheet => {
      const firstHeader = sheet.headers[0] || '';
      return !templateTextIncludesAny(firstHeader, ['row_id', '行号']);
    });
    if (sheetsWithoutStableFirstColumn.length > 0) {
      issues.push({
        severity: 'info',
        groupName: '行号列建议',
        title: '部分表缺少稳定行号列',
        missing: sheetsWithoutStableFirstColumn.slice(0, 8).map(sheet => `${sheet.name}.第 1 列不是 row_id/行号`),
        impact: '可视化表格仍可显示，但卡片标题、跳转、锁定、差异对比和快捷保存更容易不稳定。',
        suggestion: '建议把每张表第 1 列保留为 row_id 或行号，第 2 列放名称/标题。',
      });
    }

    return {
      sheets,
      issues,
      checkedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    };
  };

  const getTemplateInspectionSeverityMeta = (
    severity: TemplateInspectionSeverity,
  ): { label: string; icon: string; color: string } => {
    if (severity === 'error') return { label: '严重', icon: 'fa-circle-xmark', color: 'var(--acu-error-text)' };
    if (severity === 'warning')
      return { label: '警告', icon: 'fa-triangle-exclamation', color: 'var(--acu-warning-text)' };
    return { label: '提示', icon: 'fa-circle-info', color: 'var(--acu-hl-diff)' };
  };

  const repairCurrentTableTemplateFromPreset = async (presetId: string, currentOverlay?: JQuery<HTMLElement>): Promise<void> => {
    const dbApi = getCore().getDB() as Record<string, unknown> | null | undefined;
    if (!dbApi || typeof dbApi.getTableTemplate !== 'function' || typeof dbApi.importTemplateFromData !== 'function') {
      showActionableErrorToast('数据库模板 API 不可用，无法修复当前聊天表格模板。', { developerHint: true });
      return;
    }

    const preset = TableTemplateRequirementPresetManager.getPresetById(presetId) || TableTemplateRequirementPresetManager.getActivePreset();
    if (!preset) {
      showActionableErrorToast('找不到当前模板检验预设。', { suggestion: 'tableTemplate' });
      return;
    }

    try {
      const currentTemplate = (dbApi.getTableTemplate as () => unknown).call(dbApi);
      const plan = buildTableTemplateAppendRepairPlan(currentTemplate, preset);
      if (plan.manualIssues.length > 0 && plan.actions.length === 0) {
        showActionableErrorToast(`当前模板存在需要手动处理的问题：${plan.manualIssues[0]}`, {
          suggestion: 'tableTemplate',
        });
        return;
      }
      if (!plan.changed || !plan.repairedTemplate) {
        if (window.toastr) window.toastr.info('当前聊天模板已经满足可自动追加的要求。');
        currentOverlay?.remove();
        showTemplateInspectionModal();
        return;
      }

      const actionPreview = plan.actions.slice(0, 12).map(action => `• ${action}`);
      const hiddenActionCount = Math.max(0, plan.actions.length - actionPreview.length);
      if (hiddenActionCount > 0) actionPreview.push(`• 还有 ${hiddenActionCount} 项追加动作`);
      const manualPreview = plan.manualIssues.slice(0, 6).map(issue => `• ${issue}`);
      const detailParts = [
        '将只修复当前聊天模板，不会修改全局模板，也不会直接写入运行时表格数据。',
        '',
        '将追加：',
        ...actionPreview,
      ];
      if (manualPreview.length > 0) {
        detailParts.push('', '仍需手动处理：', ...manualPreview);
      }

      const confirmed = await showDiceSystemConfirmDialog({
        title: '修复当前聊天表格模板',
        message: '将把缺失表、缺失列、建表说明和模板说明追加到当前聊天模板末尾。',
        detail: detailParts.join('\n'),
        iconClass: 'fa-wrench',
        confirmText: '修复当前聊天模板',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;

      const importResult = await (dbApi.importTemplateFromData as Function).call(dbApi, plan.repairedTemplate, {
        scope: 'chat',
      });
      if (importResult && typeof importResult === 'object' && importResult.success === false) {
        throw new Error(importResult.error || importResult.message || '数据库本体拒绝导入修复后的模板');
      }

      if (window.toastr) window.toastr.success(`已追加修复 ${plan.actions.length} 项当前聊天模板要求`);
      currentOverlay?.remove();
      showTemplateInspectionModal();
    } catch (error) {
      console.error('[DICE]智能修复表格模板失败:', error);
      showActionableErrorToast(`智能修复失败: ${(error as Error).message || error}`, {
        suggestion: 'tableTemplate',
        developerHint: true,
      });
    }
  };

  const showTemplateInspectionResultModal = (result: TemplateInspectionResult): void => {
    const { $ } = getCore();
    const config = getConfig();
    $('.acu-template-inspection-overlay').remove();

    const errorCount = result.issues.filter(issue => issue.severity === 'error').length;
    const warningCount = result.issues.filter(issue => issue.severity === 'warning').length;
    const infoCount = result.issues.filter(issue => issue.severity === 'info').length;
    const statusText =
      result.issues.length === 0
        ? '当前聊天模板满足当前模板检验预设的最低要求。'
        : `发现 ${result.issues.length} 项需要关注的模板问题。`;
    const severityRank: Record<TemplateInspectionSeverity, number> = { error: 3, warning: 2, info: 1 };
    const groupedIssues = result.issues.reduce<TemplateInspectionIssueGroup[]>((groups, issue) => {
      const groupName = issue.groupName || '其他问题';
      let group = groups.find(item => item.name === groupName);
      if (!group) {
        group = { name: groupName, severity: issue.severity, issues: [] };
        groups.push(group);
      }
      group.issues.push(issue);
      if (severityRank[issue.severity] > severityRank[group.severity]) {
        group.severity = issue.severity;
      }
      return groups;
    }, []);

    groupedIssues.sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || a.name.localeCompare(b.name));
    const isClean = groupedIssues.length === 0;
    const summarySeverity = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'info';
    const summaryMeta = getTemplateInspectionSeverityMeta(summarySeverity);
    const presetLabel = result.presetName || '当前模板检验预设';
    const issueSummaryTitle = isClean ? '模板结构完整' : `发现 ${result.issues.length} 项模板问题`;
    const repairButtonHtml =
      result.fixableCount > 0
        ? `<button class="acu-dialog-btn acu-btn-confirm" id="template-inspection-repair" title="追加修复当前聊天模板" aria-label="追加修复当前聊天模板">
             <i class="fa-solid fa-wrench"></i> 修复
           </button>`
        : '';

    const tabHtml =
      isClean
        ? ''
        : groupedIssues
            .map((group, index) => {
              const meta = getTemplateInspectionSeverityMeta(group.severity);
              return `
                <button class="acu-template-inspection-tab ${index === 0 ? 'active' : ''}" data-group-index="${index}" style="--acu-template-inspection-color:${meta.color};">
                  <i class="fa-solid ${meta.icon} acu-template-inspection-tab-icon"></i>
                  <span class="acu-template-inspection-tab-label">${escapeHtml(group.name)}</span>
                  <span class="acu-changes-count acu-template-inspection-tab-count" style="background:${meta.color};">${group.issues.length}</span>
                </button>`;
            })
            .join('');

    const panelHtml = groupedIssues
      .map((group, groupIndex) => {
        const issueCards = group.issues
          .map((issue, issueIndex) => {
            const meta = getTemplateInspectionSeverityMeta(issue.severity);
            const missingHtml = issue.missing.map(item => `<li>${escapeHtml(item)}</li>`).join('');
            const isFixable = !!issue.fixActions && issue.fixActions.length > 0;
            const resolutionHtml = isFixable
              ? `<div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">智能修复</div>
                 <ul style="margin:0 0 8px 18px;padding:0;color:var(--acu-text-main);">${issue.fixActions
                   .map(action => `<li>${escapeHtml(action)}</li>`)
                   .join('')}</ul>`
              : `<div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">建议做法</div>
                 <div style="color:var(--acu-text-main);">${escapeHtml(issue.suggestion)}</div>`;
            const collapsed = issueIndex > 0;
            return `
              <div class="acu-changes-group acu-template-inspection-card ${collapsed ? 'collapsed' : ''}" style="--acu-template-inspection-color:${meta.color};">
                <div class="acu-changes-group-header acu-template-inspection-card-header" style="cursor:pointer;">
                  <i class="fa-solid fa-chevron-${collapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                  <i class="fa-solid ${meta.icon}" style="color:${meta.color};"></i>
                  <span style="flex:1;">${escapeHtml(issue.title)}</span>
                  <span class="acu-changes-count" style="background:${meta.color};">${meta.label}</span>
                </div>
                <div class="acu-changes-group-body" style="${collapsed ? 'display:none;' : ''}">
                  <div class="acu-change-item" style="display:block;line-height:1.65;">
                    <div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">缺失内容</div>
                    <ul style="margin:0 0 8px 18px;padding:0;color:var(--acu-text-main);">${missingHtml}</ul>
                    <div style="font-weight:700;color:var(--acu-text-main);margin-bottom:4px;">影响功能</div>
                    <div style="margin-bottom:8px;color:var(--acu-text-main);">${escapeHtml(issue.impact)}</div>
                    ${resolutionHtml}
                  </div>
                </div>
              </div>`;
          })
          .join('');
        return `
          <div class="acu-template-inspection-panel" data-group-index="${groupIndex}" style="${groupIndex === 0 ? '' : 'display:none;'}">
            <div class="acu-changes-list acu-template-inspection-card-list">${issueCards}</div>
          </div>`;
      })
      .join('');

    const cleanBodyHtml = `
      <div class="acu-template-inspection-clean-card">
        <div class="acu-template-inspection-clean-result">
          <div class="acu-template-inspection-clean-icon"><i class="fa-solid fa-check"></i></div>
          <div class="acu-template-inspection-clean-copy">
            <div class="acu-template-inspection-clean-title">模板关键结构完整</div>
            <div class="acu-template-inspection-clean-desc">${escapeHtml(statusText)}</div>
          </div>
        </div>
        <div class="acu-template-inspection-clean-meta">
          <div><span>预设</span><strong>${escapeHtml(presetLabel)}</strong></div>
          <div><span>模板</span><strong>${result.sheets.length} 张表</strong></div>
          <div><span>检查时间</span><strong>${escapeHtml(result.checkedAt)}</strong></div>
        </div>
        <div class="acu-template-inspection-clean-stats">
          <span><b>${errorCount}</b> 严重</span>
          <span><b>${warningCount}</b> 警告</span>
          <span><b>${infoCount}</b> 提示</span>
          <span><b>${result.fixableCount || 0}</b> 可修复</span>
          <span><b>${result.manualCount || 0}</b> 手动</span>
        </div>
      </div>`;

    const issueBodyHtml = `
      <div class="acu-template-inspection-summary" style="--acu-template-inspection-summary-color:${summaryMeta.color};">
        <div class="acu-template-inspection-summary-head">
          <span class="acu-template-inspection-summary-icon" aria-hidden="true">
            <i class="fa-solid ${summaryMeta.icon}"></i>
          </span>
          <div class="acu-template-inspection-summary-copy">
            <div class="acu-template-inspection-summary-title">${escapeHtml(issueSummaryTitle)}</div>
          </div>
        </div>
        <div class="acu-template-inspection-stats" aria-label="问题统计">
          <span class="acu-template-inspection-stat acu-template-inspection-stat-error"><b>${errorCount}</b> 严重</span>
          <span class="acu-template-inspection-stat acu-template-inspection-stat-warning"><b>${warningCount}</b> 警告</span>
          <span class="acu-template-inspection-stat acu-template-inspection-stat-info"><b>${infoCount}</b> 提示</span>
          <span class="acu-template-inspection-stat"><b>${result.fixableCount || 0}</b> 智能修复</span>
          <span class="acu-template-inspection-stat"><b>${result.manualCount || 0}</b> 需手动处理</span>
        </div>
      </div>
      <div class="acu-template-inspection-layout" style="display:grid;grid-template-columns:220px minmax(0,1fr);gap:12px;align-items:start;">
        <div class="acu-template-inspection-tabs" style="display:flex;flex-direction:column;gap:8px;max-height:54vh;overflow:auto;padding-right:2px;">
          ${tabHtml}
        </div>
        <div class="acu-template-inspection-panels" style="min-width:0;max-height:54vh;overflow:auto;padding-right:2px;">
          ${panelHtml}
        </div>
      </div>`;

    const overlay = $(`
      <div class="acu-edit-overlay acu-template-inspection-overlay">
        <div class="acu-edit-dialog acu-template-inspection-dialog ${isClean ? 'acu-template-inspection-dialog-clean' : ''} acu-theme-${config.theme}" style="width: 900px; max-width: 96vw; max-height: 88vh;">
          <div class="acu-template-inspection-header" style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--acu-border);">
            <div class="acu-template-inspection-title" style="font-size:16px;font-weight:bold;color:var(--acu-text-main);min-width:0;display:flex;align-items:center;gap:6px;">
              <i class="fa-solid fa-stethoscope"></i> 检验表格模板
            </div>
            <div class="acu-template-inspection-header-actions">
              ${getTutorialButtonHtml('templateInspection', '查看检验表格模板教程', 'acu-template-inspection-tutorial-btn')}
              <button class="acu-close-btn acu-template-inspection-close" title="关闭" aria-label="关闭检验表格模板结果"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-settings-content acu-settings-content-scroll acu-template-inspection-body" style="padding:12px 0;">
            ${isClean ? cleanBodyHtml : issueBodyHtml}
          </div>
          <div class="acu-dialog-btns acu-template-inspection-actions" style="justify-content:space-between;align-items:center;gap:10px;">
            <button class="acu-dialog-btn acu-template-inspection-download" id="template-inspection-download" title="下载最新表格模板" aria-label="下载最新表格模板" style="background:var(--acu-card-bg);color:var(--acu-text-main);border:1px solid var(--acu-border);">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> 最新模板
            </button>
            <div class="acu-template-inspection-primary-actions" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
              ${repairButtonHtml}
            </div>
          </div>
        </div>
      </div>`);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);
    overlay.find('.acu-template-inspection-close').on('click', () => overlay.remove());
    overlay.find('#template-inspection-download').on('click', () => {
      window.open(LATEST_TABLE_TEMPLATE_URL, '_blank', 'noopener,noreferrer');
    });
    overlay.find('#template-inspection-repair').on('click', () => {
      void repairCurrentTableTemplateFromPreset(result.presetId, overlay);
    });
    overlay.find('.acu-template-inspection-tab').on('click', function () {
      const groupIndex = $(this).data('group-index');
      overlay
        .find('.acu-template-inspection-tab')
        .removeClass('active');
      $(this).addClass('active');
      overlay.find('.acu-template-inspection-panel').hide();
      overlay.find(`.acu-template-inspection-panel[data-group-index="${groupIndex}"]`).show();
    });
    overlay.find('.acu-template-inspection-card-header').on('click', function () {
      const $group = $(this).closest('.acu-template-inspection-card');
      const $body = $group.find('.acu-changes-group-body').first();
      const $icon = $(this).find('.acu-collapse-icon');
      if ($group.hasClass('collapsed')) {
        $group.removeClass('collapsed');
        $body.slideDown(160);
        $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
      } else {
        $group.addClass('collapsed');
        $body.slideUp(160);
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
      }
    });
    setupOverlayClose(overlay, 'acu-template-inspection-overlay', () => overlay.remove());
  };

  const showTemplateInspectionModal = (): void => {
    const dbApi = getCore().getDB() as Record<string, unknown> | null | undefined;
    if (!dbApi || typeof dbApi.getTableTemplate !== 'function') {
      showActionableErrorToast('数据库模板 API 不可用，无法读取当前聊天表格模板。', { developerHint: true });
      return;
    }

    try {
      const template = (dbApi.getTableTemplate as () => unknown).call(dbApi);
      const preset = TableTemplateRequirementPresetManager.getActivePreset();
      const result = inspectTableTemplateWithPreset(template, preset);
      showTemplateInspectionResultModal(result);
    } catch (error) {
      console.error('[DICE]检验表格模板失败:', error);
      showActionableErrorToast(`检验表格模板失败: ${(error as Error).message || error}`, {
        suggestion: 'tableTemplate',
        developerHint: true,
      });
    }
  };

  const showTableTemplateRequirementPresetEditor = (presetId: string | null = null): void => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showTableTemplateRequirementPresetEditor', () => showTableTemplateRequirementPresetEditor(presetId));

    const config = getConfig();
    const isEdit = Boolean(presetId);
    const existingPreset = isEdit ? TableTemplateRequirementPresetManager.getPresetById(presetId) : null;
    const defaultJsonText = existingPreset
      ? JSON.stringify(
          {
            name: existingPreset.name,
            description: existingPreset.description || '',
            requirementLevels: existingPreset.requirementLevels,
            template: existingPreset.template,
          },
          null,
          2,
        )
      : buildNewTableTemplateRequirementPresetJsoncTemplate();
    const defaultPreset =
      normalizeTableTemplateRequirementPreset(parseTableTemplateRequirementPresetJson(defaultJsonText), presetId || undefined) ||
      TableTemplateRequirementPresetManager.getActivePreset();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-editor-dialog acu-table-template-requirement-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3><i class="fa-solid fa-table-list"></i> ${isEdit ? '编辑' : '新建'}模板检验预设</h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('tableTemplateRequirementPresetEditor', '查看模板检验预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭模板检验预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="table-template-requirement-preset-name">预设名称</label>
                <input id="table-template-requirement-preset-name" type="text" value="${escapeHtml(defaultPreset.name || '')}" class="acu-preset-editor-input" />
              </div>
              <div class="acu-advanced-preset-field">
                <label for="table-template-requirement-preset-desc">描述</label>
                <input id="table-template-requirement-preset-desc" type="text" value="${escapeHtml(defaultPreset.description || '')}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="table-template-requirement-preset-json">
                  JSONC 配置
                  <span>支持完整预设、仅 template 对象，或直接导入表格模板 JSON</span>
                </label>
              </div>
              <textarea id="table-template-requirement-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea"></textarea>
              <div id="table-template-requirement-preset-format-help" class="acu-advanced-preset-format-help-summary">
                <strong>分层要求：</strong>
                <span>template 中出现的表、列和可选 sourceData / DDL / 配置会参与校验；可用 requirementLevels 标记 error、warning 或 info。</span>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="table-template-requirement-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="table-template-requirement-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button type="button" id="table-template-requirement-preset-save" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button type="button" id="table-template-requirement-preset-cancel" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#table-template-requirement-preset-json');
    $jsonTextarea.val(defaultJsonText);

    const parseEditorPreset = () => {
      const name = String(overlay.find('#table-template-requirement-preset-name').val() || '').trim();
      const description = String(overlay.find('#table-template-requirement-preset-desc').val() || '').trim();
      const parsed = parseTableTemplateRequirementPresetJson(String($jsonTextarea.val() || ''));
      const normalized = normalizeTableTemplateRequirementPreset(parsed, presetId || undefined);
      if (!normalized) throw new Error('配置中必须包含 template 对象，或直接提供表格模板对象。');
      normalized.name = name || normalized.name;
      normalized.description = description || normalized.description || '';
      normalized.builtin = false;
      return normalized;
    };

    overlay.find('#table-template-requirement-preset-download-ai-prompt').on('click', () => {
      const promptText = buildTableTemplateRequirementPresetAgentPrompt();
      const presetName = String(
        overlay.find('#table-template-requirement-preset-name').val() ||
          defaultPreset?.name ||
          'table_template_requirement_preset',
      );
      const filename = buildTableTemplateRequirementPresetAgentPromptFilename(presetName);
      downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#table-template-requirement-preset-validate').on('click', () => {
      validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: () => parseEditorPreset(),
        successMessage: preset => {
          const stats = getTableTemplateRequirementPresetStats(preset);
          return `配置有效：${preset.name}，${stats.sheetCount} 张表，${stats.headerCount} 个业务列`;
        },
        logLabel: '[DICE]ACU 模板检验预设验证失败:',
      });
    });

    overlay.find('#table-template-requirement-preset-save').on('click', () => {
      try {
        const preset = parseEditorPreset();
        if (!preset.name) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }
        if (isEdit && presetId) {
          TableTemplateRequirementPresetManager.updatePreset(presetId, preset);
        } else {
          TableTemplateRequirementPresetManager.createPreset(preset);
        }
        overlay.remove();
        popModal();
        showTableTemplateRequirementPresetManager();
      } catch (error) {
        console.error('[DICE]ACU 保存模板检验预设失败:', error);
        showActionableErrorToast('保存失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'save' });
      }
    });

    overlay.find('.acu-close-btn, #table-template-requirement-preset-cancel').on('click', () => {
      overlay.remove();
      popModal();
      showTableTemplateRequirementPresetManager();
    });

    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
      showTableTemplateRequirementPresetManager();
    });
  };

  const showTableTemplateRequirementPresetManager = (): void => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showTableTemplateRequirementPresetManager', showTableTemplateRequirementPresetManager);

    const config = getConfig();
    const presets = TableTemplateRequirementPresetManager.getAllPresets();
    const activeId = TableTemplateRequirementPresetManager.getActivePresetId();
    const presetsHtml = presets
            .map(preset => {
              const isActive = preset.id === activeId;
              const isBuiltin = preset.builtin === true;
              const stats = getTableTemplateRequirementPresetStats(preset);
              return `
          <div class="acu-preset-item acu-table-template-requirement-preset-item" data-id="${escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name" title="${escapeHtml(preset.name)}">
                ${escapeHtml(preset.name)}
                ${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}
                ${isActive ? `<span class="acu-preset-badge">当前</span>` : ''}
              </div>
              ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats" title="${escapeHtml(preset.format || TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT)}">${stats.sheetCount} 张表 · ${stats.headerCount} 列</div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle" title="设为当前模板检验预设">
                <input type="checkbox" class="acu-table-template-requirement-preset-toggle" data-id="${escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-table-template-requirement-preset-copy" data-id="${escapeHtml(preset.id)}" title="复制为自定义预设" aria-label="复制 ${escapeHtml(preset.name)}"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-table-template-requirement-preset-edit" data-id="${escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-table-template-requirement-preset-export" data-id="${escapeHtml(preset.id)}" title="导出" aria-label="导出 ${escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-table-template-requirement-preset-delete" data-id="${escapeHtml(preset.id)}" title="删除" aria-label="删除 ${escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>`;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-manager-dialog acu-table-template-requirement-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3><i class="fa-solid fa-table-list"></i> 模板检验预设管理</h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('tableTemplateRequirementPresetManager', '查看模板检验预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭模板检验预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-table-template-requirement-presets-list">
              ${presetsHtml || `<div class="acu-empty-state">暂无模板检验预设</div>`}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-table-template-requirement-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建模板检验预设" aria-label="新建模板检验预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-table-template-requirement-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-table-template-requirement-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-table-template-requirement-preset-back').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.on('change', '.acu-table-template-requirement-preset-toggle', function () {
      const $toggle = $(this);
      const id = String($toggle.data('id') || '');
      if (!$toggle.is(':checked')) {
        $toggle.prop('checked', true);
        return;
      }
      const success = TableTemplateRequirementPresetManager.setActivePresetId(id);
      if (!success) {
        showActionableErrorToast('切换模板检验预设失败', { suggestion: 'tableTemplate' });
        return;
      }
      overlay.find('.acu-table-template-requirement-preset-toggle').each(function () {
        if (String($(this).data('id') || '') !== id) $(this).prop('checked', false);
      });
      if (window.toastr) window.toastr.success('已切换模板检验预设');
      overlay.remove();
      showTableTemplateRequirementPresetManager();
    });

    overlay.on('click', '.acu-table-template-requirement-preset-copy', function () {
      const id = String($(this).data('id') || '');
      const preset = TableTemplateRequirementPresetManager.getPresetById(id);
      if (!preset) return;
      const copy = TableTemplateRequirementPresetManager.createPreset({
        name: `${preset.name} (副本)`,
        description: preset.description || '',
        requirementLevels: preset.requirementLevels ? cloneTemplateValue(preset.requirementLevels) : undefined,
        template: cloneTemplateValue(preset.template),
      });
      if (copy && window.toastr) window.toastr.success(`已创建副本：${copy.name}`);
      overlay.remove();
      showTableTemplateRequirementPresetManager();
    });

    overlay.on('click', '.acu-table-template-requirement-preset-edit', function () {
      const id = String($(this).data('id') || '');
      overlay.remove();
      popModal();
      showTableTemplateRequirementPresetEditor(id);
    });

    overlay.on('click', '.acu-table-template-requirement-preset-export', function () {
      const id = String($(this).data('id') || '');
      const preset = TableTemplateRequirementPresetManager.getPresetById(id);
      const json = TableTemplateRequirementPresetManager.exportPreset(id);
      if (!json) {
        showActionableErrorToast('导出失败', { title: '模板检验预设导出失败', suggestion: 'importExport' });
        return;
      }
      downloadJsonFile(json, `${preset?.name || '模板检验预设'}.json`);
      if (window.toastr) window.toastr.success('已导出文件');
    });

    overlay.on('click', '.acu-table-template-requirement-preset-delete', async function () {
      const id = String($(this).data('id') || '');
      const preset = TableTemplateRequirementPresetManager.getPresetById(id);
      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除模板检验预设',
        message: `确定要删除「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。内置默认预设不会被删除。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;
      try {
        const success = TableTemplateRequirementPresetManager.deletePreset(id);
        if (!success) {
          showActionableErrorToast('删除失败', { title: '模板检验预设删除失败', suggestion: 'save' });
          return;
        }
        overlay.remove();
        showTableTemplateRequirementPresetManager();
      } catch (error) {
        showActionableErrorToast('删除失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'save' });
      }
    });

    overlay.find('#acu-table-template-requirement-preset-new').on('click', () => {
      overlay.remove();
      popModal();
      showTableTemplateRequirementPresetEditor();
    });

    overlay.find('#acu-table-template-requirement-preset-import').on('click', () => {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const preset = TableTemplateRequirementPresetManager.importPreset(selected.text);
          if (!preset) {
            showActionableErrorToast('导入失败，请检查 JSONC 格式和 template 内容', { suggestion: 'importExport' });
            return;
          }
          if (window.toastr) window.toastr.success(`导入成功：${preset.name}`);
          overlay.remove();
          showTableTemplateRequirementPresetManager();
        } catch (error) {
          console.error('[DICE]ACU 模板检验预设导入失败:', error);
          showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };

  const showSettingsModal = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').not(':has(.acu-settings-dialog)').remove();
    clearModalStack();
    pushModal('showSettingsModal', showSettingsModal);

    setIsSettingsOpen(true);
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const settingsRawData = getCachedRawData() || getTableData();
    const settingsTables = processJsonData(settingsRawData || {});
    const allTableNames = Object.keys(settingsTables);

    // 分组折叠状态（从存储读取，默认第一组展开）
    const expandedGroups = Store.get('acu_settings_expanded', ['appearance']);

    const isGroupExpanded = groupId => expandedGroups.includes(groupId);
    // 生成导航盘管理列表HTML（包含特殊按钮：仪表盘、投骰、审核、MVU变量）
    const SPECIAL_BUTTONS_CONFIG = [
      { key: '__dashboard__', name: '仪表盘', icon: 'fa-chart-line' },
      { key: '__dice__', name: '投骰', icon: 'fa-dice-d20' },
      { key: '__changes__', name: '变更审核', icon: 'fa-code-compare' },
      { key: '__mvu__', name: 'MVU变量', icon: 'fa-code-branch' },
      { key: '__favorites__', name: '收藏夹', icon: 'fa-star' },
      { key: '__global_interactions__', name: '交互总览', icon: 'fa-hand-pointer' },
    ];

    type TableManagerItem = {
      key: string;
      name: string;
      icon: string;
      isSpecial: boolean;
    };

    type SettingsSegmentOption = {
      value: string;
      label: string;
      title?: string;
    };

    const ENABLE_DISABLE_OPTIONS: readonly SettingsSegmentOption[] = [
      { value: 'enabled', label: '启用' },
      { value: 'disabled', label: '禁用' },
    ];
    const DIALOGUE_INDENT_STRATEGY_OPTIONS: readonly SettingsSegmentOption[] = [
      { value: 'conservative', label: '保守' },
      { value: 'balanced', label: '适中' },
      { value: 'aggressive', label: '激进' },
    ];

    const tableManagerHtml = (() => {
      const savedOrder = getSavedTableOrder() || [];
      const hiddenList = getHiddenTables();

      // 构建所有可管理项：特殊按钮 + 真实表格
      const allItems: TableManagerItem[] = [];

      // 添加特殊按钮
      SPECIAL_BUTTONS_CONFIG.forEach(btn => {
        // MVU 按钮始终参与管理，让用户可以设置顺序和可见性
        allItems.push({ key: btn.key, name: btn.name, icon: btn.icon, isSpecial: true });
      });

      // 添加真实表格
      allTableNames.forEach(name => {
        allItems.push({ key: name, name: name, icon: getIconForTableName(name), isSpecial: false });
      });

      // 应用保存的排序
      if (savedOrder.length > 0) {
        const orderMap = new Map(savedOrder.map((k, i) => [k, i]));
        const getOrderIndex = (item: TableManagerItem): number =>
          orderMap.get(item.key) ?? (item.key === '__dashboard__' ? -1 : 9999);
        allItems.sort((a, b) => {
          const aIdx = getOrderIndex(a);
          const bIdx = getOrderIndex(b);
          return aIdx - bIdx;
        });
      }

      return allItems
        .map(item => {
          const isHidden = hiddenList.includes(item.key);
          const specialClass = item.isSpecial ? ' acu-special-item' : '';
          const displayName = item.name;
          return (
            '<div class="acu-table-manager-item' +
            specialClass +
            (isHidden ? ' hidden-table' : '') +
            '" data-table-name="' +
            escapeHtml(item.key) +
            '" draggable="false">' +
            '<div class="acu-table-item-check" title="点击切换显示/隐藏">' +
            '<i class="fa-solid ' +
            (isHidden ? 'fa-eye-slash' : 'fa-eye') +
            '"></i>' +
            '</div>' +
            '<div class="acu-table-item-icon"><i class="fa-solid ' +
            item.icon +
            '"></i></div>' +
            '<div class="acu-table-item-name">' +
            escapeHtml(displayName) +
            '</div>' +
            '<div class="acu-table-item-handle" title="拖拽排序">' +
            '<i class="fa-solid fa-grip-vertical"></i>' +
            '</div>' +
            '</div>'
          );
        })
        .join('');
    })();
    const chevron = groupId => (isGroupExpanded(groupId) ? 'fa-chevron-down' : 'fa-chevron-right');
    const renderSettingSegmented = (
      id: string,
      label: string,
      options: readonly SettingsSegmentOption[],
      selectedValue: string,
    ): string => `
                                <div class="acu-setting-segmented" id="${id}" role="radiogroup" aria-label="${escapeHtml(label)}">
                                    ${options
                                      .map(option => {
                                        const active = option.value === selectedValue;
                                        const title = option.title || option.label;
                                        return `<button type="button" class="acu-setting-segmented-option ${active ? 'active' : ''}" data-value="${escapeHtml(option.value)}" role="radio" aria-checked="${active ? 'true' : 'false'}" title="${escapeHtml(title)}">${escapeHtml(option.label)}</button>`;
                                      })
                                      .join('')}
                                </div>`;

    const dialog = $(`
        <div class="acu-edit-overlay ${currentThemeClass}">
            <div class="acu-edit-dialog acu-settings-dialog ${currentThemeClass}">
                <div class="acu-settings-header">
                    <div class="acu-settings-title">
                        <span class="acu-settings-title-main">
                            <span class="acu-settings-title-icon"><i class="fa-solid fa-cog"></i></span>
                            <span class="acu-settings-heading">设置</span>
                        </span>
                    </div>
                    <div class="acu-header-actions">
                        <span class="acu-version-badge" title="当前版本 ${SCRIPT_VERSION}">${SCRIPT_VERSION}</span>
                        <button type="button" class="acu-manual-update-btn" id="acu-manual-update-btn" aria-label="清理缓存并刷新以获取最新版本" title="清理缓存并刷新以获取最新版本"><i class="fa-solid fa-rotate"></i></button>
                        ${getTutorialButtonHtml('settings', '查看设置页面教程', 'acu-help-btn')}
                        <button type="button" class="acu-close-btn" id="dlg-close-x" aria-label="关闭设置" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>

                <div class="acu-settings-body">
                <!-- 外观样式 -->
                <div class="acu-settings-group ${isGroupExpanded('appearance') ? '' : 'collapsed'}" data-group="appearance">                    <div class="acu-settings-group-title">
                        <span class="acu-settings-group-title-main">
                            <i class="fa-solid ${chevron('appearance')} acu-group-chevron"></i>
                            <i class="fa-solid fa-palette"></i>
                            <span>外观样式</span>
                        </span>
                        ${getTutorialButtonHtml('settingsAppearance', '查看外观样式教程', 'acu-settings-group-help')}
                    </div>
                    <div class="acu-settings-group-body">
                        <div class="acu-setting-row" id="settings-row-theme">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">背景主题</span>
                            </div>
                            <select id="cfg-theme" class="acu-setting-select">
                                ${THEMES.map(t => `<option value="${t.id}" ${t.id === config.theme ? 'selected' : ''}>${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-family">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体风格</span>
                            </div>
                            <select id="cfg-font-family" class="acu-setting-select">
                                ${FONTS.map(f => `<option value="${f.id}" ${f.id === config.fontFamily ? 'selected' : ''}>${f.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-main">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（界面）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-main" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-option">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（选项）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-opt" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.optionFontSize || 12}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-nav">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（导航栏）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-nav" data-min="10" data-max="20" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${getNavigationFontMetrics(config.navFontSize).fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-highlight-new">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">高亮表格更新</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-highlight-updates',
                              '高亮表格更新',
                              ENABLE_DISABLE_OPTIONS,
                              config.highlightNew ? 'enabled' : 'disabled',
                            )}
                        </div>
                        <div class="acu-setting-row" id="settings-row-dialogue-indent-enabled">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">正文头像渲染</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-dialogue-indent-enabled',
                              '正文头像渲染',
                              ENABLE_DISABLE_OPTIONS,
                              config.dialogueIndentEnabled === true ? 'enabled' : 'disabled',
                            )}
                        </div>
                        <div class="acu-setting-row acu-setting-dependent-row" id="settings-row-dialogue-indent-strategy" ${config.dialogueIndentEnabled === true ? '' : 'hidden'}>
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">识别强度</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-dialogue-indent-strategy',
                              '识别强度',
                              DIALOGUE_INDENT_STRATEGY_OPTIONS,
                              normalizeDialogueIndentStrategy(config.dialogueIndentStrategy),
                            )}
                        </div>
                    </div>
                </div>

                    <!-- 布局与浏览 -->
                    <div class="acu-settings-group ${isGroupExpanded('layout') ? '' : 'collapsed'}" data-group="layout">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('layout')} acu-group-chevron"></i>
                                <i class="fa-solid fa-th-large"></i>
                                <span>布局与浏览</span>
                            </span>
                            ${getTutorialButtonHtml('settingsLayout', '查看布局与浏览教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-layout-mode">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">布局模式</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-layout',
                                  '布局模式',
                                  [
                                    { value: 'horizontal', label: '横向滚动' },
                                    { value: 'vertical', label: '竖向滚动' },
                                  ],
                                  config.layout === 'vertical' ? 'vertical' : 'horizontal',
                                )}
                            </div>
                            <div class="acu-setting-row acu-setting-dependent-row" id="settings-row-horizontal-scrollbar" ${config.layout === 'vertical' ? 'hidden' : ''}>
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">横向滚动条</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-horizontal-scrollbar',
                                  '横向滚动条',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.showHorizontalScrollbar === true ? 'enabled' : 'disabled',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-reverse-all">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片顺序</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-display-order',
                                  '卡片顺序',
                                  [
                                    { value: 'normal', label: '正序', title: '按原始顺序显示' },
                                    { value: 'reverse', label: '倒序', title: '最新记录优先显示' },
                                  ],
                                  areAllTablesReversed(allTableNames) ? 'reverse' : 'normal',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-desktop-nav-aligned">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">PC导航布局</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-desktop-nav-layout',
                                  'PC导航布局',
                                  [
                                    { value: 'compact', label: '紧凑', title: '按内容宽度紧凑排列' },
                                    { value: 'aligned', label: '对齐', title: '使用等宽网格对齐按钮' },
                                  ],
                                  config.desktopNavAligned === true ? 'aligned' : 'compact',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-card-width">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片宽度</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-width" data-min="200" data-max="500" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.cardWidth}px</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row" id="settings-row-per-page">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">每页卡片数</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-per-page" data-min="10" data-max="200" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.itemsPerPage}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row" id="settings-row-grid-cols">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">移动端导航栏列数</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-grid-cols',
                                  '移动端导航栏列数',
                                  [
                                    { value: '2', label: '2列' },
                                    { value: '3', label: '3列' },
                                    { value: '4', label: '4列' },
                                    { value: 'auto', label: '自动' },
                                  ],
                                  String(config.gridColumns || 'auto'),
                                )}
                            </div>
                        </div>
                    </div>

                    <!-- 面板与交互 -->
                    <div class="acu-settings-group ${isGroupExpanded('position') ? '' : 'collapsed'}" data-group="position">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('position')} acu-group-chevron"></i>
                                <i class="fa-solid fa-arrows-alt"></i>
                                <span>面板与交互</span>
                            </span>
                            ${getTutorialButtonHtml('settingsPosition', '查看面板与交互教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-panel-position">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">导航盘位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-position',
                                  '导航盘位置',
                                  [
                                    { value: 'fixed', label: '悬浮底部' },
                                    { value: 'embedded', label: '跟随消息' },
                                    { value: 'viewport', label: '固定底部' },
                                  ],
                                  String(config.positionMode || 'fixed'),
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-action-position">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">功能按钮位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-action-pos',
                                  '功能按钮位置',
                                  [
                                    { value: 'bottom', label: '底部' },
                                    { value: 'top', label: '顶部' },
                                  ],
                                  config.actionsPosition === 'top' ? 'top' : 'bottom',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-collapse-style">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起样式</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-col-style',
                                  '收起样式',
                                  [
                                    { value: 'bar', label: '长条' },
                                    { value: 'pill', label: '胶囊' },
                                    { value: 'floating', label: '浮球' },
                                  ],
                                  normalizeCollapseStyle(config.collapseStyle),
                                )}
                            </div>
                            <div class="acu-setting-row acu-setting-dependent-row" id="cfg-col-align-row" style="${normalizeCollapseStyle(config.collapseStyle) === 'pill' ? '' : 'display:none;'}">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-col-align',
                                  '收起位置',
                                  [
                                    { value: 'right', label: '靠右' },
                                    { value: 'left', label: '靠左' },
                                    { value: 'center', label: '居中' },
                                  ],
                                  String(config.collapseAlign || 'right'),
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-show-options">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">选项面板</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-option-panel',
                                  '选项面板',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.showOptionPanel !== false ? 'enabled' : 'disabled',
                                )}
                            </div>
                            <div class="acu-setting-row" id="row-auto-send">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">点击选项后</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-option-click',
                                  '点击选项后',
                                  [
                                    { value: 'send', label: '直接发送' },
                                    { value: 'input', label: '填入输入框' },
                                  ],
                                  config.clickOptionToAutoSend !== false ? 'send' : 'input',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-navigation-manager">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">导航盘管理</span>
                                </div>
                                <button type="button" id="cfg-navigation-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 骰子系统预设 -->
                    <div class="acu-settings-group ${isGroupExpanded('dicePresets') ? '' : 'collapsed'}" data-group="dicePresets">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('dicePresets')} acu-group-chevron"></i>
                                <i class="fa-solid fa-layer-group"></i>
                                <span>骰子系统预设</span>
                            </span>
                            ${getTutorialButtonHtml('settingsDicePresets', '查看骰子系统预设教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-check-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-sliders"></i> 检定预设</span>
                                </div>
                                <button type="button" id="cfg-advanced-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-attribute-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-gem"></i> 属性预设</span>
                                </div>
                                <button type="button" id="cfg-attribute-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-action-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-wand-magic-sparkles"></i> 交互规则预设</span>
                                </div>
                                <button type="button" id="cfg-action-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-dashboard-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-chart-line"></i> 仪表盘预设</span>
                                </div>
                                <button type="button" id="cfg-dashboard-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-render-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-cells-large"></i> 渲染预设</span>
                                </div>
                                <button type="button" id="cfg-render-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-table-template-requirement-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-list"></i> 模板检验预设</span>
                                </div>
                                <button type="button" id="cfg-table-template-requirement-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-avatar-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-user-circle"></i> 角色头像预设</span>
                                </div>
                                <button type="button" id="cfg-avatar-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-custom-table-name-icon-manager">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-icons"></i> 图标预设</span>
                                </div>
                                <button type="button" id="cfg-custom-table-name-icon-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-validation-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-shield-halved"></i> 数据验证预设 ${renderDeprecatedBadge(DATA_VALIDATION_DEPRECATED_META.deprecatedReason)}</span>
                                </div>
                                <button type="button" id="cfg-validation-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-regex-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-list"></i> 表格正则预设</span>
                                </div>
                                <button type="button" id="cfg-regex-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="navigation-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="navigation-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="navigation-manager-title">
                                    <i class="fa-solid fa-table"></i> 导航盘管理
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭导航盘管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                                <div class="acu-table-manager-hint">
                                    <i class="fa-solid fa-info-circle"></i> 点击眼睛切换显示，拖拽右侧把手调整顺序
                                </div>
                                <div class="acu-table-manager-list" id="table-manager-list">
                                    ${tableManagerHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="validation-preset-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="validation-preset-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="validation-preset-manager-title">
                                    <i class="fa-solid fa-shield-halved"></i> 数据验证预设 ${renderDeprecatedBadge(DATA_VALIDATION_DEPRECATED_META.deprecatedReason)}
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭数据验证预设管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                            <div class="acu-setting-row acu-settings-manager-control-row" id="settings-row-validation-preset-select" style="margin-bottom:8px;">
                                <span>选择数据验证预设</span>
                                <select class="acu-setting-select" id="preset-select" style="flex:1;max-width:160px;">
                                    ${PresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${escapeHtml(p.id)}" ${p.id === PresetManager.getActivePreset()?.id ? 'selected' : ''}>${escapeHtml(p.name)}${p.id === 'default' ? ` v${PRESET_FORMAT_VERSION}` : p.builtin ? ' (内置)' : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div id="settings-row-validation-preset-actions" style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-preset-reset" title="恢复默认预设规则" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 验证规则用于检测数据合法性，<i class="fa-solid fa-shield-halved"></i> 表示启用拦截
                            </div>
                            <div class="acu-validation-rules-list" id="validation-rules-list">
                                ${ValidationRuleManager.getAllRules()
                                  .map(rule => {
                                    const typeInfo = RULE_TYPE_INFO[rule.ruleType] || {
                                      name: rule.ruleType,
                                      icon: 'fa-question',
                                    };
                                    const isTableRule = typeInfo.scope === 'table';
                                    const hasIntercept = rule.intercept;
                                    return `
                                    <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${escapeHtml(rule.id)}">
                                        <div class="acu-rule-type-icon" title="${escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
                                            <i class="fa-solid ${typeInfo.icon}"></i>
                                        </div>
                                        <div class="acu-rule-info">
                                            <div class="acu-rule-name">${escapeHtml(rule.name)}</div>
                                            <div class="acu-rule-target">${escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
                                        </div>
                                        <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截提示' : '点击启用拦截提示（违反时标注）'}"><i class="fa-solid fa-shield-halved"></i></div>
                                        <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
                                        <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                                            <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <button class="acu-add-rule-btn" id="btn-add-validation-rule">
                                <i class="fa-solid fa-plus"></i> 新建数据验证规则
                            </button>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="regex-preset-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="regex-preset-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="regex-preset-manager-title">
                                    <i class="fa-solid fa-table-list"></i> 表格正则预设
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭表格正则预设管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                            <div class="acu-setting-row acu-settings-manager-control-row" id="settings-row-regex-preset-select" style="margin-bottom:8px;">
                                <span>选择表格正则预设</span>
                                <select class="acu-setting-select" id="regex-preset-select" style="flex:1;max-width:160px;">
                                    ${RegexPresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${escapeHtml(p.id)}" ${p.id === RegexPresetManager.getActivePreset()?.id ? 'selected' : ''}>${escapeHtml(p.name)}${p.id === 'regex_default' ? ` v${PRESET_FORMAT_VERSION}` : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div id="settings-row-regex-preset-actions" style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-regex-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-reset" title="恢复默认预设" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 表格正则规则用于自动修改数据库表格内容
                            </div>
                            <!-- 规则列表 -->
                            <div class="acu-validation-rules-list" id="regex-rules-list">
                                ${RegexTransformationManager.getAllRules()
                                  .map(rule => {
                                    const scopeIcon =
                                      rule.scope.type === 'global'
                                        ? 'fa-globe'
                                        : rule.scope.type === 'table'
                                          ? 'fa-table'
                                          : 'fa-columns';
                                    const scopeText =
                                      rule.scope.type === 'global'
                                        ? '全局'
                                        : rule.scope.type === 'table'
                                          ? rule.scope.tableNames?.join(',')
                                          : `${rule.scope.tableNames?.join(',')}.${rule.scope.columnNames?.join(',')}`;
                                    return `
                                    <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${escapeHtml(rule.id)}">
                                        <div class="acu-rule-type-icon" title="作用域: ${escapeHtml(rule.scope.type)}">
                                            <i class="fa-solid ${scopeIcon}"></i>
                                        </div>
                                        <div class="acu-rule-info">
                                            <div class="acu-rule-name">${escapeHtml(rule.name)}</div>
                                            <div class="acu-rule-target" style="font-size:10px;">${escapeHtml(scopeText)} | ${escapeHtml(rule.operation)}</div>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
                                        <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                                            <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button class="acu-add-rule-btn" id="btn-add-regex-rule" style="flex:1;">
                                    <i class="fa-solid fa-plus"></i> 新建验证规则
                                </button>
                                <button class="acu-add-rule-btn" id="btn-import-tavern-regex" style="flex:1;">
                                    <i class="fa-solid fa-file-import"></i> 导入酒馆正则
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <!-- 高级设置 -->
                    <div class="acu-settings-group ${isGroupExpanded('advanced') ? '' : 'collapsed'}" data-group="advanced">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('advanced')} acu-group-chevron"></i>
                                <i class="fa-solid fa-sliders-h"></i>
                                <span>高级设置</span>
                            </span>
                            ${getTutorialButtonHtml('settingsAdvanced', '查看高级设置教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-template-inspection">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-stethoscope"></i> 检验表格模板</span>
                                </div>
                                <button type="button" id="cfg-template-inspection" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-magnifying-glass-chart"></i> 检验
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-debug-console">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-bug"></i> Debug控制台</span>
                                </div>
                                <button type="button" id="btn-open-debug-console" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-terminal"></i> 打开
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-config-backup">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-layer-group"></i> 配置方案与备份</span>
                                </div>
                                <button type="button" id="cfg-config-backup-restore" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-arrows-rotate"></i> 打开
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-clear-cache">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-trash-can"></i> 清空本地缓存</span>
                                </div>
                                <button type="button" id="cfg-clear-local-cache" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-eraser"></i> 清空
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-db-toast-mute">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-bell"></i> 数据库弹窗</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-db-toast',
                                  '数据库弹窗',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.muteDatabaseToasts ? 'disabled' : 'enabled',
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                </div><!-- 关闭 .acu-settings-body -->
            </div>
        </div>
    `);
    $('body').append(dialog);
    // 二级管理弹窗不能留在设置面板的滚动内容里，否则部分移动端浏览器会把 fixed 定位裁进父弹窗。
    dialog.find('.acu-settings-manager-overlay').appendTo(dialog);

    // === 分组折叠交互（带动画） ===
    dialog.find('.acu-settings-group-title').on('click', function () {
      const $group = $(this).closest('.acu-settings-group');
      const $body = $group.find('.acu-settings-group-body');

      // 防止动画过程中重复点击
      if ($body.hasClass('acu-animating')) return;

      const groupId = $group.data('group');
      const $chevron = $(this).find('.acu-group-chevron');
      let expanded = Store.get('acu_settings_expanded', ['appearance']);

      if ($group.hasClass('collapsed')) {
        // 展开
        $group.removeClass('collapsed');
        $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        if (!expanded.includes(groupId)) expanded.push(groupId);

        $body.addClass('acu-animating').show();
        const targetHeight = $body.prop('scrollHeight');
        $body.css('height', 0).animate({ height: targetHeight }, 180, function () {
          $(this).css('height', '').removeClass('acu-animating');
        });
      } else {
        // 收起
        $group.addClass('collapsed');
        $chevron.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        expanded = expanded.filter(id => id !== groupId);

        const currentHeight = $body.outerHeight();
        $body
          .addClass('acu-animating')
          .css('height', currentHeight)
          .animate({ height: 0 }, 180, function () {
            $(this).hide().css('height', '').removeClass('acu-animating');
          });
      }

      Store.set('acu_settings_expanded', expanded);
    });

    // === 设置项事件绑定 ===
    // 主题
    dialog.find('#cfg-theme').on('change', function () {
      const newTheme = $(this).val();
      saveConfig({ theme: newTheme });
      dialog.removeClass(THEMES.map(t => `acu-theme-${t.id}`).join(' ')).addClass(`acu-theme-${newTheme}`);
      dialog
        .find('.acu-edit-dialog')
        .removeClass(THEMES.map(t => `acu-theme-${t.id}`).join(' '))
        .addClass(`acu-theme-${newTheme}`);
      scheduleDialogueIndentRender();
    });

    // 字体
    dialog.find('#cfg-font-family').on('change', function () {
      saveConfig({ fontFamily: $(this).val() });
    });

    // 管理检定预设按钮
    dialog.find('#cfg-advanced-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showPresetListDialog();
    });

    // 管理属性预设按钮
    dialog.find('#cfg-attribute-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showAttributePresetManager();
    });

    // 管理交互规则预设按钮
    dialog.find('#cfg-action-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showActionPresetManager();
    });

    // 管理仪表盘预设按钮
    dialog.find('#cfg-dashboard-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showDashboardPresetManager();
    });

    // 检验当前聊天表格模板
    dialog.find('#cfg-template-inspection').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showTemplateInspectionModal();
    });

    dialog.find('#cfg-custom-table-name-icon-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showCustomTableNameIconManager();
    });

    // 管理渲染预设按钮
    dialog.find('#cfg-render-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showRenderPresetManager();
    });

    // 管理模板检验预设按钮
    dialog.find('#cfg-table-template-requirement-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showTableTemplateRequirementPresetManager();
    });

    // 管理角色头像预设按钮
    dialog.find('#cfg-avatar-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      let nodeArr: AvatarManagerNode[] = [];
      try {
        nodeArr = getCurrentChatAvatarNodes();
      } catch (error) {
        console.warn('[DICE]角色头像预设入口读取当前聊天角色失败，改为打开全局头像库:', error);
      }
      dialog.remove();
      setIsSettingsOpen(false);
      showAvatarManager(nodeArr, undefined, { initialView: 'global' });
    });

    const openSettingsManagerDialog = (selector: string) => {
      const $manager = dialog.find(selector);
      if (!$manager.length) return;
      $manager.prop('hidden', false).attr('aria-hidden', 'false');
      setTimeout(() => {
        $manager.find('.acu-settings-manager-close').trigger('focus');
      }, 0);
    };

    const closeSettingsManagerDialog = ($manager: JQuery<HTMLElement>) => {
      $manager.prop('hidden', true).attr('aria-hidden', 'true');
    };

    dialog.find('#cfg-validation-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#validation-preset-manager-dialog');
    });

    dialog.find('#cfg-regex-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#regex-preset-manager-dialog');
    });

    dialog.find('#cfg-navigation-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#navigation-manager-dialog');
    });

    dialog.on('click', '.acu-settings-manager-close, .acu-settings-manager-backdrop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeSettingsManagerDialog($(this).closest('.acu-settings-manager-overlay') as JQuery<HTMLElement>);
    });

    dialog.on('click', '.acu-settings-manager-dialog', function (e) {
      e.stopPropagation();
    });

    dialog.on('keydown', function (e) {
      if (e.key !== 'Escape') return;
      const $visibleManager = dialog.find('.acu-settings-manager-overlay:not([hidden])').last();
      if (!$visibleManager.length) return;
      e.preventDefault();
      e.stopPropagation();
      closeSettingsManagerDialog($visibleManager as JQuery<HTMLElement>);
    });

    dialog.on('click', '.acu-setting-segmented-option', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const $button = $(this);
      if ($button.prop('disabled')) return;
      const value = String($button.data('value') ?? '');
      const controlId = String($button.closest('.acu-setting-segmented').attr('id') ?? '');
      if (!controlId || !value) return;

      const $group = $button.closest('.acu-setting-segmented');
      $group.find('.acu-setting-segmented-option').removeClass('active').attr('aria-checked', 'false');
      $button.addClass('active').attr('aria-checked', 'true');

      if (controlId === 'cfg-layout') {
        saveConfig({ layout: value });
        dialog.find('#settings-row-horizontal-scrollbar').prop('hidden', value === 'vertical');
        renderInterface();
        return;
      }
      if (controlId === 'cfg-highlight-updates') {
        saveConfig({ highlightNew: value === 'enabled' });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-dialogue-indent-strategy') {
        saveConfig({ dialogueIndentStrategy: normalizeDialogueIndentStrategy(value) });
        refreshDialogueIndentRender();
        return;
      }
      if (controlId === 'cfg-dialogue-indent-enabled') {
        const enabled = value === 'enabled';
        saveConfig({ dialogueIndentEnabled: enabled });
        dialog.find('#settings-row-dialogue-indent-strategy').prop('hidden', !enabled);
        refreshDialogueIndentRender();
        return;
      }
      if (controlId === 'cfg-horizontal-scrollbar') {
        saveConfig({ showHorizontalScrollbar: value === 'enabled' });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-grid-cols') {
        saveConfig({ gridColumns: value });
        return;
      }
      if (controlId === 'cfg-display-order') {
        setAllTablesReverse(allTableNames, value === 'reverse');
        renderInterface();
        return;
      }
      if (controlId === 'cfg-desktop-nav-layout') {
        saveConfig({ desktopNavAligned: value === 'aligned' });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-position') {
        saveConfig({ positionMode: value });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-action-pos') {
        saveConfig({ actionsPosition: value });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-col-style') {
        const collapseStyle = normalizeCollapseStyle(value);
        saveConfig({ collapseStyle });
        const $alignRow = dialog.find('#cfg-col-align-row');
        if (collapseStyle === 'pill') $alignRow.removeAttr('style');
        else $alignRow.attr('style', 'display:none;');
        renderInterface();
        return;
      }
      if (controlId === 'cfg-col-align') {
        saveConfig({ collapseAlign: value });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-option-panel') {
        saveConfig({ showOptionPanel: value === 'enabled' });
        renderInterface();
        return;
      }
      if (controlId === 'cfg-option-click') {
        saveConfig({ clickOptionToAutoSend: value === 'send' });
        return;
      }
      if (controlId === 'cfg-db-toast') {
        saveConfig({ muteDatabaseToasts: value === 'disabled' });
      }
    });
    // === 导航盘管理：点击切换显示/隐藏 ===
    dialog.find('.acu-table-item-check').on('click', function (e) {
      e.stopPropagation();
      const $item = $(this).closest('.acu-table-manager-item');
      const tableName = $item.data('table-name');
      let hiddenList = getHiddenTables();
      const $icon = $(this).find('i');

      if (hiddenList.includes(tableName)) {
        // 显示
        hiddenList = hiddenList.filter(n => n !== tableName);
        $item.removeClass('hidden-table');
        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
      } else {
        // 隐藏
        hiddenList.push(tableName);
        $item.addClass('hidden-table');
        $icon.removeClass('fa-eye').addClass('fa-eye-slash');
      }

      saveHiddenTables(hiddenList);
      renderInterface();
    });

    // === 导航盘管理：拖拽排序 ===
    const $list = dialog.find('#table-manager-list');
    createSortableList({
      container: $list,
      itemSelector: '.acu-table-manager-item',
      handleSelector: '.acu-table-item-handle',
      cancelSelector: '.acu-table-item-check',
      getItemId: item => {
        const tableName = $(item).data('table-name');
        if (typeof tableName === 'string') return tableName;
        if (tableName !== undefined && tableName !== null) return String(tableName);
        return null;
      },
      onOrderChange: newOrder => {
        saveTableOrder(newOrder);
      },
    });

    // === Stepper 步进器事件 ===
    dialog.find('.acu-stepper').each(function () {
      const $stepper = $(this);
      const id = $stepper.data('id');
      const min = parseInt($stepper.data('min'));
      const max = parseInt($stepper.data('max'));
      const step = parseInt($stepper.data('step'));
      const $value = $stepper.find('.acu-stepper-value');

      const updateValue = newVal => {
        newVal = Math.max(min, Math.min(max, newVal));
        const unit = id === 'cfg-per-page' ? '' : 'px';
        $value.text(newVal + unit);

        // 实时预览
        if (id === 'cfg-width') {
          $(DICE_ROOT_SELECTOR).css('--acu-card-width', newVal + 'px');
          saveConfig({ cardWidth: newVal });
        } else if (id === 'cfg-font-main') {
          $(DICE_ROOT_SELECTOR).css('--acu-font-size', newVal + 'px');
          saveConfig({ fontSize: newVal });
        } else if (id === 'cfg-font-opt') {
          $(`${DICE_ROOT_SELECTOR}, .acu-embedded-options-container`).css('--acu-opt-font-size', newVal + 'px');
          saveConfig({ optionFontSize: newVal });
        } else if (id === 'cfg-font-nav') {
          const navMetrics = getNavigationFontMetrics(newVal);
          $(DICE_ROOT_SELECTOR)
            .css('--acu-nav-button-size', navMetrics.buttonSize + 'px')
            .css('--acu-nav-font-size', navMetrics.fontSize + 'px')
            .css('--acu-nav-icon-size', navMetrics.iconSize + 'px')
            .css('--acu-nav-button-padding-x', navMetrics.paddingX + 'px');
          saveConfig({ navFontSize: navMetrics.fontSize });
        } else if (id === 'cfg-per-page') {
          saveConfig({ itemsPerPage: newVal });
        }
      };

      const getCurrentValue = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || min;
      };

      $stepper.find('.acu-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });

      $stepper.find('.acu-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });

    // === 验证规则：切换启用/禁用（使用事件委托支持动态元素）===
    dialog.on('click', '.acu-rule-toggle', function (e) {
      e.stopPropagation();
      const $toggle = $(this);
      const $item = $toggle.closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const $icon = $toggle.find('i');
      const isCurrentlyActive = $toggle.hasClass('active');

      // 切换状态
      ValidationRuleManager.toggleRuleEnabled(ruleId, !isCurrentlyActive);

      // 更新 UI
      if (isCurrentlyActive) {
        $toggle.removeClass('active');
        $icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
        $item.addClass('disabled');
      } else {
        $toggle.addClass('active');
        $icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
        $item.removeClass('disabled');
      }
    });

    // === 验证规则：编辑规则 ===
    dialog.on('click', '#validation-rules-list .acu-rule-edit', function (e) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const rule = ValidationRuleManager.getRule(ruleId);
      if (!rule) return;

      // 打开编辑弹窗（保留设置弹窗用于更新列表）
      showAddValidationRuleModal(dialog, ruleId);
    });

    // === 验证规则：删除规则（使用事件委托）===
    dialog.on('click', '#validation-rules-list .acu-rule-delete', async function (e) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const $item = $(this).closest('.acu-validation-rule-item');
      const rule = ValidationRuleManager.getRule(ruleId);

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除验证规则',
        message: `确定要删除规则「${rule?.name || '自定义规则'}」吗？`,
        detail: '删除后需要重新创建或导入规则才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除规则',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        if (ValidationRuleManager.removeCustomRule(ruleId)) {
          $item.fadeOut(200, function () {
            $(this).remove();
          });
        }
      }
    });

    // === 验证规则：切换拦截状态（使用事件委托）===
    dialog.on('click', '.acu-rule-intercept', function (e) {
      e.stopPropagation();
      const $btn = $(this);
      const ruleId = $btn.data('rule-id');
      const isCurrentlyActive = $btn.hasClass('active');

      if (ValidationRuleManager.toggleRuleIntercept(ruleId, !isCurrentlyActive)) {
        if (isCurrentlyActive) {
          $btn.removeClass('active').attr('title', '点击启用拦截提示（违反时标注）');
        } else {
          $btn.addClass('active').attr('title', '点击关闭拦截提示');
        }
      }
    });

    // === 预设管理事件 ===
    const refreshPresetUI = () => {
      ValidationRuleManager.clearCache();
      const rules = ValidationRuleManager.getAllRules();
      let html = '';
      rules.forEach(rule => {
        const typeInfo = RULE_TYPE_INFO[rule.ruleType] || { name: rule.ruleType, icon: 'fa-question' };
        const isTableRule = typeInfo.scope === 'table';
        const hasIntercept = rule.intercept;
        html += `
          <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${escapeHtml(rule.id)}">
            <div class="acu-rule-type-icon" title="${escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
              <i class="fa-solid ${typeInfo.icon}"></i>
            </div>
            <div class="acu-rule-info">
              <div class="acu-rule-name">${escapeHtml(rule.name)}</div>
              <div class="acu-rule-target">${escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
            </div>
            <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截提示' : '点击启用拦截提示（违反时标注）'}"><i class="fa-solid fa-shield-halved"></i></div>
            <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
            <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
              <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </div>
            <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>`;
      });
      dialog.find('#validation-rules-list').html(html);
    };

    // 切换预设
    dialog.find('#preset-select').on('change', function () {
      if (PresetManager.setActivePreset($(this).val())) {
        refreshPresetUI();
      }
    });

    // 复制预设
    dialog.find('#btn-preset-dup').on('click', function () {
      const preset = PresetManager.getActivePreset();
      if (!preset) return;
      const newPreset = PresetManager.duplicatePreset(preset.id);
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 新建预设
    dialog.find('#btn-preset-new').on('click', async function () {
      const name = await showDiceSystemInputDialog({
        title: '新建数据验证预设',
        message: '请输入新预设名称',
        iconClass: 'fa-plus',
        initialValue: '我的预设',
        confirmText: '新建预设',
      });
      if (!name?.trim()) return;
      const newPreset = PresetManager.createPreset(name.trim());
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 删除预设
    dialog.find('#btn-preset-del').on('click', async function () {
      const preset = PresetManager.getActivePreset();
      if (!preset) return;
      if (preset.id === 'default') {
        if (window.toastr) window.toastr.warning('默认预设不能删除');
        return;
      }
      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除数据验证预设',
        message: `确定要删除预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;
      if (PresetManager.deletePreset(preset.id)) {
        dialog.find(`#preset-select option[value="${preset.id}"]`).remove();
        dialog.find('#preset-select').val('default').trigger('change');
      }
    });

    // 导出预设
    dialog.find('#btn-preset-export').on('click', function () {
      const preset = PresetManager.getActivePreset();
      if (!preset) return;
      const json = PresetManager.exportPreset(preset.id);
      if (json) {
        // 同属性预设导出方式一致：优先导出为文件，避免聊天窗口等环境的粘贴长度限制
        try {
          const filename = `acu_validation_preset_${preset.name || preset.id}_${Date.now()}.json`;
          downloadJsonFile(json, filename);
        } catch (e) {
          // 如果浏览器不支持 Blob 下载，则回退到剪贴板/弹窗复制
          navigator.clipboard
            .writeText(json)
            .then(() => {})
            .catch(() => {
              void showDiceSystemInputDialog({
                title: '复制预设 JSON',
                message: '自动复制失败，请手动复制以下内容',
                iconClass: 'fa-copy',
                initialValue: json,
                confirmText: '关闭',
                multiline: true,
                readonly: true,
                hideCancel: true,
              });
            });
        }
      }
    });

    // 导入预设（使用文件选择器）
    dialog.find('#btn-preset-import').on('click', function () {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const json = selected.text;
          if (!json?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = parseJsoncRecord(json.trim(), '数据验证预设');
          } catch (error) {
            console.error('[DICE]PresetManager JSONC 解析失败:', error);
            if (window.toastr) showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const parsedPreset = isRecordValue(parsedData.preset) ? parsedData.preset : null;
          const importingName =
            typeof parsedPreset?.name === 'string' && parsedPreset.name.trim()
              ? parsedPreset.name.trim()
              : '导入的预设';
          const existingPresets = PresetManager.getAllPresets();
          const existingNames = existingPresets.map(p => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = async (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = json.trim();
            if (newName && parsedPreset) {
              parsedPreset.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedPreset.id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find(p => p.name === importingName);
              if (existingPreset && existingPreset.id !== 'default') {
                PresetManager.deletePreset(existingPreset.id);
                dialog.find(`#preset-select option[value="${existingPreset.id}"]`).remove();
              }
            }

            const result = PresetManager.importPreset(finalJson, false);
            if (result && result.preset) {
              const newPreset = result.preset;
              dialog
                .find('#preset-select')
                .append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
              dialog.find('#preset-select').val(newPreset.id).trigger('change');

              // 如果版本较旧，提示用户是否合并
              if (result.needsMerge) {
                const confirmed = await showDiceSystemConfirmDialog({
                  title: '合并默认值',
                  message: '检测到预设版本较旧，是否要合并新版本的默认值？',
                  detail: '这将保留您的自定义规则，并添加新版本中的新规则。',
                  iconClass: 'fa-code-merge',
                  confirmText: '合并默认值',
                  cancelText: '暂不合并',
                  tone: 'warning',
                });
                if (confirmed) {
                  if (PresetManager.mergePresetWithDefaults(newPreset.id)) {
                    refreshPresetUI();
                  } else {
                    if (window.toastr) showActionableErrorToast('合并失败', { title: '预设合并失败', suggestion: 'importExport' });
                  }
                }
              }
            } else {
              if (window.toastr) showActionableErrorToast('导入失败，请检查格式', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            showPresetConflictDialog({
              presetName: importingName,
              presetType: '数据验证',
              existingNames,
              onOverwrite: () => {
                void doImport(true);
              },
              onRename: newName => {
                void doImport(false, newName);
              },
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            await doImport(false);
          }
        } catch (err) {
          console.error('[DICE]PresetManager 导入失败:', err);
          if (window.toastr) showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        }
      })();
    });

    // 恢复默认预设规则
    dialog.find('#btn-preset-reset').on('click', async function () {
      const confirmed = await showDiceSystemConfirmDialog({
        title: '恢复默认预设',
        message: '确定要将默认预设恢复为初始状态吗？',
        detail: '这将删除所有对默认预设的修改。',
        iconClass: 'fa-rotate-left',
        confirmText: '恢复默认',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;
      if (PresetManager.resetDefaultPreset()) {
        // 如果当前是默认预设，刷新规则列表
        if (PresetManager.getActivePreset()?.id === 'default') {
          refreshPresetUI();
        }
      } else {
        if (window.toastr) showActionableErrorToast('恢复失败', { suggestion: 'save' });
      }
    });

    // === 表格正则规则:切换启用/禁用 ===
    dialog.on('click', '#regex-rules-list .acu-rule-toggle', function () {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const currentState = RegexTransformationManager.getAllRules().find(r => r.id === ruleId)?.enabled;
      const newState = !currentState;
      const rule = RegexTransformationManager.getRule(ruleId);

      RegexTransformationManager.toggleRuleEnabled(ruleId, newState);

      if (newState) {
      } else {
        toastr.info('规则已禁用');
      }

      refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
    });

    // === 表格正则规则：编辑规则 ===
    dialog.on('click', '#regex-rules-list .acu-rule-edit', function () {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const rule = RegexTransformationManager.getRule(ruleId);
      if (!rule) return;

      // 打开编辑弹窗
      showAddRegexRuleModal(ruleId);
    });

    // === 表格正则规则:删除规则 ===
    dialog.on('click', '#regex-rules-list .acu-rule-delete', async function () {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const rule = RegexTransformationManager.getRule(ruleId);
      if (!rule) return;

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除表格正则规则',
        message: `确定要删除规则「${rule.name}」吗？`,
        detail: '删除后需要重新创建或导入规则才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除规则',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        RegexTransformationManager.removeRule(ruleId);
        refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
      }
    });

    // === 表格正则预设:切换预设 ===
    dialog.find('#regex-preset-select').on('change', function () {
      const presetId = $(this).val();
      RegexPresetManager.setActivePreset(String(presetId));

      refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
    });

    // === 表格正则预设:复制预设 ===
    dialog.find('#btn-regex-preset-dup').on('click', async function () {
      const currentPreset = RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const name = await showDiceSystemInputDialog({
        title: '复制表格正则预设',
        message: '请输入新预设名称',
        iconClass: 'fa-copy',
        initialValue: `${currentPreset.name} (副本)`,
        confirmText: '创建副本',
      });
      if (!name) return;

      const newPreset = RegexPresetManager.createPreset(name, currentPreset.id);
      if (newPreset) {
        // [修复] 刷新预设下拉列表
        const $presetSelect = dialog.find('#regex-preset-select');
        $presetSelect.append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        $presetSelect.val(newPreset.id);

        refreshRegexRulesList(); // 刷新规则列表
      } else {
        showActionableErrorToast('预设名称已存在', { suggestion: 'input' });
      }
    });

    // === 表格正则预设:新建预设 ===
    dialog.find('#btn-regex-preset-new').on('click', async function () {
      const name = await showDiceSystemInputDialog({
        title: '新建表格正则预设',
        message: '请输入预设名称',
        iconClass: 'fa-plus',
        placeholder: '预设名称',
        confirmText: '新建预设',
      });
      if (!name) return;

      const newPreset = RegexPresetManager.createPreset(name, null);
      if (newPreset) {
        RegexPresetManager.setActivePreset(newPreset.id);

        // [修复] 刷新预设下拉列表
        const $presetSelect = dialog.find('#regex-preset-select');
        $presetSelect.append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        $presetSelect.val(newPreset.id);

        refreshRegexRulesList(); // 刷新规则列表
      } else {
        showActionableErrorToast('预设名称已存在', { suggestion: 'input' });
      }
    });

    // === 表格正则预设:删除预设 ===
    dialog.find('#btn-regex-preset-del').on('click', async function () {
      const currentPreset = RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除表格正则预设',
        message: `确定要删除预设「${currentPreset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = RegexPresetManager.deletePreset(currentPreset.id);
        if (success) {
          // [修复] 刷新预设下拉列表
          const $presetSelect = dialog.find('#regex-preset-select');
          $presetSelect.find(`option[value="${currentPreset.id}"]`).remove();

          // 切换到默认预设
          const defaultPresetId = RegexPresetManager.getActivePreset()?.id;
          if (defaultPresetId) {
            $presetSelect.val(defaultPresetId);
          }

          refreshRegexRulesList(); // 刷新规则列表
        } else {
          showActionableErrorToast('不能删除最后一个预设', { suggestion: 'input' });
        }
      }
    });

    // === 表格正则预设：导出预设 ===
    dialog.find('#btn-regex-preset-export').on('click', function () {
      const currentPreset = RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const json = RegexPresetManager.exportPreset(currentPreset.id);
      if (json) {
        downloadJsonFile(json, `regex-preset-${currentPreset.name}-${Date.now()}.json`);
      }
    });

    // === 表格正则预设：导入预设 ===
    dialog.find('#btn-regex-preset-import').on('click', function () {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const text = selected.text;
          if (!text?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = parseJsoncRecord(text.trim(), '正则预设');
          } catch (error) {
            console.error('[DICE]RegexPresetManager JSONC 解析失败:', error);
            showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const importingName =
            typeof parsedData.name === 'string' && parsedData.name.trim() ? parsedData.name.trim() : '导入的预设';
          const existingPresets = RegexPresetManager.getAllPresets();
          const existingNames = existingPresets.map(p => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = text.trim();
            if (newName) {
              parsedData.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedData.id = `regex_preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find(p => p.name === importingName);
              if (existingPreset) {
                // 检查是否不是最后一个预设
                if (existingPresets.length > 1) {
                  RegexPresetManager.deletePreset(existingPreset.id);
                  dialog.find(`#regex-preset-select option[value="${existingPreset.id}"]`).remove();
                }
              }
            }

            const preset = RegexPresetManager.importPreset(finalJson);
            if (preset) {
              // [修复] 刷新预设下拉列表
              const $presetSelect = dialog.find('#regex-preset-select');
              $presetSelect.append(`<option value="${escapeHtml(preset.id)}">${escapeHtml(preset.name)}</option>`);
              $presetSelect.val(preset.id);

              // [修复] 切换到导入的预设并同步规则到实际存储
              RegexPresetManager.setActivePreset(preset.id);
              Store.set(STORAGE_KEY_REGEX_RULES, preset.rules || []);
              RegexTransformationManager.clearCache();

              refreshRegexRulesList(); // 刷新规则列表
            } else {
              showActionableErrorToast('预设格式无效', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            showPresetConflictDialog({
              presetName: importingName,
              presetType: '表格正则',
              existingNames,
              onOverwrite: () => doImport(true),
              onRename: newName => doImport(false, newName),
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            doImport(false);
          }
        } catch (err) {
          showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        }
      })();
    });

    // === 表格正则预设：恢复默认预设 ===
    dialog.find('#btn-regex-preset-reset').on('click', async function () {
      const confirmed = await showDiceSystemConfirmDialog({
        title: '恢复表格正则默认预设',
        message: '确定要恢复默认预设吗？',
        detail: '此操作将清除当前所有正则规则，并恢复为系统内置的默认规则。',
        iconClass: 'fa-rotate-left',
        confirmText: '恢复默认',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;

      // 重置默认预设的规则为内置规则
      const presets = RegexPresetManager.getAllPresets();
      let defaultPreset = presets.find(p => p.id === 'regex_default');

      if (defaultPreset) {
        // 用内置规则覆盖默认预设
        defaultPreset.rules = JSON.parse(JSON.stringify(BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true }))));
        defaultPreset.version = PRESET_FORMAT_VERSION;
        defaultPreset.updatedAt = Date.now();
      } else {
        // 默认预设不存在，创建它
        defaultPreset = {
          id: 'regex_default',
          name: '默认预设',
          description: '系统默认的表格正则预设',
          version: PRESET_FORMAT_VERSION,
          rules: JSON.parse(JSON.stringify(BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true })))),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        presets.unshift(defaultPreset);
      }
      RegexPresetManager._save(presets);

      // 切换到默认预设并同步规则
      Store.set(STORAGE_KEY_REGEX_ACTIVE_PRESET, 'regex_default');

      // 强制用内置规则覆盖规则存储
      Store.set(
        STORAGE_KEY_REGEX_RULES,
        JSON.parse(JSON.stringify(BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true })))),
      );
      RegexTransformationManager.clearCache();

      // 刷新UI - 重新渲染下拉框选项
      const $presetSelect = dialog.find('#regex-preset-select');
      $presetSelect.empty();
      RegexPresetManager.getAllPresets().forEach(p => {
        const versionSuffix = p.id === 'regex_default' ? ` v${PRESET_FORMAT_VERSION}` : '';
        $presetSelect.append(`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}${versionSuffix}</option>`);
      });
      $presetSelect.val('regex_default');
      refreshRegexRulesList();

      toastr.success(`已恢复默认预设，包含 ${BUILTIN_REGEX_RULES.length} 条内置规则`);
    });

    // === 表格正则规则:添加规则 ===
    dialog.find('#btn-add-regex-rule').on('click', function () {
      showAddRegexRuleModal();
    });

    // === 表格正则规则:导入酒馆正则 ===
    dialog.find('#btn-import-tavern-regex').on('click', function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          if (!text?.trim()) return;

          let parsed;
          try {
            parsed = JSON.parse(text.trim());
          } catch {
            showActionableErrorToast('JSON格式无效', { suggestion: 'importExport' });
            return;
          }

          // 支持单个对象或数组
          const tavernRegexList: TavernRegex[] = Array.isArray(parsed) ? parsed : [parsed];

          // 验证格式：必须有 scriptName 和 findRegex
          if (!tavernRegexList.every(r => r.scriptName && r.findRegex)) {
            showActionableErrorToast('不是有效的酒馆正则格式（需要 scriptName 和 findRegex 字段）', {
              suggestion: '请确认导入文件是 SillyTavern 正则导出 JSON，并包含 scriptName 与 findRegex 字段。',
            });
            return;
          }

          const existingRules = RegexTransformationManager.getAllRules();
          const existingNames = existingRules.map(r => r.name);

          let importedCount = 0;
          let skippedCount = 0;

          // 逐条处理导入
          const processNext = (index: number): void => {
            if (index >= tavernRegexList.length) {
              // 全部处理完成
              refreshRegexRulesList();
              if (skippedCount > 0) {
                toastr.info(`导入完成: ${importedCount} 条成功, ${skippedCount} 条跳过`);
              } else if (importedCount > 0) {
                toastr.success(`成功导入 ${importedCount} 条酒馆正则规则`);
              }
              return;
            }

            const tavernRegex = tavernRegexList[index];
            const convertedRule = convertTavernRegexToRule(tavernRegex);
            const hasConflict = existingNames.includes(convertedRule.name);

            if (hasConflict) {
              // 有冲突，弹窗询问
              showPresetConflictDialog({
                presetName: convertedRule.name,
                presetType: '酒馆正则规则',
                existingNames,
                onOverwrite: () => {
                  // 删除旧规则
                  const oldRule = RegexTransformationManager.getAllRules().find(r => r.name === convertedRule.name);
                  if (oldRule) RegexTransformationManager.removeRule(oldRule.id);
                  RegexTransformationManager.addCustomRule(convertedRule);
                  existingNames.push(convertedRule.name);
                  importedCount++;
                  processNext(index + 1);
                },
                onRename: newName => {
                  convertedRule.name = newName;
                  convertedRule.id = `tavern_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  RegexTransformationManager.addCustomRule(convertedRule);
                  existingNames.push(newName);
                  importedCount++;
                  processNext(index + 1);
                },
                onCancel: () => {
                  skippedCount++;
                  processNext(index + 1);
                },
              });
            } else {
              // 无冲突，直接添加
              RegexTransformationManager.addCustomRule(convertedRule);
              existingNames.push(convertedRule.name);
              importedCount++;
              processNext(index + 1);
            }
          };

          // 开始处理
          processNext(0);
        } catch (err) {
          showActionableErrorToast('导入失败: ' + (err as Error).message, { suggestion: 'importExport' });
        }
      };
      input.click();
    });

    // === 验证规则:添加自定义规则 ===
    dialog.find('#btn-add-validation-rule').on('click', function () {
      showAddValidationRuleModal(dialog);
    });

    // === Debug控制台 ===
    dialog.find('#btn-open-debug-console').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      setIsSettingsOpen(false);
      showDebugConsoleModal();
    });

    // === 配置方案与备份 ===
    dialog.find('#cfg-config-backup-restore').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showDiceConfigBackupDialog();
    });

    // === 清空本地缓存 ===
    dialog.find('#cfg-clear-local-cache').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      showManualUpdateDialog({
        title: '清空本地缓存',
        iconClass: 'fa-trash-can',
        description: '您确定要清空本地缓存数据吗？此操作主要用于解决缓存冲突或空间不足问题。',
        safeTitle: '高风险操作',
        safeDescription: '注意：此操作将永久删除本地保存的所有配置（包括主题色、布局、规则设置等）。',
        confirmText: '确认清空',
        loadingText: '正在清理...',
        isDanger: true,
        safeIconClass: 'fa-triangle-exclamation',
        onConfirm: async () => {
          const removedLocalStorageKeys = await clearDiceLocalCacheData();
          if (window.toastr) {
            window.toastr.success(
              `本地缓存已清理（localStorage ${removedLocalStorageKeys} 项，含 IndexedDB/脚本缓存）。建议刷新页面以重新初始化设置。`,
            );
          }
        },
      });
    });

    // === 关闭 ===
    const closeDialog = () => {
      setIsSettingsOpen(false);
      dialog.remove();
      renderInterface();
    };
    dialog.on('click', '#dlg-close-x, .acu-settings-header .acu-close-btn', closeDialog);

    // 手动更新按钮点击事件
    dialog.on('click', '#acu-manual-update-btn', function (e) {
      e.stopPropagation();
      showManualUpdateDialog();
    });
    setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);
  };

  // [优化] 渲染防抖：避免短时间内多次渲染导致重复日志
  let renderInterfaceTimer = null;
  let renderInterfacePending = false;
  let viewportBoundsListenerAttached = false;
  let viewportBoundsListenerWindow: Window | null = null;
  let viewportBoundsRefreshHandler: (() => void) | null = null;
  let viewportBoundsRaf: number | null = null;
  let viewportInputResizeObserver: ResizeObserver | null = null;
  let viewportInputMutationObserver: MutationObserver | null = null;
  let viewportInputObservedElements: HTMLElement[] = [];
  let viewportInputMutationWindow: Window | null = null;
  let viewportInputMutationDocument: Document | null = null;
  let viewportInputTargetsRaf: number | null = null;
  let fixedWrapperBoundsListenerWindow: Window | null = null;
  let fixedWrapperBoundsRefreshHandler: (() => void) | null = null;
  let fixedWrapperBoundsRaf: number | null = null;
  let fixedAnchorResizeObserver: ResizeObserver | null = null;
  let fixedAnchorMutationObserver: MutationObserver | null = null;
  let fixedAnchorMutationWindow: Window | null = null;
  let fixedAnchorMutationDocument: Document | null = null;
  let fixedAnchorTargetsRaf: number | null = null;
  let floatingCollapseBoundsListenerWindow: Window | null = null;
  let floatingCollapseBoundsRefreshHandler: (() => void) | null = null;
  let floatingCollapseBoundsRaf: number | null = null;
  let suppressNextFloatingCollapseClick = false;

  const VIEWPORT_BOTTOM_ANCHOR_SELECTORS = [
    '#send_form',
    '#form_sheld',
    '#send_textarea',
    '#chat_input',
    '#send_but',
  ] as const;
  const VIEWPORT_BOTTOM_REFRESH_EVENTS = [
    'input',
    'change',
    'focus',
    'blur',
    'keyup',
    'compositionend',
    'click',
    'pointerup',
    'transitionend',
  ] as const;
  const VIEWPORT_COMPOSER_ELEMENT_IDS = new Set(['send_form', 'form_sheld', 'send_textarea', 'chat_input']);
  // iPad 横屏可到 1366px；固定底部导航在这类视口下应跟随聊天容器，而不是输入框内部宽度。
  const TABLET_FIXED_NAV_FULL_WIDTH_MAX = 1366;
  const FIXED_MODE_ANCHOR_PRIORITY = new Map([
    ['send_form', 0],
    ['form_sheld', 1],
    ['chat_input', 2],
    ['send_textarea', 3],
    ['send_but', 4],
  ]);
  interface FloatingCollapsePosition {
    left: number;
    top: number;
  }

  const FLOATING_COLLAPSE_SIZE = 48;
  const FLOATING_COLLAPSE_MARGIN = 12;
  const FLOATING_COLLAPSE_DRAG_THRESHOLD = 5;

  const isFloatingCollapseActive = (config = getConfig()): boolean =>
    getCollapsedState() && normalizeCollapseStyle(config.collapseStyle) === 'floating';

  const normalizeFloatingCollapsePosition = (value: unknown): FloatingCollapsePosition | null => {
    if (!value || typeof value !== 'object') return null;
    const raw = value as { left?: unknown; top?: unknown };
    const left = typeof raw.left === 'number' && Number.isFinite(raw.left) ? raw.left : null;
    const top = typeof raw.top === 'number' && Number.isFinite(raw.top) ? raw.top : null;
    if (left === null || top === null) return null;
    return { left, top };
  };

  const getFloatingViewportBounds = (targetWindow: Window, targetDocument: Document) => {
    const visualViewport = targetWindow.visualViewport;
    const left = visualViewport?.offsetLeft || 0;
    const top = visualViewport?.offsetTop || 0;
    const width =
      visualViewport?.width ||
      targetWindow.innerWidth ||
      targetDocument.documentElement.clientWidth ||
      window.innerWidth ||
      FLOATING_COLLAPSE_SIZE;
    const height =
      visualViewport?.height ||
      targetWindow.innerHeight ||
      targetDocument.documentElement.clientHeight ||
      window.innerHeight ||
      FLOATING_COLLAPSE_SIZE;

    return { left, top, width, height };
  };

  const clampFloatingCollapsePosition = (
    position: FloatingCollapsePosition | null,
    targetWindow = getTavernHostWindow(),
    targetDocument = getTavernHostDocument(),
  ): FloatingCollapsePosition => {
    const bounds = getFloatingViewportBounds(targetWindow, targetDocument);
    const margin = FLOATING_COLLAPSE_MARGIN;
    const maxLeft = Math.max(bounds.left + margin, bounds.left + bounds.width - FLOATING_COLLAPSE_SIZE - margin);
    const maxTop = Math.max(bounds.top + margin, bounds.top + bounds.height - FLOATING_COLLAPSE_SIZE - margin);
    const defaultBottomOffset = Math.max(margin, getViewportBottomOffset());
    const fallback = {
      left: bounds.left + bounds.width - FLOATING_COLLAPSE_SIZE - margin,
      top: bounds.top + bounds.height - FLOATING_COLLAPSE_SIZE - defaultBottomOffset,
    };
    const raw = position || fallback;

    return {
      left: Math.round(Math.min(Math.max(raw.left, bounds.left + margin), maxLeft)),
      top: Math.round(Math.min(Math.max(raw.top, bounds.top + margin), maxTop)),
    };
  };

  const getFloatingCollapsePosition = (config = getConfig()): FloatingCollapsePosition | null =>
    normalizeFloatingCollapsePosition(config.floatingCollapsePosition);

  const updateFloatingCollapseBounds = (persist = false): void => {
    const config = getConfig();
    if (!isFloatingCollapseActive(config)) return;

    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-collapse-floating`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-collapse-floating`);
    if (!wrapper) return;

    if (wrapper.ownerDocument !== targetDocument || wrapper.parentElement !== targetDocument.body) {
      targetDocument.body.appendChild(wrapper);
    }

    const nextPosition = clampFloatingCollapsePosition(
      getFloatingCollapsePosition(config),
      targetWindow,
      targetDocument,
    );

    wrapper.style.setProperty('position', 'fixed', 'important');
    wrapper.style.setProperty('left', `${nextPosition.left}px`, 'important');
    wrapper.style.setProperty('top', `${nextPosition.top}px`, 'important');
    wrapper.style.setProperty('right', 'auto', 'important');
    wrapper.style.setProperty('bottom', 'auto', 'important');
    wrapper.style.setProperty('width', `${FLOATING_COLLAPSE_SIZE}px`, 'important');
    wrapper.style.setProperty('max-width', `${FLOATING_COLLAPSE_SIZE}px`, 'important');
    wrapper.style.setProperty('height', `${FLOATING_COLLAPSE_SIZE}px`, 'important');
    wrapper.style.setProperty('display', 'block', 'important');
    wrapper.style.setProperty('visibility', 'visible', 'important');
    wrapper.style.setProperty('opacity', '1', 'important');
    wrapper.style.setProperty('margin', '0', 'important');
    wrapper.style.setProperty('transform', 'none', 'important');
    wrapper.style.setProperty('overflow', 'visible', 'important');
    wrapper.style.setProperty('pointer-events', 'none', 'important');
    wrapper.style.setProperty('z-index', '1000', 'important');

    const expandTrigger = wrapper.querySelector<HTMLElement>('.acu-expand-trigger.acu-col-floating');
    if (expandTrigger) {
      expandTrigger.style.setProperty('display', 'flex', 'important');
      expandTrigger.style.setProperty('visibility', 'visible', 'important');
      expandTrigger.style.setProperty('opacity', '1', 'important');
      expandTrigger.style.setProperty('pointer-events', 'auto', 'important');
      expandTrigger.style.setProperty('width', `${FLOATING_COLLAPSE_SIZE}px`, 'important');
      expandTrigger.style.setProperty('height', `${FLOATING_COLLAPSE_SIZE}px`, 'important');
    }

    if (persist) {
      saveConfig({ floatingCollapsePosition: nextPosition });
    }
  };

  const getViewportBottomAnchorElements = (targetDocument: Document): HTMLElement[] => {
    const seen = new Set<HTMLElement>();
    const elements: HTMLElement[] = [];

    VIEWPORT_BOTTOM_ANCHOR_SELECTORS.forEach(selector => {
      targetDocument.querySelectorAll<HTMLElement>(selector).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        elements.push(el);
      });
    });

    return elements;
  };

  const getViewportAnchorRect = (): DOMRect | null => {
    const targetDocument = getTavernHostDocument();

    const chat = targetDocument.querySelector<HTMLElement>('#chat');
    if (!chat) return null;

    const rect = chat.getBoundingClientRect();
    return rect.width > 0 ? rect : null;
  };

  const getFixedWrapperParentMetrics = (
    parent: HTMLElement | null,
    targetWindow: Window,
    fallbackWidth: number,
    fallbackLeft: number,
  ): { contentWidth: number; contentLeft: number } | null => {
    const parentRect = parent?.getBoundingClientRect();
    const rectWidth = parentRect && parentRect.width > 0 ? parentRect.width : 0;
    const clientWidth = parent && parent.clientWidth > 0 ? parent.clientWidth : 0;
    const fallbackContentWidth = fallbackWidth > 0 ? fallbackWidth : 0;
    const contentWidthCandidates = [clientWidth, rectWidth, fallbackContentWidth].filter(width => width > 0);
    const contentWidth = contentWidthCandidates.length > 0 ? Math.min(...contentWidthCandidates) : 0;
    if (contentWidth <= 0) return null;

    const style = parent ? targetWindow.getComputedStyle(parent) : null;
    const borderLeft = style ? Number.parseFloat(style.borderLeftWidth) || 0 : 0;
    const contentLeft = (parentRect?.left ?? fallbackLeft) + borderLeft;

    return {
      contentWidth,
      contentLeft,
    };
  };

  const getFixedModeAnchorRect = (): DOMRect | null => {
    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    const visualViewport = targetWindow.visualViewport;
    const viewportTop = visualViewport?.offsetTop || 0;
    const viewportWidth =
      visualViewport?.width || targetWindow.innerWidth || targetDocument.documentElement.clientWidth || 0;
    const viewportHeight =
      visualViewport?.height || targetWindow.innerHeight || targetDocument.documentElement.clientHeight || 0;
    const viewportBottom = viewportTop + viewportHeight;
    const candidates = getViewportBottomAnchorElements(targetDocument)
      .map(el => {
        const style = targetWindow.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return { el, style, rect };
      })
      .filter(({ style, rect }) => {
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (rect.width <= 0 || rect.height <= 0) return false;
        if (viewportHeight > 0 && (rect.bottom < viewportTop || rect.top > viewportBottom + 80)) return false;
        return true;
      });

    if (candidates.length === 0) return getViewportAnchorRect();

    const composerWidthCandidates =
      viewportWidth > 768 ? candidates.filter(({ rect }) => rect.width < viewportWidth * 0.92) : candidates;
    const pool = composerWidthCandidates.length > 0 ? composerWidthCandidates : candidates;
    pool.sort((a, b) => {
      const aPriority = FIXED_MODE_ANCHOR_PRIORITY.get(a.el.id) ?? 99;
      const bPriority = FIXED_MODE_ANCHOR_PRIORITY.get(b.el.id) ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.rect.width - a.rect.width;
    });
    return pool[0]?.rect ?? getViewportAnchorRect();
  };

  const getViewportBottomOffset = (): number => {
    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    const visualViewport = targetWindow.visualViewport;
    const viewportTop = visualViewport?.offsetTop || 0;
    const viewportHeight =
      visualViewport?.height || targetWindow.innerHeight || targetDocument.documentElement.clientHeight || 0;
    const viewportBottom = viewportTop + viewportHeight;
    const candidates = getViewportBottomAnchorElements(targetDocument)
      .filter((el): el is HTMLElement => {
        const style = targetWindow.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        const isComposerElement = VIEWPORT_COMPOSER_ELEMENT_IDS.has(el.id) || el.tagName.toLowerCase() === 'textarea';
        const minTopRatio = isComposerElement ? 0.2 : 0.45;
        const maxHeight = isComposerElement
          ? Math.max(520, viewportHeight * 0.75)
          : Math.max(220, viewportHeight * 0.4);
        if (rect.width <= 0 || rect.height <= 0) return false;
        if (viewportHeight <= 0) return rect.bottom > 0;
        if (rect.top < viewportTop || rect.bottom > viewportBottom + 80) return false;
        if (rect.top < viewportTop + viewportHeight * minTopRatio) return false;
        if (rect.height > maxHeight) return false;
        return true;
      })
      .map(el => el.getBoundingClientRect());

    if (candidates.length === 0 || viewportHeight <= 0) return 12;

    const top = Math.min(...candidates.map(rect => rect.top));
    const offset = viewportBottom - top + 8;
    const maxOffset = Math.max(12, Math.round(viewportHeight * 0.65));
    return Math.min(maxOffset, Math.max(12, Math.round(offset)));
  };

  const updateViewportWrapperBounds = () => {
    const config = getConfig();
    if (isFloatingCollapseActive(config)) {
      updateFloatingCollapseBounds();
      return;
    }
    if (config.positionMode !== 'viewport') return;

    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-viewport`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-viewport`);
    if (!wrapper) return;

    if (wrapper.ownerDocument !== targetDocument || wrapper.parentElement !== targetDocument.body) {
      targetDocument.body.appendChild(wrapper);
    }

    wrapper.style.setProperty('position', 'fixed', 'important');
    wrapper.style.setProperty('display', 'flex', 'important');
    wrapper.style.setProperty('flex-direction', 'column-reverse', 'important');
    wrapper.style.setProperty('visibility', 'visible', 'important');
    wrapper.style.setProperty('opacity', '1', 'important');
    const isCompactCollapsed = getCollapsedState() && normalizeCollapseStyle(config.collapseStyle) === 'pill';
    wrapper.style.setProperty('pointer-events', isCompactCollapsed ? 'none' : 'auto', 'important');
    wrapper.style.setProperty('top', 'auto', 'important');
    wrapper.style.setProperty('margin', '0', 'important');
    wrapper.style.setProperty('box-sizing', 'border-box', 'important');
    wrapper.style.setProperty('z-index', '1000', 'important');

    const navContainer = wrapper.querySelector<HTMLElement>('.acu-nav-container');
    if (navContainer) {
      navContainer.style.setProperty('visibility', 'visible', 'important');
      navContainer.style.setProperty('opacity', '1', 'important');
      navContainer.style.setProperty('pointer-events', 'auto', 'important');
    }

    const expandTrigger = wrapper.querySelector<HTMLElement>('.acu-expand-trigger');
    if (expandTrigger) {
      expandTrigger.style.setProperty('display', 'flex', 'important');
      expandTrigger.style.setProperty('visibility', 'visible', 'important');
      expandTrigger.style.setProperty('opacity', '1', 'important');
      expandTrigger.style.setProperty('pointer-events', 'auto', 'important');
    }

    const visualViewport = targetWindow.visualViewport;
    const getViewportHeight = () =>
      visualViewport?.height || targetWindow.innerHeight || targetDocument.documentElement.clientHeight || 0;
    const updateViewportNavigationSafety = (navigationAnchor: HTMLElement, bottomOffset: number) => {
      const viewportTop = visualViewport?.offsetTop || 0;
      const viewportHeight = getViewportHeight();
      const navigationRect = navigationAnchor.getBoundingClientRect();
      const navigationHeight = Math.max(0, Math.ceil(navigationRect.height || navigationAnchor.offsetHeight || 0));
      if (viewportHeight > 0) {
        const panelMaxHeight = Math.max(180, Math.floor(viewportHeight - bottomOffset - navigationHeight - 24));
        wrapper.style.setProperty('--acu-viewport-panel-max-height', `${panelMaxHeight}px`);
        wrapper.style.setProperty('--acu-viewport-nav-height', `${navigationHeight}px`);
      }

      // SillyTavern 移动/平板布局可能会移动宿主滚动根，fixed 子元素要按导航盘实际位置校正。
      const rawRect = navigationAnchor.getBoundingClientRect();
      if (viewportHeight > 0 && rawRect.height > 0) {
        const desiredBottom = viewportTop + viewportHeight - bottomOffset;
        const correctionY = desiredBottom - rawRect.bottom;
        if (Number.isFinite(correctionY) && Math.abs(correctionY) > 1) {
          wrapper.style.setProperty('transform', `translate3d(0, ${Math.round(correctionY)}px, 0)`, 'important');
        }
      }
    };
    const viewportWidth =
      visualViewport?.width ||
      targetWindow.innerWidth ||
      targetDocument.documentElement.clientWidth ||
      window.innerWidth ||
      0;
    if (viewportWidth > 0 && viewportWidth <= 768) {
      const left = visualViewport?.offsetLeft || 0;
      const bottomOffset = getViewportBottomOffset();
      const navigationAnchor = navContainer || expandTrigger || wrapper;
      wrapper.style.setProperty('left', `${left}px`, 'important');
      wrapper.style.setProperty('right', 'auto', 'important');
      wrapper.style.setProperty('width', `${Math.max(280, Math.round(viewportWidth))}px`, 'important');
      wrapper.style.setProperty('max-width', `${Math.max(280, Math.round(viewportWidth))}px`, 'important');
      wrapper.style.setProperty('transform', 'none', 'important');
      wrapper.style.setProperty('bottom', `${bottomOffset}px`, 'important');
      updateViewportNavigationSafety(navigationAnchor, bottomOffset);
      return;
    }

    const rect = getViewportAnchorRect();
    if (!rect) return;
    if (rect.width <= 0) return;

    const left = Math.max(0, rect.left);
    const right = Math.min(viewportWidth, rect.right);
    const width = Math.max(280, right - left);
    const bottomOffset = getViewportBottomOffset();

    wrapper.style.setProperty('left', `${left}px`, 'important');
    wrapper.style.setProperty('right', 'auto', 'important');
    wrapper.style.setProperty('width', `${width}px`, 'important');
    wrapper.style.setProperty('max-width', `${width}px`, 'important');
    wrapper.style.setProperty('transform', 'none', 'important');
    wrapper.style.setProperty('bottom', `${bottomOffset}px`, 'important');
    updateViewportNavigationSafety(navContainer || expandTrigger || wrapper, bottomOffset);
  };

  const updateFixedWrapperBounds = () => {
    const config = getConfig();
    if (isFloatingCollapseActive(config)) {
      updateFloatingCollapseBounds();
      return;
    }
    if (config.positionMode !== 'fixed') return;

    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`);
    if (!wrapper) return;

    const chat = targetDocument.querySelector<HTMLElement>('#chat');
    if (chat && wrapper.ownerDocument === targetDocument && wrapper.parentElement !== chat) {
      chat.appendChild(wrapper);
    }
    if (chat && wrapper.parentElement === chat && chat.lastElementChild !== wrapper) {
      chat.appendChild(wrapper);
    }

    const visualViewport = targetWindow.visualViewport;
    const viewportLeft = visualViewport?.offsetLeft || 0;
    const viewportWidth =
      visualViewport?.width ||
      targetWindow.innerWidth ||
      targetDocument.documentElement.clientWidth ||
      window.innerWidth ||
      0;
    const layoutViewportWidth =
      targetWindow.innerWidth || targetDocument.documentElement.clientWidth || window.innerWidth || viewportWidth;

    const parent = wrapper.parentElement;
    const parentMetrics = getFixedWrapperParentMetrics(
      parent,
      targetWindow,
      viewportWidth || targetDocument.documentElement.clientWidth || layoutViewportWidth,
      viewportLeft,
    );
    if (!parentMetrics) return;
    const parentWidth = parentMetrics.contentWidth;
    const parentLeft = parentMetrics.contentLeft;
    if (parentWidth <= 0) return;

    const applyFixedWrapperLayout = (width: number, marginLeft: number) => {
      wrapper.style.setProperty('box-sizing', 'border-box');
      wrapper.style.setProperty('width', `${width}px`);
      wrapper.style.setProperty('max-width', `${width}px`);
      wrapper.style.setProperty('margin-left', `${marginLeft}px`);
      wrapper.style.setProperty('margin-top', 'auto');
      wrapper.style.setProperty('margin-right', '0');
      wrapper.style.removeProperty('left');
      wrapper.style.removeProperty('right');
      wrapper.style.removeProperty('bottom');
      wrapper.style.removeProperty('transform');
      wrapper.style.removeProperty('--acu-viewport-panel-max-height');
      wrapper.style.removeProperty('--acu-viewport-nav-height');
    };

    if (layoutViewportWidth > 0 && layoutViewportWidth <= TABLET_FIXED_NAV_FULL_WIDTH_MAX) {
      applyFixedWrapperLayout(Math.round(parentWidth), 0);
      return;
    }

    const anchorRect = getFixedModeAnchorRect();
    if (!anchorRect || anchorRect.width <= 0) return;

    const viewportRight = viewportWidth > 0 ? viewportLeft + viewportWidth : anchorRect.right;
    const visibleAnchorLeft = Math.max(viewportLeft, anchorRect.left);
    const visibleAnchorRight = Math.min(viewportRight, anchorRect.right);
    const rawAnchorWidth = Math.max(0, visibleAnchorRight - visibleAnchorLeft);

    const preferredWidth = Math.max(280, Math.round(rawAnchorWidth || anchorRect.width));
    const maxMarginLeft = Math.max(0, parentWidth - Math.min(preferredWidth, parentWidth));
    const marginLeft = Math.min(maxMarginLeft, Math.max(0, Math.round(visibleAnchorLeft - parentLeft)));
    const width = Math.max(0, Math.min(preferredWidth, parentWidth - marginLeft));
    if (width <= 0) return;

    applyFixedWrapperLayout(width, marginLeft);
  };

  const scheduleFixedWrapperBoundsRefresh = () => {
    const config = getConfig();
    if (config.positionMode !== 'fixed') return;
    if (fixedWrapperBoundsRaf !== null) return;

    fixedWrapperBoundsRaf = requestAnimationFrame(() => {
      fixedWrapperBoundsRaf = null;
      updateFixedWrapperBounds();
    });
  };

  const clearFixedAnchorResizeObserver = () => {
    if (fixedAnchorResizeObserver) {
      fixedAnchorResizeObserver.disconnect();
      fixedAnchorResizeObserver = null;
    }
  };

  const refreshFixedAnchorResizeObserver = (targetWindow: Window, targetDocument: Document) => {
    clearFixedAnchorResizeObserver();
    if (!fixedWrapperBoundsRefreshHandler) return;

    const ResizeObserverCtor = targetWindow.ResizeObserver || window.ResizeObserver;
    if (!ResizeObserverCtor) return;

    fixedAnchorResizeObserver = new ResizeObserverCtor(() => fixedWrapperBoundsRefreshHandler?.());
    getViewportBottomAnchorElements(targetDocument).forEach(el => fixedAnchorResizeObserver?.observe(el));

    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`);
    if (wrapper?.parentElement) {
      fixedAnchorResizeObserver.observe(wrapper.parentElement);
    }
  };

  const scheduleFixedAnchorTargetRefresh = () => {
    if (fixedAnchorTargetsRaf !== null) return;

    fixedAnchorTargetsRaf = requestAnimationFrame(() => {
      fixedAnchorTargetsRaf = null;
      const targetWindow = getTavernHostWindow();
      const targetDocument = getTavernHostDocument();
      refreshFixedAnchorResizeObserver(targetWindow, targetDocument);
      scheduleFixedWrapperBoundsRefresh();
    });
  };

  const clearFixedAnchorMutationObserver = () => {
    if (fixedAnchorMutationObserver) {
      fixedAnchorMutationObserver.disconnect();
      fixedAnchorMutationObserver = null;
    }
    fixedAnchorMutationWindow = null;
    fixedAnchorMutationDocument = null;

    if (fixedAnchorTargetsRaf !== null) {
      cancelAnimationFrame(fixedAnchorTargetsRaf);
      fixedAnchorTargetsRaf = null;
    }
  };

  const setupFixedAnchorMutationObserver = (targetWindow: Window, targetDocument: Document) => {
    if (
      fixedAnchorMutationObserver &&
      fixedAnchorMutationWindow === targetWindow &&
      fixedAnchorMutationDocument === targetDocument
    ) {
      return;
    }

    clearFixedAnchorMutationObserver();
    if (!targetDocument.body) return;

    const MutationObserverCtor = targetWindow.MutationObserver || window.MutationObserver;
    fixedAnchorMutationObserver = new MutationObserverCtor(() => scheduleFixedAnchorTargetRefresh());
    fixedAnchorMutationObserver.observe(targetDocument.body, { childList: true, subtree: true });
    fixedAnchorMutationWindow = targetWindow;
    fixedAnchorMutationDocument = targetDocument;
  };

  const clearFixedWrapperBoundsListeners = () => {
    if (fixedWrapperBoundsListenerWindow && fixedWrapperBoundsRefreshHandler) {
      fixedWrapperBoundsListenerWindow.removeEventListener('resize', fixedWrapperBoundsRefreshHandler);
      fixedWrapperBoundsListenerWindow.removeEventListener('orientationchange', fixedWrapperBoundsRefreshHandler);
      fixedWrapperBoundsListenerWindow.visualViewport?.removeEventListener('resize', fixedWrapperBoundsRefreshHandler);
      fixedWrapperBoundsListenerWindow.visualViewport?.removeEventListener('scroll', fixedWrapperBoundsRefreshHandler);
    }

    clearFixedAnchorResizeObserver();
    clearFixedAnchorMutationObserver();

    if (fixedWrapperBoundsRaf !== null) {
      cancelAnimationFrame(fixedWrapperBoundsRaf);
      fixedWrapperBoundsRaf = null;
    }

    fixedWrapperBoundsListenerWindow = null;
    fixedWrapperBoundsRefreshHandler = null;
  };

  const setupFixedWrapperBoundsListeners = () => {
    const config = getConfig();
    if (config.positionMode !== 'fixed' || isFloatingCollapseActive(config)) {
      clearFixedWrapperBoundsListeners();
      return;
    }

    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    if (fixedWrapperBoundsListenerWindow === targetWindow && fixedWrapperBoundsRefreshHandler) {
      refreshFixedAnchorResizeObserver(targetWindow, targetDocument);
      setupFixedAnchorMutationObserver(targetWindow, targetDocument);
      return;
    }

    clearFixedWrapperBoundsListeners();

    const refreshBounds = scheduleFixedWrapperBoundsRefresh;
    targetWindow.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.addEventListener('orientationchange', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('scroll', refreshBounds, { passive: true });
    fixedWrapperBoundsListenerWindow = targetWindow;
    fixedWrapperBoundsRefreshHandler = refreshBounds;
    refreshFixedAnchorResizeObserver(targetWindow, targetDocument);
    setupFixedAnchorMutationObserver(targetWindow, targetDocument);
  };

  const scheduleFloatingCollapseBoundsRefresh = () => {
    if (!isFloatingCollapseActive()) return;
    if (floatingCollapseBoundsRaf !== null) return;

    floatingCollapseBoundsRaf = requestAnimationFrame(() => {
      floatingCollapseBoundsRaf = null;
      updateFloatingCollapseBounds();
    });
  };

  const clearFloatingCollapseBoundsListeners = () => {
    if (floatingCollapseBoundsListenerWindow && floatingCollapseBoundsRefreshHandler) {
      floatingCollapseBoundsListenerWindow.removeEventListener('resize', floatingCollapseBoundsRefreshHandler);
      floatingCollapseBoundsListenerWindow.removeEventListener(
        'orientationchange',
        floatingCollapseBoundsRefreshHandler,
      );
      floatingCollapseBoundsListenerWindow.visualViewport?.removeEventListener(
        'resize',
        floatingCollapseBoundsRefreshHandler,
      );
      floatingCollapseBoundsListenerWindow.visualViewport?.removeEventListener(
        'scroll',
        floatingCollapseBoundsRefreshHandler,
      );
    }

    if (floatingCollapseBoundsRaf !== null) {
      cancelAnimationFrame(floatingCollapseBoundsRaf);
      floatingCollapseBoundsRaf = null;
    }

    floatingCollapseBoundsListenerWindow = null;
    floatingCollapseBoundsRefreshHandler = null;
  };

  const setupFloatingCollapseBoundsListeners = () => {
    if (!isFloatingCollapseActive()) {
      clearFloatingCollapseBoundsListeners();
      return;
    }

    const targetWindow = getTavernHostWindow();
    if (floatingCollapseBoundsListenerWindow === targetWindow && floatingCollapseBoundsRefreshHandler) return;

    clearFloatingCollapseBoundsListeners();

    const refreshBounds = scheduleFloatingCollapseBoundsRefresh;
    targetWindow.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.addEventListener('orientationchange', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('scroll', refreshBounds, { passive: true });
    floatingCollapseBoundsListenerWindow = targetWindow;
    floatingCollapseBoundsRefreshHandler = refreshBounds;
  };

  const scheduleViewportBoundsRefresh = () => {
    const config = getConfig();
    if (config.positionMode !== 'viewport') return;
    if (viewportBoundsRaf !== null) return;

    viewportBoundsRaf = requestAnimationFrame(() => {
      viewportBoundsRaf = null;
      updateViewportWrapperBounds();
    });
  };

  const clearViewportInputTargetListeners = () => {
    if (viewportInputResizeObserver) {
      viewportInputResizeObserver.disconnect();
      viewportInputResizeObserver = null;
    }

    if (viewportBoundsRefreshHandler) {
      const eventHandler = viewportBoundsRefreshHandler as EventListener;
      viewportInputObservedElements.forEach(el => {
        VIEWPORT_BOTTOM_REFRESH_EVENTS.forEach(eventName => {
          el.removeEventListener(eventName, eventHandler, true);
        });
      });
    }

    viewportInputObservedElements = [];
  };

  const refreshViewportInputTargetListeners = (targetWindow: Window, targetDocument: Document) => {
    clearViewportInputTargetListeners();

    if (!viewportBoundsRefreshHandler) return;

    const elements = getViewportBottomAnchorElements(targetDocument);
    const eventHandler = viewportBoundsRefreshHandler as EventListener;
    viewportInputObservedElements = elements;

    elements.forEach(el => {
      VIEWPORT_BOTTOM_REFRESH_EVENTS.forEach(eventName => {
        el.addEventListener(eventName, eventHandler, { capture: true, passive: true });
      });
    });

    const ResizeObserverCtor = targetWindow.ResizeObserver || window.ResizeObserver;
    if (ResizeObserverCtor) {
      viewportInputResizeObserver = new ResizeObserverCtor(() => viewportBoundsRefreshHandler?.());
      elements.forEach(el => viewportInputResizeObserver?.observe(el));
    }
  };

  const scheduleViewportInputTargetRefresh = () => {
    if (viewportInputTargetsRaf !== null) return;

    viewportInputTargetsRaf = requestAnimationFrame(() => {
      viewportInputTargetsRaf = null;
      const targetWindow = getTavernHostWindow();
      const targetDocument = getTavernHostDocument();
      refreshViewportInputTargetListeners(targetWindow, targetDocument);
      scheduleViewportBoundsRefresh();
    });
  };

  const clearViewportInputMutationObserver = () => {
    if (viewportInputMutationObserver) {
      viewportInputMutationObserver.disconnect();
      viewportInputMutationObserver = null;
    }
    viewportInputMutationWindow = null;
    viewportInputMutationDocument = null;

    if (viewportInputTargetsRaf !== null) {
      cancelAnimationFrame(viewportInputTargetsRaf);
      viewportInputTargetsRaf = null;
    }
  };

  const setupViewportInputMutationObserver = (targetWindow: Window, targetDocument: Document) => {
    if (
      viewportInputMutationObserver &&
      viewportInputMutationWindow === targetWindow &&
      viewportInputMutationDocument === targetDocument
    ) {
      return;
    }

    clearViewportInputMutationObserver();
    if (!targetDocument.body) return;

    const MutationObserverCtor = targetWindow.MutationObserver || window.MutationObserver;
    viewportInputMutationObserver = new MutationObserverCtor(() => scheduleViewportInputTargetRefresh());
    viewportInputMutationObserver.observe(targetDocument.body, { childList: true, subtree: true });
    viewportInputMutationWindow = targetWindow;
    viewportInputMutationDocument = targetDocument;
  };

  const clearViewportBoundsListeners = () => {
    if (viewportBoundsListenerWindow && viewportBoundsRefreshHandler) {
      viewportBoundsListenerWindow.removeEventListener('resize', viewportBoundsRefreshHandler);
      viewportBoundsListenerWindow.removeEventListener('orientationchange', viewportBoundsRefreshHandler);
      viewportBoundsListenerWindow.visualViewport?.removeEventListener('resize', viewportBoundsRefreshHandler);
      viewportBoundsListenerWindow.visualViewport?.removeEventListener('scroll', viewportBoundsRefreshHandler);
    }

    clearViewportInputTargetListeners();
    clearViewportInputMutationObserver();

    if (viewportBoundsRaf !== null) {
      cancelAnimationFrame(viewportBoundsRaf);
      viewportBoundsRaf = null;
    }

    viewportBoundsListenerWindow = null;
    viewportBoundsRefreshHandler = null;
    viewportBoundsListenerAttached = false;
  };

  const setupViewportBoundsListeners = () => {
    const config = getConfig();
    if (config.positionMode !== 'viewport' || isFloatingCollapseActive(config)) {
      clearViewportBoundsListeners();
      return;
    }

    const targetWindow = getTavernHostWindow();
    const targetDocument = getTavernHostDocument();
    if (viewportBoundsListenerAttached && viewportBoundsListenerWindow === targetWindow) {
      refreshViewportInputTargetListeners(targetWindow, targetDocument);
      setupViewportInputMutationObserver(targetWindow, targetDocument);
      return;
    }

    clearViewportBoundsListeners();

    const refreshBounds = scheduleViewportBoundsRefresh;
    targetWindow.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.addEventListener('orientationchange', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('resize', refreshBounds, { passive: true });
    targetWindow.visualViewport?.addEventListener('scroll', refreshBounds, { passive: true });
    viewportBoundsListenerWindow = targetWindow;
    viewportBoundsRefreshHandler = refreshBounds;
    viewportBoundsListenerAttached = true;
    refreshViewportInputTargetListeners(targetWindow, targetDocument);
    setupViewportInputMutationObserver(targetWindow, targetDocument);
  };

  const renderInterface = () => {
    // 设置面板打开时跳过重绘，防止事件丢失
    if (getIsSettingsOpen()) {
      if (!renderInterfacePending) {
        console.info('[DICE]设置面板打开中，跳过界面渲染');
        renderInterfacePending = true;
      }
      return;
    }

    // [修复] 在防抖前立即保存滚动状态，确保锁定操作等场景下滚动位置不丢失
    saveCurrentTabState();

    // 防抖：如果已有待执行的渲染，取消它
    if (renderInterfaceTimer) {
      clearTimeout(renderInterfaceTimer);
    }

    // 设置新的防抖定时器（50ms延迟，足够短以保持响应性，足够长以合并多次调用）
    renderInterfaceTimer = setTimeout(() => {
      renderInterfaceTimer = null;
      renderInterfacePending = false;
      _renderInterfaceImpl();
    }, 50);
  };

  // 实际的渲染实现函数
  const _renderInterfaceImpl = () => {
    console.info('[DICE]开始渲染界面...');
    const { $ } = getCore();

    // [修复] Observer 延迟创建保险 (带节流优化)
    if (!getObserver() && $('#chat').length) {
      const $chat = $('#chat');
      let mutationLock = false;
      const handleMutation = () => {
        if (mutationLock) return;
        mutationLock = true;
        requestAnimationFrame(() => {
          const config = getConfig();
          if (
            config.positionMode === 'embedded' ||
            config.positionMode === 'viewport' ||
            isFloatingCollapseActive(config)
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
          const diceCfg = getDiceConfig();
          if (diceCfg && diceCfg.hideDiceResultInChat) {
            // 步骤1：立即对新消息应用遮罩样式，避免闪烁
            const children = $chat.children();
            const lastChild = children.last();
            if (lastChild.hasClass('mes') || lastChild.hasClass('message-body')) {
              lastChild.addClass('acu-dice-result-revealing');
            }

            // 步骤2：使用RAF在下一帧快速执行隐藏逻辑
            requestAnimationFrame(() => {
              hideDiceResultsInUserMessages();

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
      setObserver(new MutationObserver(handleMutation));
      getObserver().observe($chat[0], { childList: true });
    }
    let rawData;
    let isDataFromDatabase = false; // 标记数据是否来自数据库（需要检查自动替换）
    if (getHasUnsavedChanges() && getCachedRawData()) {
      rawData = getCachedRawData();
    } else {
      rawData = getTableData();
      isDataFromDatabase = true; // 数据来自数据库，需要检查自动替换

      // [自动替换] 应用auto模式的表格正则规则
      // 注意：只在非自动转换过程中执行，防止循环触发
      // 只在从数据库获取新数据时执行自动替换
      if (rawData && !getIsAutoTransforming() && isDataFromDatabase) {
        try {
          const enabledRules = RegexTransformationManager.getEnabledRules();

          if (enabledRules.length > 0) {
            const transformKey = createAutoRegexTransformKey(rawData, enabledRules);
            if (shouldSkipAutoRegexTransform(transformKey)) {
              console.debug('[DICE]自动转换跳过：相同数据和规则仍在冷却时间内');
            } else {
              console.info(`[DICE]检测到数据更新，应用 ${enabledRules.length} 条规则...`);

              setIsAutoTransforming(true); // 设置标志，防止循环触发
              const transformResult = RegexTransformationEngine.applyToTable(rawData, enabledRules);
              rememberAutoRegexTransform(createAutoRegexTransformKey(rawData, enabledRules) || transformKey);
              if (transformResult.totalApplied > 0) {
                console.info(`[DICE]自动替换完成，共影响 ${transformResult.totalApplied} 处数据`);

                saveSheetsViaJsonFloorWithoutTracking(rawData, transformResult.modifiedSheetKeys)
                  .catch(err => {
                    console.warn('[DICE]自动转换后保存数据失败:', err);
                  })
                  .finally(() => {
                    setIsAutoTransforming(false);
                  });
              }
              if (transformResult.errors.length > 0) {
                console.warn(`[DICE]自动转换遇到 ${transformResult.errors.length} 个错误:`, transformResult.errors);
              } else if (transformResult.totalApplied === 0) {
                console.info('[DICE]自动转换执行完成，但没有匹配到需要转换的数据');
              }
              if (transformResult.totalApplied === 0) {
                setIsAutoTransforming(false);
              }
            }
          } else {
            setIsAutoTransforming(false); // 清除标志
          }
        } catch (transformError) {
          setIsAutoTransforming(false); // 确保异常时也清除标志
          const errorMsg = transformError instanceof Error ? transformError.message : String(transformError);
          console.error('[DICE]自动转换失败:', transformError);
        }
      }

      if (rawData) {
        setCachedRawData(
          typeof structuredClone === 'function' ? structuredClone(rawData) : JSON.parse(JSON.stringify(rawData)));

        const existingSnapshot = loadSnapshot();
        const currentCtx = getCurrentContextFingerprint();

        // 检查快照是否有效（存在且包含实际表数据）
        const hasValidSnapshotData =
          existingSnapshot && Object.keys(existingSnapshot).some(k => k.startsWith('sheet_'));

        if (!existingSnapshot || !hasValidSnapshotData) {
          // 情况1：没有快照 或 快照数据为空 → 保存新快照
          saveSnapshot({ ...getCachedRawData(), _contextId: currentCtx });
        } else if (!existingSnapshot._contextId) {
          // 情况2：旧版快照（无 ID）→ 打上当前上下文标记，但不覆盖数据
          saveSnapshot({ ...existingSnapshot, _contextId: currentCtx });
        } else if (existingSnapshot._contextId !== currentCtx) {
          // 情况3：确认切换了聊天 → 覆盖为新数据
          getCachedRawData()._contextId = currentCtx;
          saveSnapshot(getCachedRawData());
        }
        // 情况4：同一聊天且快照有效 → 不动，保持高亮正常
      }
    }

    const $searchInput = $('.acu-search-input');
    if ($(DICE_ROOT_SELECTOR).length && $searchInput.is(':focus')) {
      if (rawData) {
        if (!getIsSaving()) setCurrentDiffMap(generateDiffMap(rawData));
        const tables = processJsonData(rawData);
        const activeTab = getActiveTabState();
        const currentTabName = activeTab && tables[activeTab] ? activeTab : null;

        if (currentTabName && tables[currentTabName]) {
          const newHtml = renderTableContent(tables[currentTabName], currentTabName);
          const $virtualDom = $('<div>').html(newHtml);
          $('.acu-card-grid').replaceWith($virtualDom.find('.acu-card-grid'));
          $('.acu-panel-title').html($virtualDom.find('.acu-panel-title').html());
          // [修复] 修正函数名错误，复用主事件绑定
          bindEvents(tables);
          bindOptionEvents(); // <--- 加上这一句，以此确保万无一失
          syncHostRegenerateButtonVisibility($(DICE_ROOT_SELECTOR).last());
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

    const tables = processJsonData(rawData || {});

    if (getIsSaving()) {
      setCurrentDiffMap(new Set());
    } else {
      setCurrentDiffMap(generateDiffMap(rawData));
    }

    const savedOrder = getSavedTableOrder();
    let orderedNames = Object.keys(tables);
    if (savedOrder)
      orderedNames = savedOrder.filter(n => tables[n]).concat(orderedNames.filter(n => !savedOrder.includes(n)));

    const hiddenList = getHiddenTables();
    orderedNames = orderedNames.filter(n => !hiddenList.includes(n));

    const activeTab = getActiveTabState();
    let currentTabName = activeTab && tables[activeTab] && !hiddenList.includes(activeTab) ? activeTab : null;

    const config = getConfig();
    const isCollapsed = getCollapsedState();
    const isDashboardActive = !isCollapsed && Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false);
    const isChangesPanelActive = !isCollapsed && Store.get('acu_changes_panel_active', false);
    const isGlobalInteractionsActive = !isCollapsed && Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    const isMvuActive = !isCollapsed && getActiveTabState() === MvuModule.MODULE_ID;
    const shouldShowPanel =
      !isCollapsed &&
      Boolean(isDashboardActive || isChangesPanelActive || isGlobalInteractionsActive || isMvuActive || currentTabName);

    const layoutClass = config.layout === 'vertical' ? 'acu-layout-vertical' : '';
    const horizontalScrollbarClass = config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : '';
    const desktopNavClass = config.desktopNavAligned === true ? 'acu-desktop-nav-aligned' : '';
    const visiblePanelClass = shouldShowPanel ? 'acu-has-visible-panel' : '';
    // [补回这行] 定义导航盘位置样式 (悬浮/嵌入)
    const positionClass = `acu-mode-${config.positionMode || 'fixed'}`;
    const collapseStyle = normalizeCollapseStyle(config.collapseStyle);
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
        if (isCheckSuggestionTableName(tableName)) {
          checkSuggestionTables.push(table);
        } else if (isOptionTableName(tableName)) {
          optionTables.push(table);
        }
      });

      // [修改开始] 添加收起面板的开关 - 叙事书页风重设计
      if (checkSuggestionTables.length > 0 || optionTables.length > 0) {
        const isOptionsCollapsed = getOptionsCollapsedState();
        const collapsedClass = isOptionsCollapsed ? 'collapsed' : '';

        // [修改结束]
        const checkSuggestionItems = checkSuggestionTables.flatMap(table => getCheckSuggestionItemsFromTable(table));
        const optionItems = optionTables.flatMap(table => getOptionItemsFromTable(table));
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
          buttonsHtml += renderCheckSuggestionOptionButtonHtml(item.displayText, item.commandText);
          optionValues.push(`check:${item.displayText}=>${item.commandText}`);
        });

        optionItems.forEach(item => {
          buttonsHtml += renderOptionButtonHtml(item.text);
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
    const optionChanged = currentOptionHash !== getLastOptionHash();
    // [修复] 只要有选项数据，就应该显示面板（而不是仅在内容变化时）
    // 这修复了用户发送消息后 optionPanelVisible 被设为 false 且选项内容未变时无法恢复的问题
    if (currentOptionHash !== null) {
      setOptionPanelVisible(true);
    }
    setLastOptionHash(currentOptionHash); // 更新缓存

    // [修复] 悬浮收起模式需要特殊类，防止 wrapper 坍塌导致按钮消失
    const navMetrics = getNavigationFontMetrics(config.navFontSize);
    const floatingCollapsePosition = isFloatingCollapsed
      ? clampFloatingCollapsePosition(getFloatingCollapsePosition(config))
      : null;
    const floatingCollapseStyle = floatingCollapsePosition
      ? `; position:fixed; left:${floatingCollapsePosition.left}px; top:${floatingCollapsePosition.top}px; right:auto; bottom:auto; width:${FLOATING_COLLAPSE_SIZE}px; height:${FLOATING_COLLAPSE_SIZE}px; max-width:${FLOATING_COLLAPSE_SIZE}px; display:block; visibility:visible; opacity:1; margin:0; transform:none; overflow:visible; pointer-events:none; z-index:1000`
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
      const activePanelHeightKey = getActivePanelHeightKey();
      const finalSavedHeight = getStoredPanelHeight(activePanelHeightKey);

      html += `
                <div class="acu-data-display ${shouldShowPanel ? 'visible' : ''} ${finalSavedHeight ? 'acu-manual-mode' : ''}" id="acu-data-area" style="${finalSavedHeight ? 'height:' + finalSavedHeight + 'px;' : ''}">
                    ${
                      isGlobalInteractionsActive
                        ? renderGlobalInteractionsPanel(rawData)
                        : isChangesPanelActive
                          ? renderChangesPanel(rawData)
                          : isDashboardActive
                            ? renderDashboard(tables)
                            : isMvuActive
                              ? '<div class="acu-mvu-panel">' + MvuModule.renderPanel() + '</div>'
                              : currentTabName
                                ? renderTableContent(tables[currentTabName], currentTabName)
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
      const isSimpleModeNav = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
      let changesCount = 0;
      let validationErrorCount = 0;
      if (rawData) {
        const snapshot = loadSnapshot();
        changesCount = countRuntimeDataChanges(snapshot, rawData);
        // 计算验证错误数量
        validationErrorCount = ValidationEngine.getErrorCount(rawData);
      }
      // 数据验证模式只显示验证错误数量，完整审核模式只显示变更数量
      const isValidationMode = isSimpleModeNav;
      const displayCount = isValidationMode ? validationErrorCount : changesCount;
      // 警告图标只在数据验证模式下且有错误时显示
      const showWarningIcon = isValidationMode && validationErrorCount > 0;

      // === 构建导航按钮（支持排序和隐藏） ===
      const navHiddenList = getHiddenTables();
      const navSavedOrder = getSavedTableOrder() || [];

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
          isActive: getActiveTabState() === MvuModule.MODULE_ID,
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
          isActive: Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false),
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
          icon: getIconForTableName(name),
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
          html += `<button type="button" class="acu-nav-btn ${extraClass} ${activeClass}" id="${item.id}" data-nav-key="${escapeHtml(item.key)}" style="order: ${orderVal};" title="${escapeHtml(item.label)}" aria-label="${escapeHtml(item.label)}" aria-pressed="${item.isActive ? 'true' : 'false'}">
                        <i class="fa-solid ${item.icon}"></i><span>${escapeHtml(item.label)}</span>${warningIconHtml}
                    </button>`;
        } else {
          // 表格标签
          html += `<button type="button" class="acu-nav-btn acu-nav-table-btn ${activeClass}" data-table="${escapeHtml(item.key)}" style="order: ${orderVal};" title="${escapeHtml(item.label)}" aria-label="打开${escapeHtml(item.label)}" aria-pressed="${item.isActive ? 'true' : 'false'}">
                        <i class="fa-solid ${item.icon}"></i><span>${escapeHtml(item.label)}</span>
                    </button>`;
        }
      });

      html += `</div>`;

      // 渲染固定功能按钮（order 设为最大值，确保在最后）
      html += `<div class="acu-actions-group" id="acu-active-actions" style="order: 9999;">`;
      ACTION_BUTTONS.forEach(btn => {
        html += `<button type="button" class="acu-action-btn" id="${btn.id}" title="${btn.title}" aria-label="${btn.title}"><i class="fa-solid ${btn.icon}"></i></button>`;
      });
      html += `</div>`;

      html += `</div>`; // 关闭 acu-nav-container
    }

    // 嵌入模式使用 column-reverse，选项要写在导航之后，视觉上才会先出现选项再出现导航盘。
    if (config.positionMode === 'embedded' && optionHtml && getOptionPanelVisible() && !isFloatingCollapsed) {
      html += optionHtml;
    }

    html += `</div>`; // 关闭 acu-wrapper

    if (isFloatingCollapsed) {
      const hostDocument = getTavernHostDocument();
      const wrapperNodes = collectHostAndLocalNodes<HTMLElement>(DICE_ROOT_SELECTOR);

      let replaced = false;
      for (const node of wrapperNodes) {
        if (!replaced && node.classList.contains('acu-collapse-floating') && node.parentElement === hostDocument.body) {
          const replacement = createElementFromHtml(hostDocument, html);
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
        const wrapper = createElementFromHtml(hostDocument, html);
        if (wrapper) {
          hostDocument.body.appendChild(wrapper);
        } else {
          $(hostDocument.body).append(html);
        }
      }
    } else if (config.positionMode === 'viewport') {
      const hostDocument = getTavernHostDocument();
      const wrapperNodes = collectHostAndLocalNodes<HTMLElement>(DICE_ROOT_SELECTOR);

      let replaced = false;
      for (const node of wrapperNodes) {
        if (!replaced && node.classList.contains('acu-mode-viewport') && node.parentElement === hostDocument.body) {
          const replacement = createElementFromHtml(hostDocument, html);
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
      if (!replaced) insertHtmlToPage(html);
    } else {
      if (config.positionMode === 'embedded') {
        insertHtmlToPage(html);
      } else {
        const $existing = $(DICE_ROOT_SELECTOR);
        if ($existing.length) {
          $existing.replaceWith(html);
        } else {
          insertHtmlToPage(html);
        }
      }
    }
    syncHostRegenerateButtonVisibility($(DICE_ROOT_SELECTOR).last());
    applyStoredPanelHeight(getDataAreaForRoot(), getActivePanelHeightKey());
    requestAnimationFrame(() => {
      applyStoredPanelHeight(getDataAreaForRoot(), getActivePanelHeightKey());
    });
    setupViewportBoundsListeners();
    setupFixedWrapperBoundsListeners();
    setupFloatingCollapseBoundsListeners();
    updateViewportWrapperBounds();
    updateFixedWrapperBounds();
    updateFloatingCollapseBounds();
    requestAnimationFrame(updateViewportWrapperBounds);
    requestAnimationFrame(updateFixedWrapperBounds);
    requestAnimationFrame(() => updateFloatingCollapseBounds());
    requestAnimationFrame(() => {
      ensurePanelNavigationVisible($(DICE_ROOT_SELECTOR).last());
      syncHostRegenerateButtonVisibility($(DICE_ROOT_SELECTOR).last());
    });

    // --- [修改] 悬浮模式下，只有选项变化且可见时才插入 ---
    if (config.positionMode !== 'embedded' && optionHtml && getOptionPanelVisible()) {
      if (optionChanged) {
        // 选项有变化，重新插入到最新 AI 消息
        injectIndependentOptions(optionHtml);
      } else {
        // 选项没变化，检查容器是否还存在且在正确位置
        const $existing = $('.acu-embedded-options-container');
        if ($existing.length === 0) {
          // 容器不存在了（可能被删掉了），重新插入
          injectIndependentOptions(optionHtml);
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
            injectIndependentOptions(optionHtml);
          } else {
            // [修复] 如果容器存在但不可见（被fadeOut隐藏），强制重新插入
            const containerVisible = $existing.is(':visible');
            const containerDisplay = $existing.css('display');
            const containerHtmlLength = $existing.html()?.length || 0;
            if (!containerVisible || containerDisplay === 'none' || containerHtmlLength === 0) {
              injectIndependentOptions(optionHtml);
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

    bindEvents(tables);
    bindOptionEvents();
    updateSaveButtonState();
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) {
      hydrateCustomTableNameIconsIn($('#acu-data-area'));
    }
    // [修复] 仪表盘NPC头像异步加载
    loadDashboardNpcAvatars();
    // [修复] 如果审核面板激活，绑定其事件
    if (Store.get('acu_changes_panel_active', false)) {
      bindChangesEvents();
    }
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) {
      hydrateCustomTableNameIconsIn($('#acu-data-area'));
      bindGlobalInteractionEvents($('#acu-data-area'));
    }
    // [修复] 如果变量面板激活，绑定其事件并尝试获取数据
    if (canWriteMvuPanel()) {
      const $panel = $('#acu-data-area');
      if ($panel.length) {
        // 总是尝试获取数据（带重试，增加重试次数）
        // 简化逻辑：直接显示面板，不等待数据加载
        // 用户可以通过刷新按钮来获取数据
        $panel.html('<div class="acu-mvu-panel">' + MvuModule.renderPanel() + '</div>');
        MvuModule.bindEvents($panel);

        // 可选：在后台尝试获取数据（不阻塞界面显示）
        MvuModule.getDataWithRetry(5, 800)
          .then(mvuData => {
            // 如果获取到数据，刷新面板显示
            if (mvuData && canWriteMvuPanel()) {
              $panel.html('<div class="acu-mvu-panel">' + MvuModule.renderPanel() + '</div>');
              MvuModule.bindEvents($panel);
            }
          })
          .catch(err => {
            console.error('[DICE]MvuModule Error getting data:', err);
            if (canWriteMvuPanel()) {
              // 错误时也刷新面板，显示错误状态
              $panel.html('<div class="acu-mvu-panel">' + MvuModule.renderPanel() + '</div>');
              MvuModule.bindEvents($panel);
            }
          });
      }
    }

    setTimeout(() => {
      const $newContent = $('.acu-panel-content');
      const activeTab = getActiveTabState();
      const savedState = getTableScrollStates()[activeTab];

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

  // [新增] 独立插入选项到最新气泡
  const injectIndependentOptions = htmlContent => {
    const { $ } = getCore();
    $('.acu-embedded-options-container').remove();

    // 复用寻找最新 AI 消息的逻辑
    const getTargetContainer = () => {
      const $allMes = $('#chat .mes');
      const $aiMes = $allMes.filter(function () {
        const $this = $(this);
        if ($this.attr('is_user') === 'true' || $this.attr('is_system') === 'true' || $this.hasClass('sys_mes'))
          return false;
        // 增加 data-is-system 属性判断，兼容性更好
        if ($this.find('.name_text').text().trim() === 'System' || $this.attr('data-is-system') === 'true')
          return false;
        // [修复] 忽略没有文本内容的空消息壳子
        if ($this.find('.mes_text').length === 0) return false;
        if ($this.css('display') === 'none') return false;
        return true;
      });
      if ($aiMes.length === 0) return null;

      const $targetMes = $aiMes.last();
      const $targetText = $targetMes.find('.mes_text');
      const $targetBlock = $targetMes.find('.mes_block');
      if ($targetText.length) return $targetText;
      if ($targetBlock.length) return $targetBlock;
      return $targetMes;
    };

    const $target = getTargetContainer();
    if ($target && $target.length) {
      const optConfig = getConfig();
      const $container = $(
        `<div class="acu-embedded-options-container acu-theme-${optConfig.theme}" style="--acu-opt-font-size:${optConfig.optionFontSize || 12}px;"></div>`,
      );
      $container.html(htmlContent);
      // [修复] 插入到 mes_text 的后面（作为兄弟元素），而不是内部
      // 这样 SillyTavern 重写 mes_text 内容时不会销毁我们的容器
      $target.after($container);
    }
  };

  // [修复版] 绑定选项点击事件 (优化：事件委托 + 增强发送逻辑)
  const bindOptionEvents = () => {
    const { $ } = getCore();
    $('body')
      .off('click.acu_check_suggestion')
      .on('click.acu_check_suggestion', '.acu-check-suggestion-btn', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const config = getConfig();
        const displayText = safeDecodeURIComponent($(this).attr('data-display') || '');
        const commandText = safeDecodeURIComponent($(this).attr('data-command') || '');
        const executed = executeCheckSuggestionCommand(displayText, commandText);
        if (!executed) return;

        if (config.clickOptionToAutoSend === false) {
          $('#send_textarea').focus();
          return;
        }

        const messageText = getResolvedComposerText();
        const sendMode = await sendChatTextAndTrigger(messageText);
        if (sendMode && sendMode !== 'composer') {
          clearComposerIfCurrentText(messageText);
        } else if (!sendMode) {
          $('#send_textarea').focus();
        }
      });

    // 移除旧的直接绑定，改用 Body 委托，提升性能并防止动态元素事件丢失
    $('body')
      .off('click.acu_opt')
      .on('click.acu_opt', '.acu-opt-btn', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const config = getConfig();
        const val = safeDecodeURIComponent($(this).data('val'));

        // 情况1: 没勾选自动发送 -> 填入输入框
        if (!config.clickOptionToAutoSend) {
          smartInsertToTextarea(val, 'action');
          $('#send_textarea').focus();
          return;
        }

        // 情况2: 自动发送。统一兼容全局函数、TavernHelper 包装对象、ST Slash API 和按钮兜底。
        const sendMode = await sendChatTextAndTrigger(val);
        if (!sendMode) {
          smartInsertToTextarea(val, 'action');
          $('#send_textarea').focus();
        }
      });
  };

  const insertHtmlToPage = html => {
    const { $ } = getCore();
    const config = getConfig();

    // --- 模式分支处理 ---

    // 1. 固定底部模式：挂到 body，避免被 #chat 的滚动上下文带走
    if (config.positionMode === 'viewport') {
      const targetDocument = getTavernHostDocument();
      const wrapper = createElementFromHtml(targetDocument, html);
      if (wrapper) {
        targetDocument.body.appendChild(wrapper);
      } else {
        $(targetDocument.body).append(html);
      }
      return;
    }

    // 2. 嵌入模式 (Embedded)：保持您原版 v19 的复杂逻辑，跟随气泡
    if (config.positionMode === 'embedded') {
      $(DICE_ROOT_SELECTOR).remove(); // 嵌入模式下，为了准确性，先移除旧的

      const getTargetContainer = () => {
        const $allMes = $('#chat .mes');
        const $aiMes = $allMes.filter(function () {
          const $this = $(this);
          if ($this.attr('is_user') === 'true') return false;
          if ($this.attr('is_system') === 'true') return false;
          if ($this.hasClass('sys_mes')) return false;
          const name = $this.find('.name_text').text().trim();
          if (name === 'System') return false;
          if ($this.css('display') === 'none') return false;
          const $textDiv = $this.find('.mes_text');
          if ($textDiv.length === 0) return false;
          const textContent = $textDiv.text().trim();
          const hasImage = $textDiv.find('img').length > 0;
          if (textContent.length === 0 && !hasImage) return false;
          return true;
        });
        // 如果找不到 AI 消息，回退到 chat
        if ($aiMes.length === 0) return $('#chat');

        // 锁定逻辑

        let targetIndex = $aiMes.length - 1;
        const $targetMes = $aiMes.eq(targetIndex);
        const $targetBlock = $targetMes.find('.mes_block');
        return $targetBlock.length ? $targetBlock : $targetMes;
      };

      const $target = getTargetContainer();
      if ($target.length) {
        if ($target.hasClass('mes_block') || $target.hasClass('mes')) {
          if ($target.find(DICE_ROOT_SELECTOR).length === 0) {
            $target.append(html);
          } else {
            $target.find(DICE_ROOT_SELECTOR).replaceWith(html);
          }
        } else {
          // Fallback
          if ($('#chat').find(DICE_ROOT_SELECTOR).length === 0) {
            $target.append(html);
          }
        }
      } else {
        $('body').append(html);
      }
      return;
    }

    // 3. 悬浮底部模式 (Fixed)：【核心修改】完全照搬脚本 B 的稳健逻辑
    // 不再每次都移除，而是“有则替换，无则追加”，防止闪烁
    const $chat = $('#chat');
    const $oldWrapper = $(DICE_ROOT_SELECTOR);

    if ($oldWrapper.length) {
      $oldWrapper.replaceWith(html);
    } else {
      if ($chat.length) {
        $chat.append(html);
      } else {
        $('body').append(html);
      }
    }
  };
  // [新增] 渲染变更审核面板
  const renderChangesPanel = rawData => {
    const snapshot = loadSnapshot();
    const config = getConfig();

    // 运行数据验证
    const validationErrors = rawData ? ValidationEngine.validateAllData(rawData) : [];

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
                        ${getTutorialButtonHtml('changes', '查看审核面板教程')}
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
      const snapshotEntry = findDiffSnapshotEntry(snapshot, sheetId, newSheet);
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
      const rowMatcher = createDiffRowMatcher(oldHeaders, oldRows.map(normalizeDiffRow));

      newRows.forEach((row, rowIdx) => {
        const safeRow = normalizeDiffRow(row);
        const matched = takeDiffRowMatch(rowMatcher, headers, safeRow, rowIdx);
        const oldRow = matched?.row;
        const rowTitle = getDiffRowDisplayTitle(headers, safeRow, rowIdx);

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
        const safeOldRow = normalizeDiffRow(oldRow);
        changes.push({
          type: 'row_deleted',
          tableName,
          tableKey: sheetId,
          rowIndex: rIdx,
          headers,
          row: safeOldRow,
          title: getDiffRowDisplayTitle(oldHeaders, safeOldRow, rIdx),
        });
      });
    }

    // 检测整个表被删除
    const snapshotRecord = asDiffRecord(snapshot);
    if (snapshotRecord) {
      for (const sheetId in snapshotRecord) {
        if (!sheetId.startsWith('sheet_')) continue;
        if (matchedSnapshotKeys.has(sheetId) || rawData[sheetId]) continue;
        const oldSheet = snapshotRecord[sheetId];
        changes.push({
          type: 'table_deleted',
          tableName: getDiffSheetIdentity(oldSheet).name || sheetId,
          tableKey: sheetId,
        });
      }
    }

    // 获取数据验证模式状态
    const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
    const hasStructuralChanges = changes.some(
      change =>
        change.type === 'table_deleted' || change.type === 'table_added' || change.type === 'table_structure_changed',
    );

    // 根据模式渲染不同的标题和按钮
    const panelTitle = isValidationMode ? '数据验证' : '完整审核';
    const panelDeprecatedBadgeHtml = isValidationMode
      ? renderDeprecatedBadge(DATA_VALIDATION_DEPRECATED_META.deprecatedReason)
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
                    ${getTutorialButtonHtml('changes', '查看审核面板教程')}
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
        const groupedErrors = ValidationEngine.groupErrorsByTable(validationErrors);
        const collapsedGroups = Store.get('acu_validation_collapsed_groups', []);

        html += `<div class="acu-changes-list">`;

        for (const tableName in groupedErrors) {
          const tableErrors = groupedErrors[tableName];
          const isCollapsed = collapsedGroups.includes(tableName);

          html += `<div class="acu-changes-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="acu-changes-group-header acu-validation-group-header" data-table="${escapeHtml(tableName)}" style="cursor:pointer;">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                        <i class="fa-solid ${getIconForTableName(tableName)}"></i> ${escapeHtml(tableName)}
                        <span class="acu-changes-count" style="background:var(--acu-error-text);">${tableErrors.length}</span>
                    </div>
                    <div class="acu-changes-group-body" style="${isCollapsed ? 'display:none;' : ''}">`;

          tableErrors.forEach(error => {
            const ruleData = error.rule
              ? escapeHtml(
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
                         data-table="${escapeHtml(error.tableName)}"
                         data-row="${error.rowIndex}"
                         data-column="${escapeHtml(error.columnName || '')}"
                         data-rule-id="${escapeHtml(error.ruleId || '')}"
                         data-rule-type="${escapeHtml(error.ruleType || '')}"
                         data-rule-data="${ruleData}">
                        <span class="acu-change-badge" style="background:var(--acu-hl-manual-bg);color:var(--acu-hl-manual);">!</span>
                        ${error.rowTitle && error.rowIndex >= 0 ? `<div class="acu-validation-row-title" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:2px;">${escapeHtml(error.rowTitle)}</div>` : ''}
                        <span class="acu-change-title">${escapeHtml(error.columnName || (error.rowIndex < 0 ? '整表' : '整行'))}${error.currentValue ? `: ${escapeHtml(error.currentValue.length > 15 ? error.currentValue.substring(0, 15) + '...' : error.currentValue)}` : ''}</span>
                        <span class="acu-validation-error-msg">${escapeHtml(error.errorMessage.length > 25 ? error.errorMessage.substring(0, 25) + '...' : error.errorMessage)}</span>
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
                    <div class="acu-changes-group-header" data-table="${escapeHtml(tableName)}" style="cursor:pointer;">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                        <i class="fa-solid ${getIconForTableName(tableName)}"></i> ${escapeHtml(tableName)}
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
                            <span class="acu-change-title">${escapeHtml(change.title)}</span>
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
                            <span class="acu-change-title" style="text-decoration:line-through;opacity:0.6;">${escapeHtml(change.title)}</span>
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
                fieldDisplay = `${escapeHtml(change.tableName)}.${escapeHtml(change.header)}`;
              } else {
                fieldDisplay = `${escapeHtml(change.rowTitle)}.${escapeHtml(change.header)}`;
              }

              html += `<div class="acu-change-item acu-change-modified"
                            data-change-type="cell_modified"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}"
                            data-col-index="${change.colIndex}"
  data-old-value="${safeEncodeURIComponent(change.oldValue)}">
                            <span class="acu-change-badge acu-badge-modified">更</span>
                            <span class="acu-change-field">${fieldDisplay}</span>
                            <span class="acu-change-diff">
                                <span class="acu-diff-old">${escapeHtml(oldShort || '(空)')}</span>
                                <span class="acu-diff-arrow">→</span>
                                <span class="acu-diff-new">${escapeHtml(newShort || '(空)')}</span>
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
                            <span class="acu-change-title">${escapeHtml(change.rowTitle)}</span>
                            <span class="acu-change-field-count">${escapeHtml(fieldNames)}${moreText}</span>
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
                            <span class="acu-change-title" style="opacity:0.6;">${escapeHtml(structuralText)}</span>
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

  const renderGlobalInteractionActionButton = (
    group: GlobalInteractionGroup,
    row: GlobalInteractionRow,
    action: GlobalInteractionAction,
    actionIndex: number,
  ): string => {
    const actionLabel = String(action.label);
    const iconClass = String(action.icon || 'fa-hand-pointer').trim() || 'fa-hand-pointer';
    const ariaLabel = `执行 ${actionLabel}：${row.title}`;

    return `<button type="button" class="acu-global-interaction-action" data-table-key="${safeEncodeURIComponent(String(group.tableKey))}" data-row-index="${safeEncodeURIComponent(String(row.rowIndex))}" data-action-label="${safeEncodeURIComponent(String(actionLabel))}" data-action-index="${safeEncodeURIComponent(String(actionIndex))}" aria-label="${escapeHtml(String(ariaLabel))}"><i class="fa-solid ${escapeHtml(String(iconClass))}"></i> ${escapeHtml(String(actionLabel))}</button>`;
  };

  const getGlobalInteractionAvatarLookupNames = (rowTitle: string): string[] => {
    const displayName = replaceUserPlaceholders(rowTitle);
    const names = [displayName.trim(), rowTitle.trim()];
    if (/^[\u4e00-\u9fa5]{3,}$/.test(displayName.trim())) {
      names.push(displayName.trim().slice(0, 2));
    }
    return [...new Set(names.filter(Boolean))];
  };

  const renderGlobalInteractionAvatar = (rowTitle: string): string => {
    const displayName = replaceUserPlaceholders(rowTitle);
    const lookupNames = getGlobalInteractionAvatarLookupNames(rowTitle);
    // 角色交互卡片必须继续使用 AvatarManager，禁止在这条路径调用自定义表名图标解析。
    const matchedLookupName = lookupNames.find(name => Boolean(AvatarManager.get(name))) || displayName;
    const avatarUrl = AvatarManager.get(matchedLookupName) || '';
    const avatarStyle = escapeHtml(
      buildAvatarBackgroundStyle(
        avatarUrl,
        AvatarManager.getOffsetX(matchedLookupName),
        AvatarManager.getOffsetY(matchedLookupName),
        AvatarManager.getScale(matchedLookupName),
      ),
    );
    const fallbackText = displayName.trim().charAt(0) || '?';
    return `<div class="acu-global-interaction-avatar" data-avatar-name="${safeEncodeURIComponent(rowTitle)}" title="${escapeHtml(displayName)}" aria-label="${escapeHtml(displayName)}" style="${avatarStyle}">${avatarStyle ? '' : `<span>${escapeHtml(fallbackText)}</span>`}</div>`;
  };

  const renderGlobalInteractionMapMark = (rowTitle: string, tableName: string, iconName?: string): string => {
    const iconContext = createGlobalInteractionCustomTableNameIconContext(tableName, iconName || rowTitle);
    const locationEmoji = getLocationEmoji(rowTitle);
    if (locationEmoji) {
      return `<div class="acu-global-interaction-map-mark" title="${escapeHtml(rowTitle)}">${renderCustomTableNameIconContent(renderIcon(locationEmoji), iconContext)}</div>`;
    }
    return `<div class="acu-global-interaction-map-mark" title="${escapeHtml(rowTitle)}">${renderCustomTableNameIconContent(`<i class="fa-solid ${escapeHtml(getIconForTableName(tableName))}"></i>`, iconContext)}</div>`;
  };

  const renderGlobalInteractionGenericMark = (
    rowTitle: string,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const displayName = replaceUserPlaceholders(rowTitle).trim();
    const fallbackText = displayName.charAt(0) || '?';
    return `<div class="acu-global-interaction-generic-mark" aria-hidden="true">${renderCustomTableNameIconContent(`<span>${escapeHtml(fallbackText)}</span>`, customContext)}</div>`;
  };

  const renderGlobalInteractionItemMark = (
    rowTitle: string,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const displayName = replaceUserPlaceholders(rowTitle).trim();
    return `<div class="acu-global-interaction-generic-mark" title="${escapeHtml(displayName)}">${renderCustomTableNameIconContent(renderThemeIconContent(getElementEmoji(displayName, null)), customContext)}</div>`;
  };

  const renderGlobalInteractionRowCard = (
    group: GlobalInteractionGroup,
    row: GlobalInteractionRow,
    sectionKind: GlobalInteractionSectionKind,
  ): string => {
    const actionsHtml = row.actions
      .map((action, actionIndex) => renderGlobalInteractionActionButton(group, row, action, actionIndex))
      .join('');
    const displayName = replaceUserPlaceholders(row.title);
    const iconName = row.iconName || row.title;
    const customIconContext =
      sectionKind === 'character' ? null : createGlobalInteractionCustomTableNameIconContext(group.tableName, iconName);
    const visualHtml =
      sectionKind === 'character'
        ? // 角色分区必须保留 AvatarManager 头像与偏移/缩放逻辑，不能走自定义表名图标。
          renderGlobalInteractionAvatar(row.title)
        : sectionKind === 'map'
          ? renderGlobalInteractionMapMark(row.title, group.tableName, iconName)
          : sectionKind === 'item'
            ? renderGlobalInteractionItemMark(row.title, customIconContext)
            : renderGlobalInteractionGenericMark(row.title, customIconContext);

    return `
                    <div class="acu-global-interaction-row acu-global-interaction-row-${sectionKind}" data-table-key="${safeEncodeURIComponent(String(group.tableKey))}" data-row-index="${safeEncodeURIComponent(String(row.rowIndex))}" data-search-text="${safeEncodeURIComponent(String(row.searchText))}">
                        <button type="button" class="acu-global-interaction-row-main" aria-expanded="false" aria-label="打开 ${escapeHtml(displayName)} 的交互菜单">
                            ${visualHtml}
                        </button>
                        <div class="acu-global-interaction-details">
                            <button type="button" class="acu-global-interaction-row-title acu-dash-preview-trigger" data-table-key="${safeEncodeURIComponent(String(group.tableKey))}" data-row-index="${safeEncodeURIComponent(String(row.rowIndex))}" title="${escapeHtml(displayName)}" aria-label="查看 ${escapeHtml(displayName)} 的卡片">${escapeHtml(displayName)}</button>
                            <div class="acu-global-interaction-actions">${actionsHtml}</div>
                        </div>
                    </div>`;
  };

  const getGlobalInteractionCollapsedSections = (): string[] => {
    const collapsedSections = Store.get(STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, []);
    return Array.isArray(collapsedSections) ? collapsedSections.map(sectionKind => String(sectionKind)) : [];
  };

  const renderGlobalInteractionsTableGroup = (
    group: GlobalInteractionGroup,
    sectionKind: GlobalInteractionSectionKind,
  ): string => {
    const rowsHtml = group.rows.map(row => renderGlobalInteractionRowCard(group, row, sectionKind)).join('');
    const groupSearchText = [group.tableName, ...group.rows.map(row => row.searchText)].join(' ');

    return `
                    <div class="acu-global-interaction-group" data-table-key="${safeEncodeURIComponent(String(group.tableKey))}" data-table-name="${safeEncodeURIComponent(String(group.tableName))}" data-search-text="${safeEncodeURIComponent(String(groupSearchText))}">
                        <div class="acu-global-interaction-grid">${rowsHtml}</div>
                    </div>`;
  };

  const renderGlobalInteractionsSection = (section: GlobalInteractionSection): string => {
    const collapsedSections = getGlobalInteractionCollapsedSections();
    const isCollapsed = collapsedSections.includes(section.kind);
    const rowCount = section.groups.reduce((count, group) => count + group.rows.length, 0);
    const actionCount = section.groups.reduce(
      (count, group) => count + group.rows.reduce((rowCountSum, row) => rowCountSum + row.actions.length, 0),
      0,
    );
    const sectionSearchText = section.groups
      .map(group => `${group.tableName} ${group.rows.map(row => row.searchText).join(' ')}`)
      .join(' ');
    const groupsHtml = section.groups.map(group => renderGlobalInteractionsTableGroup(group, section.kind)).join('');

    return `
                <div class="acu-global-interaction-section acu-global-interaction-section-${section.kind} ${isCollapsed ? 'collapsed' : ''}" data-section-kind="${section.kind}" data-search-text="${safeEncodeURIComponent(String(sectionSearchText))}">
                    <button type="button" class="acu-global-interaction-section-header" data-section-kind="${section.kind}" aria-expanded="${isCollapsed ? 'false' : 'true'}">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon"></i>
                        <span class="acu-global-interaction-section-title"><i class="fa-solid ${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</span>
                        <span class="acu-global-interaction-section-stats">${escapeHtml(String(section.groups.length))} 个表 / ${escapeHtml(String(rowCount))} 个对象 / ${escapeHtml(String(actionCount))} 个交互</span>
                    </button>
                    <div class="acu-global-interaction-section-body" style="${isCollapsed ? 'display:none;' : ''}">
                        <div class="acu-global-interaction-table-list">${groupsHtml}</div>
                    </div>
                </div>`;
  };

  const renderGlobalInteractionsPanel = (rawData: unknown): string => {
    const groups = buildGlobalInteractionGroups(rawData);
    const sections = createGlobalInteractionSections(groups);
    const rowCount = groups.reduce((count, group) => count + group.rows.length, 0);
    const actionCount = groups.reduce(
      (count, group) => count + group.rows.reduce((groupCount, row) => groupCount + row.actions.length, 0),
      0,
    );
    debugGlobalInteraction('renderPanel', {
      groupCount: groups.length,
      sectionCount: sections.length,
      rowCount,
      actionCount,
      sections: sections.map(section => ({ kind: section.kind, groupCount: section.groups.length })),
    });
    const contentHtml =
      groups.length > 0
        ? sections.map(section => renderGlobalInteractionsSection(section)).join('')
        : `
                    <div class="acu-empty-hint acu-global-interaction-empty">
                        <i class="fa-solid fa-hand-pointer"></i>
                        <div>暂无可用交互选项</div>
                        <div>请在表格中填写“交互选项”列，或在设置里的“交互规则预设”中为表格配置默认交互。</div>
                    </div>`;

    return `
                <div class="acu-panel-header">
                    <div class="acu-panel-title">
                        <div class="acu-title-main"><i class="fa-solid fa-hand-pointer"></i> <span class="acu-title-text">交互总览</span></div>
                        <div class="acu-title-sub">${escapeHtml(String(groups.length))} 个表 / ${escapeHtml(String(rowCount))} 个对象 / ${escapeHtml(String(actionCount))} 个交互</div>
                    </div>
                    <div class="acu-header-actions">
                        ${getTutorialButtonHtml('globalInteractions', '查看交互总览教程')}
                        <button class="acu-view-btn acu-global-interaction-rules-btn" title="管理交互规则预设" aria-label="管理交互规则预设"><i class="fa-solid fa-gear"></i></button>
                        <div class="acu-height-control" data-table="交互总览">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="交互总览" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button class="acu-close-btn" title="关闭" aria-label="关闭交互总览"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <div class="acu-panel-content acu-global-interaction-panel">
                    <div class="acu-global-interaction-toolbar">
                        <div class="acu-search-wrapper acu-global-interaction-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="search" class="acu-global-interaction-search" placeholder="搜索表名、对象或交互..." aria-label="搜索表名、对象或交互" /></div>
                    </div>
                    <div class="acu-global-interaction-content">
                        ${contentHtml}
                        <div class="acu-empty-hint acu-global-interaction-no-results" hidden>没有匹配的交互</div>
                    </div>
                </div>`;
  };

  const hydrateGlobalInteractionAvatars = ($panel: JQuery): void => {
    const { $ } = getCore();
    $panel.find<HTMLElement>('.acu-global-interaction-avatar[data-avatar-name]').each(function () {
      const $avatar = $(this);
      const rowTitle = safeDecodeURIComponent($avatar.attr('data-avatar-name') || '').trim();
      if (!rowTitle) return;
      const lookupNames = getGlobalInteractionAvatarLookupNames(rowTitle);

      void Promise.all(lookupNames.map(name => AvatarManager.getAsync(name).then(avatarUrl => ({ name, avatarUrl }))))
        .then(avatarUrl => {
          const matched = avatarUrl.find(item => Boolean(item.avatarUrl));
          if (!matched?.avatarUrl) return;
          const cssImageUrl = formatCssImageUrl(matched.avatarUrl, { allowInternalObjectUrl: true });
          if (!cssImageUrl) return;
          $avatar
            .css({
              'background-image': cssImageUrl,
              'background-size': `${AvatarManager.getScale(matched.name)}%`,
              'background-position': `${AvatarManager.getOffsetX(matched.name)}% ${AvatarManager.getOffsetY(matched.name)}%`,
            })
            .empty();
        })
        .catch(error => {
          console.warn('[DICE] 交互总览头像加载失败:', error);
        });
    });
  };

  const bindGlobalInteractionEvents = ($panel: JQuery<HTMLElement>): void => {
    const { $ } = getCore();
    const panelDocument = $panel[0]?.ownerDocument || document;
    const panelWindow = panelDocument.defaultView || window;

    clearGlobalInteractionOutsideCapture();
    $panel.off('.globalInteractionEvents');
    $('body').off('click.globalInteractionEvents', '.acu-global-interaction-row-title.acu-dash-preview-trigger');
    $(window).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
    if (panelWindow !== window) $(panelWindow).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
    $(panelDocument).off('click.globalInteractionEvents');
    $(panelDocument).find('.acu-global-interaction-floating-host').remove();
    hydrateGlobalInteractionAvatars($panel);

    const $noResults = $panel.find('.acu-global-interaction-no-results');
    $noResults.prop('hidden', true);
    debugGlobalInteraction('bind-events', {
      panelFound: $panel.length > 0,
      rowCount: $panel.find('.acu-global-interaction-row').length,
      buttonCount: $panel.find('.acu-global-interaction-row-main').length,
      actionButtonCount: $panel.find('.acu-global-interaction-action').length,
      groupCount: $panel.find('.acu-global-interaction-group').length,
      noResultsHidden: Boolean($noResults.prop('hidden')),
      noResultsDisplay: $noResults[0] ? getComputedStyle($noResults[0]).display : null,
      searchValue: String($panel.find('.acu-global-interaction-search').val() || ''),
    });

    const logNoResultsState = (event: string): void => {
      const noResults = $panel.find<HTMLElement>('.acu-global-interaction-no-results')[0];
      const noResultsStyle = noResults ? getComputedStyle(noResults) : null;
      debugGlobalInteraction(event, {
        rowCount: $panel.find('.acu-global-interaction-row').length,
        visibleRowCount: $panel
          .find('.acu-global-interaction-row')
          .toArray()
          .filter(row => $(row).css('display') !== 'none').length,
        groupCount: $panel.find('.acu-global-interaction-group').length,
        iconButtonCount: $panel.find('.acu-global-interaction-row-main').length,
        actionButtonCount: $panel.find('.acu-global-interaction-action').length,
        searchValue: String($panel.find<HTMLInputElement>('.acu-global-interaction-search').val() || ''),
        noResultsHidden: noResults?.hidden ?? null,
        noResultsDisplay: noResultsStyle?.display ?? null,
        noResultsText: noResults?.textContent?.trim() || '',
      });
    };

    logNoResultsState('bind:start');
    $panel.find('.acu-global-interaction-no-results').prop('hidden', true);

    $panel.on(
      'pointerdown.globalInteractionEvents',
      '.acu-height-control',
      function (this: HTMLElement, e: JQuery.Event) {
        const pointerEvent = e.originalEvent as PointerEvent | undefined;
        if (!pointerEvent || typeof pointerEvent.pointerId !== 'number' || pointerEvent.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        const controlEl = this;
        const $control = $(controlEl);
        const $handle = $control.find('.acu-height-drag-handle').first();
        const tableName = String($control.attr('data-table') || $handle.attr('data-table') || '交互总览').trim();
        controlEl.setPointerCapture(pointerEvent.pointerId);
        $control.add($handle).addClass('active');

        const startHeight = getPanelDragStartHeight($panel);
        let requestedHeight = startHeight;
        const startY = pointerEvent.clientY;

        controlEl.onpointermove = (moveEvent: PointerEvent): void => {
          const dy = moveEvent.clientY - startY;
          requestedHeight = setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
        };
        controlEl.onpointerup = (upEvent: PointerEvent): void => {
          $control.add($handle).removeClass('active');
          controlEl.releasePointerCapture(upEvent.pointerId);
          controlEl.onpointermove = null;
          controlEl.onpointerup = null;
          savePanelRequestedHeight(tableName, requestedHeight);
        };
      },
    );

    $panel.on('dblclick.globalInteractionEvents', '.acu-height-control', function (this: HTMLElement, e: JQuery.Event) {
      e.preventDefault();
      e.stopPropagation();

      const $control = $(this);
      const $handle = $control.find('.acu-height-drag-handle').first();
      const tableName = String($control.attr('data-table') || $handle.attr('data-table') || '交互总览').trim();
      resetPanelRequestedHeight($panel, tableName);
    });

    const describeTarget = (target: EventTarget | null): Record<string, unknown> => {
      const element = target instanceof Element ? target : null;
      const row = element?.closest<HTMLElement>('.acu-global-interaction-row') || null;
      const button = element?.closest<HTMLElement>('.acu-global-interaction-row-main') || null;
      return {
        tag: element?.tagName || '',
        className: element?.className ? String(element.className) : '',
        rowIndex: row ? safeDecodeURIComponent(row.getAttribute('data-row-index') || '') : '',
        rowExpanded: row?.classList.contains('is-expanded') ?? null,
        iconButtonFound: Boolean(button),
        buttonAriaExpanded: button?.getAttribute('aria-expanded') || '',
      };
    };

    const debugPanelPointerEvent = (event: PointerEvent | MouseEvent): void => {
      const targetInfo = describeTarget(event.target);
      if (!targetInfo.iconButtonFound && !targetInfo.rowIndex) return;
      debugGlobalInteraction(`capture:${event.type}`, {
        ...targetInfo,
        clientX: event.clientX,
        clientY: event.clientY,
        defaultPrevented: event.defaultPrevented,
      });
    };

    const panelElForDebug = $panel[0];
    if (panelElForDebug) {
      panelElForDebug.addEventListener('pointerdown', debugPanelPointerEvent, true);
      panelElForDebug.addEventListener('click', debugPanelPointerEvent, true);
      $(window).on('pagehide.globalInteractionDebug', () => {
        panelElForDebug.removeEventListener('pointerdown', debugPanelPointerEvent, true);
        panelElForDebug.removeEventListener('click', debugPanelPointerEvent, true);
      });
    }

    const showInvalidInteractionWarning = (): void => {
      if (window.toastr) window.toastr.warning('交互目标已失效，请刷新数据后重试');
    };

    const resolveFreshInteractionTarget = (
      $button: JQuery,
    ): { action: GlobalInteractionAction; headers: unknown[]; rowData: unknown[] } | null => {
      const tableKey = safeDecodeURIComponent($button.attr('data-table-key') || '').trim();
      const rowIndex = Number.parseInt(safeDecodeURIComponent($button.attr('data-row-index') || ''), 10);
      const actionLabel = safeDecodeURIComponent($button.attr('data-action-label') || '').trim();
      const actionIndex = Number.parseInt(safeDecodeURIComponent($button.attr('data-action-index') || ''), 10);
      if (!tableKey || !Number.isInteger(rowIndex) || rowIndex < 0) return null;

      const rawData = getCachedRawData() || getTableData();
      if (!isRecord(rawData)) return null;

      const sheet = rawData[tableKey];
      if (!isRecord(sheet) || typeof sheet.name !== 'string' || !isTwoDimensionalArray(sheet.content)) return null;

      const headers = sheet.content[0] || [];
      const rowData = sheet.content[rowIndex + 1];
      if (!Array.isArray(headers) || !Array.isArray(rowData)) return null;

      const actions = dedupeInteractionActions(getInteractOptionsForRow(sheet.name, headers, rowData));
      const normalizedLabel = normalizeInteractionLabel(actionLabel);
      const actionByLabel = normalizedLabel
        ? actions.find(action => normalizeInteractionLabel(action.label) === normalizedLabel)
        : undefined;
      const actionByIndex = Number.isInteger(actionIndex) && actionIndex >= 0 ? actions[actionIndex] : undefined;
      const action = actionByLabel || actionByIndex;
      return action ? { action, headers, rowData } : null;
    };

    (function () {
      const panelEl = $panel[0] as (HTMLElement & { _globalInteractionSwipeFixApplied?: boolean }) | undefined;
      if (!panelEl || panelEl._globalInteractionSwipeFixApplied) return;
      panelEl._globalInteractionSwipeFixApplied = true;

      let touchStartX = 0;
      let touchStartY = 0;
      let isHorizontalSwipe = false;

      const onTouchStart = (e: TouchEvent): void => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isHorizontalSwipe = false;
        }
      };

      const onTouchMove = (e: TouchEvent): void => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        const isHorizontal = deltaY < 5 ? deltaX > 5 && deltaX > deltaY * 2 : deltaX > deltaY * 1.5 && deltaX > 10;

        if (isHorizontal) {
          isHorizontalSwipe = true;
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      };

      const onTouchEnd = (e: TouchEvent): void => {
        if (isHorizontalSwipe) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          isHorizontalSwipe = false;
        }
        touchStartX = 0;
        touchStartY = 0;
      };

      panelEl.addEventListener('touchstart', onTouchStart, true);
      panelEl.addEventListener('touchmove', onTouchMove, true);
      panelEl.addEventListener('touchend', onTouchEnd, true);

      $(window).on('pagehide.globalInteractionSwipeFix', () => {
        panelEl.removeEventListener('touchstart', onTouchStart, true);
        panelEl.removeEventListener('touchmove', onTouchMove, true);
        panelEl.removeEventListener('touchend', onTouchEnd, true);
      });
    })();

    $panel.on('click.globalInteractionEvents', '.acu-close-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      collapseExpandedGlobalInteractionRows();
      $(panelDocument).find('.acu-global-interaction-floating-host').remove();
      closePanel($panel.closest<HTMLElement>(DICE_ROOT_SELECTOR));
    });

    bindCompositionSafeSearchInput(
      { root: $panel, selector: '.acu-global-interaction-search', namespace: 'globalInteractionEvents' },
      {
        delay: 120,
        onCommit: ({ value }) => {
          const query = value.trim().toLowerCase();
          let visibleRowCount = 0;

          $panel.find('.acu-global-interaction-row').each(function () {
            const $row = $(this);
            const searchText = safeDecodeURIComponent($row.attr('data-search-text') || '').toLowerCase();
            const isVisible = !query || searchText.includes(query);
            $row.toggle(isVisible);
            if (!isVisible) {
              clearGlobalInteractionDetailsPlacement($row);
              $row.removeClass('is-expanded').find('.acu-global-interaction-row-main').attr('aria-expanded', 'false');
            }
            if (isVisible) visibleRowCount += 1;
          });

          $panel.find('.acu-global-interaction-group').each(function () {
            const $group = $(this);
            const hasVisibleRows = $group
              .find('.acu-global-interaction-row')
              .toArray()
              .some(row => $(row).css('display') !== 'none');
            $group.toggle(hasVisibleRows);
          });

          $panel.find('.acu-global-interaction-section').each(function () {
            const $section = $(this);
            const hasVisibleGroups = $section
              .find('.acu-global-interaction-group')
              .toArray()
              .some(group => $(group).css('display') !== 'none');
            $section.toggle(hasVisibleGroups);
          });

          $panel.find('.acu-global-interaction-no-results').prop('hidden', !query || visibleRowCount > 0);
          const $currentNoResults = $panel.find('.acu-global-interaction-no-results');
          debugGlobalInteraction('search-commit', {
            query,
            totalRowCount: $panel.find('.acu-global-interaction-row').length,
            visibleRowCount,
            visibleGroupCount: $panel
              .find('.acu-global-interaction-group')
              .toArray()
              .filter(group => $(group).css('display') !== 'none').length,
            noResultsHidden: Boolean($currentNoResults.prop('hidden')),
            noResultsDisplay: $currentNoResults[0] ? getComputedStyle($currentNoResults[0]).display : null,
          });
        },
      },
    );

    let globalInteractionFloatingMenuCounter = 0;

    const getGlobalInteractionFloatingHost = (): HTMLElement => {
      const root = $panel.closest<HTMLElement>(DICE_ROOT_SELECTOR)[0];
      let host = panelDocument.querySelector<HTMLElement>('.acu-global-interaction-floating-host');
      if (!host) {
        host = panelDocument.createElement('div');
        (panelDocument.body || panelDocument.documentElement).appendChild(host);
      }

      const themeClasses = root
        ? Array.from(root.classList).filter(className => className.startsWith('acu-theme-'))
        : [];
      host.className = ['acu-global-interaction-floating-host', ...themeClasses].join(' ');
      host.style.position = 'fixed';
      host.style.inset = '0';
      host.style.zIndex = '31420';
      host.style.pointerEvents = 'none';

      const sourceStyle = panelWindow.getComputedStyle(root || $panel[0] || panelDocument.documentElement);
      [
        '--acu-bg-panel',
        '--acu-card-bg',
        '--acu-border',
        '--acu-accent',
        '--acu-text-main',
        '--acu-text-sub',
        '--acu-btn-active-text',
        '--acu-button-text-on-accent',
      ].forEach(propertyName => {
        const propertyValue = sourceStyle.getPropertyValue(propertyName);
        if (propertyValue) host.style.setProperty(propertyName, propertyValue);
      });

      return host;
    };

    const ensureGlobalInteractionFloatingMenuId = ($row: JQuery<HTMLElement>): string => {
      const currentId = String($row.attr('data-floating-menu-id') || '');
      if (currentId) return currentId;
      globalInteractionFloatingMenuCounter += 1;
      const nextId = `global-interaction-menu-${Date.now()}-${globalInteractionFloatingMenuCounter}`;
      $row.attr('data-floating-menu-id', nextId);
      return nextId;
    };

    const findGlobalInteractionDetails = ($row: JQuery<HTMLElement>): HTMLElement | null => {
      const localDetails = $row.find<HTMLElement>('.acu-global-interaction-details')[0];
      if (localDetails) return localDetails;
      const menuId = String($row.attr('data-floating-menu-id') || '');
      if (!menuId) return null;
      return ($row[0]?.ownerDocument || panelDocument).querySelector<HTMLElement>(
        `.acu-global-interaction-details[data-floating-menu-id="${menuId}"]`,
      );
    };

    const restoreGlobalInteractionDetails = ($row: JQuery<HTMLElement>, details: HTMLElement): void => {
      if (details.parentElement?.classList.contains('acu-global-interaction-floating-host')) {
        $row[0]?.appendChild(details);
      }
      details.classList.remove('is-floating');
      details.removeAttribute('data-floating-menu-id');
    };

    const clearGlobalInteractionDetailsPlacement = ($row: JQuery<HTMLElement>): void => {
      const details = findGlobalInteractionDetails($row);
      if (!details) return;
      restoreGlobalInteractionDetails($row, details);
      details.style.removeProperty('position');
      details.style.removeProperty('left');
      details.style.removeProperty('top');
      details.style.removeProperty('right');
      details.style.removeProperty('bottom');
      details.style.removeProperty('min-width');
      details.style.removeProperty('max-width');
      details.style.removeProperty('max-height');
      details.style.removeProperty('overflow-y');
      details.style.removeProperty('transform');
      details.style.removeProperty('visibility');
      details.style.removeProperty('display');
      details.style.removeProperty('flex-direction');
      details.style.removeProperty('gap');
      details.style.removeProperty('pointer-events');
      details.style.removeProperty('z-index');
    };

    const collapseExpandedGlobalInteractionRows = (): void => {
      $panel
        .find<HTMLElement>('.acu-global-interaction-row.is-expanded')
        .each(function () {
          clearGlobalInteractionDetailsPlacement($(this));
        })
        .removeClass('is-expanded')
        .find('.acu-global-interaction-row-main')
        .attr('aria-expanded', 'false');
    };

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-section-header', function (event) {
      event.stopPropagation();
      event.preventDefault();
      collapseExpandedGlobalInteractionRows();

      const $header = $(this);
      const $section = $header.closest<HTMLElement>('.acu-global-interaction-section');
      const $body = $section.find<HTMLElement>('.acu-global-interaction-section-body').first();
      const $icon = $header.find('.acu-collapse-icon');
      const sectionKind = String($header.attr('data-section-kind') || '').trim();
      const collapsedSections = getGlobalInteractionCollapsedSections();

      if ($section.hasClass('collapsed')) {
        $section.removeClass('collapsed');
        $header.attr('aria-expanded', 'true');
        $body.slideDown(200);
        $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        Store.set(
          STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
          collapsedSections.filter(kind => kind !== sectionKind),
        );
        return;
      }

      $section.addClass('collapsed');
      $header.attr('aria-expanded', 'false');
      $body.slideUp(200);
      $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
      if (sectionKind && !collapsedSections.includes(sectionKind)) {
        Store.set(STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, [...collapsedSections, sectionKind]);
      }
    });

    const applyGlobalInteractionDetailsPlacement = ($row: JQuery<HTMLElement>): void => {
      const rowElement = $row[0];
      const details = findGlobalInteractionDetails($row);
      const iconButton = $row.find<HTMLElement>('.acu-global-interaction-row-main')[0];
      if (!rowElement || !details || !iconButton || !$row.hasClass('is-expanded')) return;

      clearGlobalInteractionDetailsPlacement($row);

      try {
        const menuId = ensureGlobalInteractionFloatingMenuId($row);
        const floatingHost = getGlobalInteractionFloatingHost();
        details.setAttribute('data-floating-menu-id', menuId);
        details.classList.add('is-floating');
        floatingHost.appendChild(details);
        details.style.display = 'flex';
        details.style.flexDirection = 'column';
        details.style.gap = '4px';
        details.style.pointerEvents = 'auto';
        details.style.zIndex = '31421';

        const detailsDocument = rowElement.ownerDocument || panelDocument;
        const detailsWindow = detailsDocument.defaultView || panelWindow;
        const viewportWidth = detailsWindow.innerWidth || detailsDocument.documentElement.clientWidth;
        const viewportHeight = detailsWindow.innerHeight || detailsDocument.documentElement.clientHeight;
        const contentPanel = rowElement.closest<HTMLElement>('.acu-global-interaction-panel');
        const panelRect = (contentPanel || $panel[0])?.getBoundingClientRect();
        const anchorRect = iconButton.getBoundingClientRect();
        const margin = 8;
        const gap = 8;
        const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
        const boundaryLeft = Math.max(panelRect?.left ?? 0, 0) + margin;
        const boundaryTop = Math.max(panelRect?.top ?? 0, 0) + margin;
        const boundaryRight = Math.min(panelRect?.right ?? viewportWidth, viewportWidth) - margin;
        const boundaryBottom = Math.min(panelRect?.bottom ?? viewportHeight, viewportHeight) - margin;
        const availableWidth = Math.max(120, boundaryRight - boundaryLeft);

        details.style.position = 'fixed';
        details.style.left = '0px';
        details.style.top = '0px';
        details.style.minWidth = `${Math.min(188, availableWidth)}px`;
        details.style.maxWidth = `${Math.min(260, availableWidth)}px`;
        details.style.removeProperty('max-height');
        details.style.removeProperty('overflow-y');
        details.style.visibility = 'hidden';

        const naturalRect = details.getBoundingClientRect();
        const downSpace = Math.max(0, boundaryBottom - anchorRect.bottom - gap);
        const upSpace = Math.max(0, anchorRect.top - boundaryTop - gap);
        const shouldOpenUp = naturalRect.height > downSpace && upSpace > downSpace;
        const availableHeight = shouldOpenUp ? upSpace : downSpace;
        const constrainedHeight = Math.floor(availableHeight);

        if (constrainedHeight > 0 && naturalRect.height > constrainedHeight) {
          details.style.maxHeight = `${constrainedHeight}px`;
          details.style.overflowY = 'auto';
        }

        const detailsRect = details.getBoundingClientRect();
        const popupWidth = Math.min(detailsRect.width, availableWidth);
        const popupHeight = Math.min(
          detailsRect.height,
          constrainedHeight > 0 ? constrainedHeight : detailsRect.height,
        );
        const left = clamp(
          anchorRect.left + anchorRect.width / 2 - popupWidth / 2,
          boundaryLeft,
          Math.max(boundaryLeft, boundaryRight - popupWidth),
        );
        const preferredTop = shouldOpenUp ? anchorRect.top - popupHeight - gap : anchorRect.bottom + gap;
        const top = clamp(preferredTop, boundaryTop, Math.max(boundaryTop, boundaryBottom - popupHeight));

        details.style.left = `${Math.round(left)}px`;
        details.style.top = `${Math.round(top)}px`;
        details.style.visibility = 'visible';
      } catch {
        clearGlobalInteractionDetailsPlacement($row);
      }
    };

    const updateExpandedGlobalInteractionDetailsPlacement = (): void => {
      const $expandedRow = $panel.find<HTMLElement>('.acu-global-interaction-row.is-expanded').first();
      if ($expandedRow.length === 0) return;
      applyGlobalInteractionDetailsPlacement($expandedRow);
    };

    const $contentPanel = $panel.find('.acu-global-interaction-panel');
    $contentPanel
      .off('scroll.globalInteractionEvents')
      .on('scroll.globalInteractionEvents', updateExpandedGlobalInteractionDetailsPlacement);
    $(panelWindow).on(
      'resize.globalInteractionEvents scroll.globalInteractionEvents',
      updateExpandedGlobalInteractionDetailsPlacement,
    );

    const toggleGlobalInteractionRow = ($row: JQuery<HTMLElement>): void => {
      const detailsBefore = $row.find<HTMLElement>('.acu-global-interaction-details')[0];
      const iconButton = $row.find<HTMLElement>('.acu-global-interaction-row-main')[0];
      const shouldExpand = !$row.hasClass('is-expanded');
      debugGlobalInteraction('toggle:before', {
        shouldExpand,
        rowIndex: safeDecodeURIComponent($row.attr('data-row-index') || ''),
        tableKey: safeDecodeURIComponent($row.attr('data-table-key') || ''),
        rowClass: String($row.attr('class') || ''),
        buttonAriaExpanded: iconButton?.getAttribute('aria-expanded') || '',
        detailsDisplay: detailsBefore ? panelWindow.getComputedStyle(detailsBefore).display : null,
        detailsRect: detailsBefore ? detailsBefore.getBoundingClientRect().toJSON() : null,
      });
      collapseExpandedGlobalInteractionRows();
      if (shouldExpand) {
        $row.addClass('is-expanded').find('.acu-global-interaction-row-main').attr('aria-expanded', 'true');
        applyGlobalInteractionDetailsPlacement($row);
      }
      const detailsAfter = $row.find<HTMLElement>('.acu-global-interaction-details')[0];
      const rowElement = $row[0];
      const rowStyle = rowElement ? panelWindow.getComputedStyle(rowElement) : null;
      debugGlobalInteraction('toggle:after', {
        rowExpanded: $row.hasClass('is-expanded'),
        buttonAriaExpanded: iconButton?.getAttribute('aria-expanded') || '',
        detailsDisplay: detailsAfter ? panelWindow.getComputedStyle(detailsAfter).display : null,
        detailsRect: detailsAfter ? detailsAfter.getBoundingClientRect().toJSON() : null,
        rowBackground: rowStyle?.backgroundColor ?? null,
        rowBorderWidth: rowStyle?.borderWidth ?? null,
        rowBoxShadow: rowStyle?.boxShadow ?? null,
      });
    };

    const handleGlobalInteractionPreviewTitleClick = function (): void {
      collapseExpandedGlobalInteractionRows();
    };

    $('body').on(
      'click.globalInteractionEvents',
      '.acu-global-interaction-row-title.acu-dash-preview-trigger',
      handleGlobalInteractionPreviewTitleClick,
    );

    const getEventElement = (target: EventTarget | null): Element | null => {
      if (!target) return null;
      const node = target as Node;
      if (typeof node.nodeType !== 'number') return null;
      return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    };

    const handleGlobalInteractionOutsideCapture = (event: Event): void => {
      const target = getEventElement(event.target);
      if (!target || $panel.find('.acu-global-interaction-row.is-expanded').length === 0) return;
      if (target.closest('.acu-global-interaction-row-main')) return;
      if (target.closest('.acu-global-interaction-details')) return;
      collapseExpandedGlobalInteractionRows();
    };

    panelDocument.addEventListener('pointerdown', handleGlobalInteractionOutsideCapture, true);
    panelDocument.addEventListener('mousedown', handleGlobalInteractionOutsideCapture, true);
    panelDocument.addEventListener('touchstart', handleGlobalInteractionOutsideCapture, true);
    setCleanupGlobalInteractionOutsideCapture(() => {
      panelDocument.removeEventListener('pointerdown', handleGlobalInteractionOutsideCapture, true);
      panelDocument.removeEventListener('mousedown', handleGlobalInteractionOutsideCapture, true);
      panelDocument.removeEventListener('touchstart', handleGlobalInteractionOutsideCapture, true);
    });

    $(panelDocument).on('click.globalInteractionEvents', function (event) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || $panel.find('.acu-global-interaction-row.is-expanded').length === 0) return;
      if (target.closest('.acu-global-interaction-row-main')) return;
      if (target.closest('.acu-global-interaction-details')) return;
      collapseExpandedGlobalInteractionRows();
    });

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-row-main', function (event) {
      debugGlobalInteraction('icon:onclick', {
        rowIndex: safeDecodeURIComponent($(this).closest('.acu-global-interaction-row').attr('data-row-index') || ''),
        targetTag: event.target instanceof Element ? event.target.tagName : '',
        targetClass: event.target instanceof Element ? String(event.target.className || '') : '',
        defaultPreventedBefore: event.isDefaultPrevented(),
      });
      event.stopPropagation();
      event.preventDefault();
      toggleGlobalInteractionRow($(this).closest<HTMLElement>('.acu-global-interaction-row'));
    });

    const handleGlobalInteractionActionClick = function (this: HTMLElement, e: JQuery.ClickEvent): void {
      e.stopPropagation();
      e.preventDefault();

      const target = resolveFreshInteractionTarget($(this));
      if (!target) {
        showInvalidInteractionWarning();
        return;
      }

      executeTableInteractionAction(target.action, target.headers, target.rowData);
    };

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-action', handleGlobalInteractionActionClick);
    $(panelDocument).on(
      'click.globalInteractionEvents',
      '.acu-global-interaction-floating-host .acu-global-interaction-action',
      handleGlobalInteractionActionClick,
    );

    $panel.on(
      'click.globalInteractionEvents',
      '.acu-panel-tutorial-btn[data-tutorial-scope="globalInteractions"]',
      function (e) {
        e.stopPropagation();
        e.preventDefault();
        startTutorialFromButton(this);
      },
    );

    $panel.on('click.globalInteractionEvents', '.acu-global-interaction-rules-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      showActionPresetManager();
    });

    bindTutorialButtonsIn($panel);
  };

  // [新增] 绑定变更面板事件
  const bindChangesEvents = () => {
    const { $ } = getCore();
    const getChangesPanel = (): JQuery<HTMLElement> => {
      const $panel = $('.acu-changes-content').closest<HTMLElement>('.acu-data-display').first();
      if ($panel.length) return $panel;
      return $('#acu-data-area').first() as JQuery<HTMLElement>;
    };

    const resolveChangesPanelJumpTarget = ($item: JQuery): { tableName: string; rowIndex: number } | null => {
      const tableNameFromItem = String($item.data('table') ?? '');
      const tableKey = String($item.data('table-key') || '').trim();
      const rawRowIndex = $item.data('row') ?? $item.data('row-index');
      const rowIndex = Number.parseInt(String(rawRowIndex ?? ''), 10);
      let tableName = tableNameFromItem;

      if (!tableName && tableKey) {
        const rawData = getCachedRawData() || getTableData();
        tableName = String(rawData?.[tableKey]?.name ?? '');
      }

      if (!tableName || !Number.isInteger(rowIndex) || rowIndex < 0) return null;
      return { tableName, rowIndex };
    };

    const jumpToChangesPanelTarget = ($item: JQuery) => {
      const target = resolveChangesPanelJumpTarget($item);
      if (!target) {
        if (window.toastr) window.toastr.warning('无法定位该变更对应的表格行');
        return;
      }
      const tableName = resolveExistingTableName(target.tableName);
      if (!tableName) {
        warnMissingTableTarget(target.tableName);
        return;
      }

      Store.set('acu_changes_panel_active', false);
      Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
      Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
      Store.set('acu_favorites_panel_active', false);
      saveActiveTabState(tableName);
      setActiveTableNavButton(tableName);
      renderInterface();

      setTimeout(() => {
        const $targetCard = $(`.acu-data-card[data-row-index="${target.rowIndex}"]`);
        if ($targetCard.length) {
          $targetCard[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          $targetCard.addClass('acu-highlight-flash');
          setTimeout(() => $targetCard.removeClass('acu-highlight-flash'), 2000);
        }
      }, 300);
    };

    // 关闭按钮
    $('.acu-changes-content')
      .closest('.acu-data-display')
      .find('.acu-close-btn')
      .off('click')
      .on('click', function () {
        Store.set('acu_changes_panel_active', false);
        const $panel = getChangesPanel();
        closePanel($panel.closest<HTMLElement>(DICE_ROOT_SELECTOR));
      });

    // === 触摸滑动检测阈值（用于区分滑动和点击）===
    const TOUCH_MOVE_THRESHOLD = 10; // 移动超过10px视为滑动

    // === 验证错误：回滚按钮（恢复快照值）===
    $('.acu-validation-error-item .acu-action-reject')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-validation-error-item');
        const tableName = $item.data('table');
        const rowIndex = parseInt($item.data('row'), 10);
        const columnName = $item.data('column');

        if (rowIndex < 0) {
          if (window.toastr) window.toastr.warning('整表级验证项仅标注，不支持快捷回滚');
          return;
        }

        const snapshot = loadSnapshot();
        if (!snapshot) {
          if (window.toastr) window.toastr.warning('无快照数据可恢复');
          return;
        }

        try {
          const rawData = getCachedRawData() || getTableData();
          for (const sheetId in rawData) {
            if (rawData[sheetId]?.name === tableName && snapshot[sheetId]) {
              const headers = rawData[sheetId].content?.[0] || [];
              const colIdx = headers.indexOf(columnName);
              if (
                colIdx >= 0 &&
                rawData[sheetId].content?.[rowIndex + 1] &&
                snapshot[sheetId].content?.[rowIndex + 1]
              ) {
                const snapshotValue = snapshot[sheetId].content[rowIndex + 1][colIdx];
                const nextRow = [...rawData[sheetId].content[rowIndex + 1]];
                nextRow[colIdx] = snapshotValue;
                await saveRowInstantly(sheetId, rowIndex, nextRow);
                renderInterface();
                return;
              }
              break;
            }
          }
          if (window.toastr) window.toastr.warning('无法找到对应的快照数据');
        } catch (err) {
          console.error('[DICE]ACU 恢复快照值失败:', err);
          if (window.toastr) showActionableErrorToast('恢复失败', { suggestion: 'save' });
        }
      });

    // === 验证错误：编辑按钮（智能修改）===
    $('.acu-validation-error-item .acu-action-edit')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-validation-error-item');
        const ruleData = $item.data('rule-data');
        if (!ruleData) {
          if (window.toastr) window.toastr.warning('无法获取规则信息');
          return;
        }
        try {
          const parsed = typeof ruleData === 'string' ? JSON.parse(ruleData) : ruleData;
          const error = {
            ruleId: parsed.ruleId,
            ruleType: parsed.ruleType,
            rule: parsed.rule,
            tableName: $item.data('table') || parsed.tableName || '',
            rowIndex: parseInt($item.data('row'), 10) || parsed.rowIndex || 0,
            columnName: $item.data('column') || parsed.columnName || '',
            currentValue: parsed.currentValue || '',
            rowTitle: parsed.rowTitle || '', // 添加 rowTitle 到错误对象
            ruleName: parsed.ruleName || parsed.rule?.name || '',
            errorMessage: parsed.errorMessage || parsed.rule?.errorMessage || '',
          };
          showSmartFixModal(error);
        } catch (err) {
          console.error('[DICE]ACU 解析规则数据失败:', err);
          if (window.toastr) showActionableErrorToast('解析规则数据失败', { developerHint: true });
        }
      });

    // === 验证错误项：点击定位（但按钮区域除外，且区分滑动和点击）===
    let validationItemTouchStartPos: { x: number; y: number } | null = null;

    $('.acu-validation-error-item')
      .off('click touchstart touchend touchmove')
      .on('touchstart', function (e) {
        const touch = (e.originalEvent as TouchEvent).touches[0];
        validationItemTouchStartPos = { x: touch.clientX, y: touch.clientY };
      })
      .on('touchmove', function (e) {
        if (!validationItemTouchStartPos) return;
        const touch = (e.originalEvent as TouchEvent).touches[0];
        const deltaX = Math.abs(touch.clientX - validationItemTouchStartPos.x);
        const deltaY = Math.abs(touch.clientY - validationItemTouchStartPos.y);
        // 如果移动超过阈值，清除起始位置，表示这是滑动
        if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
          validationItemTouchStartPos = null;
        }
      })
      .on('touchend', function (e) {
        // 如果触摸位置已被清除（滑动），不触发点击
        if (!validationItemTouchStartPos) return;
        validationItemTouchStartPos = null;

        // 如果点击的是按钮区域，不触发定位
        if ($(e.target).closest('.acu-change-actions, .acu-change-action-btn').length) {
          return;
        }

        // [新增] 检查是否为数据验证模式下的验证错误项
        const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
        if (isValidationMode) {
          // 数据验证模式下的验证项不跳转
          return;
        }

        jumpToChangesPanelTarget($(this));
      })
      .on('click', function (e) {
        // 桌面端仍使用 click 事件
        // 如果点击的是按钮区域，不触发定位
        if ($(e.target).closest('.acu-change-actions, .acu-change-action-btn').length) {
          return;
        }

        // 检测是否是触摸设备，如果是则 touchend 已处理
        if ('ontouchstart' in window) return;

        // [新增] 检查是否为数据验证模式下的验证错误项
        const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
        if (isValidationMode) {
          // 数据验证模式下的验证项不跳转
          return;
        }

        jumpToChangesPanelTarget($(this));
      });

    // 折叠/展开分组（根据模式使用不同的存储键）
    $('.acu-changes-group-header')
      .off('click')
      .on('click', function (e) {
        if ($(e.target).closest('.acu-change-item').length) return;

        const tableName = $(this).data('table');
        const $group = $(this).closest('.acu-changes-group');
        const $body = $group.find('.acu-changes-group-body');
        const $icon = $(this).find('.acu-collapse-icon');

        // 根据是否是数据验证模式使用不同的存储键
        const isValidationMode = $(this).hasClass('acu-validation-group-header');
        const storageKey = isValidationMode ? 'acu_validation_collapsed_groups' : 'acu_changes_collapsed_groups';
        let collapsedGroups = Store.get(storageKey, []);

        if ($group.hasClass('collapsed')) {
          $group.removeClass('collapsed');
          $body.slideDown(200);
          $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
          collapsedGroups = collapsedGroups.filter(n => n !== tableName);
        } else {
          $group.addClass('collapsed');
          $body.slideUp(200);
          $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
          if (!collapsedGroups.includes(tableName)) {
            collapsedGroups.push(tableName);
          }
        }

        Store.set(storageKey, collapsedGroups);
      });

    // === 单项操作：接受（完整面板变更条目）===
    $('.acu-change-item .acu-action-accept')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const colIndex = $item.data('col-index');

        const snapshot = loadSnapshot();
        const rawData = getCachedRawData() || getTableData();
        if (!snapshot || !rawData) return;
        if (['table_deleted', 'table_added', 'table_structure_changed'].includes(changeType)) {
          if (window.toastr) window.toastr.warning('整表/结构级变更仅标注，不支持快捷接受');
          return;
        }

        const rawSheet = getDiffSheetByKey(rawData, tableKey);
        const snapshotEntry = findDiffSnapshotEntry(snapshot, tableKey, rawSheet);
        const rawEntry = findDiffSnapshotEntry(rawData, tableKey, snapshotEntry?.sheet || rawSheet);
        if (!rawEntry?.sheet || !snapshotEntry?.sheet) {
          if (window.toastr) window.toastr.warning('找不到对应表格，无法快捷接受该变更');
          return;
        }

        if (changeType === 'cell_modified') {
          // 接受单元格修改：将新值写入快照
          const currentRow = getDiffDataRow(rawEntry.sheet, rowIndex);
          if (currentRow) setDiffDataCell(snapshotEntry.sheet, rowIndex, colIndex, currentRow[colIndex]);
        } else if (changeType === 'row_modified') {
          // 接受整行修改：将整行新值写入快照
          const currentRow = getDiffDataRow(rawEntry.sheet, rowIndex);
          if (currentRow) setDiffDataRow(snapshotEntry.sheet, rowIndex, currentRow);
        } else if (changeType === 'row_added') {
          // 接受新增行：将新行写入快照
          const currentRow = getDiffDataRow(rawEntry.sheet, rowIndex);
          if (currentRow) setDiffDataRow(snapshotEntry.sheet, rowIndex, currentRow);
        } else if (changeType === 'row_deleted') {
          // 接受删除：从快照中也删除该行
          removeDiffDataRow(snapshotEntry.sheet, rowIndex);
        }

        saveSnapshot(snapshot);

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          refreshChangesPanel();
        });
      });

    // === 单项操作：拒绝（完整面板变更条目）===
    $('.acu-change-item .acu-action-reject')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const colIndex = $item.data('col-index');
        const oldValue = safeDecodeURIComponent($item.data('old-value') || '');

        const snapshot = loadSnapshot();
        let rawData = getCachedRawData() || getTableData();
        if (!snapshot || !rawData) return;

        const snapshotEntry = findDiffSnapshotEntry(snapshot, tableKey, getDiffSheetByKey(rawData, tableKey));
        const rawEntry = findDiffSnapshotEntry(
          rawData,
          tableKey,
          snapshotEntry?.sheet || getDiffSheetByKey(rawData, tableKey),
        );
        if (!rawEntry?.sheet) {
          if (window.toastr) window.toastr.warning('找不到当前表格，无法快捷拒绝该变更');
          return;
        }

        if (changeType === 'cell_modified') {
          // 拒绝单元格修改：恢复为快照中的旧值
          const currentRow = getDiffDataRow(rawEntry.sheet, rowIndex);
          if (!currentRow) return;
          const nextRow = [...currentRow];
          nextRow[colIndex] = oldValue;
          await saveRowInstantly(rawEntry.key || tableKey, rowIndex, nextRow);
        } else if (changeType === 'row_modified') {
          // 拒绝整行修改：从快照恢复整行
          const snapshotRow = getDiffDataRow(snapshotEntry?.sheet, rowIndex);
          if (!snapshotRow) return;
          await saveRowInstantly(rawEntry.key || tableKey, rowIndex, [...snapshotRow]);
        } else if (changeType === 'row_added') {
          // 拒绝新增行：从数据中删除该行
          await deleteRowInstantly(rawEntry.key || tableKey, rowIndex);
        }

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          refreshChangesPanel();
        });
      });

    // === 单项操作：恢复（用于已删除的行/表）===
    $('.acu-action-restore')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');

        const snapshot = loadSnapshot();
        let rawData = getCachedRawData() || getTableData();
        if (!snapshot || !rawData) return;

        if (changeType === 'row_deleted') {
          // 恢复删除的行：从快照中取回该行
          const snapshotEntry = findDiffSnapshotEntry(snapshot, tableKey, getDiffSheetByKey(rawData, tableKey));
          const rawEntry = findDiffSnapshotEntry(rawData, tableKey, snapshotEntry?.sheet);
          const restoredRow = getDiffDataRow(snapshotEntry?.sheet, rowIndex);
          if (!rawEntry?.sheet?.content || !restoredRow) {
            if (window.toastr) window.toastr.warning('找不到对应表格，无法快捷恢复该行');
            return;
          }
          await appendRowInstantly(rawEntry.key || tableKey, [...restoredRow]);
        } else if (changeType === 'table_deleted') {
          if (window.toastr) window.toastr.warning('整表级变更仅标注，不支持快捷恢复');
          return;
        }

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          refreshChangesPanel();
        });
      });

    // === 单项操作：编辑（完整面板变更条目，排除验证错误项）===
    $('.acu-change-item:not(.acu-validation-error-item) .acu-action-edit')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const changeType = $item.data('change-type');

        if (!tableKey || rowIndex === undefined) return;

        const rawData = getCachedRawData() || getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const sheet = rawData[tableKey];
        const headers = sheet.content ? sheet.content[0] : [];
        const row = sheet.content ? sheet.content[rowIndex + 1] : null;

        if (!row) {
          if (window.toastr) window.toastr.warning('该行可能已被删除');
          return;
        }

        // 根据变更类型选择编辑方式
        if (changeType === 'row_modified') {
          // 多字段修改，打开整体编辑
          showRowCompareEditModal(row, headers, sheet.name || '编辑', rowIndex, tableKey);
        } else if (changeType === 'cell_modified') {
          const colIndex = $item.data('col-index');
          const headerName = headers[colIndex] || `列${colIndex}`;
          const cellValue = row[colIndex] || '';
          showChangeSingleFieldModal(cellValue, headerName, sheet.name, rowIndex, colIndex, tableKey);
        } else {
          showChangeEditModal(row, headers, sheet.name || '编辑', rowIndex, tableKey);
        }
      });

    // === 批量操作：接受全部 ===
    $('.acu-batch-accept')
      .off('click')
      .on('click', async function () {
        const rawData = getCachedRawData() || getTableData();
        if (!rawData) return;
        const snapshot = loadSnapshot();
        const hasStructuralDiff =
          snapshot &&
          (Object.keys(snapshot).some(key => key.startsWith('sheet_') && !rawData[key]) ||
            Object.keys(rawData).some(key => key.startsWith('sheet_') && !snapshot[key]) ||
            Object.keys(rawData).some(
              key =>
                key.startsWith('sheet_') &&
                snapshot[key]?.content &&
                rawData[key]?.content &&
                JSON.stringify(snapshot[key].content[0] || []) !== JSON.stringify(rawData[key].content[0] || []),
            ));
        if (hasStructuralDiff) {
          if (window.toastr) window.toastr.warning('存在整表/结构级变更，批量接受已跳过；请先处理可安全的行/格变更');
          return;
        }

        // 将当前数据完整保存为新快照
        saveSnapshot(JSON.parse(JSON.stringify(rawData)));
        setCurrentDiffMap(new Set());

        // 刷新面板
        refreshChangesPanel();
      });

    // === 批量操作：拒绝全部 ===
    $('.acu-batch-reject')
      .off('click')
      .on('click', async function () {
        const snapshot = loadSnapshot();
        if (!snapshot) {
          if (window.toastr) window.toastr.warning('无快照数据');
          return;
        }
        const rawData = getCachedRawData() || getTableData();
        const hasStructuralDiff =
          rawData &&
          (Object.keys(snapshot).some(key => key.startsWith('sheet_') && !rawData[key]) ||
            Object.keys(rawData).some(key => key.startsWith('sheet_') && !snapshot[key]) ||
            Object.keys(rawData).some(
              key =>
                key.startsWith('sheet_') &&
                snapshot[key]?.content &&
                rawData[key]?.content &&
                JSON.stringify(snapshot[key].content[0] || []) !== JSON.stringify(rawData[key].content[0] || []),
            ));
        if (hasStructuralDiff) {
          if (window.toastr) window.toastr.warning('存在整表/结构级变更，批量拒绝已跳过；请逐项处理可安全的行/格变更');
          return;
        }

        // 将快照数据恢复为当前数据
        const restoredData = JSON.parse(JSON.stringify(snapshot));
        await saveDataToDatabase(restoredData, false, false);
      });

    // === 简洁模式切换 ===
    $('.acu-simple-mode-toggle')
      .off('click')
      .on('click', function () {
        const currentMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
        const newMode = !currentMode;
        Store.set(STORAGE_KEY_VALIDATION_MODE, newMode);

        // 刷新面板
        const rawData = getCachedRawData() || getTableData();
        getChangesPanel().html(renderChangesPanel(rawData));
        bindChangesEvents();

        // 更新导航栏计数
        updateChangesCount(rawData);
      });

    // === 高度拖动调节 ===
    $('.acu-changes-content')
      .closest('.acu-data-display')
      .find('.acu-height-drag-handle')
      .off('pointerdown')
      .on('pointerdown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const handle = this;
        handle.setPointerCapture(e.pointerId);
        $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
        const $panel = getChangesPanel();
        const startHeight = getPanelDragStartHeight($panel);
        let requestedHeight = startHeight;
        const startY = e.clientY;
        const tableName = $(handle).data('table');

        handle.onpointermove = function (moveE) {
          const dy = moveE.clientY - startY;
          requestedHeight = setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
        };
        handle.onpointerup = function (upE) {
          $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
          handle.releasePointerCapture(upE.pointerId);
          handle.onpointermove = null;
          handle.onpointerup = null;
          // 保存高度
          savePanelRequestedHeight(tableName, requestedHeight);
        };
      })
      .off('dblclick')
      .on('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const $panel = getChangesPanel();
        resetPanelRequestedHeight($panel, tableName);
      });

    // === 横向模式：智能区分横向和竖向滑动 ===
    const $horizontalScroller = $('.acu-changes-content.acu-changes-horizontal');
    if ($horizontalScroller.length) {
      $horizontalScroller[0].addEventListener(
        'touchstart',
        function (e) {
          this._touchStartX = e.touches[0].clientX;
          this._touchStartY = e.touches[0].clientY;
          this._scrollDirection = null; // 重置滚动方向
        },
        { passive: true },
      );

      $horizontalScroller[0].addEventListener(
        'touchmove',
        function (e) {
          if (!this._touchStartX) return;

          const deltaX = Math.abs(e.touches[0].clientX - this._touchStartX);
          const deltaY = Math.abs(e.touches[0].clientY - this._touchStartY);

          // 第一次移动时确定主滚动方向
          if (!this._scrollDirection && (deltaX > 5 || deltaY > 5)) {
            this._scrollDirection = deltaX > deltaY ? 'horizontal' : 'vertical';
          }

          // 只在明确是横向滚动时才阻止事件传播
          // 竖向滚动时不做任何干预，让其自然触发页面滚动
          if (this._scrollDirection === 'horizontal' && deltaX > 10) {
            e.stopPropagation();
          }
        },
        { passive: false },
      );

      $horizontalScroller[0].addEventListener(
        'touchend',
        function () {
          this._touchStartX = null;
          this._touchStartY = null;
          this._scrollDirection = null;
        },
        { passive: true },
      );

      $horizontalScroller.off('wheel.acuHorizontalScroll').on('wheel.acuHorizontalScroll', function (e) {
        const event = e.originalEvent as WheelEvent | undefined;
        if (!event) return;

        const deltaX = Math.abs(event.deltaX);
        const deltaY = Math.abs(event.deltaY);
        const isHorizontalWheel = deltaX > 0 && deltaX >= deltaY;
        const isShiftWheel = event.shiftKey && deltaY > 0;
        if (!isHorizontalWheel && !isShiftWheel) return;

        const scroller = this as HTMLElement;
        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        if (maxScrollLeft <= 0) return;

        const rawDelta = isHorizontalWheel ? event.deltaX : event.deltaY;
        const deltaUnit =
          event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? scroller.clientWidth
            : event.deltaMode === WheelEvent.DOM_DELTA_LINE
              ? 16
              : 1;
        const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, scroller.scrollLeft + rawDelta * deltaUnit));
        if (nextScrollLeft === scroller.scrollLeft) return;

        e.preventDefault();
        e.stopPropagation();
        scroller.scrollLeft = nextScrollLeft;
      });
    }
  };

  // [新增] 刷新变更面板（辅助函数）
  const refreshChangesPanel = () => {
    const { $ } = getCore();
    const rawData = getCachedRawData() || getTableData();
    setCurrentDiffMap(generateDiffMap(rawData));

    const $panel = $('#acu-data-area');
    if ($panel.length && Store.get('acu_changes_panel_active', false)) {
      $panel.html(renderChangesPanel(rawData));
      bindChangesEvents();

      // 更新导航栏计数
      updateChangesCount(rawData);
    }
  };

  // [新增] 更新审核按钮计数（包含变更数 + 验证错误数）
  const updateChangesCount = rawData => {
    const { $ } = getCore();
    const snapshot = loadSnapshot();
    const changesCount = countRuntimeDataChanges(snapshot, rawData);

    // 获取验证错误数量
    const validationErrorCount = rawData ? ValidationEngine.getErrorCount(rawData) : 0;

    // 根据模式决定显示的数量：数据验证模式只计错误数，完整审核模式只计变更数
    const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
    const displayCount = isValidationMode ? validationErrorCount : changesCount;
    // 警告图标只在数据验证模式下且有错误时显示
    const showWarningIcon = isValidationMode && validationErrorCount > 0;

    const $btn = $('#acu-btn-changes');
    const $span = $btn.find('span');
    $span.html(displayCount > 0 ? `审核(${displayCount})` : '审核');

    // 更新警告图标
    if (showWarningIcon) {
      if (!$btn.find('.acu-nav-warning-icon').length) {
        $span.append(' <i class="fa-solid fa-triangle-exclamation acu-nav-warning-icon"></i>');
      }
      $btn.addClass('has-validation-errors');
    } else {
      $btn.find('.acu-nav-warning-icon').remove();
      $btn.removeClass('has-validation-errors');
    }
  };
  // [新增] 变更面板专用编辑弹窗（保存后只更新单行快照）
  const showChangeEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();

    const inputsHtml = row
      .map((cell, idx) => {
        if (idx === 0) return '';
        const headerName = headers[idx] || `列 ${idx}`;
        const val = cell || '';
        return `
                <div class="acu-card-edit-field">
                    <label class="acu-card-edit-label">${escapeHtml(headerName)}</label>
                    <textarea class="acu-card-edit-input acu-card-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${escapeHtml(val)}</textarea>
                </div>`;
      })
      .join('');

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">编辑变更 (#${rowIndex + 1} - ${escapeHtml(tableName)})</div>
                    <div class="acu-settings-content acu-settings-content-scroll">
                        ${inputsHtml}
                    </div>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-change-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-change-save"><i class="fa-solid fa-check"></i> 保存并确认</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // [修复] 自动高度调节逻辑
    const adjustHeight = el => {
      // 关键修复：使用 auto 而不是 0px，防止布局塌陷并正确获取 scrollHeight
      el.style.height = 'auto';
      const contentHeight = el.scrollHeight + 2;
      const maxHeight = 500;
      el.style.height = Math.min(contentHeight, maxHeight) + 'px';
      el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
    };

    // 1. 初始化时：使用 requestAnimationFrame 确保在 DOM 渲染后执行
    requestAnimationFrame(() => {
      dialog.find('textarea').each(function () {
        adjustHeight(this);
      });
    });

    // 2. 输入时：实时调整
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    const closeDialog = () => {
      setIsSettingsOpen(false);
      dialog.remove();
    };
    dialog.find('#dlg-change-cancel').click(closeDialog);
    setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    dialog.find('#dlg-change-save').click(async () => {
      let rawData = getCachedRawData() || getTableData();
      if (rawData && rawData[tableKey]) {
        const currentRow = rawData[tableKey]?.content?.[rowIndex + 1];
        if (!currentRow) {
          closeDialog();
          return;
        }

        const nextRow = [...currentRow];
        let hasChanges = false;
        dialog.find('textarea').each(function () {
          const colIdx = parseInt($(this).data('col'));
          const newVal = $(this).val();
          if (String(nextRow[colIdx]) !== String(newVal)) {
            hasChanges = true;
            nextRow[colIdx] = newVal;
          }
        });

        if (hasChanges) {
          // 1. 保存到数据库（不更新快照）
          try {
            await saveRowInstantly(tableKey, rowIndex, nextRow, {
              tableName,
              headers,
              currentRow,
              sourceData: rawData,
              sheet: rawData?.[tableKey],
            });
          } catch (e) {
            console.error('[DICE]ACU 保存失败:', e);
            let errorMessage = e.message || '保存出错，请检查数据格式和大小';
            // 检查是否是 "Settings could not be saved" 相关的错误
            const errorMsg = String(e);
            if (
              errorMsg.includes('Settings could not be saved') ||
              errorMsg.includes('server connection') ||
              errorMsg.includes('data loss')
            ) {
              errorMessage = '保存失败：服务器连接问题或数据过大，请检查网络连接或减少数据量';
            }
            if (window.toastr) {
              showActionableErrorToast(errorMessage, { title: '保存失败', suggestion: 'save', toastrOptions: { timeOut: 7000 } });
            } else {
              void showDiceSystemConfirmDialog({
                title: '保存失败',
                message: errorMessage,
                iconClass: 'fa-triangle-exclamation',
                confirmText: '知道了',
                tone: 'danger',
                hideCancel: true,
              });
            }
            // 保存失败时不关闭对话框，让用户重试
            return;
          }

          // 2. 只更新快照中这一行（关键！）
          const snapshot = loadSnapshot();
          const snapshotEntry = snapshot ? findDiffSnapshotEntry(snapshot, tableKey, rawData[tableKey]) : null;
          if (setDiffDataRow(snapshotEntry?.sheet, rowIndex, normalizeDiffRow(nextRow))) {
            saveSnapshot(snapshot);
          }

          // 3. 重新计算 diffMap 并刷新变更面板
          const latestRawData = getCachedRawData() || getTableData() || rawData;
          setCurrentDiffMap(generateDiffMap(latestRawData));

          // 4. 刷新变更面板
          const $panel = $('#acu-data-area');
          $panel.html(renderChangesPanel(latestRawData));
          bindChangesEvents();
        }
      }
      closeDialog();
    });
  };
  // [新增] 变更面板专用单字段编辑弹窗
  const showChangeSingleFieldModal = (value, headerName, tableName, rowIndex, colIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();

    // 获取快照中的旧值
    const snapshot = loadSnapshot();
    const currentRawData = getCachedRawData() || getTableData();
    const snapshotEntry = snapshot
      ? findDiffSnapshotEntry(snapshot, tableKey, getDiffSheetByKey(currentRawData, tableKey))
      : null;
    const oldRow = getDiffDataRow(snapshotEntry?.sheet, rowIndex);
    const oldValue = String(oldRow?.[colIndex] ?? '');
    const hasOldValue = oldValue !== '' && String(oldValue) !== String(value);

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}" style="max-width:450px;">
                    <div class="acu-edit-title">编辑: ${escapeHtml(tableName)} - ${escapeHtml(headerName)}</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
                        ${
                          hasOldValue
                            ? `
                        <div class="acu-diff-section acu-diff-old-section">
                            <div class="acu-diff-label">
                                <i class="fa-solid fa-clock-rotate-left"></i> 原始值（快照）
                            </div>
                            <div class="acu-diff-readonly">${escapeHtml(oldValue)}</div>
                        </div>
                        <div class="acu-diff-arrow-down">
                            <i class="fa-solid fa-arrow-down"></i>
                        </div>
                        `
                            : ''
                        }
                        <div class="acu-diff-section acu-diff-new-section">
                            <div class="acu-diff-label">
                                <i class="fa-solid fa-pen"></i> ${hasOldValue ? '当前值（可编辑）' : '内容'}
                            </div>
                            <textarea class="acu-change-single-input acu-edit-textarea" spellcheck="false"
                                style="width:100%;min-height:60px;max-height:300px;padding:12px;resize:none;">${escapeHtml(value)}</textarea>
                        </div>
                    </div>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-single-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        ${hasOldValue ? `<button type="button" class="acu-dialog-btn acu-btn-revert" id="dlg-single-revert"><i class="fa-solid fa-rotate-left"></i> 恢复原值</button>` : ''}
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-single-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // 自动高度
    const $textarea = dialog.find('.acu-change-single-input');
    const adjustHeight = () => {
      $textarea[0].style.height = 'auto';
      const h = Math.max(60, Math.min($textarea[0].scrollHeight + 2, 300));
      $textarea[0].style.height = h + 'px';
    };
    setTimeout(adjustHeight, 0);
    $textarea.on('input', adjustHeight);
    $textarea.focus();

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-single-cancel').click(closeDialog);
    setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    // [新增] 恢复原值按钮
    dialog.find('#dlg-single-revert').click(function () {
      $textarea.val(oldValue).trigger('input');
    });

    dialog.find('#dlg-single-save').click(async () => {
      const newVal = $textarea.val();
      let rawData = getCachedRawData() || getTableData();

      if (rawData && rawData[tableKey] && rawData[tableKey].content) {
        const currentRow = rawData[tableKey].content[rowIndex + 1];
        if (currentRow && String(currentRow[colIndex]) !== String(newVal)) {
          const nextRow = [...currentRow];
          nextRow[colIndex] = newVal;
          await saveRowInstantly(tableKey, rowIndex, nextRow, {
            tableName,
            headers: rawData[tableKey].content[0] || [],
            currentRow,
            sourceData: rawData,
            sheet: rawData[tableKey],
          });

          // 只更新快照中这一个单元格
          const snapshot = loadSnapshot();
          const snapshotEntry = snapshot ? findDiffSnapshotEntry(snapshot, tableKey, rawData[tableKey]) : null;
          if (setDiffDataCell(snapshotEntry?.sheet, rowIndex, colIndex, newVal)) {
            saveSnapshot(snapshot);
          }

          // 刷新
          setCurrentDiffMap(generateDiffMap(getCachedRawData() || getTableData() || rawData));
          refreshChangesPanel();
        }
      }
      closeDialog();
    });
  };

  // [新增] 多字段变更整体对比编辑弹窗
  const showRowCompareEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();

    // 获取快照中的旧行
    const snapshot = loadSnapshot();
    const currentRawData = getCachedRawData() || getTableData();
    const snapshotEntry = snapshot
      ? findDiffSnapshotEntry(snapshot, tableKey, getDiffSheetByKey(currentRawData, tableKey))
      : null;
    const oldRow = getDiffDataRow(snapshotEntry?.sheet, rowIndex) || [];

    // 构建字段对比列表
    let fieldsHtml = '';
    for (let idx = 1; idx < headers.length; idx++) {
      const headerName = headers[idx] || `列 ${idx}`;
      const oldVal = oldRow[idx] ?? '';
      const newVal = row[idx] ?? '';
      const isChanged = String(oldVal) !== String(newVal);

      fieldsHtml += `
                <div class="acu-row-edit-field ${isChanged ? 'acu-field-changed' : ''}">
                    <div class="acu-row-edit-label">${escapeHtml(headerName)} ${isChanged ? '<span class="acu-changed-badge">已改</span>' : ''}</div>
                    ${isChanged ? `<div class="acu-row-edit-old">${escapeHtml(oldVal) || '<span class="acu-empty-val">(空)</span>'}</div>` : ''}
                    <textarea class="acu-row-edit-input acu-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${escapeHtml(newVal)}</textarea>
                </div>
            `;
    }

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}" style="max-width:550px;">
                    <div class="acu-edit-title">整体编辑: ${escapeHtml(tableName)} - ${escapeHtml(row[1] || '行 ' + (rowIndex + 1))}</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px; max-height:60vh;">
                        ${fieldsHtml}
                    </div>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-row-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button type="button" class="acu-dialog-btn" id="dlg-row-revert"><i class="fa-solid fa-rotate-left"></i> 全部恢复</button>
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-row-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // 自动高度
    const adjustHeight = el => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight + 2, 200) + 'px';
    };
    dialog.find('textarea').each(function () {
      adjustHeight(this);
    });
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-row-cancel').click(closeDialog);
    setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    // 全部恢复
    dialog.find('#dlg-row-revert').click(function () {
      dialog.find('textarea').each(function () {
        const colIdx = parseInt($(this).data('col'));
        $(this)
          .val(oldRow[colIdx] ?? '')
          .trigger('input');
      });
    });

    // 保存
    dialog.find('#dlg-row-save').click(async () => {
      let rawData = getCachedRawData() || getTableData();
      if (!rawData?.[tableKey]?.content?.[rowIndex + 1]) {
        closeDialog();
        return;
      }

      const currentRow = rawData[tableKey].content[rowIndex + 1];
      const nextRow = [...currentRow];
      let hasChanges = false;

      dialog.find('textarea').each(function () {
        const colIdx = parseInt($(this).data('col'));
        const newVal = $(this).val();
        if (String(nextRow[colIdx]) !== String(newVal)) {
          hasChanges = true;
          nextRow[colIdx] = newVal;
        }
      });

      if (hasChanges) {
        await saveRowInstantly(tableKey, rowIndex, nextRow, {
          tableName,
          headers,
          currentRow,
          sourceData: rawData,
          sheet: rawData[tableKey],
        });

        // 更新快照中这一行
        const snapshot = loadSnapshot();
        const snapshotEntry = snapshot ? findDiffSnapshotEntry(snapshot, tableKey, rawData[tableKey]) : null;
        if (setDiffDataRow(snapshotEntry?.sheet, rowIndex, normalizeDiffRow(nextRow))) {
          saveSnapshot(snapshot);
        }

        setCurrentDiffMap(generateDiffMap(getCachedRawData() || getTableData() || rawData));
        refreshChangesPanel();
      }
      closeDialog();
    });
  };
  const renderDashboard = allTables => {
    console.info('[DICE]开始抓取仪表盘数据...');
    // 重建角色名别名注册表
    NameAliasRegistry.rebuild(allTables);
    const config = getConfig();

    // [重构] 使用统一配置中心查找表格
    const globalResult = DashboardDataParser.findTable(allTables, 'global');
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    const locationResult = DashboardDataParser.findTable(allTables, 'location');
    const questResult = DashboardDataParser.findTable(allTables, 'quest');
    const bagResult = DashboardDataParser.findTable(allTables, 'bag');
    const equipResult = DashboardDataParser.findTable(allTables, 'equip');

    // [重构] 主角数据 - 使用新解析器
    let player = { name: '主角', status: '正常', position: '', attrs: '', money: '0' };
    const playerParsed = DashboardDataParser.parseRows(playerResult, 'player');

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
      const detailIdx = DashboardDataParser.findColumnIndex(headers, 'detailLocation', globalResult.config);
      if (detailIdx >= 0 && row[detailIdx]) {
        globalDetailLocation = row[detailIdx];
      }

      // 备选：次要地区
      const locIdx = DashboardDataParser.findColumnIndex(headers, 'currentLocation', globalResult.config);
      globalLocation = locIdx >= 0 && row[locIdx] ? row[locIdx] : row[2] || '';
    }

    // currentPlaceName 优先使用详细地点，其次次要地区，最后从主角位置提取
    let currentPlaceName =
      globalDetailLocation ||
      globalLocation ||
      (player.position.includes('-') ? player.position.split('-')[0].trim() : player.position);

    // [重构] NPC数据 - 角色区优先复用人物关系图 sources，可拼接多个来源
    const npcListData = getDashboardNpcListData(allTables);
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
    const questParsed = DashboardDataParser.parseRows(questResult, 'quest');

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

    const bagParsed = DashboardDataParser.parseRows(bagResult, 'bag');
    let bagItems = bagParsed.map(item => ({
      name: item.name || '未知物品',
      count: item.count || '1',
      type: item.type || '',
    }));

    // [重构] 装备数据 - 使用新解析器 + 过滤器
    const equipTableName = equipResult?.name || '装备表';

    const equipParsed = DashboardDataParser.parseRows(equipResult, 'equip');
    const equippedParsed = DashboardDataParser.applyFilter(equipParsed, 'equipped', 'equip');

    let equippedItems = equippedParsed.map(e => ({
      name: e.name || '未知装备',
      type: e.type || '',
      part: e.part || '',
    }));
    // [重构] 地点数据 - 使用新解析器
    const locationTableName = locationResult?.name || '世界地图点';
    const locationTableKey = locationResult?.key || '';

    const locationParsed = DashboardDataParser.parseRows(locationResult, 'location');

    // 构建HTML
    let html = `
        <div class="acu-panel-header">
            <div class="acu-panel-title">
                <div class="acu-title-main"><i class="fa-solid fa-chart-line"></i> <span class="acu-title-text">仪表盘</span></div>
                <div class="acu-title-sub">综合状态总览</div>
            </div>
            <div class="acu-header-actions acu-dashboard-header-actions">
                ${getTutorialButtonHtml('core', '播放核心引导教程', 'acu-dashboard-tutorial-btn')}
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
                        <span><i class="fa-solid fa-user-circle"></i> ${escapeHtml(replaceUserPlaceholders(getDisplayName(player.name)))}</span>
                        <span class="acu-dash-status-badge" title="${escapeHtml(player.status)}">${escapeHtml(player.status.length > 6 ? player.status.substring(0, 6) + '..' : player.status)}</span>
                    </h3>
                    ${(() => {
                      // 解析资源数据
                      const resourcesStr = player.resources || player.money || '';
                      const parsedResources = parseAttributeString(resourcesStr);

                      // 分别收集基础属性和特有属性
                      let baseAttrs = [];
                      let specialAttrs = [];
                      if (playerRows.length > 0 && playerHeaders.length > 0) {
                        const row = playerRows[0];
                        playerHeaders.forEach((h, idx) => {
                          if (h && h.includes('基础属性')) {
                            const parsed = parseAttributeString(row[idx] || '');
                            parsed.forEach(attr => {
                              if (!baseAttrs.some(a => a.name === attr.name)) {
                                baseAttrs.push(attr);
                              }
                            });
                          } else if (h && h.includes('特有属性')) {
                            const parsed = parseAttributeString(row[idx] || '');
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
                                        <span class="acu-dash-metric-label" title="${escapeHtml(res.name)}">${escapeHtml(res.name.substring(0, 3))}</span>
                                        <div class="acu-dash-metric-value-group">
                                            <span class="acu-dash-metric-value">${res.value}</span>
                                            <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${res.value}" data-name="${escapeHtml(res.name)}" title="以${res.name}(${res.value})进行检定"></i>
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
                                        <span class="acu-dash-metric-label" title="${escapeHtml(attr.name)}">${escapeHtml(attr.name.substring(0, 2))}</span>
                                        <div class="acu-dash-metric-value-group">
                                            <span class="acu-dash-attr-value">${attr.value}</span>
                                            <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${attr.value}" data-name="${escapeHtml(attr.name)}" title="以${attr.name}(${attr.value})进行检定"></i>
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
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-location-title" data-table="${escapeHtml(locationTableName)}">
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
                              const emoji = getElementEmoji(areaName, null);
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
                            data-table-key="${escapeHtml(locationTableKey)}"
                            data-row-index="${loc._rowIndex}"
                            data-preview-type="location">
                            <span style="display:flex;align-items:center;gap:4px;">
                                ${iconHtml}
                                <span title="${escapeHtml(areaName)}">${escapeHtml(areaName)}</span>
                            </span>
                            ${!isCurrent ? `<i class="fa-solid fa-walking acu-dash-goto-btn" data-location="${escapeHtml(areaName)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;flex-shrink:0;" title="前往${areaName}"></i>` : '<i class="fa-solid fa-street-view" style="flex-shrink:0;" title="您在这里"></i>'}
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无地点数据</div>'
                    }
                    </div>
                    </div>

                    <div class="acu-dash-role-group">
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-role-title" data-table="${escapeHtml(npcTableName)}">
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
                              const npcDisplayName = replaceUserPlaceholders(getDisplayName(npcName)).trim() || '未知';
                              const npcDisplayShort =
                                npcDisplayName.length > 4 ? npcDisplayName.substring(0, 4) + '..' : npcDisplayName;
                              const npcFallbackChar = npcDisplayName.charAt(0) || '？';
                              const isInScene = npc.isInScene === true;
                              const isLastNpc = npcIdx === allNPCs.length - 1;
                              const npcAvatar = AvatarManager.get(npcName);
                              const avatarOffsetX = AvatarManager.getOffsetX(npcName);
                              const avatarOffsetY = AvatarManager.getOffsetY(npcName);
                              const avatarScale = AvatarManager.getScale(npcName);
                              const avatarStyle = escapeHtml(
                                buildAvatarBackgroundStyle(npcAvatar, avatarOffsetX, avatarOffsetY, avatarScale),
                              );
                              const offSceneFilter = isInScene
                                ? ''
                                : 'filter:grayscale(80%) brightness(0.7);opacity:0.5;';
                              return `<div class="acu-dash-person-row acu-dash-clickable acu-dash-preview-trigger ${!isLastNpc ? 'acu-dash-row-separated' : ''}"
                            data-table-key="${escapeHtml(npc.tableKey || npcTableKey)}"
                            data-row-index="${npc.index}"
                            data-preview-type="npc">
                            <div class="acu-dash-row-main">
                                <span class="acu-dash-name-with-avatar">
                                    <span class="acu-dash-npc-avatar" data-npc-name="${escapeHtml(npcName)}" style="width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--acu-badge-bg, rgba(0,255,255,0.12));border:1.5px solid ${isInScene ? 'var(--acu-accent)' : 'var(--acu-border)'};${avatarStyle}${offSceneFilter}" title="${isInScene ? '在场' : '不在场'}">
                                        ${!avatarStyle ? `<span class="acu-dash-npc-avatar-fallback" style="font-size:10px;font-weight:bold;color:var(--acu-accent);">${escapeHtml(npcFallbackChar)}</span>` : ''}
                                    </span>
                                    <span class="${isInScene ? '' : 'acu-dash-muted'}" title="${escapeHtml(npcDisplayName)}">${escapeHtml(npcDisplayShort)}</span>
                                </span>
                                <div class="acu-dash-row-actions">
                                    <i class="fa-solid fa-people-arrows acu-dash-contest-btn" data-npc="${escapeHtml(npcName)}" title="与${escapeHtml(npcDisplayName)}进行对抗检定"></i>
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
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-items-title" data-table="${escapeHtml(bagTableName)}">
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
                              const emoji = getElementEmoji(item.name, null);
                              const iconContext = createCustomTableNameIconContext(
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
                              iconHtml = renderCustomTableNameIconContent(iconHtml, iconContext);
                              return `<div class="acu-dash-item-row acu-dash-clickable acu-dash-preview-trigger ${!isLastBag ? 'acu-dash-row-separated' : ''}"
                            data-table-key="${bagResult?.key || ''}"
                            data-row-index="${idx}"
                            data-preview-type="bag">
                            <span class="acu-dash-item-name" title="${escapeHtml(item.name)}">
                                ${iconHtml}
                                ${escapeHtml(item.name.length > 4 ? item.name.substring(0, 4) + '..' : item.name)}
                            </span>
                            <div class="acu-dash-row-actions">
                                <i class="fa-solid fa-hand-pointer acu-dash-use-item-btn" data-item="${escapeHtml(item.name)}" title="使用${item.name}"></i>
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无物品</div>'
                    }
                    </div>
                    </div>

                    <div class="acu-dash-equipment-task-group">
                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-equipment-title" data-table="${escapeHtml(equipTableName)}"><span><i class="fa-solid fa-shield-halved"></i> 装备 (${equippedItems.length})</span></h3>
                    <div class="acu-dash-equipment-list">
                    ${
                      equippedItems.length > 0
                        ? equippedItems
                            .map((item, idx) => {
                              const isLast = idx === equippedItems.length - 1;
                              const emoji = getElementEmoji(item.name, null);
                              const iconContext = createCustomTableNameIconContext(
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
                              iconHtml = renderCustomTableNameIconContent(iconHtml, iconContext);
                              return `<div class="acu-dash-equipment-row acu-dash-clickable acu-dash-preview-trigger ${!isLast ? 'acu-dash-row-separated' : ''}"
                            data-table-key="${equipResult?.key || ''}"
                            data-row-index="${equipParsed.findIndex(r => r.name === item.name)}"
                            data-preview-type="equipment">
                            ${iconHtml}
                            <span title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无装备</div>'
                    }
                    </div>

                    <h3 class="acu-dash-section-heading acu-dash-table-link acu-dash-quest-title" data-table="${escapeHtml(questTableName)}"><span><i class="fa-solid fa-clipboard-list"></i> 任务 (${activeTasks.length})</span></h3>
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
                                <div class="acu-task-name ${isMain ? 'acu-task-main' : ''}">${escapeHtml(t.name)}</div>
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

  const INVENTORY_TYPE_OPTIONS = ['全部', '消耗品', '材料', '任务物品', '道具'] as const;
  const INVENTORY_QUALITY_OPTIONS = ['全部', '普通', '优秀', '稀有', '史诗', '传说', '神话', '唯一'] as const;
  const INVENTORY_SORT_OPTIONS = [
    { value: 'default', label: '默认', icon: 'fa-border-all' },
    { value: 'type', label: '类型', icon: 'fa-shapes' },
    { value: 'quality', label: '品质', icon: 'fa-gem' },
    { value: 'quantity', label: '数量', icon: 'fa-hashtag' },
    { value: 'name', label: '名称', icon: 'fa-font' },
  ] as const;
  type InventoryTypeFilter = (typeof INVENTORY_TYPE_OPTIONS)[number];
  type InventoryQualityFilter = (typeof INVENTORY_QUALITY_OPTIONS)[number];
  type InventorySortFilter = (typeof INVENTORY_SORT_OPTIONS)[number]['value'];
  type InventoryFilterState = {
    search: string;
    type: InventoryTypeFilter;
    quality: InventoryQualityFilter;
    sort: InventorySortFilter;
  };
  type CompositionSafeSearchPayload = {
    input: HTMLInputElement;
    value: string;
    selectionStart: number;
    selectionEnd: number;
  };
  type CompositionSafeSearchBinding = {
    root: JQuery;
    selector?: string;
    namespace?: string;
  };
  type CompositionSafeSearchOptions = {
    delay: number;
    onCommit: (payload: CompositionSafeSearchPayload) => void;
  };
  type InventoryFilterButtonMeta<T extends string> = {
    value: T;
    icon: string;
    label: string;
  };
  type InventoryParsedItem = {
    name: string;
    type: string;
    quantityText: string;
    quantity: number;
    quality: string;
    tags: string;
    effect: string;
    description: string;
    rowIndex: number;
    tableName: string;
    tableKey: string;
    isNew: boolean;
    quantityChanged: boolean;
    isChanged: boolean;
  };
  type GachaRewardColumnMap = {
    name: number;
    type: number;
    quantity: number;
    quality: number;
    tags?: number;
    effect?: number;
    description: number;
    part?: number;
    status?: number;
  };
  type GachaRewardParseResult = {
    tableName: string;
    tableKey: string;
    headers: unknown[];
    items: InventoryParsedItem[];
    colMap: GachaRewardColumnMap;
  };
  type GachaRewardParseOptions = {
    targetTable?: string;
    targetColumns?: GachaRewardTargetColumns;
    requireNameColumn?: boolean;
  };
  type InventoryMetadataRecord = {
    acquiredAt: string;
    acquiredAtLocation: string;
  };
  type InventoryEditableField =
    | 'name'
    | 'type'
    | 'quantity'
    | 'quality'
    | 'description'
    | 'acquiredAtLocation'
    | 'acquiredAt';
  type InventoryMenuScope = 'card' | 'summary' | 'meta' | 'field';
  type InventoryMetadataScope = Record<string, InventoryMetadataRecord>;
  type InventoryMetadataRoot = Record<string, InventoryMetadataScope>;
  type InventoryMetadataStore = Record<string, InventoryMetadataRoot>;
  type GachaShardWallet = Record<GachaRarity, number>;
  type GachaCatalog = {
    version: number;
    items: GachaItemDefinition[];
    updatedAt: number;
  };
  type GachaCatalogRecord = GachaCatalog & {
    scopeKey: string;
  };
  type GachaCatalogCache = {
    scopeKey: string;
    catalog: GachaCatalog;
  };
  type GachaCatalogLoadTask = {
    scopeKey: string;
    promise: Promise<GachaCatalog>;
  };
  type GachaCatalogImportMode = 'overwrite' | 'skip' | 'rename';
  type NormalizedGachaCatalogItem = GachaItemDefinition & {
    generatedId: boolean;
  };
  type GachaCatalogImportAnalysis = {
    items: NormalizedGachaCatalogItem[];
    pools: GachaPoolDefinition[];
    skipped: number;
    errors: string[];
    conflictIds: string[];
  };
  type GachaCatalogImportStats = {
    added: number;
    updated: number;
    renamed: number;
    skipped: number;
    warnings: string[];
  };
  type GachaSettingsItemSourceFilter = 'all' | 'custom' | 'builtin';
  type GachaSettingsItemStatusFilter = 'all' | 'enabled' | 'disabled';
  type GachaSettingsItemSortMode =
    | 'default'
    | 'nameAsc'
    | 'nameDesc'
    | 'createdDesc'
    | 'createdAsc'
    | 'qualityDesc'
    | 'weightDesc';
  type GachaSettingsItemFilterState = {
    search: string;
    source: GachaSettingsItemSourceFilter;
    status: GachaSettingsItemStatusFilter;
    sort: GachaSettingsItemSortMode;
  };
  type GachaSettingsFilterField = 'source' | 'status' | 'sort';
  type GachaSettingsFilterOption<T extends string> = {
    readonly value: T;
    readonly label: string;
    readonly iconClass: string;
  };
  type NormalizedImportedGachaPools = {
    pools: GachaPoolDefinition[];
    tagAliases: Record<string, GachaPoolTag>;
  };
  type GachaPoolSettingsRecord = {
    version: number;
    pools: GachaPoolDefinition[];
    updatedAt: number;
  };
  type GachaItemSettingsEntry = {
    enabled: boolean;
    order: number;
  };
  type GachaItemSettingsRecord = {
    version: number;
    items: Record<string, GachaItemSettingsEntry>;
    updatedAt: number;
  };
  type GachaPityState = {
    rare: number;
    legend: number;
  };
  type GachaRecentRewardRecord = {
    itemId: string;
    name: string;
    quality: GachaRarity;
    quantity: number;
    duplicateConverted: boolean;
    shardGain: number;
    poolTag: GachaPoolTag;
    rewardTarget: GachaRewardTarget;
    createdAt: string;
  };
  type GachaInputStats = {
    totalTypedChars: number;
    totalTypedMessages: number;
    totalActiveMinutes: number;
    pendingCharCarry: number;
    pendingActiveMs: number;
    lastActiveAt: number;
    lastHeartbeatAt: number;
    lastFortuneGain: number;
    lastFortuneReason: string;
    lastFortuneDetail: string;
    lastFortuneAt: number;
    lastSettledMessageId: string;
    totalRewardedChecks: number;
    lastSettledCheckId: string;
  };
  type GachaState = {
    wallet: {
      fortune: number;
      shards: GachaShardWallet;
    };
    activePoolTag: GachaPoolTag;
    pity: GachaPityState;
    recentRewards: GachaRecentRewardRecord[];
    totalDraws: number;
    inputStats: GachaInputStats;
  };
  type GachaFortuneProgressView = {
    fortune: number;
    charProgress: number;
    charGoal: number;
    charPercent: number;
    charNote: string;
    activePercent: number;
    activeRemainingText: string;
    activeNote: string;
    lastGainText: string;
    lastGainTime: string;
    shouldFlashActiveReward: boolean;
  };
  type GachaDrawOutcome =
    | {
        kind: 'item';
        item: GachaItemDefinition;
        quantity: number;
        duplicateConverted: boolean;
        shardGain: number;
      }
    | {
        kind: 'shards';
        item: GachaItemDefinition;
        quantity: number;
        duplicateConverted: true;
        shardGain: number;
      };

  const createEmptyShardWallet = (): GachaShardWallet =>
    GACHA_RARITY_ORDER.reduce((acc, rarity) => {
      acc[rarity] = 0;
      return acc;
    }, {} as GachaShardWallet);

  const GACHA_DUPLICATE_REROLL_LIMIT = 8;
  const GACHA_PICKUP_WEIGHT_MULTIPLIER = 10;
  const GACHA_PICKUP_CHAT_DEPTH_BUCKET = 30;
  const GACHA_PICKUP_RARITIES: GachaRarity[] = ['史诗', '传说', '神话'];
  const GACHA_PICKUP_FALLBACK_LIMIT = 3;
  const GACHA_ALL_POOL_TAG: GachaPoolTag = '全部';
  const GACHA_CUSTOM_ONLY_POOL_TAG: GachaPoolTag = '自定义';
  const GACHA_REWARD_FIELD_LIMITS: Record<GachaRewardTarget, { name: number; description: number }> = {
    inventory: { name: 10, description: 60 },
    equipment: { name: 12, description: 40 },
  };
  const DEFAULT_GACHA_SETTINGS_ITEM_FILTERS: GachaSettingsItemFilterState = {
    search: '',
    source: 'all',
    status: 'all',
    sort: 'default',
  };
  const GACHA_SETTINGS_SOURCE_FILTER_OPTIONS: readonly GachaSettingsFilterOption<GachaSettingsItemSourceFilter>[] = [
    { value: 'all', label: '全部来源', iconClass: 'fa-layer-group' },
    { value: 'custom', label: '自定义', iconClass: 'fa-pen-nib' },
    { value: 'builtin', label: '内置', iconClass: 'fa-box-archive' },
  ];
  const GACHA_SETTINGS_STATUS_FILTER_OPTIONS: readonly GachaSettingsFilterOption<GachaSettingsItemStatusFilter>[] = [
    { value: 'all', label: '全部状态', iconClass: 'fa-toggle-on' },
    { value: 'enabled', label: '启用', iconClass: 'fa-circle-check' },
    { value: 'disabled', label: '禁用', iconClass: 'fa-circle-pause' },
  ];
  const GACHA_SETTINGS_SORT_OPTIONS: readonly GachaSettingsFilterOption<GachaSettingsItemSortMode>[] = [
    { value: 'default', label: '默认排序', iconClass: 'fa-arrow-down-wide-short' },
    { value: 'nameAsc', label: '名称 A-Z', iconClass: 'fa-arrow-down-a-z' },
    { value: 'nameDesc', label: '名称 Z-A', iconClass: 'fa-arrow-down-z-a' },
    { value: 'createdDesc', label: '最新创建', iconClass: 'fa-clock' },
    { value: 'createdAsc', label: '最早创建', iconClass: 'fa-clock-rotate-left' },
    { value: 'qualityDesc', label: '品质高到低', iconClass: 'fa-gem' },
    { value: 'weightDesc', label: '权重高到低', iconClass: 'fa-scale-balanced' },
  ];
  const INVENTORY_TYPE_FILTER_META: InventoryFilterButtonMeta<InventoryTypeFilter>[] = [
    { value: '全部', icon: 'fa-boxes-stacked', label: '全部类型' },
    { value: '消耗品', icon: 'fa-flask', label: '消耗品' },
    { value: '材料', icon: 'fa-hammer', label: '材料' },
    { value: '任务物品', icon: 'fa-scroll', label: '任务物品' },
    { value: '道具', icon: 'fa-cube', label: '道具' },
  ];
  const INVENTORY_QUALITY_FILTER_META: InventoryFilterButtonMeta<InventoryQualityFilter>[] = [
    { value: '全部', icon: 'fa-layer-group', label: '全部品质' },
    { value: '普通', icon: 'fa-circle', label: '普通' },
    { value: '优秀', icon: 'fa-square', label: '优秀' },
    { value: '稀有', icon: 'fa-diamond', label: '稀有' },
    { value: '史诗', icon: 'fa-crown', label: '史诗' },
    { value: '传说', icon: 'fa-star', label: '传说' },
    { value: '神话', icon: 'fa-sun', label: '神话' },
    { value: '唯一', icon: 'fa-fingerprint', label: '唯一' },
  ];
  const INVENTORY_QUALITY_ORDER = {
    普通: 1,
    优秀: 2,
    稀有: 3,
    史诗: 4,
    传说: 5,
    神话: 6,
    唯一: 7,
  };

  const getInventoryFilters = (): InventoryFilterState => {
    const stored = Store.get(STORAGE_KEY_INVENTORY_FILTERS, {}) as Partial<InventoryFilterState>;
    return {
      search: String(stored.search || ''),
      type: INVENTORY_TYPE_OPTIONS.includes(stored.type as InventoryTypeFilter)
        ? (stored.type as InventoryTypeFilter)
        : '全部',
      quality: INVENTORY_QUALITY_OPTIONS.includes(stored.quality as InventoryQualityFilter)
        ? (stored.quality as InventoryQualityFilter)
        : '全部',
      sort: INVENTORY_SORT_OPTIONS.some(option => option.value === stored.sort)
        ? (stored.sort as InventorySortFilter)
        : 'default',
    };
  };

  const saveInventoryFilters = (filters: Partial<InventoryFilterState>) => {
    Store.set(STORAGE_KEY_INVENTORY_FILTERS, { ...getInventoryFilters(), ...filters });
  };

  const getInventoryFiltersCollapsedState = () => Store.get(STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, true);
  const saveInventoryFiltersCollapsedState = (collapsed: boolean) =>
    Store.set(STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, collapsed);

  const bindCompositionSafeSearchInput = (
    binding: CompositionSafeSearchBinding,
    options: CompositionSafeSearchOptions,
  ) => {
    const { root, selector, namespace } = binding;
    const suffix = namespace ? `.${namespace}` : '';
    const eventNames = `compositionstart${suffix} compositionend${suffix} input${suffix}`;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const emitCommit = (input: HTMLInputElement, immediate = false) => {
      const value = String(input.value || '');
      const selectionStart = input.selectionStart ?? value.length;
      const selectionEnd = input.selectionEnd ?? value.length;
      const payload: CompositionSafeSearchPayload = {
        input,
        value,
        selectionStart,
        selectionEnd,
      };
      clearTimer();
      if (immediate || options.delay <= 0) {
        options.onCommit(payload);
        return;
      }
      timer = setTimeout(() => {
        timer = null;
        options.onCommit(payload);
      }, options.delay);
    };

    const bindEvent = (eventName: string, handler: (this: HTMLInputElement) => void) => {
      if (selector) {
        root.on(`${eventName}${suffix}`, selector, function () {
          handler.call(this as HTMLInputElement);
        });
        return;
      }
      root.on(`${eventName}${suffix}`, function () {
        handler.call(this as HTMLInputElement);
      });
    };

    if (selector) {
      root.off(eventNames, selector);
    } else {
      root.off(eventNames);
    }

    bindEvent('compositionstart', function () {
      this.dataset.acuComposing = 'true';
      clearTimer();
    });
    bindEvent('compositionend', function () {
      this.dataset.acuComposing = 'false';
      emitCommit(this, true);
    });
    bindEvent('input', function () {
      if (this.dataset.acuComposing === 'true') return;
      emitCommit(this);
    });
  };

  const normalizeGachaPoolId = (value: unknown): GachaPoolTag =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40);

  const normalizeGachaPoolName = (value: unknown, fallback: GachaPoolTag): string =>
    String(value ?? fallback)
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40) || fallback;

  const isBuiltinGachaPoolId = (poolId: GachaPoolTag): boolean =>
    BUILTIN_GACHA_POOL_DEFINITIONS.some(pool => pool.id === poolId);

  const canDeleteGachaPoolDefinition = (pool: GachaPoolDefinition): boolean => {
    if (pool.id === GACHA_ALL_POOL_TAG) return false;
    return !pool.builtin;
  };

  const cloneGachaPoolDefinitions = (pools: readonly GachaPoolDefinition[]): GachaPoolDefinition[] =>
    JSON.parse(JSON.stringify(pools)) as GachaPoolDefinition[];

  const buildDefaultGachaPoolDefinition = (
    id: GachaPoolTag,
    options: Partial<Omit<GachaPoolDefinition, 'id'>> = {},
  ): GachaPoolDefinition => {
    const enabled = id !== GACHA_ALL_POOL_TAG && options.includeInAll === true;
    return {
      id,
      name: options.name || id,
      builtin: options.builtin === true,
      visibleInTabs: id === GACHA_ALL_POOL_TAG || enabled,
      includeInAll: enabled,
      order: Number.isFinite(Number(options.order)) ? Number(options.order) : 999,
    };
  };

  const normalizeGachaPoolDefinition = (rawPool: unknown): GachaPoolDefinition | null => {
    if (!rawPool || typeof rawPool !== 'object') return null;
    const record = rawPool as Record<string, unknown>;
    const id = normalizeGachaPoolId(record.id || record.tag || record.name);
    if (!id) return null;
    const builtin = isBuiltinGachaPoolId(id);
    const allPool = id === GACHA_ALL_POOL_TAG;
    const enabled =
      !allPool &&
      (record.includeInAll === undefined
        ? record.visibleInTabs !== false && record.visible !== false
        : record.includeInAll === true);
    return {
      id,
      name: normalizeGachaPoolName(record.name || record.label || id, id),
      builtin,
      visibleInTabs: allPool || enabled,
      includeInAll: enabled,
      order: Number.isFinite(Number(record.order)) ? Number(record.order) : builtin ? 100 : 999,
    };
  };

  const getStoredGachaPoolSettings = (): GachaPoolSettingsRecord => {
    const stored = Store.get(STORAGE_KEY_GACHA_POOL_SETTINGS, null);
    const record = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {};
    const pools = Array.isArray(record.pools)
      ? record.pools.map(normalizeGachaPoolDefinition).filter((pool): pool is GachaPoolDefinition => Boolean(pool))
      : [];
    return {
      version: Number(record.version) || 1,
      pools,
      updatedAt: Math.max(0, Number(record.updatedAt) || 0),
    };
  };

  const saveGachaPoolSettings = (pools: readonly GachaPoolDefinition[]) => {
    const normalized = cloneGachaPoolDefinitions(pools).map(pool => {
      const enabled = pool.id !== GACHA_ALL_POOL_TAG && pool.includeInAll === true;
      return {
        ...pool,
        visibleInTabs: pool.id === GACHA_ALL_POOL_TAG ? true : enabled,
        includeInAll: enabled,
      };
    });
    const saved = Store.set(STORAGE_KEY_GACHA_POOL_SETTINGS, {
      version: 1,
      pools: normalized,
      updatedAt: Date.now(),
    } satisfies GachaPoolSettingsRecord);
    if (!saved) throw new Error('卡池设置保存失败');
  };

  const sortGachaPoolDefinitions = (pools: GachaPoolDefinition[]): GachaPoolDefinition[] =>
    pools.sort((a, b) => {
      if (a.id === GACHA_ALL_POOL_TAG) return -1;
      if (b.id === GACHA_ALL_POOL_TAG) return 1;
      return (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name, 'zh-Hans-CN');
    });

  const getConfiguredGachaPoolDefinitions = (): GachaPoolDefinition[] => {
    const byId = new Map<GachaPoolTag, GachaPoolDefinition>();
    BUILTIN_GACHA_POOL_DEFINITIONS.forEach(pool => byId.set(pool.id, { ...pool }));
    getStoredGachaPoolSettings().pools.forEach(pool => {
      const existing = byId.get(pool.id);
      const enabled = pool.id !== GACHA_ALL_POOL_TAG && pool.includeInAll === true;
      byId.set(pool.id, {
        ...buildDefaultGachaPoolDefinition(pool.id, existing || pool),
        ...existing,
        ...pool,
        builtin: existing?.builtin === true,
        visibleInTabs: pool.id === GACHA_ALL_POOL_TAG ? true : enabled,
        includeInAll: enabled,
      });
    });
    if (!byId.has(GACHA_ALL_POOL_TAG)) {
      byId.set(GACHA_ALL_POOL_TAG, buildDefaultGachaPoolDefinition(GACHA_ALL_POOL_TAG, { builtin: true, order: 0 }));
    }
    return sortGachaPoolDefinitions(Array.from(byId.values()));
  };

  const collectGachaPoolTagsFromItems = (rawData = getRuntimeGachaRawData()): GachaPoolTag[] => {
    const tags = new Set<GachaPoolTag>();
    try {
      getAllGachaItemDefinitions(rawData).forEach(item => {
        (item.poolTags || []).forEach(tag => {
          const normalized = normalizeGachaPoolId(tag);
          if (normalized && normalized !== GACHA_ALL_POOL_TAG) tags.add(normalized);
        });
      });
    } catch {
      GACHA_POOL_TAGS.forEach(tag => {
        if (tag !== GACHA_ALL_POOL_TAG) tags.add(tag);
      });
    }
    return Array.from(tags);
  };

  const ensureGachaPoolsForTags = (tags: readonly GachaPoolTag[]): GachaPoolDefinition[] => {
    const pools = getConfiguredGachaPoolDefinitions();
    const nextPools = getGachaPoolDefinitionsWithVirtualTags(tags, pools);
    if (nextPools.length !== pools.length) saveGachaPoolSettings(nextPools);
    return getConfiguredGachaPoolDefinitions();
  };

  const getGachaPoolDefinitionsWithVirtualTags = (
    tags: readonly GachaPoolTag[],
    basePools: readonly GachaPoolDefinition[] = getConfiguredGachaPoolDefinitions(),
  ): GachaPoolDefinition[] => {
    const pools = cloneGachaPoolDefinitions(basePools);
    const known = new Set(pools.map(pool => pool.id));
    let nextOrder = pools.reduce((max, pool) => Math.max(max, Number(pool.order) || 0), 0) + 10;
    tags.forEach(rawTag => {
      const id = normalizeGachaPoolId(rawTag);
      if (!id || id === GACHA_ALL_POOL_TAG || known.has(id)) return;
      pools.push(
        buildDefaultGachaPoolDefinition(id, {
          name: id,
          builtin: false,
          visibleInTabs: true,
          includeInAll: true,
          order: nextOrder,
        }),
      );
      known.add(id);
      nextOrder += 10;
    });
    return sortGachaPoolDefinitions(pools);
  };

  const getAllGachaPoolConfigDefinitions = (rawData = getRuntimeGachaRawData()): GachaPoolDefinition[] => {
    return getGachaPoolDefinitionsWithVirtualTags(collectGachaPoolTagsFromItems(rawData));
  };

  const isGachaPoolEnabled = (pool: GachaPoolDefinition): boolean =>
    pool.id === GACHA_ALL_POOL_TAG || pool.includeInAll === true;

  const getVisibleGachaPoolConfigDefinitions = (rawData = getRuntimeGachaRawData()): GachaPoolDefinition[] =>
    getAllGachaPoolConfigDefinitions(rawData).filter(isGachaPoolEnabled);

  const getGachaAllExpandablePoolTags = (rawData = getRuntimeGachaRawData()): GachaPoolTag[] => {
    return getAllGachaPoolConfigDefinitions(rawData)
      .filter(pool => pool.id !== GACHA_ALL_POOL_TAG && isGachaPoolEnabled(pool))
      .map(pool => pool.id);
  };

  const getGachaPoolDisplayName = (poolTag: GachaPoolTag, rawData = getRuntimeGachaRawData()): string =>
    getAllGachaPoolConfigDefinitions(rawData).find(pool => pool.id === poolTag)?.name || poolTag;

  const formatGachaPoolTags = (poolTags: readonly GachaPoolTag[], rawData = getRuntimeGachaRawData()): string =>
    poolTags.map(tag => getGachaPoolDisplayName(tag, rawData)).join('、');

  const updateGachaPoolConfig = (poolId: GachaPoolTag, updates: Partial<GachaPoolDefinition>): boolean => {
    const id = normalizeGachaPoolId(poolId);
    if (!id) return false;
    const pools = getConfiguredGachaPoolDefinitions();
    const index = pools.findIndex(pool => pool.id === id);
    if (index < 0) return false;
    const existing = pools[index];
    const enabledUpdate = updates.includeInAll ?? updates.visibleInTabs;
    const enabled = id !== GACHA_ALL_POOL_TAG && (enabledUpdate === undefined ? existing.includeInAll : enabledUpdate) === true;
    pools[index] = {
      ...existing,
      ...updates,
      id,
      builtin: existing.builtin,
      visibleInTabs: id === GACHA_ALL_POOL_TAG ? true : enabled,
      includeInAll: enabled,
      name: updates.name !== undefined ? normalizeGachaPoolName(updates.name, id) : existing.name,
    };
    saveGachaPoolSettings(pools);
    return true;
  };

  const setGachaPoolOrder = (poolId: GachaPoolTag, order: number): boolean =>
    updateGachaPoolConfig(poolId, { order: Math.max(1, Math.floor(Number(order) || 0)) });

  const normalizeGachaItemEnabled = (value: unknown): boolean => value !== false;

  const normalizeGachaItemOrder = (value: unknown, fallback = 999): number => {
    const order = Number(value);
    return Number.isFinite(order) ? Math.max(1, Math.floor(order)) : fallback;
  };

  const normalizeGachaRewardTarget = (value: unknown): GachaRewardTarget =>
    value === 'equipment' ? 'equipment' : 'inventory';

  const getGachaRewardFieldLimits = (target: GachaRewardTarget): { name: number; description: number } =>
    GACHA_REWARD_FIELD_LIMITS[normalizeGachaRewardTarget(target)];

  const truncateGachaText = (value: unknown, maxLength: number): string =>
    Array.from(String(value || ''))
      .slice(0, maxLength)
      .join('');

  const normalizeGachaTargetTable = (raw: unknown): string | undefined => {
    if (typeof raw !== 'string') return undefined;
    const value = truncateGachaText(raw.trim(), GACHA_TARGET_TABLE_MAX_LENGTH);
    return value || undefined;
  };

  const normalizeGachaTargetColumns = (raw: unknown): GachaRewardTargetColumns | undefined => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
    const columns: GachaRewardTargetColumns = {};
    const record = raw as Record<string, unknown>;
    GACHA_TARGET_COLUMN_KEYS.forEach(key => {
      const value = record[key];
      if (typeof value !== 'string') return;
      const headerName = truncateGachaText(value.trim(), GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH);
      if (headerName) columns[key] = headerName;
    });
    return Object.keys(columns).length ? columns : undefined;
  };

  const getGachaTargetColumnEntries = (targetColumns?: GachaRewardTargetColumns): [GachaRewardTargetColumnKey, string][] =>
    GACHA_TARGET_COLUMN_KEYS.map(key => [key, String(targetColumns?.[key] || '').trim()] as [GachaRewardTargetColumnKey, string]).filter(
      ([, value]) => Boolean(value),
    );

  const GACHA_CUSTOM_FIELD_MAX_COUNT = 20;
  const GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH = 30;
  const GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH = 500;
  const GACHA_TARGET_TABLE_MAX_LENGTH = 60;
  const GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH = 30;
  const GACHA_TARGET_COLUMN_KEYS: readonly GachaRewardTargetColumnKey[] = [
    'name',
    'type',
    'quantity',
    'quality',
    'tags',
    'effect',
    'description',
    'part',
    'status',
  ];
  const GACHA_TARGET_COLUMN_LABELS: Record<GachaRewardTargetColumnKey, string> = {
    name: '名称列',
    type: '类型列',
    quantity: '数量列',
    quality: '品质列',
    tags: '标签列',
    effect: '效果列',
    description: '描述列',
    part: '部位列',
    status: '状态列',
  };
  const GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS = new Set<GachaRewardTargetColumnKey>([
    'name',
    'type',
    'quantity',
    'quality',
    'tags',
    'effect',
    'description',
  ]);
  const GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS = new Set<GachaRewardTargetColumnKey>([
    ...GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS,
    'status',
  ]);
  const GACHA_CUSTOM_FIELD_RESERVED_KEYS = new Set([
    'row_id',
    '物品名称',
    '装备名称',
    '类型',
    '数量',
    '品质',
    '标签',
    '效果',
    '描述',
    '状态',
  ]);

  const normalizeGachaCustomFields = (raw: unknown): GachaCustomFields | undefined => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
    const customFields: GachaCustomFields = {};
    for (const [rawKey, rawValue] of Object.entries(raw as Record<string, unknown>)) {
      if (Object.keys(customFields).length >= GACHA_CUSTOM_FIELD_MAX_COUNT) break;
      if (typeof rawValue !== 'string') continue;
      const key = truncateGachaText(rawKey.trim(), GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH);
      if (!key || GACHA_CUSTOM_FIELD_RESERVED_KEYS.has(key)) continue;
      const value = truncateGachaText(rawValue.trim(), GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH);
      if (!value) continue;
      customFields[key] = value;
    }
    return Object.keys(customFields).length ? customFields : undefined;
  };

  const hasGachaCustomFields = (item: Pick<GachaItemDefinition, 'customFields'>): boolean =>
    Boolean(item.customFields && Object.keys(item.customFields).length);

  const getGachaCustomFieldEntries = (item: Pick<GachaItemDefinition, 'customFields'>): [string, string][] =>
    item.customFields ? Object.entries(item.customFields) : [];

  const GACHA_TAG_FIELD_ALIASES = ['标签', '标记', '词条'] as const;
  const GACHA_EFFECT_FIELD_ALIASES = ['效果', '作用', '能力', '特效'] as const;
  const normalizeGachaFieldAlias = (value: unknown): string => String(value || '').trim().toLowerCase();
  const isGachaFieldAlias = (value: unknown, aliases: readonly string[]): boolean => {
    const normalized = normalizeGachaFieldAlias(value);
    return Boolean(normalized) && aliases.some(alias => normalizeGachaFieldAlias(alias) === normalized);
  };

  const getGachaNamedCustomField = (
    item: Pick<GachaItemDefinition, 'customFields'>,
    fieldNames: readonly string[],
  ): string => {
    const wanted = new Set(fieldNames.map(normalizeGachaFieldAlias).filter(Boolean));
    for (const [key, value] of getGachaCustomFieldEntries(item)) {
      if (wanted.has(String(key).trim().toLowerCase())) return String(value || '').trim();
    }
    return '';
  };

  const getGachaItemTagsText = (
    item: Pick<GachaItemDefinition, 'type' | 'quality' | 'tags' | 'customFields'>,
  ): string =>
    String(item.tags || getGachaNamedCustomField(item, ['标签', '标记', '词条']) || `[${item.type}][${item.quality}]`).trim();

  const getGachaItemEffectText = (
    item: Pick<GachaItemDefinition, 'effect' | 'description' | 'customFields'>,
  ): string =>
    String(item.effect || getGachaNamedCustomField(item, ['效果', '作用', '能力', '特效']) || item.description || '').trim();

  const getGachaItemDescriptionText = (item: Pick<GachaItemDefinition, 'description'>): string =>
    String(item.description || '').trim();

  const formatGachaItemCardMeta = (
    item: Pick<GachaItemDefinition, 'type' | 'quality' | 'tags' | 'customFields' | 'grantQuantity'>,
    quantity = Math.max(1, Math.floor(Number(item.grantQuantity) || 1)),
  ): string => `${item.type} · ${item.quality} · ${getGachaItemTagsText(item)} · 数量×${String(quantity)}`;

  const getGachaCustomFieldsSearchText = (item: Pick<GachaItemDefinition, 'customFields'>): string =>
    getGachaCustomFieldEntries(item)
      .map(([key, value]) => `${key} ${value}`)
      .join(' ');

  type GachaCustomFieldsPreviewRenderOptions = {
    limit?: number;
    showOverflowCount?: boolean;
    valueOnly?: boolean;
  };

  type GachaCustomFieldsDetailsRenderOptions = {
    openThreshold?: number;
    title?: string;
  };

  const renderGachaCustomFieldsPreviewHtml = (
    item: Pick<GachaItemDefinition, 'customFields' | 'targetColumns'>,
    options: GachaCustomFieldsPreviewRenderOptions = {},
  ): string => {
    const entries = getGachaCustomFieldEntries(item);
    if (entries.length === 0) return '';

    const limit = Math.max(0, Math.floor(Number(options.limit ?? 2)));
    const visibleEntries = limit > 0 ? entries.slice(0, limit) : [];
    const overflowCount = Math.max(0, entries.length - visibleEntries.length);
    const fieldsHtml = visibleEntries
      .map(([key, value]) => {
        const title = `${key}：${value}`;
        const valueOnlyClass = options.valueOnly ? ' acu-gacha-custom-field-preview-chip-value-only' : '';
        return `
          <span class="acu-gacha-custom-field-preview-chip acu-gacha-custom-field-chip${valueOnlyClass}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">
            ${options.valueOnly ? '' : `<span class="acu-gacha-custom-field-preview-key">${escapeHtml(key)}</span>`}
            <span class="acu-gacha-custom-field-preview-value">${escapeHtml(value)}</span>
          </span>
        `;
      })
      .join('');
    const overflowHtml =
      options.showOverflowCount !== false && overflowCount > 0
        ? `<span class="acu-gacha-custom-field-preview-more">${escapeHtml(options.valueOnly ? `+${String(overflowCount)}` : `+${String(overflowCount)} 字段`)}</span>`
        : '';

    if (!fieldsHtml && !overflowHtml) return '';
    return `<div class="acu-gacha-custom-field-preview acu-gacha-custom-fields-preview">${fieldsHtml}${overflowHtml}</div>`;
  };

  const renderGachaCustomFieldsDetailsHtml = (
    item: Pick<GachaItemDefinition, 'customFields'>,
    options: GachaCustomFieldsDetailsRenderOptions = {},
  ): string => {
    const entries = getGachaCustomFieldEntries(item);
    if (entries.length === 0) return '';

    const title = options.title || '自定义字段';
    const openThreshold = Math.max(0, Math.floor(Number(options.openThreshold ?? 4)));
    const openAttribute = entries.length <= openThreshold ? ' open' : '';
    const rowsHtml = entries
      .map(
        ([key, value]) => `
          <div class="acu-gacha-custom-field-detail-row">
            <span class="acu-gacha-custom-field-detail-key">${escapeHtml(key)}</span>
            <span class="acu-gacha-custom-field-detail-value">${escapeHtml(value)}</span>
          </div>
        `,
      )
      .join('');

    return `
      <details class="acu-gacha-custom-field-details acu-gacha-custom-fields-details"${openAttribute}>
        <summary>
          <span><i class="fa-solid fa-table-list"></i><strong>${escapeHtml(title)}</strong></span>
          <small>${escapeHtml(String(entries.length))} 项</small>
        </summary>
        <div class="acu-gacha-custom-field-detail-list">${rowsHtml}</div>
      </details>
    `;
  };

  const getStoredGachaItemSettings = (): GachaItemSettingsRecord => {
    const stored = Store.get(STORAGE_KEY_GACHA_ITEM_SETTINGS, null);
    const record = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {};
    const rawItems =
      record.items && typeof record.items === 'object' && !Array.isArray(record.items)
        ? (record.items as Record<string, unknown>)
        : {};
    const items: Record<string, GachaItemSettingsEntry> = {};
    Object.entries(rawItems).forEach(([rawId, rawEntry]) => {
      const id = String(rawId || '').trim();
      if (!id || !rawEntry || typeof rawEntry !== 'object') return;
      const entry = rawEntry as Record<string, unknown>;
      items[id] = {
        enabled: normalizeGachaItemEnabled(entry.enabled),
        order: normalizeGachaItemOrder(entry.order),
      };
    });
    return {
      version: Number(record.version) || 1,
      items,
      updatedAt: Math.max(0, Number(record.updatedAt) || 0),
    };
  };

  const saveGachaItemSettingsRecord = (items: Record<string, GachaItemSettingsEntry>) => {
    const saved = Store.set(STORAGE_KEY_GACHA_ITEM_SETTINGS, {
      version: 1,
      items,
      updatedAt: Date.now(),
    } satisfies GachaItemSettingsRecord);
    if (!saved) throw new Error('自定义物品设置保存失败');
  };

  const withGachaItemSettings = (
    item: GachaItemDefinition,
    settings: GachaItemSettingsRecord = getStoredGachaItemSettings(),
  ): GachaItemDefinition => {
    const stored = settings.items[item.id];
    return {
      ...item,
      enabled: stored ? stored.enabled : normalizeGachaItemEnabled(item.enabled),
      order: stored ? stored.order : normalizeGachaItemOrder(item.order),
    };
  };

  const isGachaItemEnabled = (item: Pick<GachaItemDefinition, 'enabled'>): boolean =>
    normalizeGachaItemEnabled(item.enabled);

  const updateGachaItemSetting = (itemId: string, updates: Partial<GachaItemSettingsEntry>): boolean => {
    const id = String(itemId || '').trim();
    if (!id) return false;
    const record = getStoredGachaItemSettings();
    const existing = record.items[id] || { enabled: true, order: 999 };
    saveGachaItemSettingsRecord({
      ...record.items,
      [id]: {
        enabled: updates.enabled !== undefined ? normalizeGachaItemEnabled(updates.enabled) : existing.enabled,
        order: updates.order !== undefined ? normalizeGachaItemOrder(updates.order) : existing.order,
      },
    });
    return true;
  };

  const setGachaItemOrder = (itemId: string, order: number): boolean =>
    updateGachaItemSetting(itemId, { order: normalizeGachaItemOrder(order) });

  const deleteGachaItemSetting = (itemId: string): boolean => {
    const id = String(itemId || '').trim();
    if (!id) return false;
    const record = getStoredGachaItemSettings();
    if (!record.items[id]) return false;
    const nextSettings = { ...record.items };
    delete nextSettings[id];
    saveGachaItemSettingsRecord(nextSettings);
    return true;
  };

  const createDefaultGachaState = (): GachaState => ({
    wallet: {
      fortune: GACHA_TEST_DEFAULT_FORTUNE,
      shards: createEmptyShardWallet(),
    },
    activePoolTag: '全部',
    pity: {
      rare: 0,
      legend: 0,
    },
    recentRewards: [],
    totalDraws: 0,
    inputStats: {
      totalTypedChars: 0,
      totalTypedMessages: 0,
      totalActiveMinutes: 0,
      pendingCharCarry: 0,
      pendingActiveMs: 0,
      lastActiveAt: 0,
      lastHeartbeatAt: 0,
      lastFortuneGain: 0,
      lastFortuneReason: '',
      lastFortuneDetail: '',
      lastFortuneAt: 0,
      lastSettledMessageId: '',
      totalRewardedChecks: 0,
      lastSettledCheckId: '',
    },
  });

  const normalizeShardWallet = (rawValue: unknown): GachaShardWallet => {
    const base = createEmptyShardWallet();
    if (!rawValue || typeof rawValue !== 'object') return base;
    GACHA_RARITY_ORDER.forEach(rarity => {
      const value = Number((rawValue as Record<string, unknown>)[rarity] || 0);
      base[rarity] = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
    });
    return base;
  };

  const normalizeRecentGachaRewards = (rawValue: unknown): GachaRecentRewardRecord[] => {
    if (!Array.isArray(rawValue)) return [];
    return rawValue
      .map(record => {
        if (!record || typeof record !== 'object') return null;
        const quality = GACHA_RARITY_ORDER.includes((record as Record<string, unknown>).quality as GachaRarity)
          ? ((record as Record<string, unknown>).quality as GachaRarity)
          : '普通';
        const rewardTarget =
          (record as Record<string, unknown>).rewardTarget === 'equipment' ? 'equipment' : 'inventory';
        const normalizedPoolTag = normalizeGachaPoolId((record as Record<string, unknown>).poolTag);
        const poolTag = getConfiguredGachaPoolDefinitions().some(pool => pool.id === normalizedPoolTag)
          ? normalizedPoolTag
          : GACHA_ALL_POOL_TAG;
        return {
          itemId: String((record as Record<string, unknown>).itemId || ''),
          name: String((record as Record<string, unknown>).name || ''),
          quality,
          quantity: Math.max(1, Number.parseInt(String((record as Record<string, unknown>).quantity || '1'), 10) || 1),
          duplicateConverted: (record as Record<string, unknown>).duplicateConverted === true,
          shardGain: Math.max(
            0,
            Number.parseInt(String((record as Record<string, unknown>).shardGain || '0'), 10) || 0,
          ),
          poolTag,
          rewardTarget,
          createdAt: String((record as Record<string, unknown>).createdAt || '').trim(),
        } as GachaRecentRewardRecord;
      })
      .filter((record): record is GachaRecentRewardRecord => Boolean(record))
      .slice(0, GACHA_RECENT_REWARD_LIMIT);
  };

  const cloneGachaState = (state: GachaState): GachaState => JSON.parse(JSON.stringify(state)) as GachaState;

  const getGachaStateStorageKey = (): string => {
    const contextId = String(getCurrentContextFingerprint() || 'unknown_context').trim() || 'unknown_context';
    return `${STORAGE_KEY_GACHA_STATE}_${contextId}`;
  };

  const getGachaStateMigrationKey = (): string => `${getGachaStateStorageKey()}_legacy_migrated`;

  const hasMigratedLegacyGachaState = (): boolean => Store.get(getGachaStateMigrationKey(), false) === true;

  const markLegacyGachaStateMigrated = () => {
    Store.set(getGachaStateMigrationKey(), true);
  };

  const getStoredGachaStateSnapshot = (): Record<string, unknown> | null => {
    const scoped = Store.get(getGachaStateStorageKey(), null);
    if (scoped && typeof scoped === 'object') return scoped as Record<string, unknown>;

    const legacy = Store.get(STORAGE_KEY_GACHA_STATE, null);
    return legacy && typeof legacy === 'object' ? (legacy as Record<string, unknown>) : null;
  };

  const saveStoredGachaStateSnapshot = (state: GachaState): boolean => {
    const saved = Store.set(getGachaStateStorageKey(), cloneGachaState(state));
    if (!saved) {
      console.error('[DICE][GACHA]骰子商店状态保存失败');
      return false;
    }
    try {
      localStorage.removeItem(STORAGE_KEY_GACHA_STATE);
    } catch (error) {
      console.warn('[DICE][GACHA]清理旧版骰运缓存失败:', error);
    }
    return true;
  };

  const assertSaveStoredGachaStateSnapshot = (state: GachaState): void => {
    if (!saveStoredGachaStateSnapshot(state)) throw new Error('骰子商店状态保存失败');
  };

  const normalizeGachaStateRecord = (rawValue: unknown): GachaState | null => {
    if (!rawValue || typeof rawValue !== 'object') return null;

    const defaultState = createDefaultGachaState();
    const rawRecord = rawValue as Record<string, unknown>;
    const storedActivePoolTag = normalizeGachaPoolId(rawRecord.activePoolTag);
    const activePoolTag = getConfiguredGachaPoolDefinitions().some(pool => pool.id === storedActivePoolTag)
      ? storedActivePoolTag
      : defaultState.activePoolTag;

    return {
      wallet: {
        fortune: Math.max(
          0,
          Number.parseInt(String((rawRecord.wallet as Record<string, unknown> | undefined)?.fortune || '0'), 10) || 0,
        ),
        shards: normalizeShardWallet((rawRecord.wallet as Record<string, unknown> | undefined)?.shards),
      },
      activePoolTag,
      pity: {
        rare: Math.max(
          0,
          Number.parseInt(String((rawRecord.pity as Record<string, unknown> | undefined)?.rare || '0'), 10) || 0,
        ),
        legend: Math.max(
          0,
          Number.parseInt(String((rawRecord.pity as Record<string, unknown> | undefined)?.legend || '0'), 10) || 0,
        ),
      },
      recentRewards: normalizeRecentGachaRewards(rawRecord.recentRewards),
      totalDraws: Math.max(0, Number.parseInt(String(rawRecord.totalDraws || '0'), 10) || 0),
      inputStats: {
        totalTypedChars: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.totalTypedChars || '0'),
            10,
          ) || 0,
        ),
        totalTypedMessages: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.totalTypedMessages || '0'),
            10,
          ) || 0,
        ),
        totalActiveMinutes: Math.max(
          0,
          Number(String((rawRecord.inputStats as Record<string, unknown> | undefined)?.totalActiveMinutes || '0')) || 0,
        ),
        pendingCharCarry: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.pendingCharCarry || '0'),
            10,
          ) || 0,
        ),
        pendingActiveMs: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.pendingActiveMs || '0'),
            10,
          ) || 0,
        ),
        lastActiveAt: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.lastActiveAt || '0'),
            10,
          ) || 0,
        ),
        lastHeartbeatAt: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.lastHeartbeatAt || '0'),
            10,
          ) || 0,
        ),
        lastFortuneGain: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.lastFortuneGain || '0'),
            10,
          ) || 0,
        ),
        lastFortuneReason: String(
          (rawRecord.inputStats as Record<string, unknown> | undefined)?.lastFortuneReason || '',
        ).trim(),
        lastFortuneDetail: String(
          (rawRecord.inputStats as Record<string, unknown> | undefined)?.lastFortuneDetail || '',
        ).trim(),
        lastFortuneAt: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.lastFortuneAt || '0'),
            10,
          ) || 0,
        ),
        lastSettledMessageId: String(
          (rawRecord.inputStats as Record<string, unknown> | undefined)?.lastSettledMessageId || '',
        ).trim(),
        totalRewardedChecks: Math.max(
          0,
          Number.parseInt(
            String((rawRecord.inputStats as Record<string, unknown> | undefined)?.totalRewardedChecks || '0'),
            10,
          ) || 0,
        ),
        lastSettledCheckId: String(
          (rawRecord.inputStats as Record<string, unknown> | undefined)?.lastSettledCheckId || '',
        ).trim(),
      },
    };
  };

  const getGachaStateBalanceScore = (state: GachaState): number =>
    state.wallet.fortune +
    GACHA_RARITY_ORDER.reduce((sum, rarity) => sum + Math.max(0, Number(state.wallet.shards[rarity] || 0)), 0) +
    state.totalDraws +
    state.pity.rare +
    state.pity.legend;

  const mergeLegacyGachaStateForLocalStorage = (localState: GachaState, legacyState: GachaState): GachaState =>
    getGachaStateBalanceScore(legacyState) > getGachaStateBalanceScore(localState)
      ? cloneGachaState(legacyState)
      : cloneGachaState(localState);

  let gachaCatalogCache: GachaCatalogCache | null = null;
  let gachaCatalogLoadTask: GachaCatalogLoadTask | null = null;

  const cloneGachaCatalogItems = (items: readonly GachaItemDefinition[]): GachaItemDefinition[] =>
    JSON.parse(JSON.stringify(items)) as GachaItemDefinition[];

  const getGachaCatalogScopeKey = (): string => GACHA_CATALOG_GLOBAL_SCOPE_KEY;

  const createEmptyGachaCatalog = (): GachaCatalog => ({
    version: GACHA_CATALOG_VERSION,
    items: [],
    updatedAt: 0,
  });

  const GachaCatalogDB = {
    DB_NAME: 'acu_gacha_catalogs',
    STORE_NAME: 'catalogs',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,

    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = () => {
          console.error('[DICE][GACHA]自定义物品 IndexedDB 打开失败:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };

        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME, { keyPath: 'scopeKey' });
          }
        };
      });
    },

    async get(scopeKey: string): Promise<GachaCatalogRecord | null> {
      if (!scopeKey) return null;

      try {
        const db = await this.init();
        return await new Promise((resolve, reject) => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          let record: GachaCatalogRecord | null = null;
          tx.oncomplete = () => resolve(record);
          tx.onerror = () => {
            console.warn('[DICE][GACHA]读取自定义物品 IndexedDB 事务失败:', tx.error);
            reject(tx.error || new Error('读取自定义物品 IndexedDB 事务失败'));
          };
          tx.onabort = () => reject(tx.error || new Error('读取自定义物品 IndexedDB 事务中止'));
          const request = tx.objectStore(this.STORE_NAME).get(scopeKey);
          request.onsuccess = () => {
            record = (request.result as GachaCatalogRecord | undefined) || null;
          };
          request.onerror = () => {
            console.warn('[DICE][GACHA]读取自定义物品 IndexedDB 请求失败:', request.error);
            reject(request.error || new Error('读取自定义物品 IndexedDB 请求失败'));
          };
        });
      } catch (error) {
        console.warn('[DICE][GACHA]读取自定义物品 IndexedDB 失败:', error);
        throw error;
      }
    },

    async put(record: GachaCatalogRecord): Promise<boolean> {
      try {
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => {
            console.error('[DICE][GACHA]写入自定义物品 IndexedDB 事务失败:', tx.error);
          };
          tx.onabort = () => {
            console.error('[DICE][GACHA]写入自定义物品 IndexedDB 事务中止:', tx.error);
            resolve(false);
          };
          const request = tx.objectStore(this.STORE_NAME).put(record);
          request.onerror = () => {
            console.error('[DICE][GACHA]写入自定义物品 IndexedDB 失败:', request.error);
          };
        });
      } catch (error) {
        console.error('[DICE][GACHA]写入自定义物品 IndexedDB 异常:', error);
        return false;
      }
    },

    async getAll(): Promise<GachaCatalogRecord[]> {
      try {
        const db = await this.init();
        return await new Promise((resolve, reject) => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          let records: GachaCatalogRecord[] = [];
          tx.oncomplete = () => resolve(records);
          tx.onerror = () => {
            console.warn('[DICE][GACHA]读取全部自定义物品 IndexedDB 事务失败:', tx.error);
          };
          tx.onabort = () => reject(tx.error || new Error('读取全部自定义物品事务中止'));
          const request = tx.objectStore(this.STORE_NAME).getAll();
          request.onsuccess = () => {
            records = (request.result || []) as GachaCatalogRecord[];
          };
          request.onerror = () => {
            console.warn('[DICE][GACHA]读取全部自定义物品 IndexedDB 请求失败:', request.error);
          };
        });
      } catch (error) {
        console.warn('[DICE][GACHA]读取全部自定义物品 IndexedDB 失败:', error);
        throw error;
      }
    },

    async clear(): Promise<boolean> {
      try {
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => {
            console.error('[DICE][GACHA]清空自定义物品 IndexedDB 事务失败:', tx.error);
          };
          tx.onabort = () => {
            console.error('[DICE][GACHA]清空自定义物品 IndexedDB 事务中止:', tx.error);
            resolve(false);
          };
          const request = tx.objectStore(this.STORE_NAME).clear();
          request.onerror = () => {
            console.error('[DICE][GACHA]清空自定义物品 IndexedDB 失败:', request.error);
          };
        });
      } catch (error) {
        console.error('[DICE][GACHA]清空自定义物品 IndexedDB 失败:', error);
        return false;
      }
    },

    async replaceAll(records: readonly GachaCatalogRecord[]): Promise<boolean> {
      try {
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => {
            console.error('[DICE][GACHA]替换自定义物品 IndexedDB 事务失败:', tx.error);
          };
          tx.onabort = () => {
            console.error('[DICE][GACHA]替换自定义物品 IndexedDB 事务中止:', tx.error);
            resolve(false);
          };
          const clearRequest = store.clear();
          clearRequest.onerror = () => {
            console.error('[DICE][GACHA]替换自定义物品 IndexedDB 清空失败:', clearRequest.error);
          };
          clearRequest.onsuccess = () => {
            try {
              records.forEach(record => {
                const request = store.put(record);
                request.onerror = () => {
                  console.error('[DICE][GACHA]替换自定义物品 IndexedDB 写入失败:', request.error);
                };
              });
            } catch (error) {
              console.error('[DICE][GACHA]替换自定义物品 IndexedDB 写入异常:', error);
              tx.abort();
            }
          };
        });
      } catch (error) {
        console.error('[DICE][GACHA]替换自定义物品 IndexedDB 失败:', error);
        return false;
      }
    },
  };

  const normalizeGachaCatalogRecord = (catalogRaw: unknown): GachaCatalog | null => {
    if (!catalogRaw || typeof catalogRaw !== 'object') return null;
    const record = catalogRaw as Record<string, unknown>;
    const items = Array.isArray(record.items)
      ? record.items.filter((item): item is GachaItemDefinition => Boolean(item && typeof item === 'object'))
      : [];
    return {
      version: Number(record.version) || GACHA_CATALOG_VERSION,
      items,
      updatedAt: Math.max(0, Number(record.updatedAt) || 0),
    };
  };

  const normalizeScopedGachaCatalogRecord = (recordRaw: unknown): GachaCatalogRecord | null => {
    if (!recordRaw || typeof recordRaw !== 'object') return null;
    const scopeKey = String((recordRaw as Record<string, unknown>).scopeKey || '').trim();
    const catalog = normalizeGachaCatalogRecord(recordRaw);
    if (!scopeKey || !catalog) return null;
    return {
      scopeKey,
      version: catalog.version,
      items: cloneGachaCatalogItems(catalog.items),
      updatedAt: catalog.updatedAt,
    };
  };

  const getGachaCatalogItemMergeTimestamp = (item: GachaItemDefinition, fallback = 0): number =>
    Math.max(0, Number(item.updatedAt) || 0, Number(item.createdAt) || 0, Number(fallback) || 0);

  const getGachaCatalogRecordMergeTimestamp = (record: GachaCatalogRecord): number =>
    Math.max(
      Number(record.updatedAt) || 0,
      ...record.items.map(item => getGachaCatalogItemMergeTimestamp(item)),
    );

  const mergeGachaCatalogRecordsToGlobalScope = (
    records: readonly GachaCatalogRecord[],
  ): GachaCatalogRecord | null => {
    const normalizedRecords = records
      .map(normalizeScopedGachaCatalogRecord)
      .filter((record): record is GachaCatalogRecord => Boolean(record))
      .sort((a, b) => {
        const byTimestamp = getGachaCatalogRecordMergeTimestamp(a) - getGachaCatalogRecordMergeTimestamp(b);
        if (byTimestamp !== 0) return byTimestamp;
        if (a.scopeKey === GACHA_CATALOG_GLOBAL_SCOPE_KEY && b.scopeKey !== GACHA_CATALOG_GLOBAL_SCOPE_KEY) return 1;
        if (b.scopeKey === GACHA_CATALOG_GLOBAL_SCOPE_KEY && a.scopeKey !== GACHA_CATALOG_GLOBAL_SCOPE_KEY) return -1;
        return a.scopeKey.localeCompare(b.scopeKey);
      });
    if (normalizedRecords.length === 0) return null;

    const items: GachaItemDefinition[] = [];
    const itemIndexById = new Map<string, number>();
    const itemTimestampById = new Map<string, number>();
    let version = GACHA_CATALOG_VERSION;
    let updatedAt = 0;

    normalizedRecords.forEach(record => {
      version = Math.max(version, record.version || 1);
      updatedAt = Math.max(updatedAt, Number(record.updatedAt) || 0);
      record.items.forEach(item => {
        const id = String(item.id || '').trim();
        if (!id) return;
        const incoming: GachaItemDefinition = cloneDiceConfigBackupValue({ ...item, id });
        const incomingTimestamp = getGachaCatalogItemMergeTimestamp(incoming, record.updatedAt);
        const existingIndex = itemIndexById.get(id);
        if (existingIndex === undefined) {
          itemIndexById.set(id, items.length);
          itemTimestampById.set(id, incomingTimestamp);
          items.push(incoming);
          updatedAt = Math.max(updatedAt, incomingTimestamp);
          return;
        }

        const existing = items[existingIndex];
        const existingTimestamp =
          itemTimestampById.get(id) ?? getGachaCatalogItemMergeTimestamp(existing, updatedAt);
        if (incomingTimestamp >= existingTimestamp) {
          items[existingIndex] = {
            ...existing,
            ...incoming,
            id,
            createdAt: existing.createdAt || incoming.createdAt,
            updatedAt: incoming.updatedAt || existing.updatedAt,
          };
          itemTimestampById.set(id, incomingTimestamp);
          updatedAt = Math.max(updatedAt, incomingTimestamp);
        }
      });
    });

    return {
      scopeKey: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
      version,
      items,
      updatedAt,
    };
  };

  const migrateGachaCatalogRecordsToGlobalScope = async (): Promise<GachaCatalog> => {
    const records = await GachaCatalogDB.getAll();
    const normalizedRecords = records
      .map(normalizeScopedGachaCatalogRecord)
      .filter((record): record is GachaCatalogRecord => Boolean(record));
    const mergedRecord = mergeGachaCatalogRecordsToGlobalScope(normalizedRecords);
    if (!mergedRecord) return createEmptyGachaCatalog();

    const needsMigration =
      normalizedRecords.length !== 1 || normalizedRecords[0]?.scopeKey !== GACHA_CATALOG_GLOBAL_SCOPE_KEY;
    if (!needsMigration) {
      return {
        version: mergedRecord.version,
        items: cloneGachaCatalogItems(mergedRecord.items),
        updatedAt: mergedRecord.updatedAt,
      };
    }

    const migratedRecord: GachaCatalogRecord = {
      ...mergedRecord,
      items: cloneGachaCatalogItems(mergedRecord.items),
      updatedAt: Date.now(),
    };
    const replaced = await GachaCatalogDB.replaceAll([migratedRecord]);
    if (!replaced) throw new Error('自定义物品目录全局迁移失败');
    const legacyCount = normalizedRecords.filter(record => record.scopeKey !== GACHA_CATALOG_GLOBAL_SCOPE_KEY).length;
    if (legacyCount > 0) {
      console.info(
        `[DICE][GACHA]已将 ${legacyCount} 个聊天自定义物品目录合并为全局目录，共 ${migratedRecord.items.length} 个物品。`,
      );
    }
    return {
      version: migratedRecord.version,
      items: cloneGachaCatalogItems(migratedRecord.items),
      updatedAt: migratedRecord.updatedAt,
    };
  };

  const getGachaItemDefinitionFingerprint = (item: GachaItemDefinition | null | undefined): string => {
    if (!item) return '';
    const comparable = {
      id: item.id,
      name: item.name,
      type: item.type,
      quality: item.quality,
      tags: item.tags || '',
      effect: item.effect || '',
      description: item.description,
      poolTags: [...(item.poolTags || [])].sort(),
      icon: item.icon || '',
      weight: Number(item.weight || 0),
      stackable: item.stackable === true,
      unique: item.unique === true,
      grantQuantity: Number(item.grantQuantity || 0),
      rewardTarget: item.rewardTarget || 'inventory',
      targetTable: item.targetTable || '',
      targetColumns: item.targetColumns || null,
      customFields: item.customFields || null,
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
    };
    return JSON.stringify(comparable);
  };

  const getStoredGachaCatalog = (_rawData, createIfMissing = false): GachaCatalog | null => {
    const scopeKey = getGachaCatalogScopeKey();
    if (gachaCatalogCache?.scopeKey === scopeKey) return gachaCatalogCache.catalog;
    return createIfMissing ? createEmptyGachaCatalog() : null;
  };

  const saveStoredGachaCatalog = async (items: GachaItemDefinition[]): Promise<GachaCatalog | null> => {
    const scopeKey = getGachaCatalogScopeKey();
    const catalog: GachaCatalog = {
      version: GACHA_CATALOG_VERSION,
      items: cloneGachaCatalogItems(items),
      updatedAt: Date.now(),
    };
    const saved = await GachaCatalogDB.put({
      scopeKey,
      version: catalog.version,
      items: cloneGachaCatalogItems(catalog.items),
      updatedAt: catalog.updatedAt,
    });
    if (!saved) return null;
    gachaCatalogCache = { scopeKey, catalog };
    return catalog;
  };

  const ensureGachaCatalogLoaded = async (_rawData?: unknown): Promise<GachaCatalog> => {
    const scopeKey = getGachaCatalogScopeKey();
    if (gachaCatalogCache?.scopeKey === scopeKey) return gachaCatalogCache.catalog;
    if (gachaCatalogLoadTask?.scopeKey === scopeKey) return gachaCatalogLoadTask.promise;

    const loadPromise = (async (): Promise<GachaCatalog> => {
      const catalog = await migrateGachaCatalogRecordsToGlobalScope();
      gachaCatalogCache = { scopeKey, catalog };
      return catalog;
    })();

    gachaCatalogLoadTask = { scopeKey, promise: loadPromise };
    try {
      return await loadPromise;
    } finally {
      if (gachaCatalogLoadTask?.scopeKey === scopeKey) gachaCatalogLoadTask = null;
    }
  };

  const getCustomGachaItemDefinitions = (rawData): GachaItemDefinition[] =>
    getStoredGachaCatalog(rawData, false)?.items || [];

  const getRuntimeGachaRawData = () => getCachedRawData() || getTableData();

  const getAllGachaItemDefinitions = (rawData = getRuntimeGachaRawData()): GachaItemDefinition[] => {
    const byId = new Map<string, GachaItemDefinition>();
    GACHA_ITEM_DEFINITIONS.forEach(item => byId.set(item.id, item));
    getCustomGachaItemDefinitions(rawData).forEach(item => byId.set(item.id, item));
    const settings = getStoredGachaItemSettings();
    return Array.from(byId.values()).map(item => withGachaItemSettings(item, settings));
  };

  const hashGachaCatalogSeed = (value: string): number => {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };

  const buildStableGachaCustomItemId = (item: Pick<GachaItemDefinition, 'name' | 'quality' | 'type'>): string => {
    const seed = `${item.name}|${item.quality}|${item.type}`;
    return `custom_${hashGachaCatalogSeed(seed).toString(36)}`;
  };

  const EQUIPMENT_TABLE_TYPE_VALUES = ['武器', '防具', '饰品'] as const;
  type EquipmentTableType = (typeof EQUIPMENT_TABLE_TYPE_VALUES)[number];
  const inferEquipmentTableTypeForGachaItem = (
    item: Pick<GachaItemDefinition, 'id' | 'name' | 'type' | 'description'>,
  ): EquipmentTableType => {
    const rawType = String(item.type || '').trim();
    // 历史自定义目录可能仍保存“护具/衣物”，统一归一化到仙SQL装备表三枚举。
    if (rawType === '护具' || rawType === '衣物') return '防具';
    if ((EQUIPMENT_TABLE_TYPE_VALUES as readonly string[]).includes(rawType)) return rawType as EquipmentTableType;

    const haystack = `${item.id || ''} ${item.name || ''} ${rawType} ${item.description || ''}`.toLowerCase();
    const includesAny = (keywords: string[]) => keywords.some(keyword => haystack.includes(keyword.toLowerCase()));

    if (
      includesAny([
        'sword',
        'blade',
        'crowbar',
        'wand',
        'excalibur',
        'rake',
        'handgun',
        'gun',
        'bow',
        'spear',
        'axe',
        'staff',
        'hammer',
        'knife',
        'dagger',
        '剑',
        '刀',
        '枪',
        '弓',
        '弩',
        '矛',
        '戟',
        '斧',
        '锤',
        '棍',
        '杖',
        '鞭',
        '刃',
        '匕',
        '叉',
        '铳',
      ])
    ) {
      return '武器';
    }

if (includesAny(['armor', 'breastplate', 'shield', 'helmet', 'helm', '甲', '铠', '盾', '盔', '护甲', '胸甲'])) {
      return '防具';
    }
    if (
      includesAny([
        'cloak',
        'glove',
        'sash',
        'robe',
        'coat',
        'cloth',
        'dress',
        'boots',
        'shoes',
        '衣',
        '袍',
        '服',
        '披风',
        '斗篷',
        '手套',
        '靴',
        '鞋',
        '帽',
        '冠',
        '巾',
        '带',
      ])
    ) {
      return '防具';
    }

    if (
      includesAny([
        'ring',
        'necklace',
        'amulet',
        'pendant',
        'bracelet',
        'earring',
        'talisman',
        'charm',
        '戒',
        '环',
        '项链',
        '护符',
        '吊坠',
        '手镯',
        '耳环',
        '玉佩',
        '符',
        '珠',
      ])
    ) {
      return '饰品';
    }

    return '饰品';
  };

  const createUniqueGachaItemId = (baseId: string, existingIds: Set<string>): string => {
    const safeBase =
      String(baseId || 'custom_item')
        .trim()
        .replace(/[^\w-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 64) || 'custom_item';
    let nextId = safeBase;
    let suffix = 2;
    while (existingIds.has(nextId)) {
      nextId = `${safeBase}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(nextId);
    return nextId;
  };

  const normalizeGachaTimestamp = (value: unknown): number | undefined => {
    if (value === undefined || value === null || value === '') return undefined;
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numeric) && numeric > 0) return Math.floor(numeric);
    const parsed = Date.parse(String(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };

  const normalizeImportedGachaPoolTags = (
    rawTags: unknown,
    tagAliases: Record<string, GachaPoolTag> = {},
  ): GachaPoolTag[] => {
    const values = Array.isArray(rawTags) ? rawTags : typeof rawTags === 'string' ? rawTags.split(/[、,，\s]+/) : [];
    const tags = new Set<GachaPoolTag>();
    values.forEach(value => {
      const tag = normalizeGachaPoolId(value);
      if (!tag) return;
      const aliasedTag = tagAliases[tag] || tag;
      if (aliasedTag === GACHA_ALL_POOL_TAG) {
        getGachaAllExpandablePoolTags().forEach(candidate => tags.add(candidate));
      } else {
        tags.add(aliasedTag);
      }
    });
    return Array.from(tags);
  };

  const normalizeImportedGachaItem = (
    rawItem: unknown,
    index: number,
    errors: string[],
    tagAliases: Record<string, GachaPoolTag> = {},
  ): NormalizedGachaCatalogItem | null => {
    if (!rawItem || typeof rawItem !== 'object') {
      errors.push(`第 ${index + 1} 项不是有效对象`);
      return null;
    }
    const record = rawItem as Record<string, unknown>;
    const name = String(record.name || '').trim();
    if (!name) {
      errors.push(`第 ${index + 1} 项缺少 name，已跳过`);
      return null;
    }
    const quality = String(record.quality || '').trim() as GachaRarity;
    if (!GACHA_RARITY_ORDER.includes(quality)) {
      errors.push(`「${name}」的 quality 无效，已跳过`);
      return null;
    }
    const legacyPoolTags = Array.isArray(record.tags) ? record.tags : undefined;
    const poolTags = normalizeImportedGachaPoolTags(
      record.poolTags ?? record.poolTag ?? record.pools ?? legacyPoolTags ?? record.pool,
      tagAliases,
    );
    if (poolTags.length === 0) {
      errors.push(`「${name}」没有有效 poolTags，已跳过`);
      return null;
    }
    const weight = Number(record.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      errors.push(`「${name}」的 weight 必须为正数，已跳过`);
      return null;
    }
    const grantQuantity = Math.floor(Number(record.grantQuantity));
    if (!Number.isFinite(grantQuantity) || grantQuantity <= 0) {
      errors.push(`「${name}」的 grantQuantity 必须为正整数，已跳过`);
      return null;
    }
    const rewardTarget = GACHA_REWARD_TARGETS.includes(record.rewardTarget as GachaRewardTarget)
      ? (record.rewardTarget as GachaRewardTarget)
      : 'inventory';
    const description = String(record.description || '').trim();
    const rawCustomFields =
      record.customFields && typeof record.customFields === 'object' && !Array.isArray(record.customFields)
        ? (record.customFields as Record<string, unknown>)
        : {};
    const readLegacyStandardField = (aliases: readonly string[]): string => {
      for (const [key, value] of Object.entries(rawCustomFields)) {
        if (isGachaFieldAlias(key, aliases) && (typeof value === 'string' || typeof value === 'number')) {
          const text = String(value).trim();
          if (text) return text;
        }
      }
      return '';
    };
    const tags =
      (typeof record.tags === 'string' ? String(record.tags).trim() : '') ||
      readLegacyStandardField(GACHA_TAG_FIELD_ALIASES);
    const effect =
      String(record.effect ?? record.effects ?? '').trim() || readLegacyStandardField(GACHA_EFFECT_FIELD_ALIASES);
    const rawType = String(record.type || '').trim();
    const type =
      rewardTarget === 'equipment'
        ? inferEquipmentTableTypeForGachaItem({ id: String(record.id || '').trim(), name, type: rawType, description })
        : rawType || '道具';
    const generatedId = !String(record.id || '').trim();
    const order = Number(record.order);
    const customFields = normalizeGachaCustomFields(
      Object.fromEntries(
        Object.entries(rawCustomFields).filter(
          ([key]) =>
            !isGachaFieldAlias(key, GACHA_TAG_FIELD_ALIASES) &&
            !isGachaFieldAlias(key, GACHA_EFFECT_FIELD_ALIASES),
        ),
      ),
    );
    const targetTable = normalizeGachaTargetTable(record.targetTable);
    const targetColumns = normalizeGachaTargetColumns(record.targetColumns);
    const item: NormalizedGachaCatalogItem = {
      id: generatedId ? buildStableGachaCustomItemId({ name, quality, type }) : String(record.id || '').trim(),
      name,
      type,
      quality,
      ...(tags ? { tags } : {}),
      ...(effect ? { effect } : {}),
      description,
      poolTags,
      icon: String(record.icon || '').trim() || undefined,
      enabled: normalizeGachaItemEnabled(record.enabled),
      order: Number.isFinite(order) ? normalizeGachaItemOrder(order) : undefined,
      createdAt: normalizeGachaTimestamp(record.createdAt || record.created_at),
      updatedAt: normalizeGachaTimestamp(record.updatedAt || record.updated_at),
      weight,
      stackable: record.stackable === true,
      unique: record.unique === true || quality === GACHA_UNIQUE_RARITY,
      grantQuantity,
      rewardTarget,
      generatedId,
    };
    if (targetTable) item.targetTable = targetTable;
    if (targetColumns) item.targetColumns = targetColumns;
    if (customFields) item.customFields = customFields;
    return item;
  };

  const normalizeImportedGachaPools = (rawPools: unknown): NormalizedImportedGachaPools => {
    const result: NormalizedImportedGachaPools = { pools: [], tagAliases: {} };
    if (!Array.isArray(rawPools)) return result;
    result.pools = rawPools
      .map((rawPool, index) => {
        if (typeof rawPool === 'string') {
          const id = normalizeGachaPoolId(rawPool);
          if (!id || id === GACHA_ALL_POOL_TAG) return null;
          return buildDefaultGachaPoolDefinition(id, {
            name: id,
            builtin: isBuiltinGachaPoolId(id),
            visibleInTabs: true,
            includeInAll: true,
            order: 100 + index * 10,
          });
        }
        if (!rawPool || typeof rawPool !== 'object') return null;
        const record = rawPool as Record<string, unknown>;
        const rawId = normalizeGachaPoolId(record.id || record.tag || record.name);
        const rawName = normalizeGachaPoolName(
          record.name || record.label || rawId,
          rawId || GACHA_CUSTOM_ONLY_POOL_TAG,
        );
        const shouldUseNameAsCustomId =
          rawId &&
          rawId !== GACHA_ALL_POOL_TAG &&
          rawName !== rawId &&
          (rawId === GACHA_CUSTOM_ONLY_POOL_TAG || (isBuiltinGachaPoolId(rawId) && record.builtin !== true));
        const normalized = normalizeGachaPoolDefinition({
          ...record,
          id: shouldUseNameAsCustomId ? rawName : rawId,
          name: rawName,
        });
        if (!normalized || normalized.id === GACHA_ALL_POOL_TAG) return null;
        if (shouldUseNameAsCustomId) {
          result.tagAliases[rawId] = normalized.id;
        }
        return {
          ...normalized,
          builtin: isBuiltinGachaPoolId(normalized.id),
          order: Number.isFinite(Number(normalized.order)) ? Number(normalized.order) : 100 + index * 10,
        };
      })
      .filter((pool): pool is GachaPoolDefinition => Boolean(pool));
    return result;
  };

  const analyzeGachaCatalogImport = (jsonString: string, rawData): GachaCatalogImportAnalysis | null => {
    let data: unknown;
    try {
      data = parseJsoncValue(jsonString);
    } catch (error) {
      console.error('[DICE][GACHA]自定义物品卡池 JSON 解析失败:', error);
      return null;
    }
    const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
    const rawItems = Array.isArray(record.items) ? record.items : Array.isArray(data) ? data : [];
    if (!Array.isArray(rawItems)) return null;
    const importedPools = normalizeImportedGachaPools(record.pools);

    const errors: string[] = [];
    const items = rawItems
      .map((item, index) => normalizeImportedGachaItem(item, index, errors, importedPools.tagAliases))
      .filter((item): item is NormalizedGachaCatalogItem => Boolean(item));
    const existingIds = new Set(getAllGachaItemDefinitions(rawData).map(item => item.id));
    const seenImportIds = new Set<string>();
    const duplicateIds = new Set<string>();
    items.forEach(item => {
      if (seenImportIds.has(item.id)) duplicateIds.add(item.id);
      seenImportIds.add(item.id);
    });
    const conflictIds = Array.from(
      new Set(items.map(item => item.id).filter(id => existingIds.has(id) || duplicateIds.has(id))),
    );
    return {
      items,
      pools: importedPools.pools,
      skipped: rawItems.length - items.length,
      errors,
      conflictIds,
    };
  };

  const formatGachaCatalogImportErrors = (errors: readonly string[], limit = 6): string => {
    if (!errors.length) return '';
    const visibleErrors = errors.slice(0, limit).join('；');
    return errors.length > limit ? `${visibleErrors}；还有 ${errors.length - limit} 项错误未显示` : visibleErrors;
  };

  const getGachaCatalogImportFailureMessage = (analysis: GachaCatalogImportAnalysis | null): string => {
    if (!analysis) {
      return '导入失败：JSON / JSONC 格式错误，或顶层结构无法解析。请确认文件是对象，且包含 items 数组。';
    }
    const errorText = formatGachaCatalogImportErrors(analysis.errors);
    if (errorText) return `导入失败：没有有效物品。${errorText}`;
    return '导入失败：没有有效物品。请确认 items 是非空数组，并且每个物品都包含 name、quality、poolTags、weight、grantQuantity。';
  };

  const validateGachaCatalogImportItemTarget = (rawData, item: GachaItemDefinition, warnings: string[]): boolean => {
    try {
      const parsed = getGachaRewardParseResultForItem(rawData, item);
      const sheet = parsed.tableKey && rawData ? rawData[parsed.tableKey] : undefined;
      const validation = validateGachaCustomFieldsForTargetTable({
        target: item.rewardTarget,
        tableName: parsed.tableName,
        headers: parsed.headers,
        sheet,
        item,
        throwOnMissing: false,
      });
      if (validation.message) {
        warnings.push(validation.message);
        return false;
      }
      const headerRow = Array.isArray(sheet?.content?.[0]) ? sheet.content[0] : parsed.headers;
      const candidateRow = new Array(Math.max(headerRow.length, 1)).fill('');
      if (candidateRow.length > 0) candidateRow[0] = '1';
      const quantity = Math.max(1, Math.floor(Number(item.grantQuantity) || 1));
      if (item.rewardTarget === 'equipment') {
        setEquipmentRowBasicFields(candidateRow, parsed.colMap, item, quantity, headerRow, sheet);
      } else {
        setInventoryRowBasicFields(candidateRow, parsed.colMap, item, quantity);
      }
      applyGachaCustomFieldsToRow(candidateRow, headerRow, item, {
        target: item.rewardTarget,
        targetColumns: item.targetColumns,
      });
      assertCrudRequiredColumnsRepresented(parsed.tableName, headerRow, sheet);
      assertCrudInsertRequiredCells(parsed.tableName, headerRow, candidateRow, sheet, 0);
      assertCrudEnumConstraints(parsed.tableName, headerRow, candidateRow, sheet, 0);
      assertCrudLengthConstraints(parsed.tableName, headerRow, candidateRow, sheet, 0);
      return true;
    } catch (error) {
      warnings.push(getRuntimeErrorMessage(error) || `物品「${item.name || item.id}」的写入目标无法解析`);
      return false;
    }
  };

  const mergeImportedGachaPools = (pools: readonly GachaPoolDefinition[]) => {
    if (!pools.length) return;
    const current = getConfiguredGachaPoolDefinitions();
    const byId = new Map(current.map(pool => [pool.id, pool]));
    pools.forEach(pool => {
      if (!pool.id || pool.id === GACHA_ALL_POOL_TAG) return;
      const existing = byId.get(pool.id);
      const enabled = pool.includeInAll === true;
      byId.set(pool.id, {
        ...(existing || buildDefaultGachaPoolDefinition(pool.id, pool)),
        name: pool.name || existing?.name || pool.id,
        builtin: existing?.builtin === true,
        visibleInTabs: enabled,
        includeInAll: enabled,
        order: Number.isFinite(Number(pool.order)) ? Number(pool.order) : (existing?.order ?? 999),
      });
    });
    saveGachaPoolSettings(Array.from(byId.values()));
  };

  const collectGachaLocalStorageSnapshot = (keys: readonly string[]): Map<string, string | null> => {
    const snapshot = new Map<string, string | null>();
    keys.forEach(key => snapshot.set(key, localStorage.getItem(key)));
    return snapshot;
  };

  const restoreGachaLocalStorageSnapshot = (snapshot: ReadonlyMap<string, string | null>): string[] => {
    const warnings: string[] = [];
    snapshot.forEach((value, key) => {
      try {
        if (value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        warnings.push(`${key} 回滚失败：${message}`);
      }
    });
    return warnings;
  };

  const applyGachaCatalogImport = async (
    rawData,
    analysis: GachaCatalogImportAnalysis,
    mode: GachaCatalogImportMode,
  ): Promise<GachaCatalogImportStats> => {
    await ensureGachaCatalogLoaded(rawData);
    const customItems = [...getCustomGachaItemDefinitions(rawData)];
    const originalCustomItems = cloneGachaCatalogItems(customItems);
    const localStorageSnapshot = collectGachaLocalStorageSnapshot([
      STORAGE_KEY_GACHA_POOL_SETTINGS,
      STORAGE_KEY_GACHA_ITEM_SETTINGS,
    ]);
    const customIndexById = new Map(customItems.map((item, index) => [item.id, index]));
    const builtInIds = new Set(GACHA_ITEM_DEFINITIONS.map(item => item.id));
    const existingIds = new Set(getAllGachaItemDefinitions(rawData).map(item => item.id));
    const importedItemSettings: Array<{ id: string; enabled: boolean; order?: number }> = [];
    const stats: GachaCatalogImportStats = { added: 0, updated: 0, renamed: 0, skipped: analysis.skipped, warnings: [] };
    const importTimestamp = Date.now();

    analysis.items.forEach(item => {
      const isBuiltInConflict = builtInIds.has(item.id);
      const customIndex = customIndexById.get(item.id);
      const hasConflict = isBuiltInConflict || customIndex !== undefined;
      if (hasConflict && mode === 'skip') {
        stats.skipped += 1;
        return;
      }

      const nextItem: GachaItemDefinition = {
        id: item.id,
        name: item.name,
        type: item.type,
        quality: item.quality,
        ...(item.tags ? { tags: item.tags } : {}),
        ...(item.effect ? { effect: item.effect } : {}),
        description: item.description,
        poolTags: [...item.poolTags],
        icon: item.icon,
        enabled: isGachaItemEnabled(item),
        order: item.order,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt || importTimestamp,
        weight: item.weight,
        stackable: item.stackable,
        unique: item.unique,
        grantQuantity: item.grantQuantity,
        rewardTarget: item.rewardTarget,
      };
      if (item.targetTable) nextItem.targetTable = item.targetTable;
      if (item.targetColumns) nextItem.targetColumns = item.targetColumns;
      if (item.customFields) nextItem.customFields = item.customFields;
      if (!validateGachaCatalogImportItemTarget(rawData, nextItem, stats.warnings)) {
        stats.skipped += 1;
        return;
      }

      if (hasConflict && mode === 'rename') {
        nextItem.id = createUniqueGachaItemId(item.id, existingIds);
        nextItem.createdAt = nextItem.createdAt || importTimestamp;
        customItems.push(nextItem);
        customIndexById.set(nextItem.id, customItems.length - 1);
        importedItemSettings.push({ id: nextItem.id, enabled: isGachaItemEnabled(nextItem), order: nextItem.order });
        stats.renamed += 1;
        return;
      }

      if (customIndex !== undefined) {
        nextItem.createdAt = customItems[customIndex].createdAt || nextItem.createdAt || importTimestamp;
        customItems[customIndex] = nextItem;
        stats.updated += 1;
      } else {
        nextItem.createdAt = nextItem.createdAt || importTimestamp;
        customItems.push(nextItem);
        customIndexById.set(nextItem.id, customItems.length - 1);
        existingIds.add(nextItem.id);
        hasConflict ? (stats.updated += 1) : (stats.added += 1);
      }
      importedItemSettings.push({ id: nextItem.id, enabled: isGachaItemEnabled(nextItem), order: nextItem.order });
    });

    const savedCatalog = await saveStoredGachaCatalog(customItems);
    if (!savedCatalog) throw new Error('自定义物品保存失败');
    try {
      if (stats.added + stats.updated + stats.renamed > 0) mergeImportedGachaPools(analysis.pools);
      if (importedItemSettings.length > 0) {
        const record = getStoredGachaItemSettings();
        const nextSettings = { ...record.items };
        importedItemSettings.forEach(entry => {
          const existing = nextSettings[entry.id] || { enabled: true, order: 999 };
          nextSettings[entry.id] = {
            enabled: entry.enabled,
            order: entry.order !== undefined ? normalizeGachaItemOrder(entry.order) : existing.order,
          };
        });
        saveGachaItemSettingsRecord(nextSettings);
      }
      ensureGachaPoolsForTags(customItems.flatMap(item => [...item.poolTags]));
    } catch (error) {
      const rolledBackCatalog = await saveStoredGachaCatalog(originalCustomItems);
      const rollbackWarnings = restoreGachaLocalStorageSnapshot(localStorageSnapshot);
      const message = getRuntimeErrorMessage(error) || '写入卡池或物品设置失败';
      const rollbackMessage = [
        !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
        ...rollbackWarnings,
      ].filter(Boolean).join('；');
      if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
      throw error;
    }
    return stats;
  };

  const clearGlobalGachaCatalog = async () => {
    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const originalItems = cloneGachaCatalogItems(getCustomGachaItemDefinitions(rawData));
      const localStorageSnapshot = collectGachaLocalStorageSnapshot([STORAGE_KEY_GACHA_ITEM_SETTINGS]);
      const customIds = getCustomGachaItemDefinitions(rawData).map(item => item.id);
      const count = customIds.length;
      const savedCatalog = await saveStoredGachaCatalog([]);
      if (!savedCatalog) throw new Error('自定义物品清空失败');
      try {
        customIds.forEach(deleteGachaItemSetting);
      } catch (error) {
        const rolledBackCatalog = await saveStoredGachaCatalog(originalItems);
        const rollbackWarnings = restoreGachaLocalStorageSnapshot(localStorageSnapshot);
        const message = getRuntimeErrorMessage(error) || '清空自定义物品设置失败';
        const rollbackMessage = [
          !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
          ...rollbackWarnings,
        ].filter(Boolean).join('；');
        if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
        throw error;
      }
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
      if (window.toastr) window.toastr.success(`已清空全局目录的 ${count} 个自定义物品`);
    });
  };

  const showGachaCatalogClearDialog = async () => {
    const { $ } = getCore();
    const config = getConfig();
    const rawData = getRuntimeGachaRawData();
    await ensureGachaCatalogLoaded(rawData);
    const count = getCustomGachaItemDefinitions(rawData).length;
    $('.acu-import-confirm-overlay').remove();
    const dialog = $(`
      <div class="acu-import-confirm-overlay acu-gacha-catalog-dialog-overlay acu-theme-${config.theme}">
        <div class="acu-import-confirm-dialog">
          <div class="acu-import-confirm-header">
            <span class="acu-import-confirm-title"><i class="fa-solid fa-broom"></i> 清空自定义物品</span>
            <button class="acu-import-close-btn acu-gacha-catalog-clear-close" type="button" title="关闭" aria-label="关闭">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="acu-import-confirm-body">
            <div class="acu-import-warning-container">
              <i class="fa-solid fa-broom acu-import-warning-icon acu-gacha-catalog-import-icon"></i>
              <div class="acu-import-warning-title">全局目录有 ${escapeHtml(String(count))} 个自定义物品</div>
              <div class="acu-import-warning-message">清空后会影响所有聊天可见的自定义物品；不会影响内置卡池，也不会删除已经写入目标表的奖励。</div>
            </div>
          </div>
          <div class="acu-import-confirm-footer acu-gacha-catalog-clear-footer">
            <button class="acu-import-cancel-btn acu-gacha-catalog-clear-close" type="button">取消</button>
            <button class="acu-import-confirm-btn acu-gacha-catalog-clear-global" type="button">清空全局目录</button>
          </div>
        </div>
      </div>
    `);
    $('body').append(dialog);
    const closeDialog = () => dialog.remove();
    setupOverlayClose(dialog, 'acu-import-confirm-overlay', closeDialog);
    dialog.on('click', '.acu-gacha-catalog-clear-close', closeDialog);
    dialog.on('click', '.acu-gacha-catalog-clear-global', () => {
      closeDialog();
      void clearGlobalGachaCatalog().catch(error => {
        console.error('[DICE][GACHA]清空全局自定义物品失败:', error);
        if (window.toastr) showActionableErrorToast(`清空失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });
  };

  const buildGachaCatalogTemplateJsonc = (): string => `{
  // 骰子商店自定义物品与卡池导入模板。
  // 注意：抽到或兑换的奖励默认写入当前仪表盘预设解析到的物品/装备区，也可以用 targetTable 固定到指定表。
  // 建议让 name、type、quality、description、rewardTarget 等字段满足当前 DDL 的 NOT NULL、CHECK、LENGTH 等检验。
  // 如果世界观需要更长名称/描述、新类型、新品质，或额外必填列，请先到数据库本体修改对应表 DDL 并重新校验 DDL。
  // 使用方法：
  // 1. 复制下面被 /* ... */ 注释包住的示例物品。
  // 2. 删除包住某个物品的 /* 和 */，再按你的设定修改字段。
  // 3. 如果要写多个物品，用英文逗号分隔每个物品对象。
  // 4. 保存后从骰子商店点击“导入自定义物品”。
  "kind": "${GACHA_CATALOG_EXPORT_KIND}",
  "version": ${GACHA_CATALOG_VERSION},
  "exportedAt": ${Date.now()},
  "pools": [
    /*
    {
      // id：卡池唯一标识。物品的 poolTags 使用这个值。
      "id": "赛博朋克",

      // name：卡池显示名。
      "name": "赛博朋克",

      // includeInAll：是否启用该卡池。启用后会显示快捷标签，并加入“全部”卡池抽取范围。
      "includeInAll": true,

      // order：排序，越小越靠前。
      "order": 100
    }
    */
  ],
  "items": [
    /*
    {
      // id：物品唯一标识。建议只用英文、数字、下划线。留空或删除 id 时会按名称/品质/类型自动生成。
      "id": "custom_lucky_coin",

      // name：物品显示名称，必填。默认模板中物品表名称 ≤10 字、装备表建议 ≤12 字；若你的 DDL 更严格/更宽松，以当前数据库本体为准。
      "name": "幸运硬币",

      // type：写入对应表格的类型。默认模板已放松为 TEXT NOT NULL，可按世界观填写；若你的 DDL 仍有 CHECK 枚举，请填写允许值或先修改 DDL。
      "type": "道具",

      // quality：必填。仙SQL 支持 普通、优秀、稀有、史诗、传说、神话、唯一。
      "quality": "稀有",

      // tags：可选，对应仙SQL的“标签”列；省略时自动生成 [类型][品质]。
      "tags": "[幸运][检定]",

      // effect：可选，对应仙SQL的“效果”列；省略时回退使用 description。
      "effect": "下一次普通检定获得轻微好运。",

      // description：外观、来历或补充说明，对应仙SQL的“描述”列，也会在商店第二行展示。
      "description": "一枚总能落在正面的硬币。",

      // poolTags：出现在哪些卡池。可填写内置卡池或自定义卡池 id；写 全部 会自动展开为当前加入“全部”的卡池。
      "poolTags": ["赛博朋克"],

      // icon：可选，符号图标。支持 fa:box、ti:wand 这类格式，也可直接写一个 emoji。图片类图标请到“图标管理预设”里配置。
      "icon": "fa:coins",

      // enabled：是否参与抽取和碎片商城兑换；设置页仍会显示禁用物品。
      "enabled": true,

      // order：物品排序，越小越靠前。留空时按品质与名称兜底排序。
      "order": 100,

      // weight：同品质内的抽取权重，必须大于 0。越大越容易被抽到。
      "weight": 1,

      // stackable：是否可堆叠。true 表示抽到已有物品时增加数量；false 表示已有时转成碎片。
      "stackable": false,

      // unique：是否唯一。true 通常配合 stackable:false 使用，碎片商城也会阻止重复兑换。
      "unique": true,

      // grantQuantity：抽到时发放数量，必须是正整数。写入物品表时会增加 quantity；装备表默认无数量列，重复装备通常转为碎片。
      "grantQuantity": 1,

      // targetTable：可选。填写当前数据库里用户可见的表名，例如“装扮表”；留空则跟随当前仪表盘预设的物品/装备区。
      "targetTable": "",

      // targetColumns：可选。目标表的基础字段表头和默认/仪表盘关键词不一致时再填；值必须与表头完全一致。
      "targetColumns": { "name": "物品名称", "type": "类型", "quantity": "数量", "tags": "标签", "effect": "效果", "description": "描述" },

      // customFields：可选，自定义字段。键名必须与目标表的列标题完全一致，值会按文本保存；不会自动读取未知顶层字段。
      "customFields": { "情感分量": "怀旧" },

      // rewardTarget：inventory 走物品型写入逻辑；equipment 走装备型写入逻辑。目标表必须存在，且对应行数据要能通过该表 DDL 检验。
      "rewardTarget": "inventory"
    }
    */
  ]
}
`;

  const serializeGachaCatalogItemForExport = (item: GachaItemDefinition): GachaItemDefinition => {
    const exported: GachaItemDefinition = {
      id: item.id,
      name: item.name,
      type: item.type,
      quality: item.quality,
      ...(item.tags ? { tags: item.tags } : {}),
      ...(item.effect ? { effect: item.effect } : {}),
      description: item.description,
      poolTags: [...item.poolTags],
      enabled: isGachaItemEnabled(item),
      order: normalizeGachaItemOrder(item.order),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      weight: item.weight,
      stackable: item.stackable,
      unique: item.unique,
      grantQuantity: item.grantQuantity,
      rewardTarget: item.rewardTarget,
    };
    const targetTable = normalizeGachaTargetTable(item.targetTable);
    if (targetTable) exported.targetTable = targetTable;
    const targetColumns = normalizeGachaTargetColumns(item.targetColumns);
    if (targetColumns) exported.targetColumns = targetColumns;
    if (item.icon) exported.icon = item.icon;
    const customFields = normalizeGachaCustomFields(item.customFields);
    if (customFields) exported.customFields = customFields;
    return exported;
  };

  const serializeGachaPoolDefinitionForExport = (pool: GachaPoolDefinition) => ({
    id: pool.id,
    name: pool.name,
    builtin: pool.builtin,
    includeInAll: pool.includeInAll === true,
    order: pool.order,
  });

  const buildGachaExportNamePart = (value: string): string =>
    String(value || '自定义物品')
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 48) || '自定义物品';

  const getGachaCatalogItemsForExport = (rawData, poolId?: GachaPoolTag): GachaItemDefinition[] => {
    const normalizedPoolId = normalizeGachaPoolId(poolId);
    const allItems = getAllGachaItemDefinitions(rawData);
    if (!normalizedPoolId) {
      const customIds = new Set(getCustomGachaItemDefinitions(rawData).map(item => item.id));
      return allItems.filter(item => customIds.has(item.id));
    }
    const activeTags =
      normalizedPoolId === GACHA_ALL_POOL_TAG ? getGachaAllExpandablePoolTags(rawData) : [normalizedPoolId];
    return allItems.filter(item => item.poolTags.some(tag => activeTags.includes(tag)));
  };

  const exportGachaCatalogJson = (rawData, poolId?: GachaPoolTag): string => {
    const normalizedPoolId = normalizeGachaPoolId(poolId);
    const isPoolExport = Boolean(normalizedPoolId);
    const items = getGachaCatalogItemsForExport(rawData, normalizedPoolId);
    if (!isPoolExport && items.length === 0) return buildGachaCatalogTemplateJsonc();
    const pools = getAllGachaPoolConfigDefinitions(rawData).filter(pool => {
      if (pool.id === GACHA_ALL_POOL_TAG) return false;
      if (!normalizedPoolId || normalizedPoolId === GACHA_ALL_POOL_TAG) return true;
      return pool.id === normalizedPoolId;
    });
    const exportData = {
      kind: GACHA_CATALOG_EXPORT_KIND,
      version: GACHA_CATALOG_VERSION,
      exportedAt: Date.now(),
      pools: pools.map(serializeGachaPoolDefinitionForExport),
      items: items.map(serializeGachaCatalogItemForExport),
    };
    return JSON.stringify(exportData, null, 2);
  };

  const downloadGachaCatalogJson = async (poolId?: GachaPoolTag) => {
    const rawData = getRuntimeGachaRawData();
    await ensureGachaCatalogLoaded(rawData);
    const normalizedPoolId = normalizeGachaPoolId(poolId);
    const isPoolExport = Boolean(normalizedPoolId);
    const json = exportGachaCatalogJson(rawData, normalizedPoolId);
    const hasExportableItems = getGachaCatalogItemsForExport(rawData, normalizedPoolId).length > 0;
    const datePart = new Date().toISOString().slice(0, 10);
    let filename = '';
    if (isPoolExport) {
      const pool = getAllGachaPoolConfigDefinitions(rawData).find(candidate => candidate.id === normalizedPoolId);
      filename = `gacha-pool_${buildGachaExportNamePart(pool?.name || normalizedPoolId)}_${datePart}.json`;
    } else {
      filename = `gacha-items_${datePart}.${hasExportableItems ? 'json' : 'jsonc'}`;
    }
    if (hasExportableItems || isPoolExport) downloadJsonFile(json, filename);
    else downloadJsoncFile(json, filename);
    if (window.toastr) window.toastr.success(isPoolExport ? '卡池 JSON 已导出' : '自定义物品卡池已导出');
  };

  const formatGachaCatalogImportStatsText = (stats: GachaCatalogImportStats): string =>
    `新增 ${stats.added}，更新 ${stats.updated}，重命名 ${stats.renamed}，跳过 ${stats.skipped}${
      stats.warnings.length > 0 ? `，提示 ${stats.warnings.length}` : ''
    }`;

  const showGachaCatalogImportConfirm = (jsonString: string, analysis: GachaCatalogImportAnalysis) => {
    const { $ } = getCore();
    const config = getConfig();
    $('.acu-import-confirm-overlay').remove();
    const conflictText =
      analysis.conflictIds.length > 0
        ? `发现 ${analysis.conflictIds.length} 个同 id 物品：${analysis.conflictIds.slice(0, 5).join('、')}${
            analysis.conflictIds.length > 5 ? '…' : ''
          }`
        : '未发现 id 冲突';
    const errorHtml =
      analysis.errors.length > 0
        ? `<div class="acu-import-warning-message">${analysis.errors
            .slice(0, 6)
            .map(error => `<div>${escapeHtml(error)}</div>`)
            .join('')}${analysis.errors.length > 6 ? '<div>还有更多无效项已跳过…</div>' : ''}</div>`
        : '';
    const dialogHtml = `
      <div class="acu-import-confirm-overlay acu-gacha-catalog-dialog-overlay acu-theme-${config.theme}">
        <div class="acu-import-confirm-dialog">
          <div class="acu-import-confirm-header">
            <span class="acu-import-confirm-title"><i class="fa-solid fa-file-import"></i> 导入自定义物品</span>
            <button class="acu-import-close-btn acu-gacha-catalog-import-close" type="button" title="关闭" aria-label="关闭">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="acu-import-confirm-body">
            <div class="acu-import-warning-container">
              <i class="fa-solid fa-box-open acu-import-warning-icon acu-gacha-catalog-import-icon"></i>
              <div class="acu-import-warning-title">准备导入 ${escapeHtml(String(analysis.items.length))} 个有效物品</div>
              <div class="acu-import-warning-message">${escapeHtml(conflictText)}；已跳过 ${escapeHtml(String(analysis.skipped))} 个无效项。</div>
              ${errorHtml}
            </div>
            <div class="acu-import-conflict-options">
              <label class="acu-import-radio">
                <input type="radio" name="gacha-catalog-conflict-mode" value="overwrite" checked />
                <span>覆盖同 id 物品</span>
              </label>
              <label class="acu-import-radio">
                <input type="radio" name="gacha-catalog-conflict-mode" value="skip" />
                <span>跳过同 id 物品</span>
              </label>
              <label class="acu-import-radio">
                <input type="radio" name="gacha-catalog-conflict-mode" value="rename" />
                <span>重命名同 id 物品</span>
              </label>
            </div>
          </div>
          <div class="acu-import-confirm-footer">
            <button class="acu-import-cancel-btn">取消</button>
            <button class="acu-import-confirm-btn">确认导入</button>
          </div>
        </div>
      </div>
    `;

    const $dialog = $(dialogHtml);
    $('body').append($dialog);
    const overlayEl = $dialog[0];
    overlayEl.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.6) !important;
      z-index: 31380 !important;
      display: flex;
      justify-content: center !important;
      align-items: center !important;
      padding: 16px;
      box-sizing: border-box !important;
    `;

    const closeDialog = () => $dialog.remove();
    $dialog.find('.acu-import-cancel-btn').click(closeDialog);
    $dialog.find('.acu-gacha-catalog-import-close').click(closeDialog);
    setupOverlayClose($dialog, 'acu-import-confirm-overlay', closeDialog);
    $dialog.find('.acu-import-confirm-btn').click(function () {
      const mode = String(
        $dialog.find('input[name="gacha-catalog-conflict-mode"]:checked').val() || 'overwrite',
      ) as GachaCatalogImportMode;
      closeDialog();
      void runInSaveQueue(async () => {
        const rawData = getRuntimeGachaRawData();
        await ensureGachaCatalogLoaded(rawData);
        const latestAnalysis = analyzeGachaCatalogImport(jsonString, rawData);
        if (!latestAnalysis || latestAnalysis.items.length === 0) {
          if (window.toastr) {
            showActionableErrorToast(getGachaCatalogImportFailureMessage(latestAnalysis), { suggestion: 'importExport' });
          }
          return;
        }
        const stats = await applyGachaCatalogImport(rawData, latestAnalysis, mode);
        if (stats.warnings.length > 0) console.warn('[DICE][GACHA]自定义物品导入提示:', stats.warnings);
        refreshGachaVisualization();
        refreshGachaShardShop();
        if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
        if (window.toastr) {
          const title = stats.warnings.length > 0 ? '骰子商店导入完成，有部分跳过' : '骰子商店导入完成';
          window.toastr.success(formatGachaCatalogImportStatsText(stats), title);
        }
      }).catch(error => {
        console.error('[DICE][GACHA]导入自定义物品失败:', error);
        if (window.toastr) {
          showActionableErrorToast(`导入失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
        }
      });
    });
  };

  const importGachaCatalogJsonFromFile = () => {
    void (async () => {
      try {
        const selected = await pickTextFile();
        if (!selected) return;
        const jsonString = selected.text;
        const rawData = getRuntimeGachaRawData();
        await ensureGachaCatalogLoaded(rawData);
        const analysis = analyzeGachaCatalogImport(jsonString, rawData);
        if (!analysis || analysis.items.length === 0) {
          if (window.toastr) showActionableErrorToast(getGachaCatalogImportFailureMessage(analysis), { suggestion: 'importExport' });
          return;
        }
        showGachaCatalogImportConfirm(jsonString, analysis);
      } catch (error) {
        console.error('[DICE][GACHA]导入文件失败:', error);
        if (window.toastr) showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
      }
    })();
  };

  const getLegacyGachaStateFromRawData = (rawData?: unknown): GachaState | null => {
    if (!rawData || typeof rawData !== 'object') return null;
    const mate = (rawData as Record<string, unknown>).mate;
    if (!mate || typeof mate !== 'object') return null;
    return normalizeGachaStateRecord((mate as Record<string, unknown>).gacha);
  };

  const getGachaState = (rawData?: unknown, createIfMissing = false): GachaState | null => {
    const storedState = normalizeGachaStateRecord(getStoredGachaStateSnapshot());
    const legacyDatabaseState = getLegacyGachaStateFromRawData(rawData);
    if (legacyDatabaseState && (!storedState || !hasMigratedLegacyGachaState())) {
      const migratedState = storedState
        ? mergeLegacyGachaStateForLocalStorage(storedState, legacyDatabaseState)
        : legacyDatabaseState;
      if (saveStoredGachaStateSnapshot(migratedState)) markLegacyGachaStateMigrated();
      return migratedState;
    }

    if (storedState) return storedState;
    return createIfMissing ? createDefaultGachaState() : null;
  };

  const touchGachaActivity = (state: GachaState | null = getGachaState(undefined, true)): GachaState | null => {
    if (!state) return null;
    const now = Date.now();
    state.inputStats.lastActiveAt = Math.max(now, state.inputStats.lastActiveAt || 0, lastHumanInputActivityAt || 0);
    if (!state.inputStats.lastHeartbeatAt) {
      state.inputStats.lastHeartbeatAt = now;
    }
    return state;
  };

  const recordGachaFortuneGain = (state: GachaState, gain: number, reason: string, detail: string) => {
    if (gain <= 0) return;
    state.inputStats.lastFortuneGain = gain;
    state.inputStats.lastFortuneReason = reason;
    state.inputStats.lastFortuneDetail = detail;
    state.inputStats.lastFortuneAt = Date.now();
  };

  const getObjectRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  const buildGachaDiceEventSettlementKey = (event: string, payload: unknown): string => {
    const record = getObjectRecord(payload);
    const detailId = String(record.detailId || '').trim();
    if (detailId) return `${event}:detail:${detailId}`;

    const timestamp = String(record.timestamp || Date.now()).trim();
    if (event === 'check') {
      return [
        event,
        timestamp,
        String(record.attrName || '').trim(),
        String(record.formula || '').trim(),
        String(record.total || '').trim(),
        String(record.target || '').trim(),
      ].join(':');
    }

    const left = getObjectRecord(record.left);
    const right = getObjectRecord(record.right);
    return [
      event,
      timestamp,
      String(left.attribute || '').trim(),
      String(right.attribute || '').trim(),
      String(left.roll || '').trim(),
      String(right.roll || '').trim(),
      String(record.winner || '').trim(),
    ].join(':');
  };

  const getGachaDiceEventDetail = (event: string, payload: unknown): string => {
    const record = getObjectRecord(payload);
    if (event === 'check') {
      const attrName = String(record.attrName || '检定').trim() || '检定';
      const resultText = String(record.outcomeText || (record.success ? '成功' : '失败')).trim();
      const shortResult = resultText.includes('成功')
        ? '成功'
        : resultText.includes('失败')
          ? '失败'
          : resultText || (record.success ? '成功' : '失败');
      return `检定：${attrName} ${shortResult} +${GACHA_CHECK_REWARD}`;
    }

    const winner = String(record.winner || '').trim();
    const resultText = winner === 'tie' ? '平局' : '胜负已定';
    return `对抗检定：${resultText} +${GACHA_CHECK_REWARD}`;
  };

  function settleGachaFortuneForDiceEvent(event: string, payload: unknown) {
    if (event !== 'check' && event !== 'contest') return;
    const state = touchGachaActivity(getGachaState(undefined, true));
    if (!state) return;

    const settlementKey = buildGachaDiceEventSettlementKey(event, payload);
    if (settlementKey && state.inputStats.lastSettledCheckId === settlementKey) return;

    state.inputStats.lastSettledCheckId = settlementKey;
    state.inputStats.totalRewardedChecks += 1;
    state.wallet.fortune += GACHA_CHECK_REWARD;
    recordGachaFortuneGain(state, GACHA_CHECK_REWARD, '检定奖励', getGachaDiceEventDetail(event, payload));

    if (!saveStoredGachaStateSnapshot(state)) return;
    refreshGachaVisualization();
  }

  const persistRawDataWithGacha = async (rawData: unknown, modifiedSheetKeys?: string[], state?: GachaState | null) => {
    const safeModifiedSheetKeys = (modifiedSheetKeys || [])
      .map(key => String(key || '').trim())
      .filter(key => key.startsWith('sheet_'));
    if (safeModifiedSheetKeys.length === 0) {
      if (state) assertSaveStoredGachaStateSnapshot(state);
      return;
    }
    if (!hasSheetKeys(rawData)) {
      console.warn('[DICE][GACHA]跳过扭蛋状态数据库保存：当前表格数据缺少 sheet_* 工作表');
      return;
    }
    // 抽卡、拆解、碎片兑换调用方已经在保存队列内，这里直接执行底层 CRUD 保存，避免队列自等待。
    await performSaveDataOnly(rawData, safeModifiedSheetKeys);
    if (state) assertSaveStoredGachaStateSnapshot(state);
  };

  const showGachaSaveError = (error: unknown, actionText: string) => {
    const message = getRuntimeErrorMessage(error);
    const detail = message || '未知错误';
    const toast = window.toastr || window.parent?.toastr;
    if (toast) {
      showActionableErrorToast(`${actionText}失败：${detail}`, {
        title: '骰子商店',
        suggestion: 'save',
        toastrOptions: { timeOut: 9000 },
      });
    }
  };

  const getGachaRarityRank = (rarity: GachaRarity): number => {
    const index = GACHA_RARITY_ORDER.indexOf(rarity);
    return index >= 0 ? index : 0;
  };

  const isGachaRarity = (value: unknown): value is GachaRarity =>
    GACHA_RARITY_ORDER.includes(String(value || '') as GachaRarity);

  const getGachaShardLabel = (rarity: GachaRarity): string => `${rarity}${FORTUNE_CURRENCY_NAME}碎片`;

  const getGachaRarityIconClass = (rarity: GachaRarity): string =>
    INVENTORY_QUALITY_FILTER_META.find(option => option.value === rarity)?.icon || 'fa-gem';

  const compareGachaItemDefinitionsForDisplay = (a: GachaItemDefinition, b: GachaItemDefinition): number =>
    normalizeGachaItemOrder(a.order) - normalizeGachaItemOrder(b.order) ||
    getGachaRarityRank(b.quality) - getGachaRarityRank(a.quality) ||
    a.name.localeCompare(b.name, 'zh-Hans-CN');

  const addGachaShards = (state: GachaState, rarity: GachaRarity, amount: number) => {
    const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
    if (safeAmount <= 0) return 0;
    state.wallet.shards[rarity] = Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0))) + safeAmount;
    return safeAmount;
  };

  const getGachaRewardTargetTableLabel = (target: GachaRewardTarget): string =>
    target === 'equipment' ? '装备表' : '物品表';

  const formatGachaRewardDestinationLabel = (
    rawData,
    item: Pick<GachaItemDefinition, 'rewardTarget' | 'targetTable' | 'targetColumns'>,
  ): string => {
    const fallback = normalizeGachaTargetTable(item.targetTable) || getGachaRewardTargetTableLabel(item.rewardTarget);
    try {
      const parsed = getGachaRewardParseResult(rawData, item.rewardTarget, getGachaRewardTargetOptions(item));
      return parsed.tableName || fallback;
    } catch {
      return fallback;
    }
  };

  const getGachaRewardTargetOptions = (
    item: Pick<GachaItemDefinition, 'targetTable' | 'targetColumns'>,
  ): GachaRewardParseOptions => ({
    targetTable: normalizeGachaTargetTable(item.targetTable),
    targetColumns: normalizeGachaTargetColumns(item.targetColumns),
  });

  const getGachaRewardParseResult = (
    rawData,
    target: GachaRewardTarget,
    options: GachaRewardParseOptions = {},
  ): GachaRewardParseResult => (target === 'equipment' ? parseEquipmentItems(rawData, options) : parseInventoryItems(rawData, options));

  const getGachaRewardParseResultForItem = (
    rawData,
    item: Pick<GachaItemDefinition, 'rewardTarget' | 'targetTable' | 'targetColumns'>,
  ): GachaRewardParseResult =>
    getGachaRewardParseResult(rawData, item.rewardTarget, { ...getGachaRewardTargetOptions(item), requireNameColumn: true });

  const hasGachaRewardTable = (rawData, target: GachaRewardTarget): boolean => {
    const parsed = getGachaRewardParseResult(rawData, target);
    return Boolean(parsed.tableKey && rawData?.[parsed.tableKey] && Array.isArray(rawData[parsed.tableKey]?.content));
  };

  const hasGachaRewardTableForItem = (
    rawData,
    item: Pick<GachaItemDefinition, 'rewardTarget' | 'targetTable' | 'targetColumns'>,
  ): boolean => {
    try {
      const parsed = getGachaRewardParseResultForItem(rawData, item);
      return Boolean(parsed.tableKey && rawData?.[parsed.tableKey] && Array.isArray(rawData[parsed.tableKey]?.content));
    } catch {
      return false;
    }
  };

  const getAvailableGachaRewardTargets = (rawData): Set<GachaRewardTarget> =>
    new Set(GACHA_REWARD_TARGETS.filter(target => hasGachaRewardTable(rawData, target)));

  const getGachaMinimumRarity = (state: GachaState): GachaRarity | null => {
    if (state.pity.legend >= GACHA_LEGEND_PITY_THRESHOLD) return '传说';
    if (state.pity.rare >= GACHA_RARE_PITY_THRESHOLD) return '稀有';
    return null;
  };

  const pickWeightedValue = <T>(entries: Array<{ value: T; weight: number }>): T | null => {
    const safeEntries = entries.filter(entry => Number(entry.weight) > 0);
    if (safeEntries.length === 0) return null;
    const totalWeight = safeEntries.reduce((sum, entry) => sum + Number(entry.weight), 0);
    if (totalWeight <= 0) return safeEntries[0].value;
    let cursor = Math.random() * totalWeight;
    for (const entry of safeEntries) {
      cursor -= Number(entry.weight);
      if (cursor <= 0) return entry.value;
    }
    return safeEntries[safeEntries.length - 1].value;
  };

  const getActiveGachaPoolTags = (poolTag: GachaPoolTag): GachaPoolTag[] => {
    if (poolTag === GACHA_ALL_POOL_TAG) return getGachaAllExpandablePoolTags();
    return [poolTag];
  };

  let gachaPoolDefinitionsCache: {
    poolTag: GachaPoolTag;
    rawData: unknown;
    activeTagsKey: string;
    items: GachaItemDefinition[];
  } | null = null;

  const getGachaPoolDefinitions = (
    poolTag: GachaPoolTag,
    rawData = getRuntimeGachaRawData(),
  ): GachaItemDefinition[] => {
    const activeTags = getActiveGachaPoolTags(poolTag);
    const activeTagsKey = activeTags.join('|');
    const cached = gachaPoolDefinitionsCache;
    if (cached && cached.poolTag === poolTag && cached.rawData === rawData && cached.activeTagsKey === activeTagsKey) {
      return cached.items;
    }
    const items = getAllGachaItemDefinitions(rawData)
      .filter(item => isGachaItemEnabled(item) && item.poolTags.some(tag => activeTags.includes(tag)))
      .sort(compareGachaItemDefinitionsForDisplay);
    gachaPoolDefinitionsCache = { poolTag, rawData, activeTagsKey, items };
    return items;
  };

  const getStoredGachaActivePoolTag = (fallback: GachaPoolTag): GachaPoolTag => {
    const stored = normalizeGachaPoolId(Store.get(STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, fallback) || fallback);
    return getConfiguredGachaPoolDefinitions().some(pool => pool.id === stored) ? stored : fallback;
  };

  const saveStoredGachaActivePoolTag = (poolTag: GachaPoolTag) => {
    if (!Store.set(STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, poolTag)) throw new Error('当前卡池保存失败');
  };

  const getGachaActivePoolTag = (state?: Pick<GachaState, 'activePoolTag'> | null): GachaPoolTag => {
    const stored = getStoredGachaActivePoolTag(state?.activePoolTag || GACHA_ALL_POOL_TAG);
    const visibleIds = new Set(getVisibleGachaPoolConfigDefinitions().map(pool => pool.id));
    return visibleIds.has(stored) ? stored : GACHA_ALL_POOL_TAG;
  };

  const getGachaChatIdSeed = (): string => {
    const st = (window.SillyTavern || window.parent?.SillyTavern) as
      | { getCurrentChatId?: () => string; chatId?: string }
      | undefined;
    try {
      const chatId = typeof st?.getCurrentChatId === 'function' ? st.getCurrentChatId() : st?.chatId;
      return String(chatId || 'unknown_chat');
    } catch {
      return 'unknown_chat';
    }
  };

  const getGachaLocalDateKey = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  };

  const hashGachaSeed = (value: string): number => {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };

  let gachaPickupRotationKeyCache: { chatLength: number; dateKey: string; key: string } | null = null;

  const getGachaPickupRotationKey = (): string => {
    const chatLength = getDbChatMessages()?.length || 0;
    const dateKey = getGachaLocalDateKey();
    const cachedRotation = gachaPickupRotationKeyCache;
    if (cachedRotation && cachedRotation.chatLength === chatLength && cachedRotation.dateKey === dateKey) {
      return cachedRotation.key;
    }
    const depthBucket = Math.floor(chatLength / GACHA_PICKUP_CHAT_DEPTH_BUCKET);
    const key = `${getGachaChatIdSeed()}|${dateKey}|${depthBucket}`;
    gachaPickupRotationKeyCache = { chatLength, dateKey, key };
    return key;
  };

  let gachaPickupItemsCache: { key: string; items: GachaItemDefinition[] } | null = null;

  const getGachaPickupItems = (poolTag: GachaPoolTag): GachaItemDefinition[] => {
    const cacheKey = `${getGachaPickupRotationKey()}|${poolTag}`;
    if (gachaPickupItemsCache && gachaPickupItemsCache.key === cacheKey) return gachaPickupItemsCache.items;

    const definitions = getGachaPoolDefinitions(poolTag);
    const pickupItems = GACHA_PICKUP_RARITIES.map(rarity => {
      const candidates = definitions.filter(item => item.quality === rarity).sort((a, b) => a.id.localeCompare(b.id));
      if (candidates.length === 0) return null;
      const seed = `${getGachaPickupRotationKey()}|${poolTag}|${rarity}`;
      return candidates[hashGachaSeed(seed) % candidates.length];
    }).filter((item): item is GachaItemDefinition => Boolean(item));
    const items =
      pickupItems.length > 0
        ? pickupItems
        : [...definitions]
            .sort((a, b) => getGachaRarityRank(b.quality) - getGachaRarityRank(a.quality) || a.id.localeCompare(b.id))
            .slice(0, GACHA_PICKUP_FALLBACK_LIMIT);
    gachaPickupItemsCache = { key: cacheKey, items };
    return items;
  };

  const isGachaPickupItem = (poolTag: GachaPoolTag, item: GachaItemDefinition): boolean =>
    getGachaPickupItems(poolTag).some(pickup => pickup.id === item.id);

  const pickGachaRarity = (
    poolTag: GachaPoolTag,
    minimumRarity: GachaRarity | null,
    rawData = getRuntimeGachaRawData(),
    availableTargets?: ReadonlySet<GachaRewardTarget>,
  ): GachaRarity | null => {
    const availableItems = getGachaPoolDefinitions(poolTag, rawData).filter(
      item => !availableTargets || availableTargets.has(item.rewardTarget),
    );
    if (availableItems.length === 0) return null;
    const minimumRank = minimumRarity ? getGachaRarityRank(minimumRarity) : -1;
    const rarityCandidates = GACHA_RARITY_ORDER.filter(rarity => {
      if (minimumRank >= 0 && getGachaRarityRank(rarity) < minimumRank) return false;
      return availableItems.some(item => item.quality === rarity);
    });
    const fallbackCandidates =
      rarityCandidates.length > 0
        ? rarityCandidates
        : GACHA_RARITY_ORDER.filter(rarity => availableItems.some(item => item.quality === rarity));
    if (fallbackCandidates.length === 0) return null;
    return pickWeightedValue(
      fallbackCandidates.map(rarity => ({
        value: rarity,
        weight: Number(GACHA_RARITY_WEIGHTS[rarity] || 0),
      })),
    );
  };

  const pickGachaItemDefinition = (
    poolTag: GachaPoolTag,
    rarity: GachaRarity,
    rewardTarget?: GachaRewardTarget,
    rawData = getRuntimeGachaRawData(),
    availableTargets?: ReadonlySet<GachaRewardTarget>,
  ): GachaItemDefinition | null => {
    const candidates = getGachaPoolDefinitions(poolTag, rawData).filter(item => {
      if (item.quality !== rarity) return false;
      if (rewardTarget && item.rewardTarget !== rewardTarget) return false;
      if (availableTargets && !availableTargets.has(item.rewardTarget)) return false;
      return true;
    });
    return pickWeightedValue(
      candidates.map(item => ({
        value: item,
        weight:
          (Number(item.weight || 0) > 0 ? Number(item.weight || 0) : 1) *
          (isGachaPickupItem(poolTag, item) ? GACHA_PICKUP_WEIGHT_MULTIPLIER : 1),
      })),
    );
  };

  const getInventoryDefaultMetaRecord = (rawData): InventoryMetadataRecord => {
    const globalContext = getInventoryGlobalContext(rawData);
    const fallbackTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    return {
      acquiredAt: String(globalContext.currentTime || fallbackTime).trim(),
      acquiredAtLocation: String(globalContext.currentDetailLocation || '').trim() || '未知',
    };
  };

  const buildGachaInventoryMetaRecord = (
    rawData,
    item: Pick<InventoryParsedItem, 'tableKey' | 'tableName' | 'name'>,
  ): InventoryMetadataRecord => {
    const current = getInventoryMetadataForItem(rawData, item);
    const defaults = current || getInventoryDefaultMetaRecord(rawData);
    return {
      acquiredAt: defaults.acquiredAt,
      acquiredAtLocation: defaults.acquiredAtLocation,
    };
  };

  const setInventoryRowBasicFields = (row: unknown[], colMap, item: GachaItemDefinition, quantity: number) => {
    if (colMap.name >= 0) row[colMap.name] = item.name;
    if (colMap.type >= 0) row[colMap.type] = item.type;
    if (colMap.quantity >= 0) row[colMap.quantity] = String(quantity);
    if (colMap.quality >= 0) row[colMap.quality] = item.quality;
    if (typeof colMap.tags === 'number' && colMap.tags >= 0) row[colMap.tags] = getGachaItemTagsText(item);
    if (typeof colMap.effect === 'number' && colMap.effect >= 0) row[colMap.effect] = getGachaItemEffectText(item);
    if (colMap.description >= 0) row[colMap.description] = getGachaItemDescriptionText(item);
  };

  const resolveEquipmentTableTypeForGachaItem = (
    item: GachaItemDefinition,
    headers: unknown[] = [],
    colMap?: GachaRewardColumnMap,
    sheet?: unknown,
  ): string => {
    const inferredType = inferEquipmentTableTypeForGachaItem(item);
    const typeColumnIndex = Number(colMap?.type);
    if (!Number.isInteger(typeColumnIndex) || typeColumnIndex < 0 || !sheet) return inferredType;

    const headerName = String(headers[typeColumnIndex] || '').trim();
    const columnAliasMap = buildCrudColumnAliasMap(sheet);
    const columnName = getCrudColumnNameForHeader(columnAliasMap, headerName);
    const allowedValues = buildCrudEnumConstraintMap(sheet)[columnName]?.values || [];
    if (allowedValues.length === 0) return inferredType;

    const rawType = String(item.type || '').trim();
    const candidates = [rawType, inferredType, '防具', '护具', '衣物'];
    if (inferredType === '武器') candidates.push('武器');
    if (inferredType === '饰品') candidates.push('饰品', '首饰', '配饰');
    return candidates.find(candidate => candidate && allowedValues.includes(candidate)) || inferredType;
  };

  const setEquipmentRowBasicFields = (
    row: unknown[],
    colMap: GachaRewardColumnMap,
    item: GachaItemDefinition,
    quantity: number,
    headers: unknown[] = [],
    sheet?: unknown,
  ) => {
    if (colMap.name >= 0) row[colMap.name] = item.name;
    if (colMap.type >= 0) row[colMap.type] = resolveEquipmentTableTypeForGachaItem(item, headers, colMap, sheet);
    if (colMap.quantity >= 0) row[colMap.quantity] = String(quantity);
    if (colMap.quality >= 0) row[colMap.quality] = item.quality;
    if (typeof colMap.tags === 'number' && colMap.tags >= 0) row[colMap.tags] = getGachaItemTagsText(item);
    if (typeof colMap.effect === 'number' && colMap.effect >= 0) row[colMap.effect] = getGachaItemEffectText(item);
    if (colMap.description >= 0) row[colMap.description] = getGachaItemDescriptionText(item);
    if (typeof colMap.status === 'number' && colMap.status >= 0 && !String(row[colMap.status] || '').trim()) {
      row[colMap.status] = '闲置';
    }
  };

  type GachaCustomFieldApplyOptions = {
    target: GachaRewardTarget;
    targetColumns?: GachaRewardTargetColumns;
    preserveNonEmptyExisting?: boolean;
  };

  type GachaCustomFieldValidationOptions = {
    target: GachaRewardTarget;
    tableName: string;
    headers: unknown[];
    sheet: unknown;
    item: Pick<GachaItemDefinition, 'name' | 'customFields' | 'targetColumns'>;
    throwOnMissing?: boolean;
  };

  type GachaExistingCustomFieldValidationOptions = GachaCustomFieldValidationOptions & {
    row: unknown[];
  };

  type GachaCustomFieldValidationResult = {
    missingHeaders: string[];
    availableHeaders: string[];
    message: string;
  };

  const getGachaReservedCustomFieldHeaders = (
    target: GachaRewardTarget,
    targetColumns?: GachaRewardTargetColumns,
  ): Set<string> => {
    const headers = new Set(
      target === 'equipment'
        ? ['row_id', '装备名称', '类型', '数量', '品质', '标签', '效果', '状态', '描述']
        : ['row_id', '物品名称', '类型', '数量', '品质', '标签', '效果', '描述'],
    );
    const writtenKeys =
      target === 'equipment' ? GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS : GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS;
    getGachaTargetColumnEntries(targetColumns).forEach(([key, headerName]) => {
      if (writtenKeys.has(key)) headers.add(headerName);
    });
    return headers;
  };

  const buildGachaCustomFieldHeaderMap = (headers: unknown[]): Map<string, number> => {
    const headerMap = new Map<string, number>();
    if (!Array.isArray(headers)) return headerMap;

    headers.forEach((header, index) => {
      const headerName = String(header ?? '').trim();
      if (!headerName || headerMap.has(headerName)) return;
      headerMap.set(headerName, index);
    });

    return headerMap;
  };

  const applyGachaCustomFieldsToRow = (
    row: unknown[],
    headers: unknown[],
    item: Pick<GachaItemDefinition, 'customFields'>,
    options: GachaCustomFieldApplyOptions,
  ): void => {
    if (!Array.isArray(row) || !Array.isArray(headers) || !hasGachaCustomFields(item)) return;

    const headerMap = buildGachaCustomFieldHeaderMap(headers);
    const reservedHeaders = getGachaReservedCustomFieldHeaders(options.target, options.targetColumns || item.targetColumns);

    for (const [rawKey, rawValue] of getGachaCustomFieldEntries(item)) {
      const headerName = String(rawKey ?? '').trim();
      const value = String(rawValue ?? '').trim();
      if (!headerName || !value || reservedHeaders.has(headerName)) continue;

      const columnIndex = headerMap.get(headerName);
      if (typeof columnIndex !== 'number' || columnIndex < 0) continue;
      if (options.preserveNonEmptyExisting && String(row[columnIndex] ?? '').trim()) continue;

      row[columnIndex] = value;
    }
  };

  const validateGachaCustomFieldsForTargetTable = (
    options: GachaCustomFieldValidationOptions,
  ): GachaCustomFieldValidationResult => {
    const availableHeaders = Array.from(buildGachaCustomFieldHeaderMap(options.headers).keys());
    const missingHeaders: string[] = [];
    const requiredHeaders = buildCrudRequiredHeaderSet(options.sheet);
    const reservedHeaders = getGachaReservedCustomFieldHeaders(options.target, options.item.targetColumns);
    const providedCustomFieldHeaders = new Set<string>();

    if (hasGachaCustomFields(options.item)) {
      for (const [rawKey, rawValue] of getGachaCustomFieldEntries(options.item)) {
        const headerName = String(rawKey ?? '').trim();
        const value = String(rawValue ?? '').trim();
        if (!headerName || !value || reservedHeaders.has(headerName)) continue;
        providedCustomFieldHeaders.add(headerName);
      }
    }

    availableHeaders.forEach(headerName => {
      if (reservedHeaders.has(headerName)) return;
      if (!requiredHeaders.has(headerName)) return;
      if (!providedCustomFieldHeaders.has(headerName)) missingHeaders.push(headerName);
    });

    const message = missingHeaders.length
      ? withTableTemplateCheckHint(
          `向目标表“${options.tableName}”写入扭蛋奖励“${options.item.name}”前，发现必填自定义列缺少值：${missingHeaders.join('、')}。当前可用表头：${availableHeaders.join('、') || '（无）'}。请在该物品的自定义字段中补充对应值，或调整目标表 DDL / 表头，取消这些列的必填要求。`,
        )
      : '';

    if (message && options.throwOnMissing !== false) {
      throw new Error(message);
    }

    return {
      missingHeaders,
      availableHeaders,
      message,
    };
  };

  const validateGachaCustomFieldsForExistingRow = (options: GachaExistingCustomFieldValidationOptions): void => {
    const validation = validateGachaCustomFieldsForTargetTable({ ...options, throwOnMissing: false });
    if (validation.missingHeaders.length === 0) return;

    const headerMap = buildGachaCustomFieldHeaderMap(options.headers);
    const missingEmptyHeaders = validation.missingHeaders.filter(headerName => {
      const columnIndex = headerMap.get(headerName);
      return typeof columnIndex !== 'number' || !String(options.row[columnIndex] ?? '').trim();
    });
    if (missingEmptyHeaders.length === 0) return;

    throw new Error(
      withTableTemplateCheckHint(
        `向目标表“${options.tableName}”写入扭蛋奖励“${options.item.name}”前，发现必填自定义列缺少值：${missingEmptyHeaders.join('、')}。当前可用表头：${validation.availableHeaders.join('、') || '（无）'}。请在该物品的自定义字段中补充对应值，或调整目标表 DDL / 表头，取消这些列的必填要求。`,
      ),
    );
  };

  const getGachaItemGrantQuantity = (item: Pick<GachaItemDefinition, 'grantQuantity'>): number =>
    Math.max(1, Math.floor(Number(item.grantQuantity) || 1));

  const findGachaDefinitionByItemId = (
    itemId: string,
    rawData = getRuntimeGachaRawData(),
  ): GachaItemDefinition | null => {
    const normalizedItemId = String(itemId || '').trim();
    if (!normalizedItemId) return null;
    return getAllGachaItemDefinitions(rawData).find(definition => definition.id === normalizedItemId) || null;
  };

  const findGachaDefinitionByNameQuality = (
    name: string,
    quality: string,
    rawData = getRuntimeGachaRawData(),
  ): GachaItemDefinition | null => {
    const normalizedName = String(name || '').trim();
    const normalizedQuality = String(quality || '').trim();
    if (!normalizedName || !normalizedQuality) return null;
    return (
      getAllGachaItemDefinitions(rawData).find(
        definition => definition.name === normalizedName && definition.quality === normalizedQuality,
      ) || null
    );
  };

  const findGachaDefinitionByInventoryItem = (
    item: Pick<InventoryParsedItem, 'name' | 'quality'>,
    rawData = getRuntimeGachaRawData(),
  ): GachaItemDefinition | null => findGachaDefinitionByNameQuality(item.name, item.quality, rawData);

  const grantInventoryGachaReward = (
    rawData,
    state: GachaState,
    item: GachaItemDefinition,
    quantity: number,
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null => {
    const parsed = getGachaRewardParseResultForItem(rawData, item);
    if (!parsed.tableKey || !rawData?.[parsed.tableKey] || !Array.isArray(rawData[parsed.tableKey]?.content)) {
      return null;
    }
    if (snapshots && !snapshots.has(parsed.tableKey)) {
      snapshots.set(parsed.tableKey, cloneRuntimeDataValue(rawData[parsed.tableKey]));
    }

    const existing = parsed.items.find(candidate => candidate.name === item.name) || null;
    if (existing && (item.unique || !item.stackable)) {
      const shardGain = addGachaShards(state, item.quality, GACHA_SHARD_VALUES[item.quality] * Math.max(1, quantity));
      return {
        outcome: {
          kind: 'shards',
          item,
          quantity,
          duplicateConverted: true,
          shardGain,
        },
      };
    }

    const table = rawData[parsed.tableKey];
    if (existing) {
      const row = table.content[existing.rowIndex + 1];
      if (!Array.isArray(row)) return null;
      validateGachaCustomFieldsForExistingRow({
        target: 'inventory',
        tableName: parsed.tableName,
        headers: parsed.headers,
        sheet: rawData[parsed.tableKey],
        item,
        row,
      });
      const currentQuantity = Math.max(
        0,
        Number.parseInt(String(row[parsed.colMap.quantity] ?? existing.quantity ?? 0), 10) || 0,
      );
      const nextQuantity = currentQuantity + Math.max(1, quantity);
      setInventoryRowBasicFields(row, parsed.colMap, item, nextQuantity);
      applyGachaCustomFieldsToRow(row, parsed.headers, item, {
        target: 'inventory',
        targetColumns: item.targetColumns,
        preserveNonEmptyExisting: true,
      });
      return {
        outcome: {
          kind: 'item',
          item,
          quantity,
          duplicateConverted: false,
          shardGain: 0,
        },
        modifiedSheetKey: parsed.tableKey,
      };
    }

    const headerRow = Array.isArray(table.content[0]) ? table.content[0] : parsed.headers;
    const sheet = rawData[parsed.tableKey];
    validateGachaCustomFieldsForTargetTable({
      target: 'inventory',
      tableName: parsed.tableName,
      headers: headerRow,
      sheet,
      item,
    });
    const newRow = new Array(Math.max(headerRow.length, 1)).fill('');
    if (newRow.length > 0) newRow[0] = String(table.content.length);
    setInventoryRowBasicFields(newRow, parsed.colMap, item, Math.max(1, quantity));
    applyGachaCustomFieldsToRow(newRow, headerRow, item, { target: 'inventory', targetColumns: item.targetColumns });
    assertCrudRequiredColumnsRepresented(parsed.tableName, headerRow, sheet);
    assertCrudInsertRequiredCells(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    assertCrudEnumConstraints(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    assertCrudLengthConstraints(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    table.content.push(newRow);
    setInventoryMetadataForItem(
      rawData,
      { tableKey: parsed.tableKey, tableName: parsed.tableName, name: item.name },
      buildGachaInventoryMetaRecord(rawData, {
        tableKey: parsed.tableKey,
        tableName: parsed.tableName,
        name: item.name,
      }),
    );
    return {
      outcome: {
        kind: 'item',
        item,
        quantity,
        duplicateConverted: false,
        shardGain: 0,
      },
      modifiedSheetKey: parsed.tableKey,
    };
  };

  const grantEquipmentGachaReward = (
    rawData,
    state: GachaState,
    item: GachaItemDefinition,
    quantity: number,
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null => {
    const parsed = getGachaRewardParseResultForItem(rawData, item);
    if (!parsed.tableKey || !rawData?.[parsed.tableKey] || !Array.isArray(rawData[parsed.tableKey]?.content)) {
      return null;
    }
    if (snapshots && !snapshots.has(parsed.tableKey)) {
      snapshots.set(parsed.tableKey, cloneRuntimeDataValue(rawData[parsed.tableKey]));
    }

    const existing = parsed.items.find(candidate => candidate.name === item.name) || null;
    const canStackInEquipmentTable = item.stackable && !item.unique && parsed.colMap.quantity >= 0;
    if (existing && !canStackInEquipmentTable) {
      const shardGain = addGachaShards(state, item.quality, GACHA_SHARD_VALUES[item.quality] * Math.max(1, quantity));
      return {
        outcome: {
          kind: 'shards',
          item,
          quantity,
          duplicateConverted: true,
          shardGain,
        },
      };
    }

    const table = rawData[parsed.tableKey];
    if (existing) {
      const row = table.content[existing.rowIndex + 1];
      if (!Array.isArray(row)) return null;
      validateGachaCustomFieldsForExistingRow({
        target: 'equipment',
        tableName: parsed.tableName,
        headers: parsed.headers,
        sheet: rawData[parsed.tableKey],
        item,
        row,
      });
      const currentQuantity = Math.max(
        0,
        Number.parseInt(String(row[parsed.colMap.quantity] ?? existing.quantity ?? 0), 10) || 0,
      );
      const nextQuantity = currentQuantity + Math.max(1, quantity);
      setEquipmentRowBasicFields(row, parsed.colMap, item, nextQuantity, parsed.headers, rawData[parsed.tableKey]);
      applyGachaCustomFieldsToRow(row, parsed.headers, item, {
        target: 'equipment',
        targetColumns: item.targetColumns,
        preserveNonEmptyExisting: true,
      });
      return {
        outcome: {
          kind: 'item',
          item,
          quantity,
          duplicateConverted: false,
          shardGain: 0,
        },
        modifiedSheetKey: parsed.tableKey,
      };
    }

    const headerRow = Array.isArray(table.content[0]) ? table.content[0] : parsed.headers;
    const sheet = rawData[parsed.tableKey];
    validateGachaCustomFieldsForTargetTable({
      target: 'equipment',
      tableName: parsed.tableName,
      headers: headerRow,
      sheet,
      item,
    });
    const newRow = new Array(Math.max(headerRow.length, 1)).fill('');
    if (newRow.length > 0) newRow[0] = String(table.content.length);
    setEquipmentRowBasicFields(newRow, parsed.colMap, item, Math.max(1, quantity), headerRow, sheet);
    applyGachaCustomFieldsToRow(newRow, headerRow, item, { target: 'equipment', targetColumns: item.targetColumns });
    assertCrudRequiredColumnsRepresented(parsed.tableName, headerRow, sheet);
    assertCrudInsertRequiredCells(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    assertCrudEnumConstraints(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    assertCrudLengthConstraints(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    table.content.push(newRow);
    return {
      outcome: {
        kind: 'item',
        item,
        quantity,
        duplicateConverted: false,
        shardGain: 0,
      },
      modifiedSheetKey: parsed.tableKey,
    };
  };

  const grantGachaReward = (
    rawData,
    state: GachaState,
    item: GachaItemDefinition,
    quantity: number,
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null =>
    item.rewardTarget === 'equipment'
      ? grantEquipmentGachaReward(rawData, state, item, quantity, snapshots)
      : grantInventoryGachaReward(rawData, state, item, quantity, snapshots);

  const applyGachaPityAfterDraw = (state: GachaState, rarity: GachaRarity) => {
    state.totalDraws += 1;
    state.pity.rare = getGachaRarityRank(rarity) >= getGachaRarityRank('稀有') ? 0 : state.pity.rare + 1;
    state.pity.legend = getGachaRarityRank(rarity) >= getGachaRarityRank('传说') ? 0 : state.pity.legend + 1;
  };

  const pushRecentGachaReward = (state: GachaState, outcome: GachaDrawOutcome, poolTag: GachaPoolTag) => {
    const record: GachaRecentRewardRecord = {
      itemId: outcome.item.id,
      name: outcome.item.name,
      quality: outcome.item.quality,
      quantity: Math.max(1, outcome.quantity),
      duplicateConverted: outcome.duplicateConverted === true,
      shardGain: Math.max(0, outcome.shardGain || 0),
      poolTag,
      rewardTarget: outcome.item.rewardTarget,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    };
    state.recentRewards.unshift(record);
    state.recentRewards = state.recentRewards.slice(0, GACHA_RECENT_REWARD_LIMIT);
  };

  const drawSingleGachaOutcome = (
    rawData,
    state: GachaState,
    availableTargets: ReadonlySet<GachaRewardTarget> = getAvailableGachaRewardTargets(rawData),
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null => {
    const poolTag = state.activePoolTag;
    const minimumRarity = getGachaMinimumRarity(state);
    const rarity = pickGachaRarity(poolTag, minimumRarity, rawData, availableTargets);
    if (!rarity) return null;
    const item = pickGachaItemDefinition(poolTag, rarity, undefined, rawData, availableTargets);
    if (!item) return null;
    const result = grantGachaReward(rawData, state, item, getGachaItemGrantQuantity(item), snapshots);
    if (!result) return null;
    applyGachaPityAfterDraw(state, item.quality);
    pushRecentGachaReward(state, result.outcome, poolTag);
    return result;
  };

  const formatGachaRecentRewardText = (reward: GachaRecentRewardRecord): string => {
    if (reward.duplicateConverted) {
      return `${reward.name} → ${reward.shardGain}${getGachaShardLabel(reward.quality)}`;
    }
    return `${reward.name} ×${reward.quantity}`;
  };

  const renderGachaPickupHtml = (poolTag: GachaPoolTag): string => {
    const pickupItems = getGachaPickupItems(poolTag);
    if (pickupItems.length === 0) return '';
    return `
      <section class="acu-gacha-pickup-section">
        <div class="acu-gacha-pickup-title"><i class="fa-solid fa-bullhorn"></i><span>PICK UP</span></div>
        <div class="acu-gacha-pickup-grid">
          ${pickupItems
            .map(item => {
              const customIconContext = getGachaItemCustomTableNameIconContext(item);
              return `
<button class="acu-gacha-pickup-card acu-gacha-pickup-detail-btn" type="button" data-item-id="${escapeHtml(item.id)}">
                    <span class="acu-gacha-pickup-rarity">${escapeHtml(item.quality)}</span>
                    <strong><span class="acu-gacha-pickup-card-icon">${renderGachaItemIconContent(item, customIconContext)}</span><span>${escapeHtml(item.name)}</span></strong>
                    <span class="acu-gacha-item-card-meta">${escapeHtml(formatGachaItemCardMeta(item))}</span>
                    <span class="acu-gacha-item-card-effect"><b>效果</b>${escapeHtml(getGachaItemEffectText(item) || '暂无效果')}</span>
                    <span class="acu-gacha-item-card-description"><b>描述</b>${escapeHtml(getGachaItemDescriptionText(item) || '暂无描述')}</span>
                    ${renderGachaCustomFieldsPreviewHtml(item, { limit: 2, showOverflowCount: true })}
                  </button>
               `;
            })
            .join('')}
        </div>
      </section>
    `;
  };

  const formatGachaDuration = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatGachaRelativeTime = (timestamp: number): string => {
    if (!timestamp) return '暂无';
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (elapsedSeconds < 60) return '刚刚';
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) return `${elapsedMinutes}分钟前`;
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) return `${elapsedHours}小时前`;
    return `${Math.floor(elapsedHours / 24)}天前`;
  };

  const getGachaFortuneProgressView = (
    state: GachaState,
    options: { projectActiveProgress?: boolean; now?: number } = {},
  ): GachaFortuneProgressView => {
    const now = options.now || Date.now();
    const stats = state.inputStats;
    const pendingCharCarry = Math.max(0, Math.floor(Number(stats.pendingCharCarry || 0)));
    const readyCharRewards = Math.floor(pendingCharCarry / GACHA_CHARS_PER_FORTUNE);
    const charProgress = pendingCharCarry % GACHA_CHARS_PER_FORTUNE;
    const charsUntilReward = Math.max(0, GACHA_CHARS_PER_FORTUNE - charProgress);
    const charPercent = Math.max(0, Math.min(100, (charProgress / GACHA_CHARS_PER_FORTUNE) * 100));
    const rewardStepMs = GACHA_ACTIVE_SECONDS_PER_FORTUNE * 1000;
    const projectedActiveMs =
      options.projectActiveProgress && document.visibilityState !== 'hidden'
        ? Math.max(0, Number(stats.pendingActiveMs || 0)) + Math.max(0, now - (stats.lastHeartbeatAt || now))
        : Math.max(0, Number(stats.pendingActiveMs || 0));
    const activeProgressMs = Math.max(0, Math.min(rewardStepMs, projectedActiveMs));
    const activeRemainingMs = Math.max(0, rewardStepMs - activeProgressMs);
    const activePercent = Math.max(0, Math.min(100, (activeProgressMs / rewardStepMs) * 100));
    const lastGainDetail = stats.lastFortuneDetail || stats.lastFortuneReason || '骰运奖励';
    const lastGainText =
      stats.lastFortuneGain > 0
        ? /[+＋]\s*\d+\s*$/.test(lastGainDetail)
          ? lastGainDetail
          : `${lastGainDetail} +${String(stats.lastFortuneGain)}`
        : '暂无获得记录';
    const lastGainTime =
      stats.lastFortuneGain > 0 ? formatGachaRelativeTime(stats.lastFortuneAt) : '继续发送消息、保持活跃或进行检定';
    const charNote =
      readyCharRewards > 0
        ? `已攒够 ${String(readyCharRewards)} 次字数奖励，发送时结算`
        : `再写 ${String(charsUntilReward)} 字 +1，发送基础 +${String(GACHA_MESSAGE_REWARD)}`;

    return {
      fortune: Math.max(0, Math.floor(Number(state.wallet.fortune || 0))),
      charProgress,
      charGoal: GACHA_CHARS_PER_FORTUNE,
      charPercent,
      charNote,
      activePercent,
      activeRemainingText: formatGachaDuration(activeRemainingMs),
      activeNote: `保持活跃满 ${String(GACHA_ACTIVE_SECONDS_PER_FORTUNE)} 秒 +1`,
      lastGainText,
      lastGainTime,
      shouldFlashActiveReward:
        stats.lastFortuneReason === '活跃奖励' && stats.lastFortuneAt > 0 && Math.abs(now - stats.lastFortuneAt) < 1600,
    };
  };

  const renderGachaFortuneProgressHtml = (state: GachaState): string => {
    const view = getGachaFortuneProgressView(state);

    return `
      <section class="acu-gacha-fortune-progress" title="发送消息、保持活跃和进行检定都可以获得骰运">
        <div class="acu-gacha-fortune-progress-head">
          <span><i class="fa-solid fa-seedling"></i> 骰运获取</span>
          <strong class="acu-gacha-last-gain-summary">${escapeHtml(view.lastGainText)}</strong>
        </div>
        <div class="acu-gacha-progress-grid">
          <div class="acu-gacha-progress-item acu-gacha-char-progress">
            <div class="acu-gacha-progress-label">
              <span>输入进度</span>
              <strong class="acu-gacha-char-progress-value">${escapeHtml(String(view.charProgress))}/${escapeHtml(String(view.charGoal))}</strong>
            </div>
            <div class="acu-gacha-progress-bar"><span class="acu-gacha-char-progress-fill" style="width:${view.charPercent}%;"></span></div>
            <div class="acu-gacha-progress-note acu-gacha-char-progress-note">${escapeHtml(view.charNote)}</div>
          </div>
          <div class="acu-gacha-progress-item acu-gacha-active-progress ${view.shouldFlashActiveReward ? 'is-reward-flash' : ''}">
            <div class="acu-gacha-progress-label">
              <span>活跃奖励</span>
              <strong class="acu-gacha-active-progress-time">${escapeHtml(view.activeRemainingText)}</strong>
            </div>
            <div class="acu-gacha-progress-bar"><span class="acu-gacha-active-progress-fill" style="width:${view.activePercent}%;"></span></div>
            <div class="acu-gacha-progress-note acu-gacha-active-progress-note">${escapeHtml(view.activeNote)}</div>
          </div>
          <div class="acu-gacha-progress-item compact acu-gacha-last-progress">
            <div class="acu-gacha-progress-label">
              <span>上次获得</span>
              <strong class="acu-gacha-last-gain-time">${escapeHtml(view.lastGainTime)}</strong>
            </div>
            <div class="acu-gacha-progress-note acu-gacha-last-gain-note">${escapeHtml(view.lastGainText)}</div>
          </div>
        </div>
      </section>
    `;
  };

  const showGachaPickupItemDetail = (itemId: string): boolean => {
    const { $ } = getCore();
    const config = getConfig();
    const item = findGachaDefinitionByItemId(itemId);
    if (!item) return false;

    const targetLabel = item.rewardTarget === 'equipment' ? '装备' : '物品';
    const destinationLabel = formatGachaRewardDestinationLabel(getCachedRawData() || getTableData(), item);
    const stackableLabel = item.stackable ? '可堆叠' : '不可堆叠';
    const uniqueLabel = item.unique ? '唯一' : '可重复';
    const customIconContext = getGachaItemCustomTableNameIconContext(item);
    const detail = $(`
      <div class="acu-inventory-detail-overlay acu-theme-${config.theme} acu-gacha-pickup-detail-overlay">
        <div class="acu-inventory-detail acu-gacha-pickup-detail">
          <div class="acu-inventory-detail-header">
            <div class="acu-inventory-detail-head-main">
              <div class="acu-inventory-detail-icon">${renderGachaItemIconContent(item, customIconContext)}</div>
              <div class="acu-inventory-detail-summary">
                <div class="acu-inventory-detail-title-row">
                  <div class="acu-inventory-detail-title">${escapeHtml(item.name)}</div>
                </div>
                <div class="acu-inventory-detail-sub">${escapeHtml(formatGachaItemCardMeta(item))}</div>
              </div>
            </div>
            <div class="acu-inventory-detail-header-actions">
              <button class="acu-preview-close" type="button" title="关闭" aria-label="关闭物品详情"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-inventory-detail-meta-wrap">
            <div class="acu-inventory-detail-meta">
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">适用卡池</span>
                <span class="acu-inventory-detail-field-value">${escapeHtml(formatGachaPoolTags(item.poolTags))}</span>
              </div>
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">发放目标</span>
                <span class="acu-inventory-detail-field-value">${escapeHtml(targetLabel)}</span>
              </div>
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">${item.targetTable ? '固定写入' : '默认写入'}</span>
                <span class="acu-inventory-detail-field-value">${escapeHtml(destinationLabel)}</span>
              </div>
              <div class="acu-inventory-detail-field-row acu-gacha-static-field-row">
                <span class="acu-inventory-detail-field-label">规则</span>
                <span class="acu-inventory-detail-field-value">${escapeHtml(`${stackableLabel} · ${uniqueLabel}`)}</span>
              </div>
            </div>
          </div>
          <div class="acu-gacha-detail-text-block">
            <div class="acu-gacha-detail-text-row"><strong>效果</strong><span>${escapeHtml(getGachaItemEffectText(item) || '暂无效果')}</span></div>
            <div class="acu-gacha-detail-text-row"><strong>描述</strong><span>${escapeHtml(getGachaItemDescriptionText(item) || '暂无描述')}</span></div>
          </div>
          ${renderGachaCustomFieldsDetailsHtml(item, { openThreshold: 4 })}
        </div>
      </div>
    `);

    $('.acu-gacha-pickup-detail-overlay').remove();
    $('body').append(detail);
    hydrateCustomTableNameIconsIn(detail);
    const detailEl = detail[0] as HTMLElement | undefined;
    if (detailEl) {
      detailEl.style.setProperty('position', 'fixed', 'important');
      detailEl.style.setProperty('top', '0', 'important');
      detailEl.style.setProperty('left', '0', 'important');
      detailEl.style.setProperty('right', '0', 'important');
      detailEl.style.setProperty('bottom', '0', 'important');
      detailEl.style.setProperty('width', '100vw', 'important');
      detailEl.style.setProperty('height', '100dvh', 'important');
      detailEl.style.setProperty('display', 'flex', 'important');
      detailEl.style.setProperty('justify-content', 'center', 'important');
      detailEl.style.setProperty('align-items', 'center', 'important');
      detailEl.style.setProperty('z-index', '31365', 'important');
    }
    setupOverlayClose(detail, 'acu-inventory-detail-overlay', () => detail.remove());
    detail.on('click', '.acu-preview-close', () => detail.remove());
    return true;
  };

  const showGachaRecentRewardDetail = (itemId: string, itemName: string, itemQuality: string): void => {
    if (itemId && showGachaPickupItemDetail(itemId)) return;
    const fallbackItem = findGachaDefinitionByNameQuality(itemName, itemQuality);
    if (fallbackItem) showGachaPickupItemDetail(fallbackItem.id);
  };

  const getTotalGachaShards = (state: GachaState): number =>
    GACHA_RARITY_ORDER.reduce(
      (sum, rarity) => sum + Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0))),
      0,
    );

  const renderGachaPanelHtml = rawData => {
    const config = getConfig();
    const horizontalScrollbarClass = config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : '';
    const state = getGachaState(rawData, true) || createDefaultGachaState();
    const activePoolTag = getGachaActivePoolTag(state);
    const inventoryTable = parseInventoryItems(rawData);
    const recentSummary =
      state.recentRewards.length > 0
        ? `最近 ${Math.min(state.recentRewards.length, 6)} 条：${formatGachaRecentRewardText(state.recentRewards[0])}`
        : '还没有最近抽取记录';
    const recentRewardsHtml =
      state.recentRewards.length > 0
        ? state.recentRewards
            .slice(0, 6)
            .map(
              reward => `
                <button class="acu-gacha-recent-detail-btn" type="button" data-item-id="${escapeHtml(reward.itemId)}" data-item-name="${escapeHtml(reward.name)}" data-item-quality="${escapeHtml(reward.quality)}" title="${escapeHtml(`查看 ${reward.name}`)}">
                  <span class="acu-gacha-recent-reward-text">${escapeHtml(formatGachaRecentRewardText(reward))}</span>
                  <span class="acu-gacha-recent-quality">${escapeHtml(reward.quality)}</span>
                </button>
              `,
            )
            .join('')
        : `<div class="acu-inventory-empty compact"><i class="fa-solid fa-receipt"></i><span>还没有最近抽取记录</span></div>`;
    const totalShards = getTotalGachaShards(state);
    const poolDefinitions = getVisibleGachaPoolConfigDefinitions(rawData);

    const poolButtonsHtml = poolDefinitions
      .map(pool => {
        const isActive = activePoolTag === pool.id;
        return `
        <button
          class="acu-gacha-pool-tab acu-gacha-pool-btn ${isActive ? 'active' : ''}"
          type="button"
          role="tab"
          aria-selected="${isActive ? 'true' : 'false'}"
          data-pool-tag="${escapeHtml(pool.id)}"
          title="${escapeHtml(pool.name)}"
        >
          <i class="fa-solid fa-tags"></i>
          <span>${escapeHtml(pool.name)}</span>
        </button>
      `;
      })
      .join('');

    return `
      <div class="acu-gacha-shell acu-theme-${config.theme} ${horizontalScrollbarClass}">
        <div class="acu-panel-header acu-inventory-window-header">
          <div class="acu-panel-title">
            <div class="acu-title-main"><i class="fa-solid fa-store"></i> <span class="acu-title-text">骰子商店</span></div>
          </div>
          <div class="acu-header-actions">
            ${getTutorialButtonHtml('gacha', '查看骰子商店教程')}
            <button class="acu-view-btn acu-gacha-settings-open" type="button" title="骰子商城设置" aria-label="骰子商城设置">
              <i class="fa-solid fa-gear"></i>
            </button>
            <button class="acu-view-btn acu-gacha-inventory-open" type="button" title="打开物品栏" aria-label="打开物品栏">
              <i class="fa-solid fa-box-open"></i>
            </button>
            ${
              inventoryTable.tableKey
                ? `<button class="acu-view-btn acu-gacha-open-table" type="button" data-table="${escapeHtml(inventoryTable.tableName)}" title="跳转到物品表" aria-label="跳转到物品表">
              <i class="fa-solid fa-table"></i>
            </button>`
                : ''
            }
            <button class="acu-close-btn acu-gacha-close" type="button" title="关闭" aria-label="关闭骰子商店"><i class="fa-solid fa-times"></i></button>
          </div>
        </div>
        <div class="acu-gacha-content">
          <div class="acu-gacha-stat-row">
            <span class="acu-badge acu-gacha-fortune-badge"><i class="fa-solid fa-coins"></i>${escapeHtml(FORTUNE_CURRENCY_NAME)} <strong class="acu-gacha-fortune-amount">${escapeHtml(String(state.wallet.fortune || 0))}</strong></span>
            <button class="acu-dialog-btn acu-gacha-fortune-clear danger" type="button" title="清空当前骰运余额" aria-label="清空当前骰运余额">
              <i class="fa-solid fa-eraser"></i>
              <span>清零</span>
            </button>
            <span class="acu-badge"><i class="fa-solid fa-gem"></i>稀有保底 ${escapeHtml(String(state.pity.rare || 0))}/${escapeHtml(String(GACHA_RARE_PITY_THRESHOLD))}</span>
            <span class="acu-badge"><i class="fa-solid fa-star"></i>传说保底 ${escapeHtml(String(state.pity.legend || 0))}/${escapeHtml(String(GACHA_LEGEND_PITY_THRESHOLD))}</span>
            <button class="acu-dialog-btn acu-gacha-shard-shop-open" type="button" title="打开碎片商城">
              <i class="fa-solid fa-cubes-stacked"></i>
              <span>碎片商城</span>
              <strong class="acu-gacha-shard-total">${escapeHtml(String(totalShards))}</strong>
            </button>
          </div>
          ${renderGachaFortuneProgressHtml(state)}
          <div class="acu-gacha-pool-tabs" role="tablist">${poolButtonsHtml}</div>
          ${renderGachaPickupHtml(activePoolTag)}
          <details class="acu-gacha-section acu-gacha-recent-section" open>
            <summary>
              <span><i class="fa-solid fa-clock-rotate-left"></i> 最近收获</span>
              <strong>${escapeHtml(recentSummary)}</strong>
              <i class="fa-solid fa-chevron-down acu-gacha-recent-toggle"></i>
            </summary>
            <div class="acu-gacha-recent-list">${recentRewardsHtml}</div>
          </details>
        </div>
        <div class="acu-gacha-draw-row">
          <button class="acu-dialog-btn acu-btn-confirm acu-gacha-draw-btn acu-gacha-draw-single" type="button" data-draw-count="1">
            <i class="fa-solid fa-wand-sparkles"></i>
            <span>单抽</span>
            <strong>${GACHA_DRAW_COST_SINGLE}</strong>
          </button>
          <button class="acu-dialog-btn acu-btn-confirm acu-gacha-draw-btn acu-gacha-draw-ten" type="button" data-draw-count="10">
            <i class="fa-solid fa-fire"></i>
            <span>十连</span>
            <strong>${GACHA_DRAW_COST_TEN}</strong>
          </button>
        </div>
      </div>
    `;
  };

  const getGachaShopProgressContainers = (): HTMLElement[] => {
    const roots = new Set<HTMLElement>();
    if (getGachaShopRootElement()?.isConnected && getGachaShopRootElement().querySelector('.acu-gacha-fortune-progress')) {
      roots.add(getGachaShopRootElement());
    }
    collectHostAndLocalNodes<HTMLElement>('.acu-gacha-overlay').forEach(element => {
      if (element.isConnected && element.querySelector('.acu-gacha-fortune-progress')) roots.add(element);
    });
    if (roots.size > 0) return Array.from(roots);
    collectHostAndLocalNodes<HTMLElement>('.acu-gacha-shell').forEach(element => {
      if (element.isConnected && element.querySelector('.acu-gacha-fortune-progress')) roots.add(element);
    });
    return Array.from(roots);
  };

  const updateGachaFortuneProgressDom = (state: GachaState, projectActiveProgress = false): boolean => {
    const containers = getGachaShopProgressContainers();
    if (containers.length === 0) return false;

    const view = getGachaFortuneProgressView(state, { projectActiveProgress });
    let didUpdate = false;

    const setText = (root: HTMLElement, selector: string, text: string) => {
      root.querySelectorAll<HTMLElement>(selector).forEach(element => {
        element.textContent = text;
      });
    };
    const setProgressWidth = (root: HTMLElement, selector: string, percent: number) => {
      root.querySelectorAll<HTMLElement>(selector).forEach(element => {
        element.style.width = `${String(percent)}%`;
      });
    };

    containers.forEach(container => {
      const progress = container.querySelector<HTMLElement>('.acu-gacha-fortune-progress');
      if (!progress) return;

      setText(container, '.acu-gacha-fortune-amount', String(view.fortune));
      setText(progress, '.acu-gacha-last-gain-summary', view.lastGainText);
      setText(progress, '.acu-gacha-char-progress-value', `${String(view.charProgress)}/${String(view.charGoal)}`);
      setProgressWidth(progress, '.acu-gacha-char-progress-fill', view.charPercent);
      setText(progress, '.acu-gacha-char-progress-note', view.charNote);
      setText(progress, '.acu-gacha-active-progress-time', view.activeRemainingText);
      setProgressWidth(progress, '.acu-gacha-active-progress-fill', view.activePercent);
      setText(progress, '.acu-gacha-active-progress-note', view.activeNote);
      setText(progress, '.acu-gacha-last-gain-time', view.lastGainTime);
      setText(progress, '.acu-gacha-last-gain-note', view.lastGainText);
      progress.querySelectorAll<HTMLElement>('.acu-gacha-active-progress').forEach(element => {
        element.classList.toggle('is-reward-flash', view.shouldFlashActiveReward);
      });
      didUpdate = true;
    });

    return didUpdate;
  };

  const updateGachaShopProgressUi = (): boolean => {
    if (!getGachaShopProgressContainers().length) return false;
    const state = getGachaState(undefined, true);
    if (!state) return false;
    return updateGachaFortuneProgressDom(state, true);
  };

  const clearGachaFortune = async () => {
    const state = getGachaState(undefined, true);
    const currentFortune = Math.max(0, Math.floor(Number(state?.wallet.fortune || 0)));
    if (!state || currentFortune <= 0) {
      if (window.toastr) window.toastr.info(`${FORTUNE_CURRENCY_NAME}已经是 0`, '骰子商店');
      return;
    }

    const confirmed = await showDiceSystemConfirmDialog({
      title: `清空${FORTUNE_CURRENCY_NAME}`,
      message: `确定要清空当前${FORTUNE_CURRENCY_NAME}余额吗？`,
      detail: `当前余额：${currentFortune}\n只会清空当前聊天/上下文的${FORTUNE_CURRENCY_NAME}，不会影响碎片、保底、最近收获或物品栏。`,
      iconClass: 'fa-eraser',
      confirmText: `清空${FORTUNE_CURRENCY_NAME}`,
      cancelText: '取消',
      tone: 'danger',
    });
    if (!confirmed) return;

    try {
      await runInSaveQueue(async () => {
        const latestState = getGachaState(undefined, true);
        const latestFortune = Math.max(0, Math.floor(Number(latestState?.wallet.fortune || 0)));
        if (!latestState || latestFortune <= 0) {
          if (window.toastr) window.toastr.info(`${FORTUNE_CURRENCY_NAME}已经是 0`, '骰子商店');
          refreshGachaVisualization();
          return;
        }
        latestState.wallet.fortune = 0;
        assertSaveStoredGachaStateSnapshot(latestState);
        refreshGachaVisualization();
        if (window.toastr) window.toastr.success(`${FORTUNE_CURRENCY_NAME}已清空`, '骰子商店');
      });
    } catch (error) {
      showGachaSaveError(error, `${FORTUNE_CURRENCY_NAME}清空保存`);
    }
  };

  const performGachaDraw = async (drawCount: number) => {
    const safeDrawCount = drawCount >= 10 ? 10 : 1;
    const drawCost = safeDrawCount >= 10 ? GACHA_DRAW_COST_TEN : GACHA_DRAW_COST_SINGLE;
    let drawResult = {
      success: false,
      drawCount: safeDrawCount,
      cost: drawCost,
      outcomes: [] as GachaDrawOutcome[],
      state: null as GachaState | null,
      message: '',
      error: '',
    };
    try {
      await runInSaveQueue(async () => {
        const rawData = getTableData({ silent: true }) || getCachedRawData();
        if (!rawData) {
          drawResult.message = '未找到当前聊天数据库表格';
          return;
        }
        await ensureGachaCatalogLoaded(rawData);

        const state = touchGachaActivity(getGachaState(rawData, true));
        if (!state) {
          drawResult.message = '骰子商店状态不可用';
          return;
        }
        state.activePoolTag = getGachaActivePoolTag(state);
        const availableTargets = getAvailableGachaRewardTargets(rawData);
        const poolTargets = new Set(
          getGachaPoolDefinitions(state.activePoolTag, rawData).map(item => item.rewardTarget),
        ) as Set<GachaRewardTarget>;
        if (poolTargets.size > 0 && Array.from(poolTargets).every(target => !availableTargets.has(target))) {
          const label = Array.from(poolTargets).map(getGachaRewardTargetTableLabel).join('或');
          drawResult.state = cloneGachaState(state);
          drawResult.message = `未找到${label}，暂时无法发放骰子商店奖励`;
          warnTableTemplateIssue(`未找到${label}，暂时无法发放骰子商店奖励`);
          return;
        }
        if (state.wallet.fortune < drawCost) {
          drawResult.state = cloneGachaState(state);
          drawResult.message = `${FORTUNE_CURRENCY_NAME}不足，无法抽取`;
          if (window.toastr) window.toastr.warning(`${FORTUNE_CURRENCY_NAME}不足，无法抽取`);
          return;
        }

        const stateSnapshot = cloneRuntimeDataValue(state);
        state.wallet.fortune -= drawCost;
        const modifiedSheetKeys = new Set<string>();
        const outcomes: GachaDrawOutcome[] = [];
        // 按需表级快照：只深拷贝本卡池实际写入的表，避免每次抽卡克隆全部工作表。
        const sheetSnapshots = new Map<string, unknown>();
        try {
          for (let index = 0; index < safeDrawCount; index++) {
            const result = drawSingleGachaOutcome(rawData, state, availableTargets, sheetSnapshots);
            if (!result) continue;
            if (result.modifiedSheetKey) modifiedSheetKeys.add(result.modifiedSheetKey);
            outcomes.push(result.outcome);
          }
        } catch (error) {
          sheetSnapshots.forEach((snapshot, sheetKey) => {
            restoreMutableRuntimeValue(rawData[sheetKey], snapshot);
          });
          restoreMutableRuntimeValue(state, stateSnapshot);
          throw error;
        }

        if (outcomes.length === 0) {
          state.wallet.fortune += drawCost;
          drawResult.state = cloneGachaState(state);
          drawResult.message = '当前卡池没有可发放的奖励';
          if (window.toastr) window.toastr.warning('当前卡池没有可发放的奖励');
          return;
        }

        await persistRawDataWithGacha(rawData, Array.from(modifiedSheetKeys), state);
        refreshGachaVisualization();
        refreshInventoryVisualization();
        const summary = outcomes
          .slice(0, 5)
          .map(outcome =>
            outcome.duplicateConverted
              ? `${outcome.item.name}→${outcome.shardGain}${getGachaShardLabel(outcome.item.quality)}`
              : outcome.item.name,
          )
          .join('、');
        if (window.toastr) {
          window.toastr.success(
            `${safeDrawCount >= 10 ? '十连' : '单抽'}完成：${summary}${outcomes.length > 5 ? '…' : ''}`,
            '骰子商店',
          );
        }
        drawResult = {
          success: true,
          drawCount: safeDrawCount,
          cost: drawCost,
          outcomes,
          state: cloneGachaState(state),
          message: `${safeDrawCount >= 10 ? '十连' : '单抽'}完成`,
          error: '',
        };
      });
    } catch (error) {
      showGachaSaveError(error, safeDrawCount >= 10 ? '十连抽取保存' : '单抽保存');
      drawResult.error = getRuntimeErrorMessage(error) || String(error);
      drawResult.message = safeDrawCount >= 10 ? '十连抽取保存失败' : '单抽保存失败';
    }
    return drawResult;
  };

  const refreshGachaPoolSelectionUi = (poolTag: GachaPoolTag) => {
    const { $ } = getCore();
    const $overlay = $('.acu-gacha-overlay');
    if (!$overlay.length) return;

    $overlay.find('.acu-gacha-pool-btn').each(function () {
      const $button = $(this);
      const isActive = String($button.data('pool-tag') || '') === poolTag;
      $button.toggleClass('active', isActive).attr('aria-selected', isActive ? 'true' : 'false');
    });

    const pickupHtml = renderGachaPickupHtml(poolTag);
    const $pickup = $overlay.find('.acu-gacha-pickup-section').first();
    if ($pickup.length) {
      $pickup.replaceWith(pickupHtml);
    } else if (pickupHtml) {
      $overlay.find('.acu-gacha-pool-tabs').first().after(pickupHtml);
    }
  };

  const updateGachaPoolTag = (poolTag: GachaPoolTag) => {
    const state = getGachaState(undefined, true);
    const currentPoolTag = getGachaActivePoolTag(state);
    if (currentPoolTag === poolTag) return;
    saveStoredGachaActivePoolTag(poolTag);
    if (state) state.activePoolTag = poolTag;
    if (state && !saveStoredGachaStateSnapshot(state)) return;
    refreshGachaPoolSelectionUi(poolTag);
    refreshGachaShardShop();
  };

  const deleteGachaPoolConfig = async (poolId: GachaPoolTag, rawData): Promise<boolean> => {
    const id = normalizeGachaPoolId(poolId);
    if (!id || id === GACHA_ALL_POOL_TAG) return false;
    const pool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === id);
    if (!pool || !canDeleteGachaPoolDefinition(pool)) return false;

    await ensureGachaCatalogLoaded(rawData);
    const originalItems = cloneGachaCatalogItems(getCustomGachaItemDefinitions(rawData));
    const deletingFallbackPool = id === GACHA_CUSTOM_ONLY_POOL_TAG;
    const nextItems: GachaItemDefinition[] = [];
    const removedItemIds: string[] = [];
    let needsFallbackPool = false;

    getCustomGachaItemDefinitions(rawData).forEach(item => {
      if (!item.poolTags.includes(id)) {
        nextItems.push(item);
        return;
      }
      const nextTags = item.poolTags.filter(tag => tag !== id);
      if (nextTags.length > 0) {
        nextItems.push({
          ...item,
          poolTags: nextTags,
        });
        return;
      }
      if (deletingFallbackPool) {
        removedItemIds.push(item.id);
        return;
      }
      needsFallbackPool = true;
      nextItems.push({
        ...item,
        poolTags: [GACHA_CUSTOM_ONLY_POOL_TAG],
      });
    });

    const savedCatalog = await saveStoredGachaCatalog(nextItems);
    if (!savedCatalog) return false;
    const localStorageSnapshot = collectGachaLocalStorageSnapshot([
      STORAGE_KEY_GACHA_POOL_SETTINGS,
      STORAGE_KEY_GACHA_ITEM_SETTINGS,
      STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
      STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
    ]);
    try {
      const pools = getConfiguredGachaPoolDefinitions().filter(candidate => candidate.id !== id);
      if (needsFallbackPool && !pools.some(candidate => candidate.id === GACHA_CUSTOM_ONLY_POOL_TAG)) {
        const nextOrder = pools.reduce((max, candidate) => Math.max(max, Number(candidate.order) || 0), 0) + 10;
        pools.push(
          buildDefaultGachaPoolDefinition(GACHA_CUSTOM_ONLY_POOL_TAG, {
            name: GACHA_CUSTOM_ONLY_POOL_TAG,
            builtin: false,
            visibleInTabs: false,
            includeInAll: false,
            order: nextOrder,
          }),
        );
      }
      saveGachaPoolSettings(pools);
      removedItemIds.forEach(deleteGachaItemSetting);
      if (getStoredGachaActivePoolTag(GACHA_ALL_POOL_TAG) === id) saveStoredGachaActivePoolTag(GACHA_ALL_POOL_TAG);
      if (normalizeGachaPoolId(Store.get(STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, GACHA_ALL_POOL_TAG)) === id) {
        saveStoredGachaSettingsPoolTag(GACHA_ALL_POOL_TAG);
      }
    } catch (error) {
      const rolledBackCatalog = await saveStoredGachaCatalog(originalItems);
      const rollbackWarnings = restoreGachaLocalStorageSnapshot(localStorageSnapshot);
      const message = getRuntimeErrorMessage(error) || '删除卡池配置失败';
      const rollbackMessage = [
        !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
        ...rollbackWarnings,
      ].filter(Boolean).join('；');
      if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
      throw error;
    }
    return true;
  };

  const getStoredGachaSettingsPoolTag = (rawData): GachaPoolTag => {
    const stored = normalizeGachaPoolId(Store.get(STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, GACHA_ALL_POOL_TAG));
    const pools = getVisibleGachaPoolConfigDefinitions(rawData);
    return pools.some(pool => pool.id === stored) ? stored : GACHA_ALL_POOL_TAG;
  };

  const saveStoredGachaSettingsPoolTag = (poolTag: GachaPoolTag) => {
    const normalizedPoolId = normalizeGachaPoolId(poolTag);
    if (!normalizedPoolId) return;
    if (!Store.set(STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, normalizedPoolId)) throw new Error('商城设置页卡池保存失败');
  };

  const showGachaPoolNameDialog = (options: {
    title: string;
    label: string;
    initialValue?: string;
    confirmText?: string;
  }): Promise<string | null> => {
    const { $ } = getCore();
    const config = getConfig();
    return new Promise(resolve => {
      $('.acu-gacha-name-dialog-overlay').remove();
      const overlay = $(`
        <div class="acu-edit-overlay acu-gacha-name-dialog-overlay acu-theme-${config.theme}">
          <form class="acu-edit-dialog acu-gacha-name-dialog">
            <div class="acu-gacha-settings-header">
              <div class="acu-gacha-settings-title"><i class="fa-solid fa-tags"></i> ${escapeHtml(options.title)}</div>
              <button class="acu-close-btn acu-gacha-name-cancel" type="button" title="关闭" aria-label="关闭卡池命名弹窗"><i class="fa-solid fa-times"></i></button>
            </div>
            <label class="acu-gacha-name-field">
              <span>${escapeHtml(options.label)}</span>
              <input class="acu-gacha-name-input" type="text" value="${escapeHtml(options.initialValue || '')}" maxlength="40" autocomplete="off" />
            </label>
            <div class="acu-gacha-settings-footer acu-gacha-name-dialog-footer">
              <button class="acu-dialog-btn acu-gacha-name-cancel" type="button">取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" type="submit">${escapeHtml(options.confirmText || '确定')}</button>
            </div>
          </form>
        </div>
      `);
      let settled = false;
      const finish = (value: string | null) => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(value);
      };
      $('body').append(overlay);
      setupOverlayClose(overlay, 'acu-gacha-name-dialog-overlay', () => finish(null));
      overlay.on('click', '.acu-gacha-name-cancel', () => finish(null));
      overlay.on('submit', '.acu-gacha-name-dialog', event => {
        event.preventDefault();
        finish(String(overlay.find('.acu-gacha-name-input').val() || '').trim());
      });
      window.setTimeout(() => {
        const input = overlay.find('.acu-gacha-name-input')[0] as HTMLInputElement | undefined;
        input?.focus();
        input?.select();
      }, 0);
    });
  };

  const showGachaConfirmDialog = (options: {
    title: string;
    message: string;
    detail?: string;
    iconClass?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
  }): Promise<boolean> => {
    const { $ } = getCore();
    const config = getConfig();
    return new Promise(resolve => {
      $('.acu-gacha-confirm-overlay').remove();
      const overlay = $(`
        <div class="acu-import-confirm-overlay acu-gacha-confirm-overlay acu-theme-${config.theme}">
          <div class="acu-import-confirm-dialog acu-gacha-confirm-dialog">
            <div class="acu-import-confirm-header">
              <span class="acu-import-confirm-title">
                <i class="fa-solid ${escapeHtml(options.iconClass || 'fa-triangle-exclamation')}"></i>
                ${escapeHtml(options.title)}
              </span>
              <button class="acu-import-close-btn acu-gacha-confirm-cancel" type="button" title="关闭" aria-label="关闭">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="acu-import-confirm-body">
              <div class="acu-import-warning-container">
                <i class="fa-solid ${escapeHtml(options.iconClass || 'fa-triangle-exclamation')} acu-import-warning-icon ${options.danger ? 'danger' : ''}"></i>
                <div class="acu-import-warning-title">${escapeHtml(options.message)}</div>
                ${options.detail ? `<div class="acu-import-warning-message">${escapeHtml(options.detail)}</div>` : ''}
              </div>
            </div>
            <div class="acu-import-confirm-footer">
              <button class="acu-import-cancel-btn acu-gacha-confirm-cancel" type="button">${escapeHtml(options.cancelText || '取消')}</button>
              <button class="acu-import-confirm-btn acu-gacha-confirm-ok ${options.danger ? 'danger' : ''}" type="button">${escapeHtml(options.confirmText || '确认')}</button>
            </div>
          </div>
        </div>
      `);
      let settled = false;
      const finish = (confirmed: boolean) => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(confirmed);
      };
      $('body').append(overlay);
      setupOverlayClose(overlay, 'acu-gacha-confirm-overlay', () => finish(false));
      overlay.on('click', '.acu-gacha-confirm-cancel', () => finish(false));
      overlay.on('click', '.acu-gacha-confirm-ok', () => finish(true));
    });
  };

  const getGachaSettingsPoolItems = (rawData, poolId: GachaPoolTag): GachaItemDefinition[] =>
    getGachaCatalogItemsForExport(rawData, poolId);

  const getGachaItemCreatedAtMs = (item: Pick<GachaItemDefinition, 'createdAt' | 'updatedAt'>): number => {
    const createdAt = normalizeGachaTimestamp(item.createdAt);
    if (createdAt) return createdAt;
    return normalizeGachaTimestamp(item.updatedAt) || 0;
  };

  const formatGachaItemCreatedAt = (item: Pick<GachaItemDefinition, 'createdAt' | 'updatedAt'>): string => {
    const createdAt = getGachaItemCreatedAtMs(item);
    if (!createdAt) return '创建时间未知';
    return new Date(createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const renderGachaSettingsPoolTabsHtml = (rawData, selectedPoolId: GachaPoolTag): string => {
    const pools = getVisibleGachaPoolConfigDefinitions(rawData);
    return `
      <div class="acu-gacha-pool-tabs acu-gacha-settings-pool-tabs" role="tablist">
        ${pools
          .map(pool => {
            const active = pool.id === selectedPoolId;
            return `
              <button
                class="acu-gacha-pool-tab acu-gacha-settings-pool-tab ${active ? 'active' : ''}"
                type="button"
                role="tab"
                aria-selected="${active ? 'true' : 'false'}"
                data-pool-id="${escapeHtml(pool.id)}"
                title="${escapeHtml(pool.name)}"
              >
                <i class="fa-solid fa-tags"></i>
                <span>${escapeHtml(pool.name)}</span>
              </button>
            `;
          })
          .join('')}
      </div>
    `;
  };

  const renderGachaSettingsPoolItemsHtml = (rawData, poolId: GachaPoolTag): string => {
    const customIds = new Set(getCustomGachaItemDefinitions(rawData).map(item => item.id));
    const items = getGachaSettingsPoolItems(rawData, poolId);
    const sortedItems = items.slice().sort(compareGachaItemDefinitionsForDisplay);
    if (sortedItems.length === 0) {
      return `<div class="acu-inventory-empty compact"><i class="fa-solid fa-box-open"></i><span>这个卡池里还没有物品</span></div>`;
    }

    return sortedItems
      .map((item, index) => {
        const custom = customIds.has(item.id);
        const enabled = isGachaItemEnabled(item);
        const customText = custom ? '自定义' : '内置';
        const enabledText = enabled ? '启用' : '禁用';
        const destinationLabel = formatGachaRewardDestinationLabel(rawData, item);
        const createdAt = getGachaItemCreatedAtMs(item);
        const qualityRank = getGachaRarityRank(item.quality);
        const customFieldsCount = getGachaCustomFieldEntries(item).length;
        const customFieldsSearchText = getGachaCustomFieldsSearchText(item);
        const customFieldsSummaryHtml =
          customFieldsCount > 0
            ? `<div class="acu-gacha-settings-item-custom-fields" aria-label="${escapeHtml(`自定义字段 ${String(customFieldsCount)} 项`)}">${renderGachaCustomFieldsPreviewHtml(item, { limit: 2, showOverflowCount: true, valueOnly: true })}</div>`
            : '';
        const searchText = [
          item.name,
          item.type,
          item.quality,
          getGachaItemTagsText(item),
          getGachaItemEffectText(item),
          item.description,
          formatGachaPoolTags(item.poolTags, rawData),
          destinationLabel,
          customText,
          enabledText,
          customFieldsSearchText,
        ]
          .join(' ')
          .toLowerCase();
        return `
          <article
            class="acu-gacha-settings-item ${enabled ? '' : 'is-disabled'}"
            data-item-id="${escapeHtml(item.id)}"
            data-search="${escapeHtml(searchText)}"
            data-source="${custom ? 'custom' : 'builtin'}"
            data-enabled="${enabled ? 'true' : 'false'}"
            data-name="${escapeHtml(item.name.toLocaleLowerCase('zh-CN'))}"
            data-created-at="${escapeHtml(String(createdAt))}"
            data-quality-rank="${escapeHtml(String(qualityRank))}"
            data-weight="${escapeHtml(String(Number(item.weight) || 0))}"
            data-default-index="${escapeHtml(String(index))}"
            role="button"
            tabindex="0"
            aria-label="${escapeHtml(`查看 ${item.name} 详情`)}"
          >
            <div class="acu-preset-handle acu-gacha-item-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></div>
            <div class="acu-gacha-settings-item-icon">${renderGachaItemIconContent(item, getGachaItemCustomTableNameIconContext(item, rawData))}</div>
            <div class="acu-gacha-settings-item-main">
              <div class="acu-gacha-settings-item-name">
                ${escapeHtml(item.name)}
                <span>${escapeHtml(item.quality)}</span>
                <span>${custom ? '自定义' : '内置'}</span>
                ${enabled ? '' : '<span class="acu-gacha-settings-disabled-tag">禁用</span>'}
              </div>
              <div class="acu-gacha-settings-item-desc">${escapeHtml(item.description || '暂无描述')}</div>
              <div class="acu-gacha-settings-item-meta">${escapeHtml(item.type)} · 写入 ${escapeHtml(destinationLabel)} · ${escapeHtml(formatGachaPoolTags(item.poolTags, rawData))} · 权重 ${escapeHtml(String(item.weight))} · ${escapeHtml(formatGachaItemCreatedAt(item))}</div>
              ${customFieldsSummaryHtml}
            </div>
            <div class="acu-gacha-settings-actions">
              <label class="acu-toggle acu-gacha-item-enabled-toggle" title="${enabled ? '已参与抽取与兑换' : '已从抽取与兑换中移除'}">
                <input class="acu-gacha-item-enabled-check" type="checkbox" ${enabled ? 'checked' : ''} />
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                custom
                  ? `<span class="acu-gacha-settings-inline-actions">
                      <button class="acu-preset-btn acu-gacha-item-edit" type="button" title="编辑"><i class="fa-solid fa-pen"></i></button>
                      <button class="acu-preset-btn acu-gacha-item-delete acu-preset-delete" type="button" title="删除"><i class="fa-solid fa-trash"></i></button>
                    </span>`
                  : ''
              }
              <details class="acu-gacha-settings-more">
                <summary class="acu-preset-btn" title="更多操作" aria-label="${escapeHtml(`${item.name} 更多操作`)}"><i class="fa-solid fa-ellipsis-vertical"></i></summary>
                <div class="acu-gacha-settings-more-menu">
                  <button class="acu-gacha-item-toggle-menu" type="button"><i class="fa-solid ${enabled ? 'fa-toggle-off' : 'fa-toggle-on'}"></i><span>${enabled ? '禁用' : '启用'}</span></button>
                  ${
                    custom
                      ? `<button class="acu-gacha-item-edit" type="button"><i class="fa-solid fa-pen"></i><span>编辑</span></button>
                        <button class="acu-gacha-item-delete danger" type="button"><i class="fa-solid fa-trash"></i><span>删除</span></button>`
                      : ''
                  }
                </div>
              </details>
            </div>
          </article>
        `;
      })
      .join('');
  };

  const getGachaSettingsFilterLabel = (field: GachaSettingsFilterField, value: string): string => {
    if (field === 'source') {
      return GACHA_SETTINGS_SOURCE_FILTER_OPTIONS.find(option => option.value === value)?.label || '全部来源';
    }
    if (field === 'status') {
      return GACHA_SETTINGS_STATUS_FILTER_OPTIONS.find(option => option.value === value)?.label || '全部状态';
    }
    return GACHA_SETTINGS_SORT_OPTIONS.find(option => option.value === value)?.label || '默认排序';
  };

  const renderGachaSettingsFilterMenuHtml = <T extends string>(
    field: GachaSettingsFilterField,
    options: readonly GachaSettingsFilterOption<T>[],
    selectedValue: T,
  ): string => {
    const fallback = options[0];
    if (!fallback) return '';
    const selected = options.find(option => option.value === selectedValue) || fallback;
    const optionHtml = options
      .map(option => {
        const active = option.value === selected.value;
        return `
          <button
            class="acu-gacha-settings-filter-option ${active ? 'active' : ''}"
            type="button"
            role="menuitemradio"
            aria-checked="${active ? 'true' : 'false'}"
            data-filter-value="${escapeHtml(option.value)}"
          >
            <i class="fa-solid ${escapeHtml(option.iconClass)}"></i>
            <span>${escapeHtml(option.label)}</span>
          </button>
        `;
      })
      .join('');
    return `
      <input class="acu-gacha-settings-${field}-filter" type="hidden" value="${escapeHtml(selected.value)}" />
      <div class="acu-gacha-settings-filter-menu" data-filter-field="${field}">
        <button class="acu-gacha-settings-filter-trigger" type="button" aria-haspopup="menu" aria-expanded="false">
          <i class="fa-solid ${escapeHtml(selected.iconClass)}"></i>
          <span class="acu-gacha-settings-filter-menu-label">${escapeHtml(selected.label)}</span>
          <i class="fa-solid fa-chevron-down acu-gacha-settings-filter-chevron"></i>
        </button>
        <div class="acu-gacha-settings-filter-menu-list" role="menu">
          ${optionHtml}
        </div>
      </div>
    `;
  };

  const renderGachaPoolSettingsListHtml = (rawData): string => {
    const itemDefinitions = getAllGachaItemDefinitions(rawData);
    const counts = new Map<GachaPoolTag, number>();
    itemDefinitions.forEach(item => {
      item.poolTags.forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    const allPoolItems = getGachaCatalogItemsForExport(rawData, GACHA_ALL_POOL_TAG);
    return getAllGachaPoolConfigDefinitions(rawData)
      .map(pool => {
        const isAllPool = pool.id === GACHA_ALL_POOL_TAG;
        const poolItems = isAllPool ? allPoolItems : itemDefinitions.filter(item => item.poolTags.includes(pool.id));
        const countText = isAllPool ? `${poolItems.length} 个候选` : `${counts.get(pool.id) || 0} 个物品`;
        const enabled = isAllPool || pool.includeInAll === true;
        const canDeletePool = canDeleteGachaPoolDefinition(pool);
        const statusText = isAllPool ? '固定显示' : enabled ? '已启用' : '已停用';
        return `
          <article class="acu-preset-item acu-gacha-settings-pool-item ${enabled ? '' : 'is-disabled'}" data-pool-id="${escapeHtml(pool.id)}">
            ${!isAllPool ? `<div class="acu-preset-handle acu-gacha-pool-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></div>` : '<div class="acu-gacha-pool-handle-placeholder"></div>'}
            <div class="acu-gacha-settings-pool-main">
              <div class="acu-gacha-settings-pool-name">
                ${escapeHtml(pool.name)}
                ${pool.builtin && !canDeletePool ? '<span>内置</span>' : '<span>自定义</span>'}
              </div>
              <div class="acu-gacha-settings-pool-meta">${escapeHtml(pool.id)} · ${escapeHtml(countText)} · ${escapeHtml(statusText)}</div>
            </div>
            <div class="acu-gacha-settings-actions">
              ${
                isAllPool
                  ? `<span class="acu-gacha-pool-all-fixed" title="全部是聚合卡池，不加入自身"><i class="fa-solid fa-layer-group"></i></span>`
                  : `<label class="acu-toggle acu-gacha-pool-all-toggle" title="${enabled ? '已启用：显示标签并进入全部抽取范围' : '已停用：隐藏标签并移出全部抽取范围'}">
                      <input class="acu-gacha-pool-all-check" type="checkbox" ${enabled ? 'checked' : ''} />
                      <span class="acu-toggle-slider"></span>
                    </label>`
              }
              <button class="acu-preset-btn acu-gacha-pool-export" type="button" title="导出此卡池"><i class="fa-solid fa-download"></i></button>
              ${!isAllPool ? `<button class="acu-preset-btn acu-gacha-pool-rename" type="button" title="重命名"><i class="fa-solid fa-pen"></i></button>` : ''}
              ${canDeletePool ? `<button class="acu-preset-btn acu-gacha-pool-delete acu-preset-delete" type="button" title="删除"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </article>
        `;
      })
      .join('');
  };

  const renderGachaSettingsPoolViewerHtml = (rawData, selectedPoolId: GachaPoolTag): string => {
    const pool = getVisibleGachaPoolConfigDefinitions(rawData).find(candidate => candidate.id === selectedPoolId);
    const safePoolId = pool?.id || GACHA_ALL_POOL_TAG;
    const items = getGachaSettingsPoolItems(rawData, safePoolId);
    return `
      <section class="acu-gacha-settings-section acu-gacha-settings-items-section" data-pool-id="${escapeHtml(safePoolId)}">
        <div class="acu-gacha-settings-section-head">
          <div>
            <strong>卡池物品：${escapeHtml(pool?.name || safePoolId)}</strong>
            <span class="acu-gacha-settings-count">当前 ${escapeHtml(String(items.length))} 个</span>
          </div>
          <div class="acu-gacha-settings-toolbar">
            ${renderGachaSettingsFilterMenuHtml('source', GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.source)}
            ${renderGachaSettingsFilterMenuHtml('status', GACHA_SETTINGS_STATUS_FILTER_OPTIONS, DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.status)}
            ${renderGachaSettingsFilterMenuHtml('sort', GACHA_SETTINGS_SORT_OPTIONS, DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.sort)}
            <label class="acu-gacha-settings-search">
              <i class="fa-solid fa-search"></i>
              <input class="acu-gacha-settings-item-search" type="text" placeholder="名称、类型、描述" autocomplete="off" />
            </label>
          </div>
        </div>
        ${renderGachaSettingsPoolTabsHtml(rawData, safePoolId)}
        <div class="acu-gacha-settings-item-list">
          ${renderGachaSettingsPoolItemsHtml(rawData, safePoolId)}
          <div class="acu-inventory-empty compact acu-gacha-settings-filter-empty" hidden><i class="fa-solid fa-filter-circle-xmark"></i><span>没有符合筛选条件的物品</span></div>
        </div>
      </section>
    `;
  };

  const showGachaSettingsDialog = async () => {
    const { $ } = getCore();
    const rawData = getCachedRawData() || getTableData();
    await ensureGachaCatalogLoaded(rawData);
    $('.acu-gacha-settings-overlay').remove();

    const config = getConfig();
    const selectedSettingsPoolId = getStoredGachaSettingsPoolTag(rawData);
    const overlay = $(`
      <div class="acu-edit-overlay acu-gacha-settings-overlay acu-theme-${config.theme} ${config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : ''}">
        <div class="acu-edit-dialog acu-gacha-settings-dialog">
          <div class="acu-gacha-settings-header">
            <div class="acu-gacha-settings-title"><i class="fa-solid fa-sliders"></i> 骰子商城设置</div>
            <div class="acu-gacha-settings-header-actions">
              ${getTutorialButtonHtml('gachaSettings', '查看骰子商城设置教程', 'acu-help-btn')}
              <button class="acu-close-btn acu-gacha-settings-close" type="button" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-gacha-settings-body">
            <section class="acu-gacha-settings-section">
              <div class="acu-gacha-settings-section-head">
                <div>
                  <strong>卡池管理</strong>
                </div>
              </div>
              <div class="acu-gacha-settings-pool-list" id="acu-gacha-settings-pool-list">
                ${renderGachaPoolSettingsListHtml(rawData)}
              </div>
            </section>
            ${renderGachaSettingsPoolViewerHtml(rawData, selectedSettingsPoolId)}
          </div>
          <div class="acu-gacha-settings-footer">
            <button class="acu-dialog-btn acu-btn-confirm acu-gacha-pool-new" type="button"><i class="fa-solid fa-plus"></i> 新建卡池</button>
            <button class="acu-dialog-btn acu-gacha-item-new" type="button"><i class="fa-solid fa-plus"></i> 新建物品</button>
            <button class="acu-dialog-btn acu-gacha-settings-prompt" type="button" title="下载给 AI 生成骰子商店物品 JSON 的提示词"><i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词</button>
            <button class="acu-dialog-btn acu-gacha-settings-import" type="button"><i class="fa-solid fa-file-import"></i> 导入 JSON</button>
            <button class="acu-dialog-btn acu-gacha-settings-export" type="button"><i class="fa-solid fa-file-export"></i> 导出 JSON</button>
            <button class="acu-dialog-btn acu-gacha-settings-clear danger" type="button"><i class="fa-solid fa-broom"></i> 清空自定义</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    hydrateCustomTableNameIconsIn(overlay);
    bindTutorialButtonsIn(overlay);

    const closeSettings = () => {
      overlay.remove();
      refreshGachaVisualization(rawData);
      refreshGachaShardShop();
    };
    const settingsItemFilters: GachaSettingsItemFilterState = { ...DEFAULT_GACHA_SETTINGS_ITEM_FILTERS };
    const getCurrentSettingsItemFiltersActive = () =>
      Boolean(
        settingsItemFilters.search ||
        settingsItemFilters.source !== 'all' ||
        settingsItemFilters.status !== 'all' ||
        settingsItemFilters.sort !== 'default',
      );
    const toSettingsSourceFilter = (value: unknown): GachaSettingsItemSourceFilter => {
      const text = String(value || '');
      return text === 'custom' || text === 'builtin' ? text : 'all';
    };
    const toSettingsStatusFilter = (value: unknown): GachaSettingsItemStatusFilter => {
      const text = String(value || '');
      return text === 'enabled' || text === 'disabled' ? text : 'all';
    };
    const toSettingsSortMode = (value: unknown): GachaSettingsItemSortMode => {
      const text = String(value || '');
      return text === 'nameAsc' ||
        text === 'nameDesc' ||
        text === 'createdDesc' ||
        text === 'createdAsc' ||
        text === 'qualityDesc' ||
        text === 'weightDesc'
        ? text
        : 'default';
    };
    const readNumberDataset = (element: HTMLElement, key: string): number => {
      const value = Number(element.dataset[key] || 0);
      return Number.isFinite(value) ? value : 0;
    };
    const filterInputSelectors: Record<GachaSettingsFilterField, string> = {
      source: '.acu-gacha-settings-source-filter',
      status: '.acu-gacha-settings-status-filter',
      sort: '.acu-gacha-settings-sort-filter',
    };
    const normalizeGachaSettingsFilterField = (value: unknown): GachaSettingsFilterField | null => {
      const text = String(value || '');
      return text === 'source' || text === 'status' || text === 'sort' ? text : null;
    };
    const closeSettingsFilterMenus = (except?: HTMLElement) => {
      overlay.find('.acu-gacha-settings-filter-menu.is-open').each(function () {
        if (except && this === except) return;
        this.classList.remove('is-open');
        $(this).find('.acu-gacha-settings-filter-trigger').attr('aria-expanded', 'false');
      });
    };
    const syncSettingsFilterMenuLabels = ($section: JQuery<HTMLElement>) => {
      const syncMenu = (field: GachaSettingsFilterField, value: string, defaultValue: string) => {
        const $menu = $section.find(`.acu-gacha-settings-filter-menu[data-filter-field="${field}"]`);
        if (!$menu.length) return;
        $menu.toggleClass('is-active', value !== defaultValue);
        $menu.find('.acu-gacha-settings-filter-menu-label').text(getGachaSettingsFilterLabel(field, value));
        $menu.find('.acu-gacha-settings-filter-option').each(function () {
          const active = String($(this).data('filter-value') || '') === value;
          $(this)
            .toggleClass('active', active)
            .attr('aria-checked', active ? 'true' : 'false');
        });
      };
      syncMenu('source', settingsItemFilters.source, DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.source);
      syncMenu('status', settingsItemFilters.status, DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.status);
      syncMenu('sort', settingsItemFilters.sort, DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.sort);
    };
    const syncSettingsItemFilterControls = () => {
      const $section = overlay.find('.acu-gacha-settings-items-section').first();
      if (!$section.length) return;
      $section.find('.acu-gacha-settings-item-search').val(settingsItemFilters.search);
      $section.find('.acu-gacha-settings-source-filter').val(settingsItemFilters.source);
      $section.find('.acu-gacha-settings-status-filter').val(settingsItemFilters.status);
      $section.find('.acu-gacha-settings-sort-filter').val(settingsItemFilters.sort);
      syncSettingsFilterMenuLabels($section as JQuery<HTMLElement>);
    };
    const applySettingsItemFilters = () => {
      const $section = overlay.find('.acu-gacha-settings-items-section').first();
      if (!$section.length) return;
      settingsItemFilters.search = String($section.find('.acu-gacha-settings-item-search').val() || '')
        .trim()
        .toLowerCase();
      settingsItemFilters.source = toSettingsSourceFilter($section.find('.acu-gacha-settings-source-filter').val());
      settingsItemFilters.status = toSettingsStatusFilter($section.find('.acu-gacha-settings-status-filter').val());
      settingsItemFilters.sort = toSettingsSortMode($section.find('.acu-gacha-settings-sort-filter').val());

      const items = $section.find('.acu-gacha-settings-item').toArray() as HTMLElement[];
      let visibleCount = 0;
      items.forEach(item => {
        const searchMatched =
          !settingsItemFilters.search || String(item.dataset.search || '').includes(settingsItemFilters.search);
        const sourceMatched =
          settingsItemFilters.source === 'all' || String(item.dataset.source || '') === settingsItemFilters.source;
        const statusMatched =
          settingsItemFilters.status === 'all' ||
          (settingsItemFilters.status === 'enabled' && item.dataset.enabled === 'true') ||
          (settingsItemFilters.status === 'disabled' && item.dataset.enabled === 'false');
        const matched = searchMatched && sourceMatched && statusMatched;
        item.style.display = matched ? '' : 'none';
        item.classList.toggle('is-filtered-out', !matched);
        if (matched) visibleCount += 1;
      });

      const sortedItems = [...items].sort((left, right) => {
        if (settingsItemFilters.sort === 'nameAsc') {
          return String(left.dataset.name || '').localeCompare(String(right.dataset.name || ''), 'zh-CN');
        }
        if (settingsItemFilters.sort === 'nameDesc') {
          return String(right.dataset.name || '').localeCompare(String(left.dataset.name || ''), 'zh-CN');
        }
        if (settingsItemFilters.sort === 'createdDesc') {
          return readNumberDataset(right, 'createdAt') - readNumberDataset(left, 'createdAt');
        }
        if (settingsItemFilters.sort === 'createdAsc') {
          return readNumberDataset(left, 'createdAt') - readNumberDataset(right, 'createdAt');
        }
        if (settingsItemFilters.sort === 'qualityDesc') {
          return readNumberDataset(right, 'qualityRank') - readNumberDataset(left, 'qualityRank');
        }
        if (settingsItemFilters.sort === 'weightDesc') {
          return readNumberDataset(right, 'weight') - readNumberDataset(left, 'weight');
        }
        return readNumberDataset(left, 'defaultIndex') - readNumberDataset(right, 'defaultIndex');
      });

      const list = $section.find('.acu-gacha-settings-item-list')[0];
      if (list) sortedItems.forEach(item => list.appendChild(item));
      $section.find('.acu-gacha-settings-count').text(`当前 ${visibleCount} / ${items.length} 个`);
      $section.find('.acu-gacha-settings-filter-empty').prop('hidden', !(visibleCount === 0 && items.length > 0));
      $section.toggleClass('is-searching', getCurrentSettingsItemFiltersActive());
      syncSettingsFilterMenuLabels($section as JQuery<HTMLElement>);
    };
    const bindSettingsItemSortable = () => {
      const $list = overlay.find('.acu-gacha-settings-item-list').first();
      if (!$list.length) return;
      createSortableList({
        container: $list,
        itemSelector: '.acu-gacha-settings-item',
        handleSelector: '.acu-gacha-item-handle',
        cancelSelector: 'button, input, textarea, select, label, summary, .acu-gacha-settings-more',
        canStartDrag: () => {
          if (!getCurrentSettingsItemFiltersActive()) return true;
          if (window.toastr) window.toastr.info('筛选或排序时暂不允许拖拽排序，请恢复默认条件后再调整顺序');
          return false;
        },
        getItemId: item => {
          const id = item.dataset.itemId;
          return id ? String(id) : null;
        },
        onOrderChange: newOrderIds => {
          void runInSaveQueue(async () => {
            newOrderIds.forEach((id, index) => setGachaItemOrder(id, (index + 1) * 10));
          })
            .then(() => {
              const currentPoolId = normalizeGachaPoolId(overlay.find('.acu-gacha-settings-items-section').data('pool-id'));
              refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
              refreshGachaVisualization(rawData);
              refreshGachaShardShop();
            })
            .catch(error => {
              if (window.toastr) showActionableErrorToast(`物品排序保存失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
            });
        },
      });
    };
    const refreshSettingsPoolViewer = (poolId: GachaPoolTag) => {
      const normalizedPoolId = normalizeGachaPoolId(poolId);
      const safePoolId = getVisibleGachaPoolConfigDefinitions(rawData).some(pool => pool.id === normalizedPoolId)
        ? normalizedPoolId
        : GACHA_ALL_POOL_TAG;
      saveStoredGachaSettingsPoolTag(safePoolId);
      overlay
        .find('.acu-gacha-settings-items-section')
        .replaceWith(renderGachaSettingsPoolViewerHtml(rawData, safePoolId));
      hydrateCustomTableNameIconsIn(overlay);
      syncSettingsItemFilterControls();
      applySettingsItemFilters();
      bindSettingsItemSortable();
    };

    overlay.on('click', '.acu-gacha-settings-close', closeSettings);
    setupOverlayClose(overlay, 'acu-gacha-settings-overlay', closeSettings);

    overlay.on('click', '.acu-gacha-pool-new', () => {
      void (async () => {
        const name = await showGachaPoolNameDialog({
          title: '新建卡池',
          label: '卡池显示名',
          initialValue: '新卡池',
          confirmText: '创建',
        });
        const poolId = normalizeGachaPoolId(name);
        if (!poolId) return;
        await runInSaveQueue(async () => {
          if (getConfiguredGachaPoolDefinitions().some(pool => pool.id === poolId)) {
            if (window.toastr) window.toastr.warning('这个卡池已经存在');
            return;
          }
          ensureGachaPoolsForTags([poolId]);
          saveStoredGachaSettingsPoolTag(poolId);
        });
        void showGachaSettingsDialog();
      })().catch(error => {
        if (window.toastr) showActionableErrorToast(`卡池创建失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-settings-pool-tab', function () {
      const poolId = normalizeGachaPoolId($(this).data('pool-id'));
      if (!poolId) return;
      refreshSettingsPoolViewer(poolId);
    });

    overlay.on('change', '.acu-gacha-pool-all-check', function () {
      const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
      void runInSaveQueue(async () => {
        const pool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
        if (!pool || pool.id === GACHA_ALL_POOL_TAG) return;
        const enabled = pool.includeInAll !== true;
        updateGachaPoolConfig(poolId, { includeInAll: enabled, visibleInTabs: enabled });
      })
        .then(() => showGachaSettingsDialog())
        .catch(error => {
          if (window.toastr) showActionableErrorToast(`卡池设置保存失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
        });
    });

    overlay.on('click', '.acu-gacha-pool-rename', function () {
      void (async () => {
        const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
        const pool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
        if (!pool || pool.id === GACHA_ALL_POOL_TAG) return;
        const name = await showGachaPoolNameDialog({
          title: '重命名卡池',
          label: '卡池显示名',
          initialValue: pool.name,
          confirmText: '保存',
        });
        if (name === null) return;
        await runInSaveQueue(async () => {
          const latestPool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
          if (!latestPool || latestPool.id === GACHA_ALL_POOL_TAG) return;
          updateGachaPoolConfig(poolId, { name });
        });
        void showGachaSettingsDialog();
      })().catch(error => {
        if (window.toastr) showActionableErrorToast(`卡池重命名失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-pool-export', function () {
      const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
      if (!poolId) return;
      void downloadGachaCatalogJson(poolId);
    });

    overlay.on('click', '.acu-gacha-pool-delete', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const poolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-pool-item').data('pool-id'));
      const pool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === poolId);
      if (!pool || !canDeleteGachaPoolDefinition(pool)) return;
      void (async () => {
        const confirmed = await showGachaConfirmDialog({
          title: '删除卡池',
          message: `确定删除卡池「${pool.name}」吗？`,
          detail:
            pool.id === GACHA_CUSTOM_ONLY_POOL_TAG
              ? '仅属于该卡池的自定义物品会一并删除；已经写入目标表的奖励不会被删除。'
              : '仅属于该卡池的自定义物品会转入“自定义”卡池；已经写入目标表的奖励不会被删除。',
          iconClass: 'fa-trash',
          confirmText: '删除',
          danger: true,
        });
        if (!confirmed) return;
        const deleted = await runInSaveQueue(() => deleteGachaPoolConfig(poolId, rawData));
        if (!deleted) throw new Error('卡池删除失败');
        void showGachaSettingsDialog();
      })().catch(error => {
        console.error('[DICE][GACHA]删除卡池失败:', error);
        if (window.toastr) showActionableErrorToast(`删除卡池失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-settings-filter-trigger', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const menu = $(this).closest('.acu-gacha-settings-filter-menu')[0] as HTMLElement | undefined;
      if (!menu) return;
      const nextOpen = !menu.classList.contains('is-open');
      closeSettingsFilterMenus(menu);
      menu.classList.toggle('is-open', nextOpen);
      $(this).attr('aria-expanded', nextOpen ? 'true' : 'false');
    });

    overlay.on('click', '.acu-gacha-settings-filter-option', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const $menu = $(this).closest('.acu-gacha-settings-filter-menu');
      const field = normalizeGachaSettingsFilterField($menu.data('filter-field'));
      if (!field) return;
      const value = String($(this).data('filter-value') || '');
      const $section = $(this).closest('.acu-gacha-settings-items-section');
      $section.find(filterInputSelectors[field]).val(value);
      closeSettingsFilterMenus();
      applySettingsItemFilters();
    });

    overlay.on('click', function (event) {
      const target = event.target;
      if (target instanceof Element && target.closest('.acu-gacha-settings-filter-menu')) return;
      closeSettingsFilterMenus();
    });

    overlay.on('input', '.acu-gacha-settings-item-search', function () {
      applySettingsItemFilters();
    });

    overlay.on(
      'change',
      '.acu-gacha-settings-source-filter, .acu-gacha-settings-status-filter, .acu-gacha-settings-sort-filter',
      function () {
        applySettingsItemFilters();
      },
    );

    overlay.on('keydown', '.acu-gacha-settings-item-search', function (event) {
      const key = event.originalEvent?.key || '';
      if (key !== 'Escape') return;
      $(this).val('');
      applySettingsItemFilters();
    });

    const shouldIgnoreGachaSettingsItemRowClick = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          '.acu-gacha-settings-actions, .acu-gacha-settings-more, .acu-gacha-settings-filter-menu, .acu-gacha-item-handle, button, input, label, select, textarea, a, summary',
        ),
      );
    };

    const showSettingsItemDetailFromRow = (row: HTMLElement) => {
      const itemId = String($(row).data('item-id') || '').trim();
      if (itemId) showGachaPickupItemDetail(itemId);
    };

    overlay.on('click', '.acu-gacha-settings-item', function (event) {
      if (shouldIgnoreGachaSettingsItemRowClick(event.target)) return;
      showSettingsItemDetailFromRow(this);
    });

    overlay.on('keydown', '.acu-gacha-settings-item', function (event) {
      const key = event.originalEvent?.key || '';
      if (key !== 'Enter' && key !== ' ') return;
      if (shouldIgnoreGachaSettingsItemRowClick(event.target)) return;
      event.preventDefault();
      showSettingsItemDetailFromRow(this);
    });

    overlay.on('change', '.acu-gacha-item-enabled-check', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const itemId = String($(this).closest('.acu-gacha-settings-item').data('item-id') || '').trim();
      if (!itemId) return;
      const currentPoolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-items-section').data('pool-id'));
      const nextEnabled = $(this).prop('checked') === true;
      void runInSaveQueue(async () => {
        updateGachaItemSetting(itemId, { enabled: nextEnabled });
      })
        .then(() => {
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
          refreshGachaVisualization(rawData);
          refreshGachaShardShop();
        })
        .catch(error => {
          if (window.toastr) showActionableErrorToast(`物品启用状态保存失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
        });
    });

    overlay.on('click', '.acu-gacha-item-toggle-menu', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const $row = $(this).closest('.acu-gacha-settings-item');
      const itemId = String($row.data('item-id') || '').trim();
      if (!itemId) return;
      const currentPoolId = normalizeGachaPoolId($(this).closest('.acu-gacha-settings-items-section').data('pool-id'));
      void runInSaveQueue(async () => {
        const latestItem = getAllGachaItemDefinitions(rawData).find(candidate => candidate.id === itemId);
        const storedItem = getStoredGachaItemSettings().items[itemId];
        let currentEnabled = String($row.attr('data-enabled') || '') === 'true';
        if (latestItem) currentEnabled = isGachaItemEnabled(latestItem);
        if (storedItem) currentEnabled = storedItem.enabled;
        const nextEnabled = !currentEnabled;
        updateGachaItemSetting(itemId, { enabled: nextEnabled });
      })
        .then(() => {
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
          refreshGachaVisualization(rawData);
          refreshGachaShardShop();
        })
        .catch(error => {
          if (window.toastr) showActionableErrorToast(`物品启用状态保存失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          refreshSettingsPoolViewer(currentPoolId || GACHA_ALL_POOL_TAG);
        });
    });

    overlay.on('click', '.acu-gacha-item-new', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const $itemSection = $(this).closest('.acu-gacha-settings-items-section').length
        ? $(this).closest('.acu-gacha-settings-items-section')
        : overlay.find('.acu-gacha-settings-items-section').first();
      const selectedPoolId = normalizeGachaPoolId($itemSection.data('pool-id'));
      const initialPoolId =
        selectedPoolId && selectedPoolId !== GACHA_ALL_POOL_TAG ? selectedPoolId : GACHA_CUSTOM_ONLY_POOL_TAG;
      void showGachaItemEditorDialog(null, initialPoolId);
    });

    overlay.on('click', '.acu-gacha-item-edit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const itemId = String($(this).closest('.acu-gacha-settings-item').data('item-id') || '').trim();
      if (itemId) void showGachaItemEditorDialog(itemId);
    });

    overlay.on('click', '.acu-gacha-item-delete', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const itemId = String($(this).closest('.acu-gacha-settings-item').data('item-id') || '').trim();
      if (!itemId) return;
      const item = getCustomGachaItemDefinitions(rawData).find(candidate => candidate.id === itemId);
      if (!item) return;
      void (async () => {
        const confirmed = await showGachaConfirmDialog({
          title: '删除自定义物品',
          message: `确定删除「${item.name}」吗？`,
          detail: '只会从骰子商店自定义卡池中删除，不会删除已经写入目标表的奖励。',
          iconClass: 'fa-trash',
          confirmText: '删除',
          danger: true,
        });
        if (!confirmed) return;
        await runInSaveQueue(async () => {
          gachaCatalogCache = null;
          gachaCatalogLoadTask = null;
          await ensureGachaCatalogLoaded(rawData);
          const localStorageSnapshot = collectGachaLocalStorageSnapshot([STORAGE_KEY_GACHA_ITEM_SETTINGS]);
          const latestCustomItems = getCustomGachaItemDefinitions(rawData);
          const latestOriginalItems = cloneGachaCatalogItems(latestCustomItems);
          const latestNextItems = latestCustomItems.filter(candidate => candidate.id !== itemId);
          if (latestNextItems.length === latestCustomItems.length) throw new Error('这个自定义物品已被删除');
          const savedCatalog = await saveStoredGachaCatalog(latestNextItems);
          if (!savedCatalog) throw new Error('自定义物品删除失败');
          try {
            deleteGachaItemSetting(itemId);
          } catch (error) {
            const rolledBackCatalog = await saveStoredGachaCatalog(latestOriginalItems);
            const rollbackWarnings = restoreGachaLocalStorageSnapshot(localStorageSnapshot);
            const message = getRuntimeErrorMessage(error) || '删除自定义物品设置失败';
            const rollbackMessage = [
              !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
              ...rollbackWarnings,
            ].filter(Boolean).join('；');
            if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
            throw error;
          }
        });
        refreshGachaVisualization(rawData);
        refreshGachaShardShop();
        void showGachaSettingsDialog();
      })().catch(error => {
        console.error('[DICE][GACHA]删除自定义物品失败:', error);
        if (window.toastr) showActionableErrorToast(`删除失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });

    overlay.on('click', '.acu-gacha-settings-prompt', () => {
      const selectedPoolId = normalizeGachaPoolId(overlay.find('.acu-gacha-settings-items-section').data('pool-id'));
      const promptName = getGachaPoolDisplayName(selectedPoolId || GACHA_CUSTOM_ONLY_POOL_TAG, rawData);
      downloadAiPromptFile(buildGachaCatalogAgentPrompt(), buildGachaCatalogAgentPromptFilename(promptName));
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });
    overlay.on('click', '.acu-gacha-settings-import', () => importGachaCatalogJsonFromFile());
    overlay.on('click', '.acu-gacha-settings-export', () => void downloadGachaCatalogJson());
    overlay.on('click', '.acu-gacha-settings-clear', () => void showGachaCatalogClearDialog());

    createSortableList({
      container: overlay.find('#acu-gacha-settings-pool-list'),
      itemSelector: '.acu-gacha-settings-pool-item',
      handleSelector: '.acu-gacha-pool-handle',
      cancelSelector: 'button, input, textarea, select',
      getItemId: item => {
        const id = $(item).data('pool-id');
        if (typeof id === 'string') return id;
        if (id !== undefined && id !== null) return String(id);
        return null;
      },
      onOrderChange: newOrderIds => {
        void runInSaveQueue(async () => {
          newOrderIds
            .filter(id => id !== GACHA_ALL_POOL_TAG)
            .forEach((id, index) => setGachaPoolOrder(id, (index + 1) * 10));
        })
          .then(() => showGachaSettingsDialog())
          .catch(error => {
            if (window.toastr) showActionableErrorToast(`卡池排序保存失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          });
      },
    });
    applySettingsItemFilters();
    bindSettingsItemSortable();
  };

  const showGachaItemEditorDialog = async (itemId: string | null, initialPoolTag?: GachaPoolTag) => {
    const { $ } = getCore();
    const rawData = getCachedRawData() || getTableData();
    await ensureGachaCatalogLoaded(rawData);
    const customItems = getCustomGachaItemDefinitions(rawData);
    const existingItem = itemId ? customItems.find(item => item.id === itemId) || null : null;
    if (itemId && !existingItem) {
      if (window.toastr) window.toastr.warning('内置物品不能编辑定义，只能调整启用状态和顺序');
      return;
    }
    const existingResolvedItem = existingItem
      ? getAllGachaItemDefinitions(rawData).find(item => item.id === existingItem.id) || existingItem
      : null;
    const storedPools = getAllGachaPoolConfigDefinitions(rawData).filter(pool => pool.id !== GACHA_ALL_POOL_TAG);
    const normalizedInitialPoolTag = normalizeGachaPoolId(initialPoolTag);
    const needsDefaultCustomPool =
      !existingItem &&
      (!normalizedInitialPoolTag ||
        normalizedInitialPoolTag === GACHA_ALL_POOL_TAG ||
        !storedPools.some(pool => pool.id === normalizedInitialPoolTag));
    const pools =
      needsDefaultCustomPool && !storedPools.some(pool => pool.id === GACHA_CUSTOM_ONLY_POOL_TAG)
        ? [
            ...storedPools,
            buildDefaultGachaPoolDefinition(GACHA_CUSTOM_ONLY_POOL_TAG, {
              name: GACHA_CUSTOM_ONLY_POOL_TAG,
              builtin: false,
              visibleInTabs: false,
              includeInAll: false,
              order: storedPools.reduce((max, pool) => Math.max(max, Number(pool.order) || 0), 0) + 10,
            }),
          ]
        : storedPools;
    const editorCreatablePoolIds = new Set<GachaPoolTag>(
      !existingItem && needsDefaultCustomPool ? [GACHA_CUSTOM_ONLY_POOL_TAG] : [],
    );
    const initialPoolExists = pools.some(pool => pool.id === normalizedInitialPoolTag);
    const baseItem: GachaItemDefinition = existingResolvedItem || {
      id: '',
      name: '',
      type: '道具',
      quality: '普通' as GachaRarity,
      description: '',
      poolTags: [initialPoolExists ? normalizedInitialPoolTag : GACHA_CUSTOM_ONLY_POOL_TAG],
      enabled: true,
      order: undefined,
      weight: 1,
      stackable: false,
      unique: false,
      grantQuantity: 1,
      rewardTarget: 'inventory' as GachaRewardTarget,
    };
    const item: GachaItemDefinition =
      baseItem.rewardTarget === 'equipment'
        ? { ...baseItem, type: inferEquipmentTableTypeForGachaItem(baseItem) }
        : baseItem;
    const fieldLimits = getGachaRewardFieldLimits(item.rewardTarget);
    const config = getConfig();
    const poolOptionsHtml = pools
      .map(pool => {
        const checked = item.poolTags.includes(pool.id);
        return `
          <label class="acu-gacha-item-pool-option">
            <input class="acu-gacha-item-pool-check" type="checkbox" value="${escapeHtml(pool.id)}" ${checked ? 'checked' : ''} />
            <span>${escapeHtml(pool.name)}</span>
          </label>
        `;
      })
      .join('');
    const rarityOptionsHtml = GACHA_RARITY_ORDER.map(
      rarity =>
        `<option value="${escapeHtml(rarity)}" ${item.quality === rarity ? 'selected' : ''}>${escapeHtml(rarity)}</option>`,
    ).join('');
    const targetOptionsHtml = GACHA_REWARD_TARGETS.map(
      target =>
        `<option value="${escapeHtml(target)}" ${item.rewardTarget === target ? 'selected' : ''}>${target === 'equipment' ? '装备' : '物品'}</option>`,
    ).join('');
    const targetTableValue = normalizeGachaTargetTable(item.targetTable) || '';
    const targetColumns = normalizeGachaTargetColumns(item.targetColumns);
    const renderTargetColumnInputHtml = (key: GachaRewardTargetColumnKey, placeholder: string) => `
      <label class="acu-gacha-target-column-field" data-column-key="${escapeHtml(key)}">
        <span>${escapeHtml(GACHA_TARGET_COLUMN_LABELS[key])}</span>
        <input class="acu-gacha-target-column-input" type="text" data-column-key="${escapeHtml(key)}" value="${escapeHtml(targetColumns?.[key] || '')}" maxlength="${GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH}" placeholder="${escapeHtml(placeholder)}" />
      </label>
    `;
    const targetColumnsHtml = [
      renderTargetColumnInputHtml('name', '物品名称 / 装扮名称'),
      renderTargetColumnInputHtml('type', '类型'),
      renderTargetColumnInputHtml('quantity', '数量'),
      renderTargetColumnInputHtml('quality', '品质'),
      renderTargetColumnInputHtml('tags', '标签'),
      renderTargetColumnInputHtml('effect', '效果'),
      renderTargetColumnInputHtml('description', '描述 / 外观描述'),
      renderTargetColumnInputHtml('part', '部位 / 适用场景'),
      renderTargetColumnInputHtml('status', '状态 / 当前状态'),
    ].join('');
    const renderCustomFieldRowHtml = (key = '', value = '') => `
      <div class="acu-gacha-custom-field-row">
        <div class="acu-gacha-custom-field-key-line">
          <label class="acu-gacha-custom-field-key-cell">
            <input class="acu-gacha-custom-field-key" type="text" value="${escapeHtml(key)}" maxlength="${GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH}" placeholder="自定义字段名" />
          </label>
          <button class="acu-gacha-custom-field-remove" type="button" title="移除此字段" aria-label="移除此字段"><i class="fa-solid fa-minus"></i></button>
        </div>
        <label class="acu-gacha-custom-field-value-cell">
          <textarea class="acu-gacha-custom-field-value" rows="2" maxlength="${GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH}" placeholder="对应值">${escapeHtml(value)}</textarea>
        </label>
      </div>
    `;
    const storedTags = String(item.tags || getGachaNamedCustomField(item, GACHA_TAG_FIELD_ALIASES) || '').trim();
    const storedEffect = String(item.effect || getGachaNamedCustomField(item, GACHA_EFFECT_FIELD_ALIASES) || '').trim();
    const customFieldEntries: [string, string][] = [
      ...(storedTags ? ([['标签', storedTags]] as [string, string][]) : []),
      ...(storedEffect ? ([['效果', storedEffect]] as [string, string][]) : []),
      ...getGachaCustomFieldEntries(item).filter(
        ([key]) =>
          !isGachaFieldAlias(key, GACHA_TAG_FIELD_ALIASES) &&
          !isGachaFieldAlias(key, GACHA_EFFECT_FIELD_ALIASES),
      ),
    ];
    // 初始无任何自定义字段，只显示“新增字段➕”按钮
    const customFieldRowsHtml = customFieldEntries
      .map(([key, value]) => renderCustomFieldRowHtml(key, value))
      .join('');
    const openedItemFingerprint = existingItem ? getGachaItemDefinitionFingerprint(existingItem) : '';

    $('.acu-gacha-item-editor-overlay').remove();
    if (getGachaShopUiRefreshTimer()) {
      clearInterval(getGachaShopUiRefreshTimer());
      setGachaShopUiRefreshTimer(null);
    }
    const overlay = $(`
      <div class="acu-edit-overlay acu-gacha-item-editor-overlay acu-theme-${config.theme}">
        <form class="acu-edit-dialog acu-gacha-item-editor">
          <div class="acu-gacha-settings-header">
            <div class="acu-gacha-settings-title"><i class="fa-solid fa-box"></i> ${existingItem ? '编辑自定义物品' : '新建自定义物品'}</div>
            <div class="acu-gacha-settings-header-actions">
              ${getTutorialButtonHtml('gachaItemEditor', '查看自定义物品编辑教程', 'acu-help-btn')}
              <button class="acu-close-btn acu-gacha-item-editor-close" type="button" title="关闭" aria-label="关闭自定义物品编辑器"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-gacha-item-editor-body">
            <label class="wide acu-gacha-item-field acu-gacha-item-name-field"><span>名称</span><input class="acu-gacha-item-name" type="text" value="${escapeHtml(item.name)}" maxlength="${fieldLimits.name}" required /></label>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-type-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-type-label" data-label-value="${escapeHtml(targetColumns?.type || '类型')}">${escapeHtml(targetColumns?.type || '类型')}</span>
                <button class="acu-preset-btn acu-gacha-item-label-edit" type="button" data-label-key="type" title="修改类型字段名" aria-label="修改类型字段名"><i class="fa-solid fa-pen"></i></button>
              </div>
              <label class="acu-gacha-item-field acu-gacha-item-type-field"><input class="acu-gacha-item-type" type="text" value="${escapeHtml(item.type)}" maxlength="40" placeholder="道具" /></label>
            </div>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-quality-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-quality-label" data-label-value="${escapeHtml(targetColumns?.quality || '品质')}">${escapeHtml(targetColumns?.quality || '品质')}</span>
                <button class="acu-preset-btn acu-gacha-item-label-edit" type="button" data-label-key="quality" title="修改品质字段名" aria-label="修改品质字段名"><i class="fa-solid fa-pen"></i></button>
              </div>
              <label class="acu-gacha-item-field"><select class="acu-gacha-item-quality">${rarityOptionsHtml}</select></label>
            </div>
            <div class="wide acu-gacha-item-custom-field-block">
              <div class="acu-gacha-custom-field-rows">${customFieldRowsHtml}</div>
              <button class="acu-dialog-btn acu-gacha-custom-field-add" type="button"><i class="fa-solid fa-plus"></i> 新增字段</button>
              <div class="acu-gacha-custom-field-suggestions">
                <span>目标表头建议</span>
                <div class="acu-gacha-custom-field-suggestion-list" aria-live="polite"></div>
              </div>
            </div>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-description-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-description-label">描述</span>
              </div>
              <label class="acu-gacha-item-field acu-gacha-item-description-field"><textarea class="acu-gacha-item-description" rows="3" maxlength="${fieldLimits.description}" placeholder="描述内容">${escapeHtml(item.description || '')}</textarea></label>
            </div>
            <div class="wide acu-gacha-item-labeled-field acu-gacha-item-target-block">
              <div class="acu-gacha-item-label-line">
                <span class="acu-gacha-item-field-label-text acu-gacha-item-target-label">发放目标</span>
              </div>
              <label class="acu-gacha-item-field acu-gacha-item-target-field"><select class="acu-gacha-item-target">${targetOptionsHtml}</select></label>
            </div>
            <label class="acu-gacha-item-field acu-gacha-item-weight-field"><span>权重</span><input class="acu-gacha-item-weight" type="number" min="0.01" step="0.01" value="${escapeHtml(String(item.weight || 1))}" /></label>
            <label class="acu-gacha-item-field acu-gacha-item-quantity-field"><span>发放数量</span><input class="acu-gacha-item-quantity" type="number" min="1" step="1" value="${escapeHtml(String(item.grantQuantity || 1))}" /></label>
            <div class="wide acu-gacha-item-pools">
              <span>所属卡池</span>
              <div>${poolOptionsHtml}</div>
            </div>
            <div class="wide acu-gacha-icon-editor-card">
              <div class="acu-gacha-icon-editor-preview">${renderGachaItemIconContent(item, getGachaItemCustomTableNameIconContext(item))}</div>
              <div class="acu-gacha-icon-editor-fields">
                <label class="acu-gacha-item-field acu-gacha-item-icon-field"><span>符号图标</span><input class="acu-gacha-item-icon" type="text" value="${escapeHtml(item.icon || '')}" placeholder="fa:coins / ti:wand / ✨" /></label>
                <small class="acu-gacha-icon-editor-note">图片类图标请在“图标管理预设”中按物品/装备名称统一配置。</small>
              </div>
            </div>
            <details class="wide acu-gacha-custom-fields acu-gacha-target-settings" ${targetTableValue || targetColumns ? 'open' : ''}>
              <summary>
                <span><i class="fa-solid fa-location-dot"></i> 写入目标</span>
                <small>留空则跟随当前仪表盘预设</small>
              </summary>
              <div class="acu-gacha-custom-field-panel">
                <label class="acu-gacha-item-field acu-gacha-target-table-field">
                  <span>固定目标表</span>
                  <input class="acu-gacha-item-target-table" type="text" value="${escapeHtml(targetTableValue)}" maxlength="${GACHA_TARGET_TABLE_MAX_LENGTH}" placeholder="例如：装扮表；留空使用仪表盘映射" />
                </label>
                <div class="acu-gacha-target-column-toolbar">
                  <strong>基础字段列映射</strong>
                  <small>只有默认关键词识别不到表头时填写；表头必须精确匹配。</small>
                </div>
                <div class="acu-gacha-target-column-grid">${targetColumnsHtml}</div>
              </div>
            </details>
            <div class="wide acu-gacha-item-flags">
              <label class="acu-gacha-item-checkbox acu-gacha-item-stackable-field"><input class="acu-gacha-item-stackable" type="checkbox" ${item.stackable ? 'checked' : ''} /> <span>可堆叠</span></label>
            </div>
          </div>
          <div class="acu-gacha-settings-footer acu-gacha-item-editor-footer">
            <button class="acu-dialog-btn acu-gacha-item-editor-close" type="button">取消</button>
            <button class="acu-dialog-btn acu-btn-confirm" type="submit"><i class="fa-solid fa-check"></i> 保存</button>
          </div>
        </form>
      </div>
    `);
    $('body').append(overlay);
    hydrateCustomTableNameIconsIn(overlay);
    bindTutorialButtonsIn(overlay);
    let isSubmittingItemEditor = false;
    const setItemEditorSubmitting = (submitting: boolean) => {
      isSubmittingItemEditor = submitting;
      overlay.toggleClass('is-saving', submitting);
      overlay.find('.acu-gacha-item-editor .acu-btn-confirm').prop('disabled', submitting);
    };

    const refreshEditorIconPreview = () => {
      const icon = String(overlay.find('.acu-gacha-item-icon').val() || '').trim();
      const previewItem: Pick<GachaItemDefinition, 'name' | 'type' | 'icon'> = {
        name: String(overlay.find('.acu-gacha-item-name').val() || item.name || '').trim(),
        type: String(overlay.find('.acu-gacha-item-type').val() || item.type || '').trim(),
        icon: icon || undefined,
      };
      const previewContextItem = {
        ...item,
        ...previewItem,
        rewardTarget: getEditorRewardTarget(),
        targetTable: getEditorTargetTable(),
        targetColumns: collectEditorTargetColumns(),
      };
      const $preview = overlay.find('.acu-gacha-icon-editor-preview');
      $preview.html(renderGachaItemIconContent(previewItem, getGachaItemCustomTableNameIconContext(previewContextItem)));
      hydrateCustomTableNameIconsIn($preview);
    };
    const getEditorRewardTarget = (): GachaRewardTarget =>
      normalizeGachaRewardTarget(overlay.find('.acu-gacha-item-target').val());
    const getEditorTargetTable = (): string | undefined =>
      normalizeGachaTargetTable(overlay.find('.acu-gacha-item-target-table').val());
    const collectEditorTargetColumns = (): GachaRewardTargetColumns | undefined => {
      const rawColumns: Record<string, string> = {};
      overlay.find('.acu-gacha-target-column-input').each((_, element) => {
        const key = String($(element).attr('data-column-key') || '').trim();
        if (!GACHA_TARGET_COLUMN_KEYS.includes(key as GachaRewardTargetColumnKey)) return;
        const value = String($(element).val() || '').trim();
        if (value) rawColumns[key] = value;
      });
      // 类型 / 品质的字段名支持通过笔图标改名，改名后按列映射写入目标表
      const typeLabelElement = overlay.find('.acu-gacha-item-type-label');
      const qualityLabelElement = overlay.find('.acu-gacha-item-quality-label');
      const typeLabel = String(typeLabelElement.attr('data-label-value') || typeLabelElement.text() || '').trim();
      const qualityLabel = String(qualityLabelElement.attr('data-label-value') || qualityLabelElement.text() || '').trim();
      if (typeLabel && typeLabel !== '类型') rawColumns.type = typeLabel;
      if (qualityLabel && qualityLabel !== '品质') rawColumns.quality = qualityLabel;
      return normalizeGachaTargetColumns(rawColumns);
    };
    const getEditorTargetOptions = (): GachaRewardParseOptions => ({
      targetTable: getEditorTargetTable(),
      targetColumns: collectEditorTargetColumns(),
    });
    const getEditorTargetTableContext = (target: GachaRewardTarget, options: GachaRewardParseOptions = {}) => {
      const latestRawData = getTableData({ silent: true }) || rawData;
      const parsed =
        target === 'equipment' ? parseEquipmentItems(latestRawData, options) : parseInventoryItems(latestRawData, options);
      const sheet = parsed.tableKey && latestRawData ? latestRawData[parsed.tableKey] : undefined;
      return { parsed, sheet };
    };
    const updateCustomFieldRowControls = () => {
      const rowCount = overlay.find('.acu-gacha-custom-field-row').length;
      overlay.find('.acu-gacha-custom-field-add').prop('disabled', rowCount >= GACHA_CUSTOM_FIELD_MAX_COUNT);
    };
    const appendCustomFieldRow = (key = '', value = '') => {
      if (overlay.find('.acu-gacha-custom-field-row').length >= GACHA_CUSTOM_FIELD_MAX_COUNT) {
        if (window.toastr) window.toastr.warning(`自定义字段最多只能添加 ${GACHA_CUSTOM_FIELD_MAX_COUNT} 个`);
        return null;
      }
      const row = $(renderCustomFieldRowHtml(key, value));
      overlay.find('.acu-gacha-custom-field-rows').append(row);
      updateCustomFieldRowControls();
      return row;
    };
    const refreshCustomFieldHeaderSuggestions = () => {
      const target = getEditorRewardTarget();
      let parsed: GachaRewardParseResult;
      let targetOptions: GachaRewardParseOptions;
      try {
        targetOptions = getEditorTargetOptions();
        ({ parsed } = getEditorTargetTableContext(target, targetOptions));
      } catch (error) {
        const list = overlay.find('.acu-gacha-custom-field-suggestion-list').empty();
        $('<em class="acu-gacha-custom-field-suggestion-empty"></em>')
          .text(getRuntimeErrorMessage(error) || '当前目标表无法解析')
          .appendTo(list);
        return;
      }
      const reservedHeaders = getGachaReservedCustomFieldHeaders(target, targetOptions.targetColumns);
      const headers = Array.from(buildGachaCustomFieldHeaderMap(parsed.headers).keys()).filter(headerName => {
        const isEditableStandardField =
          isGachaFieldAlias(headerName, GACHA_TAG_FIELD_ALIASES) ||
          isGachaFieldAlias(headerName, GACHA_EFFECT_FIELD_ALIASES);
        return (
          isEditableStandardField ||
          (!reservedHeaders.has(headerName) && !GACHA_CUSTOM_FIELD_RESERVED_KEYS.has(headerName))
        );
      });
      const list = overlay.find('.acu-gacha-custom-field-suggestion-list').empty();
      if (!headers.length) {
        $('<em class="acu-gacha-custom-field-suggestion-empty"></em>')
          .text('当前目标表没有可写入的额外表头')
          .appendTo(list);
        return;
      }
      headers.forEach(headerName => {
        $('<button class="acu-gacha-custom-field-suggestion" type="button"></button>')
          .text(headerName)
          .attr('data-header', headerName)
          .appendTo(list);
      });
    };
    type EditorCustomFieldCollectResult = {
      tags?: string;
      effect?: string;
      customFields?: GachaCustomFields;
      message?: string;
    };
    const collectEditorCustomFields = (
      target: GachaRewardTarget,
      targetColumns?: GachaRewardTargetColumns,
    ): EditorCustomFieldCollectResult => {
      const reservedHeaders = getGachaReservedCustomFieldHeaders(target, targetColumns);
      const rawFields: Record<string, string> = {};
      let tags = '';
      let effect = '';
      let message = '';

      overlay.find('.acu-gacha-custom-field-row').each((_, element) => {
        if (message) return;
        const row = $(element);
        const rawKey = String(row.find('.acu-gacha-custom-field-key').val() || '').trim();
        const rawValue = String(row.find('.acu-gacha-custom-field-value').val() || '').trim();
        if (!rawKey && !rawValue) return;
        if (!rawKey || !rawValue) {
          message = '自定义字段需要同时填写目标表头和值；如果不需要，请清空整行。';
          return;
        }
        const key = truncateGachaText(rawKey, GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH);
        const value = truncateGachaText(rawValue, GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH);
        if (
          (reservedHeaders.has(key) || GACHA_CUSTOM_FIELD_RESERVED_KEYS.has(key)) &&
          !isGachaFieldAlias(key, GACHA_TAG_FIELD_ALIASES) &&
          !isGachaFieldAlias(key, GACHA_EFFECT_FIELD_ALIASES)
        ) {
          message = `“${key}” 是基础字段，不能作为自定义字段；请修改字段名，或使用编辑器上方对应的基础输入项。`;
          return;
        }
        if (isGachaFieldAlias(key, GACHA_TAG_FIELD_ALIASES)) {
          if (tags) {
            message = '标签字段重复，请合并为一行。';
            return;
          }
          tags = value;
          return;
        }
        if (isGachaFieldAlias(key, GACHA_EFFECT_FIELD_ALIASES)) {
          if (effect) {
            message = '效果字段重复，请合并为一行。';
            return;
          }
          effect = value;
          return;
        }
        if (Object.prototype.hasOwnProperty.call(rawFields, key)) {
          message = `自定义字段“${key}”重复，请合并为一行。`;
          return;
        }
        if (Object.keys(rawFields).length >= GACHA_CUSTOM_FIELD_MAX_COUNT) {
          message = `自定义字段最多只能保存 ${GACHA_CUSTOM_FIELD_MAX_COUNT} 个。`;
          return;
        }
        rawFields[key] = value;
      });

      if (message) return { message };
      return {
        ...(tags ? { tags } : {}),
        ...(effect ? { effect } : {}),
        customFields: normalizeGachaCustomFields(rawFields),
      };
    };
    const applyEditorFieldLimits = () => {
      const limits = getGachaRewardFieldLimits(getEditorRewardTarget());
      const $nameInput = overlay.find('.acu-gacha-item-name');
      const $descriptionInput = overlay.find('.acu-gacha-item-description');
      const clampField = ($field: JQuery, maxLength: number) => {
        $field.attr('maxlength', String(maxLength));
        const value = String($field.val() || '');
        if (countUnicodeCharacters(value) > maxLength) {
          $field.val(truncateGachaText(value, maxLength));
        }
      };
      clampField($nameInput, limits.name);
      clampField($descriptionInput, limits.description);
    };
    const closeEditor = () => {
      overlay.remove();
      if (getGachaShopProgressContainers().length > 0) startGachaShopUiRefresh();
    };
    overlay.on('click', '.acu-gacha-item-editor-close', closeEditor);
    setupOverlayClose(overlay, 'acu-gacha-item-editor-overlay', closeEditor);
    applyEditorFieldLimits();
    refreshCustomFieldHeaderSuggestions();
    updateCustomFieldRowControls();
    overlay.on('click', '.acu-gacha-custom-field-add', () => {
      const row = appendCustomFieldRow();
      row?.find('.acu-gacha-custom-field-key').trigger('focus');
    });
    overlay.on('click', '.acu-gacha-custom-field-remove', event => {
      $(event.currentTarget).closest('.acu-gacha-custom-field-row').remove();
      updateCustomFieldRowControls();
    });
    overlay.on('click', '.acu-gacha-item-label-edit', function () {
      void (async () => {
        const labelKey = String($(this).attr('data-label-key') || '').trim();
        if (labelKey !== 'type' && labelKey !== 'quality') return;
        const $labelInput = overlay.find(
          labelKey === 'type' ? '.acu-gacha-item-type-label' : '.acu-gacha-item-quality-label',
        );
        const fallbackLabel = labelKey === 'type' ? '类型' : '品质';
        const nextLabel = await showGachaPoolNameDialog({
          title: `修改${fallbackLabel}字段名`,
          label: '字段名',
          initialValue: String($labelInput.attr('data-label-value') || $labelInput.text() || fallbackLabel),
          confirmText: '保存',
        });
        if (nextLabel === null) return;
        const trimmed = nextLabel.trim() || fallbackLabel;
        $labelInput.attr('data-label-value', trimmed).text(trimmed);
        refreshCustomFieldHeaderSuggestions();
        refreshEditorIconPreview();
      })();
    });
    overlay.on('click', '.acu-gacha-custom-field-suggestion', event => {
      const headerName = String($(event.currentTarget).attr('data-header') || '').trim();
      if (!headerName) return;
      let targetRow = overlay
        .find('.acu-gacha-custom-field-row')
        .filter((_, element) => !String($(element).find('.acu-gacha-custom-field-key').val() || '').trim())
        .first();
      if (!targetRow.length) {
        targetRow = appendCustomFieldRow() || $();
      }
      if (!targetRow.length) return;
      targetRow.find('.acu-gacha-custom-field-key').val(headerName);
      targetRow.find('.acu-gacha-custom-field-value').trigger('focus');
    });
    overlay.on('input change', '.acu-gacha-item-target, .acu-gacha-item-target-table, .acu-gacha-target-column-input', () => {
      refreshCustomFieldHeaderSuggestions();
    });
    let editorPreviewRaf = 0;
    const scheduleEditorPreviewRefresh = () => {
      if (editorPreviewRaf) return;
      editorPreviewRaf = window.requestAnimationFrame(() => {
        editorPreviewRaf = 0;
        if (!overlay.parent().length) return;
        applyEditorFieldLimits();
        refreshEditorIconPreview();
      });
    };
    overlay.on(
      'input change',
      '.acu-gacha-item-name, .acu-gacha-item-type, .acu-gacha-item-target, .acu-gacha-item-target-table, .acu-gacha-target-column-input, .acu-gacha-item-description, .acu-gacha-item-icon',
      () => {
        scheduleEditorPreviewRefresh();
      },
    );

    overlay.on('submit', '.acu-gacha-item-editor', function (event) {
      event.preventDefault();
      if (isSubmittingItemEditor) return;
      setItemEditorSubmitting(true);
      void (async () => {
        try {
          const name = String(overlay.find('.acu-gacha-item-name').val() || '').trim();
          const quality = String(overlay.find('.acu-gacha-item-quality').val() || '普通') as GachaRarity;
          const rewardTarget = String(overlay.find('.acu-gacha-item-target').val() || 'inventory') as GachaRewardTarget;
          const targetTable = getEditorTargetTable();
          const targetColumns = collectEditorTargetColumns();
          const description = String(overlay.find('.acu-gacha-item-description').val() || '').trim();
          const rawType = String(overlay.find('.acu-gacha-item-type').val() || '').trim();
          const type =
            rewardTarget === 'equipment'
              ? inferEquipmentTableTypeForGachaItem({ id: existingItem?.id || '', name, type: rawType, description })
              : rawType || '道具';
          const icon = String(overlay.find('.acu-gacha-item-icon').val() || '').trim();
          const weight = Number(overlay.find('.acu-gacha-item-weight').val());
          const grantQuantity = Math.floor(Number(overlay.find('.acu-gacha-item-quantity').val()));
          const stackable = overlay.find('.acu-gacha-item-stackable').prop('checked') === true;
          // 唯一性由品质“唯一”派生，不再使用独立复选框
          const unique = quality === GACHA_UNIQUE_RARITY;
          const poolTags = overlay
            .find('.acu-gacha-item-pool-check:checked')
            .toArray()
            .map(element => normalizeGachaPoolId((element as HTMLInputElement).value))
            .filter(Boolean);
          const submitFieldLimits = getGachaRewardFieldLimits(rewardTarget);

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入物品名称');
          return;
        }
        if (countUnicodeCharacters(name) > submitFieldLimits.name) {
          if (window.toastr) window.toastr.warning(`名称不能超过 ${submitFieldLimits.name} 字`);
          return;
        }
        if (countUnicodeCharacters(description) > submitFieldLimits.description) {
          if (window.toastr) window.toastr.warning(`描述不能超过 ${submitFieldLimits.description} 字`);
          return;
        }
        if (!GACHA_RARITY_ORDER.includes(quality)) {
          if (window.toastr) window.toastr.warning('物品品质不合法');
          return;
        }
        if (!GACHA_REWARD_TARGETS.includes(rewardTarget)) {
          if (window.toastr) window.toastr.warning('发放目标不合法');
          return;
        }
        if (!Number.isFinite(weight) || weight <= 0) {
          if (window.toastr) window.toastr.warning('权重必须大于 0');
          return;
        }
        if (!Number.isFinite(grantQuantity) || grantQuantity <= 0) {
          if (window.toastr) window.toastr.warning('发放数量必须是正整数');
          return;
        }
        if (poolTags.length === 0) {
          if (window.toastr) window.toastr.warning('请至少选择一个卡池');
          return;
        }
        const customFieldResult = collectEditorCustomFields(rewardTarget, targetColumns);
        if (customFieldResult.message) {
          if (window.toastr) window.toastr.warning(customFieldResult.message);
          return;
        }
        const tags = customFieldResult.tags;
        const effect = customFieldResult.effect;
        const customFields = customFieldResult.customFields;
        let targetContext: ReturnType<typeof getEditorTargetTableContext>;
        try {
          targetContext = getEditorTargetTableContext(rewardTarget, {
            targetTable,
            targetColumns,
            requireNameColumn: true,
          });
        } catch (error) {
          if (window.toastr) window.toastr.warning(getRuntimeErrorMessage(error) || '写入目标无法解析');
          return;
        }
        const customFieldValidation = validateGachaCustomFieldsForTargetTable({
          target: rewardTarget,
          tableName: targetContext.parsed.tableName,
          headers: targetContext.parsed.headers,
          sheet: targetContext.sheet,
          item: { name, tags, effect, description, customFields, targetColumns },
          throwOnMissing: false,
        });
        if (customFieldValidation.message) {
          if (window.toastr) window.toastr.warning(customFieldValidation.message);
          return;
        }

        const draftSavedAt = Date.now();
        const draftItem: GachaItemDefinition = {
          id: existingItem?.id || buildStableGachaCustomItemId({ name, quality, type }),
          name,
          type,
          quality,
          ...(tags ? { tags } : {}),
          ...(effect ? { effect } : {}),
          description,
          poolTags,
          icon: icon || undefined,
          enabled: isGachaItemEnabled(item),
          order: item.order,
          createdAt: existingItem?.createdAt || draftSavedAt,
          updatedAt: draftSavedAt,
          weight,
          stackable,
          unique,
          grantQuantity,
          rewardTarget,
          ...(targetTable ? { targetTable } : {}),
          ...(targetColumns ? { targetColumns } : {}),
          ...(customFields ? { customFields } : {}),
        };

        const targetWarnings: string[] = [];
        if (!validateGachaCatalogImportItemTarget(getTableData({ silent: true }) || rawData, draftItem, targetWarnings)) {
          if (window.toastr) window.toastr.warning(targetWarnings[0] || '自定义物品写入目标无法通过校验');
          return;
        }

        try {
          await runInSaveQueue(async () => {
            gachaCatalogCache = null;
            gachaCatalogLoadTask = null;
            await ensureGachaCatalogLoaded(rawData);
            const latestCustomItems = getCustomGachaItemDefinitions(rawData);
            const latestExistingItem = existingItem
              ? latestCustomItems.find(candidate => candidate.id === existingItem.id) || null
              : null;
            if (existingItem && !latestExistingItem) {
              throw new Error('这个自定义物品已被删除，请重新打开编辑器后再保存。');
            }
            if (
              existingItem &&
              latestExistingItem &&
              getGachaItemDefinitionFingerprint(latestExistingItem) !== openedItemFingerprint
            ) {
              throw new Error('这个自定义物品已被其他操作更新，请重新打开编辑器后再保存。');
            }
            if (!existingItem) {
              const currentPoolIds = new Set(getAllGachaPoolConfigDefinitions(rawData).map(pool => pool.id));
              const stalePoolTags = poolTags.filter(
                tag => tag !== GACHA_ALL_POOL_TAG && !currentPoolIds.has(tag) && !editorCreatablePoolIds.has(tag),
              );
              if (stalePoolTags.length > 0) {
                throw new Error(`所选卡池已被删除或更新：${stalePoolTags.join('、')}。请重新打开编辑器后再保存。`);
              }
            }
            const existingIds = new Set(getAllGachaItemDefinitions(rawData).map(candidate => candidate.id));
            if (existingItem) existingIds.delete(existingItem.id);
            const id = existingItem?.id || createUniqueGachaItemId(draftItem.id, existingIds);
            const savedAt = Date.now();
            const nextItem: GachaItemDefinition = {
              ...draftItem,
              id,
              enabled: latestExistingItem ? isGachaItemEnabled(latestExistingItem) : isGachaItemEnabled(item),
              order: latestExistingItem?.order ?? item.order,
              createdAt: latestExistingItem?.createdAt || existingItem?.createdAt || savedAt,
              updatedAt: savedAt,
            };
            const nextItems = latestExistingItem
              ? latestCustomItems.map(candidate => (candidate.id === latestExistingItem.id ? nextItem : candidate))
              : [...latestCustomItems, nextItem];
            const localStorageSnapshot = collectGachaLocalStorageSnapshot([STORAGE_KEY_GACHA_POOL_SETTINGS]);
            const savedCatalog = await saveStoredGachaCatalog(nextItems);
            if (!savedCatalog) throw new Error('自定义物品保存失败');
            try {
              ensureGachaPoolsForTags(poolTags);
            } catch (error) {
              const rolledBackCatalog = await saveStoredGachaCatalog(latestCustomItems);
              const rollbackWarnings = restoreGachaLocalStorageSnapshot(localStorageSnapshot);
              const message = getRuntimeErrorMessage(error) || '写入卡池配置失败';
              const rollbackMessage = [
                !rolledBackCatalog ? '自定义物品目录回滚失败' : '',
                ...rollbackWarnings,
              ].filter(Boolean).join('；');
              if (rollbackMessage) throw new Error(`${message}；${rollbackMessage}`);
              throw error;
            }
          });
        } catch (error) {
          console.error('[DICE][GACHA]保存自定义物品失败:', error);
          if (window.toastr)
            showActionableErrorToast(`自定义物品保存失败: ${getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
          return;
        }
        refreshGachaVisualization(rawData);
        refreshGachaShardShop();
        closeEditor();
        if (window.toastr) window.toastr.success(existingItem ? '自定义物品已更新' : '自定义物品已创建');
        void showGachaSettingsDialog();
        } finally {
          if (overlay.parent().length > 0) setItemEditorSubmitting(false);
          else isSubmittingItemEditor = false;
        }
      })();
    });
  };

  const dismantleInventoryItem = async (rowIndex: number) => {
    try {
      await runInSaveQueue(async () => {
        const context = getInventoryDetailContext(rowIndex, { preferLatest: true });
        if (!context) {
          if (window.toastr) window.toastr.warning('未找到可拆解的物品');
          return;
        }

        const rarity = String(context.item.quality || '').trim();
        if (!isGachaRarity(rarity)) {
          if (window.toastr) window.toastr.warning('当前物品品质不支持拆解');
          return;
        }

        const quantityAvailable = Math.max(1, Number.parseInt(String(context.item.quantity || 1), 10) || 1);
        const definition = findGachaDefinitionByInventoryItem(context.item, context.rawData);
        const dismantleUnitSize = definition ? getGachaItemGrantQuantity(definition) : 1;
        const maxDismantleUnits = Math.floor(quantityAvailable / dismantleUnitSize);
        if (maxDismantleUnits <= 0) {
          if (window.toastr)
            window.toastr.warning(`至少需要 ${dismantleUnitSize} 个${context.item.name}才能拆解为碎片`);
          return;
        }

        let dismantleUnits = 1;
        if (maxDismantleUnits > 1) {
          const unitLabel = dismantleUnitSize > 1 ? `组（每组 ${dismantleUnitSize} 个）` : '个';
          const input = await showDiceSystemInputDialog({
            title: '拆解数量',
            message: `请输入要拆解的${unitLabel}数量（1-${maxDismantleUnits}）`,
            iconClass: 'fa-cubes-stacked',
            initialValue: String(maxDismantleUnits),
            inputMode: 'numeric',
            confirmText: '继续拆解',
          });
          if (input === null) return;
          dismantleUnits = Number.parseInt(String(input || '').trim(), 10);
          if (!Number.isFinite(dismantleUnits) || dismantleUnits <= 0 || dismantleUnits > maxDismantleUnits) {
            if (window.toastr) window.toastr.warning('拆解数量不合法');
            return;
          }
        }
        const dismantleQuantity = dismantleUnits * dismantleUnitSize;

        const state = touchGachaActivity(getGachaState(context.rawData, true));
        if (!state) return;
        const shardGain = addGachaShards(state, rarity, GACHA_SHARD_VALUES[rarity] * dismantleUnits);
        const nextQuantity = quantityAvailable - dismantleQuantity;

        if (nextQuantity <= 0) {
          context.rawData[context.item.tableKey].content.splice(context.item.rowIndex + 1, 1);
        } else if (context.colMap.quantity >= 0) {
          context.row[context.colMap.quantity] = String(nextQuantity);
        }

        await persistRawDataWithGacha(context.rawData, [context.item.tableKey], state);
        $('.acu-inventory-detail-overlay').remove();
        refreshGachaVisualization();
        refreshInventoryVisualization();
        if (window.toastr) {
          window.toastr.success(
            `已拆解 ${context.item.name}${dismantleQuantity > 1 ? ` ×${dismantleQuantity}` : ''}，获得 ${shardGain}${getGachaShardLabel(rarity)}`,
            '骰子商店',
          );
        }
      });
    } catch (error) {
      showGachaSaveError(error, '拆解保存');
    }
  };

  const normalizeGachaMessageId = (messageId?: unknown): string => {
    if (typeof messageId === 'string' || typeof messageId === 'number') {
      return String(messageId).trim();
    }
    if (!messageId || typeof messageId !== 'object') return '';
    const record = messageId as Record<string, unknown>;
    const candidateKeys = ['messageId', 'message_id', 'mesid', 'id', 'index'];
    for (const key of candidateKeys) {
      const value = record[key];
      if (typeof value === 'string' || typeof value === 'number') {
        const normalized = String(value).trim();
        if (normalized) return normalized;
      }
    }
    return '';
  };

  const getGachaChatMessageText = (messageId?: unknown): string => {
    const chat = getDbChatMessages();
    if (!chat || chat.length === 0) return '';
    const normalizedId = normalizeGachaMessageId(messageId);
    const readMessageText = (message: DbChatMessage | null | undefined): string => {
      if (!message) return '';
      const candidates = [message.mes, message.message, message.text, message.content];
      for (const value of candidates) {
        if (typeof value === 'string' && value.trim()) return value;
      }
      return '';
    };

    if (normalizedId) {
      const matched = chat.find(message => {
        const candidates = [message.id, message.mesid, message.message_id, message.swipes_id];
        return candidates.some(value => String(value ?? '').trim() === normalizedId);
      });
      const matchedText = readMessageText(matched);
      if (matchedText) return matchedText;

      const numericIndex = Number.parseInt(normalizedId, 10);
      if (Number.isFinite(numericIndex) && numericIndex >= 0 && numericIndex < chat.length) {
        const indexedText = readMessageText(chat[numericIndex]);
        if (indexedText) return indexedText;
      }
    }

    for (let index = chat.length - 1; index >= 0; index--) {
      const message = chat[index];
      if (message?.is_user) {
        const text = readMessageText(message);
        if (text) return text;
      }
    }
    return '';
  };

  const buildGachaSettlementKey = (messageId: string, messageText: string): string => {
    if (messageId) return `id:${messageId}`;
    const normalizedText = stripSystemInjectedContent(messageText);
    if (!normalizedText) return `empty:${Math.floor(Date.now() / 2000)}`;
    return `text:${countUnicodeCharacters(normalizedText)}:${normalizedText.slice(0, 80)}:${normalizedText.slice(-80)}`;
  };

  const settleGachaFortuneForMessage = (messageId?: unknown) => {
    const state = touchGachaActivity(getGachaState(undefined, true));
    if (!state) return;

    const normalizedMessageId = normalizeGachaMessageId(messageId);
    const humanInput = consumePendingHumanInputSnapshot() || getGachaChatMessageText(messageId);
    const settlementKey = buildGachaSettlementKey(normalizedMessageId, humanInput);
    if (settlementKey && state.inputStats.lastSettledMessageId === settlementKey) return;
    const typedChars = countUnicodeCharacters(stripSystemInjectedContent(humanInput));
    const totalChars = state.inputStats.pendingCharCarry + typedChars;
    const charReward = Math.floor(totalChars / GACHA_CHARS_PER_FORTUNE);

    state.inputStats.totalTypedMessages += 1;
    state.inputStats.totalTypedChars += typedChars;
    state.inputStats.pendingCharCarry = totalChars % GACHA_CHARS_PER_FORTUNE;
    if (settlementKey) state.inputStats.lastSettledMessageId = settlementKey;
    const totalReward = GACHA_MESSAGE_REWARD + charReward;
    state.wallet.fortune += totalReward;
    recordGachaFortuneGain(
      state,
      totalReward,
      '发送消息',
      `发送 ${typedChars} 字，基础 ${GACHA_MESSAGE_REWARD}${charReward > 0 ? `，字数奖励 ${charReward}` : ''}`,
    );

    if (!saveStoredGachaStateSnapshot(state)) return;
    refreshGachaVisualization();
  };

  const flushGachaHeartbeatProgress = (_persistProgress: boolean) => {
    const state = getGachaState(undefined, true);
    if (!state) return;

    const now = Date.now();
    const lastHeartbeatAt = state.inputStats.lastHeartbeatAt || now;
    const elapsed = Math.max(0, now - lastHeartbeatAt);
    state.inputStats.lastHeartbeatAt = now;
    state.inputStats.lastActiveAt = Math.max(state.inputStats.lastActiveAt || 0, lastHumanInputActivityAt || 0);
    const isTavernPageAwake = document.visibilityState !== 'hidden';
    if (isTavernPageAwake) {
      state.inputStats.lastActiveAt = now;
      state.inputStats.pendingActiveMs += elapsed;
    }

    const rewardStepMs = GACHA_ACTIVE_SECONDS_PER_FORTUNE * 1000;
    const rewardCount = Math.floor(state.inputStats.pendingActiveMs / rewardStepMs);
    if (rewardCount > 0) {
      state.inputStats.pendingActiveMs -= rewardCount * rewardStepMs;
      state.inputStats.totalActiveMinutes += (rewardCount * GACHA_ACTIVE_SECONDS_PER_FORTUNE) / 60;
      state.wallet.fortune += rewardCount;
      recordGachaFortuneGain(
        state,
        rewardCount,
        '活跃奖励',
        `活跃 ${rewardCount * GACHA_ACTIVE_SECONDS_PER_FORTUNE} 秒`,
      );
    }

    if (!saveStoredGachaStateSnapshot(state)) return;
    updateGachaFortuneProgressDom(state);
  };

  const ensureGachaHeartbeat = () => {
    if (getGachaHeartbeatTimer()) return;
    setGachaHeartbeatTimer(setInterval(() => {
      void flushGachaHeartbeatProgress(false);
    }, GACHA_ACTIVE_HEARTBEAT_MS));
  };

  const startGachaShopUiRefresh = () => {
    if (getGachaShopUiRefreshTimer()) return;
    setGachaShopUiRefreshTimer(setInterval(() => {
      if (!getGachaShopProgressContainers().length) {
        if (getGachaShopUiRefreshTimer()) {
          clearInterval(getGachaShopUiRefreshTimer());
          setGachaShopUiRefreshTimer(null);
        }
        return;
      }
      updateGachaShopProgressUi();
    }, GACHA_SHOP_UI_REFRESH_MS));
  };

  const getInventoryMetadataContextKey = (): string => {
    const contextKey = String(getCurrentContextFingerprint() || '').trim();
    return contextKey || 'unknown_context';
  };

  const getInventoryMetadataStore = (): InventoryMetadataStore => {
    const stored = Store.get(STORAGE_KEY_INVENTORY_METADATA, {});
    return stored && typeof stored === 'object' ? (stored as InventoryMetadataStore) : {};
  };

  const saveInventoryMetadataStore = (store: InventoryMetadataStore) => {
    Store.set(STORAGE_KEY_INVENTORY_METADATA, store);
  };

  const getLegacyInventoryMetadataRoot = (rawData): InventoryMetadataRoot | null => {
    if (!rawData || typeof rawData !== 'object') return null;
    const mate = (rawData as { mate?: unknown }).mate;
    if (!mate || typeof mate !== 'object') return null;
    const inventoryMeta = (mate as { inventoryMeta?: unknown }).inventoryMeta;
    if (!inventoryMeta || typeof inventoryMeta !== 'object') return null;
    return cloneRuntimeDataValue(inventoryMeta) as InventoryMetadataRoot;
  };

  const saveInventoryMetadataRoot = (root: InventoryMetadataRoot) => {
    const store = getInventoryMetadataStore();
    store[getInventoryMetadataContextKey()] = root;
    saveInventoryMetadataStore(store);
  };

  const getInventoryMetadataRoot = (rawData, createIfMissing = false): InventoryMetadataRoot => {
    const store = getInventoryMetadataStore();
    const contextKey = getInventoryMetadataContextKey();
    const storedRoot = store[contextKey];
    if (storedRoot && typeof storedRoot === 'object') return storedRoot;

    const legacyRoot = getLegacyInventoryMetadataRoot(rawData);
    if (legacyRoot) {
      store[contextKey] = legacyRoot;
      saveInventoryMetadataStore(store);
      return legacyRoot;
    }

    if (!createIfMissing) return {};
    const createdRoot: InventoryMetadataRoot = {};
    store[contextKey] = createdRoot;
    saveInventoryMetadataStore(store);
    return createdRoot;
  };

  const getInventoryMetadataScopeKey = (tableKey: string, tableName: string): string => {
    return String(tableKey || tableName || 'inventory').trim() || 'inventory';
  };

  const getInventoryMetadataForItem = (
    rawData,
    item: Pick<InventoryParsedItem, 'tableKey' | 'tableName' | 'name'>,
  ): InventoryMetadataRecord | null => {
    const root = getInventoryMetadataRoot(rawData, false);
    const scopeKey = getInventoryMetadataScopeKey(item.tableKey, item.tableName);
    const scope = root[scopeKey];
    if (!scope || typeof scope !== 'object') return null;
    const record = scope[item.name];
    if (!record || typeof record !== 'object') return null;
    return {
      acquiredAt: String(record.acquiredAt || '').trim(),
      acquiredAtLocation: String(record.acquiredAtLocation || '').trim(),
    };
  };

  const setInventoryMetadataForItem = (
    rawData,
    item: Pick<InventoryParsedItem, 'tableKey' | 'tableName' | 'name'>,
    record: InventoryMetadataRecord,
  ) => {
    const root = getInventoryMetadataRoot(rawData, true);
    const scopeKey = getInventoryMetadataScopeKey(item.tableKey, item.tableName);
    if (!root[scopeKey] || typeof root[scopeKey] !== 'object') {
      root[scopeKey] = {};
    }
    root[scopeKey][item.name] = {
      acquiredAt: String(record.acquiredAt || '').trim(),
      acquiredAtLocation: String(record.acquiredAtLocation || '').trim(),
    };
    saveInventoryMetadataRoot(root);
  };

  const getInventoryGlobalContext = rawData => {
    const tables = processJsonData(rawData || {});
    const globalResult = DashboardDataParser.findTable(tables, 'global');
    const headers = globalResult?.data?.headers || [];
    const row = globalResult?.data?.rows?.[0] || [];
    const config = globalResult?.config || getDashboardModuleConfig('global') || DASHBOARD_TABLE_CONFIG.global;
    const detailIdx = DashboardDataParser.findColumnIndex(headers, 'detailLocation', config);
    const timeIdx = DashboardDataParser.findColumnIndex(headers, 'currentTime', config);
    return {
      currentDetailLocation: detailIdx >= 0 ? String(row[detailIdx] || '').trim() : '',
      currentTime: timeIdx >= 0 ? String(row[timeIdx] || '').trim() : '',
    };
  };

  const syncInventoryMetadataForRawData = rawData => {
    const inventoryResult = getInventoryResult(rawData);
    if (!inventoryResult?.data) return;

    const parsed = parseInventoryItems(rawData);
    const root = getInventoryMetadataRoot(rawData, true);
    const scopeKey = getInventoryMetadataScopeKey(parsed.tableKey, parsed.tableName);
    if (!root[scopeKey] || typeof root[scopeKey] !== 'object') {
      root[scopeKey] = {};
    }

    const scope = root[scopeKey];
    const existingNames = new Set(parsed.items.map(item => item.name).filter(Boolean));
    const { currentDetailLocation, currentTime } = getInventoryGlobalContext(rawData);

    parsed.items.forEach(item => {
      if (scope[item.name]) return;
      scope[item.name] = {
        acquiredAt: currentTime,
        acquiredAtLocation: currentDetailLocation,
      };
    });

    Object.keys(scope).forEach(name => {
      if (!existingNames.has(name)) {
        delete scope[name];
      }
    });

    if (Object.keys(scope).length === 0) {
      delete root[scopeKey];
    }
    saveInventoryMetadataRoot(root);
  };

  const getGachaRewardTargetModuleKey = (target: GachaRewardTarget): 'bag' | 'equip' =>
    target === 'equipment' ? 'equip' : 'bag';

  const getGachaRewardTargetModuleName = (target: GachaRewardTarget): string =>
    target === 'equipment' ? '装备' : '物品';

  const isGachaTargetTableAliasMatch = (candidate: unknown, targetTable: string): boolean => {
    const normalizedCandidate = normalizeDiffText(candidate);
    const normalizedTarget = normalizeDiffText(targetTable);
    if (!normalizedCandidate || !normalizedTarget) return false;
    return normalizedCandidate === normalizedTarget || normalizedCandidate.toLowerCase() === normalizedTarget.toLowerCase();
  };

  const getGachaTargetTableMatches = (rawData, targetTable: string): Array<{ key: string; sheet: any }> => {
    const tableName = normalizeGachaTargetTable(targetTable);
    if (!tableName || !rawData || typeof rawData !== 'object') return [];
    return Object.entries(rawData as Record<string, any>)
      .filter(([key, sheet]) => {
        if (!key.startsWith('sheet_')) return false;
        return (
          isGachaTargetTableAliasMatch(sheet?.name, tableName) ||
          isGachaTargetTableAliasMatch(key, tableName) ||
          isGachaTargetTableAliasMatch(key.replace(/^sheet_/, ''), tableName) ||
          isGachaTargetTableAliasMatch(getCrudSqlTableName(sheet), tableName)
        );
      })
      .map(([key, sheet]) => ({ key, sheet }));
  };

  const buildGachaTableResultFromSheet = (entry: { key: string; sheet: any }, config) => {
    const sheet = entry.sheet || {};
    const content = Array.isArray(sheet.content) ? sheet.content : [];
    const rows = content.slice(1).map((row, rowIndex) => {
      if (row && typeof row === 'object') {
        Object.defineProperty(row, GACHA_CATALOG_RAW_ROW_INDEX_PROP, {
          value: rowIndex,
          configurable: true,
        });
      }
      return row;
    });
    return {
      data: {
        key: entry.key,
        headers: content[0] || [],
        rows,
        rawContent: content,
        exportConfig: sheet.exportConfig || {},
        updateConfig: sheet.updateConfig || {},
        ...sheet,
      },
      name: sheet.name || entry.key,
      key: entry.key,
      config,
    };
  };

  const resolveGachaTargetTableOverride = (rawData, target: GachaRewardTarget, options: GachaRewardParseOptions) => {
    const targetTable = normalizeGachaTargetTable(options.targetTable);
    if (!targetTable) return null;
    const matches = getGachaTargetTableMatches(rawData, targetTable);
    if (matches.length === 0) {
      throw new Error(
        withTableTemplateCheckHint(
          `未找到骰子商店奖励目标表“${targetTable}”。请检查该物品的 targetTable，或清空 targetTable 改用当前仪表盘预设的${getGachaRewardTargetModuleName(target)}区映射。`,
        ),
      );
    }
    if (matches.length > 1) {
      throw new Error(
        withTableTemplateCheckHint(
          `骰子商店奖励目标表“${targetTable}”存在 ${matches.length} 张同名表，无法判断应该写入哪一张。请先改成唯一表名，再更新 targetTable。`,
        ),
      );
    }
    const moduleKey = getGachaRewardTargetModuleKey(target);
    const config = getDashboardModuleConfig(moduleKey) || DASHBOARD_TABLE_CONFIG[moduleKey];
    return buildGachaTableResultFromSheet(matches[0], config);
  };

  const findGachaTargetColumnIndex = (headers: unknown[], headerName: string, sheet?: unknown): number => {
    const directIndex = headers.findIndex(header => isGachaTargetTableAliasMatch(header, headerName));
    if (directIndex >= 0) return directIndex;

    const columnAliasMap = buildCrudColumnAliasMap(sheet);
    if (Object.keys(columnAliasMap).length === 0) return -1;
    return headers.findIndex(header =>
      isGachaTargetTableAliasMatch(getCrudColumnNameForHeader(columnAliasMap, header), headerName),
    );
  };

  const applyGachaTargetColumnOverrides = (
    colMap: GachaRewardColumnMap,
    headers: unknown[],
    tableName: string,
    targetColumns?: GachaRewardTargetColumns,
    sheet?: unknown,
  ): GachaRewardColumnMap => {
    const entries = getGachaTargetColumnEntries(targetColumns);
    if (entries.length === 0) return colMap;
    const nextMap: GachaRewardColumnMap = { ...colMap };
    entries.forEach(([key, headerName]) => {
      const columnIndex = findGachaTargetColumnIndex(headers, headerName, sheet);
      if (columnIndex < 0) {
        throw new Error(
          withTableTemplateCheckHint(
            `目标表“${tableName}”找不到 targetColumns.${key} 指定的表头“${headerName}”。当前表头：${headers.map(header => String(header || '').trim()).filter(Boolean).join('、') || '（无）'}。`,
          ),
        );
      }
      nextMap[key] = columnIndex;
    });
    return nextMap;
  };

  const assertGachaRewardNameColumn = (tableName: string, headers: unknown[], colMap: GachaRewardColumnMap): void => {
    if (colMap.name >= 0 && colMap.name < headers.length) return;
    throw new Error(
      withTableTemplateCheckHint(
        `目标表“${tableName}”缺少可用于奖励名称的列。请在该物品的 targetColumns.name 中填写真实表头，或调整当前仪表盘预设的名称列关键词。`,
      ),
    );
  };

  const getInventoryResult = (rawData, options: GachaRewardParseOptions = {}) => {
    const targetOverride = resolveGachaTargetTableOverride(rawData, 'inventory', options);
    if (targetOverride) return targetOverride;
    const tables = processJsonData(rawData || {});
    return DashboardDataParser.findTable(tables, 'bag');
  };

  const findGachaColumnByKeywords = (headers: unknown[], keywords: readonly string[], fallbackIndex = -1): number => {
    const normalizedHeaders = headers.map(header => String(header || '').trim().toLowerCase());
    const normalizedKeywords = keywords.map(keyword => String(keyword || '').trim().toLowerCase()).filter(Boolean);

    // 先按关键词优先级精确匹配，避免“效果”列抢先命中“描述”的宽泛别名。
    for (const keyword of normalizedKeywords) {
      const exactIndex = normalizedHeaders.findIndex(header => header === keyword);
      if (exactIndex >= 0) return exactIndex;
    }
    for (const keyword of normalizedKeywords) {
      const partialIndex = normalizedHeaders.findIndex(header => header.includes(keyword));
      if (partialIndex >= 0) return partialIndex;
    }
    return fallbackIndex;
  };

  const getInventoryColumnMap = (inventoryResult, options: GachaRewardParseOptions = {}) => {
    const headers = inventoryResult?.data?.headers || [];
    const config = inventoryResult?.config || getDashboardModuleConfig('bag') || DASHBOARD_TABLE_CONFIG.bag;
    const colMap: GachaRewardColumnMap = {
      name: DashboardDataParser.findColumnIndex(headers, 'name', config),
      type: DashboardDataParser.findColumnIndex(headers, 'type', config),
      quantity: DashboardDataParser.findColumnIndex(headers, 'count', config),
      quality: findGachaColumnByKeywords(headers, ['品质', '稀有度', '品级']),
      tags: findGachaColumnByKeywords(headers, ['标签', '标记', '词条']),
      effect: findGachaColumnByKeywords(headers, ['效果', '作用', '能力', '特效']),
      description: findGachaColumnByKeywords(headers, ['描述', '说明', '用途', '备注']),
    };
    return applyGachaTargetColumnOverrides(
      colMap,
      headers,
      inventoryResult?.name || '物品表',
      options.targetColumns,
      inventoryResult?.data,
    );
  };

  const parseInventoryItems = (rawData, options: GachaRewardParseOptions = {}) => {
    const inventoryResult = getInventoryResult(rawData, options);
    if (!inventoryResult?.data) {
      return {
        tableName: '物品表',
        tableKey: '',
        headers: [],
        items: [] as InventoryParsedItem[],
        colMap: getInventoryColumnMap(inventoryResult),
      };
    }

    const headers = inventoryResult.data.headers || [];
    const rows = inventoryResult.data.rows || [];
    const colMap = getInventoryColumnMap(inventoryResult, options);
    const tableName = inventoryResult.name || '物品表';
    if (options.requireNameColumn) assertGachaRewardNameColumn(tableName, headers, colMap);

    const items = rows
      .map((row, rowIndex) => {
        const name = String(row[colMap.name] ?? '').trim();
        if (!name) return null;
        const rawRowIndex = Number((row as Record<string, unknown>)[GACHA_CATALOG_RAW_ROW_INDEX_PROP]);
        const rawQuantity = String(row[colMap.quantity] ?? '1').trim();
        const quantity = Number.parseInt(rawQuantity, 10);
        const rowNewKey = `${tableName}-row-${rowIndex}`;
        const quantityChangedKey = `${tableName}-${rowIndex}-${colMap.quantity}`;
        const isNew = getCurrentDiffMap().has(rowNewKey);
        const quantityChanged = colMap.quantity >= 0 && getCurrentDiffMap().has(quantityChangedKey);
        return {
          name,
          type: String(row[colMap.type] ?? '道具').trim() || '道具',
          quantityText: rawQuantity || '1',
          quantity: Number.isFinite(quantity) ? quantity : 1,
          quality: String(row[colMap.quality] ?? '普通').trim() || '普通',
          tags: typeof colMap.tags === 'number' && colMap.tags >= 0 ? String(row[colMap.tags] ?? '').trim() : '',
          effect: typeof colMap.effect === 'number' && colMap.effect >= 0 ? String(row[colMap.effect] ?? '').trim() : '',
          description: String(row[colMap.description] ?? '').trim(),
          rowIndex: Number.isFinite(rawRowIndex) ? rawRowIndex : rowIndex,
          tableName,
          tableKey: inventoryResult.key || '',
          isNew,
          quantityChanged,
          isChanged: isNew || quantityChanged,
        };
      })
      .filter((item): item is InventoryParsedItem => Boolean(item));

    return { tableName, tableKey: inventoryResult.key || '', headers, items, colMap };
  };

  const getEquipmentResult = (rawData, options: GachaRewardParseOptions = {}) => {
    const targetOverride = resolveGachaTargetTableOverride(rawData, 'equipment', options);
    if (targetOverride) return targetOverride;
    const tables = processJsonData(rawData || {});
    return DashboardDataParser.findTable(tables, 'equip');
  };

  const getEquipmentColumnMap = (equipmentResult, options: GachaRewardParseOptions = {}) => {
    const headers = equipmentResult?.data?.headers || [];
    const config = equipmentResult?.config || getDashboardModuleConfig('equip') || DASHBOARD_TABLE_CONFIG.equip;
    const colMap: GachaRewardColumnMap = {
      name: DashboardDataParser.findColumnIndex(headers, 'name', config),
      type: DashboardDataParser.findColumnIndex(headers, 'type', config),
      part: DashboardDataParser.findColumnIndex(headers, 'part', config),
      status: DashboardDataParser.findColumnIndex(headers, 'isEquipped', config),
      quantity: findGachaColumnByKeywords(headers, ['数量', '件数', '持有数']),
      quality: findGachaColumnByKeywords(headers, ['品质', '稀有度', '品级']),
      tags: findGachaColumnByKeywords(headers, ['标签', '标记', '词条']),
      effect: findGachaColumnByKeywords(headers, ['效果', '作用', '能力', '特效']),
      description: findGachaColumnByKeywords(headers, ['描述', '说明', '备注']),
    };
    return applyGachaTargetColumnOverrides(
      colMap,
      headers,
      equipmentResult?.name || '装备表',
      options.targetColumns,
      equipmentResult?.data,
    );
  };

  const parseEquipmentItems = (rawData, options: GachaRewardParseOptions = {}) => {
    const equipmentResult = getEquipmentResult(rawData, options);
    if (!equipmentResult?.data) {
      return {
        tableName: '装备表',
        tableKey: '',
        headers: [],
        items: [] as InventoryParsedItem[],
        colMap: getEquipmentColumnMap(equipmentResult),
      };
    }

    const headers = equipmentResult.data.headers || [];
    const rows = equipmentResult.data.rows || [];
    const colMap = getEquipmentColumnMap(equipmentResult, options);
    const tableName = equipmentResult.name || '装备表';
    if (options.requireNameColumn) assertGachaRewardNameColumn(tableName, headers, colMap);

    const items = rows
      .map((row, rowIndex) => {
        const name = String(row[colMap.name] ?? '').trim();
        if (!name) return null;
        const rawRowIndex = Number((row as Record<string, unknown>)[GACHA_CATALOG_RAW_ROW_INDEX_PROP]);
        const rawQuantity = colMap.quantity >= 0 ? String(row[colMap.quantity] ?? '1').trim() : '1';
        const quantity = Number.parseInt(rawQuantity, 10);
        const rowNewKey = `${tableName}-row-${rowIndex}`;
        const statusChangedKey =
          typeof colMap.status === 'number' && colMap.status >= 0 ? `${tableName}-${rowIndex}-${colMap.status}` : '';
        const isNew = getCurrentDiffMap().has(rowNewKey);
        const quantityChanged =
          (colMap.quantity >= 0 && getCurrentDiffMap().has(`${tableName}-${rowIndex}-${colMap.quantity}`)) ||
          (statusChangedKey ? getCurrentDiffMap().has(statusChangedKey) : false);
        return {
          name,
          type: String(row[colMap.type] ?? '装备').trim() || '装备',
          quantityText: rawQuantity || '1',
          quantity: Number.isFinite(quantity) ? quantity : 1,
          quality: String(row[colMap.quality] ?? '普通').trim() || '普通',
          tags: typeof colMap.tags === 'number' && colMap.tags >= 0 ? String(row[colMap.tags] ?? '').trim() : '',
          effect: typeof colMap.effect === 'number' && colMap.effect >= 0 ? String(row[colMap.effect] ?? '').trim() : '',
          description: String(row[colMap.description] ?? '').trim(),
          rowIndex: Number.isFinite(rawRowIndex) ? rawRowIndex : rowIndex,
          tableName,
          tableKey: equipmentResult.key || '',
          isNew,
          quantityChanged,
          isChanged: isNew || quantityChanged,
        };
      })
      .filter((item): item is InventoryParsedItem => Boolean(item));

    return { tableName, tableKey: equipmentResult.key || '', headers, items, colMap };
  };

  const getStoredGachaShardShopRarity = (): GachaRarity => {
    const stored = String(Store.get(STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, '普通') || '普通') as GachaRarity;
    return GACHA_RARITY_ORDER.includes(stored) ? stored : '普通';
  };

  const saveStoredGachaShardShopRarity = (rarity: GachaRarity) => {
    Store.set(STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, rarity);
  };

  const isGachaItemOwned = (rawData, item: GachaItemDefinition): boolean => {
    try {
      const parsed = getGachaRewardParseResultForItem(rawData, item);
      return parsed.items.some(candidate => candidate.name === item.name);
    } catch {
      return false;
    }
  };

  const renderGachaShardShopHtml = rawData => {
    const config = getConfig();
    const horizontalScrollbarClass = config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : '';
    const state = getGachaState(rawData, true) || createDefaultGachaState();
    const activePoolTag = getGachaActivePoolTag(state);
    const activeRarity = getStoredGachaShardShopRarity();
    const poolTabsHtml = getVisibleGachaPoolConfigDefinitions(rawData)
      .map(pool => {
        const isActive = activePoolTag === pool.id;
        return `
          <button
            class="acu-gacha-pool-tab acu-gacha-shard-pool-tab ${isActive ? 'active' : ''}"
            type="button"
            role="tab"
            aria-selected="${isActive ? 'true' : 'false'}"
            data-pool-tag="${escapeHtml(pool.id)}"
            title="${escapeHtml(pool.name)}"
          >
            <i class="fa-solid fa-tags"></i>
            <span>${escapeHtml(pool.name)}</span>
          </button>
        `;
      })
      .join('');
    const rarityTabsHtml = GACHA_RARITY_ORDER.map(rarity => {
      const isActive = activeRarity === rarity;
      const shardCount = Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0)));
      return `
        <button
          class="acu-gacha-shard-tab ${isActive ? 'active' : ''}"
          type="button"
          data-rarity="${escapeHtml(rarity)}"
          aria-label="${escapeHtml(`${rarity}碎片 ${String(shardCount)}`)}"
          aria-pressed="${isActive ? 'true' : 'false'}"
          title="${escapeHtml(`${rarity}碎片 ${String(shardCount)}`)}"
        >
          <i class="fa-solid ${getGachaRarityIconClass(rarity)}"></i>
          <strong>${escapeHtml(String(shardCount))}</strong>
        </button>
      `;
    }).join('');
    const items = getGachaPoolDefinitions(activePoolTag, rawData)
      .filter(item => item.quality === activeRarity)
      .sort(compareGachaItemDefinitionsForDisplay);
    const itemCardsHtml =
      items.length > 0
        ? items
            .map(item => {
              const owned = isGachaItemOwned(rawData, item);
              const balance = Math.max(0, Math.floor(Number(state.wallet.shards[item.quality] || 0)));
              const canAfford = balance >= GACHA_SHARD_EXCHANGE_COST;
              const ownedBlocked = owned && (item.unique || !item.stackable);
              const disabled = !canAfford || ownedBlocked;
              const statusHtml = ownedBlocked ? '<span class="acu-gacha-shard-owned">已拥有</span>' : '';
              return `
                <article
                  class="acu-gacha-shard-item-card ${disabled ? 'is-disabled' : 'is-available'} ${ownedBlocked ? 'is-owned' : ''}"
                  data-item-id="${escapeHtml(item.id)}"
                >
                  <button
                    class="acu-gacha-shard-price acu-gacha-shard-buy-btn"
                    type="button"
                    data-item-id="${escapeHtml(item.id)}"
                    title="${escapeHtml(`兑换：${GACHA_SHARD_EXCHANGE_COST}${getGachaShardLabel(item.quality)}`)}"
                    aria-label="${escapeHtml(`兑换 ${item.name}`)}"
                    aria-disabled="${disabled ? 'true' : 'false'}"
                  >
                    <i class="fa-solid ${getGachaRarityIconClass(item.quality)}"></i>
                    <strong>${escapeHtml(String(GACHA_SHARD_EXCHANGE_COST))}</strong>
                  </button>
                  ${statusHtml}
                  <button class="acu-gacha-shard-card-main acu-gacha-shard-detail-btn" type="button" data-item-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(`查看 ${item.name}`)}">
                    <span class="acu-gacha-shard-item-icon">${renderGachaItemIconContent(item, getGachaItemCustomTableNameIconContext(item, rawData))}</span>
                    <span class="acu-gacha-shard-item-main">
                    <span class="acu-gacha-shard-item-head">
                      <strong>${escapeHtml(item.name)}</strong>
                      <span>${escapeHtml(formatGachaItemCardMeta(item))}</span>
                    </span>
                    <span class="acu-gacha-shard-item-effect"><b>效果</b>${escapeHtml(getGachaItemEffectText(item) || '暂无效果')}</span>
                    <span class="acu-gacha-shard-item-desc"><b>描述</b>${escapeHtml(getGachaItemDescriptionText(item) || '暂无描述')}</span>
                    ${renderGachaCustomFieldsPreviewHtml(item, { limit: 2, showOverflowCount: true })}
                    </span>
                  </button>
                </article>
              `;
            })
            .join('')
        : `<div class="acu-inventory-empty compact"><i class="fa-solid fa-cubes-stacked"></i><span>${escapeHtml(getGachaPoolDisplayName(activePoolTag, rawData))} · ${escapeHtml(activeRarity)} 暂无可兑换物品</span></div>`;

    return `
      <div class="acu-inventory-detail-overlay acu-theme-${config.theme} acu-gacha-shard-shop-overlay ${horizontalScrollbarClass}">
        <div class="acu-inventory-detail acu-gacha-shard-shop">
          <div class="acu-inventory-detail-header">
            <div class="acu-inventory-detail-head-main">
              <div class="acu-inventory-detail-icon"><i class="fa-solid fa-cubes-stacked"></i></div>
              <div class="acu-inventory-detail-summary">
                <div class="acu-inventory-detail-title-row">
                <div class="acu-inventory-detail-title">碎片商城</div>
              </div>
              </div>
            </div>
            <div class="acu-inventory-detail-header-actions">
              ${getTutorialButtonHtml('shardShop', '查看碎片商城教程')}
              <button class="acu-preview-close acu-gacha-shard-shop-close" type="button" title="关闭" aria-label="关闭碎片商城"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-gacha-shard-pool-tabs acu-gacha-pool-tabs" role="tablist">${poolTabsHtml}</div>
          <div class="acu-gacha-shard-tabs" role="tablist">${rarityTabsHtml}</div>
          <div class="acu-gacha-shard-items">${itemCardsHtml}</div>
        </div>
      </div>
    `;
  };

  const bindGachaShardShopInteractions = ($overlay: JQuery<HTMLElement>) => {
    $overlay
      .off('click.acu_gacha_shard_buy_local')
      .on('click.acu_gacha_shard_buy_local', '.acu-gacha-shard-buy-btn', function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const itemId = String($(this).data('item-id') || '').trim();
        if (!itemId) return;
        showGachaShardExchangeConfirm(itemId);
      });

    $overlay
      .off('click.acu_gacha_shard_detail_local')
      .on('click.acu_gacha_shard_detail_local', '.acu-gacha-shard-detail-btn', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const itemId = String($(this).data('item-id') || '').trim();
        if (!itemId) return;
        showGachaPickupItemDetail(itemId);
      });
  };

  const refreshGachaShardShop = () => {
    const { $ } = getCore();
    const $shopOverlay = $('.acu-gacha-shard-shop-overlay').first();
    if (!$shopOverlay.length) return;
    const rawData = getCachedRawData() || getTableData();
    void (async () => {
      await ensureGachaCatalogLoaded(rawData);
      if (!$shopOverlay.length) return;
      const $nextOverlay = $(renderGachaShardShopHtml(rawData));
      $shopOverlay.children().replaceWith($nextOverlay.children());
      bindGachaShardShopInteractions($shopOverlay as JQuery<HTMLElement>);
      hydrateCustomTableNameIconsIn($shopOverlay as JQuery<HTMLElement>);
    })();
  };

  const showGachaShardShop = async () => {
    const { $ } = getCore();
    $('.acu-gacha-shard-shop-overlay').remove();
    const rawData = getCachedRawData() || getTableData();
    await ensureGachaCatalogLoaded(rawData);
    const overlay = $(renderGachaShardShopHtml(rawData));
    $('body').append(overlay);
    const overlayEl = overlay[0] as HTMLElement | undefined;
    if (overlayEl) {
      overlayEl.style.setProperty('position', 'fixed', 'important');
      overlayEl.style.setProperty('top', '0', 'important');
      overlayEl.style.setProperty('left', '0', 'important');
      overlayEl.style.setProperty('right', '0', 'important');
      overlayEl.style.setProperty('bottom', '0', 'important');
      overlayEl.style.setProperty('width', '100vw', 'important');
      overlayEl.style.setProperty('height', '100dvh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31320', 'important');
    }
    bindGachaShardShopInteractions(overlay as JQuery<HTMLElement>);
    hydrateCustomTableNameIconsIn(overlay);
    setupOverlayClose(overlay, 'acu-inventory-detail-overlay', () => overlay.remove());
  };

  const exchangeGachaShardItem = async (itemId: string) => {
    try {
      await runInSaveQueue(async () => {
        const rawData = getTableData({ silent: true }) || getCachedRawData();
        if (!rawData) return;
        await ensureGachaCatalogLoaded(rawData);
        const item = getAllGachaItemDefinitions(rawData).find(definition => definition.id === itemId);
        if (!item) return;
        if (!isGachaItemEnabled(item)) {
          if (window.toastr) window.toastr.warning('这个物品已禁用，暂时无法兑换');
          return;
        }
        if (!hasGachaRewardTableForItem(rawData, item)) {
          warnTableTemplateIssue(
            `未找到${formatGachaRewardDestinationLabel(rawData, item)}，暂时无法兑换。请检查该物品的 targetTable 或当前仪表盘预设。`,
          );
          return;
        }
        const state = touchGachaActivity(getGachaState(rawData, true));
        if (!state) return;
        const ownedBlocked = isGachaItemOwned(rawData, item) && (item.unique || !item.stackable);
        if (ownedBlocked) {
          if (window.toastr)
            window.toastr.warning(
              `这个物品已在${formatGachaRewardDestinationLabel(rawData, item)}中拥有，不能重复兑换`,
            );
          return;
        }
        const balance = Math.max(0, Math.floor(Number(state.wallet.shards[item.quality] || 0)));
        if (balance < GACHA_SHARD_EXCHANGE_COST) {
          if (window.toastr) window.toastr.warning(`${getGachaShardLabel(item.quality)}不足`);
          return;
        }
        state.wallet.shards[item.quality] = balance - GACHA_SHARD_EXCHANGE_COST;
        let result: { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null;
        try {
          result = grantGachaReward(rawData, state, item, 1);
        } catch (error) {
          state.wallet.shards[item.quality] = balance;
          throw error;
        }
        if (!result || result.outcome.duplicateConverted) {
          state.wallet.shards[item.quality] = balance;
          if (window.toastr) window.toastr.warning('兑换失败，碎片已退回');
          return;
        }
        await persistRawDataWithGacha(rawData, result.modifiedSheetKey ? [result.modifiedSheetKey] : undefined, state);
        refreshGachaVisualization();
        refreshGachaShardShop();
        refreshInventoryVisualization();
        if (window.toastr) window.toastr.success(`已兑换 ${item.name}`, '碎片商城');
      });
    } catch (error) {
      showGachaSaveError(error, '碎片兑换保存');
    }
  };

  const showGachaShardExchangeConfirm = (itemId: string) => {
    const { $ } = getCore();
    const config = getConfig();
    const rawData = getCachedRawData() || getTableData();
    const item = getAllGachaItemDefinitions(rawData).find(definition => definition.id === itemId);
    if (!item) return;
    if (!isGachaItemEnabled(item)) {
      if (window.toastr) window.toastr.warning('这个物品已禁用，暂时无法兑换');
      return;
    }
    const state = getGachaState(rawData, true) || createDefaultGachaState();
    const balance = Math.max(0, Math.floor(Number(state.wallet.shards[item.quality] || 0)));
    if (balance < GACHA_SHARD_EXCHANGE_COST) {
      if (window.toastr) window.toastr.warning(`${getGachaShardLabel(item.quality)}不足`);
      return;
    }
    if (isGachaItemOwned(rawData, item) && (item.unique || !item.stackable)) {
      if (window.toastr)
        window.toastr.warning(`这个物品已在${formatGachaRewardDestinationLabel(rawData, item)}中拥有，不能重复兑换`);
      return;
    }

    const targetLabel = formatGachaRewardDestinationLabel(rawData, item);
    const customFieldsDetailsHtml = renderGachaCustomFieldsDetailsHtml(item, { openThreshold: 2 });

    $('.acu-gacha-shard-confirm-overlay').remove();
    const overlay = $(`
      <div class="acu-gacha-shard-confirm-overlay acu-theme-${config.theme}">
        <div class="acu-gacha-shard-confirm">
          <div class="acu-gacha-shard-confirm-head">
            <div class="acu-gacha-shard-confirm-icon">${renderGachaItemIconContent(item, getGachaItemCustomTableNameIconContext(item))}</div>
            <div class="acu-gacha-shard-confirm-text">
              <strong>兑换 ${escapeHtml(item.name)}</strong>
              <span><i class="fa-solid ${getGachaRarityIconClass(item.quality)}"></i> ${escapeHtml(String(GACHA_SHARD_EXCHANGE_COST))} / 持有 ${escapeHtml(String(balance))}</span>
              <small>将写入${escapeHtml(targetLabel)}${hasGachaCustomFields(item) ? '，包含自定义字段' : ''}</small>
            </div>
          </div>
          ${customFieldsDetailsHtml}
          <div class="acu-gacha-shard-confirm-actions">
            <button class="acu-gacha-shard-confirm-btn secondary" type="button" data-action="cancel">取消</button>
            <button class="acu-gacha-shard-confirm-btn primary" type="button" data-action="confirm">兑换</button>
          </div>
        </div>
      </div>
    `);
    $('body').append(overlay);
    hydrateCustomTableNameIconsIn(overlay);
    const overlayEl = overlay[0] as HTMLElement | undefined;
    if (overlayEl) {
      overlayEl.style.setProperty('position', 'fixed', 'important');
      overlayEl.style.setProperty('top', '0', 'important');
      overlayEl.style.setProperty('left', '0', 'important');
      overlayEl.style.setProperty('right', '0', 'important');
      overlayEl.style.setProperty('bottom', '0', 'important');
      overlayEl.style.setProperty('width', '100vw', 'important');
      overlayEl.style.setProperty('height', '100dvh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31360', 'important');
    }
    setupOverlayClose(overlay, 'acu-gacha-shard-confirm-overlay', () => overlay.remove());
    overlay.on('click', '.acu-gacha-shard-confirm-btn', function (event) {
      event.stopPropagation();
      const action = String($(this).data('action') || '');
      overlay.remove();
      if (action === 'confirm') void exchangeGachaShardItem(itemId);
    });
  };

  const getInventoryActionLabel = itemType => {
    if (itemType === '任务物品') return '检查';
    if (itemType === '材料') return '查看';
    return '使用';
  };

  const getInventoryActionPrompt = item => {
    const action = getInventoryActionLabel(item.type);
    if (action === '检查') return `<user>检查${item.name}。`;
    if (action === '查看') return `<user>查看${item.name}。`;
    return `<user>使用${item.name}。`;
  };

  const getInventoryCharacters = rawData => {
    const result = [];
    if (!rawData) return result;
    for (const sheetId in rawData) {
      const sheet = rawData[sheetId];
      if (!sheet?.name || !isNpcTableName(sheet.name) || !Array.isArray(sheet.content)) continue;
      const headers = sheet.content[0] || [];
      const npcConfig = getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
      const nameIdx = DashboardDataParser.findColumnIndex(headers, 'name', npcConfig);
      const inSceneIdx = DashboardDataParser.findColumnIndex(headers, 'inScene', npcConfig);
      sheet.content.slice(1).forEach((row, rowIndex) => {
        const rawName = String(row[nameIdx] ?? '').trim();
        if (!rawName) return;
        const displayName = replaceUserPlaceholders(getDisplayName(rawName)).trim() || rawName;
        const presence = String(row[inSceneIdx] ?? '').trim() || '未知';
        result.push({ name: rawName, displayName, presence, rowIndex });
      });
    }
    return result.sort((a, b) => {
      const aInScene = a.presence === '在场' ? 0 : 1;
      const bInScene = b.presence === '在场' ? 0 : 1;
      if (aInScene !== bInScene) return aInScene - bInScene;
      return a.displayName.localeCompare(b.displayName, 'zh-CN');
    });
  };

  const renderInventoryFilterButtons = <T extends string>(
    filterKey: 'type' | 'quality' | 'sort',
    selectedValue: T,
    options: ReadonlyArray<InventoryFilterButtonMeta<T>>,
  ) =>
    options
      .map(option => {
        const isActive = option.value === selectedValue;
        return `
          <button
            class="acu-inventory-filter-btn ${isActive ? 'active' : ''}"
            type="button"
            data-filter="${filterKey}"
            data-value="${escapeHtml(option.value)}"
            title="${escapeHtml(option.label)}"
            aria-label="${escapeHtml(option.label)}"
          >
            <i class="fa-solid ${option.icon}"></i>
          </button>
        `;
      })
      .join('');

  const getInventoryActiveFilterCount = (filters: InventoryFilterState) => {
    let count = 0;
    if (filters.type !== '全部') count += 1;
    if (filters.quality !== '全部') count += 1;
    if (filters.sort !== 'default') count += 1;
    return count;
  };

  const closeGachaVisualization = () => {
    if (getGachaShopRootElement()?.isConnected) {
      getGachaShopRootElement().remove();
    }
    setGachaShopRootElement(null);
    $('.acu-gacha-overlay, .acu-gacha-shard-shop-overlay, .acu-gacha-pickup-detail-overlay').remove();
    if (getGachaShopUiRefreshTimer()) {
      clearInterval(getGachaShopUiRefreshTimer());
      setGachaShopUiRefreshTimer(null);
    }
  };

  const refreshGachaVisualization = (rawDataOverride?: unknown) => {
    const rawData = rawDataOverride || getCachedRawData();
    const overlay = getGachaShopRootElement()?.isConnected
      ? getGachaShopRootElement()
      : getGachaShopProgressContainers()[0] || null;
    if (!overlay) return;
    if (!rawData) {
      updateGachaShopProgressUi();
      return;
    }
    void (async () => {
      await ensureGachaCatalogLoaded(rawData);
      if (!overlay.isConnected) return;
      overlay.innerHTML = renderGachaPanelHtml(rawData);
      hydrateCustomTableNameIconsIn(overlay);
    })();
  };

  const showGachaVisualization = async () => {
    const { $ } = getCore();
    closeInventoryVisualization();
    closeGachaVisualization();
    const rawData = getCachedRawData() || getTableData();
    await ensureGachaCatalogLoaded(rawData);
    const overlay = $(`<div class="acu-gacha-overlay acu-theme-${getConfig().theme}"></div>`);
    overlay.html(renderGachaPanelHtml(rawData));
    $('body').append(overlay);
    hydrateCustomTableNameIconsIn(overlay);
    setGachaShopRootElement(overlay[0] as HTMLElement | null);
    startGachaShopUiRefresh();
    updateGachaShopProgressUi();
    const overlayEl = overlay[0] as HTMLElement | undefined;
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
      overlayEl.style.setProperty('z-index', '31145', 'important');
    }
    setupOverlayClose(overlay, 'acu-gacha-overlay', closeGachaVisualization);
  };

  const closeInventoryVisualization = () => {
    $('.acu-inventory-detail-overlay, .acu-inventory-overlay').remove();
  };

  const renderInventoryVisualization = rawData => {
    const config = getConfig();
    const filters = getInventoryFilters();
    const isFilterCollapsed = getInventoryFiltersCollapsedState();
    const activeFilterCount = getInventoryActiveFilterCount(filters);
    const { tableName, tableKey, items, colMap } = parseInventoryItems(rawData);
    const normalizedSearch = String(filters.search || '')
      .trim()
      .toLowerCase();

    let filteredItems = items.filter(item => {
      if (filters.type !== '全部' && item.type !== filters.type) return false;
      if (filters.quality !== '全部' && item.quality !== filters.quality) return false;
      if (!normalizedSearch) return true;
      return `${item.name} ${item.description}`.toLowerCase().includes(normalizedSearch);
    });

    filteredItems = filteredItems.sort((a, b) => {
      const taskPriority = (b.type === '任务物品' ? 1 : 0) - (a.type === '任务物品' ? 1 : 0);
      if (taskPriority !== 0) return taskPriority;
      if (a.isChanged !== b.isChanged) return a.isChanged ? -1 : 1;
      if (filters.sort === 'type') return a.type.localeCompare(b.type, 'zh-CN') || a.rowIndex - b.rowIndex;
      if (filters.sort === 'quality') {
        return (
          (INVENTORY_QUALITY_ORDER[b.quality] || 0) - (INVENTORY_QUALITY_ORDER[a.quality] || 0) ||
          a.rowIndex - b.rowIndex
        );
      }
      if (filters.sort === 'quantity') return b.quantity - a.quantity || a.rowIndex - b.rowIndex;
      if (filters.sort === 'name') return a.name.localeCompare(b.name, 'zh-CN');
      return a.rowIndex - b.rowIndex;
    });

    const isInventoryEmpty = filteredItems.length === 0;
    const itemCardsHtml =
      filteredItems.length > 0
        ? filteredItems
            .map(item => {
              const icon = getElementEmoji(item.name, null);
              const depletedClass = item.quantity <= 0 ? ' is-depleted' : '';
              const changedClass = item.isChanged ? ' acu-inventory-changed' : '';
              const iconContext = createCustomTableNameIconContext('item', tableName, 'item', item.name);
              return `
                <article class="acu-inventory-card${depletedClass}${changedClass}" data-row-index="${item.rowIndex}" data-item-name="${escapeHtml(item.name)}">
                  <button class="acu-inventory-card-main" type="button" data-action="detail" title="${escapeHtml(item.name)}" aria-label="查看 ${escapeHtml(item.name)} 详情">
                    <span class="acu-inventory-slot-visual">
                      <span class="acu-inventory-icon">${renderCustomTableNameIconContent(renderThemeIconContent(icon), iconContext)}</span>
                      <span class="acu-inventory-count" title="数量">${escapeHtml(item.quantityText)}</span>
                    </span>
                    <span class="acu-inventory-card-text">
                      <span class="acu-inventory-name">${escapeHtml(item.name)}</span>
                    </span>
                  </button>
                </article>
              `;
            })
            .join('')
        : `<div class="acu-inventory-empty">
             <i class="fa-solid fa-bag-shopping"></i>
             <span>${items.length > 0 ? '没有符合筛选条件的物品' : '暂无物品'}</span>
           </div>`;

    return `
      <div class="acu-inventory-shell acu-theme-${config.theme}">
        <div class="acu-panel-header acu-inventory-window-header">
          <div class="acu-panel-title">
            <div class="acu-title-main"><i class="fa-solid fa-box-open"></i> <span class="acu-title-text">物品栏</span></div>
            <div class="acu-title-sub">${escapeHtml(tableName)} · ${filteredItems.length}/${items.length} 项</div>
          </div>
          <div class="acu-header-actions">
            <label class="acu-inventory-search acu-inventory-search-inline">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input class="acu-inventory-filter" data-filter="search" type="search" value="${escapeHtml(filters.search || '')}" placeholder="搜索" aria-label="搜索物品">
            </label>
            ${getTutorialButtonHtml('inventory', '查看物品栏教程')}
            <button class="acu-view-btn acu-gacha-open-btn" type="button" title="骰子商店" aria-label="打开骰子商店"><i class="fa-solid fa-store"></i></button>
            ${
              tableKey
                ? `<button class="acu-view-btn acu-inventory-open-table" type="button" data-table="${escapeHtml(tableName)}" title="打开物品表" aria-label="打开物品表"><i class="fa-solid fa-table"></i></button>`
                : ''
            }
            <button class="acu-close-btn acu-inventory-close" type="button" title="关闭" aria-label="关闭物品栏"><i class="fa-solid fa-times"></i></button>
          </div>
        </div>
        <div class="acu-inventory-content">
          <div class="acu-inventory-toolbar acu-inventory-filter-collapsible ${isFilterCollapsed ? 'collapsed' : ''}">
            <button class="acu-inventory-filter-collapse-btn" type="button" title="${isFilterCollapsed ? '展开筛选' : '收起筛选'}">
              <span class="acu-inventory-filter-collapse-title">
                <i class="fa-solid fa-sliders"></i>
                <span>筛选选项</span>
                ${activeFilterCount > 0 ? `<span class="acu-inventory-filter-count">${activeFilterCount}</span>` : ''}
              </span>
              <i class="fa-solid fa-chevron-down acu-inventory-filter-collapse-icon"></i>
            </button>
            <div class="acu-inventory-filter-collapse-body">
              <div class="acu-inventory-filter-group">
                <div class="acu-inventory-filter-label"><i class="fa-solid fa-shapes"></i><span>类型</span></div>
                <div class="acu-inventory-filter-row">${renderInventoryFilterButtons('type', filters.type, INVENTORY_TYPE_FILTER_META)}</div>
              </div>
              <div class="acu-inventory-filter-group">
                <div class="acu-inventory-filter-label"><i class="fa-solid fa-gem"></i><span>品质</span></div>
                <div class="acu-inventory-filter-row">${renderInventoryFilterButtons(
                  'quality',
                  filters.quality,
                  INVENTORY_QUALITY_FILTER_META,
                )}</div>
              </div>
              <div class="acu-inventory-filter-group">
                <div class="acu-inventory-filter-label"><i class="fa-solid fa-arrow-down-wide-short"></i><span>排序</span></div>
                <div class="acu-inventory-filter-row">${renderInventoryFilterButtons('sort', filters.sort, INVENTORY_SORT_OPTIONS)}</div>
              </div>
            </div>
          </div>
          <div class="acu-inventory-grid${isInventoryEmpty ? ' is-empty' : ''}" data-table="${escapeHtml(tableName)}" data-table-key="${escapeHtml(tableKey)}" data-quantity-col="${colMap.quantity}">
            ${itemCardsHtml}
          </div>
        </div>
      </div>
    `;
  };

  const refreshInventoryVisualization = (options?: { focusSearch?: boolean; cursor?: number }) => {
    const rawData = getCachedRawData() || getTableData();
    const $overlay = $('.acu-inventory-overlay');
    if (!$overlay.length) return;
    $overlay.html(renderInventoryVisualization(rawData));
    hydrateCustomTableNameIconsIn($overlay as JQuery<HTMLElement>);
    if (options?.focusSearch) {
      const $search = $('.acu-inventory-filter[data-filter="search"]');
      $search.trigger('focus');
      const input = $search[0] as HTMLInputElement | undefined;
      if (input) {
        const cursor = Math.min(options.cursor ?? input.value.length, input.value.length);
        input.setSelectionRange(cursor, cursor);
      }
    }
  };

  const showInventoryVisualization = () => {
    const { $ } = getCore();
    closeInventoryVisualization();
    closeGachaVisualization();
    const rawData = getCachedRawData() || getTableData();
    const overlay = $(`<div class="acu-inventory-overlay acu-theme-${getConfig().theme}"></div>`);
    overlay.html(renderInventoryVisualization(rawData));
    $('body').append(overlay);
    hydrateCustomTableNameIconsIn(overlay);
    const overlayEl = overlay[0] as HTMLElement | undefined;
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
      overlayEl.style.setProperty('z-index', '31140', 'important');
    }
    setupOverlayClose(overlay, 'acu-inventory-overlay', closeInventoryVisualization);
  };

  const findInventoryItemByRow = rowIndex => {
    const rawData = getCachedRawData() || getTableData();
    const parsed = parseInventoryItems(rawData);
    return parsed.items.find(item => item.rowIndex === rowIndex) || null;
  };

  const getInventoryDetailContext = (rowIndex: number, options?: { preferLatest?: boolean }) => {
    const rawData = options?.preferLatest
      ? getTableData({ silent: true }) || cloneRuntimeDataValue(getCachedRawData())
      : getCachedRawData() || getTableData();
    const parsed = parseInventoryItems(rawData);
    const item = parsed.items.find(candidate => candidate.rowIndex === rowIndex) || null;
    if (!rawData || !item || !item.tableKey) return null;
    const table = rawData[item.tableKey];
    const headers = Array.isArray(table?.content?.[0]) ? table.content[0] : parsed.headers;
    const row = Array.isArray(table?.content?.[item.rowIndex + 1]) ? table.content[item.rowIndex + 1] : null;
    if (!row) return null;
    return {
      rawData,
      item,
      headers,
      row,
      colMap: parsed.colMap,
    };
  };

  const getInventoryFieldLabel = (fieldKey: InventoryEditableField): string => {
    const labelMap: Record<InventoryEditableField, string> = {
      name: '名称',
      type: '类型',
      quantity: '数量',
      quality: '品质',
      description: '描述',
      acquiredAtLocation: '获得地',
      acquiredAt: '获取时间',
    };
    return labelMap[fieldKey];
  };

  const getInventoryFieldColumnIndex = (
    colMap: ReturnType<typeof getInventoryColumnMap>,
    fieldKey: Exclude<InventoryEditableField, 'acquiredAtLocation' | 'acquiredAt'>,
  ): number => {
    const indexMap: Record<Exclude<InventoryEditableField, 'acquiredAtLocation' | 'acquiredAt'>, number> = {
      name: colMap.name,
      type: colMap.type,
      quantity: colMap.quantity,
      quality: colMap.quality,
      description: colMap.description,
    };
    return indexMap[fieldKey];
  };

  const getInventoryEnumOptions = (
    tableName: string,
    fieldKey: Extract<InventoryEditableField, 'type' | 'quality'>,
  ): string[] => {
    const targetColumn = fieldKey === 'type' ? '类型' : '品质';
    const matchedRule = ValidationRuleManager.getEnabledRules().find(rule => {
      if (rule.ruleType !== 'enum') return false;
      if (String(rule.targetColumn || '').trim() !== targetColumn) return false;
      const ruleTableName = String(rule.targetTable || '').trim();
      return ruleTableName === tableName || ruleTableName === '物品表';
    });
    const ruleValues = Array.isArray(matchedRule?.config?.values)
      ? matchedRule.config.values.map(value => String(value || '').trim()).filter(Boolean)
      : [];
    if (ruleValues.length > 0) return ruleValues;
    if (fieldKey === 'type') {
      return INVENTORY_TYPE_OPTIONS.filter(option => option !== '全部');
    }
    return ['普通', '优秀', '稀有', '史诗', '传说', '神话'];
  };

  const reopenInventoryItemDetail = (rowIndex: number) => {
    $('.acu-inventory-detail-overlay').remove();
    showInventoryItemDetail(rowIndex);
  };

  const saveInventoryMetadataRecord = async (rowIndex: number, nextRecord: InventoryMetadataRecord) => {
    const context = getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }
    setInventoryMetadataForItem(context.rawData, context.item, nextRecord);
    reopenInventoryItemDetail(rowIndex);
  };

  const saveInventoryFieldValue = async (rowIndex: number, fieldKey: InventoryEditableField, nextValue: string) => {
    const context = getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }

    if (fieldKey === 'acquiredAtLocation' || fieldKey === 'acquiredAt') {
      const currentRecord = getInventoryMetadataForItem(context.rawData, context.item) || {
        acquiredAt: '',
        acquiredAtLocation: '',
      };
      const nextRecord: InventoryMetadataRecord = {
        ...currentRecord,
        [fieldKey]: String(nextValue || '').trim(),
      };
      await saveInventoryMetadataRecord(rowIndex, nextRecord);
      return;
    }

    const trimmedValue = String(nextValue || '').trim();
    if (fieldKey === 'name' && !trimmedValue) {
      if (window.toastr) window.toastr.warning('物品名称不能为空');
      return;
    }

    const colIdx = getInventoryFieldColumnIndex(context.colMap, fieldKey);
    if (colIdx < 0) {
      warnTableTemplateIssue(`未找到“${getInventoryFieldLabel(fieldKey)}”列`);
      return;
    }

    const nextRow = [...context.row];
    nextRow[colIdx] = nextValue;
    await saveRowInstantly(context.item.tableKey, context.item.rowIndex, nextRow, {
      tableName: context.item.tableName,
      headers: context.headers,
      currentRow: context.row,
      sourceData: context.rawData,
      sheet: context.rawData?.[context.item.tableKey],
    });
    reopenInventoryItemDetail(rowIndex);
  };

  const renderInventoryMetadataHtml = record => {
    const acquiredAtLocation = String(record?.acquiredAtLocation || '').trim() || '未知';
    const acquiredAt = String(record?.acquiredAt || '').trim() || '未知';
    return `
      <div class="acu-inventory-detail-meta">
        <button class="acu-inventory-detail-field-row acu-inventory-detail-menu-target" type="button" data-menu-scope="field" data-field-key="acquiredAtLocation">
          <span class="acu-inventory-detail-field-label">获得地</span>
          <span class="acu-inventory-detail-field-value">${escapeHtml(acquiredAtLocation)}</span>
        </button>
        <button class="acu-inventory-detail-field-row acu-inventory-detail-menu-target" type="button" data-menu-scope="field" data-field-key="acquiredAt">
          <span class="acu-inventory-detail-field-label">获取时间</span>
          <span class="acu-inventory-detail-field-value">${escapeHtml(acquiredAt)}</span>
        </button>
      </div>
    `;
  };

  const showInventoryFieldEditDialog = (rowIndex: number, fieldKey: InventoryEditableField) => {
    const context = getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }

    const fieldLabel = getInventoryFieldLabel(fieldKey);
    if (fieldKey === 'type' || fieldKey === 'quality') {
      const { $ } = getCore();
      const config = getConfig();
      const currentValue = fieldKey === 'type' ? context.item.type : context.item.quality;
      const options = getInventoryEnumOptions(context.item.tableName, fieldKey);
      const optionButtonsHtml = options
        .map(
          option => `
            <button
              type="button"
              class="acu-dialog-btn acu-inventory-enum-option ${option === currentValue ? 'is-active' : ''}"
              data-value="${escapeHtml(option)}"
            >
              ${escapeHtml(option)}
            </button>
          `,
        )
        .join('');
      const dialog = $(`
        <div class="acu-edit-overlay acu-inventory-edit-overlay acu-inventory-enum-overlay">
          <div class="acu-edit-dialog acu-theme-${config.theme} acu-inventory-enum-dialog">
            <div class="acu-edit-title"><i class="fa-solid fa-list"></i> 选择${escapeHtml(fieldLabel)}</div>
            <div class="acu-inventory-enum-options">${optionButtonsHtml}</div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn acu-inventory-enum-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            </div>
          </div>
        </div>
      `);
      $('body').append(dialog);
      setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());
      dialog.on('click', '.acu-inventory-enum-cancel', () => dialog.remove());
      dialog.on('click', '.acu-inventory-enum-option', async function () {
        const nextValue = String($(this).data('value') || '').trim();
        if (!nextValue) return;
        try {
          await saveInventoryFieldValue(rowIndex, fieldKey, nextValue);
          dialog.remove();
        } catch (e) {
          console.error(`[DICE] 保存物品${fieldLabel}失败:`, e);
          if (window.toastr) {
            showActionableErrorToast(`保存${fieldLabel}失败`, {
              title: `保存${fieldLabel}失败`,
              developerHint: true,
            });
          }
        }
      });
      return;
    }

    if (fieldKey === 'acquiredAtLocation' || fieldKey === 'acquiredAt') {
      const currentRecord = getInventoryMetadataForItem(context.rawData, context.item) || {
        acquiredAt: '',
        acquiredAtLocation: '',
      };
      const currentValue =
        fieldKey === 'acquiredAtLocation' ? currentRecord.acquiredAtLocation : currentRecord.acquiredAt;
      showEditDialog(
        currentValue,
        async newVal => {
          try {
            await saveInventoryFieldValue(rowIndex, fieldKey, String(newVal || ''));
          } catch (e) {
            console.error(`[DICE] 保存物品${fieldLabel}失败:`, e);
            if (window.toastr) {
              showActionableErrorToast(`保存${fieldLabel}失败`, {
                title: `保存${fieldLabel}失败`,
                developerHint: true,
              });
            }
          }
        },
        {
          title: `编辑${fieldLabel}`,
          overlayClass: 'acu-inventory-edit-overlay',
        },
      );
      return;
    }

    const colIdx = getInventoryFieldColumnIndex(context.colMap, fieldKey);
    if (colIdx < 0) {
      warnTableTemplateIssue(`未找到“${fieldLabel}”列`);
      return;
    }

    const currentValue = String(context.row[colIdx] ?? '');
    showEditDialog(
      currentValue,
      async newVal => {
        try {
          await saveInventoryFieldValue(rowIndex, fieldKey, String(newVal || ''));
        } catch (e) {
          console.error(`[DICE] 保存物品${fieldLabel}失败:`, e);
          if (window.toastr) {
            showActionableErrorToast(`保存${fieldLabel}失败`, {
              title: `保存${fieldLabel}失败`,
              developerHint: true,
            });
          }
        }
      },
      {
        title: `编辑${fieldLabel}`,
        overlayClass: 'acu-inventory-edit-overlay',
      },
    );
  };

  const showInventoryMetaEditDialog = rowIndex => {
    const { $ } = getCore();
    const config = getConfig();
    const context = getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }

    const record = getInventoryMetadataForItem(context.rawData, context.item) || {
      acquiredAt: '',
      acquiredAtLocation: '',
    };
    const dialog = $(`
      <div class="acu-edit-overlay acu-inventory-edit-overlay acu-inventory-meta-overlay">
        <div class="acu-edit-dialog acu-theme-${config.theme} acu-inventory-meta-dialog">
          <div class="acu-edit-title"><i class="fa-solid fa-pen-to-square"></i> 编辑获得信息 · ${escapeHtml(context.item.name)}</div>
          <div class="acu-settings-content" style="display:flex;flex-direction:column;gap:12px;padding:4px 2px;">
            <label style="display:flex;flex-direction:column;gap:6px;">
              <span>获得地</span>
              <input type="text" class="acu-input acu-inventory-meta-input" data-field="acquiredAtLocation" value="${escapeHtml(record.acquiredAtLocation || '')}" placeholder="例如：校门口甜品店">
            </label>
            <label style="display:flex;flex-direction:column;gap:6px;">
              <span>获取时间</span>
              <input type="text" class="acu-input acu-inventory-meta-input" data-field="acquiredAt" value="${escapeHtml(record.acquiredAt || '')}" placeholder="例如：2020-05-15 20:05">
            </label>
          </div>
          <div class="acu-dialog-btns">
            <button class="acu-dialog-btn acu-inventory-meta-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            <button class="acu-dialog-btn acu-btn-confirm acu-inventory-meta-save"><i class="fa-solid fa-check"></i> 保存</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);
    setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());
    dialog.on('click', '.acu-inventory-meta-cancel', () => dialog.remove());
    dialog.on('click', '.acu-inventory-meta-save', async () => {
      const nextRecord: InventoryMetadataRecord = {
        ...record,
        acquiredAtLocation: String(
          dialog.find('.acu-inventory-meta-input[data-field="acquiredAtLocation"]').val() || '',
        ).trim(),
        acquiredAt: String(dialog.find('.acu-inventory-meta-input[data-field="acquiredAt"]').val() || '').trim(),
      };

      try {
        await saveInventoryMetadataRecord(rowIndex, nextRecord);
        dialog.remove();
      } catch (e) {
        console.error('[DICE] 保存物品获得信息失败:', e);
        if (window.toastr) {
          showActionableErrorToast('保存获得信息失败', {
            title: '保存获得信息失败',
            developerHint: true,
          });
        }
      }
    });
  };

  const showInventoryDetailMenu = (
    event: JQuery.ClickEvent,
    rowIndex: number,
    scope: InventoryMenuScope,
    fieldKey?: InventoryEditableField,
    anchorEl?: HTMLElement,
  ) => {
    const { $ } = getCore();
    const config = getConfig();
    $('.acu-cell-menu.acu-inventory-detail-menu, .acu-menu-backdrop.acu-inventory-detail-menu-backdrop').remove();

    const $overlay = $('.acu-inventory-detail-overlay').last();
    const mountTarget = $overlay.length ? $overlay : $('body');
    const backdrop = $('<div class="acu-menu-backdrop acu-inventory-detail-menu-backdrop"></div>');
    let menuItemsHtml = '';

    if (scope === 'field' && fieldKey) {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="${fieldKey}"><i class="fa-solid fa-pen"></i> 编辑${escapeHtml(getInventoryFieldLabel(fieldKey))}</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    } else if (scope === 'summary') {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="type"><i class="fa-solid fa-pen"></i> 编辑类型</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="quality"><i class="fa-solid fa-gem"></i> 编辑品质</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="quantity"><i class="fa-solid fa-hashtag"></i> 编辑数量</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    } else if (scope === 'meta') {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="acquiredAtLocation"><i class="fa-solid fa-location-dot"></i> 编辑获得地</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="acquiredAt"><i class="fa-solid fa-clock"></i> 编辑获取时间</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-meta-record"><i class="fa-solid fa-pen-to-square"></i> 编辑获得信息</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    } else {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="name"><i class="fa-solid fa-pen"></i> 编辑名称</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    }

    const menu = $(`
      <div class="acu-cell-menu acu-inventory-detail-menu acu-theme-${config.theme}" data-row-index="${rowIndex}">
        ${menuItemsHtml}
      </div>
    `);
    mountTarget.append(backdrop, menu);

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || $(window).width() || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || $(window).height() || 0;
    const menuWidth = menu.outerWidth() || 220;
    const menuHeight = menu.outerHeight() || 180;
    const anchorRect = anchorEl?.getBoundingClientRect();
    const overlayRect =
      $overlay.length && typeof $overlay[0].getBoundingClientRect === 'function'
        ? $overlay[0].getBoundingClientRect()
        : null;
    const rawEvent = event.originalEvent;
    const touchPoint = rawEvent && 'touches' in rawEvent && rawEvent.touches.length > 0 ? rawEvent.touches[0] : null;
    const changedTouchPoint =
      rawEvent && 'changedTouches' in rawEvent && rawEvent.changedTouches.length > 0
        ? rawEvent.changedTouches[0]
        : null;
    const fallbackX =
      typeof event.clientX === 'number'
        ? event.clientX
        : touchPoint?.clientX || changedTouchPoint?.clientX || viewportWidth / 2;
    const fallbackY =
      typeof event.clientY === 'number'
        ? event.clientY
        : touchPoint?.clientY || changedTouchPoint?.clientY || viewportHeight / 2;
    const pointX = anchorRect ? anchorRect.left + anchorRect.width / 2 : fallbackX;
    const pointY = anchorRect ? anchorRect.bottom : fallbackY;
    const relativeWidth = overlayRect ? overlayRect.width : viewportWidth;
    const relativeHeight = overlayRect ? overlayRect.height : viewportHeight;
    const relativePointX = overlayRect ? pointX - overlayRect.left : pointX;
    const relativePointY = overlayRect ? pointY - overlayRect.top : pointY;
    const relativeTopBase = overlayRect && anchorRect ? anchorRect.top - overlayRect.top : relativePointY;
    const left = Math.min(Math.max(relativePointX - menuWidth / 2, 8), Math.max(relativeWidth - menuWidth - 8, 8));
    const preferredTop = pointY + 8;
    const fallbackTop = (anchorRect ? anchorRect.top : pointY) - menuHeight - 8;
    const relativePreferredTop = overlayRect ? relativePointY + 8 : preferredTop;
    const relativeFallbackTop = overlayRect ? relativeTopBase - menuHeight - 8 : fallbackTop;
    const top =
      relativePreferredTop + menuHeight <= relativeHeight - 8
        ? Math.max(relativePreferredTop, 8)
        : Math.max(Math.min(relativeFallbackTop, relativeHeight - menuHeight - 8), 8);

    const menuEl = menu[0] as HTMLElement | undefined;
    if (menuEl) {
      menuEl.style.setProperty('left', `${left}px`, 'important');
      menuEl.style.setProperty('top', `${top}px`, 'important');
    } else {
      menu.css({ left: `${left}px`, top: `${top}px` });
    }

    const closeAll = () => {
      menu.remove();
      backdrop.remove();
    };

    backdrop.on('click', closeAll);
    menu.on('click', '[data-action]', function () {
      const action = String($(this).data('action') || '');
      const nextFieldKey = String($(this).data('field-key') || '') as InventoryEditableField;
      closeAll();

      if (action === 'edit-field' && nextFieldKey) {
        showInventoryFieldEditDialog(rowIndex, nextFieldKey);
        return;
      }
      if (action === 'edit-meta-record') {
        showInventoryMetaEditDialog(rowIndex);
        return;
      }
      if (action === 'edit-card') {
        const context = getInventoryDetailContext(rowIndex);
        if (!context) {
          if (window.toastr) window.toastr.warning('未找到物品数据');
          return;
        }
        showCardEditModal(
          context.row,
          context.headers,
          context.item.tableName,
          context.item.rowIndex,
          context.item.tableKey,
          {
            overlayClass: 'acu-inventory-edit-overlay',
            onSaved: () => reopenInventoryItemDetail(rowIndex),
          },
        );
      }
    });
  };

  const showInventoryItemDetail = rowIndex => {
    const { $ } = getCore();
    const config = getConfig();
    const rawData = getCachedRawData() || getTableData();
    const item = findInventoryItemByRow(rowIndex);
    if (!item) {
      if (window.toastr) window.toastr.warning('未找到该物品');
      return;
    }
    const icon = getElementEmoji(item.name, null);
    const iconContext = createCustomTableNameIconContext('item', item.tableName, 'item', item.name);
    const metaRecord = getInventoryMetadataForItem(rawData, item);
    const detailContext = getInventoryDetailContext(rowIndex);
    const quickActions = detailContext
      ? getInteractOptionsForRow(item.tableName, detailContext.headers, detailContext.row)
      : [];
    const canDismantle = isGachaRarity(String(item.quality || '').trim() as GachaRarity);
    const detail = $(`
      <div class="acu-inventory-detail-overlay acu-theme-${config.theme}">
        <div class="acu-inventory-detail" data-row-index="${item.rowIndex}">
          <div class="acu-inventory-detail-header">
            <div class="acu-inventory-detail-head-main">
              <div class="acu-inventory-detail-icon">${renderCustomTableNameIconContent(renderThemeIconContent(icon), iconContext)}</div>
              <div class="acu-inventory-detail-summary">
                <div class="acu-inventory-detail-title-row">
                  <button class="acu-inventory-detail-title acu-inventory-detail-menu-target" type="button" data-menu-scope="card">${escapeHtml(item.name)}</button>
                  <button class="acu-inventory-detail-inline-action acu-inventory-detail-gift" type="button" title="赠与" aria-label="赠与">
                    <i class="fa-solid fa-gift"></i>
                  </button>
                </div>
                <button class="acu-inventory-detail-sub acu-inventory-detail-menu-target" type="button" data-menu-scope="summary">${escapeHtml(item.type)} · ${escapeHtml(item.quality)} · 数量 ${escapeHtml(item.quantityText)}</button>
              </div>
            </div>
            <div class="acu-inventory-detail-header-actions">
              ${
                item.tableKey
                  ? '<button class="acu-view-btn acu-inventory-detail-jump" type="button" title="跳转表格" aria-label="跳转表格"><i class="fa-solid fa-table"></i></button>'
                  : ''
              }
              <button class="acu-view-btn acu-inventory-detail-dismantle" type="button" title="拆解为碎片" aria-label="拆解为碎片"><i class="fa-solid fa-hammer"></i></button>
              ${getTutorialButtonHtml('inventoryDetail', '查看物品详情教程')}
              <button class="acu-preview-close" type="button" title="关闭" aria-label="关闭物品详情"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-inventory-detail-meta-wrap">
            ${renderInventoryMetadataHtml(metaRecord)}
          </div>
          <button class="acu-inventory-detail-desc acu-inventory-detail-menu-target" type="button" data-menu-scope="field" data-field-key="description">
            ${escapeHtml(item.description || '暂无描述')}
          </button>
          ${
            canDismantle || quickActions.length > 0
              ? `<div class="acu-inventory-detail-actions">
            ${
              canDismantle
                ? '<button class="acu-action-item acu-inventory-detail-dismantle-action" type="button"><i class="fa-solid fa-hammer"></i> 分解碎片</button>'
                : ''
            }
            ${quickActions
              .map((action, actionIdx) => {
                const iconClass = String(action.icon || ACTION_ICON_MAP[action.label] || 'fa-play').trim();
                return `<button class="acu-action-item acu-inventory-detail-quick-action" type="button" data-action-idx="${actionIdx}"><i class="fa-solid ${escapeHtml(iconClass)}"></i> ${escapeHtml(action.label)}</button>`;
              })
              .join('')}
          </div>`
              : ''
          }
        </div>
      </div>
    `);
    $('.acu-inventory-detail-overlay').remove();
    $('body').append(detail);
    hydrateCustomTableNameIconsIn(detail);
    const detailEl = detail[0] as HTMLElement | undefined;
    if (detailEl) {
      detailEl.style.setProperty('position', 'fixed', 'important');
      detailEl.style.setProperty('top', '0', 'important');
      detailEl.style.setProperty('left', '0', 'important');
      detailEl.style.setProperty('right', '0', 'important');
      detailEl.style.setProperty('bottom', '0', 'important');
      detailEl.style.setProperty('width', '100vw', 'important');
      detailEl.style.setProperty('height', '100dvh', 'important');
      detailEl.style.setProperty('display', 'flex', 'important');
      detailEl.style.setProperty('justify-content', 'center', 'important');
      detailEl.style.setProperty('align-items', 'center', 'important');
      detailEl.style.setProperty('z-index', '31250', 'important');
    }
    setupOverlayClose(detail, 'acu-inventory-detail-overlay', () => detail.remove());
    detail.on('click', '.acu-preview-close', () => detail.remove());
    detail.on('click', '.acu-inventory-detail-gift', () => {
      detail.remove();
      void showInventoryGiftDialog(rowIndex);
    });
    detail.on('click', '.acu-inventory-detail-jump', () => {
      handleInventoryAction(rowIndex, 'jump');
    });
    detail.on('click', '.acu-inventory-detail-dismantle', () => {
      detail.remove();
      void dismantleInventoryItem(rowIndex);
    });
    detail.on('click', '.acu-inventory-detail-dismantle-action', e => {
      e.stopPropagation();
      e.preventDefault();
      detail.remove();
      void dismantleInventoryItem(rowIndex);
    });
    detail.on('click', '.acu-inventory-detail-quick-action', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const actionIdx = Number.parseInt(String($(this).data('action-idx') || ''), 10);
      if (Number.isNaN(actionIdx)) return;
      const freshContext = getInventoryDetailContext(rowIndex);
      if (!freshContext) return;
      const actions = getInteractOptionsForRow(freshContext.item.tableName, freshContext.headers, freshContext.row);
      const action = actions[actionIdx];
      const executed = executeTableInteractionAction(action, freshContext.headers, freshContext.row);
      if (executed) detail.remove();
    });
  };

  const showInventoryGiftDialog = async rowIndex => {
    const { $ } = getCore();
    const config = getConfig();
    const rawData = getCachedRawData() || getTableData();
    const item = findInventoryItemByRow(rowIndex);
    if (!item) {
      if (window.toastr) window.toastr.warning('未找到可赠与的物品');
      return;
    }

    const characters = getInventoryCharacters(rawData);
    const charactersWithAvatar = await Promise.all(
      characters.map(async character => {
        const avatarUrl = await AvatarManager.getAsync(character.name);
        return {
          ...character,
          avatarUrl: avatarUrl || '',
          avatarOffsetX: AvatarManager.getOffsetX(character.name),
          avatarOffsetY: AvatarManager.getOffsetY(character.name),
          avatarScale: AvatarManager.getScale(character.name),
          isPresent: character.presence === '在场',
        };
      }),
    );

    const renderGiftOptions = (onlyPresent: boolean) => {
      const filteredCharacters = onlyPresent
        ? charactersWithAvatar.filter(character => character.isPresent)
        : charactersWithAvatar;
      if (filteredCharacters.length === 0) {
        return `<div class="acu-inventory-empty compact"><i class="fa-solid fa-user-slash"></i><span>${onlyPresent ? '当前没有在场角色' : '未找到可赠与的角色'}</span></div>`;
      }

      return filteredCharacters
        .map(character => {
          const fallbackChar = character.displayName.charAt(0) || '?';
          return `
            <button
              class="acu-inventory-gift-target ${character.isPresent ? 'is-present' : 'is-away'}"
              data-name="${escapeHtml(character.displayName)}"
              data-is-present="${character.isPresent ? 'true' : 'false'}"
            >
              <span
                class="acu-inventory-gift-avatar acu-avatar-preview ${character.avatarUrl ? 'has-image' : ''} ${character.isPresent ? 'is-present' : 'is-away'}"
                data-avatar-url="${escapeHtml(character.avatarUrl)}"
                data-avatar-x="${character.avatarOffsetX}"
                data-avatar-y="${character.avatarOffsetY}"
                data-avatar-scale="${character.avatarScale}"
                aria-hidden="true"
              >
                ${!character.avatarUrl ? `<span>${escapeHtml(fallbackChar)}</span>` : ''}
                ${character.isPresent ? '<span class="acu-inventory-gift-avatar-indicator"></span>' : ''}
              </span>
              <span class="acu-inventory-gift-name ${character.isPresent ? 'is-present' : 'is-away'}" title="${escapeHtml(character.displayName)}">${escapeHtml(character.displayName)}</span>
              <span class="acu-inventory-presence ${character.isPresent ? 'is-present' : 'is-away'}">${escapeHtml(character.presence)}</span>
            </button>
          `;
        })
        .join('');
    };

    const dialog = $(`
      <div class="acu-edit-overlay acu-inventory-gift-overlay">
        <div class="acu-edit-dialog acu-theme-${config.theme} acu-inventory-gift-dialog">
          <div class="acu-edit-title acu-inventory-gift-title">
            <span><i class="fa-solid fa-gift"></i> 赠与 ${escapeHtml(item.name)}</span>
            <span class="acu-inventory-gift-title-actions">
              <button
                type="button"
                class="acu-inventory-gift-filter-toggle"
                data-only-present="false"
                title="切换仅显示在场角色"
                aria-pressed="false"
              >
                <i class="fa-solid fa-map-marker-alt"></i>
              </button>
              <button
                type="button"
                class="acu-inventory-gift-close"
                title="关闭"
                aria-label="关闭"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </span>
          </div>
          <div class="acu-inventory-gift-list">${renderGiftOptions(false)}</div>
          <div class="acu-dialog-btns">
            <button class="acu-dialog-btn acu-inventory-gift-cancel"><i class="fa-solid fa-times"></i> 取消</button>
          </div>
        </div>
      </div>
    `);

    const applyGiftAvatarStyles = ($root: JQuery<HTMLElement>) => {
      $root.find('.acu-inventory-gift-avatar').each(function () {
        const $preview = $(this);
        const url = String($preview.attr('data-avatar-url') || '').trim();
        const offsetX = Number($preview.attr('data-avatar-x') || 50);
        const offsetY = Number($preview.attr('data-avatar-y') || 50);
        const scale = Number($preview.attr('data-avatar-scale') || 150);
        const cssImageUrl = formatCssImageUrl(url, { allowInternalObjectUrl: true });

        if (!cssImageUrl) {
          $preview.removeClass('has-image').css({
            '--acu-avatar-image': '',
            '--acu-avatar-x': '',
            '--acu-avatar-y': '',
            '--acu-avatar-scale': '',
          });
          return;
        }

        $preview.addClass('has-image').css({
          '--acu-avatar-image': cssImageUrl,
          '--acu-avatar-x': `${offsetX}%`,
          '--acu-avatar-y': `${offsetY}%`,
          '--acu-avatar-scale': `${scale}%`,
        });
      });
    };

    const refreshGiftList = (onlyPresent: boolean) => {
      dialog.find('.acu-inventory-gift-list').html(renderGiftOptions(onlyPresent));
      applyGiftAvatarStyles(dialog);
    };

    $('body').append(dialog);
    applyGiftAvatarStyles(dialog);
    setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());
    dialog.on('click', '.acu-inventory-gift-close', () => dialog.remove());
    dialog.on('click', '.acu-inventory-gift-cancel', () => dialog.remove());
    dialog.on('click', '.acu-inventory-gift-filter-toggle', function () {
      const $button = $(this);
      const nextOnlyPresent = String($button.attr('data-only-present') || 'false') !== 'true';
      $button
        .attr('data-only-present', nextOnlyPresent ? 'true' : 'false')
        .attr('aria-pressed', nextOnlyPresent ? 'true' : 'false')
        .toggleClass('active', nextOnlyPresent);
      refreshGiftList(nextOnlyPresent);
    });
    dialog.on('click', '.acu-inventory-gift-target', function () {
      const targetName = String($(this).data('name') || '').trim();
      if (!targetName) return;
      smartInsertToTextarea(`<user>将${item.name}赠与${targetName}。`, 'action');
      $('#send_textarea').focus();
      dialog.remove();
      $('.acu-inventory-detail-overlay').remove();
    });
  };
  const handleInventoryAction = (rowIndex, action) => {
    const { $ } = getCore();
    const item = findInventoryItemByRow(rowIndex);
    if (!item && action !== 'detail') return;
    if (action === 'detail') {
      showInventoryItemDetail(rowIndex);
      return;
    }
    if (action === 'gift') {
      void showInventoryGiftDialog(rowIndex);
      return;
    }
    if (action === 'show') {
      smartInsertToTextarea(`<user>向周围人出示${item.name}。`, 'action');
      $('.acu-inventory-detail-overlay').remove();
      return;
    }
    if (action === 'send-desc') {
      smartInsertToTextarea(`${item.name}：${item.description || '暂无描述'}`, 'action');
      $('.acu-inventory-detail-overlay').remove();
      return;
    }
    if (action === 'jump') {
      const tableName = resolveExistingTableName(item.tableName);
      if (!tableName) {
        warnMissingTableTarget(item.tableName);
        return;
      }

      $('.acu-inventory-detail-overlay').remove();
      closeInventoryVisualization();
      Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
      Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
      Store.set('acu_changes_panel_active', false);
      saveActiveTabState(tableName);
      setActiveTableNavButton(tableName);
      setTimeout(() => renderInterface(), 0);
      setTimeout(() => {
        const $targetCard = $(`.acu-data-card[data-row-index="${rowIndex}"]`);
        if ($targetCard.length) {
          $targetCard.addClass('acu-highlight-flash');
          $targetCard[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          setTimeout(() => $targetCard.removeClass('acu-highlight-flash'), 2000);
        }
      }, 300);
      return;
    }
    smartInsertToTextarea(getInventoryActionPrompt(item), 'action');
    $('.acu-inventory-detail-overlay').remove();
  };

  // [修复] 仪表盘NPC头像异步加载（支持IndexedDB本地头像）
  const loadDashboardNpcAvatars = () => {
    const $avatars = $('.acu-dash-npc-avatar[data-npc-name]');
    if ($avatars.length === 0) return;

    const normalizeName = (value: string): string => {
      const base = String(value || '')
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
      if (!base) return '';
      const display = replaceUserPlaceholders(getDisplayName(base)).trim() || base;
      return display
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
    };

    void (async () => {
      const allAvatarData = AvatarManager.getAll();
      const candidatePool: string[] = [];
      const pushUnique = (name: string) => {
        const cleaned = String(name || '').trim();
        if (!cleaned) return;
        if (!candidatePool.includes(cleaned)) candidatePool.push(cleaned);
      };

      Object.keys(allAvatarData).forEach(pushUnique);
      Object.values(allAvatarData).forEach(data => {
        const aliasCandidates = Array.isArray((data as { aliases?: unknown[] }).aliases)
          ? ((data as { aliases?: unknown[] }).aliases as unknown[])
          : [];
        aliasCandidates.forEach(alias => pushUnique(String(alias || '')));
      });

      let localNames: string[] = [];
      try {
        localNames = (await LocalAvatarDB.getAllNames()) as string[];
      } catch {
        localNames = [];
      }
      localNames.forEach(name => pushUnique(String(name || '')));

      const normalizedNameMap = new Map<string, string[]>();
      const addNormalized = (name: string) => {
        const key = normalizeName(name);
        if (!key) return;
        if (!normalizedNameMap.has(key)) normalizedNameMap.set(key, []);
        const list = normalizedNameMap.get(key)!;
        if (!list.includes(name)) list.push(name);
      };
      candidatePool.forEach(addNormalized);

      const getManualAliases = (name: string): string[] => {
        const data = AvatarManager.getAll()[name] as { aliases?: unknown[] } | undefined;
        if (!data || !Array.isArray(data.aliases)) return [];
        return data.aliases.map(alias => String(alias || '').trim()).filter(Boolean);
      };

      $avatars.each(function () {
        const $el = $(this);
        const rawName = String($el.attr('data-npc-name') || '').trim();
        if (!rawName) return;

        void (async () => {
          try {
            const displayName = getDisplayName(rawName);
            const resolvedName = NameAliasRegistry.resolve(rawName);
            const avatarPrimaryName = AvatarManager.getPrimaryName(rawName);

            const directCandidates = Array.from(
              new Set(
                [
                  rawName,
                  displayName,
                  resolvedName,
                  avatarPrimaryName,
                  replaceUserPlaceholders(rawName),
                  replaceUserPlaceholders(displayName),
                  replaceUserPlaceholders(resolvedName),
                  ...NameAliasRegistry.getAliases(resolvedName),
                  ...NameAliasRegistry.getAliases(avatarPrimaryName),
                  ...getManualAliases(resolvedName),
                  ...getManualAliases(avatarPrimaryName),
                ]
                  .map(v => String(v || '').trim())
                  .filter(Boolean),
              ),
            );

            const allCandidates = [...directCandidates];
            directCandidates.forEach(name => {
              const key = normalizeName(name);
              if (!key) return;
              const mapped = normalizedNameMap.get(key) || [];
              mapped.forEach(m => {
                if (!allCandidates.includes(m)) allCandidates.push(m);
              });
            });

            let matchedName: string | null = null;
            let matchedUrl: string | null = null;
            let matchedLocal = false;

            // 1) 先尝试本地头像（最稳定）
            for (const name of allCandidates) {
              const localUrl = await LocalAvatarDB.get(name);
              if (localUrl) {
                matchedName = name;
                matchedUrl = localUrl;
                matchedLocal = true;
                break;
              }
            }

            // 2) 再尝试URL头像缓存
            if (!matchedUrl) {
              for (const name of allCandidates) {
                const url = AvatarManager.get(name);
                if (url) {
                  matchedName = name;
                  matchedUrl = url;
                  break;
                }
              }
            }

            // 3) 最后完整兜底（主角占位符/别名）
            if (!matchedUrl) {
              for (const name of allCandidates) {
                const url = await AvatarManager.getAsync(name);
                if (url) {
                  matchedName = name;
                  matchedUrl = url;
                  break;
                }
              }
            }

            // 找不到头像：保留首字fallback
            if (!matchedUrl || !matchedName) {
              $el.css({
                'background-image': 'none',
                'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
              });
              $el.find('.acu-dash-npc-avatar-fallback').show();
              return;
            }

            const applyAvatar = () => {
              const offsetX = AvatarManager.getOffsetX(matchedName!);
              const offsetY = AvatarManager.getOffsetY(matchedName!);
              const scale = AvatarManager.getScale(matchedName!);
              const cssImageUrl = formatCssImageUrl(matchedUrl, { allowInternalObjectUrl: true });
              if (!cssImageUrl) {
                $el.css({
                  'background-image': 'none',
                  'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
                });
                $el.find('.acu-dash-npc-avatar-fallback').show();
                return;
              }
              $el.css({
                'background-image': cssImageUrl,
                'background-size': `${scale}%`,
                'background-position': `${offsetX}% ${offsetY}%`,
                'background-repeat': 'no-repeat',
                'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
              });
              $el.find('.acu-dash-npc-avatar-fallback').hide();
            };

            // 本地头像/Blob链接直接应用，避免预加载阶段被误判
            if (matchedLocal || matchedUrl.startsWith('blob:')) {
              applyAvatar();
              return;
            }

            // URL头像先预加载，坏链路保持fallback
            const img = new Image();
            img.onload = applyAvatar;
            img.onerror = () => {
              $el.css({
                'background-image': 'none',
                'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
              });
              $el.find('.acu-dash-npc-avatar-fallback').show();
            };
            img.src = matchedUrl;
          } catch {
            $el.css({
              'background-image': 'none',
              'background-color': 'var(--acu-badge-bg, rgba(0,255,255,0.12))',
            });
            $el.find('.acu-dash-npc-avatar-fallback').show();
          }
        })();
      });
    })();
  };

  // ========== [新增] 收藏夹面板渲染函数 ==========
  const renderFavoritesPanel = async (): Promise<string> => {
    const allFavorites = await FavoritesManager.getAll();
    const allTags = await FavoritesManager.getAllTags();

    // 按标签分组
    const groupedByTag: Record<string, FavoriteItem[]> = {};
    const untagged: FavoriteItem[] = [];

    for (const fav of allFavorites) {
      if (fav.tags && fav.tags.length > 0) {
        for (const tag of fav.tags) {
          if (!groupedByTag[tag]) groupedByTag[tag] = [];
          groupedByTag[tag].push(fav);
        }
      } else {
        untagged.push(fav);
      }
    }

    // 生成卡片HTML (复用普通表格卡片样式 acu-data-card)
    const renderFavoriteCard = (fav: FavoriteItem) => {
      // 显示所有行，不做截断，超过高度内部滚动
      const rowsHtml = fav.header
        .map((h, i) => {
          const renderedCell = renderDataCardCellContent({
            rawHeaderName: h || '属性' + i,
            cell: fav.rowData[i] ?? '',
          });
          if (!renderedCell.shouldRender) return '';
          return `
        <div class="acu-card-row${renderedCell.hideLabel ? ' acu-hide-label' : ''}">
          <div class="acu-card-label">${escapeHtml(renderedCell.headerName)}</div>
          <div class="acu-card-value">${renderedCell.contentHtml}</div>
        </div>
      `;
        })
        .join('');
      const tagsHtml = fav.tags.map(tag => `<span class="acu-fav-tag">${escapeHtml(tag)}</span>`).join('');
      const sourceLabel = fav.sourceInfo ? escapeHtml(fav.sourceInfo.tableName) : '';

      // 复用 acu-data-card 结构，来源标签移到底部与tags一起显示
      return `
        <div class="acu-data-card acu-fav-card" data-id="${escapeHtml(fav.id)}">
          <div class="acu-card-header">
            <span class="acu-editable-title">${escapeHtml(String(fav.rowData[0] || '未命名'))}</span>
          </div>
          <div class="acu-card-body view-list">${rowsHtml}</div>
          <div class="acu-fav-card-tags">
            ${sourceLabel ? `<span class="acu-fav-card-source">${sourceLabel}</span>` : ''}
            ${tagsHtml}
          </div>
        </div>
      `;
    };

    // 获取配置以复用布局选项
    const config = getConfig();

    // 生成分组内容
    let contentHtml = '';

    // 按标签分组，每组使用 acu-card-grid 实现横向滚动
    for (const tag of Object.keys(groupedByTag).sort()) {
      contentHtml += `
        <div class="acu-fav-group">
          <div class="acu-fav-group-title"><i class="fa-solid fa-tag"></i> ${escapeHtml(tag)}</div>
          <div class="acu-card-grid">${groupedByTag[tag].map(renderFavoriteCard).join('')}</div>
        </div>
      `;
    }

    // 未分类
    if (untagged.length > 0) {
      contentHtml += `
        <div class="acu-fav-group">
          <div class="acu-fav-group-title"><i class="fa-solid fa-inbox"></i> 未分类</div>
          <div class="acu-card-grid">${untagged.map(renderFavoriteCard).join('')}</div>
        </div>
      `;
    }

    if (allFavorites.length === 0) {
      contentHtml += `
        <div class="acu-fav-empty">
          <i class="fa-solid fa-star"></i>
          <p>暂无收藏</p>
          <p>右键点击表格行 → 选择"收藏此行"</p>
        </div>
      `;
    }

    return `
      <div class="acu-fav-wrapper acu-theme-${config.theme}" style="--acu-card-width:${config.cardWidth}px; --acu-font-size:${config.fontSize}px;">
      <div class="acu-panel-header">
        <div class="acu-panel-title">
          <div class="acu-title-main"><i class="fa-solid fa-star"></i> <span class="acu-title-text">收藏夹</span></div>
          <div class="acu-title-sub">(共${allFavorites.length}项)</div>
        </div>
        <div class="acu-header-actions">
          ${getTutorialButtonHtml('favorites', '查看收藏夹教程')}
          <span class="acu-fav-transfer-actions">
          <button type="button" class="acu-view-btn" id="acu-fav-import" title="导入" aria-label="导入收藏"><i class="fa-solid fa-file-import"></i></button>
          <button type="button" class="acu-view-btn" id="acu-fav-export" title="导出" aria-label="导出收藏"><i class="fa-solid fa-file-export"></i></button>
          </span>
          <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" id="acu-fav-search" placeholder="搜索..." /></div>
          <div class="acu-height-control"><i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="收藏夹" title="拖动调整面板高度，双击恢复默认" aria-label="拖动调整收藏夹面板高度"></i></div>
          <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭收藏夹"><i class="fa-solid fa-times"></i></button>
        </div>
      </div>
      <div class="acu-fav-panel-content">
        <div class="acu-fav-tag-filter-collapsible collapsed">
          <div class="acu-fav-tag-filter-header">
            <span>标签过滤</span>
            <i class="fa-solid fa-chevron-down acu-fav-tag-toggle-icon"></i>
          </div>
          <div class="acu-fav-tag-filter-body">
            ${untagged.length > 0 ? '<button type="button" class="acu-fav-tag-btn active" data-tag="__untagged__">未分类</button>' : ''}
            ${allTags.map(tag => `<button type="button" class="acu-fav-tag-btn active" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join('')}
          </div>
        </div>
        ${contentHtml}
      </div>
      </div>
    `;
  };

  // ========== [新增] 收藏夹面板事件绑定 ==========
  const bindFavoritesEvents = ($panel: JQuery) => {
    const { $ } = getCore();
    const rawData = getCachedRawData() || getTableData();
    const currentTables = rawData || {};

    // 只解绑收藏夹相关的事件，防止影响其他功能的事件绑定（如标签页切换）
    $panel.off('.favEvents');

    // === [修复] 收藏夹面板：阻止水平滑动冒泡，防止触发 ST 的 swipe regenerate ===
    (function () {
      const panelEl = $panel[0];
      if (!panelEl) return;

      // 清理旧的事件监听器（通过标记）
      if ((panelEl as any)._favSwipeFixApplied) return;
      (panelEl as any)._favSwipeFixApplied = true;

      let touchStartX = 0;
      let touchStartY = 0;
      let isHorizontalSwipe = false;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isHorizontalSwipe = false;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        // 判断是否为水平滑动：deltaY很小时降低阈值，否则使用标准判断
        const isHorizontal = deltaY < 5 ? deltaX > 5 && deltaX > deltaY * 2 : deltaX > deltaY * 1.5 && deltaX > 10;

        if (isHorizontal) {
          isHorizontalSwipe = true;
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      };

      const onTouchEnd = (e: TouchEvent) => {
        if (isHorizontalSwipe) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          isHorizontalSwipe = false;
        }
        touchStartX = 0;
        touchStartY = 0;
      };

      // 在捕获阶段监听，优先于 ST 的事件处理
      panelEl.addEventListener('touchstart', onTouchStart, true);
      panelEl.addEventListener('touchmove', onTouchMove, true);
      panelEl.addEventListener('touchend', onTouchEnd, true);

      // 清理函数（页面卸载时）
      $(window).on('pagehide.favSwipeFix', () => {
        panelEl.removeEventListener('touchstart', onTouchStart, true);
        panelEl.removeEventListener('touchmove', onTouchMove, true);
        panelEl.removeEventListener('touchend', onTouchEnd, true);
      });
    })();

    // 关闭按钮
    $panel.on('click.favEvents', '.acu-close-btn', function (e) {
      e.stopPropagation();
      Store.set('acu_favorites_panel_active', false);
      closePanel($panel.closest<HTMLElement>(DICE_ROOT_SELECTOR));
      $panel.html('');
    });

    // [修复] 高度拖拽 - 收藏夹面板
    $panel.on('pointerdown.favEvents', '.acu-height-drag-handle', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const handle = this;
      handle.setPointerCapture(e.pointerId);
      $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
      const $dataArea = $panel;
      const startHeight = getPanelDragStartHeight($dataArea);
      let requestedHeight = startHeight;
      const startY = e.clientY;
      const tableName = $(handle).data('table');

      handle.onpointermove = function (moveE: PointerEvent) {
        const dy = moveE.clientY - startY;
        requestedHeight = setPanelRequestedHeight($dataArea, startHeight - dy) || requestedHeight;
      };
      handle.onpointerup = function (upE: PointerEvent) {
        $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
        handle.releasePointerCapture(upE.pointerId);
        handle.onpointermove = null;
        handle.onpointerup = null;
        if (tableName) {
          savePanelRequestedHeight(tableName, requestedHeight);
        }
      };
    });

    // [修复] 双击重置高度 - 收藏夹面板
    $panel.on('dblclick.favEvents', '.acu-height-drag-handle', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const tableName = $(this).data('table');
      if (tableName) {
        resetPanelRequestedHeight($panel, tableName);
      }
    });

    // 标签过滤折叠/展开
    $panel.on('click.favEvents', '.acu-fav-tag-filter-header', function () {
      const $collapsible = $(this).closest('.acu-fav-tag-filter-collapsible');
      $collapsible.toggleClass('collapsed');
    });

    // 标签按钮toggle
    $panel.on('click.favEvents', '.acu-fav-tag-btn', function () {
      const $btn = $(this);
      const tag = $btn.data('tag') as string;
      const isActive = $btn.hasClass('active');

      // 切换按钮状态
      $btn.toggleClass('active');

      // 过滤对应分组
      if (tag === '__untagged__') {
        // 未分类分组：找标题包含"未分类"的分组
        $panel.find('.acu-fav-group').each(function () {
          const groupTitle = $(this).find('.acu-fav-group-title').text();
          if (groupTitle.includes('未分类')) {
            $(this).toggle(!isActive);
          }
        });
      } else {
        // 普通标签分组：找标题匹配的分组
        $panel.find('.acu-fav-group').each(function () {
          const groupTitle = $(this).find('.acu-fav-group-title').text();
          if (groupTitle.includes(tag) && !groupTitle.includes('未分类')) {
            $(this).toggle(!isActive);
          }
        });
      }
    });

    // 搜索
    $panel.find('#acu-fav-search').on(
      'input.favEvents',
      _.debounce(function () {
        const searchTerm = ($(this).val() as string).toLowerCase().trim();
        $panel.find('.acu-fav-card').each(function () {
          const cardText = $(this).text().toLowerCase();
          $(this).toggle(cardText.includes(searchTerm));
        });
      }, 300),
    );

    // 显示收藏卡片菜单
    const showFavCardMenu = (e: JQuery.ClickEvent, cardId: string) => {
      $('.acu-cell-menu, .acu-menu-backdrop').remove();

      const backdrop = $('<div class="acu-menu-backdrop"></div>');
      $('body').append(backdrop);

      const config = getConfig();
      const menu = $(`
        <div class="acu-cell-menu acu-theme-${config.theme}" data-fav-id="${escapeHtml(cardId)}">
          <button type="button" class="acu-cell-menu-item" data-action="edit"><i class="fa-solid fa-pen"></i> 编辑</button>
          <button type="button" class="acu-cell-menu-item" data-action="copy"><i class="fa-solid fa-copy"></i> 复制</button>
          <button type="button" class="acu-cell-menu-item" data-action="send"><i class="fa-solid fa-paper-plane"></i> 发送到表格</button>
          <button type="button" class="acu-cell-menu-item" data-action="delete"><i class="fa-solid fa-trash"></i> 删除</button>
          <button type="button" class="acu-cell-menu-item" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
        </div>
      `);
      $('body').append(menu);

      // 定位菜单
      const winWidth = $(window).width() || 800;
      const winHeight = $(window).height() || 600;
      const mWidth = menu.outerWidth() || 150;
      const mHeight = menu.outerHeight() || 150;
      let posX = e.clientX || winWidth / 2;
      let posY = e.clientY || winHeight / 2;
      if (posX + mWidth > winWidth) posX = winWidth - mWidth - 10;
      if (posY + mHeight > winHeight) posY = winHeight - mHeight - 10;
      menu.css({ left: posX, top: posY });

      // 点击backdrop关闭
      backdrop.on('click', () => {
        $('.acu-cell-menu, .acu-menu-backdrop').remove();
      });

      // 菜单项点击事件
      menu.on('click', '.acu-cell-menu-item', async function () {
        const action = $(this).data('action');
        const id = menu.data('fav-id');
        $('.acu-cell-menu, .acu-menu-backdrop').remove();

        if (action === 'close') return;

        const fav = await FavoritesManager.getById(id);
        if (!fav) return;

        if (action === 'edit') {
          showFavoriteEditModal(fav, async updated => {
            await FavoritesManager.updateFavorite(id, updated);
            $panel.html(await renderFavoritesPanel());
            bindFavoritesEvents($panel);
          });
        } else if (action === 'copy') {
          const copied = await FavoritesManager.duplicateFavorite(id);
          if (copied) {
            $panel.html(await renderFavoritesPanel());
            bindFavoritesEvents($panel);
          }
        } else if (action === 'send') {
          const compatible = FavoritesManager.findCompatibleTables(fav, currentTables);
          if (compatible.length === 0) {
            toastr.warning('当前聊天没有兼容的表格');
            return;
          }
          showSendToTableModal(fav, compatible, currentTables, async () => {
            $panel.html(await renderFavoritesPanel());
            bindFavoritesEvents($panel);
          });
        } else if (action === 'delete') {
          await FavoritesManager.deleteFavorite(id);
          $panel.html(await renderFavoritesPanel());
          bindFavoritesEvents($panel);
        }
      });
    };

    // 单击卡片显示菜单
    $panel.on('click.favEvents', '.acu-fav-card', function (e) {
      e.stopPropagation();
      const $card = $(this);
      const cardId = $card.data('id');

      // Toggle行为：同一卡片再次点击则关闭菜单
      const existingMenu = $('.acu-cell-menu');
      if (existingMenu.length && existingMenu.data('fav-id') === cardId) {
        $('.acu-cell-menu, .acu-menu-backdrop').remove();
        return;
      }

      showFavCardMenu(e, cardId);
    });

    // 导入
    $panel.on('click.favEvents', '#acu-fav-import', async function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          const result = await FavoritesManager.importFavorites(text);
          // [修复] importFavorites 返回 { added, updated } 对象，不是数字
          if (result && (result.added > 0 || result.updated > 0)) {
            if (window.toastr) window.toastr.success(`导入成功: 新增${result.added}条, 更新${result.updated}条`);
            $panel.html(await renderFavoritesPanel());
            bindFavoritesEvents($panel);
          } else {
            if (window.toastr) window.toastr.warning('导入失败或无有效数据');
          }
        }
      };
      input.click();
    });

    // 导出
    $panel.on('click.favEvents', '#acu-fav-export', async function () {
      const json = await FavoritesManager.exportFavorites();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favorites_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (window.toastr) window.toastr.success('导出成功');
    });

    console.log('[DICE] bindFavoritesEvents initialized');
  };

  const renderOptionTableContent = (tableData, tableName, reverseBtnHtml, isReversed) => {
    const config = getConfig();
    const searchTerm = String(getTableSearchStates()[tableName] || '')
      .toLowerCase()
      .trim();
    let optionItems = getOptionItemsFromTable(tableData);

    if (searchTerm) {
      optionItems = optionItems.filter(item => {
        const text = item.text.toLowerCase();
        const header = item.header.toLowerCase();
        return text.includes(searchTerm) || header.includes(searchTerm);
      });
    }

    if (isReversed) {
      optionItems = [...optionItems].reverse();
    }

    const itemsPerPage = config.itemsPerPage || 50;
    const totalItems = optionItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    let currentPage = getTablePageStates()[tableName] || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    getTablePageStates()[tableName] = currentPage;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const rowsToRender = optionItems.slice(startIdx, endIdx);
    const displayStart = totalItems > 0 ? startIdx + 1 : 0;
    const displayEnd = Math.min(endIdx, totalItems);
    const optionRowsHtml =
      rowsToRender.length > 0
        ? rowsToRender
            .map((item, idx) => {
              const displayIndex = startIdx + idx + 1;
              return `
                <button class="acu-opt-btn acu-option-table-row" data-val="${safeEncodeURIComponent(item.text)}" data-option-row="${item.rowIndex}" data-option-col="${item.colIndex}">
                  <span class="acu-option-table-index">#${displayIndex}</span>
                  <span class="acu-option-table-text">${escapeHtml(item.text)}</span>
                </button>`;
            })
            .join('')
        : `<div class="acu-option-table-empty">${searchTerm ? '暂无匹配选项' : '暂无可点击选项'}</div>`;

    const headerActionCount = 4 + (reverseBtnHtml ? 1 : 0);
    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
                    <div class="acu-title-main"><i class="fa-solid ${getIconForTableName(tableName)}"></i> <span class="acu-title-text">${escapeHtml(tableName)}</span></div>
                    <div class="acu-title-sub">(${displayStart}-${displayEnd} / 共${totalItems}项)${isReversed ? ' <span style="color:var(--acu-accent);">↓倒序</span>' : ''}</div>
                </div>
                <div class="acu-header-actions acu-table-header-actions" data-action-count="${headerActionCount}">
                    <div class="acu-table-action-set">
                        ${getTutorialButtonHtml('optionTable', '查看选项表教程')}
                        ${reverseBtnHtml}
                        <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" placeholder="搜索选项..." value="${escapeHtml(getTableSearchStates()[tableName] || '')}" /></div>
                    </div>
                    <div class="acu-panel-control-set" aria-label="${escapeHtml(tableName)}面板控制">
                        <div class="acu-height-control">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div class="acu-panel-content acu-option-table-content">
                <div class="acu-card-grid acu-option-table-grid">
                    <div class="acu-option-panel acu-theme-${config.theme} acu-option-table-panel">
                        ${optionRowsHtml}
                    </div>
                </div>
            </div>`;

    if (totalPages > 1) {
      html += `<div class="acu-panel-footer"><button class="acu-page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
      const range = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
      } else {
        if (currentPage <= 4) range.push(1, 2, 3, 4, 5, '...', totalPages);
        else if (currentPage >= totalPages - 3)
          range.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        else range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
      range.forEach(p => {
        if (p === '...') html += `<span class="acu-page-info">...</span>`;
        else html += `<button class="acu-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
      });
      html += `<button class="acu-page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button></div>`;
    }

    return html;
  };

  const renderCheckSuggestionTableContent = (tableData, tableName, reverseBtnHtml, isReversed) => {
    const config = getConfig();
    const searchTerm = String(getTableSearchStates()[tableName] || '')
      .toLowerCase()
      .trim();
    let suggestionItems = getCheckSuggestionItemsFromTable(tableData);

    if (searchTerm) {
      suggestionItems = suggestionItems.filter(item => {
        const displayText = item.displayText.toLowerCase();
        const commandText = item.commandText.toLowerCase();
        return displayText.includes(searchTerm) || commandText.includes(searchTerm);
      });
    }

    if (isReversed) {
      suggestionItems = [...suggestionItems].reverse();
    }

    const itemsPerPage = config.itemsPerPage || 50;
    const totalItems = suggestionItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    let currentPage = getTablePageStates()[tableName] || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    getTablePageStates()[tableName] = currentPage;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const rowsToRender = suggestionItems.slice(startIdx, endIdx);
    const displayStart = totalItems > 0 ? startIdx + 1 : 0;
    const displayEnd = Math.min(endIdx, totalItems);
    const suggestionRowsHtml =
      rowsToRender.length > 0
        ? rowsToRender
            .map((item, idx) => {
              const displayIndex = item.rowId || String(startIdx + idx + 1);
              return `
                <button class="acu-check-suggestion-btn acu-option-table-row" data-display="${safeEncodeURIComponent(item.displayText)}" data-command="${safeEncodeURIComponent(item.commandText)}" data-check-row="${item.rowIndex}">
                  <span class="acu-option-table-index">#${escapeHtml(displayIndex)}</span>
                  <span class="acu-option-table-text">${escapeHtml(item.displayText || '未填写展示文本')}</span>
                </button>`;
            })
            .join('')
        : `<div class="acu-option-table-empty">${searchTerm ? '暂无匹配建议' : '暂无检定建议'}</div>`;

    const headerActionCount = 4 + (reverseBtnHtml ? 1 : 0);
    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
                    <div class="acu-title-main"><i class="fa-solid ${getIconForTableName(tableName)}"></i> <span class="acu-title-text">${escapeHtml(tableName)}</span></div>
                    <div class="acu-title-sub">(${displayStart}-${displayEnd} / 共${totalItems}项)${isReversed ? ' <span style="color:var(--acu-accent);">↓倒序</span>' : ''}</div>
                </div>
                <div class="acu-header-actions acu-table-header-actions" data-action-count="${headerActionCount}">
                    <div class="acu-table-action-set">
                        ${getTutorialButtonHtml('checkSuggestionTable', '查看检定建议表教程')}
                        ${reverseBtnHtml}
                        <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" placeholder="搜索建议..." value="${escapeHtml(getTableSearchStates()[tableName] || '')}" /></div>
                    </div>
                    <div class="acu-panel-control-set" aria-label="${escapeHtml(tableName)}面板控制">
                        <div class="acu-height-control">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div class="acu-panel-content acu-option-table-content">
                <div class="acu-card-grid acu-option-table-grid">
                    <div class="acu-option-panel acu-theme-${config.theme} acu-option-table-panel">
                        ${suggestionRowsHtml}
                    </div>
                </div>
            </div>`;

    if (totalPages > 1) {
      html += `<div class="acu-panel-footer"><button class="acu-page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
      const range = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
      } else {
        if (currentPage <= 4) range.push(1, 2, 3, 4, 5, '...', totalPages);
        else if (currentPage >= totalPages - 3)
          range.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        else range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
      range.forEach(p => {
        if (p === '...') html += `<span class="acu-page-info">...</span>`;
        else html += `<button class="acu-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
      });
      html += `<button class="acu-page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button></div>`;
    }

    return html;
  };

  const renderTableContent = (tableData, tableName) => {
    const isReversed = isTableReversed(tableName);
    const reverseBtnHtml = shouldShowReverseButton(tableName)
      ? `
            <button type="button" class="acu-view-btn acu-reverse-btn" data-table="${escapeHtml(tableName)}" title="${isReversed ? '当前：倒序（新→旧），点击切换为正序' : '当前：正序（旧→新），点击切换为倒序'}" aria-label="${isReversed ? '切换为正序' : '切换为倒序'}">
                <i class="fa-solid ${isReversed ? 'fa-sort-amount-up' : 'fa-sort-amount-down'}"></i>
            </button>
        `
      : '';

    if (tableData && isOptionTableName(tableName)) {
      return renderOptionTableContent(tableData, tableName, reverseBtnHtml, isReversed);
    }

    if (tableData && isCheckSuggestionTableName(tableName)) {
      return renderCheckSuggestionTableContent(tableData, tableName, reverseBtnHtml, isReversed);
    }

    if (!tableData || !tableData.rows.length) {
      const emptyHeaderActionCount = 3 + (reverseBtnHtml ? 1 : 0);
      return `
            <div class="acu-panel-header"><div class="acu-panel-title"><div class="acu-title-main"><i class="fa-solid ${getIconForTableName(tableName)}"></i> <span class="acu-title-text">${escapeHtml(tableName)}</span></div><div class="acu-title-sub">暂无可浏览条目</div></div><div class="acu-header-actions acu-table-header-actions" data-action-count="${emptyHeaderActionCount}"><div class="acu-table-action-set">${getTutorialButtonHtml('table', '查看表格教程')}${reverseBtnHtml}</div><div class="acu-panel-control-set" aria-label="${escapeHtml(tableName)}面板控制"><div class="acu-height-control"><i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i></div><button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button></div></div></div>
            <div class="acu-panel-content"><div class="acu-empty-state"><i class="fa-regular fa-folder-open"></i><span>暂无数据</span></div></div>`;
    }

    const config = getConfig();
    const headers = (tableData.headers || []).slice(1);

    // [新增] 获取数据库锁定状态API
    const dbLockApi = getDbLockAPI();
    const sheetKey = dbLockApi ? getSheetKeyByTableName(tableName) : null;
    const lockState = dbLockApi && sheetKey ? dbLockApi.getTableLockState(sheetKey) : null;

    // 获取当前表格的视图模式 (默认 list)
    const currentStyle = (getTableStyles() || {})[tableName] || 'list';
    const isGridMode = currentStyle === 'grid';
    const showRelationGraphButton = isCharacterTable(tableName);
    const showMapButton = tableName.includes('地图');
    const showInventoryButton = tableName.includes('物品') || tableName.includes('背包') || tableName.includes('道具');
    const headerActionCount =
      5 +
      (reverseBtnHtml ? 1 : 0) +
      (showRelationGraphButton ? 1 : 0) +
      (showMapButton ? 1 : 0) +
      (showInventoryButton ? 1 : 0);

    let titleColIndex = 1;
    if (tableData.headers.length === 1) {
      titleColIndex = 0;
    } else if (tableName.includes('总结') || tableName.includes('大纲')) {
      const idx = tableData.headers.findIndex(
        h => h && (h.includes('索引') || h.includes('编号') || h.includes('代码')),
      );
      if (idx > 0) titleColIndex = idx;
    }

    // --- 搜索和排序逻辑 ---
    let processedRows = tableData.rows.map((row, index) => {
      const rowKey = getRowKey(tableName, row, tableData.headers);
      const isBookmarked = rowKey && BookmarkManager.isBookmarked(tableName, rowKey);
      return { data: row, originalIndex: index, rowKey, isBookmarked };
    });
    const searchTerm = (getTableSearchStates()[tableName] || '').toLowerCase().trim();

    if (searchTerm) {
      processedRows = processedRows.filter(item =>
        item.data.some(cell => String(cell).toLowerCase().includes(searchTerm)),
      );
      processedRows.sort((a, b) => {
        // 优先按bookmark状态排序：bookmark的在前
        if (a.isBookmarked && !b.isBookmarked) return -1;
        if (!a.isBookmarked && b.isBookmarked) return 1;
        // 在bookmark组内和非bookmark组内，保持原有的搜索匹配度排序
        const titleA = String(a.data[titleColIndex] || '').toLowerCase();
        const titleB = String(b.data[titleColIndex] || '').toLowerCase();
        const aHitTitle = titleA.includes(searchTerm);
        const bHitTitle = titleB.includes(searchTerm);
        if (titleA === searchTerm && titleB !== searchTerm) return -1;
        if (titleA !== searchTerm && titleB === searchTerm) return 1;
        if (aHitTitle && !bHitTitle) return -1;
        if (!aHitTitle && bHitTitle) return 1;
        return isReversed ? b.originalIndex - a.originalIndex : a.originalIndex - b.originalIndex;
      });
    } else {
      // 默认按原始顺序排列，如果启用倒序则反转
      // 但bookmark的始终在前
      processedRows.sort((a, b) => {
        // 优先按bookmark状态排序：bookmark的在前
        if (a.isBookmarked && !b.isBookmarked) return -1;
        if (!a.isBookmarked && b.isBookmarked) return 1;
        // 在bookmark组内和非bookmark组内，保持原有的排序逻辑
        if (isReversed) {
          return b.originalIndex - a.originalIndex;
        } else {
          return a.originalIndex - b.originalIndex;
        }
      });
    }

    const itemsPerPage = config.itemsPerPage || 50;
    const totalItems = processedRows.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    let currentPage = getTablePageStates()[tableName] || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    getTablePageStates()[tableName] = currentPage;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const rowsToRender = processedRows.slice(startIdx, endIdx);
    // [修改] 表头增加了 视图切换按钮 和 高度拖拽手柄

    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
    <div class="acu-title-main"><i class="fa-solid ${getIconForTableName(tableName)}"></i> <span class="acu-title-text">${escapeHtml(tableName)}</span></div>
    <div class="acu-title-sub">(${startIdx + 1}-${Math.min(endIdx, totalItems)} / 共${totalItems}项)${isReversed ? ' <span style="color:var(--acu-accent);">↓倒序</span>' : ''}</div>
</div>
                <div class="acu-header-actions acu-table-header-actions" data-action-count="${headerActionCount}">
                    <div class="acu-table-action-set">
                        ${getTutorialButtonHtml('table', '查看表格教程')}
                        ${showRelationGraphButton ? `<button type="button" class="acu-view-btn" id="acu-btn-relation-graph" data-table="${escapeHtml(tableName)}" title="查看人物关系图" aria-label="查看人物关系图"><i class="fa-solid fa-project-diagram"></i></button>` : ''}
                        ${showMapButton ? `<button type="button" class="acu-view-btn acu-table-map-btn" title="地图可视化" aria-label="地图可视化"><i class="fa-solid fa-map"></i></button>` : ''}
                        ${showInventoryButton ? `<button type="button" class="acu-view-btn acu-table-inventory-btn" title="物品栏可视化" aria-label="物品栏可视化"><i class="fa-solid fa-box-open"></i></button>` : ''}
                        ${reverseBtnHtml}
                        <button type="button" class="acu-view-btn" id="acu-btn-switch-style" data-table="${escapeHtml(tableName)}" title="切换视图模式，当前为${isGridMode ? '双列网格' : '单列列表'}" aria-label="切换视图模式">
                            <i class="fa-solid ${isGridMode ? 'fa-th-large' : 'fa-list'}"></i>
                        </button>
                        <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" placeholder="搜索全部..." value="${(getTableSearchStates()[tableName] || '').replace(/"/g, '&quot;')}" /></div>
                    </div>
                    <div class="acu-panel-control-set" aria-label="${escapeHtml(tableName)}面板控制">
                        <div class="acu-height-control">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div class="acu-panel-content"><div class="acu-card-grid">`;

    html += rowsToRender
      .map(item => {
        const realRowIdx = item.originalIndex;
        const row = item.data;
        const cardTitle = row[titleColIndex] || '未命名';
        // 角色相关表格：将逗号分隔名称转为主key显示
        const cardTitleDisplay = isCharacterTable(tableName) ? getDisplayName(String(cardTitle)) : String(cardTitle);
        const showDefaultIndex = titleColIndex === 1;
        const titleCellId = `${tableData.key}-${realRowIdx}-${titleColIndex}`;
        const isTitleModified = window.acuModifiedSet && window.acuModifiedSet.has(titleCellId);
        const isRowNew = getCurrentDiffMap().has(`${tableName}-row-${realRowIdx}`);
        let rowClass = '';
        if (config.highlightNew) {
          if (isTitleModified) rowClass = 'acu-highlight-manual';
          else if (isRowNew) rowClass = 'acu-highlight-diff';
        }

        // [迁移] 计算整行锁定状态（移到外层以便卡片标题使用）
        const cardLockRowKey = getRowKey(tableName, row, tableData.headers);
        const cardRowIndex =
          sheetKey && cardLockRowKey ? findRowIndexByPrimaryKey(sheetKey, tableName, cardLockRowKey) : null;
        const isCardRowLocked = lockState && cardRowIndex !== null ? lockState.rows.includes(cardRowIndex) : false;

        // [新增] 计算标题列是否单独锁定（用于在标题后显示小锁图标）
        // titleColIndex 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
        const isTitleCellLocked =
          lockState && cardRowIndex !== null ? lockState.cells.includes(`${cardRowIndex}:${titleColIndex - 1}`) : false;

        // 计算有效列数，用于网格视图末行占满处理
        const validColIndices = row.map((_, i) => i).filter(i => i > 0 && i !== titleColIndex);
        const isOddValidCount = validColIndices.length % 2 === 1;

        const cardBody = row
          .map((cell, cIdx) => {
            if (cIdx <= 0 || cIdx === titleColIndex) return '';
            // [新增] 隐藏"交互选项"列（因为已经以按钮形式显示）
            const currentHeader = headers[cIdx - 1] || '';
            if (currentHeader.includes('交互')) return '';
            const isLastValidCol = cIdx === validColIndices[validColIndices.length - 1];
            const spanFullRow = isLastValidCol && isOddValidCount;
            // 清理列标题：移除括号/方括号及其内容
            const rawHeaderName = headers[cIdx - 1] || '属性' + cIdx;

            // [迁移] 计算单元格锁定状态（复用外层的cardRowIndex）
            // [修复] cIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
            const isThisCellLocked =
              lockState && cardRowIndex !== null ? lockState.cells.includes(`${cardRowIndex}:${cIdx - 1}`) : false;
            // [改进] 整行锁定时，所有单元格都显示锁定图标
            const isThisFieldLocked = isCardRowLocked || isThisCellLocked;

            const renderedCell = renderDataCardCellContent({
              rawHeaderName,
              cell,
              isFieldLocked: isThisFieldLocked,
            });
            if (!renderedCell.shouldRender) return '';
            const { headerName, contentHtml, hideLabel } = renderedCell;

            const isDiffChanged = getCurrentDiffMap().has(tableName + '-' + realRowIdx + '-' + cIdx);
            const cellId = tableData.key + '-' + realRowIdx + '-' + cIdx;
            const isUserModified = window.acuModifiedSet && window.acuModifiedSet.has(cellId);
            let cellHighlight = '';
            if (config.highlightNew) {
              if (isUserModified) cellHighlight = 'acu-highlight-manual';
              else if (isDiffChanged) cellHighlight = 'acu-highlight-diff';
            }

            // 隐藏标题时添加特殊 class
            // 检查锁定状态并添加图标 (已移除重复计算)

            const rowClass =
              'acu-card-row acu-cell' +
              (spanFullRow ? ' acu-grid-span-full' : '') +
              (hideLabel ? ' acu-hide-label' : '');

            return (
              '<div class="' +
              rowClass +
              '" data-key="' +
              escapeHtml(tableData.key) +
              '" data-tname="' +
              escapeHtml(tableName) +
              '" data-row="' +
              realRowIdx +
              '" data-col="' +
              cIdx +
              '" data-val="' +
              safeEncodeURIComponent(cell ?? '') +
              '"><div class="acu-card-label"><span data-locked="' +
              isThisFieldLocked +
              '">' +
              escapeHtml(headerName) +
              '</span></div><div class="acu-card-value ' +
              cellHighlight +
              '">' +
              contentHtml +
              '</div></div>'
            );
          })
          .join('');

        // [修改] 给 acu-card-body 增加了 view-grid 或 view-list 类
        // [修复] 传入完整的 tableData.headers 而非 slice 后的 headers，避免 getInteractOptionsForRow 内部索引错位
        const tableActions = getInteractOptionsForRow(tableName, tableData.headers, row);
        let actionsHtml = '';

        if (tableActions.length > 0) {
          const cardTitle = row[titleColIndex] || '未知';
          const actionBtns = tableActions
            .map(
              (act, actIdx) =>
                `<button type="button" class="acu-action-item ${act.type === 'check' ? 'check-type' : ''}" data-action-idx="${actIdx}" data-row="${realRowIdx}" title="${escapeHtml(act.label)}"><i class="fa-solid ${act.icon || 'fa-play'}"></i> ${escapeHtml(act.label)}</button>`,
            )
            .join('');
          actionsHtml = `<div class="acu-card-actions">${actionBtns}</div>`;
        }

        // [修改] 标题小锁图标：整行锁定或标题列单独锁定时都显示
        const isTitleLocked = isCardRowLocked || isTitleCellLocked;

        // [移除] 不再需要单独的整行锁定样式类，因为每个单元格都会显示锁图标
        // const cardLockedClass = isCardRowLocked ? ' acu-card-locked' : '';

        // 检查是否被bookmark
        const cardBookmarkRowKey = getRowKey(tableName, row, tableData.headers);
        const isBookmarked = cardBookmarkRowKey && BookmarkManager.isBookmarked(tableName, cardBookmarkRowKey);
        const bookmarkIcon = cardBookmarkRowKey
          ? `<i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark acu-bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" data-table="${escapeHtml(tableName)}" data-row-key="${escapeHtml(cardBookmarkRowKey)}" title="${isBookmarked ? '取消书签' : '添加书签'}"></i>`
          : '';

        // [移除] 不再需要右上角的整行锁定图标，因为每个单元格都会显示锁图标
        // const rowLockBadge = isCardRowLocked ? '...' : '';

        return `<div class="acu-data-card"><div class="acu-card-header"><span class="acu-card-index">${showDefaultIndex ? '#' + (realRowIdx + 1) : ''}</span><span class="acu-cell acu-editable-title ${rowClass}" data-key="${escapeHtml(tableData.key)}" data-tname="${escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${titleColIndex}" data-val="${safeEncodeURIComponent(cardTitle ?? '')}" data-locked="${isTitleLocked}" title="点击编辑标题">${escapeHtml(cardTitleDisplay)}</span>${bookmarkIcon}</div><div class="acu-card-body ${isGridMode ? 'view-grid' : 'view-list'}">${cardBody}</div>${actionsHtml}</div>`;
      })
      .join('');
    html += `</div></div>`;

    if (totalPages > 1) {
      html += `<div class="acu-panel-footer"><button class="acu-page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
      const range = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
      } else {
        if (currentPage <= 4) range.push(1, 2, 3, 4, 5, '...', totalPages);
        else if (currentPage >= totalPages - 3)
          range.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        else range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
      range.forEach(p => {
        if (p === '...') html += `<span class="acu-page-info">...</span>`;
        else html += `<button class="acu-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
      });
      html += `<button class="acu-page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button></div>`;
    }
    return html;
  };

  // [新增] 通用状态保存函数 (面板滚动 + 卡片内部滚动)
  const saveCurrentTabState = () => {
    const { $ } = getCore();
    const activeTab = getActiveTabState();
    const $content = $('.acu-panel-content');

    if (activeTab && $content.length) {
      const innerScrolls = {};
      // 遍历所有卡片，记录内部滚动条位置
      $content.find('.acu-data-card, .acu-card-body, .acu-edit-textarea').each(function () {
        if (this.scrollTop > 0) {
          // 尝试找到这张卡片的唯一标识 (Row Index)
          const $card = $(this).closest('.acu-data-card');
          const rIdx = $card.find('.acu-editable-title').data('row');
          // 如果是编辑框，还要加特殊标记
          const isEdit = $(this).hasClass('acu-edit-textarea');

          if (rIdx !== undefined) {
            const key = isEdit ? `edit-${rIdx}` : rIdx;
            innerScrolls[key] = this.scrollTop;
          }
        }
      });

      // 存入全局状态对象
      getTableScrollStates()[activeTab] = {
        left: $content.scrollLeft(),
        top: $content.scrollTop(),
        inner: innerScrolls,
        timestamp: Date.now(), // 加个时间戳方便调试
      };
    }
  };

  const getDataAreaForRoot = ($root?: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    const { $ } = getCore();

    if ($root && $root.length) {
      const $rootPanel = $root.find<HTMLElement>('#acu-data-area').first();
      if ($rootPanel.length) return $rootPanel;
    }

    const $latestRoot = $(DICE_ROOT_SELECTOR).last();
    const $latestPanel = $latestRoot.find<HTMLElement>('#acu-data-area').first();
    if ($latestPanel.length) return $latestPanel;

    return $('#acu-data-area').first();
  };

  const getLatestAssistantMessageElement = (): JQuery<HTMLElement> => {
    const { $ } = getCore();
    return $('#chat .mes')
      .filter(function () {
        const $message = $(this);
        if ($message.attr('is_user') === 'true' || $message.attr('is_system') === 'true') return false;
        if ($message.hasClass('sys_mes') || $message.attr('data-is-system') === 'true') return false;
        if ($message.find('.name_text').text().trim() === 'System') return false;
        if ($message.find('.mes_text').length === 0) return false;
        if ($message.css('display') === 'none') return false;
        return true;
      })
      .last() as JQuery<HTMLElement>;
  };

  const getPanelHostMessage = ($root?: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    const { $ } = getCore();
    const $currentRoot = $root && $root.length ? $root : $(DICE_ROOT_SELECTOR).last();
    const $rootHost = $currentRoot.closest<HTMLElement>('.mes').first();
    if ($rootHost.length) return $rootHost;

    const $panelHost = getDataAreaForRoot($currentRoot).closest<HTMLElement>('.mes').first();
    if ($panelHost.length) return $panelHost;

    return getLatestAssistantMessageElement();
  };

  const syncHostRegenerateButtonVisibility = ($root?: JQuery<HTMLElement>): void => {
    const { $ } = getCore();
    const $currentRoot = $root && $root.length ? $root : $(DICE_ROOT_SELECTOR).last();
    const $panel = getDataAreaForRoot($currentRoot);
    const shouldHideRegenerate = Boolean($currentRoot.length && $panel.length && $panel.hasClass('visible'));
    const $hostMessage = shouldHideRegenerate ? getPanelHostMessage($currentRoot) : $();
    const $markedMessages = $(`#chat .mes.${HOST_REGENERATE_HIDDEN_CLASS}`);

    if ($hostMessage.length) {
      $markedMessages.not($hostMessage).removeClass(HOST_REGENERATE_HIDDEN_CLASS);
    } else {
      $markedMessages.removeClass(HOST_REGENERATE_HIDDEN_CLASS);
    }

    if (
      !shouldHideRegenerate ||
      !$hostMessage.length ||
      !$hostMessage.find(HOST_REGENERATE_BUTTON_SELECTOR).length
    ) {
      return;
    }

    $hostMessage.addClass(HOST_REGENERATE_HIDDEN_CLASS);
  };

  function ensurePanelNavigationVisible(_$root?: JQuery<HTMLElement>): void {
    const config = getConfig();
    if (isFloatingCollapseActive(config)) return;

    if (config.positionMode === 'viewport') {
      scheduleViewportBoundsRefresh();
      return;
    }
    if (config.positionMode === 'fixed') {
      // fixed 模式的根在聊天底部；后台重绘不能主动滚动宿主阅读位置。
      scheduleFixedWrapperBoundsRefresh();
      return;
    }
  }

  const closePanel = ($root?: JQuery<HTMLElement>) => {
    const { $ } = getCore();
    const $panel = getDataAreaForRoot($root);
    saveCurrentTabState(); // <--- 调用通用保存
    cleanupGlobalInteractionFloatingMenus();

    $panel.removeClass('visible');
    ($root && $root.length ? $root.find('.acu-nav-btn') : $('.acu-nav-btn')).removeClass('active');
    Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
    Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    Store.set('acu_changes_panel_active', false);
    Store.set('acu_favorites_panel_active', false);
    saveActiveTabState(null);
    syncHostRegenerateButtonVisibility($root);
    // [修复] 关闭表格面板时，不要移除气泡里的选项面板
    // $('.acu-embedded-options-container').remove();
  };

  const resolveExistingTableName = (tableNameValue: unknown): string | null => {
    const tableName = String(tableNameValue ?? '');
    if (tableName.length === 0) return null;

    const rawData = getCachedRawData() || getTableData();
    const tables = processJsonData(rawData || {});
    return Object.prototype.hasOwnProperty.call(tables, tableName) ? tableName : null;
  };

  const warnMissingTableTarget = (tableNameValue: unknown) => {
    const tableName = String(tableNameValue ?? '');
    warnTableTemplateIssue(tableName ? `未找到表格「${tableName}」` : '无法定位目标表格');
  };

  const setActiveTableNavButton = (tableName: string) => {
    const { $ } = getCore();
    $('.acu-nav-btn').removeClass('active');
    $('.acu-nav-btn[data-table]')
      .filter(function (this: HTMLElement) {
        return String($(this).data('table') ?? '') === tableName;
      })
      .addClass('active');
  };

  /**
   * 面板切换工具函数 - 快速更新面板内容（无过渡延迟）
   * 由于CSS已改为 opacity + visibility 过渡，即使快速更新也不会闪烁
   * @param {Function} updateContentFn - 更新面板内容的函数，接收 $panel 参数
   */
  const switchPanel = (
    updateContentFn: ($panel: JQuery<HTMLElement>) => void | Promise<void>,
    $root?: JQuery<HTMLElement>,
    panelHeightKey?: string | null,
  ) => {
    const $panel = getDataAreaForRoot($root);
    const refreshPanelHeight = () => {
      applyStoredPanelHeight($panel, panelHeightKey || null);
    };
    const showPanel = () => {
      refreshPanelHeight();
      if (!$panel.hasClass('visible')) $panel.addClass('visible');
      syncHostRegenerateButtonVisibility($root);
      requestAnimationFrame(() => {
        refreshPanelHeight();
        ensurePanelNavigationVisible($root);
        syncHostRegenerateButtonVisibility($root);
      });
      window.setTimeout(() => {
        refreshPanelHeight();
      }, 120);
    };
    const showPanelError = (error: unknown) => {
      console.error('[DICE]ACU 面板切换失败:', error);
      $panel.html('<div class="acu-panel-content"><div class="acu-empty-hint">面板打开失败，请查看控制台</div></div>');
      if (window.toastr) showActionableErrorToast('面板打开失败，请查看控制台', { developerHint: true });
      showPanel();
    };

    try {
      refreshPanelHeight();
      const updateResult = updateContentFn($panel);
      if (updateResult instanceof Promise) {
        void updateResult.then(showPanel).catch(showPanelError);
        return;
      }
      showPanel();
    } catch (error) {
      showPanelError(error);
    }
  };

  const bindFloatingCollapseDrag = ($trigger: JQuery<HTMLElement>): void => {
    if (!$trigger.length || !$trigger.hasClass('acu-col-floating')) return;
    const { $ } = getCore();

    $trigger.off('keydown.acu_floating_collapse').on('keydown.acu_floating_collapse', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      $(this).trigger('click');
    });

    $trigger.off('pointerdown.acu_floating_collapse').on('pointerdown.acu_floating_collapse', function (e) {
      const pointerEvent = e.originalEvent as PointerEvent | undefined;
      if (!pointerEvent || typeof pointerEvent.clientX !== 'number' || typeof pointerEvent.clientY !== 'number') return;
      if (pointerEvent.pointerType === 'mouse' && pointerEvent.button !== 0) return;

      const triggerElement = this;
      const wrapper = triggerElement.closest<HTMLElement>(DICE_ROOT_SELECTOR);
      if (!wrapper) return;

      const targetWindow = getTavernHostWindow();
      const targetDocument = wrapper.ownerDocument || getTavernHostDocument();
      const wrapperRect = wrapper.getBoundingClientRect();
      const startPosition = clampFloatingCollapsePosition(
        {
          left: wrapperRect.left,
          top: wrapperRect.top,
        },
        targetWindow,
        targetDocument,
      );
      const startClientX = pointerEvent.clientX;
      const startClientY = pointerEvent.clientY;
      let latestPosition = startPosition;
      let didDrag = false;

      e.preventDefault();
      e.stopPropagation();
      triggerElement.classList.add('acu-floating-dragging');
      triggerElement.setPointerCapture?.(pointerEvent.pointerId);

      const moveFloatingButton = (moveEvent: PointerEvent): void => {
        const deltaX = moveEvent.clientX - startClientX;
        const deltaY = moveEvent.clientY - startClientY;
        if (!didDrag && Math.hypot(deltaX, deltaY) >= FLOATING_COLLAPSE_DRAG_THRESHOLD) {
          didDrag = true;
        }
        latestPosition = clampFloatingCollapsePosition(
          {
            left: startPosition.left + deltaX,
            top: startPosition.top + deltaY,
          },
          targetWindow,
          targetDocument,
        );
        wrapper.style.setProperty('left', `${latestPosition.left}px`, 'important');
        wrapper.style.setProperty('top', `${latestPosition.top}px`, 'important');
      };

      const finishFloatingDrag = (upEvent: PointerEvent): void => {
        triggerElement.onpointermove = null;
        triggerElement.onpointerup = null;
        triggerElement.onpointercancel = null;
        triggerElement.classList.remove('acu-floating-dragging');
        triggerElement.releasePointerCapture?.(upEvent.pointerId);

        if (!didDrag) return;

        suppressNextFloatingCollapseClick = true;
        window.setTimeout(() => {
          suppressNextFloatingCollapseClick = false;
        }, 250);
        saveConfig({ floatingCollapsePosition: latestPosition });
      };

      triggerElement.onpointermove = moveFloatingButton;
      triggerElement.onpointerup = finishFloatingDrag;
      triggerElement.onpointercancel = finishFloatingDrag;
    });
  };

  const bindEvents = tables => {
    const { $ } = getCore();
    const $wrapper = $(DICE_ROOT_SELECTOR);
    if (!getTutorialButtonEventsBound()) {
      $('body').on('click.acu_panel_tutorial', '.acu-panel-tutorial-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        startTutorialFromButton(this);
      });
      setTutorialButtonEventsBound(true);
    }

    $wrapper
      .off('click.acu_dashboard_preset_settings')
      .on('click.acu_dashboard_preset_settings', '.acu-dashboard-preset-settings-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        showDashboardPresetManager();
      });

    // [新增] 仪表盘-人物关系图按钮
    $wrapper
      .off('click.acu_dash_relation_graph', '.acu-dash-relation-graph-btn')
      .on('click.acu_dash_relation_graph', '.acu-dash-relation-graph-btn', function (e) {
        e.stopPropagation();
        const allTables = processJsonData(getCachedRawData() || getTableData()) as Record<string, RelationGraphTableInput>;
        const graphSources = getActiveDashboardRelationshipGraphSources();
        if (graphSources.length > 0) {
          const graphTable = buildRelationshipGraphTableFromPreset(allTables, graphSources);
          if (graphTable) {
            showRelationshipGraph(graphTable, { includePlayerRelations: false });
          } else if (window.toastr) {
            window.toastr.warning('自定义人物关系图未解析到关系数据');
          }
          return;
        }
        const npcResult = DashboardDataParser.findTable(allTables, 'npc');
        if (npcResult && npcResult.data) {
          showRelationshipGraph(npcResult.data);
        } else {
          if (window.toastr) window.toastr.warning('未找到人物数据');
        }
      });

    // [新增] 仪表盘-地图可视化按钮
    $wrapper.on('click', '.acu-dash-map-btn', function (e) {
      e.stopPropagation();
      showMapVisualization();
    });

    // 仪表盘-物品栏可视化按钮
    $wrapper.on('click', '.acu-dash-inventory-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      showInventoryVisualization();
    });

    // 仪表盘-骰子商店按钮
    $wrapper.on('click', '.acu-dash-gacha-btn', function (e) {
      e.stopPropagation();
      e.preventDefault();
      void showGachaVisualization();
    });

    // [新增] 仪表盘-头像管理按钮
    $wrapper.on('click', '.acu-dash-avatar-manager-btn', function (e) {
      e.stopPropagation();

      try {
        // 获取表格数据
        let allTables;
        try {
          const rawData = getCachedRawData() || getTableData();
          allTables = processJsonData(rawData);
        } catch (dataError) {
          console.error('获取表格数据失败:', dataError);
          throw new Error('无法读取表格数据');
        }

        if (!allTables || allTables.length === 0) {
          if (window.toastr) window.toastr.warning('仪表盘数据为空，请先添加表格数据');
          return;
        }

        const nodeArr = collectCurrentChatAvatarNodes(allTables as Record<string, RelationGraphTableInput>);

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
          const $panel = getDataAreaForRoot($targetRoot);
          if (!$panel.length || !Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return;

          const rawData = getCachedRawData() || getTableData();
          const tables = processJsonData(rawData || {});
          $panel.html(renderDashboard(tables));
          hydrateCustomTableNameIconsIn($panel as JQuery<HTMLElement>);
          bindEvents(tables);
          loadDashboardNpcAvatars();
          requestAnimationFrame(() => ensurePanelNavigationVisible($targetRoot));
        };

        // 调用头像管理器（捕获其内部可能的错误）
        try {
          showAvatarManager(nodeArr, refreshDashboardFromAvatarManager);
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
      const tableName = resolveExistingTableName(tableNameValue);
      if (!tableName) {
        warnMissingTableTarget(tableNameValue);
        return;
      }

      // 关闭仪表盘，切换到对应表格
      Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
      Store.set('acu_changes_panel_active', false); // 同时关闭审核面板
      // [防闪烁] 先更新导航按钮状态，再延迟渲染
      setActiveTableNavButton(tableName);
      saveActiveTabState(tableName);
      setTimeout(() => renderInterface(), 0);
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
        if (getIsEditingOrder()) return;
        const currentState = getCollapsedState();
        saveCollapsedState(!currentState);
        renderInterface();
      });

    // [新增] 选项面板折叠事件绑定
    $('body')
      .off('click.acu_opt_toggle')
      .on('click.acu_opt_toggle', '.acu-opt-header[data-action="toggle-options"]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const currentState = getOptionsCollapsedState();
        saveOptionsCollapsedState(!currentState);
        renderInterface();
      });

    const $panel = $('.acu-panel-content');
    if ($panel.length) {
      // [优化] 滚动防抖，避免频繁写入硬盘导致卡顿
      let scrollTimer = null;
      $panel.off('scroll.acu_save').on('scroll.acu_save', function () {
        const $this = $(this);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const activeTab = getActiveTabState();
          if (activeTab) {
            if (!getTableScrollStates()[activeTab]) getTableScrollStates()[activeTab] = { top: 0, left: 0, inner: {} };
            getTableScrollStates()[activeTab].top = $this.scrollTop();
            getTableScrollStates()[activeTab].left = $this.scrollLeft();
            // 不再每次滚动都写入，只更新内存，页面卸载时统一保存
          }
        }, 200);
      });
    }

    $('body')
      .off('click.acu_delegate')
      .on('click.acu_delegate', DICE_ROOT_SELECTOR, function (e) {
        if (getIsEditingOrder()) return;
        const $target = $(e.target);

        // [修复] 设置按钮特殊处理 - 无论在哪个位置都优先响应
        const $settingsBtn = $target.closest('#acu-btn-settings');
        if ($settingsBtn.length) {
          e.stopPropagation();
          e.preventDefault();
          showSettingsModal();
          return;
        }

        const $navBtn = $target.closest('.acu-nav-btn');
        if ($navBtn.length) {
          const $currentRoot = $(this as HTMLElement);
          const $rootPanel = getDataAreaForRoot($currentRoot);
          const $rootNavButtons = $currentRoot.find('.acu-nav-btn');

          if ($navBtn.attr('id') === 'acu-btn-dice-nav') {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (getIsEditingOrder()) return false;
            showDicePanel({
              targetValue: null,
              targetName: '',
            });
            return false;
          }

          // [新增] 仪表盘按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-dashboard') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isDashboardActive = Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false);
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isDashboardActive && isPanelVisible) {
              // 仪表盘已打开，关闭面板（直接淡出）
              Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开仪表盘（使用平滑过渡）
              clearAllPanelStates();
              Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, true);
              saveActiveTabState(null);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              switchPanel(
                $panel => {
                  const rawData = getCachedRawData() || getTableData();
                  const tables = processJsonData(rawData || {});
                  $panel.html(renderDashboard(tables));
                  hydrateCustomTableNameIconsIn($panel as JQuery<HTMLElement>);
                  bindEvents(tables);
                  loadDashboardNpcAvatars();
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
              syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开变更面板（使用平滑过渡）
              clearAllPanelStates(); // [修复] 统一清理所有面板状态
              Store.set('acu_changes_panel_active', true);
              saveActiveTabState(null);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              switchPanel(
                $panel => {
                  const rawData = getCachedRawData() || getTableData();
                  $panel.html(renderChangesPanel(rawData));
                  bindChangesEvents();
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
              syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开收藏夹面板
              clearAllPanelStates(); // [修复] 统一清理所有面板状态
              Store.set('acu_favorites_panel_active', true);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              switchPanel(
                async $panel => {
                  $panel.html(await renderFavoritesPanel());
                  bindFavoritesEvents($panel);
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
            const isGlobalInteractionsActive = Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isGlobalInteractionsActive && isPanelVisible) {
              cleanupGlobalInteractionFloatingMenus();
              Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              clearAllPanelStates();
              Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, true);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              switchPanel(
                $panel => {
                  const rawData = getCachedRawData() || getTableData();
                  $panel.html(renderGlobalInteractionsPanel(rawData));
                  hydrateCustomTableNameIconsIn($panel);
                  bindGlobalInteractionEvents($panel);
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
            const isMvuActive = getActiveTabState() === MvuModule.MODULE_ID;
            const isPanelVisible = $rootPanel.hasClass('visible');

            if (isMvuActive && isPanelVisible) {
              // 变量面板已打开，关闭面板（直接淡出）
              saveActiveTabState(null);
              $rootPanel.removeClass('visible');
              $rootNavButtons.removeClass('active');
              syncHostRegenerateButtonVisibility($currentRoot);
            } else {
              // 打开变量面板（使用平滑过渡）
              clearAllPanelStates(); // [修复] 统一清理所有面板状态
              saveActiveTabState(MvuModule.MODULE_ID);
              $rootNavButtons.removeClass('active');
              $navBtn.addClass('active');

              // 使用 switchPanel 实现平滑过渡
              switchPanel(
                $panel => {
                  try {
                    const panelHtml = MvuModule.renderPanel();
                    $panel.html('<div class="acu-mvu-panel">' + panelHtml + '</div>');
                    MvuModule.bindEvents($panel);
                  } catch (error) {
                    console.error('[MVU] Error rendering panel:', error);
                  }

                  // 可选：在后台尝试获取数据（不阻塞界面显示）
                  MvuModule.getDataWithRetry(5, 800)
                    .then(mvuData => {
                      // 如果获取到数据，刷新面板显示
                      if (mvuData && canWriteMvuPanel()) {
                        $panel.html('<div class="acu-mvu-panel">' + MvuModule.renderPanel() + '</div>');
                        MvuModule.bindEvents($panel);
                      }
                    })
                    .catch(err => {
                      console.error('[DICE]MvuModule Error getting data:', err);
                      if (canWriteMvuPanel()) {
                        // 错误时也刷新面板，显示错误状态
                        $panel.html('<div class="acu-mvu-panel">' + MvuModule.renderPanel() + '</div>');
                        MvuModule.bindEvents($panel);
                      }
                    });
                },
                $currentRoot,
                MvuModule.MODULE_ID,
              );
            }
            return false;
          }
          e.stopPropagation();
          const tableNameValue = $navBtn.data('table');
          const tableName = resolveExistingTableName(tableNameValue);
          if (!tableName) {
            warnMissingTableTarget(tableNameValue);
            return false;
          }
          const currentActiveTab = getActiveTabState();
          if (currentActiveTab === tableName && $rootPanel.hasClass('visible')) {
            closePanel($currentRoot);
            return;
          }
          // [修复] 点击普通表格时，清理所有面板状态
          clearAllPanelStates();
          setActiveTableNavButton(tableName);
          if ($('.acu-panel-content').length && currentActiveTab) {
            saveCurrentTabState();
          }
          saveActiveTabState(tableName);
          setTimeout(() => renderInterface(), 0);
          return;
        }
        const $cell = $target.closest('.acu-cell');
        if ($cell.length) {
          e.stopPropagation();
          showCellMenu(e, $cell[0]);
          return;
        }
        const $pageBtn = $target.closest('.acu-page-btn');
        if ($pageBtn.length) {
          e.stopPropagation();
          if ($pageBtn.hasClass('disabled') || $pageBtn.hasClass('active')) return;
          const newPage = parseInt($pageBtn.data('page'));
          const activeTab = getActiveTabState();
          if (activeTab) {
            getTablePageStates()[activeTab] = newPage;
            renderInterface();
            requestAnimationFrame(() => {
              $('.acu-panel-content').scrollTop(0);
            });
          }
          return;
        }
        return;
      });

    const $expandButton = $('#acu-btn-expand') as JQuery<HTMLElement>;
    bindFloatingCollapseDrag($expandButton);
    $expandButton.off('click').on('click', e => {
      e.stopPropagation();
      const $button = $(e.currentTarget);
      if ($button.hasClass('acu-col-floating') && suppressNextFloatingCollapseClick) {
        suppressNextFloatingCollapseClick = false;
        return;
      }
      if (getIsEditingOrder()) return;
      saveCollapsedState(false);
      renderInterface();
    });
    // [回归] 收起按钮逻辑
    $('#acu-btn-collapse')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (getIsEditingOrder()) return;
        saveCollapsedState(true);
        renderInterface();
      });

    // 打开可视化表格编辑器按钮
    $('#acu-btn-open-visualizer')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (getIsEditingOrder()) return;
        void openDatabaseVisualizerInterface();
      });

    // [修改] 将收起按钮改为手动更新按钮
    $('#acu-btn-force-update')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();
        if (getIsEditingOrder()) return;
        const result = await runDatabaseManualUpdate();
        if (result.status === 'updated') return;

        if (result.status === 'failed') {
          console.error('[DICE]ACU 手动更新失败:', result.error);
          showDatabaseManualUpdateFailure(
            '更新失败',
            getDatabaseManualUpdateErrorMessage(result.error, '更新过程中出现错误'),
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
        if (getIsEditingOrder()) return;
        showSettingsModal();
      });
    // [新增] 导航栏掷骰按钮
    $('#acu-btn-dice-nav')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (getIsEditingOrder()) return;
        showDicePanel({
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
        if (getIsEditingOrder()) return;
        void openDatabaseInterface();
      });

    // 重新填表按钮
    $('#acu-btn-refill')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();
        if (getIsEditingOrder()) return;
        const result = await runDatabaseManualUpdate();
        if (result.status === 'updated') return;

        if (result.status === 'failed') {
          console.error('[DICE]ACU 手动填表失败:', result.error);
          showDatabaseManualUpdateFailure(
            '填表失败',
            getDatabaseManualUpdateErrorMessage(result.error, '填表过程中出现错误'),
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
        if (getIsEditingOrder()) return;
        let dataToSave = null;
        if (getHasUnsavedChanges() && getCachedRawData()) {
          dataToSave = getCachedRawData();
        } else {
          dataToSave = getTableData();
        }

        if (dataToSave) {
          // 1. 【核心修改】把中间的 false 改为 true，禁止保存后重绘界面
          await saveDataToDatabase(dataToSave, true, true);

          // 2. 【手动善后】因为不重绘了，我们需要手动把界面上的“未保存”红字变回普通颜色
          // 移除所有手动修改的高亮类
          $('.acu-highlight-manual').removeClass('acu-highlight-manual');

          // 3. 清理内部的脏数据标记
          if (window.acuModifiedSet) window.acuModifiedSet.clear();
          setHasUnsavedChanges(false);

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
      bindCompositionSafeSearchInput(
        { root: $searchInput },
        {
          delay: 300,
          onCommit: ({ value, selectionStart, selectionEnd }) => {
            const activeTab = getActiveTabState();
            if (activeTab) {
              getTableSearchStates()[activeTab] = value;
              getTablePageStates()[activeTab] = 1;
              const isFocus = document.activeElement && document.activeElement.classList.contains('acu-search-input');
              renderInterface();
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
        const rawData = getCachedRawData() || getTableData();
        if (rawData) {
          const allTables = processJsonData(rawData) as Record<string, RelationGraphTableInput>;
          const graphSources = getActiveDashboardRelationshipGraphSources();
          if (graphSources.length > 0) {
            const graphTable = buildRelationshipGraphTableFromPreset(allTables, graphSources, { tableName });
            if (graphTable) {
              showRelationshipGraph(graphTable, { includePlayerRelations: false });
              return;
            }
          }

          const currentTable = allTables[tableName];
          if (currentTable) {
            showRelationshipGraph(currentTable, graphSources.length > 0 ? { includePlayerRelations: false } : {});
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
              showRelationshipGraph(tableData, graphSources.length > 0 ? { includePlayerRelations: false } : {});
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
        showMapVisualization();
      });
    $('.acu-table-inventory-btn')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showInventoryVisualization();
      });
    $('.acu-gacha-open-btn')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        void showGachaVisualization();
      });
    // --- [新增] 移植功能的事件绑定 ---

    // 1. 视图切换
    $('#acu-btn-switch-style')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const styles = getTableStyles();
        const current = styles[tableName] || 'list';
        styles[tableName] = current === 'grid' ? 'list' : 'grid'; // 切换
        saveTableStyles(styles);
        renderInterface(); // 重绘
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
        const $panel = getDataAreaForRoot($currentRoot);
        const startHeight = getPanelDragStartHeight($panel);
        let requestedHeight = startHeight;
        const startY = e.clientY;
        const tableName = $(handle).data('table');

        handle.onpointermove = function (moveE) {
          const dy = moveE.clientY - startY;
          requestedHeight = setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
        };
        handle.onpointerup = function (upE) {
          $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
          handle.releasePointerCapture(upE.pointerId);
          handle.onpointermove = null;
          handle.onpointerup = null;
          if (tableName) {
            savePanelRequestedHeight(tableName, requestedHeight);
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
          resetPanelRequestedHeight(getDataAreaForRoot($currentRoot), tableName);
        }
      });

    // [新增] 倒序按钮点击事件
    $wrapper.on('click', '.acu-reverse-btn', function (e) {
      e.stopPropagation();
      const tName = $(this).data('table');
      if (!tName) return;

      toggleTableReverse(tName);

      // 重新渲染当前表格
      renderInterface();
    });
    // [新增] 双击头部任意位置也可重置高度
    $('.acu-panel-header')
      .off('dblclick.acu')
      .on('dblclick.acu', function (e) {
        if ($(e.target).closest('.acu-search-input, .acu-close-btn, .acu-view-btn').length) return;
        e.preventDefault();
        e.stopPropagation();
        const tableName = getActiveTabState();
        if (tableName) {
          const $currentRoot = $(this).closest<HTMLElement>(DICE_ROOT_SELECTOR);
          resetPanelRequestedHeight(getDataAreaForRoot($currentRoot), tableName);
        }
      });

    $wrapper
      .find('.acu-close-btn')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $currentRoot = $(this).closest<HTMLElement>(DICE_ROOT_SELECTOR);
        const $currentPanel = getDataAreaForRoot($currentRoot);
        const $input = $currentPanel.find('.acu-search-input');

        // 如果搜索框有内容，清空搜索框
        if ($input.length && $input.val()) {
          $input.val('').trigger('input').focus();
          return;
        }

        // 检查是否是仪表盘状态
        const isDashboardActive = Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false);
        if (isDashboardActive) {
          // 仪表盘状态：关闭仪表盘，重新渲染到默认状态
          Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
          saveActiveTabState(null);
          renderInterface();
          return;
        }

        // 检查是否是变量面板状态
        const isMvuActive = getActiveTabState() === MvuModule.MODULE_ID;
        if (isMvuActive) {
          // 变量面板状态：关闭变量面板，重新渲染到默认状态
          saveActiveTabState(null);
          renderInterface();
          return;
        }

        // 普通表格状态：正常关闭面板
        closePanel($currentRoot);
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
        BookmarkManager.toggleBookmark(tableName, rowKey);

        // 重新渲染表格以更新显示
        if (typeof renderInterface === 'function') {
          renderInterface();
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
        const rawData = getCachedRawData() || getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const headers = rawData[tableKey].content[0] || [];
        const rowData = rawData[tableKey].content[rowIdx + 1] || [];

        // [统一] 使用公共函数获取交互选项（默认动作 + AI生成的自定义动作）
        const actions = getInteractOptionsForRow(tableName, headers, rowData);
        const action = actions[actionIdx];
        executeTableInteractionAction(action, headers, rowData);
      });

    // [新增] 全局骰子按钮（面板右上角）
    $('body')
      .off('click.acu_global_dice')
      .on('click.acu_global_dice', '#acu-btn-dice', function (e) {
        e.stopPropagation();
        showDicePanel({
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
        const tableName = resolveExistingTableName(tableNameValue);
        const searchTerm = $(this).data('search') || '';

        if (!tableName) {
          warnMissingTableTarget(tableNameValue);
          return;
        }

        // 1. 关闭仪表盘
        Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);

        // 2. 切换到目标表格
        saveActiveTabState(tableName);
        setActiveTableNavButton(tableName);

        // 3. 如果有搜索词，设置搜索状态
        if (searchTerm) {
          getTableSearchStates()[tableName] = searchTerm;
          getTablePageStates()[tableName] = 1;
        }

        // 4. 重新渲染
        renderInterface();

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

        showDicePanel({
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
          const playerAttrValue = getAttributeValue('<user>', targetName) || 50;
          showContestPanel({
            initiatorName: '<user>',
            initiatorValue: playerAttrValue,
            opponentName: npcName,
            opponentValue: targetValue,
          });
        } else {
          showDicePanel({
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
        smartInsertToTextarea(promptText, 'action');
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
        smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    bindCompositionSafeSearchInput(
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
          saveInventoryFilters({ [filterKey]: value });
          refreshInventoryVisualization({ focusSearch: true, cursor: selectionStart });
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
        saveInventoryFiltersCollapsedState(nextCollapsed);
      });
    $('body')
      .off('click.acu_inventory_filter_btn')
      .on('click.acu_inventory_filter_btn', '.acu-inventory-filter-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const filterKey = String($(this).data('filter') || '');
        const rawValue = String($(this).data('value') || '');
        if (!filterKey || !rawValue) return;
        const filters = getInventoryFilters();
        const nextValue =
          filterKey === 'sort' ? rawValue : filters[filterKey as 'type' | 'quality'] === rawValue ? '全部' : rawValue;
        saveInventoryFilters({ [filterKey]: nextValue });
        refreshInventoryVisualization();
      });
    $('body')
      .off('click.acu_gacha_pool_btn')
      .on('click.acu_gacha_pool_btn', '.acu-gacha-pool-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const nextPoolTag = String($(this).data('pool-tag') || '').trim() as GachaPoolTag;
        if (!getConfiguredGachaPoolDefinitions().some(pool => pool.id === nextPoolTag)) return;
        void updateGachaPoolTag(nextPoolTag);
      });
    $('body')
      .off('click.acu_gacha_draw_btn')
      .on('click.acu_gacha_draw_btn', '.acu-gacha-draw-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const drawCount = Number.parseInt(String($(this).data('draw-count') || '1'), 10);
        void performGachaDraw(drawCount >= 10 ? 10 : 1);
      });
    $('body')
      .off('click.acu_gacha_fortune_clear')
      .on('click.acu_gacha_fortune_clear', '.acu-gacha-fortune-clear', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void clearGachaFortune();
      });
    $('body')
      .off('click.acu_gacha_shard_shop_open')
      .on('click.acu_gacha_shard_shop_open', '.acu-gacha-shard-shop-open', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void showGachaShardShop();
      });
    $('body')
      .off('click.acu_gacha_settings_open')
      .on('click.acu_gacha_settings_open', '.acu-gacha-settings-open', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void showGachaSettingsDialog();
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
        saveStoredGachaShardShopRarity(rarity);
        refreshGachaShardShop();
      });
    $('body')
      .off('click.acu_gacha_shard_pool_tab')
      .on('click.acu_gacha_shard_pool_tab', '.acu-gacha-shard-pool-tab', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const nextPoolTag = String($(this).data('pool-tag') || '').trim() as GachaPoolTag;
        if (!getVisibleGachaPoolConfigDefinitions().some(pool => pool.id === nextPoolTag)) return;
        updateGachaPoolTag(nextPoolTag);
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
        showGachaShardExchangeConfirm(itemId);
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
        showGachaPickupItemDetail(itemId);
      });
    $('body')
      .off('click.acu_gacha_pickup_detail')
      .on('click.acu_gacha_pickup_detail', '.acu-gacha-pickup-detail-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const itemId = String($(this).data('item-id') || '').trim();
        if (!itemId) return;
        showGachaPickupItemDetail(itemId);
      });
    $('body')
      .off('click.acu_gacha_recent_detail')
      .on('click.acu_gacha_recent_detail', '.acu-gacha-recent-detail-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const itemId = String($(this).data('item-id') || '').trim();
        const itemName = String($(this).data('item-name') || '').trim();
        const itemQuality = String($(this).data('item-quality') || '').trim();
        showGachaRecentRewardDetail(itemId, itemName, itemQuality);
      });
    $('body')
      .off('click.acu_gacha_open_btn')
      .on('click.acu_gacha_open_btn', '.acu-gacha-open-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        void showGachaVisualization();
      });
    $('body')
      .off('click.acu_gacha_inventory_open')
      .on('click.acu_gacha_inventory_open', '.acu-gacha-inventory-open', function (e) {
        e.stopPropagation();
        e.preventDefault();
        showInventoryVisualization();
      });
    $('body')
      .off('click.acu_gacha_open_table')
      .on('click.acu_gacha_open_table', '.acu-gacha-open-table', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const tableNameValue = $(this).data('table');
        const tableName = resolveExistingTableName(tableNameValue);
        if (!tableName) {
          warnMissingTableTarget(tableNameValue);
          return;
        }
        closeGachaVisualization();
        Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
        Store.set('acu_changes_panel_active', false);
        saveActiveTabState(tableName);
        setActiveTableNavButton(tableName);
        setTimeout(() => renderInterface(), 0);
      });
    $('body')
      .off('click.acu_gacha_close')
      .on('click.acu_gacha_close', '.acu-gacha-close', function (e) {
        e.stopPropagation();
        e.preventDefault();
        closeGachaVisualization();
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
        handleInventoryAction(rowIndex, action);
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
        showInventoryDetailMenu(e, rowIndex, menuScope, fieldKey || undefined, this as HTMLElement);
      });
    $('body')
      .off('click.acu_inventory_open_table')
      .on('click.acu_inventory_open_table', '.acu-inventory-open-table', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const tableNameValue = $(this).data('table');
        const tableName = resolveExistingTableName(tableNameValue);
        if (!tableName) {
          warnMissingTableTarget(tableNameValue);
          return;
        }
        closeInventoryVisualization();
        Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
        Store.set('acu_changes_panel_active', false);
        saveActiveTabState(tableName);
        setActiveTableNavButton(tableName);
        renderInterface();
      });
    $('body')
      .off('click.acu_inventory_close')
      .on('click.acu_inventory_close', '.acu-inventory-close', function (e) {
        e.stopPropagation();
        e.preventDefault();
        closeInventoryVisualization();
      });
    // [新增] 技能列表"使用"按钮 - 使用技能并进行检定
    $('body')
      .off('click.acu_dash_use_skill')
      .on('click.acu_dash_use_skill', '.acu-dash-use-skill-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const skillName = $(this).data('skill') || '技能';

        // 查找该技能的属性值或熟练度
        const rawData = getCachedRawData() || getTableData();
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
                    const val = extractNumericValue(row[attrValIdx]);
                    if (val > 0) {
                      checkValue = val;
                      break;
                    }
                  }
                  // 回退到熟练度
                  if (profIdx > 0 && row[profIdx]) {
                    const val = extractNumericValue(row[profIdx]);
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
        smartInsertToTextarea(promptText, 'action');

        // 如果有有效数值，打开掷骰面板进行检定
        if (checkValue !== null && checkValue > 0) {
          showDicePanel({
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
        smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    // [新增] 重要人物"发消息"按钮
    $('body')
      .off('click.acu_dash_msg')
      .on('click.acu_dash_msg', '.acu-dash-msg-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const npcName = $(this).data('npc') || '对方';
        const config = getConfig();

        // 移除已有的弹窗
        $('.acu-msg-overlay').remove();

        const overlay = $(`
            <div class="acu-msg-overlay acu-theme-${config.theme}" role="dialog" aria-modal="true" aria-label="发送消息">
                <div class="acu-msg-dialog">
                    <div class="acu-msg-title">
                        <i class="fa-solid fa-comment"></i> 发送消息给 ${escapeHtml(npcName)}
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
            smartInsertToTextarea(promptText, 'action');
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
        setupOverlayClose(overlay, 'acu-msg-overlay', () => overlay.remove());
      });
    // [新增] NPC对抗检定按钮
    $('body')
      .off('click.acu_dash_contest')
      .on('click.acu_dash_contest', '.acu-dash-contest-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const npcName = $(this).data('npc') || '';

        const playerAttr = getFullAttributesForCharacter('<user>')[0];
        const npcAttr = npcName ? getFullAttributesForCharacter(String(npcName))[0] : null;
        const playerAttrValue = playerAttr?.value ?? 50;
        const npcAttrValue = npcAttr?.value ?? 50;

        showContestPanel({
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
        showCellMenu(e, this);

        // 记录当前菜单对应的单元格ID，用于 toggle 判断
        const cellId = `${$this.data('key')}-${$this.data('row')}-${$this.data('col')}`;
        $('.acu-cell-menu').data('cell-id', cellId);
      });

    // [重构] 仪表盘预览功能：复用表格卡片渲染，完整功能
    $('body')
      .off('click.acu_dash_preview')
      .on('click.acu_dash_preview', '.acu-dash-preview-trigger', function (e) {
        e.stopPropagation();

        const tableKey = safeDecodeURIComponent(String($(this).data('table-key') ?? ''));
        const rowIndex = parseInt(safeDecodeURIComponent(String($(this).data('row-index') ?? '')), 10);

        if (!tableKey || isNaN(rowIndex)) return;

        const rawData = getCachedRawData() || getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const table = rawData[tableKey];
        const tableName = table.name || '详情';
        const headers = table.content[0] || [];
        const rowData = table.content[rowIndex + 1];

        if (!rowData) return;

        const config = getConfig();
        const title = rowData[1] || '未命名';
        const titleDisplay = isCharacterTable(tableName) ? getDisplayName(String(title)) : String(title);

        // 复用 renderTableContent 中的卡片渲染逻辑
        const titleColIndex = 1;
        const realRowIdx = rowIndex;

        // [新增] 获取数据库锁定状态API
        const dbLockApi = getDbLockAPI();
        const sheetKey = dbLockApi ? getSheetKeyByTableName(tableName) : null;
        const lockState = dbLockApi && sheetKey ? dbLockApi.getTableLockState(sheetKey) : null;

        // [新增] 计算行锁定状态（在循环外部计算一次）
        const lockRowKey = getRowKey(tableName, rowData, headers);
        const dbRowIndex = sheetKey && lockRowKey ? findRowIndexByPrimaryKey(sheetKey, tableName, lockRowKey) : null;
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

          const renderedCell = renderDataCardCellContent({
            rawHeaderName: headers[cIdx] || '属性' + cIdx,
            cell,
            isFieldLocked: isThisFieldLocked,
            numericDiceMarginLeft: true,
          });
          if (!renderedCell.shouldRender) return;
          const { headerName, contentHtml, hideLabel } = renderedCell;

          const rowClass = 'acu-card-row acu-cell' + (hideLabel ? ' acu-hide-label' : '');
          cardBody += `<div class="${rowClass}" data-key="${escapeHtml(tableKey)}" data-tname="${escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${cIdx}" data-val="${safeEncodeURIComponent(cell ?? '')}">
                <div class="acu-card-label"><span data-locked="${isThisFieldLocked}">${escapeHtml(headerName)}</span></div>
                <div class="acu-card-value">${contentHtml}</div>
            </div>`;
        });

        // [统一] 使用公共函数获取交互选项（默认动作 + AI生成的自定义动作）
        // [修复] 原逻辑直接覆盖默认选项，现改为追加合并
        const tableActions = getInteractOptionsForRow(tableName, headers, rowData);
        let actionsHtml = '';
        if (tableActions.length > 0) {
          const actionBtns = tableActions
            .map(
              (act, actIdx) =>
                `<button class="acu-action-item ${act.type === 'check' ? 'check-type' : ''}" data-action-idx="${actIdx}" data-row="${realRowIdx}"><i class="fa-solid ${act.icon || 'fa-play'}"></i> ${escapeHtml(act.label)}</button>`,
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
                    <span class="acu-cell acu-editable-title" data-key="${escapeHtml(tableKey)}" data-tname="${escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${titleColIndex}" data-val="${safeEncodeURIComponent(title)}" data-locked="${isTitleLocked}">${escapeHtml(titleDisplay)}</span>
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
        setupOverlayClose($previewOverlay, 'acu-preview-overlay', () => $previewOverlay.remove());
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

  let selectedSwapSource = null;
  const toggleOrderEditMode = () => {
    const { $ } = getCore();
    setIsEditingOrder(!getIsEditingOrder());

    const $root = $(DICE_ROOT_SELECTOR).last();
    const $container = $root.find('#acu-nav-bar');
    const $hint = $root.find('#acu-order-hint');
    const $pool = $root.find('#acu-action-pool');

    // 检查必要元素是否存在
    if (!$container.length) {
      console.error('[DICE]ACU 找不到导航栏容器');
      setIsEditingOrder(false);
      return;
    }

    selectedSwapSource = null;
    $root.find('.acu-swap-selected').removeClass('acu-swap-selected');

    if (getIsEditingOrder()) {
      // 进入编辑模式
      $container.addClass('editing-order');
      if ($pool.length) $pool.addClass('visible');

      if ($hint.length) {
        $hint
          .html(
            `
                    <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:8px;">
                        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:200px;">
                            <span><i class="fa-solid fa-layer-group"></i> 布局编辑</span>
                            <span style="font-size:11px; opacity:0.9; font-weight:normal;">拖动或点击交换位置</span>
                        </div>
                        <button id="acu-btn-finish-sort" class="acu-btn-finish-sort">
                            <i class="fa-solid fa-check"></i> 完成保存
                        </button>
                    </div>
                `,
          )
          .addClass('visible')
          .css('display', 'flex');

        $root.find('#acu-btn-finish-sort').hover(
          function () {
            $(this).addClass('hover');
          },
          function () {
            $(this).removeClass('hover');
          },
        );

        $root
          .find('#acu-btn-finish-sort')
          .off('click')
          .on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            toggleOrderEditMode();
          });
      }

      // 关闭数据面板
      $root.find('#acu-data-area').removeClass('visible');
      syncHostRegenerateButtonVisibility($root);

      // 设置可拖拽属性（排除投骰按钮，避免影响快捷投骰入口）
      $container.find('.acu-nav-btn').not('#acu-btn-dice-nav').attr('draggable', 'true');
      $container.find('.acu-action-btn').attr('draggable', 'true');

      // 初始化拖拽
      initSortable($root);
    } else {
      // 退出编辑模式
      $container.removeClass('editing-order');
      if ($hint.length) $hint.removeClass('visible').hide();
      if ($pool.length) $pool.removeClass('visible');

      // 移除拖拽属性和事件
      $container.find('.acu-nav-btn, .acu-action-btn').attr('draggable', 'false');
      $root.find('.acu-nav-btn, .acu-action-btn').off('.sort');
      $root.find('#acu-action-pool, #acu-active-actions').off('.sort');

      // 保存导航盘入口顺序
      const newTableOrder = [];
      $container.find('.acu-nav-btn[data-nav-key], .acu-nav-btn[data-table]').each(function () {
        const navKey = $(this).data('nav-key');
        const tableName = $(this).data('table');
        const orderKey = navKey || tableName;
        if (orderKey) {
          newTableOrder.push(String(orderKey));
        }
      });
      if (newTableOrder.length > 0) {
        saveTableOrder(newTableOrder);
      }

      // 保存功能按钮顺序
      const newActionOrder = [];
      $root.find('#acu-active-actions .acu-action-btn').each(function () {
        const btnId = $(this).attr('id');
        if (btnId) {
          newActionOrder.push(btnId);
        }
      });

      // 保护设置按钮
      if (!newActionOrder.includes('acu-btn-settings')) {
        newActionOrder.push('acu-btn-settings');
      }

      Store.set(STORAGE_KEY_ACTION_ORDER, newActionOrder);

      // 重绘界面
      renderInterface();
    }
  };

  const initSortable = ($root?: JQuery<HTMLElement>) => {
    const { $ } = getCore();
    const $scope = $root && $root.length ? $root : $(DICE_ROOT_SELECTOR).last();
    let $dragSrcEl = null;

    // 清理旧事件
    $scope.find('.acu-nav-btn, .acu-action-btn, #acu-action-pool, #acu-active-actions').off('.sort');

    // --- 1. 按钮本身的拖拽逻辑 (交换顺序) ---
    const $items = $scope.find('.acu-nav-btn, .acu-action-btn');

    $items.on('dragstart.sort', function (e) {
      $dragSrcEl = $(this);
      $(this).css('opacity', '0.4');
      e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $items.on('dragend.sort', function (e) {
      $(this).css('opacity', '1');
      $scope.find('.acu-drag-over').removeClass('acu-drag-over');
      $scope.find('.acu-actions-group, .acu-unused-pool').removeClass('dragging-over');
    });

    $items.on('dragover.sort', function (e) {
      e.preventDefault();
      return false;
    });
    $items.on('dragenter.sort', function () {
      if ($dragSrcEl && this !== $dragSrcEl[0]) $(this).addClass('acu-drag-over');
    });
    $items.on('dragleave.sort', function () {
      $(this).removeClass('acu-drag-over');
    });

    $items.on('drop.sort', function (e) {
      e.stopPropagation();
      $(this).removeClass('acu-drag-over');
      if (!$dragSrcEl || $dragSrcEl[0] === this) return false;

      const isSrcAction = $dragSrcEl.hasClass('acu-action-btn');
      const isTgtAction = $(this).hasClass('acu-action-btn');
      if (isSrcAction !== isTgtAction) return false;

      if (isSrcAction) {
        const targetPoolId = $(this).parent().attr('id');
        const srcPoolId = $dragSrcEl.parent().attr('id');

        if (srcPoolId === 'acu-action-pool' && targetPoolId === 'acu-active-actions') {
          if ($scope.find('#acu-active-actions').children().length >= MAX_ACTION_BUTTONS) {
            if (window.toastr) window.toastr.warning('活动栏最多6个，请先拖走一个');
            return false;
          }
        }

        if (srcPoolId !== targetPoolId) {
          $(this).before($dragSrcEl);
          return false;
        }
      }

      const $temp = $('<span>').hide();
      $dragSrcEl.before($temp);
      $(this).before($dragSrcEl);
      $temp.replaceWith($(this));
      return false;
    });

    // --- 2. 容器的拖拽逻辑 (上架/下架) ---
    const $containers = $scope.find('#acu-action-pool, #acu-active-actions');

    $containers.on('dragover.sort', function (e) {
      e.preventDefault();
      if ($dragSrcEl && $dragSrcEl.hasClass('acu-action-btn')) {
        $(this).addClass('dragging-over');
      }
    });

    $containers.on('dragleave.sort', function (e) {
      $(this).removeClass('dragging-over');
    });

    $containers.on('drop.sort', function (e) {
      e.stopPropagation();
      $(this).removeClass('dragging-over');

      if ($dragSrcEl && $dragSrcEl.hasClass('acu-action-btn')) {
        const currentParentId = $dragSrcEl.parent().attr('id');
        const targetId = $(this).attr('id');
        const btnId = $dragSrcEl.attr('id');

        if (currentParentId !== targetId) {
          if (targetId === 'acu-action-pool') {
            if (btnId === 'acu-btn-settings') {
              if (window.toastr) window.toastr.warning('设置按钮是核心组件，无法移除');
              return false;
            }
            $(this).append($dragSrcEl);
          } else if (targetId === 'acu-active-actions') {
            if ($(this).children().length >= 6) {
              if (window.toastr) window.toastr.warning('活动栏已满6个，无法继续添加');
              return false;
            }
            $(this).append($dragSrcEl);
          }
        }
      }
      return false;
    });

    // --- 【新增】3. 容器点击事件 - 支持点动移动功能按钮 ---
    $containers.on('click.sort', function (e) {
      e.stopPropagation();

      // 如果点击的是按钮本身，不处理
      if ($(e.target).closest('.acu-action-btn, .acu-nav-btn').length > 0) return;

      // 如果没有选中任何按钮，不处理
      if (!selectedSwapSource) return;

      const $src = $(selectedSwapSource);

      // 只有功能按钮才能跨池移动
      if (!$src.hasClass('acu-action-btn')) {
        if (window.toastr) window.toastr.warning('表格标签不能移入功能池');
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
        return;
      }

      const srcPoolId = $src.parent().attr('id');
      const targetId = $(this).attr('id');
      const btnId = $src.attr('id');

      // 同一个容器内点击，取消选中
      if (srcPoolId === targetId) {
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
        return;
      }

      // 活动栏 → 备选池
      if (targetId === 'acu-action-pool') {
        if (btnId === 'acu-btn-settings') {
          if (window.toastr) window.toastr.warning('设置按钮是核心组件，无法移除');
          $src.removeClass('acu-swap-selected');
          selectedSwapSource = null;
          return;
        }
        $(this).append($src);
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
      }
      // 备选池 → 活动栏
      else if (targetId === 'acu-active-actions') {
        if ($scope.find('#acu-active-actions').children().length >= MAX_ACTION_BUTTONS) {
          if (window.toastr) window.toastr.warning('活动栏已满6个，请先移走一个');
          return;
        }
        $(this).append($src);
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
      }
    });

    // --- 4. 点击互换模式 (Click-to-Swap) - 按钮之间 ---
    $items.on('click.sort', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (selectedSwapSource && selectedSwapSource === this) {
        $(this).removeClass('acu-swap-selected');
        selectedSwapSource = null;
        return;
      }

      if (!selectedSwapSource) {
        selectedSwapSource = this;
        $(this).addClass('acu-swap-selected');
        return;
      }

      const $src = $(selectedSwapSource);
      const $tgt = $(this);

      const isSrcAction = $src.hasClass('acu-action-btn');
      const isTgtAction = $tgt.hasClass('acu-action-btn');
      if (isSrcAction !== isTgtAction) {
        if (window.toastr) window.toastr.warning('无法在表格标签和功能按钮之间交换');
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = this;
        $(this).addClass('acu-swap-selected');
        return;
      }

      const srcPoolId = $src.parent().attr('id');
      const tgtPoolId = $tgt.parent().attr('id');

      if (isSrcAction && srcPoolId === 'acu-action-pool' && tgtPoolId === 'acu-active-actions') {
        if ($scope.find('#acu-active-actions').children().length >= MAX_ACTION_BUTTONS) {
          if (window.toastr) window.toastr.warning('活动栏最多6个，请先移走一个');
          return;
        }
      }

      if (srcPoolId !== tgtPoolId) {
        $tgt.before($src);
      } else {
        const $temp = $('<span>').hide();
        $src.before($temp);
        $tgt.before($src);
        $temp.replaceWith($tgt);
      }

      $src.removeClass('acu-swap-selected');
      selectedSwapSource = null;
    });
  };

  const showCellMenu = (e, cell) => {
    const { $ } = getCore();
    $('.acu-cell-menu, .acu-menu-backdrop').remove();
    const backdrop = $('<div class="acu-menu-backdrop"></div>');
    $('body').append(backdrop);

    const $cell = $(cell); // 保存单元格引用用于直接操作 data-locked
    const rowIdx = parseInt($cell.data('row'), 10);
    const colIdx = parseInt($cell.data('col'), 10);
    if (isNaN(rowIdx) || isNaN(colIdx)) {
      console.warn('[DICE]ACU 无效的行/列索引');
      backdrop.remove();
      return;
    }
    const tableKey = $cell.data('key');
    // v19.x 可能没有 tname，尝试获取
    const tableName = $cell.data('tname') || $cell.closest('.acu-data-card').find('.acu-editable-title').text();
    const content = safeDecodeURIComponent($cell.data('val'));
    const config = getConfig();

    // 保存卡片引用用于整行操作
    const $card = $cell.closest('.acu-data-card');

    // 唯一标识 ID
    const cellId = `${tableKey}-${rowIdx}-${colIdx}`;
    if (!window.acuModifiedSet) window.acuModifiedSet = new Set();

    // 状态检查
    const isModified = window.acuModifiedSet.has(cellId);

    // 计算锁定状态
    const headers = getCachedRawData()?.[tableKey]?.content?.[0] || [];
    const rowData = getCachedRawData()?.[tableKey]?.content?.[rowIdx + 1] || [];
    const lockRowKey = getRowKey(tableName, rowData, headers);
    const currentHeader = headers[colIdx] || '';

    let isFieldLocked = false;
    let hasAnyLockInRow = false;
    let rowIndex = -1;
    let sheetKey = '';

    const api = getDbLockAPI();
    if (api && lockRowKey) {
      sheetKey = getSheetKeyByTableName(tableName);
      if (sheetKey) {
        rowIndex = findRowIndexByPrimaryKey(sheetKey, tableName, lockRowKey);
        if (rowIndex !== null && rowIndex !== -1) {
          const lockState = api.getTableLockState(sheetKey);
          if (lockState) {
            // 检查行锁定
            hasAnyLockInRow = lockState.rows?.includes(rowIndex) ?? false;
            // 检查单元格锁定
            // [修复] colIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
            const cellKey = `${rowIndex}:${colIdx - 1}`;
            isFieldLocked = lockState.cells?.includes(cellKey) ?? false;
          }
        } else {
          console.warn('[DICE] 找不到表格的 rowIndex');
          isFieldLocked = false;
          hasAnyLockInRow = false;
        }
      } else {
        console.warn('[DICE] 找不到表格的 sheetKey');
        isFieldLocked = false;
        hasAnyLockInRow = false;
      }
    } else {
      if (!api) console.warn('[DICE] 数据库 API 不可用');
      isFieldLocked = false;
      hasAnyLockInRow = false;
    }

    // 构建锁定菜单项
    let lockMenuHtml = '';
    if (lockRowKey) {
      lockMenuHtml = '<div class="acu-cell-menu-separator"></div>';

      // 单元格锁定选项：当前单元格被锁定时显示"解锁"，否则显示"锁定"
      if (isFieldLocked) {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-unlock-field"><i class="fa-solid fa-unlock"></i> 解锁此单元格</button>';
      } else {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-lock-field"><i class="fa-solid fa-lock"></i> 锁定此单元格</button>';
      }

      // 整行锁定选项：行中有任意锁定时显示"解锁整行"，否则显示"锁定整行"
      if (hasAnyLockInRow) {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-unlock-row"><i class="fa-solid fa-unlock"></i> 解锁整行</button>';
      } else {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-lock-row"><i class="fa-solid fa-lock"></i> 锁定整行</button>';
      }
    }

    const menu = $(`
            <div class="acu-cell-menu acu-theme-${config.theme}">
                <button type="button" class="acu-cell-menu-item" id="act-edit"><i class="fa-solid fa-pen"></i> 编辑内容</button>
                <button type="button" class="acu-cell-menu-item" id="act-edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
                <button type="button" class="acu-cell-menu-item" id="act-insert"><i class="fa-solid fa-plus"></i> 在表尾新增行</button>
                <button type="button" class="acu-cell-menu-item" id="act-copy"><i class="fa-solid fa-copy"></i> 复制内容</button>
                <button type="button" class="acu-cell-menu-item" id="act-favorite"><i class="fa-solid fa-star"></i> 收藏此行</button>
                ${lockMenuHtml}
                ${isModified ? '<button type="button" class="acu-cell-menu-item" id="act-undo"><i class="fa-solid fa-undo"></i> 撤销本次修改</button>' : ''}
                <button type="button" class="acu-cell-menu-item" id="act-delete"><i class="fa-solid fa-trash"></i> 删除整行</button>
                <button type="button" class="acu-cell-menu-item" id="act-close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
            </div>
        `);
    $('body').append(menu);

    // 稳健的坐标计算
    const winWidth = $(window).width();
    const winHeight = $(window).height();
    const mWidth = menu.outerWidth() || 150;
    const mHeight = menu.outerHeight() || 150;
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (!clientX && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
      clientX = e.originalEvent.touches[0].clientX;
      clientY = e.originalEvent.touches[0].clientY;
    } else if (!clientX && e.changedTouches && e.changedTouches.length) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    // 兜底坐标
    if (clientX === undefined) clientX = winWidth / 2;
    if (clientY === undefined) clientY = winHeight / 2;

    let left = clientX + 5;
    let top = clientY + 5;
    if (left + mWidth > winWidth) left = clientX - mWidth - 5;
    if (top + mHeight > winHeight) top = clientY - mHeight - 5;

    // 防止负坐标
    if (left < 5) left = 5;
    if (top < 5) top = 5;

    menu.css({ top: top + 'px', left: left + 'px' });

    const closeAll = () => {
      menu.remove();
      backdrop.remove();
    };
    backdrop.on('click', closeAll);
    menu.find('#act-close').click(closeAll);
    // 锁定字段
    // [修复] colIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
    const dbColIndex = colIdx - 1;
    menu.find('#act-lock-field').click(e => {
      e.stopPropagation();
      if (lockRowKey && currentHeader) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1 && dbColIndex >= 0) {
          api.lockTableCell(sheetKey, rowIndex, dbColIndex, true);
          // [优化] 直接修改 data-locked 属性，无需重新渲染
          // [修复] 同时更新 $cell 自身和内部所有带 data-locked 的元素
          if ($cell.is('[data-locked]')) {
            $cell.attr('data-locked', 'true');
          }
          $cell.find('[data-locked]').attr('data-locked', 'true');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法锁定单元格');
        }
      }
      closeAll();
    });

    // 解锁字段
    menu.find('#act-unlock-field').click(e => {
      e.stopPropagation();
      if (lockRowKey && currentHeader) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1 && dbColIndex >= 0) {
          api.lockTableCell(sheetKey, rowIndex, dbColIndex, false);
          // [优化] 直接修改 data-locked 属性，无需重新渲染
          // [修复] 同时更新 $cell 自身和内部所有带 data-locked 的元素
          if ($cell.is('[data-locked]')) {
            $cell.attr('data-locked', 'false');
          }
          $cell.find('[data-locked]').attr('data-locked', 'false');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法解锁单元格');
        }
      }
      closeAll();
    });

    // 锁定整行
    menu.find('#act-lock-row').click(e => {
      e.stopPropagation();
      if (lockRowKey) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1) {
          api.lockTableRow(sheetKey, rowIndex, true);
          // [优化] 直接修改卡片内所有可锁定元素的 data-locked 属性
          $card.find('[data-locked]').attr('data-locked', 'true');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法锁定整行');
        }
      }
      closeAll();
    });

    // 解锁整行
    menu.find('#act-unlock-row').click(e => {
      e.stopPropagation();
      if (lockRowKey) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1) {
          // [改进] 解锁整行时，同时清除该行的所有单元格锁定
          const currentLockState = api.getTableLockState(sheetKey);
          if (currentLockState && currentLockState.cells) {
            // 找出该行的所有单元格锁定并逐一解锁
            const rowPrefix = `${rowIndex}:`;
            currentLockState.cells.forEach((cellKey: string) => {
              if (cellKey.startsWith(rowPrefix)) {
                const cellColIndex = parseInt(cellKey.split(':')[1], 10);
                if (!isNaN(cellColIndex)) {
                  api.lockTableCell(sheetKey, rowIndex, cellColIndex, false);
                }
              }
            });
          }
          // 解锁整行
          api.lockTableRow(sheetKey, rowIndex, false);
          // [优化] 直接修改卡片内所有可锁定元素的 data-locked 属性
          $card.find('[data-locked]').attr('data-locked', 'false');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法解锁整行');
        }
      }
      closeAll();
    });

    // 复制功能 (v7.9 融合增强版：优先酒馆接口，兼容性最佳)
    menu.find('#act-copy').click(async e => {
      e.stopPropagation();

      // 【第一优先级】尝试使用酒馆 v7.7 的原生接口 (移动端/PWA 完美兼容)
      // 来源: slash_command.txt /clipboard-set
      if (window.TavernHelper && window.TavernHelper.triggerSlash) {
        try {
          // 转义特殊字符防止命令崩溃
          const safeContent = content
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}');
          await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
          closeAll();
          return; // 如果成功，直接结束，不走后面的浏览器逻辑
        } catch (err) {
          console.warn('[DICE]ACU 酒馆接口复制失败，尝试浏览器原生方法', err);
        }
      }

      // 【第二优先级】浏览器原生逻辑 (v7.8 的兜底方案)
      const doCopy = text => {
        // 方案A: 现代 API (仅在 HTTPS 或 localhost 下有效)
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(text)
            .then(() => {})
            .catch(() => {
              fallbackCopy(text);
            });
        } else {
          // 方案B: 传统 execCommand (兼容 HTTP)
          fallbackCopy(text);
        }
      };

      const fallbackCopy = text => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;

          // 移动端防抖动处理
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.setAttribute('readonly', '');

          document.body.appendChild(textArea);

          textArea.select();
          textArea.setSelectionRange(0, 99999); // 针对 iOS Safari

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
          } else {
            throw new Error('execCommand failed');
          }
        } catch (err) {
          console.error('[DICE]ACU 复制失败:', err);
          void showDiceSystemInputDialog({
            title: '手动复制',
            message: '复制失败，请长按下方文本手动复制',
            iconClass: 'fa-copy',
            initialValue: text,
            confirmText: '关闭',
            multiline: true,
            readonly: true,
            hideCancel: true,
          });
        }
      };

      doCopy(content);
      closeAll();
    });

    // 收藏此行功能
    menu.find('#act-favorite').click(async () => {
      try {
        // 获取当前行的完整数据
        const tableData = getCachedRawData()?.[tableKey];
        if (!tableData || !tableData.content) {
          showActionableErrorToast('无法获取表格数据', { suggestion: 'table' });
          closeAll();
          return;
        }

        // 获取表头（去掉首列null）
        const fullHeader = tableData.content[0] || [];
        const header: string[] = fullHeader.slice(1).map((h: any) => String(h || ''));

        // 获取行数据（去掉首列null）
        const fullRowData = tableData.content[rowIdx + 1] || [];
        const rowDataValues: (string | number)[] = fullRowData.slice(1);

        if (header.length === 0 || rowDataValues.length === 0) {
          showActionableErrorToast('行数据为空', { suggestion: 'table' });
          closeAll();
          return;
        }

        // 弹出标签输入框
        const tagInput = await showTagInputModal();
        if (tagInput === null) {
          // 用户取消
          closeAll();
          return;
        }
        const tags: string[] = tagInput
          ? tagInput
              .split(',')
              .map(t => t.trim())
              .filter(t => t.length > 0)
          : [];

        // 添加到收藏夹
        const result = await FavoritesManager.addFavorite(tableKey, tableName, header, rowDataValues, tags);

        if (result) {
          toastr.success('收藏成功');
        } else {
          showActionableErrorToast('收藏失败', { title: '收藏失败', suggestion: 'save' });
        }
      } catch (e) {
        console.error('[DICE]收藏失败:', e);
        showActionableErrorToast('收藏失败: ' + (e instanceof Error ? e.message : String(e)), {
          title: '收藏失败',
          suggestion: 'save',
        });
      }
      closeAll();
    });

    // 撤销功能
    menu.find('#act-undo').click(async () => {
      const snapshot = loadSnapshot();
      let originalValue = null;
      const currentSheet = getDiffSheetByKey(getCachedRawData() || getTableData(), tableKey);
      const snapshotEntry = snapshot ? findDiffSnapshotEntry(snapshot, tableKey, currentSheet) : null;
      const snapshotRow = getDiffDataRow(snapshotEntry?.sheet, rowIdx);
      if (snapshotRow) {
        originalValue = snapshotRow[colIdx];
      }

      if (originalValue !== null) {
        const rawData = getCachedRawData() || getTableData();
        const currentEntry = findRuntimeSheetEntryForMutation(rawData, tableKey);
        const currentRow = getDiffDataRow(currentEntry?.sheet, rowIdx);
        if (!currentRow) {
          if (window.toastr) window.toastr.warning('无法找到当前行，撤销失败');
          closeAll();
          return;
        }
        const nextRow = [...currentRow];
        nextRow[colIdx] = originalValue;
        try {
          await saveRowInstantly(tableKey, rowIdx, nextRow, {
            tableName,
            headers: getSheetHeaders(currentEntry?.sheet),
            currentRow,
            sourceData: rawData,
            sheet: currentEntry?.sheet,
          });
        } catch (e) {
          console.error('[DICE]ACU 撤销保存失败:', e);
          closeAll();
          return;
        }

        const $cell = $(cell);
        $cell.attr('data-val', safeEncodeURIComponent(originalValue));
        $cell.data('val', safeEncodeURIComponent(originalValue));

        // [核心修复1] 正确查找显示目标，防止覆盖 Label
        let $displayTarget = $cell;
        if ($cell.find('.acu-card-value').length > 0) {
          $displayTarget = $cell.find('.acu-card-value');
        } else if ($cell.hasClass('acu-grid-item')) {
          $displayTarget = $cell.find('.acu-grid-value');
        } else if ($cell.hasClass('acu-full-item')) {
          $displayTarget = $cell.find('.acu-full-value');
        }

        const badgeStyle = getBadgeStyle(originalValue);
        if (badgeStyle && !$cell.hasClass('acu-editable-title')) {
          $displayTarget.html(`<span class="acu-badge ${badgeStyle}">${originalValue}</span>`);
        } else {
          $displayTarget.text(originalValue);
        }

        // [修复] 修正类名，确保撤销后高亮立即消失
        $displayTarget.removeClass('acu-highlight-manual acu-highlight-diff');
        if ($cell.hasClass('acu-editable-title')) $cell.removeClass('acu-highlight-manual acu-highlight-diff');

        window.acuModifiedSet.delete(cellId);

        if (window.acuModifiedSet.size === 0) {
          setHasUnsavedChanges(false);
          updateSaveButtonState();
        }
      } else {
        if (window.toastr) window.toastr.warning('无法找到原始数据，撤销失败');
      }
      closeAll();
    });

    // [优化] 删除逻辑 (统一即时删除)
    menu.find('#act-delete').click(async () => {
      // [修复] 在任何DOM操作之前保存滚动位置
      const $panelContent = $('.acu-panel-content');
      const savedScrollTop = $panelContent.length ? $panelContent.scrollTop() : 0;
      const savedScrollLeft = $panelContent.length ? $panelContent.scrollLeft() : 0;

      // 关闭右键菜单
      closeAll();

      // [Bug 1 修复] 只关闭preview card，保留地图overlay
      const $mapOverlay = $('.acu-map-overlay');
      const isFromMap = $mapOverlay.length > 0;

      // 只移除preview card overlay
      $('.acu-preview-overlay').remove();

      // --- 视觉优化：前端直接移除 DOM ---
      if (isFromMap) {
        // 地图中的元素chip有 data-table-key 和 data-row-index 属性
        $mapOverlay.find(`.acu-map-element-chip[data-table-key="${tableKey}"][data-row-index="${rowIdx}"]`).remove();
        $mapOverlay.find(`.acu-map-thumbnail[data-table-key="${tableKey}"][data-row-index="${rowIdx}"]`).remove();
      }

      // 主面板中的卡片动画移除
      const $card = $(cell).closest('.acu-data-card');
      if ($card.length && !isFromMap) {
        $card.css('transition', 'all 0.2s ease').css('opacity', '0').css('transform', 'scale(0.9)');
        setTimeout(() => $card.slideUp(200, () => $card.remove()), 200);
      }

      // --- 数据操作 ---
      try {
        await deleteRowInstantly(tableKey, rowIdx);
        const latestRawData = getCachedRawData() || getTableData();

        // [Bug 3 修复] 立即同步更新diffMap，避免闪烁
        setCurrentDiffMap(generateDiffMap(latestRawData));

        // 刷新界面
        renderInterface();

        // [修复] 如果地图overlay存在，刷新地图数据（重建viewModel）
        if (isFromMap) {
          const refreshMapData = $mapOverlay.data('refreshMapData');
          if (typeof refreshMapData === 'function') {
            await refreshMapData();
          }
        }

        // [修复] 恢复滚动位置（在renderInterface防抖完成后）
        setTimeout(() => {
          const $newContent = $('.acu-panel-content');
          if ($newContent.length && (savedScrollTop > 0 || savedScrollLeft > 0)) {
            $newContent.scrollTop(savedScrollTop);
            $newContent.scrollLeft(savedScrollLeft);
          }
        }, 60);
      } catch (e) {
        console.error('[DICE]ACU 删除保存失败:', e);
        showActionableErrorToast('删除保存失败: ' + (e instanceof Error ? e.message : String(e)), {
          title: '删除保存失败',
          developerHint: true,
        });
        renderInterface();

        // [修复] 即使失败也恢复滚动位置
        setTimeout(() => {
          const $newContent = $('.acu-panel-content');
          if ($newContent.length && (savedScrollTop > 0 || savedScrollLeft > 0)) {
            $newContent.scrollTop(savedScrollTop);
            $newContent.scrollLeft(savedScrollLeft);
          }
        }, 60);
      }
    });

    // [新增] 新增行功能：新版数据库 CRUD 仅支持追加到表尾
    menu.find('#act-insert').click(async () => {
      closeAll();
      // 1. 获取最新数据 (优先用缓存，没有则重新获取)
      const sourceData = getTableData({ silent: true }) || getCachedRawData() || loadSnapshot();
      const entry = findRuntimeSheetEntryForMutation(sourceData, tableKey);

      if (entry?.sheet?.content) {
        const sheet = entry.sheet;
        // 2. 构造空行 (长度等于表头)
        const colCount = sheet.content[0] ? sheet.content[0].length : 2;
        const newRow = new Array(colCount).fill('');
        // 智能填充序号 (简单的自增逻辑)
        if (colCount > 0) newRow[0] = String(sheet.content.length);

        await appendRowInstantly(entry.key || tableKey, newRow);

        // 【核心修复】保存后立即重绘界面，否则新行不会显示！
        renderInterface();

        // 额外优化：如果是竖向模式，尝试滚动一下以确保新行可见
        setTimeout(() => {
          const $panel = $('.acu-panel-content');
          // 只有当不在底部时才微调，防止乱跳
          if ($panel.length && $panel[0].scrollHeight > $panel.height()) {
            $panel.scrollTop($panel.scrollTop() + 10);
          }
        }, 100);
      }
    });

    // [新增] 整体编辑事件
    menu.find('#act-edit-card').click(() => {
      closeAll();
      const rawData = getCachedRawData() || getTableData();
      if (rawData && rawData[tableKey]) {
        const headers = rawData[tableKey].content[0];
        const row = rawData[tableKey].content[rowIdx + 1];
        if (row) {
          showCardEditModal(row, headers, tableName, rowIdx, tableKey);
        }
      }
    });

    menu.find('#act-edit').click(() => {
      closeAll();
      showEditDialog(content, async newVal => {
        const rawData = getCachedRawData() || getTableData() || loadSnapshot();
        const entry = findRuntimeSheetEntryForMutation(rawData, tableKey);
        const currentRow = getDiffDataRow(entry?.sheet, rowIdx);

        if (!currentRow) {
          void showDiceSystemConfirmDialog({
            title: '无法写入缓存',
            message: '数据结构异常，无法写入缓存，请刷新页面',
            iconClass: 'fa-triangle-exclamation',
            confirmText: '知道了',
            tone: 'danger',
            hideCancel: true,
          });
          return;
        }

        const nextRow = [...currentRow];
        nextRow[colIdx] = newVal;

        // 使用 saveRowInstantly 执行即时保存 + 单行快照更新
        try {
          await saveRowInstantly(tableKey, rowIdx, nextRow, {
            tableName,
            headers: getSheetHeaders(entry?.sheet),
            currentRow,
            sourceData: rawData,
            sheet: entry?.sheet,
          });
        } catch (e) {
          console.error('[DICE]ACU 单元格保存失败:', e);
          showActionableErrorToast('保存失败: ' + (e instanceof Error ? e.message : String(e)), {
            title: '单元格保存失败',
            developerHint: true,
          });
          return;
        }

        // 2. 准备 UI 元素
        const $cell = $(cell);
        $cell.attr('data-val', safeEncodeURIComponent(newVal)).data('val', safeEncodeURIComponent(newVal));

        let $displayTarget = $cell;
        if ($cell.find('.acu-card-value').length) $displayTarget = $cell.find('.acu-card-value');
        else if ($cell.hasClass('acu-grid-item')) $displayTarget = $cell.find('.acu-grid-value');
        else if ($cell.hasClass('acu-editable-title')) $displayTarget = $cell;

        // 3. 更新 UI 文字/样式 (通用)
        const badgeStyle = getBadgeStyle(newVal);
        if (badgeStyle && !$cell.hasClass('acu-editable-title')) {
          $displayTarget.html(`<span class="acu-badge ${badgeStyle}">${escapeHtml(newVal)}</span>`);
        } else {
          $displayTarget.text(newVal);
        }

        // 4. 统一使用即时保存 + 单行快照更新（保留其他行的AI变更高亮）
        // 移除高亮 (因为马上就保存了)
        $displayTarget.removeClass('acu-highlight-manual acu-highlight-diff');
        if ($cell.hasClass('acu-editable-title')) $cell.removeClass('acu-highlight-manual acu-highlight-diff');

        setCurrentDiffMap(generateDiffMap(getCachedRawData() || getTableData()));
      });
    });
  };

  const showEditDialog = (content, onSave, options?: { overlayClass?: string; title?: string }) => {
    const { $ } = getCore();
    const config = getConfig();

    const dialog = $(`
            <div class="acu-edit-overlay ${options?.overlayClass || ''}">
                <!-- 2. [修改] 在这里加上 acu-theme-${config.theme} -->
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">${escapeHtml(options?.title || '编辑单元格内容')}</div>
                    <textarea class="acu-edit-textarea" spellcheck="false">${escapeHtml(content)}</textarea>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    const adjustHeight = el => {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 2 + 'px';
    };
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    dialog.find('#dlg-cancel').click(() => dialog.remove());
    // 点击遮罩层也可以关闭
    setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());

    dialog.find('#dlg-save').click(() => {
      onSave(dialog.find('textarea').val());
      dialog.remove();
    });
  };
export {
  DEFAULT_GACHA_SETTINGS_ITEM_FILTERS,
  EQUIPMENT_TABLE_TYPE_VALUES,
  FIXED_MODE_ANCHOR_PRIORITY,
  FLOATING_COLLAPSE_DRAG_THRESHOLD,
  FLOATING_COLLAPSE_MARGIN,
  FLOATING_COLLAPSE_SIZE,
  GACHA_ALL_POOL_TAG,
  GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS,
  GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH,
  GACHA_CUSTOM_FIELD_MAX_COUNT,
  GACHA_CUSTOM_FIELD_RESERVED_KEYS,
  GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH,
  GACHA_CUSTOM_ONLY_POOL_TAG,
  GACHA_DUPLICATE_REROLL_LIMIT,
  GACHA_EFFECT_FIELD_ALIASES,
  GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS,
  GACHA_PICKUP_CHAT_DEPTH_BUCKET,
  GACHA_PICKUP_FALLBACK_LIMIT,
  GACHA_PICKUP_RARITIES,
  GACHA_PICKUP_WEIGHT_MULTIPLIER,
  GACHA_REWARD_FIELD_LIMITS,
  GACHA_SETTINGS_SORT_OPTIONS,
  GACHA_SETTINGS_SOURCE_FILTER_OPTIONS,
  GACHA_SETTINGS_STATUS_FILTER_OPTIONS,
  GACHA_TAG_FIELD_ALIASES,
  GACHA_TARGET_COLUMN_KEYS,
  GACHA_TARGET_COLUMN_LABELS,
  GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH,
  GACHA_TARGET_TABLE_MAX_LENGTH,
  GachaCatalogDB,
  INVENTORY_QUALITY_FILTER_META,
  INVENTORY_QUALITY_OPTIONS,
  INVENTORY_QUALITY_ORDER,
  INVENTORY_SORT_OPTIONS,
  INVENTORY_TYPE_FILTER_META,
  INVENTORY_TYPE_OPTIONS,
  LATEST_TABLE_TEMPLATE_URL,
  TABLET_FIXED_NAV_FULL_WIDTH_MAX,
  TEMPLATE_TABLE_REQUIREMENTS,
  VIEWPORT_BOTTOM_ANCHOR_SELECTORS,
  VIEWPORT_BOTTOM_REFRESH_EVENTS,
  VIEWPORT_COMPOSER_ELEMENT_IDS,
  _renderInterfaceImpl,
  addGachaShards,
  analyzeGachaCatalogImport,
  applyGachaCatalogImport,
  applyGachaCustomFieldsToRow,
  applyGachaPityAfterDraw,
  applyGachaTargetColumnOverrides,
  assertGachaRewardNameColumn,
  assertSaveStoredGachaStateSnapshot,
  bindChangesEvents,
  bindCompositionSafeSearchInput,
  bindEvents,
  bindFavoritesEvents,
  bindFloatingCollapseDrag,
  bindGachaShardShopInteractions,
  bindGlobalInteractionEvents,
  bindOptionEvents,
  buildDefaultGachaPoolDefinition,
  buildGachaCatalogTemplateJsonc,
  buildGachaCustomFieldHeaderMap,
  buildGachaDiceEventSettlementKey,
  buildGachaExportNamePart,
  buildGachaInventoryMetaRecord,
  buildGachaSettlementKey,
  buildGachaTableResultFromSheet,
  buildStableGachaCustomItemId,
  canDeleteGachaPoolDefinition,
  clampFloatingCollapsePosition,
  clearFixedAnchorMutationObserver,
  clearFixedAnchorResizeObserver,
  clearFixedWrapperBoundsListeners,
  clearFloatingCollapseBoundsListeners,
  clearGachaFortune,
  clearGlobalGachaCatalog,
  clearViewportBoundsListeners,
  clearViewportInputMutationObserver,
  clearViewportInputTargetListeners,
  cloneGachaCatalogItems,
  cloneGachaPoolDefinitions,
  cloneGachaState,
  closeGachaVisualization,
  closeInventoryVisualization,
  closePanel,
  collectGachaLocalStorageSnapshot,
  collectGachaPoolTagsFromItems,
  compareGachaItemDefinitionsForDisplay,
  createDefaultGachaState,
  createEmptyGachaCatalog,
  createEmptyShardWallet,
  createUniqueGachaItemId,
  deleteGachaItemSetting,
  deleteGachaPoolConfig,
  dismantleInventoryItem,
  downloadGachaCatalogJson,
  drawSingleGachaOutcome,
  ensureGachaCatalogLoaded,
  ensureGachaHeartbeat,
  ensureGachaPoolsForTags,
  ensurePanelNavigationVisible,
  exchangeGachaShardItem,
  exportGachaCatalogJson,
  findGachaColumnByKeywords,
  findGachaDefinitionByInventoryItem,
  findGachaDefinitionByItemId,
  findGachaDefinitionByNameQuality,
  findGachaTargetColumnIndex,
  findInventoryItemByRow,
  findTemplateRequirementSheet,
  fixedAnchorMutationDocument,
  fixedAnchorMutationObserver,
  fixedAnchorMutationWindow,
  fixedAnchorResizeObserver,
  fixedAnchorTargetsRaf,
  fixedWrapperBoundsListenerWindow,
  fixedWrapperBoundsRaf,
  fixedWrapperBoundsRefreshHandler,
  floatingCollapseBoundsListenerWindow,
  floatingCollapseBoundsRaf,
  floatingCollapseBoundsRefreshHandler,
  flushGachaHeartbeatProgress,
  formatGachaCatalogImportErrors,
  formatGachaCatalogImportStatsText,
  formatGachaDuration,
  formatGachaItemCardMeta,
  formatGachaItemCreatedAt,
  formatGachaPoolTags,
  formatGachaRecentRewardText,
  formatGachaRelativeTime,
  formatGachaRewardDestinationLabel,
  gachaCatalogCache,
  gachaCatalogLoadTask,
  gachaPickupItemsCache,
  gachaPickupRotationKeyCache,
  gachaPoolDefinitionsCache,
  getActiveGachaPoolTags,
  getAllGachaItemDefinitions,
  getAllGachaPoolConfigDefinitions,
  getAvailableGachaRewardTargets,
  getConfiguredGachaPoolDefinitions,
  getCustomGachaItemDefinitions,
  getDataAreaForRoot,
  getEquipmentColumnMap,
  getEquipmentResult,
  getFixedModeAnchorRect,
  getFixedWrapperParentMetrics,
  getFloatingCollapsePosition,
  getFloatingViewportBounds,
  getGachaActivePoolTag,
  getGachaAllExpandablePoolTags,
  getGachaCatalogImportFailureMessage,
  getGachaCatalogItemMergeTimestamp,
  getGachaCatalogItemsForExport,
  getGachaCatalogRecordMergeTimestamp,
  getGachaCatalogScopeKey,
  getGachaChatIdSeed,
  getGachaChatMessageText,
  getGachaCustomFieldEntries,
  getGachaCustomFieldsSearchText,
  getGachaDiceEventDetail,
  getGachaFortuneProgressView,
  getGachaItemCreatedAtMs,
  getGachaItemDefinitionFingerprint,
  getGachaItemDescriptionText,
  getGachaItemEffectText,
  getGachaItemGrantQuantity,
  getGachaItemTagsText,
  getGachaLocalDateKey,
  getGachaMinimumRarity,
  getGachaNamedCustomField,
  getGachaPickupItems,
  getGachaPickupRotationKey,
  getGachaPoolDefinitions,
  getGachaPoolDefinitionsWithVirtualTags,
  getGachaPoolDisplayName,
  getGachaRarityIconClass,
  getGachaRarityRank,
  getGachaReservedCustomFieldHeaders,
  getGachaRewardFieldLimits,
  getGachaRewardParseResult,
  getGachaRewardParseResultForItem,
  getGachaRewardTargetModuleKey,
  getGachaRewardTargetModuleName,
  getGachaRewardTargetOptions,
  getGachaRewardTargetTableLabel,
  getGachaSettingsFilterLabel,
  getGachaSettingsPoolItems,
  getGachaShardLabel,
  getGachaShopProgressContainers,
  getGachaState,
  getGachaStateBalanceScore,
  getGachaStateMigrationKey,
  getGachaStateStorageKey,
  getGachaTargetColumnEntries,
  getGachaTargetTableMatches,
  getGlobalInteractionAvatarLookupNames,
  getGlobalInteractionCollapsedSections,
  getInventoryActionLabel,
  getInventoryActionPrompt,
  getInventoryActiveFilterCount,
  getInventoryCharacters,
  getInventoryColumnMap,
  getInventoryDefaultMetaRecord,
  getInventoryDetailContext,
  getInventoryEnumOptions,
  getInventoryFieldColumnIndex,
  getInventoryFieldLabel,
  getInventoryFilters,
  getInventoryFiltersCollapsedState,
  getInventoryGlobalContext,
  getInventoryMetadataContextKey,
  getInventoryMetadataForItem,
  getInventoryMetadataRoot,
  getInventoryMetadataScopeKey,
  getInventoryMetadataStore,
  getInventoryResult,
  getLatestAssistantMessageElement,
  getLegacyGachaStateFromRawData,
  getLegacyInventoryMetadataRoot,
  getObjectRecord,
  getPanelHostMessage,
  getRuntimeGachaRawData,
  getStoredGachaActivePoolTag,
  getStoredGachaCatalog,
  getStoredGachaItemSettings,
  getStoredGachaPoolSettings,
  getStoredGachaSettingsPoolTag,
  getStoredGachaShardShopRarity,
  getStoredGachaStateSnapshot,
  getTemplateInspectionSeverityMeta,
  getTemplateInspectionSheets,
  getTotalGachaShards,
  getViewportAnchorRect,
  getViewportBottomAnchorElements,
  getViewportBottomOffset,
  getVisibleGachaPoolConfigDefinitions,
  grantEquipmentGachaReward,
  grantGachaReward,
  grantInventoryGachaReward,
  handleInventoryAction,
  hasGachaCustomFields,
  hasGachaRewardTable,
  hasGachaRewardTableForItem,
  hasMigratedLegacyGachaState,
  hashGachaCatalogSeed,
  hashGachaSeed,
  hydrateGlobalInteractionAvatars,
  importGachaCatalogJsonFromFile,
  inferEquipmentTableTypeForGachaItem,
  initSortable,
  injectIndependentOptions,
  insertHtmlToPage,
  inspectTableTemplate,
  isBuiltinGachaPoolId,
  isFloatingCollapseActive,
  isGachaFieldAlias,
  isGachaItemEnabled,
  isGachaItemOwned,
  isGachaPickupItem,
  isGachaPoolEnabled,
  isGachaRarity,
  isGachaTargetTableAliasMatch,
  loadDashboardNpcAvatars,
  markLegacyGachaStateMigrated,
  mergeGachaCatalogRecordsToGlobalScope,
  mergeImportedGachaPools,
  mergeLegacyGachaStateForLocalStorage,
  migrateGachaCatalogRecordsToGlobalScope,
  normalizeFloatingCollapsePosition,
  normalizeGachaCatalogRecord,
  normalizeGachaCustomFields,
  normalizeGachaFieldAlias,
  normalizeGachaItemEnabled,
  normalizeGachaItemOrder,
  normalizeGachaMessageId,
  normalizeGachaPoolDefinition,
  normalizeGachaPoolId,
  normalizeGachaPoolName,
  normalizeGachaRewardTarget,
  normalizeGachaStateRecord,
  normalizeGachaTargetColumns,
  normalizeGachaTargetTable,
  normalizeGachaTimestamp,
  normalizeImportedGachaItem,
  normalizeImportedGachaPoolTags,
  normalizeImportedGachaPools,
  normalizeRecentGachaRewards,
  normalizeScopedGachaCatalogRecord,
  normalizeShardWallet,
  normalizeTemplateInspectText,
  parseEquipmentItems,
  parseInventoryItems,
  performGachaDraw,
  persistRawDataWithGacha,
  pickGachaItemDefinition,
  pickGachaRarity,
  pickWeightedValue,
  pushRecentGachaReward,
  recordGachaFortuneGain,
  refreshChangesPanel,
  refreshFixedAnchorResizeObserver,
  refreshGachaPoolSelectionUi,
  refreshGachaShardShop,
  refreshGachaVisualization,
  refreshInventoryVisualization,
  refreshViewportInputTargetListeners,
  renderChangesPanel,
  renderCheckSuggestionTableContent,
  renderDashboard,
  renderFavoritesPanel,
  renderGachaCustomFieldsDetailsHtml,
  renderGachaCustomFieldsPreviewHtml,
  renderGachaFortuneProgressHtml,
  renderGachaPanelHtml,
  renderGachaPickupHtml,
  renderGachaPoolSettingsListHtml,
  renderGachaSettingsFilterMenuHtml,
  renderGachaSettingsPoolItemsHtml,
  renderGachaSettingsPoolTabsHtml,
  renderGachaSettingsPoolViewerHtml,
  renderGachaShardShopHtml,
  renderGlobalInteractionActionButton,
  renderGlobalInteractionAvatar,
  renderGlobalInteractionGenericMark,
  renderGlobalInteractionItemMark,
  renderGlobalInteractionMapMark,
  renderGlobalInteractionRowCard,
  renderGlobalInteractionsPanel,
  renderGlobalInteractionsSection,
  renderGlobalInteractionsTableGroup,
  renderInterface,
  renderInterfacePending,
  renderInterfaceTimer,
  renderInventoryFilterButtons,
  renderInventoryMetadataHtml,
  renderInventoryVisualization,
  renderOptionTableContent,
  renderTableContent,
  reopenInventoryItemDetail,
  repairCurrentTableTemplateFromPreset,
  resolveEquipmentTableTypeForGachaItem,
  resolveExistingTableName,
  resolveGachaTargetTableOverride,
  restoreGachaLocalStorageSnapshot,
  saveCurrentTabState,
  saveGachaItemSettingsRecord,
  saveGachaPoolSettings,
  saveInventoryFieldValue,
  saveInventoryFilters,
  saveInventoryFiltersCollapsedState,
  saveInventoryMetadataRecord,
  saveInventoryMetadataRoot,
  saveInventoryMetadataStore,
  saveStoredGachaActivePoolTag,
  saveStoredGachaCatalog,
  saveStoredGachaSettingsPoolTag,
  saveStoredGachaShardShopRarity,
  saveStoredGachaStateSnapshot,
  scheduleFixedAnchorTargetRefresh,
  scheduleFixedWrapperBoundsRefresh,
  scheduleFloatingCollapseBoundsRefresh,
  scheduleViewportBoundsRefresh,
  scheduleViewportInputTargetRefresh,
  selectedSwapSource,
  serializeGachaCatalogItemForExport,
  serializeGachaPoolDefinitionForExport,
  setActiveTableNavButton,
  setEquipmentRowBasicFields,
  setGachaItemOrder,
  setGachaPoolOrder,
  setInventoryMetadataForItem,
  setInventoryRowBasicFields,
  settleGachaFortuneForDiceEvent,
  settleGachaFortuneForMessage,
  setupFixedAnchorMutationObserver,
  setupFixedWrapperBoundsListeners,
  setupFloatingCollapseBoundsListeners,
  setupViewportBoundsListeners,
  setupViewportInputMutationObserver,
  showCellMenu,
  showChangeEditModal,
  showChangeSingleFieldModal,
  showEditDialog,
  showFavoriteEditModal,
  showFavoritesPanel,
  showGachaCatalogClearDialog,
  showGachaCatalogImportConfirm,
  showGachaConfirmDialog,
  showGachaItemEditorDialog,
  showGachaPickupItemDetail,
  showGachaPoolNameDialog,
  showGachaRecentRewardDetail,
  showGachaSaveError,
  showGachaSettingsDialog,
  showGachaShardExchangeConfirm,
  showGachaShardShop,
  showGachaVisualization,
  showInventoryDetailMenu,
  showInventoryFieldEditDialog,
  showInventoryGiftDialog,
  showInventoryItemDetail,
  showInventoryMetaEditDialog,
  showInventoryVisualization,
  showNewFavoriteModal,
  showRowCompareEditModal,
  showSendToTableModal,
  showSettingsModal,
  showTableTemplateRequirementPresetEditor,
  showTableTemplateRequirementPresetManager,
  showTagInputModal,
  showTemplateInspectionModal,
  showTemplateInspectionResultModal,
  sortGachaPoolDefinitions,
  startGachaShopUiRefresh,
  suppressNextFloatingCollapseClick,
  switchPanel,
  syncHostRegenerateButtonVisibility,
  syncInventoryMetadataForRawData,
  templateTextIncludesAny,
  toggleOrderEditMode,
  touchGachaActivity,
  truncateGachaText,
  updateChangesCount,
  updateFixedWrapperBounds,
  updateFloatingCollapseBounds,
  updateGachaFortuneProgressDom,
  updateGachaItemSetting,
  updateGachaPoolConfig,
  updateGachaPoolTag,
  updateGachaShopProgressUi,
  updateViewportWrapperBounds,
  validateGachaCatalogImportItemTarget,
  validateGachaCustomFieldsForExistingRow,
  validateGachaCustomFieldsForTargetTable,
  viewportBoundsListenerAttached,
  viewportBoundsListenerWindow,
  viewportBoundsRaf,
  viewportBoundsRefreshHandler,
  viewportInputMutationDocument,
  viewportInputMutationObserver,
  viewportInputMutationWindow,
  viewportInputObservedElements,
  viewportInputResizeObserver,
  viewportInputTargetsRaf,
  warnMissingTableTarget,
  withGachaItemSettings,}; // __wireLegacyFavoritesPanelDeps/getGachaCatalogCache/setGachaCatalogCache/getGachaCatalogLoadTask/setGachaCatalogLoadTask 已由头部 export function 导出
export type {
  CompositionSafeSearchBinding,
  CompositionSafeSearchOptions,
  CompositionSafeSearchPayload,
  EquipmentTableType,
  FloatingCollapsePosition,
  GachaCatalog,
  GachaCatalogCache,
  GachaCatalogImportAnalysis,
  GachaCatalogImportMode,
  GachaCatalogImportStats,
  GachaCatalogLoadTask,
  GachaCatalogRecord,
  GachaCustomFieldApplyOptions,
  GachaCustomFieldValidationOptions,
  GachaCustomFieldValidationResult,
  GachaCustomFieldsDetailsRenderOptions,
  GachaCustomFieldsPreviewRenderOptions,
  GachaDrawOutcome,
  GachaExistingCustomFieldValidationOptions,
  GachaFortuneProgressView,
  GachaInputStats,
  GachaItemSettingsEntry,
  GachaItemSettingsRecord,
  GachaPityState,
  GachaPoolSettingsRecord,
  GachaRecentRewardRecord,
  GachaRewardColumnMap,
  GachaRewardParseOptions,
  GachaRewardParseResult,
  GachaSettingsFilterField,
  GachaSettingsFilterOption,
  GachaSettingsItemFilterState,
  GachaSettingsItemSortMode,
  GachaSettingsItemSourceFilter,
  GachaSettingsItemStatusFilter,
  GachaShardWallet,
  GachaState,
  InventoryEditableField,
  InventoryFilterButtonMeta,
  InventoryFilterState,
  InventoryMenuScope,
  InventoryMetadataRecord,
  InventoryMetadataRoot,
  InventoryMetadataScope,
  InventoryMetadataStore,
  InventoryParsedItem,
  InventoryQualityFilter,
  InventorySortFilter,
  InventoryTypeFilter,
  NormalizedGachaCatalogItem,
  NormalizedImportedGachaPools,
  TemplateInspectionIssue,
  TemplateInspectionIssueGroup,
  TemplateInspectionResult,
  TemplateInspectionSeverity,
  TemplateInspectionSheet,
  TemplateTableRequirement,};
