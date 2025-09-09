import { Assert } from 'test'
import * as Type from 'typebox'
import { Guard } from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Cyclic')

// ------------------------------------------------------------------
// Partial
// ------------------------------------------------------------------
Test('Should Cyclic 1', () => {
  const S: Type.TCyclic<{
    A: Type.TObject<{
      x: Type.TNumber
      y: Type.TNumber
    }>
  }, 'A'> = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  }, 'A')
  const T = Type.Partial(S)
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.IsTrue(Type.IsOptional(T.$defs.A.properties.x))
  Assert.IsTrue(Type.IsOptional(T.$defs.A.properties.y))
  Assert.IsTrue(Type.IsNumber(T.$defs.A.properties.x))
  Assert.IsTrue(Type.IsNumber(T.$defs.A.properties.y))
})
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
Test('Should Cyclic 2', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number())
    })
  }, 'A')
  const T = Type.Required(S)
  Assert.IsTrue(Type.IsCyclic(T))
  Assert.IsFalse(Type.IsOptional(T.$defs.A.properties.x))
  Assert.IsFalse(Type.IsOptional(T.$defs.A.properties.y))
  Assert.IsTrue(Type.IsNumber(T.$defs.A.properties.x))
  Assert.IsTrue(Type.IsNumber(T.$defs.A.properties.y))
})
// ------------------------------------------------------------------
// Pick
// ------------------------------------------------------------------
Test('Should Cyclic 3', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  }, 'A')
  const T = Type.Pick(S, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsEqual(Guard.Keys(T.properties).length, 1)
})
// ------------------------------------------------------------------
// Omit
// ------------------------------------------------------------------
Test('Should Cyclic 4', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  }, 'A')
  const T = Type.Omit(S, Type.Literal('x'))
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
  Assert.IsEqual(Guard.Keys(T.properties).length, 1)
})
// ------------------------------------------------------------------
// KeyOf
// ------------------------------------------------------------------
Test('Should Cyclic 5', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  }, 'A')
  const T = Type.KeyOf(S)
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf[0].const, 'x')
  Assert.IsEqual(T.anyOf[1].const, 'y')
})
// ------------------------------------------------------------------
// Index
// ------------------------------------------------------------------
Test('Should Cyclic 6', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.String()
    })
  }, 'A')
  const T = Type.Index(S, Type.Literal('x'))
  Assert.IsTrue(Type.IsNumber(T))
})
Test('Should Cyclic 7', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.String()
    })
  }, 'A')
  const T = Type.Index(S, Type.Literal('y'))
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Cyclic 8', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.String()
    })
  }, 'A')
  const T = Type.Index(S, Type.KeyOf(S))
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
// ------------------------------------------------------------------
// Unresolvable
// ------------------------------------------------------------------
Test('Should Cyclic 6', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.String()
    })
  }, 'B')
  const T: Type.TNever = Type.Index(S, Type.Literal('x'))
  Assert.IsTrue(Type.IsNever(T))
})
// ------------------------------------------------------------------
// First Non-Ref Target
// ------------------------------------------------------------------
Test('Should Cyclic 6', () => {
  const S = Type.Cyclic({
    A: Type.Object({
      x: Type.Number(),
      y: Type.String()
    }),
    B: Type.Ref('A'),
    C: Type.Ref('B')
  }, 'C')
  const T: Type.TNumber = Type.Index(S, Type.Literal('x'))
  Assert.IsTrue(Type.IsNumber(T))
})
// ------------------------------------------------------------------
// As Indexer
// ------------------------------------------------------------------
Test('Should Cyclic 5', () => {
  const S = Type.Cyclic({
    A: Type.Union([
      Type.Literal('x'),
      Type.Literal('y')
    ])
  }, 'A')

  const T: Type.TUnion<[Type.TNumber, Type.TString]> = Type.Index(
    Type.Object({
      x: Type.Number(),
      y: Type.String()
    }),
    S
  )
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsTrue(Type.IsNumber(T.anyOf[0]))
  Assert.IsTrue(Type.IsString(T.anyOf[1]))
})
// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
Test('Should Cyclic 5', () => {
  const L = Type.Cyclic({
    A: Type.Object({
      x: Type.Ref('A')
    })
  }, 'A')
  const R = Type.Object({
    x: Type.Number()
  })
  const T: Type.ExtendsResult.TExtendsTrue<{}> = Type.Extends({}, L, R)
  Assert.IsTrue(Type.ExtendsResult.IsExtendsTrueLike(T))
})
Test('Should Cyclic 5', () => {
  const L = Type.Object({
    x: Type.Number()
  })
  const R = Type.Cyclic({
    A: Type.Object({
      x: Type.Ref('A')
    })
  }, 'A')
  const T: Type.ExtendsResult.TExtendsTrue<{}> = Type.Extends({}, L, R)
  Assert.IsTrue(Type.ExtendsResult.IsExtendsTrueLike(T))
})
// ------------------------------------------------------------------
// Extends Infer
// ------------------------------------------------------------------
Test('Should Cyclic 5', () => {
  const L = Type.Cyclic({
    A: Type.Object({
      x: Type.Ref('A')
    })
  }, 'A')
  const R = Type.Object({
    x: Type.Infer('X')
  })
  const T = Type.Extends({}, L, R)
  Assert.IsTrue(Type.ExtendsResult.IsExtendsTrueLike(T))
})

type R = { x: unknown } extends { x: infer X } ? X : 2
