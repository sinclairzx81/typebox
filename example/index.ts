import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'


const A = { x: new Int16Array([ 0, 1, 2 ]) }
const B = { t: new Int16Array([ 3, 1 ]) }

const D = Value.Diff<any>(A, B)
console.log(D)

const P = Value.Patch(A, D)
console.log(P)