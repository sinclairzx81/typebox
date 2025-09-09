import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Script.Module')

// ------------------------------------------------------------------
// Type | Interface
// ------------------------------------------------------------------
Test('Should Module 1', () => {
  const M = Type.Script(`
    type A = { x: string }
  `)
  Assert.IsTrue(Type.IsObject(M.A))
  Assert.IsTrue(Type.IsString(M.A.properties.x))
})
Test('Should Module 2', () => {
  const M = Type.Script(`
    interface A { x: string }
  `)
  Assert.IsTrue(Type.IsObject(M.A))
  Assert.IsTrue(Type.IsString(M.A.properties.x))
})
// ------------------------------------------------------------------
// Type | Interface (Multiple)
// ------------------------------------------------------------------
Test('Should Module 3', () => {
  const M = Type.Script(`
    type A = { x: number }
    type B = { x: string }
  `)
  Assert.IsTrue(Type.IsObject(M.A))
  Assert.IsTrue(Type.IsNumber(M.A.properties.x))
  Assert.IsTrue(Type.IsObject(M.B))
  Assert.IsTrue(Type.IsString(M.B.properties.x))
})
Test('Should Module 4', () => {
  const M = Type.Script(`
    interface A { x: number }
    interface B { x: string }
  `)
  const A: Type.TObject<{
    x: Type.TNumber
  }> = M.A
  const B: Type.TObject<{
    x: Type.TString
  }> = M.B
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsString(B.properties.x))
})
// ------------------------------------------------------------------
// Export Type | Interface
// ------------------------------------------------------------------
Test('Should Module 5', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script(`
    export type A = { x: number }
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
})
Test('Should Module 6', () => {
  const A: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script(`
    export interface A { x: number }
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
})
// ------------------------------------------------------------------
// Heritage
// ------------------------------------------------------------------
Test('Should Module 7', () => {
  const A: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(`
    interface B { x: number }
    interface A extends B { y: number }
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
})
// ------------------------------------------------------------------
// Heritage
// ------------------------------------------------------------------
Test('Should Module 8', () => {
  const A: Type.TObject<{
    y: Type.TNumber
    x: Type.TNumber
    z: Type.TNumber
  }> = Type.Script(`
    interface C { x: number }
    interface B { y: number }
    interface A extends B, C { z: number }
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsNumber(A.properties.z))
})
// ------------------------------------------------------------------
// Generic | Interface
// ------------------------------------------------------------------
Test('Should Module 9', () => {
  const A: Type.TObject<{
    y: Type.TNumber
    x: Type.TNumber
    z: Type.TString
  }> = Type.Script(`
    interface D { x: number }
    interface C { y: number }
    interface B<T> extends C, D { z: T }
    type A = B<string>
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsString(A.properties.z))
})
Test('Should Module 10', () => {
  const A: Type.TObject<{
    y: Type.TString
    x: Type.TString
    z: Type.TString
  }> = Type.Script(`
    interface D<T> { x: T }
    interface C<T> { y: T }
    interface B<T> extends C<T>, D<T> { z: T }
    type A = B<string>
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsString(A.properties.x))
  Assert.IsTrue(Type.IsString(A.properties.y))
  Assert.IsTrue(Type.IsString(A.properties.z))
})
// ------------------------------------------------------------------
// Generic | Heritage | Type Propogation
// ------------------------------------------------------------------
Test('Should Module 11', () => {
  const A: Type.TObject<{
    y: Type.TString
    x: Type.TNumber
    z: Type.TString
  }> = Type.Script(`
    interface D<T> { x: T }
    interface C<T> { y: T }
    interface B<T, S> extends C<T>, D<S> { z: T }
    type A = B<string, number>
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsString(A.properties.y))
  Assert.IsTrue(Type.IsString(A.properties.z))
})
Test('Should Module 11.1', () => {
  const A: Type.TObject<{
    y: Type.TString
    y_: Type.TObject<{
      r: Type.TString
    }>
    x: Type.TNumber
    x_: Type.TObject<{
      r: Type.TNumber
    }>
    z: Type.TString
    z_: Type.TObject<{
      r: Type.TString
    }>
  }> = Type.Script(`
    interface R<T> { r: T }
    interface D<T> { x: T, x_: R<T> }
    interface C<T> { y: T, y_: R<T> }
    interface B<T, S> extends C<T>, D<S> { z: T, z_: R<T> }
    type A = B<string, number>
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsString(A.properties.y))
  Assert.IsTrue(Type.IsString(A.properties.z))

  Assert.IsTrue(Type.IsObject(A.properties.x_))
  Assert.IsTrue(Type.IsNumber(A.properties.x_.properties.r))

  Assert.IsTrue(Type.IsObject(A.properties.y_))
  Assert.IsTrue(Type.IsString(A.properties.y_.properties.r))
  Assert.IsTrue(Type.IsObject(A.properties.z_))
  Assert.IsTrue(Type.IsString(A.properties.z_.properties.r))
})
// ------------------------------------------------------------------
// Generic | Interface
// ------------------------------------------------------------------
Test('Should Module 12', () => {
  const A: Type.TIntersect<[
    Type.TObject<{
      y: Type.TString
    }>,
    Type.TObject<{
      x: Type.TString
    }>
  ]> = Type.Script(`
    interface D<T> { x: T }
    interface C<T> { y: T }
    type B<T> = C<T> & D<T>

    type A = B<string>
  `).A
  Assert.IsTrue(Type.IsIntersect(A))
  Assert.IsTrue(Type.IsObject(A.allOf[0])) // C
  Assert.IsTrue(Type.IsString(A.allOf[0].properties.y))

  Assert.IsTrue(Type.IsObject(A.allOf[1])) // D
  Assert.IsTrue(Type.IsString(A.allOf[1].properties.x))
})
// ------------------------------------------------------------------
// Interface | Index Signature
// ------------------------------------------------------------------
Test('Should Module 13', () => {
  const A: Type.TObject<{
    y: Type.TNumber
    x: Type.TNumber
    z: Type.TNumber
  }> = Type.Script(`
    interface C { x: number }
    interface B { y: number }
    interface A extends B, C {
      [x: string]: number
      z: number
    }
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsNumber(A.properties.z))

  Assert.HasPropertyKey(A, 'patternProperties')
  Assert.HasPropertyKey(A.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(A.patternProperties[Type.StringKey]))
})
Test('Should Module 14', () => {
  // index signatures not available in heritage-
  const A: Type.TObject<{
    y: Type.TNumber
    x: Type.TNumber
    z: Type.TNumber
  }> = Type.Script(`
    interface C { x: number }
    interface B {
      [x: string]: number
      y: number
    }
    interface A extends B, C {
      z: number
    }
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsNumber(A.properties.z))

  Assert.NotHasPropertyKey(A, 'patternProperties')
})
// ------------------------------------------------------------------
// Generic | Interface | Index Signature
// ------------------------------------------------------------------
Test('Should Module 15', () => {
  const A: Type.TObject<{
    y: Type.TNumber
    x: Type.TNumber
    z: Type.TString
  }> = Type.Script(`
    interface D { x: number }
    interface C { y: number }
    interface B<T> extends C, D {
      [x: string]: number
      z: T
    }
    
    type A = B<string>
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsString(A.properties.z))
  Assert.HasPropertyKey(A, 'patternProperties')
  Assert.HasPropertyKey(A.patternProperties, Type.StringKey)
  Assert.IsTrue(Type.IsNumber(A.patternProperties[Type.StringKey]))
})
Test('Should Module 16', () => {
  // index signatures not available in heritage
  const A: Type.TObject<{
    y: Type.TNumber
    x: Type.TNumber
    z: Type.TString
  }> = Type.Script(`
    interface D {
      x: number
    }
    interface C {
      [x: string]: number
      y: number
    }
    interface B<T> extends C, D {
      z: T
    }
    type A = B<string>
  `).A
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsNumber(A.properties.y))
  Assert.IsTrue(Type.IsString(A.properties.z))
  Assert.NotHasPropertyKey(A, 'patternProperties')
})
// ------------------------------------------------------------------
// Non-Cyclic: Reference
// ------------------------------------------------------------------
Test('Should Module 17', () => {
  const { A, B } = Type.Script(`
    type A = 1
    type B = A
  `)
  Assert.IsTrue(Type.IsLiteral(A))
  Assert.IsTrue(Type.IsLiteral(B))
  Assert.IsEqual(A.const, 1)
  Assert.IsEqual(B.const, 1)
})
Test('Should Module 18', () => {
  const M = Type.Script(`
    type A = 1
    type B = A | 2 
  `)
  const A: Type.TLiteral<1> = M.A
  const B: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>]> = M.B
  Assert.IsTrue(Type.IsLiteral(A))
  Assert.IsEqual(A.const, 1)
  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsEqual(B.anyOf[0].const, 1)
  Assert.IsEqual(B.anyOf[1].const, 2)
})
Test('Should Module 19', () => {
  const M = Type.Script(
    { C: Type.Literal(3) },
    `
    type A = 1
    type B = A | 2 | C
  `
  )
  const A: Type.TLiteral<1> = M.A
  const B: Type.TUnion<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>]> = M.B
  Assert.IsTrue(Type.IsLiteral(A))
  Assert.IsEqual(A.const, 1)
  Assert.IsTrue(Type.IsUnion(B))
  Assert.IsEqual(B.anyOf[0].const, 1)
  Assert.IsEqual(B.anyOf[1].const, 2)
  Assert.IsEqual(B.anyOf[2].const, 3)
})
Test('Should Module 20', () => {
  const M = Type.Script(
    { C: Type.Literal(3) },
    `
    type A = { x: 1 }
    type B = A & { y: 2 }
  `
  )
  const A: Type.TObject<{
    x: Type.TLiteral<1>
  }> = M.A
  const B: Type.TIntersect<[
    Type.TObject<{
      x: Type.TLiteral<1>
    }>,
    Type.TObject<{
      y: Type.TLiteral<2>
    }>
  ]> = M.B
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(A.properties.x.const, 1)

  Assert.IsTrue(Type.IsIntersect(B))
  Assert.IsEqual(B.allOf[0].properties.x.const, 1)
  Assert.IsEqual(B.allOf[1].properties.y.const, 2)
})
Test('Should Module 21', () => {
  const M = Type.Script(
    { C: Type.Literal(3) },
    `
    type A = { x: 1 }
    type B = Evaluate<A & { y: 2 }>
  `
  )
  const A: Type.TObject<{
    x: Type.TLiteral<1>
  }> = M.A
  const B: Type.TObject<{
    x: Type.TLiteral<1>
    y: Type.TLiteral<2>
  }> = M.B
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(A.properties.x.const, 1)

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsEqual(B.properties.x.const, 1)
  Assert.IsEqual(B.properties.y.const, 2)
})
Test('Should Module 22', () => {
  const M = Type.Script(
    { C: Type.Literal(3) },
    `
    type A = { x: 1 }
    type B = Evaluate<A & { y: 2 }> & { z: 3 }
  `
  )

  const A: Type.TObject<{
    x: Type.TLiteral<1>
  }> = M.A
  const B: Type.TIntersect<[
    Type.TObject<{
      x: Type.TLiteral<1>
      y: Type.TLiteral<2>
    }>,
    Type.TObject<{
      z: Type.TLiteral<3>
    }>
  ]> = M.B
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsEqual(A.properties.x.const, 1)

  Assert.IsTrue(Type.IsIntersect(B))
  Assert.IsEqual(B.allOf[0].properties.x.const, 1)
  Assert.IsEqual(B.allOf[0].properties.y.const, 2)
  Assert.IsEqual(B.allOf[1].properties.z.const, 3)
})
// ------------------------------------------------------------------
// Non-Resolvable
// ------------------------------------------------------------------
Test('Should Module 23', () => {
  const A: Type.TRef<'B'> = Type.Script(`
    type A = B  
  `).A

  Assert.IsTrue(Type.IsRef(A))
  Assert.IsEqual(A.$ref, 'B')
})
// ------------------------------------------------------------------
// Cyclic: Self Referential
// ------------------------------------------------------------------
Test('Should Module 24', () => {
  const A: Type.TCyclic<{
    A: Type.TObject<{
      x: Type.TArray<Type.TRef<'A'>>
    }>
  }, 'A'> = Type.Script(`
    type A = { x: A[] }
  `).A
  Assert.IsTrue(Type.IsCyclic(A))
  Assert.IsEqual(A.$ref, 'A')
  Assert.IsTrue(Type.IsObject(A.$defs.A))
  Assert.IsTrue(Type.IsArray(A.$defs.A.properties.x))
  Assert.IsEqual(A.$defs.A.properties.x.items.$ref, 'A')
})
Test('Should Module 25', () => {
  const A: Type.TCyclic<{
    A: Type.TObject<{
      x: Type.TArray<Type.TPromise<Type.TRef<'A'>>>
    }>
  }, 'A'> = Type.Script(`
    type A = { x: Promise<A>[] }
  `).A
  Assert.IsTrue(Type.IsCyclic(A))
  Assert.IsEqual(A.$ref, 'A')
  Assert.IsTrue(Type.IsObject(A.$defs.A))
  Assert.IsTrue(Type.IsArray(A.$defs.A.properties.x))
  Assert.IsTrue(Type.IsPromise(A.$defs.A.properties.x.items))
  Assert.IsEqual(A.$defs.A.properties.x.items.item.$ref, 'A')
})
Test('Should Module 26', () => {
  const A: Type.TCyclic<{
    A: Type.TObject<{
      x: Type.TPromise<Type.TArray<Type.TRef<'A'>>>
    }>
  }, 'A'> = Type.Script(`
    type A = { x: Promise<A[]> }
  `).A
  Assert.IsTrue(Type.IsCyclic(A))
  Assert.IsEqual(A.$ref, 'A')
  Assert.IsTrue(Type.IsObject(A.$defs.A))
  Assert.IsTrue(Type.IsPromise(A.$defs.A.properties.x))
  Assert.IsTrue(Type.IsArray(A.$defs.A.properties.x.item))
  Assert.IsEqual(A.$defs.A.properties.x.item.items.$ref, 'A')
})
Test('Should Module 27', () => {
  const A: Type.TCyclic<{
    A: Type.TObject<{
      x: Type.TPromise<Type.TUnion<[Type.TRef<'A'>, Type.TRef<'B'>]>>
    }>
    B: Type.TLiteral<1>
  }, 'A'> = Type.Script(`
    type B = 1
    type A = { x: Promise<A | B> }
  `).A
  Assert.IsTrue(Type.IsCyclic(A))
  Assert.IsTrue(Type.IsObject(A.$defs.A))
  Assert.IsTrue(Type.IsPromise(A.$defs.A.properties.x))
  Assert.IsTrue(Type.IsUnion(A.$defs.A.properties.x.item))
  Assert.IsEqual(A.$defs.A.properties.x.item.anyOf[0].$ref, 'A')
  Assert.IsEqual(A.$defs.A.properties.x.item.anyOf[1].$ref, 'B')
})
// ------------------------------------------------------------------
// Cyclic: Mutual Recursive
// ------------------------------------------------------------------
Test('Should Module 28', () => {
  const BinaryExpression: Type.TCyclic<{
    BinaryExpression: Type.TObject<{
      left: Type.TRef<'BinaryExpression'>
      right: Type.TRef<'BinaryExpression'>
    }>
  }, 'BinaryExpression'> = Type.Script(`
    interface BinaryExpression {
      left: BinaryExpression
      right: BinaryExpression
    }
  `).BinaryExpression
  Assert.IsTrue(Type.IsCyclic(BinaryExpression))
  Assert.IsEqual(BinaryExpression.$ref, 'BinaryExpression')
  Assert.HasPropertyKey(BinaryExpression.$defs.BinaryExpression, '$id')
  Assert.IsEqual(BinaryExpression.$defs.BinaryExpression.$id, 'BinaryExpression')
  Assert.IsEqual(BinaryExpression.$defs.BinaryExpression.properties.left.$ref, 'BinaryExpression')
  Assert.IsEqual(BinaryExpression.$defs.BinaryExpression.properties.right.$ref, 'BinaryExpression')
})
Test('Should Module 29', () => {
  const X: {
    ConstExpression: Type.TObject<{
      value: Type.TLiteral<1>
    }>
    BinaryExpression: Type.TCyclic<{
      Expression: Type.TUnion<[Type.TRef<'ConstExpression'>, Type.TRef<'BinaryExpression'>]>
      ConstExpression: Type.TObject<{
        value: Type.TLiteral<1>
      }>
      BinaryExpression: Type.TObject<{
        left: Type.TRef<'Expression'>
        right: Type.TRef<'Expression'>
      }>
    }, 'BinaryExpression'>
    Expression: Type.TCyclic<{
      Expression: Type.TUnion<[Type.TRef<'ConstExpression'>, Type.TRef<'BinaryExpression'>]>
      ConstExpression: Type.TObject<{
        value: Type.TLiteral<1>
      }>
      BinaryExpression: Type.TObject<{
        left: Type.TRef<'Expression'>
        right: Type.TRef<'Expression'>
      }>
    }, 'Expression'>
  } = Type.Script(`
    type Expression = ConstExpression | BinaryExpression
    interface ConstExpression {
      value: 1
    }
    interface BinaryExpression {
      left: Expression
      right: Expression
    }
  `)
  const ConstExpression = X.ConstExpression
  const BinaryExpression = X.BinaryExpression
  const Expression = X.Expression
  // ConstExpression
  Assert.IsTrue(Type.IsObject(ConstExpression))
  Assert.IsEqual(ConstExpression.properties.value.const, 1)
  // BinaryExpression
  Assert.IsTrue(Type.IsCyclic(BinaryExpression))
  Assert.IsEqual(BinaryExpression.$ref, 'BinaryExpression')
  Assert.HasPropertyKey(BinaryExpression.$defs.BinaryExpression, '$id')
  Assert.HasPropertyKey(BinaryExpression.$defs.Expression, '$id')
  Assert.IsTrue(Type.IsObject(BinaryExpression.$defs.ConstExpression))
  Assert.IsEqual(BinaryExpression.$defs.ConstExpression.properties.value.const, 1)
  Assert.IsEqual(BinaryExpression.$defs.BinaryExpression.$id, 'BinaryExpression')
  Assert.IsEqual(BinaryExpression.$defs.BinaryExpression.properties.left.$ref, 'Expression')
  Assert.IsEqual(BinaryExpression.$defs.BinaryExpression.properties.right.$ref, 'Expression')
  Assert.IsEqual(BinaryExpression.$defs.Expression.$id, 'Expression')
  Assert.IsEqual(BinaryExpression.$defs.Expression.anyOf[0].$ref, 'ConstExpression')
  Assert.IsEqual(BinaryExpression.$defs.Expression.anyOf[1].$ref, 'BinaryExpression')
  // Expression
  Assert.IsTrue(Type.IsCyclic(Expression))
  Assert.IsEqual(Expression.$ref, 'Expression')
  Assert.HasPropertyKey(Expression.$defs.BinaryExpression, '$id')
  Assert.HasPropertyKey(Expression.$defs.Expression, '$id')
  Assert.IsTrue(Type.IsObject(Expression.$defs.ConstExpression))
  Assert.IsEqual(Expression.$defs.ConstExpression.properties.value.const, 1)
  Assert.IsEqual(Expression.$defs.BinaryExpression.$id, 'BinaryExpression')
  Assert.IsEqual(Expression.$defs.BinaryExpression.properties.left.$ref, 'Expression')
  Assert.IsEqual(Expression.$defs.BinaryExpression.properties.right.$ref, 'Expression')
  Assert.IsEqual(Expression.$defs.Expression.$id, 'Expression')
  Assert.IsEqual(Expression.$defs.Expression.anyOf[0].$ref, 'ConstExpression')
  Assert.IsEqual(Expression.$defs.Expression.anyOf[1].$ref, 'BinaryExpression')
})
// ------------------------------------------------------------------
// Module: Tail Call Sub Expressions
// ------------------------------------------------------------------
Test('Should Module 30', () => {
  const A: Type.TTuple<[Type.TTuple<[Type.TString, Type.TNumber]>, Type.TTuple<[Type.TString, Type.TNumber]>]> = Type.Script(`
    type Map<T> = [T, T]
    type Reverse<List, Result extends unknown[] = []> = (
      List extends [infer Left, ...infer Right extends unknown[]]
        ? Reverse<Right, [Left, ...Result]>
        : Map<Result>
    )
    type A = Reverse<[number, string]>
  `).A
  Assert.IsTrue(Type.IsTuple(A))
  Assert.IsTrue(Type.IsString(A.items[0].items[0]))
  Assert.IsTrue(Type.IsNumber(A.items[0].items[1]))
  Assert.IsTrue(Type.IsString(A.items[1].items[0]))
  Assert.IsTrue(Type.IsNumber(A.items[1].items[1]))
})
// ------------------------------------------------------------------
// Module: Deep CallStack
// ------------------------------------------------------------------
Test('Should Module 31', () => {
  // Pathological type that tests deep calls in a variety of contexts.
  const Remote = Type.Script('<S> = Capitalize<`prop${Capitalize<S>}`>')
  const Result: Type.TObject<{
    PropX: Type.TTuple<[Type.TLiteral<1>, Type.TNull]>
    PropY: Type.TTuple<[Type.TLiteral<2>, Type.TNull]>
    PropZ: Type.TTuple<[Type.TLiteral<3>, Type.TNull]>
  }> = Type.Script(
    { Remote },
    `

    type Call1<T> = [T, null]
    type Call2<T> = Call1<T>
    type Call3<T> = Call2<T>

    type Mapped<T> = { 
      [K in keyof T as Remote<K>]: Call3<T[K]>
    }
    
    type Vector = { 
      x: 1 
      y: 2
      z: 3 
    } 
    type Result = Mapped<Vector>
  `
  ).Result
  // test
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsTuple(Result.properties.PropX))
  Assert.IsTrue(Type.IsTuple(Result.properties.PropY))
  Assert.IsTrue(Type.IsTuple(Result.properties.PropZ))
  Assert.IsEqual(Result.properties.PropX.items[0].const, 1)
  Assert.IsEqual(Result.properties.PropY.items[0].const, 2)
  Assert.IsEqual(Result.properties.PropZ.items[0].const, 3)
  Assert.IsTrue(Type.IsNull(Result.properties.PropX.items[1]))
  Assert.IsTrue(Type.IsNull(Result.properties.PropY.items[1]))
  Assert.IsTrue(Type.IsNull(Result.properties.PropZ.items[1]))
})
// ------------------------------------------------------------------
// ExtendsCheck: Coverage
// ------------------------------------------------------------------
Test('Should Module 32', () => {
  const T: Type.TCyclic<{
    X: Type.TIntersect<[Type.TRef<'X'>, Type.TRef<'X'>]>
  }, 'X'> = Type.Script(`type X = X & X`).X
  Assert.IsEqual(T.$defs.X.allOf[0].$ref, 'X')
  Assert.IsEqual(T.$defs.X.allOf[1].$ref, 'X')
})
Test('Should Module 33', () => {
  const T: Type.TCyclic<{
    X: Type.TUnion<[Type.TRef<'X'>, Type.TRef<'X'>]>
  }, 'X'> = Type.Script(`type X = X | X`).X
  Assert.IsEqual(T.$defs.X.anyOf[0].$ref, 'X')
  Assert.IsEqual(T.$defs.X.anyOf[1].$ref, 'X')
})
Test('Should Module 34', () => {
  const T: Type.TCyclic<{
    X: Type.TTuple<[Type.TRef<'X'>, Type.TRef<'X'>]>
  }, 'X'> = Type.Script(`type X = [X, X]`).X
  Assert.IsEqual(T.$defs.X.items[0].$ref, 'X')
  Assert.IsEqual(T.$defs.X.items[1].$ref, 'X')
})
Test('Should Module 35', () => {
  const T: Type.TCyclic<{
    X: Type.TArray<Type.TRef<'X'>>
  }, 'X'> = Type.Script(`type X = X[]`).X
  Assert.IsEqual(T.$defs.X.items.$ref, 'X')
})
Test('Should Module 36', () => {
  const T: Type.TCyclic<{
    X: Type.TConstructor<[Type.TRef<'X'>], Type.TRef<'X'>>
  }, 'X'> = Type.Script(`type X = new (x: X) => X`).X
  Assert.IsEqual(T.$defs.X.parameters[0].$ref, 'X')
  Assert.IsEqual(T.$defs.X.instanceType.$ref, 'X')
})
Test('Should Module 37', () => {
  const T: Type.TCyclic<{
    X: Type.TFunction<[Type.TRef<'X'>], Type.TRef<'X'>>
  }, 'X'> = Type.Script(`type X = (x: X) => X`).X
  Assert.IsEqual(T.$defs.X.parameters[0].$ref, 'X')
  Assert.IsEqual(T.$defs.X.returnType.$ref, 'X')
})
Test('Should Module 38', () => {
  const T: Type.TCyclic<{
    X: Type.TAsyncIterator<Type.TRef<'X'>>
  }, 'X'> = Type.Script(`type X = AsyncIterator<X>`).X
  Assert.IsEqual(T.$defs.X.iteratorItems.$ref, 'X')
})
Test('Should Module 39', () => {
  const T: Type.TCyclic<{
    X: Type.TIterator<Type.TRef<'X'>>
  }, 'X'> = Type.Script(`type X = Iterator<X>`).X
  Assert.IsEqual(T.$defs.X.iteratorItems.$ref, 'X')
})
Test('Should Module 40', () => {
  const T: Type.TCyclic<{
    X: Type.TPromise<Type.TRef<'X'>>
  }, 'X'> = Type.Script(`type X = Promise<X>`).X
  Assert.IsEqual(T.$defs.X.item.$ref, 'X')
})
Test('Should Module 41', () => {
  const T: Type.TCyclic<{
    X: Type.TObject<{
      x: Type.TRef<'X'>
    }>
  }, 'X'> = Type.Script(`type X = { x: X }`).X
  Assert.IsEqual(T.$defs.X.properties.x.$ref, 'X')
})
Test('Should Module 42', () => {
  Assert.Throws(() => Type.Script(`type X = Record<string, X>`))
})
