// @ts-nocheck
/**
 * acu-dice-profiles-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceProfiles } from './profiles';
import { getAcuDiceProfilePromptKey } from '../profiles/profile-packages';
export function createAcuDiceProfilesInstance(deps: any) {
  const acuDiceProfiles = new AcuDiceProfiles({
    refreshDiceProfileIndex: () => deps.refreshDiceProfileIndex(),
    saveCurrentDiceProfile: (o: any) => deps.saveCurrentDiceProfile(o),
    toDiceProfileSummary: (p: any) => deps.toDiceProfileSummary(p),
    importDiceProfile: (i: unknown, o: any) => deps.importDiceProfile(i, o),
    applyDiceProfile: (id: string, o: any) => deps.applyDiceProfile(id, o),
    exportDiceProfile: (id: string) => deps.exportDiceProfile(id),
    detectCharacterDiceProfile: (o: any) => deps.detectCharacterDiceProfile(o),
    getDiceProfileCharacterContext: () => deps.getDiceProfileCharacterContext(),
    getDiceProfilePromptState: (c: string, f: string) => deps.getDiceProfilePromptState(c, f),
    getAcuDiceProfilePromptKey: (c: string, f: string) => deps.getAcuDiceProfilePromptKey(c, f),
  });
  return acuDiceProfiles;
}
