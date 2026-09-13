// @ts-nocheck
/**
 * generate-unique-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGenerateUniqueName(deps: any) {
  const generateUniqueName = (baseName: string, existingNames: string[]): string => {
    if (!existingNames.includes(baseName)) return baseName;
    let counter = 2;
    let newName = `${baseName} (${counter})`;
    while (existingNames.includes(newName)) {
      counter++;
      newName = `${baseName} (${counter})`;
    }
    return newName;
  };
  return generateUniqueName;
}
