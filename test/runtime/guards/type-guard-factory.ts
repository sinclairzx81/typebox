import { Type } from '@sinclair/typebox'
import { TypeGuard } from '@sinclair/typebox/guards'
import { Assert } from '../assert/index'

describe('guards/typeGuardFactory', () => {
  it('Should pass schemas with given kind', () => {
    Assert.equal(TypeGuard.isTAny(Type.Any()), true)
  })

  it('Should fail schemas without given kind', () => {
    Assert.equal(TypeGuard.isTAny({}), false)
  })
})
