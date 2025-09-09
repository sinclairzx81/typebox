import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Generic')

// ------------------------------------------------------------------
// Generic Parameter | Constraints
// ------------------------------------------------------------------
Test('Should Generic 1', () => {
  const Nullable = Type.Script(`<T extends unknown = unknown> = T | null`)
  Assert.IsTrue(Type.IsGeneric(Nullable))
  Assert.IsEqual(Nullable.parameters.length, 1)

  const Result = Type.Script({ Nullable }, `Nullable<string>`)
  Assert.IsTrue(Type.IsUnion(Result))
  Assert.IsTrue(Type.IsString(Result.anyOf[0]))
  Assert.IsTrue(Type.IsNull(Result.anyOf[1]))
})
Test('Should Generic 2', () => {
  const Nullable = Type.Script(`<T extends unknown> = T | null`)
  Assert.IsTrue(Type.IsGeneric(Nullable))
  Assert.IsEqual(Nullable.parameters.length, 1)

  const Result = Type.Script({ Nullable }, `Nullable<string>`)
  Assert.IsTrue(Type.IsUnion(Result))
  Assert.IsTrue(Type.IsString(Result.anyOf[0]))
  Assert.IsTrue(Type.IsNull(Result.anyOf[1]))
})
Test('Should Generic 3', () => {
  const Nullable = Type.Script(`<T = unknown> = T | null`)
  Assert.IsTrue(Type.IsGeneric(Nullable))
  Assert.IsEqual(Nullable.parameters.length, 1)
  const Result = Type.Script({ Nullable }, `Nullable<string>`)
  Assert.IsTrue(Type.IsUnion(Result))
  Assert.IsTrue(Type.IsString(Result.anyOf[0]))
  Assert.IsTrue(Type.IsNull(Result.anyOf[1]))
})
// ------------------------------------------------------------------
// Recursive: Tuple
// ------------------------------------------------------------------
Test('Should Generic 4', () => {
  const Reverse = Type.Script(`<List, Result extends unknown[] = []> = (
    List extends [infer Left, ...infer Right]
      ? Reverse<Right, [Left, ...Result]>
      : Result
  )`)
  Assert.IsTrue(Type.IsGeneric(Reverse))
  Assert.IsEqual(Reverse.parameters.length, 2)

  const Result: Type.TTuple<[Type.TLiteral<4>, Type.TLiteral<3>, Type.TLiteral<2>, Type.TLiteral<1>]> = Type.Script({ Reverse }, `Reverse<[1, 2, 3, 4]>`)
  Assert.IsEqual(Result.items[0].const, 4)
  Assert.IsEqual(Result.items[1].const, 3)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 1)
})
Test('Should Generic 5', () => {
  const M = Type.Script(`
    type Reverse<List, Result extends unknown[] = []> = (
      List extends [infer Left, ...infer Right]
        ? Reverse<Right, [Left, ...Result]>
        : Result
      )
    type Result = Reverse<[1, 2, 3, 4]>
  `)
  Assert.IsTrue(Type.IsGeneric(M.Reverse))
  Assert.IsEqual(M.Reverse.parameters.length, 2)

  const Result: Type.TTuple<[Type.TLiteral<4>, Type.TLiteral<3>, Type.TLiteral<2>, Type.TLiteral<1>]> = M.Result
  Assert.IsEqual(Result.items[0].const, 4)
  Assert.IsEqual(Result.items[1].const, 3)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 1)
})

