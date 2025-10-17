import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// ------------------------------------------------------------------
// Should infer as expando
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    unevaluatedProperties: { type: 'string' }
  }>,
  {
    [key: string]: string
  }
>(true)
// ------------------------------------------------------------------
// Should infer unevaluated properties false
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    unevaluatedProperties: false
    allOf: [{
      type: 'object'
      required: ['x']
      properties: {
        x: { type: 'number' }
      }
    }, {
      type: 'object'
      required: ['y']
      properties: {
        y: { type: 'number' }
      }
    }]
  }>,
  {
    x: number
    y: number
  }
>(true)
// ------------------------------------------------------------------
// Should infer unevaluated properties true
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    unevaluatedProperties: true
    allOf: [{
      type: 'object'
      required: ['x']
      properties: {
        x: { type: 'number' }
      }
    }, {
      type: 'object'
      required: ['y']
      properties: {
        y: { type: 'number' }
      }
    }]
  }>,
  {
    [x: string]: unknown
    x: number
    y: number
  }
>(true)
// ------------------------------------------------------------------
// Should infer unevaluated properties schema
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    unevaluatedProperties: { type: 'number' }
    allOf: [{
      type: 'object'
      required: ['x']
      properties: {
        x: { type: 'number' }
      }
    }, {
      type: 'object'
      required: ['y']
      properties: {
        y: { type: 'number' }
      }
    }]
  }>,
  {
    [x: string]: number
    x: number
    y: number
  }
>(true)
