// @ts-nocheck
/**
 * get-dice-profile-prompt-states.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createGetDiceProfilePromptStates(deps: any) {
  const getDiceProfilePromptStates = (): Record<string, 'skipped' | 'applied' | 'saved'> => {
    const stored = Store.get(deps.getDICE_PROFILE_SKIPPED_PROMPTS_STORAGE_KEY(), {});
    return deps.isDiceConfigBackupRecord(stored) ? stored : {};
  };
  return getDiceProfilePromptStates;
}
