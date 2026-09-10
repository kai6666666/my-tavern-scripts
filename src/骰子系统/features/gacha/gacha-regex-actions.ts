// @ts-nocheck
/**
 * features/gacha/gacha-regex-actions.ts
 * Feature-Sliced: 骰子商店正则按钮（data-acu-gacha-action）的 DOM 事件集群。
 * 通过 DI 注入 gacha API / toastr / 错误处理 / jQuery 获取器，与 monolith 解耦。
 */

export const ACUDICE_GACHA_REGEX_ACTION_SELECTOR = '[data-acu-gacha-action]';

export class GachaRegexActions {
  private readonly deps: {
    gachaApi: any;
    currencyName: any;
    getToastr: () => any;
    getRuntimeErrorMessage: (error: unknown) => string;
    showActionableErrorToast: (message: string, options?: any) => void;
    getCore: () => any;
  };

  constructor(deps: {
    gachaApi: any;
    currencyName: any;
    getToastr: () => any;
    getRuntimeErrorMessage: (error: unknown) => string;
    showActionableErrorToast: (message: string, options?: any) => void;
    getCore: () => any;
  }) {
    this.deps = deps;
  }

  private getToastr() {
    return this.deps.getToastr();
  }

  setBusy(element: HTMLElement, busy: boolean) {
    element.classList.toggle('is-busy', busy);
    if (busy) {
      element.dataset.acuGachaBusy = '1';
      element.setAttribute('aria-disabled', 'true');
    } else {
      delete element.dataset.acuGachaBusy;
      element.removeAttribute('aria-disabled');
    }
  }

  getInt(element: HTMLElement, key: string, fallback = 0): number {
    const raw = element.dataset[key] ?? element.getAttribute(`data-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`);
    const value = Number.parseInt(String(raw ?? ''), 10);
    return Number.isFinite(value) ? value : fallback;
  }

  async execute(element: HTMLElement) {
    const action = String(element.dataset.acuGachaAction || '').trim();
    const toastr = this.getToastr();
    const currencyName = this.deps.currencyName;
    const gachaApi = this.deps.gachaApi;

    switch (action) {
      case 'openShop':
      case 'shop':
        await gachaApi.openShop();
        break;

      case 'addFortune': {
        const amount = this.getInt(element, 'acuGachaAmount');
        const result = await gachaApi.addFortune(amount, {
          reason: '正则按钮',
          detail: String(element.dataset.acuGachaDetail || ''),
        });
        toastr?.success?.(`当前${currencyName}：${result.after}`, '骰子商店');
        break;
      }

      case 'clearFortune': {
        const result = await gachaApi.clearFortune({ confirm: true, reason: '正则按钮' });
        if (!result.canceled) toastr?.success?.(`${currencyName}已清空`, '骰子商店');
        break;
      }

      case 'state': {
        const state = gachaApi.getState();
        console.log('[AcuDice.gacha] state', state);
        toastr?.info?.(`当前${currencyName}：${state.fortune}`, '骰子商店');
        break;
      }

      case 'singleDraw': {
        const result = await gachaApi.singleDraw();
        console.log('[AcuDice.gacha] singleDraw', result);
        break;
      }

      case 'tenDraw': {
        const result = await gachaApi.tenDraw();
        console.log('[AcuDice.gacha] tenDraw', result);
        break;
      }

      case 'openShardShop':
      case 'shardShop':
        await gachaApi.openShardShop();
        break;

      case 'createTestCatalog':
        await gachaApi.upsertPool({ id: 'API测试', name: 'API测试', includeInAll: true, order: 990 }, { silent: true });
        await gachaApi.upsertItems(
          {
            items: [
              {
                id: 'regex_test_candy',
                name: '测试糖',
                type: '道具',
                quality: '普通',
                description: '正则按钮测试用糖果',
                poolTags: ['API测试'],
                weight: 1,
                stackable: true,
                unique: false,
                grantQuantity: 1,
                rewardTarget: 'inventory',
              },
            ],
          },
          { mode: 'overwrite', silent: true },
        );
        gachaApi.setActivePool('API测试');
        toastr?.success?.('已创建 API测试 池和 测试糖', '骰子商店');
        break;

      case 'drawTestCatalog': {
        gachaApi.setActivePool('API测试');
        await gachaApi.addFortune(20, { silent: true, reason: '正则奖池测试' });
        const result = await gachaApi.singleDraw();
        console.log('[AcuDice.gacha] API测试池单抽', result);
        break;
      }

      case 'listTestCatalog': {
        const items = await gachaApi.listItems({ poolTag: 'API测试', includeDisabled: true });
        console.log('[AcuDice.gacha] API测试池物品', items);
        toastr?.info?.(`API测试池物品数：${items.length}`, '骰子商店');
        break;
      }

      case 'clearTestCatalog':
        await gachaApi.removeCustomItem('regex_test_candy', { silent: true });
        await gachaApi.removeCustomPool('API测试', { silent: true });
        toastr?.success?.('已清理 API测试 池', '骰子商店');
        break;

      case 'listPools': {
        const pools = await gachaApi.listPools({ includeHidden: true });
        console.log('[AcuDice.gacha] pools', pools);
        toastr?.info?.(`卡池数：${pools.length}`, '骰子商店');
        break;
      }

      case 'exportCatalog': {
        const json = await gachaApi.exportCatalog();
        console.log('[AcuDice.gacha] custom catalog JSON', json);
        toastr?.info?.('已输出到浏览器控制台', '骰子商店');
        break;
      }

      case 'openSettings':
      case 'settings':
        await gachaApi.openSettings();
        break;

      default:
        console.warn('[AcuDice][GachaRegex] 未知按钮动作:', action);
        toastr?.warning?.(`未知骰子商店动作：${action || '(空)'}`, '骰子商店');
    }
  }

  async handle(element: HTMLElement) {
    if (element.dataset.acuGachaBusy === '1' || element.getAttribute('aria-disabled') === 'true') return;

    this.setBusy(element, true);
    try {
      await this.execute(element);
    } catch (error) {
      const message = this.deps.getRuntimeErrorMessage(error);
      console.error('[AcuDice][GachaRegex] 按钮执行失败:', error);
      this.deps.showActionableErrorToast(`骰子商店按钮执行失败：${message}`, { title: '骰子商店', developerHint: true });
    } finally {
      this.setBusy(element, false);
    }
  }

  bind() {
    const { $ } = this.deps.getCore();
    if (!$) return;
    const self = this;

    $('body')
      .off('click.acu_gacha_regex_action')
      .on('click.acu_gacha_regex_action', ACUDICE_GACHA_REGEX_ACTION_SELECTOR, function (event) {
        event.preventDefault();
        event.stopPropagation();
        void self.handle(this as HTMLElement);
      });

    $('body')
      .off('keydown.acu_gacha_regex_action')
      .on('keydown.acu_gacha_regex_action', ACUDICE_GACHA_REGEX_ACTION_SELECTOR, function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        void self.handle(this as HTMLElement);
      });
  }
}