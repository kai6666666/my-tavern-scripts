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
import { createCanWriteMvuPanel } from './features/mvu/can-write-mvu-panel';
import { createUpdateRuntimeDataCacheAfterCrud } from './features/table/update-runtime-data-cache-after-crud';
import { createUnwrapAdvancedPresetDocument } from './features/presets/unwrap-advanced-preset-document';
import { createSelectCrazyRollType } from './features/dice/select-crazy-roll-type';
import { createSaveSnapshot } from './features/table/save-snapshot';
import { createSaveGachaItemSettingsRecord } from './features/gacha/save-gacha-item-settings-record';
import { createSafeEncodeURIComponent } from './shared/safe-encode-uri-component';
import { createSafeDecodeURIComponent } from './shared/safe-decode-uri-component';
import { createRgbToAvatarHex } from './features/avatars/rgb-to-avatar-hex';
import { createResolveExistingTableName } from './features/table/resolve-existing-table-name';
import { createResolveCustomTableNameIconManagerDirectSection } from './features/table/resolve-custom-table-name-icon-manager-direct-section';
import { createReplaceUserPlaceholders } from './features/dice/replace-user-placeholders';
import { createRenderGlobalInteractionMapMark } from './features/table/render-global-interaction-map-mark';
import { createRenderGlobalInteractionGenericMark } from './features/table/render-global-interaction-generic-mark';
import { createPushModal } from './features/ui/push-modal';
import { createPatchCrudSheetInRecord } from './features/table/patch-crud-sheet-in-record';
import { createOpenLegacyDatabaseSettings } from './features/table/open-legacy-database-settings';
import { createNormalizeLeadingCheckSuggestionSideShorthand } from './features/dice/normalize-leading-check-suggestion-side-shorthand';
import { createNormalizeFloatingCollapsePosition } from './features/ui/normalize-floating-collapse-position';
import { createNormalizeDiceConfigBackupSelectedModuleIds } from './features/dice/normalize-dice-config-backup-selected-module-ids';
import { createNormalizeAttributeQuickSelectConfig } from './features/dice/normalize-attribute-quick-select-config';
import { createNormalizeAttributeName } from './shared/normalize-attribute-name';
import { createIsLikelyGlobalInteractionNameHeader } from './features/table/is-likely-global-interaction-name-header';
import { createIsGachaItemOwned } from './features/gacha/is-gacha-item-owned';
import { createIsDatabaseManualUpdateActionButton } from './features/table/is-database-manual-update-action-button';
import { createHashGachaSeed } from './features/gacha/hash-gacha-seed';
import { createHashGachaCatalogSeed } from './features/gacha/hash-gacha-catalog-seed';
import { createHasDiceConfigBackupLocalImageReference } from './features/dice/has-dice-config-backup-local-image-reference';
import { createGetPanelDragStartHeight } from './features/ui/get-panel-drag-start-height';
import { createGetNamedCheckParamText } from './features/dice/get-named-check-param-text';
import { createGetLocationEmoji } from './features/table/get-location-emoji';
import { createGetLegacyInventoryMetadataRoot } from './features/gacha/get-legacy-inventory-metadata-root';
import { createGetInventoryDefaultMetaRecord } from './features/gacha/get-inventory-default-meta-record';
import { createGetGlobalInteractionAvatarLookupNames } from './features/table/get-global-interaction-avatar-lookup-names';
import { createGetGachaCatalogImportFailureMessage } from './features/gacha/get-gacha-catalog-import-failure-message';
import { createGetDiffRowDisplayTitle } from './features/table/get-diff-row-display-title';
import { createGetCrudSqlCommentAliases } from './features/table/get-crud-sql-comment-aliases';
import { createGetCrudColumnNameForHeader } from './features/table/get-crud-column-name-for-header';
import { createGetCheckSuggestionOutcomeResultType } from './features/dice/get-check-suggestion-outcome-result-type';
import { createGetBadgeStyle } from './features/table/get-badge-style';
import { createGetAttributeRangeBounds } from './features/dice/get-attribute-range-bounds';
import { createGetActivePanelHeightKey } from './features/ui/get-active-panel-height-key';
import { createGetAccessibleDocument } from './features/ui/get-accessible-document';
import { createFormatCssImageUrl } from './shared/format-css-image-url';
import { createFindGachaDefinitionByItemId } from './features/gacha/find-gacha-definition-by-item-id';
import { createDownloadDiceProfileTavernRegex } from './features/dice/download-dice-profile-tavern-regex';
import { createDefineAcuDiceOnWindow } from './features/api/define-acu-dice-on-window';
import { createDecodeCrudSqlIdentifier } from './features/table/decode-crud-sql-identifier';
import { createCreateAdvancedPresetRollResult } from './features/presets/create-advanced-preset-roll-result';
import { createCollectHostAndLocalNodes } from './features/ui/collect-host-and-local-nodes';
import { createClearAllPanelStates } from './features/ui/clear-all-panel-states';
import { createAssertGachaRewardNameColumn } from './features/gacha/assert-gacha-reward-name-column';
import { createAssertAppendOnlyRows } from './features/table/assert-append-only-rows';
import { createApplyStoredPanelHeight } from './features/ui/apply-stored-panel-height';
import { createAcuDiceEventsInstance } from './features/api/acu-dice-events-instance';
import { createAcuDiceCharactersInstance } from './features/api/acu-dice-characters-instance';
import { createCustomTableNameIconManagerDirectModuleBySection } from './features/table/custom-table-name-icon-manager-direct-module-by-section';
import { createCustomTableNameIconDeniedModules } from './features/table/custom-table-name-icon-denied-modules';
import { createActionButtons } from './features/table/action-buttons';
import { createCollectDiceConfigBackupGachaCatalogRecords } from './features/dice/collect-dice-config-backup-gacha-catalog-records';
import { createCloneAdvancedPresetFieldWithDefaults } from './features/presets/clone-advanced-preset-field-with-defaults';
import { createCapturePendingHumanInputSnapshot } from './features/human-input/capture-pending-human-input-snapshot';
import { createBindTutorialButtonsIn } from './features/tutorial/bind-tutorial-buttons-in';
import { createInventoryQualityFilterMeta } from './features/gacha/inventory-quality-filter-meta';
import { createCustomTableNameIconAllowedPanelSections } from './features/table/custom-table-name-icon-allowed-panel-sections';
import { createAcuDatabaseNewUiApiMethods } from './features/table/acu-database-new-ui-api-methods';
import { createTouchGachaActivity } from './features/gacha/touch-gacha-activity';
import { createThrowAdvancedPresetValidationIssues } from './features/presets/throw-advanced-preset-validation-issues';
import { createSetInventoryRowBasicFields } from './features/gacha/set-inventory-row-basic-fields';
import { createSetDiceProfilePromptState } from './features/dice/set-dice-profile-prompt-state';
import { createSetActiveTableNavButton } from './features/table/set-active-table-nav-button';
import { createSerializeAcuDiceGachaPool } from './features/api/serialize-acu-dice-gacha-pool';
import { createSerializeAcuDiceGachaDrawResult } from './features/api/serialize-acu-dice-gacha-draw-result';
import { createScheduleFloatingCollapseBoundsRefresh } from './features/ui/schedule-floating-collapse-bounds-refresh';
import { createSavePanelRequestedHeight } from './features/ui/save-panel-requested-height';
import { createSaveInventoryMetadataRecord } from './features/gacha/save-inventory-metadata-record';
import { createResolveDashboardCustomTableNameIconContextInfo } from './features/dashboard/resolve-dashboard-custom-table-name-icon-context-info';
import { createResetPanelRequestedHeight } from './features/ui/reset-panel-requested-height';
import { createPushDiceQuickSelectCharacter } from './features/dice/push-dice-quick-select-character';
import { createPopModal } from './features/ui/pop-modal';
import { createParseSqlQuotedValues } from './shared/parse-sql-quoted-values';
import { createParseImageUrl } from './shared/parse-image-url';
import { createParseCheckSuggestionModifierValue } from './features/dice/parse-check-suggestion-modifier-value';
import { createOpenDatabaseInterface } from './features/table/open-database-interface';
import { createGetViewportAnchorRect } from './features/ui/get-viewport-anchor-rect';
import { createGetGachaSettingsFilterLabel } from './features/gacha/get-gacha-settings-filter-label';
import { createGetCustomTableNameIconManagerInvalidSourceText } from './features/table/get-custom-table-name-icon-manager-invalid-source-text';
import { createGetAttributeRulePresetById } from './features/dice/get-attribute-rule-preset-by-id';
import { createGenerateAttributeValue } from './features/dice/generate-attribute-value';
import { createFindSillyTavernSlashRunner } from './features/table/find-silly-tavern-slash-runner';
import { createFindRelationGraphColumnIndex } from './features/table/find-relation-graph-column-index';
import { createCreateBuiltinRenderPreset } from './features/presets/create-builtin-render-preset';
import { createCreateBuiltinDashboardPreset } from './features/presets/create-builtin-dashboard-preset';
import { createCoerceAdvancedPresetContextNumber } from './features/presets/coerce-advanced-preset-context-number';
import { createAssignAdvancedPresetContextNumber } from './features/presets/assign-advanced-preset-context-number';
import { createSettingsGroupTutorialMap } from './features/tutorial/settings-group-tutorial-map';
import { createGachaSettingsSortOptions } from './features/gacha/gacha-settings-sort-options';
import { createGachaCommonWrittenTargetColumnKeys } from './features/gacha/gacha-common-written-target-column-keys';
import { createDashboardModuleSectionKind } from './features/dashboard/dashboard-module-section-kind';
import { createAssertRuntimeCrudApi } from './features/table/assert-runtime-crud-api';
import { createViewportBottomRefreshEvents } from './features/ui/viewport-bottom-refresh-events';
import { createGachaTargetColumnLabels } from './features/gacha/gacha-target-column-labels';
import { createGachaTargetColumnKeys } from './features/gacha/gacha-target-column-keys';
import { createDiceConfigBackupActiveKeyToPresetKey } from './features/dice/dice-config-backup-active-key-to-preset-key';
import { createWeightedRandomSelect } from './shared/weighted-random-select';
import { createUpdateGachaPoolTag } from './features/gacha/update-gacha-pool-tag';
import { createToDiceProfileSummary } from './features/dice/to-dice-profile-summary';
import { createScheduleViewportBoundsRefresh } from './features/ui/schedule-viewport-bounds-refresh';
import { createScheduleFixedWrapperBoundsRefresh } from './features/ui/schedule-fixed-wrapper-bounds-refresh';
import { createSaveDiceConfig } from './features/dice/save-dice-config';
import { createResolveCheckSuggestionDefaultValue } from './features/dice/resolve-check-suggestion-default-value';
import { createRenderThemeIconContent } from './features/ui/render-theme-icon-content';
import { createRefreshNameAliasesForCheckSuggestion } from './features/dice/refresh-name-aliases-for-check-suggestion';
import { createReadStoredTextareaDiceText } from './features/dice/read-stored-textarea-dice-text';
import { createReadStoredLatestDiceText } from './features/dice/read-stored-latest-dice-text';
import { createParseRenderPresetAttributes } from './features/presets/parse-render-preset-attributes';
import { createParseCheckSuggestionTieRule } from './features/dice/parse-check-suggestion-tie-rule';
import { createNormalizeRenderPresetAliasMap } from './features/presets/normalize-render-preset-alias-map';
import { createNormalizeDiceProfileModuleIds } from './features/dice/normalize-dice-profile-module-ids';
import { createNormalizeDashboardKeywordArray } from './features/dashboard/normalize-dashboard-keyword-array';
import { createIsUserCharacterName } from './features/characters/is-user-character-name';
import { createIsPureIndexCell } from './features/table/is-pure-index-cell';
import { createHasDiceConfigBackupRecoverableStorage } from './features/dice/has-dice-config-backup-recoverable-storage';
import { createGetRuntimeErrorMessage } from './features/table/get-runtime-error-message';
import { createGetRuntimeErrorLogPayload } from './features/table/get-runtime-error-log-payload';
import { createGetRenderPresetBadgeStyle } from './features/presets/get-render-preset-badge-style';
import { createGetMatchedGlobalInteractionRuleKeywords } from './features/table/get-matched-global-interaction-rule-keywords';
import { createGetGachaNamedCustomField } from './features/gacha/get-gacha-named-custom-field';
import { createGetDiceProfileRecords } from './features/dice/get-dice-profile-records';
import { createGetDiceConfigBackupModuleCountText } from './features/dice/get-dice-config-backup-module-count-text';
import { createGetDiceConfigBackupAvailableModuleIds } from './features/dice/get-dice-config-backup-available-module-ids';
import { createGetAttributeEntryForCharacter } from './features/dice/get-attribute-entry-for-character';
import { createGenerateUniqueName } from './shared/generate-unique-name';
import { createFormatGachaRelativeTime } from './features/gacha/format-gacha-relative-time';
import { createFindLatestDbMessageIndex } from './features/table/find-latest-db-message-index';
import { createFindGachaTargetColumnIndex } from './features/gacha/find-gacha-target-column-index';
import { createFindDashboardNpcNameColumnIndex } from './features/dashboard/find-dashboard-npc-name-column-index';
import { createFindAttributeColumnIndices } from './features/dice/find-attribute-column-indices';
import { createDeleteGachaItemSetting } from './features/gacha/delete-gacha-item-setting';
import { createWithGachaItemSettings } from './features/gacha/with-gacha-item-settings';
import { createWaitForDatabaseManualUpdateSurface } from './features/table/wait-for-database-manual-update-surface';
import { createToggleTableReverse } from './features/table/toggle-table-reverse';
import { createSetDiffDataCell } from './features/table/set-diff-data-cell';
import { createSetAllTablesReverse } from './features/table/set-all-tables-reverse';
import { createScheduleViewportInputTargetRefresh } from './features/ui/schedule-viewport-input-target-refresh';
import { createScheduleFixedAnchorTargetRefresh } from './features/ui/schedule-fixed-anchor-target-refresh';
import { createRefreshDiceProfileIndex } from './features/dice/refresh-dice-profile-index';
import { createReadRuntimeTableData } from './features/table/read-runtime-table-data';
import { createPickFallbackAttributeColumn } from './features/dice/pick-fallback-attribute-column';
import { createPatchCrudRowIdIfMissing } from './features/table/patch-crud-row-id-if-missing';
import { createParseAdvancedPresetSourceText } from './features/presets/parse-advanced-preset-source-text';
import { createNormalizeDiceConfigBackupGachaPoolSettings } from './features/dice/normalize-dice-config-backup-gacha-pool-settings';
import { createLoadSnapshot } from './features/table/load-snapshot';
import { createLoadAvatarImageForColor } from './features/avatars/load-avatar-image-for-color';
import { createIsNumericCell } from './shared/is-numeric-cell';
import { createIsNpcLikeTableName } from './features/table/is-npc-like-table-name';
import { createImportDiceProfile } from './features/dice/import-dice-profile';
import { createHasGachaRewardTableForItem } from './features/gacha/has-gacha-reward-table-for-item';
import { createGetPanelHostMessage } from './features/ui/get-panel-host-message';
import { createGetNavigationFontMetrics } from './features/ui/get-navigation-font-metrics';
import { createGetGachaChatIdSeed } from './features/gacha/get-gacha-chat-id-seed';
import { createGetGachaCatalogItemsForExport } from './features/gacha/get-gacha-catalog-items-for-export';
import { createGetEmojiCandidates } from './features/table/get-emoji-candidates';
import { createGetDiceConfigBackupValueIdentity } from './features/dice/get-dice-config-backup-value-identity';
import { createGetDiceConfigBackupRestoreWarnings } from './features/dice/get-dice-config-backup-restore-warnings';
import { createGetAdvancedPresetMappedTarget } from './features/presets/get-advanced-preset-mapped-target';
import { createCreateDiffRowMatcher } from './features/table/create-diff-row-matcher';
import { createCloseGachaVisualization } from './features/gacha/close-gacha-visualization';
import { createBuildTableTemplateRequirementPresetAgentPromptFilename } from './features/presets/build-table-template-requirement-preset-agent-prompt-filename';
import { createBuildRenderPresetAgentPromptFilename } from './features/presets/build-render-preset-agent-prompt-filename';
import { createBuildGachaInventoryMetaRecord } from './features/gacha/build-gacha-inventory-meta-record';
import { createBuildGachaCatalogAgentPromptFilename } from './features/presets/build-gacha-catalog-agent-prompt-filename';
import { createBuildDashboardPresetAgentPromptFilename } from './features/presets/build-dashboard-preset-agent-prompt-filename';
import { createBuildAdvancedPresetAgentPromptFilename } from './features/presets/build-advanced-preset-agent-prompt-filename';
import { createBuildActionPresetAgentPromptFilename } from './features/presets/build-action-preset-agent-prompt-filename';
import { createStoreTextareaDiceCache } from './features/chat/store-textarea-dice-cache';
import { createShowDatabaseManualUpdateFailure } from './features/table/show-database-manual-update-failure';
import { createSetupFloatingCollapseBoundsListeners } from './features/ui/setup-floating-collapse-bounds-listeners';
import { createSetEquipmentRowBasicFields } from './features/gacha/set-equipment-row-basic-fields';
import { createRestoreDiceResultBeforeSend } from './features/chat/restore-dice-result-before-send';
import { createResolveGlobalInteractionSectionMeta } from './features/interactions/resolve-global-interaction-section-meta';
import { createResolveCustomTableNameIconAssetUrl } from './features/table/resolve-custom-table-name-icon-asset-url';
import { createRefreshGachaPoolSelectionUi } from './features/gacha/refresh-gacha-pool-selection-ui';
import { createMergeImportedGachaPools } from './features/gacha/merge-imported-gacha-pools';
import { createGetInventoryMetadataRoot } from './features/dice/get-inventory-metadata-root';
import { createGetInventoryDetailContext } from './features/dice/get-inventory-detail-context';
import { createGetFloatingViewportBounds } from './features/ui/get-floating-viewport-bounds';
import { createGetCurrentContextFingerprint } from './features/chat/get-current-context-fingerprint';
import { createGetAvatarLookupNames } from './features/avatars/get-avatar-lookup-names';
import { createExportGachaCatalogJson } from './features/gacha/export-gacha-catalog-json';
import { createDownloadGachaCatalogJson } from './features/gacha/download-gacha-catalog-json';
import { createCompareVersion } from './shared/compare-version';
import { createClearFixedWrapperBoundsListeners } from './features/ui/clear-fixed-wrapper-bounds-listeners';
import { createGlobalInteractionNonNameHeaderKeywords } from './features/interactions/global-interaction-non-name-header-keywords';
import { createSetupViewportInputMutationObserver } from './features/ui/setup-viewport-input-mutation-observer';
import { createSetupFixedAnchorMutationObserver } from './features/ui/setup-fixed-anchor-mutation-observer';
import { createRestoreDiceConfigBackupGachaCatalogSnapshot } from './features/dice/restore-dice-config-backup-gacha-catalog-snapshot';
import { createResolveCheckSuggestionNumberParam } from './features/checks/resolve-check-suggestion-number-param';
import { createProcessTemplate } from './shared/process-template';
import { createNormalizeImportedGachaPoolTags } from './features/gacha/normalize-imported-gacha-pool-tags';
import { createNormalizeDiceConfigBackupGachaItemSettings } from './features/dice/normalize-dice-config-backup-gacha-item-settings';
import { createNormalizeCustomTableNameIconPackEntryMetadata } from './features/table/normalize-custom-table-name-icon-pack-entry-metadata';
import { createGetTableData } from './features/table/get-table-data';
import { createGetSheetKeyByTableName } from './features/table/get-sheet-key-by-table-name';
import { createGetDiceConfigBackupStoredValue } from './features/dice/get-dice-config-backup-stored-value';
import { createEnsureGachaCatalogLoaded } from './features/gacha/ensure-gacha-catalog-loaded';
import { createCreateDiceProfilePreApplySnapshot } from './features/dice/create-dice-profile-pre-apply-snapshot';
import { createCreateCustomTableNameIconContext } from './features/table/create-custom-table-name-icon-context';
import { createAcuDiceContest } from './features/api/acu-dice-contest';
import { createDefaultDialogueIndentTagBlacklist } from './shared/default-dialogue-indent-tag-blacklist';
import { createValidateGachaCustomFieldsForExistingRow } from './features/gacha/validate-gacha-custom-fields-for-existing-row';
import { createSyncCheckRuleTagsInTemplate } from './features/presets/sync-check-rule-tags-in-template';
import { createSaveStoredGachaCatalog } from './features/gacha/save-stored-gacha-catalog';
import { createRenderGlobalInteractionAvatar } from './features/interactions/render-global-interaction-avatar';
import { createRenderCustomTableNameIconContent } from './features/table/render-custom-table-name-icon-content';
import { createRefreshGachaVisualization } from './features/gacha/refresh-gacha-visualization';
import { createRefreshFixedAnchorResizeObserver } from './features/ui/refresh-fixed-anchor-resize-observer';
import { createOpenLegacyDatabaseVisualizer } from './features/table/open-legacy-database-visualizer';
import { createNormalizeCustomTableNameIconPackEntry } from './features/table/normalize-custom-table-name-icon-pack-entry';
import { createGetTemplateInspectionSheets } from './features/table/get-template-inspection-sheets';
import { createGetGachaDiceEventDetail } from './features/gacha/get-gacha-dice-event-detail';
import { createGetDiceConfigBackupTableTemplateRollbackSnapshot } from './features/dice/get-dice-config-backup-table-template-rollback-snapshot';
import { createGetDashboardNpcListData } from './features/dashboard/get-dashboard-npc-list-data';
import { createGetCustomTableNameIconManagerContextLabel } from './features/table/get-custom-table-name-icon-manager-context-label';
import { createFindRelationshipGraphSourceTables } from './features/dashboard/find-relationship-graph-source-tables';
import { createClosePanel } from './features/ui/close-panel';
import { createClearViewportInputTargetListeners } from './features/ui/clear-viewport-input-target-listeners';
import { createClearDiceLocalCacheData } from './features/dice/clear-dice-local-cache-data';
import { createBuildCrudRequiredHeaderSet } from './features/table/build-crud-required-header-set';
import { createWaitForDatabaseNewUiManualUpdateButton } from './features/table/wait-for-database-new-ui-manual-update-button';
import { createSettleGachaFortuneForDiceEvent } from './features/gacha/settle-gacha-fortune-for-dice-event';
import { createSetInventoryMetadataForItem } from './features/dice/set-inventory-metadata-for-item';
import { createSaveGachaPoolSettings } from './features/gacha/save-gacha-pool-settings';
import { createRunMaybeAsyncDatabaseManualUpdate } from './features/table/run-maybe-async-database-manual-update';
import { createRestoreGachaLocalStorageSnapshot } from './features/gacha/restore-gacha-local-storage-snapshot';
import { createRenderInventoryMetadataHtml } from './features/dice/render-inventory-metadata-html';
import { createRefreshInventoryVisualization } from './features/dice/refresh-inventory-visualization';
import { createPersistRawDataWithGacha } from './features/gacha/persist-raw-data-with-gacha';
import { createDeleteRowInstantly } from './features/table/delete-row-instantly';
import { createBuildCheckSuggestionSideParams } from './features/checks/build-check-suggestion-side-params';
import { createApplyGachaTargetColumnOverrides } from './features/gacha/apply-gacha-target-column-overrides';
import { createApplyGachaCustomFieldsToRow } from './features/gacha/apply-gacha-custom-fields-to-row';
import { createSyncTextareaDiceCacheFromVisibleText } from './features/chat/sync-textarea-dice-cache-from-visible-text';
import { createStripLoneSurrogates } from './shared/strip-lone-surrogates';
import { createRunDatabaseManualUpdateViaNewUiButton } from './features/table/run-database-manual-update-via-new-ui-button';
import { createResolveGachaTargetTableOverride } from './features/gacha/resolve-gacha-target-table-override';
import { createResolveEquipmentTableTypeForGachaItem } from './features/gacha/resolve-equipment-table-type-for-gacha-item';
import { createRenderInventoryFilterButtons } from './features/dice/render-inventory-filter-buttons';
import { createPickGachaItemDefinition } from './features/gacha/pick-gacha-item-definition';
import { createParseDiceProfileInput } from './features/dice/parse-dice-profile-input';
import { createIsDashboardRoleInSceneValue } from './features/dashboard/is-dashboard-role-in-scene-value';
import { createGetOptionItemsFromTable } from './features/table/get-option-items-from-table';
import { createGetEquipmentColumnMap } from './features/gacha/get-equipment-column-map';
import { createGetDiffRowIdentityKeys } from './features/table/get-diff-row-identity-keys';
import { createGetDiceConfigBackupModuleResourceCount } from './features/dice/get-dice-config-backup-module-resource-count';
import { createGetDiceConfigBackupKnownPresetIds } from './features/dice/get-dice-config-backup-known-preset-ids';
import { createFindDeletionIndicesForCrud } from './features/table/find-deletion-indices-for-crud';
import { createFindComposerSendButton } from './features/chat/find-composer-send-button';
import { createCreateGlobalInteractionCustomTableNameIconContext } from './features/interactions/create-global-interaction-custom-table-name-icon-context';
import { createCollectCurrentChatAvatarNodes } from './features/avatars/collect-current-chat-avatar-nodes';
import { createBuildCrudLengthConstraintMap } from './features/table/build-crud-length-constraint-map';
import { createBindGachaShardShopInteractions } from './features/gacha/bind-gacha-shard-shop-interactions';
import { createAddClearButton } from './features/ui/add-clear-button';
import { createThemes } from './features/ui/themes';
import { createUpdateSingleAttribute } from './features/table/update-single-attribute';
import { createUpdateGachaPoolConfig } from './features/gacha/update-gacha-pool-config';
import { createSaveCurrentDiceProfile } from './features/dice/save-current-dice-profile';
import { createResolveCheckSuggestionFieldValue } from './features/checks/resolve-check-suggestion-field-value';
import { createRefreshViewportInputTargetListeners } from './features/ui/refresh-viewport-input-target-listeners';
import { createPatchCrudSheetInMessage } from './features/table/patch-crud-sheet-in-message';
import { createNormalizeGachaPoolDefinition } from './features/gacha/normalize-gacha-pool-definition';
import { createNormalizeDiceProfileRecord } from './features/dice/normalize-dice-profile-record';
import { createExtractAdvancedPresetJsonCandidates } from './features/presets/extract-advanced-preset-json-candidates';
import { createClampFloatingCollapsePosition } from './features/ui/clamp-floating-collapse-position';
import { createAssertCrudRequiredCellValues } from './features/table/assert-crud-required-cell-values';
import { createGlobalInteractionNameHeaders } from './features/interactions/global-interaction-name-headers';
import { createValidateJsoncEditorConfig } from './features/presets/validate-jsonc-editor-config';
import { createShowTemplateInspectionModal } from './features/table/show-template-inspection-modal';
import { createSanitizeDiceConfigBackupValidationRule } from './features/dice/sanitize-dice-config-backup-validation-rule';
import { createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport } from './features/dice/sanitize-dice-config-backup-custom-only-preset-array-for-export';
import { createReplaceCheckSuggestionConditionVars } from './features/checks/replace-check-suggestion-condition-vars';
import { createParseAdvancedPresetText } from './features/presets/parse-advanced-preset-text';
import { createOpenDatabaseFormFillPage } from './features/table/open-database-form-fill-page';
import { createMergeDiceConfigBackupGachaItemSettings } from './features/dice/merge-dice-config-backup-gacha-item-settings';
import { createImportGachaCatalogJsonFromFile } from './features/gacha/import-gacha-catalog-json-from-file';
import { createGetInventoryEnumOptions } from './features/dice/get-inventory-enum-options';
import { createGetInventoryColumnMap } from './features/gacha/get-inventory-column-map';
import { createGetGachaPickupItems } from './features/gacha/get-gacha-pickup-items';
import { createGetCrudRequiredColumnsByHeaderIndex } from './features/table/get-crud-required-columns-by-header-index';
import { createGetConfiguredGachaPoolDefinitions } from './features/gacha/get-configured-gacha-pool-definitions';
import { createCreateGlobalInteractionSections } from './features/interactions/create-global-interaction-sections';
import { createCloneDashboardConfig } from './features/dashboard/clone-dashboard-config';
import { createClearViewportBoundsListeners } from './features/ui/clear-viewport-bounds-listeners';
import { createBuildRowDataForCrud } from './features/table/build-row-data-for-crud';
import { createMergeDiceConfigBackupValidationRules } from './features/dice/merge-dice-config-backup-validation-rules';
import { createMaybePromptCharacterDiceProfile } from './features/dice/maybe-prompt-character-dice-profile';
import { createGetRuntimeWindowCandidates } from './features/ui/get-runtime-window-candidates';
import { createAssertCrudRequiredColumnsRepresented } from './features/table/assert-crud-required-columns-represented';
import { createApplyDiceProfile } from './features/dice/apply-dice-profile';
import { createTakeDiffRowMatch } from './features/table/take-diff-row-match';
import { createShowInventoryVisualization } from './features/dice/show-inventory-visualization';
import { createSendTextViaComposer } from './features/chat/send-text-via-composer';
import { createRenderInterface } from './features/ui/render-interface';
import { createRenderGlobalInteractionsSection } from './features/interactions/render-global-interactions-section';
import { createRenderGachaSettingsPoolTabsHtml } from './features/gacha/render-gacha-settings-pool-tabs-html';
import { createRemapDiceConfigBackupGachaItemSettings } from './features/dice/remap-dice-config-backup-gacha-item-settings';
import { createGetPersonaName } from './features/avatars/get-persona-name';
import { createGetInventoryCharacters } from './features/dice/get-inventory-characters';
import { createGetIconForTableName } from './features/table/get-icon-for-table-name';
import { createGetGachaItemDefinitionFingerprint } from './features/gacha/get-gacha-item-definition-fingerprint';
import { createGetActionsForTable } from './features/actions/get-actions-for-table';
import { createFormatDiceConfigBackupPrivacyDetail } from './features/dice/format-dice-config-backup-privacy-detail';
import { createClearFloatingCollapseBoundsListeners } from './features/ui/clear-floating-collapse-bounds-listeners';
import { createSyncHostRegenerateButtonVisibility } from './features/ui/sync-host-regenerate-button-visibility';
import { createRenderDiceHistoryStatsHtml } from './features/dice/render-dice-history-stats-html';
import { createGetGachaPoolDefinitionsWithVirtualTags } from './features/gacha/get-gacha-pool-definitions-with-virtual-tags';
import { createGetCheckSuggestionItemsFromTable } from './features/checks/get-check-suggestion-items-from-table';
import { createDetectCharacterDiceProfile } from './features/dice/detect-character-dice-profile';
import { createCreateCustomTableNameIconManagerCandidate } from './features/table/create-custom-table-name-icon-manager-candidate';
import { createComposeTextareaTextWithHiddenDice } from './features/chat/compose-textarea-text-with-hidden-dice';
import { createBuildCrudEnumConstraintMap } from './features/table/build-crud-enum-constraint-map';
import { createUpsertDiceProfileRecord } from './features/dice/upsert-dice-profile-record';
import { createUpdateSaveButtonState } from './features/table/update-save-button-state';
import { createRunDatabaseManualUpdate } from './features/table/run-database-manual-update';
import { createResolveGlobalInteractionRowTitle } from './features/interactions/resolve-global-interaction-row-title';
import { createRenderInlineQuickCheckButton } from './features/checks/render-inline-quick-check-button';
import { createRemoveAcuDiceGachaCustomPool } from './features/gacha/remove-acu-dice-gacha-custom-pool';
import { createRefreshDicePanelPresets } from './features/dice/refresh-dice-panel-presets';
import { createPrepareMvuTutorial } from './features/tutorial/prepare-mvu-tutorial';
import { createNormalizeRenderPresetTagFilterList } from './features/presets/normalize-render-preset-tag-filter-list';
import { createGetStoredGachaItemSettings } from './features/gacha/get-stored-gacha-item-settings';
import { createGetGachaItemCustomTableNameIconContext } from './features/gacha/get-gacha-item-custom-table-name-icon-context';
import { createGetFullAttributesForCharacter } from './features/table/get-full-attributes-for-character';
import { createGetCrudUnsupportedFallbackConstraintText } from './features/table/get-crud-unsupported-fallback-constraint-text';
import { createRefreshAutoImageColorForAvatar } from './features/avatars/refresh-auto-image-color-for-avatar';
import { createProcessJsonData } from './features/dice/process-json-data';
import { createNormalizeDiceConfigBackupGachaCatalogResourceRecord } from './features/dice/normalize-dice-config-backup-gacha-catalog-resource-record';
import { createImportAcuDiceGachaCatalog } from './features/gacha/import-acu-dice-gacha-catalog';
import { createGetUserAvatarUrl } from './features/avatars/get-user-avatar-url';
import { createGetCore } from './shared/get-core';
import { createUpdateChangesCount } from './features/validation/update-changes-count';
import { createSerializeGachaCatalogItemForExport } from './features/gacha/serialize-gacha-catalog-item-for-export';
import { createRenderGachaSettingsPoolViewerHtml } from './features/gacha/render-gacha-settings-pool-viewer-html';
import { createIsCustomTableNameIconContextAllowed } from './features/table/is-custom-table-name-icon-context-allowed';
import { createHslToAvatarHex } from './features/avatars/hsl-to-avatar-hex';
import { createClearGlobalGachaCatalog } from './features/gacha/clear-global-gacha-catalog';
import { createBuildGachaDiceEventSettlementKey } from './features/gacha/build-gacha-dice-event-settlement-key';
import { createSetupViewportBoundsListeners } from './features/ui/setup-viewport-bounds-listeners';
import { createSettleGachaFortuneForMessage } from './features/gacha/settle-gacha-fortune-for-message';
import { createRestoreDiceConfigBackupTableTemplateRollbackSnapshot } from './features/dice/restore-dice-config-backup-table-template-rollback-snapshot';
import { createPrepareSettingsGroupTutorial } from './features/tutorial/prepare-settings-group-tutorial';
import { createClearDiceSystemCache } from './features/dice/clear-dice-system-cache';
import { createBindHumanInputTracking } from './features/chat/bind-human-input-tracking';
import { createValidateAdvancedPresetAgentTests } from './features/presets/validate-advanced-preset-agent-tests';
import { createSetupFixedWrapperBoundsListeners } from './features/ui/setup-fixed-wrapper-bounds-listeners';
import { createPickGachaRarity } from './features/gacha/pick-gacha-rarity';
import { createNormalizeCustomTableNameIconEntry } from './features/table/normalize-custom-table-name-icon-entry';
import { createMergeDiceConfigBackupCustomRules } from './features/dice/merge-dice-config-backup-custom-rules';
import { createHydrateGlobalInteractionAvatars } from './features/interactions/hydrate-global-interaction-avatars';
import { createCollectDiceProfileRegexScriptsFromRecord } from './features/dice/collect-dice-profile-regex-scripts-from-record';
import { createBuildGachaTableResultFromSheet } from './features/gacha/build-gacha-table-result-from-sheet';
import { createAddStyles } from './shared/add-styles';
import { createSetupOverlayClose } from './shared/setup-overlay-close';
import { createRestoreDiceConfigBackupModuleResources } from './features/dice/restore-dice-config-backup-module-resources';
import { createRenderGachaPickupHtml } from './features/gacha/render-gacha-pickup-html';
import { createPrepareAvatarManagerTutorial } from './features/tutorial/prepare-avatar-manager-tutorial';
import { createNormalizeCheckSuggestionCommandInput } from './features/checks/normalize-check-suggestion-command-input';
import { createGetViewportBottomOffset } from './features/ui/get-viewport-bottom-offset';
import { createFormatOutputTemplate } from './features/dice/format-output-template';
import { createSaveSheetsViaJsonFloorWithoutTracking } from './features/table/save-sheets-via-json-floor-without-tracking';
import { createRenderGlobalInteractionRowCard } from './features/interactions/render-global-interaction-row-card';
import { createParseAttributeString } from './features/dice/parse-attribute-string';
import { createMergeDiceConfigBackupGachaPoolSettings } from './features/dice/merge-dice-config-backup-gacha-pool-settings';
import { createAssertCrudLengthConstraints } from './features/table/assert-crud-length-constraints';
import { createAssertCrudEnumConstraints } from './features/table/assert-crud-enum-constraints';
import { createSaveCurrentTabState } from './features/ui/save-current-tab-state';
import { createRemoveAcuDiceGachaCustomItem } from './features/gacha/remove-acu-dice-gacha-custom-item';
import { createFlushGachaHeartbeatProgress } from './features/gacha/flush-gacha-heartbeat-progress';
import { createEvaluateOutcomes } from './features/presets/evaluate-outcomes';
import { createCloneDashboardPresetModules } from './features/dashboard/clone-dashboard-preset-modules';
import { createBuildCheckValueText } from './features/checks/build-check-value-text';
import { createApplyAdvancedPresetOutcomePolicy } from './features/presets/apply-advanced-preset-outcome-policy';
import { createValidateAdvancedPresetTemplates } from './features/presets/validate-advanced-preset-templates';
import { createSelectCrazyAttribute } from './features/presets/select-crazy-attribute';
import { createRestoreDiceConfigBackupTableTemplate } from './features/dice/restore-dice-config-backup-table-template';
import { createResolveBatchLocationEmojis } from './features/table/resolve-batch-location-emojis';
import { createRenderGachaCustomFieldsDetailsHtml } from './features/gacha/render-gacha-custom-fields-details-html';
import { createNormalizeCheckSuggestionParams } from './features/checks/normalize-check-suggestion-params';
import { createGetDiceConfigBackupModuleWarnings } from './features/dice/get-dice-config-backup-module-warnings';
import { createCreateDashboardPresetModulesFromConfig } from './features/dashboard/create-dashboard-preset-modules-from-config';
import { createConvertTavernRegexToRule } from './shared/convert-tavern-regex-to-rule';
import { createUpsertAcuDiceGachaPool } from './features/gacha/upsert-acu-dice-gacha-pool';
import { createRunDatabaseManualUpdateViaApi } from './features/table/run-database-manual-update-via-api';
import { createRenderGachaCustomFieldsPreviewHtml } from './features/gacha/render-gacha-custom-fields-preview-html';
import { createDefaultRenderPresetRules } from './features/presets/default-render-preset-rules';
import { createValidateAdvancedPresetFieldConfig } from './features/presets/validate-advanced-preset-field-config';
import { createRenderGachaFortuneProgressHtml } from './features/gacha/render-gacha-fortune-progress-html';
import { createRenderDiceConfigBackupRestoreBody } from './features/dice/render-dice-config-backup-restore-body';
import { createPickTextFile } from './shared/pick-text-file';
import { createNormalizeAdvancedPresetAgentTests } from './features/presets/normalize-advanced-preset-agent-tests';
import { createMigrateGachaCatalogRecordsToGlobalScope } from './features/gacha/migrate-gacha-catalog-records-to-global-scope';
import { createHydrateCustomTableNameIconsIn } from './features/table/hydrate-custom-table-name-icons-in';
import { createGetGachaChatMessageText } from './features/gacha/get-gacha-chat-message-text';
import { createClearGachaFortune } from './features/gacha/clear-gacha-fortune';
import { createBuildAutoCheckSuggestionGuide } from './features/presets/build-auto-check-suggestion-guide';
import { createDefaultQuickCheckExcludeKeywords } from './features/checks/default-quick-check-exclude-keywords';
import { createValidateAdvancedPresetDicePatches } from './features/presets/validate-advanced-preset-dice-patches';
import { createValidateAdvancedPreset } from './features/presets/validate-advanced-preset';
import { createShowEditDialog } from './features/ui/show-edit-dialog';
import { createPatchCrudSheetCellInMessage } from './features/table/patch-crud-sheet-cell-in-message';
import { createParseRelationshipString } from './features/table/parse-relationship-string';
import { createGetFixedModeAnchorRect } from './features/ui/get-fixed-mode-anchor-rect';
import { createCollectDashboardNpcEntriesFromRelationshipSources } from './features/dashboard/collect-dashboard-npc-entries-from-relationship-sources';
import { createBuildGlobalInteractionGroups } from './features/interactions/build-global-interaction-groups';
import { createGetGMConfig } from './features/actions/get-gm-config';
import { createBuildCustomTableNameIconPackEntry } from './features/table/build-custom-table-name-icon-pack-entry';
import { createAnalyzeGachaCatalogImport } from './features/gacha/analyze-gacha-catalog-import';
import { createSyncInventoryMetadataForRawData } from './features/table/sync-inventory-metadata-for-raw-data';
import { createSanitizeRuntimeTableData } from './features/table/sanitize-runtime-table-data';
import { createRenderDiceProfileSummaryRow } from './features/dice/render-dice-profile-summary-row';
import { createApplyJsonCellFallbackForCrud } from './features/table/apply-json-cell-fallback-for-crud';
import { createStripJsoncSyntax } from './shared/strip-jsonc-syntax';
import { createResolveUserGraphName } from './features/avatars/resolve-user-graph-name';
import { createGetCustomTableNameIconFallbackContexts } from './features/table/get-custom-table-name-icon-fallback-contexts';
import { createCopyTextWithTavernApi } from './shared/copy-text-with-tavern-api';
import { createBuildNewActionPresetRulesJsoncTemplate } from './features/presets/build-new-action-preset-rules-jsonc-template';
import { createValidateAdvancedPresetCustomFields } from './features/presets/validate-advanced-preset-custom-fields';
import { createReplaceRuleTagInTemplate } from './features/presets/replace-rule-tag-in-template';
import { createGenerateAttributeScale } from './features/presets/generate-attribute-scale';
import { createSwitchPanel } from './features/ui/switch-panel';
import { createRenderDiceConfigBackupModuleRows } from './features/dice/render-dice-config-backup-module-rows';
import { createGetDiceQuickSelectCharacterList } from './features/dice/get-dice-quick-select-character-list';
import { createValidateGachaCustomFieldsForTargetTable } from './features/gacha/validate-gacha-custom-fields-for-target-table';
import { createUpdateGachaFortuneProgressDom } from './features/gacha/update-gacha-fortune-progress-dom';
import { createStartTutorialFromButton } from './features/tutorial/start-tutorial-from-button';
import { createShowDiceCharacterProfilePrompt } from './features/dice/show-dice-character-profile-prompt';
import { createValidateGachaCatalogImportItemTarget } from './features/gacha/validate-gacha-catalog-import-item-target';
import { createRenderGachaSettingsFilterMenuHtml } from './features/gacha/render-gacha-settings-filter-menu-html';
import { createGetCharacterNameCandidates } from './features/avatars/get-character-name-candidates';
import { createApplyRuntimeDataViaCrud } from './features/table/apply-runtime-data-via-crud';
import { createApplyDiceConfigBackupActiveValue } from './features/dice/apply-dice-config-backup-active-value';
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
  const getSheetKeyByTableName = createGetSheetKeyByTableName({
    getTableData: (...a: any[]) => getTableData(...a),
  });

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

  const parseImageUrl = createParseImageUrl({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

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

  const formatCssImageUrl = createFormatCssImageUrl({
    escapeCssString: (...a: any[]) => escapeCssString(...a),
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

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

  const stripLoneSurrogates = createStripLoneSurrogates({

  });

  const safeEncodeURIComponent = createSafeEncodeURIComponent({
    stripLoneSurrogates: (...a: any[]) => stripLoneSurrogates(...a),
  });

  const safeDecodeURIComponent = createSafeDecodeURIComponent({
    stripLoneSurrogates: (...a: any[]) => stripLoneSurrogates(...a),
  });

  /**
   * 设置弹窗点击遮罩关闭的事件监听
   * - PC端：需要 mousedown 和 mouseup 都在遮罩上才关闭（防止选择文本时误关闭）
   * - Mobile端：保持原有行为，触摸点击遮罩即关闭
   * @param $overlay jQuery对象，弹窗遮罩层
   * @param overlayClass 遮罩层的类名（用于判断点击目标）
   * @param onClose 关闭时的回调函数
   */
  const setupOverlayClose = createSetupOverlayClose({

  });

  // [新增] 生成唯一名称（用于预设导入时处理重名）
  const generateUniqueName = createGenerateUniqueName({

  });

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

  const readStoredTextareaDiceText = createReadStoredTextareaDiceText({
    getCore: (...a: any[]) => getCore(...a),
  });

  const readStoredLatestDiceText = createReadStoredLatestDiceText({
    getCore: (...a: any[]) => getCore(...a),
  });

  const composeTextareaTextWithHiddenDice = createComposeTextareaTextWithHiddenDice({
    createDiceResultPlaceholderRegex: (...a: any[]) => createDiceResultPlaceholderRegex(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

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

  const storeTextareaDiceCache = createStoreTextareaDiceCache({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

  const syncTextareaDiceCacheFromVisibleText = createSyncTextareaDiceCacheFromVisibleText({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    extractMetaCheckResultBlocks: (...a: any[]) => extractMetaCheckResultBlocks(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    storeTextareaDiceCache: (...a: any[]) => storeTextareaDiceCache(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

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

  const capturePendingHumanInputSnapshot = createCapturePendingHumanInputSnapshot({
    markHumanInputActivity: (...a: any[]) => markHumanInputActivity(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    getHumanInputSendQueue: () => humanInputSendQueue,
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
    setLastHumanInputSnapshot: (v: any) => { lastHumanInputSnapshot = v; },
    getLastCapturedHumanInputSnapshot: () => lastCapturedHumanInputSnapshot,
    setLastCapturedHumanInputSnapshot: (v: any) => { lastCapturedHumanInputSnapshot = v; },
    getLastHumanInputCaptureAt: () => lastHumanInputCaptureAt,
    setLastHumanInputCaptureAt: (v: any) => { lastHumanInputCaptureAt = v; },
  });

  const consumePendingHumanInputSnapshot = (): string => {
    if (humanInputSendQueue.length > 0) {
      return String(humanInputSendQueue.shift() || '');
    }
    return String(lastHumanInputSnapshot || '');
  };

  const bindHumanInputTracking = createBindHumanInputTracking({
    getCore: (...a: any[]) => getCore(...a),
    markHumanInputActivity: (...a: any[]) => markHumanInputActivity(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
    setLastHumanInputSnapshot: (v: any) => { lastHumanInputSnapshot = v; },
  });

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

  const getRuntimeWindowCandidates = createGetRuntimeWindowCandidates({
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

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

  const findSillyTavernSlashRunner = createFindSillyTavernSlashRunner({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

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

  const findComposerSendButton = createFindComposerSendButton({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const sendTextViaComposer = createSendTextViaComposer({
    findComposerSendButton: (...a: any[]) => findComposerSendButton(...a),
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
  });

  const sendChatTextAndTrigger = createSendChatTextAndTrigger({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
    quoteSlashArgument: (...a: any[]) => quoteSlashArgument(...a),
    sendTextViaComposer: (...a: any[]) => sendTextViaComposer(...a),
    triggerGenerationAfterDirectSend: (...a: any[]) => triggerGenerationAfterDirectSend(...a),
  });

  // [新增] 在发送消息前恢复真实结果
  const restoreDiceResultBeforeSend = createRestoreDiceResultBeforeSend({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    resolveTextareaTextWithHiddenDice: (...a: any[]) => resolveTextareaTextWithHiddenDice(...a),
    DICE_RESULT_PLACEHOLDER: DICE_RESULT_PLACEHOLDER,
  });

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
  const compareVersion = createCompareVersion({

  });




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
  const convertTavernRegexToRule = createConvertTavernRegexToRule({

  });

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

  const DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = createDefaultQuickCheckExcludeKeywords({

  });
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

  const normalizeRenderPresetTagFilterList = createNormalizeRenderPresetTagFilterList({

  });

  const normalizeRenderPresetAliasMap = createNormalizeRenderPresetAliasMap({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
  });

  const cloneRenderPresetRules = createCloneRenderPresetRules({

  });

  const DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST = createDefaultDialogueIndentTagBlacklist({

  });

  const DEFAULT_RENDER_PRESET_RULES = createDefaultRenderPresetRules({
    DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST: DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
    DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const normalizeRenderPresetRules = createNormalizeRenderPresetRules({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    normalizeRenderPresetAliasMap: (...a: any[]) => normalizeRenderPresetAliasMap(...a),
    normalizeRenderPresetStringList: (...a: any[]) => normalizeRenderPresetStringList(...a),
    normalizeRenderPresetTagFilterList: (...a: any[]) => normalizeRenderPresetTagFilterList(...a),
    DEFAULT_RENDER_PRESET_RULES: DEFAULT_RENDER_PRESET_RULES,
  });

  const createBuiltinRenderPreset = createCreateBuiltinRenderPreset({
    cloneRenderPresetRules: (...a: any[]) => cloneRenderPresetRules(...a),
    getDEFAULT_RENDER_PRESET_RULES: () => DEFAULT_RENDER_PRESET_RULES,
    getRENDER_DEFAULT_PRESET_ID: () => RENDER_DEFAULT_PRESET_ID,
    getRENDER_PRESET_FORMAT: () => RENDER_PRESET_FORMAT,
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
  const getUserAvatarUrl = createGetUserAvatarUrl({

  });

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
  const getPersonaName = createGetPersonaName({

  });

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = () => {
    return getPersonaName() || getPlayerName() || '主角';
  };

  // [新增] 替换文本中的用户占位符为 Persona 名称（仅用于显示）
  const replaceUserPlaceholders = createReplaceUserPlaceholders({
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
  });

  const USER_AVATAR_LOOKUP_KEYS = ['{{user}}', '<user>'] as const;

  const getAvatarLookupNames = createGetAvatarLookupNames({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    USER_AVATAR_LOOKUP_KEYS: USER_AVATAR_LOOKUP_KEYS,
  });

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

  const renderDiceHistoryStatsHtml = createRenderDiceHistoryStatsHtml({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
    isDiceStatsScopeUnavailable: (...a: any[]) => isDiceStatsScopeUnavailable(...a),
    DICE_STATS_SCOPE_LABELS: DICE_STATS_SCOPE_LABELS,
  });

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

  const rgbToAvatarHex = createRgbToAvatarHex({

  });

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

  const hslToAvatarHex = createHslToAvatarHex({
    rgbToAvatarHex: (...a: any[]) => rgbToAvatarHex(...a),
  });

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

  const loadAvatarImageForColor = createLoadAvatarImageForColor({

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

  const getCharacterNameCandidates = createGetCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    NameAliasRegistry: NameAliasRegistry,
  });

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

  const isUserCharacterName = createIsUserCharacterName({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getUserCharacterNameCandidates: (...a: any[]) => getUserCharacterNameCandidates(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

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

  const isNpcLikeTableName = createIsNpcLikeTableName({

  });

  const findAttributeColumnIndices = createFindAttributeColumnIndices({

  });

  const pickFallbackAttributeColumn = createPickFallbackAttributeColumn({

  });

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

  const resolveUserGraphName = createResolveUserGraphName({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    isUserPlaceholderKey: (...a: any[]) => isUserPlaceholderKey(...a),
    AvatarManager: AvatarManager,
    NameAliasRegistry: NameAliasRegistry,
    USER_NODE_KEY: USER_NODE_KEY,
    USER_PLACEHOLDER_KEYS: USER_PLACEHOLDER_KEYS,
  });

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

  const getLocationEmoji = createGetLocationEmoji({

  });

  // 获取地点名的所有候选emoji（用于去重分配）
  const getEmojiCandidates = createGetEmojiCandidates({

  });

  // 批量分配emoji，实现去重（最短名称优先）
  const resolveBatchLocationEmojis = createResolveBatchLocationEmojis({
    getEmojiCandidates: (...a: any[]) => getEmojiCandidates(...a),
  });

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

  const renderThemeIconContent = createRenderThemeIconContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const createCustomTableNameIconContext = createCreateCustomTableNameIconContext({

  });

  const createGlobalInteractionCustomTableNameIconContext = createCreateGlobalInteractionCustomTableNameIconContext({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    resolveDashboardCustomTableNameIconContextInfo: (...a: any[]) => resolveDashboardCustomTableNameIconContextInfo(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

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

  const renderCustomTableNameIconContent = createRenderCustomTableNameIconContent({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    renderAsyncImageIconSlotContent: (...a: any[]) => renderAsyncImageIconSlotContent(...a),
    resolveCustomTableNameIcon: (...a: any[]) => resolveCustomTableNameIcon(...a),
  });

  const getGachaItemCustomTableNameIconContext = createGetGachaItemCustomTableNameIconContext({
    createCustomTableNameIconContext: (...a: any[]) => createCustomTableNameIconContext(...a),
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    getCachedRawData: () => cachedRawData,
  });

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

  const hydrateCustomTableNameIconsIn = createHydrateCustomTableNameIconsIn({
    applyAsyncImageUrlToElement: (...a: any[]) => applyAsyncImageUrlToElement(...a),
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

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
  const saveDiceConfig = createSaveDiceConfig({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
  });

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

  const normalizeAttributeQuickSelectConfig = createNormalizeAttributeQuickSelectConfig({
    cloneQuickSelectNameMapping: (...a: any[]) => cloneQuickSelectNameMapping(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
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

  const extractAdvancedPresetJsonCandidates = createExtractAdvancedPresetJsonCandidates({

  });

  const parseAdvancedPresetSourceText = createParseAdvancedPresetSourceText({
    extractAdvancedPresetJsonCandidates: (...a: any[]) => extractAdvancedPresetJsonCandidates(...a),
    parseAdvancedPresetJsonCandidate: (...a: any[]) => parseAdvancedPresetJsonCandidate(...a),
  });

  const normalizeAdvancedPresetNotes = (rawNotes: unknown): string[] => {
    if (typeof rawNotes === 'string' && rawNotes.trim()) return [rawNotes.trim()];
    if (!Array.isArray(rawNotes)) return [];
    return rawNotes.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const normalizeAdvancedPresetAgentTests = createNormalizeAdvancedPresetAgentTests({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
  });

  const unwrapAdvancedPresetDocument = createUnwrapAdvancedPresetDocument({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    normalizeAdvancedPresetNotes: (...a: any[]) => normalizeAdvancedPresetNotes(...a),
    normalizeAdvancedPresetAgentTests: (...a: any[]) => normalizeAdvancedPresetAgentTests(...a),
    getADVANCED_PRESET_AGENT_FORMAT: () => ADVANCED_PRESET_AGENT_FORMAT,
    getADVANCED_PRESET_EXPORT_FORMAT: () => ADVANCED_PRESET_EXPORT_FORMAT,
  });

  const cloneAdvancedPresetFieldWithDefaults = createCloneAdvancedPresetFieldWithDefaults({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
  });

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

  const validateAdvancedPresetFieldConfig = createValidateAdvancedPresetFieldConfig({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetCustomFields = createValidateAdvancedPresetCustomFields({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetDicePatches = createValidateAdvancedPresetDicePatches({
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetContestRule = createValidateAdvancedPresetContestRule({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const coerceAdvancedPresetContextNumber = createCoerceAdvancedPresetContextNumber({

  });

  const createAdvancedPresetRollResult = createCreateAdvancedPresetRollResult({

  });

  const readAdvancedPresetContextTags = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const assignAdvancedPresetContextNumber = createAssignAdvancedPresetContextNumber({
    coerceAdvancedPresetContextNumber: (...a: any[]) => coerceAdvancedPresetContextNumber(...a),
  });

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

  const applyAdvancedPresetOutcomePolicy = createApplyAdvancedPresetOutcomePolicy({
    readAdvancedPresetPolicyNumber: (...a: any[]) => readAdvancedPresetPolicyNumber(...a),
  });

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

  const validateAdvancedPresetTemplates = createValidateAdvancedPresetTemplates({
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const validateAdvancedPresetAgentTests = createValidateAdvancedPresetAgentTests({
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const throwAdvancedPresetValidationIssues = createThrowAdvancedPresetValidationIssues({

  });

  const validateAdvancedPreset = createValidateAdvancedPreset({
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
    throwAdvancedPresetValidationIssues: (...a: any[]) => throwAdvancedPresetValidationIssues(...a),
    validateAdvancedPresetAgentTests: (...a: any[]) => validateAdvancedPresetAgentTests(...a),
    validateAdvancedPresetContestRule: (...a: any[]) => validateAdvancedPresetContestRule(...a),
    validateAdvancedPresetCustomFields: (...a: any[]) => validateAdvancedPresetCustomFields(...a),
    validateAdvancedPresetDicePatches: (...a: any[]) => validateAdvancedPresetDicePatches(...a),
    validateAdvancedPresetFieldConfig: (...a: any[]) => validateAdvancedPresetFieldConfig(...a),
    validateAdvancedPresetOutcomePolicy: (...a: any[]) => validateAdvancedPresetOutcomePolicy(...a),
    validateAdvancedPresetOutcomes: (...a: any[]) => validateAdvancedPresetOutcomes(...a),
    validateAdvancedPresetTemplates: (...a: any[]) => validateAdvancedPresetTemplates(...a),
  });

  const parseAdvancedPresetText = createParseAdvancedPresetText({
    normalizeAdvancedPresetData: (...a: any[]) => normalizeAdvancedPresetData(...a),
    parseAdvancedPresetSourceText: (...a: any[]) => parseAdvancedPresetSourceText(...a),
    unwrapAdvancedPresetDocument: (...a: any[]) => unwrapAdvancedPresetDocument(...a),
    validateAdvancedPreset: (...a: any[]) => validateAdvancedPreset(...a),
    ADVANCED_PRESET_AGENT_FORMAT: ADVANCED_PRESET_AGENT_FORMAT,
  });

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
  const generateAttributeScale = createGenerateAttributeScale({

  });

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

  const buildAutoCheckSuggestionGuide = createBuildAutoCheckSuggestionGuide({
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });

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

  const getAttributeRulePresetById = createGetAttributeRulePresetById({
    getAttributePresetManager: () => AttributePresetManager,
  });

  const getAttributeRangeBounds = createGetAttributeRangeBounds({

  });

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

  const replaceRuleTagInTemplate = createReplaceRuleTagInTemplate({
    getRuleTagSnippet: (...a: any[]) => getRuleTagSnippet(...a),
    isRuleTemplateSheetWithNote: (...a: any[]) => isRuleTemplateSheetWithNote(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
  });

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

  const syncCheckRuleTagsInTemplate = createSyncCheckRuleTagsInTemplate({
    buildCheckSuggestionGuide: (...a: any[]) => buildCheckSuggestionGuide(...a),
    getCheckSuggestionPresetById: (...a: any[]) => getCheckSuggestionPresetById(...a),
    replaceRuleTagInTemplate: (...a: any[]) => replaceRuleTagInTemplate(...a),
  });

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
  const selectCrazyRollType = createSelectCrazyRollType({

  });

  // 根据权重随机选择
  const weightedRandomSelect = createWeightedRandomSelect({

  });

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
  const selectCrazyAttribute = createSelectCrazyAttribute({
    getRandomSkillPool: (...a: any[]) => getRandomSkillPool(...a),
    AttributePresetManager: AttributePresetManager,
  });

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
  const evaluateOutcomes = createEvaluateOutcomes({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

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
  const formatOutputTemplate = createFormatOutputTemplate({

  });

  /**
   * 生成单个属性值，应用范围限制
   * @param formula 公式字符串
   * @param range 可选范围 [min, max]
   * @param context 变量上下文
   * @returns 属性值
   */
  const generateAttributeValue = createGenerateAttributeValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

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

  const cloneDashboardConfig = createCloneDashboardConfig({

  });

  const createDashboardPresetModulesFromConfig = createCreateDashboardPresetModulesFromConfig({
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_PRESET_MODULE_KEYS: DASHBOARD_PRESET_MODULE_KEYS,
  });

  const cloneDashboardPresetModules = createCloneDashboardPresetModules({

  });

  const createBuiltinDashboardPreset = createCreateBuiltinDashboardPreset({
    createDashboardPresetModulesFromConfig: (...a: any[]) => createDashboardPresetModulesFromConfig(...a),
    getDASHBOARD_DEFAULT_PRESET_ID: () => DASHBOARD_DEFAULT_PRESET_ID,
    getDASHBOARD_PRESET_FORMAT: () => DASHBOARD_PRESET_FORMAT,
  });

  const isRecordValue = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const normalizeDashboardKeywordArray = createNormalizeDashboardKeywordArray({

  });

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

  const stripJsoncSyntax = createStripJsoncSyntax({
    stripJsonComments: (...a: any[]) => stripJsonComments(...a),
  });

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

  const pickTextFile = createPickTextFile({
    readTextFile: (...a: any[]) => readTextFile(...a),
    JSONC_FILE_ACCEPT: JSONC_FILE_ACCEPT,
  });

  const validateJsoncEditorConfig = createValidateJsoncEditorConfig({
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
  });

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
  const getGMConfig = createGetGMConfig({
    ActionPresetManager: ActionPresetManager,
  });

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
  const getActionsForTable = createGetActionsForTable({
    getGMConfig: (...a: any[]) => getGMConfig(...a),
  });

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

  const GLOBAL_INTERACTION_NAME_HEADERS = createGlobalInteractionNameHeaders({

  });
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
  const GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS = createGlobalInteractionNonNameHeaderKeywords({

  });
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

  const isPureIndexCell = createIsPureIndexCell({
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    getGLOBAL_INTERACTION_INDEX_HEADERS: () => GLOBAL_INTERACTION_INDEX_HEADERS,
  });

  const normalizeGlobalInteractionHeader = (header: unknown): string =>
    String(header ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  const isLikelyGlobalInteractionNameHeader = createIsLikelyGlobalInteractionNameHeader({
    normalizeGlobalInteractionHeader: (...a: any[]) => normalizeGlobalInteractionHeader(...a),
    getGLOBAL_INTERACTION_NAME_HEADERS: () => GLOBAL_INTERACTION_NAME_HEADERS,
    getGLOBAL_INTERACTION_NAME_HEADER_KEYWORDS: () => GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS,
    getGLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS: () => GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS,
  });

  const resolveGlobalInteractionRowTitle = createResolveGlobalInteractionRowTitle({
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    isLikelyGlobalInteractionNameHeader: (...a: any[]) => isLikelyGlobalInteractionNameHeader(...a),
    isPureIndexCell: (...a: any[]) => isPureIndexCell(...a),
    normalizeGlobalInteractionHeader: (...a: any[]) => normalizeGlobalInteractionHeader(...a),
    GLOBAL_INTERACTION_NAME_HEADERS: GLOBAL_INTERACTION_NAME_HEADERS,
  });

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

  const getMatchedGlobalInteractionRuleKeywords = createGetMatchedGlobalInteractionRuleKeywords({
    getGlobalInteractionActionRuleGroups: (...a: any[]) => getGlobalInteractionActionRuleGroups(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

  const resolveGlobalInteractionSectionMeta = createResolveGlobalInteractionSectionMeta({
    getMatchedGlobalInteractionRuleKeywords: (...a: any[]) => getMatchedGlobalInteractionRuleKeywords(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
    resolveDashboardGlobalInteractionSectionKind: (...a: any[]) => resolveDashboardGlobalInteractionSectionKind(...a),
    GLOBAL_INTERACTION_DEFAULT_SECTION_META: GLOBAL_INTERACTION_DEFAULT_SECTION_META,
  });

  const createGlobalInteractionSections = createCreateGlobalInteractionSections({
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

  const buildGlobalInteractionGroups = createBuildGlobalInteractionGroups({
    buildGlobalInteractionSearchText: (...a: any[]) => buildGlobalInteractionSearchText(...a),
    dedupeInteractionActions: (...a: any[]) => dedupeInteractionActions(...a),
    getInteractOptionsForRow: (...a: any[]) => getInteractOptionsForRow(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
    resolveCustomTableNameIconRowName: (...a: any[]) => resolveCustomTableNameIconRowName(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
  });

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

  const isNumericCell = createIsNumericCell({

  });

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

  const parseAttributeString = createParseAttributeString({

  });
  // 解析人际关系字符串，推荐使用冒号格式，同时兼容旧式括号格式:
  // 推荐格式: "人名:关系描述;人名:关系描述" 或 "与人名:关系描述;与人名:关系描述"
  // 兼容格式: "人名(关系标签);人名(关系)"
  const parseRelationshipString = createParseRelationshipString({

  });

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

  const processTemplate = createProcessTemplate({

  });

  // 固定显示的功能按钮
  // 注意：保存按钮已移除，系统现在使用即时保存模式（每次编辑/删除后自动保存）
  const ACTION_BUTTONS = createActionButtons({

  });
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
  const pushModal = createPushModal({
    getModalStack: () => modalStack,
  });

  /**
   * 从栈中弹出当前弹窗并返回上一个弹窗
   * @returns 是否成功返回上一个弹窗
   */
  const popModal = createPopModal({
    getModalStack: () => modalStack,
  });

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
  const getCurrentContextFingerprint = createGetCurrentContextFingerprint({

  });

  // 全局状态追踪 (已清理死代码)


  const COLLAPSE_STYLES = ['bar', 'pill', 'floating'] as const;
  type CollapseStyle = (typeof COLLAPSE_STYLES)[number];

  const normalizeCollapseStyle = (value: unknown): CollapseStyle => {
    const style = String(value || '').trim();
    if (style === 'mini') return 'floating';
    return COLLAPSE_STYLES.includes(style as CollapseStyle) ? (style as CollapseStyle) : 'bar';
  };

  const getNavigationFontMetrics = createGetNavigationFontMetrics({

  });

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
  const THEMES = createThemes({

  });

  // [优化] 缓存 core 对象 (修复竞态条件 + 增强 ST 穿透查找)
  let _coreCache = null;

  const getAccessibleDocument = createGetAccessibleDocument({

  });

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

  const collectHostAndLocalNodes = createCollectHostAndLocalNodes({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const getCore = createGetCore({
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    get_coreCache: () => _coreCache,
    set_coreCache: (v: any) => { _coreCache = v; },
  });

  const ACU_DATABASE_NEW_UI_MENU_SELECTOR = '#acu-v2-menu-item';
  const ACU_DATABASE_NEW_UI_API_METHODS = createAcuDatabaseNewUiApiMethods({

  });
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

  const openLegacyDatabaseSettings = createOpenLegacyDatabaseSettings({
    getCore: (...a: any[]) => getCore(...a),
  });

  const openDatabaseInterface = createOpenDatabaseInterface({
    openDatabaseNewUiViaApi: (...a: any[]) => openDatabaseNewUiViaApi(...a),
    openDatabaseNewUiViaMenuEntry: (...a: any[]) => openDatabaseNewUiViaMenuEntry(...a),
    openLegacyDatabaseSettings: (...a: any[]) => openLegacyDatabaseSettings(...a),
  });

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

  const openLegacyDatabaseVisualizer = createOpenLegacyDatabaseVisualizer({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
  });

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

  const isDatabaseManualUpdateActionButton = createIsDatabaseManualUpdateActionButton({
    isDatabaseManualUpdateButtonText: (...a: any[]) => isDatabaseManualUpdateButtonText(...a),
    normalizeDatabaseUiText: (...a: any[]) => normalizeDatabaseUiText(...a),
    getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR,
  });

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

  const waitForDatabaseNewUiManualUpdateButton = createWaitForDatabaseNewUiManualUpdateButton({
    findDatabaseNewUiManualUpdateButton: (...a: any[]) => findDatabaseNewUiManualUpdateButton(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

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

  const waitForDatabaseManualUpdateSurface = createWaitForDatabaseManualUpdateSurface({
    hasDatabaseManualUpdateSurface: (...a: any[]) => hasDatabaseManualUpdateSurface(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

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

  const openDatabaseFormFillPage = createOpenDatabaseFormFillPage({
    clickDatabaseNewUiFormFillNavigation: (...a: any[]) => clickDatabaseNewUiFormFillNavigation(...a),
    hasDatabaseNewUiRuntime: (...a: any[]) => hasDatabaseNewUiRuntime(...a),
    openDatabaseNewUiViaApi: (...a: any[]) => openDatabaseNewUiViaApi(...a),
    openDatabaseNewUiViaMenuEntry: (...a: any[]) => openDatabaseNewUiViaMenuEntry(...a),
    waitForDatabaseManualUpdateSurface: (...a: any[]) => waitForDatabaseManualUpdateSurface(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

  const runDatabaseManualUpdateViaNewUiButton = createRunDatabaseManualUpdateViaNewUiButton({
    openDatabaseFormFillPage: (...a: any[]) => openDatabaseFormFillPage(...a),
    waitForDatabaseNewUiManualUpdateButton: (...a: any[]) => waitForDatabaseNewUiManualUpdateButton(...a),
  });

  const runMaybeAsyncDatabaseManualUpdate = createRunMaybeAsyncDatabaseManualUpdate({

  });

  const runDatabaseManualUpdateViaApi = createRunDatabaseManualUpdateViaApi({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseManualUpdate: (...a: any[]) => runMaybeAsyncDatabaseManualUpdate(...a),
    ACU_DATABASE_MANUAL_UPDATE_API_METHODS: ACU_DATABASE_MANUAL_UPDATE_API_METHODS,
  });

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

  const runDatabaseManualUpdate = createRunDatabaseManualUpdate({
    hasDatabaseNewUiRuntime: (...a: any[]) => hasDatabaseNewUiRuntime(...a),
    runDatabaseManualUpdateViaApi: (...a: any[]) => runDatabaseManualUpdateViaApi(...a),
    runDatabaseManualUpdateViaLegacyButton: (...a: any[]) => runDatabaseManualUpdateViaLegacyButton(...a),
    runDatabaseManualUpdateViaNewUiButton: (...a: any[]) => runDatabaseManualUpdateViaNewUiButton(...a),
  });

  const getDatabaseManualUpdateErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error.trim()) return error;
    return fallback;
  };

  const showDatabaseManualUpdateFailure = createShowDatabaseManualUpdateFailure({
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
  });

  const updateSaveButtonState = createUpdateSaveButtonState({
    getCore: (...a: any[]) => getCore(...a),
    getPendingDeletions: (...a: any[]) => getPendingDeletions(...a),
    hasUnsavedChanges: (...a: any[]) => hasUnsavedChanges(...a),
  });

  const getIconForTableName = createGetIconForTableName({

  });

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

  const DASHBOARD_MODULE_SECTION_KIND = createDashboardModuleSectionKind({

  });

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

  const resolveDashboardCustomTableNameIconContextInfo = createResolveDashboardCustomTableNameIconContextInfo({
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getCUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS: () => CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS,
  });

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
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS = createCustomTableNameIconAllowedPanelSections({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_MODULES = createCustomTableNameIconDeniedModules({

  });
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

  const normalizeCustomTableNameIconEntry = createNormalizeCustomTableNameIconEntry({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
  });

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


  const isCustomTableNameIconContextAllowed = createIsCustomTableNameIconContextAllowed({
    isCustomTableNameIconTableDenied: (...a: any[]) => isCustomTableNameIconTableDenied(...a),
    CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS: CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS,
    CUSTOM_TABLE_NAME_ICON_DENIED_MODULES: CUSTOM_TABLE_NAME_ICON_DENIED_MODULES,
    CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS: CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS,
  });

  const getCustomTableNameIconFallbackContexts = createGetCustomTableNameIconFallbackContexts({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
  });

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

  const resolveCustomTableNameIconAssetUrl = createResolveCustomTableNameIconAssetUrl({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    resolveCustomTableNameIcon: (...a: any[]) => resolveCustomTableNameIcon(...a),
  });

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

  const CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION = createCustomTableNameIconManagerDirectModuleBySection({

  });

  const getCustomTableNameIconManagerModuleLabel = (moduleId: CustomTableNameIconModuleId): string =>
    CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS[moduleId] || moduleId;

  const getCustomTableNameIconManagerSectionLabel = (section: CustomTableNameIconSection): string =>
    CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS[section] || section;

  const getCustomTableNameIconManagerSourceLabel = (source: CustomTableNameIconManagerCandidateSource): string => {
    if (source === 'direct') return '表格条目';
    if (source === 'interaction') return '交互条目';
    return '已保存映射';
  };

  const getCustomTableNameIconManagerContextLabel = createGetCustomTableNameIconManagerContextLabel({
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerSectionLabel: (...a: any[]) => getCustomTableNameIconManagerSectionLabel(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

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

  const resolveCustomTableNameIconManagerDirectSection = createResolveCustomTableNameIconManagerDirectSection({
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
    resolveGlobalInteractionSectionMeta: (...a: any[]) => resolveGlobalInteractionSectionMeta(...a),
  });

  const createCustomTableNameIconManagerCandidate = createCreateCustomTableNameIconManagerCandidate({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerSectionLabel: (...a: any[]) => getCustomTableNameIconManagerSectionLabel(...a),
    getCustomTableNameIconManagerSourceLabel: (...a: any[]) => getCustomTableNameIconManagerSourceLabel(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
  });

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

  const getCustomTableNameIconManagerInvalidSourceText = createGetCustomTableNameIconManagerInvalidSourceText({

  });

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

  const normalizeCustomTableNameIconPackEntryMetadata = createNormalizeCustomTableNameIconPackEntryMetadata({

  });

  const normalizeCustomTableNameIconPackEntry = createNormalizeCustomTableNameIconPackEntry({
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
    normalizeCustomTableNameIconPackEntryMetadata: (...a: any[]) => normalizeCustomTableNameIconPackEntryMetadata(...a),
  });

  const buildCustomTableNameIconPackEntry = createBuildCustomTableNameIconPackEntry({
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

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

  const getOptionItemsFromTable = createGetOptionItemsFromTable({

  });

  const renderOptionButtonHtml = (text: string): string =>
    `<button class="acu-opt-btn" data-val="${safeEncodeURIComponent(text)}">${escapeHtml(text)}</button>`;

  const renderCheckSuggestionOptionButtonHtml = (displayText: string, commandText: string): string =>
    `<button class="acu-check-suggestion-btn" data-display="${safeEncodeURIComponent(displayText)}" data-command="${safeEncodeURIComponent(commandText)}">${escapeHtml(displayText || '未填写展示文本')}</button>`;

  const getCheckSuggestionItemsFromTable = createGetCheckSuggestionItemsFromTable({

  });

  const getBadgeStyle = createGetBadgeStyle({

  });

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

  const getRenderPresetBadgeStyle = createGetRenderPresetBadgeStyle({

  });

  const parseRenderPresetAttributes = createParseRenderPresetAttributes({
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
  });

  const renderInlineQuickCheckButton = createRenderInlineQuickCheckButton({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    RenderPresetManager: RenderPresetManager,
  });

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
  const clearAllPanelStates = createClearAllPanelStates({
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
  });

  // [修复] MVU 面板异步回调防竞态：只有当前仍处于 MVU 标签且无更高优先级面板激活时才允许写入
  const canWriteMvuPanel = createCanWriteMvuPanel({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getMvuModule: () => MvuModule,
  });

  const getSavedTableOrder = () => Store.get(STORAGE_KEY_TABLE_ORDER);
  const saveTableOrder = v => Store.set(STORAGE_KEY_TABLE_ORDER, v);
  const getCollapsedState = () => Store.get(STORAGE_KEY_IS_COLLAPSED, false);
  const saveCollapsedState = v => Store.set(STORAGE_KEY_IS_COLLAPSED, v);
  // [新增] 选项面板独立折叠状态管理
  const getOptionsCollapsedState = () => Store.get(STORAGE_KEY_OPTIONS_COLLAPSED, false);
  const saveOptionsCollapsedState = v => Store.set(STORAGE_KEY_OPTIONS_COLLAPSED, v);
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = createLoadSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = createSaveSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

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

  const applyStoredPanelHeight = createApplyStoredPanelHeight({
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
    getStoredPanelHeight: (...a: any[]) => getStoredPanelHeight(...a),
    setPanelRequestedHeight: (...a: any[]) => setPanelRequestedHeight(...a),
  });

  const getPanelDragStartHeight = createGetPanelDragStartHeight({
    clampPanelHeightToDisplay: (...a: any[]) => clampPanelHeightToDisplay(...a),
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const savePanelRequestedHeight = createSavePanelRequestedHeight({
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    normalizePanelHeightValue: (...a: any[]) => normalizePanelHeightValue(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
  });

  const resetPanelRequestedHeight = createResetPanelRequestedHeight({
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    saveTableHeights: (...a: any[]) => saveTableHeights(...a),
  });

  const getActivePanelHeightKey = createGetActivePanelHeightKey({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
  });

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

  const setAllTablesReverse = createSetAllTablesReverse({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
    saveReverseTables: (...a: any[]) => saveReverseTables(...a),
  });

  // 切换表格倒序状态
  const toggleTableReverse = createToggleTableReverse({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    saveReverseTables: (...a: any[]) => saveReverseTables(...a),
  });
  // [新增] 根据角色名获取属性列表
  const getAttributesForCharacter = characterName => {
    return getFullAttributesForCharacter(characterName).map(attr => attr.name);
  };
  const normalizeAttributeName = createNormalizeAttributeName({

  });

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

  const getAttributeEntryForCharacter = createGetAttributeEntryForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
  });

  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = (characterName, attrName, aliasCandidates: string[] = []) => {
    const found = getAttributeEntryForCharacter(characterName, attrName, aliasCandidates);
    return found ? found.value : null;
  };

  const pushDiceQuickSelectCharacter = createPushDiceQuickSelectCharacter({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
  });

  const getDiceQuickSelectCharacterList = createGetDiceQuickSelectCharacterList({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    pushDiceQuickSelectCharacter: (...a: any[]) => pushDiceQuickSelectCharacter(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const getAdvancedPresetMappedTarget = createGetAdvancedPresetMappedTarget({
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

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

  const getNamedCheckParamText = createGetNamedCheckParamText({

  });

  const buildCheckValueText = createBuildCheckValueText({
    formatSignedModifier: (...a: any[]) => formatSignedModifier(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
  });

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
  const updateSingleAttribute = createUpdateSingleAttribute({
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    pickFallbackAttributeColumn: (...a: any[]) => pickFallbackAttributeColumn(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
    saveRowInstantly: (...a: any[]) => saveRowInstantly(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    getCachedRawData: () => cachedRawData,
  });

  // [修复] 获取角色的完整属性列表（包括基础属性和特有属性等所有包含"属性"的列）
  const getFullAttributesForCharacter = createGetFullAttributesForCharacter({
    findAttributeColumnIndices: (...a: any[]) => findAttributeColumnIndices(...a),
    findCharacterAttributeRow: (...a: any[]) => findCharacterAttributeRow(...a),
    findPrimaryAttributeColumns: (...a: any[]) => findPrimaryAttributeColumns(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseAttributeString: (...a: any[]) => parseAttributeString(...a),
    getCachedRawData: () => cachedRawData,
  });
  // [新增] 自定义下拉菜单初始化函数
  const initCustomDropdown = createInitCustomDropdown({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
  });
  // [新增] 给输入框添加清除按钮
  const addClearButton = createAddClearButton({
    getCore: (...a: any[]) => getCore(...a),
  });
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

  const findRelationGraphColumnIndex = createFindRelationGraphColumnIndex({

  });

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

  const findRelationshipGraphSourceTables = createFindRelationshipGraphSourceTables({

  });

  const buildRelationshipGraphTableFromPreset = createBuildRelationshipGraphTableFromPreset({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    findRelationGraphRelationColumnMatch: (...a: any[]) => findRelationGraphRelationColumnMatch(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
    USER_NODE_KEY: USER_NODE_KEY,
  });

  const isDashboardRoleInSceneValue = createIsDashboardRoleInSceneValue({

  });

  const pushDashboardNpcEntry = (entries, entry): void => {
    const name = String(entry.name || '').trim();
    if (!name) return;
    if (entries.some(existing => characterNamesMatch(existing.name, name))) return;
    entries.push({ ...entry, name });
  };

  const findDashboardNpcNameColumnIndex = createFindDashboardNpcNameColumnIndex({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

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

  const collectDashboardNpcEntriesFromRelationshipSources = createCollectDashboardNpcEntriesFromRelationshipSources({
    collectDashboardNpcEntriesFromTableResult: (...a: any[]) => collectDashboardNpcEntriesFromTableResult(...a),
    findRelationshipGraphSourceTables: (...a: any[]) => findRelationshipGraphSourceTables(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const getDashboardNpcListData = createGetDashboardNpcListData({
    collectDashboardNpcEntriesFromRelationshipSources: (...a: any[]) => collectDashboardNpcEntriesFromRelationshipSources(...a),
    collectDashboardNpcEntriesFromTableResults: (...a: any[]) => collectDashboardNpcEntriesFromTableResults(...a),
    getActiveDashboardRelationshipGraphSources: (...a: any[]) => getActiveDashboardRelationshipGraphSources(...a),
    DashboardDataParser: DashboardDataParser,
  });

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

  const collectCurrentChatAvatarNodes = createCollectCurrentChatAvatarNodes({
    getDashboardNpcListData: (...a: any[]) => getDashboardNpcListData(...a),
    DashboardDataParser: DashboardDataParser,
  });

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

  const refreshAutoImageColorForAvatar = createRefreshAutoImageColorForAvatar({
    getAvatarFallbackColor: (...a: any[]) => getAvatarFallbackColor(...a),
    inferAvatarImageColor: (...a: any[]) => inferAvatarImageColor(...a),
    AvatarManager: AvatarManager,
  });
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
  const clearDiceSystemCache = createClearDiceSystemCache({

  });

  const clearDiceLocalCacheData = createClearDiceLocalCacheData({
    clearDiceSystemCache: (...a: any[]) => clearDiceSystemCache(...a),
    DiceHistoryStatsDB: DiceHistoryStatsDB,
  });

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

  const DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY = createDiceConfigBackupActiveKeyToPresetKey({

  });

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

  const formatDiceConfigBackupPrivacyDetail = createFormatDiceConfigBackupPrivacyDetail({
    formatDiceConfigBackupSelectedModuleRiskLines: (...a: any[]) => formatDiceConfigBackupSelectedModuleRiskLines(...a),
  });

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

  const normalizeDiceConfigBackupSelectedModuleIds = createNormalizeDiceConfigBackupSelectedModuleIds({
    isDiceConfigBackupModuleId: (...a: any[]) => isDiceConfigBackupModuleId(...a),
  });

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

  const sanitizeDiceConfigBackupValidationRule = createSanitizeDiceConfigBackupValidationRule({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

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

  const sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport = createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

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

  const getDiceConfigBackupStoredValue = createGetDiceConfigBackupStoredValue({
    getConfig: (...a: any[]) => getConfig(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

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

  const collectDiceConfigBackupGachaCatalogRecords = createCollectDiceConfigBackupGachaCatalogRecords({
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    normalizeDiceConfigBackupGachaCatalogSnapshotRecords: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogSnapshotRecords(...a),
  });

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

  const getDiceConfigBackupModuleResourceCount = createGetDiceConfigBackupModuleResourceCount({
    getDiceConfigBackupGachaCatalogItemCount: (...a: any[]) => getDiceConfigBackupGachaCatalogItemCount(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupTableTemplateResource = (payload?: DiceConfigBackupModulePayload): boolean =>
    isDiceConfigBackupRecord(payload?.resources?.[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY]);

  const hasDiceConfigBackupRecoverableStorage = createHasDiceConfigBackupRecoverableStorage({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const getDiceConfigBackupModuleResourceShapeWarnings = createGetDiceConfigBackupModuleResourceShapeWarnings({
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupLocalImageReference = createHasDiceConfigBackupLocalImageReference({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const getDiceConfigBackupModuleWarnings = createGetDiceConfigBackupModuleWarnings({
    hasDiceConfigBackupLocalImageReference: (...a: any[]) => hasDiceConfigBackupLocalImageReference(...a),
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

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

  const getDiceConfigBackupValueIdentity = createGetDiceConfigBackupValueIdentity({

  });

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

  const mergeDiceConfigBackupCustomRules = createMergeDiceConfigBackupCustomRules({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
  });

  const mergeDiceConfigBackupValidationRules = createMergeDiceConfigBackupValidationRules({
    applyDiceConfigBackupRuleOverrides: (...a: any[]) => applyDiceConfigBackupRuleOverrides(...a),
    buildDiceConfigBackupRuleOverrideMap: (...a: any[]) => buildDiceConfigBackupRuleOverrideMap(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupRuleRecords: (...a: any[]) => getDiceConfigBackupRuleRecords(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    mergeDiceConfigBackupCustomRules: (...a: any[]) => mergeDiceConfigBackupCustomRules(...a),
    sanitizeDiceConfigBackupValidationRule: (...a: any[]) => sanitizeDiceConfigBackupValidationRule(...a),
  });

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

  const normalizeDiceConfigBackupGachaPoolSettings = createNormalizeDiceConfigBackupGachaPoolSettings({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
  });

  const mergeDiceConfigBackupGachaPoolSettings = createMergeDiceConfigBackupGachaPoolSettings({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
    normalizeDiceConfigBackupGachaPoolSettings: (...a: any[]) => normalizeDiceConfigBackupGachaPoolSettings(...a),
  });

  const normalizeDiceConfigBackupGachaItemSettings = createNormalizeDiceConfigBackupGachaItemSettings({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const mergeDiceConfigBackupGachaItemSettings = createMergeDiceConfigBackupGachaItemSettings({
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
  });

  const remapDiceConfigBackupGachaItemSettings = createRemapDiceConfigBackupGachaItemSettings({
    normalizeDiceConfigBackupGachaItemSettings: (...a: any[]) => normalizeDiceConfigBackupGachaItemSettings(...a),
  });

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

  const getDiceConfigBackupKnownPresetIds = createGetDiceConfigBackupKnownPresetIds({
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

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

  const applyDiceConfigBackupActiveValue = createApplyDiceConfigBackupActiveValue({
    applyDiceConfigBackupValue: (...a: any[]) => applyDiceConfigBackupValue(...a),
    getDiceConfigBackupKnownPresetIds: (...a: any[]) => getDiceConfigBackupKnownPresetIds(...a),
    CUSTOM_ROLL_MODE: CUSTOM_ROLL_MODE,
    DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY: DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY,
  });

  const normalizeDiceConfigBackupGachaCatalogItems = createNormalizeDiceConfigBackupGachaCatalogItems({
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeImportedGachaItem: (...a: any[]) => normalizeImportedGachaItem(...a),
    validateGachaCatalogImportItemTarget: (...a: any[]) => validateGachaCatalogImportItemTarget(...a),
  });

  const normalizeDiceConfigBackupGachaCatalogResourceRecord = createNormalizeDiceConfigBackupGachaCatalogResourceRecord({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogItems: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogItems(...a),
  });

  const getDiceConfigBackupGachaItemNameKey = (item: Pick<GachaItemDefinition, 'name' | 'type' | 'quality'>): string =>
    `${String(item.name || '').trim()}|${String(item.type || '').trim()}|${String(item.quality || '').trim()}`.toLowerCase();

  const mergeDiceConfigBackupGachaCatalogItems = createMergeDiceConfigBackupGachaCatalogItems({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    getDiceConfigBackupGachaItemNameKey: (...a: any[]) => getDiceConfigBackupGachaItemNameKey(...a),
  });

  const getDiceConfigBackupTableTemplateRollbackSnapshot = createGetDiceConfigBackupTableTemplateRollbackSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupTableTemplateRollbackSnapshot = createRestoreDiceConfigBackupTableTemplateRollbackSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

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

  const restoreDiceConfigBackupTableTemplate = createRestoreDiceConfigBackupTableTemplate({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupTableTemplateApi: (...a: any[]) => getDiceConfigBackupTableTemplateApi(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const restoreDiceConfigBackupModuleResources = createRestoreDiceConfigBackupModuleResources({
    restoreDiceConfigBackupGachaCatalogRecords: (...a: any[]) => restoreDiceConfigBackupGachaCatalogRecords(...a),
    restoreDiceConfigBackupTableTemplate: (...a: any[]) => restoreDiceConfigBackupTableTemplate(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const restoreDiceConfigBackupGachaCatalogSnapshot = createRestoreDiceConfigBackupGachaCatalogSnapshot({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask = v; },
  });

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

  const normalizeDiceProfileModuleIds = createNormalizeDiceProfileModuleIds({
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getDiceConfigBackupAvailableModuleIds: (...a: any[]) => getDiceConfigBackupAvailableModuleIds(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
  });

  const getDiceProfileModuleNames = (moduleIds: readonly DiceConfigBackupModuleId[]): string =>
    moduleIds
      .map(moduleId => getDiceConfigBackupModuleDefinition(moduleId)?.name || moduleId)
      .join('、');

  const toDiceProfileSummary = createToDiceProfileSummary({

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


  const refreshDiceProfileIndex = createRefreshDiceProfileIndex({
    getDiceProfileIndex: (...a: any[]) => getDiceProfileIndex(...a),
    saveDiceProfileIndex: (...a: any[]) => saveDiceProfileIndex(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
  });

  const getDiceProfileRecords = createGetDiceProfileRecords({
    saveDiceProfileIndex: (...a: any[]) => saveDiceProfileIndex(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
  });

  const normalizeDiceProfileRecord = createNormalizeDiceProfileRecord({
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    parseDiceConfigBackup: (...a: any[]) => parseDiceConfigBackup(...a),
  });

  const parseDiceProfileInput = createParseDiceProfileInput({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    parseJsoncDocument: (...a: any[]) => parseJsoncDocument(...a),
  });

  const saveDiceProfileRecord = async (record: DiceProfileRecord): Promise<DiceProfileRecord> => {
    const saved = await DiceProfileDB.put(record);
    if (!saved) throw new Error('配置方案保存失败，IndexedDB 写入未完成');
    await refreshDiceProfileIndex();
    return record;
  };

  const upsertDiceProfileRecord = createUpsertDiceProfileRecord({
    getDiceProfileRecords: (...a: any[]) => getDiceProfileRecords(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
  });

  const deleteDiceProfileRecord = async (profileId: string): Promise<boolean> => {
    const deleted = await DiceProfileDB.delete(profileId);
    await refreshDiceProfileIndex();
    return deleted;
  };

  const importDiceProfile = createImportDiceProfile({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    parseDiceProfileInput: (...a: any[]) => parseDiceProfileInput(...a),
    upsertDiceProfileRecord: (...a: any[]) => upsertDiceProfileRecord(...a),
  });

  const saveCurrentDiceProfile = createSaveCurrentDiceProfile({
    buildDiceConfigBackup: (...a: any[]) => buildDiceConfigBackup(...a),
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    upsertDiceProfileRecord: (...a: any[]) => upsertDiceProfileRecord(...a),
  });

  const createDiceProfilePreApplySnapshot = createCreateDiceProfilePreApplySnapshot({
    deleteDiceProfileRecord: (...a: any[]) => deleteDiceProfileRecord(...a),
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getDiceProfileRecords: (...a: any[]) => getDiceProfileRecords(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT: DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT,
  });

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

  const applyDiceProfile = createApplyDiceProfile({
    applyDiceConfigBackup: (...a: any[]) => applyDiceConfigBackup(...a),
    createDiceProfilePreApplySnapshot: (...a: any[]) => createDiceProfilePreApplySnapshot(...a),
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
    showDiceProfileApplyConfirm: (...a: any[]) => showDiceProfileApplyConfirm(...a),
    DICE_PROFILE_LAST_APPLIED_STORAGE_KEY: DICE_PROFILE_LAST_APPLIED_STORAGE_KEY,
  });

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

  const downloadDiceProfileTavernRegex = createDownloadDiceProfileTavernRegex({
    createDiceProfileTavernRegex: (...a: any[]) => createDiceProfileTavernRegex(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  const getDiceProfilePromptStates = (): Record<string, 'skipped' | 'applied' | 'saved'> => {
    const stored = Store.get(DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, {});
    return isDiceConfigBackupRecord(stored) ? stored : {};
  };

  const setDiceProfilePromptState = createSetDiceProfilePromptState({
    getDiceProfilePromptStates: (...a: any[]) => getDiceProfilePromptStates(...a),
    getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY: () => DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY,
  });

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

  const collectDiceProfileRegexScriptsFromRecord = createCollectDiceProfileRegexScriptsFromRecord({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

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

  const detectCharacterDiceProfile = createDetectCharacterDiceProfile({
    collectDiceCharacterProfileTexts: (...a: any[]) => collectDiceCharacterProfileTexts(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    getDiceProfilePromptState: (...a: any[]) => getDiceProfilePromptState(...a),
    normalizeDiceProfileRecord: (...a: any[]) => normalizeDiceProfileRecord(...a),
    upsertDiceProfileRecord: (...a: any[]) => upsertDiceProfileRecord(...a),
  });

  const showDiceCharacterProfilePrompt = createShowDiceCharacterProfilePrompt({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDiceProfileModuleNames: (...a: any[]) => getDiceProfileModuleNames(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

  const maybePromptCharacterDiceProfile = createMaybePromptCharacterDiceProfile({
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    setDiceProfilePromptState: (...a: any[]) => setDiceProfilePromptState(...a),
    showDiceCharacterProfilePrompt: (...a: any[]) => showDiceCharacterProfilePrompt(...a),
  });

  const scheduleCharacterDiceProfileDetection = (delay = 800): void => {
    window.setTimeout(() => {
      void maybePromptCharacterDiceProfile();
    }, delay);
  };

  const getDiceConfigBackupAvailableModuleIds = createGetDiceConfigBackupAvailableModuleIds({
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    hasDiceConfigBackupRecoverableStorage: (...a: any[]) => hasDiceConfigBackupRecoverableStorage(...a),
    hasDiceConfigBackupTableTemplateResource: (...a: any[]) => hasDiceConfigBackupTableTemplateResource(...a),
  });

  const getDiceConfigBackupSelectedModuleIdsFromDialog = (dialog: JQuery): DiceConfigBackupModuleId[] =>
    normalizeDiceConfigBackupSelectedModuleIds(
      dialog
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox:checked')
        .map((_, element) => String(element.value || ''))
        .get(),
    );

  const getDiceConfigBackupRestoreWarnings = createGetDiceConfigBackupRestoreWarnings({

  });

  const getDiceConfigBackupModuleCountText = createGetDiceConfigBackupModuleCountText({

  });

  const renderDiceConfigBackupModuleRows = createRenderDiceConfigBackupModuleRows({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupModuleCountText: (...a: any[]) => getDiceConfigBackupModuleCountText(...a),
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    renderDeprecatedBadge: (...a: any[]) => renderDeprecatedBadge(...a),
  });

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

  const renderDiceConfigBackupRestoreBody = createRenderDiceConfigBackupRestoreBody({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupAvailableModuleIds: (...a: any[]) => getDiceConfigBackupAvailableModuleIds(...a),
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    getDiceConfigBackupRestoreWarnings: (...a: any[]) => getDiceConfigBackupRestoreWarnings(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    renderDiceConfigBackupPrivacyNotice: (...a: any[]) => renderDiceConfigBackupPrivacyNotice(...a),
    renderDiceConfigBackupWarningSlot: (...a: any[]) => renderDiceConfigBackupWarningSlot(...a),
  });

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

  const renderDiceProfileSummaryRow = createRenderDiceProfileSummaryRow({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceProfileSourceLabel: (...a: any[]) => getDiceProfileSourceLabel(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
  });

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

  const prepareAvatarManagerTutorial = createPrepareAvatarManagerTutorial({
    getCore: (...a: any[]) => getCore(...a),
  });

  const prepareMvuTutorial = createPrepareMvuTutorial({
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
  });

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

  const SETTINGS_GROUP_TUTORIAL_MAP = createSettingsGroupTutorialMap({

  });

  const prepareSettingsGroupTutorial = createPrepareSettingsGroupTutorial({
    getCore: (...a: any[]) => getCore(...a),
    SETTINGS_GROUP_TUTORIAL_MAP: SETTINGS_GROUP_TUTORIAL_MAP,
  });

  const startTutorialFromButton = createStartTutorialFromButton({
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getTutorialModule: (...a: any[]) => getTutorialModule(...a),
    isTutorialScope: (...a: any[]) => isTutorialScope(...a),
    prepareAvatarManagerTutorial: (...a: any[]) => prepareAvatarManagerTutorial(...a),
    prepareInventoryTutorial: (...a: any[]) => prepareInventoryTutorial(...a),
    prepareMvuTutorial: (...a: any[]) => prepareMvuTutorial(...a),
    prepareSettingsGroupTutorial: (...a: any[]) => prepareSettingsGroupTutorial(...a),
  });

  const bindTutorialButtonsIn = createBindTutorialButtonsIn({
    startTutorialFromButton: (...a: any[]) => startTutorialFromButton(...a),
  });

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

  const setDiffDataCell = createSetDiffDataCell({
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
  });

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

  const getDiffRowIdentityKeys = createGetDiffRowIdentityKeys({
    getDiffPreferredColumns: (...a: any[]) => getDiffPreferredColumns(...a),
    normalizeDiffHeader: (...a: any[]) => normalizeDiffHeader(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getDiffRowDisplayTitle = createGetDiffRowDisplayTitle({
    getDiffPreferredColumns: (...a: any[]) => getDiffPreferredColumns(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const createDiffRowMatcher = createCreateDiffRowMatcher({
    getDiffRowIdentityKeys: (...a: any[]) => getDiffRowIdentityKeys(...a),
  });

  const takeDiffRowMatch = createTakeDiffRowMatch({
    getDiffRowIdentityKeys: (...a: any[]) => getDiffRowIdentityKeys(...a),
  });

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
  const addStyles = createAddStyles({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

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

  const getRuntimeErrorMessage = createGetRuntimeErrorMessage({

  });

  const getRuntimeErrorLogPayload = createGetRuntimeErrorLogPayload({
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
  });

  type RuntimeTableReadOptions = {
    silent?: boolean;
  };

  const readRuntimeTableData = createReadRuntimeTableData({

  });

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

  const getTableData = createGetTableData({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getCore: (...a: any[]) => getCore(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
    readRuntimeTableData: (...a: any[]) => readRuntimeTableData(...a),
  });

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

  const findLatestDbMessageIndex = createFindLatestDbMessageIndex({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    hasDbPayload: (...a: any[]) => hasDbPayload(...a),
  });

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

  const assertRuntimeCrudApi = createAssertRuntimeCrudApi({
    getCore: (...a: any[]) => getCore(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
  });

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

  const decodeCrudSqlIdentifier = createDecodeCrudSqlIdentifier({

  });

  const normalizeCrudHeaderLookupKey = (value: unknown): string =>
    normalizeDiffText(value)
      .replace(/（/g, '(')
      .replace(/）/g, ')');

  const normalizeCrudSqlComment = (comment: unknown): string =>
    String(comment || '')
      .replace(/[，,].*$/, '')
      .trim();

  const getCrudSqlCommentAliases = createGetCrudSqlCommentAliases({
    normalizeCrudSqlComment: (...a: any[]) => normalizeCrudSqlComment(...a),
  });

  const addCrudColumnAlias = (aliases: Record<string, string>, alias: string, columnName: string): void => {
    const trimmedAlias = normalizeDiffText(alias);
    const normalizedAlias = normalizeCrudHeaderLookupKey(trimmedAlias);
    [trimmedAlias, normalizedAlias].forEach(key => {
      if (key && !aliases[key]) aliases[key] = columnName;
    });
  };

  const getCrudColumnNameForHeader = createGetCrudColumnNameForHeader({
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

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

  const parseSqlQuotedValues = createParseSqlQuotedValues({

  });

  type RuntimeCrudEnumConstraint = {
    values: string[];
    nullable: boolean;
  };

  const buildCrudEnumConstraintMap = createBuildCrudEnumConstraintMap({
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    parseSqlQuotedValues: (...a: any[]) => parseSqlQuotedValues(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    CRUD_SQL_IDENTIFIER_PATTERN: CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const isCrudNullableEnumEmptyValue = (value: unknown): boolean =>
    value === null || value === undefined || String(value).trim() === '';

  const assertCrudEnumConstraints = createAssertCrudEnumConstraints({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    isCrudNullableEnumEmptyValue: (...a: any[]) => isCrudNullableEnumEmptyValue(...a),
  });

  const buildCrudLengthConstraintMap = createBuildCrudLengthConstraintMap({
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    CRUD_SQL_IDENTIFIER_PATTERN: CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const getCrudUnsupportedFallbackConstraintText = createGetCrudUnsupportedFallbackConstraintText({
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    CRUD_SQL_IDENTIFIER_PATTERN: CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const assertCrudJsonFallbackAllowed = (tableName: string, sheet: unknown): void => {
    const unsupportedConstraint = getCrudUnsupportedFallbackConstraintText(sheet);
    if (!unsupportedConstraint) return;
    throw new Error(
      `更新 "${tableName}" 失败后已取消 JSON 回退保存：数据库结构包含当前无法本地复核的约束（${unsupportedConstraint}）。请修正单元格内容或表格结构后重试。`,
    );
  };

  const assertCrudLengthConstraints = createAssertCrudLengthConstraints({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudLengthConstraintMap: (...a: any[]) => buildCrudLengthConstraintMap(...a),
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
  });

  const buildCrudRequiredHeaderSet = createBuildCrudRequiredHeaderSet({
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    parseCrudColumnDefinitionLine: (...a: any[]) => parseCrudColumnDefinitionLine(...a),
    stripCrudSqlNonStructuralComments: (...a: any[]) => stripCrudSqlNonStructuralComments(...a),
  });

  const assertCrudRequiredColumnsRepresented = createAssertCrudRequiredColumnsRepresented({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudRequiredHeaderSet: (...a: any[]) => buildCrudRequiredHeaderSet(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getCrudRequiredColumnsByHeaderIndex = createGetCrudRequiredColumnsByHeaderIndex({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudRequiredHeaderSet: (...a: any[]) => buildCrudRequiredHeaderSet(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const assertCrudRequiredCellValues = createAssertCrudRequiredCellValues({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    getCrudRequiredColumnsByHeaderIndex: (...a: any[]) => getCrudRequiredColumnsByHeaderIndex(...a),
  });

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

  const buildRowDataForCrud = createBuildRowDataForCrud({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
  });

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

  const patchCrudSheetInRecord = createPatchCrudSheetInRecord({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
  });

  const patchCrudSheetCellInMessage = createPatchCrudSheetCellInMessage({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    patchCrudSheetCellInRecord: (...a: any[]) => patchCrudSheetCellInRecord(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

  const patchCrudSheetInMessage = createPatchCrudSheetInMessage({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    patchCrudSheetInRecord: (...a: any[]) => patchCrudSheetInRecord(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

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

  const saveSheetsViaJsonFloorWithoutTracking = createSaveSheetsViaJsonFloorWithoutTracking({
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    patchCrudSheetInRecord: (...a: any[]) => patchCrudSheetInRecord(...a),
    patchLatestChatSheetWithoutTracking: (...a: any[]) => patchLatestChatSheetWithoutTracking(...a),
    readRuntimeTableDataReference: (...a: any[]) => readRuntimeTableDataReference(...a),
    sanitizeRuntimeTableData: (...a: any[]) => sanitizeRuntimeTableData(...a),
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

  const applyJsonCellFallbackForCrud = createApplyJsonCellFallbackForCrud({
    assertCrudRequiredCellValues: (...a: any[]) => assertCrudRequiredCellValues(...a),
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
    patchCrudSheetCellInRecord: (...a: any[]) => patchCrudSheetCellInRecord(...a),
    patchLatestChatSheetCellWithoutTracking: (...a: any[]) => patchLatestChatSheetCellWithoutTracking(...a),
    readRuntimeTableDataReference: (...a: any[]) => readRuntimeTableDataReference(...a),
  });

  const patchCrudRowIdIfMissing = createPatchCrudRowIdIfMissing({
    isCrudRowIdMissing: (...a: any[]) => isCrudRowIdMissing(...a),
  });

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

  const findDeletionIndicesForCrud = createFindDeletionIndicesForCrud({
    getStableRowKeyForCrud: (...a: any[]) => getStableRowKeyForCrud(...a),
  });

  const assertAppendOnlyRows = createAssertAppendOnlyRows({
    getStableRowKeyForCrud: (...a: any[]) => getStableRowKeyForCrud(...a),
  });

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

  const sanitizeRuntimeTableData = createSanitizeRuntimeTableData({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getPendingDeletions: (...a: any[]) => getPendingDeletions(...a),
    normalizeSheetKeys: (...a: any[]) => normalizeSheetKeys(...a),
    syncInventoryMetadataForRawData: (...a: any[]) => syncInventoryMetadataForRawData(...a),
  });

  const applyRuntimeDataViaCrud = createApplyRuntimeDataViaCrud({
    applySheetDataViaCrud: (...a: any[]) => applySheetDataViaCrud(...a),
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    findRuntimeSheetEntryForCrud: (...a: any[]) => findRuntimeSheetEntryForCrud(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    sanitizeRuntimeTableData: (...a: any[]) => sanitizeRuntimeTableData(...a),
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

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

  const updateRuntimeDataCacheAfterCrud = createUpdateRuntimeDataCacheAfterCrud({
    getTableData: (...a: any[]) => getTableData(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

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

  const deleteRowInstantly = createDeleteRowInstantly({
    assertRuntimeCrudApi: (...a: any[]) => assertRuntimeCrudApi(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
    getCrudTableIdentifier: (...a: any[]) => getCrudTableIdentifier(...a),
    resolveRuntimeMutationSource: (...a: any[]) => resolveRuntimeMutationSource(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    updateRuntimeDataCacheAfterCrud: (...a: any[]) => updateRuntimeDataCacheAfterCrud(...a),
  });

  const processJsonData = createProcessJsonData({
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
  });

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
  const refreshDicePanelPresets = createRefreshDicePanelPresets({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getCore: (...a: any[]) => getCore(...a),
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });

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

  const buildAdvancedPresetAgentPromptFilename = createBuildAdvancedPresetAgentPromptFilename({

  });

  const buildDashboardPresetAgentPromptFilename = createBuildDashboardPresetAgentPromptFilename({

  });

  const buildActionPresetAgentPromptFilename = createBuildActionPresetAgentPromptFilename({

  });

  const buildRenderPresetAgentPromptFilename = createBuildRenderPresetAgentPromptFilename({

  });

  const buildTableTemplateRequirementPresetAgentPromptFilename = createBuildTableTemplateRequirementPresetAgentPromptFilename({

  });

  const buildGachaCatalogAgentPromptFilename = createBuildGachaCatalogAgentPromptFilename({

  });

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

  const buildNewActionPresetRulesJsoncTemplate = createBuildNewActionPresetRulesJsoncTemplate({

  });

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
  const acuDiceCharacters = createAcuDiceCharactersInstance({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCachedRawData: () => cachedRawData,
    getDashboardDataParser: () => DashboardDataParser,
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
  const acuDiceContest = createAcuDiceContest({
    emitEvent: (...a: any[]) => emitEvent(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getSuccessLevel: (...a: any[]) => getSuccessLevel(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    normalizeCheckSuggestionDiceFormula: (...a: any[]) => normalizeCheckSuggestionDiceFormula(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
    NameAliasRegistry: NameAliasRegistry,
    getCachedRawData: () => cachedRawData,
    getMAX_HISTORY: () => MAX_HISTORY,
    getContestHistory: () => contestHistory,
  });
  const notifyReady = (): void => {
    acuDiceReady.markReady();
  };

  const defineAcuDiceOnWindow = createDefineAcuDiceOnWindow({
    getAcuDiceAPI: () => AcuDiceAPI,
  });

  const dispatchReadyEvent = (target: Window) => {
    try {
      target.dispatchEvent(new CustomEvent(ACUDICE_READY_EVENT));
    } catch (error) {
      console.warn('[AcuDice] ready 事件触发失败', error);
    }
  };

  // 事件系统
  const acuDiceEvents = createAcuDiceEventsInstance({
    settleGachaFortuneForDiceEvent: (...a: any[]) => settleGachaFortuneForDiceEvent(...a),
    getDiceHistoryStatsDB: () => DiceHistoryStatsDB,
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

  const copyTextWithTavernApi = createCopyTextWithTavernApi({

  });

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

  const parseCheckSuggestionTieRule = createParseCheckSuggestionTieRule({

  });

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

  const normalizeLeadingCheckSuggestionSideShorthand = createNormalizeLeadingCheckSuggestionSideShorthand({
    normalizeCheckSuggestionSideShorthand: (...a: any[]) => normalizeCheckSuggestionSideShorthand(...a),
  });

  const normalizeCheckSuggestionCommandInput = createNormalizeCheckSuggestionCommandInput({
    normalizeLeadingCheckSuggestionSideShorthand: (...a: any[]) => normalizeLeadingCheckSuggestionSideShorthand(...a),
  });

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

  const refreshNameAliasesForCheckSuggestion = createRefreshNameAliasesForCheckSuggestion({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData,
    getNameAliasRegistry: () => NameAliasRegistry,
  });

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

  const normalizeCheckSuggestionParams = createNormalizeCheckSuggestionParams({
    parseCheckSuggestionPrimitiveValue: (...a: any[]) => parseCheckSuggestionPrimitiveValue(...a),
  });

  const parseCheckSuggestionModifierValue = createParseCheckSuggestionModifierValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const resolveCheckSuggestionDefaultValue = createResolveCheckSuggestionDefaultValue({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });

  const resolveCheckSuggestionNumberParam = createResolveCheckSuggestionNumberParam({
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    parseCheckSuggestionModifierValue: (...a: any[]) => parseCheckSuggestionModifierValue(...a),
  });

  const getCheckSuggestionMappedTarget = (
    preset: AdvancedDicePreset,
    attrName: string,
    attrSource?: CharacterAttributeSource,
  ): AttributeQuickSelectTarget => {
    return resolveQuickSelectTarget(attrName, attrSource, preset, 'normal');
  };

  const getCheckSuggestionOutcomeResultType = createGetCheckSuggestionOutcomeResultType({

  });

  const isCheckSuggestionOutcomeSuccess = (outcome: OutcomeLevel): boolean => {
    return (
      getCheckSuggestionOutcomeResultType(outcome) === 'critSuccess' ||
      getCheckSuggestionOutcomeResultType(outcome) === 'extremeSuccess' ||
      getCheckSuggestionOutcomeResultType(outcome) === 'success'
    );
  };

  const resolveCheckSuggestionFieldValue = createResolveCheckSuggestionFieldValue({
    parseCheckSuggestionPrimitiveValue: (...a: any[]) => parseCheckSuggestionPrimitiveValue(...a),
    resolveCheckSuggestionNumberParam: (...a: any[]) => resolveCheckSuggestionNumberParam(...a),
  });

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

  const replaceCheckSuggestionConditionVars = createReplaceCheckSuggestionConditionVars({

  });

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

  const buildCheckSuggestionSideParams = createBuildCheckSuggestionSideParams({

  });

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

  const getTemplateInspectionSheets = createGetTemplateInspectionSheets({

  });

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

  const showTemplateInspectionModal = createShowTemplateInspectionModal({
    getCore: (...a: any[]) => getCore(...a),
    showTemplateInspectionResultModal: (...a: any[]) => showTemplateInspectionResultModal(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

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
  const VIEWPORT_BOTTOM_REFRESH_EVENTS = createViewportBottomRefreshEvents({

  });
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

  const normalizeFloatingCollapsePosition = createNormalizeFloatingCollapsePosition({

  });

  const getFloatingViewportBounds = createGetFloatingViewportBounds({
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

  const clampFloatingCollapsePosition = createClampFloatingCollapsePosition({
    getFloatingViewportBounds: (...a: any[]) => getFloatingViewportBounds(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportBottomOffset: (...a: any[]) => getViewportBottomOffset(...a),
    FLOATING_COLLAPSE_MARGIN: FLOATING_COLLAPSE_MARGIN,
    FLOATING_COLLAPSE_SIZE: FLOATING_COLLAPSE_SIZE,
  });

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

  const getViewportAnchorRect = createGetViewportAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

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

  const getFixedModeAnchorRect = createGetFixedModeAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportAnchorRect: (...a: any[]) => getViewportAnchorRect(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    FIXED_MODE_ANCHOR_PRIORITY: FIXED_MODE_ANCHOR_PRIORITY,
  });

  const getViewportBottomOffset = createGetViewportBottomOffset({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    VIEWPORT_COMPOSER_ELEMENT_IDS: VIEWPORT_COMPOSER_ELEMENT_IDS,
  });

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

  const scheduleFixedWrapperBoundsRefresh = createScheduleFixedWrapperBoundsRefresh({
    getConfig: (...a: any[]) => getConfig(...a),
    updateFixedWrapperBounds: (...a: any[]) => updateFixedWrapperBounds(...a),
    getFixedWrapperBoundsRaf: () => fixedWrapperBoundsRaf,
    setFixedWrapperBoundsRaf: (v: any) => { fixedWrapperBoundsRaf = v; },
  });

  const clearFixedAnchorResizeObserver = () => {
    if (fixedAnchorResizeObserver) {
      fixedAnchorResizeObserver.disconnect();
      fixedAnchorResizeObserver = null;
    }
  };

  const refreshFixedAnchorResizeObserver = createRefreshFixedAnchorResizeObserver({
    clearFixedAnchorResizeObserver: (...a: any[]) => clearFixedAnchorResizeObserver(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    getFixedAnchorResizeObserver: () => fixedAnchorResizeObserver,
    setFixedAnchorResizeObserver: (v: any) => { fixedAnchorResizeObserver = v; },
  });

  const scheduleFixedAnchorTargetRefresh = createScheduleFixedAnchorTargetRefresh({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    refreshFixedAnchorResizeObserver: (...a: any[]) => refreshFixedAnchorResizeObserver(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    getFixedAnchorTargetsRaf: () => fixedAnchorTargetsRaf,
    setFixedAnchorTargetsRaf: (v: any) => { fixedAnchorTargetsRaf = v; },
  });

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

  const setupFixedAnchorMutationObserver = createSetupFixedAnchorMutationObserver({
    clearFixedAnchorMutationObserver: (...a: any[]) => clearFixedAnchorMutationObserver(...a),
    scheduleFixedAnchorTargetRefresh: (...a: any[]) => scheduleFixedAnchorTargetRefresh(...a),
    getFixedAnchorMutationDocument: () => fixedAnchorMutationDocument,
    setFixedAnchorMutationDocument: (v: any) => { fixedAnchorMutationDocument = v; },
    getFixedAnchorMutationObserver: () => fixedAnchorMutationObserver,
    setFixedAnchorMutationObserver: (v: any) => { fixedAnchorMutationObserver = v; },
    getFixedAnchorMutationWindow: () => fixedAnchorMutationWindow,
    setFixedAnchorMutationWindow: (v: any) => { fixedAnchorMutationWindow = v; },
  });

  const clearFixedWrapperBoundsListeners = createClearFixedWrapperBoundsListeners({
    clearFixedAnchorMutationObserver: (...a: any[]) => clearFixedAnchorMutationObserver(...a),
    clearFixedAnchorResizeObserver: (...a: any[]) => clearFixedAnchorResizeObserver(...a),
    getFixedWrapperBoundsListenerWindow: () => fixedWrapperBoundsListenerWindow,
    setFixedWrapperBoundsListenerWindow: (v: any) => { fixedWrapperBoundsListenerWindow = v; },
    getFixedWrapperBoundsRaf: () => fixedWrapperBoundsRaf,
    setFixedWrapperBoundsRaf: (v: any) => { fixedWrapperBoundsRaf = v; },
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    setFixedWrapperBoundsRefreshHandler: (v: any) => { fixedWrapperBoundsRefreshHandler = v; },
  });

  const setupFixedWrapperBoundsListeners = createSetupFixedWrapperBoundsListeners({
    clearFixedWrapperBoundsListeners: (...a: any[]) => clearFixedWrapperBoundsListeners(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    refreshFixedAnchorResizeObserver: (...a: any[]) => refreshFixedAnchorResizeObserver(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    setupFixedAnchorMutationObserver: (...a: any[]) => setupFixedAnchorMutationObserver(...a),
    getFixedWrapperBoundsListenerWindow: () => fixedWrapperBoundsListenerWindow,
    setFixedWrapperBoundsListenerWindow: (v: any) => { fixedWrapperBoundsListenerWindow = v; },
    getFixedWrapperBoundsRefreshHandler: () => fixedWrapperBoundsRefreshHandler,
    setFixedWrapperBoundsRefreshHandler: (v: any) => { fixedWrapperBoundsRefreshHandler = v; },
  });

  const scheduleFloatingCollapseBoundsRefresh = createScheduleFloatingCollapseBoundsRefresh({
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    updateFloatingCollapseBounds: (...a: any[]) => updateFloatingCollapseBounds(...a),
    getFloatingCollapseBoundsRaf: () => floatingCollapseBoundsRaf,
    setFloatingCollapseBoundsRaf: (v: any) => { floatingCollapseBoundsRaf = v; },
  });

  const clearFloatingCollapseBoundsListeners = createClearFloatingCollapseBoundsListeners({
    getFloatingCollapseBoundsListenerWindow: () => floatingCollapseBoundsListenerWindow,
    setFloatingCollapseBoundsListenerWindow: (v: any) => { floatingCollapseBoundsListenerWindow = v; },
    getFloatingCollapseBoundsRefreshHandler: () => floatingCollapseBoundsRefreshHandler,
    setFloatingCollapseBoundsRefreshHandler: (v: any) => { floatingCollapseBoundsRefreshHandler = v; },
    getFloatingCollapseBoundsRaf: () => floatingCollapseBoundsRaf,
    setFloatingCollapseBoundsRaf: (v: any) => { floatingCollapseBoundsRaf = v; },
  });

  const setupFloatingCollapseBoundsListeners = createSetupFloatingCollapseBoundsListeners({
    clearFloatingCollapseBoundsListeners: (...a: any[]) => clearFloatingCollapseBoundsListeners(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    scheduleFloatingCollapseBoundsRefresh: (...a: any[]) => scheduleFloatingCollapseBoundsRefresh(...a),
    getFloatingCollapseBoundsListenerWindow: () => floatingCollapseBoundsListenerWindow,
    setFloatingCollapseBoundsListenerWindow: (v: any) => { floatingCollapseBoundsListenerWindow = v; },
    getFloatingCollapseBoundsRefreshHandler: () => floatingCollapseBoundsRefreshHandler,
    setFloatingCollapseBoundsRefreshHandler: (v: any) => { floatingCollapseBoundsRefreshHandler = v; },
  });

  const scheduleViewportBoundsRefresh = createScheduleViewportBoundsRefresh({
    getConfig: (...a: any[]) => getConfig(...a),
    updateViewportWrapperBounds: (...a: any[]) => updateViewportWrapperBounds(...a),
    getViewportBoundsRaf: () => viewportBoundsRaf,
    setViewportBoundsRaf: (v: any) => { viewportBoundsRaf = v; },
  });

  const clearViewportInputTargetListeners = createClearViewportInputTargetListeners({
    VIEWPORT_BOTTOM_REFRESH_EVENTS: VIEWPORT_BOTTOM_REFRESH_EVENTS,
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    getViewportInputObservedElements: () => viewportInputObservedElements,
    setViewportInputObservedElements: (v: any) => { viewportInputObservedElements = v; },
    getViewportInputResizeObserver: () => viewportInputResizeObserver,
    setViewportInputResizeObserver: (v: any) => { viewportInputResizeObserver = v; },
  });

  const refreshViewportInputTargetListeners = createRefreshViewportInputTargetListeners({
    clearViewportInputTargetListeners: (...a: any[]) => clearViewportInputTargetListeners(...a),
    getViewportBottomAnchorElements: (...a: any[]) => getViewportBottomAnchorElements(...a),
    VIEWPORT_BOTTOM_REFRESH_EVENTS: VIEWPORT_BOTTOM_REFRESH_EVENTS,
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    getViewportInputObservedElements: () => viewportInputObservedElements,
    setViewportInputObservedElements: (v: any) => { viewportInputObservedElements = v; },
    getViewportInputResizeObserver: () => viewportInputResizeObserver,
    setViewportInputResizeObserver: (v: any) => { viewportInputResizeObserver = v; },
  });

  const scheduleViewportInputTargetRefresh = createScheduleViewportInputTargetRefresh({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    refreshViewportInputTargetListeners: (...a: any[]) => refreshViewportInputTargetListeners(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    getViewportInputTargetsRaf: () => viewportInputTargetsRaf,
    setViewportInputTargetsRaf: (v: any) => { viewportInputTargetsRaf = v; },
  });

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

  const setupViewportInputMutationObserver = createSetupViewportInputMutationObserver({
    clearViewportInputMutationObserver: (...a: any[]) => clearViewportInputMutationObserver(...a),
    scheduleViewportInputTargetRefresh: (...a: any[]) => scheduleViewportInputTargetRefresh(...a),
    getViewportInputMutationDocument: () => viewportInputMutationDocument,
    setViewportInputMutationDocument: (v: any) => { viewportInputMutationDocument = v; },
    getViewportInputMutationObserver: () => viewportInputMutationObserver,
    setViewportInputMutationObserver: (v: any) => { viewportInputMutationObserver = v; },
    getViewportInputMutationWindow: () => viewportInputMutationWindow,
    setViewportInputMutationWindow: (v: any) => { viewportInputMutationWindow = v; },
  });

  const clearViewportBoundsListeners = createClearViewportBoundsListeners({
    clearViewportInputMutationObserver: (...a: any[]) => clearViewportInputMutationObserver(...a),
    clearViewportInputTargetListeners: (...a: any[]) => clearViewportInputTargetListeners(...a),
    getViewportBoundsListenerAttached: () => viewportBoundsListenerAttached,
    setViewportBoundsListenerAttached: (v: any) => { viewportBoundsListenerAttached = v; },
    getViewportBoundsListenerWindow: () => viewportBoundsListenerWindow,
    setViewportBoundsListenerWindow: (v: any) => { viewportBoundsListenerWindow = v; },
    getViewportBoundsRaf: () => viewportBoundsRaf,
    setViewportBoundsRaf: (v: any) => { viewportBoundsRaf = v; },
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    setViewportBoundsRefreshHandler: (v: any) => { viewportBoundsRefreshHandler = v; },
  });

  const setupViewportBoundsListeners = createSetupViewportBoundsListeners({
    clearViewportBoundsListeners: (...a: any[]) => clearViewportBoundsListeners(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    refreshViewportInputTargetListeners: (...a: any[]) => refreshViewportInputTargetListeners(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
    setupViewportInputMutationObserver: (...a: any[]) => setupViewportInputMutationObserver(...a),
    getViewportBoundsListenerWindow: () => viewportBoundsListenerWindow,
    setViewportBoundsListenerWindow: (v: any) => { viewportBoundsListenerWindow = v; },
    getViewportBoundsRefreshHandler: () => viewportBoundsRefreshHandler,
    setViewportBoundsRefreshHandler: (v: any) => { viewportBoundsRefreshHandler = v; },
    getViewportBoundsListenerAttached: () => viewportBoundsListenerAttached,
    setViewportBoundsListenerAttached: (v: any) => { viewportBoundsListenerAttached = v; },
  });

  const renderInterface = createRenderInterface({
    _renderInterfaceImpl: (...a: any[]) => _renderInterfaceImpl(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    getIsSettingsOpen: () => isSettingsOpen,
    getRenderInterfacePending: () => renderInterfacePending,
    setRenderInterfacePending: (v: any) => { renderInterfacePending = v; },
    getRenderInterfaceTimer: () => renderInterfaceTimer,
    setRenderInterfaceTimer: (v: any) => { renderInterfaceTimer = v; },
  });

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

  const getGlobalInteractionAvatarLookupNames = createGetGlobalInteractionAvatarLookupNames({
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionAvatar = createRenderGlobalInteractionAvatar({
    buildAvatarBackgroundStyle: (...a: any[]) => buildAvatarBackgroundStyle(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGlobalInteractionAvatarLookupNames: (...a: any[]) => getGlobalInteractionAvatarLookupNames(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    AvatarManager: AvatarManager,
  });

  const renderGlobalInteractionMapMark = createRenderGlobalInteractionMapMark({
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getIconForTableName: (...a: any[]) => getIconForTableName(...a),
    getLocationEmoji: (...a: any[]) => getLocationEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderIcon: (...a: any[]) => renderIcon(...a),
  });

  const renderGlobalInteractionGenericMark = createRenderGlobalInteractionGenericMark({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

  const renderGlobalInteractionItemMark = (
    rowTitle: string,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const displayName = replaceUserPlaceholders(rowTitle).trim();
    return `<div class="acu-global-interaction-generic-mark" title="${escapeHtml(displayName)}">${renderCustomTableNameIconContent(renderThemeIconContent(getElementEmoji(displayName, null)), customContext)}</div>`;
  };

  const renderGlobalInteractionRowCard = createRenderGlobalInteractionRowCard({
    createGlobalInteractionCustomTableNameIconContext: (...a: any[]) => createGlobalInteractionCustomTableNameIconContext(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    renderGlobalInteractionActionButton: (...a: any[]) => renderGlobalInteractionActionButton(...a),
    renderGlobalInteractionAvatar: (...a: any[]) => renderGlobalInteractionAvatar(...a),
    renderGlobalInteractionGenericMark: (...a: any[]) => renderGlobalInteractionGenericMark(...a),
    renderGlobalInteractionItemMark: (...a: any[]) => renderGlobalInteractionItemMark(...a),
    renderGlobalInteractionMapMark: (...a: any[]) => renderGlobalInteractionMapMark(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

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

  const renderGlobalInteractionsSection = createRenderGlobalInteractionsSection({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGlobalInteractionCollapsedSections: (...a: any[]) => getGlobalInteractionCollapsedSections(...a),
    renderGlobalInteractionsTableGroup: (...a: any[]) => renderGlobalInteractionsTableGroup(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

  const renderGlobalInteractionsPanel = createRenderGlobalInteractionsPanel({
    buildGlobalInteractionGroups: (...a: any[]) => buildGlobalInteractionGroups(...a),
    createGlobalInteractionSections: (...a: any[]) => createGlobalInteractionSections(...a),
    debugGlobalInteraction: (...a: any[]) => debugGlobalInteraction(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getTutorialButtonHtml: (...a: any[]) => getTutorialButtonHtml(...a),
    renderGlobalInteractionsSection: (...a: any[]) => renderGlobalInteractionsSection(...a),
  });

  const hydrateGlobalInteractionAvatars = createHydrateGlobalInteractionAvatars({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
    getCore: (...a: any[]) => getCore(...a),
    getGlobalInteractionAvatarLookupNames: (...a: any[]) => getGlobalInteractionAvatarLookupNames(...a),
    safeDecodeURIComponent: (...a: any[]) => safeDecodeURIComponent(...a),
    AvatarManager: AvatarManager,
  });

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
  const updateChangesCount = createUpdateChangesCount({
    countRuntimeDataChanges: (...a: any[]) => countRuntimeDataChanges(...a),
    getCore: (...a: any[]) => getCore(...a),
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    ValidationEngine: ValidationEngine,
  });
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
  const GACHA_SETTINGS_SORT_OPTIONS = createGachaSettingsSortOptions({

  });
  const INVENTORY_TYPE_FILTER_META: InventoryFilterButtonMeta<InventoryTypeFilter>[] = [
    { value: '全部', icon: 'fa-boxes-stacked', label: '全部类型' },
    { value: '消耗品', icon: 'fa-flask', label: '消耗品' },
    { value: '材料', icon: 'fa-hammer', label: '材料' },
    { value: '任务物品', icon: 'fa-scroll', label: '任务物品' },
    { value: '道具', icon: 'fa-cube', label: '道具' },
  ];
  const INVENTORY_QUALITY_FILTER_META = createInventoryQualityFilterMeta({

  });

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

  const normalizeGachaPoolDefinition = createNormalizeGachaPoolDefinition({
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
  });

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

  const saveGachaPoolSettings = createSaveGachaPoolSettings({
    cloneGachaPoolDefinitions: (...a: any[]) => cloneGachaPoolDefinitions(...a),
  });

  const sortGachaPoolDefinitions = (pools: GachaPoolDefinition[]): GachaPoolDefinition[] =>
    pools.sort((a, b) => {
      if (a.id === GACHA_ALL_POOL_TAG) return -1;
      if (b.id === GACHA_ALL_POOL_TAG) return 1;
      return (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name, 'zh-Hans-CN');
    });

  const getConfiguredGachaPoolDefinitions = createGetConfiguredGachaPoolDefinitions({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    getStoredGachaPoolSettings: (...a: any[]) => getStoredGachaPoolSettings(...a),
    sortGachaPoolDefinitions: (...a: any[]) => sortGachaPoolDefinitions(...a),
  });

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

  const getGachaPoolDefinitionsWithVirtualTags = createGetGachaPoolDefinitionsWithVirtualTags({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    cloneGachaPoolDefinitions: (...a: any[]) => cloneGachaPoolDefinitions(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    sortGachaPoolDefinitions: (...a: any[]) => sortGachaPoolDefinitions(...a),
  });

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

  const updateGachaPoolConfig = createUpdateGachaPoolConfig({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

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
  const GACHA_TARGET_COLUMN_KEYS = createGachaTargetColumnKeys({

  });
  const GACHA_TARGET_COLUMN_LABELS = createGachaTargetColumnLabels({

  });
  const GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS = createGachaCommonWrittenTargetColumnKeys({

  });
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

  const getGachaNamedCustomField = createGetGachaNamedCustomField({
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    normalizeGachaFieldAlias: (...a: any[]) => normalizeGachaFieldAlias(...a),
  });

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

  const renderGachaCustomFieldsPreviewHtml = createRenderGachaCustomFieldsPreviewHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
  });

  const renderGachaCustomFieldsDetailsHtml = createRenderGachaCustomFieldsDetailsHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
  });

  const getStoredGachaItemSettings = createGetStoredGachaItemSettings({
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const saveGachaItemSettingsRecord = createSaveGachaItemSettingsRecord({

  });

  const withGachaItemSettings = createWithGachaItemSettings({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

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

  const deleteGachaItemSetting = createDeleteGachaItemSetting({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
  });

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

  const migrateGachaCatalogRecordsToGlobalScope = createMigrateGachaCatalogRecordsToGlobalScope({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    mergeGachaCatalogRecordsToGlobalScope: (...a: any[]) => mergeGachaCatalogRecordsToGlobalScope(...a),
    normalizeScopedGachaCatalogRecord: (...a: any[]) => normalizeScopedGachaCatalogRecord(...a),
    GACHA_CATALOG_GLOBAL_SCOPE_KEY: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  });

  const getGachaItemDefinitionFingerprint = createGetGachaItemDefinitionFingerprint({

  });

  const getStoredGachaCatalog = (_rawData, createIfMissing = false): GachaCatalog | null => {
    const scopeKey = getGachaCatalogScopeKey();
    if (gachaCatalogCache?.scopeKey === scopeKey) return gachaCatalogCache.catalog;
    return createIfMissing ? createEmptyGachaCatalog() : null;
  };

  const saveStoredGachaCatalog = createSaveStoredGachaCatalog({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    getGachaCatalogScopeKey: (...a: any[]) => getGachaCatalogScopeKey(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
  });

  const ensureGachaCatalogLoaded = createEnsureGachaCatalogLoaded({
    getGachaCatalogScopeKey: (...a: any[]) => getGachaCatalogScopeKey(...a),
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
    setGachaCatalogCache: (v: any) => { gachaCatalogCache = v; },
    getGachaCatalogLoadTask: () => gachaCatalogLoadTask,
    setGachaCatalogLoadTask: (v: any) => { gachaCatalogLoadTask = v; },
  });

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

  const hashGachaCatalogSeed = createHashGachaCatalogSeed({

  });

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

  const normalizeImportedGachaPoolTags = createNormalizeImportedGachaPoolTags({
    getGachaAllExpandablePoolTags: (...a: any[]) => getGachaAllExpandablePoolTags(...a),
  });

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

  const analyzeGachaCatalogImport = createAnalyzeGachaCatalogImport({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    normalizeImportedGachaItem: (...a: any[]) => normalizeImportedGachaItem(...a),
    normalizeImportedGachaPools: (...a: any[]) => normalizeImportedGachaPools(...a),
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
  });

  const formatGachaCatalogImportErrors = (errors: readonly string[], limit = 6): string => {
    if (!errors.length) return '';
    const visibleErrors = errors.slice(0, limit).join('；');
    return errors.length > limit ? `${visibleErrors}；还有 ${errors.length - limit} 项错误未显示` : visibleErrors;
  };

  const getGachaCatalogImportFailureMessage = createGetGachaCatalogImportFailureMessage({
    formatGachaCatalogImportErrors: (...a: any[]) => formatGachaCatalogImportErrors(...a),
  });

  const validateGachaCatalogImportItemTarget = createValidateGachaCatalogImportItemTarget({
    applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    setEquipmentRowBasicFields: (...a: any[]) => setEquipmentRowBasicFields(...a),
    setInventoryRowBasicFields: (...a: any[]) => setInventoryRowBasicFields(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
  });

  const mergeImportedGachaPools = createMergeImportedGachaPools({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

  const collectGachaLocalStorageSnapshot = (keys: readonly string[]): Map<string, string | null> => {
    const snapshot = new Map<string, string | null>();
    keys.forEach(key => snapshot.set(key, localStorage.getItem(key)));
    return snapshot;
  };

  const restoreGachaLocalStorageSnapshot = createRestoreGachaLocalStorageSnapshot({

  });

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

  const clearGlobalGachaCatalog = createClearGlobalGachaCatalog({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    collectGachaLocalStorageSnapshot: (...a: any[]) => collectGachaLocalStorageSnapshot(...a),
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    restoreGachaLocalStorageSnapshot: (...a: any[]) => restoreGachaLocalStorageSnapshot(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

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

  const serializeGachaCatalogItemForExport = createSerializeGachaCatalogItemForExport({
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    normalizeGachaCustomFields: (...a: any[]) => normalizeGachaCustomFields(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
  });

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

  const getGachaCatalogItemsForExport = createGetGachaCatalogItemsForExport({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getGachaAllExpandablePoolTags: (...a: any[]) => getGachaAllExpandablePoolTags(...a),
  });

  const exportGachaCatalogJson = createExportGachaCatalogJson({
    buildGachaCatalogTemplateJsonc: (...a: any[]) => buildGachaCatalogTemplateJsonc(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
    serializeGachaCatalogItemForExport: (...a: any[]) => serializeGachaCatalogItemForExport(...a),
    serializeGachaPoolDefinitionForExport: (...a: any[]) => serializeGachaPoolDefinitionForExport(...a),
  });

  const downloadGachaCatalogJson = createDownloadGachaCatalogJson({
    buildGachaExportNamePart: (...a: any[]) => buildGachaExportNamePart(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
    downloadJsoncFile: (...a: any[]) => downloadJsoncFile(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    exportGachaCatalogJson: (...a: any[]) => exportGachaCatalogJson(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

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

  const importGachaCatalogJsonFromFile = createImportGachaCatalogJsonFromFile({
    analyzeGachaCatalogImport: (...a: any[]) => analyzeGachaCatalogImport(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getGachaCatalogImportFailureMessage: (...a: any[]) => getGachaCatalogImportFailureMessage(...a),
    getJsonLikeErrorMessage: (...a: any[]) => getJsonLikeErrorMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    pickTextFile: (...a: any[]) => pickTextFile(...a),
    showGachaCatalogImportConfirm: (...a: any[]) => showGachaCatalogImportConfirm(...a),
  });

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

  const touchGachaActivity = createTouchGachaActivity({
    getGachaState: (...a: any[]) => getGachaState(...a),
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt,
  });

  const recordGachaFortuneGain = (state: GachaState, gain: number, reason: string, detail: string) => {
    if (gain <= 0) return;
    state.inputStats.lastFortuneGain = gain;
    state.inputStats.lastFortuneReason = reason;
    state.inputStats.lastFortuneDetail = detail;
    state.inputStats.lastFortuneAt = Date.now();
  };

  const getObjectRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  const buildGachaDiceEventSettlementKey = createBuildGachaDiceEventSettlementKey({
    getObjectRecord: (...a: any[]) => getObjectRecord(...a),
  });

  const getGachaDiceEventDetail = createGetGachaDiceEventDetail({
    getObjectRecord: (...a: any[]) => getObjectRecord(...a),
  });

  const settleGachaFortuneForDiceEvent = createSettleGachaFortuneForDiceEvent({
    buildGachaDiceEventSettlementKey: (...a: any[]) => buildGachaDiceEventSettlementKey(...a),
    getGachaDiceEventDetail: (...a: any[]) => getGachaDiceEventDetail(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const persistRawDataWithGacha = createPersistRawDataWithGacha({
    assertSaveStoredGachaStateSnapshot: (...a: any[]) => assertSaveStoredGachaStateSnapshot(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
  });

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

  const hasGachaRewardTableForItem = createHasGachaRewardTableForItem({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
  });

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

  const getGachaChatIdSeed = createGetGachaChatIdSeed({

  });

  const getGachaLocalDateKey = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  };

  const hashGachaSeed = createHashGachaSeed({

  });

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

  const getGachaPickupItems = createGetGachaPickupItems({
    getGachaPickupRotationKey: (...a: any[]) => getGachaPickupRotationKey(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    hashGachaSeed: (...a: any[]) => hashGachaSeed(...a),
    getGachaPickupItemsCache: () => gachaPickupItemsCache,
    setGachaPickupItemsCache: (v: any) => { gachaPickupItemsCache = v; },
  });

  const isGachaPickupItem = (poolTag: GachaPoolTag, item: GachaItemDefinition): boolean =>
    getGachaPickupItems(poolTag).some(pickup => pickup.id === item.id);

  const pickGachaRarity = createPickGachaRarity({
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    pickWeightedValue: (...a: any[]) => pickWeightedValue(...a),
  });

  const pickGachaItemDefinition = createPickGachaItemDefinition({
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaPickupItem: (...a: any[]) => isGachaPickupItem(...a),
    pickWeightedValue: (...a: any[]) => pickWeightedValue(...a),
  });

  const getInventoryDefaultMetaRecord = createGetInventoryDefaultMetaRecord({
    getInventoryGlobalContext: (...a: any[]) => getInventoryGlobalContext(...a),
  });

  const buildGachaInventoryMetaRecord = createBuildGachaInventoryMetaRecord({
    getInventoryDefaultMetaRecord: (...a: any[]) => getInventoryDefaultMetaRecord(...a),
    getInventoryMetadataForItem: (...a: any[]) => getInventoryMetadataForItem(...a),
  });

  const setInventoryRowBasicFields = createSetInventoryRowBasicFields({
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
  });

  const resolveEquipmentTableTypeForGachaItem = createResolveEquipmentTableTypeForGachaItem({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    inferEquipmentTableTypeForGachaItem: (...a: any[]) => inferEquipmentTableTypeForGachaItem(...a),
  });

  const setEquipmentRowBasicFields = createSetEquipmentRowBasicFields({
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
    resolveEquipmentTableTypeForGachaItem: (...a: any[]) => resolveEquipmentTableTypeForGachaItem(...a),
  });

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

  const applyGachaCustomFieldsToRow = createApplyGachaCustomFieldsToRow({
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaReservedCustomFieldHeaders: (...a: any[]) => getGachaReservedCustomFieldHeaders(...a),
    hasGachaCustomFields: (...a: any[]) => hasGachaCustomFields(...a),
  });

  const validateGachaCustomFieldsForTargetTable = createValidateGachaCustomFieldsForTargetTable({
    buildCrudRequiredHeaderSet: (...a: any[]) => buildCrudRequiredHeaderSet(...a),
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    getGachaReservedCustomFieldHeaders: (...a: any[]) => getGachaReservedCustomFieldHeaders(...a),
    hasGachaCustomFields: (...a: any[]) => hasGachaCustomFields(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const validateGachaCustomFieldsForExistingRow = createValidateGachaCustomFieldsForExistingRow({
    buildGachaCustomFieldHeaderMap: (...a: any[]) => buildGachaCustomFieldHeaderMap(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const getGachaItemGrantQuantity = (item: Pick<GachaItemDefinition, 'grantQuantity'>): number =>
    Math.max(1, Math.floor(Number(item.grantQuantity) || 1));

  const findGachaDefinitionByItemId = createFindGachaDefinitionByItemId({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

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

  const renderGachaPickupHtml = createRenderGachaPickupHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    formatGachaItemCardMeta: (...a: any[]) => formatGachaItemCardMeta(...a),
    getGachaItemCustomTableNameIconContext: (...a: any[]) => getGachaItemCustomTableNameIconContext(...a),
    getGachaItemDescriptionText: (...a: any[]) => getGachaItemDescriptionText(...a),
    getGachaItemEffectText: (...a: any[]) => getGachaItemEffectText(...a),
    getGachaPickupItems: (...a: any[]) => getGachaPickupItems(...a),
    renderGachaCustomFieldsPreviewHtml: (...a: any[]) => renderGachaCustomFieldsPreviewHtml(...a),
    renderGachaItemIconContent: (...a: any[]) => renderGachaItemIconContent(...a),
  });

  const formatGachaDuration = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatGachaRelativeTime = createFormatGachaRelativeTime({

  });

  const getGachaFortuneProgressView = createGetGachaFortuneProgressView({
    formatGachaDuration: (...a: any[]) => formatGachaDuration(...a),
    formatGachaRelativeTime: (...a: any[]) => formatGachaRelativeTime(...a),
  });

  const renderGachaFortuneProgressHtml = createRenderGachaFortuneProgressHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
  });

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

  const updateGachaFortuneProgressDom = createUpdateGachaFortuneProgressDom({
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
  });

  const updateGachaShopProgressUi = (): boolean => {
    if (!getGachaShopProgressContainers().length) return false;
    const state = getGachaState(undefined, true);
    if (!state) return false;
    return updateGachaFortuneProgressDom(state, true);
  };

  const clearGachaFortune = createClearGachaFortune({
    assertSaveStoredGachaStateSnapshot: (...a: any[]) => assertSaveStoredGachaStateSnapshot(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
  });

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

  const refreshGachaPoolSelectionUi = createRefreshGachaPoolSelectionUi({
    getCore: (...a: any[]) => getCore(...a),
    renderGachaPickupHtml: (...a: any[]) => renderGachaPickupHtml(...a),
  });

  const updateGachaPoolTag = createUpdateGachaPoolTag({
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    refreshGachaPoolSelectionUi: (...a: any[]) => refreshGachaPoolSelectionUi(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    saveStoredGachaActivePoolTag: (...a: any[]) => saveStoredGachaActivePoolTag(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
  });

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

  const renderGachaSettingsPoolTabsHtml = createRenderGachaSettingsPoolTabsHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
  });

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

  const getGachaSettingsFilterLabel = createGetGachaSettingsFilterLabel({
    getGACHA_SETTINGS_SORT_OPTIONS: () => GACHA_SETTINGS_SORT_OPTIONS,
    getGACHA_SETTINGS_SOURCE_FILTER_OPTIONS: () => GACHA_SETTINGS_SOURCE_FILTER_OPTIONS,
    getGACHA_SETTINGS_STATUS_FILTER_OPTIONS: () => GACHA_SETTINGS_STATUS_FILTER_OPTIONS,
  });

  const renderGachaSettingsFilterMenuHtml = createRenderGachaSettingsFilterMenuHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),

  });

  const renderGachaPoolSettingsListHtml = createRenderGachaPoolSettingsListHtml({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
  });

  const renderGachaSettingsPoolViewerHtml = createRenderGachaSettingsPoolViewerHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getGachaSettingsPoolItems: (...a: any[]) => getGachaSettingsPoolItems(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
    renderGachaSettingsFilterMenuHtml: (...a: any[]) => renderGachaSettingsFilterMenuHtml(...a),
    renderGachaSettingsPoolItemsHtml: (...a: any[]) => renderGachaSettingsPoolItemsHtml(...a),
    renderGachaSettingsPoolTabsHtml: (...a: any[]) => renderGachaSettingsPoolTabsHtml(...a),
    DEFAULT_GACHA_SETTINGS_ITEM_FILTERS: DEFAULT_GACHA_SETTINGS_ITEM_FILTERS,
    GACHA_SETTINGS_SORT_OPTIONS: GACHA_SETTINGS_SORT_OPTIONS,
    GACHA_SETTINGS_SOURCE_FILTER_OPTIONS: GACHA_SETTINGS_SOURCE_FILTER_OPTIONS,
    GACHA_SETTINGS_STATUS_FILTER_OPTIONS: GACHA_SETTINGS_STATUS_FILTER_OPTIONS,
  });

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

  const getGachaChatMessageText = createGetGachaChatMessageText({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    normalizeGachaMessageId: (...a: any[]) => normalizeGachaMessageId(...a),
  });

  const buildGachaSettlementKey = (messageId: string, messageText: string): string => {
    if (messageId) return `id:${messageId}`;
    const normalizedText = stripSystemInjectedContent(messageText);
    if (!normalizedText) return `empty:${Math.floor(Date.now() / 2000)}`;
    return `text:${countUnicodeCharacters(normalizedText)}:${normalizedText.slice(0, 80)}:${normalizedText.slice(-80)}`;
  };

  const settleGachaFortuneForMessage = createSettleGachaFortuneForMessage({
    buildGachaSettlementKey: (...a: any[]) => buildGachaSettlementKey(...a),
    consumePendingHumanInputSnapshot: (...a: any[]) => consumePendingHumanInputSnapshot(...a),
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    getGachaChatMessageText: (...a: any[]) => getGachaChatMessageText(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    normalizeGachaMessageId: (...a: any[]) => normalizeGachaMessageId(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const flushGachaHeartbeatProgress = createFlushGachaHeartbeatProgress({
    getGachaState: (...a: any[]) => getGachaState(...a),
    recordGachaFortuneGain: (...a: any[]) => recordGachaFortuneGain(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
    updateGachaFortuneProgressDom: (...a: any[]) => updateGachaFortuneProgressDom(...a),
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt,
  });

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

  const getLegacyInventoryMetadataRoot = createGetLegacyInventoryMetadataRoot({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
  });

  const saveInventoryMetadataRoot = (root: InventoryMetadataRoot) => {
    const store = getInventoryMetadataStore();
    store[getInventoryMetadataContextKey()] = root;
    saveInventoryMetadataStore(store);
  };

  const getInventoryMetadataRoot = createGetInventoryMetadataRoot({
    getInventoryMetadataContextKey: (...a: any[]) => getInventoryMetadataContextKey(...a),
    getInventoryMetadataStore: (...a: any[]) => getInventoryMetadataStore(...a),
    getLegacyInventoryMetadataRoot: (...a: any[]) => getLegacyInventoryMetadataRoot(...a),
    saveInventoryMetadataStore: (...a: any[]) => saveInventoryMetadataStore(...a),
  });

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

  const setInventoryMetadataForItem = createSetInventoryMetadataForItem({
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
    saveInventoryMetadataRoot: (...a: any[]) => saveInventoryMetadataRoot(...a),
  });

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

  const syncInventoryMetadataForRawData = createSyncInventoryMetadataForRawData({
    getInventoryGlobalContext: (...a: any[]) => getInventoryGlobalContext(...a),
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
    getInventoryResult: (...a: any[]) => getInventoryResult(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    saveInventoryMetadataRoot: (...a: any[]) => saveInventoryMetadataRoot(...a),
  });

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

  const buildGachaTableResultFromSheet = createBuildGachaTableResultFromSheet({
    GACHA_CATALOG_RAW_ROW_INDEX_PROP: GACHA_CATALOG_RAW_ROW_INDEX_PROP,
  });

  const resolveGachaTargetTableOverride = createResolveGachaTargetTableOverride({
    buildGachaTableResultFromSheet: (...a: any[]) => buildGachaTableResultFromSheet(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getGachaRewardTargetModuleKey: (...a: any[]) => getGachaRewardTargetModuleKey(...a),
    getGachaRewardTargetModuleName: (...a: any[]) => getGachaRewardTargetModuleName(...a),
    getGachaTargetTableMatches: (...a: any[]) => getGachaTargetTableMatches(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const findGachaTargetColumnIndex = createFindGachaTargetColumnIndex({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    isGachaTargetTableAliasMatch: (...a: any[]) => isGachaTargetTableAliasMatch(...a),
  });

  const applyGachaTargetColumnOverrides = createApplyGachaTargetColumnOverrides({
    findGachaTargetColumnIndex: (...a: any[]) => findGachaTargetColumnIndex(...a),
    getGachaTargetColumnEntries: (...a: any[]) => getGachaTargetColumnEntries(...a),
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const assertGachaRewardNameColumn = createAssertGachaRewardNameColumn({
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

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

  const getInventoryColumnMap = createGetInventoryColumnMap({
    applyGachaTargetColumnOverrides: (...a: any[]) => applyGachaTargetColumnOverrides(...a),
    findGachaColumnByKeywords: (...a: any[]) => findGachaColumnByKeywords(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    DashboardDataParser: DashboardDataParser,
  });

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

  const getEquipmentColumnMap = createGetEquipmentColumnMap({
    applyGachaTargetColumnOverrides: (...a: any[]) => applyGachaTargetColumnOverrides(...a),
    findGachaColumnByKeywords: (...a: any[]) => findGachaColumnByKeywords(...a),
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    DashboardDataParser: DashboardDataParser,
  });

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

  const isGachaItemOwned = createIsGachaItemOwned({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
  });

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

  const bindGachaShardShopInteractions = createBindGachaShardShopInteractions({
    showGachaPickupItemDetail: (...a: any[]) => showGachaPickupItemDetail(...a),
    showGachaShardExchangeConfirm: (...a: any[]) => showGachaShardExchangeConfirm(...a),
  });

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

  const getInventoryCharacters = createGetInventoryCharacters({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const renderInventoryFilterButtons = createRenderInventoryFilterButtons({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getInventoryActiveFilterCount = (filters: InventoryFilterState) => {
    let count = 0;
    if (filters.type !== '全部') count += 1;
    if (filters.quality !== '全部') count += 1;
    if (filters.sort !== 'default') count += 1;
    return count;
  };

  const closeGachaVisualization = createCloseGachaVisualization({
    getGachaShopRootElement: () => gachaShopRootElement,
    setGachaShopRootElement: (v: any) => { gachaShopRootElement = v; },
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer = v; },
  });

  const refreshGachaVisualization = createRefreshGachaVisualization({
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaPanelHtml: (...a: any[]) => renderGachaPanelHtml(...a),
    updateGachaShopProgressUi: (...a: any[]) => updateGachaShopProgressUi(...a),
    gachaShopRootElement: gachaShopRootElement,
    getCachedRawData: () => cachedRawData,
  });

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

  const refreshInventoryVisualization = createRefreshInventoryVisualization({
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderInventoryVisualization: (...a: any[]) => renderInventoryVisualization(...a),
    getCachedRawData: () => cachedRawData,
  });

  const showInventoryVisualization = createShowInventoryVisualization({
    closeGachaVisualization: (...a: any[]) => closeGachaVisualization(...a),
    closeInventoryVisualization: (...a: any[]) => closeInventoryVisualization(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderInventoryVisualization: (...a: any[]) => renderInventoryVisualization(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
    getCachedRawData: () => cachedRawData,
  });

  const findInventoryItemByRow = rowIndex => {
    const rawData = cachedRawData || getTableData();
    const parsed = parseInventoryItems(rawData);
    return parsed.items.find(item => item.rowIndex === rowIndex) || null;
  };

  const getInventoryDetailContext = createGetInventoryDetailContext({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    getCachedRawData: () => cachedRawData,
  });

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

  const getInventoryEnumOptions = createGetInventoryEnumOptions({
    INVENTORY_TYPE_OPTIONS: INVENTORY_TYPE_OPTIONS,
    ValidationRuleManager: ValidationRuleManager,
  });

  const reopenInventoryItemDetail = (rowIndex: number) => {
    $('.acu-inventory-detail-overlay').remove();
    showInventoryItemDetail(rowIndex);
  };

  const saveInventoryMetadataRecord = createSaveInventoryMetadataRecord({
    getInventoryDetailContext: (...a: any[]) => getInventoryDetailContext(...a),
    reopenInventoryItemDetail: (...a: any[]) => reopenInventoryItemDetail(...a),
    setInventoryMetadataForItem: (...a: any[]) => setInventoryMetadataForItem(...a),
  });

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

  const renderInventoryMetadataHtml = createRenderInventoryMetadataHtml({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

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
  const saveCurrentTabState = createSaveCurrentTabState({
    getActiveTabState: (...a: any[]) => getActiveTabState(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableScrollStates: () => tableScrollStates,
  });

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

  const getPanelHostMessage = createGetPanelHostMessage({
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getLatestAssistantMessageElement: (...a: any[]) => getLatestAssistantMessageElement(...a),
  });

  const syncHostRegenerateButtonVisibility = createSyncHostRegenerateButtonVisibility({
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    getPanelHostMessage: (...a: any[]) => getPanelHostMessage(...a),
  });

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

  const closePanel = createClosePanel({
    cleanupGlobalInteractionFloatingMenus: (...a: any[]) => cleanupGlobalInteractionFloatingMenus(...a),
    getCore: (...a: any[]) => getCore(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    saveActiveTabState: (...a: any[]) => saveActiveTabState(...a),
    saveCurrentTabState: (...a: any[]) => saveCurrentTabState(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
  });

  const resolveExistingTableName = createResolveExistingTableName({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData,
  });

  const warnMissingTableTarget = (tableNameValue: unknown) => {
    const tableName = String(tableNameValue ?? '');
    warnTableTemplateIssue(tableName ? `未找到表格「${tableName}」` : '无法定位目标表格');
  };

  const setActiveTableNavButton = createSetActiveTableNavButton({
    getCore: (...a: any[]) => getCore(...a),
  });

  /**
   * 面板切换工具函数 - 快速更新面板内容（无过渡延迟）
   * 由于CSS已改为 opacity + visibility 过渡，即使快速更新也不会闪烁
   * @param {Function} updateContentFn - 更新面板内容的函数，接收 $panel 参数
   */
  const switchPanel = createSwitchPanel({
    applyStoredPanelHeight: (...a: any[]) => applyStoredPanelHeight(...a),
    ensurePanelNavigationVisible: (...a: any[]) => ensurePanelNavigationVisible(...a),
    getDataAreaForRoot: (...a: any[]) => getDataAreaForRoot(...a),
    syncHostRegenerateButtonVisibility: (...a: any[]) => syncHostRegenerateButtonVisibility(...a),
  });

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

  const showEditDialog = createShowEditDialog({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    getCore: (...a: any[]) => getCore(...a),
    setupOverlayClose: (...a: any[]) => setupOverlayClose(...a),
  });

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

  const serializeAcuDiceGachaPool = createSerializeAcuDiceGachaPool({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
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

  const serializeAcuDiceGachaDrawResult = createSerializeAcuDiceGachaDrawResult({
    buildAcuDiceGachaStateSnapshot: (...a: any[]) => buildAcuDiceGachaStateSnapshot(...a),
    performGachaDraw: (...a: any[]) => performGachaDraw(...a),
    serializeAcuDiceGachaDrawOutcome: (...a: any[]) => serializeAcuDiceGachaDrawOutcome(...a),
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

  const importAcuDiceGachaCatalog = createImportAcuDiceGachaCatalog({
    analyzeGachaCatalogImport: (...a: any[]) => analyzeGachaCatalogImport(...a),
    applyGachaCatalogImport: (...a: any[]) => applyGachaCatalogImport(...a),
    cloneAcuDiceApiValue: (...a: any[]) => cloneAcuDiceApiValue(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    formatGachaCatalogImportStatsText: (...a: any[]) => formatGachaCatalogImportStatsText(...a),
    getGachaCatalogImportFailureMessage: (...a: any[]) => getGachaCatalogImportFailureMessage(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    normalizeAcuDiceGachaImportMode: (...a: any[]) => normalizeAcuDiceGachaImportMode(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
    stringifyAcuDiceGachaCatalogInput: (...a: any[]) => stringifyAcuDiceGachaCatalogInput(...a),
  });

  const upsertAcuDiceGachaPool = createUpsertAcuDiceGachaPool({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
    serializeAcuDiceGachaPool: (...a: any[]) => serializeAcuDiceGachaPool(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const removeAcuDiceGachaCustomItem = createRemoveAcuDiceGachaCustomItem({
    deleteGachaItemSetting: (...a: any[]) => deleteGachaItemSetting(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    saveStoredGachaCatalog: (...a: any[]) => saveStoredGachaCatalog(...a),
    serializeAcuDiceGachaItem: (...a: any[]) => serializeAcuDiceGachaItem(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

  const removeAcuDiceGachaCustomPool = createRemoveAcuDiceGachaCustomPool({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
    deleteGachaPoolConfig: (...a: any[]) => deleteGachaPoolConfig(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    refreshGachaShardShop: (...a: any[]) => refreshGachaShardShop(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSettingsDialog: (...a: any[]) => showGachaSettingsDialog(...a),
  });

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
