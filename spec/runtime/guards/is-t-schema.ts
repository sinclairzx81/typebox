import { Type, Guards } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('guards/isTSchema', () => {
  it('Should pass schemas', () => {
    Assert.equal(Guards.isTSchema(Type.Any()), true)
  })

  it('Should fail non-schemas', () => {
    Assert.equal(Guards.isTSchema({}), false)
  })
})
