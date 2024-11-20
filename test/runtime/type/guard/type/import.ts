import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TImport', () => {
  it('Should guard for TImport', () => {
    const Module = Type.Module({
      A: Type.String(),
    })
    const A = Module.Import('A')
    const N = A.$defs[A.$ref]
    Assert.IsTrue(TypeGuard.IsImport(A))
    Assert.IsTrue(TypeGuard.IsString(N))
  })
  // ----------------------------------------------------------------
  // Computed: Awaited
  // ----------------------------------------------------------------
  it('Should compute for Awaited', () => {
    const Module = Type.Module({
      T: Type.Promise(Type.String()),
      R: Type.Awaited(Type.Ref('T')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsString(T.$defs['R']))
  })
  // ----------------------------------------------------------------
  // Computed: Index (Note: Pending Reimplementation of Index)
  // ----------------------------------------------------------------
  it('Should compute for Index 2', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.String() }),
      I: Type.Literal('x'),
      R: Type.Index(Type.Ref('T'), Type.Ref('I')) as never, // fail
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R']))
  })
  // ----------------------------------------------------------------
  // Computed: Omit
  // ----------------------------------------------------------------
  it('Should compute for Omit 1', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.Number() }),
      R: Type.Omit(Type.Ref('T'), Type.Literal('x')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.y))
    // @ts-ignore
    Assert.IsTrue(T.$defs['R'].properties.x === undefined)
  })
  it('Should compute for Omit 2', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.Number() }),
      K: Type.Literal('x'),
      R: Type.Omit(Type.Ref('T'), Type.Ref('K')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.y))
    // @ts-ignore
    Assert.IsTrue(T.$defs['R'].properties.x === undefined)
  })
  // ----------------------------------------------------------------
  // Computed: Partial
  // ----------------------------------------------------------------
  it('Should compute for Partial', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number() }),
      R: Type.Partial(Type.Ref('T')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.$defs['R'].properties.x))
  })
  // ----------------------------------------------------------------
  // Computed: Pick
  // ----------------------------------------------------------------
  it('Should compute for Pick 1', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.Number() }),
      R: Type.Pick(Type.Ref('T'), Type.Literal('x')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.x))
    // @ts-ignore
    Assert.IsTrue(T.$defs['R'].properties.y === undefined)
  })
  it('Should compute for Pick 2', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.Number() }),
      K: Type.Literal('x'),
      R: Type.Pick(Type.Ref('T'), Type.Ref('K')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.x))
    // @ts-ignore
    Assert.IsTrue(T.$defs['R'].properties.y === undefined)
  })
  // ----------------------------------------------------------------
  // Computed: Record
  // ----------------------------------------------------------------
  it('Should compute for Record 1', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.String() }),
      R: Type.Record(Type.String(), Type.Ref('T')),
    })
    const T = Module.Import('R')

    console.dir(T, { depth: 100 })
    Assert.IsTrue(TypeGuard.IsRecord(T.$defs['R']))
    // note: TRecord<TSchema, TRef<...>> are not computed. Only the Key is 
    // computed as TypeBox needs to make a deferred call to transform from 
    // TRecord to TObject for finite keys.
    Assert.IsTrue(TypeGuard.IsRef(T.$defs['R'].patternProperties['^(.*)$']))
    Assert.IsTrue(T.$defs['R'].patternProperties['^(.*)$'].$ref === 'T')
  })
  it('Should compute for Record 2', () => {
    const Module = Type.Module({
      T: Type.Number(),
      K: Type.Union([Type.Literal('x'), Type.Literal('y')]),
      R: Type.Record(Type.Ref('K'), Type.Ref('T')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.x))
  })
  // ----------------------------------------------------------------
  // Computed: Required
  // ----------------------------------------------------------------
  it('Should compute for Required', () => {
    const Module = Type.Module({
      T: Type.Partial(Type.Object({ x: Type.Number() })),
      R: Type.Required(Type.Ref('T')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsObject(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsNumber(T.$defs['R'].properties.x))
    Assert.IsFalse(TypeGuard.IsOptional(T.$defs['R'].properties.x))
  })
  // ----------------------------------------------------------------
  // Computed: KeyOf
  // ----------------------------------------------------------------
  it('Should compute for KeyOf', () => {
    const Module = Type.Module({
      T: Type.Object({ x: Type.Number(), y: Type.String() }),
      R: Type.KeyOf(Type.Ref('T')),
    })
    const T = Module.Import('R')
    Assert.IsTrue(TypeGuard.IsUnion(T.$defs['R']))
    Assert.IsTrue(TypeGuard.IsLiteral(T.$defs['R'].anyOf[0]))
    Assert.IsTrue(TypeGuard.IsLiteral(T.$defs['R'].anyOf[1]))
    Assert.IsTrue(T.$defs['R'].anyOf[0].const === 'x')
    Assert.IsTrue(T.$defs['R'].anyOf[1].const === 'y')
  })
})
