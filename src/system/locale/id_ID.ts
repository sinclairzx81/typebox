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

/** Indonesian (Indonesia) - ISO 639-1 language code 'id' with ISO 3166-1 alpha-2 country code 'ID' for Indonesia. */
export function id_ID(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'tidak boleh memiliki properti tambahan'
    case 'anyOf': return 'harus cocok dengan skema di anyOf'
    case 'boolean': return 'skema salah'
    case 'const': return 'harus sama dengan konstanta'
    case 'contains': return 'harus mengandung setidaknya 1 item yang valid'
    case 'dependencies': return `harus memiliki properti ${error.params.dependencies.join(', ')} ketika properti ${error.params.property} ada`
    case 'dependentRequired': return `harus memiliki properti ${error.params.dependencies.join(', ')} ketika properti ${error.params.property} ada`
    case 'enum': return 'harus sama dengan salah satu nilai yang diizinkan'
    case 'exclusiveMaximum': return `harus ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `harus ${error.params.comparison} ${error.params.limit}`
    case 'format': return `harus cocok dengan format "${error.params.format}"`
    case 'if': return `harus cocok dengan skema "${error.params.failingKeyword}"`
    case 'maxItems': return `tidak boleh memiliki lebih dari ${error.params.limit} item`
    case 'maxLength': return `tidak boleh memiliki lebih dari ${error.params.limit} karakter`
    case 'maxProperties': return `tidak boleh memiliki lebih dari ${error.params.limit} properti`
    case 'maximum': return `harus ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `tidak boleh memiliki kurang dari ${error.params.limit} item`
    case 'minLength': return `tidak boleh memiliki kurang dari ${error.params.limit} karakter`
    case 'minProperties': return `tidak boleh memiliki kurang dari ${error.params.limit} properti`
    case 'minimum': return `harus ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `harus kelipatan dari ${error.params.multipleOf}`
    case 'not': return 'tidak boleh valid'
    case 'oneOf': return 'harus cocok persis dengan satu skema di oneOf'
    case 'pattern': return `harus cocok dengan pola "${error.params.pattern}"`
    case 'propertyNames': return `nama properti ${error.params.propertyNames.join(', ')} tidak valid`
    case 'required': return `harus memiliki properti yang wajib diisi ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `harus berupa ${error.params.type}` : `harus berupa ${error.params.type.join(' atau ')}`
    case 'unevaluatedItems': return 'tidak boleh memiliki item yang belum dievaluasi'
    case 'unevaluatedProperties': return 'tidak boleh memiliki properti yang belum dievaluasi'
    case 'uniqueItems': return `tidak boleh memiliki item duplikat`
    case '~refine': return error.params.message
    case '~base': return `harus cocok dengan skema ${'Base'}`
    default: return 'terjadi kesalahan validasi yang tidak diketahui'
  }
}
// deno-coverage-ignore-stop