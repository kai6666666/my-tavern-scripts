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
import { createCreateDefaultGachaState } from './features/gacha/create-default-gacha-state';
import { createNormalizeShardWallet } from './features/gacha/normalize-shard-wallet';
import { createNormalizeRecentGachaRewards } from './features/gacha/normalize-recent-gacha-rewards';
import { createGetGachaStateStorageKey } from './features/gacha/get-gacha-state-storage-key';
import { createGetGachaStateMigrationKey } from './features/gacha/get-gacha-state-migration-key';
import { createHasMigratedLegacyGachaState } from './features/gacha/has-migrated-legacy-gacha-state';
import { createMarkLegacyGachaStateMigrated } from './features/gacha/mark-legacy-gacha-state-migrated';
import { createGetStoredGachaStateSnapshot } from './features/gacha/get-stored-gacha-state-snapshot';
import { createAssertSaveStoredGachaStateSnapshot } from './features/gacha/assert-save-stored-gacha-state-snapshot';
import { createNormalizeGachaStateRecord } from './features/gacha/normalize-gacha-state-record';
import { createGetGachaShardLabel } from './features/gacha/get-gacha-shard-label';
import { createNormalizeImageUrlInput } from './features/ui/normalize-image-url-input';
import { createIsRemoteImageUrlValid } from './features/ui/is-remote-image-url-valid';
import { createCreateMetaCheckResultRegex } from './features/regex/create-meta-check-result-regex';
import { createCreateDiceResultPlaceholderRegex } from './features/regex/create-dice-result-placeholder-regex';
import { createCountUnicodeCharacters } from './shared/count-unicode-characters';
import { createRefreshDialogueIndentRender } from './features/ui/refresh-dialogue-indent-render';
import { createGetDiceConfig } from './features/dice/get-dice-config';
import { createParseAdvancedPresetJsonCandidate } from './features/presets/parse-advanced-preset-json-candidate';
import { createBuildDashboardPresetAgentPrompt } from './features/presets/build-dashboard-preset-agent-prompt';
import { createBuildActionPresetAgentPrompt } from './features/presets/build-action-preset-agent-prompt';
import { createBuildRenderPresetAgentPrompt } from './features/presets/build-render-preset-agent-prompt';
import { createBuildTableTemplateRequirementPresetAgentPrompt } from './features/presets/build-table-template-requirement-preset-agent-prompt';
import { createBuildGachaCatalogAgentPrompt } from './features/presets/build-gacha-catalog-agent-prompt';
import { createParseJsoncValue } from './shared/parse-jsonc-value';
import { createNormalizeInteractionLabel } from './features/table/normalize-interaction-label';
import { createGetPendingDeletions } from './features/table/get-pending-deletions';
import { createGetTavernHostDocument } from './features/ui/get-tavern-host-document';
import { createNormalizeCustomTableNameIconKeyPart } from './features/table/normalize-custom-table-name-icon-key-part';
import { createGetActiveTabState } from './features/table/get-active-tab-state';
import { createGetSavedTableOrder } from './features/table/get-saved-table-order';
import { createGetCollapsedState } from './features/table/get-collapsed-state';
import { createGetOptionsCollapsedState } from './features/table/get-options-collapsed-state';
import { createGetTableHeights } from './features/table/get-table-heights';
import { createGetTableStyles } from './features/table/get-table-styles';
import { createGetHiddenTables } from './features/table/get-hidden-tables';
import { createGetReverseTables } from './features/table/get-reverse-tables';
import { createGetNormalizedReverseTables } from './features/table/get-normalized-reverse-tables';
import { createFormatSignedModifier } from './features/dice/format-signed-modifier';
import { createGetDiceProfileSillyTavern } from './features/profiles/get-dice-profile-silly-tavern';
import { createIsTutorialScope } from './features/tutorial/is-tutorial-scope';
import { createNormalizeDiffRow } from './features/table/normalize-diff-row';
import { createGetDiffHeaders } from './features/table/get-diff-headers';
import { createGetDiffRows } from './features/table/get-diff-rows';
import { createBuildCheckSuggestionMetaBlock } from './features/dice/build-check-suggestion-meta-block';
import { createGetInventoryFiltersCollapsedState } from './features/gacha/get-inventory-filters-collapsed-state';
import { createGetRuntimeGachaRawData } from './features/gacha/get-runtime-gacha-raw-data';
import { createGetGachaCatalogScopeKey } from './features/gacha/get-gacha-catalog-scope-key';
import { createBuildAdvancedPresetAgentPrompt } from './features/presets/build-advanced-preset-agent-prompt';
import { createNormalizeGachaItemEnabled } from './features/gacha/normalize-gacha-item-enabled';
import { createNormalizeGachaFieldAlias } from './features/gacha/normalize-gacha-field-alias';
import { createHasDatabaseNewUiRuntime } from './features/table/has-database-new-ui-runtime';
import { createCrudSqlIdentifierPattern } from './features/table/crud-sql-identifier-pattern';
import { createNormalizeCrudHeaderLookupKey } from './features/table/normalize-crud-header-lookup-key';
import { createFindDatabaseNewUiManualUpdateButton } from './features/table/find-database-new-ui-manual-update-button';
import { createGetCustomTableNameIconLocalFileValidationError } from './features/table/get-custom-table-name-icon-local-file-validation-error';
import { createSanitizeDiceConfigBackupPresetRules } from './features/dice/sanitize-dice-config-backup-preset-rules';
import { createResolveQuickSelectTarget } from './features/dice/resolve-quick-select-target';
import { createResolveIsolationKey } from './features/table/resolve-isolation-key';
import { createRenderIcon } from './features/ui/render-icon';
import { createRenderGlobalInteractionsTableGroup } from './features/table/render-global-interactions-table-group';
import { createRenderGlobalInteractionActionButton } from './features/table/render-global-interaction-action-button';
import { createPrepareInventoryTutorial } from './features/gacha/prepare-inventory-tutorial';
import { createPickWeightedValue } from './features/gacha/pick-weighted-value';
import { createPerformSaveDataOnly } from './features/table/perform-save-data-only';
import { createParseTableTemplateRequirementPresetJson } from './features/presets/parse-table-template-requirement-preset-json';
import { createParseJsoncRecord } from './shared/parse-jsonc-record';
import { createOpenDatabaseNewUiViaMenuEntry } from './features/table/open-database-new-ui-via-menu-entry';
import { createNormalizeScopedGachaCatalogRecord } from './features/gacha/normalize-scoped-gacha-catalog-record';
import { createNormalizeRenderPresetStringList } from './features/presets/normalize-render-preset-string-list';
import { createNormalizeGachaTargetColumns } from './features/gacha/normalize-gacha-target-columns';
import { createNormalizeGachaCatalogRecord } from './features/gacha/normalize-gacha-catalog-record';
import { createHasDbPayload } from './features/table/has-db-payload';
import { createGetTutorialModule } from './features/tutorial/get-tutorial-module';
import { createGetStoredGachaPoolSettings } from './features/gacha/get-stored-gacha-pool-settings';
import { createGetResultBadgeClass } from './features/dice/get-result-badge-class';
import { createGetInventoryFieldLabel } from './features/gacha/get-inventory-field-label';
import { createGetGachaPickupRotationKey } from './features/gacha/get-gacha-pickup-rotation-key';
import { createGetElementEmoji } from './features/dice/get-element-emoji';
import { createGetDiceConfigBackupBuiltinPresetIds } from './features/dice/get-dice-config-backup-builtin-preset-ids';
import { createGetDashboardModuleKeysForTableName } from './features/dashboard/get-dashboard-module-keys-for-table-name';
import { createGetCrudChangedColumns } from './features/table/get-crud-changed-columns';
import { createGetAvatarFallbackColor } from './features/avatars/get-avatar-fallback-color';
import { createFormatGachaRewardDestinationLabel } from './features/gacha/format-gacha-reward-destination-label';
import { createDownloadCustomTableNameIconPack } from './features/table/download-custom-table-name-icon-pack';
import { createCreateSheetDataFingerprint } from './features/table/create-sheet-data-fingerprint';
import { createCopyDiceConfigBackupExistingFields } from './features/dice/copy-dice-config-backup-existing-fields';
import { createClearTextareaDiceCache } from './features/textarea/clear-textarea-dice-cache';
import { createBuildGachaCustomFieldHeaderMap } from './features/gacha/build-gacha-custom-field-header-map';
import { createBuildDiceConfigBackupRuleOverrideMap } from './features/dice/build-dice-config-backup-rule-override-map';
import { createAcuDiceProfilesInstance } from './features/api/acu-dice-profiles-instance';
import { createAcuDiceCheckInstance } from './features/api/acu-dice-check-instance';
import { createGachaCustomFieldReservedKeys } from './features/gacha/gacha-custom-field-reserved-keys';
import { createFontsList } from './features/ui/fonts-list';
import { createCustomTableNameIconDeniedTableNames } from './features/table/custom-table-name-icon-denied-table-names';
import { createEnsurePanelNavigationVisible } from './features/ui/ensure-panel-navigation-visible';
import { createUpdateGachaItemSetting } from './features/gacha/update-gacha-item-setting';
import { createSyncAttributeRuleTagsInTemplate } from './features/dice/sync-attribute-rule-tags-in-template';
import { createStripSystemInjectedContent } from './features/human-input/strip-system-injected-content';
import { createSanitizeDiceConfigBackupStoredValue } from './features/dice/sanitize-dice-config-backup-stored-value';
import { createSanitizeDiceConfigBackupRegexRule } from './features/dice/sanitize-dice-config-backup-regex-rule';
import { createRunInSaveQueue } from './features/table/run-in-save-queue';
import { createRunDatabaseManualUpdateViaLegacyButton } from './features/table/run-database-manual-update-via-legacy-button';
import { createRestoreMutableRuntimeValue } from './features/table/restore-mutable-runtime-value';
import { createResolveDashboardCustomTableNameIconRowName } from './features/dashboard/resolve-dashboard-custom-table-name-icon-row-name';
import { createRefreshGachaShardShop } from './features/gacha/refresh-gacha-shard-shop';
import { createRefreshChangesPanel } from './features/changes/refresh-changes-panel';
import { createReadAdvancedPresetPolicyNumber } from './features/presets/read-advanced-preset-policy-number';
import { createPatchCrudSheetCellInRecord } from './features/table/patch-crud-sheet-cell-in-record';
import { createParseIsolatedData } from './features/table/parse-isolated-data';
import { createNormalizeGachaCustomFields } from './features/gacha/normalize-gacha-custom-fields';
import { createMergeDiceConfigBackupSetArray } from './features/dice/merge-dice-config-backup-set-array';
import { createGetViewportBottomAnchorElements } from './features/ui/get-viewport-bottom-anchor-elements';
import { createGetPlayerName } from './features/dice/get-player-name';
import { createGetLatestAssistantMessageElement } from './features/table/get-latest-assistant-message-element';
import { createGetGachaState } from './features/gacha/get-gacha-state';
import { createGetGachaShopProgressContainers } from './features/gacha/get-gacha-shop-progress-containers';
import { createGetDataAreaForRoot } from './features/ui/get-data-area-for-root';
import { createGachaRegexActionsInstance } from './features/gacha/gacha-regex-actions-instance';
import { createFindRelationGraphRelationColumnMatch } from './features/table/find-relation-graph-relation-column-match';
import { createFindGachaDefinitionByNameQuality } from './features/gacha/find-gacha-definition-by-name-quality';
import { createExtractNumericValue } from './shared/extract-numeric-value';
import { createDownloadTextFile } from './shared/download-text-file';
import { createCreateRegexRuleSignature } from './features/regex/create-regex-rule-signature';
import { createClampPanelHeightToDisplay } from './features/ui/clamp-panel-height-to-display';
import { createBuildDefaultGachaPoolDefinition } from './features/gacha/build-default-gacha-pool-definition';
import { createBuildCrudColumnAliasMap } from './features/table/build-crud-column-alias-map';
import { createBuildAcuDiceGachaStateSnapshot } from './features/gacha/build-acu-dice-gacha-state-snapshot';
import { createApplyDiceConfigBackupRuleOverrides } from './features/dice/apply-dice-config-backup-rule-overrides';
import { createDiffIdHeaderKeywords } from './features/table/diff-id-header-keywords';
import { createUpdateValidationIndicator } from './features/ui/update-validation-indicator';
import { createTriggerGenerationAfterDirectSend } from './features/textarea/trigger-generation-after-direct-send';
import { createStringifyAcuDiceGachaCatalogInput } from './features/gacha/stringify-acu-dice-gacha-catalog-input';
import { createStartGachaShopUiRefresh } from './features/gacha/start-gacha-shop-ui-refresh';
import { createRunMaybeAsyncDatabaseUiOpener } from './features/table/run-maybe-async-database-ui-opener';
import { createRenderAsyncImageIconSlotContent } from './features/ui/render-async-image-icon-slot-content';
import { createParseInSceneStatus } from './features/dice/parse-in-scene-status';
import { createOpenDatabaseVisualizerInterface } from './features/table/open-database-visualizer-interface';
import { createIsRelationshipCell } from './features/table/is-relationship-cell';
import { createGetUserCharacterNameCandidates } from './features/dice/get-user-character-name-candidates';
import { createGetInventoryGlobalContext } from './features/gacha/get-inventory-global-context';
import { createGetInventoryFieldColumnIndex } from './features/gacha/get-inventory-field-column-index';
import { createGetCustomTableNameIconPackImportSummaryText } from './features/table/get-custom-table-name-icon-pack-import-summary-text';
import { createGetCustomTableNameIconManagerRawSheets } from './features/table/get-custom-table-name-icon-manager-raw-sheets';
import { createFindRuntimeFunction } from './shared/find-runtime-function';
import { createDedupeInteractionActions } from './features/table/dedupe-interaction-actions';
import { createCollectDiceConfigBackupGachaCatalogRollbackSnapshot } from './features/dice/collect-dice-config-backup-gacha-catalog-rollback-snapshot';
import { createCloneQuickSelectNameMapping } from './features/dice/clone-quick-select-name-mapping';
import { createClickDatabaseNewUiFormFillNavigation } from './features/table/click-database-new-ui-form-fill-navigation';
import { createClearViewportInputMutationObserver } from './features/ui/clear-viewport-input-mutation-observer';
import { createClearFixedAnchorMutationObserver } from './features/ui/clear-fixed-anchor-mutation-observer';
import { createClearComposerIfCurrentText } from './features/textarea/clear-composer-if-current-text';
import { createCleanupGlobalInteractionFloatingMenus } from './features/table/cleanup-global-interaction-floating-menus';
import { createBuildAvatarBackgroundStyle } from './features/avatars/build-avatar-background-style';
import { createAssertCrudInsertRequiredCells } from './features/table/assert-crud-insert-required-cells';
import { createGlobalInteractionNameHeaderKeywords } from './features/table/global-interaction-name-header-keywords';
import { createSetPanelRequestedHeight } from './features/ui/set-panel-requested-height';
import { createRenderDiceConfigBackupPrivacyNotice } from './features/dice/render-dice-config-backup-privacy-notice';
import { createPushRecentGachaReward } from './features/gacha/push-recent-gacha-reward';
import { createOpenDatabaseNewUiViaApi } from './features/table/open-database-new-ui-via-api';
import { createNormalizeAvatarHexColor } from './features/avatars/normalize-avatar-hex-color';
import { createGetInventoryMetadataForItem } from './features/gacha/get-inventory-metadata-for-item';
import { createGetInventoryFilters } from './features/gacha/get-inventory-filters';
import { createGetGlobalInteractionActionRuleGroups } from './features/table/get-global-interaction-action-rule-groups';
import { createGetCrudCellValueForWrite } from './features/table/get-crud-cell-value-for-write';
import { createGetConfig } from './features/table/get-config';
import { createGetAttributePresetMappedTarget } from './features/dice/get-attribute-preset-mapped-target';
import { createFindGachaColumnByKeywords } from './features/gacha/find-gacha-column-by-keywords';
import { createCreateDiceProfileTavernRegex } from './features/dice/create-dice-profile-tavern-regex';
import { createBuildCheckSuggestionGuide } from './features/dice/build-check-suggestion-guide';
import { createParseJsoncDocument } from './features/presets/parse-jsonc-document';
import { createOpenDatabaseVisualizerNewUiViaApi } from './features/table/open-database-visualizer-new-ui-via-api';
import { createNormalizeGachaMessageId } from './features/gacha/normalize-gacha-message-id';
import { createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords } from './features/dice/normalize-dice-config-backup-gacha-catalog-snapshot-records';
import { createNormalizeCustomTableNameIconContext } from './features/table/normalize-custom-table-name-icon-context';
import { createMergeDiceConfigBackupRegexRules } from './features/dice/merge-dice-config-backup-regex-rules';
import { createIsQuickSelectTargetAvailable } from './features/dice/is-quick-select-target-available';
import { createHasDatabaseManualUpdateSurface } from './features/table/has-database-manual-update-surface';
import { createGetSuccessLevel } from './features/dice/get-success-level';
import { createGetPanelDisplayMaxHeight } from './features/ui/get-panel-display-max-height';
import { createGetGachaReservedCustomFieldHeaders } from './features/gacha/get-gacha-reserved-custom-field-headers';
import { createGetGachaPoolDefinitions } from './features/gacha/get-gacha-pool-definitions';
import { createGetDiffPreferredColumns } from './features/table/get-diff-preferred-columns';
import { createCreateUniqueGachaItemId } from './features/gacha/create-unique-gacha-item-id';
import { createCollectGachaPoolTagsFromItems } from './features/gacha/collect-gacha-pool-tags-from-items';
import { createCharacterNamesMatch } from './features/dice/character-names-match';
import { createDiceConfigBackupPrivacyRiskText } from './features/dice/dice-config-backup-privacy-risk-text';
import { createShowDiceProfileApplyConfirm } from './features/dice/show-dice-profile-apply-confirm';
import { createShowDiceConfigBackupPrivacyConfirm } from './features/dice/show-dice-config-backup-privacy-confirm';
import { createCustomTableNameIconSections } from './features/table/custom-table-name-icon-sections';
import { createCustomTableNameIconModuleIds } from './features/table/custom-table-name-icon-module-ids';
import { createCustomTableNameIconManagerSectionLabels } from './features/table/custom-table-name-icon-manager-section-labels';
import { createCustomTableNameIconManagerModuleLabels } from './features/table/custom-table-name-icon-manager-module-labels';
import { createNormalizeAdvancedPresetData } from './features/presets/normalize-advanced-preset-data';
import { createAcuDatabaseManualUpdateActionSelector } from './features/table/acu-database-manual-update-action-selector';
import { createAcuDatabaseLegacyManualUpdateButtonSelector } from './features/table/acu-database-legacy-manual-update-button-selector';
import { createAcuDatabaseManualUpdateButtonWaitMs } from './features/table/acu-database-manual-update-button-wait-ms';
import { createAcuDatabaseManualUpdateButtonPollMs } from './features/table/acu-database-manual-update-button-poll-ms';
import { createIsRecord } from './shared/is-record';
import { createGetFloatingCollapsePosition } from './features/ui/get-floating-collapse-position';
import { createGetDiceConfigBackupWarningCount } from './features/dice/get-dice-config-backup-warning-count';
import { createGetDiceConfigBackupRegexRuleKey } from './features/dice/get-dice-config-backup-regex-rule-key';
import { createGetDiceConfigBackupModuleDefinition } from './features/dice/get-dice-config-backup-module-definition';
import { createGetDiceConfigBackupKeyStrategy } from './features/dice/get-dice-config-backup-key-strategy';
import { createGetDiceConfigBackupGachaItemNameKey } from './features/dice/get-dice-config-backup-gacha-item-name-key';
import { createGetDiceConfigBackupGachaCatalogItemCount } from './features/dice/get-dice-config-backup-gacha-catalog-item-count';
import { createGetDashboardModuleConfig } from './features/dashboard/get-dashboard-module-config';
import { createGetCustomTableNameIconManagerSectionLabel } from './features/table/get-custom-table-name-icon-manager-section-label';
import { createGetCustomTableNameIconManagerModuleLabel } from './features/table/get-custom-table-name-icon-manager-module-label';
import { createGetCustomTableNameIconManagerLocalKey } from './features/table/get-custom-table-name-icon-manager-local-key';
import { createGetCustomGachaItemDefinitions } from './features/gacha/get-custom-gacha-item-definitions';
import { createGetCrudTableIdentifier } from './features/table/get-crud-table-identifier';
import { createGetAvailableGachaRewardTargets } from './features/gacha/get-available-gacha-reward-targets';
import { createGetAllDiceConfigBackupModuleIds } from './features/dice/get-all-dice-config-backup-module-ids';
import { createGetAdvancedPresetErrorMessage } from './features/presets/get-advanced-preset-error-message';
import { createWaitForDatabaseUiTick } from './features/table/wait-for-database-ui-tick';
import { createSharedHistoryStore } from './features/dice/shared-history-store';
import { createScheduleDialogueIndentRender } from './features/ui/schedule-dialogue-indent-render';
import { createSaveTableStyles } from './features/table/save-table-styles';
import { createSaveTableOrder } from './features/table/save-table-order';
import { createSaveTableHeights } from './features/table/save-table-heights';
import { createSaveStoredGachaStateSnapshot } from './features/gacha/save-stored-gacha-state-snapshot';
import { createSaveReverseTables } from './features/table/save-reverse-tables';
import { createSaveOptionsCollapsedState } from './features/table/save-options-collapsed-state';
import { createSaveHiddenTables } from './features/table/save-hidden-tables';
import { createSaveCollapsedState } from './features/table/save-collapsed-state';
import { createSaveActiveTabState } from './features/table/save-active-tab-state';
import { createSameRow } from './features/table/same-row';
import { createGetAdvancedPresetDisplayOutcome } from './features/presets/get-advanced-preset-display-outcome';
import { createFormatGachaPoolTags } from './features/gacha/format-gacha-pool-tags';
import { createFormatGachaCatalogImportStatsText } from './features/gacha/format-gacha-catalog-import-stats-text';
import { createCreateDiceProfileRuntimeId } from './features/dice/create-dice-profile-runtime-id';
import { createCloneGachaPoolDefinitions } from './features/gacha/clone-gacha-pool-definitions';
import { createCloneGachaCatalogItems } from './features/gacha/clone-gacha-catalog-items';
import { createCloseInventoryVisualization } from './features/gacha/close-inventory-visualization';
import { createClearPendingDeletions } from './features/table/clear-pending-deletions';
import { createClearModalStack } from './features/ui/clear-modal-stack';
import { createAcuDiceRollInstance } from './features/api/acu-dice-roll-instance';
import { createLegacyDefaultQuickCheckExcludeKeywords } from './features/dice/legacy-default-quick-check-exclude-keywords';
import { createDashboardPresetFilterKeys } from './features/dashboard/dashboard-preset-filter-keys';
import { createDashboardPresetAdditionalColumns } from './features/dashboard/dashboard-preset-additional-columns';
import { createBuiltinTableTemplateRequirementPresets } from './features/presets/builtin-table-template-requirement-presets';
import { createSetGachaPoolOrder } from './features/gacha/set-gacha-pool-order';
import { createSetGachaItemOrder } from './features/gacha/set-gacha-item-order';
import { createSaveInventoryFiltersCollapsedState } from './features/gacha/save-inventory-filters-collapsed-state';
import { createSaveDataOnly } from './features/table/save-data-only';
import { createSameHeaders } from './features/table/same-headers';
import { createRenderOptionButtonHtml } from './features/dice/render-option-button-html';
import { createRenderDiceConfigBackupWarningSlot } from './features/dice/render-dice-config-backup-warning-slot';
import { createRenderDeprecatedBadge } from './features/dice/render-deprecated-badge';
import { createRenderCheckSuggestionOptionButtonHtml } from './features/dice/render-check-suggestion-option-button-html';
import { createNormalizeGachaRewardTarget } from './features/gacha/normalize-gacha-reward-target';
import { createIsUserPlaceholderKey } from './features/dice/is-user-placeholder-key';
import { createIsTwoDimensionalArray } from './shared/is-two-dimensional-array';
import { createIsRecordValue } from './shared/is-record-value';
import { createIsGachaRarity } from './features/gacha/is-gacha-rarity';
import { createIsGachaPoolEnabled } from './features/gacha/is-gacha-pool-enabled';
import { createIsGachaPickupItem } from './features/gacha/is-gacha-pickup-item';
import { createIsGachaItemEnabled } from './features/gacha/is-gacha-item-enabled';
import { createIsFloatingCollapseActive } from './features/ui/is-floating-collapse-active';
import { createIsDiceProfileCharacterSource } from './features/dice/is-dice-profile-character-source';
import { createIsDiceConfigBackupRecord } from './features/dice/is-dice-config-backup-record';
import { createIsDiceConfigBackupModuleId } from './features/dice/is-dice-config-backup-module-id';
import { createIsDeprecatedBuiltinRegexRule } from './features/dice/is-deprecated-builtin-regex-rule';
import { createIsDatabaseButtonDisabled } from './features/table/is-database-button-disabled';
import { createIsCustomTableNameIconSection } from './features/table/is-custom-table-name-icon-section';
import { createIsCustomTableNameIconModuleId } from './features/table/is-custom-table-name-icon-module-id';
import { createIsCrudRowIdMissing } from './features/table/is-crud-row-id-missing';
import { createIsCrudNullableEnumEmptyValue } from './features/table/is-crud-nullable-enum-empty-value';
import { createIsBuiltinGachaPoolId } from './features/gacha/is-builtin-gacha-pool-id';
import { createIsAttributeQuickSelectTarget } from './features/dice/is-attribute-quick-select-target';
import { createIsAdvancedPresetRecord } from './features/presets/is-advanced-preset-record';
import { createHasGachaCustomFields } from './features/gacha/has-gacha-custom-fields';
import { createHasDiceConfigBackupTableTemplateResource } from './features/dice/has-dice-config-backup-table-template-resource';
import { createHasAdvancedPresetFieldConfig } from './features/presets/has-advanced-preset-field-config';
import { createGetVisibleGachaPoolConfigDefinitions } from './features/gacha/get-visible-gacha-pool-config-definitions';
import { createGetTutorialButtonHtml } from './features/tutorial/get-tutorial-button-html';
import { createGetObjectRecord } from './shared/get-object-record';
import { createGetGachaSettingsPoolItems } from './features/gacha/get-gacha-settings-pool-items';
import { createGetGachaRewardTargetTableLabel } from './features/gacha/get-gacha-reward-target-table-label';
import { createGetGachaRewardTargetModuleName } from './features/gacha/get-gacha-reward-target-module-name';
import { createGetGachaRewardTargetModuleKey } from './features/gacha/get-gacha-reward-target-module-key';
import { createGetGachaRarityIconClass } from './features/gacha/get-gacha-rarity-icon-class';
import { createGetGachaPoolDisplayName } from './features/gacha/get-gacha-pool-display-name';
import { createGetGachaItemGrantQuantity } from './features/gacha/get-gacha-item-grant-quantity';
import { createGetGachaItemDescriptionText } from './features/gacha/get-gacha-item-description-text';
import { createGetGachaCustomFieldEntries } from './features/gacha/get-gacha-custom-field-entries';
import { createGetGachaCatalogItemMergeTimestamp } from './features/gacha/get-gacha-catalog-item-merge-timestamp';
import { createFindRuntimeSheetEntryForMutation } from './features/table/find-runtime-sheet-entry-for-mutation';
import { createFindGachaDefinitionByInventoryItem } from './features/gacha/find-gacha-definition-by-inventory-item';
import { createExtractMetaCheckResultBlocks } from './features/human-input/extract-meta-check-result-blocks';
import { createExecuteFixedCheckSuggestion } from './features/dice/execute-fixed-check-suggestion';
import { createDownloadDiceConfigBackupJson } from './features/dice/download-dice-config-backup-json';
import { createCompareGachaItemDefinitionsForDisplay } from './features/gacha/compare-gacha-item-definitions-for-display';
import { createCloneAcuDiceApiValue } from './features/api/clone-acu-dice-api-value';
import { createClearGlobalInteractionOutsideCapture } from './features/table/clear-global-interaction-outside-capture';
import { createCanDeleteGachaPoolDefinition } from './features/gacha/can-delete-gacha-pool-definition';
import { createBuildStableGachaCustomItemId } from './features/gacha/build-stable-gacha-custom-item-id';
import { createAsDiffRecord } from './features/table/as-diff-record';
import { createApplyPanelDisplayMaxHeight } from './features/ui/apply-panel-display-max-height';
import { createAcuDiceHistoryInstance } from './features/api/acu-dice-history-instance';
import { createNameAliasRegistryInstance } from './features/dice/name-alias-registry-instance';
import { createGachaEquipmentWrittenTargetColumnKeys } from './features/gacha/gacha-equipment-written-target-column-keys';
import { createDefaultOutputTemplate } from './features/dice/default-output-template';
import { createDashboardRelationshipGraphSourceModes } from './features/dashboard/dashboard-relationship-graph-source-modes';
import { createCustomRollMode } from './features/dice/custom-roll-mode';
import { createIsCustomTableNameIconImageUrlValid } from './features/table/is-custom-table-name-icon-image-url-valid';
import { createGetCustomTableNameIconImageUrlValidationError } from './features/table/get-custom-table-name-icon-image-url-validation-error';
import { createBindAcuDiceGachaRegexActions } from './features/api/bind-acu-dice-gacha-regex-actions';
import { createWarnTableTemplateIssue } from './features/table/warn-table-template-issue';
import { createShouldShowReverseButton } from './features/table/should-show-reverse-button';
import { createSaveStoredGachaShardShopRarity } from './features/gacha/save-stored-gacha-shard-shop-rarity';
import { createSaveStoredGachaActivePoolTag } from './features/gacha/save-stored-gacha-active-pool-tag';
import { createSaveInventoryMetadataStore } from './features/gacha/save-inventory-metadata-store';
import { createSaveInventoryFilters } from './features/gacha/save-inventory-filters';
import { createGetInventoryPanelTarget } from './features/table/get-inventory-panel-target';
import { createSaveInventoryPanelTarget } from './features/table/save-inventory-panel-target';
import { createSaveDiceProfileCollapsedSections } from './features/dice/save-dice-profile-collapsed-sections';
import { createSaveCrazyModeConfig } from './features/dice/save-crazy-mode-config';
import { createResolveRuntimeMutationSource } from './features/table/resolve-runtime-mutation-source';
import { createRenderDiceConfigBackupExportBody } from './features/dice/render-dice-config-backup-export-body';
import { createPushAdvancedPresetIssue } from './features/presets/push-advanced-preset-issue';
import { createParseDashboardPresetJson } from './features/dashboard/parse-dashboard-preset-json';
import { createParseCrudColumnDefinitionLine } from './features/table/parse-crud-column-definition-line';
import { createNotifyReady } from './features/api/notify-ready';
import { createMarkHumanInputActivity } from './features/human-input/mark-human-input-activity';
import { createIsTableReversed } from './features/table/is-table-reversed';
import { createIsLikelyAvatarSkinTone } from './features/avatars/is-likely-avatar-skin-tone';
import { createIsDiceStatsScopeUnavailable } from './features/dice/is-dice-stats-scope-unavailable';
import { createIsComplexCondition } from './features/dice/is-complex-condition';
import { createHandleCustomTableNameIconImageDBPagehide } from './features/table/handle-custom-table-name-icon-image-db-pagehide';
import { createGetTemplateInspectionSeverityMeta } from './features/presets/get-template-inspection-severity-meta';
import { createGetInventoryMetadataScopeKey } from './features/gacha/get-inventory-metadata-scope-key';
import { createGetDisplayPlayerName } from './features/dice/get-display-player-name';
import { createGetCustomTableNameIconManagerEntryAsset } from './features/table/get-custom-table-name-icon-manager-entry-asset';
import { createGetAttributesForCharacter } from './features/dice/get-attributes-for-character';
import { createGetAllGachaPoolConfigDefinitions } from './features/gacha/get-all-gacha-pool-config-definitions';
import { createExtractCheckSuggestionTieRule } from './features/dice/extract-check-suggestion-tie-rule';
import { createExtractCheckSuggestionTarget } from './features/dice/extract-check-suggestion-target';
import { createExtractCheckSuggestionDiceFormula } from './features/dice/extract-check-suggestion-dice-formula';
import { createErrorTableTemplateIssue } from './features/table/error-table-template-issue';
import { createEmitEvent } from './features/api/emit-event';
import { createDownloadJsoncFile } from './shared/download-jsonc-file';
import { createDownloadJsonFile } from './shared/download-json-file';
import { createDownloadAiPromptFile } from './shared/download-ai-prompt-file';
import { createWarnMissingTableTarget } from './features/table/warn-missing-table-target';
import { createTruncateGachaText } from './features/gacha/truncate-gacha-text';
import { createTemplateTextIncludesAny } from './features/presets/template-text-includes-any';
import { createSetTextareaValueAndNotify } from './features/textarea/set-textarea-value-and-notify';
import { createSerializeAcuDiceGachaItem } from './features/api/serialize-acu-dice-gacha-item';
import { createResolveCheckSuggestionCharacterName } from './features/dice/resolve-check-suggestion-character-name';
import { createReopenInventoryItemDetail } from './features/gacha/reopen-inventory-item-detail';
import { createReadAdvancedPresetContextTags } from './features/presets/read-advanced-preset-context-tags';
import { createQuoteSlashArgument } from './features/textarea/quote-slash-argument';
import { createPatchLatestChatSheetWithoutTracking } from './features/table/patch-latest-chat-sheet-without-tracking';
import { createNormalizeTemplateInspectText } from './features/presets/normalize-template-inspect-text';
import { createNormalizeTableNameList } from './features/table/normalize-table-name-list';
import { createNormalizeStorableImageUrl } from './features/avatars/normalize-storable-image-url';
import { createNormalizeSheetKeys } from './features/table/normalize-sheet-keys';
import { createNormalizeGachaItemOrder } from './features/gacha/normalize-gacha-item-order';
import { createNormalizeDiffText } from './features/table/normalize-diff-text';
import { createNormalizeDatabaseUiText } from './features/table/normalize-database-ui-text';
import { createNormalizeCrudSqlComment } from './features/table/normalize-crud-sql-comment';
import { createNormalizeAcuDiceGachaImportMode } from './features/api/normalize-acu-dice-gacha-import-mode';
import { createIsSameKeywordSet } from './shared/is-same-keyword-set';
import { createIsPlayerTableName } from './features/table/is-player-table-name';
import { createIsGachaFieldAlias } from './features/gacha/is-gacha-field-alias';
import { createIsDiffSheet } from './features/table/is-diff-sheet';
import { createIsCustomTableNameIconSvgMimeType } from './features/table/is-custom-table-name-icon-svg-mime-type';
import { createHasSheetKeys } from './features/table/has-sheet-keys';
import { createHasRuntimeTableReadApi } from './features/table/has-runtime-table-read-api';
import { createHasGachaRewardTable } from './features/gacha/has-gacha-reward-table';
import { createGetStoredGachaShardShopRarity } from './features/gacha/get-stored-gacha-shard-shop-rarity';
import { createGetStoredGachaActivePoolTag } from './features/gacha/get-stored-gacha-active-pool-tag';
import { createGetInventoryMetadataStore } from './features/gacha/get-inventory-metadata-store';
import { createGetInventoryMetadataContextKey } from './features/gacha/get-inventory-metadata-context-key';
import { createGetGlobalInteractionRuleKeywords } from './features/table/get-global-interaction-rule-keywords';
import { createGetGlobalInteractionCollapsedSections } from './features/table/get-global-interaction-collapsed-sections';
import { createGetGachaTargetColumnEntries } from './features/gacha/get-gacha-target-column-entries';
import { createGetGachaRarityRank } from './features/gacha/get-gacha-rarity-rank';
import { createGetGachaItemTagsText } from './features/gacha/get-gacha-item-tags-text';
import { createGetGachaItemEffectText } from './features/gacha/get-gacha-item-effect-text';
import { createGetGachaCustomFieldsSearchText } from './features/gacha/get-gacha-custom-fields-search-text';
import { createGetDiffSheetContent } from './features/table/get-diff-sheet-content';
import { createGetDiffDataRow } from './features/table/get-diff-data-row';
import { createGetDiceProfilePromptStates } from './features/dice/get-dice-profile-prompt-states';
import { createGetDiceProfileModuleNames } from './features/dice/get-dice-profile-module-names';
import { createGetDiceProfileIndex } from './features/dice/get-dice-profile-index';
import { createGetDiceProfileCollapsedSections } from './features/dice/get-dice-profile-collapsed-sections';
import { createGetDiceConfigBackupTableTemplateApi } from './features/dice/get-dice-config-backup-table-template-api';
import { createGetDiceConfigBackupRecordString } from './features/dice/get-dice-config-backup-record-string';
import { createGetDiceConfigBackupPresetRecordName } from './features/dice/get-dice-config-backup-preset-record-name';
import { createGetDiceConfigBackupPresetRecordId } from './features/dice/get-dice-config-backup-preset-record-id';
import { createGetCustomTableNameIconContextKey } from './features/table/get-custom-table-name-icon-context-key';
import { createGetAttributeValue } from './features/dice/get-attribute-value';
import { createGetActiveGachaPoolTags } from './features/gacha/get-active-gacha-pool-tags';
import { createGetActiveDashboardRelationshipGraphSources } from './features/dashboard/get-active-dashboard-relationship-graph-sources';
import { createFormatGachaItemCardMeta } from './features/gacha/format-gacha-item-card-meta';
import { createStripKnownSystemActionText } from './features/human-input/strip-known-system-action-text';
import { createStripCrudSqlNonStructuralComments } from './features/table/strip-crud-sql-non-structural-comments';
import { createShouldInferCrudRowIdFromVisibleIndex } from './features/table/should-infer-crud-row-id-from-visible-index';
import { createSetDiffDataRow } from './features/table/set-diff-data-row';
import { createScheduleCharacterDiceProfileDetection } from './features/dice/schedule-character-dice-profile-detection';
import { createSaveStoredGachaSettingsPoolTag } from './features/gacha/save-stored-gacha-settings-pool-tag';
import { createSaveInventoryMetadataRoot } from './features/gacha/save-inventory-metadata-root';
import { createRestoreCrudRowIdPreparation } from './features/table/restore-crud-row-id-preparation';
import { createResolveTextareaTextWithHiddenDice } from './features/textarea/resolve-textarea-text-with-hidden-dice';
import { createResolveCanonicalCharacterName } from './features/dice/resolve-canonical-character-name';
import { createResolveAttributeAliasName } from './features/dice/resolve-attribute-alias-name';
import { createReplaceTag } from './features/table/replace-tag';
import { createRemoveDiffDataRow } from './features/table/remove-diff-data-row';
import { createRememberAutoRegexTransform } from './features/textarea/remember-auto-regex-transform';
import { createReadTextareaVisibleValue } from './features/textarea/read-textarea-visible-value';
import { createPushUniqueNameCandidate } from './shared/push-unique-name-candidate';
import { createNotifyTextareaValueChanged } from './features/textarea/notify-textarea-value-changed';
import { createNormalizePanelHeightValue } from './features/ui/normalize-panel-height-value';
import { createNormalizeGlobalInteractionHeader } from './features/table/normalize-global-interaction-header';
import { createNormalizeGlobalInteractionCategoryText } from './features/table/normalize-global-interaction-category-text';
import { createNormalizeGachaTargetTable } from './features/gacha/normalize-gacha-target-table';
import { createNormalizeCollapseStyle } from './features/table/normalize-collapse-style';
import { createNormalizeCheckSuggestionActionText } from './features/dice/normalize-check-suggestion-action-text';
import { createNormalizeAdvancedPresetNotes } from './features/presets/normalize-advanced-preset-notes';
import { createIsSameSheetData } from './features/table/is-same-sheet-data';
import { createIsSameAttributeAlias } from './features/dice/is-same-attribute-alias';
import { createIsAdvancedPresetNumericLike } from './features/presets/is-advanced-preset-numeric-like';
import { createGetTotalGachaShards } from './features/gacha/get-total-gacha-shards';
import { createGetStoredPanelHeight } from './features/ui/get-stored-panel-height';
import { createGetStoredGachaSettingsPoolTag } from './features/gacha/get-stored-gacha-settings-pool-tag';
import { createGetStoredGachaCatalog } from './features/gacha/get-stored-gacha-catalog';
import { createGetRuleTagSnippet } from './features/presets/get-rule-tag-snippet';
import { createGetNormalQuickSelectInputSelector } from './features/dice/get-normal-quick-select-input-selector';
import { createGetJsonLikeErrorMessage } from './shared/get-json-like-error-message';
import { createGetInventoryActionLabel } from './features/gacha/get-inventory-action-label';
import { createGetGachaRewardParseResultForItem } from './features/gacha/get-gacha-reward-parse-result-for-item';
import { createGetGachaRewardParseResult } from './features/gacha/get-gacha-reward-parse-result';
import { createGetGachaMinimumRarity } from './features/gacha/get-gacha-minimum-rarity';
import { createGetGachaItemCreatedAtMs } from './features/gacha/get-gacha-item-created-at-ms';
import { createGetGachaCatalogRecordMergeTimestamp } from './features/gacha/get-gacha-catalog-record-merge-timestamp';
import { createGetGachaAllExpandablePoolTags } from './features/gacha/get-gacha-all-expandable-pool-tags';
import { createGetGachaActivePoolTag } from './features/gacha/get-gacha-active-pool-tag';
import { createGetDiceConfigBackupSafeCurrentPresets } from './features/dice/get-dice-config-backup-safe-current-presets';
import { createGetDbChatMessages } from './features/table/get-db-chat-messages';
import { createGetDatabaseManualUpdateErrorMessage } from './features/table/get-database-manual-update-error-message';
import { createGetCustomTableNameIconManagerSourceLabel } from './features/table/get-custom-table-name-icon-manager-source-label';
import { createGetCrudSheetDdl } from './features/table/get-crud-sheet-ddl';
import { createGetCrazyModeConfig } from './features/dice/get-crazy-mode-config';
import { createGetComposerTextarea } from './features/textarea/get-composer-textarea';
import { createGachaStoreInstance } from './features/gacha/gacha-store-instance';
import { createGachaStateCoreInstance } from './features/gacha/gacha-state-core-instance';
import { createFormatGachaItemCreatedAt } from './features/gacha/format-gacha-item-created-at';
import { createFormatGachaCatalogImportErrors } from './features/gacha/format-gacha-catalog-import-errors';
import { createFormatDiceConfigBackupSelectedModuleRiskLines } from './features/dice/format-dice-config-backup-selected-module-risk-lines';
import { createFindRuntimeSheetEntryForCrud } from './features/table/find-runtime-sheet-entry-for-crud';
import { createFindInventoryItemByRow } from './features/gacha/find-inventory-item-by-row';
import { createFindDiffSnapshotEntry } from './features/table/find-diff-snapshot-entry';
import { createExportDiceProfile } from './features/dice/export-dice-profile';
import { createEscapeCssString } from './shared/escape-css-string';
import { createDownloadDiceProfileJson } from './features/dice/download-dice-profile-json';
import { createDeleteDiceProfileRecord } from './features/dice/delete-dice-profile-record';
import { createDebugGlobalInteraction } from './features/table/debug-global-interaction';
import { createCreateEmptyGachaCatalog } from './features/gacha/create-empty-gacha-catalog';
import { createCreateElementFromHtml } from './features/ui/create-element-from-html';
import { createCreateDiceProfileTavernRegexReplaceString } from './features/dice/create-dice-profile-tavern-regex-replace-string';
import { createCreateAutoRegexTransformKey } from './features/textarea/create-auto-regex-transform-key';
import { createCollectGachaLocalStorageSnapshot } from './features/gacha/collect-gacha-local-storage-snapshot';
import { createCollectDashboardNpcEntriesFromTableResults } from './features/dashboard/collect-dashboard-npc-entries-from-table-results';
import { createClearPanelRequestedHeight } from './features/ui/clear-panel-requested-height';
import { createClampAvatarNumber } from './features/avatars/clamp-avatar-number';
import { createBuildCheckSuggestionInvalidCommandMessage } from './features/dice/build-check-suggestion-invalid-command-message';
import { createApplyGachaPityAfterDraw } from './features/gacha/apply-gacha-pity-after-draw';
import { createApplyAttributeQuickSelectDefaults } from './features/dice/apply-attribute-quick-select-defaults';
import { createAcuDicePresetsInstance } from './features/api/acu-dice-presets-instance';
import { createHumanInputTagBlockPatterns } from './features/human-input/human-input-tag-block-patterns';
import { createGachaSettingsStatusFilterOptions } from './features/gacha/gacha-settings-status-filter-options';
import { createGachaSettingsSourceFilterOptions } from './features/gacha/gacha-settings-source-filter-options';
import { createDiceStatsScopeLabels } from './features/dice/dice-stats-scope-labels';
import { createUpdateGachaShopProgressUi } from './features/gacha/update-gacha-shop-progress-ui';
import { createSortGachaPoolDefinitions } from './features/gacha/sort-gacha-pool-definitions';
import { createShouldSkipAutoRegexTransform } from './features/textarea/should-skip-auto-regex-transform';
import { createSaveDiceProfileRecord } from './features/dice/save-dice-profile-record';
import { createSaveConfig } from './features/table/save-config';
import { createPushDashboardNpcEntry } from './features/dashboard/push-dashboard-npc-entry';
import { createNormalizeInferredAvatarColor } from './features/avatars/normalize-inferred-avatar-color';
import { createNormalizeDashboardOptionalStringArray } from './features/dashboard/normalize-dashboard-optional-string-array';
import { createNormalizeCheckSuggestionSideShorthand } from './features/dice/normalize-check-suggestion-side-shorthand';
import { createNormalizeCharacterNameForCompare } from './shared/normalize-character-name-for-compare';
import { createJudgeCrazyRollResult } from './features/dice/judge-crazy-roll-result';
import { createIsRenderableImageUrlValid } from './shared/is-renderable-image-url-valid';
import { createIsGachaTargetTableAliasMatch } from './features/gacha/is-gacha-target-table-alias-match';
import { createGetStringLikeCellText } from './shared/get-string-like-cell-text';
import { createGetStableRowKeyForCrud } from './features/table/get-stable-row-key-for-crud';
import { createGetResolvedComposerText } from './features/textarea/get-resolved-composer-text';
import { createGetLegacyGachaStateFromRawData } from './features/gacha/get-legacy-gacha-state-from-raw-data';
import { createGetInventoryResult } from './features/gacha/get-inventory-result';
import { createGetInventoryActionPrompt } from './features/gacha/get-inventory-action-prompt';
import { createGetImageUrlValidationMessage } from './shared/get-image-url-validation-message';
import { createGetGachaRewardTargetOptions } from './features/gacha/get-gacha-reward-target-options';
import { createGetGachaLocalDateKey } from './features/gacha/get-gacha-local-date-key';
import { createGetFixedWrapperParentMetrics } from './features/ui/get-fixed-wrapper-parent-metrics';
import { createGetEquipmentResult } from './features/gacha/get-equipment-result';
import { createGetDiffSheetByKey } from './features/table/get-diff-sheet-by-key';
import { createGetDiceProfileCharacterContext } from './features/dice/get-dice-profile-character-context';
import { createGetCurrentChatAvatarNodes } from './features/avatars/get-current-chat-avatar-nodes';
import { createGetCheckSuggestionPresetById } from './features/dice/get-check-suggestion-preset-by-id';
import { createGetCheckSuggestionDiceSides } from './features/dice/get-check-suggestion-dice-sides';
import { createFormatGachaRecentRewardText } from './features/gacha/format-gacha-recent-reward-text';
import { createFormatGachaDuration } from './features/gacha/format-gacha-duration';
import { createExtractExplicitHumanInputText } from './features/human-input/extract-explicit-human-input-text';
import { createEvaluateConditionNumber } from './features/dice/evaluate-condition-number';
import { createEnsureGachaPoolsForTags } from './features/gacha/ensure-gacha-pools-for-tags';
import { createEnsureGachaHeartbeat } from './features/gacha/ensure-gacha-heartbeat';
import { createDrawSingleGachaOutcome } from './features/gacha/draw-single-gacha-outcome';
import { createCreateDiceProfileRegexId } from './features/dice/create-dice-profile-regex-id';
import { createConsumePendingHumanInputSnapshot } from './features/human-input/consume-pending-human-input-snapshot';
import { createClearFixedAnchorResizeObserver } from './features/ui/clear-fixed-anchor-resize-observer';
import { createBuildGachaSettlementKey } from './features/gacha/build-gacha-settlement-key';
import { createAreAllTablesReversed } from './features/table/are-all-tables-reversed';
import { createAddGachaShards } from './features/gacha/add-gacha-shards';
import { createDefaultGachaSettingsItemFilters } from './features/gacha/default-gacha-settings-item-filters';
import { createDefaultContestOutputTemplate } from './features/dice/default-contest-output-template';
import { createCustomTableNameIconDeniedSections } from './features/table/custom-table-name-icon-denied-sections';
import { createCustomTableNameIconAllowedLocalMimeTypes } from './features/table/custom-table-name-icon-allowed-local-mime-types';
import { createAcuDatabaseManualUpdateApiMethods } from './features/table/acu-database-manual-update-api-methods';
import { createWithTableTemplateCheckHint } from './features/table/with-table-template-check-hint';
import { createShouldTriggerCrazyMode } from './features/dice/should-trigger-crazy-mode';
import { createSetDiceConfigBackupValue } from './features/dice/set-dice-config-backup-value';
import { createSerializeGachaPoolDefinitionForExport } from './features/gacha/serialize-gacha-pool-definition-for-export';
import { createSerializeAcuDiceGachaDrawOutcome } from './features/api/serialize-acu-dice-gacha-draw-outcome';
import { createSaveDiceProfileIndex } from './features/dice/save-dice-profile-index';
import { createSaveCurrentDatabaseSnapshotAsReviewBaseline } from './features/table/save-current-database-snapshot-as-review-baseline';
import { createSanitizeUiConfig } from './features/table/sanitize-ui-config';
import { createSanitizeDiceConfigBackupRuleList } from './features/dice/sanitize-dice-config-backup-rule-list';
import { createResolveRootWindow } from './features/ui/resolve-root-window';
import { createResolveDashboardGlobalInteractionSectionKind } from './features/dashboard/resolve-dashboard-global-interaction-section-kind';
import { createRenderGlobalInteractionItemMark } from './features/table/render-global-interaction-item-mark';
import { createRenderGachaItemIconContent } from './features/gacha/render-gacha-item-icon-content';
import { createRenderDiceProfileTabPanel } from './features/dice/render-dice-profile-tab-panel';
import { createRenderDiceConfigBackupWarningList } from './features/dice/render-dice-config-backup-warning-list';
import { createRecordGachaFortuneGain } from './features/gacha/record-gacha-fortune-gain';
import { createReadTextFile } from './features/table/read-text-file';
import { createReadRuntimeTableDataReference } from './features/table/read-runtime-table-data-reference';
import { createPatchLatestChatSheetCellWithoutTracking } from './features/table/patch-latest-chat-sheet-cell-without-tracking';
import { createParseCheckSuggestionPrimitiveValue } from './features/dice/parse-check-suggestion-primitive-value';
import { createNormalizeTrackedText } from './shared/normalize-tracked-text';
import { createNormalizeGachaTimestamp } from './features/gacha/normalize-gacha-timestamp';
import { createNormalizeCheckSuggestionDiceFormula } from './features/dice/normalize-check-suggestion-dice-formula';
import { createNormalizeAcuDiceGachaInteger } from './features/api/normalize-acu-dice-gacha-integer';
import { createIsRuleTemplateSheetWithNote } from './features/table/is-rule-template-sheet-with-note';
import { createIsElementVisibleInLayout } from './features/ui/is-element-visible-in-layout';
import { createIsDiceConfigBackupSameValue } from './features/dice/is-dice-config-backup-same-value';
import { createIsCustomTableNameIconTableDenied } from './features/table/is-custom-table-name-icon-table-denied';
import { createIsCheckSuggestionOutcomeSuccess } from './features/dice/is-check-suggestion-outcome-success';
import { createGrantInventoryGachaReward } from './features/gacha/grant-inventory-gacha-reward';
import { createGrantEquipmentGachaReward } from './features/gacha/grant-equipment-gacha-reward';
import { createGrantGachaReward } from './features/gacha/grant-gacha-reward';
import { createGetStandardAttrs } from './features/dice/get-standard-attrs';
import { createGetRemoteImageUrlValidationError } from './shared/get-remote-image-url-validation-error';
import { createGetInventoryActiveFilterCount } from './features/gacha/get-inventory-active-filter-count';
import { createGetDiceProfileSourceLabel } from './features/dice/get-dice-profile-source-label';
import { createGetDiceProfilePromptState } from './features/dice/get-dice-profile-prompt-state';
import { createGetDiceConfigBackupValidationRuleKey } from './features/dice/get-dice-config-backup-validation-rule-key';
import { createGetDiceConfigBackupSelectedModuleIdsFromDialog } from './features/dice/get-dice-config-backup-selected-module-ids-from-dialog';
import { createGetDiceConfigBackupRuleRecords } from './features/dice/get-dice-config-backup-rule-records';
import { createGetCrudSqlTableName } from './features/table/get-crud-sql-table-name';
import { createGetCheckSuggestionMappedTarget } from './features/dice/get-check-suggestion-mapped-target';
import { createGetAvatarManualAliases } from './features/avatars/get-avatar-manual-aliases';
import { createGetAllGachaItemDefinitions } from './features/gacha/get-all-gacha-item-definitions';
import { createEvaluateCheckSuggestionOutcome } from './features/dice/evaluate-check-suggestion-outcome';
import { createDispatchReadyEvent } from './features/api/dispatch-ready-event';
import { createConsumeCrudWriteOptions } from './features/table/consume-crud-write-options';
import { createCloneRuntimeDataValue } from './shared/clone-runtime-data-value';
import { createBuildGlobalInteractionSearchText } from './features/table/build-global-interaction-search-text';
import { createBuildCustomTableNameIconPack } from './features/table/build-custom-table-name-icon-pack';
import { createBuildAttributeRulesContent } from './features/dice/build-attribute-rules-content';
import { isDatabaseManualUpdateButtonTextImpl as isDatabaseManualUpdateButtonText } from './features/table/normalize-database-ui-text';
import { normalizeDiffHeaderImpl as normalizeDiffHeader } from './features/table/normalize-diff-text';
import { escapeRegExpLiteralImpl as escapeRegExpLiteral } from './shared/normalize-tracked-text';
import { buildGachaExportNamePartImpl as buildGachaExportNamePart } from './features/gacha/serialize-gacha-pool-definition-for-export';
import { getCustomTableNameIconPackDownloadFileNameImpl as getCustomTableNameIconPackDownloadFileName } from './features/table/build-custom-table-name-icon-pack';
import { createAssertCrudJsonFallbackAllowed } from './features/table/assert-crud-json-fallback-allowed';
import { createAddCrudColumnAlias } from './features/table/add-crud-column-alias';
import { createViewportBottomAnchorSelectors } from './features/ui/viewport-bottom-anchor-selectors';
import { createInventoryTypeFilterMeta } from './features/gacha/inventory-type-filter-meta';
import { createInventorySortOptions } from './features/gacha/inventory-sort-options';
import { createGlobalInteractionDefaultSectionMeta } from './features/table/global-interaction-default-section-meta';
import { createFixedModeAnchorPriority } from './features/ui/fixed-mode-anchor-priority';
import { createCustomTableNameIconDashboardModuleContexts } from './features/table/custom-table-name-icon-dashboard-module-contexts';
import { createSafeUpdateAttribute } from './features/ui/safe-update-attribute';
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
import { createDismantleEquipmentItem } from './features/gacha/dismantle-equipment-item';
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

  const withTableTemplateCheckHint = createWithTableTemplateCheckHint({
    getTABLE_TEMPLATE_CHECK_HINT: () => TABLE_TEMPLATE_CHECK_HINT,
  });

  const warnTableTemplateIssue = createWarnTableTemplateIssue({
    withTableTemplateCheckHint: (...a: any[]) => withTableTemplateCheckHint(...a),
  });

  const errorTableTemplateIssue = createErrorTableTemplateIssue({

  });

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
  const safeUpdateAttribute = createSafeUpdateAttribute({
    getDbLockAPI: (...a: any[]) => getDbLockAPI(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData,
    setCachedRawData: (v: any) => { cachedRawData = v; },
  });

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

  const normalizeImageUrlInput = createNormalizeImageUrlInput({

  });

  const parseImageUrl = createParseImageUrl({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const getRemoteImageUrlValidationError = createGetRemoteImageUrlValidationError({
    parseImageUrl: (...a: any[]) => parseImageUrl(...a),
    getREMOTE_IMAGE_ALLOWED_PROTOCOLS: () => REMOTE_IMAGE_ALLOWED_PROTOCOLS,
  });

  const isRemoteImageUrlValid = createIsRemoteImageUrlValid({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
  });

  const isRenderableImageUrlValid = createIsRenderableImageUrlValid({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
    parseImageUrl: (...a: any[]) => parseImageUrl(...a),
    getINTERNAL_IMAGE_ALLOWED_PROTOCOLS: () => INTERNAL_IMAGE_ALLOWED_PROTOCOLS,
  });

  const normalizeStorableImageUrl = createNormalizeStorableImageUrl({
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const getImageUrlValidationMessage = createGetImageUrlValidationMessage({

  });

  const escapeCssString = createEscapeCssString({
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const formatCssImageUrl = createFormatCssImageUrl({
    escapeCssString: (...a: any[]) => escapeCssString(...a),
    isRemoteImageUrlValid: (...a: any[]) => isRemoteImageUrlValid(...a),
    isRenderableImageUrlValid: (...a: any[]) => isRenderableImageUrlValid(...a),
    normalizeImageUrlInput: (...a: any[]) => normalizeImageUrlInput(...a),
  });

  const buildAvatarBackgroundStyle = createBuildAvatarBackgroundStyle({
    formatCssImageUrl: (...a: any[]) => formatCssImageUrl(...a),
  });


  const renderDeprecatedBadge = createRenderDeprecatedBadge({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

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
  const createMetaCheckResultRegex = createCreateMetaCheckResultRegex({

  });
  const createDiceResultPlaceholderRegex = createCreateDiceResultPlaceholderRegex({});


  const notifyTextareaValueChanged = createNotifyTextareaValueChanged({

  });

  const setTextareaValueAndNotify = createSetTextareaValueAndNotify({
    notifyTextareaValueChanged: (...a: any[]) => notifyTextareaValueChanged(...a),
  });

  const readTextareaVisibleValue = createReadTextareaVisibleValue({

  });

  const extractMetaCheckResultBlocks = createExtractMetaCheckResultBlocks({
    createMetaCheckResultRegex: (...a: any[]) => createMetaCheckResultRegex(...a),
  });

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

  const resolveTextareaTextWithHiddenDice = createResolveTextareaTextWithHiddenDice({
    composeTextareaTextWithHiddenDice: (...a: any[]) => composeTextareaTextWithHiddenDice(...a),
    readStoredLatestDiceText: (...a: any[]) => readStoredLatestDiceText(...a),
    readStoredTextareaDiceText: (...a: any[]) => readStoredTextareaDiceText(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
  });
  const clearTextareaDiceCache = createClearTextareaDiceCache({
    getCore: (...a: any[]) => getCore(...a),
  });

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

  const HUMAN_INPUT_TAG_BLOCK_PATTERNS = createHumanInputTagBlockPatterns({

  });
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

  const normalizeTrackedText = createNormalizeTrackedText({

  });

  const stripKnownSystemActionText = createStripKnownSystemActionText({
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
  });

  const extractExplicitHumanInputText = createExtractExplicitHumanInputText({
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
  });

  const stripSystemInjectedContent = createStripSystemInjectedContent({
    extractExplicitHumanInputText: (...a: any[]) => extractExplicitHumanInputText(...a),
    normalizeTrackedText: (...a: any[]) => normalizeTrackedText(...a),
    stripKnownSystemActionText: (...a: any[]) => stripKnownSystemActionText(...a),
    getHUMAN_INPUT_ACTION_PATTERN: () => HUMAN_INPUT_ACTION_PATTERN,
    getHUMAN_INPUT_TAG_BLOCK_PATTERNS: () => HUMAN_INPUT_TAG_BLOCK_PATTERNS,
  });

  const countUnicodeCharacters = createCountUnicodeCharacters({

  });

  const markHumanInputActivity = createMarkHumanInputActivity({
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt,
    setLastHumanInputActivityAt: (v: any) => { lastHumanInputActivityAt = v; },
  });

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

  const consumePendingHumanInputSnapshot = createConsumePendingHumanInputSnapshot({
    getHumanInputSendQueue: () => humanInputSendQueue,
    getLastHumanInputSnapshot: () => lastHumanInputSnapshot,
  });

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

  const findRuntimeFunction = createFindRuntimeFunction({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

  const findSillyTavernSlashRunner = createFindSillyTavernSlashRunner({
    getRuntimeWindowCandidates: (...a: any[]) => getRuntimeWindowCandidates(...a),
  });

  const quoteSlashArgument = createQuoteSlashArgument({

  });

  const getComposerTextarea = createGetComposerTextarea({
    getCore: (...a: any[]) => getCore(...a),
  });

  const getResolvedComposerText = createGetResolvedComposerText({
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

  const clearComposerIfCurrentText = createClearComposerIfCurrentText({
    clearTextareaDiceCache: (...a: any[]) => clearTextareaDiceCache(...a),
    getComposerTextarea: (...a: any[]) => getComposerTextarea(...a),
    getCore: (...a: any[]) => getCore(...a),
    readTextareaVisibleValue: (...a: any[]) => readTextareaVisibleValue(...a),
    setTextareaValueAndNotify: (...a: any[]) => setTextareaValueAndNotify(...a),
    syncTextareaDiceCacheFromVisibleText: (...a: any[]) => syncTextareaDiceCacheFromVisibleText(...a),
  });

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
  const triggerGenerationAfterDirectSend = createTriggerGenerationAfterDirectSend({
    findRuntimeFunction: (...a: any[]) => findRuntimeFunction(...a),
    findSillyTavernSlashRunner: (...a: any[]) => findSillyTavernSlashRunner(...a),
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
  const CUSTOM_ROLL_MODE = createCustomRollMode({

  });
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
  const isDeprecatedBuiltinRegexRule = createIsDeprecatedBuiltinRegexRule({
    getDEPRECATED_BUILTIN_REGEX_RULE_IDS: () => DEPRECATED_BUILTIN_REGEX_RULE_IDS,
  });
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
  const LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = createLegacyDefaultQuickCheckExcludeKeywords({
    getDEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS: () => DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS,
  });

  const isSameKeywordSet = createIsSameKeywordSet({

  });

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

  const normalizeRenderPresetStringList = createNormalizeRenderPresetStringList({

  });

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
  const getPlayerName = createGetPlayerName({
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData,
  });

  // [新增] 获取 SillyTavern Persona 名称（用于显示）
  const getPersonaName = createGetPersonaName({

  });

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = createGetDisplayPlayerName({
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
  });

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

  const DICE_STATS_SCOPE_LABELS = createDiceStatsScopeLabels({

  });

  const isDiceStatsScopeUnavailable = createIsDiceStatsScopeUnavailable({

  });

  const renderDiceHistoryStatsHtml = createRenderDiceHistoryStatsHtml({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
    isDiceStatsScopeUnavailable: (...a: any[]) => isDiceStatsScopeUnavailable(...a),
    DICE_STATS_SCOPE_LABELS: DICE_STATS_SCOPE_LABELS,
  });

  type AvatarImageColorSource = 'manual' | 'auto';

  const normalizeAvatarHexColor = createNormalizeAvatarHexColor({

  });

  const clampAvatarNumber = createClampAvatarNumber({

  });

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

  const getAvatarFallbackColor = createGetAvatarFallbackColor({
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
  });

  const isLikelyAvatarSkinTone = createIsLikelyAvatarSkinTone({

  });

  const normalizeInferredAvatarColor = createNormalizeInferredAvatarColor({
    hslToAvatarHex: (...a: any[]) => hslToAvatarHex(...a),
    rgbToAvatarHsl: (...a: any[]) => rgbToAvatarHsl(...a),
  });

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
  const NameAliasRegistry = createNameAliasRegistryInstance({
    getAvatarManager: () => AvatarManager,
  });

  const USER_NODE_KEY = '{{user}}';
  const USER_PLACEHOLDER_KEYS = [USER_NODE_KEY, '<user>'];

  const isUserPlaceholderKey = createIsUserPlaceholderKey({
    getUSER_PLACEHOLDER_KEYS: () => USER_PLACEHOLDER_KEYS,
  });

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

  const normalizeCharacterNameForCompare = createNormalizeCharacterNameForCompare({

  });

  const pushUniqueNameCandidate = createPushUniqueNameCandidate({

  });

  const getAvatarManualAliases = createGetAvatarManualAliases({
    getAvatarManager: () => AvatarManager,
  });

  const getCharacterNameCandidates = createGetCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    NameAliasRegistry: NameAliasRegistry,
  });

  const getUserCharacterNameCandidates = createGetUserCharacterNameCandidates({
    getAvatarManualAliases: (...a: any[]) => getAvatarManualAliases(...a),
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getDisplayPlayerName: (...a: any[]) => getDisplayPlayerName(...a),
    getPersonaName: (...a: any[]) => getPersonaName(...a),
    getPlayerName: (...a: any[]) => getPlayerName(...a),
    pushUniqueNameCandidate: (...a: any[]) => pushUniqueNameCandidate(...a),
    getUSER_PLACEHOLDER_KEYS: () => USER_PLACEHOLDER_KEYS,
  });

  const isUserCharacterName = createIsUserCharacterName({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    getUserCharacterNameCandidates: (...a: any[]) => getUserCharacterNameCandidates(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

  const resolveCanonicalCharacterName = createResolveCanonicalCharacterName({
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    getNameAliasRegistry: () => NameAliasRegistry,
  });

  const characterNamesMatch = createCharacterNamesMatch({
    getCharacterNameCandidates: (...a: any[]) => getCharacterNameCandidates(...a),
    isUserCharacterName: (...a: any[]) => isUserCharacterName(...a),
    normalizeCharacterNameForCompare: (...a: any[]) => normalizeCharacterNameForCompare(...a),
  });

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

  const scheduleDialogueIndentRender = createScheduleDialogueIndentRender({
    getDialogueIndentRenderer: () => dialogueIndentRenderer,
  });
  const refreshDialogueIndentRender = createRefreshDialogueIndentRender({
    getDialogueIndentRenderer: () => dialogueIndentRenderer,
  });

  const isPlayerTableName = createIsPlayerTableName({

  });

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
  const renderIcon = createRenderIcon({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getLocationEmoji = createGetLocationEmoji({

  });

  // 获取地点名的所有候选emoji（用于去重分配）
  const getEmojiCandidates = createGetEmojiCandidates({

  });

  // 批量分配emoji，实现去重（最短名称优先）
  const resolveBatchLocationEmojis = createResolveBatchLocationEmojis({
    getEmojiCandidates: (...a: any[]) => getEmojiCandidates(...a),
  });

  const getElementEmoji = createGetElementEmoji({

  });

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

  const renderAsyncImageIconSlotContent = createRenderAsyncImageIconSlotContent({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

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

  const renderGachaItemIconContent = createRenderGachaItemIconContent({
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
  });

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

  const getDiceConfig = createGetDiceConfig({

  });
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





  const isAttributeQuickSelectTarget = createIsAttributeQuickSelectTarget({

  });

  const cloneQuickSelectNameMapping = createCloneQuickSelectNameMapping({

  });

  const normalizeAttributeQuickSelectConfig = createNormalizeAttributeQuickSelectConfig({
    cloneQuickSelectNameMapping: (...a: any[]) => cloneQuickSelectNameMapping(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const applyAttributeQuickSelectDefaults = createApplyAttributeQuickSelectDefaults({
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
  });

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

  const isAdvancedPresetRecord = createIsAdvancedPresetRecord({

  });

  const hasAdvancedPresetFieldConfig = createHasAdvancedPresetFieldConfig({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
  });
  const parseAdvancedPresetJsonCandidate = createParseAdvancedPresetJsonCandidate({
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
  });

  const extractAdvancedPresetJsonCandidates = createExtractAdvancedPresetJsonCandidates({

  });

  const parseAdvancedPresetSourceText = createParseAdvancedPresetSourceText({
    extractAdvancedPresetJsonCandidates: (...a: any[]) => extractAdvancedPresetJsonCandidates(...a),
    parseAdvancedPresetJsonCandidate: (...a: any[]) => parseAdvancedPresetJsonCandidate(...a),
  });

  const normalizeAdvancedPresetNotes = createNormalizeAdvancedPresetNotes({

  });

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

  const normalizeAdvancedPresetData = createNormalizeAdvancedPresetData({
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    cloneAdvancedPresetFieldWithDefaults: (...a: any[]) => cloneAdvancedPresetFieldWithDefaults(...a),
    compareVersion: (...a: any[]) => compareVersion(...a),
    getPRESET_FORMAT_VERSION: () => PRESET_FORMAT_VERSION,
    hasAdvancedPresetFieldConfig: (...a: any[]) => hasAdvancedPresetFieldConfig(...a),
  });

  const pushAdvancedPresetIssue = createPushAdvancedPresetIssue({

  });

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

  const readAdvancedPresetContextTags = createReadAdvancedPresetContextTags({

  });

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

  const readAdvancedPresetPolicyNumber = createReadAdvancedPresetPolicyNumber({

  });

  const applyAdvancedPresetOutcomePolicy = createApplyAdvancedPresetOutcomePolicy({
    readAdvancedPresetPolicyNumber: (...a: any[]) => readAdvancedPresetPolicyNumber(...a),
  });

  const getAdvancedPresetDisplayOutcome = createGetAdvancedPresetDisplayOutcome({

  });

  const validateAdvancedPresetOutcomes = createValidateAdvancedPresetOutcomes({
    buildAdvancedPresetEvaluationContext: (...a: any[]) => buildAdvancedPresetEvaluationContext(...a),
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
    isAdvancedPresetRecord: (...a: any[]) => isAdvancedPresetRecord(...a),
    pushAdvancedPresetIssue: (...a: any[]) => pushAdvancedPresetIssue(...a),
  });

  const isAdvancedPresetNumericLike = createIsAdvancedPresetNumericLike({

  });

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

  const getAdvancedPresetErrorMessage = createGetAdvancedPresetErrorMessage({

  });

  const buildDashboardPresetAgentPrompt = createBuildDashboardPresetAgentPrompt({

  });
  const buildActionPresetAgentPrompt = createBuildActionPresetAgentPrompt({});


  const buildRenderPresetAgentPrompt = createBuildRenderPresetAgentPrompt({

  });
  const buildTableTemplateRequirementPresetAgentPrompt = createBuildTableTemplateRequirementPresetAgentPrompt({});


  const buildGachaCatalogAgentPrompt = createBuildGachaCatalogAgentPrompt({

  });

  const BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS = createBuiltinTableTemplateRequirementPresets({
    createBuiltinTableTemplateRequirementPreset: (...a: any[]) => createBuiltinTableTemplateRequirementPreset(...a),
    getDefaultTableTemplateRequirementRaw: () => defaultTableTemplateRequirementRaw,
  });

  const getTableTemplateRequirementPresetStats = (preset): { sheetCount: number; headerCount: number } => {
    const sheets = getRequirementInspectionSheets(preset?.template || {});
    return {
      sheetCount: sheets.length,
      headerCount: sheets.reduce((total, sheet) => total + Math.max(0, sheet.headers.length - 1), 0),
    };
  };

  const parseTableTemplateRequirementPresetJson = createParseTableTemplateRequirementPresetJson({
    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
  });

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
  const replaceTag = createReplaceTag({

  });

  const getCheckSuggestionPresetById = createGetCheckSuggestionPresetById({
    getAdvancedDicePresetManager: () => AdvancedDicePresetManager,
  });

  const buildAutoCheckSuggestionGuide = createBuildAutoCheckSuggestionGuide({
    AdvancedDicePresetManager: AdvancedDicePresetManager,
  });

  const buildCheckSuggestionGuide = createBuildCheckSuggestionGuide({
    buildAutoCheckSuggestionGuide: (...a: any[]) => buildAutoCheckSuggestionGuide(...a),
  });

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

  const buildAttributeRulesContent = createBuildAttributeRulesContent({

    generateAttributeScale: (...a: any[]) => generateAttributeScale(...a),
    generateRPGAttributes: (...a: any[]) => generateRPGAttributes(...a),
    getAttributeRangeBounds: (...a: any[]) => getAttributeRangeBounds(...a),
    getAttributeRulePresetById: (...a: any[]) => getAttributeRulePresetById(...a),
  });

  const isRuleTemplateSheetWithNote = createIsRuleTemplateSheetWithNote({

  });

  const getRuleTagSnippet = createGetRuleTagSnippet({

  });

  const replaceRuleTagInTemplate = createReplaceRuleTagInTemplate({
    getRuleTagSnippet: (...a: any[]) => getRuleTagSnippet(...a),
    isRuleTemplateSheetWithNote: (...a: any[]) => isRuleTemplateSheetWithNote(...a),
    replaceTag: (...a: any[]) => replaceTag(...a),
  });

  const syncAttributeRuleTagsInTemplate = createSyncAttributeRuleTagsInTemplate({
    buildAttributeRulesContent: (...a: any[]) => buildAttributeRulesContent(...a),
    replaceRuleTagInTemplate: (...a: any[]) => replaceRuleTagInTemplate(...a),
  });

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
  const getCrazyModeConfig = createGetCrazyModeConfig({

  });

  // 保存疯狂模式配置
  const saveCrazyModeConfig = createSaveCrazyModeConfig({

  });

  // 判断是否触发疯狂模式
  const shouldTriggerCrazyMode = createShouldTriggerCrazyMode({
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
  });

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
  const judgeCrazyRollResult = createJudgeCrazyRollResult({

  });

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

  const evaluateConditionNumber = createEvaluateConditionNumber({
    evaluateCondition: (...a: any[]) => evaluateCondition(...a),
  });

  /**
   * 判断条件表达式是否为复杂条件 (包含 && 或 ||)
   * @param expr - 条件表达式字符串
   * @returns 如果包含 && 或 || 返回 true, 否则返回 false
   */
  const isComplexCondition = createIsComplexCondition({

  });

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
  const DEFAULT_OUTPUT_TEMPLATE = createDefaultOutputTemplate({

  });

  // 默认对抗检定输出模板
  const DEFAULT_CONTEST_OUTPUT_TEMPLATE = createDefaultContestOutputTemplate({

  });

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
  const DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES = createDashboardRelationshipGraphSourceModes({

  });
  const DASHBOARD_PRESET_FILTER_KEYS = createDashboardPresetFilterKeys({

  });
  const DASHBOARD_PRESET_ADDITIONAL_COLUMNS = createDashboardPresetAdditionalColumns({

  });



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

  const isRecordValue = createIsRecordValue({

  });

  const normalizeDashboardKeywordArray = createNormalizeDashboardKeywordArray({

  });

  const normalizeDashboardOptionalStringArray = createNormalizeDashboardOptionalStringArray({

  });

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

  const getJsonLikeErrorMessage = createGetJsonLikeErrorMessage({

  });

  const stripJsoncSyntax = createStripJsoncSyntax({
    stripJsonComments: (...a: any[]) => stripJsonComments(...a),
  });

  const parseJsoncValue = createParseJsoncValue({
    stripJsoncSyntax: (...a: any[]) => stripJsoncSyntax(...a),
  });

  const parseJsoncDocument = createParseJsoncDocument({
    parseJsoncValue: (...a: any[]) => parseJsoncValue(...a),
  });

  const parseJsoncRecord = createParseJsoncRecord({
    isRecordValue: (...a: any[]) => isRecordValue(...a),
    parseJsoncDocument: (...a: any[]) => parseJsoncDocument(...a),
  });

  const downloadTextFile = createDownloadTextFile({

  });

  const downloadJsonFile = createDownloadJsonFile({
    downloadTextFile: (...a: any[]) => downloadTextFile(...a),
    getJSON_FILE_MIME: () => JSON_FILE_MIME,
  });

  const downloadJsoncFile = createDownloadJsoncFile({
    downloadTextFile: (...a: any[]) => downloadTextFile(...a),
    getJSONC_FILE_MIME: () => JSONC_FILE_MIME,
  });

  const downloadAiPromptFile = createDownloadAiPromptFile({
    downloadTextFile: (...a: any[]) => downloadTextFile(...a),
    getMARKDOWN_FILE_MIME: () => MARKDOWN_FILE_MIME,
  });

  const readTextFile = createReadTextFile({

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

  const parseDashboardPresetJson = createParseDashboardPresetJson({

    parseJsoncRecord: (...a: any[]) => parseJsoncRecord(...a),
    getDASHBOARD_PRESET_FORMAT: () => DASHBOARD_PRESET_FORMAT,
    normalizeDashboardPresetModules: (...a: any[]) => normalizeDashboardPresetModules(...a),
  });

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

  const getActiveDashboardRelationshipGraphSources = createGetActiveDashboardRelationshipGraphSources({
    getDASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY: () => DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
    getDashboardPresetManager: () => DashboardPresetManager,
  });

  const getDashboardRuntimeConfig = createGetDashboardRuntimeConfig({
    cloneDashboardConfig: (...a: any[]) => cloneDashboardConfig(...a),
    DASHBOARD_PRESET_ADDITIONAL_COLUMNS: DASHBOARD_PRESET_ADDITIONAL_COLUMNS,
    DASHBOARD_PRESET_FILTER_KEYS: DASHBOARD_PRESET_FILTER_KEYS,
    DASHBOARD_TABLE_CONFIG: DASHBOARD_TABLE_CONFIG,
    DashboardPresetManager: DashboardPresetManager,
    getDashboardRuntimeConfigCache: () => dashboardRuntimeConfigCache,
    setDashboardRuntimeConfigCache: (v: any) => { dashboardRuntimeConfigCache = v; },
  });

  const getDashboardModuleConfig = createGetDashboardModuleConfig({
    getDashboardRuntimeConfig: (...a: any[]) => getDashboardRuntimeConfig(...a),
  });

  // 仪表盘数据解析器
  const DashboardDataParser = createDashboardDataParser({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
  });
  const getGMConfig = createGetGMConfig({
    ActionPresetManager: ActionPresetManager,
  });

  // 统一的结果标签样式生成函数 - 返回 CSS 类名
  const getResultBadgeClass = createGetResultBadgeClass({

  });

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
  const GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS = createGlobalInteractionNameHeaderKeywords({

  });
  const GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS = createGlobalInteractionNonNameHeaderKeywords({

  });
  const GLOBAL_INTERACTION_INDEX_HEADERS = ['序号', '编号', '索引', 'index', 'order', 'id', '#'];
  const GLOBAL_INTERACTION_DEBUG_PREFIX = '[DICE][GlobalInteractionsDebug]';
  const GLOBAL_INTERACTION_DEFAULT_SECTION_META = createGlobalInteractionDefaultSectionMeta({

  });


  const debugGlobalInteraction = createDebugGlobalInteraction({
    getGLOBAL_INTERACTION_DEBUG_PREFIX: () => GLOBAL_INTERACTION_DEBUG_PREFIX,
  });

  const isRecord = createIsRecord({

  });

  const isTwoDimensionalArray = createIsTwoDimensionalArray({

  });
  const normalizeInteractionLabel = createNormalizeInteractionLabel({

  });

  const dedupeInteractionActions = createDedupeInteractionActions({
    normalizeInteractionLabel: (...a: any[]) => normalizeInteractionLabel(...a),
  });

  const getStringLikeCellText = createGetStringLikeCellText({

  });

  const isPureIndexCell = createIsPureIndexCell({
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    getGLOBAL_INTERACTION_INDEX_HEADERS: () => GLOBAL_INTERACTION_INDEX_HEADERS,
  });

  const normalizeGlobalInteractionHeader = createNormalizeGlobalInteractionHeader({

  });

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

  const buildGlobalInteractionSearchText = createBuildGlobalInteractionSearchText({

  });

  const normalizeGlobalInteractionCategoryText = createNormalizeGlobalInteractionCategoryText({

  });
  const getGlobalInteractionRuleKeywords = createGetGlobalInteractionRuleKeywords({
    isRecord: (...a: any[]) => isRecord(...a),
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
  });

  const getGlobalInteractionActionRuleGroups = createGetGlobalInteractionActionRuleGroups({
    getGMConfig: (...a: any[]) => getGMConfig(...a),
    getGlobalInteractionRuleKeywords: (...a: any[]) => getGlobalInteractionRuleKeywords(...a),
  });

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

  const extractNumericValue = createExtractNumericValue({

  });

  const parseAttributeString = createParseAttributeString({

  });
  // 解析人际关系字符串，推荐使用冒号格式，同时兼容旧式括号格式:
  // 推荐格式: "人名:关系描述;人名:关系描述" 或 "与人名:关系描述;与人名:关系描述"
  // 兼容格式: "人名(关系标签);人名(关系)"
  const parseRelationshipString = createParseRelationshipString({

  });

  // [新增] 检测是否是人际关系格式
  const isRelationshipCell = createIsRelationshipCell({

  });

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
  const clearModalStack = createClearModalStack({
    getModalStack: () => modalStack,
  });

  let currentDiffMap = new Set();
  let observer = null;
  let _boundRenderHandler = null;
  let _boundReviewBaselineHandler = null;

  // --- 全局状态变量 ---
  let cachedRawData = null;
  let hasUnsavedChanges = false;
  // [修复] 存储待删除行的索引（按表格分组）
  let pendingDeletions: Record<string, number[]> = {};
  const getPendingDeletions = createGetPendingDeletions({
    getPendingDeletions: () => pendingDeletions,
  });
  const clearPendingDeletions = createClearPendingDeletions({
    getPendingDeletions: () => pendingDeletions,
    setPendingDeletions: (v: any) => { pendingDeletions = v; },
  });
  const createSheetDataFingerprint = createCreateSheetDataFingerprint({

  });

  const isSameSheetData = createIsSameSheetData({
    createSheetDataFingerprint: (...a: any[]) => createSheetDataFingerprint(...a),
  });

  const AUTO_REGEX_TRANSFORM_COOLDOWN_MS = 5000;
  let lastAutoRegexTransformKey = '';
  let lastAutoRegexTransformAt = 0;
  const createRegexRuleSignature = createCreateRegexRuleSignature({

  });
  const createAutoRegexTransformKey = createCreateAutoRegexTransformKey({
    createRegexRuleSignature: (...a: any[]) => createRegexRuleSignature(...a),
    createSheetDataFingerprint: (...a: any[]) => createSheetDataFingerprint(...a),
  });
  const shouldSkipAutoRegexTransform = createShouldSkipAutoRegexTransform({
    getLastAutoRegexTransformAt: () => lastAutoRegexTransformAt,
    getLastAutoRegexTransformKey: () => lastAutoRegexTransformKey,
    getAUTO_REGEX_TRANSFORM_COOLDOWN_MS: () => AUTO_REGEX_TRANSFORM_COOLDOWN_MS,
  });

  const rememberAutoRegexTransform = createRememberAutoRegexTransform({
    getLastAutoRegexTransformKey: () => lastAutoRegexTransformKey,
    setLastAutoRegexTransformKey: (v: any) => { lastAutoRegexTransformKey = v; },
    getLastAutoRegexTransformAt: () => lastAutoRegexTransformAt,
    setLastAutoRegexTransformAt: (v: any) => { lastAutoRegexTransformAt = v; },
  });

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
  const updateValidationIndicator = createUpdateValidationIndicator({
    getCore: (...a: any[]) => getCore(...a),
  });

  // --- [重构] 上下文指纹工具 ---
  const getCurrentContextFingerprint = createGetCurrentContextFingerprint({

  });

  // 全局状态追踪 (已清理死代码)


  const COLLAPSE_STYLES = ['bar', 'pill', 'floating'] as const;
  type CollapseStyle = (typeof COLLAPSE_STYLES)[number];

  const normalizeCollapseStyle = createNormalizeCollapseStyle({
    getCOLLAPSE_STYLES: () => COLLAPSE_STYLES,
  });

  const getNavigationFontMetrics = createGetNavigationFontMetrics({

  });

  const FONTS = createFontsList({

  });

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

  const getTavernHostDocument = createGetTavernHostDocument({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const createElementFromHtml = createCreateElementFromHtml({

  });

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
  const ACU_DATABASE_MANUAL_UPDATE_API_METHODS = createAcuDatabaseManualUpdateApiMethods({

  });
  const ACU_DATABASE_V2_ROOT_SELECTOR = '#acu-app-v2, .acu-v2-app';
  const ACU_DATABASE_FORM_FILL_NAV_SELECTOR = '[data-page-id="form-fill"]';
  const ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR = '#form-fill-manual-panel';
  const ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR = createAcuDatabaseManualUpdateActionSelector({

  });
  const ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR = createAcuDatabaseLegacyManualUpdateButtonSelector({

  });
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS = createAcuDatabaseManualUpdateButtonWaitMs({

  });
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS = createAcuDatabaseManualUpdateButtonPollMs({

  });

  const collectAccessibleRuntimeWindows = createCollectAccessibleRuntimeWindows({
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
  });

  const runMaybeAsyncDatabaseUiOpener = createRunMaybeAsyncDatabaseUiOpener({

  });

  const openDatabaseNewUiViaApi = createOpenDatabaseNewUiViaApi({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
    getACU_DATABASE_NEW_UI_API_METHODS: () => ACU_DATABASE_NEW_UI_API_METHODS,
  });

  const openDatabaseNewUiViaMenuEntry = createOpenDatabaseNewUiViaMenuEntry({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getACU_DATABASE_NEW_UI_MENU_SELECTOR: () => ACU_DATABASE_NEW_UI_MENU_SELECTOR,
  });

  const openLegacyDatabaseSettings = createOpenLegacyDatabaseSettings({
    getCore: (...a: any[]) => getCore(...a),
  });

  const openDatabaseInterface = createOpenDatabaseInterface({
    openDatabaseNewUiViaApi: (...a: any[]) => openDatabaseNewUiViaApi(...a),
    openDatabaseNewUiViaMenuEntry: (...a: any[]) => openDatabaseNewUiViaMenuEntry(...a),
    openLegacyDatabaseSettings: (...a: any[]) => openLegacyDatabaseSettings(...a),
  });

  type DatabaseVisualizerNewUiOpenResult = 'opened' | 'unavailable' | 'failed';

  const openDatabaseVisualizerNewUiViaApi = createOpenDatabaseVisualizerNewUiViaApi({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
  });

  const openLegacyDatabaseVisualizer = createOpenLegacyDatabaseVisualizer({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    runMaybeAsyncDatabaseUiOpener: (...a: any[]) => runMaybeAsyncDatabaseUiOpener(...a),
  });

  const openDatabaseVisualizerInterface = createOpenDatabaseVisualizerInterface({
    openDatabaseVisualizerNewUiViaApi: (...a: any[]) => openDatabaseVisualizerNewUiViaApi(...a),
    openLegacyDatabaseVisualizer: (...a: any[]) => openLegacyDatabaseVisualizer(...a),
  });

  type DatabaseManualUpdateResult =
    | { status: 'updated'; source: string }
    | { status: 'unavailable' }
    | { status: 'failed'; error?: unknown; source?: string };

  const waitForDatabaseUiTick = createWaitForDatabaseUiTick({
  });

  const isElementVisibleInLayout = createIsElementVisibleInLayout({

  });

  const normalizeDatabaseUiText = createNormalizeDatabaseUiText({

  });

  const isDatabaseManualUpdateActionButton = createIsDatabaseManualUpdateActionButton({
    isDatabaseManualUpdateButtonText: (...a: any[]) => isDatabaseManualUpdateButtonText(...a),
    normalizeDatabaseUiText: (...a: any[]) => normalizeDatabaseUiText(...a),
    getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR,
  });

  const isDatabaseButtonDisabled = createIsDatabaseButtonDisabled({

  });
  const hasDatabaseNewUiRuntime = createHasDatabaseNewUiRuntime({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getACU_DATABASE_V2_ROOT_SELECTOR: () => ACU_DATABASE_V2_ROOT_SELECTOR,
    getACU_DATABASE_NEW_UI_MENU_SELECTOR: () => ACU_DATABASE_NEW_UI_MENU_SELECTOR,
  });

  const findDatabaseNewUiManualUpdateButton = createFindDatabaseNewUiManualUpdateButton({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    isElementVisibleInLayout: (...a: any[]) => isElementVisibleInLayout(...a),
    isDatabaseManualUpdateActionButton: (...a: any[]) => isDatabaseManualUpdateActionButton(...a),
    normalizeDatabaseUiText: (...a: any[]) => normalizeDatabaseUiText(...a),
    isDatabaseButtonDisabled: (...a: any[]) => isDatabaseButtonDisabled(...a),
    getACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR,
  });

  const waitForDatabaseNewUiManualUpdateButton = createWaitForDatabaseNewUiManualUpdateButton({
    findDatabaseNewUiManualUpdateButton: (...a: any[]) => findDatabaseNewUiManualUpdateButton(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

  const hasDatabaseManualUpdateSurface = createHasDatabaseManualUpdateSurface({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    isDatabaseManualUpdateActionButton: (...a: any[]) => isDatabaseManualUpdateActionButton(...a),
    isElementVisibleInLayout: (...a: any[]) => isElementVisibleInLayout(...a),
    getACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR,
    getACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR: () => ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR,
  });

  const waitForDatabaseManualUpdateSurface = createWaitForDatabaseManualUpdateSurface({
    hasDatabaseManualUpdateSurface: (...a: any[]) => hasDatabaseManualUpdateSurface(...a),
    waitForDatabaseUiTick: (...a: any[]) => waitForDatabaseUiTick(...a),
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS,
    ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS: ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  });

  const clickDatabaseNewUiFormFillNavigation = createClickDatabaseNewUiFormFillNavigation({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    isElementVisibleInLayout: (...a: any[]) => isElementVisibleInLayout(...a),
    getACU_DATABASE_FORM_FILL_NAV_SELECTOR: () => ACU_DATABASE_FORM_FILL_NAV_SELECTOR,
  });

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

  const runDatabaseManualUpdateViaLegacyButton = createRunDatabaseManualUpdateViaLegacyButton({
    collectAccessibleRuntimeWindows: (...a: any[]) => collectAccessibleRuntimeWindows(...a),
    getAccessibleDocument: (...a: any[]) => getAccessibleDocument(...a),
    getACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR: () => ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR,
  });

  const runDatabaseManualUpdate = createRunDatabaseManualUpdate({
    hasDatabaseNewUiRuntime: (...a: any[]) => hasDatabaseNewUiRuntime(...a),
    runDatabaseManualUpdateViaApi: (...a: any[]) => runDatabaseManualUpdateViaApi(...a),
    runDatabaseManualUpdateViaLegacyButton: (...a: any[]) => runDatabaseManualUpdateViaLegacyButton(...a),
    runDatabaseManualUpdateViaNewUiButton: (...a: any[]) => runDatabaseManualUpdateViaNewUiButton(...a),
  });

  const getDatabaseManualUpdateErrorMessage = createGetDatabaseManualUpdateErrorMessage({

  });

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

  const CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS = createCustomTableNameIconDashboardModuleContexts({

  });

  const getDashboardModuleKeysForTableName = createGetDashboardModuleKeysForTableName({
    getDashboardRuntimeConfig: (...a: any[]) => getDashboardRuntimeConfig(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

  const resolveDashboardGlobalInteractionSectionKind = createResolveDashboardGlobalInteractionSectionKind({
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getDASHBOARD_MODULE_SECTION_KIND: () => DASHBOARD_MODULE_SECTION_KIND,
  });

  const resolveDashboardCustomTableNameIconContextInfo = createResolveDashboardCustomTableNameIconContextInfo({
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getCUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS: () => CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS,
  });

  const resolveDashboardCustomTableNameIconRowName = createResolveDashboardCustomTableNameIconRowName({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    getDashboardModuleKeysForTableName: (...a: any[]) => getDashboardModuleKeysForTableName(...a),
    getStringLikeCellText: (...a: any[]) => getStringLikeCellText(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const resolveCustomTableNameIconRowName = createResolveCustomTableNameIconRowName({
    resolveDashboardCustomTableNameIconRowName: (...a: any[]) => resolveDashboardCustomTableNameIconRowName(...a),
    resolveGlobalInteractionRowTitle: (...a: any[]) => resolveGlobalInteractionRowTitle(...a),
  });

  const CUSTOM_TABLE_NAME_ICON_MODULE_IDS = createCustomTableNameIconModuleIds({

  });
  const CUSTOM_TABLE_NAME_ICON_SECTIONS = createCustomTableNameIconSections({

  });
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS = createCustomTableNameIconAllowedPanelSections({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_MODULES = createCustomTableNameIconDeniedModules({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS = createCustomTableNameIconDeniedSections({

  });
  const CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES = createCustomTableNameIconDeniedTableNames({

  });

  const isCustomTableNameIconModuleId = createIsCustomTableNameIconModuleId({
    getCUSTOM_TABLE_NAME_ICON_MODULE_IDS: () => CUSTOM_TABLE_NAME_ICON_MODULE_IDS,
  });

  const isCustomTableNameIconSection = createIsCustomTableNameIconSection({
    getCUSTOM_TABLE_NAME_ICON_SECTIONS: () => CUSTOM_TABLE_NAME_ICON_SECTIONS,
  });
  const normalizeCustomTableNameIconKeyPart = createNormalizeCustomTableNameIconKeyPart({

  });

  const isCustomTableNameIconTableDenied = createIsCustomTableNameIconTableDenied({
    isNpcLikeTableName: (...a: any[]) => isNpcLikeTableName(...a),
    isPlayerTableName: (...a: any[]) => isPlayerTableName(...a),
    resolveDashboardGlobalInteractionSectionKind: (...a: any[]) => resolveDashboardGlobalInteractionSectionKind(...a),
    getCUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES: () => CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES,
  });

  const normalizeCustomTableNameIconContext = createNormalizeCustomTableNameIconContext({
    isCustomTableNameIconModuleId: (...a: any[]) => isCustomTableNameIconModuleId(...a),
    isCustomTableNameIconSection: (...a: any[]) => isCustomTableNameIconSection(...a),
    normalizeCustomTableNameIconKeyPart: (...a: any[]) => normalizeCustomTableNameIconKeyPart(...a),
  });

  const getCustomTableNameIconContextKey = createGetCustomTableNameIconContextKey({
    normalizeCustomTableNameIconKeyPart: (...a: any[]) => normalizeCustomTableNameIconKeyPart(...a),
  });

  const normalizeCustomTableNameIconEntry = createNormalizeCustomTableNameIconEntry({
    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
    normalizeCustomTableNameIconContext: (...a: any[]) => normalizeCustomTableNameIconContext(...a),
  });

  const CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES = createCustomTableNameIconAllowedLocalMimeTypes({

  });
  const CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE = 1024 * 1024;

  const isCustomTableNameIconSvgMimeType = createIsCustomTableNameIconSvgMimeType({

  });

  const isCustomTableNameIconImageUrlValid = createIsCustomTableNameIconImageUrlValid({
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
  });

  const getCustomTableNameIconImageUrlValidationError = createGetCustomTableNameIconImageUrlValidationError({
    getRemoteImageUrlValidationError: (...a: any[]) => getRemoteImageUrlValidationError(...a),
  });

  const getCustomTableNameIconLocalFileValidationError = createGetCustomTableNameIconLocalFileValidationError({
    isCustomTableNameIconSvgMimeType: (...a: any[]) => isCustomTableNameIconSvgMimeType(...a),
    getCUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES: () => CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES,
    getCUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE: () => CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE,
  });


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

  const CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS = createCustomTableNameIconManagerModuleLabels({

  });

  const CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS = createCustomTableNameIconManagerSectionLabels({

  });

  const CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION = createCustomTableNameIconManagerDirectModuleBySection({

  });

  const getCustomTableNameIconManagerModuleLabel = createGetCustomTableNameIconManagerModuleLabel({
    getCUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS: () => CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS,
  });

  const getCustomTableNameIconManagerSectionLabel = createGetCustomTableNameIconManagerSectionLabel({
    getCUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS: () => CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS,
  });

  const getCustomTableNameIconManagerSourceLabel = createGetCustomTableNameIconManagerSourceLabel({

  });

  const getCustomTableNameIconManagerContextLabel = createGetCustomTableNameIconManagerContextLabel({
    getCustomTableNameIconManagerModuleLabel: (...a: any[]) => getCustomTableNameIconManagerModuleLabel(...a),
    getCustomTableNameIconManagerSectionLabel: (...a: any[]) => getCustomTableNameIconManagerSectionLabel(...a),
    normalizeGlobalInteractionCategoryText: (...a: any[]) => normalizeGlobalInteractionCategoryText(...a),
  });

  const getCustomTableNameIconManagerLocalKey = createGetCustomTableNameIconManagerLocalKey({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
  });

  const getCustomTableNameIconManagerRawSheets = createGetCustomTableNameIconManagerRawSheets({
    getTableData: (...a: any[]) => getTableData(...a),
    isRecord: (...a: any[]) => isRecord(...a),
    isTwoDimensionalArray: (...a: any[]) => isTwoDimensionalArray(...a),
  });

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

  const getCustomTableNameIconManagerEntryAsset = createGetCustomTableNameIconManagerEntryAsset({

    isCustomTableNameIconImageUrlValid: (...a: any[]) => isCustomTableNameIconImageUrlValid(...a),
  });

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

  const buildCustomTableNameIconPack = createBuildCustomTableNameIconPack({
    buildCustomTableNameIconPackEntry: (...a: any[]) => buildCustomTableNameIconPackEntry(...a),
    getCUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION: () => CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    getCustomTableNameIconStoreManager: () => CustomTableNameIconStoreManager,
  });

  const downloadCustomTableNameIconPack = createDownloadCustomTableNameIconPack({

  });

  const analyzeCustomTableNameIconPackImport = createAnalyzeCustomTableNameIconPackImport({
    getCustomTableNameIconContextKey: (...a: any[]) => getCustomTableNameIconContextKey(...a),
    getCustomTableNameIconImageUrlValidationError: (...a: any[]) => getCustomTableNameIconImageUrlValidationError(...a),
    getCustomTableNameIconManagerLocalKey: (...a: any[]) => getCustomTableNameIconManagerLocalKey(...a),
    isCustomTableNameIconContextAllowed: (...a: any[]) => isCustomTableNameIconContextAllowed(...a),
    normalizeCustomTableNameIconPackEntry: (...a: any[]) => normalizeCustomTableNameIconPackEntry(...a),
    CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION: CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    CustomTableNameIconStoreManager: CustomTableNameIconStoreManager,
  });

  const getCustomTableNameIconPackImportSummaryText = createGetCustomTableNameIconPackImportSummaryText({

  });

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

  const handleCustomTableNameIconImageDBPagehide = createHandleCustomTableNameIconImageDBPagehide({

  });

  window.addEventListener('pagehide', handleCustomTableNameIconImageDBPagehide, { once: true });

  const isOptionTableName = tableName => String(tableName || '').includes('选项');
  const isCheckSuggestionTableName = tableName => String(tableName || '').includes('检定建议');

  const getOptionItemsFromTable = createGetOptionItemsFromTable({

  });

  const renderOptionButtonHtml = createRenderOptionButtonHtml({
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderCheckSuggestionOptionButtonHtml = createRenderCheckSuggestionOptionButtonHtml({
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

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

  const getActiveTabState = createGetActiveTabState({

  });
  const saveActiveTabState = createSaveActiveTabState({
  });

  let cleanupGlobalInteractionOutsideCapture: (() => void) | null = null;

  const clearGlobalInteractionOutsideCapture = createClearGlobalInteractionOutsideCapture({
    getCleanupGlobalInteractionOutsideCapture: () => cleanupGlobalInteractionOutsideCapture,
    setCleanupGlobalInteractionOutsideCapture: (v: any) => { cleanupGlobalInteractionOutsideCapture = v; },
  });

  const cleanupGlobalInteractionFloatingMenus = createCleanupGlobalInteractionFloatingMenus({
    clearGlobalInteractionOutsideCapture: (...a: any[]) => clearGlobalInteractionOutsideCapture(...a),
    getCore: (...a: any[]) => getCore(...a),
  });

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

  const getSavedTableOrder = createGetSavedTableOrder({

  });
  const saveTableOrder = createSaveTableOrder({
  });
  const getCollapsedState = createGetCollapsedState({

  });
  const saveCollapsedState = createSaveCollapsedState({
  });
  // [新增] 选项面板独立折叠状态管理
  const getOptionsCollapsedState = createGetOptionsCollapsedState({

  });
  const saveOptionsCollapsedState = createSaveOptionsCollapsedState({
  });
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = createLoadSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = createSaveSnapshot({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  const saveCurrentDatabaseSnapshotAsReviewBaseline = createSaveCurrentDatabaseSnapshotAsReviewBaseline({
    getTableData: (...a: any[]) => getTableData(...a),
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    saveSnapshot: (...a: any[]) => saveSnapshot(...a),
  });

  // --- [新增] 移植的辅助函数 ---
  const getTableHeights = createGetTableHeights({

  });
  const saveTableHeights = createSaveTableHeights({
  });
  const normalizePanelHeightValue = createNormalizePanelHeightValue({
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const getPanelDisplayMaxHeight = createGetPanelDisplayMaxHeight({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getPANEL_VIEWPORT_TOP_GUTTER: () => PANEL_VIEWPORT_TOP_GUTTER,
  });

  const applyPanelDisplayMaxHeight = createApplyPanelDisplayMaxHeight({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
  });

  const clampPanelHeightToDisplay = createClampPanelHeightToDisplay({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
    getMAX_PANEL_HEIGHT: () => MAX_PANEL_HEIGHT,
    getMIN_PANEL_HEIGHT: () => MIN_PANEL_HEIGHT,
  });

  const getStoredPanelHeight = createGetStoredPanelHeight({
    getTableHeights: (...a: any[]) => getTableHeights(...a),
    normalizePanelHeightValue: (...a: any[]) => normalizePanelHeightValue(...a),
  });

  const clearPanelRequestedHeight = createClearPanelRequestedHeight({
    applyPanelDisplayMaxHeight: (...a: any[]) => applyPanelDisplayMaxHeight(...a),
  });

  const setPanelRequestedHeight = createSetPanelRequestedHeight({
    getPanelDisplayMaxHeight: (...a: any[]) => getPanelDisplayMaxHeight(...a),
    clampPanelHeightToDisplay: (...a: any[]) => clampPanelHeightToDisplay(...a),
    clearPanelRequestedHeight: (...a: any[]) => clearPanelRequestedHeight(...a),
  });

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

  const getTableStyles = createGetTableStyles({

  });
  const saveTableStyles = createSaveTableStyles({
  });
  const getHiddenTables = createGetHiddenTables({

  });
  const saveHiddenTables = createSaveHiddenTables({
  });
  const getReverseTables = createGetReverseTables({

  });
  const saveReverseTables = createSaveReverseTables({
  });

  const normalizeTableNameList = createNormalizeTableNameList({

  });

  const getNormalizedReverseTables = createGetNormalizedReverseTables({
    getReverseTables: (...a: any[]) => getReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
  });

  // 判断表格是否需要显示倒序按钮
  const shouldShowReverseButton = createShouldShowReverseButton({

  });

  // 判断表格当前是否为倒序
  const isTableReversed = createIsTableReversed({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
  });

  const areAllTablesReversed = createAreAllTablesReversed({
    getNormalizedReverseTables: (...a: any[]) => getNormalizedReverseTables(...a),
    normalizeTableNameList: (...a: any[]) => normalizeTableNameList(...a),
  });

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
  const getAttributesForCharacter = createGetAttributesForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
  });
  const normalizeAttributeName = createNormalizeAttributeName({

  });

  const resolveAttributeAliasName = createResolveAttributeAliasName({

    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    normalizeAttributeName: (...a: any[]) => normalizeAttributeName(...a),
  });

  const isSameAttributeAlias = createIsSameAttributeAlias({
    normalizeAttributeName: (...a: any[]) => normalizeAttributeName(...a),
  });

  const getAttributeEntryForCharacter = createGetAttributeEntryForCharacter({
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    resolveAttributeAliasName: (...a: any[]) => resolveAttributeAliasName(...a),
  });

  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = createGetAttributeValue({
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
  });

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

  const getAttributePresetMappedTarget = createGetAttributePresetMappedTarget({
    normalizeAttributeQuickSelectConfig: (...a: any[]) => normalizeAttributeQuickSelectConfig(...a),
    isAttributeQuickSelectTarget: (...a: any[]) => isAttributeQuickSelectTarget(...a),
  });

  const isQuickSelectTargetAvailable = createIsQuickSelectTargetAvailable({

  });

  const resolveQuickSelectTarget = createResolveQuickSelectTarget({
    getAdvancedPresetMappedTarget: (...a: any[]) => getAdvancedPresetMappedTarget(...a),
    getAttributePresetMappedTarget: (...a: any[]) => getAttributePresetMappedTarget(...a),
    isQuickSelectTargetAvailable: (...a: any[]) => isQuickSelectTargetAvailable(...a),
    getAttributePresetManager: () => AttributePresetManager,
  });

  const formatSignedModifier = createFormatSignedModifier({

  });

  const getNamedCheckParamText = createGetNamedCheckParamText({

  });

  const buildCheckValueText = createBuildCheckValueText({
    formatSignedModifier: (...a: any[]) => formatSignedModifier(...a),
    getAttributeEntryForCharacter: (...a: any[]) => getAttributeEntryForCharacter(...a),
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
  });

  const getNormalQuickSelectInputSelector = createGetNormalQuickSelectInputSelector({

  });
  // [新增] 标准6维属性名
  const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];

  /**
   * 获取当前规则的标准属性名列表
   */
  const getStandardAttrs = createGetStandardAttrs({
    getAttributePresetManager: () => AttributePresetManager,
    getSTANDARD_ATTRS: () => STANDARD_ATTRS,
  });

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
  const getSuccessLevel = createGetSuccessLevel({

  });

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

  const parseInSceneStatus = createParseInSceneStatus({

  });

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

  const findRelationGraphRelationColumnMatch = createFindRelationGraphRelationColumnMatch({
    findRelationGraphColumnIndex: (...a: any[]) => findRelationGraphColumnIndex(...a),
    getRELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS: () => RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS,
  });

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

  const pushDashboardNpcEntry = createPushDashboardNpcEntry({
    characterNamesMatch: (...a: any[]) => characterNamesMatch(...a),
  });

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

  const collectDashboardNpcEntriesFromTableResults = createCollectDashboardNpcEntriesFromTableResults({
    collectDashboardNpcEntriesFromTableResult: (...a: any[]) => collectDashboardNpcEntriesFromTableResult(...a),
  });

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

  const getCurrentChatAvatarNodes = createGetCurrentChatAvatarNodes({
    collectCurrentChatAvatarNodes: (...a: any[]) => collectCurrentChatAvatarNodes(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData,
  });

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
  const sanitizeUiConfig = createSanitizeUiConfig({
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
    getLEGACY_DB_THEME_SYNC_CONFIG_KEY: () => LEGACY_DB_THEME_SYNC_CONFIG_KEY,
  });

  const getConfig = createGetConfig({
    sanitizeUiConfig: (...a: any[]) => sanitizeUiConfig(...a),
    getLEGACY_DB_THEME_SYNC_CONFIG_KEY: () => LEGACY_DB_THEME_SYNC_CONFIG_KEY,
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
  });
  const saveConfig = createSaveConfig({
    getConfig: (...a: any[]) => getConfig(...a),
    applyConfigStyles: (...a: any[]) => applyConfigStyles(...a),
    sanitizeUiConfig: (...a: any[]) => sanitizeUiConfig(...a),
    get_configCache: () => _configCache,
    set_configCache: (v: any) => { _configCache = v; },
  });

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



  const DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT = createDiceConfigBackupPrivacyRiskText({

  });



  const DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY = 'gachaCatalogRecords';
  const DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY = 'tableTemplate';

  interface DiceConfigBackupTableTemplateApi {
    getTableTemplate?: () => unknown;
    importTemplateFromData?: (template: unknown, options?: { scope?: string }) => Promise<unknown> | unknown;
  }

  const DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY = createDiceConfigBackupActiveKeyToPresetKey({

  });

  const isDiceConfigBackupRecord = createIsDiceConfigBackupRecord({

  });
  const cloneDiceConfigBackupValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

  const getDiceConfigBackupModuleDefinition = createGetDiceConfigBackupModuleDefinition({
    getDICE_CONFIG_BACKUP_MODULES: () => DICE_CONFIG_BACKUP_MODULES,
  });

  const isDiceConfigBackupModuleId = createIsDiceConfigBackupModuleId({

  });

  const getDiceConfigBackupWarningCount = createGetDiceConfigBackupWarningCount({

  });

  const formatDiceConfigBackupSelectedModuleRiskLines = createFormatDiceConfigBackupSelectedModuleRiskLines({
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
    getDICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT: () => DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT,
  });

  const formatDiceConfigBackupPrivacyDetail = createFormatDiceConfigBackupPrivacyDetail({
    formatDiceConfigBackupSelectedModuleRiskLines: (...a: any[]) => formatDiceConfigBackupSelectedModuleRiskLines(...a),
  });

  const showDiceConfigBackupPrivacyConfirm = createShowDiceConfigBackupPrivacyConfirm({
    formatDiceConfigBackupPrivacyDetail: (...a: any[]) => formatDiceConfigBackupPrivacyDetail(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
  });

  const normalizeDiceConfigBackupSelectedModuleIds = createNormalizeDiceConfigBackupSelectedModuleIds({
    isDiceConfigBackupModuleId: (...a: any[]) => isDiceConfigBackupModuleId(...a),
  });

  const getDiceConfigBackupKeyStrategy = createGetDiceConfigBackupKeyStrategy({
    getDICE_CONFIG_BACKUP_KEY_STRATEGIES: () => DICE_CONFIG_BACKUP_KEY_STRATEGIES,
  });

  const getDiceConfigBackupRecordString = createGetDiceConfigBackupRecordString({

  });

  const getDiceConfigBackupValidationRuleKey = createGetDiceConfigBackupValidationRuleKey({
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
  });

  const getDiceConfigBackupRegexRuleKey = createGetDiceConfigBackupRegexRuleKey({
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
  });

  const copyDiceConfigBackupExistingFields = createCopyDiceConfigBackupExistingFields({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
  });

  const sanitizeDiceConfigBackupValidationRule = createSanitizeDiceConfigBackupValidationRule({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
    getDiceConfigBackupValidationRuleKey: (...a: any[]) => getDiceConfigBackupValidationRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const sanitizeDiceConfigBackupRegexRule = createSanitizeDiceConfigBackupRegexRule({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
    getDiceConfigBackupRegexRuleKey: (...a: any[]) => getDiceConfigBackupRegexRuleKey(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDEPRECATED_BUILTIN_REGEX_RULE_IDS: () => DEPRECATED_BUILTIN_REGEX_RULE_IDS,
  });

  const sanitizeDiceConfigBackupRuleList = createSanitizeDiceConfigBackupRuleList({

  });

  const sanitizeDiceConfigBackupPresetRules = createSanitizeDiceConfigBackupPresetRules({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    sanitizeDiceConfigBackupRuleList: (...a: any[]) => sanitizeDiceConfigBackupRuleList(...a),
  });

  const sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport = createSanitizeDiceConfigBackupCustomOnlyPresetArrayForExport({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const sanitizeDiceConfigBackupStoredValue = createSanitizeDiceConfigBackupStoredValue({
    sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport: (...a: any[]) => sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport(...a),
    sanitizeDiceConfigBackupPresetRules: (...a: any[]) => sanitizeDiceConfigBackupPresetRules(...a),
    sanitizeDiceConfigBackupRegexRule: (...a: any[]) => sanitizeDiceConfigBackupRegexRule(...a),
    sanitizeDiceConfigBackupRuleList: (...a: any[]) => sanitizeDiceConfigBackupRuleList(...a),
    sanitizeDiceConfigBackupValidationRule: (...a: any[]) => sanitizeDiceConfigBackupValidationRule(...a),
  });

  const getDiceConfigBackupStoredValue = createGetDiceConfigBackupStoredValue({
    getConfig: (...a: any[]) => getConfig(...a),
    getCrazyModeConfig: (...a: any[]) => getCrazyModeConfig(...a),
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    TableTemplateRequirementPresetManager: TableTemplateRequirementPresetManager,
  });

  const normalizeDiceConfigBackupGachaCatalogSnapshotRecords = createNormalizeDiceConfigBackupGachaCatalogSnapshotRecords({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
  });

  const collectDiceConfigBackupGachaCatalogRecords = createCollectDiceConfigBackupGachaCatalogRecords({
    migrateGachaCatalogRecordsToGlobalScope: (...a: any[]) => migrateGachaCatalogRecordsToGlobalScope(...a),
    normalizeDiceConfigBackupGachaCatalogSnapshotRecords: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogSnapshotRecords(...a),
  });

  const collectDiceConfigBackupGachaCatalogRollbackSnapshot = createCollectDiceConfigBackupGachaCatalogRollbackSnapshot({
    normalizeDiceConfigBackupGachaCatalogSnapshotRecords: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogSnapshotRecords(...a),
  });

  const getDiceConfigBackupTableTemplateApi = createGetDiceConfigBackupTableTemplateApi({
    getCore: (...a: any[]) => getCore(...a),
  });

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

  const getDiceConfigBackupGachaCatalogItemCount = createGetDiceConfigBackupGachaCatalogItemCount({

  });

  const getDiceConfigBackupModuleResourceCount = createGetDiceConfigBackupModuleResourceCount({
    getDiceConfigBackupGachaCatalogItemCount: (...a: any[]) => getDiceConfigBackupGachaCatalogItemCount(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    normalizeDiceConfigBackupGachaCatalogResourceRecord: (...a: any[]) => normalizeDiceConfigBackupGachaCatalogResourceRecord(...a),
    DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY: DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
    DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

  const hasDiceConfigBackupTableTemplateResource = createHasDiceConfigBackupTableTemplateResource({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY: () => DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY,
  });

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

  const isDiceConfigBackupSameValue = createIsDiceConfigBackupSameValue({

  });

  const mergeDiceConfigBackupSetArray = createMergeDiceConfigBackupSetArray({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupValueIdentity: (...a: any[]) => getDiceConfigBackupValueIdentity(...a),
  });

  const getDiceConfigBackupPresetRecordId = createGetDiceConfigBackupPresetRecordId({

  });

  const getDiceConfigBackupPresetRecordName = createGetDiceConfigBackupPresetRecordName({

  });

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

  const getDiceConfigBackupRuleRecords = createGetDiceConfigBackupRuleRecords({

  });

  const buildDiceConfigBackupRuleOverrideMap = createBuildDiceConfigBackupRuleOverrideMap({

  });

  const applyDiceConfigBackupRuleOverrides = createApplyDiceConfigBackupRuleOverrides({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    copyDiceConfigBackupExistingFields: (...a: any[]) => copyDiceConfigBackupExistingFields(...a),
  });

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

  const mergeDiceConfigBackupRegexRules = createMergeDiceConfigBackupRegexRules({
    applyDiceConfigBackupRuleOverrides: (...a: any[]) => applyDiceConfigBackupRuleOverrides(...a),
    buildDiceConfigBackupRuleOverrideMap: (...a: any[]) => buildDiceConfigBackupRuleOverrideMap(...a),
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDiceConfigBackupRegexRuleKey: (...a: any[]) => getDiceConfigBackupRegexRuleKey(...a),
    getDiceConfigBackupRuleRecords: (...a: any[]) => getDiceConfigBackupRuleRecords(...a),
    mergeDiceConfigBackupCustomRules: (...a: any[]) => mergeDiceConfigBackupCustomRules(...a),
    sanitizeDiceConfigBackupRegexRule: (...a: any[]) => sanitizeDiceConfigBackupRegexRule(...a),
  });

  const getDiceConfigBackupSafeCurrentPresets = createGetDiceConfigBackupSafeCurrentPresets({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getPresetManager: () => PresetManager,
    getRegexPresetManager: () => RegexPresetManager,
  });

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

  const getDiceConfigBackupBuiltinPresetIds = createGetDiceConfigBackupBuiltinPresetIds({
    getBUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS: () => BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS,
    getDASHBOARD_DEFAULT_PRESET_ID: () => DASHBOARD_DEFAULT_PRESET_ID,
    getRENDER_DEFAULT_PRESET_ID: () => RENDER_DEFAULT_PRESET_ID,
  });

  const getDiceConfigBackupKnownPresetIds = createGetDiceConfigBackupKnownPresetIds({
    getDiceConfigBackupBuiltinPresetIds: (...a: any[]) => getDiceConfigBackupBuiltinPresetIds(...a),
    getDiceConfigBackupPresetRecordId: (...a: any[]) => getDiceConfigBackupPresetRecordId(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

  const setDiceConfigBackupValue = createSetDiceConfigBackupValue({
    getDiceConfigBackupKeyStrategy: (...a: any[]) => getDiceConfigBackupKeyStrategy(...a),
  });

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

  const getDiceConfigBackupGachaItemNameKey = createGetDiceConfigBackupGachaItemNameKey({

  });

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

  const getAllDiceConfigBackupModuleIds = createGetAllDiceConfigBackupModuleIds({

  });

  const normalizeDiceProfileModuleIds = createNormalizeDiceProfileModuleIds({
    getAllDiceConfigBackupModuleIds: (...a: any[]) => getAllDiceConfigBackupModuleIds(...a),
    getDiceConfigBackupAvailableModuleIds: (...a: any[]) => getDiceConfigBackupAvailableModuleIds(...a),
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
  });

  const getDiceProfileModuleNames = createGetDiceProfileModuleNames({
    getDiceConfigBackupModuleDefinition: (...a: any[]) => getDiceConfigBackupModuleDefinition(...a),
  });

  const toDiceProfileSummary = createToDiceProfileSummary({

  });

  const createDiceProfileRuntimeId = createCreateDiceProfileRuntimeId({

  });

  const getDiceProfileIndex = createGetDiceProfileIndex({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDICE_PROFILE_INDEX_STORAGE_KEY: () => DICE_PROFILE_INDEX_STORAGE_KEY,
  });

  const saveDiceProfileIndex = createSaveDiceProfileIndex({
    cloneDiceConfigBackupValue: (...a: any[]) => cloneDiceConfigBackupValue(...a),
    getDICE_PROFILE_INDEX_STORAGE_KEY: () => DICE_PROFILE_INDEX_STORAGE_KEY,
  });


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

  const saveDiceProfileRecord = createSaveDiceProfileRecord({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
  });

  const upsertDiceProfileRecord = createUpsertDiceProfileRecord({
    getDiceProfileRecords: (...a: any[]) => getDiceProfileRecords(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
  });

  const deleteDiceProfileRecord = createDeleteDiceProfileRecord({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
  });

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

  const showDiceProfileApplyConfirm = createShowDiceProfileApplyConfirm({
    getDiceConfigBackupRestoreWarnings: (...a: any[]) => getDiceConfigBackupRestoreWarnings(...a),
    renderDiceProfileApplyConfirmDetailHtml: (...a: any[]) => renderDiceProfileApplyConfirmDetailHtml(...a),
    showDiceSystemConfirmDialog: (...a: any[]) => showDiceSystemConfirmDialog(...a),
  });

  const applyDiceProfile = createApplyDiceProfile({
    applyDiceConfigBackup: (...a: any[]) => applyDiceConfigBackup(...a),
    createDiceProfilePreApplySnapshot: (...a: any[]) => createDiceProfilePreApplySnapshot(...a),
    normalizeDiceProfileModuleIds: (...a: any[]) => normalizeDiceProfileModuleIds(...a),
    saveDiceProfileRecord: (...a: any[]) => saveDiceProfileRecord(...a),
    showDiceProfileApplyConfirm: (...a: any[]) => showDiceProfileApplyConfirm(...a),
    DICE_PROFILE_LAST_APPLIED_STORAGE_KEY: DICE_PROFILE_LAST_APPLIED_STORAGE_KEY,
  });

  const exportDiceProfile = createExportDiceProfile({

  });

  const downloadDiceProfileJson = createDownloadDiceProfileJson({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  const createDiceProfileRegexId = createCreateDiceProfileRegexId({
    createDiceProfileRuntimeId: (...a: any[]) => createDiceProfileRuntimeId(...a),
  });

  const createDiceProfileTavernRegexReplaceString = createCreateDiceProfileTavernRegexReplaceString({

  });

  const createDiceProfileTavernRegex = createCreateDiceProfileTavernRegex({
    createDiceProfileRegexId: (...a: any[]) => createDiceProfileRegexId(...a),
    createDiceProfileTavernRegexReplaceString: (...a: any[]) => createDiceProfileTavernRegexReplaceString(...a),
  });

  const downloadDiceProfileTavernRegex = createDownloadDiceProfileTavernRegex({
    createDiceProfileTavernRegex: (...a: any[]) => createDiceProfileTavernRegex(...a),
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  const getDiceProfilePromptStates = createGetDiceProfilePromptStates({
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
    getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY: () => DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY,
  });

  const setDiceProfilePromptState = createSetDiceProfilePromptState({
    getDiceProfilePromptStates: (...a: any[]) => getDiceProfilePromptStates(...a),
    getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY: () => DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY,
  });

  const getDiceProfilePromptState = createGetDiceProfilePromptState({
    getDiceProfilePromptStates: (...a: any[]) => getDiceProfilePromptStates(...a),
  });

  const getDiceProfileSillyTavern = createGetDiceProfileSillyTavern({

  });

  const getDiceProfileCharacterContext = createGetDiceProfileCharacterContext({
    getDiceStatsContext: (...a: any[]) => getDiceStatsContext(...a),
    getDiceProfileSillyTavern: (...a: any[]) => getDiceProfileSillyTavern(...a),
    getDiceConfigBackupRecordString: (...a: any[]) => getDiceConfigBackupRecordString(...a),
    isDiceConfigBackupRecord: (...a: any[]) => isDiceConfigBackupRecord(...a),
  });

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

  const scheduleCharacterDiceProfileDetection = createScheduleCharacterDiceProfileDetection({
    maybePromptCharacterDiceProfile: (...a: any[]) => maybePromptCharacterDiceProfile(...a),
  });

  const getDiceConfigBackupAvailableModuleIds = createGetDiceConfigBackupAvailableModuleIds({
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    hasDiceConfigBackupRecoverableStorage: (...a: any[]) => hasDiceConfigBackupRecoverableStorage(...a),
    hasDiceConfigBackupTableTemplateResource: (...a: any[]) => hasDiceConfigBackupTableTemplateResource(...a),
  });

  const getDiceConfigBackupSelectedModuleIdsFromDialog = createGetDiceConfigBackupSelectedModuleIdsFromDialog({
    normalizeDiceConfigBackupSelectedModuleIds: (...a: any[]) => normalizeDiceConfigBackupSelectedModuleIds(...a),
  });

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

  const renderDiceConfigBackupWarningList = createRenderDiceConfigBackupWarningList({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderDiceConfigBackupWarningSlot = createRenderDiceConfigBackupWarningSlot({
    renderDiceConfigBackupWarningList: (...a: any[]) => renderDiceConfigBackupWarningList(...a),
  });

  const renderDiceConfigBackupPrivacyNotice = createRenderDiceConfigBackupPrivacyNotice({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const renderDiceConfigBackupExportBody = createRenderDiceConfigBackupExportBody({
    renderDiceConfigBackupPrivacyNotice: (...a: any[]) => renderDiceConfigBackupPrivacyNotice(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    getDICE_CONFIG_BACKUP_MODULES: () => DICE_CONFIG_BACKUP_MODULES,
  });

  const renderDiceConfigBackupRestoreBody = createRenderDiceConfigBackupRestoreBody({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceConfigBackupAvailableModuleIds: (...a: any[]) => getDiceConfigBackupAvailableModuleIds(...a),
    getDiceConfigBackupModuleResourceCount: (...a: any[]) => getDiceConfigBackupModuleResourceCount(...a),
    getDiceConfigBackupRestoreWarnings: (...a: any[]) => getDiceConfigBackupRestoreWarnings(...a),
    renderDiceConfigBackupModuleRows: (...a: any[]) => renderDiceConfigBackupModuleRows(...a),
    renderDiceConfigBackupPrivacyNotice: (...a: any[]) => renderDiceConfigBackupPrivacyNotice(...a),
    renderDiceConfigBackupWarningSlot: (...a: any[]) => renderDiceConfigBackupWarningSlot(...a),
  });

  const downloadDiceConfigBackupJson = createDownloadDiceConfigBackupJson({
    downloadJsonFile: (...a: any[]) => downloadJsonFile(...a),
  });

  const getDiceProfileCollapsedSections = createGetDiceProfileCollapsedSections({
    getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY: () => DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  });

  const saveDiceProfileCollapsedSections = createSaveDiceProfileCollapsedSections({
    getDICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY: () => DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  });

  const getDiceProfileSourceLabel = createGetDiceProfileSourceLabel({

  });

  const isDiceProfileCharacterSource = createIsDiceProfileCharacterSource({

  });

  const renderDiceProfileSummaryRow = createRenderDiceProfileSummaryRow({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getDiceProfileSourceLabel: (...a: any[]) => getDiceProfileSourceLabel(...a),
    isDiceProfileCharacterSource: (...a: any[]) => isDiceProfileCharacterSource(...a),
  });

  const renderDiceProfileTabPanel = createRenderDiceProfileTabPanel({
    renderDiceProfileSummaryRow: (...a: any[]) => renderDiceProfileSummaryRow(...a),
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

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
  const getTutorialModule = createGetTutorialModule({
    getConfig: (...a: any[]) => getConfig(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    getTavernHostWindow: (...a: any[]) => getTavernHostWindow(...a),
    getTutorialModule: () => tutorialModule,
    setTutorialModule: (v: any) => { tutorialModule = v; },
  });

  const getTutorialButtonHtml = createGetTutorialButtonHtml({

    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });
  const isTutorialScope = createIsTutorialScope({

  });

  let tutorialButtonEventsBound = false;

  const prepareAvatarManagerTutorial = createPrepareAvatarManagerTutorial({
    getCore: (...a: any[]) => getCore(...a),
  });

  const prepareMvuTutorial = createPrepareMvuTutorial({
    getCore: (...a: any[]) => getCore(...a),
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
    renderInterface: (...a: any[]) => renderInterface(...a),
  });

  const prepareInventoryTutorial = createPrepareInventoryTutorial({
    getCore: (...a: any[]) => getCore(...a),
  });

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

  const asDiffRecord = createAsDiffRecord({

  });

  const isDiffSheet = createIsDiffSheet({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
  });

  const normalizeDiffText = createNormalizeDiffText({

  });

  const getDiffSheetIdentity = (sheet: unknown): { uid: string; name: string } => {
    const record = asDiffRecord(sheet);
    return {
      uid: normalizeDiffText(record?.uid),
      name: normalizeDiffText(record?.name),
    };
  };

  const findDiffSnapshotEntry = createFindDiffSnapshotEntry({

    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
  });

  const normalizeDiffRow = createNormalizeDiffRow({

  });

  const getDiffSheetByKey = createGetDiffSheetByKey({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
  });

  const getDiffDataRow = createGetDiffDataRow({

  });

  const setDiffDataRow = createSetDiffDataRow({

  });

  const setDiffDataCell = createSetDiffDataCell({
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
  });

  const removeDiffDataRow = createRemoveDiffDataRow({

  });

  const getDiffSheetContent = createGetDiffSheetContent({
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    normalizeDiffRow: (...a: any[]) => normalizeDiffRow(...a),
  });

  const getDiffHeaders = createGetDiffHeaders({
    getDiffSheetContent: (...a: any[]) => getDiffSheetContent(...a),
  });
  const getDiffRows = createGetDiffRows({
    getDiffSheetContent: (...a: any[]) => getDiffSheetContent(...a),
  });


  const DIFF_ID_HEADER_KEYWORDS = createDiffIdHeaderKeywords({

  });

  const getDiffPreferredColumns = createGetDiffPreferredColumns({
    normalizeDiffHeader: (...a: any[]) => normalizeDiffHeader(...a),
    getDIFF_ID_HEADER_KEYWORDS: () => DIFF_ID_HEADER_KEYWORDS,
  });

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

  const cloneRuntimeDataValue = createCloneRuntimeDataValue({

  });

  const restoreMutableRuntimeValue = createRestoreMutableRuntimeValue({

  });

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

  const readRuntimeTableDataReference = createReadRuntimeTableDataReference({
    readRuntimeTableData: (...a: any[]) => readRuntimeTableData(...a),
  });

  const hasRuntimeTableReadApi = createHasRuntimeTableReadApi({

  });

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

  const getDbChatMessages = createGetDbChatMessages({

  });

  const parseIsolatedData = createParseIsolatedData({

  });

  const hasSheetKeys = createHasSheetKeys({

  });

  const hasDbPayload = createHasDbPayload({
    hasSheetKeys: (...a: any[]) => hasSheetKeys(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
  });

  const findLatestDbMessageIndex = createFindLatestDbMessageIndex({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    hasDbPayload: (...a: any[]) => hasDbPayload(...a),
  });

  const resolveIsolationKey = createResolveIsolationKey({

  });

  const relocateDbPayloadToAnchor = createRelocateDbPayloadToAnchor({
    findLatestDbMessageIndex: (...a: any[]) => findLatestDbMessageIndex(...a),
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    hasDbPayload: (...a: any[]) => hasDbPayload(...a),
    parseIsolatedData: (...a: any[]) => parseIsolatedData(...a),
    resolveIsolationKey: (...a: any[]) => resolveIsolationKey(...a),
  });

  const normalizeSheetKeys = createNormalizeSheetKeys({

  });

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
    triggerUpdate?: () => Promise<unknown> | unknown;
    _notifyTableUpdate?: () => void;
  };

  const assertRuntimeCrudApi = createAssertRuntimeCrudApi({
    getCore: (...a: any[]) => getCore(...a),
    hasRuntimeTableReadApi: (...a: any[]) => hasRuntimeTableReadApi(...a),
  });

  const getSheetRows = sheet => (Array.isArray(sheet?.content) ? sheet.content.slice(1) : []);
  const getSheetHeaders = sheet => (Array.isArray(sheet?.content?.[0]) ? sheet.content[0] : []);
  const sameRow = createSameRow({
  });
  const sameHeaders = createSameHeaders({
    getSheetHeaders: (...a: any[]) => getSheetHeaders(...a),
  });
  const getStableRowKeyForCrud = createGetStableRowKeyForCrud({

  });

  const getCrudSheetDdl = createGetCrudSheetDdl({
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
  });

  const stripCrudSqlComments = createStripCrudSqlComments({

  });

  const stripCrudSqlBlockComments = createStripCrudSqlBlockComments({

  });

  const stripCrudSqlNonStructuralComments = createStripCrudSqlNonStructuralComments({
    stripCrudSqlBlockComments: (...a: any[]) => stripCrudSqlBlockComments(...a),
  });

  const CRUD_SQL_IDENTIFIER_PATTERN = createCrudSqlIdentifierPattern({

  });

  const decodeCrudSqlIdentifier = createDecodeCrudSqlIdentifier({

  });

  const normalizeCrudHeaderLookupKey = createNormalizeCrudHeaderLookupKey({
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const normalizeCrudSqlComment = createNormalizeCrudSqlComment({

  });

  const getCrudSqlCommentAliases = createGetCrudSqlCommentAliases({
    normalizeCrudSqlComment: (...a: any[]) => normalizeCrudSqlComment(...a),
  });

  const addCrudColumnAlias = createAddCrudColumnAlias({
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const getCrudColumnNameForHeader = createGetCrudColumnNameForHeader({
    normalizeCrudHeaderLookupKey: (...a: any[]) => normalizeCrudHeaderLookupKey(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

  const parseCrudColumnDefinitionLine = createParseCrudColumnDefinitionLine({

    getCRUD_SQL_IDENTIFIER_PATTERN: () => CRUD_SQL_IDENTIFIER_PATTERN,
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    normalizeCrudSqlComment: (...a: any[]) => normalizeCrudSqlComment(...a),
  });

  const getCrudSqlTableName = createGetCrudSqlTableName({
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    getCRUD_SQL_IDENTIFIER_PATTERN: () => CRUD_SQL_IDENTIFIER_PATTERN,
  });

  const getCrudTableIdentifier = createGetCrudTableIdentifier({
    getCrudSqlTableName: (...a: any[]) => getCrudSqlTableName(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

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

  const isCrudNullableEnumEmptyValue = createIsCrudNullableEnumEmptyValue({

  });

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

  const assertCrudJsonFallbackAllowed = createAssertCrudJsonFallbackAllowed({
    getCrudUnsupportedFallbackConstraintText: (...a: any[]) => getCrudUnsupportedFallbackConstraintText(...a),
  });

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

  const getCrudCellValueForWrite = createGetCrudCellValueForWrite({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    getCrudColumnNameForHeader: (...a: any[]) => getCrudColumnNameForHeader(...a),
    isCrudNullableEnumEmptyValue: (...a: any[]) => isCrudNullableEnumEmptyValue(...a),
  });

  const buildRowDataForCrud = createBuildRowDataForCrud({
    buildCrudColumnAliasMap: (...a: any[]) => buildCrudColumnAliasMap(...a),
    buildCrudEnumConstraintMap: (...a: any[]) => buildCrudEnumConstraintMap(...a),
    getCrudCellValueForWrite: (...a: any[]) => getCrudCellValueForWrite(...a),
  });

  const getCrudChangedColumns = createGetCrudChangedColumns({

  });

  const isCrudRowIdMissing = createIsCrudRowIdMissing({

  });

  const shouldInferCrudRowIdFromVisibleIndex = createShouldInferCrudRowIdFromVisibleIndex({
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    normalizeDiffHeader: (...a: any[]) => normalizeDiffHeader(...a),
  });

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

  const patchCrudSheetCellInRecord = createPatchCrudSheetCellInRecord({
    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffDataRow: (...a: any[]) => getDiffDataRow(...a),
  });

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

  const patchLatestChatSheetCellWithoutTracking = createPatchLatestChatSheetCellWithoutTracking({

    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    patchCrudSheetCellInMessage: (...a: any[]) => patchCrudSheetCellInMessage(...a),
  });

  const patchLatestChatSheetWithoutTracking = createPatchLatestChatSheetWithoutTracking({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    patchCrudSheetInMessage: (...a: any[]) => patchCrudSheetInMessage(...a),
  });

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

  const restoreCrudRowIdPreparation = createRestoreCrudRowIdPreparation({

  });

  const assertCrudInsertRequiredCells = createAssertCrudInsertRequiredCells({
    assertCrudRequiredCellValues: (...a: any[]) => assertCrudRequiredCellValues(...a),
  });
  type CrudWriteBatchContext = {
    remainingOperations: number;
  };

  const consumeCrudWriteOptions = createConsumeCrudWriteOptions({

  });

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

  const findRuntimeSheetEntryForCrud = createFindRuntimeSheetEntryForCrud({

    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
  });

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

  const performSaveDataOnly = createPerformSaveDataOnly({
    applyRuntimeDataViaCrud: (...a: any[]) => applyRuntimeDataViaCrud(...a),
    getRuntimeErrorLogPayload: (...a: any[]) => getRuntimeErrorLogPayload(...a),
  });

  const runInSaveQueue = createRunInSaveQueue({
    getRuntimeErrorLogPayload: (...a: any[]) => getRuntimeErrorLogPayload(...a),
    getSaveQueue: () => saveQueue,
    setSaveQueue: (v: any) => { saveQueue = v; },
  });

  // [新增] 轻量级保存：只保存数据到数据库，不更新快照
  // 使用队列模式确保快速连续编辑时所有修改都能保存成功
  const saveDataOnly = createSaveDataOnly({
    performSaveDataOnly: (...a: any[]) => performSaveDataOnly(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
  });

  const findRuntimeSheetEntryForMutation = createFindRuntimeSheetEntryForMutation({

    findDiffSnapshotEntry: (...a: any[]) => findDiffSnapshotEntry(...a),
    getDiffSheetByKey: (...a: any[]) => getDiffSheetByKey(...a),
    asDiffRecord: (...a: any[]) => asDiffRecord(...a),
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
    stripCrudSqlComments: (...a: any[]) => stripCrudSqlComments(...a),
    getCRUD_SQL_IDENTIFIER_PATTERN: () => CRUD_SQL_IDENTIFIER_PATTERN,
    decodeCrudSqlIdentifier: (...a: any[]) => decodeCrudSqlIdentifier(...a),
    isDiffSheet: (...a: any[]) => isDiffSheet(...a),
    getDiffSheetIdentity: (...a: any[]) => getDiffSheetIdentity(...a),
  });

  const resolveRuntimeMutationSource = createResolveRuntimeMutationSource({

    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData,
    loadSnapshot: (...a: any[]) => loadSnapshot(...a),
    findRuntimeSheetEntryForMutation: (...a: any[]) => findRuntimeSheetEntryForMutation(...a),
  });

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

  const resolveRootWindow = createResolveRootWindow({

  });

  const rootWindow = resolveRootWindow();
  const acuDiceReady = new AcuDiceReadyState();
  const acuDicePresets = createAcuDicePresetsInstance({
    getActionPresetManager: () => ActionPresetManager,
  });
  const acuDiceCharacters = createAcuDiceCharactersInstance({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getFullAttributesForCharacter: (...a: any[]) => getFullAttributesForCharacter(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    getCachedRawData: () => cachedRawData,
    getDashboardDataParser: () => DashboardDataParser,
  });
  const acuDiceRoll = createAcuDiceRollInstance({
    evaluateFormula: (...a: any[]) => evaluateFormula(...a),
  });
  const acuDiceProfiles = createAcuDiceProfilesInstance({
    refreshDiceProfileIndex: (...a: any[]) => refreshDiceProfileIndex(...a),
    saveCurrentDiceProfile: (...a: any[]) => saveCurrentDiceProfile(...a),
    toDiceProfileSummary: (...a: any[]) => toDiceProfileSummary(...a),
    importDiceProfile: (...a: any[]) => importDiceProfile(...a),
    applyDiceProfile: (...a: any[]) => applyDiceProfile(...a),
    exportDiceProfile: (...a: any[]) => exportDiceProfile(...a),
    detectCharacterDiceProfile: (...a: any[]) => detectCharacterDiceProfile(...a),
    getDiceProfileCharacterContext: (...a: any[]) => getDiceProfileCharacterContext(...a),
    getDiceProfilePromptState: (...a: any[]) => getDiceProfilePromptState(...a),
    getAcuDiceProfilePromptKey: (...a: any[]) => getAcuDiceProfilePromptKey(...a),
  });
  const acuDiceCheck = createAcuDiceCheckInstance({
    getDiceConfig: (...a: any[]) => getDiceConfig(...a),
    getAttributeValue: (...a: any[]) => getAttributeValue(...a),
    emitEvent: (...a: any[]) => emitEvent(...a),
    getCheckHistory: () => checkHistory,
    getMAX_HISTORY: () => MAX_HISTORY,
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
  const notifyReady = createNotifyReady({
    acuDiceReady: acuDiceReady,
  });

  const defineAcuDiceOnWindow = createDefineAcuDiceOnWindow({
    getAcuDiceAPI: () => AcuDiceAPI,
  });

  const dispatchReadyEvent = createDispatchReadyEvent({
    getACUDICE_READY_EVENT: () => ACUDICE_READY_EVENT,
  });

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
  const sharedHistoryStore = createSharedHistoryStore({
    getRootWindowWithHistory: () => rootWindowWithHistory,
  });
  const checkHistory: CheckHistoryEntry[] = sharedHistoryStore.checkHistory;
  const contestHistory: ContestHistoryEntry[] = sharedHistoryStore.contestHistory;
  const acuDiceHistory = createAcuDiceHistoryInstance({
    checkHistory: (...a: any[]) => checkHistory(...a),
    contestHistory: (...a: any[]) => contestHistory(...a),
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

  const emitEvent = createEmitEvent({
    acuDiceEvents: acuDiceEvents,
  });

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

  const normalizeCheckSuggestionDiceFormula = createNormalizeCheckSuggestionDiceFormula({

  });

  const extractCheckSuggestionDiceFormula = createExtractCheckSuggestionDiceFormula({

    normalizeCheckSuggestionDiceFormula: (...a: any[]) => normalizeCheckSuggestionDiceFormula(...a),
  });

  const extractCheckSuggestionTarget = createExtractCheckSuggestionTarget({

  });

  const parseCheckSuggestionTieRule = createParseCheckSuggestionTieRule({

  });

  const extractCheckSuggestionTieRule = createExtractCheckSuggestionTieRule({

    parseCheckSuggestionTieRule: (...a: any[]) => parseCheckSuggestionTieRule(...a),
  });

  const parseCheckSuggestionSide = (text: string): { name: string; attribute: string } | null => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return null;
    return {
      name: parts[0],
      attribute: parts.slice(1).join(' '),
    };
  };

  const normalizeCheckSuggestionSideShorthand = createNormalizeCheckSuggestionSideShorthand({

  });

  const normalizeLeadingCheckSuggestionSideShorthand = createNormalizeLeadingCheckSuggestionSideShorthand({
    normalizeCheckSuggestionSideShorthand: (...a: any[]) => normalizeCheckSuggestionSideShorthand(...a),
  });

  const normalizeCheckSuggestionCommandInput = createNormalizeCheckSuggestionCommandInput({
    normalizeLeadingCheckSuggestionSideShorthand: (...a: any[]) => normalizeLeadingCheckSuggestionSideShorthand(...a),
  });

  const buildCheckSuggestionInvalidCommandMessage = createBuildCheckSuggestionInvalidCommandMessage({

  });

  const parseCheckSuggestionCommand = createParseCheckSuggestionCommand({
    extractCheckSuggestionDiceFormula: (...a: any[]) => extractCheckSuggestionDiceFormula(...a),
    extractCheckSuggestionParams: (...a: any[]) => extractCheckSuggestionParams(...a),
    extractCheckSuggestionTarget: (...a: any[]) => extractCheckSuggestionTarget(...a),
    extractCheckSuggestionTieRule: (...a: any[]) => extractCheckSuggestionTieRule(...a),
    normalizeCheckSuggestionCommandInput: (...a: any[]) => normalizeCheckSuggestionCommandInput(...a),
    parseCheckSuggestionSide: (...a: any[]) => parseCheckSuggestionSide(...a),
  });

  const normalizeCheckSuggestionActionText = createNormalizeCheckSuggestionActionText({

  });

  const refreshNameAliasesForCheckSuggestion = createRefreshNameAliasesForCheckSuggestion({
    getTableData: (...a: any[]) => getTableData(...a),
    processJsonData: (...a: any[]) => processJsonData(...a),
    getCachedRawData: () => cachedRawData,
    getNameAliasRegistry: () => NameAliasRegistry,
  });

  const resolveCheckSuggestionCharacterName = createResolveCheckSuggestionCharacterName({
    resolveCanonicalCharacterName: (...a: any[]) => resolveCanonicalCharacterName(...a),
  });

  const getCheckSuggestionDiceSides = createGetCheckSuggestionDiceSides({

  });

  const buildCheckSuggestionMetaBlock = createBuildCheckSuggestionMetaBlock({

  });

  const parseCheckSuggestionPrimitiveValue = createParseCheckSuggestionPrimitiveValue({

  });

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

  const getCheckSuggestionMappedTarget = createGetCheckSuggestionMappedTarget({
    resolveQuickSelectTarget: (...a: any[]) => resolveQuickSelectTarget(...a),
  });

  const getCheckSuggestionOutcomeResultType = createGetCheckSuggestionOutcomeResultType({

  });

  const isCheckSuggestionOutcomeSuccess = createIsCheckSuggestionOutcomeSuccess({
    getCheckSuggestionOutcomeResultType: (...a: any[]) => getCheckSuggestionOutcomeResultType(...a),
  });

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

  const evaluateCheckSuggestionOutcome = createEvaluateCheckSuggestionOutcome({
    applyAdvancedPresetOutcomePolicy: (...a: any[]) => applyAdvancedPresetOutcomePolicy(...a),
    evaluateOutcomes: (...a: any[]) => evaluateOutcomes(...a),
  });

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

  const executeFixedCheckSuggestion = createExecuteFixedCheckSuggestion({
    buildCheckSuggestionMetaBlock: (...a: any[]) => buildCheckSuggestionMetaBlock(...a),
    smartInsertToTextarea: (...a: any[]) => smartInsertToTextarea(...a),
  });

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



  const normalizeTemplateInspectText = createNormalizeTemplateInspectText({

  });

  const templateTextIncludesAny = createTemplateTextIncludesAny({
    normalizeTemplateInspectText: (...a: any[]) => normalizeTemplateInspectText(...a),
  });

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

  const getTemplateInspectionSeverityMeta = createGetTemplateInspectionSeverityMeta({

  });

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

  const VIEWPORT_BOTTOM_ANCHOR_SELECTORS = createViewportBottomAnchorSelectors({

  });
  const VIEWPORT_BOTTOM_REFRESH_EVENTS = createViewportBottomRefreshEvents({

  });
  const VIEWPORT_COMPOSER_ELEMENT_IDS = new Set(['send_form', 'form_sheld', 'send_textarea', 'chat_input']);
  // iPad 横屏可到 1366px；固定底部导航在这类视口下应跟随聊天容器，而不是输入框内部宽度。
  const TABLET_FIXED_NAV_FULL_WIDTH_MAX = 1366;
  const FIXED_MODE_ANCHOR_PRIORITY = createFixedModeAnchorPriority({

  });
  interface FloatingCollapsePosition {
    left: number;
    top: number;
  }

  const FLOATING_COLLAPSE_SIZE = 48;
  const FLOATING_COLLAPSE_MARGIN = 12;
  const FLOATING_COLLAPSE_DRAG_THRESHOLD = 5;

  const isFloatingCollapseActive = createIsFloatingCollapseActive({
    getCollapsedState: (...a: any[]) => getCollapsedState(...a),
    getConfig: (...a: any[]) => getConfig(...a),
    normalizeCollapseStyle: (...a: any[]) => normalizeCollapseStyle(...a),
  });

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

  const getFloatingCollapsePosition = createGetFloatingCollapsePosition({
    getConfig: (...a: any[]) => getConfig(...a),
    normalizeFloatingCollapsePosition: (...a: any[]) => normalizeFloatingCollapsePosition(...a),
  });

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

  const getViewportBottomAnchorElements = createGetViewportBottomAnchorElements({
    getVIEWPORT_BOTTOM_ANCHOR_SELECTORS: () => VIEWPORT_BOTTOM_ANCHOR_SELECTORS,
  });

  const getViewportAnchorRect = createGetViewportAnchorRect({
    getTavernHostDocument: (...a: any[]) => getTavernHostDocument(...a),
  });

  const getFixedWrapperParentMetrics = createGetFixedWrapperParentMetrics({

  });

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

  const clearFixedAnchorResizeObserver = createClearFixedAnchorResizeObserver({
    getFixedAnchorResizeObserver: () => fixedAnchorResizeObserver,
    setFixedAnchorResizeObserver: (v: any) => { fixedAnchorResizeObserver = v; },
  });

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

  const clearFixedAnchorMutationObserver = createClearFixedAnchorMutationObserver({
    getFixedAnchorMutationDocument: () => fixedAnchorMutationDocument,
    setFixedAnchorMutationDocument: (v: any) => { fixedAnchorMutationDocument = v; },
    getFixedAnchorMutationObserver: () => fixedAnchorMutationObserver,
    setFixedAnchorMutationObserver: (v: any) => { fixedAnchorMutationObserver = v; },
    getFixedAnchorMutationWindow: () => fixedAnchorMutationWindow,
    setFixedAnchorMutationWindow: (v: any) => { fixedAnchorMutationWindow = v; },
    getFixedAnchorTargetsRaf: () => fixedAnchorTargetsRaf,
    setFixedAnchorTargetsRaf: (v: any) => { fixedAnchorTargetsRaf = v; },
  });

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

  const clearViewportInputMutationObserver = createClearViewportInputMutationObserver({
    getViewportInputMutationDocument: () => viewportInputMutationDocument,
    setViewportInputMutationDocument: (v: any) => { viewportInputMutationDocument = v; },
    getViewportInputMutationObserver: () => viewportInputMutationObserver,
    setViewportInputMutationObserver: (v: any) => { viewportInputMutationObserver = v; },
    getViewportInputMutationWindow: () => viewportInputMutationWindow,
    setViewportInputMutationWindow: (v: any) => { viewportInputMutationWindow = v; },
    getViewportInputTargetsRaf: () => viewportInputTargetsRaf,
    setViewportInputTargetsRaf: (v: any) => { viewportInputTargetsRaf = v; },
  });

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

  const renderGlobalInteractionActionButton = createRenderGlobalInteractionActionButton({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

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

  const renderGlobalInteractionItemMark = createRenderGlobalInteractionItemMark({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
    getElementEmoji: (...a: any[]) => getElementEmoji(...a),
    renderCustomTableNameIconContent: (...a: any[]) => renderCustomTableNameIconContent(...a),
    renderThemeIconContent: (...a: any[]) => renderThemeIconContent(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
  });

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

  const getGlobalInteractionCollapsedSections = createGetGlobalInteractionCollapsedSections({

  });

  const renderGlobalInteractionsTableGroup = createRenderGlobalInteractionsTableGroup({
    renderGlobalInteractionRowCard: (...a: any[]) => renderGlobalInteractionRowCard(...a),
    safeEncodeURIComponent: (...a: any[]) => safeEncodeURIComponent(...a),
  });

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
  const refreshChangesPanel = createRefreshChangesPanel({
    bindChangesEvents: (...a: any[]) => bindChangesEvents(...a),
    generateDiffMap: (...a: any[]) => generateDiffMap(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    renderChangesPanel: (...a: any[]) => renderChangesPanel(...a),
    updateChangesCount: (...a: any[]) => updateChangesCount(...a),
    getCachedRawData: () => cachedRawData,
    getCurrentDiffMap: () => currentDiffMap,
    setCurrentDiffMap: (v: any) => { currentDiffMap = v; },
  });

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
  const INVENTORY_SORT_OPTIONS = createInventorySortOptions({

  });
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
  const DEFAULT_GACHA_SETTINGS_ITEM_FILTERS = createDefaultGachaSettingsItemFilters({

  });
  const GACHA_SETTINGS_SOURCE_FILTER_OPTIONS = createGachaSettingsSourceFilterOptions({

  });
  const GACHA_SETTINGS_STATUS_FILTER_OPTIONS = createGachaSettingsStatusFilterOptions({

  });
  const GACHA_SETTINGS_SORT_OPTIONS = createGachaSettingsSortOptions({

  });
  const INVENTORY_TYPE_FILTER_META = createInventoryTypeFilterMeta({

  });
  const INVENTORY_QUALITY_FILTER_META = createInventoryQualityFilterMeta({

  });

  const getInventoryFilters = createGetInventoryFilters({
    getINVENTORY_TYPE_OPTIONS: () => INVENTORY_TYPE_OPTIONS,
    getINVENTORY_QUALITY_OPTIONS: () => INVENTORY_QUALITY_OPTIONS,
    getINVENTORY_SORT_OPTIONS: () => INVENTORY_SORT_OPTIONS,
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
  });

  const saveInventoryFilters = createSaveInventoryFilters({
    getInventoryFilters: (...a: any[]) => getInventoryFilters(...a),
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
  });

  const getInventoryFiltersCollapsedState = createGetInventoryFiltersCollapsedState({

  });
  const getInventoryPanelTarget = createGetInventoryPanelTarget({
  });
  const saveInventoryPanelTarget = createSaveInventoryPanelTarget({
  });
  const saveInventoryFiltersCollapsedState = createSaveInventoryFiltersCollapsedState({

  });

  const bindCompositionSafeSearchInput = createBindCompositionSafeSearchInput({

  });


  const isBuiltinGachaPoolId = createIsBuiltinGachaPoolId({

  });

  const canDeleteGachaPoolDefinition = createCanDeleteGachaPoolDefinition({

  });

  const cloneGachaPoolDefinitions = createCloneGachaPoolDefinitions({

  });

  const buildDefaultGachaPoolDefinition = createBuildDefaultGachaPoolDefinition({

  });

  const normalizeGachaPoolDefinition = createNormalizeGachaPoolDefinition({
    isBuiltinGachaPoolId: (...a: any[]) => isBuiltinGachaPoolId(...a),
  });

  const getStoredGachaPoolSettings = createGetStoredGachaPoolSettings({
    normalizeGachaPoolDefinition: (...a: any[]) => normalizeGachaPoolDefinition(...a),
  });

  const saveGachaPoolSettings = createSaveGachaPoolSettings({
    cloneGachaPoolDefinitions: (...a: any[]) => cloneGachaPoolDefinitions(...a),
  });

  const sortGachaPoolDefinitions = createSortGachaPoolDefinitions({

  });

  const getConfiguredGachaPoolDefinitions = createGetConfiguredGachaPoolDefinitions({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    getStoredGachaPoolSettings: (...a: any[]) => getStoredGachaPoolSettings(...a),
    sortGachaPoolDefinitions: (...a: any[]) => sortGachaPoolDefinitions(...a),
  });

  const getRuntimeGachaRawData = createGetRuntimeGachaRawData({
    getTableData: (...a: any[]) => getTableData(...a),
    getCachedRawData: () => cachedRawData,
  });
  const getGachaCatalogScopeKey = createGetGachaCatalogScopeKey({
    getGACHA_CATALOG_GLOBAL_SCOPE_KEY: () => GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  });

  const buildCrudColumnAliasMap = createBuildCrudColumnAliasMap({
    addCrudColumnAlias: (...a: any[]) => addCrudColumnAlias(...a),
    getCrudSheetDdl: (...a: any[]) => getCrudSheetDdl(...a),
    getCrudSqlCommentAliases: (...a: any[]) => getCrudSqlCommentAliases(...a),
    parseCrudColumnDefinitionLine: (...a: any[]) => parseCrudColumnDefinitionLine(...a),
    stripCrudSqlNonStructuralComments: (...a: any[]) => stripCrudSqlNonStructuralComments(...a),
  });
  const buildAdvancedPresetAgentPrompt = createBuildAdvancedPresetAgentPrompt({

  });
  const collectGachaPoolTagsFromItems = createCollectGachaPoolTagsFromItems({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const ensureGachaPoolsForTags = createEnsureGachaPoolsForTags({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getGachaPoolDefinitionsWithVirtualTags: (...a: any[]) => getGachaPoolDefinitionsWithVirtualTags(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

  const getGachaPoolDefinitionsWithVirtualTags = createGetGachaPoolDefinitionsWithVirtualTags({
    buildDefaultGachaPoolDefinition: (...a: any[]) => buildDefaultGachaPoolDefinition(...a),
    cloneGachaPoolDefinitions: (...a: any[]) => cloneGachaPoolDefinitions(...a),
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    sortGachaPoolDefinitions: (...a: any[]) => sortGachaPoolDefinitions(...a),
  });

  const getAllGachaPoolConfigDefinitions = createGetAllGachaPoolConfigDefinitions({
    collectGachaPoolTagsFromItems: (...a: any[]) => collectGachaPoolTagsFromItems(...a),
    getGachaPoolDefinitionsWithVirtualTags: (...a: any[]) => getGachaPoolDefinitionsWithVirtualTags(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const isGachaPoolEnabled = createIsGachaPoolEnabled({

  });

  const getVisibleGachaPoolConfigDefinitions = createGetVisibleGachaPoolConfigDefinitions({
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaPoolEnabled: (...a: any[]) => isGachaPoolEnabled(...a),
  });

  const getGachaAllExpandablePoolTags = createGetGachaAllExpandablePoolTags({
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaPoolEnabled: (...a: any[]) => isGachaPoolEnabled(...a),
  });

  const getGachaPoolDisplayName = createGetGachaPoolDisplayName({
    getAllGachaPoolConfigDefinitions: (...a: any[]) => getAllGachaPoolConfigDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const formatGachaPoolTags = createFormatGachaPoolTags({
    getGachaPoolDisplayName: (...a: any[]) => getGachaPoolDisplayName(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const updateGachaPoolConfig = createUpdateGachaPoolConfig({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    saveGachaPoolSettings: (...a: any[]) => saveGachaPoolSettings(...a),
  });

  const setGachaPoolOrder = createSetGachaPoolOrder({
    updateGachaPoolConfig: (...a: any[]) => updateGachaPoolConfig(...a),
  });
  const normalizeGachaItemEnabled = createNormalizeGachaItemEnabled({

  });

  const normalizeGachaItemOrder = createNormalizeGachaItemOrder({

  });

  const normalizeGachaRewardTarget = createNormalizeGachaRewardTarget({

  });

  const getGachaRewardFieldLimits = (target: GachaRewardTarget): { name: number; description: number } =>
    GACHA_REWARD_FIELD_LIMITS[normalizeGachaRewardTarget(target)];

  const truncateGachaText = createTruncateGachaText({

  });

  const normalizeGachaTargetTable = createNormalizeGachaTargetTable({
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    getGACHA_TARGET_TABLE_MAX_LENGTH: () => GACHA_TARGET_TABLE_MAX_LENGTH,
  });

  const normalizeGachaTargetColumns = createNormalizeGachaTargetColumns({
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    getGACHA_TARGET_COLUMN_KEYS: () => GACHA_TARGET_COLUMN_KEYS,
    getGACHA_TARGET_COLUMN_VALUE_MAX_LENGTH: () => GACHA_TARGET_COLUMN_VALUE_MAX_LENGTH,
  });

  const getGachaTargetColumnEntries = createGetGachaTargetColumnEntries({
    getGACHA_TARGET_COLUMN_KEYS: () => GACHA_TARGET_COLUMN_KEYS,
  });

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
  const GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS = createGachaEquipmentWrittenTargetColumnKeys({
    getGACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS: () => GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS,
  });
  const GACHA_CUSTOM_FIELD_RESERVED_KEYS = createGachaCustomFieldReservedKeys({

  });

  const normalizeGachaCustomFields = createNormalizeGachaCustomFields({
    truncateGachaText: (...a: any[]) => truncateGachaText(...a),
    getGACHA_CUSTOM_FIELD_KEY_MAX_LENGTH: () => GACHA_CUSTOM_FIELD_KEY_MAX_LENGTH,
    getGACHA_CUSTOM_FIELD_MAX_COUNT: () => GACHA_CUSTOM_FIELD_MAX_COUNT,
    getGACHA_CUSTOM_FIELD_RESERVED_KEYS: () => GACHA_CUSTOM_FIELD_RESERVED_KEYS,
    getGACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH: () => GACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH,
  });

  const hasGachaCustomFields = createHasGachaCustomFields({

  });

  const getGachaCustomFieldEntries = createGetGachaCustomFieldEntries({

  });

  const GACHA_TAG_FIELD_ALIASES = ['标签', '标记', '词条'] as const;
  const GACHA_EFFECT_FIELD_ALIASES = ['效果', '作用', '能力', '特效'] as const;
  const normalizeGachaFieldAlias = createNormalizeGachaFieldAlias({

  });
  const isGachaFieldAlias = createIsGachaFieldAlias({
    normalizeGachaFieldAlias: (...a: any[]) => normalizeGachaFieldAlias(...a),
  });

  const getGachaNamedCustomField = createGetGachaNamedCustomField({
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
    normalizeGachaFieldAlias: (...a: any[]) => normalizeGachaFieldAlias(...a),
  });

  const getGachaItemTagsText = createGetGachaItemTagsText({
    getGachaNamedCustomField: (...a: any[]) => getGachaNamedCustomField(...a),
  });

  const getGachaItemEffectText = createGetGachaItemEffectText({
    getGachaNamedCustomField: (...a: any[]) => getGachaNamedCustomField(...a),
  });

  const getGachaItemDescriptionText = createGetGachaItemDescriptionText({

  });

  const formatGachaItemCardMeta = createFormatGachaItemCardMeta({

    getGachaItemTagsText: (...a: any[]) => getGachaItemTagsText(...a),
  });

  const getGachaCustomFieldsSearchText = createGetGachaCustomFieldsSearchText({
    getGachaCustomFieldEntries: (...a: any[]) => getGachaCustomFieldEntries(...a),
  });

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

  const isGachaItemEnabled = createIsGachaItemEnabled({
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
  });

  const updateGachaItemSetting = createUpdateGachaItemSetting({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    normalizeGachaItemEnabled: (...a: any[]) => normalizeGachaItemEnabled(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
  });

  const setGachaItemOrder = createSetGachaItemOrder({
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
    updateGachaItemSetting: (...a: any[]) => updateGachaItemSetting(...a),
  });

  const deleteGachaItemSetting = createDeleteGachaItemSetting({
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    saveGachaItemSettingsRecord: (...a: any[]) => saveGachaItemSettingsRecord(...a),
  });

  const gachaStateCore = createGachaStateCoreInstance({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
    getGACHA_TEST_DEFAULT_FORTUNE: () => GACHA_TEST_DEFAULT_FORTUNE,
  });
  const createDefaultGachaState = createCreateDefaultGachaState({
    getGachaStateCore: () => gachaStateCore,
  });
  const normalizeShardWallet = createNormalizeShardWallet({
    getGachaStateCore: () => gachaStateCore,
  });

  const normalizeRecentGachaRewards = createNormalizeRecentGachaRewards({
    getGachaStateCore: () => gachaStateCore,
  });

  const gachaStore = createGachaStoreInstance({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });
  const getGachaStateStorageKey = createGetGachaStateStorageKey({
    getGachaStore: () => gachaStore,
  });
  const getGachaStateMigrationKey = createGetGachaStateMigrationKey({
    getGachaStore: () => gachaStore,
  });

  const hasMigratedLegacyGachaState = createHasMigratedLegacyGachaState({
    getGachaStore: () => gachaStore,
  });
  const markLegacyGachaStateMigrated = createMarkLegacyGachaStateMigrated({
    getGachaStore: () => gachaStore,
  });

  const getStoredGachaStateSnapshot = createGetStoredGachaStateSnapshot({
    getGachaStore: () => gachaStore,
  });
  const saveStoredGachaStateSnapshot = createSaveStoredGachaStateSnapshot({
    getGachaStore: () => gachaStore,
  });
  const assertSaveStoredGachaStateSnapshot = createAssertSaveStoredGachaStateSnapshot({
    getGachaStore: () => gachaStore,
  });

  const normalizeGachaStateRecord = createNormalizeGachaStateRecord({
    getGachaStateCore: () => gachaStateCore,
  });

  let gachaCatalogCache: GachaCatalogCache | null = null;
  let gachaCatalogLoadTask: GachaCatalogLoadTask | null = null;

  const cloneGachaCatalogItems = createCloneGachaCatalogItems({

  });

  const createEmptyGachaCatalog = createCreateEmptyGachaCatalog({

  });


  const normalizeGachaCatalogRecord = createNormalizeGachaCatalogRecord({

  });

  const normalizeScopedGachaCatalogRecord = createNormalizeScopedGachaCatalogRecord({
    cloneGachaCatalogItems: (...a: any[]) => cloneGachaCatalogItems(...a),
    normalizeGachaCatalogRecord: (...a: any[]) => normalizeGachaCatalogRecord(...a),
  });

  const getGachaCatalogItemMergeTimestamp = createGetGachaCatalogItemMergeTimestamp({

  });

  const getGachaCatalogRecordMergeTimestamp = createGetGachaCatalogRecordMergeTimestamp({
    getGachaCatalogItemMergeTimestamp: (...a: any[]) => getGachaCatalogItemMergeTimestamp(...a),
  });

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

  const getStoredGachaCatalog = createGetStoredGachaCatalog({
    createEmptyGachaCatalog: (...a: any[]) => createEmptyGachaCatalog(...a),
    getGachaCatalogScopeKey: (...a: any[]) => getGachaCatalogScopeKey(...a),
    getGachaCatalogCache: () => gachaCatalogCache,
  });

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

  const getCustomGachaItemDefinitions = createGetCustomGachaItemDefinitions({
    getStoredGachaCatalog: (...a: any[]) => getStoredGachaCatalog(...a),
  });

  const getAllGachaItemDefinitions = createGetAllGachaItemDefinitions({
    getCustomGachaItemDefinitions: (...a: any[]) => getCustomGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    getStoredGachaItemSettings: (...a: any[]) => getStoredGachaItemSettings(...a),
    withGachaItemSettings: (...a: any[]) => withGachaItemSettings(...a),
  });

  const hashGachaCatalogSeed = createHashGachaCatalogSeed({

  });

  const buildStableGachaCustomItemId = createBuildStableGachaCustomItemId({
    hashGachaCatalogSeed: (...a: any[]) => hashGachaCatalogSeed(...a),
  });

  const EQUIPMENT_TABLE_TYPE_VALUES = ['武器', '防具', '饰品'] as const;
  type EquipmentTableType = (typeof EQUIPMENT_TABLE_TYPE_VALUES)[number];
  const inferEquipmentTableTypeForGachaItem = createInferEquipmentTableTypeForGachaItem({
    EQUIPMENT_TABLE_TYPE_VALUES: EQUIPMENT_TABLE_TYPE_VALUES,
  });

  const createUniqueGachaItemId = createCreateUniqueGachaItemId({

  });

  const normalizeGachaTimestamp = createNormalizeGachaTimestamp({

  });

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

  const formatGachaCatalogImportErrors = createFormatGachaCatalogImportErrors({

  });

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

  const collectGachaLocalStorageSnapshot = createCollectGachaLocalStorageSnapshot({

  });

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

  const serializeGachaPoolDefinitionForExport = createSerializeGachaPoolDefinitionForExport({

  });

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

  const formatGachaCatalogImportStatsText = createFormatGachaCatalogImportStatsText({

  });

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

  const getLegacyGachaStateFromRawData = createGetLegacyGachaStateFromRawData({
    normalizeGachaStateRecord: (...a: any[]) => normalizeGachaStateRecord(...a),
  });

  const getGachaState = createGetGachaState({
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    getLegacyGachaStateFromRawData: (...a: any[]) => getLegacyGachaStateFromRawData(...a),
    getStoredGachaStateSnapshot: (...a: any[]) => getStoredGachaStateSnapshot(...a),
    hasMigratedLegacyGachaState: (...a: any[]) => hasMigratedLegacyGachaState(...a),
    markLegacyGachaStateMigrated: (...a: any[]) => markLegacyGachaStateMigrated(...a),
    normalizeGachaStateRecord: (...a: any[]) => normalizeGachaStateRecord(...a),
    saveStoredGachaStateSnapshot: (...a: any[]) => saveStoredGachaStateSnapshot(...a),
  });

  const touchGachaActivity = createTouchGachaActivity({
    getGachaState: (...a: any[]) => getGachaState(...a),
    getLastHumanInputActivityAt: () => lastHumanInputActivityAt,
  });

  const recordGachaFortuneGain = createRecordGachaFortuneGain({

  });

  const getObjectRecord = createGetObjectRecord({

  });

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

  const getGachaRarityRank = createGetGachaRarityRank({

  });

  const isGachaRarity = createIsGachaRarity({

  });
  const getGachaShardLabel = createGetGachaShardLabel({

  });

  const getGachaRarityIconClass = createGetGachaRarityIconClass({
    getINVENTORY_QUALITY_FILTER_META: () => INVENTORY_QUALITY_FILTER_META,
  });

  const compareGachaItemDefinitionsForDisplay = createCompareGachaItemDefinitionsForDisplay({
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    normalizeGachaItemOrder: (...a: any[]) => normalizeGachaItemOrder(...a),
  });

  const addGachaShards = createAddGachaShards({

  });

  const getGachaRewardTargetTableLabel = createGetGachaRewardTargetTableLabel({

  });

  const formatGachaRewardDestinationLabel = createFormatGachaRewardDestinationLabel({
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
    getGachaRewardTargetTableLabel: (...a: any[]) => getGachaRewardTargetTableLabel(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
  });

  const getGachaRewardTargetOptions = createGetGachaRewardTargetOptions({
    normalizeGachaTargetColumns: (...a: any[]) => normalizeGachaTargetColumns(...a),
    normalizeGachaTargetTable: (...a: any[]) => normalizeGachaTargetTable(...a),
  });

  const getGachaRewardParseResult = createGetGachaRewardParseResult({
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
  });

  const getGachaRewardParseResultForItem = createGetGachaRewardParseResultForItem({
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
    getGachaRewardTargetOptions: (...a: any[]) => getGachaRewardTargetOptions(...a),
  });

  const hasGachaRewardTable = createHasGachaRewardTable({
    getGachaRewardParseResult: (...a: any[]) => getGachaRewardParseResult(...a),
  });

  const hasGachaRewardTableForItem = createHasGachaRewardTableForItem({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
  });

  const getAvailableGachaRewardTargets = createGetAvailableGachaRewardTargets({
    hasGachaRewardTable: (...a: any[]) => hasGachaRewardTable(...a),
  });

  const getGachaMinimumRarity = createGetGachaMinimumRarity({

  });

  const pickWeightedValue = createPickWeightedValue({

  });

  const getActiveGachaPoolTags = createGetActiveGachaPoolTags({
    getGachaAllExpandablePoolTags: (...a: any[]) => getGachaAllExpandablePoolTags(...a),
  });

  let gachaPoolDefinitionsCache: {
    poolTag: GachaPoolTag;
    rawData: unknown;
    activeTagsKey: string;
    items: GachaItemDefinition[];
  } | null = null;

  const getGachaPoolDefinitions = createGetGachaPoolDefinitions({
    compareGachaItemDefinitionsForDisplay: (...a: any[]) => compareGachaItemDefinitionsForDisplay(...a),
    getActiveGachaPoolTags: (...a: any[]) => getActiveGachaPoolTags(...a),
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
    isGachaItemEnabled: (...a: any[]) => isGachaItemEnabled(...a),
    getGachaPoolDefinitionsCache: () => gachaPoolDefinitionsCache,
    setGachaPoolDefinitionsCache: (v: any) => { gachaPoolDefinitionsCache = v; },
  });

  const getStoredGachaActivePoolTag = createGetStoredGachaActivePoolTag({
    getConfiguredGachaPoolDefinitions: (...a: any[]) => getConfiguredGachaPoolDefinitions(...a),
  });

  const saveStoredGachaActivePoolTag = createSaveStoredGachaActivePoolTag({

  });

  const getGachaActivePoolTag = createGetGachaActivePoolTag({
    getStoredGachaActivePoolTag: (...a: any[]) => getStoredGachaActivePoolTag(...a),
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
  });

  const getGachaChatIdSeed = createGetGachaChatIdSeed({

  });

  const getGachaLocalDateKey = createGetGachaLocalDateKey({

  });

  const hashGachaSeed = createHashGachaSeed({

  });

  let gachaPickupRotationKeyCache: { chatLength: number; dateKey: string; key: string } | null = null;

  const getGachaPickupRotationKey = createGetGachaPickupRotationKey({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    getGachaChatIdSeed: (...a: any[]) => getGachaChatIdSeed(...a),
    getGachaLocalDateKey: (...a: any[]) => getGachaLocalDateKey(...a),
    getGachaPickupRotationKeyCache: () => gachaPickupRotationKeyCache,
    setGachaPickupRotationKeyCache: (v: any) => { gachaPickupRotationKeyCache = v; },
  });

  let gachaPickupItemsCache: { key: string; items: GachaItemDefinition[] } | null = null;

  const getGachaPickupItems = createGetGachaPickupItems({
    getGachaPickupRotationKey: (...a: any[]) => getGachaPickupRotationKey(...a),
    getGachaPoolDefinitions: (...a: any[]) => getGachaPoolDefinitions(...a),
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
    hashGachaSeed: (...a: any[]) => hashGachaSeed(...a),
    getGachaPickupItemsCache: () => gachaPickupItemsCache,
    setGachaPickupItemsCache: (v: any) => { gachaPickupItemsCache = v; },
  });

  const isGachaPickupItem = createIsGachaPickupItem({
    getGachaPickupItems: (...a: any[]) => getGachaPickupItems(...a),
  });

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

  const getGachaReservedCustomFieldHeaders = createGetGachaReservedCustomFieldHeaders({
    getGachaTargetColumnEntries: (...a: any[]) => getGachaTargetColumnEntries(...a),
    getGACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS: () => GACHA_COMMON_WRITTEN_TARGET_COLUMN_KEYS,
    getGACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS: () => GACHA_EQUIPMENT_WRITTEN_TARGET_COLUMN_KEYS,
  });

  const buildGachaCustomFieldHeaderMap = createBuildGachaCustomFieldHeaderMap({

  });

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

  const getGachaItemGrantQuantity = createGetGachaItemGrantQuantity({

  });

  const findGachaDefinitionByItemId = createFindGachaDefinitionByItemId({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const findGachaDefinitionByNameQuality = createFindGachaDefinitionByNameQuality({
    getAllGachaItemDefinitions: (...a: any[]) => getAllGachaItemDefinitions(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const findGachaDefinitionByInventoryItem = createFindGachaDefinitionByInventoryItem({
    findGachaDefinitionByNameQuality: (...a: any[]) => findGachaDefinitionByNameQuality(...a),
    getRuntimeGachaRawData: (...a: any[]) => getRuntimeGachaRawData(...a),
  });

  const grantInventoryGachaReward = createGrantInventoryGachaReward({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    validateGachaCustomFieldsForExistingRow: (...a: any[]) => validateGachaCustomFieldsForExistingRow(...a),
    setInventoryRowBasicFields: (...a: any[]) => setInventoryRowBasicFields(...a),
    applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
    setInventoryMetadataForItem: (...a: any[]) => setInventoryMetadataForItem(...a),
    buildGachaInventoryMetaRecord: (...a: any[]) => buildGachaInventoryMetaRecord(...a),
  });

  const grantEquipmentGachaReward = createGrantEquipmentGachaReward({
    getGachaRewardParseResultForItem: (...a: any[]) => getGachaRewardParseResultForItem(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    validateGachaCustomFieldsForExistingRow: (...a: any[]) => validateGachaCustomFieldsForExistingRow(...a),
    setEquipmentRowBasicFields: (...a: any[]) => setEquipmentRowBasicFields(...a),
    applyGachaCustomFieldsToRow: (...a: any[]) => applyGachaCustomFieldsToRow(...a),
    validateGachaCustomFieldsForTargetTable: (...a: any[]) => validateGachaCustomFieldsForTargetTable(...a),
    assertCrudRequiredColumnsRepresented: (...a: any[]) => assertCrudRequiredColumnsRepresented(...a),
    assertCrudInsertRequiredCells: (...a: any[]) => assertCrudInsertRequiredCells(...a),
    assertCrudEnumConstraints: (...a: any[]) => assertCrudEnumConstraints(...a),
    assertCrudLengthConstraints: (...a: any[]) => assertCrudLengthConstraints(...a),
  });

  const grantGachaReward = createGrantGachaReward({
    grantEquipmentGachaReward: (...a: any[]) => grantEquipmentGachaReward(...a),
    grantInventoryGachaReward: (...a: any[]) => grantInventoryGachaReward(...a),
  });

  const applyGachaPityAfterDraw = createApplyGachaPityAfterDraw({
    getGachaRarityRank: (...a: any[]) => getGachaRarityRank(...a),
  });

  const pushRecentGachaReward = createPushRecentGachaReward({

  });

  const drawSingleGachaOutcome = createDrawSingleGachaOutcome({
    getAvailableGachaRewardTargets: (...a: any[]) => getAvailableGachaRewardTargets(...a),
    getGachaMinimumRarity: (...a: any[]) => getGachaMinimumRarity(...a),
    pickGachaRarity: (...a: any[]) => pickGachaRarity(...a),
    pickGachaItemDefinition: (...a: any[]) => pickGachaItemDefinition(...a),
    getGachaItemGrantQuantity: (...a: any[]) => getGachaItemGrantQuantity(...a),
    grantGachaReward: (...a: any[]) => grantGachaReward(...a),
    applyGachaPityAfterDraw: (...a: any[]) => applyGachaPityAfterDraw(...a),
    pushRecentGachaReward: (...a: any[]) => pushRecentGachaReward(...a),
  });

  const formatGachaRecentRewardText = createFormatGachaRecentRewardText({
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
  });

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

  const formatGachaDuration = createFormatGachaDuration({

  });

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

  const getTotalGachaShards = createGetTotalGachaShards({

  });

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

  const getGachaShopProgressContainers = createGetGachaShopProgressContainers({
    collectHostAndLocalNodes: (...a: any[]) => collectHostAndLocalNodes(...a),
    getGachaShopRootElement: () => gachaShopRootElement,
  });

  const updateGachaFortuneProgressDom = createUpdateGachaFortuneProgressDom({
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
  });

  const updateGachaShopProgressUi = createUpdateGachaShopProgressUi({
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    updateGachaFortuneProgressDom: (...a: any[]) => updateGachaFortuneProgressDom(...a),
  });

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

  const getStoredGachaSettingsPoolTag = createGetStoredGachaSettingsPoolTag({
    getVisibleGachaPoolConfigDefinitions: (...a: any[]) => getVisibleGachaPoolConfigDefinitions(...a),
  });

  const saveStoredGachaSettingsPoolTag = createSaveStoredGachaSettingsPoolTag({

  });

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

  const getGachaSettingsPoolItems = createGetGachaSettingsPoolItems({
    getGachaCatalogItemsForExport: (...a: any[]) => getGachaCatalogItemsForExport(...a),
  });

  const getGachaItemCreatedAtMs = createGetGachaItemCreatedAtMs({
    normalizeGachaTimestamp: (...a: any[]) => normalizeGachaTimestamp(...a),
  });

  const formatGachaItemCreatedAt = createFormatGachaItemCreatedAt({
    getGachaItemCreatedAtMs: (...a: any[]) => getGachaItemCreatedAtMs(...a),
  });

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
  const dismantleEquipmentItem = createDismantleEquipmentItem({
    addGachaShards: (...a: any[]) => addGachaShards(...a),
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getCachedRawData: () => cachedRawData,
    getGachaShardLabel: (...a: any[]) => getGachaShardLabel(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
    persistRawDataWithGacha: (...a: any[]) => persistRawDataWithGacha(...a),
    refreshGachaVisualization: (...a: any[]) => refreshGachaVisualization(...a),
    refreshInventoryVisualization: (...a: any[]) => refreshInventoryVisualization(...a),
    runInSaveQueue: (...a: any[]) => runInSaveQueue(...a),
    showGachaSaveError: (...a: any[]) => showGachaSaveError(...a),
    touchGachaActivity: (...a: any[]) => touchGachaActivity(...a),
  });

  const normalizeGachaMessageId = createNormalizeGachaMessageId({

  });

  const getGachaChatMessageText = createGetGachaChatMessageText({
    getDbChatMessages: (...a: any[]) => getDbChatMessages(...a),
    normalizeGachaMessageId: (...a: any[]) => normalizeGachaMessageId(...a),
  });

  const buildGachaSettlementKey = createBuildGachaSettlementKey({
    countUnicodeCharacters: (...a: any[]) => countUnicodeCharacters(...a),
    stripSystemInjectedContent: (...a: any[]) => stripSystemInjectedContent(...a),
  });

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

  const ensureGachaHeartbeat = createEnsureGachaHeartbeat({
    flushGachaHeartbeatProgress: (...a: any[]) => flushGachaHeartbeatProgress(...a),
    getGachaHeartbeatTimer: () => gachaHeartbeatTimer,
    setGachaHeartbeatTimer: (v: any) => { gachaHeartbeatTimer = v; },
  });

  const startGachaShopUiRefresh = createStartGachaShopUiRefresh({
    getGachaShopProgressContainers: (...a: any[]) => getGachaShopProgressContainers(...a),
    updateGachaShopProgressUi: (...a: any[]) => updateGachaShopProgressUi(...a),
    getGACHA_SHOP_UI_REFRESH_MS: () => GACHA_SHOP_UI_REFRESH_MS,
    getGachaShopUiRefreshTimer: () => gachaShopUiRefreshTimer,
    setGachaShopUiRefreshTimer: (v: any) => { gachaShopUiRefreshTimer = v; },
  });

  const getInventoryMetadataContextKey = createGetInventoryMetadataContextKey({
    getCurrentContextFingerprint: (...a: any[]) => getCurrentContextFingerprint(...a),
  });

  const getInventoryMetadataStore = createGetInventoryMetadataStore({

  });

  const saveInventoryMetadataStore = createSaveInventoryMetadataStore({

  });

  const getLegacyInventoryMetadataRoot = createGetLegacyInventoryMetadataRoot({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
  });

  const saveInventoryMetadataRoot = createSaveInventoryMetadataRoot({
    getInventoryMetadataContextKey: (...a: any[]) => getInventoryMetadataContextKey(...a),
    getInventoryMetadataStore: (...a: any[]) => getInventoryMetadataStore(...a),
    saveInventoryMetadataStore: (...a: any[]) => saveInventoryMetadataStore(...a),
  });

  const getInventoryMetadataRoot = createGetInventoryMetadataRoot({
    getInventoryMetadataContextKey: (...a: any[]) => getInventoryMetadataContextKey(...a),
    getInventoryMetadataStore: (...a: any[]) => getInventoryMetadataStore(...a),
    getLegacyInventoryMetadataRoot: (...a: any[]) => getLegacyInventoryMetadataRoot(...a),
    saveInventoryMetadataStore: (...a: any[]) => saveInventoryMetadataStore(...a),
  });

  const getInventoryMetadataScopeKey = createGetInventoryMetadataScopeKey({

  });

  const getInventoryMetadataForItem = createGetInventoryMetadataForItem({
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
  });

  const setInventoryMetadataForItem = createSetInventoryMetadataForItem({
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
    saveInventoryMetadataRoot: (...a: any[]) => saveInventoryMetadataRoot(...a),
  });

  const getInventoryGlobalContext = createGetInventoryGlobalContext({
    processJsonData: (...a: any[]) => processJsonData(...a),
    getDashboardDataParser: () => DashboardDataParser,
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
  });

  const syncInventoryMetadataForRawData = createSyncInventoryMetadataForRawData({
    getInventoryGlobalContext: (...a: any[]) => getInventoryGlobalContext(...a),
    getInventoryMetadataRoot: (...a: any[]) => getInventoryMetadataRoot(...a),
    getInventoryMetadataScopeKey: (...a: any[]) => getInventoryMetadataScopeKey(...a),
    getInventoryResult: (...a: any[]) => getInventoryResult(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    saveInventoryMetadataRoot: (...a: any[]) => saveInventoryMetadataRoot(...a),
  });

  const getGachaRewardTargetModuleKey = createGetGachaRewardTargetModuleKey({

  });

  const getGachaRewardTargetModuleName = createGetGachaRewardTargetModuleName({

  });

  const isGachaTargetTableAliasMatch = createIsGachaTargetTableAliasMatch({
    normalizeDiffText: (...a: any[]) => normalizeDiffText(...a),
  });

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

  const getInventoryResult = createGetInventoryResult({
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveGachaTargetTableOverride: (...a: any[]) => resolveGachaTargetTableOverride(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

  const findGachaColumnByKeywords = createFindGachaColumnByKeywords({

  });

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

  const getEquipmentResult = createGetEquipmentResult({
    processJsonData: (...a: any[]) => processJsonData(...a),
    resolveGachaTargetTableOverride: (...a: any[]) => resolveGachaTargetTableOverride(...a),
    getDashboardDataParser: () => DashboardDataParser,
  });

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

  const getStoredGachaShardShopRarity = createGetStoredGachaShardShopRarity({

  });

  const saveStoredGachaShardShopRarity = createSaveStoredGachaShardShopRarity({

  });

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

  const refreshGachaShardShop = createRefreshGachaShardShop({
    bindGachaShardShopInteractions: (...a: any[]) => bindGachaShardShopInteractions(...a),
    ensureGachaCatalogLoaded: (...a: any[]) => ensureGachaCatalogLoaded(...a),
    getCore: (...a: any[]) => getCore(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    hydrateCustomTableNameIconsIn: (...a: any[]) => hydrateCustomTableNameIconsIn(...a),
    renderGachaShardShopHtml: (...a: any[]) => renderGachaShardShopHtml(...a),
    getCachedRawData: () => cachedRawData,
  });

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

  const getInventoryActionLabel = createGetInventoryActionLabel({

  });

  const getInventoryActionPrompt = createGetInventoryActionPrompt({
    getInventoryActionLabel: (...a: any[]) => getInventoryActionLabel(...a),
  });

  const getInventoryCharacters = createGetInventoryCharacters({
    getDashboardModuleConfig: (...a: any[]) => getDashboardModuleConfig(...a),
    replaceUserPlaceholders: (...a: any[]) => replaceUserPlaceholders(...a),
    DashboardDataParser: DashboardDataParser,
  });

  const renderInventoryFilterButtons = createRenderInventoryFilterButtons({
    escapeHtml: (...a: any[]) => escapeHtml(...a),
  });

  const getInventoryActiveFilterCount = createGetInventoryActiveFilterCount({

  });

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

  const closeInventoryVisualization = createCloseInventoryVisualization({

  });

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
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
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
    getInventoryPanelTarget: (...a: any[]) => getInventoryPanelTarget(...a),
    saveInventoryPanelTarget: (...a: any[]) => saveInventoryPanelTarget(...a),
  });

  const findInventoryItemByRow = createFindInventoryItemByRow({
    getTableData: (...a: any[]) => getTableData(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    getCachedRawData: () => cachedRawData,
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
  });

  const getInventoryDetailContext = createGetInventoryDetailContext({
    cloneRuntimeDataValue: (...a: any[]) => cloneRuntimeDataValue(...a),
    getTableData: (...a: any[]) => getTableData(...a),
    parseInventoryItems: (...a: any[]) => parseInventoryItems(...a),
    getCachedRawData: () => cachedRawData,
    parseEquipmentItems: (...a: any[]) => parseEquipmentItems(...a),
  });

  const getInventoryFieldLabel = createGetInventoryFieldLabel({

  });

  const getInventoryFieldColumnIndex = createGetInventoryFieldColumnIndex({
    getInventoryColumnMap: (...a: any[]) => getInventoryColumnMap(...a),
  });

  const getInventoryEnumOptions = createGetInventoryEnumOptions({
    INVENTORY_TYPE_OPTIONS: INVENTORY_TYPE_OPTIONS,
    ValidationRuleManager: ValidationRuleManager,
  });

  const reopenInventoryItemDetail = createReopenInventoryItemDetail({
    showInventoryItemDetail: (...a: any[]) => showInventoryItemDetail(...a),
  });

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
    dismantleEquipmentItem: (...a: any[]) => dismantleEquipmentItem(...a),
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

  const getDataAreaForRoot = createGetDataAreaForRoot({
    getCore: (...a: any[]) => getCore(...a),
  });

  const getLatestAssistantMessageElement = createGetLatestAssistantMessageElement({
    getCore: (...a: any[]) => getCore(...a),
  });

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

  const ensurePanelNavigationVisible = createEnsurePanelNavigationVisible({
    getConfig: (...a: any[]) => getConfig(...a),
    isFloatingCollapseActive: (...a: any[]) => isFloatingCollapseActive(...a),
    scheduleFixedWrapperBoundsRefresh: (...a: any[]) => scheduleFixedWrapperBoundsRefresh(...a),
    scheduleViewportBoundsRefresh: (...a: any[]) => scheduleViewportBoundsRefresh(...a),
  });

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

  const warnMissingTableTarget = createWarnMissingTableTarget({
    warnTableTemplateIssue: (...a: any[]) => warnTableTemplateIssue(...a),
  });

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
    dismantleEquipmentItem: (...a: any[]) => dismantleEquipmentItem(...a),
    isGachaRarity: (...a: any[]) => isGachaRarity(...a),
    saveInventoryPanelTarget: (...a: any[]) => saveInventoryPanelTarget(...a),
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

  const cloneAcuDiceApiValue = createCloneAcuDiceApiValue({

  });

  const normalizeAcuDiceGachaInteger = createNormalizeAcuDiceGachaInteger({

  });

  const buildAcuDiceGachaStateSnapshot = createBuildAcuDiceGachaStateSnapshot({
    cloneAcuDiceApiValue: (...a: any[]) => cloneAcuDiceApiValue(...a),
    createDefaultGachaState: (...a: any[]) => createDefaultGachaState(...a),
    getGachaActivePoolTag: (...a: any[]) => getGachaActivePoolTag(...a),
    getGachaFortuneProgressView: (...a: any[]) => getGachaFortuneProgressView(...a),
    getGachaState: (...a: any[]) => getGachaState(...a),
  });

  const serializeAcuDiceGachaPool = createSerializeAcuDiceGachaPool({
    canDeleteGachaPoolDefinition: (...a: any[]) => canDeleteGachaPoolDefinition(...a),
  });

  const serializeAcuDiceGachaItem = createSerializeAcuDiceGachaItem({
    serializeGachaCatalogItemForExport: (...a: any[]) => serializeGachaCatalogItemForExport(...a),
  });

  const serializeAcuDiceGachaDrawOutcome = createSerializeAcuDiceGachaDrawOutcome({
    serializeAcuDiceGachaItem: (...a: any[]) => serializeAcuDiceGachaItem(...a),
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

  const stringifyAcuDiceGachaCatalogInput = createStringifyAcuDiceGachaCatalogInput({

  });

  const normalizeAcuDiceGachaImportMode = createNormalizeAcuDiceGachaImportMode({

  });

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

  const gachaRegexActions = createGachaRegexActionsInstance({
    getCore: (...a: any[]) => getCore(...a),
    getRuntimeErrorMessage: (...a: any[]) => getRuntimeErrorMessage(...a),
    getAcuDiceGachaApi: () => acuDiceGachaApi,
    getRootWindow: () => rootWindow,
  });

  const bindAcuDiceGachaRegexActions = createBindAcuDiceGachaRegexActions({
    gachaRegexActions: gachaRegexActions,
  });

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
