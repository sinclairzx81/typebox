import { TypeGuard, PatternNumberExact, PatternStringExact, PatternString, PatternNumber } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TRecord', () => {
  // -------------------------------------------------------------
  // Overloads
  // -------------------------------------------------------------
  it('Should guard overload 1', () => {
    const T = Type.Record(Type.Union([Type.Literal('A'), Type.Literal('B')]), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.A))
    Assert.IsTrue(TypeGuard.IsString(T.properties.B))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 2', () => {
    const T = Type.Record(Type.Union([Type.Literal('A')]), Type.String(), { extra: 1 }) // unwrap as literal
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.A))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 3', () => {
    // @ts-ignore
    const T = Type.Record(Type.Union([]), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  it('Should guard overload 4', () => {
    // @ts-ignore
    const T = Type.Record(Type.BigInt(), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  it('Should guard overload 5', () => {
    const T = Type.Record(Type.Literal('A'), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.A))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 6', () => {
    const L = Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Record(L, Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.helloA))
    Assert.IsTrue(TypeGuard.IsString(T.properties.helloB))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 7', () => {
    const T = Type.Record(Type.Number(), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsString(T.patternProperties[PatternNumberExact]))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 8', () => {
    const T = Type.Record(Type.Integer(), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsString(T.patternProperties[PatternNumberExact]))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 9', () => {
    const T = Type.Record(Type.String(), Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsString(T.patternProperties[PatternStringExact]))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 10', () => {
    const L = Type.TemplateLiteral([Type.String(), Type.Literal('_foo')])
    const T = Type.Record(L, Type.String(), { extra: 1 })
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsString(T.patternProperties[`^${PatternString}_foo$`]))
    Assert.IsEqual(T.extra, 1)
  })
  it('Should guard overload 11', () => {
    const L = Type.Union([Type.Literal('A'), Type.Union([Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Record(L, Type.String())
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.A))
    Assert.IsTrue(TypeGuard.IsString(T.properties.B))
    Assert.IsTrue(TypeGuard.IsString(T.properties.C))
  })
  it('Should guard overload 12', () => {
    enum E {
      A = 'X',
      B = 'Y',
      C = 'Z',
    }
    const T = Type.Enum(E)
    const R = Type.Record(T, Type.Null())
    Assert.IsTrue(TypeGuard.IsObject(R))
    Assert.IsTrue(TypeGuard.IsNull(R.properties.X))
    Assert.IsTrue(TypeGuard.IsNull(R.properties.Y))
    Assert.IsTrue(TypeGuard.IsNull(R.properties.Z))
  })
  // -------------------------------------------------------------
  // Variants
  // -------------------------------------------------------------
  it('Should guard for TRecord', () => {
    const R = TypeGuard.IsRecord(Type.Record(Type.String(), Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should guard for TRecord with TObject value', () => {
    const R = TypeGuard.IsRecord(
      Type.Record(
        Type.String(),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for TRecord', () => {
    const R = TypeGuard.IsRecord(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TRecord with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsRecord(Type.Record(Type.String(), Type.Number(), { $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TRecord with TObject value with invalid Property', () => {
    const R = TypeGuard.IsRecord(
      Type.Record(
        Type.String(),
        Type.Object({
          x: Type.Number(),
          y: {} as any,
        }),
      ),
    )
    Assert.IsFalse(R)
  })
  it('Normalize: Should should normalize to TObject for single literal union value', () => {
    const K = Type.Union([Type.Literal('ok')])
    const R = TypeGuard.IsObject(Type.Record(K, Type.Number()))
    Assert.IsTrue(R)
  })
  it('Normalize: Should should normalize to TObject for multi literal union value', () => {
    const K = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const R = TypeGuard.IsObject(Type.Record(K, Type.Number()))
    Assert.IsTrue(R)
  })
  // ------------------------------------------------------------------
  // Evaluated: Dollar Sign Escape
  // https://github.com/sinclairzx81/typebox/issues/794
  // ------------------------------------------------------------------
  // prettier-ignore
  {
    const K = Type.TemplateLiteral('$prop${A|B|C}') // issue
    const T = Type.Record(K, Type.String())
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.$propA))
    Assert.IsTrue(TypeGuard.IsString(T.properties.$propB))
    Assert.IsTrue(TypeGuard.IsString(T.properties.$propC))
    Assert.IsEqual(T.required, ['$propA', '$propB', '$propC'])
  }
})
