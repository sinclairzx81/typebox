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

/** Japanese (Japan) - ISO 639-1 language code 'ja' with ISO 3166-1 alpha-2 country code 'JP' for Japan. */
export function ja_JP(error: TValidationError): string {
  switch (error.keyword) {
    case 'additionalProperties': return '追加のプロパティを持つことはできません'
    case 'anyOf': return 'anyOf のスキーマと一致する必要があります'
    case 'boolean': return 'スキーマが false です'
    case 'const': return '定数と等しい必要があります'
    case 'contains': return '少なくとも1つの有効なアイテムを含む必要があります'
    case 'dependencies': return `プロパティ ${error.params.property} が存在する場合、プロパティ ${error.params.dependencies.join(', ')} を持つ必要があります`
    case 'dependentRequired': return `プロパティ ${error.params.property} が存在する場合、プロパティ ${error.params.dependencies.join(', ')} を持つ必要があります`
    case 'enum': return '許可された値のいずれかと等しい必要があります'
    case 'exclusiveMaximum': return `${error.params.comparison} ${error.params.limit} である必要があります`
    case 'exclusiveMinimum': return `${error.params.comparison} ${error.params.limit} である必要があります`
    case 'format': return `フォーマット "${error.params.format}" と一致する必要があります`
    case 'if': return `"${error.params.failingKeyword}" スキーマと一致する必要があります`
    case 'maxItems': return `${error.params.limit} 個を超えるアイテムを持つことはできません`
    case 'maxLength': return `${error.params.limit} 文字を超えることはできません`
    case 'maxProperties': return `${error.params.limit} 個を超えるプロパティを持つことはできません`
    case 'maximum': return `${error.params.comparison} ${error.params.limit} である必要があります`
    case 'minItems': return `${error.params.limit} 個未満のアイテムを持つことはできません`
    case 'minLength': return `${error.params.limit} 文字未満であることはできません`
    case 'minProperties': return `${error.params.limit} 個未満のプロパティを持つことはできません`
    case 'minimum': return `${error.params.comparison} ${error.params.limit} である必要があります`
    case 'multipleOf': return `${error.params.multipleOf} の倍数である必要があります`
    case 'not': return '有効であってはなりません'
    case 'oneOf': return 'oneOf のいずれか1つのスキーマと正確に一致する必要があります'
    case 'pattern': return `パターン "${error.params.pattern}" と一致する必要があります`
    case 'propertyNames': return `プロパティ名 ${error.params.propertyNames.join(', ')} は無効です`
    case 'required': return `必須プロパティ ${error.params.requiredProperties.join(', ')} を持つ必要があります`
    case 'type': return typeof error.params.type === 'string' ? `${error.params.type} である必要があります` : `${error.params.type.join(' または ')} のいずれかである必要があります`
    case 'unevaluatedItems': return '未評価のアイテムを持つことはできません'
    case 'unevaluatedProperties': return '未評価のプロパティを持つことはできません'
    case 'uniqueItems': return `重複するアイテムを持つことはできません`
    case '~refine': return error.params.message
    case '~base': return `${'validator'} スキーマと一致する必要があります`
    default: return '不明なバリデーションエラーが発生しました'
  }
}
// deno-coverage-ignore-stop