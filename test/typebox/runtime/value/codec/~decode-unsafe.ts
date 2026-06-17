import { DecodeUnsafe } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.DecodeUnsafe')

// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should DecodeUnsafe 1', () => {
  const T = Type.Object({
    x: Type.Number()
  })
  const D = DecodeUnsafe({}, T, undefined)
  Assert.IsEqual(D, undefined)
})
Test('Should DecodeUnsafe 2', () => {
  const T = Type.Array(Type.String())
  const D = DecodeUnsafe({}, T, undefined)
  Assert.IsEqual(D, undefined)
})
Test('Should DecodeUnsafe 3', () => {
  const T = Type.Tuple([Type.String()])
  const D = DecodeUnsafe({}, T, undefined)
  Assert.IsEqual(D, undefined)
})
Test('Should DecodeUnsafe 4', () => {
  const T = Type.Record(Type.String(), Type.String())
  const D = DecodeUnsafe({}, T, undefined)
  Assert.IsEqual(D, undefined)
})
Test('Should DecodeUnsafe 5', () => {
  const T = Type.Record(Type.Number(), Type.String())
  const D = DecodeUnsafe({}, T, { x: 1 })
  Assert.IsEqual(D, { x: 1 })
})
