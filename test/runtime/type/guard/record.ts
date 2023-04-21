import { TypeGuard, PatternNumberExact, PatternStringExact, PatternString, PatternNumber } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TRecord', () => {
  // -------------------------------------------------------------
  // Overloads
  // -------------------------------------------------------------
  it('Should guard overload 1', () => {
    const T = Type.Record(Type.Union([Type.Literal('A'), Type.Literal('B')]), Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TObject(T))
    Assert.isTrue(TypeGuard.TString(T.properties.A))
    Assert.isTrue(TypeGuard.TString(T.properties.B))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 2', () => {
    const T = Type.Record(Type.Union([Type.Literal('A')]), Type.String(), { extra: 1 }) // unwrap as literal
    Assert.isTrue(TypeGuard.TObject(T))
    Assert.isTrue(TypeGuard.TString(T.properties.A))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 3', () => {
    // @ts-ignore
    Assert.throws(() => Type.Record(Type.Union([]), Type.String(), { extra: 1 }))
  })
  it('Should guard overload 4', () => {
    const T = Type.Record(Type.Literal('A'), Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TObject(T))
    Assert.isTrue(TypeGuard.TString(T.properties.A))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 5', () => {
    const L = Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal('A'), Type.Literal('B')])])
    const T = Type.Record(L, Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TObject(T))
    Assert.isTrue(TypeGuard.TString(T.properties.helloA))
    Assert.isTrue(TypeGuard.TString(T.properties.helloB))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 6', () => {
    const T = Type.Record(Type.Number(), Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TRecord(T))
    Assert.isTrue(TypeGuard.TString(T.patternProperties[PatternNumberExact]))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 7', () => {
    const T = Type.Record(Type.Integer(), Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TRecord(T))
    Assert.isTrue(TypeGuard.TString(T.patternProperties[PatternNumberExact]))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 8', () => {
    const T = Type.Record(Type.String(), Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TRecord(T))
    Assert.isTrue(TypeGuard.TString(T.patternProperties[PatternStringExact]))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 9', () => {
    const L = Type.TemplateLiteral([Type.String(), Type.Literal('_foo')])
    const T = Type.Record(L, Type.String(), { extra: 1 })
    Assert.isTrue(TypeGuard.TRecord(T))
    Assert.isTrue(TypeGuard.TString(T.patternProperties[`^${PatternString}_foo$`]))
    Assert.isEqual(T.extra, 1)
  })
  it('Should guard overload 10', () => {
    const L = Type.Union([Type.Literal('A'), Type.Union([Type.Literal('B'), Type.Literal('C')])])
    const T = Type.Record(L, Type.String())
    Assert.isTrue(TypeGuard.TObject(T))
    Assert.isTrue(TypeGuard.TString(T.properties.A))
    Assert.isTrue(TypeGuard.TString(T.properties.B))
    Assert.isTrue(TypeGuard.TString(T.properties.C))
  })
  // -------------------------------------------------------------
  // Variants
  // -------------------------------------------------------------
  it('Should guard for TRecord', () => {
    const R = TypeGuard.TRecord(Type.Record(Type.String(), Type.Number()))
    Assert.isTrue(R)
  })
  it('Should guard for TRecord with TObject value', () => {
    const R = TypeGuard.TRecord(
      Type.Record(
        Type.String(),
        Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        }),
      ),
    )
    Assert.isTrue(R)
  })
  it('Should not guard for TRecord', () => {
    const R = TypeGuard.TRecord(null)
    Assert.isFalse(R)
  })
  it('Should not guard for TRecord with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TRecord(Type.Record(Type.String(), Type.Number(), { $id: 1 }))
    Assert.isFalse(R)
  })
  it('Should not guard for TRecord with TObject value with invalid Property', () => {
    const R = TypeGuard.TRecord(
      Type.Record(
        Type.String(),
        Type.Object({
          x: Type.Number(),
          y: {} as any,
        }),
      ),
    )
    Assert.isFalse(R)
  })
  it('Transform: Should should transform to TObject for single literal union value', () => {
    const K = Type.Union([Type.Literal('ok')])
    const R = TypeGuard.TObject(Type.Record(K, Type.Number()))
    Assert.isTrue(R)
  })
  it('Transform: Should should transform to TObject for multi literal union value', () => {
    const K = Type.Union([Type.Literal('A'), Type.Literal('B')])
    const R = TypeGuard.TObject(Type.Record(K, Type.Number()))
    Assert.isTrue(R)
  })
})
