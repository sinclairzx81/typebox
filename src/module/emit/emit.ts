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
import * as BuildInfo from '../buildinfo/index.ts'
import * as Section from '../section/index.ts'

// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
/** Builds a module with a namespace containing many types */
export function Module(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XDefs, metadata: Section.MetadataFunction): string {
  const writer = new Section.Writer()
  const builds = Guard.Keys(schema.$defs).reduce<Record<PropertyKey, Schema.BuildResult>>((result, name) => {
    return { ...result, [name]: Schema.Build(context, { ...schema, $ref: `#/$defs/${name}` }) }
  }, {})
  const info = BuildInfo.Module(builds, false)
  if (info.UseValidatorDefinition) writer.WriteLine(Section.ValidatorDefinition(info))
  if (info.UseException) writer.WriteLine(Section.Exception(info))
  if (info.UseGuard) writer.WriteLine(Section.GuardModule(info))
  if (info.UseGlobalGuard) writer.WriteLine(Section.GlobalsGuardModule(info))
  if (info.UseHashing) writer.WriteLine(Section.HashingModule(info))
  if (info.UseIdna) writer.WriteLine(Section.IdnaModule(info))
  if (info.UseFormat) writer.WriteLine(Section.FormatModule(info))
  if (info.UseCheckContext) writer.WriteLine(Section.CheckContext(info))
  writer.WriteLine(Section.Metadata(info, context, schema))
  writer.WriteLine(Section.Validators(info, context, schema, builds, metadata))
  writer.WriteLine(Section.ExportModule(info, schema))
  return writer.ToString()
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Builds a module with a single type */
export function Type(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema, metadata: Section.MetadataFunction): string {
  const writer = new Section.Writer()
  const build = Schema.Build(context, schema)
  const info = BuildInfo.Type(build, false)
  if (info.UseException) writer.WriteLine(Section.Exception(info))
  if (info.UseValidatorDefinition) writer.WriteLine(Section.ValidatorDefinition(info))
  if (info.UseGuard) writer.WriteLine(Section.GuardModule(info))
  if (info.UseGlobalGuard) writer.WriteLine(Section.GlobalsGuardModule(info))
  if (info.UseHashing) writer.WriteLine(Section.HashingModule(info))
  if (info.UseIdna) writer.WriteLine(Section.IdnaModule(info))
  if (info.UseFormat) writer.WriteLine(Section.FormatModule(info))
  if (info.UseCheckContext) writer.WriteLine(Section.CheckContext(info))
  const resolved = { $defs: { 'Type': schema }, $ref: '#/$defs/Type' }
  writer.WriteLine(Section.Metadata(info, context, resolved))
  writer.WriteLine(Section.Validator(info, context, resolved, build, metadata))
  writer.WriteLine(Section.ExportType(info, resolved))
  return writer.ToString()
}