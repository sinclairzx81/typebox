import { Settings } from 'typebox/system'
import { Guard } from 'typebox/guard'
import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Codec.Union')

// ------------------------------------------------------------------
// Nullable
// ------------------------------------------------------------------
const NumberToString = Type.Codec(Type.Number())
  .Decode((value) => {
    return value.toString()
  })
  .Encode((value) => {
    return parseFloat(value)
  })

Test('Should Union 1', () => {
  const T = Type.Union([Type.Null(), NumberToString])
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, null)
  Assert.IsEqual(E, null)
})
Test('Should Union 2', () => {
  const T = Type.Union([Type.Null(), NumberToString])
  const D = Value.Decode(T, 100)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '100')
  Assert.IsEqual(E, 100)
})
Test('Should Union 3', () => {
  const T = Type.Codec(Type.Union([Type.Null(), NumberToString]))
    .Decode((value) => Guard.IsEqual(value, null) ? 'is null' : value)
    .Encode((value) => Guard.IsEqual(value, 'is null') ? null : value)
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, 'is null')
  Assert.IsEqual(E, null)
})
// ------------------------------------------------------------------
// Nullable: Reversed
// ------------------------------------------------------------------
Test('Should Union 4', () => {
  const T = Type.Union([NumberToString, Type.Null()])
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, null)
  Assert.IsEqual(E, null)
})
Test('Should Union 5', () => {
  const T = Type.Union([NumberToString, Type.Null()])
  const D = Value.Decode(T, 100)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, '100')
  Assert.IsEqual(E, 100)
})
Test('Should Union 6', () => {
  const T = Type.Codec(Type.Union([NumberToString, Type.Null()]))
    .Decode((value) => Guard.IsEqual(value, null) ? 'is null' : value)
    .Encode((value) => Guard.IsEqual(value, 'is null') ? null : value)
  const D = Value.Decode(T, null)
  const E = Value.Encode(T, D)
  Assert.IsEqual(D, 'is null')
  Assert.IsEqual(E, null)
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Union 7', () => {
  const Identity = Type.Codec(Type.Union([
    Type.Literal(1),
    Type.Literal(2)
  ]))
    .Decode((value) => value)
    .Encode((value) => value)
  Assert.Throws(() => Value.Decode(Identity, 3))
  Assert.Throws(() => Value.Encode(Identity, 3))
})
// ------------------------------------------------------------------
// Non-Structural, Use Alpha Ordered JSON
// ------------------------------------------------------------------
{
  const StringToLiteral = Type.Codec(Type.String())
    .Decode((value) => 'string' as const)
    .Encode((value) => 'string')
  const NumberToLiteral = Type.Codec(Type.Number())
    .Decode((value) => 'number' as const)
    .Encode((value) => 0)
  const BooleanToLiteral = Type.Codec(Type.Boolean())
    .Decode((value) => 'boolean' as const)
    .Encode((value) => false)

  const Union = Type.Union([
    StringToLiteral, // <-- Encode: Alpha via UnionPrioritySort
    BooleanToLiteral,
    NumberToLiteral
  ])
  Test('Should Union 8', () => {
    const D = Value.Decode(Union, 'hello')
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'string')
    Assert.IsEqual(E, 'string')
  })
  Test('Should Union 9', () => {
    const D = Value.Decode(Union, 1)
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'number')
    Assert.IsEqual(E, 'string')
  })
  Test('Should Union 10', () => {
    const D = Value.Decode(Union, true)
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'boolean')
    Assert.IsEqual(E, 'string')
  })
}
// ------------------------------------------------------------------
// Ambigious Encode: We match on { x, y, z } in all cases because
// Encode uses the same sequence order as Decode which is priority
// sorted.
// ------------------------------------------------------------------
{
  const Vector1 = Type.Codec(Type.Object({ x: Type.Number() }))
    .Decode((value) => 'Vector1')
    .Encode((value) => ({ x: 1 }))
  const Vector2 = Type.Codec(Type.Object({ x: Type.Number(), y: Type.Number() }))
    .Decode((value) => 'Vector2')
    .Encode((value) => ({ x: 1, y: 2 }))
  const Vector3 = Type.Codec(Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() }))
    .Decode((value) => 'Vector3')
    .Encode((value) => ({ x: 1, y: 2, z: 3 }))

  const Union = Type.Union([
    Vector1,
    Vector2,
    Vector3
  ])
  Test('Should Union 11', () => {
    const D = Value.Decode(Union, { x: 1, y: 2, z: 3 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector3')
    Assert.IsEqual(E, { x: 1, y: 2, z: 3 })
  })
  Test('Should Union 12', () => {
    const D = Value.Decode(Union, { x: 1, y: 2 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector2')
    Assert.IsEqual(E, { x: 1, y: 2, z: 3 })
  })
  Test('Should Union 13', () => {
    const D = Value.Decode(Union, { x: 1 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector1')
    Assert.IsEqual(E, { x: 1, y: 2, z: 3 })
  })
}
// ------------------------------------------------------------------
// Structural, Use Broadest on Decode (Ambigious Decode)
// ------------------------------------------------------------------
{
  const Vector1 = Type.Codec(Type.Object({ type: Type.Literal('Vector1'), x: Type.Number() }))
    .Decode((value) => 'Vector1')
    .Encode((value) => ({ type: 'Vector1', x: 1 }))
  const Vector2 = Type.Codec(Type.Object({ type: Type.Literal('Vector2'), x: Type.Number(), y: Type.Number() }))
    .Decode((value) => 'Vector2')
    .Encode((value) => ({ type: 'Vector2', x: 1, y: 2 }))
  const Vector3 = Type.Codec(Type.Object({ type: Type.Literal('Vector3'), x: Type.Number(), y: Type.Number(), z: Type.Number() }))
    .Decode((value) => 'Vector3')
    .Encode((value) => ({ type: 'Vector3', x: 1, y: 2, z: 3 }))

  const Union = Type.Union([
    Vector1,
    Vector2,
    Vector3
  ])
  Test('Should Union 11', () => {
    const D = Value.Decode(Union, { type: 'Vector3', x: 1, y: 2, z: 3 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector3')
    Assert.IsEqual(E, { type: 'Vector1', x: 1 })
  })
  Test('Should Union 12', () => {
    const D = Value.Decode(Union, { type: 'Vector2', x: 1, y: 2 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector2')
    Assert.IsEqual(E, { type: 'Vector1', x: 1 })
  })
  Test('Should Union 13', () => {
    const D = Value.Decode(Union, { type: 'Vector1', x: 1 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector1')
    Assert.IsEqual(E, { type: 'Vector1', x: 1 })
  })
}
// ------------------------------------------------------------------
// Structural, Use Broadest on Decode (Encode Disambiguation 1)
// ------------------------------------------------------------------
{
  const Vector1 = Type.Codec(Type.Object({ x: Type.Number() }, { additionalProperties: false }))
    .Decode((value) => 'Vector1')
    .Encode((value) => (value === 'Vector1' ? { x: 1 } : null) as never)
  const Vector2 = Type.Codec(Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false }))
    .Decode((value) => 'Vector2')
    .Encode((value) => (value === 'Vector2' ? { x: 1, y: 2 } : null) as never)
  const Vector3 = Type.Codec(Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() }, { additionalProperties: false }))
    .Decode((value) => 'Vector3')
    .Encode((value) => (value === 'Vector3' ? { x: 1, y: 2, z: 3 } : null) as never)

  const Union = Type.Union([
    Vector1,
    Vector2,
    Vector3
  ])
  Test('Should Union 14', () => {
    const D = Value.Decode(Union, { x: 1, y: 2, z: 3 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector3')
    Assert.IsEqual(E, { x: 1, y: 2, z: 3 })
  })
  Test('Should Union 15', () => {
    const D = Value.Decode(Union, { x: 1, y: 2 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector2')
    Assert.IsEqual(E, { x: 1, y: 2 })
  })
  Test('Should Union 16', () => {
    const D = Value.Decode(Union, { x: 1 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector1')
    Assert.IsEqual(E, { x: 1 })
  })
}
// ------------------------------------------------------------------
// Structural, Use Broadest on Decode (Encode Disambiguation 2)
// ------------------------------------------------------------------
{
  const Vector1 = Type.Codec(Type.Object({ type: Type.Literal('Vector1'), x: Type.Number() }))
    .Decode((value) => 'Vector1')
    .Encode((value) => (value === 'Vector1' ? { type: 'Vector1', x: 1 } : null) as never)
  const Vector2 = Type.Codec(Type.Object({ type: Type.Literal('Vector2'), x: Type.Number(), y: Type.Number() }))
    .Decode((value) => 'Vector2')
    .Encode((value) => (value === 'Vector2' ? { type: 'Vector2', x: 1, y: 2 } : null) as never)
  const Vector3 = Type.Codec(Type.Object({ type: Type.Literal('Vector3'), x: Type.Number(), y: Type.Number(), z: Type.Number() }))
    .Decode((value) => 'Vector3')
    .Encode((value) => (value === 'Vector3' ? { type: 'Vector3', x: 1, y: 2, z: 3 } : null) as never)

  const Union = Type.Union([
    Vector1,
    Vector2,
    Vector3
  ])
  Test('Should Union 17', () => {
    const D = Value.Decode(Union, { type: 'Vector3', x: 1, y: 2, z: 3 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector3')
    Assert.IsEqual(E, { type: 'Vector3', x: 1, y: 2, z: 3 })
  })
  Test('Should Union 18', () => {
    const D = Value.Decode(Union, { type: 'Vector2', x: 1, y: 2 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector2')
    Assert.IsEqual(E, { type: 'Vector2', x: 1, y: 2 })
  })
  Test('Should Union 19', () => {
    const D = Value.Decode(Union, { type: 'Vector1', x: 1 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector1')
    Assert.IsEqual(E, { type: 'Vector1', x: 1 })
  })
}
// ------------------------------------------------------------------
// Coverage: DecodeUnsafe
// ------------------------------------------------------------------
import { DecodeUnsafe } from 'typebox/value'

Test('Should Union 20', () => {
  const T = Type.Union([Type.Literal(1), Type.Literal(2)])
  const R = DecodeUnsafe({}, T, 1)
  Assert.IsEqual(R, 1)
})
Test('Should Union 21', () => {
  const T = Type.Union([Type.Literal(1), Type.Literal(2)])
  const R = DecodeUnsafe({}, T, 3)
  Assert.IsEqual(R, 3)
})
// ------------------------------------------------------------------
// UnionPrioritySort
// ------------------------------------------------------------------
{
  const Vector1 = Type.Codec(Type.Object({ x: Type.Number() }, { additionalProperties: false }))
    .Decode((value) => 'Vector1')
    .Encode((value) => (value === 'Vector1' ? { x: 1 } : null) as never)
  const Vector2 = Type.Codec(Type.Object({ x: Type.Number(), y: Type.Number() }, { additionalProperties: false }))
    .Decode((value) => 'Vector2')
    .Encode((value) => (value === 'Vector2' ? { x: 1, y: 2 } : null) as never)
  const Vector3 = Type.Codec(Type.Object({ x: Type.Number(), y: Type.Number(), z: Type.Number() }, { additionalProperties: false }))
    .Decode((value) => 'Vector3')
    .Encode((value) => (value === 'Vector3' ? { x: 1, y: 2, z: 3 } : null) as never)
  const Union = Type.Union([
    Vector1,
    Vector2,
    Vector3
  ])
  Test('Should Union 20', () => {
    Settings.Set({ unionPrioritySort: false })
    const D = Value.Decode(Union, { x: 1, y: 2 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector1')
    Assert.IsEqual(E, { x: 1 })
    Settings.Reset()
  })
  Test('Should Union 21', () => {
    // matching on Vector 3
    const D = Value.Decode(Union, { x: 1, y: 2 })
    const E = Value.Encode(Union, D)
    Assert.IsEqual(D, 'Vector2')
    Assert.IsEqual(E, { x: 1, y: 2 })
  })
}
// ------------------------------------------------------------------
// Codec Before Null: Select Member on Unencoded Value
// https://github.com/sinclairzx81/typebox/issues/1706
// ------------------------------------------------------------------
{
  const StrictDate = Type.Codec(Type.String())
    .Decode((value) => new Date(value))
    .Encode((value) => {
      if (!(value instanceof Date)) throw new Error('Date must be a Date object')
      return value.toISOString()
    })
  const Passthrough = Type.Codec(Type.String())
    .Decode((value) => JSON.parse(value))
    .Encode((value) => JSON.stringify(value))
  Test('Should Union 22', () => {
    const T = Type.Union([StrictDate, Type.Null()])
    const E = Value.Encode(T, null)
    Assert.IsEqual(E, null)
  })
  Test('Should Union 23', () => {
    const T = Type.Union([StrictDate, Type.Null()])
    const E = Value.Encode(T, new Date('2024-01-01T00:00:00.000Z'))
    Assert.IsEqual(E, '2024-01-01T00:00:00.000Z')
  })
  Test('Should Union 24', () => {
    const T = Type.Union([Passthrough, Type.Null()])
    const E = Value.Encode(T, null)
    Assert.IsEqual(E, null)
  })
  Test('Should Union 25', () => {
    const T = Type.Union([Passthrough, Type.Null()])
    const E = Value.Encode(T, { page: 2 })
    Assert.IsEqual(E, '{"page":2}')
  })
  Test('Should Union 26', () => {
    const Shared = { x: 'a' }
    const T = Type.Codec(Type.Union([Type.Object({ x: Passthrough }), Type.Null()]))
      .Decode((value) => value).Encode(() => Shared)
    Assert.IsEqual(Value.Encode(T, null), { x: '"a"' })
    Assert.IsEqual(Shared, { x: 'a' })
  })
  Test('Should Union 27', () => {
    const A = Type.Codec(Type.String()).Decode((value) => `a:${value}`)
      .Encode((value) => (value.startsWith('a:') ? value.slice(2) : null) as never)
    const B = Type.Codec(Type.String()).Decode((value) => `b:${value}`)
      .Encode((value) => (value.startsWith('b:') ? value.slice(2) : null) as never)
    Assert.IsEqual(Value.Encode(Type.Union([A, B]), 'b:x'), 'x')
    Assert.IsEqual(Value.Encode(Type.Union([B, A]), 'b:x'), 'x')
  })
  Test('Should Union 28', () => {
    let Calls = 0
    const A = Type.Codec(Type.String()).Decode((value) => value)
      .Encode(() => (++Calls === 1 ? null : 'wrong') as never)
    Assert.IsEqual(Value.Encode(Type.Union([A, Type.Null()]), 'x'), 'x')
    Assert.IsEqual(Calls, 1)
  })
}
