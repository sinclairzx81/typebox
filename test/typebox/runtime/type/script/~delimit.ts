import { Assert } from 'test'
import * as Type from 'typebox'

// ------------------------------------------------------------------
// Delimited sequences are higher-order combinators embedded
// within the TypeBox grammars. They are used across sequenced
// syntax such as Elements, Properties, Arguments and Module
// Declarations. These tests check varying parsing behaviors.
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.Delimit')

// ------------------------------------------------------------------
// Grammar
// ------------------------------------------------------------------
Test('Should Delimit 1', () => {
  const T: Type.TTuple<[]> = Type.Script('[]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items.length, 0)
})
Test('Should Delimit 2', () => {
  const T: Type.TTuple<[Type.TLiteral<1>]> = Type.Script('[1,]')
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items.length, 1)
})
Test('Should Delimit 3', () => {
  const T: Type.TNever = Type.Script('[,]')
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Delimit 4', () => {
  const T: Type.TNever = Type.Script('[,1]')
  Assert.IsTrue(Type.IsNever(T))
})
Test('Should Delimit 5', () => {
  const T: Type.TNever = Type.Script('[1,,]')
  Assert.IsTrue(Type.IsNever(T))
})
// ------------------------------------------------------------------
// Recursive
// ------------------------------------------------------------------
Test('Should Delimit 6', () => {
  // deep
  const depth = 10
  const [open, closed] = ['['.repeat(depth), ']'.repeat(depth)]
  const S = `${open}number${closed}`
  const T = Type.Script(S)
  Assert.IsTrue(Type.IsTuple(T))
})
Test('Should Delimit 7', () => {
  // recursive deep
  const depth = 10
  const [open, closed] = ['['.repeat(depth), ']'.repeat(depth)]
  const S = `${open}number${closed}`
  const V = `[${S}, ${S}, ${S}, ${S}, ${S}, ${S}, ${S}, ${S}, ${S}, ${S}]`
  const T = Type.Script(V)
  Assert.IsTrue(Type.IsTuple(T))
})
Test('Should Delimit 8', () => {
  // excessively deep
  const depth = 1000
  const [open, closed] = ['['.repeat(depth), ']'.repeat(depth)]
  const S = `${open}number${closed}`
  Assert.Throws(() => Type.Script(S))
})
