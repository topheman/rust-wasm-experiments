/**
 * Rust implementation of https://github.com/topheman/Ball.js
 *
 * Same exact implementation as the JavaScript one in the ./js/libs folder
 */
use wasm_bindgen::prelude::*;

use std::default::Default;
use vector2D::Vector2D;

// retrieve the Math.random() function from JavaScript to use it inside rust code
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Math)]
    fn random() -> f64;
// #[wasm_bindgen(js_namespace = console)]
// fn log(message: String);
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Ball {
    pub x: f64,
    pub y: f64,
    velocity_x: f64,
    velocity_y: f64,
    pub radius: f64,
    mass: f64,
    gravity: f64,
    elasticity: f64,
    friction: f64,
}

#[wasm_bindgen]
impl Ball {
    #[wasm_bindgen(constructor, catch)]
    pub fn new(
        x: f64,
        y: f64,
        velocity_x: f64,
        velocity_y: f64,
        radius: f64,
        mass: f64,
        gravity: f64,
        elasticity: f64,
        friction: f64,
    ) -> Ball {
        Ball {
            x,
            y,
            velocity_x,
            velocity_y,
            radius,
            mass,
            gravity,
            elasticity,
            friction,
        }
    }
    pub fn step(&mut self) {
        self.x = self.x + self.gravity * self.velocity_x;
        self.y = self.y + self.gravity * self.velocity_y;
        self.velocity_x = self.friction * self.velocity_x;
        self.velocity_y = self.friction * self.velocity_y;
    }
    #[wasm_bindgen(js_name=manageStageBorderCollision)]
    pub fn manage_stage_border_collision(&mut self, stage_width: f64, stage_height: f64) {
        // left border
        if self.x - self.radius < 0.0 {
            self.velocity_x = -self.velocity_x * self.elasticity;
            self.x = self.radius;
        }
        // right border
        if self.x + self.radius > stage_width {
            self.velocity_x = -self.velocity_x * self.elasticity;
            self.x = stage_width - self.radius;
        }
        // top border
        if self.y - self.radius < 0.0 {
            self.velocity_y = -self.velocity_y * self.elasticity;
            self.y = self.radius;
        }
        // bottom border
        if self.y + self.radius > stage_height {
            self.velocity_y = -self.velocity_y * self.elasticity;
            self.y = stage_height - self.radius;
        }
    }
    #[wasm_bindgen(js_name=checkBallCollision)]
    pub fn check_ball_collision(&self, ball: &Ball) -> bool {
        let xd = self.x - ball.x;
        let yd = self.y - ball.y;

        let sum_radius = self.radius + ball.radius;
        let sqr_radius = sum_radius * sum_radius;

        let dist_sqr = (xd * xd) + (yd * yd);

        if dist_sqr <= sqr_radius {
            return true;
        }
        return false;
    }
    #[wasm_bindgen(js_name=resolveBallCollision)]
    pub fn resolve_ball_collision(&mut self, ball: &mut Ball) {
        let RESTITUTION = 0.85;
        // let RESTITUTION = 0.5;

        //get the mtd
        let delta = self.get_vector_2d(&*ball);
        let d = delta.get_length();
        // minimum translation distance to push balls apart after intersecting
        let mtd = delta.scale(((self.radius + ball.radius) - d) / d);

        // resolve intersection --
        // inverse mass quantities
        let im1 = 1.0 / self.mass;
        let im2 = 1.0 / ball.mass;

        // impact speed
        let vector_velocity = Vector2D::new(
            self.velocity_x - ball.velocity_x,
            self.velocity_y - ball.velocity_y,
        );
        let normalized_mtd = mtd.normalize();
        let vn = vector_velocity.dot(&normalized_mtd);

        // sphere intersecting but moving away from each other already
        if vn > 0.0 {
            return;
        }

        // collision impulse
        let i = (-(1.0 + RESTITUTION) * vn) / (im1 + im2);
        let impulse = normalized_mtd.scale(i);

        // change in momentum
        let ims1 = impulse.scale(im1);
        let ims2 = impulse.scale(im2);

        self.velocity_x = (self.velocity_x + ims1.x) * self.elasticity;
        self.velocity_y = (self.velocity_y + ims1.y) * self.elasticity;
        ball.velocity_x = (ball.velocity_x - ims2.x) * self.elasticity;
        ball.velocity_y = (ball.velocity_y - ims2.y) * self.elasticity;
    }
    #[wasm_bindgen(js_name=setRandomPositionAndSpeedInBounds)]
    pub fn set_random_position_and_speed_in_bounds(&mut self, stage_width: f64, stage_height: f64) {
        self.x = self.random() * stage_width;
        self.y = self.random() * stage_height;
        self.velocity_x = self.random() * 10.0;
        self.velocity_y = self.random() * 10.0;
    }
    fn get_vector_2d(&self, ball: &Ball) -> Vector2D {
        Vector2D::new(self.x - ball.x, self.y - ball.y)
    }
    pub fn random(&self) -> f64 {
        random()
    }
}

// Default trait doesn't seem to be currently supported by wasm-bingen
impl Default for Ball {
    fn default() -> Self {
        Ball {
            x: 0.0,
            y: 0.0,
            velocity_x: 0.0,
            velocity_y: 0.0,
            radius: 10.0,
            mass: 1.0,
            gravity: 1.0,
            elasticity: 0.98,
            friction: 0.8,
        }
    }
}
