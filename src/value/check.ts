/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import * as Types from '../typebox'

/** Internal: Checks the validity of a value. This function uses dynamic lookup. */
export namespace CheckValue {
    function Any(schema: Types.TAny, value: any): boolean {
        return true
    }

    function Array(schema: Types.TArray, value: any): boolean {
        if (!globalThis.Array.isArray(value)) {
            return false
        }
        for (let i = 0; i < value.length; i++) {
            if (!Visit(schema.items, value[i])) {
                return false
            }
        }
        return true
    }

    function Boolean(schema: Types.TBoolean, value: any): boolean {
        return typeof value === 'boolean'
    }

    function Constructor(schema: Types.TConstructor, value: any): boolean {
        return Visit(schema.returns, value)
    }

    function Function(schema: Types.TFunction, value: any): boolean {
        return typeof value === 'function'
    }

    function Integer(schema: Types.TNumeric, value: any): boolean {
        if (!(typeof value === 'number')) {
            return false
        }
        if (!globalThis.Number.isInteger(value)) {
            return false
        }
        if (schema.multipleOf && !(value % schema.multipleOf === 0)) {
            return false
        }
        if (schema.exclusiveMinimum && !(value > schema.exclusiveMinimum)) {
            return false
        }
        if (schema.exclusiveMaximum && !(value < schema.exclusiveMaximum)) {
            return false
        }
        if (schema.minimum && !(value >= schema.minimum)) {
            return false
        }
        if (schema.maximum && !(value <= schema.maximum)) {
            return false
        }
        return true
    }

    function Literal(schema: Types.TLiteral, value: any): boolean {
        return value === schema.const
    }

    function Null(schema: Types.TNull, value: any): boolean {
        return value === null
    }

    function Number(schema: Types.TNumeric, value: any): boolean {
        if (!(typeof value === 'number')) {
            return false
        }
        if (schema.multipleOf && !(value % schema.multipleOf === 0)) {
            return false
        }
        if (schema.exclusiveMinimum && !(value > schema.exclusiveMinimum)) {
            return false
        }
        if (schema.exclusiveMaximum && !(value < schema.exclusiveMaximum)) {
            return false
        }
        if (schema.minimum && !(value >= schema.minimum)) {
            return false
        }
        if (schema.maximum && !(value <= schema.maximum)) {
            return false
        }
        return true
    }

