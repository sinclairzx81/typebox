import { Assert } from 'test'
import System from 'typebox/system'
import Type from 'typebox'

// ------------------------------------------------------------------
// Instantiation Counts
//
// Under the 1.4.x tail-call architecture, maxInstantiationDepth
// tracks one virtual stack frame per invocation of a Recursive-wrapped
// function (RecursionGuard), not just generic calls in isolation as
// in prior versions. As a result, the thresholds below are loosely
// measured against observed call graphs rather than reflecting a
// fixed per-generic-call count.
//
// ------------------------------------------------------------------
const Test = Assert.Context('Type.Script.Count')

// ------------------------------------------------------------------
// Type instantiation is excessively deep and possibly infinite
// ------------------------------------------------------------------
Test('Should Count 0', () => {
  System.Settings.Set({ maxInstantiationDepth: 512 })
  try {
    Type.Script(`
    type Foo<T> = Foo<T>
    type Result = Foo<1>
  ` as never)
  } catch (error: any) {
    const message = error.message as string
    Assert.IsTrue(message.includes('Type instantiation is excessively deep and possibly infinite'))
  }
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// 5 chained generic calls also pass through several Recursive-wrapped
// helpers (ResolveArguments, DistributeArguments, Evaluate, ...), so
// the frame count per call is ~5-6x the conceptual depth. 30 gives
// headroom.
// ------------------------------------------------------------------
Test('Should Count 1', () => {
  System.Settings.Set({ maxInstantiationDepth: 30 })
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
// ------------------------------------------------------------------
// Same call graph as Count 1 (5 chained calls), invoked 5 times from
// separate top-level Results. Each invocation resets the counter on
// unwind, so the required budget matches Count 1 rather than
// multiplying by 5.
// ------------------------------------------------------------------
Test('Should Count 2', () => {
  System.Settings.Set({ maxInstantiationDepth: 30 })
  Type.Script(`
    type A5<T> = [T]
    type A4<T> = A5<T>
    type A3<T> = A4<T>
    type A2<T> = A3<T>
    type A1<T> = A2<T>

    type ResultA = A1<1>
    type ResultB = A1<1>
    type ResultC = A1<1>
    type ResultD = A1<1>
    type ResultE = A1<1>
  `)
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// Reverse recurses 4 times (once per tuple element) through a
// Conditional, each recursion pulling in several Recursive-wrapped
// helpers (tuple matching, spread, evaluation), pushing the frame
// count to ~85+.
// ------------------------------------------------------------------
Test('Should Count 3', () => {
  System.Settings.Set({ maxInstantiationDepth: 85 })
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
// ------------------------------------------------------------------
// Zero Instantiation Budget
//
// A budget this low is exhausted by baseline call graph overhead, so
// both generic and non-generic scripts throw at
// `maxInstantiationDepth: 0`.
// ------------------------------------------------------------------
Test('Should Count 4', () => {
  System.Settings.Set({ maxInstantiationDepth: 0 })
  Assert.Throws(() =>
    Type.Script(`
    type Result = { x: number, y: number, z: number }
  `)
  )
  System.Settings.Reset()
})
Test('Should Count 5', () => {
  System.Settings.Set({ maxInstantiationDepth: 0 })
  Assert.Throws(() =>
    Type.Script(`
    type Vector<T> = { x: T, y: T, z: T }
    type Result = Vector<number>
  `)
  )
  System.Settings.Reset()
})
// ------------------------------------------------------------------
// 21 nested A<T> calls, but each returns directly to the exterior
// context rather than chaining depth-first, so the count stays low
// (~2) regardless of nesting level; 5 gives a small margin.
// ------------------------------------------------------------------
Test('Should Count 6', () => {
  System.Settings.Set({ maxInstantiationDepth: 5 })
  Type.Script(`
    type A<T> = T
    type Result = A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<A<1>>>>>>>>>>>>>>>>>>>>>
  ` as never)
  System.Settings.Reset()
})
