'use strict'

const { test } = require('node:test')
const { join } = require('node:path')
const { pathToFileURL } = require('node:url')
const Fastify = require('fastify')
const fastifyWasm = require('../index')
const defaultExport = require('../index').default
const { fastifyWasm: namedExport } = require('../index')

test.only('export', async function (t) {
  t.plan(3)

  await t.test('module export', function (t) {
    t.plan(1)
    t.assert.strictEqual(typeof fastifyWasm, 'function')
  })

  await t.test('default export', function (t) {
    t.plan(1)
    t.assert.strictEqual(typeof defaultExport, 'function')
  })

  await t.test('named export', function (t) {
    t.plan(1)
    t.assert.strictEqual(typeof namedExport, 'function')
  })
})

test('register', async function (t) {
  t.plan(8)

  await t.test('fail without options', async function (t) {
    const fastify = Fastify()

    await t.assert.rejects(() => fastify
      .register(fastifyWasm)
      .ready(), undefined, 'options must be provided as an object')
  })

  await t.test('fail without options as object', async function (t) {
    const fastify = Fastify()

    await t.assert.rejects(() => fastify
      .register(fastifyWasm, 'foo')
      .ready(), undefined, 'options must be provided as an object')
  })

  await t.test('fail without options.path', async function (t) {
    const fastify = Fastify()

    await t.assert.rejects(() => fastify
      .register(fastifyWasm, { path: undefined })
      .ready(), undefined, 'options.path must be provided')
  })

  await t.test('fail without options.path as PathLike', async function (t) {
    const fastify = Fastify()

    await t.assert.rejects(() => fastify
      .register(fastifyWasm, { path: 123 })
      .ready(), undefined, 'options.path must be a valid path')
  })

  await t.test('path as string', async function (t) {
    const fastify = Fastify()
    const path = join(__dirname, 'test.wasm')
    await fastify.register(fastifyWasm, { path }).ready()
  })

  await t.test('path as Buffer', async function (t) {
    const fastify = Fastify()
    const path = Buffer.from(join(__dirname, 'test.wasm'))
    await fastify.register(fastifyWasm, { path }).ready()
  })

  await t.test('path as URL', async function (t) {
    const fastify = Fastify()
    const path = pathToFileURL(join(__dirname, 'test.wasm'))
    await fastify.register(fastifyWasm, { path }).ready()
  })

  await t.test('Expose wasm methods', async function (t) {
    t.plan(3)

    const fastify = Fastify()
    fastify.register(fastifyWasm, {
      path: join(__dirname, 'test.wasm'),
    })

    await fastify.ready()

    t.assert.ok(fastify.wasm)
    t.assert.ok(fastify.wasm.instance)
    t.assert.ok(fastify.wasm.instance.exports)
  })
})
