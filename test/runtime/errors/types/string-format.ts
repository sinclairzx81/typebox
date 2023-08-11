import { Type, FormatRegistry } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/StringFormat', () => {
  // ----------------------------------------------
  // Fixture
  // ----------------------------------------------
  beforeEach(() => FormatRegistry.Set('foo', (value) => value === 'foo'))
  afterEach(() => FormatRegistry.Delete('foo'))
  // ----------------------------------------------
  // Tests
  // ----------------------------------------------
  const T = Type.String({ format: 'foo' })
  it('Should pass 0', () => {
    const R = Resolve(T, 'foo')
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 'bar')
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.StringFormat)
  })
})
