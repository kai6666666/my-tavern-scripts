// @ts-nocheck
/**
 * strip-known-system-action-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { escapeRegExpLiteralImpl as escapeRegExpLiteral } from '../../shared/normalize-tracked-text';
export function createStripKnownSystemActionText(deps: any) {
  const stripKnownSystemActionText = (text: string, actionText?: unknown): string => {
    const normalizedAction = deps.normalizeTrackedText(actionText);
    if (!normalizedAction) return text;
    return deps.normalizeTrackedText(text.replace(new RegExp(escapeRegExpLiteral(normalizedAction), 'g'), ' '));
  };
  return stripKnownSystemActionText;
}
