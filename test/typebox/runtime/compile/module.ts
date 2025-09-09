import { Code } from 'typebox/compile'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Compile.Code')

Test('Should Code 1', () => {
  const result = Code(Type.String())
  Assert.IsEqual(result.External.variables.length, 0)
  Assert.IsTrue(typeof result.Code === 'string')
})
Test('Should Code 2', () => {
  const result = Code({ A: Type.String() }, Type.Ref('A'))
  Assert.IsEqual(result.External.variables.length, 0)
  Assert.IsTrue(typeof result.Code === 'string')
})
Test('Should Code 3', () => {
  const result = Code({ A: Type.String({ pattern: 'a' }) }, Type.Ref('A'))
  Assert.IsEqual(result.External.variables.length, 1)
  Assert.IsTrue(typeof result.Code === 'string')
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Code 4', () => {
  const result = Code(Type.Intersect([
    Type.Object({ x: Type.Number() }),
    Type.Object({ y: Type.Number() })
  ], { unevaluatedProperties: false }))
  Assert.IsTrue(typeof result.Code === 'string')
})
