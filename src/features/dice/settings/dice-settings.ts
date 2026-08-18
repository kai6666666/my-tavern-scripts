// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=30「头像裁剪弹窗 - 统一PC/移动端体验」
// 原行范围：34627-42618（含 banner 34623-42618）；拆分批次 11；外部 closure 依赖：60（42 个稳定 IIFE 依赖 + 9 个共享 let 状态的 18 个读写回调）
// 落点说明：本节为 idx 30 连续大段（7992 行），内含多个子模块——头像裁剪弹窗/头像管理器（34627-36094）、缓存清理/更新/导入/卡编辑弹窗（36095-36484）、
//   getConfig/saveConfig（36485-36516）、DiceConfigBackup 配置备份系统（36517-38743）、DiceProfile 档案系统（38744-40068）、教程模块（40069-40244）、
//   Diff 快照系统（40245-40573）、运行时表读取/CRUD 保存层（40574-42618）。正文 80% 以上为配置/备份/档案/运行时数据层，头像裁剪仅为开头子功能，
//   故落点 settings/dice-settings.ts（新目录 settings/，与 engine/misc/presets 等平级）而非 misc/avatar-crop-modal.ts（该名仅覆盖 1/5 内容，会误导维护者）。
// 接线说明：
//   已拆模块直连 import（28 条，见下）；IIFE 内无法 export 的 42 个稳定依赖（getCore/Store/loadSnapshot/renderInterface/GachaCatalogDB/showDiceSystemConfirmDialog/
//   getRuntimeGachaRawData/getTavernHostDocument/getTavernHostWindow/cloneGachaCatalogItems/downloadJsonFile/showDiceSystemInputDialog/normalizeGachaCatalogRecord/
//   migrateGachaCatalogRecordsToGlobalScope/parseJsoncDocument/GACHA_ALL_POOL_TAG/FONTS/saveSnapshot/normalizeGachaPoolDefinition/buildDefaultGachaPoolDefinition/
//   isBuiltinGachaPoolId/normalizeGachaItemEnabled/normalizeGachaItemOrder/normalizeImportedGachaItem/isGachaItemEnabled/validateGachaCatalogImportItemTarget/
//   mergeGachaCatalogRecordsToGlobalScope/createEmptyGachaCatalog/ensureGachaPoolsForTags/refreshGachaVisualization/refreshGachaShardShop/showGachaSettingsDialog/
//   DashboardPresetManager/DEFAULT_GM_CONFIG/DEFAULT_CONFIG/normalizeCollapseStyle/getNavigationFontMetrics/collectHostAndLocalNodes/getPendingDeletions/
//   DASHBOARD_DEFAULT_PRESET_ID/syncInventoryMetadataForRawData/pickTextFile）→ __wireDiceSettingsDeps({...}) 尾注入，未注入时模块级引用为 null（全部仅在运行时函数内调用）；
//   共享 let 状态（批次6/10模式）：cachedRawData/isSaving/saveQueue/hasUnsavedChanges/currentDiffMap/isSettingsOpen/gachaCatalogCache/gachaCatalogLoadTask/
//   dashboardRuntimeConfigCache 仍被 index.ts IIFE 剩余代码（idx 29/45 等）直接重赋值/读取，声明保留 IIFE 内、本模块不导出，经注入读写回调访问：
//   getXxx/setXxx（共 18 个），正文相应处改写为回调调用（批次11 记录在案，其余逐字一致）；tutorialButtonEventsBound 仅被 idx 45 使用，声明保留 IIFE 内（见 index.ts 标记处）；
//   类型（GachaCatalogRecord/GachaPoolSettingsRecord/GachaItemSettingsRecord/GachaItemSettingsEntry/NormalizedGachaCatalogItem 等定义于 idx 45、AvatarManagerNode/
//   AvatarManagerViewMode/AvatarManagerOptions 定义于 idx 29）仅作类型标注，@ts-nocheck 下无运行时影响（沿用批次 3 idx 28 的 OutcomeLevel 先例）。
// 注：sections.json endLine=42618 为 bak 行号；当前 index.ts 与 bak 存在 1 处既有差异（bak 41938 空行在 current 缺失），extract-section.js 规格 endLine 按当前文件取 42617。
// 注：index.ts 侧 21 处 import 行同步拆分（仅段内使用的名字移至本文件，段外仍用的保留），见批次 11 记录。

import { MAIN_STYLES } from '../theme/styles';
import { setDatabaseToastMute } from '../ui/database-toast-mute';
import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { TUTORIAL_SCOPE_LIST, createTutorialModule, type TutorialModule, type TutorialScope } from '../tutorial/tutorial';
import { normalizeTableTemplateRequirementPreset } from '../template/table-template-requirements';
import { GACHA_CATALOG_VERSION, type GachaItemDefinition, type GachaPoolDefinition } from '../engine/gacha-items';
import { ACU_DICE_PROFILE_FORMAT, computeAcuDiceProfileFingerprint, createAcuDiceProfileMarker, decodeAcuDiceProfileMarkerPayload, extractAcuDiceProfileMarkerPayloads, getAcuDiceProfilePromptKey, getAcuDiceProfileSourceKey, normalizeAcuDiceProfilePackage, normalizeAcuDiceProfileSource, type AcuDiceProfilePackage, type AcuDiceProfileSource, type NormalizeAcuDiceProfileOptions } from '../engine/profile-packages';
import { LocalAvatarDB } from '../favorites/local-avatar-db';
import { DiceHistoryStatsDB, FavoritesDB } from '../favorites/favorites-db';
import { DICE_ROOT_SELECTOR, SCRIPT_ID } from '../engine/constants';
import { BUILTIN_VALIDATION_RULES, STORAGE_KEY_VALIDATION_ENABLED, STORAGE_KEY_VALIDATION_MODE, STORAGE_KEY_VALIDATION_RULES } from '../validation/validation-rule-manager';
import { STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_ENABLED, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES } from '../regex/regex-types';
import { BUILTIN_REGEX_RULES, DEPRECATED_BUILTIN_REGEX_RULE_IDS } from '../regex/builtin-regex-rules';
import { RegexTransformationManager } from '../regex/regex-transformation-manager';
import { RegexPresetManager } from '../regex/regex-preset-manager';
import { BUILTIN_ADVANCED_PRESETS } from '../presets/advanced-dice-preset';
import { ActionPresetManager, BUILTIN_ACTION_PRESETS } from '../presets/interaction-rule-preset';
import { AttributePresetManager, BUILTIN_ATTRIBUTE_PRESETS } from '../presets/attribute-rule-preset';
import { CUSTOM_ROLL_MODE, PRESET_FORMAT_VERSION, SCRIPT_VERSION, STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_BUILTIN_PRESET_ORDER, STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_LAST_PRESET, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS } from '../engine/preset-constants';
import { DATA_VALIDATION_DEPRECATED_META, GACHA_CATALOG_GLOBAL_SCOPE_KEY, GACHA_CATALOG_RAW_ROW_INDEX_PROP, STORAGE_KEY_ACTION_ORDER, STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, STORAGE_KEY_GACHA_SHARD_SHOP_RARITY, STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_HIDDEN_TABLES, STORAGE_KEY_IS_COLLAPSED, STORAGE_KEY_MAP_FOCUS, STORAGE_KEY_OPTIONS_COLLAPSED, STORAGE_KEY_REVERSE_TABLES, STORAGE_KEY_TABLE_HEIGHTS, STORAGE_KEY_TABLE_ORDER, STORAGE_KEY_TABLE_STYLES, STORAGE_KEY_UI_CONFIG, countUnicodeCharacters, escapeHtml, formatCssImageUrl, getImageUrlValidationMessage, getRemoteImageUrlValidationError, renderDeprecatedBadge, setupOverlayClose } from '../favorites/bookmark-manager';
import { AvatarManager, avatarHexToHsl, clampAvatarNumber, getAvatarFallbackColor, getDiceStatsContext, hslToAvatarHex, inferAvatarImageColor, normalizeAvatarHexColor } from '../favorites/favorites-manager';
import { PresetManager, STORAGE_KEY_ACTIVE_PRESET, STORAGE_KEY_PRESETS, ValidationRuleManager } from '../validation/preset-manager';
import { RENDER_DEFAULT_PRESET_ID, RenderPresetManager, STORAGE_KEY_ACTIVE_RENDER_PRESET, STORAGE_KEY_RENDER_PRESETS } from '../presets/render-preset-manager';
import { DEFAULT_DICE_CONFIG, getDiceConfig, saveDiceConfig } from '../engine/mvu-visualizer';
import { AdvancedDicePresetManager, BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_ACTIVE_ADVANCED_PRESET, TableTemplateRequirementPresetManager } from '../presets/advanced-dice-preset-manager';
import { refreshDialogueIndentRender, resolveUserGraphName } from '../engine/character-name-resolver';
import { getCrazyModeConfig } from '../presets/crazy-mode';
import { refreshDicePanelPresets } from '../presets/advanced-dice-preset-ui';

let DASHBOARD_DEFAULT_PRESET_ID = null;
let DEFAULT_CONFIG = null;
let DEFAULT_GM_CONFIG = null;
let FONTS = null;
let GACHA_ALL_POOL_TAG = null;
let GachaCatalogDB = null;
let Store = null;
let buildDefaultGachaPoolDefinition = null;
let cloneGachaCatalogItems = null;
let collectHostAndLocalNodes = null;
let createEmptyGachaCatalog = null;
let DashboardPresetManager = null;
let downloadJsonFile = null;
let ensureGachaPoolsForTags = null;
let getCore = null;
let getNavigationFontMetrics = null;
let getPendingDeletions = null;
let getRuntimeGachaRawData = null;
let getTavernHostDocument = null;
let getTavernHostWindow = null;
let isBuiltinGachaPoolId = null;
let isGachaItemEnabled = null;
let loadSnapshot = null;
let mergeGachaCatalogRecordsToGlobalScope = null;
let migrateGachaCatalogRecordsToGlobalScope = null;
let normalizeCollapseStyle = null;
let normalizeGachaCatalogRecord = null;
let normalizeGachaItemEnabled = null;
let normalizeGachaItemOrder = null;
let normalizeGachaPoolDefinition = null;
let normalizeImportedGachaItem = null;
let parseJsoncDocument = null;
let pickTextFile = null;
let refreshGachaShardShop = null;
let refreshGachaVisualization = null;
let renderInterface = null;
let saveSnapshot = null;
let showDiceSystemConfirmDialog = null;
let showDiceSystemInputDialog = null;
let showGachaSettingsDialog = null;
let syncInventoryMetadataForRawData = null;
let validateGachaCatalogImportItemTarget = null;
let getCachedRawData = null;
let setCachedRawData = null;
let getIsSaving = null;
let setIsSaving = null;
let getSaveQueue = null;
let setSaveQueue = null;
let getHasUnsavedChanges = null;
let setHasUnsavedChanges = null;
let getCurrentDiffMap = null;
let setCurrentDiffMap = null;
let getIsSettingsOpen = null;
let setIsSettingsOpen = null;
let getGachaCatalogCache = null;
let setGachaCatalogCache = null;
let getGachaCatalogLoadTask = null;
let setGachaCatalogLoadTask = null;
let getDashboardRuntimeConfigCache = null;
let setDashboardRuntimeConfigCache = null;

