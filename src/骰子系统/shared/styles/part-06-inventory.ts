// @ts-nocheck
/**
 * part-06-inventory.ts — part-06-inventory.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（2）：效果输入区域样式, 物品栏可视化
 */
export const STYLES_PART_06_INVENTORY = `/* ========== 效果输入区域样式 ========== */
    .acu-effect-inputs-area {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--acu-border);
    }
    .acu-effect-input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 6px;
    }
    .acu-effect-input-label {
        font-size: 11px;
        color: var(--acu-text-sub);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .acu-effect-preview-text {
        font-size: 10px;
        color: var(--acu-text-sub);
        opacity: 0.8;
        margin-top: 2px;
        text-align: right;
    }
    .acu-effect-preview-text span {
        margin-left: 8px;
    }
    .acu-effect-preview-text span.positive { color: var(--acu-success-text); }
    .acu-effect-preview-text span.negative { color: var(--acu-failure-text); }

    /* ========== 物品栏可视化 ========== */
    .acu-inventory-overlay,
    .acu-gacha-overlay {
        position: fixed;
        inset: 0;
        z-index: 31140;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 18px;
        background:
            radial-gradient(circle at top, color-mix(in srgb, var(--acu-accent) 16%, transparent), transparent 44%),
            linear-gradient(180deg, rgba(10, 16, 26, 0.82), rgba(5, 8, 14, 0.9));
        backdrop-filter: blur(5px);
    }
    .acu-gacha-overlay {
        z-index: 31145;
    }
    .acu-inventory-shell,
    .acu-gacha-shell {
        width: min(460px, 92vw);
        height: min(88vh, 920px);
        max-width: 100vw;
        max-height: 100dvh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 36%, var(--acu-border));
        border-radius: 18px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 92%, #0c1726) 0%, color-mix(in srgb, var(--acu-bg-panel) 96%, #08111d) 100%);
        box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
    .acu-gacha-shell {
        width: min(560px, 94vw);
        height: auto;
        max-height: min(88vh, 920px);
    }
    .acu-inventory-window-header {
        flex-shrink: 0;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.06)),
            linear-gradient(180deg, color-mix(in srgb, var(--acu-table-head) 92%, #111b2a), color-mix(in srgb, var(--acu-bg-panel) 94%, #08111d));
        border-bottom: 1px solid color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
    }
    .acu-inventory-window-header .acu-header-actions {
        gap: 10px;
        flex-wrap: nowrap;
    }
    .acu-inventory-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        min-height: 0;
        padding: 10px 12px 12px;
        color: var(--acu-text-main);
        touch-action: pan-y;
    }
    .acu-gacha-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-height: 0;
        overflow: hidden auto;
        padding: 14px;
        color: var(--acu-text-main);
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }
    .acu-gacha-overlay .acu-header-actions > button,
    .acu-gacha-settings-header-actions > button,
    .acu-gacha-shard-shop .acu-inventory-detail-header-actions > button {
        width: 34px;
        height: 34px;
        min-width: 34px;
        min-height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 34px;
    }
    .acu-gacha-stat-row,
    .acu-gacha-wallet-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }
    .acu-gacha-shard-shop-open {
        margin-left: auto;
        min-height: 30px;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-btn-active-bg) 30%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 14%, var(--acu-btn-bg));
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 800;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-fortune-clear {
        min-height: 30px;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-error-text) 32%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-error-bg, rgba(231, 76, 60, 0.15)) 76%, var(--acu-btn-bg));
        color: var(--acu-error-text);
        font-size: 12px;
        font-weight: 800;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-fortune-clear:hover {
        border-color: var(--acu-error-text);
        background: var(--acu-error-text);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent));
        opacity: 1;
    }
    .acu-gacha-fortune-clear i {
        margin: 0;
    }
    .acu-gacha-shard-shop-open,
    .acu-gacha-shard-shop-open span,
    .acu-gacha-shard-shop-open strong,
    .acu-gacha-fortune-clear,
    .acu-gacha-fortune-clear span {
        min-width: 0;
    }
    .acu-gacha-shard-shop-open strong {
        font-size: inherit;
    }
    .acu-gacha-shard-shop-open:hover {
        border-color: var(--acu-btn-active-bg);
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        opacity: 1;
    }
    .acu-gacha-draw-row {
        position: relative;
        bottom: 0;
        flex-shrink: 0;
        z-index: 4;
        display: grid;
        grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
        gap: 10px;
        padding: 8px 14px 10px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-bg-panel) 72%, transparent), var(--acu-bg-panel) 42%),
            color-mix(in srgb, var(--acu-bg-panel) 94%, var(--acu-card-bg));
    }
    .acu-gacha-draw-btn {
        min-width: 0;
        min-height: 50px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px;
        border-radius: 14px;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.1;
        border: 1px solid color-mix(in srgb, var(--acu-btn-active-bg) 24%, transparent);
        background: color-mix(in srgb, var(--acu-btn-active-bg) 12%, var(--acu-card-bg));
        color: var(--acu-accent);
        box-shadow: 0 8px 20px rgba(0, 0, 0, .18);
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-draw-btn:hover {
        border-color: var(--acu-btn-active-bg);
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        opacity: 1;
        transform: translateY(-1px);
    }
    .acu-gacha-draw-btn i {
        font-size: 18px;
    }
    .acu-gacha-draw-btn strong {
        font-size: 18px;
    }
    .acu-gacha-draw-ten {
        min-height: 56px;
        font-size: 17px;
    }
    .acu-gacha-stat-row .acu-badge,
    .acu-gacha-wallet-row .acu-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .acu-gacha-fortune-badge strong {
        color: var(--acu-text-main);
        font-size: inherit;
    }
    .acu-gacha-fortune-progress {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
        border-radius: 12px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
    }
    .acu-gacha-fortune-progress-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-width: 0;
        color: var(--acu-text-main);
        font-size: 13px;
        font-weight: 800;
    }
    .acu-gacha-fortune-progress-head span,
    .acu-gacha-fortune-progress-head strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-fortune-progress-head span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-accent);
        flex-shrink: 0;
    }
    .acu-gacha-fortune-progress-head strong {
        color: var(--acu-text-main);
        text-align: right;
    }
    .acu-gacha-progress-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }
    .acu-gacha-progress-item {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 9px 10px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 14%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 68%, transparent);
    }
    .acu-gacha-progress-label {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;
        font-size: 11px;
        color: var(--acu-text-sub);
    }
    .acu-gacha-progress-label span,
    .acu-gacha-progress-label strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-progress-label strong {
        color: var(--acu-text-main);
        font-size: 12px;
    }
    .acu-gacha-progress-bar {
        width: 100%;
        height: 6px;
        overflow: hidden;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-border) 55%, transparent);
    }
    .acu-gacha-progress-bar span {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--acu-accent), color-mix(in srgb, var(--acu-accent) 70%, #b9f56c));
        transition: none;
    }
    .acu-gacha-active-progress.is-reward-flash {
        animation: acu-gacha-reward-flash 900ms ease-out;
        border-color: color-mix(in srgb, var(--acu-accent) 48%, var(--acu-border));
    }
    .acu-gacha-active-progress.is-reward-flash .acu-gacha-progress-bar span {
        transition-duration: 160ms;
    }
    @keyframes acu-gacha-reward-flash {
        0% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--acu-accent) 34%, transparent);
            transform: translateY(0);
        }
        35% {
            box-shadow: 0 0 0 4px color-mix(in srgb, var(--acu-accent) 18%, transparent);
            transform: translateY(-1px);
        }
        100% {
            box-shadow: 0 0 0 0 transparent;
            transform: translateY(0);
        }
    }
    .acu-gacha-progress-note {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 10px;
        line-height: 1.35;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-pool-tabs {
        flex: 0 0 auto;
        display: flex;
        flex-wrap: nowrap;
        gap: 2px;
        min-height: 42px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0 0 1px 0;
        align-items: flex-end;
        border-bottom: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        scrollbar-width: none;
    }
    .acu-gacha-pool-tabs::-webkit-scrollbar {
        display: none;
    }
    .acu-gacha-pool-tab {
        flex: 0 0 auto;
        min-width: 78px;
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 8px 6px;
        border: 0;
        border-bottom: 3px solid transparent;
        background: transparent;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.15;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color .16s ease, border-color .16s ease, background-color .16s ease;
    }
    .acu-gacha-pool-tab i {
        flex-shrink: 0;
        font-size: 11px;
    }
    .acu-gacha-pool-tab:hover {
        color: var(--acu-text-main);
        background: color-mix(in srgb, var(--acu-table-hover) 70%, transparent);
    }
    .acu-gacha-pool-tab.active {
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        border-bottom-color: var(--acu-btn-active-text, #fff);
        background: var(--acu-btn-active-bg, var(--acu-accent));
        box-shadow:
            inset 0 -3px 0 var(--acu-btn-active-text, rgba(255, 255, 255, .95)),
            0 0 0 1px color-mix(in srgb, var(--acu-btn-active-text, #fff) 36%, transparent),
            0 8px 18px color-mix(in srgb, var(--acu-accent) 32%, transparent);
    }
    .acu-custom-table-name-icon.has-image {
        background-image: none !important;
    }
    .acu-custom-async-image {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: inherit;
        background: transparent;
        pointer-events: none;
        user-select: none;
    }
    .acu-gacha-settings-overlay,
    .acu-gacha-item-editor-overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100dvh;
        z-index: 31340 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(0, 0, 0, .72);
    }
    .acu-gacha-item-editor-overlay {
        z-index: 31355 !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        background: rgba(0, 0, 0, .72);
    }
    .acu-gacha-name-dialog-overlay {
        z-index: 31360 !important;
        height: 100dvh;
    }
    .acu-gacha-catalog-dialog-overlay,
    .acu-gacha-confirm-overlay {
        z-index: 31380 !important;
    }
    .acu-gacha-settings-dialog,
    .acu-gacha-item-editor,
    .acu-gacha-name-dialog {
        width: min(920px, 94vw);
        max-height: min(88dvh, 920px);
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
        box-shadow: 0 22px 60px rgba(0, 0, 0, .42);
        color-scheme: light;
    }
    .acu-gacha-item-editor {
        width: min(720px, 94vw);
        max-height: min(88vh, 920px);
        transform: translateZ(0);
    }
    .acu-gacha-name-dialog {
        width: min(420px, 92vw);
    }
    .acu-gacha-settings-header,
    .acu-gacha-settings-footer,
    .acu-gacha-settings-section-head {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    .acu-gacha-settings-header {
        padding-bottom: 10px;
        border-bottom: 1px solid var(--acu-border);
    }
    .acu-gacha-settings-title {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 17px;
        font-weight: 800;
    }
    .acu-gacha-settings-header-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex: 0 0 auto;
    }
    .acu-gacha-settings-body,
    .acu-gacha-item-editor-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding-right: 2px;
    }
    .acu-gacha-settings-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .acu-gacha-settings-items-section {
        gap: 10px;
    }
    .acu-gacha-settings-items-section > .acu-gacha-settings-section-head {
        display: grid;
        grid-template-columns: minmax(150px, max-content) minmax(0, 1fr);
        align-items: center;
        gap: 14px;
        padding: 0 0 2px;
        border: 0;
        border-radius: 0;
        background: transparent;
    }
    .acu-gacha-settings-section-head > div:first-child {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .acu-gacha-settings-section-head strong {
        font-size: 14px;
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-section-head span {
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.35;
    }
    .acu-gacha-settings-section-head .acu-dialog-btn,
    .acu-gacha-settings-toolbar .acu-dialog-btn {
        flex: 0 0 auto !important;
        width: auto !important;
        min-width: 124px;
        min-height: 34px;
        padding: 7px 12px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
    }
    .acu-gacha-settings-pool-list,
    .acu-gacha-settings-item-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .acu-gacha-settings-pool-item,
    .acu-gacha-settings-item {
        min-width: 0;
        display: grid;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 86%, var(--acu-accent));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-card-bg) 90%, transparent);
    }
    .acu-gacha-settings-pool-item {
        grid-template-columns: 28px minmax(0, 1fr) auto;
        margin-bottom: 0;
    }
    .acu-gacha-settings-item {
        grid-template-columns: 22px 38px minmax(0, 1fr) auto;
        gap: 8px;
        padding: 9px 10px;
        border-radius: 9px;
        cursor: pointer;
    }
    .acu-gacha-settings-item:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 72%, transparent);
        outline-offset: 2px;
    }
    .acu-gacha-settings-item .acu-gacha-settings-actions {
        cursor: auto;
    }
    .acu-gacha-settings-item .acu-gacha-item-handle {
        cursor: grab;
    }
    .acu-gacha-settings-pool-item.is-disabled,
    .acu-gacha-settings-item.is-disabled,
    .acu-gacha-settings-item[style*="display: none"] {
        opacity: .55;
    }
    .acu-gacha-settings-pool-main,
    .acu-gacha-settings-item-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .acu-gacha-settings-pool-name,
    .acu-gacha-settings-item-name {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        color: var(--acu-text-main);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
    }
    .acu-gacha-settings-pool-name span,
    .acu-gacha-settings-item-name span {
        flex: 0 0 auto;
        padding: 1px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 18%, transparent);
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
    }
    .acu-gacha-settings-pool-meta,
    .acu-gacha-settings-item-meta,
    .acu-gacha-settings-item-desc {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.35;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-settings-item-custom-fields {
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
    }
    .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview {
        max-height: 42px;
        overflow: hidden;
    }
    .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-chip,
    .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview-more {
        max-width: min(100%, 220px);
    }
    .acu-gacha-settings-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
    }
    .acu-gacha-settings-inline-actions {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .acu-gacha-settings-more {
        position: relative;
        display: none;
    }
    .acu-gacha-settings-more > summary {
        list-style: none;
    }
    .acu-gacha-settings-more > summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-settings-more-menu {
        position: absolute;
        right: 0;
        top: calc(100% + 6px);
        z-index: 3;
        min-width: 116px;
        display: grid;
        gap: 4px;
        padding: 6px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 76%, transparent);
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-bg-panel) 96%, #000);
        box-shadow: 0 12px 26px rgba(0, 0, 0, .36);
    }
    .acu-gacha-settings-more:not([open]) .acu-gacha-settings-more-menu {
        display: none;
    }
    .acu-gacha-settings-more-menu button {
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--acu-text-main);
        padding: 6px 8px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        text-align: left;
    }
    .acu-gacha-settings-more-menu button:hover {
        background: color-mix(in srgb, var(--acu-table-hover) 80%, transparent);
    }
    .acu-gacha-settings-more-menu button.danger {
        color: var(--acu-error-text);
    }
    .acu-gacha-pool-all-fixed,
    .acu-gacha-settings-toolbar,
    .acu-gacha-settings-search {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .acu-gacha-pool-all-fixed {
        justify-content: center;
        width: 44px;
        height: 24px;
        flex: 0 0 44px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 999px;
        color: var(--acu-text-sub);
        background: color-mix(in srgb, var(--acu-btn-bg) 70%, transparent);
        font-size: 10px;
        font-weight: 800;
    }
    .acu-gacha-pool-all-toggle {
        flex: 0 0 44px;
        margin: 0;
    }
    .acu-gacha-pool-handle,
    .acu-gacha-pool-handle-placeholder,
    .acu-gacha-item-handle {
        width: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--acu-text-sub);
        touch-action: none;
    }
    .acu-gacha-settings-items-section.is-searching .acu-gacha-item-handle {
        opacity: .38;
        cursor: not-allowed;
    }
    .acu-gacha-settings-item-icon {
        width: 34px;
        aspect-ratio: 1 / 1;
        height: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 18px;
        overflow: hidden;
    }
    .acu-gacha-settings-toolbar {
        width: 100%;
        min-width: 0;
        display: grid;
        grid-template-columns: repeat(3, minmax(104px, max-content)) minmax(220px, 1fr);
        align-items: center;
        justify-content: stretch;
        gap: 8px;
    }
    .acu-gacha-settings-toolbar .acu-dialog-btn {
        min-width: 124px;
        justify-content: center;
    }
    .acu-gacha-settings-search {
        width: 100%;
        min-width: 0;
        justify-self: end;
        min-height: 34px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 10px;
        border: 1px solid var(--acu-border);
        border-radius: 9px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-sub);
    }
    .acu-gacha-settings-dialog .acu-gacha-settings-search input.acu-gacha-settings-item-search {
        width: 100%;
        min-width: 0;
        height: 100%;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        outline: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--acu-text-main) !important;
        font: inherit !important;
        font-size: 12px !important;
    }
    .acu-gacha-settings-filter {
        width: 100%;
        min-width: 0;
        min-height: 34px;
        max-width: none;
        border: 1px solid var(--acu-border);
        border-radius: 9px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        padding: 0 28px 0 10px;
        font: inherit;
        font-size: 12px;
        outline: 0;
        appearance: none;
        -webkit-appearance: none;
        background-image: linear-gradient(45deg, transparent 50%, var(--acu-text-sub) 50%), linear-gradient(135deg, var(--acu-text-sub) 50%, transparent 50%);
        background-position: calc(100% - 15px) 50%, calc(100% - 10px) 50%;
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
    }
    .acu-gacha-settings-filter:focus {
        border-color: color-mix(in srgb, var(--acu-accent) 70%, var(--acu-border));
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-settings-filter option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-filter-menu {
        position: relative;
        min-width: 104px;
        min-height: 34px;
    }
    .acu-gacha-settings-filter-trigger {
        width: 100%;
        min-height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 7px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 84%, transparent);
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-btn-bg) 78%, transparent);
        color: var(--acu-text-main);
        padding: 0 10px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
    }
    .acu-gacha-settings-filter-trigger > i:first-child {
        color: var(--acu-text-sub);
        font-size: 11px;
    }
    .acu-gacha-settings-filter-menu-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .acu-gacha-settings-filter-chevron {
        color: var(--acu-text-sub);
        font-size: 10px;
        transition: transform .16s ease;
    }
    .acu-gacha-settings-filter-menu.is-open .acu-gacha-settings-filter-chevron {
        transform: rotate(180deg);
    }
    .acu-gacha-settings-filter-menu.is-active .acu-gacha-settings-filter-trigger,
    .acu-gacha-settings-filter-trigger:hover,
    .acu-gacha-settings-filter-trigger:focus-visible {
        border-color: color-mix(in srgb, var(--acu-accent) 72%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-accent) 12%, var(--acu-btn-bg));
        outline: 0;
    }
    .acu-gacha-settings-filter-menu-list {
        position: absolute;
        right: 0;
        top: calc(100% + 7px);
        z-index: 4;
        min-width: 168px;
        display: none;
        gap: 4px;
        padding: 6px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 76%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-bg-panel) 96%, #000);
        box-shadow: 0 14px 28px rgba(0, 0, 0, .38);
    }
    .acu-gacha-settings-filter-menu.is-open .acu-gacha-settings-filter-menu-list {
        display: grid;
    }
    .acu-gacha-settings-filter-option {
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--acu-text-main);
        padding: 6px 8px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        text-align: left;
    }
    .acu-gacha-settings-filter-option i {
        width: 14px;
        color: var(--acu-text-sub);
        text-align: center;
    }
    .acu-gacha-settings-filter-option:hover,
    .acu-gacha-settings-filter-option.active {
        background: color-mix(in srgb, var(--acu-accent) 16%, var(--acu-table-hover));
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-filter-option.active i {
        color: var(--acu-accent);
    }
    .acu-gacha-settings-pool-tabs {
        min-height: auto;
        gap: 6px;
        align-items: center;
        padding: 0 0 6px;
        border-bottom-color: color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
    }
    .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab {
        min-width: 72px;
        min-height: 32px;
        padding: 6px 10px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 78%, transparent);
        border-radius: 8px;
        background: color-mix(in srgb, var(--acu-btn-bg) 74%, transparent);
        font-size: 12px;
    }
    .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab.active {
        border-color: color-mix(in srgb, var(--acu-accent) 72%, var(--acu-border));
        background: var(--acu-btn-active-bg, var(--acu-accent));
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--acu-accent) 22%, transparent);
    }
    .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab.active i {
        color: inherit;
    }
    .acu-gacha-confirm-overlay .acu-import-warning-icon.danger,
    .acu-gacha-confirm-overlay .acu-import-confirm-btn.danger {
        background: var(--acu-error-bg) !important;
        border-color: var(--acu-error-text) !important;
        color: var(--acu-error-text) !important;
    }
    .acu-gacha-name-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
    }
    .acu-gacha-name-field input {
        min-height: 42px;
        border: 1px solid var(--acu-border);
        border-radius: 10px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        padding: 8px 10px;
        font: inherit;
        outline: none;
    }
    .acu-gacha-name-field input:focus {
        border-color: var(--acu-accent);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-item-editor-body {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: hidden auto;
    }
    .acu-gacha-item-editor-body label,
    .acu-gacha-item-pools,
    .acu-gacha-item-flags {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 700;
    }
    .acu-gacha-item-editor-body label > span,
    .acu-gacha-item-pools > span {
        color: var(--acu-text-sub);
        line-height: 1.2;
    }
    .acu-gacha-item-editor-body label.wide,
    .acu-gacha-item-pools.wide,
    .acu-gacha-item-flags.wide,
    .acu-gacha-item-checkbox.wide {
        grid-column: 1 / -1;
    }
    /* 自定义物品编辑器：字段名行 + 值行的统一两行布局 */
    .acu-gacha-item-labeled-field.wide,
    .acu-gacha-item-custom-field-block.wide,
    .acu-gacha-custom-field-suggestions.wide {
        grid-column: 1 / -1;
    }
    .acu-gacha-item-labeled-field {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .acu-gacha-item-label-line,
    .acu-gacha-custom-field-key-line {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
    }
    .acu-gacha-item-labeled-field > label {
        margin: 0;
    }
    .acu-gacha-item-field-label-text {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.2;
        overflow-wrap: anywhere;
    }
    .acu-gacha-item-label-edit {
        width: 34px;
        min-width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
    }
    .acu-gacha-item-custom-field-block {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .acu-gacha-item-custom-field-block .acu-gacha-custom-field-rows:empty {
        display: none;
    }
    .acu-gacha-item-custom-field-block .acu-gacha-custom-field-add {
        align-self: stretch;
        justify-content: center;
    }
    .acu-gacha-item-editor-body input,
    .acu-gacha-item-editor-body select,
    .acu-gacha-item-editor-body textarea {
        width: 100%;
        min-width: 0;
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        background: color-mix(in srgb, var(--acu-btn-bg) 96%, var(--acu-bg-panel)) !important;
        color: var(--acu-text-main) !important;
        -webkit-text-fill-color: var(--acu-text-main);
        padding: 8px 9px;
        font: inherit;
        font-size: 12px;
        box-shadow: none !important;
        color-scheme: light;
        forced-color-adjust: none;
        appearance: none;
        -webkit-appearance: none;
    }
    .acu-gacha-item-editor-body input:focus,
    .acu-gacha-item-editor-body select:focus,
    .acu-gacha-item-editor-body textarea:focus {
        outline: 0;
        border-color: color-mix(in srgb, var(--acu-accent) 70%, var(--acu-border));
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 18%, transparent) !important;
    }
    .acu-gacha-item-editor-body input[type="file"] {
        min-height: 38px;
        padding: 6px;
        cursor: pointer;
    }
    .acu-gacha-item-editor-body input[type="file"]::file-selector-button {
        margin-right: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 45%, var(--acu-border));
        border-radius: 7px;
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-btn-bg));
        color: var(--acu-text-main);
        padding: 5px 9px;
        font: inherit;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
    }
    .acu-gacha-item-editor-body select {
        padding-right: 28px;
        background-image: linear-gradient(45deg, transparent 50%, var(--acu-text-sub) 50%), linear-gradient(135deg, var(--acu-text-sub) 50%, transparent 50%);
        background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%;
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
    }
    .acu-gacha-item-editor-body option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-gacha-item-editor-body input::placeholder,
    .acu-gacha-item-editor-body textarea::placeholder,
    .acu-gacha-settings-search input::placeholder {
        color: color-mix(in srgb, var(--acu-text-sub) 78%, transparent);
        -webkit-text-fill-color: color-mix(in srgb, var(--acu-text-sub) 78%, transparent);
    }
    .acu-gacha-item-editor-body textarea {
        resize: vertical;
        min-height: 76px;
    }
    .acu-gacha-item-pools > div {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
    }
    .acu-gacha-item-flags {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    .acu-gacha-icon-editor-card {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: minmax(92px, 112px) minmax(0, 1fr);
        gap: 12px;
        align-items: start;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 82%, var(--acu-accent));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 88%, transparent);
    }
    .acu-gacha-icon-editor-preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        min-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 28%, var(--acu-border));
        border-radius: 14px;
        background:
            linear-gradient(135deg, color-mix(in srgb, var(--acu-accent) 14%, transparent), transparent),
            color-mix(in srgb, var(--acu-btn-bg) 82%, transparent);
        color: var(--acu-text-main);
        font-size: 30px;
        overflow: hidden;
    }
    .acu-gacha-icon-editor-fields {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
    }
    .acu-gacha-icon-editor-note {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 600;
        line-height: 1.45;
    }
    .acu-gacha-custom-fields {
        grid-column: 1 / -1;
        border: 1px solid color-mix(in srgb, var(--acu-border) 86%, var(--acu-accent));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 90%, transparent);
        overflow: hidden;
    }
    .acu-gacha-custom-fields summary {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        color: var(--acu-text-main);
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-custom-fields summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-custom-fields summary::after {
        content: '\f078';
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        transition: transform .14s ease, color .14s ease;
    }
    .acu-gacha-custom-fields[open] summary::after {
        transform: rotate(180deg);
        color: var(--acu-accent);
    }
    .acu-gacha-custom-fields summary > span {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 850;
    }
    .acu-gacha-custom-fields summary small {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
        text-align: right;
    }
    .acu-gacha-custom-field-panel {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 0 12px 12px;
    }
    .acu-gacha-custom-field-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding-top: 10px;
        border-top: 1px solid color-mix(in srgb, var(--acu-border) 70%, transparent);
    }
    .acu-gacha-custom-field-toolbar > div {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .acu-gacha-custom-field-toolbar strong {
        color: var(--acu-text-main);
        font-size: 12px;
        line-height: 1.2;
    }
    .acu-gacha-custom-field-toolbar small {
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 650;
        line-height: 1.35;
    }
    .acu-gacha-target-table-field {
        margin: 0;
    }
    .acu-gacha-target-column-toolbar {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        padding-top: 2px;
    }
    .acu-gacha-target-column-toolbar strong {
        color: var(--acu-text-main);
        font-size: 12px;
        line-height: 1.2;
    }
    .acu-gacha-target-column-toolbar small {
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 650;
        line-height: 1.35;
        text-align: right;
    }
    .acu-gacha-target-column-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }
    .acu-gacha-target-column-field {
        margin: 0;
    }
    .acu-gacha-custom-field-add {
        flex: 0 0 auto;
        min-height: 32px;
        padding: 6px 10px;
        font-size: 11px;
    }
    .acu-gacha-custom-field-add:disabled {
        opacity: .52;
        cursor: not-allowed;
    }
    .acu-gacha-custom-field-rows {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .acu-gacha-custom-field-row {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
    }
    .acu-gacha-custom-field-row label {
        margin: 0;
    }
    .acu-gacha-custom-field-value {
        min-height: 38px;
        max-height: min(32dvh, 220px);
        overflow: auto;
        resize: vertical;
    }
    .acu-gacha-custom-field-remove {
        width: 34px;
        min-width: 34px;
        height: 34px;
        border: 1px solid color-mix(in srgb, var(--acu-error-border) 72%, var(--acu-border));
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-error-bg) 42%, var(--acu-btn-bg));
        color: color-mix(in srgb, var(--acu-error-text) 80%, var(--acu-text-main));
        cursor: pointer;
        transition: border-color .14s ease, background-color .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-remove:hover:not(:disabled) {
        border-color: var(--acu-error-text);
        background: color-mix(in srgb, var(--acu-error-bg) 58%, var(--acu-btn-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-custom-field-remove:disabled {
        opacity: .48;
        cursor: not-allowed;
    }
    .acu-gacha-custom-field-suggestions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }
    .acu-gacha-custom-field-suggestions > span {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 800;
    }
    .acu-gacha-custom-field-suggestion-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-width: 0;
    }
    .acu-gacha-custom-field-suggestion {
        max-width: 100%;
        min-height: 30px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 36%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 10%, var(--acu-btn-bg));
        color: var(--acu-text-main);
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 800;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        transition: border-color .14s ease, background-color .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-suggestion:hover {
        border-color: var(--acu-accent);
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-btn-bg));
    }
    .acu-gacha-custom-field-suggestion-empty {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-style: normal;
        font-weight: 650;
    }
    .acu-gacha-item-pool-option,
    .acu-gacha-item-checkbox {
        flex-direction: row !important;
        align-items: center;
        gap: 6px !important;
    }
    .acu-gacha-item-pool-option {
        width: auto !important;
        min-height: 34px;
        padding: 6px 10px;
        border: 1px solid var(--acu-border);
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-btn-bg) 86%, transparent);
        color: var(--acu-text-sub);
        transition: border-color .14s ease, background-color .14s ease, color .14s ease;
    }
    .acu-gacha-item-pool-option:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-accent) 10%, var(--acu-btn-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-item-pool-option:has(input:checked) {
        border-color: color-mix(in srgb, var(--acu-accent) 72%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-btn-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-item-pool-option input,
    .acu-gacha-item-checkbox input {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
        margin: 0;
        padding: 0;
        border-radius: 6px;
        border: 1px solid var(--acu-border);
        background: color-mix(in srgb, var(--acu-btn-bg) 90%, transparent) !important;
        appearance: none;
        -webkit-appearance: none;
        display: inline-grid;
        place-items: center;
        color-scheme: light;
        forced-color-adjust: none;
    }
    .acu-gacha-item-pool-option input:checked,
    .acu-gacha-item-checkbox input:checked {
        border-color: var(--acu-accent);
        background: var(--acu-accent) !important;
    }
    .acu-gacha-item-pool-option input:checked::after,
    .acu-gacha-item-checkbox input:checked::after {
        content: "";
        width: 8px;
        height: 5px;
        border-left: 2px solid var(--acu-btn-active-text, #fff);
        border-bottom: 2px solid var(--acu-btn-active-text, #fff);
        transform: rotate(-45deg) translate(1px, -1px);
    }
    .acu-gacha-item-checkbox {
        min-height: 34px;
        padding: 6px 0;
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-footer {
        padding-top: 12px;
        border-top: 1px solid var(--acu-border);
        flex-wrap: wrap;
    }
    .acu-gacha-settings-dialog > .acu-gacha-settings-footer {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
        align-items: stretch;
        gap: 8px;
    }
    .acu-gacha-settings-footer .acu-dialog-btn {
        flex: 1 1 132px;
        min-width: 0;
        min-height: 38px;
        border-radius: 8px;
        color: var(--acu-text-main);
        background: var(--acu-btn-bg);
        border-color: var(--acu-border);
        transition: background-color .14s ease, border-color .14s ease, color .14s ease, opacity .14s ease;
    }
    .acu-gacha-settings-footer .acu-dialog-btn:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-text-main);
        opacity: 1;
    }
    .acu-gacha-settings-footer .acu-btn-confirm,
    .acu-gacha-settings-footer .acu-btn-confirm:hover {
        background: var(--acu-accent);
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
    }
    .acu-gacha-settings-footer .danger:hover {
        border-color: var(--acu-error-text);
        color: var(--acu-error-text);
        background: var(--acu-error-bg);
    }
    .acu-gacha-item-editor .acu-dialog-btn:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-text-main);
        opacity: 1;
    }
    .acu-gacha-item-editor .acu-btn-confirm:hover {
        background: var(--acu-accent);
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        opacity: .9;
    }
    .acu-gacha-pickup-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 12px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-accent) 11%, transparent), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
    }
    .acu-gacha-pickup-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .02em;
    }
    .acu-gacha-pickup-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }
    .acu-gacha-pickup-card {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        transition: transform .14s ease, border-color .14s ease, background .14s ease;
    }
    .acu-gacha-pickup-card:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--acu-accent) 45%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 84%, var(--acu-accent) 10%);
    }
    .acu-gacha-pickup-card:focus-visible {
        outline: 2px solid var(--acu-accent);
        outline-offset: 2px;
    }
    .acu-gacha-pickup-card strong {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--acu-text-main);
        font-size: 13px;
        line-height: 1.25;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-item-card-meta,
    .acu-gacha-item-card-effect,
    .acu-gacha-item-card-description {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.4;
        overflow: hidden;
    }
    .acu-gacha-item-card-meta {
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-item-card-effect,
    .acu-gacha-item-card-description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .acu-gacha-item-card-effect b,
    .acu-gacha-item-card-description b,
    .acu-gacha-shard-item-effect b,
    .acu-gacha-shard-item-desc b {
        margin-right: 6px;
        color: var(--acu-text-main);
        font-size: inherit;
    }
    .acu-gacha-pickup-card-icon {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 13px;
        line-height: 1;
    }
    .acu-gacha-pickup-desc {
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .acu-gacha-custom-field-preview {
        min-width: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }
    .acu-gacha-custom-field-preview-chip,
    .acu-gacha-custom-field-chip,
    .acu-gacha-custom-field-preview-more {
        min-width: 0;
        max-width: 100%;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 6px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-card-bg) 76%, var(--acu-accent));
        color: var(--acu-text-main);
        font-size: 10px;
        font-weight: 750;
        line-height: 1.3;
    }
    .acu-gacha-custom-field-preview-key {
        flex: 0 1 auto;
        max-width: 45%;
        overflow: hidden;
        color: var(--acu-text-sub);
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-preview-value {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-preview-chip-value-only {
        max-width: min(100%, 168px);
        border-color: color-mix(in srgb, var(--acu-text-sub) 24%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-table-hover) 84%, transparent);
        color: var(--acu-text-main);
        font-weight: 700;
    }
    .acu-gacha-custom-field-preview-more {
        flex: 0 0 auto;
        color: var(--acu-accent);
    }
    .acu-gacha-pickup-rarity {
        width: fit-content;
        max-width: 100%;
        padding: 1px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 22%, transparent);
        color: var(--acu-btn-active-text);
        font-size: 10px !important;
        font-weight: 800;
        line-height: 1.35 !important;
    }
    .acu-gacha-section {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
        border-radius: 12px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
    }
    .acu-gacha-recent-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: min(26dvh, 260px);
        overflow: hidden auto;
        padding-right: 2px;
        overscroll-behavior: contain;
        scrollbar-width: thin;
    }
    .acu-gacha-recent-detail-btn {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 10px;
        border: 1px solid transparent;
        border-radius: 10px;
        background: var(--acu-card-bg);
        color: var(--acu-text-main);
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: background .14s ease, border-color .14s ease, transform .14s ease;
    }
    .acu-gacha-recent-detail-btn:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 36%, transparent);
        background: color-mix(in srgb, var(--acu-accent) 12%, var(--acu-card-bg));
        transform: translateY(-1px);
    }
    .acu-gacha-recent-detail-btn:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 62%, transparent);
        outline-offset: 2px;
    }
    .acu-gacha-recent-reward-text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-recent-quality {
        flex-shrink: 0;
        opacity: .72;
    }
    .acu-gacha-static-field-row {
        cursor: default;
    }
    .acu-gacha-recent-section {
        gap: 0;
    }
    .acu-gacha-recent-section summary {
        min-width: 0;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-recent-section summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-recent-section summary > span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-weight: 800;
    }
    .acu-gacha-recent-section summary > strong {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main);
        font-size: 12px;
        font-weight: 800;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-recent-toggle {
        color: var(--acu-text-sub);
        transition: transform .16s ease;
    }
    .acu-gacha-recent-section[open] {
        gap: 8px;
    }
    .acu-gacha-recent-section[open] .acu-gacha-recent-toggle {
        transform: rotate(180deg);
    }
    .acu-gacha-shard-tabs {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 6px;
    }
    .acu-gacha-shard-tab {
        min-width: 0;
        height: 42px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px;
        margin: 0;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        appearance: none;
        -webkit-appearance: none;
        vertical-align: top;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-tab:hover {
        border-color: color-mix(in srgb, var(--acu-btn-active-bg) 55%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 16%, var(--acu-btn-bg));
        color: var(--acu-accent);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-tab i {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        line-height: 1;
    }
    .acu-gacha-shard-tab strong {
        display: inline-flex;
        align-items: center;
        color: var(--acu-text-main);
        font-size: 13px;
        line-height: 1;
    }
    .acu-gacha-shard-tab.active {
        background: var(--acu-btn-active-bg, var(--acu-accent));
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        border-color: var(--acu-btn-active-bg, var(--acu-accent));
        box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--acu-btn-active-text, #fff) 16%, transparent),
            0 8px 18px color-mix(in srgb, var(--acu-accent) 24%, transparent);
        transform: none;
    }
    .acu-gacha-shard-tab.active:hover {
        transform: none;
    }
    .acu-gacha-shard-tab.active strong {
        color: inherit;
    }
    .acu-gacha-shard-shop-overlay {
        z-index: 31320 !important;
    }
    .acu-gacha-pickup-detail-overlay {
        z-index: 31365 !important;
    }
    .acu-gacha-custom-field-details,
    .acu-gacha-custom-fields-details {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-card-bg) 94%, transparent);
    }
    .acu-gacha-custom-field-details summary,
    .acu-gacha-custom-fields-details summary {
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        color: var(--acu-text-main);
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-custom-field-details summary::-webkit-details-marker,
    .acu-gacha-custom-fields-details summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-custom-field-details summary::after,
    .acu-gacha-custom-fields-details summary::after {
        content: '\f078';
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        transition: transform .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-details[open] summary::after,
    .acu-gacha-custom-fields-details[open] summary::after {
        transform: rotate(180deg);
        color: var(--acu-accent);
    }
    .acu-gacha-custom-field-details summary > span,
    .acu-gacha-custom-fields-details summary > span {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        overflow: hidden;
        font-size: 13px;
        font-weight: 850;
    }
    .acu-gacha-custom-field-details summary strong,
    .acu-gacha-custom-fields-details summary strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-details summary small,
    .acu-gacha-custom-fields-details summary small {
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
    }
    .acu-gacha-custom-field-detail-list {
        max-height: min(34dvh, 320px);
        overflow: hidden auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 12px 12px;
    }
    .acu-gacha-custom-field-detail-row {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(96px, .42fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
    }
    .acu-gacha-custom-field-detail-key,
    .acu-gacha-custom-field-detail-value {
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
    }
    .acu-gacha-custom-field-detail-key {
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.35;
    }
    .acu-gacha-custom-field-detail-value {
        color: var(--acu-text-main);
        font-size: 13px;
        font-weight: 650;
        line-height: 1.45;
        white-space: pre-wrap;
    }
    .acu-gacha-shard-shop {
        width: min(760px, 94vw);
        max-height: min(86dvh, 760px);
        overflow: hidden;
        gap: 10px;
        padding: 14px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-header {
        align-items: center;
        gap: 10px;
        padding-bottom: 0;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-head-main {
        gap: 8px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-icon {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        font-size: 20px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-title {
        font-size: 18px;
        line-height: 1.1;
    }
    .acu-gacha-shard-shop .acu-preview-close {
        width: 34px;
        height: 34px;
        border-radius: 10px;
    }
    .acu-gacha-shard-items {
        min-height: 0;
        max-height: min(56dvh, 520px);
        flex: 0 1 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        grid-auto-rows: minmax(76px, max-content);
        align-content: start;
        gap: 10px;
        overflow: hidden auto;
        padding-right: 2px;
        scrollbar-width: none;
    }
    .acu-gacha-shard-item-card {
        position: relative;
        min-width: 0;
        display: block;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
        color: var(--acu-text-main);
        overflow: hidden;
        touch-action: manipulation;
        transition: border-color .16s ease, background .16s ease, transform .16s ease, box-shadow .16s ease;
    }
    .acu-gacha-shard-item-card > * {
        position: relative;
        z-index: 1;
    }
    .acu-gacha-shard-item-card:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 34%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 92%, var(--acu-accent));
        transform: translateY(-1px);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--acu-accent) 12%, transparent);
    }
    .acu-gacha-shard-item-card.is-disabled {
        cursor: default;
    }
    .acu-gacha-shard-item-card.is-disabled:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 28%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 94%, var(--acu-accent));
        transform: translateY(-1px);
    }
    .acu-gacha-shard-price,
    .acu-gacha-shard-owned {
        position: absolute;
        right: 10px;
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 4px 8px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-btn-bg) 78%, transparent);
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 900;
        line-height: 1;
    }
    .acu-gacha-shard-price {
        top: 10px;
        z-index: 3;
        cursor: pointer;
        overflow: hidden;
        pointer-events: auto;
        transition: border-color .16s ease, background .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-price > * {
        position: relative;
        z-index: 1;
    }
    .acu-gacha-shard-price i {
        font-size: 12px;
    }
    .acu-gacha-shard-item-card.is-available .acu-gacha-shard-price {
        border-color: color-mix(in srgb, var(--acu-btn-active-bg) 42%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 16%, var(--acu-card-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-shard-item-card.is-available .acu-gacha-shard-price:hover {
        border-color: var(--acu-btn-active-bg);
        background: color-mix(in srgb, var(--acu-btn-active-bg) 24%, var(--acu-card-bg));
        color: var(--acu-accent);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-item-card.is-disabled .acu-gacha-shard-price,
    .acu-gacha-shard-item-card.is-disabled .acu-gacha-shard-price:hover {
        cursor: not-allowed;
        border-color: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 62%, transparent);
        color: var(--acu-text-sub);
        transform: none;
    }
    .acu-gacha-shard-owned {
        bottom: 10px;
        color: var(--acu-text-sub);
    }
    .acu-gacha-shard-card-main {
        width: 100%;
        min-height: 76px;
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
        padding: 12px;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        text-align: left;
        user-select: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main,
    .acu-gacha-shard-card-main:hover {
        background: transparent;
        border-color: transparent;
        color: inherit;
        box-shadow: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:hover,
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:focus {
        background: transparent;
        color: inherit;
        transform: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 54%, transparent);
        outline-offset: -4px;
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-head strong {
        color: var(--acu-text-main);
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-head span,
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-desc {
        color: var(--acu-text-sub);
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-icon {
        background: color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-shard-item-icon {
        width: 56px;
        aspect-ratio: 1 / 1;
        height: auto;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-accent) 14%, transparent);
        font-size: 28px;
    }
    .acu-gacha-shard-item-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-gacha-shard-card-main .acu-gacha-custom-field-preview {
        max-height: 38px;
        overflow: hidden;
        padding-right: 58px;
    }
    .acu-gacha-shard-item-head {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-right: 58px;
    }
    .acu-gacha-shard-item-head strong,
    .acu-gacha-shard-item-head span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-shard-item-head strong {
        color: var(--acu-text-main);
        font-size: 14px;
        font-weight: 900;
    }
    .acu-gacha-shard-item-head span,
    .acu-gacha-shard-item-effect,
    .acu-gacha-shard-item-desc {
        color: var(--acu-text-sub);
        font-size: 11px;
    }
    .acu-gacha-shard-item-effect,
    .acu-gacha-shard-item-desc {
        min-width: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 0;
        line-height: 1.45;
        overflow: hidden;
        padding-right: 58px;
    }
    .acu-gacha-shard-confirm-overlay {
        z-index: 31370 !important;
        padding: 18px;
        background: rgba(0, 0, 0, 0.42);
        backdrop-filter: blur(4px);
    }
    .acu-gacha-shard-confirm {
        width: min(360px, 92vw);
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 30%, var(--acu-border));
        border-radius: 16px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 96%, white 3%), color-mix(in srgb, var(--acu-bg-panel) 98%, #f1ede3));
        color: var(--acu-text-main);
        box-shadow: 0 18px 44px var(--acu-shadow);
    }
    .acu-gacha-shard-confirm-head {
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
    }
    .acu-gacha-shard-confirm-icon {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 28px;
    }
    .acu-gacha-shard-confirm-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-gacha-shard-confirm-text strong {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main);
        font-size: 16px;
        font-weight: 900;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-shard-confirm-text span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
    }
    .acu-gacha-shard-confirm-text small {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.35;
    }
    .acu-gacha-shard-confirm-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    .acu-gacha-shard-confirm-btn {
        min-height: 40px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-btn-bg) 82%, transparent);
        color: var(--acu-text-main);
        cursor: pointer;
        font-size: 13px;
        font-weight: 900;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-confirm-btn:hover {
        border-color: var(--acu-btn-active-bg);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-confirm-btn.primary {
        background: var(--acu-btn-active-bg);
        border-color: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
    }
    .acu-gacha-shard-confirm-btn.secondary:hover {
        background: color-mix(in srgb, var(--acu-accent) 14%, var(--acu-btn-bg));
        color: var(--acu-accent);
    }
    .acu-inventory-toolbar {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 5px 7px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 10px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
    .acu-inventory-filter-collapse-btn {
        width: 100%;
        min-height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 7px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--acu-text-main);
        cursor: pointer;
        text-align: left;
        transition: background-color .16s ease, color .16s ease;
    }
    .acu-inventory-filter-collapse-btn:hover {
        background: color-mix(in srgb, var(--acu-table-hover) 88%, transparent);
    }
    .acu-inventory-filter-collapse-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .acu-inventory-filter-collapse-title > i {
        color: var(--acu-accent);
    }
    .acu-inventory-filter-count {
        min-width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 24%, transparent);
        color: var(--acu-btn-active-text);
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
    }
    .acu-inventory-filter-collapse-icon {
        color: var(--acu-text-sub);
        font-size: 12px;
        transition: transform 0.24s ease;
    }
    .acu-inventory-filter-collapse-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 6px;
        overflow: hidden;
        max-height: 420px;
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity var(--acu-motion-normal) var(--acu-ease-standard),
            transform var(--acu-motion-normal) var(--acu-ease-out);
    }
    .acu-inventory-filter-collapsible.collapsed .acu-inventory-filter-collapse-body {
        max-height: 0;
        opacity: 0;
        margin-top: 0;
        transform: translateY(-2px);
        pointer-events: none;
    }
    .acu-inventory-filter-collapsible.collapsed .acu-inventory-filter-collapse-icon {
        transform: rotate(-90deg);
    }
    .acu-inventory-search {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .acu-inventory-search i {
        position: absolute;
        left: 12px;
        color: var(--acu-accent);
        opacity: 0.82;
        pointer-events: none;
    }
    .acu-inventory-search input {
        width: 100%;
        min-height: 42px;
        padding: 10px 12px 10px 36px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        background-color: color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        color: var(--acu-text-main) !important;
        -webkit-text-fill-color: var(--acu-text-main) !important;
        font-size: var(--acu-font-size, 13px);
        outline: none;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            inset 0 0 0 1000px color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        -webkit-box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            inset 0 0 0 1000px color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        appearance: none;
        -webkit-appearance: none;
    }
    .acu-inventory-search input::placeholder {
        color: color-mix(in srgb, var(--acu-text-sub) 88%, transparent) !important;
        -webkit-text-fill-color: color-mix(in srgb, var(--acu-text-sub) 88%, transparent) !important;
        opacity: 1;
    }
    .acu-inventory-search-inline {
        width: min(190px, 38vw);
        flex: 0 1 min(190px, 38vw);
    }
    .acu-inventory-search-inline input {
        min-height: 34px;
        padding-top: 7px;
        padding-bottom: 7px;
        font-size: 12px;
    }
    .acu-inventory-filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-inventory-filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 11px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .acu-inventory-filter-label i {
        color: var(--acu-accent);
    }
    .acu-inventory-filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
        gap: 6px;
    }
    .acu-inventory-filter-btn {
        min-height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.12)),
            color-mix(in srgb, var(--acu-btn-bg) 92%, #0b1624);
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: transform .16s ease, border-color .16s ease, color .16s ease, background-color .16s ease, box-shadow .16s ease;
    }
    .acu-inventory-filter-btn:hover {
        color: var(--acu-text-main);
        border-color: color-mix(in srgb, var(--acu-accent) 64%, var(--acu-border));
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04)),
            color-mix(in srgb, var(--acu-card-bg) 86%, var(--acu-accent));
        transform: translateY(-1px);
    }
    .acu-inventory-filter-btn.active {
        color: var(--acu-btn-active-text);
        border-color: color-mix(in srgb, var(--acu-accent) 80%, white 8%);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.08)),
            var(--acu-btn-active-bg);
        box-shadow:
            0 0 0 1px color-mix(in srgb, var(--acu-accent) 24%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
    }
    .acu-inventory-overlay .acu-inventory-filter-btn:hover {
        color: var(--acu-accent);
        border-color: color-mix(in srgb, var(--acu-accent) 64%, var(--acu-border));
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04)),
            color-mix(in srgb, var(--acu-card-bg) 86%, var(--acu-accent));
    }
    .acu-inventory-overlay .acu-inventory-filter-btn.active,
    .acu-inventory-overlay .acu-inventory-filter-btn.active:hover {
        color: var(--acu-btn-active-text);
        border-color: color-mix(in srgb, var(--acu-accent) 80%, white 8%);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.08)),
            var(--acu-btn-active-bg);
    }
    .acu-inventory-grid {
        flex: 1;
        overflow: hidden auto;
        min-height: 0;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        column-gap: 8px;
        row-gap: 6px;
        justify-content: start;
        align-content: start;
        min-width: 0;
        padding-right: 2px;
        grid-auto-rows: max-content;
    }
    .acu-inventory-grid.is-empty {
        grid-template-columns: minmax(0, 1fr);
        justify-content: stretch;
    }
    .acu-inventory-card {
        display: flex;
        flex-direction: column;
        min-width: 0;
        border: 0;
        border-radius: 16px;
        background: transparent;
        color: var(--acu-text-main);
        overflow: visible;
        transition: transform .18s ease, opacity .18s ease;
    }
    .acu-inventory-card:hover {
        transform: translateY(-2px);
    }
    .acu-inventory-card.is-depleted {
        opacity: .46;
    }
    .acu-inventory-card.acu-inventory-changed {
        filter: drop-shadow(0 10px 18px color-mix(in srgb, var(--acu-hl-diff) 18%, transparent));
    }
    .acu-inventory-card-main {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 3px;
        align-items: center;
        border: 0;
        background: transparent;
        color: var(--acu-text-main);
        text-align: center;
        padding: 2px 2px 4px;
        cursor: pointer;
        min-width: 0;
        border-radius: 12px;
        transition: background-color .16s ease;
    }
    .acu-inventory-card-main:hover {
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
    }
    .acu-inventory-card.acu-inventory-changed .acu-inventory-card-main {
        background: color-mix(in srgb, var(--acu-hl-diff) 10%, transparent);
    }
    .acu-inventory-slot-visual {
        position: relative;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: min(100%, 76px);
        min-height: 68px;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
    }
    .acu-inventory-icon {
        width: 60px;
        height: 60px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        line-height: 1;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
        overflow: hidden;
        transition: transform .16s ease;
    }
    .acu-inventory-card-main:hover .acu-inventory-icon {
        transform: scale(1.05);
    }
    .acu-inventory-card-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 100%;
        align-items: center;
    }
    .acu-inventory-name {
        font-weight: 700;
        color: var(--acu-text-main);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        min-width: 0;
        line-height: 1.2;
        font-size: 12px;
        max-width: 100%;
    }
    .acu-inventory-meta,
    .acu-inventory-badges,
    .acu-inventory-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        flex-wrap: wrap;
        min-width: 0;
    }
    .acu-inventory-type,
    .acu-inventory-quality,
    .acu-inventory-change-badge,
    .acu-inventory-task-badge,
    .acu-inventory-empty-badge,
    .acu-inventory-presence {
        display: inline-flex;
        align-items: center;
        min-height: 20px;
        padding: 1px 7px;
        border-radius: 999px;
        border: 1px solid var(--acu-border);
        background: var(--acu-badge-bg);
        color: var(--acu-text-main);
        font-size: 10px;
        line-height: 1.4;
        white-space: nowrap;
    }
    .acu-inventory-quality {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-change-badge {
        border-color: var(--acu-hl-diff);
        color: var(--acu-hl-diff);
        background: var(--acu-hl-diff-bg);
        font-weight: 700;
    }
    .acu-inventory-task-badge {
        color: var(--acu-warning-text);
        background: var(--acu-warning-bg);
        border-color: var(--acu-warning-icon);
    }
    .acu-inventory-empty-badge {
        color: var(--acu-text-sub);
    }
    .acu-inventory-count {
        position: absolute;
        right: 6px;
        bottom: 5px;
        min-width: 22px;
        height: 22px;
        padding: 0 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        font-weight: 800;
        font-size: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.26);
    }
    .acu-inventory-icon-btn {
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 92%, #101927);
        color: var(--acu-text-main);
        cursor: pointer;
    }
    .acu-inventory-icon-btn:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-empty {
        grid-column: 1 / -1;
        min-height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        border: 1px dashed color-mix(in srgb, var(--acu-accent) 20%, var(--acu-border));
        border-radius: 12px;
        color: var(--acu-text-sub);
        background: color-mix(in srgb, var(--acu-card-bg) 90%, #101927);
        text-align: center;
        padding: 18px;
    }
    .acu-inventory-empty[hidden] {
        display: none !important;
    }
    .acu-inventory-empty.compact {
        min-height: 88px;
    }
    .acu-inventory-empty i {
        color: var(--acu-accent);
        font-size: 22px;
    }
    .acu-inventory-detail-overlay {
        position: fixed;
        inset: 0;
        z-index: 31250;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        background: color-mix(in srgb, var(--acu-overlay-bg, rgba(0, 0, 0, 0.62)) 74%, transparent);
        backdrop-filter: blur(3px);
    }
    .acu-inventory-detail {
        width: min(560px, 94vw);
        max-height: min(78vh, 720px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden auto;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 18px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 95%, white 3%), color-mix(in srgb, var(--acu-bg-panel) 98%, #f1ede3));
        color: var(--acu-text-main);
        box-shadow: 0 18px 44px var(--acu-shadow);
        padding: 18px;
    }
    .acu-inventory-detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding-bottom: 2px;
    }
    .acu-inventory-detail-head-main {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        flex: 1;
    }
    .acu-inventory-detail-icon {
        width: 72px;
        height: 72px;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        border: 0;
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
        font-size: 42px;
        line-height: 1;
    }
    .acu-inventory-detail-summary {
        min-width: 0;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .acu-inventory-detail-title-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
    }
    .acu-inventory-detail-title {
        min-width: 0;
        max-width: 100%;
        color: var(--acu-text-main);
        font-size: 30px;
        font-weight: 800;
        word-break: break-word;
        line-height: 1.15;
        padding: 0;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail-inline-action {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--acu-border);
        border-radius: 10px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .acu-inventory-detail-inline-action:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
        background: var(--acu-table-hover);
    }
    .acu-inventory-detail-header-actions {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }
    .acu-inventory-detail .acu-preview-close {
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
        color: var(--acu-accent);
        cursor: pointer;
        transition: border-color .15s ease, color .15s ease, background .15s ease;
    }
    .acu-inventory-detail .acu-preview-close:hover {
        border-color: var(--acu-error-text);
        background: var(--acu-error-bg);
        color: var(--acu-error-text);
    }
    .acu-inventory-detail-sub,
    .acu-inventory-detail-desc {
        color: var(--acu-text-sub);
        font-size: 15px;
        line-height: 1.55;
        word-break: break-word;
    }
    .acu-inventory-detail-sub {
        padding: 0;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail .acu-inventory-detail-sub:hover {
        background: transparent;
        color: var(--acu-accent);
    }
    .acu-inventory-detail-field-row {
        width: 100%;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail .acu-inventory-detail-field-row:hover {
        background: color-mix(in srgb, var(--acu-card-bg) 88%, var(--acu-accent));
        color: inherit;
    }
    .acu-inventory-detail .acu-inventory-detail-field-row:hover .acu-inventory-detail-field-label {
        color: var(--acu-accent);
    }
    .acu-inventory-detail .acu-inventory-detail-field-row:hover .acu-inventory-detail-field-value {
        color: var(--acu-text-main);
    }
    .acu-inventory-detail-field-label {
        color: var(--acu-text-sub);
        font-size: 13px;
        flex: 0 0 auto;
    }
    .acu-inventory-detail-field-value {
        color: var(--acu-text-main);
        font-size: 15px;
        font-weight: 700;
        text-align: right;
        word-break: break-word;
    }
    .acu-inventory-detail-desc {
        background: var(--acu-card-bg);
        border: 1px solid var(--acu-border);
        border-radius: 14px;
        padding: 14px 16px;
        width: 100%;
        box-sizing: border-box;
        text-align: left;
        cursor: pointer;
    }
    .acu-gacha-detail-text-block {
        width: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--acu-border);
        border-radius: 14px;
        overflow: hidden;
        background: var(--acu-card-bg);
    }
    .acu-gacha-detail-text-row {
        min-width: 0;
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr);
        gap: 10px;
        padding: 12px 14px;
        color: var(--acu-text-sub);
        font-size: 14px;
        line-height: 1.55;
    }
    .acu-gacha-detail-text-row + .acu-gacha-detail-text-row {
        border-top: 1px solid var(--acu-border);
    }
    .acu-gacha-detail-text-row strong {
        color: var(--acu-text-main);
        font-size: inherit;
    }
    .acu-gacha-detail-text-row span {
        min-width: 0;
        overflow-wrap: anywhere;
    }
    .acu-inventory-detail .acu-inventory-detail-desc:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 34%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 92%, var(--acu-accent));
        color: var(--acu-text-sub);
    }
    .acu-inventory-detail-meta-wrap {
        display: block;
        padding: 12px 14px;
        box-sizing: border-box;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-card-bg) 94%, transparent);
        cursor: pointer;
    }
    .acu-inventory-detail-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .acu-inventory-meta-dialog {
        width: min(420px, 92vw);
    }
    .acu-inventory-enum-dialog {
        width: min(420px, 92vw);
    }
    .acu-inventory-enum-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 4px 2px;
    }
    .acu-inventory-enum-option {
        justify-content: center;
    }
    .acu-inventory-enum-option.is-active {
        border-color: var(--acu-accent);
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-card-bg));
        color: var(--acu-accent);
    }
    .acu-inventory-edit-overlay {
        z-index: 31270 !important;
    }
    .acu-inventory-edit-overlay .acu-edit-dialog {
        position: relative;
        z-index: 31271 !important;
    }
    .acu-inventory-meta-overlay {
        z-index: 31270 !important;
    }
    .acu-inventory-meta-overlay .acu-inventory-meta-dialog {
        position: relative;
        z-index: 31271 !important;
    }
    .acu-inventory-detail-menu.acu-cell-menu {
        position: absolute !important;
        z-index: 31266 !important;
        min-width: min(280px, calc(100vw - 16px));
    }
    .acu-menu-backdrop.acu-inventory-detail-menu-backdrop {
        position: absolute !important;
        inset: 0;
        z-index: 31265 !important;
    }
    .acu-inventory-detail-actions {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 2px;
        align-self: flex-start;
        width: fit-content;
        max-width: 100%;
    }
    .acu-inventory-detail-actions .acu-action-item {
        padding: 7px 12px;
        font-size: 13px;
        border-radius: 999px;
        gap: 6px;
    }
    .acu-inventory-detail-actions .acu-action-item i {
        font-size: 11px;
    }
    .acu-inventory-gift-dialog {
        width: min(420px, 92vw);
    }
    .acu-inventory-gift-overlay {
        z-index: 31260 !important;
    }
    .acu-inventory-gift-overlay .acu-inventory-gift-dialog {
        position: relative;
        z-index: 31261 !important;
    }
    .acu-inventory-gift-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .acu-inventory-gift-title-actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }
    .acu-inventory-gift-close,
    .acu-inventory-gift-filter-toggle {
        width: 34px;
        height: 34px;
        flex-shrink: 0;
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-sub);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
    }
    .acu-inventory-gift-close:hover,
    .acu-inventory-gift-filter-toggle:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-gift-filter-toggle.active {
        background: var(--acu-accent);
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text);
    }
    .acu-inventory-gift-list {
        display: grid;
        gap: 8px;
        max-height: 52vh;
        overflow-y: auto;
        padding: 4px;
    }
    .acu-inventory-gift-target {
        width: 100%;
        min-height: 54px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid var(--acu-border);
        border-radius: 10px;
        background: var(--acu-card-bg);
        color: var(--acu-text-main);
        cursor: pointer;
        text-align: left;
        transition: border-color 0.15s, background 0.15s, transform 0.15s;
    }
    .acu-inventory-gift-target:hover {
        border-color: var(--acu-accent);
        background: var(--acu-table-hover);
    }
    .acu-inventory-gift-target.is-away:hover {
        border-color: var(--acu-border);
    }
    .acu-inventory-gift-avatar {
        width: 38px;
        height: 38px;
        cursor: inherit;
        transition: border-color 0.15s, filter 0.15s, opacity 0.15s;
    }
    .acu-inventory-gift-avatar:hover {
        border-color: inherit;
    }
    .acu-inventory-gift-avatar.is-away {
        border-color: var(--acu-border);
        filter: grayscale(80%) brightness(0.7);
        opacity: 0.5;
    }
    .acu-inventory-gift-avatar span {
        font-size: 14px;
        color: var(--acu-text-main);
    }
    .acu-inventory-gift-avatar.is-away span {
        color: var(--acu-text-sub);
    }
    .acu-inventory-gift-avatar-indicator {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--acu-accent);
        border: 2px solid var(--acu-card-bg);
        box-sizing: border-box;
    }
    .acu-inventory-gift-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 600;
        color: var(--acu-text-main);
    }
    .acu-inventory-gift-name.is-away {
        color: var(--acu-text-sub);
        opacity: 0.7;
    }
    .acu-inventory-presence {
        justify-self: end;
        min-width: 44px;
        padding: 4px 10px;
        border: 1px solid var(--acu-border);
        border-radius: 999px;
        color: var(--acu-text-sub);
        background: var(--acu-btn-bg);
        font-size: 12px;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
    }
    .acu-inventory-presence.is-present {
        color: var(--acu-accent);
        border-color: var(--acu-accent);
        background: var(--acu-badge-bg, var(--acu-btn-bg));
    }
    .acu-inventory-presence.is-away {
        color: var(--acu-text-sub);
    }
    @media (max-width: 768px) {
        .acu-inventory-overlay,
        .acu-gacha-overlay {
            padding: 0;
            align-items: flex-end;
        }
        .acu-inventory-shell {
            width: 100vw;
            height: min(94dvh, 920px);
            max-height: 94dvh;
            border-radius: 18px 18px 0 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
        }
        .acu-gacha-shell {
            width: 100vw;
            height: auto;
            max-height: 94dvh;
            border-radius: 18px 18px 0 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
        }
        .acu-inventory-content {
            padding: 12px;
        }
        .acu-gacha-content {
            flex: 0 1 auto;
            gap: 9px;
            overflow: hidden auto;
            padding: 10px;
        }
        .acu-gacha-stat-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
        }
        .acu-gacha-stat-row .acu-badge,
        .acu-gacha-fortune-clear {
            min-width: 0;
            min-height: 30px;
            justify-content: center;
            padding: 5px 7px;
            font-size: 11px;
            white-space: nowrap;
        }
        .acu-gacha-shard-shop-open {
            grid-column: 1 / -1;
            width: 100%;
            min-width: 0;
            min-height: 30px;
            margin-left: 0;
            padding: 5px 8px;
            justify-content: center;
            gap: 4px;
        }
        .acu-gacha-shard-shop-open span {
            display: inline;
            max-width: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .acu-gacha-shard-shop-open i {
            margin: 0;
            font-size: 14px;
        }
        .acu-gacha-shard-shop-open strong {
            font-size: 11px;
            line-height: 1;
        }
        .acu-gacha-fortune-progress {
            gap: 7px;
            padding: 8px;
            border-radius: 10px;
        }
        .acu-gacha-progress-grid {
            grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
            gap: 6px;
        }
        .acu-gacha-fortune-progress-head {
            align-items: center;
            flex-direction: row;
            gap: 8px;
            font-size: 12px;
        }
        .acu-gacha-fortune-progress-head strong {
            max-width: 58%;
            text-align: right;
        }
        .acu-gacha-progress-item {
            gap: 5px;
            padding: 7px 8px;
            border-radius: 9px;
        }
        .acu-gacha-active-progress {
            order: -2;
        }
        .acu-gacha-char-progress {
            order: -1;
        }
        .acu-gacha-last-progress {
            display: none;
        }
        .acu-gacha-progress-note {
            font-size: 9px;
            line-height: 1.25;
        }
        .acu-gacha-pool-tabs {
            flex: 0 0 auto;
            display: flex;
            min-height: 40px;
            gap: 4px;
            overflow-x: auto;
            overflow-y: hidden;
            align-items: flex-end;
            padding-bottom: 4px;
            scrollbar-width: none;
        }
        .acu-gacha-pool-tabs::-webkit-scrollbar {
            display: none;
        }
        .acu-gacha-pool-tab {
            flex: 0 0 auto;
            min-width: 70px;
            min-height: 32px;
            padding: 6px 10px;
            border-radius: 9px 9px 0 0;
            font-size: 12px;
        }
        .acu-gacha-settings-overlay,
        .acu-gacha-item-editor-overlay,
        .acu-gacha-name-dialog-overlay {
            padding: 0;
            align-items: flex-end;
        }
        .acu-gacha-settings-dialog,
        .acu-gacha-item-editor,
        .acu-gacha-name-dialog {
            width: 100%;
            max-height: 94vh;
            border-radius: 18px 18px 0 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
            padding: 12px;
        }
        .acu-gacha-settings-section-head {
            align-items: stretch;
            flex-direction: column;
        }
        .acu-gacha-settings-items-section > .acu-gacha-settings-section-head {
            display: grid;
            grid-template-columns: 1fr;
            padding: 8px;
            gap: 8px;
            border: 1px solid color-mix(in srgb, var(--acu-border) 64%, transparent);
            border-radius: 10px;
            background: color-mix(in srgb, var(--acu-btn-bg) 42%, transparent);
        }
        .acu-gacha-settings-toolbar {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            justify-content: stretch;
        }
        .acu-gacha-settings-search {
            grid-column: 1 / -1;
            grid-row: 2 / 3;
            flex: 1 1 auto;
        }
        .acu-gacha-settings-filter {
            width: 100%;
            min-width: 0;
        }
        .acu-gacha-settings-filter-menu {
            min-width: 0;
        }
        .acu-gacha-settings-filter-trigger {
            min-width: 0;
            min-height: 40px;
            justify-content: flex-start;
            padding: 0 9px;
            font-size: 12px;
        }
        .acu-gacha-settings-filter-menu-label {
            flex: 1 1 auto;
            text-align: left;
        }
        .acu-gacha-settings-filter-menu-list {
            left: 0;
            right: auto;
            min-width: min(210px, 76vw);
        }
        .acu-gacha-settings-toolbar .acu-dialog-btn {
            grid-column: 2 / 3;
            width: 100% !important;
            min-width: 0;
            justify-content: center;
        }
        .acu-gacha-settings-search input {
            width: 100%;
        }
        .acu-gacha-settings-pool-item {
            grid-template-columns: 24px minmax(0, 1fr) auto;
            gap: 8px;
        }
        .acu-gacha-settings-pool-item .acu-gacha-settings-actions {
            grid-column: 3 / 4;
            grid-row: 1 / 2;
            justify-content: flex-end;
        }
        .acu-gacha-pool-handle,
        .acu-gacha-pool-handle-placeholder {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .acu-gacha-settings-item {
            grid-template-columns: 18px 32px minmax(0, 1fr) auto;
            gap: 8px;
            padding: 8px;
        }
        .acu-gacha-settings-item .acu-gacha-settings-actions {
            grid-column: 4 / 5;
            grid-row: 1 / 2;
            align-self: center;
            justify-content: flex-end;
            gap: 6px;
        }
        .acu-gacha-settings-inline-actions {
            display: none;
        }
        .acu-gacha-settings-more {
            display: inline-block;
        }
        .acu-gacha-settings-more > summary {
            width: 34px;
            height: 34px;
            min-width: 34px;
            min-height: 34px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
        }
        .acu-gacha-item-handle {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .acu-gacha-settings-item-icon {
            width: 32px;
        }
        .acu-gacha-settings-item-name {
            flex-wrap: wrap;
            gap: 5px;
            font-size: 13px;
        }
        .acu-gacha-settings-item-meta {
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .acu-gacha-settings-item-desc {
            display: none;
        }
        .acu-gacha-settings-item-custom-fields {
            grid-column: 1 / -1;
        }
        .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview {
            max-height: 46px;
        }
        .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-chip,
        .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview-more {
            max-width: 100%;
        }
        .acu-gacha-settings-pool-tabs {
            gap: 5px;
            padding-bottom: 6px;
        }
        .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab {
            min-width: 62px;
            min-height: 30px;
            padding: 6px 8px;
            border-radius: 8px;
            font-size: 11px;
        }
        .acu-gacha-item-editor-body {
            grid-template-columns: 1fr;
        }
        .acu-gacha-icon-editor-card {
            grid-template-columns: 1fr;
        }
        .acu-gacha-icon-editor-preview {
            width: min(92px, 34vw);
            justify-self: center;
        }
        .acu-gacha-icon-editor-fields {
            grid-template-columns: 1fr;
        }
        .acu-gacha-custom-fields summary {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
        }
        .acu-gacha-custom-field-toolbar {
            align-items: stretch;
            flex-direction: column;
        }
        .acu-gacha-target-column-toolbar {
            align-items: flex-start;
            flex-direction: column;
        }
        .acu-gacha-target-column-toolbar small {
            text-align: left;
        }
        .acu-gacha-target-column-grid {
            grid-template-columns: minmax(0, 1fr);
        }
        .acu-gacha-custom-field-add {
            width: 100%;
            justify-content: center;
        }
        .acu-gacha-custom-field-row {
            grid-template-columns: minmax(0, 1fr);
        }
        .acu-gacha-pickup-section {
            gap: 6px;
            padding: 8px;
            border-radius: 10px;
        }
        .acu-gacha-pickup-title {
            font-size: 11px;
        }
        .acu-gacha-pickup-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 7px;
            overflow: visible;
            padding-bottom: 1px;
        }
        .acu-gacha-pickup-card {
            width: 100%;
            padding: 8px;
            gap: 4px;
        }
        .acu-gacha-pickup-card strong {
            font-size: 12px;
            white-space: nowrap;
        }
        .acu-gacha-pickup-card-icon {
            width: 16px;
            height: 16px;
            font-size: 12px;
        }
        .acu-gacha-item-card-meta,
        .acu-gacha-item-card-effect,
        .acu-gacha-item-card-description {
            font-size: 10px;
        }
        .acu-gacha-item-card-effect,
        .acu-gacha-item-card-description {
            -webkit-line-clamp: 1;
        }
        .acu-gacha-custom-field-preview {
            gap: 3px;
        }
        .acu-gacha-custom-field-preview-chip,
        .acu-gacha-custom-field-preview-more {
            max-width: 100%;
            padding: 1px 5px;
            font-size: 9px;
        }
        .acu-gacha-custom-field-detail-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 4px;
        }
        .acu-gacha-draw-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            padding: 7px 10px 8px;
            box-shadow: 0 -10px 22px color-mix(in srgb, var(--acu-bg-panel) 72%, transparent);
        }
        .acu-gacha-draw-btn,
        .acu-gacha-draw-ten {
            min-height: 46px;
            padding: 8px;
            border-radius: 12px;
            font-size: 15px;
        }
        .acu-gacha-draw-btn i,
        .acu-gacha-draw-btn strong {
            font-size: 16px;
        }
        .acu-gacha-shard-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .acu-gacha-shard-shop .acu-inventory-detail-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: 10px;
        }
        .acu-gacha-shard-shop .acu-inventory-detail-head-main {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            grid-template-columns: 42px minmax(0, 1fr);
        }
        .acu-gacha-shard-shop .acu-inventory-detail-header-actions {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
            width: auto;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }
        .acu-gacha-settings-dialog > .acu-gacha-settings-footer {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
            padding-top: 8px;
        }
        .acu-gacha-settings-dialog > .acu-gacha-settings-footer .acu-dialog-btn {
            min-height: 42px;
            padding: 5px 4px;
            flex-direction: column;
            gap: 3px;
            font-size: 11px;
            line-height: 1.08;
            white-space: normal;
            text-align: center;
        }
        .acu-gacha-settings-dialog > .acu-gacha-settings-footer .acu-dialog-btn i {
            font-size: 12px;
            line-height: 1;
        }
        .acu-gacha-shard-items {
            grid-template-columns: 1fr;
        }
        .acu-gacha-recent-section summary {
            grid-template-columns: minmax(0, 1fr) auto;
        }
        .acu-gacha-recent-list {
            max-height: min(22dvh, 220px);
        }
        .acu-gacha-recent-section summary > strong {
            grid-column: 1 / -1;
            order: 3;
        }
        .acu-inventory-window-header .acu-header-actions {
            align-items: center;
        }
        .acu-inventory-search-inline {
            width: min(156px, 36vw);
            flex-basis: min(156px, 36vw);
        }
        .acu-inventory-search-inline input {
            min-height: 34px;
            padding-left: 32px;
        }
        .acu-inventory-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            column-gap: 8px;
            row-gap: 6px;
            justify-content: stretch;
            padding-right: 0;
        }
        .acu-inventory-icon {
            width: 60px;
            height: 60px;
            font-size: 40px;
        }
        .acu-inventory-name {
            font-size: 12px;
        }
        .acu-inventory-icon-btn {
            width: 40px;
            height: 40px;
        }
        .acu-inventory-detail-overlay {
            align-items: center;
            padding: 12px;
        }
        .acu-inventory-detail {
            width: min(94vw, 560px);
            max-height: min(78dvh, 680px);
            border-radius: 16px;
            padding: 16px;
        }
        .acu-inventory-detail-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
        }
        .acu-inventory-detail-head-main {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr);
            align-items: center;
            width: 100%;
            gap: 12px;
        }
        .acu-inventory-detail-title-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            width: 100%;
        }
        .acu-inventory-detail-header-actions {
            width: 100%;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        .acu-gacha-pickup-detail .acu-inventory-detail-header {
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: start;
            gap: 10px;
        }
        .acu-gacha-pickup-detail .acu-inventory-detail-head-main {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .acu-gacha-pickup-detail .acu-inventory-detail-header-actions {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
            width: auto;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }
        .acu-gacha-pickup-detail .acu-preview-close {
            width: 34px;
            height: 34px;
            min-width: 34px;
            min-height: 34px;
            flex: 0 0 34px;
            padding: 0;
            border-color: transparent;
            border-radius: 8px;
            background: transparent;
            color: var(--acu-text-sub);
        }
        .acu-inventory-detail-actions .acu-action-item {
            min-height: 38px;
            padding: 8px 10px;
            border-radius: 10px;
        }
        .acu-inventory-detail-title {
            display: block;
            width: 100%;
            font-size: 24px;
        }
        .acu-inventory-detail-sub {
            display: block;
            width: 100%;
        }
        .acu-inventory-enum-options {
            grid-template-columns: 1fr;
        }
        .acu-inventory-detail-sub,
        .acu-inventory-detail-desc {
            font-size: 14px;
        }
        .acu-inventory-detail-icon {
            width: 64px;
            height: 64px;
            font-size: 38px;
        }
        .acu-inventory-detail-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
            width: 100%;
            gap: 8px;
        }
    }

    `;
