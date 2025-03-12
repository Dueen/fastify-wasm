'use strict'

const path = require('node:path')
const fastify = require('fastify')({ logger: true })
const fastifyWasm = require('../')

fastify.register(fastifyWasm, {
  // An absolute path to the wasm file
  path: path.join(__dirname, 'add.wasm'),
  exports: ['add'],
})

fastify.get('/', (_req, reply) => {
  // Call the exported function `add` from the wasm module
  const result = fastify.wasm.add(1, 1)
  reply.send({ result })
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
