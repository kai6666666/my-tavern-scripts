// @ts-nocheck
/**
 * get-tutorial-module.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { createTutorialModule } from '../tutorial';
import type { TutorialModule } from '../tutorial';
export function createGetTutorialModule(deps: any) {
  const getTutorialModule = (): TutorialModule => {
    if (!deps.getTutorialModule()) {
      deps.setTutorialModule(createTutorialModule({
        getTheme: () => String(deps.getConfig().theme || 'modern'),
        getStore: (key, fallback) => Store.get(key, fallback),
        setStore: (key, value) => Store.set(key, value),
        getDocument: deps.getTavernHostDocument,
        getWindow: deps.getTavernHostWindow,
      }));
    }
    return deps.getTutorialModule();
  };
  return getTutorialModule;
}
