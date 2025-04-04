'use strict'

const { join } = require('node:path')
const fastify = require('fastify')({ logger: true })
const fastifyWasm = require('../index')

fastify.register(fastifyWasm, {
  // An absolute path to the wasm file
  path: join(__dirname, 'add.wasm'),
})

fastify.get('/', (_req, reply) => {
  // Call the exported function `add` from the wasm module
  const { add } = fastify.wasm.instance.exports
  reply.send({ result: add(2, 2) })
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
