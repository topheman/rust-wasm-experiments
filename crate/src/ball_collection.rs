use wasm_bindgen::prelude::*;

use ball::Ball;
use render;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(message: String);
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct BallCollection {
    balls: Vec<Ball>,
}

#[wasm_bindgen]
impl BallCollection {
    #[wasm_bindgen(constructor, catch)]
    pub fn new() -> BallCollection {
        BallCollection { balls: Vec::new() }
    }
    pub fn push(&mut self, ball: Ball) {
        self.balls.push(ball);
    }
    pub fn fill(
        &mut self,
        quantity: i32,
        radius: f64,
        mass: f64,
        gravity: f64,
        elasticity: f64,
        friction: f64,
    ) {
        for _ in 0..quantity {
            let ball = Ball::new(
                0.0, 0.0, 0.0, 0.0, radius, mass, gravity, elasticity, friction,
            );
            self.push(ball);
        }
    }
    pub fn len(&self) -> usize {
        self.balls.len()
    }
    fn step(&mut self) {
        self.balls.iter_mut().for_each(|ball| {
            ball.step();
        })
    }
    fn manage_stage_border_collision(&mut self, stage_width: f64, stage_height: f64) {
        self.balls.iter_mut().for_each(|ball| {
            ball.manage_stage_border_collision(stage_width, stage_height);
        })
    }
    pub fn update(&mut self, stage_width: f64, stage_height: f64) {
        // move balls
        self.step();
        // check balls vs border collision
        self.manage_stage_border_collision(stage_width, stage_height);
        // check ball vs ball collision
        // TODO ⚠️
    }
    #[wasm_bindgen(js_name=drawToCtx)]
    pub fn draw_to_ctx(
        &self,
        ctx: &web_sys::CanvasRenderingContext2d,
        color: &JsValue,
        stage_width: f64,
        stage_height: f64,
    ) {
        ctx.clear_rect(0.0, 0.0, stage_width, stage_height);
        self.balls.iter().for_each(|ball| {
            // log("each".to_string());
            render::draw_wasm_ball_to_ctx(ball, ctx, color);
        })
    }
    #[wasm_bindgen(js_name=drawToHtml)]
    pub fn draw_to_html(&self, color: &JsValue) -> String {
        let mut markup = String::new();
        for &ref ball in self.balls.iter() {
            markup.push_str(&render::draw_wasm_ball_to_html(ball, color));
        }
        return markup;
    }
    #[wasm_bindgen(js_name=setRandomPositionAndSpeedInBounds)]
    pub fn set_random_position_and_speed_in_bounds(&mut self, stage_width: f64, stage_height: f64) {
        for ball in self.balls.iter_mut() {
            ball.set_random_position_and_speed_in_bounds(stage_width, stage_height);
        }
    }
    pub fn format(&self) -> String {
        format!("{:?}", self)
    }
}
