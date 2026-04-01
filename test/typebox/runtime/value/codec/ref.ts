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

  const D = Value.Decode({ A }, NumberToString, 1)
  const E = Value.Encode({ A }, NumberToString, D)
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
  const D = Value.Decode({ NumberToString }, Type.Ref('NumberToString'), 1)
  const E = Value.Encode({ NumberToString }, Type.Ref('NumberToString'), D)
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

  Assert.Throws(() => Value.Decode({}, NumberToString, 1))
  Assert.Throws(() => Value.Encode({}, NumberToString, 1))
})

// ------------------------------------------------------------------
// Deep-Ref | Resolution Order
//
// https://github.com/sinclairzx81/typebox/issues/1556
// ------------------------------------------------------------------
Test('Should Ref 4', () => {
  const schema1 = Type.Codec(Type.String()).Decode((v) => Number.parseInt(v)).Encode((v) => v.toString())
  const schema2 = Type.Codec(Type.Object({ a: Type.Ref('schema1') })).Decode((v) => v.a).Encode((a) => ({ a }))
  const schema3 = Type.Codec(schema2).Decode((v: any) => v - 1).Encode((v) => v + 1)
  const schema4 = Type.Codec(Type.Ref('schema2')).Decode((v: any) => v - 1).Encode((v) => v + 1)
  const context = { schema1, schema2, schema3, schema4 }
  // Decode
  Assert.IsEqual(Value.Decode(context, schema1, '1'), 1)
  Assert.IsEqual(Value.Decode(context, schema2, { a: '1' }), 1)
  Assert.IsEqual(Value.Decode(context, schema3, { a: '2' }), 1)
  Assert.IsEqual(Value.Decode(context, schema4, { a: '2' }), 1)
  // Encode
  Assert.IsEqual(Value.Encode(context, schema1, 1), '1')
  Assert.IsEqual(Value.Encode(context, schema2, 1), { a: '1' })
  Assert.IsEqual(Value.Encode(context, schema3, 1), { a: '2' })
  Assert.IsEqual(Value.Encode(context, schema4, 1), { a: '2' })
})
