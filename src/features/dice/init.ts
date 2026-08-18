// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=46「[优化后] 新的初始化入口 (Observer 只创建一次)」
// 原行范围：70763-71758（含 banner 70759-71758）；拆分批次 10；外部 closure 依赖：23（getCore/getConfig/getTutorialModule/addStyles/hasRuntimeTableReadApi/getActiveTabState/renderInterface/UpdateController/saveCurrentDatabaseSnapshotAsReviewBaseline/scheduleCharacterDiceProfileDetection/settleGachaFortuneForMessage/ensureGachaHeartbeat/isFloatingCollapseActive@29/30/45 + 共享 let 状态操作回调）
// 接线说明：showActionableErrorToast 来自 ./ui/actionable-error-toast、setDatabaseToastMute 来自 ./ui/database-toast-mute、ConsoleCaptureManager 已拆至 infra/console-capture.ts、
//   ErrorHandler 已拆至 infra/global-error-handler.ts、MvuModule/getDiceConfig/hideDiceResultsInUserMessages 已拆至 engine/mvu-visualizer.ts、
//   DICE_ROOT_SELECTOR 已拆至 engine/constants.ts、bindAcuDiceGachaRegexActions 已拆至 misc/debug-test-functions.ts、
//   scheduleDialogueIndentRender 已拆至 engine/character-name-resolver.ts、shouldTriggerCrazyMode/generateCrazyRoll 已拆至 presets/crazy-mode.ts、
//   setupOverlayClose/smartInsertToTextarea/setTextareaValueAndNotify/interceptTextareaValue/bindHumanInputTracking/capturePendingHumanInputSnapshot/restoreDiceResultBeforeSend 已拆至 favorites/bookmark-manager.ts（均不引用本文件，无循环）直接 import；
//   getCore/getConfig/getTutorialModule/addStyles/hasRuntimeTableReadApi/getActiveTabState/renderInterface/UpdateController/saveCurrentDatabaseSnapshotAsReviewBaseline/scheduleCharacterDiceProfileDetection/settleGachaFortuneForMessage/ensureGachaHeartbeat/isFloatingCollapseActive 定义于 index.ts IIFE 内无法 export，采用运行时注入；
//   共享 let 状态（批次6模式）：observer/gachaHeartbeatTimer/gachaShopUiRefreshTimer/cachedRawData/tablePageStates/tableSearchStates/tableScrollStates/hasUnsavedChanges/currentDiffMap/optionPanelVisible/isEditingOrder
//   仍被 index.ts IIFE 剩余代码直接重赋值/读取，声明保留 IIFE 内、本模块不导出，经注入回调操作：
//   getObserver/setObserver/disconnectObserver（observer）、getIsEditingOrder（isEditingOrder）、setOptionPanelVisible（optionPanelVisible）、
//   resetAcuDiceChatChangeState（cachedRawData/tablePageStates/tableSearchStates/tableScrollStates/hasUnsavedChanges/currentDiffMap 聊天切换重置）、
//   runAcuDiceUnloadCleanup（页面卸载清理：gacha 定时器/observer/tableScrollStates/flushGachaHeartbeatProgress/abortAllPendingRequests/__acuEffectRunCleanerTimer）；
//   _boundRenderHandler/_boundReviewBaselineHandler/isInitialized 仅本模块读写（IIFE 剩余代码无引用），模块内局部 let 经注入初始值即可；
//   正文相应 8 处调用改写（批次10 记录在案，其余逐字一致）。
// 注：init 仍由 index.ts IIFE 收尾段 `$(document).ready(init)` 调度（经 import 绑定解析），window.AcuDice 暴露时序不变。

import { showActionableErrorToast } from './ui/actionable-error-toast';
import { setDatabaseToastMute } from './ui/database-toast-mute';
import { ConsoleCaptureManager } from './infra/console-capture';
import { ErrorHandler } from './infra/global-error-handler';
import { MvuModule, getDiceConfig, hideDiceResultsInUserMessages } from './engine/mvu-visualizer';
import { DICE_ROOT_SELECTOR } from './engine/constants';
import { bindAcuDiceGachaRegexActions } from './misc/debug-test-functions';
import { scheduleDialogueIndentRender } from './engine/character-name-resolver';
import { shouldTriggerCrazyMode, generateCrazyRoll } from './presets/crazy-mode';
import { setupOverlayClose, smartInsertToTextarea, setTextareaValueAndNotify, interceptTextareaValue, bindHumanInputTracking, capturePendingHumanInputSnapshot, restoreDiceResultBeforeSend } from './favorites/bookmark-manager';
import type { AcuDiceTextareaElement } from './favorites/bookmark-manager';

