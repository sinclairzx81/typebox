import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Enum')

Test('Should Create 1', () => {
  enum Foo {
    A,
    B
  }
  const T = Type.Enum(Foo)
  Assert.IsEqual(Value.Create(T), Foo.A)
})

Test('Should Create 2', () => {
  enum Foo {
    A,
    B
  }
  const T = Type.Enum(Foo, { default: Foo.B })
  Assert.IsEqual(Value.Create(T), Foo.B)
})
