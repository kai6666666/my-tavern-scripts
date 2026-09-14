// @ts-nocheck
/**
 * render-gacha-item-icon-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createRenderGachaItemIconContent(deps: any) {
  const renderGachaItemIconContent = (
    item: Pick<GachaItemDefinition, 'name' | 'type' | 'icon'>,
    customContext?: CustomTableNameIconContext | null,
  ): string => {
    const fallback = deps.renderThemeIconContent(item.icon || deps.getElementEmoji(item.name, item.type));
    return deps.renderCustomTableNameIconContent(fallback, customContext);
  };
  return renderGachaItemIconContent;
}
