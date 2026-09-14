// @ts-nocheck
/**
 * favorites-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FavoritesManager } from './favorites-manager';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowFavoritesPanel(deps: any) {
  const showFavoritesPanel = async () => {
    const { $ } = deps.getCore();
    $('.acu-favorites-overlay').remove();

    const config = deps.getConfig();

    // 获取所有收藏和标签
    const allFavorites = await FavoritesManager.getAll();
    const allTags = await FavoritesManager.getAllTags();

    // 获取当前聊天的表格（用于新建卡片选择模板）
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const currentTables = rawData || {};

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

    // 生成卡片HTML
    const renderFavoriteCard = (fav: FavoriteItem) => {
      const preview = fav.header
        .slice(0, 3)
        .map(
          (h, i) =>
            `<span class="acu-fav-preview-item"><b>${deps.escapeHtml(h)}:</b> ${deps.escapeHtml(String(fav.rowData[i] || ''))}</span>`,
        )
        .join('');
      const tagsHtml = fav.tags.map(tag => `<span class="acu-favorites-tag">${deps.escapeHtml(tag)}</span>`).join('');
      const sourceInfo = fav.sourceInfo ? `来自: ${deps.escapeHtml(fav.sourceInfo.tableName)}` : '';

      return `
        <div class="acu-favorites-card" data-id="${deps.escapeHtml(fav.id)}">
          <div class="acu-favorites-card-header">
            <div class="acu-favorites-card-preview">${preview}</div>
            <div class="acu-favorites-card-source">${sourceInfo}</div>
          </div>
          <div class="acu-favorites-card-tags">${tagsHtml}</div>
          <div class="acu-favorites-card-actions">
            <button class="acu-fav-btn acu-fav-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
            <button class="acu-fav-btn acu-fav-copy" title="复制"><i class="fa-solid fa-copy"></i></button>
            <button class="acu-fav-btn acu-fav-send" title="发送到表格"><i class="fa-solid fa-paper-plane"></i></button>
            <button class="acu-fav-btn acu-fav-delete" title="删除"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    };

    // 生成分组内容HTML
    let contentHtml = '';

    // 按标签分组显示
    for (const tag of Object.keys(groupedByTag).sort()) {
      contentHtml += `
        <div class="acu-favorites-group">
          <div class="acu-favorites-group-title"><i class="fa-solid fa-tag"></i> ${deps.escapeHtml(tag)} (${groupedByTag[tag].length})</div>
          <div class="acu-favorites-group-cards">
            ${groupedByTag[tag].map(renderFavoriteCard).join('')}
          </div>
        </div>
      `;
    }

    // 无标签的平铺显示
    if (untagged.length > 0) {
      contentHtml += `
        <div class="acu-favorites-group">
          <div class="acu-favorites-group-title"><i class="fa-solid fa-inbox"></i> 未分类 (${untagged.length})</div>
          <div class="acu-favorites-group-cards">
            ${untagged.map(renderFavoriteCard).join('')}
          </div>
        </div>
      `;
    }

    if (allFavorites.length === 0) {
      contentHtml = `
        <div class="acu-favorites-empty">
          <i class="fa-solid fa-star" style="font-size: 48px; opacity: 0.3;"></i>
          <p>暂无收藏</p>
          <p style="font-size: 12px; opacity: 0.7;">右键点击表格行 → 选择"收藏此行"</p>
        </div>
      `;
    }

    // 标签筛选下拉
    const tagFilterOptions = allTags
      .map(tag => `<option value="${deps.escapeHtml(tag)}">${deps.escapeHtml(tag)}</option>`)
      .join('');

    const overlayHtml = `
      <div class="acu-favorites-overlay acu-theme-${config.theme}">
        <div class="acu-favorites-panel">
          <div class="acu-favorites-header">
            <h3><i class="fa-solid fa-star"></i> 收藏夹</h3>
            <div class="acu-favorites-header-actions">
              <button class="acu-fav-header-btn" id="acu-fav-new" title="新建卡片"><i class="fa-solid fa-plus"></i> 新建</button>
              <button class="acu-fav-header-btn" id="acu-fav-import" title="导入"><i class="fa-solid fa-file-import"></i> 导入</button>
              <button class="acu-fav-header-btn" id="acu-fav-export" title="导出"><i class="fa-solid fa-file-export"></i> 导出</button>
              <button class="acu-fav-header-btn acu-fav-close" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-favorites-filter">
            <select id="acu-fav-tag-filter">
              <option value="">全部标签</option>
              ${tagFilterOptions}
            </select>
            <input type="text" id="acu-fav-search" placeholder="搜索收藏..." />
          </div>
          <div class="acu-favorites-content">
            ${contentHtml}
          </div>
        </div>
      </div>
    `;

    $('body').append(overlayHtml);

    const $overlay = $('.acu-favorites-overlay');
    const $panel = $overlay.find('.acu-favorites-panel');

    // 关闭面板
    const closePanel = () => {
      $overlay.remove();
    };

    $overlay.on('click', e => {
      if ($(e.target).hasClass('acu-favorites-overlay')) {
        closePanel();
      }
    });

    $panel.find('.acu-fav-close').on('click', closePanel);

    // 标签筛选
    $panel.find('#acu-fav-tag-filter').on('change', async function () {
      const tag = $(this).val() as string;
      const filtered = tag ? await FavoritesManager.getByTag(tag) : await FavoritesManager.getAll();
      const $content = $panel.find('.acu-favorites-content');

      if (filtered.length === 0) {
        $content.html('<div class="acu-favorites-empty"><p>没有匹配的收藏</p></div>');
      } else {
        $content.html(`<div class="acu-favorites-group-cards">${filtered.map(renderFavoriteCard).join('')}</div>`);
      }
    });

    // 搜索
    $panel.find('#acu-fav-search').on('input', async function () {
      const query = ($(this).val() as string).toLowerCase().trim();
      const all = await FavoritesManager.getAll();
      const filtered = query
        ? all.filter(fav => {
            const headerMatch = fav.header.some(h => h.toLowerCase().includes(query));
            const dataMatch = fav.rowData.some(d => String(d).toLowerCase().includes(query));
            const tagMatch = fav.tags.some(t => t.toLowerCase().includes(query));
            return headerMatch || dataMatch || tagMatch;
          })
        : all;

      const $content = $panel.find('.acu-favorites-content');
      if (filtered.length === 0) {
        $content.html('<div class="acu-favorites-empty"><p>没有匹配的收藏</p></div>');
      } else {
        $content.html(`<div class="acu-favorites-group-cards">${filtered.map(renderFavoriteCard).join('')}</div>`);
      }
    });

    // 编辑卡片
    $panel.on('click', '.acu-fav-edit', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const fav = await FavoritesManager.getById(id);
      if (!fav) return;

      deps.showFavoriteEditModal(fav, async updated => {
        await FavoritesManager.updateFavorite(id, updated);
        toastr.success('保存成功');
        closePanel();
        showFavoritesPanel();
      });
    });

    // 复制卡片
    $panel.on('click', '.acu-fav-copy', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const result = await FavoritesManager.duplicateFavorite(id);
      if (result) {
        toastr.success('复制成功');
        closePanel();
        showFavoritesPanel();
      } else {
        showActionableErrorToast('复制失败', { suggestion: '请重试复制；如果仍失败，请刷新收藏面板后再试。' });
      }
    });

    // 发送到表格
    $panel.on('click', '.acu-fav-send', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const fav = await FavoritesManager.getById(id);
      if (!fav) return;

      const compatible = FavoritesManager.findCompatibleTables(fav, currentTables);
      if (compatible.length === 0) {
        toastr.warning('当前聊天没有兼容的表格');
        return;
      }

      deps.showSendToTableModal(fav, compatible, currentTables, () => {
        toastr.success('发送成功');
        closePanel();
        deps.renderInterface();
      });
    });

    // 删除卡片
    $panel.on('click', '.acu-fav-delete', async function () {
      const id = $(this).closest('.acu-favorites-card').data('id');
      const confirmed = await deps.showDiceSystemConfirmDialog({
        title: '删除收藏',
        message: '确定要删除这个收藏吗？',
        detail: '删除后需要重新从表格行收藏才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除收藏',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;

      const result = await FavoritesManager.deleteFavorite(id);
      if (result) {
        toastr.success('删除成功');
        $(this)
          .closest('.acu-favorites-card')
          .fadeOut(200, function () {
            $(this).remove();
          });
      } else {
        showActionableErrorToast('删除失败', { title: '收藏删除失败', suggestion: 'save' });
      }
    });

    // 新建卡片
    $panel.find('#acu-fav-new').on('click', () => {
      const tableKeys = Object.keys(currentTables);
      if (tableKeys.length === 0) {
        toastr.warning('当前聊天没有表格模板');
        return;
      }

      deps.showNewFavoriteModal(currentTables, async (header, tableName) => {
        const emptyRowData = header.map(() => '');
        const newFav = await FavoritesManager.addFavorite('', tableName, header, emptyRowData, []);
        if (newFav) {
          toastr.success('创建成功');
          closePanel();
          showFavoritesPanel();
          // 立即打开编辑
          setTimeout(async () => {
            const freshFav = await FavoritesManager.getById(newFav.id);
            if (freshFav) {
              deps.showFavoriteEditModal(freshFav, async updated => {
                await FavoritesManager.updateFavorite(newFav.id, updated);
                toastr.success('保存成功');
                $('.acu-favorites-overlay').remove();
                showFavoritesPanel();
              });
            }
          }, 100);
        }
      });
    });

    // 导出
    $panel.find('#acu-fav-export').on('click', async () => {
      const json = await FavoritesManager.exportFavorites();
      if (!json) {
        showActionableErrorToast('导出失败', { title: '收藏导出失败', suggestion: 'importExport' });
        return;
      }

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      a.href = url;
      a.download = `favorites_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toastr.success('导出成功');
    });

    // 导入
    $panel.find('#acu-fav-import').on('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const result = await FavoritesManager.importFavorites(text);
          if (result) {
            toastr.success(`导入成功: ${result.added}项新增, ${result.updated}项更新`);
            closePanel();
            showFavoritesPanel();
          } else {
            showActionableErrorToast('导入失败: 格式无效', { suggestion: 'importExport' });
          }
        } catch (err) {
          showActionableErrorToast('导入失败: ' + (err instanceof Error ? err.message : String(err)), {
            suggestion: 'importExport',
          });
        }
      };
      input.click();
    });
  };
  return showFavoritesPanel;
}
