import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type, Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// todo: implement Value.Equals() tests
// todo: implement Value.Clone() tests
// todo: implement TypeArray tests (Delta)

const T = Type.Object({ x: Type.Number(), y: Type.Number() })

const R = [...Value.Errors(T, { x: '42' })]                   // const R = true

console.log(R)