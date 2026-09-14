// @ts-nocheck
/**
 * get-dice-profile-prompt-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getAcuDiceProfilePromptKey } from '../profiles/profile-packages';
export function createGetDiceProfilePromptState(deps: any) {
  const getDiceProfilePromptState = (
    chatId: string,
    fingerprint: string,
  ): 'skipped' | 'applied' | 'saved' | null => {
    const states = deps.getDiceProfilePromptStates();
    return states[getAcuDiceProfilePromptKey(chatId, fingerprint)] || null;
  };
  return getDiceProfilePromptState;
}
