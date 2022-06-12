import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/compiler/Enum', () => {
  it('Should validate when emum uses default numeric values', () => {
    enum Kind {
      Foo, // = 0
      Bar, // = 1
    }
    const T = Type.Enum(Kind)
    ok(T, 0)
    ok(T, 1)
  })
  it('Should not validate when given enum values are not numeric', () => {
    enum Kind {
      Foo, // = 0
      Bar, // = 1
    }
    const T = Type.Enum(Kind)
    fail(T, 'Foo')
    fail(T, 'Bar')
  })

  it('Should validate when emum has defined string values', () => {
    enum Kind {
      Foo = 'foo',
      Bar = 'bar',
    }
    const T = Type.Enum(Kind)
    ok(T, 'foo')
    ok(T, 'bar')
  })

  it('Should not validate when emum has defined string values and user passes numeric', () => {
    enum Kind {
      Foo = 'foo',
      Bar = 'bar',
    }
    const T = Type.Enum(Kind)
    fail(T, 0)
    fail(T, 1)
  })

  it('Should validate when enum has one or more string values', () => {
    enum Kind {
      Foo,
      Bar = 'bar',
    }
    const T = Type.Enum(Kind)
    ok(T, 0)
    ok(T, 'bar')
    fail(T, 'baz')
    fail(T, 'Foo')
    fail(T, 1)
  })
})
