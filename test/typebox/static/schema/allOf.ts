import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer as unknown with no constituents
Assert.IsExtendsMutual<
  XStatic<{
    allOf: []
  }>,
  unknown
>(true)

// should infer with one constituent
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [{ type: 'string' }]
  }>,
  string
>(true)

// should infer as never with illogical constituents
Assert.IsExtendsNever<
  XStatic<{
    allOf: [{ type: 'string' }, { type: 'number' }]
  }>
>(true)

// should infer to narrowed 1
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [{ type: 'number' }, { const: 1 }]
  }>,
  1
>(true)

// should infer to narrowed 2
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [{ type: 'string' }, { const: 'hello' }]
  }>,
  'hello'
>(true)

// should infer to narrowed 3
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [
      { type: 'string' },
      { type: 'string' },
      { type: 'string' },
      { type: 'string' },
      { type: 'string' },
      { type: 'string' },
      { type: 'string' },
      { const: 'hello' }
    ]
  }>,
  'hello'
>(true)

// should infer object like 1
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [
      { type: 'object'; required: ['x']; properties: { x: { type: 'number' } } },
      { type: 'object'; required: ['y']; properties: { y: { type: 'number' } } }
    ]
  }>,
  {
    x: number // question: can we retain logical intersect? (review)
    y: number
  }
>(true)

// should infer object like 2 (evaluated form)
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [
      { type: 'object'; required: ['x']; properties: { x: { type: 'number' } } },
      { type: 'object'; required: ['y']; properties: { y: { type: 'number' } } }
    ]
  }>,
  {
    x: number
    y: number
  }
>(true)

// should infer object like with optional
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [
      { type: 'object'; required: []; properties: { x: { type: 'number' } } },
      { type: 'object'; required: ['y']; properties: { y: { type: 'number' } } }
    ]
  }>,
  {
    x?: number
    y: number
  }
>(true)

// should infer object like with readonly
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [
      { type: 'object'; required: ['x']; properties: { x: { type: 'number'; readOnly: true } } },
      { type: 'object'; required: ['y']; properties: { y: { type: 'number' } } }
    ]
  }>,
  {
    readonly x: number
    y: number
  }
>(true)

// should infer object with illogical sub schema
Assert.IsExtendsMutual<
  XStatic<{
    allOf: [
      { type: 'object'; required: ['x']; properties: { x: { type: 'string' } } },
      { type: 'object'; required: ['x']; properties: { x: { type: 'number' } } }
    ]
  }>,
  {
    x: never
  }
>(true)
