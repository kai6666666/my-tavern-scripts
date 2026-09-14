// @ts-nocheck
/**
 * schedule-dialogue-indent-render.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleDialogueIndentRender(deps: any) {
  const scheduleDialogueIndentRender = (): void => deps.getDialogueIndentRenderer().schedule();
  return scheduleDialogueIndentRender;
}
