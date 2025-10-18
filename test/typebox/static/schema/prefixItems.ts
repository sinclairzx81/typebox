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
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, number]>(true)
}
// ------------------------------------------------------------------
// PrefixItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...unknown[]]>(true)
}
// ------------------------------------------------------------------
// MinItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    minItems: 1
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, (number | undefined)?, ...unknown[]]>(true)
}
{
  type T = XStatic<{
    minItems: 2
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, number, ...unknown[]]>(true)
}
{
  type T = XStatic<{
    minItems: 3
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [string, number, ...unknown[]]>(true)
}
// ------------------------------------------------------------------
// MaxItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    maxItems: 1
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?]>(true)
}
{
  type T = XStatic<{
    maxItems: 2
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?]>(true)
}
{
  type T = XStatic<{
    maxItems: 3
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...unknown[]]>(true)
}
// ------------------------------------------------------------------
// AdditionalItems
// ------------------------------------------------------------------
{
  type T = XStatic<{
    additionalItems: true
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...unknown[]]>(true)
}
{
  type T = XStatic<{
    additionalItems: false
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?]>(true)
}
{
  type T = XStatic<{
    additionalItems: { type: 'boolean' }
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>
  Assert.IsExtendsMutual<T, [(string | undefined)?, (number | undefined)?, ...boolean[]]>(true)
}
