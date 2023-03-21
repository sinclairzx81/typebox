import { Type, Static } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/Intersect', () => {
  it('Should intersect number and number', () => {
    const A = Type.Number()
    const B = Type.Number()
    const T = Type.Intersect([A, B], {})
    Ok(T, 1)
  })
  it('Should not intersect string and number', () => {
    const A = Type.String()
    const B = Type.Number()
    const T = Type.Intersect([A, B], {})
    Fail(T, 1)
    Fail(T, '1')
  })
  it('Should intersect two objects', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], {})
    Ok(T, { x: 1, y: 1 })
  })
  it('Should not intersect two objects with internal additionalProperties false', () => {
    const A = Type.Object({ x: Type.Number() }, { additionalProperties: false })
    const B = Type.Object({ y: Type.Number() }, { additionalProperties: false })
    const T = Type.Intersect([A, B], {})
    Fail(T, { x: 1, y: 1 })
  })
  it('Should intersect two objects and mandate required properties', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], {})
    Ok(T, { x: 1, y: 1 })
    Fail(T, { x: 1 })
    Fail(T, { y: 1 })
  })
  it('Should intersect two objects with unevaluated properties', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], {})
    Ok(T, { x: 1, y: 2, z: 1 })
  })
  it('Should intersect two objects and restrict unevaluated properties', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], { unevaluatedProperties: false })
    Fail(T, { x: 1, y: 2, z: 1 })
  })
  it('Should intersect two objects and allow unevaluated properties of number', () => {
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ y: Type.Number() })
    const T = Type.Intersect([A, B], { unevaluatedProperties: Type.Number() })
    Ok(T, { x: 1, y: 2, z: 3 })
    Fail(T, { x: 1, y: 2, z: '1' })
  })
  it('Should intersect two union objects with overlapping properties of the same type', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() })])
    const B = Type.Union([Type.Object({ x: Type.Number() })])
    const T = Type.Intersect([A, B])
    Ok(T, { x: 1 })
    Fail(T, { x: '1' })
  })
  it('Should not intersect two union objects with overlapping properties of varying types', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() })])
    const B = Type.Union([Type.Object({ x: Type.String() })])
    const T = Type.Intersect([A, B])
    Fail(T, { x: 1 })
    Fail(T, { x: '1' })
  })
  it('Should intersect two union objects with non-overlapping properties', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() })])
    const B = Type.Union([Type.Object({ y: Type.Number() })])
    const T = Type.Intersect([A, B])
    Ok(T, { x: 1, y: 1 })
  })
  it('Should not intersect two union objects with non-overlapping properties for additionalProperties false', () => {
    const A = Type.Union([Type.Object({ x: Type.Number() }, { additionalProperties: false })])
    const B = Type.Union([Type.Object({ y: Type.Number() }, { additionalProperties: false })])
    const T = Type.Intersect([A, B])
    Fail(T, { x: 1, y: 1 })
  })
})
