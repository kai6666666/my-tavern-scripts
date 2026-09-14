// @ts-nocheck
/**
 * map-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createShowMapVisualization(deps: any) {
  const showMapVisualization = async () => {
    const { $ } = deps.getCore();

    // 防止重复打开
    if (deps.getIsMapOpening()) return;
    deps.setIsMapOpening(true);

    // 确保移除所有旧的overlay
    $('.acu-map-overlay').remove();

    let viewModel = await deps.buildMapViewModel();
    if (!viewModel) {
      deps.setIsMapOpening(false);
      if (window.toastr) window.toastr.warning('未找到地图数据');
      return;
    }

    const config = deps.getConfig();

    // 会话级缓存：记录用户在每个地区选中的地点
    const tabSelectionCache = new Map<string, string>();

    // 热度排序辅助函数：返回指定地区按热度降序排列的地点数组
    const getHotLocationsInRegion = (region: string) => {
      const regionName = region || '其他';
      return Array.from(viewModel.locations.values())
        .filter(l => (l.region || '其他') === regionName)
        .sort((a, b) => {
          const scoreA =
            (viewModel.characters.get(a.name)?.length || 0) + (viewModel.elements.get(a.name)?.length || 0);
          const scoreB =
            (viewModel.characters.get(b.name)?.length || 0) + (viewModel.elements.get(b.name)?.length || 0);
          return scoreB - scoreA;
        });
    };

    // 复用"回到当前地点"的逻辑来确定初始焦点和地区
    const detailLocation = viewModel.detailLocation || '';
    const playerLocation = viewModel.playerLocation || '';
    let focusLocation = '';
    let selectedRegion = viewModel.currentRegion;

    // 优先级: 当前详细地点 > 玩家所在地点 > viewModel.focusLocation
    if (detailLocation && viewModel.locations.has(detailLocation)) {
      focusLocation = detailLocation;
      const targetLocation = viewModel.locations.get(detailLocation);
      selectedRegion = targetLocation?.region || viewModel.currentRegion || '其他';
    } else if (playerLocation && viewModel.locations.has(playerLocation)) {
      focusLocation = playerLocation;
      const targetLocation = viewModel.locations.get(playerLocation);
      selectedRegion = targetLocation?.region || viewModel.currentRegion || '其他';
    } else if (viewModel.focusLocation && viewModel.locations.has(viewModel.focusLocation)) {
      focusLocation = viewModel.focusLocation;
      const targetLocation = viewModel.locations.get(focusLocation);
      selectedRegion = targetLocation?.region || viewModel.currentRegion || '其他';
    }

    if (focusLocation) {
      Store.set(deps.STORAGE_KEY_MAP_FOCUS, focusLocation);
      // 将初始地点写入对应地区的缓存，这样用户切走再切回来时能保持选中
      tabSelectionCache.set(selectedRegion, focusLocation);
    }

    const overlay = $(`
            <div class="acu-map-overlay acu-theme-${config.theme} ${config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : ''}">
                <div class="acu-map-container">
                    <div class="acu-panel-header">
                        <div class="acu-map-title">
                            <i class="fa-solid fa-map-location-dot"></i>
                            <span class="acu-map-region-name">地图</span>
                        </div>
                        <div class="acu-map-region-tabs"></div>
                        <div class="acu-map-actions">
                            ${deps.getTutorialButtonHtml('map', '查看地图教程')}
                            <button class="acu-map-back-btn" type="button" title="回到当前地点" aria-label="回到当前地点"><i class="fa-solid fa-location-crosshairs"></i></button>
                            <button class="acu-close-btn acu-map-close" type="button" title="关闭地图" aria-label="关闭地图"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-map-body">
                        <div class="acu-map-focus-area"></div>
                        <div class="acu-map-thumbnails"></div>
                    </div>
                </div>
            </div>
        `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const overlayEl = overlay[0];
    overlayEl.style.setProperty('position', 'fixed', 'important');
    overlayEl.style.setProperty('top', '0', 'important');
    overlayEl.style.setProperty('left', '0', 'important');
    overlayEl.style.setProperty('right', '0', 'important');
    overlayEl.style.setProperty('bottom', '0', 'important');
    overlayEl.style.setProperty('width', '100vw', 'important');
    overlayEl.style.setProperty('height', '100vh', 'important');
    overlayEl.style.setProperty('display', 'flex', 'important');
    overlayEl.style.setProperty('justify-content', 'center', 'important');
    overlayEl.style.setProperty('align-items', 'center', 'important');
    overlayEl.style.setProperty('z-index', '31100', 'important');

    // selectedRegion 已在上方确定，无需重新赋值
    const $focusArea = overlay.find('.acu-map-focus-area');
    const $thumbnails = overlay.find('.acu-map-thumbnails');
    const $regionTabs = overlay.find('.acu-map-region-tabs');

    // 图标渲染：支持 fa:xxx / ti:xxx 简写和原生emoji
    const renderIconContent = (icon: string): string => {
      if (icon.startsWith('fa:')) {
        const name = icon.slice(3);
        return `<i class="fa-solid fa-${name} acu-theme-icon"></i>`;
      }
      if (icon.startsWith('ti:')) {
        const name = icon.slice(3);
        return `<i class="ti ti-${name} acu-theme-icon"></i>`;
      }
      return icon;
    };

    const renderElementChip = element => {
      const name = element.name || element.type || '元素';
      const iconContext = deps.createGlobalInteractionCustomTableNameIconContext(element.tableName, name);
      const fallbackEmojiContent = element.emoji ? renderIconContent(element.emoji) : '';
      const emojiContent = iconContext
        ? deps.renderCustomTableNameIconContent(fallbackEmojiContent, iconContext)
        : fallbackEmojiContent;
      const emoji = element.emoji || iconContext ? `<span class="acu-map-chip-emoji">${emojiContent}</span>` : '';
      return `
                 <div class="acu-map-element-chip acu-dash-preview-trigger" data-table-key="${deps.escapeHtml(
                   element.tableKey || '',
                 )}" data-row-index="${element.rowIndex}">
                     ${emoji}
                     <span class="acu-map-chip-name" title="${deps.escapeHtml(name)}">${deps.escapeHtml(name)}</span>
                 </div>
             `;
    };

    const renderFocusArea = (model, locationName) => {
      const location = model.locations.get(locationName);
      if (!location) {
        return '<div class="acu-map-loading acu-map-loading-wide"><div class="acu-map-spinner"></div></div>';
      }

      const characters = model.characters.get(locationName) || [];
      const elements = model.elements.get(locationName) || [];

      // 分割角色和元素到左右两侧
      const leftChars = characters.slice(0, Math.ceil(characters.length / 2));
      const rightChars = characters.slice(Math.ceil(characters.length / 2));
      const leftElems = elements.slice(0, Math.ceil(elements.length / 2));
      const rightElems = elements.slice(Math.ceil(elements.length / 2));

      const renderAvatarHtml = char => {
        const displayName = deps.replaceUserPlaceholders(char.name);
        // 角色节点始终走 AvatarManager，地图人物面禁止接入自定义表名图标。
        const avatarStyle = deps.escapeHtml(
          deps.buildAvatarBackgroundStyle(char.avatarUrl, char.avatarOffsetX, char.avatarOffsetY, char.avatarScale),
        );
        const hasAvatar = Boolean(avatarStyle);
        return `
            <div class="acu-map-avatar acu-dash-preview-trigger" data-table-key="${deps.escapeHtml(
              char.tableKey || '',
            )}" data-row-index="${char.rowIndex}">
                <div class="acu-map-avatar-circle" style="${avatarStyle}">
                    ${hasAvatar ? '' : `<span>${deps.escapeHtml(displayName.charAt(0))}</span>`}
                </div>
                <div class="acu-map-avatar-name" title="${deps.escapeHtml(displayName)}">${deps.escapeHtml(
                  displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName,
                )}</div>
            </div>
        `;
      };

      const leftAvatarsHtml = leftChars.length ? leftChars.map(renderAvatarHtml).join('') : '';
      const rightAvatarsHtml = rightChars.length ? rightChars.map(renderAvatarHtml).join('') : '';
      const leftElemsHtml = leftElems.length ? leftElems.map(e => renderElementChip(e)).join('') : '';
      const rightElemsHtml = rightElems.length ? rightElems.map(e => renderElementChip(e)).join('') : '';

      const locationIconContext = deps.createGlobalInteractionCustomTableNameIconContext(location.tableName, location.name);
      const locationEmojiHtml = location.emoji
        ? deps.renderCustomTableNameIconContent(renderIconContent(location.emoji), locationIconContext)
        : null;
      const locationTextHtml = deps.renderCustomTableNameIconContent(
        deps.escapeHtml(location.name.charAt(0) || '□'),
        locationIconContext,
      );
      const emojiHtml = locationEmojiHtml
        ? `<div class="acu-map-location-emoji">${locationEmojiHtml}</div>`
        : `<div class="acu-map-location-text">${locationTextHtml}</div>`;

      return `
        <div class="acu-map-wing left">
            <div class="acu-map-avatar-group acu-group-left">${leftAvatarsHtml || ''}</div>
            <div class="acu-map-element-group acu-group-left">${leftElemsHtml || ''}</div>
        </div>
        <div class="acu-map-stage-center acu-dash-preview-trigger" data-table-key="${deps.escapeHtml(
          location.tableKey,
        )}" data-row-index="${location.rowIndex}">
            ${emojiHtml}
            <div class="acu-map-location-name" title="${deps.escapeHtml(location.name)}">${deps.escapeHtml(location.name)}</div>
        </div>
        <div class="acu-map-wing right">
            <div class="acu-map-avatar-group acu-group-right">${rightAvatarsHtml || ''}</div>
            <div class="acu-map-element-group acu-group-right">${rightElemsHtml || ''}</div>
        </div>
        <div class="acu-map-mobile-stack">
            <div class="acu-map-mobile-avatars">${leftAvatarsHtml || ''}${rightAvatarsHtml || ''}</div>
            <div class="acu-map-mobile-elements">${leftElemsHtml || ''}${rightElemsHtml || ''}</div>
        </div>
    `;
    };

    const renderThumbnailLocation = (model, location, isActive) => {
      const charCount = (model.characters.get(location.name) || []).length;
      const elementCount = (model.elements.get(location.name) || []).length;
      const totalCount = charCount + elementCount;
      const locationIconContext = deps.createGlobalInteractionCustomTableNameIconContext(location.tableName, location.name);
      const emoji = location.emoji
        ? `<div class="acu-map-thumbnail-emoji">${deps.renderCustomTableNameIconContent(renderIconContent(location.emoji), locationIconContext)}</div>`
        : `<div class="acu-map-thumbnail-placeholder">${deps.renderCustomTableNameIconContent(deps.escapeHtml(location.name.charAt(0) || '□'), locationIconContext)}</div>`;
      const badgeHtml = totalCount > 0 ? `<div class="acu-map-thumbnail-badge">${totalCount}</div>` : '';
      return `
        <div class="acu-map-thumbnail ${isActive ? 'active' : ''}" data-location="${deps.escapeHtml(location.name)}" role="button" tabindex="0" aria-pressed="${isActive ? 'true' : 'false'}" aria-label="查看地点：${deps.escapeHtml(location.name)}">
            ${badgeHtml}
            ${emoji}
            <div class="acu-map-thumbnail-name" title="${deps.escapeHtml(location.name)}">${deps.escapeHtml(
              location.name.length > 6 ? location.name.substring(0, 6) + '..' : location.name,
            )}</div>
        </div>
    `;
    };

    const renderRegionTabs = (regions, currentRegion) => {
      if (regions.length <= 1) return '';
      return regions
        .map(
          r =>
            `<button class="acu-map-region-tab ${r === currentRegion ? 'active' : ''}" type="button" data-region="${deps.escapeHtml(
              r,
            )}" aria-pressed="${r === currentRegion ? 'true' : 'false'}">${deps.escapeHtml(r)}</button>`,
        )
        .join('');
    };

    const refreshPanel = () => {
      $focusArea.html(renderFocusArea(viewModel, focusLocation));

      const regionLocations = Array.from(viewModel.locations.values())
        .filter(l => (l.region || '其他') === selectedRegion)
        .sort((a, b) => {
          // 按交互热度排序: 角色数 + 元素数（降序）
          const scoreA =
            (viewModel.characters.get(a.name)?.length || 0) + (viewModel.elements.get(a.name)?.length || 0);
          const scoreB =
            (viewModel.characters.get(b.name)?.length || 0) + (viewModel.elements.get(b.name)?.length || 0);
          return scoreB - scoreA;
        });

      const thumbnails = regionLocations
        .map(location => renderThumbnailLocation(viewModel, location, location.name === focusLocation))
        .join('');
      $thumbnails.html(thumbnails || '<div class="acu-map-empty">该地区暂无其他地点</div>');

      $regionTabs.html(renderRegionTabs(viewModel.allRegions, selectedRegion));
      deps.hydrateCustomTableNameIconsIn(overlay);

      window.requestAnimationFrame(() => {
        const activeTab = $regionTabs.find('.acu-map-region-tab.active')[0] as HTMLElement | undefined;
        activeTab?.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    };

    const setFocusLocation = name => {
      if (!name) return;
      focusLocation = name;
      Store.set(deps.STORAGE_KEY_MAP_FOCUS, focusLocation);
      // 将用户选择写入当前地区的缓存
      tabSelectionCache.set(selectedRegion, focusLocation);
      refreshPanel();
    };

    refreshPanel();

    // [新增] 存储刷新回调，供外部删除操作调用
    overlay.data('refreshMapData', async () => {
      const newViewModel = await deps.buildMapViewModel();
      if (newViewModel) {
        viewModel = newViewModel;

        // [修复] 检查当前焦点地点是否仍然存在，不存在则回退
        if (!viewModel.locations.has(focusLocation)) {
          // [优化] 优先回退到当前次要地区的第一个详细地点
          const detailLocation = viewModel.detailLocation || '';
          const playerLocation = viewModel.playerLocation || '';

          let newFocus = '';
          let newRegion = selectedRegion;

          // 优先级1: 当前次要地区的第一个可用地点
          const regionLocs = Array.from(viewModel.locations.values()).filter(
            l => (l.region || '其他') === selectedRegion,
          );
          if (regionLocs.length > 0) {
            newFocus = regionLocs[0].name;
          } else if (detailLocation && viewModel.locations.has(detailLocation)) {
            // 优先级2: detailLocation（当前次要地区不存在时）
            newFocus = detailLocation;
            const loc = viewModel.locations.get(detailLocation);
            newRegion = loc?.region || newRegion;
          } else if (playerLocation && viewModel.locations.has(playerLocation)) {
            // 优先级3: playerLocation
            newFocus = playerLocation;
            const loc = viewModel.locations.get(playerLocation);
            newRegion = loc?.region || newRegion;
          } else if (viewModel.focusLocation && viewModel.locations.has(viewModel.focusLocation)) {
            // 优先级4: focusLocation
            newFocus = viewModel.focusLocation;
            const loc = viewModel.locations.get(newFocus);
            newRegion = loc?.region || newRegion;
          } else {
            // 兜底：任意第一个地点
            const firstLoc = Array.from(viewModel.locations.values())[0];
            if (firstLoc) {
              newFocus = firstLoc.name;
              newRegion = firstLoc.region || '其他';
            }
          }

          if (newFocus) {
            focusLocation = newFocus;
            selectedRegion = newRegion;
            // 同步更新Store，防止下次打开地图时跳回已删除地点
            Store.set(deps.STORAGE_KEY_MAP_FOCUS, focusLocation);
            // 更新tab缓存
            tabSelectionCache.set(selectedRegion, focusLocation);
          }
        }

        refreshPanel();
      }
    });

    // [修复] 直接绑定关闭按钮事件（而非事件委托，避免被其他事件干扰）
    const $closeBtn = overlay.find('.acu-map-close');
    $closeBtn.on('click', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      overlay.remove();
    });
    overlay.on('click', '.acu-map-region-tab', function () {
      const newRegion = $(this).data('region');
      if (newRegion === selectedRegion) return;
      selectedRegion = newRegion;

      // 检查当前 focusLocation 是否在新地区内
      const regionLocations = Array.from(viewModel.locations.values()).filter(
        l => (l.region || '其他') === selectedRegion,
      );
      const currentInNewRegion = regionLocations.find(l => l.name === focusLocation);

      if (!currentInNewRegion && regionLocations.length > 0) {
        // 优先级: 缓存的选中地点 > 热度最高的地点
        const cachedLocation = tabSelectionCache.get(selectedRegion);
        const cachedInRegion = cachedLocation && regionLocations.find(l => l.name === cachedLocation);

        if (cachedInRegion) {
          // 使用缓存的选中地点
          focusLocation = cachedLocation;
        } else {
          // 使用热度最高的地点（已按热度排序）
          const hotLocations = getHotLocationsInRegion(selectedRegion);
          focusLocation = hotLocations.length > 0 ? hotLocations[0].name : regionLocations[0].name;
        }
        Store.set(deps.STORAGE_KEY_MAP_FOCUS, focusLocation);
      }

      refreshPanel();
    });
    deps.setupOverlayClose(overlay, 'acu-map-overlay', () => {
      overlay.remove();
    });

    overlay.on('click', '.acu-map-thumbnail', function () {
      const locationName = $(this).data('location');
      if (locationName) setFocusLocation(locationName);
    });

    overlay.on('keydown', '.acu-map-thumbnail', function (this: HTMLElement, e: JQuery.KeyDownEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const locationName = $(this).data('location');
      if (locationName) setFocusLocation(locationName);
    });

    overlay.on('click', '.acu-map-back-btn', () => {
      const fallbackFocus = viewModel.focusLocation;
      const detailLocation = viewModel.detailLocation || '';
      const playerLocation = viewModel.playerLocation || '';

      let target = '';
      if (detailLocation && viewModel.locations.has(detailLocation)) {
        target = detailLocation;
      } else if (playerLocation && viewModel.locations.has(playerLocation)) {
        target = playerLocation;
      } else if (fallbackFocus && viewModel.locations.has(fallbackFocus)) {
        target = fallbackFocus;
      }

      if (!target) return;

      // 找到目标地点所属的地区，同时切换
      const targetLocation = viewModel.locations.get(target);
      const targetRegion = targetLocation?.region || viewModel.currentRegion || '其他';
      if (targetRegion !== selectedRegion) {
        selectedRegion = targetRegion;
      }

      focusLocation = target;
      Store.set(deps.STORAGE_KEY_MAP_FOCUS, focusLocation);
      refreshPanel();
    });

    // 弹窗创建完成，重置锁（允许关闭后重新打开）
    deps.setIsMapOpening(false);

    // 地图打开时只加载一次数据，不需要持续轮询
    // 用户无法在地图弹窗打开时修改表格数据
  };
  return showMapVisualization;
}
