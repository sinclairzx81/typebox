// deno-fmt-ignore-file

import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Base')

// ------------------------------------------------------------------
// BaseInstance
// ------------------------------------------------------------------
Test('Should Base 1', () => {
  const T: TStringBase = new Type.Base()
  Assert.IsTrue(T.Check(null))
})
Test('Should Base 2', () => {
  const T: TStringBase = new Type.Base()
  Assert.IsEqual(T.Errors(null), [] )
})
Test('Should Base 3', () => {
  const T: TStringBase = new Type.Base()
  Assert.IsEqual(T.Clean(null), null)
})
// ------------------------------------------------------------------
// DerivedInstance
// ------------------------------------------------------------------
class TStringBase extends Type.Base<string> {
  public override Check(value: unknown): value is string {
    return typeof value === 'string'
  }
  public override Errors(value: unknown): object[] {
    return typeof value === 'string' ? [] : [{ message: 'expected string'}] 
  }
}
const StringBase = () => new TStringBase()
Test('Should Base 3', () => {
  const T: TStringBase = StringBase()
  Assert.IsFalse(Type.IsAny(T))
})
Test('Should Base 4', () => {
  const T: TStringBase = StringBase()
  Assert.IsTrue(Type.IsBase(T))
})
Test('Should Base 5', () => {
  const T: TStringBase = StringBase()
  Assert.IsTrue(T.Check('hello'))
})
Test('Should Base 6', () => {
  const T: TStringBase = StringBase()
  Assert.IsEqual(T.Errors('hello'), [])
})
Test('Should Base 7', () => {
  const T: TStringBase = StringBase()
  Assert.IsFalse(T.Check(1))
})
Test('Should Base 8', () => {
  const T: TStringBase = StringBase()
  Assert.IsEqual(T.Errors(1), [{ message: 'expected string'}] )
})
