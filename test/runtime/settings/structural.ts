import { Ok, Fail } from '../compiler/validate'
import { TypeSystem } from '@sinclair/typebox/system'
import { Type } from '@sinclair/typebox'

describe('Settings/Structural', () => {
  before(() => {
    TypeSystem.Kind = 'structural'
  })
  after(() => {
    TypeSystem.Kind = 'json-schema'
  })

  // ---------------------------------------------------------------
  // Object
  // ---------------------------------------------------------------
  it('Should validate arrays with empty objects', () => {
    const T = Type.Object({})
    Ok(T, [0, 1, 2])
  })
  it('Should validate arrays with objects with length property', () => {
    const T = Type.Object({ length: Type.Number() })
    Ok(T, [0, 1, 2])
  })
  it('Should validate arrays with objects with additionalProperties false when array has no elements', () => {
    const T = Type.Object({ length: Type.Number() }, { additionalProperties: false })
    Ok(T, [])
  })
  it('Should not validate arrays with objects with additionalProperties false when array has elements', () => {
    const T = Type.Object({ length: Type.Number() }, { additionalProperties: false })
    Fail(T, [0, 1, 2])
  })
  it('Should not validate arrays with objects when length property is string', () => {
    const T = Type.Object({ length: Type.String() })
    Fail(T, [0, 1, 2])
  })
  // ---------------------------------------------------------------
  // Record
  // ---------------------------------------------------------------
  it('Should validate arrays as Records with String Keys', () => {
    const T = Type.Record(Type.String(), Type.Number())
    Ok(T, [0, 1, 2])
  })
  it('Should not validate arrays as Records with Number Keys', () => {
    const T = Type.Record(Type.Integer(), Type.Number())
    Fail(T, [0, 1, 2])
  })
  it('Should not validate arrays as Records with Object Values', () => {
    const T = Type.Record(
      Type.String(),
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      }),
    )
    Ok(T, [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: 1 },
    ])
  })
})
