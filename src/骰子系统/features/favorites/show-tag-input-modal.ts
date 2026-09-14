// @ts-nocheck
/**
 * show-tag-input-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowTagInputModal(deps: any) {
  const showTagInputModal = (): Promise<string | null> => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();

    return new Promise(resolve => {
      $('.acu-fav-tag-overlay').remove();

      const overlayHtml = `
        <div class="acu-fav-tag-overlay acu-theme-${config.theme}">
          <div class="acu-fav-tag-modal">
            <div class="acu-fav-tag-modal-header">
              <h4><i class="fa-solid fa-tags"></i> 添加标签</h4>
              <button class="acu-fav-tag-close"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="acu-fav-tag-modal-body">
              <div class="acu-fav-tag-input-section">
                <label>标签（多个标签用逗号分隔，留空则无标签）</label>
                <input type="text" id="acu-fav-tag-input" placeholder="例如：武器, 稀有, 攻击" />
              </div>
            </div>
            <div class="acu-fav-tag-modal-footer">
              <button class="acu-fav-tag-cancel">取消</button>
              <button class="acu-fav-tag-confirm">确认收藏</button>
            </div>
          </div>
        </div>
      `;

      $('body').append(overlayHtml);

      const $overlay = $('.acu-fav-tag-overlay');
      // 内联样式确保移动端层叠上下文正确（与发送到表格弹窗同策略）
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
      const $modal = $overlay.find('.acu-fav-tag-modal');
      const $input = $modal.find('#acu-fav-tag-input');
      let resolved = false;

      const closeModal = (result: string | null) => {
        if (resolved) return;
        resolved = true;
        $overlay.remove();
        resolve(result);
      };

      // 点击遮罩关闭
      $overlay.on('click', e => {
        if ($(e.target).hasClass('acu-fav-tag-overlay')) closeModal(null);
      });

      // 关闭/取消按钮
      $modal.find('.acu-fav-tag-close, .acu-fav-tag-cancel').on('click', () => closeModal(null));

      // 确认按钮
      $modal.find('.acu-fav-tag-confirm').on('click', () => {
        closeModal(($input.val() as string) || '');
      });

      // 回车确认
      $input.on('keydown', (e: JQuery.KeyDownEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          closeModal(($input.val() as string) || '');
        }
      });

      // 自动聚焦输入框
      setTimeout(() => $input.trigger('focus'), 100);
    });
  };
  return showTagInputModal;
}
