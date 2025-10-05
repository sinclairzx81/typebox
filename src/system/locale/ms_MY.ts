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

/** Malay (Malaysia) - ISO 639-1 language code 'ms' with ISO 3166-1 alpha-2 country code 'MY' for Malaysia. */
export function ms_MY(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'tidak boleh mempunyai sifat tambahan'
    case 'anyOf': return 'mesti sepadan dengan skema dalam anyOf'
    case 'boolean': return 'skema adalah palsu'
    case 'const': return 'mesti sama dengan pemalar'
    case 'contains': return 'mesti mengandungi sekurang-kurangnya 1 item yang sah'
    case 'dependencies': return `mesti mempunyai sifat ${error.params.dependencies.join(', ')} apabila sifat ${error.params.property} hadir`
    case 'dependentRequired': return `mesti mempunyai sifat ${error.params.dependencies.join(', ')} apabila sifat ${error.params.property} hadir`
    case 'enum': return 'mesti sama dengan salah satu nilai yang dibenarkan'
    case 'exclusiveMaximum': return `mesti ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `mesti ${error.params.comparison} ${error.params.limit}`
    case 'format': return `mesti sepadan dengan format "${error.params.format}"`
    case 'if': return `mesti sepadan dengan skema "${error.params.failingKeyword}"`
    case 'maxItems': return `tidak boleh mempunyai lebih daripada ${error.params.limit} item`
    case 'maxLength': return `tidak boleh mempunyai lebih daripada ${error.params.limit} aksara`
    case 'maxProperties': return `tidak boleh mempunyai lebih daripada ${error.params.limit} sifat`
    case 'maximum': return `mesti ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `tidak boleh mempunyai kurang daripada ${error.params.limit} item`
    case 'minLength': return `tidak boleh mempunyai kurang daripada ${error.params.limit} aksara`
    case 'minProperties': return `tidak boleh mempunyai kurang daripada ${error.params.limit} sifat`
    case 'minimum': return `mesti ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `mesti gandaan ${error.params.multipleOf}`
    case 'not': return 'tidak boleh sah'
    case 'oneOf': return 'mesti sepadan dengan tepat satu skema dalam oneOf'
    case 'pattern': return `mesti sepadan dengan corak "${error.params.pattern}"`
    case 'propertyNames': return `nama sifat ${error.params.propertyNames.join(', ')} tidak sah`
    case 'required': return `mesti mempunyai sifat yang diperlukan ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `mesti ${error.params.type}` : `mesti sama ada ${error.params.type.join(' atau ')}`
    case 'unevaluatedItems': return 'tidak boleh mempunyai item yang tidak dinilai'
    case 'unevaluatedProperties': return 'tidak boleh mempunyai sifat yang tidak dinilai'
    case 'uniqueItems': return `tidak boleh mempunyai item pendua`
    case '~refine': return error.params.message
    case '~base': return `mesti sepadan dengan skema ${'validator'}`
    default: return 'ralat pengesahan yang tidak diketahui berlaku'
  }
}
// deno-coverage-ignore-stop