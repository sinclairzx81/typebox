import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/check/Custom', () => {
  const FooBar = Type.Unsafe({ [Kind]: 'FooBar' })
  before(() => {
    TypeRegistry.Set('FooBar', (schema, value) => value === 'foobar')
  })
  after(() => {
    TypeRegistry.Delete('FooBar')
  })
  it('Should validate foobar', () => {
    Assert.IsEqual(Value.Check(FooBar, 'foobar'), true)
  })
  it('Should not validate foobar', () => {
    Assert.IsEqual(Value.Check(FooBar, 1), false)
  })
  it('Should validate foobar nested', () => {
    // prettier-ignore
    const T = Type.Object({ x: FooBar })
    Assert.IsEqual(Value.Check(T, { x: 'foobar' }), true)
  })
  it('Should not validate foobar nested', () => {
    // prettier-ignore
    const T = Type.Object({ x: FooBar })
    Assert.IsEqual(Value.Check(T, { x: 1 }), false)
  })
})
