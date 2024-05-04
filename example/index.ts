import { Type, Static, TypeRegistry, Kind, TSchema, SchemaOptions } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'




// Tests:
// - Check
// - Create
// - Transform.Has
// Todo:
// - Propogation of This into nested Constructor / Function revise Compiler implementation.
// - Check.FromThis. Currently checking thisArgs against value for instance
//   methods that return 'this'. This is a hack and needs to be revised. Need
//   to investigate a Type.This()



const T = Type.Recursive(This => {
  return Type.ConstructorCall([], Type.Object({
    method: Type.FunctionCall([], This),
  }))
})

type T = Static<typeof T>

class Test {
  method(): this {
    return this
  }
}

Value.Check(T, Test) // true
