const DEBOUNCE_RESIZE_CANVAS_MS = 300;

export function makeStage() {
  const _stageElements = [];
  const stage = { width: window.innerWidth, height: window.innerHeight };
  // track dom elements like canvas, div ... that will automatically be resized
  stage.addElement = function(element) {
    _stageElements.push(element);
    element.width = stage.width;
    element.height = stage.height;
  };
  const debouncedResizeToWindow = debounce(() => {
    stage.width = window.innerWidth;
    stage.height = window.innerHeight;
    _stageElements.forEach(element => {
      element.width = stage.width;
      element.height = stage.height;
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
