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

/** Thai (Thailand) - ISO 639-1 language code 'th' with ISO 3166-1 alpha-2 country code 'TH' for Thailand. */
export function th_TH(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return 'ต้องไม่มีคุณสมบัติเพิ่มเติม'
    case 'anyOf': return 'ต้องตรงกับ Schema ใน anyOf'
    case 'boolean': return 'Schema เป็นเท็จ'
    case 'const': return 'ต้องเท่ากับค่าคงที่'
    case 'contains': return 'ต้องมีอย่างน้อย 1 รายการที่ถูกต้อง'
    case 'dependencies': return `ต้องมีคุณสมบัติ ${error.params.dependencies.join(', ')} เมื่อมีคุณสมบัติ ${error.params.property} อยู่`
    case 'dependentRequired': return `ต้องมีคุณสมบัติ ${error.params.dependencies.join(', ')} เมื่อมีคุณสมบัติ ${error.params.property} อยู่`
    case 'enum': return 'ต้องเท่ากับหนึ่งในค่าที่อนุญาต'
    case 'exclusiveMaximum': return `ต้องเป็น ${error.params.comparison} ${error.params.limit}`
    case 'exclusiveMinimum': return `ต้องเป็น ${error.params.comparison} ${error.params.limit}`
    case 'format': return `ต้องตรงกับรูปแบบ "${error.params.format}"`
    case 'if': return `ต้องตรงกับ Schema "${error.params.failingKeyword}"`
    case 'maxItems': return `ต้องไม่มีมากกว่า ${error.params.limit} รายการ`
    case 'maxLength': return `ต้องไม่มีมากกว่า ${error.params.limit} ตัวอักษร`
    case 'maxProperties': return `ต้องไม่มีมากกว่า ${error.params.limit} คุณสมบัติ`
    case 'maximum': return `ต้องเป็น ${error.params.comparison} ${error.params.limit}`
    case 'minItems': return `ต้องไม่มีน้อยกว่า ${error.params.limit} รายการ`
    case 'minLength': return `ต้องไม่มีน้อยกว่า ${error.params.limit} ตัวอักษร`
    case 'minProperties': return `ต้องไม่มีน้อยกว่า ${error.params.limit} คุณสมบัติ`
    case 'minimum': return `ต้องเป็น ${error.params.comparison} ${error.params.limit}`
    case 'multipleOf': return `ต้องเป็นพหุคูณของ ${error.params.multipleOf}`
    case 'not': return 'ต้องไม่ถูกต้อง'
    case 'oneOf': return 'ต้องตรงกับ Schema เพียงหนึ่งเดียวใน oneOf'
    case 'pattern': return `ต้องตรงกับรูปแบบ "${error.params.pattern}"`
    case 'propertyNames': return `ชื่อคุณสมบัติ ${error.params.propertyNames.join(', ')} ไม่ถูกต้อง`
    case 'required': return `ต้องมีคุณสมบัติที่จำเป็น ${error.params.requiredProperties.join(', ')}`
    case 'type': return typeof error.params.type === 'string' ? `ต้องเป็น ${error.params.type}` : `ต้องเป็นอย่างใดอย่างหนึ่ง ${error.params.type.join(' หรือ ')}`
    case 'unevaluatedItems': return 'ต้องไม่มีรายการที่ยังไม่ได้ประเมิน'
    case 'unevaluatedProperties': return 'ต้องไม่มีคุณสมบัติที่ยังไม่ได้ประเมิน'
    case 'uniqueItems': return `ต้องไม่มีรายการที่ซ้ำกัน`
    case '~refine': return error.params.message
    case '~standard': return `ต้องตรงกับ Schema ของ ${error.params.vendor}`
    default: return 'เกิดข้อผิดพลาดในการตรวจสอบที่ไม่รู้จัก'
  }
}
// deno-coverage-ignore-stop