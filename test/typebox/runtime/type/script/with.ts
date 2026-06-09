import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.With')

// ------------------------------------------------------------------
// Options | Overloads
// ------------------------------------------------------------------
Test('Should With 1', () => {
  const T = Type.Script('string', { x: 1 })
  Assert.IsTrue(Type.IsString(T))
  Assert.HasPropertyKey(T, 'x')
  Assert.IsEqual(T.x, 1)
})
Test('Should With 2', () => {
  const A = Type.String()
  const T = Type.Script({ A }, 'A', { x: 1 })
  Assert.IsTrue(Type.IsString(T))
  Assert.HasPropertyKey(T, 'x')
  Assert.IsEqual(T.x, 1)
})
// ------------------------------------------------------------------
// Options | Json Parse
// ------------------------------------------------------------------
Test('Should With 3', () => {
  const T: Type.TWith<Type.TNull, {
    x: 1
  }> = Type.Script('null with { x: 1 }')
  Assert.IsEqual(T.x, 1)
})
Test('Should With 4', () => {
  const T: Type.TWith<Type.TNull, {
    x: true
  }> = Type.Script('null with { x: true }')
  Assert.IsEqual(T.x, true)
})
Test('Should With 5', () => {
  const T: Type.TWith<Type.TNull, {
    x: [1, 2, 3]
  }> = Type.Script('null with { x: [1, 2, 3] }')
  Assert.IsEqual(T.x, [1, 2, 3])
})
Test('Should With 6', () => {
  const T: Type.TWith<Type.TNull, {
    x: { x: 1 }
  }> = Type.Script('null with { x: { x: 1 } }')
  Assert.IsEqual(T.x, { x: 1 })
})
Test('Should With 7', () => {
  const T: Type.TWith<Type.TNull, {
    x: null
  }> = Type.Script('null with { x: null }')
  Assert.IsEqual(T.x, null)
})
Test('Should With 8', () => {
  const T: Type.TWith<Type.TNull, {
    x: 'hello'
  }> = Type.Script('null with { x: "hello" }')
  Assert.IsEqual(T.x, 'hello')
})
// ------------------------------------------------------------------
// Annotations
// ------------------------------------------------------------------
Test('Should With 9', () => {
  const Result: Type.TWith<Type.TString, { value: 1 }> = Type.Script('string with { value: 1 }')
  Assert.IsTrue(Type.IsString(Result))
  Assert.IsEqual(Result.value, 1)
})
Test('Should With 10', () => {
  const Result: Type.TWith<Type.TNumber, { minimum: 0 }> = Type.Script('number with { minimum: 0 }')
  Assert.IsTrue(Type.IsNumber(Result))
  Assert.IsEqual(Result.minimum, 0)
})
Test('Should With 11', () => {
  const Result: Type.TWith<Type.TBoolean, { description: 'description' }> = Type.Script("boolean with { description: 'description' }")
  Assert.IsTrue(Type.IsBoolean(Result))
  Assert.IsEqual(Result.description, 'description')
})
Test('Should With 12', () => {
  const Result: Type.TWith<Type.TNumber, { minimum: 0; maximum: 1; description: 'description'; title: 'title' }> = Type.Script("number with { minimum: 0, maximum: 1, description: 'description', title: 'title' }")
  Assert.IsTrue(Type.IsNumber(Result))
  Assert.IsEqual(Result.minimum, 0)
  Assert.IsEqual(Result.maximum, 1)
  Assert.IsEqual(Result.description, 'description')
  Assert.IsEqual(Result.title, 'title')
})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should With 13', () => {
  const Result: Type.TWith<
    Type.TObject<{
      x: Type.TWith<Type.TNumber, {
        minimum: 1
        description: 'X'
      }>
      y: Type.TWith<Type.TNumber, {
        minimum: 2
        description: 'Y'
      }>
      z: Type.TWith<Type.TNumber, {
        minimum: 3
        description: 'Z'
      }>
    }>,
    {
      additionalProperties: false
      description: 'Vector'
    }
  > = Type.Script(`{
    x: number with { minimum: 1, description: 'X' },
    y: number with { minimum: 2, description: 'Y' },
    z: number with { minimum: 3, description: 'Z' }
  } with { additionalProperties: false, description: 'Vector' }`)
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsEqual(Result.description, 'Vector')
  Assert.IsEqual(Result.additionalProperties, false)
  Assert.IsTrue(Type.IsNumber(Result.properties.x))
  Assert.IsEqual(Result.properties.x.minimum, 1)
  Assert.IsEqual(Result.properties.x.description, 'X')
  Assert.IsTrue(Type.IsNumber(Result.properties.y))
  Assert.IsEqual(Result.properties.y.minimum, 2)
  Assert.IsEqual(Result.properties.y.description, 'Y')
  Assert.IsTrue(Type.IsNumber(Result.properties.z))
  Assert.IsEqual(Result.properties.z.minimum, 3)
  Assert.IsEqual(Result.properties.z.description, 'Z')
})
Test('Should With 14', () => {
  const T: Type.TWith<
    Type.TObject<{
      x: Type.TNumber
      y: Type.TNumber
    }>,
    {
      description: 'description'
      additionalProperties: false
    }
  > = Type.Script(`{ x: number, y: number } with { description: 'description', additionalProperties: false }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsEqual(T.description, 'description')
  Assert.IsEqual(T.additionalProperties, false)
  Assert.IsTrue(Type.IsNumber(T.properties.x))
  Assert.IsTrue(Type.IsNumber(T.properties.y))
})
Test('Should With 15', () => {
  const T = Type.Script(`{
    value: string with { minLength: 1, maxLength: 100 }
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsString(T.properties.value))
  Assert.IsEqual(T.properties.value.minLength, 1)
  Assert.IsEqual(T.properties.value.maxLength, 100)
})
Test('Should With 16', () => {
  const T: Type.TObject<{
    meta: Type.TWith<
      Type.TObject<{
        title: Type.TWith<Type.TString, {
          minLength: 1
        }>
      }>,
      {
        description: 'description'
      }
    >
  }> = Type.Script(`{
    meta: { title: string with { minLength: 1 } } with { description: 'description' }
  }`)
  Assert.IsTrue(Type.IsObject(T))
  Assert.IsTrue(Type.IsObject(T.properties.meta))
  Assert.IsEqual(T.properties.meta.description, 'description')
  Assert.IsTrue(Type.IsString(T.properties.meta.properties.title))
  Assert.IsEqual(T.properties.meta.properties.title.minLength, 1)
})
// ------------------------------------------------------------------
// Logical
// ------------------------------------------------------------------
Test('Should With 17', () => {
  const T: Type.TUnion<[Type.TString, Type.TWith<Type.TNumber, { foo: 1 }>]> = Type.Script('string | number with { foo: 1 }')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf.length, 2)
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
  Assert.IsEqual((T.anyOf[1] as Type.TWith<Type.TNumber, { foo: 1 }>).foo, 1)
})
Test('Should With 18', () => {
  const T: Type.TUnion<[
    Type.TString,
    Type.TBoolean,
    Type.TWith<Type.TNumber, {
      minimum: 0
    }>
  ]> = Type.Script('string | boolean | number with { minimum: 0 }')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.anyOf.length, 3)
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsBoolean(T.anyOf[1]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[2]))
  Assert.IsEqual(T.anyOf[2].minimum, 0)
})
Test('Should With 19', () => {
  const T: Type.TWith<Type.TUnion<[Type.TString, Type.TNumber]>, { foo: 1 }> = Type.Script('(string | number) with { foo: 1 }')
  Assert.IsTrue(Type.IsUnion(T))
  Assert.IsEqual(T.foo, 1)
  Assert.IsTrue(Type.IsString(T.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(T.anyOf[1]))
})
// ------------------------------------------------------------------
// Constituents
// ------------------------------------------------------------------
Test('Should With 20', () => {
  const Result: Type.TUnion<[
    Type.TWith<Type.TString, {
      minLength: 1
    }>,
    Type.TWith<Type.TNumber, {
      minimum: 0
    }>
  ]> = Type.Script(`(string with { minLength: 1 }) | (number with { minimum: 0 })`)
  Assert.IsTrue(Type.IsUnion(Result))
  Assert.IsEqual(Result.anyOf.length, 2)
  Assert.IsTrue(Type.IsString(Result.anyOf[0]))
  Assert.IsEqual(Result.anyOf[0].minLength, 1)
  Assert.IsTrue(Type.IsNumber(Result.anyOf[1]))
  Assert.IsEqual(Result.anyOf[1].minimum, 0)
})
// ------------------------------------------------------------------
// Generic
// ------------------------------------------------------------------
Test('Should With 21', () => {
  const Result: Type.TObject<{
    x: Type.TWith<Type.TNumber, {
      minimum: 0
      maximum: 1
    }>
    y: Type.TWith<Type.TNumber, {
      minimum: 0
      maximum: 1
    }>
    z: Type.TWith<Type.TNumber, {
      minimum: 0
      maximum: 1
    }>
  }> = Type.Script(`
    type Clamped<T> = {
      [K in keyof T]: T[K] with { minimum: 0, maximum: 1 }
    }
    type Vector = {
      x: number
      y: number
      z: number
    }
    type Result = Clamped<Vector>
  `).Result
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsNumber(Result.properties.x))
  Assert.IsEqual(Result.properties.x.minimum, 0)
  Assert.IsEqual(Result.properties.x.maximum, 1)
  Assert.IsTrue(Type.IsNumber(Result.properties.y))
  Assert.IsEqual(Result.properties.y.minimum, 0)
  Assert.IsEqual(Result.properties.y.maximum, 1)
  Assert.IsTrue(Type.IsNumber(Result.properties.z))
  Assert.IsEqual(Result.properties.z.minimum, 0)
  Assert.IsEqual(Result.properties.z.maximum, 1)
})
Test('Should With 22', () => {
  const Result: Type.TObject<{
    a: Type.TWith<Type.TString, {
      description: 'description'
    }>
    b: Type.TWith<Type.TString, {
      description: 'description'
    }>
  }> = Type.Script(`
    type description<T> = {
      [K in keyof T]: T[K] with { description: 'description' }
    }
    type Input = { a: string, b: string }
    type Result = description<Input>
  `).Result
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsString(Result.properties.a))
  Assert.IsEqual(Result.properties.a.description, 'description')
  Assert.IsTrue(Type.IsString(Result.properties.b))
  Assert.IsEqual(Result.properties.b.description, 'description')
})
// ------------------------------------------------------------------
// Generic: Conditional
// ------------------------------------------------------------------
Test('Should With 23', () => {
  const Result: Type.TWith<Type.TNumber, {
    minimum: 0
  }> = Type.Script(`
    type Wrap<V> = V extends number ? V with { minimum: 0 } : V
    type Result = Wrap<number>
  `).Result
  Assert.IsTrue(Type.IsNumber(Result))
  Assert.IsEqual(Result.minimum, 0)
})
Test('Should With 24', () => {
  const Result: Type.TString = Type.Script(`
    type Wrap<V> = V extends number ? V with { minimum: 0 } : V
    type Result = Wrap<string>
  `).Result
  Assert.IsTrue(Type.IsString(Result))
  Assert.IsFalse('minimum' in Result)
})
// ------------------------------------------------------------------
// Intersection
// ------------------------------------------------------------------
Test('Should With 25', () => {
  const Result: Type.TWith<
    Type.TIntersect<[
      Type.TObject<{
        x: Type.TNumber
      }>,
      Type.TObject<{
        y: Type.TNumber
      }>
    ]>,
    {
      description: 'description'
    }
  > = Type.Script(`({ x: number } & { y: number }) with { description: 'description' }`)
  Assert.IsTrue(Type.IsIntersect(Result))
  Assert.IsEqual(Result.description, 'description')
})
Test('Should With 26', () => {
  const Result: Type.TIntersect<[
    Type.TWith<
      Type.TObject<{
        x: Type.TNumber
      }>,
      {
        description: 'X'
      }
    >,
    Type.TWith<
      Type.TObject<{
        y: Type.TNumber
      }>,
      {
        description: 'Y'
      }
    >
  ]> = Type.Script(`
    { x: number } with { description: 'X' } & { y: number } with { description: 'Y' }
  `)
  Assert.IsTrue(Type.IsIntersect(Result))
  Assert.IsEqual(Result.allOf[0].description, 'X')
  Assert.IsEqual(Result.allOf[1].description, 'Y')
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should With 27', () => {
  const Result: Type.TTuple<[
    Type.TWith<Type.TNumber, {
      minimum: 0
    }>,
    Type.TWith<Type.TString, {
      minLength: 1
    }>
  ]> = Type.Script(`[number with { minimum: 0 }, string with { minLength: 1 }]`)
  Assert.IsTrue(Type.IsTuple(Result))
  Assert.IsTrue(Type.IsNumber(Result.items[0]))
  Assert.IsEqual(Result.items[0].minimum, 0)
  Assert.IsTrue(Type.IsString(Result.items[1]))
  Assert.IsEqual(Result.items[1].minLength, 1)
})
Test('Should With 28', () => {
  const Result: Type.TWith<Type.TTuple<[Type.TNumber, Type.TString]>, {
    description: 'description'
  }> = Type.Script(`[number, string] with { description: 'description' }`)
  Assert.IsTrue(Type.IsTuple(Result))
  Assert.IsEqual(Result.description, 'description')
  Assert.IsTrue(Type.IsNumber(Result.items[0]))
  Assert.IsTrue(Type.IsString(Result.items[1]))
})

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
Test('Should With 29', () => {
  const Result: Type.TArray<
    Type.TWith<Type.TNumber, {
      minimum: 0
    }>
  > = Type.Script(`Array<number with { minimum: 0 }>`)
  Assert.IsTrue(Type.IsArray(Result))
  Assert.IsTrue(Type.IsNumber(Result.items))
  Assert.IsEqual(Result.items.minimum, 0)
})
Test('Should With 30', () => {
  const Result: Type.TWith<Type.TArray<Type.TNumber>, {
    description: 'description'
    minItems: 1
  }> = Type.Script(`number[] with { description: 'description', minItems: 1 }`)
  Assert.IsTrue(Type.IsArray(Result))
  Assert.IsEqual(Result.description, 'description')
  Assert.IsEqual(Result.minItems, 1)
  Assert.IsTrue(Type.IsNumber(Result.items))
})

// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
Test('Should With 31', () => {
  const Result: Type.TWith<Type.TLiteral<'hello'>, {
    description: 'description'
  }> = Type.Script(`'hello' with { description: 'description' }`)
  Assert.IsTrue(Type.IsLiteral(Result))
  Assert.IsEqual(Result.const, 'hello')
  Assert.IsEqual(Result.description, 'description')
})
Test('Should With 32', () => {
  const Result: Type.TWith<Type.TLiteral<42>, {
    description: 'description'
  }> = Type.Script(`42 with { description: 'description' }`)
  Assert.IsTrue(Type.IsLiteral(Result))
  Assert.IsEqual(Result.const, 42)
  Assert.IsEqual(Result.description, 'description')
})
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
Test('Should With 33', () => {
  const Result: Type.TObject<{
    label: Type.TOptional<
      Type.TWith<Type.TString, {
        minLength: 1
      }>
    >
  }> = Type.Script(`{ label?: string with { minLength: 1 } }`)
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsOptional(Result.properties.label))
  Assert.IsEqual(Result.properties.label.minLength, 1)
})
// ------------------------------------------------------------------
// Readonly
// ------------------------------------------------------------------
Test('Should With 34', () => {
  const Result: Type.TObject<{
    id: Type.TReadonly<
      Type.TWith<Type.TString, {
        minLength: 1
      }>
    >
  }> = Type.Script(`{ readonly id: string with { minLength: 1 } }`)
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsReadonly(Result.properties.id))
  Assert.IsEqual(Result.properties.id.minLength, 1)
})
// ------------------------------------------------------------------
// Mapped
// ------------------------------------------------------------------
Test('Should With 35', () => {
  const Result: Type.TObject<{
    name: Type.TOptional<
      Type.TWith<Type.TString, {
        description: 'description'
      }>
    >
    age: Type.TOptional<
      Type.TWith<Type.TNumber, {
        description: 'description'
      }>
    >
  }> = Type.Script(`
    type Described<T> = {
      [K in keyof T]?: T[K] with { description: 'description' }
    }
    type Input = { name: string, age: number }
    type Result = Described<Input>
  `).Result
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsOptional(Result.properties.name))
  Assert.IsEqual(Result.properties.name.description, 'description')
  Assert.IsTrue(Type.IsOptional(Result.properties.age))
  Assert.IsEqual(Result.properties.age.description, 'description')
})
Test('Should With 36', () => {
  const Result = Type.Script(`
    type Constrain<T> = {
      [K in keyof T]: T[K] with { minimum: 0 }
    }
    type A = Constrain<{ x: number }>
    type B = Constrain<{ y: number }>
    type Result = A | B
  `).Result
  Assert.IsTrue(Type.IsUnion(Result))
  Assert.IsEqual(Result.anyOf.length, 2)
  Assert.IsTrue(Type.IsObject(Result.anyOf[0]))
  Assert.IsEqual(Result.anyOf[0].properties.x.minimum, 0)
  Assert.IsTrue(Type.IsObject(Result.anyOf[1]))
  Assert.IsEqual(Result.anyOf[1].properties.y.minimum, 0)
})
Test('Should With 37', () => {
  const Result = Type.Script(`
    type Constrain<T> = {
      [K in keyof T]: T[K] with { minimum: 0 }
    }
    type A = Constrain<{ x: number }>
    type B = Constrain<{ y: number }>
    type Result = A & B
  `).Result
  Assert.IsTrue(Type.IsIntersect(Result))
  Assert.IsEqual(Result.allOf.length, 2)
  Assert.IsTrue(Type.IsObject(Result.allOf[0]))
  Assert.IsEqual(Result.allOf[0].properties.x.minimum, 0)
  Assert.IsTrue(Type.IsObject(Result.allOf[1]))
  Assert.IsEqual(Result.allOf[1].properties.y.minimum, 0)
})
// ------------------------------------------------------------------
// Evaluate
// ------------------------------------------------------------------
Test('Should With 38', () => {
  const Result: Type.TObject<{
    x: Type.TWith<Type.TNumber, { minimum: 0 }>
    y: Type.TWith<Type.TNumber, { minimum: 0 }>
  }> = Type.Script(`
    type Constrain<T> = {
      [K in keyof T]: T[K] with { minimum: 0 }
    }
    type A = Constrain<{ x: number }>
    type B = Constrain<{ y: number }>
    type Result = Evaluate<A & B>
  `).Result
  Assert.IsTrue(Type.IsObject(Result))
  Assert.IsTrue(Type.IsNumber(Result.properties.x))
  Assert.IsEqual(Result.properties.x.minimum, 0)
  Assert.IsTrue(Type.IsNumber(Result.properties.y))
  Assert.IsEqual(Result.properties.y.minimum, 0)
})
// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
Test('Should With 39', () => {
  const Result: Type.TWithDeferred<Type.TRef<'R'>, { value: 1 }> = Type.Script(`R with { value: 1 }`)
  Assert.IsTrue(Type.IsDeferred(Result))
  Assert.IsEqual(Result.action, 'With')
  Assert.IsTrue(Type.IsRef(Result.parameters[0]))
  Assert.IsEqual(Result.parameters[1], { value: 1 })
})
Test('Should With 40', () => {
  const Result: Type.TWith<Type.TString, { value: 1 }> = Type.Script({ R: Type.String() }, `R with { value: 1 }`)
  Assert.IsTrue(Type.IsString(Result))
  Assert.IsEqual(Result.value, 1)
})
// ------------------------------------------------------------------
// Syntax With Variation
// ------------------------------------------------------------------
Test('Should With 41', () => {
  const Result: Type.TString = Type.Script('string with 1')
  Assert.IsTrue(Type.IsString(Result))
})
Test('Should With 42', () => {
  const Result: Type.TString = Type.Script('string with []')
  Assert.IsTrue(Type.IsString(Result))
})
Test('Should With 43', () => {
  const Result: Type.TNever = Type.Script('{ x: string with 1 }')
  Assert.IsTrue(Type.IsNever(Result))
})
Test('Should With 44', () => {
  const Result: Type.TNever = Type.Script('{ x: string with [] }')
  Assert.IsTrue(Type.IsNever(Result))
})
Test('Should With 45', () => {
  const Result: Type.TWith<Type.TString, {
    value: 1
  }> = Type.Script('string with { value: 1 }')
  Assert.IsEqual(Result.value, 1)
})
Test('Should With 46', () => {
  const Result: Type.TWith<Type.TString, {
    value: {
      x: 1
    }
  }> = Type.Script('string with { value: { x: 1 } }')
  Assert.IsEqual(Result.value, { x: 1 })
})
Test('Should With 47', () => {
  const Result: Type.TWith<Type.TString, {
    value: [1, null, true, 'hello']
  }> = Type.Script('string with { value: [1, null, true, "hello"] }')
  Assert.IsEqual(Result.value, [1, null, true, 'hello'])
})
Test('Should With 48', () => {
  const Result: Type.TWith<Type.TString, {
    value: {
      x: [1, null, true, 'hello']
    }
  }> = Type.Script('string with { value: { x: [1, null, true, "hello"] } }')
  Assert.IsEqual(Result.value, { x: [1, null, true, 'hello'] })
})
Test('Should With 49', () => {
  const Result: Type.TWith<Type.TString, {
    value: [{
      x: 1
    }]
  }> = Type.Script('string with { value: [{ x: 1 }] }')
  Assert.IsEqual(Result.value, [{ x: 1 }])
})
Test('Should With 50', () => {
  const Result: Type.TWith<Type.TString, {
    value: null
  }> = Type.Script('string with { value: null }')
  Assert.IsEqual(Result.value, null)
})
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
Test('Should With 51', () => {
  const Result: Type.TWith<Type.TUnknown, {
    value: 100n
  }> = Type.Script('unknown with { value: 100n }')
  Assert.IsEqual(Result.value, 100n)
})
Test('Should With 52', () => {
  const Result: Type.TWith<Type.TUnknown, {
    value: 100n
  }> = Type.Script('unknown with { value: 1_00n }')
  Assert.IsEqual(Result.value, 100n)
})
Test('Should With 52', () => {
  const Result: Type.TWith<Type.TUnknown, {
    value: [100n]
  }> = Type.Script('unknown with { value: [100n] }')
  Assert.IsEqual(Result.value, [100n])
})
Test('Should With 54', () => {
  const Result: Type.TWith<Type.TUnknown, {
    value: {
      x: 100n
    }
  }> = Type.Script('unknown with { value: { x: 100n } }')
  Assert.IsEqual(Result.value, { x: 100n })
})
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
Test('Should With 55', () => {
  const Result: Type.TWith<Type.TUnknown, {
    value: undefined
  }> = Type.Script('unknown with { value: undefined }')
  Assert.IsEqual(Result.value, undefined)
})
Test('Should With 56', () => {
  const Result: Type.TWith<Type.TUnknown, {
    value: {
      x: undefined
    }
  }> = Type.Script('unknown with { value: { x: undefined } }')
  Assert.IsEqual(Result.value, { x: undefined })
})
