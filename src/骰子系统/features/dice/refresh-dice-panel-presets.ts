// @ts-nocheck
/**
 * refresh-dice-panel-presets.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_ACTIVE_ADVANCED_PRESET, STORAGE_KEY_LAST_PRESET } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createRefreshDicePanelPresets(deps: any) {
  const refreshDicePanelPresets = () => {
    const { $ } = deps.getCore();
    const $panel = $('.acu-dice-panel');
    if ($panel.length === 0) return; // 面板未打开，无需刷新

    // 重新生成预设按钮HTML
    const presets = deps.AdvancedDicePresetManager.getAllPresets()
      .filter(p => p.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const activePresetId = Store.get(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null) as string | null;
    const lastPresetId = localStorage.getItem(STORAGE_KEY_LAST_PRESET);
    const activeButtonId = activePresetId || lastPresetId || '__custom__';

    let html = `<button type="button" class="acu-dice-quick-preset-btn${activeButtonId === '__custom__' ? ' active' : ''}" data-id="__custom__">自定义</button>`;
    presets.forEach(p => {
      const activeClass = p.id === activeButtonId ? ' active' : '';
      html += `<button type="button" class="acu-dice-quick-preset-btn${activeClass}" data-id="${deps.escapeHtml(p.id)}">${deps.escapeHtml(p.name)}</button>`;
    });

    // 替换预设按钮区域内容
    $panel.find('#dice-normal-presets').html(html);
  };
  return refreshDicePanelPresets;
}
