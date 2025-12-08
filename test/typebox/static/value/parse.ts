import Value from 'typebox/value'
import Type from 'typebox'

{
  const T = Type.Number()
  const V = Value.Parse(T, 1)
  V satisfies number
}
{
  const T = Type.Codec(Type.Number())
    .Decode((value) => value.toString())
    .Encode((value) => parseFloat(value))
  const V = Value.Parse(T, 1)
  V satisfies number
}
