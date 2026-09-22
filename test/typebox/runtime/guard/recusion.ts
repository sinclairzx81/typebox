import { Assert } from 'test'
import { RecursionGuard } from 'typebox/guard'

const Test = Assert.Context('RecursionGuard')

// ------------------------------------------------------------------
// RecursionGuard.ShiftLeft
// ------------------------------------------------------------------
Test('Should ShiftLeft 1', () => {
  const result: any = RecursionGuard.ShiftLeft([], (left, right) => ({ left, right }), () => 'empty')
  Assert.IsEqual(result, 'empty')
})
Test('Should ShiftLeft 2', () => {
  const result: string | {
    left: number
    right: number[]
  } = RecursionGuard.ShiftLeft([1, 2, 3], (left, right) => ({ left, right }), () => 'empty')
  Assert.IsEqual(result, { left: 1, right: [2, 3] })
})
Test('Should ShiftLeft 3', () => {
  const result: string | {
    left: number
    right: number[]
  } = RecursionGuard.ShiftLeft([42], (left, right) => ({ left, right }), () => 'empty')
  Assert.IsEqual(result, { left: 42, right: [] })
})
// ------------------------------------------------------------------
// RecursionGuard.ShiftRight
// ------------------------------------------------------------------
Test('Should ShiftRight 1', () => {
  const result: any = RecursionGuard.ShiftRight([], (left, right) => ({ left, right }), () => 'empty')
  Assert.IsEqual(result, 'empty')
})
Test('Should ShiftRight 2', () => {
  const result: string | {
    left: number[]
    right: number
  } = RecursionGuard.ShiftRight([1, 2, 3], (left, right) => ({ left, right }), () => 'empty')
  Assert.IsEqual(result, { left: [1, 2], right: 3 })
})
Test('Should ShiftRight 3', () => {
  const result: string | {
    left: number[]
    right: number
  } = RecursionGuard.ShiftRight([42], (left, right) => ({ left, right }), () => 'empty')
  Assert.IsEqual(result, { left: [], right: 42 })
})
// ------------------------------------------------------------------
// RecursionGuard.Recursive
// ------------------------------------------------------------------
Test('Should Recursive 1', () => {
  const recursive = RecursionGuard.Recursive((value: number, result: number): number => value === 0 ? result : RecursionGuard.TailCall(recursive, value - 1, result + 1))
  Assert.IsEqual(recursive(16_384, 0), 16_384)
})
Test('Should Recursive 2', () => {
  const recursive = RecursionGuard.Recursive((value: number, result: number): number => value === 0 ? result : RecursionGuard.TailCall(recursive, value - 1, result + 1))
  Assert.Throws(() => recursive(16_385, 0))
})
Test('Should Recursive 3', () => {
  const recursive = RecursionGuard.Recursive((value: number): number => value === 0 ? 0 : recursive(value - 1) + 1)
  Assert.Throws(() => recursive(32770))
})
