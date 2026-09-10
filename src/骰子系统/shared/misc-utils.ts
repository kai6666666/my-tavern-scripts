// @ts-nocheck
/**
 * shared/misc-utils.ts
 * Feature-Sliced: batch extract (FSD batch A1).
 */


export function suggestFormatValue(pattern, rowIndex, existingValues = [], tableContent = null) {
    if (!pattern || rowIndex === undefined || rowIndex < 0) return null;

    try {
      // 识别 "前缀+数字" 模式，如 ^AM\d{3}$
      // pattern 在 JavaScript 字符串中是 '^AM\\d{3}$'，实际内容是 '^AM\d{3}$'
      // 在正则匹配时，要匹配字面量 \d{3}，需要用 /\\d\{3\}/（转义后的反斜杠+d，转义后的花括号）
      // 匹配格式：^?[字母]+\d\{数字\}$?
      const prefixMatch = pattern.match(/^\^?([A-Za-z]+)\\d\{(\d+)\}\$?$/);

      if (prefixMatch) {
        const prefix = prefixMatch[1]; // "AM"
        const digits = parseInt(prefixMatch[2], 10); // 3

        // 【改进】对于总结表和总体大纲，基于现有值计算下一个编码
        if (tableContent && (tableContent.name === '总结表' || tableContent.name === '总体大纲')) {
          const headers = tableContent.content?.[0] || [];
          const rows = tableContent.content?.slice(1) || [];
          const codeIndex = headers.indexOf('编码索引');

          if (codeIndex >= 0) {
            // 提取所有现有编码索引的数字部分
            const existingNumbers = [];
            rows.forEach(row => {
              const codeValue = row?.[codeIndex];
              if (codeValue && typeof codeValue === 'string') {
                const match = codeValue.match(new RegExp(`^${prefix}(\\d+)$`));
                if (match) {
                  const num = parseInt(match[1], 10);
                  if (!isNaN(num)) existingNumbers.push(num);
                }
              }
            });

            // 计算下一个数字
            const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
            const nextNum = String(maxNum + 1).padStart(digits, '0');
            return prefix + nextNum;
          }
        }

        // 原有逻辑：基于行索引（作为后备方案）
        const nextNum = String(rowIndex + 1).padStart(digits, '0');
        return prefix + nextNum;
      }

      // 尝试识别其他常见模式，如 \d{3} 单独出现（仅数字）
      const numOnlyMatch = pattern.match(/^\^?\\d\{(\d+)\}\$?$/);
      if (numOnlyMatch) {
        const digits = parseInt(numOnlyMatch[1], 10);
        return String(rowIndex + 1).padStart(digits, '0');
      }
    } catch (e) {
      console.error('[DICE]ACU 格式推算失败:', e);
    }

    return null; // 无法推算，显示空输入框
  }

export function parseTavernFindRegex(findRegex: string): { pattern: string; flags: RegexFlags } {
    // 匹配 /pattern/flags 格式，使用惰性匹配和末尾锚定
    const match = findRegex.match(/^\/(.+)\/([gimsuy]*)$/s);
    if (match) {
      const [, pattern, flagStr] = match;
      return {
        pattern,
        flags: {
          global: flagStr.includes('g'),
          caseInsensitive: flagStr.includes('i'),
          multiline: flagStr.includes('m'),
          unicode: flagStr.includes('u'),
          sticky: flagStr.includes('y'),
        },
      };
    }
    // 非标准格式，直接作为pattern，默认全局匹配
    return { pattern: findRegex, flags: { global: true } };
  }

export function getDbLockAPI(): any {
    // 递归找到真正的顶层窗口（处理多层iframe嵌套）
    let topWindow: Window = window;
    try {
      while (topWindow.parent && topWindow.parent !== topWindow) {
        topWindow = topWindow.parent;
      }
    } catch (e) {
      // 跨域情况下无法访问parent，使用当前window
    }

    // 优先从顶层窗口获取，然后尝试当前窗口
    const api = (topWindow as any).AutoCardUpdaterAPI || (window as any).AutoCardUpdaterAPI;
    return api || null;
  }
