// @ts-nocheck
/**
 * part-07-backup.ts — part-07-backup.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（1）：配置备份与还原弹窗
 */
export const STYLES_PART_07_BACKUP = `/* ========== 配置备份与还原弹窗 ========== */
    .acu-config-backup-overlay {
        position: fixed;
        inset: 0;
        z-index: 31420;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: transparent;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-dialog {
        width: min(760px, 96vw);
        height: min(82dvh, calc(100dvh - 36px));
        min-height: min(680px, calc(100dvh - 36px));
        max-height: calc(100dvh - 36px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 10px;
        background: var(--acu-bg-panel, #1f1f1f);
        color: var(--acu-text-main, #eee);
        box-shadow: 0 18px 60px rgba(0,0,0,0.45);
    }

    .acu-config-backup-header,
    .acu-config-backup-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
    }

    .acu-config-backup-header {
        padding: 12px 16px;
        border-bottom: 1px solid var(--acu-border, rgba(128,128,128,0.35));
    }

    .acu-config-backup-heading {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        flex: 1 1 auto;
    }

    .acu-config-backup-title-icon {
        flex: 0 0 auto;
        color: var(--acu-accent);
    }

    .acu-config-backup-title-copy {
        min-width: 0;
    }

    .acu-config-backup-title {
        font-size: 15px;
        font-weight: 700;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-subtitle {
        font-size: 12px;
        line-height: 1.35;
        color: var(--acu-text-sub, #aaa);
    }

    .acu-config-backup-header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex: 0 0 auto;
    }

    .acu-config-backup-tutorial-btn,
    .acu-config-backup-close {
        width: 30px !important;
        height: 30px !important;
        min-width: 30px !important;
        min-height: 30px !important;
        padding: 0 !important;
        margin: 0 !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent !important;
        border-radius: 6px !important;
        background: transparent !important;
        color: var(--acu-text-sub, #aaa) !important;
        cursor: pointer;
        font-size: 18px;
    }

    .acu-config-backup-tutorial-btn i,
    .acu-config-backup-close i {
        color: inherit !important;
    }

    .acu-config-backup-tutorial-btn:hover,
    .acu-config-backup-tutorial-btn:focus-visible,
    .acu-config-backup-close:hover,
    .acu-config-backup-close:focus-visible {
        background: var(--acu-btn-hover, var(--acu-table-hover)) !important;
        color: var(--acu-accent) !important;
        border-color: var(--acu-border, rgba(128,128,128,0.35)) !important;
        outline: none;
    }

    .acu-config-backup-body {
        flex: 1 1 auto;
        min-height: 0;
        padding: 10px 16px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .acu-config-backup-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        min-height: 0;
    }

    .acu-config-backup-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .acu-config-backup-section-title {
        min-width: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-selection-actions {
        display: flex;
        gap: 6px;
        flex: 0 0 auto;
    }

    .acu-config-backup-mini-btn {
        width: auto !important;
        margin: 0 !important;
        padding: 5px 9px !important;
        font-size: 12px !important;
        white-space: nowrap;
    }

    .acu-config-backup-module-list {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        flex-direction: column;
        gap: 8px;
        overflow: auto;
        padding-right: 0;
    }

    .acu-config-backup-empty {
        padding: 14px;
        border: 1px dashed var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 8px;
        color: var(--acu-text-sub, #aaa);
        text-align: center;
    }

    .acu-config-backup-module-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 10px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 8px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
        cursor: pointer;
    }

    .acu-config-backup-module-row:hover {
        border-color: var(--acu-state-accent-border, var(--acu-accent));
    }

    .acu-config-backup-module-checkbox {
        flex: 0 0 auto;
        margin-top: 3px;
    }

    .acu-config-backup-module-main {
        display: flex;
        flex: 1 1 auto;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        gap: 2px;
    }

    .acu-config-backup-module-title-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 10px;
    }

    .acu-config-backup-module-name {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main, #eee);
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .acu-config-backup-module-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 34px;
        flex: 0 0 auto;
        margin-left: auto;
        color: var(--acu-text-sub, #aaa);
        font-size: 11px;
        font-style: normal;
        line-height: 1;
        text-align: right;
        transform: none;
        white-space: nowrap;
        writing-mode: horizontal-tb;
    }

    .acu-config-backup-module-desc {
        color: var(--acu-text-sub, #aaa);
        font-size: 12px;
        line-height: 1.35;
    }

    .acu-config-backup-module-warning {
        margin-top: 6px;
        color: var(--acu-warning-icon, #f59e0b);
        font-size: 11px;
        line-height: 1.45;
    }

    .acu-config-backup-warning-list,
    .acu-config-backup-privacy-notice {
        display: flex;
        gap: 6px;
        padding: 10px;
        border: 1px solid rgba(245,158,11,0.45);
        border-radius: 8px;
        background: rgba(245,158,11,0.08);
        color: var(--acu-warning-icon, #f59e0b);
        font-size: 12px;
        line-height: 1.45;
    }

    .acu-config-backup-warning-list {
        flex-direction: column;
    }

    .acu-config-backup-privacy-notice {
        align-items: flex-start;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-privacy-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }

    .acu-config-backup-privacy-text strong {
        color: var(--acu-warning-icon, #f59e0b);
        font-size: 12px;
        line-height: 1.35;
    }

    .acu-config-backup-privacy-text span {
        color: var(--acu-text-main, #eee);
        line-height: 1.5;
    }

    .acu-config-backup-template-icon,
    .acu-config-backup-privacy-icon {
        margin-top: 2px;
    }

    .acu-config-backup-summary-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }

    .acu-config-backup-summary-card {
        padding: 10px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 8px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
    }

    .acu-config-backup-summary-label {
        font-size: 11px;
        color: var(--acu-text-sub, #aaa);
    }

    .acu-config-backup-summary-value {
        color: var(--acu-text-main, #eee);
        font-size: 12px;
        word-break: break-all;
    }

    .acu-profile-manager {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: auto;
        min-height: auto;
    }

    .acu-profile-library {
        display: flex;
        flex-direction: column;
        height: auto;
        min-height: auto;
        gap: 6px;
        padding: 8px;
        overflow: visible;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 6px;
        background: color-mix(in srgb, var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f)) 72%, transparent);
    }

    .acu-profile-collapsible {
        min-height: auto;
    }

    .acu-profile-collapsible.collapsed {
        height: auto;
        max-height: none;
    }

    .acu-profile-manager.is-save-scope-collapsed .acu-profile-library:not(.collapsed) {
        min-height: auto;
    }

    .acu-profile-collapse-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-height: 28px;
        gap: 8px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--acu-text-main, #eee);
        cursor: pointer;
        font: inherit;
        text-align: left;
        min-width: 0;
    }

    .acu-profile-collapse-header:hover .acu-profile-collapse-title,
    .acu-profile-collapse-header:focus-visible .acu-profile-collapse-title {
        color: var(--acu-accent);
    }

    .acu-profile-collapse-header:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 65%, transparent);
        outline-offset: 2px;
        border-radius: 4px;
    }

    .acu-profile-collapse-title {
        display: inline-flex;
        align-items: center;
        min-width: 0;
        gap: 6px;
        color: var(--acu-text-main, #eee);
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
    }

    .acu-profile-collapse-title i {
        color: var(--acu-accent);
    }

    .acu-profile-collapse-meta {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-sub, #aaa);
        font-size: 12px;
        line-height: 1.25;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .acu-profile-collapse-chevron {
        flex: 0 0 auto;
        color: var(--acu-text-sub, #aaa);
        font-size: 10px;
        transition: transform 160ms ease-out;
    }

    .acu-profile-collapsible.collapsed .acu-profile-collapse-chevron {
        transform: rotate(-90deg);
    }

    .acu-profile-collapse-body {
        display: flex;
        min-height: auto;
        flex-direction: column;
        gap: 6px;
    }

    .acu-profile-collapsible.collapsed .acu-profile-collapse-body {
        display: none;
    }

    .acu-profile-library-body {
        flex: 0 0 auto;
        overflow: visible;
    }

    .acu-profile-save-scope-body {
        flex: 0 0 auto;
    }

    .acu-profile-tabs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
    }

    .acu-profile-tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        min-height: 30px;
        gap: 6px;
        padding: 4px 8px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 6px;
        background: var(--acu-input-bg, var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f)));
        color: var(--acu-text-sub, #aaa);
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.2;
        white-space: nowrap;
    }

    .acu-profile-tab:hover,
    .acu-profile-tab:focus-visible {
        border-color: var(--acu-state-accent-border, var(--acu-accent));
        color: var(--acu-text-main, #eee);
        outline: none;
    }

    .acu-profile-tab.is-active {
        border-color: var(--acu-state-accent-border, var(--acu-accent));
        background: var(--acu-table-hover, rgba(128,128,128,0.12));
        color: var(--acu-text-main, #eee);
    }

    .acu-profile-tab em {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 999px;
        color: var(--acu-text-sub, #aaa);
        font-size: 10px;
        font-style: normal;
        line-height: 1;
    }

    .acu-profile-tab-panels {
        flex: 0 0 auto;
        min-height: auto;
        overflow: visible;
        padding-right: 1px;
    }

    .acu-profile-tab-panel[hidden] {
        display: none !important;
    }

    .acu-profile-section {
        display: flex;
        min-height: auto;
        flex-direction: column;
        gap: 5px;
    }

    .acu-profile-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .acu-profile-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 6px;
        padding: 5px 8px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 6px;
        background: color-mix(in srgb, var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f)) 76%, transparent);
    }

    .acu-profile-row.is-current {
        border-color: var(--acu-state-accent-border, var(--acu-accent));
        background: var(--acu-table-hover, var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f)));
    }

    .acu-profile-library .acu-profile-row {
        grid-template-columns: minmax(0, 1fr) auto;
    }

    .acu-profile-library .acu-profile-row-actions {
        justify-content: flex-end;
    }

    .acu-profile-row-main {
        min-width: 0;
    }

    .acu-profile-row-title {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
    }

    .acu-profile-row-title strong {
        overflow: hidden;
        color: var(--acu-text-main, #eee);
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .acu-profile-row-actions {
        display: grid;
        grid-auto-columns: 32px;
        grid-auto-flow: column;
        grid-template-columns: none;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
    }

    .acu-profile-action {
        width: auto !important;
        min-width: 32px;
        min-height: 30px;
        margin: 0 !important;
        padding: 4px 7px !important;
        font-size: 11px !important;
        gap: 4px;
        white-space: nowrap;
    }

    .acu-profile-library .acu-profile-action {
        width: 32px !important;
        padding: 4px !important;
    }

    .acu-profile-library .acu-profile-action span {
        display: none;
    }

    .acu-profile-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        padding: 6px 8px;
        font-size: 12px;
        line-height: 1.35;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .acu-profile-danger {
        color: var(--acu-error-text, #ef4444) !important;
    }

    .acu-profile-module-section {
        min-height: auto;
    }

    .acu-profile-module-list {
        max-height: none;
        flex: 0 0 auto;
        min-height: auto;
        overflow: visible;
    }

    .acu-profile-prompt-overlay {
        position: fixed;
        inset: 0;
        z-index: 32110;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(0,0,0,0.38);
        color: var(--acu-text-main, #eee);
    }

    .acu-profile-prompt-dialog {
        width: min(480px, calc(100vw - 32px));
        overflow: hidden;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 10px;
        background: var(--acu-bg-panel, #1f1f1f);
        box-shadow: 0 18px 48px rgba(0,0,0,0.42);
    }

    .acu-profile-prompt-header,
    .acu-profile-prompt-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px 14px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
    }

    .acu-profile-prompt-header {
        border-bottom: 1px solid var(--acu-border, rgba(128,128,128,0.35));
    }

    .acu-profile-prompt-title {
        display: inline-flex;
        align-items: center;
        min-width: 0;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
    }

    .acu-profile-prompt-title i {
        color: var(--acu-accent);
    }

    .acu-profile-prompt-close {
        width: 30px;
        height: 30px;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 6px;
        background: transparent;
        color: var(--acu-text-sub, #aaa);
        cursor: pointer;
    }

    .acu-profile-prompt-close:hover,
    .acu-profile-prompt-close:focus-visible {
        border-color: var(--acu-border, rgba(128,128,128,0.35));
        background: var(--acu-table-hover, rgba(128,128,128,0.12));
        color: var(--acu-accent);
        outline: none;
    }

    .acu-profile-prompt-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 14px;
    }

    .acu-profile-prompt-name {
        font-size: 14px;
        font-weight: 700;
    }

    .acu-profile-prompt-text,
    .acu-profile-prompt-meta {
        color: var(--acu-text-sub, #aaa);
        font-size: 12px;
        line-height: 1.5;
    }

    .acu-profile-prompt-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 10px;
    }

    .acu-profile-prompt-footer {
        justify-content: flex-end;
        border-top: 1px solid var(--acu-border, rgba(128,128,128,0.35));
    }

    .acu-config-backup-footer {
        display: block;
        padding: 10px 16px;
        border-top: 1px solid var(--acu-border, rgba(128,128,128,0.35));
    }

    .acu-config-backup-footer-actions {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .acu-config-backup-footer-btn {
        width: 100% !important;
        min-width: 0;
        min-height: 34px;
        margin: 0 !important;
        padding: 7px 10px !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12px !important;
        white-space: nowrap;
    }

    .acu-config-backup-primary-btn {
        background: var(--acu-accent) !important;
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #f4f1e8)) !important;
    }

    .acu-config-backup-footer-btn[hidden] {
        display: none !important;
    }

    .acu-config-backup-body,
    .acu-config-backup-module-list {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .acu-config-backup-body::-webkit-scrollbar,
    .acu-config-backup-module-list::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
    }

    .acu-profile-manager-body {
        scrollbar-width: thin;
        scrollbar-color: var(--acu-border, rgba(128,128,128,0.35)) transparent;
    }

    .acu-profile-manager-body::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        display: block;
    }

    .acu-profile-manager-body::-webkit-scrollbar-track {
        background: transparent;
    }

    .acu-profile-manager-body::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: var(--acu-border, rgba(128,128,128,0.35));
    }

    @media (max-width: 560px) {
        .acu-config-backup-overlay {
            align-items: stretch;
            padding: 10px;
        }

        .acu-config-backup-dialog {
            width: calc(100vw - 20px);
            height: calc(100dvh - 20px);
            min-height: 0;
            max-height: calc(100dvh - 20px);
        }

        .acu-config-backup-header,
        .acu-config-backup-body,
        .acu-config-backup-footer {
            padding-right: 12px;
            padding-left: 12px;
        }

        .acu-config-backup-section-head {
            align-items: stretch;
            flex-direction: column;
        }

        .acu-config-backup-footer {
            display: grid;
            align-items: stretch;
            gap: 6px;
            padding-top: 8px;
            padding-bottom: 8px;
        }

        .acu-config-backup-footer-actions {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
        }

        .acu-config-backup-selection-actions {
            flex-wrap: wrap;
        }

        .acu-config-backup-mini-btn {
            flex: 1 1 72px;
        }

        .acu-config-backup-summary-grid {
            grid-template-columns: 1fr;
        }

        .acu-profile-library {
            max-height: none;
            padding: 7px;
        }

        .acu-profile-row {
            grid-template-columns: minmax(0, 1fr);
        }

        .acu-profile-library .acu-profile-row {
            grid-template-columns: minmax(0, 1fr) auto;
        }

        .acu-profile-prompt-footer {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            justify-content: stretch;
        }

        .acu-profile-row-actions {
            display: grid;
            grid-auto-columns: 32px;
            grid-auto-flow: column;
            grid-template-columns: none;
            justify-content: flex-end;
        }

        .acu-profile-library .acu-profile-row-actions {
            display: grid;
            grid-auto-columns: 32px;
            grid-auto-flow: column;
            grid-template-columns: none;
            justify-content: flex-end;
        }

        .acu-profile-action,
        .acu-profile-prompt-footer .acu-setting-action-btn {
            width: 100% !important;
            min-width: 0;
        }

        .acu-profile-library .acu-profile-action {
            width: 32px !important;
            min-width: 32px;
        }

        .acu-config-backup-footer-btn {
            min-width: 0;
            min-height: 32px;
            width: 100% !important;
            padding: 6px 8px !important;
            gap: 4px;
        }
    }

    @media (max-width: 480px) {
        .acu-gacha-settings-item {
            grid-template-columns: 18px 30px minmax(0, 1fr) 44px;
        }
        .acu-gacha-settings-item .acu-gacha-settings-actions {
            grid-column: 4 / 5;
            grid-row: 1 / 2;
            align-self: center;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }
        .acu-gacha-settings-item .acu-gacha-item-enabled-toggle {
            display: none;
        }
        .acu-gacha-settings-more > summary {
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
        }
        .acu-gacha-custom-field-toolbar,
        .acu-gacha-custom-field-suggestions,
        .acu-gacha-custom-field-suggestion-list {
            min-width: 0;
        }
        .acu-gacha-custom-field-suggestion {
            max-width: 100%;
        }
        .acu-gacha-custom-field-detail-list {
            max-height: min(38dvh, 300px);
        }
    }

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
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
    }
    .acu-wrapper.acu-dice-ui-root::-webkit-scrollbar,
    .acu-wrapper.acu-dice-ui-root *::-webkit-scrollbar,
    .acu-edit-overlay::-webkit-scrollbar,
    .acu-edit-overlay *::-webkit-scrollbar,
    .acu-dice-panel::-webkit-scrollbar,
    .acu-dice-panel *::-webkit-scrollbar,
    .acu-contest-panel::-webkit-scrollbar,
    .acu-contest-panel *::-webkit-scrollbar,
    .acu-preview-overlay::-webkit-scrollbar,
    .acu-preview-overlay *::-webkit-scrollbar,
    .acu-gacha-overlay::-webkit-scrollbar,
    .acu-gacha-overlay *::-webkit-scrollbar,
    .acu-inventory-overlay::-webkit-scrollbar,
    .acu-inventory-overlay *::-webkit-scrollbar,
    .acu-inventory-detail-overlay::-webkit-scrollbar,
    .acu-inventory-detail-overlay *::-webkit-scrollbar,
    .acu-import-confirm-overlay::-webkit-scrollbar,
    .acu-import-confirm-overlay *::-webkit-scrollbar,
    .acu-embedded-options-container::-webkit-scrollbar,
    .acu-embedded-options-container *::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs {
        scrollbar-width: thin !important;
        scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track) !important;
        padding-bottom: 8px;
    }

    /* 面板头部图标按钮统一为 ghost button，默认不显示边框。 */
    .acu-panel-header .acu-fav-transfer-actions,
    .acu-panel-header .acu-changes-batch-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex: 0 0 auto;
    }

    .acu-panel-header > .acu-panel-title {
        min-width: 0;
        flex: 1 1 auto;
    }

    .acu-panel-header > .acu-header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        row-gap: 4px;
        flex: 0 1 auto;
        flex-wrap: wrap;
        min-width: 0;
        max-width: 100%;
    }

    .acu-panel-header > .acu-header-actions.acu-table-header-actions {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        column-gap: 6px;
        row-gap: 4px;
        flex-wrap: nowrap;
    }

    .acu-panel-header .acu-table-action-set,
    .acu-panel-header .acu-panel-control-set {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .acu-panel-header .acu-table-action-set {
        flex-wrap: wrap;
        justify-content: flex-end;
        row-gap: 4px;
    }

    .acu-panel-header .acu-panel-control-set {
        flex: 0 0 auto;
        justify-content: flex-end;
        align-self: start;
        white-space: nowrap;
    }

    .acu-panel-header > .acu-header-actions > .acu-search-wrapper,
    .acu-panel-header .acu-table-action-set > .acu-search-wrapper {
        flex: 0 1 140px;
        width: 140px;
        min-width: 104px;
        max-width: 100%;
    }

    .acu-wrapper.acu-dice-ui-root .acu-panel-header > .acu-header-actions > .acu-search-wrapper > input.acu-search-input,
    .acu-wrapper.acu-dice-ui-root .acu-panel-header > .acu-header-actions > .acu-search-wrapper > input.acu-search-input:focus,
    .acu-wrapper.acu-dice-ui-root .acu-panel-header .acu-table-action-set > .acu-search-wrapper > input.acu-search-input,
    .acu-wrapper.acu-dice-ui-root .acu-panel-header .acu-table-action-set > .acu-search-wrapper > input.acu-search-input:focus {
        width: 100% !important;
    }

    @media (max-width: 520px) {
        .acu-panel-header > .acu-header-actions > .acu-search-wrapper,
        .acu-panel-header .acu-table-action-set > .acu-search-wrapper {
            flex-basis: 110px;
            width: 110px;
        }

        .acu-panel-header > .acu-header-actions.acu-table-header-actions {
            column-gap: 4px;
        }

        .acu-panel-header .acu-table-action-set,
        .acu-panel-header .acu-panel-control-set {
            gap: 4px;
        }
    }

    @media (max-width: 380px) {
        .acu-panel-header .acu-table-action-set > .acu-search-wrapper {
            flex-basis: 94px;
            width: 94px;
            min-width: 86px;
        }
    }

    .acu-panel-header .acu-header-actions > button,
    .acu-panel-header .acu-table-action-set > button,
    .acu-panel-header .acu-fav-transfer-actions > button,
    .acu-panel-header .acu-changes-batch-actions > button,
    .acu-panel-header .acu-graph-actions > button,
    .acu-panel-header .acu-map-actions > button,
    .acu-panel-header .acu-avatar-header-actions > button,
    .acu-panel-header > .acu-settings-manager-close,
    .acu-panel-header .acu-header-actions > .acu-height-control,
    .acu-panel-header .acu-panel-control-set > button,
    .acu-panel-header .acu-panel-control-set > .acu-height-control {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        flex: 0 0 34px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 1px solid transparent !important;
        border-radius: 6px !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--acu-text-sub) !important;
        opacity: 0.82;
        transform: none !important;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            opacity var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }

    .acu-panel-header .acu-header-actions > button:hover,
    .acu-panel-header .acu-table-action-set > button:hover,
    .acu-panel-header .acu-fav-transfer-actions > button:hover,
    .acu-panel-header .acu-changes-batch-actions > button:hover,
    .acu-panel-header .acu-graph-actions > button:hover,
    .acu-panel-header .acu-map-actions > button:hover,
    .acu-panel-header .acu-avatar-header-actions > button:hover,
    .acu-panel-header > .acu-settings-manager-close:hover,
    .acu-panel-header .acu-header-actions > .acu-height-control:hover,
    .acu-panel-header .acu-header-actions > .acu-height-control.active,
    .acu-panel-header .acu-panel-control-set > button:hover,
    .acu-panel-header .acu-panel-control-set > .acu-height-control:hover,
    .acu-panel-header .acu-panel-control-set > .acu-height-control.active {
        border-color: transparent !important;
        background: var(--acu-table-hover) !important;
        color: var(--acu-accent) !important;
        opacity: 1;
        transform: none !important;
    }

    .acu-panel-header .acu-header-actions > button:focus-visible,
    .acu-panel-header .acu-table-action-set > button:focus-visible,
    .acu-panel-header .acu-fav-transfer-actions > button:focus-visible,
    .acu-panel-header .acu-changes-batch-actions > button:focus-visible,
    .acu-panel-header .acu-graph-actions > button:focus-visible,
    .acu-panel-header .acu-map-actions > button:focus-visible,
    .acu-panel-header .acu-avatar-header-actions > button:focus-visible,
    .acu-panel-header > .acu-settings-manager-close:focus-visible,
    .acu-panel-header .acu-panel-control-set > button:focus-visible {
        outline: none !important;
        border-color: transparent !important;
        box-shadow: var(--acu-focus-ring) !important;
        opacity: 1;
    }

    .acu-panel-header > .acu-settings-manager-close:focus:not(:focus-visible) {
        outline: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-batch-accept:hover {
        color: var(--acu-success-text) !important;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-batch-reject:hover {
        color: var(--acu-hl-manual) !important;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-simple-mode-toggle.active {
        background: transparent !important;
        color: var(--acu-accent) !important;
        opacity: 1;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-simple-mode-toggle.active:hover {
        background: var(--acu-table-hover) !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs::-webkit-scrollbar:horizontal,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs::-webkit-scrollbar:horizontal {
        height: 8px !important;
        display: block !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs::-webkit-scrollbar-track:horizontal,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs::-webkit-scrollbar-track:horizontal {
        background: var(--acu-scrollbar-track) !important;
        border-radius: 4px !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs::-webkit-scrollbar-thumb:horizontal,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs::-webkit-scrollbar-thumb:horizontal {
        background: var(--acu-scrollbar-thumb) !important;
        border-radius: 4px !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content {
        scrollbar-width: thin !important;
        scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track) !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content::-webkit-scrollbar:horizontal {
        height: 8px !important;
        display: block !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content::-webkit-scrollbar-track:horizontal {
        background: var(--acu-scrollbar-track) !important;
        border-radius: 4px !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content::-webkit-scrollbar-thumb:horizontal {
        background: var(--acu-scrollbar-thumb) !important;
        border-radius: 4px !important;
    }
`;
