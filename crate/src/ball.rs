use wasm_bindgen::prelude::*;

use std::default::Default;

#[wasm_bindgen]
#[derive(Debug)]
pub struct Ball {
    pub x: f64,
    pub y: f64,
    velocityX: f64,
    velocityY: f64,
    gravity: f64,
    friction: f64,
}

#[wasm_bindgen]
impl Ball {
    #[wasm_bindgen(constructor, catch)]
    pub fn new(x: f64, y: f64, velocityX: f64, velocityY: f64, gravity: f64, friction: f64) -> Ball {
        Ball {
            x,y,velocityX,velocityY,gravity,friction
        }
    }
    pub fn step(&mut self) {
        self.x = self.x + self.gravity * self.velocityX;
        self.y = self.y + self.gravity * self.velocityY;
        self.velocityX = self.friction * self.velocityX;
        self.velocityY = self.friction * self.velocityY;
    }
}

impl Default for Ball {
    fn default() -> Self {
        Ball {
            x: 0.0,
            y: 0.0,
            velocityX: 0.0,
            velocityY: 0.0,
            gravity: 1.0,
            friction: 0.8,
        }
    }
}