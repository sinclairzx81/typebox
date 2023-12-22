import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/normalize/Index', () => {
  // ---------------------------------------------------------
  // Array
  // ---------------------------------------------------------
  it('Normalize Array 1', () => {
    const T = Type.Array(Type.String())
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(TypeGuard.IsString(I))
  })
  // ---------------------------------------------------------
  // Tuple
  // ---------------------------------------------------------
  it('Normalize Tuple 1', () => {
    const T = Type.Tuple([Type.String(), Type.Number()])
    const I = Type.Index(T, Type.Number())
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(I.anyOf[1]))
  })
  it('Normalize Tuple 2', () => {
    const T = Type.Tuple([Type.String(), Type.Number()])
    const I = Type.Index(T, [0, 1])
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(I.anyOf[1]))
  })
  it('Normalize Tuple 3', () => {
    const T = Type.Tuple([Type.String(), Type.Number()])
    const I = Type.Index(T, ['0', '1'])
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(I.anyOf[1]))
  })
  it('Normalize Tuple 4', () => {
    const T = Type.Tuple([Type.String(), Type.Number()])
    const I = Type.Index(T, ['0'])
    Assert.IsTrue(TypeGuard.IsString(I))
  })
  it('Normalize Tuple 5', () => {
    const T = Type.Tuple([Type.String(), Type.Number()])
    const I = Type.Index(T, ['1'])
    Assert.IsTrue(TypeGuard.IsNumber(I))
  })
  // ---------------------------------------------------------
  // Intersect
  // ---------------------------------------------------------
  it('Normalize Intersect 1', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Optional(Type.String()) }), Type.Object({ x: Type.Optional(Type.String()) })])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsIntersect(I))
    Assert.IsTrue(TypeGuard.IsString(I.allOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.allOf[1]))
  })
  it('Normalize Intersect 2', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Optional(Type.String()) }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsFalse(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsIntersect(I))
    Assert.IsTrue(TypeGuard.IsString(I.allOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.allOf[1]))
  })
  it('Normalize Intersect 3', () => {
    const T = Type.Intersect([Type.Object({ x: Type.String() }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsFalse(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsIntersect(I))
    Assert.IsTrue(TypeGuard.IsString(I.allOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.allOf[1]))
  })
  it('Normalize Intersect 4', () => {
    const T = Type.Intersect([Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(TypeGuard.IsString(I))
  })
  it('Normalize Intersect 5', () => {
    const T = Type.Intersect([Type.Object({ x: Type.String() }), Type.Object({ y: Type.String() })])
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsFalse(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[1]))
  })
  it('Normalize Intersect 6', () => {
    const T = Type.Recursive(() => Type.Intersect([Type.Object({ x: Type.String() }), Type.Object({ y: Type.String() })]))
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsFalse(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[1]))
  })
  // ---------------------------------------------------------
  // Union
  // ---------------------------------------------------------
  it('Normalize Union 1', () => {
    const T = Type.Union([Type.Object({ x: Type.Optional(Type.String()) }), Type.Object({ x: Type.Optional(Type.String()) })])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[1]))
  })
  it('Normalize Union 2', () => {
    const T = Type.Union([Type.Object({ x: Type.Optional(Type.String()) }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[1]))
  })
  it('Normalize Union 3', () => {
    const T = Type.Union([Type.Object({ x: Type.String() }), Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsFalse(TypeGuard.IsOptional(I))
    Assert.IsTrue(TypeGuard.IsUnion(I))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsString(I.anyOf[1]))
  })
  it('Normalize Union 4', () => {
    const T = Type.Union([Type.Object({ x: Type.String() })])
    const I = Type.Index(T, ['x'])
    Assert.IsTrue(TypeGuard.IsString(I))
  })
  it('Normalize Union 5', () => {
    const T = Type.Union([Type.Object({ x: Type.String() }), Type.Object({ y: Type.String() })])
    // @ts-ignore
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsFalse(TypeGuard.IsNever(I))
  })
  it('Normalize Union 6', () => {
    const T = Type.Recursive(() => Type.Union([Type.Object({ x: Type.String() }), Type.Object({ y: Type.String() })]))
    // @ts-ignore
    const I = Type.Index(T, ['x', 'y'])
    Assert.IsFalse(TypeGuard.IsNever(I))
  })
})
