import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Options')

// ------------------------------------------------------------------
// Options | Overloads
// ------------------------------------------------------------------
Test('Should Options 1', () => {
  const T = Type.Script('string', { x: 1 })
  Assert.IsTrue(Type.IsString(T))
  Assert.HasPropertyKey(T, 'x')
  Assert.IsEqual(T.x, 1)
})
Test('Should Options 2', () => {
  const A = Type.String()
  const T = Type.Script({ A }, 'A', { x: 1 })
  Assert.IsTrue(Type.IsString(T))
  Assert.HasPropertyKey(T, 'x')
  Assert.IsEqual(T.x, 1)
})
// ------------------------------------------------------------------
// Options | Json Parse
// ------------------------------------------------------------------
Test('Should Options 3', () => {
  const T: Type.TAssign<Type.TNull, {
    x: 1
  }> = Type.Script('Assign<null, { x: 1 }>')
  Assert.IsEqual(T.x, 1)
})
Test('Should Options 4', () => {
  const T: Type.TAssign<Type.TNull, {
    x: true
  }> = Type.Script('Assign<null, { x: true }>')
  Assert.IsEqual(T.x, true)
})
Test('Should Options 5', () => {
  const T: Type.TAssign<Type.TNull, {
    x: [1, 2, 3]
  }> = Type.Script('Assign<null, { x: [1, 2, 3] }>')
  Assert.IsEqual(T.x, [1, 2, 3])
})
Test('Should Options 6', () => {
  const T: Type.TAssign<Type.TNull, {
    x: { x: 1 }
  }> = Type.Script('Assign<null, { x: { x: 1 } }>')
  Assert.IsEqual(T.x, { x: 1 })
})
Test('Should Options 7', () => {
  const T: Type.TAssign<Type.TNull, {
    x: null
  }> = Type.Script('Assign<null, { x: null }>')
  Assert.IsEqual(T.x, null)
})
Test('Should Options 8', () => {
  const T: Type.TAssign<Type.TNull, {
    x: 'hello'
  }> = Type.Script('Assign<null, { x: "hello" }>')
  Assert.IsEqual(T.x, 'hello')
})
// ------------------------------------------------------------------
// Options: Do we want explicit handling for this?
// ------------------------------------------------------------------
Test('Should Options 9', () => {
  Assert.Throws(() => Type.Script('Assign<string>'))
})
