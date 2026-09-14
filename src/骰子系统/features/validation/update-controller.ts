// @ts-nocheck
/**
 * update-controller.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 *
 * 注意：本模块的 handleUpdate 会被注册为数据库的「表格更新回调」。
 * 回调 MUST NOT 向外抛错（数据库会将异常记为回调错误），因此整体外层包裹防护。
 */
export function createUpdateController(deps: any) {
  const UpdateController = {
    _lastValidationCount: 0,
    handleUpdate: () => {
      try {
        // === 更新拦截逻辑（检查启用了 intercept 的规则） ===
        let newData: unknown = null;
        try {
          const snapshot = deps.loadSnapshot();
          newData = deps.getTableData({ silent: true });
          if (snapshot && newData) {
            const rules = deps.getValidationRuleManager().getEnabledRules();
            const violations = deps.getValidationEngine().checkTableRules(snapshot, newData, rules);
            if (violations.length > 0) {
              console.warn('[DICE]ACU 规则拦截触发，仅标注不回滚:', violations);
              if (window.toastr) {
                window.toastr.warning(violations[0].message, '验证提示', {
                  timeOut: 5000,
                  positionClass: 'toast-bottom-right',
                });
              }
            }
          }
        } catch (e) {
          console.error('[DICE]ACU 拦截检查失败:', e);
        }
        if (newData && deps.getCachedRawData() && deps.isSameSheetData(deps.getCachedRawData(), newData)) {
          return;
        }
        // 直接触发渲染，让 renderInterface 内部处理数据获取和差异计算
        // 注意：不要在这里更新快照！快照只在用户主动保存时更新
        try {
          deps.renderInterface();
        } catch (renderError) {
          console.warn('[DICE]ACU 更新回调触发渲染失败（已忽略）:', renderError);
        }
        try {
          if (typeof deps.refreshChangesPanel === 'function') deps.refreshChangesPanel();
        } catch (refreshError) {
          console.warn('[DICE]ACU 更新回调刷新审核面板失败（已忽略）:', refreshError);
        }
        // 执行实时验证
        setTimeout(() => {
          try {
            const rawData = deps.getCachedRawData() || deps.getTableData();
            if (rawData) {
              const errors = deps.getValidationEngine().validateAllData(rawData);
              const newCount = errors.length;
              UpdateController._lastValidationCount = newCount;
              deps.updateValidationIndicator(newCount);
            }
          } catch (e) {
            console.error('[DICE]ACU 验证执行失败:', e);
          }
        }, 100);
      } catch (outerError) {
        console.warn('[DICE]ACU 更新回调处理失败（已忽略，不影响数据库）:', outerError);
      }
    },
  };
  return UpdateController;
}
