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
// deno-coverage-ignore-start

import { TValidationError } from '../../error/index.ts'

/** Russian (Russia) - ISO 639-1 language code 'ru' with ISO 3166-1 alpha-2 country code 'RU' for Russia. */
export function ru_RU(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'не должно быть дополнительных свойств'
    case 'anyOf': return 'должен соответствовать одной из схем в anyOf'
    case 'boolean': return 'схема является ложной'
    case 'const': return 'должно быть равно константе'
    case 'contains': return 'должен содержать хотя бы 1 допустимый элемент'
    case 'dependencies': return `должен иметь свойства ${error.params.dependencies.join(', ')}, когда свойство ${error.params.property} присутствует`
    case 'dependentRequired': return `должен иметь свойства ${error.params.dependencies.join(', ')}, когда свойство ${error.params.property} присутствует`
    case 'enum': return 'должно быть равно одному из разрешенных значений'
    case 'exclusiveMaximum': return `должно быть ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `должно быть ${error.params.comparison} ${error.params.limit}`
    case 'format': return `должен соответствовать формату "${error.params.format}"`
    case 'if': return `должен соответствовать схеме "${error.params.failingKeyword}"`
    case 'maxItems': return `не должно быть более ${error.params.limit} элементов`
    case 'maxLength': return `не должно быть более ${error.params.limit} символов`
    case 'maxProperties': return `не должно быть более ${error.params.limit} свойств`
    case 'maximum': return `должно быть ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `не должно быть менее ${error.params.limit} элементов`
    case 'minLength': return `не должно быть менее ${error.params.limit} символов`
    case 'minProperties': return `не должно быть менее ${error.params.limit} свойств`
    case 'minimum': return `должно быть ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `должно быть кратно ${error.params.multipleOf}`
    case 'not': return 'не должно быть действительным'
    case 'oneOf': return 'должен соответствовать ровно одной схеме в oneOf'
    case 'pattern': return `должен соответствовать шаблону "${error.params.pattern}"`
    case 'propertyNames': return `имена свойств ${error.params.propertyNames.join(', ')} недопустимы`
    case 'required': return `должен иметь обязательные свойства ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `должен быть ${error.params.type}` : `должен быть либо ${error.params.type.join(' или ')}`
    case 'unevaluatedItems': return 'не должно быть нерассмотренных элементов'
    case 'unevaluatedProperties': return 'не должно быть нерассмотренных свойств'
    case 'uniqueItems': return `не должно быть повторяющихся элементов`
    case '~guard': return `должно соответствовать проверочной функции`
    case '~refine': return error.params.message
    default: return 'произошла неизвестная ошибка валидации'
  }
}
// deno-coverage-ignore-stop