import { CompileBenchmark } from './compile'
import { CheckBenchmark } from './check'
import { Result } from './result'

export function present(results: Result[]) {
  console.table(
    results.reduce((acc, result) => {
      const ratio = result.ajv.completed / result.compiler.completed
      if (result.value) {
        return {
          ...acc,
          [result.type.padEnd(26, ' ')]: {
            Iterations: result.compiler.iterations,
            ValueCheck: `${result.value.completed} ms`.padStart(10),
            Ajv: `${result.ajv.completed} ms`.padStart(10),
            TypeCompiler: `${result.compiler.completed} ms`.padStart(10),
            Performance: `${ratio.toFixed(2)} x`.padStart(10, ' '),
          },
        }
      } else {
        return {
          ...acc,
          [result.type.padEnd(26, ' ')]: {
            Iterations: result.compiler.iterations,
            Ajv: `${result.ajv.completed} ms`.padStart(10),
            TypeCompiler: `${result.compiler.completed} ms`.padStart(10),
            Performance: `${ratio.toFixed(2)} x`.padStart(10, ' '),
          },
        }
      }
    }, {}),
  )
}

present([...CompileBenchmark.Execute()])
present([...CheckBenchmark.Execute()])
