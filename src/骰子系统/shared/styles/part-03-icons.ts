// @ts-nocheck
/**
 * part-03-dice.ts — part-03-icons.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（9）：头像管理器视图切换与排序, 头像管理器工具栏 v3, 图标预设管理器, 删除确认弹窗样式, [Redesign] 删除确认弹窗新样式, 导入确认弹窗样式, 预设导入警告样式, 头像导入/导出相关样式, 统一骰子设置面板样式
 */
export const STYLES_PART_03_ICONS = `/* ========== 头像管理器视图切换与排序 ========== */
/* ========== 头像管理器工具栏 v3 ========== */

            /* 标题栏操作按钮区域 */
            .acu-avatar-header-actions {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            /* 标题栏中的按钮统一样式 */
            .acu-avatar-header-actions .acu-btn-icon {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .acu-avatar-header-actions .acu-btn-icon:hover {
                background-color: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            /* 关闭按钮与其他按钮对齐 */
            .acu-avatar-header-actions .acu-avatar-close {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .acu-avatar-header-actions .acu-avatar-close:hover {
                background-color: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            /* 工具栏中的搜索框 */
            .acu-toolbar-group .acu-search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                width: 100px;
                transition: color var(--acu-motion-fast) var(--acu-ease-standard);
                flex-shrink: 0;
            }

            .acu-toolbar-group .acu-search-wrapper:focus-within {
                width: 140px;
            }

            .acu-toolbar-group .acu-search-icon {
                position: absolute;
                left: 8px;
                color: var(--acu-text-sub);
                pointer-events: none;
                font-size: 11px;
                z-index: 1;
            }

            .acu-toolbar-group .acu-avatar-search {
                width: 100%;
                height: 34px !important;
                min-height: 34px !important;
                max-height: 34px !important;
                padding: 0 24px 0 26px !important;
                margin: 0 !important;
                background: var(--acu-input-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                font-size: 11px !important;
                box-shadow: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                line-height: 32px !important;
            }

            .acu-toolbar-group .acu-avatar-search:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: none !important;
            }

            .acu-toolbar-group .acu-avatar-search::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7;
            }

            .acu-toolbar-group .acu-search-clear {
                position: absolute;
                right: 2px;
                width: 30px;
                height: 30px;
                border: 0;
                background: transparent;
                cursor: pointer;
                color: var(--acu-text-sub);
                font-size: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }

            .acu-toolbar-group .acu-search-clear:hover {
                color: var(--acu-text-main);
            }

            /* 旧样式保留以防兼容问题 */
            .acu-avatar-header-actions .acu-search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                width: 100px;
                transition: color var(--acu-motion-fast) var(--acu-ease-standard);
            }

            .acu-avatar-header-actions .acu-search-wrapper:focus-within {
                width: 140px;
            }

            .acu-avatar-header-actions .acu-search-icon {
                position: absolute;
                left: 8px;
                color: var(--acu-text-sub);
                pointer-events: none;
                font-size: 11px;
            }

            .acu-avatar-header-actions .acu-avatar-search {
                width: 100%;
                height: 28px;
                padding: 0 24px 0 26px !important;
                background: var(--acu-input-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                font-size: 11px !important;
                box-shadow: none !important;
                outline: none !important;
            }

            .acu-avatar-header-actions .acu-avatar-search:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: none !important;
            }

            .acu-avatar-header-actions .acu-avatar-search::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7;
            }

            .acu-avatar-header-actions .acu-search-clear {
                position: absolute;
                right: 2px;
                width: 30px;
                height: 30px;
                border: 0;
                background: transparent;
                cursor: pointer;
                color: var(--acu-text-sub);
                font-size: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }

            .acu-avatar-header-actions .acu-search-clear:hover {
                color: var(--acu-text-main);
            }

            /* 工具栏 */
            .acu-avatar-toolbar {
                display: flex;
                flex-wrap: nowrap;
                gap: 6px;
                padding: 8px 12px;
                background-color: var(--acu-bg-panel);
                border-bottom: 1px solid var(--acu-border);
                align-items: center;
                justify-content: flex-start;
            }

            .acu-toolbar-group {
                display: flex;
                flex-wrap: nowrap;
                gap: 6px;
                align-items: center;
                min-width: 0;
            }

            .acu-toolbar-group.left {
                flex: 1 1 auto;
                min-width: 0;
                width: 100%;
            }

            .acu-toolbar-group.right {
                flex-shrink: 0;
            }

            /* 图标按钮 */
            .acu-avatar-manager-overlay .acu-btn-icon {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .acu-avatar-manager-overlay .acu-btn-icon:hover {
                background-color: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            .acu-avatar-manager-overlay .acu-btn-icon.active {
                background-color: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            /* 下拉框 */
            .acu-select-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .acu-avatar-manager-overlay .acu-toolbar-select {
                height: 34px !important;
                min-height: 34px !important;
                max-height: 34px !important;
                padding: 0 24px 0 8px !important;
                margin: 0 !important;
                background: var(--acu-btn-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                font-size: 11px !important;
                cursor: pointer;
                appearance: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23888' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E") !important;
                background-repeat: no-repeat !important;
                background-position: right 8px center !important;
                box-shadow: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                line-height: 32px !important;
            }

            .acu-avatar-manager-overlay .acu-toolbar-select option {
                background: var(--acu-bg-panel) !important;
                color: var(--acu-text-main) !important;
            }

            .acu-avatar-manager-overlay .acu-toolbar-select:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: none !important;
            }

            .acu-select-wrapper.sort-field .acu-toolbar-select {
                min-width: 60px;
            }

            .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-avatar-filter-controls {
                width: 100%;
                align-items: center;
                flex-wrap: nowrap;
            }

            .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-toolbar-group .acu-search-wrapper {
                flex: 1 1 170px;
                width: auto;
                min-width: 112px;
                max-width: 340px;
                margin-left: auto;
            }

            .acu-avatar-manager-overlay .acu-sort-menu {
                position: relative;
                flex-shrink: 0;
            }

            .acu-avatar-manager-overlay .acu-sort-trigger {
                min-width: 72px;
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                background-image: none !important;
                text-align: left;
            }

            .acu-avatar-manager-overlay .acu-sort-label {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-avatar-manager-overlay .acu-sort-trigger .fa-caret-down {
                font-size: 10px;
                color: var(--acu-text-sub);
                transition: transform 0.16s ease;
            }

            .acu-avatar-manager-overlay .acu-sort-menu.open .acu-sort-trigger {
                border-color: var(--acu-accent) !important;
            }

            .acu-avatar-manager-overlay .acu-sort-menu.open .acu-sort-trigger .fa-caret-down {
                transform: rotate(180deg);
            }

            .acu-avatar-manager-overlay .acu-sort-menu-list {
                display: none;
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                min-width: 100%;
                padding: 4px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                box-shadow: 0 8px 24px var(--acu-shadow);
                z-index: 2;
            }

            .acu-avatar-manager-overlay .acu-sort-menu.open .acu-sort-menu-list {
                display: grid;
                gap: 2px;
            }

            .acu-avatar-manager-overlay .acu-sort-option {
                width: 100%;
                height: 32px;
                padding: 0 10px;
                border: 0;
                border-radius: 4px;
                background: transparent;
                color: var(--acu-text-main);
                font-size: 12px;
                text-align: left;
                cursor: pointer;
            }

            .acu-avatar-manager-overlay .acu-sort-option:hover {
                background: var(--acu-btn-hover);
            }

            .acu-avatar-manager-overlay .acu-sort-option.active {
                background: var(--acu-accent);
                color: var(--acu-button-text-on-accent);
            }

            /* 移动端响应式 - 搜索框更紧凑 */
            @media (max-width: 500px) {
                .acu-avatar-toolbar {
                    padding: 8px;
                    gap: 5px;
                }
                .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-avatar-filter-controls {
                    gap: 5px;
                }
                .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-toolbar-group .acu-search-wrapper {
                    order: 0;
                    flex: 1 1 72px;
                    width: 100%;
                    max-width: none;
                    min-width: 72px;
                    margin-left: 0;
                }
                .acu-avatar-manager-overlay .acu-sort-trigger {
                    min-width: 66px;
                    max-width: 84px;
                    gap: 5px;
                    padding-left: 7px !important;
                    padding-right: 7px !important;
                }
                .acu-toolbar-group .acu-avatar-search {
                    padding-left: 22px !important;
                    padding-right: 22px !important;
                }
                .acu-toolbar-group .acu-search-icon {
                    left: 7px;
                }
                .acu-toolbar-group .acu-search-clear {
                    width: 24px;
                }
                .acu-avatar-header-actions .acu-search-wrapper {
                    width: 80px;
                }
                .acu-avatar-header-actions .acu-search-wrapper:focus-within {
                    width: 100px;
                }
            }

            /* ========== 图标预设管理器 ========== */
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager {
                width: min(96vw, 1120px);
                max-width: 1120px;
                max-height: calc(100vh - 40px);
                max-height: calc(100dvh - 40px);
                min-height: min(620px, calc(100vh - 40px));
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-guide-top {
                flex: 0 0 auto;
                background: color-mix(in srgb, var(--acu-bg-panel) 92%, var(--acu-card-bg, var(--acu-bg-panel)) 8%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-panel-header {
                padding: 14px 18px;
                border-bottom: 1px solid var(--acu-border);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-avatar-title {
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-avatar-title i {
                color: var(--acu-accent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-avatar-header-actions {
                gap: 8px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-btn-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-file-input {
                display: none;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-btn-icon:focus-visible,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn:focus-visible,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn:focus-visible {
                outline: 2px solid color-mix(in srgb, var(--acu-accent) 72%, transparent);
                outline-offset: 2px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                flex-wrap: wrap;
                align-items: stretch;
                gap: 10px;
                flex-shrink: 0;
                padding: 12px 18px;
                background: color-mix(in srgb, var(--acu-table-head) 72%, transparent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls {
                flex: 0 1 340px;
                flex-wrap: nowrap;
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-select-wrapper {
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select {
                min-width: 120px !important;
                max-width: 190px;
                height: 38px !important;
                min-height: 38px !important;
                max-height: 38px !important;
                border-radius: 8px !important;
                font-size: 12px !important;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select:hover,
            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select:focus {
                border-color: color-mix(in srgb, var(--acu-accent) 68%, var(--acu-border)) !important;
                background-color: color-mix(in srgb, var(--acu-input-bg, var(--acu-btn-bg)) 86%, var(--acu-accent) 14%) !important;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-table-filter {
                min-width: 150px !important;
                max-width: 230px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                flex: 1 1 220px;
                min-width: 160px;
                width: 100% !important;
                transition: none;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-group .acu-custom-icon-search-wrapper:focus-within {
                width: 100% !important;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper .acu-search-icon {
                position: absolute;
                left: 10px;
                color: var(--acu-text-sub);
                pointer-events: none;
                z-index: 1;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search {
                width: 100%;
                height: 38px !important;
                min-height: 38px !important;
                padding: 0 12px 0 32px !important;
                margin: 0 !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 8px !important;
                color: var(--acu-text-main) !important;
                box-shadow: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search:focus {
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 22%, transparent) !important;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.75;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-actions {
                flex: 0 0 auto;
                margin-left: 0;
                flex-wrap: nowrap;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn {
                min-height: 36px;
                padding: 8px 12px;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: var(--acu-text-main);
                background: var(--acu-btn-bg);
                transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn:hover {
                border-color: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
                color: var(--acu-text-main);
                transform: translateY(-1px);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn:active {
                transform: translateY(0);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-body {
                display: grid;
                grid-template-columns: minmax(300px, 0.95fr) minmax(340px, 1.05fr);
                flex: 1 1 auto;
                min-height: 0;
                overflow: hidden;
                border-top: 1px solid var(--acu-border);
                background: color-mix(in srgb, var(--acu-bg-panel) 94%, var(--acu-table-head) 6%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                min-height: 0;
                overflow-y: auto;
                overscroll-behavior: contain;
                -ms-overflow-style: none;
                scrollbar-width: none;
                -webkit-overflow-scrolling: touch;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list::-webkit-scrollbar,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list {
                border-right: 1px solid var(--acu-border);
                padding: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-empty-note {
                color: var(--acu-text-sub);
                font-size: 11px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item {
                cursor: pointer;
                border: 1px solid transparent;
                border-radius: 8px;
                margin-bottom: 6px;
                padding: 10px 12px;
                transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item:last-child {
                margin-bottom: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item:hover {
                background: color-mix(in srgb, var(--acu-table-hover) 86%, transparent);
                border-color: color-mix(in srgb, var(--acu-border) 76%, var(--acu-accent) 24%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item.is-selected {
                background: color-mix(in srgb, var(--acu-table-hover) 82%, var(--acu-accent) 10%);
                border-color: color-mix(in srgb, var(--acu-accent) 56%, var(--acu-border));
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-accent) 18%, transparent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item:focus-visible {
                outline: 2px solid color-mix(in srgb, var(--acu-accent) 72%, transparent);
                outline-offset: 2px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item .acu-avatar-row-collapsed {
                gap: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list-info {
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list-name {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-preview {
                width: 46px;
                height: 46px;
                border-radius: 10px;
                border-width: 1px;
                cursor: default;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-preview-wrap {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-source {
                bottom: -8px;
                border: 1px solid color-mix(in srgb, var(--acu-border) 78%, transparent);
                background: color-mix(in srgb, var(--acu-bg-panel) 78%, var(--acu-badge-bg) 22%);
                color: var(--acu-text-main);
                font-size: 10px;
                line-height: 1.1;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-name {
                max-width: 100%;
                min-width: 0;
                font-size: 15px;
                line-height: 1.35;
                margin-bottom: 3px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-name > span:first-child {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-missing-text {
                color: var(--acu-warning-text);
                margin-left: 6px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-url-preview {
                max-width: 100%;
                line-height: 1.45;
                opacity: 0.88;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                padding: 16px;
                background: color-mix(in srgb, var(--acu-bg-panel) 90%, var(--acu-table-head) 10%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-panel {
                display: flex;
                flex-direction: column;
                gap: 16px;
                min-height: 100%;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-head {
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 14px;
                border-bottom: 1px dashed var(--acu-border);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-title {
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
                color: var(--acu-text-main);
                font-size: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-url-label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-local-status {
                color: var(--acu-warning-text);
                font-size: 11px;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url {
                width: 100%;
                min-height: 42px;
                padding: 0 12px;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 8px !important;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                box-sizing: border-box;
                transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url:focus {
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 20%, transparent) !important;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-warning {
                display: flex;
                align-items: flex-start;
                gap: 7px;
                padding: 9px 10px;
                border: 1px solid color-mix(in srgb, var(--acu-warning-text) 48%, var(--acu-border));
                border-radius: 8px;
                background: var(--acu-warning-bg);
                color: var(--acu-warning-text);
                font-size: 12px;
                line-height: 1.45;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
                gap: 10px;
                margin-top: auto;
                padding-top: 12px;
                border-top: 1px dashed var(--acu-border);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                flex: 1 1 118px;
                min-width: 0;
                min-height: 42px;
                padding: 8px 10px;
                color: var(--acu-text-main);
                background: var(--acu-btn-bg);
                border-radius: 8px;
                transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn:hover {
                border-color: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
                background: var(--acu-btn-hover);
                transform: translateY(-1px);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn:active {
                transform: translateY(0);
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save-local {
                display: none !important;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local {
                font-size: 0;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local i {
                font-size: 14px;
                margin-right: 6px;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local::after {
                content: "上传";
                font-size: 14px;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save {
                font-size: 0;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save i {
                font-size: 14px;
                margin-right: 6px;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save::after {
                content: "保存";
                font-size: 14px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-save-hint {
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.45;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-primary-btn {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-primary-btn:hover {
                color: var(--acu-btn-active-text);
                background: color-mix(in srgb, var(--acu-accent) 86%, var(--acu-text-main) 14%);
                border-color: var(--acu-accent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-danger-btn {
                color: var(--acu-error-text);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-danger-btn:hover {
                color: var(--acu-error-text);
                border-color: color-mix(in srgb, var(--acu-error-text) 62%, var(--acu-border));
                background: var(--acu-error-bg);
            }

            @media (prefers-reduced-motion: reduce) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url {
                    transition: none;
                }
            }

            @media (max-width: 768px) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager {
                    width: calc(100vw - 16px);
                    height: calc(100vh - 16px);
                    height: calc(100dvh - 16px);
                    max-height: calc(100vh - 16px);
                    max-height: calc(100dvh - 16px);
                    min-height: 0;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                    display: grid;
                    grid-template-columns: minmax(86px, 0.9fr) minmax(96px, 1fr) 42px 42px minmax(96px, 1.1fr);
                    grid-template-areas: "module table import export search";
                    gap: 6px;
                    align-items: center;
                    padding: 10px 12px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls {
                    display: contents;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls .acu-select-wrapper:nth-of-type(1) {
                    grid-area: module;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls .acu-select-wrapper:nth-of-type(2) {
                    grid-area: table;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-table-filter,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper {
                    min-width: 0 !important;
                    max-width: none;
                    width: 100%;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper {
                    grid-area: search;
                    height: 40px;
                    width: 100% !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-toolbar-group .acu-custom-icon-search-wrapper:focus-within {
                    width: 100% !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-actions {
                    grid-area: pack;
                    display: contents;
                    margin-left: 0;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn {
                    width: 100%;
                    min-width: 0;
                    height: 40px;
                    min-height: 40px;
                    padding: 0;
                    border-radius: 8px;
                    justify-content: center;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-import {
                    grid-area: import;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-export {
                    grid-area: export;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search,
                .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select {
                    height: 40px !important;
                    min-height: 40px !important;
                    font-size: 13px !important;
                    border-radius: 8px !important;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search {
                    padding-left: 30px !important;
                    padding-right: 6px !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper .acu-search-icon {
                    left: 10px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-action-label {
                    display: none;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-body {
                    grid-template-columns: 1fr;
                    grid-template-rows: minmax(0, 1fr) auto;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list {
                    border-right: 0;
                    border-bottom: 1px solid var(--acu-border);
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                    position: relative;
                    border-top: 1px solid var(--acu-border);
                    background: color-mix(in srgb, var(--acu-bg-panel) 92%, var(--acu-table-head) 8%);
                    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--acu-text-main) 10%, transparent);
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail::before {
                    content: none;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                    padding: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                    padding-top: 8px;
                    padding-bottom: max(8px, env(safe-area-inset-bottom));
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item {
                    padding: 8px 10px;
                    margin-bottom: 5px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-row-collapsed {
                    gap: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-preview {
                    width: 38px;
                    height: 38px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-name {
                    font-size: 13px;
                    margin-bottom: 0;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-url-preview {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 11px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-panel {
                    min-height: 0;
                    gap: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-head {
                    display: none;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-form {
                    gap: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-form label {
                    gap: 5px !important;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url {
                    padding: 7px 9px !important;
                    min-height: 36px;
                    font-size: 12px !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-url-label {
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-local-status {
                    max-width: 55%;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-actions {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 6px;
                    margin-top: auto;
                    padding-top: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn {
                    flex: 0 1 auto;
                    min-width: 0;
                    width: 100%;
                    min-height: 38px;
                    padding: 0 4px;
                    justify-content: center;
                    white-space: nowrap;
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn i {
                    margin-right: 0;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save i,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local i {
                    margin-right: 0;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save::after,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local::after {
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-clear-input {
                    font-size: 0;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-clear-input i {
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-clear-input::after {
                    content: "清空";
                    font-size: 12px;
                }
            }

            @media (max-width: 520px) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                    grid-template-columns: minmax(78px, 0.9fr) minmax(88px, 1fr) 40px 40px minmax(78px, 1.1fr);
                }
            }

            @media (max-width: 420px) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                    grid-template-columns: minmax(72px, 0.9fr) minmax(80px, 1fr) 40px 40px minmax(64px, 1.1fr);
                    gap: 5px;
                    padding-inline: 10px;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search {
                    font-size: 12px !important;
                }
            }

            .acu-system-confirm-overlay,
            .acu-custom-icon-confirm-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                min-height: 100vh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 32100 !important;
                padding: 16px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                transform: none !important;
                background: transparent !important;
                backdrop-filter: none !important;
            }

            .acu-system-confirm-dialog,
            .acu-custom-icon-confirm-dialog {
                width: min(420px, calc(100vw - 32px)) !important;
                max-width: calc(100vw - 32px) !important;
                max-height: calc(100vh - 32px) !important;
                max-height: calc(100dvh - 32px) !important;
                margin: auto !important;
                transform: none !important;
            }

            .acu-system-input-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                min-height: 100vh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 32100 !important;
                padding: 16px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                transform: none !important;
                background: transparent !important;
                backdrop-filter: none !important;
            }

            .acu-system-input-dialog {
                width: min(460px, calc(100vw - 32px)) !important;
                max-width: calc(100vw - 32px) !important;
                max-height: calc(100vh - 32px) !important;
                max-height: calc(100dvh - 32px) !important;
                margin: auto !important;
                transform: none !important;
            }

            .acu-system-input-content {
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 0;
            }

            .acu-system-input-label {
                color: var(--acu-text-main);
                font-size: 13px;
                font-weight: 600;
                line-height: 1.4;
            }

            .acu-system-input-detail {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.55;
            }

            .acu-system-input-control {
                width: 100%;
                min-height: 38px;
                padding: 9px 10px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 7px !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                color: var(--acu-text-main) !important;
                font-size: 13px !important;
                line-height: 1.5;
                box-sizing: border-box !important;
            }

            textarea.acu-system-input-control {
                min-height: 132px;
                max-height: min(280px, 45dvh);
                resize: vertical;
                font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
            }

            .acu-system-input-control:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: var(--acu-focus-ring) !important;
            }

            .acu-system-input-control[readonly] {
                cursor: text;
            }

            .acu-system-confirm-content,
            .acu-custom-icon-confirm-content {
                padding-bottom: 4px;
            }

            .acu-system-confirm-detail,
            .acu-custom-icon-confirm-detail {
                margin-top: 12px;
                padding: 10px 12px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 12px;
                line-height: 1.6;
                text-align: left;
                max-height: min(180px, 35dvh);
                overflow-y: auto;
            }

            .acu-system-confirm-dialog.structured-detail,
            .acu-custom-icon-confirm-dialog.structured-detail {
                width: min(480px, calc(100vw - 32px)) !important;
            }

            .acu-system-confirm-dialog.structured-detail .acu-system-confirm-content,
            .acu-custom-icon-confirm-dialog.structured-detail .acu-custom-icon-confirm-content {
                display: grid;
                grid-template-columns: 28px minmax(0, 1fr);
                align-items: center;
                column-gap: 10px;
                padding: 4px 0 2px;
                text-align: left;
            }

            .acu-system-confirm-dialog.structured-detail .acu-import-warning-icon,
            .acu-custom-icon-confirm-dialog.structured-detail .acu-import-warning-icon {
                width: 28px;
                height: 28px;
                margin: 0;
                line-height: 28px;
                font-size: 14px;
            }

            .acu-system-confirm-dialog.structured-detail .acu-import-warning-title,
            .acu-custom-icon-confirm-dialog.structured-detail .acu-import-warning-title {
                margin: 0;
                font-size: 14px;
                line-height: 1.35;
            }

            .acu-system-confirm-detail.structured,
            .acu-custom-icon-confirm-detail.structured {
                grid-column: 1 / -1;
                margin-top: 10px;
                padding: 0;
                border: 0;
                background: transparent;
                max-height: min(300px, 42dvh);
                color: var(--acu-text-sub);
            }

            .acu-profile-apply-confirm {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .acu-profile-apply-impact-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .acu-profile-apply-impact {
                display: grid;
                grid-template-columns: 18px minmax(0, 1fr);
                align-items: start;
                gap: 8px;
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.5;
            }

            .acu-profile-apply-impact i {
                margin-top: 2px;
                color: var(--acu-accent);
                font-size: 12px;
                text-align: center;
            }

            .acu-profile-apply-impact strong {
                color: var(--acu-text-main);
                font-weight: 700;
            }

            .acu-profile-apply-row {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr);
                align-items: start;
                gap: 8px;
                padding-top: 9px;
                border-top: 1px solid var(--acu-border);
            }

            .acu-profile-apply-label {
                display: flex;
                align-items: center;
                gap: 6px;
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 700;
                line-height: 1.4;
                white-space: nowrap;
            }

            .acu-profile-apply-label i {
                color: var(--acu-accent);
                font-size: 12px;
            }

            .acu-profile-apply-module-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .acu-profile-apply-module-chip {
                max-width: 100%;
                padding: 3px 7px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 11px;
                line-height: 1.35;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-profile-apply-empty {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.5;
            }

            .acu-profile-apply-warnings {
                align-items: start;
            }

            .acu-profile-apply-warning-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .acu-profile-apply-warning {
                color: var(--acu-text-main);
                font-size: 12px;
                line-height: 1.5;
            }

            .acu-system-confirm-overlay .acu-import-warning-icon.warning,
            .acu-custom-icon-confirm-overlay .acu-import-warning-icon.warning {
                background: var(--acu-warning-bg, rgba(243, 156, 18, 0.15));
                color: var(--acu-warning-text, var(--acu-warning-icon, #f39c12));
            }

            .acu-system-confirm-overlay .acu-import-warning-icon.danger,
            .acu-custom-icon-confirm-overlay .acu-import-warning-icon.danger {
                background: var(--acu-error-bg, rgba(231, 76, 60, 0.15));
                color: var(--acu-error-text, #e74c3c);
            }

            .acu-system-confirm-overlay .acu-import-confirm-btn.warning,
            .acu-custom-icon-confirm-overlay .acu-import-confirm-btn.warning {
                background: var(--acu-accent) !important;
                border-color: var(--acu-accent) !important;
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff)) !important;
            }

            .acu-system-confirm-overlay .acu-import-confirm-btn.danger,
            .acu-custom-icon-confirm-overlay .acu-import-confirm-btn.danger {
                background: var(--acu-error-text, #e74c3c) !important;
                border-color: var(--acu-error-text, #e74c3c) !important;
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff)) !important;
            }

            .acu-msg-overlay {
                position: fixed !important;
                inset: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 31100 !important;
                padding: 16px;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0.5);
                color: var(--acu-text-main);
            }

            .acu-msg-dialog {
                width: min(320px, calc(100vw - 32px));
                max-width: calc(100vw - 32px);
                padding: 16px;
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                background: var(--acu-bg-panel);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            }

            .acu-msg-title {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 12px;
                color: var(--acu-accent);
                font-size: 14px;
                font-weight: 700;
                line-height: 1.35;
            }

            .acu-msg-input {
                width: 100%;
                min-height: 38px;
                padding: 10px 12px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                color: var(--acu-text-main) !important;
                font-size: 14px !important;
                box-sizing: border-box !important;
            }

            .acu-msg-input:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: var(--acu-focus-ring) !important;
            }

            .acu-msg-actions {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 8px;
                margin-top: 12px;
            }

            .acu-msg-cancel,
            .acu-msg-send {
                min-height: 38px;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 700;
            }

            .acu-msg-cancel {
                border: 1px solid var(--acu-border);
                background: var(--acu-input-bg, var(--acu-btn-bg));
                color: var(--acu-text-main);
            }

            .acu-msg-send {
                border: 1px solid var(--acu-btn-active-bg, var(--acu-accent));
                background: var(--acu-btn-active-bg, var(--acu-accent));
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
            }

            .acu-msg-cancel:hover,
            .acu-msg-cancel:focus-visible {
                border-color: var(--acu-accent);
                background: var(--acu-table-hover);
                color: var(--acu-accent);
            }

            .acu-msg-send:hover,
            .acu-msg-send:focus-visible {
                filter: brightness(1.05);
            }

            @media (max-width: 480px) {
                .acu-system-confirm-overlay,
                .acu-custom-icon-confirm-overlay {
                    padding: 12px !important;
                }

                .acu-system-confirm-dialog,
                .acu-custom-icon-confirm-dialog,
                .acu-system-input-dialog {
                    width: calc(100vw - 24px) !important;
                    max-width: calc(100vw - 24px) !important;
                    max-height: calc(100dvh - 24px) !important;
                }

                .acu-system-confirm-detail.structured,
                .acu-custom-icon-confirm-detail.structured {
                    max-height: min(360px, 48dvh);
                }

                .acu-profile-apply-row {
                    grid-template-columns: 1fr;
                }

                .acu-profile-apply-module-chip {
                    padding: 3px 7px;
                }

                .acu-system-confirm-overlay .acu-import-confirm-footer,
                .acu-custom-icon-confirm-overlay .acu-import-confirm-footer {
                    padding: 12px;
                    gap: 8px;
                }

                .acu-system-confirm-overlay .acu-import-cancel-btn,
                .acu-system-confirm-overlay .acu-import-confirm-btn,
                .acu-custom-icon-confirm-overlay .acu-import-cancel-btn,
                .acu-custom-icon-confirm-overlay .acu-import-confirm-btn {
                    min-height: 40px;
                    padding: 9px 10px;
                }
            }

            /* ========== 删除确认弹窗样式 ========== */
            .acu-delete-confirm-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 31500;
                backdrop-filter: blur(4px);
                padding: 16px;
                box-sizing: border-box;
            }

            .acu-delete-confirm-modal {
                width: 90%;
                max-width: 420px;
                max-height: calc(100vh - 32px);
                max-height: calc(100dvh - 32px);
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                overflow: hidden;
                animation: acu-modal-pop 0.2s ease-out;
                display: flex;
                flex-direction: column;
            }

            @keyframes acu-modal-pop {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .acu-delete-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                color: var(--acu-accent);
                font-size: 14px;
                font-weight: bold;
                flex-shrink: 0;
            }

            .acu-delete-header i {
                font-size: 16px;
            }

            .acu-delete-content {
                padding: 20px;
                flex: 1;
                min-height: 0;
                overflow-y: auto;
            }

            .acu-delete-character-info {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 12px;
                background: var(--acu-table-head);
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .acu-delete-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--acu-btn-bg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: bold;
                color: var(--acu-text-sub);
                overflow: hidden;
                flex-shrink: 0;
            }

            .acu-delete-avatar.has-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .acu-delete-name {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-text-main);
            }

            .acu-delete-section-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .acu-delete-section-title i {
                font-size: 11px;
            }

            .acu-delete-table-preview {
                margin-bottom: 16px;
            }

            .acu-delete-table-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 10px;
                background: var(--acu-btn-bg);
                border-radius: 6px;
                border: 1px solid var(--acu-border);
            }

            .acu-delete-cell {
                font-size: 12px;
                color: var(--acu-text-sub);
            }

            .acu-delete-cell strong {
                color: var(--acu-text-main);
            }

            .acu-delete-relationships {
                margin-bottom: 16px;
            }

            .acu-delete-ref-list {
                list-style: none;
                padding: 0;
                margin: 0;
                background: var(--acu-btn-bg);
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                padding: 8px 12px;
            }

            .acu-delete-ref-list li {
                font-size: 12px;
                color: var(--acu-text-sub);
                padding: 4px 0;
                border-bottom: 1px solid var(--acu-border);
            }

            .acu-delete-ref-list li:last-child {
                border-bottom: none;
            }

            .acu-delete-ref-list li strong {
                color: var(--acu-text-main);
            }

            .acu-delete-warning {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 12px;
                background: var(--acu-warning-bg, rgba(243, 156, 18, 0.15));
                border: 1px solid var(--acu-warning-text, #f39c12);
                border-radius: 8px;
                font-size: 12px;
                color: var(--acu-warning-text, #f39c12);
            }

            .acu-delete-warning i {
                font-size: 14px;
                flex-shrink: 0;
                margin-top: 1px;
            }

            .acu-delete-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }

            .acu-delete-cancel-btn,
            .acu-delete-confirm-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            .acu-delete-cancel-btn {
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
                color: var(--acu-text-sub);
            }

            .acu-delete-cancel-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            .acu-delete-confirm-btn {
                background: var(--acu-accent);
                border: none;
                color: var(--acu-button-text-on-accent, #fff);
            }

            .acu-delete-confirm-btn:hover {
                filter: brightness(1.1);
                transform: translateY(-1px);
                color: var(--acu-button-text-on-accent, #fff);
            }

            /* ========== [Redesign] 删除确认弹窗新样式 ========== */
            .acu-delete-confirm-modal.redesign {
                width: 400px;
                max-width: 95vw;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid var(--acu-border);
                background: var(--acu-bg-panel);
                box-shadow: 0 24px 48px rgba(0,0,0,0.6);

                /* 语义化变量映射：使用主题变量 */
                --c-destruct: var(--acu-error-text, #e74c3c);
                --c-destruct-bg: var(--acu-error-bg, rgba(231, 76, 60, 0.15));
                --c-warning: var(--acu-hl-manual, #e67e22);
                --c-warning-bg: var(--acu-hl-manual-bg, rgba(230, 126, 34, 0.15));
                --c-caution: var(--acu-warning-text, #f1c40f);
                --c-caution-bg: var(--acu-warning-bg, rgba(241, 196, 15, 0.15));
            }

            /* 头部 - destruct 样式 */
            .acu-delete-header.destruct {
                background: var(--c-destruct-bg);
                color: var(--c-destruct);
                border-bottom: 1px solid var(--c-destruct-bg);
                font-size: 15px;
                padding: 16px 20px;
                position: relative;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 关闭按钮 (×) */
            .acu-delete-close-btn {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                width: 28px;
                height: 28px;
                border: none;
                background: transparent;
                color: var(--c-destruct);
                font-size: 16px;
                cursor: pointer;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
                opacity: 0.7;
            }

            .acu-delete-close-btn:hover {
                opacity: 1;
                background: var(--c-destruct-bg);
            }

            /* 分区卡片通用 */
            .acu-del-section {
                border-radius: 8px;
                border: 1px solid var(--acu-border);
                overflow: hidden;
            }

            .acu-del-section-head {
                padding: 8px 12px;
                font-size: 12px;
                font-weight: bold;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--acu-text-sub);
            }

            /* 状态色修饰 */
            .acu-del-section.destruct { border-color: var(--c-destruct-bg); }
            .acu-del-section.destruct .acu-del-section-head {
                color: var(--c-destruct);
                background: var(--c-destruct-bg);
                border-bottom-color: var(--c-destruct-bg);
            }

            .acu-del-section.warning { border-color: var(--c-warning-bg); }
            .acu-del-section.warning .acu-del-section-head {
                color: var(--c-warning);
                background: var(--c-warning-bg);
                border-bottom-color: var(--c-warning-bg);
            }

            .acu-del-section.caution { border-color: var(--c-caution-bg); }
            .acu-del-section.caution .acu-del-section-head {
                color: var(--c-caution);
                background: var(--c-caution-bg);
                border-bottom-color: var(--c-caution-bg);
            }

            /* 核心身份卡片 */
            .acu-del-card {
                padding: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--acu-btn-bg);
            }

            .acu-del-avatar-box {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: 2px solid var(--c-destruct);
                overflow: hidden;
                flex-shrink: 0;
                background: var(--acu-bg-panel);
            }

            .acu-del-avatar-box .acu-avatar-preview {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 0;
            }

            .acu-del-name {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-text-main);
            }

            .acu-del-meta {
                font-size: 12px;
                color: var(--acu-text-sub);
                margin-top: 2px;
            }

            .acu-del-info {
                flex: 1;
                min-width: 0;
            }

            /* 列表样式 */
            .acu-del-list {
                list-style: none;
                padding: 0;
                margin: 0;
                background: var(--acu-btn-bg);
            }

            .acu-del-list li {
                padding: 8px 12px;
                font-size: 13px;
                color: var(--acu-text-main);
                border-bottom: 1px solid var(--acu-border);
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }

            .acu-del-list li:last-child { border-bottom: none; }

            .acu-del-list li i {
                margin-top: 3px;
                font-size: 12px;
                color: var(--acu-text-sub);
                width: 16px;
                text-align: center;
            }

            .acu-del-list li strong { color: var(--acu-accent); }

            /* 别名子分组 */
            .acu-del-list li.sub-group {
                flex-direction: column;
                gap: 6px;
            }

            .acu-del-list .group-title {
                font-size: 12px;
                color: var(--acu-text-sub);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .acu-del-list .group-content {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }

            .acu-del-list .tag {
                font-size: 11px;
                padding: 2px 6px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
            }

            .acu-del-list .group-warning {
                font-size: 12px;
                color: var(--c-warning);
                margin-top: 4px;
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .acu-del-list .group-warning .detail {
                opacity: 0.8;
                font-size: 11px;
            }

            /* 引用摘要 */
            .acu-del-summary {
                padding: 8px 12px;
                font-size: 12px;
                color: var(--acu-text-main);
                background: var(--acu-btn-bg);
                border-bottom: 1px solid var(--acu-border);
            }

            .acu-del-list.compact li {
                padding: 6px 12px;
                font-size: 12px;
            }

            .acu-del-list.compact li.more {
                color: var(--acu-text-sub);
                font-style: italic;
                padding-left: 38px;
            }

            /* 关系标签 */
            .acu-del-list .relation-tag {
                display: inline-block;
                font-size: 10px;
                padding: 1px 6px;
                background: var(--c-warning-bg);
                color: var(--c-warning);
                border-radius: 3px;
                margin-left: 4px;
                font-weight: normal;
            }

            /* 最终警告 */
            .acu-del-final-warn {
                font-size: 13px;
                color: var(--acu-text-sub);
                text-align: center;
                margin-top: 4px;
            }

            .acu-del-final-warn strong {
                color: var(--c-destruct);
            }

            /* 按钮 - destruct 样式 */
            .acu-delete-confirm-btn.destruct {
                background: var(--c-destruct);
                color: var(--acu-btn-active-text, #fff);
                border: 1px solid transparent;
            }

            .acu-delete-confirm-btn.destruct:hover {
                filter: brightness(0.9);
            }

            .acu-delete-confirm-btn.destruct:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                filter: grayscale(0.5);
            }

            /* 退出动画 */
            .acu-delete-confirm-overlay.closing .acu-delete-confirm-modal {
                transform: scale(0.9);
                opacity: 0;
                transition: all 0.2s ease-in;
            }

            /* ========== 导入确认弹窗样式 ========== */
            .acu-import-confirm-overlay {
                z-index: 31400;
            }
            .acu-import-confirm-dialog {
                width: 90%;
                max-width: 360px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                overflow: hidden;
            }
            .acu-import-confirm-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-import-confirm-header i {
                font-size: 16px;
            }
            .acu-import-confirm-body {
                padding: 20px;
            }
            .acu-import-stats {
                display: flex;
                justify-content: space-around;
                margin-bottom: 16px;
            }
            .acu-import-stat {
                text-align: center;
            }
            .acu-stat-num {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-stat-label {
                font-size: 11px;
                color: var(--acu-text-sub);
            }
            .acu-stat-new .acu-stat-num { color: var(--acu-success-text); }
            .acu-stat-conflict .acu-stat-num { color: var(--acu-hl-manual); }
            .acu-import-conflict-section {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-import-cancel-btn,
            .acu-import-confirm-btn {
                flex: 1;
                padding: 10px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            .acu-import-cancel-btn {
                background: var(--acu-btn-bg) !important;
                border: 1px solid var(--acu-text-sub) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-import-cancel-btn:hover {
                background: var(--acu-btn-hover) !important;
            }
            .acu-import-confirm-btn {
                background: var(--acu-accent) !important;
                border: none !important;
                color: var(--acu-btn-active-text) !important;
            }
            .acu-import-confirm-btn:hover {
                opacity: 0.85 !important;
                background: var(--acu-accent) !important;
            }
            /* ========== 预设导入警告样式 ========== */
            .acu-import-warning-container {
                text-align: center;
                padding: 16px 12px 20px;
                color: var(--acu-text-main);
            }
            .acu-import-warning-icon {
                display: block;
                width: 48px;
                height: 48px;
                margin: 0 auto 12px;
                line-height: 48px;
                border-radius: 50%;
                background: rgba(243, 156, 18, 0.15);
                color: var(--acu-warning-icon, #f39c12);
                font-size: 22px;
            }
            .acu-import-warning-title {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 8px;
                color: var(--acu-text-main);
            }
            .acu-import-warning-message {
                font-size: 13px;
                color: var(--acu-text-sub);
                line-height: 1.5;
            }
            .acu-import-conflict-options {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px dashed var(--acu-border);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .acu-import-radio {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                color: var(--acu-text-main) !important;
                background: var(--acu-btn-bg) !important;
                border: 1px solid transparent !important;
                transition: all 0.2s ease;
            }
            .acu-import-radio:hover {
                border-color: var(--acu-border) !important;
                background: var(--acu-btn-hover) !important;
            }
            .acu-import-radio input {
                accent-color: var(--acu-accent);
                width: 16px;
                height: 16px;
            }
            .acu-import-confirm-footer {
                display: flex;
                gap: 12px;
                padding: 16px 20px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            /* ========== 头像导入/导出相关样式 ========== */
            .acu-avatar-import-btn,
            .acu-avatar-export-btn {
                width: 32px;
                height: 32px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
            }

            /* ========== 统一骰子设置面板样式 ========== */
            .acu-dice-config-dialog {
                width: 320px;
                max-width: 92vw;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                overflow: hidden;
            }
            .acu-dice-cfg-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 14px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-dice-cfg-header .acu-config-close {
                background: none;
                border: none;
                color: var(--acu-text-sub);
                cursor: pointer;
                font-size: 14px;
                padding: 4px;
            }
            .acu-dice-cfg-header .acu-config-close:hover {
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-body {
                padding: 12px;
            }
            .acu-dice-cfg-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 10px;
            }
            .acu-dice-cfg-row.acu-cfg-full-row {
                grid-template-columns: 1fr;
            }
            .acu-dice-cfg-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .acu-dice-cfg-item label {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: 500;
            }
            .acu-dice-cfg-item.acu-cfg-toggle-item {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 8px 0;
            }
            .acu-dice-cfg-item.acu-cfg-toggle-item > label {
                margin: 0;
                font-size: 13px;
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-item input,
            .acu-dice-cfg-item select {
                width: 100%;
                padding: 7px 8px;
                background: var(--acu-input-bg) !important;
                border: 1px solid var(--acu-border);
                border-radius: 5px;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                text-align: center;
                box-sizing: border-box;
            }
            .acu-dice-cfg-item input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }
            .acu-dice-cfg-item select option {
                background: var(--acu-bg-panel);
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-item select {
                text-align: left;
                cursor: pointer;
            }
            .acu-dice-cfg-item select option {
                background: var(--acu-bg-panel);
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-item input:focus,
            .acu-dice-cfg-item select:focus {
                outline: none;
                border-color: var(--acu-accent);
            }
            .acu-cfg-hint {
                font-size: 9px;
                color: var(--acu-text-sub);
                opacity: 0.7;
                text-align: center;
            }
            .acu-dice-cfg-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
                padding: 10px 12px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-dice-cfg-actions button {
                flex: 1;
                padding: 9px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid var(--acu-text-sub);
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-actions button:hover {
                background: var(--acu-btn-hover);
            }
            .acu-dice-cfg-actions button.primary {
                background: var(--acu-btn-bg);
                border-color: var(--acu-btn-bg);
                color: var(--acu-button-text);
            }
            .acu-dice-cfg-actions button.primary:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-btn-hover);
            }
            `;
