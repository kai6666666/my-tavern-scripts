// @ts-nocheck
import { RELATION_ICON_MAP } from './engine/emoji-maps';
import { showActionableErrorToast } from './ui/actionable-error-toast';
import { normalizeDialogueIndentStrategy } from './ui/dialogue-indent-renderer';
import { RollResult } from './engine/types';

import {
  TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
  buildTableTemplateAppendRepairPlan,
  cloneTemplateValue,
  inspectTableTemplateWithPreset,
  normalizeTableTemplateRequirementPreset,
} from './template/table-template-requirements';
import {
  BUILTIN_GACHA_POOL_DEFINITIONS,
  GACHA_CATALOG_EXPORT_KIND,
  GACHA_CATALOG_VERSION,
  FORTUNE_CURRENCY_NAME,
  GACHA_ACTIVE_HEARTBEAT_MS,
  GACHA_ACTIVE_SECONDS_PER_FORTUNE,
  GACHA_CHECK_REWARD,
  GACHA_CHARS_PER_FORTUNE,
  GACHA_DRAW_COST_SINGLE,
  GACHA_DRAW_COST_TEN,
  GACHA_ITEM_DEFINITIONS,
  GACHA_LEGEND_PITY_THRESHOLD,
  GACHA_MESSAGE_REWARD,
  GACHA_POOL_TAGS,
  GACHA_RARE_PITY_THRESHOLD,
  GACHA_RARITY_ORDER,
  GACHA_RARITY_WEIGHTS,
  GACHA_RECENT_REWARD_LIMIT,
  GACHA_REWARD_TARGETS,
  GACHA_SHARD_VALUES,
  GACHA_UNIQUE_RARITY,
  type GachaPoolDefinition,
  type GachaCustomFields,
  type GachaItemDefinition,
  type GachaPoolTag,
  type GachaRarity,
  type GachaRewardTarget,
  type GachaRewardTargetColumnKey,
  type GachaRewardTargetColumns,
} from './engine/gacha-items';

import { LocalAvatarDB } from './favorites/local-avatar-db';

import { DiceHistoryStatsDB, __wireDiceStatsContextGetter } from './favorites/favorites-db';
import type { FavoriteItem } from './favorites/favorites-db';

import { isNpcTableName, withTableTemplateCheckHint, warnTableTemplateIssue, errorTableTemplateIssue, getRowKey } from './engine/primary-keys';

import { DICE_ROOT_CLASS, DICE_ROOT_SELECTOR, HOST_REGENERATE_HIDDEN_CLASS, HOST_REGENERATE_BUTTON_SELECTOR } from './engine/constants';

import { STORAGE_KEY_VALIDATION_MODE, RULE_TYPE_INFO } from './validation/validation-rule-manager';

import { STORAGE_KEY_REGEX_RULES, STORAGE_KEY_REGEX_ACTIVE_PRESET } from './regex/regex-types';
import type { RegexTransformationRule } from './regex/regex-types';

import { convertTavernRegexToRule } from './regex/tavern-regex-import';
import type { TavernRegex } from './regex/tavern-regex-import';

import { BUILTIN_REGEX_RULES } from './regex/builtin-regex-rules';

import { calculateDiceExpectedValue, rollComplexDiceExpression, evaluateFormula, evaluateCondition, evaluateConditionNumber, isComplexCondition, evaluateOutcomes, DEFAULT_OUTPUT_TEMPLATE, DEFAULT_CONTEST_OUTPUT_TEMPLATE, formatOutputTemplate, generateAttributeValue } from './engine/formula-parser';

import { RegexTransformationEngine, __wireRegexTransformationManager } from './regex/regex-transformation-engine';

import { RegexTransformationManager, __wireRegexTransformationManagerDeps } from './regex/regex-transformation-manager';

import { ValidationEngine, __wireValidationEngineDeps } from './validation/validation-engine';

import { refreshRegexRulesList, __wireRefreshRegexRulesListDeps } from './regex/regex-list-refresh';

import { RegexPresetManager, __wireRegexPresetManagerDeps } from './regex/regex-preset-manager';

import { showAddRegexRuleModal, __wireShowAddRegexRuleModalDeps } from './regex/show-add-regex-rule-modal';

import { showDebugConsoleModal, __wireShowDebugConsoleModalDeps } from './misc/show-debug-console-modal';

import type { OutcomeLevel, Effect, ResourceBurner, WorkflowQuickAction, AttrShortcutQuickAction, PresetQuickAction, CheckSelector, EffectResult, ComputedEffect, CheckHistoryExtension, EffectRunEventPayload, FieldConfig, AdvancedDicePreset, PendingEffectContext } from './presets/advanced-dice-preset';

import { ActionPresetManager, __wireInteractionRulePresetDeps } from './presets/interaction-rule-preset';

import { isAttributeQuickSelectTarget, normalizeAttributeQuickSelectConfig, AttributePresetManager, __wireAttributeRulePresetDeps } from './presets/attribute-rule-preset';
import type { AttributeQuickSelectTarget, CharacterAttributeSource, AttributePresetConfig, CharacterAttributeEntry, QuickSelectCheckPresetConfig } from './presets/attribute-rule-preset';

import { updateTemplateForActivePreset, __wirePresetSwitchTableTemplateDeps } from './presets/preset-switch-table-template';

import { STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_LAST_PRESET, PRESET_FORMAT_VERSION, SCRIPT_VERSION } from './engine/preset-constants';

import { BookmarkManager, escapeHtml, getRemoteImageUrlValidationError, formatCssImageUrl, buildAvatarBackgroundStyle, DATA_VALIDATION_DEPRECATED_META, renderDeprecatedBadge, safeEncodeURIComponent, safeDecodeURIComponent, setupOverlayClose, showPresetConflictDialog, setTextareaValueAndNotify, lastHumanInputActivityAt, GACHA_TEST_DEFAULT_FORTUNE, GACHA_SHARD_EXCHANGE_COST, STORAGE_KEY_GACHA_STATE, STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_SHOP_UI_REFRESH_MS, GACHA_CATALOG_RAW_ROW_INDEX_PROP, stripSystemInjectedContent, countUnicodeCharacters, consumePendingHumanInputSnapshot, smartInsertToTextarea, getResolvedComposerText, clearComposerIfCurrentText, sendChatTextAndTrigger, STORAGE_KEY_TABLE_ORDER, STORAGE_KEY_ACTION_ORDER, STORAGE_KEY_ACTIVE_TAB, STORAGE_KEY_LAST_SNAPSHOT, STORAGE_KEY_IS_COLLAPSED, STORAGE_KEY_OPTIONS_COLLAPSED, STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_INVENTORY_FILTERS, STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, STORAGE_KEY_INVENTORY_METADATA, STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_TABLE_HEIGHTS, STORAGE_KEY_TABLE_STYLES, STORAGE_KEY_HIDDEN_TABLES, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_REVERSE_TABLES, MAX_ACTION_BUTTONS, MIN_PANEL_HEIGHT, MAX_PANEL_HEIGHT, PANEL_VIEWPORT_TOP_GUTTER, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, compareVersion, STORAGE_KEY_MAP_FOCUS, __wireBookmarkManagerDeps } from './favorites/bookmark-manager';

