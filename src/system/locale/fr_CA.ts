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

/** French (Canada) - ISO 639-1 language code 'fr' with ISO 3166-1 alpha-2 country code 'CA' for Canada. */
export function fr_CA(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'ne doit pas avoir de propriétés additionnelles'
    case 'anyOf': return 'doit correspondre à un schéma dans anyOf'
    case 'boolean': return 'le schéma est faux'
    case 'const': return 'doit être égal à la constante'
    case 'contains': return 'doit contenir au moins 1 élément valide'
    case 'dependencies': return `doit avoir les propriétés ${error.params.dependencies.join(', ')} lorsque la propriété ${error.params.property} est présente`
    case 'dependentRequired': return `doit avoir les propriétés ${error.params.dependencies.join(', ')} lorsque la propriété ${error.params.property} est présente`
    case 'enum': return 'doit être égal à l\'une des valeurs autorisées'
    case 'exclusiveMaximum': return `doit être ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `doit être ${error.params.comparison} ${error.params.limit}`
    case 'format': return `doit correspondre au format "${error.params.format}"`
    case 'if': return `doit correspondre au schéma "${error.params.failingKeyword}"`
    case 'maxItems': return `ne doit pas avoir plus de ${error.params.limit} éléments`
    case 'maxLength': return `ne doit pas avoir plus de ${error.params.limit} caractères`
    case 'maxProperties': return `ne doit pas avoir plus de ${error.params.limit} propriétés`
    case 'maximum': return `doit être ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `ne doit pas avoir moins de ${error.params.limit} éléments`
    case 'minLength': return `ne doit pas avoir moins de ${error.params.limit} caractères`
    case 'minProperties': return `ne doit pas avoir moins de ${error.params.limit} propriétés`
    case 'minimum': return `doit être ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `doit être un multiple de ${error.params.multipleOf}`
    case 'not': return 'ne doit pas être valide'
    case 'oneOf': return 'doit correspondre exactement à un schéma dans oneOf'
    case 'pattern': return `doit correspondre au motif "${error.params.pattern}"`
    case 'propertyNames': return `les noms de propriété ${error.params.propertyNames.join(', ')} sont invalides`
    case 'required': return `doit avoir les propriétés requises ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `doit être ${error.params.type}` : `doit être l'un des types suivants : ${error.params.type.join(' ou ')}`
    case 'unevaluatedItems': return 'ne doit pas avoir d\'éléments non évalués'
    case 'unevaluatedProperties': return 'ne doit pas avoir de propriétés non évaluées'
    case 'uniqueItems': return `ne doit pas avoir d'éléments en double`
    case '~refine': return error.params.message
    case '~base': return `doit correspondre au schéma ${'validator'}`
    default: return 'une erreur de validation inconnue est survenue'
  }
}
// deno-coverage-ignore-stop