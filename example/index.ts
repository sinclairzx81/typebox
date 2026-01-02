import Compile from 'typebox/compile'
import System from 'typebox/system'
import Guard from 'typebox/guard'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'
import { TSchema, TUnion } from 'typebox'
import { TLiteral } from '../src/typebox.ts'

// TypeBox 1.1

// Remove Encode / Decode
// Remove Base
// Remove Mutate
// Remove AsyncIterator
// Remove Iterator
// Remove Promise
// Remove Awaited
// Rename ReadonlyType to ReadonlyObject
// Rename TOptions to TAssign

// Todo: Distribute Parameters on TCall
//       Rename extension keywords to `x-`
//       Support { [key: string]: number }
//       Support { [T, ...unknown[]] }

const A = Type.Script(`{
  x: Assign<string, { 
    minLength: 100,
    maxLength: 200
  }>  
}`)

const M = Type.Script('string | number[]')


const S = Type.Interface([], {
  x: Type.String()
})



