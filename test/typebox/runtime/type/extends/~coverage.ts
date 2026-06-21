import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Coverage')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  const R: Type.ExtendsResult.TExtendsFalse = Extends({}, {}, Type.Null())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
