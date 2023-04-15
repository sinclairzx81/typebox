import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

const Foo = Type.Object({
  x: Type.String(),
  y: Type.Unsafe<bigint>({ type: 'string' }),
})

const Bar = Type.Omit(Foo, ['y'])
console.log(Bar)
