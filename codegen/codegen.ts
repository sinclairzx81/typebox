/*--------------------------------------------------------------------------

@sinclair/typebox/codegen

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

import { TSchema } from '@sinclair/typebox'
import { TypeBoxCodegen } from './typebox'
import { TypeScriptCodegen } from './typescript'
import { JsonSchemaCodegen } from './jsonschema'
import { ZodCodegen, ZodCodegenOptions } from './zod'

export namespace Codegen {
  /** Generates TypeScript type definitions from TypeBox types */
  export function TypeScript(schema: TSchema, references: TSchema[] = []): string {
    return TypeScriptCodegen.Generate(schema, references)
  }
  /** Generates Zod type definitions from TypeBox types */
  export function Zod(schema: TSchema, references: TSchema[] = [], options: ZodCodegenOptions = { imports: true, exports: false }): string {
    return ZodCodegen.Generate(schema, references, options)
  }
  /** Generates TypeBox type definitions from TypeScript code */
  export function TypeBox(code: string): string {
    return TypeBoxCodegen.Generate(code)
  }

  /** Generates JsonSchema definitions from TypeScript code */
  export function JsonSchema(code: string): string {
    return JsonSchemaCodegen.Generate(code)
  }
}
