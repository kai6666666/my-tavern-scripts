// @ts-nocheck
/**
 * insert-html-to-page.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createInsertHtmlToPage(deps: any) {
  const insertHtmlToPage = html => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();

    // --- 模式分支处理 ---

    // 1. 固定底部模式：挂到 body，避免被 #chat 的滚动上下文带走
    if (config.positionMode === 'viewport') {
      const targetDocument = deps.getTavernHostDocument();
      const wrapper = deps.createElementFromHtml(targetDocument, html);
      if (wrapper) {
        targetDocument.body.appendChild(wrapper);
      } else {
        $(targetDocument.body).append(html);
      }
      return;
    }

    // 2. 嵌入模式 (Embedded)：保持您原版 v19 的复杂逻辑，跟随气泡
    if (config.positionMode === 'embedded') {
      $(DICE_ROOT_SELECTOR).remove(); // 嵌入模式下，为了准确性，先移除旧的

      const getTargetContainer = () => {
        const $allMes = $('#chat .mes');
        const $aiMes = $allMes.filter(function () {
          const $this = $(this);
          if ($this.attr('is_user') === 'true') return false;
          if ($this.attr('is_system') === 'true') return false;
          if ($this.hasClass('sys_mes')) return false;
          const name = $this.find('.name_text').text().trim();
          if (name === 'System') return false;
          if ($this.css('display') === 'none') return false;
          const $textDiv = $this.find('.mes_text');
          if ($textDiv.length === 0) return false;
          const textContent = $textDiv.text().trim();
          const hasImage = $textDiv.find('img').length > 0;
          if (textContent.length === 0 && !hasImage) return false;
          return true;
        });
        // 如果找不到 AI 消息，回退到 chat
        if ($aiMes.length === 0) return $('#chat');

        // 锁定逻辑

        let targetIndex = $aiMes.length - 1;
        const $targetMes = $aiMes.eq(targetIndex);
        const $targetBlock = $targetMes.find('.mes_block');
        return $targetBlock.length ? $targetBlock : $targetMes;
      };

      const $target = getTargetContainer();
      if ($target.length) {
        if ($target.hasClass('mes_block') || $target.hasClass('mes')) {
          if ($target.find(DICE_ROOT_SELECTOR).length === 0) {
            $target.append(html);
          } else {
            $target.find(DICE_ROOT_SELECTOR).replaceWith(html);
          }
        } else {
          // Fallback
          if ($('#chat').find(DICE_ROOT_SELECTOR).length === 0) {
            $target.append(html);
          }
        }
      } else {
        $('body').append(html);
      }
      return;
    }

    // 3. 悬浮底部模式 (Fixed)：【核心修改】完全照搬脚本 B 的稳健逻辑
    // 不再每次都移除，而是“有则替换，无则追加”，防止闪烁
    const $chat = $('#chat');
    const $oldWrapper = $(DICE_ROOT_SELECTOR);

    if ($oldWrapper.length) {
      $oldWrapper.replaceWith(html);
    } else {
      if ($chat.length) {
        $chat.append(html);
      } else {
        $('body').append(html);
      }
    }
  };
  return insertHtmlToPage;
}
