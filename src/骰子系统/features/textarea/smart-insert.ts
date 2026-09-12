// @ts-nocheck
/**
 * smart-insert.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSmartInsertToTextarea(deps: any) {
  const smartInsertToTextarea = (newContent: string, contentType: 'action' | 'dice') => {
    // contentType: 'action' (交互选项) 或 'dice' (骰子结果)
    const { $ } = deps.getCore();
    const $ta = $('#send_textarea');
    if (!$ta.length) return;
    const textarea = $ta[0] as AcuDiceTextareaElement;

    const normalizeTextareaContent = (text: unknown): string => {
      return String(text ?? '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/\n{2,}/g, '\n')
        .trim();
    };

    const readStoredActionText = (): string =>
      normalizeTextareaContent(textarea._acuOriginalActionText || $ta.data('acu-original-action-text') || '');
    const storeActionText = (actionText: string) => {
      const normalizedActionText = normalizeTextareaContent(actionText);
      if (!normalizedActionText) {
        $ta.removeData('acu-original-action-text');
        textarea._acuOriginalActionText = null;
        return;
      }
      $ta.data('acu-original-action-text', normalizedActionText);
      textarea._acuOriginalActionText = normalizedActionText;
    };

    const normalizedNewContent = normalizeTextareaContent(newContent);
    const currentVisibleVal = deps.readTextareaVisibleValue(textarea);
    const currentVal = normalizeTextareaContent(deps.syncTextareaDiceCacheFromVisibleText(textarea, currentVisibleVal));

    // 统一检定结果标签正则（匹配 <meta:检定结果>...</meta:检定结果>）
    const metaCheckResultRegex = deps.createMetaCheckResultRegex();

    // 交互选项的识别正则（以<user>开头，匹配到句末标点）
    const actionRegex = /<user>(?:(?!<user>).)*?[。！？]/g;

    // 占位符识别正则
    const placeholderRegex = deps.createDiceResultPlaceholderRegex();
    const actionSlot = '\u0001ACU_ACTION_SLOT\u0001';
    const diceSlot = '\u0000ACU_DICE_SLOT\u0000';
    const joinInlineParts = (parts: string[]): string => normalizeTextareaContent(parts.filter(Boolean).join(' '));
    const appendInlinePart = (text: string, part: string): string => joinInlineParts([text, part]);
    const normalizeSlotSpacing = (text: string): string => {
      let normalized = normalizeTextareaContent(text);
      [actionSlot, diceSlot].forEach(slot => {
        normalized = normalized.replace(new RegExp(`\\s*${deps.escapeRegExpLiteral(slot)}\\s*`, 'g'), ` ${slot} `);
      });
      return normalizeTextareaContent(normalized);
    };
    const findStoredActionIndex = (text: string, actionText: string): number => {
      if (!actionText) return -1;
      const indexes: number[] = [];
      let searchFrom = 0;
      while (searchFrom <= text.length) {
        const index = text.indexOf(actionText, searchFrom);
        if (index < 0) break;
        indexes.push(index);
        searchFrom = index + Math.max(actionText.length, 1);
      }
      if (indexes.length === 0) return -1;
      const diceIndex = text.indexOf(diceSlot);
      if (diceIndex < 0) return indexes[indexes.length - 1];
      return indexes.reduce((best, index) => {
        const bestDistance = Math.abs(best + actionText.length - diceIndex);
        const distance = Math.abs(index + actionText.length - diceIndex);
        return distance < bestDistance ? index : best;
      }, indexes[0]);
    };

    // [修复] 如果配置启用隐藏，且是骰子结果，则使用占位符显示，但保存真实结果
    const diceCfg = deps.getDiceConfig();
    const hideDiceResultFromUser = diceCfg.hideDiceResultFromUser === true;
    const overwriteLastDiceResult = diceCfg.overwriteLastDiceResult !== false;

    // 如果输入栏为空，直接填入
    if (!currentVal) {
      const finalDisplayVal =
        contentType === 'dice' && hideDiceResultFromUser ? '[投骰结果已隐藏]' : normalizedNewContent;
      deps.setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, finalDisplayVal);
      if (contentType === 'action') {
        storeActionText(normalizedNewContent);
      } else {
        storeActionText('');
      }
      // [修复] 始终保存真实结果到 data 属性（即使不隐藏也要保存，以便后续处理）
      if (contentType === 'dice') {
        deps.storeTextareaDiceCache(textarea, normalizedNewContent, normalizedNewContent);
      }
      return;
    }

    // 解析当前内容，分离三个部分
    let workingText = currentVal;
    let existingAction = '';
    let existingDiceBlocks: string[] = [];
    let hasActionSlot = false;
    let hasDiceSlot = false;

    // [修复] 0. 先检查是否有占位符（需要替换而不是添加）
    if (placeholderRegex.test(workingText)) {
      const originalText = deps.readStoredLatestDiceText(textarea);
      if (originalText) {
        // 用原始文本替换占位符，以便后续处理
        workingText = workingText.replace(deps.createDiceResultPlaceholderRegex(), originalText);
      } else {
        // 如果没有保存的原始文本，直接移除占位符
        workingText = workingText.replace(deps.createDiceResultPlaceholderRegex(), '').trim();
      }
    }

    // 1. 提取 <meta:检定结果> 标签块（统一格式）
    const metaMatches = Array.from(workingText.matchAll(metaCheckResultRegex));
    if (metaMatches.length > 0) {
      const lastMetaMatch = metaMatches[metaMatches.length - 1];
      const lastMetaIndex = lastMetaMatch.index ?? 0;
      existingDiceBlocks = [lastMetaMatch[0]];
      workingText = normalizeSlotSpacing(
        `${workingText.slice(0, lastMetaIndex)} ${diceSlot} ${workingText.slice(lastMetaIndex + lastMetaMatch[0].length)}`,
      );
      hasDiceSlot = true;
      console.log(
        '[DICE]ACU SmartInsert Found and extracted meta check result:',
        existingDiceBlocks[existingDiceBlocks.length - 1].substring(0, 50) + '...',
      );
    }

    // 2. 提取交互选项
    const storedActionText = readStoredActionText();
    if (storedActionText) {
      const actionIndex = findStoredActionIndex(workingText, storedActionText);
      if (actionIndex >= 0) {
        existingAction = storedActionText;
        workingText = normalizeSlotSpacing(
          `${workingText.slice(0, actionIndex)} ${actionSlot} ${workingText.slice(actionIndex + storedActionText.length)}`,
        );
        hasActionSlot = true;
        console.log('[DICE]ACU SmartInsert Found stored action:', existingAction);
      }
    }

    const actionMatches = hasActionSlot ? [] : Array.from(workingText.matchAll(actionRegex));
    if (actionMatches.length > 0) {
      const lastActionMatch = actionMatches[actionMatches.length - 1];
      const lastActionIndex = lastActionMatch.index ?? 0;
      existingAction = lastActionMatch[0];
      workingText = normalizeSlotSpacing(
        `${workingText.slice(0, lastActionIndex)} ${actionSlot} ${workingText.slice(lastActionIndex + lastActionMatch[0].length)}`,
      );
      hasActionSlot = true;
      console.log('[DICE]ACU SmartInsert Found and extracted action:', existingAction);
    }

    // 3. 根据新内容类型，更新对应槽位。用户手写文本保留在原来的前后位置。
    let nextAction = existingAction;
    let diceSlotContent = joinInlineParts(existingDiceBlocks);
    if (contentType === 'dice') {
      diceSlotContent = overwriteLastDiceResult
        ? normalizedNewContent
        : joinInlineParts([...existingDiceBlocks, normalizedNewContent]);
      if (!hasDiceSlot) {
        workingText = appendInlinePart(workingText, normalizedNewContent);
      }
    } else if (contentType === 'action') {
      nextAction = normalizedNewContent;
      if (overwriteLastDiceResult && hasActionSlot) {
        workingText = workingText.replace(actionSlot, nextAction);
        hasActionSlot = false;
      } else {
        if (hasActionSlot) {
          workingText = workingText.replace(actionSlot, existingAction);
          hasActionSlot = false;
        }
        if (hasDiceSlot) {
          workingText = workingText.replace(diceSlot, joinInlineParts([nextAction, diceSlot]));
        } else {
          workingText = appendInlinePart(workingText, nextAction);
        }
      }
    }

    if (hasActionSlot) {
      workingText = workingText.replace(actionSlot, nextAction);
    }
    if (hasDiceSlot) {
      workingText = workingText.replace(diceSlot, diceSlotContent);
    }

    const finalRealVal = normalizeTextareaContent(workingText);
    const finalDisplayVal = hideDiceResultFromUser
      ? normalizeTextareaContent(finalRealVal.replace(metaCheckResultRegex, '[投骰结果已隐藏]'))
      : finalRealVal;
    deps.setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, finalDisplayVal);
    storeActionText(nextAction);

    if (contentType === 'dice' || existingDiceBlocks.length > 0) {
      deps.storeTextareaDiceCache(
        textarea,
        finalRealVal,
        contentType === 'dice' ? normalizedNewContent : existingDiceBlocks[existingDiceBlocks.length - 1],
      );
    }
  };
  return smartInsertToTextarea;
}
