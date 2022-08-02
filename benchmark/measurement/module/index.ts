import { CompileBenchmark } from './compile'
import { CheckBenchmark } from './check'
import { Result } from './result'

export function present(results: Result[]) {
  console.table(
    results.reduce((acc, result) => {
      const ratio = result.ajv.completed / result.typebox.completed
      return {
        ...acc,
        [result.type.padStart(16, ' ')]: {
          Iterations: result.typebox.iterations,
          Ajv: `${result.ajv.completed} ms`.padStart(10),
          TypeCompiler: `${result.typebox.completed} ms`.padStart(10),
          Performance: `${ratio.toFixed(2)} x`.padStart(10, ' '),
        },
      }
    }, {}),
  )
}

present([...CompileBenchmark.Execute()])
present([...CheckBenchmark.Execute()])
