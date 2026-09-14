// @ts-nocheck
/**
 * schedule-character-dice-profile-detection.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createScheduleCharacterDiceProfileDetection(deps: any) {
  const scheduleCharacterDiceProfileDetection = (delay = 800): void => {
    window.setTimeout(() => {
      void deps.maybePromptCharacterDiceProfile();
    }, delay);
  };
  return scheduleCharacterDiceProfileDetection;
}
