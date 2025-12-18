import html2canvas, { type Options as H2COptions } from 'html2canvas';

import { getCurrentZoomRatio } from '../dynamic-zoom';

export interface IScreenshotService {
  /**
   * Capture an element into a high-DPI canvas (PNG-ready).
   * Handles <video> by replacing with a frame snapshot/poster in a cloned DOM.
   */
  captureScreenshot(
    element: HTMLElement,
    opts?: Partial<ScreenshotOptions>,
  ): Promise<HTMLCanvasElement>;

  /** Convert a canvas to a Blob and prepare for upload */
  convertToBlob(canvas: HTMLCanvasElement): Promise<Blob>;
}

export interface ScreenshotOptions {
  targetWidth?: number;
  useClone?: boolean;
  /** Force a background color; use 'transparent' for alpha. */
  backgroundColor: string | null;
  /** Extra elements to ignore in capture. */
  extraIgnore?: (el: Element) => boolean;
}

const DEFAULT_TARGET_WIDTH = 3840; // 4K
class ScreenshotService implements IScreenshotService {
  private readonly defaultBg = '#000000';
  private readonly defaultIgnoreElements = (el: Element): boolean => {
    // Guard: not every node has classList
    const cl = (el as HTMLElement)?.classList;
    if (!cl) return false;

    // Ignore common interactive controls, tooltips, and AntD transient layers
    if (
      cl.contains('ant-btn') ||
      cl.contains('ant-select') ||
      cl.contains('ant-tooltip') ||
      cl.contains('ant-message')
    ) {
      return true;
    }
    // Ignore <video> controls overlays (we’ll replace the actual video with a frame)
    if (cl.contains('video-controls') || cl.contains('no-screenshot')) {
      return true;
    }
    return false;
  };

  private makeOnClone = (opts: ScreenshotOptions, scale: number) => {
    console.debug('makeOnClone', { opts, scale });
    /**
     * In the cloned document:
     * - Replace each <video> with a snapshot (or its poster).
     * - Disable dynamicZoom transforms to avoid capture interference.
     * - Optionally normalize things (e.g., remove animations).
     */
    return async (doc: Document) => {
      // Disable dynamicZoom in the cloned DOM
      const bodyElement = doc.body;
      if (bodyElement) {
        // Reset transform styles in cloned DOM
        bodyElement.style.transform = '';
        bodyElement.style.transformOrigin = '';
        bodyElement.style.width = '';
        bodyElement.style.height = '';
        bodyElement.style.margin = '';
        bodyElement.style.overflow = '';
      }

      const originalVideos = Array.from(document.querySelectorAll('video'));
      console.debug('Original document videos:', { originalVideos });

      // TODO: if there are other "canvas", this one can query other elements instead of cloned videos
      const clonedCanvases = Array.from(
        doc.querySelectorAll('canvas'),
      ) as HTMLCanvasElement[];
      console.debug('Cloned document canvases:', { clonedCanvases });

      await Promise.all(
        originalVideos.map(async (originalVideo, index) => {
          try {
            const replacement = await this.videoToImageElement(
              originalVideo,
              scale,
            );
            const clonedVideo = clonedCanvases[index];

            if (clonedVideo) {
              // Replace in CLONED DOM, do not touch the original DOM
              clonedVideo.replaceWith(replacement);
            } else {
              console.warn(`Could not find cloned video at index ${index}`);
            }
          } catch (err) {
            console.warn(
              `Video snapshot failed for video ${index}; falling back to poster/text.`,
              err,
            );
            const fallback = this.videoPosterFallback(originalVideo, scale);
            const clonedVideo = clonedCanvases[index];
            if (clonedVideo) {
              clonedVideo.replaceWith(fallback);
            }
          }
        }),
      );
    };
  };

