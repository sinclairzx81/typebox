import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/default/Recursive', () => {
  it('Should use default', () => {
    const T = Type.Recursive((This) => Type.Object({
      nodes: Type.Array(This)
    }, { default: 1 }))
    const R = Value.Default(T, undefined)
    Assert.IsEqual(R, 1)
  })
  it('Should use value', () => {
    const T = Type.Recursive((This) => Type.Object({
      nodes: Type.Array(This)
    }, { default: 1 }))
    const R = Value.Default(T, null)
    Assert.IsEqual(R, null)
  })
  // ----------------------------------------------------------------
  // Recursive
  // ----------------------------------------------------------------
  it('Should use default recursive values', () => {
    const T = Type.Recursive((This) => Type.Object({
      id: Type.String({ default: 1 }),
      nodes: Type.Array(This, { default: [] }) // need this
    }))
    const R = Value.Default(T, {
      nodes: [{
        nodes: [{
          nodes: [{ id: null }]
        }, {
          nodes: [{ id: null }]
        }]
      }]
    })
    Assert.IsEqual(R, {
      nodes: [{
        nodes: [{
          nodes: [{
            id: null,
            nodes: []
          }],
          id: 1
        }, {
          nodes: [{
            id: null,
            nodes: []
          }],
          id: 1
        }],
        id: 1
      }],
      id: 1
    })
  })
})
