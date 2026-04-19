
// ------------------------------------------------------------------
// Next
// ------------------------------------------------------------------
// Add Pipeline
// Add Match
// Update Refine - Error Callback
// DestructiveCodecCheck --- Need to find these
// Break Decode, Encode
// Compile Moved to Value
// Add Const Types
// Rename ReadonlyType to ReadonlyObject
// Remove Type.Base
// Remove Compiler.Code
// Remove Value.Mutate
// Remove DecodeUnsafe, EncodeUnsafe

// TODO: Document Compile on Value and Schema

import Type from 'typebox'

const S = Type.Object({
  0: Type.Literal(1),
  x: Type.Literal(2),
  1: Type.Literal(3),
  y: Type.Literal(4)
})

const Ms = Type.Index(S, Type.Number())

console.log({ Ms })

const { X, Y, M } = Type.Script(`

  type Values = [3, 2, 6, 1, 7, 3, 10, 4];

  type M = TupleToIndexValueUnion<Values>

  type TupleToIndexValueUnion<T extends unknown[]> = {
    [K in keyof T]: [K, T[K]]
  }[number]

  type FindIndex<
    T extends unknown[],
    V,
  > = Extract<TupleToIndexValueUnion<T>, [string, V]>[0];

  type X = FindIndex<Values, 7>
  //   ^? "4"
  type Y = FindIndex<Values, 3>
  //   ^? "0" | "5"
`)

// console.log({ X, Y })
// // console.log({ X, Y }) // {
// //                       //   X: { type: "number", const: 4 },
// //                       //   Y: {
// //                       //     anyOf: [
// //                       //      { type: "number", const: 0 }, 
// //                       //      { type: "number", const: 5 } 
// //                       //     ]
// //                       //   }
// //                       // }