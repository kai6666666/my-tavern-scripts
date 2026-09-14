// @ts-nocheck
/**
 * part-02-dice.ts — part-02-avatar.ts — 从 shared/styles.ts 拆分（按原始顺序拼接，内容不变）
 * 包含章节（18）：移动端投骰面板适配, 仪表盘新增样式：可展开地点列表, 仪表盘核心样式（补充）, 仪表盘交互按钮优化, 仪表盘预览卡片样式, 自定义下拉菜单样式, 输入框清除按钮样式, 结果徽章样式, 骰子结果显示区域, 资源消耗器按钮 (燃运等), 对战结果显示区域, 关系图滑块容器…
 */
export const STYLES_PART_02_AVATAR = `/* === 移动端投骰面板适配 === */
            @media (max-width: 768px) {
                .acu-dice-panel, .acu-contest-panel {
                    position: relative !important;
                    top: auto !important;
                    left: auto !important;
                    transform: none !important;
                    width: 92vw !important;
                    max-width: 400px !important;
                    max-height: calc(100vh - 32px) !important;
                    max-height: calc(100dvh - 32px) !important;
                }
                .acu-dice-overlay, .acu-contest-overlay {
                    align-items: center !important;
                    padding: 16px !important;
                }
            }
                /* === 仪表盘新增样式：可展开地点列表 === */
                .acu-dash-body {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr 1fr;
                    gap: 12px;
                    margin: 6px 0;
                }

                .acu-dashboard-section {
                    background: var(--acu-card-bg);
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--acu-border);
                    min-width: 0;
                }

                .acu-dash-section-heading {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                    min-width: 0;
                    line-height: 1.3;
                }

                .acu-dash-section-heading > span:first-child {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-subheading {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin: 6px 0 4px 0;
                    font-size: 12px;
                    line-height: 1.3;
                    color: var(--acu-accent);
                }

                .acu-dash-status-badge {
                    max-width: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding: 2px 8px;
                    border: 1px solid var(--acu-border);
                    border-radius: 999px;
                    background: var(--acu-badge-bg);
                    color: var(--acu-text-main);
                    font-size: 11px;
                    font-weight: 500;
                }

                .acu-dash-section-actions {
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 6px;
                    flex-shrink: 0;
                }

                .acu-dash-resource-list,
                .acu-dash-location-list,
                .acu-dash-role-list,
                .acu-dash-items-list,
                .acu-dash-equipment-list,
                .acu-dash-quest-list {
                    scrollbar-width: thin;
                    scrollbar-color: var(--acu-scrollbar-thumb) transparent;
                }

                .acu-dash-resource-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 6px;
                    max-height: 44px;
                    overflow-y: auto;
                    margin-bottom: 4px;
                    padding-bottom: 4px;
                    border-bottom: 1px solid var(--acu-border);
                }

                .acu-dash-location-list,
                .acu-dash-role-list,
                .acu-dash-items-list,
                .acu-dash-equipment-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 6px;
                    align-content: start;
                    overflow-x: hidden;
                    overflow-y: auto;
                }

                .acu-dash-location-list { max-height: 110px; margin-bottom: 10px; }
                .acu-dash-role-list { max-height: 150px; }
                .acu-dash-items-list { max-height: 90px; margin-bottom: 10px; }
                .acu-dash-equipment-list { max-height: 80px; margin-bottom: 10px; }
                .acu-dash-quest-list { max-height: 60px; overflow-y: auto; }

                .acu-dash-metric-row,
                .acu-dash-attr-row,
                .acu-dash-person-row,
                .acu-dash-item-row,
                .acu-dash-equipment-row,
                .acu-task-item {
                    min-width: 0;
                }

                .acu-dash-metric-row,
                .acu-dash-attr-row,
                .acu-dash-item-row,
                .acu-dash-row-main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                }

                .acu-dash-metric-row,
                .acu-dash-attr-row {
                    padding: 2px 3px;
                }

                .acu-dash-attr-list {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px 4px;
                    max-height: 104px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding-bottom: 2px;
                }

                .acu-dash-attr-row {
                    border-bottom: 1px dashed var(--acu-border);
                }

                .acu-dash-metric-label {
                    min-width: 0;
                    color: var(--acu-text-sub);
                    font-size: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .acu-dash-metric-value-group,
                .acu-dash-row-actions {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    flex-shrink: 0;
                }

                .acu-dash-metric-value {
                    color: var(--acu-accent);
                    font-size: 11px;
                    font-weight: 700;
                }

                .acu-dash-attr-value {
                    color: var(--acu-text-main);
                    font-size: 11px;
                    font-weight: 700;
                }

                .acu-dash-row-separated {
                    border-bottom: 1px dashed var(--acu-border);
                }

                .acu-dash-person-row {
                    padding: 6px 4px;
                }

                .acu-dash-name-with-avatar,
                .acu-dash-item-name,
                .acu-dash-equipment-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    color: var(--acu-text-main);
                    font-size: 12px;
                }

                .acu-dash-item-name,
                .acu-dash-equipment-row span {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-item-row {
                    padding: 5px 4px;
                    font-size: 11px;
                }

                .acu-dash-equipment-row {
                    padding: 4px;
                    font-size: 11px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-muted {
                    opacity: 0.6;
                }

                .acu-task-main {
                    font-weight: 600;
                }

                .acu-location-group {
                    margin-bottom: 8px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: var(--acu-card-bg);
                    border: 1px solid transparent;
                    transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), background-color var(--acu-motion-fast) var(--acu-ease-standard);
                }

                .acu-location-group.expanded {
                    border-color: var(--acu-accent);
                }

                .acu-location-header {
                    padding: 8px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--acu-table-head);
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard);
                    user-select: none;
                }

                .acu-location-header:hover {
                    background: var(--acu-table-hover);
                }

                .acu-expand-icon {
                    font-size: 10px;
                    transition: transform 0.2s;
                    color: var(--acu-text-sub);
                }

                .acu-location-group.expanded .acu-expand-icon {
                    transform: rotate(90deg);
                    color: var(--acu-accent);
                }

                .acu-region-name {
                    flex: 1;
                    font-weight: bold;
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-location-count {
                    font-size: 11px;
                    color: var(--acu-text-sub);
                }

                .acu-location-list {
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: opacity var(--acu-motion-normal) var(--acu-ease-standard);
                }

                .acu-location-group.expanded .acu-location-list {
                    max-height: 500px;
                    opacity: 1;
                }

                .acu-location-item {
                    padding: 6px 10px 6px 26px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    border-bottom: 1px dashed rgba(0,0,0,0.05);
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                }

                /* 仪表盘地点名称单行省略样式 */
                .acu-dash-locations .acu-location-item {
                    padding: 4px 8px !important;
                    min-width: 0; /* 允许flex子元素收缩 */
                    overflow: hidden; /* 防止内容溢出 */
                    align-items: center;
                    color: var(--acu-text-main);
                }

                .acu-dash-locations .acu-location-item > span:first-child {
                    display: flex !important;
                    align-items: center;
                    gap: 6px;
                    flex: 1;
                    min-width: 0; /* 允许flex子元素收缩 */
                    overflow: hidden;
                }

                .acu-dash-locations .acu-location-item > span:first-child i {
                    flex-shrink: 0; /* 图标不收缩 */
                    font-size: 9px;
                    opacity: 0.4;
                    color: var(--acu-text-sub);
                }

                .acu-dash-locations .acu-location-item > i {
                    margin-left: auto;
                    width: 14px;
                    text-align: center;
                    font-size: 10px;
                    opacity: 0.4;
                    color: var(--acu-text-sub);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }

                .acu-dash-locations .acu-location-item > span:first-child > span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    min-width: 0; /* 允许flex子元素收缩 */
                }

                .acu-location-item:last-child {
                    border-bottom: none;
                }

                .acu-location-item:hover {
                    background: var(--acu-table-hover);
                }

                .acu-location-item.current {
                    background: var(--acu-hl-diff-bg);
                }

                .acu-location-item i {
                    font-size: 10px;
                    opacity: 0.6;
                }

                .acu-current-badge {
                    margin-left: auto;
                    font-size: 10px;
                    padding: 2px 6px;
                    background: var(--acu-btn-active-bg);
                    color: var(--acu-btn-active-text);
                    border-radius: 3px;
                    font-weight: bold;
                }
                /* === 仪表盘核心样式（补充） === */
                .acu-dash-context {
                    background: linear-gradient(135deg, var(--acu-table-head), var(--acu-bg-panel));
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    border: 1px solid var(--acu-border);
                }

                .acu-dash-location {
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .acu-dash-location-desc {
                    font-size: 13px;
                    color: var(--acu-text-sub);
                    margin-top: 6px;
                    line-height: 1.5;
                }

                .acu-player-status {
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-task-item {
                    padding: 4px 3px;
                    margin-bottom: 0;
                    background: transparent;
                    border: 0;
                    border-bottom: 1px dashed var(--acu-border);
                    border-radius: 0;
                }
                .acu-task-item:last-child {
                    border-bottom: 0;
                }
                .acu-task-item.acu-dash-clickable:hover,
                .acu-task-item.acu-dash-clickable:active {
                    background: transparent;
                }
                .acu-task-item.acu-dash-clickable:hover .acu-task-name {
                    color: var(--acu-accent);
                }

                .acu-task-name {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 11px;
                    font-weight: 500;
                    color: var(--acu-text-main);
                }

                .acu-empty-hint {
                    font-size: 11px;
                    color: var(--acu-text-sub);
                    text-align: center;
                    padding: 15px;
                    opacity: 0.7;
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* 仪表盘中有固定高度容器的空状态居中 */
                .acu-player-status .acu-empty-hint,
                .acu-dash-locations > div .acu-empty-hint {
                    height: 100%;
                    min-height: inherit;
                }
                /* 审核面板空状态居中 */
                .acu-changes-content .acu-empty-hint {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                }

                .acu-dashboard-content {
                    padding: 8px 15px;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    -webkit-overflow-scrolling: touch !important;
                    touch-action: pan-y !important;
                    overscroll-behavior-y: contain;
                    max-height: calc(80vh - 60px);
                }

                .acu-wrapper.acu-dice-ui-root .acu-data-display.acu-manual-mode .acu-dashboard-content {
                    max-height: none !important;
                }

                /* === 仪表盘交互按钮优化 === */
                h3.acu-dash-table-link,
                h4.acu-dash-table-link {
                    cursor: pointer;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                    padding: 2px 4px;
                    margin: -2px -4px;
                    border-radius: 4px;
                }
                h3.acu-dash-table-link:hover,
                h4.acu-dash-table-link:hover {
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                }

                /* 仪表盘操作图标 - 统一放大+增加点击热区 */
                .acu-dash-dice-btn,
                .acu-dash-goto-btn,
                .acu-dash-use-item-btn,
                .acu-dash-use-skill-btn,
                .acu-dash-track-task-btn,
                .acu-dash-msg-btn,
                .acu-dash-contest-btn,
                .acu-dash-dice-free,
                .acu-dash-map-btn,
                .acu-dash-gacha-btn,
                .acu-dash-inventory-btn,
                .acu-dash-relation-graph-btn,
                .acu-dash-avatar-manager-btn {
                    cursor: pointer;
                    color: var(--acu-text-sub);
                    opacity: 0.5;
                    font-size: 14px !important;
                    padding: 6px;
                    margin: -4px;
                    border-radius: 4px;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), opacity var(--acu-motion-fast) var(--acu-ease-standard);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 28px;
                    min-height: 28px;
                }
                .acu-dash-dice-btn:hover,
                .acu-dash-goto-btn:hover,
                .acu-dash-use-item-btn:hover,
                .acu-dash-use-skill-btn:hover,
                .acu-dash-track-task-btn:hover,
                .acu-dash-msg-btn:hover,
                .acu-dash-contest-btn:hover,
                .acu-dash-dice-free:hover,
                .acu-dash-map-btn:hover,
                .acu-dash-gacha-btn:hover,
                .acu-dash-inventory-btn:hover,
                .acu-dash-relation-graph-btn:hover,
                .acu-dash-avatar-manager-btn:hover {
                    opacity: 1;
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                }

                /* 仪表盘可点击项 - 增强反馈 */
                .acu-dash-clickable {
                    cursor: pointer;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                    border-radius: 4px;
                }
                .acu-dash-clickable:hover {
                    background: var(--acu-table-hover);
                }
                .acu-dash-clickable:active {
                    background: var(--acu-table-hover);
                }

                @media (max-width: 768px) {
                    .acu-dash-body:not(.acu-dash-horizontal) {
                        grid-template-columns: 1fr;
                        max-height: none;
                        overflow: visible;
                    }

                    .acu-dashboard-content {
                        max-height: calc(50vh - 40px) !important;
                        padding: 8px 10px !important;
                        padding-bottom: 8px !important;
                    }

                    .acu-dash-body.acu-dash-horizontal {
                        gap: 10px;
                        padding-bottom: 6px;
                    }

                    .acu-dash-player,
                    .acu-dash-locations,
                    .acu-dash-intel {
                        padding: 10px;
                    }

                    /* 移动端进一步放大操作按钮 */
                    .acu-dash-dice-btn,
                    .acu-dash-goto-btn,
                    .acu-dash-use-item-btn,
                    .acu-dash-use-skill-btn,
                    .acu-dash-track-task-btn,
                    .acu-dash-msg-btn,
                    .acu-dash-contest-btn,
                    .acu-dash-dice-free,
                    .acu-dash-map-btn,
                    .acu-dash-gacha-btn,
                    .acu-dash-inventory-btn,
                    .acu-dash-relation-graph-btn,
                    .acu-dash-avatar-manager-btn {
                        font-size: 16px !important;
                        padding: 8px;
                        min-width: 36px;
                        min-height: 36px;
                    }
                }
            /* === 仪表盘预览卡片样式 === */
            .acu-preview-overlay {
                z-index: 31100 !important;
                backdrop-filter: blur(3px);
                animation: acuFadeIn 0.2s ease;
            }

                .acu-preview-overlay .acu-data-card {
                    width: 90vw;
                    max-width: 400px;
                    flex: none;
                }
                @media (min-width: 768px) {
                    .acu-preview-overlay .acu-data-card {
                        max-width: 550px;
                    }
                }

            .acu-preview-close:hover {
                background: var(--acu-error-bg, rgba(231, 76, 60, 0.1));
                color: var(--acu-error-text, #e74c3c);
            }

            .acu-dash-clickable {
                cursor: pointer;
                transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
            }

            .acu-dash-clickable:hover {
                background: var(--acu-table-hover);
            }
            .acu-current-location span {
                color: inherit;
                font-weight: inherit;
            }
            .acu-current-location i {
                color: inherit;
            }
            .acu-current-location > span:first-child > span {
                font-weight: 600;
            }
            /* === 自定义下拉菜单样式 === */
            .acu-dropdown-wrapper { position: relative; width: 100%; }
            .acu-dropdown-list {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                max-height: 150px;
                overflow-y: auto;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 31105;
                display: none;
            }
            .acu-dropdown-list.visible { display: block; }
            .acu-dropdown-item {
                padding: 6px 10px;
                font-size: 12px;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                background: transparent;
                color: var(--acu-text-main);
                transition: background 0.1s;
            }
            .acu-dropdown-item:hover {
                background: var(--acu-table-head);
            }
            .acu-dropdown-empty {
                padding: 8px 10px;
                font-size: 12px;
                text-align: center;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            /* === 输入框清除按钮样式 === */
            .acu-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
            .acu-input-wrapper input { padding-right: 24px !important; }
            .acu-clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: transparent !important; border: none !important; font-size: 12px; cursor: pointer; padding: 4px; line-height: 1; opacity: 0.5; transition: opacity 0.2s, color 0.2s; z-index: 5; color: var(--acu-text-sub); }
            .acu-clear-btn:hover { background: transparent !important; border: none !important; opacity: 1 !important; color: var(--acu-accent) !important; }

            /* === 结果徽章样式 === */
            .acu-result-badge {
                padding: 3px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                border: 1px solid transparent;
            }
            .acu-result-badge-crit-success { background-color: var(--acu-success-bg); color: var(--acu-text-main); border-color: var(--acu-accent); }
            .acu-result-badge-extreme-success { background-color: var(--acu-hl-diff-bg); color: var(--acu-text-main); border-color: var(--acu-hl-diff); }
            .acu-result-badge-success { background-color: var(--acu-success-bg); color: var(--acu-text-main); border-color: var(--acu-success-text); }
            .acu-result-badge-warning { background-color: var(--acu-warning-bg); color: var(--acu-text-main); border-color: var(--acu-warning-text); }
            .acu-result-badge-failure { background-color: var(--acu-error-bg); color: var(--acu-text-main); border-color: var(--acu-error-text); }
            .acu-result-badge-crit-failure { background-color: var(--acu-error-bg); color: var(--acu-text-main); border-color: var(--acu-error-text); }


            /* === 骰子结果显示区域 === */
            .acu-dice-result-display {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                gap: 8px;
            }
            .acu-dice-result-value {
                font-size: 22px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-dice-result-target {
                font-size: 11px;
                color: var(--acu-text-sub);
                opacity: 0.9;
            }
            .acu-dice-retry-btn {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .acu-dice-retry-btn:hover {
                opacity: 1;
                color: var(--acu-accent);
            }

            /* === 资源消耗器按钮 (燃运等) === */
            .acu-dice-burners {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-left: 4px;
            }
            .acu-dice-burner-btn {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .acu-dice-burner-btn:hover {
                opacity: 1;
                color: var(--acu-accent);
            }
            .acu-dice-burner-btn i {
                font-size: 14px;
            }

            /* === 对战结果显示区域 === */
            .acu-contest-result-display {
                display: none;
                margin-bottom: 10px;
            }
            .acu-contest-result-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                cursor: pointer;
            }
            .acu-contest-result-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                padding: 12px 16px;
                background: var(--acu-light-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                transition: all 0.2s;
            }
            .acu-contest-result-row:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
            }
            .acu-contest-result-winner-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 16px;
                background: var(--acu-light-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                transition: all 0.2s;
            }
            .acu-contest-result-winner-row:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
            }
            .acu-contest-reroll-icon {
                font-size: 14px;
                color: var(--acu-text-sub);
                transition: all 0.2s;
            }
            .acu-contest-result-winner-row:hover .acu-contest-reroll-icon {
                color: var(--acu-accent);
                transform: rotate(90deg);
            }
            .acu-contest-result-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                flex: 1;
            }
            .acu-contest-result-side {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-contest-result-side.right {
                flex-direction: row-reverse;
            }
            .acu-contest-vs {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                padding: 0 4px;
            }
            .acu-contest-result-name {
                font-size: 10px;
                color: var(--acu-text-main);
                opacity: 0.9;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 4em;
                text-align: center;
            }
            .acu-contest-result-value {
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-contest-winner-text {
                font-size: 14px;
                font-weight: bold;
            }
            .acu-contest-winner-success { color: var(--acu-success-text); }
            .acu-contest-winner-warning { color: var(--acu-warning-text); }
            .acu-contest-winner-failure { color: var(--acu-failure-text); }

            /* === 关系图滑块容器 === */
            .acu-node-size-slider-container {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
            }
            .acu-node-size-slider-container .acu-slider-label {
                font-size: 11px;
                color: var(--acu-text-sub);
                white-space: nowrap;
            }
            .acu-node-size-slider-container .acu-slider-value {
                font-size: 11px;
                color: var(--acu-accent);
                font-weight: bold;
                min-width: 35px;
                text-align: right;
            }
            .acu-node-size-slider-container input[type="range"] {
                background: var(--acu-btn-bg);
            }

            /* === 关系图过滤按钮 === */
            .acu-graph-filter-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-graph-filter-btn {
                transition: all 0.15s;
            }
            .acu-graph-filter-btn.active {
                background: var(--acu-accent) !important;
                color: var(--acu-button-text-on-accent, #fff) !important;
                border-color: var(--acu-accent) !important;
            }

            /* === 关系图箭头标记 - 使用 CSS 变量 === */
            .acu-graph-svg #arrowhead-end polygon,
            .acu-graph-svg #arrowhead-start polygon {
                fill: var(--acu-text-sub);
            }
            .acu-graph-svg #arrowhead-end-hl polygon,
            .acu-graph-svg #arrowhead-start-hl polygon {
                fill: var(--acu-accent);
            }

            /* === 导入提示样式 === */
            .acu-import-empty {
                text-align: center;
                padding: 20px;
                color: var(--acu-text-sub);
            }
            .acu-import-warning {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-import-warning i {
                color: var(--acu-warning-icon, #f39c12);
            }
            .acu-import-success {
                text-align: center;
                padding: 10px;
                color: var(--acu-success-text);
            }

            /* ========== 人物关系图样式 ========== */
            .acu-relation-graph-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
                backdrop-filter: blur(4px);
            }
            .acu-relation-graph-container {
                width: 95%;
                max-width: 900px;
                height: 85vh;
                max-height: 700px;
                box-sizing: border-box;
            }
            .acu-graph-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-graph-heading {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }
            .acu-graph-heading-text {
                display: none;
            }
            .acu-graph-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-shrink: 0;
            }
            .acu-graph-btn {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-graph-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-graph-canvas-wrapper {
                flex: 1;
                overflow: hidden;
                position: relative;
                min-height: 0;
            }
            .acu-graph-svg {
                width: 100%;
                height: 100%;
                cursor: grab;
            }
            .acu-graph-svg:active { cursor: grabbing; }
            .acu-graph-svg.acu-graph-move-mode {
                cursor: default;
            }
            .acu-graph-edge {
                stroke: var(--acu-border);
                stroke-width: 2;
                opacity: 0.6;
            }
            .acu-graph-edge-label {
                font-size: 11px;
                fill: var(--acu-text-sub);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-graph-edge-label-html {
                pointer-events: none;
                transition: opacity 0.2s ease, color 0.2s ease;
            }
            .acu-graph-node { cursor: grab; }
            .acu-graph-node:active { cursor: grabbing; }
            .acu-graph-move-mode .acu-graph-node {
                cursor: move;
            }
            .acu-graph-node-dragging .acu-graph-node,
            .acu-graph-node-dragging .acu-graph-node:active {
                cursor: grabbing;
            }
            .acu-graph-move-mode .acu-graph-node .acu-node-bg {
                stroke-dasharray: 4 3;
            }
            .acu-node-bg {
                fill: var(--acu-btn-bg);
                stroke: var(--acu-border);
                stroke-width: 2;
                transition: all 0.2s;
            }
            .acu-node-bg.player {
                fill: var(--acu-accent);
                stroke: var(--acu-btn-active-text);
            }
            .acu-graph-node:hover .acu-node-bg {
                stroke: var(--acu-accent);
                stroke-width: 3;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            .acu-graph-node:hover .acu-node-avatar {
                box-shadow: 0 0 0 2px var(--acu-accent);
            }
            .acu-graph-svg.highlighting .acu-graph-node {
                opacity: 0.2;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge {
                opacity: 0.1;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label {
                opacity: 0.1;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label-html {
                opacity: 0.1;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted {
                opacity: 1;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted .acu-node-bg {
                stroke: var(--acu-accent);
                stroke-width: 3;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted .acu-node-avatar {
                box-shadow: 0 0 0 2px var(--acu-accent);
            }
            .acu-graph-svg.highlighting .acu-graph-edge.highlighted {
                opacity: 1;
                stroke: var(--acu-accent);
                stroke-width: 3;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label.acu-graph-label-highlighted {
                opacity: 1;
                fill: var(--acu-accent);
                font-weight: 700;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label-html.acu-graph-label-highlighted {
                opacity: 1;
                color: var(--acu-accent) !important;
                font-weight: 700;
                background: transparent !important;
                box-shadow: none !important;
            }
            .acu-node-char {
                font-size: 16px;
                font-weight: bold;
                fill: var(--acu-text-main);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-node-bg.player + text.acu-node-char,
            .acu-node-bg.player ~ text.acu-node-char {
                fill: var(--acu-btn-active-text);
            }
            .acu-node-label {
                font-size: 12px;
                fill: var(--acu-text-main);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-node-inscene-indicator {
                fill: var(--acu-accent);
                stroke: var(--acu-bg-panel);
                stroke-width: 2;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
            }
            .acu-node-center-indicator {
                fill: none;
                stroke: var(--acu-accent);
                stroke-width: 2;
                stroke-dasharray: 6 3;
                opacity: 0.7;
                animation: acu-center-spin 8s linear infinite;
                pointer-events: none;
            }
            @keyframes acu-center-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .acu-graph-center-dropdown {
                position: relative;
            }
            .acu-graph-center-trigger {
                display: flex;
                align-items: center;
                gap: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                max-width: 130px;
                min-height: 34px;
                box-sizing: border-box;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-graph-center-trigger:hover {
                border-color: var(--acu-accent);
            }
            .acu-graph-center-trigger .acu-center-label {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100px;
            }
            .acu-graph-center-trigger .fa-caret-down {
                font-size: 10px;
                opacity: 0.6;
                transition: transform 0.2s;
            }
            .acu-graph-center-dropdown.open .acu-graph-center-trigger {
                border-color: var(--acu-accent);
            }
            .acu-graph-center-dropdown.open .fa-caret-down {
                transform: rotate(180deg);
            }
            .acu-graph-center-menu {
                display: none;
                position: absolute;
                top: calc(100% + 4px);
                left: 0;
                min-width: 100%;
                max-height: 200px;
                overflow-y: auto;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                z-index: 10;
            }
            .acu-graph-center-dropdown.open .acu-graph-center-menu {
                display: block;
            }
            .acu-center-option {
                padding: 6px 12px;
                font-size: 12px;
                color: var(--acu-text-main);
                cursor: pointer;
                white-space: nowrap;
                transition: background 0.15s;
            }
            .acu-center-option:hover {
                background: var(--acu-btn-hover);
            }
            .acu-center-option.active {
                color: var(--acu-accent);
                font-weight: bold;
            }
            .acu-graph-legend {
                display: flex;
                gap: 16px;
                justify-content: center;
                padding: 10px;
                border-top: 1px solid var(--acu-border);
                font-size: 12px;
                color: var(--acu-text-sub);
                flex-shrink: 0;
            }
            .acu-graph-view-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }
            .acu-graph-legend span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .acu-graph-node-size-label {
                font-size: 11px;
                color: var(--acu-text-sub);
                white-space: nowrap;
            }
            .acu-zoom-display {
                background: var(--acu-btn-bg);
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: bold;
                color: var(--acu-accent);
                min-width: 45px;
                text-align: center;
            }
            .acu-node-size-slider-container input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                height: 10px;
                border-radius: 5px;
                background: var(--acu-btn-bg);
                outline: none;
                cursor: pointer;
            }
            .acu-node-size-slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--acu-accent);
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            .acu-node-size-slider-container input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--acu-accent);
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-track {
                height: 10px;
                border-radius: 5px;
                background: var(--acu-btn-bg);
            }
            @media (max-width: 768px) {
                .acu-relation-graph-container {
                    width: calc(100vw - 20px);
                    height: 80vh;
                    max-height: none;
                    border-radius: 12px;
                }
                .acu-relation-graph-container .acu-panel-header {
                    display: grid;
                    grid-template-columns: minmax(120px, 1fr) auto 34px 34px;
                    grid-template-areas:
                        "graph-heading . graph-help graph-close"
                        "graph-center graph-tools graph-relayout graph-avatar";
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                }
                .acu-graph-title {
                    display: contents;
                }
                .acu-graph-heading {
                    grid-area: graph-heading;
                    justify-self: start;
                }
                .acu-graph-heading-text {
                    display: inline;
                    font-size: 13px;
                    color: var(--acu-text-main);
                    white-space: nowrap;
                }
                .acu-graph-center-dropdown {
                    grid-area: graph-center;
                    min-width: 0;
                }
                .acu-graph-center-trigger {
                    width: 100%;
                    max-width: none;
                    justify-content: space-between;
                }
                .acu-graph-center-trigger .acu-center-label {
                    max-width: none;
                }
                .acu-graph-filter-controls {
                    grid-area: graph-tools;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-left: 0;
                    min-width: 0;
                    justify-self: start;
                }
                .acu-graph-actions {
                    display: contents;
                }
                .acu-graph-actions .acu-panel-tutorial-btn {
                    grid-area: graph-help;
                }
                .acu-graph-actions #graph-relayout {
                    grid-area: graph-relayout;
                }
                .acu-graph-actions #graph-manage-avatar {
                    grid-area: graph-avatar;
                }
                .acu-graph-actions .acu-graph-close {
                    grid-area: graph-close;
                }
                .acu-graph-legend {
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 8px 6px;
                    overflow-x: auto;
                    justify-content: flex-start;
                }
                .acu-graph-view-controls {
                    min-width: max-content;
                }
            }

            /* ========== 地图可视化样式 ========== */
            .acu-map-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
                backdrop-filter: blur(4px);
            }
            .acu-map-container {
                width: min(500px, calc(100vw - 24px));
                max-width: 500px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.45);
                box-sizing: border-box;
            }
            .acu-map-container .acu-panel-header {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr) auto;
                align-items: center;
                gap: 8px;
            }
            .acu-map-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
                white-space: nowrap;
                flex-shrink: 0;
                min-width: 0;
            }
            .acu-map-actions {
                display: flex;
                gap: 6px;
                align-items: center;
                flex-shrink: 0;
            }
            .acu-map-actions button {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
            }
            .acu-map-actions button:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
            }
            .acu-map-back-btn {
                color: var(--acu-text-main);
            }
            .acu-map-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 12px;
                overflow: hidden;
            }
            /* 焦点区域 - 3列Grid布局 */
            .acu-map-focus-area {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 12px;
                align-items: center;
                border: 1px dashed var(--acu-border);
                border-radius: 12px;
                padding: 16px;
                background: var(--acu-btn-bg);
            }

            /* 侧翼 */
            .acu-map-wing {
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-width: 0;
                align-self: flex-start; /* 侧翼顶部对齐 */
            }
            .acu-map-wing.left { align-items: flex-end; text-align: right; }
            .acu-map-wing.right { align-items: flex-start; text-align: left; }

            .acu-map-mobile-stack {
                display: none;
            }

            /* 头像组 */
            .acu-map-avatar-group {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: flex-start; /* 顶部对齐 */
                min-height: 70px; /* 确保有最小高度 */
            }
            .acu-map-wing.left .acu-map-avatar-group { justify-content: flex-end; }
            .acu-map-wing.right .acu-map-avatar-group { justify-content: flex-start; }

            /* 头像智能堆叠 */
            .acu-map-wing.left .acu-map-avatar:not(:last-child) { margin-right: -12px; }
            .acu-map-wing.right .acu-map-avatar:not(:first-child) { margin-left: -12px; }
            .acu-map-avatar:hover { transform: scale(1.1); z-index: 10; position: relative; }

            .acu-map-avatar {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                min-width: 56px;
                cursor: pointer;
                transition: transform var(--acu-motion-normal) var(--acu-ease-out);
            }
            .acu-map-avatar-circle {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                border: 2px solid var(--acu-accent);
                background: var(--acu-btn-bg);
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-sub);
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .acu-map-avatar-name {
                font-size: 11px;
                color: var(--acu-text-main);
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            /* 元素组 */
            .acu-map-element-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                max-width: 140px;
            }
            .acu-map-element-chip {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-bg-panel);
                font-size: 11px;
                color: var(--acu-text-main);
                cursor: pointer;
                transition: all 0.15s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-map-element-chip:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
                transform: translateX(2px);
            }

            /* 中央舞台 */
            .acu-map-stage-center {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 100px;
                z-index: 2;
                cursor: pointer;
            }

            /* 透明背景大号Emoji */
            .acu-map-location-emoji {
                background: transparent;
                border: none;
                width: auto;
                height: auto;
                font-size: 4rem;
                line-height: 1;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                transition: transform var(--acu-motion-normal) var(--acu-ease-out);
            }
            .acu-map-location-emoji:hover { transform: scale(1.1) rotate(5deg); }

            /* FA图标主题色继承 */
            .acu-map-location-emoji .acu-theme-icon,
            .acu-map-chip-emoji .acu-theme-icon,
            .acu-map-thumbnail-emoji .acu-theme-icon {
                color: var(--acu-accent);
                font-size: inherit;
            }

            /* 无emoji时的文字占位 */
            .acu-map-location-text {
                width: 64px;
                height: 64px;
                border-radius: 12px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                font-weight: bold;
                color: var(--acu-text-sub);
            }

            /* 地点名 */
            .acu-map-location-name {
                margin-top: 8px;
                font-weight: 700;
                font-size: 1.1em;
                max-width: 140px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--acu-text-main);
            }

            /* 缩略图样式 */
            .acu-map-thumbnails {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 12px;
                max-height: 50vh;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                box-sizing: border-box;
            }
            .acu-map-thumbnail {
                position: relative;
                border: 1px solid var(--acu-border);
                border-radius: 10px;
                padding: 8px;
                background: var(--acu-btn-bg);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-map-thumbnail.active {
                border-color: var(--acu-accent);
                box-shadow: 0 0 0 1px var(--acu-accent);
            }
            .acu-map-thumbnail:focus-visible {
                outline: 2px solid var(--acu-focus-ring);
                outline-offset: 2px;
            }
            .acu-map-thumbnail:hover {
                border-color: var(--acu-accent);
                transform: translateY(-2px);
            }
            .acu-map-thumbnail-emoji {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
            }
            .acu-map-thumbnail-placeholder {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: var(--acu-bg-panel);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-sub);
                border: 1px solid var(--acu-border);
            }
            .acu-map-thumbnail-name { font-size: 11px; color: var(--acu-text-main); }

            /* 角标 */
            .acu-map-thumbnail-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                min-width: 22px;
                height: 22px;
                padding: 0 6px;
                border-radius: 99px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                font-size: 0.75rem;
                font-weight: 800;
                font-variant-numeric: tabular-nums;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 6px rgba(0,0,0,0.25);
                border: 3px solid var(--acu-btn-bg);
                z-index: 10;
                transition: transform var(--acu-motion-fast) var(--acu-ease-out);
            }

            .acu-map-thumbnail:hover .acu-map-thumbnail-badge {
                transform: scale(1.1);
            }

            /* 地区标签页 */
            .acu-map-region-tabs {
                display: flex;
                flex-wrap: nowrap;
                gap: 4px;
                width: 100%;
                min-width: 0;
                overflow-x: auto;
                scroll-behavior: smooth;
                scrollbar-width: none;
            }
            .acu-map-region-tabs::-webkit-scrollbar {
                display: none;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs {
                scrollbar-width: thin;
                scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track);
                padding-bottom: 6px;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar:horizontal {
                height: 8px;
                display: block;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar-track:horizontal {
                background: var(--acu-scrollbar-track);
                border-radius: 4px;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar-thumb:horizontal {
                background: var(--acu-scrollbar-thumb);
                border-radius: 4px;
            }
            .acu-map-region-tab {
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
                min-height: 32px;
                white-space: nowrap;
            }
            .acu-map-region-tab.active,
            .acu-map-region-tab:hover {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            .acu-map-empty {
                text-align: center;
                color: var(--acu-text-sub);
                font-size: 12px;
                padding: 8px 0;
            }
            .acu-map-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                width: 100%;
            }
            .acu-map-loading-wide {
                grid-column: 1 / -1;
            }
            .acu-map-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid var(--acu-border);
                border-top-color: var(--acu-accent);
                border-radius: 50%;
                animation: acu-map-spin 0.8s linear infinite;
            }
            @keyframes acu-map-spin { to { transform: rotate(360deg); } }
            @media (max-width: 768px) {
                .acu-map-container {
                    width: calc(100vw - 20px);
                    max-height: 92vh;
                }
                .acu-map-container .acu-panel-header {
                    grid-template-columns: auto minmax(0, 1fr) auto;
                    align-items: center;
                    gap: 6px;
                    padding: 10px;
                }
                .acu-map-title {
                    min-width: 0;
                }
                .acu-map-region-tab {
                    padding: 4px 9px;
                }
                .acu-map-actions {
                    justify-content: flex-end;
                }
                .acu-map-focus-area {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 16px 12px;
                    background: var(--acu-btn-bg);
                }
                .acu-map-stage-center {
                    width: 100%;
                    margin-bottom: 4px;
                    flex-direction: row;
                    justify-content: center;
                    gap: 12px;
                }
                .acu-map-location-emoji {
                    font-size: 2.5rem;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .acu-map-location-text {
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                }
                .acu-map-location-name {
                    margin-top: 0;
                    font-size: 1.25rem;
                    max-width: none;
                    text-align: left;
                    align-self: center;
                }
                .acu-map-wing {
                    display: none;
                }
                .acu-map-mobile-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 100%;
                }
                .acu-map-mobile-avatars,
                .acu-map-mobile-elements {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 8px;
                    max-height: 168px;
                    overflow-y: auto;
                    padding: 2px 4px;
                }
                .acu-map-mobile-avatars:empty,
                .acu-map-mobile-elements:empty {
                    display: none;
                }
                .acu-map-avatar {
                    min-width: auto;
                    width: 52px;
                }
                .acu-map-avatar-circle {
                    width: 42px;
                    height: 42px;
                }
                .acu-map-element-chip {
                    font-size: 12px;
                    padding: 6px 10px;
                    background: var(--acu-bg-panel);
                }
                .acu-map-thumbnails {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 10px;
                }
            }

            /* ========== 头像管理弹窗样式 ========== */
            .acu-avatar-manager-overlay {
                background: rgba(0,0,0,0.7);
                z-index: 31300;
                inset: 0;
                box-sizing: border-box;
                overflow: hidden;
            }
            .acu-avatar-manager {
                width: min(500px, calc(100vw - 24px));
                max-width: 100%;
                height: min(720px, calc(100vh - 24px));
                height: min(720px, calc(100dvh - 24px));
                max-height: min(720px, calc(100vh - 24px));
                max-height: min(720px, calc(100dvh - 24px));
                min-height: 0;
                box-sizing: border-box;
            }
            .acu-avatar-title {
                font-size: 15px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-avatar-header-actions {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .acu-avatar-list {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                min-height: 0;
            }
            .acu-avatar-file-input,
            #acu-avatar-file-input {
                display: none;
            }
            .acu-avatar-item {
                display: flex;
                flex-direction: column;
                padding: 10px;
                border-bottom: 1px dashed var(--acu-border);
                transition: background-color 0.2s ease;
            }
            .acu-avatar-item:last-child { border-bottom: none; }
            .acu-avatar-item.expanded {
                background-color: rgba(127, 127, 127, 0.05);
            }

            /* --- 折叠状态行 --- */
            .acu-avatar-row-collapsed {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
            }

            /* 头像预览部分 (复用原样式但稍作调整) */
            .acu-avatar-identity-tools {
                position: relative;
                display: flex;
                align-items: center;
                flex: 0 0 auto;
            }

            .acu-avatar-preview {
                --acu-avatar-image: none;
                --acu-avatar-x: 50%;
                --acu-avatar-y: 50%;
                --acu-avatar-scale: 150%;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: var(--acu-btn-bg);
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--acu-border);
                flex-shrink: 0;
                position: relative;
                cursor: pointer;
                transition: border-color 0.2s;
            }
            .acu-avatar-preview:hover {
                border-color: var(--acu-accent);
            }
            .acu-avatar-preview.has-image {
                background-image: var(--acu-avatar-image);
                background-position: var(--acu-avatar-x) var(--acu-avatar-y);
                background-size: var(--acu-avatar-scale);
                background-repeat: no-repeat;
            }
            .acu-avatar-preview span {
                font-size: 18px;
                font-weight: bold;
                color: var(--acu-text-sub);
            }
            .acu-avatar-camera-hint {
                position: absolute;
                bottom: 2px;
                right: 2px;
                font-size: 12px;
                color: var(--acu-text-sub);
                opacity: 0.5;
                pointer-events: none;
            }
            .acu-avatar-preview:hover .acu-avatar-camera-hint {
                opacity: 0.8;
                color: var(--acu-accent);
            }

            /* 角色信息摘要 */
            .acu-avatar-info-summary {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .acu-avatar-name {
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                gap: 5px;
                min-width: 0;
                position: relative;
            }

            .acu-avatar-name-text {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-avatar-url-preview {
                font-size: 12px;
                color: var(--acu-text-sub);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
                opacity: 0.8;
            }
            /* 操作按钮区 (折叠态) */
            .acu-avatar-actions-collapsed {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
            }

            /* --- 展开状态行 --- */
            .acu-avatar-row-expanded {
                display: none;
                opacity: 0;
                transform: translateY(-2px);
                transition:
                    opacity var(--acu-motion-normal) var(--acu-ease-standard),
                    transform var(--acu-motion-normal) var(--acu-ease-out);
                margin-top: 0;
                padding-top: 0;
            }
            .acu-avatar-item.expanded .acu-avatar-row-expanded {
                display: block;
                opacity: 1;
                transform: translateY(0);
                margin-top: 10px;
                padding-top: 4px;
                border-top: 1px solid var(--acu-border);
            }
            
            .acu-avatar-details {
                padding-top: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .acu-protagonist-toggle {
                background: transparent;
                border: none;
                color: var(--acu-text-sub);
                opacity: 0.5;
                cursor: pointer;
                width: 30px;
                height: 30px;
                min-width: 30px;
                min-height: 30px;
                padding: 0;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .acu-protagonist-toggle:hover {
                opacity: 0.8;
                background: var(--acu-bg-hover);
            }
            .acu-protagonist-toggle.active {
                opacity: 1;
                color: var(--acu-accent);
            }
            
            /* 输入行布局 */
            .acu-input-group {
                display: flex;
                gap: 8px;
                align-items: flex-start;
            }
            .acu-input-group-label {
                width: 32px;
                font-size: 12px;
                color: var(--acu-text-sub);
                text-align: right;
                flex-shrink: 0;
                line-height: 36px;
            }
            
            /* URL容器 - 与别名容器统一样式 */
            .acu-url-container {
                flex: 1;
                display: flex;
                align-items: center;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-input-bg);
                min-height: 36px;
                box-sizing: border-box;
                transition: border-color 0.2s ease;
            }
            .acu-url-container:focus-within {
                border-color: var(--acu-accent);
            }
            
            /* URL输入框 - 无边框融入容器 */
            .acu-avatar-manager-overlay .acu-url-container > input.acu-avatar-url,
            .acu-avatar-manager-overlay .acu-url-container > input.acu-avatar-url:focus {
                border: 0 !important;
                background: transparent !important;
                padding: 0 !important;
                font-size: 11px !important;
                color: var(--acu-text-main) !important;
                flex: 1;
                min-width: 0;
                outline: none !important;
                box-shadow: none !important;
                height: 26px !important;
                line-height: 26px !important;
                border-radius: 0 !important;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-url-container input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }

            .acu-avatar-color-container {
                position: relative;
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 0 0 auto;
                flex-wrap: nowrap;
            }

            .acu-avatar-color-swatch-btn {
                width: 34px !important;
                min-width: 34px !important;
            }

            .acu-avatar-name .acu-avatar-color-swatch-btn {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                min-height: 30px !important;
            }

            .acu-avatar-color-swatch {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--acu-avatar-ui-color);
                border: 1px solid color-mix(in srgb, var(--acu-border) 65%, var(--acu-avatar-ui-color) 35%);
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-bg-panel) 70%, transparent);
                pointer-events: none;
            }

            .acu-avatar-color-popover {
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                z-index: 20;
                width: 230px;
                padding: 10px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-bg-panel);
                box-shadow: 0 10px 28px var(--acu-shadow);
                display: grid;
                gap: 8px;
            }

            .acu-avatar-color-popover[hidden] {
                display: none;
            }

            .acu-avatar-color-popover-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                min-width: 0;
                min-height: 22px;
            }

            .acu-avatar-color-panel-title {
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1;
            }

            .acu-avatar-manager-overlay .acu-avatar-color-close-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                width: 30px;
                height: 30px;
                min-width: 30px;
                padding: 0;
                border: 0 !important;
                border-radius: 0 !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                box-shadow: none !important;
                cursor: pointer;
                font-size: 14px;
                transition:
                    color var(--acu-motion-fast) var(--acu-ease-standard);
            }

            .acu-avatar-manager-overlay .acu-avatar-color-close-btn:hover,
            .acu-avatar-manager-overlay .acu-avatar-color-close-btn:focus {
                border: 0 !important;
                background: transparent !important;
                color: var(--acu-text-main) !important;
                box-shadow: none !important;
            }

            .acu-avatar-color-swatch-grid {
                display: grid;
                grid-template-columns: repeat(6, minmax(0, 1fr));
                gap: 5px;
            }

            .acu-avatar-color-option {
                min-width: 0;
                height: 24px;
                padding: 0;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-avatar-option-color) !important;
                cursor: pointer;
                transition:
                    border-color var(--acu-motion-fast) var(--acu-ease-standard),
                    transform var(--acu-motion-fast) var(--acu-ease-out);
            }

            .acu-avatar-color-option:hover,
            .acu-avatar-color-option.active {
                border-color: var(--acu-accent);
                transform: translateY(-1px);
            }

            .acu-avatar-color-free-picker {
                display: grid;
                gap: 7px;
                padding: 7px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: color-mix(in srgb, var(--acu-input-bg) 82%, var(--acu-bg-panel) 18%);
            }

            .acu-avatar-color-slider-row {
                display: grid;
                grid-template-columns: 34px minmax(0, 1fr);
                align-items: center;
                gap: 8px;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1;
            }

            .acu-avatar-color-slider {
                width: 100%;
                min-width: 0;
                height: 6px;
                margin: 0;
                border: 1px solid color-mix(in srgb, var(--acu-border) 82%, transparent);
                border-radius: 999px;
                outline: none;
                -webkit-appearance: none;
                appearance: none;
                cursor: pointer;
            }

            .acu-avatar-color-hue-slider {
                background: linear-gradient(
                    to right,
                    hsl(0, 70%, 55%),
                    hsl(60, 70%, 55%),
                    hsl(120, 70%, 55%),
                    hsl(180, 70%, 55%),
                    hsl(240, 70%, 55%),
                    hsl(300, 70%, 55%),
                    hsl(360, 70%, 55%)
                );
            }

            .acu-avatar-color-saturation-slider {
                background: linear-gradient(
                    to right,
                    hsl(var(--acu-avatar-picker-hue), 0%, var(--acu-avatar-picker-lightness)),
                    hsl(var(--acu-avatar-picker-hue), 100%, var(--acu-avatar-picker-lightness))
                );
            }

            .acu-avatar-color-lightness-slider {
                background: linear-gradient(
                    to right,
                    hsl(var(--acu-avatar-picker-hue), var(--acu-avatar-picker-saturation), 20%),
                    hsl(var(--acu-avatar-picker-hue), var(--acu-avatar-picker-saturation), 80%)
                );
            }

            .acu-avatar-color-slider::-webkit-slider-thumb {
                width: 14px;
                height: 14px;
                border: 2px solid var(--acu-bg-panel);
                border-radius: 50%;
                background: var(--acu-avatar-ui-color);
                box-shadow: 0 0 0 1px var(--acu-border);
                -webkit-appearance: none;
                appearance: none;
            }

            .acu-avatar-color-slider::-moz-range-thumb {
                width: 12px;
                height: 12px;
                border: 2px solid var(--acu-bg-panel);
                border-radius: 50%;
                background: var(--acu-avatar-ui-color);
                box-shadow: 0 0 0 1px var(--acu-border);
            }

            .acu-avatar-manager-overlay input.acu-avatar-color-hex,
            .acu-avatar-manager-overlay input.acu-avatar-color-hex:focus {
                width: 100% !important;
                min-width: 0;
                height: 34px !important;
                padding: 0 8px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                background: var(--acu-input-bg) !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                line-height: 34px !important;
                box-shadow: none !important;
                outline: none !important;
                text-transform: uppercase;
            }

            .acu-avatar-manager-overlay input.acu-avatar-color-hex:focus {
                border-color: var(--acu-accent) !important;
                box-shadow: var(--acu-focus-ring) !important;
            }

            .acu-avatar-color-action-row {
                display: flex;
                align-items: stretch;
                gap: 6px;
                min-width: 0;
            }

            .acu-avatar-color-action-row input.acu-avatar-color-hex,
            .acu-avatar-color-action-row input.acu-avatar-color-hex:focus {
                flex: 1 1 auto;
                width: auto !important;
            }

            .acu-avatar-color-generate-btn {
                flex: 0 0 auto;
                min-width: 94px;
                height: 34px;
                padding: 0 10px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 12px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s;
            }

            .acu-avatar-color-generate-btn:hover {
                border-color: var(--acu-accent);
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }

            /* 上传与保存采用紧凑图标按钮 */
            .acu-avatar-upload-trigger {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                margin: 0;
                box-sizing: border-box;
                font-size: 12px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                transition: all 0.2s;
            }
            .acu-avatar-upload-trigger:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }

            /* 底部操作栏 */
            .acu-avatar-expanded-footer {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 8px;
                margin-top: 4px;
            }

            .acu-avatar-footer-actions {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 8px;
                flex-wrap: nowrap;
            }

            .acu-btn-action {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg) !important;
                color: var(--acu-text-sub) !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-btn-action:hover {
                background: var(--acu-btn-hover) !important;
                color: var(--acu-accent) !important;
            }
            
            .acu-avatar-reset-settings-btn {
                width: auto !important;
                min-width: 68px !important;
                padding: 0 10px !important;
                gap: 6px !important;
                color: var(--acu-text-main) !important;
                white-space: nowrap;
            }

            .acu-avatar-reset-settings-btn:hover {
                border-color: var(--acu-error-text, #e74c3c) !important;
                color: var(--acu-error-text, #e74c3c) !important;
            }

            .acu-avatar-save-btn {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 !important;
                width: 34px !important;
                height: 34px !important;
                min-width: 34px !important;
                min-height: 34px !important;
                font-size: 12px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                background: var(--acu-btn-bg) !important;
                color: var(--acu-text-main) !important;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-avatar-save-btn:hover {
                background: var(--acu-btn-hover) !important;
                border-color: var(--acu-accent) !important;
                color: var(--acu-accent) !important;
            }
            
            .acu-btn-delete:hover { color: var(--acu-error-text, #e74c3c) !important; border-color: var(--acu-error-text, #e74c3c) !important; }

            /* 头像来源标签 */
            .acu-avatar-source {
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 9px;
                padding: 1px 6px;
                border-radius: 8px;
                font-weight: bold;
                white-space: nowrap;
            }
            .acu-avatar-preview-wrap {
                position: relative;
                flex-shrink: 0;
            }
            .acu-source-local,
            .acu-source-url,
            .acu-source-auto {
                background: var(--acu-badge-bg);
                color: var(--acu-text-sub);
            }
            
            /* Tag Input Container - 与URL容器和搜索框统一样式 */
            .acu-alias-tags-container {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-input-bg);
                min-height: 36px;
                cursor: text;
                box-sizing: border-box;
                align-items: center;
                transition: border-color 0.2s ease;
            }
            .acu-alias-tags-container:focus-within {
                border-color: var(--acu-accent);
            }

            /* Tag Item - 透明边框风格，与URL输入统一 */
            .acu-alias-tag {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 8px;
                background: transparent;
                color: var(--acu-text-main);
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.4;
                border: 1px solid var(--acu-border);
                user-select: none;
                transition: all 0.2s ease;
                max-width: 100%;
                animation: acu-slide-in 0.2s cubic-bezier(0.2, 0, 0.2, 1) forwards;
            }
            .acu-alias-tag:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }

            /* Tag Delete Icon - 简洁风格 */
            .acu-alias-tag i {
                cursor: pointer;
                opacity: 0.4;
                font-size: 10px;
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
                margin-right: -2px;
            }
            .acu-alias-tag i:hover {
                opacity: 1;
                color: var(--acu-error-text, #e74c3c);
            }

            /* 别名输入框 - 无边框无背景，融入容器 */
            .acu-avatar-manager-overlay .acu-alias-tags-container > input.acu-alias-input,
            .acu-avatar-manager-overlay .acu-alias-tags-container > input.acu-alias-input:focus {
                border: 0 !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 2px 0;
                font-size: 12px !important;
                color: var(--acu-text-main) !important;
                flex: 1;
                min-width: 80px;
                outline: none !important;
                box-shadow: none !important;
                height: 24px;
                line-height: 24px;
                border-radius: 0 !important;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-alias-input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }

            /* Animation - 进场动画 */
            @keyframes acu-slide-in {
                from { opacity: 0; transform: scale(0.95) translateY(2px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            /* Mobile Optimization - 触控友好适配 */
            @media (hover: none) and (pointer: coarse) {
                .acu-alias-tags-container {
                    padding: 6px 8px;
                    gap: 6px;
                    min-height: 40px;
                }
                .acu-alias-tag {
                    padding: 4px 10px;
                    font-size: 12px;
                    border-radius: 4px;
                }
                .acu-alias-tag i {
                    width: 18px;
                    height: 18px;
                    font-size: 11px;
                    margin-right: -4px;
                }
                .acu-alias-input {
                    height: 28px;
                    font-size: 12px;
                }
            }

            .acu-avatar-import-btn,
            .acu-avatar-export-btn {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: all 0.2s;
            }
            .acu-avatar-import-btn:hover,
            .acu-avatar-export-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-avatar-crop-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 6px;
                font-size: 11px;
                color: var(--acu-text-sub);
            }
            .acu-avatar-crop-row.hidden { display: none; }
            .acu-avatar-manager-overlay .acu-avatar-scale {
                flex: 1;
                height: 6px !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                background: var(--acu-border) !important;
                border-radius: 3px;
                outline: none;
                border: none;
                margin: 0 8px;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-webkit-slider-runnable-track {
                height: 6px !important;
                background: var(--acu-border) !important;
                border-radius: 3px;
                border: none;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 16px !important;
                height: 16px !important;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                cursor: pointer !important;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
                margin-top: -5px !important;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-moz-range-track {
                height: 6px !important;
                background: var(--acu-border) !important;
                border-radius: 3px;
                border: none;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-moz-range-thumb {
                width: 16px !important;
                height: 16px !important;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                border: 2px solid var(--acu-bg-panel);
                cursor: pointer !important;
            }
            @media (max-width: 768px) {
                .acu-avatar-manager-overlay {
                    padding: 10px;
                }
                .acu-avatar-manager {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 20px);
                    height: calc(100dvh - 20px);
                    max-height: calc(100vh - 20px);
                    max-height: calc(100dvh - 20px);
                }
                .acu-avatar-item {
                    padding: 10px 8px;
                }
                .acu-avatar-row-collapsed {
                    gap: 8px;
                }
                .acu-avatar-identity-tools {
                    gap: 6px;
                }
                .acu-avatar-color-container {
                    flex-wrap: nowrap;
                    gap: 5px;
                }
                .acu-avatar-manager-overlay input.acu-avatar-color-hex,
                .acu-avatar-manager-overlay input.acu-avatar-color-hex:focus {
                    width: 100% !important;
                    min-width: 78px;
                }
                .acu-avatar-color-popover {
                    width: 210px;
                }
                .acu-avatar-footer-actions {
                    display: flex;
                    width: 100%;
                    gap: 6px;
                    justify-content: flex-end;
                }
                .acu-avatar-upload-trigger,
                .acu-avatar-save-btn {
                    width: 34px !important;
                }
            }

            `;
