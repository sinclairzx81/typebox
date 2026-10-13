import { Settings } from 'typebox/system'
import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Config.EnumerableKinds')

// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
Test('Should EnumerableKind 1', () => {
  Settings.Set({ enumerableKind: true })
  try {
    const T = Type.String()
    Assert.IsPropertyEnumerable(T, '~kind')
  } finally {
    Settings.Reset()
  }
})
Test('Should EnumerableKind 2', () => {
  Settings.Set({ enumerableKind: false })
  try {
    const T = Type.String()
    Assert.IsPropertyNonEnumerable(T, '~kind')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
Test('Should EnumerableKind 3', () => {
  Settings.Set({ enumerableKind: true })
  try {
    const T = Type.Optional(Type.String())
    Assert.IsPropertyEnumerable(T, '~kind')
    Assert.IsPropertyEnumerable(T, '~optional')
  } finally {
    Settings.Reset()
  }
})
Test('Should EnumerableKind 4', () => {
  Settings.Set({ enumerableKind: false })
  try {
    const T = Type.Optional(Type.String())
    Assert.IsPropertyNonEnumerable(T, '~kind')
    Assert.IsPropertyNonEnumerable(T, '~optional')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Readonly
// ------------------------------------------------------------------
Test('Should EnumerableKind 5', () => {
  Settings.Set({ enumerableKind: true })
  try {
    const T = Type.Readonly(Type.String())
    Assert.IsPropertyEnumerable(T, '~kind')
    Assert.IsPropertyEnumerable(T, '~readonly')
  } finally {
    Settings.Reset()
  }
})
Test('Should EnumerableKind 6', () => {
  Settings.Set({ enumerableKind: false })
  try {
    const T = Type.Readonly(Type.String())
    Assert.IsPropertyNonEnumerable(T, '~kind')
    Assert.IsPropertyNonEnumerable(T, '~readonly')
  } finally {
    Settings.Reset()
  }
})
// ------------------------------------------------------------------
// Immutable
// ------------------------------------------------------------------
Test('Should EnumerableKind 7', () => {
  Settings.Set({ enumerableKind: true })
  try {
    const T = Type.Immutable(Type.String())
    Assert.IsPropertyEnumerable(T, '~kind')
    Assert.IsPropertyEnumerable(T, '~immutable')
  } finally {
    Settings.Reset()
  }
})
Test('Should EnumerableKind 8', () => {
  Settings.Set({ enumerableKind: false })
  try {
    const T = Type.Immutable(Type.String())
    Assert.IsPropertyNonEnumerable(T, '~kind')
    Assert.IsPropertyNonEnumerable(T, '~immutable')
  } finally {
    Settings.Reset()
  }
})
