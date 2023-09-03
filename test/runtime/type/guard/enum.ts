import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TEnum', () => {
  // ----------------------------------------------------------------
  // Options
  // ----------------------------------------------------------------
  it('Should guard for Options 1', () => {
    const T = Type.Enum({ x: 1 }, { extra: 'hello', $id: 'T' })
    Assert.IsEqual(T.extra, 'hello')
    Assert.IsEqual(T.$id, 'T')
  })
  it('Should guard for Options 2', () => {
    enum E {
      x,
    }
    const T = Type.Enum(E, { extra: 'hello', $id: 'T' })
    Assert.IsEqual(T.extra, 'hello')
    Assert.IsEqual(T.$id, 'T')
  })
  it('Should guard for Options 3', () => {
    enum E {}
    const T = Type.Enum(E, { extra: 'hello', $id: 'T' })
    Assert.IsEqual(T.extra, 'hello')
    Assert.IsEqual(T.$id, 'T')
  })
  it('Should guard for Options 4', () => {
    const T = Type.Enum({}, { extra: 'hello', $id: 'T' })
    Assert.IsEqual(T.extra, 'hello')
    Assert.IsEqual(T.$id, 'T')
  })
  // ----------------------------------------------------------------
  // Empty
  // ----------------------------------------------------------------
  it('Should guard for Empty 1', () => {
    const T = Type.Enum({})
    Assert.IsTrue(TypeGuard.TNever(T))
  })
  it('Should guard for Empty 2', () => {
    enum E {}
    const T = Type.Enum(E)
    Assert.IsTrue(TypeGuard.TNever(T))
  })
  // ----------------------------------------------------------------
  // Enum
  // ----------------------------------------------------------------
  it('Should guard for TEnum Enum 1', () => {
    enum E {
      A = 1,
      B = 2,
      C = 3,
    }
    const T = Type.Enum(E)
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 1)
    Assert.IsEqual(T.anyOf[1].const, 2)
    Assert.IsEqual(T.anyOf[2].const, 3)
  })
  it('Should guard for TEnum Enum 2', () => {
    enum E {
      A = 'X',
      B = 'Y',
      C = 'Z',
    }
    const T = Type.Enum(E)
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'X')
    Assert.IsEqual(T.anyOf[1].const, 'Y')
    Assert.IsEqual(T.anyOf[2].const, 'Z')
  })
  it('Should guard for TEnum Enum 3', () => {
    enum E {
      A = 'X',
      B = 'Y',
      C = 'X',
    }
    const T = Type.Enum(E)
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'X')
    Assert.IsEqual(T.anyOf[1].const, 'Y')
    Assert.IsEqual(T.anyOf.length, 2)
  })
  // ----------------------------------------------------------------
  // Object Literal
  // ----------------------------------------------------------------
  it('Should guard for TEnum Object Literal 1', () => {
    const T = Type.Enum({
      A: 1,
      B: 2,
      C: 3,
    })
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 1)
    Assert.IsEqual(T.anyOf[1].const, 2)
    Assert.IsEqual(T.anyOf[2].const, 3)
  })
  it('Should guard for TEnum Object Literal 2', () => {
    const T = Type.Enum({
      A: 'X',
      B: 'Y',
      C: 'Z',
    })
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'X')
    Assert.IsEqual(T.anyOf[1].const, 'Y')
    Assert.IsEqual(T.anyOf[2].const, 'Z')
  })
  it('Should guard for TEnum Object Literal 3', () => {
    const T = Type.Enum({
      A: 'X',
      B: 'Y',
      C: 'X',
    })
    Assert.IsTrue(TypeGuard.TUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'X')
    Assert.IsEqual(T.anyOf[1].const, 'Y')
    Assert.IsEqual(T.anyOf.length, 2)
  })
})
