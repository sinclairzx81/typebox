import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.IsTemplateLiteralFinite')

// ------------------------------------------------------------------
// IsTemplateLiteralFinite: RangeAssertion (Max 128)
//
// Note: These tests are quite slow to run because we are pushing
// the extents of template literals. This is normal but we should
// try to optimize these as much as possible (review)
// ------------------------------------------------------------------
Test('Should IsTemplateLiteralFinite RangeAssertion 1', () => {
  // 5-bit (32-variants)
  const pattern = '${0|1}${0|1}${0|1}${0|1}${0|1}' as string
  const result = Type.Evaluate(Type.TemplateLiteral(pattern)) as any
  Assert.IsTrue(Type.IsUnion(result))
})
Test('Should IsTemplateLiteralFinite RangeAssertion 3', () => {
  // 4^4 = 256 variants
  const pattern = '${0|1|2|3}${0|1|2|3}${0|1|2|3}${0|1|2|3}' as string
  Assert.Throws(() => Type.Evaluate(Type.TemplateLiteral(pattern))) as any
})
Test('Should IsTemplateLiteralFinite RangeAssertion 4', () => {
  // 8-bit too-large
  const pattern = '${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}' as string
  Assert.Throws(() => Type.Evaluate(Type.TemplateLiteral(pattern))) as any
})
Test('Should IsTemplateLiteralFinite RangeAssertion 2', () => {
  // 5-bit (32-variants)
  const pattern = '${0|1}${0|1}${0|1}${0|1}${0|1}' as string
  const result = Type.Record(Type.TemplateLiteral(pattern), Type.Null()) as any
  Assert.IsTrue(Type.IsObject(result))
})
