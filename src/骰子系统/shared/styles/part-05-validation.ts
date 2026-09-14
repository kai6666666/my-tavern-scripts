// @ts-nocheck
/**
 * part-05-avatar.ts — part-05-validation.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（8）：表格管理列表样式, 设置内预设管理层, 数据验证规则样式, 头像裁剪弹窗样式, 收藏夹面板样式, 收藏夹标签过滤可折叠区域, 收藏夹面板样式 (新增), 导入确认弹窗样式
 */
export const STYLES_PART_05_VALIDATION = `/* ========== 表格管理列表样式 ========== */
            .acu-table-manager-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-height: 300px;
                overflow-y: auto;
                padding: 4px;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-y: contain;
                touch-action: pan-y;
            }
            .acu-table-manager-hint {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-bottom: 8px;
                padding: 0 4px;
            }
            .acu-settings-manager-body .acu-table-manager-list {
                max-height: min(520px, 55vh);
            }
            .acu-table-manager-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                background: transparent;
                border: 1.5px solid var(--acu-accent);
                border-radius: 6px;
                cursor: default;
                transition: all 0.15s;
                user-select: none;
                touch-action: pan-y;
            }
            .acu-table-manager-item:hover {
                background: var(--acu-table-hover);
            }
            .acu-table-manager-item.hidden-table {
                opacity: 0.5;
                border-color: var(--acu-border);
                border-style: dashed;
            }
            .acu-table-manager-item.hidden-table .acu-table-item-name {
                text-decoration: line-through;
            }
            .acu-table-item-check {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--acu-accent);
                border-radius: 4px;
                transition: all 0.15s;
            }
            .acu-table-item-check:hover {
                background: var(--acu-table-hover);
                transform: scale(1.1);
            }
            .acu-table-manager-item.hidden-table .acu-table-item-check {
                color: var(--acu-text-sub);
            }
            .acu-table-item-icon {
                width: 20px;
                text-align: center;
                color: var(--acu-accent);
                font-size: 12px;
            }
            .acu-table-item-name {
                flex: 1;
                font-size: 13px;
                color: var(--acu-text-main);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-table-item-handle {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-sub);
                cursor: grab;
                opacity: 0.4;
                transition: all 0.15s;
                border-radius: 4px;
            }
            .acu-table-item-handle:hover {
                opacity: 1;
                background: var(--acu-table-hover);
                color: var(--acu-accent);
            }
            .acu-dragging {
                cursor: grabbing;
            }
            .acu-drag-ghost {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                opacity: 0.9;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                transform: rotate(2deg);
            }
            .acu-drag-placeholder {
                opacity: 0.3;
                border: 2px dashed var(--acu-border);
                background: var(--acu-table-hover);
            }
            .acu-drag-indicator {
                height: 3px;
                background: var(--acu-accent);
                border-radius: 2px;
                margin: 4px 0;
            }
            @media (max-width: 768px) {
                .acu-table-item-handle {
                    opacity: 0.6;
                }
            }
            /* 特殊按钮样式（投骰/审核/变量） */
            .acu-table-manager-item.acu-special-item {
                background: linear-gradient(135deg, rgba(var(--acu-accent-rgb, 128, 128, 128), 0.08), transparent);
                border-style: dashed;
                border-color: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.3);
            }
            .acu-table-manager-item.acu-special-item .acu-table-item-icon {
                color: var(--acu-accent);
            }
            .acu-table-manager-item.acu-special-item .acu-table-item-name {
                font-weight: 500;
            }
            /* ========== 设置内预设管理层 ========== */
            .acu-settings-manager-overlay {
                position: fixed;
                inset: 0;
                height: 100vh;
                height: 100dvh;
                z-index: 10040;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            }
            .acu-settings-manager-overlay[hidden] {
                display: none !important;
            }
            .acu-settings-manager-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(8, 10, 12, 0.46);
            }
            .acu-settings-manager-dialog {
                position: relative;
                z-index: 1;
                width: min(760px, calc(100vw - 32px));
                max-height: min(780px, calc(100vh - 40px));
                max-height: min(780px, calc(100dvh - 40px));
                display: flex;
                flex-direction: column;
                overflow: hidden;
                background: var(--acu-bg-panel, #1f1f1f);
                background-color: var(--acu-bg-panel, #1f1f1f);
                color: var(--acu-text-main);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 18px 52px rgba(8, 10, 12, 0.38);
            }
            .acu-settings-manager-header {
                flex: 0 0 auto;
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-settings-manager-title {
                min-width: 0;
            }
            .acu-settings-manager-body {
                flex: 1 1 auto;
                min-height: 0;
                overflow: auto;
                padding: 14px 16px 16px;
                background: var(--acu-bg-panel, #1f1f1f);
                background-color: var(--acu-bg-panel, #1f1f1f);
            }
            .acu-settings-manager-control-row {
                gap: 12px;
            }
            .acu-settings-manager-control-row > span {
                color: var(--acu-text-main);
                font-weight: 600;
            }
            @media (max-width: 600px) {
                .acu-settings-manager-overlay {
                    padding: 10px;
                }
                .acu-settings-manager-dialog {
                    width: calc(100vw - 20px);
                    max-height: calc(100vh - 20px);
                    max-height: calc(100dvh - 20px);
                    border-radius: 10px;
                }
                .acu-settings-manager-body {
                    padding: 12px;
                }
                .acu-settings-manager-control-row {
                    align-items: stretch;
                    flex-direction: column;
                }
                .acu-settings-manager-control-row .acu-setting-select {
                    width: 100%;
                    max-width: none !important;
                }
            }
            /* ========== 数据验证规则样式 ========== */
            .acu-validation-rules-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                max-height: 280px;
                overflow-y: auto;
                padding: 2px;
            }
            .acu-validation-rule-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 10px;
                background: transparent;
                border: 1.5px solid var(--acu-accent);
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            .acu-validation-rule-item.disabled {
                opacity: 0.5;
            }
            .acu-validation-rule-item:hover {
                border-color: var(--acu-accent);
            }
            .acu-rule-toggle {
                cursor: pointer;
                font-size: 18px;
                color: var(--text-sub);
                transition: all 0.2s;
                flex-shrink: 0;
                background: none;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-rule-toggle:hover {
                opacity: 0.8;
            }
            .acu-rule-toggle.active {
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-rule-info {
                flex: 1;
                min-width: 0;
            }
            .acu-rule-name {
                font-size: 12px;
                font-weight: 500;
                color: var(--acu-text-main);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-rule-target {
                font-size: 10px;
                color: var(--acu-text-sub);
                margin-top: 2px;
            }
            .acu-rule-type-icon {
                width: 20px;
                font-size: 12px;
                color: var(--acu-text-sub);
                flex-shrink: 0;
                text-align: center;
                background: none !important;
            }
            .acu-settings-manager-dialog .acu-rule-action {
                width: 28px;
                height: 28px;
                min-width: 28px;
                min-height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 28px;
                padding: 0;
                margin: 0;
                border: 1px solid transparent;
                border-radius: 6px;
                background: transparent;
                box-shadow: none;
                color: var(--acu-text-sub);
                cursor: pointer;
                opacity: 0.68;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-settings-manager-dialog .acu-rule-action:hover {
                border-color: transparent;
                background: var(--acu-table-hover);
                opacity: 1;
            }
            .acu-settings-manager-dialog .acu-rule-action:focus {
                outline: none;
                box-shadow: none;
            }
            .acu-settings-manager-dialog .acu-rule-action:focus-visible {
                outline: none;
                box-shadow: var(--acu-focus-ring);
                opacity: 1;
            }
            .acu-settings-manager-dialog .acu-rule-edit:hover {
                color: var(--acu-accent);
            }
            .acu-settings-manager-dialog .acu-rule-delete:hover {
                color: var(--acu-error-text, #e74c3c);
            }
            .acu-rule-intercept {
                cursor: pointer;
                font-size: 14px;
                color: var(--acu-text-sub);
                padding: 4px 6px;
                border-radius: 4px;
                opacity: 0.5;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .acu-rule-intercept:hover {
                opacity: 0.8;
                background: var(--acu-table-hover);
            }
            .acu-rule-intercept.active {
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-add-rule-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                width: 100%;
                padding: 10px;
                margin-top: 8px;
                background: var(--acu-btn-bg);
                border: 1px dashed var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .acu-add-rule-btn:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
            }
            /* 验证规则弹窗 */
            .acu-validation-modal-overlay {
                z-index: 31320;
            }
            .acu-validation-modal {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: 90%;
                max-width: 420px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }
            .acu-edit-dialog.acu-validation-rule-editor-dialog {
                width: min(560px, 92vw);
                max-width: 560px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-validation-modal-body {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 60vh;
                overflow-y: auto;
            }
            .acu-validation-rule-editor-dialog .acu-validation-modal-body {
                flex: 1;
                min-height: 0;
                max-height: none;
                padding: 2px 2px 0;
            }
            .acu-validation-modal-body .acu-setting-row {
                flex-wrap: wrap;
            }
            .acu-validation-modal-body .acu-panel-input,
            .acu-validation-modal input[type="text"],
            .acu-validation-modal input[type="number"],
            .acu-validation-modal select {
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                padding: 8px 10px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                box-shadow: none !important;
                -webkit-appearance: none !important;
            }
            .acu-validation-modal-body .acu-panel-input:focus,
            .acu-validation-modal input[type="text"]:focus,
            .acu-validation-modal input[type="number"]:focus,
            .acu-validation-modal select:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
            }
            .acu-validation-modal-body .acu-panel-input::placeholder,
            .acu-validation-modal input[type="text"]::placeholder,
            .acu-validation-modal input[type="number"]::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7 !important;
            }
            .acu-validation-modal select option {
                background: var(--acu-bg-panel) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-validation-modal select option[value=""] {
                color: var(--acu-text-sub) !important;
                opacity: 0.7 !important;
            }
            .acu-rule-config-section {
                padding: 8px 0;
            }
            .acu-validation-modal-footer {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                padding: 12px 0 0;
                border-top: 1px solid var(--acu-border);
                background: transparent;
                flex-shrink: 0;
            }
            .acu-validation-modal-footer .acu-advanced-preset-editor-actions {
                justify-content: flex-end;
            }
            .acu-validation-modal-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-validation-modal-footer .acu-btn {
                flex: 1;
                padding: 10px 12px !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            /* 智能修改弹窗样式 */
            .acu-smart-fix-meta {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                padding: 4px 0 !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                flex-wrap: wrap !important;
            }
            .acu-smart-fix-separator {
                color: var(--acu-border) !important;
                opacity: 0.5 !important;
            }
            .acu-smart-fix-diff {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                padding: 6px 0 !important;
                margin: 4px 0 !important;
                flex-wrap: wrap !important;
            }
            .acu-smart-fix-diff-old-text {
                color: var(--acu-hl-manual) !important;
                text-decoration: line-through !important;
                opacity: 0.7 !important;
                font-size: 13px !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                max-width: 150px !important;
            }
            .acu-smart-fix-diff-arrow {
                color: var(--acu-text-sub) !important;
                flex-shrink: 0 !important;
            }
            .acu-smart-fix-empty {
                opacity: 0.5 !important;
                font-style: italic !important;
            }
            .acu-smart-fix-diff-input-wrapper {
                flex: 1 !important;
                min-width: 120px !important;
            }
            .acu-smart-fix-diff-input-wrapper input,
            .acu-smart-fix-diff-input-wrapper select {
                width: 100% !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                padding: 4px 8px !important;
                color: var(--acu-text-main) !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                box-shadow: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                min-height: 26px !important;
                line-height: 1.3 !important;
            }
            .acu-smart-fix-diff-input-wrapper input:focus,
            .acu-smart-fix-diff-input-wrapper select:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
            }
            .acu-smart-fix-diff-input-wrapper select {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23666' d='M5 7L1 3h8z'/%3E%3C/svg%3E") !important;
                background-repeat: no-repeat !important;
                background-position: right 6px center !important;
                padding-right: 24px !important;
            }
            .acu-smart-fix-diff-input-wrapper select option {
                background: var(--acu-card-bg) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-smart-fix-suggest {
                padding: 10px !important;
                background: var(--acu-card-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                margin-top: 8px !important;
            }
            .acu-smart-fix-suggest-label {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                margin-bottom: 6px !important;
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
            }
            .acu-smart-fix-suggest-label i {
                color: var(--acu-accent) !important;
            }
            .acu-smart-fix-suggest-value {
                font-size: 13px !important;
                color: var(--acu-success-text) !important;
                font-weight: 500 !important;
                padding: 6px 8px !important;
                background: var(--acu-success-bg) !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-suggest-value:hover {
                background: var(--acu-success-text) !important;
                color: white !important;
            }
            .acu-smart-fix-suggest-options {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 6px !important;
            }
            .acu-smart-fix-suggest-options-scroll {
                max-height: 120px !important;
                overflow-y: auto !important;
                padding-right: 4px !important;
            }
            .acu-smart-fix-option {
                display: inline-block !important;
                font-size: 12px !important;
                padding: 4px 10px !important;
                background: var(--acu-btn-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-option:hover {
                background: var(--acu-btn-hover) !important;
                border-color: var(--acu-accent) !important;
                color: var(--acu-accent) !important;
            }
            .acu-smart-fix-option-current {
                background: var(--acu-hl-manual-bg) !important;
                border-color: var(--acu-hl-manual) !important;
                color: var(--acu-hl-manual) !important;
                text-decoration: line-through !important;
                opacity: 0.7 !important;
            }
            .acu-smart-fix-error-hint {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                padding: 8px !important;
                background: var(--acu-card-bg) !important;
                border-radius: 4px !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
            }
            .acu-smart-fix-error-hint i {
                color: var(--acu-accent) !important;
                flex-shrink: 0 !important;
            }
            @media (max-width: 600px) {
                .acu-smart-fix-diff {
                    flex-direction: column !important;
                    align-items: stretch !important;
                }
                .acu-smart-fix-diff-arrow {
                    transform: rotate(90deg) !important;
                }
            }
            .acu-btn {
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid transparent;
            }
            .acu-btn-secondary {
                background: var(--acu-btn-bg);
                border-color: var(--acu-text-sub);
                color: var(--acu-text-main);
            }
            .acu-btn-secondary:hover {
                background: var(--acu-btn-hover);
            }
            .acu-btn-primary {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
            }
            .acu-btn-primary:hover {
                opacity: 0.9;
            }
            /* 智能修改弹窗新增样式 */
            .acu-smart-fix-rule-info {
                padding: 10px 12px !important;
                background: var(--acu-table-head) !important;
                border: 1px solid var(--acu-border) !important;
                border-color: var(--acu-state-accent-border) !important;
                border-radius: 4px !important;
                margin-bottom: 12px !important;
            }
            .acu-smart-fix-rule-header {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                color: var(--acu-text-main) !important;
                margin-bottom: 4px !important;
            }
            .acu-smart-fix-rule-header i {
                color: var(--acu-accent) !important;
            }
            .acu-smart-fix-rule-desc {
                font-size: 12px !important;
                color: var(--acu-text-sub) !important;
                line-height: 1.4 !important;
            }
            .acu-smart-fix-suggest-section {
                margin-top: 12px !important;
            }
            .acu-smart-fix-suggest code {
                background: var(--acu-table-head) !important;
                padding: 2px 6px !important;
                border-radius: 3px !important;
                font-size: 11px !important;
                color: var(--acu-text-main) !important;
            }
            .acu-smart-fix-quick-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 6px 12px !important;
                background: var(--acu-accent) !important;
                color: var(--acu-btn-active-text) !important;
                border: 1px solid var(--acu-accent) !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-quick-btn:hover {
                background: var(--acu-btn-active-bg) !important;
                color: var(--acu-btn-active-text) !important;
                border-color: var(--acu-btn-active-bg) !important;
            }
            .acu-smart-fix-table-summary {
                padding: 12px !important;
                background: var(--acu-card-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
            }
            .acu-smart-fix-stat {
                font-size: 13px !important;
                color: var(--acu-text-main) !important;
                margin-bottom: 8px !important;
            }
            .acu-smart-fix-stat strong {
                color: var(--acu-hl-manual) !important;
            }
            .acu-smart-fix-change-list {
                max-height: 150px !important;
                overflow-y: auto !important;
                margin-top: 8px !important;
            }
            .acu-smart-fix-change-item {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                padding: 4px 8px !important;
                background: var(--acu-table-head) !important;
                border-radius: 3px !important;
                margin-bottom: 4px !important;
            }
            .acu-smart-fix-hint {
                font-size: 12px !important;
                color: var(--acu-text-sub) !important;
                padding: 8px !important;
                background: var(--acu-table-head) !important;
                border-radius: 4px !important;
                margin-top: 8px !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
            }
            .acu-smart-fix-hint i {
                color: var(--acu-accent) !important;
            }
            /* ========== 头像裁剪弹窗样式 ========== */
            .acu-crop-modal-overlay {
                z-index: 31330;
            }
            .acu-crop-file-input {
                display: none;
            }
            .acu-crop-modal {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: min(360px, calc(100vw - 24px));
                max-width: 360px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                box-sizing: border-box;
            }
            .acu-crop-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-crop-close {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-crop-close:hover {
                color: var(--acu-text-main);
                background: var(--acu-btn-hover);
            }
            .acu-crop-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
            .acu-crop-container {
                position: relative;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                overflow: hidden;
                touch-action: none;
                user-select: none;
            }
            .acu-crop-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                cursor: grab;
            }
            .acu-crop-mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 3px solid var(--acu-accent);
                border-radius: 50%;
                pointer-events: none;
                box-shadow: 0 0 0 1000px rgba(0,0,0,0.3);
            }
            .acu-crop-hint {
                font-size: 11px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-crop-footer {
                display: grid;
                grid-template-columns: 44px minmax(0, 1fr) minmax(0, 1fr);
                gap: 10px;
                padding: 12px 16px;
                background: var(--acu-table-head);
                border-top: 1px solid var(--acu-border);
            }
            .acu-crop-btn {
                min-width: 0;
                min-height: 38px;
                padding: 10px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-crop-cancel {
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
                color: var(--acu-text-main);
            }
            .acu-crop-cancel:hover {
                background: var(--acu-btn-hover);
            }
            .acu-crop-confirm {
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                color: var(--acu-btn-active-text);
            }
            .acu-crop-confirm:hover {
                opacity: 0.9;
            }
            .acu-crop-reupload {
                padding: 0;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-crop-reupload:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }

            /* ========== 收藏夹面板样式 ========== */
            .acu-favorites-overlay,
            .acu-fav-edit-overlay,
            .acu-fav-new-overlay,
            .acu-fav-send-overlay,
            .acu-fav-tag-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 31300;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(2px);
            }
            .acu-favorites-panel {
                width: 90%;
                max-width: 800px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .acu-favorites-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-favorites-header h3 {
                margin: 0;
                font-size: 16px;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-favorites-header-actions {
                display: flex;
                gap: 8px;
            }
            .acu-fav-header-btn {
                padding: 6px 12px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.2s ease;
            }
            .acu-fav-header-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-header-btn.acu-fav-close {
                background: transparent;
                border: none;
                font-size: 16px;
            }
            .acu-favorites-filter {
                display: flex;
                gap: 10px;
                padding: 12px 18px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-favorites-filter select,
            .acu-favorites-filter input {
                flex: 1;
                padding: 8px 12px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 13px;
            }
            .acu-favorites-filter select {
                max-width: 200px;
            }
            .acu-favorites-content {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-favorites-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                color: var(--acu-text-sub);
                text-align: center;
            }
            .acu-favorites-group {
                margin-bottom: 20px;
            }
            .acu-favorites-group-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-favorites-group-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 12px;
            }
            .acu-favorites-card {
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                padding: 12px;
                transition: all 0.2s ease;
            }
            .acu-favorites-card:hover {
                border-color: var(--acu-accent);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .acu-favorites-card-header {
                margin-bottom: 8px;
            }
            .acu-favorites-card-preview {
                font-size: 12px;
                color: var(--acu-text-main);
                line-height: 1.5;
            }
            .acu-fav-preview-item {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-fav-preview-item b {
                color: var(--acu-accent);
            }
            .acu-favorites-card-source {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-top: 4px;
            }
            .acu-favorites-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 8px;
            }
            .acu-favorites-tag {
                padding: 2px 8px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-radius: 10px;
                font-size: 10px;
                font-weight: 500;
            }
            .acu-favorites-card-actions {
                display: flex;
                gap: 6px;
                justify-content: flex-end;
            }
            .acu-fav-btn {
                width: 28px;
                height: 28px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            .acu-fav-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-delete:hover {
                color: #e74c3c;
            }
            .acu-fav-send:hover {
                color: #27ae60;
            }

            /* ========== 收藏夹标签过滤可折叠区域 ========== */
            .acu-fav-tag-filter-collapsible {
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-tag-filter-header {
                position: sticky;
                top: 0;
                z-index: 1;
                padding: 6px 12px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
            }
            .acu-fav-tag-filter-header span {
                font-size: calc(var(--acu-font-size, 13px) * 0.85);
                color: var(--acu-text-sub);
                font-weight: 500;
            }
            .acu-fav-tag-toggle-icon {
                font-size: 10px;
                color: var(--acu-text-sub);
                transition: transform 0.2s;
            }
            .acu-fav-tag-filter-body {
                padding: 8px 12px;
                background: var(--acu-table-head);
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
            }
            .acu-fav-tag-filter-body.horizontal {
                display: grid;
                grid-auto-flow: column;
                grid-template-rows: repeat(auto-fill, minmax(28px, 1fr));
                gap: 6px;
                overflow-x: auto;
            }
            .acu-fav-tag-filter-collapsible.collapsed .acu-fav-tag-filter-body {
                display: none;
            }
            .acu-fav-tag-filter-collapsible.collapsed .acu-fav-tag-toggle-icon {
                transform: rotate(-90deg);
            }
            .acu-fav-tag-btn {
                padding: 0 10px;
                height: 28px;
                background: transparent;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: calc(var(--acu-font-size, 13px) * 0.85);
                transition: all 0.2s ease;
                opacity: 0.5;
                white-space: nowrap;
            }
            .acu-fav-tag-btn:hover {
                opacity: 0.8;
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }
            .acu-fav-tag-btn.active {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
                opacity: 1;
            }

            /* 编辑弹窗 */
            .acu-fav-edit-modal,
            .acu-fav-new-modal,
            .acu-fav-send-modal,
            .acu-fav-tag-modal {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .acu-fav-edit-modal-header,
            .acu-fav-new-modal-header,
            .acu-fav-send-modal-header,
            .acu-fav-tag-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-edit-modal-header h4,
            .acu-fav-new-modal-header h4,
            .acu-fav-send-modal-header h4,
            .acu-fav-tag-modal-header h4 {
                margin: 0;
                font-size: 15px;
                color: var(--acu-accent);
            }
            .acu-fav-edit-close,
            .acu-fav-new-close,
            .acu-fav-send-close,
            .acu-fav-tag-close {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main) !important;
                cursor: pointer;
                font-size: 16px;
            }
            .acu-fav-edit-close:hover,
            .acu-fav-new-close:hover,
            .acu-fav-send-close:hover,
            .acu-fav-tag-close:hover {
                background: transparent !important;
                color: var(--acu-accent) !important;
            }
            .acu-fav-edit-modal-body,
            .acu-fav-new-modal-body,
            .acu-fav-send-modal-body,
            .acu-fav-tag-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-fav-edit-tags-section,
            .acu-fav-tag-input-section {
                margin-bottom: 16px;
            }
            .acu-fav-edit-tags-section label,
            .acu-fav-tag-input-section label {
                display: block;
                font-size: 12px;
                color: var(--acu-text-sub);
                margin-bottom: 6px;
            }
            .acu-fav-edit-tags-section input,
            .acu-fav-tag-input-section input {
                width: 100%;
                padding: 8px 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 13px;
            }
            .acu-fav-edit-rows {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 12px;
            }
            .acu-fav-edit-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .acu-fav-edit-header {
                flex: 0 0 120px;
                padding: 8px 10px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-accent);
                font-size: 12px;
                font-weight: 600;
            }
            .acu-fav-edit-value {
                flex: 1;
                padding: 8px 10px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 12px;
            }
            .acu-fav-edit-remove {
                width: 28px;
                height: 28px;
                background: transparent !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px;
                color: var(--acu-text-sub) !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-remove:hover {
                color: #e74c3c !important;
                border-color: #e74c3c !important;
                background: transparent !important;
            }
            .acu-fav-edit-add-col {
                padding: 8px 12px;
                background: var(--acu-btn-bg);
                border: 1px dashed var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
            }
            .acu-fav-edit-add-col:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }
            .acu-fav-edit-modal-footer,
            .acu-fav-new-modal-footer,
            .acu-fav-send-modal-footer,
            .acu-fav-tag-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 18px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-edit-cancel,
            .acu-fav-new-cancel,
            .acu-fav-send-cancel,
            .acu-fav-tag-cancel {
                padding: 8px 16px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
            }
            .acu-fav-edit-save,
            .acu-fav-new-create,
            .acu-fav-tag-confirm {
                padding: 8px 16px;
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                border-radius: 6px;
                color: var(--acu-btn-active-text);
                cursor: pointer;
            }
            .acu-fav-edit-save:hover,
            .acu-fav-new-create:hover,
            .acu-fav-tag-confirm:hover {
                opacity: 0.9;
            }

            /* 发送选择弹窗 */
            .acu-fav-send-option {
                padding: 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .acu-fav-send-option:hover {
                border-color: var(--acu-accent);
                background: var(--acu-btn-hover);
            }
            .acu-fav-send-option-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-fav-send-option-mode {
                font-size: 12px;
            }
            .acu-fav-send-unmatched {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-top: 4px;
            }

            /* 新建模板选择 */
            .acu-fav-new-modal-body label {
                display: block;
                font-size: 13px;
                color: var(--acu-text-main);
                margin-bottom: 10px;
            }
            .acu-fav-new-modal-body select {
                width: 100%;
                padding: 10px 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .acu-favorites-panel {
                    width: 95%;
                    max-height: 90vh;
                }
                .acu-favorites-group-cards {
                    grid-template-columns: 1fr;
                }
                .acu-favorites-header-actions {
                    flex-wrap: wrap;
                }
                .acu-fav-header-btn span {
                    display: none;
                }
            }

            /* ========== 收藏夹面板样式 (新增) ========== */
            /* [修复] 收藏夹外层容器必须限制高度和溢出，防止卡片超出面板范围 */
            .acu-fav-wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
                max-height: 100%;
                overflow: hidden;
            }
            .acu-fav-panel-content {
                padding: 12px;
                overflow-y: auto;
                overflow-x: auto;
                flex: 1;
                min-height: 0; /* 关键：允许 flex 子元素收缩 */
                /* 滚动条样式 - Firefox */
                scrollbar-width: thin;
                scrollbar-color: var(--acu-btn-bg) var(--acu-bg-nav);
                overscroll-behavior: contain;
            }
            /* 收藏夹面板滚动条 - Webkit (Chrome/Safari/Edge) */
            .acu-fav-panel-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .acu-fav-panel-content::-webkit-scrollbar-track {
                background: var(--acu-bg-nav);
                border-radius: 4px;
            }
            .acu-fav-panel-content::-webkit-scrollbar-thumb {
                background: var(--acu-btn-bg);
                border-radius: 4px;
                border: 2px solid var(--acu-bg-nav);
            }
            .acu-fav-panel-content::-webkit-scrollbar-thumb:hover {
                background: var(--acu-btn-hover);
            }
            .acu-fav-panel-content::-webkit-scrollbar-corner {
                background: var(--acu-bg-nav);
            }
            /* [已废弃] 工具栏已移至Header，保留样式以防回退 */
            /*
            .acu-fav-toolbar {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }
            */
            .acu-fav-select,
            .acu-fav-input {
                padding: 6px 10px !important;
                background: var(--acu-bg-panel) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                height: auto !important;
                box-shadow: none !important;
            }
            .acu-fav-select {
                min-width: 120px;
            }
            .acu-fav-input {
                flex: 1;
                min-width: 150px;
            }
            .acu-fav-toolbar-btn {
                padding: 6px 10px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
            }
            .acu-fav-toolbar-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-grid {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .acu-fav-group-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-accent);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-fav-group-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            /* 收藏夹卡片 - 复用 acu-data-card 宽度，保持与普通表格一致 */
            .acu-fav-card {
                flex: 0 0 var(--acu-card-width, 260px);
                width: var(--acu-card-width, 260px);
                cursor: pointer;
            }
            /* [修复] 收藏夹卡片来源标签 - 放在底部与tags一起 */
            .acu-fav-card-source {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: normal;
                background: var(--acu-badge-bg);
                padding: 2px 8px;
                border-radius: 4px;
            }
            .acu-fav-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding: 6px 12px 8px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-fav-tag {
                padding: 2px 6px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-radius: 8px;
                font-size: 10px;
            }
            /* [已废弃] 操作按钮已改为单击菜单，保留样式以防回退 */
            /*
            .acu-fav-card-actions {
                display: flex;
                justify-content: flex-end;
                gap: 4px;
                padding: 8px 12px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-action-btn {
                width: 28px;
                height: 28px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
            }
            .acu-fav-action-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-delete:hover {
                color: #e74c3c;
            }
            */
            .acu-fav-empty {
                text-align: center;
                padding: 40px 20px;
                color: var(--acu-text-sub);
            }
            .acu-fav-empty i {
                font-size: 36px;
                opacity: 0.3;
                margin-bottom: 12px;
            }
            .acu-fav-empty p {
                margin: 4px 0;
            }

            /* 编辑弹窗 - 保留弹窗形式，添加移动端适配 */
            .acu-fav-edit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 31300;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-modal {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            @media (max-width: 768px) {
                .acu-fav-edit-modal {
                    position: fixed !important;
                    top: 5% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 92vw !important;
                    max-height: 88vh !important;
                }
                .acu-fav-send-modal {
                    width: 92vw !important;
                    max-width: 500px !important;
                }
                .acu-fav-tag-modal {
                    width: 92vw !important;
                    max-width: 500px !important;
                }
                .acu-fav-edit-overlay {
                    align-items: flex-start !important;
                    padding-top: 5vh !important;
                }
                .acu-fav-group-cards {
                    grid-template-columns: 1fr !important;
                }
            }
            /* 编辑弹窗输入框样式覆盖 */
            .acu-fav-edit-modal input,
            .acu-fav-tag-modal input {
                padding: 8px 10px !important;
                background: var(--acu-bg-panel) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                height: auto !important;
                box-shadow: none !important;
            }

    /* Cleaned up Inline Styles */
    #dice-custom-input { width: 60px; }
    
    .acu-mvu-dice-icon {
        cursor: pointer;
        color: var(--acu-accent);
        opacity: 0.6;
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        flex-shrink: 0;
    }
    
    .acu-mvu-level-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--acu-border);
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            opacity var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        background: transparent;
        color: var(--acu-text-sub);
        opacity: 0.5;
    }
    .acu-mvu-level-toggle:hover,
    .acu-mvu-level-toggle:focus-visible {
        border-color: var(--acu-border);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-mvu-level-toggle.active {
        background: var(--acu-accent);
        color: var(--acu-btn-active-text);
        border-color: var(--acu-accent);
        opacity: 1;
    }
    
    .acu-mvu-header {
        padding: 6px 8px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
    }
    
    .acu-mvu-body {
        padding: 8px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
    }
    
    .acu-mvu-item {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        margin-bottom: 4px;
        background: var(--acu-table-hover);
        border-radius: 4px;
        border: 1px solid var(--acu-state-accent-border);
    }
    
    .acu-mvu-path {
        font-size: calc(var(--acu-font-size, 13px) * 0.77);
        color: var(--acu-text-sub);
        margin-bottom: 2px;
    }
    
    .acu-mvu-val {
        font-size: var(--acu-font-size, 13px);
        color: var(--acu-accent);
        font-weight: bold;
        cursor: pointer;
    }
    
    .acu-mvu-list {
        padding: 0 8px;
    }

    .acu-mvu-toggle-icon {
        font-size: 10px;
        color: var(--acu-text-sub);
        transition: transform 0.2s;
    }
    .acu-mvu-header-text {
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        color: var(--acu-text-sub);
    }
    .acu-mvu-item-content {
        flex: 1;
        min-width: 0;
    }
    .acu-mvu-item-row {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acu-mvu-attr-name {
        font-size: calc(var(--acu-font-size, 13px) * 0.92);
        color: var(--acu-text-main);
        font-weight: bold;
    }
    .acu-order-first {
        order: -1;
    }
    .acu-text-sub-small {
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        color: var(--acu-text-sub);
    }
    .acu-ml-6 {
        margin-left: 6px;
    }

    /* Graph & Node Size Controls */
    .acu-graph-filter-btn {
        padding: 4px 6px;
        font-size: 12px;
    }
    .acu-graph-filter-btn.ml-8 {
        margin-left: 8px;
    }
    .acu-node-size-slider-container {
        position: absolute;
        display: none;
        width: 200px;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10;
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
    }
    .acu-slider-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
    }
    .acu-range-input {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        background: var(--acu-input-bg);
        margin: 0;
    }
    .acu-range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--acu-accent);
        cursor: pointer;
        margin-top: -4px; /* Adjust for track height if needed, usually 0 or negative for center */
    }
    .acu-range-input::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        cursor: pointer;
        background: var(--acu-input-bg);
        border-radius: 4px;
    }
    .acu-graph-reset-btn {
        width: auto;
        height: auto;
        padding: 4px 10px;
        font-size: 11px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .acu-node-size-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    .acu-stepper-container {
        display: flex;
        align-items: center;
    }
    .acu-stepper-value-display {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .acu-zoom-info {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--acu-text-sub);
        font-size: 11px;
    }

    /* 锁定图标 - CSS-only */
    [data-locked="true"]::after {
        content: "\\f023";
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        font-size: 10px;
        color: var(--acu-accent);
        opacity: 0.7;
        margin-left: 4px;
        pointer-events: none;
        display: inline;
    }

    /* 标题锁图标略大 */
    .acu-editable-title[data-locked="true"]::after {
        font-size: 11px;
        opacity: 0.8;
    }

    /* ========== 导入确认弹窗样式 ========== */
    .acu-import-confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 31300;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        box-sizing: border-box;
    }

    .acu-import-confirm-dialog {
        width: 90%;
        max-width: 420px;
        max-height: calc(100vh - 32px);
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        overflow: hidden;
        animation: acu-modal-pop 0.2s ease-out;
        display: flex;
        flex-direction: column;
    }

    .acu-import-confirm-title {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .acu-import-close-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .acu-import-close-btn:hover {
        background: var(--acu-btn-hover);
        color: var(--acu-text-main);
    }

    .acu-import-warning {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: var(--acu-hl-manual-bg, rgba(230, 126, 34, 0.15));
        border-radius: 6px;
        color: var(--acu-hl-manual, #e67e22);
        font-size: 13px;
        margin-bottom: 12px;
    }

    .acu-import-conflict-list {
        max-height: 120px;
        overflow-y: auto;
        padding: 10px 12px;
        background: var(--acu-table-hover);
        border-radius: 6px;
        font-size: 12px;
        color: var(--acu-text-main);
        line-height: 1.6;
        margin-bottom: 12px;
    }

    .acu-import-conflict-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .acu-import-radio {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .acu-import-radio:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
    }

    .acu-import-radio input[type="radio"] {
        accent-color: var(--acu-accent);
    }

    .acu-import-success {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        background: var(--acu-success-bg, rgba(39, 174, 96, 0.15));
        border-radius: 6px;
        color: var(--acu-success-text, #27ae60);
        font-size: 13px;
    }

    .acu-gacha-catalog-import-icon {
        background: var(--acu-btn-hover) !important;
        color: var(--acu-accent) !important;
    }

    .acu-import-confirm-footer {
        display: flex;
        gap: 10px;
        padding: 14px 18px;
        border-top: 1px solid var(--acu-border);
        background: var(--acu-table-head);
    }

    .acu-import-confirm-footer.acu-gacha-catalog-clear-footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .acu-gacha-catalog-clear-all {
        background: var(--acu-btn-hover) !important;
        border-color: var(--acu-accent) !important;
        color: var(--acu-text-main) !important;
    }

    .acu-import-cancel-btn,
    .acu-import-confirm-btn {
        flex: 1;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .acu-import-cancel-btn {
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-text-sub);
        color: var(--acu-text-main);
    }

    .acu-import-cancel-btn:hover {
        background: var(--acu-btn-hover);
    }

    .acu-import-confirm-btn {
        background: var(--acu-accent);
        border: 1px solid var(--acu-accent);
        color: var(--acu-btn-active-text);
    }

    .acu-import-confirm-btn:hover {
        filter: brightness(1.1);
    }

    /* ========================================
     * Debug Console - 移动端优化 & 美化
     * ======================================== */
    
    /* 主弹窗容器 - 移动端全屏，PC端居中 */
    .acu-debug-console-dialog {
        width: 100% !important;
        max-width: 100vw !important;
        height: 100% !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        margin: 0 !important;
        background: var(--acu-bg-panel) !important;
        animation: debugSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog {
            width: 90vw !important;
            max-width: 900px !important;
            height: 85vh !important;
            max-height: 700px !important;
            border-radius: 16px !important;
            animation: debugFadeScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
    }
    
    @keyframes debugSlideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes debugFadeScale {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    /* Header 样式美化 */
    .acu-debug-console-dialog .acu-settings-header {
        background: linear-gradient(135deg, var(--acu-table-head) 0%, var(--acu-bg-panel) 100%) !important;
        border-bottom: 1px solid var(--acu-border) !important;
        padding: 16px 20px !important;
        position: relative !important;
    }
    
    .acu-debug-console-dialog .acu-settings-title {
        font-size: 16px !important;
        font-weight: 700 !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        color: var(--acu-text-main) !important;
    }
    
    .acu-debug-console-dialog .acu-settings-title i {
        font-size: 18px !important;
        color: var(--acu-accent) !important;
        animation: debugPulse 2s ease-in-out infinite !important;
    }
    
    @keyframes debugPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    /* 工具栏 - 移动端垂直布局 */
    .acu-debug-console-dialog .acu-debug-toolbar {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--acu-border) !important;
        background: var(--acu-card-bg) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-toolbar {
            flex-direction: row !important;
            align-items: center !important;
            padding: 14px 20px !important;
        }
    }
    
    /* Console 抓取开关 */
    .acu-debug-console-dialog .acu-debug-capture-row {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 10px 14px !important;
        background: var(--acu-table-hover) !important;
        border-radius: 10px !important;
        border: 1px solid var(--acu-border) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-label {
        font-size: 13px !important;
        color: var(--acu-text-sub) !important;
        flex: 1 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status {
        font-size: 12px !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
        font-weight: 600 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status.enabled {
        background: var(--acu-success-bg) !important;
        color: var(--acu-success-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status.disabled {
        background: var(--acu-badge-bg) !important;
        color: var(--acu-text-sub) !important;
    }
    
    /* 过滤器按钮组 - 移动端横向滚动 */
    .acu-debug-console-dialog .acu-debug-filter-group {
        display: flex !important;
        gap: 8px !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 4px 0 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-group::-webkit-scrollbar {
        display: none !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn {
        flex-shrink: 0 !important;
        padding: 8px 14px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: 1px solid var(--acu-border) !important;
        background: var(--acu-btn-bg) !important;
        color: var(--acu-text-sub) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn:active {
        transform: scale(0.95) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn.active {
        background: var(--acu-accent) !important;
        color: var(--acu-button-text-on-accent, #fff) !important;
        border-color: var(--acu-accent) !important;
        box-shadow: 0 2px 8px rgba(var(--acu-accent-rgb, 59, 130, 246), 0.3) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn .count {
        font-size: 10px !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        min-width: 18px !important;
        text-align: center !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn.active .count {
        background: rgba(0, 0, 0, 0.15) !important;
    }
    
    /* 日志类型指示器颜色 */
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="log"] .indicator { color: var(--acu-text-sub) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="info"] .indicator { color: var(--acu-hl-diff) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="warn"] .indicator { color: var(--acu-warning-text) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="error"] .indicator { color: var(--acu-error-text) !important; }
    
    /* 操作按钮组 */
    .acu-debug-console-dialog .acu-debug-actions {
        display: flex !important;
        gap: 8px !important;
        margin-top: 8px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-actions {
            margin-top: 0 !important;
            margin-left: auto !important;
        }
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn {
        flex: 1 !important;
        padding: 10px 12px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: 1px solid var(--acu-border) !important;
        background: var(--acu-btn-bg) !important;
        color: var(--acu-text-main) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-action-btn {
            flex: none !important;
            padding: 8px 14px !important;
        }
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn:hover {
        background: var(--acu-btn-hover) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn:active {
        transform: scale(0.95) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.primary {
        background: var(--acu-accent) !important;
        color: var(--acu-button-text-on-accent, #fff) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.danger {
        color: var(--acu-error-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.danger:hover {
        background: var(--acu-error-bg) !important;
        border-color: var(--acu-error-text) !important;
    }
    
    /* 日志滚动区域 */
    .acu-debug-console-dialog .acu-debug-log-scroll {
        flex: 1 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        background: var(--acu-card-bg) !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    /* 日志容器 */
    .acu-debug-console-dialog .acu-debug-log-container {
        padding: 0 !important;
    }
    
    /* 单条日志项 - 移动端优化 */
    .acu-debug-console-dialog .acu-debug-log-item {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--acu-border) !important;
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
        transition: background 0.15s ease !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-item:hover {
        background: var(--acu-table-hover) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-item:active {
        background: var(--acu-btn-hover) !important;
    }
    
    /* 日志头部 - 移动端垂直布局 */
    .acu-debug-console-dialog .acu-debug-log-header {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 8px !important;
        margin-bottom: 6px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-time {
        font-size: 10px !important;
        color: var(--acu-text-sub) !important;
        opacity: 0.8 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type {
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        padding: 2px 8px !important;
        border-radius: 4px !important;
        letter-spacing: 0.5px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.log {
        background: var(--acu-badge-bg) !important;
        color: var(--acu-text-sub) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.info {
        background: var(--acu-hl-diff-bg) !important;
        color: var(--acu-hl-diff) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.warn {
        background: var(--acu-warning-bg) !important;
        color: var(--acu-warning-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.error {
        background: var(--acu-error-bg) !important;
        color: var(--acu-error-text) !important;
    }
    
    /* 日志内容 */
    .acu-debug-console-dialog .acu-debug-log-content {
        color: var(--acu-text-main) !important;
        word-break: break-word !important;
        white-space: pre-wrap !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
    }
    
    /* 堆栈信息 */
    .acu-debug-console-dialog .acu-debug-log-stack {
        margin-top: 8px !important;
        padding: 10px 12px !important;
        background: rgba(0, 0, 0, 0.05) !important;
        border-radius: 8px !important;
        font-size: 11px !important;
        color: var(--acu-text-sub) !important;
        white-space: pre-wrap !important;
        word-break: break-all !important;
        border: 1px solid var(--acu-state-error-border) !important;
    }
    
    /* 空状态 */
    .acu-debug-console-dialog .acu-debug-empty {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 60px 20px !important;
        color: var(--acu-text-sub) !important;
        text-align: center !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty i {
        font-size: 48px !important;
        margin-bottom: 16px !important;
        opacity: 0.5 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty-text {
        font-size: 14px !important;
        margin-bottom: 8px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty-hint {
        font-size: 12px !important;
        opacity: 0.7 !important;
    }
    
    /* 底部状态栏 */
    .acu-debug-console-dialog .acu-debug-footer {
        padding: 12px 16px !important;
        border-top: 1px solid var(--acu-border) !important;
        background: var(--acu-table-head) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        font-size: 12px !important;
        color: var(--acu-text-sub) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stats {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stat {
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stat-value {
        font-weight: 700 !important;
        color: var(--acu-accent) !important;
    }
    
    /* 关闭按钮优化 */
    .acu-debug-console-dialog .acu-close-btn {
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--acu-btn-bg) !important;
        border: 1px solid var(--acu-border) !important;
        color: var(--acu-text-sub) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
    }
    
    .acu-debug-console-dialog .acu-close-btn:hover {
        background: var(--acu-error-bg) !important;
        color: var(--acu-error-text) !important;
        border-color: var(--acu-error-text) !important;
        transform: rotate(90deg) !important;
    }
    
    /* Toggle 开关美化 */
    .acu-debug-console-dialog .acu-toggle {
        position: relative !important;
        display: inline-block !important;
        width: 44px !important;
        height: 24px !important;
        flex-shrink: 0 !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
    }
    
    .acu-debug-console-dialog .acu-toggle-slider {
        position: absolute !important;
        cursor: pointer !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: var(--acu-btn-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 24px !important;
        transition: all 0.3s ease !important;
    }
    
    .acu-debug-console-dialog .acu-toggle-slider::before {
        position: absolute !important;
        content: "" !important;
        height: 18px !important;
        width: 18px !important;
        left: 2px !important;
        bottom: 2px !important;
        background: var(--acu-text-sub) !important;
        border-radius: 50% !important;
        transition:
            transform var(--acu-motion-normal) var(--acu-ease-out),
            background-color var(--acu-motion-normal) var(--acu-ease-standard) !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input:checked + .acu-toggle-slider {
        background: var(--acu-accent) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input:checked + .acu-toggle-slider::before {
        transform: translateX(20px) !important;
        background: var(--acu-button-text-on-accent, #fff) !important;
    }
`;
