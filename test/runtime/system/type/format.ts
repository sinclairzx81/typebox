import { Ok, Fail } from '../../compiler/validate'
import { Assert } from '../../assert/index'
import { TypeSystem } from '@sinclair/typebox/system'
import { Type, FormatRegistry } from '@sinclair/typebox'

describe('system/TypeSystem/Format', () => {
  it('Should create and validate a format', () => {
    const Foo = TypeSystem.Format('Foo', (value) => value === 'foo')
    const T = Type.String({ format: Foo })
    Ok(T, 'foo')
    Fail(T, 'bar')
    FormatRegistry.Delete('Foo')
  })
})
