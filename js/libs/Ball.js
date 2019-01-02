/**
 * Basic JS reimplementation of https://github.com/topheman/Ball.js
 *
 * Same exact implementation as the Rust/Wasm one in the ./crate folder
 */

import Vector2D from "./Vector2D";

class Ball {
  constructor(
    x,
    y,
    velocity_x,
    velocity_y,
    radius,
    mass,
    gravity,
    elasticity,
    friction
  ) {
    this.x = x;
    this.y = y;
    this.velocity_x = velocity_x;
    this.velocity_y = velocity_y;
    this.radius = radius;
    this.mass = mass;
    this.gravity = gravity;
    this.elasticity = elasticity;
    this.friction = friction;
  }
  step() {
    this.x = this.x + this.gravity * this.velocity_x;
    this.y = this.y + this.gravity * this.velocity_y;
    this.velocity_x = this.friction * this.velocity_x;
    this.velocity_y = this.friction * this.velocity_y;
  }
  manageStageBorderCollision(stage_width, stage_height) {
    // left border
    if (this.x - this.radius < 0.0) {
      this.velocity_x = -this.velocity_x * this.elasticity;
      this.x = this.radius;
    }
    // right border
    if (this.x + this.radius > stage_width) {
      this.velocity_x = -this.velocity_x * this.elasticity;
      this.x = stage_width - this.radius;
    }
    // top border
    if (this.y - this.radius < 0.0) {
      this.velocity_y = -this.velocity_y * this.elasticity;
      this.y = this.radius;
    }
    // bottom border
    if (this.y + this.radius > stage_height) {
      this.velocity_y = -this.velocity_y * this.elasticity;
      this.y = stage_height - this.radius;
    }
  }
  checkBallCollision(ball) {
    const xd = this.x - ball.x;
    const yd = this.y - ball.y;

    const sum_radius = this.radius + ball.radius;
    const sqr_radius = sum_radius * sum_radius;

    const dist_sqr = xd * xd + yd * yd;

    if (dist_sqr <= sqr_radius) {
      return true;
    }
    return false;
  }
  resolveBallCollision(ball) {
    const RESTITUTION = 0.85;

    //get the mtd
    const delta = this.get_vector_2d(ball);
    const d = delta.get_length();
    // minimum translation distance to push balls apart after intersecting
    const mtd = delta.scale((this.radius + ball.radius - d) / d);

    // resolve intersection --
    // inverse mass quantities
    const im1 = 1 / this.mass;
    const im2 = 1 / ball.mass;

    // impact speed
    const vector_velocity = new Vector2D(
      this.velocity_x - ball.velocity_x,
      this.velocity_y - ball.velocity_y
    );
    const normalized_mtd = mtd.normalize();
    const vn = vector_velocity.dot(normalized_mtd);

    // sphere intersecting but moving away from each other already
    if (vn > 0.0) {
      return;
    }

    // collision impulse
    const i = (-(1.0 + RESTITUTION) * vn) / (im1 + im2);
    const impulse = normalized_mtd.scale(i);

    // change in momentum
    const ims1 = impulse.scale(im1);
    const ims2 = impulse.scale(im2);

    this.velocity_x = (this.velocity_x + ims1.x) * this.elasticity;
    this.velocity_y = (this.velocity_y + ims1.y) * this.elasticity;
    ball.velocity_x = (ball.velocity_x - ims2.x) * this.elasticity;
    ball.velocity_y = (ball.velocity_y - ims2.y) * this.elasticity;
  }
  setRandomPositionAndSpeedInBounds(stage_width, stage_height) {
    this.x = this.random() * stage_width;
    this.y = this.random() * stage_height;
    this.velocity_x = this.random() * 10;
    this.velocity_y = this.random() * 10;
  }
  get_vector_2d(ball) {
    return new Vector2D(this.x - ball.x, this.y - ball.y);
  }
  random() {
    return Math.random();
  }
}

export default Ball;
