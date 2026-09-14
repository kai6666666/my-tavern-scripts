// @ts-nocheck
/**
 * mark-human-input-activity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMarkHumanInputActivity(deps: any) {
  const markHumanInputActivity = () => {
    deps.setLastHumanInputActivityAt(Date.now());
  };
  return markHumanInputActivity;
}
