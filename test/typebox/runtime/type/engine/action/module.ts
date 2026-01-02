import { Assert } from 'test'
import * as Type from 'typebox'
import { Guard } from 'typebox/guard'

const Test = Assert.Context('Type.Engine.Module')

// ------------------------------------------------------------------
// Module: Inlining
// ------------------------------------------------------------------
Test('Should Module 1', () => {
  const A: {
    A: Type.TString
  } = Type.Module({
    A: Type.String()
  })
  Assert.IsTrue(Type.IsString(A.A))
})
Test('Should Module 2', () => {
  const A: {
    A: Type.TString
    B: Type.TString
  } = Type.Module({
    A: Type.String(),
    B: Type.Ref('A')
  })
  Assert.IsTrue(Type.IsString(A.A))
  Assert.IsTrue(Type.IsString(A.B))
})
Test('Should Module 3', () => {
  const A: {
    A: Type.TString
    B: Type.TRef<'C'>
  } = Type.Module({
    A: Type.String(),
    B: Type.Ref('C')
  })
  Assert.IsTrue(Type.IsString(A.A))
  Assert.IsEqual(A.B.$ref, 'C')
})
Test('Should Module 4', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TRef<'A'>
    }, 'A'>
  } = Type.Module({
    A: Type.Ref('A')
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsEqual(A.A.$defs.A.$ref, 'A')
})
Test('Should Module 5', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TObject<{
        x: Type.TRef<'A'>
      }>
    }, 'A'>
  } = Type.Module({
    A: Type.Object({
      x: Type.Ref('A')
    })
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsObject(A.A.$defs.A))
  Assert.IsEqual(A.A.$defs.A.properties.x.$ref, 'A')
})
Test('Should Module 6', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TObject<{
        x: Type.TRef<'A'>
      }>
    }, 'A'>
    B: Type.TCyclic<{
      B: Type.TRef<'A'>
      A: Type.TObject<{
        x: Type.TRef<'A'>
      }>
    }, 'B'>
  } = Type.Module({
    A: Type.Object({
      x: Type.Ref('A')
    }),
    B: Type.Ref('A')
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsEqual(A.A.$defs.A.properties.x.$ref, 'A')

  Assert.IsTrue(Type.IsCyclic(A.B))
  Assert.IsEqual(A.B.$defs.B.$ref, 'A')
  Assert.IsEqual(A.B.$defs.A.properties.x.$ref, 'A')
})
// ------------------------------------------------------------------
// Module: Generics
// ------------------------------------------------------------------
Test('Should Module 7', () => {
  const A: {
    T: Type.TGeneric<[Type.TParameter<'T', Type.TUnknown, Type.TUnknown>], Type.TTuple<[Type.TRef<'T'>]>>
    B: Type.TTuple<[Type.TLiteral<1>]>
  } = Type.Module({
    T: Type.Generic([Type.Parameter('T')], Type.Tuple([Type.Ref('T')])),
    B: Type.Call(Type.Ref('T'), [Type.Literal(1)])
  })
  Assert.IsTrue(Type.IsGeneric(A.T))
  Assert.IsTrue(Type.IsTuple(A.B))
  Assert.IsEqual(A.B.items[0].const, 1)
})
// Test('Should Module 8', () => {
//   const A = Type.Module({
//     T: Type.Generic([Type.Parameter('T')], Type.Tuple([Type.Ref('T')])),
//     A: Type.Object({
//       x: Type.Ref('A'),
//       y: Type.Call(Type.Ref('T'), [Type.Literal(1)]),
//     }),
//   })
//   Assert.IsTrue(Type.IsGeneric(A.T))
//   Assert.IsTrue(Type.IsCyclic(A.A))
//   Assert.IsEqual(A.A.$defs.A.properties.x.$ref, 'A')
//   Assert.IsEqual(A.A.$defs.A.properties.y.items[0].const, 1)
// })
// ------------------------------------------------------------------
// Module: Cyclic Nested Detection
// ------------------------------------------------------------------
Test('Should Module 9', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TArray<Type.TRef<'A'>>
    }, 'A'>
  } = Type.Module({
    A: Type.Array(Type.Ref('A'))
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsArray(A.A.$defs.A))
})
// Test('Should Module 10', () => {
//   const A: {
//     A: Type.TCyclic<{
//       A: Type.TAsyncIterator<Type.TRef<'A'>>
//     }, 'A'>
//   } = Type.Module({
//     A: Type.AsyncIterator(Type.Ref('A'))
//   })
//   Assert.IsTrue(Type.IsCyclic(A.A))
//   Assert.IsTrue(Type.IsAsyncIterator(A.A.$defs.A))
// })
Test('Should Module 11', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TConstructor<[Type.TRef<'A'>], Type.TRef<'A'>>
    }, 'A'>
  } = Type.Module({
    A: Type.Constructor([Type.Ref('A')], Type.Ref('A'))
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsConstructor(A.A.$defs.A))
})
Test('Should Module 12', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TFunction<[Type.TRef<'A'>], Type.TRef<'A'>>
    }, 'A'>
  } = Type.Module({
    A: Type.Function([Type.Ref('A')], Type.Ref('A'))
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsFunction(A.A.$defs.A))
})
Test('Should Module 13', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TIntersect<[Type.TRef<'A'>, Type.TRef<'A'>]>
    }, 'A'>
  } = Type.Module({
    A: Type.Intersect([Type.Ref('A'), Type.Ref('A')])
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsIntersect(A.A.$defs.A))
})
Test('Should Module 14', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TObject<{
        x: Type.TRef<'A'>
      }>
    }, 'A'>
  } = Type.Module({
    A: Type.Object({ x: Type.Ref('A') })
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsObject(A.A.$defs.A))
})
Test('Should Module 15', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TObject<{
        x: Type.TRef<'A'>
        y: Type.TString
      }>
    }, 'A'>
  } = Type.Module({
    A: Type.Object({ x: Type.Ref('A'), y: Type.String() })
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsObject(A.A.$defs.A))
  Assert.IsTrue(Type.IsRef(A.A.$defs.A.properties.x))
  Assert.IsTrue(Type.IsString(A.A.$defs.A.properties.y))
})
// Test('Should Module 16', () => {
//   const A: {
//     A: Type.TCyclic<{
//       A: Type.TPromise<Type.TRef<'A'>>
//     }, 'A'>
//   } = Type.Module({
//     A: Type.Promise(Type.Ref('A'))
//   })
//   Assert.IsTrue(Type.IsCyclic(A.A))
//   Assert.IsTrue(Type.IsPromise(A.A.$defs.A))
// })
Test('Should Module 17', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TUnion<[Type.TRef<'A'>, Type.TRef<'A'>]>
    }, 'A'>
  } = Type.Module({
    A: Type.Union([Type.Ref('A'), Type.Ref('A')])
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsUnion(A.A.$defs.A))
})
Test('Should Module 18', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TTuple<[Type.TRef<'A'>, Type.TRef<'A'>]>
    }, 'A'>
  } = Type.Module({
    A: Type.Tuple([Type.Ref('A'), Type.Ref('A')])
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsTuple(A.A.$defs.A))
})
Test('Should Module 19', () => {
  const A: {
    A: Type.TCyclic<{
      A: Type.TRecord<'^.*$', Type.TRef<'A'>>
    }, 'A'>
  } = Type.Module({
    A: Type.Record(Type.String(), Type.Ref('A'))
  })
  Assert.IsTrue(Type.IsCyclic(A.A))
  Assert.IsTrue(Type.IsRecord(A.A.$defs.A))
})
// ------------------------------------------------------------------
// Cyclic: Dependencies | Key Linear Ordering
// ------------------------------------------------------------------
function IsSetEqual(actual: string[], expected: string[]): boolean {
  const a = new Set(actual)
  const b = new Set(expected)
  if (a.size !== b.size) return false
  for (const key of a) if (!b.has(key)) return false
  return true
}
Test('Should Module 20', () => {
  type A1 = { x: A2; y: A3 }
  type A2 = { x: A5; y: A6 }
  type A3 = { x: A4; y: A3 }
  type A4 = [A5, A6]
  type A5 = A1
  type A6 = A2
  const A = Type.Module({
    A1: Type.Object({
      x: Type.Ref('A2'),
      y: Type.Ref('A3')
    }),
    A2: Type.Object({
      x: Type.Ref('A5'),
      y: Type.Ref('A6')
    }),
    A3: Type.Object({
      X: Type.Ref('A4'),
      y: Type.Ref('A3')
    }),
    A4: Type.Tuple([
      Type.Ref('A5'),
      Type.Ref('A6')
    ]),
    A5: Type.Ref('A1'),
    A6: Type.Ref('A2')
  })
  // ordered | would prefer ordered here
  Assert.IsEqual(Guard.Keys(A.A1.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A2.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A3.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A4.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A5.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A6.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
})
Test('Should Module 21', () => {
  type A1 = { x: A2; y: A3 }
  type A2 = { x: A5; y: A6 }
  type A3 = { y: A3 }
  type A4 = [A5, A6] // non referential
  type A5 = A1
  type A6 = A2
  const A = Type.Module({
    A1: Type.Object({
      x: Type.Ref('A2'),
      y: Type.Ref('A3')
    }),
    A2: Type.Object({
      x: Type.Ref('A5'),
      y: Type.Ref('A6')
    }),
    A3: Type.Object({
      y: Type.Ref('A3')
    }),
    A4: Type.Tuple([
      Type.Ref('A5'),
      Type.Ref('A6')
    ]),
    A5: Type.Ref('A1'),
    A6: Type.Ref('A2')
  })
  // ordered | would prefer ordered here
  Assert.IsEqual(Guard.Keys(A.A1.$defs), ['A1', 'A2', 'A3', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A2.$defs), ['A1', 'A2', 'A3', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A3.$defs), ['A3'])
  Assert.IsEqual(Guard.Keys(A.A4.$defs), ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A5.$defs), ['A1', 'A2', 'A3', 'A5', 'A6'])
  Assert.IsEqual(Guard.Keys(A.A6.$defs), ['A1', 'A2', 'A3', 'A5', 'A6'])
})
