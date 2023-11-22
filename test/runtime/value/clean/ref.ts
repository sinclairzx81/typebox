import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/Ref', () => {
  // ----------------------------------------------------------------
  // Clean
  // ----------------------------------------------------------------
  it('Should clean 1', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
      },
      { $id: 'A' },
    )
    const T = Type.Ref('A')
    const R = Value.Clean(T, [A], null)
    Assert.IsEqual(R, null)
  })
  it('Should clean 2', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
      },
      { $id: 'A' },
    )
    const T = Type.Ref('A')
    const R = Value.Clean(T, [A], {})
    Assert.IsEqual(R, {})
  })
  it('Should clean 3', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
      },
      { $id: 'A' },
    )
    const T = Type.Ref('A')
    const R = Value.Clean(T, [A], { x: null })
    Assert.IsEqual(R, { x: null })
  })
  // ----------------------------------------------------------------
  // Clean Discard
  // ----------------------------------------------------------------
  it('Should clean discard 1', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
      },
      { $id: 'A' },
    )
    const T = Type.Ref('A')
    const R = Value.Clean(T, [A], null)
    Assert.IsEqual(R, null)
  })
  it('Should clean discard 2', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
      },
      { $id: 'A' },
    )
    const T = Type.Ref('A')
    const R = Value.Clean(T, [A], { a: null })
    Assert.IsEqual(R, {})
  })
  it('Should clean discard 3', () => {
    const A = Type.Object(
      {
        x: Type.Number(),
      },
      { $id: 'A' },
    )
    const T = Type.Ref('A')
    const R = Value.Clean(T, [A], { a: null, x: null })
    Assert.IsEqual(R, { x: null })
  })
})
