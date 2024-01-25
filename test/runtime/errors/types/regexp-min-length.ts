import { Type } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/RegExpMinLength', () => {
  const T = Type.RegExp(/(.*)/, {
    minLength: 4,
  })
  it('Should pass 0', () => {
    const R = Resolve(T, 'xxxx')
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 'xxx')
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.StringMinLength)
  })
})
