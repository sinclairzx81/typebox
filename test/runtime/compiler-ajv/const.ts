import { Type } from '@sinclair/typebox'
import { Ok } from './validate'

describe('compiler-ajv/Const', () => {
  it('Should validate 1', () => {
    const T = Type.Const(1)
    Ok(T, 1)
  })
  it('Should validate 2', () => {
    const T = Type.Const('hello')
    Ok(T, 'hello')
  })
  it('Should validate 3', () => {
    const T = Type.Const(true)
    Ok(T, true)
  })
  it('Should validate 4', () => {
    const T = Type.Const({ x: 1, y: 2 })
    Ok(T, { x: 1, y: 2 })
  })
  it('Should validate 5', () => {
    const T = Type.Const([1, 2, 3])
    Ok(T, [1, 2, 3])
  })
  it('Should validate 6', () => {
    const T = Type.Const([1, true, 'hello'])
    Ok(T, [1, true, 'hello'])
  })
  it('Should validate 7', () => {
    const T = Type.Const({
      x: [1, 2, 3, 4],
      y: { x: 1, y: 2, z: 3 },
    })
    Ok(T, {
      x: [1, 2, 3, 4],
      y: { x: 1, y: 2, z: 3 },
    })
  })
})
