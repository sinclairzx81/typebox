import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const T = Type.Date({ minimum: Date.now() })

const C = TypeCompiler.Compile(T)

console.log(C.Check(new Date()))


