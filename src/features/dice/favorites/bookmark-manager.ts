// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=3「BookmarkManager - 书签管理器（按聊天隔离）」
// 原行范围：1322-2548（含 banner 1319-2548；批次5 已拆常量簇 2497-2524 至 engine/preset-constants.ts，本文件正文 = bak 1322-2496 + bak 2525-2548，保留中间批次5标记注释）；拆分批次 6；外部 closure 依赖：8
// 接线说明：getCurrentContextFingerprint/getCore/getTavernHostWindow/getTavernHostDocument@29、getConfig@30、getDiceConfig@21、scheduleViewportBoundsRefresh@45 均定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireBookmarkManagerDeps({ getCurrentContextFingerprint, getCore, getConfig, getDiceConfig, getTavernHostWindow, getTavernHostDocument, scheduleViewportBoundsRefresh }) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数/方法内调用，注入先于任何调用，与 IIFE 内原时序等价）。
//   `$`（jQuery）为全局符号（IIFE 内亦无声明），模块内解析行为与原 IIFE 一致，无需接线。

let getCurrentContextFingerprint = null;
let getCore = null;
let getConfig = null;
let getDiceConfig = null;
let getTavernHostWindow = null;
let getTavernHostDocument = null;
let scheduleViewportBoundsRefresh = null;

