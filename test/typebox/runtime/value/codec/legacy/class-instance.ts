import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Legacy.ClassInstance')
import { Decode, Encode } from './~codec.ts'

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
Test('Should ClassInstance 1', () => {
  const T = Type.Codec(Type.Number())
    .Decode((value) => new Date(value))
    .Encode((value) => value.getTime())

  const I = 12345
  const D = Decode(T, I)
  const E = Encode(T, D)
  Assert.IsEqual(I, E)
})
