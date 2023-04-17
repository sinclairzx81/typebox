import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'
import * as Types from '@sinclair/typebox'

const Foo = Type.Record(Type.Number(), Type.String())
const Bar = Type.Intersect([Type.Object({ bar: Type.Number(), x: Type.Number() }), Foo], {
  unevaluatedProperties: false,
})

console.log(TypeCompiler.Code(Bar))
const BC = TypeCompiler.Compile(Bar)
const bar = { 42: '42', bar: 42, baz: true } // this is ok
console.log(BC.Check(bar)) // check fails
console.log(Value.Check(Bar, bar))

// // const ajv = new Ajv()
// // const data = [0, 1, 2]
// // console.log(ajv.validate(T, data))
// // console.log(Value.Check(T, data))
// // console.log(TypeCompiler.Compile(T).Check(data))
// // console.log([...Value.Errors(T, data)])
