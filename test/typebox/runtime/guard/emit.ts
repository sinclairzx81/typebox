import { Assert } from 'test'
import { EmitGuard } from 'typebox/guard'

const Test = Assert.Context('Guard.EmitGuard')

// ------------------------------------------------------------------
// Coverage: Constant
// ------------------------------------------------------------------
Test('Should EmitGuard 1', () => {
  Assert.Throws(() => EmitGuard.Constant([] as never))
})
Test('Should EmitGuard 2', () => {
  Assert.Throws(() => EmitGuard.Constant({} as never))
})
// ------------------------------------------------------------------
// Coverage: ReduceOr
// ------------------------------------------------------------------
Test('Should EmitGuard 3', () => {
  const result = EmitGuard.ReduceOr([])
  Assert.IsEqual(result, 'false')
})
