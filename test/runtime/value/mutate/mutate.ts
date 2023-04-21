import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/mutate/Mutate', () => {
  // --------------------------------------------
  // Throw
  // --------------------------------------------
  it('should throw 1', () => {
    // @ts-ignore
    Assert.throws(() => Value.Mutate(1, 1))
  })
  it('should throw 2', () => {
    // @ts-ignore
    Assert.throws(() => Value.Mutate({}, 1))
  })
  it('should throw 3', () => {
    // @ts-ignore
    Assert.throws(() => Value.Mutate([], 1))
  })
  it('should throw 4', () => {
    // @ts-ignore
    Assert.throws(() => Value.Mutate({}, []))
  })
  it('should throw 5', () => {
    // @ts-ignore
    Assert.throws(() => Value.Mutate([], {}))
  })
  // --------------------------------------------
  // Mutate
  // --------------------------------------------
  it('Should mutate 0', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, {})
    Assert.isEqual(A, {})
  })
  it('Should mutate 1', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: { z: 2 } } })
    Assert.isEqual(A.x.y.z, 2)
    Assert.isEqual(A.x.y, Y)
    Assert.isEqual(A.x, X)
  })
  it('Should mutate 2', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: { z: [1, 2, 3] } } })
    Assert.isEqual(A.x.y.z, [1, 2, 3])
    Assert.isEqual(A.x.y, Y)
    Assert.isEqual(A.x, X)
  })
  it('Should mutate 3', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: {} })
    Assert.isEqual(A.x.y, undefined)
    Assert.isEqual(A.x, X)
  })
  it('Should mutate 4', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: 1 } })
    Assert.isEqual(A.x.y, 1)
    Assert.isEqual(A.x, X)
  })
  it('Should mutate 5', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: [1, 2, 3] } })
    Assert.isEqual(A.x.y, [1, 2, 3])
    Assert.isEqual(A.x, X)
  })
  it('Should mutate 6', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: [1, 2, 3] })
    Assert.notEqual(A.x, X)
    Assert.isEqual(A.x, [1, 2, 3])
  })
})
