// @ts-nocheck
/**
 * init-custom-dropdown.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInitCustomDropdown(deps: any) {
  const initCustomDropdown = ($input, options) => {
    const { $ } = deps.getCore();
    const inputId = $input.attr('id') || 'dd_' + Math.random().toString(36).substr(2, 9);
    $input.attr('id', inputId);

    // 移除已存在的下拉
    $input.parent().find('.acu-dropdown-list').remove();

    // 包裹成 wrapper
    if (!$input.parent().hasClass('acu-dropdown-wrapper')) {
      $input.wrap('<div class="acu-dropdown-wrapper"></div>');
    }

    // 创建下拉列表 - 样式通过 CSS 类控制
    const $dropdown = $(`<div class="acu-dropdown-list" data-for="${inputId}"></div>`);
    $input.after($dropdown);

    const renderItems = (filter = '') => {
      const lowerFilter = filter.toLowerCase();
      const filtered = options.filter(opt => opt.toLowerCase().includes(lowerFilter));

      if (filtered.length === 0) {
        $dropdown.html(`<div class="acu-dropdown-empty">无匹配项</div>`);
      } else {
        $dropdown.html(
          filtered
            .map(opt => `<div class="acu-dropdown-item" data-value="${deps.escapeHtml(opt)}">${deps.escapeHtml(opt)}</div>`)
            .join(''),
        );
      }
    };

    const showDropdown = () => {
      $('.acu-dropdown-list').removeClass('visible');
      renderItems($input.val());
      $dropdown.addClass('visible');
    };

    const hideDropdown = () => {
      $dropdown.removeClass('visible');
    };

    // 点击输入框显示下拉
    $input.off('.acudd').on('focus.acudd click.acudd', function (e) {
      e.stopPropagation();
      showDropdown();
    });

    // 输入筛选
    $input.on('input.acudd', function () {
      renderItems($(this).val());
    });

    // hover 效果已通过 CSS :hover 处理，无需 JS

    // 选择项目
    $dropdown.on('click', '.acu-dropdown-item', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const val = $(this).data('value');
      $input.val(val).trigger('change');
      hideDropdown();
    });

    // 点击下拉列表本身不关闭
    $dropdown.on('click', function (e) {
      e.stopPropagation();
    });

    // 点击面板其他区域关闭
    $input
      .closest('.acu-dice-panel, .acu-contest-panel')
      .off('click.acudd_' + inputId)
      .on('click.acudd_' + inputId, function (e) {
        if (!$(e.target).closest('.acu-dropdown-wrapper').length) {
          hideDropdown();
        }
      });
  };
  return initCustomDropdown;
}
