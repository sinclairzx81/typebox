import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'
import Guard from 'typebox/guard'

// Remove Encode/Decode
// Remove Base
// Remove Mutate
// Rename ReadonlyType to ReadonlyObject

const A = Type.Object({
  getTime: Type.Function([], Type.Number())
})

const M = new Date()
const R = Value.Check(A, M)

console.log(1, Guard.HasPropertyKey(M, 'getTime'))
console.log(R)