import { FavoritesManager, getPlayerName, replaceUserPlaceholders, getDiceStatsContext, renderDiceHistoryStatsHtml, AvatarManager, __wireFavoritesManagerDeps } from './favorites/favorites-manager';
import type { TableCompatibility, DiceStatsScope } from './favorites/favorites-manager';

import { PresetManager, ValidationRuleManager, __wirePresetManagerDeps } from './validation/preset-manager';

import { showAddValidationRuleModal, __wireShowAddValidationRuleModalDeps } from './validation/validation-rule-modal';

import { getDbLockAPI, getSheetKeyByTableName, findRowIndexByPrimaryKey, parseEffectValueInput, executeEffects, executeSecondaryEffectsChain, computePendingEffectVariables, buildEffectTraceLines, buildEffectMetaLines, __wireDbAdapterDeps } from './infra/db-adapter';
import { RenderPresetManager, __wireRenderPresetManagerDeps } from './presets/render-preset-manager';
import type { RenderPreset } from './presets/render-preset-manager';
import { MvuModule, getDiceConfig, saveDiceConfig, hideDiceResultsInUserMessages, __wireMvuVisualizerDeps } from './engine/mvu-visualizer';
import { AdvancedDicePresetManager, STORAGE_KEY_ACTIVE_ADVANCED_PRESET, applyAdvancedPresetOutcomePolicy, getAdvancedPresetDisplayOutcome, TableTemplateRequirementPresetManager, buildNewTableTemplateRequirementPresetJsoncTemplate, parseTableTemplateRequirementPresetJson, buildTableTemplateRequirementPresetAgentPrompt, getTableTemplateRequirementPresetStats, buildGachaCatalogAgentPrompt, __wireAdvancedDicePresetManagerDeps } from './presets/advanced-dice-preset-manager';
import { getRowDisplayName, CHARACTER_NAME_COLUMN_KEYS, isPlayerTableName, isNpcLikeTableName, hydrateCustomTableNameIconsIn, getDisplayName, characterNamesMatch, findNameColumnIndex, findCharacterAttributeRow, findPrimaryAttributeColumns, findAttributeColumnIndices, pickFallbackAttributeColumn, resolveCanonicalCharacterName, NameAliasRegistry, resolveBatchLocationEmojis, getElementEmoji, resolveUserGraphName, createGlobalInteractionCustomTableNameIconContext, renderCustomTableNameIconContent, USER_NODE_KEY, isCharacterTable, refreshDialogueIndentRender, scheduleDialogueIndentRender, getLocationEmoji, renderIcon, renderThemeIconContent, createCustomTableNameIconContext, getGachaItemCustomTableNameIconContext, renderGachaItemIconContent, __wireCharacterNameResolverDeps } from './engine/character-name-resolver';
import type { DiceRawData } from './engine/character-name-resolver';

import { __wireCrazyModeDeps } from './presets/crazy-mode';

import { __wireShowTableRuleFixModalDeps } from './misc/table-rule-fix-modal';

import { showSmartFixModal, __wireShowSmartFixModalDeps } from './misc/smart-edit-modal';

import { showActionPresetManager, __wireShowActionPresetManagerDeps } from './presets/interaction-rule-preset-manager';

import { showRenderPresetManager, __wireShowRenderPresetManagerDeps } from './presets/render-preset-manager-ui';

import { showAttributePresetManager, __wireShowAttributePresetManagerDeps } from './presets/attribute-preset-manager-ui';

import { showDashboardPresetManager, __wireShowDashboardPresetManagerDeps } from './presets/dashboard-preset-manager-ui';

import { AcuDiceGachaAPI, __wireDebugTestFunctionsDeps } from './misc/debug-test-functions';

import { createSortableList, showPresetListDialog, showAdvancedPresetManager, buildDashboardPresetAgentPromptFilename, buildActionPresetAgentPromptFilename, buildRenderPresetAgentPromptFilename, buildTableTemplateRequirementPresetAgentPromptFilename, buildGachaCatalogAgentPromptFilename, __wireAdvancedDicePresetUiDeps } from './presets/advanced-dice-preset-ui';

import { AcuDiceAPI, defineAcuDiceOnWindow, rootWindow, notifyReady, dispatchReadyEvent, emitEvent, checkHistory, contestHistory, MAX_HISTORY, showGlobalDiceHistoryDialog, executeCheckSuggestionCommand, __wireAcuDiceApiDeps } from './api';
import type { CheckHistoryEntry } from './api';

import { init, __wireAcuDiceInitDeps } from './init';

import { showAvatarManager, clearDiceLocalCacheData, showManualUpdateDialog, showCardEditModal, getConfig, saveConfig, isDiceConfigBackupRecord, cloneDiceConfigBackupValue, getDiceConfigBackupPresetRecordId, toDiceProfileSummary, refreshDiceProfileIndex, importDiceProfile, saveCurrentDiceProfile, applyDiceProfile, exportDiceProfile, getDiceProfilePromptState, getDiceProfileCharacterContext, detectCharacterDiceProfile, scheduleCharacterDiceProfileDetection, showDiceConfigBackupDialog, getTutorialModule, getTutorialButtonHtml, startTutorialFromButton, bindTutorialButtonsIn, asDiffRecord, normalizeDiffText, getDiffSheetIdentity, findDiffSnapshotEntry, normalizeDiffRow, getDiffSheetByKey, getDiffDataRow, setDiffDataRow, setDiffDataCell, removeDiffDataRow, getDiffRowDisplayTitle, createDiffRowMatcher, takeDiffRowMatch, countRuntimeDataChanges, generateDiffMap, addStyles, cloneRuntimeDataValue, restoreMutableRuntimeValue, getRuntimeErrorMessage, hasRuntimeTableReadApi, getTableData, getDbChatMessages, hasSheetKeys, getSheetHeaders, getCrudColumnNameForHeader, getCrudSqlTableName, buildCrudColumnAliasMap, buildCrudEnumConstraintMap, assertCrudEnumConstraints, assertCrudLengthConstraints, buildCrudRequiredHeaderSet, assertCrudRequiredColumnsRepresented, saveSheetsViaJsonFloorWithoutTracking, assertCrudInsertRequiredCells, saveDataToDatabase, performSaveDataOnly, runInSaveQueue, saveDataOnly, findRuntimeSheetEntryForMutation, saveRowInstantly, appendRowInstantly, deleteRowInstantly, processJsonData, __wireDiceSettingsDeps } from './settings/dice-settings';
import type { DbChatMessage } from './settings/dice-settings';

