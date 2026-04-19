import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Legacy.Cyclic')
import { Decode, Encode } from './~codec.ts'

Test('Should Cyclic 1', () => {
  const StringToNumber = Type.Codec(Type.String())
    .Decode((value) => parseInt(value))
    .Encode((value) => value.toString())

  const T = Type.Cyclic({
    A: Type.Object({
      x: StringToNumber,
      y: StringToNumber
    }),
    B: Type.Object({
      x: Type.Ref('A')
    })
  }, 'B')

  const D = Decode(T, { x: { x: '12345', y: '54321' } })
  const E = Encode(T, D)
  Assert.IsEqual(D, { x: { x: 12345, y: 54321 } })
  Assert.IsEqual(E, { x: { x: '12345', y: '54321' } })
})
