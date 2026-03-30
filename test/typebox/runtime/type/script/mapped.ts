import { Assert } from 'test'
import * as Type from 'typebox'
import Guard from 'typebox/guard'

const Test = Assert.Context('Type.Script.Mapped')

// ------------------------------------------------------------------
// Identity
// ------------------------------------------------------------------
Test('Should Mapped 1', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(
    { T },
    `{
    [K in keyof T]: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsNumber(S.properties.y))
})
// ------------------------------------------------------------------
// Additive Modifiers
// ------------------------------------------------------------------
Test('Should Mapped 2', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TOptional<Type.TNumber>
  }> = Type.Script(
    { T },
    `{
    [K in keyof T]?: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsOptional(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsOptional(S.properties.y))
})

Test('Should Mapped 3', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TNumber>
  }> = Type.Script(
    { T },
    `{
    readonly [K in keyof T]: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsReadonly(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsReadonly(S.properties.y))
})
Test('Should Mapped 4', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(
    { T },
    `{
    readonly [K in keyof T]?: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsReadonly(S.properties.x))
  Assert.IsTrue(Type.IsOptional(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsReadonly(S.properties.y))
  Assert.IsTrue(Type.IsOptional(S.properties.y))
})
// ------------------------------------------------------------------
// Additive Modifiers (with +)
// ------------------------------------------------------------------
Test('Should Mapped 5', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TOptional<Type.TNumber>
    y: Type.TOptional<Type.TNumber>
  }> = Type.Script(
    { T },
    `{
    [K in keyof T]+?: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsOptional(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsOptional(S.properties.y))
})

Test('Should Mapped 6', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TReadonly<Type.TNumber>
    y: Type.TReadonly<Type.TNumber>
  }> = Type.Script(
    { T },
    `{
    +readonly [K in keyof T]: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsReadonly(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsReadonly(S.properties.y))
})
Test('Should Mapped 7', () => {
  const T = Type.Script(`{ x: number, y: number }`)
  const S: Type.TObject<{
    x: Type.TReadonly<Type.TOptional<Type.TNumber>>
    y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(
    { T },
    `{
    +readonly [K in keyof T]+?: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsReadonly(S.properties.x))
  Assert.IsTrue(Type.IsOptional(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsReadonly(S.properties.y))
  Assert.IsTrue(Type.IsOptional(S.properties.y))
})
// ------------------------------------------------------------------
// Subtractive Modifiers
// ------------------------------------------------------------------
Test('Should Mapped 8', () => {
  const T = Type.Script(`{ x?: number, y?: number }`)
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(
    { T },
    `{
    [K in keyof T]-?: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsFalse(Type.IsOptional(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsFalse(Type.IsOptional(S.properties.y))
})
Test('Should Mapped 9', () => {
  const T = Type.Script(`{ readonly x: number, readonly y: number }`)
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(
    { T },
    `{
    -readonly [K in keyof T]: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsFalse(Type.IsReadonly(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsFalse(Type.IsReadonly(S.properties.y))
})
Test('Should Mapped 10', () => {
  const T = Type.Script(`{ readonly x?: number, readonly y?: number }`)
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script(
    { T },
    `{
    -readonly [K in keyof T]-?: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsFalse(Type.IsReadonly(S.properties.x))
  Assert.IsFalse(Type.IsOptional(S.properties.x))

  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsFalse(Type.IsReadonly(S.properties.y))
  Assert.IsFalse(Type.IsOptional(S.properties.y))
})
// ------------------------------------------------------------------
// Mapped As
// ------------------------------------------------------------------
Test('Should Mapped 11', () => {
  const T = Type.Script(`{ readonly x?: number, readonly y?: number }`)
  const S: Type.TObject<{
    X: Type.TReadonly<Type.TOptional<Type.TNumber>>
    Y: Type.TReadonly<Type.TOptional<Type.TNumber>>
  }> = Type.Script(
    { T },
    `{
    [K in keyof T as Uppercase<K>]: T[K]
  }`
  )
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.X))
  Assert.IsTrue(Type.IsNumber(S.properties.Y))
})
// ------------------------------------------------------------------
// Mapped: Unknown Enumeration
// ------------------------------------------------------------------
Test('Should Mapped 12', () => {
  const A = Type.Null()
  const S: Type.TObject<{}> = Type.Script({ A }, '{ [K in A]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(Guard.Keys(S.properties), [])
})
// ------------------------------------------------------------------
// Mapped: Symbols Non-Enumerable
// ------------------------------------------------------------------
Test('Should Mapped 13', () => {
  const K = Symbol()
  const T = Type.Object({
    [K]: Type.Number()
  })
  const S: Type.TObject<{}> = Type.Script({ T }, '{ [K in keyof T]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(Guard.Keys(S.properties), [])
})
// ------------------------------------------------------------------
// Mapped: Literal Enumeration
// ------------------------------------------------------------------
Test('Should Mapped 14', () => {
  const A = Type.Literal('x')
  const S: Type.TObject<{
    x: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
})
Test('Should Mapped 15', () => {
  const A = Type.Literal('x')
  const S: Type.TObject<{
    X: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A as Uppercase<K>]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.X))
})
Test('Should Mapped 16', () => {
  const A = Type.Literal(1)
  const S: Type.TObject<{
    1: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties['1']))
})
// ------------------------------------------------------------------
// Mapped: Union Enumeration
// ------------------------------------------------------------------
Test('Should Mapped 17', () => {
  const A = Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ])
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsNumber(S.properties.y))
})
Test('Should Mapped 18', () => {
  const A = Type.Union([
    Type.Literal('x'),
    Type.Literal('y')
  ])
  const S: Type.TObject<{
    X: Type.TNumber
    Y: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A as Uppercase<K>]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.X))
  Assert.IsTrue(Type.IsNumber(S.properties.Y))
})
// ------------------------------------------------------------------
// Mapped: Enum Enumeration
// ------------------------------------------------------------------
Test('Should Mapped 19', () => {
  const A = Type.Enum(['x', 'y'])
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsNumber(S.properties.y))
})
Test('Should Mapped 20', () => {
  const A = Type.Enum(['x', 'y'])
  const S: Type.TObject<{
    X: Type.TNumber
    Y: Type.TNumber
  }> = Type.Script({ A }, '{ [K in A as Uppercase<K>]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.X))
  Assert.IsTrue(Type.IsNumber(S.properties.Y))
})
// ------------------------------------------------------------------
// Mapped: TemplateLiteral Enumeration
// ------------------------------------------------------------------
Test('Should Mapped 21', () => {
  const S: Type.TObject<{
    x0: Type.TNumber
    x1: Type.TNumber
  }> = Type.Script('{ [K in `x${0 | 1}`]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x0))
  Assert.IsTrue(Type.IsNumber(S.properties.x1))
})
Test('Should Mapped 22', () => {
  const S: Type.TObject<{
    X0: Type.TNumber
    X1: Type.TNumber
  }> = Type.Script('{ [K in `x${0 | 1}` as Uppercase<K>]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.X0))
  Assert.IsTrue(Type.IsNumber(S.properties.X1))
})
// ------------------------------------------------------------------
// Mapped: As Mapping
// ------------------------------------------------------------------
Test('Should Mapped 23', () => {
  const S: Type.TObject<{
    x: Type.TNumber
    y: Type.TNumber
    z: Type.TNumber
  }> = Type.Script('{ [K in "x" | "y" | "z" as K]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x))
  Assert.IsTrue(Type.IsNumber(S.properties.y))
  Assert.IsTrue(Type.IsNumber(S.properties.z))
})
Test('Should Mapped 23', () => {
  const S = Type.Script('{ [K in 1 | 2 | 3 as K]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties[1]))
  Assert.IsTrue(Type.IsNumber(S.properties[2]))
  Assert.IsTrue(Type.IsNumber(S.properties[3]))
})
Test('Should Mapped 23', () => {
  const S = Type.Script('{ [K in 1 | 2 | 3 as boolean]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(Guard.Keys(S.properties).length, 0)
})
// ------------------------------------------------------------------
// Mapped: TemplateLiteral Enumeration Mapping
// ------------------------------------------------------------------
Test('Should Mapped 23', () => {
  const S: Type.TObject<{
    x0: Type.TNumber
    x1: Type.TNumber
    x2: Type.TNumber
  }> = Type.Script('{ [K in 0 | 1 | 2 as `x${K}`]: number }')
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsTrue(Type.IsNumber(S.properties.x0))
  Assert.IsTrue(Type.IsNumber(S.properties.x1))
  Assert.IsTrue(Type.IsNumber(S.properties.x2))
})
// ------------------------------------------------------------------
// Mapped: Variant Mapping (Phase 2 - March 2026)
// ------------------------------------------------------------------
Test('Should Mapped 24', () => {
  const S: Type.TObject<{
    foo: Type.TUnion<[
      Type.TObject<{
        type: Type.TLiteral<'foo'>
      }>,
      Type.TObject<{
        type: Type.TLiteral<'bar'>
      }>,
      Type.TObject<{
        type: Type.TLiteral<'baz'>
      }>
    ]>
    bar: Type.TUnion<[
      Type.TObject<{
        type: Type.TLiteral<'foo'>
      }>,
      Type.TObject<{
        type: Type.TLiteral<'bar'>
      }>,
      Type.TObject<{
        type: Type.TLiteral<'baz'>
      }>
    ]>
    baz: Type.TUnion<[
      Type.TObject<{
        type: Type.TLiteral<'foo'>
      }>,
      Type.TObject<{
        type: Type.TLiteral<'bar'>
      }>,
      Type.TObject<{
        type: Type.TLiteral<'baz'>
      }>
    ]>
  }> = Type.Script(`
    type Map<T extends { type: string }> = {
      [K in T as K['type']]: T
    }
    type T = { type: 'foo' } | { type: 'bar' } | { type: 'baz'  }

    type S = Map<T>
  `).S
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(S.properties.foo.anyOf[0].properties.type.const, 'foo')
  Assert.IsEqual(S.properties.foo.anyOf[1].properties.type.const, 'bar')
  Assert.IsEqual(S.properties.foo.anyOf[2].properties.type.const, 'baz')
  Assert.IsEqual(S.properties.bar.anyOf[0].properties.type.const, 'foo')
  Assert.IsEqual(S.properties.bar.anyOf[1].properties.type.const, 'bar')
  Assert.IsEqual(S.properties.bar.anyOf[2].properties.type.const, 'baz')
  Assert.IsEqual(S.properties.baz.anyOf[0].properties.type.const, 'foo')
  Assert.IsEqual(S.properties.baz.anyOf[1].properties.type.const, 'bar')
  Assert.IsEqual(S.properties.baz.anyOf[2].properties.type.const, 'baz')
})
Test('Should Mapped 25', () => {
  const S: Type.TObject<{
    foo: Type.TObject<{
      type: Type.TLiteral<'foo'>
    }>
    bar: Type.TObject<{
      type: Type.TLiteral<'bar'>
    }>
    baz: Type.TObject<{
      type: Type.TLiteral<'baz'>
    }>
  }> = Type.Script(`
    type Map<T extends { type: string }> = {
      [K in T as K['type']]: K
    }
    type T = { type: 'foo' } | { type: 'bar' } | { type: 'baz'  }

    type S = Map<T>
  `).S
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(S.properties.foo.properties.type.const, 'foo')
  Assert.IsEqual(S.properties.bar.properties.type.const, 'bar')
  Assert.IsEqual(S.properties.baz.properties.type.const, 'baz')
})
Test('Should Mapped 26', () => {
  // Multiple properties per member, value is K
  const S: Type.TObject<{
    user: Type.TObject<{
      type: Type.TLiteral<'user'>
      id: Type.TNumber
      name: Type.TString
    }>
    post: Type.TObject<{
      type: Type.TLiteral<'post'>
      id: Type.TNumber
      title: Type.TString
    }>
  }> = Type.Script(`
    type Map<T extends { type: string }> = {
      [K in T as K['type']]: K
    }
    type T =
      | { type: 'user'; id: number; name: string }
      | { type: 'post'; id: number; title: string }
    type S = Map<T>
  `).S
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(S.properties.user.properties.type.const, 'user')
  Assert.IsEqual(S.properties.user.properties.id.type, 'number')
  Assert.IsEqual(S.properties.user.properties.name.type, 'string')
  Assert.IsEqual(S.properties.post.properties.type.const, 'post')
  Assert.IsEqual(S.properties.post.properties.id.type, 'number')
  Assert.IsEqual(S.properties.post.properties.title.type, 'string')
})
Test('Should Mapped 27', () => {
  const S: Type.TObject<{
    circle: Type.TObject<{
      type: Type.TLiteral<'circle'>
      radius: Type.TNumber
    }>
    rect: Type.TObject<{
      type: Type.TLiteral<'rect'>
      width: Type.TNumber
      height: Type.TNumber
    }>
  }> = Type.Script(`
    type Map<T extends { type: string }> = {
      [K in T as K['type']]: K
    }
    type S = Map<
      | { type: 'circle'; radius: number }
      | { type: 'rect'; width: number; height: number }
    >
  `).S
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(S.properties.circle.properties.type.const, 'circle')
  Assert.IsEqual(S.properties.circle.properties.radius.type, 'number')
  Assert.IsEqual(S.properties.rect.properties.type.const, 'rect')
  Assert.IsEqual(S.properties.rect.properties.width.type, 'number')
  Assert.IsEqual(S.properties.rect.properties.height.type, 'number')
})
Test('Should Mapped 28', () => {
  const S: Type.TObject<{
    admin: Type.TObject<{
      type: Type.TLiteral<'admin'>
      role: Type.TUnion<[Type.TLiteral<'superadmin'>, Type.TLiteral<'moderator'>]>
    }>
    guest: Type.TObject<{
      type: Type.TLiteral<'guest'>
      role: Type.TLiteral<'readonly'>
    }>
  }> = Type.Script(`
    type Map<T extends { type: string }> = {
      [K in T as K['type']]: K
    }
    type T =
      | { type: 'admin'; role: 'superadmin' | 'moderator' }
      | { type: 'guest'; role: 'readonly' }
    type S = Map<T>
  `).S
  Assert.IsTrue(Type.IsObject(S))
  Assert.IsEqual(S.properties.admin.properties.type.const, 'admin')
  Assert.IsEqual(S.properties.admin.properties.role.anyOf[0].const, 'superadmin')
  Assert.IsEqual(S.properties.admin.properties.role.anyOf[1].const, 'moderator')
  Assert.IsEqual(S.properties.guest.properties.type.const, 'guest')
  Assert.IsEqual(S.properties.guest.properties.role.const, 'readonly')
})
Test('Should Mapped 29', () => {
  const S: Type.TUnion<[
    Type.TObject<{
      x: Type.TLiteral<'qux'>
    }>,
    Type.TObject<{
      x: Type.TLiteral<'foo'>
      y: Type.TLiteral<'bar'>
      z: Type.TLiteral<'baz'>
    }>
  ]> = Type.Script(`
    type Map<T> = {
      [K in keyof T]: T[K]
    }
    type S = Map<{ x: 'qux' } | {
      x: 'foo'
      y: 'bar'
      z: 'baz'
    }>
  `).S
  Assert.IsTrue(Type.IsUnion(S))
  Assert.IsEqual(S.anyOf[0].properties.x.const, 'qux')
  Assert.IsEqual(S.anyOf[1].properties.x.const, 'foo')
  Assert.IsEqual(S.anyOf[1].properties.y.const, 'bar')
  Assert.IsEqual(S.anyOf[1].properties.z.const, 'baz')
})
