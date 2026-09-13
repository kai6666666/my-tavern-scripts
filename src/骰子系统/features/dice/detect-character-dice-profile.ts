// @ts-nocheck
/**
 * detect-character-dice-profile.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { decodeAcuDiceProfileMarkerPayload, extractAcuDiceProfileMarkerPayloads } from '../../features/profiles/profile-packages';
import type { AcuDiceProfileSource } from '../../features/profiles/profile-packages';
export function createDetectCharacterDiceProfile(deps: any) {
  const detectCharacterDiceProfile = async (options: { includeSkipped?: boolean } = {}): Promise<DiceCharacterProfileDetection | null> => {
    const context = deps.getDiceProfileCharacterContext();
    const texts = deps.collectDiceCharacterProfileTexts();
    for (const item of texts) {
      const marker = extractAcuDiceProfileMarkerPayloads(item.text)[0];
      if (!marker) continue;
      const source: AcuDiceProfileSource = {
        type: 'character_card',
        characterName: context.characterName,
        characterId: context.characterId,
        chatId: context.chatId,
      };
      const decoded = decodeAcuDiceProfileMarkerPayload(marker.payload);
      const profile = deps.normalizeDiceProfileRecord(JSON.parse(decoded), {
        source,
        name: `${context.characterName}配置方案`,
      });
      const promptState = deps.getDiceProfilePromptState(context.chatId, profile.fingerprint);
      if (!options.includeSkipped && promptState) return null;
      const savedProfile = await deps.upsertDiceProfileRecord({ ...profile, source });
      return { profile: savedProfile, sourceTextKind: item.kind };
    }
    return null;
  };
  return detectCharacterDiceProfile;
}
