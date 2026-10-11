import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Create.Enum')

Test('Should Create 1', () => {
  const Foo = { 0: 'A', 1: 'B', A: 0, B: 1 } as const
  const T = Type.Enum(Foo)
  Assert.IsEqual(Value.Create(T), Foo.A)
})

Test('Should Create 2', () => {
  const Foo = { 0: 'A', 1: 'B', A: 0, B: 1 } as const
  const T = Type.Enum(Foo, { default: Foo.B })
  Assert.IsEqual(Value.Create(T), Foo.B)
})
