// @ts-nocheck
/**
 * public-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAcuDiceAPI(deps: any) {
  const AcuDiceAPI = {
    /** API 版本号 */
    version: '1.3.0',

    /**
     * 骰子投掷（同步）
     * @param formula 骰子表达式，如 "2d6", "1d20+5", "4d6kh3"
     * @returns 投掷结果对象
     * @example
     * AcuDice.roll('2d6') // => { total: 7, formula: '2d6', breakdown: '2d6 = 7' }
     * AcuDice.roll('1d20+5') // => { total: 15, formula: '1d20+5', breakdown: '1d20+5 = 15' }
     */
    roll(formula: string): { total: number; formula: string; breakdown: string } {
      return deps.acuDiceRoll.roll(formula);
    },

    /**
     * 属性/技能检定（异步）
     * @param options 检定选项
     * @returns 检定结果对象
     * @example
     * await AcuDice.check({ attribute: '力量' })
     * await AcuDice.check({ attribute: '力量', targetValue: 50, diceType: '1d100' })
     */
    async check(
      options: {
        attribute?: string;
        skill?: string;
        targetValue?: number;
        diceType?: string;
        successCriteria?: 'lte' | 'gte';
        modifier?: number;
      } = {},
    ): Promise<{
      success: boolean;
      roll: number;
      target: number;
      margin: number;
      criticalSuccess: boolean;
      criticalFailure: boolean;
      message: string;
      diceType: string;
      rule: 'coc' | 'dnd';
    }> {
      return deps.acuDiceCheck.check(options);
    },
    /**
     * 初始化回调 - API 已就绪时调用
     * @param callback 回调函数
     */
    onReady(callback: () => void): void {
      deps.acuDiceReady.onReady(callback);
    },

    /**
     * 订阅事件
     * @param event 事件类型 ('check' | 'contest')
     * @param handler 事件处理函数
     */
    on(event: string, handler: Function): void {
      deps.acuDiceEvents.on(event, handler);
    },

    /**
     * 取消事件订阅
     * @param event 事件类型 ('check' | 'contest')
     * @param handler 事件处理函数
     */
    off(event: string, handler: Function): void {
      deps.acuDiceEvents.off(event, handler);
    },

    /**
     * 获取最近一次普通检定结果
     */
    getLatestCheck(): (AcuDice.CheckResult & { timestamp: number }) | null {
      return deps.acuDiceHistory.getLatestCheck() as (AcuDice.CheckResult & { timestamp: number }) | null;
    },

    /**
     * 获取最近一次对抗检定结果
     */
    getLatestContest(): (AcuDice.ContestResult & { timestamp: number }) | null {
      return deps.acuDiceHistory.getLatestContest() as (AcuDice.ContestResult & { timestamp: number }) | null;
    },

    /**
     * 获取历史记录
     * @param options 查询选项
     * @param options.limit 限制返回数量
     * @param options.type 筛选类型 ('check' | 'contest')
     */
    getHistory(options?: { limit?: number; type?: 'check' | 'contest' }): Array<any> {
      return deps.acuDiceHistory.getHistory(options);
    },

    /**
     * 获取所有预设列表（摘要信息）
     * @returns 预设摘要数组
     */
    listPresets(): Array<{ id: string; name: string; description?: string; builtin: boolean }> {
      return deps.acuDicePresets.listPresets();
    },

    /**
     * 获取当前激活的预设 ID
     * @returns 预设 ID 字符串，无激活预设时返回 null
     */
    getActivePresetId(): string | null {
      return deps.acuDicePresets.getActivePresetId();
    },

    /**
     * 获取指定预设的摘要信息
     * @param presetId 预设 ID
     * @returns 预设摘要，未找到时返回 null
     */
    getPresetSummary(presetId: string): { id: string; name: string; description?: string; builtin: boolean } | null {
      return deps.acuDicePresets.getPresetSummary(presetId);
    },

    profiles: deps.acuDiceProfiles,

    /**
     * 获取所有可用角色名列表
     * @returns 角色名数组，包括 '<user>' 和所有 NPC
     * @example
     * AcuDice.listCharacters() // => ['<user>', 'NPC1', 'NPC2']
     */
    listCharacters(): string[] {
      return deps.acuDiceCharacters.listCharacters();
    },

    /**
     * 获取指定角色的所有属性
     * @param name 角色名，可以是 '<user>' 或 NPC 名称
     * @returns 属性数组，每个元素包含 name 和 value
     * @example
     * AcuDice.getCharacterAttributes('<user>') // => [{ name: '力量', value: 50 }, { name: '敏捷', value: 60 }]
     * AcuDice.getCharacterAttributes('张三') // => [{ name: '力量', value: 70 }]
     */
    getCharacterAttributes(name: string): Array<{ name: string; value: number }> {
      return deps.acuDiceCharacters.getCharacterAttributes(name);
    },

    /**
     * 获取指定角色的指定属性值
     * @param name 角色名
     * @param attribute 属性名
     * @returns 属性值，如果未找到则返回 null
     * @example
     * AcuDice.getAttributeValue('<user>', '力量') // => 50
     * AcuDice.getAttributeValue('张三', '敏捷') // => 60
     */
    getAttributeValue(name: string, attribute: string): number | null {
      return deps.acuDiceCharacters.getAttributeValue(name, attribute);
    },

    /**
     * 按角色名和属性名进行便捷检定
     * @param options 检定选项
     * @returns 检定结果对象
     * @example
     * await AcuDice.checkByCharacter({ name: '<user>', attribute: '力量' })
     * await AcuDice.checkByCharacter({ name: 'NPC1', attribute: '敏捷', modifier: 5 })
     */
    async checkByCharacter(options: {
      name: string;
      attribute: string;
      modifier?: number;
      diceType?: string;
      successCriteria?: 'lte' | 'gte';
    }): Promise<{
      success: boolean;
      roll: number;
      target: number;
      margin: number;
      criticalSuccess: boolean;
      criticalFailure: boolean;
      message: string;
      diceType: string;
      rule: 'coc' | 'dnd';
    }> {
      return deps.acuDiceCheck.checkByCharacter(options);
    },
    /**
     * 对抗检定
     * @param options 对抗检定选项
     * @returns 对抗检定结果
     * @example
     * await AcuDice.contest({
     *   left: { name: '<user>', attribute: '力量' },
     *   right: { name: 'NPC1', attribute: '力量' }
     * })
     */
    async contest(options: {
      left?: { name: string; attribute: string; targetValue?: number };
      right?: { name: string; attribute: string; targetValue?: number };
      /** @deprecated 使用 left 代替 */
      attacker?: { name: string; attribute: string; targetValue?: number };
      /** @deprecated 使用 right 代替 */
      defender?: { name: string; attribute: string; targetValue?: number };
      rule?: 'initiator_win' | 'initiator_lose' | 'tie';
      diceType?: string;
    }): Promise<{
      left: { name: string; attribute: string; roll: number; target: number; successLevel: number };
      right: { name: string; attribute: string; roll: number; target: number; successLevel: number };
      winner: 'left' | 'right' | 'tie';
      message: string;
    }> {
      return deps.acuDiceContest.contest(options);
    },
  };
  return AcuDiceAPI;
}
