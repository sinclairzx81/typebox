import { CompileTest } from './compile.ts'
import { ValidateTest } from './validate.ts'

export function Run() {
  CompileTest()
  ValidateTest()
}