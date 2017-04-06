/*--------------------------------------------------------------------------

typebox - runtime structural type system for javascript.

The MIT License (MIT)

Copyright (c) 2017 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import {reflect} from "./reflect"

import {
    TAny,
    TArray,
    TBoolean,
    TDate,
    TFunction,
    TNull,
    TNumber, 
    TObject, 
    TUnion, 
    TString,
    TUndefined,
    TTuple,
    TLiteral
} from "./spec"

export interface TypeCheckError {
    message : string
    expect  : string
    actual  : string
}
export interface TypeCheckResult {
    success : boolean
    errors  : TypeCheckError[]
}

/**
 * validates this object as a TNull.
 * @param {TNull} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Null(t: TNull, name: string, value: any): TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "null") {
        return {
            success: false,
            errors: [{
                message: `${name} is not null`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}

/**
 * validates this object as a TUndefined.
 * @param {TUndefined} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Undefined(t: TUndefined, name: string, value: any): TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "undefined") {
        return {
            success: false,
            errors: [{
                message: `${name} is not undefined`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}
/**
 * validates this object as a TObject.
 * @param {TObject} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Object(t: TObject, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if(typename !== "object") {
        return {
            success: false,
            errors: [{
                message: `${name} is not an object`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        let results:TypeCheckResult[] = []
        // scan for unexpected properties.
        let unexpected_queue = Object.keys(value).map(key => ({ key: key, value: value[key] }));
        while(unexpected_queue.length > 0) {
            let property = unexpected_queue.shift()
            if(t.properties[property.key] === undefined) {
                results.push({
                    success: false,
                    errors : [{
                        message: `${t.properties[property.key], name + "." + property.key} unexpected.`,
                        expect : 'undefined',
                        actual : reflect(property.value) 
                    }]
                })
            }
        }
        // scan for expected properties.
        let expected_queue = Object.keys(t.properties).map(key => ({key: key, type:t.properties[key]}))
        while(expected_queue.length > 0) {
            let descriptor = expected_queue.shift()
            if(value[descriptor.key] === undefined && descriptor.type.type !== "undefined") {
                results.push({
                    success: false,
                    errors : [{
                        message: `${t.properties[descriptor.key], name + "." + descriptor.key} not found.`,
                        expect : `${descriptor.type.type}`,
                        actual : 'undefined'
                    }]
                })
            } else {
                results.push(validate_Any(descriptor.type, name + "." + descriptor.key, value[descriptor.key]))
            }
        }
        // gather results.
        return results.reduce((acc, c) => {
            if(c.errors.length > 0) 
                acc.success = false
            for(let i = 0; i < c.errors.length; i++)
                acc.errors.push(c.errors[i])
            return acc
        }, {success: true, errors: []})
    }
}

/**
 * validates this object as a TObject.
 * @param {TArray} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Array(t: TArray, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if(typename !== "array") {
        return {
            success: false,
            errors: [{
                message: `${name} is not an array`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return (<Array<any>>value).map((item, index) => 
            validate_Any(t.items, name + `[${index}]`, item)
        ).reduce((acc, c) => {
            if(c.errors.length > 0) {
                acc.success = false
            }
            for(let i = 0; i < c.errors.length; i++){
                acc.errors.push(c.errors[i])
            }
            return acc
        }, {success: true, errors: []})
    }
}
/**
 * validates this object as a TTuple.
 * @param {TUnion} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Tuple(t: TTuple, name: string, value: any): TypeCheckResult {
    let typename = reflect(value)
    if(typename !== "array") {
        return {
            success: false,
            errors: [{
                message: `${name} is not an tuple`,
                expect : t.type,
                actual : typename
            }]
        }
    } else if((<Array<any>>value).length !== t.items.length) {
        return {
            success: false,
            errors: [{
                message: `${name} tuple length mismatch`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return (<Array<any>>value).map((item, index) => 
            validate_Any(t.items[index], name + `[${index}]`, item)
        ).reduce((acc, c) => {
            if(c.errors.length > 0) {
                acc.success = false
            }
            for(let i = 0; i < c.errors.length; i++){
                acc.errors.push(c.errors[i])
            }
            return acc
        }, {success: true, errors: []})
    }
}
/**
 * validates this object as a TNumber.
 * @param {TNumber} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Number(t: TNumber, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "number") {
        return {
            success: false,
            errors: [{
                message: `${name} is not a number`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}

/**
 * validates this object as a TString.
 * @param {TString} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_String(t: TString, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "string") {
        return {
            success: false,
            errors: [{
                message: `${name} is not a string`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}
/**
 * validates this object as a TBoolean.
 * @param {TBoolean} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Boolean(t: TBoolean, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "boolean") {
        return {
            success: false,
            errors: [{
                message: `${name} is not a boolean`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}

/**
 * validates this object as a TDate.
 * @param {TDate} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Date(t: TDate, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "date") {
        return {
            success: false,
            errors: [{
                message: `${name} is not a date`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}

/**
 * validates this object as a TFunction.
 * @param {TFunction} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Function(t: TFunction, name: string, value: any) : TypeCheckResult {
    let typename = reflect(value)
    if (typename !== "function") {
        return {
            success: false,
            errors: [{
                message: `${name} is not a function`,
                expect : t.type,
                actual : typename
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}

/**
 * validates this object as a TUnion.
 * @param {TUnion} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Union (t: TUnion, name: string, value: any): TypeCheckResult {
    let results = t.items.map(type => validate_Any(type, name, value))
    let failed  = results.reduce((acc, c) => {
        if(c.success === false) {
            acc += 1;
        } return acc
    }, 0)
    if(failed === t.items.length) {
        return {
            success: false,
            errors: [{
                message: `${name} is not ${t.items.map(n => (n.type === "literal") ? (<TLiteral>n).value : n.type).join(" or ")}.`,
                expect : `${t.items.map(n => n.type).join(" | ")}`,
                actual : reflect(value)
            }]
        }
    } else {
        return {success: true, errors: []}
    }
}

/**
 * validates this object as a TUndefined.
 * @param {TUndefined} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Literal(t: TLiteral, name: string, value: any): TypeCheckResult {
    let actual = reflect(value)
    let expect = reflect(t.value)
    if (actual !== expect) {
        return {
            success: false,
            errors: [{
                message: `${name} is not a ${expect}`,
                expect : expect,
                actual : actual
            }]
        }
    } else if (t.value !== value) {
        return {
            success: false,
            errors: [{
                message: `${name} does not equal ${t.value}`,
                expect : expect,
                actual : actual
            }]
        }
    } else {
        return {
            success: true,
            errors: []
        }
    }
}

/**
 * validates this object as a TAny.
 * @param {TAny} t the type.
 * @param {string} name the name of the type.
 * @param {any} obj the object to validate.
 * @returns {TypeCheckResult}
 */
