import { Type, Static, TObject, TProperties } from '@sinclair/typebox'

// -----------------------------------------------
// npm start to run example
// -----------------------------------------------

type VectorA = Static<typeof VectorA>
const VectorA = Type.Object({
    x: Type.Number(),
    y: Type.Number()
}, { $id: 'Vector' })


const X = Type.Ref(Vector)

function test(vector: Static<typeof X>) {
    
}

console.log(Vector)
console.log(X)


