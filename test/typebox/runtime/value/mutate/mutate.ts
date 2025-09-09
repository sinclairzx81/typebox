import { Value } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Value.Mutate')

// ------------------------------------------------------------------
// Throw
// ------------------------------------------------------------------
Test('Should Mutate 1', () => {
  // @ts-ignore
  Assert.Throws(() => Value.Mutate(1, 1))
})
Test('Should Mutate 2', () => {
  // @ts-ignore
  Assert.Throws(() => Value.Mutate({}, 1))
})
Test('Should Mutate 3', () => {
  // @ts-ignore
  Assert.Throws(() => Value.Mutate([], 1))
})
Test('Should Mutate 4', () => {
  // @ts-ignore
  Assert.Throws(() => Value.Mutate({}, []))
})
Test('Should Mutate 5', () => {
  // @ts-ignore
  Assert.Throws(() => Value.Mutate([], {}))
})
// ------------------------------------------------------------------
// Mutate
// ------------------------------------------------------------------
Test('Should Mutate 6', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, {})
  Assert.IsEqual(A, {})
})
Test('Should Mutate 7', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, { x: { y: { z: 2 } } })
  Assert.IsEqual(A.x.y.z, 2)
  Assert.IsEqual(A.x.y, Y)
  Assert.IsEqual(A.x, X)
})
Test('Should Mutate 8', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, { x: { y: { z: [1, 2, 3] } } })
  Assert.IsEqual(A.x.y.z, [1, 2, 3])
  Assert.IsEqual(A.x.y, Y)
  Assert.IsEqual(A.x, X)
})
Test('Should Mutate 9', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, { x: {} })
  Assert.IsEqual(A.x.y, undefined)
  Assert.IsEqual(A.x, X)
})
Test('Should Mutate 10', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, { x: { y: 1 } })
  Assert.IsEqual(A.x.y, 1)
  Assert.IsEqual(A.x, X)
})
Test('Should Mutate 11', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, { x: { y: [1, 2, 3] } })
  Assert.IsEqual(A.x.y, [1, 2, 3])
  Assert.IsEqual(A.x, X)
})
Test('Should Mutate 12', () => {
  const Y = { z: 1 }
  const X = { y: Y }
  const A = { x: X }
  Value.Mutate(A, { x: [1, 2, 3] })
  Assert.NotEqual(A.x, X)
  Assert.IsEqual(A.x, [1, 2, 3])
})
// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1119
// ------------------------------------------------------------------
Test('Should Mutate 13', () => {
  const A: unknown[] = []
  Value.Mutate(A, [])
  Assert.IsEqual(A, [])
})
Test('Should Mutate 14', () => {
  const A: unknown[] = []
  Value.Mutate(A, [1])
  Assert.IsEqual(A, [1])
})
Test('Should Mutate 15', () => {
  const A: unknown[] = [1, 2, 3]
  Value.Mutate(A, [1, 2])
  Assert.IsEqual(A, [1, 2])
})
Test('Should Mutate 16', () => {
  const A: unknown[] = [1, 2, 3]
  Value.Mutate(A, [1, 2, 3, 4])
  Assert.IsEqual(A, [1, 2, 3, 4])
})
Test('Should Mutate 17', () => {
  const A: unknown[] = [1, 2, 3]
  Value.Mutate(A, [{}, {}, {}, [1, 2, 3]])
  Assert.IsEqual(A, [{}, {}, {}, [1, 2, 3]])
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Mutate 18', () => {
  const A = { x: 1, y: 2, z: 3 }
  Value.Mutate(A, { x: 4, y: 5, z: 4 })
  Assert.IsEqual(A, { x: 4, y: 5, z: 4 })
})
Test('Should Mutate 19', () => {
  const A = { x: 1, y: 2, z: 3 }
  Value.Mutate(A, { x: 4, y: 5, z: 4, w: 5 })
  Assert.IsEqual(A, { x: 4, y: 5, z: 4, w: 5 })
})
