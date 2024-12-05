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
  // ----------------------------------------------------------------
  // https://github.com/sinclairzx81/typebox/issues/1109
  // ----------------------------------------------------------------
  it('Should validate deep referential 1', () => {
    const Module = Type.Module({
      A: Type.Union([Type.Literal('Foo'), Type.Literal('Bar')]),
      B: Type.Ref('A'),
      C: Type.Object({ ref: Type.Ref('B') }),
      D: Type.Union([Type.Ref('B'), Type.Ref('C')]),
    })
    Ok(Module.Import('A') as never, 'Foo')
    Ok(Module.Import('A') as never, 'Bar')
    Ok(Module.Import('B') as never, 'Foo')
    Ok(Module.Import('B') as never, 'Bar')
    Ok(Module.Import('C') as never, { ref: 'Foo' })
    Ok(Module.Import('C') as never, { ref: 'Bar' })
    Ok(Module.Import('D') as never, 'Foo')
    Ok(Module.Import('D') as never, 'Bar')
    Ok(Module.Import('D') as never, { ref: 'Foo' })
    Ok(Module.Import('D') as never, { ref: 'Bar' })
  })
  it('Should validate deep referential 2', () => {
    const Module = Type.Module({
      A: Type.Literal('Foo'),
      B: Type.Ref('A'),
      C: Type.Ref('B'),
      D: Type.Ref('C'),
      E: Type.Ref('D'),
    })
    Ok(Module.Import('A'), 'Foo')
    Ok(Module.Import('B'), 'Foo')
    Ok(Module.Import('C'), 'Foo')
    Ok(Module.Import('D'), 'Foo')
    Ok(Module.Import('E'), 'Foo')
  })
})
