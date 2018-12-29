const DEBOUNCE_RESIZE_CANVAS_MS = 300;

export function makeStage() {
  const _trackers = [];
  const stage = {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: "wasm-compute-js-render-canvas" // default mode
  };
  // track dom elements like canvas, div ... that will automatically be resized
  stage.track = function(tracker) {
    if (typeof tracker !== "function") {
      throw new Error(
        "Must be a function that will be called on window resize to update width / height"
      );
    }
    tracker(stage);
    _trackers.push(tracker);
  };
  const debouncedResizeToWindow = debounce(() => {
    stage.width = window.innerWidth;
    stage.height = window.innerHeight;
    _trackers.forEach(tracker => {
      tracker(stage);
    });
  }, DEBOUNCE_RESIZE_CANVAS_MS);
  window.addEventListener("resize", debouncedResizeToWindow, false);
  return {
    cleanup: () => {
      window.removeEventListener("resize", debouncedResizeToWindow);
    },
    stage
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
