// @ts-check
'use strict'

const fp = require('fastify-plugin')
const { readFile } = require('node:fs/promises')

async function fastifyWasm (fastify, options) {
  // Validate options
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be provided as an object')
  }
  if (!options.path || typeof options.path !== 'string') {
    throw new Error('The "path" option is required and must be a string')
  }

  options.env = options.env || {}
  options.exports = options.exports || []

  const wasmBuffer = await readFile(options.path)
  const wasm = await WebAssembly.instantiate(wasmBuffer, {
    env: options.env,
  })

  // decorate fastify with the wasm exports (options.exports)
  const decorated = options.exports.reduce((acc, exportName) => {
    acc[exportName] = wasm.instance.exports[exportName]
    return acc
  }, {})
  decorated.memory = wasm.instance.exports.memory

  fastify.decorate('wasm', decorated)
}

module.exports = fp(fastifyWasm, {
  fastify: '5.x',
  name: 'fastify-wasm',
})
module.exports.default = fastifyWasm
module.exports.fastifyWasm = fastifyWasm
