import { type Static, Type } from 'typebox'

// ------------------------------------------------------------------
// Test: TS7 Native Compiler
// ------------------------------------------------------------------
Type.Script(`
// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export interface TSchema {}
export interface TObject<Properties> extends TSchema { 
  type: 'object'
  properties: Properties
}
export interface TNumber extends TSchema { 
  type: 'number' 
}
export interface TString extends TSchema { 
  type: 'string' 
}
export interface TBoolean extends TSchema { 
  type: 'boolean' 
}
// ----------------------------------------------------------------
// Static
// ----------------------------------------------------------------
type Static<T> = (
  T extends TObject<infer Properties> ? {
    [K in keyof Properties]: Static<Properties[K]>
  } :
  T extends TNumber ? number :
  T extends TString ? string :
  T extends TBoolean ? boolean :
  unknown
)
// ----------------------------------------------------------------
// Test
// ----------------------------------------------------------------
type Result = Static<TObject<{
  x: TNumber,
  y: TString,
  z: TBoolean
}>>
` as never)