export function __wireBookmarkManagerDeps(deps) {
  getCurrentContextFingerprint = deps.getCurrentContextFingerprint;
  getCore = deps.getCore;
  getConfig = deps.getConfig;
  getDiceConfig = deps.getDiceConfig;
  getTavernHostWindow = deps.getTavernHostWindow;
  getTavernHostDocument = deps.getTavernHostDocument;
  scheduleViewportBoundsRefresh = deps.scheduleViewportBoundsRefresh;
}
  // ========================================
  // BookmarkManager - 书签管理器（按聊天隔离）
  // ========================================
  const BookmarkManager = {
    STORAGE_KEY_PREFIX: 'acu_bookmarks_v1_',
    MAX_CONTEXTS: 20, // 最多保留多少个聊天的bookmark数据

    _cache: null,
    _currentContextId: null,

    // 获取当前上下文专属的存储键
    _getStorageKey(ctxId) {
      return this.STORAGE_KEY_PREFIX + (ctxId || getCurrentContextFingerprint());
    },

    // 清理过旧的bookmark数据，只保留最近使用的 N 个
    _cleanupOldContexts() {
      try {
        const prefix = this.STORAGE_KEY_PREFIX;
        const allKeys = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            allKeys.push(key);
          }
        }

        if (allKeys.length <= this.MAX_CONTEXTS) {
          // 数据量在限制内，无需清理
          return;
        }

        // 按最后访问时间排序（通过内部 _lastAccess 字段）
        const keyWithTime = allKeys.map(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            return { key, time: data?._lastAccess || 0 };
          } catch {
            return { key, time: 0 };
          }
        });

        keyWithTime.sort((a, b) => b.time - a.time);

        // 删除超出限制的旧数据
        const toDelete = keyWithTime.slice(this.MAX_CONTEXTS);
        toDelete.forEach(item => {
          localStorage.removeItem(item.key);
        });

        if (toDelete.length > 0) {
          console.log(
            `[DICE]BookmarkManager 清理了 ${toDelete.length} 个过期的bookmark数据（当前保留 ${this.MAX_CONTEXTS} 个聊天的数据，清理前共有 ${allKeys.length} 个）`,
          );
        }
      } catch (e) {
        console.warn('[DICE]BookmarkManager 清理失败', e);
      }
    },

    _load() {
      const ctxId = getCurrentContextFingerprint();

      // 上下文变化时清空缓存
      if (this._currentContextId !== ctxId) {
        this._cache = null;
        this._currentContextId = ctxId;
      }

      if (!this._cache) {
        try {
          const stored = localStorage.getItem(this._getStorageKey());
          this._cache = stored ? JSON.parse(stored) : {};
          // 移除内部元数据字段，不暴露给业务逻辑
          delete this._cache._lastAccess;
        } catch (e) {
          this._cache = {};
        }
      }
      return this._cache;
    },

    _save() {
      try {
        // 写入时附带最后访问时间戳
        const dataToSave = { ...this._cache, _lastAccess: Date.now() };
        localStorage.setItem(this._getStorageKey(), JSON.stringify(dataToSave));

        // 每次保存后尝试清理（内部有数量判断，不会频繁执行）
        this._cleanupOldContexts();
      } catch (e) {
        console.warn('[DICE]BookmarkManager 保存失败', e);
      }
    },

    isBookmarked(tableName, rowKey) {
      const data = this._load();
      return !!(data[tableName] && data[tableName][rowKey]);
    },

    toggleBookmark(tableName, rowKey) {
      const data = this._load();
      if (!data[tableName]) data[tableName] = {};

      if (data[tableName][rowKey]) {
        // 取消bookmark
        delete data[tableName][rowKey];
        if (Object.keys(data[tableName]).length === 0) {
          delete data[tableName];
        }
      } else {
        // 添加bookmark
        data[tableName][rowKey] = true;
      }
      this._save();
    },

    getBookmarks(tableName) {
      const data = this._load();
      if (!data[tableName]) return [];
      return Object.keys(data[tableName]);
    },

    // 清理当前聊天的所有bookmark（调试用）
    clearCurrentContext() {
      localStorage.removeItem(this._getStorageKey());
      this._cache = null;
    },
  };
  const escapeHtml = s =>
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

  const DATA_VALIDATION_DEPRECATED_META = {
    deprecated: true,
    deprecatedReason: '旧版兼容保留，不建议新增使用',
  } as const;
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
  const showPresetConflictDialog = (options: {
    presetName: string;
    presetType: string;
    onOverwrite: () => void;
    onRename: (newName: string) => void;
    onCancel: () => void;
    existingNames: string[];
  }) => {
    const { $ } = getCore();
    $('.acu-import-confirm-overlay').remove();

    const config = getConfig();
    const suggestedName = generateUniqueName(options.presetName, options.existingNames);

    const dialogHtml = `
      <div class="acu-import-confirm-overlay acu-theme-${config.theme}">
        <div class="acu-import-confirm-dialog">
          <div class="acu-import-confirm-header">
            <i class="fa-solid fa-file-import"></i> 导入${options.presetType}预设
          </div>
          <div class="acu-import-confirm-body">
            <div class="acu-import-warning-container">
              <i class="fa-solid fa-exclamation-triangle acu-import-warning-icon"></i>
              <div class="acu-import-warning-title">发现同名预设</div>
              <div class="acu-import-warning-message">预设「${escapeHtml(options.presetName)}」已存在，请选择处理方式：</div>
            </div>
            <div class="acu-import-conflict-options">
              <label class="acu-import-radio">
                <input type="radio" name="preset-conflict-mode" value="overwrite" checked />
                <span>覆盖现有预设</span>
              </label>
              <label class="acu-import-radio">
                <input type="radio" name="preset-conflict-mode" value="rename" />
                <span>新建副本（命名为「${escapeHtml(suggestedName)}」）</span>
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

    // 强制样式（与头像导入弹窗一致）
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

    $dialog.find('.acu-import-cancel-btn').click(() => {
      closeDialog();
      options.onCancel();
    });

    setupOverlayClose($dialog, 'acu-import-confirm-overlay', () => {
      closeDialog();
      options.onCancel();
    });

    $dialog.find('.acu-import-confirm-btn').click(function () {
      const mode = $dialog.find('input[name="preset-conflict-mode"]:checked').val();
      closeDialog();
      if (mode === 'overwrite') {
        options.onOverwrite();
      } else {
        options.onRename(suggestedName);
      }
    });
  };
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
  // 注意：gachaHeartbeatTimer/gachaShopUiRefreshTimer/gachaShopRootElement 三个 let 状态单元
  // 被 index.ts IIFE 剩余代码（idx 29 等）直接重新赋值，ESM import 绑定只读无法再赋值，
  // 故保留在 index.ts IIFE 内（标记注释处），本模块不使用它们。
  const GACHA_TEST_DEFAULT_FORTUNE = 0;
  const GACHA_SHARD_EXCHANGE_COST = 10;
  const STORAGE_KEY_GACHA_STATE = 'acu_gacha_state_v1';
  const STORAGE_KEY_GACHA_SHARD_SHOP_RARITY = 'acu_gacha_shard_shop_rarity_v1';
  const STORAGE_KEY_GACHA_POOL_SETTINGS = 'acu_gacha_pool_settings_v1';
  const STORAGE_KEY_GACHA_SETTINGS_POOL_TAG = 'acu_gacha_settings_pool_tag_v1';
  const STORAGE_KEY_GACHA_ITEM_SETTINGS = 'acu_gacha_item_settings_v1';
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
  const smartInsertToTextarea = (newContent: string, contentType: 'action' | 'dice') => {
    // contentType: 'action' (交互选项) 或 'dice' (骰子结果)
    const { $ } = getCore();
    const $ta = $('#send_textarea');
    if (!$ta.length) return;
    const textarea = $ta[0] as AcuDiceTextareaElement;

    const normalizeTextareaContent = (text: unknown): string => {
      return String(text ?? '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/\n{2,}/g, '\n')
        .trim();
    };

    const readStoredActionText = (): string =>
      normalizeTextareaContent(textarea._acuOriginalActionText || $ta.data('acu-original-action-text') || '');
    const storeActionText = (actionText: string) => {
      const normalizedActionText = normalizeTextareaContent(actionText);
      if (!normalizedActionText) {
        $ta.removeData('acu-original-action-text');
        textarea._acuOriginalActionText = null;
        return;
      }
      $ta.data('acu-original-action-text', normalizedActionText);
      textarea._acuOriginalActionText = normalizedActionText;
    };

    const normalizedNewContent = normalizeTextareaContent(newContent);
    const currentVisibleVal = readTextareaVisibleValue(textarea);
    const currentVal = normalizeTextareaContent(syncTextareaDiceCacheFromVisibleText(textarea, currentVisibleVal));

    // 统一检定结果标签正则（匹配 <meta:检定结果>...</meta:检定结果>）
    const metaCheckResultRegex = createMetaCheckResultRegex();

    // 交互选项的识别正则（以<user>开头，匹配到句末标点）
    const actionRegex = /<user>(?:(?!<user>).)*?[。！？]/g;

    // 占位符识别正则
    const placeholderRegex = createDiceResultPlaceholderRegex();
    const actionSlot = '\u0001ACU_ACTION_SLOT\u0001';
    const diceSlot = '\u0000ACU_DICE_SLOT\u0000';
    const joinInlineParts = (parts: string[]): string => normalizeTextareaContent(parts.filter(Boolean).join(' '));
    const appendInlinePart = (text: string, part: string): string => joinInlineParts([text, part]);
    const normalizeSlotSpacing = (text: string): string => {
      let normalized = normalizeTextareaContent(text);
      [actionSlot, diceSlot].forEach(slot => {
        normalized = normalized.replace(new RegExp(`\\s*${escapeRegExpLiteral(slot)}\\s*`, 'g'), ` ${slot} `);
      });
      return normalizeTextareaContent(normalized);
    };
    const findStoredActionIndex = (text: string, actionText: string): number => {
      if (!actionText) return -1;
      const indexes: number[] = [];
      let searchFrom = 0;
      while (searchFrom <= text.length) {
        const index = text.indexOf(actionText, searchFrom);
        if (index < 0) break;
        indexes.push(index);
        searchFrom = index + Math.max(actionText.length, 1);
      }
      if (indexes.length === 0) return -1;
      const diceIndex = text.indexOf(diceSlot);
      if (diceIndex < 0) return indexes[indexes.length - 1];
      return indexes.reduce((best, index) => {
        const bestDistance = Math.abs(best + actionText.length - diceIndex);
        const distance = Math.abs(index + actionText.length - diceIndex);
        return distance < bestDistance ? index : best;
      }, indexes[0]);
    };

    // [修复] 如果配置启用隐藏，且是骰子结果，则使用占位符显示，但保存真实结果
    const diceCfg = getDiceConfig();
    const hideDiceResultFromUser = diceCfg.hideDiceResultFromUser === true;
    const overwriteLastDiceResult = diceCfg.overwriteLastDiceResult !== false;

    // 如果输入栏为空，直接填入
    if (!currentVal) {
      const finalDisplayVal =
        contentType === 'dice' && hideDiceResultFromUser ? '[投骰结果已隐藏]' : normalizedNewContent;
      setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, finalDisplayVal);
      if (contentType === 'action') {
        storeActionText(normalizedNewContent);
      } else {
        storeActionText('');
      }
      // [修复] 始终保存真实结果到 data 属性（即使不隐藏也要保存，以便后续处理）
      if (contentType === 'dice') {
        storeTextareaDiceCache(textarea, normalizedNewContent, normalizedNewContent);
      }
      return;
    }

    // 解析当前内容，分离三个部分
    let workingText = currentVal;
    let existingAction = '';
    let existingDiceBlocks: string[] = [];
    let hasActionSlot = false;
    let hasDiceSlot = false;

    // [修复] 0. 先检查是否有占位符（需要替换而不是添加）
    if (placeholderRegex.test(workingText)) {
      const originalText = readStoredLatestDiceText(textarea);
      if (originalText) {
        // 用原始文本替换占位符，以便后续处理
        workingText = workingText.replace(createDiceResultPlaceholderRegex(), originalText);
      } else {
        // 如果没有保存的原始文本，直接移除占位符
        workingText = workingText.replace(createDiceResultPlaceholderRegex(), '').trim();
      }
    }

    // 1. 提取 <meta:检定结果> 标签块（统一格式）
    const metaMatches = Array.from(workingText.matchAll(metaCheckResultRegex));
    if (metaMatches.length > 0) {
      const lastMetaMatch = metaMatches[metaMatches.length - 1];
      const lastMetaIndex = lastMetaMatch.index ?? 0;
      existingDiceBlocks = [lastMetaMatch[0]];
      workingText = normalizeSlotSpacing(
        `${workingText.slice(0, lastMetaIndex)} ${diceSlot} ${workingText.slice(lastMetaIndex + lastMetaMatch[0].length)}`,
      );
      hasDiceSlot = true;
      console.log(
        '[DICE]ACU SmartInsert Found and extracted meta check result:',
        existingDiceBlocks[existingDiceBlocks.length - 1].substring(0, 50) + '...',
      );
    }

    // 2. 提取交互选项
    const storedActionText = readStoredActionText();
    if (storedActionText) {
      const actionIndex = findStoredActionIndex(workingText, storedActionText);
      if (actionIndex >= 0) {
        existingAction = storedActionText;
        workingText = normalizeSlotSpacing(
          `${workingText.slice(0, actionIndex)} ${actionSlot} ${workingText.slice(actionIndex + storedActionText.length)}`,
        );
        hasActionSlot = true;
        console.log('[DICE]ACU SmartInsert Found stored action:', existingAction);
      }
    }

    const actionMatches = hasActionSlot ? [] : Array.from(workingText.matchAll(actionRegex));
    if (actionMatches.length > 0) {
      const lastActionMatch = actionMatches[actionMatches.length - 1];
      const lastActionIndex = lastActionMatch.index ?? 0;
      existingAction = lastActionMatch[0];
      workingText = normalizeSlotSpacing(
        `${workingText.slice(0, lastActionIndex)} ${actionSlot} ${workingText.slice(lastActionIndex + lastActionMatch[0].length)}`,
      );
      hasActionSlot = true;
      console.log('[DICE]ACU SmartInsert Found and extracted action:', existingAction);
    }

    // 3. 根据新内容类型，更新对应槽位。用户手写文本保留在原来的前后位置。
    let nextAction = existingAction;
    let diceSlotContent = joinInlineParts(existingDiceBlocks);
    if (contentType === 'dice') {
      diceSlotContent = overwriteLastDiceResult
        ? normalizedNewContent
        : joinInlineParts([...existingDiceBlocks, normalizedNewContent]);
      if (!hasDiceSlot) {
        workingText = appendInlinePart(workingText, normalizedNewContent);
      }
    } else if (contentType === 'action') {
      nextAction = normalizedNewContent;
      if (overwriteLastDiceResult && hasActionSlot) {
        workingText = workingText.replace(actionSlot, nextAction);
        hasActionSlot = false;
      } else {
        if (hasActionSlot) {
          workingText = workingText.replace(actionSlot, existingAction);
          hasActionSlot = false;
        }
        if (hasDiceSlot) {
          workingText = workingText.replace(diceSlot, joinInlineParts([nextAction, diceSlot]));
        } else {
          workingText = appendInlinePart(workingText, nextAction);
        }
      }
    }

    if (hasActionSlot) {
      workingText = workingText.replace(actionSlot, nextAction);
    }
    if (hasDiceSlot) {
      workingText = workingText.replace(diceSlot, diceSlotContent);
    }

    const finalRealVal = normalizeTextareaContent(workingText);
    const finalDisplayVal = hideDiceResultFromUser
      ? normalizeTextareaContent(finalRealVal.replace(metaCheckResultRegex, '[投骰结果已隐藏]'))
      : finalRealVal;
    setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, finalDisplayVal);
    storeActionText(nextAction);

    if (contentType === 'dice' || existingDiceBlocks.length > 0) {
      storeTextareaDiceCache(
        textarea,
        finalRealVal,
        contentType === 'dice' ? normalizedNewContent : existingDiceBlocks[existingDiceBlocks.length - 1],
      );
    }
  };

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

  const sendChatTextAndTrigger = async (messageText: string): Promise<'api' | 'slash' | 'composer' | null> => {
    const text = String(messageText ?? '').trim();
    if (!text) return null;

    let createChatMessagesFn = findRuntimeFunction('createChatMessages');
    if (createChatMessagesFn) {
      try {
        await createChatMessagesFn([{ role: 'user', message: text }], { refresh: 'affected' });
      } catch (err) {
        console.warn('[DICE]ACU createChatMessages 直接发送失败，尝试 Slash 发送', err);
        createChatMessagesFn = null;
      }

      if (createChatMessagesFn) {
        try {
          const triggered = await triggerGenerationAfterDirectSend();
          if (!triggered) console.warn('[DICE]ACU 已直接写入用户消息，但未找到 /trigger 入口');
        } catch (err) {
          console.warn('[DICE]ACU 消息已直接写入，但 /trigger 触发失败', err);
        }
        return 'api';
      }
    }

    let triggerSlashFn = findRuntimeFunction('triggerSlash');
    if (triggerSlashFn) {
      try {
        await triggerSlashFn(`/send raw=true ${quoteSlashArgument(text)}`);
      } catch (err) {
        console.warn('[DICE]ACU triggerSlash 发送失败，尝试 SillyTavern 原生接口', err);
        triggerSlashFn = null;
      }

      if (triggerSlashFn) {
        try {
          await triggerSlashFn('/trigger');
        } catch (err) {
          console.warn('[DICE]ACU triggerSlash 已发送消息，但 /trigger 触发失败', err);
        }
        return 'slash';
      }
    }

    const runSlash = findSillyTavernSlashRunner();
    if (runSlash) {
      try {
        const sendResult = await runSlash(`/send raw=true ${quoteSlashArgument(text)}`);
        if (!sendResult?.isError && !sendResult?.isAborted) {
          try {
            await runSlash('/trigger');
          } catch (triggerError) {
            console.warn('[DICE]ACU ST接口已发送消息，但 /trigger 触发失败', triggerError);
          }
          return 'slash';
        }
        console.warn('[DICE]ACU ST接口 send 失败:', sendResult);
      } catch (err) {
        console.warn('[DICE]ACU ST接口失败，尝试按钮模拟', err);
      }
    }

    return sendTextViaComposer(text);
  };

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
  const interceptTextareaValue = () => {
    const { $ } = getCore();
    const $ta = $('#send_textarea');
    if (!$ta.length) return;

    const textarea = $ta[0] as AcuDiceTextareaElement;
    if (!textarea || textarea._acuValueIntercepted) return;

    // 标记已拦截，避免重复拦截
    textarea._acuValueIntercepted = true;

    // 保存原始的 value 属性描述符
    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
    const originalValue = textarea.value;

    // 拦截 value 属性的 getter
    Object.defineProperty(textarea, 'value', {
      get: function (this: HTMLTextAreaElement) {
        // 先获取原始值
        let val: string;
        if (originalDescriptor && originalDescriptor.get) {
          val = originalDescriptor.get.call(this);
        } else {
          val = (this as AcuDiceTextareaElement & { _value?: string })._value || originalValue || '';
        }

        // [性能优化] 快速路径：如果没有骰子数据标记，直接返回
        // 使用 DOM 属性而非 jQuery data，避免每次 getter 都调用 jQuery
        // 解决输入 ) 等字符时卡顿的问题
        const acuTextarea = this as AcuDiceTextareaElement;
        if (!acuTextarea._acuHasDiceData) {
          return val;
        }

        // 检查是否有占位符需要替换，并保留用户在占位符前后继续输入的内容
        if (val && typeof val === 'string' && val.includes(DICE_RESULT_PLACEHOLDER)) {
          return resolveTextareaTextWithHiddenDice(acuTextarea, val);
        }
        return val;
      },
      set: function (this: HTMLTextAreaElement, val: string) {
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.call(this, val);
        } else {
          (this as AcuDiceTextareaElement & { _value?: string })._value = val;
        }
        scheduleViewportBoundsRefresh();
      },
      configurable: true,
    });
  };
  const STORAGE_KEY_TABLE_ORDER = 'acu_table_order';
  const STORAGE_KEY_ACTION_ORDER = 'acu_action_order';

  const STORAGE_KEY_ACTIVE_TAB = 'acu_active_tab';
  const STORAGE_KEY_UI_CONFIG = 'acu_ui_config_v19';
  const STORAGE_KEY_LAST_SNAPSHOT = 'acu_data_snapshot_v19';
  const STORAGE_KEY_IS_COLLAPSED = 'acu_ui_collapsed_state';
  const STORAGE_KEY_OPTIONS_COLLAPSED = 'acu_options_collapsed'; // [新增] 选项面板独立折叠状态
  const STORAGE_KEY_DASHBOARD_ACTIVE = 'acu_dashboard_active';
  const STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE = 'acu_global_interactions_panel_active';
  const STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS = 'acu_global_interaction_collapsed_sections_v1';
  const STORAGE_KEY_INVENTORY_FILTERS = 'acu_inventory_filters_v1';
  const STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED = 'acu_inventory_filters_collapsed_v1';
  const STORAGE_KEY_INVENTORY_METADATA = 'acu_inventory_metadata_v1';
  const STORAGE_KEY_GACHA_ACTIVE_POOL_TAG = 'acu_gacha_active_pool_tag_v1';
  // [新增] 移植功能所需的存储键
  const STORAGE_KEY_TABLE_HEIGHTS = 'acu_table_heights_v19';
  const STORAGE_KEY_TABLE_STYLES = 'acu_table_styles_v19';
  const STORAGE_KEY_HIDDEN_TABLES = 'acu_hidden_tables_v19';
  const STORAGE_KEY_GM_CONFIG = 'acu_gm_engine_config_v1';
  const STORAGE_KEY_REVERSE_TABLES = 'acu_reverse_tables_v1';
  const MAX_ACTION_BUTTONS = 6; // 活动栏最大按钮数
  const MIN_PANEL_HEIGHT = 200; // 面板最小高度
  const MAX_PANEL_HEIGHT = 1200; // 面板最大高度
  const PANEL_VIEWPORT_TOP_GUTTER = 32; // 手动拉高面板时保留顶部工具栏安全距

  const STORAGE_KEY_DICE_CONFIG = 'acu_dice_config_v1';
  const STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS = 'acu_custom_table_name_icons_v1';
  // [已拆分] 本段已移至 engine/preset-constants.ts（符号由文件顶部 import 提供）

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

  const STORAGE_KEY_AVATAR_MAP = 'acu_avatar_map_v1';
  const STORAGE_KEY_MAP_FOCUS = 'acu_map_focus_v1';
export {
  BookmarkManager,
  escapeHtml,
  REMOTE_IMAGE_ALLOWED_PROTOCOLS,
  INTERNAL_IMAGE_ALLOWED_PROTOCOLS,
  normalizeImageUrlInput,
  parseImageUrl,
  getRemoteImageUrlValidationError,
  isRemoteImageUrlValid,
  isRenderableImageUrlValid,
  normalizeStorableImageUrl,
  getImageUrlValidationMessage,
  escapeCssString,
  formatCssImageUrl,
  buildAvatarBackgroundStyle,
  DATA_VALIDATION_DEPRECATED_META,
  renderDeprecatedBadge,
  stripLoneSurrogates,
  safeEncodeURIComponent,
  safeDecodeURIComponent,
  setupOverlayClose,
  generateUniqueName,
  showPresetConflictDialog,
  DICE_RESULT_PLACEHOLDER,
  createMetaCheckResultRegex,
  createDiceResultPlaceholderRegex,
  notifyTextareaValueChanged,
  setTextareaValueAndNotify,
  readTextareaVisibleValue,
  extractMetaCheckResultBlocks,
  readStoredTextareaDiceText,
  readStoredLatestDiceText,
  composeTextareaTextWithHiddenDice,
  resolveTextareaTextWithHiddenDice,
  clearTextareaDiceCache,
  storeTextareaDiceCache,
  syncTextareaDiceCacheFromVisibleText,
  HUMAN_INPUT_TAG_BLOCK_PATTERNS,
  HUMAN_INPUT_ACTION_PATTERN,
  humanInputSendQueue,
  lastHumanInputSnapshot,
  lastHumanInputActivityAt,
  lastCapturedHumanInputSnapshot,
  lastHumanInputCaptureAt,
  GACHA_TEST_DEFAULT_FORTUNE,
  GACHA_SHARD_EXCHANGE_COST,
  STORAGE_KEY_GACHA_STATE,
  STORAGE_KEY_GACHA_SHARD_SHOP_RARITY,
  STORAGE_KEY_GACHA_POOL_SETTINGS,
  STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
  STORAGE_KEY_GACHA_ITEM_SETTINGS,
  GACHA_CATALOG_GLOBAL_SCOPE_KEY,
  GACHA_SHOP_UI_REFRESH_MS,
  GACHA_CATALOG_RAW_ROW_INDEX_PROP,
  normalizeTrackedText,
  escapeRegExpLiteral,
  stripKnownSystemActionText,
  extractExplicitHumanInputText,
  stripSystemInjectedContent,
  countUnicodeCharacters,
  markHumanInputActivity,
  capturePendingHumanInputSnapshot,
  consumePendingHumanInputSnapshot,
  bindHumanInputTracking,
  smartInsertToTextarea,
  getRuntimeWindowCandidates,
  findRuntimeFunction,
  findSillyTavernSlashRunner,
  quoteSlashArgument,
  triggerGenerationAfterDirectSend,
  getComposerTextarea,
  getResolvedComposerText,
  clearComposerIfCurrentText,
  findComposerSendButton,
  sendTextViaComposer,
  sendChatTextAndTrigger,
  restoreDiceResultBeforeSend,
  interceptTextareaValue,
  STORAGE_KEY_TABLE_ORDER,
  STORAGE_KEY_ACTION_ORDER,
  STORAGE_KEY_ACTIVE_TAB,
  STORAGE_KEY_UI_CONFIG,
  STORAGE_KEY_LAST_SNAPSHOT,
  STORAGE_KEY_IS_COLLAPSED,
  STORAGE_KEY_OPTIONS_COLLAPSED,
  STORAGE_KEY_DASHBOARD_ACTIVE,
  STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE,
  STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
  STORAGE_KEY_INVENTORY_FILTERS,
  STORAGE_KEY_INVENTORY_FILTERS_COLLAPSED,
  STORAGE_KEY_INVENTORY_METADATA,
  STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
  STORAGE_KEY_TABLE_HEIGHTS,
  STORAGE_KEY_TABLE_STYLES,
  STORAGE_KEY_HIDDEN_TABLES,
  STORAGE_KEY_GM_CONFIG,
  STORAGE_KEY_REVERSE_TABLES,
  MAX_ACTION_BUTTONS,
  MIN_PANEL_HEIGHT,
  MAX_PANEL_HEIGHT,
  PANEL_VIEWPORT_TOP_GUTTER,
  STORAGE_KEY_DICE_CONFIG,
  STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS,
  compareVersion,
  STORAGE_KEY_AVATAR_MAP,
  STORAGE_KEY_MAP_FOCUS,
}; // __wireBookmarkManagerDeps 已由头部 export function 导出
export type { ImageUrlValidationReason, AcuDiceTextareaElement };
