// @ts-nocheck
/**
 * show-favorite-edit-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowFavoriteEditModal(deps: any) {
  const showFavoriteEditModal = (fav: FavoriteItem, onSave: (updated: Partial<FavoriteItem>) => void) => {
    const { $ } = deps.getCore();
    $('.acu-fav-edit-overlay').remove();

    const config = deps.getConfig();

    // 生成编辑行HTML
    const renderEditRows = (header: string[], rowData: (string | number)[]) => {
      return header
        .map(
          (h, i) => `
        <div class="acu-fav-edit-row" data-index="${i}">
          <input type="text" class="acu-fav-edit-header" value="${deps.escapeHtml(h)}" placeholder="列名" />
          <input type="text" class="acu-fav-edit-value" value="${deps.escapeHtml(String(rowData[i] || ''))}" placeholder="值" />
          <button class="acu-fav-edit-remove" title="删除列"><i class="fa-solid fa-minus"></i></button>
        </div>
      `,
        )
        .join('');
    };

    const overlayHtml = `
      <div class="acu-fav-edit-overlay acu-theme-${config.theme}">
        <div class="acu-fav-edit-modal">
          <div class="acu-fav-edit-modal-header">
            <h4>编辑收藏</h4>
            <button class="acu-fav-edit-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-fav-edit-modal-body">
            <div class="acu-fav-edit-tags-section">
              <label>标签 (逗号分隔):</label>
              <input type="text" id="acu-fav-edit-tags" value="${deps.escapeHtml(fav.tags.join(', '))}" />
            </div>
            <div class="acu-fav-edit-rows">
              ${renderEditRows(fav.header, fav.rowData)}
            </div>
            <button class="acu-fav-edit-add-col"><i class="fa-solid fa-plus"></i> 添加列</button>
          </div>
          <div class="acu-fav-edit-modal-footer">
            <button class="acu-fav-edit-cancel">取消</button>
            <button class="acu-fav-edit-save">保存</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-fav-edit-overlay');
    const $modal = $overlay.find('.acu-fav-edit-modal');

    const closeModal = () => $overlay.remove();

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-fav-edit-overlay')) closeModal();
    });

    $modal.find('.acu-fav-edit-close, .acu-fav-edit-cancel').on('click', closeModal);

    // 删除列
    $modal.on('click', '.acu-fav-edit-remove', function () {
      $(this).closest('.acu-fav-edit-row').remove();
    });

    // 添加列
    $modal.find('.acu-fav-edit-add-col').on('click', () => {
      const newIndex = $modal.find('.acu-fav-edit-row').length;
      const newRowHtml = `
        <div class="acu-fav-edit-row" data-index="${newIndex}">
          <input type="text" class="acu-fav-edit-header" value="" placeholder="列名" />
          <input type="text" class="acu-fav-edit-value" value="" placeholder="值" />
          <button class="acu-fav-edit-remove" title="删除列"><i class="fa-solid fa-minus"></i></button>
        </div>
      `;
      $modal.find('.acu-fav-edit-rows').append(newRowHtml);
    });

    // 保存
    $modal.find('.acu-fav-edit-save').on('click', () => {
      const newHeader: string[] = [];
      const newRowData: (string | number)[] = [];

      $modal.find('.acu-fav-edit-row').each(function () {
        const h = $(this).find('.acu-fav-edit-header').val() as string;
        const v = $(this).find('.acu-fav-edit-value').val() as string;
        if (h.trim()) {
          newHeader.push(h.trim());
          newRowData.push(v);
        }
      });

      const tagsStr = ($modal.find('#acu-fav-edit-tags').val() as string) || '';
      const newTags = tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      onSave({
        header: newHeader,
        rowData: newRowData,
        tags: newTags,
      });

      closeModal();
    });
  };
  return showFavoriteEditModal;
}
