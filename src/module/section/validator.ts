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

import { Guard } from '../../guard/index.ts'
import * as Schema from '../../schema/index.ts'
import * as Annotation from '../annotation/index.ts'
import * as Canonical from '../canonical/index.ts'
import * as Metadata from './metadata.ts'

import * as BuildInfo from '../buildinfo/index.ts'
import { Banner } from './banner.ts'
import { Identifier } from './identifier.ts'
import { Value } from './value.ts'
import { Code } from './code.ts'
import { Writer } from './writer.ts'

// ------------------------------------------------------------------
// ValidatorDefinition
// ------------------------------------------------------------------
export const ValidatorDefinition = (info: BuildInfo.BuildInfo) => (`${Banner('Validator')}
export interface ${info.NameOfValidator}<Value extends unknown = unknown> {
  /** Returns the Context for this type. */
  Context(): Record<string, Record<string, unknown> | boolean>
  /** Returns the Schema for this type. */
  Schema(): Record<string, unknown> | boolean
  /** Returns true if the value is valid for this type. */
  Check(value: unknown): value is Value
  /** Returns the value if it is valid for this type, otherwise throws a TypeError. */
  Parse(value: unknown): Value
}`)
// ------------------------------------------------------------------
// ValidatorExternals
// ------------------------------------------------------------------
function ValidatorExternals(build: Schema.BuildResult): string {
  const writer = new Writer(), { identifier, variables } = build.External()
  const serialized = variables.map((variable) => Value(variable))
  writer.WriteLine(`  // @ts-ignore - compiler generated`)
  writer.WriteLine(`  const ${identifier} = [${serialized.join(', ')}]`)
  return writer.ToString()
}
// ------------------------------------------------------------------
// ValidatorChecks
// ------------------------------------------------------------------
function ValidatorChecks(info: BuildInfo.BuildInfo, build: Schema.BuildResult): string {
  const writer = new Writer()
  for (const check of build.Functions()) {
    writer.WriteLine('  // @ts-ignore - compiler generated')
    writer.WriteLine(`  ${Code(info, check)}`)
  }
  return writer.ToString()
}
// ------------------------------------------------------------------
// ValidatorMethods
// ------------------------------------------------------------------
function ValidatorMethods(info: BuildInfo.BuildInfo, name: string, build: Schema.BuildResult, metadata: Metadata.MetadataFunction): string {
  const writer = new Writer()
  const [context, schema] = metadata(info, name)
  writer.WriteLine(`  const Context = () => ${context}`)
  writer.WriteLine(`  const Schema = () => ${schema}`)
  const _ = (build.UseUnevaluated())
    ? writer.WriteLine(`  const Check = (value: unknown): value is ${name} => { const context = new ${info.NameOfCheckContext}(); return ${build.Entry()} }`)
    : writer.WriteLine(`  const Check = (value: unknown): value is ${name} => ${build.Entry()}`)
  writer.WriteLine(`  const Parse = (value: unknown): ${name} => Check(value) ? value : (() => { throw new ${info.NameOfException}.TypeError('${name}', value); })();`)
  writer.WriteLine('  return { Check, Parse, Schema, Context }')
  return writer.ToString()
}
// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------
/** Creates a validator instance. */
export const Validator = (info: BuildInfo.BuildInfo, context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XDefs & Schema.XRef, build: Schema.BuildResult, metadata: Metadata.MetadataFunction): string => {
  const writer = new Writer()
  const identifier = Identifier(info, schema.$ref.replace(`#/$defs/`, ''))
  const canonical = Canonical.Infer(context, schema)
  const annotation = Annotation.Infer(context, canonical) // { #defs }
  writer.WriteLine(Banner(identifier))
  writer.WriteLine(`declare namespace ${info.NameOfNamespace} { export type ${identifier} = ${annotation} }`)
  writer.WriteLine(`export type ${identifier} = ${info.NameOfNamespace}.${identifier}`)
  writer.WriteLine(`export const ${identifier}: ${info.NameOfValidator}<${identifier}> = /*#__PURE__*/  (() => {`)
  if (build.External().variables.length > 0) writer.WriteLine(ValidatorExternals(build))
  writer.WriteLine(ValidatorChecks(info, build))
  writer.WriteLine(ValidatorMethods(info, identifier, build, metadata))
  writer.WriteLine('})();')
  return writer.ToString()
}
// ------------------------------------------------------------------
// Validators
// ------------------------------------------------------------------
/** Creates multiple validator instances. */
export const Validators = (info: BuildInfo.BuildInfo, context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XDefs, builds: Record<PropertyKey, Schema.BuildResult>, metadata: Metadata.MetadataFunction): string => {
  const writer = new Writer()
  for (const name of Guard.Keys(schema.$defs)) {
    writer.WriteLine(Validator(info, context, { ...schema, $ref: `#/$defs/${name}` }, builds[name], metadata))
  }
  return writer.ToString()
}
