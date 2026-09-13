// @ts-nocheck
/**
 * push-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPushModal(deps: any) {
  const pushModal = (name: string, show: () => void) => {
    const current = deps.getModalStack()[deps.getModalStack().length - 1];
    if (current?.name === name) {
      current.show = show;
      return;
    }
    deps.getModalStack().push({ name, show });
  };
  return pushModal;
}
