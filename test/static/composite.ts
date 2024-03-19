import { Expect } from './assert'
import { Type, TOptional, TObject, TUnion, TIntersect, TNumber, TString, TBoolean } from '@sinclair/typebox'

// ----------------------------------------------------------------------------
// Overlapping - Non Varying
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: number
  }>()
}
// ----------------------------------------------------------------------------
// Overlapping - Varying
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.String(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: never
  }>()
}
// ----------------------------------------------------------------------------
// Overlapping Single Optional
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: number
  }>()
}
// ----------------------------------------------------------------------------
// Overlapping All Optional (Deferred)
//
// Note for: https://github.com/sinclairzx81/typebox/issues/419
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const T = Type.Composite([A, B])
  Expect(T).ToStatic<{
    A?: number | undefined
  }>()
}
{
  const A = Type.Object({
    A: Type.Optional(Type.Number()),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])
  Expect(T).ToStatic<{
    A: number
  }>()
}
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    A: Type.Number(),
  })
  const T = Type.Composite([A, B])
  Expect(T).ToStatic<{
    A: number
  }>()
}
// ----------------------------------------------------------------------------
// Distinct Properties
// ----------------------------------------------------------------------------
{
  const A = Type.Object({
    A: Type.Number(),
  })
  const B = Type.Object({
    B: Type.Number(),
  })
  const T = Type.Composite([A, B])

  Expect(T).ToStatic<{
    A: number
    B: number
  }>()
}
// ----------------------------------------------------------------------------
// Intersection Quirk
//
// TypeScript has an evaluation quirk for the following case where the first
// type evaluates the sub property as never, but the second evaluates the
// entire type as never. There is probably a reason for this behavior, but
// TypeBox supports the former evaluation.
//
// { x: number } & { x: string }  -> { x: number } & { x: string } => { x: never }
// { x: number } & { x: boolean } ->  never -> ...
// ----------------------------------------------------------------------------
{
  // prettier-ignore
  const T: TObject<{
    x: TIntersect<[TNumber, TBoolean]>
  }> = Type.Composite([
    Type.Object({ x: Type.Number() }),
    Type.Object({ x: Type.Boolean() })
  ])
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
{
  const T: TObject<{
    x: TNumber;
    y: TNumber;
    z: TNumber;
  }> = Type.Composite([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() }),
    ]),
    Type.Intersect([
      Type.Object({ z: Type.Number() })
    ])
  ])
}
// prettier-ignore
{
  const T: TObject<{
    x: TIntersect<[TNumber, TNumber]>;
    y: TIntersect<[TNumber, TNumber]>;
  }> = Type.Composite([
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() }),
    ]),
    Type.Intersect([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() }),
    ])
  ])
}
// prettier-ignore
{
  const T: TObject<{
    x: TIntersect<[TNumber, TNumber]>;
  }> = Type.Composite([
    Type.Intersect([
      Type.Object({ x: Type.Optional(Type.Number()) }),
      Type.Object({ x: Type.Number() }),
    ])
  ])
}
// prettier-ignore
{
  const T: TObject<{
    x: TOptional<TIntersect<[TNumber, TNumber]>>;
  }> = Type.Composite([
    Type.Intersect([
      Type.Object({ x: Type.Optional(Type.Number()) }),
      Type.Object({ x: Type.Optional(Type.Number()) }),
    ])
  ])
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
{
  const T: TObject<{
    x: TNumber;
  }> = Type.Composite([
    Type.Union([
      Type.Object({ x: Type.Number() }),
      Type.Object({ y: Type.Number() })
    ]),
    Type.Object({ x: Type.Number() })
  ])
}
// prettier-ignore
{
  const T: TObject<{
    x: TIntersect<[TUnion<[TString, TString]>, TNumber]>;
  }> = Type.Composite([
    Type.Union([
      Type.Object({ x: Type.String() }),
      Type.Object({ x: Type.String() })
    ]),
    Type.Object({ x: Type.Number() })
  ])
}