let UpdateController = null;
let _boundRenderHandler = null;
let _boundReviewBaselineHandler = null;
let addStyles = null;
let ensureGachaHeartbeat = null;
let getActiveTabState = null;
let getConfig = null;
let getCore = null;
let getTutorialModule = null;
let hasRuntimeTableReadApi = null;
let isFloatingCollapseActive = null;
let isInitialized = null;
let renderInterface = null;
let saveCurrentDatabaseSnapshotAsReviewBaseline = null;
let scheduleCharacterDiceProfileDetection = null;
let settleGachaFortuneForMessage = null;
let getIsEditingOrder = null;
let getObserver = null;
let setObserver = null;
let disconnectObserver = null;
let setOptionPanelVisible = null;
let resetAcuDiceChatChangeState = null;
let runAcuDiceUnloadCleanup = null;

export function __wireAcuDiceInitDeps(deps) {
  UpdateController = deps.UpdateController;
  _boundRenderHandler = deps._boundRenderHandler;
  _boundReviewBaselineHandler = deps._boundReviewBaselineHandler;
  addStyles = deps.addStyles;
  ensureGachaHeartbeat = deps.ensureGachaHeartbeat;
  getActiveTabState = deps.getActiveTabState;
  getConfig = deps.getConfig;
  getCore = deps.getCore;
  getTutorialModule = deps.getTutorialModule;
  hasRuntimeTableReadApi = deps.hasRuntimeTableReadApi;
  isFloatingCollapseActive = deps.isFloatingCollapseActive;
  isInitialized = deps.isInitialized;
  renderInterface = deps.renderInterface;
  saveCurrentDatabaseSnapshotAsReviewBaseline = deps.saveCurrentDatabaseSnapshotAsReviewBaseline;
  scheduleCharacterDiceProfileDetection = deps.scheduleCharacterDiceProfileDetection;
  settleGachaFortuneForMessage = deps.settleGachaFortuneForMessage;
  getIsEditingOrder = deps.getIsEditingOrder;
  getObserver = deps.getObserver;
  setObserver = deps.setObserver;
  disconnectObserver = deps.disconnectObserver;
  setOptionPanelVisible = deps.setOptionPanelVisible;
  resetAcuDiceChatChangeState = deps.resetAcuDiceChatChangeState;
  runAcuDiceUnloadCleanup = deps.runAcuDiceUnloadCleanup;
}
  // ==========================================
  // [优化后] 新的初始化入口 (Observer 只创建一次)
  // ==========================================
  // 检测可视化前端冲突
  const detectVisualizerConflict = () => {
    const { $ } = getCore();
    if (!$) return false;

    // 检测方法1: 检查是否存在可视化前端创建的 DOM 元素（最可靠）
    // 可视化前端会创建 .acu-wrapper，但骰子系统也会创建，所以需要进一步判断
    const $wrapper = $('.acu-wrapper');
    if ($wrapper.length > 0) {
      // 检查 wrapper 内部是否有可视化前端特有的元素
      // 可视化前端 v12.60 使用 'acu_visualizer_ui_v20_pagination' 作为 SCRIPT_ID
      // 检查是否有可视化前端特有的类名或结构
      const hasVisualizerNav = $wrapper.find('.acu-nav-container').length > 0;
      const hasVisualizerDataDisplay = $wrapper.find('.acu-data-display').length > 0;

      // 如果 wrapper 存在但没有骰子系统的特征元素，可能是可视化前端
      // 或者检查 wrapper 的 data 属性或 id
      const wrapperId = $wrapper.attr('id') || '';
      const wrapperClass = $wrapper.attr('class') || '';

      // 如果检测到可视化前端特有的结构，判定为冲突
      if (hasVisualizerNav && hasVisualizerDataDisplay) {
        // 进一步检查：是否有骰子系统的特征（如骰子按钮等）
        const hasDiceFeatures = $wrapper.find('[id*="dice"], [class*="dice"]').length > 0;
        if (!hasDiceFeatures) {
          return true; // 只有可视化前端的特征，没有骰子系统特征
        }
      }
    }

    // 检测方法2: 检查脚本内容中是否有可视化前端的标识
    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || script.innerHTML || '';
        // 检查可视化前端 v12.60 的特定标识
        if (content.includes('acu_visualizer_ui_v20_pagination') && content.includes('acu_ui_config_v18')) {
          return true;
        }
      }
    } catch (e) {
      // 脚本检查失败，忽略
    }

    // 检测方法3: 检查 localStorage（作为辅助判断）
    // 只有当 localStorage 中有可视化前端配置，且没有骰子系统配置时，才判定为冲突
    try {
      const visualizerConfig = localStorage.getItem('acu_ui_config_v18');
      const diceConfig = localStorage.getItem('acu_ui_config_v19');

      // 如果只有可视化前端的配置，且 DOM 中没有骰子系统的元素，判定为冲突
      if (visualizerConfig && !diceConfig) {
        // 再次检查 DOM，确保没有骰子系统的元素
        const hasDiceInDOM = $('[id*="dice"], [class*="dice"]').length > 0;
        if (!hasDiceInDOM) {
          return true;
        }
      }
    } catch (e) {
      // localStorage 访问失败，忽略
    }

    return false;
  };

  // 显示冲突错误对话框
  const showConflictDialog = () => {
    const { $ } = getCore();
    if (!$) return;

    // 移除可能存在的旧对话框
    $('.dice-conflict-dialog-overlay').remove();

    const dialogHtml = `
      <div class="dice-conflict-dialog-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(4px);
        z-index: 31200;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div class="dice-conflict-dialog" style="
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          padding: 30px;
          box-sizing: border-box;
          animation: diceDialogPop 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          <div style="
            text-align: center;
            margin-bottom: 20px;
          ">
            <div style="
              font-size: 48px;
              color: #e74c3c;
              margin-bottom: 15px;
            ">⚠️</div>
            <h2 style="
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 0 0 10px 0;
            ">脚本冲突检测</h2>
            <p style="
              font-size: 16px;
              color: #666;
              line-height: 1.6;
              margin: 0;
            ">检测到"可视化前端"正在运行</p>
          </div>
          <div style="
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          ">
            <p style="
              font-size: 14px;
              color: #856404;
              line-height: 1.6;
              margin: 0;
            ">
              <strong>提示：</strong>骰子系统与可视化前端功能冲突，不能同时启用。<br>
              请在酒馆助手的脚本管理中，<strong>关闭其中一项后刷新酒馆页面</strong>。
            </p>
          </div>
          <div style="
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            <button id="dice-conflict-close" style="
              background: #6c757d;
              color: #fff;
              border: none;
              border-radius: 8px;
              padding: 12px 24px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              transition: all 0.2s;
              min-width: 120px;
            ">我知道了</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes diceDialogPop {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .dice-conflict-dialog button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .dice-conflict-dialog button:active {
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .dice-conflict-dialog {
            padding: 20px !important;
            margin: 10px !important;
            max-width: calc(100% - 20px) !important;
          }
          .dice-conflict-dialog h2 {
            font-size: 20px !important;
          }
          .dice-conflict-dialog p {
            font-size: 14px !important;
          }
        }
      </style>
    `;

    $('body').append(dialogHtml);

    // 绑定关闭事件
    $('#dice-conflict-close').on('click', function () {
      $('.dice-conflict-dialog-overlay').fadeOut(200, function () {
        $(this).remove();
      });
    });

    // 点击背景关闭
    const $conflictOverlay = $('.dice-conflict-dialog-overlay');
    setupOverlayClose($conflictOverlay, 'dice-conflict-dialog-overlay', () => {
      $conflictOverlay.fadeOut(200, function () {
        $(this).remove();
      });
    });

    // 使用 toastr 作为补充提示（如果可用）
    if (window.toastr) {
      showActionableErrorToast('脚本冲突：骰子系统与可视化前端不能同时启用', {
        title: '冲突检测',
        toastrOptions: {
          timeOut: 0,
          extendedTimeOut: 0,
          closeButton: true,
          preventDuplicates: true,
        },
      });
    }
  };

  const init = () => {
    if (isInitialized) return;

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
      ErrorHandler.checkAndRestore();
      console.info('[DICE]错误状态检查完成');
    } catch (e) {
      console.error('[DICE]初始化时检查错误状态失败:', e);
    }

    // 冲突检测：在初始化前检查是否有可视化前端
    if (detectVisualizerConflict()) {
      showConflictDialog();
      console.error('[DICE]骰子系统 检测到可视化前端冲突，已阻止初始化');
      return; // 阻止初始化
    }

    console.info('[DICE]注入 MVU 样式和自定义样式...');
    MvuModule.injectStyles();

    // 清理旧的 Observer（防止重复监听）
    // [拆分说明] observer 为 IIFE 共享 let 状态（ESM import 绑定只读，批次6模式），经注入回调 getObserver/disconnectObserver 操作
    if (getObserver()) {
      disconnectObserver();
      console.info('[DICE]清理旧的 MutationObserver');
    }
    addStyles();
    bindAcuDiceGachaRegexActions();
    const initCfg = getConfig();
    setDatabaseToastMute(initCfg.muteDatabaseToasts === true);
    // 2. 保留原有的 SillyTavern 事件监听（使用具名函数防止重复注册）
    if (window.SillyTavern && window.SillyTavern.eventSource) {
      console.info('[DICE]注册 SillyTavern 事件监听器...');
      const events = window.SillyTavern.eventTypes;
      const source = window.SillyTavern.eventSource;
      const triggers = [events.CHAT_CHANGED, events.MESSAGE_SWIPED, events.MESSAGE_DELETED, events.MESSAGE_UPDATED];

      // 确保只创建一次处理函数
      if (!_boundRenderHandler) {
        _boundRenderHandler = () => {
          if (!getIsEditingOrder()) {
            console.info('[DICE]消息更新事件触发，延迟渲染界面');
            setTimeout(renderInterface, 500);
          } else {
            console.info('[DICE]正在编辑顺序，跳过界面渲染');
          }
        };
      }
      if (!_boundReviewBaselineHandler) {
        _boundReviewBaselineHandler = () => {
          saveCurrentDatabaseSnapshotAsReviewBaseline('message_sent');
        };
      }

      // 确保只创建一次聊天切换处理函数（移到模块级防止重复注册）
      if (!window._acuBoundChatChangeHandler) {
        window._acuBoundChatChangeHandler = () => {
          console.info('[DICE]聊天切换事件触发，清理缓存并重新渲染');
          // [拆分说明] cachedRawData/tablePageStates/tableSearchStates/tableScrollStates/hasUnsavedChanges/currentDiffMap
          //   为 IIFE 共享 let 状态（批次6模式），经注入回调 resetAcuDiceChatChangeState 重置
          resetAcuDiceChatChangeState();
          if (window.acuModifiedSet) window.acuModifiedSet.clear();
          // 清除变量面板缓存，避免不同聊天间模式/数据串线
          try {
            if (typeof MvuModule?.clearCache === 'function') {
              MvuModule.clearCache();
            }
          } catch (e) {
            console.warn('[DICE]清除变量面板缓存失败:', e);
          }
          setTimeout(renderInterface, 500);
          scheduleDialogueIndentRender();
          scheduleCharacterDiceProfileDetection(900);
        };
      }
      const _boundChatChangeHandler = window._acuBoundChatChangeHandler;
      if (!window._acuBoundDialogueIndentHandler) {
        window._acuBoundDialogueIndentHandler = () => {
          scheduleDialogueIndentRender();
        };
      }
      const _boundDialogueIndentHandler = window._acuBoundDialogueIndentHandler;

      triggers.forEach(evt => {
        if (evt) {
          source.removeListener(evt, _boundRenderHandler);
          source.removeListener(evt, _boundChatChangeHandler); // 防止重复注册
          if (evt === events.CHAT_CHANGED) {
            source.on(evt, _boundChatChangeHandler);
          } else {
            source.on(evt, _boundRenderHandler);
          }
        }
      });
      if (events.MESSAGE_SENT) {
        source.removeListener(events.MESSAGE_SENT, _boundReviewBaselineHandler);
        source.on(events.MESSAGE_SENT, _boundReviewBaselineHandler);
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
      scheduleDialogueIndentRender();
      console.info(`[DICE]已注册 ${triggers.length} 个事件监听器`);
    } else {
      console.warn('[DICE]SillyTavern 事件源不可用，跳过事件监听器注册');
    }

    // 3. 轮询等待数据库 API 就绪
    const loop = () => {
      const api = getCore().getDB();
      if (api?.updateCell && api?.insertRow && api?.deleteRow && hasRuntimeTableReadApi(api)) {
        isInitialized = true;
        console.log('[DICE]骰子系统初始化成功');
        console.info('[DICE]数据库 API 已就绪');

        // --- [Fix] 移动到这里：确保 API 就绪且 #chat 存在后再启动监听 (带节流优化) ---
        const $chat = $('#chat');
        if ($chat.length && !getObserver()) {
          console.info('[DICE]启动聊天区域 MutationObserver');
          let mutationLock = false;
          const handleMutation = () => {
            if (mutationLock) return;
            mutationLock = true;
            requestAnimationFrame(() => {
              const config = getConfig();
              if (
                config.positionMode === 'embedded' ||
                config.positionMode === 'viewport' ||
                isFloatingCollapseActive(config)
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
              const diceCfg = getDiceConfig();
              if (diceCfg && diceCfg.hideDiceResultInChat) {
                // 步骤1：立即对新消息应用遮罩样式，避免闪烁
                const children = $chat.children();
                const lastChild = children.last();
                if (lastChild.hasClass('mes') || lastChild.hasClass('message-body')) {
                  lastChild.addClass('acu-dice-result-revealing');
                }

                // 步骤2：使用RAF在下一帧快速执行隐藏逻辑
                requestAnimationFrame(() => {
                  hideDiceResultsInUserMessages();

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
          const chatObserver = new MutationObserver(handleMutation);
          setObserver(chatObserver);
          chatObserver.observe($chat[0], { childList: true });
        } else if (!$chat.length) {
          console.warn('[DICE]聊天区域 (#chat) 未找到，跳过 MutationObserver 设置');
        }
        // --------------------------------------------------

        console.info('[DICE]执行首次界面渲染...');
        renderInterface(); // 首次渲染
        getTutorialModule().maybeStart('core');
        // [新增] 初始化时处理已存在的消息中的投骰结果
        setTimeout(() => {
          hideDiceResultsInUserMessages();
        }, 500);
        // 注册回调
        if (api.registerTableUpdateCallback) {
          api.registerTableUpdateCallback(UpdateController.handleUpdate);
          console.info('[DICE]已注册表格更新回调');

          // 恢复快照功能
          if (api.registerTableFillStartCallback) {
            api.registerTableFillStartCallback(() => {
              saveCurrentDatabaseSnapshotAsReviewBaseline('table_fill_start');
            });
            console.info('[DICE]已注册表格填充开始回调');
          }
        } else {
          console.warn('[DICE]数据库 API 不支持回调注册');
        }
      } else {
        // 限制重试次数，防止无限循环 (约 60秒后放弃)
        if (!isInitialized) {
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
      const { $ } = getCore();
      const hideOptionPanel = () => {
        // [拆分说明] optionPanelVisible 为 IIFE 共享 let 状态（批次6模式），经注入回调 setOptionPanelVisible 写入
        setOptionPanelVisible(false);
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
        if (!shouldTriggerCrazyMode()) return;

        const crazyRollResult = generateCrazyRoll();
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

        const { $ } = getCore();
        const $ta = $('#send_textarea');
        const content = ($ta.val() || '').toString().trim();
        if (!content) return;
        if (hasDiceResultInText(content)) return;
        if (!shouldTriggerCrazyMode()) return;

        const crazyRollResult = generateCrazyRoll();
        if (!crazyRollResult) return;

        smartInsertToTextarea(crazyRollResult, 'dice');
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
        if (!shouldTriggerCrazyMode()) return;

        const crazyRollResult = generateCrazyRoll();
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
        if (!shouldTriggerCrazyMode()) return;

        const crazyRollResult = generateCrazyRoll();
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

        const { $ } = getCore();
        const $ta = $('#send_textarea');
        if ($ta.length && newMessage) {
          const currentVal = ($ta.val() || '').toString();
          if (currentVal === newMessage) {
            setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, '');
          }
        }
      };

      // [修复] 在发送按钮点击时恢复真实结果
      const setupSendButtonListener = () => {
        // [新增] 拦截输入框的 value 属性，确保读取时自动替换占位符
        interceptTextareaValue();
        bindHumanInputTracking();
        ensureGachaHeartbeat();

        // [修复] 使用捕获阶段拦截，确保在发送逻辑之前执行
        const sendButton = document.getElementById('send_but');
        if (sendButton) {
          const onSendCapture = () => {
            const $ta = $('#send_textarea');
            if ($ta.length) {
              const textarea = $ta[0] as AcuDiceTextareaElement;
              capturePendingHumanInputSnapshot($ta.val(), textarea._acuOriginalActionText);
            }
            // 在捕获阶段提前注入疯狂模式
            triggerCrazyModeBeforeSend();
            // 在捕获阶段立即恢复真实结果
            restoreDiceResultBeforeSend();
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
              capturePendingHumanInputSnapshot($ta.val(), textarea._acuOriginalActionText);
            }
            // 在事件冒泡前注入疯狂模式
            triggerCrazyModeBeforeSend();
            // 在事件冒泡前恢复真实结果
            restoreDiceResultBeforeSend();
          });

        $(document)
          .off('keydown.acu_restore_dice', '#send_textarea')
          .on('keydown.acu_restore_dice', '#send_textarea', function (e) {
            if (e.isComposing) return;
            if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
            const textarea = this as AcuDiceTextareaElement;
            capturePendingHumanInputSnapshot(textarea.value, textarea._acuOriginalActionText);
            triggerCrazyModeBeforeSend();
            restoreDiceResultBeforeSend();
          });

        // [新增] 监听输入框的创建/替换，重新拦截新的输入框
        const observer = new MutationObserver(() => {
          const $ta = $('#send_textarea');
          if ($ta.length && !$ta[0]._acuValueIntercepted) {
            interceptTextareaValue();
          }
          if ($ta.length) bindHumanInputTracking();
        });
        observer.observe(document.body, { childList: true, subtree: true });
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

              if (originalPrompt && !hasDiceResultInText(originalPrompt) && shouldTriggerCrazyMode()) {
                const crazyRollResult = generateCrazyRoll();
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

          void settleGachaFortuneForMessage(messageId);
          try {
            // [新增] 执行待处理的检定后果
            await processPendingEffectRuns(messageId);
          } catch (error) {
            console.warn('[DICE][GACHA] MESSAGE_SENT 后果执行异常，骰运结算仍会继续:', error);
          } finally {
            void settleGachaFortuneForMessage(messageId);
          }

          // 延迟执行，确保消息已渲染到DOM
          const diceCfg = getDiceConfig();
          if (diceCfg && diceCfg.hideDiceResultInChat) {
            setTimeout(() => {
              hideDiceResultsInUserMessages();
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

          void settleGachaFortuneForMessage(messageId);
          try {
            // [新增] 执行待处理的检定后果
            await processPendingEffectRuns(messageId);
          } catch (error) {
            console.warn('[DICE][GACHA] MESSAGE_SENT 后果执行异常，骰运结算仍会继续:', error);
          } finally {
            void settleGachaFortuneForMessage(messageId);
          }

          // 延迟执行，确保消息已渲染到DOM
          const diceCfg = getDiceConfig();
          if (diceCfg && diceCfg.hideDiceResultInChat) {
            setTimeout(() => {
              hideDiceResultsInUserMessages();
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
      interceptTextareaValue();
      bindHumanInputTracking();
      ensureGachaHeartbeat();
    }, 500);

    scheduleCharacterDiceProfileDetection(1500);

    // [新增] 监听ERA变量更新，自动刷新变量面板
    const eventOn = window.eventOn || window.parent?.eventOn;
    if (typeof eventOn === 'function') {
      eventOn('era:writeDone', detail => {
        // 清除 ERA 缓存
        if (typeof MvuModule === 'object' && typeof MvuModule.clearCache === 'function') {
          MvuModule.clearCache();
        }

        // 如果当前检测到的是ERA数据，自动刷新面板
        const mode = MvuModule.detectMode();
        if (mode === 'era' && getActiveTabState() === MvuModule.MODULE_ID) {
          console.log('[DICE]ERA变量已更新，自动刷新面板');
          renderInterface();
        }
      });
    } else {
      console.warn('[DICE]无法监听 ERA 事件，eventOn 不可用');
    }

    // [新增] 页面卸载时清理资源
    // [拆分说明] 清理逻辑涉及 gachaHeartbeatTimer/gachaShopUiRefreshTimer/observer/tableScrollStates 等 IIFE 共享 let 状态
    //   （批次6模式），整体移至 index.ts IIFE 内 runAcuDiceUnloadCleanup 回调注入，此处仅调用
    $(window)
      .off('beforeunload.acu pagehide.acu')
      .on('beforeunload.acu pagehide.acu', () => {
        try {
          runAcuDiceUnloadCleanup();
        } catch (e) {
          console.warn('[DICE]页面卸载清理出错:', e);
        }
      });
  };
export { detectVisualizerConflict, showConflictDialog, init }; // __wireAcuDiceInitDeps 已由头部 export function 导出
