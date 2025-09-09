import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Ref')

Test('Should Clean 1', () => {
  const A = Type.Object({
    x: Type.Number()
  })
  const T = Type.Ref('A')
  const R = Value.Clean({ A }, T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const A = Type.Object({
    x: Type.Number()
  })
  const T = Type.Ref('A')
  const R = Value.Clean({ A }, T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 3', () => {
  const A = Type.Object({
    x: Type.Number()
  })
  const T = Type.Ref('A')
  const R = Value.Clean({ A }, T, { x: null })
  Assert.IsEqual(R, { x: null })
})
// ----------------------------------------------------------------
// Clean Discard
// ----------------------------------------------------------------
Test('Should Clean 4', () => {
  const A = Type.Object({
    x: Type.Number()
  })
  const T = Type.Ref('A')
  const R = Value.Clean({ A }, T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 5', () => {
  const A = Type.Object({
    x: Type.Number()
  })
  const T = Type.Ref('A')
  const R = Value.Clean({ A }, T, { a: null })
  Assert.IsEqual(R, {})
})
Test('Should Clean 6', () => {
  const A = Type.Object({
    x: Type.Number()
  })
  const T = Type.Ref('A')
  const R = Value.Clean({ A }, T, { a: null, x: null })
  Assert.IsEqual(R, { x: null })
})
