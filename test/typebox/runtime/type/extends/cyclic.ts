import Type, { Extends, ExtendsResult } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Extends.Cyclic')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Extends 1', () => {
  Assert.IsExtends<string, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Cyclic({ A: Type.String() }, 'A'), Type.Any())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 2', () => {
  Assert.IsExtends<null, string>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Null(), Type.Cyclic({ A: Type.String() }, 'A'))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Any, Never and Unknown
// ------------------------------------------------------------------
Test('Should Extends 3', () => {
  Assert.IsExtends<string, string>(true)
  const R: Type.ExtendsResult.TExtendsTrue<{}> = Extends({}, Type.Cyclic({ A: Type.String() }, 'A'), Type.Cyclic({ A: Type.String() }, 'A'))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 4', () => {
  Assert.IsExtendsWhenLeftIsNever<never, string>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Never(), Type.Cyclic({ A: Type.String() }, 'A'))
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should Extends 5', () => {
  Assert.IsExtends<unknown, string>(false)
  const R: ExtendsResult.TExtendsFalse = Extends({}, Type.Unknown(), Type.Cyclic({ A: Type.String() }, 'A'))
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
// ------------------------------------------------------------------
// Non-Resolvable Cyclic Target: Interpret as Unknown
// ------------------------------------------------------------------
Test('Should Extends 6', () => {
  Assert.IsExtends<string, any>(true)
  const R: ExtendsResult.TExtendsTrue = Extends({}, Type.Cyclic({ A: Type.String() }, 'B'), Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Coverage: CyclicExtends
//
// This tests interior Cyclic references are transform to TAny when
// passed to Extends.
//
// ------------------------------------------------------------------
Test('Should CyclicExtends 1', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Ref('A')
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should CyclicExtends 2', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Array(Type.Ref('A'))
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// Test('Should CyclicExtends 3', () => {
//   Assert.IsExtends<string, any>(true)
//   const A = Type.AsyncIterator(Type.Ref('A'))
//   const L = Type.Cyclic({ A }, 'A')
//   const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
//   Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
// })
Test('Should CyclicExtends 4', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Constructor([Type.Ref('A')], Type.Ref('A'))
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsFalse = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should CyclicExtends 5', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Function([Type.Ref('A')], Type.Ref('A'))
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsFalse = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should CyclicExtends 6', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Intersect([Type.Ref('A'), Type.Ref('A')])
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// Test('Should CyclicExtends 7', () => {
//   Assert.IsExtends<string, any>(true)
//   const A = Type.Iterator(Type.Ref('A'))
//   const L = Type.Cyclic({ A }, 'A')
//   const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
//   Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
// })
Test('Should CyclicExtends 8', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Object({ x: Type.Ref('A') })
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// Test('Should CyclicExtends 9', () => {
//   Assert.IsExtends<string, any>(true)
//   const A = Type.Promise(Type.Ref('A'))
//   const L = Type.Cyclic({ A }, 'A')
//   const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
//   Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
// })
Test('Should CyclicExtends 10', () => {
  // note: revisit implementing Record extends tests
  Assert.IsExtends<string, any>(true)
  const A = Type.Record(Type.String(), Type.Ref('A'))
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsFalse = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsFalse(R))
})
Test('Should CyclicExtends 11', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Union([Type.Ref('A'), Type.Ref('A')])
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
Test('Should CyclicExtends 12', () => {
  Assert.IsExtends<string, any>(true)
  const A = Type.Tuple([Type.Ref('A')])
  const L = Type.Cyclic({ A }, 'A')
  const R: ExtendsResult.TExtendsTrue = Extends({}, L, Type.Unknown())
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(R))
})
// ------------------------------------------------------------------
// Infer: Cyclic References are Transformed to TAny, but can still
// partial infer on Right side.
// ------------------------------------------------------------------
Test('Should CyclicExtends 13', () => {
  const L = Type.Cyclic({ A: Type.Object({ x: Type.Ref('A') }) }, 'A')
  const R = Type.Object({ x: Type.Infer('A') })
  const X: Type.ExtendsResult.TExtendsTrue<{
    A: Type.TAny
  }> = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsTrue(Type.IsAny(X.inferred.A))
})
Test('Should CyclicExtends 14', () => {
  const L = Type.Object({ x: Type.String() })
  const R = Type.Cyclic({ A: Type.Object({ x: Type.Infer('A') }) }, 'A')
  const X: Type.ExtendsResult.TExtendsTrue<{
    A: Type.TString
  }> = Extends({}, L, R)
  Assert.IsTrue(ExtendsResult.IsExtendsTrue(X))
  Assert.IsTrue(Type.IsString(X.inferred.A))
})
