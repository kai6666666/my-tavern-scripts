// @ts-nocheck
/**
 * pop-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPopModal(deps: any) {
  const popModal = (): boolean => {
    deps.getModalStack().pop(); // 移除当前弹窗
    const prev = deps.getModalStack().pop(); // 获取上一个弹窗
    if (prev) {
      prev.show(); // 重新打开上一个弹窗
      return true;
    }
    return false;
  };
  return popModal;
}
