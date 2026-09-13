// @ts-nocheck
/**
 * execute-table-interaction-action.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExecuteTableInteractionAction(deps: any) {
  const executeTableInteractionAction = (
    action:
      | {
          label: string;
          icon?: string;
          type?: string;
          template?: string;
          auto_send?: boolean;
        }
      | undefined,
    headers: unknown[],
    rowData: unknown[],
  ) => {
    if (!action) return false;

    if (action.type === 'skill_check') {
      const skillName = String(rowData[1] ?? '技能');
      let checkValue: number | null = null;
      const attrValIdx = headers.findIndex(header => header && String(header).includes('属性值'));
      const profIdx = headers.findIndex(
        header => header && (String(header).includes('熟练') || String(header).includes('等级')),
      );

      if (attrValIdx > 0 && rowData[attrValIdx]) {
        const value = deps.extractNumericValue(rowData[attrValIdx]);
        if (value > 0) checkValue = value;
      }
      if (checkValue === null && profIdx > 0 && rowData[profIdx]) {
        const value = deps.extractNumericValue(rowData[profIdx]);
        if (value > 0) checkValue = value;
      }

      const promptText = deps.processTemplate(action.template, rowData, headers);
      deps.smartInsertToTextarea(promptText, 'action');

      if (checkValue !== null && checkValue > 0) {
        deps.showDicePanel({
          attrValue: checkValue,
          targetValue: null,
          targetName: skillName,
          initiatorName: '<user>',
        });
      } else {
        $('#send_textarea').focus();
      }
      return true;
    }

    if (!action.template) return false;

    if (action.label === '交谈') {
      const { $ } = deps.getCore();
      const targetName = String(rowData[1] ?? rowData[0] ?? '对方').trim() || '对方';
      const config = deps.getConfig();
      $('.acu-msg-overlay').remove();

      const overlay = $(`
        <div class="acu-msg-overlay acu-theme-${config.theme}" role="dialog" aria-modal="true" aria-label="发送消息">
          <div class="acu-msg-dialog">
            <div class="acu-msg-title">
              <i class="fa-solid fa-comment"></i> 发送消息给 ${deps.escapeHtml(targetName)}
            </div>
            <input type="text" id="acu-msg-input" class="acu-msg-input" placeholder="输入消息内容..." autofocus>
            <div class="acu-msg-actions">
              <button type="button" id="acu-msg-cancel" class="acu-msg-cancel">取消</button>
              <button type="button" id="acu-msg-send" class="acu-msg-send">发送</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(overlay);
      const overlayEl = overlay[0];
      overlayEl.style.setProperty('position', 'fixed', 'important');
      overlayEl.style.setProperty('top', '0', 'important');
      overlayEl.style.setProperty('left', '0', 'important');
      overlayEl.style.setProperty('right', '0', 'important');
      overlayEl.style.setProperty('bottom', '0', 'important');
      overlayEl.style.setProperty('width', '100vw', 'important');
      overlayEl.style.setProperty('height', '100vh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31100', 'important');
      setTimeout(() => overlay.find('#acu-msg-input').focus(), 50);

      const sendMessage = () => {
        const msg = String(overlay.find('#acu-msg-input').val() || '').trim();
        if (msg) {
          deps.smartInsertToTextarea(`<user>对${targetName}说：“${msg}”`, 'action');
          $('#send_textarea').focus();
        }
        overlay.remove();
      };

      overlay.find('#acu-msg-send').click(sendMessage);
      overlay.find('#acu-msg-input').on('keydown', function (ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          sendMessage();
        }
      });
      overlay.find('#acu-msg-cancel').click(() => overlay.remove());
      deps.setupOverlayClose(overlay, 'acu-msg-overlay', () => overlay.remove());
      return true;
    }

    const promptText = deps.processTemplate(action.template, rowData, headers);
    deps.smartInsertToTextarea(promptText, 'action');
    $('#send_textarea').focus();
    return true;
  };
  return executeTableInteractionAction;
}
