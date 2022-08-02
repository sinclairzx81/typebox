export namespace Benchmark {
  export function Measure(execute: Function, iterations: number = 16_000_000) {
    const start = Date.now()
    for (let i = 0; i < iterations; i++) execute()
    return { iterations, completed: Date.now() - start }
  }
}
