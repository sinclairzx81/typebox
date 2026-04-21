import { Assert } from 'test'
import * as Type from 'typebox'

// ------------------------------------------------------------------
// Various Algorithms
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.Algorithm')

// ------------------------------------------------------------------
// Map: Elements
// ------------------------------------------------------------------
Test('Should Algorithm 1', () => {
  const T = (Type.Script(`
    type Map<T, A extends unknown[] = []> = (
      T extends [infer L, ...infer R extends unknown[]]
        ? L extends 1 ? Map<R, [...A, 'one']> :
          L extends 2 ? Map<R, [...A, 'two']> :
          L extends 3 ? Map<R, [...A, 'three']> :
          L extends 4 ? Map<R, [...A, 'four']> :
          Map<R, [...A, 'infinity']>
        : A
    )
    type T = Map<[1, 2, 3, 4, 5]>
  ` as never) as any).T

  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 'one')
  Assert.IsEqual(T.items[1].const, 'two')
  Assert.IsEqual(T.items[2].const, 'three')
  Assert.IsEqual(T.items[3].const, 'four')
  Assert.IsEqual(T.items[4].const, 'infinity')
})
// ------------------------------------------------------------------
// Filter: Elements
// ------------------------------------------------------------------
Test('Should Algorithm 2', () => {
  const T = (Type.Script(`
    type Filter<T, A extends unknown[] = []> = (
      T extends [infer L, ...infer R extends unknown[]]
        ? L extends boolean 
          ? Filter<R, A>
          : Filter<R, [...A, L]>
        : A
    )
    type T = Filter<[1, true, 2, false, 3, true, 4]>
  ` as never) as any).T

  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 1)
  Assert.IsEqual(T.items[1].const, 2)
  Assert.IsEqual(T.items[2].const, 3)
  Assert.IsEqual(T.items[3].const, 4)
})
// ------------------------------------------------------------------
// Reduce: Properties
// ------------------------------------------------------------------
Test('Should Algorithm 3', () => {
  const T = (Type.Script(`
    type Reduce<T, A = []> = (
      T extends [infer L, ...infer R extends unknown[]]
        ? Reduce<R, A & { [_ in L ]: null }>
        : Evaluate<A>
    )
    type T = Reduce<['A', 'B', 'C', 'D']>
  ` as never) as any).T

  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNull(T.properties.A))
  Assert.IsTrue(Type.IsNull(T.properties.B))
  Assert.IsTrue(Type.IsNull(T.properties.C))
  Assert.IsTrue(Type.IsNull(T.properties.D))
})
// ------------------------------------------------------------------
// Reverse: Destructure Left
// ------------------------------------------------------------------
Test('Should Algorithm 4', () => {
  const T = Type.Script(`
    type Reverse<T, A extends unknown[] = []> = (
      T extends [...infer L extends unknown[], infer R]
        ? Reverse<L, [...A, R]>
        : A
    )
    type Result = Reverse<[1, 2, 3, 4]>
  `).Result

  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 4)
  Assert.IsEqual(T.items[1].const, 3)
  Assert.IsEqual(T.items[2].const, 2)
  Assert.IsEqual(T.items[3].const, 1)
})
Test('Should Algorithm 5', () => {
  const T = Type.Script(`
    type Reverse<T, A = []> = (
      T extends [...infer L, infer R]
        ? Reverse<L, [...A, R]>
        : A
    )
    type Result = Reverse<[1, 2, 3, 4]>
  `).Result
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 4)
  Assert.IsEqual(T.items[1].const, 3)
  Assert.IsEqual(T.items[2].const, 2)
  Assert.IsEqual(T.items[3].const, 1)
})
// ------------------------------------------------------------------
// Reverse: Destructure Right
// ------------------------------------------------------------------
Test('Should Algorithm 6', () => {
  const T = Type.Script(`
    type Reverse<T, A extends unknown[] = []> = (
      T extends [infer L, ...infer R extends unknown[]]
        ? Reverse<R, [L, ...A]>
        : A
    )
    type Result = Reverse<[1, 2, 3, 4]>
  `).Result

  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 4)
  Assert.IsEqual(T.items[1].const, 3)
  Assert.IsEqual(T.items[2].const, 2)
  Assert.IsEqual(T.items[3].const, 1)
})
Test('Should Algorithm 7', () => {
  const T = Type.Script(`
    type Reverse<T, A = []> = (
      T extends [infer L, ...infer R]
        ? Reverse<R, [L, ...A]>
        : A
    )
    type Result = Reverse<[1, 2, 3, 4]>
  `).Result
  Assert.IsTrue(Type.IsTuple(T))
  Assert.IsEqual(T.items[0].const, 4)
  Assert.IsEqual(T.items[1].const, 3)
  Assert.IsEqual(T.items[2].const, 2)
  Assert.IsEqual(T.items[3].const, 1)
})
// ------------------------------------------------------------------
// Advanced: Find Indices (Key Mismatch on 8)
// ------------------------------------------------------------------
Test('Should Algorithm 8', () => {
  const T = Type.Script(`
    type Values = [3, 2, 6, 1, 7, 3, 10, 4];

    type FindIndex<
      T extends unknown[],
      V,
    > = keyof {[K in keyof T as T[K] extends V ? K : never]: '📦'};

    type X = FindIndex<Values, 7>
    type Y = FindIndex<Values, 3>
  `)
  const X: Type.TLiteral<'4'> = T.X
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const Y /*: Type.TUnion<[Type.TLiteral<'0'>, Type.TLiteral<'5'>]> */ = T.Y
  Assert.IsTrue(Type.IsLiteral(X))
  Assert.IsEqual(X.const, 4) // mismatch
  Assert.IsTrue(Type.IsUnion(Y))
  Assert.IsEqual(Y.anyOf[0].const, 0) // mismatch
  Assert.IsEqual(Y.anyOf[1].const, 5) // mismatch
})

