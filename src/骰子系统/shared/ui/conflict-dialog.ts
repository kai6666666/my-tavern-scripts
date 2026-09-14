// @ts-nocheck
/**
 * conflict-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../actionable-error-toast';
export function createShowConflictDialog(deps: any) {
  const showConflictDialog = () => {
    const { $ } = deps.getCore();
    if (!$) return;

    // 移除可能存在的旧对话框
    $('.dice-conflict-dialog-overlay').remove();

    const dialogHtml = `
      <div class="dice-conflict-dialog-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(4px);
        z-index: 31200;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div class="dice-conflict-dialog" style="
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          padding: 30px;
          box-sizing: border-box;
          animation: diceDialogPop 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          <div style="
            text-align: center;
            margin-bottom: 20px;
          ">
            <div style="
              font-size: 48px;
              color: #e74c3c;
              margin-bottom: 15px;
            ">⚠️</div>
            <h2 style="
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 0 0 10px 0;
            ">脚本冲突检测</h2>
            <p style="
              font-size: 16px;
              color: #666;
              line-height: 1.6;
              margin: 0;
            ">检测到"可视化前端"正在运行</p>
          </div>
          <div style="
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          ">
            <p style="
              font-size: 14px;
              color: #856404;
              line-height: 1.6;
              margin: 0;
            ">
              <strong>提示：</strong>骰子系统与可视化前端功能冲突，不能同时启用。<br>
              请在酒馆助手的脚本管理中，<strong>关闭其中一项后刷新酒馆页面</strong>。
            </p>
          </div>
          <div style="
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            <button id="dice-conflict-close" style="
              background: #6c757d;
              color: #fff;
              border: none;
              border-radius: 8px;
              padding: 12px 24px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              transition: all 0.2s;
              min-width: 120px;
            ">我知道了</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes diceDialogPop {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .dice-conflict-dialog button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .dice-conflict-dialog button:active {
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .dice-conflict-dialog {
            padding: 20px !important;
            margin: 10px !important;
            max-width: calc(100% - 20px) !important;
          }
          .dice-conflict-dialog h2 {
            font-size: 20px !important;
          }
          .dice-conflict-dialog p {
            font-size: 14px !important;
          }
        }
      </style>
    `;

    $('body').append(dialogHtml);

    // 绑定关闭事件
    $('#dice-conflict-close').on('click', function () {
      $('.dice-conflict-dialog-overlay').fadeOut(200, function () {
        $(this).remove();
      });
    });

    // 点击背景关闭
    const $conflictOverlay = $('.dice-conflict-dialog-overlay');
    deps.setupOverlayClose($conflictOverlay, 'dice-conflict-dialog-overlay', () => {
      $conflictOverlay.fadeOut(200, function () {
        $(this).remove();
      });
    });

    // 使用 toastr 作为补充提示（如果可用）
    if (window.toastr) {
      showActionableErrorToast('脚本冲突：骰子系统与可视化前端不能同时启用', {
        title: '冲突检测',
        toastrOptions: {
          timeOut: 0,
          extendedTimeOut: 0,
          closeButton: true,
          preventDuplicates: true,
        },
      });
    }
  };
  return showConflictDialog;
}
