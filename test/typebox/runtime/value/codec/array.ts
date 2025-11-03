import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Array')

// ------------------------------------------------------------------
// Embedded Codec
// ------------------------------------------------------------------
Test('Should Array 1', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const A = Type.Array(NumberToString)
  const D = Value.PipelineDecode(A, [1, 2, 3, 4, 5])
  const E = Value.PipelineEncode(A, D)
  Assert.IsEqual(D, ['1', '2', '3', '4', '5'])
  Assert.IsEqual(E, [1, 2, 3, 4, 5])
})
// ------------------------------------------------------------------
// Boxed Array Codec
// ------------------------------------------------------------------
Test('Should Array 2', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const BoxedElements = Type.Codec(Type.Array(NumberToString))
    .Decode((value) => value.map((value) => [value]))
    .Encode((value) => value.map((value) => value[0]))
  const D = Value.PipelineDecode(BoxedElements, [1, 2, 3, 4, 5])
  const E = Value.PipelineEncode(BoxedElements, D)
  Assert.IsEqual(D, [['1'], ['2'], ['3'], ['4'], ['5']])
  Assert.IsEqual(E, [1, 2, 3, 4, 5])
})
// ------------------------------------------------------------------
// Boxed Deep Array Codec
// ------------------------------------------------------------------
Test('Should Array 3', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const BoxedElements = Type.Codec(Type.Array(NumberToString))
    .Decode((value) => value.map((value) => [value]))
    .Encode((value) => value.map((value) => value[0]))

  const DeepArray = Type.Array(BoxedElements)
  const D = Value.PipelineDecode(DeepArray, [[1, 2, 3], [4, 5, 6]])
  const E = Value.PipelineEncode(DeepArray, D)
  Assert.IsEqual(D, [[['1'], ['2'], ['3']], [['4'], ['5'], ['6']]])
  Assert.IsEqual(E, [[1, 2, 3], [4, 5, 6]])
})
// ------------------------------------------------------------------
// Boxed Deep Array Codec with Reverse
// ------------------------------------------------------------------
Test('Should Array 4', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const BoxedElements = Type.Codec(Type.Array(NumberToString))
    .Decode((value) => value.map((value) => [value]))
    .Encode((value) => value.map((value) => value[0]))

  const DeepReversedArray = Type.Codec(Type.Array(BoxedElements))
    .Decode((value) => value.reverse())
    .Encode((value) => value.reverse())

  const D = Value.PipelineDecode(DeepReversedArray, [[1, 2, 3], [4, 5, 6]])
  const E = Value.PipelineEncode(DeepReversedArray, D)
  Assert.IsEqual(D, [[['4'], ['5'], ['6']], [['1'], ['2'], ['3']]])
  Assert.IsEqual(E, [[1, 2, 3], [4, 5, 6]])
})

// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
Test('Should Array 6', () => {
  const Array = Type.Codec(Type.Array(Type.Number()))
    .Decode((value) => value.toString())
    .Encode((value) => value as never)
  Assert.Throws(() => Value.PipelineDecode(Array, {}))
  Assert.Throws(() => Value.PipelineEncode(Array, {}))
})
