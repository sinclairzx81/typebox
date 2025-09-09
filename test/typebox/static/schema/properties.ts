import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer all properties as optional without required
Assert.IsExtendsMutual<
  XStatic<{
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
  }>,
  {
    x?: number
    y?: number
    z?: number
  }
>(true)

// should ascribe readonly without required
Assert.IsExtendsMutual<
  XStatic<{
    properties: {
      x: { type: 'number'; readOnly: true }
      y: { type: 'number'; readOnly: true }
      z: { type: 'number'; readOnly: true }
    }
  }>,
  {
    readonly x?: number
    readonly y?: number
    readonly z?: number
  }
>(true)

// should infer where object has no effect
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
  }>,
  {
    x?: number
    y?: number
    z?: number
  }
>(true)

// should infer where type is array (infered as {})
Assert.IsExtendsMutual<
  XStatic<{
    type: 'array'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
  }>,
  {
    x?: number
    y?: number
    z?: number
  }
>(true)
// should infer required properties
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    required: ['x', 'y', 'z']
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
  }>,
  {
    x: number
    y: number
    z: number
  }
>(true)
