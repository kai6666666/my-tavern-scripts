// @ts-nocheck
/**
 * inventory-gift-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowInventoryGiftDialog(deps: any) {
  const showInventoryGiftDialog = async rowIndex => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const item = deps.findInventoryItemByRow(rowIndex);
    if (!item) {
      if (window.toastr) window.toastr.warning('未找到可赠与的物品');
      return;
    }

    const characters = deps.getInventoryCharacters(rawData);
    const charactersWithAvatar = await Promise.all(
      characters.map(async character => {
        const avatarUrl = await deps.AvatarManager.getAsync(character.name);
        return {
          ...character,
          avatarUrl: avatarUrl || '',
          avatarOffsetX: deps.AvatarManager.getOffsetX(character.name),
          avatarOffsetY: deps.AvatarManager.getOffsetY(character.name),
          avatarScale: deps.AvatarManager.getScale(character.name),
          isPresent: character.presence === '在场',
        };
      }),
    );

    const renderGiftOptions = (onlyPresent: boolean) => {
      const filteredCharacters = onlyPresent
        ? charactersWithAvatar.filter(character => character.isPresent)
        : charactersWithAvatar;
      if (filteredCharacters.length === 0) {
        return `<div class="acu-inventory-empty compact"><i class="fa-solid fa-user-slash"></i><span>${onlyPresent ? '当前没有在场角色' : '未找到可赠与的角色'}</span></div>`;
      }

      return filteredCharacters
        .map(character => {
          const fallbackChar = character.displayName.charAt(0) || '?';
          return `
            <button
              class="acu-inventory-gift-target ${character.isPresent ? 'is-present' : 'is-away'}"
              data-name="${deps.escapeHtml(character.displayName)}"
              data-is-present="${character.isPresent ? 'true' : 'false'}"
            >
              <span
                class="acu-inventory-gift-avatar acu-avatar-preview ${character.avatarUrl ? 'has-image' : ''} ${character.isPresent ? 'is-present' : 'is-away'}"
                data-avatar-url="${deps.escapeHtml(character.avatarUrl)}"
                data-avatar-x="${character.avatarOffsetX}"
                data-avatar-y="${character.avatarOffsetY}"
                data-avatar-scale="${character.avatarScale}"
                aria-hidden="true"
              >
                ${!character.avatarUrl ? `<span>${deps.escapeHtml(fallbackChar)}</span>` : ''}
                ${character.isPresent ? '<span class="acu-inventory-gift-avatar-indicator"></span>' : ''}
              </span>
              <span class="acu-inventory-gift-name ${character.isPresent ? 'is-present' : 'is-away'}" title="${deps.escapeHtml(character.displayName)}">${deps.escapeHtml(character.displayName)}</span>
              <span class="acu-inventory-presence ${character.isPresent ? 'is-present' : 'is-away'}">${deps.escapeHtml(character.presence)}</span>
            </button>
          `;
        })
        .join('');
    };

    const dialog = $(`
      <div class="acu-edit-overlay acu-inventory-gift-overlay">
        <div class="acu-edit-dialog acu-theme-${config.theme} acu-inventory-gift-dialog">
          <div class="acu-edit-title acu-inventory-gift-title">
            <span><i class="fa-solid fa-gift"></i> 赠与 ${deps.escapeHtml(item.name)}</span>
            <span class="acu-inventory-gift-title-actions">
              <button
                type="button"
                class="acu-inventory-gift-filter-toggle"
                data-only-present="false"
                title="切换仅显示在场角色"
                aria-pressed="false"
              >
                <i class="fa-solid fa-map-marker-alt"></i>
              </button>
              <button
                type="button"
                class="acu-inventory-gift-close"
                title="关闭"
                aria-label="关闭"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </span>
          </div>
          <div class="acu-inventory-gift-list">${renderGiftOptions(false)}</div>
          <div class="acu-dialog-btns">
            <button class="acu-dialog-btn acu-inventory-gift-cancel"><i class="fa-solid fa-times"></i> 取消</button>
          </div>
        </div>
      </div>
    `);

    const applyGiftAvatarStyles = ($root: JQuery<HTMLElement>) => {
      $root.find('.acu-inventory-gift-avatar').each(function () {
        const $preview = $(this);
        const url = String($preview.attr('data-avatar-url') || '').trim();
        const offsetX = Number($preview.attr('data-avatar-x') || 50);
        const offsetY = Number($preview.attr('data-avatar-y') || 50);
        const scale = Number($preview.attr('data-avatar-scale') || 150);
        const cssImageUrl = deps.formatCssImageUrl(url, { allowInternalObjectUrl: true });

        if (!cssImageUrl) {
          $preview.removeClass('has-image').css({
            '--acu-avatar-image': '',
            '--acu-avatar-x': '',
            '--acu-avatar-y': '',
            '--acu-avatar-scale': '',
          });
          return;
        }

        $preview.addClass('has-image').css({
          '--acu-avatar-image': cssImageUrl,
          '--acu-avatar-x': `${offsetX}%`,
          '--acu-avatar-y': `${offsetY}%`,
          '--acu-avatar-scale': `${scale}%`,
        });
      });
    };

    const refreshGiftList = (onlyPresent: boolean) => {
      dialog.find('.acu-inventory-gift-list').html(renderGiftOptions(onlyPresent));
      applyGiftAvatarStyles(dialog);
    };

    $('body').append(dialog);
    applyGiftAvatarStyles(dialog);
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());
    dialog.on('click', '.acu-inventory-gift-close', () => dialog.remove());
    dialog.on('click', '.acu-inventory-gift-cancel', () => dialog.remove());
    dialog.on('click', '.acu-inventory-gift-filter-toggle', function () {
      const $button = $(this);
      const nextOnlyPresent = String($button.attr('data-only-present') || 'false') !== 'true';
      $button
        .attr('data-only-present', nextOnlyPresent ? 'true' : 'false')
        .attr('aria-pressed', nextOnlyPresent ? 'true' : 'false')
        .toggleClass('active', nextOnlyPresent);
      refreshGiftList(nextOnlyPresent);
    });
    dialog.on('click', '.acu-inventory-gift-target', function () {
      const targetName = String($(this).data('name') || '').trim();
      if (!targetName) return;
      deps.smartInsertToTextarea(`<user>将${item.name}赠与${targetName}。`, 'action');
      $('#send_textarea').focus();
      dialog.remove();
      $('.acu-inventory-detail-overlay').remove();
    });
  };
  return showInventoryGiftDialog;
}
