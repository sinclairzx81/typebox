import { Type } from 'typebox'
import { Fail, Ok } from './~validate.ts'
import { Assert } from 'test'

const Test = Assert.Context('Value.Check.Enum')

Test('Should validate when emum uses default numeric values', () => {
  const Kind = { 0: 'Foo', 1: 'Bar', Foo: 0, Bar: 1 } as const
  const T = Type.Enum(Kind)
  Ok(T, 0)
  Ok(T, 1)
})
Test('Should not validate when given enum values are not numeric', () => {
  const Kind = { 0: 'Foo', 1: 'Bar', Foo: 0, Bar: 1 } as const
  const T = Type.Enum(Kind)
  Fail(T, 'Foo')
  Fail(T, 'Bar')
})
Test('Should validate when emum has defined string values', () => {
  const Kind = { Foo: 'foo', Bar: 'bar' } as const
  const T = Type.Enum(Kind)
  Ok(T, 'foo')
  Ok(T, 'bar')
})
Test('Should not validate when emum has defined string values and user passes numeric', () => {
  const Kind = { Foo: 'foo', Bar: 'bar' } as const
  const T = Type.Enum(Kind)
  Fail(T, 0)
  Fail(T, 1)
})
Test('Should validate when enum has one or more string values', () => {
  const Kind = { 0: 'Foo', Foo: 0, Bar: 'bar' } as const
  const T = Type.Enum(Kind)
  Ok(T, 0)
  Ok(T, 'bar')
  Fail(T, 'baz')
  Fail(T, 'Foo')
  Fail(T, 1)
})
