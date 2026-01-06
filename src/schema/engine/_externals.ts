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

export interface TExternal {
  /** The name of the variable that holds external variables in generated code */
  identifier: string
  /** An array of external variables */
  variables: unknown[]
}
const identifier = 'external_'
let resetCount = 0
const state: TExternal = {
  identifier: `${identifier}${resetCount}`,
  variables: []
}
// ------------------------------------------------------------------
// ResetExternals
//
// Each reset results in a new external group identifier. This is done 
// to prevent variable name overlap when generating and evaluating
// multiple types in the same scope.
//
// ------------------------------------------------------------------
export function ResetExternal(): void {
  state.identifier = `${identifier}${resetCount}`
  state.variables = []
  resetCount += 1
}
// ------------------------------------------------------------------
// CreateVariable
// ------------------------------------------------------------------
export function CreateVariable(value: unknown): string {
  const call = `${state.identifier}[${state.variables.length}]`
  state.variables.push(value)
  return call
}
// ------------------------------------------------------------------
// GetExternals
// ------------------------------------------------------------------
export function GetExternal(): TExternal {
  return state
}