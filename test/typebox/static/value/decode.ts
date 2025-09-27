import Value from 'typebox/value'
import Type from 'typebox'

const T = Type.Codec(Type.Number())
  .Decode((value) => value.toString())
  .Encode((value) => parseFloat(value))

const R = Type.Ref('T')

{
  const V = Value.Decode(T, 1)
  V satisfies Type.StaticDecode<typeof T>
}
{
  const V = Value.Decode({ T }, R, 1)
  V satisfies Type.StaticDecode<typeof T>
}
