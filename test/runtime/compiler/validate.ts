import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { TSchema } from '@sinclair/typebox'

export function ok<T extends TSchema>(schema: T, data: unknown, references: any[] = []) {
  const C = TypeCompiler.Compile(schema, references)
  const result = C.Check(data)
  if (result !== Value.Check(schema, references, data)) {
    throw Error('Compiler and Value Check disparity')
  }
  if (!result) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(schema, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log(result)
    throw Error('expected ok')
  }
}

export function fail<T extends TSchema>(schema: T, data: unknown, additional: any[] = []) {
  const C = TypeCompiler.Compile(schema, additional)
  const result = C.Check(data)
  if (result) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(schema, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log('none')
    throw Error('expected ok')
  }
}
