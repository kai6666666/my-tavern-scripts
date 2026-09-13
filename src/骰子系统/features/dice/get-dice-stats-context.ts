// @ts-nocheck
/**
 * get-dice-stats-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceStatsContext(deps: any) {
  const getDiceStatsContext = (): DiceStatsContext => {
    const ST = SillyTavern;
    let chatId = 'unknown_chat';
    let characterId = 'unknown_character';

    try {
      if (typeof getCurrentChatId === 'function') {
        const directChatId = getCurrentChatId();
        if (directChatId !== null && directChatId !== undefined) {
          const parsed = String(directChatId).trim();
          if (parsed) chatId = parsed;
        }
      }
      if (typeof ST?.getCurrentChatId === 'function') {
        const currentChatId = ST.getCurrentChatId();
        if (currentChatId !== null && currentChatId !== undefined) {
          const parsed = String(currentChatId).trim();
          if (parsed) chatId = parsed;
        }
      }
    } catch {
      // ignore
    }

    try {
      if (typeof getCharData === 'function') {
        const currentChar = getCharData('current', true);
        const avatarId = String(currentChar?.avatar || '').trim();
        if (avatarId) {
          characterId = avatarId;
        }
      }

      if (characterId === 'unknown_character') {
        const cid = ST?.characterId;
        const chars = ST?.characters;
        const idx = Number.parseInt(String(cid ?? ''), 10);
        if (!Number.isNaN(idx) && idx >= 0 && Array.isArray(chars) && idx < chars.length) {
          const avatarId = String(chars[idx]?.avatar || '').trim();
          if (avatarId) {
            characterId = avatarId;
          }
        }
      }
    } catch {
      // ignore
    }

    return { chatId, characterId };
  };
  return getDiceStatsContext;
}
