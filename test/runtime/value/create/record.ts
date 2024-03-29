import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/create/Record', () => {
  it('Should create value', () => {
    const T = Type.Record(Type.String(), Type.Object({}))
    Assert.IsEqual(Value.Create(T), {})
  })
  it('Should create default', () => {
    const T = Type.Record(Type.String(), Type.Object({}), {
      default: {
        x: {},
      },
    })
    Assert.IsEqual(Value.Create(T), { x: {} })
  })
})