export function __wireDiceSettingsDeps(deps) {
  DASHBOARD_DEFAULT_PRESET_ID = deps.DASHBOARD_DEFAULT_PRESET_ID;
  DEFAULT_CONFIG = deps.DEFAULT_CONFIG;
  DEFAULT_GM_CONFIG = deps.DEFAULT_GM_CONFIG;
  FONTS = deps.FONTS;
  GACHA_ALL_POOL_TAG = deps.GACHA_ALL_POOL_TAG;
  GachaCatalogDB = deps.GachaCatalogDB;
  Store = deps.Store;
  buildDefaultGachaPoolDefinition = deps.buildDefaultGachaPoolDefinition;
  cloneGachaCatalogItems = deps.cloneGachaCatalogItems;
  collectHostAndLocalNodes = deps.collectHostAndLocalNodes;
  createEmptyGachaCatalog = deps.createEmptyGachaCatalog;
  DashboardPresetManager = deps.DashboardPresetManager;
  downloadJsonFile = deps.downloadJsonFile;
  ensureGachaPoolsForTags = deps.ensureGachaPoolsForTags;
  getCore = deps.getCore;
  getNavigationFontMetrics = deps.getNavigationFontMetrics;
  getPendingDeletions = deps.getPendingDeletions;
  getRuntimeGachaRawData = deps.getRuntimeGachaRawData;
  getTavernHostDocument = deps.getTavernHostDocument;
  getTavernHostWindow = deps.getTavernHostWindow;
  isBuiltinGachaPoolId = deps.isBuiltinGachaPoolId;
  isGachaItemEnabled = deps.isGachaItemEnabled;
  loadSnapshot = deps.loadSnapshot;
  mergeGachaCatalogRecordsToGlobalScope = deps.mergeGachaCatalogRecordsToGlobalScope;
  migrateGachaCatalogRecordsToGlobalScope = deps.migrateGachaCatalogRecordsToGlobalScope;
  normalizeCollapseStyle = deps.normalizeCollapseStyle;
  normalizeGachaCatalogRecord = deps.normalizeGachaCatalogRecord;
  normalizeGachaItemEnabled = deps.normalizeGachaItemEnabled;
  normalizeGachaItemOrder = deps.normalizeGachaItemOrder;
  normalizeGachaPoolDefinition = deps.normalizeGachaPoolDefinition;
  normalizeImportedGachaItem = deps.normalizeImportedGachaItem;
  parseJsoncDocument = deps.parseJsoncDocument;
  pickTextFile = deps.pickTextFile;
  refreshGachaShardShop = deps.refreshGachaShardShop;
  refreshGachaVisualization = deps.refreshGachaVisualization;
  renderInterface = deps.renderInterface;
  saveSnapshot = deps.saveSnapshot;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  showDiceSystemInputDialog = deps.showDiceSystemInputDialog;
  showGachaSettingsDialog = deps.showGachaSettingsDialog;
  syncInventoryMetadataForRawData = deps.syncInventoryMetadataForRawData;
  validateGachaCatalogImportItemTarget = deps.validateGachaCatalogImportItemTarget;
  getCachedRawData = deps.getCachedRawData;
  setCachedRawData = deps.setCachedRawData;
  getIsSaving = deps.getIsSaving;
  setIsSaving = deps.setIsSaving;
  getSaveQueue = deps.getSaveQueue;
  setSaveQueue = deps.setSaveQueue;
  getHasUnsavedChanges = deps.getHasUnsavedChanges;
  setHasUnsavedChanges = deps.setHasUnsavedChanges;
  getCurrentDiffMap = deps.getCurrentDiffMap;
  setCurrentDiffMap = deps.setCurrentDiffMap;
  getIsSettingsOpen = deps.getIsSettingsOpen;
  setIsSettingsOpen = deps.setIsSettingsOpen;
  getGachaCatalogCache = deps.getGachaCatalogCache;
  setGachaCatalogCache = deps.setGachaCatalogCache;
  getGachaCatalogLoadTask = deps.getGachaCatalogLoadTask;
  setGachaCatalogLoadTask = deps.setGachaCatalogLoadTask;
  getDashboardRuntimeConfigCache = deps.getDashboardRuntimeConfigCache;
  setDashboardRuntimeConfigCache = deps.setDashboardRuntimeConfigCache;
}
  // ========================================
  // 头像裁剪弹窗 - 统一PC/移动端体验
  // ========================================

  const showAvatarCropModal = (imageSource, characterName, onSave) => {
    const { $ } = getCore();
    $('.acu-crop-modal-overlay').remove();

    const config = getConfig();

    // 初始参数
    let scale = 150;
    let offsetX = 50;
    let offsetY = 50;

    // 尝试读取已有配置
    const existing = AvatarManager.getAll()[characterName];
    if (existing) {
      scale = existing.scale ?? 150;
      offsetX = existing.offsetX ?? 50;
      offsetY = existing.offsetY ?? 50;
    }
    const initialCropImageUrl = formatCssImageUrl(imageSource, { allowInternalObjectUrl: true }) || 'none';

    const modalHtml = `
            <div class="acu-crop-modal-overlay acu-theme-${config.theme}">
                <div class="acu-crop-modal" role="dialog" aria-modal="true" aria-labelledby="acu-crop-modal-title">
                    <div class="acu-crop-header">
                        <span id="acu-crop-modal-title"><i class="fa-solid fa-crop-simple"></i> 调整头像 - ${escapeHtml(characterName)}</span>
                        <button class="acu-crop-close" type="button" title="关闭" aria-label="关闭头像裁剪"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-crop-body">
                        <div class="acu-crop-container">
                            <div class="acu-crop-image" style="
                                background-image: ${escapeHtml(initialCropImageUrl)};
                                background-size: ${scale}%;
                                background-position: ${offsetX}% ${offsetY}%;
                            "></div>
                            <div class="acu-crop-mask"></div>
                        </div>
                        <div class="acu-crop-hint">拖拽移动 · 滚轮/双指缩放</div>
                    </div>
                    <div class="acu-crop-footer">
                        <label class="acu-crop-btn acu-crop-reupload" title="重新上传" role="button" tabindex="0" aria-label="重新上传头像">
                            <i class="fa-solid fa-camera"></i>
                            <input type="file" accept="image/*" class="acu-crop-file-input" />
                        </label>
                        <button class="acu-crop-btn acu-crop-cancel" type="button">取消</button>
                        <button class="acu-crop-btn acu-crop-confirm" type="button"><i class="fa-solid fa-check"></i> 确定</button>
                    </div>
                </div>
            </div>
        `;

    const $modal = $(modalHtml);
    $('body').append($modal);

    const $image = $modal.find('.acu-crop-image');
    const $container = $modal.find('.acu-crop-container');
    const containerEl = $container[0];
    const imageEl = $image[0];

    // 更新图片样式
    const updateImageStyle = () => {
      imageEl.style.backgroundSize = `${scale}%`;
      imageEl.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
    };

    // === 拖拽逻辑（使用 Pointer Events 统一处理） ===
    let isDragging = false;
    let startX = 0,
      startY = 0;
    let startOffsetX = 0,
      startOffsetY = 0;
    let activePointerId = null;

    imageEl.addEventListener('pointerdown', e => {
      // 忽略多点触控的额外手指
      if (activePointerId !== null) return;

      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startOffsetX = offsetX;
      startOffsetY = offsetY;

      imageEl.setPointerCapture(e.pointerId);
      imageEl.style.cursor = 'grabbing';
    });

    imageEl.addEventListener('pointermove', e => {
      if (!isDragging || e.pointerId !== activePointerId) return;

      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // 灵敏度根据缩放调整
      const sensitivity = 100 / scale;
      offsetX = Math.max(0, Math.min(100, startOffsetX - deltaX * sensitivity));
      offsetY = Math.max(0, Math.min(100, startOffsetY - deltaY * sensitivity));
      updateImageStyle();
    });

    imageEl.addEventListener('pointerup', e => {
      if (e.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      imageEl.releasePointerCapture(e.pointerId);
      imageEl.style.cursor = 'grab';
    });

    imageEl.addEventListener('pointercancel', e => {
      if (e.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      imageEl.style.cursor = 'grab';
    });

    // === 缩放逻辑 ===
    // 滚轮缩放
    containerEl.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -10 : 10;
        scale = Math.max(100, Math.min(300, scale + delta));
        updateImageStyle();
      },
      { passive: false },
    );

    // 双指缩放
    let lastPinchDist = 0;
    let pinchStartScale = scale;

    containerEl.addEventListener(
      'touchstart',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          lastPinchDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          pinchStartScale = scale;
        }
      },
      { passive: false },
    );

    containerEl.addEventListener(
      'touchmove',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const newDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          if (lastPinchDist > 0) {
            const pinchRatio = newDist / lastPinchDist;
            scale = Math.max(100, Math.min(300, pinchStartScale * pinchRatio));
            updateImageStyle();
          }
        }
      },
      { passive: false },
    );

    containerEl.addEventListener('touchend', e => {
      if (e.touches.length < 2) {
        lastPinchDist = 0;
        pinchStartScale = scale;
      }
    });

    // === 按钮事件 ===
    $modal.on('keydown', '.acu-crop-reupload', function (e: JQuery.KeyDownEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      $(this).find('.acu-crop-file-input').trigger('click');
    });

    // 重新上传
    $modal.find('.acu-crop-file-input').on('change', async function (e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        if (window.toastr) window.toastr.warning('请选择图片文件');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        if (window.toastr) window.toastr.warning('图片大小不能超过 5MB');
        return;
      }

      try {
        // 保存新图片
        const success = await AvatarManager.saveLocalAvatar(characterName, file);
        if (success) {
          // 获取新 URL 并更新预览
          const newUrl = await LocalAvatarDB.get(characterName);
          imageSource = newUrl;

          // 重置裁剪参数
          scale = 150;
          offsetX = 50;
          offsetY = 50;

          // 更新显示
          $image.css('background-image', formatCssImageUrl(newUrl, { allowInternalObjectUrl: true }) || 'none');
          updateImageStyle();
        }
      } catch (err) {
        console.error('[DICE]ACU 重新上传失败:', err);
        if (window.toastr)
          showActionableErrorToast('头像图片上传失败，未能保存新的本地头像。', { suggestion: 'image' });
      }

      $(this).val('');
    });
    $modal.find('.acu-crop-close, .acu-crop-cancel').on('click', () => {
      $modal.remove();
    });

    $modal.find('.acu-crop-confirm').on('click', () => {
      onSave({ scale, offsetX, offsetY, imageSource });
      $modal.remove();
    });

    // 点击遮罩关闭
    setupOverlayClose($modal, 'acu-crop-modal-overlay', () => {
      $modal.remove();
    });
  };

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
  const showAvatarManager = (
    nodeArr: AvatarManagerNode[],
    onUpdate?: () => void,
    options: AvatarManagerOptions = {},
  ) => {
    try {
      const { $ } = getCore();
      $('.acu-avatar-manager-overlay').remove();

      const config = getConfig();

      const avatarSortOptions = [
        { value: 'name', label: '名字' },
        { value: 'date', label: '日期' },
        { value: 'source', label: '来源' },
      ] as const;
      type AvatarSortField = (typeof avatarSortOptions)[number]['value'];
      const isAvatarSortField = (value: string): value is AvatarSortField =>
        avatarSortOptions.some(option => option.value === value);
      const getAvatarSortLabel = (value: AvatarSortField): string =>
        avatarSortOptions.find(option => option.value === value)?.label ?? '名字';
      const avatarColorPresetSwatches = [
        '#D82F8E',
        '#E76AA8',
        '#D95B6A',
        '#E8835E',
        '#E2A36F',
        '#D7B866',
        '#B8C96A',
        '#72C76B',
        '#65BFA7',
        '#59B9C7',
        '#6AA8E7',
        '#6787D9',
        '#8A83E6',
        '#B78BE8',
        '#D179D8',
        '#C870A0',
        '#8CA0AA',
      ] as const;

      // 视图和排序状态
      let currentView: AvatarManagerViewMode = options.initialView === 'global' ? 'global' : 'chat';
      let sortBy: AvatarSortField = 'name';
      let sortOrder = 'asc'; // 'asc' | 'desc'
      let searchQuery = '';
      const expandedItems = new Set<string>(); // 跟踪展开的角色
      let isInitialLoad = true; // 首次加载标志，用于控制自动展开行为

      // 与关系图共用 user/主角/别名归一化逻辑
      const resolveUserPlaceholderForAvatar = (name: string): string => resolveUserGraphName(name);

      const renderAvatarColorControlHtml = (name: string, data: Record<string, unknown>): string => {
        const storedColor = normalizeAvatarHexColor(data.imageColor);
        const color = storedColor || AvatarManager.getImageColor(name);
        const source = storedColor ? data.imageColorSource || 'auto' : 'fallback';
        const swatches = [color, ...avatarColorPresetSwatches, getAvatarFallbackColor(name)];
        const uniqueSwatches = [
          ...new Set(
            swatches.map(item => normalizeAvatarHexColor(item)).filter((item): item is string => Boolean(item)),
          ),
        ].slice(0, 18);
        const hsl = avatarHexToHsl(color) || { h: 0, s: 0.54, l: 0.5 };
        const hue = Math.round(hsl.h);
        const saturation = Math.round(hsl.s * 100);
        const lightness = Math.round(hsl.l * 100);
        return `
                            <div class="acu-avatar-color-container" data-original-color="${escapeHtml(storedColor || '')}" data-original-source="${escapeHtml(source)}" style="--acu-avatar-ui-color: ${escapeHtml(color)}; --acu-avatar-picker-hue: ${hue}; --acu-avatar-picker-saturation: ${saturation}%; --acu-avatar-picker-lightness: ${lightness}%;">
                                <button class="acu-btn-action acu-avatar-color-swatch-btn" type="button" title="设置角色颜色" aria-label="设置 ${escapeHtml(name)} 的角色颜色" aria-expanded="false">
                                    <span class="acu-avatar-color-swatch" aria-hidden="true"></span>
                                </button>
                                <div class="acu-avatar-color-popover" hidden>
                                    <div class="acu-avatar-color-popover-header">
                                        <div class="acu-avatar-color-panel-title">角色颜色</div>
                                        <button class="acu-avatar-color-close-btn" type="button" title="关闭颜色面板" aria-label="关闭颜色面板"><i class="fa-solid fa-times"></i></button>
                                    </div>
                                    <div class="acu-avatar-color-swatch-grid" aria-label="颜色候选">
                                        ${uniqueSwatches
                                          .map(
                                            swatch => `
                                        <button class="acu-avatar-color-option ${swatch === color ? 'active' : ''}" type="button" data-color="${escapeHtml(swatch)}" style="--acu-avatar-option-color: ${escapeHtml(swatch)}" title="${escapeHtml(swatch)}" aria-label="使用颜色 ${escapeHtml(swatch)}"></button>
                                        `,
                                          )
                                          .join('')}
                                    </div>
                                    <div class="acu-avatar-color-free-picker">
                                        <label class="acu-avatar-color-slider-row">
                                            <span>色相</span>
                                            <input type="range" class="acu-avatar-color-slider acu-avatar-color-hue-slider" data-channel="h" min="0" max="360" value="${hue}" aria-label="色相" />
                                        </label>
                                        <label class="acu-avatar-color-slider-row">
                                            <span>饱和</span>
                                            <input type="range" class="acu-avatar-color-slider acu-avatar-color-saturation-slider" data-channel="s" min="0" max="100" value="${saturation}" aria-label="饱和度" />
                                        </label>
                                        <label class="acu-avatar-color-slider-row">
                                            <span>亮度</span>
                                            <input type="range" class="acu-avatar-color-slider acu-avatar-color-lightness-slider" data-channel="l" min="20" max="80" value="${lightness}" aria-label="亮度" />
                                        </label>
                                    </div>
                                    <div class="acu-avatar-color-action-row">
                                        <input type="text" class="acu-input acu-avatar-color-hex" maxlength="7" value="${escapeHtml(color)}" aria-label="${escapeHtml(name)} 的角色颜色十六进制值" />
                                        <button class="acu-avatar-color-generate-btn" type="button"><i class="fa-solid fa-wand-magic-sparkles"></i> 自动生成</button>
                                    </div>
                                </div>
                            </div>
        `;
      };

      // 异步构建列表
      const buildList = async () => {
        let listHtml = '';

        // 预先获取所有头像数据 (必须在使用前声明)
        const allAvatarData = AvatarManager.getAll();

        // 根据视图模式获取节点列表
        let workingNodes = [];
        if (currentView === 'chat') {
          // 当前聊天视图：使用传入的 nodeArr
          workingNodes = nodeArr.map(n => ({ name: n.name, isPlayer: n.isPlayer }));
        } else {
          // 全局视图：合并当前聊天角色 + 全局已配置角色（去重）
          const seenNames = new Set<string>();
          const merged: { name: string; isPlayer: boolean }[] = [];

          // 先添加当前聊天的角色
          for (const n of nodeArr) {
            if (!seenNames.has(n.name)) {
              seenNames.add(n.name);
              merged.push({ name: n.name, isPlayer: n.isPlayer });
            }
          }

          // 再添加全局已配置但不在当前聊天中的角色
          for (const name of Object.keys(allAvatarData)) {
            if (!seenNames.has(name)) {
              seenNames.add(name);
              merged.push({ name, isPlayer: false });
            }
          }

          workingNodes = merged;
        }

        // 分离{{user}}节点和其他节点
        const userNode = workingNodes.find(n => {
          const resolved = resolveUserPlaceholderForAvatar(n.name);
          return resolved === '{{user}}';
        });
        let otherNodes = workingNodes.filter(n => {
          const resolved = resolveUserPlaceholderForAvatar(n.name);
          return resolved !== '{{user}}';
        });

        // 搜索过滤
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          otherNodes = otherNodes.filter(n => {
            const nameMatch = n.name.toLowerCase().includes(query);
            const aliasMatch = (allAvatarData[n.name]?.aliases || []).some(alias =>
              alias.toLowerCase().includes(query),
            );
            return nameMatch || aliasMatch;
          });
        }

        // 预计算来源信息（用于来源排序）
        const nodeSourceMap = new Map<string, { hasLocal: boolean; hasUrl: boolean }>();
        if (sortBy === 'source') {
          for (const node of otherNodes) {
            const hasLocal = await AvatarManager.hasLocalAvatar(node.name);
            const hasUrl = !!allAvatarData[node.name]?.url;
            nodeSourceMap.set(node.name, { hasLocal, hasUrl });
          }
        }

        // 对其他节点进行排序
        if (sortBy === 'source') {
          // 按来源排序：本地上传 > URL > 无头像
          // 正序: local(0) < url(1) < none(2)
          // 倒序: none(2) < url(1) < local(0)
          const getSourcePriority = (name: string) => {
            const info = nodeSourceMap.get(name);
            if (info?.hasLocal) return 0; // 本地上传
            if (info?.hasUrl) return 1; // URL
            return 2; // 无头像
          };
          otherNodes.sort((a, b) => {
            const priorityA = getSourcePriority(a.name);
            const priorityB = getSourcePriority(b.name);
            const cmp = priorityA - priorityB;
            return sortOrder === 'asc' ? cmp : -cmp;
          });
        } else if (sortBy === 'name') {
          otherNodes.sort((a, b) => {
            const cmp = a.name.localeCompare(b.name, 'zh-CN');
            return sortOrder === 'asc' ? cmp : -cmp;
          });
        } else {
          // 按日期排序
          otherNodes.sort((a, b) => {
            const timeA = allAvatarData[a.name]?.createdAt ?? 0;
            const timeB = allAvatarData[b.name]?.createdAt ?? 0;
            return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
          });
        }

        // 检查是否为空状态（全局视图）
        if (currentView === 'global' && workingNodes.length === 0) {
          return `
            <div class="acu-avatar-empty-state">
              <i class="fa-solid fa-images"></i>
              <p>暂无角色数据。请确保数据库正确启动并包含主角信息或重要人物表数据。</p>
            </div>
          `;
        }

        // 检查是否为空状态（当前聊天视图）
        if (currentView === 'chat' && workingNodes.length === 0) {
          return `
            <div class="acu-avatar-empty-state">
              <i class="fa-solid fa-user-slash"></i>
              <p>当前聊天中没有找到角色数据。请先在仪表盘中添加主角或NPC。</p>
            </div>
          `;
        }

        // 先渲染{{user}}（如果存在）
        if (userNode) {
          // 创建{{user}}节点的副本，使用'{{user}}'作为名称
          const userNodeForDisplay = {
            ...userNode,
            name: '{{user}}', // 统一使用{{user}}作为显示名称
          };

          const data = allAvatarData[userNodeForDisplay.name] || {};
          let currentUrl = data.url || '';

          // 检查是否有本地图片
          const hasLocal = await AvatarManager.hasLocalAvatar(userNodeForDisplay.name);
          let displayUrl = '';
          let sourceLabel = '';

          if (hasLocal) {
            displayUrl = await LocalAvatarDB.get(userNodeForDisplay.name);
            sourceLabel = '<span class="acu-avatar-source acu-source-local">本地</span>';
          } else if (currentUrl) {
            displayUrl = currentUrl;
            sourceLabel = '<span class="acu-avatar-source acu-source-url">URL</span>';
          }

          const aliases = (data.aliases || []).join(', ');
          const hasAvatar = !!displayUrl;

          // 默认策略：仅在首次加载时，如果没有头像URL，自动展开方便编辑
          if (isInitialLoad && !hasAvatar && !data.url) {
            expandedItems.add(userNodeForDisplay.name);
          }
          const isExpanded = expandedItems.has(userNodeForDisplay.name);

          listHtml += `
                    <div class="acu-avatar-item acu-avatar-user-item ${isExpanded ? 'expanded' : ''}" data-name="${escapeHtml(userNodeForDisplay.name)}" data-has-local="${hasLocal}" data-display-url="${escapeHtml(displayUrl)}">
                        <!-- 折叠态 -->
                        <div class="acu-avatar-row-collapsed">
                            <div class="acu-avatar-identity-tools">
                                <div class="acu-avatar-preview-wrap">
                                    <div class="acu-avatar-preview ${hasAvatar ? 'has-image' : ''}" role="button" tabindex="0" aria-label="调整 ${escapeHtml(userNodeForDisplay.name)} 的头像" data-avatar-url="${escapeHtml(displayUrl)}" data-avatar-x="${data.offsetX ?? 50}" data-avatar-y="${data.offsetY ?? 50}" data-avatar-scale="${data.scale ?? 150}">
                                        ${!hasAvatar ? `<span>${escapeHtml(userNodeForDisplay.name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>` : ''}
                                    </div>
                                    ${sourceLabel}
                                </div>
                            </div>
                            <div class="acu-avatar-info-summary">
                                <div class="acu-avatar-name"><span class="acu-avatar-name-text">${escapeHtml(userNodeForDisplay.name)}</span>${renderAvatarColorControlHtml(userNodeForDisplay.name, data)}<button class="acu-protagonist-toggle ${getDiceConfig().autoMergeProtagonist !== false ? 'active' : ''}" type="button" title="自动将&quot;主角&quot;合并为{{user}}的别名" aria-label="自动将主角合并为 {{user}} 的别名" aria-pressed="${getDiceConfig().autoMergeProtagonist !== false ? 'true' : 'false'}"><i class="fa-solid ${getDiceConfig().autoMergeProtagonist !== false ? 'fa-link' : 'fa-link-slash'}"></i></button></div>
                                <div class="acu-avatar-url-preview">${escapeHtml(currentUrl || '无头像设置')}</div>
                            </div>
                            <div class="acu-avatar-actions-collapsed">
                                <button class="acu-btn-action acu-btn-edit" type="button" title="${isExpanded ? '收起' : '编辑'}" aria-label="${isExpanded ? '收起头像设置' : '编辑头像设置'}"><i class="fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-pencil'}"></i></button>
                            </div>
                        </div>

                        <!-- 展开态 -->
                        <div class="acu-avatar-row-expanded">
                            <div class="acu-avatar-details">
                                <div class="acu-input-group">
                                    <label class="acu-input-group-label">URL</label>
                                    <div class="acu-url-container">
                                        <input type="text" class="acu-input acu-avatar-url" placeholder="粘贴图片链接..." value="${escapeHtml(currentUrl)}" />
                                    </div>
                                </div>
                                <div class="acu-input-group">
                                    <label class="acu-input-group-label">别名</label>
                                    <div class="acu-alias-tags-container">
                                        ${(data.aliases || []).map(a => `<span class="acu-alias-tag" data-alias="${escapeHtml(a)}">${escapeHtml(a)} <i class="fa-solid fa-xmark"></i></span>`).join('')}
                                        <input type="text" class="acu-alias-input" placeholder="输入别名，逗号分隔..." />
                                    </div>
                                </div>
                                <div class="acu-avatar-expanded-footer">
                                    <div class="acu-avatar-footer-actions">
                                        <button class="acu-btn-action acu-avatar-reset-settings-btn" type="button" title="清空头像、别名和颜色" aria-label="清空头像、别名和颜色"><i class="fa-solid fa-eraser"></i><span>清空</span></button>
                                        <label class="acu-btn-action acu-avatar-upload-trigger" role="button" tabindex="0" title="本地上传头像" aria-label="本地上传头像">
                                            <i class="fa-solid fa-cloud-arrow-up"></i>
                                            <input type="file" accept="image/*" class="acu-avatar-file-input" />
                                        </label>
                                        <button class="acu-btn-action acu-btn-save acu-avatar-save-btn" type="button" title="保存" aria-label="保存头像设置"><i class="fa-solid fa-floppy-disk"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        }

        // 再渲染其他节点
        for (const node of otherNodes) {
          const data = allAvatarData[node.name] || {};
          let currentUrl = data.url || '';

          // 检查是否有本地图片
          const hasLocal = await AvatarManager.hasLocalAvatar(node.name);
          let displayUrl = '';
          let sourceLabel = '';

          if (hasLocal) {
            displayUrl = await LocalAvatarDB.get(node.name);
            sourceLabel = '<span class="acu-avatar-source acu-source-local">本地</span>';
          } else if (currentUrl) {
            displayUrl = currentUrl;
            sourceLabel = '<span class="acu-avatar-source acu-source-url">URL</span>';
          }

          const aliases = (data.aliases || []).join(', ');
          const hasAvatar = !!displayUrl;

          // 默认策略：仅在首次加载时，如果没有头像URL，自动展开方便编辑
          if (isInitialLoad && !hasAvatar && !data.url) {
            expandedItems.add(node.name);
          }
          const isExpanded = expandedItems.has(node.name);

          listHtml += `
                    <div class="acu-avatar-item ${isExpanded ? 'expanded' : ''}" data-name="${escapeHtml(node.name)}" data-has-local="${hasLocal}" data-display-url="${escapeHtml(displayUrl)}">
                        <!-- 折叠态 -->
                        <div class="acu-avatar-row-collapsed">
                            <div class="acu-avatar-identity-tools">
                                <div class="acu-avatar-preview-wrap">
                                    <div class="acu-avatar-preview ${hasAvatar ? 'has-image' : ''}" role="button" tabindex="0" aria-label="调整 ${escapeHtml(node.name)} 的头像" data-avatar-url="${escapeHtml(displayUrl)}" data-avatar-x="${data.offsetX ?? 50}" data-avatar-y="${data.offsetY ?? 50}" data-avatar-scale="${data.scale ?? 150}">
                                        ${!hasAvatar ? `<span>${escapeHtml(node.name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>` : ''}
                                    </div>
                                    ${sourceLabel}
                                </div>
                            </div>
                            <div class="acu-avatar-info-summary">
                                <div class="acu-avatar-name"><span class="acu-avatar-name-text">${escapeHtml(node.name)}</span>${renderAvatarColorControlHtml(node.name, data)}</div>
                                <div class="acu-avatar-url-preview">${escapeHtml(currentUrl || '无头像设置')}</div>
                            </div>
                            <div class="acu-avatar-actions-collapsed">
                                <button class="acu-btn-action acu-btn-edit" type="button" title="${isExpanded ? '收起' : '编辑'}" aria-label="${isExpanded ? '收起头像设置' : '编辑头像设置'}"><i class="fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-pencil'}"></i></button>
                            </div>
                        </div>

                        <!-- 展开态 -->
                        <div class="acu-avatar-row-expanded">
                            <div class="acu-avatar-details">
                                <div class="acu-input-group">
                                    <label class="acu-input-group-label">URL</label>
                                    <div class="acu-url-container">
                                        <input type="text" class="acu-input acu-avatar-url" placeholder="粘贴图片链接..." value="${escapeHtml(currentUrl)}" />
                                    </div>
                                </div>
                                <div class="acu-input-group">
                                    <label class="acu-input-group-label">别名</label>
                                    <div class="acu-alias-tags-container">
                                        ${(data.aliases || []).map(a => `<span class="acu-alias-tag" data-alias="${escapeHtml(a)}">${escapeHtml(a)} <i class="fa-solid fa-xmark"></i></span>`).join('')}
                                        <input type="text" class="acu-alias-input" placeholder="输入别名，逗号分隔..." />
                                    </div>
                                </div>
                                <div class="acu-avatar-expanded-footer">
                                    <div class="acu-avatar-footer-actions">
                                        <button class="acu-btn-action acu-avatar-reset-settings-btn" type="button" title="清空头像、别名和颜色" aria-label="清空头像、别名和颜色"><i class="fa-solid fa-eraser"></i><span>清空</span></button>
                                        <label class="acu-btn-action acu-avatar-upload-trigger" role="button" tabindex="0" title="本地上传头像" aria-label="本地上传头像">
                                            <i class="fa-solid fa-cloud-arrow-up"></i>
                                            <input type="file" accept="image/*" class="acu-avatar-file-input" />
                                        </label>
                                        <button class="acu-btn-action acu-btn-save acu-avatar-save-btn" type="button" title="保存" aria-label="保存头像设置"><i class="fa-solid fa-floppy-disk"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        }

        return listHtml;
      };

      const applyAvatarPreviewStyles = $root => {
        $root.find('.acu-avatar-preview').each(function () {
          const $preview = $(this);
          const url = $preview.attr('data-avatar-url');
          if (!url) return;
          const cssImageUrl = formatCssImageUrl(url, { allowInternalObjectUrl: true });
          if (!cssImageUrl) {
            $preview.removeClass('has-image').css('--acu-avatar-image', '');
            return;
          }
          const offsetX = Number($preview.attr('data-avatar-x') || 50);
          const offsetY = Number($preview.attr('data-avatar-y') || 50);
          const scale = Number($preview.attr('data-avatar-scale') || 150);
          $preview.css({
            '--acu-avatar-image': cssImageUrl,
            '--acu-avatar-x': `${offsetX}%`,
            '--acu-avatar-y': `${offsetY}%`,
            '--acu-avatar-scale': `${scale}%`,
          });
        });
      };

      const syncAvatarColorPickerState = ($container: JQuery<HTMLElement>, color: string) => {
        const hsl = avatarHexToHsl(color) || { h: 0, s: 0.54, l: 0.5 };
        const hue = Math.round(hsl.h);
        const saturation = Math.round(hsl.s * 100);
        const lightness = Math.round(hsl.l * 100);
        $container.css({
          '--acu-avatar-ui-color': color,
          '--acu-avatar-picker-hue': String(hue),
          '--acu-avatar-picker-saturation': `${saturation}%`,
          '--acu-avatar-picker-lightness': `${lightness}%`,
        });
        $container.find('.acu-avatar-color-hex').val(color);
        $container.find('.acu-avatar-color-hue-slider').val(hue);
        $container.find('.acu-avatar-color-saturation-slider').val(saturation);
        $container.find('.acu-avatar-color-lightness-slider').val(lightness);
        $container
          .find('.acu-avatar-color-option')
          .removeClass('active')
          .filter(`[data-color="${color}"]`)
          .addClass('active');
      };

      const syncAvatarColorControls = ($item, name: string) => {
        const $container = $item.find('.acu-avatar-color-container');
        if (!$container.length) return;
        const data = AvatarManager.getAll()[name] || {};
        const storedColor = normalizeAvatarHexColor(data.imageColor);
        const color = storedColor || AvatarManager.getImageColor(name);
        const source = storedColor ? data.imageColorSource || 'auto' : 'fallback';
        $container
          .attr('data-original-color', storedColor || '')
          .attr('data-original-source', source)
          .removeAttr('data-pending-source');
        syncAvatarColorPickerState($container, color);
      };

      const markAvatarColorManualPending = ($container, color: string) => {
        $container.attr('data-pending-source', 'manual');
        syncAvatarColorPickerState($container, color);
      };

      const applyAvatarColorInputOnSave = ($item, name: string): boolean => {
        const $container = $item.find('.acu-avatar-color-container');
        if (!$container.length) return true;
        const rawColor = String($container.find('.acu-avatar-color-hex').val() || '').trim();
        const normalizedColor = normalizeAvatarHexColor(rawColor);
        if (!normalizedColor) {
          if (window.toastr) window.toastr.warning('请输入有效的 3 位或 6 位十六进制颜色');
          return false;
        }

        const pendingSource = String($container.attr('data-pending-source') || '');
        if (pendingSource === 'manual') {
          AvatarManager.setImageColor(name, normalizedColor, 'manual');
        }
        return true;
      };

      // 先显示加载状态
      const isGlobalView = currentView === 'global';
      const managerHtml = `
            <div class="acu-avatar-manager-overlay acu-theme-${config.theme}">
                <div class="acu-avatar-manager" role="dialog" aria-modal="true" aria-labelledby="acu-avatar-manager-title">
                    <div class="acu-panel-header">
                        <div class="acu-avatar-title" id="acu-avatar-manager-title"><i class="fa-solid fa-user-circle"></i> 角色头像预设</div>
                        <div class="acu-avatar-header-actions">
                            ${getTutorialButtonHtml('avatarManager', '查看角色头像预设教程', 'acu-btn-icon')}
                            <button class="acu-avatar-close" type="button" title="关闭" aria-label="关闭角色头像预设"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-avatar-toolbar">
                        <!-- 左侧:切换视图、排序、搜索 -->
                        <div class="acu-toolbar-group left acu-avatar-filter-controls">
                            <button class="acu-btn-icon acu-view-toggle ${isGlobalView ? 'active' : ''}" type="button" title="当前聊天 / 全局头像库" aria-label="切换当前聊天和全局头像库" aria-pressed="${isGlobalView ? 'true' : 'false'}" data-view="${currentView}">
                                <i class="fa-solid ${isGlobalView ? 'fa-globe' : 'fa-comments'}"></i>
                            </button>
                            <div class="acu-sort-menu" data-value="${sortBy}">
                                <button class="acu-toolbar-select acu-sort-trigger" type="button" title="排序方式" aria-label="头像排序方式" aria-haspopup="listbox" aria-expanded="false">
                                    <span class="acu-sort-label">${escapeHtml(getAvatarSortLabel(sortBy))}</span>
                                    <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                                </button>
                                <div class="acu-sort-menu-list" role="listbox" aria-label="头像排序方式">
                                    ${avatarSortOptions
                                      .map(
                                        option => `
                                            <button class="acu-sort-option ${option.value === sortBy ? 'active' : ''}" type="button" role="option" aria-selected="${option.value === sortBy ? 'true' : 'false'}" data-sort="${option.value}">
                                                ${escapeHtml(option.label)}
                                            </button>
                                        `,
                                      )
                                      .join('')}
                                </div>
                            </div>
                            <button class="acu-btn-icon acu-sort-order" type="button" title="排序方向" aria-label="切换排序方向" data-dir="asc">
                                <i class="fa-solid fa-arrow-down-a-z"></i>
                            </button>
                            <button class="acu-btn-icon acu-avatar-import-btn acu-avatar-toolbar-action" type="button" title="导入" aria-label="导入头像配置"><i class="fa-solid fa-file-import"></i></button>
                            <button class="acu-btn-icon acu-avatar-export-btn acu-avatar-toolbar-action" type="button" title="导出" aria-label="导出头像配置"><i class="fa-solid fa-file-export"></i></button>
                            <div class="acu-search-wrapper">
                                <i class="fa-solid fa-magnifying-glass acu-search-icon"></i>
                                <input type="text" class="acu-avatar-search" placeholder="搜索..." autocomplete="off" aria-label="搜索头像">
                                <button class="acu-search-clear" type="button" aria-label="清空搜索" hidden><i class="fa-solid fa-xmark"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="acu-avatar-list" id="acu-avatar-list-container">
                        <div class="acu-import-empty">
                            <i class="fa-solid fa-spinner fa-spin"></i> 加载中...
                        </div>
                    </div>
                </div>
                <input type="file" id="acu-avatar-file-input" accept=".json" />
            </div>
        `;

      const $manager = $(managerHtml);
      $('body').append($manager);
      bindTutorialButtonsIn($manager);

      // 异步加载列表
      buildList().then(listHtml => {
        $manager.find('#acu-avatar-list-container').html(listHtml);
        applyAvatarPreviewStyles($manager);
        bindAvatarEvents();
      });

      // 刷新单个条目的显示
      const refreshItem = async name => {
        const $item = $manager.find(`.acu-avatar-item[data-name="${name}"]`);
        if (!$item.length) return;

        const data = AvatarManager.getAll()[name] || {};
        const hasLocal = await AvatarManager.hasLocalAvatar(name);
        let displayUrl = '';
        let sourceLabel = '';

        if (hasLocal) {
          displayUrl = await LocalAvatarDB.get(name);
          sourceLabel = '<span class="acu-avatar-source acu-source-local">本地</span>';
        } else if (data.url) {
          displayUrl = data.url;
          sourceLabel = '<span class="acu-avatar-source acu-source-url">URL</span>';
        }

        const $preview = $item.find('.acu-avatar-preview');
        $item.find('.acu-avatar-source').remove();

        if (displayUrl) {
          const cssImageUrl = formatCssImageUrl(displayUrl, { allowInternalObjectUrl: true });
          $preview
            .toggleClass('has-image', Boolean(cssImageUrl))
            .attr('data-avatar-url', displayUrl)
            .attr('data-avatar-x', data.offsetX ?? 50)
            .attr('data-avatar-y', data.offsetY ?? 50)
            .attr('data-avatar-scale', data.scale ?? 150)
            .css({
              '--acu-avatar-image': cssImageUrl,
              '--acu-avatar-x': `${data.offsetX ?? 50}%`,
              '--acu-avatar-y': `${data.offsetY ?? 50}%`,
              '--acu-avatar-scale': `${data.scale ?? 150}%`,
            })
            .find('span')
            .remove();
          $item.find('.acu-avatar-preview-wrap').append(sourceLabel);
          $item.find('.acu-avatar-url-preview').text(data.url || '本地图片');
        } else {
          $preview
            .removeClass('has-image')
            .attr('data-avatar-url', '')
            .attr('data-avatar-x', 50)
            .attr('data-avatar-y', 50)
            .attr('data-avatar-scale', 150)
            .css({
              '--acu-avatar-image': '',
              '--acu-avatar-x': '',
              '--acu-avatar-y': '',
              '--acu-avatar-scale': '',
            })
            .html(
              `<span>${escapeHtml(name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>`,
            );
          $item.find('.acu-avatar-url-preview').text('无头像设置');
        }

        $item.attr('data-has-local', hasLocal);
        $item.attr('data-display-url', displayUrl);
        syncAvatarColorControls($item, name);
      };

      // 刷新整个列表
      const refreshList = async () => {
        const listHtml = await buildList();
        $manager.find('#acu-avatar-list-container').html(listHtml);
        applyAvatarPreviewStyles($manager);
        // 首次加载完成后，禁止后续自动展开
        isInitialLoad = false;
      };

      const bindAvatarEvents = () => {
        // 视图切换(toggle图标)
        $manager.on('click', '.acu-view-toggle', async function () {
          const $btn = $(this);
          const isChat = $btn.attr('data-view') === 'chat';
          const newView = isChat ? 'global' : 'chat';

          $btn.attr('data-view', newView);
          currentView = newView;

          const $icon = $btn.find('i');
          if (newView === 'global') {
            $icon.removeClass('fa-comments').addClass('fa-globe');
            $btn.addClass('active');
            $btn.attr('aria-pressed', 'true');
          } else {
            $icon.removeClass('fa-globe').addClass('fa-comments');
            $btn.removeClass('active');
            $btn.attr('aria-pressed', 'false');
          }

          await refreshList();
        });

        // 搜索(带防抖)
        const debouncedSearch = _.debounce(async () => {
          await refreshList();
        }, 300);

        $manager.on('input', '.acu-avatar-search', function () {
          searchQuery = $(this).val().trim();
          const $clear = $manager.find('.acu-search-clear');
          $clear.prop('hidden', !searchQuery);
          debouncedSearch();
        });

        $manager.on('click', '.acu-search-clear', async function () {
          searchQuery = '';
          $manager.find('.acu-avatar-search').val('');
          $(this).prop('hidden', true);
          await refreshList();
        });

        const closeAvatarSortMenu = () => {
          $manager
            .find('.acu-sort-menu.open')
            .removeClass('open')
            .find('.acu-sort-trigger')
            .attr('aria-expanded', 'false');
        };

        $manager.on('click', '.acu-sort-trigger', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const $menu = $(this).closest('.acu-sort-menu');
          const shouldOpen = !$menu.hasClass('open');
          closeAvatarSortMenu();
          if (shouldOpen) {
            $menu.addClass('open');
            $(this).attr('aria-expanded', 'true');
          }
        });

        $manager.on('click', '.acu-sort-option', async function (e) {
          e.preventDefault();
          e.stopPropagation();
          const value = String($(this).attr('data-sort') || '');
          if (!isAvatarSortField(value)) return;
          sortBy = value;
          const $menu = $(this).closest('.acu-sort-menu');
          $menu.attr('data-value', value);
          $menu.find('.acu-sort-label').text(getAvatarSortLabel(value));
          $menu.find('.acu-sort-option').removeClass('active').attr('aria-selected', 'false');
          $(this).addClass('active').attr('aria-selected', 'true');
          closeAvatarSortMenu();
          await refreshList();
        });

        $manager.on('click', function (e) {
          if (!$(e.target).closest('.acu-sort-menu').length) {
            closeAvatarSortMenu();
          }
        });

        // 排序方向(toggle图标)
        $manager.on('click', '.acu-sort-order', async function () {
          const $btn = $(this);
          const isAsc = $btn.attr('data-dir') === 'asc';
          const newDir = isAsc ? 'desc' : 'asc';

          $btn.attr('data-dir', newDir);
          sortOrder = newDir;

          const $icon = $btn.find('i');
          if (newDir === 'desc') {
            $icon.removeClass('fa-arrow-down-a-z').addClass('fa-arrow-up-a-z');
          } else {
            $icon.removeClass('fa-arrow-up-a-z').addClass('fa-arrow-down-a-z');
          }

          await refreshList();
        });

        // 点击头像预览
        $manager.on('click', '.acu-avatar-preview', async function (e) {
          e.stopPropagation();
          const $item = $(this).closest('.acu-avatar-item');
          const name = $item.data('name');
          const displayUrl = $item.attr('data-display-url');

          if (displayUrl) {
            // 有图片 → 打开裁剪弹窗
            showAvatarCropModal(displayUrl, name, async result => {
              const data = AvatarManager.getAll()[name] || {};
              AvatarManager.set(name, data.url || '', result.offsetX, result.offsetY, result.scale, data.aliases || []);
              await refreshAutoImageColorForAvatar(name, result.imageSource || displayUrl, result);
              await refreshItem(name);
              refreshDialogueIndentRender();
              onUpdate && onUpdate();
            });
          } else {
            // 无图片 → 直接触发本地上传
            $item.find('.acu-avatar-file-input').click();
          }
        });

        $manager.on('keydown', '.acu-avatar-preview', function (e: JQuery.KeyDownEvent) {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          $(this).trigger('click');
        });

        // 展开/折叠切换
        $manager.on('click', '.acu-btn-edit', function (e) {
          e.stopPropagation();
          const $item = $(this).closest('.acu-avatar-item');
          const name = $item.data('name');
          const isExpanded = $item.hasClass('expanded');

          if (isExpanded) {
            $item.removeClass('expanded');
            expandedItems.delete(name);
            $(this).find('i').removeClass('fa-chevron-up').addClass('fa-pencil');
            $(this).attr({ title: '编辑', 'aria-label': '编辑头像设置' });
          } else {
            $item.addClass('expanded');
            expandedItems.add(name);
            $(this).find('i').removeClass('fa-pencil').addClass('fa-chevron-up');
            $(this).attr({ title: '收起', 'aria-label': '收起头像设置' });
          }
        });

        // 别名标签输入逻辑
        $manager.on('keydown', '.acu-alias-input', function (e) {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = $(this).val().trim();
            if (val) {
              const $container = $(this).closest('.acu-alias-tags-container');
              // 检查重复
              let exists = false;
              $container.find('.acu-alias-tag').each(function () {
                if ($(this).data('alias') === val) exists = true;
              });

              if (!exists) {
                const tagHtml = `<span class="acu-alias-tag" data-alias="${escapeHtml(val)}">${escapeHtml(val)} <i class="fa-solid fa-xmark"></i></span>`;
                $(this).before(tagHtml);
              }
              $(this).val('');
            }
          } else if (e.key === 'Backspace' && !$(this).val()) {
            // 删除最后一个标签
            $(this).prev('.acu-alias-tag').remove();
          }
        });

        // 逗号输入处理 (用于中文逗号)
        $manager.on('input', '.acu-alias-input', function (e) {
          const val = $(this).val();
          if (val.includes(',') || val.includes('，')) {
            const parts = val.split(/[,，]/);
            const lastPart = parts.pop(); // 保留最后一部分在输入框
            const $container = $(this).closest('.acu-alias-tags-container');

            parts.forEach(part => {
              const cleanPart = part.trim();
              if (cleanPart) {
                let exists = false;
                $container.find('.acu-alias-tag').each(function () {
                  if ($(this).data('alias') === cleanPart) exists = true;
                });
                if (!exists) {
                  const tagHtml = `<span class="acu-alias-tag" data-alias="${escapeHtml(cleanPart)}">${escapeHtml(cleanPart)} <i class="fa-solid fa-xmark"></i></span>`;
                  $(this).before(tagHtml);
                }
              }
            });
            $(this).val(lastPart);
          }
        });

        // 粘贴处理
        $manager.on('paste', '.acu-alias-input', function (e) {
          e.preventDefault();
          const clipboardData = (e.originalEvent || e).clipboardData;
          const pastedData = clipboardData.getData('text');
          if (!pastedData) return;

          const parts = pastedData.split(/[,，\n]/);
          const $container = $(this).closest('.acu-alias-tags-container');

          parts.forEach(part => {
            const cleanPart = part.trim();
            if (cleanPart) {
              let exists = false;
              $container.find('.acu-alias-tag').each(function () {
                if ($(this).data('alias') === cleanPart) exists = true;
              });
              if (!exists) {
                const tagHtml = `<span class="acu-alias-tag" data-alias="${escapeHtml(cleanPart)}">${escapeHtml(cleanPart)} <i class="fa-solid fa-xmark"></i></span>`;
                $(this).before(tagHtml);
              }
            }
          });
        });

        // 删除标签
        $manager.on('click', '.acu-alias-tag i', function () {
          $(this).parent().remove();
        });

        // 点击容器聚焦输入框
        $manager.on('click', '.acu-alias-tags-container', function (e) {
          if (e.target === this) {
            $(this).find('.acu-alias-input').focus();
          }
        });

        const closeAvatarColorPopovers = () => {
          $manager
            .find('.acu-avatar-color-popover')
            .prop('hidden', true)
            .css({ position: '', left: '', top: '' })
            .closest('.acu-avatar-color-container')
            .find('.acu-avatar-color-swatch-btn')
            .attr('aria-expanded', 'false');
        };

        const positionAvatarColorPopover = ($trigger: JQuery<HTMLElement>, $popover: JQuery<HTMLElement>) => {
          const trigger = $trigger[0] as HTMLElement | undefined;
          const popover = $popover[0] as HTMLElement | undefined;
          if (!trigger || !popover) return;
          const ownerDocument = trigger.ownerDocument || document;
          const ownerWindow = ownerDocument.defaultView || window;
          $popover.css({ position: 'fixed', left: '0px', top: '0px' });
          const triggerRect = trigger.getBoundingClientRect();
          const popoverRect = popover.getBoundingClientRect();
          const gap = 6;
          const margin = 8;
          const viewportWidth = ownerWindow.innerWidth || ownerDocument.documentElement.clientWidth || 0;
          const viewportHeight = ownerWindow.innerHeight || ownerDocument.documentElement.clientHeight || 0;
          const maxLeft = Math.max(margin, viewportWidth - popoverRect.width - margin);
          const left = Math.max(margin, Math.min(triggerRect.left, maxLeft));
          const belowTop = triggerRect.bottom + gap;
          const aboveTop = triggerRect.top - popoverRect.height - gap;
          const top =
            belowTop + popoverRect.height <= viewportHeight - margin
              ? belowTop
              : Math.max(margin, Math.min(aboveTop, viewportHeight - popoverRect.height - margin));
          $popover.css({ left: `${left}px`, top: `${top}px` });
        };

        $manager.on('click', '.acu-avatar-color-swatch-btn', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const $container = $(this).closest('.acu-avatar-color-container');
          const $popover = $container.find('.acu-avatar-color-popover');
          const shouldOpen = Boolean($popover.prop('hidden'));
          closeAvatarColorPopovers();
          $popover.prop('hidden', !shouldOpen);
          $(this).attr('aria-expanded', shouldOpen ? 'true' : 'false');
          if (shouldOpen) positionAvatarColorPopover($(this), $popover);
        });

        $manager.on('click', '.acu-avatar-color-popover', function (e) {
          e.stopPropagation();
        });

        $manager.on('click', '.acu-avatar-color-close-btn', function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeAvatarColorPopovers();
        });

        $manager.on('click', function (e) {
          if (!$(e.target).closest('.acu-avatar-color-container').length) {
            closeAvatarColorPopovers();
          }
        });

        $manager.on('click', '.acu-avatar-color-option', function (e) {
          e.preventDefault();
          const color = normalizeAvatarHexColor($(this).attr('data-color'));
          if (!color) return;
          markAvatarColorManualPending($(this).closest('.acu-avatar-color-container'), color);
        });

        $manager.on('input', '.acu-avatar-color-slider', function () {
          const $container = $(this).closest('.acu-avatar-color-container');
          const hue = clampAvatarNumber($container.find('.acu-avatar-color-hue-slider').val(), 0, 360, 0);
          const saturation = clampAvatarNumber(
            $container.find('.acu-avatar-color-saturation-slider').val(),
            0,
            100,
            54,
          );
          const lightness = clampAvatarNumber($container.find('.acu-avatar-color-lightness-slider').val(), 20, 80, 50);
          markAvatarColorManualPending($container, hslToAvatarHex(hue, saturation / 100, lightness / 100));
        });

        $manager.on('input', '.acu-avatar-color-hex', function () {
          const $input = $(this);
          const color = normalizeAvatarHexColor($input.val());
          if (!color) {
            $input.closest('.acu-avatar-color-container').attr('data-pending-source', 'manual');
            return;
          }
          markAvatarColorManualPending($input.closest('.acu-avatar-color-container'), color);
        });

        $manager.on('blur', '.acu-avatar-color-hex', function () {
          const $input = $(this);
          const color = normalizeAvatarHexColor($input.val());
          if (color) {
            markAvatarColorManualPending($input.closest('.acu-avatar-color-container'), color);
            return;
          }
          const $item = $input.closest('.acu-avatar-item');
          syncAvatarColorControls($item, $item.data('name'));
        });

        $manager.on('click', '.acu-avatar-color-generate-btn', async function (e) {
          e.preventDefault();
          e.stopPropagation();
          const $btn = $(this);
          const $item = $btn.closest('.acu-avatar-item');
          const name = $item.data('name') as string;
          AvatarManager.clearImageColor(name);
          const displayUrl = $item.attr('data-display-url') || '';
          const data = AvatarManager.getAll()[name] || {};
          $btn.prop('disabled', true).addClass('disabled');
          try {
            await refreshAutoImageColorForAvatar(name, displayUrl, {
              offsetX: data.offsetX ?? 50,
              offsetY: data.offsetY ?? 50,
              scale: data.scale ?? 150,
            });
            syncAvatarColorControls($item, name);
            refreshDialogueIndentRender();
            onUpdate && onUpdate();
          } finally {
            $btn.prop('disabled', false).removeClass('disabled');
          }
        });

        $manager.on('keydown', '.acu-avatar-upload-trigger', function (e: JQuery.KeyDownEvent) {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          $(this).find('.acu-avatar-file-input').trigger('click');
        });

        // 本地文件上传
        $manager.on('change', '.acu-avatar-file-input', async function (e) {
          const file = e.target.files[0];
          if (!file) return;

          if (!file.type.startsWith('image/')) {
            if (window.toastr) window.toastr.warning('请选择图片文件');
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            if (window.toastr) window.toastr.warning('图片大小不能超过 5MB');
            return;
          }

          const $item = $(this).closest('.acu-avatar-item');
          const name = $item.data('name');

          try {
            const success = await AvatarManager.saveLocalAvatar(name, file);
            if (success) {
              const newUrl = await LocalAvatarDB.get(name);
              await refreshItem(name);

              // 自动弹出裁剪弹窗
              showAvatarCropModal(newUrl, name, async result => {
                const data = AvatarManager.getAll()[name] || {};
                AvatarManager.set(
                  name,
                  data.url || '',
                  result.offsetX,
                  result.offsetY,
                  result.scale,
                  data.aliases || [],
                );
                await refreshAutoImageColorForAvatar(name, result.imageSource || newUrl, result);
                await refreshItem(name);
                refreshDialogueIndentRender();
                onUpdate && onUpdate();
              });
            }
          } catch (err) {
            console.error('[DICE]ACU 上传头像失败:', err);
            if (window.toastr)
              showActionableErrorToast('头像图片上传失败，未能保存新的本地头像。', { suggestion: 'image' });
          }

          $(this).val('');
        });

        // "主角"自动合并开关
        $manager.on('click', '.acu-protagonist-toggle', function () {
          const $btn = $(this);
          const diceCfg = getDiceConfig();
          const newValue = diceCfg.autoMergeProtagonist === false ? true : false;
          saveDiceConfig({ autoMergeProtagonist: newValue });

          $btn.toggleClass('active', newValue);
          $btn.attr('aria-pressed', newValue ? 'true' : 'false');
          $btn.find('i').attr('class', `fa-solid ${newValue ? 'fa-link' : 'fa-link-slash'}`);

          if (window.toastr) window.toastr.info(newValue ? '已开启自动合并"主角"' : '已关闭自动合并"主角"');
        });

        // 保存URL → 弹出裁剪
        $manager.on('click', '.acu-avatar-save-btn', async function () {
          const $item = $(this).closest('.acu-avatar-item');
          const name = $item.data('name');
          const url = $item.find('.acu-avatar-url').val().trim();
          const urlValidation = url ? getRemoteImageUrlValidationError(url) : null;
          if (urlValidation) {
            if (window.toastr) window.toastr.warning(getImageUrlValidationMessage('头像 URL', urlValidation));
            return;
          }

          // 从标签收集别名
          const aliases = [];
          $item.find('.acu-alias-tag').each(function () {
            aliases.push($(this).data('alias'));
          });
          // 也检查输入框里有没有残留的内容
          const pendingAlias = $item.find('.acu-alias-input').val().trim();
          if (pendingAlias && !aliases.includes(pendingAlias)) {
            aliases.push(pendingAlias);
          }

          const data = AvatarManager.getAll()[name] || {};

          // 保存基础配置
          if (!applyAvatarColorInputOnSave($item, name)) return;
          AvatarManager.set(name, url, data.offsetX ?? 50, data.offsetY ?? 50, data.scale ?? 150, aliases);

          // 如果有URL且没有本地图片，弹出裁剪
          const hasLocal = $item.attr('data-has-local') === 'true';
          if (url && !hasLocal) {
            await refreshItem(name);
            showAvatarCropModal(url, name, async result => {
              AvatarManager.set(name, url, result.offsetX, result.offsetY, result.scale, aliases);
              if (!applyAvatarColorInputOnSave($item, name)) return;
              await refreshAutoImageColorForAvatar(name, result.imageSource || url, result);
              await refreshItem(name);
              refreshDialogueIndentRender();
              onUpdate && onUpdate();
            });
          } else {
            await refreshAutoImageColorForAvatar(name, $item.attr('data-display-url') || url, data);
            await refreshItem(name);
            refreshDialogueIndentRender();
            onUpdate && onUpdate();
          }
        });

        // 清空当前角色的头像、别名和颜色设置
        $manager.on('click', '.acu-avatar-reset-settings-btn', async function () {
          const $item = $(this).closest('.acu-avatar-item');
          const name = $item.data('name') as string;

          $item.find('.acu-avatar-url').val('');
          $item.find('.acu-alias-tag').remove();
          $item.find('.acu-alias-input').val('');

          const hasLocal = await AvatarManager.hasLocalAvatar(name);
          if (hasLocal) {
            await LocalAvatarDB.delete(name);
          }

          AvatarManager.remove(name);
          await refreshAutoImageColorForAvatar(name, '', {});

          await refreshItem(name);
          refreshDialogueIndentRender();
          onUpdate && onUpdate();
          if (window.toastr) window.toastr.info('已清空头像设置');
        });

        // 导出
        $manager.on('click', '.acu-avatar-export-btn', function () {
          const exportData = AvatarManager.exportData();
          const jsonStr = JSON.stringify(exportData, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `avatar-config-${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });

        // 导入
        $manager.on('click', '.acu-avatar-import-btn', function () {
          $manager.find('#acu-avatar-file-input').click();
        });

        $manager.on('change', '#acu-avatar-file-input', function (e) {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = function (evt) {
            try {
              const jsonData = JSON.parse(evt.target.result);
              const analysis = AvatarManager.analyzeImport(jsonData);

              if (!analysis.valid) {
                if (window.toastr)
                  showActionableErrorToast(analysis.error, {
                    suggestion: '请确认导入文件是从“角色头像预设”导出的配置，并检查其中的角色名、URL 和本地图片引用是否完整。',
                  });
                return;
              }

              showImportConfirmDialog(jsonData, analysis, () => {
                $manager.remove();
                showAvatarManager(nodeArr, onUpdate, options);
                onUpdate && onUpdate();
              });
            } catch (err) {
              console.error('[DICE]ACU 导入解析失败:', err);
              if (window.toastr)
                showActionableErrorToast('头像配置文件解析失败，无法读取为有效 JSON。', { suggestion: 'importExport' });
            }
          };
          reader.readAsText(file);
          $(this).val('');
        });
      };

      // 关闭
      const closeManager = () => $manager.remove();
      $manager.on('click', '.acu-avatar-close', closeManager);
      setupOverlayClose($manager, 'acu-avatar-manager-overlay', closeManager);
    } catch (error) {
      console.error('角色头像预设错误:', error);
      if (window.toastr) {
        const errorMsg = error instanceof Error ? error.message : '未知错误';
        showActionableErrorToast(`角色头像预设加载失败: ${errorMsg}`, { developerHint: true });
      }
      // 清理可能残留的DOM
      $('.acu-avatar-manager-overlay').remove();
    }
  };

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
  const showManualUpdateDialog = (options?: {
    title?: string;
    iconClass?: string;
    description?: string;
    safeTitle?: string;
    safeDescription?: string;
    confirmText?: string;
    loadingText?: string;
    onConfirm?: () => Promise<void>;
    isDanger?: boolean;
    safeIconClass?: string;
  }) => {
    const { $ } = getCore();
    $('.acu-manual-update-overlay').remove();

    const config = getConfig();
    const title = options?.title || '手动更新';
    const iconClass = options?.iconClass || 'fa-rotate';
    const description = options?.description || '将清理脚本缓存并刷新页面，以获取最新版本。';
    const safeTitle = options?.safeTitle || '数据安全';
    const safeDescription =
      options?.safeDescription || '您的自定义规则、预设、正则转换、黑名单等数据存储在本地游览器中，不会受到影响。';
    const confirmText = options?.confirmText || '立即更新';
    const loadingText = options?.loadingText || '更新中...';
    const onConfirm = options?.onConfirm;
    const isDanger = options?.isDanger || false;
    const safeIconClass = options?.safeIconClass || (isDanger ? 'fa-triangle-exclamation' : 'fa-shield-check');

    // 颜色统一跟随主题变量，避免硬编码色与主题不协调
    const headerBg = 'var(--acu-table-head)';
    const headerTextColor = 'var(--acu-text-main)';
    const confirmBtnBg = 'var(--acu-accent)';
    const safeBoxBorder = 'var(--acu-border)';
    const safeBoxIconColor = 'var(--acu-accent)';

    const dialogHtml = `
    <div class="acu-manual-update-overlay acu-theme-${config.theme}">
      <div class="acu-manual-update-dialog" style="background:var(--acu-bg-panel);border-color:var(--acu-border);max-width:420px;box-shadow:0 8px 24px rgba(0,0,0,0.3);">
        <div class="acu-manual-update-header" style="background:${headerBg};color:${headerTextColor};border-bottom:1px solid var(--acu-border);padding:12px 16px;font-weight:bold;font-size:1.1em;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid ${escapeHtml(iconClass)}" style="font-size:1.1em;"></i> ${escapeHtml(title)}
        </div>
        <div class="acu-manual-update-body" style="color:var(--acu-text-main);padding:20px 16px;">
          <p style="color:var(--acu-text-main);margin-bottom:16px;line-height:1.5;">${escapeHtml(description)}</p>
          <div class="acu-manual-update-safe-box" style="background:var(--acu-btn-bg);border:1px solid ${safeBoxBorder};border-radius:6px;padding:12px;display:flex;gap:12px;align-items:flex-start;">
            <i class="fa-solid ${escapeHtml(safeIconClass)}" style="color:${safeBoxIconColor};font-size:1.2em;margin-top:2px;"></i>
            <div class="safe-text" style="display:flex;flex-direction:column;gap:4px;">
              <strong style="color:var(--acu-text-main);font-size:0.95em;">${escapeHtml(safeTitle)}</strong>
              <span style="color:var(--acu-text-sub);font-size:0.85em;line-height:1.4;">${escapeHtml(safeDescription)}</span>
            </div>
          </div>
        </div>
        <div class="acu-manual-update-footer" style="background:var(--acu-table-head);border-top:1px solid var(--acu-border);padding:12px 16px;display:flex;justify-content:flex-end;gap:10px;">
          <button class="acu-manual-update-cancel-btn" style="background:transparent;color:var(--acu-text-sub);border:1px solid var(--acu-border);padding:6px 16px;border-radius:4px;cursor:pointer;transition:all 0.2s;">取消</button>
          <button class="acu-manual-update-confirm-btn" style="background:${confirmBtnBg};color:var(--acu-btn-active-text, #fff);border:none;padding:6px 20px;border-radius:4px;cursor:pointer;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:all 0.2s;">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    </div>
  `;

    const $dialog = $(dialogHtml);
    $('body').append($dialog);

    const overlayEl = $dialog[0];

    // 事件绑定
    $dialog.find('.acu-manual-update-cancel-btn').on('click', () => {
      $dialog.remove();
    });

    $dialog.find('.acu-manual-update-confirm-btn').on('click', async () => {
      const $btn = $dialog.find('.acu-manual-update-confirm-btn');
      $btn.prop('disabled', true).html(`<i class="fa-solid fa-spinner fa-spin"></i> ${escapeHtml(loadingText)}`);

      try {
        if (onConfirm) {
          await onConfirm();
          $dialog.remove();
          return;
        }

        await clearDiceSystemCache();
        // 刷新整个酒馆页面并绕过缓存（相当于 Ctrl+Shift+R）
        if (window.parent !== window) {
          window.parent.location.reload();
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error('[DICE] 手动弹窗操作失败:', err);
        if (window.toastr) showActionableErrorToast('手动更新操作失败，请查看控制台日志。', { developerHint: true });
        $btn.prop('disabled', false).html(escapeHtml(confirmText));
      }
    });

    // 点击遮罩关闭
    $dialog.on('click', e => {
      if (e.target === overlayEl) {
        $dialog.remove();
      }
    });
  };

  // 导入确认弹窗
  const showImportConfirmDialog = (jsonData, analysis, onComplete) => {
    const { $ } = getCore();
    $('.acu-import-confirm-overlay').remove();

    const config = getConfig();

    const hasConflicts = analysis.conflicts.length > 0;
    const conflictListHtml =
      analysis.conflicts.length > 0
        ? `<div style="max-height:80px;overflow-y:auto;background:rgba(0,0,0,0.1);border-radius:4px;padding:6px 8px;margin-top:6px;font-size:11px;color:var(--acu-text-sub);">${analysis.conflicts.map(n => escapeHtml(n)).join(', ')}</div>`
        : '';

    const dialogHtml = `
            <div class="acu-import-confirm-overlay acu-theme-${config.theme}">
                <div class="acu-import-confirm-dialog">
                    <div class="acu-import-confirm-header">
                        <span class="acu-import-confirm-title"><i class="fa-solid fa-file-import"></i> 导入头像配置</span>
                        <button class="acu-import-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-import-confirm-body">
                        <div class="acu-import-stats">
                            <div class="acu-import-stat">
                                <span class="acu-stat-num">${analysis.total}</span>
                                <span class="acu-stat-label">总计</span>
                            </div>
                            <div class="acu-import-stat acu-stat-new">
                                <span class="acu-stat-num">${analysis.newItems.length}</span>
                                <span class="acu-stat-label">新增</span>
                            </div>
                            <div class="acu-import-stat acu-stat-conflict">
                                <span class="acu-stat-num">${analysis.conflicts.length}</span>
                                <span class="acu-stat-label">冲突</span>
                            </div>
                        </div>

                        ${
                          hasConflicts
                            ? `
                            <div class="acu-import-conflict-section">
                                <div class="acu-import-warning">
                                    <i class="fa-solid fa-exclamation-triangle"></i> 以下角色已存在：
                                </div>
                                ${conflictListHtml}
                                <div class="acu-import-conflict-options">
                                    <label class="acu-import-radio">
                                        <input type="radio" name="conflict-mode" value="overwrite" checked />
                                        <span>用导入的覆盖本地</span>
                                    </label>
                                    <label class="acu-import-radio">
                                        <input type="radio" name="conflict-mode" value="skip" />
                                        <span>保留本地的不变</span>
                                    </label>
                                </div>
                            </div>
                        `
                            : `
                            <div class="acu-import-success">
                                <i class="fa-solid fa-check-circle"></i> 无冲突，可直接导入
                            </div>
                        `
                        }
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

    // 强制样式
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
            z-index: 31300 !important;
            display: flex;
            justify-content: center !important;
            align-items: center !important;
            padding: 16px;
            box-sizing: border-box !important;
        `;

    const closeDialog = () => $dialog.remove();

    $dialog.find('.acu-import-cancel-btn').click(closeDialog);
    $dialog.find('.acu-import-close-btn').click(closeDialog);
    setupOverlayClose($dialog, 'acu-import-confirm-overlay', closeDialog);

    $dialog.find('.acu-import-confirm-btn').click(function () {
      const overwrite = $dialog.find('input[name="conflict-mode"]:checked').val() !== 'skip';
      try {
        const stats = AvatarManager.importData(jsonData, overwrite);
        closeDialog();
        onComplete && onComplete();
      } catch (err) {
        console.error('[DICE]ACU 导入失败:', err);
        if (window.toastr)
          showActionableErrorToast('头像配置导入失败：' + (err instanceof Error ? err.message : String(err)), {
            suggestion: '请确认导入内容仍符合头像配置格式；如果确认无误，请打开控制台复制 [DICE]ACU 导入失败日志联系开发者。',
          });
      }
    });
  };
  // [新增] 整体编辑模态框 (已修复自动高度与样式复用)
  const showCardEditModal = (
    row,
    headers,
    tableName,
    rowIndex,
    tableKey,
    options?: { overlayClass?: string; onSaved?: () => void },
  ) => {
    const { $ } = getCore();
    const config = getConfig();
    let rawData = getCachedRawData() || getTableData() || loadSnapshot();

    let displayRow = row;
    // 确保获取的是最新数据
    if (rawData && rawData[tableKey] && rawData[tableKey]?.content?.[rowIndex + 1]) {
      displayRow = rawData[tableKey]?.content?.[rowIndex + 1];
    }

    const inputsHtml = displayRow
      .map((cell, idx) => {
        if (idx === 0) return ''; // 跳过索引列
        const headerName = headers[idx] || `列 ${idx}`;
        const val = cell || '';
        // 自动高度的 textarea
        return `
                <div class="acu-card-edit-field">
                    <label class="acu-card-edit-label">${escapeHtml(headerName)}</label>
                    <textarea class="acu-card-edit-input acu-card-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${escapeHtml(val)}</textarea>
                </div>`;
      })
      .join('');

    const dialog = $(`
            <div class="acu-edit-overlay ${options?.overlayClass || ''}">
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">整体编辑 (#${rowIndex + 1} - ${escapeHtml(tableName)})</div>
                    <div class="acu-settings-content acu-settings-content-scroll">
                        ${inputsHtml}
                    </div>
                     <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-card-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-card-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // --- [修复] 自动高度调节逻辑 ---
    const adjustHeight = el => {
      // 关键修复：使用 auto 而不是 0px，防止布局塌陷并正确获取 shrinking 时的 scrollHeight
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
    // -----------------------------

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-card-cancel').click(closeDialog);

    // 保存逻辑：使用即时保存 + 单行快照更新（保留其他行的AI变更高亮）
    dialog.find('#dlg-card-save').click(async () => {
      let rawData = getCachedRawData() || getTableData() || loadSnapshot();
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
          try {
            // 使用 saveRowInstantly 执行即时保存 + 单行快照更新
            await saveRowInstantly(tableKey, rowIndex, nextRow, {
              tableName,
              headers,
              currentRow,
              sourceData: rawData,
              sheet: rawData?.[tableKey],
            });
            renderInterface();
            options?.onSaved?.();
          } catch (e) {
            console.error('[DICE]ACU 保存失败:', e);
            // 保存失败时不关闭对话框，让用户重试
            return;
          }
        }
      }
      closeDialog();
    });
    // 点击遮罩层关闭
    setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);
    // 点击关闭按钮（双重保险）
    dialog.on('click', function (e) {
      if ($(e.target).closest('#dlg-close-x, #dlg-close, .acu-close-btn').length) {
        closeDialog();
      }
    });
  };

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
  const DICE_CONFIG_BACKUP_SETTINGS_EXPANDED_KEY = 'acu_settings_expanded';
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

  const DICE_CONFIG_BACKUP_MODULES: DiceConfigBackupModuleDefinition[] = [
    {
      id: 'uiLayout',
      name: '界面外观与布局',
      description: '主题、布局、表格顺序、高度、显示与隐藏、倒序与折叠状态。',
      storageKeys: [
        STORAGE_KEY_UI_CONFIG,
        STORAGE_KEY_TABLE_ORDER,
        STORAGE_KEY_ACTION_ORDER,
        STORAGE_KEY_IS_COLLAPSED,
        STORAGE_KEY_OPTIONS_COLLAPSED,
        STORAGE_KEY_TABLE_HEIGHTS,
        STORAGE_KEY_TABLE_STYLES,
        STORAGE_KEY_HIDDEN_TABLES,
        STORAGE_KEY_REVERSE_TABLES,
        STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
        DICE_CONFIG_BACKUP_SETTINGS_EXPANDED_KEY,
      ],
    },
    {
      id: 'diceConfig',
      name: '检定设置',
      description: '是否隐藏，覆盖检定结果、头像与图标联动、疯狂模式的开关。',
      storageKeys: [STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_LAST_PRESET],
    },
    {
      id: 'advancedPresets',
      name: '检定预设',
      description: '自定义检定预设、预设显示顺序与当前激活预设。',
      storageKeys: [
        STORAGE_KEY_ADVANCED_PRESETS,
        STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
        STORAGE_KEY_BUILTIN_PRESET_VISIBILITY,
        STORAGE_KEY_BUILTIN_PRESET_ORDER,
      ],
    },
    {
      id: 'attributePresets',
      name: '属性预设',
      description: '自定义属性生成预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_ACTIVE_ATTR_PRESET],
    },
    {
      id: 'actionGm',
      name: '交互规则预设',
      description: '交互规则预设与当前激活状态；若历史版本保存过 GM 引擎配置也会一并迁移。',
      storageKeys: [STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET, STORAGE_KEY_GM_CONFIG],
    },
    {
      id: 'dashboardPresets',
      name: '仪表盘预设',
      description: '仪表盘预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET],
    },
    {
      id: 'renderPresets',
      name: '渲染预设',
      description: '自定义渲染预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_ACTIVE_RENDER_PRESET],
    },
    {
      id: 'tableTemplate',
      name: '当前数据库表格模板',
      description: '当前聊天生效的数据库表格模板。恢复时会导入到数据库模板列表；如果已有同名模板，会覆盖同名模板。',
      storageKeys: [],
    },
    {
      id: 'tableTemplateRequirementPresets',
      name: '模板检验预设',
      description: '自定义模板检验预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET],
    },
    {
      id: 'validation',
      name: '数据验证',
      description: '数据验证预设、当前激活状态、启用状态与验证模式。',
      storageKeys: [
        STORAGE_KEY_PRESETS,
        STORAGE_KEY_ACTIVE_PRESET,
        STORAGE_KEY_VALIDATION_ENABLED,
        STORAGE_KEY_VALIDATION_MODE,
        STORAGE_KEY_VALIDATION_RULES,
      ],
      ...DATA_VALIDATION_DEPRECATED_META,
    },
    {
      id: 'regex',
      name: '表格正则预设',
      description: '表格正则预设、当前激活状态、规则列表与启用状态。',
      storageKeys: [
        STORAGE_KEY_REGEX_PRESETS,
        STORAGE_KEY_REGEX_RULES,
        STORAGE_KEY_REGEX_ACTIVE_PRESET,
        STORAGE_KEY_REGEX_ENABLED,
      ],
    },
    {
      id: 'avatarMap',
      name: '角色头像预设',
      description: '角色头像 URL、裁剪偏移、缩放与别名映射。不包括本地上传的图片',
      storageKeys: [STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_MAP_FOCUS],
    },
    {
      id: 'customIcons',
      name: '图标预设',
      description: '表名、物品、装备、势力等图标预设的配置元数据。',
      storageKeys: [STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS],
    },
    {
      id: 'gachaSettings',
      name: '骰子商城配置与自定义物品',
      description: '商城卡池、条目设置、全局自定义物品目录、当前池与碎片商店稀有度。',
      storageKeys: [
        STORAGE_KEY_GACHA_POOL_SETTINGS,
        STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
        STORAGE_KEY_GACHA_ITEM_SETTINGS,
        STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
        STORAGE_KEY_GACHA_SHARD_SHOP_RARITY,
      ],
    },
  ];

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

  const DICE_CONFIG_BACKUP_KEY_STRATEGIES: Record<string, DiceConfigBackupKeyStrategy> = {
    [STORAGE_KEY_UI_CONFIG]: 'object',
    [STORAGE_KEY_TABLE_ORDER]: 'setArray',
    [STORAGE_KEY_ACTION_ORDER]: 'setArray',
    [STORAGE_KEY_IS_COLLAPSED]: 'raw',
    [STORAGE_KEY_OPTIONS_COLLAPSED]: 'raw',
    [STORAGE_KEY_TABLE_HEIGHTS]: 'map',
    [STORAGE_KEY_TABLE_STYLES]: 'map',
    [STORAGE_KEY_HIDDEN_TABLES]: 'setArray',
    [STORAGE_KEY_REVERSE_TABLES]: 'setArray',
    [STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS]: 'map',
    [DICE_CONFIG_BACKUP_SETTINGS_EXPANDED_KEY]: 'raw',
    [STORAGE_KEY_DICE_CONFIG]: 'object',
    [STORAGE_KEY_CRAZY_MODE]: 'object',
    [STORAGE_KEY_LAST_PRESET]: 'rawString',
    [STORAGE_KEY_ADVANCED_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_ADVANCED_PRESET]: 'raw',
    [STORAGE_KEY_BUILTIN_PRESET_VISIBILITY]: 'map',
    [STORAGE_KEY_BUILTIN_PRESET_ORDER]: 'map',
    [STORAGE_KEY_ATTRIBUTE_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_ATTR_PRESET]: 'raw',
    [STORAGE_KEY_ACTION_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_ACTION_PRESET]: 'raw',
    [STORAGE_KEY_GM_CONFIG]: 'object',
    [STORAGE_KEY_DASHBOARD_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_DASHBOARD_PRESET]: 'raw',
    [STORAGE_KEY_RENDER_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_RENDER_PRESET]: 'raw',
    [STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET]: 'raw',
    [STORAGE_KEY_PRESETS]: 'presetArray',
    [STORAGE_KEY_ACTIVE_PRESET]: 'raw',
    [STORAGE_KEY_VALIDATION_ENABLED]: 'map',
    [STORAGE_KEY_VALIDATION_MODE]: 'raw',
    [STORAGE_KEY_VALIDATION_RULES]: 'presetArray',
    [STORAGE_KEY_REGEX_PRESETS]: 'presetArray',
    [STORAGE_KEY_REGEX_RULES]: 'presetArray',
    [STORAGE_KEY_REGEX_ACTIVE_PRESET]: 'raw',
    [STORAGE_KEY_REGEX_ENABLED]: 'map',
    [STORAGE_KEY_AVATAR_MAP]: 'map',
    [STORAGE_KEY_MAP_FOCUS]: 'raw',
    [STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS]: 'map',
    [STORAGE_KEY_GACHA_POOL_SETTINGS]: 'gachaPoolSettings',
    [STORAGE_KEY_GACHA_SETTINGS_POOL_TAG]: 'raw',
    [STORAGE_KEY_GACHA_ITEM_SETTINGS]: 'gachaItemSettings',
    [STORAGE_KEY_GACHA_ACTIVE_POOL_TAG]: 'raw',
    [STORAGE_KEY_GACHA_SHARD_SHOP_RARITY]: 'raw',
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

  const getDiceConfigBackupModuleResourceShapeWarnings = (
    moduleId: DiceConfigBackupModuleId,
    resources?: Record<string, unknown>,
  ): string[] => {
    if (!resources) return [];
    const warnings: string[] = [];
    const pushUnknownResourceWarnings = (knownKeys: ReadonlySet<string>) => {
      const unknownKeys = Object.keys(resources).filter(key => !knownKeys.has(key));
      if (unknownKeys.length > 0) {
        warnings.push(`模块包含当前版本无法恢复的扩展资源：${unknownKeys.join('、')}。`);
      }
    };
    if (moduleId === 'tableTemplate') {
      if (
        DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY in resources &&
        !isDiceConfigBackupRecord(resources[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY])
      ) {
        warnings.push('当前数据库表格模板: 模板资源结构无效，无法恢复该模板。');
      }
      pushUnknownResourceWarnings(new Set([DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY]));
      return warnings;
    }
    if (moduleId === 'gachaSettings') {
      if (DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY in resources) {
        const value = resources[DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY];
        if (!Array.isArray(value)) {
          warnings.push('骰子商城配置与自定义物品: 自定义目录资源不是数组，无法恢复该目录。');
        } else {
          const resourceWarnings: string[] = [];
          const runtimeRawData = getRuntimeGachaRawData();
          const validCount = value.filter(record =>
            normalizeDiceConfigBackupGachaCatalogResourceRecord(record, resourceWarnings, runtimeRawData),
          ).length;
          if (resourceWarnings.length > 0) {
            const maybeDeferredByTemplateRestore = Boolean(isDiceConfigBackupRecord(resources) && runtimeRawData);
            warnings.push(
              ...Array.from(new Set(resourceWarnings)).map(warning =>
                maybeDeferredByTemplateRestore
                  ? `${warning} 若本次同时恢复“当前数据库表格模板”，最终会在模板导入后重新校验。`
                  : warning,
              ),
            );
          }
          if (value.length > 0 && validCount === 0) {
            warnings.push(
              '骰子商城配置与自定义物品: 自定义目录资源在当前模板下没有有效物品；若本次同时恢复“当前数据库表格模板”，最终会在模板导入后重新校验。',
            );
          }
        }
      }
      pushUnknownResourceWarnings(new Set([DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY]));
      return warnings;
    }
    pushUnknownResourceWarnings(new Set());
    return warnings;
  };

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

  const buildDiceConfigBackup = async (
    selectedModuleIds: readonly DiceConfigBackupModuleId[],
  ): Promise<DiceConfigBackupDocument> => {
    const selectedIds = normalizeDiceConfigBackupSelectedModuleIds(selectedModuleIds);
    if (selectedIds.length === 0) {
      throw new Error('请至少选择一个要备份的模块');
    }

    const modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>> = {};
    for (const moduleId of selectedIds) {
      const definition = getDiceConfigBackupModuleDefinition(moduleId);
      if (!definition) continue;
      const storage: Record<string, unknown> = {};
      definition.storageKeys.forEach(key => {
        const value = sanitizeDiceConfigBackupStoredValue(key, getDiceConfigBackupStoredValue(key));
        if (value !== undefined) storage[key] = cloneDiceConfigBackupValue(value);
      });
      const resources: Record<string, unknown> = {};
      if (moduleId === 'gachaSettings') {
        const records = await collectDiceConfigBackupGachaCatalogRecords();
        if (records.length > 0) {
          resources[DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY] = records;
        }
      }
      const extraWarnings: string[] = [];
      if (moduleId === 'tableTemplate') {
        const templateResult = collectDiceConfigBackupTableTemplate();
        if (templateResult.template !== undefined) {
          resources[DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY] = templateResult.template;
        }
        extraWarnings.push(...templateResult.warnings);
      }
      const warnings = [...getDiceConfigBackupModuleWarnings(moduleId, storage, resources), ...extraWarnings];
      if (Object.keys(storage).length === 0 && Object.keys(resources).length === 0 && warnings.length === 0) continue;
      modules[moduleId] = {
        storage,
        ...(Object.keys(resources).length > 0 ? { resources: cloneDiceConfigBackupValue(resources) } : {}),
        ...(warnings.length > 0 ? { warnings } : {}),
      };
    }

    return {
      format: DICE_CONFIG_BACKUP_FORMAT,
      schemaVersion: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      scriptVersion: SCRIPT_VERSION,
      presetFormatVersion: PRESET_FORMAT_VERSION,
      modules,
    };
  };

  const parseDiceConfigBackup = (text: string): DiceConfigBackupParseResult => {
    const parsed = parseJsoncDocument({
      text,
      emptyMessage: '备份文件内容为空',
      invalidJsonMessage: '备份文件不是有效的 JSON/JSONC',
      validate: value => {
        if (!isDiceConfigBackupRecord(value)) throw new Error('备份文件结构无效');
        return value;
      },
    });
    if (parsed.format !== DICE_CONFIG_BACKUP_FORMAT) throw new Error('备份格式不匹配，无法作为骰子系统配置备份导入');
    if (parsed.schemaVersion !== DICE_CONFIG_BACKUP_SCHEMA_VERSION) {
      throw new Error(`仅支持 schemaVersion ${DICE_CONFIG_BACKUP_SCHEMA_VERSION} 的备份文件`);
    }
    if (!isDiceConfigBackupRecord(parsed.modules)) throw new Error('备份文件缺少 modules 配置');

    const warnings: string[] = [];
    const modules: Partial<Record<DiceConfigBackupModuleId, DiceConfigBackupModulePayload>> = {};

    Object.entries(parsed.modules).forEach(([rawModuleId, rawPayload]) => {
      if (!isDiceConfigBackupModuleId(rawModuleId)) {
        warnings.push(`备份文件包含未知模块 "${rawModuleId}"，已跳过。`);
        return;
      }
      if (!isDiceConfigBackupRecord(rawPayload)) {
        warnings.push(`模块 "${rawModuleId}" 的结构无效，已跳过。`);
        return;
      }
      const storageValue = rawPayload.storage;
      const moduleStorage = isDiceConfigBackupRecord(storageValue)
        ? cloneDiceConfigBackupValue(storageValue)
        : {};
      if (storageValue !== undefined && !isDiceConfigBackupRecord(storageValue)) {
        warnings.push(`模块 "${rawModuleId}" 的 storage 结构无效，已按空对象处理。`);
      }
      const warningsValue = rawPayload.warnings;
      const moduleWarnings = Array.isArray(warningsValue)
        ? warningsValue.map(item => String(item || '').trim()).filter(Boolean)
        : [];
      const resourcesValue = rawPayload.resources;
      const moduleResources = isDiceConfigBackupRecord(resourcesValue)
        ? cloneDiceConfigBackupValue(resourcesValue)
        : undefined;
      if (resourcesValue !== undefined && !moduleResources) {
        warnings.push(`模块 "${rawModuleId}" 的扩展资源结构无效，已忽略。`);
      }
      const resourceShapeWarnings = getDiceConfigBackupModuleResourceShapeWarnings(rawModuleId, moduleResources);
      modules[rawModuleId] = {
        storage: moduleStorage,
        ...(moduleResources ? { resources: moduleResources } : {}),
        ...(moduleWarnings.length > 0 || resourceShapeWarnings.length > 0
          ? { warnings: [...moduleWarnings, ...resourceShapeWarnings] }
          : {}),
      };
    });

    return {
      backup: {
        format: DICE_CONFIG_BACKUP_FORMAT,
        schemaVersion: DICE_CONFIG_BACKUP_SCHEMA_VERSION,
        exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
        scriptVersion: typeof parsed.scriptVersion === 'string' ? parsed.scriptVersion : '',
        presetFormatVersion: typeof parsed.presetFormatVersion === 'string' ? parsed.presetFormatVersion : '',
        modules,
      },
      warnings,
    };
  };

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

  const mergeDiceConfigBackupPresetArray = (
    current: unknown,
    incoming: unknown,
    moduleName: string,
    key: string,
  ): DiceConfigBackupPresetMergeResult => {
    const builtinPresetIds = new Set(getDiceConfigBackupBuiltinPresetIds(key));
    const result: DiceConfigBackupPresetMergeResult = {
      value: Array.isArray(current)
        ? cloneDiceConfigBackupValue(current).filter(item => {
            if (!isDiceConfigBackupRecord(item)) return true;
            const id = getDiceConfigBackupPresetRecordId(item);
            return !id || !builtinPresetIds.has(id);
          })
        : [],
      idMap: new Map<string, string>(),
      added: 0,
      overwritten: 0,
      skipped: 0,
      warnings: [],
    };
    if (!Array.isArray(incoming)) {
      result.skipped += 1;
      result.warnings.push(`${moduleName}: ${key} 不是预设数组，已跳过。`);
      return result;
    }

    const indexById = new Map<string, number>();
    const indexByName = new Map<string, number>();
    result.value.forEach((item, index) => {
      if (!isDiceConfigBackupRecord(item)) return;
      const id = getDiceConfigBackupPresetRecordId(item);
      const name = getDiceConfigBackupPresetRecordName(item);
      if (id) indexById.set(id, index);
      if (name && !indexByName.has(name)) indexByName.set(name, index);
    });

    incoming.forEach(item => {
      if (!isDiceConfigBackupRecord(item)) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: ${key} 中存在非对象预设，已跳过。`);
        return;
      }
      const imported = cloneDiceConfigBackupValue(item);
      const sourceId = getDiceConfigBackupPresetRecordId(imported);
      const sourceName = getDiceConfigBackupPresetRecordName(imported);
      if (!sourceId) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 存在缺少 id 的预设 "${sourceName || '未命名'}"，已跳过。`);
        return;
      }
      if (builtinPresetIds.has(sourceId) || imported.builtin === true) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 内置预设 "${sourceName || sourceId}" 以当前脚本版本为准，已跳过备份中的同名记录。`);
        return;
      }

      if (indexById.has(sourceId)) {
        const targetIndex = indexById.get(sourceId)!;
        const currentRecord = isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        result.value[targetIndex] = { ...currentRecord, ...imported, id: sourceId };
        result.idMap.set(sourceId, sourceId);
        result.overwritten += 1;
        if (sourceName) indexByName.set(sourceName, targetIndex);
        return;
      }

      if (sourceName && indexByName.has(sourceName)) {
        const targetIndex = indexByName.get(sourceName)!;
        const currentRecord = isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        const targetId = getDiceConfigBackupPresetRecordId(currentRecord) || sourceId;
        result.value[targetIndex] = { ...currentRecord, ...imported, id: targetId };
        result.idMap.set(sourceId, targetId);
        result.overwritten += 1;
        indexById.set(targetId, targetIndex);
        return;
      }

      result.value.push(imported);
      const targetIndex = result.value.length - 1;
      indexById.set(sourceId, targetIndex);
      if (sourceName) indexByName.set(sourceName, targetIndex);
      result.idMap.set(sourceId, sourceId);
      result.added += 1;
    });

    return result;
  };

  const mergeDiceConfigBackupCustomOnlyPresetArray = (
    current: unknown,
    incoming: unknown,
    moduleName: string,
    key: string,
  ): DiceConfigBackupPresetMergeResult => {
    const result: DiceConfigBackupPresetMergeResult = {
      value: [],
      idMap: new Map<string, string>(),
      added: 0,
      overwritten: 0,
      skipped: 0,
      warnings: [],
    };
    const builtinPresetIds = new Set(getDiceConfigBackupBuiltinPresetIds(key));
    const indexById = new Map<string, number>();
    const currentIndexByName = new Map<string, number>();
    const consumedCurrentNameIndexes = new Set<number>();
    const normalizeCustomPreset = (item: unknown, fallbackId: string): Record<string, unknown> | null => {
      let normalized: unknown = null;
      if (key === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS) {
        normalized = normalizeTableTemplateRequirementPreset(item, fallbackId);
      } else if (isDiceConfigBackupRecord(item)) {
        normalized = cloneDiceConfigBackupValue(item);
      }
      if (!normalized || !isDiceConfigBackupRecord(normalized)) return null;
      const id = getDiceConfigBackupPresetRecordId(normalized);
      if (!id || builtinPresetIds.has(id)) return null;
      return { ...cloneDiceConfigBackupValue(normalized), id, builtin: false };
    };
    const keepCurrentPresets = (items: readonly unknown[]): void => {
      const currentById = new Map<string, Record<string, unknown>>();
      items.forEach(item => {
        const sourceId = isDiceConfigBackupRecord(item) ? getDiceConfigBackupPresetRecordId(item) : '';
        const preset = normalizeCustomPreset(item, sourceId);
        if (!preset) return;
        const id = getDiceConfigBackupPresetRecordId(preset);
        currentById.set(id, preset);
      });
      currentById.forEach(preset => {
        const id = getDiceConfigBackupPresetRecordId(preset);
        const targetIndex = result.value.length;
        result.value.push(preset);
        indexById.set(id, targetIndex);
        const name = getDiceConfigBackupPresetRecordName(preset);
        if (name && !currentIndexByName.has(name)) currentIndexByName.set(name, targetIndex);
      });
    };
    if (Array.isArray(current)) keepCurrentPresets(current);
    const addIncomingPreset = (preset: Record<string, unknown>, sourceId: string): void => {
      const nextPreset = { ...preset, id: sourceId, builtin: false };
      result.value.push(nextPreset);
      indexById.set(sourceId, result.value.length - 1);
      result.idMap.set(sourceId, sourceId);
      result.added += 1;
    };

    if (!Array.isArray(incoming)) {
      result.skipped += 1;
      result.warnings.push(`${moduleName}: ${key} 不是预设数组，已跳过。`);
      return result;
    }

    incoming.forEach(item => {
      if (!isDiceConfigBackupRecord(item)) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: ${key} 中存在非对象预设，已跳过。`);
        return;
      }
      const imported = cloneDiceConfigBackupValue(item);
      const sourceId = getDiceConfigBackupPresetRecordId(imported);
      const sourceName = getDiceConfigBackupPresetRecordName(imported);
      if (!sourceId) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 存在缺少 id 的预设 "${sourceName || '未命名'}"，已跳过。`);
        return;
      }
      if (builtinPresetIds.has(sourceId) || imported.builtin === true) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 内置预设 "${sourceName || sourceId}" 以当前脚本版本为准，已跳过备份中的同名记录。`);
        return;
      }
      const normalized = normalizeCustomPreset(imported, sourceId);
      if (!normalized) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 预设 "${sourceName || sourceId}" 结构无效，已跳过。`);
        return;
      }

      if (indexById.has(sourceId)) {
        const targetIndex = indexById.get(sourceId)!;
        const currentRecord = isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        result.value[targetIndex] = { ...currentRecord, ...normalized, id: sourceId, builtin: false };
        result.idMap.set(sourceId, sourceId);
        result.overwritten += 1;
        consumedCurrentNameIndexes.add(targetIndex);
        return;
      }

      if (sourceName && currentIndexByName.has(sourceName)) {
        const targetIndex = currentIndexByName.get(sourceName)!;
        if (consumedCurrentNameIndexes.has(targetIndex)) {
          addIncomingPreset(normalized, sourceId);
          return;
        }
        const currentRecord = isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        const targetId = getDiceConfigBackupPresetRecordId(currentRecord) || sourceId;
        result.value[targetIndex] = { ...currentRecord, ...normalized, id: targetId, builtin: false };
        result.idMap.set(sourceId, targetId);
        result.overwritten += 1;
        consumedCurrentNameIndexes.add(targetIndex);
        indexById.set(targetId, targetIndex);
        return;
      }

      addIncomingPreset(normalized, sourceId);
    });

    return result;
  };

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

  const mergeDiceConfigBackupPresetArraySafely = (
    current: unknown,
    incoming: unknown,
    moduleName: string,
    key: string,
  ): DiceConfigBackupPresetMergeResult => {
    const result: DiceConfigBackupPresetMergeResult = {
      value: getDiceConfigBackupSafeCurrentPresets(key, current),
      idMap: new Map<string, string>(),
      added: 0,
      overwritten: 0,
      skipped: 0,
      warnings: [],
    };
    if (!Array.isArray(incoming)) {
      result.skipped += 1;
      result.warnings.push(`${moduleName}: ${key} 不是预设数组，已跳过。`);
      return result;
    }

    const mergeRules =
      key === STORAGE_KEY_PRESETS ? mergeDiceConfigBackupValidationRules : mergeDiceConfigBackupRegexRules;
    const builtinPresetIds = new Set(getDiceConfigBackupBuiltinPresetIds(key));
    const indexById = new Map<string, number>();
    const customIndexByName = new Map<string, number>();
    result.value.forEach((item, index) => {
      if (!isDiceConfigBackupRecord(item)) return;
      const id = getDiceConfigBackupPresetRecordId(item);
      const name = getDiceConfigBackupPresetRecordName(item);
      if (id) indexById.set(id, index);
      if (name && !builtinPresetIds.has(id) && item.builtin !== true && !customIndexByName.has(name)) {
        customIndexByName.set(name, index);
      }
    });

    incoming.forEach(item => {
      if (!isDiceConfigBackupRecord(item)) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: ${key} 中存在非对象预设，已跳过。`);
        return;
      }
      const imported = cloneDiceConfigBackupValue(item);
      const sourceId = getDiceConfigBackupPresetRecordId(imported);
      const sourceName = getDiceConfigBackupPresetRecordName(imported);
      if (!sourceId) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 存在缺少 id 的预设 "${sourceName || '未命名'}"，已跳过。`);
        return;
      }

      const sourceIsBuiltin = builtinPresetIds.has(sourceId) || imported.builtin === true;
      const targetIndex = indexById.get(sourceId) ?? (sourceIsBuiltin ? undefined : customIndexByName.get(sourceName));
      if (targetIndex !== undefined) {
        const currentRecord = isDiceConfigBackupRecord(result.value[targetIndex]) ? result.value[targetIndex] : {};
        const targetId = getDiceConfigBackupPresetRecordId(currentRecord) || sourceId;
        const targetIsBuiltin = builtinPresetIds.has(targetId) || currentRecord.builtin === true;
        const mergedRules = mergeRules(currentRecord.rules, imported.rules);
        result.value[targetIndex] = targetIsBuiltin
          ? {
              ...currentRecord,
              id: targetId,
              builtin: true,
              version: PRESET_FORMAT_VERSION,
              rules: mergedRules,
            }
          : {
              ...currentRecord,
              ...imported,
              id: targetId,
              builtin: false,
              version: PRESET_FORMAT_VERSION,
              rules: mergedRules,
            };
        result.idMap.set(sourceId, targetId);
        result.overwritten += 1;
        return;
      }

      if (sourceIsBuiltin) {
        result.skipped += 1;
        result.warnings.push(`${moduleName}: 内置预设 "${sourceName || sourceId}" 在当前版本中不存在，已跳过。`);
        return;
      }

      const nextPreset = {
        ...imported,
        builtin: false,
        version: PRESET_FORMAT_VERSION,
        rules: mergeRules([], imported.rules),
      };
      result.value.push(nextPreset);
      const nextIndex = result.value.length - 1;
      indexById.set(sourceId, nextIndex);
      if (sourceName) customIndexByName.set(sourceName, nextIndex);
      result.idMap.set(sourceId, sourceId);
      result.added += 1;
    });

    return result;
  };

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

  const applyDiceConfigBackupValue = (
    key: string,
    value: unknown,
    moduleName: string,
    stats: DiceConfigBackupApplyStats,
    idMappings: Map<string, Map<string, string>>,
  ): void => {
    const strategy = getDiceConfigBackupKeyStrategy(key);
    const currentExists = localStorage.getItem(key) !== null;
    const current = strategy === 'rawString' ? localStorage.getItem(key) : Store.get(key, undefined);

    if (strategy === 'gachaPoolSettings' || strategy === 'gachaItemSettings') {
      const merged =
        strategy === 'gachaPoolSettings'
          ? mergeDiceConfigBackupGachaPoolSettings(current, value)
          : mergeDiceConfigBackupGachaItemSettings(current, value);
      if (!merged) {
        stats.skipped += 1;
        stats.warnings.push(`${moduleName}: ${key} 不是有效的商城配置，已跳过。`);
        return;
      }
      if (isDiceConfigBackupSameValue(current, merged)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        setDiceConfigBackupValue(key, merged);
      }
      return;
    }

    if (strategy === 'object' || strategy === 'map') {
      if (!isDiceConfigBackupRecord(value)) {
        stats.skipped += 1;
        stats.warnings.push(`${moduleName}: ${key} 不是对象配置，已跳过。`);
        return;
      }
      const currentRecord = isDiceConfigBackupRecord(current) ? current : {};
      const merged = { ...currentRecord, ...value };
      if (isDiceConfigBackupSameValue(current, merged)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        setDiceConfigBackupValue(key, merged);
      }
      return;
    }

    if (strategy === 'setArray') {
      const merged = mergeDiceConfigBackupSetArray(current, value);
      if (!merged) {
        stats.skipped += 1;
        stats.warnings.push(`${moduleName}: ${key} 不是数组配置，已跳过。`);
        return;
      }
      if (isDiceConfigBackupSameValue(current, merged)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        setDiceConfigBackupValue(key, merged);
      }
      return;
    }

    if (key === STORAGE_KEY_VALIDATION_RULES) {
      const currentRules = getDiceConfigBackupRuleRecords(current, sanitizeDiceConfigBackupValidationRule);
      const incomingRules = getDiceConfigBackupRuleRecords(value, sanitizeDiceConfigBackupValidationRule);
      const builtinKeys = new Set(
        BUILTIN_VALIDATION_RULES.map(rule =>
          getDiceConfigBackupValidationRuleKey(rule as Record<string, unknown>),
        ).filter(Boolean),
      );
      const mergedRules = mergeDiceConfigBackupCustomRules(
        currentRules,
        incomingRules,
        builtinKeys,
        getDiceConfigBackupValidationRuleKey,
      );
      if (isDiceConfigBackupSameValue(current, mergedRules)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        setDiceConfigBackupValue(key, mergedRules);
      }
      return;
    }

    if (key === STORAGE_KEY_REGEX_RULES) {
      const mergedRules = mergeDiceConfigBackupRegexRules(current, value);
      if (isDiceConfigBackupSameValue(current, mergedRules)) {
        stats.skipped += 1;
      } else {
        if (currentExists) {
          stats.overwritten += 1;
        } else {
          stats.added += 1;
        }
        setDiceConfigBackupValue(key, mergedRules);
      }
      return;
    }

    if (strategy === 'presetArray') {
      const merged =
        key === STORAGE_KEY_PRESETS || key === STORAGE_KEY_REGEX_PRESETS
          ? mergeDiceConfigBackupPresetArraySafely(current, value, moduleName, key)
          : key === STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS
            ? mergeDiceConfigBackupCustomOnlyPresetArray(current, value, moduleName, key)
          : mergeDiceConfigBackupPresetArray(current, sanitizeDiceConfigBackupStoredValue(key, value), moduleName, key);
      idMappings.set(key, merged.idMap);
      stats.added += merged.added;
      stats.overwritten += merged.overwritten;
      stats.skipped += merged.skipped;
      stats.warnings.push(...merged.warnings);
      if (!isDiceConfigBackupSameValue(current, merged.value)) setDiceConfigBackupValue(key, merged.value);
      return;
    }

    if (isDiceConfigBackupSameValue(current, value)) {
      stats.skipped += 1;
    } else {
      if (currentExists) {
        stats.overwritten += 1;
      } else {
        stats.added += 1;
      }
      setDiceConfigBackupValue(key, cloneDiceConfigBackupValue(value));
    }
  };

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

  const normalizeDiceConfigBackupGachaCatalogItems = (
    rawItems: unknown,
    warnings: string[],
    scopeKey: string,
    rawData?: unknown,
  ): GachaItemDefinition[] => {
    if (!Array.isArray(rawItems)) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 的自定义物品不是数组，已跳过。`);
      return [];
    }
    const errors: string[] = [];
    const items = rawItems
      .map((item, index) => normalizeImportedGachaItem(item, index, errors, {}))
      .filter((item): item is NormalizedGachaCatalogItem => Boolean(item))
      .map(item => {
        const normalized: GachaItemDefinition = {
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
          updatedAt: item.updatedAt,
          weight: item.weight,
          stackable: item.stackable,
          unique: item.unique,
          grantQuantity: item.grantQuantity,
          rewardTarget: item.rewardTarget,
        };
        if (item.targetTable) normalized.targetTable = item.targetTable;
        if (item.targetColumns) normalized.targetColumns = item.targetColumns;
        if (item.customFields) normalized.customFields = item.customFields;
        return normalized;
      })
      .filter(item => (rawData === undefined ? true : validateGachaCatalogImportItemTarget(rawData, item, warnings)));
    if (errors.length > 0) {
      warnings.push(`骰子商城配置与自定义物品: ${scopeKey} 有 ${errors.length} 条自定义物品无效，已跳过。`);
    }
    return items;
  };

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

  const mergeDiceConfigBackupGachaCatalogItems = (
    currentItems: readonly GachaItemDefinition[],
    incomingItems: readonly GachaItemDefinition[],
    stats: DiceConfigBackupApplyStats,
    itemIdMap?: Map<string, string>,
  ): GachaItemDefinition[] => {
    const result = cloneGachaCatalogItems(currentItems);
    const indexById = new Map<string, number>();
    const indexByName = new Map<string, number>();
    result.forEach((item, index) => {
      const id = String(item.id || '').trim();
      const nameKey = getDiceConfigBackupGachaItemNameKey(item);
      if (id) indexById.set(id, index);
      if (nameKey && !indexByName.has(nameKey)) indexByName.set(nameKey, index);
    });

    incomingItems.forEach(item => {
      const imported = cloneDiceConfigBackupValue(item);
      const id = String(imported.id || '').trim();
      const nameKey = getDiceConfigBackupGachaItemNameKey(imported);
      const idIndex = id ? indexById.get(id) : undefined;
      const targetIndex = idIndex ?? (nameKey ? indexByName.get(nameKey) : undefined);
      if (targetIndex !== undefined) {
        const existing = result[targetIndex];
        const targetId = existing.id || id;
        result[targetIndex] = {
          ...existing,
          ...imported,
          id: targetId,
          createdAt: existing.createdAt || imported.createdAt,
          updatedAt: imported.updatedAt || Date.now(),
        };
        if (id && targetId && id !== targetId) itemIdMap?.set(id, targetId);
        stats.overwritten += 1;
        return;
      }
      result.push({
        ...imported,
        id,
        createdAt: imported.createdAt || Date.now(),
        updatedAt: imported.updatedAt || Date.now(),
      });
      const nextIndex = result.length - 1;
      if (id) indexById.set(id, nextIndex);
      if (nameKey) indexByName.set(nameKey, nextIndex);
      stats.added += 1;
    });

    return result;
  };

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

  const restoreDiceConfigBackupGachaCatalogRecords = async (
    recordsValue: unknown,
    stats: DiceConfigBackupApplyStats,
    itemIdMap?: Map<string, string>,
    rawData = getRuntimeGachaRawData(),
  ): Promise<void> => {
    if (recordsValue === undefined) return;
    if (!Array.isArray(recordsValue)) {
      stats.skipped += 1;
      stats.warnings.push('骰子商城配置与自定义物品: 自定义目录资源不是数组，已跳过。');
      return;
    }
    await migrateGachaCatalogRecordsToGlobalScope();
    const incomingRecords: GachaCatalogRecord[] = [];
    for (const rawRecord of recordsValue) {
      const incomingRecord = normalizeDiceConfigBackupGachaCatalogResourceRecord(
        rawRecord,
        stats.warnings,
        rawData,
      );
      if (!incomingRecord) {
        stats.skipped += 1;
        continue;
      }
      incomingRecords.push(incomingRecord);
    }
    const incomingGlobalRecord = mergeGachaCatalogRecordsToGlobalScope(incomingRecords);
    if (!incomingGlobalRecord) return;

    const currentRecord = await GachaCatalogDB.get(GACHA_CATALOG_GLOBAL_SCOPE_KEY);
    const currentCatalog = normalizeGachaCatalogRecord(currentRecord) || createEmptyGachaCatalog();
    const beforeTouched = stats.added + stats.overwritten + stats.skipped;
    const mergedItems = mergeDiceConfigBackupGachaCatalogItems(
      currentCatalog.items,
      incomingGlobalRecord.items,
      stats,
      itemIdMap,
    );
    if (stats.added + stats.overwritten + stats.skipped === beforeTouched) {
      stats.skipped += 1;
    }
    const nextRecord: GachaCatalogRecord = {
      scopeKey: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
      version: Math.max(currentCatalog.version || 1, incomingGlobalRecord.version || 1, GACHA_CATALOG_VERSION),
      items: mergedItems,
      updatedAt: Date.now(),
    };
    const saved = await GachaCatalogDB.put(nextRecord);
    if (!saved) throw new Error('全局自定义物品目录保存失败');
    setGachaCatalogCache({
      scopeKey: GACHA_CATALOG_GLOBAL_SCOPE_KEY,
      catalog: {
        version: nextRecord.version,
        items: cloneGachaCatalogItems(nextRecord.items),
        updatedAt: nextRecord.updatedAt,
      },
    });
    ensureGachaPoolsForTags(incomingGlobalRecord.items.flatMap(item => [...item.poolTags]));
  };

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
    setGachaCatalogCache(null);
    setGachaCatalogLoadTask(null);
    return warnings;
  };

  const syncDiceConfigBackupRuntimeAfterRestore = (
    restoredModuleIds: readonly DiceConfigBackupModuleId[],
    options: { closeSettings?: boolean } = {},
  ): void => {
    _configCache = null;
    PresetManager.clearCache();
    ValidationRuleManager.clearCache();
    RegexPresetManager.clearCache();
    RegexTransformationManager.clearCache();
    AttributePresetManager.clearCache();
    AdvancedDicePresetManager.clearCache();
    ActionPresetManager.clearCache();
    DashboardPresetManager.clearCache();
    RenderPresetManager.clearCache();
    TableTemplateRequirementPresetManager.clearCache();
    AvatarManager._cache = null;
    setDashboardRuntimeConfigCache(null);
    if (restoredModuleIds.includes('gachaSettings')) {
      setGachaCatalogCache(null);
      setGachaCatalogLoadTask(null);
      refreshGachaVisualization();
      refreshGachaShardShop();
      const { $ } = getCore();
      if ($('.acu-gacha-settings-overlay').length) void showGachaSettingsDialog();
    }

    if (restoredModuleIds.includes('regex')) {
      const activeRegexPreset = RegexPresetManager.getActivePreset();
      if (activeRegexPreset) {
        if (!Store.set(STORAGE_KEY_REGEX_RULES, cloneDiceConfigBackupValue(activeRegexPreset.rules || []))) {
          throw new Error('正则规则同步保存失败');
        }
        RegexTransformationManager.clearCache();
      }
    }

    const config = getConfig();
    applyConfigStyles(config);
    setDatabaseToastMute(config.muteDatabaseToasts === true);
    refreshDicePanelPresets();

    if (options.closeSettings) {
      const { $ } = getCore();
      $('.acu-edit-overlay')
        .filter((_, element) => $(element).find('.acu-settings-dialog').length > 0)
        .remove();
      setIsSettingsOpen(false);
      renderInterface();
    } else if (!getIsSettingsOpen()) {
      renderInterface();
    }
  };

  const applyDiceConfigBackup = async (
    backup: DiceConfigBackupDocument,
    selectedModuleIds: readonly DiceConfigBackupModuleId[],
  ): Promise<DiceConfigBackupApplyStats> => {
    if (backup.format !== DICE_CONFIG_BACKUP_FORMAT || backup.schemaVersion !== DICE_CONFIG_BACKUP_SCHEMA_VERSION) {
      throw new Error('备份文件版本不兼容');
    }
    const selectedIds = normalizeDiceConfigBackupSelectedModuleIds(selectedModuleIds);
    if (selectedIds.length === 0) throw new Error('请至少选择一个要恢复的模块');

    const stats: DiceConfigBackupApplyStats = {
      added: 0,
      overwritten: 0,
      skipped: 0,
      restoredModules: [],
      warnings: [],
    };
    const idMappings = new Map<string, Map<string, string>>();
    const pendingActiveWrites: DiceConfigBackupPendingActiveWrite[] = [];
    const affectedKeys = new Set<string>();
    const hasGachaCatalogResource =
      selectedIds.includes('gachaSettings') &&
      Array.isArray(backup.modules.gachaSettings?.resources?.[DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY]);
    const incomingGachaItemSettings = normalizeDiceConfigBackupGachaItemSettings(
      selectedIds.includes('gachaSettings')
        ? backup.modules.gachaSettings?.storage?.[STORAGE_KEY_GACHA_ITEM_SETTINGS]
        : undefined,
    );
    const gachaItemSettingSourceIds = new Set(Object.keys(incomingGachaItemSettings?.items || {}));

    selectedIds.forEach(moduleId => {
      const definition = getDiceConfigBackupModuleDefinition(moduleId);
      const payload = backup.modules[moduleId];
      if (!definition || !payload) return;
      Object.keys(payload.storage).forEach(key => {
        if (definition.storageKeys.includes(key)) affectedKeys.add(key);
      });
    });
    if (selectedIds.includes('regex')) affectedKeys.add(STORAGE_KEY_REGEX_RULES);
    if (hasGachaCatalogResource) affectedKeys.add(STORAGE_KEY_GACHA_POOL_SETTINGS);

    const rollbackValues = new Map<string, string | null>();
    affectedKeys.forEach(key => rollbackValues.set(key, localStorage.getItem(key)));
    const gachaCatalogRollbackSnapshot =
      hasGachaCatalogResource
        ? await collectDiceConfigBackupGachaCatalogRollbackSnapshot()
        : null;
    if (gachaCatalogRollbackSnapshot?.warning) throw new Error(gachaCatalogRollbackSnapshot.warning);
    const tableTemplateRollbackSnapshot =
      selectedIds.includes('tableTemplate') && hasDiceConfigBackupTableTemplateResource(backup.modules.tableTemplate)
        ? getDiceConfigBackupTableTemplateRollbackSnapshot()
        : undefined;
    if (tableTemplateRollbackSnapshot?.warning) throw new Error(tableTemplateRollbackSnapshot.warning);
    const deferredTableTemplatePayload =
      selectedIds.includes('tableTemplate') && backup.modules.tableTemplate
        ? backup.modules.tableTemplate
        : null;
    const deferredGachaPayload =
      selectedIds.includes('gachaSettings') && backup.modules.gachaSettings ? backup.modules.gachaSettings : null;
    const gachaItemIdMap = new Map<string, string>();
    let tableTemplateResourceImportAttempted = false;
    let latestRestoreRawData: unknown = getRuntimeGachaRawData();
    const getTouchedCount = () => stats.added + stats.overwritten + stats.skipped;
    const pushRestoredModule = (moduleId: DiceConfigBackupModuleId, touchedBefore: number) => {
      const definition = getDiceConfigBackupModuleDefinition(moduleId);
      if (!definition || getTouchedCount() <= touchedBefore) return;
      if (!stats.restoredModules.includes(definition.name)) stats.restoredModules.push(definition.name);
    };

    try {
      for (const moduleId of selectedIds) {
        const definition = getDiceConfigBackupModuleDefinition(moduleId);
        const payload = backup.modules[moduleId];
        if (!definition || !payload) continue;
        const moduleTouchedBefore = getTouchedCount();
        if (payload.warnings?.length) stats.warnings.push(...payload.warnings);

        Object.entries(payload.storage).forEach(([key, value]) => {
          if (!definition.storageKeys.includes(key)) {
            stats.skipped += 1;
            stats.warnings.push(`${definition.name}: 未知存储项 ${key} 已跳过。`);
            return;
          }
          if (DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY[key]) {
            pendingActiveWrites.push({ key, value, moduleName: definition.name });
            return;
          }
          applyDiceConfigBackupValue(key, value, definition.name, stats, idMappings);
        });
        pushRestoredModule(moduleId, moduleTouchedBefore);
      }

      pendingActiveWrites.forEach(write => applyDiceConfigBackupActiveValue(write, stats, idMappings));
      if (deferredTableTemplatePayload) {
        const moduleTouchedBefore = getTouchedCount();
        const resourceAddedBefore = stats.added;
        await restoreDiceConfigBackupModuleResources('tableTemplate', deferredTableTemplatePayload, stats, {
          onTableTemplateImportAttempt: () => {
            tableTemplateResourceImportAttempted = true;
          },
        });
        const tableTemplateResourceImported = stats.added > resourceAddedBefore;
        pushRestoredModule('tableTemplate', moduleTouchedBefore);
        if (tableTemplateResourceImported) {
          setCachedRawData(null);
          syncDiceConfigBackupRuntimeAfterRestore(selectedIds, { closeSettings: true });
          latestRestoreRawData = getTableData({ silent: true }) || getRuntimeGachaRawData();
        }
      }
      if (deferredGachaPayload) {
        const moduleTouchedBefore = getTouchedCount();
        await restoreDiceConfigBackupModuleResources('gachaSettings', deferredGachaPayload, stats, {
          gachaItemIdMap,
          rawData: latestRestoreRawData,
        });
        remapDiceConfigBackupGachaItemSettings(gachaItemIdMap, gachaItemSettingSourceIds);
        pushRestoredModule('gachaSettings', moduleTouchedBefore);
      }
      syncDiceConfigBackupRuntimeAfterRestore(selectedIds, { closeSettings: true });
      return stats;
    } catch (error) {
      const rollbackWarnings: string[] = [];
      rollbackValues.forEach((value, key) => {
        try {
          if (value === null) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, value);
          }
        } catch (rollbackError) {
          const message = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);
          rollbackWarnings.push(`${key} 回滚失败：${message}`);
        }
      });
      rollbackWarnings.push(
        ...(await restoreDiceConfigBackupGachaCatalogSnapshot(gachaCatalogRollbackSnapshot)),
        ...(tableTemplateResourceImportAttempted
          ? await restoreDiceConfigBackupTableTemplateRollbackSnapshot(tableTemplateRollbackSnapshot)
          : []),
      );
      try {
        syncDiceConfigBackupRuntimeAfterRestore(selectedIds);
      } catch (syncError) {
        const message = syncError instanceof Error ? syncError.message : String(syncError);
        rollbackWarnings.push(`恢复失败后的界面刷新也失败：${message}`);
      }
      if (rollbackWarnings.length > 0) {
        stats.warnings.push(...rollbackWarnings);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message}；回滚提示：${rollbackWarnings.join('；')}`);
      }
      throw error;
    }
  };

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

  const DiceProfileDB = {
    DB_NAME: 'acu_dice_profiles',
    STORE_NAME: 'profiles',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,

    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;
      return await new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
        request.onerror = () => {
          console.error('[DICE][PROFILE]Profile IndexedDB 打开失败:', request.error);
          reject(request.error || new Error('Profile IndexedDB 打开失败'));
        };
        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };
        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
            store.createIndex('sourceType', 'source.type', { unique: false });
            store.createIndex('fingerprint', 'fingerprint', { unique: false });
          }
        };
      });
    },

    async get(id: string): Promise<DiceProfileRecord | null> {
      if (!id) return null;
      const db = await this.init();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const request = tx.objectStore(this.STORE_NAME).get(id);
        request.onsuccess = () => resolve((request.result as DiceProfileRecord | undefined) || null);
        request.onerror = () => reject(request.error || new Error('Profile 读取失败'));
      });
    },

    async getAll(): Promise<DiceProfileRecord[]> {
      const db = await this.init();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const request = tx.objectStore(this.STORE_NAME).getAll();
        request.onsuccess = () => resolve((request.result || []) as DiceProfileRecord[]);
        request.onerror = () => reject(request.error || new Error('Profile 列表读取失败'));
      });
    },

    async put(record: DiceProfileRecord): Promise<boolean> {
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => {
          console.error('[DICE][PROFILE]Profile 写入事务失败:', tx.error);
          resolve(false);
        };
        tx.onabort = () => {
          console.error('[DICE][PROFILE]Profile 写入事务中止:', tx.error);
          resolve(false);
        };
        tx.objectStore(this.STORE_NAME).put(record);
      });
    },

    async delete(id: string): Promise<boolean> {
      if (!id) return false;
      const db = await this.init();
      return await new Promise(resolve => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
        tx.objectStore(this.STORE_NAME).delete(id);
      });
    },
  };

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

  const renderDiceProfileApplyConfirmDetailHtml = (
    moduleIds: readonly DiceConfigBackupModuleId[],
    warnings: readonly string[],
  ): string => {
    const moduleChipsHtml =
      moduleIds.length > 0
        ? moduleIds
            .map(moduleId => {
              const name = getDiceConfigBackupModuleDefinition(moduleId)?.name || moduleId;
              return `<span class="acu-profile-apply-module-chip">${escapeHtml(name)}</span>`;
            })
            .join('')
        : '<span class="acu-profile-apply-empty">没有可应用的模块</span>';
    const warningsHtml =
      warnings.length > 0
        ? `<div class="acu-profile-apply-row acu-profile-apply-warnings">
            <div class="acu-profile-apply-label">
              <i class="fa-solid fa-triangle-exclamation"></i>
              注意
            </div>
            <div class="acu-profile-apply-warning-list">
              ${warnings.map(warning => `<div class="acu-profile-apply-warning">${escapeHtml(warning)}</div>`).join('')}
            </div>
          </div>`
        : '';

    return `
      <div class="acu-profile-apply-confirm">
        <div class="acu-profile-apply-impact-list">
          <div class="acu-profile-apply-impact">
            <i class="fa-solid fa-rotate-left"></i>
            <span><strong>写入前会保存快照</strong>，方便回退。</span>
          </div>
          <div class="acu-profile-apply-impact">
            <i class="fa-solid fa-sliders"></i>
            <span><strong>只改选中模块</strong>，未包含模块保持不变。</span>
          </div>
          <div class="acu-profile-apply-impact">
            <i class="fa-solid fa-code-merge"></i>
            <span><strong>同名项会更新</strong>，同名或同 ID 自定义项按恢复规则合并。</span>
          </div>
        </div>
        <div class="acu-profile-apply-row">
          <div class="acu-profile-apply-label">
            <i class="fa-solid fa-list-check"></i>
            ${moduleIds.length} 个模块
          </div>
          <div class="acu-profile-apply-module-chips">${moduleChipsHtml}</div>
        </div>
        ${warningsHtml}
      </div>
    `;
  };

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

  const getDiceProfileCurrentCharacterRecords = (): Record<string, unknown>[] => {
    const ST = getDiceProfileSillyTavern();
    const records: Record<string, unknown>[] = [];
    const seen = new Set<string>();
    const addRecord = (value: unknown): void => {
      if (!isDiceConfigBackupRecord(value)) return;
      const key =
        getDiceConfigBackupRecordString(value, 'avatar') ||
        getDiceConfigBackupRecordString(value, 'name') ||
        getDiceConfigBackupRecordString((value.data as Record<string, unknown>) || {}, 'name') ||
        JSON.stringify(value).slice(0, 200);
      if (seen.has(key)) return;
      seen.add(key);
      records.push(value);
      const jsonData = getDiceConfigBackupRecordString(value, 'json_data');
      if (jsonData) {
        try {
          addRecord(JSON.parse(jsonData));
        } catch {
          // ignore invalid embedded character json
        }
      }
    };

    try {
      addRecord(ST?.getCharacterCardFields?.({}));
    } catch {
      // ignore
    }

    try {
      if (typeof getCharData === 'function') addRecord(getCharData('current', true));
    } catch {
      // ignore
    }

    try {
      const RawCharacterCtor =
        (globalThis as Record<string, any>).RawCharacter ||
        (window as unknown as Record<string, any>).RawCharacter ||
        (window.parent as unknown as Record<string, any>).RawCharacter;
      if (RawCharacterCtor && typeof RawCharacterCtor.find === 'function') {
        addRecord(RawCharacterCtor.find({ name: 'current', allowAvatar: true }));
      }
    } catch {
      // ignore
    }

    try {
      const characterSources = [
        (globalThis as Record<string, any>).characters,
        (window.parent as unknown as Record<string, any>).characters,
        ST?.characters,
      ];
      const indexCandidates = [
        (globalThis as Record<string, any>).this_chid,
        (window.parent as unknown as Record<string, any>).this_chid,
        ST?.this_chid,
        ST?.characterId,
      ];
      characterSources.forEach(source => {
        if (!Array.isArray(source)) return;
        indexCandidates.forEach(indexValue => {
          const index = Number.parseInt(String(indexValue ?? ''), 10);
          if (!Number.isNaN(index) && index >= 0 && index < source.length) addRecord(source[index]);
        });
      });
    } catch {
      // ignore
    }

    return records;
  };

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

  const renderDiceProfileManagerBody = async (): Promise<string> => {
    let characterDetection: DiceCharacterProfileDetection | null = null;
    try {
      characterDetection = await detectCharacterDiceProfile({ includeSkipped: true });
    } catch (error) {
      console.warn('[DICE][PROFILE]读取当前角色卡配置方案失败:', error);
    }
    const summaries = await refreshDiceProfileIndex();
    const snapshots = summaries.filter(summary => summary.source?.type === 'snapshot');
    const regularProfiles = summaries.filter(
      summary => summary.source?.type !== 'snapshot' && !isDiceProfileCharacterSource(summary.source),
    );
    const characterProfiles = characterDetection ? [toDiceProfileSummary(characterDetection.profile)] : [];
    const collapsedSections = getDiceProfileCollapsedSections();
    const isProfileLibraryCollapsed = collapsedSections.includes('library');
    const isSaveScopeCollapsed = collapsedSections.includes('saveScope');
    const managerStateClasses = [
      isProfileLibraryCollapsed ? 'is-library-collapsed' : '',
      isSaveScopeCollapsed ? 'is-save-scope-collapsed' : '',
    ].filter(Boolean).join(' ');
    return `
      <div class="acu-config-backup-content acu-profile-manager ${managerStateClasses}">
        <section class="acu-profile-collapsible acu-profile-library ${isProfileLibraryCollapsed ? 'collapsed' : ''}" data-profile-section="library">
          <button type="button" class="acu-profile-collapse-header" aria-expanded="${isProfileLibraryCollapsed ? 'false' : 'true'}">
            <div class="acu-profile-collapse-title">
              <i class="fa-solid fa-layer-group"></i><span>方案管理</span>
            </div>
            <div class="acu-profile-collapse-meta">应用前保存快照，保留最近 ${DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT} 个</div>
            <i class="fa-solid fa-chevron-down acu-profile-collapse-chevron"></i>
          </button>
          <div class="acu-profile-collapse-body acu-profile-library-body">
            <div class="acu-profile-tabs" role="tablist" aria-label="配置方案分类">
              <button type="button" class="acu-profile-tab is-active" data-profile-tab="character" role="tab" aria-selected="true"><span>角色卡</span><em>${characterProfiles.length}</em></button>
              <button type="button" class="acu-profile-tab" data-profile-tab="library" role="tab" aria-selected="false"><span>方案库</span><em>${regularProfiles.length}</em></button>
              <button type="button" class="acu-profile-tab" data-profile-tab="snapshots" role="tab" aria-selected="false"><span>快照</span><em>${snapshots.length}</em></button>
            </div>
            <div class="acu-profile-tab-panels">
              ${renderDiceProfileTabPanel('character', characterProfiles, '当前角色卡暂无内置方案', { active: true, current: true })}
              ${renderDiceProfileTabPanel('library', regularProfiles, '暂无方案，可保存或导入')}
              ${renderDiceProfileTabPanel('snapshots', snapshots, '暂无快照，应用时自动创建')}
            </div>
          </div>
        </section>
        <section class="acu-profile-collapsible acu-profile-section acu-profile-module-section ${isSaveScopeCollapsed ? 'collapsed' : ''}" data-profile-section="saveScope">
          <button type="button" class="acu-profile-collapse-header" aria-expanded="${isSaveScopeCollapsed ? 'false' : 'true'}">
            <div class="acu-profile-collapse-title">
              <i class="fa-solid fa-list-check"></i><span>保存范围</span>
            </div>
            <div class="acu-profile-collapse-meta" data-profile-save-scope-meta>勾选要存入方案的设置</div>
            <i class="fa-solid fa-chevron-down acu-profile-collapse-chevron"></i>
          </button>
          <div class="acu-profile-collapse-body acu-profile-save-scope-body">
            <div class="acu-config-backup-selection-actions">
              <button type="button" class="acu-config-backup-select-all acu-setting-action-btn acu-config-backup-mini-btn">全选</button>
              <button type="button" class="acu-config-backup-invert acu-setting-action-btn acu-config-backup-mini-btn">反选</button>
              <button type="button" class="acu-config-backup-clear acu-setting-action-btn acu-config-backup-mini-btn">清空选择</button>
            </div>
            <div class="acu-config-backup-module-list acu-profile-module-list">
              ${renderDiceConfigBackupModuleRows(DICE_CONFIG_BACKUP_MODULES.map(module => module.id))}
            </div>
          </div>
        </section>
      </div>`;
  };

  const showDiceConfigBackupDialog = (): void => {
    const { $ } = getCore();
    const config = getConfig();
    $('.acu-config-backup-overlay').remove();

    const dialog = $(`
      <div class="acu-config-backup-overlay acu-theme-${escapeHtml(config.theme)}">
        <div class="acu-config-backup-dialog">
          <div class="acu-config-backup-header">
            <div class="acu-config-backup-heading">
              <i class="fa-solid fa-arrows-rotate acu-config-backup-title-icon"></i>
              <div class="acu-config-backup-title-copy">
                <div class="acu-config-backup-title">配置方案与备份</div>
                <div class="acu-config-backup-subtitle">保存、应用、导入与导出骰子系统配置。</div>
              </div>
            </div>
            <div class="acu-config-backup-header-actions">
              ${getTutorialButtonHtml('configBackup', '查看备份与还原教程', 'acu-config-backup-tutorial-btn')}
              <button type="button" class="acu-config-backup-close acu-close-btn" title="关闭" aria-label="关闭备份与还原"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-config-backup-body acu-profile-manager-body"><div class="acu-config-backup-empty">正在读取配置方案...</div></div>
          <div class="acu-config-backup-footer">
            <div class="acu-config-backup-footer-actions">
              <button type="button" id="acu-config-backup-pick-file" class="acu-setting-action-btn acu-config-backup-footer-btn" title="导入配置方案或备份"><i class="fa-solid fa-file-import"></i> 导入</button>
              <button type="button" id="acu-profile-save-current" class="acu-setting-action-btn acu-config-backup-footer-btn" title="把当前勾选的设置保存为方案"><i class="fa-solid fa-floppy-disk"></i> 保存方案</button>
              <button type="button" id="acu-config-backup-cancel" class="acu-setting-action-btn acu-config-backup-footer-btn acu-config-backup-primary-btn" title="关闭"><i class="fa-solid fa-xmark"></i> 关闭</button>
            </div>
          </div>
        </div>
      </div>`);

    const closeDialog = () => dialog.remove();
    $('body').append(dialog);
    bindTutorialButtonsIn(dialog);
    setupOverlayClose(dialog, 'acu-config-backup-overlay', closeDialog);

    const refreshBody = async () => {
      dialog.find('.acu-config-backup-body').html('<div class="acu-config-backup-empty">正在读取配置方案...</div>');
      dialog.find('.acu-config-backup-body').html(await renderDiceProfileManagerBody());
      updateDiceProfileSaveScopeMeta();
    };

    const updateDiceProfileSaveScopeMeta = () => {
      const saveScope = dialog.find('.acu-profile-module-section');
      if (saveScope.length === 0) return;
      const checkboxes = saveScope.find<HTMLInputElement>('.acu-config-backup-module-checkbox');
      const selectedCount = checkboxes.filter(':checked').length;
      const totalCount = checkboxes.length;
      const text = totalCount > 0 ? `已选 ${selectedCount}/${totalCount} 个模块` : '勾选要存入方案的设置';
      saveScope.find('[data-profile-save-scope-meta]').text(text);
    };

    void refreshBody();

    dialog.on('click', '.acu-config-backup-close', closeDialog);
    dialog.on('click', '#acu-config-backup-cancel', closeDialog);
    dialog.on('click', '.acu-profile-collapse-header', function () {
      const section = $(this).closest('.acu-profile-collapsible');
      const sectionId = String(section.data('profile-section') || '');
      if (!sectionId) return;
      const nextCollapsed = !section.hasClass('collapsed');
      section.toggleClass('collapsed', nextCollapsed);
      $(this).attr('aria-expanded', nextCollapsed ? 'false' : 'true');
      const collapsedSections = getDiceProfileCollapsedSections();
      saveDiceProfileCollapsedSections(
        nextCollapsed
          ? [...collapsedSections, sectionId]
          : collapsedSections.filter(item => item !== sectionId),
      );
      const manager = section.closest('.acu-profile-manager');
      if (manager.length > 0) {
        const libraryCollapsed = manager.find('.acu-profile-library').hasClass('collapsed');
        const saveScopeCollapsed = manager.find('.acu-profile-module-section').hasClass('collapsed');
        manager.toggleClass('is-library-collapsed', libraryCollapsed);
        manager.toggleClass('is-save-scope-collapsed', saveScopeCollapsed);
      }
    });
    dialog.on('click', '.acu-profile-tab', function () {
      const tab = $(this);
      const target = String(tab.data('profile-tab') || '');
      const library = tab.closest('.acu-profile-library');
      if (!target || library.length === 0) return;
      library.find('.acu-profile-tab').removeClass('is-active').attr('aria-selected', 'false');
      tab.addClass('is-active').attr('aria-selected', 'true');
      library.find('.acu-profile-tab-panel').prop('hidden', true).removeClass('is-active');
      library.find(`.acu-profile-tab-panel[data-profile-panel="${target}"]`).prop('hidden', false).addClass('is-active');
    });
    dialog.on('click', '.acu-config-backup-select-all', function () {
      $(this)
        .closest('.acu-profile-module-section, .acu-config-backup-content')
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox')
        .prop('checked', true);
      updateDiceProfileSaveScopeMeta();
    });
    dialog.on('click', '.acu-config-backup-invert', function () {
      $(this)
        .closest('.acu-profile-module-section, .acu-config-backup-content')
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox')
        .each((_, element) => {
        element.checked = !element.checked;
      });
      updateDiceProfileSaveScopeMeta();
    });
    dialog.on('click', '.acu-config-backup-clear', function () {
      $(this)
        .closest('.acu-profile-module-section, .acu-config-backup-content')
        .find<HTMLInputElement>('.acu-config-backup-module-checkbox')
        .prop('checked', false);
      updateDiceProfileSaveScopeMeta();
    });
    dialog.on('change', '.acu-profile-module-section .acu-config-backup-module-checkbox', updateDiceProfileSaveScopeMeta);
    dialog.on('click', '#acu-config-backup-export', async function () {
      const button = this as HTMLButtonElement;
      try {
        button.disabled = true;
        const selectedIds = getDiceConfigBackupSelectedModuleIdsFromDialog(dialog);
        const backup = await buildDiceConfigBackup(selectedIds);
        const confirmed = await showDiceConfigBackupPrivacyConfirm('export', selectedIds, backup);
        if (!confirmed) return;
        downloadDiceConfigBackupJson(backup);
        const warningCount = getDiceConfigBackupWarningCount(backup);
        if (warningCount > 0) {
          toastr.info(`配置备份已导出；${warningCount} 条备份说明已写入文件。`);
        } else {
          toastr.success('配置备份已导出');
        }
      } catch (error) {
        showActionableErrorToast(error instanceof Error ? error.message : '导出失败', {
          title: '导出失败',
          suggestion: 'importExport',
        });
      } finally {
        button.disabled = false;
      }
    });

    dialog.on('click', '#acu-config-backup-pick-file', () => {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const basename = selected.file.name.replace(/\.(jsonc?|txt)$/i, '');
          const profile = await importDiceProfile(selected.text, {
            name: basename,
            source: { type: 'imported', label: selected.file.name },
          });
          toastr.success(`已导入配置方案：${profile.name}`);
          await refreshBody();
        } catch (error) {
          showActionableErrorToast(error instanceof Error ? error.message : '读取配置方案文件失败', {
            title: '导入失败',
            suggestion: 'importExport',
          });
        }
      })();
    });

    dialog.on('click', '#acu-profile-save-current', async function () {
      const button = this as HTMLButtonElement;
      try {
        const selectedIds = getDiceConfigBackupSelectedModuleIdsFromDialog(dialog).filter(moduleId =>
          getAllDiceConfigBackupModuleIds().includes(moduleId),
        );
        if (selectedIds.length === 0) {
          toastr.warning('请至少选择一个模块');
          return;
        }
        const name = await showDiceSystemInputDialog({
          title: '保存配置方案',
          message: '配置方案名称',
          iconClass: 'fa-floppy-disk',
          initialValue: `我的骰子系统配置方案 ${new Date().toISOString().slice(0, 10)}`,
          confirmText: '保存',
        });
        if (!name) return;
        button.disabled = true;
        const profile = await saveCurrentDiceProfile({ name, moduleIds: selectedIds, source: { type: 'user' } });
        toastr.success(`已保存配置方案：${profile.name}`);
        await refreshBody();
      } catch (error) {
        showActionableErrorToast(error instanceof Error ? error.message : '保存配置方案失败', {
          title: '保存失败',
          suggestion: 'importExport',
        });
      } finally {
        button.disabled = false;
      }
    });

    dialog.on('click', '.acu-profile-action', async function () {
      const button = this as HTMLButtonElement;
      const profileId = String($(button).data('profile-id') || '');
      const action = String($(button).data('profile-action') || '');
      if (!profileId || !action) return;
      try {
        button.disabled = true;
        if (action === 'apply') {
          const stats = await applyDiceProfile(profileId, { createSnapshot: true, confirm: true });
          const warningText = stats.warnings.length > 0 ? `，${stats.warnings.length} 条提示请查看控制台` : '';
          if (stats.warnings.length > 0) console.warn('[DICE][PROFILE]配置方案应用提示:', stats.warnings);
          toastr.success(
            `配置方案应用完成：新增 ${stats.added}，覆盖 ${stats.overwritten}，跳过 ${stats.skipped}${warningText}`,
          );
          await refreshBody();
          return;
        }
        if (action === 'export') {
          const profile = await exportDiceProfile(profileId);
          downloadDiceProfileJson(profile);
          toastr.success('配置方案已导出');
          return;
        }
        if (action === 'tavern-regex') {
          const profile = await exportDiceProfile(profileId);
          downloadDiceProfileTavernRegex(profile);
          toastr.success('已转换为酒馆正则文件');
          return;
        }
        if (action === 'rename') {
          const profile = await exportDiceProfile(profileId);
          if (isDiceProfileCharacterSource(profile.source)) return;
          const name = await showDiceSystemInputDialog({
            title: '重命名配置方案',
            message: '配置方案名称',
            iconClass: 'fa-pen',
            initialValue: profile.name,
            confirmText: '重命名',
          });
          const nextName = String(name || '').trim();
          if (!nextName || nextName === profile.name) return;
          const now = new Date().toISOString();
          await saveDiceProfileRecord({
            ...profile,
            name: nextName,
            savedAt: now,
            updatedAt: now,
          });
          toastr.success(`已重命名为：${nextName}`);
          await refreshBody();
          return;
        }
        if (action === 'delete') {
          const profile = await exportDiceProfile(profileId);
          if (isDiceProfileCharacterSource(profile.source)) return;
          const confirmed = await showDiceSystemConfirmDialog({
            title: '删除配置方案',
            message: `删除「${profile.name}」？`,
            detail: '删除只会移除方案库里的记录，不会撤销已经应用到骰子系统的配置。',
            iconClass: 'fa-trash',
            confirmText: '删除配置方案',
            cancelText: '取消',
            tone: 'danger',
          });
          if (!confirmed) return;
          await deleteDiceProfileRecord(profileId);
          toastr.success('配置方案已删除');
          await refreshBody();
          return;
        }
        if (action === 'save-as') {
          const profile = await exportDiceProfile(profileId);
          if (isDiceProfileCharacterSource(profile.source)) return;
          const name = await showDiceSystemInputDialog({
            title: '另存为配置方案',
            message: '新配置方案名称',
            iconClass: 'fa-copy',
            initialValue: `${profile.name} 副本`,
            confirmText: '另存为',
          });
          if (!name) return;
          const now = new Date().toISOString();
          const copy = normalizeDiceProfileRecord(
            {
              ...profile,
              id: createDiceProfileRuntimeId('profile_copy'),
              name,
              source: { type: 'user' },
              createdAt: now,
              updatedAt: now,
            },
            { now, source: { type: 'user' } },
          );
          await saveDiceProfileRecord(copy);
          toastr.success(`已另存为配置方案：${copy.name}`);
          await refreshBody();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message !== '已取消应用配置方案') {
          showActionableErrorToast(message || '配置方案操作失败', {
            title: '配置方案操作失败',
            suggestion: 'importExport',
            developerHint: true,
          });
        }
      } finally {
        button.disabled = false;
      }
    });
  };

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

  // [保留] tutorialButtonEventsBound 声明已保留在 index.ts IIFE 内（idx 45 直接读写，见 index.ts 标记处，批次11）

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

  const countRuntimeDataChanges = (snapshot: unknown, rawData: unknown): number => {
    const rawRecord = asDiffRecord(rawData);
    const snapshotRecord = asDiffRecord(snapshot);
    if (!rawRecord || !snapshotRecord) return 0;

    let changesCount = 0;
    const matchedSnapshotKeys = new Set<string>();

    for (const sheetId in rawRecord) {
      if (!sheetId.startsWith('sheet_')) continue;
      const newSheet = rawRecord[sheetId];
      if (!isDiffSheet(newSheet)) continue;

      const snapshotEntry = findDiffSnapshotEntry(snapshotRecord, sheetId, newSheet);
      const oldSheet = snapshotEntry?.sheet;
      if (snapshotEntry) matchedSnapshotKeys.add(snapshotEntry.key);

      if (!oldSheet?.content) {
        changesCount++;
        continue;
      }

      const headers = getDiffHeaders(newSheet);
      const oldHeaders = getDiffHeaders(oldSheet);
      if (JSON.stringify(headers) !== JSON.stringify(oldHeaders)) {
        changesCount++;
        continue;
      }

      const newRows = getDiffRows(newSheet);
      const oldRows = getDiffRows(oldSheet);
      const matcher = createDiffRowMatcher(oldHeaders, oldRows);

      newRows.forEach((row, rowIndex) => {
        const matched = takeDiffRowMatch(matcher, headers, row, rowIndex);
        if (!matched) {
          changesCount++;
          return;
        }

        const hasChange = row.some((cell, colIndex) => {
          if (colIndex === 0) return false;
          return String(cell ?? '') !== String(matched.row[colIndex] ?? '');
        });
        if (hasChange) changesCount++;
      });

      changesCount += oldRows.filter((_, rowIndex) => !matcher.usedIndices.has(rowIndex)).length;
    }

    for (const sheetId in snapshotRecord) {
      if (sheetId.startsWith('sheet_') && !matchedSnapshotKeys.has(sheetId) && !rawRecord[sheetId]) changesCount++;
    }

    return changesCount;
  };

  const generateDiffMap = currentData => {
    const lastData = loadSnapshot();
    const diffSet = new Set();
    if (!lastData || !currentData) return diffSet;

    for (const sheetId in currentData) {
      const newSheet = currentData[sheetId];
      if (!newSheet || !newSheet.name) continue;
      const tableName = newSheet.name;
      const oldSheet = findDiffSnapshotEntry(lastData, sheetId, newSheet)?.sheet;

      if (!oldSheet?.content) {
        // 整个表是新的
        if (newSheet.content) {
          newSheet.content.forEach((row, rIdx) => {
            if (rIdx > 0) diffSet.add(`${tableName}-row-${rIdx - 1}`);
          });
        }
        continue;
      }

      const headers = getDiffHeaders(newSheet);
      const oldHeaders = getDiffHeaders(oldSheet);
      const newRows = getDiffRows(newSheet);
      const oldRows = getDiffRows(oldSheet);
      const matcher = createDiffRowMatcher(oldHeaders, oldRows);

      // 遍历当前数据
      newRows.forEach((row, rIdx) => {
        const matched = takeDiffRowMatch(matcher, headers, row, rIdx);

        if (!matched) {
          // 在快照中找不到匹配的行，标记整行为新增
          diffSet.add(`${tableName}-row-${rIdx}`);
        } else {
          // 找到匹配，对比每个单元格
          row.forEach((cell, cIdx) => {
            if (cIdx === 0) return; // 跳过索引列
            const oldCell = matched.row[cIdx];
            if (String(cell ?? '') !== String(oldCell ?? '')) {
              diffSet.add(`${tableName}-${rIdx}-${cIdx}`);
            }
          });
        }
      });
    }
    return diffSet;
  };

  const applyConfigStyles = config => {
    const targetDocument = getTavernHostDocument();
    const fontVal = FONTS.find(f => f.id === config.fontFamily)?.val || FONTS[0].val;

    // [优化] 只有字体 ID 变化时才重写 Style 标签，避免闪烁
    const styleTag = targetDocument.getElementById('acu-dynamic-font');
    const currentFontId = styleTag?.getAttribute('data-font-id');

    if (currentFontId !== config.fontFamily) {
      styleTag?.remove();
      if (targetDocument !== document) {
        document.getElementById('acu-dynamic-font')?.remove();
      }
      const fontImport = `
                @import url("https://fontsapi.zeoseven.com/3/main/result.css");
                @import url("https://fontsapi.zeoseven.com/442/main/result.css");
                @import url("https://fontsapi.zeoseven.com/256/main/result.css");
                @import url("https://fontsapi.zeoseven.com/482/main/result.css");
                @import url("https://fontsapi.zeoseven.com/446/main/result.css");
                @import url("https://fontsapi.zeoseven.com/570/main/result.css");
                @import url("https://fontsapi.zeoseven.com/292/main/result.css");
                @import url("https://fontsapi.zeoseven.com/69/main/result.css");
                @import url("https://fontsapi.zeoseven.com/7/main/result.css");
            `;
      const dynamicStyle = targetDocument.createElement('style');
      dynamicStyle.id = 'acu-dynamic-font';
      dynamicStyle.setAttribute('data-font-id', config.fontFamily);
      dynamicStyle.textContent = `
                    ${fontImport}
                    ${DICE_ROOT_SELECTOR},
                    ${DICE_ROOT_SELECTOR} *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-edit-overlay,
                    .acu-edit-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-dice-panel,
                    .acu-dice-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-contest-panel,
                    .acu-contest-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-dice-config-dialog,
                    .acu-relation-graph-container, .acu-avatar-manager, .acu-import-confirm-dialog, .acu-inventory-overlay, .acu-inventory-shell, .acu-inventory-detail,
                    .acu-gacha-overlay, .acu-embedded-options-container, .acu-option-panel, .acu-opt-btn, .acu-check-suggestion-btn {
                        font-family: ${fontVal} !important;
                    }
                `;
      targetDocument.head.appendChild(dynamicStyle);
    }

    // [优化] 尺寸和颜色变化只更新 CSS 变量，完全不闪烁
    const navMetrics = getNavigationFontMetrics(config.navFontSize);
    const cssVars = {
      '--acu-card-width': `${config.cardWidth}px`,
      '--acu-font-size': `${config.fontSize}px`,
      '--acu-opt-font-size': `${config.optionFontSize || 12}px`,
      '--acu-nav-button-size': `${navMetrics.buttonSize}px`,
      '--acu-nav-font-size': `${navMetrics.fontSize}px`,
      '--acu-nav-icon-size': `${navMetrics.iconSize}px`,
      '--acu-nav-button-padding-x': `${navMetrics.paddingX}px`,
      '--acu-grid-cols': config.gridColumns,
    };

    collectHostAndLocalNodes<HTMLElement>(`${DICE_ROOT_SELECTOR}, .acu-embedded-options-container`).forEach(node => {
      Array.from(node.classList)
        .filter(className => className.startsWith('acu-theme-'))
        .forEach(className => node.classList.remove(className));
      node.classList.add(`acu-theme-${config.theme}`);
      if (node.classList.contains('acu-wrapper')) {
        node.classList.toggle('acu-desktop-nav-aligned', config.desktopNavAligned === true);
      }
      Object.entries(cssVars).forEach(([key, value]) => {
        node.style.setProperty(key, String(value));
      });
    });

    return fontVal;
  };

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

  const relocateDbPayloadToAnchor = async (anchorIndex: number): Promise<void> => {
    if (anchorIndex < 0) return;
    const chat = getDbChatMessages();
    if (!chat || anchorIndex >= chat.length) return;
    const latestIndex = findLatestDbMessageIndex(true);
    if (latestIndex < 0 || latestIndex === anchorIndex) return;

    const source = chat[latestIndex];
    const target = chat[anchorIndex];
    if (!source || !target) return;
    if (target.is_user && !hasDbPayload(target)) return;

    let moved = false;

    const sourceIsolated = parseIsolatedData(source.TavernDB_ACU_IsolatedData);
    if (sourceIsolated) {
      const targetIsolated = parseIsolatedData(target.TavernDB_ACU_IsolatedData) || {};
      const isolationKey = resolveIsolationKey(source, sourceIsolated);
      if (isolationKey !== null) {
        if (Object.prototype.hasOwnProperty.call(sourceIsolated, isolationKey)) {
          targetIsolated[isolationKey] = sourceIsolated[isolationKey];
          const nextSource = { ...sourceIsolated };
          delete nextSource[isolationKey];
          if (Object.keys(nextSource).length > 0) {
            source.TavernDB_ACU_IsolatedData = nextSource;
          } else {
            delete source.TavernDB_ACU_IsolatedData;
          }
          target.TavernDB_ACU_IsolatedData = targetIsolated;
          moved = true;
        }
      } else {
        target.TavernDB_ACU_IsolatedData = sourceIsolated;
        delete source.TavernDB_ACU_IsolatedData;
        moved = true;
      }
    }

    if (source.TavernDB_ACU_Identity !== undefined) {
      target.TavernDB_ACU_Identity = source.TavernDB_ACU_Identity;
      delete source.TavernDB_ACU_Identity;
      moved = true;
    }
    if (source.TavernDB_ACU_IndependentData !== undefined) {
      target.TavernDB_ACU_IndependentData = source.TavernDB_ACU_IndependentData;
      delete source.TavernDB_ACU_IndependentData;
      moved = true;
    }
    if (source.TavernDB_ACU_ModifiedKeys !== undefined) {
      target.TavernDB_ACU_ModifiedKeys = source.TavernDB_ACU_ModifiedKeys;
      delete source.TavernDB_ACU_ModifiedKeys;
      moved = true;
    }
    if (source.TavernDB_ACU_UpdateGroupKeys !== undefined) {
      target.TavernDB_ACU_UpdateGroupKeys = source.TavernDB_ACU_UpdateGroupKeys;
      delete source.TavernDB_ACU_UpdateGroupKeys;
      moved = true;
    }
    if (source.TavernDB_ACU_Data !== undefined) {
      target.TavernDB_ACU_Data = source.TavernDB_ACU_Data;
      delete source.TavernDB_ACU_Data;
      moved = true;
    }
    if (source.TavernDB_ACU_SummaryData !== undefined) {
      target.TavernDB_ACU_SummaryData = source.TavernDB_ACU_SummaryData;
      delete source.TavernDB_ACU_SummaryData;
      moved = true;
    }

    if (moved) {
      await triggerSlash('savechat');
    }
  };

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

  const stripCrudSqlComments = (ddl: unknown): string => {
    const text = String(ddl || '');
    let result = '';
    let index = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBracketQuote = false;
    let inBacktickQuote = false;
    while (index < text.length) {
      const char = text[index];
      const next = text[index + 1];
      if (inSingleQuote) {
        result += char;
        if (char === "'" && next === "'") {
          result += next;
          index += 2;
          continue;
        }
        if (char === "'") inSingleQuote = false;
        index += 1;
        continue;
      }
      if (inDoubleQuote) {
        result += char;
        if (char === '"' && next === '"') {
          result += next;
          index += 2;
          continue;
        }
        if (char === '"') inDoubleQuote = false;
        index += 1;
        continue;
      }
      if (inBracketQuote) {
        result += char;
        if (char === ']') inBracketQuote = false;
        index += 1;
        continue;
      }
      if (inBacktickQuote) {
        result += char;
        if (char === '`' && next === '`') {
          result += next;
          index += 2;
          continue;
        }
        if (char === '`') inBacktickQuote = false;
        index += 1;
        continue;
      }
      if (char === "'") {
        inSingleQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '"') {
        inDoubleQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '[') {
        inBracketQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '`') {
        inBacktickQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '-' && next === '-') {
        while (index < text.length && text[index] !== '\n') index += 1;
        if (index < text.length) result += text[index++];
        continue;
      }
      if (char === '/' && next === '*') {
        index += 2;
        while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
          if (text[index] === '\n') result += '\n';
          index += 1;
        }
        index += index < text.length ? 2 : 0;
        continue;
      }
      result += char;
      index += 1;
    }
    return result;
  };

  const stripCrudSqlBlockComments = (ddl: unknown): string => {
    const text = String(ddl || '');
    let result = '';
    let index = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBracketQuote = false;
    let inBacktickQuote = false;
    while (index < text.length) {
      const char = text[index];
      const next = text[index + 1];
      if (inSingleQuote) {
        result += char;
        if (char === "'" && next === "'") {
          result += next;
          index += 2;
          continue;
        }
        if (char === "'") inSingleQuote = false;
        index += 1;
        continue;
      }
      if (inDoubleQuote) {
        result += char;
        if (char === '"' && next === '"') {
          result += next;
          index += 2;
          continue;
        }
        if (char === '"') inDoubleQuote = false;
        index += 1;
        continue;
      }
      if (inBracketQuote) {
        result += char;
        if (char === ']') inBracketQuote = false;
        index += 1;
        continue;
      }
      if (inBacktickQuote) {
        result += char;
        if (char === '`' && next === '`') {
          result += next;
          index += 2;
          continue;
        }
        if (char === '`') inBacktickQuote = false;
        index += 1;
        continue;
      }
      if (char === "'") {
        inSingleQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '"') {
        inDoubleQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '[') {
        inBracketQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '`') {
        inBacktickQuote = true;
        result += char;
        index += 1;
        continue;
      }
      if (char === '/' && next === '*') {
        index += 2;
        while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
          if (text[index] === '\n') result += '\n';
          index += 1;
        }
        index += index < text.length ? 2 : 0;
        continue;
      }
      result += char;
      index += 1;
    }
    return result;
  };

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
    setCachedRawData(refreshedData);
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

  const prepareCrudRowIdForUpdateCell = (input: CrudExistingRowPatchInput, colIndex: number): CrudRowIdPreparation => {
    const liveData = readRuntimeTableDataReference(input.api);
    const liveEntry =
      findDiffSnapshotEntry(liveData, input.tableName, input.sheet) ||
      findDiffSnapshotEntry(liveData, input.crudTableName, input.sheet);
    const liveRow = getDiffDataRow(liveEntry?.sheet, input.rowIndex);
    const liveRowId = liveRow?.[0];
    const headerName = String(input.headers[colIndex] || '').trim();

    if (!isCrudRowIdMissing(liveRowId)) return null;

    const inferred = inferCrudRowIdForUpdateCell(input);
    console.log('[DICE]ACU updateCell row_id check:', {
      tableName: input.tableName,
      crudTableName: input.crudTableName,
      rowIndex: input.rowIndex + 1,
      column: headerName || `#${colIndex + 1}`,
      liveSheetKey: liveEntry?.key || '',
      liveRowId,
      currentRowId: input.currentRow?.[0],
      nextRowId: input.nextRow?.[0],
      inferredRowId: inferred?.rowId,
      inferredSource: inferred?.source || '',
      firstCellHeader: input.headers[0],
      primaryCell: liveRow?.[1] ?? input.nextRow?.[1] ?? input.currentRow?.[1],
    });

    if (!liveRow || !inferred || isCrudRowIdMissing(inferred.rowId)) return null;

    const patchedRows: CrudRowIdPatch[] = [];
    const seenRows = new Set<DiffRow>();
    patchCrudRowIdIfMissing(liveRow, inferred.rowId, patchedRows, seenRows);
    patchCrudRowIdIfMissing(input.currentRow, inferred.rowId, patchedRows, seenRows);
    patchCrudRowIdIfMissing(input.nextRow, inferred.rowId, patchedRows, seenRows);

    if (patchedRows.length > 0) {
      console.log('[DICE]ACU updateCell row_id repaired before API call:', {
        tableName: input.tableName,
        rowIndex: input.rowIndex + 1,
        rowId: inferred.rowId,
        source: inferred.source,
        patchedRowCount: patchedRows.length,
      });
      return {
        patchedRows,
        rowId: inferred.rowId,
        source: inferred.source,
      };
    }

    return null;
  };

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

  const applyExistingRowCellPatchesViaCrud = async (input: CrudExistingRowPatchInput): Promise<Set<number>> => {
    const changedColumns =
      input.changedColumns || getCrudChangedColumns(input.headers, input.currentRow, input.nextRow);
    const writableColumns = new Set<number>(
      Array.from(changedColumns).filter(index => index > 0 && Boolean(input.headers[index])),
    );
    if (writableColumns.size === 0) return writableColumns;

    const columnAliasMap = input.columnAliasMap || buildCrudColumnAliasMap(input.sheet);
    assertCrudRequiredColumnsRepresented(input.tableName, input.headers, input.sheet);
    assertCrudEnumConstraints(
      input.tableName,
      input.headers,
      input.nextRow,
      input.sheet,
      input.rowIndex,
      writableColumns,
      columnAliasMap,
    );
    assertCrudLengthConstraints(
      input.tableName,
      input.headers,
      input.nextRow,
      input.sheet,
      input.rowIndex,
      writableColumns,
      columnAliasMap,
    );

    if (typeof input.api.updateRow === 'function') {
      const result = await input.api.updateRow({
        tableName: input.crudTableName,
        rowIndex: input.rowIndex + 1,
        data: buildRowDataForCrud(
          input.headers,
          input.nextRow,
          writableColumns,
          input.sheet,
          columnAliasMap,
        ),
        ...consumeCrudWriteOptions(input.batchContext),
      });
      if (result !== false && result !== -1) return writableColumns;

      if (input.batchContext) input.batchContext.remainingOperations += writableColumns.size;
      console.warn('[DICE]ACU updateRow failed, falling back to updateCell:', {
        tableName: input.tableName,
        rowIndex: input.rowIndex + 1,
        changedColumnCount: writableColumns.size,
      });
    }

    for (const colIndex of Array.from(writableColumns).sort((left, right) => left - right)) {
      const headerName = String(input.headers[colIndex] || '').trim();
      const rowIdPreparation = prepareCrudRowIdForUpdateCell(input, colIndex);
      let result: unknown;
      try {
        result = await input.api.updateCell({
          tableName: input.crudTableName,
          rowIndex: input.rowIndex + 1,
          colIdentifier: headerName,
          value: getCrudCellValueForWrite(
            input.headers,
            input.nextRow,
            colIndex,
            input.sheet,
            columnAliasMap,
          ),
          ...consumeCrudWriteOptions(input.batchContext),
        });
      } catch (error) {
        restoreCrudRowIdPreparation(rowIdPreparation);
        throw error;
      }
      if (result === false || result === -1) {
        restoreCrudRowIdPreparation(rowIdPreparation);
        assertCrudEnumConstraints(
          input.tableName,
          input.headers,
          input.nextRow,
          input.sheet,
          input.rowIndex,
          undefined,
          columnAliasMap,
        );
        assertCrudLengthConstraints(
          input.tableName,
          input.headers,
          input.nextRow,
          input.sheet,
          input.rowIndex,
          undefined,
          columnAliasMap,
        );
        assertCrudRequiredCellValues(
          input.tableName,
          input.headers,
          input.nextRow,
          input.sheet,
          input.rowIndex,
          columnAliasMap,
        );
        assertCrudJsonFallbackAllowed(input.tableName, input.sheet);
        if (rowIdPreparation && (await applyJsonCellFallbackForCrud(input, colIndex))) {
          continue;
        }
        console.warn('[DICE]ACU updateCell failed after row_id preparation:', {
          tableName: input.tableName,
          crudTableName: input.crudTableName,
          rowIndex: input.rowIndex + 1,
          column: headerName || `#${colIndex + 1}`,
          preparedRowId: rowIdPreparation?.rowId,
          preparedRowIdSource: rowIdPreparation?.source || '',
        });
        const rowIdDetail = rowIdPreparation
          ? `；已按 ${rowIdPreparation.source} 补齐 row_id=${String(rowIdPreparation.rowId)} 后数据库仍拒绝更新，通常表示该行没有成功载入 SQLite（例如同一行其它 NOT NULL/CHECK 字段仍不满足）`
          : '';
        throw new Error(
          `更新 "${input.tableName}" 第 ${input.rowIndex + 1} 行失败（列：${headerName || `#${colIndex + 1}`}）${rowIdDetail}`,
        );
      }
    }

    return writableColumns;
  };

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

  const applySheetDataViaCrud = async (api, sheetKey: string, desiredSheet, latestSheet) => {
    if (!desiredSheet?.name || !Array.isArray(desiredSheet?.content)) {
      throw new Error(`修改表不存在或格式非法：${sheetKey}`);
    }
    if (!latestSheet?.name || !Array.isArray(latestSheet?.content)) {
      throw new Error(`表 "${desiredSheet.name || sheetKey}" 不存在，整表新增/恢复不支持快捷保存。`);
    }
    if (!sameHeaders(desiredSheet, latestSheet)) {
      throw new Error(`表 "${desiredSheet.name || sheetKey}" 的结构已变化，结构级变更只标注，不支持快捷保存。`);
    }

    const tableName = desiredSheet.name;
    const crudTableName = getCrudTableIdentifier(desiredSheet, tableName);
    const headers = getSheetHeaders(desiredSheet);
    const desiredRows = getSheetRows(desiredSheet);
    const oldRows = getSheetRows(latestSheet);
    const columnAliasMap = buildCrudColumnAliasMap(desiredSheet);
    assertCrudRequiredColumnsRepresented(tableName, headers, desiredSheet);

    if (desiredRows.length > oldRows.length) {
      assertAppendOnlyRows(oldRows, desiredRows);
    }

    let workingRows = oldRows.map(row => [...row]);
    if (desiredRows.length < oldRows.length) {
      const deleteIndices = findDeletionIndicesForCrud(oldRows, desiredRows);
      if (!deleteIndices) {
        throw new Error(`表 "${tableName}" 的行删除无法安全定位，已取消快捷保存。`);
      }
      for (const rowIndex of deleteIndices.sort((left, right) => right - left)) {
        const result = await api.deleteRow({ tableName: crudTableName, rowIndex: rowIndex + 1, skipNotify: true });
        if (result === false) throw new Error(`删除 "${tableName}" 第 ${rowIndex + 1} 行失败`);
        workingRows.splice(rowIndex, 1);
      }
    }

    if (desiredRows.length > workingRows.length) {
      for (let index = workingRows.length; index < desiredRows.length; index++) {
        assertCrudInsertRequiredCells(tableName, headers, desiredRows[index], desiredSheet, index);
        assertCrudEnumConstraints(
          tableName,
          headers,
          desiredRows[index],
          desiredSheet,
          index,
          undefined,
          columnAliasMap,
        );
        assertCrudLengthConstraints(
          tableName,
          headers,
          desiredRows[index],
          desiredSheet,
          index,
          undefined,
          columnAliasMap,
        );
        const rowData = buildRowDataForCrud(headers, desiredRows[index], undefined, desiredSheet, columnAliasMap);
        const result = await api.insertRow({ tableName: crudTableName, data: rowData, skipNotify: true });
        if (result === false || result === -1) {
          throw new Error(`向 "${tableName}" 追加新行失败：数据库拒绝写入，请检查表结构、必填列和枚举约束。`);
        }
        workingRows.push([...desiredRows[index]]);
      }
    }

    for (let rowIndex = 0; rowIndex < desiredRows.length; rowIndex++) {
      const desiredRow = desiredRows[rowIndex] || [];
      const currentRow = workingRows[rowIndex] || [];
      if (sameRow(currentRow, desiredRow)) continue;

      const changedColumns = getCrudChangedColumns(headers, currentRow, desiredRow);
      await applyExistingRowCellPatchesViaCrud({
        api,
        sheetKey,
        tableName,
        crudTableName,
        headers,
        currentRow,
        nextRow: desiredRow,
        sheet: desiredSheet,
        rowIndex,
        changedColumns,
        columnAliasMap,
      });
      workingRows[rowIndex] = [...desiredRow];
    }
  };

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
    setCachedRawData(refreshedData);
    api._notifyTableUpdate?.();
    return refreshedData;
  };

  const saveDataToDatabase = async (tableData, skipRender = false, commitDeletes = false) => {
    if (getIsSaving()) {
      console.warn('[DICE]保存操作正在进行中，跳过重复请求');
      return;
    }
    console.info('[DICE]开始通过数据库 CRUD 保存数据...');
    setIsSaving(true);
    const { $ } = getCore();
    const $saveBtn = $('#acu-btn-save-global');

    if (!skipRender && $saveBtn.length) {
      $saveBtn.find('i').removeClass('fa-save').addClass('fa-spinner fa-spin');
      $saveBtn.prop('disabled', true);
    }

    try {
      const dataToSave = await applyRuntimeDataViaCrud(tableData, undefined, { commitDeletes });
      saveSnapshot(dataToSave);
      setHasUnsavedChanges(false);
      setCurrentDiffMap(new Set());
      if (window.acuModifiedSet) window.acuModifiedSet.clear();
      console.info('[DICE]本地状态已更新，未保存更改已清除');

      if (!skipRender) {
        renderInterface();
      }
    } catch (e) {
      const errorMessage = e.message || '保存出错，请检查数据格式和数据库版本';
      console.error('[DICE]保存数据失败:', {
        error: e,
        message: errorMessage,
        stack: e.stack,
      });
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
      throw e;
    } finally {
      setIsSaving(false);
      console.info('[DICE]保存操作完成');
      if (!skipRender && $saveBtn.length) {
        $saveBtn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-save');
        $saveBtn.prop('disabled', false);
      }
    }
  };

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
    const operation = getSaveQueue()
      .catch(error => {
        console.warn('[DICE]ACU runInSaveQueue previous step failed, continue next task:', error);
      })
      .then(task);

    setSaveQueue(operation)
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
    const sources = [getTableData({ silent: true }), getCachedRawData(), loadSnapshot()];
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
    setCachedRawData(!fallbackEntry?.sheet || refreshedEntry?.sheet ? latestData || fallbackData : fallbackData);
    api._notifyTableUpdate?.();
    return getCachedRawData();
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

  const saveRowInstantly = async (
    tableKey: string,
    rowIndex: number,
    newRowData: unknown[],
    context?: RuntimeRowSaveContext,
  ): Promise<void> => {
    try {
      await runInSaveQueue(async () => {
        const api = assertRuntimeCrudApi();
        const source = resolveRuntimeMutationSource(tableKey);
        const sourceData = context?.sourceData || source?.data;
        const entry = source?.entry;
        const tableName = normalizeDiffText(context?.tableName) || normalizeDiffText(entry?.sheet?.name);
        const sheetForMetadata = context?.sheet || entry?.sheet;
        const headers = Array.isArray(context?.headers) ? context.headers : getSheetHeaders(entry?.sheet);
        const currentRow = Array.isArray(context?.currentRow)
          ? context.currentRow
          : getDiffDataRow(entry?.sheet, rowIndex);

        if (!tableName) {
          throw new Error(`表格 "${tableKey}" 不存在`);
        }
        if (!Array.isArray(headers) || headers.length === 0) {
          throw new Error(`表格 "${tableName}" 表头为空`);
        }
        if (!currentRow) {
          throw new Error(`表格 "${tableName}" 第 ${rowIndex + 1} 行不存在`);
        }

        const crudTableName = getCrudTableIdentifier(sheetForMetadata, tableName);
        const nextRow = [...newRowData];
        const columnAliasMap = buildCrudColumnAliasMap(sheetForMetadata);
        const changedColumns = getCrudChangedColumns(headers, currentRow, nextRow);
        const appliedColumns = await applyExistingRowCellPatchesViaCrud({
          api,
          sheetKey: tableKey,
          tableName,
          crudTableName,
          headers,
          currentRow,
          nextRow,
          sheet: sheetForMetadata,
          rowIndex,
          changedColumns,
          columnAliasMap,
        });
        if (appliedColumns.size === 0) return;

        const fallbackData = sourceData ? cloneRuntimeDataValue(sourceData) : null;
        if (fallbackData) {
          const fallbackEntry =
            findRuntimeSheetEntryForMutation(fallbackData, entry?.key || tableKey) ||
            findRuntimeSheetEntryForMutation(fallbackData, tableKey);
          if (fallbackEntry?.sheet?.content?.[rowIndex + 1]) {
            fallbackEntry.sheet.content[rowIndex + 1] = [...nextRow];
          }
          updateRuntimeDataCacheAfterCrud(api, fallbackData, entry?.key || tableKey);
        } else {
          setCachedRawData(getTableData({ silent: true }) || getCachedRawData());
          api._notifyTableUpdate?.();
        }

        const snapshot = loadSnapshot();
        const snapshotEntry = snapshot ? findDiffSnapshotEntry(snapshot, tableKey, sheetForMetadata) : null;
        if (setDiffDataRow(snapshotEntry?.sheet, rowIndex, nextRow)) {
          saveSnapshot(snapshot);
        }
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error('[DICE]ACU saveRowInstantly error:', getRuntimeErrorLogPayload(e));
      showActionableErrorToast(`保存失败: ${errorMsg}`, { title: '保存失败', suggestion: 'save' });
      throw e;
    }
  };

  const appendRowInstantly = async (tableKey: string, newRowData: unknown[]): Promise<void> => {
    await runInSaveQueue(async () => {
      const api = assertRuntimeCrudApi();
      const source = resolveRuntimeMutationSource(tableKey);
      const sourceData = source?.data;
      const entry = source?.entry;
      if (!entry?.sheet?.name || !Array.isArray(entry.sheet.content)) {
        throw new Error(`表格 "${tableKey}" 不存在`);
      }

      const headers = getSheetHeaders(entry.sheet);
      const tableName = entry.sheet.name;
      const crudTableName = getCrudTableIdentifier(entry.sheet, tableName);
      const nextRow = [...newRowData];
      const columnAliasMap = buildCrudColumnAliasMap(entry.sheet);
      assertCrudRequiredColumnsRepresented(tableName, headers, entry.sheet);
      assertCrudInsertRequiredCells(tableName, headers, nextRow, entry.sheet, getSheetRows(entry.sheet).length);
      assertCrudEnumConstraints(
        tableName,
        headers,
        nextRow,
        entry.sheet,
        getSheetRows(entry.sheet).length,
        undefined,
        columnAliasMap,
      );
      assertCrudLengthConstraints(
        tableName,
        headers,
        nextRow,
        entry.sheet,
        getSheetRows(entry.sheet).length,
        undefined,
        columnAliasMap,
      );
      const rowData = buildRowDataForCrud(headers, nextRow, undefined, entry.sheet, columnAliasMap);
      const result = await api.insertRow({ tableName: crudTableName, data: rowData, skipNotify: true });
      if (result === false || result === -1) {
        throw new Error(`向 "${tableName}" 追加新行失败：数据库拒绝写入，请检查表结构、必填列和枚举约束。`);
      }

      const fallbackData = cloneRuntimeDataValue(sourceData);
      const fallbackEntry =
        findRuntimeSheetEntryForMutation(fallbackData, entry.key) ||
        findRuntimeSheetEntryForMutation(fallbackData, tableKey);
      if (fallbackEntry?.sheet?.content) fallbackEntry.sheet.content.push([...nextRow]);
      updateRuntimeDataCacheAfterCrud(api, fallbackData, entry.key || tableKey);
    });
  };

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

export {
  showAvatarCropModal, refreshAutoImageColorForAvatar, showAvatarManager, clearDiceSystemCache,
  clearDiceLocalCacheData, showManualUpdateDialog, showImportConfirmDialog, showCardEditModal, _configCache,
  LEGACY_DB_THEME_SYNC_CONFIG_KEY, sanitizeUiConfig, getConfig, saveConfig, DICE_CONFIG_BACKUP_FORMAT,
  DICE_CONFIG_BACKUP_SCHEMA_VERSION, DICE_CONFIG_BACKUP_SETTINGS_EXPANDED_KEY,
  DICE_PROFILE_INDEX_STORAGE_KEY, DICE_PROFILE_LAST_APPLIED_STORAGE_KEY,
  DICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY, DICE_PROFILE_COLLAPSED_SECTIONS_STORAGE_KEY,
  DICE_PROFILE_PRE_APPLY_SNAPSHOT_LIMIT, DICE_CONFIG_BACKUP_MODULES, DICE_CONFIG_BACKUP_PRIVACY_RISK_TEXT,
  DICE_CONFIG_BACKUP_KEY_STRATEGIES, DICE_CONFIG_BACKUP_GACHA_CATALOG_RESOURCE_KEY,
  DICE_CONFIG_BACKUP_TABLE_TEMPLATE_RESOURCE_KEY, DICE_CONFIG_BACKUP_ACTIVE_KEY_TO_PRESET_KEY,
  isDiceConfigBackupRecord, cloneDiceConfigBackupValue, getDiceConfigBackupModuleDefinition,
  isDiceConfigBackupModuleId, getDiceConfigBackupWarningCount, formatDiceConfigBackupSelectedModuleRiskLines,
  formatDiceConfigBackupPrivacyDetail, showDiceConfigBackupPrivacyConfirm,
  normalizeDiceConfigBackupSelectedModuleIds, getDiceConfigBackupKeyStrategy,
  getDiceConfigBackupRecordString, getDiceConfigBackupValidationRuleKey, getDiceConfigBackupRegexRuleKey,
  copyDiceConfigBackupExistingFields, sanitizeDiceConfigBackupValidationRule,
  sanitizeDiceConfigBackupRegexRule, sanitizeDiceConfigBackupRuleList, sanitizeDiceConfigBackupPresetRules,
  sanitizeDiceConfigBackupCustomOnlyPresetArrayForExport, sanitizeDiceConfigBackupStoredValue,
  getDiceConfigBackupStoredValue, normalizeDiceConfigBackupGachaCatalogSnapshotRecords,
  collectDiceConfigBackupGachaCatalogRecords, collectDiceConfigBackupGachaCatalogRollbackSnapshot,
  getDiceConfigBackupTableTemplateApi, collectDiceConfigBackupTableTemplate,
  getDiceConfigBackupGachaCatalogItemCount, getDiceConfigBackupModuleResourceCount,
  hasDiceConfigBackupTableTemplateResource, hasDiceConfigBackupRecoverableStorage,
  getDiceConfigBackupModuleResourceShapeWarnings, hasDiceConfigBackupLocalImageReference,
  getDiceConfigBackupModuleWarnings, buildDiceConfigBackup, parseDiceConfigBackup,
  getDiceConfigBackupValueIdentity, isDiceConfigBackupSameValue, mergeDiceConfigBackupSetArray,
  getDiceConfigBackupPresetRecordId, getDiceConfigBackupPresetRecordName, mergeDiceConfigBackupPresetArray,
  mergeDiceConfigBackupCustomOnlyPresetArray, getDiceConfigBackupRuleRecords,
  buildDiceConfigBackupRuleOverrideMap, applyDiceConfigBackupRuleOverrides, mergeDiceConfigBackupCustomRules,
  mergeDiceConfigBackupValidationRules, mergeDiceConfigBackupRegexRules,
  getDiceConfigBackupSafeCurrentPresets, mergeDiceConfigBackupPresetArraySafely,
  normalizeDiceConfigBackupGachaPoolSettings, mergeDiceConfigBackupGachaPoolSettings,
  normalizeDiceConfigBackupGachaItemSettings, mergeDiceConfigBackupGachaItemSettings,
  remapDiceConfigBackupGachaItemSettings, getDiceConfigBackupBuiltinPresetIds,
  getDiceConfigBackupKnownPresetIds, setDiceConfigBackupValue, applyDiceConfigBackupValue,
  applyDiceConfigBackupActiveValue, normalizeDiceConfigBackupGachaCatalogItems,
  normalizeDiceConfigBackupGachaCatalogResourceRecord, getDiceConfigBackupGachaItemNameKey,
  mergeDiceConfigBackupGachaCatalogItems, getDiceConfigBackupTableTemplateRollbackSnapshot,
  restoreDiceConfigBackupTableTemplateRollbackSnapshot, restoreDiceConfigBackupGachaCatalogRecords,
  restoreDiceConfigBackupTableTemplate, restoreDiceConfigBackupModuleResources,
  restoreDiceConfigBackupGachaCatalogSnapshot, syncDiceConfigBackupRuntimeAfterRestore,
  applyDiceConfigBackup, getAllDiceConfigBackupModuleIds, normalizeDiceProfileModuleIds,
  getDiceProfileModuleNames, toDiceProfileSummary, createDiceProfileRuntimeId, getDiceProfileIndex,
  saveDiceProfileIndex, DiceProfileDB, refreshDiceProfileIndex, getDiceProfileRecords,
  normalizeDiceProfileRecord, parseDiceProfileInput, saveDiceProfileRecord, upsertDiceProfileRecord,
  deleteDiceProfileRecord, importDiceProfile, saveCurrentDiceProfile, createDiceProfilePreApplySnapshot,
  renderDiceProfileApplyConfirmDetailHtml, showDiceProfileApplyConfirm, applyDiceProfile, exportDiceProfile,
  downloadDiceProfileJson, createDiceProfileRegexId, createDiceProfileTavernRegexReplaceString,
  createDiceProfileTavernRegex, downloadDiceProfileTavernRegex, getDiceProfilePromptStates,
  setDiceProfilePromptState, getDiceProfilePromptState, getDiceProfileSillyTavern,
  getDiceProfileCharacterContext, getDiceProfileCurrentCharacterRecords,
  collectDiceProfileRegexScriptsFromRecord, collectDiceCharacterProfileTexts, detectCharacterDiceProfile,
  showDiceCharacterProfilePrompt, maybePromptCharacterDiceProfile, scheduleCharacterDiceProfileDetection,
  getDiceConfigBackupAvailableModuleIds, getDiceConfigBackupSelectedModuleIdsFromDialog,
  getDiceConfigBackupRestoreWarnings, getDiceConfigBackupModuleCountText, renderDiceConfigBackupModuleRows,
  renderDiceConfigBackupWarningList, renderDiceConfigBackupWarningSlot, renderDiceConfigBackupPrivacyNotice,
  renderDiceConfigBackupExportBody, renderDiceConfigBackupRestoreBody, downloadDiceConfigBackupJson,
  getDiceProfileCollapsedSections, saveDiceProfileCollapsedSections, getDiceProfileSourceLabel,
  isDiceProfileCharacterSource, renderDiceProfileSummaryRow, renderDiceProfileTabPanel,
  renderDiceProfileManagerBody, showDiceConfigBackupDialog, tutorialModule, getTutorialModule,
  getTutorialButtonHtml, isTutorialScope, prepareAvatarManagerTutorial,
  prepareMvuTutorial, prepareInventoryTutorial, SETTINGS_GROUP_TUTORIAL_MAP, prepareSettingsGroupTutorial,
  startTutorialFromButton, bindTutorialButtonsIn, asDiffRecord, isDiffSheet, normalizeDiffText,
  normalizeDiffHeader, getDiffSheetIdentity, findDiffSnapshotEntry, normalizeDiffRow, getDiffSheetByKey,
  getDiffDataRow, setDiffDataRow, setDiffDataCell, removeDiffDataRow, getDiffSheetContent, getDiffHeaders,
  getDiffRows, DIFF_ID_HEADER_KEYWORDS, getDiffPreferredColumns, getDiffRowIdentityKeys,
  getDiffRowDisplayTitle, createDiffRowMatcher, takeDiffRowMatch, countRuntimeDataChanges, generateDiffMap,
  applyConfigStyles, addStyles, cloneRuntimeDataValue, restoreMutableRuntimeValue, getRuntimeErrorMessage,
  getRuntimeErrorLogPayload, readRuntimeTableData, readRuntimeTableDataReference, hasRuntimeTableReadApi,
  getTableData, getDbChatMessages, parseIsolatedData, hasSheetKeys, hasDbPayload, findLatestDbMessageIndex,
  resolveIsolationKey, relocateDbPayloadToAnchor, normalizeSheetKeys, assertRuntimeCrudApi, getSheetRows,
  getSheetHeaders, sameRow, sameHeaders, getStableRowKeyForCrud, getCrudSheetDdl, stripCrudSqlComments,
  stripCrudSqlBlockComments, stripCrudSqlNonStructuralComments, CRUD_SQL_IDENTIFIER_PATTERN,
  decodeCrudSqlIdentifier, normalizeCrudHeaderLookupKey, normalizeCrudSqlComment, getCrudSqlCommentAliases,
  addCrudColumnAlias, getCrudColumnNameForHeader, parseCrudColumnDefinitionLine, getCrudSqlTableName,
  getCrudTableIdentifier, buildCrudColumnAliasMap, parseSqlQuotedValues, buildCrudEnumConstraintMap,
  isCrudNullableEnumEmptyValue, assertCrudEnumConstraints, buildCrudLengthConstraintMap,
  getCrudUnsupportedFallbackConstraintText, assertCrudJsonFallbackAllowed, assertCrudLengthConstraints,
  buildCrudRequiredHeaderSet, assertCrudRequiredColumnsRepresented, getCrudRequiredColumnsByHeaderIndex,
  assertCrudRequiredCellValues, getCrudCellValueForWrite, buildRowDataForCrud, getCrudChangedColumns,
  isCrudRowIdMissing, shouldInferCrudRowIdFromVisibleIndex, inferCrudRowIdForUpdateCell,
  patchCrudSheetCellInRecord, patchCrudSheetInRecord, patchCrudSheetCellInMessage, patchCrudSheetInMessage,
  patchLatestChatSheetCellWithoutTracking, patchLatestChatSheetWithoutTracking,
  saveSheetsViaJsonFloorWithoutTracking, applyJsonCellFallbackForCrud, patchCrudRowIdIfMissing,
  prepareCrudRowIdForUpdateCell, restoreCrudRowIdPreparation, assertCrudInsertRequiredCells,
  consumeCrudWriteOptions, applyExistingRowCellPatchesViaCrud, findDeletionIndicesForCrud,
  assertAppendOnlyRows, findRuntimeSheetEntryForCrud, applySheetDataViaCrud, sanitizeRuntimeTableData,
  applyRuntimeDataViaCrud, saveDataToDatabase, performSaveDataOnly, runInSaveQueue, saveDataOnly,
  findRuntimeSheetEntryForMutation, resolveRuntimeMutationSource, updateRuntimeDataCacheAfterCrud,
  saveRowInstantly, appendRowInstantly, deleteRowInstantly, processJsonData,
}; // __wireDiceSettingsDeps 已由头部 export function 导出
export type { DiceConfigBackupModuleId, DiceConfigBackupKeyStrategy, DiceConfigBackupModuleDefinition, DiceConfigBackupModulePayload, DiceConfigBackupDocument, DiceConfigBackupParseResult, DiceConfigBackupApplyStats, DiceConfigBackupPresetMergeResult, DiceConfigBackupPendingActiveWrite, DiceConfigBackupGachaCatalogRollbackSnapshot, DiceConfigBackupTableTemplateRollbackSnapshot, DiceProfileSourceType, DiceProfileSummary, DiceProfileRecord, DiceProfileApplyOptions, DiceProfileSaveCurrentOptions, DiceProfileImportOptions, DiceCharacterProfileDetection, DiceConfigBackupTableTemplateApi, DiffSheet, DiffRow, DiffRowMatch, DiffRowMatcher, RuntimeTableReadOptions, DbChatMessage, RuntimeCrudRowData, RuntimeCrudCellUpdatePayload, RuntimeCrudUpdateRowPayload, RuntimeCrudInsertRowPayload, RuntimeCrudDeleteRowPayload, RuntimeCrudWriteApi, RuntimeCrudEnumConstraint, CrudRowIdPatch, CrudRowIdPreparation, CrudWriteBatchContext, CrudExistingRowPatchInput, RuntimeRowSaveContext };
