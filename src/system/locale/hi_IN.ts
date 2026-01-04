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

/** Hindi (India) - ISO 639-1 language code 'hi' with ISO 3166-1 alpha-2 country code 'IN' for India. */
export function hi_IN(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'में अतिरिक्त गुण नहीं होने चाहिए'
    case 'anyOf': return 'anyOf में एक स्कीमा से मेल खाना चाहिए'
    case 'boolean': return 'स्कीमा गलत है'
    case 'const': return 'स्थिरांक के बराबर होना चाहिए'
    case 'contains': return 'में कम से कम 1 वैध आइटम होना चाहिए'
    case 'dependencies': return `जब गुण ${error.params.property} मौजूद हो तो उसमें ${error.params.dependencies.join(', ')} गुण होने चाहिए`
    case 'dependentRequired': return `जब गुण ${error.params.property} मौजूद हो तो उसमें ${error.params.dependencies.join(', ')} गुण होने चाहिए`
    case 'enum': return 'अनुमत मानों में से एक के बराबर होना चाहिए'
    case 'exclusiveMaximum': return `${error.params.comparison} ${error.params.limit} होना चाहिए`
    case 'exclusiveMinimum': return `${error.params.comparison} ${error.params.limit} होना चाहिए`
    case 'format': return `"${error.params.format}" प्रारूप से मेल खाना चाहिए`
    case 'if': return `"${error.params.failingKeyword}" स्कीमा से मेल खाना चाहिए`
    case 'maxItems': return `में ${error.params.limit} से अधिक आइटम नहीं होने चाहिए`
    case 'maxLength': return `में ${error.params.limit} से अधिक वर्ण नहीं होने चाहिए`
    case 'maxProperties': return `में ${error.params.limit} से अधिक गुण नहीं होने चाहिए`
    case 'maximum': return `${error.params.comparison} ${error.params.limit} होना चाहिए`
    case 'minItems': return `में ${error.params.limit} से कम आइटम नहीं होने चाहिए`
    case 'minLength': return `में ${error.params.limit} से कम वर्ण नहीं होने चाहिए`
    case 'minProperties': return `में ${error.params.limit} से कम गुण नहीं होने चाहिए`
    case 'minimum': return `${error.params.comparison} ${error.params.limit} होना चाहिए`
    case 'multipleOf': return `${error.params.multipleOf} का गुणज होना चाहिए`
    case 'not': return 'वैध नहीं होना चाहिए'
    case 'oneOf': return 'oneOf में ठीक एक स्कीमा से मेल खाना चाहिए'
    case 'pattern': return `पैटर्न "${error.params.pattern}" से मेल खाना चाहिए`
    case 'propertyNames': return `गुण नाम ${error.params.propertyNames.join(', ')} अमान्य हैं`
    case 'required': return `में आवश्यक गुण ${error.params.requiredProperties.join(', ')} होने चाहिए`
    case 'type': return typeof error.params.type === 'string' ? `${error.params.type} होना चाहिए` : `या तो ${error.params.type.join(' या ')} होना चाहिए`
    case 'unevaluatedItems': return 'में अप्रयुक्त आइटम नहीं होने चाहिए'
    case 'unevaluatedProperties': return 'में अप्रयुक्त गुण नहीं होने चाहिए'
    case 'uniqueItems': return `में डुप्लिकेट आइटम नहीं होने चाहिए`
    default: return 'एक अज्ञात सत्यापन त्रुटि हुई'
  }
}
// deno-coverage-ignore-stop