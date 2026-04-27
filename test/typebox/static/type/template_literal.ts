import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// template literals are like regular literals
{
  const T = Type.TemplateLiteral('hello')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... but support interpolation via embedded unions
{
  const T = Type.TemplateLiteral('hello ${"A" | "B"}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello A' | 'hello B'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... and will transform numbers into strings
{
  const T = Type.TemplateLiteral('hello ${1 | 2}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello 1' | 'hello 2'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... including bigint
{
  const T = Type.TemplateLiteral('hello ${1n | 2n}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello 1' | 'hello 2'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... they also accept exterior unions but require a more verbose API
{
  const A = Type.Union([
    Type.Literal('A'),
    Type.Literal('B')
  ])

  const T = Type.TemplateLiteral([Type.Literal('hello '), A])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello A' | 'hello B'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... which is smoothed over with Script syntax
{
  const A = Type.Union([
    Type.Literal('A'),
    Type.Literal('B')
  ])

  const T = Type.Script({ A }, '`hello ${A}`')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 'hello A' | 'hello B'>(true)
  Assert.IsExtendsMutual<T, null>(false)
}

// Template Literals work best with discrete finite unions and literals, but support
// embedded infinite types. These infer correctly for string
{
  const T = Type.TemplateLiteral('hello ${string}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, `hello ${string}`>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... and for number
{
  const T = Type.TemplateLiteral('hello ${number}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, `hello ${number}`>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... and for bigint
{
  const T = Type.TemplateLiteral('hello ${bigint}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, `hello ${bigint}`>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... and for boolean
{
  const T = Type.TemplateLiteral('hello ${boolean}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, `hello ${boolean}`>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ... but boolean literals are finite, so can infer as ${boolean}
{
  const T = Type.TemplateLiteral('hello ${true | false}')
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, `hello ${boolean}`>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