import { ACTION_BUTTONS, ACTION_ICON_MAP, CustomTableNameIconImageDB, DASHBOARD_DEFAULT_PRESET_ID, DASHBOARD_PRESET_MODULE_KEYS, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, DASHBOARD_TABLE_CONFIG, DEFAULT_CONFIG, DEFAULT_GM_CONFIG, DashboardDataParser, DashboardPresetManager, FONTS, JSONC_FILE_ACCEPT, Store, THEMES, UpdateController, applyStoredPanelHeight, areAllTablesReversed, buildCheckValueText, buildGlobalInteractionGroups, buildRelationshipGraphTableFromPreset, canWriteMvuPanel, cleanupGlobalInteractionFloatingMenus, clearAllPanelStates, clearGlobalInteractionOutsideCapture, clearModalStack, cloneDashboardPresetModules, collectCurrentChatAvatarNodes, collectHostAndLocalNodes, createAutoRegexTransformKey, createDashboardPresetEditorTemplate, createElementFromHtml, createGlobalInteractionSections, debugGlobalInteraction, dedupeInteractionActions, downloadAiPromptFile, downloadJsonFile, downloadJsoncFile, executeTableInteractionAction, extractNumericValue, generateRPGAttributes, getActiveDashboardRelationshipGraphSources, getActivePanelHeightKey, getActiveTabState, getAttributeEntryForCharacter, getAttributeValue, getBadgeStyle, getCheckSuggestionItemsFromTable, getCollapsedState, getCore, getCurrentChatAvatarNodes, getCurrentContextFingerprint, getDashboardModuleConfig, getDashboardNpcListData, getDatabaseManualUpdateErrorMessage, getFullAttributesForCharacter, getHiddenTables, getIconForTableName, getInteractOptionsForRow, getJsonLikeErrorMessage, getNamedCheckParamText, getNavigationFontMetrics, getOptionItemsFromTable, getOptionsCollapsedState, getPanelDragStartHeight, getPendingDeletions, getRandomSkillPool, getSavedTableOrder, getStoredPanelHeight, getSuccessLevel, getTableHeights, getTableStyles, getTavernHostDocument, getTavernHostWindow, isCheckSuggestionTableName, isCustomTableNameIconImageUrlValid, isNumericCell, isOptionTableName, isRecord, isRecordValue, isSameAttributeAlias, isTableReversed, isTwoDimensionalArray, loadSnapshot, normalizeCollapseStyle, normalizeInteractionLabel, openDatabaseInterface, openDatabaseVisualizerInterface, parseAttributeString, parseDashboardPresetJson, parseJsoncDocument, parseJsoncRecord, parseJsoncValue, pickTextFile, popModal, pushModal, readTextFile, rememberAutoRegexTransform, renderCheckSuggestionOptionButtonHtml, renderDataCardCellContent, renderOptionButtonHtml, resetPanelRequestedHeight, resolveCustomTableNameIcon, resolveDashboardCustomTableNameIconContextInfo, resolveGlobalInteractionSectionMeta, resolveQuickSelectTarget, runDatabaseManualUpdate, saveActiveTabState, saveCollapsedState, saveCurrentDatabaseSnapshotAsReviewBaseline, saveHiddenTables, saveOptionsCollapsedState, savePanelRequestedHeight, saveSnapshot, saveTableHeights, saveTableOrder, saveTableStyles, setAllTablesReverse, setPanelRequestedHeight, shouldShowReverseButton, shouldSkipAutoRegexTransform, showContestPanel, showCustomTableNameIconManager, showDatabaseManualUpdateFailure, showDicePanel, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showMapVisualization, showRelationshipGraph, toggleTableReverse, updateSaveButtonState, updateSingleAttribute, validateJsoncEditorConfig, __wireDashboardDeps } from './dashboard/dashboard';
import type { AvatarManagerNode, CustomTableNameIconContext, GlobalInteractionAction, GlobalInteractionGroup, GlobalInteractionRow, GlobalInteractionSection, GlobalInteractionSectionKind, NavigationItem, RelationGraphTableInput, SpecialNavigationItem } from './dashboard/dashboard';

import { GACHA_ALL_POOL_TAG, GachaCatalogDB, analyzeGachaCatalogImport, applyGachaCatalogImport, assertSaveStoredGachaStateSnapshot, bindEvents, bindGlobalInteractionEvents, buildDefaultGachaPoolDefinition, canDeleteGachaPoolDefinition, cloneGachaCatalogItems, cloneGachaState, closeGachaVisualization, compareGachaItemDefinitionsForDisplay, createDefaultGachaState, createEmptyGachaCatalog, deleteGachaItemSetting, deleteGachaPoolConfig, ensureGachaCatalogLoaded, ensureGachaHeartbeat, ensureGachaPoolsForTags, exportGachaCatalogJson, flushGachaHeartbeatProgress, formatGachaCatalogImportStatsText, getActiveGachaPoolTags, getAllGachaItemDefinitions, getAllGachaPoolConfigDefinitions, getConfiguredGachaPoolDefinitions, getCustomGachaItemDefinitions, getGachaActivePoolTag, getGachaCatalogCache, getGachaCatalogImportFailureMessage, getGachaCatalogLoadTask, getGachaFortuneProgressView, getGachaRewardParseResult, getGachaRewardTargetOptions, getGachaRewardTargetTableLabel, getGachaState, getRuntimeGachaRawData, getVisibleGachaPoolConfigDefinitions, isBuiltinGachaPoolId, isFloatingCollapseActive, isGachaItemEnabled, loadDashboardNpcAvatars, mergeGachaCatalogRecordsToGlobalScope, migrateGachaCatalogRecordsToGlobalScope, normalizeGachaCatalogRecord, normalizeGachaItemEnabled, normalizeGachaItemOrder, normalizeGachaPoolDefinition, normalizeGachaPoolId, normalizeGachaTargetTable, normalizeImportedGachaItem, performGachaDraw, recordGachaFortuneGain, refreshGachaShardShop, refreshGachaVisualization, renderDashboard, renderGlobalInteractionsPanel, renderInterface, saveGachaPoolSettings, saveStoredGachaCatalog, scheduleViewportBoundsRefresh, serializeGachaCatalogItemForExport, setGachaCatalogCache, setGachaCatalogLoadTask, settleGachaFortuneForDiceEvent, settleGachaFortuneForMessage, showGachaSettingsDialog, showGachaShardShop, showGachaVisualization, syncInventoryMetadataForRawData, touchGachaActivity, updateGachaPoolTag, validateGachaCatalogImportItemTarget } from './favorites/legacy-favorites-panel';

