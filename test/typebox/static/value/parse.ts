import Value from 'typebox/value'
import Type from 'typebox'

{
  const T = Type.Number()
  const V = Value.Parse(T, 1)
  V satisfies number
}
