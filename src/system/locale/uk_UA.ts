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

/** Ukrainian (Ukraine) - ISO 639-1 language code 'uk' with ISO 3166-1 alpha-2 country code 'UA' for Ukraine. */
export function uk_UA(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'не повинно мати додаткових властивостей'
    case 'anyOf': return 'має відповідати одній зі схем у anyOf'
    case 'boolean': return 'схема хибна'
    case 'const': return 'має дорівнювати константі'
    case 'contains': return 'має містити щонайменше 1 дійсний елемент'
    case 'dependencies': return `повинно мати властивості ${error.params.dependencies.join(', ')}, якщо властивість ${error.params.property} присутня`
    case 'dependentRequired': return `повинно мати властивості ${error.params.dependencies.join(', ')}, якщо властивість ${error.params.property} присутня`
    case 'enum': return 'має дорівнювати одному з дозволених значень'
    case 'exclusiveMaximum': return `має бути ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `має бути ${error.params.comparison} ${error.params.limit}`
    case 'format': return `має відповідати формату "${error.params.format}"`
    case 'if': return `має відповідати схемі "${error.params.failingKeyword}"`
    case 'maxItems': return `не повинно мати більше ніж ${error.params.limit} елементів`
    case 'maxLength': return `не повинно мати більше ніж ${error.params.limit} символів`
    case 'maxProperties': return `не повинно мати більше ніж ${error.params.limit} властивостей`
    case 'maximum': return `має бути ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `не повинно мати менше ніж ${error.params.limit} елементів`
    case 'minLength': return `не повинно мати менше ніж ${error.params.limit} символів`
    case 'minProperties': return `не повинно мати менше ніж ${error.params.limit} властивостей`
    case 'minimum': return `має бути ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `має бути кратним ${error.params.multipleOf}`
    case 'not': return 'не повинно бути дійсним'
    case 'oneOf': return 'має відповідати рівно одній схемі в oneOf'
    case 'pattern': return `має відповідати шаблону "${error.params.pattern}"`
    case 'propertyNames': return `імена властивостей ${error.params.propertyNames.join(', ')} є недійсними`
    case 'required': return `має містити обов'язкові властивості ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `має бути ${error.params.type}` : `має бути ${error.params.type.join(' або ')}`
    case 'unevaluatedItems': return 'не повинно мати неперевірених елементів'
    case 'unevaluatedProperties': return 'не повинно мати неперевірених властивостей'
    case 'uniqueItems': return `не повинно мати повторюваних елементів`
    case '~guard': return `повинно відповідати функції перевірки`
    case '~refine': return error.params.message
    default: return 'виникла невідома помилка валідації'
  }
}
// deno-coverage-ignore-stop