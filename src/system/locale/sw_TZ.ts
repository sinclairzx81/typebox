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

/** Swahili (Tanzania) - ISO 639-1 language code 'sw' with ISO 3166-1 alpha-2 country code 'TZ' for Tanzania (as a common representative). */
export function sw_TZ(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'haipaswi kuwa na sifa za ziada'
    case 'anyOf': return 'lazima ilingane na schema katika anyOf'
    case 'boolean': return 'schema si sahihi'
    case 'const': return 'lazima iwe sawa na nambari isiyobadilika'
    case 'contains': return 'lazima iwe na angalau kipengee 1 halali'
    case 'dependencies': return `lazima iwe na sifa ${error.params.dependencies.join(', ')} wakati sifa ${error.params.property} ipo`
    case 'dependentRequired': return `lazima iwe na sifa ${error.params.dependencies.join(', ')} wakati sifa ${error.params.property} ipo`
    case 'enum': return 'lazima iwe sawa na mojawapo ya thamani zinazoruhusiwa'
    case 'exclusiveMaximum': return `lazima iwe ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `lazima iwe ${error.params.comparison} ${error.params.limit}`
    case 'format': return `lazima ilingane na muundo "${error.params.format}"`
    case 'if': return `lazima ilingane na schema ya "${error.params.failingKeyword}"`
    case 'maxItems': return `haipaswi kuwa na vitu zaidi ya ${error.params.limit}`
    case 'maxLength': return `haipaswi kuwa na herufi zaidi ya ${error.params.limit}`
    case 'maxProperties': return `haipaswi kuwa na sifa zaidi ya ${error.params.limit}`
    case 'maximum': return `lazima iwe ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `haipaswi kuwa na vitu pungufu ya ${error.params.limit}`
    case 'minLength': return `haipaswi kuwa na herufi pungufu ya ${error.params.limit}`
    case 'minProperties': return `haipaswi kuwa na sifa pungufu ya ${error.params.limit}`
    case 'minimum': return `lazima iwe ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `lazima iwe zao la ${error.params.multipleOf}`
    case 'not': return 'haipaswi kuwa halali'
    case 'oneOf': return 'lazima ilingane na schema moja tu katika oneOf'
    case 'pattern': return `lazima ilingane na muundo "${error.params.pattern}"`
    case 'propertyNames': return `majina ya sifa ${error.params.propertyNames.join(', ')} si halali`
    case 'required': return `lazima iwe na sifa zinazohitajika ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `lazima iwe ${error.params.type}` : `lazima iwe ${error.params.type.join(' au ')}`
    case 'unevaluatedItems': return 'haipaswi kuwa na vitu visivyotathminiwa'
    case 'unevaluatedProperties': return 'haipaswi kuwa na sifa zisizotathminiwa'
    case 'uniqueItems': return `haipaswi kuwa na vitu vilivyofanana`
    default: return 'hitilafu isiyojulikana ya uthibitishaji imetokea'
  }
}
// deno-coverage-ignore-stop