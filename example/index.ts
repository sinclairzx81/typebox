import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'

const R = Schema.Resolver.FindRef({
  "$id": "http://example.com/ref/absref.json",
  "definitions": {
    "a": {
      "$id": "http://example.com/ref/absref/foobar.json",
      "type": "number"
    },
    "b": {
      "$id": "http://example.com/absref/foobar.json",
      "type": "string"
    }
  },
  "allOf": [
    {
      "$ref": "/absref/foobar.json"
    }
  ]
}, "/absref/foobar.json")

console.log(R)
