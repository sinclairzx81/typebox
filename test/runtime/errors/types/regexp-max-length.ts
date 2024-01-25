import { Type, FormatRegistry } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/RegExpMaxLength', () => {
  const T = Type.RegExp(/(.*)/, {
    maxLength: 4,
  })
  it('Should pass 0', () => {
    const R = Resolve(T, 'xxxx')
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 'xxxxx')
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.StringMaxLength)
  })
})
