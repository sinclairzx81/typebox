import { Compile } from 'typebox/compile'
import Format from 'typebox/format'
import Value from 'typebox/value'
import Type from 'typebox'
import Schema from 'typebox/schema'

// with no unevaluated properties | expect: true, actual: false
const A = Schema.Errors({
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/unevaluated-properties-with-dynamic-ref/derived",
  "$ref": "./baseSchema",
  "$defs": {
    "derived": {
      "$dynamicAnchor": "addons",
      "properties": {
        "bar": {
          "type": "string"
        }
      }
    },
    "baseSchema": {
      "$id": "./baseSchema",
      "$comment": "unevaluatedProperties comes first so it's more likely to catch bugs with implementations that are sensitive to keyword ordering",
      "unevaluatedProperties": false,
      "type": "object",
      "properties": {
        "foo": {
          "type": "string"
        }
      },
      "$dynamicRef": "#addons",
      "$defs": {
        "defaultAddons": {
          "$comment": "Needed to satisfy the bookending requirement",
          "$dynamicAnchor": "addons"
        }
      }
    }
  }
}, {
  "foo": "foo",
  "bar": "bar",
})

console.log(A)