// @ts-nocheck
/**
 * hide-dice-results.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHideDiceResultsInUserMessages(deps: any) {
  const hideDiceResultsInUserMessages = () => {
    try {
      const diceCfg = deps.getDiceConfig();
      const hideInput = diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const hideChat = diceCfg.hideDiceResultInChat !== undefined ? diceCfg.hideDiceResultInChat : false;

      // 统一检定结果标签正则（匹配 <meta:检定结果>...</meta:检定结果>）
      const metaCheckResultRegex = /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;

      // ========== 第一部分：处理输入栏（由 hideInput 控制） ==========
      try {
        const $ta = $('#send_textarea');
        if ($ta.length) {
          const textarea = $ta[0] as AcuDiceTextareaElement;
          const visibleTextareaVal = deps.readTextareaVisibleValue(textarea);
          let textareaVal = deps.syncTextareaDiceCacheFromVisibleText(textarea, visibleTextareaVal);
          let modifiedText = textareaVal;

          if (hideInput) {
            // 隐藏模式：替换为占位符
            if (metaCheckResultRegex.test(modifiedText)) {
              deps.storeTextareaDiceCache(textarea, modifiedText);
              modifiedText = modifiedText.replace(deps.createMetaCheckResultRegex(), deps.DICE_RESULT_PLACEHOLDER);
            }
          } else {
            // 显示模式：如果有保存的原始文本，恢复它
            if (visibleTextareaVal.includes(deps.DICE_RESULT_PLACEHOLDER)) {
              modifiedText = textareaVal;
              deps.clearTextareaDiceCache(textarea);
            }
          }

          if (modifiedText !== visibleTextareaVal) {
            deps.setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, modifiedText);
          }
        }
      } catch (e) {
        console.warn('[DICE]ACU 处理输入栏投骰结果失败:', e);
      }

      // ========== 第二部分：处理聊天记录（由 hideChat 控制，独立于输入栏） ==========
      // 先检查聊天是否已加载，避免在首次启动时显示不必要的错误
      let lastMessageId;
      try {
        lastMessageId = getLastMessageId();
      } catch (e) {
        // 如果获取 lastMessageId 失败，说明聊天未加载，静默返回
        return;
      }

      // 如果聊天未加载或没有消息，直接返回，不显示错误
      if (lastMessageId < 0) {
        return;
      }

      try {
        const userMessages = getChatMessages(`0-${lastMessageId}`, { role: 'user' });
        // 如果没有用户消息，直接返回
        if (!userMessages || userMessages.length === 0) {
          return;
        }

        if (hideChat) {
          // 隐藏模式：处理已存在的消息
          let hiddenCount = 0;
          userMessages.forEach(msg => {
            try {
              const getMessageElement = (messageId: number | string) => {
                if (typeof retrieveDisplayedMessage === 'function') {
                  try {
                    const $el = retrieveDisplayedMessage(messageId);
                    if ($el && $el.length) return $el;
                  } catch (e) {
                    // fallback to DOM selector
                  }
                }
                const idText = String(messageId);
                const $chat = $('#chat');
                if (!$chat.length) return $();
                const $byMesId = $chat.find(
                  `.mes[mesid="${idText}"], .mes[data-message-id="${idText}"], .mes#mes_${idText}, .message-body[data-message-id="${idText}"]`,
                );
                return $byMesId.first();
              };

              const $msgElement = getMessageElement(msg.message_id);
              if (!$msgElement || !$msgElement.length) {
                return;
              }

              // 尝试多种可能的选择器
              let $mesText = $msgElement.find('.mes_text');
              if (!$mesText || !$mesText.length) {
                // 尝试其他可能的选择器
                $mesText = $msgElement.find('.message-text, .text, [class*="text"], [class*="message"]').first();
                if (!$mesText || !$mesText.length) {
                  // 如果都找不到，直接使用消息元素本身
                  $mesText = $msgElement;
                }
              }

              // 获取当前DOM显示的文本
              const currentDomText = $mesText.text();
              // 如果已经是占位符，跳过
              if (currentDomText.includes('[投骰结果已隐藏]')) {
                return;
              }

              // 使用消息数据中的原始文本作为源进行匹配（这是发送给AI的完整文本）
              const originalText = msg.message || '';
              if (!originalText) {
                return;
              }

              // 优先在HTML中直接替换，避免依赖消息数据
              const currentHtml = $mesText.html() || '';
              let modifiedHtml = currentHtml;

              // 使用统一的 <meta:检定结果> 标签正则（需要转义HTML实体）
              // 注意：HTML中可能已经被转义，所以匹配时需要考虑两种情况
              modifiedHtml = modifiedHtml.replace(
                /(&lt;|<)meta:检定结果(&gt;|>)[\s\S]*?(&lt;|<)\/meta:检定结果(&gt;|>)/g,
                '[投骰结果已隐藏]',
              );
              if (modifiedHtml === currentHtml) {
                modifiedHtml = modifiedHtml.replace(/<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g, '[投骰结果已隐藏]');
              }

              if (modifiedHtml !== currentHtml) {
                $mesText.html(modifiedHtml);
                hiddenCount++;
                return;
              }

              // HTML 未命中时，回退到文本替换（可能是纯文本渲染）
              const metaRegex = /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;
              const replacedText = currentDomText.replace(metaRegex, '[投骰结果已隐藏]');
              if (replacedText !== currentDomText) {
                $mesText.text(replacedText);
                hiddenCount++;
                return;
              }

              // DOM 中没有标签时，根据原始消息内容强制替换并重新渲染
              const replacedFromOriginal = originalText.replace(metaRegex, '[投骰结果已隐藏]');
              if (replacedFromOriginal !== originalText && replacedFromOriginal !== currentDomText) {
                if (typeof formatAsDisplayedMessage === 'function') {
                  $mesText.html(formatAsDisplayedMessage(replacedFromOriginal));
                } else {
                  $mesText.text(replacedFromOriginal);
                }
                hiddenCount++;
              }
            } catch (e) {
              console.warn(`[DICE]ACU 隐藏第 ${msg.message_id} 楼投骰结果失败:`, e);
            }
          });
          if (hiddenCount === 0) {
            const $chat = $('#chat');
            if ($chat.length) {
              $chat.find('.mes, .message-body').each((_, elem) => {
                const $elem = $(elem);
                const $target = $elem.find('.mes_text').length ? $elem.find('.mes_text') : $elem;
                const html = $target.html() || '';
                let replaced = html.replace(
                  /(&lt;|<)meta:检定结果(&gt;|>)[\s\S]*?(&lt;|<)\/meta:检定结果(&gt;|>)/g,
                  '[投骰结果已隐藏]',
                );
                if (replaced === html) {
                  replaced = html.replace(/<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g, '[投骰结果已隐藏]');
                }
                if (replaced !== html) {
                  $target.html(replaced);
                  hiddenCount++;
                }
              });
            }
          }
          if (hiddenCount > 0) {
            console.info(`[DICE]已隐藏 ${hiddenCount} 条消息的投骰结果`);
          }
        } else {
          // 显示模式：恢复已隐藏的消息
          let restoredCount = 0;
          userMessages.forEach(msg => {
            try {
              const getMessageElement = (messageId: number | string) => {
                if (typeof retrieveDisplayedMessage === 'function') {
                  try {
                    const $el = retrieveDisplayedMessage(messageId);
                    if ($el && $el.length) return $el;
                  } catch (e) {
                    // fallback to DOM selector
                  }
                }
                const idText = String(messageId);
                const $chat = $('#chat');
                if (!$chat.length) return $();
                const $byMesId = $chat.find(
                  `.mes[mesid="${idText}"], .mes[data-message-id="${idText}"], .mes#mes_${idText}, .message-body[data-message-id="${idText}"]`,
                );
                return $byMesId.first();
              };

              const $msgElement = getMessageElement(msg.message_id);
              if (!$msgElement || !$msgElement.length) return;

              const $mesText = $msgElement.find('.mes_text');
              if (!$mesText || !$mesText.length) return;

              // 如果显示的是占位符，从消息数据恢复原始文本
              const currentText = $mesText.text();
              if (currentText.includes('[投骰结果已隐藏]')) {
                // 从消息数据获取原始文本
                const originalText = msg.message || '';
                if (originalText) {
                  $mesText.text(originalText);
                  restoredCount++;
                }
              }
            } catch (e) {
              // 单个消息恢复失败，静默处理
            }
          });
          if (restoredCount > 0) {
            console.info(`[DICE]已恢复 ${restoredCount} 条消息的投骰结果`);
          }
        }
      } catch (e) {
        // 首次启动时聊天可能未完全加载，静默处理所有错误
        // 避免在控制台显示不必要的警告信息
        if (hideChat) {
          console.warn('[DICE]ACU 处理聊天记录投骰结果失败:', e);
        }
      }
    } catch (e) {
      // [修复] 最外层错误处理，静默处理配置获取失败等错误
      // 避免在未启用隐藏功能时显示错误
      const diceCfg = deps.getDiceConfig();
      if (diceCfg && (diceCfg.hideDiceResultFromUser || diceCfg.hideDiceResultInChat)) {
        console.warn('[DICE]ACU 隐藏投骰结果失败:', e);
      }
    }
  };
  return hideDiceResultsInUserMessages;
}
