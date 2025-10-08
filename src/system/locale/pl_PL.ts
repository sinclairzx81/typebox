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

/** Polish (Poland) - ISO 639-1 language code 'pl' with ISO 3166-1 alpha-2 country code 'PL' for Poland. */
export function pl_PL(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'nie może mieć dodatkowych właściwości'
    case 'anyOf': return 'musi pasować do schematu w anyOf'
    case 'boolean': return 'schemat jest fałszywy'
    case 'const': return 'musi być równy stałej'
    case 'contains': return 'musi zawierać co najmniej 1 prawidłowy element'
    case 'dependencies': return `musi mieć właściwości ${error.params.dependencies.join(', ')}, gdy właściwość ${error.params.property} jest obecna`
    case 'dependentRequired': return `musi mieć właściwości ${error.params.dependencies.join(', ')}, gdy właściwość ${error.params.property} jest obecna`
    case 'enum': return 'musi być równy jednej z dozwolonych wartości'
    case 'exclusiveMaximum': return `musi być ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `musi być ${error.params.comparison} ${error.params.limit}`
    case 'format': return `musi pasować do formatu "${error.params.format}"`
    case 'if': return `musi pasować do schematu "${error.params.failingKeyword}"`
    case 'maxItems': return `nie może mieć więcej niż ${error.params.limit} elementów`
    case 'maxLength': return `nie może mieć więcej niż ${error.params.limit} znaków`
    case 'maxProperties': return `nie może mieć więcej niż ${error.params.limit} właściwości`
    case 'maximum': return `musi być ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `nie może mieć mniej niż ${error.params.limit} elementów`
    case 'minLength': return `nie może mieć mniej niż ${error.params.limit} znaków`
    case 'minProperties': return `nie może mieć mniej niż ${error.params.limit} właściwości`
    case 'minimum': return `musi być ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `musi być wielokrotnością ${error.params.multipleOf}`
    case 'not': return 'nie może być ważne'
    case 'oneOf': return 'musi pasować dokładnie do jednego schematu w oneOf'
    case 'pattern': return `musi pasować do wzorca "${error.params.pattern}"`
    case 'propertyNames': return `nazwy właściwości ${error.params.propertyNames.join(', ')} są nieprawidłowe`
    case 'required': return `musi mieć wymagane właściwości ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `musi być typu ${error.params.type}` : `musi być typu ${error.params.type.join(' lub ')}`
    case 'unevaluatedItems': return 'nie może mieć nieewaluowanych elementów'
    case 'unevaluatedProperties': return 'nie może mieć nieewaluowanych właściwości'
    case 'uniqueItems': return `nie może zawierać zduplikowanych elementów`
    case '~guard': return `musi pasować do funkcji sprawdzającej`
    case '~refine': return error.params.message
    default: return 'wystąpił nieznany błąd walidacji'
  }
}
// deno-coverage-ignore-stop