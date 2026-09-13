// @ts-nocheck
/**
 * show-inventory-detail-menu.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowInventoryDetailMenu(deps: any) {
  const showInventoryDetailMenu = (
    event: JQuery.ClickEvent,
    rowIndex: number,
    scope: InventoryMenuScope,
    fieldKey?: InventoryEditableField,
    anchorEl?: HTMLElement,
  ) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    $('.acu-cell-menu.acu-inventory-detail-menu, .acu-menu-backdrop.acu-inventory-detail-menu-backdrop').remove();

    const $overlay = $('.acu-inventory-detail-overlay').last();
    const mountTarget = $overlay.length ? $overlay : $('body');
    const backdrop = $('<div class="acu-menu-backdrop acu-inventory-detail-menu-backdrop"></div>');
    let menuItemsHtml = '';

    if (scope === 'field' && fieldKey) {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="${fieldKey}"><i class="fa-solid fa-pen"></i> 编辑${deps.escapeHtml(deps.getInventoryFieldLabel(fieldKey))}</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    } else if (scope === 'summary') {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="type"><i class="fa-solid fa-pen"></i> 编辑类型</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="quality"><i class="fa-solid fa-gem"></i> 编辑品质</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="quantity"><i class="fa-solid fa-hashtag"></i> 编辑数量</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    } else if (scope === 'meta') {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="acquiredAtLocation"><i class="fa-solid fa-location-dot"></i> 编辑获得地</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="acquiredAt"><i class="fa-solid fa-clock"></i> 编辑获取时间</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-meta-record"><i class="fa-solid fa-pen-to-square"></i> 编辑获得信息</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    } else {
      menuItemsHtml = `
        <button class="acu-cell-menu-item" type="button" data-action="edit-field" data-field-key="name"><i class="fa-solid fa-pen"></i> 编辑名称</button>
        <button class="acu-cell-menu-item" type="button" data-action="edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
        <button class="acu-cell-menu-item" type="button" data-action="close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
      `;
    }

    const menu = $(`
      <div class="acu-cell-menu acu-inventory-detail-menu acu-theme-${config.theme}" data-row-index="${rowIndex}">
        ${menuItemsHtml}
      </div>
    `);
    mountTarget.append(backdrop, menu);

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || $(window).width() || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || $(window).height() || 0;
    const menuWidth = menu.outerWidth() || 220;
    const menuHeight = menu.outerHeight() || 180;
    const anchorRect = anchorEl?.getBoundingClientRect();
    const overlayRect =
      $overlay.length && typeof $overlay[0].getBoundingClientRect === 'function'
        ? $overlay[0].getBoundingClientRect()
        : null;
    const rawEvent = event.originalEvent;
    const touchPoint = rawEvent && 'touches' in rawEvent && rawEvent.touches.length > 0 ? rawEvent.touches[0] : null;
    const changedTouchPoint =
      rawEvent && 'changedTouches' in rawEvent && rawEvent.changedTouches.length > 0
        ? rawEvent.changedTouches[0]
        : null;
    const fallbackX =
      typeof event.clientX === 'number'
        ? event.clientX
        : touchPoint?.clientX || changedTouchPoint?.clientX || viewportWidth / 2;
    const fallbackY =
      typeof event.clientY === 'number'
        ? event.clientY
        : touchPoint?.clientY || changedTouchPoint?.clientY || viewportHeight / 2;
    const pointX = anchorRect ? anchorRect.left + anchorRect.width / 2 : fallbackX;
    const pointY = anchorRect ? anchorRect.bottom : fallbackY;
    const relativeWidth = overlayRect ? overlayRect.width : viewportWidth;
    const relativeHeight = overlayRect ? overlayRect.height : viewportHeight;
    const relativePointX = overlayRect ? pointX - overlayRect.left : pointX;
    const relativePointY = overlayRect ? pointY - overlayRect.top : pointY;
    const relativeTopBase = overlayRect && anchorRect ? anchorRect.top - overlayRect.top : relativePointY;
    const left = Math.min(Math.max(relativePointX - menuWidth / 2, 8), Math.max(relativeWidth - menuWidth - 8, 8));
    const preferredTop = pointY + 8;
    const fallbackTop = (anchorRect ? anchorRect.top : pointY) - menuHeight - 8;
    const relativePreferredTop = overlayRect ? relativePointY + 8 : preferredTop;
    const relativeFallbackTop = overlayRect ? relativeTopBase - menuHeight - 8 : fallbackTop;
    const top =
      relativePreferredTop + menuHeight <= relativeHeight - 8
        ? Math.max(relativePreferredTop, 8)
        : Math.max(Math.min(relativeFallbackTop, relativeHeight - menuHeight - 8), 8);

    const menuEl = menu[0] as HTMLElement | undefined;
    if (menuEl) {
      menuEl.style.setProperty('left', `${left}px`, 'important');
      menuEl.style.setProperty('top', `${top}px`, 'important');
    } else {
      menu.css({ left: `${left}px`, top: `${top}px` });
    }

    const closeAll = () => {
      menu.remove();
      backdrop.remove();
    };

    backdrop.on('click', closeAll);
    menu.on('click', '[data-action]', function () {
      const action = String($(this).data('action') || '');
      const nextFieldKey = String($(this).data('field-key') || '') as InventoryEditableField;
      closeAll();

      if (action === 'edit-field' && nextFieldKey) {
        deps.showInventoryFieldEditDialog(rowIndex, nextFieldKey);
        return;
      }
      if (action === 'edit-meta-record') {
        deps.showInventoryMetaEditDialog(rowIndex);
        return;
      }
      if (action === 'edit-card') {
        const context = deps.getInventoryDetailContext(rowIndex);
        if (!context) {
          if (window.toastr) window.toastr.warning('未找到物品数据');
          return;
        }
        deps.showCardEditModal(
          context.row,
          context.headers,
          context.item.tableName,
          context.item.rowIndex,
          context.item.tableKey,
          {
            overlayClass: 'acu-inventory-edit-overlay',
            onSaved: () => deps.reopenInventoryItemDetail(rowIndex),
          },
        );
      }
    });
  };
  return showInventoryDetailMenu;
}
