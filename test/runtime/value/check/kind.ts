import { Value } from '@sinclair/typebox/value'
import { TypeRegistry, Type, Kind, TSchema } from '@sinclair/typebox'
import { Assert } from '../../assert'

describe('value/check/Kind', () => {
  // ------------------------------------------------------------
  // Fixtures
  // ------------------------------------------------------------
  beforeEach(() => TypeRegistry.Set('PI', (_, value) => value === Math.PI))
  afterEach(() => TypeRegistry.Delete('PI'))
  // ------------------------------------------------------------
  // Tests
  // ------------------------------------------------------------
  it('Should validate', () => {
    const T = Type.Unsafe({ [Kind]: 'PI' })
    Assert.IsTrue(Value.Check(T, Math.PI))
  })
  it('Should not validate', () => {
    const T = Type.Unsafe({ [Kind]: 'PI' })
    Assert.IsFalse(Value.Check(T, Math.PI * 2))
  })
  it('Should validate in object', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'PI' }),
    })
    Assert.IsTrue(Value.Check(T, { x: Math.PI }))
  })
  it('Should not validate in object', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'PI' }),
    })
    Assert.IsFalse(Value.Check(T, { x: Math.PI * 2 }))
  })
  it('Should validate in array', () => {
    const T = Type.Array(Type.Unsafe({ [Kind]: 'PI' }))
    Assert.IsTrue(Value.Check(T, [Math.PI]))
  })
  it('Should not validate in array', () => {
    const T = Type.Array(Type.Unsafe({ [Kind]: 'PI' }))
    Assert.IsFalse(Value.Check(T, [Math.PI * 2]))
  })
  it('Should validate in tuple', () => {
    const T = Type.Tuple([Type.Unsafe({ [Kind]: 'PI' })])
    Assert.IsTrue(Value.Check(T, [Math.PI]))
  })
  it('Should not validate in tuple', () => {
    const T = Type.Tuple([Type.Unsafe({ [Kind]: 'PI' })])
    Assert.IsFalse(Value.Check(T, [Math.PI * 2]))
  })
  // ------------------------------------------------------------
  // Instances
  // ------------------------------------------------------------
  it('Should receive kind instance on registry callback', () => {
    const stack: string[] = []
    TypeRegistry.Set('Kind', (schema: unknown) => {
      // prettier-ignore
      return (typeof schema === 'object' && schema !== null && Kind in schema && schema[Kind] === 'Kind' && '$id' in schema && typeof schema.$id === 'string') 
        ? (() => { stack.push(schema.$id); return true })()
        : false
    })
    const A = { [Kind]: 'Kind', $id: 'A' } as TSchema
    const B = { [Kind]: 'Kind', $id: 'B' } as TSchema
    const T = Type.Object({ a: A, b: B })
    const R = Value.Check(T, { a: null, b: null })
    Assert.IsTrue(R)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    TypeRegistry.Delete('Kind')
  })
  it('Should retain kind instances on subsequent check', () => {
    let stack: string[] = []
    TypeRegistry.Set('Kind', (schema: unknown) => {
      // prettier-ignore
      return (typeof schema === 'object' && schema !== null && Kind in schema && schema[Kind] === 'Kind' && '$id' in schema && typeof schema.$id === 'string') 
        ? (() => { stack.push(schema.$id); return true })()
        : false
    })
    const A = { [Kind]: 'Kind', $id: 'A' } as TSchema
    const B = { [Kind]: 'Kind', $id: 'B' } as TSchema
    const C = { [Kind]: 'Kind', $id: 'C' } as TSchema
    const D = { [Kind]: 'Kind', $id: 'D' } as TSchema
    const T1 = Type.Object({ a: A, b: B })
    const T2 = Type.Object({ a: C, b: D })
    // run T1 check
    const R2 = Value.Check(T1, { a: null, b: null })
    Assert.IsTrue(R2)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    stack = []
    // run T2 check
    const R3 = Value.Check(T2, { a: null, b: null })
    Assert.IsTrue(R3)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'C')
    Assert.IsEqual(stack[1], 'D')
    stack = []
    // run T1 check
    const R4 = Value.Check(T1, { a: null, b: null })
    Assert.IsTrue(R4)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    stack = []
    TypeRegistry.Delete('Kind')
  })
})
