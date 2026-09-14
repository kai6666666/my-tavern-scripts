// @ts-nocheck
/**
 * init-sortable.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createInitSortable(deps: any) {
  const initSortable = ($root?: JQuery<HTMLElement>) => {
    const { $ } = deps.getCore();
    const $scope = $root && $root.length ? $root : $(DICE_ROOT_SELECTOR).last();
    let $dragSrcEl = null;

    // 清理旧事件
    $scope.find('.acu-nav-btn, .acu-action-btn, #acu-action-pool, #acu-active-actions').off('.sort');

    // --- 1. 按钮本身的拖拽逻辑 (交换顺序) ---
    const $items = $scope.find('.acu-nav-btn, .acu-action-btn');

    $items.on('dragstart.sort', function (e) {
      $dragSrcEl = $(this);
      $(this).css('opacity', '0.4');
      e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $items.on('dragend.sort', function (e) {
      $(this).css('opacity', '1');
      $scope.find('.acu-drag-over').removeClass('acu-drag-over');
      $scope.find('.acu-actions-group, .acu-unused-pool').removeClass('dragging-over');
    });

    $items.on('dragover.sort', function (e) {
      e.preventDefault();
      return false;
    });
    $items.on('dragenter.sort', function () {
      if ($dragSrcEl && this !== $dragSrcEl[0]) $(this).addClass('acu-drag-over');
    });
    $items.on('dragleave.sort', function () {
      $(this).removeClass('acu-drag-over');
    });

    $items.on('drop.sort', function (e) {
      e.stopPropagation();
      $(this).removeClass('acu-drag-over');
      if (!$dragSrcEl || $dragSrcEl[0] === this) return false;

      const isSrcAction = $dragSrcEl.hasClass('acu-action-btn');
      const isTgtAction = $(this).hasClass('acu-action-btn');
      if (isSrcAction !== isTgtAction) return false;

      if (isSrcAction) {
        const targetPoolId = $(this).parent().attr('id');
        const srcPoolId = $dragSrcEl.parent().attr('id');

        if (srcPoolId === 'acu-action-pool' && targetPoolId === 'acu-active-actions') {
          if ($scope.find('#acu-active-actions').children().length >= deps.MAX_ACTION_BUTTONS) {
            if (window.toastr) window.toastr.warning('活动栏最多6个，请先拖走一个');
            return false;
          }
        }

        if (srcPoolId !== targetPoolId) {
          $(this).before($dragSrcEl);
          return false;
        }
      }

      const $temp = $('<span>').hide();
      $dragSrcEl.before($temp);
      $(this).before($dragSrcEl);
      $temp.replaceWith($(this));
      return false;
    });

    // --- 2. 容器的拖拽逻辑 (上架/下架) ---
    const $containers = $scope.find('#acu-action-pool, #acu-active-actions');

    $containers.on('dragover.sort', function (e) {
      e.preventDefault();
      if ($dragSrcEl && $dragSrcEl.hasClass('acu-action-btn')) {
        $(this).addClass('dragging-over');
      }
    });

    $containers.on('dragleave.sort', function (e) {
      $(this).removeClass('dragging-over');
    });

    $containers.on('drop.sort', function (e) {
      e.stopPropagation();
      $(this).removeClass('dragging-over');

      if ($dragSrcEl && $dragSrcEl.hasClass('acu-action-btn')) {
        const currentParentId = $dragSrcEl.parent().attr('id');
        const targetId = $(this).attr('id');
        const btnId = $dragSrcEl.attr('id');

        if (currentParentId !== targetId) {
          if (targetId === 'acu-action-pool') {
            if (btnId === 'acu-btn-settings') {
              if (window.toastr) window.toastr.warning('设置按钮是核心组件，无法移除');
              return false;
            }
            $(this).append($dragSrcEl);
          } else if (targetId === 'acu-active-actions') {
            if ($(this).children().length >= 6) {
              if (window.toastr) window.toastr.warning('活动栏已满6个，无法继续添加');
              return false;
            }
            $(this).append($dragSrcEl);
          }
        }
      }
      return false;
    });

    // --- 【新增】3. 容器点击事件 - 支持点动移动功能按钮 ---
    $containers.on('click.sort', function (e) {
      e.stopPropagation();

      // 如果点击的是按钮本身，不处理
      if ($(e.target).closest('.acu-action-btn, .acu-nav-btn').length > 0) return;

      // 如果没有选中任何按钮，不处理
      if (!deps.getSelectedSwapSource()) return;

      const $src = $(deps.getSelectedSwapSource());

      // 只有功能按钮才能跨池移动
      if (!$src.hasClass('acu-action-btn')) {
        if (window.toastr) window.toastr.warning('表格标签不能移入功能池');
        $src.removeClass('acu-swap-selected');
        deps.setSelectedSwapSource(null);
        return;
      }

      const srcPoolId = $src.parent().attr('id');
      const targetId = $(this).attr('id');
      const btnId = $src.attr('id');

      // 同一个容器内点击，取消选中
      if (srcPoolId === targetId) {
        $src.removeClass('acu-swap-selected');
        deps.setSelectedSwapSource(null);
        return;
      }

      // 活动栏 → 备选池
      if (targetId === 'acu-action-pool') {
        if (btnId === 'acu-btn-settings') {
          if (window.toastr) window.toastr.warning('设置按钮是核心组件，无法移除');
          $src.removeClass('acu-swap-selected');
          deps.setSelectedSwapSource(null);
          return;
        }
        $(this).append($src);
        $src.removeClass('acu-swap-selected');
        deps.setSelectedSwapSource(null);
      }
      // 备选池 → 活动栏
      else if (targetId === 'acu-active-actions') {
        if ($scope.find('#acu-active-actions').children().length >= deps.MAX_ACTION_BUTTONS) {
          if (window.toastr) window.toastr.warning('活动栏已满6个，请先移走一个');
          return;
        }
        $(this).append($src);
        $src.removeClass('acu-swap-selected');
        deps.setSelectedSwapSource(null);
      }
    });

    // --- 4. 点击互换模式 (Click-to-Swap) - 按钮之间 ---
    $items.on('click.sort', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (deps.getSelectedSwapSource() && deps.getSelectedSwapSource() === this) {
        $(this).removeClass('acu-swap-selected');
        deps.setSelectedSwapSource(null);
        return;
      }

      if (!deps.getSelectedSwapSource()) {
        deps.setSelectedSwapSource(this);
        $(this).addClass('acu-swap-selected');
        return;
      }

      const $src = $(deps.getSelectedSwapSource());
      const $tgt = $(this);

      const isSrcAction = $src.hasClass('acu-action-btn');
      const isTgtAction = $tgt.hasClass('acu-action-btn');
      if (isSrcAction !== isTgtAction) {
        if (window.toastr) window.toastr.warning('无法在表格标签和功能按钮之间交换');
        $src.removeClass('acu-swap-selected');
        deps.setSelectedSwapSource(this);
        $(this).addClass('acu-swap-selected');
        return;
      }

      const srcPoolId = $src.parent().attr('id');
      const tgtPoolId = $tgt.parent().attr('id');

      if (isSrcAction && srcPoolId === 'acu-action-pool' && tgtPoolId === 'acu-active-actions') {
        if ($scope.find('#acu-active-actions').children().length >= deps.MAX_ACTION_BUTTONS) {
          if (window.toastr) window.toastr.warning('活动栏最多6个，请先移走一个');
          return;
        }
      }

      if (srcPoolId !== tgtPoolId) {
        $tgt.before($src);
      } else {
        const $temp = $('<span>').hide();
        $src.before($temp);
        $tgt.before($src);
        $temp.replaceWith($tgt);
      }

      $src.removeClass('acu-swap-selected');
      deps.setSelectedSwapSource(null);
    });
  };
  return initSortable;
}
