import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Intersect')

// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
Test('Should Intersect 1', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([
    Type.Object({ x: NumberToString }),
    Type.Object({ y: NumberToString })
  ])
  const D = Value.Decode(T, { x: 1, y: 2 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Additional
// ------------------------------------------------------------------
Test('Should Intersect 2', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([
    Type.Object({ x: NumberToString }),
    Type.Object({ y: NumberToString })
  ])

  const D = Value.Decode(T, { x: 1, y: 2, z: 3 })
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, { x: '1', y: '2' })
  Assert.IsEqual(E, { x: 1, y: 2 })
})
// ------------------------------------------------------------------
// Primative
// ------------------------------------------------------------------
Test('Should Intersect 3', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([NumberToString, Type.Number()])
  const D = Value.Decode(T, 1)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '1')
  Assert.IsEqual(E, 1)
})
Test('Should Intersect 3', () => {
  const NumberToString = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))

  const T = Type.Intersect([Type.Number(), NumberToString])
  const D = Value.Decode(T, 1)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '1')
  Assert.IsEqual(E, 1)
})
// ------------------------------------------------------------------
// Illogical
// ------------------------------------------------------------------
Test('Should Intersect 4', () => {
  const T = Type.Intersect([Type.Array(Type.Null()), Type.Number()])
  Assert.Throws(() => Value.Decode(T, 1))
  Assert.Throws(() => Value.Encode(T, [null]))
})
// ------------------------------------------------------------------
// Duplicate Properties
// ------------------------------------------------------------------
Test('Should Intersect 5: Duplicate properties should not run codec twice', () => {
  let decodeCount = 0
  let encodeCount = 0
  
  const IdCodec = Type.Codec(
    Type.Object({
      table: Type.String(),
      id: Type.String()
    })
  )
    .Decode((encoded) => {
      decodeCount++
      return `${encoded.table}:${encoded.id}`
    })
    .Encode((decoded) => {
      encodeCount++
      const [table, id] = decoded.split(':') as [string, string]
      return { table, id }
    })

  const T = Type.Intersect([
    Type.Object({ id: IdCodec }),
    Type.Object({ id: IdCodec }),
  ])
  
  // Reset counts
  decodeCount = 0
  encodeCount = 0
  
  const D = Value.Decode(T, { id: { table: 't', id: 'x' } })
  Assert.IsEqual(D, { id: 't:x' })
  Assert.IsEqual(decodeCount, 1) // Should only decode once, not twice
  
  const E = Value.Encode(T, D)
  Assert.IsEqual(E, { id: { table: 't', id: 'x' } })
  Assert.IsEqual(encodeCount, 1) // Should only encode once, not twice
})
