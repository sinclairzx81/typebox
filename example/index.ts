import { Type, TypeRegistry, Kind, TSchema, SchemaOptions } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// Tests:
// - Check
// - Create
// - Transform.Has
// Todo:
// - Propogation of This into nested Constructor / Function calls

export class Foo {
  constructor(public a: number) {
    console.log('Inside Consructor', a)
  }
  method(a: number) {
    console.log('Inside Method', a, this)
  }
}
// prettier-ignore
const T = Type.ConstructorCall([1], Type.Object({
  method: Type.FunctionCall(null, [2], Type.Number())
}))

const C = Value.Create(T)

const X = new C(1)
console.log(X.method(12))

console.log(Value.Check(T, Foo))
