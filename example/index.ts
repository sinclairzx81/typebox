import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

// Remove Encode/Decode
// Remove Base on Validator
// Rename ReadonlyType to ReadonlyObject

const X = Type.ReadonlyObject(Type.Object({
  x: Type.Number(),
  y: Type.Number()
}))

const A = Type.ReadonlyObject

function test(value: Type.Static<typeof X>) {
  
}