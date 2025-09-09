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

/** Hausa (Nigeria) - ISO 639-1 language code 'ha' with ISO 3166-1 alpha-2 country code 'NG' for Nigeria. */
export function ha_NG(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'kada ya kasance yana da ƙarin kaddarori'
    case 'anyOf': return 'dole ne ya dace da wani tsari a cikin anyOf'
    case 'boolean': return 'tsarin yana da karya'
    case 'const': return 'dole ne ya zama daidai da madaidaicin'
    case 'contains': return 'dole ne ya ƙunshi aƙalla abu 1 mai inganci'
    case 'dependencies': return `dole ne ya kasance yana da kaddarori ${error.params.dependencies.join(', ')} idan kadara ${error.params.property} tana nan`
    case 'dependentRequired': return `dole ne ya kasance yana da kaddarori ${error.params.dependencies.join(', ')} idan kadara ${error.params.property} tana nan`
    case 'enum': return 'dole ne ya zama daidai da ɗayan ƙimar da aka yarda'
    case 'exclusiveMaximum': return `dole ne ya zama ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `dole ne ya zama ${error.params.comparison} ${error.params.limit}`
    case 'format': return `dole ne ya dace da tsarin "${error.params.format}"`
    case 'if': return `dole ne ya dace da tsarin "${error.params.failingKeyword}"`
    case 'maxItems': return `kada ya kasance yana da fiye da abubuwa ${error.params.limit}`
    case 'maxLength': return `kada ya kasance yana da fiye da haruffa ${error.params.limit}`
    case 'maxProperties': return `kada ya kasance yana da fiye da kaddarori ${error.params.limit}`
    case 'maximum': return `dole ne ya zama ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `kada ya kasance yana da ƙasa da abubuwa ${error.params.limit}`
    case 'minLength': return `kada ya kasance yana da ƙasa da haruffa ${error.params.limit}`
    case 'minProperties': return `kada ya kasance yana da ƙasa da kaddarori ${error.params.limit}`
    case 'minimum': return `dole ne ya zama ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `dole ne ya zama ninki na ${error.params.multipleOf}`
    case 'not': return 'kada ya zama mai inganci'
    case 'oneOf': return 'dole ne ya dace da tsari ɗaya kawai a cikin oneOf'
    case 'pattern': return `dole ne ya dace da tsari "${error.params.pattern}"`
    case 'propertyNames': return `sunayen kaddarori ${error.params.propertyNames.join(', ')} ba su da inganci`
    case 'required': return `dole ne ya kasance yana da kaddarori masu mahimmanci ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `dole ne ya zama ${error.params.type}` : `dole ne ya zama ɗaya daga cikin ${error.params.type.join(' ko ')}`
    case 'unevaluatedItems': return 'kada ya kasance yana da abubuwan da ba a kimanta su ba'
    case 'unevaluatedProperties': return 'kada ya kasance yana da kaddarorin da ba a kimanta su ba'
    case 'uniqueItems': return `kada ya kasance yana da abubuwan da suka yi kama`
    case '~refine': return error.params.message
    case '~standard': return `dole ne ya dace da tsarin ${error.params.vendor}`
    default: return 'an sami kuskuren tabbatarwa da ba a sani ba'
  }
}
// deno-coverage-ignore-stop