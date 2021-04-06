import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import * as assert from 'assert'

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
      
    assert.strictEqual(T.type, 'number')
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
      
    assert.strictEqual(T.type, 'string')
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
      
    assert.deepStrictEqual(T.type, ['string', 'number'])
  })

  it('empty enum', () => {
    enum EmptyEnum {}
    const T = Type.Enum(EmptyEnum)
    assert.strictEqual(T.type, undefined)
  })
})
