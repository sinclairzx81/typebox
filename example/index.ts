import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Settings } from '@sinclair/typebox/settings'
import { Type, Kind, Static, TSchema } from '@sinclair/typebox'

Settings.TypeSystem = 'structural'

const T = Type.Object({ length: Type.Number() })
const C = TypeCompiler.Compile(T)
const A: any = []
console.log(C.Check([]))
console.log([...C.Errors(A)])
type T = Static<typeof T>
