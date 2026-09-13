// @ts-nocheck
/**
 * show-avatar-manager.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { LocalAvatarDB } from '../../entities/local-avatar-db';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowAvatarManager(deps: any) {
  const showAvatarManager = (
    nodeArr: AvatarManagerNode[],
    onUpdate?: () => void,
    options: AvatarManagerOptions = {},
  ) => {
    try {
      const { $ } = deps.getCore();
      $('.acu-avatar-manager-overlay').remove();

      const config = deps.getConfig();

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
      const resolveUserPlaceholderForAvatar = (name: string): string => deps.resolveUserGraphName(name);

      const renderAvatarColorControlHtml = (name: string, data: Record<string, unknown>): string => {
        const storedColor = deps.normalizeAvatarHexColor(data.imageColor);
        const color = storedColor || deps.AvatarManager.getImageColor(name);
        const source = storedColor ? data.imageColorSource || 'auto' : 'fallback';
        const swatches = [color, ...avatarColorPresetSwatches, deps.getAvatarFallbackColor(name)];
        const uniqueSwatches = [
          ...new Set(
            swatches.map(item => deps.normalizeAvatarHexColor(item)).filter((item): item is string => Boolean(item)),
          ),
        ].slice(0, 18);
        const hsl = deps.avatarHexToHsl(color) || { h: 0, s: 0.54, l: 0.5 };
        const hue = Math.round(hsl.h);
        const saturation = Math.round(hsl.s * 100);
        const lightness = Math.round(hsl.l * 100);
        return `
                            <div class="acu-avatar-color-container" data-original-color="${deps.escapeHtml(storedColor || '')}" data-original-source="${deps.escapeHtml(source)}" style="--acu-avatar-ui-color: ${deps.escapeHtml(color)}; --acu-avatar-picker-hue: ${hue}; --acu-avatar-picker-saturation: ${saturation}%; --acu-avatar-picker-lightness: ${lightness}%;">
                                <button class="acu-btn-action acu-avatar-color-swatch-btn" type="button" title="设置角色颜色" aria-label="设置 ${deps.escapeHtml(name)} 的角色颜色" aria-expanded="false">
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
                                        <button class="acu-avatar-color-option ${swatch === color ? 'active' : ''}" type="button" data-color="${deps.escapeHtml(swatch)}" style="--acu-avatar-option-color: ${deps.escapeHtml(swatch)}" title="${deps.escapeHtml(swatch)}" aria-label="使用颜色 ${deps.escapeHtml(swatch)}"></button>
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
                                        <input type="text" class="acu-input acu-avatar-color-hex" maxlength="7" value="${deps.escapeHtml(color)}" aria-label="${deps.escapeHtml(name)} 的角色颜色十六进制值" />
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
        const allAvatarData = deps.AvatarManager.getAll();

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
            const hasLocal = await deps.AvatarManager.hasLocalAvatar(node.name);
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
          const hasLocal = await deps.AvatarManager.hasLocalAvatar(userNodeForDisplay.name);
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
                    <div class="acu-avatar-item acu-avatar-user-item ${isExpanded ? 'expanded' : ''}" data-name="${deps.escapeHtml(userNodeForDisplay.name)}" data-has-local="${hasLocal}" data-display-url="${deps.escapeHtml(displayUrl)}">
                        <!-- 折叠态 -->
                        <div class="acu-avatar-row-collapsed">
                            <div class="acu-avatar-identity-tools">
                                <div class="acu-avatar-preview-wrap">
                                    <div class="acu-avatar-preview ${hasAvatar ? 'has-image' : ''}" role="button" tabindex="0" aria-label="调整 ${deps.escapeHtml(userNodeForDisplay.name)} 的头像" data-avatar-url="${deps.escapeHtml(displayUrl)}" data-avatar-x="${data.offsetX ?? 50}" data-avatar-y="${data.offsetY ?? 50}" data-avatar-scale="${data.scale ?? 150}">
                                        ${!hasAvatar ? `<span>${deps.escapeHtml(userNodeForDisplay.name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>` : ''}
                                    </div>
                                    ${sourceLabel}
                                </div>
                            </div>
                            <div class="acu-avatar-info-summary">
                                <div class="acu-avatar-name"><span class="acu-avatar-name-text">${deps.escapeHtml(userNodeForDisplay.name)}</span>${renderAvatarColorControlHtml(userNodeForDisplay.name, data)}<button class="acu-protagonist-toggle ${deps.getDiceConfig().autoMergeProtagonist !== false ? 'active' : ''}" type="button" title="自动将&quot;主角&quot;合并为{{user}}的别名" aria-label="自动将主角合并为 {{user}} 的别名" aria-pressed="${deps.getDiceConfig().autoMergeProtagonist !== false ? 'true' : 'false'}"><i class="fa-solid ${deps.getDiceConfig().autoMergeProtagonist !== false ? 'fa-link' : 'fa-link-slash'}"></i></button></div>
                                <div class="acu-avatar-url-preview">${deps.escapeHtml(currentUrl || '无头像设置')}</div>
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
                                        <input type="text" class="acu-input acu-avatar-url" placeholder="粘贴图片链接..." value="${deps.escapeHtml(currentUrl)}" />
                                    </div>
                                </div>
                                <div class="acu-input-group">
                                    <label class="acu-input-group-label">别名</label>
                                    <div class="acu-alias-tags-container">
                                        ${(data.aliases || []).map(a => `<span class="acu-alias-tag" data-alias="${deps.escapeHtml(a)}">${deps.escapeHtml(a)} <i class="fa-solid fa-xmark"></i></span>`).join('')}
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
          const hasLocal = await deps.AvatarManager.hasLocalAvatar(node.name);
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
                    <div class="acu-avatar-item ${isExpanded ? 'expanded' : ''}" data-name="${deps.escapeHtml(node.name)}" data-has-local="${hasLocal}" data-display-url="${deps.escapeHtml(displayUrl)}">
                        <!-- 折叠态 -->
                        <div class="acu-avatar-row-collapsed">
                            <div class="acu-avatar-identity-tools">
                                <div class="acu-avatar-preview-wrap">
                                    <div class="acu-avatar-preview ${hasAvatar ? 'has-image' : ''}" role="button" tabindex="0" aria-label="调整 ${deps.escapeHtml(node.name)} 的头像" data-avatar-url="${deps.escapeHtml(displayUrl)}" data-avatar-x="${data.offsetX ?? 50}" data-avatar-y="${data.offsetY ?? 50}" data-avatar-scale="${data.scale ?? 150}">
                                        ${!hasAvatar ? `<span>${deps.escapeHtml(node.name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>` : ''}
                                    </div>
                                    ${sourceLabel}
                                </div>
                            </div>
                            <div class="acu-avatar-info-summary">
                                <div class="acu-avatar-name"><span class="acu-avatar-name-text">${deps.escapeHtml(node.name)}</span>${renderAvatarColorControlHtml(node.name, data)}</div>
                                <div class="acu-avatar-url-preview">${deps.escapeHtml(currentUrl || '无头像设置')}</div>
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
                                        <input type="text" class="acu-input acu-avatar-url" placeholder="粘贴图片链接..." value="${deps.escapeHtml(currentUrl)}" />
                                    </div>
                                </div>
                                <div class="acu-input-group">
                                    <label class="acu-input-group-label">别名</label>
                                    <div class="acu-alias-tags-container">
                                        ${(data.aliases || []).map(a => `<span class="acu-alias-tag" data-alias="${deps.escapeHtml(a)}">${deps.escapeHtml(a)} <i class="fa-solid fa-xmark"></i></span>`).join('')}
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
          const cssImageUrl = deps.formatCssImageUrl(url, { allowInternalObjectUrl: true });
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
        const hsl = deps.avatarHexToHsl(color) || { h: 0, s: 0.54, l: 0.5 };
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
        const data = deps.AvatarManager.getAll()[name] || {};
        const storedColor = deps.normalizeAvatarHexColor(data.imageColor);
        const color = storedColor || deps.AvatarManager.getImageColor(name);
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
        const normalizedColor = deps.normalizeAvatarHexColor(rawColor);
        if (!normalizedColor) {
          if (window.toastr) window.toastr.warning('请输入有效的 3 位或 6 位十六进制颜色');
          return false;
        }

        const pendingSource = String($container.attr('data-pending-source') || '');
        if (pendingSource === 'manual') {
          deps.AvatarManager.setImageColor(name, normalizedColor, 'manual');
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
                            ${deps.getTutorialButtonHtml('avatarManager', '查看角色头像预设教程', 'acu-btn-icon')}
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
                                    <span class="acu-sort-label">${deps.escapeHtml(getAvatarSortLabel(sortBy))}</span>
                                    <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                                </button>
                                <div class="acu-sort-menu-list" role="listbox" aria-label="头像排序方式">
                                    ${avatarSortOptions
                                      .map(
                                        option => `
                                            <button class="acu-sort-option ${option.value === sortBy ? 'active' : ''}" type="button" role="option" aria-selected="${option.value === sortBy ? 'true' : 'false'}" data-sort="${option.value}">
                                                ${deps.escapeHtml(option.label)}
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
      deps.bindTutorialButtonsIn($manager);

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

        const data = deps.AvatarManager.getAll()[name] || {};
        const hasLocal = await deps.AvatarManager.hasLocalAvatar(name);
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
          const cssImageUrl = deps.formatCssImageUrl(displayUrl, { allowInternalObjectUrl: true });
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
              `<span>${deps.escapeHtml(name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>`,
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
            deps.showAvatarCropModal(displayUrl, name, async result => {
              const data = deps.AvatarManager.getAll()[name] || {};
              deps.AvatarManager.set(name, data.url || '', result.offsetX, result.offsetY, result.scale, data.aliases || []);
              await deps.refreshAutoImageColorForAvatar(name, result.imageSource || displayUrl, result);
              await refreshItem(name);
              deps.refreshDialogueIndentRender();
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
                const tagHtml = `<span class="acu-alias-tag" data-alias="${deps.escapeHtml(val)}">${deps.escapeHtml(val)} <i class="fa-solid fa-xmark"></i></span>`;
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
                  const tagHtml = `<span class="acu-alias-tag" data-alias="${deps.escapeHtml(cleanPart)}">${deps.escapeHtml(cleanPart)} <i class="fa-solid fa-xmark"></i></span>`;
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
                const tagHtml = `<span class="acu-alias-tag" data-alias="${deps.escapeHtml(cleanPart)}">${deps.escapeHtml(cleanPart)} <i class="fa-solid fa-xmark"></i></span>`;
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
          const color = deps.normalizeAvatarHexColor($(this).attr('data-color'));
          if (!color) return;
          markAvatarColorManualPending($(this).closest('.acu-avatar-color-container'), color);
        });

        $manager.on('input', '.acu-avatar-color-slider', function () {
          const $container = $(this).closest('.acu-avatar-color-container');
          const hue = deps.clampAvatarNumber($container.find('.acu-avatar-color-hue-slider').val(), 0, 360, 0);
          const saturation = deps.clampAvatarNumber(
            $container.find('.acu-avatar-color-saturation-slider').val(),
            0,
            100,
            54,
          );
          const lightness = deps.clampAvatarNumber($container.find('.acu-avatar-color-lightness-slider').val(), 20, 80, 50);
          markAvatarColorManualPending($container, deps.hslToAvatarHex(hue, saturation / 100, lightness / 100));
        });

        $manager.on('input', '.acu-avatar-color-hex', function () {
          const $input = $(this);
          const color = deps.normalizeAvatarHexColor($input.val());
          if (!color) {
            $input.closest('.acu-avatar-color-container').attr('data-pending-source', 'manual');
            return;
          }
          markAvatarColorManualPending($input.closest('.acu-avatar-color-container'), color);
        });

        $manager.on('blur', '.acu-avatar-color-hex', function () {
          const $input = $(this);
          const color = deps.normalizeAvatarHexColor($input.val());
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
          deps.AvatarManager.clearImageColor(name);
          const displayUrl = $item.attr('data-display-url') || '';
          const data = deps.AvatarManager.getAll()[name] || {};
          $btn.prop('disabled', true).addClass('disabled');
          try {
            await deps.refreshAutoImageColorForAvatar(name, displayUrl, {
              offsetX: data.offsetX ?? 50,
              offsetY: data.offsetY ?? 50,
              scale: data.scale ?? 150,
            });
            syncAvatarColorControls($item, name);
            deps.refreshDialogueIndentRender();
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
            const success = await deps.AvatarManager.saveLocalAvatar(name, file);
            if (success) {
              const newUrl = await LocalAvatarDB.get(name);
              await refreshItem(name);

              // 自动弹出裁剪弹窗
              deps.showAvatarCropModal(newUrl, name, async result => {
                const data = deps.AvatarManager.getAll()[name] || {};
                deps.AvatarManager.set(
                  name,
                  data.url || '',
                  result.offsetX,
                  result.offsetY,
                  result.scale,
                  data.aliases || [],
                );
                await deps.refreshAutoImageColorForAvatar(name, result.imageSource || newUrl, result);
                await refreshItem(name);
                deps.refreshDialogueIndentRender();
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
          const diceCfg = deps.getDiceConfig();
          const newValue = diceCfg.autoMergeProtagonist === false ? true : false;
          deps.saveDiceConfig({ autoMergeProtagonist: newValue });

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
          const urlValidation = url ? deps.getRemoteImageUrlValidationError(url) : null;
          if (urlValidation) {
            if (window.toastr) window.toastr.warning(deps.getImageUrlValidationMessage('头像 URL', urlValidation));
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

          const data = deps.AvatarManager.getAll()[name] || {};

          // 保存基础配置
          if (!applyAvatarColorInputOnSave($item, name)) return;
          deps.AvatarManager.set(name, url, data.offsetX ?? 50, data.offsetY ?? 50, data.scale ?? 150, aliases);

          // 如果有URL且没有本地图片，弹出裁剪
          const hasLocal = $item.attr('data-has-local') === 'true';
          if (url && !hasLocal) {
            await refreshItem(name);
            deps.showAvatarCropModal(url, name, async result => {
              deps.AvatarManager.set(name, url, result.offsetX, result.offsetY, result.scale, aliases);
              if (!applyAvatarColorInputOnSave($item, name)) return;
              await deps.refreshAutoImageColorForAvatar(name, result.imageSource || url, result);
              await refreshItem(name);
              deps.refreshDialogueIndentRender();
              onUpdate && onUpdate();
            });
          } else {
            await deps.refreshAutoImageColorForAvatar(name, $item.attr('data-display-url') || url, data);
            await refreshItem(name);
            deps.refreshDialogueIndentRender();
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

          const hasLocal = await deps.AvatarManager.hasLocalAvatar(name);
          if (hasLocal) {
            await LocalAvatarDB.delete(name);
          }

          deps.AvatarManager.remove(name);
          await deps.refreshAutoImageColorForAvatar(name, '', {});

          await refreshItem(name);
          deps.refreshDialogueIndentRender();
          onUpdate && onUpdate();
          if (window.toastr) window.toastr.info('已清空头像设置');
        });

        // 导出
        $manager.on('click', '.acu-avatar-export-btn', function () {
          const exportData = deps.AvatarManager.exportData();
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
              const analysis = deps.AvatarManager.analyzeImport(jsonData);

              if (!analysis.valid) {
                if (window.toastr)
                  showActionableErrorToast(analysis.error, {
                    suggestion: '请确认导入文件是从“角色头像预设”导出的配置，并检查其中的角色名、URL 和本地图片引用是否完整。',
                  });
                return;
              }

              deps.showImportConfirmDialog(jsonData, analysis, () => {
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
      deps.setupOverlayClose($manager, 'acu-avatar-manager-overlay', closeManager);
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
  return showAvatarManager;
}
