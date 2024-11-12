import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler-ajv/Module', () => {
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
})
