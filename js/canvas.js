function noop() {}

const DEBOUNCE_RESIZE_CANVAS_MS = 300;

export function prepareCanvas({ onResize = noop } = {}) {
  const canvas = document.createElement("canvas");
  canvas.className = "canvas-render";
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.zIndex = -1;
  resizeToWindow(canvas);
  const debouncedResizeToWindow = debounce(() => {
    const { width, height } = resizeToWindow(canvas);
    onResize({ width, height });
  }, DEBOUNCE_RESIZE_CANVAS_MS);
  window.addEventListener("resize", debouncedResizeToWindow, false);
  return {
    canvas,
    cleanup: () => {
      window.removeEventListener("resize", debouncedResizeToWindow);
    }
  };
}

function resizeToWindow(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return {
    width: canvas.width,
    height: canvas.height
  };
}

function debounce(fn, time) {
  let timeout;
  return function(...args) {
    const functionCall = () => fn.apply(this, args);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}
