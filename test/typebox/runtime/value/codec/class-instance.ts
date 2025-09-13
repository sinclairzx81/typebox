// deno-fmt-ignore-file

import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.ClassInstance')

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
Test('Should ClassInstance 1', () => {
  const T = Type.Codec(Type.Number())
    .Decode(value => new Date(value))
    .Encode(value => value.getTime())

  const I = 12345
  const D = Value.Decode(T, I)
  const E = Value.Encode(T, D)
  Assert.IsEqual(I, E)
})

