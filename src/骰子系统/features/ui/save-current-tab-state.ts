// @ts-nocheck
/**
 * save-current-tab-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveCurrentTabState(deps: any) {
  const saveCurrentTabState = () => {
    const { $ } = deps.getCore();
    const activeTab = deps.getActiveTabState();
    const $content = $('.acu-panel-content');

    if (activeTab && $content.length) {
      const innerScrolls = {};
      // 遍历所有卡片，记录内部滚动条位置
      $content.find('.acu-data-card, .acu-card-body, .acu-edit-textarea').each(function () {
        if (this.scrollTop > 0) {
          // 尝试找到这张卡片的唯一标识 (Row Index)
          const $card = $(this).closest('.acu-data-card');
          const rIdx = $card.find('.acu-editable-title').data('row');
          // 如果是编辑框，还要加特殊标记
          const isEdit = $(this).hasClass('acu-edit-textarea');

          if (rIdx !== undefined) {
            const key = isEdit ? `edit-${rIdx}` : rIdx;
            innerScrolls[key] = this.scrollTop;
          }
        }
      });

      // 存入全局状态对象
      deps.getTableScrollStates()[activeTab] = {
        left: $content.scrollLeft(),
        top: $content.scrollTop(),
        inner: innerScrolls,
        timestamp: Date.now(), // 加个时间戳方便调试
      };
    }
  };
  return saveCurrentTabState;
}
