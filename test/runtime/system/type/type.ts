import { Ok, Fail } from '../../compiler/validate'
import { TypeSystem } from '@sinclair/typebox/system'
import { TypeRegistry } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('system/TypeSystem/Type', () => {
  it('Should create and validate a type', () => {
    const Foo = TypeSystem.Type<string>('Foo', (options, value) => {
      Assert.IsEqual(options.option, 'test')
      return value === 'foo'
    })
    const T = Foo({ option: 'test' })
    Ok(T, 'foo')
    Fail(T, 'bar')
    TypeRegistry.Delete('Foo')
  })
  it('Should throw if registering the same type twice', () => {
    TypeSystem.Type('Foo', () => true)
    Assert.Throws(() => TypeSystem.Type('Foo', () => true))
    TypeRegistry.Delete('Foo')
  })
})
