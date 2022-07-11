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
          Ajv: `${result.ajv.completed} ms`.padStart(10),
          TypeBox: `${result.typebox.completed} ms`.padStart(10),
          Performance: `${ratio.toFixed(2)} x`.padStart(10, ' '),
        },
      }
    }, {}),
  )
}

Report([...CompileBenchmark.Execute()])
Report([...CheckBenchmark.Execute()])
