import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Tuple')

// ----------------------------------------------------------------
// Clean
// ----------------------------------------------------------------
Test('Should Clean 1', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Clean(T, [])
  Assert.IsEqual(R, [])
})
Test('Should Clean 3', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Clean(T, [1, 2])
  Assert.IsEqual(R, [1, 2])
})
Test('Should Clean 4', () => {
  const T = Type.Tuple([Type.Number(), Type.Number()])
  const R = Value.Clean(T, [1, 2, 3])
  Assert.IsEqual(R, [1, 2])
})
// ----------------------------------------------------------------
// Clean Deep
// ----------------------------------------------------------------
Test('Should Clean 5', () => {
  const T = Type.Tuple([
    Type.Number(),
    Type.Object({
      x: Type.Number()
    })
  ])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 6', () => {
  const T = Type.Tuple([
    Type.Number(),
    Type.Object({
      x: Type.Number()
    })
  ])
  const R = Value.Clean(T, [])
  Assert.IsEqual(R, [])
})
Test('Should Clean 7', () => {
  const T = Type.Tuple([
    Type.Number(),
    Type.Object({
      x: Type.Number()
    })
  ])
  const R = Value.Clean(T, [1])
  Assert.IsEqual(R, [1])
})
Test('Should Clean 8', () => {
  const T = Type.Tuple([
    Type.Number(),
    Type.Object({
      x: Type.Number()
    })
  ])
  const R = Value.Clean(T, [1, null])
  Assert.IsEqual(R, [1, null])
})
Test('Should Clean 9', () => {
  const T = Type.Tuple([
    Type.Number(),
    Type.Object({
      x: Type.Number()
    })
  ])
  const R = Value.Clean(T, [1, { x: null }])
  Assert.IsEqual(R, [1, { x: null }])
})
Test('Should Clean 10', () => {
  const T = Type.Tuple([
    Type.Number(),
    Type.Object({
      x: Type.Number()
    })
  ])
  const R = Value.Clean(T, [1, { u: null, x: null }])
  Assert.IsEqual(R, [1, { x: null }])
})
// ----------------------------------------------------------------
// Clean Empty
// ----------------------------------------------------------------
Test('Should Clean 11', () => {
  const T = Type.Tuple([])
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 12', () => {
  const T = Type.Tuple([])
  const R = Value.Clean(T, [])
  Assert.IsEqual(R, [])
})
Test('Should Clean 13', () => {
  const T = Type.Tuple([])
  const R = Value.Clean(T, [1])
  Assert.IsEqual(R, [])
})