// ------------------------------------------------------------------
// Recursive: Mapped Object
// ------------------------------------------------------------------
Test('Should Generic 6', () => {
  const DeepPartial = Type.Script(`<T extends object> = {
    [K in keyof T]?: T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
  }`)
  Assert.IsTrue(Type.IsGeneric(DeepPartial))
  Assert.IsEqual(DeepPartial.parameters.length, 1)
  const Result: Type.TObject<{
    x: Type.TOptional<
      Type.TObject<{
        y: Type.TOptional<
          Type.TObject<{
            z: Type.TOptional<Type.TLiteral<1>>
          }>
        >
      }>
    >
  }> = Type.Script(
    { DeepPartial },
    `DeepPartial<{
    x: {
      y: {
        z: 1
      }
    }  
  }>`
  )
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsOptional(Result.properties.x))
  Assert.IsTrue(Type.IsOptional(Result.properties.x.properties.y))
  Assert.IsTrue(Type.IsOptional(Result.properties.x.properties.y.properties.z))
})
// ------------------------------------------------------------------
// Non Tail Recursive
// ------------------------------------------------------------------
Test('Should Generic 6', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<1>, Type.TLiteral<1>]> = Type.Script(`
    type C<T> = [T, T, T]
    type B<T> = C<T>
    type A<T> = B<T>  
    type T = A<1>
  `).T
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 1)
  Assert.IsEqual(T.items[2].const, 1)
})
// ------------------------------------------------------------------
// Non Resolvable Call Target
// ------------------------------------------------------------------
Test('Should Generic 7', () => {
  const T: Type.TCall<Type.TRef<'X'>, [Type.TLiteral<1>]> = Type.Script(`type T = X<1>`).T
  Assert.IsTrue(Type.IsCall(T))
  Assert.IsEqual(T.target.$ref, 'X')
  Assert.IsEqual(T.arguments[0].const, 1)
})
Test('Should Generic 8', () => {
  // deferred resolution: calls instantiate if they see a Generic (X) on the context
  const T: Type.TCall<Type.TRef<'X'>, [Type.TLiteral<1>]> = Type.Script(`type T = X<1>`).T
  const X = Type.Generic([Type.Parameter('T')], Type.Ref('T'))
  const S = Type.Script({ T, X }, `T`)
  Assert.IsTrue(Type.IsLiteral(S))
  Assert.IsEqual(S.const, 1)
})
// ------------------------------------------------------------------
// Deep Stack
// ------------------------------------------------------------------
Test('Should Generic 9', () => {
  const T: Type.TTuple<[Type.TLiteral<32>, Type.TLiteral<32>]> = Type.Script(`
    type D<T> = [T, T]
    type C<T> = D<T>
    type B<T> = C<T>
    type A<T> = B<T>
    type T = A<32>
  `).T
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 32)
  Assert.IsEqual(T.items[1].const, 32)
})
Test('Should Generic 10', () => {
  const T: Type.TTuple<[
    Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>]>,
    Type.TTuple<[Type.TLiteral<3>, Type.TLiteral<4>]>
  ]> = Type.Script(`
    type C<T> = T
    type A<L, R> = [L, R]
    type T = A<A<C<1>, C<2>>, A<C<3>, C<4>>>
  `).T
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].items[0].const, 1)
  Assert.IsEqual(T.items[0].items[1].const, 2)
  Assert.IsEqual(T.items[1].items[0].const, 3)
  Assert.IsEqual(T.items[1].items[1].const, 4)
})
// ------------------------------------------------------------------
// Defer Arguments
// ------------------------------------------------------------------
Test('Should Generic 11', () => {
  const T: Type.TCall<Type.TRef<'X'>, [Type.TLiteral<1>]> = Type.Script(`
    type B<T> = X<T>
    type A<T> = B<T>
    type T = A<1>
  `).T
  Assert.IsTrue(Type.IsCall(T))
  Assert.IsEqual(T.target.$ref, 'X')
  Assert.IsEqual(T.arguments[0].const, 1)
})
// ------------------------------------------------------------------
// Partial Call Instantiation
// ------------------------------------------------------------------
Test('Should Generic 12', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TCall<Type.TRef<'X'>, [Type.TLiteral<2>]>]> = Type.Script(`
    type B<T, S> = [T, S]
    type A<T> = B<T, X<2>>
    type T = A<1>
  `).T
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)

  Assert.IsTrue(Type.IsCall(T.items[1]))
  Assert.IsEqual(T.items[1].target.$ref, 'X')
  Assert.IsEqual(T.items[1].arguments[0].const, 2)
})
// ------------------------------------------------------------------
// Constraints
// ------------------------------------------------------------------
Test('Should Generic 13', () => {
  const T = Type.Script(`
    type A<T extends string> = T
    type T = A<'hello'>
  `).T
  Assert.IsEqual(T.const, 'hello')
})
Test('Should Generic 14', () => {
  Assert.Throws(() =>
    Type.Script(`
    type A<T extends string> = T
    type X = A<1>
  `)
  )
})
// ------------------------------------------------------------------
// Computed Parameters
// ------------------------------------------------------------------
Test('Should Generic 15', () => {
  const T: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<1>]> = Type.Script(`
    type A<T, 
      A = T,
      B = [A, A]
    > = B
    type T = A<1>
  `).T
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 1)
})
Test('Should Generic 16', () => {
  const { X, Y } = Type.Script(`
    type A<T, 
      R = T extends 1 ? 'yes' : 'no'
    > = R
    type X = A<1>
    type Y = A<2>
  `)
  Assert.IsEqual(X.const, 'yes')
  Assert.IsEqual(Y.const, 'no')
})
// ------------------------------------------------------------------
// No-Infer: Deep Stack
// ------------------------------------------------------------------
Test('Should Generic 17', () => {
  const T = (Type.Script(`
    type D<T> = T
    type C<T> = D<T>
    type B<T> = C<T>
    type A<T> = B<T>
    type Reverse<List, Result extends unknown[] = []> = (
      List extends [infer Left, ...infer Right extends unknown[]]
        ? Reverse<Right, [A<Left>, ...Result]>
        : Result
    )
    type T = Reverse<[1, 2, 3, 4]>
  ` as never) as any).T
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 4)
  Assert.IsEqual(T.items[1].const, 3)
  Assert.IsEqual(T.items[2].const, 2)
  Assert.IsEqual(T.items[3].const, 1)
})
// ------------------------------------------------------------------
// Generic Constraints
// ------------------------------------------------------------------
Test('Should Generic 18', () => {
  const T: Type.TObject<{
    value: Type.TObject<{
      x: Type.TLiteral<1>
      y: Type.TLiteral<2>
      z: Type.TLiteral<3>
    }>
  }> = Type.Script(`
    interface Vector {
      x: number
      y: number
      z: number
    }  
    interface Base<T extends Vector> { value: T }

    type T = Base<{ x: 1, y: 2, z: 3 }>
  `).T
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.properties.value.properties.x.const, 1)
  Assert.IsEqual(T.properties.value.properties.y.const, 2)
  Assert.IsEqual(T.properties.value.properties.z.const, 3)
})
Test('Should Generic 19', () => {
  const X = Type.Script(`
    interface Vector {
      x: number
      y: number
      z: number
    }  
    interface Base<T extends Vector | null> { value: T }

    type T = Base<{ x: 1, y: 2, z: 3 }>
    type S = Base<null>
  `)
  const T: Type.TObject<{
    value: Type.TObject<{
      x: Type.TLiteral<1>
      y: Type.TLiteral<2>
      z: Type.TLiteral<3>
    }>
  }> = X.T
  const S: Type.TObject<{
    value: Type.TNull
  }> = X.S
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.properties.value.properties.x.const, 1)
  Assert.IsEqual(T.properties.value.properties.y.const, 2)
  Assert.IsEqual(T.properties.value.properties.z.const, 3)
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNull(S.properties.value))
})
Test('Should Generic 20', () => {
  const T: Type.TObject<{
    value: Type.TObject<{
      x: Type.TLiteral<1>
      y: Type.TLiteral<2>
      z: Type.TLiteral<3>
    }>
  }> = Type.Script(`
    interface Vector<T> {
      x: T
      y: T
      z: T
    }
    interface Base<T extends Vector<number>> { value: T }
    type T = Base<{ x: 1, y: 2, z: 3 }>
  `).T
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.properties.value.properties.x.const, 1)
  Assert.IsEqual(T.properties.value.properties.y.const, 2)
  Assert.IsEqual(T.properties.value.properties.z.const, 3)
})
// ------------------------------------------------------------------
// Generic Constraints
// ------------------------------------------------------------------
Test('Should Generic 21', () => {
  Assert.Throws(() =>
    Type.Script(`
    interface Vector<T> {
      x: T
      y: T
      z: T
    }  
    interface Base<T extends Vector> { value: T }

    type T = Base<1>
  `)
  )
})
Test('Should Generic 22', () => {
  Assert.Throws(() =>
    Type.Script(`
    interface Vector<T> {
      x: T
      y: T
      z: T
    }  
    interface Base<T extends Vector<string>> { value: T }
    type T = Base<{ x: 1, y: 2, z: 3 }>
  `)
  )
})
