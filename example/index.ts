import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

import Ajv from 'ajv'

TypeSystem.AllowArrayObjects = true

const T = Type.Record(Type.RegEx(/a.*/), Type.Number(), {
  additionalProperties: false,
})

console.log(TypeCompiler.Code(T))

const ajv = new Ajv()
const data = [0, 1, 2]
console.log(ajv.validate(T, data))
console.log(Value.Check(T, data))
console.log(TypeCompiler.Compile(T).Check(data))
console.log([...Value.Errors(T, data)])
