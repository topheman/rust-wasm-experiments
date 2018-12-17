import { makeStage } from "./utils";
import { prepareUI } from "./ui";

import("../crate/pkg").then(module => {
  /**
   * Wrapper for wasm Ball constructor with defaults
   */
  function makeBall({
    x = 0,
    y = 0,
    velocityX = 0,
    velocityY = 0,
    radius = 10,
    mass = 1,
    gravity = 1,
    elasticity = 1,
    friction = 1
  } = {}) {
    return new module.Ball(
      x,
      y,
      velocityX,
      velocityY,
      radius,
      mass,
      gravity,
      elasticity,
      friction
    );
  }

  /**
   * Update balls states
   */
  function update(d) {
    delta = d;
    cycles++;
    // move balls
    balls.forEach(ball => ball.step());
    //check balls vs border collision
    balls.forEach(ball =>
      ball.manageStageBorderCollision(stage.width, stage.height)
    );
  }

  /**
   * Helper to draw a ball directly with JavaScript code
   */
  function drawBallToCtx(ball, ctx) {
    ctx.fillStyle = "#900000";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw balls
   */
  function draw() {
    // infos
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
    // canvas
    canvasCtx.clearRect(0, 0, stage.width, stage.height);
    balls.forEach(ball => drawBallToCtx(ball, canvasCtx));
  }

  /**
   * Game loop
   */
  function loop(timestamp) {
    if (cycles >= 4000) {
      return cancelAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    update(timestamp - lastFrameTimeMs);
    draw();
    lastFrameTimeMs = timestamp;
  }

  // Execution

  const { stage } = makeStage();
  const { infosNode, cyclesNode, canvasCtx } = prepareUI(stage);

  let delta = 0;
  let cycles = 0;
  let lastFrameTimeMs = 0;

  const balls = [
    makeBall({ velocityX: 1, velocityY: 1 }),
    makeBall({ velocityX: 4, velocityY: 1 }),
    makeBall({ x: 300, y: 50, velocityX: -3, velocityY: 1 }),
    makeBall({ x: 300, y: 200, velocityX: 7, velocityY: -5 })
  ];

  loop();
});
