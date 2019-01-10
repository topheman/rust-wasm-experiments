import { makeStage } from "./utils";
import { prepareUI } from "./ui";
import BallJS from "./libs/Ball";

const urlParam = require('urlparam');

const BALL_MASS = 1.3;
const BALL_GRAVITY = 1;
const BALL_ELASTICITY = 0.98;
const BALL_FRICTION = 1;

import("../crate/pkg")
  .then(module => {
    /**
     * Factory that will return either the original JavaScript version or the WebAssembly one
     * Specify a `wasm` boolean as an attribute to choose either version
     */
    function makeBall({
      x = 0,
      y = 0,
      velocityX = 0,
      velocityY = 0,
      radius = 15,
      mass = BALL_MASS,
      gravity = BALL_GRAVITY,
      elasticity = BALL_ELASTICITY,
      friction = BALL_FRICTION,
      wasm = true
    } = {}) {
      return new (wasm ? module.Ball : BallJS)(
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

    function updateBalls(balls) {
      // move balls
      balls.forEach(ball => ball.step());
      // check balls vs border collision
      balls.forEach(ball =>
        ball.manageStageBorderCollision(stage.width, stage.height)
      );
      // check ball vs ball collision
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          if (balls[i].checkBallCollision(balls[j]) === true) {
            balls[i].resolveBallCollision(balls[j]);
          }
        }
      }
    }

    /**
     * Update balls states
     */
    function update(d) {
      delta = d;
      switch (stage.mode) {
        case "wasm-compute-js-render-canvas":
        case "wasm-compute-js-render-html":
          updateBalls(balls["wasm"]);
          break;
        case "js-compute-js-render-canvas":
        case "js-compute-js-render-html":
          updateBalls(balls["js"]);
          break;
      }
    }

    /**
     * Helper to draw a ball directly with JavaScript code
     */
    function drawBallToCtx(ball, ctx, color = "#900000") {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }

    function drawBallToHtml(ball, color = "#900000") {
      return `<div class="ball" style="position:absolute;top:${ball.y -
        ball.radius}px;left:${ball.x -
        ball.radius}px;background:${color};width:${ball.radius *
        2}px;height:${ball.radius * 2}px;border-radius:${
        ball.radius
        }px"></div>`;
    }

    const drawFunc = {
      "wasm-compute-js-render-canvas": function () {
        canvasCtx.clearRect(0, 0, stage.width, stage.height);
        balls["wasm"].forEach(ball => drawBallToCtx(ball, canvasCtx, "blue"));
      },
      "wasm-compute-js-render-html": function () {
        htmlRenderNode.innerHTML = balls["wasm"]
          .map(ball => drawBallToHtml(ball, "darkblue"))
          .join("");
      },
      "js-compute-js-render-canvas": function () {
        canvasCtx.clearRect(0, 0, stage.width, stage.height);
        balls["js"].forEach(ball => drawBallToCtx(ball, canvasCtx, "red"));
      },
      "js-compute-js-render-html": function () {
        htmlRenderNode.innerHTML = balls["js"]
          .map(ball => drawBallToHtml(ball, "darkred"))
          .join("");
      }
    };

    /**
     * Draw balls
     */
    function draw() {
      infosNode.innerText = `Delta: ${delta.toFixed(
        4
      )}ms - FrameRate: ${Math.round(1000 / delta)} FPS`;
      // draw balls in selected mode
      drawFunc[stage.mode]();
    }

    /**
     * Game loop
     */
    function loop(timestamp) {
      requestAnimationFrame(loop);
      update(timestamp - lastFrameTimeMs);
      draw();
      lastFrameTimeMs = timestamp;
    }

    // Execution

    const MAX_BALLS = urlParam("balls", 100, true);

    const { stage } = makeStage();
    const { infosNode, canvasCtx, htmlRenderNode, shuffleButton } = prepareUI(
      stage
    );

    let delta = 0;
    let lastFrameTimeMs = 0;

    const balls = {
      wasm: Array.from(Array(MAX_BALLS), _ => makeBall()),
      js: Array.from(Array(MAX_BALLS), _ => makeBall({ wasm: false }))
    };

    const shuffle = () => {
      balls["wasm"].forEach(ball => {
        ball.setRandomPositionAndSpeedInBounds(stage.width, stage.height);
      });
      balls["js"].forEach(ball => {
        ball.setRandomPositionAndSpeedInBounds(stage.width, stage.height);
      });
    };

    shuffleButton.onclick = shuffle;

    shuffle();
    loop();
  })
  .catch(error => {
    const p = document.createElement("p");
    p.innerText = "An error occured:";
    const pre = document.createElement("pre");
    pre.innerText = error.message;
    const root = document.getElementById("root");
    root.appendChild(p);
    root.appendChild(pre);
  });
