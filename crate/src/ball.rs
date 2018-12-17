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
    velocityX: f64,
    velocityY: f64,
    pub radius: f64,
    mass: f64,
    gravity: f64,
    elasticity: f64,
    friction: f64
}

#[wasm_bindgen]
impl Ball {
    #[wasm_bindgen(constructor, catch)]
    pub fn new(x: f64, y: f64, velocityX: f64, velocityY: f64, radius: f64, mass: f64, gravity: f64, elasticity: f64, friction: f64) -> Ball {
        Ball {
            x, y, velocityX, velocityY, radius, mass, gravity, elasticity, friction
        }
    }
    pub fn step(&mut self) {
        self.x = self.x + self.gravity * self.velocityX;
        self.y = self.y + self.gravity * self.velocityY;
        self.velocityX = self.friction * self.velocityX;
        self.velocityY = self.friction * self.velocityY;
    }
    pub fn manageStageBorderCollision(&mut self, stageWidth: u32, stageHeight: u32) {
        // left border
        if self.x - self.radius < 0.0 {
            self.velocityX = -self.velocityX * self.elasticity;
            self.x = self.radius;
        }
        // right border
        if self.x + self.radius > stageWidth as f64 {
            self.velocityX = -self.velocityX * self.elasticity;
            self.x = stageWidth as f64 - self.radius;
        }
        // top border
        if self.y - self.radius < 0.0 {
            self.velocityY = -self.velocityY * self.elasticity;
            self.y = self.radius;
        }
        // bottom border
        if self.y + self.radius > stageHeight as f64 {
            self.velocityY = -self.velocityY * self.elasticity;
            self.y = stageHeight as f64 - self.radius;
        }
    }
    pub fn setRandomPositionAndSpeedInBounds(&mut self, stageWidth: u32,stageHeight: u32) {
        self.x = self.random() * stageWidth as f64;
        self.y = self.random() * stageHeight as f64;
        self.velocityX = self.random() * 10.0;
        self.velocityY = self.random() * 10.0;
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
            velocityX: 0.0,
            velocityY: 0.0,
            radius: 10.0,
            mass: 1.0,
            gravity: 1.0,
            elasticity: 0.98,
            friction: 0.8
        }
    }
}