import { Assert } from 'test'
import System from 'typebox/system'
import Type from 'typebox'

// ------------------------------------------------------------------
// These test assert Instantiation Depths
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.Count')

// ------------------------------------------------------------------
// Type instantiation is excessively deep and possibly infinite
// ------------------------------------------------------------------
Test('Should Count 0', () => {
  try {
    Type.Script(`
    type Foo<T> = Foo<T>
    type Result = Foo<1>
  `)
  } catch (error: any) {
    const message = error.message as string
    Assert.IsTrue(message.includes('Type instantiation is excessively deep and possibly infinite'))
  }
})
// ------------------------------------------------------------------
// Instantiation Counts
// ------------------------------------------------------------------
Test('Should Count 1', () => {
  System.Settings.Set({ maxInstantiationCount: 5 })
  Type.Script(`
    type A1<T> = [T]
    type A2<T> = A1<T>   // depth 5
    type A3<T> = A2<T>   // depth 4
    type A4<T> = A3<T>   // depth 3
    type A5<T> = A4<T>   // depth 2
    type Result = A5<1>  // depth 1
  `)
  System.Settings.Reset()
})
Test('Should Count 2', () => {
  System.Settings.Set({ maxInstantiationCount: 5 })
  Type.Script(`
    type A5<T> = [T]
    type A4<T> = A5<T>   // count = 5
    type A3<T> = A4<T>   // count = 4
    type A2<T> = A3<T>   // count = 3
    type A1<T> = A2<T>   // count = 2

    type ResultA = A1<1>  // count = 1
    type ResultB = A1<1>  // count = 1
    type ResultC = A1<1>  // count = 1
    type ResultD = A1<1>  // count = 1
    type ResultE = A1<1>  // count = 1
  `)
  System.Settings.Reset()
})
Test('Should Count 3', () => {
  System.Settings.Set({ maxInstantiationCount: 4 })
  Assert.Throws(() =>
    Type.Script(`
    type A1<T> = [T]
    type A2<T> = A1<T>   // depth 5
    type A3<T> = A2<T>   // depth 4
    type A4<T> = A3<T>   // depth 3
    type A5<T> = A4<T>   // depth 2
    type Result = A5<1>  // depth 1
  `)
  )
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Recursive Instantiation Counts
// ------------------------------------------------------------------
Test('Should Count 4', () => {
  System.Settings.Set({ maxInstantiationCount: 5 })
  Type.Script(`
    type Reverse<T extends unknown[], Result extends unknown[] = []> = (
        T extends [infer Left, ...infer Right]
        ? Reverse<Right, [Left, ...Result]>
        : Result
    )
    type Result = Reverse<[1, 2, 3, 4]>
  `)
  System.Settings.Reset()
})
Test('Should Count 5', () => {
  System.Settings.Set({ maxInstantiationCount: 4 })
  Assert.Throws(() =>
    Type.Script(`
    type Reverse<T extends unknown[], Result extends unknown[] = []> = (
        T extends [infer Left, ...infer Right]
        ? Reverse<Right, [Left, ...Result]>
        : Result
    )
    type Result = Reverse<[1, 2, 3, 4]>
  `)
  )
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Generics Disabled
// ------------------------------------------------------------------
Test('Should Count 6', () => {
  System.Settings.Set({ maxInstantiationCount: 0 })
  Type.Script(`
    type Result = { x: number, y: number, z: number }
  `)
  System.Settings.Reset()
})
Test('Should Count 7', () => {
  System.Settings.Set({ maxInstantiationCount: 0 })
  Assert.Throws(() =>
    Type.Script(`
    type Vector<T> = { x: T, y: T, z: T }
    type Result = Vector<number>
  `)
  )
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Single-Depth-Nested-Instantiation
//
// Nested instantiation of the following form does not exceed
// count = 1 as each is call is returned to the exterior context.
// We also observe the same behavior in TypeScript.
//
// ------------------------------------------------------------------
Test('Should Count 8', () => {
  System.Settings.Set({ maxInstantiationCount: 1 })
  Type.Script(`
    type A<T> = T
    type Result = A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<1>>>>>>>>>>>>>>>>>>>>>
  ` as never)
  System.Settings.Reset()
})
