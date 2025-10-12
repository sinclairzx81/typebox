import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

// ------------------------------------------------------------------
// OptionalSemiColon / Declaration Delimiter Tests
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.SemiColon')

// The following was the breaking case observed trying to replicate
// Pick and Omit as computed TypeBox generics.
Test('Should SemiColon 1', () => {
  const Module = Type.Script(`
    type Omit2<T, K extends keyof any> = Pick2<T, Exclude<keyof T, K>>;
    type Pick2<T, K extends keyof T> = { [P in K]: T[P]; };
    type Vector = {
      x: 1,
      y: 2,
      z: 3,
      w: 4
    }
    type Result = Pick2<Omit2<Vector, 'x'>, 'y' | 'z'>
  `)
  const Result: Type.TObject<{
    y: Type.TLiteral<2>
    z: Type.TLiteral<3>
  }> = Module.Result
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsEqual(Result.properties.y.const, 2)
  Assert.IsEqual(Result.properties.z.const, 3)
  Assert.IsEqual(Guard.Keys(Result.properties).length, 2)
})
