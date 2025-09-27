import Value from 'typebox/value'
import Type from 'typebox'

const T = Type.Array(Type.Union([
  Type.Literal('A'),
  Type.Literal('B'),
  Type.Literal('C')
]))
const R = Type.Ref('T')

{
  const V = Value.Create(T)
  V satisfies Type.Static<typeof T>
}

{
  const V = Value.Create({ T }, R)
  V satisfies Type.Static<typeof T>
}
