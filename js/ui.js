function makeCanvasRenderNode() {
  const canvas = document.createElement("canvas");
  canvas.className = "js-render-canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.zIndex = -1;
  return canvas;
}

function makeHtmlRenderNode() {
  const div = document.createElement("div");
  div.className = "js-render-html";
  div.style.position = "absolute";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.zIndex = -1;
  return div;
}

/**
 * Creates the radio buttons for render modes
 * and binds it to stage.mode
 */
function makeRenderModeToggle(modes = [], stage) {
  const inputs = modes.map(mode => {
    const input = document.createElement("input");
    input.name = "render-mode";
    input.type = "radio";
    input.value = mode.value;
    input.id = mode.value;
    input.checked = stage.mode === mode.value;
    input.onchange = e => {
      // hide previous active layer
      [...document.getElementsByClassName(stage.mode)].forEach(
        e => (e.style.display = "none")
      );
      stage.mode = e.target.value;
      // show current active layer
      [...document.getElementsByClassName(stage.mode)].forEach(
        e => (e.style.display = "block")
      );
    };
    const label = document.createElement("label");
    label.innerText = mode.label;
    label.htmlFor = mode.value;
    const wrapper = document.createElement("li");
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    return wrapper;
  });
  const ul = document.createElement("ul");
  inputs.forEach(input => ul.appendChild(input));
  ul.style.listStyle = "none";
  ul.style.paddingLeft = "20px";
  return ul;
}

export function prepareUI(stage) {
  const rootNode = document.getElementById("root");
  const infosNode = document.createElement("ul");
  const cyclesNode = document.createElement("p");
  const htmlRenderNode = makeHtmlRenderNode();
  const canvasRenderNode = makeCanvasRenderNode();
  stage.track(({ width, height }) => {
    canvasRenderNode.width = width;
    canvasRenderNode.height = height;
  });
  stage.track(({ width, height }) => {
    htmlRenderNode.style.width = `${width}px`;
    htmlRenderNode.style.height = `${height}px`;
  });
  const renderModeToggles = makeRenderModeToggle(
    [
      {
        value: "js-render-canvas",
        label: "compute by WASM - render by JS into canvas"
      },
      {
        value: "js-render-html",
        label: "compute by WASM - render by JS into html"
      }
    ],
    stage
  );
  rootNode.appendChild(infosNode);
  rootNode.appendChild(cyclesNode);
  rootNode.appendChild(canvasRenderNode);
  rootNode.appendChild(htmlRenderNode);
  rootNode.appendChild(renderModeToggles);

  return {
    rootNode,
    infosNode,
    cyclesNode,
    canvasRenderNode,
    canvasCtx: canvasRenderNode.getContext("2d"),
    htmlRenderNode
  };
}
