/**
 * 骰子系统主样式表（入口）
 *
 * 实际内容已按章节拆分至 ./styles/*.ts（保持原始顺序），
 * 此文件仅做拼接导出，MAIN_STYLES 的最终内容与拆分前完全一致。
 */
import { STYLES_PART_01_THEME } from './styles/part-01-theme';
import { STYLES_PART_02_AVATAR } from './styles/part-02-avatar';
import { STYLES_PART_03_ICONS } from './styles/part-03-icons';
import { STYLES_PART_04_VALIDATION } from './styles/part-04-validation';
import { STYLES_PART_05_VALIDATION } from './styles/part-05-validation';
import { STYLES_PART_06_INVENTORY } from './styles/part-06-inventory';
import { STYLES_PART_07_BACKUP } from './styles/part-07-backup';

export const MAIN_STYLES = [
  STYLES_PART_01_THEME,
  STYLES_PART_02_AVATAR,
  STYLES_PART_03_ICONS,
  STYLES_PART_04_VALIDATION,
  STYLES_PART_05_VALIDATION,
  STYLES_PART_06_INVENTORY,
  STYLES_PART_07_BACKUP,
].join('');