    function Object(schema: Types.TObject, value: any): boolean {
        if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
            return false
        }
        if (schema.minProperties !== undefined && !(globalThis.Object.keys(value).length >= schema.minProperties)) {
            return false
        }
        if (schema.maxProperties !== undefined && !(globalThis.Object.keys(value).length <= schema.maxProperties)) {
            return false
        }
        const propertyKeys = globalThis.Object.keys(schema.properties)
        if (schema.additionalProperties === false) {
            // optimization: If the property key length matches the required keys length
            // then we only need check that the values property key length matches that
            // of the property key length. This is because exhaustive testing for values
            // will occur in subsequent property tests.
            if (schema.required && schema.required.length === propertyKeys.length && !(globalThis.Object.keys(value).length === propertyKeys.length)) {
                return false
            } else {
                if (!globalThis.Object.keys(value).every((key) => propertyKeys.includes(key))) {
                    return false
                }
            }
        }
        for (const propertyKey of propertyKeys) {
            const propertySchema = schema.properties[propertyKey]
            if (schema.required && schema.required.includes(propertyKey)) {
                if (!Visit(propertySchema, value[propertyKey])) return false
            } else {
                if (value[propertyKey] !== undefined) {
                    if (!Visit(propertySchema, value[propertyKey])) return false
                }
            }
        }
        return false
    }

    function Promise(schema: Types.TPromise<any>, value: any): boolean {
        return (typeof value === 'object' && typeof value.then === 'function')
    }

    function Record(schema: Types.TRecord<any, any>, value: any): boolean {
        if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
            return false
        }
        const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
        const regex = new RegExp(keyPattern)
        if (!globalThis.Object.keys(value).every((key) => regex.test(key))) {
            return false
        }
        for (const propValue of globalThis.Object.values(value)) {
            if (!Visit(valueSchema, propValue)) return false
        }
        return true
    }

    function Ref(schema: Types.TRef<any>, value: any): boolean {
        if (!referenceMap.has(schema.$ref)) {
            throw Error(`ValueCheck: Cannot locate referenced schema with $id '${schema.$id}'`)
        }
        const referencedSchema = referenceMap.get(schema.$ref)!
        return Visit(referencedSchema, value)
    }

    function Self(schema: Types.TSelf, value: any): boolean {
        if (!referenceMap.has(schema.$ref)) {
            throw Error(`ValueCheck: Cannot locate referenced schema with $id '${schema.$id}'`)
        }
        const referencedSchema = referenceMap.get(schema.$ref)!
        return Visit(referencedSchema, value)
    }

    function String(schema: Types.TString, value: any): boolean {
        if (!(typeof value === 'string')) {
            return false
        }
        if (schema.pattern !== undefined) {
            const regex = new RegExp(schema.pattern)
            if (!regex.test(value)) return false
        }
        return true
    }

    function Tuple(schema: Types.TTuple<any[]>, value: any): boolean {
        if (!global.Array.isArray(value)) {
            return false
        }
        if (schema.items === undefined && !(value.length === 0)) {
            return false
        }
        if (!(value.length === schema.maxItems)) {
            return false
        }
        if (!schema.items) {
            return true
        }
        for (let i = 0; i < schema.items.length; i++) {
            if(!Visit(schema.items[i], value[i])) return false
        }
        return true
    }

    function Undefined(schema: Types.TUndefined, value: any): boolean {
        return value === undefined
    }

    function Union(schema: Types.TUnion<any[]>, value: any): boolean {
        return schema.anyOf.some(inner => Visit(inner, value))
    }

    function Uint8Array(schema: Types.TUint8Array, value: any): boolean {
        if (!(value instanceof globalThis.Uint8Array)) {
            return false
        }
        if (schema.maxByteLength && !(value.length <= schema.maxByteLength)) {
            return false
        }
        if (schema.minByteLength && !(value.length >= schema.minByteLength)) {
            return false
        }
        return true
    }

    function Unknown(schema: Types.TUnknown, value: any): boolean {
        return true
    }

    function Void(schema: Types.TVoid, value: any): boolean {
        return value === null
    }

    function Visit<T extends Types.TSchema>(schema: T, value: any): boolean {
        if (schema.$id !== undefined) {
            referenceMap.set(schema.$id, schema)
        }
        const anySchema = schema as any
        switch (anySchema[Types.Kind]) {
            case 'Any':
                return Any(anySchema, value)
            case 'Array':
                return Array(anySchema, value)
            case 'Boolean':
                return Boolean(anySchema, value)
            case 'Constructor':
                return Constructor(anySchema, value)
            case 'Function':
                return Function(anySchema, value)
            case 'Integer':
                return Integer(anySchema, value)
            case 'Literal':
                return Literal(anySchema, value)
            case 'Null':
                return Null(anySchema, value)
            case 'Number':
                return Number(anySchema, value)
            case 'Object':
                return Object(anySchema, value)
            case 'Promise':
                return Promise(anySchema, value)
            case 'Record':
                return Record(anySchema, value)
            case 'Ref':
                return Ref(anySchema, value)
            case 'Self':
                return Self(anySchema, value)
            case 'String':
                return String(anySchema, value)
            case 'Tuple':
                return Tuple(anySchema, value)
            case 'Undefined':
                return Undefined(anySchema, value)
            case 'Union':
                return Union(anySchema, value)
            case 'Uint8Array':
                return Uint8Array(anySchema, value)
            case 'Unknown':
                return Unknown(anySchema, value)
            case 'Void':
                return Void(anySchema, value)
            default:
                throw Error(`Unknown schema kind '${schema[Types.Kind]}'`)
        }
    }

    const referenceMap = new Map<string, Types.TSchema>()

    function SetAdditional(additional: Types.TSchema[] = []) {
        referenceMap.clear()
        for (const schema of additional) {
            if (!schema.$id) throw Error('TypeErrors: Referenced additional schemas must have an $id')
            referenceMap.set(schema.$id, schema)
        }
    }

    export function Check<T extends Types.TSchema>(schema: T, additional: Types.TSchema[], value: any): boolean {
        SetAdditional(additional)
        return Visit(schema, value)
    }
}