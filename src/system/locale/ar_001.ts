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

/** Arabic (World) - ISO 639-1 language code 'ar' with UN M.49 region code '001' for World. */
export function ar_001(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'يجب ألا يحتوي على خصائص إضافية'
    case 'anyOf': return 'يجب أن يتطابق مع مخطط في أيٍ مما يلي'
    case 'boolean': return 'المخطط خاطئ'
    case 'const': return 'يجب أن يكون مساويًا للثابت'
    case 'contains': return 'يجب أن يحتوي على عنصر واحد صحيح على الأقل'
    case 'dependencies': return `يجب أن يحتوي على الخصائص ${error.params.dependencies.join(', ')} عندما تكون الخاصية ${error.params.property} موجودة`
    case 'dependentRequired': return `يجب أن يحتوي على الخصائص ${error.params.dependencies.join(', ')} عندما تكون الخاصية ${error.params.property} موجودة`
    case 'enum': return 'يجب أن يكون مساويًا لإحدى القيم المسموح بها'
    case 'exclusiveMaximum': return `يجب أن يكون ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `يجب أن يكون ${error.params.comparison} ${error.params.limit}`
    case 'format': return `يجب أن يتطابق مع التنسيق "${error.params.format}"`
    case 'if': return `يجب أن يتطابق مع مخطط "${error.params.failingKeyword}"`
    case 'maxItems': return `يجب ألا يحتوي على أكثر من ${error.params.limit} عناصر`
    case 'maxLength': return `يجب ألا يحتوي على أكثر من ${error.params.limit} أحرف`
    case 'maxProperties': return `يجب ألا يحتوي على أكثر من ${error.params.limit} خصائص`
    case 'maximum': return `يجب أن يكون ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `يجب ألا يحتوي على أقل من ${error.params.limit} عناصر`
    case 'minLength': return `يجب ألا يحتوي على أقل من ${error.params.limit} أحرف`
    case 'minProperties': return `يجب ألا يحتوي على أقل من ${error.params.limit} خصائص`
    case 'minimum': return `يجب أن يكون ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `يجب أن يكون مضاعفًا لـ ${error.params.multipleOf}`
    case 'not': return 'يجب ألا يكون صالحًا'
    case 'oneOf': return 'يجب أن يتطابق مع مخطط واحد بالضبط في واحد مما يلي'
    case 'pattern': return `يجب أن يتطابق مع النمط "${error.params.pattern}"`
    case 'propertyNames': return `أسماء الخصائص ${error.params.propertyNames.join(', ')} غير صالحة`
    case 'required': return `يجب أن يحتوي على الخصائص المطلوبة ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `يجب أن يكون ${error.params.type}` : `يجب أن يكون إما ${error.params.type.join(' أو ')}`
    case 'unevaluatedItems': return 'يجب ألا يحتوي على عناصر غير مقيمة'
    case 'unevaluatedProperties': return 'يجب ألا يحتوي على خصائص غير مقيمة'
    case 'uniqueItems': return `يجب ألا يحتوي على عناصر مكررة`
    case '~refine': return error.params.message
    case '~standard': return `يجب أن يتطابق مع مخطط ${error.params.vendor}`
    default: return 'حدث خطأ غير معروف في التحقق من الصحة'
  }
}
// deno-coverage-ignore-stop