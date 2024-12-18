import { Value } from '@sinclair/typebox/value'
import { Assert } from '../../assert/index'

describe('value/mutate/Mutate', () => {
  // --------------------------------------------
  // Throw
  // --------------------------------------------
  it('should throw 1', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Mutate(1, 1))
  })
  it('should throw 2', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Mutate({}, 1))
  })
  it('should throw 3', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Mutate([], 1))
  })
  it('should throw 4', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Mutate({}, []))
  })
  it('should throw 5', () => {
    // @ts-ignore
    Assert.Throws(() => Value.Mutate([], {}))
  })
  // --------------------------------------------
  // Mutate
  // --------------------------------------------
  it('Should mutate 0', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, {})
    Assert.IsEqual(A, {})
  })
  it('Should mutate 1', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: { z: 2 } } })
    Assert.IsEqual(A.x.y.z, 2)
    Assert.IsEqual(A.x.y, Y)
    Assert.IsEqual(A.x, X)
  })
  it('Should mutate 2', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: { z: [1, 2, 3] } } })
    Assert.IsEqual(A.x.y.z, [1, 2, 3])
    Assert.IsEqual(A.x.y, Y)
    Assert.IsEqual(A.x, X)
  })
  it('Should mutate 3', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: {} })
    Assert.IsEqual(A.x.y, undefined)
    Assert.IsEqual(A.x, X)
  })
  it('Should mutate 4', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: 1 } })
    Assert.IsEqual(A.x.y, 1)
    Assert.IsEqual(A.x, X)
  })
  it('Should mutate 5', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: { y: [1, 2, 3] } })
    Assert.IsEqual(A.x.y, [1, 2, 3])
    Assert.IsEqual(A.x, X)
  })
  it('Should mutate 6', () => {
    const Y = { z: 1 }
    const X = { y: Y }
    const A = { x: X }
    Value.Mutate(A, { x: [1, 2, 3] })
    Assert.NotEqual(A.x, X)
    Assert.IsEqual(A.x, [1, 2, 3])
  })
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1119
  // ----------------------------------------------------------------
  it('Should mutate array 1', () => {
    const A: unknown[] = []
    Value.Mutate(A, [])
    Assert.IsEqual(A, [])
  })
  it('Should mutate array 2', () => {
    const A: unknown[] = []
    Value.Mutate(A, [1])
    Assert.IsEqual(A, [1])
  })
  it('Should mutate array 3', () => {
    const A: unknown[] = [1, 2, 3]
    Value.Mutate(A, [1, 2])
    Assert.IsEqual(A, [1, 2])
  })
  it('Should mutate array 4', () => {
    const A: unknown[] = [1, 2, 3]
    Value.Mutate(A, [1, 2, 3, 4])
    Assert.IsEqual(A, [1, 2, 3, 4])
  })
  it('Should mutate array 5', () => {
    const A: unknown[] = [1, 2, 3]
    Value.Mutate(A, [{}, {}, {}, [1, 2, 3]])
    Assert.IsEqual(A, [{}, {}, {}, [1, 2, 3]])
  })
})
