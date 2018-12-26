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
    radius = 15,
    mass = 1.3,
    gravity = 1,
    elasticity = 0.4,
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
    // check ball vs ball collision
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        if (balls[i].checkBallCollision(balls[j]) === true) {
          balls[i].resolveBallCollision(balls[j]);
        }
      }
    }
    // check balls vs border collision
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

  function drawBallToHtml(ball) {
    return `<div class="ball" style="position:absolute;top:${ball.y -
      ball.radius}px;left:${ball.x -
      ball.radius}px;background:#900000;width:${ball.radius *
      2}px;height:${ball.radius * 2}px;border-radius:${ball.radius}px"></div>`;
  }

  const drawFunc = {
    "js-render-canvas": function() {
      canvasCtx.clearRect(0, 0, stage.width, stage.height);
      balls.forEach(ball => drawBallToCtx(ball, canvasCtx));
    },
    "js-render-html": function() {
      htmlRenderNode.innerHTML = balls.map(drawBallToHtml).join("");
    }
  };

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
    // draw balls in selected mode
    drawFunc[stage.mode]();
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

  const MAX_BALLS = 10;

  const { stage } = makeStage();
  const { infosNode, cyclesNode, canvasCtx, htmlRenderNode } = prepareUI(stage);

  let delta = 0;
  let cycles = 0;
  let lastFrameTimeMs = 0;

  const balls = Array.from(Array(MAX_BALLS), _ => makeBall());
  balls.forEach(ball => {
    ball.setRandomPositionAndSpeedInBounds(stage.width, stage.height);
  });

  loop();
});
// ⚠️ TODO ADD .catch
