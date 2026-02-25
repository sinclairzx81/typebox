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
// ------------------------------------------------------------------
// Corrective Parse
// ------------------------------------------------------------------
Test('Should Parse Corrective 0 (Additional)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Compile(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }))
  const input = { x: 1, y: 2, z: 3 }
  const output = T.Parse(input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  Assert.HasPropertyKey(output, 'z')
  System.Settings.Reset()
})
Test('Should Parse Corrective 1 (No Additional)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Compile(Type.Object({
    x: Type.Number(),
    y: Type.Number()
  }, { additionalProperties: false }))
  const input = { x: 1, y: 2, z: 3 }
  const output = T.Parse(input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  Assert.NotHasPropertyKey(output, 'z')
  System.Settings.Reset()
})
Test('Should Parse Corrective 2 (Default)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Compile(Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  }))
  const input = {}
  const output = T.Parse(input)
  Assert.IsEqual(output.x, 1)
  Assert.IsEqual(output.y, 2)
  System.Settings.Reset()
})
Test('Should Parse Corrective 3 (Default)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Compile(Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  }))
  const input = { x: 3, y: 4 }
  const output = T.Parse(input)
  Assert.IsEqual(output.x, 3)
  Assert.IsEqual(output.y, 4)
  System.Settings.Reset()
})
Test('Should Parse Corrective 4 (Convert)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Compile(Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  }))
  const input = { x: '3', y: '4' }
  const output = T.Parse(input)
  Assert.IsEqual(output.x, 3)
  Assert.IsEqual(output.y, 4)
  System.Settings.Reset()
})
Test('Should Parse Corrective 5 (Assert)', () => {
  System.Settings.Set({ correctiveParse: true })
  const T = Compile(Type.Object({
    x: Type.Number({ default: 1 }),
    y: Type.Number({ default: 2 })
  }))
  const input = undefined
  Assert.Throws(() => T.Parse(input))
  System.Settings.Reset()
})
