// @ts-nocheck
/**
 * features/api/profiles.ts
 * Feature-Sliced: 对外 API 的骰子配置档案（profiles）子对象方法。
 * 通过 DI 注入 profile 相关函数，与 monolith 解耦。
 */

export class AcuDiceProfiles {
  private readonly deps: {
    refreshDiceProfileIndex: () => Promise<any>;
    saveCurrentDiceProfile: (options: any) => Promise<any>;
    toDiceProfileSummary: (profile: any) => any;
    importDiceProfile: (input: unknown, options: any) => Promise<any>;
    applyDiceProfile: (id: string, options: any) => Promise<any>;
    exportDiceProfile: (id: string) => Promise<any>;
    detectCharacterDiceProfile: (options: any) => Promise<any>;
    getDiceProfileCharacterContext: () => any;
    getDiceProfilePromptState: (chatId: string, fingerprint: string) => string;
    getAcuDiceProfilePromptKey: (chatId: string, fingerprint: string) => string;
  };

  constructor(deps: {
    refreshDiceProfileIndex: () => Promise<any>;
    saveCurrentDiceProfile: (options: any) => Promise<any>;
    toDiceProfileSummary: (profile: any) => any;
    importDiceProfile: (input: unknown, options: any) => Promise<any>;
    applyDiceProfile: (id: string, options: any) => Promise<any>;
    exportDiceProfile: (id: string) => Promise<any>;
    detectCharacterDiceProfile: (options: any) => Promise<any>;
    getDiceProfileCharacterContext: () => any;
    getDiceProfilePromptState: (chatId: string, fingerprint: string) => string;
    getAcuDiceProfilePromptKey: (chatId: string, fingerprint: string) => string;
  }) {
    this.deps = deps;
  }

  async list(): Promise<any[]> {
    return await this.deps.refreshDiceProfileIndex();
  }

  async saveCurrent(options: any = {}): Promise<any> {
    const profile = await this.deps.saveCurrentDiceProfile(options);
    return this.deps.toDiceProfileSummary(profile);
  }

  async import(input: unknown, options: any = {}): Promise<any> {
    const profile = await this.deps.importDiceProfile(input, options);
    return this.deps.toDiceProfileSummary(profile);
  }

  async apply(profileId: string, options: any = {}): Promise<any> {
    return await this.deps.applyDiceProfile(profileId, { createSnapshot: true, ...options });
  }

  async export(profileId: string): Promise<string> {
    return JSON.stringify(await this.deps.exportDiceProfile(profileId), null, 2);
  }

  async detectCharacterProfile(
    options: { includeSkipped?: boolean } = {},
  ): Promise<{
    profile: any;
    promptKey: string;
    skipped: boolean;
    sourceTextKind: string;
  } | null> {
    const detection = await this.deps.detectCharacterDiceProfile(options);
    if (!detection) return null;
    const context = this.deps.getDiceProfileCharacterContext();
    const promptState = this.deps.getDiceProfilePromptState(context.chatId, detection.profile.fingerprint);
    return {
      profile: this.deps.toDiceProfileSummary(detection.profile),
      promptKey: this.deps.getAcuDiceProfilePromptKey(context.chatId, detection.profile.fingerprint),
      skipped: promptState === 'skipped',
      sourceTextKind: detection.sourceTextKind,
    };
  }
}