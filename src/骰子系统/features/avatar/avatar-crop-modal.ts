// @ts-nocheck
/**
 * avatar-crop-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { LocalAvatarDB } from '../../entities/local-avatar-db';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowAvatarCropModal(deps: any) {
  const showAvatarCropModal = (imageSource, characterName, onSave) => {
    const { $ } = deps.getCore();
    $('.acu-crop-modal-overlay').remove();

    const config = deps.getConfig();

    // 初始参数
    let scale = 150;
    let offsetX = 50;
    let offsetY = 50;

    // 尝试读取已有配置
    const existing = deps.AvatarManager.getAll()[characterName];
    if (existing) {
      scale = existing.scale ?? 150;
      offsetX = existing.offsetX ?? 50;
      offsetY = existing.offsetY ?? 50;
    }
    const initialCropImageUrl = deps.formatCssImageUrl(imageSource, { allowInternalObjectUrl: true }) || 'none';

    const modalHtml = `
            <div class="acu-crop-modal-overlay acu-theme-${config.theme}">
                <div class="acu-crop-modal" role="dialog" aria-modal="true" aria-labelledby="acu-crop-modal-title">
                    <div class="acu-crop-header">
                        <span id="acu-crop-modal-title"><i class="fa-solid fa-crop-simple"></i> 调整头像 - ${deps.escapeHtml(characterName)}</span>
                        <button class="acu-crop-close" type="button" title="关闭" aria-label="关闭头像裁剪"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-crop-body">
                        <div class="acu-crop-container">
                            <div class="acu-crop-image" style="
                                background-image: ${deps.escapeHtml(initialCropImageUrl)};
                                background-size: ${scale}%;
                                background-position: ${offsetX}% ${offsetY}%;
                            "></div>
                            <div class="acu-crop-mask"></div>
                        </div>
                        <div class="acu-crop-hint">拖拽移动 · 滚轮/双指缩放</div>
                    </div>
                    <div class="acu-crop-footer">
                        <label class="acu-crop-btn acu-crop-reupload" title="重新上传" role="button" tabindex="0" aria-label="重新上传头像">
                            <i class="fa-solid fa-camera"></i>
                            <input type="file" accept="image/*" class="acu-crop-file-input" />
                        </label>
                        <button class="acu-crop-btn acu-crop-cancel" type="button">取消</button>
                        <button class="acu-crop-btn acu-crop-confirm" type="button"><i class="fa-solid fa-check"></i> 确定</button>
                    </div>
                </div>
            </div>
        `;

    const $modal = $(modalHtml);
    $('body').append($modal);

    const $image = $modal.find('.acu-crop-image');
    const $container = $modal.find('.acu-crop-container');
    const containerEl = $container[0];
    const imageEl = $image[0];

    // 更新图片样式
    const updateImageStyle = () => {
      imageEl.style.backgroundSize = `${scale}%`;
      imageEl.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
    };

    // === 拖拽逻辑（使用 Pointer Events 统一处理） ===
    let isDragging = false;
    let startX = 0,
      startY = 0;
    let startOffsetX = 0,
      startOffsetY = 0;
    let activePointerId = null;

    imageEl.addEventListener('pointerdown', e => {
      // 忽略多点触控的额外手指
      if (activePointerId !== null) return;

      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startOffsetX = offsetX;
      startOffsetY = offsetY;

      imageEl.setPointerCapture(e.pointerId);
      imageEl.style.cursor = 'grabbing';
    });

    imageEl.addEventListener('pointermove', e => {
      if (!isDragging || e.pointerId !== activePointerId) return;

      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // 灵敏度根据缩放调整
      const sensitivity = 100 / scale;
      offsetX = Math.max(0, Math.min(100, startOffsetX - deltaX * sensitivity));
      offsetY = Math.max(0, Math.min(100, startOffsetY - deltaY * sensitivity));
      updateImageStyle();
    });

    imageEl.addEventListener('pointerup', e => {
      if (e.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      imageEl.releasePointerCapture(e.pointerId);
      imageEl.style.cursor = 'grab';
    });

    imageEl.addEventListener('pointercancel', e => {
      if (e.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      imageEl.style.cursor = 'grab';
    });

    // === 缩放逻辑 ===
    // 滚轮缩放
    containerEl.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -10 : 10;
        scale = Math.max(100, Math.min(300, scale + delta));
        updateImageStyle();
      },
      { passive: false },
    );

    // 双指缩放
    let lastPinchDist = 0;
    let pinchStartScale = scale;

    containerEl.addEventListener(
      'touchstart',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          lastPinchDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          pinchStartScale = scale;
        }
      },
      { passive: false },
    );

    containerEl.addEventListener(
      'touchmove',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const newDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          if (lastPinchDist > 0) {
            const pinchRatio = newDist / lastPinchDist;
            scale = Math.max(100, Math.min(300, pinchStartScale * pinchRatio));
            updateImageStyle();
          }
        }
      },
      { passive: false },
    );

    containerEl.addEventListener('touchend', e => {
      if (e.touches.length < 2) {
        lastPinchDist = 0;
        pinchStartScale = scale;
      }
    });

    // === 按钮事件 ===
    $modal.on('keydown', '.acu-crop-reupload', function (e: JQuery.KeyDownEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      $(this).find('.acu-crop-file-input').trigger('click');
    });

    // 重新上传
    $modal.find('.acu-crop-file-input').on('change', async function (e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        if (window.toastr) window.toastr.warning('请选择图片文件');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        if (window.toastr) window.toastr.warning('图片大小不能超过 5MB');
        return;
      }

      try {
        // 保存新图片
        const success = await deps.AvatarManager.saveLocalAvatar(characterName, file);
        if (success) {
          // 获取新 URL 并更新预览
          const newUrl = await LocalAvatarDB.get(characterName);
          imageSource = newUrl;

          // 重置裁剪参数
          scale = 150;
          offsetX = 50;
          offsetY = 50;

          // 更新显示
          $image.css('background-image', deps.formatCssImageUrl(newUrl, { allowInternalObjectUrl: true }) || 'none');
          updateImageStyle();
        }
      } catch (err) {
        console.error('[DICE]ACU 重新上传失败:', err);
        if (window.toastr)
          showActionableErrorToast('头像图片上传失败，未能保存新的本地头像。', { suggestion: 'image' });
      }

      $(this).val('');
    });
    $modal.find('.acu-crop-close, .acu-crop-cancel').on('click', () => {
      $modal.remove();
    });

    $modal.find('.acu-crop-confirm').on('click', () => {
      onSave({ scale, offsetX, offsetY, imageSource });
      $modal.remove();
    });

    // 点击遮罩关闭
    deps.setupOverlayClose($modal, 'acu-crop-modal-overlay', () => {
      $modal.remove();
    });
  };
  return showAvatarCropModal;
}
