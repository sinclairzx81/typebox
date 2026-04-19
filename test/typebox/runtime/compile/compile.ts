import System from 'typebox/system'
import Compile from 'typebox/compile'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Compile.Compile')

// ------------------------------------------------------------------
// General
// ------------------------------------------------------------------
Test('Should Compile 1', () => {
  const check = Compile(Type.String())
  const checkResult = check.Check('hello')
  const errorsResult = check.Errors('hello')
  const parseResult = check.Parse('hello')
  Assert.IsTrue(checkResult)
  Assert.IsEqual(errorsResult, [])
  Assert.IsEqual(parseResult, 'hello')
})
Test('Should Compile 2', () => {
  const check = Compile({ A: Type.String() }, Type.Ref('A'))
  const checkResult = check.Check('hello')
  const errorsResult = check.Errors('hello')
  const parseResult = check.Parse('hello')
  Assert.IsTrue(checkResult)
  Assert.IsEqual(errorsResult, [])
  Assert.IsEqual(parseResult, 'hello')
})
Test('Should Compile 3', () => {
  const check = Compile({ A: Type.String() }, Type.Ref('A'))
  const checkResult = check.Check(1)
  const errorsResult = check.Errors(1)
  Assert.Throws(() => check.Parse({}))
  Assert.IsFalse(checkResult)
  Assert.IsTrue(errorsResult.length > 0)
})
// ------------------------------------------------------------------
// Disable Eval
// ------------------------------------------------------------------
Test('Should Compile 4', () => {
  System.Settings.Set({ useAcceleration: false })
  const check = Compile({ A: Type.String() }, Type.Ref('A'))
  const checkResult = check.Check(1)
  const errorsResult = check.Errors(1)
  Assert.Throws(() => check.Parse({}))
  Assert.IsFalse(checkResult)
  Assert.IsTrue(errorsResult.length > 0)
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Context | Schema
// ------------------------------------------------------------------
Test('Should Compile 5', () => {
  const check = Compile({ A: Type.String() }, Type.Number())
  Assert.IsTrue(Type.IsString(check.Context().A))
  Assert.IsTrue(Type.IsNumber(check.Type()))
})

// ------------------------------------------------------------------
// Nested Validator
// ------------------------------------------------------------------
Test('Should Compile 6', () => {
  const A = Compile(Type.Literal(1))
  const B = Compile(Type.Literal(2))
  const C = Compile(Type.Literal(3))
  const D = Compile(Type.Tuple([A, B, C]))
  const E = Compile(Type.Object({ x: D }))

  const Value = { x: [1, 2, 3] }

  const checkResult = E.Check(Value)
  const errorsResult = E.Errors(Value)
  const parseResult = E.Parse(Value)
  Assert.IsTrue(checkResult)
  Assert.IsEqual(errorsResult, [])
  Assert.IsEqual(parseResult, Value)
})
// ------------------------------------------------------------------
// Code
// ------------------------------------------------------------------
Test('Should Compile 16', () => {
  const A = Compile(Type.String({ default: 'hello' }))
  const C = A.Code()
  Assert.IsTrue(typeof C === 'string')
})
Test('Should Compile 17', () => {
  const A = Compile(Type.String({ default: 'hello' }))
  const C = A.IsAccelerated()
  Assert.IsTrue(typeof C === 'boolean')
})
// ------------------------------------------------------------------
// Default Parse
// ------------------------------------------------------------------
Test('Should Parse Default 0', () => {
  const T = Compile(Type.Number())
  const output = T.Parse(1)
  Assert.IsEqual(output, 1)
})
Test('Should Parse Default 1', () => {
  const T = Compile(Type.Number())
  Assert.Throws(() => T.Parse('1'))
})
