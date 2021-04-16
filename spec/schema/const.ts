import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import * as assert from 'assert'

describe('Const<T>', () => {
  it('number const', () => {
    const T = Type.Const(10)
    fail(T, 'baz')
    fail(T, 'Foo')
    fail(T, 0)
    ok(T, 10)
      
    assert.strictEqual(T.const, 10)
  })

  it('string const', () => {
    const T = Type.Const('foo')
    fail(T, 'baz')
    fail(T, 'Foo')
    ok(T, 'foo')
      
    assert.strictEqual(T.const, 'foo')
  })
})
