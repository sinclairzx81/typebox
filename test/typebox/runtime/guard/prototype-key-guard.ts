import { Type } from 'typebox'
import Schema from 'typebox/schema'
import { Assert } from 'test'
import Value from 'typebox/value'

const Test = Assert.Context('Guard.HasPropertyKey')

// A class instance inherits `prototype` from its constructor, so the key is
// reachable through the prototype chain but is never an own property. The
// compiled path and the interpreter have to agree about that.
class ApiClient {
  id = 'c1'
  prototype() {
    return 'v1'
  }
}

Test('Should agree when a required prototype key is inherited', () => {
  const schema = Type.Object({ id: Type.String(), prototype: Type.Function([], Type.String()) })
  const instance = new ApiClient()
  // own-only, because `prototype` is in IsUnsafePropertyKey's set
  Assert.IsEqual(Value.Check(schema, instance), false)
  Assert.IsEqual(Schema.Compile(schema).Check(instance), Value.Check(schema, instance))
})
Test('Should agree when an inherited prototype fails the property schema', () => {
  const schema = Type.Object({ id: Type.String(), prototype: Type.Optional(Type.Number()) })
  const instance = new ApiClient()
  Assert.IsEqual(Value.Check(schema, instance), true)
  Assert.IsEqual(Schema.Compile(schema).Check(instance), Value.Check(schema, instance))
})
Test('Should agree on Object.create values in both directions', () => {
  const required = Type.Object({ prototype: Type.Any() }, { required: ['prototype'] })
  const optional = Type.Object({ prototype: Type.Optional(Type.Number()) })
  const inherited = Object.create({ prototype: 'not-a-number' })
  Assert.IsEqual(Schema.Compile(required).Check(inherited), Value.Check(required, inherited))
  Assert.IsEqual(Schema.Compile(optional).Check(inherited), Value.Check(optional, inherited))
})
Test('Should still accept an own prototype property on both paths', () => {
  const schema = Type.Object({ prototype: Type.Number() })
  const value = { prototype: 1 }
  Assert.IsEqual(Value.Check(schema, value), true)
  Assert.IsEqual(Schema.Compile(schema).Check(value), true)
})
Test('Should keep the other unsafe keys own-only', () => {
  const schema = Type.Object({ __proto__: Type.Optional(Type.Any()), constructor: Type.Optional(Type.Any()) })
  Assert.IsEqual(Schema.Compile(schema).Check({}), Value.Check(schema, {}))
})
