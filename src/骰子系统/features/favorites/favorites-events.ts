// @ts-nocheck
/**
 * favorites-events.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
import { FavoritesManager } from './favorites-manager';
import { Store } from '../../shared/storage/store';
export function createBindFavoritesEvents(deps: any) {
  const bindFavoritesEvents = ($panel: JQuery) => {
    const { $ } = deps.getCore();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const currentTables = rawData || {};

    // 只解绑收藏夹相关的事件，防止影响其他功能的事件绑定（如标签页切换）
    $panel.off('.favEvents');

    // === [修复] 收藏夹面板：阻止水平滑动冒泡，防止触发 ST 的 swipe regenerate ===
    (function () {
      const panelEl = $panel[0];
      if (!panelEl) return;

      // 清理旧的事件监听器（通过标记）
      if ((panelEl as any)._favSwipeFixApplied) return;
      (panelEl as any)._favSwipeFixApplied = true;

      let touchStartX = 0;
      let touchStartY = 0;
      let isHorizontalSwipe = false;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isHorizontalSwipe = false;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        // 判断是否为水平滑动：deltaY很小时降低阈值，否则使用标准判断
        const isHorizontal = deltaY < 5 ? deltaX > 5 && deltaX > deltaY * 2 : deltaX > deltaY * 1.5 && deltaX > 10;

        if (isHorizontal) {
          isHorizontalSwipe = true;
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      };

      const onTouchEnd = (e: TouchEvent) => {
        if (isHorizontalSwipe) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          isHorizontalSwipe = false;
        }
        touchStartX = 0;
        touchStartY = 0;
      };

      // 在捕获阶段监听，优先于 ST 的事件处理
      panelEl.addEventListener('touchstart', onTouchStart, true);
      panelEl.addEventListener('touchmove', onTouchMove, true);
      panelEl.addEventListener('touchend', onTouchEnd, true);

      // 清理函数（页面卸载时）
      $(window).on('pagehide.favSwipeFix', () => {
        panelEl.removeEventListener('touchstart', onTouchStart, true);
        panelEl.removeEventListener('touchmove', onTouchMove, true);
        panelEl.removeEventListener('touchend', onTouchEnd, true);
      });
    })();

    // 关闭按钮
    $panel.on('click.favEvents', '.acu-close-btn', function (e) {
      e.stopPropagation();
      Store.set('acu_favorites_panel_active', false);
      deps.closePanel($panel.closest<HTMLElement>(DICE_ROOT_SELECTOR));
      $panel.html('');
    });

    // [修复] 高度拖拽 - 收藏夹面板
    $panel.on('pointerdown.favEvents', '.acu-height-drag-handle', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const handle = this;
      handle.setPointerCapture(e.pointerId);
      $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
      const $dataArea = $panel;
      const startHeight = deps.getPanelDragStartHeight($dataArea);
      let requestedHeight = startHeight;
      const startY = e.clientY;
      const tableName = $(handle).data('table');

      handle.onpointermove = function (moveE: PointerEvent) {
        const dy = moveE.clientY - startY;
        requestedHeight = deps.setPanelRequestedHeight($dataArea, startHeight - dy) || requestedHeight;
      };
      handle.onpointerup = function (upE: PointerEvent) {
        $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
        handle.releasePointerCapture(upE.pointerId);
        handle.onpointermove = null;
        handle.onpointerup = null;
        if (tableName) {
          deps.savePanelRequestedHeight(tableName, requestedHeight);
        }
      };
    });

    // [修复] 双击重置高度 - 收藏夹面板
    $panel.on('dblclick.favEvents', '.acu-height-drag-handle', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const tableName = $(this).data('table');
      if (tableName) {
        deps.resetPanelRequestedHeight($panel, tableName);
      }
    });

    // 标签过滤折叠/展开
    $panel.on('click.favEvents', '.acu-fav-tag-filter-header', function () {
      const $collapsible = $(this).closest('.acu-fav-tag-filter-collapsible');
      $collapsible.toggleClass('collapsed');
    });

    // 标签按钮toggle
    $panel.on('click.favEvents', '.acu-fav-tag-btn', function () {
      const $btn = $(this);
      const tag = $btn.data('tag') as string;
      const isActive = $btn.hasClass('active');

      // 切换按钮状态
      $btn.toggleClass('active');

      // 过滤对应分组
      if (tag === '__untagged__') {
        // 未分类分组：找标题包含"未分类"的分组
        $panel.find('.acu-fav-group').each(function () {
          const groupTitle = $(this).find('.acu-fav-group-title').text();
          if (groupTitle.includes('未分类')) {
            $(this).toggle(!isActive);
          }
        });
      } else {
        // 普通标签分组：找标题匹配的分组
        $panel.find('.acu-fav-group').each(function () {
          const groupTitle = $(this).find('.acu-fav-group-title').text();
          if (groupTitle.includes(tag) && !groupTitle.includes('未分类')) {
            $(this).toggle(!isActive);
          }
        });
      }
    });

    // 搜索
    $panel.find('#acu-fav-search').on(
      'input.favEvents',
      _.debounce(function () {
        const searchTerm = ($(this).val() as string).toLowerCase().trim();
        $panel.find('.acu-fav-card').each(function () {
          const cardText = $(this).text().toLowerCase();
          $(this).toggle(cardText.includes(searchTerm));
        });
      }, 300),
    );

    // 显示收藏卡片菜单
    const showFavCardMenu = (e: JQuery.ClickEvent, cardId: string) => {
      $('.acu-cell-menu, .acu-menu-backdrop').remove();

      const backdrop = $('<div class="acu-menu-backdrop"></div>');
      $('body').append(backdrop);

      const config = deps.getConfig();
      const menu = $(`
        <div class="acu-cell-menu acu-theme-${config.theme}" data-fav-id="${deps.escapeHtml(cardId)}">
          <button type="button" class="acu-cell-menu-item" data-action="edit"><i class="fa-solid fa-pen"></i> 编辑</button>
          <button type="button" class="acu-cell-menu-item" data-action="copy"><i class="fa-solid fa-copy"></i> 复制</button>
          <button type="button" class="acu-cell-menu-item" data-action="send"><i class="fa-solid fa-paper-plane"></i> 发送到表格</button>
          <button type="button" class="acu-cell-menu-item" data-action="delete"><i class="fa-solid fa-trash"></i> 删除</button>
          <button type="button" class="acu-cell-menu-item" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
        </div>
      `);
      $('body').append(menu);

      // 定位菜单
      const winWidth = $(window).width() || 800;
      const winHeight = $(window).height() || 600;
      const mWidth = menu.outerWidth() || 150;
      const mHeight = menu.outerHeight() || 150;
      let posX = e.clientX || winWidth / 2;
      let posY = e.clientY || winHeight / 2;
      if (posX + mWidth > winWidth) posX = winWidth - mWidth - 10;
      if (posY + mHeight > winHeight) posY = winHeight - mHeight - 10;
      menu.css({ left: posX, top: posY });

      // 点击backdrop关闭
      backdrop.on('click', () => {
        $('.acu-cell-menu, .acu-menu-backdrop').remove();
      });

      // 菜单项点击事件
      menu.on('click', '.acu-cell-menu-item', async function () {
        const action = $(this).data('action');
        const id = menu.data('fav-id');
        $('.acu-cell-menu, .acu-menu-backdrop').remove();

        if (action === 'close') return;

        const fav = await FavoritesManager.getById(id);
        if (!fav) return;

        if (action === 'edit') {
          deps.showFavoriteEditModal(fav, async updated => {
            await FavoritesManager.updateFavorite(id, updated);
            $panel.html(await deps.renderFavoritesPanel());
            bindFavoritesEvents($panel);
          });
        } else if (action === 'copy') {
          const copied = await FavoritesManager.duplicateFavorite(id);
          if (copied) {
            $panel.html(await deps.renderFavoritesPanel());
            bindFavoritesEvents($panel);
          }
        } else if (action === 'send') {
          const compatible = FavoritesManager.findCompatibleTables(fav, currentTables);
          if (compatible.length === 0) {
            toastr.warning('当前聊天没有兼容的表格');
            return;
          }
          deps.showSendToTableModal(fav, compatible, currentTables, async () => {
            $panel.html(await deps.renderFavoritesPanel());
            bindFavoritesEvents($panel);
          });
        } else if (action === 'delete') {
          await FavoritesManager.deleteFavorite(id);
          $panel.html(await deps.renderFavoritesPanel());
          bindFavoritesEvents($panel);
        }
      });
    };

    // 单击卡片显示菜单
    $panel.on('click.favEvents', '.acu-fav-card', function (e) {
      e.stopPropagation();
      const $card = $(this);
      const cardId = $card.data('id');

      // Toggle行为：同一卡片再次点击则关闭菜单
      const existingMenu = $('.acu-cell-menu');
      if (existingMenu.length && existingMenu.data('fav-id') === cardId) {
        $('.acu-cell-menu, .acu-menu-backdrop').remove();
        return;
      }

      showFavCardMenu(e, cardId);
    });

    // 导入
    $panel.on('click.favEvents', '#acu-fav-import', async function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          const result = await FavoritesManager.importFavorites(text);
          // [修复] importFavorites 返回 { added, updated } 对象，不是数字
          if (result && (result.added > 0 || result.updated > 0)) {
            if (window.toastr) window.toastr.success(`导入成功: 新增${result.added}条, 更新${result.updated}条`);
            $panel.html(await deps.renderFavoritesPanel());
            bindFavoritesEvents($panel);
          } else {
            if (window.toastr) window.toastr.warning('导入失败或无有效数据');
          }
        }
      };
      input.click();
    });

    // 导出
    $panel.on('click.favEvents', '#acu-fav-export', async function () {
      const json = await FavoritesManager.exportFavorites();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favorites_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (window.toastr) window.toastr.success('导出成功');
    });

    console.log('[DICE] bindFavoritesEvents initialized');
  };
  return bindFavoritesEvents;
}
