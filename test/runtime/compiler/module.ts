import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/Module', () => {
  it('Should validate string', () => {
    const Module = Type.Module({
      A: Type.String(),
    })
    const T = Module.Import('A')
    Ok(T, 'hello')
    Fail(T, true)
  })
  it('Should validate referenced string', () => {
    const Module = Type.Module({
      A: Type.String(),
      B: Type.Ref('A'),
    })
    const T = Module.Import('B')
    Ok(T, 'hello')
    Fail(T, true)
  })
  it('Should validate self referential', () => {
    const Module = Type.Module({
      A: Type.Object({
        nodes: Type.Array(Type.Ref('A')),
      }),
    })
    const T = Module.Import('A')
    Ok(T, { nodes: [{ nodes: [{ nodes: [] }, { nodes: [] }] }] })
    Fail(T, { nodes: [{ nodes: [{ nodes: [] }, { nodes: false }] }] })
    Fail(T, true)
  })
  it('Should validate mutual recursive', () => {
    const Module = Type.Module({
      A: Type.Object({
        b: Type.Ref('B'),
      }),
      B: Type.Object({
        a: Type.Union([Type.Ref('A'), Type.Null()]),
      }),
    })
    const T = Module.Import('A')
    Ok(T, { b: { a: null } })
    Ok(T, { b: { a: { b: { a: null } } } })
    Fail(T, { b: { a: 1 } })
    Fail(T, { b: { a: { b: { a: 1 } } } })
    Fail(T, true)
  })
  it('Should validate mutual recursive (Array)', () => {
    const Module = Type.Module({
      A: Type.Object({
        b: Type.Ref('B'),
      }),
      B: Type.Object({
        a: Type.Array(Type.Ref('A')),
      }),
    })
    const T = Module.Import('A')
    Ok(T, { b: { a: [{ b: { a: [] } }] } })
    Fail(T, { b: { a: [{ b: { a: [null] } }] } })
    Fail(T, true)
  })
  it('Should validate deep referential', () => {
    const Module = Type.Module({
      A: Type.Ref('B'),
      B: Type.Ref('C'),
      C: Type.Ref('D'),
      D: Type.Ref('E'),
      E: Type.Ref('F'),
      F: Type.Ref('G'),
      G: Type.Ref('H'),
      H: Type.Literal('hello'),
    })
    const T = Module.Import('A')
    Ok(T, 'hello')
    Fail(T, 'world')
  })
  // ----------------------------------------------------------------
  // Modifiers
  // ----------------------------------------------------------------
  it('Should validate objects with property modifiers 1', () => {
    const Module = Type.Module({
      T: Type.Object({
        x: Type.ReadonlyOptional(Type.Null()),
        y: Type.Readonly(Type.Null()),
        z: Type.Optional(Type.Null()),
        w: Type.Null(),
      }),
    })
    const T = Module.Import('T')
    Ok(T, { x: null, y: null, w: null })
    Ok(T, { y: null, w: null })
    Fail(T, { x: 1, y: null, w: null })
  })
  it('Should validate objects with property modifiers 2', () => {
    const Module = Type.Module({
      T: Type.Object({
        x: Type.ReadonlyOptional(Type.Array(Type.Null())),
        y: Type.Readonly(Type.Array(Type.Null())),
        z: Type.Optional(Type.Array(Type.Null())),
        w: Type.Array(Type.Null()),
      }),
    })
    const T = Module.Import('T')
    Ok(T, { x: [null], y: [null], w: [null] })
    Ok(T, { y: [null], w: [null] })
    Fail(T, { x: [1], y: [null], w: [null] })
  })
})
