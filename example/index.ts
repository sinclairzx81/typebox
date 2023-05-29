import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

import Ajv from 'ajv'

const schema = Type.Object({
  int: Type.Integer(),
  whatever: Type.Any(),
})

const value = { int: 1 }

const C = TypeCompiler.Compile(schema)

console.log('check1', C.Check(value))
console.log('check2', Value.Check(schema, value))
console.log('errors', ...Value.Errors(schema, value))
