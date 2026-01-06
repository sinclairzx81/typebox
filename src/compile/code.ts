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

import { Arguments } from '../system/arguments/index.ts'
import { type TProperties, type TSchema } from '../type/index.ts'
import { Build, type BuildResult, type TExternal } from '../schema/index.ts'

// ------------------------------------------------------------------
// Comments and Formatting
// ------------------------------------------------------------------
function TsIgnore() {
  return `// @ts-ignore`
}
function Separator() {
  return ``
}
// ------------------------------------------------------------------
// ImportSection
// ------------------------------------------------------------------
function ImportSection(build: BuildResult): string[] {
  const context = build.UseUnevaluated() ? [`import { CheckContext } from "typebox/schema"`] : []
  const hashing = `import { Hashing } from "typebox/system"`
  const format = `import { Format } from "typebox/format"`
  const guard = `import { Guard } from "typebox/guard"`
  return [...context, hashing, format, guard]
}
// ------------------------------------------------------------------
// ExternalSection
// ------------------------------------------------------------------
function ExternalSection(build: BuildResult): string[] {
  const { identifier } = build.External()
  return [
    Separator(),
    TsIgnore(),
    `let ${identifier} = []`,
    Separator(),
    TsIgnore(),
    `export function SetExternal(external) { ${identifier} = external.variables }`
  ]
}
// ------------------------------------------------------------------
// FunctionSection
// ------------------------------------------------------------------
function FunctionSection(build: BuildResult): string[] {
  return build.Functions().map((func) => [Separator(), TsIgnore(), `${func};`].join('\n'))
}
// ------------------------------------------------------------------
// ExportSection
// ------------------------------------------------------------------
function ExportSection(build: BuildResult): string[] {
  const body = build.UseUnevaluated() 
    ? `const context = new CheckContext({}, {}); return ${build.Call()}` 
    : `return ${build.Call()}`
  return [
    Separator(),
    TsIgnore(),
    `export function Check(value) { ${body} }`
  ]
}
// ------------------------------------------------------------------
// CodeResult
// ------------------------------------------------------------------
export interface CodeResult {
  /** External Variables  */
  External: TExternal
  /** Generated Esm module. */
  Code: string
}
// ------------------------------------------------------------------
// Code
// ------------------------------------------------------------------
/** Creates a standalone ESM validation module for the given type. */
export function Code<Type extends TSchema>(type: Type): CodeResult
/** Creates a standalone ESM validation module for the given type. */
export function Code<Context extends TProperties, Type extends TSchema>(context: Context, type: Type): CodeResult
/** Creates a standalone ESM validation module for the given type. */
export function Code(...args: unknown[]): CodeResult {
  const [context, type] = Arguments.Match<[TProperties, TSchema]>(args, {
    2: (context, type) => [context, type],
    1: (type) => [{}, type]
  })
  const build = Build(context, type)
  const code = [...ImportSection(build), ...ExternalSection(build), ...FunctionSection(build), ...ExportSection(build)].join('\n')
  return { External: build.External(), Code: code }
}
