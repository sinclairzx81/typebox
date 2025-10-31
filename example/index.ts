import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import Type from 'typebox'
import { Base } from '../src/typebox.ts'

const R = Schema.Resolver.FindRef({
  "$id": "urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed",
  "properties": {
    "foo": {
      "$ref": "urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something"
    }
  },
  "definitions": {
    "bar": {
      "$id": "#something",
      "type": "string"
    }
  }
}, new URL('memory://root'), "urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something")



console.log(R)
