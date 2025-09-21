import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer as never with no constituents
Assert.IsExtendsNever<
  XStatic<{
    anyOf: []
  }>
>(true)
// should infer with one constituent
Assert.IsExtendsMutual<
  XStatic<{
    anyOf: [{ type: 'string' }]
  }>,
  string
>(true)
// should infer with multiple constituents
Assert.IsExtendsMutual<
  XStatic<{
    anyOf: [{ type: 'string' }, { type: 'number' }]
  }>,
  string | number
>(true)
// should infer with with overlapping mismatched union like
Assert.IsExtendsNever<
  XStatic<{
    anyOf: [{ type: 'number' }, { type: 'string' }]
    oneOf: [{ type: 'bigint' }, { type: 'null' }]
  }>
>(true)
// should infer with with overlapping union like if extends
Assert.IsExtendsMutual<
  XStatic<{
    anyOf: [{ type: 'number' }, { type: 'string' }]
    oneOf: [{ type: 'string' }, { type: 'number' }]
  }>,
  string | number
>(true)
// should infer with union of object
{
  type R = XStatic<{
    anyOf: [{
      type: 'object'
      required: ['type']
      properties: {
        type: { const: 'A' }
      }
    }, {
      type: 'object'
      required: ['type']
      properties: {
        type: { const: 'B' }
      }
    }]
  }>
  Assert.IsExtendsMutual<R, { type: 'A' } | { type: 'B' }>(true)
}
// should infer with union of object and number
{
  type R = XStatic<{
    anyOf: [{ type: 'number' }, {
      type: 'object'
      required: ['type']
      properties: {
        type: { const: 'A' }
      }
    }, {
      type: 'object'
      required: ['type']
      properties: {
        type: { const: 'B' }
      }
    }]
  }>
  Assert.IsExtendsMutual<R, { type: 'A' } | { type: 'B' } | number>(true)
}
