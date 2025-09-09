import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.TemplateLiteral')

// ------------------------------------------------------------------
// Coverage: Finite
// ------------------------------------------------------------------
Test('Should TemplateLiteral 1', () => {
  const A = Type.TemplateLiteral([])
  const R: Type.TRecord<'^$', Type.TString> = Type.Record(A, Type.String())
  Assert.IsTrue(Type.IsRecord(R))
  Assert.IsEqual(Type.RecordPattern(R), '^$')
  Assert.IsTrue(Type.IsString(Type.RecordValue(R)))
})
// ------------------------------------------------------------------
// Coverage: Decode | Decode Paths are trigged when transforming
//                    to Union. We use a Record for this.
// ------------------------------------------------------------------
Test('Should TemplateLiteral 2', () => {
  const A = Type.TemplateLiteral([])
  const R: Type.TRecord<'^$', Type.TString> = Type.Record(A, Type.String())
  Assert.IsTrue(Type.IsRecord(R))
  Assert.IsEqual(Type.RecordPattern(R), '^$')
  Assert.IsTrue(Type.IsString(Type.RecordValue(R)))
})
