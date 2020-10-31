import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Enum<T>', () => {
  it('number enum', () => {
    enum NumberEnum {
      Foo, // = 0
      Bar  // = 1
    }
    const T = Type.Enum(NumberEnum)
    fail(T, 'baz')
    fail(T, 'Foo')
    ok(T, 0)
    ok(T, 1)
  })

  it('string enum', () => {
    enum StringEnum {
      Foo = 'foo',
      Bar = 'bar'
    }
    const T = Type.Enum(StringEnum)
    fail(T, 'baz')
    fail(T, 'Foo')
    ok(T, 'foo')
    ok(T, 'bar')
  })

  it('mixed string|number enum', () => {
    enum MixedEnum {
      Foo,
      Bar = 'bar'
    }
    const T = Type.Enum(MixedEnum)
    fail(T, 'baz')
    fail(T, 'Foo')
    fail(T, 1)
    ok(T, 0)
    ok(T, 'bar')
  })
})
