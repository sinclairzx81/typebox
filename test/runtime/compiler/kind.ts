import { TypeRegistry, Type, Kind, TSchema } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Ok, Fail } from './validate'
import { Assert } from '../assert'

describe('compiler/Kind', () => {
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
    Ok(T, Math.PI)
  })
  it('Should not validate', () => {
    const T = Type.Unsafe({ [Kind]: 'PI' })
    Fail(T, Math.PI * 2)
  })
  it('Should validate in object', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'PI' }),
    })
    Ok(T, { x: Math.PI })
  })
  it('Should not validate in object', () => {
    const T = Type.Object({
      x: Type.Unsafe({ [Kind]: 'PI' }),
    })
    Fail(T, { x: Math.PI * 2 })
  })
  it('Should validate in array', () => {
    const T = Type.Array(Type.Unsafe({ [Kind]: 'PI' }))
    Ok(T, [Math.PI])
  })
  it('Should not validate in array', () => {
    const T = Type.Array(Type.Unsafe({ [Kind]: 'PI' }))
    Fail(T, [Math.PI * 2])
  })
  it('Should validate in tuple', () => {
    const T = Type.Tuple([Type.Unsafe({ [Kind]: 'PI' })])
    Ok(T, [Math.PI])
  })
  it('Should not validate in tuple', () => {
    const T = Type.Tuple([Type.Unsafe({ [Kind]: 'PI' })])
    Fail(T, [Math.PI * 2])
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
    const C = TypeCompiler.Compile(T)
    const R = C.Check({ a: null, b: null })
    Assert.IsTrue(R)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    TypeRegistry.Delete('Kind')
  })
  // ------------------------------------------------------------
  // Instances Retain
  // ------------------------------------------------------------
  it('Should retain kind instances on subsequent compile', () => {
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

    // Compile T1 and run check, expect A and B
    const C1 = TypeCompiler.Compile(T1)
    const R1 = C1.Check({ a: null, b: null })
    Assert.IsTrue(R1)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    stack = []
    // compile T2 and force instance.clear()
    const C2 = TypeCompiler.Compile(T2)
    // run T1 check
    const R2 = C1.Check({ a: null, b: null })
    Assert.IsTrue(R2)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    stack = []
    // run T2 check
    const R3 = C2.Check({ a: null, b: null })
    Assert.IsTrue(R3)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'C')
    Assert.IsEqual(stack[1], 'D')
    stack = []
    // run T1 check
    const R4 = C1.Check({ a: null, b: null })
    Assert.IsTrue(R4)
    Assert.IsEqual(stack.length, 2)
    Assert.IsEqual(stack[0], 'A')
    Assert.IsEqual(stack[1], 'B')
    stack = []
    TypeRegistry.Delete('Kind')
  })
})