function validate_Any(t: TAny, name: string, value: any): TypeCheckResult {
    switch (t.type) {
        case "any":       return { success:true, errors: []}
        case "null":      return validate_Null      (t as TNull,      name, value)
        case "undefined": return validate_Undefined (t as TUndefined, name, value) 
        case "object":    return validate_Object    (t as TObject,    name, value)
        case "array":     return validate_Array     (t as TArray,     name, value)
        case "tuple":     return validate_Tuple     (t as TTuple,     name, value)
        case "number":    return validate_Number    (t as TNumber,    name, value)
        case "string":    return validate_String    (t as TString,    name, value)
        case "boolean":   return validate_Boolean   (t as TBoolean,   name, value) 
        case "date":      return validate_Date      (t as TDate,      name, value) 
        case "function":  return validate_Function  (t as TFunction,  name, value)
        case "union":     return validate_Union     (t as TUnion,     name, value)
        case "literal":   return validate_Literal   (t as TLiteral,   name, value)
        default: throw Error("unknown type.")
    }
}

/**
 * typechecks the given object against the type.
 * @param {TAny} t the type to check.
 * @param {any} value the value to check.
 * @returns {TypeCheckResult}
 */
export function check(t: TAny, value: any) : TypeCheckResult {
    return validate_Any(t, "value", value)
}