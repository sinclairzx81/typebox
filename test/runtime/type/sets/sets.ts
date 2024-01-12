import * as Type from '@sinclair/typebox'
import { Assert } from '../../assert'

describe('type/sets', () => {
  // ----------------------------------------------------------------
  // Distinct
  // ----------------------------------------------------------------
  it('Should Distinct', () => {
    const R = Type.SetDistinct([1, 1, 2, 2])
    Assert.IsEqual(R, [1, 2])
  })
  // ----------------------------------------------------------------
  // Includes
  // ----------------------------------------------------------------
  it('Should Includes 1', () => {
    const R = Type.SetIncludes([1, 2, 3, 4], 1)
    Assert.IsTrue(R)
  })
  it('Should Includes 2', () => {
    const R = Type.SetIncludes([1, 2, 3, 4], 7)
    Assert.IsFalse(R)
  })
  // ----------------------------------------------------------------
  // IsSubset
  // ----------------------------------------------------------------
  it('Should IsSubset 1', () => {
    const R = Type.SetIsSubset([1, 2], [1, 2])
    Assert.IsTrue(R)
  })
  it('Should IsSubset 2', () => {
    const R = Type.SetIsSubset([1, 2], [1, 2, 3])
    Assert.IsTrue(R)
  })
  it('Should IsSubset 3', () => {
    const R = Type.SetIsSubset([1, 2], [1])
    Assert.IsFalse(R)
  })
  // ----------------------------------------------------------------
  // Intersect
  // ----------------------------------------------------------------
  it('Should Intersect 1', () => {
    const R = Type.SetIntersect([1, 2], [1, 2])
    Assert.IsEqual(R, [1, 2])
  })
  it('Should Intersect 2', () => {
    const R = Type.SetIntersect([1], [1, 2])
    Assert.IsEqual(R, [1])
  })
  it('Should Intersect 3', () => {
    const R = Type.SetIntersect([1, 2], [1])
    Assert.IsEqual(R, [1])
  })
  it('Should Intersect 4', () => {
    const R = Type.SetIntersect([], [1])
    Assert.IsEqual(R, [])
  })
  it('Should Intersect 5', () => {
    const R = Type.SetIntersect([1], [])
    Assert.IsEqual(R, [])
  })
  it('Should Intersect 6', () => {
    const R = Type.SetIntersect([1], [2])
    Assert.IsEqual(R, [])
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should Union 1', () => {
    const R = Type.SetUnion([1, 2], [1, 2])
    Assert.IsEqual(R, [1, 2, 1, 2])
  })
  it('Should Union 2', () => {
    const R = Type.SetUnion([1], [1, 2])
    Assert.IsEqual(R, [1, 1, 2])
  })
  it('Should Union 3', () => {
    const R = Type.SetUnion([1, 2], [1])
    Assert.IsEqual(R, [1, 2, 1])
  })
  it('Should Union 4', () => {
    const R = Type.SetUnion([], [1])
    Assert.IsEqual(R, [1])
  })
  it('Should Union 5', () => {
    const R = Type.SetUnion([1], [])
    Assert.IsEqual(R, [1])
  })
  // ----------------------------------------------------------------
  // Complement
  // ----------------------------------------------------------------
  it('Should Complement 1', () => {
    const R = Type.SetComplement([1, 2, 3, 4], [2, 3])
    Assert.IsEqual(R, [1, 4])
  })
  it('Should Complement 2', () => {
    const R = Type.SetComplement([2, 3], [1, 2, 3, 4])
    Assert.IsEqual(R, [])
  })
  // ----------------------------------------------------------------
  // IntersectMany
  // ----------------------------------------------------------------
  it('Should IntersectMany 1', () => {
    const R = Type.SetIntersectMany([[1, 2, 3], [1, 2], [1]] as const)
    Assert.IsEqual(R, [1])
  })
  it('Should IntersectMany 2', () => {
    const R = Type.SetIntersectMany([[1], [1, 2], [1, 2, 3]] as const)
    Assert.IsEqual(R, [1])
  })
  it('Should IntersectMany 3', () => {
    const R = Type.SetIntersectMany([
      [1, 2],
      [1, 2],
    ] as const)
    Assert.IsEqual(R, [1, 2])
  })
  it('Should IntersectMany 4', () => {
    const R = Type.SetIntersectMany([[1], [2]] as const)
    Assert.IsEqual(R, [])
  })
  it('Should IntersectMany 5', () => {
    const R = Type.SetIntersectMany([[1], []] as const)
    Assert.IsEqual(R, [])
  })
  it('Should IntersectMany 6', () => {
    const R = Type.SetIntersectMany([[], [1]] as const)
    Assert.IsEqual(R, [])
  })
  it('Should IntersectMany 7', () => {
    const R = Type.SetIntersectMany([[1], [1], [1], [1], []] as const)
    Assert.IsEqual(R, [])
  })
  it('Should IntersectMany 8', () => {
    const R = Type.SetIntersectMany([[], [1], [1], [1], [1]] as const)
    Assert.IsEqual(R, [])
  })
  // ----------------------------------------------------------------
  // UnionMany
  // ----------------------------------------------------------------
  it('Should UnionMany 1', () => {
    const R = Type.SetUnionMany([[1, 2, 3], [1, 2], [1]] as const)
    Assert.IsEqual(R, [1, 2, 3, 1, 2, 1])
  })
  it('Should UnionMany 2', () => {
    const R = Type.SetUnionMany([[1], [1, 2], [1, 2, 3]] as const)
    Assert.IsEqual(R, [1, 1, 2, 1, 2, 3])
  })
  it('Should UnionMany 3', () => {
    const R = Type.SetUnionMany([
      [1, 2],
      [1, 2],
    ] as const)
    Assert.IsEqual(R, [1, 2, 1, 2])
  })
  it('Should UnionMany 4', () => {
    const R = Type.SetUnionMany([[1], [2]] as const)
    Assert.IsEqual(R, [1, 2])
  })
  it('Should UnionMany 5', () => {
    const R = Type.SetUnionMany([[1], []] as const)
    Assert.IsEqual(R, [1])
  })
  it('Should UnionMany 6', () => {
    const R = Type.SetUnionMany([[], [1]] as const)
    Assert.IsEqual(R, [1])
  })
})
