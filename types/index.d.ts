import type { FastifyPluginAsync } from 'fastify'
import type { PathLike } from 'node:fs'

declare module 'fastify' {
  interface Instance extends WebAssembly.Instance {
    /**
     * The WebAssembly exports object.
     * This object contains the functions and variables exported from the WebAssembly module.
     * It is used to interact with the WebAssembly module from JavaScript.
     * @example
     * import fastify from 'fastify';
     * import fastifyWasm from 'fastify-wasm';
     *
     * declare module 'fastify-wasm' {
     *   interface FastifyWasmExports {
     *     add(a: number, b: number): number
     *   }
     * }
     *
     * const app = fastify();
     *
     * app.register(fastifyWasm, {
     *   path: 'path/to/your.wasm',
     * });
     *
     * app.get('/', async (req, res) => {
     *   const { add } = app.wasm.instance.exports;
     *   const result = add(1, 2);
     *   res.send({ result });
     * });
     *
     */
    exports: fastifyWasm.FastifyWasmExports;
  }
  interface Wasm extends WebAssembly.WebAssemblyInstantiatedSource {
    /** The WebAssembly instance. */
    instance: Instance
    /** The WebAssembly module. */
    module: WebAssembly.Module
  }

  interface FastifyInstance {
    wasm: Wasm
  }
}

type FastifyWasmPlugin = FastifyPluginAsync<NonNullable<fastifyWasm.FastifyWasmOptions>>

declare namespace fastifyWasm {
  /** Options for configuring the fastifyWasm plugin. */
  export interface FastifyWasmOptions {
    /** An absolute path to the WebAssembly file. */
    path: PathLike;
    /** Optional imports for the WebAssembly module. */
    imports?: WebAssembly.Imports;
  }

  /** The WebAssembly exports object. */
  export interface FastifyWasmExports extends WebAssembly.Exports {
    /** The WebAssembly memory object. */
    memory: WebAssembly.Memory;
  }
}

declare function fastifyWasm (...params: Parameters<FastifyWasmPlugin>): ReturnType<FastifyWasmPlugin>

export = fastifyWasm
