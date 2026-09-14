// @ts-nocheck
/**
 * show-send-to-table-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FavoritesManager } from '../../features/favorites/favorites-manager';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowSendToTableModal(deps: any) {
  const showSendToTableModal = (
    fav: FavoriteItem,
    compatible: TableCompatibility[],
    currentTables: Record<string, any>,
    onSuccess: () => void,
  ) => {
    const { $ } = deps.getCore();
    $('.acu-fav-send-overlay').remove();

    const config = deps.getConfig();

    const tableListHtml = compatible
      .map(c => {
        const modeLabel =
          c.mode === 'strict'
            ? '<span class="acu-match-full">✓ 完全匹配</span>'
            : `<span class="acu-match-partial">⚠ 部分匹配 (${c.matchedCols.length}/${fav.header.length}列)</span>`;
        const unmatchedInfo =
          c.unmatchedCols.length > 0
            ? `<div class="acu-fav-send-unmatched">未匹配: ${c.unmatchedCols.join(', ')}</div>`
            : '';

        return `
        <div class="acu-fav-send-option" data-uid="${deps.escapeHtml(c.tableUid)}" data-mode="${c.mode}">
          <div class="acu-fav-send-option-name">${deps.escapeHtml(c.tableName)}</div>
          <div class="acu-fav-send-option-mode">${modeLabel}</div>
          ${unmatchedInfo}
        </div>
      `;
      })
      .join('');

    const overlayHtml = `
      <div class="acu-fav-send-overlay acu-theme-${config.theme}">
        <div class="acu-fav-send-modal">
          <div class="acu-fav-send-modal-header">
            <h4>选择目标表格</h4>
            <button class="acu-fav-send-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-fav-send-modal-body">
            ${tableListHtml}
          </div>
          <div class="acu-fav-send-modal-footer">
            <button class="acu-fav-send-cancel">取消</button>
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-fav-send-overlay');
    // 内联样式确保移动端层叠上下文正确（与骰子配置弹窗同策略）
    $overlay.css({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      'z-index': '31300',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '16px',
      'box-sizing': 'border-box',
    });
    const $modal = $overlay.find('.acu-fav-send-modal');

    const closeModal = () => $overlay.remove();

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-fav-send-overlay')) closeModal();
    });

    $modal.find('.acu-fav-send-close, .acu-fav-send-cancel').on('click', closeModal);

    // 点击选项发送
    $modal.on('click', '.acu-fav-send-option', async function () {
      const uid = $(this).data('uid') as string;
      const mode = $(this).data('mode') as string;
      const table = currentTables[uid];

      if (!table || !table.content) {
        showActionableErrorToast('无法获取目标表格', { suggestion: 'table' });
        return;
      }

      const targetHeader: string[] = table.content[0].slice(1).map((h: any) => String(h || ''));
      const newRow = FavoritesManager.mapRowToTable(fav, targetHeader);

      try {
        await deps.appendRowInstantly(uid, newRow);
        console.log('[DICE]FavoritesManager 发送成功，已写入数据库');
      } catch (err) {
        console.error('[DICE]FavoritesManager 写入数据库失败:', err);
        showActionableErrorToast('写入数据库失败: ' + (err.message || err), {
          title: '写入收藏失败',
          suggestion: 'save',
          developerHint: true,
        });
        return;
      }

      // 提示未匹配列
      if (mode === 'loose') {
        const unmatchedCount = fav.header.filter(h => !targetHeader.includes(h)).length;
        if (unmatchedCount > 0) {
          toastr.info(`${unmatchedCount}列未匹配，已填充空值`);
        }
      }

      closeModal();
      onSuccess();
    });
  };
  return showSendToTableModal;
}
