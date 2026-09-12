// @ts-nocheck
/**
 * update-controller.ts
 * Feature-Sliced: features 层模块（工厂版，DI 注入依赖）。
 */

export function createUpdateController(deps: any) {
  const UpdateController = {
    _lastValidationCount: 0,

    handleUpdate: () => {
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
      deps.renderInterface();

      // 执行实时验证
      setTimeout(() => {
        try {
          const rawData = deps.getCachedRawData() || deps.getTableData();
          if (rawData) {
            const errors = deps.getValidationEngine().validateAllData(rawData);
            const newCount = errors.length;

            // 只有当错误数量增加时才弹出提示
            if (newCount > UpdateController._lastValidationCount && newCount > 0) {
              // 错误数量已增加
            }

            UpdateController._lastValidationCount = newCount;

            // 更新导航栏指示器
            deps.updateValidationIndicator(newCount);
          }
        } catch (e) {
          console.error('[DICE]ACU 验证执行失败:', e);
        }
      }, 100);
    },
  };


  return UpdateController;
}
