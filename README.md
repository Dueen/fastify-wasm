# fastify-wasm

[![CI](https://github.com/dueen/fastify-wasm/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dueen/fastify-wasm/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/fastify-wasm.svg?style=flat)](https://www.npmjs.com/package/fastify-wasm)
[![License](https://img.shields.io/npm/l/@jsdevtools/npm-publish.svg)](LICENSE)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

A Fastify plugin for loading and executing WebAssembly modules.

### Install

```shell
npm i fastify-wasm
```

### Usage

This plugin enables you to load and execute WebAssembly modules within a Fastify application. Simply register the plugin and provide the path to your WebAssembly file.

```js
"use strict";

const fastify = require("fastify")
const fastifyWasm = require("fastify-wasm")

const app = fastify()

app.register(fastifyWasm, {
  path: 'path/to/your/wasm',
})

app.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});
```

### TypeScript

This plugin includes TypeScript definitions for better type safety and improved developer experience.

```ts
import fastify from "fastify";
import fastifyWasm from "fastify-wasm";

const app = fastify();

app.register(fastifyWasm, {
  path: 'path/to/your/wasm',
});

app.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});
```

## License

Licensed under [MIT](./LICENSE).
