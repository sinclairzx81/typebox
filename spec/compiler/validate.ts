import { TypeCompiler, TSchema } from '@sinclair/typebox'

export function ok<T extends TSchema>(schema: T, data: unknown, additional: any[] = []) {
  const validator = TypeCompiler.Compile(schema, additional)
  const result = validator(data)
  if (!result.ok) {
    console.log('---------------------------')
    console.log('kernel')
    console.log('---------------------------')
    console.log(TypeCompiler.Kernel(schema))
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
    console.log(result.schema)
    throw Error('expected ok')
  }
}

export function fail<T extends TSchema>(schema: T, data: unknown, additional: any[] = []) {
  const validator = TypeCompiler.Compile(schema, additional)
  const result = validator(data)
  if (result.ok) {
    console.log('---------------------------')
    console.log('kernel')
    console.log('---------------------------')
    console.log(TypeCompiler.Kernel(schema))
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
