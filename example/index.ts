import { Type, Static, TObject, TProperties } from '@sinclair/typebox'

// -----------------------------------------------
// npm start to run example
// -----------------------------------------------

type Vector = Static<typeof Vector>
const Vector = Type.Object({
    x: Type.Number(),
    y: Type.Number()
})

console.log(Vector)

