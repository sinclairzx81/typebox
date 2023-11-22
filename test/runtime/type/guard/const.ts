import { TypeGuard, ValueGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TConstT', () => {
  // ----------------------------------------------------------------
  // Identity Types
  // ----------------------------------------------------------------
  it('Should guard for TConst 1', () => {
    const T = Type.Const(undefined)
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TUndefined(T))
  })
  it('Should guard for TConst 2', () => {
    const T = Type.Const(null)
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TNull(T))
  })
  it('Should guard for TConst 3', () => {
    const T = Type.Const(Symbol())
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TSymbol(T))
  })
  it('Should guard for TConst 4', () => {
    const T = Type.Const(1 as const)
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TLiteral(T))
    Assert.IsEqual(T.const, 1)
  })
  it('Should guard for TConst 5', () => {
    const T = Type.Const('hello' as const)
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should guard for TConst 6', () => {
    const T = Type.Const(true as const)
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Complex Types
  // ----------------------------------------------------------------
  it('Should guard for TConst 7', () => {
    const T = Type.Const(100n as const)
    Assert.IsFalse(TypeGuard.TReadonly(T))
    // TS disparity because TLiteral does not support Bigint
    Assert.IsTrue(TypeGuard.TBigInt(T))
  })
  it('Should guard for TConst 8', () => {
    const T = Type.Const(new Date())
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TDate(T))
  })
  it('Should guard for TConst 9', () => {
    const T = Type.Const(new Uint8Array())
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TUint8Array(T))
  })
  it('Should guard for TConst 10', () => {
    const T = Type.Const(function () {})
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TFunction(T))
    Assert.IsTrue(T.parameters.length === 0)
    Assert.IsTrue(TypeGuard.TUnknown(T.returns))
  })
  it('Should guard for TConst 11', () => {
    const T = Type.Const(new (class {})())
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TObject(T))
    // Object types that are neither Date or Uint8Array evaluate as empty objects
    Assert.IsEqual(T.properties, {})
  })
  it('Should guard for TConst 12', () => {
    const T = Type.Const((function* (): any {})())
    const R = ValueGuard.IsIterator((function* (): any {})())
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TAny(T))
  })
  it('Should guard for TConst 13', () => {
    const T = Type.Const((async function* (): any {})())
    const R = ValueGuard.IsAsyncIterator((function* (): any {})())
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TAny(T))
  })
  it('Should guard for TConst 14', () => {
    const T = Type.Const({
      x: 1,
      y: {
        z: 2,
      },
    } as const)
    // root
    Assert.IsFalse(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TObject(T))
    // x
    Assert.IsTrue(TypeGuard.TLiteral(T.properties.x))
    Assert.IsEqual(T.properties.x.const, 1)
    // y
    Assert.IsTrue(TypeGuard.TReadonly(T.properties.y))
    Assert.IsTrue(TypeGuard.TObject(T.properties.y))
    // y.z
    Assert.IsTrue(TypeGuard.TReadonly(T.properties.y.properties.z))
    Assert.IsTrue(TypeGuard.TLiteral(T.properties.y.properties.z))
    Assert.IsEqual(T.properties.y.properties.z.const, 2)
  })
  it('Should guard for TConst 15', () => {
    const T = Type.Const([1, 2, 3] as const)
    // root (arrays are always readonly as root)
    Assert.IsTrue(TypeGuard.TReadonly(T))
    Assert.IsTrue(TypeGuard.TTuple(T))
    Assert.IsTrue(T.items?.length === 3)
    // 0
    Assert.IsFalse(TypeGuard.TReadonly(T.items![0]))
    Assert.IsTrue(TypeGuard.TLiteral(T.items![0]))
    // 1
    Assert.IsFalse(TypeGuard.TReadonly(T.items![1]))
    Assert.IsTrue(TypeGuard.TLiteral(T.items![1]))
    // 2
    Assert.IsFalse(TypeGuard.TReadonly(T.items![2]))
    Assert.IsTrue(TypeGuard.TLiteral(T.items![2]))
  })
})
