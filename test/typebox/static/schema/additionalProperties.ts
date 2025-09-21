import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// Should infer as expando
Assert.IsExtendsMutual<
  XStatic<{
    additionalProperties: { type: 'string' }
  }>,
  {
    [key: string]: string
  }
>(true)

// Should infer as expando with properties 1
Assert.IsExtendsMutual<
  XStatic<{
    additionalProperties: { type: 'number' }
    required: ['x', 'y', 'z']
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
  }>,
  {
    [x: string]: number
    x: number
    y: number
    z: number
  }
>(true)

// Should infer as expando with properties 2
{
  // this type can't be trivially tested via Assert, but we can
  // loosely test the interior properties.
  type R = XStatic<{
    additionalProperties: { type: 'string' }
    required: ['x', 'y', 'z']
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
  }>
  Assert.IsExtends<R['x'], number>(true)
  Assert.IsExtends<R['y'], number>(true)
  Assert.IsExtends<R['z'], number>(true)
  Assert.IsExtends<R['w'], string>(true)
}
