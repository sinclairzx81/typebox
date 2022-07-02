import { Type } from '@sinclair/typebox'
import { TypeGuard } from '@sinclair/typebox/guards'
import { Assert } from '../assert/index'

describe('guards/isTSchema', () => {
  it('Should pass schemas', () => {
    Assert.equal(TypeGuard.isTSchema(Type.Any()), true)
  })

  it('Should fail non-schemas', () => {
    Assert.equal(TypeGuard.isTSchema({}), false)
  })
})
