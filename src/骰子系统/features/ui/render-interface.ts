// @ts-nocheck
/**
 * render-interface.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderInterface(deps: any) {
  const renderInterface = () => {
    // 设置面板打开时跳过重绘，防止事件丢失
    if (deps.getIsSettingsOpen()) {
      if (!deps.getRenderInterfacePending()) {
        console.info('[DICE]设置面板打开中，跳过界面渲染');
        deps.setRenderInterfacePending(true);
      }
      return;
    }

    // [修复] 在防抖前立即保存滚动状态，确保锁定操作等场景下滚动位置不丢失
    deps.saveCurrentTabState();

    // 防抖：如果已有待执行的渲染，取消它
    if (deps.getRenderInterfaceTimer()) {
      clearTimeout(deps.getRenderInterfaceTimer());
    }

    // 设置新的防抖定时器（50ms延迟，足够短以保持响应性，足够长以合并多次调用）
    deps.setRenderInterfaceTimer(setTimeout(() => {
      deps.setRenderInterfaceTimer(null);
      deps.setRenderInterfacePending(false);
      deps._renderInterfaceImpl();
    }, 50));
  };
  return renderInterface;
}
