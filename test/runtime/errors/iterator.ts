import { Type } from '@sinclair/typebox'
import { ValueErrors } from '@sinclair/typebox/errors'
import { Assert } from '../assert'

describe('errors/ValueErrorIterator', () => {
  it('Should return undefined for non error', () => {
    const R = ValueErrors.Errors(Type.Number(), [], 1).First()
    Assert.equal(R, undefined)
  })
  it('Should return a value error when error', () => {
    const { type, path, message } = ValueErrors.Errors(Type.Number(), [], '').First()!
    Assert.isTypeOf(type, 'number')
    Assert.isTypeOf(path, 'string')
    Assert.isTypeOf(message, 'string')
  })
  it('Should yield empty array for non error', () => {
    const R = [...ValueErrors.Errors(Type.Number(), [], 1)]
    Assert.equal(R.length, 0)
  })
  it('Should yield array with 1 error when error', () => {
    const R = [...ValueErrors.Errors(Type.Number(), [], 'foo')]
    Assert.equal(R.length, 1)
  })
  it('Should yield array with N errors when error', () => {
    // prettier-ignore
    const R = [...ValueErrors.Errors(Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }), [], {})] // require object to invoke internal check
    Assert.equal(R.length > 1, true)
  })
})
