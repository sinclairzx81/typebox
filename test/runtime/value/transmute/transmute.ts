import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/transmute/Transmute', () => {
  // --------------------------------------------
  // Throw
  // --------------------------------------------
  it('should throw 1', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Transmute(1, 1))
  })
  it('should throw 2', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Transmute({}, 1))
  })
  it('should throw 3', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Transmute([], 1))
  })
  it('should throw 4', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Transmute({}, []))
  })
  it('should throw 5', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Transmute([], {}))
  })
  // --------------------------------------------
  // Transmute
  // --------------------------------------------
  it('Should transmute 0', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, {})
    Assert.IsEqual(A, {})
  })
  it('Should transmute 1', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, { x: { y: { z: 2 } } })
    Assert.IsEqual(A.x.y.z, 2)
    Assert.IsEqual(A.x.y, Y)
    Assert.IsEqual(A.x, X)
  })
  it('Should transmute 2', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, { x: { y: { z: [1, 2, 3] } } })
    Assert.IsEqual(A.x.y.z, [1, 2, 3])
    Assert.IsEqual(A.x.y, Y)
    Assert.IsEqual(A.x, X)
  })
  it('Should transmute 3', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, { x: {} })
    Assert.IsEqual(A.x.y, undefined)
    Assert.IsEqual(A.x, X)
  })
  it('Should transmute 4', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, { x: { y: 1 } })
    Assert.IsEqual(A.x.y, 1)
    Assert.IsEqual(A.x, X)
  })
  it('Should transmute 5', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, { x: { y: [1, 2, 3] } })
    Assert.IsEqual(A.x.y, [1, 2, 3])
    Assert.IsEqual(A.x, X)
  })
  it('Should transmute 6', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Transmute(A, { x: [1, 2, 3] })
    Assert.NotEqual(A.x, X)
    Assert.IsEqual(A.x, [1, 2, 3])
  })
})
