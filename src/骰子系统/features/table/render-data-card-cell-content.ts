// @ts-nocheck
/**
 * render-data-card-cell-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDataCardCellContent(deps: any) {
  const renderDataCardCellContent = (options: RenderDataCardCellOptions): RenderDataCardCellResult => {
    const preset = deps.RenderPresetManager.getActivePreset();
    const rawHeaderName = String(options.rawHeaderName || '');
    const headerName = deps.RenderPresetManager.getColumnDisplayName(rawHeaderName || '属性');
    const rawStrOriginal = String(options.cell ?? '').trim();
    const rawStr = deps.replaceUserPlaceholders(rawStrOriginal);
    const isFieldLocked = options.isFieldLocked === true;

    if (deps.RenderPresetManager.isInvalidValue(rawStr)) {
      return { headerName, contentHtml: '', hideLabel: false, shouldRender: false };
    }

    let contentHtml = '';
    let hideLabel = false;
    const splitRegex = /[;；]/;
    const isIdentityField =
      deps.RenderPresetManager.isIdentityHeader(rawHeaderName) || deps.RenderPresetManager.isIdentityHeader(headerName);
    const parsedAttrs = isIdentityField ? [] : deps.parseRenderPresetAttributes(rawStr, preset);

    if (isIdentityField) {
      const badgeStyle = deps.getRenderPresetBadgeStyle(rawStr, preset);
      const displayCell = deps.escapeHtml(rawStr) === '' && String(options.cell) !== '0' ? '&nbsp;' : deps.escapeHtml(rawStr);
      contentHtml = badgeStyle ? '<span class="acu-badge ' + badgeStyle + '">' + displayCell + '</span>' : displayCell;
    } else if (deps.RenderPresetManager.isRelationshipCell(rawStr, headerName)) {
      const relations = deps.parseRelationshipString(rawStr) as RenderRelationshipItem[];
      const validRelations = relations.filter(rel => {
        if (!rel.relation) return true;
        return !deps.RenderPresetManager.isInvalidValue(rel.relation);
      });

      if (validRelations.length > 1) {
        hideLabel = true;
        let relHtml = '';
        for (let i = 0; i < validRelations.length; i++) {
          const rel = validRelations[i];
          const borderStyle = i < validRelations.length - 1 ? 'border-bottom:1px dashed rgba(128,128,128,0.2);' : '';
          relHtml += '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;' + borderStyle + '">';
          relHtml +=
            '<span style="color:var(--acu-text-sub);font-size:0.95em;" data-locked="' +
            isFieldLocked +
            '">' +
            deps.escapeHtml(rel.name) +
            '</span>';
          if (rel.relation) {
            relHtml +=
              '<span style="color:var(--acu-text-main);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">' +
              deps.escapeHtml(rel.relation) +
              '</span>';
          }
          relHtml += '</div>';
        }
        contentHtml = '<div class="acu-relation-container">' + relHtml + '</div>';
      } else if (validRelations.length === 1) {
        hideLabel = true;
        const rel = validRelations[0];
        contentHtml = '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">';
        contentHtml +=
          '<span style="color:var(--acu-text-sub);font-size:0.95em;" data-locked="' +
          isFieldLocked +
          '">' +
          deps.escapeHtml(rel.name) +
          '</span>';
        if (rel.relation) {
          contentHtml +=
            '<span style="color:var(--acu-text-main);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">' +
            deps.escapeHtml(rel.relation) +
            '</span>';
        }
        contentHtml += '</div>';
      }
    } else if (parsedAttrs.length > 1) {
      hideLabel = true;
      let attrsHtml = '';
      for (let i = 0; i < parsedAttrs.length; i++) {
        const attr = parsedAttrs[i];
        attrsHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">';
        attrsHtml +=
          '<span style="color:var(--acu-text-sub);font-size:0.9em;white-space:nowrap;" data-locked="' +
          isFieldLocked +
          '" title="' +
          deps.escapeHtml(attr.name) +
          '">' +
          deps.escapeHtml(attr.name.length > 3 ? attr.name.substring(0, 5) : attr.name) +
          '</span>';
        attrsHtml += '<div style="display:flex;align-items:center;gap:4px;">';
        attrsHtml +=
          '<span style="color:var(--acu-text-main);font-weight:bold;font-size:0.95em;">' + attr.value + '</span>';
        attrsHtml += deps.renderInlineQuickCheckButton(attr.name, attr.value, {
          fontSize: options.diceIconFontSize || '10px',
        });
        attrsHtml += '</div></div>';
      }
      contentHtml = '<div class="acu-multi-attr-container">' + attrsHtml + '</div>';
    } else if (parsedAttrs.length === 1) {
      hideLabel = true;
      const attr = parsedAttrs[0];
      contentHtml = '<div style="display:flex;justify-content:space-between;align-items:center;">';
      contentHtml +=
        '<span style="color:var(--acu-text-sub);font-size:0.95em;" data-locked="' +
        isFieldLocked +
        '">' +
        deps.escapeHtml(attr.name) +
        '</span>';
      contentHtml += '<div style="display:flex;align-items:center;gap:6px;">';
      contentHtml += '<span style="color:var(--acu-text-main);font-weight:bold;">' + attr.value + '</span>';
      contentHtml += deps.renderInlineQuickCheckButton(attr.name, attr.value, {
        fontSize: options.diceIconFontSize || '11px',
      });
      contentHtml += '</div></div>';
    } else if (
      preset.rules.shortTags.enabled &&
      rawStr.length > 0 &&
      splitRegex.test(rawStr) &&
      !rawStr.includes('http')
    ) {
      const parts = rawStr
        .split(splitRegex)
        .map(s => s.trim())
        .filter(s => s && !deps.RenderPresetManager.isInvalidValue(s));
      const allShort = parts.length > 1 && parts.every(p => p.length <= preset.rules.shortTags.maxLength);
      if (allShort) {
        const tagsHtml = parts
          .map(part => {
            const subStyle = deps.getRenderPresetBadgeStyle(part, preset) || 'acu-badge-neutral';
            return '<span class="acu-badge ' + subStyle + '">' + deps.escapeHtml(part) + '</span>';
          })
          .join('');
        contentHtml = '<div class="acu-tag-container">' + tagsHtml + '</div>';
      } else if (parts.length > 0) {
        contentHtml = deps.escapeHtml(parts.join('; '));
      } else {
        contentHtml = '';
      }
    } else if (deps.isNumericCell(rawStr) && !rawStr.includes(':') && !rawStr.includes('：')) {
      const numVal = deps.extractNumericValue(rawStr);
      contentHtml = '<div style="display:flex;justify-content:space-between;align-items:center;">';
      contentHtml += '<span>' + deps.escapeHtml(rawStr) + '</span>';
      contentHtml += deps.renderInlineQuickCheckButton(headerName, numVal, {
        fontSize: options.diceIconFontSize || '11px',
        marginLeft: options.numericDiceMarginLeft === true,
      });
      contentHtml += '</div>';
    } else {
      const badgeStyle = deps.getRenderPresetBadgeStyle(rawStr, preset);
      const displayCell = deps.escapeHtml(rawStr) === '' && String(options.cell) !== '0' ? '&nbsp;' : deps.escapeHtml(rawStr);
      contentHtml = badgeStyle ? '<span class="acu-badge ' + badgeStyle + '">' + displayCell + '</span>' : displayCell;
    }

    return { headerName, contentHtml, hideLabel, shouldRender: true };
  };
  return renderDataCardCellContent;
}
