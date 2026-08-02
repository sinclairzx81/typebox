# Script.Restrict

TypeBox Script is based on TypeScript and is similarly Turing-complete. As with anything exhibiting Turing completeness, TypeBox permits arbitrarily complex logic that may take significant time to compute, as well as incur a memory/GC utilization cost for any types instantiated within.

This section presents mechanisms to bound generic instantiation, primarily for applications that need to process string-encoded types originating from untrusted sources, such as the internet or generative AI.

## Important

> ⚠️ For the vast majority of applications, developers should avoid evaluating string-encoded types from untrusted or remote sources. While TypeBox does offer mechanisms such as `maxInstantiationCount` to bound generic instantiation to a fixed count, the use of such mechanisms should be the exception rather than the rule. Developers should exercise caution.

## Default Instantiation Limits

TypeBox adopts techniques similar to TypeScript to bound generic instantiation; albeit adjusted for runtime workloads. It has a default instantiation limit of 128 generic calls per top-level generic instantiation context. Scripts that exceed this limit will throw a TS-like "Type instantiation is excessively deep and possibly infinite" exception.

## Max Instantiation Count

TypeBox provides a `maxInstantiationCount` configuration which is available via [System Settings](/typebox/#/docs/system/1_settings). This configuration can be overridden to allow higher instantiation counts if necessary, or set to `0` to disable generic calls entirely.

## Disable Generics

It is possible to disable generic calls by setting `maxInstantiationCount` to 0. This disables all generic calls but retains other directed syntax such as mapped and conditional types, and ensures type instantiation is linear, O(N), with respect to input size. This setting is the recommended configuration for loading untrusted scripts, however it should also be paired with a string `length` check to ensure the script is of a reasonable length.

```typescript
import System from 'typebox/system'
import Type from 'typebox'

// ------------------------------------------------------------------
// No generics!
// ------------------------------------------------------------------

System.Settings.Set({ maxInstantiationCount: 0 })

// ------------------------------------------------------------------
// This is fine
// ------------------------------------------------------------------
Type.Script(`
  type Result = {
    x: number
    y: number
    z: number
  }
`)
// ------------------------------------------------------------------
// This is also fine
// ------------------------------------------------------------------
Type.Script(`
  type Result = {
    [K in 'x' | 'y' | 'z']: 
      K extends 'x' ? number :
      K extends 'y' ? string :
      K extends 'z' ? boolean :
      never
  }
`)

// ------------------------------------------------------------------
// Error: This will throw due to Vector<T> call
// ------------------------------------------------------------------
Type.Script(`
  type Vector<T> = { x: T, y: T, z: T }
  type Result = Vector<number>
`) // error: Type instantiation is excessively deep and possibly infinite
```

## Constrained Generics

TypeBox tracks an instantiation counter for each generic instantiation context. In the following code, calling `A1` increments the counter to 1, continuing through to `A5`. The counter resets to `0` once the top-level call completes, so sibling calls such as `ResultA` through `ResultE` each receive a fresh budget rather than sharing one. The `maxInstantiationCount` setting can be thought of as a per-context call budget, bounding the number of generic instantiations reachable from any single top-level generic call.

```typescript
import System from 'typebox/system'
import Type from 'typebox'

// ------------------------------------------------------------------
// The following is allowed as the A1 - A5 does not exceed the
// maxInstantiationCount of 5.
// ------------------------------------------------------------------
System.Settings.Set({ maxInstantiationCount: 5 })
Type.Script(`
  type A5<T> = [T]
  type A4<T> = A5<T>   // count = 5
  type A3<T> = A4<T>   // count = 4
  type A2<T> = A3<T>   // count = 3
  type A1<T> = A2<T>   // count = 2
  type Result = A1<1>  // count = 1
`)
// ------------------------------------------------------------------
// The following is allowed as each call to A1 is bound to a maximum
// call limit of 5.
// ------------------------------------------------------------------
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
// ------------------------------------------------------------------
// The following is disallowed as maxInstantiationCount is set
// to 4, with the error thrown when attempting to call A5.
// ------------------------------------------------------------------
System.Settings.Set({ maxInstantiationCount: 4 })
Type.Script(`
  type A5<T> = [T]
  type A4<T> = A5<T>   // count = 5
  type A3<T> = A4<T>   // count = 4
  type A2<T> = A3<T>   // count = 3
  type A1<T> = A2<T>   // count = 2
  type Result = A1<1>  // count = 1
`) // error: Type instantiation is excessively deep and possibly infinite
```