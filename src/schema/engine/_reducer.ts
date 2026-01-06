/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-fmt-ignore-file

import * as S from '../types/index.ts'
import { Stack } from './_stack.ts'
import { BuildContext } from './_context.ts'
import { EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema } from './schema.ts'

// ------------------------------------------------------------------
// Reducer
//
// This function is used to generate an reducer evaluation context 
// for the allOf, anyOf, oneOf and not keywords. The reducer mechansism
// is required from 2019-09 onwards to gather evaluated keys and indices
// for the unevaluatedItems and unevaluatedProperties keywords.
//
// ------------------------------------------------------------------
//
// const context = new Context() // exterior
//
// (() => {
//   const results = []
//
//   const context_0 = context.Clone()
//   const context_1 = context.Clone()
//   const context_2 = context.Clone()
//   const context_3 = context.Clone()
//   
//   const condition_0 = ((context) => <subschema>)(context_0)
//   const condition_1 = ((context) => <subschema>)(context_1)
//   const condition_2 = ((context) => <subschema>)(context_2)
//   const condition_3 = ((context) => <subschema>)(context_3)
// 
//   if(condition_0) results.push(context_0)
//   if(condition_1) results.push(context_1)
//   if(condition_2) results.push(context_2)
//   if(condition_3) results.push(context_3)
//
//   return <check> && context.Merge(results)
// })()
//
// ------------------------------------------------------------------
export function Reducer(stack: Stack, context: BuildContext, schemas: S.XSchema[], value: string, check: string): string {
  const results = E.ConstDeclaration('results', '[]')
  const context_n = schemas.map((_schema, index) => E.ConstDeclaration(`context_${index}`, E.New('CheckContext', [])))
  const condition_n = schemas.map((schema, index) => E.ConstDeclaration(`condition_${index}`, E.Call(E.ArrowFunction(['context'], BuildSchema(stack, context, schema, value)), [`context_${index}`])))
  const checks = schemas.map((_schema, index) => E.If(`condition_${index}`, E.Call(E.Member('results', 'push'), [`context_${index}`])))
  const returns = E.Return(E.And(check, context.Merge('results')))
  return E.Call(E.ArrowFunction([], E.Statements([results, ...context_n, ...condition_n, ...checks, returns])), [])
}
