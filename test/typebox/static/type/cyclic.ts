import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// NonCyclic
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    NonCyclic: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    })
  }, 'NonCyclic')
  type Actual = Static<typeof Actual>
  // Invariant
  Assert.IsExtendsMutual<{ x: 1; y: 2; z: false }, Actual>(false)
  // Extends
  Assert.IsExtendsMutual<{ x: number; y: number; z: number }, Actual>(true)
}
// ------------------------------------------------------------------
// Deep
//
// https://github.com/sinclairzx81/typebox/issues/1356
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    Deep: Type.Object({
      deep: Type.Ref('Deep')
    })
  }, 'Deep')
  type Actual = Static<typeof Actual>
  type Expect = { deep: Actual }
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// JsonValue
//
// https://github.com/sinclairzx81/typebox/issues/1356
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    JsonValue: Type.Union([
      Type.Record(Type.String(), Type.Ref('JsonValue')),
      Type.Array(Type.Ref('JsonValue')),
      Type.String(),
      Type.Number(),
      Type.Boolean(),
      Type.Null()
    ])
  }, 'JsonValue')
  type Actual = Static<typeof Actual>
  const JsonObject = Type.Record(Type.String(), Actual)
  const JsonArray = Type.Array(Actual)
  type JsonObject = Static<typeof JsonObject>
  type JsonArray = Static<typeof JsonArray>

  // Invariant
  Assert.IsExtends<bigint, Actual>(false)
  Assert.IsExtends<bigint[], Actual>(false)
  Assert.IsExtends<[bigint], Actual>(false)
  Assert.IsExtends<{ x: bigint }, Actual>(false)
  Assert.IsExtends<{ x: bigint }, JsonObject>(false)
  Assert.IsExtends<[bigint], JsonArray>(false)

  // Extends
  Assert.IsExtends<'A', Actual>(true)
  Assert.IsExtends<1, Actual>(true)
  Assert.IsExtends<true, Actual>(true)
  Assert.IsExtends<null, Actual>(true)
  Assert.IsExtends<null[], Actual>(true)
  Assert.IsExtends<[null], Actual>(true)
  Assert.IsExtends<{ x: null }, Actual>(true)
  Assert.IsExtends<{ x: null }, JsonObject>(true)
  Assert.IsExtends<[null], JsonArray>(true)
}

// ------------------------------------------------------------------
// Mutual
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Object({
      b: Type.Ref('B')
    }),
    B: Type.Object({
      a: Type.Ref('A')
    })
  }, 'A')
  type Actual = Static<typeof Actual>
  type Expect = { b: { a: Actual } }
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
{
  const Actual = Type.Cyclic({
    A: Type.Object({
      b: Type.Ref('B')
    }),
    B: Type.Object({
      a: Type.Ref('A')
    })
  }, 'B')
  type Actual = Static<typeof Actual>
  type Expect = { a: { b: Actual } }
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// Mutual Sub Array
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Object({
      b: Type.Array(Type.Ref('B'))
    }),
    B: Type.Object({
      a: Type.Ref('A')
    })
  }, 'B')
  type Actual = Static<typeof Actual>
  type Expect = { a: { b: Actual[] } }
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Array
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Array(Type.Ref('B'))
  }, 'A')

  type Actual = Static<typeof Actual>
  type Expect = any[][]
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Object
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Object({
      next: Type.Ref('B'),
      value: Type.String()
    })
  }, 'A')

  type Actual = Static<typeof Actual>
  type Expect = { next: Expect; value: string }

  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// Recursive Object
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Object({
      value: Type.Ref('A')
    })
  }, 'A')

  type Actual = Static<typeof Actual>
  type Expect = { value: Expect }

  Assert.IsExtendsMutual<Expect, Actual>(true)
  Assert.IsExtends<{ value: { value: 1 } }, Actual>(false)
}
// ------------------------------------------------------------------
// Mutually Recursive Objects
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Object({ b: Type.Ref('B') }),
    B: Type.Object({ a: Type.Ref('A') })
  }, 'A')

  type Actual = Static<typeof Actual>
  type Expect = { b: { a: Expect } }

  Assert.IsExtendsMutual<Expect, Actual>(true)
  Assert.IsExtends<{ b: { a: { b: 1 } } }, Actual>(false)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Tuple
// ------------------------------------------------------------------
{
  const RecursiveTuple = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Tuple([Type.String(), Type.Ref('B')])
  }, 'A')

  type RecursiveTuple = Static<typeof RecursiveTuple>
  type Expected = [string, [string, any]]

  Assert.IsExtendsMutual<Expected, RecursiveTuple>(true)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Record
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Record(Type.String(), Type.Ref('B'))
  }, 'A')

  type Actual = Static<typeof Actual>
  type Expect = { [key: string]: { [key: string]: any } }

  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Union
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Union([
      Type.String(),
      Type.Array(Type.Ref('B')) // termination via logical
    ])
  }, 'A')
  type Actual = Static<typeof Actual>
  type Expect = string | (string | any[])[]
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Intersection
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Intersect([
      Type.Object({ next: Type.Ref('B') }),
      Type.Object({ kind: Type.Literal('node') })
    ])
  }, 'A')
  type Actual = Static<typeof Actual>
  type Expect = { next: { next: any; kind: 'node' }; kind: 'node' }
  Assert.IsExtends<Expect, Actual>(true)
  Assert.IsExtends<Actual, Expect>(true)
}
// ------------------------------------------------------------------
// Non-Entry Recursive Aliases
// ------------------------------------------------------------------
{
  const Actual = Type.Cyclic({
    A: Type.Ref('B'),
    B: Type.Ref('B'),
    C: Type.Ref('B'),
    D: Type.Object({
      a: Type.Ref('A'),
      b: Type.Ref('A'),
      c: Type.Ref('A')
    })
  }, 'D')
  type Actual = Static<typeof Actual>
  type Expect = { a: any; b: any; c: any }
  Assert.IsExtendsMutual<Expect, Actual>(true)
}
