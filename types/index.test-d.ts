import fastify from 'fastify'
import { expectAssignable, expectType } from 'tsd'
import fastifyWasm, { FastifyWasmExports } from '..'

const app = fastify()

declare module './index' {
  interface FastifyWasmExports {
    add: (a: number, b: number) => number
  }
}

app.register(fastifyWasm, {
  path: '../example/add.wasm',
})

expectAssignable<object>(app.wasm)
expectAssignable<WebAssembly.Module>(app.wasm.module)
expectAssignable<WebAssembly.Instance>(app.wasm.instance)
expectAssignable<FastifyWasmExports>(app.wasm.instance.exports)
expectAssignable<WebAssembly.Memory>(app.wasm.instance.exports.memory)

app.get('*', () => {
  expectAssignable<Function>(app.wasm.instance.exports.add)
  expectType<number>(app.wasm.instance.exports.add(1, 2))
})
