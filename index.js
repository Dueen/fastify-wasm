'use strict'

const { createReadStream } = require('node:fs')
const { Readable } = require('node:stream')
const fp = require('fastify-plugin')

async function fastifyWasm (fastify, options) {
  // Validate options
  if (!options || typeof options !== 'object') {
    throw new Error('options must be provided as an object')
  }

  if (!options.path) {
    throw new Error('options.path must be provided')
  }

  const isString = typeof options.path === 'string'
  const isBuffer = Buffer.isBuffer(options.path)
  const isURL = URL.canParse(options.path)
  const isValidPath = isString || isBuffer || isURL

  if (isValidPath === false) {
    throw new Error('options.path must be a valid path')
  }

  const webStream = Readable.toWeb(createReadStream(options.path))
  const response = new Response(webStream, { headers: { 'Content-Type': 'application/wasm' } })
  const wasm = await WebAssembly.instantiateStreaming(response, options.imports)

  fastify.decorate('wasm', wasm)
}

module.exports = fp(fastifyWasm, {
  fastify: '5.x',
  name: 'fastify-wasm',
})
module.exports.default = fastifyWasm
module.exports.fastifyWasm = fastifyWasm
