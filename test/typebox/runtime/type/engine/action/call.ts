import * as Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Type.Engine.Call')

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
Test('Should Call 1', () => {
  const G = Type.Generic(
    [Type.Parameter('T')],
    Type.Object({
      x: Type.Ref('T'),
      y: Type.Ref('T'),
      z: Type.Ref('T')
    })
  )
  const A: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Call(G, [Type.Number()])

  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsNumber(A.properties.z))
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should Call 2', () => {
  const G = Type.Generic(
    [Type.Parameter('T')],
    Type.Object({
      x: Type.Ref('T'),
      y: Type.Ref('T'),
      z: Type.Ref('T')
    })
  )
  const D: Type.TCall<Type.TRef<'G'>, [Type.TNumber]> = Type.Call(Type.Ref('G'), [Type.Number()])

  const A = Type.Instantiate({ G }, D)
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsNumber(A.properties.z))
})
// ------------------------------------------------------------------
// Invalid Target Is Never
// ------------------------------------------------------------------
Test('Should Call 3', () => {
  const A: Type.TCall<Type.TNumber, [Type.TNumber]> = Type.Call(Type.Number(), [Type.Number()])
  Assert.IsTrue(Type.IsCall(A))
  Assert.IsTrue(Type.IsNumber(A.target))
  Assert.IsTrue(Type.IsNumber(A.arguments[0]))
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Call 4', () => {
  const G = Type.Generic(
    [Type.Parameter('T')],
    Type.Object({
      x: Type.Ref('T'),
      y: Type.Ref('T'),
      z: Type.Ref('T')
    })
  )
  const T: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Call(G, [Type.Number()])
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsTrue(Type.IsNumber(T.properties.z))
})
Test('Should Call 5', () => {
  const G = Type.Generic(
    [
      Type.Parameter('T'),
      Type.Parameter('U')
    ],
    Type.Tuple([
      Type.Ref('T'),
      Type.Ref('U')
    ])
  )

  const T: Type.TTuple<[Type.TNumber, Type.TString]> = Type.Call(G, [Type.Number(), Type.String()])
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsTrue(Type.IsNumber(T.items[0]))
  Assert.IsTrue(Type.IsString(T.items[1]))
})
Test('Should Call 6 (Script 1)', () => {
  const Reverse = Type.Script(`<List, Result extends unknown[] = []> =
    List extends [infer Left, ...infer Right extends unknown[]] 
      ? Reverse<Right, [Left, ...Result]>
      : Result
  `)
  const T: Type.TTuple<[
    Type.TLiteral<5>,
    Type.TLiteral<4>,
    Type.TLiteral<3>,
    Type.TLiteral<2>,
    Type.TLiteral<1>
  ]> = Type.Script({ Reverse }, `Reverse<[1, 2, 3, 4, 5]>`)

  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 5)
  Assert.IsEqual(T.items[1].const, 4)
  Assert.IsEqual(T.items[2].const, 3)
  Assert.IsEqual(T.items[3].const, 2)
  Assert.IsEqual(T.items[4].const, 1)
})
Test('Should Call 7 (Script 2)', () => {
  const DeepPartial = Type.Script(`<T> = {
    [K in keyof T]?: T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]  
  }`)
  const T: Type.TObject<{
    x: Type.TOptional<
      Type.TObject<{
        y: Type.TOptional<
          Type.TObject<{
            z: Type.TOptional<Type.TNumber>
          }>
        >
      }>
    >
  }> = Type.Script(
    { DeepPartial },
    `DeepPartial<{
    x: {
      y: {
        z: number
      }
    }  
  }>`
  )
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsObject(T.properties.x))
  Assert.IsTrue(Type.IsOptional(T.properties.x))

  Assert.IsTrue(Type.IsObject(T.properties.x.properties.y))
  Assert.IsTrue(Type.IsOptional(T.properties.x.properties.y))

  Assert.IsTrue(Type.IsNumber(T.properties.x.properties.y.properties.z))
  Assert.IsTrue(Type.IsOptional(T.properties.x.properties.y.properties.z))
})
Test('Should Call 8 (Non-Resolvable-Target)', () => {
  const C = Type.Call(Type.Ref('A'), [Type.String()])
  const T: Type.TCall<Type.TRef<'A'>, [Type.TString]> = Type.Instantiate({}, C)
  Assert.IsTrue(Type.IsCall(T))
})
Test('Should Call 9 (Target-Not-Generic)', () => {
  const C = Type.Call(Type.Ref('A'), [Type.String()])
  const T: Type.TCall<Type.TRef<'A'>, [Type.TString]> = Type.Instantiate({ A: Type.String() }, C)
  Assert.IsTrue(Type.IsCall(T))
  Assert.IsEqual(T.target.$ref, 'A')
  Assert.IsTrue(Type.IsString(T.arguments[0]))
})
Test('Should Call 10 (Target-Not-Generic)', () => {
  const X = Type.Script(`<T> = [T]`)
  const Y = Type.Script(`<T> = {
    x: X<1>,
    y: X<2>,
    z: X<T>,
    w: T
  }`)
  const T = Type.Script({ X, Y }, `Y<3>`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsTuple(T.properties.x))
  Assert.IsTrue(Type.IsTuple(T.properties.y))
  Assert.IsTrue(Type.IsTuple(T.properties.z))
  Assert.IsEqual(T.properties.x.items[0].const, 1)
  Assert.IsEqual(T.properties.y.items[0].const, 2)
  Assert.IsEqual(T.properties.z.items[0].const, 3)
  Assert.IsEqual(T.properties.w.const, 3)
})
// ------------------------------------------------------------------
// With Constraints
// ------------------------------------------------------------------
Test('Should Call 11', () => {
  const G = Type.Generic([Type.Parameter('T', Type.Number())], Type.String())
  Assert.Throws(() => Type.Call(G, [Type.String()]))
})
