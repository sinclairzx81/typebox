import { Type, Static, TObject, TProperties } from '@sinclair/typebox'

// -----------------------------------------------
// npm start to run example
// -----------------------------------------------

type VectorA = Static<typeof VectorA>
const VectorA = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
})
const VectorB = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
})
const A = Type.Intersect([VectorA, VectorB])
console.log(A)

