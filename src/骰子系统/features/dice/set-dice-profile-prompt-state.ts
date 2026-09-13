// @ts-nocheck
/**
 * set-dice-profile-prompt-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { getAcuDiceProfilePromptKey } from '../profiles/profile-packages';
export function createSetDiceProfilePromptState(deps: any) {
  const setDiceProfilePromptState = (
    chatId: string,
    fingerprint: string,
    state: 'skipped' | 'applied' | 'saved',
  ): void => {
    const states = deps.getDiceProfilePromptStates();
    states[getAcuDiceProfilePromptKey(chatId, fingerprint)] = state;
    Store.set(deps.getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY(), states);
  };
  return setDiceProfilePromptState;
}
