function makeCanvasRenderNode() {
  const canvas = document.createElement("canvas");
  canvas.className = "canvas-render";
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.zIndex = -1;
  return canvas;
}

function makeHtmlRenderNode() {
  const div = document.createElement("div");
  div.className = "html-render";
  div.style.position = "absolute";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.zIndex = -1;
  return div;
}

export function prepareUI(stage) {
  const rootNode = document.getElementById("root");
  const infosNode = document.createElement("ul");
  const cyclesNode = document.createElement("p");
  const htmlRenderNode = makeHtmlRenderNode();
  const canvasRenderNode = makeCanvasRenderNode();
  stage.addElement(canvasRenderNode);
  stage.addElement(htmlRenderNode);
  rootNode.appendChild(infosNode);
  rootNode.appendChild(cyclesNode);
  rootNode.appendChild(canvasRenderNode);
  rootNode.appendChild(htmlRenderNode);

  return {
    rootNode,
    infosNode,
    cyclesNode,
    canvasRenderNode,
    canvasCtx: canvasRenderNode.getContext("2d"),
    htmlRenderNode
  };
}
