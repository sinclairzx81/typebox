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

/** Dutch (Netherlands) - ISO 639-1 language code 'nl' with ISO 3166-1 alpha-2 country code 'NL' for Netherlands. */
export function nl_NL(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'mag geen aanvullende eigenschappen hebben'
    case 'anyOf': return 'moet overeenkomen met een schema in anyOf'
    case 'boolean': return 'schema is onwaar'
    case 'const': return 'moet gelijk zijn aan constante'
    case 'contains': return 'moet ten minste 1 geldig item bevatten'
    case 'dependencies': return `moet eigenschappen ${error.params.dependencies.join(', ')} hebben wanneer eigenschap ${error.params.property} aanwezig is`
    case 'dependentRequired': return `moet eigenschappen ${error.params.dependencies.join(', ')} hebben wanneer eigenschap ${error.params.property} aanwezig is`
    case 'enum': return 'moet gelijk zijn aan een van de toegestane waarden'
    case 'exclusiveMaximum': return `moet ${error.params.comparison} ${error.params.limit} zijn`
    case 'exclusiveMinimum': return `moet ${error.params.comparison} ${error.params.limit} zijn`
    case 'format': return `moet overeenkomen met formaat "${error.params.format}"`
    case 'if': return `moet overeenkomen met "${error.params.failingKeyword}" schema`
    case 'maxItems': return `mag niet meer dan ${error.params.limit} items hebben`
    case 'maxLength': return `mag niet meer dan ${error.params.limit} tekens hebben`
    case 'maxProperties': return `mag niet meer dan ${error.params.limit} eigenschappen hebben`
    case 'maximum': return `moet ${error.params.comparison} ${error.params.limit} zijn`
    case 'minItems': return `mag niet minder dan ${error.params.limit} items hebben`
    case 'minLength': return `mag niet minder dan ${error.params.limit} tekens hebben`
    case 'minProperties': return `mag niet minder dan ${error.params.limit} eigenschappen hebben`
    case 'minimum': return `moet ${error.params.comparison} ${error.params.limit} zijn`
    case 'multipleOf': return `moet een veelvoud zijn van ${error.params.multipleOf}`
    case 'not': return 'mag niet geldig zijn'
    case 'oneOf': return 'moet precies één schema in oneOf overeenkomen'
    case 'pattern': return `moet overeenkomen met patroon "${error.params.pattern}"`
    case 'propertyNames': return `eigenschapsnamen ${error.params.propertyNames.join(', ')} zijn ongeldig`
    case 'required': return `moet de vereiste eigenschappen ${error.params.requiredProperties.join(', ')} hebben`
    case 'type': return typeof error.params.type === 'string' ? `moet ${error.params.type} zijn` : `moet ${error.params.type.join(' of ')} zijn`
    case 'unevaluatedItems': return 'mag geen onbeoordeelde items hebben'
    case 'unevaluatedProperties': return 'mag geen onbeoordeelde eigenschappen hebben'
    case 'uniqueItems': return `mag geen dubbele items hebben`
    case '~refine': return error.params.message
    case '~standard': return `moet overeenkomen met ${error.params.vendor} schema`
    default: return 'er is een onbekende validatiefout opgetreden'
  }
}
// deno-coverage-ignore-stop