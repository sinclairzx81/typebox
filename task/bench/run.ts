import { CompileTest } from './compile.ts'
import { ValidateTest } from './validate.ts'
import { FormatTest } from './format.ts'

export function Run() {
  CompileTest()
  ValidateTest()
  FormatTest()
}