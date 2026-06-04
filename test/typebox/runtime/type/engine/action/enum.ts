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
// Evaluation of Invalid Enum Value Causes Throw
// ------------------------------------------------------------------
Test('Should Enum 3', () => {
  const E = Type.Enum([1, 2, 'hello', {} as never])
  Assert.Throws(() => Type.Evaluate(E))
})
Test('Should Enum 4', () => {
  const E = Type.Enum([1, 2, 'hello', {} as never])
  const T = Type.Object({})
  Assert.Throws(() => Type.Index(T, E))
})
