'use strict'

const { join } = require('node:path')
const Fastify = require('fastify')
const fastifyWasm = require('../index')

const app = Fastify({ logger: true })

// initialize readWasmString as a no-op function
// This will be replaced with a function that reads from Wasm memory
// in the `app.after` hook
let readWasmString = (_start, _len) => ''

function log (start, len) {
  // Call the readWasmString function to read the string from Wasm memory
  const msg = readWasmString(start, len)
  // Print the string to the Fastify logger
  app.log.info(msg)
}

app.register(fastifyWasm, {
  // An absolute path to the wasm file
  path: join(__dirname, 'hello.wasm'),
  imports: {
    // Specify the environment functions to be available to the wasm module
    env: {
      log
    }
  },
})

app.after(() => {
  // Update readWasmString to read strings from Wasm memory
  readWasmString = (start, len) => {
    // Read data directly from Wasm memory
    const { memory } = app.wasm.instance.exports
    const buf = new Uint8Array(memory.buffer, start, len)
    return new TextDecoder('utf8').decode(buf)
  }
})

app.get('/', (_req, reply) => {
  const { hello } = app.wasm.instance.exports
  // Call the exported function `hello` from the wasm module
  // Prints "Hello from WebAssembly!" to the Fastify logger
  hello()

  reply.status(200).send('OK')
})

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
