# rust-wasm-experiments

Generated with `npm init rust-webpack` from [rust-webpack-template](https://github.com/rustwasm/rust-webpack-template). [Original README available here](README.rwt.md).

## Install

Make sure you have `cargo install wasm-pack`, then:

```shell
npm install
```

## Run

```shell
npm start
```

Launches a development server on [http://localhost:8080](http://localhost:8080).

## Build

```shell
npm run build
```

Will build a production version of the website in the `dist` folder.

You can test your build by running `npm run serve`

## Notes

### Wasm-Bindgen

https://rustwasm.github.io/wasm-bindgen/

> `wasm-bindgen` facilitates high-level interactions between wasm modules and JavaScript.
>
> This project is sort of half polyfill for features like the [host bindings proposal](https://github.com/WebAssembly/host-bindings) and half features for empowering high-level interactions between JS and wasm-compiled code (currently mostly from Rust). More specifically this project allows JS/wasm to communicate with strings, JS objects, classes, etc, as opposed to purely integers and floats. Using `wasm-bindgen` for example you can define a JS class in Rust or take a string from JS or return one. The functionality is growing as well!

### Wasm-Pack

If you want to generate the WebAssembly yourself (without Webpack):

```shell
wasm-pack build ./crate
```

This will create a `pkg` folder containing:

- `package.json`: like any npm package
- `ball_wasm.js`: File that will be required on the JavaScript side (you'll need a module bundler like Webpack to import it)
- `ball_wasm.d.ts`: TypeScript definitions of public functions of your rust crate that was turned to WebAssembly
- `ball_wasm_bg.wasm`: Rust code turned into WebAssembly (will be required by `ball_wasm.js`)

## Resources

- [First attempt](https://github.com/topheman/webassembly-first-try/tree/master/03-rust-webpack-template) (simplier version)
