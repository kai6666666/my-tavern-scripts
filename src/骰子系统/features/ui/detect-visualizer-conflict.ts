// @ts-nocheck
/**
 * detect-visualizer-conflict.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { SCRIPT_ID } from '../../shared/constants';
export function createDetectVisualizerConflict(deps: any) {
  const detectVisualizerConflict = () => {
    const { $ } = deps.getCore();
    if (!$) return false;

    // 检测方法1: 检查是否存在可视化前端创建的 DOM 元素（最可靠）
    // 可视化前端会创建 .acu-wrapper，但骰子系统也会创建，所以需要进一步判断
    const $wrapper = $('.acu-wrapper');
    if ($wrapper.length > 0) {
      // 检查 wrapper 内部是否有可视化前端特有的元素
      // 可视化前端 v12.60 使用 'acu_visualizer_ui_v20_pagination' 作为 SCRIPT_ID
      // 检查是否有可视化前端特有的类名或结构
      const hasVisualizerNav = $wrapper.find('.acu-nav-container').length > 0;
      const hasVisualizerDataDisplay = $wrapper.find('.acu-data-display').length > 0;

      // 如果 wrapper 存在但没有骰子系统的特征元素，可能是可视化前端
      // 或者检查 wrapper 的 data 属性或 id
      const wrapperId = $wrapper.attr('id') || '';
      const wrapperClass = $wrapper.attr('class') || '';

      // 如果检测到可视化前端特有的结构，判定为冲突
      if (hasVisualizerNav && hasVisualizerDataDisplay) {
        // 进一步检查：是否有骰子系统的特征（如骰子按钮等）
        const hasDiceFeatures = $wrapper.find('[id*="dice"], [class*="dice"]').length > 0;
        if (!hasDiceFeatures) {
          return true; // 只有可视化前端的特征，没有骰子系统特征
        }
      }
    }

    // 检测方法2: 检查脚本内容中是否有可视化前端的标识
    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent || script.innerHTML || '';
        // 检查可视化前端 v12.60 的特定标识
        if (content.includes('acu_visualizer_ui_v20_pagination') && content.includes('acu_ui_config_v18')) {
          return true;
        }
      }
    } catch (e) {
      // 脚本检查失败，忽略
    }

    // 检测方法3: 检查 localStorage（作为辅助判断）
    // 只有当 localStorage 中有可视化前端配置，且没有骰子系统配置时，才判定为冲突
    try {
      const visualizerConfig = localStorage.getItem('acu_ui_config_v18');
      const diceConfig = localStorage.getItem('acu_ui_config_v19');

      // 如果只有可视化前端的配置，且 DOM 中没有骰子系统的元素，判定为冲突
      if (visualizerConfig && !diceConfig) {
        // 再次检查 DOM，确保没有骰子系统的元素
        const hasDiceInDOM = $('[id*="dice"], [class*="dice"]').length > 0;
        if (!hasDiceInDOM) {
          return true;
        }
      }
    } catch (e) {
      // localStorage 访问失败，忽略
    }

    return false;
  };
  return detectVisualizerConflict;
}
