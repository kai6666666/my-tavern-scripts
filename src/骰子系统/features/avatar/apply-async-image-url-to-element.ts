// @ts-nocheck
/**
 * apply-async-image-url-to-element.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyAsyncImageUrlToElement(deps: any) {
  const applyAsyncImageUrlToElement = (
    element: HTMLElement,
    url: string,
    stateKey: string,
    options?: { onError?: () => void },
  ) => {
    const normalizedUrl = String(url || '').trim();
    if (!normalizedUrl || !deps.isRenderableImageUrlValid(normalizedUrl)) return;
    if (!element.dataset.customIconFallbackHtml) {
      element.dataset.customIconFallbackHtml = element.innerHTML;
    }
    element.dataset[stateKey] = normalizedUrl;
    element.style.backgroundImage = '';
    element.classList.remove('has-image');
    const image = new Image();
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    image.className = 'acu-custom-async-image';
    image.style.display = 'block';
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.maxWidth = '100%';
    image.style.maxHeight = '100%';
    image.style.objectFit = 'cover';
    image.style.objectPosition = 'center';
    image.style.borderRadius = 'inherit';
    image.style.background = 'transparent';
    image.style.pointerEvents = 'none';
    image.onload = () => {
      if (!element.isConnected || element.dataset[stateKey] !== normalizedUrl) return;
      element.style.backgroundImage = '';
      element.classList.add('has-image');
      element.innerHTML = '';
      element.appendChild(image);
    };
    image.onerror = () => {
      if (!element.isConnected || element.dataset[stateKey] !== normalizedUrl) return;
      element.style.backgroundImage = '';
      element.classList.remove('has-image');
      const fallbackHtml = element.dataset.customIconFallbackHtml;
      if (typeof fallbackHtml === 'string') {
        element.innerHTML = fallbackHtml;
      }
      options?.onError?.();
    };
    image.src = normalizedUrl;
  };
  return applyAsyncImageUrlToElement;
}
