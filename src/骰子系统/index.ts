// @ts-nocheck
import { ELEMENT_EMOJI_MAP, LOCATION_EMOJI_MAP, RELATION_ICON_MAP } from './shared/emoji-maps';
import { MAIN_STYLES } from './shared/styles';
import { setDatabaseToastMute } from './shared/database-toast-mute';
import { showActionableErrorToast } from './shared/actionable-error-toast';
import { TUTORIAL_SCOPE_LIST, createTutorialModule, type TutorialModule, type TutorialScope } from './features/tutorial';
import { createDialogueIndentRenderer, normalizeDialogueIndentStrategy } from './features/dialogue-indent-renderer';
import { RollResult, CustomFieldConfig, DerivedVarSpec, DiceExprPatch } from './shared/types';
import { rollDiceExpression, rollComplexDiceExpression } from './features/dice/dice-engine';
import { AcuDiceEvents } from './features/api/events';
import { AcuDiceHistory } from './features/api/history';
import { AcuDiceReadyState } from './features/api/ready';
import { AcuDicePresets } from './features/api/presets';
import { AcuDiceCharacters } from './features/api/characters';
import { AcuDiceRoll } from './features/api/roll';
import { AcuDiceProfiles } from './features/api/profiles';
import { AcuDiceCheck } from './features/api/check';
import { AcuDiceContest } from './features/api/contest';
import { createAcuDiceGachaApi } from './features/api/gacha';
import { GachaRegexActions } from './features/gacha/gacha-regex-actions';
import { createAvatarManager } from './entities/avatar-manager';
import { LocalAvatarDB } from './entities/local-avatar-db';
import { FavoritesDB } from './shared/storage/favorites-db';
import { CustomTableNameIconImageDB } from './shared/storage/custom-table-name-icon-image-db';
import { DiceProfileDB } from './shared/storage/dice-profile-db';
import { Store, STORAGE_KEY_LAST_SNAPSHOT } from './shared/storage/store';
import { FavoritesManager } from './features/favorites/favorites-manager';
import { createDashboardDataParser } from './features/dashboard/dashboard-data-parser';
import { createDiceHistoryStatsDB } from './features/history/dice-history-stats-db';
import { createBookmarkManager } from './features/bookmarks/bookmark-manager';
import { createUpdateController } from './features/validation/update-controller';
import { createValidationRuleManager } from './features/validation/validation-rule-manager';
import { createValidationEngine } from './features/validation/validation-engine';
import { createPresetManager } from './features/presets/preset-manager';
import { createRegexPresetManager } from './features/presets/regex-preset-manager';
import { createRegexTransformationManager } from './features/regex/regex-transformation-manager';
import { createRegexTransformationEngine } from './features/regex/regex-transformation-engine';
import { createErrorHandler } from './features/console/error-handler';
import { createAdvancedDicePresetManager } from './features/presets/advanced-dice-preset-manager';
import { createRenderPresetManager } from './features/presets/render-preset-manager';
import { createAttributePresetManager } from './features/presets/attribute-preset-manager';
import { createTableTemplateRequirementPresetManager } from './features/presets/table-template-requirement-preset-manager';
import { createActionPresetManager } from './features/presets/action-preset-manager';
import { createDashboardPresetManager } from './features/presets/dashboard-preset-manager';
import { createCustomTableNameIconStoreManager } from './shared/storage/custom-table-name-icon-store-manager';
import { createMvuModule } from './features/mvu/mvu-module';
import { createEvaluateCondition } from './features/dice/evaluate-condition';
import { createExecuteEffects } from './features/effects/execute-effects';
import { createSmartInsertToTextarea } from './features/textarea/smart-insert';
import { createHideDiceResultsInUserMessages } from './features/textarea/hide-dice-results';
import { createSortableListFactory } from './shared/ui/sortable-list';
import { createLoadDashboardNpcAvatars } from './features/dashboard/load-npc-avatars';
import { createShowConflictDialog } from './shared/ui/conflict-dialog';
import { createShowPresetListDialog } from './features/presets/preset-list-dialog';
import { createShowAttributePresetManager } from './features/presets/attribute-preset-manager-dialog';
import { createShowAttributePresetEditor } from './features/presets/attribute-preset-editor-dialog';
import { createShowAdvancedPresetManager } from './features/presets/advanced-preset-manager-dialog';
import { createShowAdvancedPresetEditor } from './features/presets/advanced-preset-editor-dialog';
import { createShowActionPresetManager } from './features/presets/action-preset-manager-dialog';
import { createShowActionPresetEditor } from './features/presets/action-preset-editor-dialog';
import { createShowDashboardPresetManager } from './features/presets/dashboard-preset-manager-dialog';
import { createShowDashboardPresetEditor } from './features/presets/dashboard-preset-editor-dialog';
import { createShowRenderPresetManager } from './features/presets/render-preset-manager-dialog';
import { createShowRenderPresetEditor } from './features/presets/render-preset-editor-dialog';
import { createShowDebugConsoleModal } from './features/console/debug-console-dialog';
import { createShowGlobalDiceHistoryDialog } from './features/history/dice-history-dialog';
import { createShowAddValidationRuleModal } from './features/validation/add-validation-rule-dialog';
import { createShowSmartFixModal } from './features/validation/smart-fix-dialog';
import { createShowTableRuleFixModal } from './features/validation/table-rule-fix-dialog';
import { createShowFavoritesPanel } from './features/favorites/favorites-panel';
import { createBindFavoritesEvents } from './features/favorites/favorites-events';
import { createBuildMapViewModel } from './features/map/map-view-model';
import { createShowMapVisualization } from './features/map/map-visualization';
import { createShowGachaCatalogClearDialog } from './features/gacha/gacha-catalog-clear-dialog';
import { createShowGachaPickupItemDetail } from './features/gacha/gacha-pickup-item-detail';
import { createShowGachaPoolNameDialog } from './features/gacha/gacha-pool-name-dialog';
import { createShowGachaConfirmDialog } from './features/gacha/gacha-confirm-dialog';
import { createShowGachaSettingsDialog } from './features/gacha/gacha-settings-dialog';
import { createShowGachaItemEditorDialog } from './features/gacha/gacha-item-editor-dialog';
import { createShowGachaCatalogImportConfirm } from './features/gacha/gacha-catalog-import-confirm';
import { createShowGachaSaveError } from './features/gacha/gacha-save-error';
import { createShowGachaRecentRewardDetail } from './features/gacha/gacha-recent-reward-detail';
import { createShowGachaShardShop } from './features/gacha/gacha-shard-shop';
import { createShowGachaShardExchangeConfirm } from './features/gacha/gacha-shard-exchange-confirm';
import { createShowGachaVisualization } from './features/gacha/gacha-visualization';
import { createShowCustomTableNameIconManager } from './features/table/custom-icon-manager-dialog';
import { createInitSortable } from './shared/ui/init-sortable';
import { createInferAvatarImageColor } from './features/avatar/infer-avatar-image-color';
import { createShowPresetConflictDialog } from './features/presets/show-preset-conflict-dialog';
import { createBuildNewAttributePresetJsoncTemplate } from './features/presets/build-new-attribute-preset-jsonc-template';
import { createRenderDiceProfileApplyConfirmDetailHtml } from './features/dice/render-dice-profile-apply-confirm-detail-html';
import { createRenderGlobalInteractionsPanel } from './features/interactions/render-global-interactions-panel';
import { createApplyAsyncImageUrlToElement } from './features/avatar/apply-async-image-url-to-element';
import { createFindRowIndexByPrimaryKey } from './features/table/find-row-index-by-primary-key';
import { createNormalizeImportedGachaPools } from './features/gacha/normalize-imported-gacha-pools';
import { createNormalizeDiceConfigBackupGachaCatalogItems } from './features/dice/normalize-dice-config-backup-gacha-catalog-items';
import { createRenderGachaPoolSettingsListHtml } from './features/gacha/render-gacha-pool-settings-list-html';
import { createBuildRelationshipGraphTableFromPreset } from './features/table/build-relationship-graph-table-from-preset';
import { createResolveCustomTableNameIcon } from './features/table/resolve-custom-table-name-icon';
import { createCollectAccessibleRuntimeWindows } from './features/ui/collect-accessible-runtime-windows';
import { createMergeDiceConfigBackupGachaCatalogItems } from './features/dice/merge-dice-config-backup-gacha-catalog-items';
import { createBuildDiceConfigBackup } from './features/dice/build-dice-config-backup';
import { createNormalizeDashboardRelationshipGraphConfig } from './features/dashboard/normalize-dashboard-relationship-graph-config';
import { createGetDiceStatsContext } from './features/dice/get-dice-stats-context';
import { createAppendRowInstantly } from './features/table/append-row-instantly';
import { createGetGachaFortuneProgressView } from './features/gacha/get-gacha-fortune-progress-view';
import { createCollectDashboardNpcEntriesFromTableResult } from './features/dashboard/collect-dashboard-npc-entries-from-table-result';
import { createStripJsonComments } from './shared/strip-json-comments';
import { createFindCharacterAttributeRow } from './features/dice/find-character-attribute-row';
import { createPrepareCrudRowIdForUpdateCell } from './features/table/prepare-crud-row-id-for-update-cell';
import { createSyncDiceConfigBackupRuntimeAfterRestore } from './features/dice/sync-dice-config-backup-runtime-after-restore';
import { createUpdateFloatingCollapseBounds } from './features/layout/update-floating-collapse-bounds';
import { createChangeAcuDiceGachaFortune } from './features/gacha/change-acu-dice-gacha-fortune';
import { createCreateRenderPresetEditorTemplate } from './features/presets/create-render-preset-editor-template';
import { createCreateDashboardPresetEditorTemplate } from './features/dashboard/create-dashboard-preset-editor-template';
import { createBuildNewAdvancedPresetJsoncTemplate } from './features/presets/build-new-advanced-preset-jsonc-template';
import { createMergeDiceConfigBackupPresetArray } from './features/dice/merge-dice-config-backup-preset-array';
import { createValidateAdvancedPresetContestRule } from './features/presets/validate-advanced-preset-contest-rule';
import { createValidateAdvancedPresetOutcomePolicy } from './features/presets/validate-advanced-preset-outcome-policy';
import { createValidateAdvancedPresetOutcomes } from './features/presets/validate-advanced-preset-outcomes';
import { createBuildAdvancedPresetEvaluationContext } from './features/presets/build-advanced-preset-evaluation-context';
import { createNormalizeDashboardPresetFilters } from './features/dashboard/normalize-dashboard-preset-filters';
import { createGetDashboardRuntimeConfig } from './features/dashboard/get-dashboard-runtime-config';
import { createRestoreDiceConfigBackupGachaCatalogRecords } from './features/dice/restore-dice-config-backup-gacha-catalog-records';
import { createGetDiceConfigBackupModuleResourceShapeWarnings } from './features/dice/get-dice-config-backup-module-resource-shape-warnings';
import { createCountRuntimeDataChanges } from './features/table/count-runtime-data-changes';
import { createParseCheckSuggestionCommand } from './features/checks/parse-check-suggestion-command';
import { createExecuteCheckSuggestionCommand } from './features/checks/execute-check-suggestion-command';
import { createBuildCheckSuggestionPresetSide } from './features/checks/build-check-suggestion-preset-side';
import { createResolveCheckSuggestionContestWinner } from './features/checks/resolve-check-suggestion-contest-winner';
import { createExecuteAdvancedContestCheckSuggestion } from './features/checks/execute-advanced-contest-check-suggestion';
import { createShowDiceSystemInputDialog } from './features/ui/show-dice-system-input-dialog';
import { createShowCardEditModal } from './features/table/show-card-edit-modal';
import { createShowFavoriteEditModal } from './features/favorites/show-favorite-edit-modal';
import { createShowDiceSystemConfirmDialog } from './features/ui/show-dice-system-confirm-dialog';
import { createShowManualUpdateDialog } from './features/ui/show-manual-update-dialog';
import { createExecuteTableInteractionAction } from './features/table/execute-table-interaction-action';
import { createNormalizeImportedGachaItem } from './features/gacha/normalize-imported-gacha-item';
import { createShowAvatarManager } from './features/avatar/show-avatar-manager';
import { createExecuteSecondaryEffectsChain } from './features/effects/execute-secondary-effects-chain';
import { createRenderGachaSettingsPoolItemsHtml } from './features/gacha/render-gacha-settings-pool-items-html';
import { createBuildGachaCatalogTemplateJsonc } from './features/gacha/build-gacha-catalog-template-jsonc';
import { createApplyGachaCatalogImport } from './features/gacha/apply-gacha-catalog-import';
import { createInferEquipmentTableTypeForGachaItem } from './features/gacha/infer-equipment-table-type';
import { createBindFloatingCollapseDrag } from './features/layout/bind-floating-collapse-drag';
import { createFindTemplateRequirementSheet } from './features/table/find-template-requirement-sheet';
import { createInspectTableTemplate } from './features/table/inspect-table-template';
import { createRepairCurrentTableTemplateFromPreset } from './features/table/repair-current-table-template-from-preset';
import { createNormalizeDashboardPresetModules } from './features/dashboard/normalize-dashboard-preset-modules';
import { createRelocateDbPayloadToAnchor } from './features/console/relocate-db-payload-to-anchor';
import { createBuildNewTableTemplateRequirementPresetJsoncTemplate } from './features/table/build-new-table-template-requirement-preset-jsonc-template';
import { createGetCustomTableNameIconManagerCandidates } from './features/table/get-custom-table-name-icon-manager-candidates';
import { createAnalyzeCustomTableNameIconPackImport } from './features/table/analyze-custom-table-name-icon-pack-import';
import { createResolveCustomTableNameIconRowName } from './features/table/resolve-custom-table-name-icon-row-name';
import { createShowTableTemplateRequirementPresetManager } from './features/table/show-table-template-requirement-preset-manager';
import { createShowTableTemplateRequirementPresetEditor } from './features/table/show-table-template-requirement-preset-editor';
import { createRenderDataCardCellContent } from './features/table/render-data-card-cell-content';
import { createApplyExistingRowCellPatchesViaCrud } from './features/table/apply-existing-row-cell-patches-via-crud';
import { createMergeDiceConfigBackupCustomOnlyPresetArray } from './features/dice/merge-dice-config-backup-custom-only-preset-array';
import { createNormalizeRenderPresetRules } from './features/presets/normalize-render-preset-rules';
import { createMergeDiceConfigBackupPresetArraySafely } from './features/dice/merge-dice-config-backup-preset-array-safely';
import { createDeleteGachaPoolConfig } from './features/gacha/delete-gacha-pool-config';
import { createAcuDiceAPI } from './features/api/public-api';
import { createUpdateTemplateForActivePreset } from './features/presets/update-template-for-active-preset';
import { createShowTemplateInspectionResultModal } from './features/table/show-template-inspection-result-modal';
import { createUpdateTemplateForActiveCheckPreset } from './features/presets/update-template-for-active-check-preset';
import { createApplyDiceConfigBackup } from './features/dice/apply-dice-config-backup';
import { createApplyDiceConfigBackupValue } from './features/dice/apply-dice-config-backup-value';
import { createWriteAttributesToCharacter } from './features/dice/write-attributes-to-character';
import { createParseDiceConfigBackup } from './features/dice/parse-dice-config-backup';
import { createBindGlobalInteractionEvents } from './features/interactions/bind-global-interaction-events';
import { createShowDiceConfigBackupDialog } from './features/dice/show-dice-config-backup-dialog';
import { createShowInventoryDetailMenu } from './features/table/show-inventory-detail-menu';
import { createRenderFavoritesPanel } from './features/favorites/render-favorites-panel';
import { createShowSendToTableModal } from './features/favorites/show-send-to-table-modal';
import { createMergeGachaCatalogRecordsToGlobalScope } from './features/gacha/merge-gacha-catalog-records';
import { createGetTavernHostWindow } from './shared/tavern-host';
import { createSendChatTextAndTrigger } from './features/chat/send-chat-text';
import { createSaveRowInstantly } from './features/table/save-row-instantly';
import { createRenderDiceProfileManagerBody } from './features/dice/render-dice-profile-manager-body';
import { createShowTagInputModal } from './features/favorites/show-tag-input-modal';
import { createShowNewFavoriteModal } from './features/favorites/show-new-favorite-modal';
import { createGetDiceProfileCurrentCharacterRecords } from './features/dice/get-dice-profile-current-character-records';
import { createStripCrudSqlComments } from './shared/strip-crud-sql-comments';
import { createStripCrudSqlBlockComments } from './shared/strip-crud-sql-block-comments';
import { createCloneRenderPresetRules } from './features/presets/clone-render-preset-rules';
import { createBindCompositionSafeSearchInput } from './shared/ui/bind-composition-safe-search-input';
import { createRenderInterfaceImpl } from './features/render/render-interface-impl';
import { createInit } from './app/init';
import { createBindEvents } from './features/events/bind-events';
import { createShowDicePanel } from './features/dice/show-dice-panel';
import { createShowSettingsModal } from './features/settings/show-settings-modal';
import { createShowContestPanel } from './features/dice/show-contest-panel';
import { createShowRelationshipGraph } from './features/table/show-relationship-graph';
import { createBindChangesEvents } from './features/changes/bind-changes-events';
import { createShowCellMenu } from './features/table/show-cell-menu';
import { createRenderChangesPanel } from './features/changes/render-changes-panel';
import { createRenderTableContent } from './features/table/render-table-content';
import { createRenderDashboard } from './features/dashboard/render-dashboard';
import { createInitCustomDropdown } from './features/ui/init-custom-dropdown';
import { createApplyConfigStyles } from './features/ui/apply-config-styles';
import { createGetRandomSkillPool } from './features/dice/get-random-skill-pool';
import { createDetectVisualizerConflict } from './features/ui/detect-visualizer-conflict';
import { createGenerateRPGAttributes } from './features/dice/generate-rpg-attributes';
import { createSaveDataToDatabase } from './features/table/save-data-to-database';
import { createBindOptionEvents } from './features/ui/bind-option-events';
import { createInterceptTextareaValue } from './features/textarea/intercept-textarea-value';
import { createGenerateDiffMap } from './features/changes/generate-diff-map';
import { createClearPresetAttributesForCharacter } from './features/dice/clear-preset-attributes';
import { createSelectCrazyParticipant } from './features/dice/select-crazy-participant';
import { createInjectIndependentOptions } from './features/ui/inject-independent-options';
import { createEvaluateFormula } from './features/dice/evaluate-formula';
import { createDismantleInventoryItem } from './features/table/dismantle-inventory-item';
import { createParseEquipmentItems } from './features/table/parse-equipment-items';
import { createParseInventoryItems } from './features/table/parse-inventory-items';
import { createHandleInventoryAction } from './features/table/handle-inventory-action';
import { createSaveInventoryFieldValue } from './features/table/save-inventory-field-value';
import { createGetInteractOptionsForRow } from './features/table/get-interact-options-for-row';
import { createExchangeGachaShardItem } from './features/gacha/exchange-gacha-shard-item';
import { createShowInventoryMetaEditDialog } from './features/table/inventory-meta-edit-dialog';
import { createExecuteNormalCheckSuggestion } from './features/checks/execute-normal-check-suggestion';
import { createRefreshRegexRulesList } from './features/regex/refresh-regex-rules-list';
import { createRenderGachaShardShopHtml } from './features/gacha/render-shard-shop-html';
import { createRenderGachaPanelHtml } from './features/gacha/render-gacha-panel-html';
import { createPerformGachaDraw } from './features/gacha/perform-gacha-draw';
import { createGenerateCrazyRoll } from './features/dice/generate-crazy-roll';
import { createCrazyRollWithPreset } from './features/dice/crazy-roll-with-preset';
import { createRenderOptionTableContent } from './features/table/render-option-table-content';
import { createRenderCheckSuggestionTableContent } from './features/table/render-check-suggestion-table-content';
import { createApplySheetDataViaCrud } from './features/table/sheet-data-crud';
import { createInsertHtmlToPage } from './features/ui/insert-html-to-page';
import { createShowDiceSettingsPanel } from './features/dice/dice-settings-panel';
import { createShowAddRegexRuleModal } from './features/regex/add-regex-rule-dialog';
import { createShowAvatarCropModal } from './features/avatar/avatar-crop-modal';
import { createShowImportConfirmDialog } from './features/table/import-confirm-dialog';
import { createUpdateViewportWrapperBounds } from './features/layout/viewport-wrapper-bounds';
import { createUpdateFixedWrapperBounds } from './features/layout/fixed-wrapper-bounds';
import { createExecuteAdvancedCheckSuggestion } from './features/checks/execute-advanced-check-suggestion';
import { createExecuteContestCheckSuggestion } from './features/checks/execute-contest-check-suggestion';
import { createShowInventoryGiftDialog } from './features/table/inventory-gift-dialog';
import { createRenderInventoryVisualization } from './features/table/inventory-visualization';
import { createShowInventoryItemDetail } from './features/table/inventory-item-detail';
import { createShowInventoryFieldEditDialog } from './features/table/inventory-field-edit-dialog';
import { createShowChangeEditModal } from './features/changes/change-edit-modal';
import { createShowRowCompareEditModal } from './features/changes/row-compare-edit-modal';
import { createShowChangeSingleFieldModal } from './features/changes/change-single-field-modal';
import { createToggleOrderEditMode } from './features/ui/toggle-order-edit-mode';
import { DEFAULT_GM_CONFIG, DEFAULT_CONFIG, DEFAULT_DICE_CONFIG, DEFAULT_VIRTUAL_PRESET, DEFAULT_CRAZY_MODE_CONFIG, DEFAULT_SPECIAL_ATTR_TEMPLATE, RULE_TYPE_INFO, INVENTORY_QUALITY_ORDER } from './shared/defaults-config';
import { computeEffectVariables, computePendingEffectVariables, parseEffectValueInput, buildEffectMetaLines, buildEffectTraceLines } from './shared/effect-math';
import { alignAndFixPairedTables, isValueInRelationTable, getRelationOptions, getColumnExamples, getRowKey, getNearestValidNumber, extractCodesFromTable, buildCodeMapping } from './shared/table-utils';
import { ConsoleCaptureManager } from './features/console/console-capture-manager';
import { suggestFormatValue, parseTavernFindRegex, getDbLockAPI } from './shared/misc-utils';
import {
  NameAliasRegistryCore,
  parseCharacterName,
  getDisplayName,
  findNameColumnIndex,
  findExplicitAttributeTableNameColumnIndex,
  getRowDisplayName,
  isCharacterTable,
  CHARACTER_NAME_COLUMN_KEYS,
  ATTRIBUTE_TABLE_NAME_COLUMN_KEYS,
} from './entities/name-alias';
import {
  SCRIPT_ID,
  DICE_ROOT_CLASS,
  DICE_ROOT_SELECTOR,
  HOST_REGENERATE_HIDDEN_CLASS,
  HOST_REGENERATE_BUTTON_SELECTOR,
  PRIMARY_KEYS,
  PRESET_FORMAT_VERSION,
  SCRIPT_VERSION,
  isNpcTableName,
} from './shared/constants';
import advancedPresetAgentPromptTemplate from './docs/advanced-preset-agent-prompt.md?raw';
import dashboardPresetAgentPromptTemplate from './docs/dashboard-preset-agent-prompt.md?raw';
import attributePresetAgentPromptTemplate from './docs/attribute-preset-agent-prompt.md?raw';
import actionPresetAgentPromptTemplate from './docs/action-preset-agent-prompt.md?raw';
import renderPresetAgentPromptTemplate from './docs/render-preset-agent-prompt.md?raw';
import gachaCatalogAgentPromptTemplate from './docs/gacha-catalog-agent-prompt.md?raw';
import tableTemplateRequirementPresetAgentPromptTemplate from './docs/table-template-requirement-preset-agent-prompt.md?raw';
import defaultTableTemplateRequirementRaw from './骰子表格SQL_v4.3.json?raw';
import {
  DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
  TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
  buildTableTemplateAppendRepairPlan,
  cloneTemplateValue,
  createBuiltinTableTemplateRequirementPreset,
  exportTableTemplateRequirementPreset,
  getTemplateInspectionSheets as getRequirementInspectionSheets,
  inspectTableTemplateWithPreset,
  normalizeTableTemplateRequirementPreset,
} from './features/table/table-template-requirements';
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
} from './entities/gacha-items';
import {
  ACU_DICE_PROFILE_FORMAT,
  computeAcuDiceProfileFingerprint,
  createAcuDiceProfileMarker,
  decodeAcuDiceProfileMarkerPayload,
  extractAcuDiceProfileMarkerPayloads,
  getAcuDiceProfilePromptKey,
  getAcuDiceProfileSourceKey,
  normalizeAcuDiceProfilePackage,
  normalizeAcuDiceProfileSource,
  type AcuDiceProfilePackage,
  type AcuDiceProfileSource,
  type NormalizeAcuDiceProfileOptions,
} from './features/profiles/profile-packages';
import { GachaCatalogDB } from './features/gacha/gacha-catalog-db';
import { GachaShardWallet, GachaCatalog, GachaCatalogRecord, GachaCatalogCache, GachaCatalogLoadTask, GachaCatalogImportMode, NormalizedGachaCatalogItem, GachaCatalogImportAnalysis, GachaCatalogImportStats, GachaSettingsItemSourceFilter, GachaSettingsItemStatusFilter, GachaSettingsItemSortMode, GachaSettingsItemFilterState, GachaSettingsFilterField, GachaSettingsFilterOption, NormalizedImportedGachaPools, GachaPoolSettingsRecord, GachaItemSettingsEntry, GachaItemSettingsRecord, GachaPityState, GachaRecentRewardRecord, GachaInputStats, GachaState, GachaFortuneProgressView, GachaDrawOutcome } from './features/gacha/gacha-types';
import { createEmptyShardWallet, GACHA_DUPLICATE_REROLL_LIMIT, GACHA_PICKUP_WEIGHT_MULTIPLIER, GACHA_PICKUP_CHAT_DEPTH_BUCKET, GACHA_PICKUP_RARITIES, GACHA_PICKUP_FALLBACK_LIMIT, GACHA_ALL_POOL_TAG, GACHA_CUSTOM_ONLY_POOL_TAG, GACHA_REWARD_FIELD_LIMITS, normalizeGachaPoolId, normalizeGachaPoolName, cloneGachaState, getGachaStateBalanceScore, mergeLegacyGachaStateForLocalStorage } from './features/gacha/gacha-helpers';
import { GachaStore } from './features/gacha/gacha-store';
import { GachaStateCore } from './features/gacha/gacha-state';
import { ATTRIBUTE_QUICK_SELECT_DEFAULT } from './features/presets/attribute-quick-select-defaults';
import { BUILTIN_ADVANCED_PRESETS } from './features/presets/builtin-advanced-presets';
import { BUILTIN_VALIDATION_RULES } from './features/validation/builtin-validation-rules';
import { RANDOM_SKILL_POOL } from './features/dice/random-skill-pool';
import { DASHBOARD_TABLE_CONFIG } from './features/dashboard/dashboard-table-config';
import { TEMPLATE_TABLE_REQUIREMENTS } from './features/table/template-table-requirements';
import { BUILTIN_ATTRIBUTE_PRESETS } from './features/presets/builtin-attribute-presets';
import { BUILTIN_ACTION_PRESETS } from './features/presets/builtin-action-presets';
import { GLOBAL_INTERACTION_SECTION_METAS } from './features/interactions/global-interaction-section-metas';
import { BUILTIN_REGEX_RULES } from './features/regex/builtin-regex-rules';
import { ACTION_ICON_MAP } from './features/actions/action-icon-map';
import { DICE_CONFIG_BACKUP_MODULES } from './features/dice/dice-config-backup-modules';
import { DICE_CONFIG_BACKUP_KEY_STRATEGIES } from './features/dice/dice-config-backup-key-strategies';
import { STORAGE_KEY_ACTION_ORDER, STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET, STORAGE_KEY_ACTIVE_ADVANCED_PRESET, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_ACTIVE_PRESET, STORAGE_KEY_ACTIVE_RENDER_PRESET, STORAGE_KEY_ACTIVE_TAB, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_BLACKLIST, STORAGE_KEY_BUILTIN_PRESET_ORDER, STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, STORAGE_KEY_GACHA_STATE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_HIDDEN_TABLES, STORAGE_KEY_INVENTORY_FILTERS, STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED, STORAGE_KEY_INVENTORY_METADATA, STORAGE_KEY_IS_COLLAPSED, STORAGE_KEY_LAST_PRESET, STORAGE_KEY_MAP_FOCUS, STORAGE_KEY_OPTIONS_COLLAPSED, STORAGE_KEY_PRESETS, STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_ENABLED, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, STORAGE_KEY_REVERSE_TABLES, STORAGE_KEY_SCROLL, STORAGE_KEY_TABLE_HEIGHTS, STORAGE_KEY_TABLE_ORDER, STORAGE_KEY_TABLE_STYLES, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_UI_CONFIG, STORAGE_KEY_VALIDATION_ENABLED, STORAGE_KEY_VALIDATION_MODE, STORAGE_KEY_VALIDATION_RULES } from './shared/storage-keys';
import { DATA_VALIDATION_DEPRECATED_META } from './features/validation/data-validation-deprecated-meta';

(function () {
  'use strict';

  const TABLE_TEMPLATE_CHECK_HINT = '请在高级设置中使用“检验表格模板”检查当前表格模板。';

  const withTableTemplateCheckHint = (message: string): string => {
    const text = String(message || '').trim();
    if (!text) return TABLE_TEMPLATE_CHECK_HINT;
    if (text.includes('检验表格模板')) return text;
    const separator = /[。！？!?]$/.test(text) ? '' : '。';
    return `${text}${separator}${TABLE_TEMPLATE_CHECK_HINT}`;
  };

  const warnTableTemplateIssue = (message: string): void => {
    window.toastr?.warning(withTableTemplateCheckHint(message));
  };

  const errorTableTemplateIssue = (message: string): void => {
    showActionableErrorToast(message, { suggestion: 'tableTemplate' });
  };

  /**
   * 获取行的主键值
   * @param tableName 表名
   * @param row 行数据
   * @param headers 表头
   */

  // ========================================
  // 数据库适配层 (LockManager -> GodDB API)
  // ========================================

  /**
   * 获取数据库锁定API
   * @returns API对象，如果不可用返回null
   */

  /**
   * 根据表名获取sheetKey
   * @param tableName - 表名（如"主角信息"）
   * @returns sheetKey（如"sheet_0"），找不到返回null
   */
  function getSheetKeyByTableName(tableName: string): string | null {
    try {
      const data = getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      if (!data) return null;

      for (const key in data) {
        if (key.startsWith('sheet_') && data[key]?.name === tableName) {
          return key;
        }
      }
    } catch (e) {
      console.warn('[DICE]getSheetKeyByTableName 失败:', e);
    }
    return null;
  }

  /**
   * 通过主键值查找行索引
   * @param sheetKey - 表格标识
   * @param tableName - 表名
   * @param primaryKeyValue - 主键值（格式可能是 "字段名=值" 或纯值）
   * @returns 行索引（从0开始），找不到返回null
   */
  const findRowIndexByPrimaryKey = createFindRowIndexByPrimaryKey({
    getTableData: (...a: any[]) => getTableData(...a),
  });

  /**
   * 安全地修改角色卡属性值
   * @param characterName - 角色名称
   * @param attrName - 属性名称
   * @param operation - 操作类型: 'add' | 'subtract' | 'set'
   * @param value - 操作数值
   * @param options - 可选配置 { initValue?: number, min?: number, max?: number }
   * @returns Promise<{ success: boolean, oldValue: number, newValue: number, error?: string }>
   */
  async function safeUpdateAttribute(
    characterName: string,
    attrName: string,
    operation: 'add' | 'subtract' | 'set',
    value: number,
    options?: { initValue?: number; min?: number; max?: number },
  ): Promise<{ success: boolean; oldValue: number; newValue: number; error?: string }> {
    console.info(`[DICE]safeUpdateAttribute: ${characterName}.${attrName} ${operation} ${value}`);

    try {
      // 1. 获取 DbLockAPI
      const api = getDbLockAPI();
      if (!api || typeof api.updateCell !== 'function') {
        const error = '数据库 API 不可用';
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 2. 读取当前运行时数据
      const data = getTableData({ silent: true }) as Record<
        string,
        { name: string; content: (string | number | null)[][] }
      > | null;
      if (!data) {
        const error = '无法读取表格数据';
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 3. 查找角色所在表格和行索引
      let targetSheetKey: string | null = null;
      let targetRowIndex: number | null = null;
      let targetColIndex: number = -1;

      // 遍历所有表格查找角色
      for (const sheetKey in data) {
        if (!sheetKey.startsWith('sheet_')) continue;
        const sheet = data[sheetKey];
        if (!sheet || !sheet.content || !Array.isArray(sheet.content) || sheet.content.length < 2) continue;

        const headers = sheet.content[0] as string[];
        const pkField = PRIMARY_KEYS[sheet.name as keyof typeof PRIMARY_KEYS];

        // 跳过无主键的表格
        if (pkField === undefined) continue;

        // 处理特殊情况：全局数据表等没有主键的情况
        if (pkField === null) {
          if (characterName === '_row_0') {
            targetSheetKey = sheetKey;
            targetRowIndex = 0;
            targetColIndex = headers.indexOf(attrName);
            break;
          }
          continue;
        }

        // 查找主键列索引
        const pkIndex = headers.indexOf(pkField);
        if (pkIndex === -1) continue;

        // 遍历数据行查找角色
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && String(row[pkIndex]) === String(characterName)) {
            targetSheetKey = sheetKey;
            targetRowIndex = i - 1; // 数据库的 rowIndex 是从 0 开始的数据行索引
            targetColIndex = headers.indexOf(attrName);
            break;
          }
        }

        if (targetSheetKey) break;
      }

      if (!targetSheetKey || targetRowIndex === null) {
        const error = `找不到角色: ${characterName}`;
        console.warn(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      if (targetColIndex === -1) {
        const error = `角色 ${characterName} 中找不到属性: ${attrName}`;
        console.warn(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue: 0, newValue: 0, error };
      }

      // 4. 检查锁定状态
      const lockState = api.getTableLockState?.(targetSheetKey);
      if (lockState) {
        // 检查行锁定
        const isRowLocked = lockState.rows?.includes(targetRowIndex) ?? false;
        if (isRowLocked) {
          const error = `角色 ${characterName} 的整行已被锁定`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }

        // 检查单元格锁定
        // 注意: targetColIndex 包含行号列，数据库的 colIndex 不包含行号列，需要 -1
        const cellKey = `${targetRowIndex}:${targetColIndex - 1}`;
        const isCellLocked = lockState.cells?.includes(cellKey) ?? false;
        if (isCellLocked) {
          const error = `属性 ${characterName}.${attrName} 已被锁定`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      }

      // 5. 获取旧值或初始化
      const sheet = data[targetSheetKey];
      const currentValue = sheet.content[targetRowIndex + 1][targetColIndex]; // +1 因为 content[0] 是表头
      let oldValue: number;

      if (currentValue === null || currentValue === undefined || currentValue === '') {
        if (options?.initValue !== undefined) {
          oldValue = options.initValue;
          console.info(`[DICE]safeUpdateAttribute: 属性 ${attrName} 不存在，初始化为 ${oldValue}`);
        } else {
          const error = `属性 ${attrName} 不存在且未提供 initValue`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      } else {
        oldValue = typeof currentValue === 'number' ? currentValue : parseFloat(String(currentValue));
        if (isNaN(oldValue)) {
          const error = `属性 ${attrName} 的值 "${currentValue}" 无法转换为数字`;
          console.warn(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue: 0, newValue: 0, error };
        }
      }

      // 6. 执行操作
      let newValue: number;
      switch (operation) {
        case 'add':
          newValue = oldValue + value;
          break;
        case 'subtract':
          newValue = oldValue - value;
          break;
        case 'set':
          newValue = value;
          break;
        default:
          const error = `不支持的操作类型: ${operation}`;
          console.error(`[DICE]safeUpdateAttribute: ${error}`);
          return { success: false, oldValue, newValue: oldValue, error };
      }

      // 7. 应用 min/max 约束
      const min = options?.min ?? -Infinity;
      const max = options?.max ?? Infinity;
      newValue = Math.max(min, Math.min(max, newValue));

      console.info(
        `[DICE]safeUpdateAttribute: ${characterName}.${attrName} ${oldValue} → ${newValue} (${operation} ${value})`,
      );

      // 8. 通过新版 CRUD API 更新数据
      const updateResult = await api.updateCell({
        tableName: sheet.name,
        rowIndex: targetRowIndex + 1,
        colIdentifier: attrName,
        value: newValue,
        skipNotify: true,
      });
      if (updateResult === false) {
        const error = `更新 ${sheet.name}.${attrName} 失败`;
        console.error(`[DICE]safeUpdateAttribute: ${error}`);
        return { success: false, oldValue, newValue: oldValue, error };
      }
      const refreshedData = getTableData({ silent: true });
      if (refreshedData) cachedRawData = refreshedData;

      console.info(`[DICE]safeUpdateAttribute: 成功修改 ${characterName}.${attrName}`);
      return { success: true, oldValue, newValue };
    } catch (e) {
      const error = `修改属性时发生异常: ${e instanceof Error ? e.message : String(e)}`;
      console.error(`[DICE]safeUpdateAttribute: ${error}`, e);
      return { success: false, oldValue: 0, newValue: 0, error };
    }
  }

  /**
   * 执行检定后果效果
   * 在 MESSAGE_SENT 事件中调用，异步执行不阻塞消息发送
   * @param pendingCtx 待执行的后果上下文
   * @returns 执行结果数组
   */
  const executeEffects = createExecuteEffects({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    executeSecondaryEffectsChain: (...a: any[]) => executeSecondaryEffectsChain(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    getCachedRawData: () => cachedRawData,
  });


  const executeSecondaryEffectsChain = createExecuteSecondaryEffectsChain({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    isSameAttributeAlias: (...a: any[]) => isSameAttributeAlias(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
  });

  /**
   * 根据后果执行结果计算输出模板变量
   * @param results 后果执行结果数组
   * @returns 可用于 outputContext 的变量对象
   */



  /**
   * 根据待执行的效果定义预计算输出模板变量
   * 用于在输出模板中显示预期的效果信息（实际执行在消息发送后）
   * @param effects 效果定义数组
   * @returns 可用于 outputContext 的变量对象
   */

  // ========================================
  // BookmarkManager - 书签管理器（按聊天隔离）
  // ========================================
  const BookmarkManager = createBookmarkManager({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });  const escapeHtml = s =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  type ImageUrlValidationReason = 'invalid_url' | 'invalid_protocol' | 'svg_url';

  const REMOTE_IMAGE_ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
  const INTERNAL_IMAGE_ALLOWED_PROTOCOLS = new Set(['blob:']);

  const normalizeImageUrlInput = (url: unknown): string => String(url ?? '').trim();

  const parseImageUrl = (url: string): URL | null => {
    const normalizedUrl = normalizeImageUrlInput(url);
    if (!normalizedUrl) return null;
    try {
      return new URL(normalizedUrl, window.location.href);
    } catch {
      return null;
    }
  };

  const getRemoteImageUrlValidationError = (url: string): ImageUrlValidationReason | null => {
    const parsedUrl = parseImageUrl(url);
    if (!parsedUrl) return 'invalid_url';
    if (!REMOTE_IMAGE_ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) return 'invalid_protocol';
    if (parsedUrl.pathname.toLowerCase().endsWith('.svg')) return 'svg_url';
    return null;
  };

  const isRemoteImageUrlValid = (url: string): boolean => getRemoteImageUrlValidationError(url) === null;

  const isRenderableImageUrlValid = (url: string): boolean => {
    const parsedUrl = parseImageUrl(url);
    if (!parsedUrl) return false;
    if (INTERNAL_IMAGE_ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) return true;
    return getRemoteImageUrlValidationError(url) === null;
  };

  const normalizeStorableImageUrl = (url: unknown): string => {
    const normalizedUrl = normalizeImageUrlInput(url);
    return normalizedUrl && isRemoteImageUrlValid(normalizedUrl) ? normalizedUrl : '';
  };

  const getImageUrlValidationMessage = (label: string, reason: ImageUrlValidationReason | null): string => {
    if (reason === 'svg_url') return `${label}不支持 SVG 图片，请使用 PNG、JPEG、WebP 或 GIF。`;
    if (reason === 'invalid_protocol')
      return `${label}仅支持 http/https 或当前站点相对路径，不支持 data:、file:、javascript: 等协议。`;
    return `${label}格式不正确，请填写完整图片链接。`;
  };

  const escapeCssString = (value: string): string =>
    normalizeImageUrlInput(value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\n\r\f]/g, '');

  const formatCssImageUrl = (url: unknown, options: { allowInternalObjectUrl?: boolean } = {}): string => {
    const normalizedUrl = normalizeImageUrlInput(url);
    if (!normalizedUrl) return '';
    const isAllowed = options.allowInternalObjectUrl
      ? isRenderableImageUrlValid(normalizedUrl)
      : isRemoteImageUrlValid(normalizedUrl);
    return isAllowed ? `url("${escapeCssString(normalizedUrl)}")` : '';
  };

  const buildAvatarBackgroundStyle = (
    imageUrl: unknown,
    offsetX: unknown = 50,
    offsetY: unknown = 50,
    scale: unknown = 150,
  ): string => {
    const cssImageUrl = formatCssImageUrl(imageUrl, { allowInternalObjectUrl: true });
    if (!cssImageUrl) return '';
    const normalizedScale = Number(scale);
    const normalizedOffsetX = Number(offsetX);
    const normalizedOffsetY = Number(offsetY);
    return `background-image:${cssImageUrl};background-size:${Number.isFinite(normalizedScale) ? normalizedScale : 150}%;background-position:${Number.isFinite(normalizedOffsetX) ? normalizedOffsetX : 50}% ${Number.isFinite(normalizedOffsetY) ? normalizedOffsetY : 50}%;`;
  };


  const renderDeprecatedBadge = (reason: string): string =>
    `<span class="acu-deprecated-badge" title="${escapeHtml(reason)}" aria-label="${escapeHtml(reason)}">旧</span>`;

  const stripLoneSurrogates = (value: string): string => {
    let sanitized = '';
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff) {
        const next = value.charCodeAt(i + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          sanitized += value[i] + value[i + 1];
          i++;
        } else {
          sanitized += '\uFFFD';
        }
        continue;
      }
      if (code >= 0xdc00 && code <= 0xdfff) {
        sanitized += '\uFFFD';
        continue;
      }
      sanitized += value[i];
    }
    return sanitized;
  };

  const safeEncodeURIComponent = (value: unknown): string => {
    const text = String(value ?? '');
    try {
      return encodeURIComponent(text);
    } catch {
      return encodeURIComponent(stripLoneSurrogates(text));
    }
  };

  const safeDecodeURIComponent = (value: unknown): string => {
    const text = String(value ?? '');
    try {
      return decodeURIComponent(text);
    } catch {
      return stripLoneSurrogates(text);
    }
  };

  /**
   * 设置弹窗点击遮罩关闭的事件监听
   * - PC端：需要 mousedown 和 mouseup 都在遮罩上才关闭（防止选择文本时误关闭）
   * - Mobile端：保持原有行为，触摸点击遮罩即关闭
   * @param $overlay jQuery对象，弹窗遮罩层
   * @param overlayClass 遮罩层的类名（用于判断点击目标）
   * @param onClose 关闭时的回调函数
   */
  const setupOverlayClose = ($overlay: JQuery, overlayClass: string, onClose: () => void) => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      // Mobile: 触摸点击遮罩即关闭
      $overlay.on('click', function (e) {
        if ($(e.target).hasClass(overlayClass)) {
          onClose();
        }
      });
    } else {
      // PC: 需要 mousedown 和 mouseup 都在遮罩上才关闭
      let mouseDownOnOverlay = false;

      $overlay.on('mousedown', function (e) {
        mouseDownOnOverlay = $(e.target).hasClass(overlayClass);
      });

      $overlay.on('mouseup', function (e) {
        if (mouseDownOnOverlay && $(e.target).hasClass(overlayClass)) {
          onClose();
        }
        mouseDownOnOverlay = false;
      });
    }
  };

  // [新增] 生成唯一名称（用于预设导入时处理重名）
  const generateUniqueName = (baseName: string, existingNames: string[]): string => {
    if (!existingNames.includes(baseName)) return baseName;
    let counter = 2;
    let newName = `${baseName} (${counter})`;
    while (existingNames.includes(newName)) {
      counter++;
      newName = `${baseName} (${counter})`;
    }
    return newName;
  };

  // [新增] 通用预设导入冲突弹窗（复用头像导入弹窗样式）
  const showPresetConflictDialog = createShowPresetConflictDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    generateUniqueName: (...a: any[]) => generateUniqueName(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });
  type AcuDiceTextareaElement = HTMLTextAreaElement & {
    _acuOriginalDiceText?: string | null;
    _acuOriginalTextareaText?: string | null;
    _acuOriginalActionText?: string | null;
    _acuHasDiceData?: boolean;
    _acuValueIntercepted?: boolean;
    _acuHumanInputTrackingBound?: boolean;
  };

  const DICE_RESULT_PLACEHOLDER = '[投骰结果已隐藏]';
  const createMetaCheckResultRegex = () => /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;
  const createDiceResultPlaceholderRegex = () => /\[投骰结果已隐藏\]/g;

  const notifyTextareaValueChanged = (textarea: HTMLTextAreaElement) => {
    const EventCtor = textarea.ownerDocument.defaultView?.Event || Event;
    textarea.dispatchEvent(new EventCtor('input', { bubbles: true }));
    textarea.dispatchEvent(new EventCtor('change', { bubbles: true }));
  };

  const setTextareaValueAndNotify = (textarea: HTMLTextAreaElement, value: string) => {
    textarea.value = value;
    notifyTextareaValueChanged(textarea);
  };

  const readTextareaVisibleValue = (textarea: HTMLTextAreaElement): string => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
    if (originalDescriptor?.get) return String(originalDescriptor.get.call(textarea) ?? '');
    return String((textarea as AcuDiceTextareaElement & { _value?: string })._value ?? '');
  };

  const extractMetaCheckResultBlocks = (text: unknown): string[] =>
    Array.from(String(text ?? '').matchAll(createMetaCheckResultRegex()))
      .map(match => match[0])
      .filter(Boolean);

  const readStoredTextareaDiceText = (textarea: AcuDiceTextareaElement): string => {
    if (typeof textarea._acuOriginalTextareaText === 'string') return textarea._acuOriginalTextareaText;
    try {
      const { $ } = getCore();
      const storedText = $(textarea).data('acu-original-textarea-text');
      return typeof storedText === 'string' ? storedText : '';
    } catch (_error) {
      return '';
    }
  };

  const readStoredLatestDiceText = (textarea: AcuDiceTextareaElement): string => {
    if (typeof textarea._acuOriginalDiceText === 'string') return textarea._acuOriginalDiceText;
    try {
      const { $ } = getCore();
      const storedText = $(textarea).data('acu-original-dice-text');
      return typeof storedText === 'string' ? storedText : '';
    } catch (_error) {
      return '';
    }
  };

  const composeTextareaTextWithHiddenDice = (
    visibleText: unknown,
    storedTextareaText: unknown,
    storedLatestDiceText: unknown,
  ): string => {
    const visibleValue = String(visibleText ?? '');
    if (!visibleValue.includes(DICE_RESULT_PLACEHOLDER)) return visibleValue;

    const storedBlocks = extractMetaCheckResultBlocks(storedTextareaText);
    const latestBlocks = extractMetaCheckResultBlocks(storedLatestDiceText);
    const replacementBlocks = storedBlocks.length > 0 ? storedBlocks : latestBlocks;
    const latestText = typeof storedLatestDiceText === 'string' ? storedLatestDiceText : '';
    let replacementIndex = 0;

    return visibleValue.replace(createDiceResultPlaceholderRegex(), () => {
      const replacement =
        replacementBlocks[replacementIndex] ||
        replacementBlocks[replacementBlocks.length - 1] ||
        latestText ||
        '';
      replacementIndex++;
      return replacement;
    });
  };

  const resolveTextareaTextWithHiddenDice = (
    textarea: AcuDiceTextareaElement,
    visibleText = readTextareaVisibleValue(textarea),
  ): string =>
    composeTextareaTextWithHiddenDice(visibleText, readStoredTextareaDiceText(textarea), readStoredLatestDiceText(textarea));

  const clearTextareaDiceCache = (textarea: AcuDiceTextareaElement) => {
    try {
      const { $ } = getCore();
      $(textarea).removeData('acu-original-dice-text');
      $(textarea).removeData('acu-original-textarea-text');
    } catch (_error) {
      // ignore cache cleanup failures; DOM fields are cleared below
    }
    textarea._acuOriginalDiceText = null;
    textarea._acuOriginalTextareaText = null;
    textarea._acuHasDiceData = false;
  };

  const storeTextareaDiceCache = (textarea: AcuDiceTextareaElement, realText: string, latestDiceText?: string) => {
    const metaBlocks = extractMetaCheckResultBlocks(realText);
    const latestText = latestDiceText || metaBlocks[metaBlocks.length - 1] || '';
    if (!realText || metaBlocks.length === 0) {
      clearTextareaDiceCache(textarea);
      return;
    }

    try {
      const { $ } = getCore();
      $(textarea).data('acu-original-textarea-text', realText);
      $(textarea).data('acu-original-dice-text', latestText);
    } catch (_error) {
      // DOM fields below are the hot path for the value getter
    }
    textarea._acuOriginalTextareaText = realText;
    textarea._acuOriginalDiceText = latestText;
    textarea._acuHasDiceData = true;
  };

  const syncTextareaDiceCacheFromVisibleText = (
    textarea: AcuDiceTextareaElement,
    visibleText = readTextareaVisibleValue(textarea),
  ): string => {
    const visibleValue = String(visibleText ?? '');
    if (!visibleValue.includes(DICE_RESULT_PLACEHOLDER)) {
      const visibleMetaBlocks = extractMetaCheckResultBlocks(visibleValue);
      if (visibleMetaBlocks.length > 0) {
        storeTextareaDiceCache(textarea, visibleValue, visibleMetaBlocks[visibleMetaBlocks.length - 1]);
      } else if (textarea._acuHasDiceData) {
        clearTextareaDiceCache(textarea);
      }
      return visibleValue;
    }

    const realText = resolveTextareaTextWithHiddenDice(textarea, visibleValue);
    const metaBlocks = extractMetaCheckResultBlocks(realText);
    if (metaBlocks.length > 0) {
      storeTextareaDiceCache(textarea, realText, metaBlocks[metaBlocks.length - 1]);
    }
    return realText;
  };

  const HUMAN_INPUT_TAG_BLOCK_PATTERNS = [
    /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/gi,
    /<recall>[\s\S]*?<\/recall>/gi,
    /<supplement>[\s\S]*?<\/supplement>/gi,
  ];
  const HUMAN_INPUT_ACTION_PATTERN = /<user>(?:(?!<user>).)*?[。！？]/g;
  const humanInputSendQueue: string[] = [];
  let lastHumanInputSnapshot = '';
  let lastHumanInputActivityAt = 0;
  let lastCapturedHumanInputSnapshot = '';
  let lastHumanInputCaptureAt = 0;
  let gachaHeartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopUiRefreshTimer: ReturnType<typeof setInterval> | null = null;
  let gachaShopRootElement: HTMLElement | null = null;
  const GACHA_TEST_DEFAULT_FORTUNE = 0;
  const GACHA_SHARD_EXCHANGE_COST = 10;





  const GACHA_CATALOG_GLOBAL_SCOPE_KEY = 'global';
  const GACHA_SHOP_UI_REFRESH_MS = 250;
  const GACHA_CATALOG_RAW_ROW_INDEX_PROP = '__acuRawRowIndex';

  const normalizeTrackedText = (text: unknown): string =>
    String(text ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim();

  const escapeRegExpLiteral = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const stripKnownSystemActionText = (text: string, actionText?: unknown): string => {
    const normalizedAction = normalizeTrackedText(actionText);
    if (!normalizedAction) return text;
    return normalizeTrackedText(text.replace(new RegExp(escapeRegExpLiteral(normalizedAction), 'g'), ' '));
  };

  const extractExplicitHumanInputText = (text: string): string => {
    const matches = Array.from(text.matchAll(/<本轮用户输入>([\s\S]*?)<\/本轮用户输入>/gi))
      .map(match => normalizeTrackedText(match[1]))
      .filter(Boolean);
    return normalizeTrackedText(matches.join('\n'));
  };

  const stripSystemInjectedContent = (text: unknown, systemActionText?: unknown): string => {
    const normalized = normalizeTrackedText(text);
    const explicitHumanInput = extractExplicitHumanInputText(normalized);
    let result = explicitHumanInput || normalized;
    HUMAN_INPUT_TAG_BLOCK_PATTERNS.forEach(pattern => {
      result = result.replace(pattern, ' ');
    });
    if (!explicitHumanInput) {
      result = result.replace(HUMAN_INPUT_ACTION_PATTERN, ' ');
      result = stripKnownSystemActionText(result, systemActionText);
    }
    result = result.replace(/\[投骰结果已隐藏\]/g, ' ');
    return normalizeTrackedText(result);
  };

  const countUnicodeCharacters = (text: string): number => Array.from(String(text || '')).length;

  const markHumanInputActivity = () => {
    lastHumanInputActivityAt = Date.now();
  };

  const capturePendingHumanInputSnapshot = (rawText?: unknown, systemActionText?: unknown) => {
    const sanitized = stripSystemInjectedContent(rawText, systemActionText) || lastHumanInputSnapshot;
    const now = Date.now();
    markHumanInputActivity();
    lastHumanInputSnapshot = sanitized;
    if (sanitized === lastCapturedHumanInputSnapshot && now - lastHumanInputCaptureAt < 500) return;
    lastCapturedHumanInputSnapshot = sanitized;
    lastHumanInputCaptureAt = now;
    humanInputSendQueue.push(sanitized);
  };

  const consumePendingHumanInputSnapshot = (): string => {
    if (humanInputSendQueue.length > 0) {
      return String(humanInputSendQueue.shift() || '');
    }
    return String(lastHumanInputSnapshot || '');
  };

  const bindHumanInputTracking = () => {
    const textarea = document.getElementById('send_textarea') as AcuDiceTextareaElement | null;
    if (!textarea || textarea._acuHumanInputTrackingBound) return;

    const updateSnapshot = (target: HTMLTextAreaElement) => {
      const acuTextarea = target as AcuDiceTextareaElement;
      const visibleValue = readTextareaVisibleValue(target);
      const resolvedValue = syncTextareaDiceCacheFromVisibleText(acuTextarea, visibleValue);
      if (acuTextarea._acuOriginalActionText && !resolvedValue.includes(acuTextarea._acuOriginalActionText)) {
        acuTextarea._acuOriginalActionText = null;
        const { $ } = getCore();
        $(target).removeData('acu-original-action-text');
      }
      lastHumanInputSnapshot = stripSystemInjectedContent(resolvedValue, acuTextarea._acuOriginalActionText);
      markHumanInputActivity();
    };

    const handleTrustedInput = (event: Event) => {
      if (!event.isTrusted) return;
      updateSnapshot(textarea);
    };

    textarea.addEventListener('input', handleTrustedInput, true);
    textarea.addEventListener('paste', handleTrustedInput, true);
    textarea.addEventListener('compositionend', handleTrustedInput, true);
    textarea._acuHumanInputTrackingBound = true;
    updateSnapshot(textarea);
  };

  // [新增] 智能填充输入栏函数
  const smartInsertToTextarea = createSmartInsertToTextarea({
    createDiceResultPlaceholderRegex: (...a: any[]) => createDiceResultPlaceholderRegex(...a),
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
    escapeRegExpLiteral: (...a: any[]) => escapeRegExpLiteral(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readStoredLatestDiceText: (...a: any[]) => readStoredLatestDiceText(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const getRuntimeWindowCandidates = () => {
    const candidates: Window[] = [];
    const addWindow = (targetWindow: Window | null | undefined) => {
      if (!targetWindow || candidates.includes(targetWindow)) return;
      candidates.push(targetWindow);
    };

    try {
      addWindow(getTavernHostWindow());
    } catch (_error) {
      // 宿主窗口可能还没准备好，继续检查本窗口和父窗口。
    }
    addWindow(window);
    try {
      addWindow(window.parent);
    } catch (_error) {
      // ignore inaccessible parent
    }
    try {
      addWindow(window.top);
    } catch (_error) {
      // ignore inaccessible top
    }

    return candidates;
  };

  const findRuntimeFunction = (name: string) => {
    for (const runtimeWindow of getRuntimeWindowCandidates()) {
      const directFn = runtimeWindow?.[name];
      if (typeof directFn === 'function') return directFn.bind(runtimeWindow);

      const tavernHelper = runtimeWindow?.TavernHelper;
      const helperFn = tavernHelper?.[name];
      if (typeof helperFn === 'function') return helperFn.bind(tavernHelper);
    }

    const globalFn = globalThis?.[name];
    return typeof globalFn === 'function' ? globalFn.bind(globalThis) : null;
  };

  const findSillyTavernSlashRunner = () => {
    for (const runtimeWindow of getRuntimeWindowCandidates()) {
      const ST = runtimeWindow?.SillyTavern;
      if (typeof ST?.executeSlashCommandsWithOptions === 'function') {
        return ST.executeSlashCommandsWithOptions.bind(ST);
      }
    }
    return null;
  };

  const quoteSlashArgument = (text: string): string =>
    `"${String(text ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')}"`;

  const triggerGenerationAfterDirectSend = async (): Promise<boolean> => {
    const triggerSlashFn = findRuntimeFunction('triggerSlash');
    if (triggerSlashFn) {
      await triggerSlashFn('/trigger');
      return true;
    }

    const runSlash = findSillyTavernSlashRunner();
    if (runSlash) {
      await runSlash('/trigger');
      return true;
    }

    return false;
  };

  const getComposerTextarea = (): AcuDiceTextareaElement | null => {
    const { $ } = getCore();
    const $ta = $('#send_textarea');
    return $ta.length ? ($ta[0] as AcuDiceTextareaElement) : null;
  };

  const getResolvedComposerText = (): string => {
    const textarea = getComposerTextarea();
    if (!textarea) return '';
    const visibleText = readTextareaVisibleValue(textarea);
    return syncTextareaDiceCacheFromVisibleText(textarea, visibleText).trim();
  };

  const clearComposerIfCurrentText = (sentText: string) => {
    const textarea = getComposerTextarea();
    if (!textarea) return;
    const currentText = syncTextareaDiceCacheFromVisibleText(textarea, readTextareaVisibleValue(textarea)).trim();
    if (currentText !== String(sentText ?? '').trim()) return;

    const { $ } = getCore();
    const $ta = $(textarea);
    setTextareaValueAndNotify(textarea, '');
    clearTextareaDiceCache(textarea);
    $ta.removeData('acu-original-action-text');
    textarea._acuOriginalActionText = null;
  };

  const findComposerSendButton = (): HTMLElement | null => {
    const documents = new Set<Document>();
    try {
      documents.add(getTavernHostDocument());
    } catch (_error) {
      // ignore
    }
    documents.add(document);

    for (const targetDocument of documents) {
      const buttons = Array.from(targetDocument.querySelectorAll<HTMLElement>('#send_but'));
      const visibleButton = buttons.find(button => {
        if ((button as HTMLButtonElement).disabled) return false;
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (visibleButton) return visibleButton;
      if (buttons[0] && !(buttons[0] as HTMLButtonElement).disabled) return buttons[0];
    }

    return null;
  };

  const sendTextViaComposer = async (messageText: string): Promise<'composer' | null> => {
    const textarea = getComposerTextarea();
    if (!textarea) return null;

    setTextareaValueAndNotify(textarea, messageText);
    await new Promise(resolve => setTimeout(resolve, 50));

    const sendButton = findComposerSendButton();
    if (sendButton) {
      sendButton.click();
      return 'composer';
    }

    const eventWindow = textarea.ownerDocument.defaultView || window;
    const enterEvent = new eventWindow.KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(enterEvent);
    return 'composer';
  };

  const sendChatTextAndTrigger = createSendChatTextAndTrigger({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
    quoteSlashArgument: (...a: any[]) => quoteSlashArgument(...a),
    sendTextViaComposer: (...a: any[]) => sendTextViaComposer(...a),
    triggerGenerationAfterDirectSend: (...a: any[]) => triggerGenerationAfterDirectSend(...a),
  });

  // [新增] 在发送消息前恢复真实结果
  const restoreDiceResultBeforeSend = () => {
    const { $ } = getCore();
    const diceCfg = getDiceConfig();
    const hideInput = diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
    if (hideInput) return;
    const $ta = $('#send_textarea');
    if (!$ta.length) return;

    const textarea = $ta[0] as AcuDiceTextareaElement;
    const currentVisibleVal = readTextareaVisibleValue(textarea);

    // 如果有占位符且有保存的原始文本，替换为真实结果
    if (currentVisibleVal.includes(DICE_RESULT_PLACEHOLDER)) {
      const restoredVal = resolveTextareaTextWithHiddenDice(textarea, currentVisibleVal);
      $ta.val(restoredVal);
      // 发送后不需要再保存，因为消息已经发送
      clearTextareaDiceCache(textarea);
    }
  };

  // [新增] 拦截输入框的 value 属性，确保读取时自动替换占位符
  const interceptTextareaValue = createInterceptTextareaValue({
    getCore: (...a: any[]) => getCore(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });






 // [新增] 选项面板独立折叠状态







  // [新增] 移植功能所需的存储键





  const MAX_ACTION_BUTTONS = 6; // 活动栏最大按钮数
  const MIN_PANEL_HEIGHT = 200; // 面板最小高度
  const MAX_PANEL_HEIGHT = 1200; // 面板最大高度
  const PANEL_VIEWPORT_TOP_GUTTER = 32; // 手动拉高面板时保留顶部工具栏安全距

















  // 自定义掷骰模式常量
  const CUSTOM_ROLL_MODE = {
    id: '__custom__',
    name: '自定义',
  } as const;
  // 比较版本号（简单比较，假设版本号格式为 "x.y.z"）
  const compareVersion = (v1, v2) => {
    // 处理数字版本号（向后兼容）
    const normalizeVersion = v => {
      if (typeof v === 'number') return `${v}.0.0`;
      if (typeof v !== 'string') return '0.0.0';
      return v;
    };
    const nv1 = normalizeVersion(v1);
    const nv2 = normalizeVersion(v2);
    const parts1 = nv1.split('.').map(Number);
    const parts2 = nv2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  };




  // ========================================
  // ConsoleCaptureManager - Console日志抓取管理器
  // ========================================

  // 不自动初始化拦截，需要手动开启或错误时自动开启
  // ConsoleCaptureManager.intercept();

  // ========================================
  // 全局错误处理机制（高阈值，仅致命错误）
  // ========================================
  const ErrorHandler = createErrorHandler({
    getConsoleCaptureManager: () => ConsoleCaptureManager,
  });
  // 注册全局错误处理器
  window.onerror = function (message, source, lineno, colno, error) {
    ErrorHandler.handleError(error || message, source, lineno, colno, error?.stack);
    return false; // 不阻止默认错误处理
  };

  // 注册 Promise 拒绝处理器
  window.addEventListener('unhandledrejection', function (event) {
    ErrorHandler.handleError(event.reason, null, null, null, event.reason?.stack);
  });

  // 在脚本初始化时检查错误状态
  // 这个会在 init 函数中调用

  // ========================================
  // 正则转换系统 - 类型定义 (Phase 1.1)
  // ========================================

  /**
   * 正则转换操作类型
   * - replace: 替换匹配的内容
   * - extract: 提取匹配的内容(暂未实现)
   * - delete: 删除匹配的内容
   * - validate: 验证格式(与ValidationEngine不同,这是转换验证)
   */
  type RegexOperation = 'replace' | 'extract' | 'delete' | 'validate';

  /**
   * 正则转换作用域类型
   * - global: 所有表格的所有列
   * - table: 指定表格的所有列
   * - column: 指定表格的指定列
   */
  type RegexScopeType = 'global' | 'table' | 'column';

  /**
   * 正则转换执行模式
   * - auto: 数据更新时自动执行
   * - manual: 用户手动触发
   * - preview: 预览影响,确认后应用
   */
  type RegexExecutionMode = 'auto' | 'manual' | 'preview';

  /**
   * 正则标志位选项
   */
  interface RegexFlags {
    caseInsensitive?: boolean; // i - 忽略大小写
    global?: boolean; // g - 全局匹配
    multiline?: boolean; // m - 多行模式
    unicode?: boolean; // u - Unicode模式
    sticky?: boolean; // y - 粘性匹配
  }

  /**
   * 作用域配置
   */
  interface RegexScopeConfig {
    type: RegexScopeType;
    tableNames?: string[]; // 作用域为table或column时指定表格名
    columnNames?: string[]; // 作用域为column时指定列名
  }

  /**
   * 安全配置
   */
  interface RegexSecurityConfig {
    maxMatchTime: number; // 单次匹配最大耗时(毫秒),默认100
    maxMatches: number; // 最大匹配次数,默认1000
    maxInputLength: number; // 最大输入长度,默认10000
  }

  /**
   * 测试用例
   */
  interface RegexTestCase {
    input: string;
    expected: string;
    description?: string;
  }

  /**
   * 表格正则规则
   */
  interface RegexTransformationRule {
    id: string; // 唯一标识
    name: string; // 规则名称
    description?: string; // 规则描述
    operation: RegexOperation; // 操作类型
    pattern: string; // 正则表达式字符串
    flags?: RegexFlags; // 正则标志位
    replacement?: string; // 替换内容(仅replace操作)
    scope: RegexScopeConfig; // 作���域配置
    enabled: boolean; // 是否启用
    priority: number; // 优先级(1-100),数值越大优先级越高
    executeMode: RegexExecutionMode; // 执行模式
    testCases?: RegexTestCase[]; // 测试用例
    security?: RegexSecurityConfig; // 安全配置
    createdAt?: number; // 创建时间戳
    updatedAt?: number; // 更新时间戳
  }

  /**
   * 转换结果
   */
  interface RegexTransformResult {
    success: boolean;
    oldValue: string;
    newValue: string;
    matched: boolean;
    error?: string;
  }

  /**
   * 批量转换结果
   */
  interface RegexBatchTransformResult {
    tableName: string;
    columnIndex: number;
    rowIndex: number;
    result: RegexTransformResult;
  }

  /**
   * 预览结果
   */
  interface RegexPreviewResult {
    rule: RegexTransformationRule;
    affectedCells: Array<{
      tableName: string;
      rowIndex: number;
      columnIndex: number;
      columnName: string;
      oldValue: string;
      newValue: string;
    }>;
    totalAffected: number;
  }

  /**
   * 预设配置
   */
  interface RegexPreset {
    id: string;
    name: string;
    description?: string;
    version: string;
    rules: RegexTransformationRule[];
    createdAt?: number;
    updatedAt?: number;
  }

  // 正则转换系统存储键





  // ========================================
  // 酒馆原生正则格式兼容 (Tavern Regex Import)
  // ========================================

  /**
   * 酒馆原生正则格式
   * @see https://docs.sillytavern.app/usage/core-concepts/regex/
   */
  interface TavernRegex {
    id?: string;
    scriptName: string;
    findRegex: string;
    replaceString: string;
    trimStrings?: string[];
    placement?: number[];
    disabled?: boolean;
    markdownOnly?: boolean;
    promptOnly?: boolean;
    runOnEdit?: boolean;
    substituteRegex?: number;
    minDepth?: number | null;
    maxDepth?: number | null;
  }

  /**
   * 解析酒馆正则的 findRegex 字段
   * 格式: /pattern/flags
   */

  /**
   * 将酒馆正则格式转换为本系统的 RegexTransformationRule
   */
  function convertTavernRegexToRule(tavernRegex: TavernRegex): RegexTransformationRule {
    const { pattern, flags } = parseTavernFindRegex(tavernRegex.findRegex);

    // 构建额外信息描述，保留酒馆正则的原始配置供参考
    const extraInfo: string[] = [];
    if (tavernRegex.placement?.length) extraInfo.push(`placement: [${tavernRegex.placement.join(',')}]`);
    if (tavernRegex.markdownOnly) extraInfo.push('markdownOnly');
    if (tavernRegex.promptOnly) extraInfo.push('promptOnly');
    if (tavernRegex.minDepth != null) extraInfo.push(`minDepth: ${tavernRegex.minDepth}`);
    if (tavernRegex.maxDepth != null) extraInfo.push(`maxDepth: ${tavernRegex.maxDepth}`);

    const description = extraInfo.length > 0 ? `[从酒馆正则导入] ${extraInfo.join(', ')}` : '[从酒馆正则导入]';

    return {
      id: `tavern_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: tavernRegex.scriptName,
      description,
      operation: 'replace',
      pattern,
      flags,
      replacement: tavernRegex.replaceString || '',
      scope: { type: 'global' },
      enabled: !tavernRegex.disabled,
      priority: 50,
      executeMode: tavernRegex.runOnEdit ? 'auto' : 'manual',
      security: { maxMatchTime: 100, maxMatches: 1000, maxInputLength: 10000 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // ========================================
  // 内置表格正则规则 (Phase 2.2)
  // ========================================

  const DEPRECATED_BUILTIN_REGEX_RULE_IDS = new Set(['builtin_replace_user']);
  const isDeprecatedBuiltinRegexRule = (rule: { id?: string; builtin?: boolean } | null | undefined): boolean =>
    Boolean(rule?.builtin === true && rule.id && DEPRECATED_BUILTIN_REGEX_RULE_IDS.has(rule.id));
  const filterDeprecatedBuiltinRegexRules = <T extends { id?: string; builtin?: boolean }>(
    rules: readonly T[] | null | undefined,
  ): T[] => {
    if (!Array.isArray(rules)) return [];
    return rules.filter(rule => !isDeprecatedBuiltinRegexRule(rule));
  };

  // ========================================
  // ValidationRuleManager - 数据验证规则系统
  // ========================================


 // 数据验证模式（只显示验证错误）

  // 规则类型信息（用于 UI 显示和分组）

  // 内置验证规则定义


  // ========================================
  // 快捷检定显示排除词
  // ========================================
  // 旧版变量过滤黑名单的存储键只用于迁移；是否显示骰子图标统一走 RenderPresetManager.shouldShowQuickCheck()。

  const DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = [
    '时间',
    '地点',
    '备忘',
    '总结',
    '概览',
    '日期',
    '选项',
    '任务',
    '纪要',
    '服装',
    '头像',
    '进度',
    '编码',
    '上限',
    '经验值',
    '消耗',
    '数量',
    '等级',
    '位置',
    'ID',
    '编号',
    '三围',
    'measurements',
    'ages',
    '年龄',
    'order',
    '号码',
    'time',
    'cost',
    'chapter',
    'location',
    'calendar',
    'day',
    'year',
    'month',
  ];
  const LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS.filter(
    keyword => keyword !== '概览',
  );

  const isSameKeywordSet = (left: string[], right: readonly string[]): boolean => {
    const rightSet = new Set(right);
    return left.length === rightSet.size && left.every(item => rightSet.has(item));
  };

  // ========================================
  // RenderPresetManager - 表格和变量渲染预设管理
  // ========================================
  const RENDER_PRESET_FORMAT = 'acu_render_preset_v1' as const;
  const RENDER_DEFAULT_PRESET_ID = '__builtin_render_default__';
  const RENDER_LEGACY_BLACKLIST_PRESET_ID = 'render_legacy_blacklist_migration';




  interface RenderPresetColumnDisplayRules {
    stripBracketContent: boolean;
    aliases: Record<string, string>;
  }

  interface RenderPresetRelationshipRules {
    enabled: boolean;
    headerKeywords: string[];
    autoDetectMultipleParen: boolean;
  }

  interface RenderPresetAttributeRules {
    enabled: boolean;
    parseJsonObject: boolean;
    parseKeyValuePairs: boolean;
  }

  interface RenderPresetShortTagRules {
    enabled: boolean;
    maxLength: number;
  }

  interface RenderPresetBadgeRules {
    enabled: boolean;
    shortTextMaxLength: number;
    numericPattern: boolean;
    statusValues: string[];
  }

  interface RenderPresetQuickCheckRules {
    enabled: boolean;
    excludeKeywords: string[];
  }

  interface RenderPresetDialogueIndentRules {
    whitelist: string[];
    blacklist: string[];
  }

  interface RenderPresetRules {
    columnDisplay: RenderPresetColumnDisplayRules;
    invalidValues: string[];
    identityHeaderKeywords: string[];
    relationship: RenderPresetRelationshipRules;
    attributes: RenderPresetAttributeRules;
    shortTags: RenderPresetShortTagRules;
    badges: RenderPresetBadgeRules;
    quickCheck: RenderPresetQuickCheckRules;
    dialogueIndent: RenderPresetDialogueIndentRules;
  }

  interface RenderPreset {
    format: typeof RENDER_PRESET_FORMAT;
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    rules: RenderPresetRules;
    createdAt?: string;
    updatedAt?: string;
  }

  const normalizeRenderPresetStringList = (value: unknown, fallback: readonly string[] = []): string[] => {
    const rawItems = Array.isArray(value) ? value : fallback;
    const seen = new Set<string>();
    const result: string[] = [];
    rawItems.forEach(item => {
      const text = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!text || seen.has(text)) return;
      seen.add(text);
      result.push(text);
    });
    return result;
  };

  const normalizeRenderPresetTagFilterList = (value: unknown, fallback: readonly string[] = []): string[] => {
    const rawItems = typeof value === 'string' ? value.split(/[,，;；\n]/) : Array.isArray(value) ? value : fallback;
    const seen = new Set<string>();
    const result: string[] = [];
    rawItems.forEach(item => {
      let text = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!text) return;
      if (text.startsWith('<') && text.endsWith('>')) {
        text = text
          .slice(1, -1)
          .replace(/^\/\s*/, '')
          .replace(/\/\s*$/, '')
          .trim();
        text = text.split(/\s+/)[0] || '';
      }
      if (!text) return;
      const dedupeKey = text.toLocaleLowerCase();
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      result.push(text);
    });
    return result;
  };

  const normalizeRenderPresetAliasMap = (value: unknown, fallback: Record<string, string>): Record<string, string> => {
    const source = isRecordValue(value) ? value : fallback;
    const aliases: Record<string, string> = {};
    Object.entries(source).forEach(([rawKey, rawValue]) => {
      const key = String(rawKey || '').trim();
      const alias = typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue).trim() : '';
      if (key && alias) aliases[key] = alias;
    });
    return aliases;
  };

  const cloneRenderPresetRules = createCloneRenderPresetRules({

  });

  const DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST = [
    'summary',
    'tucao',
    'JSONPatch',
    'Analysis',
    'UpdateVariable',
    'StatusBlock',
    'StatusPlaceHolderImpl',
    'options',
    'meta:检定结果',
    '摘要',
    'image',
    'script',
    'placeholder',
    'think',
    'thought',
    'thinking',
  ] as const;

  const DEFAULT_RENDER_PRESET_RULES: RenderPresetRules = {
    columnDisplay: {
      stripBracketContent: true,
      aliases: {
        一句话介绍: '介绍',
        外貌特征: '外貌',
      },
    },
    invalidValues: ['-', '--', '—', 'null', 'none', '无', '空', 'n/a', 'undefined', '/', 'nil'],
    identityHeaderKeywords: ['身份'],
    relationship: {
      enabled: true,
      headerKeywords: ['关系', '人际'],
      autoDetectMultipleParen: true,
    },
    attributes: {
      enabled: true,
      parseJsonObject: true,
      parseKeyValuePairs: true,
    },
    shortTags: {
      enabled: true,
      maxLength: 6,
    },
    badges: {
      enabled: true,
      shortTextMaxLength: 6,
      numericPattern: true,
      statusValues: ['是', '否', '有', '无', '死亡', '存活'],
    },
    quickCheck: {
      enabled: true,
      excludeKeywords: [...DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS],
    },
    dialogueIndent: {
      whitelist: ['*'],
      blacklist: [...DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST],
    },
  };

  const normalizeRenderPresetRules = createNormalizeRenderPresetRules({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeRenderPresetAliasMap: (...a: any[]) => normalizeRenderPresetAliasMap(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    normalizeRenderPresetTagFilterList: (...a: any[]) => normalizeRenderPresetTagFilterList(...a),
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
  });

  const createBuiltinRenderPreset = (): RenderPreset => ({
    format: RENDER_PRESET_FORMAT,
    version: PRESET_FORMAT_VERSION,
    id: RENDER_DEFAULT_PRESET_ID,
    name: '默认渲染预设',
    builtin: true,
    description: '内置默认渲染规则，包含列名显示、属性键值对、关系、短标签、快捷检定过滤和正文头像渲染标签过滤等规则',
    rules: cloneRenderPresetRules(DEFAULT_RENDER_PRESET_RULES),
  });

  const parseRenderPresetJson = (jsonText: string): { name: string; description: string; rules: RenderPresetRules } => {
    const parsed = parseJsoncRecord(jsonText, '渲染预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== RENDER_PRESET_FORMAT) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawRules = 'rules' in parsed ? parsed.rules : parsed;
    const rules = normalizeRenderPresetRules(rawRules);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的渲染预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, rules };
  };

  const createRenderPresetEditorTemplate = createCreateRenderPresetEditorTemplate({
    DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST: DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const RenderPresetManager = createRenderPresetManager({
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    createBuiltinRenderPreset: (...a: any[]) => createBuiltinRenderPreset(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    isSameKeywordSet: (...a: any[]) => isSameKeywordSet(...a),
    normalizeRenderPresetRules: (...a: any[]) => normalizeRenderPresetRules(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    parseRenderPresetJson: (...a: any[]) => parseRenderPresetJson(...a),
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
    LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
    RENDER_DEFAULT_PRESET_ID: RENDER_DEFAULT_PRESET_ID,
    RENDER_LEGACY_BLACKLIST_PRESET_ID: RENDER_LEGACY_BLACKLIST_PRESET_ID,
    RENDER_PRESET_FORMAT: RENDER_PRESET_FORMAT,
    STORAGE_KEY_ACTIVE_RENDER_PRESET: STORAGE_KEY_ACTIVE_RENDER_PRESET,
    STORAGE_KEY_BLACKLIST: STORAGE_KEY_BLACKLIST,
    STORAGE_KEY_RENDER_PRESETS: STORAGE_KEY_RENDER_PRESETS,
    STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED: STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED,
  });

  // ========================================
  // PresetManager - 验证规则预设管理
  // ========================================



  const PresetManager = createPresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getValidationRuleManager: () => ValidationRuleManager,
    BUILTIN_VALIDATION_RULES: BUILTIN_VALIDATION_RULES,
    STORAGE_KEY_ACTIVE_PRESET: STORAGE_KEY_ACTIVE_PRESET,
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
    STORAGE_KEY_VALIDATION_RULES: STORAGE_KEY_VALIDATION_RULES,
  });
  // 验证规则管理器（从 PresetManager 获取规则）
  const ValidationRuleManager = createValidationRuleManager({
    isNpcTableName: (...a: any[]) => isNpcTableName(...a),
    getPresetManager: () => PresetManager,
    STORAGE_KEY_VALIDATION_ENABLED: STORAGE_KEY_VALIDATION_ENABLED,
  });
  // ========================================
  // RegexTransformationManager - 表格正则规则管理器 (Phase 1.2)
  // ========================================
  const RegexTransformationManager = createRegexTransformationManager({
    filterDeprecatedBuiltinRegexRules: (...a: any[]) => filterDeprecatedBuiltinRegexRules(...a),
    getRegexPresetManager: () => RegexPresetManager,
    STORAGE_KEY_REGEX_ENABLED: STORAGE_KEY_REGEX_ENABLED,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
  });
  // ========================================
  // RegexPresetManager - 表格正则预设管理器 (Phase 1.3)
  // ========================================
  const RegexPresetManager = createRegexPresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    filterDeprecatedBuiltinRegexRules: (...a: any[]) => filterDeprecatedBuiltinRegexRules(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getRegexTransformationManager: () => RegexTransformationManager,
    BUILTIN_REGEX_RULES: BUILTIN_REGEX_RULES,
    STORAGE_KEY_REGEX_ACTIVE_PRESET: STORAGE_KEY_REGEX_ACTIVE_PRESET,
    STORAGE_KEY_REGEX_PRESETS: STORAGE_KEY_REGEX_PRESETS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
  });
  // ========================================
  // RegexTransformationEngine - 正则转换引擎 (Phase 2.1)
  // ========================================
  const RegexTransformationEngine = createRegexTransformationEngine({
    getRegexTransformationManager: () => RegexTransformationManager,
  });
  // ========================================
  // ValidationEngine - 数据验证引擎
  // ========================================
  const ValidationEngine = createValidationEngine({
    isNpcTableName: (...a: any[]) => isNpcTableName(...a),
    getValidationRuleManager: () => ValidationRuleManager,
  });
  // ========================================
  // LocalAvatarDB - 本地头像 IndexedDB 存储
  // ========================================
  // ========================================
  // FavoritesDB - 收藏夹 IndexedDB 存储
  // ========================================
  /**
   * @typedef {Object} FavoriteItem
   * @property {string} id - UUID
   * @property {string[]} header - 列名数组 (不含首列null)
   * @property {(string|number)[]} rowData - 值数组 (与header对应)
   * @property {string[]} tags - 用户标签
   * @property {number} createdAt - 创建时间戳
   * @property {number} updatedAt - 最后修改时间戳
   * @property {{tableUid: string, tableName: string, chatId: string}} [sourceInfo] - 来源信息
   */
  interface FavoriteItem {
    id: string;
    header: string[];
    rowData: (string | number)[];
    tags: string[];
    createdAt: number;
    updatedAt: number;
    sourceInfo?: {
      tableUid: string;
      tableName: string;
      chatId: string;
    };
  }


  type DiceHistoryEventType = 'check' | 'contest';

  interface DiceHistoryStatRecord {
    id?: number;
    eventType: DiceHistoryEventType;
    timestamp: number;
    chatId: string;
    characterId: string;
    success: boolean;
    attrName: string;
    formula: string;
    total: number;
    target: number;
    outcomeText: string;
  }

  interface DiceHistoryStatsSummary {
    total: number;
    checks: number;
    contests: number;
    checkSuccess: number;
    checkSuccessRate: number;
  }

  const DiceHistoryStatsDB = createDiceHistoryStatsDB({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
  });
  // ========================================
  // FavoritesManager - 收藏夹业务逻辑层
  // ========================================

  interface TableCompatibility {
    tableUid: string;
    tableName: string;
    mode: 'strict' | 'loose' | 'incompatible';
    matchedCols: string[];
    unmatchedCols: string[];
    matchRatio: number;
  }


  // [新增] 获取 SillyTavern 用户头像 URL
  const getUserAvatarUrl = () => {
    try {
      // 方法1: 从页面 DOM 中查找用户头像元素
      const w = window.parent || window;
      const $ = w.jQuery || window.jQuery;
      if ($) {
        // SillyTavern 用户头像通常在 #user_avatar_block img 或 .avatar[title="You"] img
        const $avatar = $('#user_avatar_block img').first();
        if ($avatar.length && $avatar.attr('src')) {
          return $avatar.attr('src');
        }
        // 备选：查找聊天中用户消息的头像
        const $userMes = $('.mes[is_user="true"]').last().find('.avatar img');
        if ($userMes.length && $userMes.attr('src')) {
          return $userMes.attr('src');
        }
      }
      // 方法2: 尝试从 SillyTavern API 获取
      const ST = w.SillyTavern || window.SillyTavern;
      if (ST && ST.getContext) {
        const ctx = ST.getContext();
        if (ctx && ctx.userAvatar) {
          return ctx.userAvatar;
        }
      }
    } catch (e) {
      console.warn('[DICE]ACU getUserAvatarUrl error:', e);
    }
    return null;
  };

  // [新增] 获取主角名字（用于判断是否是主角）
  const getPlayerName = () => {
    const rawData = cachedRawData || (typeof getTableData === 'function' ? getTableData() : null);
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          const headers = sheet.content[0] || [];
          const displayName = getRowDisplayName(sheet.content[1], headers);
          if (displayName) return displayName;
        }
      }
    }
    return null;
  };

  // [新增] 获取 SillyTavern Persona 名称（用于显示）
  const getPersonaName = () => {
    try {
      // 方法1: SillyTavern 标准 API
      const w = window.parent || window;
      if (w.SillyTavern?.getContext) {
        const ctx = w.SillyTavern.getContext();
        if (ctx?.name1) return ctx.name1;
      }
      // 方法2: 直接访问全局变量
      if (typeof name1 !== 'undefined' && name1) return name1;
      if (w.name1) return w.name1;
      // 方法3: 从 DOM 中查找
      const $ = w.jQuery || window.jQuery;
      if ($) {
        const $persona = $('#user_avatar_block .avatar-name, #persona_name_input').first();
        if ($persona.length) {
          const name = $persona.val?.() || $persona.text?.();
          if (name && name.trim()) return name.trim();
        }
      }
    } catch (e) {
      console.warn('[DICE]ACU getPersonaName error:', e);
    }
    return null;
  };

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = () => {
    return getPersonaName() || getPlayerName() || '主角';
  };

  // [新增] 替换文本中的用户占位符为 Persona 名称（仅用于显示）
  const replaceUserPlaceholders = text => {
    if (!text || typeof text !== 'string') return text;
    const displayName = getDisplayPlayerName();
    // 替换 <user>、{{user}}（不区分大小写）
    let result = text.replace(/<user>/gi, displayName);
    result = result.replace(/\{\{user\}\}/gi, displayName);
    return result;
  };

  const USER_AVATAR_LOOKUP_KEYS = ['{{user}}', '<user>'] as const;

  const getAvatarLookupNames = (name: unknown): string[] => {
    const originalName = String(name || '').trim();
    const names = originalName ? [originalName] : [];
    const playerName = String(getPlayerName() || '').trim();
    const personaName = String(getPersonaName() || '').trim();
    const lowerName = originalName.toLowerCase();
    const autoMergeProtagonist = getDiceConfig().autoMergeProtagonist !== false;
    const isUserAvatar =
      USER_AVATAR_LOOKUP_KEYS.some(key => key.toLowerCase() === lowerName) ||
      (autoMergeProtagonist && originalName === '主角') ||
      (autoMergeProtagonist && Boolean(playerName) && originalName === playerName) ||
      (personaName ? originalName === personaName : false);

    if (isUserAvatar) {
      names.push(...USER_AVATAR_LOOKUP_KEYS);
    }

    return [...new Set(names.filter(Boolean))];
  };

  type DiceStatsScope = 'chat' | 'character' | 'global';

  interface DiceStatsContext {
    chatId: string;
    characterId: string;
  }

  const getDiceStatsContext = createGetDiceStatsContext({

  });

  const DICE_STATS_SCOPE_LABELS: Record<DiceStatsScope, string> = {
    chat: '本聊天',
    character: '本角色卡',
    global: '全局',
  };

  const isDiceStatsScopeUnavailable = (scope: DiceStatsScope, context: DiceStatsContext): boolean =>
    (scope === 'chat' && context.chatId === 'unknown_chat') ||
    (scope === 'character' && context.characterId === 'unknown_character');

  const renderDiceHistoryStatsHtml = (
    allStats: Record<DiceStatsScope, DiceHistoryStatsSummary>,
    scope: DiceStatsScope,
  ): string => {
    const activeStats = allStats[scope];
    const scopeUnavailable = isDiceStatsScopeUnavailable(scope, getDiceStatsContext());
    return `
      <div class="acu-history-stats-grid">
        <div class="acu-history-stat-card"><small>本聊天</small><strong>${allStats.chat.total}</strong></div>
        <div class="acu-history-stat-card"><small>本角色卡</small><strong>${allStats.character.total}</strong></div>
        <div class="acu-history-stat-card"><small>全局</small><strong>${allStats.global.total}</strong></div>
      </div>
      <div class="acu-history-stats-summary">
        <span>当前统计范围：${DICE_STATS_SCOPE_LABELS[scope]}</span>
        <div class="acu-history-stats-values">
          <span>总数：<b>${activeStats.total}</b></span>
          <span>普通：<b>${activeStats.checks}</b></span>
          <span>对抗：<b>${activeStats.contests}</b></span>
          <span>成功率：<b class="is-success">${activeStats.checkSuccessRate}%</b></span>
        </div>
      </div>
      ${scopeUnavailable ? '<div class="acu-history-scope-note">当前环境未识别到该范围ID，仅显示已识别范围数据。</div>' : ''}
    `;
  };

  type AvatarImageColorSource = 'manual' | 'auto';

  const normalizeAvatarHexColor = (value: unknown): string | null => {
    const raw = String(value ?? '').trim();
    const hex = raw.startsWith('#') ? raw.slice(1) : raw;
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      return `#${hex
        .split('')
        .map(char => `${char}${char}`)
        .join('')
        .toUpperCase()}`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      return `#${hex.toUpperCase()}`;
    }
    return null;
  };

  const clampAvatarNumber = (value: unknown, min: number, max: number, fallback: number): number => {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, num));
  };

  const rgbToAvatarHex = (r: number, g: number, b: number): string => {
    const toHex = (value: number) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const avatarHexToRgb = (value: unknown): { r: number; g: number; b: number } | null => {
    const color = normalizeAvatarHexColor(value);
    if (!color) return null;
    return {
      r: Number.parseInt(color.slice(1, 3), 16),
      g: Number.parseInt(color.slice(3, 5), 16),
      b: Number.parseInt(color.slice(5, 7), 16),
    };
  };

  const rgbToAvatarHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;
    if (delta === 0) return { h: 0, s: 0, l };
    const s = delta / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    return { h: (h * 60 + 360) % 360, s, l };
  };

  const avatarHexToHsl = (value: unknown): { h: number; s: number; l: number } | null => {
    const rgb = avatarHexToRgb(value);
    if (!rgb) return null;
    return rgbToAvatarHsl(rgb.r, rgb.g, rgb.b);
  };

  const hslToAvatarHex = (h: number, s: number, l: number): string => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;
    if (hp >= 0 && hp < 1) {
      r1 = c;
      g1 = x;
    } else if (hp < 2) {
      r1 = x;
      g1 = c;
    } else if (hp < 3) {
      g1 = c;
      b1 = x;
    } else if (hp < 4) {
      g1 = x;
      b1 = c;
    } else if (hp < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }
    const m = l - c / 2;
    return rgbToAvatarHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
  };

  const getAvatarFallbackColor = (name: unknown): string => {
    const text = String(name ?? '').trim() || 'avatar';
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 0.54 + ((hash >>> 8) % 18) / 100;
    const lightness = 0.46 + ((hash >>> 16) % 14) / 100;
    return hslToAvatarHex(hue, saturation, lightness);
  };

  const isLikelyAvatarSkinTone = (h: number, s: number, l: number): boolean => {
    return h >= 16 && h <= 52 && s >= 0.18 && s <= 0.72 && l >= 0.34 && l <= 0.84;
  };

  const normalizeInferredAvatarColor = (r: number, g: number, b: number): string => {
    const hsl = rgbToAvatarHsl(r, g, b);
    const s = Math.max(0.28, Math.min(0.72, hsl.s));
    const l = Math.max(0.34, Math.min(0.66, hsl.l));
    return hslToAvatarHex(hsl.h, s, l);
  };

  const loadAvatarImageForColor = (source: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      if (!/^(blob|data):/i.test(source)) {
        image.crossOrigin = 'anonymous';
      }
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('头像图片无法读取'));
      image.src = source;
    });

  const inferAvatarImageColor = createInferAvatarImageColor({
    clampAvatarNumber: (...a: any[]) => clampAvatarNumber(...a),
    isLikelyAvatarSkinTone: (...a: any[]) => isLikelyAvatarSkinTone(...a),
    loadAvatarImageForColor: (...a: any[]) => loadAvatarImageForColor(...a),
    normalizeInferredAvatarColor: (...a: any[]) => normalizeInferredAvatarColor(...a),
    rgbToAvatarHsl: (...a: any[]) => rgbToAvatarHsl(...a),
  });

  // 头像管理工具（支持裁剪偏移）
  const AvatarManager = createAvatarManager({
    storeGet: (key: string, fallback: any) => Store.get(key, fallback),
    storeSet: (key: string, value: any) => Store.set(key, value),
    storageKey: STORAGE_KEY_AVATAR_MAP,
    normalizeStorableImageUrl: (url: unknown) => normalizeStorableImageUrl(url),
    normalizeAvatarHexColor: (value: unknown) => normalizeAvatarHexColor(value),
    getAvatarFallbackColor: (name: unknown) => getAvatarFallbackColor(name),
    getAvatarLookupNames: (name: unknown) => getAvatarLookupNames(name),
    localAvatarGet: (name: any) => LocalAvatarDB.get(name),
    localAvatarHas: (name: any) => LocalAvatarDB.has(name),
    localAvatarSave: (name: any, blob: any) => LocalAvatarDB.save(name, blob),
    localAvatarDelete: (name: any) => LocalAvatarDB.delete(name),
  });

  // ========================================
  // 角色名称解析与别名系统
  // ========================================

  /**
   * 解析逗号分隔的角色名称，提取主名称（display name）和别名
   * 规则：最长的名称为主key，长度相同时靠前的优先
   * 例如："千早爱音,千早,爱音" → { displayName: "千早爱音", aliases: ["千早", "爱音"] }
   * 例如："奥兹艾萨克，奥兹，艾萨克" → { displayName: "奥兹艾萨克", aliases: ["奥兹", "艾萨克"] }
   */
  const NameAliasRegistry = new NameAliasRegistryCore({
    getManualPrimaryName: (name: string) => AvatarManager.getPrimaryName(name),
    getAvatarMap: () => AvatarManager.load() as Record<string, { aliases?: unknown[] } | undefined>,
  });

  const USER_NODE_KEY = '{{user}}';
  const USER_PLACEHOLDER_KEYS = [USER_NODE_KEY, '<user>'];

  const isUserPlaceholderKey = (name: string): boolean =>
    USER_PLACEHOLDER_KEYS.some(key => name.toLowerCase() === key.toLowerCase());

  type DiceTableCell = string | number | null;
  type DiceRawSheet = { name?: string; content?: DiceTableCell[][] };
  type DiceRawData = Record<string, DiceRawSheet>;

  interface CharacterAttributeRowLookup {
    sheetKey: string;
    sheet: { name?: string; content: DiceTableCell[][] };
    rowIndex: number;
    headers: DiceTableCell[];
    isUser: boolean;
  }

  const normalizeCharacterNameForCompare = (value: unknown): string => {
    return getDisplayName(String(value ?? '').trim())
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };

  const pushUniqueNameCandidate = (candidates: string[], value: unknown): void => {
    const name = String(value ?? '').trim();
    if (!name) return;
    if (!candidates.includes(name)) candidates.push(name);
  };

  const getAvatarManualAliases = (name: string): string[] => {
    if (!name) return [];
    const avatarMap = AvatarManager.load() as Record<string, { aliases?: unknown[] } | undefined>;
    const data = avatarMap[name];
    if (!data || !Array.isArray(data.aliases)) return [];
    return data.aliases.map(alias => String(alias ?? '').trim()).filter(Boolean);
  };

  const getCharacterNameCandidates = (name: unknown, includeResolved = true): string[] => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return [];

    const candidates: string[] = [];
    const addParsedName = (value: string): void => {
      const parsed = parseCharacterName(value);
      pushUniqueNameCandidate(candidates, value);
      pushUniqueNameCandidate(candidates, parsed.displayName);
      parsed.aliases.forEach(alias => pushUniqueNameCandidate(candidates, alias));
    };

    addParsedName(rawName);

    const replacedName = replaceUserPlaceholders(rawName);
    if (typeof replacedName === 'string' && replacedName !== rawName) {
      addParsedName(replacedName);
    }

    const displayName = getDisplayName(rawName);
    const replacedDisplayName = replaceUserPlaceholders(displayName);
    if (typeof replacedDisplayName === 'string' && replacedDisplayName !== displayName) {
      addParsedName(replacedDisplayName);
    }

    getAvatarManualAliases(rawName).forEach(alias => addParsedName(alias));
    if (displayName !== rawName) {
      getAvatarManualAliases(displayName).forEach(alias => addParsedName(alias));
    }

    if (includeResolved) {
      const resolvedName = NameAliasRegistry.resolve(rawName);
      if (resolvedName && resolvedName !== rawName) {
        addParsedName(resolvedName);
      }
    }

    return candidates;
  };

  const getUserCharacterNameCandidates = (): string[] => {
    const seeds: string[] = [...USER_PLACEHOLDER_KEYS, '主角'];
    [getPlayerName(), getPersonaName(), getDisplayPlayerName()].forEach(name => pushUniqueNameCandidate(seeds, name));
    USER_PLACEHOLDER_KEYS.forEach(key =>
      getAvatarManualAliases(key).forEach(alias => pushUniqueNameCandidate(seeds, alias)),
    );

    const candidates: string[] = [];
    seeds.forEach(seed => {
      getCharacterNameCandidates(seed).forEach(candidate => pushUniqueNameCandidate(candidates, candidate));
    });
    return candidates;
  };

  const isUserCharacterName = (name: unknown): boolean => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return true;

    const userKeys = new Set(getUserCharacterNameCandidates().map(normalizeCharacterNameForCompare).filter(Boolean));
    return getCharacterNameCandidates(rawName).some(candidate => {
      const key = normalizeCharacterNameForCompare(candidate);
      return Boolean(key) && userKeys.has(key);
    });
  };

  const resolveCanonicalCharacterName = (name: unknown): string => {
    const rawName = String(name ?? '').trim();
    if (!rawName || isUserCharacterName(rawName)) return '<user>';
    return NameAliasRegistry.resolve(rawName);
  };

  const characterNamesMatch = (storedName: unknown, lookupName: unknown): boolean => {
    const lookupRaw = String(lookupName ?? '').trim();
    if (!lookupRaw) return isUserCharacterName(storedName);

    const storedIsUser = isUserCharacterName(storedName);
    const lookupIsUser = isUserCharacterName(lookupRaw);
    if (storedIsUser || lookupIsUser) return storedIsUser && lookupIsUser;

    const storedKeys = new Set(
      getCharacterNameCandidates(storedName).map(normalizeCharacterNameForCompare).filter(Boolean),
    );
    return getCharacterNameCandidates(lookupRaw).some(candidate => {
      const key = normalizeCharacterNameForCompare(candidate);
      return Boolean(key) && storedKeys.has(key);
    });
  };

  const dialogueIndentRenderer = createDialogueIndentRenderer({
    getConfig: () => getConfig(),
    getDefaultTheme: () => String(DEFAULT_CONFIG.theme),
    getCachedRawData: () => cachedRawData,
    getTableData: () => getTableData({ silent: true }),
    processJsonData: json => processJsonData(json),
    rebuildNameAliases: tables => NameAliasRegistry.rebuild(tables),
    getNameAliases: name => NameAliasRegistry.getAliases(name),
    resolveNameAlias: name => NameAliasRegistry.resolve(name),
    getAvatarLookupNames: name => getAvatarLookupNames(name),
    getAvatarAll: () => AvatarManager.getAll() as Record<string, { aliases?: unknown[] } | undefined>,
    getAvatarPrimaryName: name => AvatarManager.getPrimaryName(name),
    getAvatarAsync: name => AvatarManager.getAsync(name),
    getAvatarOffsetX: name => AvatarManager.getOffsetX(name),
    getAvatarOffsetY: name => AvatarManager.getOffsetY(name),
    getAvatarScale: name => AvatarManager.getScale(name),
    getAvatarImageColor: name => AvatarManager.getImageColor(name),
    getLocalAvatarNames: () => LocalAvatarDB.getAllNames() as Promise<string[]>,
    getTagFilter: () => RenderPresetManager.getDialogueIndentTagFilter(),
    isCharacterTable,
    findNameColumnIndex,
    getCharacterNameCandidates,
    getDisplayName,
    replaceUserPlaceholders: text => replaceUserPlaceholders(text),
    escapeHtml,
    formatMessageBeforeDialogueIndent: text => {
      let processedText = text;
      if (typeof substitudeMacros === 'function') {
        processedText = substitudeMacros(processedText);
      }
      if (typeof formatAsTavernRegexedString === 'function') {
        return String(formatAsTavernRegexedString(processedText, 'ai_output', 'display', { depth: 0 }));
      }
      return processedText;
    },
    formatRegexedMessageFragment: text => {
      if (typeof builtin !== 'undefined' && typeof builtin.renderMarkdown === 'function') {
        return builtin.renderMarkdown(text);
      }
      return escapeHtml(text).replace(/\n/g, '<br>');
    },
    getHostDocument: () => getTavernHostDocument(),
    getJQuery: () => $,
    retrieveDisplayedMessage: messageId => {
      if (typeof retrieveDisplayedMessage !== 'function') return null;
      try {
        return retrieveDisplayedMessage(messageId);
      } catch (error) {
        console.warn('[DICE]正文头像渲染获取显示楼层失败，改用选择器:', error);
        return null;
      }
    },
    emitMessageRendered: messageId => {
      try {
        const source = window.SillyTavern?.eventSource;
        const events = window.SillyTavern?.eventTypes || window.tavern_events;
        const eventName = events?.CHARACTER_MESSAGE_RENDERED;
        if (source && eventName) {
          void source.emit(eventName, Number(messageId));
        }
      } catch (error) {
        console.warn('[DICE]正文头像渲染通知前端块重新渲染失败:', error);
      }
    },
    getLatestAssistantMessage: () => {
      try {
        const messages = getChatMessages(-1);
        const latest = Array.isArray(messages) ? messages[0] : null;
        if (!latest || latest.role !== 'assistant' || latest.is_system || latest.is_hidden) return null;
        return latest;
      } catch (error) {
        console.warn('[DICE]正文头像渲染读取最新楼层失败:', error);
        return null;
      }
    },
    warn: (message, error) => console.warn(`[DICE]${message}:`, error),
  });

  const scheduleDialogueIndentRender = (): void => dialogueIndentRenderer.schedule();
  const refreshDialogueIndentRender = (): void => dialogueIndentRenderer.refreshNow();

  const isPlayerTableName = (tableName: string): boolean => {
    const normalized = String(tableName || '').toLowerCase();
    return tableName.includes('主角') || tableName.includes('玩家') || normalized.includes('player');
  };

  const isNpcLikeTableName = (tableName: string): boolean => {
    const normalized = String(tableName || '').toLowerCase();
    return (
      isNpcTableName(tableName) ||
      tableName.includes('人物') ||
      tableName.includes('NPC') ||
      tableName.includes('角色') ||
      tableName.includes('对象') ||
      normalized.includes('character')
    );
  };

  const findAttributeColumnIndices = (headers: unknown[], includeSkill = false): number[] => {
    const cols: number[] = [];
    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('属性') || (includeSkill && text.includes('技能'))) {
        cols.push(idx);
      }
    });
    return cols;
  };

  const pickFallbackAttributeColumn = (cols: number[], headers: unknown[]): number => {
    if (cols.length === 0) return -1;
    const baseCol = cols.find(col => String(headers[col] || '').includes('基础属性'));
    if (baseCol !== undefined) return baseCol;
    const specialCol = cols.find(col => {
      const text = String(headers[col] || '');
      return text.includes('特有属性') || text.includes('特别属性');
    });
    if (specialCol !== undefined) return specialCol;
    return cols[0];
  };

  const findPrimaryAttributeColumns = (headers: unknown[]): { baseColIndex: number; specialColIndex: number } => {
    let baseColIndex = -1;
    let specialColIndex = -1;

    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('基础属性')) {
        baseColIndex = idx;
      } else if (text.includes('特有属性') || text.includes('特别属性')) {
        specialColIndex = idx;
      }
    });

    if (baseColIndex < 0) {
      const genericCol = findAttributeColumnIndices(headers).find(col => {
        const text = String(headers[col] || '');
        return !text.includes('特有') && !text.includes('特别');
      });
      baseColIndex = genericCol ?? -1;
    }

    return { baseColIndex, specialColIndex };
  };

  const findCharacterAttributeRow = createFindCharacterAttributeRow({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    isNpcLikeTableName: (...a: any[]) => isNpcLikeTableName(...a),
    isPlayerTableName: (...a: any[]) => isPlayerTableName(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
  });

  const resolveUserGraphName = (name: string): string => {
    const displayName = getDisplayName(String(name || '').trim());
    if (!displayName) return displayName;

    const avatarPrimary = AvatarManager.getPrimaryName(displayName);
    if (
      isUserPlaceholderKey(displayName) ||
      isUserPlaceholderKey(avatarPrimary) ||
      isUserCharacterName(displayName) ||
      isUserCharacterName(avatarPrimary)
    ) {
      return USER_NODE_KEY;
    }

    const userAliases = new Set<string>(USER_PLACEHOLDER_KEYS);
    USER_PLACEHOLDER_KEYS.forEach(key => {
      const aliases = AvatarManager.load()[key]?.aliases || [];
      aliases.forEach(alias => {
        if (alias) userAliases.add(alias);
      });
    });

    const personaName = getPersonaName();
    if (personaName) userAliases.add(getDisplayName(personaName));

    const diceCfg = getDiceConfig();
    if (diceCfg.autoMergeProtagonist !== false) {
      userAliases.add('主角');
      const playerName = getPlayerName();
      if (playerName) userAliases.add(getDisplayName(playerName));
    }

    const normalizedUserAliases = [...userAliases].map(alias => alias.toLowerCase());
    const candidates = [displayName, avatarPrimary, NameAliasRegistry.resolve(displayName)]
      .filter(Boolean)
      .map(candidate => candidate.toLowerCase());

    if (candidates.some(candidate => normalizedUserAliases.includes(candidate))) {
      return USER_NODE_KEY;
    }

    return avatarPrimary;
  };

  // 渲染图标：支持 fa:xxx 简写格式和原生emoji
  const renderIcon = (icon: string | null): string => {
    if (!icon) return '';
    if (icon.startsWith('fa:')) {
      const name = icon.slice(3);
      return `<i class="fa-solid fa-${name} acu-icon"></i>`;
    }
    if (icon.startsWith('ti:')) {
      const name = icon.slice(3);
      return `<i class="ti ti-${name} acu-icon"></i>`;
    }
    return escapeHtml(icon); // 原样返回emoji
  };

  const getLocationEmoji = name => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    for (const [pattern, emoji] of LOCATION_EMOJI_MAP) {
      if (pattern.test(lowerName)) return emoji;
    }
    return null;
  };

  // 获取地点名的所有候选emoji（用于去重分配）
  const getEmojiCandidates = (name: string): string[] => {
    if (!name) return [];
    const lowerName = name.toLowerCase();
    const candidates: string[] = [];
    for (const [pattern, emoji] of LOCATION_EMOJI_MAP) {
      if (pattern.test(lowerName)) {
        candidates.push(emoji);
      }
    }
    return candidates;
  };

  // 批量分配emoji，实现去重（最短名称优先）
  const resolveBatchLocationEmojis = (names: string[]): Map<string, string | null> => {
    // 1. 计算每个地点的候选列表
    const candidatesMap = new Map<string, string[]>();
    for (const name of names) {
      candidatesMap.set(name, getEmojiCandidates(name));
    }

    // 2. 按长度排序（最短优先），同长度按字母序
    const sortedNames = [...names].sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });

    // 3. 贪心分配
    const usedEmojis = new Set<string>();
    const result = new Map<string, string | null>();

    for (const name of sortedNames) {
      const candidates = candidatesMap.get(name) || [];
      const available = candidates.find(e => !usedEmojis.has(e));
      if (available) {
        result.set(name, available);
        usedEmojis.add(available);
      } else {
        // 所有候选都被占用，回退到第一个候选（允许重复显示）
        result.set(name, candidates.length > 0 ? candidates[0] : null);
      }
    }

    return result;
  };

  const getElementEmoji = (name, type) => {
    if (!name && !type) return null;
    const lowerName = name?.toLowerCase();
    const lowerType = type?.toLowerCase();
    for (const [pattern, emoji] of ELEMENT_EMOJI_MAP) {
      if (lowerName && pattern.test(lowerName)) return emoji;
    }
    for (const [pattern, emoji] of ELEMENT_EMOJI_MAP) {
      if (lowerType && pattern.test(lowerType)) return emoji;
    }
    return null;
  };

  const renderThemeIconContent = (icon: string | null | undefined): string => {
    if (!icon) return '<i class="fa-solid fa-cube"></i>';
    if (icon.startsWith('fa:')) {
      return `<i class="fa-solid fa-${icon.slice(3)}"></i>`;
    }
    if (icon.startsWith('ti:')) {
      return `<i class="ti ti-${icon.slice(3)}"></i>`;
    }
    return escapeHtml(icon);
  };

  const createCustomTableNameIconContext = (
    moduleId:
      | 'table-name'
      | 'item'
      | 'equipment'
      | 'faction'
      | 'shop'
      | 'global-interaction-panel'
      | 'global-interaction-map-marker',
    tableName: unknown,
    section: 'table' | 'item' | 'equipment' | 'faction' | 'shop' | 'map' | 'task' | 'skill' | 'generic',
    name: unknown,
  ): CustomTableNameIconContext => ({
    moduleId,
    tableName: String(tableName ?? '').trim(),
    section,
    name: String(name ?? '').trim(),
  });

  const createGlobalInteractionCustomTableNameIconContext = (
    tableName: unknown,
    name: unknown,
  ): CustomTableNameIconContext | null => {
    const normalizedTableName = String(tableName ?? '').trim();
    const normalizedName = String(name ?? '').trim();
    if (!normalizedTableName || !normalizedName) return null;
    const dashboardContextInfo = resolveDashboardCustomTableNameIconContextInfo(normalizedTableName);
    if (dashboardContextInfo) {
      return createCustomTableNameIconContext(
        dashboardContextInfo.moduleId,
        normalizedTableName,
        dashboardContextInfo.section,
        normalizedName,
      );
    }
    const meta = resolveGlobalInteractionSectionMeta(normalizedTableName);
    const section = meta.kind as CustomTableNameIconSection;
    if (section === 'character') return null;
    const moduleId = section === 'map' ? 'global-interaction-map-marker' : 'global-interaction-panel';
    return createCustomTableNameIconContext(moduleId, normalizedTableName, section, normalizedName);
  };

  const renderAsyncImageIconSlotContent = (
    fallbackContent: string,
    options: { url?: string | null; localKey?: string | null },
  ): string => {
    const url = String(options.url || '').trim();
    const localKey = String(options.localKey || '').trim();
    if (!url && !localKey) return fallbackContent;
    const sourceClass = url ? 'acu-custom-table-name-url-icon' : 'acu-custom-table-name-local-icon';
    const sourceAttr = url
      ? ` data-custom-table-name-icon-url="${escapeHtml(url)}"`
      : ` data-custom-table-name-icon-local-key="${escapeHtml(localKey)}"`;
    return `<span class="acu-custom-table-name-icon-slot acu-custom-table-name-icon ${sourceClass}"${sourceAttr} style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:inherit;overflow:hidden;">${fallbackContent}</span>`;
  };

  const renderCustomTableNameIconContent = (
    fallbackContent: string,
    context?: CustomTableNameIconContext | null,
  ): string => {
    const resolved = resolveCustomTableNameIcon('fa-table', context);
    if (!resolved.entry) return fallbackContent;
    if (resolved.entry.sourceType === 'url') {
      const url = String(resolved.entry.imageUrl || '').trim();
      if (!url || !isCustomTableNameIconImageUrlValid(url) || CustomTableNameIconImageDB.hasUrlFailed(url)) {
        return fallbackContent;
      }
      return renderAsyncImageIconSlotContent(fallbackContent, { url });
    }
    const localKey = String(resolved.entry.localIconKey || '').trim();
    if (!localKey || CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return fallbackContent;
    return renderAsyncImageIconSlotContent(fallbackContent, { localKey });
  };

  const getGachaItemCustomTableNameIconContext = (
    item: Pick<GachaItemDefinition, 'name' | 'rewardTarget' | 'targetTable' | 'targetColumns'>,
    rawDataOverride?: unknown,
  ): CustomTableNameIconContext | null => {
    const target: GachaRewardTarget = item.rewardTarget === 'equipment' ? 'equipment' : 'inventory';
    let tableName = getGachaRewardTargetTableLabel(target);
    try {
      const parsed = getGachaRewardParseResult(
        rawDataOverride || cachedRawData || getTableData(),
        target,
        getGachaRewardTargetOptions(item),
      );
      tableName = parsed.tableName || tableName;
    } catch {
      tableName = normalizeGachaTargetTable(item.targetTable) || tableName;
    }
    return createCustomTableNameIconContext(
      target === 'equipment' ? 'equipment' : 'item',
      tableName,
      target === 'equipment' ? 'equipment' : 'item',
      item.name,
    );
  };

  const renderGachaItemIconContent = (
    item: Pick<GachaItemDefinition, 'name' | 'type' | 'icon'>,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const fallback = renderThemeIconContent(item.icon || getElementEmoji(item.name, item.type));
    return renderCustomTableNameIconContent(fallback, customContext);
  };

  const applyAsyncImageUrlToElement = createApplyAsyncImageUrlToElement({
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
  });

  const hydrateCustomTableNameIconsIn = (root: HTMLElement | JQuery<HTMLElement> | Document = document) => {
    const rootEl = root instanceof HTMLElement || root instanceof Document ? root : root[0];
    if (!rootEl) return;
    rootEl
      .querySelectorAll<HTMLElement>('.acu-custom-table-name-url-icon[data-custom-table-name-icon-url]')
      .forEach(element => {
        const url = String(element.dataset.customTableNameIconUrl || '').trim();
        if (!url || !isCustomTableNameIconImageUrlValid(url) || CustomTableNameIconImageDB.hasUrlFailed(url)) return;
        applyAsyncImageUrlToElement(element, url, 'customTableNameIconResolvedUrl', {
          onError: () => {
            CustomTableNameIconImageDB.markUrlFailed(url);
          },
        });
      });
    rootEl
      .querySelectorAll<HTMLElement>('.acu-custom-table-name-local-icon[data-custom-table-name-icon-local-key]')
      .forEach(element => {
        const localKey = String(element.dataset.customTableNameIconLocalKey || '').trim();
        if (!localKey || CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return;
        void CustomTableNameIconImageDB.get(localKey)
          .then(url => {
            if (!url) {
              CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
              return;
            }
            if (!element.isConnected) return;
            applyAsyncImageUrlToElement(element, url, 'customTableNameIconResolvedUrl', {
              onError: () => {
                CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
              },
            });
          })
          .catch(() => {
            CustomTableNameIconImageDB.markLocalKeyFailed(localKey);
          });
      });
  };

  // ========================================
  // MVU 变量可视化模块 v2.0
  // 独立模块 - 卡片分组式 UI
  // ========================================
  const MvuModule = createMvuModule({
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isNumericCell: (...a: any[]) => isNumericCell(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    RenderPresetManager: RenderPresetManager,
  });
  // MVU 变量可视化模块结束
  // 默认骰子配置（COC规则）

  const getDiceConfig = () => Store.get(STORAGE_KEY_DICE_CONFIG, DEFAULT_DICE_CONFIG);
  const saveDiceConfig = cfg => {
    const oldCfg = getDiceConfig();
    const newCfg = { ...oldCfg, ...cfg };
    Store.set(STORAGE_KEY_DICE_CONFIG, newCfg);
    // 记录配置变更
    const changedKeys = Object.keys(cfg).filter(k => oldCfg[k] !== newCfg[k]);
    if (changedKeys.length > 0) {
      console.info(`[DICE]投骰配置已更新: ${changedKeys.join(', ')}`);
    }
  };

  // [新增] 隐藏用户消息中的投骰结果（也处理输入栏）
  const hideDiceResultsInUserMessages = createHideDiceResultsInUserMessages({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

  // ========================================
  // 高级骰子预设系统
  // ========================================

  /** 多级结果定义 */
  interface OutcomeLevel {
    id: string; // 唯一标识
    name: string; // 显示名称 (如 "大成功")
    condition: string; // 判定表达式 (使用 evaluateCondition 评估)
    priority: number; // 优先级 (数字越小越优先)
    contestRank?: number; // 对抗等级 (可选)
    outputText?: string; // 输出文本模板 (可选)
    displayExpr?: string; // 显示用的算式表达式 (可选,不填则用 condition)
    style?: {
      color?: string;
    };
    /** 触发的效果列表 */
    effects?: Effect[];
  }

  /** 对抗规则配置 */
  interface ContestRule {
    /** 是否禁用对抗检定（如 PbtA 等规则不支持对抗检定） */
    disabled?: boolean;
    mode?: 'rank' | 'value' | 'margin' | 'custom'; // 对抗模式
    tieBreakers?: string[]; // 链式平局处理规则
    tieBreaker?: string; // 旧版单一平局处理(兼容)
    customExpr?: string; // 自定义表达式 (mode='custom' 时使用)
    hideDc?: boolean; // 对抗检定时隐藏DC字段
    hideMod?: boolean; // 对抗检定时隐藏修正值字段
    hideSkillMod?: boolean; // 对抗检定时隐藏技能加值字段
  }

  /** 后果系统：效果定义 */
  interface Effect {
    /** 唯一标识 */
    id: string;
    /** 目标属性名 */
    target: string;
    /** 操作类型 */
    operation: 'add' | 'subtract' | 'set';
    /** 变更值 (支持骰子表达式) */
    value: string;
    /** 执行条件表达式 (可选) */
    condition?: string;
    /** 属性不存在时的初始值 (可选) */
    initValue?: number;
    /** 最小值限制 (可选) */
    min?: number;
    /** 最大值限制 (可选) */
    max?: number;
    /** 自定义输出文本 (可选) */
    outputText?: string;
    /** 是否需要用户确认后才执行，默认 true (可选) */
    needsConfirm?: boolean;
    /** 确认输入框的标签文本，如 "成功时扣除" (可选) */
    label?: string;
    /** 确认输入框的占位符文本 (可选) */
    inputPlaceholder?: string;
  }

  /** 后果系统：全局配置 */
  interface EffectsConfig {
    /** 触发模式 (用于识别哪些检定可能触发效果) */
    triggerPatterns: string[];
    /** 允许修改的目标属性 */
    allowedTargets: string[];
    /** 按结果等级分组的效果列表 (可选) */
    outcomes?: {
      [outcomeName: string]: Effect[];
    };
    /** 各结果等级的默认值 (可选) */
    defaultValues?: {
      [outcomeName: string]: string;
    };
  }

  /** 后果系统：资源消耗 (Lucky Burner 等) */
  interface ResourceBurner {
    /** 唯一标识 */
    id: string;
    /** 资源属性名 */
    resourceName: string;
    /** 显示/可用条件 (表达式，如 "$roll > $attr" 仅失败时显示) */
    condition?: string;
    /** 影响目标: roll=修改投骰结果, mod=修改修正值, dc=修改难度, attribute=修改属性值 */
    target: 'roll' | 'mod' | 'dc' | 'attribute';
    /** 转换比例 (如 1点资源 = 1点投骰结果) */
    ratio: number;
    /** 影响方向 (increase=增加目标值, decrease=减少目标值) */
    direction: 'increase' | 'decrease';
    /** 资源操作方向: subtract=消耗/减少资源(默认), add=增加/累积资源 */
    resourceOperation?: 'subtract' | 'add';
    /** 建议消耗量表达式 (如 "$roll.total - $attr"，计算"刚好通过"需消耗的资源量) */
    suggestedAmount?: string;
    /** 适用范围选择器 (用于过滤哪些检定可以使用此消耗器) */
    selector?: CheckSelector;
    /** UI 显示配置 */
    ui?: {
      icon?: string;
      color?: string;
      tooltip?: string;
    };
  }

  interface QuickActionBase {
    /** 唯一标识 */
    id: string;
    /** 图标 (fa- 前缀) */
    icon?: string;
    /** 按钮提示 */
    tooltip?: string;
    /** 显示条件（基于当前面板上下文） */
    condition?: string;
  }

  interface WorkflowQuickAction extends QuickActionBase {
    kind: 'workflow_shortcut';
    config: {
      /** 目标预设ID */
      presetId: string;
      /** 切换时是否沿用当前输入 */
      carryInitiator?: boolean;
      carryAttrName?: boolean;
      carryAttrValue?: boolean;
      carryTarget?: boolean;
      carryModifier?: boolean;
      carrySkillMod?: boolean;
      /** 未沿用属性名时可指定默认属性名 */
      attrName?: string;
      /** 切换后自定义字段默认值 */
      customFieldValues?: Record<string, string | number | boolean>;
    };
  }

  interface AttrShortcutQuickAction extends QuickActionBase {
    kind: 'attr_shortcut';
    config: {
      /** 切换到目标预设（通常是常规检定预设） */
      presetId: string;
      /** 候选属性名（按顺序匹配角色现有属性） */
      attrAliasCandidates: string[];
      /** 未匹配到时的回退属性名 */
      fallbackAttrName?: string;
      /** 是否沿用当前发起者 */
      carryInitiator?: boolean;
      /** 是否沿用当前属性值 */
      carryAttrValue?: boolean;
      /** 是否沿用目标值 */
      carryTarget?: boolean;
      /** 是否沿用修正值 */
      carryModifier?: boolean;
      /** 是否沿用技能加值 */
      carrySkillMod?: boolean;
    };
  }

  type PresetQuickAction = WorkflowQuickAction | AttrShortcutQuickAction;

  interface CurrentAttrAutoUpdate {
    /** 是否启用 */
    enabled?: boolean;
    /** 触发时机 */
    when?: 'success' | 'failure' | 'always';
    /** 属性操作 */
    operation: 'add' | 'subtract' | 'set';
    /** 变化值表达式，支持变量 */
    valueExpr: string;
    /** 属性不存在时初始值 */
    initValue?: number;
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 属性别名候选 */
    aliasCandidates?: string[];
    /** 变化标签（如：成长/增加/减少） */
    changeLabel?: string;
    /** 已填表输出模板（可选）。可用变量：$attr, $attrPlain, $old, $new, $delta, $expr, $rolled, $operation, $changeLabel */
    outputTextTemplate?: string;
  }

  /** 检定范围选择器 (用于 Effects 和 ResourceBurner 的过滤) */
  interface CheckSelector {
    /** 属性名模式匹配 */
    namePatterns?: {
      /** 包含模式，默认 ['*'] 匹配所有 */
      include?: string[];
      /** 排除模式，优先于 include，默认 [] 无排除 */
      exclude?: string[];
    };
    /** 标签匹配 (用于非名称类例外，如 damage/pushed/luck) */
    tags?: {
      /** 包含标签 */
      include?: string[];
      /** 排除标签 */
      exclude?: string[];
    };
  }

  /** 后果系统：执行结果 */
  interface EffectResult {
    /** 效果 ID */
    effectId: string;
    /** 是否执行成功 */
    success: boolean;
    /** 变更前的值 */
    oldValue: number;
    /** 变更后的值 */
    newValue: number;
    /** 错误信息 */
    error?: string;
    /** 目标属性名 */
    target?: string;
    /** 效果链层级（1=一级效果） */
    level?: number;
    /** 触发来源（二级效果ID等） */
    triggerSourceId?: string;
    /** 触发阈值（若有） */
    triggerThreshold?: number;
    /** 触发类型（threshold/delta/primary） */
    triggerType?: 'threshold' | 'delta' | 'primary';
    /** 命中序号（all 模式下可用于追踪） */
    triggerMatchIndex?: number;
    /** 命中总数（all 模式下可用于追踪） */
    triggerMatchCount?: number;
    /** 信息输出文本（由 secondaryEffect.outputText 渲染，非数值变更） */
    outputMessage?: string;
    /** 执行来源分支标识（用于UI和提示词追踪） */
    branchLabel?: string;
    /** 计算公式文本（如 4d4 / 1d6 / 3） */
    formulaText?: string;
    /** 公式掷值（有掷骰时） */
    rolledValue?: number;
  }

  /**
   * 计算后的效果 (用于确认弹窗)
   */
  interface ComputedEffect {
    /** 关联效果ID */
    effectId: string;
    /** 目标属性名 */
    target: string;
    /** 解析后的目标属性名（若有） */
    resolvedTarget?: string;
    /** 计算后的变化值 */
    computedValue: number;
    /** 骰子或数字求值后的绝对值 */
    rolledValue: number;
    /** 原始公式 */
    formula: string;
    /** 展开文本,如 "1d6 → 3" */
    displayText: string;
    /** 执行前数值（若可读取） */
    beforeValue?: number | null;
    /** 执行后数值（若可预测） */
    afterValue?: number | null;
    /** 效果条件原始表达式（为空表示命中分支即执行） */
    conditionExpr?: string;
    /** 效果条件替换变量后的展示文本 */
    resolvedConditionExpr?: string;
    /** 效果条件是否成立 */
    conditionPassed?: boolean;
    /** 效果条件的自然语言说明 */
    conditionSummary?: string;
  }

  interface EffectConfirmUiConfig {
    /** 确认弹窗标题 */
    title?: string;
    /** 效果列表说明文本 */
    effectListTitle?: string;
    /** 分支说明标题 */
    branchReasonLabel?: string;
  }

  /**
   * 检定历史记录扩展字段
   * 用于在 AcuDice.CheckResult 基础上添加效果确认相关状态
   */
  interface CheckHistoryExtension {
    /** 效果执行状态 */
    effectStatus?: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    /** 效果执行结果列表 */
    effectResults?: EffectResult[];
    /** 效果执行批次ID */
    effectRunId?: string;
    /** 效果执行错误 */
    effectError?: string;
    /** 效果执行追踪（按层级展开） */
    effectTrace?: string[];
    /** 运行事件序号（单调递增） */
    effectEventSeq?: number;
    /** 是否为孤注一掷（Pushed Roll） */
    isPushed?: boolean;
    /** 历史详情展开ID */
    detailId?: string;
    /** 历史详情行 */
    detailLines?: string[];
    /** 发起者名称 */
    initiatorName?: string;
    /** 检定显示类型 */
    historyType?: 'check' | 'contest';
  }

  interface EffectRunEventPayload {
    seq: number;
    runId: string;
    status: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
    characterName: string;
    attributeName: string;
    historyIndex: number;
    effectResults: EffectResult[];
    effectTrace: string[];
    chainMode?: 'first' | 'all';
    error?: string;
    timestamp: number;
  }

  interface EffectReplayOperation {
    characterName: string;
    target: string;
    operation: 'add' | 'subtract' | 'set';
    value: number;
    initValue?: number;
    min?: number;
    max?: number;
    aliasCandidates: string[];
    resultRef: EffectResult;
  }

  /**
   * 二级效果定义 (预留架构)
   * 用于定义基于属性变化触发的连锁效果
   */
  interface SecondaryEffect {
    /** 唯一标识 */
    id: string;
    /** 触发条件 */
    trigger: {
      /** 触发类型: threshold=基于阈值, delta=基于变化量 */
      type: 'threshold' | 'delta';
      /** 目标属性名 */
      attribute: string;
      /** 比较运算符 */
      operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
      /** 比较值，支持表达式如 "{意志}/5" */
      value: string;
    };
    /** 回调函数名或钩子标识 (可选) */
    callback?: string;
    /** 命中后要执行的后续效果（可选） */
    effects?: Effect[];
    /** 触发时输出的提示文本 (可选，支持变量: $delta, $old, $new, $attr, $depth, $tableRoll, $tableResult) */
    outputText?: string;
    /** 随机表: 触发时投骰并从表中查找结果，可通过 $tableRoll/$tableResult 在 outputText 中引用 */
    randomTable?: {
      /** 骰子表达式 (如 '1d10') */
      dice: string;
      /** 结果映射: key=投骰结果, value=对应文本 */
      entries: Record<number, string>;
    };
    /** 命名随机表：可一次投多个骰，变量名为 $<key>Roll / $<key>Result */
    randomTables?: Record<
      string,
      {
        /** 骰子表达式 (如 '1d10') */
        dice: string;
        /** 可选映射，不提供时 $<key>Result 默认等于点数 */
        entries?: Record<number, string>;
      }
    >;
    /** 子检定：用于自动化三级效果（例如 INT 检定） */
    subCheck?: {
      /** 显示标签 */
      label?: string;
      /** 目标属性名（主候选） */
      attribute: string;
      /** 目标属性名候选（用于别名/本地化） */
      attributeCandidates?: string[];
      /** 子检定骰子，默认 1d100 */
      dice?: string;
      /** 比较符，默认 lte（低于等于成功） */
      operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
      /** 目标值表达式，默认使用读取到的属性值 */
      targetValue?: string;
      /** 属性缺失时提示文本（支持模板变量） */
      missingAttributeText?: string;
      /** 成功分支 */
      success?: {
        outputText?: string;
        randomTable?: {
          dice: string;
          entries: Record<number, string>;
        };
        randomTables?: Record<
          string,
          {
            dice: string;
            entries?: Record<number, string>;
          }
        >;
        effects?: Effect[];
      };
      /** 失败分支 */
      failure?: {
        outputText?: string;
        randomTable?: {
          dice: string;
          entries: Record<number, string>;
        };
        randomTables?: Record<
          string,
          {
            dice: string;
            entries?: Record<number, string>;
          }
        >;
        effects?: Effect[];
      };
    };
    /** 是否启用，默认 true */
    enabled?: boolean;
    /** 最大触发次数，默认 1 */
    maxTriggerCount?: number;
  }

  /** 表单字段配置 */
  interface FieldConfig {
    /** 输入框上方的标签文本 */
    label?: string;
    /** 输入框内的 placeholder 文本 */
    placeholder?: string;
    /** 留空时的默认值,支持数字或表达式字符串(必填) */
    defaultValue: number | string;
    /** 是否隐藏整个输入框区域 */
    hidden?: boolean;
  }

  interface CheckSuggestionGuide {
    /** 覆盖检定建议表中的【检定规则】段 */
    rule?: string;
    /** 覆盖检定建议表中的【DSL 命令】段 */
    dsl?: string;
    /** 覆盖检定建议表中的【格式示例】段 */
    examples?: string;
  }

  interface CheckSuggestionAliases {
    /** 中文参数名到预设字段 ID 的映射 */
    params?: Record<string, string>;
    /** 参数值别名映射，第一层 key 是归一化后的参数名 */
    values?: Record<string, Record<string, string | number | boolean>>;
  }

  interface AdvancedDicePreset {
    kind: 'advanced';
    id: string;
    name: string;
    description?: string;
    version: string;
    builtin: boolean;
    visible?: boolean;
    order?: number;
    createdAt?: string;

    // 骰子表达式
    diceExpression: string;

    // 属性/技能名称输入框（第一行右侧）
    attributeName?: FieldConfig;

    // 属性值来源（第二行）
    attribute: FieldConfig & {
      key?: string; // 属性名
      computeModifier?: string; // 从属性值派生调整值，如 floor(($attr - 10) / 2)
    };

    // DC来源
    dc: FieldConfig;

    // 修正值来源
    mod?: FieldConfig;

    // 技能加值（与 attribute/mod 平行，用于 DND5e 等规则）
    skillMod?: FieldConfig;

    /**
     * 属性填入目标映射
     * - key: 目标字段 ID ('attribute' | 'skillMod' | 'mod' | customField.id)
     * - value: 属性名数组（精确匹配）
     * - 未匹配的属性 fallback 到 'attribute'
     */
    attrTargetMapping?: Record<string, string[]>;

    // 自定义字段
    customFields?: CustomFieldConfig[];

    // 派生变量
    derivedVars?: DerivedVarSpec[];

    // 骰子表达式补丁
    dicePatches?: DiceExprPatch[];

    // 多级结果定义
    outcomes: OutcomeLevel[];

    // 对抗规则
    contestRule?: ContestRule;

    // 输出模板
    outputTemplate?: string;

    // 对抗检定专用输出模板（与 outputTemplate 独立）
    contestOutputTemplate?: string;

    // 判定结果检查策略
    outcomePolicy?: OutcomePolicy;

    /** 后果系统配置 */
    effectsConfig?: EffectsConfig;
    /** 后果确认弹窗文案配置 */
    effectConfirmUi?: EffectConfirmUiConfig;
    /** 资源消耗配置 */
    resourceBurners?: ResourceBurner[];
    /** 预设快捷操作区（标题右侧小图标） */
    quickActions?: PresetQuickAction[];
    /** 检定后自动修改“当前属性” */
    currentAttrAutoUpdate?: CurrentAttrAutoUpdate;
    /** 二级/多级效果配置（可选） */
    secondaryEffects?: SecondaryEffect[];
    /** 二级效果链最大深度（可选，默认 3） */
    secondaryMaxDepth?: number;
    /** 二级效果触发策略（first=首命中，all=全部命中） */
    secondaryTriggerMode?: 'first' | 'all';

    /** 检定建议表中 <检定规则> 标签的提示词分段 */
    checkSuggestionGuide?: CheckSuggestionGuide;
    /** 检定建议表 DSL 的参数名和值别名 */
    checkSuggestionAliases?: CheckSuggestionAliases;

    /** 孤注一掷配置 (COC7等规则) */
    pushedRoll?: {
      /** 是否启用 */
      enabled: boolean;
      /** 允许push的outcome ID列表 (匹配到这些outcome才显示push按钮)
       *  未定义时: 回退到 isSuccess === false 的行为（向后兼容） */
      pushableOutcomes?: string[];
      /** 禁止push的outcome ID列表 (优先于pushableOutcomes) */
      blockedOutcomes?: string[];
      /** 排除的属性名模式 (通配符,如 'SAN*','*闪避*') */
      excludePatterns?: string[];
      /** @deprecated 使用 blockedOutcomes: ['crit_failure'] 替代 */
      blockOnCritFailure?: boolean;
      /** push后各outcome的输出标注
       *  key: outcome ID 或 '*'(默认)
       *  value: 标注文本 */
      outcomeLabels?: Record<string, string>;
    };

    // 错误处理
    errorHandling?: {
      undefinedVariable: 'zero' | 'error';
      parseError: 'fail' | 'warn';
    };
  }

  interface PendingEffectContext {
    runId: string;
    historyIndex: number;
    messageId?: string;
    expiresAt?: number;
    preset: AdvancedDicePreset;
    matchedOutcome: OutcomeLevel;
    context: {
      characterName: string;
      attributeName: string;
      attributeValue: number;
      roll: number;
      modifier: number;
      dc: number;
    };
    effectOverrides?: ComputedEffect[];
    /** 进入当前结果分支的说明文本（用于确认弹窗与注入文本） */
    branchReasonText?: string;
    /** 本次检定写入输入栏的 meta 原文，用于多结果追加时定位效果注入位置 */
    sourceMetaText?: string;
    timestamp: number;
  }

















  // 内置高级骰子预设


  // ========================================
  // 属性规则预设系统
  // ========================================

  type AttributeQuickSelectTarget = 'attribute' | 'skillMod' | 'mod';
  type CharacterAttributeSource = 'base' | 'special' | 'generic';

  interface AttributeQuickSelectConfig {
    /** 基础属性快捷按钮默认填入的检定字段 */
    baseTarget?: AttributeQuickSelectTarget;
    /** 特有属性快捷按钮默认填入的检定字段 */
    specialTarget?: AttributeQuickSelectTarget;
    /** 来源不明确时的默认填入字段 */
    fallbackTarget?: AttributeQuickSelectTarget;
    /** 少数属性名需要单独覆盖时使用，key 为目标字段，value 为属性名列表 */
    nameTargetMapping?: Partial<Record<AttributeQuickSelectTarget, string[]>>;
  }

  interface NormalizedAttributeQuickSelectConfig {
    baseTarget: AttributeQuickSelectTarget;
    specialTarget: AttributeQuickSelectTarget;
    fallbackTarget: AttributeQuickSelectTarget;
    nameTargetMapping: Partial<Record<AttributeQuickSelectTarget, string[]>>;
  }

  interface AttributePresetAttributeDef {
    name: string;
    formula: string;
    range: [number, number];
    modifier?: string;
  }

  interface AttributePresetConfig {
    format?: string;
    version?: string | number;
    id?: string;
    name?: string;
    builtin?: boolean;
    description?: string;
    createdAt?: string;
    baseAttributes?: AttributePresetAttributeDef[];
    specialAttributes?: AttributePresetAttributeDef[];
    quickSelect?: AttributeQuickSelectConfig;
  }

  interface CharacterAttributeEntry {
    name: string;
    value: number;
    source?: CharacterAttributeSource;
  }

  interface QuickSelectCheckPresetConfig {
    attrTargetMapping?: Record<string, string[]>;
    skillMod?: {
      hidden?: boolean;
    };
    mod?: {
      hidden?: boolean;
    };
    contestRule?: {
      hideSkillMod?: boolean;
      hideMod?: boolean;
    };
  }





  const isAttributeQuickSelectTarget = (value: unknown): value is AttributeQuickSelectTarget =>
    value === 'attribute' || value === 'skillMod' || value === 'mod';

  const cloneQuickSelectNameMapping = (
    mapping: Partial<Record<AttributeQuickSelectTarget, string[]>> | undefined,
  ): Partial<Record<AttributeQuickSelectTarget, string[]>> => {
    const result: Partial<Record<AttributeQuickSelectTarget, string[]>> = {};
    if (!mapping) return result;
    (['attribute', 'skillMod', 'mod'] as AttributeQuickSelectTarget[]).forEach(target => {
      const names = mapping[target];
      if (Array.isArray(names)) {
        result[target] = names.map(name => String(name).trim()).filter(Boolean);
      }
    });
    return result;
  };

  const normalizeAttributeQuickSelectConfig = (
    config: AttributeQuickSelectConfig | null | undefined,
  ): NormalizedAttributeQuickSelectConfig => ({
    baseTarget: isAttributeQuickSelectTarget(config?.baseTarget) ? config.baseTarget : 'attribute',
    specialTarget: isAttributeQuickSelectTarget(config?.specialTarget) ? config.specialTarget : 'attribute',
    fallbackTarget: isAttributeQuickSelectTarget(config?.fallbackTarget) ? config.fallbackTarget : 'attribute',
    nameTargetMapping: cloneQuickSelectNameMapping(config?.nameTargetMapping),
  });

  const applyAttributeQuickSelectDefaults = (preset: AttributePresetConfig): boolean => {
    const before = JSON.stringify(preset.quickSelect ?? null);
    preset.quickSelect = normalizeAttributeQuickSelectConfig(preset.quickSelect);
    return before !== JSON.stringify(preset.quickSelect);
  };

  // 内置属性规则预设


  // 属性预设管理器
  const AttributePresetManager = createAttributePresetManager({
    applyAttributeQuickSelectDefaults: (...a: any[]) => applyAttributeQuickSelectDefaults(...a),
    compareVersion: (...a: any[]) => compareVersion(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    updateTemplateForActivePreset: (...a: any[]) => updateTemplateForActivePreset(...a),
    BUILTIN_ATTRIBUTE_PRESETS: BUILTIN_ATTRIBUTE_PRESETS,
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
    STORAGE_KEY_ATTRIBUTE_PRESETS: STORAGE_KEY_ATTRIBUTE_PRESETS,
  });

  // ========================================
  // 高级骰子预设管理器
  // ========================================


  const ADVANCED_PRESET_EXPORT_FORMAT = 'acu_advanced_preset_v1';
  const ADVANCED_PRESET_AGENT_FORMAT = 'acu_advanced_preset_agent_v1';

  interface AdvancedPresetAgentTestCase {
    name?: string;
    context?: Record<string, unknown>;
    expectedOutcomeId?: string;
    expectedOutcomeName?: string;
  }

  interface AdvancedPresetAgentDocument {
    format: typeof ADVANCED_PRESET_AGENT_FORMAT;
    preset: Record<string, unknown>;
    tests?: AdvancedPresetAgentTestCase[];
    notes?: string | string[];
  }

  interface AdvancedPresetValidationIssue {
    path: string;
    message: string;
  }

  interface AdvancedPresetParseResult {
    preset: AdvancedDicePreset;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
    importedVersion: string;
    needsUpdate: boolean;
    warnings: AdvancedPresetValidationIssue[];
  }

  const isAdvancedPresetRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const hasAdvancedPresetFieldConfig = (value: unknown): value is Record<string, unknown> =>
    isAdvancedPresetRecord(value) && Object.keys(value).length > 0;

  const parseAdvancedPresetJsonCandidate = (candidate: string): unknown => parseJsoncValue(candidate);

  const extractAdvancedPresetJsonCandidates = (sourceText: string): string[] => {
    const candidates: string[] = [];
    const text = sourceText.trim();
    const fencePattern = /```(?:jsonc?|JSONC?|javascript|ts|typescript)?\s*([\s\S]*?)```/g;
    let match: RegExpExecArray | null = fencePattern.exec(text);
    while (match) {
      if (match[1]?.trim()) candidates.push(match[1].trim());
      match = fencePattern.exec(text);
    }

    candidates.push(text);

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const sliced = text.slice(firstBrace, lastBrace + 1).trim();
      if (sliced && !candidates.includes(sliced)) candidates.push(sliced);
    }

    return candidates;
  };

  const parseAdvancedPresetSourceText = (sourceText: string): unknown => {
    const errors: string[] = [];
    for (const candidate of extractAdvancedPresetJsonCandidates(sourceText)) {
      try {
        return parseAdvancedPresetJsonCandidate(candidate);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    throw new Error(`无法解析 JSON/JSONC：${errors[0] || '未找到有效对象'}`);
  };

  const normalizeAdvancedPresetNotes = (rawNotes: unknown): string[] => {
    if (typeof rawNotes === 'string' && rawNotes.trim()) return [rawNotes.trim()];
    if (!Array.isArray(rawNotes)) return [];
    return rawNotes.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const normalizeAdvancedPresetAgentTests = (rawTests: unknown): AdvancedPresetAgentTestCase[] => {
    if (rawTests === undefined) return [];
    if (!Array.isArray(rawTests)) {
      throw new Error('tests 必须是数组');
    }

    return rawTests.map((rawTest, index) => {
      if (!isAdvancedPresetRecord(rawTest)) {
        throw new Error(`tests[${index}] 必须是对象`);
      }

      const context = rawTest.context;
      const expectedOutcomeId = rawTest.expectedOutcomeId;
      const expectedOutcomeName = rawTest.expectedOutcomeName;
      const normalizedExpectedOutcomeId = typeof expectedOutcomeId === 'string' ? expectedOutcomeId.trim() : '';
      const normalizedExpectedOutcomeName = typeof expectedOutcomeName === 'string' ? expectedOutcomeName.trim() : '';
      if (context !== undefined && !isAdvancedPresetRecord(context)) {
        throw new Error(`tests[${index}].context 必须是对象`);
      }
      if (expectedOutcomeId !== undefined && typeof expectedOutcomeId !== 'string') {
        throw new Error(`tests[${index}].expectedOutcomeId 必须是字符串`);
      }
      if (expectedOutcomeName !== undefined && typeof expectedOutcomeName !== 'string') {
        throw new Error(`tests[${index}].expectedOutcomeName 必须是字符串`);
      }
      if (!normalizedExpectedOutcomeId && !normalizedExpectedOutcomeName) {
        throw new Error(`tests[${index}] 至少需要 expectedOutcomeId 或 expectedOutcomeName`);
      }

      return {
        ...(typeof rawTest.name === 'string' && rawTest.name.trim() ? { name: rawTest.name.trim() } : {}),
        ...(isAdvancedPresetRecord(context) ? { context } : {}),
        ...(normalizedExpectedOutcomeId ? { expectedOutcomeId: normalizedExpectedOutcomeId } : {}),
        ...(normalizedExpectedOutcomeName ? { expectedOutcomeName: normalizedExpectedOutcomeName } : {}),
      };
    });
  };

  const unwrapAdvancedPresetDocument = (
    parsed: unknown,
  ): {
    presetData: Record<string, unknown>;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
  } => {
    if (!isAdvancedPresetRecord(parsed)) {
      throw new Error('预设 JSON 必须是对象');
    }

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format === ADVANCED_PRESET_AGENT_FORMAT) {
      const document = parsed as unknown as AdvancedPresetAgentDocument;
      if (!isAdvancedPresetRecord(document.preset)) {
        throw new Error('AI 预设文档缺少 preset 对象');
      }
      return {
        presetData: document.preset,
        tests: normalizeAdvancedPresetAgentTests(document.tests),
        notes: normalizeAdvancedPresetNotes(document.notes),
        sourceFormat: ADVANCED_PRESET_AGENT_FORMAT,
      };
    }

    if (format && format !== ADVANCED_PRESET_EXPORT_FORMAT && parsed.kind !== 'advanced') {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    return {
      presetData: parsed,
      tests: normalizeAdvancedPresetAgentTests(parsed.tests),
      notes: normalizeAdvancedPresetNotes(parsed.notes),
      sourceFormat: format || 'legacy_advanced_preset',
    };
  };

  const cloneAdvancedPresetFieldWithDefaults = (
    rawField: unknown,
    fallback: Record<string, unknown>,
  ): Record<string, unknown> => {
    const field = isAdvancedPresetRecord(rawField) ? { ...rawField } : {};
    Object.entries(fallback).forEach(([key, value]) => {
      if (!(key in field)) field[key] = value;
    });
    return field;
  };

  const normalizeAdvancedPresetData = (
    rawData: Record<string, unknown>,
    options: { idOverride?: string; nameOverride?: string; descriptionOverride?: string } = {},
  ): { preset: AdvancedDicePreset; importedVersion: string; needsUpdate: boolean } => {
    const data: Record<string, unknown> = { ...rawData };
    const importedVersion = typeof data.version === 'string' ? data.version : '0.0.0';
    const needsUpdate = compareVersion(importedVersion, PRESET_FORMAT_VERSION) < 0;

    const ui = data.ui;
    if (isAdvancedPresetRecord(ui)) {
      const attribute = isAdvancedPresetRecord(data.attribute) ? { ...data.attribute } : {};
      const dc = isAdvancedPresetRecord(data.dc) ? { ...data.dc } : {};
      if (typeof ui.attributeLabel === 'string' && !attribute.label) attribute.label = ui.attributeLabel;
      if (typeof ui.dcLabel === 'string' && !dc.label) dc.label = ui.dcLabel;
      data.attribute = attribute;
      data.dc = dc;
      delete data.ui;
    }

    delete data.format;
    delete data.tests;
    delete data.notes;
    delete data.preset;

    const name =
      typeof options.nameOverride === 'string' && options.nameOverride.trim()
        ? options.nameOverride.trim()
        : typeof data.name === 'string'
          ? data.name.trim()
          : '';
    const description =
      typeof options.descriptionOverride === 'string'
        ? options.descriptionOverride.trim()
        : typeof data.description === 'string'
          ? data.description.trim()
          : '';
    const id =
      typeof options.idOverride === 'string' && options.idOverride.trim()
        ? options.idOverride.trim()
        : typeof data.id === 'string' && data.id.trim()
          ? data.id.trim()
          : `custom_${Date.now()}`;

    data.attribute = cloneAdvancedPresetFieldWithDefaults(data.attribute, {
      label: '属性值',
      placeholder: '留空=50',
      defaultValue: 50,
    });
    const hasDcConfig = hasAdvancedPresetFieldConfig(data.dc);
    const hasModConfig = hasAdvancedPresetFieldConfig(data.mod);
    data.dc = cloneAdvancedPresetFieldWithDefaults(
      data.dc,
      hasDcConfig
        ? { defaultValue: 0 }
        : {
            hidden: true,
            defaultValue: 0,
          },
    );
    data.mod = cloneAdvancedPresetFieldWithDefaults(
      data.mod,
      hasModConfig
        ? { defaultValue: 0 }
        : {
            hidden: true,
            defaultValue: 0,
          },
    );

    const preset = {
      ...data,
      id,
      kind: 'advanced' as const,
      name,
      description,
      builtin: false,
      version: PRESET_FORMAT_VERSION,
      attribute: data.attribute,
      dc: data.dc,
      mod: data.mod,
      outcomes: Array.isArray(data.outcomes) ? data.outcomes : [],
      diceExpression: typeof data.diceExpression === 'string' ? data.diceExpression.trim() : '',
    } as AdvancedDicePreset;

    return { preset, importedVersion, needsUpdate };
  };

  const pushAdvancedPresetIssue = (issues: AdvancedPresetValidationIssue[], path: string, message: string): void => {
    issues.push({ path, message });
  };

  const validateAdvancedPresetFieldConfig = (
    field: unknown,
    path: string,
    issues: AdvancedPresetValidationIssue[],
    options: { allowKey?: boolean } = {},
  ): void => {
    if (!isAdvancedPresetRecord(field)) {
      pushAdvancedPresetIssue(issues, path, '必须是对象');
      return;
    }
    if (!('defaultValue' in field)) {
      pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '缺少默认值');
    } else if (typeof field.defaultValue !== 'number' && typeof field.defaultValue !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '必须是数字或字符串');
    }
    if ('label' in field && typeof field.label !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.label`, '必须是字符串');
    }
    if ('placeholder' in field && typeof field.placeholder !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.placeholder`, '必须是字符串');
    }
    if ('hidden' in field && typeof field.hidden !== 'boolean') {
      pushAdvancedPresetIssue(issues, `${path}.hidden`, '必须是布尔值');
    }
    if (options.allowKey && 'key' in field && typeof field.key !== 'string') {
      pushAdvancedPresetIssue(issues, `${path}.key`, '必须是字符串');
    }
    if (options.allowKey && 'computeModifier' in field) {
      if (typeof field.computeModifier !== 'string') {
        pushAdvancedPresetIssue(issues, `${path}.computeModifier`, '必须是字符串表达式');
      } else {
        const evalResult = evaluateCondition(field.computeModifier, { $attr: 10 });
        if (!evalResult.success) {
          pushAdvancedPresetIssue(issues, `${path}.computeModifier`, evalResult.error || '表达式无法解析');
        }
      }
    }
  };

  const validateAdvancedPresetCustomFields = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.customFields === undefined) return;
    if (!Array.isArray(preset.customFields)) {
      pushAdvancedPresetIssue(issues, 'customFields', '必须是数组');
      return;
    }

    const allowedTypes = new Set(['number', 'text', 'select', 'toggle']);
    const ids = new Set<string>();
    preset.customFields.forEach((field, index) => {
      const path = `customFields[${index}]`;
      if (!isAdvancedPresetRecord(field)) {
        pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof field.id !== 'string' || !field.id.trim()) {
        pushAdvancedPresetIssue(issues, `${path}.id`, '必须是非空字符串');
      } else if (ids.has(field.id)) {
        pushAdvancedPresetIssue(issues, `${path}.id`, `重复的自定义字段 ID: ${field.id}`);
      } else {
        ids.add(field.id);
      }
      if (typeof field.type !== 'string' || !allowedTypes.has(field.type)) {
        pushAdvancedPresetIssue(issues, `${path}.type`, '必须是 number/text/select/toggle 之一');
      }
      if ('label' in field && typeof field.label !== 'string') {
        pushAdvancedPresetIssue(issues, `${path}.label`, '必须是字符串');
      }
      if ('defaultValue' in field) {
        const valueType = typeof field.defaultValue;
        if (valueType !== 'number' && valueType !== 'string' && valueType !== 'boolean') {
          pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '必须是数字、字符串或布尔值');
        }
      }
      if ('options' in field && !Array.isArray(field.options)) {
        pushAdvancedPresetIssue(issues, `${path}.options`, '必须是数组');
      }
    });
  };

  const validateAdvancedPresetDicePatches = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.dicePatches === undefined) return;
    if (!Array.isArray(preset.dicePatches)) {
      pushAdvancedPresetIssue(issues, 'dicePatches', '必须是数组');
      return;
    }

    const allowedOps = new Set(['append', 'prepend', 'replace']);
    const context = buildAdvancedPresetEvaluationContext(preset);
    preset.dicePatches.forEach((patch, index) => {
      const path = `dicePatches[${index}]`;
      if (!isAdvancedPresetRecord(patch)) {
        pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof patch.op !== 'string' || !allowedOps.has(patch.op)) {
        pushAdvancedPresetIssue(issues, `${path}.op`, '必须是 append/prepend/replace 之一');
      }
      if (typeof patch.template !== 'string' || !patch.template.trim()) {
        pushAdvancedPresetIssue(issues, `${path}.template`, '必须是非空字符串');
      }
      if ('when' in patch) {
        if (typeof patch.when !== 'string') {
          pushAdvancedPresetIssue(issues, `${path}.when`, '必须是字符串');
        } else {
          const conditionResult = evaluateCondition(patch.when, context as Record<string, number>);
          if (!conditionResult.success) {
            pushAdvancedPresetIssue(issues, `${path}.when`, conditionResult.error || '条件表达式无法解析');
          }
        }
      }
    });
  };

  const validateAdvancedPresetContestRule = createValidateAdvancedPresetContestRule({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const coerceAdvancedPresetContextNumber = (value: unknown, fallback: number): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };

  const createAdvancedPresetRollResult = (total: number, tags: string[] = []): RollResult => ({
    total,
    rawDice: [total],
    keptDice: [total],
    formula: String(total),
    breakdown: String(total),
    tags,
  });

  const readAdvancedPresetContextTags = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const assignAdvancedPresetContextNumber = (
    context: Record<string, string | number | boolean | RollResult>,
    key: string,
    value: unknown,
  ): void => {
    const numericValue = coerceAdvancedPresetContextNumber(value, Number.NaN);
    if (!Number.isFinite(numericValue)) return;
    context[key.startsWith('$') ? key : `$${key}`] = numericValue;
  };

  const buildAdvancedPresetEvaluationContext = createBuildAdvancedPresetEvaluationContext({
    assignAdvancedPresetContextNumber: (...a: any[]) => assignAdvancedPresetContextNumber(...a),
    coerceAdvancedPresetContextNumber: (...a: any[]) => coerceAdvancedPresetContextNumber(...a),
    createAdvancedPresetRollResult: (...a: any[]) => createAdvancedPresetRollResult(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    readAdvancedPresetContextTags: (...a: any[]) => readAdvancedPresetContextTags(...a),
  });

  interface AdvancedPresetOutcomePolicyResult {
    outcome: OutcomeLevel;
    requiredOutcome?: OutcomeLevel;
    isUnmet: boolean;
  }

  const readAdvancedPresetPolicyNumber = (
    context: Record<string, string | number | boolean | RollResult>,
    key: string,
    fallback: number,
  ): number => {
    const rawValue = context[key];
    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) return rawValue;
    if (typeof rawValue === 'boolean') return rawValue ? 1 : 0;
    if (typeof rawValue === 'string') {
      const parsed = Number(rawValue);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };

  const applyAdvancedPresetOutcomePolicy = (
    preset: AdvancedDicePreset,
    matchedOutcome: OutcomeLevel,
    context: Record<string, string | number | boolean | RollResult>,
  ): AdvancedPresetOutcomePolicyResult => {
    let outcome = matchedOutcome;
    let requiredOutcome: OutcomeLevel | undefined;

    if (preset.outcomePolicy?.kind === 'minRank') {
      const requiredRankVarId = preset.outcomePolicy.requiredRankVarId;
      const varKey = requiredRankVarId.startsWith('$') ? requiredRankVarId : `$${requiredRankVarId}`;
      const requiredRank = readAdvancedPresetPolicyNumber(context, varKey, 0);
      const actualRank = matchedOutcome.rank ?? 0;

      if (requiredRank > 0) {
        requiredOutcome = preset.outcomes.find(candidate => candidate.rank === requiredRank);
      }

      if (Number.isFinite(requiredRank) && actualRank >= 1 && actualRank < requiredRank) {
        const fallbackOutcome = preset.outcomes.find(
          candidate => candidate.id === preset.outcomePolicy?.unmetOutcomeId,
        );
        if (fallbackOutcome) outcome = fallbackOutcome;
      }
    }

    return {
      outcome,
      requiredOutcome,
      isUnmet: outcome !== matchedOutcome,
    };
  };

  const getAdvancedPresetDisplayOutcome = (policyResult: AdvancedPresetOutcomePolicyResult): OutcomeLevel =>
    policyResult.isUnmet && policyResult.requiredOutcome ? policyResult.requiredOutcome : policyResult.outcome;

  const validateAdvancedPresetOutcomes = createValidateAdvancedPresetOutcomes({
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const isAdvancedPresetNumericLike = (value: unknown): boolean => {
    if (typeof value === 'number') return Number.isFinite(value);
    if (typeof value === 'string' && value.trim()) return Number.isFinite(Number(value));
    return false;
  };

  const validateAdvancedPresetOutcomePolicy = createValidateAdvancedPresetOutcomePolicy({
    isAdvancedPresetNumericLike: (...a: any[]) => isAdvancedPresetNumericLike(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetTemplates = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
    options: { requireMetaWrapper: boolean },
  ): void => {
    const validateTemplate = (value: unknown, path: string): void => {
      if (value === undefined) return;
      if (typeof value !== 'string') {
        pushAdvancedPresetIssue(issues, path, '必须是字符串');
        return;
      }
      if (!options.requireMetaWrapper) return;
      if (!value.includes('<meta:检定结果>')) {
        pushAdvancedPresetIssue(
          issues,
          path,
          'AI 预设自定义输出模板必须包含 <meta:检定结果> 包裹；不需要自定义时请省略该字段',
        );
      }
      if (!value.includes('</meta:检定结果>')) {
        pushAdvancedPresetIssue(
          issues,
          path,
          'AI 预设自定义输出模板必须包含 </meta:检定结果> 结束标签；不需要自定义时请省略该字段',
        );
      }
    };

    validateTemplate(preset.outputTemplate, 'outputTemplate');
    validateTemplate(preset.contestOutputTemplate, 'contestOutputTemplate');
  };

  const validateAdvancedPresetAgentTests = (
    preset: AdvancedDicePreset,
    tests: AdvancedPresetAgentTestCase[],
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    tests.forEach((test, index) => {
      const context = buildAdvancedPresetEvaluationContext(preset, test.context);
      const baseOutcome = evaluateOutcomes(preset.outcomes, context as Record<string, number>);
      const matchedOutcome = applyAdvancedPresetOutcomePolicy(preset, baseOutcome, context).outcome;
      const expectedId = test.expectedOutcomeId?.trim();
      const expectedName = test.expectedOutcomeName?.trim();
      if (expectedId && matchedOutcome.id !== expectedId) {
        pushAdvancedPresetIssue(
          issues,
          `tests[${index}]`,
          `期望 outcome id 为 "${expectedId}"，实际为 "${matchedOutcome.id}"`,
        );
      }
      if (expectedName && matchedOutcome.name !== expectedName) {
        pushAdvancedPresetIssue(
          issues,
          `tests[${index}]`,
          `期望 outcome name 为 "${expectedName}"，实际为 "${matchedOutcome.name}"`,
        );
      }
    });
  };

  const throwAdvancedPresetValidationIssues = (issues: AdvancedPresetValidationIssue[]): void => {
    if (issues.length === 0) return;
    const summary = issues
      .slice(0, 5)
      .map(issue => `${issue.path}: ${issue.message}`)
      .join('；');
    const extra = issues.length > 5 ? `；另有 ${issues.length - 5} 个问题` : '';
    throw new Error(`预设校验失败：${summary}${extra}`);
  };

  const validateAdvancedPreset = (
    preset: AdvancedDicePreset,
    tests: AdvancedPresetAgentTestCase[],
    options: { requireMetaWrapper?: boolean } = {},
  ): AdvancedPresetValidationIssue[] => {
    const issues: AdvancedPresetValidationIssue[] = [];
    if (preset.kind !== 'advanced') {
      pushAdvancedPresetIssue(issues, 'kind', '必须是 "advanced"');
    }
    if (!preset.name || typeof preset.name !== 'string') {
      pushAdvancedPresetIssue(issues, 'name', '必须是非空字符串');
    }
    if (!preset.diceExpression || typeof preset.diceExpression !== 'string') {
      pushAdvancedPresetIssue(issues, 'diceExpression', '必须是非空字符串');
    } else {
      const rollResult = rollComplexDiceExpression(preset.diceExpression);
      if (Number.isNaN(rollResult.total)) {
        pushAdvancedPresetIssue(issues, 'diceExpression', '骰子表达式无法解析');
      }
    }
    validateAdvancedPresetFieldConfig(preset.attribute, 'attribute', issues, { allowKey: true });
    validateAdvancedPresetFieldConfig(preset.dc, 'dc', issues);
    if (preset.mod !== undefined) validateAdvancedPresetFieldConfig(preset.mod, 'mod', issues);
    if (preset.skillMod !== undefined) validateAdvancedPresetFieldConfig(preset.skillMod, 'skillMod', issues);
    validateAdvancedPresetCustomFields(preset, issues);
    validateAdvancedPresetDicePatches(preset, issues);
    validateAdvancedPresetContestRule(preset, issues);
    validateAdvancedPresetOutcomes(preset, issues);
    validateAdvancedPresetOutcomePolicy(preset, issues);
    validateAdvancedPresetTemplates(preset, issues, { requireMetaWrapper: Boolean(options.requireMetaWrapper) });
    if (issues.length === 0 && tests.length > 0) {
      validateAdvancedPresetAgentTests(preset, tests, issues);
    }
    throwAdvancedPresetValidationIssues(issues);
    return issues;
  };

  const parseAdvancedPresetText = (
    sourceText: string,
    options: { idOverride?: string; nameOverride?: string; descriptionOverride?: string } = {},
  ): AdvancedPresetParseResult => {
    const parsed = parseAdvancedPresetSourceText(sourceText);
    const document = unwrapAdvancedPresetDocument(parsed);
    const normalized = normalizeAdvancedPresetData(document.presetData, options);
    const warnings = validateAdvancedPreset(normalized.preset, document.tests, {
      requireMetaWrapper: document.sourceFormat === ADVANCED_PRESET_AGENT_FORMAT,
    });
    return {
      preset: normalized.preset,
      tests: document.tests,
      notes: document.notes,
      sourceFormat: document.sourceFormat,
      importedVersion: normalized.importedVersion,
      needsUpdate: normalized.needsUpdate,
      warnings,
    };
  };

  const getAdvancedPresetErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error || '未知错误');

  const buildAdvancedPresetAgentPrompt = (): string => advancedPresetAgentPromptTemplate;

  const buildDashboardPresetAgentPrompt = (): string => dashboardPresetAgentPromptTemplate;

  const buildActionPresetAgentPrompt = (): string => actionPresetAgentPromptTemplate;

  const buildRenderPresetAgentPrompt = (): string => renderPresetAgentPromptTemplate;

  const buildTableTemplateRequirementPresetAgentPrompt = (): string => tableTemplateRequirementPresetAgentPromptTemplate;

  const buildGachaCatalogAgentPrompt = (): string => gachaCatalogAgentPromptTemplate;

  const BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS = [
    createBuiltinTableTemplateRequirementPreset(defaultTableTemplateRequirementRaw),
  ];

  const getTableTemplateRequirementPresetStats = (preset): { sheetCount: number; headerCount: number } => {
    const sheets = getRequirementInspectionSheets(preset?.template || {});
    return {
      sheetCount: sheets.length,
      headerCount: sheets.reduce((total, sheet) => total + Math.max(0, sheet.headers.length - 1), 0),
    };
  };

  const parseTableTemplateRequirementPresetJson = (jsonText: string) => {
    const parsed = parseJsoncRecord(jsonText, '模板检验预设');
    if (parsed.template || parsed.preset) return parsed;
    if (Object.keys(parsed).some(key => key.startsWith('sheet_'))) {
      return {
        name: String(parsed.name || '导入的表格模板要求'),
        description: '从表格模板文件导入生成。',
        template: parsed,
      };
    }
    return parsed;
  };

  const buildNewTableTemplateRequirementPresetJsoncTemplate = createBuildNewTableTemplateRequirementPresetJsoncTemplate({

  });

  const TableTemplateRequirementPresetManager = createTableTemplateRequirementPresetManager({
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    parseTableTemplateRequirementPresetJson: (...a: any[]) => parseTableTemplateRequirementPresetJson(...a),
    BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS: BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET: STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET,
    STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
  });

  // 高级骰子预设管理器
  const AdvancedDicePresetManager = createAdvancedDicePresetManager({
    compareVersion: (...a: any[]) => compareVersion(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    parseAdvancedPresetText: (...a: any[]) => parseAdvancedPresetText(...a),
    updateTemplateForActiveCheckPreset: (...a: any[]) => updateTemplateForActiveCheckPreset(...a),
    ADVANCED_PRESET_EXPORT_FORMAT: ADVANCED_PRESET_EXPORT_FORMAT,
    BUILTIN_ADVANCED_PRESETS: BUILTIN_ADVANCED_PRESETS,
    STORAGE_KEY_ACTIVE_ADVANCED_PRESET: STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
    STORAGE_KEY_ADVANCED_PRESETS: STORAGE_KEY_ADVANCED_PRESETS,
    STORAGE_KEY_BUILTIN_PRESET_ORDER: STORAGE_KEY_BUILTIN_PRESET_ORDER,
    STORAGE_KEY_BUILTIN_PRESET_VISIBILITY: STORAGE_KEY_BUILTIN_PRESET_VISIBILITY,
  });

  // ========================================
  // 预设切换时更新表格模板
  // ========================================

  /**
   * 根据数值范围动态生成属性标尺描述（包含基准说明）
   * 将范围按比例划分为6个区间：能力缺失/弱项/平均/精英/极限/破格
   * @param min 范围最小值
   * @param max 范围最大值
   * @returns 完整的属性标尺描述字符串（包含标尺和基准说明）
   */
  const generateAttributeScale = (min: number, max: number): string => {
    const range = max - min;

    // 计算各区间的边界值（向下取整）
    const threshold1 = Math.floor(min + range * 0.1); // 能力缺失上限
    const threshold2 = Math.floor(min + range * 0.4); // 弱项上限
    const threshold3 = Math.floor(min + range * 0.6); // 平均上限
    const threshold4 = Math.floor(min + range * 0.8); // 精英上限
    const threshold5 = Math.floor(min + range * 0.9); // 极限上限

    // 生成标尺字符串，处理边界情况（避免出现 "3-3" 这样的区间）
    const formatRange = (start: number, end: number): string => {
      if (start === end) return `${start}`;
      return `${start}-${end}`;
    };

    const scales = [
      `${formatRange(min, threshold1)}:能力缺失`,
      `${formatRange(threshold1 + 1, threshold2)}:弱项`,
      `${formatRange(threshold2 + 1, threshold3)}:平均`,
      `${formatRange(threshold3 + 1, threshold4)}:精英`,
      `${formatRange(threshold4 + 1, threshold5)}:极限`,
      `${formatRange(threshold5 + 1, max)}:破格`,
    ];

    const scaleStr = scales.join(' | ');

    // 计算基准说明中的动态数值
    // "聚集在40-60" → 平均区间
    // "90+呈断崖式稀缺" → 极限区间起点
    // "重伤→0-10" → 能力缺失区间
    // "肾上腺素→80" → 精英区间的高端值
    const avgStart = threshold2 + 1;
    const avgEnd = threshold3;
    const rareThreshold = threshold5 + 1; // 破格区间起点
    const debuffRange = formatRange(min, threshold1); // 能力缺失区间
    const buffRange = formatRange(threshold4 + 1, threshold5); // 精英区间上限

    const baseDescription = `基准: 数值呈指数增长；分布呈长尾状(绝大多数聚集在${avgStart}-${avgEnd}，${rareThreshold}+呈断崖式稀缺)，依角色[身份背景]生成，当前值受[当前状态]修正。如:重伤→${debuffRange}; 肾上腺素→${buffRange}`;

    return `${scaleStr}。${baseDescription}`;
  };

  // 默认规则的特有属性模板内容（用于恢复）

  // 默认规则的虚拟预设定义（六维属性百分制）

  /**
   * 替换标签内容的通用函数（支持多行内容）
   * @param text 原始文本
   * @param tag 标签名（中文标签如 "属性规则"）
   * @param content 新内容
   */
  const replaceTag = (text: string, tag: string, content: string): string => {
    // 使用 [\s\S]* 匹配任意字符（包括换行）
    const regex = new RegExp(`<${tag}>[\\s\\S]*?</${tag}>`, 'g');
    return text.replace(regex, `<${tag}>\n${content}\n</${tag}>`);
  };

  const getCheckSuggestionPresetById = (presetId: string | null | undefined): AdvancedDicePreset | null => {
    const presets = AdvancedDicePresetManager.getAllPresets() as AdvancedDicePreset[];
    const fallback = presets.find(preset => preset.id === 'coc7_check') || null;
    if (!presetId) return AdvancedDicePresetManager.getActivePreset() || fallback;
    return presets.find(preset => preset.id === presetId) || fallback;
  };

  const buildAutoCheckSuggestionGuide = (preset: AdvancedDicePreset): Required<CheckSuggestionGuide> => {
    const supportsContest = AdvancedDicePresetManager.supportsContest(preset);
    const diceExpression = preset.diceExpression || '1d100';
    const hasDc = !preset.dc?.hidden;
    const hasMod = !!preset.mod && !preset.mod.hidden;
    const hasSkillMod = !!preset.skillMod && !preset.skillMod.hidden;
    const customParamText =
      preset.customFields
        ?.filter(field => !field.hidden)
        .map(field => `${field.id}=<${field.label || field.id}>`)
        .join(' ') || '';
    const paramPieces = [
      hasDc ? 'dc=<目标值>' : '',
      hasMod ? 'mod=<修正值>' : '',
      hasSkillMod ? 'skillMod=<技能加值或属性名>' : '',
      customParamText,
    ]
      .filter(Boolean)
      .join(' ');
    const suffix = paramPieces ? ` ${paramPieces}` : '';

    return {
      rule:
        `使用当前检定预设「${preset.name}」：掷骰公式为 ${diceExpression}，按该预设的 outcomes、判定策略与输出模板裁决结果。` +
        '属性名必须来自下方角色属性清单并原样引用；需要额外参数时使用 key=value。',
      dsl:
        `普通检定：检定 <角色> <属性>${suffix}\n` +
        (supportsContest ? `对抗检定：对抗 <发起者> <属性> vs <对手> <属性>${suffix}\n` : '') +
        '固定成功：必成\n固定失败：必败\n无需检定：无',
      examples:
        `1. 展示文本：<角色>尝试完成一个关键行动。\n   骰子命令：检定 <角色> <属性>${suffix}\n` +
        (supportsContest
          ? `2. 展示文本：<角色>与<对手>在同一目标上相互较量。\n   骰子命令：对抗 <角色> <属性> vs <对手> <属性>\n`
          : '') +
        '3. 展示文本：行动结果已经明确，不需要投骰。\n   骰子命令：无',
    };
  };

  const buildCheckSuggestionGuide = (preset: AdvancedDicePreset): string => {
    const autoGuide = buildAutoCheckSuggestionGuide(preset);
    const manualGuide = preset.checkSuggestionGuide || {};
    const rule = String(manualGuide.rule || autoGuide.rule).trim();
    const dsl = String(manualGuide.dsl || autoGuide.dsl).trim();
    const examples = String(manualGuide.examples || autoGuide.examples).trim();
    return `【检定规则】
${rule}

【DSL 命令】
${dsl}

【格式示例】
${examples}`;
  };

  interface AttributeRuleAttributeConfig {
    name: string;
    formula: string;
    range: [number, number];
    modifier?: string;
  }

  interface AttributeRulePresetConfig {
    id: string;
    name: string;
    baseAttributes?: AttributeRuleAttributeConfig[];
    specialAttributes?: AttributeRuleAttributeConfig[];
  }

  interface GeneratedAttributeRules {
    base?: Record<string, number>;
    special?: Record<string, number>;
  }

  type RuleTemplateSourceData = { note?: unknown };
  type RuleTemplateSheet = { name?: unknown; sourceData?: RuleTemplateSourceData };
  type RuleTemplateRecord = Record<string, unknown>;

  const getAttributeRulePresetById = (presetId: string | null | undefined): AttributeRulePresetConfig => {
    if (presetId === null || presetId === undefined || presetId === '__default__') {
      return DEFAULT_VIRTUAL_PRESET;
    }
    const found = (AttributePresetManager.getAllPresets() as AttributeRulePresetConfig[]).find(
      preset => preset.id === presetId,
    );
    return found || DEFAULT_VIRTUAL_PRESET;
  };

  const getAttributeRangeBounds = (
    attributes: AttributeRuleAttributeConfig[] | undefined,
    fallback: [number, number],
  ): [number, number] => {
    if (!attributes || attributes.length === 0) return fallback;
    const ranges = attributes.map(attr => attr.range);
    return [Math.min(...ranges.map(range => range[0])), Math.max(...ranges.map(range => range[1]))];
  };

  const buildAttributeRulesContent = (
    presetId: string | null | undefined,
  ): {
    preset: AttributeRulePresetConfig;
    content: string;
    debug: Record<string, string | number>;
  } => {
    const preset = getAttributeRulePresetById(presetId);
    const attrs = generateRPGAttributes(preset.id === '__default__' ? null : preset) as GeneratedAttributeRules;
    const baseEntries = Object.entries(attrs.base || {});
    const specialEntries = Object.entries(attrs.special || {});
    const [baseRangeMin, baseRangeMax] = getAttributeRangeBounds(preset.baseAttributes, [0, 100]);
    const [specialRangeMin, specialRangeMax] = getAttributeRangeBounds(preset.specialAttributes, [0, 100]);
    const attributeScaleStr = generateAttributeScale(baseRangeMin, baseRangeMax);
    const baseRangeStr = `[${baseRangeMin},${baseRangeMax}]`;
    const specialRangeStr =
      specialEntries.length > 0
        ? `[${specialRangeMin},${specialRangeMax}]`
        : `[${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[0]},${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[1]}]`;
    const baseExampleStr =
      baseEntries.length > 0
        ? baseEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : '力量:35; 敏捷:50; 体质:52; 智力:35; 感知:40; 魅力:64';
    const specialExampleStr =
      specialEntries.length > 0
        ? specialEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : DEFAULT_SPECIAL_ATTR_TEMPLATE.example;

    return {
      preset,
      content: `基础属性: "{基础属性}:{数值}"，数值范围${baseRangeStr}
示例: "${baseExampleStr}"

特有属性: 角色的特殊能力与技能，体现世界观特色与个体差异。
格式: "{特有属性}:{数值}"，数值范围${specialRangeStr}
示例: "${specialExampleStr}"

【属性标尺】
${attributeScaleStr}`,
      debug: {
        baseRangeStr,
        specialRangeStr,
        baseExampleStr,
        specialExampleStr,
        attributeScaleStr,
      },
    };
  };

  const isRuleTemplateSheetWithNote = (value: unknown): value is RuleTemplateSheet => {
    if (!value || typeof value !== 'object') return false;
    const record = value as Record<string, unknown>;
    const sourceData = record.sourceData;
    if (!sourceData || typeof sourceData !== 'object') return false;
    return typeof (sourceData as Record<string, unknown>).note === 'string';
  };

  const getRuleTagSnippet = (note: string, tag: string): string => {
    const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matched = note.match(new RegExp(`<${safeTag}>[\\s\\S]*?</${safeTag}>`));
    return (matched?.[0] || '').slice(0, 500);
  };

  const replaceRuleTagInTemplate = (
    template: RuleTemplateRecord,
    tag: string,
    content: string,
    debugPrefix: string,
  ): boolean => {
    let modified = false;
    const ruleSheets = Object.entries(template).filter((entry): entry is [string, RuleTemplateSheet] => {
      const [, sheet] = entry;
      if (!isRuleTemplateSheetWithNote(sheet)) return false;
      return sheet.sourceData?.note?.includes(`<${tag}>`) === true;
    });
    console.info(`${debugPrefix} ${tag} 可同步表扫描`, {
      totalSheets: Object.keys(template).length,
      matchedCount: ruleSheets.length,
      matchedSheets: ruleSheets.map(([sheetKey, sheet]) => ({
        sheetKey,
        sheetName: String(sheet.name || ''),
      })),
    });

    ruleSheets.forEach(([sheetKey, sheet]) => {
      const sourceData = sheet.sourceData;
      if (!sourceData || typeof sourceData.note !== 'string') return;
      const originalNote = sourceData.note;
      const nextNote = replaceTag(originalNote, tag, content);
      const changed = nextNote !== originalNote;
      console.info(`${debugPrefix} ${tag} note 替换结果`, {
        sheetKey,
        sheetName: String(sheet.name || ''),
        changed,
        beforeSnippet: getRuleTagSnippet(originalNote, tag),
        afterSnippet: getRuleTagSnippet(nextNote, tag),
      });
      if (changed) {
        sourceData.note = nextNote;
        modified = true;
      }
    });

    return modified;
  };

  const syncAttributeRuleTagsInTemplate = (
    template: RuleTemplateRecord,
    presetId: string | null | undefined,
    debugPrefix: string,
  ): boolean => {
    const built = buildAttributeRulesContent(presetId);
    console.info(`${debugPrefix} 已生成当前属性规则内容`, {
      requestedPresetId: presetId,
      resolvedPresetId: built.preset.id,
      presetName: built.preset.name,
      ...built.debug,
    });
    return replaceRuleTagInTemplate(template, '属性规则', built.content, debugPrefix);
  };

  const syncCheckRuleTagsInTemplate = (
    template: RuleTemplateRecord,
    presetId: string | null | undefined,
    debugPrefix: string,
  ): boolean => {
    const preset = getCheckSuggestionPresetById(presetId);
    if (!preset) {
      console.warn(`${debugPrefix} 找不到可用检定预设，跳过检定规则同步`);
      return false;
    }
    console.info(`${debugPrefix} 已生成当前检定规则内容`, {
      requestedPresetId: presetId,
      resolvedPresetId: preset.id,
      presetName: preset.name,
    });
    return replaceRuleTagInTemplate(template, '检定规则', buildCheckSuggestionGuide(preset), debugPrefix);
  };

  const updateTemplateForActiveCheckPreset = createUpdateTemplateForActiveCheckPreset({
    buildCheckSuggestionGuide: (...a: any[]) => buildCheckSuggestionGuide(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    getCore: (...a: any[]) => getCore(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
    syncAttributeRuleTagsInTemplate: (...a: any[]) => syncAttributeRuleTagsInTemplate(...a),
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
  });

  /**
   * 根据激活的属性预设更新表格模板中的示例和范围
   * @param presetId 预设ID，null 表示使用默认逻辑
   */
  const updateTemplateForActivePreset = createUpdateTemplateForActivePreset({
    generateAttributeScale: (...a: any[]) => generateAttributeScale(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getCore: (...a: any[]) => getCore(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
    syncCheckRuleTagsInTemplate: (...a: any[]) => syncCheckRuleTagsInTemplate(...a),
    AttributePresetManager: AttributePresetManager,
    BUILTIN_ATTRIBUTE_PRESETS: BUILTIN_ATTRIBUTE_PRESETS,
    STORAGE_KEY_ACTIVE_ADVANCED_PRESET: STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
  });

  // ========================================
  // 交互规则预设系统
  // ========================================

  // ActionPresetManager 类型定义（仅用于文档，实际是 JS 对象）
  // interface ActionGroupPreset {
  //   format: 'acu_action_preset_v1';
  //   version: string;
  //   id: string;
  //   name: string;
  //   builtin: boolean;
  //   description?: string;
  //   rules: ActionRule[];
  // }
  // interface ActionRule {
  //   table_keywords: string[];
  //   actions: ActionItem[];
  // }
  // interface ActionItem {
  //   label: string;
  //   icon?: string;
  //   template?: string;
  // }

  // 内置默认交互规则预设


  const ActionPresetManager = createActionPresetManager({
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    BUILTIN_ACTION_PRESETS: BUILTIN_ACTION_PRESETS,
    STORAGE_KEY_ACTION_PRESETS: STORAGE_KEY_ACTION_PRESETS,
    STORAGE_KEY_ACTIVE_ACTION_PRESET: STORAGE_KEY_ACTIVE_ACTION_PRESET,
  });

  // ========================================
  // 疯狂模式系统
  // ========================================

  // 获取疯狂模式配置
  const getCrazyModeConfig = () => {
    const stored = Store.get(STORAGE_KEY_CRAZY_MODE, null);
    if (!stored) return { ...DEFAULT_CRAZY_MODE_CONFIG };
    return { ...DEFAULT_CRAZY_MODE_CONFIG, ...stored };
  };

  // 保存疯狂模式配置
  const saveCrazyModeConfig = config => {
    Store.set(STORAGE_KEY_CRAZY_MODE, config);
  };

  // 判断是否触发疯狂模式
  const shouldTriggerCrazyMode = () => {
    const config = getCrazyModeConfig();
    if (!config.enabled) return false;
    // crazyLevel 作为触发概率百分比
    const roll = Math.random() * 100;
    return roll < config.crazyLevel;
  };

  // 选择投骰类型
  const selectCrazyRollType = crazyLevel => {
    // crazyLevel < 50: 100% 普通检定
    // crazyLevel 50-75: 70% 普通 / 30% 对抗
    // crazyLevel > 75: 50% 普通 / 50% 对抗
    if (crazyLevel < 50) return 'normal';
    const contestChance = crazyLevel <= 75 ? 0.3 : 0.5;
    return Math.random() < contestChance ? 'contest' : 'normal';
  };

  // 根据权重随机选择
  const weightedRandomSelect = items => {
    if (!items || items.length === 0) return null;
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
      random -= item.weight || 1;
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  };

  // 选择参与者
  const selectCrazyParticipant = createSelectCrazyParticipant({
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    weightedRandomSelect: (...a: any[]) => weightedRandomSelect(...a),
    getDashboardDataParser: () => DashboardDataParser,
    getCachedRawData: () => cachedRawData,
  });

  // 选择检定属性
  const selectCrazyAttribute = participant => {
    if (!participant) return { name: '幸运', value: 50 };

    // 1. 优先使用角色已有属性
    if (participant.attrs && participant.attrs.length > 0) {
      const randomAttr = participant.attrs[Math.floor(Math.random() * participant.attrs.length)];
      return { name: randomAttr.name, value: randomAttr.value };
    }

    // 2. 使用当前属性规则定义的属性
    const activePreset = AttributePresetManager.getActivePreset();
    if (activePreset) {
      const allPresetAttrs = [...(activePreset.baseAttributes || []), ...(activePreset.specialAttributes || [])];
      if (allPresetAttrs.length > 0) {
        const randomPresetAttr = allPresetAttrs[Math.floor(Math.random() * allPresetAttrs.length)];
        // 使用 range 的 50% 作为默认值
        const range = randomPresetAttr.range || [0, 100];
        const defaultValue = Math.floor((range[0] + range[1]) / 2);
        return { name: randomPresetAttr.name, value: defaultValue };
      }
    }

    // 3. 使用随机技能池
    const skillPool = getRandomSkillPool();
    if (skillPool && skillPool.length > 0) {
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      return { name: randomSkill, value: 50 };
    }

    return { name: '幸运', value: 50 };
  };

  // 根据预设执行疯狂模式投骰
  const crazyRollWithPreset = createCrazyRollWithPreset({

  });

  // 判断检定结果 (保留用于无预设时的兼容)
  const judgeCrazyRollResult = (roll, target) => {
    if (roll <= 5) return '大成功';
    if (roll >= 96) return '大失败';
    if (roll <= target) return '成功';
    return '失败';
  };

  // 生成疯狂骰子结果
  const generateCrazyRoll = createGenerateCrazyRoll({
    crazyRollWithPreset: (...a: any[]) => crazyRollWithPreset(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    selectCrazyAttribute: (...a: any[]) => selectCrazyAttribute(...a),
    selectCrazyParticipant: (...a: any[]) => selectCrazyParticipant(...a),
    selectCrazyRollType: (...a: any[]) => selectCrazyRollType(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });


  /**
   * 解析并计算公式（支持变量引用）
   * @param formula 公式字符串，如 "力量/2+1d10" 或 "3d6*5"
   * @param context 变量上下文，如 { 力量: 50, 敏捷: 40 }
   * @returns 计算结果（整数）
   */
  const evaluateFormula = createEvaluateFormula({

  });

  /**
   * 评估条件表达式（支持比较运算和逻辑运算）
   * @param {string} formula 表达式字符串
   * @param {Record<string, number>} context 变量上下文
   * @returns {{success: boolean, value?: number | boolean, error?: string}}
   */
  const evaluateCondition = createEvaluateCondition({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const evaluateConditionNumber = (formula: string, context: Record<string, number>, fallback = 0): number => {
    const result = evaluateCondition(formula, context);
    if (!result.success) return fallback;
    if (typeof result.value === 'number' && Number.isFinite(result.value)) return result.value;
    return result.value ? 1 : 0;
  };

  /**
   * 判断条件表达式是否为复杂条件 (包含 && 或 ||)
   * @param expr - 条件表达式字符串
   * @returns 如果包含 && 或 || 返回 true, 否则返回 false
   */
  const isComplexCondition = (expr: string): boolean => {
    return /(\&\&|\|\|)/.test(expr);
  };

  /**
   * 评估多级结果
   * @param outcomes - outcomes 数组 (会被排序)
   * @param context - 上下文对象 {$roll, $attr, $dc, $mod, ...}
   * @returns 匹配的 outcome (如果所有条件都不满足,返回最低优先级的兜底 outcome)
   */
  const evaluateOutcomes = (outcomes: OutcomeLevel[], context: Record<string, number>) => {
    if (!outcomes || outcomes.length === 0) {
      console.warn('[DICE] outcomes 数组为空,使用默认判定');
      return { id: 'default', name: '判定结果', condition: 'true', priority: 99 };
    }
    const sorted = [...outcomes].sort((a, b) => a.priority - b.priority);

    for (const outcome of sorted) {
      try {
        const conditionResult: { success: boolean; value?: number | boolean; error?: string } = evaluateCondition(
          outcome.condition,
          context,
        );
        if (!conditionResult.success) {
          if (conditionResult.error) {
            console.warn(`[DICE] outcome "${outcome.name}" 条件评估失败:`, conditionResult.error);
          }
          continue;
        }
        const isMatch =
          typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
        if (isMatch) {
          return outcome;
        }
      } catch (error) {
        console.warn(`[DICE] outcome "${outcome.name}" 条件评估失败:`, error);
        continue;
      }
    }

    return sorted[sorted.length - 1];
  };

  // 默认输出模板
  const DEFAULT_OUTPUT_TEMPLATE = `<meta:检定结果>
$outcomeText
元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】
</meta:检定结果>`;

  // 默认对抗检定输出模板
  const DEFAULT_CONTEST_OUTPUT_TEMPLATE = `<meta:检定结果>
元叙事：进行了一次【$initiator $initAttrName vs $opponent $oppAttrName】的对抗检定。
$initiator $initAttrName：$initFormula=$initRoll，判定 $initConditionExpr？$initJudgeResult，判定为【$initSuccessName】；
$opponent $oppAttrName：$oppFormula=$oppRoll，判定 $oppConditionExpr？$oppJudgeResult，判定为【$oppSuccessName】。
最终结果：【$winner】
</meta:检定结果>`;

  /**
   * 格式化输出模板
   * @param template - 模板字符串
   * @param context - 变量上下文
   * @returns 格式化后的文本
   */
  const formatOutputTemplate = (template: string, context: Record<string, string | number | undefined>): string => {
    const missingKeys = new Set<string>();

    // [修复] 先替换带点的变量（如 $roll.total），再替换普通变量（如 $roll）
    // 这样可以避免 $roll.total 被错误地替换为 "3.total"
    let result = template.replace(/\$([a-zA-Z_]\w*\.[a-zA-Z_]\w*)/g, match => {
      const key = match.slice(1); // 去掉 $ 前缀，得到 "roll.total"
      const value = context[key];
      if (value === undefined || value === null) {
        if (!missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[DICE] formatOutputTemplate: 未定义变量 $${key}`);
        }
        return '';
      }
      return String(value);
    });

    // 再替换普通变量
    result = result.replace(/\$([a-zA-Z_]\w*)(?=\W|$)/g, match => {
      const key = match.slice(1);
      const value = context[key];
      if (value === undefined || value === null) {
        if (!missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[DICE] formatOutputTemplate: 未定义变量 $${key}`);
        }
        return '';
      }
      return String(value);
    });
    // 清理空行：将连续多个换行符替换为单个换行符
    return result.replace(/\n\s*\n/g, '\n');
  };

  /**
   * 生成单个属性值，应用范围限制
   * @param formula 公式字符串
   * @param range 可选范围 [min, max]
   * @param context 变量上下文
   * @returns 属性值
   */
  const generateAttributeValue = (formula, range, context) => {
    let value = evaluateFormula(formula, context);

    if (range && Array.isArray(range) && range.length === 2) {
      value = Math.max(range[0], Math.min(range[1], value));
    }

    return value;
  };

  // ========================================
  // 仪表盘统一配置中心
  // ========================================
  type DashboardColumnConfig = {
    keywords: string[];
    fallbackIndex: number | null;
    isMultiple?: boolean;
  };
  type DashboardFilterConfig = {
    column: string;
    includes: string[];
    excludeColumn?: string;
    excludes?: string[];
  };
  type DashboardModuleConfig = {
    tableKeywords: string[];
    columns: Record<string, DashboardColumnConfig>;
    filters?: Record<string, DashboardFilterConfig>;
  };
  type DashboardConfigMap = Record<string, DashboardModuleConfig>;
  type DashboardPresetColumnConfig = {
    keywords: string[];
  };
  type DashboardPresetFilterConfig = {
    column?: string;
    includes?: string[];
    excludeColumn?: string;
    excludes?: string[];
  };
  type DashboardRelationshipGraphSourceMode = 'fixedTarget' | 'relationList';
  type DashboardRelationshipGraphSourceConfig = {
    mode: DashboardRelationshipGraphSourceMode;
    tableKeywords: string[];
    nameColumn: string[];
    relationColumn: string[];
    target?: string;
  };
  type DashboardPresetModuleConfig = {
    tableKeywords?: string[];
    columns?: Record<string, DashboardPresetColumnConfig>;
    filters?: Record<string, DashboardPresetFilterConfig>;
    sources?: DashboardRelationshipGraphSourceConfig[];
  };
  type DashboardPresetModules = Record<string, DashboardPresetModuleConfig>;
  type DashboardPreset = {
    format: 'acu_dashboard_preset_v1';
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    modules: DashboardPresetModules;
    createdAt?: string;
    updatedAt?: string;
  };

  const DASHBOARD_PRESET_FORMAT = 'acu_dashboard_preset_v1';
  const DASHBOARD_DEFAULT_PRESET_ID = '__builtin_dashboard_default__';
  const DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY = 'relationshipGraph';
  const DASHBOARD_PRESET_MODULE_KEYS = ['global', 'player', 'location', 'npc', 'quest', 'bag', 'equip'] as const;
  const DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES: DashboardRelationshipGraphSourceMode[] = [
    'fixedTarget',
    'relationList',
  ];
  const DASHBOARD_PRESET_FILTER_KEYS: Record<string, readonly string[]> = {
    equip: ['equipped'],
  };
  const DASHBOARD_PRESET_ADDITIONAL_COLUMNS: Record<string, readonly string[]> = {
    quest: ['priority'],
  };



  let dashboardRuntimeConfigCache: DashboardConfigMap | null = null;

  const cloneDashboardConfig = (config: DashboardConfigMap): DashboardConfigMap => {
    const cloned: DashboardConfigMap = {};
    Object.entries(config).forEach(([moduleKey, moduleConfig]) => {
      const columns: Record<string, DashboardColumnConfig> = {};
      Object.entries(moduleConfig.columns).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = {
          ...columnConfig,
          keywords: [...columnConfig.keywords],
        };
      });
      cloned[moduleKey] = {
        tableKeywords: [...moduleConfig.tableKeywords],
        columns,
        ...(moduleConfig.filters
          ? { filters: JSON.parse(JSON.stringify(moduleConfig.filters)) as Record<string, DashboardFilterConfig> }
          : {}),
      };
    });
    return cloned;
  };

  const createDashboardPresetModulesFromConfig = (config: DashboardConfigMap): DashboardPresetModules => {
    const modules: DashboardPresetModules = {};
    DASHBOARD_PRESET_MODULE_KEYS.forEach(moduleKey => {
      const moduleConfig = config[moduleKey];
      if (!moduleConfig) return;
      const columns: Record<string, DashboardPresetColumnConfig> = {};
      Object.entries(moduleConfig.columns).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = { keywords: [...columnConfig.keywords] };
      });
      modules[moduleKey] = {
        tableKeywords: [...moduleConfig.tableKeywords],
        columns,
      };
      const allowedFilters = DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
      const filters: Record<string, DashboardPresetFilterConfig> = {};
      allowedFilters.forEach(filterKey => {
        const filterConfig = moduleConfig.filters?.[filterKey];
        if (!filterConfig) return;
        filters[filterKey] = {
          column: filterConfig.column,
          includes: [...filterConfig.includes],
          ...(filterConfig.excludeColumn ? { excludeColumn: filterConfig.excludeColumn } : {}),
          ...(filterConfig.excludes ? { excludes: [...filterConfig.excludes] } : {}),
        };
      });
      if (Object.keys(filters).length > 0) {
        modules[moduleKey].filters = filters;
      }
    });
    return modules;
  };

  const cloneDashboardPresetModules = (modules: DashboardPresetModules): DashboardPresetModules => {
    const cloned: DashboardPresetModules = {};
    Object.entries(modules).forEach(([moduleKey, moduleConfig]) => {
      const columns: Record<string, DashboardPresetColumnConfig> = {};
      Object.entries(moduleConfig.columns || {}).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = { keywords: [...columnConfig.keywords] };
      });
      const filters: Record<string, DashboardPresetFilterConfig> = {};
      Object.entries(moduleConfig.filters || {}).forEach(([filterKey, filterConfig]) => {
        filters[filterKey] = {
          ...(filterConfig.column ? { column: filterConfig.column } : {}),
          ...(filterConfig.includes ? { includes: [...filterConfig.includes] } : {}),
          ...(filterConfig.excludeColumn ? { excludeColumn: filterConfig.excludeColumn } : {}),
          ...(filterConfig.excludes ? { excludes: [...filterConfig.excludes] } : {}),
        };
      });
      const sources = (moduleConfig.sources || []).map(source => ({
        mode: source.mode,
        tableKeywords: [...source.tableKeywords],
        nameColumn: [...source.nameColumn],
        relationColumn: [...source.relationColumn],
        ...(source.target ? { target: source.target } : {}),
      }));
      cloned[moduleKey] = {
        ...(moduleConfig.tableKeywords ? { tableKeywords: [...moduleConfig.tableKeywords] } : {}),
        ...(Object.keys(columns).length > 0 ? { columns } : {}),
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
        ...(sources.length > 0 ? { sources } : {}),
      };
    });
    return cloned;
  };

  const createBuiltinDashboardPreset = (): DashboardPreset => ({
    format: DASHBOARD_PRESET_FORMAT,
    version: PRESET_FORMAT_VERSION,
    id: DASHBOARD_DEFAULT_PRESET_ID,
    name: '默认仪表盘预设',
    builtin: true,
    description: '内置默认仪表盘抓取规则，可导出后修改并重新导入为自定义预设',
    modules: createDashboardPresetModulesFromConfig(DASHBOARD_TABLE_CONFIG),
  });

  const isRecordValue = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const normalizeDashboardKeywordArray = (value: unknown, label: string): string[] => {
    if (!Array.isArray(value)) {
      throw new Error(`${label} 必须是字符串数组`);
    }
    const keywords = value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
    if (keywords.length === 0) {
      throw new Error(`${label} 至少需要一个关键词`);
    }
    return keywords;
  };

  const normalizeDashboardOptionalStringArray = (value: unknown, label: string): string[] => {
    if (!Array.isArray(value)) {
      throw new Error(`${label} 必须是字符串数组`);
    }
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const normalizeDashboardPresetFilters = createNormalizeDashboardPresetFilters({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardOptionalStringArray: (...a: any[]) => normalizeDashboardOptionalStringArray(...a),
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
  });

  const normalizeDashboardRelationshipGraphConfig = createNormalizeDashboardRelationshipGraphConfig({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardKeywordArray: (...a: any[]) => normalizeDashboardKeywordArray(...a),
    DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES: DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES,
  });

  const stripJsonComments = createStripJsonComments({

  });

  const JSONC_FILE_ACCEPT = '.json,.jsonc,application/json,application/jsonc';
  const JSON_FILE_MIME = 'application/json;charset=utf-8';
  const JSONC_FILE_MIME = 'application/jsonc;charset=utf-8';
  const MARKDOWN_FILE_MIME = 'text/markdown;charset=utf-8';

  interface TextFileSelection {
    file: File;
    text: string;
  }

  interface DownloadTextFileOptions {
    content: string;
    filename: string;
    mimeType: string;
  }

  interface JsoncEditorValidationOptions<T> {
    text: string;
    emptyMessage?: string;
    parse: (text: string) => T;
    successMessage: (parsed: T) => string;
    errorMessage?: (error: unknown) => string;
    logLabel: string;
  }

  interface JsoncDocumentParseOptions<T> {
    text: string;
    emptyMessage?: string;
    invalidJsonMessage?: string;
    validate: (value: unknown) => T;
  }

  const getJsonLikeErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error || '未知错误');
  };

  const stripJsoncSyntax = (jsonText: string): string => {
    const withoutComments = stripJsonComments(String(jsonText || ''));
    let result = '';
    let inString = false;
    let quote = '';
    let escaped = false;

    for (let index = 0; index < withoutComments.length; index++) {
      const char = withoutComments[index];

      if (inString) {
        result += char;
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          inString = false;
          quote = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quote = char;
        result += char;
        continue;
      }

      if (char === ',') {
        let nextIndex = index + 1;
        while (nextIndex < withoutComments.length && /\s/.test(withoutComments[nextIndex])) {
          nextIndex++;
        }
        if (withoutComments[nextIndex] === '}' || withoutComments[nextIndex] === ']') continue;
      }

      result += char;
    }

    return result;
  };

  const parseJsoncValue = (jsonText: string): unknown => JSON.parse(stripJsoncSyntax(jsonText));

  const parseJsoncDocument = <T>({
    text,
    emptyMessage = '请输入 JSONC 配置',
    invalidJsonMessage = '不是有效的 JSON/JSONC',
    validate,
  }: JsoncDocumentParseOptions<T>): T => {
    const trimmed = String(text || '').trim();
    if (!trimmed) throw new Error(emptyMessage);
    let parsed: unknown;
    try {
      parsed = parseJsoncValue(trimmed);
    } catch {
      throw new Error(invalidJsonMessage);
    }
    return validate(parsed);
  };

  const parseJsoncRecord = (jsonText: string, label: string): Record<string, unknown> => {
    return parseJsoncDocument({
      text: jsonText,
      invalidJsonMessage: `${label}不是有效的 JSON/JSONC`,
      validate: parsed => {
        if (!isRecordValue(parsed)) {
          throw new Error(`${label}必须是对象`);
        }
        return parsed;
      },
    });
  };

  const downloadTextFile = ({ content, filename, mimeType }: DownloadTextFileOptions): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    try {
      anchor.click();
    } finally {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };

  const downloadJsonFile = (content: string, filename: string): void => {
    downloadTextFile({ content, filename, mimeType: JSON_FILE_MIME });
  };

  const downloadJsoncFile = (content: string, filename: string): void => {
    downloadTextFile({ content, filename, mimeType: JSONC_FILE_MIME });
  };

  const downloadAiPromptFile = (content: string, filename: string): void => {
    downloadTextFile({ content, filename, mimeType: MARKDOWN_FILE_MIME });
  };

  const readTextFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(String(event.target?.result || ''));
      reader.onerror = () => reject(reader.error || new Error('文件读取失败'));
      reader.readAsText(file);
    });

  const pickTextFile = (accept = JSONC_FILE_ACCEPT): Promise<TextFileSelection | null> =>
    new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';
      const cleanup = () => {
        if (input.isConnected) input.remove();
      };
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          cleanup();
          resolve(null);
          return;
        }
        readTextFile(file)
          .then(text => resolve({ file, text }))
          .catch(error => {
            console.error('[DICE]读取文件失败:', error);
            if (window.toastr)
              showActionableErrorToast('文件读取失败，浏览器没有成功读取所选文件。', { suggestion: 'importExport' });
            resolve(null);
          })
          .finally(cleanup);
      };
      input.addEventListener(
        'cancel',
        () => {
          cleanup();
          resolve(null);
        },
        { once: true },
      );
      document.body.appendChild(input);
      input.click();
    });

  const validateJsoncEditorConfig = <T>(options: JsoncEditorValidationOptions<T>): T | null => {
    const text = String(options.text || '').trim();
    if (!text) {
      if (window.toastr) window.toastr.warning(options.emptyMessage || '请输入 JSONC 配置');
      return null;
    }

    try {
      const parsed = options.parse(text);
      if (window.toastr) window.toastr.success(options.successMessage(parsed));
      return parsed;
    } catch (error) {
      console.error(options.logLabel, error);
      const message = options.errorMessage
        ? options.errorMessage(error)
        : `JSONC 格式错误: ${getJsonLikeErrorMessage(error)}`;
      if (window.toastr) showActionableErrorToast(message, { suggestion: 'importExport' });
      return null;
    }
  };

  const normalizeDashboardPresetModules = createNormalizeDashboardPresetModules({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeDashboardKeywordArray: (...a: any[]) => normalizeDashboardKeywordArray(...a),
    normalizeDashboardPresetFilters: (...a: any[]) => normalizeDashboardPresetFilters(...a),
    normalizeDashboardRelationshipGraphConfig: (...a: any[]) => normalizeDashboardRelationshipGraphConfig(...a),
    DASHBOARD_PRESET_ADDITIONAL_COLUMNS: DASHBOARD_PRESET_ADDITIONAL_COLUMNS,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
    DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
  });

  const parseDashboardPresetJson = (
    jsonText: string,
  ): { name: string; description: string; modules: DashboardPresetModules } => {
    const parsed = parseJsoncRecord(jsonText, '仪表盘预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== DASHBOARD_PRESET_FORMAT) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawModules = 'modules' in parsed ? parsed.modules : parsed;
    const modules = normalizeDashboardPresetModules(rawModules);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的仪表盘预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, modules };
  };

  const createDashboardPresetEditorTemplate = createCreateDashboardPresetEditorTemplate({

  });

  const DashboardPresetManager = createDashboardPresetManager({
    cloneDashboardPresetModules: (...a: any[]) => cloneDashboardPresetModules(...a),
    createBuiltinDashboardPreset: (...a: any[]) => createBuiltinDashboardPreset(...a),
    parseDashboardPresetJson: (...a: any[]) => parseDashboardPresetJson(...a),
    DASHBOARD_DEFAULT_PRESET_ID: DASHBOARD_DEFAULT_PRESET_ID,
    DASHBOARD_PRESET_FORMAT: DASHBOARD_PRESET_FORMAT,
    STORAGE_KEY_ACTIVE_DASHBOARD_PRESET: STORAGE_KEY_ACTIVE_DASHBOARD_PRESET,
    STORAGE_KEY_DASHBOARD_PRESETS: STORAGE_KEY_DASHBOARD_PRESETS,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache = v; },
  });

  const getActiveDashboardRelationshipGraphSources = (): DashboardRelationshipGraphSourceConfig[] => {
    const graphConfig = DashboardPresetManager.getActivePreset().modules[DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY];
    return graphConfig?.sources || [];
  };

  const getDashboardRuntimeConfig = createGetDashboardRuntimeConfig({
    cloneDashboardConfig: (...a: any[]) => cloneDashboardConfig(...a),
    DASHBOARD_PRESET_ADDITIONAL_COLUMNS: DASHBOARD_PRESET_ADDITIONAL_COLUMNS,
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardPresetManager: DashboardPresetManager,
    getDashboardRuntimeConfigCache: () => dashboardRuntimeConfigCache,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache = v; },
  });

  const getDashboardModuleConfig = (moduleKey: string): DashboardModuleConfig | null =>
    getDashboardRuntimeConfig()[moduleKey] || null;

  // 仪表盘数据解析器
  const DashboardDataParser = createDashboardDataParser({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
  });
  const getGMConfig = () => {
    const baseConfig = Store.get(STORAGE_KEY_GM_CONFIG, DEFAULT_GM_CONFIG);

    // 检查用户是否明确禁用了所有交互规则
    const activePresetId = ActionPresetManager.getActivePresetId();
    if (activePresetId === '__none__') {
      return {
        ...baseConfig,
        action_rules_disabled: true, // 标记：用户明确禁用了所有规则
      };
    }

    // 注入用户交互规则预设
    const activePreset = ActionPresetManager.getActivePreset();
    if (activePreset && activePreset.rules && activePreset.rules.length > 0) {
      // 转换预设格式为 custom_action_groups 格式
      const customActionGroups = activePreset.rules.map(rule => ({
        table_keywords: rule.table_keywords || [],
        actions: (rule.actions || []).map(action => ({
          label: action.label,
          icon: action.icon || ACTION_ICON_MAP[action.label] || 'fa-circle',
          type: 'prompt',
          template: action.template || `<user>对{Name}执行互动:${action.label}。`,
          auto_send: false,
        })),
      }));

      return {
        ...baseConfig,
        custom_action_groups: customActionGroups,
      };
    }

    return baseConfig;
  };

  // 统一的结果标签样式生成函数 - 返回 CSS 类名
  const getResultBadgeClass = resultType => {
    // resultType: 'critSuccess' | 'extremeSuccess' | 'success' | 'warning' | 'failure' | 'critFailure'
    const classMap = {
      critSuccess: 'acu-result-badge acu-result-badge-crit-success',
      extremeSuccess: 'acu-result-badge acu-result-badge-extreme-success',
      success: 'acu-result-badge acu-result-badge-success',
      warning: 'acu-result-badge acu-result-badge-warning',
      failure: 'acu-result-badge acu-result-badge-failure',
      critFailure: 'acu-result-badge acu-result-badge-crit-failure',
    };
    return classMap[resultType] || classMap.failure;
  };

  // [统一] 交互选项的图标映射表，供所有渲染位置共享使用


  /**
   * 获取指定表格的默认交互动作
   *
   * [扩展点] 支持用户自定义规则，优先级：用户自定义规则 > 内置默认规则
   * 将来可通过 config.custom_action_groups 添加用户定义的表格规则
   * 例如用户可以为"神通表"定义固有选项"凝练"、"施展"
   *
   * @param tableName 表格名称（用于匹配动作组）
   * @returns 匹配的动作列表（返回副本，避免变异原配置）
   */
  const getActionsForTable = (tableName: string) => {
    const config = getGMConfig();
    if (!config.enabled) return [];

    // 如果用户明确禁用了所有规则，返回空数组
    if ((config as any).action_rules_disabled) return [];

    const lowerName = tableName.toLowerCase();

    // [扩展点] 优先检查用户自定义规则
    const customRules = (config as any).custom_action_groups || [];
    for (const group of customRules) {
      const matched = group.table_keywords.some((keyword: string) => lowerName.includes(keyword.toLowerCase()));
      if (matched) return [...(group.actions || [])]; // 返回副本
    }

    // 回退到内置默认规则
    const builtinRules = config.action_groups || [];
    for (const group of builtinRules) {
      const matched = group.table_keywords.some((keyword: string) => lowerName.includes(keyword.toLowerCase()));
      if (matched) return [...(group.actions || [])]; // 返回副本
    }

    return [];
  };

  /**
   * 获取指定行的完整交互选项列表
   * 合并逻辑：默认动作 + AI生成的自定义动作（去重）
   *
   * @param tableName 表格名称（用于匹配默认动作）
   * @param headers 表头数组
   * @param rowData 行数据数组
   * @returns 完整的动作列表（默认动作在前，自定义动作在后）
   */
  const getInteractOptionsForRow = createGetInteractOptionsForRow({
    getActionsForTable: (...a: any[]) => getActionsForTable(...a),
    getACTION_ICON_MAP: () => ACTION_ICON_MAP,
  });

  interface GlobalInteractionAction {
    label: string;
    icon?: string;
    type?: string;
    template?: string;
    auto_send?: boolean;
  }

  interface GlobalInteractionRow {
    rowIndex: number;
    title: string;
    iconName: string;
    actions: GlobalInteractionAction[];
    searchText: string;
  }

  interface GlobalInteractionGroup {
    tableKey: string;
    tableName: string;
    rows: GlobalInteractionRow[];
  }

  type GlobalInteractionSectionKind =
    | 'character'
    | 'map'
    | 'item'
    | 'equipment'
    | 'task'
    | 'skill'
    | 'faction'
    | 'generic';

  interface GlobalInteractionSection {
    kind: GlobalInteractionSectionKind;
    title: string;
    icon: string;
    order: number;
    groups: GlobalInteractionGroup[];
  }

  interface GlobalInteractionSectionMeta {
    kind: GlobalInteractionSectionKind;
    title: string;
    icon: string;
    order: number;
    keywords: string[];
  }

  interface GlobalInteractionActionRuleGroup {
    table_keywords: string[];
  }

  const GLOBAL_INTERACTION_NAME_HEADERS = [
    '名称',
    '名字',
    '姓名',
    '角色',
    '角色名',
    '角色名称',
    '人物',
    '人物名',
    '人物名称',
    '地点',
    '地点名',
    '详细地点',
    '地名',
    '物品',
    '物品名',
    '物品名称',
    '道具',
    'name',
    'title',
  ];
  const GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS = [
    '名称',
    '名字',
    '姓名',
    '角色名',
    '人物名',
    '地点',
    '地名',
    '物品名',
    '道具名',
    'name',
    'title',
  ];
  const GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS = [
    '类型',
    '定位',
    '关系',
    '身份',
    '职业',
    '阵营',
    '状态',
    '等级',
    '数值',
    '备注',
    '描述',
    '说明',
    '交互',
    '选项',
    '序号',
    '编号',
    '索引',
  ];
  const GLOBAL_INTERACTION_INDEX_HEADERS = ['序号', '编号', '索引', 'index', 'order', 'id', '#'];
  const GLOBAL_INTERACTION_DEBUG_PREFIX = '[DICE][GlobalInteractionsDebug]';
  const GLOBAL_INTERACTION_DEFAULT_SECTION_META: GlobalInteractionSectionMeta = {
    kind: 'generic',
    title: '通用',
    icon: 'fa-layer-group',
    order: 90,
    keywords: [],
  };


  const debugGlobalInteraction = (event: string, details: Record<string, unknown> = {}): void => {
    const debugWindow = window as Window & { ACU_GLOBAL_INTERACTION_DEBUG?: boolean };
    if (!debugWindow.ACU_GLOBAL_INTERACTION_DEBUG) return;
    console.log(GLOBAL_INTERACTION_DEBUG_PREFIX, event, details);
  };

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const isTwoDimensionalArray = (value: unknown): value is unknown[][] =>
    Array.isArray(value) && value.every(row => Array.isArray(row));

  const normalizeInteractionLabel = (label: string): string => label.trim().toLowerCase();

  const dedupeInteractionActions = (actions: GlobalInteractionAction[]): GlobalInteractionAction[] => {
    const seenLabels = new Set<string>();
    const result: GlobalInteractionAction[] = [];

    actions.forEach(action => {
      const normalizedLabel = normalizeInteractionLabel(action.label);
      if (!normalizedLabel || seenLabels.has(normalizedLabel)) return;
      seenLabels.add(normalizedLabel);
      result.push(action);
    });

    return result;
  };

  const getStringLikeCellText = (value: unknown): string => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim();
    }
    return '';
  };

  const isPureIndexCell = (headers: unknown[], columnIndex: number, value: unknown): boolean => {
    const headerText = String(headers[columnIndex] ?? '')
      .trim()
      .toLowerCase();
    const cellText = getStringLikeCellText(value);
    return (
      GLOBAL_INTERACTION_INDEX_HEADERS.some(keyword => headerText.includes(keyword.toLowerCase())) ||
      /^\d+$/.test(cellText)
    );
  };

  const normalizeGlobalInteractionHeader = (header: unknown): string =>
    String(header ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  const isLikelyGlobalInteractionNameHeader = (header: unknown): boolean => {
    const headerText = normalizeGlobalInteractionHeader(header);
    if (!headerText) return false;
    if (GLOBAL_INTERACTION_NAME_HEADERS.some(keyword => headerText === keyword.toLowerCase())) return true;
    if (GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS.some(keyword => headerText.includes(keyword.toLowerCase())))
      return false;
    return GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS.some(keyword => headerText.includes(keyword.toLowerCase()));
  };

  const resolveGlobalInteractionRowTitle = (headers: unknown[], rowData: unknown[], rowIndex: number): string => {
    const exactNameColumnIndex = headers.findIndex(header => {
      const headerText = normalizeGlobalInteractionHeader(header);
      return (
        Boolean(headerText) && GLOBAL_INTERACTION_NAME_HEADERS.some(keyword => headerText === keyword.toLowerCase())
      );
    });
    const nameColumnIndex =
      exactNameColumnIndex >= 0 ? exactNameColumnIndex : headers.findIndex(isLikelyGlobalInteractionNameHeader);
    const nameColumnText = nameColumnIndex >= 0 ? getStringLikeCellText(rowData[nameColumnIndex]) : '';
    if (nameColumnText) return nameColumnText;

    const firstDescriptiveCell = rowData.find((cell, columnIndex) => {
      const cellText = getStringLikeCellText(cell);
      return Boolean(cellText) && !isPureIndexCell(headers, columnIndex, cell);
    });
    const descriptiveText = getStringLikeCellText(firstDescriptiveCell);
    if (descriptiveText) return descriptiveText;

    const firstStringLikeCell = rowData.find(cell => Boolean(getStringLikeCellText(cell)));
    const fallbackText = getStringLikeCellText(firstStringLikeCell);
    return fallbackText || `第 ${rowIndex + 1} 行`;
  };

  const buildGlobalInteractionSearchText = (
    tableName: string,
    rowTitle: string,
    actions: GlobalInteractionAction[],
  ): string => {
    return [tableName, rowTitle, ...actions.map(action => action.label)].join(' ').toLowerCase();
  };

  const normalizeGlobalInteractionCategoryText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  const getGlobalInteractionRuleKeywords = (rule: unknown): string[] => {
    if (!isRecord(rule) || !Array.isArray(rule.table_keywords)) return [];
    return rule.table_keywords.map(keyword => getStringLikeCellText(keyword)).filter(Boolean);
  };

  const getGlobalInteractionActionRuleGroups = (): GlobalInteractionActionRuleGroup[] => {
    const config = getGMConfig() as {
      enabled?: boolean;
      action_rules_disabled?: boolean;
      custom_action_groups?: unknown;
      action_groups?: unknown;
    };
    if (config.enabled === false || config.action_rules_disabled) return [];

    const customRules = Array.isArray(config.custom_action_groups) ? config.custom_action_groups : [];
    const builtinRules = Array.isArray(config.action_groups) ? config.action_groups : [];
    return [...customRules, ...builtinRules]
      .map(rule => ({ table_keywords: getGlobalInteractionRuleKeywords(rule) }))
      .filter(rule => rule.table_keywords.length > 0);
  };

  const getMatchedGlobalInteractionRuleKeywords = (tableName: string): string[] => {
    const normalizedTableName = normalizeGlobalInteractionCategoryText(tableName);
    for (const rule of getGlobalInteractionActionRuleGroups()) {
      const matched = rule.table_keywords.some(keyword =>
        normalizedTableName.includes(normalizeGlobalInteractionCategoryText(keyword)),
      );
      if (matched) return rule.table_keywords;
    }
    return [];
  };

  const resolveGlobalInteractionSectionMeta = (tableName: string): GlobalInteractionSectionMeta => {
    const dashboardSectionKind = resolveDashboardGlobalInteractionSectionKind(tableName);
    if (dashboardSectionKind) {
      const dashboardMeta = GLOBAL_INTERACTION_SECTION_METAS.find(meta => meta.kind === dashboardSectionKind);
      if (dashboardMeta) return dashboardMeta;
    }

    const candidateTexts = [tableName, ...getMatchedGlobalInteractionRuleKeywords(tableName)].map(
      normalizeGlobalInteractionCategoryText,
    );
    return (
      GLOBAL_INTERACTION_SECTION_METAS.find(meta =>
        meta.keywords.some(keyword => {
          const normalizedKeyword = normalizeGlobalInteractionCategoryText(keyword);
          return candidateTexts.some(text => text.includes(normalizedKeyword));
        }),
      ) || GLOBAL_INTERACTION_DEFAULT_SECTION_META
    );
  };

  const createGlobalInteractionSections = (groups: GlobalInteractionGroup[]): GlobalInteractionSection[] => {
    const sectionByKind = new Map<GlobalInteractionSectionKind, GlobalInteractionSection>();
    groups.forEach(group => {
      const meta = resolveGlobalInteractionSectionMeta(group.tableName);
      const existingSection = sectionByKind.get(meta.kind);
      if (existingSection) {
        existingSection.groups.push(group);
        return;
      }
      sectionByKind.set(meta.kind, {
        kind: meta.kind,
        title: meta.title,
        icon: meta.icon,
        order: meta.order,
        groups: [group],
      });
    });

    return [...sectionByKind.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'));
  };

  const buildGlobalInteractionGroups = (rawData: unknown): GlobalInteractionGroup[] => {
    if (!isRecord(rawData)) return [];

    const groups: GlobalInteractionGroup[] = [];
    Object.entries(rawData).forEach(([tableKey, sheet]) => {
      if (!tableKey.startsWith('sheet_') || !isRecord(sheet)) return;
      if (typeof sheet.name !== 'string' || !sheet.name.trim() || !isTwoDimensionalArray(sheet.content)) return;

      const tableName = sheet.name.trim();
      const headers = sheet.content[0] || [];
      const rows = sheet.content.slice(1).reduce<GlobalInteractionRow[]>((result, rowData, contentRowIndex) => {
        const actions = dedupeInteractionActions(getInteractOptionsForRow(tableName, headers, rowData));
        if (actions.length === 0) return result;

        const title = resolveGlobalInteractionRowTitle(headers, rowData, contentRowIndex);
        result.push({
          rowIndex: contentRowIndex,
          title,
          iconName: resolveCustomTableNameIconRowName(tableName, headers, rowData, contentRowIndex),
          actions,
          searchText: buildGlobalInteractionSearchText(tableName, title, actions),
        });
        return result;
      }, []);

      if (rows.length > 0) {
        groups.push({
          tableKey,
          tableName,
          rows,
        });
      }
    });

    return groups;
  };

  const executeTableInteractionAction = createExecuteTableInteractionAction({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    processTemplate: (...a: any[]) => processTemplate(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
  });

  const isNumericCell = value => {
    if (value === null || value === undefined || value === '') return false;
    const str = String(value).trim();
    // 匹配: 纯数字、百分比、分数(50/100)、任意中文/英文标签:数字 格式
    return (
      /^-?\d+(\.\d+)?%?$/.test(str) ||
      /^\d+\/\d+$/.test(str) ||
      /^[\u4e00-\u9fa5a-zA-Z]+[:\s：]\s*\d+/i.test(str) ||
      /\d+/.test(str)
    );
  };

  const extractNumericValue = value => {
    if (!value) return 0;
    const str = String(value).trim();
    // 处理分数形式 (50/100 -> 取第一个数)
    if (/^\d+\/\d+$/.test(str)) return parseInt(str.split('/')[0], 10);
    // 处理百分比
    if (str.endsWith('%')) return parseInt(str.replace('%', ''), 10);
    // 处理 "标签:数值" 格式，提取最后一个数字
    const matches = str.match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[matches.length - 1], 10);
    }
    return 0;
  };

  const parseAttributeString = str => {
    if (!str) return [];
    const results: CharacterAttributeEntry[] = [];
    const rawStr = String(str).trim();

    // 尝试解析 JSON 格式 {"属性名":数值, ...}
    if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
      try {
        const jsonObj = JSON.parse(rawStr);
        for (const key in jsonObj) {
          const val = jsonObj[key];
          if (typeof val === 'number') {
            results.push({ name: key, value: val });
          } else if (typeof val === 'string' && /^\d+$/.test(val)) {
            results.push({ name: key, value: parseInt(val, 10) });
          }
        }
        if (results.length > 0) return results;
      } catch (e) {
        // JSON 解析失败，继续用原有逻辑
      }
    }

    // 原有逻辑：解析 "属性名:数值; 属性名:数值" 格式
    const parts = rawStr.split(/[,;，；\s]+/);
    for (const part of parts) {
      const match = part.match(/^"?([\u4e00-\u9fa5a-zA-Z_]+)"?[:\s：]\s*"?(-?\d+)"?/);
      if (match) {
        results.push({ name: match[1], value: parseInt(match[2], 10) });
      }
    }
    return results;
  };
  // 解析人际关系字符串，推荐使用冒号格式，同时兼容旧式括号格式:
  // 推荐格式: "人名:关系描述;人名:关系描述" 或 "与人名:关系描述;与人名:关系描述"
  // 兼容格式: "人名(关系标签);人名(关系)"
  const parseRelationshipString = str => {
    if (!str) return [];
    const results = [];
    const rawStr = String(str).trim();

    // 按分号分割
    const parts = rawStr.split(/[;；]/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      // 推荐格式: "与人名:关系" 或 "与人名：关系"
      const colonMatch = trimmed.match(/^与?(.+?)[:\：](.+)$/);
      if (colonMatch) {
        const name = colonMatch[1].trim();
        const relation = colonMatch[2].trim();
        if (name && relation) {
          results.push({ name: name, relation: relation });
          continue;
        }
      }

      // 兼容旧式格式: "人名(关系)" 或 "人名（关系）"
      const parenMatch = trimmed.match(/^([^(（]+)[(（]([^)）]+)[)）]$/);
      if (parenMatch) {
        results.push({ name: parenMatch[1].trim(), relation: parenMatch[2].trim() });
        continue;
      }

      // 都不匹配，整个作为人名
      if (trimmed.length > 0) {
        results.push({ name: trimmed, relation: '' });
      }
    }
    return results;
  };

  // [新增] 检测是否是人际关系格式
  const isRelationshipCell = (value, headerName) => {
    if (!value) return false;
    const str = String(value).trim();
    const lowerHeader = (headerName || '').toLowerCase();
    // 表头包含"关系"关键词
    if (lowerHeader.includes('关系') || lowerHeader.includes('人际')) {
      return true;
    }
    // 非关系字段里常见 "名称(说明)"，单个括号不应被误判为人际关系。
    // 仅对旧式括号格式做内容兜底识别：如 "张三(朋友);李四(同事)"。
    // 冒号格式请优先放在列名包含“关系/人际”的关系列中。
    return /^[^(（;；]+[(（][^)）]+[)）](?:[;；][^(（;；]+[(（][^)）]+[)）])+$/.test(str);
  };

  const processTemplate = (template, cardData, headers) => {
    if (!template || !cardData) return template;
    let result = template;
    const name = cardData[1] || '未知';
    result = result.replace(/\{Name\}/gi, name);
    result = result.replace(/\{RowIndex\}/gi, cardData[0] || '0');
    if (headers && headers.length > 0) {
      headers.forEach((header, idx) => {
        if (header && idx < cardData.length) {
          const value = cardData[idx] || '未知';
          const regex = new RegExp(`\\{${header}\\}`, 'gi');
          result = result.replace(regex, value);
        }
      });
    }
    result = result.replace(/\{[^}]+\}/g, '未知');
    return result;
  };

  // 固定显示的功能按钮
  // 注意：保存按钮已移除，系统现在使用即时保存模式（每次编辑/删除后自动保存）
  const ACTION_BUTTONS = [
    // { id: 'acu-btn-save-global', icon: 'fa-save', title: '保存所有修改' }, // 已废弃：使用即时保存
    { id: 'acu-btn-open-editor', icon: 'fa-database', title: '打开数据库' },
    { id: 'acu-btn-open-visualizer', icon: 'fa-table-columns', title: '打开可视化表格编辑' },
    { id: 'acu-btn-collapse', icon: 'fa-chevron-down', title: '收起面板' },
    { id: 'acu-btn-refill', icon: 'fa-bolt', title: '重新填表' },
    { id: 'acu-btn-settings', icon: 'fa-cog', title: '全能设置' },
  ];
  type SpecialNavigationItem = {
    key: string;
    icon: string;
    label: string;
    id: string;
    extraClass: string;
    isActive?: boolean;
    warningIcon?: boolean;
    checkAvailable?: () => boolean;
  };
  type NavigationItem = {
    key: string;
    icon: string;
    label: string;
    isSpecial: boolean;
    id?: string;
    extraClass?: string;
    isActive?: boolean;
    warningIcon?: boolean;
  };

  let isInitialized = false;
  let isSaving = false;
  let saveQueue: Promise<void> = Promise.resolve(); // 保存队列，确保并发保存按顺序执行
  let isEditingOrder = false;
  let isSettingsOpen = false;
  let isGachaItemEditorOpen = false;

  // === 弹窗栈管理 ===
  // 用于追踪弹窗打开顺序，关闭时自动返回上一个弹窗
  type ModalEntry = {
    name: string;
    show: () => void;
  };
  const modalStack: ModalEntry[] = [];

  /**
   * 将弹窗推入栈中
   * @param name 弹窗名称（用于调试）
   * @param show 重新打开该弹窗的函数
   */
  const pushModal = (name: string, show: () => void) => {
    const current = modalStack[modalStack.length - 1];
    if (current?.name === name) {
      current.show = show;
      return;
    }
    modalStack.push({ name, show });
  };

  /**
   * 从栈中弹出当前弹窗并返回上一个弹窗
   * @returns 是否成功返回上一个弹窗
   */
  const popModal = (): boolean => {
    modalStack.pop(); // 移除当前弹窗
    const prev = modalStack.pop(); // 获取上一个弹窗
    if (prev) {
      prev.show(); // 重新打开上一个弹窗
      return true;
    }
    return false;
  };

  /**
   * 清空弹窗栈（用于关闭所有弹窗或从根弹窗关闭）
   */
  const clearModalStack = () => {
    modalStack.length = 0;
  };

  let currentDiffMap = new Set();
  let observer = null;
  let _boundRenderHandler = null;
  let _boundReviewBaselineHandler = null;

  // --- 全局状态变量 ---
  let cachedRawData = null;
  let hasUnsavedChanges = false;
  // [修复] 存储待删除行的索引（按表格分组）
  let pendingDeletions: Record<string, number[]> = {};
  const getPendingDeletions = () => pendingDeletions;
  const clearPendingDeletions = () => {
    pendingDeletions = {};
  };
  const createSheetDataFingerprint = (rawData: unknown): string => {
    if (!rawData || typeof rawData !== 'object') return '';
    const tableRecord = rawData as Record<string, unknown>;
    const sheetEntries = Object.entries(tableRecord)
      .filter(([key, value]) => key.startsWith('sheet_') && value && typeof value === 'object')
      .map(([key, value]) => {
        const sheet = value as Record<string, unknown>;
        return [key, sheet.name, sheet.content];
      })
      .sort((left, right) => String(left[0]).localeCompare(String(right[0])));
    return JSON.stringify(sheetEntries);
  };

  const isSameSheetData = (leftData: unknown, rightData: unknown): boolean => {
    const leftFingerprint = createSheetDataFingerprint(leftData);
    const rightFingerprint = createSheetDataFingerprint(rightData);
    return Boolean(leftFingerprint && rightFingerprint && leftFingerprint === rightFingerprint);
  };

  const AUTO_REGEX_TRANSFORM_COOLDOWN_MS = 5000;
  let lastAutoRegexTransformKey = '';
  let lastAutoRegexTransformAt = 0;
  const createRegexRuleSignature = (rules: readonly RegexTransformationRule[]): string =>
    JSON.stringify(
      rules.map(rule => ({
        id: rule.id,
        operation: rule.operation,
        pattern: rule.pattern,
        flags: rule.flags,
        replacement: rule.replacement,
        scope: rule.scope,
        priority: rule.priority,
        executeMode: rule.executeMode,
        enabled: rule.enabled,
      })),
    );
  const createAutoRegexTransformKey = (rawData: unknown, rules: readonly RegexTransformationRule[]): string => {
    const dataFingerprint = createSheetDataFingerprint(rawData);
    if (!dataFingerprint) return '';
    return `${dataFingerprint}\n${createRegexRuleSignature(rules)}`;
  };
  const shouldSkipAutoRegexTransform = (key: string): boolean =>
    Boolean(
      key &&
      key === lastAutoRegexTransformKey &&
      Date.now() - lastAutoRegexTransformAt < AUTO_REGEX_TRANSFORM_COOLDOWN_MS,
    );
  const rememberAutoRegexTransform = (key: string): void => {
    if (!key) return;
    lastAutoRegexTransformKey = key;
    lastAutoRegexTransformAt = Date.now();
  };

  let isAutoTransforming = false; // 防止自动转换循环触发
  let tablePageStates = {};
  let tableSearchStates = {};
  let lastOptionHash = null;
  let optionPanelVisible = false; // [新增] 选项面板可见性控制
  // [修改] 初始化时从硬盘读取记忆

  let tableScrollStates = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SCROLL);
    if (saved) tableScrollStates = JSON.parse(saved);
  } catch (e) {
    console.warn('[DICE]ACU Error:', e);
  }
  // [优化] 智能更新控制器：后端数据变动时，自动更新快照
  const UpdateController = createUpdateController({
    getTableData: (...a: any[]) => getTableData(...a),
    isSameSheetData: (...a: any[]) => isSameSheetData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    getCachedRawData: () => cachedRawData,
    getValidationEngine: () => ValidationEngine,
    getValidationRuleManager: () => ValidationRuleManager,
    renderInterface: () => renderInterface(),
    updateValidationIndicator: (...a: any[]) => updateValidationIndicator(...a),
  });
  // 更新导航栏验证指示器
  const updateValidationIndicator = count => {
    const { $ } = getCore();
    const $indicator = $('.acu-validation-indicator');

    if (count > 0) {
      if ($indicator.length) {
        $indicator.find('.acu-validation-count').text(count);
        $indicator.show();
      }
    } else {
      $indicator.hide();
    }
  };

  // --- [重构] 上下文指纹工具 ---
  const getCurrentContextFingerprint = () => {
    try {
      // 方式1: 酒馆标准 API
      if (typeof SillyTavern !== 'undefined' && SillyTavern.getCurrentChatId) {
        return SillyTavern.getCurrentChatId();
      }
      // 方式2: 直接访问属性
      if (typeof SillyTavern !== 'undefined' && SillyTavern.chatId) {
        return SillyTavern.chatId;
      }
      // 方式3: 父窗口 (iframe 场景)
      if (window.parent?.SillyTavern?.getCurrentChatId) {
        return window.parent.SillyTavern.getCurrentChatId();
      }
    } catch (e) {
      console.warn('[DICE]ACU getCurrentContextFingerprint error:', e);
    }
    return 'unknown_context';
  };

  // 全局状态追踪 (已清理死代码)


  const COLLAPSE_STYLES = ['bar', 'pill', 'floating'] as const;
  type CollapseStyle = (typeof COLLAPSE_STYLES)[number];

  const normalizeCollapseStyle = (value: unknown): CollapseStyle => {
    const style = String(value || '').trim();
    if (style === 'mini') return 'floating';
    return COLLAPSE_STYLES.includes(style as CollapseStyle) ? (style as CollapseStyle) : 'bar';
  };

  const getNavigationFontMetrics = (size: unknown) => {
    const rawFontSize = typeof size === 'number' && Number.isFinite(size) ? size : DEFAULT_CONFIG.navFontSize;
    const fontSize = Math.max(10, Math.min(20, Math.round(rawFontSize)));

    return {
      fontSize,
      buttonSize: Math.max(28, Math.min(48, Math.round(fontSize * 2.46))),
      iconSize: Math.max(14, Math.min(22, Math.round(fontSize * 1.08))),
      paddingX: Math.max(10, Math.min(20, Math.round(fontSize * 0.92))),
    };
  };

  const FONTS = [
    { id: 'default', name: '系统默认 (Modern)', val: `'Segoe UI', 'Microsoft YaHei', sans-serif` },
    { id: 'hanchan', name: '寒蝉全圆体', val: `"寒蝉全圆体", sans-serif` },
    { id: 'maple', name: 'Maple Mono (代码风)', val: `"Maple Mono NF CN", monospace` },
    { id: 'huiwen', name: '汇文明朝体 (Huiwen)', val: `"Huiwen-mincho", serif` },
    { id: 'cooper', name: 'Cooper正楷', val: `"CooperZhengKai", serif` },
    { id: 'yffyt', name: 'YFFYT (艺术体)', val: `"YFFYT", sans-serif` },
    { id: 'fusion', name: 'Fusion Pixel (像素风)', val: `"Fusion Pixel 12px M latin", monospace` },
    { id: 'wenkai', name: '霞鹜文楷 (WenKai)', val: `"LXGW WenKai", serif` },
    { id: 'notosans', name: '思源黑体 (Noto Sans)', val: `"Noto Sans CJK", sans-serif` },
    { id: 'zhuque', name: '朱雀仿宋 (Zhuque)', val: `"Zhuque Fangsong (technical preview)", serif` },
  ];

  // 主题维护提示：这里控制设置界面的骰子系统主题选项。
  // 新增、改名或改 theme id 时，同步更新 外部参考/数据库主题/acu-db-theme-dice-<theme-id>.json
  // 的文件名、theme.id 和 theme.name，避免数据库本体主题与骰子系统主题脱节。
  const THEMES = [
    { id: 'native', name: '跟随酒馆 (Adaptive)', icon: 'fa-circle-half-stroke' },
    { id: 'retro', name: '复古羊皮 (Retro)', icon: 'fa-scroll' },
    { id: 'dark', name: '极夜深空 (Dark)', icon: 'fa-moon' },
    { id: 'modern', name: '现代清爽 (Modern)', icon: 'fa-sun' },
    { id: 'forest', name: '森之物语 (Forest)', icon: 'fa-tree' },
    { id: 'ocean', name: '深海幽蓝 (Ocean)', icon: 'fa-water' },
    { id: 'cyber', name: '赛博霓虹 (Cyber)', icon: 'fa-bolt' },
    { id: 'nightowl', name: '深蓝磨砂 (Night Owl)', icon: 'fa-feather' },
    { id: 'sakura', name: '暖粉手账 (Warm Pink)', icon: 'fa-heart' },
    { id: 'minepink', name: '量产地雷 (Mine Pink)', icon: 'fa-skull' },
    { id: 'galgame', name: '粉梦物语 (Galgame Pink)', icon: 'fa-heart' },
    { id: 'purple', name: '紫罗兰梦 (Purple)', icon: 'fa-gem' },
    { id: 'wechat', name: '绿色泡泡 (Green Bubble)', icon: 'fa-weixin' },
    { id: 'educational', name: '学习资料 (Educational)', icon: 'fa-book' },
    { id: 'vaporwave', name: '霓虹怀旧 (Vaporwave)', icon: 'fa-palette' },
    { id: 'classicpackaging', name: '经典包装 (Classic Packaging)', icon: 'fa-box' },
    { id: 'terminal', name: '终端绿屏 (Terminal)', icon: 'fa-terminal' },
    { id: 'dreamcore', name: '梦核迷离 (Dreamcore)', icon: 'fa-cloud-moon' },
    { id: 'aurora', name: '极光幻境 (Aurora)', icon: 'fa-snowflake' },
    { id: 'chouten', name: '幻夜霓虹 (Cyber Kawaii)', icon: 'fa-star' },
  ];

  // [优化] 缓存 core 对象 (修复竞态条件 + 增强 ST 穿透查找)
  let _coreCache = null;

  const getAccessibleDocument = (targetWindow: Window | null | undefined): Document | null => {
    if (!targetWindow) return null;
    try {
      return targetWindow.document || null;
    } catch {
      return null;
    }
  };

  const HOST_SELECTOR = '#chat, #send_form, #form_sheld, #send_textarea, #chat_input, #send_but';

  const getTavernHostWindow = createGetTavernHostWindow({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    HOST_SELECTOR: HOST_SELECTOR,
  });

  const getTavernHostDocument = (): Document => getAccessibleDocument(getTavernHostWindow()) || document;

  const createElementFromHtml = (targetDocument: Document, html: string): HTMLElement | null => {
    const template = targetDocument.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild as HTMLElement | null;
  };

  const collectHostAndLocalNodes = <T extends Element>(selector: string): T[] => {
    const nodes = new Set<T>();
    getTavernHostDocument()
      .querySelectorAll<T>(selector)
      .forEach(node => nodes.add(node));
    document.querySelectorAll<T>(selector).forEach(node => nodes.add(node));
    return Array.from(nodes);
  };

  const getCore = () => {
    const w = getTavernHostWindow();
    // 动态获取 jQuery
    const $ = w.jQuery || window.jQuery;

    // 只有当缓存存在且宿主窗口/jQuery 仍一致时才复用，避免移动端多层 iframe 下拿到旧 document
    if (_coreCache && _coreCache.$ && _coreCache.hostWindow === w && _coreCache.$ === $) return _coreCache;

    const core = {
      $: $,
      hostWindow: w,
      getDB: () => w.AutoCardUpdaterAPI || window.AutoCardUpdaterAPI,
      clipboard: w.navigator?.clipboard || window.navigator.clipboard,
      // 增强查找：依次尝试 当前窗口 -> 父窗口 -> 顶层窗口 (带跨域保护)
      ST:
        w.SillyTavern ||
        window.SillyTavern ||
        (() => {
          try {
            return window.top ? window.top.SillyTavern : null;
          } catch (e) {
            return null;
          }
        })(),
    };

    // 只有成功获取到 jQuery 后才锁定缓存，防止初始化过早导致永久失效
    if ($) _coreCache = core;
    return core;
  };

  const ACU_DATABASE_NEW_UI_MENU_SELECTOR = '#acu-v2-menu-item';
  const ACU_DATABASE_NEW_UI_API_METHODS = [
    'openApp',
    'openMain',
    'openNewUI',
    'openNewUi',
    'openUi',
    'openUI',
    'openShell',
    'showApp',
  ];
  const ACU_DATABASE_MANUAL_UPDATE_API_METHODS = [
    'manualUpdate',
    'runManualUpdate',
    'startManualUpdate',
    'triggerManualUpdate',
  ];
  const ACU_DATABASE_V2_ROOT_SELECTOR = '#acu-app-v2, .acu-v2-app';
  const ACU_DATABASE_FORM_FILL_NAV_SELECTOR = '[data-page-id="form-fill"]';
  const ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR = '#form-fill-manual-panel';
  const ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR =
    '#form-fill-manual-panel button, .acu-v2-form-fill-page__actions button, button.acu-btn--primary';
  const ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR = '[id$="-manual-update-card"]';
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS = 1800;
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS = 120;

  const collectAccessibleRuntimeWindows = createCollectAccessibleRuntimeWindows({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const runMaybeAsyncDatabaseUiOpener = async (opener: () => unknown, context = '数据库界面'): Promise<boolean> => {
    try {
      const result = opener();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        const resolved = await result;
        return resolved !== false;
      }
      return result !== false;
    } catch (error) {
      console.warn(`[DICE]打开${context}失败:`, error);
      return false;
    }
  };

  const openDatabaseNewUiViaApi = async (): Promise<boolean> => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (!api || typeof api !== 'object') continue;

      for (const methodName of ACU_DATABASE_NEW_UI_API_METHODS) {
        const method = api[methodName];
        if (typeof method !== 'function') continue;
        const opened = await runMaybeAsyncDatabaseUiOpener(() => method.call(api), '数据库新 UI 入口');
        if (opened) return true;
      }
    }

    return false;
  };

  const openDatabaseNewUiViaMenuEntry = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      const menuItem = targetDocument?.querySelector<HTMLElement>(ACU_DATABASE_NEW_UI_MENU_SELECTOR);
      if (!menuItem || typeof menuItem.click !== 'function') continue;

      menuItem.click();
      return true;
    }

    return false;
  };

  const openLegacyDatabaseSettings = (): boolean => {
    const api = getCore().getDB();
    if (api && typeof api.openSettings === 'function') {
      api.openSettings();
      return true;
    }
    return false;
  };

  const openDatabaseInterface = async (): Promise<void> => {
    if (await openDatabaseNewUiViaApi()) return;
    if (openDatabaseNewUiViaMenuEntry()) return;
    if (openLegacyDatabaseSettings()) return;

    if (window.toastr) {
      window.toastr.warning('数据库脚本未就绪或版本过低，无法打开数据库界面');
    }
  };

  type DatabaseVisualizerNewUiOpenResult = 'opened' | 'unavailable' | 'failed';

  const openDatabaseVisualizerNewUiViaApi = async (): Promise<DatabaseVisualizerNewUiOpenResult> => {
    let hasNewUiVisualizerApi = false;

    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (!api || typeof api.openVisualizer !== 'function') continue;
      hasNewUiVisualizerApi = true;
      const opened = await runMaybeAsyncDatabaseUiOpener(
        () => api.openVisualizer.call(api),
        '新版可视化表格编辑器',
      );
      if (opened) return 'opened';
    }

    return hasNewUiVisualizerApi ? 'failed' : 'unavailable';
  };

  const openLegacyDatabaseVisualizer = async (): Promise<boolean> => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterAPI;
      if (api && typeof api.openVisualizer === 'function') {
        const opened = await runMaybeAsyncDatabaseUiOpener(() => api.openVisualizer.call(api), '旧版可视化表格编辑器');
        if (opened) return true;
      }

      const legacyGlobal = (targetWindow as any).openNewVisualizer_ACU;
      if (typeof legacyGlobal === 'function') {
        const opened = await runMaybeAsyncDatabaseUiOpener(() => legacyGlobal.call(targetWindow), '旧版可视化表格编辑器');
        if (opened) return true;
      }
    }

    return false;
  };

  const openDatabaseVisualizerInterface = async (): Promise<void> => {
    const newUiOpenResult = await openDatabaseVisualizerNewUiViaApi();
    if (newUiOpenResult === 'opened') return;
    if (newUiOpenResult === 'unavailable' && (await openLegacyDatabaseVisualizer())) return;

    if (window.toastr) {
      const message =
        newUiOpenResult === 'failed'
          ? '新版可视化编辑器入口调用失败，请检查数据库本体控制台日志'
          : '可视化编辑器接口不可用，请确保数据库脚本已加载';
      window.toastr.warning(message);
    }
  };

  type DatabaseManualUpdateResult =
    | { status: 'updated'; source: string }
    | { status: 'unavailable' }
    | { status: 'failed'; error?: unknown; source?: string };

  const waitForDatabaseUiTick = (ms = 120): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  const isElementVisibleInLayout = (element: HTMLElement): boolean => {
    const targetWindow = element.ownerDocument.defaultView || window;
    const style = targetWindow.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const normalizeDatabaseUiText = (text: string | null | undefined): string =>
    String(text || '')
      .replace(/\s+/g, ' ')
      .trim();

  const isDatabaseManualUpdateButtonText = (text: string): boolean =>
    text.includes('执行手动填表') || text.includes('交火索引已启用');

  const isDatabaseManualUpdateActionButton = (button: HTMLButtonElement): boolean => {
    const buttonText = normalizeDatabaseUiText(button.textContent);
    if (isDatabaseManualUpdateButtonText(buttonText)) return true;

    const inManualPanel = !!button.closest(ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR);
    const inManualActions = !!button.closest('.acu-v2-form-fill-page__actions');
    return inManualPanel && inManualActions;
  };

  const isDatabaseButtonDisabled = (button: HTMLButtonElement): boolean =>
    button.disabled || button.getAttribute('aria-disabled') === 'true';

  const hasDatabaseNewUiRuntime = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (api && typeof api === 'object') return true;

      const targetDocument = getAccessibleDocument(targetWindow);
      if (targetDocument?.querySelector(ACU_DATABASE_V2_ROOT_SELECTOR)) return true;
      if (targetDocument?.querySelector(ACU_DATABASE_NEW_UI_MENU_SELECTOR)) return true;
    }

    return false;
  };

  const findDatabaseNewUiManualUpdateButton = ():
    | { status: 'found'; button: HTMLButtonElement }
    | { status: 'disabled'; text: string }
    | { status: 'unavailable' } => {
    let disabledButtonText = '';

    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      if (!targetDocument) continue;

      const rawButtons = Array.from(
        targetDocument.querySelectorAll<HTMLButtonElement>(ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR),
      );
      const candidateButtons = rawButtons.filter(
        button => isElementVisibleInLayout(button) && isDatabaseManualUpdateActionButton(button),
      );

      const manualButton =
        candidateButtons.find(button => {
          const text = normalizeDatabaseUiText(button.textContent);
          return !isDatabaseButtonDisabled(button) && text.includes('执行手动填表');
        }) ||
        candidateButtons.find(button => {
          const text = normalizeDatabaseUiText(button.textContent);
          return !isDatabaseButtonDisabled(button) && text.includes('交火索引已启用');
        }) ||
        candidateButtons.find(button => !isDatabaseButtonDisabled(button));

      if (manualButton) return { status: 'found', button: manualButton };

      const disabledButton = candidateButtons.find(button => isDatabaseButtonDisabled(button));
      if (disabledButton) {
        const buttonText = normalizeDatabaseUiText(disabledButton.textContent);
        disabledButtonText = buttonText || '执行手动填表';
        continue;
      }
    }

    return disabledButtonText ? { status: 'disabled', text: disabledButtonText } : { status: 'unavailable' };
  };

  const waitForDatabaseNewUiManualUpdateButton = async (
    timeoutMs = ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  ): Promise<ReturnType<typeof findDatabaseNewUiManualUpdateButton>> => {
    const deadline = Date.now() + timeoutMs;
    let latestDisabledText = '';

    do {
      const buttonResult = findDatabaseNewUiManualUpdateButton();
      if (buttonResult.status === 'found') return buttonResult;
      if (buttonResult.status === 'disabled') latestDisabledText = buttonResult.text;

      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() < deadline);

    return latestDisabledText ? { status: 'disabled', text: latestDisabledText } : { status: 'unavailable' };
  };

  const hasDatabaseManualUpdateSurface = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      if (!targetDocument) continue;

      const panel = targetDocument.querySelector<HTMLElement>(ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR);
      if (panel && isElementVisibleInLayout(panel)) return true;

      const manualButton = Array.from(
        targetDocument.querySelectorAll<HTMLButtonElement>(ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR),
      ).find(button => isElementVisibleInLayout(button) && isDatabaseManualUpdateActionButton(button));
      if (manualButton) return true;
    }

    return false;
  };

  const waitForDatabaseManualUpdateSurface = async (timeoutMs = ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS) => {
    const start = Date.now();

    do {
      if (hasDatabaseManualUpdateSurface()) return true;

      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() - start < timeoutMs);

    return false;
  };

  const clickDatabaseNewUiFormFillNavigation = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      const navButton = targetDocument?.querySelector<HTMLElement>(ACU_DATABASE_FORM_FILL_NAV_SELECTOR);
      if (!navButton || typeof navButton.click !== 'function') continue;
      if (!isElementVisibleInLayout(navButton)) continue;

      navButton.click();
      return true;
    }

    return false;
  };

  const openDatabaseFormFillPage = async (): Promise<boolean> => {
    if (clickDatabaseNewUiFormFillNavigation()) {
      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
      if (await waitForDatabaseManualUpdateSurface(480)) return true;
    }

    const opened = (await openDatabaseNewUiViaApi()) || openDatabaseNewUiViaMenuEntry();
    if (!opened && !hasDatabaseNewUiRuntime()) return false;

    const deadline = Date.now() + ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS;
    do {
      if (clickDatabaseNewUiFormFillNavigation()) {
        await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
        if (await waitForDatabaseManualUpdateSurface(480)) return true;
      }
      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() < deadline);

    return waitForDatabaseManualUpdateSurface(ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS);
  };

  const runDatabaseManualUpdateViaNewUiButton = async (): Promise<DatabaseManualUpdateResult> => {
    let buttonResult = await waitForDatabaseNewUiManualUpdateButton(360);

    if (buttonResult.status === 'unavailable' && (await openDatabaseFormFillPage())) {
      buttonResult = await waitForDatabaseNewUiManualUpdateButton();
    }

    if (buttonResult.status === 'found') {
      buttonResult.button.click();
      return { status: 'updated', source: '新版填表工作台按钮' };
    }

    if (buttonResult.status === 'disabled') {
      return {
        status: 'failed',
        source: '新版填表工作台按钮',
        error: `新版填表工作台的「${buttonResult.text}」按钮当前不可用，请先选择至少一张表，或等待当前填表完成。`,
      };
    }

    return { status: 'unavailable' };
  };

  const runMaybeAsyncDatabaseManualUpdate = async (
    updater: () => unknown,
    source: string,
  ): Promise<DatabaseManualUpdateResult> => {
    try {
      const result = updater();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        const resolved = await result;
        return resolved === false ? { status: 'failed', source } : { status: 'updated', source };
      }
      return result === false ? { status: 'failed', source } : { status: 'updated', source };
    } catch (error) {
      console.warn(`[DICE]${source}调用失败:`, error);
      return { status: 'failed', error, source };
    }
  };

  const runDatabaseManualUpdateViaApi = async (options?: {
    includeLegacyApi?: boolean;
  }): Promise<DatabaseManualUpdateResult> => {
    let failedResult: DatabaseManualUpdateResult | null = null;
    const includeLegacyApi = options?.includeLegacyApi !== false;

    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const apiEntries = [
        { source: '新版数据库 manualUpdate API', api: (targetWindow as any).AutoCardUpdaterV2API },
        ...(includeLegacyApi
          ? [{ source: '旧版数据库 manualUpdate API', api: (targetWindow as any).AutoCardUpdaterAPI }]
          : []),
      ];

      for (const { source, api } of apiEntries) {
        if (!api || typeof api !== 'object') continue;

        for (const methodName of ACU_DATABASE_MANUAL_UPDATE_API_METHODS) {
          const method = api[methodName];
          if (typeof method !== 'function') continue;

          const result = await runMaybeAsyncDatabaseManualUpdate(() => method.call(api), `${source}.${methodName}`);
          if (result.status === 'updated') return result;
          failedResult = result;
        }
      }
    }

    return failedResult || { status: 'unavailable' };
  };

  const runDatabaseManualUpdateViaLegacyButton = (): DatabaseManualUpdateResult => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      const manualUpdateButton = targetDocument?.querySelector<HTMLElement>(
        ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR,
      );
      if (!manualUpdateButton || typeof manualUpdateButton.click !== 'function') continue;

      manualUpdateButton.click();
      return { status: 'updated', source: '旧版数据库设置面板手动填表按钮' };
    }

    return { status: 'unavailable' };
  };

  const runDatabaseManualUpdate = async (): Promise<DatabaseManualUpdateResult> => {
    const newUiApiResult = await runDatabaseManualUpdateViaApi({ includeLegacyApi: false });
    if (newUiApiResult.status !== 'unavailable') return newUiApiResult;

    const newUiButtonResult = await runDatabaseManualUpdateViaNewUiButton();
    if (newUiButtonResult.status !== 'unavailable') return newUiButtonResult;

    const legacyApiResult = await runDatabaseManualUpdateViaApi({ includeLegacyApi: true });
    if (legacyApiResult.status === 'updated') return legacyApiResult;

    const legacyButtonResult = runDatabaseManualUpdateViaLegacyButton();
    if (legacyButtonResult.status === 'updated') return legacyButtonResult;

    if (hasDatabaseNewUiRuntime()) {
      return {
        status: 'failed',
        source: '新版填表工作台',
        error: '已检测到新版数据库 UI，但没有找到可执行的「执行手动填表」按钮。请先打开数据库的「填表工作台」页面并确认已选择表格。',
      };
    }

    return legacyApiResult.status === 'unavailable' ? legacyButtonResult : legacyApiResult;
  };

  const getDatabaseManualUpdateErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error.trim()) return error;
    return fallback;
  };

  const showDatabaseManualUpdateFailure = (title: string, message: string): void => {
    if (window.toastr) {
      showActionableErrorToast(`${title}: ${message}`, {
        title,
        developerHint: true,
        toastrOptions: { timeOut: 5000 },
      });
      return;
    }

    void showDiceSystemConfirmDialog({
      title,
      message,
      iconClass: 'fa-triangle-exclamation',
      confirmText: '知道了',
      tone: 'danger',
      hideCancel: true,
    });
  };

  const updateSaveButtonState = () => {
    const { $ } = getCore();
    const $btn = $('#acu-btn-save-global');
    const $icon = $btn.find('i');
    const deletions = getPendingDeletions();
    let hasDeletions = false;
    if (deletions) {
      for (const key in deletions) {
        if (deletions[key] && deletions[key].length > 0) {
          hasDeletions = true;
          break;
        }
      }
    }
    if (hasUnsavedChanges || hasDeletions) {
      $icon.addClass('acu-icon-breathe');
      $btn.attr('title', '你有未保存的手动修改或删除操作');
    } else {
      $icon.removeClass('acu-icon-breathe');
      $btn.attr('title', '保存');
      $btn.css('color', '');
    }
  };

  const getIconForTableName = name => {
    if (!name) return 'fa-table';
    const n = name.toLowerCase();
    if (n.includes('主角') || n.includes('角色')) return 'fa-user-circle';
    if (n.includes('通用') || n.includes('全局')) return 'fa-globe-asia';
    if (n.includes('装扮') || n.includes('服装') || n.includes('外观')) return 'fa-shirt';
    if (n.includes('装备') || n.includes('背包')) return 'fa-briefcase';
    if (n.includes('技能') || n.includes('武魂')) return 'fa-dragon';
    if (n.includes('恋爱日记') || n.includes('日记')) return 'fa-book-open';
    if (n.includes('恋爱对象') || n.includes('恋爱')) return 'fa-heart';
    if (n.includes('关系') || n.includes('周边')) return 'fa-user-friends';
    if (n.includes('备忘') || n.includes('便签')) return 'fa-note-sticky';
    if (n.includes('任务') || n.includes('日志')) return 'fa-scroll';
    if (n.includes('人物') || n.includes('关键人物')) return 'fa-address-book';
    if (n.includes('纪要')) return 'fa-clipboard-list';
    if (n.includes('总结') || n.includes('大纲')) return 'fa-book-reader';
    if (n.includes('地图点') || n.includes('世界地图')) return 'fa-map-location-dot';
    if (n.includes('地图元素') || n.includes('机关') || n.includes('线索')) return 'fa-bullseye';
    if (n.includes('势力') || n.includes('阵营')) return 'fa-shield-halved';
    if (n.includes('物品')) return 'fa-gem';
    if (n.includes('情报') || n.includes('信息')) return 'fa-file-lines';
    if (n.includes('检定建议')) return 'fa-dice-d20';
    if (n.includes('选项')) return 'fa-list-check';
    return 'fa-table';
  };

  type CustomTableNameIconModuleId =
    | 'table-name'
    | 'item'
    | 'equipment'
    | 'faction'
    | 'global-interaction-panel'
    | 'global-interaction-map-marker'
    | 'shop'
    | 'avatar-manager'
    | 'relationship-graph'
    | 'map-character-node'
    | 'character-interaction-panel'
    | 'alias-resolution'
    | 'user-graph-resolution';

  type CustomTableNameIconSection =
    | 'table'
    | 'map'
    | 'item'
    | 'equipment'
    | 'faction'
    | 'shop'
    | 'task'
    | 'skill'
    | 'generic'
    | 'character'
    | 'relationship'
    | 'alias'
    | 'user';

  interface CustomTableNameIconContext {
    moduleId: CustomTableNameIconModuleId;
    tableName: string;
    section: CustomTableNameIconSection;
    name: string;
  }

  type CustomTableNameIconSourceType = 'url' | 'local';

  type CustomTableNameIconInvalidSourceReason =
    | 'invalid_url'
    | 'invalid_protocol'
    | 'svg_url'
    | 'svg_mime'
    | 'unsupported_mime'
    | 'oversize';

  const CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION = 1;

  interface CustomTableNameIconEntry extends CustomTableNameIconContext {
    sourceType: CustomTableNameIconSourceType;
    imageUrl: string;
    localIconKey: string | null;
    imageMimeType: string | null;
    imageSize: number | null;
    createdAt: number;
    updatedAt: number;
  }

  interface CustomTableNameIconPackEntryMetadata {
    imageMimeType: string | null;
    imageSize: number | null;
    missingLocalBinary?: boolean;
    originalLocalKey?: string | null;
  }

  interface CustomTableNameIconPackEntry extends CustomTableNameIconContext {
    sourceType: CustomTableNameIconSourceType;
    url?: string;
    localKey?: string | null;
    metadata: CustomTableNameIconPackEntryMetadata;
  }

  interface CustomTableNameIconPack {
    schemaVersion: number;
    exportedAt: string;
    entries: CustomTableNameIconPackEntry[];
  }

  interface CustomTableNameIconPackImportAnalysis {
    entriesToImport: CustomTableNameIconEntry[];
    importedCount: number;
    overwrittenCount: number;
    skippedInvalidUrlCount: number;
    skippedNonWhitelistCount: number;
    skippedInvalidEntryCount: number;
    localMissingCount: number;
  }

  interface ResolvedCustomTableNameIcon {
    icon: string;
    entry: CustomTableNameIconEntry | null;
    key: string | null;
    sourceType: CustomTableNameIconSourceType | null;
    imageUrl: string | null;
    localIconKey: string | null;
    assetUrl: string | null;
    reason: 'invalid' | 'invalid_source' | 'not_whitelisted' | 'missing' | 'resolved';
  }

  interface CustomTableNameIconImageRecord {
    key: string;
    blob: Blob;
    size: number;
    type: string;
    updatedAt: number;
  }

  type DashboardCustomTableNameIconContextInfo = {
    moduleId: CustomTableNameIconModuleId;
    section: CustomTableNameIconSection;
  };

  const DASHBOARD_MODULE_SECTION_KIND: Record<string, GlobalInteractionSectionKind> = {
    player: 'character',
    npc: 'character',
    location: 'map',
    bag: 'item',
    equip: 'equipment',
    quest: 'task',
    skill: 'skill',
  };

  const CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS: Record<string, DashboardCustomTableNameIconContextInfo> = {
    location: { moduleId: 'global-interaction-map-marker', section: 'map' },
    bag: { moduleId: 'item', section: 'item' },
    equip: { moduleId: 'equipment', section: 'equipment' },
    quest: { moduleId: 'global-interaction-panel', section: 'task' },
    skill: { moduleId: 'global-interaction-panel', section: 'skill' },
  };

  const getDashboardModuleKeysForTableName = (tableName: string): string[] => {
    const normalizedTableName = normalizeGlobalInteractionCategoryText(tableName);
    if (!normalizedTableName) return [];

    return Object.entries(getDashboardRuntimeConfig())
      .filter(([, moduleConfig]) =>
        moduleConfig.tableKeywords.some(keyword =>
          normalizedTableName.includes(normalizeGlobalInteractionCategoryText(keyword)),
        ),
      )
      .map(([moduleKey]) => moduleKey);
  };

  const resolveDashboardGlobalInteractionSectionKind = (tableName: string): GlobalInteractionSectionKind | null => {
    for (const moduleKey of getDashboardModuleKeysForTableName(tableName)) {
      const sectionKind = DASHBOARD_MODULE_SECTION_KIND[moduleKey];
      if (sectionKind) return sectionKind;
    }
    return null;
  };

  const resolveDashboardCustomTableNameIconContextInfo = (
    tableName: string,
  ): DashboardCustomTableNameIconContextInfo | null => {
    for (const moduleKey of getDashboardModuleKeysForTableName(tableName)) {
      const contextInfo = CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS[moduleKey];
      if (contextInfo) return contextInfo;
    }
    return null;
  };

  const resolveDashboardCustomTableNameIconRowName = (
    tableName: string,
    headers: unknown[],
    rowData: unknown[],
  ): string | null => {
    for (const moduleKey of getDashboardModuleKeysForTableName(tableName)) {
      const moduleConfig = getDashboardModuleConfig(moduleKey);
      if (!moduleConfig?.columns?.name) continue;
      const nameColumnIndex = DashboardDataParser.findColumnIndex(headers, 'name', moduleConfig);
      const nameText = nameColumnIndex >= 0 ? getStringLikeCellText(rowData[nameColumnIndex]) : '';
      if (nameText) return nameText;
    }
    return null;
  };

  const resolveCustomTableNameIconRowName = createResolveCustomTableNameIconRowName({
    resolveDashboardCustomTableNameIconRowName: (...a: any[]) => resolveDashboardCustomTableNameIconRowName(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
  });

  const CUSTOM_TABLE_NAME_ICON_MODULE_IDS: readonly CustomTableNameIconModuleId[] = [
    'table-name',
    'item',
    'equipment',
    'faction',
    'global-interaction-panel',
    'global-interaction-map-marker',
    'shop',
    'avatar-manager',
    'relationship-graph',
    'map-character-node',
    'character-interaction-panel',
    'alias-resolution',
    'user-graph-resolution',
  ];
  const CUSTOM_TABLE_NAME_ICON_SECTIONS: readonly CustomTableNameIconSection[] = [
    'table',
    'map',
    'item',
    'equipment',
    'faction',
    'shop',
    'task',
    'skill',
    'generic',
    'character',
    'relationship',
    'alias',
    'user',
  ];
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS = new Set<CustomTableNameIconSection>([
    'map',
    'item',
    'equipment',
    'faction',
    'shop',
    'task',
    'skill',
    'generic',
  ]);
  const CUSTOM_TABLE_NAME_ICON_DENIED_MODULES = new Set<CustomTableNameIconModuleId>([
    'avatar-manager',
    'relationship-graph',
    'map-character-node',
    'character-interaction-panel',
    'alias-resolution',
    'user-graph-resolution',
  ]);
  const CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS = new Set<CustomTableNameIconSection>([
    'character',
    'relationship',
    'alias',
    'user',
  ]);
  const CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES = new Set<string>([
    '全局数据表',
    '纪要表',
    '总结表',
    '总结大纲表',
    '总体大纲',
    '选项表',
    '检定建议表',
    '主角信息',
    '重要人物表',
    '重要角色表',
  ]);

  const isCustomTableNameIconModuleId = (value: string): value is CustomTableNameIconModuleId =>
    CUSTOM_TABLE_NAME_ICON_MODULE_IDS.includes(value as CustomTableNameIconModuleId);

  const isCustomTableNameIconSection = (value: string): value is CustomTableNameIconSection =>
    CUSTOM_TABLE_NAME_ICON_SECTIONS.includes(value as CustomTableNameIconSection);

  const normalizeCustomTableNameIconKeyPart = (value: unknown): string => String(value ?? '').trim();

  const isCustomTableNameIconTableDenied = (tableName: string): boolean => {
    const normalizedTableName = String(tableName || '').trim();
    if (!normalizedTableName) return true;
    if (CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES.has(normalizedTableName)) return true;
    if (isPlayerTableName(normalizedTableName) || isNpcLikeTableName(normalizedTableName)) return true;
    return resolveDashboardGlobalInteractionSectionKind(normalizedTableName) === 'character';
  };

  const normalizeCustomTableNameIconContext = (value: unknown): CustomTableNameIconContext | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const raw = value as Record<string, unknown>;
    const moduleId = normalizeCustomTableNameIconKeyPart(raw.moduleId);
    const tableName = normalizeCustomTableNameIconKeyPart(raw.tableName);
    const section = normalizeCustomTableNameIconKeyPart(raw.section);
    const name = normalizeCustomTableNameIconKeyPart(raw.name);
    if (!isCustomTableNameIconModuleId(moduleId) || !isCustomTableNameIconSection(section)) return null;
    if (!tableName || !name) return null;
    return {
      moduleId,
      tableName,
      section,
      name,
    };
  };

  const getCustomTableNameIconContextKey = (context: CustomTableNameIconContext): string =>
    [context.moduleId, context.tableName, context.section, context.name]
      .map(normalizeCustomTableNameIconKeyPart)
      .join('||');

  const normalizeCustomTableNameIconEntry = (value: unknown): CustomTableNameIconEntry | null => {
    const context = normalizeCustomTableNameIconContext(value);
    if (!context) return null;
    const raw = value as Record<string, unknown>;
    const sourceType = raw.sourceType === 'local' ? 'local' : 'url';
    const imageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl.trim() : '';
    const localIconKey = typeof raw.localIconKey === 'string' ? raw.localIconKey.trim() : '';
    const imageMimeType = typeof raw.imageMimeType === 'string' ? raw.imageMimeType.trim() : '';
    const imageSize = typeof raw.imageSize === 'number' && Number.isFinite(raw.imageSize) ? raw.imageSize : null;
    if (sourceType === 'url') {
      if (!isCustomTableNameIconImageUrlValid(imageUrl)) return null;
    } else if (!localIconKey) {
      return null;
    }
    const createdAt = typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0;
    const updatedAt = typeof raw.updatedAt === 'number' && Number.isFinite(raw.updatedAt) ? raw.updatedAt : createdAt;
    return {
      ...context,
      sourceType,
      imageUrl,
      localIconKey: localIconKey || null,
      imageMimeType: imageMimeType || null,
      imageSize,
      createdAt,
      updatedAt,
    };
  };

  const CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
  ]);
  const CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE = 1024 * 1024;

  const isCustomTableNameIconSvgMimeType = (value: string): boolean =>
    String(value || '')
      .trim()
      .toLowerCase() === 'image/svg+xml';

  function isCustomTableNameIconImageUrlValid(url: string): boolean {
    return getCustomTableNameIconImageUrlValidationError(url) === null;
  }

  function getCustomTableNameIconImageUrlValidationError(url: string): CustomTableNameIconInvalidSourceReason | null {
    return getRemoteImageUrlValidationError(url);
  }

  function getCustomTableNameIconLocalFileValidationError(
    file: File | null,
  ): CustomTableNameIconInvalidSourceReason | null {
    if (!file) return 'invalid_url';
    const mimeType = String(file.type || '')
      .trim()
      .toLowerCase();
    if (isCustomTableNameIconSvgMimeType(mimeType)) return 'svg_mime';
    if (!CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES.has(mimeType)) return 'unsupported_mime';
    if (file.size > CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE) return 'oversize';
    return null;
  }


  const isCustomTableNameIconContextAllowed = (context: CustomTableNameIconContext): boolean => {
    if (CUSTOM_TABLE_NAME_ICON_DENIED_MODULES.has(context.moduleId)) return false;
    if (CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS.has(context.section)) return false;
    if (isCustomTableNameIconTableDenied(context.tableName)) return false;

    if (context.moduleId === 'table-name') {
      return context.section === 'table';
    }
    if (context.moduleId === 'global-interaction-map-marker') {
      return context.section === 'map';
    }
    if (context.moduleId === 'item') {
      return context.section === 'item';
    }
    if (context.moduleId === 'equipment') {
      return context.section === 'equipment';
    }
    if (context.moduleId === 'faction') {
      return context.section === 'faction';
    }
    if (context.moduleId === 'global-interaction-panel') {
      return CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS.has(context.section);
    }
    if (context.moduleId === 'shop') {
      return context.section === 'shop';
    }

    return false;
  };

  const getCustomTableNameIconFallbackContexts = (
    context: CustomTableNameIconContext,
  ): CustomTableNameIconContext[] => {
    const fallbackContexts: CustomTableNameIconContext[] = [];

    const addFallbackContext = (fallbackContext: CustomTableNameIconContext): void => {
      if (getCustomTableNameIconContextKey(fallbackContext) === getCustomTableNameIconContextKey(context)) return;
      if (!isCustomTableNameIconContextAllowed(fallbackContext)) return;
      if (
        fallbackContexts.some(
          item => getCustomTableNameIconContextKey(item) === getCustomTableNameIconContextKey(fallbackContext),
        )
      )
        return;
      fallbackContexts.push(fallbackContext);
    };

    if (context.moduleId === 'global-interaction-panel') {
      const directModuleId = (() => {
        if (context.section === 'item') return 'item';
        if (context.section === 'equipment') return 'equipment';
        if (context.section === 'faction') return 'faction';
        if (context.section === 'shop') return 'shop';
        return null;
      })();
      if (directModuleId) {
        addFallbackContext({
          ...context,
          moduleId: directModuleId,
        });
      }
    }

    if (context.moduleId !== 'table-name') {
      addFallbackContext({
        ...context,
        moduleId: 'table-name',
        section: 'table',
      });
    }

    return fallbackContexts;
  };

  const CustomTableNameIconStoreManager = createCustomTableNameIconStoreManager({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    normalizeCustomTableNameIconEntry: (...a: any[]) => normalizeCustomTableNameIconEntry(...a),
    STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS: STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS,
  });

  const resolveCustomTableNameIcon = createResolveCustomTableNameIcon({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconFallbackContexts: (...a: any[]) => getCustomTableNameIconFallbackContexts(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
    normalizeCustomTableNameIconKeyPart: (...a: any[]) => normalizeCustomTableNameIconKeyPart(...a),
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const resolveCustomTableNameIconAssetUrl = async (
    context?: CustomTableNameIconContext | null,
  ): Promise<string | null> => {
    const resolved = resolveCustomTableNameIcon('fa-table', context);
    if (!resolved.entry) return null;
    if (resolved.entry.sourceType === 'url') {
      const url = resolved.entry.imageUrl;
      if (!isCustomTableNameIconImageUrlValid(url)) {
        CustomTableNameIconImageDB.markUrlFailed(url);
        return null;
      }
      if (CustomTableNameIconImageDB.hasUrlFailed(url)) return null;
      return url;
    }
    const localKey = resolved.entry.localIconKey;
    if (!localKey) return null;
    if (CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return null;
    return await CustomTableNameIconImageDB.get(localKey);
  };

  type CustomTableNameIconManagerCandidateSource = 'direct' | 'interaction' | 'saved';

  interface CustomTableNameIconManagerRawSheet {
    key: string;
    name: string;
    content: unknown[][];
  }

  interface CustomTableNameIconManagerCandidate {
    context: CustomTableNameIconContext;
    key: string;
    tableKey: string;
    source: CustomTableNameIconManagerCandidateSource;
    searchText: string;
  }

  const CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS: Record<CustomTableNameIconModuleId, string> = {
    'table-name': '通用表格',
    item: '物品',
    equipment: '装备',
    faction: '势力',
    'global-interaction-panel': '交互面板',
    'global-interaction-map-marker': '地图标记',
    shop: '商店',
    'avatar-manager': '角色头像预设',
    'relationship-graph': '关系图',
    'map-character-node': '地图角色',
    'character-interaction-panel': '角色交互',
    'alias-resolution': '别名解析',
    'user-graph-resolution': '用户解析',
  };

  const CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS: Record<CustomTableNameIconSection, string> = {
    table: '表格',
    map: '地图',
    item: '物品',
    equipment: '装备',
    faction: '势力',
    shop: '商店',
    task: '任务',
    skill: '技能',
    generic: '通用',
    character: '角色',
    relationship: '关系',
    alias: '别名',
    user: '用户',
  };

  const CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION: Partial<
    Record<CustomTableNameIconSection, CustomTableNameIconModuleId>
  > = {
    item: 'item',
    equipment: 'equipment',
    faction: 'faction',
    shop: 'shop',
  };

  const getCustomTableNameIconManagerModuleLabel = (moduleId: CustomTableNameIconModuleId): string =>
    CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS[moduleId] || moduleId;

  const getCustomTableNameIconManagerSectionLabel = (section: CustomTableNameIconSection): string =>
    CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS[section] || section;

  const getCustomTableNameIconManagerSourceLabel = (source: CustomTableNameIconManagerCandidateSource): string => {
    if (source === 'direct') return '表格条目';
    if (source === 'interaction') return '交互条目';
    return '已保存映射';
  };

  const getCustomTableNameIconManagerContextLabel = (context: CustomTableNameIconContext): string => {
    const seenLabels = new Set<string>();
    const labels = [
      getCustomTableNameIconManagerModuleLabel(context.moduleId),
      context.tableName,
      getCustomTableNameIconManagerSectionLabel(context.section),
    ]
      .map(label => label.trim())
      .filter(label => {
        if (!label) return false;
        const key = normalizeGlobalInteractionCategoryText(label);
        if (seenLabels.has(key)) return false;
        seenLabels.add(key);
        return true;
      });
    return labels.join(' / ') || context.tableName || context.name;
  };

  const getCustomTableNameIconManagerLocalKey = (context: CustomTableNameIconContext): string =>
    `custom-table-name-icon::${getCustomTableNameIconContextKey(context)}`;

  const getCustomTableNameIconManagerRawSheets = (): CustomTableNameIconManagerRawSheet[] => {
    const rawData = getTableData({ silent: true }) as unknown;
    if (!isRecord(rawData)) return [];

    return Object.entries(rawData).reduce<CustomTableNameIconManagerRawSheet[]>((result, [key, sheet]) => {
      if (!key.startsWith('sheet_') || !isRecord(sheet)) return result;
      const name = typeof sheet.name === 'string' ? sheet.name.trim() : '';
      const content = sheet.content;
      if (!name || !isTwoDimensionalArray(content)) return result;
      result.push({ key, name, content });
      return result;
    }, []);
  };

  const resolveCustomTableNameIconManagerDirectSection = (tableName: string): CustomTableNameIconSection | null => {
    const normalizedName = normalizeGlobalInteractionCategoryText(tableName);
    if (normalizedName.includes('商店') || normalizedName.includes('店铺') || normalizedName.includes('shop'))
      return 'shop';
    const meta = resolveGlobalInteractionSectionMeta(tableName);
    if (meta.kind === 'item' || meta.kind === 'equipment' || meta.kind === 'faction') return meta.kind;
    return null;
  };

  const createCustomTableNameIconManagerCandidate = (
    context: CustomTableNameIconContext,
    tableKey: string,
    source: CustomTableNameIconManagerCandidateSource,
  ): CustomTableNameIconManagerCandidate | null => {
    const normalizedContext = normalizeCustomTableNameIconContext(context);
    if (!normalizedContext || !isCustomTableNameIconContextAllowed(normalizedContext)) return null;
    const key = getCustomTableNameIconContextKey(normalizedContext);
    return {
      context: normalizedContext,
      key,
      tableKey,
      source,
      searchText: [
        getCustomTableNameIconManagerModuleLabel(normalizedContext.moduleId),
        getCustomTableNameIconManagerSectionLabel(normalizedContext.section),
        normalizedContext.tableName,
        normalizedContext.name,
        getCustomTableNameIconManagerSourceLabel(source),
      ]
        .join(' ')
        .toLowerCase(),
    };
  };

  const getCustomTableNameIconManagerCandidates = createGetCustomTableNameIconManagerCandidates({
    buildGlobalInteractionGroups: (...a: any[]) => buildGlobalInteractionGroups(...a),
    createCustomTableNameIconManagerCandidate: (...a: any[]) => createCustomTableNameIconManagerCandidate(...a),
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerRawSheets: (...a: any[]) => getCustomTableNameIconManagerRawSheets(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    resolveCustomTableNameIconManagerDirectSection: (...a: any[]) => resolveCustomTableNameIconManagerDirectSection(...a),
    resolveCustomTableNameIconRowName: (...a: any[]) => resolveCustomTableNameIconRowName(...a),
    resolveDashboardCustomTableNameIconContextInfo: (...a: any[]) => resolveDashboardCustomTableNameIconContextInfo(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
    CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION: CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION,
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const getCustomTableNameIconManagerInvalidSourceText = (
    reason: CustomTableNameIconInvalidSourceReason | null,
  ): string => {
    if (reason === 'invalid_protocol') return '仅支持 http/https 图片地址';
    if (reason === 'svg_url' || reason === 'svg_mime') return '不支持 SVG 图片';
    if (reason === 'unsupported_mime') return '仅支持 PNG、JPEG、WebP、GIF';
    if (reason === 'oversize') return '本地图片不能超过 1 MB';
    return '图片来源无效';
  };

  const getCustomTableNameIconManagerEntryAsset = async (
    entry: CustomTableNameIconEntry | null,
  ): Promise<{ assetUrl: string; isMissing: boolean }> => {
    if (!entry) return { assetUrl: '', isMissing: false };
    if (entry.sourceType === 'url') {
      const isValid = isCustomTableNameIconImageUrlValid(entry.imageUrl);
      return { assetUrl: isValid ? entry.imageUrl : '', isMissing: !isValid };
    }
    const localKey = entry.localIconKey || '';
    if (!localKey) return { assetUrl: '', isMissing: true };
    const assetUrl = await CustomTableNameIconImageDB.get(localKey);
    return { assetUrl: assetUrl || '', isMissing: !assetUrl };
  };

  const normalizeCustomTableNameIconPackEntryMetadata = (value: unknown): CustomTableNameIconPackEntryMetadata => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {
        imageMimeType: null,
        imageSize: null,
      };
    }
    const raw = value as Record<string, unknown>;
    const imageMimeType = typeof raw.imageMimeType === 'string' ? raw.imageMimeType.trim() : '';
    const imageSize = typeof raw.imageSize === 'number' && Number.isFinite(raw.imageSize) ? raw.imageSize : null;
    const originalLocalKey = typeof raw.originalLocalKey === 'string' ? raw.originalLocalKey.trim() : '';
    return {
      imageMimeType: imageMimeType || null,
      imageSize,
      missingLocalBinary: raw.missingLocalBinary === true,
      originalLocalKey: originalLocalKey || null,
    };
  };

  const normalizeCustomTableNameIconPackEntry = (value: unknown): CustomTableNameIconPackEntry | null => {
    const context = normalizeCustomTableNameIconContext(value);
    if (!context) return null;
    const raw = value as Record<string, unknown>;
    const sourceType = raw.sourceType === 'local' ? 'local' : raw.sourceType === 'url' ? 'url' : null;
    if (!sourceType) return null;
    const url = typeof raw.url === 'string' ? raw.url.trim() : '';
    const localKey = typeof raw.localKey === 'string' ? raw.localKey.trim() : '';
    if (sourceType === 'url' && !url) return null;
    if (sourceType === 'local' && !localKey) return null;
    return {
      ...context,
      sourceType,
      ...(sourceType === 'url' ? { url } : { localKey }),
      metadata: normalizeCustomTableNameIconPackEntryMetadata(raw.metadata),
    };
  };

  const buildCustomTableNameIconPackEntry = (entry: CustomTableNameIconEntry): CustomTableNameIconPackEntry | null => {
    if (!isCustomTableNameIconContextAllowed(entry)) return null;
    if (entry.sourceType === 'url') {
      if (!isCustomTableNameIconImageUrlValid(entry.imageUrl)) return null;
      return {
        moduleId: entry.moduleId,
        tableName: entry.tableName,
        section: entry.section,
        name: entry.name,
        sourceType: 'url',
        url: entry.imageUrl,
        metadata: {
          imageMimeType: entry.imageMimeType,
          imageSize: entry.imageSize,
        },
      };
    }

    const exportedLocalKey = String(entry.localIconKey || getCustomTableNameIconManagerLocalKey(entry)).trim();
    if (!exportedLocalKey) return null;
    return {
      moduleId: entry.moduleId,
      tableName: entry.tableName,
      section: entry.section,
      name: entry.name,
      sourceType: 'local',
      localKey: exportedLocalKey,
      metadata: {
        imageMimeType: entry.imageMimeType,
        imageSize: entry.imageSize,
        missingLocalBinary: true,
        originalLocalKey: exportedLocalKey,
      },
    };
  };

  const buildCustomTableNameIconPack = (): CustomTableNameIconPack => ({
    schemaVersion: CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    entries: CustomTableNameIconStoreManager.getAll()
      .map(buildCustomTableNameIconPackEntry)
      .filter((entry): entry is CustomTableNameIconPackEntry => Boolean(entry)),
  });

  const getCustomTableNameIconPackDownloadFileName = (): string =>
    `custom-table-name-icon-pack-${new Date().toISOString().slice(0, 10)}.json`;

  const downloadCustomTableNameIconPack = (pack: CustomTableNameIconPack): void => {
    const json = JSON.stringify(pack, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = getCustomTableNameIconPackDownloadFileName();
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const analyzeCustomTableNameIconPackImport = createAnalyzeCustomTableNameIconPackImport({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconPackEntry: (...a: any[]) => normalizeCustomTableNameIconPackEntry(...a),
    CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION: CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const getCustomTableNameIconPackImportSummaryText = (analysis: CustomTableNameIconPackImportAnalysis): string => {
    const lines = [
      `将导入 ${analysis.importedCount} 条图标映射。`,
      `覆盖现有映射：${analysis.overwrittenCount}`,
      `导入后需重传的本地图标：${analysis.localMissingCount}`,
      `跳过无效 URL：${analysis.skippedInvalidUrlCount}`,
      `跳过非白名单上下文：${analysis.skippedNonWhitelistCount}`,
    ];
    if (analysis.skippedInvalidEntryCount > 0) {
      lines.push(`跳过格式无效条目：${analysis.skippedInvalidEntryCount}`);
    }
    return lines.join('\n');
  };

  type DiceSystemConfirmTone = 'warning' | 'danger';

  const showDiceSystemConfirmDialog = createShowDiceSystemConfirmDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const showDiceSystemInputDialog = createShowDiceSystemInputDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const showCustomTableNameIconManager = createShowCustomTableNameIconManager({
    analyzeCustomTableNameIconPackImport: (...a: any[]) => analyzeCustomTableNameIconPackImport(...a),
    bindEvents: (...a: any[]) => bindEvents(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCustomTableNameIconPack: (...a: any[]) => buildCustomTableNameIconPack(...a),
    downloadCustomTableNameIconPack: (...a: any[]) => downloadCustomTableNameIconPack(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
    getCustomTableNameIconLocalFileValidationError: (...a: any[]) => getCustomTableNameIconLocalFileValidationError(...a),
    getCustomTableNameIconManagerCandidates: (...a: any[]) => getCustomTableNameIconManagerCandidates(...a),
    getCustomTableNameIconManagerContextLabel: (...a: any[]) => getCustomTableNameIconManagerContextLabel(...a),
    getCustomTableNameIconManagerEntryAsset: (...a: any[]) => getCustomTableNameIconManagerEntryAsset(...a),
    getCustomTableNameIconManagerInvalidSourceText: (...a: any[]) => getCustomTableNameIconManagerInvalidSourceText(...a),
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconPackImportSummaryText: (...a: any[]) => getCustomTableNameIconPackImportSummaryText(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    getCachedRawData: () => cachedRawData,
  });

  const handleCustomTableNameIconImageDBPagehide = (): void => {
    CustomTableNameIconImageDB.cleanup();
  };

  window.addEventListener('pagehide', handleCustomTableNameIconImageDBPagehide, { once: true });

  const isOptionTableName = tableName => String(tableName || '').includes('选项');
  const isCheckSuggestionTableName = tableName => String(tableName || '').includes('检定建议');

  const getOptionItemsFromTable = tableData => {
    const items: { text: string; rowIndex: number; colIndex: number; header: string }[] = [];
    const rows = Array.isArray(tableData?.rows) ? tableData.rows : [];
    const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];

    rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return;
      row.forEach((cell, colIndex) => {
        if (colIndex <= 0) return;
        const text = String(cell ?? '').trim();
        if (!text) return;
        items.push({
          text,
          rowIndex,
          colIndex,
          header: String(headers[colIndex] ?? ''),
        });
      });
    });

    return items;
  };

  const renderOptionButtonHtml = (text: string): string =>
    `<button class="acu-opt-btn" data-val="${safeEncodeURIComponent(text)}">${escapeHtml(text)}</button>`;

  const renderCheckSuggestionOptionButtonHtml = (displayText: string, commandText: string): string =>
    `<button class="acu-check-suggestion-btn" data-display="${safeEncodeURIComponent(displayText)}" data-command="${safeEncodeURIComponent(commandText)}">${escapeHtml(displayText || '未填写展示文本')}</button>`;

  const getCheckSuggestionItemsFromTable = tableData => {
    const items: { displayText: string; commandText: string; rowIndex: number; rowId: string }[] = [];
    const rows = Array.isArray(tableData?.rows) ? tableData.rows : [];
    const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];
    const displayCol = headers.findIndex(header => String(header || '').includes('展示'));
    const commandCol = headers.findIndex(header => String(header || '').includes('骰子命令'));
    const safeDisplayCol = displayCol >= 0 ? displayCol : 1;
    const safeCommandCol = commandCol >= 0 ? commandCol : 2;

    rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return;
      const displayText = String(row[safeDisplayCol] ?? '').trim();
      const commandText = String(row[safeCommandCol] ?? '').trim();
      if (!displayText && !commandText) return;
      items.push({
        displayText,
        commandText,
        rowIndex,
        rowId: String(row[0] ?? rowIndex + 1),
      });
    });

    return items;
  };

  const getBadgeStyle = text => {
    if (!text) return '';
    const str = String(text).trim();
    if (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str)) return 'acu-badge-green';
    if (str.length <= 6 && !str.includes('http')) return 'acu-badge-neutral';
    if (['是', '否', '有', '无', '死亡', '存活'].includes(str)) return 'acu-badge-neutral';
    return '';
  };

  interface RenderDataCardCellOptions {
    rawHeaderName: string;
    cell: unknown;
    isFieldLocked?: boolean;
    diceIconFontSize?: string;
    numericDiceMarginLeft?: boolean;
  }

  interface RenderDataCardCellResult {
    headerName: string;
    contentHtml: string;
    hideLabel: boolean;
    shouldRender: boolean;
  }

  type RenderRelationshipItem = {
    name: string;
    relation: string;
  };

  const getRenderPresetBadgeStyle = (text: string, preset: RenderPreset): string => {
    const rules = preset.rules.badges;
    if (!rules.enabled) return '';
    const str = String(text || '').trim();
    if (!str) return '';
    if (rules.numericPattern && (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str))) return 'acu-badge-green';
    if (str.length <= rules.shortTextMaxLength && !str.includes('http')) return 'acu-badge-neutral';
    if (rules.statusValues.includes(str)) return 'acu-badge-neutral';
    return '';
  };

  const parseRenderPresetAttributes = (rawStr: string, preset: RenderPreset): CharacterAttributeEntry[] => {
    const rules = preset.rules.attributes;
    if (!rules.enabled) return [];
    const trimmed = String(rawStr || '').trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return rules.parseJsonObject ? parseAttributeString(trimmed) : [];
    }
    return rules.parseKeyValuePairs ? parseAttributeString(trimmed) : [];
  };

  const renderInlineQuickCheckButton = (
    attrName: string,
    attrValue: number,
    options: { fontSize?: string; marginLeft?: boolean } = {},
  ): string => {
    if (!RenderPresetManager.shouldShowQuickCheck(attrName)) return '';
    const styleParts = [
      'cursor:pointer',
      'color:var(--acu-accent)',
      'opacity:0.5',
      `font-size:${options.fontSize || '11px'}`,
    ];
    if (options.marginLeft) styleParts.push('margin-left:6px');
    return (
      '<i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="' +
      escapeHtml(attrName) +
      '" data-attr-value="' +
      attrValue +
      '" style="' +
      styleParts.join(';') +
      ';" title="检定"></i>'
    );
  };

  const renderDataCardCellContent = createRenderDataCardCellContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    getRenderPresetBadgeStyle: (...a: any[]) => getRenderPresetBadgeStyle(...a),
    isNumericCell: (...a: any[]) => isNumericCell(...a),
    parseRelationshipString: (...a: any[]) => parseRelationshipString(...a),
    parseRenderPresetAttributes: (...a: any[]) => parseRenderPresetAttributes(...a),
    renderInlineQuickCheckButton: (...a: any[]) => renderInlineQuickCheckButton(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    RenderPresetManager: RenderPresetManager,
  });

  // [优化] 统一存储封装 (带静默自动清理)

  const getActiveTabState = () => Store.get(STORAGE_KEY_ACTIVE_TAB);
  const saveActiveTabState = v => Store.set(STORAGE_KEY_ACTIVE_TAB, v);

  let cleanupGlobalInteractionOutsideCapture: (() => void) | null = null;

  const clearGlobalInteractionOutsideCapture = (): void => {
    cleanupGlobalInteractionOutsideCapture?.();
    cleanupGlobalInteractionOutsideCapture = null;
  };

  const cleanupGlobalInteractionFloatingMenus = (): void => {
    const { $ } = getCore();
    clearGlobalInteractionOutsideCapture();
    $('.acu-global-interaction-row.is-expanded')
      .removeClass('is-expanded')
      .find('.acu-global-interaction-row-main')
      .attr('aria-expanded', 'false');
    $('.acu-global-interaction-floating-host').remove();
    $('#acu-data-area').off('.globalInteractionEvents');
    $('body').off('.globalInteractionEvents');
    $(document).off('.globalInteractionEvents');
    $(window).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
  };

  // [修复] 统一清理所有面板状态，避免状态残留导致内容错乱
  const clearAllPanelStates = () => {
    cleanupGlobalInteractionFloatingMenus();
    Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
    Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    Store.set('acu_changes_panel_active', false);
    Store.set('acu_favorites_panel_active', false);
    saveActiveTabState(null);
  };

  // [修复] MVU 面板异步回调防竞态：只有当前仍处于 MVU 标签且无更高优先级面板激活时才允许写入
  function canWriteMvuPanel() {
    if (getActiveTabState() !== MvuModule.MODULE_ID) return false;
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) return false;
    if (Store.get('acu_changes_panel_active', false)) return false;
    if (Store.get('acu_favorites_panel_active', false)) return false;
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return false;
    return true;
  }

  const getSavedTableOrder = () => Store.get(STORAGE_KEY_TABLE_ORDER);
  const saveTableOrder = v => Store.set(STORAGE_KEY_TABLE_ORDER, v);
  const getCollapsedState = () => Store.get(STORAGE_KEY_IS_COLLAPSED, false);
  const saveCollapsedState = v => Store.set(STORAGE_KEY_IS_COLLAPSED, v);
  // [新增] 选项面板独立折叠状态管理
  const getOptionsCollapsedState = () => Store.get(STORAGE_KEY_OPTIONS_COLLAPSED, false);
  const saveOptionsCollapsedState = v => Store.set(STORAGE_KEY_OPTIONS_COLLAPSED, v);
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = () => {
    const data = Store.get(STORAGE_KEY_LAST_SNAPSHOT);
    if (!data) return null;
    // 获取当前环境指纹
    const currentCtx = getCurrentContextFingerprint();
    // 如果快照里的指纹存在，但和当前不一致，说明是上个角色的数据，必须作废
    if (data._contextId && data._contextId !== currentCtx) {
      return null;
    }
    return data;
  };

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = v => {
    if (!v) return;
    // 确保数据对象里带有当前 ChatID
    if (typeof v === 'object') {
      v._contextId = getCurrentContextFingerprint();
    }
    Store.set(STORAGE_KEY_LAST_SNAPSHOT, v);
  };

  const saveCurrentDatabaseSnapshotAsReviewBaseline = (trigger: string): boolean => {
    const current = getTableData({ silent: true });
    if (!current || !hasSheetKeys(current)) return false;
    saveSnapshot(current);
    console.info(`[DICE]已从数据库 API 更新审核基线 (${trigger})`);
    return true;
  };

  // --- [新增] 移植的辅助函数 ---
  const getTableHeights = () => Store.get(STORAGE_KEY_TABLE_HEIGHTS, {});
  const saveTableHeights = v => Store.set(STORAGE_KEY_TABLE_HEIGHTS, v);
  const normalizePanelHeightValue = (value: unknown): number | null => {
    const height = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(height) || height <= 0) return null;
    return Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, height));
  };

  const getPanelDisplayMaxHeight = ($panel?: JQuery<HTMLElement>): number => {
    const panelEl = $panel?.[0];
    const panelDocument = panelEl?.ownerDocument || getTavernHostDocument();
    const panelWindow = panelDocument.defaultView || getTavernHostWindow();
    const viewport = panelWindow.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportHeight = viewport?.height || panelWindow.innerHeight || panelDocument.documentElement.clientHeight || 600;
    const viewportMaxHeight = Math.max(120, Math.floor(viewportHeight - PANEL_VIEWPORT_TOP_GUTTER));
    if (!panelEl) return Math.min(MAX_PANEL_HEIGHT, viewportMaxHeight);

    const rect = panelEl.getBoundingClientRect();
    const availableAbovePanel = Math.floor(rect.bottom - viewportTop - PANEL_VIEWPORT_TOP_GUTTER);
    const availableHeight =
      availableAbovePanel > 0 ? Math.min(viewportMaxHeight, availableAbovePanel) : viewportMaxHeight;
    return Math.max(120, Math.min(MAX_PANEL_HEIGHT, availableHeight));
  };

  const applyPanelDisplayMaxHeight = ($panel: JQuery<HTMLElement>): void => {
    if (!$panel?.length) return;
    $panel[0].style.setProperty('max-height', `${getPanelDisplayMaxHeight($panel)}px`, 'important');
  };

  const clampPanelHeightToDisplay = (
    $panel: JQuery<HTMLElement>,
    height: unknown,
    displayMaxHeight?: number,
  ): number | null => {
    const rawHeight = Number.parseInt(String(height ?? ''), 10);
    if (!Number.isFinite(rawHeight)) return null;
    const normalizedHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, rawHeight));
    const effectiveMaxHeight =
      typeof displayMaxHeight === 'number' && Number.isFinite(displayMaxHeight)
        ? displayMaxHeight
        : getPanelDisplayMaxHeight($panel);
    return Math.max(MIN_PANEL_HEIGHT, Math.min(effectiveMaxHeight, normalizedHeight));
  };

  const getStoredPanelHeight = (panelKey: unknown): number | null => {
    const key = String(panelKey ?? '').trim();
    if (!key) return null;
    return normalizePanelHeightValue(getTableHeights()[key]);
  };

  const clearPanelRequestedHeight = ($panel: JQuery<HTMLElement>): void => {
    if (!$panel?.length) return;
    applyPanelDisplayMaxHeight($panel);
    $panel.css('height', '').removeClass('acu-manual-mode').removeAttr('data-acu-requested-height');
  };

  const setPanelRequestedHeight = ($panel: JQuery<HTMLElement>, height: unknown): number | null => {
    if (!$panel?.length) return null;
    const displayMaxHeight = getPanelDisplayMaxHeight($panel);
    const normalizedHeight = clampPanelHeightToDisplay($panel, height, displayMaxHeight);
    $panel[0].style.setProperty('max-height', `${displayMaxHeight}px`, 'important');
    if (!normalizedHeight) {
      clearPanelRequestedHeight($panel);
      return null;
    }
    $panel
      .css('height', `${normalizedHeight}px`)
      .addClass('acu-manual-mode')
      .attr('data-acu-requested-height', String(normalizedHeight));
    return normalizedHeight;
  };

  const applyStoredPanelHeight = ($panel: JQuery<HTMLElement>, panelKey: unknown): number | null => {
    const savedHeight = getStoredPanelHeight(panelKey);
    if (!savedHeight) {
      clearPanelRequestedHeight($panel);
      return null;
    }
    return setPanelRequestedHeight($panel, savedHeight);
  };

  const getPanelDragStartHeight = ($panel: JQuery<HTMLElement>): number => {
    return (
      clampPanelHeightToDisplay($panel, $panel.attr('data-acu-requested-height')) ||
      clampPanelHeightToDisplay($panel, $panel.css('height')) ||
      clampPanelHeightToDisplay($panel, $panel.height()) ||
      MIN_PANEL_HEIGHT
    );
  };

  const savePanelRequestedHeight = (panelKey: unknown, height: unknown): number | null => {
    const key = String(panelKey ?? '').trim();
    const normalizedHeight = normalizePanelHeightValue(height);
    if (!key || !normalizedHeight) return null;
    const heights = getTableHeights();
    heights[key] = normalizedHeight;
    saveTableHeights(heights);
    return normalizedHeight;
  };

  const resetPanelRequestedHeight = ($panel: JQuery<HTMLElement>, panelKey: unknown): void => {
    const key = String(panelKey ?? '').trim();
    if (key) {
      const heights = getTableHeights();
      delete heights[key];
      saveTableHeights(heights);
    }
    clearPanelRequestedHeight($panel);
  };

  const getActivePanelHeightKey = (): string | null => {
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return '仪表盘';
    if (Store.get('acu_changes_panel_active', false)) return '审核面板';
    if (Store.get('acu_favorites_panel_active', false)) return '收藏夹';
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) return '交互总览';
    const activeTab = String(getActiveTabState() || '').trim();
    return activeTab || null;
  };

  const getTableStyles = () => Store.get(STORAGE_KEY_TABLE_STYLES, {});
  const saveTableStyles = v => Store.set(STORAGE_KEY_TABLE_STYLES, v);
  const getHiddenTables = () => Store.get(STORAGE_KEY_HIDDEN_TABLES, []);
  const saveHiddenTables = v => Store.set(STORAGE_KEY_HIDDEN_TABLES, v);
  const getReverseTables = () => Store.get(STORAGE_KEY_REVERSE_TABLES, []);
  const saveReverseTables = v => Store.set(STORAGE_KEY_REVERSE_TABLES, v);

  const normalizeTableNameList = tableNames => {
    if (!Array.isArray(tableNames)) return [];
    return Array.from(new Set(tableNames.filter(name => typeof name === 'string' && name.trim())));
  };

  const getNormalizedReverseTables = () => normalizeTableNameList(getReverseTables());

  // 判断表格是否需要显示倒序按钮
  const shouldShowReverseButton = tableName => {
    return typeof tableName === 'string' && tableName.trim().length > 0;
  };

  // 判断表格当前是否为倒序
  const isTableReversed = tableName => {
    return getNormalizedReverseTables().includes(tableName);
  };

  const areAllTablesReversed = tableNames => {
    const names = normalizeTableNameList(tableNames);
    if (names.length === 0) return false;
    const reverseSet = new Set(getNormalizedReverseTables());
    return names.every(name => reverseSet.has(name));
  };

  const setAllTablesReverse = (tableNames, enabled) => {
    const targetNames = normalizeTableNameList(tableNames);
    if (targetNames.length === 0) return;

    const targetSet = new Set(targetNames);
    if (enabled) {
      saveReverseTables(Array.from(new Set([...getNormalizedReverseTables(), ...targetNames])));
    } else {
      saveReverseTables(getNormalizedReverseTables().filter(name => !targetSet.has(name)));
    }
  };

  // 切换表格倒序状态
  const toggleTableReverse = tableName => {
    const list = getNormalizedReverseTables();
    const idx = list.indexOf(tableName);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(tableName);
    }
    saveReverseTables(list);
    console.log('[DICE]ACU toggleTableReverse:', tableName, 'reversed:', idx < 0);
  };
  // [新增] 根据角色名获取属性列表
  const getAttributesForCharacter = characterName => {
    return getFullAttributesForCharacter(characterName).map(attr => attr.name);
  };
  const normalizeAttributeName = (name: string): string => {
    if (!name) return '';
    return String(name)
      .trim()
      .toLowerCase()
      .replace(/[\s_:\-：]/g, '')
      .replace(/值$/u, '');
  };

  const resolveAttributeAliasName = (
    characterName: string,
    targetName: string,
    aliasCandidates: string[] = [],
  ): { name: string | null; reason?: string } => {
    const allAttrs = getFullAttributesForCharacter(characterName)
      .map(attr => attr.name)
      .filter(Boolean);
    if (allAttrs.length === 0) {
      return { name: targetName || null };
    }

    const orderedCandidates = [targetName, ...aliasCandidates]
      .map(n => String(n || '').trim())
      .filter(Boolean)
      .filter((n, idx, arr) => arr.indexOf(n) === idx);
    if (orderedCandidates.length === 0) {
      return { name: null, reason: '目标属性名为空' };
    }

    for (const candidate of orderedCandidates) {
      if (allAttrs.includes(candidate)) {
        return { name: candidate };
      }
    }

    const lowerMap = new Map<string, string>();
    allAttrs.forEach(name => {
      const lower = name.toLowerCase();
      if (!lowerMap.has(lower)) lowerMap.set(lower, name);
    });
    for (const candidate of orderedCandidates) {
      const matched = lowerMap.get(candidate.toLowerCase());
      if (matched) {
        return { name: matched };
      }
    }

    const normalizedGroups = new Map<string, string[]>();
    allAttrs.forEach(name => {
      const key = normalizeAttributeName(name);
      if (!key) return;
      const list = normalizedGroups.get(key) || [];
      list.push(name);
      normalizedGroups.set(key, list);
    });

    for (const candidate of orderedCandidates) {
      const normalized = normalizeAttributeName(candidate);
      if (!normalized) continue;
      const matched = normalizedGroups.get(normalized) || [];
      if (matched.length === 1) {
        return { name: matched[0] };
      }
      if (matched.length > 1) {
        return {
          name: null,
          reason: `属性别名冲突: ${candidate} 可匹配 ${matched.join(', ')}`,
        };
      }
    }

    return {
      name: null,
      reason: `找不到属性: ${targetName}`,
    };
  };

  const isSameAttributeAlias = (left: string, right: string): boolean => {
    const a = normalizeAttributeName(left);
    const b = normalizeAttributeName(right);
    return Boolean(a) && Boolean(b) && a === b;
  };

  const getAttributeEntryForCharacter = (
    characterName: string,
    attrName: string,
    aliasCandidates: string[] = [],
  ): CharacterAttributeEntry | null => {
    if (!attrName) return null;
    const resolved = resolveAttributeAliasName(characterName, attrName, aliasCandidates);
    if (!resolved.name) return null;
    return getFullAttributesForCharacter(characterName).find(attr => attr.name === resolved.name) || null;
  };

  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = (characterName, attrName, aliasCandidates: string[] = []) => {
    const found = getAttributeEntryForCharacter(characterName, attrName, aliasCandidates);
    return found ? found.value : null;
  };

  const pushDiceQuickSelectCharacter = (list: string[], name: unknown, preferFront = false): void => {
    const displayName = getDisplayName(String(name ?? '').trim());
    if (!displayName || list.some(existing => characterNamesMatch(existing, displayName))) return;
    if (preferFront) {
      list.unshift(displayName);
    } else {
      list.push(displayName);
    }
  };

  const getDiceQuickSelectCharacterList = (rawData: DiceRawData | null | undefined): string[] => {
    const list: string[] = [];
    if (!rawData) return list;

    const allTables = processJsonData(rawData || {}) as Record<string, RelationGraphTableInput>;
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    if (playerResult?.data?.rows?.length > 0) {
      const playerConfig = playerResult.config || getDashboardModuleConfig('player') || DASHBOARD_TABLE_CONFIG.player;
      const playerHeaders = playerResult.data.headers || [];
      const playerNameIdx = DashboardDataParser.findColumnIndex(playerHeaders, 'name', playerConfig);
      const safePlayerNameIdx = playerNameIdx >= 0 ? playerNameIdx : findNameColumnIndex(playerHeaders);
      pushDiceQuickSelectCharacter(list, playerResult.data.rows[0]?.[safePlayerNameIdx], true);
    }

    const npcListData = getDashboardNpcListData(allTables);
    const dashboardEntries = (npcListData.entries || []) as Array<{ name?: unknown }>;
    dashboardEntries.forEach(entry => pushDiceQuickSelectCharacter(list, entry.name));

    if (list.length > 0) return list;

    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet?.name || !Array.isArray(sheet.content)) continue;
      const headers = sheet.content[0] || [];

      if (isNpcTableName(sheet.name)) {
        const nameIdx = findNameColumnIndex(headers);
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row) pushDiceQuickSelectCharacter(list, row[nameIdx]);
        }
      }

      if (sheet.name.includes('主角') && sheet.content[1]) {
        const nameIdx = findNameColumnIndex(headers);
        pushDiceQuickSelectCharacter(list, sheet.content[1][nameIdx], true);
      }
    }

    return list;
  };

  const getAdvancedPresetMappedTarget = (
    preset: QuickSelectCheckPresetConfig | null | undefined,
    attrName: string,
  ): AttributeQuickSelectTarget | null => {
    const mapping = preset?.attrTargetMapping || {};
    for (const [target, names] of Object.entries(mapping)) {
      if (!isAttributeQuickSelectTarget(target)) continue;
      if (Array.isArray(names) && names.includes(attrName)) return target;
    }
    return null;
  };

  const getAttributePresetMappedTarget = (
    preset: AttributePresetConfig | null | undefined,
    attrName: string,
    source: CharacterAttributeSource | null | undefined,
  ): AttributeQuickSelectTarget | null => {
    if (!preset?.quickSelect) return null;
    const config = normalizeAttributeQuickSelectConfig(preset.quickSelect);
    for (const [target, names] of Object.entries(config.nameTargetMapping)) {
      if (!isAttributeQuickSelectTarget(target)) continue;
      if (Array.isArray(names) && names.includes(attrName)) return target;
    }
    if (source === 'base') return config.baseTarget;
    if (source === 'special') return config.specialTarget;
    return config.fallbackTarget;
  };

  const isQuickSelectTargetAvailable = (
    target: AttributeQuickSelectTarget,
    preset: QuickSelectCheckPresetConfig | null | undefined,
    mode: 'normal' | 'contest',
  ): boolean => {
    if (target === 'attribute') return true;
    if (target === 'skillMod') {
      if (!preset?.skillMod || preset.skillMod.hidden) return false;
      return mode !== 'contest' || preset.contestRule?.hideSkillMod !== true;
    }
    if (target === 'mod') {
      if (!preset?.mod || preset.mod.hidden) return false;
      return mode !== 'contest' || preset.contestRule?.hideMod !== true;
    }
    return false;
  };

  const resolveQuickSelectTarget = (
    attrName: string,
    source: CharacterAttributeSource | null | undefined,
    preset: QuickSelectCheckPresetConfig | null | undefined,
    mode: 'normal' | 'contest',
  ): AttributeQuickSelectTarget => {
    const activeAttributePreset = AttributePresetManager.getActivePreset() as AttributePresetConfig | null;
    const mappedByAttributePreset = getAttributePresetMappedTarget(activeAttributePreset, attrName, source);
    const mappedByCheckPreset = mappedByAttributePreset || getAdvancedPresetMappedTarget(preset, attrName);
    const target = mappedByCheckPreset || 'attribute';
    return isQuickSelectTargetAvailable(target, preset, mode) ? target : 'attribute';
  };

  const formatSignedModifier = (value: number): string => (value >= 0 ? `+${value}` : String(value));

  const getNamedCheckParamText = (value: string | number | boolean | undefined): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return null;
    if (/^(true|false|是|否|启用|禁用|开启|关闭)$/i.test(trimmed)) return null;
    return trimmed;
  };

  const buildCheckValueText = (options: {
    preset: AdvancedDicePreset;
    characterName: string;
    actionName: string;
    attrValue: number;
    attrMod: number;
    skillMod: number;
    mode: 'normal' | 'contest';
    attrNameOverride?: string | null;
    skillNameOverride?: string | null;
  }): string => {
    const entry = getAttributeEntryForCharacter(options.characterName, options.actionName);
    const resolvedActionName = entry?.name || options.actionName;
    const mappedTarget = resolveQuickSelectTarget(resolvedActionName, entry?.source, options.preset, options.mode);
    const attrModText = options.attrMod !== 0 ? `（调整值${formatSignedModifier(options.attrMod)}）` : '';
    const attributeName =
      options.attrNameOverride ||
      (mappedTarget === 'skillMod'
        ? options.attrMod !== 0
          ? options.preset.attribute?.label || '属性值'
          : null
        : resolvedActionName);
    const skillName = options.skillNameOverride || (mappedTarget === 'skillMod' ? resolvedActionName : null);

    const parts: string[] = [];
    if (attributeName) parts.push(`${attributeName}${options.attrValue}${attrModText}`);
    if (skillName) parts.push(`${skillName}（技能加值${formatSignedModifier(options.skillMod)}）`);
    else if (options.skillMod !== 0) parts.push(`技能加值${formatSignedModifier(options.skillMod)}`);

    if (parts.length > 0) return parts.join('+');
    return `${options.preset.attribute?.label || '属性值'}${options.attrValue}${attrModText}`;
  };

  const getNormalQuickSelectInputSelector = (target: AttributeQuickSelectTarget): string => {
    if (target === 'skillMod') return '#dice-skill-mod';
    if (target === 'mod') return '#dice-modifier';
    return '#dice-attr-value';
  };
  // [新增] 标准6维属性名
  const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];

  /**
   * 获取当前规则的标准属性名列表
   */
  const getStandardAttrs = () => {
    const preset = AttributePresetManager.getActivePreset();
    if (preset && preset.baseAttributes) {
      return preset.baseAttributes.map(attr => attr.name);
    }
    return STANDARD_ATTRS;
  };

  /**
   * 获取当前规则的随机属性池（包含基本属性和特殊属性）
   * 默认状态：返回所有规则预设的属性合并（超级大杂烩）
   * 选中特定规则时：返回该规则的基本属性 + 特殊属性
   */
  const getRandomSkillPool = createGetRandomSkillPool({
    AttributePresetManager: AttributePresetManager,
    getRANDOM_SKILL_POOL: () => RANDOM_SKILL_POOL,
  });

  // [新增] 随机技能池（用于属性名随机生成，可自由增减）


  // [新增] 生成 COC/DND 风格的6维属性（支持预设）
  /**
   * 生成角色属性
   * @param isDNDOrPreset 布尔值(旧版兼容) 或 预设对象 或 null(自动获取激活预设)
   * @returns { base: {...}, special: {...} } 或旧格式 {...}（向后兼容）
   */
  const generateRPGAttributes = createGenerateRPGAttributes({
    generateAttributeValue: (...a: any[]) => generateAttributeValue(...a),
    AttributePresetManager: AttributePresetManager,
    STANDARD_ATTRS: STANDARD_ATTRS,
  });

  // [简化] 清空角色的属性（直接清空基础属性列和特有属性列）
  const clearPresetAttributesForCharacter = createClearPresetAttributesForCharacter({
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    getCachedRawData: () => cachedRawData,
  });

  // [新增] 将属性写入角色表格
  // [修复] 支持分别写入基础属性列和特有属性列
  const writeAttributesToCharacter = createWriteAttributesToCharacter({
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getStandardAttrs: (...a: any[]) => getStandardAttrs(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    AttributePresetManager: AttributePresetManager,
    getCachedRawData: () => cachedRawData,
  });

  // [新增] 更新属性字符串中的单个属性值（用于燃运等功能）
  const updateSingleAttribute = async (
    charName: string,
    attrName: string,
    operation: 'add' | 'subtract' | 'set',
    value: number,
    options?: {
      initValue?: number;
      min?: number;
      max?: number;
      aliasCandidates?: string[];
      skipSave?: boolean;
      dataOverride?: Record<string, { name: string; content: (string | number | null)[][] }>;
    },
  ): Promise<{
    success: boolean;
    oldValue: number;
    newValue: number;
    error?: string;
    resolvedAttrName?: string;
    modifiedSheetKey?: string;
  }> => {
    const rawData = options?.dataOverride || cachedRawData || getTableData();
    if (!rawData) {
      const error = '无法获取表格数据';
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    const lookup = findCharacterAttributeRow(charName, rawData as DiceRawData);
    const targetSheet = lookup?.sheet || null;
    const targetRowIndex = lookup?.rowIndex ?? -1;
    const sheetKey = lookup?.sheetKey || null;
    const attrColIndices = lookup ? findAttributeColumnIndices(lookup.headers) : [];
    const fallbackAttrColIndex = lookup ? pickFallbackAttributeColumn(attrColIndices, lookup.headers) : -1;
    let targetColIndex = fallbackAttrColIndex;

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      const error = `找不到角色: ${charName || '<user>'}`;
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    if (targetColIndex < 0) {
      const error = withTableTemplateCheckHint('找不到属性列（需要包含"属性"关键词的列）');
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    const resolved = resolveAttributeAliasName(charName, attrName, options?.aliasCandidates || []);
    if (!resolved.name) {
      const error = resolved.reason || `属性 ${attrName} 不存在`;
      console.warn(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }
    const targetAttrName = resolved.name;

    // 在所有属性列中，优先选择实际包含目标属性的列
    for (const colIdx of attrColIndices) {
      const cellStr = String(targetSheet.content[targetRowIndex][colIdx] || '');
      const parsed = parseAttributeString(cellStr);
      if (parsed.some(attr => attr.name === targetAttrName)) {
        targetColIndex = colIdx;
        break;
      }
    }
    if (targetColIndex < 0) {
      targetColIndex = fallbackAttrColIndex;
    }

    // 读取目标列现有属性并解析
    const existingStr = String(targetSheet.content[targetRowIndex][targetColIndex] || '');
    const existingAttrs = parseAttributeString(existingStr);
    const existingMap: Record<string, number> = {};
    existingAttrs.forEach(attr => {
      existingMap[attr.name] = attr.value;
    });

    // 获取旧值或使用初始值
    let oldValue: number;
    if (existingMap[targetAttrName] !== undefined) {
      oldValue = existingMap[targetAttrName];
    } else if (options?.initValue !== undefined) {
      oldValue = options.initValue;
      console.info(`[DICE] updateSingleAttribute: 属性 ${targetAttrName} 不存在，初始化为 ${oldValue}`);
    } else {
      const error = `属性 ${targetAttrName} 不存在且未提供初始值`;
      console.warn(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    // 执行操作
    let newValue: number;
    switch (operation) {
      case 'add':
        newValue = oldValue + value;
        break;
      case 'subtract':
        newValue = oldValue - value;
        break;
      case 'set':
        newValue = value;
        break;
      default:
        const error = `不支持的操作类型: ${operation}`;
        console.error(`[DICE] updateSingleAttribute: ${error}`);
        return { success: false, oldValue, newValue: oldValue, error };
    }

    // 应用 min/max 约束
    const min = options?.min ?? 0; // 默认最小为0
    const max = options?.max ?? Infinity;
    newValue = Math.max(min, Math.min(max, newValue));

    console.info(
      `[DICE] updateSingleAttribute: ${charName}.${targetAttrName} ${oldValue} → ${newValue} (${operation} ${value})`,
    );

    // 更新属性映射
    existingMap[targetAttrName] = newValue;

    // 重建属性字符串（保持原有顺序，新属性追加到末尾）
    const resultParts: string[] = [];
    const processedNames = new Set<string>();

    // 先按原有顺序处理
    existingAttrs.forEach(attr => {
      const val = existingMap[attr.name];
      if (val !== undefined) {
        resultParts.push(`${attr.name}:${val}`);
        processedNames.add(attr.name);
      }
    });

    // 添加新属性（如果是初始化的情况）
    if (!processedNames.has(targetAttrName)) {
      resultParts.push(`${targetAttrName}:${newValue}`);
    }

    const newAttrString = resultParts.join(';');

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[targetColIndex] = newAttrString;
    if (options?.skipSave || options?.dataOverride) {
      targetSheet.content[targetRowIndex] = nextRow;
    } else {
      try {
        await saveRowInstantly(sheetKey!, targetRowIndex - 1, nextRow);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[DICE] updateSingleAttribute: 保存 ${charName}.${targetAttrName} 失败: ${message}`);
        return { success: false, oldValue, newValue: oldValue, error: message, resolvedAttrName: targetAttrName };
      }
    }

    console.info(`[DICE] updateSingleAttribute: 成功修改 ${charName}.${targetAttrName}`);
    return { success: true, oldValue, newValue, resolvedAttrName: targetAttrName, modifiedSheetKey: sheetKey! };
  };

  // [修复] 获取角色的完整属性列表（包括基础属性和特有属性等所有包含"属性"的列）
  const getFullAttributesForCharacter = (
    characterName,
    dataOverride?: Record<string, { name: string; content: (string | number | null)[][] }>,
  ): CharacterAttributeEntry[] => {
    const rawData = (dataOverride || cachedRawData || getTableData()) as DiceRawData | null;
    const lookup = findCharacterAttributeRow(characterName, rawData);
    if (!lookup) return [];

    const attrs: CharacterAttributeEntry[] = [];
    const row = lookup.sheet.content[lookup.rowIndex] || [];
    const { baseColIndex, specialColIndex } = findPrimaryAttributeColumns(lookup.headers);
    findAttributeColumnIndices(lookup.headers).forEach(idx => {
      const parsed = parseAttributeString(row[idx] || '');
      parsed.forEach(attr => {
        if (!attrs.some(existing => existing.name === attr.name)) {
          const source: CharacterAttributeSource =
            idx === baseColIndex ? 'base' : idx === specialColIndex ? 'special' : 'generic';
          attrs.push({ ...attr, source });
        }
      });
    });
    return attrs;
  };
  // [新增] 自定义下拉菜单初始化函数
  const initCustomDropdown = createInitCustomDropdown({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
  });
  // [新增] 给输入框添加清除按钮
  const addClearButton = ($panel, inputSelector) => {
    const { $ } = getCore();
    $panel.find(inputSelector).each(function () {
      const $input = $(this);
      // 避免重复添加
      if ($input.parent().hasClass('acu-input-wrapper')) return;
      // 包装输入框
      $input.wrap('<div class="acu-input-wrapper"></div>');
      // 添加清除按钮 - 样式通过 CSS 类控制
      const $clearBtn = $(
        `<button type="button" class="acu-clear-btn" title="清除"><i class="fa-solid fa-times"></i></button>`,
      );
      $input.after($clearBtn);
      // 点击清除
      $clearBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $input.val('').trigger('input').trigger('change').focus();
      });
      // hover 效果已通过 CSS :hover 处理，无需 JS
    });
  };
  // [新增] 统一的骰子规则设置面板
  /**
   * @deprecated 请使用 showAdvancedPresetManager() 替代。此函数仅保留函数体以供回退。
   */
  const showDiceSettingsPanel = createShowDiceSettingsPanel({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    hideDiceResultsInUserMessages: hideDiceResultsInUserMessages,
  });
  // [新增] 显示掷骰面板
  const showDicePanel = createShowDicePanel({
    addClearButton: (...a: any[]) => addClearButton(...a),
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    clearPresetAttributesForCharacter: (...a: any[]) => clearPresetAttributesForCharacter(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    executeEffects: (...a: any[]) => executeEffects(...a),
    executeSecondaryEffectsChain: (...a: any[]) => executeSecondaryEffectsChain(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getAttributesForCharacter: (...a: any[]) => getAttributesForCharacter(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceQuickSelectCharacterList: (...a: any[]) => getDiceQuickSelectCharacterList(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getNormalQuickSelectInputSelector: (...a: any[]) => getNormalQuickSelectInputSelector(...a),
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    getResultBadgeClass: (...a: any[]) => getResultBadgeClass(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    initCustomDropdown: (...a: any[]) => initCustomDropdown(...a),
    isComplexCondition: (...a: any[]) => isComplexCondition(...a),
    isSameAttributeAlias: (...a: any[]) => isSameAttributeAlias(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    renderDiceHistoryStatsHtml: (...a: any[]) => renderDiceHistoryStatsHtml(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAdvancedPresetManager: (...a: any[]) => showAdvancedPresetManager(...a),
    showContestPanel: (...a: any[]) => showContestPanel(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showGlobalDiceHistoryDialog: (...a: any[]) => showGlobalDiceHistoryDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    updateSingleAttribute: (...a: any[]) => updateSingleAttribute(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    writeAttributesToCharacter: (...a: any[]) => writeAttributesToCharacter(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_OUTPUT_TEMPLATE: DEFAULT_OUTPUT_TEMPLATE,
    DiceHistoryStatsDB: DiceHistoryStatsDB,
    STORAGE_KEY_LAST_PRESET: STORAGE_KEY_LAST_PRESET,
    UpdateController: UpdateController,
    getCachedRawData: () => cachedRawData,
    getMAX_HISTORY: () => MAX_HISTORY,
    getCheckHistory: () => checkHistory,
    getContestHistory: () => contestHistory,
  });

  // 判定成功等级（供对抗检定面板和 API contest() 共用）
  const getSuccessLevel = function (roll: number, target: number, sides: number) {
    if (sides === 100) {
      if (roll <= 5) return { level: 3, name: '大成功', color: 'var(--acu-crit-success-text)' };
      if (roll >= 96) return { level: -1, name: '大失败', color: 'var(--acu-crit-failure-text)' };
      if (roll <= Math.floor(target / 5))
        return { level: 2, name: '极难成功', color: 'var(--acu-extreme-success-text)' };
      if (roll <= Math.floor(target / 2)) return { level: 1, name: '困难成功', color: 'var(--acu-success-text)' };
      if (roll <= target) return { level: 0, name: '普通成功', color: 'var(--acu-warning-text)' };
      return { level: -1, name: '失败', color: 'var(--acu-failure-text)' };
    } else {
      if (roll === 20) return { level: 3, name: '大成功', color: 'var(--acu-crit-success-text)' };
      if (roll === 1) return { level: -1, name: '大失败', color: 'var(--acu-crit-failure-text)' };
      if (roll >= target) return { level: 0, name: '成功', color: 'var(--acu-success-text)' };
      return { level: -1, name: '失败', color: 'var(--acu-failure-text)' };
    }
  };

  // [新增] 显示对抗检定面板
  const showContestPanel = createShowContestPanel({
    addClearButton: (...a: any[]) => addClearButton(...a),
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    clearPresetAttributesForCharacter: (...a: any[]) => clearPresetAttributesForCharacter(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getAttributesForCharacter: (...a: any[]) => getAttributesForCharacter(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceQuickSelectCharacterList: (...a: any[]) => getDiceQuickSelectCharacterList(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    getResultBadgeClass: (...a: any[]) => getResultBadgeClass(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    initCustomDropdown: (...a: any[]) => initCustomDropdown(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    showAdvancedPresetManager: (...a: any[]) => showAdvancedPresetManager(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    showGlobalDiceHistoryDialog: (...a: any[]) => showGlobalDiceHistoryDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    writeAttributesToCharacter: (...a: any[]) => writeAttributesToCharacter(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_CONTEST_OUTPUT_TEMPLATE: DEFAULT_CONTEST_OUTPUT_TEMPLATE,
    NameAliasRegistry: NameAliasRegistry,
    STORAGE_KEY_LAST_PRESET: STORAGE_KEY_LAST_PRESET,
    UpdateController: UpdateController,
    getCachedRawData: () => cachedRawData,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });

  const parseInSceneStatus = (value, headerName) => {
    const val = String(value || '')
      .trim()
      .toLowerCase();
    const header = String(headerName || '').toLowerCase();
    if (!val) return false;

    if (header.includes('离场')) {
      return val === '否' || val === 'false' || val === 'no';
    }

    return val.startsWith('在场') || val === 'true' || val === '是' || val === 'yes';
  };

  const buildMapViewModel = createBuildMapViewModel({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseInSceneStatus: (...a: any[]) => parseInSceneStatus(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveBatchLocationEmojis: (...a: any[]) => resolveBatchLocationEmojis(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    AvatarManager: AvatarManager,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardDataParser: DashboardDataParser,
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData,
  });

  // 防止地图弹窗重复打开
  let isMapOpening = false;

  const showMapVisualization = createShowMapVisualization({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    buildMapViewModel: (...a: any[]) => buildMapViewModel(...a),
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    STORAGE_KEY_MAP_FOCUS: STORAGE_KEY_MAP_FOCUS,
    getIsMapOpening: () => isMapOpening,
    setIsMapOpening: (v: any) => { isMapOpening = v; },
  });

  type RelationGraphCell = string | number | null | undefined;
  type RelationGraphRow = RelationGraphCell[];

  interface RelationGraphTableInput {
    headers?: RelationGraphCell[];
    rows?: RelationGraphRow[];
    key?: string;
  }

  interface RelationshipGraphSourceTableMatch {
    tableName: string;
    table: RelationGraphTableInput;
  }

  interface RelationshipGraphBuildOptions {
    tableName?: string;
  }

  interface RelationshipGraphRenderOptions {
    includePlayerRelations?: boolean;
  }

  interface RelationGraphNode {
    name: string;
    isPlayer: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    tableKey: string;
    rowIndex?: number;
    isInScene?: boolean;
    fixed?: boolean;
  }

  interface RelationGraphEdge {
    source: string;
    target: string;
    labelsFromSource: string[];
    labelsFromTarget: string[];
  }

  interface ParsedRelationshipItem {
    name: string;
    relation: string;
  }

  interface RelationGraphColumnMatch {
    index: number;
    isConfigured: boolean;
  }

  const RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS = ['人际关系', 'relation_state', 'relation_text'];

  const findRelationGraphColumnIndex = (headers: RelationGraphCell[], keywords: string[]): number => {
    for (let i = 0; i < headers.length; i++) {
      const header = String(headers[i] || '').toLowerCase();
      if (keywords.some(keyword => header.includes(keyword.toLowerCase()))) {
        return i;
      }
    }
    return -1;
  };

  const findRelationGraphRelationColumnMatch = (
    headers: RelationGraphCell[],
    configuredKeywords: string[],
  ): RelationGraphColumnMatch => {
    const configuredIndex = findRelationGraphColumnIndex(headers, configuredKeywords);
    if (configuredIndex >= 0) {
      return { index: configuredIndex, isConfigured: true };
    }

    return {
      index: findRelationGraphColumnIndex(headers, RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS),
      isConfigured: false,
    };
  };

  const findRelationshipGraphSourceTables = (
    allTables: Record<string, RelationGraphTableInput>,
    tableKeywords: string[],
  ): RelationshipGraphSourceTableMatch[] => {
    const matches: RelationshipGraphSourceTableMatch[] = [];
    const matchedTableNames = new Set<string>();

    for (const keyword of tableKeywords) {
      for (const tableName in allTables) {
        if (tableName.includes(keyword) && !matchedTableNames.has(tableName)) {
          matchedTableNames.add(tableName);
          matches.push({ tableName, table: allTables[tableName] });
        }
      }
    }
    return matches;
  };

  const buildRelationshipGraphTableFromPreset = createBuildRelationshipGraphTableFromPreset({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    USER_NODE_KEY: USER_NODE_KEY,
  });

  const isDashboardRoleInSceneValue = (value, header = ''): boolean => {
    const normalized = String(value || '')
      .trim()
      .toLowerCase();
    if (!normalized) return false;

    const normalizedHeader = String(header || '').toLowerCase();
    if (normalizedHeader.includes('离场')) {
      return (
        normalized === '否' ||
        normalized === 'false' ||
        normalized === 'no' ||
        normalized === '0' ||
        normalized.includes('未离场') ||
        normalized.includes('不离场')
      );
    }

    if (normalized === 'true' || normalized === 'yes' || normalized === '是' || normalized === '1') return true;
    if (normalized.includes('不在场') || normalized.includes('离场')) return false;
    return normalized.startsWith('在场') || normalized.includes('在场');
  };

  const pushDashboardNpcEntry = (entries, entry): void => {
    const name = String(entry.name || '').trim();
    if (!name) return;
    if (entries.some(existing => characterNamesMatch(existing.name, name))) return;
    entries.push({ ...entry, name });
  };

  const findDashboardNpcNameColumnIndex = (headers, source): number => {
    if (source?.nameColumn) {
      const configuredNameIdx = findRelationGraphColumnIndex(headers, source.nameColumn);
      return configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(headers, -1);
    }

    const npcConfig = getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
    const configuredNameIdx = DashboardDataParser.findColumnIndex(headers, 'name', npcConfig);
    return configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(headers, -1);
  };

  const collectDashboardNpcEntriesFromTableResult = createCollectDashboardNpcEntriesFromTableResult({
    findDashboardNpcNameColumnIndex: (...a: any[]) => findDashboardNpcNameColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    isDashboardRoleInSceneValue: (...a: any[]) => isDashboardRoleInSceneValue(...a),
    pushDashboardNpcEntry: (...a: any[]) => pushDashboardNpcEntry(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardDataParser: DashboardDataParser,
  });

  const collectDashboardNpcEntriesFromTableResults = tableResults => {
    const entries = [];
    tableResults.forEach(tableResult => collectDashboardNpcEntriesFromTableResult(entries, tableResult));
    return entries;
  };

  const collectDashboardNpcEntriesFromRelationshipSources = (
    allTables: Record<string, RelationGraphTableInput>,
    sources: DashboardRelationshipGraphSourceConfig[],
  ) => {
    const entries = [];
    const matchedTableKeys = new Set<string>();
    const usedSources: string[] = [];

    sources.forEach((source, sourceIndex) => {
      const sourceTableResults = findRelationshipGraphSourceTables(allTables, source.tableKeywords);
      if (sourceTableResults.length === 0) {
        console.info(
          withTableTemplateCheckHint(
            `[DICE]仪表盘角色区: 来源${sourceIndex + 1}未找到表格 (关键词: ${source.tableKeywords.join(', ')})`,
          ),
        );
        return;
      }

      sourceTableResults.forEach(tableResult => {
        const tableKey = String(tableResult.table.key || tableResult.tableName || '');
        if (tableKey && matchedTableKeys.has(tableKey)) return;

        const addedCount = collectDashboardNpcEntriesFromTableResult(entries, tableResult, source);
        if (addedCount > 0) {
          if (tableKey) matchedTableKeys.add(tableKey);
          usedSources.push(tableResult.tableName);
        }
      });
    });

    if (entries.length > 0) {
      console.info(`[DICE]仪表盘角色区: 已合并来源 ${usedSources.join('、')}，共${entries.length}名角色`);
    }
    return entries;
  };

  const getDashboardNpcListData = (allTables: Record<string, RelationGraphTableInput>) => {
    const npcTableResults = DashboardDataParser.findTables(allTables, 'npc');
    const graphSources = getActiveDashboardRelationshipGraphSources();
    const graphEntries =
      graphSources.length > 0 ? collectDashboardNpcEntriesFromRelationshipSources(allTables, graphSources) : [];
    const entries =
      graphEntries.length > 0 ? graphEntries : collectDashboardNpcEntriesFromTableResults(npcTableResults);
    const primaryEntry = entries[0];
    const primaryTable = npcTableResults[0];

    return {
      entries,
      tableName: primaryEntry?.tableName || primaryTable?.name || '重要角色表',
      tableKey: primaryEntry?.tableKey || primaryTable?.key || '',
      hasTable: entries.length > 0 || npcTableResults.length > 0,
    };
  };

  interface AvatarManagerNode {
    name: string;
    isPlayer: boolean;
    rowIndex?: number;
    tableKey?: string;
  }

  type AvatarManagerViewMode = 'chat' | 'global';

  interface AvatarManagerOptions {
    initialView?: AvatarManagerViewMode;
  }

  const collectCurrentChatAvatarNodes = (allTables: Record<string, RelationGraphTableInput>): AvatarManagerNode[] => {
    const npcListData = getDashboardNpcListData(allTables);
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    const nodeArr: AvatarManagerNode[] = [];

    if (playerResult?.data?.rows?.[0]) {
      const playerNameIdx = findNameColumnIndex(playerResult.data.headers || []);
      const playerName = playerResult.data.rows[0][playerNameIdx];
      if (playerName && typeof playerName === 'string' && playerName.trim()) {
        nodeArr.push({ name: playerName.trim(), isPlayer: true });
      }
    }

    npcListData.entries.forEach(npc => {
      const npcName = String(npc.name || '').trim();
      if (npcName) {
        nodeArr.push({ name: npcName, isPlayer: false, rowIndex: npc.index, tableKey: npc.tableKey });
      }
    });

    return nodeArr;
  };

  const getCurrentChatAvatarNodes = (): AvatarManagerNode[] => {
    const rawData = cachedRawData || getTableData();
    const allTables = processJsonData(rawData);
    if (!allTables || allTables.length === 0) return [];
    return collectCurrentChatAvatarNodes(allTables as Record<string, RelationGraphTableInput>);
  };

  interface RelationGraphLayoutPosition {
    x: number;
    y: number;
  }

  type RelationGraphLayoutCache = Record<string, RelationGraphLayoutPosition>;
  type RelationGraphLayoutLoadResult = 'none' | 'partial' | 'full';

  // 人物关系图可视化
  const showRelationshipGraph = createShowRelationshipGraph({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseRelationshipString: (...a: any[]) => parseRelationshipString(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData,
  });
  // ========================================
  // 头像裁剪弹窗 - 统一PC/移动端体验
  // ========================================

  const showAvatarCropModal = createShowAvatarCropModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
  });

  const refreshAutoImageColorForAvatar = async (
    name: string,
    imageSource?: string | null,
    options: { offsetX?: unknown; offsetY?: unknown; scale?: unknown } = {},
  ): Promise<string> => {
    if (AvatarManager.getImageColorSource(name) === 'manual') {
      return AvatarManager.getImageColor(name);
    }

    const source = String(imageSource || (await AvatarManager.getAsync(name)) || '').trim();
    if (!source) {
      const fallbackColor = getAvatarFallbackColor(name);
      AvatarManager.setImageColor(name, fallbackColor, 'auto');
      return fallbackColor;
    }

    const color = await inferAvatarImageColor(source, {
      offsetX: options.offsetX ?? AvatarManager.getOffsetX(name),
      offsetY: options.offsetY ?? AvatarManager.getOffsetY(name),
      scale: options.scale ?? AvatarManager.getScale(name),
    });

    if (color) {
      AvatarManager.setImageColor(name, color, 'auto');
    } else {
      AvatarManager.setImageColor(name, getAvatarFallbackColor(name), 'auto');
    }

    return AvatarManager.getImageColor(name);
  };
  // 角色头像预设弹窗（简化版 - 使用裁剪弹窗）
  const showAvatarManager = createShowAvatarManager({
    avatarHexToHsl: (...a: any[]) => avatarHexToHsl(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clampAvatarNumber: (...a: any[]) => clampAvatarNumber(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getAvatarFallbackColor: (...a: any[]) => getAvatarFallbackColor(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getImageUrlValidationMessage: (...a: any[]) => getImageUrlValidationMessage(...a),
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
    normalizeAvatarHexColor: (...a: any[]) => normalizeAvatarHexColor(...a),
    refreshAutoImageColorForAvatar: (...a: any[]) => refreshAutoImageColorForAvatar(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    resolveUserGraphName: (...a: any[]) => resolveUserGraphName(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarCropModal: (...a: any[]) => showAvatarCropModal(...a),
    showImportConfirmDialog: (...a: any[]) => showImportConfirmDialog(...a),
    AvatarManager: AvatarManager,
  });

  // 清理骰子系统脚本缓存
  const clearDiceSystemCache = async (): Promise<void> => {
    if (!('caches' in window)) {
      console.log('[DICE] Cache API 不可用，直接刷新');
      return;
    }

    try {
      const cacheNames = await caches.keys();
      const urlPatterns = ['jsdelivr.net/gh/jerryzmtz/my-tavern-scripts', '/dist/骰子系统/'];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        for (const request of requests) {
          const url = request.url;
          // 匹配 jsDelivr 上的骰子系统脚本
          if (urlPatterns.some(pattern => url.includes(pattern))) {
            await cache.delete(request);
            console.log('[DICE] 已清理缓存:', url);
          }
        }
      }
      console.log('[DICE] 脚本缓存清理完成');
    } catch (err) {
      console.warn('[DICE] 缓存清理失败:', err);
    }
  };

  const clearDiceLocalCacheData = async (): Promise<number> => {
    let removedLocalStorageKeys = 0;

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith('acu_')) {
        localStorage.removeItem(key);
        removedLocalStorageKeys++;
      }
    }

    await Promise.allSettled([LocalAvatarDB.clearAll(), FavoritesDB.clear(), DiceHistoryStatsDB.clear()]);
    await clearDiceSystemCache();

    return removedLocalStorageKeys;
  };

  // 手动更新/确认弹窗（支持复用）
  const showManualUpdateDialog = createShowManualUpdateDialog({
    clearDiceSystemCache: (...a: any[]) => clearDiceSystemCache(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 导入确认弹窗
  const showImportConfirmDialog = createShowImportConfirmDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
  });
  // [新增] 整体编辑模态框 (已修复自动高度与样式复用)
  const showCardEditModal = createShowCardEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData,
  });

  // [优化] 内存配置缓存
  let _configCache = null;
  const LEGACY_DB_THEME_SYNC_CONFIG_KEY = ['sync', 'Database', 'Theme'].join('');
  const sanitizeUiConfig = config => {
    const nextConfig = { ...config };
    delete nextConfig[LEGACY_DB_THEME_SYNC_CONFIG_KEY];
    nextConfig.dialogueIndentEnabled = nextConfig.dialogueIndentEnabled === true;
    nextConfig.collapseStyle = normalizeCollapseStyle(nextConfig.collapseStyle);
    return nextConfig;
  };

  const getConfig = () => {
    if (!_configCache) {
      const storedConfig = Store.get(STORAGE_KEY_UI_CONFIG, {}) || {};
      const storedConfigObject = typeof storedConfig === 'object' ? storedConfig : {};
      const mergedConfig = { ...DEFAULT_CONFIG, ...storedConfigObject };
      _configCache = sanitizeUiConfig(mergedConfig);
      const needsWriteback =
        Object.prototype.hasOwnProperty.call(storedConfigObject, LEGACY_DB_THEME_SYNC_CONFIG_KEY) ||
        mergedConfig.collapseStyle !== _configCache.collapseStyle;
      if (needsWriteback) {
        Store.set(STORAGE_KEY_UI_CONFIG, _configCache);
      }
    }
    return _configCache;
  };
  const saveConfig = newCfg => {
    _configCache = sanitizeUiConfig({ ...getConfig(), ...newCfg });
    Store.set(STORAGE_KEY_UI_CONFIG, _configCache);
    applyConfigStyles(_configCache);
    setDatabaseToastMute(_configCache.muteDatabaseToasts === true);
  };

  const DICE_CONFIG_BACKUP_FORMAT = 'acu_dice_config_backup_v1' as const;
  const DICE_CONFIG_BACKUP_SCHEMA_VERSION = 1;

  const DICE_PROFILE_INDEX_STORAGE_KEY = 'acu_dice_profile_index_v1';
  const DICE_PROFILE_LAST_APPLIED_STORAGE_KEY = 'acu_dice_profile_last_applied_v1';
  const DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY = 'acu_dice_profile_skipped_prompts_v1';
  const DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY = 'acu_dice_profile_collapsed_sections_v2';
  const DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT = 5;

  type DiceConfigBackupModuleId =
    | 'uiLayout'
    | 'diceConfig'
    | 'advancedPresets'
    | 'attributePresets'
    | 'actionGm'
    | 'dashboardPresets'
    | 'renderPresets'
    | 'tableTemplate'
    | 'tableTemplateRequirementPresets'
    | 'validation'
    | 'regex'
    | 'avatarMap'
    | 'customIcons'
    | 'gachaSettings';

  type DiceConfigBackupKeyStrategy =
    | 'object'
    | 'map'
    | 'setArray'
    | 'presetArray'
    | 'gachaPoolSettings'
    | 'gachaItemSettings'
    | 'raw'
    | 'rawString';

  interface DiceConfigBackupModuleDefinition {
    id: DiceConfigBackupModuleId;
    name: string;
    description: string;
    storageKeys: readonly string[];
    deprecated?: boolean;
    deprecatedReason?: string;
  }

  interface DiceConfigBackupModulePayload {
    storage: Record<string, unknown>;
    resources?: Record<string, unknown>;
    warnings?: string[];
  }

  interface DiceConfigBackupDocument {
    format: typeof DICE_CONFIG_BACKUP_FORMAT;
    schemaVersion: number;
    exportedAt: string;
    scriptVersion: string;
    presetFormatVersion: string;
    modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>>;
  }

  interface DiceConfigBackupParseResult {
    backup: DiceConfigBackupDocument;
    warnings: string[];
  }

  interface DiceConfigBackupApplyStats {
    added: number;
    overwritten: number;
    skipped: number;
    restoredModules: string[];
    warnings: string[];
  }

  interface DiceConfigBackupPresetMergeResult {
    value: unknown[];
    idMap: Map<string, string>;
    added: number;
    overwritten: number;
    skipped: number;
    warnings: string[];
  }

  interface DiceConfigBackupPendingActiveWrite {
    key: string;
    value: unknown;
    moduleName: string;
  }

  interface DiceConfigBackupGachaCatalogRollbackSnapshot {
    records: readonly GachaCatalogRecord[] | null;
    warning?: string;
  }

  interface DiceConfigBackupTableTemplateRollbackSnapshot {
    template?: unknown;
    warning?: string;
  }

  type DiceProfileSourceType = 'user' | 'imported' | 'character' | 'character_card' | 'snapshot';

  interface DiceProfileSummary {
    id: string;
    name: string;
    source: AcuDiceProfileSource;
    createdAt: string;
    updatedAt: string;
    moduleIds: DiceConfigBackupModuleId[];
    fingerprint: string;
    lastAppliedAt?: string;
  }

  type DiceProfileRecord = AcuDiceProfilePackage<DiceConfigBackupDocument> & {
    source: AcuDiceProfileSource & { type: DiceProfileSourceType | string };
    moduleIds: DiceConfigBackupModuleId[];
    savedAt: string;
    lastAppliedAt?: string;
  };

  interface DiceProfileApplyOptions {
    moduleIds?: readonly string[];
    createSnapshot?: boolean;
    confirm?: boolean;
  }

  interface DiceProfileSaveCurrentOptions {
    name?: string;
    moduleIds?: readonly string[];
    source?: AcuDiceProfileSource;
  }

  interface DiceProfileImportOptions {
    name?: string;
    source?: AcuDiceProfileSource;
    saveOnly?: boolean;
    apply?: boolean;
  }

  interface DiceCharacterProfileDetection {
    profile: DiceProfileRecord;
    sourceTextKind: 'message' | 'first_mes' | 'regex';
  }



  const DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT: Record<DiceConfigBackupModuleId, string> = {
    uiLayout: '风险较低，但会暴露主题、布局、表格顺序、隐藏项、折叠状态等使用偏好。',
    diceConfig: '可能暴露当前检定玩法偏好、疯狂模式权重、头像与图标联动开关、当前激活检定模式。',
    advancedPresets: '可能包含自定义检定规则、公式、输出文本、资源消耗与结果分支。',
    attributePresets: '可能包含角色属性模板、属性名、默认值、世界观或规则体系关键词。',
    actionGm: '可能包含交互按钮、发送模板、表名关键词，以及旧版 GM 引擎配置。',
    dashboardPresets: '可能包含仪表盘模块、表名、列名、关系图和展示规则。',
    renderPresets: '可能包含列名别名、关系/属性解析规则、正文头像渲染白名单与黑名单。',
    tableTemplate: '不包含当前表格行数据，但可能包含模板名、字段、说明、示例 SQL 或世界观设定。',
    tableTemplateRequirementPresets: '可能包含模板检验规则、核心表名、列名、DDL、说明文本和世界观模板要求。',
    validation: '可能包含数据验证预设、表名、列名、枚举值、错误提示与拦截偏好。',
    regex: '可能包含正则表达式、替换文本、测试用例、表名/列名关键词和文本处理偏好。',
    avatarMap: '可能包含角色名、别名、头像 URL、裁剪偏移、缩放和颜色信息。',
    customIcons: '可能包含表名、物品、装备、势力等名称，以及图标 URL 或本地图标引用元数据。',
    gachaSettings: '可能包含自定义物品、卡池、描述、自定义字段、外链图标和剧情偏好内容。',
  };



  const DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY = 'gachaCatalogRecords';
  const DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY = 'tableTemplate';

  interface DiceConfigBackupTableTemplateApi {
    getTableTemplate?: () => unknown;
    importTemplateFromData?: (template: unknown, options?: { scope?: string }) => Promise<unknown> | unknown;
  }

  const DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY: Record<string, string> = {
    [STORAGE_KEY_LAST_PRESET]: STORAGE_KEY_ADVANCED_PRESETS,
    [STORAGE_KEY_ACTIVE_ADVANCED_PRESET]: STORAGE_KEY_ADVANCED_PRESETS,
    [STORAGE_KEY_ACTIVE_ATTR_PRESET]: STORAGE_KEY_ATTRIBUTE_PRESETS,
    [STORAGE_KEY_ACTIVE_ACTION_PRESET]: STORAGE_KEY_ACTION_PRESETS,
    [STORAGE_KEY_ACTIVE_DASHBOARD_PRESET]: STORAGE_KEY_DASHBOARD_PRESETS,
    [STORAGE_KEY_ACTIVE_RENDER_PRESET]: STORAGE_KEY_RENDER_PRESETS,
    [STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET]: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    [STORAGE_KEY_ACTIVE_PRESET]: STORAGE_KEY_PRESETS,
    [STORAGE_KEY_REGEX_ACTIVE_PRESET]: STORAGE_KEY_REGEX_PRESETS,
  };

  const isDiceConfigBackupRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const cloneDiceConfigBackupValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

  const getDiceConfigBackupModuleDefinition = (moduleId: DiceConfigBackupModuleId) =>
    DICE_CONFIG_BACKUP_MODULES.find(module => module.id === moduleId) || null;

  const isDiceConfigBackupModuleId = (value: string): value is DiceConfigBackupModuleId =>
    DICE_CONFIG_BACKUP_MODULES.some(module => module.id === value);

  const getDiceConfigBackupWarningCount = (backup: DiceConfigBackupDocument): number =>
    Object.values(backup.modules).reduce((count, payload) => count + (payload?.warnings?.length || 0), 0);

  const formatDiceConfigBackupSelectedModuleRiskLines = (moduleIds: readonly DiceConfigBackupModuleId[]): string[] =>
    moduleIds.map(moduleId => {
      const definition = getDiceConfigBackupModuleDefinition(moduleId);
      return `${definition?.name || moduleId}: ${DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT[moduleId]}`;
    });

  const formatDiceConfigBackupPrivacyDetail = (
    mode: 'export' | 'restore',
    moduleIds: readonly DiceConfigBackupModuleId[],
    backup?: DiceConfigBackupDocument,
  ): string => {
    const actionText =
      mode === 'export'
        ? '备份文件适合自己迁移配置；如果要公开分享，请先检查 JSON 内容，确认没有私密角色、世界观、偏好或外链资源。'
        : '外来备份会合并或覆盖本地配置，可能启用对方的正则、验证规则、预设、外链头像或图标。只恢复可信来源。';
    const sourceText =
      mode === 'restore' && backup
        ? [
            `导出时间: ${backup.exportedAt || '未知'}`,
            `脚本版本: ${backup.scriptVersion || '未知'}`,
            `预设格式: ${backup.presetFormatVersion || '未知'}`,
          ]
        : [];

    return [
      actionText,
      '当前选择的模块可能包含:',
      ...formatDiceConfigBackupSelectedModuleRiskLines(moduleIds),
      ...sourceText,
    ].join('\n');
  };

  const showDiceConfigBackupPrivacyConfirm = (
    mode: 'export' | 'restore',
    moduleIds: readonly DiceConfigBackupModuleId[],
    backup?: DiceConfigBackupDocument,
  ): Promise<boolean> =>
    showDiceSystemConfirmDialog({
      title: mode === 'export' ? '导出配置备份' : '恢复配置备份',
      message:
        mode === 'export' ? '备份文件可能包含可识别的私密配置。' : '恢复外来备份可能覆盖本地配置并启用对方规则。',
      detail: formatDiceConfigBackupPrivacyDetail(mode, moduleIds, backup),
      iconClass: 'fa-triangle-exclamation',
      confirmText: mode === 'export' ? '确认导出' : '确认恢复',
      cancelText: '取消',
      tone: 'warning',
    });

  const normalizeDiceConfigBackupSelectedModuleIds = (moduleIds: readonly string[]): DiceConfigBackupModuleId[] => {
    const result: DiceConfigBackupModuleId[] = [];
    moduleIds.forEach(moduleId => {
      if (!isDiceConfigBackupModuleId(moduleId)) return;
      if (!result.includes(moduleId)) result.push(moduleId);
    });
    return result;
  };

  const getDiceConfigBackupKeyStrategy = (key: string): DiceConfigBackupKeyStrategy =>
    DICE_CONFIG_BACKUP_KEY_STRATEGIES[key] || 'raw';

  const getDiceConfigBackupRecordString = (record: Record<string, unknown>, key: string): string => {
    const value = record[key];
    return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
  };

  const getDiceConfigBackupValidationRuleKey = (rule: Record<string, unknown>): string => {
    const id = getDiceConfigBackupRecordString(rule, 'id');
    if (id) return id;
    const targetTable = getDiceConfigBackupRecordString(rule, 'targetTable');
    const ruleType = getDiceConfigBackupRecordString(rule, 'ruleType');
    return targetTable && ruleType ? `${targetTable}_${ruleType}` : '';
  };

  const getDiceConfigBackupRegexRuleKey = (rule: Record<string, unknown>): string =>
    getDiceConfigBackupRecordString(rule, 'id');

  const copyDiceConfigBackupExistingFields = (
    source: Record<string, unknown>,
    target: Record<string, unknown>,
    fields: readonly string[],
  ): void => {
    fields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(source, field)) {
        const value = source[field];
        target[field] = value === undefined ? undefined : cloneDiceConfigBackupValue(value);
      }
    });
  };

  const sanitizeDiceConfigBackupValidationRule = (rule: unknown): Record<string, unknown> | null => {
    if (!isDiceConfigBackupRecord(rule)) return null;
    if (rule.builtin === true) {
      const key = getDiceConfigBackupValidationRuleKey(rule);
      if (!key) return null;
      const result: Record<string, unknown> = { builtin: true };
      copyDiceConfigBackupExistingFields(rule, result, [
        'id',
        'targetTable',
        'ruleType',
        'enabled',
        'intercept',
        'errorMessage',
      ]);
      return result;
    }
    const customRule = cloneDiceConfigBackupValue(rule);
    customRule.builtin = false;
    return customRule;
  };

  const sanitizeDiceConfigBackupRegexRule = (rule: unknown): Record<string, unknown> | null => {
    if (!isDiceConfigBackupRecord(rule)) return null;
    if (rule.builtin === true) {
      const id = getDiceConfigBackupRegexRuleKey(rule);
      if (!id) return null;
      if (DEPRECATED_BUILTIN_REGEX_RULE_IDS.has(id)) return null;
      const result: Record<string, unknown> = { id, builtin: true };
      copyDiceConfigBackupExistingFields(rule, result, ['enabled']);
      return result;
    }
    const customRule = cloneDiceConfigBackupValue(rule);
    customRule.builtin = false;
    return customRule;
  };

  const sanitizeDiceConfigBackupRuleList = (
    value: unknown,
    sanitizeRule: (rule: unknown) => Record<string, unknown> | null,
  ): unknown => {
    if (!Array.isArray(value)) return value;
    return value.map(sanitizeRule).filter((rule): rule is Record<string, unknown> => Boolean(rule));
  };

  const sanitizeDiceConfigBackupPresetRules = (
    value: unknown,
    sanitizeRule: (rule: unknown) => Record<string, unknown> | null,
  ): unknown => {
    if (!Array.isArray(value)) return value;
    return value.map(item => {
      if (!isDiceConfigBackupRecord(item)) return item === undefined ? undefined : cloneDiceConfigBackupValue(item);
      const preset = cloneDiceConfigBackupValue(item);
      preset.rules = sanitizeDiceConfigBackupRuleList(preset.rules, sanitizeRule);
      return preset;
    });
  };

  const sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport = (value: unknown, key: string): unknown => {
    if (!Array.isArray(value)) return value;
    const builtinPresetIds = new Set(getDiceConfigBackupBuiltinPresetIds(key));
    const presetsById = new Map<string, Record<string, unknown>>();
    value.forEach(item => {
      if (!isDiceConfigBackupRecord(item)) return;
      const sourceId = getDiceConfigBackupPresetRecordId(item);
      if (!sourceId || builtinPresetIds.has(sourceId) || item.builtin === true) return;
      const normalized =
        key === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS
          ? normalizeTableTemplateRequirementPreset(item, sourceId)
          : cloneDiceConfigBackupValue(item);
      if (!normalized || !isDiceConfigBackupRecord(normalized)) return;
      const id = getDiceConfigBackupPresetRecordId(normalized) || sourceId;
      if (!id || builtinPresetIds.has(id) || normalized.builtin === true) return;
      presetsById.set(id, { ...cloneDiceConfigBackupValue(normalized), id, builtin: false });
    });
    const sanitized = Array.from(presetsById.values());
    return sanitized.length > 0 ? sanitized : undefined;
  };

  const sanitizeDiceConfigBackupStoredValue = (key: string, value: unknown): unknown => {
    if (key === STORAGE_KEY_PRESETS)
      return sanitizeDiceConfigBackupPresetRules(value, sanitizeDiceConfigBackupValidationRule);
    if (key === STORAGE_KEY_VALIDATION_RULES)
      return sanitizeDiceConfigBackupRuleList(value, sanitizeDiceConfigBackupValidationRule);
    if (key === STORAGE_KEY_REGEX_PRESETS)
      return sanitizeDiceConfigBackupPresetRules(value, sanitizeDiceConfigBackupRegexRule);
    if (key === STORAGE_KEY_REGEX_RULES)
      return sanitizeDiceConfigBackupRuleList(value, sanitizeDiceConfigBackupRegexRule);
    if (key === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS) {
      return sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport(value, key);
    }
    return value;
  };

  const getDiceConfigBackupStoredValue = (key: string): unknown => {
    if (getDiceConfigBackupKeyStrategy(key) === 'rawString') {
      const raw = localStorage.getItem(key);
      return raw === null ? undefined : raw;
    }
    if (key === STORAGE_KEY_UI_CONFIG) return getConfig();
    if (key === STORAGE_KEY_DICE_CONFIG) {
      const diceConfig = getDiceConfig();
      return isDiceConfigBackupRecord(diceConfig) ? { ...DEFAULT_DICE_CONFIG, ...diceConfig } : DEFAULT_DICE_CONFIG;
    }
    if (key === STORAGE_KEY_CRAZY_MODE) return getCrazyModeConfig();
    if (key === STORAGE_KEY_GM_CONFIG && localStorage.getItem(key) !== null) return Store.get(key, DEFAULT_GM_CONFIG);
    if (key === STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET)
      return TableTemplateRequirementPresetManager.getActivePresetId();

    if (localStorage.getItem(key) === null) return undefined;
    return Store.get(key, null);
  };

  const normalizeDiceConfigBackupGachaCatalogSnapshotRecords = (
    records: readonly GachaCatalogRecord[],
  ): GachaCatalogRecord[] =>
    records
      .map(record => {
        const scopeKey = String(record.scopeKey || '').trim();
        const catalog = normalizeGachaCatalogRecord(record);
        if (!scopeKey || !catalog) return null;
        return {
          scopeKey,
          version: catalog.version,
          items: cloneGachaCatalogItems(catalog.items),
          updatedAt: catalog.updatedAt,
        } satisfies GachaCatalogRecord;
      })
      .filter((record): record is GachaCatalogRecord => Boolean(record));

  const collectDiceConfigBackupGachaCatalogRecords = async (): Promise<GachaCatalogRecord[]> => {
    try {
      await migrateGachaCatalogRecordsToGlobalScope();
      return normalizeDiceConfigBackupGachaCatalogSnapshotRecords(await GachaCatalogDB.getAll());
    } catch (error) {
      console.error('[DICE]配置备份读取商城自定义目录失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`读取骰子商城自定义物品目录失败，已取消导出：${message}`);
    }
  };

  const collectDiceConfigBackupGachaCatalogRollbackSnapshot =
    async (): Promise<DiceConfigBackupGachaCatalogRollbackSnapshot> => {
      try {
        return { records: normalizeDiceConfigBackupGachaCatalogSnapshotRecords(await GachaCatalogDB.getAll()) };
      } catch (error) {
        console.warn('[DICE]配置备份读取商城自定义目录回滚快照失败:', error);
        const message = error instanceof Error ? error.message : String(error);
        return {
          records: null,
          warning: `骰子商城配置与自定义物品: 无法创建回滚快照，已取消恢复：${message}`,
        };
      }
    };

  const getDiceConfigBackupTableTemplateApi = (): DiceConfigBackupTableTemplateApi | null => {
    const api = getCore().getDB() as DiceConfigBackupTableTemplateApi | null | undefined;
    return api || null;
  };

  const collectDiceConfigBackupTableTemplate = (): { template?: unknown; warnings: string[] } => {
    const api = getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.getTableTemplate !== 'function') {
      return { warnings: ['数据库模板 API 不可用，未备份当前表格模板。'] };
    }

    try {
      const template = api.getTableTemplate();
      if (!isDiceConfigBackupRecord(template)) {
        return { warnings: ['当前聊天没有可备份的数据库表格模板。'] };
      }
      return { template: cloneDiceConfigBackupValue(template), warnings: [] };
    } catch (error) {
      console.warn('[DICE]配置备份读取数据库表格模板失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      return { warnings: [`读取当前数据库表格模板失败：${message}`] };
    }
  };

  const getDiceConfigBackupGachaCatalogItemCount = (records: readonly GachaCatalogRecord[]): number =>
    records.reduce((count, record) => count + (Array.isArray(record.items) ? record.items.length : 0), 0);

  const getDiceConfigBackupModuleResourceCount = (
    payload?: DiceConfigBackupModulePayload,
    moduleId?: DiceConfigBackupModuleId,
  ): number => {
    const resources = payload?.resources;
    if (!resources) return 0;
    if (moduleId === 'tableTemplate') {
      const tableTemplate = resources[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY];
      return isDiceConfigBackupRecord(tableTemplate) ? Math.max(1, Object.keys(tableTemplate).length) : 0;
    }
    if (moduleId === 'gachaSettings') {
      const gachaRecords = resources[DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY];
      if (!Array.isArray(gachaRecords)) return 0;
      const records = gachaRecords
        .map(record =>
          isDiceConfigBackupRecord(record) ? normalizeDiceConfigBackupGachaCatalogResourceRecord(record, []) : null,
        )
        .filter((record): record is GachaCatalogRecord => Boolean(record));
      return getDiceConfigBackupGachaCatalogItemCount(records);
    }
    return 0;
  };

  const hasDiceConfigBackupTableTemplateResource = (payload?: DiceConfigBackupModulePayload): boolean =>
    isDiceConfigBackupRecord(payload?.resources?.[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY]);

  const hasDiceConfigBackupRecoverableStorage = (
    payload: DiceConfigBackupModulePayload,
    definition: DiceConfigBackupModuleDefinition,
  ): boolean =>
    Object.entries(payload.storage || {}).some(([key, value]) => {
      if (!definition.storageKeys.includes(key) || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (isDiceConfigBackupRecord(value)) return Object.keys(value).length > 0;
      return value !== null && value !== '';
    });

  const getDiceConfigBackupModuleResourceShapeWarnings = createGetDiceConfigBackupModuleResourceShapeWarnings({
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupLocalImageReference = (value: unknown, depth = 0): boolean => {
    if (depth > 8) return false;
    if (Array.isArray(value)) return value.some(item => hasDiceConfigBackupLocalImageReference(item, depth + 1));
    if (!isDiceConfigBackupRecord(value)) return false;
    if (value.sourceType === 'local') return true;
    if (typeof value.localIconKey === 'string' && value.localIconKey.trim()) return true;
    return Object.values(value).some(item => hasDiceConfigBackupLocalImageReference(item, depth + 1));
  };

  const getDiceConfigBackupModuleWarnings = (
    moduleId: DiceConfigBackupModuleId,
    storage: Record<string, unknown>,
    resources: Record<string, unknown> = {},
  ): string[] => {
    const warnings: string[] = [];
    if (moduleId === 'avatarMap') {
      warnings.push('本地上传头像图片存放在 IndexedDB 中，不会进入该备份包；仅备份 URL、偏移、缩放与别名配置。');
    }
    if (moduleId === 'customIcons' && hasDiceConfigBackupLocalImageReference(storage)) {
      warnings.push('检测到本地图标引用；备份包只包含图标配置元数据，不包含 IndexedDB 中的图片二进制。');
    }
    if (
      moduleId === 'gachaSettings' &&
      (hasDiceConfigBackupLocalImageReference(storage) || hasDiceConfigBackupLocalImageReference(resources))
    ) {
      warnings.push('检测到商城本地图标引用；备份包不包含 IndexedDB 中的图片二进制，也不包含当前聊天抽取状态。');
    }
    if (moduleId === 'validation' || moduleId === 'regex') {
      warnings.push('内置预设规则会以当前脚本版本为准；备份包只保存自定义规则和内置规则的启用/拦截等偏好。');
    }
    if (moduleId === 'tableTemplate') {
      const hasTemplate = resources[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY] !== undefined;
      warnings.push(
        hasTemplate
          ? '备份包含当前聊天生效的数据库表格模板；恢复时会导入到数据库模板列表，如果已有同名模板会覆盖同名模板。'
          : '未读取到可备份的数据库表格模板，备份文件中不会包含可恢复的模板内容。',
      );
    }
    return warnings;
  };

  const buildDiceConfigBackup = createBuildDiceConfigBackup({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    collectDiceConfigBackupGachaCatalogRecords: (...a: any[]) => collectDiceConfigBackupGachaCatalogRecords(...a),
    collectDiceConfigBackupTableTemplate: (...a: any[]) => collectDiceConfigBackupTableTemplate(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupModuleWarnings: (...a: any[]) => getDiceConfigBackupModuleWarnings(...a),
    getDiceConfigBackupStoredValue: (...a: any[]) => getDiceConfigBackupStoredValue(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
    sanitizeDiceConfigBackupStoredValue: (...a: any[]) => sanitizeDiceConfigBackupStoredValue(...a),
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const parseDiceConfigBackup = createParseDiceConfigBackup({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupModuleResourceShapeWarnings: (...a: any[]) => getDiceConfigBackupModuleResourceShapeWarnings(...a),
    isDiceConfigBackupModuleId: (...a: any[]) => isDiceConfigBackupModuleId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    parseJsoncDocument: (...a: any[]) => parseJsoncDocument(...a),
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
  });

  const getDiceConfigBackupValueIdentity = (value: unknown): string => {
    if (value === null) return 'null:null';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return `${typeof value}:${String(value)}`;
    }
    try {
      return `json:${JSON.stringify(value)}`;
    } catch {
      return `string:${String(value)}`;
    }
  };

  const isDiceConfigBackupSameValue = (left: unknown, right: unknown): boolean => {
    try {
      return JSON.stringify(left) === JSON.stringify(right);
    } catch {
      return left === right;
    }
  };

  const mergeDiceConfigBackupSetArray = (current: unknown, incoming: unknown): unknown[] | null => {
    if (!Array.isArray(incoming)) return null;
    const result = cloneDiceConfigBackupValue(incoming);
    const seen = new Set(result.map(item => getDiceConfigBackupValueIdentity(item)));
    if (Array.isArray(current)) {
      current.forEach(item => {
        const identity = getDiceConfigBackupValueIdentity(item);
        if (seen.has(identity)) return;
        seen.add(identity);
        result.push(cloneDiceConfigBackupValue(item));
      });
    }
    return result;
  };

  const getDiceConfigBackupPresetRecordId = (record: Record<string, unknown>): string => {
    const rawId = record.id;
    return typeof rawId === 'string' || typeof rawId === 'number' ? String(rawId).trim() : '';
  };

  const getDiceConfigBackupPresetRecordName = (record: Record<string, unknown>): string => {
    const rawName = record.name;
    return typeof rawName === 'string' || typeof rawName === 'number' ? String(rawName).trim() : '';
  };

  const mergeDiceConfigBackupPresetArray = createMergeDiceConfigBackupPresetArray({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    getDiceConfigBackupPresetRecordName: (...a: any[]) => getDiceConfigBackupPresetRecordName(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const mergeDiceConfigBackupCustomOnlyPresetArray = createMergeDiceConfigBackupCustomOnlyPresetArray({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    getDiceConfigBackupPresetRecordName: (...a: any[]) => getDiceConfigBackupPresetRecordName(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
  });

  const getDiceConfigBackupRuleRecords = (
    value: unknown,
    sanitizeRule: (rule: unknown) => Record<string, unknown> | null,
  ): Record<string, unknown>[] => {
    if (!Array.isArray(value)) return [];
    return value.map(sanitizeRule).filter((rule): rule is Record<string, unknown> => Boolean(rule));
  };

  const buildDiceConfigBackupRuleOverrideMap = (
    rules: readonly Record<string, unknown>[],
    getRuleKey: (rule: Record<string, unknown>) => string,
  ): Map<string, Record<string, unknown>> => {
    const result = new Map<string, Record<string, unknown>>();
    rules.forEach(rule => {
      if (rule.builtin !== true) return;
      const key = getRuleKey(rule);
      if (key) result.set(key, rule);
    });
    return result;
  };

  const applyDiceConfigBackupRuleOverrides = (
    baseRule: Record<string, unknown>,
    ruleKey: string,
    overrideMaps: readonly Map<string, Record<string, unknown>>[],
    fields: readonly string[],
  ): Record<string, unknown> => {
    const result = cloneDiceConfigBackupValue(baseRule);
    result.builtin = true;
    overrideMaps.forEach(overrides => {
      const override = overrides.get(ruleKey);
      if (override) copyDiceConfigBackupExistingFields(override, result, fields);
    });
    return result;
  };

  const mergeDiceConfigBackupCustomRules = (
    currentRules: readonly Record<string, unknown>[],
    incomingRules: readonly Record<string, unknown>[],
    builtinKeys: ReadonlySet<string>,
    getRuleKey: (rule: Record<string, unknown>) => string,
  ): Record<string, unknown>[] => {
    const result: Record<string, unknown>[] = [];
    const indexByKey = new Map<string, number>();

    const addRule = (rule: Record<string, unknown>, overwrite: boolean): void => {
      if (rule.builtin === true) return;
      const key = getRuleKey(rule);
      if (key && builtinKeys.has(key)) return;
      const cloned = cloneDiceConfigBackupValue(rule);
      cloned.builtin = false;
      if (key && indexByKey.has(key)) {
        if (overwrite) result[indexByKey.get(key)!] = cloned;
        return;
      }
      if (key) indexByKey.set(key, result.length);
      result.push(cloned);
    };

    currentRules.forEach(rule => addRule(rule, false));
    incomingRules.forEach(rule => addRule(rule, true));
    return result;
  };

  const mergeDiceConfigBackupValidationRules = (current: unknown, incoming: unknown): Record<string, unknown>[] => {
    const currentRules = getDiceConfigBackupRuleRecords(current, sanitizeDiceConfigBackupValidationRule);
    const incomingRules = getDiceConfigBackupRuleRecords(incoming, sanitizeDiceConfigBackupValidationRule);
    const currentOverrides = buildDiceConfigBackupRuleOverrideMap(currentRules, getDiceConfigBackupValidationRuleKey);
    const incomingOverrides = buildDiceConfigBackupRuleOverrideMap(incomingRules, getDiceConfigBackupValidationRuleKey);
    const builtinRules = BUILTIN_VALIDATION_RULES.map(rule => {
      const baseRule = cloneDiceConfigBackupValue(rule) as Record<string, unknown>;
      const key = getDiceConfigBackupValidationRuleKey(baseRule);
      return applyDiceConfigBackupRuleOverrides(
        baseRule,
        key,
        [currentOverrides, incomingOverrides],
        ['enabled', 'intercept', 'errorMessage'],
      );
    });
    const builtinKeys = new Set(builtinRules.map(getDiceConfigBackupValidationRuleKey).filter(Boolean));
    return [
      ...builtinRules,
      ...mergeDiceConfigBackupCustomRules(
        currentRules,
        incomingRules,
        builtinKeys,
        getDiceConfigBackupValidationRuleKey,
      ),
    ];
  };

  const mergeDiceConfigBackupRegexRules = (current: unknown, incoming: unknown): Record<string, unknown>[] => {
    const currentRules = getDiceConfigBackupRuleRecords(current, sanitizeDiceConfigBackupRegexRule);
    const incomingRules = getDiceConfigBackupRuleRecords(incoming, sanitizeDiceConfigBackupRegexRule);
    const currentOverrides = buildDiceConfigBackupRuleOverrideMap(currentRules, getDiceConfigBackupRegexRuleKey);
    const incomingOverrides = buildDiceConfigBackupRuleOverrideMap(incomingRules, getDiceConfigBackupRegexRuleKey);
    const builtinRules = BUILTIN_REGEX_RULES.map(rule => {
      const baseRule = cloneDiceConfigBackupValue(rule) as Record<string, unknown>;
      const key = getDiceConfigBackupRegexRuleKey(baseRule);
      return applyDiceConfigBackupRuleOverrides(baseRule, key, [currentOverrides, incomingOverrides], ['enabled']);
    });
    const builtinKeys = new Set(builtinRules.map(getDiceConfigBackupRegexRuleKey).filter(Boolean));
    return [
      ...builtinRules,
      ...mergeDiceConfigBackupCustomRules(currentRules, incomingRules, builtinKeys, getDiceConfigBackupRegexRuleKey),
    ];
  };

  const getDiceConfigBackupSafeCurrentPresets = (key: string, current: unknown): unknown[] => {
    if (key === STORAGE_KEY_PRESETS) return cloneDiceConfigBackupValue(PresetManager.getAllPresets() || []);
    if (key === STORAGE_KEY_REGEX_PRESETS) return cloneDiceConfigBackupValue(RegexPresetManager.getAllPresets() || []);
    return Array.isArray(current) ? cloneDiceConfigBackupValue(current) : [];
  };

  const mergeDiceConfigBackupPresetArraySafely = createMergeDiceConfigBackupPresetArraySafely({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    getDiceConfigBackupPresetRecordName: (...a: any[]) => getDiceConfigBackupPresetRecordName(...a),
    getDiceConfigBackupSafeCurrentPresets: (...a: any[]) => getDiceConfigBackupSafeCurrentPresets(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    mergeDiceConfigBackupRegexRules: (...a: any[]) => mergeDiceConfigBackupRegexRules(...a),
    mergeDiceConfigBackupValidationRules: (...a: any[]) => mergeDiceConfigBackupValidationRules(...a),
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
  });

  const normalizeDiceConfigBackupGachaPoolSettings = (value: unknown): GachaPoolSettingsRecord | null => {
    if (!isDiceConfigBackupRecord(value)) return null;
    const pools = Array.isArray(value.pools)
      ? value.pools.map(normalizeGachaPoolDefinition).filter((pool): pool is GachaPoolDefinition => Boolean(pool))
      : [];
    return {
      version: Number(value.version) || 1,
      pools,
      updatedAt: Math.max(0, Number(value.updatedAt) || 0),
    };
  };

  const mergeDiceConfigBackupGachaPoolSettings = (
    current: unknown,
    incoming: unknown,
  ): GachaPoolSettingsRecord | null => {
    const incomingRecord = normalizeDiceConfigBackupGachaPoolSettings(incoming);
    if (!incomingRecord) return null;
    const currentRecord = normalizeDiceConfigBackupGachaPoolSettings(current) || {
      version: 1,
      pools: [],
      updatedAt: 0,
    };
    const currentById = new Map(currentRecord.pools.map(pool => [pool.id, pool]));
    const incomingIds = new Set(incomingRecord.pools.map(pool => pool.id));
    const mergedPools = incomingRecord.pools.map(pool => {
      const existing = currentById.get(pool.id);
      const enabled = pool.id !== GACHA_ALL_POOL_TAG && pool.includeInAll === true;
      return {
        ...(existing || buildDefaultGachaPoolDefinition(pool.id, pool)),
        ...pool,
        builtin: existing?.builtin === true || isBuiltinGachaPoolId(pool.id),
        visibleInTabs: pool.id === GACHA_ALL_POOL_TAG ? true : enabled,
        includeInAll: enabled,
      };
    });
    currentRecord.pools.forEach(pool => {
      if (!incomingIds.has(pool.id)) mergedPools.push(pool);
    });
    return {
      version: Math.max(1, incomingRecord.version, currentRecord.version),
      pools: mergedPools,
      updatedAt: Date.now(),
    };
  };

  const normalizeDiceConfigBackupGachaItemSettings = (value: unknown): GachaItemSettingsRecord | null => {
    if (!isDiceConfigBackupRecord(value)) return null;
    const rawItems = isDiceConfigBackupRecord(value.items) ? value.items : {};
    const items: Record<string, GachaItemSettingsEntry> = {};
    Object.entries(rawItems).forEach(([rawId, rawEntry]) => {
      const id = String(rawId || '').trim();
      if (!id || !isDiceConfigBackupRecord(rawEntry)) return;
      items[id] = {
        enabled: normalizeGachaItemEnabled(rawEntry.enabled),
        order: normalizeGachaItemOrder(rawEntry.order),
      };
    });
    return {
      version: Number(value.version) || 1,
      items,
      updatedAt: Math.max(0, Number(value.updatedAt) || 0),
    };
  };

  const mergeDiceConfigBackupGachaItemSettings = (
    current: unknown,
    incoming: unknown,
  ): GachaItemSettingsRecord | null => {
    const incomingRecord = normalizeDiceConfigBackupGachaItemSettings(incoming);
    if (!incomingRecord) return null;
    const currentRecord = normalizeDiceConfigBackupGachaItemSettings(current) || {
      version: 1,
      items: {},
      updatedAt: 0,
    };
    return {
      version: Math.max(1, incomingRecord.version, currentRecord.version),
      items: {
        ...currentRecord.items,
        ...incomingRecord.items,
      },
      updatedAt: Date.now(),
    };
  };

  const remapDiceConfigBackupGachaItemSettings = (
    idMap: ReadonlyMap<string, string>,
    sourceIds: ReadonlySet<string>,
  ): boolean => {
    if (idMap.size === 0) return false;
    const currentRecord = normalizeDiceConfigBackupGachaItemSettings(Store.get(STORAGE_KEY_GACHA_ITEM_SETTINGS, null));
    if (!currentRecord) return false;
    const items = { ...currentRecord.items };
    let changed = false;
    idMap.forEach((targetId, sourceId) => {
      if (!sourceIds.has(sourceId) || !sourceId || !targetId || sourceId === targetId || !items[sourceId]) return;
      items[targetId] = items[sourceId];
      delete items[sourceId];
      changed = true;
    });
    if (!changed) return false;
    if (!Store.set(STORAGE_KEY_GACHA_ITEM_SETTINGS, {
      version: Math.max(1, currentRecord.version),
      items,
      updatedAt: Date.now(),
    } satisfies GachaItemSettingsRecord)) {
      throw new Error('自定义物品设置映射保存失败');
    }
    return true;
  };

  const getDiceConfigBackupBuiltinPresetIds = (presetKey: string): string[] => {
    if (presetKey === STORAGE_KEY_ADVANCED_PRESETS) return BUILTIN_ADVANCED_PRESETS.map(preset => preset.id);
    if (presetKey === STORAGE_KEY_ATTRIBUTE_PRESETS) return BUILTIN_ATTRIBUTE_PRESETS.map(preset => String(preset.id));
    if (presetKey === STORAGE_KEY_ACTION_PRESETS) return BUILTIN_ACTION_PRESETS.map(preset => String(preset.id));
    if (presetKey === STORAGE_KEY_DASHBOARD_PRESETS) return [DASHBOARD_DEFAULT_PRESET_ID];
    if (presetKey === STORAGE_KEY_RENDER_PRESETS) return [RENDER_DEFAULT_PRESET_ID];
    if (presetKey === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS)
      return BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS.map(preset => preset.id);
    if (presetKey === STORAGE_KEY_PRESETS) return ['default'];
    if (presetKey === STORAGE_KEY_REGEX_PRESETS) return ['regex_default'];
    return [];
  };

  const getDiceConfigBackupKnownPresetIds = (presetKey: string): Set<string> => {
    const result = new Set(getDiceConfigBackupBuiltinPresetIds(presetKey));
    const stored = Store.get(presetKey, []);
    if (Array.isArray(stored)) {
      stored.forEach(item => {
        const preset =
          presetKey === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS
            ? isDiceConfigBackupRecord(item) &&
              getDiceConfigBackupPresetRecordId(item) &&
              item.builtin !== true
              ? normalizeTableTemplateRequirementPreset(item, getDiceConfigBackupPresetRecordId(item))
              : null
            : isDiceConfigBackupRecord(item)
              ? item
              : null;
        if (!preset || !isDiceConfigBackupRecord(preset)) return;
        const id = getDiceConfigBackupPresetRecordId(preset);
        if (id && preset.builtin !== true && !getDiceConfigBackupBuiltinPresetIds(presetKey).includes(id)) result.add(id);
      });
    }
    return result;
  };

  const setDiceConfigBackupValue = (key: string, value: unknown): void => {
    if (getDiceConfigBackupKeyStrategy(key) === 'rawString') {
      localStorage.setItem(key, String(value ?? ''));
      return;
    }
    if (!Store.set(key, value)) throw new Error(`存储项 ${key} 保存失败`);
  };

  const applyDiceConfigBackupValue = createApplyDiceConfigBackupValue({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
    getDiceConfigBackupRuleRecords: (...a: any[]) => getDiceConfigBackupRuleRecords(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    isDiceConfigBackupSameValue: (...a: any[]) => isDiceConfigBackupSameValue(...a),
    mergeDiceConfigBackupCustomOnlyPresetArray: (...a: any[]) => mergeDiceConfigBackupCustomOnlyPresetArray(...a),
    mergeDiceConfigBackupCustomRules: (...a: any[]) => mergeDiceConfigBackupCustomRules(...a),
    mergeDiceConfigBackupGachaItemSettings: (...a: any[]) => mergeDiceConfigBackupGachaItemSettings(...a),
    mergeDiceConfigBackupGachaPoolSettings: (...a: any[]) => mergeDiceConfigBackupGachaPoolSettings(...a),
    mergeDiceConfigBackupPresetArray: (...a: any[]) => mergeDiceConfigBackupPresetArray(...a),
    mergeDiceConfigBackupPresetArraySafely: (...a: any[]) => mergeDiceConfigBackupPresetArraySafely(...a),
    mergeDiceConfigBackupRegexRules: (...a: any[]) => mergeDiceConfigBackupRegexRules(...a),
    mergeDiceConfigBackupSetArray: (...a: any[]) => mergeDiceConfigBackupSetArray(...a),
    sanitizeDiceConfigBackupStoredValue: (...a: any[]) => sanitizeDiceConfigBackupStoredValue(...a),
    sanitizeDiceConfigBackupValidationRule: (...a: any[]) => sanitizeDiceConfigBackupValidationRule(...a),
    setDiceConfigBackupValue: (...a: any[]) => setDiceConfigBackupValue(...a),
    BUILTIN_VALIDATION_RULES: BUILTIN_VALIDATION_RULES,
    STORAGE_KEY_PRESETS: STORAGE_KEY_PRESETS,
    STORAGE_KEY_REGEX_PRESETS: STORAGE_KEY_REGEX_PRESETS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS: STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    STORAGE_KEY_VALIDATION_RULES: STORAGE_KEY_VALIDATION_RULES,
  });

  const applyDiceConfigBackupActiveValue = (
    write: DiceConfigBackupPendingActiveWrite,
    stats: DiceConfigBackupApplyStats,
    idMappings: Map<string, Map<string, string>>,
  ): void => {
    const presetKey = DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY[write.key];
    if (!presetKey) {
      applyDiceConfigBackupValue(write.key, write.value, write.moduleName, stats, idMappings);
      return;
    }

    if (write.value === null && write.key === STORAGE_KEY_ACTIVE_ADVANCED_PRESET) {
      applyDiceConfigBackupValue(write.key, null, write.moduleName, stats, idMappings);
      return;
    }

    if (typeof write.value !== 'string' && typeof write.value !== 'number') {
      stats.skipped += 1;
      stats.warnings.push(`${write.moduleName}: ${write.key} 不是有效的预设 ID，已保留当前值。`);
      return;
    }

    const sourceId = String(write.value).trim();
    if (!sourceId) {
      stats.skipped += 1;
      stats.warnings.push(`${write.moduleName}: ${write.key} 为空，已保留当前值。`);
      return;
    }

    const mappedId = idMappings.get(presetKey)?.get(sourceId) || sourceId;
    const isCustomAdvanced = write.key === STORAGE_KEY_LAST_PRESET && mappedId === CUSTOM_ROLL_MODE.id;
    if (!isCustomAdvanced && !getDiceConfigBackupKnownPresetIds(presetKey).has(mappedId)) {
      stats.skipped += 1;
      stats.warnings.push(`${write.moduleName}: 预设 ID "${sourceId}" 不存在，已保留当前激活项。`);
      return;
    }

    applyDiceConfigBackupValue(write.key, mappedId, write.moduleName, stats, idMappings);
  };

  const normalizeDiceConfigBackupGachaCatalogItems = createNormalizeDiceConfigBackupGachaCatalogItems({
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeImportedGachaItem: (...a: any[]) => normalizeImportedGachaItem(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
  });

  const normalizeDiceConfigBackupGachaCatalogResourceRecord = (
    rawRecord: unknown,
    warnings: string[],
    rawData?: unknown,
  ): GachaCatalogRecord | null => {
    if (!isDiceConfigBackupRecord(rawRecord)) {
      warnings.push('骰子商城配置与自定义物品: 存在无效的自定义目录记录，已跳过。');
      return null;
    }
    const scopeKey = String(rawRecord.scopeKey || '').trim();
    if (!scopeKey) {
      warnings.push('骰子商城配置与自定义物品: 存在缺少 scopeKey 的自定义目录记录，已跳过。');
      return null;
    }
    if (!Array.isArray(rawRecord.items)) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 的自定义物品不是数组，已跳过。`);
      return null;
    }
    const items = normalizeDiceConfigBackupGachaCatalogItems(rawRecord.items, warnings, scopeKey, rawData);
    if (items.length === 0) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 没有有效自定义物品，已跳过。`);
      return null;
    }
    return {
      scopeKey,
      version: Number(rawRecord.version) || GACHA_CATALOG_VERSION,
      items,
      updatedAt: Math.max(0, Number(rawRecord.updatedAt) || 0),
    };
  };

  const getDiceConfigBackupGachaItemNameKey = (item: Pick<GachaItemDefinition, 'name' | 'type' | 'quality'>): string =>
    `${String(item.name || '').trim()}|${String(item.type || '').trim()}|${String(item.quality || '').trim()}`.toLowerCase();

  const mergeDiceConfigBackupGachaCatalogItems = createMergeDiceConfigBackupGachaCatalogItems({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    getDiceConfigBackupGachaItemNameKey: (...a: any[]) => getDiceConfigBackupGachaItemNameKey(...a),
  });

  const getDiceConfigBackupTableTemplateRollbackSnapshot = (): DiceConfigBackupTableTemplateRollbackSnapshot => {
    const api = getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.getTableTemplate !== 'function') {
      return { warning: '当前数据库表格模板: 数据库模板读取 API 不可用，已取消恢复以避免无法回滚。' };
    }
    try {
      const template = api.getTableTemplate();
      if (!isDiceConfigBackupRecord(template)) {
        return { warning: '当前数据库表格模板: 恢复前没有可用模板快照，已取消恢复以避免无法回滚。' };
      }
      return { template: cloneDiceConfigBackupValue(template) };
    } catch (error) {
      console.warn('[DICE]配置备份读取数据库表格模板回滚快照失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      return { warning: `当前数据库表格模板: 读取回滚快照失败，已取消恢复：${message}` };
    }
  };

  const restoreDiceConfigBackupTableTemplateRollbackSnapshot = async (snapshot: unknown): Promise<string[]> => {
    const warnings: string[] = [];
    const template =
      isDiceConfigBackupRecord(snapshot) && 'template' in snapshot
        ? (snapshot as DiceConfigBackupTableTemplateRollbackSnapshot).template
        : snapshot;
    if (!isDiceConfigBackupRecord(template)) {
      warnings.push('当前数据库表格模板: 恢复前没有可用模板快照，无法自动撤回已导入的模板。');
      return warnings;
    }
    const api = getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.importTemplateFromData !== 'function') {
      warnings.push('当前数据库表格模板: 数据库模板导入 API 不可用，无法自动回滚模板。');
      return warnings;
    }
    try {
      const result = await Promise.resolve(api.importTemplateFromData(cloneDiceConfigBackupValue(template), { scope: 'chat' }));
      if (isDiceConfigBackupRecord(result) && result.success === false) {
        const message = typeof result.message === 'string' ? result.message : '未知错误';
        warnings.push(`当前数据库表格模板: 回滚失败：${message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      warnings.push(`当前数据库表格模板: 回滚异常：${message}`);
    }
    warnings.forEach(warning => console.warn('[DICE]配置备份回滚数据库表格模板提示:', warning));
    return warnings;
  };

  const restoreDiceConfigBackupGachaCatalogRecords = createRestoreDiceConfigBackupGachaCatalogRecords({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    mergeDiceConfigBackupGachaCatalogItems: (...a: any[]) => mergeDiceConfigBackupGachaCatalogItems(...a),
    mergeGachaCatalogRecordsToGlobalScope: (...a: any[]) => mergeGachaCatalogRecordsToGlobalScope(...a),
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
  });

  const restoreDiceConfigBackupTableTemplate = async (
    templateValue: unknown,
    stats: DiceConfigBackupApplyStats,
    onImportAttempt?: () => void,
  ): Promise<void> => {
    if (templateValue === undefined) {
      stats.skipped += 1;
      stats.warnings.push('当前数据库表格模板: 备份文件中没有模板内容，已跳过。');
      return;
    }
    if (!isDiceConfigBackupRecord(templateValue)) {
      stats.skipped += 1;
      stats.warnings.push('当前数据库表格模板: 模板资源结构无效，已跳过。');
      return;
    }

    const api = getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.importTemplateFromData !== 'function') {
      throw new Error('数据库模板导入 API 不可用，无法恢复表格模板。');
    }

    const template = cloneDiceConfigBackupValue(templateValue);
    onImportAttempt?.();
    const result = await Promise.resolve(api.importTemplateFromData(template, { scope: 'chat' }));
    if (isDiceConfigBackupRecord(result) && result.success === false) {
      const message = typeof result.message === 'string' ? result.message : '数据库模板导入失败';
      throw new Error(message);
    }
    console.info('[DICE]配置备份已调用数据库本体 API 导入表格模板:', result);
    stats.added += 1;
  };

  const restoreDiceConfigBackupModuleResources = async (
    moduleId: DiceConfigBackupModuleId,
    payload: DiceConfigBackupModulePayload,
    stats: DiceConfigBackupApplyStats,
    options: {
      gachaItemIdMap?: Map<string, string>;
      onTableTemplateImportAttempt?: () => void;
      rawData?: unknown;
    } = {},
  ): Promise<void> => {
    if (moduleId === 'tableTemplate') {
      await restoreDiceConfigBackupTableTemplate(
        payload.resources?.[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY],
        stats,
        options.onTableTemplateImportAttempt,
      );
      return;
    }
    if (moduleId !== 'gachaSettings') return;
    await restoreDiceConfigBackupGachaCatalogRecords(
      payload.resources?.[DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY],
      stats,
      options.gachaItemIdMap,
      options.rawData,
    );
  };

  const restoreDiceConfigBackupGachaCatalogSnapshot = async (
    snapshot: DiceConfigBackupGachaCatalogRollbackSnapshot | null,
  ): Promise<string[]> => {
    const warnings: string[] = [];
    if (!snapshot) return warnings;
    if (!snapshot.records) {
      warnings.push(snapshot.warning || '骰子商城配置与自定义物品: 恢复前没有可用回滚快照，无法自动撤回已导入的目录。');
      return warnings;
    }
    const restored = await GachaCatalogDB.replaceAll(snapshot.records.map(record => cloneDiceConfigBackupValue(record)));
    if (!restored) {
      warnings.push('骰子商城配置与自定义物品: 回滚 IndexedDB 目录失败，可能残留部分导入内容。');
      return warnings;
    }
    gachaCatalogCache = null;
    gachaCatalogLoadTask = null;
    return warnings;
  };

  const syncDiceConfigBackupRuntimeAfterRestore = createSyncDiceConfigBackupRuntimeAfterRestore({
    applyConfigStyles: (...a: any[]) => applyConfigStyles(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    ActionPresetManager: ActionPresetManager,
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    AttributePresetManager: AttributePresetManager,
    AvatarManager: AvatarManager,
    DashboardPresetManager: DashboardPresetManager,
    PresetManager: PresetManager,
    RegexPresetManager: RegexPresetManager,
    RegexTransformationManager: RegexTransformationManager,
    RenderPresetManager: RenderPresetManager,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
    ValidationRuleManager: ValidationRuleManager,
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
    getDashboardRuntimeConfigCache: () => dashboardRuntimeConfigCache,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache = v; },
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask = v; },
    getIsSettingsOpen: () => isSettingsOpen,
    setIsSettingsOpen: (v: any) => { isSettingsOpen = v; },
  });

  const applyDiceConfigBackup = createApplyDiceConfigBackup({
    applyDiceConfigBackupActiveValue: (...a: any[]) => applyDiceConfigBackupActiveValue(...a),
    applyDiceConfigBackupValue: (...a: any[]) => applyDiceConfigBackupValue(...a),
    collectDiceConfigBackupGachaCatalogRollbackSnapshot: (...a: any[]) => collectDiceConfigBackupGachaCatalogRollbackSnapshot(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupTableTemplateRollbackSnapshot: (...a: any[]) => getDiceConfigBackupTableTemplateRollbackSnapshot(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hasDiceConfigBackupTableTemplateResource: (...a: any[]) => hasDiceConfigBackupTableTemplateResource(...a),
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
    remapDiceConfigBackupGachaItemSettings: (...a: any[]) => remapDiceConfigBackupGachaItemSettings(...a),
    restoreDiceConfigBackupGachaCatalogSnapshot: (...a: any[]) => restoreDiceConfigBackupGachaCatalogSnapshot(...a),
    restoreDiceConfigBackupModuleResources: (...a: any[]) => restoreDiceConfigBackupModuleResources(...a),
    restoreDiceConfigBackupTableTemplateRollbackSnapshot: (...a: any[]) => restoreDiceConfigBackupTableTemplateRollbackSnapshot(...a),
    syncDiceConfigBackupRuntimeAfterRestore: (...a: any[]) => syncDiceConfigBackupRuntimeAfterRestore(...a),
    DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY: DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY,
    DICE_CONFIG_BACKUP_FORMAT: DICE_CONFIG_BACKUP_FORMAT,
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_SCHEMA_VERSION: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

  const getAllDiceConfigBackupModuleIds = (): DiceConfigBackupModuleId[] =>
    DICE_CONFIG_BACKUP_MODULES.map(module => module.id);

  const normalizeDiceProfileModuleIds = (
    moduleIds: readonly string[] | undefined,
    backup?: DiceConfigBackupDocument,
  ): DiceConfigBackupModuleId[] => {
    const normalized = normalizeDiceConfigBackupSelectedModuleIds(moduleIds || []);
    const available = backup ? getDiceConfigBackupAvailableModuleIds(backup) : getAllDiceConfigBackupModuleIds();
    const availableSet = new Set(available);
    const filtered = normalized.filter(moduleId => availableSet.has(moduleId));
    return filtered.length > 0 ? filtered : available;
  };

  const getDiceProfileModuleNames = (moduleIds: readonly DiceConfigBackupModuleId[]): string =>
    moduleIds
      .map(moduleId => getDiceConfigBackupModuleDefinition(moduleId)?.name || moduleId)
      .join('、');

  const toDiceProfileSummary = (record: DiceProfileRecord): DiceProfileSummary => ({
    id: record.id,
    name: record.name,
    source: record.source,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    moduleIds: record.moduleIds,
    fingerprint: record.fingerprint,
    ...(record.lastAppliedAt ? { lastAppliedAt: record.lastAppliedAt } : {}),
  });

  const createDiceProfileRuntimeId = (prefix = 'profile'): string =>
    `acu_${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const getDiceProfileIndex = (): DiceProfileSummary[] => {
    const stored = Store.get(DICE_PROFILE_INDEX_STORAGE_KEY, []);
    return Array.isArray(stored) ? stored.filter(item => isDiceConfigBackupRecord(item)) : [];
  };

  const saveDiceProfileIndex = (summaries: readonly DiceProfileSummary[]): boolean =>
    Store.set(
      DICE_PROFILE_INDEX_STORAGE_KEY,
      summaries
        .map(summary => cloneDiceConfigBackupValue(summary))
        .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || ''))),
    );


  const refreshDiceProfileIndex = async (): Promise<DiceProfileSummary[]> => {
    try {
      const records = await DiceProfileDB.getAll();
      const summaries = records.map(toDiceProfileSummary);
      saveDiceProfileIndex(summaries);
      return summaries;
    } catch (error) {
      console.warn('[DICE][PROFILE]Profile 索引刷新失败，使用本地索引兜底:', error);
      return getDiceProfileIndex();
    }
  };

  const getDiceProfileRecords = async (): Promise<DiceProfileRecord[]> => {
    try {
      const records = await DiceProfileDB.getAll();
      saveDiceProfileIndex(records.map(toDiceProfileSummary));
      return records;
    } catch (error) {
      console.warn('[DICE][PROFILE]读取配置方案库失败:', error);
      return [];
    }
  };

  const normalizeDiceProfileRecord = (
    value: unknown,
    options: NormalizeAcuDiceProfileOptions = {},
  ): DiceProfileRecord => {
    const profilePackage = normalizeAcuDiceProfilePackage<DiceConfigBackupDocument>(value, options);
    const backup = parseDiceConfigBackup(JSON.stringify(profilePackage.backup)).backup;
    const moduleIds = normalizeDiceProfileModuleIds(profilePackage.moduleIds, backup);
    const fingerprint = computeAcuDiceProfileFingerprint(backup, moduleIds);
    const now = options.now || new Date().toISOString();
    return {
      ...profilePackage,
      format: ACU_DICE_PROFILE_FORMAT,
      id: profilePackage.id || `acu_profile_${fingerprint.slice(0, 12)}`,
      source: normalizeAcuDiceProfileSource(profilePackage.source),
      backup,
      moduleIds,
      fingerprint,
      updatedAt: now,
      savedAt: now,
    };
  };

  const parseDiceProfileInput = (
    input: unknown,
    options: NormalizeAcuDiceProfileOptions = {},
  ): DiceProfileRecord => {
    if (typeof input !== 'string') return normalizeDiceProfileRecord(input, options);
    const text = input.trim();
    const marker = extractAcuDiceProfileMarkerPayloads(text)[0];
    if (marker) {
      const decoded = decodeAcuDiceProfileMarkerPayload(marker.payload);
      return normalizeDiceProfileRecord(JSON.parse(decoded), options);
    }
    const parsed = parseJsoncDocument({
      text,
      emptyMessage: '配置方案文件内容为空',
      invalidJsonMessage: '配置方案文件不是有效的 JSON/JSONC',
      validate: value => {
        if (!isDiceConfigBackupRecord(value)) throw new Error('配置方案文件结构无效');
        return value;
      },
    });
    return normalizeDiceProfileRecord(parsed, options);
  };

  const saveDiceProfileRecord = async (record: DiceProfileRecord): Promise<DiceProfileRecord> => {
    const saved = await DiceProfileDB.put(record);
    if (!saved) throw new Error('配置方案保存失败，IndexedDB 写入未完成');
    await refreshDiceProfileIndex();
    return record;
  };

  const upsertDiceProfileRecord = async (record: DiceProfileRecord): Promise<DiceProfileRecord> => {
    const records = await getDiceProfileRecords();
    const sourceKey = getAcuDiceProfileSourceKey(record.source);
    const shouldUpdateSameSource =
      record.source?.type === 'character' || record.source?.type === 'character_card';
    const existing = shouldUpdateSameSource
      ? records.find(
          item => item.fingerprint === record.fingerprint && getAcuDiceProfileSourceKey(item.source) === sourceKey,
        )
      : null;
    const now = new Date().toISOString();
    const next = existing
      ? {
          ...record,
          id: existing.id,
          createdAt: existing.createdAt,
          lastAppliedAt: existing.lastAppliedAt,
          savedAt: now,
          updatedAt: now,
        }
      : record;
    return await saveDiceProfileRecord(next);
  };

  const deleteDiceProfileRecord = async (profileId: string): Promise<boolean> => {
    const deleted = await DiceProfileDB.delete(profileId);
    await refreshDiceProfileIndex();
    return deleted;
  };

  const importDiceProfile = async (input: unknown, options: DiceProfileImportOptions = {}): Promise<DiceProfileRecord> => {
    const record = parseDiceProfileInput(input, {
      name: options.name,
      source: options.source || { type: 'imported' },
    });
    const saved = await upsertDiceProfileRecord(record);
    if (options.apply) {
      await applyDiceProfile(saved.id, { createSnapshot: true, confirm: true });
    }
    return saved;
  };

  const saveCurrentDiceProfile = async (
    options: DiceProfileSaveCurrentOptions = {},
  ): Promise<DiceProfileRecord> => {
    const moduleIds = normalizeDiceProfileModuleIds(options.moduleIds, undefined);
    const backup = await buildDiceConfigBackup(moduleIds);
    const now = new Date().toISOString();
    const record = normalizeDiceProfileRecord(
      {
        format: ACU_DICE_PROFILE_FORMAT,
        id: createDiceProfileRuntimeId(options.source?.type === 'snapshot' ? 'snapshot' : 'profile'),
        name: options.name || `骰子系统配置方案 ${now.slice(0, 10)}`,
        source: options.source || { type: 'user' },
        createdAt: now,
        updatedAt: now,
        moduleIds,
        backup,
      },
      { now, source: options.source || { type: 'user' } },
    );
    return await upsertDiceProfileRecord(record);
  };

  const createDiceProfilePreApplySnapshot = async (sourceProfile?: DiceProfileRecord | null): Promise<DiceProfileRecord> => {
    const now = new Date().toISOString();
    const snapshot = await saveCurrentDiceProfile({
      name: `快照 ${now.replace('T', ' ').slice(0, 16)}`,
      moduleIds: getAllDiceConfigBackupModuleIds(),
      source: {
        type: 'snapshot',
        profileId: sourceProfile?.id,
        label: sourceProfile?.name || '手动应用',
      },
    });
    const records = await getDiceProfileRecords();
    const snapshots = records
      .filter(record => record.source?.type === 'snapshot')
      .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')));
    await Promise.all(snapshots.slice(DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT).map(record => deleteDiceProfileRecord(record.id)));
    return snapshot;
  };

  const renderDiceProfileApplyConfirmDetailHtml = createRenderDiceProfileApplyConfirmDetailHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
  });

  const showDiceProfileApplyConfirm = async (
    profile: DiceProfileRecord,
    moduleIds: readonly DiceConfigBackupModuleId[],
  ): Promise<boolean> => {
    const allWarnings = getDiceConfigBackupRestoreWarnings(profile.backup, [], moduleIds);
    return showDiceSystemConfirmDialog({
      title: '应用配置方案',
      message: `应用「${profile.name}」？`,
      detailHtml: renderDiceProfileApplyConfirmDetailHtml(moduleIds, allWarnings),
      iconClass: 'fa-layer-group',
      confirmText: '应用配置方案',
      cancelText: '取消',
      tone: 'warning',
    });
  };

  const applyDiceProfile = async (
    profileId: string,
    options: DiceProfileApplyOptions = {},
  ): Promise<DiceConfigBackupApplyStats> => {
    const profile = await DiceProfileDB.get(profileId);
    if (!profile) throw new Error('未找到配置方案');
    const moduleIds = normalizeDiceProfileModuleIds(options.moduleIds || profile.moduleIds, profile.backup);
    if (options.confirm) {
      const confirmed = await showDiceProfileApplyConfirm(profile, moduleIds);
      if (!confirmed) throw new Error('已取消应用配置方案');
    }
    if (options.createSnapshot !== false) {
      await createDiceProfilePreApplySnapshot(profile);
    }
    const stats = await applyDiceConfigBackup(profile.backup, moduleIds);
    const appliedAt = new Date().toISOString();
    const nextProfile = { ...profile, lastAppliedAt: appliedAt, savedAt: appliedAt, updatedAt: appliedAt };
    await saveDiceProfileRecord(nextProfile);
    Store.set(DICE_PROFILE_LAST_APPLIED_STORAGE_KEY, {
      id: profile.id,
      name: profile.name,
      fingerprint: profile.fingerprint,
      appliedAt,
    });
    return stats;
  };

  const exportDiceProfile = async (profileId: string): Promise<DiceProfileRecord> => {
    const profile = await DiceProfileDB.get(profileId);
    if (!profile) throw new Error('未找到配置方案');
    return profile;
  };

  const downloadDiceProfileJson = (profile: DiceProfileRecord): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = String(profile.name || 'acu_dice_profile').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60);
    downloadJsonFile(JSON.stringify(profile, null, 2), `${safeName}_${timestamp}.json`);
  };

  const createDiceProfileRegexId = (): string => {
    const randomUUID = globalThis.crypto?.randomUUID;
    return typeof randomUUID === 'function'
      ? randomUUID.call(globalThis.crypto)
      : createDiceProfileRuntimeId('character_profile_regex');
  };

  const createDiceProfileTavernRegexReplaceString = (profile: DiceProfileRecord): string =>
    [
      `<!-- 骰子系统配置注入：此角色卡正则只用于携带「${profile.name || '配置方案'}」，请勿删除下一行 ACUDICE_PROFILE_V1 标记。 -->`,
      createAcuDiceProfileMarker(profile),
    ].join('\n');

  const createDiceProfileTavernRegex = (profile: DiceProfileRecord): Record<string, unknown> => ({
    id: createDiceProfileRegexId(),
    scriptName: `骰子系统配置注入 - ${profile.name || '角色卡内置方案'}`,
    findRegex: '/$^/',
    replaceString: createDiceProfileTavernRegexReplaceString(profile),
    trimStrings: [],
    placement: [2],
    disabled: true,
    markdownOnly: true,
    promptOnly: false,
    runOnEdit: false,
    substituteRegex: 0,
    minDepth: null,
    maxDepth: 0,
  });

  const downloadDiceProfileTavernRegex = (profile: DiceProfileRecord): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = String(profile.name || 'acu_dice_profile').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60);
    downloadJsonFile(
      JSON.stringify(createDiceProfileTavernRegex(profile), null, 2),
      `${safeName}_角色卡内置方案正则_${timestamp}.json`,
    );
  };

  const getDiceProfilePromptStates = (): Record<string, 'skipped' | 'applied' | 'saved'> => {
    const stored = Store.get(DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, {});
    return isDiceConfigBackupRecord(stored) ? stored : {};
  };

  const setDiceProfilePromptState = (
    chatId: string,
    fingerprint: string,
    state: 'skipped' | 'applied' | 'saved',
  ): void => {
    const states = getDiceProfilePromptStates();
    states[getAcuDiceProfilePromptKey(chatId, fingerprint)] = state;
    Store.set(DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, states);
  };

  const getDiceProfilePromptState = (
    chatId: string,
    fingerprint: string,
  ): 'skipped' | 'applied' | 'saved' | null => {
    const states = getDiceProfilePromptStates();
    return states[getAcuDiceProfilePromptKey(chatId, fingerprint)] || null;
  };

  const getDiceProfileSillyTavern = (): any => window.SillyTavern || window.parent?.SillyTavern || null;

  const getDiceProfileCharacterContext = (): {
    chatId: string;
    characterId: string;
    characterName: string;
    fields: Record<string, unknown> | null;
  } => {
    const statsContext = getDiceStatsContext();
    const ST = getDiceProfileSillyTavern();
    let fields: Record<string, unknown> | null = null;
    try {
      const rawFields = ST?.getCharacterCardFields?.({});
      if (isDiceConfigBackupRecord(rawFields)) fields = rawFields;
    } catch {
      // ignore
    }
    let characterName =
      getDiceConfigBackupRecordString(fields || {}, 'name') ||
      getDiceConfigBackupRecordString((fields?.data as Record<string, unknown>) || {}, 'name');
    try {
      if (!characterName && typeof getCharData === 'function') {
        const currentChar = getCharData('current', true);
        characterName = String(currentChar?.name || currentChar?.avatar || '').trim();
      }
    } catch {
      // ignore
    }
    if (!characterName) characterName = statsContext.characterId;
    return {
      chatId: statsContext.chatId,
      characterId: statsContext.characterId,
      characterName: characterName || '未知角色卡',
      fields,
    };
  };

  const getDiceProfileCurrentCharacterRecords = createGetDiceProfileCurrentCharacterRecords({
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
    getDiceProfileSillyTavern: (...a: any[]) => getDiceProfileSillyTavern(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const collectDiceProfileRegexScriptsFromRecord = (record: Record<string, unknown>): unknown[] => {
    const scripts: unknown[] = [];
    const pushScripts = (value: unknown): void => {
      if (Array.isArray(value)) scripts.push(...value);
    };
    const data = isDiceConfigBackupRecord(record.data) ? record.data : null;
    const extensions = isDiceConfigBackupRecord(record.extensions) ? record.extensions : null;
    const dataExtensions = isDiceConfigBackupRecord(data?.extensions) ? data.extensions : null;
    pushScripts(record.regex_scripts);
    pushScripts(extensions?.regex_scripts);
    pushScripts(dataExtensions?.regex_scripts);

    try {
      const RawCharacterCtor =
        (globalThis as Record<string, any>).RawCharacter ||
        (window as unknown as Record<string, any>).RawCharacter ||
        (window.parent as unknown as Record<string, any>).RawCharacter;
      if (typeof RawCharacterCtor === 'function') {
        const rawCharacter = new RawCharacterCtor(record);
        if (rawCharacter && typeof rawCharacter.getRegexScripts === 'function') pushScripts(rawCharacter.getRegexScripts());
      }
    } catch {
      // ignore
    }

    return scripts;
  };

  const collectDiceCharacterProfileTexts = (): Array<{ kind: DiceCharacterProfileDetection['sourceTextKind']; text: string }> => {
    const ST = getDiceProfileSillyTavern();
    const context = getDiceProfileCharacterContext();
    const result: Array<{ kind: DiceCharacterProfileDetection['sourceTextKind']; text: string }> = [];
    const seenTexts = new Set<string>();
    const pushText = (kind: DiceCharacterProfileDetection['sourceTextKind'], text: unknown): void => {
      const cleanText = typeof text === 'string' || typeof text === 'number' ? String(text).trim() : '';
      if (!cleanText || seenTexts.has(cleanText)) return;
      seenTexts.add(cleanText);
      result.push({ kind, text: cleanText });
    };

    const chat = ST?.chat || window.parent?.SillyTavern?.chat;
    const firstMessage = Array.isArray(chat) ? chat.find(message => message && !message.is_user) : null;
    pushText('message', firstMessage?.mes);

    getDiceProfileCurrentCharacterRecords().forEach(record => {
      const data = isDiceConfigBackupRecord(record.data) ? record.data : {};
      pushText('first_mes', getDiceConfigBackupRecordString(record, 'first_mes'));
      pushText('first_mes', getDiceConfigBackupRecordString(data, 'first_mes'));
      collectDiceProfileRegexScriptsFromRecord(record).forEach(script => {
        if (!isDiceConfigBackupRecord(script)) return;
        pushText('regex', getDiceConfigBackupRecordString(script, 'replaceString'));
      });
    });
    return result;
  };

  const detectCharacterDiceProfile = async (options: { includeSkipped?: boolean } = {}): Promise<DiceCharacterProfileDetection | null> => {
    const context = getDiceProfileCharacterContext();
    const texts = collectDiceCharacterProfileTexts();
    for (const item of texts) {
      const marker = extractAcuDiceProfileMarkerPayloads(item.text)[0];
      if (!marker) continue;
      const source: AcuDiceProfileSource = {
        type: 'character_card',
        characterName: context.characterName,
        characterId: context.characterId,
        chatId: context.chatId,
      };
      const decoded = decodeAcuDiceProfileMarkerPayload(marker.payload);
      const profile = normalizeDiceProfileRecord(JSON.parse(decoded), {
        source,
        name: `${context.characterName}配置方案`,
      });
      const promptState = getDiceProfilePromptState(context.chatId, profile.fingerprint);
      if (!options.includeSkipped && promptState) return null;
      const savedProfile = await upsertDiceProfileRecord({ ...profile, source });
      return { profile: savedProfile, sourceTextKind: item.kind };
    }
    return null;
  };

  const showDiceCharacterProfilePrompt = (detection: DiceCharacterProfileDetection): Promise<'apply' | 'save' | 'skip'> => {
    const { $ } = getCore();
    const config = getConfig();
    const profile = detection.profile;
    return new Promise(resolve => {
      $('.acu-profile-prompt-overlay').remove();
      const overlay = $(`
        <div class="acu-profile-prompt-overlay acu-theme-${escapeHtml(config.theme)}" tabindex="-1">
          <div class="acu-profile-prompt-dialog" role="dialog" aria-modal="true">
            <div class="acu-profile-prompt-header">
              <span class="acu-profile-prompt-title"><i class="fa-solid fa-layer-group"></i> 角色卡内置配置方案</span>
              <button type="button" class="acu-profile-prompt-close" title="关闭" aria-label="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="acu-profile-prompt-body">
              <div class="acu-profile-prompt-name">${escapeHtml(profile.name)}</div>
              <div class="acu-profile-prompt-text">检测到当前角色卡携带骰子系统配置方案。它已保存到方案库；应用后会修改当前骰子系统配置。</div>
              <div class="acu-profile-prompt-meta">
                <span>${escapeHtml(profile.source.characterName || '当前角色卡')}</span>
                <span>${escapeHtml(getDiceProfileModuleNames(profile.moduleIds))}</span>
              </div>
            </div>
            <div class="acu-profile-prompt-footer">
              <button type="button" class="acu-setting-action-btn acu-profile-prompt-skip">跳过</button>
              <button type="button" class="acu-setting-action-btn acu-profile-prompt-save">仅保存到库</button>
              <button type="button" class="acu-setting-action-btn acu-config-backup-primary-btn acu-profile-prompt-apply">应用</button>
            </div>
          </div>
        </div>
      `);
      const finish = (action: 'apply' | 'save' | 'skip') => {
        overlay.remove();
        resolve(action);
      };
      $('body').append(overlay);
      setupOverlayClose(overlay, 'acu-profile-prompt-overlay', () => finish('skip'));
      overlay.on('click', '.acu-profile-prompt-close, .acu-profile-prompt-skip', () => finish('skip'));
      overlay.on('click', '.acu-profile-prompt-save', () => finish('save'));
      overlay.on('click', '.acu-profile-prompt-apply', () => finish('apply'));
    });
  };

  const maybePromptCharacterDiceProfile = async (): Promise<void> => {
    try {
      const detection = await detectCharacterDiceProfile();
      if (!detection) return;
      const context = getDiceProfileCharacterContext();
      const action = await showDiceCharacterProfilePrompt(detection);
      if (action === 'skip') {
        setDiceProfilePromptState(context.chatId, detection.profile.fingerprint, 'skipped');
        return;
      }
      if (action === 'save') {
        setDiceProfilePromptState(context.chatId, detection.profile.fingerprint, 'saved');
        window.toastr?.success('已保存角色卡配置方案，可在配置方案与备份中手动应用');
        return;
      }
      await applyDiceProfile(detection.profile.id, { createSnapshot: true, confirm: true });
      setDiceProfilePromptState(context.chatId, detection.profile.fingerprint, 'applied');
      window.toastr?.success(`已应用配置方案：${detection.profile.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== '已取消应用配置方案') {
        console.warn('[DICE][PROFILE]角色卡配置方案检测或应用失败:', error);
        if (window.toastr) showActionableErrorToast(`角色卡配置方案处理失败: ${message}`, { suggestion: 'importExport' });
      }
    }
  };

  const scheduleCharacterDiceProfileDetection = (delay = 800): void => {
    window.setTimeout(() => {
      void maybePromptCharacterDiceProfile();
    }, delay);
  };

  const getDiceConfigBackupAvailableModuleIds = (backup: DiceConfigBackupDocument): DiceConfigBackupModuleId[] =>
    DICE_CONFIG_BACKUP_MODULES.filter(module => {
      const payload = backup.modules[module.id];
      if (!payload) return false;
      if (module.id === 'tableTemplate') return hasDiceConfigBackupTableTemplateResource(payload);
      return (
        hasDiceConfigBackupRecoverableStorage(payload, module) ||
        getDiceConfigBackupModuleResourceCount(payload, module.id) > 0
      );
    }).map(module => module.id);

  const getDiceConfigBackupSelectedModuleIdsFromDialog = (dialog: JQuery): DiceConfigBackupModuleId[] =>
    normalizeDiceConfigBackupSelectedModuleIds(
      dialog
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox:checked')
        .map((_, element) => String(element.value || ''))
        .get(),
    );

  const getDiceConfigBackupRestoreWarnings = (
    backup: DiceConfigBackupDocument,
    warnings: readonly string[],
    moduleIds: readonly DiceConfigBackupModuleId[],
  ): string[] =>
    Array.from(
      new Set([
        ...warnings,
        ...moduleIds.flatMap(moduleId => backup.modules[moduleId]?.warnings || []),
      ]),
    );

  const getDiceConfigBackupModuleCountText = (
    moduleId: DiceConfigBackupModuleId,
    storageCount: number,
    resourceCount: number,
    hasBackupPayload: boolean,
  ): string => {
    if (moduleId === 'tableTemplate' && !hasBackupPayload) return '模板';
    if (storageCount > 0 && resourceCount > 0) return `${storageCount}+${resourceCount} 项`;
    return `${storageCount + resourceCount} 项`;
  };

  const renderDiceConfigBackupModuleRows = (
    moduleIds: readonly DiceConfigBackupModuleId[],
    backup?: DiceConfigBackupDocument,
  ): string => {
    if (moduleIds.length === 0) {
      return '<div class="acu-config-backup-empty">没有可用模块</div>';
    }
    return moduleIds
      .map(moduleId => {
        const definition = getDiceConfigBackupModuleDefinition(moduleId);
        if (!definition) return '';
        const payload = backup?.modules[moduleId];
        const storageCount = payload ? Object.keys(payload.storage).length : definition.storageKeys.length;
        const resourceCount = getDiceConfigBackupModuleResourceCount(payload, moduleId);
        const countText = getDiceConfigBackupModuleCountText(moduleId, storageCount, resourceCount, Boolean(payload));
        const deprecatedBadgeHtml =
          definition.deprecated && definition.deprecatedReason
            ? renderDeprecatedBadge(definition.deprecatedReason)
            : '';
        const warningHtml =
          payload?.warnings && payload.warnings.length > 0
            ? `<div class="acu-config-backup-module-warning">${payload.warnings
                .map(warning => `<div><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(warning)}</div>`)
                .join('')}</div>`
            : '';
        return `
          <label class="acu-config-backup-module-row">
            <input type="checkbox" class="acu-config-backup-module-checkbox" value="${escapeHtml(moduleId)}" checked>
            <span class="acu-config-backup-module-main">
              <span class="acu-config-backup-module-title-row">
                <strong class="acu-config-backup-module-name">${escapeHtml(definition.name)}</strong>
                ${deprecatedBadgeHtml}
                <span class="acu-config-backup-module-count">${escapeHtml(countText)}</span>
              </span>
              <span class="acu-config-backup-module-desc">${escapeHtml(definition.description)}</span>
              ${warningHtml}
            </span>
          </label>`;
      })
      .join('');
  };

  const renderDiceConfigBackupWarningList = (warnings: readonly string[]): string => {
    if (warnings.length === 0) return '';
    return `
      <div class="acu-config-backup-warning-list">
        ${warnings.map(warning => `<div><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(warning)}</div>`).join('')}
      </div>`;
  };

  const renderDiceConfigBackupWarningSlot = (warnings: readonly string[]): string =>
    `<div class="acu-config-backup-warning-slot">${renderDiceConfigBackupWarningList(warnings)}</div>`;

  const renderDiceConfigBackupPrivacyNotice = (mode: 'export' | 'restore'): string => {
    const title = mode === 'export' ? '公开分享前请检查备份文件' : '恢复前请确认备份来源可信';
    const message =
      mode === 'export'
        ? '备份文件可能包含{{user}}别名等隐私内容。'
        : '外来备份会合并或覆盖本地配置，可能启用对方的表格正则、验证规则、各类骰子系统预设、头像部分可能访问外链资源。';
    return `
      <div class="acu-config-backup-privacy-notice">
        <i class="fa-solid fa-user-shield acu-config-backup-privacy-icon"></i>
        <span class="acu-config-backup-privacy-text">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(message)}</span>
        </span>
      </div>`;
  };

  const renderDiceConfigBackupExportBody = (): string => `
    <div class="acu-config-backup-content">
      ${renderDiceConfigBackupPrivacyNotice('export')}
      <div class="acu-config-backup-section-head">
        <div class="acu-config-backup-section-title">选择要导出的配置模块</div>
        <div class="acu-config-backup-selection-actions">
          <button type="button" class="acu-config-backup-select-all acu-setting-action-btn acu-config-backup-mini-btn">全选</button>
          <button type="button" class="acu-config-backup-invert acu-setting-action-btn acu-config-backup-mini-btn">反选</button>
          <button type="button" class="acu-config-backup-clear acu-setting-action-btn acu-config-backup-mini-btn">清空选择</button>
        </div>
      </div>
      <div class="acu-config-backup-module-list">
        ${renderDiceConfigBackupModuleRows(DICE_CONFIG_BACKUP_MODULES.map(module => module.id))}
      </div>
    </div>`;

  const renderDiceConfigBackupRestoreBody = (backup: DiceConfigBackupDocument, warnings: readonly string[]): string => {
    const moduleIds = getDiceConfigBackupAvailableModuleIds(backup);
    const allWarnings = getDiceConfigBackupRestoreWarnings(backup, warnings, moduleIds);
    const storageKeyCount = moduleIds.reduce(
      (count, moduleId) => count + Object.keys(backup.modules[moduleId]?.storage || {}).length,
      0,
    );
    const resourceCount = moduleIds.reduce(
      (count, moduleId) => count + getDiceConfigBackupModuleResourceCount(backup.modules[moduleId], moduleId),
      0,
    );
    const itemCountText =
      storageKeyCount > 0 && resourceCount > 0
        ? `${storageKeyCount} + ${resourceCount}`
        : String(storageKeyCount + resourceCount);
    return `
      <div class="acu-config-backup-content">
        ${renderDiceConfigBackupPrivacyNotice('restore')}
        <div class="acu-config-backup-summary-grid">
          <div class="acu-config-backup-summary-card"><div class="acu-config-backup-summary-label">导出时间</div><div class="acu-config-backup-summary-value">${escapeHtml(backup.exportedAt || '未知')}</div></div>
          <div class="acu-config-backup-summary-card"><div class="acu-config-backup-summary-label">模块</div><div class="acu-config-backup-summary-value">${moduleIds.length} 个</div></div>
          <div class="acu-config-backup-summary-card"><div class="acu-config-backup-summary-label">配置/自定义项</div><div class="acu-config-backup-summary-value">${escapeHtml(itemCountText)} 项</div></div>
        </div>
        ${renderDiceConfigBackupWarningSlot(allWarnings)}
        <div class="acu-config-backup-section-head">
          <div class="acu-config-backup-section-title">选择要恢复的配置模块</div>
          <div class="acu-config-backup-selection-actions">
            <button type="button" class="acu-config-backup-select-all acu-setting-action-btn acu-config-backup-mini-btn">全选</button>
            <button type="button" class="acu-config-backup-invert acu-setting-action-btn acu-config-backup-mini-btn">反选</button>
            <button type="button" class="acu-config-backup-clear acu-setting-action-btn acu-config-backup-mini-btn">清空选择</button>
          </div>
        </div>
        <div class="acu-config-backup-module-list">
          ${renderDiceConfigBackupModuleRows(moduleIds, backup)}
        </div>
      </div>`;
  };

  const downloadDiceConfigBackupJson = (backup: DiceConfigBackupDocument): void => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadJsonFile(JSON.stringify(backup, null, 2), `acu_dice_config_backup_${timestamp}.json`);
  };

  const getDiceProfileCollapsedSections = (): string[] => {
    const stored = Store.get(DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY, ['saveScope']);
    return Array.isArray(stored) ? stored.map(item => String(item)).filter(Boolean) : [];
  };

  const saveDiceProfileCollapsedSections = (sections: readonly string[]): void => {
    Store.set(DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY, Array.from(new Set(sections.map(String).filter(Boolean))));
  };

  const getDiceProfileSourceLabel = (source: AcuDiceProfileSource): string => {
    if (source.type === 'character' || source.type === 'character_card')
      return source.characterName ? `角色卡：${source.characterName}` : '角色卡';
    if (source.type === 'snapshot') return source.label ? `快照：${source.label}` : '快照';
    if (source.type === 'imported') return source.label ? `导入：${source.label}` : '导入';
    return '用户保存';
  };

  const isDiceProfileCharacterSource = (source: AcuDiceProfileSource | undefined): boolean =>
    source?.type === 'character' || source?.type === 'character_card';

  const renderDiceProfileSummaryRow = (summary: DiceProfileSummary, options: { current?: boolean } = {}): string => {
    const sourceLabel = getDiceProfileSourceLabel(summary.source);
    const profileId = escapeHtml(summary.id);
    const profileName = escapeHtml(summary.name);
    const escapedSourceLabel = escapeHtml(sourceLabel);
    const isCharacterProfile = isDiceProfileCharacterSource(summary.source);
    const actionButtons = [
      `<button type="button" class="acu-setting-action-btn acu-profile-action acu-profile-apply-action" data-profile-action="apply" data-profile-id="${profileId}" title="应用" aria-label="应用 ${profileName}"><i class="fa-solid fa-play"></i><span>应用</span></button>`,
      !isCharacterProfile
        ? `<button type="button" class="acu-setting-action-btn acu-profile-action" data-profile-action="rename" data-profile-id="${profileId}" title="重命名" aria-label="重命名 ${profileName}"><i class="fa-solid fa-pen"></i><span>重命名</span></button>`
        : '',
      !isCharacterProfile
        ? `<button type="button" class="acu-setting-action-btn acu-profile-action" data-profile-action="save-as" data-profile-id="${profileId}" title="另存为" aria-label="另存为 ${profileName}"><i class="fa-solid fa-copy"></i><span>另存为</span></button>`
        : '',
      `<button type="button" class="acu-setting-action-btn acu-profile-action" data-profile-action="export" data-profile-id="${profileId}" title="导出" aria-label="导出 ${profileName}"><i class="fa-solid fa-file-export"></i><span>导出</span></button>`,
      `<button type="button" class="acu-setting-action-btn acu-profile-action acu-profile-convert-regex-action" data-profile-action="tavern-regex" data-profile-id="${profileId}" title="转正则" aria-label="把 ${profileName} 转成角色卡正则"><i class="fa-solid fa-code"></i><span>转正则</span></button>`,
      !isCharacterProfile
        ? `<button type="button" class="acu-setting-action-btn acu-profile-action acu-profile-danger" data-profile-action="delete" data-profile-id="${profileId}" title="删除" aria-label="删除 ${profileName}"><i class="fa-solid fa-trash"></i><span>删除</span></button>`
        : '',
    ]
      .filter(Boolean)
      .join('');
    return `
      <div class="acu-profile-row ${options.current ? 'is-current' : ''}" data-profile-id="${profileId}" title="${profileName}（${escapedSourceLabel}）">
        <div class="acu-profile-row-main">
          <div class="acu-profile-row-title">
            <strong>${profileName}</strong>
          </div>
        </div>
        <div class="acu-profile-row-actions">
          ${actionButtons}
        </div>
      </div>`;
  };

  const renderDiceProfileTabPanel = (
    id: 'character' | 'library' | 'snapshots',
    summaries: readonly DiceProfileSummary[],
    emptyText: string,
    options: { active?: boolean; current?: boolean } = {},
  ): string => `
    <section class="acu-profile-tab-panel ${options.active ? 'is-active' : ''}" data-profile-panel="${id}" ${options.active ? '' : 'hidden'}>
      <div class="acu-profile-list">
        ${
          summaries.length > 0
            ? summaries.map(summary => renderDiceProfileSummaryRow(summary, { current: options.current })).join('')
            : `<div class="acu-config-backup-empty acu-profile-empty">${escapeHtml(emptyText)}</div>`
        }
      </div>
    </section>`;

  const renderDiceProfileManagerBody = createRenderDiceProfileManagerBody({
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCollapsedSections: (...a: any[]) => getDiceProfileCollapsedSections(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    renderDiceProfileTabPanel: (...a: any[]) => renderDiceProfileTabPanel(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
    DICE_CONFIG_BACKUP_MODULES: DICE_CONFIG_BACKUP_MODULES,
    DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT: DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT,
  });

  const showDiceConfigBackupDialog = createShowDiceConfigBackupDialog({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDiceConfigBackup: (...a: any[]) => buildDiceConfigBackup(...a),
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
    deleteDiceProfileRecord: (...a: any[]) => deleteDiceProfileRecord(...a),
    downloadDiceConfigBackupJson: (...a: any[]) => downloadDiceConfigBackupJson(...a),
    downloadDiceProfileJson: (...a: any[]) => downloadDiceProfileJson(...a),
    downloadDiceProfileTavernRegex: (...a: any[]) => downloadDiceProfileTavernRegex(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    exportDiceProfile: (...a: any[]) => exportDiceProfile(...a),
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfigBackupSelectedModuleIdsFromDialog: (...a: any[]) => getDiceConfigBackupSelectedModuleIdsFromDialog(...a),
    getDiceConfigBackupWarningCount: (...a: any[]) => getDiceConfigBackupWarningCount(...a),
    getDiceProfileCollapsedSections: (...a: any[]) => getDiceProfileCollapsedSections(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    importDiceProfile: (...a: any[]) => importDiceProfile(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    renderDiceProfileManagerBody: (...a: any[]) => renderDiceProfileManagerBody(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    saveDiceProfileCollapsedSections: (...a: any[]) => saveDiceProfileCollapsedSections(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceConfigBackupPrivacyConfirm: (...a: any[]) => showDiceConfigBackupPrivacyConfirm(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
  });

  let tutorialModule: TutorialModule | null = null;
  const getTutorialModule = (): TutorialModule => {
    if (!tutorialModule) {
      tutorialModule = createTutorialModule({
        getTheme: () => String(getConfig().theme || 'modern'),
        getStore: (key, fallback) => Store.get(key, fallback),
        setStore: (key, value) => Store.set(key, value),
        getDocument: getTavernHostDocument,
        getWindow: getTavernHostWindow,
      });
    }
    return tutorialModule;
  };

  const getTutorialButtonHtml = (scope: TutorialScope, title = '查看本界面教程', extraClass = ''): string =>
    `<button class="acu-view-btn acu-panel-tutorial-btn ${extraClass}" data-tutorial-scope="${scope}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}"><i class="fa-solid fa-circle-question"></i></button>`;

  const isTutorialScope = (value: string): value is TutorialScope => TUTORIAL_SCOPE_LIST.includes(value as TutorialScope);

  let tutorialButtonEventsBound = false;

  const prepareAvatarManagerTutorial = (button: Element): boolean => {
    const { $ } = getCore();
    const $manager = $(button).closest('.acu-avatar-manager');
    if (!$manager.length) return false;

    const $userItem = $manager.find('#acu-avatar-list-container .acu-avatar-user-item').first();
    if (!$userItem.length) return false;

    const $otherExpandedItems = $manager.find('#acu-avatar-list-container .acu-avatar-item.expanded').not($userItem);
    $otherExpandedItems.removeClass('expanded');
    $otherExpandedItems.find('.acu-btn-edit i').removeClass('fa-chevron-up').addClass('fa-pencil');

    if (!$userItem.hasClass('expanded')) {
      const $editButton = $userItem.find('.acu-btn-edit').first();
      if ($editButton.length) {
        $editButton.trigger('click');
      }
      if (!$userItem.hasClass('expanded')) {
        $userItem.addClass('expanded');
        $editButton.find('i').removeClass('fa-pencil').addClass('fa-chevron-up');
      }
    }

    $userItem[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    return true;
  };

  const prepareMvuTutorial = (): boolean => {
    const { $ } = getCore();
    const doc = getTavernHostDocument();
    const $panel = $(doc).find('#acu-data-area .acu-mvu-panel').first();
    if (!$panel.length) return false;

    const isNumericMode = $panel.find('.mvu-numeric-mode').length > 0;
    if (!isNumericMode) {
      try {
        localStorage.setItem('acu_mvu_numeric_mode', 'true');
        renderInterface();
      } catch (error) {
        console.warn('[DICE] MVU 教程切换数值模式失败:', error);
      }
      return false;
    }

    const $levelControls = $panel.find('.mvu-level-controls-collapsible').first();
    if (!$levelControls.length) return false;
    $levelControls.removeClass('collapsed');
    $levelControls[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    return true;
  };

  const prepareInventoryTutorial = (button: Element): boolean => {
    const { $ } = getCore();
    const $overlay = $(button).closest('.acu-inventory-overlay');
    if (!$overlay.length) return false;

    const $filterPanel = $overlay.find('.acu-inventory-filter-collapsible').first();
    if ($filterPanel.length) {
      $filterPanel.removeClass('collapsed');
      $filterPanel[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    return true;
  };

  const SETTINGS_GROUP_TUTORIAL_MAP: Partial<Record<TutorialScope, string>> = {
    settingsAppearance: 'appearance',
    settingsLayout: 'layout',
    settingsPosition: 'position',
    settingsOptions: 'position',
    settingsTables: 'position',
    settingsDicePresets: 'dicePresets',
    settingsAdvanced: 'advanced',
  };

  const prepareSettingsGroupTutorial = (scope: TutorialScope, button: Element): boolean => {
    const groupId = SETTINGS_GROUP_TUTORIAL_MAP[scope];
    if (!groupId) return true;

    const { $ } = getCore();
    const $dialog = $(button).closest('.acu-settings-dialog');
    if (!$dialog.length) return false;

    const $group = $dialog.find(`.acu-settings-group[data-group="${groupId}"]`).first();
    if (!$group.length) return false;

    const $body = $group.find('.acu-settings-group-body').first();
    const $chevron = $group.find('.acu-group-chevron').first();
    if ($group.hasClass('collapsed')) {
      $group.removeClass('collapsed');
      $body.stop(true, true).show().css('height', '').removeClass('acu-animating');
      $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');

      const savedGroups = Store.get('acu_settings_expanded', ['appearance']);
      const expandedGroups = Array.isArray(savedGroups) ? savedGroups.map(String) : ['appearance'];
      if (!expandedGroups.includes(groupId)) {
        Store.set('acu_settings_expanded', [...expandedGroups, groupId]);
      }
    }

    $group[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    return true;
  };

  const startTutorialFromButton = (button: Element): void => {
    const { $ } = getCore();
    const scope = String($(button).attr('data-tutorial-scope') || '');
    if (!isTutorialScope(scope)) return;
    if (scope === 'avatarManager') {
      const win = getTavernHostWindow();
      let attempts = 0;
      const startWhenReady = (): void => {
        attempts += 1;
        const isReady = prepareAvatarManagerTutorial(button);
        if (isReady || attempts >= 6) {
          getTutorialModule().start(scope, { manual: true, interrupt: true });
          return;
        }
        win.setTimeout(startWhenReady, 120);
      };
      startWhenReady();
      return;
    }
    if (scope === 'mvu') {
      const win = getTavernHostWindow();
      let attempts = 0;
      const startWhenReady = (): void => {
        attempts += 1;
        const isReady = prepareMvuTutorial();
        if (isReady || attempts >= 8) {
          getTutorialModule().start(scope, { manual: true, interrupt: true });
          return;
        }
        win.setTimeout(startWhenReady, 140);
      };
      startWhenReady();
      return;
    }
    if (scope === 'inventory') {
      prepareInventoryTutorial(button);
    }
    prepareSettingsGroupTutorial(scope, button);
    getTutorialModule().start(scope, { manual: true, interrupt: true });
  };

  const bindTutorialButtonsIn = ($root: JQuery): void => {
    $root
      .find('.acu-panel-tutorial-btn')
      .off('click.acu_panel_tutorial_direct')
      .on('click.acu_panel_tutorial_direct', function (e) {
        e.stopPropagation();
        e.preventDefault();
        startTutorialFromButton(this);
      });
  };

  type DiffSheet = {
    name?: unknown;
    uid?: unknown;
    content?: unknown[];
    sourceData?: Record<string, unknown>;
  };

  type DiffRow = unknown[];

  type DiffRowMatch = {
    index: number;
    row: DiffRow;
  };

  type DiffRowMatcher = {
    byKey: Map<string, DiffRowMatch[]>;
    rows: DiffRow[];
    usedIndices: Set<number>;
  };

  const asDiffRecord = (value: unknown): Record<string, unknown> | null => {
    if (!value || typeof value !== 'object') return null;
    return value as Record<string, unknown>;
  };

  const isDiffSheet = (value: unknown): value is DiffSheet => {
    const record = asDiffRecord(value);
    return Boolean(record && Array.isArray(record.content));
  };

  const normalizeDiffText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ');

  const normalizeDiffHeader = (value: unknown): string => normalizeDiffText(value).toLowerCase();

  const getDiffSheetIdentity = (sheet: unknown): { uid: string; name: string } => {
    const record = asDiffRecord(sheet);
    return {
      uid: normalizeDiffText(record?.uid),
      name: normalizeDiffText(record?.name),
    };
  };

  const findDiffSnapshotEntry = (
    snapshot: unknown,
    sheetId: string,
    currentSheet: unknown,
  ): { key: string; sheet: DiffSheet } | null => {
    const snapshotRecord = asDiffRecord(snapshot);
    if (!snapshotRecord) return null;

    const directSheet = snapshotRecord[sheetId];
    if (isDiffSheet(directSheet)) return { key: sheetId, sheet: directSheet };

    const currentIdentity = getDiffSheetIdentity(currentSheet);
    const sheetKeys = Object.keys(snapshotRecord).filter(key => key.startsWith('sheet_'));

    if (currentIdentity.uid) {
      const matchedKey = sheetKeys.find(key => getDiffSheetIdentity(snapshotRecord[key]).uid === currentIdentity.uid);
      const matchedSheet = matchedKey ? snapshotRecord[matchedKey] : null;
      if (matchedKey && isDiffSheet(matchedSheet)) return { key: matchedKey, sheet: matchedSheet };
    }

    if (currentIdentity.name) {
      const matchedKey = sheetKeys.find(key => getDiffSheetIdentity(snapshotRecord[key]).name === currentIdentity.name);
      const matchedSheet = matchedKey ? snapshotRecord[matchedKey] : null;
      if (matchedKey && isDiffSheet(matchedSheet)) return { key: matchedKey, sheet: matchedSheet };
    }

    return null;
  };

  const normalizeDiffRow = (row: unknown): DiffRow => (Array.isArray(row) ? row : []);

  const getDiffSheetByKey = (data: unknown, sheetId: string): DiffSheet | null => {
    const record = asDiffRecord(data);
    if (!record) return null;
    const sheet = record[sheetId];
    return isDiffSheet(sheet) ? sheet : null;
  };

  const getDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number): DiffRow | null => {
    const row = sheet?.content?.[rowIndex + 1];
    return Array.isArray(row) ? row : null;
  };

  const setDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number, row: DiffRow): boolean => {
    if (!Array.isArray(sheet?.content)) return false;
    sheet.content[rowIndex + 1] = [...row];
    return true;
  };

  const setDiffDataCell = (
    sheet: DiffSheet | null | undefined,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): boolean => {
    const row = getDiffDataRow(sheet, rowIndex);
    if (!row) return false;
    row[colIndex] = value;
    return true;
  };

  const removeDiffDataRow = (sheet: DiffSheet | null | undefined, rowIndex: number): boolean => {
    if (!Array.isArray(sheet?.content) || !sheet.content[rowIndex + 1]) return false;
    sheet.content.splice(rowIndex + 1, 1);
    return true;
  };

  const getDiffSheetContent = (sheet: unknown): DiffRow[] => {
    if (!isDiffSheet(sheet)) return [];
    return sheet.content?.map(normalizeDiffRow) ?? [];
  };

  const getDiffHeaders = (sheet: unknown): DiffRow => getDiffSheetContent(sheet)[0] ?? [];

  const getDiffRows = (sheet: unknown): DiffRow[] => getDiffSheetContent(sheet).slice(1);

  const DIFF_ID_HEADER_KEYWORDS = [
    '编码',
    '编号',
    '索引',
    '名称',
    '名字',
    '姓名',
    '地点',
    '任务',
    '物品',
    '角色',
    '条目',
    'id',
  ];

  const getDiffPreferredColumns = (headers: DiffRow): number[] => {
    const indices: number[] = [];
    const add = (index: number): void => {
      if (index >= 0 && !indices.includes(index)) indices.push(index);
    };

    headers.forEach((header, index) => {
      const normalized = normalizeDiffHeader(header);
      if (!normalized) return;
      if (DIFF_ID_HEADER_KEYWORDS.some(keyword => normalized.includes(keyword.toLowerCase()))) add(index);
    });

    add(1);
    add(0);
    return indices;
  };

  const getDiffRowIdentityKeys = (headers: DiffRow, row: DiffRow): string[] => {
    const keys: string[] = [];
    const addKey = (key: string): void => {
      if (key && !keys.includes(key)) keys.push(key);
    };

    getDiffPreferredColumns(headers).forEach(colIndex => {
      const value = normalizeDiffText(row[colIndex]);
      if (!value) return;
      const headerKey = normalizeDiffHeader(headers[colIndex]);
      if (headerKey) addKey(`h:${headerKey}:${value}`);
      addKey(`c:${colIndex}:${value}`);
    });

    const fullRowKey = row
      .slice(1)
      .map(cell => normalizeDiffText(cell))
      .join('\u0001');
    if (fullRowKey.replace(/\u0001/g, '')) addKey(`full:${fullRowKey}`);

    return keys;
  };

  const getDiffRowDisplayTitle = (headers: DiffRow, row: DiffRow, rowIndex: number): string => {
    const preferred = getDiffPreferredColumns(headers).filter(index => index > 0);
    for (const colIndex of preferred) {
      const value = normalizeDiffText(row[colIndex]);
      if (value) return value;
    }
    return normalizeDiffText(row[0]) || `行 ${rowIndex + 1}`;
  };

  const createDiffRowMatcher = (headers: DiffRow, rows: DiffRow[]): DiffRowMatcher => {
    const byKey = new Map<string, DiffRowMatch[]>();
    rows.forEach((row, index) => {
      getDiffRowIdentityKeys(headers, row).forEach(key => {
        const queue = byKey.get(key) ?? [];
        queue.push({ index, row });
        byKey.set(key, queue);
      });
    });
    return { byKey, rows, usedIndices: new Set<number>() };
  };

  const takeDiffRowMatch = (
    matcher: DiffRowMatcher,
    headers: DiffRow,
    row: DiffRow,
    rowIndex: number,
  ): DiffRowMatch | null => {
    for (const key of getDiffRowIdentityKeys(headers, row)) {
      const queue = matcher.byKey.get(key);
      while (queue?.length) {
        const candidate = queue.shift();
        if (candidate && !matcher.usedIndices.has(candidate.index)) {
          matcher.usedIndices.add(candidate.index);
          return candidate;
        }
      }
    }

    const positionalRow = matcher.rows[rowIndex];
    if (positionalRow && !matcher.usedIndices.has(rowIndex)) {
      matcher.usedIndices.add(rowIndex);
      return { index: rowIndex, row: positionalRow };
    }

    return null;
  };

  const countRuntimeDataChanges = createCountRuntimeDataChanges({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffHeaders: (...a: any[]) => getDiffHeaders(...a),
    getDiffRows: (...a: any[]) => getDiffRows(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
  });

  const generateDiffMap = createGenerateDiffMap({
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffHeaders: (...a: any[]) => getDiffHeaders(...a),
    getDiffRows: (...a: any[]) => getDiffRows(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
  });

  const applyConfigStyles = createApplyConfigStyles({
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    FONTS: FONTS,
  });

  /**
   * 注入骰子系统样式到页面
   *
   * CSS 样式定义已拆分到 ./styles.ts 文件中。
   * 如需修改样式，请编辑 styles.ts 中的 MAIN_STYLES 常量。
   *
   * @see ./styles.ts - MAIN_STYLES 常量
   */
  const addStyles = () => {
    const targetDocument = getTavernHostDocument();
    targetDocument.getElementById('dice-db-theme-sync')?.remove();
    if (targetDocument !== document) {
      document.getElementById('dice-db-theme-sync')?.remove();
    }
    if (window._acuStylesInjected && targetDocument.getElementById(`${SCRIPT_ID}-styles`)) return;
    window._acuStylesInjected = true;

    // 动态加载 Tabler Icons 字体（用于 ti:xxx 图标）
    if (!targetDocument.getElementById('tabler-icons-css')) {
      const iconLink = targetDocument.createElement('link');
      iconLink.id = 'tabler-icons-css';
      iconLink.rel = 'stylesheet';
      iconLink.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css';
      targetDocument.head.appendChild(iconLink);
    }

    targetDocument.getElementById(`${SCRIPT_ID}-styles`)?.remove();
    if (targetDocument !== document) {
      document.getElementById(`${SCRIPT_ID}-styles`)?.remove();
    }
    const styleEl = targetDocument.createElement('style');
    styleEl.id = `${SCRIPT_ID}-styles`;
    styleEl.textContent = MAIN_STYLES;
    targetDocument.head.appendChild(styleEl);
  };

  const cloneRuntimeDataValue = <T>(value: T): T => {
    if (value === null || value === undefined) return value;
    if (typeof structuredClone === 'function') {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value)) as T;
  };

  const restoreMutableRuntimeValue = (target: unknown, snapshot: unknown): void => {
    if (Array.isArray(target) && Array.isArray(snapshot)) {
      target.splice(0, target.length, ...snapshot);
      return;
    }
    if (!target || !snapshot || typeof target !== 'object' || typeof snapshot !== 'object') return;

    const targetRecord = target as Record<string, unknown>;
    const snapshotRecord = snapshot as Record<string, unknown>;
    Object.keys(targetRecord).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(snapshotRecord, key)) delete targetRecord[key];
    });
    Object.assign(targetRecord, snapshotRecord);
  };

  const getRuntimeErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
      const text = JSON.stringify(error);
      return text && text !== '{}' ? text : String(error);
    } catch {
      return String(error);
    }
  };

  const getRuntimeErrorLogPayload = (error: unknown) => {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    return { message: getRuntimeErrorMessage(error) };
  };

  type RuntimeTableReadOptions = {
    silent?: boolean;
  };

  const readRuntimeTableData = (api: unknown): unknown => {
    const record = api as Record<string, unknown> | null | undefined;
    if (typeof record?.getCurrentData === 'function') {
      return (record.getCurrentData as () => unknown).call(api);
    }
    // 数据库本体当前公开面仍把只读快照暴露在 exportTableAsJson；写入保存必须走下方 CRUD。
    if (typeof record?.exportTableAsJson === 'function') {
      return (record.exportTableAsJson as () => unknown).call(api);
    }
    return null;
  };

  const readRuntimeTableDataReference = (api: unknown): unknown => {
    const record = api as Record<string, unknown> | null | undefined;
    if (typeof record?.exportTableAsJson === 'function') {
      return (record.exportTableAsJson as () => unknown).call(api);
    }
    return readRuntimeTableData(api);
  };

  const hasRuntimeTableReadApi = (api: unknown): boolean => {
    const record = api as Record<string, unknown> | null | undefined;
    return typeof record?.getCurrentData === 'function' || typeof record?.exportTableAsJson === 'function';
  };

  const getTableData = (options?: RuntimeTableReadOptions) => {
    const api = getCore().getDB();
    if (!api || !hasRuntimeTableReadApi(api)) {
      console.warn('[DICE]数据库 API 不可用，无法获取表格数据');
      return null;
    }
    try {
      const data = cloneRuntimeDataValue(readRuntimeTableData(api));
      if (data && !options?.silent) {
        const sheetCount = Object.keys(data).filter(k => k.startsWith('sheet_')).length;
        console.info(`[DICE]已加载表格数据，包含 ${sheetCount} 个工作表`);
      }
      return data;
    } catch (e) {
      console.error('[DICE]获取表格数据失败:', e);
      return null;
    }
  };

  type DbChatMessage = {
    id?: string | number;
    mesid?: string | number;
    message_id?: string | number;
    swipes_id?: string | number;
    mes?: string;
    message?: string;
    text?: string;
    content?: string;
    is_user?: boolean;
    TavernDB_ACU_IsolatedData?: unknown;
    TavernDB_ACU_Identity?: unknown;
    TavernDB_ACU_IndependentData?: unknown;
    TavernDB_ACU_ModifiedKeys?: unknown;
    TavernDB_ACU_UpdateGroupKeys?: unknown;
    TavernDB_ACU_Data?: unknown;
    TavernDB_ACU_SummaryData?: unknown;
  };

  const getDbChatMessages = (): DbChatMessage[] | null => {
    const st = window.SillyTavern || window.parent?.SillyTavern;
    const rawChat = st?.chat;
    return Array.isArray(rawChat) ? (rawChat as DbChatMessage[]) : null;
  };

  const parseIsolatedData = (value: unknown): Record<string, unknown> | null => {
    if (!value) return null;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
      } catch {
        return null;
      }
      return null;
    }
    if (typeof value === 'object') return value as Record<string, unknown>;
    return null;
  };

  const hasSheetKeys = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    return Object.keys(value as Record<string, unknown>).some(key => key.startsWith('sheet_'));
  };

  const hasDbPayload = (msg: DbChatMessage): boolean => {
    if (hasSheetKeys(msg.TavernDB_ACU_IndependentData)) return true;
    if (hasSheetKeys(msg.TavernDB_ACU_Data)) return true;
    if (hasSheetKeys(msg.TavernDB_ACU_SummaryData)) return true;
    const isolated = parseIsolatedData(msg.TavernDB_ACU_IsolatedData);
    if (!isolated) return false;
    return Object.values(isolated).some(tagData => {
      if (!tagData || typeof tagData !== 'object') return false;
      const data = (tagData as Record<string, unknown>).independentData;
      return hasSheetKeys(data);
    });
  };

  const findLatestDbMessageIndex = (includeUser = false): number => {
    const chat = getDbChatMessages();
    if (!chat) return -1;
    for (let i = chat.length - 1; i >= 0; i--) {
      const msg = chat[i];
      if (!includeUser && msg?.is_user) continue;
      if (hasDbPayload(msg)) return i;
    }
    return -1;
  };

  const resolveIsolationKey = (msg: DbChatMessage, isolated: Record<string, unknown> | null): string | null => {
    if (typeof msg?.TavernDB_ACU_Identity === 'string') {
      const identity = msg.TavernDB_ACU_Identity;
      if (isolated && Object.prototype.hasOwnProperty.call(isolated, identity)) return identity;
    }
    if (isolated && Object.prototype.hasOwnProperty.call(isolated, '')) return '';
    if (isolated) {
      const keys = Object.keys(isolated);
      if (keys.length === 1) return keys[0];
    }
    return null;
  };

  const relocateDbPayloadToAnchor = createRelocateDbPayloadToAnchor({
    findLatestDbMessageIndex: (...a: any[]) => findLatestDbMessageIndex(...a),
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    hasDbPayload: (...a: any[]) => hasDbPayload(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

  const normalizeSheetKeys = (keys?: string[]): string[] | null => {
    if (!Array.isArray(keys)) return null;
    return Array.from(new Set(keys.map(key => String(key || '').trim()).filter(key => key.startsWith('sheet_'))));
  };

  type RuntimeCrudRowData = Record<string, unknown>;

  type RuntimeCrudCellUpdatePayload = {
    tableName: string;
    rowIndex: number;
    colIdentifier: string | number;
    value: unknown;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  type RuntimeCrudUpdateRowPayload = {
    tableName: string;
    rowIndex: number;
    data: RuntimeCrudRowData;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  type RuntimeCrudInsertRowPayload = {
    tableName: string;
    data: RuntimeCrudRowData;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  type RuntimeCrudDeleteRowPayload = {
    tableName: string;
    rowIndex: number;
    skipNotify?: boolean;
    skipChatSave?: boolean;
  };

  type RuntimeCrudWriteApi = {
    updateCell: (payload: RuntimeCrudCellUpdatePayload) => Promise<unknown> | unknown;
    updateRow?: (payload: RuntimeCrudUpdateRowPayload) => Promise<unknown> | unknown;
    insertRow: (payload: RuntimeCrudInsertRowPayload) => Promise<unknown> | unknown;
    deleteRow: (payload: RuntimeCrudDeleteRowPayload) => Promise<unknown> | unknown;
    getCurrentData?: () => unknown;
    exportTableAsJson?: () => unknown;
    refreshDataAndWorldbook?: () => Promise<unknown> | unknown;
    _notifyTableUpdate?: () => void;
  };

  const assertRuntimeCrudApi = (): RuntimeCrudWriteApi => {
    const api = getCore().getDB() as RuntimeCrudWriteApi | null | undefined;
    const apiRecord = api as Record<string, unknown> | null | undefined;
    const requiredMethods = ['updateCell', 'insertRow', 'deleteRow'] as const;
    const missing = requiredMethods.filter(method => typeof apiRecord?.[method] !== 'function');
    if (!hasRuntimeTableReadApi(api)) missing.push('getCurrentData/exportTableAsJson');
    if (missing.length > 0) {
      throw new Error(`数据库本体版本过低，缺少新版表格 CRUD API：${missing.join(', ')}。请升级数据库本体后再保存。`);
    }
    return api;
  };

  const getSheetRows = sheet => (Array.isArray(sheet?.content) ? sheet.content.slice(1) : []);
  const getSheetHeaders = sheet => (Array.isArray(sheet?.content?.[0]) ? sheet.content[0] : []);
  const sameRow = (left, right): boolean => JSON.stringify(left || []) === JSON.stringify(right || []);
  const sameHeaders = (left, right): boolean =>
    JSON.stringify(getSheetHeaders(left)) === JSON.stringify(getSheetHeaders(right));
  const getStableRowKeyForCrud = row => {
    if (!Array.isArray(row)) return '';
    const primary = String(row[1] ?? '').trim();
    if (primary) return `title:${primary}`;
    return `row:${JSON.stringify(row)}`;
  };

  const getCrudSheetDdl = (sheet: unknown): string => {
    const sheetRecord = asDiffRecord(sheet);
    const sourceRecord = asDiffRecord(sheetRecord?.sourceData);
    return String(sourceRecord?.ddl || '');
  };

  const stripCrudSqlComments = createStripCrudSqlComments({

  });

  const stripCrudSqlBlockComments = createStripCrudSqlBlockComments({

  });

  const stripCrudSqlNonStructuralComments = (ddl: unknown): string =>
    stripCrudSqlBlockComments(ddl)
      .split(/\r?\n/)
      .filter(line => !/^\s*--/.test(line))
      .join('\n');

  const CRUD_SQL_IDENTIFIER_PATTERN = '(?:"((?:[^"]|"")*)"|`((?:[^`]|``)*)`|\\[([^\\]]+)\\]|([A-Za-z_][A-Za-z0-9_]*))';

  const decodeCrudSqlIdentifier = (...values: unknown[]): string => {
    const raw = values.find(value => typeof value === 'string');
    return String(raw || '')
      .replace(/""/g, '"')
      .replace(/``/g, '`')
      .replace(/]]/g, ']')
      .trim();
  };

  const normalizeCrudHeaderLookupKey = (value: unknown): string =>
    normalizeDiffText(value)
      .replace(/（/g, '(')
      .replace(/）/g, ')');

  const normalizeCrudSqlComment = (comment: unknown): string =>
    String(comment || '')
      .replace(/[，,].*$/, '')
      .trim();

  const getCrudSqlCommentAliases = (comment: unknown): string[] => {
    const fullComment = normalizeCrudSqlComment(comment);
    if (!fullComment) return [];
    const aliases = [fullComment];
    const looseComment = fullComment.replace(/[（(].*$/, '').trim();
    if (looseComment && looseComment !== fullComment) aliases.push(looseComment);
    return Array.from(new Set(aliases));
  };

  const addCrudColumnAlias = (aliases: Record<string, string>, alias: string, columnName: string): void => {
    const trimmedAlias = normalizeDiffText(alias);
    const normalizedAlias = normalizeCrudHeaderLookupKey(trimmedAlias);
    [trimmedAlias, normalizedAlias].forEach(key => {
      if (key && !aliases[key]) aliases[key] = columnName;
    });
  };

  const getCrudColumnNameForHeader = (columnAliasMap: Record<string, string>, headerName: unknown): string => {
    const trimmedHeader = normalizeDiffText(headerName);
    return (
      columnAliasMap[trimmedHeader] ||
      columnAliasMap[normalizeCrudHeaderLookupKey(trimmedHeader)] ||
      trimmedHeader
    );
  };

  const parseCrudColumnDefinitionLine = (
    line: string,
  ): { columnName: string; definition: string; comment: string } | null => {
    if (/^\s*CREATE\s+TABLE\b/i.test(line)) return null;
    const match = line.match(new RegExp(`^\\s*${CRUD_SQL_IDENTIFIER_PATTERN}(?=\\s)(.*?)(?:--\\s*(.+?)\\s*)?$`));
    if (!match) return null;
    const columnName = decodeCrudSqlIdentifier(match[1], match[2], match[3], match[4]);
    if (!columnName) return null;
    return {
      columnName,
      definition: String(match[5] || ''),
      comment: normalizeCrudSqlComment(match[6]),
    };
  };

  const getCrudSqlTableName = (sheet: unknown): string => {
    const ddl = stripCrudSqlComments(getCrudSheetDdl(sheet));
    const match = ddl.match(
      new RegExp(`\\bCREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${CRUD_SQL_IDENTIFIER_PATTERN}`, 'i'),
    );
    return normalizeDiffText(decodeCrudSqlIdentifier(match?.[1], match?.[2], match?.[3], match?.[4]));
  };

  const getCrudTableIdentifier = (sheet: unknown, fallbackName: string): string =>
    getCrudSqlTableName(sheet) || normalizeDiffText(fallbackName);

  const buildCrudColumnAliasMap = (sheet: unknown): Record<string, string> => {
    const ddl = stripCrudSqlNonStructuralComments(getCrudSheetDdl(sheet));
    const aliases: Record<string, string> = {};
    if (!ddl) return aliases;

    ddl.split(/\r?\n/).forEach(line => {
      const parsed = parseCrudColumnDefinitionLine(line);
      if (!parsed) return;
      const { columnName, comment } = parsed;
      getCrudSqlCommentAliases(comment).forEach(alias => addCrudColumnAlias(aliases, alias, columnName));
    });

    return aliases;
  };

  const parseSqlQuotedValues = (value: string): string[] => {
    const values: string[] = [];
    const regex = /'((?:''|[^'])*)'/g;
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(String(value || ''))) !== null) {
      values.push(String(match[1] || '').replace(/''/g, "'"));
    }
    return values;
  };

  type RuntimeCrudEnumConstraint = {
    values: string[];
    nullable: boolean;
  };

  const buildCrudEnumConstraintMap = (sheet: unknown): Record<string, RuntimeCrudEnumConstraint> => {
    const ddl = stripCrudSqlComments(getCrudSheetDdl(sheet));
    const constraints: Record<string, RuntimeCrudEnumConstraint> = {};
    if (!ddl) return constraints;

    const regex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?${CRUD_SQL_IDENTIFIER_PATTERN}\\s+IN\\s*\\(([^)]*)\\)\\s*\\)`,
      'gi',
    );
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(ddl)) !== null) {
      const nullableColumnName = decodeCrudSqlIdentifier(match[1], match[2], match[3], match[4]);
      const columnName = decodeCrudSqlIdentifier(match[5], match[6], match[7], match[8]);
      const values = parseSqlQuotedValues(match[9] || '');
      if (columnName && values.length > 0) {
        constraints[columnName] = {
          values,
          nullable: Boolean(nullableColumnName && nullableColumnName === columnName),
        };
      }
    }

    return constraints;
  };

  const isCrudNullableEnumEmptyValue = (value: unknown): boolean =>
    value === null || value === undefined || String(value).trim() === '';

  const assertCrudEnumConstraints = (
    tableName: string,
    headers,
    row,
    sheet,
    rowIndex: number,
    changedColumns?: Set<number>,
    columnAliasMap = buildCrudColumnAliasMap(sheet),
  ): void => {
    if (!Array.isArray(row)) return;
    if (!Array.isArray(headers)) return;
    const constraints = buildCrudEnumConstraintMap(sheet);
    if (Object.keys(constraints).length === 0) return;

    headers.forEach((header, index) => {
      if (index === 0) return;
      if (changedColumns && !changedColumns.has(index)) return;
      const headerName = String(header || '').trim();
      if (!headerName) return;

      const columnName = getCrudColumnNameForHeader(columnAliasMap, headerName);
      const constraint = constraints[columnName];
      if (!constraint || constraint.values.length === 0) return;
      if (constraint.nullable && isCrudNullableEnumEmptyValue(row[index])) return;

      const value = String(row[index] ?? '').trim();
      if (constraint.values.includes(value)) return;

      throw new Error(
        `表 "${tableName}" 第 ${rowIndex + 1} 行的「${headerName}」不能写入「${value || '空值'}」：数据库结构只允许 ${constraint.values.join('、')}。请调整表格结构/枚举，或把要写入的内容改为允许值。`,
      );
    });
  };

  const buildCrudLengthConstraintMap = (sheet: unknown): Record<string, number> => {
    const ddl = stripCrudSqlComments(getCrudSheetDdl(sheet));
    const constraints: Record<string, number> = {};
    if (!ddl) return constraints;

    const regex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?LENGTH\\s*\\(\\s*${CRUD_SQL_IDENTIFIER_PATTERN}\\s*\\)\\s*(<=|<)\\s*(\\d+)\\s*\\)`,
      'gi',
    );
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(ddl)) !== null) {
      const columnName = decodeCrudSqlIdentifier(match[5], match[6], match[7], match[8]);
      const operator = String(match[9] || '').trim();
      const rawLimit = Math.floor(Number(match[10]) || 0);
      const maxLength = operator === '<' ? rawLimit - 1 : rawLimit;
      if (columnName && maxLength >= 0) {
        constraints[columnName] = constraints[columnName] === undefined ? maxLength : Math.min(constraints[columnName], maxLength);
      }
    }

    return constraints;
  };

  const getCrudUnsupportedFallbackConstraintText = (sheet: unknown): string => {
    let ddl = stripCrudSqlComments(getCrudSheetDdl(sheet));
    if (!ddl) return '';
    const enumCheckRegex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?${CRUD_SQL_IDENTIFIER_PATTERN}\\s+IN\\s*\\(([^)]*)\\)\\s*\\)`,
      'gi',
    );
    const lengthCheckRegex = new RegExp(
      `CHECK\\s*\\(\\s*(?:${CRUD_SQL_IDENTIFIER_PATTERN}\\s+IS\\s+NULL\\s+OR\\s*)?LENGTH\\s*\\(\\s*${CRUD_SQL_IDENTIFIER_PATTERN}\\s*\\)\\s*(?:<=|<)\\s*\\d+\\s*\\)`,
      'gi',
    );
    ddl = ddl.replace(enumCheckRegex, '').replace(lengthCheckRegex, '');
    const unsupportedConstraintPatterns = [
      /\bCHECK\s*\([^;\n]*/i,
      /\bUNIQUE\b(?:\s*\([^)]*\))?/i,
      /\b(?:FOREIGN\s+KEY|REFERENCES)\b[^,\n)]*/i,
    ];
    for (const pattern of unsupportedConstraintPatterns) {
      const constraint = normalizeDiffText(ddl.match(pattern)?.[0]);
      if (constraint) return constraint;
    }
    return '';
  };

  const assertCrudJsonFallbackAllowed = (tableName: string, sheet: unknown): void => {
    const unsupportedConstraint = getCrudUnsupportedFallbackConstraintText(sheet);
    if (!unsupportedConstraint) return;
    throw new Error(
      `更新 "${tableName}" 失败后已取消 JSON 回退保存：数据库结构包含当前无法本地复核的约束（${unsupportedConstraint}）。请修正单元格内容或表格结构后重试。`,
    );
  };

  const assertCrudLengthConstraints = (
    tableName: string,
    headers,
    row,
    sheet,
    rowIndex: number,
    changedColumns?: Set<number>,
    columnAliasMap = buildCrudColumnAliasMap(sheet),
  ): void => {
    if (!Array.isArray(row)) return;
    if (!Array.isArray(headers)) return;
    const constraints = buildCrudLengthConstraintMap(sheet);
    if (Object.keys(constraints).length === 0) return;

    headers.forEach((header, index) => {
      if (index === 0) return;
      if (changedColumns && !changedColumns.has(index)) return;
      const headerName = String(header || '').trim();
      if (!headerName) return;

      const columnName = getCrudColumnNameForHeader(columnAliasMap, headerName);
      const maxLength = constraints[columnName];
      if (maxLength === undefined) return;

      const value = String(row[index] ?? '');
      const length = countUnicodeCharacters(value);
      if (length <= maxLength) return;

      throw new Error(
        `表 "${tableName}" 第 ${rowIndex + 1} 行的「${headerName}」长度为 ${length}，超过数据库结构允许的 ${maxLength} 字。请缩短内容，或调整表格结构的长度约束。`,
      );
    });
  };

  const buildCrudRequiredHeaderSet = (sheet: unknown): Set<string> => {
    const ddl = stripCrudSqlNonStructuralComments(getCrudSheetDdl(sheet));
    const headers = new Set<string>();
    if (!ddl) return headers;

    ddl.split(/\r?\n/).forEach(line => {
      const parsed = parseCrudColumnDefinitionLine(line);
      if (!parsed) return;
      const { columnName, definition, comment } = parsed;
      if (!/\bNOT\s+NULL\b/i.test(definition)) return;
      if (/\bPRIMARY\s+KEY\b/i.test(definition)) return;
      if (columnName) headers.add(columnName);
      if (comment) headers.add(comment);
    });

    return headers;
  };

  const assertCrudRequiredColumnsRepresented = (tableName: string, headers, sheet): void => {
    if (!Array.isArray(headers)) return;
    const requiredHeaders = buildCrudRequiredHeaderSet(sheet);
    if (requiredHeaders.size === 0) return;
    const headerSet = new Set(headers.map(header => normalizeDiffText(header)).filter(Boolean));
    const aliasMap = buildCrudColumnAliasMap(sheet);
    const represented = new Set<string>();
    const representedColumns = new Set<string>();
    headerSet.forEach(headerName => {
      represented.add(headerName);
      represented.add(normalizeCrudHeaderLookupKey(headerName));
      const columnName = getCrudColumnNameForHeader(aliasMap, headerName);
      if (columnName) {
        represented.add(columnName);
        representedColumns.add(columnName);
      }
    });
    Object.entries(aliasMap).forEach(([comment, columnName]) => {
      if (representedColumns.has(String(columnName || '').trim())) represented.add(comment);
    });
    const missing = Array.from(requiredHeaders).filter(headerName => !represented.has(headerName));
    if (missing.length === 0) return;
    throw new Error(
      `表 "${tableName}" 的 DDL 存在必填列未出现在表头中：${missing.join('、')}。请先修正表头/DDL，确保每个 NOT NULL 列都有可写入的表头或注释别名。`,
    );
  };

  const getCrudRequiredColumnsByHeaderIndex = (
    headers,
    sheet,
    columnAliasMap = buildCrudColumnAliasMap(sheet),
  ): Map<number, string> => {
    const result = new Map<number, string>();
    if (!Array.isArray(headers)) return result;
    const requiredHeaders = buildCrudRequiredHeaderSet(sheet);
    if (requiredHeaders.size === 0) return result;
    headers.forEach((header, index) => {
      if (index === 0) return;
      const headerName = normalizeDiffText(header);
      if (!headerName) return;
      const columnName = getCrudColumnNameForHeader(columnAliasMap, headerName);
      if (requiredHeaders.has(headerName) || requiredHeaders.has(columnName)) {
        result.set(index, headerName);
      }
    });
    return result;
  };

  const assertCrudRequiredCellValues = (
    tableName: string,
    headers,
    row,
    sheet,
    rowIndex: number,
    columnAliasMap = buildCrudColumnAliasMap(sheet),
  ): void => {
    if (!Array.isArray(headers) || !Array.isArray(row)) return;
    const requiredColumns = getCrudRequiredColumnsByHeaderIndex(headers, sheet, columnAliasMap);
    if (requiredColumns.size === 0) return;
    const missingColumns: string[] = [];
    requiredColumns.forEach((headerName, index) => {
      if (String(row[index] ?? '').trim() === '') missingColumns.push(headerName);
    });
    if (missingColumns.length > 0) {
      throw new Error(
        `表 "${tableName}" 第 ${rowIndex + 1} 行存在必填列为空：${missingColumns.join('、')}。请先补全这些字段，或调整数据库结构。`,
      );
    }
  };

  const getCrudCellValueForWrite = (
    headers,
    row,
    index: number,
    sheet: unknown,
    columnAliasMap = buildCrudColumnAliasMap(sheet),
    enumConstraints = buildCrudEnumConstraintMap(sheet),
  ): unknown => {
    const value = Array.isArray(row) ? row[index] : undefined;
    const headerName = normalizeDiffText(Array.isArray(headers) ? headers[index] : '');
    const columnName = getCrudColumnNameForHeader(columnAliasMap, headerName);
    const constraint = columnName ? enumConstraints[columnName] : undefined;
    if (constraint?.nullable && isCrudNullableEnumEmptyValue(value)) return null;
    return value ?? '';
  };

  const buildRowDataForCrud = (
    headers,
    row,
    changedColumns?: Set<number>,
    sheet?: unknown,
    columnAliasMap = sheet ? buildCrudColumnAliasMap(sheet) : {},
    enumConstraints = sheet ? buildCrudEnumConstraintMap(sheet) : {},
  ) => {
    const data: RuntimeCrudRowData = {};
    headers.forEach((header, index) => {
      if (index === 0) return;
      if (!header) return;
      if (changedColumns && !changedColumns.has(index)) return;
      const headerName = String(header);
      data[headerName] = sheet
        ? getCrudCellValueForWrite(headers, row, index, sheet, columnAliasMap, enumConstraints)
        : row?.[index] ?? '';
    });
    return data;
  };

  const getCrudChangedColumns = (headers, currentRow, nextRow): Set<number> => {
    const changedColumns = new Set<number>();
    if (!Array.isArray(headers)) return changedColumns;
    headers.forEach((header, colIndex) => {
      if (colIndex === 0) return;
      if (!header) return;
      if (String(currentRow?.[colIndex] ?? '') !== String(nextRow?.[colIndex] ?? '')) {
        changedColumns.add(colIndex);
      }
    });
    return changedColumns;
  };

  const isCrudRowIdMissing = (value: unknown): boolean =>
    value === null || value === undefined || String(value).trim() === '';

  const shouldInferCrudRowIdFromVisibleIndex = (input: CrudExistingRowPatchInput): boolean => {
    const firstHeader = normalizeDiffHeader(input.headers[0]);
    if (firstHeader === 'row_id' || firstHeader === '行号') return true;
    return /\brow_id\s+INTEGER\s+PRIMARY\s+KEY\b/i.test(getCrudSheetDdl(input.sheet));
  };

  const inferCrudRowIdForUpdateCell = (input: CrudExistingRowPatchInput): { rowId: unknown; source: string } | null => {
    const candidates: Array<{ rowId: unknown; source: string }> = [
      { rowId: input.currentRow?.[0], source: 'currentRow[0]' },
      { rowId: input.nextRow?.[0], source: 'nextRow[0]' },
    ];
    for (const candidate of candidates) {
      if (!isCrudRowIdMissing(candidate.rowId)) return candidate;
    }
    if (shouldInferCrudRowIdFromVisibleIndex(input)) {
      return { rowId: input.rowIndex + 1, source: 'rowIndex+1' };
    }
    return null;
  };

  type CrudRowIdPatch = {
    row: DiffRow;
    originalValue: unknown;
  };

  type CrudRowIdPreparation = {
    patchedRows: CrudRowIdPatch[];
    rowId: unknown;
    source: string;
  } | null;

  const patchCrudSheetCellInRecord = (
    record: unknown,
    sheetKey: string,
    desiredSheet: unknown,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): string | null => {
    const entry = findDiffSnapshotEntry(record, sheetKey, desiredSheet);
    const row = getDiffDataRow(entry?.sheet, rowIndex);
    if (!entry || !row) return null;
    row[colIndex] = value;
    return entry.key;
  };

  const patchCrudSheetInRecord = (record: unknown, sheetKey: string, desiredSheet: unknown): string | null => {
    const recordObj = asDiffRecord(record);
    if (!recordObj || !isDiffSheet(desiredSheet)) return null;
    const entry = findDiffSnapshotEntry(recordObj, sheetKey, desiredSheet);
    if (!entry) return null;
    recordObj[entry.key] = cloneRuntimeDataValue(desiredSheet);
    return entry.key;
  };

  const patchCrudSheetCellInMessage = (
    msg: DbChatMessage,
    sheetKey: string,
    desiredSheet: unknown,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): string[] => {
    const patchedKeys: string[] = [];
    const rememberPatchedKey = (key: string | null): void => {
      if (key && !patchedKeys.includes(key)) patchedKeys.push(key);
    };

    const isolatedData = parseIsolatedData(msg.TavernDB_ACU_IsolatedData);
    const isolationKey = resolveIsolationKey(msg, isolatedData);
    if (isolatedData && isolationKey !== null) {
      const tagData = asDiffRecord(isolatedData[isolationKey]);
      const independentData = asDiffRecord(tagData?.independentData);
      rememberPatchedKey(
        patchCrudSheetCellInRecord(independentData, sheetKey, desiredSheet, rowIndex, colIndex, value),
      );
      if (patchedKeys.length > 0) msg.TavernDB_ACU_IsolatedData = isolatedData;
    }

    rememberPatchedKey(
      patchCrudSheetCellInRecord(msg.TavernDB_ACU_IndependentData, sheetKey, desiredSheet, rowIndex, colIndex, value),
    );
    rememberPatchedKey(
      patchCrudSheetCellInRecord(msg.TavernDB_ACU_Data, sheetKey, desiredSheet, rowIndex, colIndex, value),
    );
    rememberPatchedKey(
      patchCrudSheetCellInRecord(msg.TavernDB_ACU_SummaryData, sheetKey, desiredSheet, rowIndex, colIndex, value),
    );

    return patchedKeys;
  };

  const patchCrudSheetInMessage = (msg: DbChatMessage, sheetKey: string, desiredSheet: unknown): string[] => {
    const patchedKeys: string[] = [];
    const rememberPatchedKey = (key: string | null): void => {
      if (key && !patchedKeys.includes(key)) patchedKeys.push(key);
    };

    const isolatedData = parseIsolatedData(msg.TavernDB_ACU_IsolatedData);
    const isolationKey = resolveIsolationKey(msg, isolatedData);
    if (isolatedData && isolationKey !== null) {
      const tagData = asDiffRecord(isolatedData[isolationKey]);
      const independentData = asDiffRecord(tagData?.independentData);
      rememberPatchedKey(patchCrudSheetInRecord(independentData, sheetKey, desiredSheet));
      if (patchedKeys.length > 0) msg.TavernDB_ACU_IsolatedData = isolatedData;
    }

    rememberPatchedKey(patchCrudSheetInRecord(msg.TavernDB_ACU_IndependentData, sheetKey, desiredSheet));
    rememberPatchedKey(patchCrudSheetInRecord(msg.TavernDB_ACU_Data, sheetKey, desiredSheet));
    rememberPatchedKey(patchCrudSheetInRecord(msg.TavernDB_ACU_SummaryData, sheetKey, desiredSheet));

    return patchedKeys;
  };

  const patchLatestChatSheetCellWithoutTracking = async (
    sheetKey: string,
    desiredSheet: unknown,
    rowIndex: number,
    colIndex: number,
    value: unknown,
  ): Promise<{ messageIndex: number; patchedKeys: string[] } | null> => {
    const chat = getDbChatMessages();
    if (!chat) return null;
    for (let index = chat.length - 1; index >= 0; index--) {
      const msg = chat[index];
      if (!msg || msg.is_user) continue;
      const patchedKeys = patchCrudSheetCellInMessage(msg, sheetKey, desiredSheet, rowIndex, colIndex, value);
      if (patchedKeys.length === 0) continue;
      await triggerSlash('savechat');
      return { messageIndex: index, patchedKeys };
    }
    return null;
  };

  const patchLatestChatSheetWithoutTracking = async (
    sheetKey: string,
    desiredSheet: unknown,
  ): Promise<{ messageIndex: number; patchedKeys: string[] } | null> => {
    const chat = getDbChatMessages();
    if (!chat) return null;
    for (let index = chat.length - 1; index >= 0; index--) {
      const msg = chat[index];
      if (!msg || msg.is_user) continue;
      const patchedKeys = patchCrudSheetInMessage(msg, sheetKey, desiredSheet);
      if (patchedKeys.length === 0) continue;
      await triggerSlash('savechat');
      return { messageIndex: index, patchedKeys };
    }
    return null;
  };

  const saveSheetsViaJsonFloorWithoutTracking = async (tableData, modifiedSheetKeys?: string[]) => {
    const api = assertRuntimeCrudApi();
    const { dataToSave, sheetKeysToSave } = sanitizeRuntimeTableData(tableData, modifiedSheetKeys, false);
    if (sheetKeysToSave.length === 0) {
      console.info('[DICE]ACU JSON 楼层保存跳过：没有有效修改表');
      return dataToSave;
    }

    const liveData = readRuntimeTableDataReference(api);
    for (const sheetKey of sheetKeysToSave) {
      const desiredSheet = dataToSave[sheetKey];
      if (!isDiffSheet(desiredSheet)) continue;
      const persisted = await patchLatestChatSheetWithoutTracking(sheetKey, desiredSheet);
      if (!persisted) {
        throw new Error(`保存 "${desiredSheet.name || sheetKey}" 的正则转换结果失败：找不到该表的历史数据楼层`);
      }
      patchCrudSheetInRecord(liveData, sheetKey, desiredSheet);
      console.info('[DICE]ACU 正则转换已按表回写 JSON 楼层（不写入更新追踪）:', {
        tableName: desiredSheet.name || sheetKey,
        sheetKey,
        messageIndex: persisted.messageIndex,
      });
    }

    if (typeof api.refreshDataAndWorldbook === 'function') {
      await api.refreshDataAndWorldbook();
    } else {
      api._notifyTableUpdate?.();
    }
    const refreshedData = getTableData({ silent: true }) || dataToSave;
    cachedRawData = refreshedData;
    return refreshedData;
  };

  const applyJsonCellFallbackForCrud = async (input: CrudExistingRowPatchInput, colIndex: number): Promise<boolean> => {
    const liveData = readRuntimeTableDataReference(input.api);
    const liveEntry =
      findDiffSnapshotEntry(liveData, input.sheetKey || input.tableName, input.sheet) ||
      findDiffSnapshotEntry(liveData, input.crudTableName, input.sheet);
    const sheetKey = liveEntry?.key || input.sheetKey || '';
    if (!sheetKey) return false;

    const value = getCrudCellValueForWrite(
      input.headers,
      input.nextRow,
      colIndex,
      input.sheet,
      input.columnAliasMap || buildCrudColumnAliasMap(input.sheet),
    );
    patchCrudSheetCellInRecord(liveData, sheetKey, input.sheet, input.rowIndex, colIndex, value);
    assertCrudRequiredCellValues(
      input.tableName,
      input.headers,
      input.nextRow,
      input.sheet,
      input.rowIndex,
      input.columnAliasMap || buildCrudColumnAliasMap(input.sheet),
    );
    const persisted = await patchLatestChatSheetCellWithoutTracking(
      sheetKey,
      input.sheet,
      input.rowIndex,
      colIndex,
      value,
    );
    if (!persisted) return false;

    input.api._notifyTableUpdate?.();
    console.warn('[DICE]ACU updateCell failed; saved cell via JSON-floor fallback without importTableAsJson:', {
      tableName: input.tableName,
      sheetKey,
      rowIndex: input.rowIndex + 1,
      column: String(input.headers[colIndex] || `#${colIndex + 1}`),
      messageIndex: persisted.messageIndex,
      patchedKeys: persisted.patchedKeys,
    });
    return true;
  };

  const patchCrudRowIdIfMissing = (
    row: DiffRow | null | undefined,
    rowId: unknown,
    patchedRows: CrudRowIdPatch[],
    seenRows: Set<DiffRow>,
  ): void => {
    if (!Array.isArray(row) || seenRows.has(row) || !isCrudRowIdMissing(row[0])) return;
    seenRows.add(row);
    patchedRows.push({ row, originalValue: row[0] });
    row[0] = rowId;
  };

  const prepareCrudRowIdForUpdateCell = createPrepareCrudRowIdForUpdateCell({
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    inferCrudRowIdForUpdateCell: (...a: any[]) => inferCrudRowIdForUpdateCell(...a),
    isCrudRowIdMissing: (...a: any[]) => isCrudRowIdMissing(...a),
    patchCrudRowIdIfMissing: (...a: any[]) => patchCrudRowIdIfMissing(...a),
    readRuntimeTableDataReference: (...a: any[]) => readRuntimeTableDataReference(...a),
  });

  const restoreCrudRowIdPreparation = (preparation: CrudRowIdPreparation): void => {
    preparation?.patchedRows.forEach(patch => {
      patch.row[0] = patch.originalValue;
    });
  };

  const assertCrudInsertRequiredCells = (tableName: string, headers, row, sheet, rowIndex: number): void => {
    try {
      assertCrudRequiredCellValues(tableName, headers, row, sheet, rowIndex);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        message.replace(
          `表 "${tableName}" 第 ${rowIndex + 1} 行存在必填列为空`,
          `向 "${tableName}" 追加第 ${rowIndex + 1} 行前发现必填列为空`,
        ),
      );
    }
  };
  type CrudWriteBatchContext = {
    remainingOperations: number;
  };

  const consumeCrudWriteOptions = (batchContext?: CrudWriteBatchContext) => {
    if (!batchContext) return { skipNotify: true };
    batchContext.remainingOperations = Math.max(0, batchContext.remainingOperations - 1);
    return batchContext.remainingOperations > 0
      ? { skipNotify: true, skipChatSave: true }
      : { skipNotify: true };
  };

  type CrudExistingRowPatchInput = {
    api: RuntimeCrudWriteApi;
    sheetKey?: string;
    tableName: string;
    crudTableName: string;
    headers: unknown[];
    currentRow: unknown[];
    nextRow: unknown[];
    sheet: unknown;
    rowIndex: number;
    changedColumns?: Set<number>;
    columnAliasMap?: Record<string, string>;
    batchContext?: CrudWriteBatchContext;
  };


  const applyExistingRowCellPatchesViaCrud = createApplyExistingRowCellPatchesViaCrud({
    applyJsonCellFallbackForCrud: (...a: any[]) => applyJsonCellFallbackForCrud(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudJsonFallbackAllowed: (...a: any[]) => assertCrudJsonFallbackAllowed(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredCellValues: (...a: any[]) => assertCrudRequiredCellValues(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildRowDataForCrud: (...a: any[]) => buildRowDataForCrud(...a),
    consumeCrudWriteOptions: (...a: any[]) => consumeCrudWriteOptions(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
    getCrudChangedColumns: (...a: any[]) => getCrudChangedColumns(...a),
    prepareCrudRowIdForUpdateCell: (...a: any[]) => prepareCrudRowIdForUpdateCell(...a),
    restoreCrudRowIdPreparation: (...a: any[]) => restoreCrudRowIdPreparation(...a),
  });

  const findDeletionIndicesForCrud = (oldRows, desiredRows): number[] | null => {
    if (desiredRows.length > oldRows.length) return null;
    const desiredKeys = desiredRows.map(getStableRowKeyForCrud);
    const keepIndices: number[] = [];
    let searchFrom = 0;

    for (const desiredKey of desiredKeys) {
      let found = -1;
      for (let index = searchFrom; index < oldRows.length; index++) {
        if (getStableRowKeyForCrud(oldRows[index]) === desiredKey) {
          found = index;
          break;
        }
      }
      if (found === -1) return null;
      keepIndices.push(found);
      searchFrom = found + 1;
    }

    const keepSet = new Set(keepIndices);
    return oldRows.map((_, index) => index).filter(index => !keepSet.has(index));
  };

  const assertAppendOnlyRows = (oldRows, desiredRows): void => {
    if (desiredRows.length < oldRows.length) return;
    for (let index = 0; index < oldRows.length; index++) {
      if (getStableRowKeyForCrud(oldRows[index]) !== getStableRowKeyForCrud(desiredRows[index])) {
        throw new Error('当前变更包含中间插入或行重排，新版数据库 API 无法安全表达，已取消快捷保存。');
      }
    }
  };

  const findRuntimeSheetEntryForCrud = (
    latestData: unknown,
    sheetKey: string,
    desiredSheet: unknown,
  ): { key: string; sheet: DiffSheet } | null => findDiffSnapshotEntry(latestData, sheetKey, desiredSheet);

  const applySheetDataViaCrud = createApplySheetDataViaCrud({
    applyExistingRowCellPatchesViaCrud: (...a: any[]) => applyExistingRowCellPatchesViaCrud(...a),
    assertAppendOnlyRows: (...a: any[]) => assertAppendOnlyRows(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildRowDataForCrud: (...a: any[]) => buildRowDataForCrud(...a),
    findDeletionIndicesForCrud: (...a: any[]) => findDeletionIndicesForCrud(...a),
    getCrudChangedColumns: (...a: any[]) => getCrudChangedColumns(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetRows: (...a: any[]) => getSheetRows(...a),
    sameHeaders: (...a: any[]) => sameHeaders(...a),
    sameRow: (...a: any[]) => sameRow(...a),
  });

  const sanitizeRuntimeTableData = (tableData, modifiedSheetKeys?: string[], commitDeletes = false) => {
    const sourceData = tableData && typeof tableData === 'object' ? tableData : {};
    const dataToSave = {
      mate: sourceData.mate ? cloneRuntimeDataValue(sourceData.mate) : { type: 'chatSheets', version: 1 },
    };

    Object.keys(sourceData).forEach(key => {
      if (key.startsWith('sheet_')) {
        dataToSave[key] = cloneRuntimeDataValue(sourceData[key]);
      }
    });

    syncInventoryMetadataForRawData(dataToSave);

    if (commitDeletes) {
      const deletions = getPendingDeletions();
      Object.keys(deletions).forEach(key => {
        if (dataToSave[key]?.content) {
          deletions[key]
            .sort((left, right) => right - left)
            .forEach(index => {
              if (dataToSave[key].content[index + 1]) dataToSave[key].content.splice(index + 1, 1);
            });
        }
      });
    }

    const explicitKeys = normalizeSheetKeys(modifiedSheetKeys);
    const sheetKeysToSave = explicitKeys || Object.keys(dataToSave).filter(key => key.startsWith('sheet_'));
    if (explicitKeys && explicitKeys.length === 0) {
      return { dataToSave, sheetKeysToSave: [] };
    }
    return { dataToSave, sheetKeysToSave };
  };

  const applyRuntimeDataViaCrud = async (
    tableData,
    modifiedSheetKeys?: string[],
    options?: { commitDeletes?: boolean },
  ) => {
    const api = assertRuntimeCrudApi();
    const isPartialSave = Array.isArray(modifiedSheetKeys);
    const { dataToSave, sheetKeysToSave } = sanitizeRuntimeTableData(
      tableData,
      modifiedSheetKeys,
      options?.commitDeletes === true,
    );
    if (sheetKeysToSave.length === 0) {
      console.info('[DICE]ACU CRUD 保存跳过：没有有效修改表');
      return dataToSave;
    }

    const latestData = getTableData({ silent: true });
    if (!latestData) throw new Error('无法读取最新数据库基底，已取消保存以避免覆盖未保存表格');
    if (!isPartialSave) {
      const deletedSheetNames = Object.keys(latestData)
        .filter(key => key.startsWith('sheet_') && !dataToSave[key])
        .map(key => latestData[key]?.name || key);
      if (deletedSheetNames.length > 0) {
        throw new Error(`检测到整表删除：${deletedSheetNames.join('、')}。该结构级变更仅标注，不支持快捷保存。`);
      }
    }

    for (const sheetKey of sheetKeysToSave) {
      const desiredSheet = dataToSave[sheetKey];
      const latestEntry = findRuntimeSheetEntryForCrud(latestData, sheetKey, desiredSheet);
      await applySheetDataViaCrud(api, latestEntry?.key || sheetKey, desiredSheet, latestEntry?.sheet);
    }

    const refreshedData = getTableData({ silent: true }) || dataToSave;
    cachedRawData = refreshedData;
    api._notifyTableUpdate?.();
    return refreshedData;
  };

  const saveDataToDatabase = createSaveDataToDatabase({
    applyRuntimeDataViaCrud: (...a: any[]) => applyRuntimeDataViaCrud(...a),
    getCore: (...a: any[]) => getCore(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges = v; },
      getIsSaving: () => isSaving,
    setIsSaving: (v: any) => { isSaving = v; },
});

  const performSaveDataOnly = async (tableData, modifiedSheetKeys?: string[]) => {
    try {
      return await applyRuntimeDataViaCrud(tableData, modifiedSheetKeys);
    } catch (e) {
      console.error(
        '[DICE]ACU saveDataOnly error:',
        getRuntimeErrorLogPayload(e),
        modifiedSheetKeys ? { modifiedSheetKeys } : undefined,
      );
      throw e;
    }
  };

  const runInSaveQueue = async <T>(task: () => Promise<T>): Promise<T> => {
    const operation = saveQueue
      .catch(error => {
        console.warn('[DICE]ACU runInSaveQueue previous step failed, continue next task:', error);
      })
      .then(task);

    saveQueue = operation
      .then(() => undefined)
      .catch(e => {
        console.error('[DICE]ACU runInSaveQueue error:', getRuntimeErrorLogPayload(e));
      });
    return operation;
  };

  // [新增] 轻量级保存：只保存数据到数据库，不更新快照
  // 使用队列模式确保快速连续编辑时所有修改都能保存成功
  const saveDataOnly = async (tableData, modifiedSheetKeys?: string[]) =>
    runInSaveQueue(() => performSaveDataOnly(tableData, modifiedSheetKeys));

  const findRuntimeSheetEntryForMutation = (
    rawData: unknown,
    tableKey: string,
  ): { key: string; sheet: DiffSheet } | null => {
    const directEntry = findDiffSnapshotEntry(rawData, tableKey, getDiffSheetByKey(rawData, tableKey));
    if (directEntry?.sheet) return directEntry;

    const record = asDiffRecord(rawData);
    if (!record) return null;
    const normalizedTableKey = normalizeDiffText(tableKey);
    if (!normalizedTableKey) return null;
    const normalizedTableKeyLower = normalizedTableKey.toLowerCase();
    const tableNameWithoutPrefix = normalizedTableKeyLower.replace(/^sheet_/, '');

    const getSheetSqlTableName = (sheet: unknown): string => {
      const sheetRecord = asDiffRecord(sheet);
      const sourceData = asDiffRecord(sheetRecord?.sourceData);
      const directName = normalizeDiffText(
        sourceData?.tableName || sourceData?.sqlTableName || sourceData?.databaseTableName,
      );
      if (directName) return directName;
      const ddl = stripCrudSqlComments(sourceData?.ddl || '');
      const match = ddl.match(
        new RegExp(`\\bCREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${CRUD_SQL_IDENTIFIER_PATTERN}`, 'i'),
      );
      return normalizeDiffText(decodeCrudSqlIdentifier(match?.[1], match?.[2], match?.[3], match?.[4]));
    };

    const matchesTargetKey = (candidate: unknown): boolean => {
      const normalizedCandidate = normalizeDiffText(candidate).toLowerCase();
      if (!normalizedCandidate) return false;
      return (
        normalizedCandidate === normalizedTableKeyLower ||
        normalizedCandidate.replace(/^sheet_/, '') === tableNameWithoutPrefix
      );
    };

    const matchedKey = Object.keys(record).find(key => {
      const sheet = record[key];
      if (!isDiffSheet(sheet)) return false;
      const identity = getDiffSheetIdentity(sheet);
      return (
        matchesTargetKey(key) ||
        matchesTargetKey(identity.uid) ||
        matchesTargetKey(identity.name) ||
        matchesTargetKey(getSheetSqlTableName(sheet))
      );
    });
    const matchedSheet = matchedKey ? record[matchedKey] : null;
    return matchedKey && isDiffSheet(matchedSheet) ? { key: matchedKey, sheet: matchedSheet } : null;
  };

  const resolveRuntimeMutationSource = (
    tableKey: string,
  ): { data: unknown; entry: { key: string; sheet: DiffSheet } } | null => {
    const sources = [getTableData({ silent: true }), cachedRawData, loadSnapshot()];
    for (const data of sources) {
      const entry = findRuntimeSheetEntryForMutation(data, tableKey);
      if (entry?.sheet) return { data, entry };
    }
    return null;
  };

  const updateRuntimeDataCacheAfterCrud = (api, fallbackData: unknown, tableKey: string) => {
    const latestData = getTableData({ silent: true });
    const refreshedEntry = findRuntimeSheetEntryForMutation(latestData, tableKey);
    const fallbackEntry = findRuntimeSheetEntryForMutation(fallbackData, tableKey);
    cachedRawData = !fallbackEntry?.sheet || refreshedEntry?.sheet ? latestData || fallbackData : fallbackData;
    api._notifyTableUpdate?.();
    return cachedRawData;
  };

  // [新增] 即时保存单行数据并只更新该行快照
  // 用途：弹窗编辑后立即保存，同时保留其他行的AI变更高亮
  // 注意：不调用 saveDataToDatabase（它会更新完整快照），只更新指定行的快照
  type RuntimeRowSaveContext = {
    tableName?: string;
    headers?: unknown[];
    currentRow?: unknown[];
    sourceData?: unknown;
    sheet?: DiffSheet;
  };

  const saveRowInstantly = createSaveRowInstantly({
    applyExistingRowCellPatchesViaCrud: (...a: any[]) => applyExistingRowCellPatchesViaCrud(...a),
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCrudChangedColumns: (...a: any[]) => getCrudChangedColumns(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getRuntimeErrorLogPayload: (...a: any[]) => getRuntimeErrorLogPayload(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    resolveRuntimeMutationSource: (...a: any[]) => resolveRuntimeMutationSource(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    updateRuntimeDataCacheAfterCrud: (...a: any[]) => updateRuntimeDataCacheAfterCrud(...a),
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

  const appendRowInstantly = createAppendRowInstantly({
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildRowDataForCrud: (...a: any[]) => buildRowDataForCrud(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetRows: (...a: any[]) => getSheetRows(...a),
    resolveRuntimeMutationSource: (...a: any[]) => resolveRuntimeMutationSource(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    updateRuntimeDataCacheAfterCrud: (...a: any[]) => updateRuntimeDataCacheAfterCrud(...a),
  });

  const deleteRowInstantly = async (tableKey: string, rowIndex: number): Promise<void> => {
    await runInSaveQueue(async () => {
      const api = assertRuntimeCrudApi();
      const source = resolveRuntimeMutationSource(tableKey);
      const sourceData = source?.data;
      const entry = source?.entry;
      if (!entry?.sheet?.name || !Array.isArray(entry.sheet.content)) {
        throw new Error(`表格 "${tableKey}" 不存在`);
      }

      const tableName = entry.sheet.name;
      const crudTableName = getCrudTableIdentifier(entry.sheet, tableName);
      const result = await api.deleteRow({ tableName: crudTableName, rowIndex: rowIndex + 1, skipNotify: true });
      if (result === false || result === -1) throw new Error(`删除 "${tableName}" 第 ${rowIndex + 1} 行失败`);

      const fallbackData = cloneRuntimeDataValue(sourceData);
      const fallbackEntry =
        findRuntimeSheetEntryForMutation(fallbackData, entry.key) ||
        findRuntimeSheetEntryForMutation(fallbackData, tableKey);
      if (fallbackEntry?.sheet?.content?.[rowIndex + 1]) fallbackEntry.sheet.content.splice(rowIndex + 1, 1);
      updateRuntimeDataCacheAfterCrud(api, fallbackData, entry.key || tableKey);
    });
  };

  const processJsonData = json => {
    const tables = {};
    if (!json || typeof json !== 'object') return tables;
    for (const sheetId in json) {
      if (json[sheetId]?.name) {
        const sheet = json[sheetId];
        const rows = sheet.content
          ? sheet.content.slice(1).map((row, rowIndex) => {
              if (row && typeof row === 'object') {
                Object.defineProperty(row, GACHA_CATALOG_RAW_ROW_INDEX_PROP, {
                  value: rowIndex,
                  configurable: true,
                });
              }
              return row;
            })
          : [];
        tables[sheet.name] = {
          key: sheetId,
          headers: sheet.content ? sheet.content[0] || [] : [],
          rows,
          rawContent: sheet.content || [],
          exportConfig: sheet.exportConfig || {},
          updateConfig: sheet.updateConfig || {},
          ...sheet,
        };
      }
    }
    return tables;
  };

  // ========================================
  // 智能修改辅助函数
  // ========================================

  // 格式验证智能推算

  // 关联验证下拉选项提取（支持多列 OR 合并）

  // 检查值是否已存在于关联表的任何列中（用于判断是否需要反向写入）

  // 获取同列其他行的示例值（用于 required 规则）

  // 获取数值的最近有效值

  // ========================================
  // [新增] 正则规则列表局部刷新函数 - 避免全量重渲染
  // ========================================
  const refreshRegexRulesList = createRefreshRegexRulesList({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
    RegexTransformationManager: RegexTransformationManager,
  });

  // ========================================
  // 新建/编辑数据验证规则弹窗
  // ========================================
  const showAddValidationRuleModal = createShowAddValidationRuleModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ValidationRuleManager: ValidationRuleManager,
    getCachedRawData: () => cachedRawData,
  });

  // ========================================
  // 智能修改弹窗
  // ========================================
  const showSmartFixModal = createShowSmartFixModal({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    errorTableTemplateIssue: (...a: any[]) => errorTableTemplateIssue(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showTableRuleFixModal: (...a: any[]) => showTableRuleFixModal(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData,
  });

  // ========================================
  // ========================================
  // 配对表编码修复辅助函数
  // ========================================

  // 从表中提取所有编码值

  // 构建编码映射：旧编码 → 新编码

  // 对齐和修复配对表
  // 核心逻辑：
  // 1. 编码为空的行保持原位置不动（这些是错误数据，由必填规则检测）
  // 2. 有效编码行更新编码值，修复跳号
  // 3. 缺失的编码插入空白行，保证两表有编码的行数一致

  // 表级规则智能修改弹窗
  // ========================================
  const showTableRuleFixModal = createShowTableRuleFixModal({
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    getCore: (...a: any[]) => getCore(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveDataOnly: (...a: any[]) => saveDataOnly(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ValidationEngine: ValidationEngine,
  });

  // ========================================
  // 属性预设管理面板
  // ========================================

  const showAttributePresetManager = createShowAttributePresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    readTextFile: (...a: any[]) => readTextFile(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAttributePresetEditor: (...a: any[]) => showAttributePresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showPresetConflictDialog: (...a: any[]) => showPresetConflictDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ATTRIBUTE_QUICK_SELECT_DEFAULT: ATTRIBUTE_QUICK_SELECT_DEFAULT,
    AttributePresetManager: AttributePresetManager,
    JSONC_FILE_ACCEPT: JSONC_FILE_ACCEPT,
    STORAGE_KEY_ACTIVE_ATTR_PRESET: STORAGE_KEY_ACTIVE_ATTR_PRESET,
  });

  // 规则预设编辑器
  const buildNewAttributePresetJsoncTemplate = createBuildNewAttributePresetJsoncTemplate({

  });

  const showAttributePresetEditor = createShowAttributePresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildNewAttributePresetJsoncTemplate: (...a: any[]) => buildNewAttributePresetJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AttributePresetManager: AttributePresetManager,
    attributePresetAgentPromptTemplate: attributePresetAgentPromptTemplate,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 高级骰子预设UI
  // ========================================
  type SortableListOptions = {
    container: JQuery | HTMLElement;
    itemSelector: string;
    handleSelector?: string;
    cancelSelector?: string;
    onOrderChange: (newOrder: string[]) => void;
    getItemId: (item: HTMLElement) => string | null;
    canStartDrag?: () => boolean;
    ghostClass?: string;
    dragClass?: string;
    placeholderClass?: string;
    indicatorClass?: string;
    longPressDelay?: number;
  };

  const createSortableList = createSortableListFactory({

  });

  // 刷新已打开的检定面板的预设按钮
  const refreshDicePanelPresets = () => {
    const { $ } = getCore();
    const $panel = $('.acu-dice-panel');
    if ($panel.length === 0) return; // 面板未打开，无需刷新

    // 重新生成预设按钮HTML
    const presets = AdvancedDicePresetManager.getAllPresets()
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const activePresetId = Store.get(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null) as string | null;
    const lastPresetId = localStorage.getItem(STORAGE_KEY_LAST_PRESET);
    const activeButtonId = activePresetId || lastPresetId || '__custom__';

    let html = `<button type="button" class="acu-dice-quick-preset-btn${activeButtonId === '__custom__' ? ' active' : ''}" data-id="__custom__">自定义</button>`;
    presets.forEach(p => {
      const activeClass = p.id === activeButtonId ? ' active' : '';
      html += `<button type="button" class="acu-dice-quick-preset-btn${activeClass}" data-id="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`;
    });

    // 替换预设按钮区域内容
    $panel.find('#dice-normal-presets').html(html);
  };

  const showPresetListDialog = createShowPresetListDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    readTextFile: (...a: any[]) => readTextFile(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAdvancedPresetEditor: (...a: any[]) => showAdvancedPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    createSortableList: createSortableList,
  });

  const showAdvancedPresetManager = createShowAdvancedPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clearModalStack: (...a: any[]) => clearModalStack(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    saveCrazyModeConfig: (...a: any[]) => saveCrazyModeConfig(...a),
    saveDiceConfig: (...a: any[]) => saveDiceConfig(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAttributePresetManager: (...a: any[]) => showAttributePresetManager(...a),
    showPresetListDialog: (...a: any[]) => showPresetListDialog(...a),
    hideDiceResultsInUserMessages: hideDiceResultsInUserMessages,
  });

  const buildNewAdvancedPresetJsoncTemplate = createBuildNewAdvancedPresetJsoncTemplate({

  });

  const buildAdvancedPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_advanced_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildDashboardPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'dashboard_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_dashboard_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildActionPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'action_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_action_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildRenderPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'render_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_render_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildTableTemplateRequirementPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'table_template_requirement_preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_table_template_requirement_preset_ai_prompt_${safeName}_${datePart}.md`;
  };

  const buildGachaCatalogAgentPromptFilename = (poolName: string): string => {
    const safeName =
      poolName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'gacha_catalog';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_gacha_catalog_ai_prompt_${safeName}_${datePart}.md`;
  };

  const showAdvancedPresetEditor = createShowAdvancedPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildAdvancedPresetAgentPrompt: (...a: any[]) => buildAdvancedPresetAgentPrompt(...a),
    buildAdvancedPresetAgentPromptFilename: (...a: any[]) => buildAdvancedPresetAgentPromptFilename(...a),
    buildNewAdvancedPresetJsoncTemplate: (...a: any[]) => buildNewAdvancedPresetJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getAdvancedPresetErrorMessage: (...a: any[]) => getAdvancedPresetErrorMessage(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseAdvancedPresetText: (...a: any[]) => parseAdvancedPresetText(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDicePanelPresets: (...a: any[]) => refreshDicePanelPresets(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 交互规则预设管理
  // ========================================
  const showActionPresetManager = createShowActionPresetManager({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showActionPresetEditor: (...a: any[]) => showActionPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ActionPresetManager: ActionPresetManager,
  });

  const buildNewActionPresetRulesJsoncTemplate = (): string => `[
  // 这里填写规则数组；每个规则组按表名关键词匹配一类表格。
  {
    // table_keywords：表名中包含任意关键词时，这组 actions 会显示在该表的条目上。
    "table_keywords": ["地点", "地图", "场所"],

    // actions：匹配后显示的快捷按钮。至少需要一个动作。
    "actions": [
      {
        // label：按钮文字，必填，建议短一些。
        "label": "前往",

        // icon：可选 Font Awesome 图标 class；不填时使用默认按钮样式。
        "icon": "fa-location-arrow",

        // template：点击按钮后写入输入框的文本；{Name} 会替换为当前条目的名称。
        "template": "<user>前往{Name}。"
      },
      {
        "label": "调查",
        "icon": "fa-magnifying-glass",
        "template": "<user>仔细调查{Name}的情况。"
      }
    ]
  },
  {
    // 同一预设可以包含多个规则组；后续规则不会覆盖前面的规则，而是按命中的表格一起提供动作。
    "table_keywords": ["人物", "NPC", "角色"],
    "actions": [
      {
        // template 可以使用 <user>、{Name} 和普通文本；复杂提示词建议保持一句话可读。
        "label": "交谈",
        "icon": "fa-comments",
        "template": "<user>与{Name}交谈。"
      },
      {
        "label": "观察",
        "icon": "fa-eye",
        "template": "<user>观察{Name}。"
      }
    ]
  }
]`;

  // 交互规则编辑器（JSON配置风格）
  const showActionPresetEditor = createShowActionPresetEditor({
    buildActionPresetAgentPrompt: (...a: any[]) => buildActionPresetAgentPrompt(...a),
    buildActionPresetAgentPromptFilename: (...a: any[]) => buildActionPresetAgentPromptFilename(...a),
    buildNewActionPresetRulesJsoncTemplate: (...a: any[]) => buildNewActionPresetRulesJsoncTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    ActionPresetManager: ActionPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 仪表盘预设管理
  // ========================================
  const showDashboardPresetManager = createShowDashboardPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDashboardPresetEditor: (...a: any[]) => showDashboardPresetEditor(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DASHBOARD_DEFAULT_PRESET_ID: DASHBOARD_DEFAULT_PRESET_ID,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
    DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    DashboardPresetManager: DashboardPresetManager,
  });

  const showDashboardPresetEditor = createShowDashboardPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDashboardPresetAgentPrompt: (...a: any[]) => buildDashboardPresetAgentPrompt(...a),
    buildDashboardPresetAgentPromptFilename: (...a: any[]) => buildDashboardPresetAgentPromptFilename(...a),
    cloneDashboardPresetModules: (...a: any[]) => cloneDashboardPresetModules(...a),
    createDashboardPresetEditorTemplate: (...a: any[]) => createDashboardPresetEditorTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseDashboardPresetJson: (...a: any[]) => parseDashboardPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DashboardPresetManager: DashboardPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  // 渲染预设管理
  // ========================================
  const showRenderPresetManager = createShowRenderPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showRenderPresetEditor: (...a: any[]) => showRenderPresetEditor(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RENDER_DEFAULT_PRESET_ID: RENDER_DEFAULT_PRESET_ID,
    RenderPresetManager: RenderPresetManager,
  });

  const showRenderPresetEditor = createShowRenderPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildRenderPresetAgentPrompt: (...a: any[]) => buildRenderPresetAgentPrompt(...a),
    buildRenderPresetAgentPromptFilename: (...a: any[]) => buildRenderPresetAgentPromptFilename(...a),
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    createRenderPresetEditorTemplate: (...a: any[]) => createRenderPresetEditorTemplate(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseRenderPresetJson: (...a: any[]) => parseRenderPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RenderPresetManager: RenderPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  // ========================================
  const showDebugConsoleModal = createShowDebugConsoleModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  // ========================================
  // showAddRegexRuleModal - 新建/编辑表格正则规则弹窗 (Phase 4.2)
  // ========================================
  const showAddRegexRuleModal = createShowAddRegexRuleModal({
    getTableData: (...a: any[]) => getTableData(...a),
    refreshRegexRulesList: (...a: any[]) => refreshRegexRulesList(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    RegexTransformationEngine: RegexTransformationEngine,
    RegexTransformationManager: RegexTransformationManager,
    getCachedRawData: () => cachedRawData,
      getCore: (...a: any[]) => getCore(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
});

  // 暴露到全局
  window.showAddRegexRuleModal = showAddRegexRuleModal;

  // 暴露到全局，供紧急入口按钮调用
  window.showDebugConsoleModal = showDebugConsoleModal;

  // ========================================
  // AcuDice 公共 API - 供其他插件和角色卡调用
  // ========================================

  const ACUDICE_READY_EVENT = 'acudice:ready';

  const resolveRootWindow = (): Window => {
    try {
      return window.top ?? window;
    } catch (error) {
      return window;
    }
  };

  const rootWindow = resolveRootWindow();
  const acuDiceReady = new AcuDiceReadyState();
  const acuDicePresets = new AcuDicePresets({
    getAllPresets: () => ActionPresetManager.getAllPresets(),
    getActivePresetId: () => ActionPresetManager.getActivePresetId(),
    getPresetById: (id: string) => ActionPresetManager.getPresetById(id),
  });
  const acuDiceCharacters = new AcuDiceCharacters({
    getRawData: () => cachedRawData || getTableData(),
    processJsonData: (raw: any) => processJsonData(raw),
    findTable: (tables: any, key: string) => DashboardDataParser.findTable(tables, key),
    parseRows: (tableResult: any, key: string) => DashboardDataParser.parseRows(tableResult, key),
    getFullAttributesForCharacter: (name: string) => getFullAttributesForCharacter(name),
    getAttributeValueInternal: (name: string, attribute: string) => getAttributeValue(name, attribute),
  });
  const acuDiceRoll = new AcuDiceRoll({
    evaluateFormula: (expr: string, ctx: any) => evaluateFormula(expr, ctx),
  });
  const acuDiceProfiles = new AcuDiceProfiles({
    refreshDiceProfileIndex: () => refreshDiceProfileIndex(),
    saveCurrentDiceProfile: (o: any) => saveCurrentDiceProfile(o),
    toDiceProfileSummary: (p: any) => toDiceProfileSummary(p),
    importDiceProfile: (i: unknown, o: any) => importDiceProfile(i, o),
    applyDiceProfile: (id: string, o: any) => applyDiceProfile(id, o),
    exportDiceProfile: (id: string) => exportDiceProfile(id),
    detectCharacterDiceProfile: (o: any) => detectCharacterDiceProfile(o),
    getDiceProfileCharacterContext: () => getDiceProfileCharacterContext(),
    getDiceProfilePromptState: (c: string, f: string) => getDiceProfilePromptState(c, f),
    getAcuDiceProfilePromptKey: (c: string, f: string) => getAcuDiceProfilePromptKey(c, f),
  });
  const acuDiceCheck = new AcuDiceCheck({
    getDiceConfig: () => getDiceConfig(),
    getAttributeValueInternal: (name: string, attr: string) => getAttributeValue(name, attr),
    rollComplexDiceExpression: (expr: string, ctx?: any) => rollComplexDiceExpression(expr, ctx),
    appendCheckHistory: (entry: any) => {
      checkHistory.push(entry);
      if (checkHistory.length > MAX_HISTORY) {
        checkHistory.shift();
      }
    },
    emitEvent: (event: string, payload: any) => emitEvent(event, payload),
  });
  const acuDiceContest = new AcuDiceContest({
    getRawData: () => cachedRawData || getTableData(),
    processJsonData: (raw: any) => processJsonData(raw),
    rebuildAliasRegistry: (tables: any) => NameAliasRegistry.rebuild(tables),
    resolveCanonicalCharacterName: (name: string) => resolveCanonicalCharacterName(name),
    getAttributeValueInternal: (name: string, attr: string) => getAttributeValue(name, attr),
    getDiceConfig: () => getDiceConfig(),
    normalizeDiceFormula: (f: string) => normalizeCheckSuggestionDiceFormula(f),
    rollComplexDiceExpression: (expr: string) => rollComplexDiceExpression(expr),
    getSuccessLevel: (roll: number, target: number, sides: number) => getSuccessLevel(roll, target, sides),
    appendContestHistory: (entry: any) => {
      contestHistory.push(entry);
      if (contestHistory.length > MAX_HISTORY) {
        contestHistory.shift();
      }
    },
    emitEvent: (event: string, payload: any) => emitEvent(event, payload),
  });
  const notifyReady = (): void => {
    acuDiceReady.markReady();
  };

  const defineAcuDiceOnWindow = (target: Window) => {
    if ('AcuDice' in target) return;
    Object.defineProperty(target, 'AcuDice', {
      value: AcuDiceAPI,
      writable: false,
      configurable: false,
    });
  };

  const dispatchReadyEvent = (target: Window) => {
    try {
      target.dispatchEvent(new CustomEvent(ACUDICE_READY_EVENT));
    } catch (error) {
      console.warn('[AcuDice] ready 事件触发失败', error);
    }
  };

  // 事件系统
  const acuDiceEvents = new AcuDiceEvents({
    onDiceEvent: (event: string, data: unknown): void => {
      if (event === 'check' || event === 'contest') {
        void DiceHistoryStatsDB.recordEvent(event, data);
        void settleGachaFortuneForDiceEvent(event, data);
      }
    },
  });
  type CheckHistoryEntry = AcuDice.CheckResult & CheckHistoryExtension & { timestamp: number };
  type ContestHistoryEntry = AcuDice.ContestResult & { timestamp: number; detailId?: string; detailLines?: string[] };
  type AcuDiceSharedHistoryStore = {
    checkHistory: CheckHistoryEntry[];
    contestHistory: ContestHistoryEntry[];
    maxHistory: number;
  };
  type RootWindowWithAcuDiceHistory = Window & {
    __AcuDiceHistoryStore__?: AcuDiceSharedHistoryStore;
  };
  const rootWindowWithHistory = rootWindow as RootWindowWithAcuDiceHistory;
  if (!rootWindowWithHistory.__AcuDiceHistoryStore__) {
    rootWindowWithHistory.__AcuDiceHistoryStore__ = {
      checkHistory: [],
      contestHistory: [],
      maxHistory: 100,
    };
  }
  const sharedHistoryStore = rootWindowWithHistory.__AcuDiceHistoryStore__;
  const checkHistory: CheckHistoryEntry[] = sharedHistoryStore.checkHistory;
  const contestHistory: ContestHistoryEntry[] = sharedHistoryStore.contestHistory;
  const acuDiceHistory = new AcuDiceHistory({
    getCheckHistory: () => checkHistory,
    getContestHistory: () => contestHistory,
  });
  const MAX_HISTORY = sharedHistoryStore.maxHistory;

  const globalExpandedHistoryIds = new Set<string>();
  let globalHistoryFilterStatus = 'all';
  let globalHistoryKeyword = '';
  let globalHistoryStatsScope: DiceStatsScope = 'chat';

  const copyTextWithTavernApi = async (text: string): Promise<boolean> => {
    try {
      if (window.TavernHelper && window.TavernHelper.triggerSlash) {
        const safeContent = text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\{/g, '\\{')
          .replace(/\}/g, '\\}');
        await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
        return true;
      }
    } catch (error) {
      console.warn('[DICE] history copy via TavernHelper failed:', error);
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('[DICE] history copy via navigator.clipboard failed:', error);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('[DICE] history copy fallback failed:', error);
      return false;
    }
  };

  const showGlobalDiceHistoryDialog = createShowGlobalDiceHistoryDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    copyTextWithTavernApi: (...a: any[]) => copyTextWithTavernApi(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderDiceHistoryStatsHtml: (...a: any[]) => renderDiceHistoryStatsHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    DiceHistoryStatsDB: DiceHistoryStatsDB,
    checkHistory: checkHistory,
    contestHistory: contestHistory,
    globalExpandedHistoryIds: globalExpandedHistoryIds,
    getGlobalHistoryKeyword: () => globalHistoryKeyword,
    setGlobalHistoryKeyword: (v: any) => { globalHistoryKeyword = v; },
    getGlobalHistoryFilterStatus: () => globalHistoryFilterStatus,
    setGlobalHistoryFilterStatus: (v: any) => { globalHistoryFilterStatus = v; },
    getGlobalHistoryStatsScope: () => globalHistoryStatsScope,
    setGlobalHistoryStatsScope: (v: any) => { globalHistoryStatsScope = v; },
  });

  const emitEvent = (event: string, data: unknown): void => {
    acuDiceEvents.emit(event, data);
  };

  type CheckSuggestionTieRule = 'initiator_win' | 'initiator_lose' | 'tie';
  type CheckSuggestionCriteria = 'lte' | 'gte';
  type CheckSuggestionRawParams = Record<string, string>;
  type CheckSuggestionParamValue = string | number | boolean;
  type CheckSuggestionParams = Record<string, CheckSuggestionParamValue>;
  type CheckSuggestionParsedCommand =
    | {
        kind: 'check';
        characterName: string;
        attributeName: string;
        diceType: string;
        hasExplicitDice: boolean;
        targetValue: number | null;
        criteria: CheckSuggestionCriteria;
        rawParams: CheckSuggestionRawParams;
      }
    | {
        kind: 'contest';
        leftName: string;
        leftAttribute: string;
        rightName: string;
        rightAttribute: string;
        diceType: string;
        hasExplicitDice: boolean;
        tieRule: CheckSuggestionTieRule;
        hasExplicitTieRule: boolean;
        rawParams: CheckSuggestionRawParams;
      }
    | { kind: 'fixed'; success: boolean }
    | { kind: 'none' }
    | { kind: 'invalid'; reason: string };

  const extractCheckSuggestionParams = (text: string): { rest: string; rawParams: CheckSuggestionRawParams } => {
    const rawParams: CheckSuggestionRawParams = {};
    const tokens = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const restTokens: string[] = [];
    tokens.forEach(token => {
      const match = token.match(/^([^=\s]+)=([^\s]+)$/);
      if (!match) {
        restTokens.push(token);
        return;
      }
      rawParams[match[1]] = match[2];
    });
    return {
      rest: restTokens.join(' '),
      rawParams,
    };
  };

  const normalizeCheckSuggestionDiceFormula = (rawFormula: string): string => {
    const cleaned = String(rawFormula || '')
      .trim()
      .replace(/^[.。]/, '')
      .replace(/^r(?=\d*d)/i, '');
    return cleaned || '1d100';
  };

  const extractCheckSuggestionDiceFormula = (
    text: string,
  ): { rest: string; diceType: string; hasExplicitDice: boolean } => {
    const match = text.match(/(^|\s)([.。]?r?(?:\d*)d(?:\d+|F)(?:[a-z]+\d+)?)(?=$|\s)/i);
    if (!match || match.index === undefined) return { rest: text, diceType: '1d100', hasExplicitDice: false };
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);
    return {
      rest: `${before} ${after}`.replace(/\s+/g, ' ').trim(),
      diceType: normalizeCheckSuggestionDiceFormula(match[2]),
      hasExplicitDice: true,
    };
  };

  const extractCheckSuggestionTarget = (
    text: string,
  ): { rest: string; targetValue: number | null; criteria: CheckSuggestionCriteria } => {
    const match = text.match(/(<=|≤|>=|≥|<|>|=)\s*(\d{1,4})/);
    if (!match || match.index === undefined) return { rest: text, targetValue: null, criteria: 'lte' };
    const operator = match[1];
    const targetValue = parseInt(match[2], 10);
    const criteria: CheckSuggestionCriteria = operator === '>=' || operator === '≥' || operator === '>' ? 'gte' : 'lte';
    return {
      rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}`.replace(/\s+/g, ' ').trim(),
      targetValue: Number.isNaN(targetValue) ? null : targetValue,
      criteria,
    };
  };

  const parseCheckSuggestionTieRule = (rawRule: string): CheckSuggestionTieRule => {
    const rule = rawRule.trim().toLowerCase();
    if (/(发起方|左方|initiator|left).*(成功|胜|赢|win)/.test(rule) || rule === '发起方成功') {
      return 'initiator_win';
    }
    if (/^(平局|平手|tie|保留平局)$/.test(rule)) {
      return 'tie';
    }
    return 'initiator_lose';
  };

  const extractCheckSuggestionTieRule = (
    text: string,
  ): { rest: string; tieRule: CheckSuggestionTieRule; hasExplicitTieRule: boolean } => {
    const match = text.match(/平局\s*=\s*([^\s，,。；;]+)/);
    if (!match || match.index === undefined)
      return { rest: text, tieRule: 'initiator_lose', hasExplicitTieRule: false };
    return {
      rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}`.replace(/\s+/g, ' ').trim(),
      tieRule: parseCheckSuggestionTieRule(match[1]),
      hasExplicitTieRule: true,
    };
  };

  const parseCheckSuggestionSide = (text: string): { name: string; attribute: string } | null => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return null;
    return {
      name: parts[0],
      attribute: parts.slice(1).join(' '),
    };
  };

  const normalizeCheckSuggestionSideShorthand = (text: string): string => {
    const trimmed = String(text || '').trim();
    const match = trimmed.match(/^([^=\s]+)[.。:：/]([^=\s]+)$/);
    if (!match) return trimmed;
    return `${match[1]} ${match[2]}`;
  };

  const normalizeLeadingCheckSuggestionSideShorthand = (text: string): string => {
    const parts = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return '';
    return [normalizeCheckSuggestionSideShorthand(parts[0]), ...parts.slice(1)].join(' ');
  };

  const normalizeCheckSuggestionCommandInput = (rawCommand: string): string => {
    let command = String(rawCommand || '')
      .replace(/^[\s"'`“”‘’「」『』]+|[\s"'`“”‘’「」『』]+$/g, '')
      .replace(/[，,；;]\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    command = command
      .replace(/^对抗(?:检定)?\s*[:：]\s*/, '对抗 ')
      .replace(/^对抗检定\s+/, '对抗 ')
      .replace(/^普通检定\s*[:：]\s*/, '检定 ')
      .replace(/^普通检定\s+/, '检定 ')
      .replace(/^检定\s*[:：]\s*/, '检定 ');

    if (command.startsWith('检定 ')) {
      return `检定 ${normalizeLeadingCheckSuggestionSideShorthand(command.replace(/^检定\s+/, ''))}`.trim();
    }

    if (command.startsWith('对抗 ')) {
      const contestBody = command
        .replace(/^对抗\s+/, '')
        .replace(/\s*[VvＶｖ][SsＳｓ]\s*/g, ' vs ')
        .replace(/\s+(?:对|对抗)\s+/g, ' vs ')
        .replace(/\s+/g, ' ')
        .trim();
      const normalizedSides = contestBody
        .split(/\s+vs\s+/i)
        .map(normalizeLeadingCheckSuggestionSideShorthand)
        .join(' vs ');
      return `对抗 ${normalizedSides}`.trim();
    }

    return command;
  };

  const buildCheckSuggestionInvalidCommandMessage = (reason: string): string => {
    const normalizedReason = String(reason || '骰子命令解析失败').trim();
    const separator = /[。！？!?]$/.test(normalizedReason) ? '' : '。';
    return `${normalizedReason}${separator}解决方法：请重新填写“检定建议表”，或检查表格模板中的提示词；骰子命令应写成“检定 角色 属性”或“对抗 角色 属性 vs 角色 属性”。`;
  };

  const parseCheckSuggestionCommand = createParseCheckSuggestionCommand({
    extractCheckSuggestionDiceFormula: (...a: any[]) => extractCheckSuggestionDiceFormula(...a),
    extractCheckSuggestionParams: (...a: any[]) => extractCheckSuggestionParams(...a),
    extractCheckSuggestionTarget: (...a: any[]) => extractCheckSuggestionTarget(...a),
    extractCheckSuggestionTieRule: (...a: any[]) => extractCheckSuggestionTieRule(...a),
    normalizeCheckSuggestionCommandInput: (...a: any[]) => normalizeCheckSuggestionCommandInput(...a),
    parseCheckSuggestionSide: (...a: any[]) => parseCheckSuggestionSide(...a),
  });

  const normalizeCheckSuggestionActionText = (displayText: string): string => {
    const text = String(displayText || '').trim();
    if (!text) return '';
    return `${text}${/[。！？!?…]$/.test(text) ? '' : '。'}`;
  };

  const refreshNameAliasesForCheckSuggestion = () => {
    try {
      const rawDataForAlias = cachedRawData || getTableData();
      if (rawDataForAlias) {
        NameAliasRegistry.rebuild(processJsonData(rawDataForAlias || {}));
      }
    } catch (error) {
      console.warn('[DICE] 检定建议刷新角色别名失败', error);
    }
  };

  const resolveCheckSuggestionCharacterName = (name: string): string => {
    const trimmed = String(name || '').trim();
    return resolveCanonicalCharacterName(trimmed);
  };

  const getCheckSuggestionDiceSides = (formula: string): number => {
    const match = String(formula || '').match(/\d*d(\d+)/i);
    if (!match) return 100;
    const sides = parseInt(match[1], 10);
    return Number.isNaN(sides) ? 100 : sides;
  };

  const buildCheckSuggestionMetaBlock = (line: string): string => `<meta:检定结果>\n${line}\n</meta:检定结果>`;

  const parseCheckSuggestionPrimitiveValue = (value: string): CheckSuggestionParamValue => {
    const trimmed = String(value || '').trim();
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (/^(true|是|启用|开启)$/i.test(trimmed)) return true;
    if (/^(false|否|禁用|关闭)$/i.test(trimmed)) return false;
    return trimmed;
  };

  const normalizeCheckSuggestionParams = (
    rawParams: CheckSuggestionRawParams,
    preset: AdvancedDicePreset,
  ): CheckSuggestionParams => {
    const normalized: CheckSuggestionParams = {};
    const aliases = preset.checkSuggestionAliases;
    const normalizeSidePrefixedKey = (rawKey: string): { key: string; valueAliasKey: string } => {
      const lowerKey = rawKey.toLowerCase();
      const sidePrefix = lowerKey.startsWith('left') ? 'left' : lowerKey.startsWith('right') ? 'right' : '';
      if (!sidePrefix) {
        const canonicalKey = aliases?.params?.[rawKey] || rawKey;
        return { key: canonicalKey, valueAliasKey: canonicalKey };
      }
      const prefixLength = sidePrefix.length;
      const stripped = rawKey.slice(prefixLength);
      if (!stripped) return { key: rawKey, valueAliasKey: rawKey };
      const normalizedStripped = stripped.charAt(0).toLowerCase() + stripped.slice(1);
      const canonicalStripped = aliases?.params?.[stripped] || aliases?.params?.[normalizedStripped] || normalizedStripped;
      const sideKey = `${sidePrefix}${canonicalStripped.charAt(0).toUpperCase()}${canonicalStripped.slice(1)}`;
      return { key: sideKey, valueAliasKey: canonicalStripped };
    };
    Object.entries(rawParams).forEach(([rawKey, rawValue]) => {
      if (rawKey === 'preset') return;
      const { key: canonicalKey, valueAliasKey } = normalizeSidePrefixedKey(rawKey);
      const valueAliases = aliases?.values?.[canonicalKey] || aliases?.values?.[valueAliasKey] || {};
      const aliasedValue = valueAliases[rawValue];
      normalized[canonicalKey] =
        aliasedValue !== undefined ? aliasedValue : parseCheckSuggestionPrimitiveValue(rawValue);
    });
    return normalized;
  };

  const parseCheckSuggestionModifierValue = (value: string): number => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return 0;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
    const rollResult = rollComplexDiceExpression(trimmed);
    if (!Number.isNaN(rollResult.total)) return rollResult.total;
    const formulaValue = evaluateFormula(trimmed, {});
    return Number.isFinite(formulaValue) ? formulaValue : 0;
  };

  const resolveCheckSuggestionDefaultValue = (
    defaultValue: number | string | boolean | undefined,
    context: Record<string, number>,
  ): number => {
    if (defaultValue === undefined || defaultValue === '') return 0;
    if (typeof defaultValue === 'number') return defaultValue;
    if (typeof defaultValue === 'boolean') return defaultValue ? 1 : 0;
    const result = evaluateFormula(String(defaultValue), context);
    return Number.isFinite(result) ? result : 0;
  };

  const resolveCheckSuggestionNumberParam = (
    value: CheckSuggestionParamValue | undefined,
    characterName: string,
    fallback: number,
    options?: { preferAttribute?: boolean },
  ): number => {
    if (value === undefined || value === '') return fallback;
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    const text = String(value).trim();
    if (!text) return fallback;
    if (options?.preferAttribute !== false) {
      const attrValue = getAttributeValue(characterName, text);
      if (attrValue !== null) return attrValue;
    }
    const parsed = parseCheckSuggestionModifierValue(text);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const getCheckSuggestionMappedTarget = (
    preset: AdvancedDicePreset,
    attrName: string,
    attrSource?: CharacterAttributeSource,
  ): AttributeQuickSelectTarget => {
    return resolveQuickSelectTarget(attrName, attrSource, preset, 'normal');
  };

  const getCheckSuggestionOutcomeResultType = (outcome: OutcomeLevel): string => {
    if (outcome.priority <= 10) return 'critSuccess';
    if (outcome.priority <= 30) return 'extremeSuccess';
    if (outcome.priority < 50) return 'success';
    if (outcome.priority === 50) return 'warning';
    if (outcome.priority < 90) return 'failure';
    return 'critFailure';
  };

  const isCheckSuggestionOutcomeSuccess = (outcome: OutcomeLevel): boolean => {
    return (
      getCheckSuggestionOutcomeResultType(outcome) === 'critSuccess' ||
      getCheckSuggestionOutcomeResultType(outcome) === 'extremeSuccess' ||
      getCheckSuggestionOutcomeResultType(outcome) === 'success'
    );
  };

  const resolveCheckSuggestionFieldValue = (
    field: CustomFieldConfig,
    params: CheckSuggestionParams,
    characterName: string,
  ): string | number | boolean => {
    const rawValue = params[field.id];
    if (rawValue === undefined || rawValue === '') return field.defaultValue;
    if (field.type === 'number') {
      return resolveCheckSuggestionNumberParam(rawValue, characterName, Number(field.defaultValue) || 0);
    }
    if (field.type === 'toggle') {
      if (typeof rawValue === 'boolean') return rawValue;
      return /^(true|是|启用|开启|1)$/i.test(String(rawValue));
    }
    if (field.type === 'select') {
      if (typeof rawValue === 'number' || typeof rawValue === 'boolean') return rawValue;
      const parsed = parseCheckSuggestionPrimitiveValue(String(rawValue));
      return parsed;
    }
    return rawValue;
  };

  interface CheckSuggestionPresetSideResult {
    characterName: string;
    attributeName: string;
    attrValue: number;
    attrMod: number;
    dc: number;
    mod: number;
    skillMod: number;
    customValues: Record<string, string | number | boolean>;
    derivedValues: Record<string, number>;
    diceExpression: string;
    rollResult: RollResult;
    rollTotal: number;
    context: Record<string, string | number | boolean | RollResult>;
    outcome: OutcomeLevel;
    conditionExpr: string;
    judgeResultText: string;
    displayValue: string | number;
    outputVars: Record<string, string | number | boolean>;
  }

  const replaceCheckSuggestionConditionVars = (
    expression: string,
    context: Record<string, string | number | boolean | RollResult>,
    rollResult: RollResult,
  ): string => {
    let result = expression.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
      return (rollResult.tags ?? []).includes(tag) ? '成立' : '不成立';
    });
    result = result.replace(/\$roll\.total/g, String(rollResult.total)).replace(/\$roll/g, String(rollResult.total));
    const keys = Object.keys(context)
      .filter(key => key !== '$roll' && key !== '$roll.total')
      .sort((a, b) => b.length - a.length);
    keys.forEach(key => {
      const value = context[key];
      if (typeof value === 'object') return;
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(safeKey, 'g'), String(value));
    });
    return result.replace(/\s*\+\s*0(?=\s*[+\->=<]|\s*$)/g, '').replace(/^\s*0\s*\+\s*/g, '');
  };

  const evaluateCheckSuggestionOutcome = (
    preset: AdvancedDicePreset,
    context: Record<string, string | number | boolean | RollResult>,
  ): AdvancedPresetOutcomePolicyResult => {
    const matchedOutcome = evaluateOutcomes(preset.outcomes, context as Record<string, number>);
    return applyAdvancedPresetOutcomePolicy(preset, matchedOutcome, context);
  };

  const buildCheckSuggestionPresetSide = createBuildCheckSuggestionPresetSide({
    evaluateCheckSuggestionOutcome: (...a: any[]) => evaluateCheckSuggestionOutcome(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    evaluateConditionNumber: (...a: any[]) => evaluateConditionNumber(...a),
    getAdvancedPresetDisplayOutcome: (...a: any[]) => getAdvancedPresetDisplayOutcome(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    getCheckSuggestionMappedTarget: (...a: any[]) => getCheckSuggestionMappedTarget(...a),
    replaceCheckSuggestionConditionVars: (...a: any[]) => replaceCheckSuggestionConditionVars(...a),
    resolveCheckSuggestionDefaultValue: (...a: any[]) => resolveCheckSuggestionDefaultValue(...a),
    resolveCheckSuggestionFieldValue: (...a: any[]) => resolveCheckSuggestionFieldValue(...a),
    resolveCheckSuggestionNumberParam: (...a: any[]) => resolveCheckSuggestionNumberParam(...a),
  });

  const buildCheckSuggestionSideParams = (
    params: CheckSuggestionParams,
    side: 'left' | 'right',
  ): CheckSuggestionParams => {
    const result: CheckSuggestionParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'preset') return;
      const lowerKey = key.toLowerCase();
      const isLeft = lowerKey.startsWith('left');
      const isRight = lowerKey.startsWith('right');
      if (!isLeft && !isRight) {
        result[key] = value;
        return;
      }
      if ((side === 'left' && isLeft) || (side === 'right' && isRight)) {
        const prefixLength = side === 'left' ? 4 : 5;
        const stripped = key.slice(prefixLength);
        const normalizedKey = stripped ? stripped.charAt(0).toLowerCase() + stripped.slice(1) : key;
        result[normalizedKey] = value;
      }
    });
    return result;
  };

  const resolveCheckSuggestionContestWinner = createResolveCheckSuggestionContestWinner({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  const executeAdvancedCheckSuggestion = createExecuteAdvancedCheckSuggestion({
    buildCheckSuggestionPresetSide: (...a: any[]) => buildCheckSuggestionPresetSide(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    getNamedCheckParamText: (...a: any[]) => getNamedCheckParamText(...a),
    isCheckSuggestionOutcomeSuccess: (...a: any[]) => isCheckSuggestionOutcomeSuccess(...a),
    normalizeCheckSuggestionParams: (...a: any[]) => normalizeCheckSuggestionParams(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    DEFAULT_OUTPUT_TEMPLATE: DEFAULT_OUTPUT_TEMPLATE,
    MAX_HISTORY: MAX_HISTORY,
    checkHistory: checkHistory,
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const executeAdvancedContestCheckSuggestion = createExecuteAdvancedContestCheckSuggestion({
    buildCheckSuggestionPresetSide: (...a: any[]) => buildCheckSuggestionPresetSide(...a),
    buildCheckSuggestionSideParams: (...a: any[]) => buildCheckSuggestionSideParams(...a),
    buildCheckValueText: (...a: any[]) => buildCheckValueText(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    formatOutputTemplate: (...a: any[]) => formatOutputTemplate(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    getNamedCheckParamText: (...a: any[]) => getNamedCheckParamText(...a),
    normalizeCheckSuggestionParams: (...a: any[]) => normalizeCheckSuggestionParams(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    resolveCheckSuggestionContestWinner: (...a: any[]) => resolveCheckSuggestionContestWinner(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
    DEFAULT_CONTEST_OUTPUT_TEMPLATE: DEFAULT_CONTEST_OUTPUT_TEMPLATE,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });

  const executeFixedCheckSuggestion = (success: boolean) => {
    const label = success ? '必定成功' : '必定失败';
    smartInsertToTextarea(buildCheckSuggestionMetaBlock(`元叙事：无需投骰，【${label}】。`), 'dice');
  };

  const executeNormalCheckSuggestion = createExecuteNormalCheckSuggestion({
    buildCheckSuggestionMetaBlock: (...a: any[]) => buildCheckSuggestionMetaBlock(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCheckSuggestionDiceSides: (...a: any[]) => getCheckSuggestionDiceSides(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    MAX_HISTORY: MAX_HISTORY,
    checkHistory: checkHistory,
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const executeContestCheckSuggestion = createExecuteContestCheckSuggestion({
    buildCheckSuggestionMetaBlock: (...a: any[]) => buildCheckSuggestionMetaBlock(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCheckSuggestionDiceSides: (...a: any[]) => getCheckSuggestionDiceSides(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    refreshNameAliasesForCheckSuggestion: (...a: any[]) => refreshNameAliasesForCheckSuggestion(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    resolveCheckSuggestionCharacterName: (...a: any[]) => resolveCheckSuggestionCharacterName(...a),
    MAX_HISTORY: MAX_HISTORY,
    contestHistory: contestHistory,
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const executeCheckSuggestionCommand = createExecuteCheckSuggestionCommand({
    buildCheckSuggestionInvalidCommandMessage: (...a: any[]) => buildCheckSuggestionInvalidCommandMessage(...a),
    executeAdvancedCheckSuggestion: (...a: any[]) => executeAdvancedCheckSuggestion(...a),
    executeAdvancedContestCheckSuggestion: (...a: any[]) => executeAdvancedContestCheckSuggestion(...a),
    executeContestCheckSuggestion: (...a: any[]) => executeContestCheckSuggestion(...a),
    executeFixedCheckSuggestion: (...a: any[]) => executeFixedCheckSuggestion(...a),
    executeNormalCheckSuggestion: (...a: any[]) => executeNormalCheckSuggestion(...a),
    normalizeCheckSuggestionActionText: (...a: any[]) => normalizeCheckSuggestionActionText(...a),
    parseCheckSuggestionCommand: (...a: any[]) => parseCheckSuggestionCommand(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
  });

  /**
   * AcuDice 公共 API
   * 提供骰子投掷和检定功能给外部插件使用
   */
  const AcuDiceAPI = createAcuDiceAPI({
    acuDiceCharacters: acuDiceCharacters,
    acuDiceCheck: acuDiceCheck,
    acuDiceContest: acuDiceContest,
    acuDiceEvents: acuDiceEvents,
    acuDiceHistory: acuDiceHistory,
    acuDicePresets: acuDicePresets,
    acuDiceReady: acuDiceReady,
    acuDiceRoll: acuDiceRoll,
    acuDiceProfiles: acuDiceProfiles,
  });

  // ========================================
  // ========================================
  // 收藏夹面板 (旧弹窗版本 - 已废弃，保留用于兼容)
  // 新版本使用 renderFavoritesPanel() + bindFavoritesEvents() 面板模式
  // ========================================
  /** @deprecated 使用新的面板模式 renderFavoritesPanel() 替代 */
  const showFavoritesPanel = createShowFavoritesPanel({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showFavoriteEditModal: (...a: any[]) => showFavoriteEditModal(...a),
    showNewFavoriteModal: (...a: any[]) => showNewFavoriteModal(...a),
    showSendToTableModal: (...a: any[]) => showSendToTableModal(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData,
  });

  // 收藏卡片编辑弹窗
  const showFavoriteEditModal = createShowFavoriteEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 标签输入弹窗（替代浏览器原生 prompt）
  const showTagInputModal = createShowTagInputModal({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 新建收藏弹窗（选择模板）
  const showNewFavoriteModal = createShowNewFavoriteModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // 发送到表格弹窗
  const showSendToTableModal = createShowSendToTableModal({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

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

  const findTemplateRequirementSheet = createFindTemplateRequirementSheet({
    templateTextIncludesAny: (...a: any[]) => templateTextIncludesAny(...a),
  });

  const inspectTableTemplate = createInspectTableTemplate({
    findTemplateRequirementSheet: (...a: any[]) => findTemplateRequirementSheet(...a),
    templateTextIncludesAny: (...a: any[]) => templateTextIncludesAny(...a),
    TEMPLATE_TABLE_REQUIREMENTS: TEMPLATE_TABLE_REQUIREMENTS,
  });

  const getTemplateInspectionSeverityMeta = (
    severity: TemplateInspectionSeverity,
  ): { label: string; icon: string; color: string } => {
    if (severity === 'error') return { label: '严重', icon: 'fa-circle-xmark', color: 'var(--acu-error-text)' };
    if (severity === 'warning')
      return { label: '警告', icon: 'fa-triangle-exclamation', color: 'var(--acu-warning-text)' };
    return { label: '提示', icon: 'fa-circle-info', color: 'var(--acu-hl-diff)' };
  };

  const repairCurrentTableTemplateFromPreset = createRepairCurrentTableTemplateFromPreset({
    getCore: (...a: any[]) => getCore(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showTemplateInspectionModal: (...a: any[]) => showTemplateInspectionModal(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const showTemplateInspectionResultModal = createShowTemplateInspectionResultModal({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTemplateInspectionSeverityMeta: (...a: any[]) => getTemplateInspectionSeverityMeta(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    repairCurrentTableTemplateFromPreset: (...a: any[]) => repairCurrentTableTemplateFromPreset(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    LATEST_TABLE_TEMPLATE_URL: LATEST_TABLE_TEMPLATE_URL,
  });

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

  const showTableTemplateRequirementPresetEditor = createShowTableTemplateRequirementPresetEditor({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildNewTableTemplateRequirementPresetJsoncTemplate: (...a: any[]) => buildNewTableTemplateRequirementPresetJsoncTemplate(...a),
    buildTableTemplateRequirementPresetAgentPrompt: (...a: any[]) => buildTableTemplateRequirementPresetAgentPrompt(...a),
    buildTableTemplateRequirementPresetAgentPromptFilename: (...a: any[]) => buildTableTemplateRequirementPresetAgentPromptFilename(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTableTemplateRequirementPresetStats: (...a: any[]) => getTableTemplateRequirementPresetStats(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseTableTemplateRequirementPresetJson: (...a: any[]) => parseTableTemplateRequirementPresetJson(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showTableTemplateRequirementPresetManager: (...a: any[]) => showTableTemplateRequirementPresetManager(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
    validateJsoncEditorConfig: validateJsoncEditorConfig,
  });

  const showTableTemplateRequirementPresetManager = createShowTableTemplateRequirementPresetManager({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getTableTemplateRequirementPresetStats: (...a: any[]) => getTableTemplateRequirementPresetStats(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    popModal: (...a: any[]) => popModal(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showTableTemplateRequirementPresetEditor: (...a: any[]) => showTableTemplateRequirementPresetEditor(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const showSettingsModal = createShowSettingsModal({
    areAllTablesReversed: (...a: any[]) => areAllTablesReversed(...a),
    clearDiceLocalCacheData: (...a: any[]) => clearDiceLocalCacheData(...a),
    clearModalStack: (...a: any[]) => clearModalStack(...a),
    convertTavernRegexToRule: (...a: any[]) => convertTavernRegexToRule(...a),
    createSortableList: (...a: any[]) => createSortableList(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCurrentChatAvatarNodes: (...a: any[]) => getCurrentChatAvatarNodes(...a),
    getHiddenTables: (...a: any[]) => getHiddenTables(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    pushModal: (...a: any[]) => pushModal(...a),
    refreshDialogueIndentRender: (...a: any[]) => refreshDialogueIndentRender(...a),
    refreshRegexRulesList: (...a: any[]) => refreshRegexRulesList(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    saveHiddenTables: (...a: any[]) => saveHiddenTables(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    scheduleDialogueIndentRender: (...a: any[]) => scheduleDialogueIndentRender(...a),
    setAllTablesReverse: (...a: any[]) => setAllTablesReverse(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showActionPresetManager: (...a: any[]) => showActionPresetManager(...a),
    showAddRegexRuleModal: (...a: any[]) => showAddRegexRuleModal(...a),
    showAddValidationRuleModal: (...a: any[]) => showAddValidationRuleModal(...a),
    showAttributePresetManager: (...a: any[]) => showAttributePresetManager(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    showCustomTableNameIconManager: (...a: any[]) => showCustomTableNameIconManager(...a),
    showDashboardPresetManager: (...a: any[]) => showDashboardPresetManager(...a),
    showDebugConsoleModal: (...a: any[]) => showDebugConsoleModal(...a),
    showDiceConfigBackupDialog: (...a: any[]) => showDiceConfigBackupDialog(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showManualUpdateDialog: (...a: any[]) => showManualUpdateDialog(...a),
    showPresetConflictDialog: (...a: any[]) => showPresetConflictDialog(...a),
    showPresetListDialog: (...a: any[]) => showPresetListDialog(...a),
    showRenderPresetManager: (...a: any[]) => showRenderPresetManager(...a),
    showTableTemplateRequirementPresetManager: (...a: any[]) => showTableTemplateRequirementPresetManager(...a),
    showTemplateInspectionModal: (...a: any[]) => showTemplateInspectionModal(...a),
    BUILTIN_REGEX_RULES: BUILTIN_REGEX_RULES,
    DATA_VALIDATION_DEPRECATED_META: DATA_VALIDATION_DEPRECATED_META,
    FONTS: FONTS,
    PresetManager: PresetManager,
    RegexPresetManager: RegexPresetManager,
    RegexTransformationManager: RegexTransformationManager,
    STORAGE_KEY_REGEX_ACTIVE_PRESET: STORAGE_KEY_REGEX_ACTIVE_PRESET,
    STORAGE_KEY_REGEX_RULES: STORAGE_KEY_REGEX_RULES,
    THEMES: THEMES,
    ValidationRuleManager: ValidationRuleManager,
    getCachedRawData: () => cachedRawData,
    getIsSettingsOpen: () => isSettingsOpen,
    setIsSettingsOpen: (v: any) => { isSettingsOpen = v; },
  });

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

  const updateFloatingCollapseBounds = createUpdateFloatingCollapseBounds({
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getFloatingCollapsePosition: (...a: any[]) => getFloatingCollapsePosition(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

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

  const updateViewportWrapperBounds = createUpdateViewportWrapperBounds({
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportAnchorRect: (...a: any[]) => getViewportAnchorRect(...a),
    getViewportBottomOffset: (...a: any[]) => getViewportBottomOffset(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
  });

  const updateFixedWrapperBounds = createUpdateFixedWrapperBounds({
    getConfig: (...a: any[]) => getConfig(...a),
    getFixedModeAnchorRect: (...a: any[]) => getFixedModeAnchorRect(...a),
    getFixedWrapperParentMetrics: (...a: any[]) => getFixedWrapperParentMetrics(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    TABLET_FIXED_NAV_FULL_WIDTH_MAX: TABLET_FIXED_NAV_FULL_WIDTH_MAX,
  });

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
    if (isSettingsOpen) {
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
  const _renderInterfaceImpl = createRenderInterfaceImpl({
    applyStoredPanelHeight: (...a: any[]) => applyStoredPanelHeight(...a),
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    bindEvents: (...a: any[]) => bindEvents(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    bindOptionEvents: (...a: any[]) => bindOptionEvents(...a),
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    createAutoRegexTransformKey: (...a: any[]) => createAutoRegexTransformKey(...a),
    createElementFromHtml: (...a: any[]) => createElementFromHtml(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getActivePanelHeightKey: (...a: any[]) => getActivePanelHeightKey(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getCheckSuggestionItemsFromTable: (...a: any[]) => getCheckSuggestionItemsFromTable(...a),
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getFloatingCollapsePosition: (...a: any[]) => getFloatingCollapsePosition(...a),
    getHiddenTables: (...a: any[]) => getHiddenTables(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getNavigationFontMetrics: (...a: any[]) => getNavigationFontMetrics(...a),
    getOptionItemsFromTable: (...a: any[]) => getOptionItemsFromTable(...a),
    getOptionsCollapsedState: (...a: any[]) => getOptionsCollapsedState(...a),
    getSavedTableOrder: (...a: any[]) => getSavedTableOrder(...a),
    getStoredPanelHeight: (...a: any[]) => getStoredPanelHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    hideDiceResultsInUserMessages: (...a: any[]) => hideDiceResultsInUserMessages(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    injectIndependentOptions: (...a: any[]) => injectIndependentOptions(...a),
    insertHtmlToPage: (...a: any[]) => insertHtmlToPage(...a),
    isCheckSuggestionTableName: (...a: any[]) => isCheckSuggestionTableName(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    isOptionTableName: (...a: any[]) => isOptionTableName(...a),
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    rememberAutoRegexTransform: (...a: any[]) => rememberAutoRegexTransform(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderCheckSuggestionOptionButtonHtml: (...a: any[]) => renderCheckSuggestionOptionButtonHtml(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    renderOptionButtonHtml: (...a: any[]) => renderOptionButtonHtml(...a),
    renderTableContent: (...a: any[]) => renderTableContent(...a),
    saveSheetsViaJsonFloorWithoutTracking: (...a: any[]) => saveSheetsViaJsonFloorWithoutTracking(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setupFixedWrapperBoundsListeners: (...a: any[]) => setupFixedWrapperBoundsListeners(...a),
    setupFloatingCollapseBoundsListeners: (...a: any[]) => setupFloatingCollapseBoundsListeners(...a),
    setupViewportBoundsListeners: (...a: any[]) => setupViewportBoundsListeners(...a),
    shouldSkipAutoRegexTransform: (...a: any[]) => shouldSkipAutoRegexTransform(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    updateFixedWrapperBounds: (...a: any[]) => updateFixedWrapperBounds(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    updateSaveButtonState: (...a: any[]) => updateSaveButtonState(...a),
    updateViewportWrapperBounds: (...a: any[]) => updateViewportWrapperBounds(...a),
    ACTION_BUTTONS: ACTION_BUTTONS,
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
    MvuModule: MvuModule,
    RegexTransformationEngine: RegexTransformationEngine,
    RegexTransformationManager: RegexTransformationManager,
    ValidationEngine: ValidationEngine,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    getHasUnsavedChanges: () => hasUnsavedChanges,
    getIsSaving: () => isSaving,
    getTableScrollStates: () => tableScrollStates,
    getObserver: () => observer,
    setObserver: (v: any) => { observer = v; },
    getIsAutoTransforming: () => isAutoTransforming,
    setIsAutoTransforming: (v: any) => { isAutoTransforming = v; },
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
    getOptionPanelVisible: () => optionPanelVisible,
    setOptionPanelVisible: (v: any) => { optionPanelVisible = v; },
    getLastOptionHash: () => lastOptionHash,
    setLastOptionHash: (v: any) => { lastOptionHash = v; },
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

  // [新增] 独立插入选项到最新气泡
  const injectIndependentOptions = createInjectIndependentOptions({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  // [修复版] 绑定选项点击事件 (优化：事件委托 + 增强发送逻辑)
  const bindOptionEvents = createBindOptionEvents({
    clearComposerIfCurrentText: (...a: any[]) => clearComposerIfCurrentText(...a),
    executeCheckSuggestionCommand: (...a: any[]) => executeCheckSuggestionCommand(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getResolvedComposerText: (...a: any[]) => getResolvedComposerText(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    sendChatTextAndTrigger: (...a: any[]) => sendChatTextAndTrigger(...a),
    smartInsertToTextarea: smartInsertToTextarea,
  });

  const insertHtmlToPage = createInsertHtmlToPage({
    createElementFromHtml: (...a: any[]) => createElementFromHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });
  // [新增] 渲染变更审核面板
  const renderChangesPanel = createRenderChangesPanel({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    createDiffRowMatcher: (...a: any[]) => createDiffRowMatcher(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getDiffRowDisplayTitle: (...a: any[]) => getDiffRowDisplayTitle(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    takeDiffRowMatch: (...a: any[]) => takeDiffRowMatch(...a),
    DATA_VALIDATION_DEPRECATED_META: DATA_VALIDATION_DEPRECATED_META,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    ValidationEngine: ValidationEngine,
  });

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

  const renderGlobalInteractionsPanel = createRenderGlobalInteractionsPanel({
    buildGlobalInteractionGroups: (...a: any[]) => buildGlobalInteractionGroups(...a),
    createGlobalInteractionSections: (...a: any[]) => createGlobalInteractionSections(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderGlobalInteractionsSection: (...a: any[]) => renderGlobalInteractionsSection(...a),
  });

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

  const bindGlobalInteractionEvents = createBindGlobalInteractionEvents({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    clearGlobalInteractionOutsideCapture: (...a: any[]) => clearGlobalInteractionOutsideCapture(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    dedupeInteractionActions: (...a: any[]) => dedupeInteractionActions(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGlobalInteractionCollapsedSections: (...a: any[]) => getGlobalInteractionCollapsedSections(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateGlobalInteractionAvatars: (...a: any[]) => hydrateGlobalInteractionAvatars(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
    normalizeInteractionLabel: (...a: any[]) => normalizeInteractionLabel(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
    bindCompositionSafeSearchInput: (...a: any[]) => bindCompositionSafeSearchInput(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    showActionPresetManager: (...a: any[]) => showActionPresetManager(...a),
    STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS: STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
    getCachedRawData: () => cachedRawData,
    getCleanupGlobalInteractionOutsideCapture: () => cleanupGlobalInteractionOutsideCapture,
    setCleanupGlobalInteractionOutsideCapture: (v: any) => { cleanupGlobalInteractionOutsideCapture = v; },
  });

  // [新增] 绑定变更面板事件
  const bindChangesEvents = createBindChangesEvents({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    removeDiffDataRow: (...a: any[]) => removeDiffDataRow(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveDataToDatabase: (...a: any[]) => saveDataToDatabase(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    setDiffDataCell: (...a: any[]) => setDiffDataCell(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    showChangeEditModal: (...a: any[]) => showChangeEditModal(...a),
    showChangeSingleFieldModal: (...a: any[]) => showChangeSingleFieldModal(...a),
    showRowCompareEditModal: (...a: any[]) => showRowCompareEditModal(...a),
    showSmartFixModal: (...a: any[]) => showSmartFixModal(...a),
    updateChangesCount: (...a: any[]) => updateChangesCount(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    STORAGE_KEY_VALIDATION_MODE: STORAGE_KEY_VALIDATION_MODE,
    getCachedRawData: () => cachedRawData,
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
  });

  // [新增] 刷新变更面板（辅助函数）
  const refreshChangesPanel = () => {
    const { $ } = getCore();
    const rawData = cachedRawData || getTableData();
    currentDiffMap = generateDiffMap(rawData);

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
  const showChangeEditModal = createShowChangeEditModal({
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    getCachedRawData: () => cachedRawData,
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
    getIsSettingsOpen: () => isSettingsOpen,
    setIsSettingsOpen: (v: any) => { isSettingsOpen = v; },
  });
  // [新增] 变更面板专用单字段编辑弹窗
  const showChangeSingleFieldModal = createShowChangeSingleFieldModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataCell: (...a: any[]) => setDiffDataCell(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData,
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
  });

  // [新增] 多字段变更整体对比编辑弹窗
  const showRowCompareEditModal = createShowRowCompareEditModal({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
    refreshChangesPanel: (...a: any[]) => refreshChangesPanel(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
    setDiffDataRow: (...a: any[]) => setDiffDataRow(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData,
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
  });
  const renderDashboard = createRenderDashboard({
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    AvatarManager: AvatarManager,
    DashboardDataParser: DashboardDataParser,
    NameAliasRegistry: NameAliasRegistry,
  });

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

  const bindCompositionSafeSearchInput = createBindCompositionSafeSearchInput({

  });


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

  const gachaStateCore = new GachaStateCore({
    getConfiguredGachaPoolDefinitions,
    testDefaultFortune: GACHA_TEST_DEFAULT_FORTUNE,
    recentRewardLimit: GACHA_RECENT_REWARD_LIMIT,
  });
  const createDefaultGachaState = (): GachaState => gachaStateCore.createDefault();
  const normalizeShardWallet = (rawValue: unknown): GachaShardWallet => gachaStateCore.normalizeShardWallet(rawValue);
  const normalizeRecentGachaRewards = (rawValue: unknown): GachaRecentRewardRecord[] => gachaStateCore.normalizeRecentRewards(rawValue);

  const gachaStore = new GachaStore({
    store: Store,
    getCurrentContextFingerprint,
    storageKeyBase: STORAGE_KEY_GACHA_STATE,
  });
  const getGachaStateStorageKey = (): string => gachaStore.getStorageKey();
  const getGachaStateMigrationKey = (): string => gachaStore.getMigrationKey();
  const hasMigratedLegacyGachaState = (): boolean => gachaStore.hasMigrated();
  const markLegacyGachaStateMigrated = () => gachaStore.markMigrated();
  const getStoredGachaStateSnapshot = (): Record<string, unknown> | null => gachaStore.load();
  const saveStoredGachaStateSnapshot = (state: GachaState): boolean => gachaStore.save(state);
  const assertSaveStoredGachaStateSnapshot = (state: GachaState): void => gachaStore.assertSave(state);

  const normalizeGachaStateRecord = (rawValue: unknown): GachaState | null => gachaStateCore.normalizeRecord(rawValue);

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

  const mergeGachaCatalogRecordsToGlobalScope = createMergeGachaCatalogRecordsToGlobalScope({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getGachaCatalogItemMergeTimestamp: (...a: any[]) => getGachaCatalogItemMergeTimestamp(...a),
    getGachaCatalogRecordMergeTimestamp: (...a: any[]) => getGachaCatalogRecordMergeTimestamp(...a),
    normalizeScopedGachaCatalogRecord: (...a: any[]) => normalizeScopedGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  });

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

  const getRuntimeGachaRawData = () => cachedRawData || getTableData();

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
  const inferEquipmentTableTypeForGachaItem = createInferEquipmentTableTypeForGachaItem({
    EQUIPMENT_TABLE_TYPE_VALUES: EQUIPMENT_TABLE_TYPE_VALUES,
  });

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

  const normalizeImportedGachaItem = createNormalizeImportedGachaItem({
    buildStableGachaCustomItemId: (...a: any[]) => buildStableGachaCustomItemId(...a),
    inferEquipmentTableTypeForGachaItem: (...a: any[]) => inferEquipmentTableTypeForGachaItem(...a),
    isGachaFieldAlias: (...a: any[]) => isGachaFieldAlias(...a),
    normalizeGachaCustomFields: (...a: any[]) => normalizeGachaCustomFields(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    normalizeGachaTimestamp: (...a: any[]) => normalizeGachaTimestamp(...a),
    normalizeImportedGachaPoolTags: (...a: any[]) => normalizeImportedGachaPoolTags(...a),
    GACHA_EFFECT_FIELD_ALIASES: GACHA_EFFECT_FIELD_ALIASES,
    GACHA_TAG_FIELD_ALIASES: GACHA_TAG_FIELD_ALIASES,
  });

  const normalizeImportedGachaPools = createNormalizeImportedGachaPools({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
  });

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

  const applyGachaCatalogImport = createApplyGachaCatalogImport({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    createUniqueGachaItemId: (...a: any[]) => createUniqueGachaItemId(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    mergeImportedGachaPools: (...a: any[]) => mergeImportedGachaPools(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
  });

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

  const showGachaCatalogClearDialog = createShowGachaCatalogClearDialog({
    clearGlobalGachaCatalog: (...a: any[]) => clearGlobalGachaCatalog(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const buildGachaCatalogTemplateJsonc = createBuildGachaCatalogTemplateJsonc({

  });

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

  const showGachaCatalogImportConfirm = createShowGachaCatalogImportConfirm({
    analyzeGachaCatalogImport: (...a: any[]) => analyzeGachaCatalogImport(...a),
    applyGachaCatalogImport: (...a: any[]) => applyGachaCatalogImport(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaCatalogImportStatsText: (...a: any[]) => formatGachaCatalogImportStatsText(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGachaCatalogImportFailureMessage: (...a: any[]) => getGachaCatalogImportFailureMessage(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

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

  const showGachaSaveError = createShowGachaSaveError({
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
  });

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

  const getGachaFortuneProgressView = createGetGachaFortuneProgressView({
    formatGachaDuration: (...a: any[]) => formatGachaDuration(...a),
    formatGachaRelativeTime: (...a: any[]) => formatGachaRelativeTime(...a),
  });

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

  const showGachaPickupItemDetail = createShowGachaPickupItemDetail({
    findGachaDefinitionByItemId: (...a: any[]) => findGachaDefinitionByItemId(...a),
    formatGachaItemCardMeta: (...a: any[]) => formatGachaItemCardMeta(...a),
    formatGachaPoolTags: (...a: any[]) => formatGachaPoolTags(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaCustomFieldsDetailsHtml: (...a: any[]) => renderGachaCustomFieldsDetailsHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData,
  });

  const showGachaRecentRewardDetail = createShowGachaRecentRewardDetail({
    findGachaDefinitionByNameQuality: (...a: any[]) => findGachaDefinitionByNameQuality(...a),
    showGachaPickupItemDetail: showGachaPickupItemDetail,
  });

  const getTotalGachaShards = (state: GachaState): number =>
    GACHA_RARITY_ORDER.reduce(
      (sum, rarity) => sum + Math.max(0, Math.floor(Number(state.wallet.shards[rarity] || 0))),
      0,
    );

  const renderGachaPanelHtml = createRenderGachaPanelHtml({
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaRecentRewardText: (...a: any[]) => formatGachaRecentRewardText(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTotalGachaShards: (...a: any[]) => getTotalGachaShards(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    renderGachaFortuneProgressHtml: (...a: any[]) => renderGachaFortuneProgressHtml(...a),
    renderGachaPickupHtml: (...a: any[]) => renderGachaPickupHtml(...a),
  });

  const getGachaShopProgressContainers = (): HTMLElement[] => {
    const roots = new Set<HTMLElement>();
    if (gachaShopRootElement?.isConnected && gachaShopRootElement.querySelector('.acu-gacha-fortune-progress')) {
      roots.add(gachaShopRootElement);
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

  const performGachaDraw = createPerformGachaDraw({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    drawSingleGachaOutcome: (...a: any[]) => drawSingleGachaOutcome(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getAvailableGachaRewardTargets: (...a: any[]) => getAvailableGachaRewardTargets(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    restoreMutableRuntimeValue: (...a: any[]) => restoreMutableRuntimeValue(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    getCachedRawData: () => cachedRawData,
  });

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

  const deleteGachaPoolConfig = createDeleteGachaPoolConfig({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getStoredGachaActivePoolTag: (...a: any[]) => getStoredGachaActivePoolTag(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
    saveStoredGachaActivePoolTag: (...a: any[]) => saveStoredGachaActivePoolTag(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    saveStoredGachaSettingsPoolTag: (...a: any[]) => saveStoredGachaSettingsPoolTag(...a),
    STORAGE_KEY_GACHA_ACTIVE_POOL_TAG: STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    STORAGE_KEY_GACHA_SETTINGS_POOL_TAG: STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
  });

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

  const showGachaPoolNameDialog = createShowGachaPoolNameDialog({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const showGachaConfirmDialog = createShowGachaConfirmDialog({
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

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

  const renderGachaSettingsPoolItemsHtml = createRenderGachaSettingsPoolItemsHtml({
    compareGachaItemDefinitionsForDisplay: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaItemCreatedAt: (...a: any[]) => formatGachaItemCreatedAt(...a),
    formatGachaPoolTags: (...a: any[]) => formatGachaPoolTags(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaCustomFieldsSearchText: (...a: any[]) => getGachaCustomFieldsSearchText(...a),
    getGachaItemCreatedAtMs: (...a: any[]) => getGachaItemCreatedAtMs(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    getGachaSettingsPoolItems: (...a: any[]) => getGachaSettingsPoolItems(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    renderGachaCustomFieldsPreviewHtml: (...a: any[]) => renderGachaCustomFieldsPreviewHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
  });

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

  const renderGachaPoolSettingsListHtml = createRenderGachaPoolSettingsListHtml({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
  });

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

  const showGachaSettingsDialog = createShowGachaSettingsDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildGachaCatalogAgentPrompt: (...a: any[]) => buildGachaCatalogAgentPrompt(...a),
    buildGachaCatalogAgentPromptFilename: (...a: any[]) => buildGachaCatalogAgentPromptFilename(...a),
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    deleteGachaPoolConfig: (...a: any[]) => deleteGachaPoolConfig(...a),
    downloadAiPromptFile: (...a: any[]) => downloadAiPromptFile(...a),
    downloadGachaCatalogJson: (...a: any[]) => downloadGachaCatalogJson(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaPoolDisplayName: (...a: any[]) => getGachaPoolDisplayName(...a),
    getGachaSettingsFilterLabel: (...a: any[]) => getGachaSettingsFilterLabel(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    getStoredGachaSettingsPoolTag: (...a: any[]) => getStoredGachaSettingsPoolTag(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    importGachaCatalogJsonFromFile: (...a: any[]) => importGachaCatalogJsonFromFile(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderGachaPoolSettingsListHtml: (...a: any[]) => renderGachaPoolSettingsListHtml(...a),
    renderGachaSettingsPoolViewerHtml: (...a: any[]) => renderGachaSettingsPoolViewerHtml(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    saveStoredGachaSettingsPoolTag: (...a: any[]) => saveStoredGachaSettingsPoolTag(...a),
    setGachaItemOrder: (...a: any[]) => setGachaItemOrder(...a),
    setGachaPoolOrder: (...a: any[]) => setGachaPoolOrder(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showGachaCatalogClearDialog: (...a: any[]) => showGachaCatalogClearDialog(...a),
    showGachaConfirmDialog: (...a: any[]) => showGachaConfirmDialog(...a),
    showGachaItemEditorDialog: (...a: any[]) => showGachaItemEditorDialog(...a),
    showGachaPickupItemDetail: (...a: any[]) => showGachaPickupItemDetail(...a),
    showGachaPoolNameDialog: (...a: any[]) => showGachaPoolNameDialog(...a),
    updateGachaItemSetting: (...a: any[]) => updateGachaItemSetting(...a),
    updateGachaPoolConfig: (...a: any[]) => updateGachaPoolConfig(...a),
    DEFAULT_GACHA_SETTINGS_ITEM_FILTERS: DEFAULT_GACHA_SETTINGS_ITEM_FILTERS,
    STORAGE_KEY_GACHA_ITEM_SETTINGS: STORAGE_KEY_GACHA_ITEM_SETTINGS,
    createSortableList: createSortableList,
    getCachedRawData: () => cachedRawData,
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask = v; },
  });

  const showGachaItemEditorDialog = createShowGachaItemEditorDialog({
    bindTutorialButtonsIn: (...a: any[]) => bindTutorialButtonsIn(...a),
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    buildStableGachaCustomItemId: (...a: any[]) => buildStableGachaCustomItemId(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    createUniqueGachaItemId: (...a: any[]) => createUniqueGachaItemId(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    ensureGachaPoolsForTags: (...a: any[]) => ensureGachaPoolsForTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDefinitionFingerprint: (...a: any[]) => getGachaItemDefinitionFingerprint(...a),
    getGachaNamedCustomField: (...a: any[]) => getGachaNamedCustomField(...a),
    getGachaReservedCustomFieldHeaders: (...a: any[]) => getGachaReservedCustomFieldHeaders(...a),
    getGachaRewardFieldLimits: (...a: any[]) => getGachaRewardFieldLimits(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    inferEquipmentTableTypeForGachaItem: (...a: any[]) => inferEquipmentTableTypeForGachaItem(...a),
    isGachaFieldAlias: (...a: any[]) => isGachaFieldAlias(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeGachaCustomFields: (...a: any[]) => normalizeGachaCustomFields(...a),
    normalizeGachaRewardTarget: (...a: any[]) => normalizeGachaRewardTarget(...a),
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showGachaPoolNameDialog: (...a: any[]) => showGachaPoolNameDialog(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    startGachaShopUiRefresh: (...a: any[]) => startGachaShopUiRefresh(...a),
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH: GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH,
    GACHA_CUSTOM_FIELD_MAX_COUNT: GACHA_CUSTOM_FIELD_MAX_COUNT,
    GACHA_CUSTOM_FIELD_RESERVED_KEYS: GACHA_CUSTOM_FIELD_RESERVED_KEYS,
    GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH: GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH,
    GACHA_EFFECT_FIELD_ALIASES: GACHA_EFFECT_FIELD_ALIASES,
    GACHA_TAG_FIELD_ALIASES: GACHA_TAG_FIELD_ALIASES,
    GACHA_TARGET_COLUMN_KEYS: GACHA_TARGET_COLUMN_KEYS,
    GACHA_TARGET_COLUMN_LABELS: GACHA_TARGET_COLUMN_LABELS,
    GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH: GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH,
    GACHA_TARGET_TABLE_MAX_LENGTH: GACHA_TARGET_TABLE_MAX_LENGTH,
    STORAGE_KEY_GACHA_POOL_SETTINGS: STORAGE_KEY_GACHA_POOL_SETTINGS,
    getCachedRawData: () => cachedRawData,
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask = v; },
      getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer = v; },
});

  const dismantleInventoryItem = createDismantleInventoryItem({
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    findGachaDefinitionByInventoryItem: (...a: any[]) => findGachaDefinitionByInventoryItem(...a),
    getGachaItemGrantQuantity: (...a: any[]) => getGachaItemGrantQuantity(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

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
    if (gachaHeartbeatTimer) return;
    gachaHeartbeatTimer = setInterval(() => {
      void flushGachaHeartbeatProgress(false);
    }, GACHA_ACTIVE_HEARTBEAT_MS);
  };

  const startGachaShopUiRefresh = () => {
    if (gachaShopUiRefreshTimer) return;
    gachaShopUiRefreshTimer = setInterval(() => {
      if (!getGachaShopProgressContainers().length) {
        if (gachaShopUiRefreshTimer) {
          clearInterval(gachaShopUiRefreshTimer);
          gachaShopUiRefreshTimer = null;
        }
        return;
      }
      updateGachaShopProgressUi();
    }, GACHA_SHOP_UI_REFRESH_MS);
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

  const parseInventoryItems = createParseInventoryItems({
    assertGachaRewardNameColumn: (...a: any[]) => assertGachaRewardNameColumn(...a),
    getInventoryColumnMap: (...a: any[]) => getInventoryColumnMap(...a),
    getInventoryResult: (...a: any[]) => getInventoryResult(...a),
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
    getCurrentDiffMap: () => currentDiffMap,
  });

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

  const parseEquipmentItems = createParseEquipmentItems({
    assertGachaRewardNameColumn: (...a: any[]) => assertGachaRewardNameColumn(...a),
    getEquipmentColumnMap: (...a: any[]) => getEquipmentColumnMap(...a),
    getEquipmentResult: (...a: any[]) => getEquipmentResult(...a),
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
    getCurrentDiffMap: () => currentDiffMap,
  });

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

  const renderGachaShardShopHtml = createRenderGachaShardShopHtml({
    compareGachaItemDefinitionsForDisplay: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaItemCardMeta: (...a: any[]) => formatGachaItemCardMeta(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaPoolDisplayName: (...a: any[]) => getGachaPoolDisplayName(...a),
    getGachaRarityIconClass: (...a: any[]) => getGachaRarityIconClass(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getStoredGachaShardShopRarity: (...a: any[]) => getStoredGachaShardShopRarity(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    isGachaItemOwned: (...a: any[]) => isGachaItemOwned(...a),
    renderGachaCustomFieldsPreviewHtml: (...a: any[]) => renderGachaCustomFieldsPreviewHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    GACHA_SHARD_EXCHANGE_COST: GACHA_SHARD_EXCHANGE_COST,
  });

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
    const rawData = cachedRawData || getTableData();
    void (async () => {
      await ensureGachaCatalogLoaded(rawData);
      if (!$shopOverlay.length) return;
      const $nextOverlay = $(renderGachaShardShopHtml(rawData));
      $shopOverlay.children().replaceWith($nextOverlay.children());
      bindGachaShardShopInteractions($shopOverlay as JQuery<HTMLElement>);
      hydrateCustomTableNameIconsIn($shopOverlay as JQuery<HTMLElement>);
    })();
  };

  const showGachaShardShop = createShowGachaShardShop({
    bindGachaShardShopInteractions: (...a: any[]) => bindGachaShardShopInteractions(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaShardShopHtml: (...a: any[]) => renderGachaShardShopHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData,
  });

  const exchangeGachaShardItem = createExchangeGachaShardItem({
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    grantGachaReward: (...a: any[]) => grantGachaReward(...a),
    hasGachaRewardTableForItem: (...a: any[]) => hasGachaRewardTableForItem(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    isGachaItemOwned: (...a: any[]) => isGachaItemOwned(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
    GACHA_SHARD_EXCHANGE_COST: GACHA_SHARD_EXCHANGE_COST,
    getCachedRawData: () => cachedRawData,
  });

  const showGachaShardExchangeConfirm = createShowGachaShardExchangeConfirm({
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    exchangeGachaShardItem: (...a: any[]) => exchangeGachaShardItem(...a),
    formatGachaRewardDestinationLabel: (...a: any[]) => formatGachaRewardDestinationLabel(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaRarityIconClass: (...a: any[]) => getGachaRarityIconClass(...a),
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hasGachaCustomFields: (...a: any[]) => hasGachaCustomFields(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    isGachaItemOwned: (...a: any[]) => isGachaItemOwned(...a),
    renderGachaCustomFieldsDetailsHtml: (...a: any[]) => renderGachaCustomFieldsDetailsHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    GACHA_SHARD_EXCHANGE_COST: GACHA_SHARD_EXCHANGE_COST,
    getCachedRawData: () => cachedRawData,
  });

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
    if (gachaShopRootElement?.isConnected) {
      gachaShopRootElement.remove();
    }
    gachaShopRootElement = null;
    $('.acu-gacha-overlay, .acu-gacha-shard-shop-overlay, .acu-gacha-pickup-detail-overlay').remove();
    if (gachaShopUiRefreshTimer) {
      clearInterval(gachaShopUiRefreshTimer);
      gachaShopUiRefreshTimer = null;
    }
  };

  const refreshGachaVisualization = (rawDataOverride?: unknown) => {
    const rawData = rawDataOverride || cachedRawData;
    const overlay = gachaShopRootElement?.isConnected
      ? gachaShopRootElement
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

  const showGachaVisualization = createShowGachaVisualization({
    closeGachaVisualization: (...a: any[]) => closeGachaVisualization(...a),
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaPanelHtml: (...a: any[]) => renderGachaPanelHtml(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    startGachaShopUiRefresh: (...a: any[]) => startGachaShopUiRefresh(...a),
    updateGachaShopProgressUi: (...a: any[]) => updateGachaShopProgressUi(...a),
    getCachedRawData: () => cachedRawData,
    getGachaShopRootElement: () => gachaShopRootElement,
    setGachaShopRootElement: (v: any) => { gachaShopRootElement = v; },
  });

  const closeInventoryVisualization = () => {
    $('.acu-inventory-detail-overlay, .acu-inventory-overlay').remove();
  };

  const renderInventoryVisualization = createRenderInventoryVisualization({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getInventoryActiveFilterCount: (...a: any[]) => getInventoryActiveFilterCount(...a),
    getInventoryFilters: (...a: any[]) => getInventoryFilters(...a),
    getInventoryFiltersCollapsedState: (...a: any[]) => getInventoryFiltersCollapsedState(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderInventoryFilterButtons: (...a: any[]) => renderInventoryFilterButtons(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    INVENTORY_QUALITY_FILTER_META: INVENTORY_QUALITY_FILTER_META,
    INVENTORY_SORT_OPTIONS: INVENTORY_SORT_OPTIONS,
    INVENTORY_TYPE_FILTER_META: INVENTORY_TYPE_FILTER_META,
  });

  const refreshInventoryVisualization = (options?: { focusSearch?: boolean; cursor?: number }) => {
    const rawData = cachedRawData || getTableData();
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
    const rawData = cachedRawData || getTableData();
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
    const rawData = cachedRawData || getTableData();
    const parsed = parseInventoryItems(rawData);
    return parsed.items.find(item => item.rowIndex === rowIndex) || null;
  };

  const getInventoryDetailContext = (rowIndex: number, options?: { preferLatest?: boolean }) => {
    const rawData = options?.preferLatest
      ? getTableData({ silent: true }) || cloneRuntimeDataValue(cachedRawData)
      : cachedRawData || getTableData();
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

  const saveInventoryFieldValue = createSaveInventoryFieldValue({
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryFieldColumnIndex: (...a: any[]) => getInventoryFieldColumnIndex(...a),
    getInventoryFieldLabel: (...a: any[]) => getInventoryFieldLabel(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    reopenInventoryItemDetail: (...a: any[]) => reopenInventoryItemDetail(...a),
    saveInventoryMetadataRecord: (...a: any[]) => saveInventoryMetadataRecord(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
  });

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

  const showInventoryFieldEditDialog = createShowInventoryFieldEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryEnumOptions: (...a: any[]) => getInventoryEnumOptions(...a),
    getInventoryFieldColumnIndex: (...a: any[]) => getInventoryFieldColumnIndex(...a),
    getInventoryFieldLabel: (...a: any[]) => getInventoryFieldLabel(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    saveInventoryFieldValue: (...a: any[]) => saveInventoryFieldValue(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showEditDialog: (...a: any[]) => showEditDialog(...a),
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
  });

  const showInventoryMetaEditDialog = createShowInventoryMetaEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    saveInventoryMetadataRecord: (...a: any[]) => saveInventoryMetadataRecord(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const showInventoryDetailMenu = createShowInventoryDetailMenu({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryFieldLabel: (...a: any[]) => getInventoryFieldLabel(...a),
    reopenInventoryItemDetail: (...a: any[]) => reopenInventoryItemDetail(...a),
    showCardEditModal: (...a: any[]) => showCardEditModal(...a),
    showInventoryFieldEditDialog: (...a: any[]) => showInventoryFieldEditDialog(...a),
    showInventoryMetaEditDialog: (...a: any[]) => showInventoryMetaEditDialog(...a),
  });

  const showInventoryItemDetail = createShowInventoryItemDetail({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    dismantleInventoryItem: (...a: any[]) => dismantleInventoryItem(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    findInventoryItemByRow: (...a: any[]) => findInventoryItemByRow(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    handleInventoryAction: (...a: any[]) => handleInventoryAction(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderInventoryMetadataHtml: (...a: any[]) => renderInventoryMetadataHtml(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showInventoryGiftDialog: (...a: any[]) => showInventoryGiftDialog(...a),
    ACTION_ICON_MAP: ACTION_ICON_MAP,
    getCachedRawData: () => cachedRawData,
  });

  const showInventoryGiftDialog = createShowInventoryGiftDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findInventoryItemByRow: (...a: any[]) => findInventoryItemByRow(...a),
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryCharacters: (...a: any[]) => getInventoryCharacters(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    AvatarManager: AvatarManager,
    smartInsertToTextarea: smartInsertToTextarea,
    getCachedRawData: () => cachedRawData,
  });
  const handleInventoryAction = createHandleInventoryAction({
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    findInventoryItemByRow: (...a: any[]) => findInventoryItemByRow(...a),
    getCore: (...a: any[]) => getCore(...a),
    getInventoryActionPrompt: (...a: any[]) => getInventoryActionPrompt(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    showInventoryGiftDialog: (...a: any[]) => showInventoryGiftDialog(...a),
    showInventoryItemDetail: (...a: any[]) => showInventoryItemDetail(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
  });

  // [修复] 仪表盘NPC头像异步加载（支持IndexedDB本地头像）
  const loadDashboardNpcAvatars = createLoadDashboardNpcAvatars({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
  });

  // ========== [新增] 收藏夹面板渲染函数 ==========
  const renderFavoritesPanel = createRenderFavoritesPanel({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderDataCardCellContent: (...a: any[]) => renderDataCardCellContent(...a),
  });

  // ========== [新增] 收藏夹面板事件绑定 ==========
  const bindFavoritesEvents = createBindFavoritesEvents({
    closePanel: (...a: any[]) => closePanel(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderFavoritesPanel: (...a: any[]) => renderFavoritesPanel(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    showFavoriteEditModal: (...a: any[]) => showFavoriteEditModal(...a),
    showSendToTableModal: (...a: any[]) => showSendToTableModal(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCachedRawData: () => cachedRawData,
  });

  const renderOptionTableContent = createRenderOptionTableContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getOptionItemsFromTable: (...a: any[]) => getOptionItemsFromTable(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    getTablePageStates: () => tablePageStates,
    getTableSearchStates: () => tableSearchStates,
  });

  const renderCheckSuggestionTableContent = createRenderCheckSuggestionTableContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCheckSuggestionItemsFromTable: (...a: any[]) => getCheckSuggestionItemsFromTable(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    getTablePageStates: () => tablePageStates,
    getTableSearchStates: () => tableSearchStates,
  });

  const renderTableContent = createRenderTableContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableStyles: (...a: any[]) => getTableStyles(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    isCheckSuggestionTableName: (...a: any[]) => isCheckSuggestionTableName(...a),
    isOptionTableName: (...a: any[]) => isOptionTableName(...a),
    isTableReversed: (...a: any[]) => isTableReversed(...a),
    renderCheckSuggestionTableContent: (...a: any[]) => renderCheckSuggestionTableContent(...a),
    renderOptionTableContent: (...a: any[]) => renderOptionTableContent(...a),
    renderDataCardCellContent: (...a: any[]) => renderDataCardCellContent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    shouldShowReverseButton: (...a: any[]) => shouldShowReverseButton(...a),
    BookmarkManager: BookmarkManager,
    getCurrentDiffMap: () => currentDiffMap,
    getTablePageStates: () => tablePageStates,
    getTableSearchStates: () => tableSearchStates,
  });

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
      tableScrollStates[activeTab] = {
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

    const rawData = cachedRawData || getTableData();
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

  const bindFloatingCollapseDrag = createBindFloatingCollapseDrag({
    clampFloatingCollapsePosition: (...a: any[]) => clampFloatingCollapsePosition(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    saveConfig: (...a: any[]) => saveConfig(...a),
    FLOATING_COLLAPSE_DRAG_THRESHOLD: FLOATING_COLLAPSE_DRAG_THRESHOLD,
    getSuppressNextFloatingCollapseClick: () => suppressNextFloatingCollapseClick,
    setSuppressNextFloatingCollapseClick: (v: any) => { suppressNextFloatingCollapseClick = v; },
  });

  const bindEvents = createBindEvents({
    bindCompositionSafeSearchInput: (...a: any[]) => bindCompositionSafeSearchInput(...a),
    bindFloatingCollapseDrag: (...a: any[]) => bindFloatingCollapseDrag(...a),
    bindGlobalInteractionEvents: (...a: any[]) => bindGlobalInteractionEvents(...a),
    buildRelationshipGraphTableFromPreset: (...a: any[]) => buildRelationshipGraphTableFromPreset(...a),
    canWriteMvuPanel: (...a: any[]) => canWriteMvuPanel(...a),
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    clearAllPanelStates: (...a: any[]) => clearAllPanelStates(...a),
    clearGachaFortune: (...a: any[]) => clearGachaFortune(...a),
    closeGachaVisualization: (...a: any[]) => closeGachaVisualization(...a),
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    closePanel: (...a: any[]) => closePanel(...a),
    collectCurrentChatAvatarNodes: (...a: any[]) => collectCurrentChatAvatarNodes(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    executeTableInteractionAction: (...a: any[]) => executeTableInteractionAction(...a),
    extractNumericValue: (...a: any[]) => extractNumericValue(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    getActiveDashboardRelationshipGraphSources: (...a: any[]) => getActiveDashboardRelationshipGraphSources(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getDatabaseManualUpdateErrorMessage: (...a: any[]) => getDatabaseManualUpdateErrorMessage(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getInventoryFilters: (...a: any[]) => getInventoryFilters(...a),
    getOptionsCollapsedState: (...a: any[]) => getOptionsCollapsedState(...a),
    getPanelDragStartHeight: (...a: any[]) => getPanelDragStartHeight(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getTableStyles: (...a: any[]) => getTableStyles(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    openDatabaseInterface: (...a: any[]) => openDatabaseInterface(...a),
    openDatabaseVisualizerInterface: (...a: any[]) => openDatabaseVisualizerInterface(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    renderDataCardCellContent: (...a: any[]) => renderDataCardCellContent(...a),
    renderFavoritesPanel: (...a: any[]) => renderFavoritesPanel(...a),
    renderGlobalInteractionsPanel: (...a: any[]) => renderGlobalInteractionsPanel(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    resetPanelRequestedHeight: (...a: any[]) => resetPanelRequestedHeight(...a),
    resolveExistingTableName: (...a: any[]) => resolveExistingTableName(...a),
    runDatabaseManualUpdate: (...a: any[]) => runDatabaseManualUpdate(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveCollapsedState: (...a: any[]) => saveCollapsedState(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    saveInventoryFilters: (...a: any[]) => saveInventoryFilters(...a),
    saveInventoryFiltersCollapsedState: (...a: any[]) => saveInventoryFiltersCollapsedState(...a),
    saveOptionsCollapsedState: (...a: any[]) => saveOptionsCollapsedState(...a),
    savePanelRequestedHeight: (...a: any[]) => savePanelRequestedHeight(...a),
    saveStoredGachaShardShopRarity: (...a: any[]) => saveStoredGachaShardShopRarity(...a),
    saveTableStyles: (...a: any[]) => saveTableStyles(...a),
    setActiveTableNavButton: (...a: any[]) => setActiveTableNavButton(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    showAvatarManager: (...a: any[]) => showAvatarManager(...a),
    showDatabaseManualUpdateFailure: (...a: any[]) => showDatabaseManualUpdateFailure(...a),
    showInventoryDetailMenu: (...a: any[]) => showInventoryDetailMenu(...a),
    showInventoryVisualization: (...a: any[]) => showInventoryVisualization(...a),
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
    switchPanel: (...a: any[]) => switchPanel(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    toggleTableReverse: (...a: any[]) => toggleTableReverse(...a),
    updateGachaPoolTag: (...a: any[]) => updateGachaPoolTag(...a),
    warnMissingTableTarget: (...a: any[]) => warnMissingTableTarget(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    bindFavoritesEvents: (...a: any[]) => bindFavoritesEvents(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    handleInventoryAction: (...a: any[]) => handleInventoryAction(...a),
    loadDashboardNpcAvatars: (...a: any[]) => loadDashboardNpcAvatars(...a),
    performGachaDraw: (...a: any[]) => performGachaDraw(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    renderDashboard: (...a: any[]) => renderDashboard(...a),
    saveDataToDatabase: (...a: any[]) => saveDataToDatabase(...a),
    showCellMenu: (...a: any[]) => showCellMenu(...a),
    showContestPanel: (...a: any[]) => showContestPanel(...a),
    showDashboardPresetManager: (...a: any[]) => showDashboardPresetManager(...a),
    showDicePanel: (...a: any[]) => showDicePanel(...a),
    showGachaPickupItemDetail: (...a: any[]) => showGachaPickupItemDetail(...a),
    showGachaRecentRewardDetail: (...a: any[]) => showGachaRecentRewardDetail(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    showGachaShardExchangeConfirm: (...a: any[]) => showGachaShardExchangeConfirm(...a),
    showGachaShardShop: (...a: any[]) => showGachaShardShop(...a),
    showGachaVisualization: (...a: any[]) => showGachaVisualization(...a),
    showMapVisualization: (...a: any[]) => showMapVisualization(...a),
    showRelationshipGraph: (...a: any[]) => showRelationshipGraph(...a),
    showSettingsModal: (...a: any[]) => showSettingsModal(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    BookmarkManager: BookmarkManager,
    DashboardDataParser: DashboardDataParser,
    MvuModule: MvuModule,
    STORAGE_KEY_DASHBOARD_ACTIVE: STORAGE_KEY_DASHBOARD_ACTIVE,
    STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE: STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
    getCachedRawData: () => cachedRawData,
    getIsEditingOrder: () => isEditingOrder,
    getTablePageStates: () => tablePageStates,
    getTableScrollStates: () => tableScrollStates,
    getTableSearchStates: () => tableSearchStates,
    getHasUnsavedChanges: () => hasUnsavedChanges,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges = v; },
    getSuppressNextFloatingCollapseClick: () => suppressNextFloatingCollapseClick,
    setSuppressNextFloatingCollapseClick: (v: any) => { suppressNextFloatingCollapseClick = v; },
    getTutorialButtonEventsBound: () => tutorialButtonEventsBound,
    setTutorialButtonEventsBound: (v: any) => { tutorialButtonEventsBound = v; },
  });

  let selectedSwapSource = null;
  const toggleOrderEditMode = createToggleOrderEditMode({
    getCore: (...a: any[]) => getCore(...a),
    initSortable: (...a: any[]) => initSortable(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    saveTableOrder: (...a: any[]) => saveTableOrder(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
    STORAGE_KEY_ACTION_ORDER: STORAGE_KEY_ACTION_ORDER,
    getSelectedSwapSource: () => selectedSwapSource,
    setSelectedSwapSource: (v: any) => { selectedSwapSource = v; },
      getIsEditingOrder: () => isEditingOrder,
    setIsEditingOrder: (v: any) => { isEditingOrder = v; },
});

  const initSortable = createInitSortable({
    getCore: (...a: any[]) => getCore(...a),
    MAX_ACTION_BUTTONS: MAX_ACTION_BUTTONS,
    getSelectedSwapSource: () => selectedSwapSource,
    setSelectedSwapSource: (v: any) => { selectedSwapSource = v; },
  });

  const showCellMenu = createShowCellMenu({
    appendRowInstantly: (...a: any[]) => appendRowInstantly(...a),
    deleteRowInstantly: (...a: any[]) => deleteRowInstantly(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    findRowIndexByPrimaryKey: (...a: any[]) => findRowIndexByPrimaryKey(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getBadgeStyle: (...a: any[]) => getBadgeStyle(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
    getSheetKeyByTableName: (...a: any[]) => getSheetKeyByTableName(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    showCardEditModal: (...a: any[]) => showCardEditModal(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showDiceSystemInputDialog: (...a: any[]) => showDiceSystemInputDialog(...a),
    showEditDialog: (...a: any[]) => showEditDialog(...a),
    showTagInputModal: (...a: any[]) => showTagInputModal(...a),
    updateSaveButtonState: (...a: any[]) => updateSaveButtonState(...a),
    getCachedRawData: () => cachedRawData,
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges = v; },
  });

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

  // ==========================================
  // [优化后] 新的初始化入口 (Observer 只创建一次)
  // ==========================================
  // 检测可视化前端冲突
  const detectVisualizerConflict = createDetectVisualizerConflict({
    getCore: (...a: any[]) => getCore(...a),
  });

  // 显示冲突错误对话框
  const showConflictDialog = createShowConflictDialog({
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const init = createInit({
    addStyles: (...a: any[]) => addStyles(...a),
    bindAcuDiceGachaRegexActions: (...a: any[]) => bindAcuDiceGachaRegexActions(...a),
    bindHumanInputTracking: (...a: any[]) => bindHumanInputTracking(...a),
    capturePendingHumanInputSnapshot: (...a: any[]) => capturePendingHumanInputSnapshot(...a),
    detectVisualizerConflict: (...a: any[]) => detectVisualizerConflict(...a),
    ensureGachaHeartbeat: (...a: any[]) => ensureGachaHeartbeat(...a),
    flushGachaHeartbeatProgress: (...a: any[]) => flushGachaHeartbeatProgress(...a),
    generateCrazyRoll: (...a: any[]) => generateCrazyRoll(...a),
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getTutorialModule: (...a: any[]) => getTutorialModule(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
    hideDiceResultsInUserMessages: (...a: any[]) => hideDiceResultsInUserMessages(...a),
    interceptTextareaValue: (...a: any[]) => interceptTextareaValue(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
    restoreDiceResultBeforeSend: (...a: any[]) => restoreDiceResultBeforeSend(...a),
    saveCurrentDatabaseSnapshotAsReviewBaseline: (...a: any[]) => saveCurrentDatabaseSnapshotAsReviewBaseline(...a),
    scheduleCharacterDiceProfileDetection: (...a: any[]) => scheduleCharacterDiceProfileDetection(...a),
    scheduleDialogueIndentRender: (...a: any[]) => scheduleDialogueIndentRender(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    settleGachaFortuneForMessage: (...a: any[]) => settleGachaFortuneForMessage(...a),
    shouldTriggerCrazyMode: (...a: any[]) => shouldTriggerCrazyMode(...a),
    showConflictDialog: (...a: any[]) => showConflictDialog(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
    ErrorHandler: ErrorHandler,
    MvuModule: MvuModule,
    STORAGE_KEY_SCROLL: STORAGE_KEY_SCROLL,
    UpdateController: UpdateController,
    getCurrentDiffMap: () => currentDiffMap,
    getIsEditingOrder: () => isEditingOrder,
    getIsInitialized: () => isInitialized,
    setIsInitialized: (v: any) => { isInitialized = v; },
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
    getTablePageStates: () => tablePageStates,
    setTablePageStates: (v: any) => { tablePageStates = v; },
    getTableSearchStates: () => tableSearchStates,
    setTableSearchStates: (v: any) => { tableSearchStates = v; },
    getTableScrollStates: () => tableScrollStates,
    setTableScrollStates: (v: any) => { tableScrollStates = v; },
    getHasUnsavedChanges: () => hasUnsavedChanges,
    setHasUnsavedChanges: (v: any) => { hasUnsavedChanges = v; },
    getOptionPanelVisible: () => optionPanelVisible,
    setOptionPanelVisible: (v: any) => { optionPanelVisible = v; },
    get_boundRenderHandler: () => _boundRenderHandler,
    set_boundRenderHandler: (v: any) => { _boundRenderHandler = v; },
    get_boundReviewBaselineHandler: () => _boundReviewBaselineHandler,
    set_boundReviewBaselineHandler: (v: any) => { _boundReviewBaselineHandler = v; },
    getObserver: () => observer,
    setObserver: (v: any) => { observer = v; },
    getGachaHeartbeatTimer: () => gachaHeartbeatTimer,
    setGachaHeartbeatTimer: (v: any) => { gachaHeartbeatTimer = v; },
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer = v; },
  });

  // ========================================
  // 测试函数：验证配对表修复逻辑
  // ========================================
  // 在浏览器控制台运行：window.testPairedTableFix()
  window.testPairedTableFix = function () {
    // 构造测试数据：包含空白行、共同编码、各自独有编码、跳号
    const prefix = 'AM';
    const startFrom = 1;
    const columnName = '编码索引';

    // 总结表（表1）：AM0001, AM0002, 空白(错误行), AM0030, 空白(错误行)
    // 有效编码：AM0001, AM0002, AM0030
    const table1Sheet = {
      name: '总结表',
      content: [
        ['编码索引', '时间跨度', '纪要'],
        ['AM0001', '时间1', '纪要1'],
        ['AM0002', '时间2', '纪要2'],
        [null, '时间3-错误行', '纪要3-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0030', '时间4', '纪要4'],
        [null, '时间5-错误行', '纪要5-错误行'], // 空白编码（错误行，应保持不动）
      ],
    };

    // 总结大纲表（表2）：空白(错误行), AM0002, AM0030, AM0040, AM0050
    // 有效编码：AM0002, AM0030, AM0040, AM0050
    const table2Sheet = {
      name: '总体大纲',
      content: [
        ['编码索引', '时间跨度', '大纲'],
        [null, '时间A-错误行', '大纲A-错误行'], // 空白编码（错误行，应保持不动）
        ['AM0002', '时间B', '大纲B'],
        ['AM0030', '时间C', '大纲C'],
        ['AM0040', '时间D', '大纲D'],
        ['AM0050', '时间E', '大纲E'],
      ],
    };

    // 提取编码
    const extract1 = extractCodesFromTable(table1Sheet, columnName, prefix);
    const extract2 = extractCodesFromTable(table2Sheet, columnName, prefix);

    // 构建映射
    const mapping = buildCodeMapping(extract1.allCodes, extract2.allCodes, prefix, startFrom);

    // 执行修复
    const rawData = {};
    const result = alignAndFixPairedTables(
      table1Sheet,
      'sheet1',
      table2Sheet,
      'sheet2',
      columnName,
      mapping,
      prefix,
      startFrom,
      rawData,
    );

    // 验证结果
    const getValidCodes = sheet =>
      sheet.content
        .slice(1)
        .map(r => r[0])
        .filter(c => c && String(c).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    const codes1 = getValidCodes(table1Sheet);
    const codes2 = getValidCodes(table2Sheet);

    // 检查空白行是否保持原数据
    const emptyRows1 = table1Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));
    const emptyRows2 = table2Sheet.content
      .slice(1)
      .filter(r => !r[0] || !String(r[0]).match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+$`)));

    // 验证编码是否严格递增
    const validateSequence = (codes, prefix, startFrom) => {
      const numbers = codes
        .map(c => {
          if (!c) return null;
          const match = c.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== startFrom + i) {
          return false;
        }
      }
      return true;
    };

    const isValid1 = validateSequence(codes1, prefix, startFrom);
    const isValid2 = validateSequence(codes2, prefix, startFrom);

    // 验证两个表的有效编码集合是否一致
    const set1 = new Set(codes1);
    const set2 = new Set(codes2);
    const setsEqual = set1.size === set2.size && [...set1].every(c => set2.has(c));

    // 验证空白行数据是否保留
    const emptyRowsPreserved1 = emptyRows1.some(r => r[1] && r[1].includes('错误行'));
    const emptyRowsPreserved2 = emptyRows2.some(r => r[1] && r[1].includes('错误行'));

    return {
      table1Sheet,
      table2Sheet,
      result,
      codes1,
      codes2,
      emptyRows1,
      emptyRows2,
      isValid1,
      isValid2,
      setsEqual,
      emptyRowsPreserved1,
      emptyRowsPreserved2,
      // 综合验证：有效编码严格递增 + 两表有效编码一致 + 空白行数据保留
      isValid: isValid1 && isValid2 && setsEqual && emptyRowsPreserved1 && emptyRowsPreserved2,
    };
  };

  // 暴露诊断工具到全局（方便控制台调用）
  window.diagnoseDiceVariables = async function () {
    if (typeof MvuModule !== 'undefined' && typeof MvuModule.diagnoseVariableFramework === 'function') {
      return await MvuModule.diagnoseVariableFramework();
    } else {
      console.error('[DICE]MvuModule 未初始化或诊断工具不可用');
      return null;
    }
  };

  const cloneAcuDiceApiValue = value => {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  };

  const normalizeAcuDiceGachaInteger = (value: unknown, label: string, options: { allowNegative?: boolean } = {}) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) throw new Error(`[AcuDice][Gacha] ${label} 必须是有效数字`);
    const integer = Math.trunc(numeric);
    if (!options.allowNegative && integer < 0) throw new Error(`[AcuDice][Gacha] ${label} 不能小于 0`);
    return integer;
  };

  const buildAcuDiceGachaStateSnapshot = (state?: GachaState | null) => {
    const sourceState = state ? cloneGachaState(state) : getGachaState(undefined, true) || createDefaultGachaState();
    sourceState.activePoolTag = getGachaActivePoolTag(sourceState);
    return {
      fortune: Math.max(0, Math.floor(Number(sourceState.wallet.fortune || 0))),
      wallet: cloneAcuDiceApiValue(sourceState.wallet),
      activePoolTag: sourceState.activePoolTag,
      pity: cloneAcuDiceApiValue(sourceState.pity),
      recentRewards: cloneAcuDiceApiValue(sourceState.recentRewards),
      totalDraws: Math.max(0, Math.floor(Number(sourceState.totalDraws || 0))),
      inputStats: cloneAcuDiceApiValue(sourceState.inputStats),
      progress: getGachaFortuneProgressView(sourceState, { projectActiveProgress: true }),
    };
  };

  const serializeAcuDiceGachaPool = (pool: GachaPoolDefinition) => ({
    id: pool.id,
    name: pool.name,
    builtin: pool.builtin === true,
    visibleInTabs: pool.visibleInTabs === true,
    includeInAll: pool.includeInAll === true,
    order: Number(pool.order) || 0,
    canDelete: canDeleteGachaPoolDefinition(pool),
  });

  const serializeAcuDiceGachaItem = (item: GachaItemDefinition, customIds?: ReadonlySet<string>) => ({
    ...serializeGachaCatalogItemForExport(item),
    source: customIds?.has(item.id) ? 'custom' : 'builtin',
  });

  const serializeAcuDiceGachaDrawOutcome = (outcome: GachaDrawOutcome) => ({
    kind: outcome.kind,
    item: serializeAcuDiceGachaItem(outcome.item),
    quantity: outcome.quantity,
    duplicateConverted: outcome.duplicateConverted,
    shardGain: outcome.shardGain,
  });

  const serializeAcuDiceGachaDrawResult = (result: Awaited<ReturnType<typeof performGachaDraw>>) => ({
    success: result.success === true,
    drawCount: result.drawCount,
    cost: result.cost,
    outcomes: result.outcomes.map(serializeAcuDiceGachaDrawOutcome),
    state: buildAcuDiceGachaStateSnapshot(result.state),
    message: result.message,
    error: result.error || undefined,
  });

  const changeAcuDiceGachaFortune = createChangeAcuDiceGachaFortune({
    assertSaveStoredGachaStateSnapshot: (...a: any[]) => assertSaveStoredGachaStateSnapshot(...a),
    buildAcuDiceGachaStateSnapshot: (...a: any[]) => buildAcuDiceGachaStateSnapshot(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    normalizeAcuDiceGachaInteger: (...a: any[]) => normalizeAcuDiceGachaInteger(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const stringifyAcuDiceGachaCatalogInput = (input: unknown): string => {
    if (typeof input === 'string') return input;
    if (Array.isArray(input)) {
      return JSON.stringify({ kind: GACHA_CATALOG_EXPORT_KIND, version: GACHA_CATALOG_VERSION, items: input });
    }
    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      if (!Array.isArray(record.items) && record.name && record.quality) {
        return JSON.stringify({ kind: GACHA_CATALOG_EXPORT_KIND, version: GACHA_CATALOG_VERSION, items: [record] });
      }
    }
    return JSON.stringify(input);
  };

  const normalizeAcuDiceGachaImportMode = (mode: unknown): GachaCatalogImportMode => {
    const value = String(mode || 'overwrite').trim();
    return value === 'skip' || value === 'rename' || value === 'overwrite' ? value : 'overwrite';
  };

  const importAcuDiceGachaCatalog = async (
    input: unknown,
    options: { mode?: GachaCatalogImportMode; silent?: boolean } = {},
  ) => {
    const jsonString = stringifyAcuDiceGachaCatalogInput(input);
    const mode = normalizeAcuDiceGachaImportMode(options.mode);
    let stats: GachaCatalogImportStats | null = null;

    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const analysis = analyzeGachaCatalogImport(jsonString, rawData);
      if (!analysis || analysis.items.length === 0) {
        throw new Error(getGachaCatalogImportFailureMessage(analysis));
      }
      stats = await applyGachaCatalogImport(rawData, analysis, mode);
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    });

    if (!stats) throw new Error('骰子商店目录导入失败');
    if (!options.silent && window.toastr) {
      const title = stats.warnings.length > 0 ? '骰子商店导入完成，有部分跳过' : '骰子商店导入完成';
      window.toastr.success(formatGachaCatalogImportStatsText(stats), title);
    }
    const result = cloneAcuDiceApiValue(stats);
    emitEvent('gacha:catalog', { action: 'import', mode, stats: result });
    return result;
  };

  const upsertAcuDiceGachaPool = async (input: unknown, options: { silent?: boolean } = {}) => {
    const normalizedPool =
      typeof input === 'string'
        ? normalizeGachaPoolDefinition({ id: input, name: input, includeInAll: true, visibleInTabs: true })
        : normalizeGachaPoolDefinition(input);
    if (!normalizedPool || !normalizedPool.id || normalizedPool.id === GACHA_ALL_POOL_TAG) {
      throw new Error('[AcuDice][Gacha] upsertPool() 需要有效卡池 id');
    }

    const pools = getConfiguredGachaPoolDefinitions();
    const index = pools.findIndex(pool => pool.id === normalizedPool.id);
    const existing = index >= 0 ? pools[index] : null;
    const nextPool = {
      ...(existing || buildDefaultGachaPoolDefinition(normalizedPool.id, normalizedPool)),
      ...normalizedPool,
      builtin: existing?.builtin === true || isBuiltinGachaPoolId(normalizedPool.id),
      visibleInTabs: normalizedPool.includeInAll === true,
      includeInAll: normalizedPool.includeInAll === true,
    };
    if (index >= 0) pools[index] = nextPool;
    else pools.push(nextPool);
    saveGachaPoolSettings(pools);
    refreshGachaVisualization();
    refreshGachaShardShop();
    if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    const result = serializeAcuDiceGachaPool(nextPool);
    if (!options.silent && window.toastr) window.toastr.success(`卡池「${result.name}」已保存`, '骰子商店');
    emitEvent('gacha:catalog', { action: 'upsertPool', pool: result });
    return result;
  };

  const removeAcuDiceGachaCustomItem = async (itemId: unknown, options: { silent?: boolean } = {}) => {
    const id = String(itemId || '').trim();
    if (!id) throw new Error('[AcuDice][Gacha] removeCustomItem() 需要物品 id');
    let result: { removed: boolean; item: ReturnType<typeof serializeAcuDiceGachaItem> | null } | null = null;

    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const customItems = getCustomGachaItemDefinitions(rawData);
      const item = customItems.find(candidate => candidate.id === id) || null;
      if (!item) {
        if (GACHA_ITEM_DEFINITIONS.some(candidate => candidate.id === id)) {
          throw new Error('内置物品不能通过 API 删除，只能在商店设置里禁用');
        }
        result = { removed: false, item: null };
        return;
      }
      const nextItems = customItems.filter(candidate => candidate.id !== id);
      const saved = await saveStoredGachaCatalog(nextItems);
      if (!saved) throw new Error('自定义物品删除保存失败');
      deleteGachaItemSetting(id);
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
      result = { removed: true, item: serializeAcuDiceGachaItem(item, new Set([id])) };
    });

    if (!result) throw new Error('自定义物品删除失败');
    if (result.removed && !options.silent && window.toastr) window.toastr.success('自定义物品已删除', '骰子商店');
    emitEvent('gacha:catalog', { action: 'removeCustomItem', ...result });
    return result;
  };

  const removeAcuDiceGachaCustomPool = async (poolId: unknown, options: { silent?: boolean } = {}) => {
    const id = normalizeGachaPoolId(poolId);
    if (!id || id === GACHA_ALL_POOL_TAG) throw new Error('[AcuDice][Gacha] removeCustomPool() 需要有效的自定义卡池 id');
    let removed = false;

    await runInSaveQueue(async () => {
      const rawData = getRuntimeGachaRawData();
      await ensureGachaCatalogLoaded(rawData);
      const pool = getConfiguredGachaPoolDefinitions().find(candidate => candidate.id === id);
      if (pool && !canDeleteGachaPoolDefinition(pool)) {
        throw new Error('内置卡池不能通过 API 删除，只能调整是否参与全部池');
      }
      removed = await deleteGachaPoolConfig(id, rawData);
      refreshGachaVisualization();
      refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    });

    const result = { removed, poolId: id };
    if (removed && !options.silent && window.toastr) window.toastr.success(`卡池「${id}」已删除`, '骰子商店');
    emitEvent('gacha:catalog', { action: 'removeCustomPool', ...result });
    return result;
  };

  const acuDiceGachaApi = createAcuDiceGachaApi({
    costs: { singleDraw: GACHA_DRAW_COST_SINGLE, tenDraw: GACHA_DRAW_COST_TEN },
    currencyName: FORTUNE_CURRENCY_NAME,
    rarityOrder: GACHA_RARITY_ORDER,
    rewardTargets: GACHA_REWARD_TARGETS,
    buildStateSnapshot: (...a: any[]) => buildAcuDiceGachaStateSnapshot(...a),
    changeFortune: (...a: any[]) => changeAcuDiceGachaFortune(...a),
    confirmDialog: (opts: any) => showDiceSystemConfirmDialog(opts),
    serializeDrawResult: (...a: any[]) => serializeAcuDiceGachaDrawResult(...a),
    performDraw: (...a: any[]) => performGachaDraw(...a),
    emitEvent: (event: string, payload: any) => emitEvent(event, payload),
    normalizePoolId: (...a: any[]) => normalizeGachaPoolId(...a),
    getVisiblePools: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    updatePoolTag: (...a: any[]) => updateGachaPoolTag(...a),
    getRuntimeRaw: (...a: any[]) => getRuntimeGachaRawData(...a),
    ensureCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getAllPools: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    serializePool: (...a: any[]) => serializeAcuDiceGachaPool(...a),
    getCustomItems: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getAllItems: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getActivePoolTags: (...a: any[]) => getActiveGachaPoolTags(...a),
    isItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    compareItems: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    serializeItem: (...a: any[]) => serializeAcuDiceGachaItem(...a),
    exportCatalogJson: (...a: any[]) => exportGachaCatalogJson(...a),
    importCatalog: (...a: any[]) => importAcuDiceGachaCatalog(...a),
    upsertPoolApi: (...a: any[]) => upsertAcuDiceGachaPool(...a),
    removeCustomItemApi: (...a: any[]) => removeAcuDiceGachaCustomItem(...a),
    removeCustomPoolApi: (...a: any[]) => removeAcuDiceGachaCustomPool(...a),
    showShop: (...a: any[]) => showGachaVisualization(...a),
    closeShopApi: (...a: any[]) => closeGachaVisualization(...a),
    showShardShop: (...a: any[]) => showGachaShardShop(...a),
    showSettings: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const gachaRegexActions = new GachaRegexActions({
    gachaApi: acuDiceGachaApi,
    currencyName: FORTUNE_CURRENCY_NAME,
    getToastr: () => {
      try {
        return window.toastr || (rootWindow !== window ? (rootWindow as unknown as { toastr?: typeof window.toastr }).toastr : undefined);
      } catch {
        return window.toastr;
      }
    },
    getRuntimeErrorMessage: (error: unknown) => getRuntimeErrorMessage(error),
    showActionableErrorToast: (message: string, options?: any) => showActionableErrorToast(message, options),
    getCore: () => getCore(),
  });

  function bindAcuDiceGachaRegexActions() {
    gachaRegexActions.bind();
  }

  (AcuDiceAPI as Record<string, unknown>).gacha = acuDiceGachaApi;

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
})();
