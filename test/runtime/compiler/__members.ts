import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type, TypeGuard, ValueGuard } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('compiler/TypeCheckMembers', () => {
  it('Should return Schema', () => {
    const A = TypeCompiler.Compile(Type.Number(), [Type.String(), Type.Boolean()])
    Assert.IsTrue(TypeGuard.IsNumber(A.Schema()))
  })
  it('Should return References', () => {
    const A = TypeCompiler.Compile(Type.Number(), [Type.String(), Type.Boolean()])
    Assert.IsTrue(TypeGuard.IsNumber(A.Schema()))
    Assert.IsTrue(TypeGuard.IsString(A.References()[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(A.References()[1]))
  })
  it('Should return Code', () => {
    const A = TypeCompiler.Compile(Type.Number(), [Type.String(), Type.Boolean()])
    Assert.IsTrue(ValueGuard.IsString(A.Code()))
  })
})
