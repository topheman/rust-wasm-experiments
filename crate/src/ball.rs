use wasm_bindgen::prelude::*;

use std::default::Default;

// retrieve the Math.random() function from JavaScript to use it inside rust code
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Math)]
    fn random() -> f64;
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
    friction: f64
}

#[wasm_bindgen]
impl Ball {
    #[wasm_bindgen(constructor, catch)]
    pub fn new(x: f64, y: f64, velocity_x: f64, velocity_y: f64, radius: f64, mass: f64, gravity: f64, elasticity: f64, friction: f64) -> Ball {
        Ball {
            x, y, velocity_x, velocity_y, radius, mass, gravity, elasticity, friction
        }
    }
    pub fn step(&mut self) {
        self.x = self.x + self.gravity * self.velocity_x;
        self.y = self.y + self.gravity * self.velocity_y;
        self.velocity_x = self.friction * self.velocity_x;
        self.velocity_y = self.friction * self.velocity_y;
    }
    #[wasm_bindgen(js_name=manageStageBorderCollision)]
    pub fn manage_stage_border_collision(&mut self, stage_width: u32, stage_height: u32) {
        // left border
        if self.x - self.radius < 0.0 {
            self.velocity_x = -self.velocity_x * self.elasticity;
            self.x = self.radius;
        }
        // right border
        if self.x + self.radius > stage_width as f64 {
            self.velocity_x = -self.velocity_x * self.elasticity;
            self.x = stage_width as f64 - self.radius;
        }
        // top border
        if self.y - self.radius < 0.0 {
            self.velocity_y = -self.velocity_y * self.elasticity;
            self.y = self.radius;
        }
        // bottom border
        if self.y + self.radius > stage_height as f64 {
            self.velocity_y = -self.velocity_y * self.elasticity;
            self.y = stage_height as f64 - self.radius;
        }
    }
    #[wasm_bindgen(js_name=setRandomPositionAndSpeedInBounds)]
    pub fn set_random_position_and_speed_in_bounds(&mut self, stage_width: u32,stage_height: u32) {
        self.x = self.random() * stage_width as f64;
        self.y = self.random() * stage_height as f64;
        self.velocity_x = self.random() * 10.0;
        self.velocity_y = self.random() * 10.0;
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
            friction: 0.8
        }
    }
}