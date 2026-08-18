// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=5「全局错误处理机制（高阈值，仅致命错误）」
// 原行范围：2673-2860（含 banner 2670-2860，含 window.onerror/unhandledrejection 注册与尾部注释）；拆分批次 2；外部 closure 依赖：1（ConsoleCaptureManager@4）
// 接线说明：ConsoleCaptureManager 已随批次 2 拆至 infra/console-capture.ts（0 依赖叶子模块），直接 import 引入，无循环 import；
//   window.onerror / unhandledrejection 注册语句随模块加载执行，与 IIFE 内原时序等价（模块求值先于 IIFE 体，但注册只依赖 ErrorHandler 与 window）。

import { ConsoleCaptureManager } from './console-capture';
  // ========================================
  // 全局错误处理机制（高阈值，仅致命错误）
  // ========================================
  const ErrorHandler = {
    errorCount: 0,
    errorThreshold: 3, // 连续3次致命错误才触发
    lastErrorTime: 0,
    errorWindow: 5000, // 5秒内的错误才计入
    fatalErrorDetected: false,

    // 判断是否为致命错误（高阈值）
    isFatalError(error, source, lineno, colno, stack) {
      // 排除第三方库错误
      const thirdPartyPatterns = [/jquery/i, /lodash/i, /vue/i, /react/i, /pixi/i, /gsap/i, /toastr/i, /node_modules/i];

      const errorInfo = stack || error?.stack || '';
      const errorSource = source || '';

      // 检查是否来自第三方库
      for (const pattern of thirdPartyPatterns) {
        if (pattern.test(errorInfo) || pattern.test(errorSource)) {
          return false;
        }
      }

      // 检查是否来自骰子系统核心代码
      const corePatterns = [
        /acu_visualizer/i,
        /骰子系统/i,
        /LockManager/i,
        /Store/i,
        /ConsoleCaptureManager/i,
        /renderInterface/i,
        /init\s*\(/i,
      ];

      let isCoreError = false;
      for (const pattern of corePatterns) {
        if (pattern.test(errorInfo) || pattern.test(errorSource)) {
          isCoreError = true;
          break;
        }
      }

      // 必须是核心错误才可能是致命错误
      return isCoreError;
    },

    // 处理错误
    handleError(error, source, lineno, colno, stack) {
      try {
        // 检查是否为致命错误
        if (!this.isFatalError(error, source, lineno, colno, stack)) {
          return; // 非致命错误，忽略
        }

        const now = Date.now();

        // 如果距离上次错误超过时间窗口，重置计数
        if (now - this.lastErrorTime > this.errorWindow) {
          this.errorCount = 0;
        }

        this.errorCount++;
        this.lastErrorTime = now;

        // 达到阈值，触发致命错误处理
        if (this.errorCount >= this.errorThreshold && !this.fatalErrorDetected) {
          this.fatalErrorDetected = true;
          this.triggerFatalError();
        }
      } catch (e) {
        // 错误处理本身出错时，避免无限循环
        console.error('[DICE]ErrorHandler 处理错误时失败:', e);
      }
    },

    // 触发致命错误处理
    triggerFatalError() {
      try {
        // 自动开启 console 抓取
        if (!ConsoleCaptureManager.enabled) {
          ConsoleCaptureManager.enable();
        }

        // 设置错误标志
        localStorage.setItem('acu_script_error_detected', 'true');

        // 显示紧急入口按钮
        this.showEmergencyButton();
      } catch (e) {
        console.error('[DICE]ErrorHandler 触发致命错误处理时失败:', e);
      }
    },

    // 显示紧急入口按钮
    showEmergencyButton() {
      try {
        // 检查是否已存在
        let btn = document.getElementById('acu-emergency-debug-btn');
        if (btn) {
          btn.style.display = 'block';
          return;
        }

        // 创建紧急入口按钮
        btn = document.createElement('button');
        btn.id = 'acu-emergency-debug-btn';
        btn.innerHTML = '<i class="fa-solid fa-bug"></i> 调试';
        btn.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 99999;
          padding: 10px 16px;
          background: #e74c3c;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        `;

        btn.onmouseenter = function () {
          this.style.background = '#c0392b';
          this.style.transform = 'scale(1.05)';
        };
        btn.onmouseleave = function () {
          this.style.background = '#e74c3c';
          this.style.transform = 'scale(1)';
        };

        btn.onclick = function () {
          try {
            // 尝试调用全局的 showDebugConsoleModal
            if (typeof window.showDebugConsoleModal === 'function') {
              window.showDebugConsoleModal();
            } else {
              // 系统弹窗尚未初始化时的浏览器级应急兜底，符合 DESIGN.md 的原生提示例外。
              alert('脚本出现错误，请打开浏览器开发者工具（F12）查看控制台');
            }
          } catch (e) {
            console.error('[DICE]紧急入口按钮点击失败:', e);
            // 系统弹窗尚未初始化时的浏览器级应急兜底，符合 DESIGN.md 的原生提示例外。
            alert('脚本出现错误，请打开浏览器开发者工具（F12）查看控制台');
          }
        };

        document.body.appendChild(btn);
      } catch (e) {
        console.error('[DICE]显示紧急入口按钮失败:', e);
      }
    },

    // 检查并恢复错误状态
    checkAndRestore() {
      try {
        const errorDetected = localStorage.getItem('acu_script_error_detected') === 'true';
        if (errorDetected) {
          // 自动开启 console 抓取（仅本次会话）
          if (!ConsoleCaptureManager.enabled) {
            ConsoleCaptureManager.enable();
          }
          // 显示紧急入口按钮
          this.showEmergencyButton();
        }
      } catch (e) {
        console.error('[DICE]ErrorHandler 检查错误状态失败:', e);
      }
    },
  };

  // 注册全局错误处理器
  window.onerror = function (message, source, lineno, colno, error) {
    ErrorHandler.handleError(error || message, source, lineno, colno, error?.stack);
    return false; // 不阻止默认错误处理
  };

  // 注册 Promise 拒绝处理器
  window.addEventListener('unhandledrejection', function (event) {
    ErrorHandler.handleError(event.reason, null, null, null, event.reason?.stack);
  });

  // 在脚本初始化时检查错误状态
  // 这个会在 init 函数中调用
export { ErrorHandler };
