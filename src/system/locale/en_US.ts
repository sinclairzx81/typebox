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

import { TValidationError } from '../../error/index.ts'

/** en_US: English (United States) - ISO 639-1 language code 'en' with ISO 3166-1 alpha-2 country code 'US' for United States. */
export function en_US(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'must not have additional properties'
    case 'anyOf': return 'must match a schema in anyOf'
    case 'boolean': return 'schema is false'
    case 'const': return 'must be equal to constant'
    case 'contains': return 'must contain at least 1 valid item'
    case 'dependencies': return `must have properties ${error.params.dependencies.join(', ')} when property ${error.params.property} is present`
    case 'dependentRequired': return `must have properties ${error.params.dependencies.join(', ')} when property ${error.params.property} is present`
    case 'enum': return 'must be equal to one of the allowed values'
    case 'exclusiveMaximum': return `must be ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `must be ${error.params.comparison} ${error.params.limit}`
    case 'format': return `must match format "${error.params.format}"`
    case 'if': return `must match "${error.params.failingKeyword}" schema`
    case 'maxItems': return `must not have more than ${error.params.limit} items`
    case 'maxLength': return `must not have more than ${error.params.limit} characters`
    case 'maxProperties': return `must not have more than ${error.params.limit} properties`
    case 'maximum': return `must be ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `must not have fewer than ${error.params.limit} items`
    case 'minLength': return `must not have fewer than ${error.params.limit} characters`
    case 'minProperties': return `must not have fewer than ${error.params.limit} properties`
    case 'minimum': return `must be ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `must be multiple of ${error.params.multipleOf}`
    case 'not': return 'must not be valid'
    case 'oneOf': return 'must match exactly one schema in oneOf'
    case 'pattern': return `must match pattern "${error.params.pattern}"`
    case 'propertyNames': return `property names ${error.params.propertyNames.join(', ')} are invalid`
    case 'required': return `must have required properties ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `must be ${error.params.type}` : `must be either ${error.params.type.join(' or ')}`
    case 'unevaluatedItems': return 'must not have unevaluated items'
    case 'unevaluatedProperties': return 'must not have unevaluated properties'
    case 'uniqueItems': return `must not have duplicate items`
    case '~refine': return error.params.message
    case '~guard': return `must match guard logic`
    // deno-coverage-ignore - unreachable
    default: return 'an unknown validation error occurred'
  }
}