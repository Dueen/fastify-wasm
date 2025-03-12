'use strict'

const path = require('node:path')
const fastify = require('fastify')({ logger: true })
const fastifyWasm = require('../')

// initialize readWasmString as a no-op function
let readWasmString = (_start, _len) => ''

fastify.register(fastifyWasm, {
  // An absolute path to the wasm file
  path: path.join(__dirname, 'hello.wasm'),
  // Specify exported functions to be available in the `fastify.wasm` object
  exports: ['hello_world', 'hello_world_2'],
  // Specify the environment functions to be available to the wasm module
  env: {
    print_char: (c) => {
      const char = String.fromCharCode(c)
      fastify.log.info(char)
    },
    print_string: (start, len) => {
      const msg = readWasmString(start, len)
      fastify.log.info(msg)
    },
  },
})

fastify.after(() => {
  // Update readWasmString to read strings from Wasm memory
  readWasmString = (start, len) => {
    // Read data directly from Wasm memory
    const buf = new Uint8Array(fastify.wasm.memory.buffer, start, len)
    return new TextDecoder('utf8').decode(buf)
  }
})

fastify.get('/', (_req, reply) => {
  // Call the exported function `hello_world` from the wasm module
  // Prints "hello world!" character by character
  fastify.wasm.hello_world()

  // Call the exported function `hello_world_2` from the wasm module
  // Prints "hello world!" in a single line
  fastify.wasm.hello_world_2()
  reply.send('Hello, world!')
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
