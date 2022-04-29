import { CompileBenchmark } from './compile'
import { CheckBenchmark } from './check'
import { Result } from './result'

export function Report(results: Result[]) {
  console.table(
    results.reduce((acc, result) => {
      const ratio = result.ajv.completed / result.typebox.completed
      return {
        ...acc,
        [result.type.padStart(16, ' ')]: {
          Iterations: result.typebox.iterations,
          Ajv: `${result.ajv.completed}ms`.padEnd(8),
          TypeBox: `${result.typebox.completed}ms`.padEnd(8),
          Measured: `${ratio.toFixed(2)} x faster`.padEnd(20, ' '),
        },
      }
    }, {}),
  )
}

Report([...CompileBenchmark.Execute()])
Report([...CheckBenchmark.Execute()])
