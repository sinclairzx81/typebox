import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Unsafe', () => {
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
    Ok(T, { x: 1, y: 2, z: 3 })
    Fail(T, { x: 1, y: 2, z: 3, w: 4 })
  })
})
