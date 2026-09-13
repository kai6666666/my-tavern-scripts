// @ts-nocheck
/**
 * update-gacha-fortune-progress-dom.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from '../../features/gacha/gacha-types';
export function createUpdateGachaFortuneProgressDom(deps: any) {
  const updateGachaFortuneProgressDom = (state: GachaState, projectActiveProgress = false): boolean => {
    const containers = deps.getGachaShopProgressContainers();
    if (containers.length === 0) return false;

    const view = deps.getGachaFortuneProgressView(state, { projectActiveProgress });
    let didUpdate = false;

    const setText = (root: HTMLElement, selector: string, text: string) => {
      root.querySelectorAll<HTMLElement>(selector).forEach(element => {
        element.textContent = text;
      });
    };
    const setProgressWidth = (root: HTMLElement, selector: string, percent: number) => {
      root.querySelectorAll<HTMLElement>(selector).forEach(element => {
        element.style.width = `${String(percent)}%`;
      });
    };

    containers.forEach(container => {
      const progress = container.querySelector<HTMLElement>('.acu-gacha-fortune-progress');
      if (!progress) return;

      setText(container, '.acu-gacha-fortune-amount', String(view.fortune));
      setText(progress, '.acu-gacha-last-gain-summary', view.lastGainText);
      setText(progress, '.acu-gacha-char-progress-value', `${String(view.charProgress)}/${String(view.charGoal)}`);
      setProgressWidth(progress, '.acu-gacha-char-progress-fill', view.charPercent);
      setText(progress, '.acu-gacha-char-progress-note', view.charNote);
      setText(progress, '.acu-gacha-active-progress-time', view.activeRemainingText);
      setProgressWidth(progress, '.acu-gacha-active-progress-fill', view.activePercent);
      setText(progress, '.acu-gacha-active-progress-note', view.activeNote);
      setText(progress, '.acu-gacha-last-gain-time', view.lastGainTime);
      setText(progress, '.acu-gacha-last-gain-note', view.lastGainText);
      progress.querySelectorAll<HTMLElement>('.acu-gacha-active-progress').forEach(element => {
        element.classList.toggle('is-reward-flash', view.shouldFlashActiveReward);
      });
      didUpdate = true;
    });

    return didUpdate;
  };
  return updateGachaFortuneProgressDom;
}
