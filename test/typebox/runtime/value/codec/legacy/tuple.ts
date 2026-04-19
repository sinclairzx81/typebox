import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Legacy.Tuple')
import { Decode, Encode } from './~codec.ts'

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should Tuple 1', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const A = Type.Tuple([
    NumberToString,
    NumberToString,
    NumberToString
  ])
  const D = Decode(A, [1, 2, 3])
  const E = Encode(A, D)
  Assert.IsEqual(D, ['1', '2', '3'])
  Assert.IsEqual(E, [1, 2, 3])
})
// ------------------------------------------------------------------
// Tuple: + Additional
// ------------------------------------------------------------------
Test('Should Tuple 2', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const A = Type.Tuple([
    NumberToString,
    NumberToString,
    NumberToString
  ])
  const D = Decode(A, [1, 2, 3, 4, 5])
  const E = Encode(A, D)
  Assert.IsEqual(D, ['1', '2', '3'])
  Assert.IsEqual(E, [1, 2, 3])
})
// ------------------------------------------------------------------
// TupleToObject
// ------------------------------------------------------------------
Test('Should Tuple 3', () => {
  const TupleToObject = Type.Codec(Type.Tuple([
    Type.Number(),
    Type.Number(),
    Type.Number()
  ]))
    .Decode((value) => ({ x: value[0], y: value[1], z: value[2] }))
    .Encode((value) => [value.x, value.y, value.z])
  const D = Decode(TupleToObject, [1, 2, 3])
  const E = Encode(TupleToObject, D)
  Assert.IsEqual(D, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(E, [1, 2, 3])
})
// ------------------------------------------------------------------
// TupleToObject With Embedded Codec
// ------------------------------------------------------------------
Test('Should Tuple 4', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))
  const TupleToObject = Type.Codec(Type.Tuple([
    NumberToString,
    NumberToString,
    NumberToString
  ]))
    .Decode((value) => ({ x: value[0], y: value[1], z: value[2] }))
    .Encode((value) => [value.x, value.y, value.z])
  const D = Decode(TupleToObject, [1, 2, 3])
  const E = Encode(TupleToObject, D)
  Assert.IsEqual(D, { x: '1', y: '2', z: '3' })
  Assert.IsEqual(E, [1, 2, 3])
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Tuple 5', () => {
  const Identity = Type.Codec(Type.Tuple([
    Type.Number(),
    Type.Number()
  ]))
    .Decode((value) => value)
    .Encode((value) => value)

  Assert.Throws(() => Decode(Identity, null))
  Assert.Throws(() => Encode(Identity, null))
})