Test('Should Algorithm 9', () => {
  const T = Type.Script(`
    type Values = [3, 2, 6, 1, 7, 3, 10, 4]
    type TupleToIndexValueUnion<T extends unknown[]> = {
      [K in keyof T]: [K, T[K]]
    }[number]

    type FindIndex<
      T extends unknown[],
      V,
    > = Extract<TupleToIndexValueUnion<T>, [string, V]>[0]

    type X = FindIndex<Values, 7>
    type Y = FindIndex<Values, 3>
  `)
  const X: Type.TLiteral<'4'> = T.X
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const Y /*: Type.TUnion<[Type.TLiteral<'0'>, Type.TLiteral<'5'>]> */ = T.Y
  Assert.IsTrue(Type.IsLiteral(X))
  Assert.IsEqual(X.const, '4')
  Assert.IsTrue(Type.IsUnion(Y))
  Assert.IsEqual(Y.anyOf[0].const, '0')
  Assert.IsEqual(Y.anyOf[1].const, '5')
})
Test('Should Algorithm 10', () => {
  const T = Type.Script(`
    type Values = [3, 2, 6, 1, 7, 3, 10, 4]
    
    type FindIndex<T extends unknown[], V, Result extends number = never> = (
      T extends [...infer Left, infer Right]
        ? Right extends V
          ? FindIndex<Left, V, Result | Left['length']>
          : FindIndex<Left, V, Result>
        : Evaluate<Result>
    )

    type X = FindIndex<Values, 7>
    type Y = FindIndex<Values, 3>
  `)
  const X: Type.TLiteral<4> = T.X
  const Y: Type.TUnion<[Type.TLiteral<5>, Type.TLiteral<0>]> = T.Y
  Assert.IsTrue(Type.IsLiteral(X))
  Assert.IsEqual(X.const, 4)
  Assert.IsTrue(Type.IsUnion(Y))
  Assert.IsEqual(Y.anyOf[0].const, 5)
  Assert.IsEqual(Y.anyOf[1].const, 0)
})
Test('Should Algorithm 11', () => {
  const T = Type.Script(`
    type Values = [3, 2, 6, 1, 7, 3, 10, 4]
    
    type WithIndex<T extends unknown[]> = {
      [K in keyof T]: [K, T[K]]
    }[number]

    type FindIndices<T extends unknown[], V> =
      Extract<WithIndex<T>, [string, V]>[0]

    type X = FindIndices<Values, 7>
    type Y = FindIndices<Values, 1 | 3>
  `)
  const X: Type.TLiteral<'4'> = T.X
  // CACHE | TYPESCRIPT TYPE ID ORDER ISSUE
  const Y /*: Type.TUnion<[Type.TLiteral<"0">, Type.TLiteral<"3">, Type.TLiteral<"5">]> */ = T.Y
  Assert.IsTrue(Type.IsLiteral(X))
  Assert.IsEqual(X.const, '4')
  Assert.IsTrue(Type.IsUnion(Y))
  Assert.IsEqual(Y.anyOf[0].const, '0')
  Assert.IsEqual(Y.anyOf[1].const, '3')
  Assert.IsEqual(Y.anyOf[2].const, '5')
})
