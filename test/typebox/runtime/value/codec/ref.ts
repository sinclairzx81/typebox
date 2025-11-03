import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Ref')

// ------------------------------------------------------------------
// Ref With Codec
// ------------------------------------------------------------------
Test('Should Ref 1', () => {
  const A = Type.Number()
  const NumberToString = Type.Codec(Type.Ref('A'))
    .Decode((value: any) => value.toString())
    .Encode((value: any) => parseFloat(value))

  const D = Value.PipelineDecode({ A }, NumberToString, 1)
  const E = Value.PipelineEncode({ A }, NumberToString, D)
  Assert.IsEqual(D, '1')
  Assert.IsEqual(E, 1)
})
// ------------------------------------------------------------------
// Ref to Codec
// ------------------------------------------------------------------
Test('Should Ref 2', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value: any) => value.toString())
    .Encode((value: any) => parseFloat(value))
  const D = Value.PipelineDecode({ NumberToString }, Type.Ref('NumberToString'), 1)
  const E = Value.PipelineEncode({ NumberToString }, Type.Ref('NumberToString'), D)
  Assert.IsEqual(D, '1')
  Assert.IsEqual(E, 1)
})
// ------------------------------------------------------------------
// Error: Non-Resolvable
// ------------------------------------------------------------------
Test('Should Ref 3', () => {
  const NumberToString = Type.Codec(Type.Ref('A'))
    .Decode((value: any) => value.toString())
    .Encode((value: any) => parseFloat(value))

  Assert.Throws(() => Value.PipelineDecode({}, NumberToString, 1))
  Assert.Throws(() => Value.PipelineEncode({}, NumberToString, 1))
})
