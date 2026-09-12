// @ts-nocheck
/**
 * show-relationship-graph.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { RELATION_ICON_MAP } from '../../shared/emoji-maps';
import { findNameColumnIndex, getRowDisplayName, isCharacterTable } from '../../entities/name-alias';
export function createShowRelationshipGraph(deps: any) {
  const showRelationshipGraph = (npcTable: RelationGraphTableInput, options: RelationshipGraphRenderOptions = {}) => {
    console.info('[DICE]开始抓取人物关系表数据...');
    const { $ } = deps.getCore();
    $('.acu-relation-graph-overlay').remove();

    const config = deps.getConfig();

    const headers = (npcTable.headers || []).map(header => String(header || ''));
    const rows = npcTable.rows || [];

    const nameIdx = findNameColumnIndex(headers);
    const relationIdx = headers.findIndex(h => h && h.includes('人际关系'));
    const npcTableKey = npcTable.key || '';

    console.info(`[DICE]人物关系表查找: 表格"${npcTableKey || '未知'}"，共${rows.length}行数据`);

    if (relationIdx < 0) {
      console.warn('[DICE]人物关系表查找: 未找到"人际关系"列');
      deps.warnTableTemplateIssue('未找到"人际关系"列');
      return;
    }

    const nodes = new Map<string, RelationGraphNode>();
    const edges: RelationGraphEdge[] = [];

    const resolveName = (name: RelationGraphCell): string => deps.resolveUserGraphName(String(name || ''));

    const rawData = deps.getCachedRawData() || deps.getTableData();
    // 重建别名注册表
    deps.NameAliasRegistry.rebuild(deps.processJsonData(rawData || {}));
    let playerName = '主角';
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          const headers = sheet.content[0] || [];
          playerName = getRowDisplayName(sheet.content[1], headers) || '主角';
          break;
        }
      }
    }
    const resolvedPlayerName = resolveName(playerName);
    const playerTableKey = (() => {
      for (const k in rawData) {
        if (rawData[k]?.name?.includes('主角')) return k;
      }
      return '';
    })();
    nodes.set(resolvedPlayerName, {
      name: resolvedPlayerName,
      isPlayer: true,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,
      tableKey: playerTableKey,
      rowIndex: 0,
    });

    // 查找"在场状态"列索引（模糊匹配）
    const inSceneColIdx = headers.findIndex(h => h && h.includes('在场'));

    rows.forEach((row, idx) => {
      const rawNpcName = row[nameIdx];
      if (!rawNpcName) return;

      const npcName = resolveName(rawNpcName);

      // 判断是否在场：支持多种格式
      let isInScene = false;
      if (inSceneColIdx > 0) {
        const inSceneVal = String(row[inSceneColIdx] || '')
          .trim()
          .toLowerCase();
        const header = String(headers[inSceneColIdx] || '').toLowerCase();

        if (header.includes('离场')) {
          isInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
        } else {
          isInScene =
            inSceneVal.startsWith('在场') || inSceneVal === 'true' || inSceneVal === '是' || inSceneVal === 'yes';
        }
      }

      if (!nodes.has(npcName)) {
        nodes.set(npcName, {
          name: npcName,
          isPlayer: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 0,
          tableKey: npcTableKey,
          rowIndex: idx,
          isInScene: isInScene,
        });
      }

      const relationStr = row[relationIdx] || '';
      const relations = deps.parseRelationshipString(String(relationStr || '')) as ParsedRelationshipItem[];

      relations.forEach(rel => {
        if (!rel.name) return;
        const resolvedRelName = resolveName(rel.name);

        if (resolvedRelName === npcName) return;

        if (!nodes.has(resolvedRelName)) {
          // 查找该人物在NPC表中的行索引
          let relRowIndex = -1;
          let relIsInScene = false;
          for (let ri = 0; ri < rows.length; ri++) {
            if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
              relRowIndex = ri;
              // 同时读取该角色的在场状态
              if (inSceneColIdx > 0) {
                const inSceneVal = String(rows[ri][inSceneColIdx] || '')
                  .trim()
                  .toLowerCase();
                const header = String(headers[inSceneColIdx] || '').toLowerCase();

                if (header.includes('离场')) {
                  relIsInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
                } else {
                  relIsInScene =
                    inSceneVal.startsWith('在场') ||
                    inSceneVal === 'true' ||
                    inSceneVal === '是' ||
                    inSceneVal === 'yes';
                }
              }
              break;
            }
          }
          nodes.set(resolvedRelName, {
            name: resolvedRelName,
            isPlayer: resolvedRelName === resolvedPlayerName,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 0,
            tableKey: relRowIndex >= 0 ? npcTableKey : '',
            rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
            isInScene: relIsInScene,
          });
        }

        // 清洗关系词：移除冗余前缀/后缀，分割多关系词
        const cleanRelation = (rawRel: RelationGraphCell): string[] => {
          if (!rawRel) return [];
          const parts = String(rawRel)
            .split(/[,，、;；\/\|]+|\s*[和与&]\s*|\s{2,}|\n/)
            .map(s => s.trim())
            .filter(s => s && s.length < 30); // 放宽初筛限制，后续智能提取

          // 常见关系词库（用于从长文本中智能提取）
          const commonRelations = [
            '恋人',
            '情侣',
            '夫妻',
            '伴侣',
            '爱人',
            '男友',
            '女友',
            '前男友',
            '前女友',
            '朋友',
            '好友',
            '挚友',
            '密友',
            '闺蜜',
            '死党',
            '知己',
            '损友',
            '同学',
            '校友',
            '同窗',
            '学长',
            '学姐',
            '学弟',
            '学妹',
            '前辈',
            '后辈',
            '同事',
            '上司',
            '下属',
            '老板',
            '员工',
            '搭档',
            '队友',
            '战友',
            '伙伴',
            '师父',
            '师傅',
            '徒弟',
            '弟子',
            '老师',
            '学生',
            '导师',
            '门生',
            '父亲',
            '母亲',
            '儿子',
            '女儿',
            '兄弟',
            '姐妹',
            '哥哥',
            '姐姐',
            '弟弟',
            '妹妹',
            '爷爷',
            '奶奶',
            '外公',
            '外婆',
            '叔叔',
            '阿姨',
            '舅舅',
            '姑姑',
            '表哥',
            '表姐',
            '表弟',
            '表妹',
            '堂兄',
            '堂弟',
            '堂姐',
            '堂妹',
            '家人',
            '亲人',
            '亲戚',
            '血亲',
            '义父',
            '义母',
            '义兄',
            '义妹',
            '敌人',
            '仇人',
            '对手',
            '劲敌',
            '宿敌',
            '情敌',
            '死敌',
            '冤家',
            '邻居',
            '室友',
            '房东',
            '租客',
            '客户',
            '商人',
            '雇主',
            '雇员',
            '信徒',
            '教徒',
            '追随者',
            '崇拜者',
            '粉丝',
            '陌生人',
            '熟人',
            '路人',
            '过客',
          ];

          return parts
            .map(p => {
              // [新增] 移除所有中英文括号及其内容
              p = p.replace(/[（(][^）)]*[）)]/g, '').trim();
              // === 特殊前缀处理：XX的目标/对象 → 保留XX ===
              const specialSuffixMatch = p.match(/^(.+)的(目标|对象)$/);
              if (specialSuffixMatch) {
                p = specialSuffixMatch[1]; // "执念的目标" → "执念"
              } else {
                // === 普通情况：XX的YY → 保留YY ===
                p = p.replace(/^[\u4e00-\u9fa5]{2,4}的(?=[\u4e00-\u9fa5]{1,4}$)/, '');
              }

              // === 移除冗余前缀 ===
              p = p.replace(/^(?:属于|作为|身为|是其?|为其?|乃)/, '');
              p = p.replace(/^(?:曾经是?|以前是?|原本是?|前)/, '前');
              p = p.replace(/^(?:互为|彼此是?|相互是?)/, '');

              // === 移除冗余后缀 ===
              p = p.replace(/关系$/, '');
              p = p.replace(/对象$/, '');
              p = p.replace(/目标$/, '');

              // === 特殊短语替换 ===
              p = p.replace(/^关系复杂$/, '复杂');
              p = p.replace(/^关系不明$/, '不明');
              p = p.replace(/^关系微妙$/, '微妙');
              p = p.replace(/^关系紧张$/, '紧张');
              p = p.replace(/^关系亲密$/, '亲密');
              p = p.replace(/^关系疏远$/, '疏远');
              p = p.replace(/^(?:不认识|不熟悉|陌生人?)$/, '陌生');
              p = p.replace(/^(?:认识|熟人)$/, '熟人');
              p = p.replace(/^(?:好朋友|挚友|密友|至交)$/, '挚友');
              p = p.replace(/^(?:男朋友|男友)$/, '男友');
              p = p.replace(/^(?:女朋友|女友)$/, '女友');
              p = p.replace(/^(?:前男友|前男朋友)$/, '前男友');
              p = p.replace(/^(?:前女友|前女朋友)$/, '前女友');
              p = p.replace(/^(?:暗恋对象|暗恋)$/, '暗恋');
              p = p.replace(/^(?:单相思|单恋)$/, '单恋');
              p = p.replace(/^(?:青梅竹马|儿时玩伴|发小)$/, '青梅竹马');
              p = p.replace(/^(?:同班同学|同级同学)$/, '同学');
              p = p.replace(/^(?:工作伙伴|合作伙伴|搭档)$/, '搭档');

              p = p.trim();

              // === [新增] 智能提取：如果处理后仍然过长，尝试从末尾提取常见关系词 ===
              if (p.length > 8) {
                // 尝试匹配末尾的常见关系词
                for (const rel of commonRelations) {
                  if (p.endsWith(rel)) {
                    return rel;
                  }
                }
                // 如果没匹配到，尝试提取最后2-4个字
                const lastChars = p.slice(-4);
                for (const rel of commonRelations) {
                  if (lastChars.includes(rel)) {
                    return rel;
                  }
                }
                // 兜底：取最后3个字
                return p.slice(-3);
              }

              return p;
            })
            .filter(s => s && s.length > 0 && s.length <= 8);
        };

        const cleanedLabels = cleanRelation(rel.relation);
        if (cleanedLabels.length === 0) cleanedLabels.push('');

        // 查找已存在的边（无论方向）
        const existingEdge = edges.find(
          e =>
            (e.source === npcName && e.target === resolvedRelName) ||
            (e.source === resolvedRelName && e.target === npcName),
        );

        if (!existingEdge) {
          // 创建新边，使用新的数据结构
          edges.push({
            source: npcName,
            target: resolvedRelName,
            // 新结构：分别存储两个方向的标签
            labelsFromSource: cleanedLabels.slice(0, 2), // source→target 方向，最多2个
            labelsFromTarget: [], // target→source 方向
          });
        } else {
          // 边已存在，追加标签到正确的方向
          if (existingEdge.source === npcName) {
            // 当前npc是source，追加到 labelsFromSource
            const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
            // 去重并限制最多2个
            existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
          } else {
            // 当前npc是target，追加到 labelsFromTarget
            const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
            existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
          }
        }
      });
    });

    // [新增] 同时抓取主角信息表的人际关系数据
    if (options.includePlayerRelations !== false && rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name === '主角信息' && sheet.content?.[1]) {
          const playerHeaders = sheet.content[0] || [];
          const playerRow = sheet.content[1];
          const playerRelIdx = playerHeaders.findIndex(h => h && h.includes('人际关系'));
          if (playerRelIdx > 0 && playerRow[playerRelIdx]) {
            const playerRelations = deps.parseRelationshipString(
              String(playerRow[playerRelIdx] || ''),
            ) as ParsedRelationshipItem[];
            console.info(`[DICE]主角信息表人际关系: 发现${playerRelations.length}条关系`);

            playerRelations.forEach(rel => {
              if (!rel.name) return;
              const resolvedRelName = resolveName(rel.name);
              if (resolvedRelName === resolvedPlayerName) return;

              if (!nodes.has(resolvedRelName)) {
                // 尝试在NPC表中查找该人物的额外信息
                let relRowIndex = -1;
                let relIsInScene = false;
                for (let ri = 0; ri < rows.length; ri++) {
                  if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
                    relRowIndex = ri;
                    if (inSceneColIdx > 0) {
                      const inSceneVal = String(rows[ri][inSceneColIdx] || '')
                        .trim()
                        .toLowerCase();
                      const header = String(headers[inSceneColIdx] || '').toLowerCase();
                      if (header.includes('离场')) {
                        relIsInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
                      } else {
                        relIsInScene =
                          inSceneVal.startsWith('在场') ||
                          inSceneVal === 'true' ||
                          inSceneVal === '是' ||
                          inSceneVal === 'yes';
                      }
                    }
                    break;
                  }
                }
                nodes.set(resolvedRelName, {
                  name: resolvedRelName,
                  isPlayer: false,
                  x: 0,
                  y: 0,
                  vx: 0,
                  vy: 0,
                  radius: 0,
                  tableKey: relRowIndex >= 0 ? npcTableKey : '',
                  rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
                  isInScene: relIsInScene,
                });
              }

              // 清洗关系标签（主角信息表格式通常已规范）
              const rawLabel = String(rel.relation || '').trim();
              const cleanedLabels = rawLabel
                ? rawLabel
                    .split(/[,，、\/\|]+/)
                    .map(s => s.trim())
                    .filter(s => s && s.length > 0 && s.length <= 8)
                    .slice(0, 2)
                : [''];
              if (cleanedLabels.length === 0) cleanedLabels.push('');

              // 查找已存在的边（与NPC表处理逻辑一致）
              const existingEdge = edges.find(
                e =>
                  (e.source === resolvedPlayerName && e.target === resolvedRelName) ||
                  (e.source === resolvedRelName && e.target === resolvedPlayerName),
              );

              if (!existingEdge) {
                edges.push({
                  source: resolvedPlayerName,
                  target: resolvedRelName,
                  labelsFromSource: cleanedLabels.slice(0, 2),
                  labelsFromTarget: [],
                });
              } else {
                // 边已存在（可能NPC表已创建该边），追加主角视角的标签
                if (existingEdge.source === resolvedPlayerName) {
                  const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
                  existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
                } else {
                  const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
                  existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
                }
              }
            });
          }
          break;
        }
      }
    }

    const nodeArr = Array.from(nodes.values());
    console.info(`[DICE]人物关系表数据抓取完成，共${nodeArr.length}个节点，${edges.length}条边`);
    const centerX = 400,
      centerY = 300;

    // [新增] 统计每个节点的关系数量
    const connectionCount = new Map<string, number>();
    nodeArr.forEach(node => connectionCount.set(node.name, 0));
    edges.forEach(edge => {
      connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
      connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
    });

    // [新增] 根据屏幕尺寸和关系数量计算节点半径
    const isMobileView = window.innerWidth <= 768;
    const baseRadius = isMobileView ? 22 : 28;
    const maxRadius = isMobileView ? 38 : 50;
    const playerBaseRadius = isMobileView ? 28 : 35;
    const radiusPerConnection = isMobileView ? 2.5 : 3.5;

    // 新增：节点大小和过滤状态（必须在 getNodeRadius 之前声明）
    let nodeSizeMultiplier = 1.0; // 节点大小倍数，默认1.0
    let filterInScene = false; // 是否只显示主角+在场角色
    let filterDirectOnly = false; // 是否只显示与中心角色直接相关的
    let centerNodeName = resolvedPlayerName; // 当前中心节点（默认为主角）

    const getNodeRadius = (nodeName: string, isPlayer: boolean): number => {
      const base = isPlayer ? playerBaseRadius : baseRadius;
      const count = connectionCount.get(nodeName) || 0;
      const calculated = Math.min(maxRadius, base + Math.sqrt(count) * radiusPerConnection);
      // 应用全局大小倍数
      return calculated * nodeSizeMultiplier;
    };

    // 将半径信息存入节点
    nodeArr.forEach(node => {
      node.radius = getNodeRadius(node.name, node.isPlayer);
    });

    // 过滤节点逻辑（支持两个筛选条件的交集）
    const getFilteredNodes = (): RelationGraphNode[] => {
      // 两个都关闭时显示全部
      if (!filterInScene && !filterDirectOnly) return nodeArr;

      // 计算中心角色直接相关的节点集合（如果需要）
      let directNodes: Set<string> | null = null;
      if (filterDirectOnly) {
        directNodes = new Set([centerNodeName]);
        edges.forEach(edge => {
          if (edge.source === centerNodeName) directNodes!.add(edge.target);
          if (edge.target === centerNodeName) directNodes!.add(edge.source);
        });
      }

      return nodeArr.filter(n => {
        // 检查在场条件
        const passInScene = !filterInScene || n.isInScene || n.isPlayer;
        // 检查主角相关条件
        const passDirectOnly = !filterDirectOnly || directNodes!.has(n.name);
        // 两个条件取交集
        return passInScene && passDirectOnly;
      });
    };

    // [Modified] 力导向布局实现
    // ---------------------------------------------------------
    // 物理参数常量 (已调整以增加间距)
    const kRepulsion = 20000; // 斥力常数 (库仑定律) - 大幅增大以推开节点
    const kSpring = 0.02; // 弹力常数 (胡克定律) - 减小以避免拉得太紧
    const kGravity = 0.01; // 中心引力 - 减小以允许图表扩展遍布画面
    const idealLen = 250; // 理想边长 - 增大以拉开连线距离
    const iterations = 300; // 预计算迭代次数
    const timeStep = 0.5; // 模拟时间步长
    const damping = 0.8; // 速度阻尼 (摩擦力)

    // 布局缓存管理
    const LAYOUT_CACHE_KEY = 'acu-relation-graph-layout-cache';

    // 生成布局缓存键（基于节点名单）
    const getLayoutCacheKey = () => {
      const nodeNames = nodeArr
        .map(n => n.name)
        .sort()
        .join('|');
      return `${LAYOUT_CACHE_KEY}-${nodeNames}`;
    };

    // 保存布局到缓存
    const saveLayoutCache = () => {
      try {
        const cacheKey = getLayoutCacheKey();
        const layoutData: RelationGraphLayoutCache = {};
        nodeArr.forEach(node => {
          layoutData[node.name] = { x: node.x, y: node.y };
        });
        localStorage.setItem(cacheKey, JSON.stringify(layoutData));
      } catch (e) {
        console.warn('[DICE]关系图 保存布局缓存失败:', e);
      }
    };

    const parseLayoutCache = (cached: string): RelationGraphLayoutCache | null => {
      const parsed = JSON.parse(cached) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

      const layoutData: RelationGraphLayoutCache = {};
      Object.entries(parsed as Record<string, unknown>).forEach(([name, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return;
        const position = value as Record<string, unknown>;
        const x = Number(position.x);
        const y = Number(position.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        layoutData[name] = { x, y };
      });

      return Object.keys(layoutData).length > 0 ? layoutData : null;
    };

    const readLayoutCache = (cacheKey: string): RelationGraphLayoutCache | null => {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      return parseLayoutCache(cached);
    };

    const findReusableLayoutCache = (): RelationGraphLayoutCache | null => {
      const currentCacheKey = getLayoutCacheKey();
      const currentLayout = readLayoutCache(currentCacheKey);
      if (currentLayout) return currentLayout;

      let bestLayout: RelationGraphLayoutCache | null = null;
      let bestMatchCount = 0;
      const nodeNames = new Set(nodeArr.map(node => node.name));

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key === currentCacheKey || !key.startsWith(`${LAYOUT_CACHE_KEY}-`)) continue;

        const layoutData = readLayoutCache(key);
        if (!layoutData) continue;

        const matchCount = Object.keys(layoutData).filter(name => nodeNames.has(name)).length;
        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestLayout = layoutData;
        }
      }

      return bestMatchCount > 0 ? bestLayout : null;
    };

    const applyLayoutCache = (layoutData: RelationGraphLayoutCache): RelationGraphLayoutLoadResult => {
      let appliedCount = 0;

      nodeArr.forEach(node => {
        const cached = layoutData[node.name];
        if (!cached) {
          node.fixed = false;
          return;
        }

        node.x = cached.x;
        node.y = cached.y;
        node.vx = 0;
        node.vy = 0;
        node.fixed = true;
        appliedCount++;
      });

      if (appliedCount === 0) return 'none';
      return appliedCount === nodeArr.length ? 'full' : 'partial';
    };

    // 从缓存加载布局
    const loadLayoutCache = (): RelationGraphLayoutLoadResult => {
      try {
        const layoutData = findReusableLayoutCache();
        if (!layoutData) return 'none';
        return applyLayoutCache(layoutData);
      } catch (e) {
        console.warn('[DICE]关系图 加载布局缓存失败:', e);
        return 'none';
      }
    };

    // 清除布局缓存
    const clearLayoutCache = () => {
      try {
        const cacheKey = getLayoutCacheKey();
        localStorage.removeItem(cacheKey);
      } catch (e) {
        console.warn('[DICE]关系图 清除布局缓存失败:', e);
      }
    };

    const isFixedLayoutNode = (node: RelationGraphNode, preserveFixedNodes: boolean): boolean => {
      return node.name === centerNodeName || (preserveFixedNodes && node.fixed === true);
    };

    // 力导向布局物理模拟函数
    const runForceDirectedLayout = (preserveFixedNodes = false) => {
      // 初始化位置：在中心附近随机散布，开始模拟
      nodeArr.forEach(node => {
        if (!preserveFixedNodes) node.fixed = false;
        if (preserveFixedNodes && node.fixed === true) {
          node.vx = 0;
          node.vy = 0;
          return;
        }

        if (node.name === centerNodeName) {
          node.x = centerX;
          node.y = centerY;
          node.vx = 0;
          node.vy = 0;
        } else {
          // 在中心 100px 范围内随机散布
          const angle = Math.random() * 2 * Math.PI;
          const dist = 50 + Math.random() * 100;
          node.x = centerX + Math.cos(angle) * dist;
          node.y = centerY + Math.sin(angle) * dist;
          node.vx = 0;
          node.vy = 0;
        }
      });

      // 建立映射以便 O(1) 查找节点
      const nodeMap = new Map<string, RelationGraphNode>();
      nodeArr.forEach(n => nodeMap.set(n.name, n));

      // 预计算模拟 (迭代运行物理引擎)
      for (let iter = 0; iter < iterations; iter++) {
        // 1. 斥力 (节点 vs 节点)
        for (let i = 0; i < nodeArr.length; i++) {
          const u = nodeArr[i];
          for (let j = i + 1; j < nodeArr.length; j++) {
            const v = nodeArr[j];
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            let distSq = dx * dx + dy * dy;
            if (distSq < 1) distSq = 1; // 防止除以零

            const dist = Math.sqrt(distSq);
            const force = kRepulsion / distSq;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!isFixedLayoutNode(u, preserveFixedNodes)) {
              u.vx -= fx;
              u.vy -= fy;
            }
            if (!isFixedLayoutNode(v, preserveFixedNodes)) {
              v.vx += fx;
              v.vy += fy;
            }
          }
        }

        // 2. 引力 (边连接)
        edges.forEach(edge => {
          const u = nodeMap.get(edge.source);
          const v = nodeMap.get(edge.target);
          if (!u || !v) return;

          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // 弹簧力: F = k * (当前距离 - 理想距离)
          const force = (dist - idealLen) * kSpring;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!isFixedLayoutNode(u, preserveFixedNodes)) {
            u.vx += fx;
            u.vy += fy;
          }
          if (!isFixedLayoutNode(v, preserveFixedNodes)) {
            v.vx -= fx;
            v.vy -= fy;
          }
        });

        // 3. 中心重力 (轻微拉向中心)
        nodeArr.forEach(node => {
          if (isFixedLayoutNode(node, preserveFixedNodes)) return;
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * kGravity;
          node.vy += dy * kGravity;
        });

        // 4. 更新位置
        // 限制最大速度以防爆炸
        const maxSpeed = 50 * (1 - iter / iterations); // 随迭代冷却最大速度

        nodeArr.forEach(node => {
          if (isFixedLayoutNode(node, preserveFixedNodes)) return; // 中心节点和已缓存节点固定不动

          // 阻尼
          node.vx *= damping;
          node.vy *= damping;

          // 限制速度
          const vMag = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          if (vMag > maxSpeed) {
            node.vx = (node.vx / vMag) * maxSpeed;
            node.vy = (node.vy / vMag) * maxSpeed;
          }

          node.x += node.vx * timeStep;
          node.y += node.vy * timeStep;
        });
      }

      // 物理模拟完成后保存布局
      saveLayoutCache();
    };

    // 运行初始布局（优先使用缓存）
    const layoutLoadResult = loadLayoutCache();
    if (layoutLoadResult !== 'full') {
      // 缓存不存在或不匹配，运行物理模拟
      runForceDirectedLayout(layoutLoadResult === 'partial');
    }

    // 视图状态
    let scale = 1;
    let panX = 0;
    let panY = 0;
    const minScale = 0.3;
    const maxScale = 4;
    let moveModeEnabled = false;

    const overlay = $(`
            <div class="acu-relation-graph-overlay acu-theme-${config.theme}">
                <div class="acu-relation-graph-container">
                    <div class="acu-panel-header">
                        <div class="acu-graph-title">
                            <span class="acu-graph-heading">
                                <i class="fa-solid fa-project-diagram"></i>
                                <span class="acu-graph-heading-text">人物关系图</span>
                            </span>
                            <div class="acu-graph-center-dropdown" id="graph-center-dropdown">
                                <button class="acu-graph-center-trigger" type="button" title="选择中心角色" aria-label="选择中心角色" aria-haspopup="listbox" aria-expanded="false">
                                    <span class="acu-center-label">${deps.escapeHtml(deps.replaceUserPlaceholders(centerNodeName))}</span>
                                    <i class="fa-solid fa-caret-down"></i>
                                </button>
                                <div class="acu-graph-center-menu" role="listbox">
                                    ${nodeArr.map(n => `<div class="acu-center-option${n.name === centerNodeName ? ' active' : ''}" role="option" aria-selected="${n.name === centerNodeName ? 'true' : 'false'}" data-value="${deps.escapeHtml(n.name)}">${deps.escapeHtml(deps.replaceUserPlaceholders(n.name))}</div>`).join('')}
                                </div>
                            </div>
                            <span class="acu-graph-filter-controls" id="graph-filter-controls">
                                <button class="acu-graph-btn acu-filter-toggle acu-graph-filter-btn" id="filter-in-scene" type="button" title="只显示在场角色" aria-label="只显示在场角色" aria-pressed="false"><i class="fa-solid fa-map-marker-alt"></i></button>
                                <button class="acu-graph-btn acu-filter-toggle acu-graph-filter-btn" id="filter-direct-only" type="button" title="只显示与中心角色直接相关" aria-label="只显示与中心角色直接相关" aria-pressed="false"><i class="fa-solid fa-link"></i></button>
                                <button class="acu-graph-btn acu-filter-toggle acu-graph-filter-btn" id="graph-move-mode" type="button" title="移动模式：拖动头像调整位置" aria-label="移动模式：拖动头像调整位置" aria-pressed="false"><i class="fa-solid fa-up-down-left-right"></i></button>
                            </span>
                        </div>
                        <div class="acu-graph-actions">
                            ${deps.getTutorialButtonHtml('relationshipGraph', '查看人物关系图教程', 'acu-graph-btn')}
                            <button class="acu-graph-btn" id="graph-relayout" type="button" title="重新布局（清除缓存并重新计算节点位置）" aria-label="重新布局"><i class="fa-solid fa-sync"></i></button>
                            <button class="acu-graph-btn" id="graph-manage-avatar" type="button" title="管理头像" aria-label="管理头像"><i class="fa-solid fa-user-circle"></i></button>
                            <button class="acu-graph-btn acu-graph-close" type="button" title="关闭" aria-label="关闭人物关系图"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-graph-canvas-wrapper">
                        <svg class="acu-graph-svg" viewBox="0 0 800 600">
                            <defs>
                                <marker id="arrowhead-end" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="0 0, 6 2.5, 0 5" />
                                </marker>
                                <marker id="arrowhead-start" markerWidth="6" markerHeight="5" refX="1" refY="2.5" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="6 0, 0 2.5, 6 5" />
                                </marker>
                                <marker id="arrowhead-end-hl" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="0 0, 7 3, 0 6" />
                                </marker>
                                <marker id="arrowhead-start-hl" markerWidth="7" markerHeight="6" refX="1" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="7 0, 0 3, 7 6" />
                                </marker>
                            </defs>
                            <g class="acu-graph-transform">
                                <g class="acu-graph-edges"></g>
                                <g class="acu-graph-nodes"></g>
                            </g>
                        </svg>
                        <div class="acu-node-size-slider-container">
                            <div class="acu-slider-header">
                                <span class="acu-slider-label">节点大小</span>
                                <span id="slider-size-display" class="acu-slider-value">${Math.round(nodeSizeMultiplier * 100)}%</span>
                            </div>
                            <input type="range" id="node-size-slider" min="0.5" max="2.0" step="0.1" value="${nodeSizeMultiplier}" class="acu-range-input" />
                        </div>
                    </div>
                    <div class="acu-graph-legend">
                        <div class="acu-graph-view-controls">
                            <button class="acu-graph-btn acu-graph-reset-btn" id="graph-zoom-reset" type="button" title="重置视图和节点大小" aria-label="重置视图和节点大小"><i class="fa-solid fa-compress-arrows-alt"></i><span>重置</span></button>
                            <div class="acu-node-size-stepper-wrapper acu-node-size-wrapper">
                                <span class="acu-graph-node-size-label">节点:</span>
                                <div class="acu-stepper acu-stepper-container" data-id="graph-node-size" data-min="50" data-max="200" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec" type="button" aria-label="缩小节点"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value acu-stepper-value-display" id="node-size-display">${Math.round(nodeSizeMultiplier * 100)}%</span>
                                    <button class="acu-stepper-btn acu-stepper-inc" type="button" aria-label="放大节点"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <span class="acu-zoom-display acu-zoom-info">
                                <span>视图:</span>
                                <span>${Math.round(scale * 100)}%</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const $svg = overlay.find('.acu-graph-svg');
    const $transform = overlay.find('.acu-graph-transform');
    const $edgesGroup = overlay.find('.acu-graph-edges');
    const $nodesGroup = overlay.find('.acu-graph-nodes');
    const $zoomDisplay = overlay.find('.acu-zoom-display span:last-child');
    const $nodeSizeDisplay = overlay.find('#node-size-display');
    const $wrapper = overlay.find('.acu-graph-canvas-wrapper');
    const $moveModeBtn = overlay.find('#graph-move-mode');

    const updateTransform = () => {
      $transform.attr('transform', `translate(${panX}, ${panY}) scale(${scale})`);
      $zoomDisplay.text(`${Math.round(scale * 100)}%`);
    };

    const updateNodeSizeDisplay = () => {
      if ($nodeSizeDisplay.length) {
        $nodeSizeDisplay.text(`${Math.round(nodeSizeMultiplier * 100)}%`);
      }
    };

    const updateMoveModeStyles = () => {
      $moveModeBtn.toggleClass('active', moveModeEnabled);
      $moveModeBtn.attr('aria-pressed', moveModeEnabled ? 'true' : 'false');
      $wrapper.toggleClass('acu-graph-move-mode', moveModeEnabled);
      $svg.toggleClass('acu-graph-move-mode', moveModeEnabled);
    };

    const zoomTo = (newScale: number, centerX = 400, centerY = 300) => {
      const oldScale = scale;
      scale = Math.max(minScale, Math.min(maxScale, newScale));
      const scaleChange = scale / oldScale;
      panX = centerX - (centerX - panX) * scaleChange;
      panY = centerY - (centerY - panY) * scaleChange;
      updateTransform();
    };

    let graphRenderQueued = false;
    const nodeAvatarCache = new Map<string, string>();
    const nodeAvatarRequests = new Set<string>();

    const requestGraphRender = () => {
      if (graphRenderQueued) return;
      graphRenderQueued = true;
      window.requestAnimationFrame(() => {
        graphRenderQueued = false;
        render();
      });
    };

    const getCachedNodeAvatar = (nodeName: string): string => {
      const cachedAvatar = nodeAvatarCache.get(nodeName);
      if (cachedAvatar !== undefined) return cachedAvatar;

      const syncAvatar = deps.AvatarManager.get(nodeName) || '';
      nodeAvatarCache.set(nodeName, syncAvatar);

      if (!nodeAvatarRequests.has(nodeName)) {
        nodeAvatarRequests.add(nodeName);
        void deps.AvatarManager.getAsync(nodeName)
          .then(avatar => {
            const nextAvatar = avatar || '';
            const previousAvatar = nodeAvatarCache.get(nodeName) || '';
            nodeAvatarCache.set(nodeName, nextAvatar);
            nodeAvatarRequests.delete(nodeName);
            if (nextAvatar !== previousAvatar) requestGraphRender();
          })
          .catch(error => {
            nodeAvatarRequests.delete(nodeName);
            console.warn('[DICE]关系图 头像加载失败:', nodeName, error);
          });
      }

      return syncAvatar;
    };

    const render = () => {
      // 获取过滤后的节点
      const filteredNodes = getFilteredNodes();
      const filteredNodeNames = new Set(filteredNodes.map(n => n.name));

      // 过滤边：只保留连接两个可见节点的边
      const filteredEdges = edges.filter(
        edge => filteredNodeNames.has(edge.source) && filteredNodeNames.has(edge.target),
      );

      let edgesHtml = '';
      filteredEdges.forEach((edge, edgeIdx) => {
        const source = nodes.get(edge.source);
        const target = nodes.get(edge.target);
        if (!source || !target) return;

        // 计算方向向量和中点
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / len; // 单位向量
        const ny = dy / len;

        // 垂直于连线的向量（用于标签偏移）
        const px = -ny;
        const py = nx;

        // 判断箭头类型
        const hasFromSource =
          edge.labelsFromSource && edge.labelsFromSource.length > 0 && edge.labelsFromSource.some(l => l);
        const hasFromTarget =
          edge.labelsFromTarget && edge.labelsFromTarget.length > 0 && edge.labelsFromTarget.some(l => l);

        // 缩短线条，避免箭头与节点重叠（增加额外间距）
        const sourceRadius = source.radius || 28;
        const targetRadius = target.radius || 28;
        const arrowGap = 10; // 箭头与节点之间的额外间距（考虑大节点）
        const x1 = source.x + nx * (sourceRadius + arrowGap);
        const y1 = source.y + ny * (sourceRadius + arrowGap);
        const x2 = target.x - nx * (targetRadius + arrowGap);
        const y2 = target.y - ny * (targetRadius + arrowGap);

        // 智能去重：跨方向移除重复标签
        let srcLabels = (edge.labelsFromSource || []).filter(l => l);
        let tgtLabels = (edge.labelsFromTarget || []).filter(l => l);

        // 找出两边都有的标签（共同标签）
        const srcSet = new Set(srcLabels);
        const tgtSet = new Set(tgtLabels);
        const commonLabels = [...srcSet].filter(l => tgtSet.has(l));

        // 从两边移除共同标签，它们将显示在中间
        const srcUnique = srcLabels.filter(l => !commonLabels.includes(l));
        const tgtUnique = tgtLabels.filter(l => !commonLabels.includes(l));

        // 设置箭头标记
        let markerStart = '';
        let markerEnd = '';
        if (hasFromSource) markerEnd = 'url(#arrowhead-end)';
        if (hasFromTarget) markerStart = 'url(#arrowhead-start)';

        edgesHtml += `<line class="acu-graph-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                    ${markerEnd ? `marker-end="${markerEnd}"` : ''}
                    ${markerStart ? `marker-start="${markerStart}"` : ''}
                    data-edge-idx="${edgeIdx}" />`;

        // 渲染标签
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        // 计算标签位置（根据连线长度动态调整，更紧凑）
        const lineLen = Math.sqrt(dx * dx + dy * dy);

        // 判断是否是"双向且内容完全一致"的情况
        const isBidirectional = hasFromSource && hasFromTarget;
        const isBidirectionalSame =
          isBidirectional && commonLabels.length > 0 && srcUnique.length === 0 && tgtUnique.length === 0;

        // 只有双向且完全一致时，标签才显示在正中间
        if (isBidirectionalSame) {
          // 双向相同：标签显示在正中间
          // [修复] 移动 renderRelationIcon 和 addRelationIcon 到这里也能使用
          const renderRelationIconInline = (iconStr: string): string => {
            if (iconStr.startsWith('fa:')) {
              return `<i class="fa-solid fa-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            } else if (iconStr.startsWith('ti:')) {
              return `<i class="ti ti-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            }
            return iconStr;
          };

          const addRelationIconInline = (lbl: string): string => {
            if (!lbl) return '';
            for (const group of RELATION_ICON_MAP) {
              for (const kw of group.keywords) {
                if (lbl.includes(kw)) {
                  return lbl + renderRelationIconInline(group.icon);
                }
              }
            }
            return lbl;
          };

          commonLabels.slice(0, 2).forEach((lbl, i) => {
            if (!lbl) return;
            const offsetDir = i === 0 ? 1 : -1;
            const offsetDist = 6 + i * 10;
            const lx = midX + px * offsetDir * offsetDist;
            const ly = midY + py * offsetDir * offsetDist;
            // [修复] 添加图标支持
            const content = addRelationIconInline(lbl);
            if (content.includes('<i ')) {
              // 使用foreignObject渲染HTML内容
              edgesHtml += `<foreignObject x="${lx - 50}" y="${ly - 10}" width="100" height="20" style="overflow:visible;">
                <div xmlns="http://www.w3.org/1999/xhtml" class="acu-graph-edge-label-html" data-edge-idx="${edgeIdx}" style="
                  display:flex;align-items:center;justify-content:center;
                  font-size:11px;color:var(--acu-text-sub);white-space:nowrap;
                  pointer-events:none;
                ">${content}</div>
              </foreignObject>`;
            } else {
              edgesHtml += `<text class="acu-graph-edge-label" x="${lx}" y="${ly}" data-edge-idx="${edgeIdx}">${deps.escapeHtml(lbl)}</text>`;
            }
          });
        } else {
          // 单向或双向不同：分区域显示
          // 偏移量：从中点向source/target方向偏移，但不要太靠近节点
          // 使用连线长度的25%，但限制在合理范围内
          const safeOffset = Math.max(30, Math.min(lineLen * 0.25, 60));

          // 渲染关系图标为HTML
          const renderRelationIcon = (iconStr: string): string => {
            if (iconStr.startsWith('fa:')) {
              return `<i class="fa-solid fa-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            } else if (iconStr.startsWith('ti:')) {
              return `<i class="ti ti-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            }
            return iconStr;
          };

          // 给关系词添加图标
          const addRelationIcon = (lbl: string): string => {
            if (!lbl) return '';
            for (const group of RELATION_ICON_MAP) {
              for (const kw of group.keywords) {
                if (lbl.includes(kw)) {
                  return lbl + renderRelationIcon(group.icon);
                }
              }
            }
            return lbl;
          };

          // 截断过长标签的辅助函数（在添加图标之前截断）
          const truncateLabel = (lbl: string, maxLen = 4): string => {
            if (!lbl) return '';
            const truncated = lbl.length > maxLen ? lbl.substring(0, maxLen) + '..' : lbl;
            return addRelationIcon(truncated);
          };

          // 生成带图标的标签HTML（使用foreignObject以支持HTML内容）
          const createLabelHtml = (lbl: string, x: number, y: number, edgeIdx: number, maxLen = 5): string => {
            const content = truncateLabel(lbl, maxLen);
            // 检测是否包含HTML标签（图标）
            if (content.includes('<i ')) {
              // 使用foreignObject渲染HTML内容
              return `<foreignObject x="${x - 50}" y="${y - 10}" width="100" height="20" style="overflow:visible;">
                <div xmlns="http://www.w3.org/1999/xhtml" class="acu-graph-edge-label-html" data-edge-idx="${edgeIdx}" style="
                  display:flex;align-items:center;justify-content:center;
                  font-size:11px;color:var(--acu-text-sub);white-space:nowrap;
                  pointer-events:none;
                ">${content}</div>
              </foreignObject>`;
            }
            // 纯文本使用原生text元素
            return `<text class="acu-graph-edge-label" x="${x}" y="${y}" data-edge-idx="${edgeIdx}">${deps.escapeHtml(content)}</text>`;
          };

          // 1. 共同标签（显示在正中间，垂直于连线一上一下）
          if (commonLabels.length > 0) {
            commonLabels.slice(0, 1).forEach((lbl, i) => {
              if (!lbl) return;
              // 单个共同标签放在线的上方
              const lx = midX + px * 8;
              const ly = midY + py * 8 - 3;
              edgesHtml += createLabelHtml(lbl, lx, ly, edgeIdx, 5);
            });
          }

          // 2. Source侧标签（靠近source，垂直于连线排列）
          if (srcUnique.length > 0 || (hasFromSource && !hasFromTarget && commonLabels.length === 0)) {
            const labelsToShow = srcUnique.length > 0 ? srcUnique : srcLabels;
            // 基准点：从中点向source方向偏移
            const labelBaseX = midX - nx * safeOffset;
            const labelBaseY = midY - ny * safeOffset;

            labelsToShow.slice(0, 2).forEach((lbl, i) => {
              if (!lbl) return;
              // 垂直于连线方向排列：第一个在线上方，第二个在线下方
              const perpOffset = (i === 0 ? 1 : -1) * 10;
              const lx = labelBaseX + px * perpOffset;
              const ly = labelBaseY + py * perpOffset;
              edgesHtml += createLabelHtml(lbl, lx, ly, edgeIdx, 5);
            });
          }

          // 3. Target侧标签（靠近target，垂直于连线排列）
          if (tgtUnique.length > 0 || (hasFromTarget && !hasFromSource && commonLabels.length === 0)) {
            const labelsToShow = tgtUnique.length > 0 ? tgtUnique : tgtLabels;
            // 基准点：从中点向target方向偏移
            const labelBaseX = midX + nx * safeOffset;
            const labelBaseY = midY + ny * safeOffset;

            labelsToShow.slice(0, 2).forEach((lbl, i) => {
              if (!lbl) return;
              // 垂直于连线方向排列
              const perpOffset = (i === 0 ? -1 : 1) * 10;
              const lx = labelBaseX + px * perpOffset;
              const ly = labelBaseY + py * perpOffset;
              edgesHtml += createLabelHtml(lbl, lx, ly, edgeIdx, 5);
            });
          }
        }
      });
      $edgesGroup.html(edgesHtml);

      // [修复] 异步获取头像后再渲染节点（使用过滤后的节点）
      let nodesHtml = '';
      for (const node of filteredNodes) {
        // 拖动时使用缓存头像，避免线和文字先重绘、头像等待异步读取后才跟上
        const nodeAvatar = getCachedNodeAvatar(node.name);
        const isPlayer = node.isPlayer;

        // 在场标记：右下角小圆点（随节点大小缩放，Discord风格）
        const indicatorRadius = node.radius * 0.22;
        const indicatorOffset = node.radius * 0.62;
        const inSceneIndicator = node.isInScene
          ? `<circle class="acu-node-inscene-indicator" cx="${indicatorOffset}" cy="${indicatorOffset}" r="${indicatorRadius}" style="fill:var(--acu-accent);stroke:var(--acu-bg-panel);stroke-width:3;" />`
          : '';

        const nodeDisplayName = deps.replaceUserPlaceholders(node.name);
        nodesHtml += `
                <g class="acu-graph-node acu-dash-preview-trigger" data-name="${deps.escapeHtml(node.name)}" data-table-key="${node.tableKey || ''}" data-row-index="${node.rowIndex !== undefined ? node.rowIndex : ''}" transform="translate(${node.x}, ${node.y})">
                    <circle class="acu-node-bg" r="${node.radius}" />
                    ${
                      nodeAvatar
                        ? (() => {
                            const offsetX = deps.AvatarManager.getOffsetX(node.name);
                            const offsetY = deps.AvatarManager.getOffsetY(node.name);
                            const scaleVal = deps.AvatarManager.getScale(node.name);
                            const size = (node.radius - 2) * 2;
                            const shadowWidth = 4; // 预留box-shadow的空间
                            const foSize = size + shadowWidth * 2;
                            const foOffset = foSize / 2;
                            const avatarStyle = deps.escapeHtml(
                              deps.buildAvatarBackgroundStyle(nodeAvatar, offsetX, offsetY, scaleVal),
                            );
                            if (!avatarStyle) {
                              return `<text class="acu-node-char" dy="0.35em">${deps.escapeHtml(nodeDisplayName.charAt(0))}</text>`;
                            }
                            return `<foreignObject x="${-foOffset}" y="${-foOffset}" width="${foSize}" height="${foSize}">
                            <div class="acu-node-avatar" xmlns="http://www.w3.org/1999/xhtml" style="
                                width: ${size}px;
                                height: ${size}px;
                                margin: ${shadowWidth}px;
                                border-radius: 50%;
                                ${avatarStyle}
                                background-repeat: no-repeat;
                            "></div>
                        </foreignObject>`;
                          })()
                        : `<text class="acu-node-char" dy="0.35em">${deps.escapeHtml(nodeDisplayName.charAt(0))}</text>`
                    }
                    ${inSceneIndicator}
                    ${node.name === centerNodeName ? `<circle class="acu-node-center-indicator" r="${node.radius + 5}" />` : ''}
                    <text class="acu-node-label" dy="${node.radius + 14}">${deps.escapeHtml(nodeDisplayName)}</text>
                </g>
            `;
      }
      $nodesGroup.html(nodesHtml);
    };

    // [新增] 悬浮高亮交互函数
    const highlightNode = (nodeName: string) => {
      $svg.addClass('highlighting');

      // 高亮当前节点
      $nodesGroup.find('.acu-graph-node').each(function () {
        if ($(this).data('name') === nodeName) {
          $(this).addClass('highlighted');
        }
      });

      // 找出所有与该节点相连的边和对端节点
      const connectedNodes = new Set([nodeName]);

      // 使用所有边（不仅仅是过滤后的），以便高亮显示所有相关连接
      edges.forEach(edge => {
        if (edge.source === nodeName || edge.target === nodeName) {
          const otherNode = edge.source === nodeName ? edge.target : edge.source;
          connectedNodes.add(otherNode);
        }
      });

      // 高亮相连的节点
      $nodesGroup.find('.acu-graph-node').each(function () {
        if (connectedNodes.has($(this).data('name'))) {
          $(this).addClass('highlighted');
        }
      });

      // 高亮相关的边和标签
      const connectedEdgeIndices = new Set<number>();
      edges.forEach((edge, idx) => {
        if (edge.source === nodeName || edge.target === nodeName) {
          connectedEdgeIndices.add(idx);
        }
      });

      $edgesGroup.find('.acu-graph-edge').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('highlighted');
          if ($(this).attr('marker-end')) {
            $(this).attr('marker-end', 'url(#arrowhead-end-hl)');
          }
          if ($(this).attr('marker-start')) {
            $(this).attr('marker-start', 'url(#arrowhead-start-hl)');
          }
        }
      });

      $edgesGroup.find('.acu-graph-edge-label').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('acu-graph-label-highlighted');
        }
      });

      $edgesGroup.find('.acu-graph-edge-label-html').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('acu-graph-label-highlighted');
        }
      });
    };

    const clearHighlight = () => {
      $svg.removeClass('highlighting');
      $nodesGroup.find('.highlighted').removeClass('highlighted');
      $edgesGroup.find('.highlighted').removeClass('highlighted');
      $edgesGroup.find('.acu-graph-label-highlighted').removeClass('acu-graph-label-highlighted');
      $edgesGroup.find('.acu-graph-edge').each(function () {
        if ($(this).attr('marker-end')) {
          $(this).attr('marker-end', 'url(#arrowhead-end)');
        }
        if ($(this).attr('marker-start')) {
          $(this).attr('marker-start', 'url(#arrowhead-start)');
        }
      });
    };

    // [修复] 节点交互 - PC悬浮高亮 + 移动端长按高亮 + 单击预览
    // 使用pointer媒体查询检测：fine表示精确指针设备(鼠标)，coarse表示粗略指针(触摸)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isTouchDevice = !hasFinePointer;

    // 全局状态
    let currentHighlightedNode = null; // 当前高亮的节点名
    let longPressTimer = null;

    if (isTouchDevice) {
      // ========== 移动端逻辑 ==========
      let currentHighlightedNode = null;

      $nodesGroup.on('pointerdown', '.acu-graph-node', function (e) {
        if (moveModeEnabled) return;
        const $node = $(this);
        const nodeName = $node.data('name');
        const startX = e.clientX;
        const startY = e.clientY;
        const startTime = Date.now();
        let hasMoved = false;
        let longPressTriggered = false;

        // 如果已有高亮，这次点击只用于清除
        if (currentHighlightedNode) {
          clearHighlight();
          currentHighlightedNode = null;
          // 直接return，不绑定后续事件
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 长按计时器
        const longPressTimer = setTimeout(() => {
          if (!hasMoved && nodeName) {
            longPressTriggered = true;
            currentHighlightedNode = nodeName;
            highlightNode(nodeName);
            if (navigator.vibrate) navigator.vibrate(30);
          }
        }, 300);

        const onMove = moveE => {
          const dx = Math.abs(moveE.clientX - startX);
          const dy = Math.abs(moveE.clientY - startY);
          if (dx > 8 || dy > 8) {
            hasMoved = true;
            clearTimeout(longPressTimer);
          }
        };

        const onUp = () => {
          $(document).off('pointermove.mobilenode pointerup.mobilenode pointercancel.mobilenode');
          clearTimeout(longPressTimer);

          const elapsed = Date.now() - startTime;

          // 长按已触发 → 什么都不做（高亮保持）
          if (longPressTriggered) {
            return;
          }

          // 移动了 → 什么都不做
          if (hasMoved) {
            return;
          }

          // 快速点击（<300ms）且没移动 → 显示详情
          if (elapsed < 300) {
            const nodeName = $node.data('name');
            // 使用别名系统找到主名称，以定位正确的表格行
            const primaryName = deps.AvatarManager.getPrimaryName(nodeName);
            const tableKey = $node.data('table-key');
            let rowIndex = $node.data('row-index');

            // 如果当前节点没有tableKey（只出现在别人关系中的角色），尝试通过主名称查找
            if (!tableKey || rowIndex === '' || rowIndex === undefined) {
              // 尝试查找NPC表中是否有该角色
              const rawData = deps.getCachedRawData() || deps.getTableData();
              if (rawData) {
                for (const key in rawData) {
                  const table = rawData[key];
                  if (!table?.content || !isCharacterTable(String(table.name || ''))) continue;
                  const headers = table.content[0] || [];
                  const nameIdx = headers.findIndex(
                    h => h && (h.includes('姓名') || h.includes('名称') || h.includes('名字')),
                  );
                  if (nameIdx < 0) continue;
                  for (let i = 1; i < table.content.length; i++) {
                    const rowName = String(table.content[i][nameIdx] || '').trim();
                    if (rowName === primaryName || deps.AvatarManager.getPrimaryName(rowName) === primaryName) {
                      // 找到了，触发预览
                      const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
                        .data('table-key', key)
                        .data('row-index', i - 1);
                      $('body').append(tempNode);
                      tempNode.trigger('click.acu_dash_preview');
                      tempNode.remove();
                      return;
                    }
                  }
                }
              }
              // 没有找到该角色的卡片
              if (window.toastr) {
                window.toastr.info(`「${primaryName}」暂无详细资料`, '', { timeOut: 2000 });
              }
              return;
            }

            // 有tableKey，正常触发预览
            const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
              .data('table-key', tableKey)
              .data('row-index', parseInt(rowIndex, 10));
            $('body').append(tempNode);
            tempNode.trigger('click.acu_dash_preview');
            tempNode.remove();
          }
        };

        $(document).on('pointermove.mobilenode', onMove);
        $(document).on('pointerup.mobilenode pointercancel.mobilenode', onUp);
      });

      // 点击画布空白处清除高亮
      $wrapper.on('pointerup.mobileclear', function (e) {
        if (moveModeEnabled) return;
        if (currentHighlightedNode && !$(e.target).closest('.acu-graph-node').length) {
          clearHighlight();
          currentHighlightedNode = null;
        }
      });
    } else {
      // ========== PC端逻辑 ==========

      $nodesGroup.on('pointerenter.pchover', '.acu-graph-node', function () {
        if (moveModeEnabled) return;
        const nodeName = $(this).data('name');
        if (nodeName) {
          highlightNode(nodeName);
        }
      });

      $nodesGroup.on('pointerleave.pchover', '.acu-graph-node', function () {
        if (moveModeEnabled) return;
        clearHighlight();
      });

      // PC端点击显示详情
      $nodesGroup.on('click.pcclick', '.acu-graph-node', function (e) {
        if (moveModeEnabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.stopPropagation();
        const $node = $(this);
        const nodeName = $node.data('name');
        // 使用别名系统找到主名称
        const primaryName = deps.AvatarManager.getPrimaryName(nodeName);
        const tableKey = $node.data('table-key');
        let rowIndex = $node.data('row-index');

        // 如果当前节点没有tableKey（只出现在别人关系中的角色），尝试通过主名称查找
        if (!tableKey || rowIndex === '' || rowIndex === undefined) {
          const rawData = deps.getCachedRawData() || deps.getTableData();
          if (rawData) {
            for (const key in rawData) {
              const table = rawData[key];
              if (!table?.content || !isCharacterTable(String(table.name || ''))) continue;
              const headers = table.content[0] || [];
              const nameIdx = headers.findIndex(
                h => h && (h.includes('姓名') || h.includes('名称') || h.includes('名字')),
              );
              if (nameIdx < 0) continue;
              for (let i = 1; i < table.content.length; i++) {
                const rowName = String(table.content[i][nameIdx] || '').trim();
                if (rowName === primaryName || deps.AvatarManager.getPrimaryName(rowName) === primaryName) {
                  const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
                    .data('table-key', key)
                    .data('row-index', i - 1);
                  $('body').append(tempNode);
                  tempNode.trigger('click.acu_dash_preview');
                  tempNode.remove();
                  return;
                }
              }
            }
          }
          if (window.toastr) {
            window.toastr.info(`「${primaryName}」暂无详细资料`, '', { timeOut: 2000 });
          }
          return;
        }

        // 有tableKey，正常触发预览
        const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
          .data('table-key', tableKey)
          .data('row-index', parseInt(rowIndex, 10));
        $('body').append(tempNode);
        tempNode.trigger('click.acu_dash_preview');
        tempNode.remove();
      });
    }

    // 初始渲染
    render();
    updateTransform();

    // 画布平移和缩放 - 使用 Pointer Events API
    let isPanning = false;
    let panStartX = 0,
      panStartY = 0;
    let panStartPanX = 0,
      panStartPanY = 0;
    let lastPinchDist = 0;
    let activePointerId: number | null = null;
    let isNodeDragging = false;
    let draggingNodeName: string | null = null;

    const wrapperEl = $wrapper[0];
    const svgEl = $svg[0];

    const clientPointToGraphPoint = (clientX: number, clientY: number): RelationGraphLayoutPosition => {
      const rect = svgEl.getBoundingClientRect();
      const svgX = rect.width > 0 ? ((clientX - rect.left) / rect.width) * 800 : 0;
      const svgY = rect.height > 0 ? ((clientY - rect.top) / rect.height) * 600 : 0;
      return {
        x: (svgX - panX) / scale,
        y: (svgY - panY) / scale,
      };
    };

    const startNodeDrag = (e: PointerEvent, nodeName: string) => {
      const node = nodes.get(nodeName);
      if (!node) return;

      e.preventDefault();
      e.stopPropagation();
      clearHighlight();

      wrapperEl.setPointerCapture(e.pointerId);
      activePointerId = e.pointerId;
      isNodeDragging = true;
      draggingNodeName = nodeName;
      node.vx = 0;
      node.vy = 0;
      node.fixed = true;
      $wrapper.addClass('acu-graph-node-dragging');
      svgEl.style.cursor = 'grabbing';
    };

    const finishNodeDrag = (pointerId: number, shouldSave: boolean) => {
      if (pointerId !== activePointerId) return;

      if (wrapperEl.hasPointerCapture(pointerId)) {
        wrapperEl.releasePointerCapture(pointerId);
      }

      if (shouldSave && draggingNodeName) {
        saveLayoutCache();
      }

      isNodeDragging = false;
      draggingNodeName = null;
      activePointerId = null;
      $wrapper.removeClass('acu-graph-node-dragging');
      svgEl.style.cursor = '';
    };

    // Pointer Down - 开始拖拽
    wrapperEl.onpointerdown = function (e) {
      if (e.button !== 0) return;
      const $targetNode = $(e.target).closest('.acu-graph-node');
      if ($targetNode.length) {
        if (moveModeEnabled) {
          const nodeName = String($targetNode.data('name') || '');
          if (nodeName) startNodeDrag(e, nodeName);
        }
        return;
      }
      if (moveModeEnabled) return;
      // [修复] 如果点击的是滑条容器，不启动画布拖拽
      if ($(e.target).closest('.acu-node-size-slider-container').length) return;
      e.preventDefault();
      wrapperEl.setPointerCapture(e.pointerId);
      activePointerId = e.pointerId;
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartPanX = panX;
      panStartPanY = panY;
      svgEl.style.cursor = 'grabbing';
    };

    // Pointer Move - 拖拽中
    wrapperEl.onpointermove = function (e) {
      if (isNodeDragging && e.pointerId === activePointerId && draggingNodeName) {
        const node = nodes.get(draggingNodeName);
        if (!node) return;
        const point = clientPointToGraphPoint(e.clientX, e.clientY);
        node.x = point.x;
        node.y = point.y;
        node.vx = 0;
        node.vy = 0;
        node.fixed = true;
        requestGraphRender();
        return;
      }

      if (!isPanning || e.pointerId !== activePointerId) return;
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      const rect = svgEl.getBoundingClientRect();
      panX = panStartPanX + (dx / rect.width) * 800;
      panY = panStartPanY + (dy / rect.height) * 600;
      updateTransform();
    };

    // Pointer Up - 结束拖拽
    wrapperEl.onpointerup = function (e) {
      if (isNodeDragging) {
        finishNodeDrag(e.pointerId, true);
        return;
      }

      if (e.pointerId === activePointerId) {
        wrapperEl.releasePointerCapture(e.pointerId);
        isPanning = false;
        activePointerId = null;
        svgEl.style.cursor = '';
      }
    };

    // Pointer Cancel - 取消
    wrapperEl.onpointercancel = function (e) {
      if (isNodeDragging) {
        finishNodeDrag(e.pointerId, true);
        return;
      }

      if (e.pointerId === activePointerId) {
        isPanning = false;
        activePointerId = null;
        svgEl.style.cursor = '';
      }
    };

    // 滚轮缩放
    wrapperEl.onwheel = function (e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      zoomTo(scale + delta);
    };

    // 移动端双指缩放
    wrapperEl.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          isPanning = false;
          lastPinchDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
        }
      },
      { passive: false },
    );

    wrapperEl.addEventListener(
      'touchmove',
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          const newDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          if (lastPinchDist > 0) {
            zoomTo(scale * (newDist / lastPinchDist));
          }
          lastPinchDist = newDist;
        }
      },
      { passive: false },
    );

    wrapperEl.addEventListener('touchend', function (e) {
      if (e.touches.length < 2) lastPinchDist = 0;
    });

    // 清理函数
    const cleanupEvents = () => {
      wrapperEl.onpointerdown = null;
      wrapperEl.onpointermove = null;
      wrapperEl.onpointerup = null;
      wrapperEl.onpointercancel = null;
      wrapperEl.onwheel = null;
      // 清理滑条相关事件和定时器
      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
        sliderHideTimer = null;
      }
      $(document).off('click.slider-hide');
    };

    // 节点大小滑条控制
    const $nodeSizeSlider = overlay.find('#node-size-slider');
    const $sliderSizeDisplay = overlay.find('#slider-size-display');
    const $sliderContainer = overlay.find('.acu-node-size-slider-container');
    const $nodeSizeDisplayTrigger = overlay.find('#node-size-display-trigger');
    const $legend = overlay.find('.acu-graph-legend');

    let sliderVisible = false;
    let sliderHideTimer: ReturnType<typeof setTimeout> | null = null;
    const SLIDER_AUTO_HIDE_DELAY = 4000; // 4秒无操作自动隐藏

    // 显示滑条
    const showSlider = () => {
      if (sliderVisible) return;

      // 清除之前的隐藏定时器
      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
        sliderHideTimer = null;
      }

      sliderVisible = true;

      // 计算位置：在"节点"文字上方（因为滑条容器在wrapper内，而trigger在legend中，legend在wrapper下方）
      // 使用getBoundingClientRect获取相对于viewport的位置
      const triggerRect = $nodeSizeDisplayTrigger[0].getBoundingClientRect();
      const wrapperRect = $wrapper[0].getBoundingClientRect();

      // 修复：滑条应该显示在wrapper底部附近，在trigger上方
      const sliderHeight = 60; // 估算滑条高度
      const top = wrapperRect.height - sliderHeight - 10; // 在wrapper底部上方
      const left = triggerRect.left - wrapperRect.left;

      $sliderContainer.css({
        display: 'block',
        top: `${top}px`,
        left: `${left}px`,
      });

      // 设置自动隐藏定时器
      resetSliderHideTimer();
    };

    // 隐藏滑条
    const hideSlider = () => {
      if (!sliderVisible) return;

      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
        sliderHideTimer = null;
      }

      sliderVisible = false;
      $sliderContainer.hide();
    };

    // 重置自动隐藏定时器
    const resetSliderHideTimer = () => {
      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
      }
      sliderHideTimer = setTimeout(() => {
        hideSlider();
      }, SLIDER_AUTO_HIDE_DELAY);
    };

    // 点击"节点"文字切换滑条显示/隐藏（使用事件委托确保可靠触发）
    overlay.on('click', '#node-size-display-trigger, #node-size-display-trigger *', function (e) {
      e.stopPropagation();
      if (sliderVisible) {
        hideSlider();
      } else {
        showSlider();
      }
    });

    // 滑条操作时重置自动隐藏定时器
    $nodeSizeSlider.on('input mousedown touchstart', function (e) {
      e.stopPropagation();
      if (sliderVisible) {
        resetSliderHideTimer();
      }
    });

    // 滑条容器内操作时阻止事件冒泡
    $sliderContainer.on('pointerdown mousedown touchstart', function (e) {
      e.stopPropagation();
    });

    // 点击滑条外部区域时隐藏滑条
    $(document).on('click.slider-hide', function (e) {
      if (
        sliderVisible &&
        !$sliderContainer.is(e.target) &&
        $sliderContainer.has(e.target).length === 0 &&
        !$nodeSizeDisplayTrigger.is(e.target) &&
        $nodeSizeDisplayTrigger.has(e.target).length === 0
      ) {
        hideSlider();
      }
    });

    $nodeSizeSlider.on('input', function () {
      nodeSizeMultiplier = parseFloat($(this).val());
      $sliderSizeDisplay.text(Math.round(nodeSizeMultiplier * 100) + '%');
      updateNodeSizeDisplay();

      // 重新计算节点半径并渲染
      nodeArr.forEach(node => {
        node.radius = getNodeRadius(node.name, node.isPlayer);
      });
      render();

      // 重置自动隐藏定时器
      resetSliderHideTimer();
    });

    // 过滤 toggle 按钮
    const $filterInSceneBtn = overlay.find('#filter-in-scene');
    const $filterDirectOnlyBtn = overlay.find('#filter-direct-only');

    updateMoveModeStyles();

    const updateFilterToggleStyles = () => {
      $filterInSceneBtn.toggleClass('active', filterInScene);
      $filterDirectOnlyBtn.toggleClass('active', filterDirectOnly);
      $filterInSceneBtn.attr('aria-pressed', filterInScene ? 'true' : 'false');
      $filterDirectOnlyBtn.attr('aria-pressed', filterDirectOnly ? 'true' : 'false');
    };

    // 初始化按钮样式
    updateFilterToggleStyles();

    $filterInSceneBtn.click(function (e) {
      e.stopPropagation();
      filterInScene = !filterInScene;
      updateFilterToggleStyles();
      render();
    });

    $filterDirectOnlyBtn.click(function (e) {
      e.stopPropagation();
      filterDirectOnly = !filterDirectOnly;
      updateFilterToggleStyles();
      render();
    });

    $moveModeBtn.on('click', function (e) {
      e.stopPropagation();
      moveModeEnabled = !moveModeEnabled;
      clearHighlight();
      updateMoveModeStyles();
      if (window.toastr) {
        window.toastr.info(moveModeEnabled ? '移动模式已开启：拖动头像调整位置' : '移动模式已关闭', '', {
          timeOut: 1600,
        });
      }
    });

    // [新增] 自定义中心角色下拉选择器
    const $centerDropdown = overlay.find('#graph-center-dropdown');
    const $centerTrigger = $centerDropdown.find('.acu-graph-center-trigger');
    const $centerMenu = $centerDropdown.find('.acu-graph-center-menu');
    const $centerLabel = $centerDropdown.find('.acu-center-label');
    const syncCenterDropdownState = () => {
      $centerTrigger.attr('aria-expanded', $centerDropdown.hasClass('open') ? 'true' : 'false');
    };

    // 点击触发器 toggle 菜单
    $centerTrigger.on('click', function (e) {
      e.stopPropagation();
      $centerDropdown.toggleClass('open');
      syncCenterDropdownState();
    });

    // 点击选项
    $centerMenu.on('click', '.acu-center-option', function (e) {
      e.stopPropagation();
      const newCenter = $(this).data('value') as string;
      $centerDropdown.removeClass('open');
      syncCenterDropdownState();
      if (newCenter && newCenter !== centerNodeName && nodes.has(newCenter)) {
        centerNodeName = newCenter;
        // 更新下拉显示
        $centerLabel.text(deps.replaceUserPlaceholders(newCenter));
        $centerMenu.find('.acu-center-option').removeClass('active');
        $centerMenu.find('.acu-center-option').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');
        // 清除布局缓存并重新布局
        clearLayoutCache();
        nodeArr.forEach(node => {
          node.radius = getNodeRadius(node.name, node.isPlayer);
        });
        runForceDirectedLayout();
        render();
        const displayName = deps.replaceUserPlaceholders(newCenter);
        if (window.toastr) window.toastr.info(`已将「${displayName}」设为中心`, '', { timeOut: 1500 });
      }
    });

    // 点击外部关闭菜单
    overlay.on('click.center-dropdown', function () {
      $centerDropdown.removeClass('open');
      syncCenterDropdownState();
    });

    // 重置视图（缩放、位置 + 节点布局 + 节点大小 + 中心角色）
    overlay.find('#graph-zoom-reset').click(() => {
      // 重置缩放和平移
      scale = 1;
      panX = 0;
      panY = 0;
      updateTransform();

      // 重置中心角色为主角
      centerNodeName = resolvedPlayerName;
      $centerLabel.text(deps.replaceUserPlaceholders(resolvedPlayerName));
      $centerMenu.find('.acu-center-option').removeClass('active');
      $centerMenu.find('.acu-center-option').attr('aria-selected', 'false');
      $centerMenu
        .find(`.acu-center-option[data-value="${resolvedPlayerName}"]`)
        .addClass('active')
        .attr('aria-selected', 'true');

      // 重置节点大小
      nodeSizeMultiplier = 1.0;
      $nodeSizeSlider.val(1.0);
      $sliderSizeDisplay.text('100%');
      updateNodeSizeDisplay();

      // 重置stepper显示值
      const $nodeSizeStepper = overlay.find('.acu-stepper[data-id="graph-node-size"]');
      if ($nodeSizeStepper.length) {
        $nodeSizeStepper.find('.acu-stepper-value').text('100%');
      }

      // 重新计算节点半径
      nodeArr.forEach(node => {
        node.radius = getNodeRadius(node.name, node.isPlayer);
      });

      // 重新加载布局（优先使用缓存）
      const resetLayoutLoadResult = loadLayoutCache();
      if (resetLayoutLoadResult !== 'full') {
        // 缓存不存在或不匹配，运行物理模拟
        runForceDirectedLayout(resetLayoutLoadResult === 'partial');
      }
      render();
    });

    // Stepper 步进器事件处理 - 节点大小控制
    const $nodeSizeStepper = overlay.find('.acu-stepper[data-id="graph-node-size"]');
    if ($nodeSizeStepper.length) {
      const min = parseInt($nodeSizeStepper.data('min')); // 50
      const max = parseInt($nodeSizeStepper.data('max')); // 200
      const step = parseInt($nodeSizeStepper.data('step')); // 10
      const $value = $nodeSizeStepper.find('.acu-stepper-value');

      const updateNodeSizeValue = (newPercent: number) => {
        newPercent = Math.max(min, Math.min(max, newPercent));
        nodeSizeMultiplier = newPercent / 100; // 转换为倍数 (0.5-2.0)
        $value.text(`${newPercent}%`);
        updateNodeSizeDisplay();

        // 重新计算节点半径并渲染
        nodeArr.forEach(node => {
          node.radius = getNodeRadius(node.name, node.isPlayer);
        });
        render();
      };

      const getCurrentPercent = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || 100;
      };

      $nodeSizeStepper.find('.acu-stepper-dec').on('click', function () {
        updateNodeSizeValue(getCurrentPercent() - step);
      });

      $nodeSizeStepper.find('.acu-stepper-inc').on('click', function () {
        updateNodeSizeValue(getCurrentPercent() + step);
      });
    }

    // 重新布局按钮
    overlay.find('#graph-relayout').click(() => {
      // 清除缓存
      clearLayoutCache();

      // 重新计算节点半径
      nodeArr.forEach(node => {
        node.radius = getNodeRadius(node.name, node.isPlayer);
      });

      // 重新运行物理模拟
      runForceDirectedLayout();
      render();
    });

    overlay.find('#graph-manage-avatar').click(() => {
      // 使用过滤后的节点数组，但头像管理应该显示所有节点
      deps.showAvatarManager(nodeArr, () => {
        nodeAvatarCache.clear();
        nodeAvatarRequests.clear();
        // 重新计算节点半径（因为大小可能改变了）
        nodeArr.forEach(node => {
          node.radius = getNodeRadius(node.name, node.isPlayer);
        });
        render();
      });
    });

    const closeGraph = () => {
      cleanupEvents();
      overlay.remove();
    };
    overlay.find('.acu-graph-close').click(closeGraph);
    deps.setupOverlayClose(overlay, 'acu-relation-graph-overlay', closeGraph);
  };
  return showRelationshipGraph;
}
