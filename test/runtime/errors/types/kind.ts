import { TypeRegistry, Kind, TSchema } from '@sinclair/typebox'
import { ValueErrorType } from '@sinclair/typebox/errors'
import { Resolve } from './resolve'
import { Assert } from '../../assert'

describe('errors/type/Kind', () => {
  // ----------------------------------------------------
  // Fixture
  // ----------------------------------------------------
  beforeEach(() => TypeRegistry.Set('Foo', (schema, value) => value === 'foo'))
  afterEach(() => TypeRegistry.Delete('Foo'))
  // ----------------------------------------------------
  // Test
  // ----------------------------------------------------
  const T = { [Kind]: 'Foo' } as TSchema
  it('Should pass 0', () => {
    const R = Resolve(T, 'foo')
    Assert.IsEqual(R.length, 0)
  })
  it('Should pass 1', () => {
    const R = Resolve(T, 1)
    Assert.IsEqual(R.length, 1)
    Assert.IsEqual(R[0].type, ValueErrorType.Kind)
  })
})
