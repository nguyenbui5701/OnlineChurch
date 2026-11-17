import 'pixi.js/unsafe-eval'; // CSP-safe fallback implementations; does NOT enable unsafe-eval.
import 'pixi.js/graphics';
import 'pixi.js/text';
import { Application } from 'pixi.js';
import { fitViewport } from '@onlinechurch/shared';
import { createScene } from './scene.js';
import './style.css';

const host = document.querySelector<HTMLDivElement>('#stage-host')!;
const status = document.querySelector<HTMLParagraphElement>('#render-status')!;
const checkbox = document.querySelector<HTMLInputElement>('#guides')!;
let dispose: (() => void) | undefined;
let generation = 0;

async function mount(): Promise<void> {
  const current = ++generation;
  dispose?.();
  dispose = undefined;
  status.hidden = false;
  status.textContent = 'Đang khởi tạo canvas…';
  const app = new Application();
  let initialized = false;
  let observer: ResizeObserver | undefined;
  let frame = 0;
  let destroyed = false;
  let contextLost = false;
  const cleanup = (): void => {
    if (destroyed) return;
    destroyed = true;
    observer?.disconnect();
    cancelAnimationFrame(frame);
    checkbox.removeEventListener('change', toggle);
    window.removeEventListener('resize', schedule);
    if (initialized) {
      app.canvas.removeEventListener('webglcontextlost', lost);
      app.canvas.removeEventListener('webglcontextrestored', restored);
      app.destroy(true, { children: true, texture: true, textureSource: true });
    } else app.stage.destroy({ children: true });
  };
  let scene: ReturnType<typeof createScene> | undefined;
  const toggle = (): void => { scene?.setGuides(checkbox.checked); schedule(); };
  const resize = (): void => {
    frame = 0;
    if (destroyed || !initialized || contextLost) return;
    const fit = fitViewport(host.clientWidth, host.clientHeight);
    if (!fit || !scene) return;
    const density = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    app.renderer.resize(fit.width, fit.height, density);
    scene.stage.position.set(fit.offsetX, fit.offsetY);
    scene.stage.scale.set(fit.scale);
    app.render(); // Static preview: no continuous ticker or animation loop.
    host.dataset.rendered = 'true';
    status.hidden = true;
  };
  const schedule = (): void => { if (!frame && !destroyed) frame = requestAnimationFrame(resize); };
  const lost = (event: Event): void => {
    event.preventDefault();
    contextLost = true;
    host.dataset.rendered = 'false';
    status.textContent = 'Canvas tạm mất kết nối GPU. Đang chờ phục hồi; không có hoạt động LIVE.';
    status.hidden = false;
  };
  const restored = (): void => { contextLost = false; schedule(); };
  try {
    await app.init({ width: 1080, height: 1920, background: 0xf5e9d4, preference: 'webgl',
      autoStart: false, sharedTicker: false, autoDensity: true, resolution: 1, antialias: true,
      skipExtensionImports: true, eventMode: 'none' });
    initialized = true;
    if (current !== generation) { cleanup(); return; }
    scene = createScene();
    scene.setGuides(checkbox.checked);
    app.stage.addChild(scene.stage);
    app.canvas.setAttribute('role', 'img');
    app.canvas.setAttribute('aria-label', 'Canvas 1080 × 1920: hình học DEMO offline, không có nhân vật hoặc hiệu ứng.');
    host.appendChild(app.canvas);
    app.canvas.addEventListener('webglcontextlost', lost);
    app.canvas.addEventListener('webglcontextrestored', restored);
    checkbox.addEventListener('change', toggle);
    observer = new ResizeObserver(schedule);
    observer.observe(host);
    window.addEventListener('resize', schedule);
    dispose = cleanup;
    resize();
  } catch (error) {
    cleanup();
    if (current !== generation) return;
    host.dataset.rendered = 'false';
    status.hidden = false;
    status.textContent = 'Không khởi tạo được canvas WebGL. Kiểm tra tăng tốc đồ họa của trình duyệt rồi tải lại. DEMO chưa được xác nhận hiển thị.';
    console.error('OnlineChurch canvas initialization failed', error);
  }
}
window.addEventListener('pagehide', () => { generation++; dispose?.(); dispose = undefined; });
window.addEventListener('pageshow', event => { if (event.persisted) void mount(); });
void mount();
