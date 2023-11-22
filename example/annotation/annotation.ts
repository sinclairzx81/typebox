/*--------------------------------------------------------------------------

@sinclair/typebox

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as Types from '@sinclair/typebox'

// -------------------------------------------------------------------
// Annotation
//
// Generates TypeScript Type Annotations from TypeBox types
// -------------------------------------------------------------------
/** Generates TypeScript Type Annotations from TypeBox types */
export namespace Annotation {
  // -----------------------------------------------------------------
  // Escape
  // -----------------------------------------------------------------
  function Escape(content: string) {
    return content.replace(/'/g, "\\'")
  }
  // -----------------------------------------------------------------
  // Types
  // -----------------------------------------------------------------
  function Intersect(schema: Types.TSchema[], references: Types.TSchema[]): string {
    const [L, ...R] = schema
    // prettier-ignore
    return R.length === 0
      ? `${Visit(L, references)}`
      : `${Visit(L, references)} & ${Intersect(R, references)}`
  }
  function Union(schema: Types.TSchema[], references: Types.TSchema[]): string {
    const [L, ...R] = schema
    // prettier-ignore
    return R.length === 0
      ? `${Visit(L, references)}`
      : `${Visit(L, references)} | ${Union(R, references)}`
  }
  function Tuple(schema: Types.TSchema[], references: Types.TSchema[]): string {
    const [L, ...R] = schema
    // prettier-ignore
    return R.length > 0
      ? `${Visit(L, references)}, ${Tuple(R, references)}`
      : ``
  }
  function Property(schema: Types.TProperties, K: string, references: Types.TSchema[]): string {
    const TK = schema[K]
    // prettier-ignore
    return (
      Types.TypeGuard.TOptional(TK) && Types.TypeGuard.TReadonly(TK) ? `readonly ${K}?: ${Visit(TK, references)}` :
      Types.TypeGuard.TReadonly(TK) ? `readonly ${K}: ${Visit(TK, references)}` :
      Types.TypeGuard.TOptional(TK) ? `${K}?: ${Visit(TK, references)}` :
      `${K}: ${Visit(TK, references)}`
    )
  }
  function Properties(schema: Types.TProperties, K: string[], references: Types.TSchema[]): string {
    const [L, ...R] = K
    // prettier-ignore
    return R.length === 0
      ? `${Property(schema, L, references)}`
      : `${Property(schema, L, references)}; ${Properties(schema, R, references)}`
  }
  function Parameters(schema: Types.TSchema[], I: number, references: Types.TSchema[]): string {
    const [L, ...R] = schema
    // prettier-ignore
    return R.length === 0
      ? `param_${I}: ${Visit(L, references)}`
      : `param_${I}: ${Visit(L, references)}, ${Parameters(R, I + 1, references)}`
  }
  function Literal(schema: Types.TLiteral, references: Types.TSchema[]): string {
    return typeof schema.const === 'string' ? `'${Escape(schema.const)}'` : schema.const.toString()
  }
  function Record(schema: Types.TRecord, references: Types.TSchema[]): string {
    // prettier-ignore
    return (
      Types.PatternBooleanExact in schema.patternProperties ? `Record<boolean, ${Visit(schema.patternProperties[Types.PatternBooleanExact], references)}>` : 
      Types.PatternNumberExact in schema.patternProperties ? `Record<number, ${Visit(schema.patternProperties[Types.PatternNumberExact], references)}>` : 
      Types.PatternStringExact in schema.patternProperties ? `Record<string, ${Visit(schema.patternProperties[Types.PatternStringExact], references)}>` : 
      `{}`
    )
  }
  function TemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[]) {
    const E = Types.TemplateLiteralParseExact(schema.pattern)
    if (!Types.IsTemplateLiteralFinite(E)) return 'string'
    return [...Types.TemplateLiteralGenerate(E)].map((literal) => `'${Escape(literal)}'`).join(' | ')
  }
  function Visit(schema: Types.TSchema, references: Types.TSchema[]): string {
    // prettier-ignore
    return (
      Types.TypeGuard.TAny(schema) ? 'any' :
      Types.TypeGuard.TArray(schema) ? `${Visit(schema.items, references)}[]` :
      Types.TypeGuard.TAsyncIterator(schema) ? `AsyncIterableIterator<${Visit(schema.items, references)}>` :
      Types.TypeGuard.TBigInt(schema) ? `bigint` :
      Types.TypeGuard.TBoolean(schema) ? `boolean` :
      Types.TypeGuard.TConstructor(schema) ? `new (${Parameters(schema.parameter, 0, references)}) => ${Visit(schema.returns, references)}` :
      Types.TypeGuard.TDate(schema) ? 'Date' :
      Types.TypeGuard.TFunction(schema) ? `(${Parameters(schema.parameters, 0, references)}) => ${Visit(schema.returns, references)}` :
      Types.TypeGuard.TInteger(schema) ? 'number' :
      Types.TypeGuard.TIntersect(schema) ? `(${Intersect(schema.allOf, references)})` :
      Types.TypeGuard.TIterator(schema) ? `IterableIterator<${Visit(schema.items, references)}>` :
      Types.TypeGuard.TLiteral(schema) ? `${Literal(schema, references)}` :
      Types.TypeGuard.TNever(schema) ? `never` :
      Types.TypeGuard.TNull(schema) ? `null` :
      Types.TypeGuard.TNot(schema) ? 'unknown' :
      Types.TypeGuard.TNumber(schema) ? 'number' :
      Types.TypeGuard.TObject(schema) ? `{ ${Properties(schema.properties, Object.getOwnPropertyNames(schema.properties), references)} }` :
      Types.TypeGuard.TPromise(schema) ? `Promise<${Visit(schema.item, references)}>` :
      Types.TypeGuard.TRecord(schema) ? `${Record(schema, references)}` :
      Types.TypeGuard.TRef(schema) ? `${Visit(Types.Type.Deref(schema, references), references)}` :
      Types.TypeGuard.TString(schema) ? 'string' :
      Types.TypeGuard.TSymbol(schema) ? 'symbol' :
      Types.TypeGuard.TTemplateLiteral(schema) ? `${TemplateLiteral(schema, references)}` :
      Types.TypeGuard.TThis(schema) ?  'unknown' : // requires named interface
      Types.TypeGuard.TTuple(schema) ? `[${Tuple(schema.items || [], references)}]` :
      Types.TypeGuard.TUint8Array(schema) ? `Uint8Array` :
      Types.TypeGuard.TUndefined(schema) ? 'undefined' :
      Types.TypeGuard.TUnion(schema) ? `${Union(schema.anyOf, references)}` :
      Types.TypeGuard.TVoid(schema) ? `void` :
      'unknown'
    )
  }
  /** Generates a TypeScript annotation for the given schema */
  export function Code(schema: Types.TSchema, references: Types.TSchema[] = []): string {
    return Visit(schema, references)
  }
}