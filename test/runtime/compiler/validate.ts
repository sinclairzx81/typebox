import { TSchema } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

export function ok<T extends TSchema>(schema: T, data: unknown, additional: any[] = []) {
  const C = TypeCompiler.Compile(schema, additional)
  const result = C.Check(data)
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
