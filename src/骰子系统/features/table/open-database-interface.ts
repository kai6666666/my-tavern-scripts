// @ts-nocheck
/**
 * open-database-interface.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenDatabaseInterface(deps: any) {
  const openDatabaseInterface = async (): Promise<void> => {
    if (await deps.openDatabaseNewUiViaApi()) return;
    if (deps.openDatabaseNewUiViaMenuEntry()) return;
    if (deps.openLegacyDatabaseSettings()) return;

    if (window.toastr) {
      window.toastr.warning('数据库脚本未就绪或版本过低，无法打开数据库界面');
    }
  };
  return openDatabaseInterface;
}
