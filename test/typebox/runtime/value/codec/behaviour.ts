import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Behaviour')

// ----------------------------------------------------
// Basic
// ----------------------------------------------------
Test('Should Behaviour 1', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => {
      return value.toString()
    })
    .Encode((value) => {
      return parseFloat(value)
    })
  const D = Value.Decode(NumberToString, 12345)
  const E = Value.Encode(NumberToString, D)
  Assert.IsEqual(D, '12345')
  Assert.IsEqual(E, 12345)
})
Test('Should Behaviour 2', () => {
  const UnknownToBoxed = Type.Codec(Type.Unknown())
    .Decode((value) => {
      return ({ value })
    })
    .Encode((value) => {
      return value.value
    })
  const D = Value.Decode(UnknownToBoxed, 1)
  const E = Value.Encode(UnknownToBoxed, D)
  Assert.IsEqual(D, { value: 1 })
  Assert.IsEqual(E, 1)
})
// ------------------------------------------------------------------
// Callback Execution Order
// ------------------------------------------------------------------
Test('Should Behaviour 3', () => {
  const EncodeStack: string[] = []
  const DecodeStack: string[] = []
  const A = Type.Codec(Type.String())
    .Decode((value) => {
      DecodeStack.push('A')
      return value
    })
    .Encode((value) => {
      EncodeStack.push('A')
      return value
    })

  const B = Type.Codec(A)
    .Decode((value) => {
      DecodeStack.push('B')
      return value
    })
    .Encode((value) => {
      EncodeStack.push('B')
      return value
    })

  const D = Value.Decode(B, 'hello')
  const E = Value.Encode(B, D)
  Assert.IsEqual(D, 'hello')
  Assert.IsEqual(E, 'hello')

  Assert.IsEqual(DecodeStack, ['A', 'B'])
  Assert.IsEqual(EncodeStack, ['B', 'A'])
})
Test('Should Behaviour 4', () => {
  const EncodeStack: string[] = []
  const DecodeStack: string[] = []
  const A = Type.Codec(Type.Number())
    .Decode((value) => {
      DecodeStack.push('A')
      return value.toString()
    })
    .Encode((value) => {
      EncodeStack.push('A')
      return parseFloat(value)
    })

  const T = Type.Object({ x: A, y: A })
  const D: { x: string; y: string } = Value.Decode(T, { x: 1, y: 2 } as never)
  const E: { x: number; y: number } = Value.Encode(T, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
  Assert.IsEqual(DecodeStack, ['A', 'A'])
  Assert.IsEqual(EncodeStack, ['A', 'A'])
})
Test('Should Behaviour 5', () => {
  const EncodeStack: string[] = []
  const DecodeStack: string[] = []
  const A = Type.Codec(Type.Number())
    .Decode((value) => {
      DecodeStack.push('A')
      return value.toString()
    })
    .Encode((value) => {
      EncodeStack.push('A')
      return parseFloat(value)
    })

  const B = Type.Codec(A)
    .Decode((value) => {
      DecodeStack.push('B')
      return value
    })
    .Encode((value) => {
      EncodeStack.push('B')
      return value
    })

  const T = Type.Object({ x: B, y: B })
  const D: { x: string; y: string } = Value.Decode(T, { x: 1, y: 2 } as never)
  const E: { x: number; y: number } = Value.Encode(T, D)

  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
  Assert.IsEqual(DecodeStack, ['A', 'B', 'A', 'B'])
  Assert.IsEqual(EncodeStack, ['B', 'A', 'B', 'A'])
})
// ------------------------------------------------------------------
// Error: Unidirectional Throw
// ------------------------------------------------------------------
Test('Should Behaviour 6', () => {
  const A = Type.Decode(Type.Number(), (value) => value)
  Assert.Throws(() => Value.Encode(A, 1))
})
Test('Should Behaviour 7', () => {
  const A = Type.Encode(Type.Number(), (value) => 0)
  Assert.Throws(() => Value.Decode(A, 1))
})
