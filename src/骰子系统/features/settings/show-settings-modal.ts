// @ts-nocheck
/**
 * show-settings-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR, PRESET_FORMAT_VERSION, SCRIPT_VERSION } from '../../shared/constants';
import { RULE_TYPE_INFO } from '../../shared/defaults-config';
import { Store } from '../../shared/storage/store';
import { normalizeDialogueIndentStrategy } from '../../features/dialogue-indent-renderer';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowSettingsModal(deps: any) {
  const showSettingsModal = () => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').not(':has(.acu-settings-dialog)').remove();
    deps.clearModalStack();
    deps.pushModal('showSettingsModal', showSettingsModal);

    deps.setIsSettingsOpen(true);
    const config = deps.getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const settingsRawData = deps.getCachedRawData() || deps.getTableData();
    const settingsTables = deps.processJsonData(settingsRawData || {});
    const allTableNames = Object.keys(settingsTables);

    // 分组折叠状态（从存储读取，默认第一组展开）
    const expandedGroups = Store.get('acu_settings_expanded', ['appearance']);

    const isGroupExpanded = groupId => expandedGroups.includes(groupId);
    // 生成导航盘管理列表HTML（包含特殊按钮：仪表盘、投骰、审核、MVU变量）
    const SPECIAL_BUTTONS_CONFIG = [
      { key: '__dashboard__', name: '仪表盘', icon: 'fa-chart-line' },
      { key: '__dice__', name: '投骰', icon: 'fa-dice-d20' },
      { key: '__changes__', name: '变更审核', icon: 'fa-code-compare' },
      { key: '__mvu__', name: 'MVU变量', icon: 'fa-code-branch' },
      { key: '__favorites__', name: '收藏夹', icon: 'fa-star' },
      { key: '__global_interactions__', name: '交互总览', icon: 'fa-hand-pointer' },
    ];

    type TableManagerItem = {
      key: string;
      name: string;
      icon: string;
      isSpecial: boolean;
    };

    type SettingsSegmentOption = {
      value: string;
      label: string;
      title?: string;
    };

    const ENABLE_DISABLE_OPTIONS: readonly SettingsSegmentOption[] = [
      { value: 'enabled', label: '启用' },
      { value: 'disabled', label: '禁用' },
    ];
    const DIALOGUE_INDENT_STRATEGY_OPTIONS: readonly SettingsSegmentOption[] = [
      { value: 'conservative', label: '保守' },
      { value: 'balanced', label: '适中' },
      { value: 'aggressive', label: '激进' },
    ];

    const tableManagerHtml = (() => {
      const savedOrder = deps.getSavedTableOrder() || [];
      const hiddenList = deps.getHiddenTables();

      // 构建所有可管理项：特殊按钮 + 真实表格
      const allItems: TableManagerItem[] = [];

      // 添加特殊按钮
      SPECIAL_BUTTONS_CONFIG.forEach(btn => {
        // MVU 按钮始终参与管理，让用户可以设置顺序和可见性
        allItems.push({ key: btn.key, name: btn.name, icon: btn.icon, isSpecial: true });
      });

      // 添加真实表格
      allTableNames.forEach(name => {
        allItems.push({ key: name, name: name, icon: deps.getIconForTableName(name), isSpecial: false });
      });

      // 应用保存的排序
      if (savedOrder.length > 0) {
        const orderMap = new Map(savedOrder.map((k, i) => [k, i]));
        const getOrderIndex = (item: TableManagerItem): number =>
          orderMap.get(item.key) ?? (item.key === '__dashboard__' ? -1 : 9999);
        allItems.sort((a, b) => {
          const aIdx = getOrderIndex(a);
          const bIdx = getOrderIndex(b);
          return aIdx - bIdx;
        });
      }

      return allItems
        .map(item => {
          const isHidden = hiddenList.includes(item.key);
          const specialClass = item.isSpecial ? ' acu-special-item' : '';
          const displayName = item.name;
          return (
            '<div class="acu-table-manager-item' +
            specialClass +
            (isHidden ? ' hidden-table' : '') +
            '" data-table-name="' +
            deps.escapeHtml(item.key) +
            '" draggable="false">' +
            '<div class="acu-table-item-check" title="点击切换显示/隐藏">' +
            '<i class="fa-solid ' +
            (isHidden ? 'fa-eye-slash' : 'fa-eye') +
            '"></i>' +
            '</div>' +
            '<div class="acu-table-item-icon"><i class="fa-solid ' +
            item.icon +
            '"></i></div>' +
            '<div class="acu-table-item-name">' +
            deps.escapeHtml(displayName) +
            '</div>' +
            '<div class="acu-table-item-handle" title="拖拽排序">' +
            '<i class="fa-solid fa-grip-vertical"></i>' +
            '</div>' +
            '</div>'
          );
        })
        .join('');
    })();
    const chevron = groupId => (isGroupExpanded(groupId) ? 'fa-chevron-down' : 'fa-chevron-right');
    const renderSettingSegmented = (
      id: string,
      label: string,
      options: readonly SettingsSegmentOption[],
      selectedValue: string,
    ): string => `
                                <div class="acu-setting-segmented" id="${id}" role="radiogroup" aria-label="${deps.escapeHtml(label)}">
                                    ${options
                                      .map(option => {
                                        const active = option.value === selectedValue;
                                        const title = option.title || option.label;
                                        return `<button type="button" class="acu-setting-segmented-option ${active ? 'active' : ''}" data-value="${deps.escapeHtml(option.value)}" role="radio" aria-checked="${active ? 'true' : 'false'}" title="${deps.escapeHtml(title)}">${deps.escapeHtml(option.label)}</button>`;
                                      })
                                      .join('')}
                                </div>`;

    const dialog = $(`
        <div class="acu-edit-overlay ${currentThemeClass}">
            <div class="acu-edit-dialog acu-settings-dialog ${currentThemeClass}">
                <div class="acu-settings-header">
                    <div class="acu-settings-title">
                        <span class="acu-settings-title-main">
                            <span class="acu-settings-title-icon"><i class="fa-solid fa-cog"></i></span>
                            <span class="acu-settings-heading">设置</span>
                        </span>
                    </div>
                    <div class="acu-header-actions">
                        <span class="acu-version-badge" title="当前版本 ${SCRIPT_VERSION}">${SCRIPT_VERSION}</span>
                        <button type="button" class="acu-manual-update-btn" id="acu-manual-update-btn" aria-label="清理缓存并刷新以获取最新版本" title="清理缓存并刷新以获取最新版本"><i class="fa-solid fa-rotate"></i></button>
                        ${deps.getTutorialButtonHtml('settings', '查看设置页面教程', 'acu-help-btn')}
                        <button type="button" class="acu-close-btn" id="dlg-close-x" aria-label="关闭设置" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>

                <div class="acu-settings-body">
                <!-- 外观样式 -->
                <div class="acu-settings-group ${isGroupExpanded('appearance') ? '' : 'collapsed'}" data-group="appearance">                    <div class="acu-settings-group-title">
                        <span class="acu-settings-group-title-main">
                            <i class="fa-solid ${chevron('appearance')} acu-group-chevron"></i>
                            <i class="fa-solid fa-palette"></i>
                            <span>外观样式</span>
                        </span>
                        ${deps.getTutorialButtonHtml('settingsAppearance', '查看外观样式教程', 'acu-settings-group-help')}
                    </div>
                    <div class="acu-settings-group-body">
                        <div class="acu-setting-row" id="settings-row-theme">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">背景主题</span>
                            </div>
                            <select id="cfg-theme" class="acu-setting-select">
                                ${deps.THEMES.map(t => `<option value="${t.id}" ${t.id === config.theme ? 'selected' : ''}>${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-family">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体风格</span>
                            </div>
                            <select id="cfg-font-family" class="acu-setting-select">
                                ${deps.FONTS.map(f => `<option value="${f.id}" ${f.id === config.fontFamily ? 'selected' : ''}>${f.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-main">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（界面）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-main" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-option">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（选项）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-opt" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.optionFontSize || 12}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-font-nav">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小（导航栏）</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-nav" data-min="10" data-max="20" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${deps.getNavigationFontMetrics(config.navFontSize).fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row" id="settings-row-highlight-new">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">高亮表格更新</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-highlight-updates',
                              '高亮表格更新',
                              ENABLE_DISABLE_OPTIONS,
                              config.highlightNew ? 'enabled' : 'disabled',
                            )}
                        </div>
                        <div class="acu-setting-row" id="settings-row-dialogue-indent-enabled">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">正文头像渲染</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-dialogue-indent-enabled',
                              '正文头像渲染',
                              ENABLE_DISABLE_OPTIONS,
                              config.dialogueIndentEnabled === true ? 'enabled' : 'disabled',
                            )}
                        </div>
                        <div class="acu-setting-row acu-setting-dependent-row" id="settings-row-dialogue-indent-strategy" ${config.dialogueIndentEnabled === true ? '' : 'hidden'}>
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">识别强度</span>
                            </div>
                            ${renderSettingSegmented(
                              'cfg-dialogue-indent-strategy',
                              '识别强度',
                              DIALOGUE_INDENT_STRATEGY_OPTIONS,
                              normalizeDialogueIndentStrategy(config.dialogueIndentStrategy),
                            )}
                        </div>
                    </div>
                </div>

                    <!-- 布局与浏览 -->
                    <div class="acu-settings-group ${isGroupExpanded('layout') ? '' : 'collapsed'}" data-group="layout">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('layout')} acu-group-chevron"></i>
                                <i class="fa-solid fa-th-large"></i>
                                <span>布局与浏览</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsLayout', '查看布局与浏览教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-layout-mode">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">布局模式</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-layout',
                                  '布局模式',
                                  [
                                    { value: 'horizontal', label: '横向滚动' },
                                    { value: 'vertical', label: '竖向滚动' },
                                  ],
                                  config.layout === 'vertical' ? 'vertical' : 'horizontal',
                                )}
                            </div>
                            <div class="acu-setting-row acu-setting-dependent-row" id="settings-row-horizontal-scrollbar" ${config.layout === 'vertical' ? 'hidden' : ''}>
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">横向滚动条</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-horizontal-scrollbar',
                                  '横向滚动条',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.showHorizontalScrollbar === true ? 'enabled' : 'disabled',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-reverse-all">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片顺序</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-display-order',
                                  '卡片顺序',
                                  [
                                    { value: 'normal', label: '正序', title: '按原始顺序显示' },
                                    { value: 'reverse', label: '倒序', title: '最新记录优先显示' },
                                  ],
                                  deps.areAllTablesReversed(allTableNames) ? 'reverse' : 'normal',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-desktop-nav-aligned">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">PC导航布局</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-desktop-nav-layout',
                                  'PC导航布局',
                                  [
                                    { value: 'compact', label: '紧凑', title: '按内容宽度紧凑排列' },
                                    { value: 'aligned', label: '对齐', title: '使用等宽网格对齐按钮' },
                                  ],
                                  config.desktopNavAligned === true ? 'aligned' : 'compact',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-card-width">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片宽度</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-width" data-min="200" data-max="500" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.cardWidth}px</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row" id="settings-row-per-page">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">每页卡片数</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-per-page" data-min="10" data-max="200" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.itemsPerPage}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row" id="settings-row-grid-cols">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">移动端导航栏列数</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-grid-cols',
                                  '移动端导航栏列数',
                                  [
                                    { value: '2', label: '2列' },
                                    { value: '3', label: '3列' },
                                    { value: '4', label: '4列' },
                                    { value: 'auto', label: '自动' },
                                  ],
                                  String(config.gridColumns || 'auto'),
                                )}
                            </div>
                        </div>
                    </div>


                    <!-- 面板与交互 -->
                    <div class="acu-settings-group ${isGroupExpanded('position') ? '' : 'collapsed'}" data-group="position">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('position')} acu-group-chevron"></i>
                                <i class="fa-solid fa-arrows-alt"></i>
                                <span>面板与交互</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsPosition', '查看面板与交互教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-panel-position">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">导航盘位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-position',
                                  '导航盘位置',
                                  [
                                    { value: 'fixed', label: '悬浮底部' },
                                    { value: 'embedded', label: '跟随消息' },
                                    { value: 'viewport', label: '固定底部' },
                                  ],
                                  String(config.positionMode || 'fixed'),
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-action-position">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">功能按钮位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-action-pos',
                                  '功能按钮位置',
                                  [
                                    { value: 'bottom', label: '底部' },
                                    { value: 'top', label: '顶部' },
                                  ],
                                  config.actionsPosition === 'top' ? 'top' : 'bottom',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-collapse-style">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起样式</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-col-style',
                                  '收起样式',
                                  [
                                    { value: 'bar', label: '长条' },
                                    { value: 'pill', label: '胶囊' },
                                    { value: 'floating', label: '浮球' },
                                  ],
                                  deps.normalizeCollapseStyle(config.collapseStyle),
                                )}
                            </div>
                            <div class="acu-setting-row acu-setting-dependent-row" id="cfg-col-align-row" style="${deps.normalizeCollapseStyle(config.collapseStyle) === 'pill' ? '' : 'display:none;'}">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起位置</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-col-align',
                                  '收起位置',
                                  [
                                    { value: 'right', label: '靠右' },
                                    { value: 'left', label: '靠左' },
                                    { value: 'center', label: '居中' },
                                  ],
                                  String(config.collapseAlign || 'right'),
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-show-options">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">选项面板</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-option-panel',
                                  '选项面板',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.showOptionPanel !== false ? 'enabled' : 'disabled',
                                )}
                            </div>
                            <div class="acu-setting-row" id="row-auto-send">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">点击选项后</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-option-click',
                                  '点击选项后',
                                  [
                                    { value: 'send', label: '直接发送' },
                                    { value: 'input', label: '填入输入框' },
                                  ],
                                  config.clickOptionToAutoSend !== false ? 'send' : 'input',
                                )}
                            </div>
                            <div class="acu-setting-row" id="settings-row-navigation-manager">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">导航盘管理</span>
                                </div>
                                <button type="button" id="cfg-navigation-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 骰子系统预设 -->
                    <div class="acu-settings-group ${isGroupExpanded('dicePresets') ? '' : 'collapsed'}" data-group="dicePresets">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('dicePresets')} acu-group-chevron"></i>
                                <i class="fa-solid fa-layer-group"></i>
                                <span>骰子系统预设</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsDicePresets', '查看骰子系统预设教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-check-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-sliders"></i> 检定预设</span>
                                </div>
                                <button type="button" id="cfg-advanced-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-attribute-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-gem"></i> 属性预设</span>
                                </div>
                                <button type="button" id="cfg-attribute-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-action-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-wand-magic-sparkles"></i> 交互规则预设</span>
                                </div>
                                <button type="button" id="cfg-action-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-dashboard-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-chart-line"></i> 仪表盘预设</span>
                                </div>
                                <button type="button" id="cfg-dashboard-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-render-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-cells-large"></i> 渲染预设</span>
                                </div>
                                <button type="button" id="cfg-render-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-table-template-requirement-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-list"></i> 模板检验预设</span>
                                </div>
                                <button type="button" id="cfg-table-template-requirement-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-avatar-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-user-circle"></i> 角色头像预设</span>
                                </div>
                                <button type="button" id="cfg-avatar-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-custom-table-name-icon-manager">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-icons"></i> 图标预设</span>
                                </div>
                                <button type="button" id="cfg-custom-table-name-icon-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-validation-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-shield-halved"></i> 数据验证预设 ${deps.renderDeprecatedBadge(deps.DATA_VALIDATION_DEPRECATED_META.deprecatedReason)}</span>
                                </div>
                                <button type="button" id="cfg-validation-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-regex-preset">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-table-list"></i> 表格正则预设</span>
                                </div>
                                <button type="button" id="cfg-regex-preset-manage" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-cog"></i> 管理
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="navigation-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="navigation-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="navigation-manager-title">
                                    <i class="fa-solid fa-table"></i> 导航盘管理
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭导航盘管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                                <div class="acu-table-manager-hint">
                                    <i class="fa-solid fa-info-circle"></i> 点击眼睛切换显示，拖拽右侧把手调整顺序
                                </div>
                                <div class="acu-table-manager-list" id="table-manager-list">
                                    ${tableManagerHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="validation-preset-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="validation-preset-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="validation-preset-manager-title">
                                    <i class="fa-solid fa-shield-halved"></i> 数据验证预设 ${deps.renderDeprecatedBadge(deps.DATA_VALIDATION_DEPRECATED_META.deprecatedReason)}
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭数据验证预设管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                            <div class="acu-setting-row acu-settings-manager-control-row" id="settings-row-validation-preset-select" style="margin-bottom:8px;">
                                <span>选择数据验证预设</span>
                                <select class="acu-setting-select" id="preset-select" style="flex:1;max-width:160px;">
                                    ${deps.PresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${deps.escapeHtml(p.id)}" ${p.id === deps.PresetManager.getActivePreset()?.id ? 'selected' : ''}>${deps.escapeHtml(p.name)}${p.id === 'default' ? ` v${PRESET_FORMAT_VERSION}` : p.builtin ? ' (内置)' : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div id="settings-row-validation-preset-actions" style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-preset-reset" title="恢复默认预设规则" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 验证规则用于检测数据合法性，<i class="fa-solid fa-shield-halved"></i> 表示启用拦截
                            </div>
                            <div class="acu-validation-rules-list" id="validation-rules-list">
                                ${deps.ValidationRuleManager.getAllRules()
                                  .map(rule => {
                                    const typeInfo = RULE_TYPE_INFO[rule.ruleType] || {
                                      name: rule.ruleType,
                                      icon: 'fa-question',
                                    };
                                    const isTableRule = typeInfo.scope === 'table';
                                    const hasIntercept = rule.intercept;
                                    return `
                                    <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${deps.escapeHtml(rule.id)}">
                                        <div class="acu-rule-type-icon" title="${deps.escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
                                            <i class="fa-solid ${typeInfo.icon}"></i>
                                        </div>
                                        <div class="acu-rule-info">
                                            <div class="acu-rule-name">${deps.escapeHtml(rule.name)}</div>
                                            <div class="acu-rule-target">${deps.escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + deps.escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
                                        </div>
                                        <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${deps.escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截提示' : '点击启用拦截提示（违反时标注）'}"><i class="fa-solid fa-shield-halved"></i></div>
                                        <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${deps.escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
                                        <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                                            <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${deps.escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <button class="acu-add-rule-btn" id="btn-add-validation-rule">
                                <i class="fa-solid fa-plus"></i> 新建数据验证规则
                            </button>
                            </div>
                        </div>
                    </div>

                    <div class="acu-settings-manager-overlay" id="regex-preset-manager-dialog" role="dialog" aria-modal="true" aria-labelledby="regex-preset-manager-title" hidden>
                        <div class="acu-settings-manager-backdrop" data-settings-manager-close="true"></div>
                        <div class="acu-settings-manager-dialog">
                            <div class="acu-panel-header acu-settings-manager-header">
                                <div class="acu-avatar-title acu-settings-manager-title" id="regex-preset-manager-title">
                                    <i class="fa-solid fa-table-list"></i> 表格正则预设
                                </div>
                                <button type="button" class="acu-settings-manager-close acu-btn-icon" title="关闭" aria-label="关闭表格正则预设管理">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div class="acu-settings-manager-body">
                            <div class="acu-setting-row acu-settings-manager-control-row" id="settings-row-regex-preset-select" style="margin-bottom:8px;">
                                <span>选择表格正则预设</span>
                                <select class="acu-setting-select" id="regex-preset-select" style="flex:1;max-width:160px;">
                                    ${deps.RegexPresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${deps.escapeHtml(p.id)}" ${p.id === deps.RegexPresetManager.getActivePreset()?.id ? 'selected' : ''}>${deps.escapeHtml(p.name)}${p.id === 'regex_default' ? ` v${PRESET_FORMAT_VERSION}` : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div id="settings-row-regex-preset-actions" style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-regex-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-regex-preset-reset" title="恢复默认预设" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 表格正则规则用于自动修改数据库表格内容
                            </div>
                            <!-- 规则列表 -->
                            <div class="acu-validation-rules-list" id="regex-rules-list">
                                ${deps.RegexTransformationManager.getAllRules()
                                  .map(rule => {
                                    const scopeIcon =
                                      rule.scope.type === 'global'
                                        ? 'fa-globe'
                                        : rule.scope.type === 'table'
                                          ? 'fa-table'
                                          : 'fa-columns';
                                    const scopeText =
                                      rule.scope.type === 'global'
                                        ? '全局'
                                        : rule.scope.type === 'table'
                                          ? rule.scope.tableNames?.join(',')
                                          : `${rule.scope.tableNames?.join(',')}.${rule.scope.columnNames?.join(',')}`;
                                    return `
                                    <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${deps.escapeHtml(rule.id)}">
                                        <div class="acu-rule-type-icon" title="作用域: ${deps.escapeHtml(rule.scope.type)}">
                                            <i class="fa-solid ${scopeIcon}"></i>
                                        </div>
                                        <div class="acu-rule-info">
                                            <div class="acu-rule-name">${deps.escapeHtml(rule.name)}</div>
                                            <div class="acu-rule-target" style="font-size:10px;">${deps.escapeHtml(scopeText)} | ${deps.escapeHtml(rule.operation)}</div>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${deps.escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
                                        <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                                            <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                                        </div>
                                        <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${deps.escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button class="acu-add-rule-btn" id="btn-add-regex-rule" style="flex:1;">
                                    <i class="fa-solid fa-plus"></i> 新建验证规则
                                </button>
                                <button class="acu-add-rule-btn" id="btn-import-tavern-regex" style="flex:1;">
                                    <i class="fa-solid fa-file-import"></i> 导入酒馆正则
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <!-- 高级设置 -->
                    <div class="acu-settings-group ${isGroupExpanded('advanced') ? '' : 'collapsed'}" data-group="advanced">
                        <div class="acu-settings-group-title">
                            <span class="acu-settings-group-title-main">
                                <i class="fa-solid ${chevron('advanced')} acu-group-chevron"></i>
                                <i class="fa-solid fa-sliders-h"></i>
                                <span>高级设置</span>
                            </span>
                            ${deps.getTutorialButtonHtml('settingsAdvanced', '查看高级设置教程', 'acu-settings-group-help')}
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row" id="settings-row-template-inspection">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-stethoscope"></i> 检验表格模板</span>
                                </div>
                                <button type="button" id="cfg-template-inspection" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-magnifying-glass-chart"></i> 检验
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-debug-console">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-bug"></i> Debug控制台</span>
                                </div>
                                <button type="button" id="btn-open-debug-console" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-terminal"></i> 打开
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-config-backup">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-layer-group"></i> 配置方案与备份</span>
                                </div>
                                <button type="button" id="cfg-config-backup-restore" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-arrows-rotate"></i> 打开
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-clear-cache">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-trash-can"></i> 清空本地缓存</span>
                                </div>
                                <button type="button" id="cfg-clear-local-cache" class="acu-setting-action-btn acu-settings-compact-action">
                                    <i class="fa-solid fa-eraser"></i> 清空
                                </button>
                            </div>
                            <div class="acu-setting-row" id="settings-row-db-toast-mute">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label"><i class="fa-solid fa-bell"></i> 数据库弹窗</span>
                                </div>
                                ${renderSettingSegmented(
                                  'cfg-db-toast',
                                  '数据库弹窗',
                                  ENABLE_DISABLE_OPTIONS,
                                  config.muteDatabaseToasts ? 'disabled' : 'enabled',
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                </div><!-- 关闭 .acu-settings-body -->
            </div>
        </div>
    `);
    $('body').append(dialog);
    // 二级管理弹窗不能留在设置面板的滚动内容里，否则部分移动端浏览器会把 fixed 定位裁进父弹窗。
    dialog.find('.acu-settings-manager-overlay').appendTo(dialog);

    // === 分组折叠交互（带动画） ===
    dialog.find('.acu-settings-group-title').on('click', function () {
      const $group = $(this).closest('.acu-settings-group');
      const $body = $group.find('.acu-settings-group-body');

      // 防止动画过程中重复点击
      if ($body.hasClass('acu-animating')) return;

      const groupId = $group.data('group');
      const $chevron = $(this).find('.acu-group-chevron');
      let expanded = Store.get('acu_settings_expanded', ['appearance']);

      if ($group.hasClass('collapsed')) {
        // 展开
        $group.removeClass('collapsed');
        $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        if (!expanded.includes(groupId)) expanded.push(groupId);

        $body.addClass('acu-animating').show();
        const targetHeight = $body.prop('scrollHeight');
        $body.css('height', 0).animate({ height: targetHeight }, 180, function () {
          $(this).css('height', '').removeClass('acu-animating');
        });
      } else {
        // 收起
        $group.addClass('collapsed');
        $chevron.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        expanded = expanded.filter(id => id !== groupId);

        const currentHeight = $body.outerHeight();
        $body
          .addClass('acu-animating')
          .css('height', currentHeight)
          .animate({ height: 0 }, 180, function () {
            $(this).hide().css('height', '').removeClass('acu-animating');
          });
      }

      Store.set('acu_settings_expanded', expanded);
    });

    // === 设置项事件绑定 ===
    // 主题
    dialog.find('#cfg-theme').on('change', function () {
      const newTheme = $(this).val();
      deps.saveConfig({ theme: newTheme });
      dialog.removeClass(deps.THEMES.map(t => `acu-theme-${t.id}`).join(' ')).addClass(`acu-theme-${newTheme}`);
      dialog
        .find('.acu-edit-dialog')
        .removeClass(deps.THEMES.map(t => `acu-theme-${t.id}`).join(' '))
        .addClass(`acu-theme-${newTheme}`);
      deps.scheduleDialogueIndentRender();
    });

    // 字体
    dialog.find('#cfg-font-family').on('change', function () {
      deps.saveConfig({ fontFamily: $(this).val() });
    });

    // 管理检定预设按钮
    dialog.find('#cfg-advanced-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showPresetListDialog();
    });

    // 管理属性预设按钮
    dialog.find('#cfg-attribute-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showAttributePresetManager();
    });

    // 管理交互规则预设按钮
    dialog.find('#cfg-action-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showActionPresetManager();
    });

    // 管理仪表盘预设按钮
    dialog.find('#cfg-dashboard-preset-manage').on('click', function (e) {
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showDashboardPresetManager();
    });

    // 检验当前聊天表格模板
    dialog.find('#cfg-template-inspection').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      deps.showTemplateInspectionModal();
    });

    dialog.find('#cfg-custom-table-name-icon-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      deps.showCustomTableNameIconManager();
    });

    // 管理渲染预设按钮
    dialog.find('#cfg-render-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showRenderPresetManager();
    });

    // 管理模板检验预设按钮
    dialog.find('#cfg-table-template-requirement-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showTableTemplateRequirementPresetManager();
    });

    // 管理角色头像预设按钮
    dialog.find('#cfg-avatar-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      let nodeArr: AvatarManagerNode[] = [];
      try {
        nodeArr = deps.getCurrentChatAvatarNodes();
      } catch (error) {
        console.warn('[DICE]角色头像预设入口读取当前聊天角色失败，改为打开全局头像库:', error);
      }
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showAvatarManager(nodeArr, undefined, { initialView: 'global' });
    });

    const openSettingsManagerDialog = (selector: string) => {
      const $manager = dialog.find(selector);
      if (!$manager.length) return;
      $manager.prop('hidden', false).attr('aria-hidden', 'false');
      setTimeout(() => {
        $manager.find('.acu-settings-manager-close').trigger('focus');
      }, 0);
    };

    const closeSettingsManagerDialog = ($manager: JQuery<HTMLElement>) => {
      $manager.prop('hidden', true).attr('aria-hidden', 'true');
    };

    dialog.find('#cfg-validation-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#validation-preset-manager-dialog');
    });

    dialog.find('#cfg-regex-preset-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#regex-preset-manager-dialog');
    });

    dialog.find('#cfg-navigation-manage').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsManagerDialog('#navigation-manager-dialog');
    });

    dialog.on('click', '.acu-settings-manager-close, .acu-settings-manager-backdrop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeSettingsManagerDialog($(this).closest('.acu-settings-manager-overlay') as JQuery<HTMLElement>);
    });

    dialog.on('click', '.acu-settings-manager-dialog', function (e) {
      e.stopPropagation();
    });

    dialog.on('keydown', function (e) {
      if (e.key !== 'Escape') return;
      const $visibleManager = dialog.find('.acu-settings-manager-overlay:not([hidden])').last();
      if (!$visibleManager.length) return;
      e.preventDefault();
      e.stopPropagation();
      closeSettingsManagerDialog($visibleManager as JQuery<HTMLElement>);
    });

    dialog.on('click', '.acu-setting-segmented-option', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const $button = $(this);
      if ($button.prop('disabled')) return;
      const value = String($button.data('value') ?? '');
      const controlId = String($button.closest('.acu-setting-segmented').attr('id') ?? '');
      if (!controlId || !value) return;

      const $group = $button.closest('.acu-setting-segmented');
      $group.find('.acu-setting-segmented-option').removeClass('active').attr('aria-checked', 'false');
      $button.addClass('active').attr('aria-checked', 'true');

      if (controlId === 'cfg-layout') {
        deps.saveConfig({ layout: value });
        dialog.find('#settings-row-horizontal-scrollbar').prop('hidden', value === 'vertical');
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-highlight-updates') {
        deps.saveConfig({ highlightNew: value === 'enabled' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-dialogue-indent-strategy') {
        deps.saveConfig({ dialogueIndentStrategy: normalizeDialogueIndentStrategy(value) });
        deps.refreshDialogueIndentRender();
        return;
      }
      if (controlId === 'cfg-dialogue-indent-enabled') {
        const enabled = value === 'enabled';
        deps.saveConfig({ dialogueIndentEnabled: enabled });
        dialog.find('#settings-row-dialogue-indent-strategy').prop('hidden', !enabled);
        deps.refreshDialogueIndentRender();
        return;
      }
      if (controlId === 'cfg-horizontal-scrollbar') {
        deps.saveConfig({ showHorizontalScrollbar: value === 'enabled' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-grid-cols') {
        deps.saveConfig({ gridColumns: value });
        return;
      }
      if (controlId === 'cfg-display-order') {
        deps.setAllTablesReverse(allTableNames, value === 'reverse');
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-desktop-nav-layout') {
        deps.saveConfig({ desktopNavAligned: value === 'aligned' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-position') {
        deps.saveConfig({ positionMode: value });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-action-pos') {
        deps.saveConfig({ actionsPosition: value });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-col-style') {
        const collapseStyle = deps.normalizeCollapseStyle(value);
        deps.saveConfig({ collapseStyle });
        const $alignRow = dialog.find('#cfg-col-align-row');
        if (collapseStyle === 'pill') $alignRow.removeAttr('style');
        else $alignRow.attr('style', 'display:none;');
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-col-align') {
        deps.saveConfig({ collapseAlign: value });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-option-panel') {
        deps.saveConfig({ showOptionPanel: value === 'enabled' });
        deps.renderInterface();
        return;
      }
      if (controlId === 'cfg-option-click') {
        deps.saveConfig({ clickOptionToAutoSend: value === 'send' });
        return;
      }
      if (controlId === 'cfg-db-toast') {
        deps.saveConfig({ muteDatabaseToasts: value === 'disabled' });
      }
    });
    // === 导航盘管理：点击切换显示/隐藏 ===
    dialog.find('.acu-table-item-check').on('click', function (e) {
      e.stopPropagation();
      const $item = $(this).closest('.acu-table-manager-item');
      const tableName = $item.data('table-name');
      let hiddenList = deps.getHiddenTables();
      const $icon = $(this).find('i');

      if (hiddenList.includes(tableName)) {
        // 显示
        hiddenList = hiddenList.filter(n => n !== tableName);
        $item.removeClass('hidden-table');
        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
      } else {
        // 隐藏
        hiddenList.push(tableName);
        $item.addClass('hidden-table');
        $icon.removeClass('fa-eye').addClass('fa-eye-slash');
      }

      deps.saveHiddenTables(hiddenList);
      deps.renderInterface();
    });

    // === 导航盘管理：拖拽排序 ===
    const $list = dialog.find('#table-manager-list');
    deps.createSortableList({
      container: $list,
      itemSelector: '.acu-table-manager-item',
      handleSelector: '.acu-table-item-handle',
      cancelSelector: '.acu-table-item-check',
      getItemId: item => {
        const tableName = $(item).data('table-name');
        if (typeof tableName === 'string') return tableName;
        if (tableName !== undefined && tableName !== null) return String(tableName);
        return null;
      },
      onOrderChange: newOrder => {
        deps.saveTableOrder(newOrder);
      },
    });

    // === Stepper 步进器事件 ===
    dialog.find('.acu-stepper').each(function () {
      const $stepper = $(this);
      const id = $stepper.data('id');
      const min = parseInt($stepper.data('min'));
      const max = parseInt($stepper.data('max'));
      const step = parseInt($stepper.data('step'));
      const $value = $stepper.find('.acu-stepper-value');

      const updateValue = newVal => {
        newVal = Math.max(min, Math.min(max, newVal));
        const unit = id === 'cfg-per-page' ? '' : 'px';
        $value.text(newVal + unit);

        // 实时预览
        if (id === 'cfg-width') {
          $(DICE_ROOT_SELECTOR).css('--acu-card-width', newVal + 'px');
          deps.saveConfig({ cardWidth: newVal });
        } else if (id === 'cfg-font-main') {
          $(DICE_ROOT_SELECTOR).css('--acu-font-size', newVal + 'px');
          deps.saveConfig({ fontSize: newVal });
        } else if (id === 'cfg-font-opt') {
          $(`${DICE_ROOT_SELECTOR}, .acu-embedded-options-container`).css('--acu-opt-font-size', newVal + 'px');
          deps.saveConfig({ optionFontSize: newVal });
        } else if (id === 'cfg-font-nav') {
          const navMetrics = deps.getNavigationFontMetrics(newVal);
          $(DICE_ROOT_SELECTOR)
            .css('--acu-nav-button-size', navMetrics.buttonSize + 'px')
            .css('--acu-nav-font-size', navMetrics.fontSize + 'px')
            .css('--acu-nav-icon-size', navMetrics.iconSize + 'px')
            .css('--acu-nav-button-padding-x', navMetrics.paddingX + 'px');
          deps.saveConfig({ navFontSize: navMetrics.fontSize });
        } else if (id === 'cfg-per-page') {
          deps.saveConfig({ itemsPerPage: newVal });
        }
      };

      const getCurrentValue = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || min;
      };

      $stepper.find('.acu-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });

      $stepper.find('.acu-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });

    // === 验证规则：切换启用/禁用（使用事件委托支持动态元素）===
    dialog.on('click', '.acu-rule-toggle', function (e) {
      e.stopPropagation();
      const $toggle = $(this);
      const $item = $toggle.closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const $icon = $toggle.find('i');
      const isCurrentlyActive = $toggle.hasClass('active');

      // 切换状态
      deps.ValidationRuleManager.toggleRuleEnabled(ruleId, !isCurrentlyActive);

      // 更新 UI
      if (isCurrentlyActive) {
        $toggle.removeClass('active');
        $icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
        $item.addClass('disabled');
      } else {
        $toggle.addClass('active');
        $icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
        $item.removeClass('disabled');
      }
    });

    // === 验证规则：编辑规则 ===
    dialog.on('click', '#validation-rules-list .acu-rule-edit', function (e) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const rule = deps.ValidationRuleManager.getRule(ruleId);
      if (!rule) return;

      // 打开编辑弹窗（保留设置弹窗用于更新列表）
      deps.showAddValidationRuleModal(dialog, ruleId);
    });

    // === 验证规则：删除规则（使用事件委托）===
    dialog.on('click', '#validation-rules-list .acu-rule-delete', async function (e) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const $item = $(this).closest('.acu-validation-rule-item');
      const rule = deps.ValidationRuleManager.getRule(ruleId);

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除验证规则',
        message: `确定要删除规则「${rule?.name || '自定义规则'}」吗？`,
        detail: '删除后需要重新创建或导入规则才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除规则',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        if (deps.ValidationRuleManager.removeCustomRule(ruleId)) {
          $item.fadeOut(200, function () {
            $(this).remove();
          });
        }
      }
    });

    // === 验证规则：切换拦截状态（使用事件委托）===
    dialog.on('click', '.acu-rule-intercept', function (e) {
      e.stopPropagation();
      const $btn = $(this);
      const ruleId = $btn.data('rule-id');
      const isCurrentlyActive = $btn.hasClass('active');

      if (deps.ValidationRuleManager.toggleRuleIntercept(ruleId, !isCurrentlyActive)) {
        if (isCurrentlyActive) {
          $btn.removeClass('active').attr('title', '点击启用拦截提示（违反时标注）');
        } else {
          $btn.addClass('active').attr('title', '点击关闭拦截提示');
        }
      }
    });

    // === 预设管理事件 ===
    const refreshPresetUI = () => {
      deps.ValidationRuleManager.clearCache();
      const rules = deps.ValidationRuleManager.getAllRules();
      let html = '';
      rules.forEach(rule => {
        const typeInfo = RULE_TYPE_INFO[rule.ruleType] || { name: rule.ruleType, icon: 'fa-question' };
        const isTableRule = typeInfo.scope === 'table';
        const hasIntercept = rule.intercept;
        html += `
          <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${deps.escapeHtml(rule.id)}">
            <div class="acu-rule-type-icon" title="${deps.escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
              <i class="fa-solid ${typeInfo.icon}"></i>
            </div>
            <div class="acu-rule-info">
              <div class="acu-rule-name">${deps.escapeHtml(rule.name)}</div>
              <div class="acu-rule-target">${deps.escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + deps.escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
            </div>
            <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${deps.escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截提示' : '点击启用拦截提示（违反时标注）'}"><i class="fa-solid fa-shield-halved"></i></div>
            <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${deps.escapeHtml(rule.id)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
            <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
              <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </div>
            <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${deps.escapeHtml(rule.id)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>`;
      });
      dialog.find('#validation-rules-list').html(html);
    };

    // 切换预设
    dialog.find('#preset-select').on('change', function () {
      if (deps.PresetManager.setActivePreset($(this).val())) {
        refreshPresetUI();
      }
    });

    // 复制预设
    dialog.find('#btn-preset-dup').on('click', function () {
      const preset = deps.PresetManager.getActivePreset();
      if (!preset) return;
      const newPreset = deps.PresetManager.duplicatePreset(preset.id);
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 新建预设
    dialog.find('#btn-preset-new').on('click', async function () {
      const name = await deps.showDiceSystemInputDialog({
        title: '新建数据验证预设',
        message: '请输入新预设名称',
        iconClass: 'fa-plus',
        initialValue: '我的预设',
        confirmText: '新建预设',
      });
      if (!name?.trim()) return;
      const newPreset = deps.PresetManager.createPreset(name.trim());
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 删除预设
    dialog.find('#btn-preset-del').on('click', async function () {
      const preset = deps.PresetManager.getActivePreset();
      if (!preset) return;
      if (preset.id === 'default') {
        if (window.toastr) window.toastr.warning('默认预设不能删除');
        return;
      }
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除数据验证预设',
        message: `确定要删除预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;
      if (deps.PresetManager.deletePreset(preset.id)) {
        dialog.find(`#preset-select option[value="${preset.id}"]`).remove();
        dialog.find('#preset-select').val('default').trigger('change');
      }
    });

    // 导出预设
    dialog.find('#btn-preset-export').on('click', function () {
      const preset = deps.PresetManager.getActivePreset();
      if (!preset) return;
      const json = deps.PresetManager.exportPreset(preset.id);
      if (json) {
        // 同属性预设导出方式一致：优先导出为文件，避免聊天窗口等环境的粘贴长度限制
        try {
          const filename = `acu_validation_preset_${preset.name || preset.id}_${Date.now()}.json`;
          deps.downloadJsonFile(json, filename);
        } catch (e) {
          // 如果浏览器不支持 Blob 下载，则回退到剪贴板/弹窗复制
          navigator.clipboard
            .writeText(json)
            .then(() => {})
            .catch(() => {
              void deps.showDiceSystemInputDialog({
                title: '复制预设 JSON',
                message: '自动复制失败，请手动复制以下内容',
                iconClass: 'fa-copy',
                initialValue: json,
                confirmText: '关闭',
                multiline: true,
                readonly: true,
                hideCancel: true,
              });
            });
        }
      }
    });

    // 导入预设（使用文件选择器）
    dialog.find('#btn-preset-import').on('click', function () {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const json = selected.text;
          if (!json?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = deps.parseJsoncRecord(json.trim(), '数据验证预设');
          } catch (error) {
            console.error('[DICE]PresetManager JSONC 解析失败:', error);
            if (window.toastr) showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const parsedPreset = deps.isRecordValue(parsedData.preset) ? parsedData.preset : null;
          const importingName =
            typeof parsedPreset?.name === 'string' && parsedPreset.name.trim()
              ? parsedPreset.name.trim()
              : '导入的预设';
          const existingPresets = deps.PresetManager.getAllPresets();
          const existingNames = existingPresets.map(p => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = async (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = json.trim();
            if (newName && parsedPreset) {
              parsedPreset.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedPreset.id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find(p => p.name === importingName);
              if (existingPreset && existingPreset.id !== 'default') {
                deps.PresetManager.deletePreset(existingPreset.id);
                dialog.find(`#preset-select option[value="${existingPreset.id}"]`).remove();
              }
            }

            const result = deps.PresetManager.importPreset(finalJson, false);
            if (result && result.preset) {
              const newPreset = result.preset;
              dialog
                .find('#preset-select')
                .append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
              dialog.find('#preset-select').val(newPreset.id).trigger('change');

              // 如果版本较旧，提示用户是否合并
              if (result.needsMerge) {
                const confirmed = await deps.showDiceSystemConfirmDialog({
                  title: '合并默认值',
                  message: '检测到预设版本较旧，是否要合并新版本的默认值？',
                  detail: '这将保留您的自定义规则，并添加新版本中的新规则。',
                  iconClass: 'fa-code-merge',
                  confirmText: '合并默认值',
                  cancelText: '暂不合并',
                  tone: 'warning',
                });
                if (confirmed) {
                  if (deps.PresetManager.mergePresetWithDefaults(newPreset.id)) {
                    refreshPresetUI();
                  } else {
                    if (window.toastr) showActionableErrorToast('合并失败', { title: '预设合并失败', suggestion: 'importExport' });
                  }
                }
              }
            } else {
              if (window.toastr) showActionableErrorToast('导入失败，请检查格式', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            deps.showPresetConflictDialog({
              presetName: importingName,
              presetType: '数据验证',
              existingNames,
              onOverwrite: () => {
                void doImport(true);
              },
              onRename: newName => {
                void doImport(false, newName);
              },
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            await doImport(false);
          }
        } catch (err) {
          console.error('[DICE]PresetManager 导入失败:', err);
          if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        }
      })();
    });

    // 恢复默认预设规则
    dialog.find('#btn-preset-reset').on('click', async function () {
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '恢复默认预设',
        message: '确定要将默认预设恢复为初始状态吗？',
        detail: '这将删除所有对默认预设的修改。',
        iconClass: 'fa-rotate-left',
        confirmText: '恢复默认',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;
      if (deps.PresetManager.resetDefaultPreset()) {
        // 如果当前是默认预设，刷新规则列表
        if (deps.PresetManager.getActivePreset()?.id === 'default') {
          refreshPresetUI();
        }
      } else {
        if (window.toastr) showActionableErrorToast('恢复失败', { suggestion: 'save' });
      }
    });

    // === 表格正则规则:切换启用/禁用 ===
    dialog.on('click', '#regex-rules-list .acu-rule-toggle', function () {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const currentState = deps.RegexTransformationManager.getAllRules().find(r => r.id === ruleId)?.enabled;
      const newState = !currentState;
      const rule = deps.RegexTransformationManager.getRule(ruleId);

      deps.RegexTransformationManager.toggleRuleEnabled(ruleId, newState);

      if (newState) {
      } else {
        toastr.info('规则已禁用');
      }

      deps.refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
    });

    // === 表格正则规则：编辑规则 ===
    dialog.on('click', '#regex-rules-list .acu-rule-edit', function () {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const rule = deps.RegexTransformationManager.getRule(ruleId);
      if (!rule) return;

      // 打开编辑弹窗
      deps.showAddRegexRuleModal(ruleId);
    });

    // === 表格正则规则:删除规则 ===
    dialog.on('click', '#regex-rules-list .acu-rule-delete', async function () {
      const $item = $(this).closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const rule = deps.RegexTransformationManager.getRule(ruleId);
      if (!rule) return;

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除表格正则规则',
        message: `确定要删除规则「${rule.name}」吗？`,
        detail: '删除后需要重新创建或导入规则才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除规则',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        deps.RegexTransformationManager.removeRule(ruleId);
        deps.refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
      }
    });

    // === 表格正则预设:切换预设 ===
    dialog.find('#regex-preset-select').on('change', function () {
      const presetId = $(this).val();
      deps.RegexPresetManager.setActivePreset(String(presetId));

      deps.refreshRegexRulesList(); // [修复] 局部刷新规则列表,而不是全量重渲染
    });

    // === 表格正则预设:复制预设 ===
    dialog.find('#btn-regex-preset-dup').on('click', async function () {
      const currentPreset = deps.RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const name = await deps.showDiceSystemInputDialog({
        title: '复制表格正则预设',
        message: '请输入新预设名称',
        iconClass: 'fa-copy',
        initialValue: `${currentPreset.name} (副本)`,
        confirmText: '创建副本',
      });
      if (!name) return;

      const newPreset = deps.RegexPresetManager.createPreset(name, currentPreset.id);
      if (newPreset) {
        // [修复] 刷新预设下拉列表
        const $presetSelect = dialog.find('#regex-preset-select');
        $presetSelect.append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        $presetSelect.val(newPreset.id);

        deps.refreshRegexRulesList(); // 刷新规则列表
      } else {
        showActionableErrorToast('预设名称已存在', { suggestion: 'input' });
      }
    });

    // === 表格正则预设:新建预设 ===
    dialog.find('#btn-regex-preset-new').on('click', async function () {
      const name = await deps.showDiceSystemInputDialog({
        title: '新建表格正则预设',
        message: '请输入预设名称',
        iconClass: 'fa-plus',
        placeholder: '预设名称',
        confirmText: '新建预设',
      });
      if (!name) return;

      const newPreset = deps.RegexPresetManager.createPreset(name, null);
      if (newPreset) {
        deps.RegexPresetManager.setActivePreset(newPreset.id);

        // [修复] 刷新预设下拉列表
        const $presetSelect = dialog.find('#regex-preset-select');
        $presetSelect.append(`<option value="${deps.escapeHtml(newPreset.id)}">${deps.escapeHtml(newPreset.name)}</option>`);
        $presetSelect.val(newPreset.id);

        deps.refreshRegexRulesList(); // 刷新规则列表
      } else {
        showActionableErrorToast('预设名称已存在', { suggestion: 'input' });
      }
    });

    // === 表格正则预设:删除预设 ===
    dialog.find('#btn-regex-preset-del').on('click', async function () {
      const currentPreset = deps.RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除表格正则预设',
        message: `确定要删除预设「${currentPreset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = deps.RegexPresetManager.deletePreset(currentPreset.id);
        if (success) {
          // [修复] 刷新预设下拉列表
          const $presetSelect = dialog.find('#regex-preset-select');
          $presetSelect.find(`option[value="${currentPreset.id}"]`).remove();

          // 切换到默认预设
          const defaultPresetId = deps.RegexPresetManager.getActivePreset()?.id;
          if (defaultPresetId) {
            $presetSelect.val(defaultPresetId);
          }

          deps.refreshRegexRulesList(); // 刷新规则列表
        } else {
          showActionableErrorToast('不能删除最后一个预设', { suggestion: 'input' });
        }
      }
    });

    // === 表格正则预设：导出预设 ===
    dialog.find('#btn-regex-preset-export').on('click', function () {
      const currentPreset = deps.RegexPresetManager.getActivePreset();
      if (!currentPreset) return;

      const json = deps.RegexPresetManager.exportPreset(currentPreset.id);
      if (json) {
        deps.downloadJsonFile(json, `regex-preset-${currentPreset.name}-${Date.now()}.json`);
      }
    });

    // === 表格正则预设：导入预设 ===
    dialog.find('#btn-regex-preset-import').on('click', function () {
      void (async () => {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        try {
          const text = selected.text;
          if (!text?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = deps.parseJsoncRecord(text.trim(), '正则预设');
          } catch (error) {
            console.error('[DICE]RegexPresetManager JSONC 解析失败:', error);
            showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const importingName =
            typeof parsedData.name === 'string' && parsedData.name.trim() ? parsedData.name.trim() : '导入的预设';
          const existingPresets = deps.RegexPresetManager.getAllPresets();
          const existingNames = existingPresets.map(p => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = text.trim();
            if (newName) {
              parsedData.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedData.id = `regex_preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find(p => p.name === importingName);
              if (existingPreset) {
                // 检查是否不是最后一个预设
                if (existingPresets.length > 1) {
                  deps.RegexPresetManager.deletePreset(existingPreset.id);
                  dialog.find(`#regex-preset-select option[value="${existingPreset.id}"]`).remove();
                }
              }
            }

            const preset = deps.RegexPresetManager.importPreset(finalJson);
            if (preset) {
              // [修复] 刷新预设下拉列表
              const $presetSelect = dialog.find('#regex-preset-select');
              $presetSelect.append(`<option value="${deps.escapeHtml(preset.id)}">${deps.escapeHtml(preset.name)}</option>`);
              $presetSelect.val(preset.id);

              // [修复] 切换到导入的预设并同步规则到实际存储
              deps.RegexPresetManager.setActivePreset(preset.id);
              Store.set(deps.STORAGE_KEY_REGEX_RULES, preset.rules || []);
              deps.RegexTransformationManager.clearCache();

              deps.refreshRegexRulesList(); // 刷新规则列表
            } else {
              showActionableErrorToast('预设格式无效', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            deps.showPresetConflictDialog({
              presetName: importingName,
              presetType: '表格正则',
              existingNames,
              onOverwrite: () => doImport(true),
              onRename: newName => doImport(false, newName),
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            doImport(false);
          }
        } catch (err) {
          showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        }
      })();
    });

    // === 表格正则预设：恢复默认预设 ===
    dialog.find('#btn-regex-preset-reset').on('click', async function () {
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '恢复表格正则默认预设',
        message: '确定要恢复默认预设吗？',
        detail: '此操作将清除当前所有正则规则，并恢复为系统内置的默认规则。',
        iconClass: 'fa-rotate-left',
        confirmText: '恢复默认',
        cancelText: '取消',
        tone: 'warning',
      });
      if (!confirmed) return;

      // 重置默认预设的规则为内置规则
      const presets = deps.RegexPresetManager.getAllPresets();
      let defaultPreset = presets.find(p => p.id === 'regex_default');

      if (defaultPreset) {
        // 用内置规则覆盖默认预设
        defaultPreset.rules = JSON.parse(JSON.stringify(deps.BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true }))));
        defaultPreset.version = PRESET_FORMAT_VERSION;
        defaultPreset.updatedAt = Date.now();
      } else {
        // 默认预设不存在，创建它
        defaultPreset = {
          id: 'regex_default',
          name: '默认预设',
          description: '系统默认的表格正则预设',
          version: PRESET_FORMAT_VERSION,
          rules: JSON.parse(JSON.stringify(deps.BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true })))),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        presets.unshift(defaultPreset);
      }
      deps.RegexPresetManager._save(presets);

      // 切换到默认预设并同步规则
      Store.set(deps.STORAGE_KEY_REGEX_ACTIVE_PRESET, 'regex_default');

      // 强制用内置规则覆盖规则存储
      Store.set(
        deps.STORAGE_KEY_REGEX_RULES,
        JSON.parse(JSON.stringify(deps.BUILTIN_REGEX_RULES.map(r => ({ ...r, builtin: true })))),
      );
      deps.RegexTransformationManager.clearCache();

      // 刷新UI - 重新渲染下拉框选项
      const $presetSelect = dialog.find('#regex-preset-select');
      $presetSelect.empty();
      deps.RegexPresetManager.getAllPresets().forEach(p => {
        const versionSuffix = p.id === 'regex_default' ? ` v${PRESET_FORMAT_VERSION}` : '';
        $presetSelect.append(`<option value="${deps.escapeHtml(p.id)}">${deps.escapeHtml(p.name)}${versionSuffix}</option>`);
      });
      $presetSelect.val('regex_default');
      deps.refreshRegexRulesList();

      toastr.success(`已恢复默认预设，包含 ${deps.BUILTIN_REGEX_RULES.length} 条内置规则`);
    });

    // === 表格正则规则:添加规则 ===
    dialog.find('#btn-add-regex-rule').on('click', function () {
      deps.showAddRegexRuleModal();
    });

    // === 表格正则规则:导入酒馆正则 ===
    dialog.find('#btn-import-tavern-regex').on('click', function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          if (!text?.trim()) return;

          let parsed;
          try {
            parsed = JSON.parse(text.trim());
          } catch {
            showActionableErrorToast('JSON格式无效', { suggestion: 'importExport' });
            return;
          }

          // 支持单个对象或数组
          const tavernRegexList: TavernRegex[] = Array.isArray(parsed) ? parsed : [parsed];

          // 验证格式：必须有 scriptName 和 findRegex
          if (!tavernRegexList.every(r => r.scriptName && r.findRegex)) {
            showActionableErrorToast('不是有效的酒馆正则格式（需要 scriptName 和 findRegex 字段）', {
              suggestion: '请确认导入文件是 SillyTavern 正则导出 JSON，并包含 scriptName 与 findRegex 字段。',
            });
            return;
          }

          const existingRules = deps.RegexTransformationManager.getAllRules();
          const existingNames = existingRules.map(r => r.name);

          let importedCount = 0;
          let skippedCount = 0;

          // 逐条处理导入
          const processNext = (index: number): void => {
            if (index >= tavernRegexList.length) {
              // 全部处理完成
              deps.refreshRegexRulesList();
              if (skippedCount > 0) {
                toastr.info(`导入完成: ${importedCount} 条成功, ${skippedCount} 条跳过`);
              } else if (importedCount > 0) {
                toastr.success(`成功导入 ${importedCount} 条酒馆正则规则`);
              }
              return;
            }

            const tavernRegex = tavernRegexList[index];
            const convertedRule = deps.convertTavernRegexToRule(tavernRegex);
            const hasConflict = existingNames.includes(convertedRule.name);

            if (hasConflict) {
              // 有冲突，弹窗询问
              deps.showPresetConflictDialog({
                presetName: convertedRule.name,
                presetType: '酒馆正则规则',
                existingNames,
                onOverwrite: () => {
                  // 删除旧规则
                  const oldRule = deps.RegexTransformationManager.getAllRules().find(r => r.name === convertedRule.name);
                  if (oldRule) deps.RegexTransformationManager.removeRule(oldRule.id);
                  deps.RegexTransformationManager.addCustomRule(convertedRule);
                  existingNames.push(convertedRule.name);
                  importedCount++;
                  processNext(index + 1);
                },
                onRename: newName => {
                  convertedRule.name = newName;
                  convertedRule.id = `tavern_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  deps.RegexTransformationManager.addCustomRule(convertedRule);
                  existingNames.push(newName);
                  importedCount++;
                  processNext(index + 1);
                },
                onCancel: () => {
                  skippedCount++;
                  processNext(index + 1);
                },
              });
            } else {
              // 无冲突，直接添加
              deps.RegexTransformationManager.addCustomRule(convertedRule);
              existingNames.push(convertedRule.name);
              importedCount++;
              processNext(index + 1);
            }
          };

          // 开始处理
          processNext(0);
        } catch (err) {
          showActionableErrorToast('导入失败: ' + (err as Error).message, { suggestion: 'importExport' });
        }
      };
      input.click();
    });

    // === 验证规则:添加自定义规则 ===
    dialog.find('#btn-add-validation-rule').on('click', function () {
      deps.showAddValidationRuleModal(dialog);
    });

    // === Debug控制台 ===
    dialog.find('#btn-open-debug-console').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dialog.remove();
      deps.setIsSettingsOpen(false);
      deps.showDebugConsoleModal();
    });

    // === 配置方案与备份 ===
    dialog.find('#cfg-config-backup-restore').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      deps.showDiceConfigBackupDialog();
    });

    // === 清空本地缓存 ===
    dialog.find('#cfg-clear-local-cache').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      deps.showManualUpdateDialog({
        title: '清空本地缓存',
        iconClass: 'fa-trash-can',
        description: '您确定要清空本地缓存数据吗？此操作主要用于解决缓存冲突或空间不足问题。',
        safeTitle: '高风险操作',
        safeDescription: '注意：此操作将永久删除本地保存的所有配置（包括主题色、布局、规则设置等）。',
        confirmText: '确认清空',
        loadingText: '正在清理...',
        isDanger: true,
        safeIconClass: 'fa-triangle-exclamation',
        onConfirm: async () => {
          const removedLocalStorageKeys = await deps.clearDiceLocalCacheData();
          if (window.toastr) {
            window.toastr.success(
              `本地缓存已清理（localStorage ${removedLocalStorageKeys} 项，含 IndexedDB/脚本缓存）。建议刷新页面以重新初始化设置。`,
            );
          }
        },
      });
    });

    // === 关闭 ===
    const closeDialog = () => {
      deps.setIsSettingsOpen(false);
      dialog.remove();
      deps.renderInterface();
    };
    dialog.on('click', '#dlg-close-x, .acu-settings-header .acu-close-btn', closeDialog);

    // 手动更新按钮点击事件
    dialog.on('click', '#acu-manual-update-btn', function (e) {
      e.stopPropagation();
      deps.showManualUpdateDialog();
    });
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);
  };
  return showSettingsModal;
}
