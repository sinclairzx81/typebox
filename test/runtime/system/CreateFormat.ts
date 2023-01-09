import { Ok, Fail } from '../compiler/validate'
import { Assert } from '../assert/index'
import { TypeSystem } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'

describe('TypeSystem/CreateFormat', () => {
  it('Should create and validate a format', () => {
    TypeSystem.CreateFormat('CreateFormat0', (value) => value === value.toLowerCase())
    const T = Type.String({ format: 'CreateFormat0' })
    Ok(T, 'action')
    Fail(T, 'ACTION')
  })
  it('Should throw if registering the same format twice', () => {
    TypeSystem.CreateFormat('CreateFormat1', (value) => true)
    Assert.throws(() => TypeSystem.CreateFormat('CreateFormat1', (value) => true))
  })
})
