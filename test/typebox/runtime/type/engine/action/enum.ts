import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Enum')

// ------------------------------------------------------------------
// Enum as Indexable
// ------------------------------------------------------------------
Test('Should Enum 1', () => {
  const E = Type.Enum(['x', 'y'])
  const T = Type.Object({ x: Type.Number(), y: Type.String() })
  const R = Type.Index(T, E)
  Assert.IsTrue(Type.IsUnion(R))
  Assert.IsTrue(Type.IsNumber(R.anyOf[0]))
  Assert.IsTrue(Type.IsString(R.anyOf[1]))
})
Test('Should Enum 2', () => {
  const E = Type.Enum([0, 1])
  const T = Type.Tuple([Type.Number(), Type.String()])
  const R = Type.Index(T, E)
  Assert.IsTrue(Type.IsUnion(R))
  Assert.IsTrue(Type.IsNumber(R.anyOf[0]))
  Assert.IsTrue(Type.IsString(R.anyOf[1]))
})
// ------------------------------------------------------------------
// Enum to Union
// ------------------------------------------------------------------
Test('Should Enum 3', () => {
  // we use a index which transforms the enum into a union
  const E = Type.Enum([1, null, 'hello', {} as never])
  const T = Type.Object({})
  const R = Type.Index(T, E)
})
