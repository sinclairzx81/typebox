import { KindGuard, ValueGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TConstT', () => {
  // ----------------------------------------------------------------
  // Identity Types
  // ----------------------------------------------------------------
  it('Should guard for TConst 1', () => {
    const T = Type.Const(undefined)
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsUndefined(T))
  })
  it('Should guard for TConst 2', () => {
    const T = Type.Const(null)
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsNull(T))
  })
  it('Should guard for TConst 3', () => {
    const T = Type.Const(Symbol())
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsSymbol(T))
  })
  it('Should guard for TConst 4', () => {
    const T = Type.Const(1 as const)
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 1)
  })
  it('Should guard for TConst 5', () => {
    const T = Type.Const('hello' as const)
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should guard for TConst 6', () => {
    const T = Type.Const(true as const)
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Complex Types
  // ----------------------------------------------------------------
  it('Should guard for TConst 7', () => {
    const T = Type.Const(100n as const)
    Assert.IsFalse(KindGuard.IsReadonly(T))
    // TS disparity because TLiteral does not support Bigint
    Assert.IsTrue(KindGuard.IsBigInt(T))
  })
  it('Should guard for TConst 8', () => {
    const T = Type.Const(new Date())
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsDate(T))
  })
  it('Should guard for TConst 9', () => {
    const T = Type.Const(new Uint8Array())
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsUint8Array(T))
  })
  it('Should guard for TConst 10', () => {
    const T = Type.Const(function () {})
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsFunction(T))
    Assert.IsTrue(T.parameters.length === 0)
    Assert.IsTrue(KindGuard.IsUnknown(T.returns))
  })
  it('Should guard for TConst 11', () => {
    const T = Type.Const(new (class {})())
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsObject(T))
    // Object types that are neither Date or Uint8Array evaluate as empty objects
    Assert.IsEqual(T.properties, {})
  })
  it('Should guard for TConst 12', () => {
    const T = Type.Const((function* (): any {})())
    const R = ValueGuard.IsIterator((function* (): any {})())
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsAny(T))
  })
  it('Should guard for TConst 13', () => {
    const T = Type.Const((async function* (): any {})())
    const R = ValueGuard.IsAsyncIterator((function* (): any {})())
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsAny(T))
  })
  it('Should guard for TConst 14', () => {
    const T = Type.Const({
      x: 1,
      y: {
        z: 2,
      },
    } as const)
    // root
    Assert.IsFalse(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsObject(T))
    // x
    Assert.IsTrue(KindGuard.IsLiteral(T.properties.x))
    Assert.IsEqual(T.properties.x.const, 1)
    // y
    Assert.IsTrue(KindGuard.IsReadonly(T.properties.y))
    Assert.IsTrue(KindGuard.IsObject(T.properties.y))
    // y.z
    Assert.IsTrue(KindGuard.IsReadonly(T.properties.y.properties.z))
    Assert.IsTrue(KindGuard.IsLiteral(T.properties.y.properties.z))
    Assert.IsEqual(T.properties.y.properties.z.const, 2)
  })
  it('Should guard for TConst 15', () => {
    const T = Type.Const([1, 2, 3] as const)
    // root (arrays are always readonly as root)
    Assert.IsTrue(KindGuard.IsReadonly(T))
    Assert.IsTrue(KindGuard.IsTuple(T))
    Assert.IsTrue(T.items?.length === 3)
    // 0
    Assert.IsFalse(KindGuard.IsReadonly(T.items![0]))
    Assert.IsTrue(KindGuard.IsLiteral(T.items![0]))
    // 1
    Assert.IsFalse(KindGuard.IsReadonly(T.items![1]))
    Assert.IsTrue(KindGuard.IsLiteral(T.items![1]))
    // 2
    Assert.IsFalse(KindGuard.IsReadonly(T.items![2]))
    Assert.IsTrue(KindGuard.IsLiteral(T.items![2]))
  })
})
