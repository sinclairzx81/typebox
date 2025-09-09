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

/** Bengali (Bangladesh) - ISO 639-1 language code 'bn' with ISO 3166-1 alpha-2 country code 'BD' for Bangladesh. */
export function bn_BD(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'অতিরিক্ত বৈশিষ্ট্য থাকতে পারবে না'
    case 'anyOf': return 'anyOf-এর একটি স্কিমার সাথে মিলতে হবে'
    case 'boolean': return 'স্কিমা মিথ্যা'
    case 'const': return 'ধ্রুবকের সমান হতে হবে'
    case 'contains': return 'অন্তত 1টি বৈধ আইটেম থাকতে হবে'
    case 'dependencies': return `যখন ${error.params.property} বৈশিষ্ট্য বিদ্যমান থাকে, তখন ${error.params.dependencies.join(', ')} বৈশিষ্ট্য থাকতে হবে`
    case 'dependentRequired': return `যখন ${error.params.property} বৈশিষ্ট্য বিদ্যমান থাকে, তখন ${error.params.dependencies.join(', ')} বৈশিষ্ট্য থাকতে হবে`
    case 'enum': return 'অনুমোদিত মানগুলির একটির সমান হতে হবে'
    case 'exclusiveMaximum': return `অবশ্যই ${error.params.comparison} ${error.params.limit} হতে হবে`
    case 'exclusiveMinimum': return `অবশ্যই ${error.params.comparison} ${error.params.limit} হতে হবে`
    case 'format': return `অবশ্যই "${error.params.format}" ফরম্যাটের সাথে মিলতে হবে`
    case 'if': return `অবশ্যই "${error.params.failingKeyword}" স্কিমার সাথে মিলতে হবে`
    case 'maxItems': return `${error.params.limit}টির বেশি আইটেম থাকতে পারবে না`
    case 'maxLength': return `${error.params.limit}টির বেশি অক্ষর থাকতে পারবে না`
    case 'maxProperties': return `${error.params.limit}টির বেশি বৈশিষ্ট্য থাকতে পারবে না`
    case 'maximum': return `অবশ্যই ${error.params.comparison} ${error.params.limit} হতে হবে`
    case 'minItems': return `${error.params.limit}টির কম আইটেম থাকতে পারবে না`
    case 'minLength': return `${error.params.limit}টির কম অক্ষর থাকতে পারবে না`
    case 'minProperties': return `${error.params.limit}টির কম বৈশিষ্ট্য থাকতে পারবে না`
    case 'minimum': return `অবশ্যই ${error.params.comparison} ${error.params.limit} হতে হবে`
    case 'multipleOf': return `${error.params.multipleOf}-এর গুণিতক হতে হবে`
    case 'not': return 'বৈধ হতে পারবে না'
    case 'oneOf': return 'oneOf-এর শুধুমাত্র একটি স্কিমার সাথে মিলতে হবে'
    case 'pattern': return `অবশ্যই "${error.params.pattern}" প্যাটার্নের সাথে মিলতে হবে`
    case 'propertyNames': return `বৈশিষ্ট্য নাম ${error.params.propertyNames.join(', ')} অবৈধ`
    case 'required': return `প্রয়োজনীয় বৈশিষ্ট্য ${error.params.requiredProperties.join(', ')} থাকতে হবে`
    case 'type': return typeof error.params.type === 'string' ? `অবশ্যই ${error.params.type} হতে হবে` : `অবশ্যই ${error.params.type.join(' অথবা ')} হতে হবে`
    case 'unevaluatedItems': return 'অবমূল্যায়িত আইটেম থাকতে পারবে না'
    case 'unevaluatedProperties': return 'অবমূল্যায়িত বৈশিষ্ট্য থাকতে পারবে না'
    case 'uniqueItems': return `অনুলিপি আইটেম থাকতে পারবে না`
    case '~refine': return error.params.message
    case '~standard': return `${error.params.vendor} স্কিমার সাথে মিলতে হবে`
    default: return 'একটি অজানা বৈধকরণ ত্রুটি ঘটেছে'
  }
}
// deno-coverage-ignore-stop