use wasm_bindgen::prelude::*;

pub struct Vector2D {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Math)]
    fn sqrt(num: f64) -> f64;
}

/**
 * Light / Immutable version of Vector2D
 */
impl Vector2D {
    pub fn new(x: f64, y: f64) -> Vector2D {
        Vector2D { x, y }
    }
    pub fn get_length(&self) -> f64 {
        sqrt(self.x * self.x + self.y * self.y)
        // Currently using Math.sqrt from the browser - consider using rust implementation ?
        // (self.x * self.x + self.y * self.y).sqrt()
    }
    pub fn dot(&self, vector: &Vector2D) -> f64 {
        self.x * vector.x + self.y * vector.y
    }
    #[warn(dead_code)]
    fn add(&self, vector: Vector2D) -> Vector2D {
        Vector2D {
            x: self.x + vector.x,
            y: self.y + vector.y,
        }
    }
    #[warn(dead_code)]
    fn substract(&self, vector: Vector2D) -> Vector2D {
        Vector2D {
            x: self.x - vector.x,
            y: self.y - vector.y,
        }
    }
    pub fn normalize(&self) -> Vector2D {
        Vector2D {
            x: self.x / self.get_length(),
            y: self.y / self.get_length(),
        }
    }
    pub fn scale(&self, scale: f64) -> Vector2D {
        Vector2D {
            x: self.x * scale,
            y: self.y * scale,
        }
    }
}