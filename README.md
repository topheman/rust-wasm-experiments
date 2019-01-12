# rust-wasm-experiments

[![Demo](https://img.shields.io/badge/demo-online-blue.svg)](https://topheman.github.io/rust-wasm-experiments/)

Bouncing balls algorithm (handling physics interactions between balls) implemented in both plain JavaScript and Rust/WebAssembly.

Discover how to use Rust to generate WebAssembly, called by JavaScript.

- [`./crate/src`](crate/src): Rust implementation of [Ball.js](https://github.com/topheman/Ball.js)
- `./crate/pkg`: Generated WebAssembly code (with JavaScript glue code from wasm-bindgen)
- [`./js`](js): JavaScript code

Generated with `npm init rust-webpack` from [rust-webpack-template](https://github.com/rustwasm/rust-webpack-template). [Original README available here](README.rwt.md).

## Prerequisites

Rust / Node / npm

Currently, only the nightly toolchain of Rust is supporting WebAssembly:

```shell
rustup default nightly
rustup target add wasm32-unknown-unknown
```

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

### Rust Nightly

Running `rustup default nightly` will let you use rust nighly by default:

- That way, for each command, you won't have to specify the toolchain like:
  - `cargo +nightly [cmd]`
- To get back to stable channel (you may have other project relying on stable channel), run:
  - `rustup default stable`
- To check which default toolchain you're on, run the following:
  - `rustup toolchain list`

## Contributing

### Style guide

The JavaScript part is automatically formatted with [prettier](https://prettier.io/) if you set it up in your code editor. Otherwise, the JavaScript part of the code will be formatted at pre-commit hook.

The Rust part is not automatically formatted at pre-commit hook (didn't want to force the user to install rustfmt-preview), please make sure you use a RLS (Rust Language Server) [plugin](https://github.com/rust-lang/rls-vscode) for your editor that will format your code.

If you use vscode, you will have to open the `crate` folder as project ([the plugin doesn't support subfolders yet](https://github.com/rust-lang/rls-vscode/issues/419)).

```
code ./crate
```

## Resources

- [First attempt](https://github.com/topheman/webassembly-first-try/tree/master/03-rust-webpack-template) (simplier version)
- [Ball.js](https://github.com/topheman/Ball.js) original algo handling bouncing balls made a few years ago
