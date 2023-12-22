import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/default/Ref', () => {
  it('Should use default', () => {
    const A = Type.String({ $id: 'A' })
    const T = Type.Ref('A', { default: 1 })
    const R = Value.Default(T, [A], undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const A = Type.String({ $id: 'A' })
    const T = Type.Ref('A', { default: 1 })
    const R = Value.Default(T, [A], null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Foreign
  // ----------------------------------------------------------------
  it('Should use default on foreign value', () => {
    const A = Type.String({ $id: 'A', default: 1 })
    const T = Type.Ref('A')
    const R = Value.Default(T, [A], undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value on foreign value', () => {
    const A = Type.String({ $id: 'A', default: 1 })
    const T = Type.Ref('A')
    const R = Value.Default(T, [A], null)
    Assert.IsEqual(R, null)
  })
})
