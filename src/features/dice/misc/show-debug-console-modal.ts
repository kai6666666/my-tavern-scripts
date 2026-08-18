// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=42「showDebugConsoleModal - 调试控制台弹窗」（banner 无标题）
// 原行范围：47911-48184（含 banner 47910-48184）；拆分批次 5；外部 closure 依赖：5（getCore@29 / getConfig@30 / Store@29 / ConsoleCaptureManager@4 / escapeHtml@3）
// 接线说明：ConsoleCaptureManager 已随批次 2 拆至 infra/console-capture.ts、showActionableErrorToast 来自 ../ui/actionable-error-toast（均不引用本文件，无循环），直接 import；
//   getCore/getConfig/Store@29、escapeHtml@3 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireShowDebugConsoleModalDeps({ getCore, getConfig, Store, escapeHtml }) 注入；
//   未注入时模块级引用为 null（函数仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { ConsoleCaptureManager } from '../infra/console-capture';
import { showActionableErrorToast } from '../ui/actionable-error-toast';

let getCore = null;
let getConfig = null;
let Store = null;
let escapeHtml = null;

export function __wireShowDebugConsoleModalDeps(deps) {
  getCore = deps.getCore;
  getConfig = deps.getConfig;
  Store = deps.Store;
  escapeHtml = deps.escapeHtml;
}
  // ========================================
  const showDebugConsoleModal = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').not(':has(.acu-debug-console-dialog)').remove();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;

    // 获取过滤状态（从localStorage读取）
    const savedFilters = Store.get('acu_debug_filters', { log: true, info: true, warn: true, error: true });
    ConsoleCaptureManager.setFilters(savedFilters);

    const renderLogs = () => {
      const filteredLogs = ConsoleCaptureManager.getFilteredLogs();
      const $logContainer = dialog.find('.acu-debug-log-container');
      $logContainer.empty();

      if (filteredLogs.length === 0) {
        $logContainer.html(`
          <div class="acu-debug-empty">
            <i class="fa-solid fa-inbox"></i>
            <div class="acu-debug-empty-text">暂无日志</div>
            <div class="acu-debug-empty-hint">开启 Console 抓取后，日志将显示在这里</div>
          </div>
        `);
        return;
      }

      filteredLogs.forEach(log => {
        const logItem = $(`
          <div class="acu-debug-log-item" data-type="${log.type}">
            <div class="acu-debug-log-header">
              <span class="acu-debug-log-time">${log.timeStr}</span>
              <span class="acu-debug-log-type ${log.type}">${log.type.toUpperCase()}</span>
            </div>
            <div class="acu-debug-log-content">${escapeHtml(log.content)}</div>
            ${log.stack ? `<div class="acu-debug-log-stack">${escapeHtml(log.stack)}</div>` : ''}
          </div>
        `);
        $logContainer.append(logItem);
      });
    };

    const dialog = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-debug-console-dialog ${currentThemeClass}">
          <div class="acu-settings-header">
            <div class="acu-settings-title"><i class="fa-solid fa-bug"></i> Debug控制台</div>
            <button class="acu-close-btn" id="debug-console-close"><i class="fa-solid fa-times"></i></button>
          </div>

          <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
            <!-- 工具栏 -->
            <div class="acu-debug-toolbar">
              <!-- Console抓取开关 -->
              <div class="acu-debug-capture-row">
                <span class="acu-debug-capture-label">Console 抓取</span>
                <label class="acu-toggle">
                  <input type="checkbox" id="debug-console-capture-toggle" ${ConsoleCaptureManager.enabled ? 'checked' : ''}>
                  <span class="acu-toggle-slider"></span>
                </label>
                <span id="debug-console-capture-status" class="acu-debug-capture-status ${ConsoleCaptureManager.enabled ? 'enabled' : 'disabled'}">${ConsoleCaptureManager.enabled ? '已启用' : '已关闭'}</span>
              </div>
              <!-- 过滤按钮组 -->
              <div class="acu-debug-filter-group">
                <button class="acu-debug-filter-btn ${savedFilters.log ? 'active' : ''}" data-filter-type="log">
                  <i class="fa-solid fa-circle indicator"></i> Log
                </button>
                <button class="acu-debug-filter-btn ${savedFilters.info ? 'active' : ''}" data-filter-type="info">
                  <i class="fa-solid fa-info-circle indicator"></i> Info
                </button>
                <button class="acu-debug-filter-btn ${savedFilters.warn ? 'active' : ''}" data-filter-type="warn">
                  <i class="fa-solid fa-exclamation-triangle indicator"></i> Warn
                </button>
                <button class="acu-debug-filter-btn ${savedFilters.error ? 'active' : ''}" data-filter-type="error">
                  <i class="fa-solid fa-exclamation-circle indicator"></i> Error
                </button>
              </div>
              <!-- 操作按钮 -->
              <div class="acu-debug-actions">
                <button class="acu-debug-action-btn danger" id="debug-console-clear">
                  <i class="fa-solid fa-trash"></i> <span class="btn-text">清空</span>
                </button>
                <button class="acu-debug-action-btn" id="debug-console-copy">
                  <i class="fa-solid fa-copy"></i> <span class="btn-text">复制</span>
                </button>
                <button class="acu-debug-action-btn primary" id="debug-console-export">
                  <i class="fa-solid fa-download"></i> <span class="btn-text">导出</span>
                </button>
              </div>
            </div>

            <!-- 日志显示区域 -->
            <div class="acu-debug-log-scroll">
              <div class="acu-debug-log-container"></div>
            </div>

            <!-- 底部状态栏 -->
            <div class="acu-debug-footer">
              <div class="acu-debug-stats">
                <div class="acu-debug-stat">
                  <span>总计</span>
                  <span class="acu-debug-stat-value" id="debug-total-count">0</span>
                </div>
                <div class="acu-debug-stat">
                  <span>显示</span>
                  <span class="acu-debug-stat-value" id="debug-filtered-count">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 更新计数
    const updateCounts = () => {
      const total = ConsoleCaptureManager.logs.length;
      const filtered = ConsoleCaptureManager.getFilteredLogs().length;
      dialog.find('#debug-total-count').text(total);
      dialog.find('#debug-filtered-count').text(filtered);
    };

    // 初始渲染
    renderLogs();
    updateCounts();

    // Console抓取开关
    dialog.find('#debug-console-capture-toggle').on('change', function () {
      const checked = $(this).is(':checked');
      const $status = dialog.find('#debug-console-capture-status');
      if (checked) {
        ConsoleCaptureManager.enable();
        $status.text('已启用').removeClass('disabled').addClass('enabled');
        // 添加启动日志
        console.log('[DICE]Debug控制台抓取模式已开启');
      } else {
        ConsoleCaptureManager.disable();
        $status.text('已关闭').removeClass('enabled').addClass('disabled');
      }
    });

    // 过滤选项变化
    dialog.find('.acu-debug-filter-btn').on('click', function () {
      const type = $(this).data('filter-type');
      const isActive = $(this).hasClass('active');
      const newState = !isActive;

      // 更新按钮样式
      if (newState) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }

      // 更新过滤器
      ConsoleCaptureManager.setFilters({ [type]: newState });
      Store.set('acu_debug_filters', ConsoleCaptureManager.filters);
      renderLogs();
      updateCounts();
    });

    // 清空日志（直接清空，不弹窗）
    dialog.find('#debug-console-clear').on('click', () => {
      ConsoleCaptureManager.clear();
      renderLogs();
      updateCounts();
    });

    // 复制日志
    dialog.find('#debug-console-copy').on('click', async () => {
      const filteredLogs = ConsoleCaptureManager.getFilteredLogs();
      if (filteredLogs.length === 0) {
        if (window.toastr) window.toastr.warning('没有可复制的日志');
        return;
      }

      const text = filteredLogs
        .map(log => {
          let line = `[${log.timeStr}] [${log.type.toUpperCase()}] ${log.content}`;
          if (log.stack) {
            line += '\n' + log.stack;
          }
          return line;
        })
        .join('\n');

      try {
        // 优先使用酒馆接口
        if (window.TavernHelper && window.TavernHelper.triggerSlash) {
          const safeContent = text.replace(/\"/g, '\\"').replace(/\}/g, '\\}');
          await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
          return;
        }
        // 使用浏览器原生API
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // 降级方案：使用execCommand
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.setAttribute('readonly', '');
          document.body.appendChild(textArea);
          textArea.select();
          textArea.setSelectionRange(0, 99999);
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (!successful) {
            throw new Error('execCommand failed');
          }
        }
      } catch (err) {
        console.error('[DICE]DebugConsole 复制失败:', err);
        if (window.toastr) {
          showActionableErrorToast('复制失败', {
            suggestion: '请尝试使用手动复制窗口，或检查浏览器是否允许当前页面访问剪贴板。',
          });
        }
      }
    });

    // 导出日志
    dialog.find('#debug-console-export').on('click', () => {
      const filteredLogs = ConsoleCaptureManager.getFilteredLogs();
      if (filteredLogs.length === 0) {
        if (window.toastr) window.toastr.warning('没有可导出的日志');
        return;
      }

      const text = filteredLogs
        .map(log => {
          let line = `[${log.timeStr}] [${log.type.toUpperCase()}] ${log.content}`;
          if (log.stack) {
            line += '\n' + log.stack;
          }
          return line;
        })
        .join('\n\n');

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `debug-console-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // 关闭按钮
    dialog.find('#debug-console-close, .acu-edit-overlay').on('click', function (e) {
      if (e.target === this || $(e.target).closest('.acu-close-btn').length) {
        dialog.remove();
      }
    });

    // 定期刷新日志显示（实时模式）
    // [已删除] 自动滚动功能，避免出错
    const refreshInterval = setInterval(() => {
      if (dialog.length && dialog.is(':visible')) {
        renderLogs();
        updateCounts();
      }
    }, 500);

    // 窗口关闭时清理定时器
    dialog.on('remove', () => {
      clearInterval(refreshInterval);
    });
  };
export { showDebugConsoleModal }; // __wireShowDebugConsoleModalDeps 已由头部 export function 导出
