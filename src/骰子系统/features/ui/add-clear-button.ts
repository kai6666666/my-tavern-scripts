// @ts-nocheck
/**
 * add-clear-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAddClearButton(deps: any) {
  const addClearButton = ($panel, inputSelector) => {
    const { $ } = deps.getCore();
    $panel.find(inputSelector).each(function () {
      const $input = $(this);
      // 避免重复添加
      if ($input.parent().hasClass('acu-input-wrapper')) return;
      // 包装输入框
      $input.wrap('<div class="acu-input-wrapper"></div>');
      // 添加清除按钮 - 样式通过 CSS 类控制
      const $clearBtn = $(
        `<button type="button" class="acu-clear-btn" title="清除"><i class="fa-solid fa-times"></i></button>`,
      );
      $input.after($clearBtn);
      // 点击清除
      $clearBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $input.val('').trigger('input').trigger('change').focus();
      });
      // hover 效果已通过 CSS :hover 处理，无需 JS
    });
  };
  return addClearButton;
}
