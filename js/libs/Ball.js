/**
 * Basic JS reimplementation of https://github.com/topheman/Ball.js
 *
 * Same exact implementation as the Rust/Wasm one in the ./crate folder
 */

import Vector2D from "./Vector2D";

class Ball {
  constructor(
    _x,
    _y,
    _velocity_x,
    _velocity_y,
    _radius,
    _mass,
    _gravity,
    _elasticity,
    _friction
  ) {
    function step() {
      _x = _x + _gravity * _velocity_x;
      _y = _y + _gravity * _velocity_y;
      _velocity_x = _friction * _velocity_x;
      _velocity_y = _friction * _velocity_y;
      if (isNaN(_x)) debugger;
    }
    function manageStageBorderCollision(stage_width, stage_height) {
      // left border
      if (_x - _radius < 0.0) {
        _velocity_x = -_velocity_x * _elasticity;
        _x = _radius;
      }
      // right border
      if (_x + _radius > stage_width) {
        _velocity_x = -_velocity_x * _elasticity;
        _x = stage_width - _radius;
      }
      // top border
      if (_y - _radius < 0.0) {
        _velocity_y = -_velocity_y * _elasticity;
        _y = _radius;
      }
      // bottom border
      if (_y + _radius > stage_height) {
        _velocity_y = -_velocity_y * _elasticity;
        _y = stage_height - _radius;
      }
    }
    function checkBallCollision(ball) {
      const xd = _x - ball.x;
      const yd = _y - ball.y;

      const sum_radius = _radius + ball.radius;
      const sqr_radius = sum_radius * sum_radius;

      const dist_sqr = xd * xd + yd * yd;

      if (dist_sqr <= sqr_radius) {
        return true;
      }
      return false;
    }
    function resolveBallCollision(ball) {
      const RESTITUTION = 0.85;

      //get the mtd
      const delta = get_vector_2d(ball);
      const d = delta.get_length();

      if (d == 0) return;

      // minimum translation distance to push balls apart after intersecting
      const mtd = delta.scale((_radius + ball.radius - d) / d);

      // resolve intersection --
      // inverse mass quantities
      const im1 = 1 / _mass;
      const im2 = 1 / ball.mass;

      // impact speed
      const vector_velocity = new Vector2D(
        _velocity_x - ball.velocity_x,
        _velocity_y - ball.velocity_y
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

      _velocity_x = (_velocity_x + ims1.x) * _elasticity;
      _velocity_y = (_velocity_y + ims1.y) * _elasticity;
      ball.velocity_x = (ball.velocity_x - ims2.x) * _elasticity;
      ball.velocity_y = (ball.velocity_y - ims2.y) * _elasticity;
    }
    function setRandomPositionAndSpeedInBounds(stage_width, stage_height) {
      _x = random() * stage_width;
      _y = random() * stage_height;
      _velocity_x = random() * 10;
      _velocity_y = random() * 10;
    }
    function get_vector_2d(ball) {
      return new Vector2D(_x - ball.x, _y - ball.y);
    }
    function random() {
      return Math.random();
    }

    //expose public methods and properties
    this.setRandomPositionAndSpeedInBounds = setRandomPositionAndSpeedInBounds;
    this.step = step;
    this.manageStageBorderCollision = manageStageBorderCollision;
    this.checkBallCollision = checkBallCollision;
    this.resolveBallCollision = resolveBallCollision;
    Object.defineProperties(this, {
      radius: {
        get: () => _radius
      },
      x: {
        get: () => _x
      },
      y: {
        get: () => _y
      },
      mass: {
        get: () => _mass
      },
      velocity_x: {
        get: () => _velocity_x,
        set: value => _velocity_x = value
      },
      velocity_y: {
        get: () => _velocity_y,
        set: value => _velocity_y = value
      }
    });
  }
}

export default Ball;
