import { Type, Guards } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('guards/typeGuardFactory', () => {
  it('Should pass schemas with given kind', () => {
    Assert.equal(Guards.isTAny(Type.Any()), true)
  })

  it('Should fail schemas without given kind', () => {
    Assert.equal(Guards.isTAny({}), false)
  })
})
