import { Compile } from 'typebox/compile'
import { Settings } from 'typebox/system'
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
  Settings.Set({ useEval: false })
  const check = Compile({ A: Type.String() }, Type.Ref('A'))
  const checkResult = check.Check(1)
  const errorsResult = check.Errors(1)
  Assert.Throws(() => check.Parse({}))
  Assert.IsFalse(checkResult)
  Assert.IsTrue(errorsResult.length > 0)
  Settings.Reset()
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
// Base: Create
// ------------------------------------------------------------------
Test('Should Compile 8', () => {
  const A = Compile(Type.Literal(1))
  const C = A.Create()
  Assert.IsEqual(C, 1)
})
// ------------------------------------------------------------------
// Base: Clean
// ------------------------------------------------------------------
Test('Should Compile 9', () => {
  const A = Compile(Type.Object({ x: Type.Number() }))
  const C = A.Clean({ x: 1, y: 2 })
  Assert.IsEqual(C, { x: 1 })
})
// ------------------------------------------------------------------
// Base: Convert
// ------------------------------------------------------------------
Test('Should Convert 10', () => {
  const A = Compile(Type.String())
  const C = A.Convert(100)
  Assert.IsEqual(C, '100')
})
// ------------------------------------------------------------------
// Base: Default
// ------------------------------------------------------------------
Test('Should Compile 11', () => {
  const A = Compile(Type.String({ default: 'hello' }))
  const C = A.Default(undefined)
  Assert.IsEqual(C, 'hello')
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
  const C = A.IsEvaluated()
  Assert.IsTrue(typeof C === 'boolean')
})
