import { Settings } from 'typebox/system'
import { Assert } from 'test'
import Type from 'typebox'

const Test = Assert.Context('Type.Config.ImmutableTypes')

// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should ImmutableTypes 1', () => {
  Settings.Set({ immutableTypes: true })
  try {
    const A = Type.Object({
      x: Type.Readonly(Type.Optional(Type.Number())),
      y: Type.Number()
    })
    Assert.IsFrozen(A)
    Assert.IsFrozen(A.properties.x)
    Assert.IsFrozen(A.properties.y)
    Assert.IsTrue(Type.IsReadonly(A.properties.x))
    Assert.IsTrue(Type.IsOptional(A.properties.x))
    Assert.IsFalse(Type.IsReadonly(A.properties.y))
    Assert.IsFalse(Type.IsOptional(A.properties.y))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Index
// ------------------------------------------------------------------
Test('Should ImmutableTypes 2', () => {
  Settings.Set({ immutableTypes: true })
  try {
    const A = Type.Object({
      x: Type.Readonly(Type.Optional(Type.Number())),
      y: Type.Number()
    })
    const T = Type.Index(A, Type.Literal('x'))
    Assert.IsFrozen(A)
    Assert.IsFrozen(A.properties.x)
    Assert.IsFrozen(A.properties.y)
    Assert.IsFrozen(T)
    Assert.IsTrue(Type.IsReadonly(T))
    Assert.IsTrue(Type.IsOptional(T))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Omit
// ------------------------------------------------------------------
Test('Should ImmutableTypes 3', () => {
  Settings.Set({ immutableTypes: true })
  try {
    const A = Type.Object({
      x: Type.Readonly(Type.Optional(Type.Number())),
      y: Type.Readonly(Type.Number()),
      z: Type.Optional(Type.Number()),
      w: Type.Number()
    })
    const T = Type.Omit(A, ['z'])
    Assert.IsFrozen(A)
    Assert.IsFrozen(A.properties.x)
    Assert.IsFrozen(A.properties.y)
    Assert.IsFrozen(A.properties.z)
    Assert.IsFrozen(A.properties.w)
    Assert.IsFrozen(T)
    Assert.IsFrozen(T.properties.x)
    Assert.IsFrozen(T.properties.y)
    Assert.IsFrozen(T.properties.w)
    Assert.IsTrue(Type.IsReadonly(T.properties.x))
    Assert.IsTrue(Type.IsOptional(T.properties.x))
    Assert.IsTrue(Type.IsReadonly(T.properties.y))
    Assert.IsFalse(Type.IsOptional(T.properties.y))
    Assert.IsFalse(Type.IsReadonly(T.properties.w))
    Assert.NotHasPropertyKey(T.properties, 'z')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Partial
// ------------------------------------------------------------------
Test('Should ImmutableTypes 4', () => {
  Settings.Set({ immutableTypes: true })
  try {
    const A = Type.Object(
      {
        x: Type.Readonly(Type.Optional(Type.Number())),
        y: Type.Readonly(Type.Number()),
        z: Type.Optional(Type.Number()),
        w: Type.Number()
      },
      { additionalProperties: false }
    )
    const T = Type.Partial(A)
    Assert.IsFrozen(A)
    Assert.IsFrozen(A.properties.x)
    Assert.IsFrozen(A.properties.y)
    Assert.IsFrozen(A.properties.z)
    Assert.IsFrozen(A.properties.w)
    Assert.IsFrozen(T)
    Assert.IsFrozen(T.properties.x)
    Assert.IsFrozen(T.properties.y)
    Assert.IsFrozen(T.properties.z)
    Assert.IsFrozen(T.properties.w)
    Assert.IsTrue(Type.IsReadonly(T.properties.x))
    Assert.IsTrue(Type.IsOptional(T.properties.x))
    Assert.IsTrue(Type.IsReadonly(T.properties.y))
    Assert.IsTrue(Type.IsOptional(T.properties.y))
    Assert.IsTrue(Type.IsOptional(T.properties.z))
    Assert.IsTrue(Type.IsOptional(T.properties.w))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Pick
// ------------------------------------------------------------------
Test('Should ImmutableTypes 5', () => {
  Settings.Set({ immutableTypes: true })
  try {
    const A = Type.Object({
      x: Type.Readonly(Type.Optional(Type.Number())),
      y: Type.Readonly(Type.Number()),
      z: Type.Optional(Type.Number()),
      w: Type.Number()
    })
    const T = Type.Pick(A, ['x', 'y'])
    Assert.IsFrozen(A)
    Assert.IsFrozen(A.properties.x)
    Assert.IsFrozen(A.properties.y)
    Assert.IsFrozen(A.properties.z)
    Assert.IsFrozen(A.properties.w)
    Assert.IsFrozen(T)
    Assert.IsFrozen(T.properties.x)
    Assert.IsFrozen(T.properties.y)
    Assert.IsTrue(Type.IsReadonly(T.properties.x))
    Assert.IsTrue(Type.IsOptional(T.properties.x))
    Assert.IsTrue(Type.IsReadonly(T.properties.y))
    Assert.IsFalse(Type.IsOptional(T.properties.y))
    Assert.NotHasPropertyKey(T.properties, 'z')
    Assert.NotHasPropertyKey(T.properties, 'w')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
Test('Should ImmutableTypes 6', () => {
  Settings.Set({ immutableTypes: true })
  try {
    const A = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Readonly(Type.Optional(Type.Number())),
      z: Type.Readonly(Type.Number())
    })
    const T = Type.Required(A)
    Assert.IsFrozen(A)
    Assert.IsFrozen(A.properties.x)
    Assert.IsFrozen(A.properties.y)
    Assert.IsFrozen(A.properties.z)
    Assert.IsFrozen(T)
    Assert.IsFrozen(T.properties.x)
    Assert.IsFrozen(T.properties.y)
    Assert.IsFrozen(T.properties.z)
    Assert.IsFalse(Type.IsOptional(T.properties.x))
    Assert.IsFalse(Type.IsOptional(T.properties.y))
    Assert.IsTrue(Type.IsReadonly(T.properties.y))
    Assert.IsTrue(Type.IsReadonly(T.properties.z))
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Freeze
// ------------------------------------------------------------------
Test('Should ImmutableTypes 7', () => {
  Settings.Set({ immutableTypes: false })
  try {
    const Leaf = Type.Object({ value: Type.String() })
    const Inner = Type.Object({ leaf: Leaf })
    Assert.IsFalse(Object.isFrozen(Leaf))
    Assert.IsFalse(Object.isFrozen(Leaf.properties))
    Assert.IsFalse(Object.isFrozen(Inner))
    Assert.IsFalse(Object.isFrozen(Inner.properties))
    Settings.Set({ immutableTypes: true })
    const Root = Type.Object({ inner: Inner })
    Assert.IsFrozen(Root)
    Assert.IsFrozen(Root.properties)
    Assert.IsFrozen(Inner)
    Assert.IsFrozen(Inner.properties)
    Assert.IsFrozen(Leaf)
    Assert.IsFrozen(Leaf.properties)
    Assert.IsFrozen(Leaf.properties.value)
  } finally {
    Settings.Reset()
  }
})
