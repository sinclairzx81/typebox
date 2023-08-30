import { Type, Static } from '@sinclair/typebox'

// ------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------

{ // Case A: Union Literal
  const C = Type.Union([
    Type.Literal('hello'),
    Type.Literal(42),
    Type.Literal(43)
  ])
  const R = Type.Record(C, Type.String())
  type R = Static<typeof R> // ok
}

{ // Case B: Object Literal Pattern
  const E = Type.Enum({
    x: 'hello',
    y: 42,
    z: 43
  })
  const R = Type.Record(E, Type.String())
  type R = Static<typeof R> // ok
}

{ // Case C: Enum Pattern
  enum Foo {
    A = 'hello',
    B = 42,
    C
  }
  const E = Type.Enum(Foo)
  const R = Type.Record(E, Type.String())
  type R = Static<typeof R> // ok
}





