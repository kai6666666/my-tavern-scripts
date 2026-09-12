// @ts-nocheck
/**
 * apply-config-styles.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createApplyConfigStyles(deps: any) {
  const applyConfigStyles = config => {
    const targetDocument = deps.getTavernHostDocument();
    const fontVal = deps.FONTS.find(f => f.id === config.fontFamily)?.val || deps.FONTS[0].val;

    // [优化] 只有字体 ID 变化时才重写 Style 标签，避免闪烁
    const styleTag = targetDocument.getElementById('acu-dynamic-font');
    const currentFontId = styleTag?.getAttribute('data-font-id');

    if (currentFontId !== config.fontFamily) {
      styleTag?.remove();
      if (targetDocument !== document) {
        document.getElementById('acu-dynamic-font')?.remove();
      }
      const fontImport = `
                @import url("https://fontsapi.zeoseven.com/3/main/result.css");
                @import url("https://fontsapi.zeoseven.com/442/main/result.css");
                @import url("https://fontsapi.zeoseven.com/256/main/result.css");
                @import url("https://fontsapi.zeoseven.com/482/main/result.css");
                @import url("https://fontsapi.zeoseven.com/446/main/result.css");
                @import url("https://fontsapi.zeoseven.com/570/main/result.css");
                @import url("https://fontsapi.zeoseven.com/292/main/result.css");
                @import url("https://fontsapi.zeoseven.com/69/main/result.css");
                @import url("https://fontsapi.zeoseven.com/7/main/result.css");
            `;
      const dynamicStyle = targetDocument.createElement('style');
      dynamicStyle.id = 'acu-dynamic-font';
      dynamicStyle.setAttribute('data-font-id', config.fontFamily);
      dynamicStyle.textContent = `
                    ${fontImport}
                    ${DICE_ROOT_SELECTOR},
                    ${DICE_ROOT_SELECTOR} *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-edit-overlay,
                    .acu-edit-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-dice-panel,
                    .acu-dice-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-contest-panel,
                    .acu-contest-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
                    .acu-dice-config-dialog,
                    .acu-relation-graph-container, .acu-avatar-manager, .acu-import-confirm-dialog, .acu-inventory-overlay, .acu-inventory-shell, .acu-inventory-detail,
                    .acu-gacha-overlay, .acu-embedded-options-container, .acu-option-panel, .acu-opt-btn, .acu-check-suggestion-btn {
                        font-family: ${fontVal} !important;
                    }
                `;
      targetDocument.head.appendChild(dynamicStyle);
    }

    // [优化] 尺寸和颜色变化只更新 CSS 变量，完全不闪烁
    const navMetrics = deps.getNavigationFontMetrics(config.navFontSize);
    const cssVars = {
      '--acu-card-width': `${config.cardWidth}px`,
      '--acu-font-size': `${config.fontSize}px`,
      '--acu-opt-font-size': `${config.optionFontSize || 12}px`,
      '--acu-nav-button-size': `${navMetrics.buttonSize}px`,
      '--acu-nav-font-size': `${navMetrics.fontSize}px`,
      '--acu-nav-icon-size': `${navMetrics.iconSize}px`,
      '--acu-nav-button-padding-x': `${navMetrics.paddingX}px`,
      '--acu-grid-cols': config.gridColumns,
    };

    deps.collectHostAndLocalNodes<HTMLElement>(`${DICE_ROOT_SELECTOR}, .acu-embedded-options-container`).forEach(node => {
      Array.from(node.classList)
        .filter(className => className.startsWith('acu-theme-'))
        .forEach(className => node.classList.remove(className));
      node.classList.add(`acu-theme-${config.theme}`);
      if (node.classList.contains('acu-wrapper')) {
        node.classList.toggle('acu-desktop-nav-aligned', config.desktopNavAligned === true);
      }
      Object.entries(cssVars).forEach(([key, value]) => {
        node.style.setProperty(key, String(value));
      });
    });

    return fontVal;
  };
  return applyConfigStyles;
}
