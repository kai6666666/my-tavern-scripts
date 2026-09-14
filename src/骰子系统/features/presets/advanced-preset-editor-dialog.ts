// @ts-nocheck
/**
 * advanced-preset-editor-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowAdvancedPresetEditor(deps: any) {
  const showAdvancedPresetEditor = (presetId: string | null = null) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showAdvancedPresetEditor', () => showAdvancedPresetEditor(presetId));

    const config = deps.getConfig();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? deps.AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId) : null;

    const defaultJsonText = existingPreset
      ? JSON.stringify(JSON.parse(JSON.stringify(existingPreset)), null, 2)
      : deps.buildNewAdvancedPresetJsoncTemplate();
    const defaultData = deps.parseJsoncRecord(defaultJsonText, '检定预设配置');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-pen"></i> ${isEdit ? '编辑' : '新建'}检定预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('advancedPresetEditor', '查看新建检定预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭检定预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="advanced-preset-name">预设名称</label>
                <input id="advanced-preset-name" type="text" value="${deps.escapeHtml(defaultData.name)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="advanced-preset-desc">描述</label>
                <input id="advanced-preset-desc" type="text" value="${deps.escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="advanced-preset-json">
                  JSONC配置
                  <span>支持 AI 回复、Markdown 代码块、// 与 /* */ 注释、尾随逗号</span>
                </label>
              </div>
              <textarea id="advanced-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea"></textarea>
              <div id="advanced-preset-format-help-summary" class="acu-advanced-preset-format-help-summary">
                <strong>配置格式：</strong>
                <span>检定预设由骰子公式、输入字段、判定结果、对抗规则和输出模板组成。下方列出常用结构；完整协议请优先参考下载的 AI 提示词。</span>
              </div>
              <div id="advanced-preset-format-help" class="acu-advanced-preset-format-help">
              <strong>骰子表达式 (diceExpression)</strong><br/>
              • 基础: "1d20", "3d6", "4dF" (Fate骰)<br/>
              • 复合加减: "1d20+3", "2d6+1d4-1"<br/>
              • 重掷: "4d6r1" (持续重掷1), "4d6ro1" (只重掷一次), "4d6r&lt;=2"<br/>
              • 保留/舍弃: "4d6kh3" (保留最高3个), "2d20kl1" (保留最低1个)<br/>
              • 成功计数: "4d6=3" (统计=3的个数), "6d10>=7" (统计≥7的个数)<br/>
              • CoC奖惩骰: "1d100b1" (奖励骰), "1d100p2" (2个惩罚骰)<br/>
              • 爆炸骰: "4d6!" (最大值爆炸), "4d6!!" (累加爆炸), "4d6!>=6"<br/>
              • 修饰符顺序: b/p → r/ro → !/!! → kh/kl/dh/dl → 成功计数<br/>
              <br/>
              <strong>表达式变量</strong><br/>
              • $roll.total: 骰子结果总和（或成功计数）<br/>
              • $roll.hasTag('nat20') / $roll.hasTag('nat1'): 仅 d20 自动产生<br/>
              • $attr, $attrMod, $dc, $mod, $skillMod: 内置输入字段值<br/>
              • $字段ID: customFields 或 derivedVars 提供的变量<br/>
              <br/>
              <strong>输入字段配置</strong><br/>
              • attribute: 主属性/技能值 { label, placeholder, defaultValue, hidden, key?, computeModifier? }<br/>
              • dc / mod / skillMod: 目标值、临时修正、技能加值；不用时设 hidden=true 和 defaultValue=0<br/>
              • customFields: 规则专属控件；新预设优先使用 number / text / select，选项型参数用 select<br/>
              • derivedVars: 内部数字变量；长目标值公式先放这里，再在 condition/displayExpr 中引用<br/>
              <br/>
              <strong>判定结果 (outcomes)</strong><br/>
              • 每项必填: { id, name, condition, priority }<br/>
              • 常用可选: rank, contestRank, displayExpr, outputText, style, effects<br/>
              • condition: 表达式如 "$roll.total >= $dc", "$roll.total == 4"<br/>
              • displayExpr: 投骰按钮里的短判定式，不要放纯目标值长公式<br/>
              • priority: 数字越小越优先匹配；兜底分支常用 condition="true" 和较大 priority<br/>
              <br/>
              <strong>高级功能</strong><br/>
              • dicePatches: 条件骰子 [{ when?, op, template }]<br/>
              • contestRule: 对抗规则 { disabled?, mode, tieBreakers }<br/>
              • outcomePolicy: 命中 outcome 后的二次裁决，例如最低成功等级<br/>
              • checkSuggestionGuide: 检定建议表中给 AI 看的规则/命令/示例<br/>
              • checkSuggestionAliases: DSL 参数名和值的中文别名<br/>
              <br/>
              <strong>输出模板变量</strong><br/>
              • 常用: $initiator, $attrName, $formula, $roll, $conditionExpr, $judgeResult, $outcomeName, $outcomeText<br/>
              • 对抗: $initFormula, $oppFormula, $initRoll, $oppRoll, $initTotal, $oppTotal, $winner<br/>
              • 默认会输出 &lt;meta:检定结果&gt;；自定义 outputTemplate 时也必须保留这个包裹<br/>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="advanced-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="advanced-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button type="button" id="advanced-preset-save" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button type="button" id="advanced-preset-cancel" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#advanced-preset-json');

    // 初始化 JSON / JSONC
    $jsonTextarea.val(defaultJsonText);

    const getEditorPresetParseOptions = (
      name: string,
      description: string,
    ): { idOverride?: string; nameOverride?: string; descriptionOverride?: string } => {
      const initialName = String(defaultData.name || '').trim();
      const initialDescription = String(defaultData.description || '').trim();
      return {
        idOverride: presetId || undefined,
        nameOverride: isEdit || name !== initialName ? name : undefined,
        descriptionOverride: isEdit || description !== initialDescription ? description : undefined,
      };
    };

    // 关闭
    overlay.find('.acu-close-btn, #advanced-preset-cancel').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.find('#advanced-preset-download-ai-prompt').on('click', () => {
      const promptText = deps.buildAdvancedPresetAgentPrompt();
      const presetName = String(overlay.find('#advanced-preset-name').val() || defaultData.name || 'preset');
      const filename = deps.buildAdvancedPresetAgentPromptFilename(presetName);
      deps.downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#advanced-preset-validate').on('click', () => {
      const name = String(overlay.find('#advanced-preset-name').val() || '').trim();
      const description = String(overlay.find('#advanced-preset-desc').val() || '').trim();
      deps.validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: text => deps.parseAdvancedPresetText(text, getEditorPresetParseOptions(name, description)),
        successMessage: result => {
          const testText = result.tests.length > 0 ? `，测试 ${result.tests.length} 条` : '';
          return `配置有效：${result.preset.name}${testText}`;
        },
        errorMessage: deps.getAdvancedPresetErrorMessage,
        logLabel: '[DICE]ACU 高级预设验证失败:',
      });
    });

    // 保存
    overlay.find('#advanced-preset-save').on('click', () => {
      try {
        const name = String(overlay.find('#advanced-preset-name').val() || '').trim();
        const description = String(overlay.find('#advanced-preset-desc').val() || '').trim();
        const jsonStr = String($jsonTextarea.val() || '').trim();

        const parseResult = deps.parseAdvancedPresetText(jsonStr, getEditorPresetParseOptions(name, description));
        const finalName = parseResult.preset.name || name;
        const finalDescription = parseResult.preset.description || description;

        if (!finalName) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }

        // 构建预设
        const preset = {
          ...(isEdit && existingPreset ? existingPreset : {}),
          ...parseResult.preset,
          kind: 'advanced' as const,
          version: PRESET_FORMAT_VERSION,
          id: presetId || `custom_${Date.now()}`,
          builtin: false,
          name: finalName,
          description: finalDescription,
        };

        // 保存
        if (isEdit && presetId) {
          deps.AdvancedDicePresetManager.updatePreset(presetId, preset);
        } else {
          deps.AdvancedDicePresetManager.createPreset(preset);
        }

        overlay.remove();
        deps.popModal();
        deps.refreshDicePanelPresets(); // 刷新检定面板预设按钮
      } catch (err) {
        console.error('[DICE]ACU 保存高级预设失败:', err);
        if (window.toastr) showActionableErrorToast('保存失败：' + deps.getAdvancedPresetErrorMessage(err), { suggestion: 'save' });
      }
    });

    // 点击遮罩关闭
    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showAdvancedPresetEditor;
}
