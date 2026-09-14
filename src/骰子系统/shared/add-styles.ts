// @ts-nocheck
/**
 * add-styles.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { MAIN_STYLES } from './styles';
import { SCRIPT_ID } from './constants';
export function createAddStyles(deps: any) {
  const addStyles = () => {
    const targetDocument = deps.getTavernHostDocument();
    targetDocument.getElementById('dice-db-theme-sync')?.remove();
    if (targetDocument !== document) {
      document.getElementById('dice-db-theme-sync')?.remove();
    }
    if (window._acuStylesInjected && targetDocument.getElementById(`${SCRIPT_ID}-styles`)) return;
    window._acuStylesInjected = true;

    // 动态加载 Tabler Icons 字体（用于 ti:xxx 图标）
    if (!targetDocument.getElementById('tabler-icons-css')) {
      const iconLink = targetDocument.createElement('link');
      iconLink.id = 'tabler-icons-css';
      iconLink.rel = 'stylesheet';
      iconLink.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css';
      targetDocument.head.appendChild(iconLink);
    }

    targetDocument.getElementById(`${SCRIPT_ID}-styles`)?.remove();
    if (targetDocument !== document) {
      document.getElementById(`${SCRIPT_ID}-styles`)?.remove();
    }
    const styleEl = targetDocument.createElement('style');
    styleEl.id = `${SCRIPT_ID}-styles`;
    styleEl.textContent = MAIN_STYLES;
    targetDocument.head.appendChild(styleEl);
  };
  return addStyles;
}
