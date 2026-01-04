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


/** Urdu (Pakistan) - ISO 639-1 language code 'ur' with ISO 3166-1 alpha-2 country code 'PK' for Pakistan. */
export function ur_PK(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'اضافی خصوصیات نہیں ہونی چاہیے'
    case 'anyOf': return 'anyOf میں کسی اسکیم سے مماثل ہونا چاہیے'
    case 'boolean': return 'اسکیما غلط ہے'
    case 'const': return 'مستقل کے برابر ہونا چاہیے'
    case 'contains': return 'کم از کم 1 درست آئٹم ہونا چاہیے'
    case 'dependencies': return `اگر خصوصیت ${error.params.property} موجود ہو تو خصوصیات ${error.params.dependencies.join(', ')} ہونی چاہیے`
    case 'dependentRequired': return `اگر خصوصیت ${error.params.property} موجود ہو تو خصوصیات ${error.params.dependencies.join(', ')} ہونی چاہیے`
    case 'enum': return 'اجازت یافتہ اقدار میں سے کسی ایک کے برابر ہونا چاہیے'
    case 'exclusiveMaximum': return `ضروری ہے کہ ${error.params.comparison} ${error.params.limit} ہو`
    case 'exclusiveMinimum': return `ضروری ہے کہ ${error.params.comparison} ${error.params.limit} ہو`
    case 'format': return `فارمیٹ "${error.params.format}" سے مماثل ہونا چاہیے`
    case 'if': return `"${error.params.failingKeyword}" اسکیما سے مماثل ہونا چاہیے`
    case 'maxItems': return `${error.params.limit} سے زیادہ آئٹمز نہیں ہونے چاہئیں`
    case 'maxLength': return `${error.params.limit} سے زیادہ حروف نہیں ہونے چاہئیں`
    case 'maxProperties': return `${error.params.limit} سے زیادہ خصوصیات نہیں ہونی چاہئیں`
    case 'maximum': return `ضروری ہے کہ ${error.params.comparison} ${error.params.limit} ہو`
    case 'minItems': return `${error.params.limit} سے کم آئٹمز نہیں ہونے چاہئیں`
    case 'minLength': return `${error.params.limit} سے کم حروف نہیں ہونے چاہئیں`
    case 'minProperties': return `${error.params.limit} سے کم خصوصیات نہیں ہونی چاہئیں`
    case 'minimum': return `ضروری ہے کہ ${error.params.comparison} ${error.params.limit} ہو`
    case 'multipleOf': return `${error.params.multipleOf} کا گنا ہونا چاہیے`
    case 'not': return 'درست نہیں ہونا چاہیے'
    case 'oneOf': return 'oneOf میں بالکل ایک اسکیم سے مماثل ہونا چاہیے'
    case 'pattern': return `پیٹرن "${error.params.pattern}" سے مماثل ہونا چاہیے`
    case 'propertyNames': return `خصوصیات کے نام ${error.params.propertyNames.join(', ')} غلط ہیں`
    case 'required': return `مطلوبہ خصوصیات ${error.params.requiredProperties.join(', ')} ہونی چاہئیں`
    case 'type': return typeof error.params.type === 'string' ? `ضروری ہے کہ ${error.params.type} ہو` : `ضروری ہے کہ ${error.params.type.join(' یا ')} ہو`
    case 'unevaluatedItems': return 'غیر تشخیص شدہ آئٹمز نہیں ہونے چاہئیں'
    case 'unevaluatedProperties': return 'غیر تشخیص شدہ خصوصیات نہیں ہونی چاہئیں'
    case 'uniqueItems': return `ڈپلیکیٹ آئٹمز نہیں ہونے چاہئیں`
    default: return 'تصدیق میں ایک نامعلوم خرابی پیش آئی'
  }
}
// deno-coverage-ignore-stop