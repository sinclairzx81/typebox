import Compile from 'typebox/compile'
import System from 'typebox/system'
import Guard from 'typebox/guard'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'


// TypeBox 1.1

// Updated
// - Unsafe<Type> to Unsafe<Type, Schema>
// - Rename TOptions to TAssign
// - Rename ReadonlyType to ReadonlyObject
//
// Deprecated
// - Remove Encode / Decode
// - Remove Base
// - Remove Mutate
// - Remove AsyncIterator
// - Remove Iterator
// - Remove Promise (Example)
// - Remove Awaited (Example)

// Todo: Distribute Parameters on TCall
//       Rename extension keywords to `x-`
//       Support { [key: string]: number }
//       Support { [T, ...unknown[]] }

const T = Type.Script(`{
  x: Assign<string, { 
    minLength: 100,
    maxLength: 200
  }>  
}`)

import { Promise, Awaited } from './javascript/index.ts'

const A = Promise(Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
}))
const B = Awaited(A)

console.log(A, B)
















