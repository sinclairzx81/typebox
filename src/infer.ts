
import {reflect} from "./reflect"
import {compare} from "./compare"
import * as spec from "./spec"

/**
 * infers a schema from the given example.
 * @param {any} example the example to derive the schema from.
 * @returns {TAny}
 */
export function infer(value: any): spec.TBase<any> {
  let kind = reflect(value)
  switch(kind) {
    case "undefined": return spec.Undefined(); 
    case "null":      return spec.Null();
    case "string":    return spec.String()
    case "number":    return spec.Number()
    case "boolean":   return spec.Boolean()
    case "array":
      let array = <any[]>value
      if(array.length === 0) {
        return spec.Array(spec.Any())
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
        return spec.Array(
          (types.length > 1)
          ? spec.Union.apply(this, types)
          : types[0])
      }
    case "object":
      return spec.Object(Object.keys(value)
      .map    (key => ({ 
        key : key, 
        type: infer(value[key]) 
      })).reduce((acc, value) => {
        acc[value.key] = value.type; 
        return acc; 
      }, {}))
    default:
      throw new Error(`unsupported type '${kind}'`)
  }
}