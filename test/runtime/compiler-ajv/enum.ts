import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Enum', () => {
  it('Should validate when emum uses default numeric values', () => {
    enum Kind {
      Foo, // = 0
      Bar, // = 1
    }
    const T = Type.Enum(Kind)
    Ok(T, 0)
    Ok(T, 1)
  })
  it('Should not validate when given enum values are not numeric', () => {
    enum Kind {
      Foo, // = 0
      Bar, // = 1
    }
    const T = Type.Enum(Kind)
    Fail(T, 'Foo')
    Fail(T, 'Bar')
  })
  it('Should validate when emum has defined string values', () => {
    enum Kind {
      Foo = 'foo',
      Bar = 'bar',
    }
    const T = Type.Enum(Kind)
    Ok(T, 'foo')
    Ok(T, 'bar')
  })
  it('Should not validate when emum has defined string values and user passes numeric', () => {
    enum Kind {
      Foo = 'foo',
      Bar = 'bar',
    }
    const T = Type.Enum(Kind)
    Fail(T, 0)
    Fail(T, 1)
  })
  it('Should validate when enum has one or more string values', () => {
    enum Kind {
      Foo,
      Bar = 'bar',
    }
    const T = Type.Enum(Kind)
    Ok(T, 0)
    Ok(T, 'bar')
    Fail(T, 'baz')
    Fail(T, 'Foo')
    Fail(T, 1)
  })
})
