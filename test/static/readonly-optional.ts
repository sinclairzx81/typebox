import { Expect } from './assert'
import { Type, TSchema, TReadonlyOptional } from '@sinclair/typebox'

{
  const T = Type.Object({
    A: Type.ReadonlyOptional(Type.String()),
  })
  Expect(T).ToStatic<{
    readonly A?: string
  }>()
}
{
  const T = Type.ReadonlyOptional(Type.String())
  function test(_: TReadonlyOptional<TSchema>) {}
  test(T)
}
{
  const T = Type.Readonly(Type.String())
  function test(_: TReadonlyOptional<TSchema>) {}
  // @ts-expect-error
  test(T)
}
{
  const T = Type.Optional(Type.String())
  function test(_: TReadonlyOptional<TSchema>) {}
  // @ts-expect-error
  test(T)
}
