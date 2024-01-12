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
  // Intersect
  // ----------------------------------------------------------------
  it('Should Union 1', () => {
    const R = Type.SetUnion([1, 2], [1, 2])
    Assert.IsEqual(R, [1, 2, 1, 2])
  })
  it('Should Union 2', () => {
    const R = Type.SetUnion([1], [1, 2])
    Assert.IsEqual(R, [1, 1, 2])
  })
  // it("Should Union 3", () => {
  //   const R = Type.SetUnion([1, 2], [1])
  //   Assert.IsEqual(R, [2, 1, 1])
  // })
  // it("Should Union 4", () => {
  //   const R = Type.SetUnion([], [1])
  //   Assert.IsEqual(R, [1])
  // })
  // it("Should Union 5", () => {
  //   const R = Type.SetUnion([1], [])
  //   Assert.IsEqual(R, [1])
  // })
  // it("Should Union 6", () => {
  //   const R = Type.SetUnion([1], [2])
  //   Assert.IsEqual(R, [1, 2])
  // })
})
