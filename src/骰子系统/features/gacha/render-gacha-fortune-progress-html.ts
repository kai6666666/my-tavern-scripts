// @ts-nocheck
/**
 * render-gacha-fortune-progress-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from '../../features/gacha/gacha-types';
export function createRenderGachaFortuneProgressHtml(deps: any) {
  const renderGachaFortuneProgressHtml = (state: GachaState): string => {
    const view = deps.getGachaFortuneProgressView(state);

    return `
      <section class="acu-gacha-fortune-progress" title="发送消息、保持活跃和进行检定都可以获得骰运">
        <div class="acu-gacha-fortune-progress-head">
          <span><i class="fa-solid fa-seedling"></i> 骰运获取</span>
          <strong class="acu-gacha-last-gain-summary">${deps.escapeHtml(view.lastGainText)}</strong>
        </div>
        <div class="acu-gacha-progress-grid">
          <div class="acu-gacha-progress-item acu-gacha-char-progress">
            <div class="acu-gacha-progress-label">
              <span>输入进度</span>
              <strong class="acu-gacha-char-progress-value">${deps.escapeHtml(String(view.charProgress))}/${deps.escapeHtml(String(view.charGoal))}</strong>
            </div>
            <div class="acu-gacha-progress-bar"><span class="acu-gacha-char-progress-fill" style="width:${view.charPercent}%;"></span></div>
            <div class="acu-gacha-progress-note acu-gacha-char-progress-note">${deps.escapeHtml(view.charNote)}</div>
          </div>
          <div class="acu-gacha-progress-item acu-gacha-active-progress ${view.shouldFlashActiveReward ? 'is-reward-flash' : ''}">
            <div class="acu-gacha-progress-label">
              <span>活跃奖励</span>
              <strong class="acu-gacha-active-progress-time">${deps.escapeHtml(view.activeRemainingText)}</strong>
            </div>
            <div class="acu-gacha-progress-bar"><span class="acu-gacha-active-progress-fill" style="width:${view.activePercent}%;"></span></div>
            <div class="acu-gacha-progress-note acu-gacha-active-progress-note">${deps.escapeHtml(view.activeNote)}</div>
          </div>
          <div class="acu-gacha-progress-item compact acu-gacha-last-progress">
            <div class="acu-gacha-progress-label">
              <span>上次获得</span>
              <strong class="acu-gacha-last-gain-time">${deps.escapeHtml(view.lastGainTime)}</strong>
            </div>
            <div class="acu-gacha-progress-note acu-gacha-last-gain-note">${deps.escapeHtml(view.lastGainText)}</div>
          </div>
        </div>
      </section>
    `;
  };
  return renderGachaFortuneProgressHtml;
}
