// @ts-nocheck
/**
 * part-01-dice.ts — part-01-theme.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（6）：核心隔离层, 基础样式, 正文头像渲染, 通用组件基类, 骰子面板专用样式, 主题变量定义
 */
export const STYLES_PART_01_THEME = `
    /* ========== 核心隔离层 ========== */
    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-edit-overlay,
    .acu-edit-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-cell-menu,
    .acu-cell-menu *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-dice-panel,
    .acu-dice-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-contest-panel,
    .acu-contest-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-relation-graph-overlay,
    .acu-relation-graph-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-avatar-manager-overlay,
    .acu-avatar-manager-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-preview-overlay,
    .acu-preview-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-gacha-overlay,
    .acu-gacha-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-inventory-overlay,
    .acu-inventory-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-config-backup-overlay,
    .acu-config-backup-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-embedded-options-container,
    .acu-embedded-options-container *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-dialogue-indent-root,
    .acu-dialogue-indent-root *:not(i[class*="fa-"]):not(i[class*="ti-"]) {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
    }
    /* ========== 基础样式 ========== */
    .acu-wrapper.acu-dice-ui-root,
    .acu-edit-overlay,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-gacha-overlay,
    .acu-inventory-overlay,
    .acu-inventory-detail-overlay,
    .acu-import-confirm-overlay,
    .acu-config-backup-overlay,
    .acu-embedded-options-container,
    .acu-dialogue-indent-root,
    .acu-cell-menu {
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: var(--acu-text-main);
        --acu-motion-fast: 160ms;
        --acu-motion-normal: 220ms;
        --acu-ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --acu-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
        --acu-focus-ring: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 34%, transparent);
        --acu-disabled-opacity: 0.48;
        --acu-state-warning-border: color-mix(in srgb, var(--acu-warning-icon) 58%, var(--acu-border));
        --acu-state-error-border: color-mix(in srgb, var(--acu-error-text) 58%, var(--acu-border));
        --acu-state-accent-border: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
    }

    .mes.acu-host-regenerate-hidden .swipeRightBlock,
    .mes.acu-host-regenerate-hidden .swipe_right {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }

    /* ========== 正文头像渲染 ========== */
    .acu-dialogue-indent-root {
        width: 100%;
        max-width: 100%;
        color: var(--acu-text-main);
        line-height: 1.68;
        overflow-wrap: anywhere;
        word-break: normal;
    }

    .acu-dialogue-indent-root > :first-child {
        margin-top: 0;
    }

    .acu-dialogue-indent-root > :last-child {
        margin-bottom: 0;
    }

    .acu-dialogue-aside {
        --acu-dialogue-character-color: var(--acu-accent);
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr);
        column-gap: 12px;
        align-items: start;
        max-width: 100%;
        margin: 0.82em 0;
    }

    .acu-dialogue-aside.is-continuation {
        margin-top: -0.16em;
    }

    .acu-dialogue-avatar,
    .acu-dialogue-avatar-spacer {
        width: 48px;
        min-width: 48px;
    }

    .acu-dialogue-avatar {
        aspect-ratio: 1;
        border-radius: 6px;
        background-image: var(--acu-dialogue-avatar-image, none);
        background-size: var(--acu-dialogue-avatar-scale, 150%);
        background-position: var(--acu-dialogue-avatar-x, 50%) var(--acu-dialogue-avatar-y, 50%);
        background-repeat: no-repeat;
        background-color: var(--acu-table-head);
        border: 1px solid color-mix(in srgb, var(--acu-dialogue-character-color) 34%, var(--acu-border));
        box-shadow:
            0 1px 0 color-mix(in srgb, var(--acu-card-bg) 78%, transparent),
            inset 0 0 0 1px color-mix(in srgb, var(--acu-dialogue-character-color) 18%, transparent);
        overflow: hidden;
        position: relative;
    }

    .acu-dialogue-body {
        min-width: 0;
        max-width: 100%;
    }

    .acu-dialogue-speaker {
        margin: 0 0 0.16em;
        color: var(--acu-text-main);
        font-size: 0.94em;
        font-weight: 650;
        line-height: 1.35;
        letter-spacing: 0;
    }

    .acu-dialogue-speaker-initial {
        display: inline-block;
        margin-right: 1px;
        color: var(--acu-dialogue-character-color);
        font-size: 1.28em;
        font-weight: 800;
        line-height: 0.9;
        letter-spacing: 0;
        vertical-align: -0.04em;
    }

    .acu-dialogue-quote {
        min-width: 0;
        padding-left: 12px;
        border-left: 1px solid color-mix(in srgb, var(--acu-dialogue-character-color) 46%, var(--acu-border));
        color: var(--acu-text-main);
        line-height: 1.72;
    }

    .acu-dialogue-aside.is-continuation .acu-dialogue-quote {
        border-left-color: color-mix(in srgb, var(--acu-dialogue-character-color) 24%, var(--acu-border));
    }

    @media (max-width: 600px) {
        .acu-dialogue-indent-root {
            line-height: 1.62;
        }

        .acu-dialogue-aside {
            grid-template-columns: 40px minmax(0, 1fr);
            column-gap: 9px;
            margin: 0.72em 0;
        }

        .acu-dialogue-avatar,
        .acu-dialogue-avatar-spacer {
            width: 38px;
            min-width: 38px;
        }

        .acu-dialogue-quote {
            padding-left: 10px;
            line-height: 1.66;
        }
    }

    /* 投骰面板统一样式 (需要 !important 覆盖 SillyTavern 全局样式和内联样式) */
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-dice-config-dialog {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-dice-panel input[type="text"],
    .acu-dice-panel input[type="number"],
    .acu-dice-panel input:not([type]),
    .acu-dice-panel select,
    .acu-contest-panel input[type="text"],
    .acu-contest-panel input[type="number"],
    .acu-contest-panel input:not([type]),
    .acu-contest-panel select,
    .acu-dice-config-dialog input[type="text"],
    .acu-dice-config-dialog input[type="number"],
    .acu-dice-config-dialog input:not([type]),
    .acu-dice-config-dialog select {
        width: 100%;
        text-align: center;
        padding: 6px;
        background: var(--acu-input-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 4px;
        color: var(--acu-input-text, var(--acu-text-main)) !important;
        font-size: 12px;
        height: 30px;
        line-height: 1;
        box-sizing: border-box;
    }
    /* select 需要额外处理以匹配 input 尺寸 */
    .acu-dice-panel select,
    .acu-contest-panel select,
    .acu-dice-config-dialog select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 0 6px;
        margin: 0;
        text-align-last: center;
        display: block;
    }
    /* 隐藏number类型输入框的步数器 */
    .acu-dice-panel input[type="number"]::-webkit-inner-spin-button,
    .acu-dice-panel input[type="number"]::-webkit-outer-spin-button,
    .acu-contest-panel input[type="number"]::-webkit-inner-spin-button,
    .acu-contest-panel input[type="number"]::-webkit-outer-spin-button,
    .acu-dice-config-dialog input[type="number"]::-webkit-inner-spin-button,
    .acu-dice-config-dialog input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .acu-dice-panel input[type="number"],
    .acu-contest-panel input[type="number"],
    .acu-dice-config-dialog input[type="number"] {
        -moz-appearance: textfield;
        text-align: center;
        box-sizing: border-box;
    }
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-dice-config-dialog input::placeholder {
        color: var(--acu-input-placeholder, var(--acu-text-sub)) !important;
        opacity: 0.7;
        text-align: center;
    }
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-dice-config-dialog input:focus,
    .acu-dice-config-dialog select:focus {
        outline: none;
        border-color: var(--acu-accent) !important;
    }
    .acu-dice-panel select option,
    .acu-contest-panel select option,
    .acu-dice-config-dialog select option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    /* 搜索框样式 */
    .acu-wrapper.acu-dice-ui-root .acu-search-input {
        background-color: var(--acu-input-bg) !important;
        color: var(--acu-text-main) !important;
        border: 1px solid var(--acu-border);
    }
    .acu-wrapper.acu-dice-ui-root .acu-search-input:focus {
        outline: none;
        border-color: var(--acu-accent);
        box-shadow: none !important;
    }
    .acu-wrapper.acu-dice-ui-root .acu-search-input::placeholder {
        color: var(--acu-text-sub) !important;
        opacity: 0.7;
    }
    /* ========== 通用组件基类 ========== */
    /* 按钮基类 */
    .acu-wrapper.acu-dice-ui-root button,
    .acu-edit-overlay button,
    .acu-dice-panel button,
    .acu-contest-panel button,
    .acu-relation-graph-overlay button,
    .acu-avatar-manager-overlay button,
    .acu-preview-overlay button,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn) {
        font-family: inherit;
        font-size: inherit;
        line-height: 1.4;
        cursor: pointer;
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard),
            transform var(--acu-motion-fast) var(--acu-ease-out);
        outline: none;
    }
    .acu-wrapper.acu-dice-ui-root button:hover,
    .acu-edit-overlay button:hover,
    .acu-dice-panel button:hover,
    .acu-contest-panel button:hover,
    .acu-relation-graph-overlay button:hover,
    .acu-avatar-manager-overlay button:hover,
    .acu-preview-overlay button:hover,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn):hover {
        background: var(--acu-btn-hover);
    }
    .acu-wrapper.acu-dice-ui-root button:focus,
    .acu-edit-overlay button:focus,
    .acu-dice-panel button:focus,
    .acu-contest-panel button:focus,
    .acu-relation-graph-overlay button:focus,
    .acu-avatar-manager-overlay button:focus,
    .acu-preview-overlay button:focus,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn):focus {
        outline: none;
        box-shadow: var(--acu-focus-ring);
    }
    .acu-wrapper.acu-dice-ui-root button:disabled,
    .acu-edit-overlay button:disabled,
    .acu-dice-panel button:disabled,
    .acu-contest-panel button:disabled,
    .acu-relation-graph-overlay button:disabled,
    .acu-avatar-manager-overlay button:disabled,
    .acu-preview-overlay button:disabled,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn):disabled,
    .acu-wrapper.acu-dice-ui-root button.disabled,
    .acu-edit-overlay button.disabled,
    .acu-dice-panel button.disabled,
    .acu-contest-panel button.disabled,
    .acu-relation-graph-overlay button.disabled,
    .acu-avatar-manager-overlay button.disabled,
    .acu-preview-overlay button.disabled,
    .acu-embedded-options-container button:not(.acu-opt-btn):not(.acu-check-suggestion-btn).disabled {
        opacity: var(--acu-disabled-opacity);
        cursor: not-allowed;
        pointer-events: none;
    }

    /* 输入框基类 */
    .acu-wrapper.acu-dice-ui-root input,
    .acu-wrapper.acu-dice-ui-root textarea,
    .acu-wrapper.acu-dice-ui-root select,
    .acu-edit-overlay input,
    .acu-edit-overlay textarea,
    .acu-edit-overlay select,
    .acu-dice-panel input,
    .acu-dice-panel select,
    .acu-contest-panel input,
    .acu-contest-panel select,
    .acu-avatar-manager-overlay input.acu-input {
        font-family: inherit;
        font-size: inherit;
        line-height: 1.4;
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        outline: none;
        transition: border-color 0.2s;
    }
    .acu-wrapper.acu-dice-ui-root input:focus,
    .acu-wrapper.acu-dice-ui-root textarea:focus,
    .acu-wrapper.acu-dice-ui-root select:focus,
    .acu-edit-overlay input:focus,
    .acu-edit-overlay textarea:focus,
    .acu-edit-overlay select:focus,
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-avatar-manager-overlay input.acu-input:focus {
        border-color: var(--acu-accent);
        box-shadow: none;
        outline: none;
    }
    .acu-wrapper.acu-dice-ui-root input::placeholder,
    .acu-wrapper.acu-dice-ui-root textarea::placeholder,
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-avatar-manager-overlay input.acu-input::placeholder {
        color: var(--acu-text-sub);
        opacity: 0.7;
    }

    .acu-inline-callout {
        padding: 10px 12px;
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        line-height: 1.5;
        font-size: 12px;
    }
    .acu-inline-callout-warning {
        color: var(--acu-warning-text);
        background: var(--acu-warning-bg);
        border-color: var(--acu-state-warning-border);
    }
    .acu-inline-callout i {
        margin-right: 6px;
    }

    /* 确保重要人物表（卡片）和 MVU 面板中的输入框始终有高对比度 */
    .acu-wrapper.acu-dice-ui-root .acu-data-card input,
    .acu-wrapper.acu-dice-ui-root .acu-data-card textarea,
    .acu-preview-overlay .acu-data-card input,
    .acu-preview-overlay .acu-data-card textarea,
    .acu-mvu-panel input,
    .acu-mvu-panel textarea {
        color: var(--SillyTavern-text-color, #e0e0e0) !important;
        background-color: var(--SillyTavern-bar-color, #0b0b0b) !important;
    }
    .acu-wrapper.acu-dice-ui-root .acu-data-card input::placeholder,
    .acu-wrapper.acu-dice-ui-root .acu-data-card textarea::placeholder,
    .acu-preview-overlay .acu-data-card input::placeholder,
    .acu-preview-overlay .acu-data-card textarea::placeholder,
    .acu-mvu-panel input::placeholder,
    .acu-mvu-panel textarea::placeholder {
        color: var(--SillyTavern-text-color, #e0e0e0) !important;
        opacity: 0.7 !important;
    }

    /* 弹窗遮罩层基类 */
    .acu-edit-overlay,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-import-confirm-overlay,
    .acu-crop-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        background: rgba(0,0,0,0.6);
        z-index: 31010;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        backdrop-filter: blur(2px);
    }
    /* 骰子面板遮罩层 - 需要在 preview-overlay(31100) 之上，属于编辑层(31200) */
    .acu-dice-overlay,
    .acu-contest-overlay,
    .acu-dice-config-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        background: rgba(0,0,0,0.6);
        z-index: 31200 !important;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        backdrop-filter: blur(2px);
    }

    /* 弹窗容器基类 */
    .acu-edit-dialog,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-container,
    .acu-avatar-manager,
    .acu-import-confirm-dialog,
    .acu-dice-config-dialog {
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    /* ========== 骰子面板专用样式 ========== */
    /* 骰子面板 - 属于编辑层(31200+)，需要在 preview-overlay(31100) 之上 */
    .acu-dice-panel,
    .acu-contest-panel {
        position: relative;
        z-index: 31201 !important;
        width: 340px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        max-height: calc(100dvh - 32px);
    }
    .acu-dice-panel-header {
        padding: 12px 15px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .acu-dice-panel-title {
        font-size: 15px;
        font-weight: bold;
        color: var(--acu-accent);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .acu-dice-panel-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .acu-dice-panel-actions button {
        background: none;
        border: 1px solid transparent;
        border-radius: 6px;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 14px;
        width: 28px;
        height: 28px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-panel-actions button:hover,
    .acu-dice-panel-actions button:focus-visible {
        background: var(--acu-btn-bg);
        color: var(--acu-accent);
        border-color: var(--acu-border);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-panel-body {
        padding: 15px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }
    .acu-dice-presets {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 12px;
        align-items: center;
    }
    /* 预设快捷按钮区 */
    .acu-dice-quick-presets {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
        align-items: center;
        max-height: 72px; /* 约两行高度: (28px + 8px) * 2 */
        overflow-y: auto;
        overflow-x: hidden;
    }

    .acu-dice-return-btn {
        width: 100%;
        padding: 8px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-accent);
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-return-btn:hover,
    .acu-dice-return-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-return-btn i {
        font-size: 14px;
    }
    .acu-dice-quick-preset-btn {
        padding: 2px 8px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-text-main);
        font-size: 10px;
        cursor: pointer;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1.4;
        user-select: none;
    }
    .acu-dice-quick-preset-btn:hover:not(.active),
    .acu-dice-quick-preset-btn:focus-visible:not(.active) {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-quick-preset-btn.active,
    .acu-dice-quick-preset-btn.active:hover {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
        font-weight: 500;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-accent) 70%, transparent);
    }
    .acu-dice-quick-preset-btn.active:hover,
    .acu-dice-quick-preset-btn.active:focus-visible {
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-form-row {
        display: grid;
        gap: 6px;
        margin-bottom: 6px;
    }
    .acu-dice-form-row.cols-2 { grid-template-columns: 1fr 1fr; }
    .acu-dice-form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .acu-dice-form-label {
        font-size: 10px;
        color: var(--acu-text-sub);
        margin-bottom: 2px;
        min-height: 18px;
        display: flex;
        align-items: center;
    }
    .acu-dice-form-label.center { justify-content: center; }
    /* Section Title (Party A/B, Quick Select) */
    .acu-dice-section-title {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 6px;
        min-height: 24px;
    }
    .acu-dice-section-title > span {
        font-size: 12px;
        font-weight: bold;
        color: var(--acu-accent);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
    }
    .acu-dice-preset-quick-actions {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 6px;
    }
    .acu-dice-preset-action-btn {
        width: 20px;
        height: 20px;
        padding: 0;
        border-radius: 4px;
        border: 1px solid var(--acu-border);
        background: var(--acu-btn-bg);
        color: var(--acu-accent);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-preset-action-btn:hover,
    .acu-dice-preset-action-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-preset-action-btn i {
        font-size: 10px;
    }
    .acu-dice-preset-action-btn.disabled {
        opacity: 0.6;
        cursor: default;
    }
    .acu-dice-quick-section {
        margin-bottom: 10px;
    }
    .acu-dice-quick-title {
        font-size: 10px;
        color: var(--acu-text-sub);
        font-weight: bold;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acu-dice-quick-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-height: 60px;
        overflow-y: auto;
    }
    .acu-dice-quick-inline {
        display: flex;
        gap: 4px;
        margin-left: 0;
        margin-top: 4px;
        flex: 1 1 100%;
        align-content: flex-start;
        min-width: 0;
        max-width: 100%;
        max-height: 63px;
        overflow-x: hidden;
        overflow-y: auto;
        white-space: normal;
        align-items: flex-start;
        flex-wrap: wrap;
        -webkit-overflow-scrolling: touch;
    }
    .acu-dice-quick-inline::-webkit-scrollbar { width: 6px; }
    .acu-dice-quick-compact {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        margin-bottom: 8px;
        max-height: 63px;
        overflow-y: auto;
        align-content: flex-start;
    }
    .acu-dice-panel .acu-dice-char-btn,
    .acu-contest-panel .acu-dice-char-btn,
    .acu-dice-panel .acu-dice-attr-btn,
    .acu-contest-panel .acu-dice-attr-btn,
    .acu-dice-panel .acu-dice-gen-attr-btn,
    .acu-dice-panel .acu-dice-clear-attr-btn,
    .acu-contest-panel .acu-contest-attr-btn,
    .acu-contest-panel .acu-contest-gen-attr-btn,
    .acu-contest-panel .acu-contest-clear-attr-btn {
        padding: 1px 5px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-text-main);
        font-size: 11px;
        cursor: pointer;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        white-space: nowrap;
        flex-shrink: 0;
        line-height: 1.3;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }
    /* [修复] 覆盖酒馆全局触控优化样式 - 防止移动端按钮被强制放大 */
    /* 酒馆全局规则: @media (hover: none) and (pointer: coarse) { button { min-width: 44px; min-height: 44px; } } */
    /* 使用通配符一次性禁用所有骰子系统容器内的按钮，避免逐个添加 */
    @media (hover: none) and (pointer: coarse) {
        .acu-wrapper.acu-dice-ui-root button,
        .acu-wrapper.acu-dice-ui-root button[class],
        .acu-edit-overlay button,
        .acu-edit-overlay button[class],
        .acu-dice-panel button,
        .acu-dice-panel button[class],
        .acu-contest-panel button,
        .acu-contest-panel button[class],
        .acu-preview-overlay button,
        .acu-preview-overlay button[class],
        .acu-gacha-overlay button,
        .acu-gacha-overlay button[class],
        .acu-inventory-overlay button,
        .acu-inventory-overlay button[class],
        .acu-inventory-detail-overlay button,
        .acu-inventory-detail-overlay button[class],
        .acu-import-confirm-overlay button,
        .acu-import-confirm-overlay button[class],
        .acu-embedded-options-container button,
        .acu-embedded-options-container button[class] {
            min-width: unset !important;
            min-height: unset !important;
        }
    }
    .acu-dice-panel .acu-dice-char-btn:hover,
    .acu-contest-panel .acu-dice-char-btn:hover,
    .acu-dice-panel .acu-dice-attr-btn:hover,
    .acu-contest-panel .acu-dice-attr-btn:hover,
    .acu-dice-panel .acu-dice-gen-attr-btn:hover,
    .acu-dice-panel .acu-dice-clear-attr-btn:hover,
    .acu-contest-panel .acu-contest-attr-btn:hover,
    .acu-contest-panel .acu-contest-gen-attr-btn:hover,
    .acu-contest-panel .acu-contest-clear-attr-btn:hover,
    .acu-dice-panel .acu-dice-char-btn:focus-visible,
    .acu-contest-panel .acu-dice-char-btn:focus-visible,
    .acu-dice-panel .acu-dice-attr-btn:focus-visible,
    .acu-contest-panel .acu-dice-attr-btn:focus-visible,
    .acu-dice-panel .acu-dice-gen-attr-btn:focus-visible,
    .acu-dice-panel .acu-dice-clear-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-gen-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-clear-attr-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-panel .acu-dice-char-btn.active,
    .acu-contest-panel .acu-dice-char-btn.active,
    .acu-dice-panel .acu-dice-attr-btn.active,
    .acu-contest-panel .acu-dice-attr-btn.active {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
    }
    .acu-dice-roll-btn {
        width: 100%;
        padding: 12px;
        background: var(--acu-accent);
        border: 1px solid var(--acu-accent);
        border-radius: 8px;
        color: var(--acu-button-text-on-accent, var(--acu-btn-active-text));
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-roll-btn:hover,
    .acu-dice-roll-btn:focus-visible {
        background: var(--acu-btn-active-bg, var(--acu-accent));
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent));
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-random-skill-btn {
        width: 18px;
        height: 18px;
        padding: 0;
        background: transparent;
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-accent);
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-random-skill-btn:hover,
    .acu-random-skill-btn:focus-visible {
        background: var(--acu-btn-hover);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }

    .acu-dice-history-dialog { max-width: 600px; width: min(94vw, 600px); max-height: 82vh; display: flex; flex-direction: column; padding: 14px; }
    .acu-dice-history-header,
    .acu-history-main,
    .acu-history-title-row,
    .acu-history-meta,
    .acu-history-side,
    .acu-history-footer,
    .acu-history-stats-summary,
    .acu-history-stats-values { display: flex; }
    .acu-dice-history-header { justify-content: space-between; align-items: center; gap: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
    .acu-dice-history-header h3 { margin: 0; font-size: 19px; color: var(--acu-text-main); font-weight: 700; display: flex; align-items: center; gap: 8px; min-width: 0; }
    .acu-dice-history-header h3 i { color: var(--acu-accent); }
    .acu-dice-history-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
    .acu-dice-history-filters { --acu-history-filter-height: 40px; display: grid; grid-template-columns: minmax(92px, 0.75fr) minmax(104px, 0.85fr) minmax(120px, 1.4fr); gap: 6px; margin-top: 8px; align-items: stretch; }
    .acu-history-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .acu-dice-history-filters select,
    .acu-dice-history-filters input { width: 100%; min-width: 0; }
    .acu-dice-history-dialog .acu-dice-history-filters select.acu-dice-select,
    .acu-dice-history-search,
    .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input { height: var(--acu-history-filter-height) !important; }
    .acu-dice-history-search { position: relative; min-width: 0; }
    .acu-dice-history-search i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--acu-text-sub); pointer-events: none; }
    .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input { padding-left: 30px !important; }
    .acu-dice-history-stats { margin-top: 6px; padding: 8px; border: 1px solid var(--acu-border); border-radius: 8px; background: var(--acu-card-bg); }
    .acu-history-stats-grid { margin-bottom: 6px; }
    .acu-history-stat-card { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border: 1px solid var(--acu-border); border-radius: 6px; min-width: 0; }
    .acu-history-stat-card small { display: block; font-size: 11px; line-height: 1.2; color: var(--acu-text-sub); white-space: nowrap; }
    .acu-history-stat-card strong { display: block; font-size: 16px; line-height: 1.1; font-weight: 700; color: var(--acu-text-main); }
    .acu-history-stats-summary { justify-content: space-between; align-items: center; gap: 6px 10px; flex-wrap: wrap; font-size: 12px; line-height: 1.35; }
    .acu-history-stats-summary > span,
    .acu-history-scope-note,
    .acu-history-roll,
    .acu-history-time { color: var(--acu-text-sub); }
    .acu-history-stats-summary > span { flex: 0 0 auto; }
    .acu-history-stats-values { gap: 10px; flex-wrap: wrap; min-width: 0; }
    .acu-history-stats-values span { color: var(--acu-text-main); }
    .acu-history-stats-values b.is-success { color: var(--acu-success-text); }
    .acu-history-scope-note { margin-top: 6px; font-size: 11px; }
    .acu-dice-history-list { margin-top: 8px; overflow-y: auto; flex: 1; min-height: 220px; max-height: 52vh; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; touch-action: pan-y; }
    .acu-history-item { padding: 10px 12px; border: 1px solid var(--acu-border); border-radius: 8px; margin-bottom: 8px; background: var(--acu-bg-panel); }
    .acu-history-main { justify-content: space-between; align-items: flex-start; gap: 8px; }
    .acu-history-primary { min-width: 0; flex: 1; }
    .acu-history-title-row { align-items: center; gap: 6px; min-width: 0; }
    .acu-history-tag,
    .acu-history-status { border: 1px solid var(--acu-border); border-radius: 999px; padding: 1px 7px; font-size: 11px; }
    .acu-history-tag { color: var(--acu-text-sub); flex-shrink: 0; font-size: 10px; }
    .acu-history-title { font-weight: 700; color: var(--acu-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
    .acu-history-pushed-icon { font-size: 10px; color: var(--acu-text-sub); margin-left: 4px; }
    .acu-history-meta { margin-top: 6px; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; }
    .acu-history-result { color: var(--acu-history-result-color, var(--acu-text-main)); font-weight: 700; }
    .acu-history-roll,
    .acu-history-detail { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .acu-history-status { color: var(--acu-history-status-color, var(--acu-text-sub)); border-color: color-mix(in srgb, var(--acu-history-status-color, var(--acu-text-sub)) 40%, transparent); }
    .acu-history-side { align-items: center; gap: 5px; flex-shrink: 0; }
    .acu-history-time { font-size: 12px; }
    .acu-history-icon-btn { border: 1px solid transparent; background: transparent; color: var(--acu-text-sub); border-radius: 6px; cursor: pointer; width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
    .acu-history-detail-copy { background: var(--acu-btn-bg); border-color: var(--acu-border); }
    .acu-history-icon-btn:hover,
    .acu-history-icon-btn:focus-visible { background: var(--acu-btn-hover); color: var(--acu-accent); border-color: var(--acu-border); box-shadow: var(--acu-focus-ring); outline: none; }
    .acu-history-detail { margin-top: 8px; padding: 9px 10px; background: color-mix(in srgb, var(--acu-card-bg) 72%, transparent); border: 1px solid var(--acu-border); border-radius: 6px; font-size: 11px; line-height: 1.5; color: var(--acu-text-sub); white-space: pre-wrap; }
    .acu-history-detail strong { display: block; font-weight: 700; color: var(--acu-text-main); margin-bottom: 4px; }
    .acu-history-detail hr { border: 0; border-top: 1px solid var(--acu-border); margin: 7px 0; }
    .acu-history-footer { justify-content: space-between; gap: 8px; padding-top: 10px; border-top: 1px solid var(--acu-border); margin-top: 8px; flex-wrap: wrap; }
    @media (max-width: 640px) {
        .acu-dice-history-dialog {
            width: calc(100vw - 20px);
            max-height: calc(100dvh - 24px);
            padding: 12px;
        }
        .acu-dice-history-header h3 {
            font-size: 16px;
        }
        .acu-dice-history-filters {
            --acu-history-filter-height: 34px;
            grid-template-columns: minmax(78px, 0.75fr) minmax(88px, 0.85fr) minmax(86px, 1fr);
            gap: 6px;
            margin-top: 8px;
        }
        .acu-dice-history-filters select,
        .acu-dice-history-filters input {
            font-size: 12px;
        }
        .acu-dice-history-search i {
            left: 9px;
        }
        .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input {
            padding-left: 27px !important;
        }
        .acu-history-stat-card {
            padding: 5px 6px;
            gap: 4px;
        }
        .acu-history-stat-card small {
            font-size: 10px;
        }
        .acu-history-stat-card strong {
            font-size: 15px;
        }
        .acu-history-stats-summary {
            align-items: stretch;
            font-size: 11px;
        }
        .acu-history-stats-summary > span {
            width: 100%;
        }
        .acu-history-stats-values {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            width: 100%;
            gap: 4px;
        }
        .acu-history-stats-values span {
            min-width: 0;
            white-space: nowrap;
        }
        .acu-history-main {
            flex-direction: column;
        }
        .acu-history-side {
            width: 100%;
            justify-content: space-between;
        }
        .acu-history-footer {
            justify-content: stretch;
        }
        .acu-history-footer .acu-dialog-btn {
            flex: 1;
        }
    }
    @media (max-width: 360px) {
        .acu-history-stats-values {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    /* 弹窗头部基类 - 统一使用 .acu-panel-header */
    .acu-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        flex-shrink: 0;
    }

    /* 关闭按钮基类 - 所有关闭按钮统一使用 .acu-close-btn */
    .acu-close-btn {
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .acu-close-btn:hover {
        background: none !important;
        color: var(--acu-accent);
    }

    /* 滚动条默认隐藏仅限骰子前端自身，避免影响数据库本体 */
    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *,
    .acu-edit-overlay,
    .acu-edit-overlay *,
    .acu-dice-panel,
    .acu-dice-panel *,
    .acu-contest-panel,
    .acu-contest-panel *,
    .acu-preview-overlay,
    .acu-preview-overlay *,
    .acu-gacha-overlay,
    .acu-gacha-overlay *,
    .acu-inventory-overlay,
    .acu-inventory-overlay *,
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *,
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *,
    .acu-embedded-options-container,
    .acu-embedded-options-container * {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .acu-wrapper.acu-dice-ui-root *::-webkit-scrollbar,
    .acu-edit-overlay *::-webkit-scrollbar,
    .acu-dice-panel *::-webkit-scrollbar,
    .acu-contest-panel *::-webkit-scrollbar,
    .acu-preview-overlay *::-webkit-scrollbar,
    .acu-gacha-overlay *::-webkit-scrollbar,
    .acu-inventory-overlay *::-webkit-scrollbar,
    .acu-inventory-detail-overlay *::-webkit-scrollbar,
    .acu-import-confirm-overlay *::-webkit-scrollbar,
    .acu-embedded-options-container *::-webkit-scrollbar {
        display: none !important;
    }

    /* ========== 主题变量定义 ========== */
    /* 主题维护提示：这里是骰子系统主题色源头。修改或新增 .acu-theme-* 时，
       需要同步检查 外部参考/数据库主题/acu-db-theme-dice-<theme-id>.json 的变量映射和 previewColors。
       渐变主题在数据库主题变量里要保留纯色兜底，渐变只放到支持 background-image 的位置。 */
    .acu-theme-native {
        --acu-native-blur-bg: rgb(from var(--SmartThemeBlurTintColor, #191919) r g b / 1);
        --acu-native-chat-bg: rgb(from var(--SmartThemeChatTintColor, #191919) r g b / 1);
        --acu-native-bot-bg: rgb(from var(--SmartThemeBotMesBlurTintColor, #303030) r g b / 1);
        --acu-native-user-bg: rgb(from var(--SmartThemeUserMesBlurTintColor, #383838) r g b / 1);
        --acu-bg-nav: var(--acu-native-blur-bg);
        --acu-bg-panel: var(--acu-native-blur-bg);
        --acu-bg-main: var(--acu-native-chat-bg);
        --acu-bg-hover: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-border: var(--SmartThemeBorderColor, rgba(128,128,128,0.35));
        --acu-text-main: var(--SmartThemeBodyColor, #ddd);
        --acu-text-sub: var(--SmartThemeEmColor, var(--SmartThemeQuoteColor, #aaa));
        --acu-btn-bg: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-btn-hover: color-mix(in srgb, var(--acu-native-user-bg) 82%, var(--acu-text-main) 18%);
        --acu-btn-active-bg: var(--SmartThemeQuoteColor, var(--SmartThemeBodyColor, #8ad));
        --acu-btn-active-text: rgb(from var(--SmartThemeChatTintColor, #111) r g b / 1);
        --acu-accent: var(--SmartThemeQuoteColor, var(--SmartThemeBodyColor, #8ad));
        --acu-accent-rgb: 128,128,128;
        --acu-table-head: color-mix(in srgb, var(--acu-native-blur-bg) 94%, var(--acu-text-main) 6%);
        --acu-table-hover: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-opt-hover: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-opt-bg: color-mix(in srgb, var(--acu-native-chat-bg) 92%, var(--acu-text-main) 8%);
        --acu-shadow: var(--SmartThemeShadowColor, rgba(0,0,0,0.35));
        --acu-card-bg: var(--acu-native-chat-bg);
        --acu-badge-bg: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-menu-bg: var(--acu-native-blur-bg);
        --acu-menu-text: var(--SmartThemeBodyColor, #ddd);
        --acu-success-text: #4cd964;
        --acu-success-bg: rgba(76,217,100,0.18);
        --acu-scrollbar-track: var(--acu-native-chat-bg);
        --acu-scrollbar-thumb: var(--SmartThemeBorderColor, rgba(128,128,128,0.45));
        --acu-input-bg: color-mix(in srgb, var(--acu-native-chat-bg) 94%, var(--acu-text-main) 6%);
        --acu-hl-manual: var(--SmartThemeQuoteColor, #f0ad4e);
        --acu-hl-manual-bg: rgba(240,173,78,0.16);
        --acu-hl-diff: var(--SmartThemeEmColor, #5bc0de);
        --acu-hl-diff-bg: rgba(91,192,222,0.16);
        --acu-error-text: #ff6b6b;
        --acu-error-bg: rgba(255,107,107,0.18);
        --acu-error-border: rgba(255,107,107,0.45);
        --acu-warning-icon: #ffa726;
        --acu-warning-text: #ffa726;
        --acu-warning-bg: rgba(255,167,38,0.18);
        --acu-overlay-bg: var(--acu-native-blur-bg);
        --acu-overlay-bg-light: var(--acu-native-blur-bg);
        --acu-shadow-bg: rgba(0,0,0,0.4);
        --acu-light-bg: rgba(255,255,255,0.06);
        --acu-very-light-bg: rgba(255,255,255,0.025);
        --acu-button-text: var(--SmartThemeBodyColor, #ddd);
        --acu-gray-bg: rgba(128,128,128,0.12);
        --acu-button-text-on-accent: rgb(from var(--SmartThemeChatTintColor, #111) r g b / 1);
    }
    .acu-theme-native.acu-edit-overlay,
    .acu-theme-native.acu-dice-overlay,
    .acu-theme-native.acu-contest-overlay,
    .acu-theme-native.acu-dice-config-overlay,
    .acu-theme-native.acu-avatar-manager-overlay,
    .acu-theme-native.acu-preview-overlay,
    .acu-theme-native.acu-import-confirm-overlay,
    .acu-theme-native.acu-crop-modal-overlay,
    .acu-theme-native.acu-relation-graph-overlay,
    .acu-theme-native.acu-map-overlay,
    .acu-theme-native.acu-delete-confirm-overlay,
    .acu-theme-native.acu-favorites-overlay,
    .acu-theme-native.acu-fav-edit-overlay,
    .acu-theme-native.acu-fav-new-overlay,
    .acu-theme-native.acu-fav-send-overlay,
    .acu-theme-native.acu-fav-tag-overlay,
    .acu-theme-native.acu-inventory-overlay,
    .acu-theme-native.acu-gacha-overlay,
    .acu-theme-native.acu-gacha-shard-confirm-overlay,
    .acu-theme-native.acu-inventory-detail-overlay,
    .acu-dice-overlay:has(.acu-theme-native),
    .acu-contest-overlay:has(.acu-theme-native),
    .acu-dice-config-overlay:has(.acu-theme-native),
    .acu-favorites-overlay:has(.acu-theme-native),
    .acu-fav-edit-overlay:has(.acu-theme-native),
    .acu-fav-new-overlay:has(.acu-theme-native),
    .acu-fav-send-overlay:has(.acu-theme-native),
    .acu-fav-tag-overlay:has(.acu-theme-native),
    .acu-theme-native .acu-options-panel {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        filter: none !important;
    }
    .acu-theme-native.acu-edit-dialog,
    .acu-theme-native .acu-edit-dialog,
    .acu-theme-native.acu-dice-panel,
    .acu-theme-native .acu-dice-panel,
    .acu-theme-native.acu-contest-panel,
    .acu-theme-native .acu-contest-panel,
    .acu-theme-native.acu-dice-config-dialog,
    .acu-theme-native .acu-dice-config-dialog,
    .acu-theme-native .acu-data-display,
    .acu-theme-native .acu-options-panel,
    .acu-theme-native .acu-option-panel,
    .acu-theme-native .acu-embedded-options-container,
    .acu-theme-native .acu-inventory-shell,
    .acu-theme-native .acu-inventory-detail,
    .acu-theme-native .acu-gacha-shell,
    .acu-preview-overlay:has(.acu-theme-native) .acu-data-card,
    .acu-wrapper.acu-dice-ui-root.acu-theme-native .acu-data-card {
        background: var(--acu-bg-panel) !important;
        background-color: var(--acu-bg-panel) !important;
    }
    .acu-theme-native .acu-data-card,
    .acu-theme-native.acu-data-card,
    .acu-theme-native .acu-cell-menu {
        background: var(--acu-card-bg) !important;
        background-color: var(--acu-card-bg) !important;
    }
    .acu-theme-retro { --acu-bg-nav: #e6e2d3; --acu-bg-panel: #e6e2d3; --acu-border: #dcd0c0; --acu-text-main: #5e4b35; --acu-text-sub: #999; --acu-btn-bg: #dcd0c0; --acu-btn-hover: #cbbba8; --acu-btn-active-bg: #8d7b6f; --acu-btn-active-text: #fdfaf5; --acu-accent: #7a695f; --acu-table-head: #efebe4; --acu-table-hover: #f0ebe0; --acu-opt-hover: #f7f3ed; --acu-opt-bg: #fffef9; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #fffef9; --acu-badge-bg: #efebe4; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #27ae60; --acu-success-bg: rgba(39, 174, 96, 0.15); --acu-scrollbar-track: #e6e2d3; --acu-scrollbar-thumb: #cbbba8; --acu-input-bg: #f5f2eb;--acu-hl-manual: #d35400; --acu-hl-manual-bg: rgba(211, 84, 0, 0.15); --acu-hl-diff: #2980b9; --acu-hl-diff-bg: rgba(41, 128, 185, 0.15); --acu-error-text: #e74c3c; --acu-error-bg: rgba(231, 76, 60, 0.15); --acu-error-border: rgba(231, 76, 60, 0.5); --acu-warning-icon: #e67e22; --acu-warning-text: #f39c12; --acu-warning-bg: rgba(243, 156, 18, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #5e4b35; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-dark { --acu-bg-nav: #2b2b2b; --acu-bg-panel: #252525; --acu-border: #444; --acu-text-main: #eee; --acu-text-sub: #aaa; --acu-btn-bg: #3a3a3a; --acu-btn-hover: #4a4a4a; --acu-btn-active-bg: #6a5acd; --acu-btn-active-text: #fff; --acu-accent: #9b8cd9; --acu-table-head: #333333; --acu-table-hover: #3a3a3a; --acu-opt-hover: rgba(255, 255, 255, 0.1); --acu-opt-bg: rgba(255, 255, 255, 0.05); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #2d3035; --acu-badge-bg: #3a3f4b; --acu-menu-bg: #333; --acu-menu-text: #eee; --acu-success-text: #4cd964; --acu-success-bg: rgba(76, 217, 100, 0.2); --acu-scrollbar-track: #2b2b2b; --acu-scrollbar-thumb: #555; --acu-hl-manual: #ff6b81; --acu-hl-manual-bg: rgba(255, 107, 129, 0.2); --acu-hl-diff: #00d2d3; --acu-hl-diff-bg: rgba(0, 210, 211, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-overlay-bg: rgba(0,0,0,0.75); --acu-overlay-bg-light: rgba(0,0,0,0.65); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255,255,255,0.05); --acu-very-light-bg: rgba(255,255,255,0.02); --acu-button-text: #fff; --acu-gray-bg: rgba(255,255,255,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-modern { --acu-bg-nav: #ffffff; --acu-bg-panel: #f8f9fa; --acu-border: #e0e0e0; --acu-text-main: #333; --acu-text-sub: #666; --acu-btn-bg: #f1f3f5; --acu-btn-hover: #e9ecef; --acu-btn-active-bg: #007bff; --acu-btn-active-text: #fff; --acu-accent: #007bff; --acu-table-head: #f8f9fa; --acu-table-hover: #f1f3f5; --acu-opt-hover: #f1f3f5; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #f1f3f5; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #28a745; --acu-success-bg: rgba(40, 167, 69, 0.15); --acu-scrollbar-track: #fff; --acu-scrollbar-thumb: #ccc; --acu-hl-manual: #fd7e14; --acu-hl-manual-bg: rgba(253, 126, 20, 0.15); --acu-hl-diff: #0d6efd; --acu-hl-diff-bg: rgba(13, 110, 253, 0.15); --acu-error-text: #dc3545; --acu-error-bg: rgba(220, 53, 69, 0.15); --acu-error-border: rgba(220, 53, 69, 0.5); --acu-warning-icon: #fd7e14; --acu-warning-text: #ffc107; --acu-warning-bg: rgba(255, 193, 7, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #333; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-forest { --acu-bg-nav: #e8f5e9; --acu-bg-panel: #e8f5e9; --acu-border: #c8e6c9; --acu-text-main: #2e7d32; --acu-text-sub: #81c784; --acu-btn-bg: #c8e6c9; --acu-btn-hover: #a5d6a7; --acu-btn-active-bg: #43a047; --acu-btn-active-text: #fff; --acu-accent: #4caf50; --acu-table-head: #dcedc8; --acu-table-hover: #f1f8e9; --acu-opt-hover: #f1f8e9; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #dcedc8; --acu-menu-bg: #fff; --acu-menu-text: #2e7d32; --acu-success-text: #2e7d32; --acu-success-bg: rgba(46, 125, 50, 0.2); --acu-scrollbar-track: #e8f5e9; --acu-scrollbar-thumb: #a5d6a7; --acu-hl-manual: #e67e22; --acu-hl-manual-bg: rgba(230, 126, 34, 0.15); --acu-hl-diff: #1e8449; --acu-hl-diff-bg: rgba(30, 132, 73, 0.2); --acu-error-text: #c0392b; --acu-error-bg: rgba(192, 57, 43, 0.15); --acu-error-border: rgba(192, 57, 43, 0.5); --acu-warning-icon: #e67e22; --acu-warning-text: #e67e22; --acu-warning-bg: rgba(230, 126, 34, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(76, 175, 80, 0.1); --acu-very-light-bg: rgba(76, 175, 80, 0.02); --acu-button-text: #2e7d32; --acu-gray-bg: rgba(76, 175, 80, 0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-ocean { --acu-bg-nav: #e3f2fd; --acu-bg-panel: #e3f2fd; --acu-border: #90caf9; --acu-text-main: #1565c0; --acu-text-sub: #64b5f6; --acu-btn-bg: #bbdefb; --acu-btn-hover: #90caf9; --acu-btn-active-bg: #1976d2; --acu-btn-active-text: #fff; --acu-accent: #2196f3; --acu-table-head: #bbdefb; --acu-table-hover: #e1f5fe; --acu-opt-hover: #e1f5fe; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #e3f2fd; --acu-menu-bg: #fff; --acu-menu-text: #1565c0; --acu-success-text: #0288d1; --acu-success-bg: rgba(2, 136, 209, 0.15); --acu-scrollbar-track: #e3f2fd; --acu-scrollbar-thumb: #90caf9; --acu-hl-manual: #ff4757; --acu-hl-manual-bg: rgba(255, 71, 87, 0.15); --acu-hl-diff: #0277bd; --acu-hl-diff-bg: rgba(2, 119, 189, 0.2); --acu-error-text: #d32f2f; --acu-error-bg: rgba(211, 47, 47, 0.15); --acu-error-border: rgba(211, 47, 47, 0.5); --acu-warning-icon: #f57c00; --acu-warning-text: #f57c00; --acu-warning-bg: rgba(245, 124, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #1565c0; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-cyber { --acu-bg-nav: #000000; --acu-bg-panel: #0a0a0a; --acu-border: #333; --acu-text-main: #00ffcc; --acu-text-sub: #ff00ff; --acu-btn-bg: #111; --acu-btn-hover: #222; --acu-btn-active-bg: #ff00ff; --acu-btn-active-text: #000; --acu-accent: #00ffcc; --acu-table-head: #050505; --acu-table-hover: #111; --acu-opt-hover: rgba(0, 255, 204, 0.15); --acu-opt-bg: rgba(0, 255, 204, 0.08); --acu-shadow: 0 0 15px rgba(0,255,204,0.15); --acu-card-bg: #050505; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #111; --acu-menu-text: #00ffcc; --acu-success-text: #0f0; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #000; --acu-scrollbar-thumb: #333; --acu-hl-manual: #ff9f43; --acu-hl-manual-bg: rgba(255, 159, 67, 0.2); --acu-hl-diff: #0abde3; --acu-hl-diff-bg: rgba(10, 189, 227, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-overlay-bg: rgba(0,0,0,0.85); --acu-overlay-bg-light: rgba(0,0,0,0.75); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(0, 255, 204, 0.08); --acu-very-light-bg: rgba(0, 255, 204, 0.02); --acu-button-text-on-accent: #000; --acu-input-text: #ff00ff; --acu-input-placeholder: #ff00ff; }
    .acu-theme-cyber .acu-nav-btn { border-color: #222; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-cyber .acu-data-card,
    .acu-preview-overlay.acu-theme-cyber .acu-data-card { border-color: #222; }
    .acu-theme-nightowl { --acu-bg-nav: #0a2133; --acu-bg-panel: #011627; --acu-border: #132e45; --acu-text-main: #e0e6f2; --acu-text-sub: #a6b8cc; --acu-btn-bg: #1f3a52; --acu-btn-hover: #2a4a68; --acu-btn-active-bg: #7fdbca; --acu-btn-active-text: #011627; --acu-accent: #7fdbca; --acu-table-head: #0a2133; --acu-table-hover: #01294a; --acu-opt-hover: rgba(127, 219, 202, 0.15); --acu-opt-bg: rgba(127, 219, 202, 0.08); --acu-shadow: rgba(0,0,0,0.5); --acu-card-bg: #0a2133; --acu-badge-bg: #1f3a52; --acu-menu-bg: #011627; --acu-menu-text: #e0e6f2; --acu-success-text: #addb67; --acu-success-bg: rgba(173, 219, 103, 0.15); --acu-scrollbar-track: #011627; --acu-scrollbar-thumb: #1f3a52; --acu-hl-manual: #ff8f66; --acu-hl-manual-bg: rgba(255, 143, 102, 0.2); --acu-hl-diff: #82aaff; --acu-hl-diff-bg: rgba(130, 170, 255, 0.2); --acu-error-text: #ef5350; --acu-error-bg: rgba(239, 83, 80, 0.2); --acu-error-border: rgba(239, 83, 80, 0.5); --acu-warning-icon: #ffcb6b; --acu-warning-text: #ffcb6b; --acu-warning-bg: rgba(255, 203, 107, 0.2); --acu-overlay-bg: rgba(1, 22, 39, 0.85); --acu-overlay-bg-light: rgba(1, 22, 39, 0.75); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(127, 219, 202, 0.08); --acu-very-light-bg: rgba(127, 219, 202, 0.02); --acu-button-text: #e0e6f2; --acu-gray-bg: rgba(127, 219, 202, 0.08); --acu-button-text-on-accent: #011627; }
    .acu-theme-sakura { --acu-bg-nav: #F9F0EF; --acu-bg-panel: #F9F0EF; --acu-border: #EBDCD9; --acu-text-main: #6B5552; --acu-text-sub: #C08D8D; --acu-btn-bg: #EBDCD9; --acu-btn-hover: #D8C7C4; --acu-btn-active-bg: #C08D8D; --acu-btn-active-text: #F9F0EF; --acu-accent: #C08D8D; --acu-table-head: #F9F0EF; --acu-table-hover: #F5EAE8; --acu-opt-hover: #F5EAE8; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #F9F0EF; --acu-menu-bg: #fff; --acu-menu-text: #6B5552; --acu-success-text: #6B5552; --acu-success-bg: rgba(192, 141, 141, 0.12); --acu-scrollbar-track: #F9F0EF; --acu-scrollbar-thumb: #EBDCD9; --acu-hl-manual: #A68A7A; --acu-hl-manual-bg: rgba(166, 138, 122, 0.12); --acu-hl-diff: #9B7A7A; --acu-hl-diff-bg: rgba(155, 122, 122, 0.2); --acu-error-text: #9B7A7A; --acu-error-bg: rgba(155, 122, 122, 0.12); --acu-error-border: rgba(155, 122, 122, 0.4); --acu-warning-icon: #A68A7A; --acu-warning-text: #A68A7A; --acu-warning-bg: rgba(166, 138, 122, 0.12); --acu-overlay-bg: rgba(107, 85, 82, 0.6); --acu-overlay-bg-light: rgba(107, 85, 82, 0.5); --acu-shadow-bg: rgba(107, 85, 82, 0.3); --acu-light-bg: rgba(192, 141, 141, 0.08); --acu-very-light-bg: rgba(192, 141, 141, 0.02); --acu-button-text: #6B5552; --acu-gray-bg: rgba(192, 141, 141, 0.08); --acu-button-text-on-accent: #F9F0EF; }
    .acu-theme-minepink { --acu-bg-nav: #1a1a1a; --acu-bg-panel: #1a1a1a; --acu-border: #333333; --acu-text-main: #ffb3d9; --acu-text-sub: #ff80c1; --acu-btn-bg: #2a2a2a; --acu-btn-hover: #3a3a3a; --acu-btn-active-bg: #ff80c1; --acu-btn-active-text: #1a1a1a; --acu-accent: #ff80c1; --acu-table-head: #252525; --acu-table-hover: #2a2a2a; --acu-opt-hover: rgba(255, 128, 193, 0.15); --acu-opt-bg: rgba(255, 128, 193, 0.08); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #222222; --acu-badge-bg: #2a2a2a; --acu-menu-bg: #1a1a1a; --acu-menu-text: #ffb3d9; --acu-success-text: #ff80c1; --acu-success-bg: rgba(255, 128, 193, 0.2); --acu-scrollbar-track: #1a1a1a; --acu-scrollbar-thumb: #333333; --acu-hl-manual: #ffa726; --acu-hl-manual-bg: rgba(255, 167, 38, 0.2); --acu-hl-diff: #ff80c1; --acu-hl-diff-bg: rgba(255, 128, 193, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-overlay-bg: rgba(0,0,0,0.8); --acu-overlay-bg-light: rgba(0,0,0,0.7); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255, 128, 193, 0.1); --acu-very-light-bg: rgba(255, 128, 193, 0.02); --acu-button-text: #1a1a1a; --acu-gray-bg: rgba(255, 128, 193, 0.1); --acu-button-text-on-accent: #1a1a1a; }
    .acu-theme-purple { --acu-bg-nav: #f3e5f5; --acu-bg-panel: #f3e5f5; --acu-border: #ce93d8; --acu-text-main: #6a1b9a; --acu-text-sub: #9c27b0; --acu-btn-bg: #e1bee7; --acu-btn-hover: #ce93d8; --acu-btn-active-bg: #9c27b0; --acu-btn-active-text: #fff; --acu-accent: #9c27b0; --acu-table-head: #f8e1f5; --acu-table-hover: #fce4ec; --acu-opt-hover: #fce4ec; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #f8e1f5; --acu-menu-bg: #fff; --acu-menu-text: #6a1b9a; --acu-success-text: #6a1b9a; --acu-success-bg: rgba(106, 27, 154, 0.15); --acu-scrollbar-track: #f3e5f5; --acu-scrollbar-thumb: #ce93d8; --acu-hl-manual: #f57c00; --acu-hl-manual-bg: rgba(245, 124, 0, 0.15); --acu-hl-diff: #6a1b9a; --acu-hl-diff-bg: rgba(106, 27, 154, 0.2); --acu-error-text: #d32f2f; --acu-error-bg: rgba(211, 47, 47, 0.15); --acu-error-border: rgba(211, 47, 47, 0.5); --acu-warning-icon: #f57c00; --acu-warning-text: #f57c00; --acu-warning-bg: rgba(245, 124, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(156, 39, 176, 0.1); --acu-very-light-bg: rgba(156, 39, 176, 0.02); --acu-button-text: #6a1b9a; --acu-gray-bg: rgba(156, 39, 176, 0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-wechat { --acu-bg-nav: #F7F7F7; --acu-bg-panel: #F7F7F7; --acu-border: #E5E5E5; --acu-text-main: #333333; --acu-text-sub: #666666; --acu-btn-bg: #E5E5E5; --acu-btn-hover: #D5D5D5; --acu-btn-active-bg: #09B83E; --acu-btn-active-text: #FFFFFF; --acu-accent: #09B83E; --acu-table-head: #F0F0F0; --acu-table-hover: #EBEBEB; --acu-opt-hover: #EBEBEB; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #F0F0F0; --acu-menu-bg: #fff; --acu-menu-text: #333333; --acu-success-text: #09B83E; --acu-success-bg: rgba(9, 184, 62, 0.12); --acu-scrollbar-track: #F7F7F7; --acu-scrollbar-thumb: #E5E5E5; --acu-hl-manual: #FF9500; --acu-hl-manual-bg: rgba(255, 149, 0, 0.12); --acu-hl-diff: #09B83E; --acu-hl-diff-bg: rgba(9, 184, 62, 0.2); --acu-error-text: #E53E3E; --acu-error-bg: rgba(229, 62, 62, 0.12); --acu-error-border: rgba(229, 62, 62, 0.5); --acu-warning-icon: #FF9500; --acu-warning-text: #FF9500; --acu-warning-bg: rgba(255, 149, 0, 0.12); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.2); --acu-light-bg: rgba(9, 184, 62, 0.08); --acu-very-light-bg: rgba(9, 184, 62, 0.02); --acu-button-text: #333333; --acu-gray-bg: rgba(9, 184, 62, 0.08); --acu-button-text-on-accent: #fff; }
    .acu-theme-educational { --acu-bg-nav: #000000; --acu-bg-panel: #000000; --acu-border: #1B1B1B; --acu-text-main: #FFFFFF; --acu-text-sub: #CCCCCC; --acu-btn-bg: #1B1B1B; --acu-btn-hover: #2B2B2B; --acu-btn-active-bg: #FF9900; --acu-btn-active-text: #000000; --acu-accent: #FF9900; --acu-table-head: #1B1B1B; --acu-table-hover: #2B2B2B; --acu-opt-hover: rgba(255, 153, 0, 0.18); --acu-opt-bg: rgba(255, 153, 0, 0.1); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #1B1B1B; --acu-badge-bg: #1B1B1B; --acu-menu-bg: #000000; --acu-menu-text: #FFFFFF; --acu-success-text: #FF9900; --acu-success-bg: rgba(255, 153, 0, 0.15); --acu-scrollbar-track: #000000; --acu-scrollbar-thumb: #1B1B1B; --acu-input-bg: #1B1B1B; --acu-hl-manual: #FF9900; --acu-hl-manual-bg: rgba(255, 153, 0, 0.15); --acu-hl-diff: #FFB84D; --acu-hl-diff-bg: rgba(255, 184, 77, 0.2); --acu-error-text: #FF6B6B; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #FFAA00; --acu-warning-text: #FFAA00; --acu-warning-bg: rgba(255, 170, 0, 0.2); --acu-overlay-bg: rgba(0,0,0,0.8); --acu-overlay-bg-light: rgba(0,0,0,0.7); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255, 153, 0, 0.1); --acu-very-light-bg: rgba(255, 153, 0, 0.02); --acu-button-text: #FFFFFF; --acu-gray-bg: rgba(255, 255, 255, 0.1); --acu-button-text-on-accent: #000; }
    .acu-theme-vaporwave { --acu-bg-nav: #191970; --acu-bg-panel: #191970; --acu-border: rgba(0, 255, 255, 0.3); --acu-text-main: #00FFFF; --acu-text-sub: #FF00FF; --acu-btn-bg: rgba(25, 25, 112, 0.8); --acu-btn-hover: rgba(0, 255, 255, 0.2); --acu-btn-active-bg: #FF00FF; --acu-btn-active-text: #191970; --acu-accent: #00FFFF; --acu-table-head: rgba(25, 25, 112, 0.9); --acu-table-hover: rgba(0, 255, 255, 0.1); --acu-opt-hover: rgba(0, 255, 255, 0.18); --acu-opt-bg: rgba(0, 255, 255, 0.1); --acu-shadow: 0 0 15px rgba(0, 255, 255, 0.3); --acu-card-bg: rgba(25, 25, 112, 0.95); --acu-badge-bg: rgba(25, 25, 112, 0.8); --acu-menu-bg: #191970; --acu-menu-text: #00FFFF; --acu-success-text: #00FFFF; --acu-success-bg: rgba(0, 255, 255, 0.15); --acu-scrollbar-track: #191970; --acu-scrollbar-thumb: rgba(0, 255, 255, 0.3); --acu-input-bg: rgba(25, 25, 112, 0.6); --acu-hl-manual: #00FFFF; --acu-hl-manual-bg: rgba(0, 255, 255, 0.2); --acu-hl-diff: #FF00FF; --acu-hl-diff-bg: rgba(255, 0, 255, 0.2); --acu-error-text: #FF00FF; --acu-error-bg: rgba(255, 0, 255, 0.2); --acu-error-border: rgba(255, 0, 255, 0.5); --acu-warning-icon: #FF00FF; --acu-warning-text: #FF00FF; --acu-warning-bg: rgba(255, 0, 255, 0.15); --acu-overlay-bg: rgba(25, 25, 112, 0.85); --acu-overlay-bg-light: rgba(25, 25, 112, 0.75); --acu-shadow-bg: rgba(0, 255, 255, 0.3); --acu-light-bg: rgba(0, 255, 255, 0.05); --acu-very-light-bg: rgba(0, 255, 255, 0.02); --acu-button-text: #F0F8FF; --acu-gray-bg: rgba(0, 255, 255, 0.1); --acu-button-text-on-accent: #191970; --acu-input-text: #00FFFF; --acu-input-placeholder: #FF00FF; }
    .acu-theme-vaporwave .acu-nav-btn { border-color: rgba(0, 255, 255, 0.3); }
    .acu-wrapper.acu-dice-ui-root.acu-theme-vaporwave .acu-data-card,
    .acu-preview-overlay.acu-theme-vaporwave .acu-data-card { border-color: rgba(0, 255, 255, 0.3); }
    .acu-theme-classicpackaging { --acu-bg-nav: #000000; --acu-bg-panel: #000000; --acu-border: #FFFF00; --acu-text-main: #FFFF00; --acu-text-sub: #CCCC00; --acu-btn-bg: #FF0000; --acu-btn-hover: #CC0000; --acu-btn-active-bg: #0000FF; --acu-btn-active-text: #FFFF00; --acu-accent: #FF0000; --acu-table-head: #1a1a1a; --acu-table-hover: #2a2a2a; --acu-opt-hover: rgba(255, 255, 0, 0.15); --acu-opt-bg: rgba(255, 255, 0, 0.08); --acu-shadow: rgba(255,255,0,0.3); --acu-card-bg: #1a1a1a; --acu-badge-bg: #FF0000; --acu-menu-bg: #000000; --acu-menu-text: #FFFF00; --acu-success-text: #0000FF; --acu-success-bg: rgba(0, 0, 255, 0.2); --acu-scrollbar-track: #000000; --acu-scrollbar-thumb: #FFFF00; --acu-input-bg: #1a1a1a; --acu-hl-manual: #FF0000; --acu-hl-manual-bg: rgba(255, 0, 0, 0.2); --acu-hl-diff: #0000FF; --acu-hl-diff-bg: rgba(0, 0, 255, 0.2); --acu-error-text: #FF0000; --acu-error-bg: rgba(255, 0, 0, 0.2); --acu-error-border: rgba(255, 0, 0, 0.8); --acu-warning-icon: #FF0000; --acu-warning-text: #FF0000; --acu-warning-bg: rgba(255, 0, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.9); --acu-overlay-bg-light: rgba(0,0,0,0.8); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255,255,0,0.1); --acu-very-light-bg: rgba(255,255,0,0.02); --acu-button-text: #FFFF00; --acu-gray-bg: rgba(255,255,0,0.1); --acu-button-text-on-accent: #FFFF00; --acu-input-text: #FFFF00; --acu-input-placeholder: #666600; }
    .acu-theme-classicpackaging .acu-nav-btn { border-color: #FFFF00; border-width: 2px; font-weight: bold; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-classicpackaging .acu-data-card,
    .acu-preview-overlay.acu-theme-classicpackaging .acu-data-card { border-color: #FFFF00; border-width: 2px; }
    .acu-theme-galgame { --acu-bg-nav: #FFF0F5; --acu-bg-panel: #FFF0F5; --acu-border: #F0D4E4; --acu-text-main: #6B4A5A; --acu-text-sub: #B08A9A; --acu-btn-bg: #FFE4E9; --acu-btn-hover: #FFD4E4; --acu-btn-active-bg: #E8B4D9; --acu-btn-active-text: #6B4A5A; --acu-accent: #E8B4D9; --acu-table-head: #FFF5F9; --acu-table-hover: #FFF0F8; --acu-opt-hover: #FFF0F8; --acu-opt-bg: #ffffff; --acu-shadow: rgba(232, 180, 217, 0.25); --acu-card-bg: #ffffff; --acu-badge-bg: #FFF5F9; --acu-menu-bg: #fff; --acu-menu-text: #6B4A5A; --acu-success-text: #D4A5C8; --acu-success-bg: rgba(212, 165, 200, 0.15); --acu-scrollbar-track: #FFF0F5; --acu-scrollbar-thumb: #F0D4E4; --acu-input-bg: #FFF8FA; --acu-hl-manual: #D4A5A5; --acu-hl-manual-bg: rgba(212, 165, 165, 0.15); --acu-hl-diff: #E8B4D9; --acu-hl-diff-bg: rgba(232, 180, 217, 0.2); --acu-error-text: #C88A9A; --acu-error-bg: rgba(200, 138, 154, 0.15); --acu-error-border: rgba(200, 138, 154, 0.4); --acu-warning-icon: #D4A5A5; --acu-warning-text: #D4A5A5; --acu-warning-bg: rgba(212, 165, 165, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(232, 180, 217, 0.25); --acu-light-bg: rgba(232, 180, 217, 0.08); --acu-very-light-bg: rgba(232, 180, 217, 0.02); --acu-button-text: #6B4A5A; --acu-button-text-on-accent: #6B4A5A; --acu-gray-bg: rgba(232, 180, 217, 0.1); }
    .acu-theme-galgame .acu-nav-btn { border-radius: 8px; transition: all 0.3s ease; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-galgame .acu-data-card,
    .acu-preview-overlay.acu-theme-galgame .acu-data-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(232, 180, 217, 0.15); transition: all 0.3s ease; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-galgame .acu-data-card:hover,
    .acu-preview-overlay.acu-theme-galgame .acu-data-card:hover { box-shadow: 0 6px 20px rgba(232, 180, 217, 0.25); transform: translateY(-2px); }
    .acu-theme-galgame .acu-nav-btn:hover { box-shadow: 0 2px 8px rgba(232, 180, 217, 0.2); }
    .acu-theme-terminal { --acu-bg-nav: #0c0c0c; --acu-bg-panel: #0c0c0c; --acu-border: #00ff00; --acu-text-main: #00ff00; --acu-text-sub: #00cc00; --acu-btn-bg: #1a1a1a; --acu-btn-hover: #2a2a2a; --acu-btn-active-bg: #00ff00; --acu-btn-active-text: #0c0c0c; --acu-accent: #00ff00; --acu-table-head: #0a0a0a; --acu-table-hover: #1a1a1a; --acu-opt-hover: rgba(0, 255, 0, 0.12); --acu-opt-bg: rgba(0, 255, 0, 0.06); --acu-shadow: rgba(0,255,0,0.2); --acu-card-bg: #0c0c0c; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #0c0c0c; --acu-menu-text: #00ff00; --acu-success-text: #00ff00; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #0c0c0c; --acu-scrollbar-thumb: #00ff00; --acu-input-bg: #0c0c0c; --acu-hl-manual: #ffff00; --acu-hl-manual-bg: rgba(255, 255, 0, 0.15); --acu-hl-diff: #00ffff; --acu-hl-diff-bg: rgba(0, 255, 255, 0.15); --acu-error-text: #ff0000; --acu-error-bg: rgba(255, 0, 0, 0.15); --acu-error-border: rgba(255, 0, 0, 0.5); --acu-warning-icon: #ffff00; --acu-warning-text: #ffff00; --acu-warning-bg: rgba(255, 255, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.9); --acu-overlay-bg-light: rgba(0,0,0,0.8); --acu-shadow-bg: rgba(0,0,0,0.7); --acu-light-bg: rgba(0,255,0,0.05); --acu-very-light-bg: rgba(0,255,0,0.02); --acu-button-text: #0c0c0c; --acu-gray-bg: rgba(0,255,0,0.05); --acu-button-text-on-accent: #0c0c0c; font-family: 'Courier New', 'Consolas', 'Monaco', monospace; --acu-input-text: #00ff00; --acu-input-placeholder: #008800; }
    .acu-theme-terminal .acu-nav-btn { border-color: #00ff00; text-shadow: 0 0 5px rgba(0,255,0,0.5); }
    .acu-wrapper.acu-dice-ui-root.acu-theme-terminal .acu-data-card,
    .acu-preview-overlay.acu-theme-terminal .acu-data-card { border-color: #00ff00; text-shadow: 0 0 2px rgba(0,255,0,0.3); }
    .acu-theme-dreamcore { --acu-bg-nav: #F4F1EA; --acu-bg-panel: #F4F1EA; --acu-border: #D6D2C4; --acu-text-main: #5C5869; --acu-text-sub: #9490A0; --acu-btn-bg: #E6E1D5; --acu-btn-hover: #DBD8CC; --acu-btn-active-bg: #8A9AC6; --acu-btn-active-text: #FFFFFF; --acu-accent: #8A9AC6; --acu-table-head: #EBE7DE; --acu-table-hover: #F8F6F0; --acu-opt-hover: #F8F6F0; --acu-opt-bg: #FFFFFF; --acu-shadow: rgba(92, 88, 105, 0.15); --acu-card-bg: #FFFFFF; --acu-badge-bg: #EBE7DE; --acu-menu-bg: #FCFAF5; --acu-menu-text: #5C5869; --acu-success-text: #4A7A68; --acu-success-bg: rgba(74, 122, 104, 0.18); --acu-scrollbar-track: #F4F1EA; --acu-scrollbar-thumb: #D6D2C4; --acu-input-bg: #FFFFFF; --acu-hl-manual: #8A7040; --acu-hl-manual-bg: rgba(138, 112, 64, 0.18); --acu-hl-diff: #8A9AC6; --acu-hl-diff-bg: rgba(138, 154, 198, 0.18); --acu-error-text: #B85C5C; --acu-error-bg: rgba(184, 92, 92, 0.15); --acu-error-border: rgba(184, 92, 92, 0.4); --acu-warning-icon: #E0C080; --acu-warning-text: #8A7040; --acu-warning-bg: rgba(138, 112, 64, 0.18); --acu-overlay-bg: rgba(244, 241, 234, 0.85); --acu-overlay-bg-light: rgba(255, 255, 255, 0.4); --acu-shadow-bg: rgba(92, 88, 105, 0.15); --acu-light-bg: rgba(138, 154, 198, 0.08); --acu-very-light-bg: rgba(138, 154, 198, 0.03); --acu-button-text: #5C5869; --acu-gray-bg: rgba(92, 88, 105, 0.08); --acu-button-text-on-accent: #fff; }
    .acu-theme-dreamcore .acu-nav-btn { border-color: #D6D2C4; }
    /* 极光幻境 (Aurora) 主题：深邃星空与极光渐变 */
    .acu-theme-aurora {
        --acu-bg-nav: linear-gradient(135deg, #0f172a, #1e293b);
        --acu-bg-panel: linear-gradient(180deg, #0f172a 0%, #334155 100%);
        --acu-border: #38bdf8;
        --acu-text-main: #e2e8f0;
        --acu-text-sub: #94a3b8;
        --acu-btn-bg: linear-gradient(135deg, #162a3d, #25224d);
        --acu-btn-hover: linear-gradient(135deg, #1e3a5f, #312e81);
        --acu-btn-active-bg: linear-gradient(135deg, #38bdf8, #a855f7);
        --acu-btn-active-text: #fff;
        --acu-accent: #38bdf8;
        --acu-table-head: linear-gradient(90deg, #0f172a, #1e293b);
        --acu-table-hover: rgba(56, 189, 248, 0.08);
        --acu-opt-hover: rgba(56, 189, 248, 0.15);
        --acu-opt-bg: rgba(56, 189, 248, 0.08);
        --acu-shadow: 0 8px 32px rgba(56, 189, 248, 0.15), 0 4px 16px rgba(168, 85, 247, 0.1);
        --acu-card-bg: linear-gradient(145deg, #1e293b, #0f172a);
        --acu-badge-bg: rgba(56, 189, 248, 0.2);
        --acu-menu-bg: #1e293b;
        --acu-menu-text: #e2e8f0;
        --acu-success-text: #4ade80;
        --acu-success-bg: rgba(74, 222, 128, 0.15);
        --acu-scrollbar-track: #0f172a;
        --acu-scrollbar-thumb: #38bdf8;
        --acu-input-bg: #0f172a;
        --acu-hl-manual: #f97316;
        --acu-hl-manual-bg: rgba(249, 115, 22, 0.2);
        --acu-hl-diff: #38bdf8;
        --acu-hl-diff-bg: rgba(56, 189, 248, 0.2);
        --acu-error-text: #f87171;
        --acu-error-bg: rgba(248, 113, 113, 0.2);
        --acu-error-border: rgba(248, 113, 113, 0.5);
        --acu-warning-icon: #fbbf24;
       
       
        --acu-warning-text: #fbbf24;
        --acu-warning-bg: rgba(251, 191, 36, 0.2);
       
       
       
       
       
       
        --acu-overlay-bg: rgba(15, 23, 42, 0.98);
        --acu-overlay-bg-light: rgba(30, 41, 59, 0.95);
        --acu-shadow-bg: rgba(56, 189, 248, 0.2);
        --acu-light-bg: rgba(56, 189, 248, 0.08);
        --acu-very-light-bg: rgba(56, 189, 248, 0.03);
        --acu-button-text: #e2e8f0;
        --acu-gray-bg: rgba(148, 163, 184, 0.1);
        --acu-button-text-on-accent: #fff;
    }
    .acu-theme-aurora .acu-nav-btn { border-color: rgba(56, 189, 248, 0.3); }
    .acu-wrapper.acu-dice-ui-root.acu-theme-aurora .acu-data-card,
    .acu-preview-overlay.acu-theme-aurora .acu-data-card { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 4px 20px rgba(56, 189, 248, 0.1), 0 2px 10px rgba(168, 85, 247, 0.08); }
    .acu-theme-aurora .acu-dice-panel input::placeholder,
    .acu-theme-aurora .acu-contest-panel input::placeholder {
        color: #94a3b8 !important;
        opacity: 0.7;
    }
    .acu-theme-aurora .acu-dice-panel input[type="text"],
    .acu-theme-aurora .acu-dice-panel input[type="number"],
    .acu-theme-aurora .acu-dice-panel input:not([type]),
    .acu-theme-aurora .acu-contest-panel input[type="text"],
    .acu-theme-aurora .acu-contest-panel input[type="number"],
    .acu-theme-aurora .acu-contest-panel input:not([type]) {
        color: #e2e8f0 !important;
    }
    /* 极光幻境：导航栏 - 极光渐变光效 */
    .acu-theme-aurora .acu-nav-container {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%) !important;
        border: 1px solid #38bdf8 !important;
        box-shadow: 0 0 30px rgba(56, 189, 248, 0.1), 0 0 60px rgba(168, 85, 247, 0.05), inset 0 0 20px rgba(56, 189, 248, 0.05) !important;
        overflow: visible !important;
    }
    /* 极光顶部渐变光条 */
    .acu-theme-aurora .acu-nav-container::before {
        content: '';
        position: absolute;
        top: -1px; left: -1px; right: -1px; bottom: -1px;
        background: linear-gradient(90deg, #38bdf8, #a855f7, #22d3ee, #38bdf8);
        background-size: 300% 100%;
        z-index: -1;
        border-radius: 14px;
        animation: aurora-glow 6s ease-in-out infinite;
        opacity: 0.6;
    }
    @keyframes aurora-glow {
        0% { background-position: 0% 50%; opacity: 0.4; }
        50% { background-position: 100% 50%; opacity: 0.7; }
        100% { background-position: 0% 50%; opacity: 0.4; }
    }
    /* 极光幻境：按钮样式 */
    .acu-theme-aurora .acu-nav-btn {
        border: 1px solid rgba(56, 189, 248, 0.2) !important;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(168, 85, 247, 0.1)) !important;
        border-radius: 8px;
        color: #e2e8f0;
        transition: all 0.3s ease;
    }
    .acu-theme-aurora .acu-nav-btn:hover {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2)) !important;
        border-color: rgba(56, 189, 248, 0.5) !important;
        box-shadow: 0 4px 15px rgba(56, 189, 248, 0.2);
        transform: translateY(-2px);
    }
    .acu-theme-aurora .acu-nav-btn.active {
        background: linear-gradient(135deg, #38bdf8, #a855f7) !important;
        border-color: transparent !important;
        color: #ffffff !important;
        box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4), 0 2px 10px rgba(168, 85, 247, 0.3);
        font-weight: bold;
    }
    /* 极光幻境：数据卡片 */
    .acu-wrapper.acu-dice-ui-root.acu-theme-aurora .acu-data-card:hover,
    .acu-preview-overlay.acu-theme-aurora .acu-data-card:hover {
        border-color: rgba(56, 189, 248, 0.5) !important;
        box-shadow: 0 8px 30px rgba(56, 189, 248, 0.15), 0 4px 15px rgba(168, 85, 247, 0.1);
        transform: translateY(-3px);
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-dreamcore .acu-data-card,
    .acu-preview-overlay.acu-theme-dreamcore .acu-data-card { border-color: #D6D2C4; box-shadow: 0 2px 8px rgba(92, 88, 105, 0.1); }
    .acu-theme-dreamcore .acu-dice-panel input::placeholder,
    .acu-theme-dreamcore .acu-contest-panel input::placeholder {
        color: #B0ACC0 !important;
        opacity: 0.9;
    }
    .acu-theme-dreamcore .acu-dice-panel input[type="text"],
    .acu-theme-dreamcore .acu-dice-panel input[type="number"],
    .acu-theme-dreamcore .acu-dice-panel input:not([type]),
    .acu-theme-dreamcore .acu-contest-panel input[type="text"],
    .acu-theme-dreamcore .acu-contest-panel input[type="number"],
    .acu-theme-dreamcore .acu-contest-panel input:not([type]) {
        color: #4A4652 !important;
    }
    /* 超天酱 (Choutenちゃん) 主题：電脳カワイイ・オーバードライブ */
    .acu-theme-chouten {
        --acu-bg-nav: linear-gradient(135deg, rgba(26, 10, 46, 0.95) 0%, rgba(45, 27, 78, 0.95) 50%, rgba(26, 10, 46, 0.95) 100%);
        --acu-bg-panel: rgba(26, 10, 46, 0.95);
        --acu-border: #FF7EB6;
        --acu-text-main: #FFFFFF;
        --acu-text-sub: #D0BFFF;
        --acu-btn-bg: rgba(255, 255, 255, 0.1);
        --acu-btn-hover: rgba(255, 107, 157, 0.3);
        --acu-btn-active-bg: linear-gradient(90deg, #FF6B9D, #B388FF);
        --acu-btn-active-text: #FFFFFF;
        --acu-accent: #7FFFD4;
        --acu-table-head: rgba(255, 107, 157, 0.15);
        --acu-table-hover: linear-gradient(90deg, rgba(255, 107, 157, 0.2), rgba(127, 255, 212, 0.2));
        --acu-opt-hover: linear-gradient(90deg, rgba(255, 107, 157, 0.15), rgba(127, 255, 212, 0.15)); --acu-opt-bg: transparent;
        --acu-shadow: rgba(255, 107, 157, 0.5);
        --acu-card-bg: rgba(20, 10, 35, 0.7);
        --acu-badge-bg: rgba(127, 255, 212, 0.2);
        --acu-menu-bg: #2D1B4E;
        --acu-menu-text: #FFE4F0;
        --acu-success-text: #7FFFD4;
        --acu-success-bg: rgba(127, 255, 212, 0.15);
        --acu-scrollbar-track: #1A0A2E;
        --acu-scrollbar-thumb: #FF6B9D;
        --acu-input-bg: rgba(0, 0, 0, 0.3);
        --acu-hl-manual: #FFD93D;
        --acu-hl-manual-bg: rgba(255, 217, 61, 0.2);
        --acu-hl-diff: #7FFFD4;
        --acu-hl-diff-bg: rgba(127, 255, 212, 0.2);
        --acu-error-text: #FF6B6B;
        --acu-error-bg: rgba(255, 107, 107, 0.2);
        --acu-error-border: #FF6B6B;
        --acu-warning-icon: #FFD93D;
       
       
        --acu-warning-text: #FFD93D;
        --acu-warning-bg: rgba(255, 217, 61, 0.2);
       
       
       
       
       
       
        --acu-overlay-bg: rgba(26, 10, 46, 0.95);
        --acu-overlay-bg-light: rgba(45, 27, 78, 0.85);
        --acu-shadow-bg: rgba(255, 107, 157, 0.3);
        --acu-light-bg: rgba(255, 107, 157, 0.1);
        --acu-very-light-bg: rgba(179, 136, 255, 0.05);
        --acu-button-text: #FFFFFF;
        --acu-button-text-on-accent: #1A0A2E;
        --acu-gray-bg: rgba(255, 255, 255, 0.05);
    }

    /* Badge 颜色从主题色自动推导，无需每个主题单独维护 */
    [class*="acu-theme-"] {
      --acu-failure-text: var(--acu-error-text);
      --acu-failure-bg: var(--acu-error-bg);
      --acu-crit-failure-text: var(--acu-error-text);
      --acu-crit-failure-bg: var(--acu-error-bg);
      --acu-crit-success-text: var(--acu-accent);
      --acu-crit-success-bg: var(--acu-success-bg);
      --acu-extreme-success-text: var(--acu-hl-diff);
      --acu-extreme-success-bg: var(--acu-hl-diff-bg);
    }

    .acu-theme-retro { --acu-opt-bright-bg: #fffef9; }
    .acu-theme-modern,
    .acu-theme-forest,
    .acu-theme-ocean,
    .acu-theme-sakura,
    .acu-theme-purple,
    .acu-theme-wechat,
    .acu-theme-galgame,
    .acu-theme-dreamcore { --acu-opt-bright-bg: #ffffff; }
    .acu-theme-dark { --acu-opt-bright-bg: rgba(255, 255, 255, 0.05); }
    .acu-theme-cyber { --acu-opt-bright-bg: rgba(0, 255, 204, 0.08); }
    .acu-theme-nightowl { --acu-opt-bright-bg: rgba(127, 219, 202, 0.08); }
    .acu-theme-minepink { --acu-opt-bright-bg: rgba(255, 128, 193, 0.08); }
    .acu-theme-educational { --acu-opt-bright-bg: rgba(255, 153, 0, 0.1); }
    .acu-theme-vaporwave { --acu-opt-bright-bg: rgba(0, 255, 255, 0.1); }
    .acu-theme-aurora { --acu-opt-bright-bg: rgba(56, 189, 248, 0.1); }
    .acu-theme-classicpackaging { --acu-opt-bright-bg: rgba(255, 255, 0, 0.08); }
    .acu-theme-terminal { --acu-opt-bright-bg: rgba(0, 255, 0, 0.06); }
    .acu-theme-chouten { --acu-opt-bright-bg: transparent; }

    /* 超天酱：导航栏 - 偶像舞台光效 */
    .acu-theme-chouten .acu-nav-container {
        background: linear-gradient(180deg, rgba(45, 27, 78, 0.95) 0%, rgba(26, 10, 46, 0.98) 100%) !important;
        border: 1px solid rgba(255, 107, 157, 0.5) !important;
        box-shadow: 0 0 20px rgba(179, 136, 255, 0.2), inset 0 0 30px rgba(255, 107, 157, 0.1) !important;
        backdrop-filter: blur(10px);
        overflow: visible !important;
    }
    /* 顶部彩虹光条 */
    .acu-theme-chouten .acu-nav-container::before {
        content: '';
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        background: linear-gradient(90deg, #FF6B9D, #B388FF, #7FFFD4, #FF6B9D);
        background-size: 300% 100%;
        z-index: -1;
        border-radius: 12px;
        animation: chouten-rainbow-border 4s linear infinite;
        opacity: 0.8;
    }
    @keyframes chouten-rainbow-border {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* 超天酱：按钮 - 糖果霓虹 */
    .acu-theme-chouten .acu-nav-btn {
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-radius: 8px;
        color: #FFE4F0;
        transition:
            background-color var(--acu-motion-normal) var(--acu-ease-standard),
            border-color var(--acu-motion-normal) var(--acu-ease-standard),
            color var(--acu-motion-normal) var(--acu-ease-standard),
            box-shadow var(--acu-motion-normal) var(--acu-ease-standard),
            transform var(--acu-motion-normal) var(--acu-ease-out);
        position: relative;
        overflow: hidden;
    }
    .acu-theme-chouten .acu-nav-btn:hover {
        background: rgba(255, 107, 157, 0.2) !important;
        border-color: #FF6B9D !important;
        text-shadow: 0 0 8px #FF6B9D;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 5px 15px rgba(255, 107, 157, 0.3);
    }
    .acu-theme-chouten .acu-nav-btn.active {
        background: linear-gradient(135deg, #FF6B9D 0%, #B388FF 100%) !important;
        border-color: #FFFFFF !important;
        color: #FFFFFF !important;
        box-shadow: 0 0 20px rgba(255, 107, 157, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3);
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    /* 按钮激活时的闪烁粒子效果 (模拟) */
    .acu-theme-chouten .acu-nav-btn.active::after {
        content: '✦';
        position: absolute;
        top: 2px;
        right: 4px;
        font-size: 10px;
        color: #7FFFD4;
        animation: chouten-sparkle 1.5s infinite;
    }

    /* 超天酱：数据卡片 - 赛博光晕 */
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-data-card,
    .acu-preview-overlay.acu-theme-chouten .acu-data-card {
        border: 1px solid rgba(179, 136, 255, 0.3) !important;
        background: linear-gradient(160deg, rgba(30, 15, 50, 0.85) 0%, rgba(20, 8, 40, 0.9) 100%) !important;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(179, 136, 255, 0.05);
        position: relative;
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-data-card::after,
    .acu-preview-overlay.acu-theme-chouten .acu-data-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, #7FFFD4, transparent);
        opacity: 0.5;
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-data-card:hover,
    .acu-preview-overlay.acu-theme-chouten .acu-data-card:hover {
        border-color: #7FFFD4 !important;
        box-shadow: 0 8px 30px rgba(127, 255, 212, 0.15), 0 0 15px rgba(127, 255, 212, 0.1);
        transform: translateY(-2px);
    }

    /* 超天酱：输入框 - 浮空全息 */
    .acu-theme-chouten .acu-dice-panel input::placeholder,
    .acu-theme-chouten .acu-contest-panel input::placeholder {
        color: rgba(179, 136, 255, 0.6) !important;
    }
    .acu-theme-chouten .acu-dice-panel input,
    .acu-theme-chouten .acu-contest-panel input {
        background: rgba(0, 0, 0, 0.4) !important;
        border: 1px solid rgba(255, 107, 157, 0.3) !important;
        border-radius: 4px;
        color: #7FFFD4 !important;
        transition: all 0.3s ease;
    }
    .acu-theme-chouten .acu-dice-panel input:focus,
    .acu-theme-chouten .acu-contest-panel input:focus {
        border-color: #7FFFD4 !important;
        box-shadow: 0 0 10px rgba(127, 255, 212, 0.4), inset 0 0 10px rgba(127, 255, 212, 0.1) !important;
        background: rgba(0, 0, 0, 0.6) !important;
    }

    /* 超天酱：滚动条 */
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten ::-webkit-scrollbar-thumb,
    .acu-preview-overlay.acu-theme-chouten ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #FF6B9D, #B388FF) !important;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten ::-webkit-scrollbar-track,
    .acu-preview-overlay.acu-theme-chouten ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    /* 超天酱：表格行 - 悬停高亮 */
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-card-row,
    .acu-preview-overlay.acu-theme-chouten .acu-card-row {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-card-row:hover,
    .acu-preview-overlay.acu-theme-chouten .acu-card-row:hover {
        background: linear-gradient(90deg, rgba(255, 107, 157, 0.2), rgba(179, 136, 255, 0.1)) !important;
        box-shadow: inset 2px 0 0 #FF6B9D;
    }

    /* 超天酱：徽章闪烁动画 */
    .acu-theme-chouten .acu-badge-green {
        background: rgba(127, 255, 212, 0.15) !important;
        color: #7FFFD4 !important;
        border: 1px solid rgba(127, 255, 212, 0.4);
        box-shadow: 0 0 10px rgba(127, 255, 212, 0.2);
        animation: chouten-badge-pulse 2s infinite;
    }
    @keyframes chouten-badge-pulse {
        0%, 100% { box-shadow: 0 0 5px rgba(127, 255, 212, 0.2); opacity: 0.9; }
        50% { box-shadow: 0 0 15px rgba(127, 255, 212, 0.5); opacity: 1; }
    }
    @keyframes chouten-sparkle {
        0%, 100% { opacity: 0.4; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    /* Night Owl主题：数据验证和表格管理框框使用更暗的边框 */
    .acu-theme-nightowl .acu-table-manager-item,
    .acu-theme-nightowl .acu-validation-rule-item {
        border-color: var(--acu-border) !important;
    }
    .acu-theme-nightowl .acu-table-manager-item:hover,
    .acu-theme-nightowl .acu-validation-rule-item:hover {
        border-color: rgba(127, 219, 202, 0.4) !important;
    }
    /* Night Owl主题：预设卡片框框使用更暗的边框 */
    .acu-theme-nightowl .acu-preset-item {
        border-color: var(--acu-border) !important;
    }
    .acu-theme-nightowl .acu-preset-item:hover {
        border-color: rgba(127, 219, 202, 0.4) !important;
    }
    .acu-wrapper.acu-dice-ui-root { position: relative; width: 100%; margin: 15px 0; z-index: 1000 !important; font-family: 'Microsoft YaHei', sans-serif; display: flex; flex-direction: column-reverse; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-pill,
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-floating { pointer-events: none !important; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-pill .acu-expand-trigger,
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-floating .acu-expand-trigger { pointer-events: auto !important; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-bar { pointer-events: auto !important; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-floating { position: fixed !important; right: auto !important; bottom: auto !important; width: 48px !important; max-width: 48px !important; height: 48px !important; margin: 0 !important; z-index: 1000 !important; display: block !important; visibility: visible !important; opacity: 1 !important; overflow: visible !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-viewport { position: fixed !important; left: 0 !important; right: auto !important; bottom: max(8px, env(safe-area-inset-bottom)); width: 100% !important; max-width: 100% !important; margin: 0 !important; transform: none !important; z-index: 1000 !important; display: flex; flex-direction: column-reverse !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-viewport .acu-nav-container { position: relative !important; z-index: 31020 !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-viewport .acu-data-display { position: absolute !important; bottom: calc(100% + 10px) !important; left: 0 !important; right: 0 !important; width: 100% !important; max-height: min(80vh, var(--acu-viewport-panel-max-height, calc(100dvh - 96px))) !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded { position: relative !important; width: 100% !important; margin-top: 8px !important; z-index: 1000 !important; clear: both; display: flex; flex-direction: column-reverse !important; padding: 0; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-nav-container { position: relative !important; z-index: 31020 !important; border-radius: 0 !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-nav-container::before { border-radius: 0 !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-data-display { position: absolute !important; bottom: 100% !important; left: 0 !important; right: 0 !important; width: 100% !important; box-shadow: 0 -10px 30px rgba(0,0,0,0.25) !important; border: 1px solid var(--acu-border); margin-bottom: 5px; z-index: 31010 !important; max-height: 70vh !important; overflow-y: auto !important; }
    .acu-nav-container { display: grid; grid-template-columns: repeat(var(--acu-grid-cols, 3), 1fr); gap: 5px; padding: 6px; background: var(--acu-bg-nav); border: 1px solid var(--acu-border); border-radius: 10px; align-items: center; box-shadow: 0 2px 6px var(--acu-shadow); position: relative; z-index: 31020 !important; }
    .acu-nav-items { display: contents; }
    .acu-nav-btn { touch-action: manipulation; -webkit-tap-highlight-color: transparent; width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px; padding: 4px 6px; border: 1px solid var(--acu-border); border-radius: 7px; background: var(--acu-btn-bg); color: var(--acu-text-main); font-weight: 600; font-size: var(--acu-nav-font-size, 13px); cursor: pointer; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); user-select: none; overflow: hidden; height: var(--acu-nav-button-size, 32px); }
    .acu-nav-btn span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; margin-top: 1px; }
    .acu-nav-btn:hover { background: var(--acu-btn-hover); border-color: var(--acu-accent); transform: translateY(-1px); }
    .acu-nav-btn:focus, .acu-nav-btn:focus-visible { outline: none; box-shadow: var(--acu-focus-ring) !important; }
    /* [新增] 移植功能样式 */
/* --- 1. 外层容器：防止误触边缘 --- */
.acu-height-control {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    cursor: ns-resize;
    padding: 0;
    border-radius: 6px;
    color: var(--acu-text-sub);
    border: 1px solid transparent;
    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard);
    /* 关键属性：禁止在此区域触发浏览器默认手势 */
    touch-action: none;
}

/* 交互反馈 */
.acu-height-control:hover, .acu-height-control.active {
    color: var(--acu-accent);
    background: var(--acu-table-hover);
    border-color: var(--acu-border);
}

/* --- 2. [加保险] 内部图标：这是事件绑定的主体，必须禁止触摸 --- */
.acu-height-drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: ns-resize;
    /* 双重保险：确保直接按在图标上也不会触发滚动 */
    touch-action: none;
}

            /* 视图切换样式 */
            .acu-view-btn { background: transparent !important; border: 1px solid transparent; color: var(--acu-text-main) !important; cursor: pointer; padding: 5px; margin-right: 2px; font-size: 14px; opacity: 0.7; border-radius: 6px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), opacity var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-view-btn:hover { opacity: 1; color: var(--acu-accent) !important; background: var(--acu-table-hover) !important; border-color: var(--acu-border); }
            .acu-view-btn.acu-reverse-btn.active, .acu-reverse-btn[data-reversed="true"] { color: var(--acu-accent) !important; opacity: 1; }
            /* Grid 视图 (双列) */
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid,
            .acu-preview-overlay .acu-card-body.view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; }
            /* 修复版：强制 Grid 模式使用 Flex 布局并允许高度自适应 */
.acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-row,
.acu-preview-overlay .acu-card-body.view-grid .acu-card-row { display: flex; height: auto !important; min-height: fit-content; border: 1px solid var(--acu-border); border-radius: 6px; padding: 5px 7px; flex-direction: column !important; align-items: flex-start !important; background: rgba(0,0,0,0.02); box-sizing: border-box; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-row.acu-grid-span-full,
            .acu-preview-overlay .acu-card-body.view-grid .acu-card-row.acu-grid-span-full { grid-column: 1 / -1; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-label,
            .acu-preview-overlay .acu-card-body.view-grid .acu-card-label { width: 100% !important; font-size: 0.85em; opacity: 0.8; margin-bottom: 2px; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-value,
            .acu-preview-overlay .acu-card-body.view-grid .acu-card-value { width: 100% !important; }

            /* List 视图 (单列 - 原版增强) */
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active,
            .acu-nav-btn.active { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); box-shadow: 0 1px 4px var(--acu-shadow); outline: none; border-color: var(--acu-btn-active-bg); }
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active:hover,
            .acu-nav-btn.active:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); transform: none; }
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active:focus,
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active:focus-visible,
            .acu-nav-btn.active:focus, .acu-nav-btn.active:focus-visible { outline: none; box-shadow: var(--acu-focus-ring), 0 1px 4px var(--acu-shadow) !important; }
            .acu-nav-btn.has-validation-errors { border-color: rgba(231, 76, 60, 0.5); }
            .acu-nav-btn .acu-nav-warning-icon { color: var(--acu-error-text, #e74c3c); font-size: 10px; margin-left: 2px; }
            .acu-action-btn { flex: 1; height: var(--acu-nav-button-size, 32px); font-size: var(--acu-nav-icon-size, 14px); display: flex; align-items: center; justify-content: center; background: var(--acu-btn-bg); border-radius: 8px; color: var(--acu-text-sub); cursor: pointer; border: 1px solid var(--acu-border); transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); margin: 0; }
            .acu-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); border-color: var(--acu-accent); transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .acu-action-btn:focus, .acu-action-btn:focus-visible { outline: none; box-shadow: var(--acu-focus-ring) !important; }
            #acu-btn-save-global { color: var(--acu-btn-active-bg); } #acu-btn-save-global:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); }

            .acu-data-display { position: absolute; bottom: calc(100% + 10px); left: 0; right: 0; max-height: 80vh; height: auto; background: var(--acu-bg-panel); border: 1px solid var(--acu-border); border-radius: 8px; box-shadow: 0 8px 30px var(--acu-shadow); display: flex; flex-direction: column; z-index: 31002 !important; opacity: 0; visibility: hidden; transform: translateY(6px); transition: opacity var(--acu-motion-normal) var(--acu-ease-standard), transform var(--acu-motion-normal) var(--acu-ease-standard), visibility 0s linear var(--acu-motion-normal); pointer-events: none; }
            .acu-data-display.visible { opacity: 1; visibility: visible; transform: translateY(0); transition: opacity var(--acu-motion-normal) var(--acu-ease-standard), transform var(--acu-motion-normal) var(--acu-ease-standard), visibility 0s linear 0s; pointer-events: auto; }
            @keyframes popUp { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes highlightFlash { 0%, 100% { box-shadow: none; } 50% { box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.6); } }
            .acu-highlight-flash { animation: highlightFlash 0.5s ease-in-out 3; }

            .acu-panel-header { flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 14px; background: var(--acu-table-head); border-bottom: 1px solid var(--acu-border); border-radius: 8px 8px 0 0; }
            /* 核心修改：增加了 flex: 1 和 min-width: 0，强制标题在空间不足时自动变短显示省略号 */
/* --- 新的标题布局：纵向排列 --- */
.acu-panel-title {
    display: flex;
    flex-direction: column; /* 垂直堆叠 */
    justify-content: center;
    align-items: flex-start;
    flex: 1; /* 占据剩余空间 */
    min-width: 0; /* 允许压缩 */
    margin-right: 8px;
    overflow: hidden;
}

/* 第一行：标题主体 (加粗，稍大) */
.acu-title-main {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    font-size: 13px; /* 你要求的：字体变小一点，但保持加粗 */
    font-weight: bold;
    color: var(--acu-text-main);
    line-height: 1.2;
}

/* 标题文字本身 (溢出省略) */
.acu-title-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 第二行：页码信息 (灰色，更小) */
.acu-title-sub {
    font-size: 10px;
    color: var(--acu-text-sub);
    font-weight: normal;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    line-height: 1.2;
    margin-top: 1px;
}
            /* 增加了 flex-shrink: 0; 防止被标题挤压 */
/* 核心修改：flex-shrink: 0 确保这一块区域永远不会被压缩 */
.acu-header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
            .acu-search-wrapper { position: relative; display: flex; align-items: center; }
            .acu-wrapper.acu-dice-ui-root input.acu-search-input { background: var(--acu-btn-bg) !important; border: 1px solid var(--acu-border) !important; color: var(--acu-text-main) !important; padding: 4px 8px 4px 24px; border-radius: 12px; font-size: 12px; width: 120px; transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-wrapper.acu-dice-ui-root input.acu-search-input::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            .acu-wrapper.acu-dice-ui-root input.acu-search-input:focus { width: 160px; outline: none !important; border-color: var(--acu-accent) !important; box-shadow: none !important; }
            .acu-search-input::placeholder { color: var(--acu-text-sub) ; opacity: 0.7; }
            .acu-search-icon { position: absolute; left: 8px; font-size: 10px; color: var(--acu-text-sub); pointer-events: none; }
            .acu-empty-state { min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--acu-text-sub); text-align: center; padding: 24px; }
            .acu-empty-state i { font-size: 20px; opacity: 0.7; }
            .acu-empty-state span { font-size: 12px; }
            /* 普通横向表格由卡片自己纵向滚动；手动高度模式才把面板高度传给卡片 */
            .acu-wrapper.acu-dice-ui-root .acu-panel-content { flex: 1; min-height: 0; overflow-x: auto; overflow-y: hidden; padding: 15px; background: transparent; scrollbar-width: thin; scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track); overscroll-behavior-x: contain; overscroll-behavior-y: contain; touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; }
            .acu-wrapper.acu-dice-ui-root .acu-card-grid { display: flex; flex-wrap: nowrap; gap: 12px; align-items: flex-start; }
            .acu-wrapper.acu-dice-ui-root:not(.acu-layout-vertical) .acu-manual-mode .acu-panel-content > .acu-card-grid { height: 100%; min-height: 0; }
            .acu-wrapper.acu-dice-ui-root:not(.acu-layout-vertical) .acu-manual-mode .acu-panel-content > .acu-card-grid > .acu-data-card { max-height: 100% !important; min-height: 0; overflow-y: auto; }
            .acu-wrapper.acu-dice-ui-root.acu-layout-vertical .acu-panel-content { overflow-x: hidden !important; overflow-y: auto !important; overscroll-behavior: auto; touch-action: manipulation; min-height: 0; }
            /* 竖向布局时恢复 auto 高度 */
            .acu-wrapper.acu-dice-ui-root.acu-layout-vertical .acu-card-grid { flex-wrap: wrap !important; justify-content: center; padding-bottom: 20px; height: auto; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card, .acu-preview-overlay .acu-data-card { flex: 0 0 var(--acu-card-width, 260px); width: var(--acu-card-width, 260px); background: var(--acu-card-bg); border: 1px solid var(--acu-border); border-radius: 8px; height: auto; max-height: min(52vh, 520px, calc(100dvh - 140px)); overflow-y: auto; overscroll-behavior-y: contain; touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); display: flex; flex-direction: column; position: relative; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card:hover,
            .acu-preview-overlay .acu-data-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px var(--acu-shadow); border-color: var(--acu-accent); }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.pending-deletion,
            .acu-preview-overlay .acu-data-card.pending-deletion { opacity: 0.6; border: 1px dashed var(--acu-error-text, #e74c3c); }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.pending-deletion::after,
            .acu-preview-overlay .acu-data-card.pending-deletion::after { content: "待删除"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); color: var(--acu-error-text, #e74c3c); font-size: 24px; font-weight: bold; border: 2px solid var(--acu-error-text, #e74c3c); padding: 5px 10px; border-radius: 8px; opacity: 0.8; pointer-events: none; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.acu-card-locked,
            .acu-preview-overlay .acu-data-card.acu-card-locked { border: 2px solid var(--acu-accent); box-shadow: 0 0 8px rgba(var(--acu-accent-rgb, 59, 130, 246), 0.3); position: relative; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.acu-card-locked::before,
            .acu-preview-overlay .acu-data-card.acu-card-locked::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(var(--acu-accent-rgb, 59, 130, 246), 0.05) 0%, transparent 50%); pointer-events: none; z-index: 0; border-radius: 8px; }
            .acu-row-lock-badge { color: var(--acu-accent); font-size: 14px; opacity: 0.9; margin-left: 4px; flex-shrink: 0; }
            @keyframes pulse-highlight { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
            .acu-highlight-manual { color: var(--acu-hl-manual) !important; background-color: var(--acu-hl-manual-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-highlight-diff { color: var(--acu-hl-diff) !important; background-color: var(--acu-hl-diff-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-editable-title.acu-highlight-manual, .acu-editable-title.acu-highlight-diff { width: auto; display: inline-block; }
            .acu-wrapper.acu-dice-ui-root .acu-card-header,
            .acu-preview-overlay .acu-card-header { flex: 0 0 auto; padding: 8px 10px; background: var(--acu-table-head); border-bottom: 1px solid var(--acu-border); font-weight: bold; color: var(--acu-text-main); font-size: 14px; display: flex; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 8px; min-height: 40px; height: auto !important; position: relative; }
            .acu-editable-title { flex: 1; width: auto !important; cursor: pointer; border-bottom: 1px dashed transparent; transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard); white-space: pre-wrap !important; overflow: visible !important; word-break: break-word !important; text-align: center; line-height: 1.3; margin: 0; }
            .acu-editable-title:hover { border-bottom-color: var(--acu-accent); color: var(--acu-accent); }
            .acu-card-index { position: static !important; transform: none !important; margin: 0; flex-shrink: 0; font-size: 11px; color: var(--acu-text-sub); font-weight: normal; background: var(--acu-badge-bg); padding: 2px 6px; border-radius: 4px; }
            .acu-preview-overlay .acu-card-preview-close { margin-left: auto; width: 34px; height: 34px; min-width: 34px; min-height: 34px; flex: 0 0 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--acu-text-sub); font-size: 16px; line-height: 1; box-shadow: none; }
            .acu-preview-overlay .acu-card-preview-close:hover,
            .acu-preview-overlay .acu-card-preview-close:focus-visible { border-color: var(--acu-border); background: var(--acu-table-hover); color: var(--acu-accent); }
            .acu-bookmark-icon { position: absolute; top: 8px; right: 8px; color: var(--acu-accent); cursor: pointer; font-size: 16px; opacity: 0.35; transition: opacity var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard); z-index: 10; }
            .acu-bookmark-icon:hover { opacity: 0.7; }
            .acu-bookmark-icon.bookmarked { color: var(--acu-accent); opacity: 1; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body,
            .acu-preview-overlay .acu-card-body { padding: 6px 12px; display: flex; flex-direction: column; gap: 0; font-size: var(--acu-font-size, 13px); flex: 1; }
            .acu-wrapper.acu-dice-ui-root .acu-card-row,
            .acu-preview-overlay .acu-card-row { display: block; padding: 7px 0; border-bottom: 1px solid var(--acu-border); cursor: pointer; overflow: hidden; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-wrapper.acu-dice-ui-root .acu-card-row:last-child,
            .acu-preview-overlay .acu-card-row:last-child { border-bottom: none; }
            .acu-wrapper.acu-dice-ui-root .acu-card-actions,
            .acu-preview-overlay .acu-card-actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 10px; border-top: 1px solid var(--acu-border); background: var(--acu-table-head); }
            .acu-action-item { padding: 4px 10px; font-size: 11px; border: 1px solid var(--acu-border); border-radius: 5px; background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; display: flex; align-items: center; gap: 4px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); white-space: nowrap; }
            .acu-action-item:hover { background: var(--acu-btn-hover); border-color: var(--acu-accent); color: var(--acu-accent); transform: translateY(-1px); }
            .acu-action-item:active { transform: translateY(0); }
            .acu-action-item.check-type { border-style: dashed; }
            .acu-action-item i { font-size: 10px; opacity: 0.7; }
            .acu-wrapper.acu-dice-ui-root .acu-card-row:hover,
            .acu-preview-overlay .acu-card-row:hover { background: var(--acu-table-hover); }
            .acu-wrapper.acu-dice-ui-root .acu-card-label,
            .acu-preview-overlay .acu-card-label { float: left !important; clear: left; width: auto !important; margin-right: 8px !important; color: var(--acu-text-sub); font-size: 0.9em; line-height: 1.5; padding-top: 0; }
            .acu-wrapper.acu-dice-ui-root .acu-hide-label .acu-card-label,
            .acu-preview-overlay .acu-hide-label .acu-card-label { display: none; }
            .acu-wrapper.acu-dice-ui-root .acu-hide-label .acu-card-value,
            .acu-preview-overlay .acu-hide-label .acu-card-value { width: 100% !important; }
            .acu-inline-dice-btn:hover { opacity: 1 !important; }
            .acu-wrapper.acu-dice-ui-root .acu-card-value,
            .acu-preview-overlay .acu-card-value { display: block; width: auto !important; margin: 0; text-align: left !important; word-break: break-all !important; white-space: pre-wrap !important; line-height: 1.5 !important; color: var(--acu-text-main); font-size: 1em; }
            .acu-tag-container { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 2px; }
            .acu-multi-attr-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; }
            .acu-badge { display: inline-block; padding: 1px 8px; border-radius: 12px; font-size: 0.9em; font-weight: 500; line-height: 1.2; }
            .acu-badge-green { background: var(--acu-success-bg); color: var(--acu-success-text); }
            .acu-badge-neutral { background: var(--acu-badge-bg); color: var(--acu-text-main); border: 1px solid var(--acu-border); }
            .acu-panel-footer { flex: 0 0 auto; padding: 8px; border-top: 1px solid var(--acu-border); background: var(--acu-table-head); display: flex; justify-content: center; align-items: center; gap: 5px; flex-wrap: wrap; }
            .acu-page-btn { padding: 4px 10px; min-width: 32px; height: 28px; border-radius: 5px; border: 1px solid var(--acu-border); background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-page-btn:hover:not(.disabled):not(.active) { background: var(--acu-btn-hover); transform: translateY(-1px); }
            .acu-page-btn.active { background: var(--acu-accent); color: var(--acu-button-text-on-accent, #fff); border-color: var(--acu-accent); font-weight: bold; }
            .acu-page-btn.disabled { opacity: 0.5; cursor: not-allowed; }
            .acu-page-info { font-size: 12px; color: var(--acu-text-sub); margin: 0 10px; }
            /* --- [重设计] 行动选项面板样式 - 叙事书页风 --- */
            .acu-option-panel {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 4px;
                background: var(--acu-bg-nav);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                margin-top: 0;
                margin-bottom: 4px;
                width: 100%;
                box-sizing: border-box;
                z-index: 31001;
                animation: acuFadeIn 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .acu-embedded-options-container {
                width: 100%;
                max-width: 100%;
                margin: 12px 0;
                padding: 0;
                clear: both;
                box-sizing: border-box;
                animation: acuFadeIn 0.3s ease;
            }

            .acu-opt-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11px;
                font-weight: 600;
                color: var(--acu-text-main);
                padding: 8px 0;
                border-bottom: 1px solid var(--acu-border);
                margin-bottom: 8px;
                cursor: pointer;
                user-select: none;
                transition: color 0.2s;
            }
            .acu-opt-header:hover {
                color: var(--acu-text-main);
            }
            .acu-opt-header > span {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                min-width: 0;
            }
            .acu-opt-chevron {
                flex: 0 0 auto;
                width: 8px;
                height: 8px;
                box-sizing: border-box;
                border-right: 2px solid currentColor;
                border-bottom: 2px solid currentColor;
                transform: rotate(45deg);
                transform-origin: center;
                transition: transform 0.16s ease;
            }
            .acu-option-panel.collapsed .acu-opt-chevron {
                transform: rotate(-45deg);
            }

            /* --- [重设计] 叙事条目风格按钮 --- */
            .acu-opt-btn,
            .acu-check-suggestion-btn {
                background: var(--acu-opt-bright-bg, var(--acu-opt-bg, var(--acu-btn-bg)));
                border: 1px solid transparent;
                padding: 3px 6px;
                border-radius: 4px;
                cursor: pointer;
                color: var(--acu-text-main);
                font-size: var(--acu-opt-font-size, 12px) !important;
                transition: all 0.15s;
                font-weight: normal;
                text-align: left;
                white-space: pre-wrap;
                word-break: break-word;
                min-height: 22px;
                line-height: 1.3;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                opacity: 1;
            }
            .acu-opt-btn:last-child,
            .acu-check-suggestion-btn:last-child {
                border-bottom: none;
            }
            .acu-opt-btn:hover,
            .acu-check-suggestion-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
                transform: translateX(3px);
            }
            .acu-opt-btn:active,
            .acu-check-suggestion-btn:active {
                background: var(--acu-btn-active-bg);
                color: var(--acu-btn-active-text);
            }

            .acu-wrapper.acu-dice-ui-root .acu-option-table-content {
                padding: 12px;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-grid {
                display: block !important;
                width: 100%;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-panel {
                margin: 0;
                gap: 6px;
                max-width: 100%;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-row {
                width: 100%;
                min-height: 32px;
                align-items: flex-start;
                gap: 10px;
                padding: 8px 10px;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-index {
                flex: 0 0 auto;
                color: var(--acu-accent);
                font-weight: 700;
                opacity: 0.9;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-text {
                flex: 1 1 auto;
                min-width: 0;
                white-space: pre-wrap;
                word-break: break-word;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-empty {
                padding: 18px;
                text-align: center;
                color: var(--acu-text-sub);
            }

            /* --- [新增] 折叠态样式 --- */
            .acu-option-panel.collapsed .acu-opt-btn,
            .acu-option-panel.collapsed .acu-check-suggestion-btn {
                display: none;
            }
            .acu-option-panel.collapsed .acu-opt-header {
                border-bottom: none;
                margin-bottom: 0;
            }
            @keyframes acuFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            /* [新增] 骰子结果隐藏动画：消除闪烁 */
            .acu-dice-result-revealing {
                opacity: 0 !important;
                transform: translateY(3px) !important;
                transition: opacity 0.18s ease-out, transform 0.18s ease-out !important;
            }
            .acu-dice-result-revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            /* 移动端性能优化：减少动画时长 */
            @media (max-width: 768px) {
                .acu-dice-result-revealing {
                    transition: opacity 0.15s ease-out, transform 0.15s ease-out !important;
                }
            }
            /* 尊重用户的减弱动画偏好设置 */
            @media (prefers-reduced-motion: reduce) {
                .acu-dice-result-revealing {
                    transition: none !important;
                    opacity: 1 !important;
                    transform: none !important;
                }
            }

            .acu-menu-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: transparent; z-index: 31110 !important; }
            /* 1. 菜单容器：背景色、边框、阴影全部跟随主题变量 */
.acu-cell-menu {
    position: fixed !important;
    background: var(--acu-menu-bg) !important;
    border: 1px solid var(--acu-border);
    box-shadow: 0 6px 20px var(--acu-shadow) !important;
    z-index: 31111 !important;
    border-radius: 8px;
    overflow: hidden;
    min-width: 150px;
    color: var(--acu-menu-text);
    padding: 4px;
}

/* 2. 菜单项：文字颜色跟随主题 */
.acu-cell-menu-item {
    width: 100%;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    gap: 12px;
    align-items: center;
    color: var(--acu-menu-text);
    font-weight: 500;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    text-align: left;
    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard);
}

/* 3. 悬停效果：使用主题定义的通用悬停色 */
.acu-cell-menu-item:hover,
.acu-cell-menu-item:focus-visible {
    background: var(--acu-table-hover);
    border-color: var(--acu-border);
    outline: none;
}
.acu-cell-menu-separator {
    height: 1px;
    margin: 4px 0;
    background: var(--acu-border);
}

/* 4. 特殊按钮优化 */
            .acu-cell-menu-item#act-delete,
            .acu-cell-menu-item[data-action="delete"] { color: var(--acu-error-text, #e74c3c); }
            .acu-cell-menu-item#act-delete:hover,
            .acu-cell-menu-item[data-action="delete"]:hover { background: var(--acu-error-bg, rgba(231, 76, 60, 0.1)); } /* 红色半透明背景，任何主题都适配 */
            .acu-cell-menu-item#act-close,
            .acu-cell-menu-item[data-action="close"] { color: var(--acu-text-sub); }

/* 5. 匹配状态标签 */
            .acu-match-full { color: var(--acu-success-text, #27ae60); }
            .acu-match-partial { color: var(--acu-warning-text, #f39c12); }

/* 6. 布局编辑完成按钮 */
            .acu-btn-finish-sort {
                background: rgba(255,255,255,0.2);
                color: var(--acu-button-text-on-accent, #fff);
                border: 1px solid rgba(255,255,255,0.4);
                padding: 4px 14px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-btn-finish-sort:hover, .acu-btn-finish-sort.hover {
                background: var(--acu-button-text-on-accent, #fff);
                color: var(--acu-accent);
            }

            .acu-edit-overlay { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; height: 100dvh; background: rgba(0,0,0,0.75) !important; z-index: 31200 !important; display: flex; justify-content: center !important; align-items: center !important; backdrop-filter: blur(2px); }
            .acu-edit-dialog { background: var(--acu-bg-panel); width: 95%; max-width: 500px; max-height: 95vh; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 15px 50px rgba(0,0,0,0.6); color: var(--acu-text-main); border: 1px solid var(--acu-border); overflow: hidden; flex-shrink: 0; }
            @media (min-width: 768px) { .acu-edit-dialog { max-width: 900px; width: 90%; } .acu-edit-dialog.acu-settings-dialog { max-width: 400px; width: 400px; } }
            .acu-edit-title { margin: 0; font-size: 16px; font-weight: bold; color: var(--acu-text-main); padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
            .acu-edit-icon-muted { opacity: 0.7; }
            .acu-edit-content { background: var(--acu-bg-panel); }
            .acu-settings-content-scroll { flex: 1; overflow-y: auto; padding: 15px; }
            .acu-card-edit-field { margin-bottom: 10px; }
            .acu-card-edit-label { display: block; font-size: 12px; color: var(--acu-accent); font-weight: bold; margin-bottom: 4px; }
            .acu-card-edit-input { width: 100% !important; padding: 10px !important; border: 1px solid var(--acu-border) !important; border-radius: 6px !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; box-sizing: border-box !important; font-size: 14px !important; line-height: 1.5 !important; appearance: none; -webkit-appearance: none; }
            .acu-card-edit-input:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-dialog select { padding: 6px 10px !important; border: 1px solid var(--acu-border) !important; border-radius: 6px !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; font-size: 13px !important; appearance: none; -webkit-appearance: none; cursor: pointer; }
            .acu-edit-dialog select:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-dialog select option { background: var(--acu-bg-panel) !important; color: var(--acu-text-main) !important; }
            .acu-edit-dialog input[type="text"], .acu-edit-dialog input[type="number"], .acu-edit-dialog input[type="search"], .acu-edit-dialog input:not([type]) { padding: 6px 10px !important; border: 1px solid var(--acu-border) !important; border-radius: 6px !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; font-size: 13px !important; box-sizing: border-box !important; }
            .acu-edit-dialog input:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-dialog input::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            .acu-card-edit-textarea { min-height: 40px; max-height: 500px; resize: none; overflow-y: hidden; }
            .acu-edit-textarea { width: 100%; height: auto; padding: 12px; border: 1px solid var(--acu-border) !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; border-radius: 6px; resize: vertical; box-sizing: border-box; font-size: 14px; line-height: 1.6; overflow-y: auto !important; }
            .acu-edit-textarea:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-textarea::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            @media (min-width: 768px) { .acu-edit-textarea { height: auto !important; font-size: 15px !important; } }
            .acu-edit-textarea:focus { outline: none !important; }
            .acu-dialog-btns { display: flex; justify-content: flex-end; gap: 20px; margin-top: 10px; }
            .acu-dialog-btn { background: none; border: 1px solid transparent; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 6px; color: var(--acu-text-sub); transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-dialog-btn:hover, .acu-dialog-btn:focus-visible { background: var(--acu-btn-bg); color: var(--acu-text-main); border-color: var(--acu-border); outline: none; }
            .acu-btn-confirm { color: var(--acu-success-text); } .acu-btn-confirm:hover, .acu-btn-confirm:focus-visible { opacity: 0.9; }
            /* --- [UI Optimization] PC-First Edit Mode Styles --- */
            .acu-order-controls { grid-column: 1 / -1; order: -2; display: none; width: 100%; text-align: left; background: var(--acu-accent); color: var(--acu-button-text-on-accent, var(--acu-text-main)); padding: 6px 12px; margin: 0 0 8px 0; border-radius: 4px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            .acu-order-controls.visible { display: flex; align-items: center; justify-content: space-between; }

            .acu-nav-container.editing-order { border: 2px solid var(--acu-accent); background: var(--acu-bg-panel); }
            .acu-nav-container.editing-order .acu-nav-btn, .acu-nav-container.editing-order .acu-action-btn { opacity: 1 !important; cursor: grab !important; border: 1px solid var(--acu-border); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .acu-nav-container.editing-order .acu-nav-btn:hover, .acu-nav-container.editing-order .acu-action-btn:hover { border-color: var(--acu-accent); transform: translateY(-1px); }

            .acu-swap-selected { background-color: var(--acu-accent) !important; color: var(--acu-button-text-on-accent, var(--acu-text-main)) !important; border-color: var(--acu-accent); box-shadow: 0 0 0 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.2); transform: scale(1.05); z-index: 10; }
            .acu-drag-over { border: 2px dashed var(--acu-accent); opacity: 0.5; transform: scale(0.95); background: rgba(var(--acu-accent-rgb), 0.1); }

            /* --- [PC Style] Unused Pool Optimization (工具架样式) --- */
            .acu-unused-pool {
                grid-column: 1 / -1;
                display: none;
                flex-wrap: wrap;
                gap: 8px;
                background: var(--acu-table-head); /* 使用表头背景色，更融合 */
                border: 1px dashed var(--acu-border); /* 虚线框表示这是编辑区域 */
                padding: 10px 15px;
                margin: 0 0 10px 0;
                border-radius: 8px;
                justify-content: flex-start;
                align-items: center;
                min-height: 50px;
                box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
            }
            .acu-unused-pool.visible { display: flex; animation: acuFadeIn 0.2s ease-out; }

            /* PC端清晰的文字引导 */
            .acu-unused-pool::before {
                content: "备选功能池 (拖拽图标到下方启用 ↘)";
                display: flex;
                align-items: center;
                height: 32px;
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                margin-right: 15px;
                padding-right: 15px;
                border-right: 1px solid var(--acu-border);
                white-space: nowrap;
                opacity: 0.8;
            }

            .acu-actions-group { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 4px; border-top: 1px solid var(--acu-border); padding-top: 8px; margin-top: 4px; min-height: calc(var(--acu-nav-button-size, 32px) + 4px); transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }

            /* [修复] 移动端顶部布局适配：强制提升顺序 */
            .acu-pos-top .acu-actions-group { order: -1; border-top: none; border-bottom: 1px dashed var(--acu-border); margin-top: 0; margin-bottom: 6px; padding-top: 0; padding-bottom: 8px; }

            /* [修复] 编辑模式下，备选池也跟随置顶 */
            .acu-pos-top .acu-unused-pool { order: -1; margin-bottom: 10px; border-bottom: 1px dashed var(--acu-border); }
            .acu-actions-group.dragging-over { background: rgba(127, 127, 127, 0.05); box-shadow: inset 0 0 10px rgba(0,0,0,0.05); }

            /* 仪表盘横向滚动模式 */
                .acu-dash-body.acu-dash-horizontal {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 15px;
                    height: 100%;
                    min-height: 0;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 10px;
                    box-sizing: border-box;
                }
                .acu-dash-body.acu-dash-horizontal > div {
                    flex: 0 0 280px;
                    min-width: 280px;
                    min-height: 0;
                    max-height: 100%;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                @media (min-width: 769px) {
                    .acu-dash-body.acu-dash-horizontal > div {
                        flex: 0 0 320px;
                        min-width: 320px;
                    }
                }
            /* Mobile adjustments to keep it usable there */
            @media (max-width: 768px) {
                .acu-unused-pool { justify-content: center; background: rgba(0,0,0,0.05); border: 1px dashed var(--acu-border); border-bottom: none; margin: 0 0 8px 0; border-radius: 6px; }
                .acu-unused-pool::before { display: block; width: 100%; text-align: center; margin-bottom: 4px; content: "可选功能池 (拖拽或点击)"; }
                .acu-order-controls { flex-direction: column; gap: 6px; text-align: center; }
            }
            .acu-actions-group.dragging-over { background: rgba(var(--acu-accent-rgb), 0.1); border-color: var(--acu-accent); }
            .acu-settings-item { margin-bottom: 15px; }
            .acu-settings-label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 13px; color: #ccc; }
            .acu-settings-val { float: right; color: #4cd964; font-size: 12px; }
            .acu-slider { width: 100%; height: 4px; background: #555; border-radius: 2px; outline: none; -webkit-appearance: none; }
            .acu-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer; }
            .acu-select { width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px; outline: none; }
            .acu-edit-overlay input[type="checkbox"].acu-checkbox { margin-right: 10px; accent-color: var(--acu-accent) !important; background: transparent !important; background-color: transparent !important; }
            .acu-btn-block { width: 100%; padding: 10px; background: #444; color: #eee; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }
            .acu-btn-block:hover { background: #555; color: #fff; }
            .acu-expand-trigger { background: var(--acu-bg-nav); border: 1px solid var(--acu-border); box-shadow: 0 2px 6px var(--acu-shadow); cursor: pointer; color: var(--acu-text-main); font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); z-index: 31005 !important; }
            .acu-expand-trigger:hover { background: var(--acu-btn-hover); transform: translateY(-1px); }
            .acu-col-bar { width: 100%; justify-content: center; padding: 8px 10px; border-radius: 6px; }
            .acu-col-pill { width: auto !important; padding: 6px 16px; border-radius: 50px; }
            .acu-col-floating { width: 48px !important; height: 48px !important; padding: 0; justify-content: center; border-radius: 50%; cursor: grab; touch-action: none; user-select: none; font-size: 16px; display: flex !important; visibility: visible !important; opacity: 1 !important; }
            .acu-col-floating span { display: none; }
            .acu-col-floating:hover { transform: translateY(-1px) scale(1.02); }
            .acu-col-floating:focus, .acu-col-floating:focus-visible { outline: none; box-shadow: var(--acu-focus-ring), 0 2px 6px var(--acu-shadow) !important; }
            .acu-col-floating:active, .acu-col-floating.acu-floating-dragging { cursor: grabbing; transform: scale(0.98); }
            /* [优化] 小眼睛图标悬停效果 */
            .acu-nav-toggle-btn:hover { opacity: 1 !important; transform: translateY(-50%) scale(1.2); color: var(--acu-accent); }
            .acu-align-right { margin-left: auto; align-self: flex-end; }
            .acu-align-center { 
                margin-left: auto !important; 
                margin-right: auto !important; 
            }
            .acu-align-left { margin-right: auto; margin-left: 0; align-self: flex-start; }
            .acu-nav-container.acu-left-mode .acu-actions-group { order: -1; margin-left: 0; margin-right: 10px; }
            #acu-btn-collapse { color: var(--acu-text-sub); }
            #acu-btn-collapse:hover { color: var(--acu-text-main); background: rgba(0,0,0,0.05); }
            @keyframes acu-breathe { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); color: #ff7e67; } 100% { opacity: 1; transform: scale(1); } } .acu-icon-breathe { animation: acu-breathe 3s infinite ease-in-out !important; display: inline-block; }

            @media (min-width: 769px) {
                .acu-wrapper.acu-dice-ui-root.acu-mode-viewport { bottom: max(12px, env(safe-area-inset-bottom)); }
                .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-nav-container { width: 100% !important; min-width: 0; max-width: 100%; box-sizing: border-box; margin: 0; border-radius: 0 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; border: 1px solid var(--acu-border); padding: 6px 10px; background: var(--acu-bg-nav) !important; }
                .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-data-display { bottom: calc(100% + 12px) !important; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important; }
                .acu-nav-container { display: flex; flex-wrap: wrap !important; gap: 6px !important; padding: 6px 10px; grid-template-columns: none !important; flex-direction: row !important; justify-content: flex-start !important; align-items: center !important; height: auto !important; }
                .acu-nav-container .acu-nav-btn { width: fit-content !important; flex: 0 0 auto !important; height: var(--acu-nav-button-size, 32px) !important; padding: 0 var(--acu-nav-button-padding-x, 12px); font-size: var(--acu-nav-font-size, 13px) !important; min-width: auto !important; }
                .acu-nav-btn span { max-width: 200px; }
                .acu-action-btn { flex: 0 0 var(--acu-nav-button-size, 32px) !important; width: var(--acu-nav-button-size, 32px) !important; height: var(--acu-nav-button-size, 32px) !important; font-size: var(--acu-nav-icon-size, 14px) !important; background: transparent !important; color: var(--acu-text-sub) !important; border-radius: 6px; border: 1px solid transparent; }
                .acu-action-btn:hover { background: var(--acu-btn-hover) !important; color: var(--acu-text-main) !important; transform: translateY(-1px); box-shadow: none; }
                #acu-btn-save-global { color: var(--acu-accent) !important; }
                #acu-btn-save-global:hover { background: var(--acu-accent) !important; color: var(--acu-btn-active-text) !important; }
                .acu-order-controls { margin: 0 0 8px 0; padding: 4px; }
                .acu-actions-group { width: auto !important; margin-left: auto !important; border-top: none !important; border-bottom: none !important; padding: 0; margin-top: 0 !important; margin-bottom: 0 !important; gap: 4px !important; background: transparent; justify-content: flex-end; order: 9999 !important; display: flex; }
                .acu-pos-top .acu-actions-group { order: -1 !important; margin-left: 0 !important; margin-right: 10px !important; justify-content: flex-start !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned.acu-mode-embedded .acu-nav-container { width: 100% !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-container { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(clamp(118px, calc(var(--acu-nav-button-size, 32px) + var(--acu-nav-font-size, 13px) + var(--acu-nav-font-size, 13px) + 70px), 168px), 1fr)) !important; flex-wrap: initial !important; justify-content: stretch !important; align-items: center !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-container .acu-nav-btn { width: 100% !important; min-width: 0 !important; flex: none !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-btn span { max-width: 100%; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-actions-group { grid-column: span 2 / -1 !important; justify-self: end; width: auto !important; margin-left: 0 !important; margin-right: 0 !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-container.acu-pos-top .acu-actions-group { grid-column: 1 / span 2 !important; justify-self: start; margin-right: 0 !important; }
            }
            @media (max-width: 768px) {
                .acu-wrapper.acu-dice-ui-root .acu-panel-content { -webkit-overflow-scrolling: touch !important; overscroll-behavior-y: auto; }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-container {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    max-height: clamp(152px, 28dvh, 196px);
                    overflow: hidden !important;
                    overscroll-behavior: contain;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-items {
                    display: grid;
                    grid-template-columns: repeat(var(--acu-grid-cols, 3), minmax(0, 1fr));
                    gap: 5px;
                    align-content: start;
                    flex: 1 1 auto;
                    min-height: 0;
                    overflow-x: hidden !important;
                    overflow-y: auto !important;
                    overscroll-behavior-y: contain;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-items::-webkit-scrollbar {
                    width: 0 !important;
                    height: 0 !important;
                    display: none !important;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-items .acu-nav-btn {
                    width: 100%;
                    min-width: 0;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-actions-group {
                    position: relative;
                    bottom: auto;
                    z-index: 2;
                    flex: 0 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 6px !important;
                    padding-top: 6px;
                    border-top: 1px solid var(--acu-border);
                    background: var(--acu-bg-nav);
                    box-shadow: none;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-container.acu-pos-top .acu-actions-group {
                    order: -1 !important;
                    margin-top: 0 !important;
                    margin-bottom: 6px !important;
                    padding-top: 0;
                    padding-bottom: 6px;
                    border-top: none !important;
                    border-bottom: 1px solid var(--acu-border) !important;
                }
                .acu-wrapper.acu-dice-ui-root .acu-data-card,
                .acu-preview-overlay .acu-data-card { box-shadow: none !important; border: 1px solid var(--acu-border); transform: translateZ(0); }
                .acu-wrapper.acu-dice-ui-root .acu-data-card:hover,
                .acu-preview-overlay .acu-data-card:hover { transform: none !important; box-shadow: none !important; }
                .acu-nav-btn:hover { transform: none !important; }
            }
            `;
