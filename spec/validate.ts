import * as Ajv from "ajv"
import { Static, TBase, Type } from "../src/typebox"

export const ok = (type: TBase<any>, data: any) => {
  // tslint:disable-next-line
  const draft_6   = require("ajv/lib/refs/json-schema-draft-06.json")
  const ajv       = new Ajv({})
  ajv.addMetaSchema(draft_6)
  const result = ajv.validate(type, data) as boolean
  if (result === false) {
    console.log("---------------------------")
    console.log("type")
    console.log("---------------------------")
    console.log(JSON.stringify(type, null, 2))
    console.log("---------------------------")
    console.log("data")
    console.log("---------------------------")
    console.log(JSON.stringify(data, null, 2))
    console.log("---------------------------")
    console.log("errors")
    console.log("---------------------------")
    console.log(ajv.errorsText(ajv.errors))
    throw Error("expected ok")
  }
}

export const fail = (type: TBase<any>, data: any) => {
  // tslint:disable-next-line
  const draft_6   = require("ajv/lib/refs/json-schema-draft-06.json")
  const ajv       = new Ajv({})
  ajv.addMetaSchema(draft_6)
  const result = ajv.validate(type, data) as boolean
  if (result === true) {
    console.log("---------------------------")
    console.log("type")
    console.log("---------------------------")
    console.log(JSON.stringify(type, null, 2))
    console.log("---------------------------")
    console.log("data")
    console.log("---------------------------")
    console.log(JSON.stringify(data, null, 2))
    console.log("---------------------------")
    throw Error("expected fail")
  }
}
