import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('type/schema/Unsafe', () => {
  it('Should validate an unsafe type', () => {
    const T = Type.Unsafe({
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      additionalProperties: false,
    })
    ok(T, { x: 1, y: 2, z: 3 })
    fail(T, { x: 1, y: 2, z: 3, w: 4 })
  })
})
