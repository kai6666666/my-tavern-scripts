// @ts-nocheck
/**
 * part-04-settings.ts — part-04-validation.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（4）：新版设置面板样式, 属性预设管理面板样式, 变更审核面板样式, 验证错误消息样式
 */
export const STYLES_PART_04_VALIDATION = `/* ========== 新版设置面板样式 ========== */
            .acu-settings-dialog {
                width: 380px;
                max-width: 380px;
                max-height: 85vh;
                max-height: min(85dvh, calc(100dvh - 32px));
                padding: 0;
                gap: 0;
            }
            @media (max-width: 768px) {
                .acu-settings-dialog {
                    width: 92vw;
                    max-width: 92vw;
                    max-height: 85vh;
                    max-height: calc(100dvh - 24px);
                }
                .acu-settings-body {
                    max-height: calc(85vh - 110px);
                    max-height: calc(100dvh - 134px);
                    -webkit-overflow-scrolling: touch;
                }
                .acu-table-manager-list {
                    max-height: 40vh;
                    max-height: 40dvh;
                    -webkit-overflow-scrolling: touch;
                }
            }
            .acu-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 16px;
                gap: 12px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                flex-shrink: 0;
            }
            .acu-settings-title-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .acu-settings-title {
                font-size: 16px;
                font-weight: 700;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                flex: 1 1 auto;
                line-height: 1.2;
            }
            .acu-settings-title-main {
                display: inline-flex;
                align-items: center;
                gap: 9px;
                min-width: 0;
            }
            .acu-settings-title-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-main);
                font-size: 18px;
                line-height: 1;
            }
            .acu-settings-heading {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
                min-width: 0;
            }
            .acu-version-badge {
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                line-height: 1.2;
                white-space: nowrap;
                letter-spacing: 0;
                background: transparent;
                color: var(--acu-text-sub);
                border-radius: 0;
                border: none;
                padding: 0 2px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 0;
                opacity: 0.72;
            }
            .acu-help-btn {
                width: 32px;
                height: 32px;
                min-width: 32px;
                min-height: 32px;
                background: transparent !important;
                border: 1px solid transparent !important;
                box-shadow: none !important;
                outline: none !important;
                color: var(--acu-text-sub);
                cursor: pointer;
                font-size: 15px;
                padding: 0;
                margin: 0;
                border-radius: 7px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                opacity: 0.86;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-help-btn:hover {
                color: var(--acu-accent);
                background: var(--acu-table-hover) !important;
                opacity: 1;
            }
            .acu-settings-dialog .acu-close-btn {
                width: 32px;
                height: 32px;
                min-width: 32px;
                min-height: 32px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                border: 1px solid transparent !important;
                border-radius: 7px;
                background: transparent !important;
                color: var(--acu-text-sub);
                opacity: 0.86;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-settings-dialog .acu-close-btn:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-settings-dialog .acu-help-btn:focus-visible,
            .acu-settings-dialog .acu-close-btn:focus-visible,
            .acu-manual-update-btn:focus-visible {
                outline: none !important;
                box-shadow: var(--acu-focus-ring) !important;
                opacity: 1;
            }
            .acu-manual-update-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                min-width: 30px;
                min-height: 30px;
                background: transparent !important;
                color: var(--acu-text-sub);
                border: 1px solid transparent !important;
                box-shadow: none !important;
                outline: none !important;
                padding: 0;
                margin-left: 0;
                font-size: 13px;
                opacity: 0.82;
                cursor: pointer;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard);
                vertical-align: middle;
                line-height: 1;
            }
            .acu-manual-update-btn:hover {
                opacity: 1;
                color: var(--acu-accent, #3b82f6);
                background: var(--acu-table-hover) !important;
            }
            @media (max-width: 360px) {
                .acu-settings-header {
                    padding: 12px 14px;
                    gap: 10px;
                }
                .acu-settings-title {
                    gap: 8px;
                }
                .acu-version-badge {
                    font-size: 11px;
                }
            }
            /* 手动更新确认弹窗样式 */
            .acu-manual-update-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                height: 100dvh;
                background: rgba(0, 0, 0, 0.6);
                z-index: 31400;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 16px;
                box-sizing: border-box;
            }
            .acu-manual-update-dialog {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: 100%;
                max-width: 360px;
                max-height: calc(100vh - 32px);
                max-height: calc(100dvh - 32px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                position: relative;
                z-index: 1;
                display: flex;
                flex-direction: column;
            }
            .acu-manual-update-header {
                padding: 14px 16px;
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
            }
            .acu-manual-update-body {
                padding: 16px;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                line-height: 1.6;
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
            }
            .acu-manual-update-body p {
                margin: 0 0 12px 0;
                color: var(--acu-text-main) !important;
            }
            .acu-manual-update-safe-box {
                background: var(--acu-card-bg, rgba(34, 197, 94, 0.1));
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                padding: 10px 12px;
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }
            .acu-manual-update-safe-box i {
                color: var(--acu-accent, #22c55e);
                margin-top: 2px;
            }
            .acu-manual-update-safe-box .safe-text {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.5;
            }
            .acu-manual-update-safe-box .safe-text strong {
                color: var(--acu-text-main);
                display: block;
                margin-bottom: 2px;
            }
            .acu-manual-update-footer {
                padding: 12px 16px;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                flex-shrink: 0;
            }
            .acu-manual-update-cancel-btn,
            .acu-manual-update-confirm-btn {
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
                border: none;
            }
            .acu-manual-update-cancel-btn {
                background: var(--acu-card-bg);
                color: var(--acu-text-sub);
                border: 1px solid var(--acu-text-sub);
            }
            .acu-manual-update-cancel-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-text-main);
            }
            .acu-manual-update-confirm-btn {
                background: var(--acu-accent, #3b82f6);
                color: #fff;
            }
            .acu-manual-update-confirm-btn:hover {
                filter: brightness(1.1);
            }
            .acu-manual-update-confirm-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            .acu-settings-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 8px;
                -webkit-overflow-scrolling: touch;
            }
            .acu-settings-group {
                background: var(--acu-card-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 8px;
                overflow: hidden;
            }
            .acu-settings-group-title {
                display: flex;
                align-items: center;
                gap: 8px;
                justify-content: space-between;
                padding: 12px 14px;
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: var(--acu-table-head);
                cursor: pointer;
                user-select: none;
                transition: background 0.15s;
            }
            .acu-settings-group-title:hover {
                background: var(--acu-table-hover);
            }
            .acu-settings-group-title-main {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-settings-group-help {
                width: 28px;
                height: 28px;
                min-width: 28px;
                min-height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin-left: auto;
                border: 1px solid transparent !important;
                border-radius: 6px;
                background: transparent !important;
                box-shadow: none !important;
                color: var(--acu-text-sub) !important;
                font-size: 13px;
                opacity: 0.82;
                transform: none !important;
            }
            .acu-settings-group-help:hover {
                border-color: transparent !important;
                background: var(--acu-table-hover) !important;
                color: var(--acu-text-main) !important;
                opacity: 1;
                transform: none !important;
            }
            .acu-settings-group-help:focus:not(:focus-visible) {
                outline: none !important;
                box-shadow: none !important;
            }
            .acu-settings-group-help:focus-visible {
                outline: none !important;
                border-color: transparent !important;
                box-shadow: var(--acu-focus-ring) !important;
                opacity: 1;
            }
            .acu-group-chevron {
                font-size: 10px;
                color: var(--acu-text-sub);
                width: 12px;
                transition: transform 0.2s;
            }
            .acu-settings-group-body {
                padding: 4px 12px 8px;
            }
            .acu-settings-group.collapsed .acu-settings-group-body {
                display: none;
            }
            .acu-settings-group-body.acu-animating {
                display: block !important;
                overflow: hidden;
            }
            .acu-settings-group:last-child {
                margin-bottom: 0;
            }
            .acu-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid color-mix(in srgb, var(--acu-border) 62%, transparent);
                gap: 12px;
                min-height: 44px;
            }
            .acu-setting-row:last-child {
                border-bottom: none;
            }
            .acu-setting-row[hidden] {
                display: none !important;
            }
            .acu-setting-dependent-row {
                margin-left: 24px;
                min-height: 40px;
            }
            .acu-setting-dependent-row .acu-setting-label {
                font-size: 12px;
            }
            .acu-setting-row-slider {
                flex-direction: column;
                align-items: stretch;
            }
            .acu-setting-info {
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 1;
                min-width: 0;
            }
            .acu-setting-label {
                font-size: 13px;
                color: var(--acu-text-main);
            }
            .acu-deprecated-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                margin-left: 5px;
                padding: 1px 5px;
                border: 1px solid color-mix(in srgb, var(--acu-text-sub) 28%, transparent);
                border-radius: 999px;
                background: color-mix(in srgb, var(--acu-badge-bg, var(--acu-btn-bg)) 74%, transparent);
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 600;
                line-height: 1.2;
                white-space: nowrap;
                vertical-align: 1px;
            }
            .acu-setting-hint {
                font-size: 10px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-setting-value {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-accent);
                margin-left: auto;
            }
            .acu-setting-select {
                padding: 6px 10px;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                color: var(--acu-text-main) !important;
                font-size: 12px;
                min-width: 120px;
                cursor: pointer;
                -webkit-appearance: none;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 8px center;
                padding-right: 28px;
            }
            .acu-setting-select:focus {
                outline: none;
                border-color: var(--acu-accent) !important;
            }
            .acu-setting-select option {
                background: var(--acu-bg-panel) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-select-short {
                min-width: 80px;
            }
            .acu-setting-segmented {
                display: inline-flex;
                flex-wrap: nowrap;
                justify-content: flex-end;
                gap: 2px;
                max-width: min(100%, 320px);
                padding: 2px;
                border: 1px solid var(--acu-border);
                border-radius: 7px;
                background: var(--acu-input-bg, var(--acu-btn-bg));
                flex: 0 1 auto;
            }
            .acu-setting-segmented-option {
                flex: 0 1 auto;
                min-height: 28px;
                padding: 4px 9px;
                border: 1px solid transparent !important;
                border-radius: 5px !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                font-size: 12px;
                line-height: 1.2;
                white-space: nowrap;
                box-shadow: none !important;
                transform: none !important;
            }
            .acu-setting-segmented-option:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-text-main) !important;
                border-color: var(--acu-border) !important;
            }
            .acu-setting-segmented-option.active,
            .acu-setting-segmented-option.active:hover {
                background: var(--acu-btn-active-bg) !important;
                color: var(--acu-btn-active-text) !important;
                border-color: var(--acu-btn-active-bg) !important;
                font-weight: 600;
            }
            .acu-setting-segmented-option:focus-visible {
                outline: none !important;
                box-shadow: var(--acu-focus-ring) !important;
            }
            .acu-setting-segmented-option:disabled {
                opacity: var(--acu-disabled-opacity);
                cursor: not-allowed;
            }
            @media (max-width: 380px) {
                .acu-settings-dialog .acu-setting-row {
                    align-items: stretch;
                    flex-direction: column;
                    gap: 8px;
                }
                .acu-settings-dialog .acu-setting-info {
                    width: 100%;
                }
                .acu-settings-dialog .acu-setting-dependent-row {
                    margin-left: 12px;
                }
                .acu-settings-dialog .acu-setting-select,
                .acu-settings-dialog .acu-stepper {
                    width: 100%;
                    min-width: 0;
                }
                .acu-settings-dialog .acu-stepper-btn {
                    flex: 1 1 0;
                    min-width: 44px;
                }
                .acu-settings-dialog .acu-stepper-value {
                    flex: 1.2 1 0;
                    min-width: 72px;
                }
                .acu-settings-dialog .acu-setting-segmented {
                    flex-wrap: wrap;
                    width: 100%;
                    max-width: none;
                    justify-content: stretch;
                }
                .acu-settings-dialog .acu-setting-segmented-option {
                    flex: 1 1 0;
                    min-width: 0;
                }
            }
            .acu-setting-slider {
                width: 100%;
                height: 6px;
                margin-top: 8px;
                -webkit-appearance: none;
                appearance: none;
                background: var(--acu-border) !important;
                border-radius: 3px;
                outline: none;
                border: none;
            }
            .acu-setting-slider::-webkit-slider-runnable-track {
                height: 6px;
                background: var(--acu-border);
                border-radius: 3px;
            }
            .acu-setting-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                margin-top: -6px;
            }
            .acu-setting-slider::-moz-range-track {
                height: 6px;
                background: var(--acu-border);
                border-radius: 3px;
                border: none;
            }
            .acu-setting-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            }
            .acu-setting-slider:focus {
                outline: none;
            }
            .acu-setting-mini-btn {
                width: 28px;
                height: 28px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                flex-shrink: 0;
                transition: all 0.15s;
            }
            .acu-setting-mini-btn:hover, .acu-setting-mini-btn.active {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            /* ========== 属性预设管理面板样式 ========== */
            .acu-preset-item {
                display: grid;
                grid-template-columns: 32px minmax(0, 1fr) auto 28px;
                column-gap: 12px;
                align-items: center;
                padding: 10px 12px;
                background: var(--acu-card-bg);
                border: 1px solid rgba(var(--acu-accent-rgb, 128, 128, 128), 0.15);
                border-radius: 12px;
                margin-bottom: 10px;
                transition: all 0.14s ease-out;
                position: relative;
            }
            /* 简化布局：仅有 info + actions 两列的面板 */
            #acu-presets-list .acu-preset-item,
            #acu-action-presets-list .acu-preset-item,
            #acu-dashboard-presets-list .acu-preset-item,
            #acu-render-presets-list .acu-preset-item,
            #acu-table-template-requirement-presets-list .acu-preset-item {
                display: flex;
                gap: 12px;
            }
            #acu-presets-list .acu-preset-info,
            #acu-action-presets-list .acu-preset-info,
            #acu-dashboard-presets-list .acu-preset-info,
            #acu-render-presets-list .acu-preset-info,
            #acu-table-template-requirement-presets-list .acu-preset-info {
                flex: 1;
                min-width: 0;
            }
            #acu-dashboard-presets-list .acu-preset-stats,
            #acu-render-presets-list .acu-preset-stats,
            #acu-table-template-requirement-presets-list .acu-preset-stats {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #acu-action-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-dashboard-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-render-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-table-template-requirement-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-action-presets-list .acu-preset-item,
            #acu-dashboard-presets-list .acu-preset-item,
            #acu-render-presets-list .acu-preset-item,
            #acu-table-template-requirement-presets-list .acu-preset-item {
                margin-bottom: 0;
            }
            #acu-action-presets-list .acu-preset-stats,
            #acu-table-template-requirement-presets-list .acu-preset-stats {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-preset-item.acu-preset-hidden {
                opacity: 0.6;
                border-color: var(--acu-border);
            }
            .acu-preset-item:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.04);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border-color: var(--acu-accent);
                transform: translateY(-1px);
                z-index: 1;
            }
            .acu-preset-check {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 10px;
                color: var(--acu-accent);
                transition: all 0.14s;
            }
            .acu-preset-check:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
            }
            .acu-preset-item.acu-preset-hidden .acu-preset-check {
                color: var(--acu-text-sub);
                opacity: 0.5;
            }
            .acu-preset-info {
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .acu-preset-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 2px;
                letter-spacing: 0.2px;
                line-height: 1.15;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-preset-desc {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                opacity: 0.8;
            }
            .acu-preset-stats {
                font-size: 10px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-preset-actions {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
                align-items: center;
            }
            .acu-preset-btn {
                width: 30px;
                height: 30px;
                border: 1px solid transparent;
                border-radius: 10px;
                background: transparent;
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                transition: all 0.14s;
                opacity: 0.7;
            }
            .acu-preset-btn:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-preset-btn:active {
                transform: translateY(1px);
            }
            .acu-preset-btn:focus-visible {
                outline: 2px solid var(--acu-accent);
                outline-offset: 1px;
            }
            .acu-preset-btn.acu-preset-delete:hover {
                background: rgba(231, 76, 60, 0.15);
                color: #e74c3c;
            }
            .acu-preset-handle {
                width: 28px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                color: var(--acu-text-sub);
                opacity: 0.55;
                transition: opacity 0.2s;
            }
            .acu-preset-item:hover .acu-preset-handle {
                opacity: 0.95;
            }
            .acu-preset-handle:active {
                cursor: grabbing;
            }
            /* 预设编辑器输入框样式（防止被主题覆盖） */
            .acu-preset-editor-input,
            .acu-preset-editor-textarea {
                background: var(--acu-input-bg) !important;
                color: var(--acu-text-main) !important;
                border: 1px solid var(--acu-border) !important;
            }
            .acu-preset-editor-input:focus,
            .acu-preset-editor-textarea:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px rgba(var(--acu-accent-rgb, 100, 150, 200), 0.2) !important;
            }
            .acu-preset-editor-textarea {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            }
            /* Toggle 开关 */
            .acu-toggle {
                position: relative;
                width: 44px;
                height: 24px;
                flex-shrink: 0;
            }
            .acu-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .acu-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(120, 120, 128, 0.16);
                border: none;
                border-radius: 24px;
                transition: all 0.3s ease;
            }
            .acu-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                top: 2px;
                background: #fff;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            .acu-toggle input:checked + .acu-toggle-slider {
                background: var(--acu-accent);
            }
            .acu-toggle input:checked + .acu-toggle-slider:before {
                transform: translateX(20px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            /* Range Slider 滑条样式 */
            .acu-range-slider {
                -webkit-appearance: none;
                appearance: none;
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: rgba(120, 120, 128, 0.3);
                outline: none;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .acu-range-slider::-webkit-slider-runnable-track {
                height: 6px;
                border-radius: 3px;
                background: transparent;
            }
            .acu-range-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 18px !important;
                height: 18px !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
                cursor: pointer !important;
                margin-top: -6px !important;
                transition: all 0.2s ease;
            }
            .acu-range-slider:hover::-webkit-slider-thumb {
                transform: scale(1.05) !important;
                background: #e8e8e8 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            }
            .acu-range-slider:active::-webkit-slider-thumb {
                transform: scale(0.95) !important;
                background: #d0d0d0 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
            }
            .acu-range-slider::-moz-range-track {
                height: 6px;
                border-radius: 3px;
                background: rgba(120, 120, 128, 0.16);
            }
            .acu-range-slider::-moz-range-thumb {
                width: 18px !important;
                height: 18px !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
                cursor: pointer !important;
                transition: all 0.2s ease;
            }
            .acu-range-slider:hover::-moz-range-thumb {
                transform: scale(1.05) !important;
                background: #e8e8e8 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            }
            .acu-range-slider:active::-moz-range-thumb {
                transform: scale(0.95) !important;
                background: #d0d0d0 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
            }
            .acu-range-value {
                min-width: 45px;
                text-align: right;
                font-weight: 600;
                font-size: 13px;
                color: var(--acu-accent, var(--SmartThemeBodyColor, #d4a574));
            }
            /* 疯狂程度按钮组样式 */
            .acu-crazy-btn {
                padding: 4px 12px;
                font-size: 12px;
                border: 1px solid var(--acu-border, rgba(0,0,0,0.1));
                border-radius: 4px;
                background: var(--acu-btn-bg, rgba(0,0,0,0.05));
                color: var(--acu-text, inherit);
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }
            .acu-crazy-btn:hover {
                background: var(--acu-btn-hover, rgba(0,0,0,0.1));
            }
            .acu-crazy-btn.active {
                background: var(--acu-accent, #d4a574);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent, #d4a574);
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            /* Debug控制台过滤样式 - 增加优先级防止被酒馆样式覆盖 */
            .acu-debug-console-dialog .acu-debug-filter,
            .acu-debug-console-dialog label input.acu-debug-filter {
                cursor: pointer !important;
                width: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                appearance: checkbox !important;
                -webkit-appearance: checkbox !important;
                -moz-appearance: checkbox !important;
            }
            .acu-debug-console-dialog label {
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
            }
            .acu-setting-action-btn {
                width: 100%;
                padding: 10px 14px;
                margin-bottom: 6px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.15s;
            }
            .acu-settings-compact-action {
                width: 90px;
                padding: 6px 12px;
                margin-bottom: 0;
                font-size: 12px;
            }
            .acu-blacklist-manager-overlay {
                z-index: 31300 !important;
                padding: 20px;
            }
            .acu-blacklist-manager-dialog {
                width: min(600px, 90vw);
                max-width: 600px;
                max-height: min(82vh, 620px);
                padding: 0;
                gap: 0;
            }
            .acu-blacklist-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 14px 16px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                flex-shrink: 0;
            }
            .acu-blacklist-header h3 {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                margin: 0;
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }
            .acu-blacklist-body {
                display: flex;
                flex: 1;
                flex-direction: column;
                min-height: 0;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-blacklist-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 0;
            }
            .acu-blacklist-hint {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.45;
            }
            .acu-blacklist-textarea {
                width: 100%;
                min-height: 124px;
                max-height: 300px;
                resize: vertical;
                font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
                line-height: 1.5;
            }
            .acu-blacklist-add-row {
                display: flex;
                align-items: stretch;
                gap: 8px;
                min-width: 0;
            }
            .acu-blacklist-input {
                flex: 1;
                min-width: 0;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-add-btn {
                flex: 0 0 auto;
                min-width: 88px;
                padding-inline: 14px;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-actions {
                margin: 16px -16px -16px;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-actions .acu-dialog-btn {
                min-height: 38px;
            }
            .acu-edit-dialog.acu-dice-settings-dialog {
                width: min(92vw, 600px);
                max-width: 600px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                padding: 14px;
            }
            .acu-dice-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-dice-settings-header h3 {
                margin: 0;
                font-size: 17px;
                font-weight: 700;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-dice-settings-header h3 i {
                color: var(--acu-accent);
            }
            .acu-dice-settings-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-dice-settings-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 12px 0 0;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
            }
            .acu-dice-settings-section + .acu-dice-settings-section {
                margin-top: 0;
                padding-top: 0;
                border-top: 0;
            }
            .acu-dice-settings-dialog .acu-setting-row {
                gap: 12px;
                min-height: 42px;
                padding: 8px 0;
            }
            .acu-dice-settings-dialog .acu-setting-dependent-row {
                margin-left: 24px;
                min-height: 40px;
            }
            .acu-dice-settings-dialog .acu-setting-info {
                min-width: 0;
            }
            .acu-dice-settings-dialog .acu-setting-label {
                overflow-wrap: anywhere;
            }
            .acu-dice-settings-dialog .acu-dice-settings-action {
                width: 90px;
                flex: 0 0 90px;
                padding: 6px 12px;
                font-size: 12px;
                margin-bottom: 0;
            }
            .acu-dice-settings-dialog .acu-dice-settings-select {
                width: 90px;
                min-width: 90px;
                flex: 0 0 90px;
                text-align: center;
                text-align-last: center;
            }
            .acu-dice-settings-dialog #dice-settings-crazy-mode-row {
                min-height: 42px;
                border-bottom: 1px dashed var(--acu-border);
            }
            @media (max-width: 640px) {
                .acu-edit-dialog.acu-dice-settings-dialog {
                    width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-dice-settings-header h3 {
                    font-size: 16px;
                }
                .acu-dice-settings-dialog .acu-dice-settings-action,
                .acu-dice-settings-dialog .acu-dice-settings-select {
                    width: 86px;
                    min-width: 86px;
                    flex-basis: 86px;
                }
            }
            /* Stepper 步进器 */
            .acu-stepper {
                display: flex;
                align-items: center;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                overflow: hidden;
                background: transparent !important;
                flex-shrink: 0;
            }
            .acu-stepper-btn {
                width: 36px;
                height: 34px;
                border: none !important;
                background: transparent !important;
                background-color: transparent !important;
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-stepper-btn:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-accent);
            }
            .acu-stepper-btn:active {
                transform: scale(0.95);
                background: var(--acu-accent) !important;
                color: var(--acu-button-text);
            }
            .acu-stepper-value {
                min-width: 60px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: transparent !important;
                border-left: 1px solid var(--acu-border);
                border-right: 1px solid var(--acu-border);
            }
            /* ========== 变更审核面板样式 ========== */
            .acu-changes-content {
                padding: 10px;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                overscroll-behavior-y: contain;
            }
            /* ========== 验证错误消息样式 ========== */
            .acu-validation-error-msg {
                font-size: 11px;
                color: var(--acu-text-sub);
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            /* 数据验证模式提示 - 固定在面板顶部，不参与横向滚动 */
            .acu-validation-mode-hint {
                padding: 8px 12px;
                font-size: 12px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                border-radius: 6px;
                margin: 0 0 10px 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            /* 审核面板横向滚动模式 */
            .acu-changes-content.acu-changes-horizontal {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                align-items: flex-start !important;
                gap: 12px;
                overflow-x: auto !important;
                overflow-y: visible !important;
                touch-action: pan-x pan-y !important;
                padding-bottom: 5px;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-x: contain;
                overscroll-behavior-y: auto;
            }
            .acu-changes-content.acu-changes-horizontal .acu-changes-list {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                gap: 12px;
                align-items: flex-start;
                min-width: max-content;
            }
            .acu-changes-content.acu-changes-horizontal .acu-changes-group {
                flex: 0 0 280px;
                min-width: 280px;
                max-width: 280px;
                max-height: none;
                overflow-y: visible;
                -webkit-overflow-scrolling: auto;
                overscroll-behavior-y: auto;
            }
            @media (min-width: 769px) {
                .acu-changes-content.acu-changes-horizontal .acu-changes-group {
                    flex: 0 0 320px;
                    min-width: 320px;
                    max-width: 320px;
                }
            }
            .acu-changes-list { display: flex; flex-direction: column; gap: 10px; }
            .acu-changes-group { background: var(--acu-card-bg); border: 1px solid var(--acu-border); border-radius: 8px; overflow: hidden; }
            .acu-changes-group-header { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--acu-table-head); font-weight: bold; font-size: 13px; color: var(--acu-text-main); }
            .acu-changes-count { margin-left: auto; background: var(--acu-accent); color: var(--acu-btn-active-text); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: normal; }
            .acu-changes-group-body { padding: 6px; display: flex; flex-direction: column; gap: 4px; }
            .acu-change-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid transparent; border-radius: 6px; font-size: 12px; background: rgba(0,0,0,0.02); flex-wrap: wrap; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-change-item:hover { background: var(--acu-table-hover); }
            .acu-change-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; flex-shrink: 0; }
            .acu-badge-added { background: var(--acu-success-bg); color: var(--acu-success-text); }
            .acu-badge-deleted { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); }
            .acu-badge-modified { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); }
            .acu-change-title { color: var(--acu-text-main); font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .acu-change-field { color: var(--acu-text-sub); font-size: 11px; flex-shrink: 0; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .acu-change-diff { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; overflow: hidden; }
            .acu-diff-old { color: var(--acu-hl-manual); text-decoration: line-through; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
            .acu-diff-arrow { color: var(--acu-text-sub); flex-shrink: 0; }
            .acu-diff-new { color: var(--acu-success-text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
            /* 变更操作按钮 */
            .acu-change-actions { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
            .acu-change-action-btn { width: 26px; height: 26px; border: 1px solid var(--acu-border); border-radius: 5px; background: var(--acu-btn-bg); color: var(--acu-text-sub); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); padding: 0; }
            .acu-change-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); }
            .acu-action-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-action-reject:hover, .acu-action-restore:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-action-edit:hover { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); border-color: var(--acu-hl-diff); }
            /* 批量操作按钮 - 增强深色主题下的对比度 */
            .acu-changes-batch-btn { width: 32px; height: 32px; border: 1px solid var(--acu-border); border-radius: 6px; background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-changes-batch-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); border-color: var(--acu-border); }
            .acu-batch-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-batch-reject:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-simple-mode-toggle.active { background: var(--acu-accent); color: var(--acu-btn-active-text); border-color: var(--acu-accent); }
            .acu-simple-mode-toggle:hover { background: var(--acu-accent); color: var(--acu-btn-active-text); border-color: var(--acu-accent); }
            .acu-changes-group.collapsed .acu-collapse-icon { transform: rotate(0deg); }
            .acu-changes-group:not(.collapsed) .acu-collapse-icon { transform: rotate(0deg); }
            .acu-changes-group-header:hover { background: var(--acu-table-hover); }
            /* 变更对比编辑弹窗样式 */
            .acu-diff-section { margin-bottom: 12px; }
            .acu-diff-label { font-size: 12px; font-weight: bold; color: var(--acu-text-sub); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
            .acu-diff-readonly { padding: 10px 12px; background: var(--acu-table-head); border: 1px solid var(--acu-border); border-radius: 6px; color: var(--acu-text-main); font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; max-height: 150px; overflow-y: auto; opacity: 0.8; }
            .acu-diff-arrow-down { text-align: center; color: var(--acu-text-sub); font-size: 14px; margin: 8px 0; opacity: 0.5; }
            /* 可编辑区域高亮样式 */
            .acu-diff-new-section { padding: 12px; background: var(--acu-input-bg); border: 1px solid var(--acu-accent); border-radius: 6px; box-shadow: var(--acu-focus-ring); }
            .acu-diff-new-section .acu-diff-label { color: var(--acu-accent); font-weight: 600; }
            .acu-diff-new-section textarea,
            .acu-diff-new-section input { background: var(--acu-input-bg) !important; border-color: var(--acu-border) !important; }
            .acu-diff-new-section textarea:focus,
            .acu-diff-new-section input:focus { border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring); }
            /* 单字段编辑弹窗按钮优化 */
            .acu-edit-dialog .acu-dialog-btns {
                display: flex;
                gap: 10px;
                padding: 12px 16px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                margin: 0 -16px -16px -16px;
                border-radius: 0 0 12px 12px;
            }
            .acu-edit-dialog .acu-dialog-btn {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid var(--acu-text-sub);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                white-space: nowrap;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    border-color var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-edit-dialog .acu-dialog-btn:hover,
            .acu-edit-dialog .acu-dialog-btn:focus-visible {
                background: var(--acu-btn-hover);
                border-color: var(--acu-border);
                box-shadow: var(--acu-focus-ring);
                outline: none;
            }
            .acu-edit-dialog .acu-btn-confirm {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: var(--acu-btn-active-text);
            }
            .acu-edit-dialog .acu-btn-confirm:hover,
            .acu-edit-dialog .acu-btn-confirm:focus-visible {
                background: var(--acu-accent);
                opacity: 0.9;
            }
            .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                width: min(600px, 92vw);
                max-width: 600px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-edit-dialog.acu-dashboard-preset-manager-dialog {
                width: min(640px, 92vw);
                max-width: 640px;
            }
            .acu-advanced-preset-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-header h3 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }
            .acu-advanced-preset-header-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-advanced-preset-body {
                flex: 1;
                overflow-y: auto;
                padding: 2px 2px 0;
                min-height: 0;
            }
            .acu-advanced-preset-hint {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
                padding: 0 2px;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.35;
            }
            #acu-advanced-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-advanced-presets-list .acu-preset-item {
                margin-bottom: 0;
            }
            #acu-advanced-presets-list .acu-preset-info {
                flex: 1;
                min-width: 0;
            }
            #acu-advanced-presets-list .acu-preset-actions {
                gap: 6px;
            }
            #acu-advanced-presets-list .acu-preset-handle {
                touch-action: none;
            }
            .acu-preset-badge {
                display: inline-flex;
                align-items: center;
                margin-left: 6px;
                padding: 1px 5px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 500;
                line-height: 1.2;
                vertical-align: 1px;
            }
            .acu-advanced-preset-footer {
                display: flex;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-advanced-preset-footer .acu-advanced-preset-footer-main {
                flex: 1 1 180px;
            }
            .acu-advanced-preset-file-input {
                display: none;
            }
            .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                width: min(720px, 95vw);
                max-width: 720px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-edit-dialog.acu-dashboard-preset-editor-dialog {
                width: min(760px, 95vw);
                max-width: 760px;
            }
            .acu-advanced-preset-editor-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 2px 2px 0;
            }
            .acu-advanced-preset-editor-fields {
                display: grid;
                grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
                gap: 12px;
                margin-bottom: 14px;
            }
            .acu-advanced-preset-field {
                min-width: 0;
            }
            .acu-advanced-preset-field label,
            .acu-advanced-preset-json-label {
                display: flex;
                align-items: baseline;
                gap: 6px;
                margin-bottom: 5px;
                color: var(--acu-text-sub);
                font-size: 12px;
                font-weight: 600;
                line-height: 1.35;
            }
            .acu-advanced-preset-json-label span {
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 400;
                opacity: 0.82;
            }
            .acu-advanced-preset-editor-dialog .acu-preset-editor-input {
                width: 100%;
                box-sizing: border-box;
                padding: 8px 10px;
                border-radius: 6px;
                font-size: 13px;
                line-height: 1.4;
            }
            .acu-advanced-preset-json-section {
                margin-bottom: 14px;
            }
            .acu-advanced-preset-json-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 8px;
            }
            .acu-advanced-preset-json-textarea {
                width: 100%;
                height: 32em;
                min-height: 22em;
                box-sizing: border-box;
                padding: 10px 12px;
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.5;
                resize: vertical;
            }
            .acu-advanced-preset-format-help-summary {
                display: flex;
                align-items: flex-start;
                gap: 6px;
                margin-top: 8px;
                padding: 8px 10px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-table-head);
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.45;
            }
            .acu-advanced-preset-format-help-summary strong {
                flex: 0 0 auto;
                color: var(--acu-text-main);
            }
            .acu-advanced-preset-format-help {
                margin-top: 8px;
                padding: 10px 12px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-table-head);
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.6;
            }
            .acu-advanced-preset-format-help strong {
                color: var(--acu-text-main);
            }
            .acu-attribute-preset-json-textarea {
                height: 26em;
                min-height: 18em;
            }
            .acu-action-preset-json-textarea {
                height: 24em;
                min-height: 18em;
            }
            .acu-dashboard-preset-json-textarea {
                height: 28em;
                min-height: 20em;
            }
            .acu-advanced-preset-editor-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-editor-tools,
            .acu-advanced-preset-editor-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-advanced-preset-editor-tools {
                flex: 0 1 auto;
            }
            .acu-advanced-preset-editor-actions {
                flex: 1 1 auto;
                justify-content: flex-end;
            }
            .acu-advanced-preset-editor-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-advanced-preset-editor-footer .acu-advanced-preset-tool-btn {
                min-height: 36px;
                padding: 8px 10px;
                font-size: 12px;
            }
            .acu-advanced-preset-editor-footer .acu-advanced-preset-editor-save {
                flex: 0 1 220px;
                min-width: 160px;
                font-weight: 700;
            }
            .acu-template-inspection-card {
                border: 1px solid var(--acu-border);
                background: var(--acu-card-bg);
            }
            .acu-template-inspection-header-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                flex: 0 0 auto;
            }
            .acu-template-inspection-title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-tutorial-btn,
            .acu-template-inspection-close {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                min-height: 30px !important;
                margin: 0 !important;
                padding: 0 !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                border: 1px solid transparent !important;
                border-radius: 6px !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                font-size: 17px;
            }
            .acu-template-inspection-tutorial-btn i,
            .acu-template-inspection-close i {
                color: inherit !important;
            }
            .acu-template-inspection-tutorial-btn:hover,
            .acu-template-inspection-tutorial-btn:focus-visible,
            .acu-template-inspection-close:hover,
            .acu-template-inspection-close:focus-visible {
                background: var(--acu-btn-hover, var(--acu-table-hover)) !important;
                color: var(--acu-accent) !important;
                border-color: var(--acu-border) !important;
                outline: none;
            }
            .acu-template-inspection-summary {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 14px;
                padding: 0 0 10px;
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-template-inspection-summary-head {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                min-width: 0;
            }
            .acu-template-inspection-summary-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 18px;
                width: 18px;
                height: 18px;
                margin-top: 1px;
                color: var(--acu-template-inspection-summary-color, var(--acu-accent));
                font-size: 12px;
            }
            .acu-template-inspection-summary-copy {
                min-width: 0;
            }
            .acu-template-inspection-summary-title {
                color: var(--acu-text-main);
                font-size: 14px;
                font-weight: 800;
                line-height: 1.3;
            }
            .acu-template-inspection-stats {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 4px 10px;
                flex: 0 0 auto;
                max-width: 50%;
                padding-top: 1px;
            }
            .acu-template-inspection-stat {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                min-height: 20px;
                padding: 0;
                border: 0;
                border-radius: 0;
                background: transparent;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.2;
            }
            .acu-template-inspection-stat b {
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 800;
            }
            .acu-template-inspection-stat-error {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-error b {
                color: var(--acu-error-text);
            }
            .acu-template-inspection-stat-warning {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-warning b {
                color: var(--acu-warning-text);
            }
            .acu-template-inspection-stat-info {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-info b {
                color: var(--acu-accent);
            }
            .acu-template-inspection-tabs {
                gap: 0 !important;
                padding: 0 !important;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-card-bg);
                overflow-x: hidden !important;
                overflow-y: auto !important;
            }
            .acu-template-inspection-tab {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                min-height: 44px;
                padding: 8px 10px;
                border: 0;
                border-bottom: 1px solid var(--acu-border);
                border-radius: 0;
                background: transparent;
                color: var(--acu-text-main);
                cursor: pointer;
                text-align: left;
                touch-action: manipulation;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-template-inspection-tab:last-child {
                border-bottom: 0;
            }
            .acu-template-inspection-tab:hover,
            .acu-template-inspection-tab:focus {
                background: var(--acu-table-hover);
                outline: none;
            }
            .acu-template-inspection-tab.active {
                background: color-mix(in srgb, var(--acu-template-inspection-color, var(--acu-accent)) 10%, var(--acu-table-head));
            }
            .acu-template-inspection-tab-icon {
                flex: 0 0 14px;
                width: 14px;
                color: var(--acu-template-inspection-color, var(--acu-accent));
                text-align: center;
                font-size: 12px;
            }
            .acu-template-inspection-tab-label {
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-tab.active .acu-template-inspection-tab-label {
                font-weight: 700;
            }
            .acu-template-inspection-tab-count {
                margin-left: 0 !important;
                flex: 0 0 auto;
            }
            .acu-template-inspection-card-list {
                gap: 8px;
            }
            .acu-template-inspection-panels,
            .acu-template-inspection-panel,
            .acu-template-inspection-card-list,
            .acu-template-inspection-card {
                width: 100%;
                min-width: 0;
                box-sizing: border-box;
            }
            .acu-template-inspection-card .acu-changes-group-header {
                min-height: 42px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-template-inspection-card .acu-changes-count {
                font-weight: 700;
            }
            .acu-template-inspection-card .acu-changes-group-body {
                padding: 0;
            }
            .acu-template-inspection-card .acu-change-item {
                border: 0;
                border-radius: 0;
                background: transparent;
                padding: 12px 14px;
            }
            .acu-template-inspection-dialog-clean {
                width: min(720px, 96vw) !important;
            }
            .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                flex: 0 0 auto;
                overflow: visible;
                padding: 14px 0 !important;
            }
            .acu-template-inspection-clean-card {
                display: grid;
                grid-template-columns: minmax(0, 1fr);
                gap: 14px;
                padding: 16px;
                border: 1px solid var(--acu-border);
                border-radius: 10px;
                background: var(--acu-card-bg);
            }
            .acu-template-inspection-clean-result {
                display: grid;
                grid-template-columns: 42px minmax(0, 1fr);
                gap: 12px;
                align-items: center;
            }
            .acu-template-inspection-clean-icon {
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                background: color-mix(in srgb, var(--acu-success-text) 18%, var(--acu-card-bg));
                color: var(--acu-success-text);
                font-size: 20px;
            }
            .acu-template-inspection-clean-copy {
                min-width: 0;
            }
            .acu-template-inspection-clean-title {
                color: var(--acu-text-main);
                font-size: 15px;
                font-weight: 700;
                line-height: 1.35;
            }
            .acu-template-inspection-clean-desc {
                margin-top: 3px;
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.45;
            }
            .acu-template-inspection-clean-meta {
                display: grid;
                grid-template-columns: minmax(0, 1.5fr) minmax(92px, 0.6fr) minmax(126px, 0.8fr);
                gap: 8px;
            }
            .acu-template-inspection-clean-meta div {
                min-width: 0;
                padding: 8px 10px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-table-head);
            }
            .acu-template-inspection-clean-meta span {
                display: block;
                color: var(--acu-text-sub);
                font-size: 10px;
                line-height: 1.2;
                margin-bottom: 3px;
            }
            .acu-template-inspection-clean-meta strong {
                display: block;
                overflow: hidden;
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 600;
                line-height: 1.35;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-clean-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .acu-template-inspection-clean-stats span {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                font-size: 11px;
                line-height: 1.2;
            }
            .acu-template-inspection-clean-stats b {
                color: var(--acu-text-main);
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-item {
                align-items: center;
                padding: 12px;
                border-radius: 10px;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-name {
                display: flex;
                align-items: center;
                gap: 6px;
                max-width: 100%;
                margin-bottom: 3px;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-name .acu-preset-badge {
                margin-left: 0;
                flex-shrink: 0;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-actions {
                margin-left: auto;
                padding-left: 8px;
            }
            .acu-template-inspection-overlay .acu-template-inspection-layout-empty {
                min-height: 190px !important;
            }
            .acu-template-inspection-overlay .acu-template-inspection-layout-empty .acu-empty-hint {
                min-height: 190px !important;
                padding: 22px 20px !important;
            }
            .acu-template-inspection-overlay .acu-dialog-btn {
                white-space: nowrap;
            }
            .acu-template-inspection-overlay .acu-template-inspection-actions {
                flex-wrap: nowrap;
            }
            .acu-template-inspection-overlay .acu-template-inspection-download {
                flex: 0 1 auto;
                min-width: 0;
                max-width: 220px;
            }
            .acu-template-inspection-overlay .acu-template-inspection-primary-actions {
                flex: 0 0 auto;
                min-width: 0;
            }
            .acu-template-inspection-dialog-clean .acu-template-inspection-actions {
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
            }
            .acu-template-inspection-overlay .acu-dialog-btn:disabled {
                background: var(--acu-btn-bg);
                border-color: var(--acu-border);
                color: var(--acu-text-sub);
                opacity: 0.5;
                cursor: not-allowed;
                box-shadow: none;
            }
            @media (max-width: 768px) {
                .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                    width: calc(100vw - 20px);
                    max-width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-advanced-preset-header h3 {
                    font-size: 15px;
                }
                #acu-advanced-presets-list .acu-preset-item {
                    grid-template-columns: 30px minmax(0, 1fr) auto;
                    column-gap: 8px;
                    padding: 9px 10px;
                }
                #acu-advanced-presets-list .acu-preset-handle {
                    display: none;
                }
                #acu-advanced-presets-list .acu-preset-actions {
                    gap: 4px;
                }
                #acu-advanced-presets-list .acu-preset-btn {
                    width: 28px;
                    height: 28px;
                    font-size: 12px;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-item {
                    align-items: stretch;
                    gap: 10px;
                    padding: 10px;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-actions {
                    gap: 5px;
                    padding-left: 0;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-btn {
                    width: 30px;
                    height: 30px;
                }
                .acu-advanced-preset-footer {
                    flex-wrap: nowrap;
                    gap: 6px;
                    padding-top: 10px;
                }
                .acu-advanced-preset-footer .acu-dialog-btn {
                    flex: 1 1 0;
                    min-width: 0;
                    min-height: 34px;
                    padding: 7px 6px;
                    font-size: 12px;
                }
                .acu-advanced-preset-footer .acu-advanced-preset-footer-main {
                    flex-basis: 0;
                }
            }
            @media (max-width: 480px) {
                .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                    width: min(370px, calc(100vw - 20px));
                    max-width: min(370px, calc(100vw - 20px));
                }
            }
            @media (max-width: 768px) {
                .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                    width: calc(100vw - 20px);
                    max-width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-advanced-preset-editor-fields {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 10px;
                }
                .acu-advanced-preset-json-head {
                    flex-direction: column;
                    align-items: stretch;
                }
                .acu-advanced-preset-json-label {
                    flex-direction: column;
                    gap: 2px;
                }
                .acu-advanced-preset-json-textarea {
                    height: 24em;
                    min-height: 20em;
                }
                .acu-advanced-preset-format-help-summary {
                    flex-direction: column;
                    gap: 2px;
                }
                .acu-attribute-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-action-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-dashboard-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-advanced-preset-editor-footer {
                    flex-wrap: wrap;
                    align-items: stretch;
                }
                .acu-advanced-preset-editor-tools,
                .acu-advanced-preset-editor-actions {
                    flex: 1 1 100%;
                    width: 100%;
                    justify-content: stretch;
                }
                .acu-advanced-preset-editor-tools .acu-dialog-btn {
                    flex: 1 1 calc(50% - 4px);
                    min-width: 0;
                }
                .acu-advanced-preset-editor-actions .acu-dialog-btn {
                    flex: 1 1 calc(50% - 4px);
                    min-width: 0;
                }
                .acu-advanced-preset-editor-footer .acu-advanced-preset-editor-save {
                    flex: 1 1 calc(50% - 4px);
                }
            }
            @media (max-width: 480px) {
                .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                    width: min(370px, calc(100vw - 20px));
                    max-width: min(370px, calc(100vw - 20px));
                }
            }
            @media (max-width: 768px) {
                .acu-edit-dialog .acu-dialog-btns {
                    flex-wrap: nowrap;
                }
                .acu-edit-dialog .acu-dialog-btn {
                    padding: 10px 8px;
                    font-size: 12px;
                    min-width: 0;
                }
                .acu-edit-dialog .acu-dialog-btn i {
                    font-size: 11px;
                }
            }
            @media (max-width: 768px) {
                .acu-change-item { padding: 8px 6px; }
                .acu-change-diff { flex-basis: 100%; margin-top: 4px; order: 10; }
                .acu-change-actions { order: 5; }
                .acu-diff-old, .acu-diff-new { max-width: 100px; }
                .acu-change-action-btn { width: 28px; height: 28px; }
            }
            @media (max-width: 768px) {
                .acu-template-inspection-overlay .acu-edit-dialog {
                    width: calc(100vw - 20px) !important;
                    max-width: calc(100vw - 20px) !important;
                    max-height: calc(100dvh - 24px) !important;
                    padding: 12px !important;
                }
                .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                    padding: 10px 0 !important;
                }
                .acu-template-inspection-clean-card {
                    gap: 12px;
                    padding: 12px;
                }
                .acu-template-inspection-clean-result {
                    grid-template-columns: 36px minmax(0, 1fr);
                    gap: 10px;
                }
                .acu-template-inspection-clean-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 17px;
                }
                .acu-template-inspection-clean-meta {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 6px;
                }
                .acu-template-inspection-clean-meta div {
                    padding: 7px 9px;
                }
                .acu-template-inspection-overlay .acu-settings-content-scroll {
                    max-height: calc(100dvh - 230px) !important;
                    overflow-y: auto !important;
                    padding: 10px 0 !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                    max-height: none !important;
                    overflow: visible !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-actions {
                    gap: 8px !important;
                    padding-top: 10px !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-download {
                    flex: 1 1 0;
                    max-width: none;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-primary-actions {
                    flex: 0 0 auto;
                }
                .acu-template-inspection-summary {
                    flex-direction: column;
                    gap: 5px !important;
                    padding: 0 0 8px !important;
                    margin-bottom: 10px !important;
                }
                .acu-template-inspection-summary-head {
                    gap: 7px;
                }
                .acu-template-inspection-summary-icon {
                    flex-basis: 16px;
                    width: 16px;
                    height: 16px;
                    font-size: 11px;
                }
                .acu-template-inspection-summary-title {
                    font-size: 13px;
                }
                .acu-template-inspection-stats {
                    display: flex;
                    gap: 4px 10px;
                    justify-content: flex-start;
                    max-width: none;
                }
                .acu-template-inspection-stat {
                    justify-content: flex-start;
                    min-width: 0;
                    min-height: 18px;
                    padding: 0;
                }
                .acu-template-inspection-layout {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    gap: 10px !important;
                }
                .acu-template-inspection-tabs {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    min-width: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding: 0 !important;
                }
                .acu-template-inspection-layout-empty {
                    min-height: 180px !important;
                }
                .acu-template-inspection-tab {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: none !important;
                    padding: 8px 9px !important;
                    min-height: 44px;
                }
                .acu-template-inspection-panels {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: 100% !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding-right: 0 !important;
                }
                .acu-template-inspection-card .acu-changes-group-header {
                    padding: 8px !important;
                    align-items: flex-start !important;
                    gap: 6px !important;
                }
                .acu-template-inspection-card .acu-changes-count {
                    margin-left: 4px !important;
                    flex-shrink: 0;
                }
                .acu-template-inspection-card .acu-change-item {
                    padding: 8px !important;
                    word-break: break-word;
                }
                .acu-template-inspection-overlay .acu-dialog-btns {
                    gap: 8px !important;
                    padding: 10px 12px !important;
                }
                .acu-template-inspection-overlay .acu-dialog-btn {
                    min-width: 0 !important;
                    white-space: nowrap !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-primary-actions {
                    flex-wrap: nowrap !important;
                    min-width: 0;
                }
            }
            .acu-template-inspection-layout-empty {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 190px;
            }
            .acu-template-inspection-layout-empty .acu-template-inspection-tabs {
                display: none !important;
            }
            .acu-template-inspection-layout-empty .acu-template-inspection-panels {
                flex: 1;
                max-height: none !important;
                overflow: visible !important;
                padding-right: 0 !important;
            }
            .acu-template-inspection-layout-empty .acu-empty-hint {
                width: 100%;
                min-height: 190px !important;
                padding: 22px 20px !important;
            }
            .acu-change-field-count { font-size: 11px; color: var(--acu-text-sub); margin-left: 4px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            /* 多字段整体编辑弹窗样式 */
            .acu-row-edit-field { margin-bottom: 12px; padding: 10px; background: var(--acu-table-head); border-radius: 6px; border: 1px solid transparent; }
            .acu-row-edit-field.acu-field-changed { border-color: var(--acu-accent); background: var(--acu-bg-panel); }
            .acu-row-edit-label { font-size: 12px; font-weight: bold; color: var(--acu-text-sub); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
            .acu-changed-badge { font-size: 10px; padding: 1px 6px; background: var(--acu-accent); color: var(--acu-btn-active-text); border-radius: 3px; font-weight: normal; }
            .acu-row-edit-old { font-size: 12px; color: var(--acu-text-sub); padding: 6px 8px; background: var(--acu-table-head); border-radius: 4px; margin-bottom: 6px; text-decoration: line-through; opacity: 0.7; white-space: pre-wrap; word-break: break-word; }
            .acu-row-edit-input { width: 100%; min-height: 36px; max-height: 200px; padding: 8px; resize: none; }
            .acu-empty-val { opacity: 0.5; font-style: italic; }
            `;