  private async videoToImageElement(
    v: HTMLVideoElement,
    scale: number = 1,
  ): Promise<HTMLImageElement> {
    // Try to draw the current frame of the video to a temp canvas
    const width = v.videoWidth || v.clientWidth || 0;
    const height = v.videoHeight || v.clientHeight || 0;

    if (!width || !height) {
      // If no intrinsic size yet, fallback to poster
      console.debug('videoToImageElement fallback to poster', {
        width,
        height,
        scale,
      });
      return this.videoPosterFallback(v, scale);
    }

    // Create a temp canvas (same-origin or CORS-enabled sources only)
    const c = document.createElement('canvas');
    c.width = width * scale; // Scale canvas for high-DPI
    c.height = height * scale; // Scale canvas for high-DPI

    const ctx = c.getContext('2d');
    if (!ctx) return this.videoPosterFallback(v, scale);

    // Draw the current frame at scaled size
    ctx.drawImage(v, 0, 0, c.width, c.height);

    // Convert to data URL (PNG)
    const dataUrl = c.toDataURL('image/png');
    const img = new Image();
    // Carry over sizing so layout stays identical in clone by using clientWidth/Height
    img.width = (v.clientWidth || width) * scale;
    img.height = (v.clientHeight || height) * scale;
    img.style.objectFit = getComputedStyle(v).objectFit || 'contain';
    img.src = dataUrl;
    return img;
  }

  private videoPosterFallback(
    v: HTMLVideoElement,
    scale: number = 1,
  ): HTMLImageElement {
    const poster = v.getAttribute('poster');
    const img = new Image();
    // Keep layout size so html2canvas positions remain correct
    const width = v.clientWidth || v.videoWidth || 0;
    const height = v.clientHeight || v.videoHeight || 0;
    if (width) img.width = width * scale;
    if (height) img.height = height * scale;
    img.style.objectFit = getComputedStyle(v).objectFit || 'contain';

    // Scale the SVG dimensions for high-DPI
    const scaledWidth = Math.max(width * scale, 1);
    const scaledHeight = Math.max(height * scale, 1);

    img.src =
      poster ||
      'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${scaledWidth}" height="${scaledHeight}">
         <rect width="100%" height="100%" fill="#000"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="14">
           Video unavailable
         </text>
       </svg>`,
        );
    return img;
  }

  async captureScreenshot(
    element: HTMLElement,
    opts?: Partial<ScreenshotOptions>,
  ): Promise<HTMLCanvasElement> {
    const zoomRatio = getCurrentZoomRatio();
    const rect = element.getBoundingClientRect();
    const basedWindowWidth = document.documentElement.clientWidth / zoomRatio;
    const basedWindowHeight = document.documentElement.clientHeight / zoomRatio;
    const basedWidth = rect.width / zoomRatio;
    const basedHeight = rect.height / zoomRatio;
    const targetWidth = opts?.targetWidth ?? DEFAULT_TARGET_WIDTH;
    const scale = targetWidth / basedWidth;

    const options: ScreenshotOptions = {
      backgroundColor: opts?.backgroundColor ?? this.defaultBg,
      extraIgnore: opts?.extraIgnore,
    };

    try {
      const h2cOpts: Partial<H2COptions> = {
        useCORS: true,
        allowTaint: false,
        backgroundColor: options.backgroundColor, // null => transparent
        // Force capture viewport from 0,0 to avoid blank offsets
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 15000,
        // Better DOM fidelity than foreignObject in most real apps
        foreignObjectRendering: false,
        removeContainer: true,
        logging: true,
        // Merge ignore rules safely
        ignoreElements: (el: Element) => {
          try {
            return (
              this.defaultIgnoreElements(el) || !!options.extraIgnore?.(el)
            );
          } catch {
            return false;
          }
        },
        // Preprocess the cloned DOM (replace <video> etc. and disable dynamicZoom)
        // Clone 1:1 video frame, and let the html2canvas handle the scaling based on scale option
        // So that, not only video frame will be scaled, but other elements as well to keep the consistency
        onclone: opts?.useClone ? this.makeOnClone(options, 1) : undefined,
        scale: scale,
        windowWidth: basedWindowWidth,
        windowHeight: basedWindowHeight,
        width: basedWidth,
        height: basedHeight,
      };

      const canvas = await html2canvas(element, h2cOpts);

      console.debug('Screenshot captured', {
        width: canvas.width,
        height: canvas.height,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        basedWindowWidth,
        basedWindowHeight,
        targetWidth,
        scale,
        zoomRatio,
      });

      return canvas;
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      throw error;
    }
  }

  async convertToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) =>
          b
            ? resolve(b)
            : reject(new Error('Failed to create blob from canvas')),
        'image/png',
        1.0,
      );
    });

    return blob;
  }
}

export const screenshotService: IScreenshotService = new ScreenshotService();
