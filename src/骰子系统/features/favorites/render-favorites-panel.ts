// @ts-nocheck
/**
 * render-favorites-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FavoritesManager } from '../../features/favorites/favorites-manager';
export function createRenderFavoritesPanel(deps: any) {
  const renderFavoritesPanel = async (): Promise<string> => {
    const allFavorites = await FavoritesManager.getAll();
    const allTags = await FavoritesManager.getAllTags();

    // 按标签分组
    const groupedByTag: Record<string, FavoriteItem[]> = {};
    const untagged: FavoriteItem[] = [];

    for (const fav of allFavorites) {
      if (fav.tags && fav.tags.length > 0) {
        for (const tag of fav.tags) {
          if (!groupedByTag[tag]) groupedByTag[tag] = [];
          groupedByTag[tag].push(fav);
        }
      } else {
        untagged.push(fav);
      }
    }

    // 生成卡片HTML (复用普通表格卡片样式 acu-data-card)
    const renderFavoriteCard = (fav: FavoriteItem) => {
      // 显示所有行，不做截断，超过高度内部滚动
      const rowsHtml = fav.header
        .map((h, i) => {
          const renderedCell = deps.renderDataCardCellContent({
            rawHeaderName: h || '属性' + i,
            cell: fav.rowData[i] ?? '',
          });
          if (!renderedCell.shouldRender) return '';
          return `
        <div class="acu-card-row${renderedCell.hideLabel ? ' acu-hide-label' : ''}">
          <div class="acu-card-label">${deps.escapeHtml(renderedCell.headerName)}</div>
          <div class="acu-card-value">${renderedCell.contentHtml}</div>
        </div>
      `;
        })
        .join('');
      const tagsHtml = fav.tags.map(tag => `<span class="acu-fav-tag">${deps.escapeHtml(tag)}</span>`).join('');
      const sourceLabel = fav.sourceInfo ? deps.escapeHtml(fav.sourceInfo.tableName) : '';

      // 复用 acu-data-card 结构，来源标签移到底部与tags一起显示
      return `
        <div class="acu-data-card acu-fav-card" data-id="${deps.escapeHtml(fav.id)}">
          <div class="acu-card-header">
            <span class="acu-editable-title">${deps.escapeHtml(String(fav.rowData[0] || '未命名'))}</span>
          </div>
          <div class="acu-card-body view-list">${rowsHtml}</div>
          <div class="acu-fav-card-tags">
            ${sourceLabel ? `<span class="acu-fav-card-source">${sourceLabel}</span>` : ''}
            ${tagsHtml}
          </div>
        </div>
      `;
    };

    // 获取配置以复用布局选项
    const config = deps.getConfig();

    // 生成分组内容
    let contentHtml = '';

    // 按标签分组，每组使用 acu-card-grid 实现横向滚动
    for (const tag of Object.keys(groupedByTag).sort()) {
      contentHtml += `
        <div class="acu-fav-group">
          <div class="acu-fav-group-title"><i class="fa-solid fa-tag"></i> ${deps.escapeHtml(tag)}</div>
          <div class="acu-card-grid">${groupedByTag[tag].map(renderFavoriteCard).join('')}</div>
        </div>
      `;
    }

    // 未分类
    if (untagged.length > 0) {
      contentHtml += `
        <div class="acu-fav-group">
          <div class="acu-fav-group-title"><i class="fa-solid fa-inbox"></i> 未分类</div>
          <div class="acu-card-grid">${untagged.map(renderFavoriteCard).join('')}</div>
        </div>
      `;
    }

    if (allFavorites.length === 0) {
      contentHtml += `
        <div class="acu-fav-empty">
          <i class="fa-solid fa-star"></i>
          <p>暂无收藏</p>
          <p>右键点击表格行 → 选择"收藏此行"</p>
        </div>
      `;
    }

    return `
      <div class="acu-fav-wrapper acu-theme-${config.theme}" style="--acu-card-width:${config.cardWidth}px; --acu-font-size:${config.fontSize}px;">
      <div class="acu-panel-header">
        <div class="acu-panel-title">
          <div class="acu-title-main"><i class="fa-solid fa-star"></i> <span class="acu-title-text">收藏夹</span></div>
          <div class="acu-title-sub">(共${allFavorites.length}项)</div>
        </div>
        <div class="acu-header-actions">
          ${deps.getTutorialButtonHtml('favorites', '查看收藏夹教程')}
          <span class="acu-fav-transfer-actions">
          <button type="button" class="acu-view-btn" id="acu-fav-import" title="导入" aria-label="导入收藏"><i class="fa-solid fa-file-import"></i></button>
          <button type="button" class="acu-view-btn" id="acu-fav-export" title="导出" aria-label="导出收藏"><i class="fa-solid fa-file-export"></i></button>
          </span>
          <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" id="acu-fav-search" placeholder="搜索..." /></div>
          <div class="acu-height-control"><i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="收藏夹" title="拖动调整面板高度，双击恢复默认" aria-label="拖动调整收藏夹面板高度"></i></div>
          <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭收藏夹"><i class="fa-solid fa-times"></i></button>
        </div>
      </div>
      <div class="acu-fav-panel-content">
        <div class="acu-fav-tag-filter-collapsible collapsed">
          <div class="acu-fav-tag-filter-header">
            <span>标签过滤</span>
            <i class="fa-solid fa-chevron-down acu-fav-tag-toggle-icon"></i>
          </div>
          <div class="acu-fav-tag-filter-body">
            ${untagged.length > 0 ? '<button type="button" class="acu-fav-tag-btn active" data-tag="__untagged__">未分类</button>' : ''}
            ${allTags.map(tag => `<button type="button" class="acu-fav-tag-btn active" data-tag="${deps.escapeHtml(tag)}">${deps.escapeHtml(tag)}</button>`).join('')}
          </div>
        </div>
        ${contentHtml}
      </div>
      </div>
    `;
  };
  return renderFavoritesPanel;
}
