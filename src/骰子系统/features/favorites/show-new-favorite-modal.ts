// @ts-nocheck
/**
 * show-new-favorite-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowNewFavoriteModal(deps: any) {
  const showNewFavoriteModal = (
    currentTables: Record<string, any>,
    onCreate: (header: string[], tableName: string) => void,
  ) => {
    const { $ } = deps.getCore();
    $('.acu-fav-new-overlay').remove();

    const config = deps.getConfig();

    const tableOptions = Object.keys(currentTables)
      .map(key => {
        const table = currentTables[key];
        const name = table.name || key;
        return `<option value="${deps.escapeHtml(key)}">${deps.escapeHtml(name)}</option>`;
      })
      .join('');

    const overlayHtml = `
      <div class="acu-fav-new-overlay acu-theme-${config.theme}">
        <div class="acu-fav-new-modal">
          <div class="acu-fav-new-modal-header">
            <h4>选择模板</h4>
            <button class="acu-fav-new-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-fav-new-modal-body">
            <label>从以下表格中选择结构作为模板:</label>
            <select id="acu-fav-new-template">
              ${tableOptions}
            </select>
          </div>
          <div class="acu-fav-new-modal-footer">
            <button class="acu-fav-new-cancel">取消</button>
            <button class="acu-fav-new-create">创建</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-fav-new-overlay');
    const $modal = $overlay.find('.acu-fav-new-modal');

    const closeModal = () => $overlay.remove();

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-fav-new-overlay')) closeModal();
    });

    $modal.find('.acu-fav-new-close, .acu-fav-new-cancel').on('click', closeModal);

    $modal.find('.acu-fav-new-create').on('click', () => {
      const key = $modal.find('#acu-fav-new-template').val() as string;
      const table = currentTables[key];
      if (!table || !table.content || !table.content[0]) {
        showActionableErrorToast('无效的表格模板', { suggestion: 'tableTemplate' });
        return;
      }

      const fullHeader = table.content[0];
      const header: string[] = fullHeader.slice(1).map((h: any) => String(h || ''));
      const tableName = table.name || key;

      onCreate(header, tableName);
      closeModal();
    });
  };
  return showNewFavoriteModal;
}
