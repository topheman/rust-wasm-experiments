import("../crate/pkg").then(module => {
  const balls = Array.from(Array(10), (_, index) => {
    const position = index * 10;
    const determinismValue = (index % 10) * 0.3; // 0 -> 1
    return new module.Ball(
      position,
      position,
      determinismValue,
      determinismValue,
      determinismValue,
      determinismValue
    );
  });

  function prepare() {
    const rootNode = document.getElementById("root");
    const infosNode = document.createElement("ul");
    const cyclesNode = document.createElement("p");
    const canvasRender = document.createElement("canvas");
    canvasRender.className = "canvas-render";
    const htmlRender = document.createElement("div");
    htmlRender.className = "html-render";
    rootNode.appendChild(infosNode);
    rootNode.appendChild(cyclesNode);
    rootNode.appendChild(canvasRender);
    rootNode.appendChild(htmlRender);

    return {
      rootNode,
      infosNode,
      cyclesNode,
      canvasRender,
      htmlRender
    };
  }

  function update(d) {
    delta = d;
    cycles++;
    balls.forEach(ball => ball.step());
  }

  function draw() {
    infosNode.innerHTML = balls
      .map(
        (ball, index) =>
          `<li>x: ${ball.x.toFixed(3)} / y: ${ball.y.toFixed(
            3
          )} | index: ${index}</li>`
      )
      .join("");
    cyclesNode.innerText = `Cycles: ${cycles} - Delta: ${delta.toFixed(
      4
    )} - FrameRate: ${Math.round(1000 / delta)} FPS`;
  }

  function loop(timestamp) {
    if (cycles >= 4000) {
      return cancelAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    update(timestamp - lastFrameTimeMs);
    draw();
    lastFrameTimeMs = timestamp;
  }

  let delta = 0;
  let cycles = 0;
  let lastFrameTimeMs = 0;

  const { rootNode, infosNode, cyclesNode, canvasRender } = prepare();

  loop();
});
