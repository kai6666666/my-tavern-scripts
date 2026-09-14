// @ts-nocheck
/**
 * toggle-order-edit-mode.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
export function createToggleOrderEditMode(deps: any) {
  const toggleOrderEditMode = () => {
    const { $ } = deps.getCore();
    deps.setIsEditingOrder(!deps.getIsEditingOrder());

    const $root = $(DICE_ROOT_SELECTOR).last();
    const $container = $root.find('#acu-nav-bar');
    const $hint = $root.find('#acu-order-hint');
    const $pool = $root.find('#acu-action-pool');

    // 检查必要元素是否存在
    if (!$container.length) {
      console.error('[DICE]ACU 找不到导航栏容器');
      deps.setIsEditingOrder(false);
      return;
    }

    deps.setSelectedSwapSource(null);
    $root.find('.acu-swap-selected').removeClass('acu-swap-selected');

    if (deps.getIsEditingOrder()) {
      // 进入编辑模式
      $container.addClass('editing-order');
      if ($pool.length) $pool.addClass('visible');

      if ($hint.length) {
        $hint
          .html(
            `
                    <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:8px;">
                        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:200px;">
                            <span><i class="fa-solid fa-layer-group"></i> 布局编辑</span>
                            <span style="font-size:11px; opacity:0.9; font-weight:normal;">拖动或点击交换位置</span>
                        </div>
                        <button id="acu-btn-finish-sort" class="acu-btn-finish-sort">
                            <i class="fa-solid fa-check"></i> 完成保存
                        </button>
                    </div>
                `,
          )
          .addClass('visible')
          .css('display', 'flex');

        $root.find('#acu-btn-finish-sort').hover(
          function () {
            $(this).addClass('hover');
          },
          function () {
            $(this).removeClass('hover');
          },
        );

        $root
          .find('#acu-btn-finish-sort')
          .off('click')
          .on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            toggleOrderEditMode();
          });
      }

      // 关闭数据面板
      $root.find('#acu-data-area').removeClass('visible');
      deps.syncHostRegenerateButtonVisibility($root);

      // 设置可拖拽属性（排除投骰按钮，避免影响快捷投骰入口）
      $container.find('.acu-nav-btn').not('#acu-btn-dice-nav').attr('draggable', 'true');
      $container.find('.acu-action-btn').attr('draggable', 'true');

      // 初始化拖拽
      deps.initSortable($root);
    } else {
      // 退出编辑模式
      $container.removeClass('editing-order');
      if ($hint.length) $hint.removeClass('visible').hide();
      if ($pool.length) $pool.removeClass('visible');

      // 移除拖拽属性和事件
      $container.find('.acu-nav-btn, .acu-action-btn').attr('draggable', 'false');
      $root.find('.acu-nav-btn, .acu-action-btn').off('.sort');
      $root.find('#acu-action-pool, #acu-active-actions').off('.sort');

      // 保存导航盘入口顺序
      const newTableOrder = [];
      $container.find('.acu-nav-btn[data-nav-key], .acu-nav-btn[data-table]').each(function () {
        const navKey = $(this).data('nav-key');
        const tableName = $(this).data('table');
        const orderKey = navKey || tableName;
        if (orderKey) {
          newTableOrder.push(String(orderKey));
        }
      });
      if (newTableOrder.length > 0) {
        deps.saveTableOrder(newTableOrder);
      }

      // 保存功能按钮顺序
      const newActionOrder = [];
      $root.find('#acu-active-actions .acu-action-btn').each(function () {
        const btnId = $(this).attr('id');
        if (btnId) {
          newActionOrder.push(btnId);
        }
      });

      // 保护设置按钮
      if (!newActionOrder.includes('acu-btn-settings')) {
        newActionOrder.push('acu-btn-settings');
      }

      Store.set(deps.STORAGE_KEY_ACTION_ORDER, newActionOrder);

      // 重绘界面
      deps.renderInterface();
    }
  };
  return toggleOrderEditMode;
}
