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

/** Filipino (Philippines) - ISO 639-1 language code 'fil' with ISO 3166-1  */
export function fil_PH(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'hindi dapat magkaroon ng karagdagang mga katangian'
    case 'anyOf': return 'dapat tumugma sa isang schema sa anyOf'
    case 'boolean': return 'mali ang schema'
    case 'const': return 'dapat katumbas ng konstante'
    case 'contains': return 'dapat maglaman ng hindi bababa sa 1 wastong item'
    case 'dependencies': return `dapat magkaroon ng mga katangian ${error.params.dependencies.join(', ')} kapag naroroon ang katangian ${error.params.property}`
    case 'dependentRequired': return `dapat magkaroon ng mga katangian ${error.params.dependencies.join(', ')} kapag naroroon ang katangian ${error.params.property}`
    case 'enum': return 'dapat katumbas ng isa sa mga pinapayagang halaga'
    case 'exclusiveMaximum': return `dapat ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `dapat ${error.params.comparison} ${error.params.limit}`
    case 'format': return `dapat tumugma sa format na "${error.params.format}"`
    case 'if': return `dapat tumugma sa "${error.params.failingKeyword}" schema`
    case 'maxItems': return `hindi dapat magkaroon ng higit sa ${error.params.limit} item`
    case 'maxLength': return `hindi dapat magkaroon ng higit sa ${error.params.limit} karakter`
    case 'maxProperties': return `hindi dapat magkaroon ng higit sa ${error.params.limit} katangian`
    case 'maximum': return `dapat ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `hindi dapat magkaroon ng mas kaunti sa ${error.params.limit} item`
    case 'minLength': return `hindi dapat magkaroon ng mas kaunti sa ${error.params.limit} karakter`
    case 'minProperties': return `hindi dapat magkaroon ng mas kaunti sa ${error.params.limit} katangian`
    case 'minimum': return `dapat ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `dapat maramihan ng ${error.params.multipleOf}`
    case 'not': return 'hindi dapat wasto'
    case 'oneOf': return 'dapat tumugma nang eksakto sa isang schema sa oneOf'
    case 'pattern': return `dapat tumugma sa pattern na "${error.params.pattern}"`
    case 'propertyNames': return `ang mga pangalan ng katangian na ${error.params.propertyNames.join(', ')} ay hindi wasto`
    case 'required': return `dapat magkaroon ng mga kinakailangang katangian ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `dapat ${error.params.type}` : `dapat ay ${error.params.type.join(' o ')}`
    case 'unevaluatedItems': return 'hindi dapat magkaroon ng mga hindi pa nasusuring item'
    case 'unevaluatedProperties': return 'hindi dapat magkaroon ng mga hindi pa nasusuring katangian'
    case 'uniqueItems': return `hindi dapat magkaroon ng mga duplicate na item`
    case '~refine': return error.params.message
    case '~standard': return `dapat tumugma laban sa ${error.params.vendor} schema`
    default: return 'nagkaroon ng hindi kilalang error sa pagpapatunay'
  }
}
// deno-coverage-ignore-stop