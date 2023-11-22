import { IsAsyncIterator, IsIterator, IsFunction, IsSymbol, IsDate } from '@sinclair/typebox/value'
import { TSchema, StaticDecode, StaticEncode } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

function AssertSame(actual: unknown, expect: unknown) {
  if (IsAsyncIterator(actual) && IsAsyncIterator(expect)) return
  if (IsIterator(actual) && IsIterator(expect)) return
  if (IsSymbol(actual) && IsSymbol(expect)) return
  if (IsFunction(actual) && IsFunction(expect)) return
  if (IsDate(actual) && IsDate(expect)) {
    return Assert.IsEqual(actual.getTime(), expect.getTime())
  }
  Assert.IsEqual(actual, expect)
}

export function Decode<T extends TSchema, R = StaticDecode<T>>(schema: T, references: TSchema[], value: unknown): R
export function Decode<T extends TSchema, R = StaticDecode<T>>(schema: T, value: unknown): R
export function Decode(...args: any[]) {
  const [schema, references, value] = args.length === 2 ? [args[0], [], args[1]] : [args[0], args[1], args[2]]
  const value1 = TypeCompiler.Compile(schema as TSchema, references).Decode(value)
  const value2 = Value.Decode(schema as TSchema, references, value)
  AssertSame(value1, value2)
  return value2
}

export function Encode<T extends TSchema, R = StaticEncode<T>>(schema: T, references: TSchema[], value: unknown): R
export function Encode<T extends TSchema, R = StaticEncode<T>>(schema: T, value: unknown): R
export function Encode(...args: any[]) {
  const [schema, references, value] = args.length === 2 ? [args[0], [], args[1]] : [args[0], args[1], args[2]]
  const value1 = TypeCompiler.Compile(schema as TSchema, references).Encode(value)
  const value2 = Value.Encode(schema as TSchema, references, value)
  AssertSame(value1, value2)
  return value2
}
