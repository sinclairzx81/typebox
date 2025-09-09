// deno-fmt-ignore-file

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Cyclic')



Test('Should Cyclic 1', () => {
  const StringToNumber = Type.Codec(Type.String())
    .Decode(value => parseInt(value))
    .Encode(value => value.toString())

  const T = Type.Cyclic({
    A: Type.Object({
      x: StringToNumber,
      y: StringToNumber
    }),
    B: Type.Object({
      x: Type.Ref('A')
    })
  }, 'B')

  const D = Value.Decode(T, { x: { x: '12345', y: '54321' } })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: { x: 12345, y: 54321 } })
  Assert.IsEqual(E, { x: { x: '12345', y: '54321' } })
})
