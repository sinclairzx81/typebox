import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Tuple', () => {
  it('Should create value', () => {
    const T = Type.Tuple([Type.Number(), Type.String()])
    Assert.deepEqual(Value.Create(T), [0, ''])
  })
  it('Should create default', () => {
    const T = Type.Tuple([Type.Number(), Type.String()], { default: [7, 'hello'] })
    Assert.deepEqual(Value.Create(T), [7, 'hello'])
  })
  it('Should create default elements', () => {
    const T = Type.Tuple([Type.Number({ default: 7 }), Type.String({ default: 'hello' })])
    Assert.deepEqual(Value.Create(T), [7, 'hello'])
  })
  it('Should create default by overriding elements', () => {
    const T = Type.Tuple([Type.Number({ default: 7 }), Type.String({ default: 'hello' })], { default: [32, 'world'] })
    Assert.deepEqual(Value.Create(T), [32, 'world'])
  })
})
