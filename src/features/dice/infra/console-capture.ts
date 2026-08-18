// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=4「ConsoleCaptureManager - Console日志抓取管理器」
// 原行范围：2553-2668（含 banner 2550-2668，含尾部注释）；拆分批次 2；外部 closure 依赖：0
  // ========================================
  // ConsoleCaptureManager - Console日志抓取管理器
  // ========================================
  const ConsoleCaptureManager = {
    logs: [],
    maxLogs: 1000,
    filters: { log: true, info: true, warn: true, error: true },
    originalMethods: {},
    isIntercepted: false,
    enabled: false, // 默认关闭，需要手动开启或错误时自动开启

    restore() {
      // 从 localStorage 恢复状态
      const saved = localStorage.getItem('acu_console_capture_enabled');
      if (saved === 'true') {
        this.enable();
      }
    },

    enable() {
      if (this.enabled) return;
      this.enabled = true;
      localStorage.setItem('acu_console_capture_enabled', 'true');
      this.intercept();
    },

    disable() {
      if (!this.enabled) return;
      this.enabled = false;
      localStorage.setItem('acu_console_capture_enabled', 'false');
      // 清除错误标志（尊重用户选择）
      localStorage.removeItem('acu_script_error_detected');
      // 隐藏紧急入口按钮
      const emergencyBtn = document.getElementById('acu-emergency-debug-btn');
      if (emergencyBtn) {
        emergencyBtn.style.display = 'none';
      }
    },

    intercept() {
      if (this.isIntercepted) return;
      this.isIntercepted = true;

      ['log', 'info', 'warn', 'error'].forEach(type => {
        this.originalMethods[type] = console[type];
        const self = this;
        console[type] = function (...args) {
          // 调用原方法
          self.originalMethods[type].apply(console, args);
          // 记录日志（仅在启用时）
          if (self.enabled) {
            self.capture(type, args);
          }
        };
      });
    },

    capture(type, args) {
      if (!this.enabled) return; // 仅在启用时捕获
      try {
        const timestamp = new Date();
        const timeStr = timestamp.toLocaleTimeString('zh-CN', { hour12: false });

        // 将参数转换为字符串
        const content = args
          .map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');

        // 获取堆栈信息（仅error）
        let stack = null;
        if (type === 'error' && args[0] instanceof Error) {
          stack = args[0].stack || null;
        }

        const logEntry = {
          id: Date.now() + Math.random(),
          timestamp,
          timeStr,
          type,
          content,
          stack,
          rawArgs: args,
        };

        this.logs.push(logEntry);

        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
          this.logs.shift();
        }
      } catch (e) {
        // 捕获失败不影响原console功能
      }
    },

    clear() {
      this.logs = [];
    },

    getFilteredLogs() {
      return this.logs.filter(log => this.filters[log.type]);
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
  };

  // 不自动初始化拦截，需要手动开启或错误时自动开启
  // ConsoleCaptureManager.intercept();
export { ConsoleCaptureManager };
