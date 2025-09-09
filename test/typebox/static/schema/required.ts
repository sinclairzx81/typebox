import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer as unknown without properties keyword
Assert.IsExtendsMutual<
  XStatic<{
    required: ['x', 'y', 'z']
  }>,
  {
    x: unknown
    y: unknown
    z: unknown
  }
>(true)
// should infer as properties if keyword is known
Assert.IsExtendsMutual<
  XStatic<{
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
    required: ['x', 'y', 'z']
  }>,
  {
    x: number
    y: number
    z: number
  }
>(true)
// should infer as regular object
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
    required: ['x', 'y', 'z']
  }>,
  {
    x: number
    y: number
    z: number
  }
>(true)
// should infer as regular partial object
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
    required: ['x', 'y']
  }>,
  {
    x: number
    y: number
    z?: number
  }
>(true)
// should infer as regular readonly object
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number'; readOnly: true }
    }
    required: ['x', 'y', 'z']
  }>,
  {
    x: number
    y: number
    readonly z: number
  }
>(true)
// should infer as regular readonly optional object
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number'; readOnly: true }
    }
    required: ['x', 'y']
  }>,
  {
    x: number
    y: number
    readonly z?: number
  }
>(true)

// unspecified properties should be unknown
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    properties: {
      x: { type: 'number' }
      y: { type: 'number' }
      z: { type: 'number' }
    }
    required: ['x', 'y', 'z', 'w']
  }>,
  {
    x: number
    y: number
    z: number
    w: unknown
  }
>(true)
