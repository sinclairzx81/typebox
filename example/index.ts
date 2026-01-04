import Compile from 'typebox/compile'
import System from 'typebox/system'
import Guard from 'typebox/guard'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type, { Static, TSchema } from 'typebox'


// TypeBox 1.1

// Updated
// - Unsafe<Type> to Unsafe<Type, Schema>
// Deprecated
// - Remove Encode / Decode
// - Remove Base
// - Remove Mutate
// - Remove AsyncIterator
// - Remove Iterator
// - Remove Promise
// - Remove Awaited
// - Rename ReadonlyType to ReadonlyObject
// - Rename TOptions to TAssign

// Todo: Distribute Parameters on TCall
//       Rename extension keywords to `x-`
//       Support { [key: string]: number }
//       Support { [T, ...unknown[]] }

// const A = Type.Script(`{
//   x: Assign<string, { 
//     minLength: 100,
//     maxLength: 200
//   }>  
// }`)

import { Promise, TPromise } from './javascript/index.ts'

type TAwaited<Schema extends TSchema> = (
  Type.TConditional<Schema, Type.TObject<{
    then: Type.TFunction<[Type.TFunction<[Type.TInfer<'Value'>], Type.TUnknown>], Type.TUnknown>,
  }>, Type.TRef<'Value'>, Schema>
)
function Awaited<Type extends TSchema>(type: Type) {
  return Type.Conditional(type, Type.Object({
    then: Type.Function([Type.Function([Type.Infer('Value')], Type.Unknown())], Type.Unknown())
  }), Type.Ref('Value'), type)
}


type S = Type.TString
type A = TPromise<S>
type B = TAwaited<A>


const S = Type.String()
const A = Promise(S)
const B = Awaited(A)
console.log(A)
console.log(B)













