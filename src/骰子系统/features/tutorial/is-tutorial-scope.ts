// @ts-nocheck
/**
 * is-tutorial-scope.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { TUTORIAL_SCOPE_LIST } from '../tutorial';
import type { TutorialScope } from '../tutorial';
export function createIsTutorialScope(deps: any) {
  const isTutorialScope = (value: string): value is TutorialScope => TUTORIAL_SCOPE_LIST.includes(value as TutorialScope);
  return isTutorialScope;
}
