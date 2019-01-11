use wasm_bindgen::prelude::*;
use ball::Ball;

/**
 * Note: color is represented as &wasm_bindgen::JsValue
 * a representation of an object owned by JS : https://rustwasm.github.io/wasm-bindgen/api/wasm_bindgen/struct.JsValue.html
 * 
 * A JsValue doesn't actually live in Rust right now but actually in a table owned by the wasm-bindgen generated JS glue code. Eventually the ownership will transfer into wasm directly and this will likely become more efficient, but for now it may be slightly slow.
 */

#[wasm_bindgen(js_name=drawWasmBallToCtx)]
pub fn draw_wasm_ball_to_ctx(ball: &Ball, ctx: &web_sys::CanvasRenderingContext2d, color: &JsValue) {
    ctx.set_fill_style(color);
    ctx.begin_path();
    ctx.arc(ball.x, ball.y, ball.radius, 0.0, std::f64::consts::PI * 2.0);
    ctx.close_path();
    ctx.fill();
}

#[wasm_bindgen(js_name=drawWasmBallToHtml)]
pub fn draw_wasm_ball_to_html(ball: &Ball, color: &JsValue) -> String {
    format!("<div class='ball' style='position:absolute;top:{}px;left:{}px;background:{};width:{}px;height:{}px;border-radius:{}px'></div>",
        ball.y - ball.radius,
        ball.x - ball.radius,
        color.as_string().unwrap(),
        ball.radius * 2.0,
        ball.radius * 2.0,
        ball.radius
    )
}