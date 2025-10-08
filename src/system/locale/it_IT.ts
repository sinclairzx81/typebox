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

/** Italian (Italy) - ISO 639-1 language code 'it' with ISO 3166-1 alpha-2 country code 'IT' for Italy. */
export function it_IT(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'non deve avere proprietà aggiuntive'
    case 'anyOf': return 'deve corrispondere a uno schema in anyOf'
    case 'boolean': return 'lo schema è falso'
    case 'const': return 'deve essere uguale alla costante'
    case 'contains': return 'deve contenere almeno 1 elemento valido'
    case 'dependencies': return `deve avere le proprietà ${error.params.dependencies.join(', ')} quando la proprietà ${error.params.property} è presente`
    case 'dependentRequired': return `deve avere le proprietà ${error.params.dependencies.join(', ')} quando la proprietà ${error.params.property} è presente`
    case 'enum': return 'deve essere uguale a uno dei valori consentiti'
    case 'exclusiveMaximum': return `deve essere ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `deve essere ${error.params.comparison} ${error.params.limit}`
    case 'format': return `deve corrispondere al formato "${error.params.format}"`
    case 'if': return `deve corrispondere allo schema "${error.params.failingKeyword}"`
    case 'maxItems': return `non deve avere più di ${error.params.limit} elementi`
    case 'maxLength': return `non deve avere più di ${error.params.limit} caratteri`
    case 'maxProperties': return `non deve avere più di ${error.params.limit} proprietà`
    case 'maximum': return `deve essere ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `non deve avere meno di ${error.params.limit} elementi`
    case 'minLength': return `non deve avere meno di ${error.params.limit} caratteri`
    case 'minProperties': return `non deve avere meno di ${error.params.limit} proprietà`
    case 'minimum': return `deve essere ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `deve essere un multiplo di ${error.params.multipleOf}`
    case 'not': return 'non deve essere valido'
    case 'oneOf': return 'deve corrispondere esattamente a uno schema in oneOf'
    case 'pattern': return `deve corrispondere al pattern "${error.params.pattern}"`
    case 'propertyNames': return `i nomi delle proprietà ${error.params.propertyNames.join(', ')} non sono validi`
    case 'required': return `deve avere le proprietà richieste ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `deve essere ${error.params.type}` : `deve essere ${error.params.type.join(' o ')}`
    case 'unevaluatedItems': return 'non deve avere elementi non valutati'
    case 'unevaluatedProperties': return 'non deve avere proprietà non valutate'
    case 'uniqueItems': return `non deve avere elementi duplicati`
    case '~guard': return `deve corrispondere alla funzione di controllo`
    case '~refine': return error.params.message
    default: return 'si è verificato un errore di validazione sconosciuto'
  }
}
// deno-coverage-ignore-stop