import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// ------------------------------------------------------------------
// Standard
// ------------------------------------------------------------------
{
  type T = XStatic<{
    type: 'array'
    minItems: 2
    additionalItems: false
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, number]>(true)
}
// ------------------------------------------------------------------
// Unsized
// ------------------------------------------------------------------
{
  type T = XStatic<{
    items: { type: 'string' }
  }>
  Assert.IsExtendsMutual<T, string[]>(true)
}
// ------------------------------------------------------------------
// Sized
// ------------------------------------------------------------------
{
  type T = XStatic<{
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...unknown[]]>(true)
}
// ------------------------------------------------------------------
// MinItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    minItems: 1
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, (number | undefined)?, ...unknown[]]>(true)
}
{
  type T = XStatic<{
    minItems: 2
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, number, ...unknown[]]>(true)
}
{
  type T = XStatic<{
    minItems: 3
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, number, ...unknown[]]>(true)
}
// ------------------------------------------------------------------
// MaxItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    maxItems: 1
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?]>(true)
}
{
  type T = XStatic<{
    maxItems: 2
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?]>(true)
}
{
  type T = XStatic<{
    maxItems: 3
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...unknown[]]>(true)
}
// ------------------------------------------------------------------
// AdditionalItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    additionalItems: true
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...unknown[]]>(true)
}
{
  type T = XStatic<{
    additionalItems: false
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?]>(true)
}
{
  type T = XStatic<{
    additionalItems: { type: 'boolean' }
    items: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...boolean[]]>(true)
}
