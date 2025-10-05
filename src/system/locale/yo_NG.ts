/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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
// deno-coverage-ignore-start

import { TValidationError } from '../../error/index.ts'

/** Yoruba (Nigeria) - ISO 639-1 language code 'yo' with ISO 3166-1 alpha-2 country code 'NG' for Nigeria. */
export function yo_NG(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'ko gbọdọ ni awọn ohun-ini afikun'
    case 'anyOf': return 'gbọdọ baramu àlàyé kan ninu anyOf'
    case 'boolean': return 'àlàyé jẹ eke'
    case 'const': return 'gbọdọ dọgba pẹlu ifura'
    case 'contains': return 'gbọdọ ni o kere ju nkan 1 ti o wulo'
    case 'dependencies': return `gbọdọ ni awọn ohun-ini ${error.params.dependencies.join(', ')} nigbati ohun-ini ${error.params.property} ba wa`
    case 'dependentRequired': return `gbọdọ ni awọn ohun-ini ${error.params.dependencies.join(', ')} nigbati ohun-ini ${error.params.property} ba wa`
    case 'enum': return 'gbọdọ dọgba pẹlu ọkan ninu awọn iye ti a gba laaye'
    case 'exclusiveMaximum': return `gbọdọ jẹ ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `gbọdọ jẹ ${error.params.comparison} ${error.params.limit}`
    case 'format': return `gbọdọ baramu kika "${error.params.format}"`
    case 'if': return `gbọdọ baramu àlàyé "${error.params.failingKeyword}"`
    case 'maxItems': return `ko gbọdọ ni ju ${error.params.limit} nkan lọ`
    case 'maxLength': return `ko gbọdọ ni ju ${error.params.limit} ohun kikọ lọ`
    case 'maxProperties': return `ko gbọdọ ni ju ${error.params.limit} ohun-ini lọ`
    case 'maximum': return `gbọdọ jẹ ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `ko gbọdọ ni o kere ju ${error.params.limit} nkan lọ`
    case 'minLength': return `ko gbọdọ ni o kere ju ${error.params.limit} ohun kikọ lọ`
    case 'minProperties': return `ko gbọdọ ni o kere ju ${error.params.limit} ohun-ini lọ`
    case 'minimum': return `gbọdọ jẹ ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `gbọdọ jẹ isodipupo ti ${error.params.multipleOf}`
    case 'not': return 'ko gbọdọ wulo'
    case 'oneOf': return 'gbọdọ baramu àlàyé kan ṣoṣo ninu oneOf'
    case 'pattern': return `gbọdọ baramu apẹrẹ "${error.params.pattern}"`
    case 'propertyNames': return `awọn orukọ ohun-ini ${error.params.propertyNames.join(', ')} ko wulo`
    case 'required': return `gbọdọ ni awọn ohun-ini ti a beere ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `gbọdọ jẹ ${error.params.type}` : `gbọdọ jẹ boya ${error.params.type.join(' tabi ')}`
    case 'unevaluatedItems': return 'ko gbọdọ ni awọn ohun ti ko ṣe iṣiro'
    case 'unevaluatedProperties': return 'ko gbọdọ ni awọn ohun-ini ti ko ṣe iṣiro'
    case 'uniqueItems': return `ko gbọdọ ni awọn ohun elo ẹda`
    case '~refine': return error.params.message
    case '~base': return `gbọdọ baramu àlàyé ${'Base'}`
    default: return 'aṣiṣe ijẹrisi aimọ waye'
  }
}
// deno-coverage-ignore-stop