// @ts-nocheck
/**
 * get-tutorial-button-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { TutorialScope } from '../tutorial';
export function createGetTutorialButtonHtml(deps: any) {
  const getTutorialButtonHtml = (scope: TutorialScope, title = '查看本界面教程', extraClass = ''): string =>
    `<button class="acu-view-btn acu-panel-tutorial-btn ${extraClass}" data-tutorial-scope="${scope}" title="${deps.escapeHtml(title)}" aria-label="${deps.escapeHtml(title)}"><i class="fa-solid fa-circle-question"></i></button>`;

  const isTutorialScope = (value: string): value is TutorialScope => TUTORIAL_SCOPE_LIST.includes(value as TutorialScope);
  return getTutorialButtonHtml;
}
