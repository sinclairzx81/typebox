import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static, TSchema } from '@sinclair/typebox'
import Ajv from 'ajv'

const A = Value.Clone(new Date())
const B = Value.Clone(A)

console.log(A)
console.log(B)