(function () {
  'use strict';

  // [已拆分] 本段已移至 engine/constants.ts（符号由文件顶部 import 提供）
  // [已拆分] 本段已移至 engine/primary-keys.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 infra/db-adapter.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 favorites/bookmark-manager.ts（符号由文件顶部 import 提供）
  // [保留] gachaHeartbeatTimer/gachaShopUiRefreshTimer/gachaShopRootElement 三个 let 状态单元仍被本 IIFE 剩余代码直接重新赋值，留在 IIFE 内（ESM import 绑定只读）
  let gachaHeartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopUiRefreshTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopRootElement: HTMLElement | null = null;

  // [已拆分] 本段已移至 infra/console-capture.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 infra/global-error-handler.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/regex-types.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/tavern-regex-import.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/builtin-regex-rules.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 validation/validation-rule-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 misc/quick-check-exclude-keywords.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/render-preset-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 validation/preset-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/regex-transformation-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/regex-preset-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/regex-transformation-engine.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 validation/validation-engine.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 favorites/local-avatar-db.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 favorites/favorites-db.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 favorites/favorites-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 engine/character-name-resolver.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 engine/mvu-visualizer.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/advanced-dice-preset.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/attribute-rule-preset.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/advanced-dice-preset-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/preset-switch-table-template.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/interaction-rule-preset.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/crazy-mode.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 engine/formula-parser.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 dashboard/dashboard.ts（符号由文件顶部 import 提供）
  // [保留] 共享 let 状态（批次6/10/11模式）仍被本 IIFE 剩余代码（idx 45/收尾接线）直接读取/重赋值，声明保留 IIFE 内（ESM import 绑定只读），
  //   dashboard.ts 经 __wireDashboardDeps 注入回调读写（cachedRawData/hasUnsavedChanges/dashboardRuntimeConfigCache 复用批次 11 回调；
  //   cleanupGlobalInteractionOutsideCapture 经新增 get/set 回调；isInitialized/_boundRenderHandler/_boundReviewBaselineHandler 仅 init.ts 接线引用）
  let dashboardRuntimeConfigCache: DashboardConfigMap | null = null;
  let isInitialized = false;
  let isSaving = false;
  let saveQueue: Promise<void> = Promise.resolve(); // 保存队列，确保并发保存按顺序执行
  let isEditingOrder = false;
  let isSettingsOpen = false;
  let currentDiffMap = new Set();
  let observer = null;
  let _boundRenderHandler = null;
  let _boundReviewBaselineHandler = null;
  let cachedRawData = null;
  let hasUnsavedChanges = false;
  let isAutoTransforming = false; // 防止自动转换循环触发
  let tablePageStates = {};
  let tableSearchStates = {};
  let lastOptionHash = null;
  let optionPanelVisible = false; // [新增] 选项面板可见性控制
  // [修改] 初始化时从硬盘读取记忆
  const STORAGE_KEY_SCROLL = 'acu_scroll_v19_fixed';
  let tableScrollStates = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SCROLL);
    if (saved) tableScrollStates = JSON.parse(saved);
  } catch (e) {
    console.warn('[DICE]ACU Error:', e);
  }
  let cleanupGlobalInteractionOutsideCapture: (() => void) | null = null;
  // [已拆分] 本段已移至 settings/dice-settings.ts（符号由文件顶部 import 提供）
  // [保留] tutorialButtonEventsBound 仅被本 IIFE 剩余代码（idx 45，bak 68099/68105）直接读取/重赋值，声明保留 IIFE 内（ESM import 绑定只读）
  let tutorialButtonEventsBound = false;

  // [已拆分] 本段已移至 misc/smart-edit-helpers.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/regex-list-refresh.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 validation/validation-rule-modal.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 misc/smart-edit-modal.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 misc/paired-table-fix.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 misc/table-rule-fix-modal.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/attribute-preset-manager-ui.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/advanced-dice-preset-ui.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/interaction-rule-preset-manager.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/dashboard-preset-manager-ui.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 presets/render-preset-manager-ui.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 misc/show-debug-console-modal.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 regex/show-add-regex-rule-modal.ts（符号由文件顶部 import 提供）

  // 暴露到全局，供紧急入口按钮调用
  window.showDebugConsoleModal = showDebugConsoleModal;

  // [已拆分] 本段已移至 api.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 favorites/legacy-favorites-panel.ts（符号由文件顶部 import 提供）
  // [说明] 共享 let 状态（批次6/10/11/12模式）声明保留本 IIFE 内（上方标记处），legacy-favorites-panel.ts 经 __wireLegacyFavoritesPanelDeps
  //   注入读写回调；gachaCatalogCache/gachaCatalogLoadTask 声明随本段迁出（本 IIFE 不再读写），批次11 的 get/set 回调删除、
  //   改由模块导出直连 import（__wireDiceSettingsDeps 接线不变）。

  // [已拆分] 本段已移至 init.ts（符号由文件顶部 import 提供）

  // [已拆分] 本段已移至 misc/debug-test-functions.ts（符号由文件顶部 import 提供）

  (AcuDiceAPI as Record<string, unknown>).gacha = AcuDiceGachaAPI;

  // 使用 Object.defineProperty 防止意外覆盖；在 gacha 子 API 完成后再通知 ready。
  defineAcuDiceOnWindow(window);

  if (rootWindow !== window) {
    try {
      defineAcuDiceOnWindow(rootWindow);
    } catch (error) {
      console.warn('[AcuDice] 无法写入顶层窗口，可能跨域', error);
    }
  }

  notifyReady();
  dispatchReadyEvent(window);
  if (rootWindow !== window) {
    dispatchReadyEvent(rootWindow);
  }

  console.info('[AcuDice] API v1.3.0 已加载');

  const { $ } = getCore();
  if ($) $(document).ready(init);
  else window.addEventListener('load', init);

  // [接线] 为已拆分的 favorites/favorites-db.ts 注入 IIFE 内的 getDiceStatsContext（避免循环 import）
  __wireDiceStatsContextGetter(getDiceStatsContext);

  // [接线] 为已拆分的 regex/regex-transformation-engine.ts 注入 IIFE 内的 RegexTransformationManager（避免循环 import）
  __wireRegexTransformationManager(RegexTransformationManager);

  // [接线] 为已拆分的 regex/regex-transformation-manager.ts 注入 IIFE 内的 Store 与 RegexPresetManager（避免循环 import）
  __wireRegexTransformationManagerDeps({ Store, RegexPresetManager });

  // [接线] 为已拆分的 validation/validation-engine.ts 注入 IIFE 内的 ValidationRuleManager（避免循环 import）
  __wireValidationEngineDeps({ ValidationRuleManager });

  // [接线] 为已拆分的 regex/regex-list-refresh.ts 注入 IIFE 内的 getCore/escapeHtml（避免循环 import）
  __wireRefreshRegexRulesListDeps({ getCore, escapeHtml });

  // [接线] 为已拆分的 regex/regex-preset-manager.ts 注入 IIFE 内的 compareVersion/Store/PRESET_FORMAT_VERSION/parseJsoncRecord/RegexTransformationManager（避免循环 import）
  __wireRegexPresetManagerDeps({ compareVersion, Store, PRESET_FORMAT_VERSION, parseJsoncRecord, RegexTransformationManager });

  // [接线] 为已拆分的 regex/show-add-regex-rule-modal.ts 注入 IIFE 内的 getCore/getConfig/cachedRawData/getTableData/escapeHtml/setupOverlayClose（避免循环 import）
  __wireShowAddRegexRuleModalDeps({ getCore, getConfig, cachedRawData, getTableData, escapeHtml, setupOverlayClose });

  // [接线] 为已拆分的 misc/show-debug-console-modal.ts 注入 IIFE 内的 getCore/getConfig/Store/escapeHtml（避免循环 import）
  __wireShowDebugConsoleModalDeps({ getCore, getConfig, Store, escapeHtml });

  // [接线] 为已拆分的 presets/interaction-rule-preset.ts 注入 IIFE 内的 Store/parseJsoncRecord（避免循环 import；PRESET_FORMAT_VERSION/STORAGE_KEY_* 已直连 import engine/preset-constants）
  __wireInteractionRulePresetDeps({ Store, parseJsoncRecord });

  // [接线] 为已拆分的 presets/attribute-rule-preset.ts 注入 IIFE 内的 Store/compareVersion/parseJsoncRecord/updateTemplateForActivePreset（避免循环 import；PRESET_FORMAT_VERSION/STORAGE_KEY_* 已直连 import engine/preset-constants）
  __wireAttributeRulePresetDeps({ Store, compareVersion, parseJsoncRecord, updateTemplateForActivePreset });

  // [接线] 为已拆分的 presets/preset-switch-table-template.ts 注入 IIFE 内的 AdvancedDicePresetManager/AttributePresetManager/generateRPGAttributes/getCore/Store/STORAGE_KEY_ACTIVE_ATTR_PRESET/STORAGE_KEY_ACTIVE_ADVANCED_PRESET（避免循环 import）
  __wirePresetSwitchTableTemplateDeps({ AdvancedDicePresetManager, AttributePresetManager, generateRPGAttributes, getCore, Store, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTIVE_ADVANCED_PRESET });

  // [接线] 为已拆分的 favorites/bookmark-manager.ts 注入 IIFE 内的 getCurrentContextFingerprint/getCore/getConfig/getDiceConfig/getTavernHostWindow/getTavernHostDocument/scheduleViewportBoundsRefresh（避免循环 import）
  __wireBookmarkManagerDeps({ getCurrentContextFingerprint, getCore, getConfig, getDiceConfig, getTavernHostWindow, getTavernHostDocument, scheduleViewportBoundsRefresh });

  // [接线] 为已拆分的 favorites/favorites-manager.ts 注入 IIFE 内的 cachedRawData/getTableData/getRowDisplayName/getDiceConfig/Store（避免循环 import）
  __wireFavoritesManagerDeps({ cachedRawData, getTableData, getRowDisplayName, getDiceConfig, Store });

  // [接线] 为已拆分的 validation/preset-manager.ts 注入 IIFE 内的 Store/parseJsoncRecord/isRecordValue（避免循环 import）
  __wirePresetManagerDeps({ Store, parseJsoncRecord, isRecordValue });

  // [接线] 为已拆分的 validation/validation-rule-modal.ts 注入 IIFE 内的 getCore/getConfig/cachedRawData/getTableData/processJsonData（避免循环 import）
  __wireShowAddValidationRuleModalDeps({ getCore, getConfig, cachedRawData, getTableData, processJsonData });

  // [接线] 为已拆分的 infra/db-adapter.ts 注入 IIFE 内的 getTableData/cachedRawData/updateSingleAttribute/getFullAttributesForCharacter/isSameAttributeAlias/getAttributeValue/runInSaveQueue/performSaveDataOnly（避免循环 import）
  __wireDbAdapterDeps({ getTableData, cachedRawData, updateSingleAttribute, getFullAttributesForCharacter, isSameAttributeAlias, getAttributeValue, runInSaveQueue, performSaveDataOnly });

  // [接线] 为已拆分的 presets/render-preset-manager.ts 注入 IIFE 内的 isRecordValue/parseJsoncRecord/Store/getJsonLikeErrorMessage（避免循环 import）
  __wireRenderPresetManagerDeps({ isRecordValue, parseJsoncRecord, Store, getJsonLikeErrorMessage });

  // [接线] 为已拆分的 engine/mvu-visualizer.ts 注入 IIFE 内的 isNumericCell/getTutorialButtonHtml/saveActiveTabState/getActiveTabState/renderInterface/showDicePanel/getPanelDragStartHeight/setPanelRequestedHeight/getTableHeights/saveTableHeights/savePanelRequestedHeight/resetPanelRequestedHeight/getConfig/canWriteMvuPanel/Store（避免循环 import）
  __wireMvuVisualizerDeps({ isNumericCell, getTutorialButtonHtml, saveActiveTabState, getActiveTabState, renderInterface, showDicePanel, getPanelDragStartHeight, setPanelRequestedHeight, getTableHeights, saveTableHeights, savePanelRequestedHeight, resetPanelRequestedHeight, getConfig, canWriteMvuPanel, Store });

  // [接线] 为已拆分的 presets/advanced-dice-preset-manager.ts 注入 IIFE 内的 parseJsoncValue/parseJsoncRecord/Store/isDiceConfigBackupRecord/getDiceConfigBackupPresetRecordId（避免循环 import）
  __wireAdvancedDicePresetManagerDeps({ parseJsoncValue, parseJsoncRecord, Store, isDiceConfigBackupRecord, getDiceConfigBackupPresetRecordId });

  // [接线] 为已拆分的 engine/character-name-resolver.ts 注入 IIFE 内的 getConfig/DEFAULT_CONFIG/cachedRawData/getTableData/processJsonData/getTavernHostDocument/resolveDashboardCustomTableNameIconContextInfo/resolveGlobalInteractionSectionMeta/resolveCustomTableNameIcon/isCustomTableNameIconImageUrlValid/CustomTableNameIconImageDB/getGachaRewardTargetTableLabel/getGachaRewardParseResult/getGachaRewardTargetOptions/normalizeGachaTargetTable（避免循环 import）
  __wireCharacterNameResolverDeps({ getConfig, DEFAULT_CONFIG, cachedRawData, getTableData, processJsonData, getTavernHostDocument, resolveDashboardCustomTableNameIconContextInfo, resolveGlobalInteractionSectionMeta, resolveCustomTableNameIcon, isCustomTableNameIconImageUrlValid, CustomTableNameIconImageDB, getGachaRewardTargetTableLabel, getGachaRewardParseResult, getGachaRewardTargetOptions, normalizeGachaTargetTable });

  // [接线] 为已拆分的 presets/crazy-mode.ts 注入 IIFE 内的 Store/cachedRawData/getTableData/processJsonData/DashboardDataParser/getFullAttributesForCharacter/getRandomSkillPool（避免循环 import）
  __wireCrazyModeDeps({ Store, cachedRawData, getTableData, processJsonData, DashboardDataParser, getFullAttributesForCharacter, getRandomSkillPool });

  // [接线] 为已拆分的 misc/table-rule-fix-modal.ts 注入 IIFE 内的 getCore/saveDataOnly/renderInterface/deleteRowInstantly（避免循环 import）
  __wireShowTableRuleFixModalDeps({ getCore, saveDataOnly, renderInterface, deleteRowInstantly });

  // [接线] 为已拆分的 misc/smart-edit-modal.ts 注入 IIFE 内的 getCore/getConfig/getTableData/cloneRuntimeDataValue/cachedRawData/loadSnapshot/appendRowInstantly/renderInterface/saveRowInstantly（避免循环 import）
  __wireShowSmartFixModalDeps({ getCore, getConfig, getTableData, cloneRuntimeDataValue, cachedRawData, loadSnapshot, appendRowInstantly, renderInterface, saveRowInstantly });

  // [接线] 为已拆分的 presets/interaction-rule-preset-manager.ts 注入 IIFE 内的 getCore/pushModal/getConfig/getTutorialButtonHtml/popModal/downloadJsonFile/showDiceSystemConfirmDialog/pickTextFile/getJsonLikeErrorMessage/parseJsoncValue/isRecordValue/downloadAiPromptFile/validateJsoncEditorConfig（避免循环 import；buildActionPresetAgentPromptFilename 批次 9A 起由 idx 39 直连 import advanced-dice-preset-ui）
  __wireShowActionPresetManagerDeps({ getCore, pushModal, getConfig, getTutorialButtonHtml, popModal, downloadJsonFile, showDiceSystemConfirmDialog, pickTextFile, getJsonLikeErrorMessage, parseJsoncValue, isRecordValue, downloadAiPromptFile, validateJsoncEditorConfig });

  // [接线] 为已拆分的 presets/render-preset-manager-ui.ts 注入 IIFE 内的 getCore/pushModal/getConfig/getTutorialButtonHtml/bindTutorialButtonsIn/popModal/renderInterface/downloadJsonFile/showDiceSystemConfirmDialog/pickTextFile/getJsonLikeErrorMessage/downloadAiPromptFile/validateJsoncEditorConfig（避免循环 import；buildRenderPresetAgentPromptFilename 批次 9A 起由 idx 41 直连 import advanced-dice-preset-ui）
  __wireShowRenderPresetManagerDeps({ getCore, pushModal, getConfig, getTutorialButtonHtml, bindTutorialButtonsIn, popModal, renderInterface, downloadJsonFile, showDiceSystemConfirmDialog, pickTextFile, getJsonLikeErrorMessage, downloadAiPromptFile, validateJsoncEditorConfig });

  // [接线] 为已拆分的 presets/attribute-preset-manager-ui.ts 注入 IIFE 内的 getCore/pushModal/getConfig/Store/getTutorialButtonHtml/JSONC_FILE_ACCEPT/bindTutorialButtonsIn/popModal/downloadJsonFile/showDiceSystemConfirmDialog/readTextFile/parseJsoncRecord/getJsonLikeErrorMessage/downloadAiPromptFile/validateJsoncEditorConfig（避免循环 import）
  __wireShowAttributePresetManagerDeps({ getCore, pushModal, getConfig, Store, getTutorialButtonHtml, JSONC_FILE_ACCEPT, bindTutorialButtonsIn, popModal, downloadJsonFile, showDiceSystemConfirmDialog, readTextFile, parseJsoncRecord, getJsonLikeErrorMessage, downloadAiPromptFile, validateJsoncEditorConfig });

  // [接线] 为已拆分的 presets/dashboard-preset-manager-ui.ts 注入 IIFE 内的 getCore/pushModal/getConfig/DashboardPresetManager/DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY/DASHBOARD_PRESET_MODULE_KEYS/getTutorialButtonHtml/bindTutorialButtonsIn/popModal/DASHBOARD_DEFAULT_PRESET_ID/downloadJsonFile/showDiceSystemConfirmDialog/pickTextFile/getJsonLikeErrorMessage/cloneDashboardPresetModules/createDashboardPresetEditorTemplate/downloadAiPromptFile/validateJsoncEditorConfig/parseDashboardPresetJson（避免循环 import；buildDashboardPresetAgentPromptFilename 批次 9A 起由 idx 40 直连 import advanced-dice-preset-ui）
  __wireShowDashboardPresetManagerDeps({ getCore, pushModal, getConfig, DashboardPresetManager, DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY, DASHBOARD_PRESET_MODULE_KEYS, getTutorialButtonHtml, bindTutorialButtonsIn, popModal, DASHBOARD_DEFAULT_PRESET_ID, downloadJsonFile, showDiceSystemConfirmDialog, pickTextFile, getJsonLikeErrorMessage, cloneDashboardPresetModules, createDashboardPresetEditorTemplate, downloadAiPromptFile, validateJsoncEditorConfig, parseDashboardPresetJson });

  // [接线] 为已拆分的 misc/debug-test-functions.ts 注入 IIFE 内的 @45 gacha 函数/runInSaveQueue/getRuntimeErrorMessage/showDiceSystemConfirmDialog/getCore/emitEvent/rootWindow（避免循环 import）
  __wireDebugTestFunctionsDeps({ cloneGachaState, getGachaState, createDefaultGachaState, getGachaActivePoolTag, getGachaFortuneProgressView, canDeleteGachaPoolDefinition, serializeGachaCatalogItemForExport, runInSaveQueue, touchGachaActivity, recordGachaFortuneGain, assertSaveStoredGachaStateSnapshot, refreshGachaVisualization, emitEvent, getRuntimeGachaRawData, ensureGachaCatalogLoaded, analyzeGachaCatalogImport, getGachaCatalogImportFailureMessage, applyGachaCatalogImport, refreshGachaShardShop, showGachaSettingsDialog, formatGachaCatalogImportStatsText, normalizeGachaPoolDefinition, GACHA_ALL_POOL_TAG, getConfiguredGachaPoolDefinitions, buildDefaultGachaPoolDefinition, isBuiltinGachaPoolId, saveGachaPoolSettings, getCustomGachaItemDefinitions, saveStoredGachaCatalog, deleteGachaItemSetting, normalizeGachaPoolId, deleteGachaPoolConfig, showDiceSystemConfirmDialog, performGachaDraw, getVisibleGachaPoolConfigDefinitions, updateGachaPoolTag, getAllGachaPoolConfigDefinitions, getAllGachaItemDefinitions, getActiveGachaPoolTags, isGachaItemEnabled, compareGachaItemDefinitionsForDisplay, exportGachaCatalogJson, showGachaVisualization, closeGachaVisualization, showGachaShardShop, rootWindow, getRuntimeErrorMessage, getCore });

  // [接线] 为已拆分的 presets/advanced-dice-preset-ui.ts 注入 IIFE 内的 getCore/Store/getConfig/pushModal/getTutorialButtonHtml/bindTutorialButtonsIn/popModal/downloadJsonFile/showDiceSystemConfirmDialog/readTextFile/clearModalStack/parseJsoncRecord/downloadAiPromptFile/validateJsoncEditorConfig（避免循环 import）
  __wireAdvancedDicePresetUiDeps({ getCore, Store, getConfig, pushModal, getTutorialButtonHtml, bindTutorialButtonsIn, popModal, downloadJsonFile, showDiceSystemConfirmDialog, readTextFile, clearModalStack, parseJsoncRecord, downloadAiPromptFile, validateJsoncEditorConfig });

  // [接线] 为已拆分的 api.ts 注入 IIFE 内的 getConfig/getTableData/processJsonData/DashboardDataParser/applyDiceProfile/bindTutorialButtonsIn/buildCheckValueText/detectCharacterDiceProfile/exportDiceProfile/getAttributeEntryForCharacter/getAttributeValue/getDiceProfileCharacterContext/getDiceProfilePromptState/getFullAttributesForCharacter/getNamedCheckParamText/getSuccessLevel/getTutorialButtonHtml/importDiceProfile/refreshDiceProfileIndex/resolveQuickSelectTarget/saveCurrentDiceProfile/settleGachaFortuneForDiceEvent/showDiceSystemConfirmDialog/toDiceProfileSummary（避免循环 import）；
  //   cachedRawData 为 IIFE 内运行时可变 let，注入读取回调 getCachedRawData: () => cachedRawData 实时取值
  __wireAcuDiceApiDeps({ DashboardDataParser, applyDiceProfile, bindTutorialButtonsIn, buildCheckValueText, detectCharacterDiceProfile, exportDiceProfile, getAttributeEntryForCharacter, getAttributeValue, getCachedRawData: () => cachedRawData, getConfig, getDiceProfileCharacterContext, getDiceProfilePromptState, getFullAttributesForCharacter, getNamedCheckParamText, getSuccessLevel, getTableData, getTutorialButtonHtml, importDiceProfile, processJsonData, refreshDiceProfileIndex, resolveQuickSelectTarget, saveCurrentDiceProfile, settleGachaFortuneForDiceEvent, showDiceSystemConfirmDialog, toDiceProfileSummary });

  // [接线] 为已拆分的 init.ts 注入 IIFE 内的 UpdateController/_boundRenderHandler/_boundReviewBaselineHandler/addStyles/ensureGachaHeartbeat/getActiveTabState/getConfig/getCore/getTutorialModule/hasRuntimeTableReadApi/isFloatingCollapseActive/isInitialized/renderInterface/saveCurrentDatabaseSnapshotAsReviewBaseline/scheduleCharacterDiceProfileDetection/settleGachaFortuneForMessage（避免循环 import）；
  // [接线] 共享 let 状态操作回调（批次6模式）：observer/gachaHeartbeatTimer/gachaShopUiRefreshTimer/cachedRawData/tablePageStates/tableSearchStates/tableScrollStates/hasUnsavedChanges/currentDiffMap/optionPanelVisible/isEditingOrder
  //   等 let 状态单元保留 IIFE 内（ESM import 绑定只读），init.ts 经以下回调读写，避免模块本地副本与 IIFE 状态分叉
  const getObserver = () => observer;
  const setObserver = (obs: MutationObserver | null) => {
    observer = obs;
  };
  const disconnectObserver = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };
  const getIsEditingOrder = () => isEditingOrder;
  const setOptionPanelVisible = (visible: boolean) => {
    optionPanelVisible = visible;
  };
  const resetAcuDiceChatChangeState = () => {
    cachedRawData = null;
    tablePageStates = {};
    tableSearchStates = {};
    tableScrollStates = {};
    hasUnsavedChanges = false;
    currentDiffMap.clear();
  };
  const runAcuDiceUnloadCleanup = () => {
    void flushGachaHeartbeatProgress(true);
    if (gachaHeartbeatTimer) {
      clearInterval(gachaHeartbeatTimer);
      gachaHeartbeatTimer = null;
    }
    if (gachaShopUiRefreshTimer) {
      clearInterval(gachaShopUiRefreshTimer);
      gachaShopUiRefreshTimer = null;
    }
    // 取消所有挂起的异步请求
    abortAllPendingRequests();
    const timer = (window as Record<string, unknown>).__acuEffectRunCleanerTimer;
    if (typeof timer === 'number') {
      window.clearInterval(timer);
      delete (window as Record<string, unknown>).__acuEffectRunCleanerTimer;
    }
    localStorage.setItem(STORAGE_KEY_SCROLL, JSON.stringify(tableScrollStates));
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  __wireAcuDiceInitDeps({ UpdateController, _boundRenderHandler, _boundReviewBaselineHandler, addStyles, ensureGachaHeartbeat, getActiveTabState, getConfig, getCore, getTutorialModule, hasRuntimeTableReadApi, isFloatingCollapseActive, isInitialized, renderInterface, saveCurrentDatabaseSnapshotAsReviewBaseline, scheduleCharacterDiceProfileDetection, settleGachaFortuneForMessage, getIsEditingOrder, getObserver, setObserver, disconnectObserver, setOptionPanelVisible, resetAcuDiceChatChangeState, runAcuDiceUnloadCleanup });

  // [接线] 为已拆分的 settings/dice-settings.ts 注入 IIFE 内的 42 个稳定依赖（getCore/Store/loadSnapshot/renderInterface/GachaCatalogDB/showDiceSystemConfirmDialog/getRuntimeGachaRawData/getTavernHostDocument/getTavernHostWindow/cloneGachaCatalogItems/downloadJsonFile/showDiceSystemInputDialog/normalizeGachaCatalogRecord/migrateGachaCatalogRecordsToGlobalScope/parseJsoncDocument/GACHA_ALL_POOL_TAG/FONTS/saveSnapshot/normalizeGachaPoolDefinition/buildDefaultGachaPoolDefinition/isBuiltinGachaPoolId/normalizeGachaItemEnabled/normalizeGachaItemOrder/normalizeImportedGachaItem/isGachaItemEnabled/validateGachaCatalogImportItemTarget/mergeGachaCatalogRecordsToGlobalScope/createEmptyGachaCatalog/ensureGachaPoolsForTags/refreshGachaVisualization/refreshGachaShardShop/showGachaSettingsDialog/DashboardPresetManager/DEFAULT_GM_CONFIG/DEFAULT_CONFIG/normalizeCollapseStyle/getNavigationFontMetrics/collectHostAndLocalNodes/getPendingDeletions/DASHBOARD_DEFAULT_PRESET_ID/syncInventoryMetadataForRawData/pickTextFile，避免循环 import）；
  // [接线] 共享 let 状态读写回调（批次6/10模式）：cachedRawData/isSaving/saveQueue/hasUnsavedChanges/currentDiffMap/isSettingsOpen/dashboardRuntimeConfigCache
  //   等 let 状态单元保留 IIFE 内（ESM import 绑定只读），dice-settings.ts 经以下回调读写，避免模块本地副本与 IIFE 状态分叉；
  //   gachaCatalogCache/gachaCatalogLoadTask 声明随批次13（idx 45）迁出至 favorites/legacy-favorites-panel.ts，下方回调删除、
  //   改由模块导出的 getGachaCatalogCache/setGachaCatalogCache/getGachaCatalogLoadTask/setGachaCatalogLoadTask 直连 import 提供（__wireDiceSettingsDeps 接线不变）
  const getCachedRawData = () => cachedRawData;
  const setCachedRawData = (value: unknown) => { cachedRawData = value; };
  const getIsSaving = () => isSaving;
  const setIsSaving = (value: boolean) => { isSaving = value; };
  const getSaveQueue = () => saveQueue;
  const setSaveQueue = (value: Promise<void>) => { saveQueue = value; };
  const getHasUnsavedChanges = () => hasUnsavedChanges;
  const setHasUnsavedChanges = (value: boolean) => { hasUnsavedChanges = value; };
  const getCurrentDiffMap = () => currentDiffMap;
  const setCurrentDiffMap = (value: Set<unknown>) => { currentDiffMap = value; };
  const getIsSettingsOpen = () => isSettingsOpen;
  const setIsSettingsOpen = (value: boolean) => { isSettingsOpen = value; };
  const getDashboardRuntimeConfigCache = () => dashboardRuntimeConfigCache;
  const setDashboardRuntimeConfigCache = (value: unknown) => { dashboardRuntimeConfigCache = value; };

  __wireDiceSettingsDeps({ DASHBOARD_DEFAULT_PRESET_ID, DEFAULT_CONFIG, DEFAULT_GM_CONFIG, FONTS, GACHA_ALL_POOL_TAG, GachaCatalogDB, Store, buildDefaultGachaPoolDefinition, cloneGachaCatalogItems, collectHostAndLocalNodes, createEmptyGachaCatalog, DashboardPresetManager, downloadJsonFile, ensureGachaPoolsForTags, getCore, getNavigationFontMetrics, getPendingDeletions, getRuntimeGachaRawData, getTavernHostDocument, getTavernHostWindow, isBuiltinGachaPoolId, isGachaItemEnabled, loadSnapshot, mergeGachaCatalogRecordsToGlobalScope, migrateGachaCatalogRecordsToGlobalScope, normalizeCollapseStyle, normalizeGachaCatalogRecord, normalizeGachaItemEnabled, normalizeGachaItemOrder, normalizeGachaPoolDefinition, normalizeImportedGachaItem, parseJsoncDocument, pickTextFile, refreshGachaShardShop, refreshGachaVisualization, renderInterface, saveSnapshot, showDiceSystemConfirmDialog, showDiceSystemInputDialog, showGachaSettingsDialog, syncInventoryMetadataForRawData, validateGachaCatalogImportItemTarget, getCachedRawData, setCachedRawData, getIsSaving, setIsSaving, getSaveQueue, setSaveQueue, getHasUnsavedChanges, setHasUnsavedChanges, getCurrentDiffMap, setCurrentDiffMap, getIsSettingsOpen, setIsSettingsOpen, getGachaCatalogCache, setGachaCatalogCache, getGachaCatalogLoadTask, setGachaCatalogLoadTask, getDashboardRuntimeConfigCache, setDashboardRuntimeConfigCache });
  // [接线] 为已拆分的 dashboard/dashboard.ts 注入 IIFE 内的 6 个 idx 45 渲染刷新函数（renderInterface/renderGlobalInteractionsPanel/bindGlobalInteractionEvents/renderDashboard/bindEvents/loadDashboardNpcAvatars，避免循环 import）；
  // [接线] 共享 let 状态读写回调（批次6/10/11模式）：cachedRawData/hasUnsavedChanges/dashboardRuntimeConfigCache 复用批次 11 回调（get/set），
  //   cleanupGlobalInteractionOutsideCapture 为新增回调（声明保留 IIFE 内，idx 45 直接赋值，dashboard.ts 经回调读写）
  const getCleanupGlobalInteractionOutsideCapture = () => cleanupGlobalInteractionOutsideCapture;
  const setCleanupGlobalInteractionOutsideCapture = (value: (() => void) | null) => { cleanupGlobalInteractionOutsideCapture = value; };

  __wireDashboardDeps({ renderInterface, renderGlobalInteractionsPanel, bindGlobalInteractionEvents, renderDashboard, bindEvents, loadDashboardNpcAvatars, getCachedRawData, setCachedRawData, getHasUnsavedChanges, setHasUnsavedChanges, getDashboardRuntimeConfigCache, setDashboardRuntimeConfigCache, getCleanupGlobalInteractionOutsideCapture, setCleanupGlobalInteractionOutsideCapture });
  // [接线] 共享 let 状态读写回调（批次13 新增）：isEditingOrder 补 set、optionPanelVisible 补 get，
  //   isAutoTransforming/tablePageStates/tableSearchStates/tableScrollStates/lastOptionHash/gachaHeartbeatTimer/gachaShopUiRefreshTimer/
  //   gachaShopRootElement/tutorialButtonEventsBound 为 legacy-favorites-panel.ts 新增读写回调（声明保留 IIFE 内）
  const setIsEditingOrder = (value: boolean) => { isEditingOrder = value; };
  const getOptionPanelVisible = () => optionPanelVisible;
  const getIsAutoTransforming = () => isAutoTransforming;
  const setIsAutoTransforming = (value: boolean) => { isAutoTransforming = value; };
  const getTablePageStates = () => tablePageStates;
  const setTablePageStates = (value: unknown) => { tablePageStates = value; };
  const getTableSearchStates = () => tableSearchStates;
  const setTableSearchStates = (value: unknown) => { tableSearchStates = value; };
  const getTableScrollStates = () => tableScrollStates;
  const setTableScrollStates = (value: unknown) => { tableScrollStates = value; };
  const getLastOptionHash = () => lastOptionHash;
  const setLastOptionHash = (value: unknown) => { lastOptionHash = value; };
  const getGachaHeartbeatTimer = () => gachaHeartbeatTimer;
  const setGachaHeartbeatTimer = (value: ReturnType<typeof setInterval> | null) => { gachaHeartbeatTimer = value; };
  const getGachaShopUiRefreshTimer = () => gachaShopUiRefreshTimer;
  const setGachaShopUiRefreshTimer = (value: ReturnType<typeof setInterval> | null) => { gachaShopUiRefreshTimer = value; };
  const getGachaShopRootElement = () => gachaShopRootElement;
  const setGachaShopRootElement = (value: HTMLElement | null) => { gachaShopRootElement = value; };
  const getTutorialButtonEventsBound = () => tutorialButtonEventsBound;
  const setTutorialButtonEventsBound = (value: boolean) => { tutorialButtonEventsBound = value; };

  // [接线] 为已拆分的 favorites/legacy-favorites-panel.ts 注入 IIFE 内共享 let 状态的 35 个读写回调（避免循环 import）
  __wireLegacyFavoritesPanelDeps({ getCachedRawData, setCachedRawData, getHasUnsavedChanges, setHasUnsavedChanges, getCurrentDiffMap, setCurrentDiffMap, getIsSaving, setIsSaving, getIsSettingsOpen, setIsSettingsOpen, getIsEditingOrder, setIsEditingOrder, getObserver, setObserver, getIsAutoTransforming, setIsAutoTransforming, getTablePageStates, setTablePageStates, getTableSearchStates, setTableSearchStates, getTableScrollStates, setTableScrollStates, getLastOptionHash, setLastOptionHash, getOptionPanelVisible, setOptionPanelVisible, getGachaHeartbeatTimer, setGachaHeartbeatTimer, getGachaShopUiRefreshTimer, setGachaShopUiRefreshTimer, getGachaShopRootElement, setGachaShopRootElement, getTutorialButtonEventsBound, setTutorialButtonEventsBound, setCleanupGlobalInteractionOutsideCapture });
})();
