import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Literal', () => {
  it('Should validate literal number', () => {
    const T = Type.Literal(42)
    ok(T, 42)
  })
  it('Should validate literal string', () => {
    const T = Type.Literal('hello')
    ok(T, 'hello')
  })

  it('Should validate literal boolean', () => {
    const T = Type.Literal(true)
    ok(T, true)
  })

  it('Should not validate invalid literal number', () => {
    const T = Type.Literal(42)
    fail(T, 43)
  })
  it('Should not validate invalid literal string', () => {
    const T = Type.Literal('hello')
    fail(T, 'world')
  })
  it('Should not validate invalid literal boolean', () => {
    const T = Type.Literal(false)
    fail(T, true)
  })

  it('Should validate literal union', () => {
    const T = Type.Union([Type.Literal(42), Type.Literal('hello')])
    ok(T, 42)
    ok(T, 'hello')
  })

  it('Should not validate invalid literal union', () => {
    const T = Type.Union([Type.Literal(42), Type.Literal('hello')])
    fail(T, 43)
    fail(T, 'world')
  })
})
