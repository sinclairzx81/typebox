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

/** Czech (Czech Republic) - ISO 639-1 language code 'cs' with ISO 3166-1 alpha-2 country code 'CZ' for Czech Republic. */
export function cs_CZ(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'nesmí mít další vlastnosti'
    case 'anyOf': return 'musí odpovídat schématu v anyOf'
    case 'boolean': return 'schéma je nepravdivé'
    case 'const': return 'musí být rovno konstantě'
    case 'contains': return 'musí obsahovat alespoň 1 platnou položku'
    case 'dependencies': return `musí mít vlastnosti ${error.params.dependencies.join(', ')}, pokud je vlastnost ${error.params.property} přítomna`
    case 'dependentRequired': return `musí mít vlastnosti ${error.params.dependencies.join(', ')}, pokud je vlastnost ${error.params.property} přítomna`
    case 'enum': return 'musí být rovno jedné z povolených hodnot'
    case 'exclusiveMaximum': return `musí být ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `musí být ${error.params.comparison} ${error.params.limit}`
    case 'format': return `musí odpovídat formátu "${error.params.format}"`
    case 'if': return `musí odpovídat schématu "${error.params.failingKeyword}"`
    case 'maxItems': return `nesmí mít více než ${error.params.limit} položek`
    case 'maxLength': return `nesmí mít více než ${error.params.limit} znaků`
    case 'maxProperties': return `nesmí mít více než ${error.params.limit} vlastností`
    case 'maximum': return `musí být ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `nesmí mít méně než ${error.params.limit} položek`
    case 'minLength': return `nesmí mít méně než ${error.params.limit} znaků`
    case 'minProperties': return `nesmí mít méně než ${error.params.limit} vlastností`
    case 'minimum': return `musí být ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `musí být násobkem ${error.params.multipleOf}`
    case 'not': return 'nesmí být platné'
    case 'oneOf': return 'musí odpovídat přesně jednomu schématu v oneOf'
    case 'pattern': return `musí odpovídat vzoru "${error.params.pattern}"`
    case 'propertyNames': return `názvy vlastností ${error.params.propertyNames.join(', ')} jsou neplatné`
    case 'required': return `musí mít povinné vlastnosti ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `musí být ${error.params.type}` : `musí být ${error.params.type.join(' nebo ')}`
    case 'unevaluatedItems': return 'nesmí mít nevyhodnocené položky'
    case 'unevaluatedProperties': return 'nesmí mít nevyhodnocené vlastnosti'
    case 'uniqueItems': return `nesmí mít duplicitní položky`
    case '~refine': return error.params.message
    case '~base': return `musí odpovídat schématu ${'Base'}`
    default: return 'došlo k neznámé chybě ověření'
  }
}
// deno-coverage-ignore-stop