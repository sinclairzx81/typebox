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
import {compare} from "./compare"
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
    Any,
    Array,
    Boolean,
    Date,
    Function,
    Null,
    Number, 
    Object as _Object, 
    Union, 
    String,
    Undefined
} from "./spec"

/**
 * infers a schema from the given example.
 * @param {any} example the example to derive the schema from.
 * @returns {TAny}
 */
export function infer(value: any): TAny {
  let typename = reflect(value)
  switch(typename) {
    case "undefined": return Undefined(); 
    case "null":      return Null();
    case "function":  return Function()
    case "string":    return String()
    case "number":    return Number()
    case "boolean":   return Boolean()
    case "date":      return Date()
    case "array":
      let array = <any[]>value
      if(array.length === 0) {
        return Array(Any())
      } else {
        let types = array.reduce((acc, value, index) => {
          if(index > 64) return acc
          let type  = infer(value)
          let found = false
          for(let i = 0; i < acc.length; i++) {
            if(compare(acc[i], type)) {
              found = true
              break;
            }
          }
          if(!found) {
            acc.push(type)
          }
          return acc
        }, [])
        return Array(
          (types.length > 1)
          ? Union.apply(this, types)
          : types[0])
      }
    case "object":
      return _Object(Object.keys(value)
      .map    (key => ({ 
        key : key, 
        type: infer(value[key]) 
      })).reduce((acc, value) => {
        acc[value.key] = value.type; 
        return acc; 
      }, {}))
  }
}