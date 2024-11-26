import { Value, AssertError, ParseRegistry } from '@sinclair/typebox/value'
import { Type, TypeGuard } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('value/Parse', () => {
  it('Should Parse', () => {
    const A = Value.Parse(Type.Literal('hello'), 'hello')
    Assert.IsEqual(A, 'hello')
  })
  it('Should not Parse', () => {
    Assert.Throws(() => Value.Parse(Type.Literal('hello'), 'world'))
  })
  it('Should throw AssertError', () => {
    try {
      Value.Parse(Type.Literal('hello'), 'world')
    } catch(error) {
      if(error instanceof AssertError) {
        return
      }
      throw error
    }
  })
  it('Should throw AssertError and produce Iterator', () => {
    try {
      Value.Parse(Type.Literal('hello'), 'world')
    } catch(error) {
      if(error instanceof AssertError) {
        const first = error.Errors().First()
        Assert.HasProperty(first, 'type')
        Assert.HasProperty(first, 'schema')
        Assert.HasProperty(first, 'path')
        Assert.HasProperty(first, 'value')
        Assert.HasProperty(first, 'message')
        return
      }
      throw error
    }
  })
  // ----------------------------------------------------------------
  // Default
  // ----------------------------------------------------------------
  it('Should use Default values', () => {
    const X = Value.Parse(Type.Object({
      x: Type.Number({ default: 1 }),
      y: Type.Number({ default: 2 })
    }), { })
    Assert.IsEqual(X, { x: 1, y: 2 })
  })
  it('Should throw on invalid Default values', () => {
    Assert.Throws(() => Value.Parse(Type.Object({
      x: Type.Number({ default: null }),
      y: Type.Number({ default: null })
    }), { }))
  })
  // ----------------------------------------------------------------
  // Convert
  // ----------------------------------------------------------------
  it('Should Convert value 1', () => {
    const X = Value.Parse(Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }), { x: '1', y: '2' })
    Assert.IsEqual(X, { x: 1, y: 2 })
  })
  it('Should Convert value 2', () => {
    const X = Value.Parse(Type.Array(Type.String()), [1, 2, 3, 4])
    Assert.IsEqual(X, ['1', '2', '3', '4'])
  })
  // ----------------------------------------------------------------
  // Clean
  // ----------------------------------------------------------------
  it('Should Clean value', () => {
    const X = Value.Parse(Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }), { x: 1, y: 2, z: 3 })
    Assert.IsEqual(X, { x: 1, y: 2 })
  })
  // ----------------------------------------------------------------
  // Decode
  // ----------------------------------------------------------------
  it('Should Decode value', () => {
    const T = Type.Transform(Type.String())
      .Decode(value => 'hello')
      .Encode(value => value)
    const X = Value.Parse(T, 'world')
    Assert.IsEqual(X, 'hello')
  })
  // ----------------------------------------------------------------
  // Operations
  // ----------------------------------------------------------------
  it('Should run operations 1', () => {
    const A = Type.Object({ x: Type.Number() })
    const I = { x: 1 }
    const O = Value.Parse([], A, I)
    Assert.IsTrue(I === O)
  })
  it('Should run operations 2', () => {
    const A = Type.Object({ x: Type.Number() })
    const I = { x: 1 }
    const O = Value.Parse(['Clone'], A, I)
    Assert.IsTrue(I !== O)
  })
  it('Should run operations 3', () => {
    ParseRegistry.Set('Intercept', ( schema, references, value) => { throw 1 })
    const A = Type.Object({ x: Type.Number() })
    Assert.Throws(() => Value.Parse(['Intercept'], A, null))
    ParseRegistry.Delete('Intercept')
    const F = ParseRegistry.Get('Intercept')
    Assert.IsEqual(F, undefined)
  })
  it('Should run operations 4', () => {
    ParseRegistry.Set('Intercept', ( schema, references, value) => { 
      Assert.IsEqual(value, 12345)
      Assert.IsTrue(TypeGuard.IsNumber(schema))
      Assert.IsTrue(TypeGuard.IsString(references[0]))
    })
    Value.Parse(['Intercept'], Type.Number(), [Type.String()], 12345)
    ParseRegistry.Delete('Intercept')
  })
  it('Should run operations 5', () => {
    Assert.Throws(() => Value.Parse(['Intercept'], Type.String(), null))
  })
})
