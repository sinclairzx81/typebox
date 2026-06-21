import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Modifiers')

Test('Should Modifiers 1', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(`{
    readonly x?: number
    readonly y?: number
  }`)
  const B: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(
    { A },
    `{
    [K in keyof A]: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsReadonly(B.properties.x))
  Assert.IsTrue(Type.IsReadonly(B.properties.y))

  Assert.IsTrue(Type.IsOptional(B.properties.x))
  Assert.IsTrue(Type.IsOptional(B.properties.y))
})
Test('Should Modifiers 2', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(`{
    readonly x?: number
    readonly y?: number
  }`)
  const B: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TOptional<Type.TNumber>
  }> = Type.Script(
    { A },
    `{
    -readonly [K in keyof A]: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsFalse(Type.IsReadonly(B.properties.x))
  Assert.IsFalse(Type.IsReadonly(B.properties.y))

  Assert.IsTrue(Type.IsOptional(B.properties.x))
  Assert.IsTrue(Type.IsOptional(B.properties.y))
})
Test('Should Modifiers 3', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(`{
    readonly x?: number
    readonly y?: number
  }`)
  const B: Type.TObject<{
    x: Type.TNumber & {
      '~readonly': true
    }
    y: Type.TNumber & {
      '~readonly': true
    }
  }> = Type.Script(
    { A },
    `{
    [K in keyof A]-?: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsReadonly(B.properties.x))
  Assert.IsTrue(Type.IsReadonly(B.properties.y))

  Assert.IsFalse(Type.IsOptional(B.properties.x))
  Assert.IsFalse(Type.IsOptional(B.properties.y))
})
Test('Should Modifiers 4', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(`{
    readonly x?: number
    readonly y?: number
  }`)

  const B: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(
    { A },
    `{
    -readonly [K in keyof A]-?: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsFalse(Type.IsReadonly(B.properties.x))
  Assert.IsFalse(Type.IsReadonly(B.properties.y))

  Assert.IsFalse(Type.IsOptional(B.properties.x))
  Assert.IsFalse(Type.IsOptional(B.properties.y))
})

// ------------------------------------------------------------------
// Varying
// ------------------------------------------------------------------
Test('Should Modifiers 5', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TNumber
  }> = Type.Script(`{
    readonly x?: number
    y: number
  }`)
  const B: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TNumber
  }> = Type.Script(
    { A },
    `{
    [K in keyof A]: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsReadonly(B.properties.x))
  Assert.IsFalse(Type.IsReadonly(B.properties.y))

  Assert.IsTrue(Type.IsOptional(B.properties.x))
  Assert.IsFalse(Type.IsOptional(B.properties.y))
})
Test('Should Modifiers 6', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TNumber
  }> = Type.Script(`{
    readonly x?: number
    y: number
  }`)
  const B: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TNumber
  }> = Type.Script(
    { A },
    `{
    -readonly [K in keyof A]: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsFalse(Type.IsReadonly(B.properties.x))
  Assert.IsFalse(Type.IsReadonly(B.properties.y))

  Assert.IsTrue(Type.IsOptional(B.properties.x))
  Assert.IsFalse(Type.IsOptional(B.properties.y))
})
Test('Should Modifiers 7', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TNumber
  }> = Type.Script(`{
    readonly x?: number
    y: number
  }`)
  const B: Type.TObject<{
    x: Type.TNumber & {
      '~readonly': true
    }
    y: Type.TNumber
  }> = Type.Script(
    { A },
    `{
    [K in keyof A]-?: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsTrue(Type.IsReadonly(B.properties.x))
  Assert.IsFalse(Type.IsReadonly(B.properties.y))

  Assert.IsFalse(Type.IsOptional(B.properties.x))
  Assert.IsFalse(Type.IsOptional(B.properties.y))
})
Test('Should Modifiers 8', () => {
  const A: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TNumber
  }> = Type.Script(`{
    readonly x?: number
    y: number
  }`)
  const B: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(
    { A },
    `{
    -readonly [K in keyof A]-?: A[K]  
  }`
  )

  Assert.IsTrue(Type.IsObject(B))
  Assert.IsFalse(Type.IsReadonly(B.properties.x))
  Assert.IsFalse(Type.IsReadonly(B.properties.y))

  Assert.IsFalse(Type.IsOptional(B.properties.x))
  Assert.IsFalse(Type.IsOptional(B.properties.y))
})
