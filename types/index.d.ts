declare module 'fastify' {
  interface FastifyInstance {
    wasm: {
      memory: WebAssembly.Memory;
    };
  }
}
