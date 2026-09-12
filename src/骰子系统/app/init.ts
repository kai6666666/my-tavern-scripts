// @ts-nocheck
/**
 * init.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { ConsoleCaptureManager } from '../features/console/console-capture-manager';
import { DICE_ROOT_SELECTOR } from '../shared/constants';
import { setDatabaseToastMute } from '../shared/database-toast-mute';
export function createInit(deps: any) {
  const init = () => {
    if (deps.getIsInitialized()) return;

    // 清理旧的LockManager锁定数据 (已迁移到数据库API)
    (() => {
      const prefix = 'acu_locked_fields_v2_';
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      if (keysToRemove.length > 0) {
        console.info(`[DICE] 已清理 ${keysToRemove.length} 个旧锁定数据键`);
      }
    })();

    console.log('[DICE]开始初始化骰子系统...');

    // 恢复 ConsoleCaptureManager 状态（从 localStorage）
    try {
      ConsoleCaptureManager.restore();
      console.info('[DICE]ConsoleCaptureManager 状态已恢复');
    } catch (e) {
      console.error('[DICE]恢复 ConsoleCaptureManager 状态失败:', e);
    }

    // 检查并恢复错误状态（在初始化时）
    try {
      deps.ErrorHandler.checkAndRestore();
      console.info('[DICE]错误状态检查完成');
    } catch (e) {
      console.error('[DICE]初始化时检查错误状态失败:', e);
    }

    // 冲突检测：在初始化前检查是否有可视化前端
    if (deps.detectVisualizerConflict()) {
      deps.showConflictDialog();
      console.error('[DICE]骰子系统 检测到可视化前端冲突，已阻止初始化');
      return; // 阻止初始化
    }

    console.info('[DICE]注入 MVU 样式和自定义样式...');
    deps.MvuModule.injectStyles();

    // 清理旧的 Observer（防止重复监听）
    if (deps.getObserver()) {
      deps.getObserver().disconnect();
      deps.setObserver(null);
      console.info('[DICE]清理旧的 MutationObserver');
    }
    deps.addStyles();
    deps.bindAcuDiceGachaRegexActions();
    const initCfg = deps.getConfig();
    setDatabaseToastMute(initCfg.muteDatabaseToasts === true);
    // 2. 保留原有的 SillyTavern 事件监听（使用具名函数防止重复注册）
    if (window.SillyTavern && window.SillyTavern.eventSource) {
      console.info('[DICE]注册 SillyTavern 事件监听器...');
      const events = window.SillyTavern.eventTypes;
      const source = window.SillyTavern.eventSource;
      const triggers = [events.CHAT_CHANGED, events.MESSAGE_SWIPED, events.MESSAGE_DELETED, events.MESSAGE_UPDATED];

      // 确保只创建一次处理函数
      if (!deps.get_boundRenderHandler()) {
        deps.set_boundRenderHandler(() => {
          if (!deps.getIsEditingOrder()) {
            console.info('[DICE]消息更新事件触发，延迟渲染界面');
            setTimeout(deps.renderInterface, 500);
          } else {
            console.info('[DICE]正在编辑顺序，跳过界面渲染');
          }
        });
      }
      if (!deps.get_boundReviewBaselineHandler()) {
        deps.set_boundReviewBaselineHandler(() => {
          deps.saveCurrentDatabaseSnapshotAsReviewBaseline('message_sent');
        });
      }

      // 确保只创建一次聊天切换处理函数（移到模块级防止重复注册）
      if (!window._acuBoundChatChangeHandler) {
        window._acuBoundChatChangeHandler = () => {
          console.info('[DICE]聊天切换事件触发，清理缓存并重新渲染');
          deps.setCachedRawData(null);
          deps.setTablePageStates({});
          deps.setTableSearchStates({});
          deps.setTableScrollStates({});
          deps.setHasUnsavedChanges(false);
          deps.getCurrentDiffMap().clear();
          if (window.acuModifiedSet) window.acuModifiedSet.clear();
          // 清除变量面板缓存，避免不同聊天间模式/数据串线
          try {
            if (typeof deps.MvuModule?.clearCache === 'function') {
              deps.MvuModule.clearCache();
            }
          } catch (e) {
            console.warn('[DICE]清除变量面板缓存失败:', e);
          }
          setTimeout(deps.renderInterface, 500);
          deps.scheduleDialogueIndentRender();
          deps.scheduleCharacterDiceProfileDetection(900);
        };
      }
      const _boundChatChangeHandler = window._acuBoundChatChangeHandler;
      if (!window._acuBoundDialogueIndentHandler) {
        window._acuBoundDialogueIndentHandler = () => {
          deps.scheduleDialogueIndentRender();
        };
      }
      const _boundDialogueIndentHandler = window._acuBoundDialogueIndentHandler;

      triggers.forEach(evt => {
        if (evt) {
          source.removeListener(evt, deps.get_boundRenderHandler());
          source.removeListener(evt, _boundChatChangeHandler); // 防止重复注册
          if (evt === events.CHAT_CHANGED) {
            source.on(evt, _boundChatChangeHandler);
          } else {
            source.on(evt, deps.get_boundRenderHandler());
          }
        }
      });
      if (events.MESSAGE_SENT) {
        source.removeListener(events.MESSAGE_SENT, deps.get_boundReviewBaselineHandler());
        source.on(events.MESSAGE_SENT, deps.get_boundReviewBaselineHandler());
      }
      [
        events.CHAT_CHANGED,
        events.MESSAGE_RECEIVED,
        events.GENERATION_ENDED,
        events.CHARACTER_MESSAGE_RENDERED,
        events.MESSAGE_UPDATED,
        events.MESSAGE_SWIPED,
      ].forEach(evt => {
        if (!evt) return;
        source.removeListener(evt, _boundDialogueIndentHandler);
        source.on(evt, _boundDialogueIndentHandler);
      });
      deps.scheduleDialogueIndentRender();
      console.info(`[DICE]已注册 ${triggers.length} 个事件监听器`);
    } else {
      console.warn('[DICE]SillyTavern 事件源不可用，跳过事件监听器注册');
    }

    // 3. 轮询等待数据库 API 就绪
    const loop = () => {
      const api = deps.getCore().getDB();
      if (api?.updateCell && api?.insertRow && api?.deleteRow && deps.hasRuntimeTableReadApi(api)) {
        deps.setIsInitialized(true);
        console.log('[DICE]骰子系统初始化成功');
        console.info('[DICE]数据库 API 已就绪');

        // --- [Fix] 移动到这里：确保 API 就绪且 #chat 存在后再启动监听 (带节流优化) ---
        const $chat = $('#chat');
        if ($chat.length && !deps.getObserver()) {
          console.info('[DICE]启动聊天区域 MutationObserver');
          let mutationLock = false;
          const handleMutation = () => {
            if (mutationLock) return;
            mutationLock = true;
            requestAnimationFrame(() => {
              const config = deps.getConfig();
              if (
                config.positionMode === 'embedded' ||
                config.positionMode === 'viewport' ||
                deps.isFloatingCollapseActive(config)
              ) {
                mutationLock = false;
                return;
              }

              const children = $chat.children();
              const lastChild = children.last()[0];
              const wrapper = $(DICE_ROOT_SELECTOR)[0];

              if (wrapper && lastChild && lastChild !== wrapper) {
                if ($(lastChild).hasClass('mes') || $(lastChild).hasClass('message-body')) {
                  $chat.append(wrapper);
                }
              }

              // [新增] 检测到新消息时，应用投骰结果隐藏逻辑（消除闪烁）
              const diceCfg = deps.getDiceConfig();
              if (diceCfg && diceCfg.hideDiceResultInChat) {
                // 步骤1：立即对新消息应用遮罩样式，避免闪烁
                const children = $chat.children();
                const lastChild = children.last();
                if (lastChild.hasClass('mes') || lastChild.hasClass('message-body')) {
                  lastChild.addClass('acu-dice-result-revealing');
                }

                // 步骤2：使用RAF在下一帧快速执行隐藏逻辑
                requestAnimationFrame(() => {
                  deps.hideDiceResultsInUserMessages();

                  // 步骤3：隐藏完成后移除遮罩，触发揭示动画
                  requestAnimationFrame(() => {
                    lastChild.removeClass('acu-dice-result-revealing').addClass('acu-dice-result-revealed');
                    // 动画结束后清理类名
                    setTimeout(() => {
                      lastChild.removeClass('acu-dice-result-revealed');
                    }, 200);
                  });
                });
              }

              mutationLock = false;
            });
          };
          deps.setObserver(new MutationObserver(handleMutation));
          deps.getObserver().observe($chat[0], { childList: true });
        } else if (!$chat.length) {
          console.warn('[DICE]聊天区域 (#chat) 未找到，跳过 MutationObserver 设置');
        }
        // --------------------------------------------------

        console.info('[DICE]执行首次界面渲染...');
        deps.renderInterface(); // 首次渲染
        deps.getTutorialModule().maybeStart('core');
        // [新增] 初始化时处理已存在的消息中的投骰结果
        setTimeout(() => {
          deps.hideDiceResultsInUserMessages();
        }, 500);
        // 注册回调
        if (api.registerTableUpdateCallback) {
          api.registerTableUpdateCallback(deps.UpdateController.handleUpdate);
          console.info('[DICE]已注册表格更新回调');

          // 恢复快照功能
          if (api.registerTableFillStartCallback) {
            api.registerTableFillStartCallback(() => {
              deps.saveCurrentDatabaseSnapshotAsReviewBaseline('table_fill_start');
            });
            console.info('[DICE]已注册表格填充开始回调');
          }
        } else {
          console.warn('[DICE]数据库 API 不支持回调注册');
        }
      } else {
        // 限制重试次数，防止无限循环 (约 60秒后放弃)
        if (!deps.getIsInitialized()) {
          window._acuInitRetries = (window._acuInitRetries || 0) + 1;
          if (window._acuInitRetries < 60) {
            if (window._acuInitRetries % 10 === 0) {
              console.info(`[DICE]等待数据库 API 就绪... (${window._acuInitRetries}/60)`);
            }
            setTimeout(loop, 1000);
          } else {
            console.error('[DICE]未检测到数据库后端 API，停止轮询。请确保已安装神·数据库脚本。');
          }
        }
      }
    };
    loop();

    // [新增] 监听用户发送消息 - 隐藏选项面板（选项已过时）
    const setupOptionHideListener = () => {
      const { $ } = deps.getCore();
      const hideOptionPanel = () => {
        deps.setOptionPanelVisible(false);
        $('.acu-option-panel, .acu-embedded-options-container').fadeOut(200, function () {
          $(this).remove();
        });
      };

      const pendingCrazyAppend = new Map<number, { result: string; createdAt: number }>();
      const CRAZY_APPEND_TTL_MS = 12000;
      let lastCrazyPreSendAt = 0;
      // [疯狂模式] MESSAGE_SENT 同步注入的骰点结果，供 GENERATION_AFTER_COMMANDS 合并到 params.prompt
      let pendingCrazySyncResult: string | null = null;

      const normalizeMessageId = (messageId: number | string) => {
        const id = typeof messageId === 'string' ? Number(messageId) : messageId;
        return Number.isFinite(id) ? id : null;
      };

      const hasDiceResultInText = (text: string) => {
        if (!text) return false;
        // 统一使用 <meta:检定结果> 标签格式检测
        const metaRegex = /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/g;
        return metaRegex.test(text);
      };

      const insertDiceIntoUserInputBlock = (text: string, diceResult: string) => {
        if (!text || !diceResult) return '';
        const blockRegex = /(<本轮用户输入>)([\s\S]*?)(<\/本轮用户输入>)/;
        const blockMatch = text.match(blockRegex);
        if (!blockMatch) return '';
        const inner = blockMatch[2];
        if (inner.includes(diceResult)) return '';
        const prefix = inner.startsWith('\n') ? '\n' : '';
        const suffix = inner.endsWith('\n') ? '\n' : '';
        const trimmedInner = inner.trim();
        const newInner = trimmedInner ? `${trimmedInner} ${diceResult}` : diceResult;
        const textWithoutDice = text.includes(diceResult) ? text.replace(diceResult, '').trim() : text;
        return textWithoutDice.replace(blockRegex, `${blockMatch[1]}${prefix}${newInner}${suffix}${blockMatch[3]}`);
      };

      const applyCrazyModeToPrompt = (type: string, params: unknown, dryRun: boolean) => {
        if (dryRun) return;
        const safeParams = params && typeof params === 'object' ? (params as Record<string, unknown>) : {};
        const quietPrompt = typeof safeParams.quiet_prompt === 'string' ? safeParams.quiet_prompt : '';
        const automaticTrigger = safeParams.automatic_trigger === true;
        const alreadyApplied = safeParams._acu_crazy_applied === true;
        if (alreadyApplied || automaticTrigger) return;
        if (type === 'quiet' || quietPrompt.trim().length > 0) return;

        const originalPrompt = typeof safeParams.prompt === 'string' ? safeParams.prompt : '';
        if (!originalPrompt || !originalPrompt.trim()) return;

        // [合并器] 如果 MESSAGE_SENT 已同步注入骰点，确保 params.prompt 也包含
        // 这是关键步骤：数据库可能已读取 lastMessage.mes（含骰点）并重写 params.prompt
        // 此时需确保骰点不会丢失
        if (pendingCrazySyncResult) {
          const storedResult = pendingCrazySyncResult;
          pendingCrazySyncResult = null;
          if (!hasDiceResultInText(originalPrompt)) {
            let finalPrompt = '';
            if (originalPrompt.includes('<本轮用户输入>')) {
              const inserted = insertDiceIntoUserInputBlock(originalPrompt, storedResult);
              finalPrompt =
                inserted && inserted !== originalPrompt ? inserted : `${originalPrompt.trim()} ${storedResult}`.trim();
            } else {
              finalPrompt = `${originalPrompt.trim()} ${storedResult}`.trim();
            }
            safeParams.prompt = finalPrompt;
            safeParams._acu_crazy_applied = true;
            console.info('[DICE]疯狂模式: 已合并骰点到 params.prompt');
          }
          return;
        }

        // 已经有骰点结果，跳过
        if (hasDiceResultInText(originalPrompt)) return;

        // 300ms 防抖（仅用于 triggerCrazyModeBeforeSend 的场景，如发送按钮点击）
        const now = Date.now();
        if (now - lastCrazyPreSendAt < 300) return;

        // 兆底：如果前面的路径都没触发，尝试独立触发
        if (!deps.shouldTriggerCrazyMode()) return;

        const crazyRollResult = deps.generateCrazyRoll();
        if (!crazyRollResult) return;

        let finalPrompt = '';
        if (originalPrompt.includes('<本轮用户输入>')) {
          const inserted = insertDiceIntoUserInputBlock(originalPrompt, crazyRollResult);
          finalPrompt =
            inserted && inserted !== originalPrompt ? inserted : `${originalPrompt.trim()} ${crazyRollResult}`.trim();
        } else {
          finalPrompt = `${originalPrompt.trim()} ${crazyRollResult}`.trim();
        }

        safeParams.prompt = finalPrompt;
        safeParams._acu_crazy_applied = true;
        lastCrazyPreSendAt = now;
      };

      const triggerCrazyModeBeforeSend = () => {
        const now = Date.now();
        if (now - lastCrazyPreSendAt < 300) return;

        const { $ } = deps.getCore();
        const $ta = $('#send_textarea');
        const content = ($ta.val() || '').toString().trim();
        if (!content) return;
        if (hasDiceResultInText(content)) return;
        if (!deps.shouldTriggerCrazyMode()) return;

        const crazyRollResult = deps.generateCrazyRoll();
        if (!crazyRollResult) return;

        deps.smartInsertToTextarea(crazyRollResult, 'dice');
        lastCrazyPreSendAt = now;
      };

      // [疯狂模式] 在 MESSAGE_SENT 中同步注入骰点到用户消息
      // 确保在 GENERATION_AFTER_COMMANDS 之前完成，使数据库读 lastMessage.mes 时能看到骰点
      const syncInjectCrazyToMessage = (messageId: number | string) => {
        const id = normalizeMessageId(messageId);
        if (id === null) return;

        const stChat = ST?.chat || window.parent?.SillyTavern?.chat;
        if (!stChat) return;

        const msg = stChat[id];
        if (!msg || !msg.is_user) return;

        const text = String(msg.mes || '').trim();
        if (!text) return;
        if (hasDiceResultInText(text)) return;
        if (!deps.shouldTriggerCrazyMode()) return;

        const crazyRollResult = deps.generateCrazyRoll();
        if (!crazyRollResult) return;

        // 同步写入聊天记录
        if (text.includes('<本轮用户输入>')) {
          const inserted = insertDiceIntoUserInputBlock(text, crazyRollResult);
          msg.mes = inserted && inserted !== text ? inserted : `${text} ${crazyRollResult}`.trim();
        } else {
          msg.mes = `${text} ${crazyRollResult}`.trim();
        }

        // 存储结果供 GENERATION_AFTER_COMMANDS 合并到 params.prompt
        pendingCrazySyncResult = crazyRollResult;
        lastCrazyPreSendAt = Date.now();
        console.info('[DICE]疯狂模式: 已同步注入到用户消息', id);
      };
      const queueCrazyAppend = (messageId: number | string) => {
        const id = normalizeMessageId(messageId);
        if (id === null) return;
        if (!deps.shouldTriggerCrazyMode()) return;

        const crazyRollResult = deps.generateCrazyRoll();
        if (!crazyRollResult) return;

        pendingCrazyAppend.set(id, { result: crazyRollResult, createdAt: Date.now() });
        void applyCrazyAppend(id);
      };

      const applyCrazyAppend = async (messageId: number | string) => {
        const id = normalizeMessageId(messageId);
        if (id === null) return;

        const pending = pendingCrazyAppend.get(id);
        if (!pending) return;

        if (Date.now() - pending.createdAt > CRAZY_APPEND_TTL_MS) {
          pendingCrazyAppend.delete(id);
          return;
        }

        pendingCrazyAppend.delete(id);
        let newMessage = '';

        try {
          await enqueueMessageMutation(id, async () => {
            const stChat = ST?.chat || window.parent?.SillyTavern?.chat;
            const stMsg = stChat && typeof id === 'number' ? stChat[id] : null;
            const msg = getChatMessages(id)[0];
            if (!msg || msg.role !== 'user') {
              if (!stMsg || !stMsg.is_user) {
                return;
              }
            }

            const originalText = String(stMsg?.mes ?? msg?.message ?? '');
            if (hasDiceResultInText(originalText)) {
              return;
            }

            const extraObj: Record<string, unknown> =
              msg?.extra && typeof msg.extra === 'object' ? (msg.extra as Record<string, unknown>) : {};
            if (extraObj.acuCrazyModeApplied === true) {
              return;
            }

            if (originalText.includes('<本轮用户输入>')) {
              const inserted = insertDiceIntoUserInputBlock(originalText, pending.result);
              newMessage =
                inserted && inserted !== originalText ? inserted : `${originalText} ${pending.result}`.trim();
            } else {
              newMessage = originalText ? `${originalText} ${pending.result}` : pending.result;
            }

            if (stMsg && stMsg.is_user) {
              stMsg.mes = newMessage;
            }

            await setChatMessages(
              [{ message_id: id, message: newMessage, extra: { ...extraObj, acuCrazyModeApplied: true } }],
              { refresh: 'affected' },
            );
          });
        } catch (e) {
          console.warn('[DICE]疯狂模式: 附加骰子结果失败', e);
        }

        const { $ } = deps.getCore();
        const $ta = $('#send_textarea');
        if ($ta.length && newMessage) {
          const currentVal = ($ta.val() || '').toString();
          if (currentVal === newMessage) {
            deps.setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, '');
          }
        }
      };

      // [修复] 在发送按钮点击时恢复真实结果
      const setupSendButtonListener = () => {
        // [新增] 拦截输入框的 value 属性，确保读取时自动替换占位符
        deps.interceptTextareaValue();
        deps.bindHumanInputTracking();
        deps.ensureGachaHeartbeat();

        // [修复] 使用捕获阶段拦截，确保在发送逻辑之前执行
        const sendButton = document.getElementById('send_but');
        if (sendButton) {
          const onSendCapture = () => {
            const $ta = $('#send_textarea');
            if ($ta.length) {
              const textarea = $ta[0] as AcuDiceTextareaElement;
              deps.capturePendingHumanInputSnapshot($ta.val(), textarea._acuOriginalActionText);
            }
            // 在捕获阶段提前注入疯狂模式
            triggerCrazyModeBeforeSend();
            // 在捕获阶段立即恢复真实结果
            deps.restoreDiceResultBeforeSend();
          };
          sendButton.addEventListener('click', onSendCapture, true);
          sendButton.addEventListener('pointerup', onSendCapture, true);
          sendButton.addEventListener('touchend', onSendCapture, true);
        }

        // 监听发送按钮点击（jQuery方式作为备用）
        $(document)
          .off('click.acu_restore_dice', '#send_but')
          .on('click.acu_restore_dice', '#send_but', function (e) {
            const $ta = $('#send_textarea');
            if ($ta.length) {
              const textarea = $ta[0] as AcuDiceTextareaElement;
              deps.capturePendingHumanInputSnapshot($ta.val(), textarea._acuOriginalActionText);
            }
            // 在事件冒泡前注入疯狂模式
            triggerCrazyModeBeforeSend();
            // 在事件冒泡前恢复真实结果
            deps.restoreDiceResultBeforeSend();
          });

        $(document)
          .off('keydown.acu_restore_dice', '#send_textarea')
          .on('keydown.acu_restore_dice', '#send_textarea', function (e) {
            if (e.isComposing) return;
            if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
            const textarea = this as AcuDiceTextareaElement;
            deps.capturePendingHumanInputSnapshot(textarea.value, textarea._acuOriginalActionText);
            triggerCrazyModeBeforeSend();
            deps.restoreDiceResultBeforeSend();
          });

        // [新增] 监听输入框的创建/替换，重新拦截新的输入框
        const _acuSendObserver = new MutationObserver(() => {
          const $ta = $('#send_textarea');
          if ($ta.length && !$ta[0]._acuValueIntercepted) {
            deps.interceptTextareaValue();
          }
          if ($ta.length) deps.bindHumanInputTracking();
        });
        _acuSendObserver.observe(document.body, { childList: true, subtree: true });
      };

      const installCrazyGenerateHook = () => {
        const rootWindow = window as Window & {
          __acuCrazyGenerateHookInstalled?: boolean;
          __acuCrazyGenerateOriginal?: (...args: unknown[]) => unknown;
        };
        if (rootWindow.__acuCrazyGenerateHookInstalled) return;
        if (!rootWindow.TavernHelper || typeof rootWindow.TavernHelper.generate !== 'function') return;

        rootWindow.__acuCrazyGenerateOriginal = rootWindow.TavernHelper.generate;
        rootWindow.TavernHelper.generate = async function (...args: unknown[]) {
          const options =
            args.length > 0 && args[0] && typeof args[0] === 'object' ? (args[0] as Record<string, unknown>) : null;

          if (options) {
            const quietPrompt = typeof options.quiet_prompt === 'string' ? options.quiet_prompt : '';
            const automaticTrigger = options.automatic_trigger === true;
            const alreadyApplied = options._acu_crazy_applied === true;
            if (!alreadyApplied && !automaticTrigger && quietPrompt.trim().length === 0) {
              let originalPrompt = '';
              const injects = options.injects;
              if (Array.isArray(injects) && injects.length > 0) {
                const first = injects[0];
                if (first && typeof first === 'object') {
                  const content = (first as Record<string, unknown>).content;
                  if (typeof content === 'string') originalPrompt = content;
                }
              }
              if (!originalPrompt && typeof options.prompt === 'string') {
                originalPrompt = options.prompt;
              }
              if (!originalPrompt && typeof options.user_input === 'string') {
                originalPrompt = options.user_input;
              }

              if (originalPrompt && !hasDiceResultInText(originalPrompt) && deps.shouldTriggerCrazyMode()) {
                const crazyRollResult = deps.generateCrazyRoll();
                if (crazyRollResult) {
                  const mergedPrompt = `${originalPrompt.trim()} ${crazyRollResult}`.trim();
                  if (Array.isArray(injects) && injects.length > 0) {
                    const first = injects[0];
                    if (first && typeof first === 'object') {
                      (first as Record<string, unknown>).content = mergedPrompt;
                    }
                  } else if (typeof options.prompt === 'string') {
                    options.prompt = mergedPrompt;
                  } else {
                    options.user_input = mergedPrompt;
                  }
                  options._acu_crazy_applied = true;
                  lastCrazyPreSendAt = Date.now();
                  console.info('[DICE]疯狂模式: 已注入到生成请求');
                }
              }
            }
          }

          return (rootWindow.__acuCrazyGenerateOriginal as (...args: unknown[]) => unknown).apply(this, args);
        };
        rootWindow.__acuCrazyGenerateHookInstalled = true;
      };

      // [优化] 统一事件注册逻辑 (优先 ST 原生 -> 降级到全局)
      const ST = window.SillyTavern || window.parent?.SillyTavern;
      // 获取事件名，兼容不同版本
      const evtName =
        ST?.eventTypes?.MESSAGE_SENT || (window.tavern_events ? window.tavern_events.MESSAGE_SENT : 'message_sent');

      // 1. 优先使用 ST.eventSource (官方标准)
      if (ST?.eventSource) {
        ST.eventSource.on(evtName, hideOptionPanel);
        // [新增] 同时监听消息发送事件，应用投骰结果隐藏
        ST.eventSource.on(evtName, async messageId => {
          // 同步注入疯狂模式到用户消息（确保在 GENERATION_AFTER_COMMANDS 之前完成）
          syncInjectCrazyToMessage(messageId);

          void deps.settleGachaFortuneForMessage(messageId);
          try {
            // [新增] 执行待处理的检定后果
            await processPendingEffectRuns(messageId);
          } catch (error) {
            console.warn('[DICE][GACHA] MESSAGE_SENT 后果执行异常，骰运结算仍会继续:', error);
          } finally {
            void deps.settleGachaFortuneForMessage(messageId);
          }

          // 延迟执行，确保消息已渲染到DOM
          const diceCfg = deps.getDiceConfig();
          if (diceCfg && diceCfg.hideDiceResultInChat) {
            setTimeout(() => {
              deps.hideDiceResultsInUserMessages();
            }, 300);
          }
        });

        // [新增] 在 GENERATION_AFTER_COMMANDS 中注入（影响剧情推进接收内容）
        const afterCommandsEvtName =
          ST?.eventTypes?.GENERATION_AFTER_COMMANDS ||
          (window.tavern_events ? window.tavern_events.GENERATION_AFTER_COMMANDS : 'GENERATION_AFTER_COMMANDS');
        if (afterCommandsEvtName) {
          ST.eventSource.on(afterCommandsEvtName, (type, params, dryRun) => {
            applyCrazyModeToPrompt(type, params, dryRun);
          });
        }

        installCrazyGenerateHook();
        setupSendButtonListener();
        return;
      }

      // 2. 降级尝试全局 eventOn (TavernHelper 或旧版环境)
      if (typeof window.eventOn === 'function') {
        window.eventOn(evtName, hideOptionPanel);
        // [新增] 同时监听消息发送事件，应用投骰结果隐藏
        window.eventOn(evtName, async messageId => {
          // 同步注入疯狂模式到用户消息（确保在 GENERATION_AFTER_COMMANDS 之前完成）
          syncInjectCrazyToMessage(messageId);

          void deps.settleGachaFortuneForMessage(messageId);
          try {
            // [新增] 执行待处理的检定后果
            await processPendingEffectRuns(messageId);
          } catch (error) {
            console.warn('[DICE][GACHA] MESSAGE_SENT 后果执行异常，骰运结算仍会继续:', error);
          } finally {
            void deps.settleGachaFortuneForMessage(messageId);
          }

          // 延迟执行，确保消息已渲染到DOM
          const diceCfg = deps.getDiceConfig();
          if (diceCfg && diceCfg.hideDiceResultInChat) {
            setTimeout(() => {
              deps.hideDiceResultsInUserMessages();
            }, 300);
          }
        });

        // [新增] 在 GENERATION_AFTER_COMMANDS 中注入（影响剧情推进接收内容）
        const afterCommandsEvtName = window.tavern_events
          ? window.tavern_events.GENERATION_AFTER_COMMANDS
          : 'GENERATION_AFTER_COMMANDS';
        window.eventOn(afterCommandsEvtName, (type, params, dryRun) => {
          applyCrazyModeToPrompt(type, params, dryRun);
        });

        installCrazyGenerateHook();
        setupSendButtonListener();
        return;
      }
    };

    // 延迟执行，确保酒馆助手已加载
    setTimeout(setupOptionHideListener, 2000);

    // [新增] 立即尝试拦截输入框（如果已经存在）
    setTimeout(() => {
      deps.interceptTextareaValue();
      deps.bindHumanInputTracking();
      deps.ensureGachaHeartbeat();
    }, 500);

    deps.scheduleCharacterDiceProfileDetection(1500);

    // [新增] 监听ERA变量更新，自动刷新变量面板
    const eventOn = window.eventOn || window.parent?.eventOn;
    if (typeof eventOn === 'function') {
      eventOn('era:writeDone', detail => {
        // 清除 ERA 缓存
        if (typeof deps.MvuModule === 'object' && typeof deps.MvuModule.clearCache === 'function') {
          deps.MvuModule.clearCache();
        }

        // 如果当前检测到的是ERA数据，自动刷新面板
        const mode = deps.MvuModule.detectMode();
        if (mode === 'era' && deps.getActiveTabState() === deps.MvuModule.MODULE_ID) {
          console.log('[DICE]ERA变量已更新，自动刷新面板');
          deps.renderInterface();
        }
      });
    } else {
      console.warn('[DICE]无法监听 ERA 事件，eventOn 不可用');
    }

    // [新增] 页面卸载时清理资源
    $(window)
      .off('beforeunload.acu pagehide.acu')
      .on('beforeunload.acu pagehide.acu', () => {
        try {
          void deps.flushGachaHeartbeatProgress(true);
          if (deps.getGachaHeartbeatTimer()) {
            clearInterval(deps.getGachaHeartbeatTimer());
            deps.setGachaHeartbeatTimer(null);
          }
          if (deps.getGachaShopUiRefreshTimer()) {
            clearInterval(deps.getGachaShopUiRefreshTimer());
            deps.setGachaShopUiRefreshTimer(null);
          }
          // 取消所有挂起的异步请求
          abortAllPendingRequests();
          const timer = (window as Record<string, unknown>).__acuEffectRunCleanerTimer;
          if (typeof timer === 'number') {
            window.clearInterval(timer);
            delete (window as Record<string, unknown>).__acuEffectRunCleanerTimer;
          }
          localStorage.setItem(deps.STORAGE_KEY_SCROLL, JSON.stringify(deps.getTableScrollStates()));
          if (deps.getObserver()) {
            deps.getObserver().disconnect();
            deps.setObserver(null);
          }
        } catch (e) {
          console.warn('[DICE]页面卸载清理出错:', e);
        }
      });
  };
  return init;
}
