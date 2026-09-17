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

import { Arguments } from '../../system/arguments/index.ts'
import { Build, type XSchema } from '../../schema/index.ts'
import { ImportsSection } from './section/imports.ts'
import { SchemasSection } from './section/schemas.ts'
import { VariableSection } from './section/variables.ts'
import { ChecksSection } from './/section/checks.ts'
import { ExportsSection } from './section/exports.ts'
import { StaticsSection } from './section/statics.ts'
import { DefaultsSection } from './section/defaults.ts'
import { Writer } from '../writer.ts'

/** Generates a TypeScript validation module for the given schema */
export function TypeScript(schema: XSchema): string
/** Generates a TypeScript validation module for the given type */
export function TypeScript(context: Record<string, XSchema>, schema: XSchema): string
/** Generates a TypeScript validation module for the given type */
export function TypeScript(...args: unknown[]): string {
  const [context, schema] = Arguments.Match<[Record<string, XSchema>, XSchema]>(args, {
    2: (context, schema) => [context, schema],
    1: (schema) => [{}, schema]
  })
  const build = Build(context, schema)
  const writer = new Writer()
  writer.WriteLine('// @ts-nocheck')
  writer.WriteLine(ImportsSection(build))
  writer.WriteLine(VariableSection(build))
  writer.WriteLine(SchemasSection(build))
  writer.WriteLine(ChecksSection(build))
  writer.WriteLine(StaticsSection(build))
  writer.WriteLine(ExportsSection(build))
  writer.WriteLine(DefaultsSection(build))
  return writer.ToString()
}
