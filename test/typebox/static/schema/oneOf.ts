import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer as never with no constituents
Assert.IsExtendsNever<
  XStatic<{
    oneOf: []
  }>
>(true)
// should infer with one constituent
Assert.IsExtendsMutual<
  XStatic<{
    oneOf: [{ type: 'string' }]
  }>,
  string
>(true)
// should infer with multiple constituents
Assert.IsExtendsMutual<
  XStatic<{
    oneOf: [{ type: 'string' }, { type: 'number' }]
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
    oneOf: [{
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
  Assert.IsExtendsMutual<R, { type: 'A' } | { type: 'B' }>(false)
}
// should infer with union of object and number
{
  type R = XStatic<{
    oneOf: [{ type: 'number' }, {
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
  Assert.IsExtendsMutual<R, { type: 'A' } | { type: 'B' } | number>(false)
}
