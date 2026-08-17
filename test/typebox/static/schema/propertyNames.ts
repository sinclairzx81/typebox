import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// ------------------------------------------------------------------
// Broad
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { type: 'string' }
  }>,
  {
    [x: string]: unknown
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { type: 'number' }
  }>,
  {
    [x: number]: unknown
  }
>(true)
// ------------------------------------------------------------------
// Narrow
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { const: 'A' }
  }>,
  {
    A?: unknown
  }
>(true)
// ------------------------------------------------------------------
// Logical: And
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { allOf: [{ const: 'A' }, { type: 'string' }] }
  }>,
  {
    A?: unknown
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { allOf: [{ type: 'string' }, { const: 'A' }] }
  }>,
  {
    A?: unknown
  }
>(true)
// ------------------------------------------------------------------
// Logical: Or
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A?: unknown
    B?: unknown
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { anyOf: [{ const: 'A' }, { anyOf: [{ const: 'B' }, { const: 'C' }] }] }
  }>,
  {
    A?: unknown
    B?: unknown
    C?: unknown
  }
>(true)
// ------------------------------------------------------------------
// Logical: Or (Enum)
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { enum: ['A', 'B'] }
  }>,
  {
    A?: unknown
    B?: unknown
  }
>(true)
// ------------------------------------------------------------------
// Logical: Xor
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { oneOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A?: unknown
    B?: unknown
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    propertyNames: { oneOf: [{ const: 'A' }, { oneOf: [{ const: 'B' }, { const: 'C' }] }] }
  }>,
  {
    A?: unknown
    B?: unknown
    C?: unknown
  }
>(true)
// --------------------------------------------------------
// Required
// --------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    required: ['A']
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A: unknown
    B?: unknown
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    required: ['A', 'B']
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A: unknown
    B: unknown
  }
>(true)
// --------------------------------------------------------
// Properties
// --------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    properties: {
      A: { type: 'number' }
    }
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A?: number
    B?: unknown
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    properties: {
      A: { type: 'number' }
      B: { type: 'string' }
    }
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A?: number
    B?: string
  }
>(true)
// --------------------------------------------------------
// Properties + Required
// --------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    required: ['A']
    properties: {
      A: { type: 'number' }
      B: { type: 'string' }
    }
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A: number
    B?: string
  }
>(true)
Assert.IsExtendsMutual<
  XStatic<{
    required: ['A', 'B']
    properties: {
      A: { type: 'number' }
      B: { type: 'string' }
    }
    propertyNames: { anyOf: [{ const: 'A' }, { const: 'B' }] }
  }>,
  {
    A: number
    B: string
  }
>(true)
