import { TSchema } from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv, { AnySchema } from 'ajv/dist/2019'

export function validator(additional: AnySchema[]) {
  return addFormats(new Ajv({}), ['date-time', 'time', 'date', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'uri-reference', 'uuid', 'uri-template', 'json-pointer', 'relative-json-pointer', 'regex'])
    .addKeyword('kind')
    .addKeyword('modifier')
    .addSchema(additional)
}

export function ok<T extends TSchema>(type: T, data: unknown, additional: AnySchema[] = []) {
  const ajv = validator(additional)
  function execute() {
    // required as ajv will throw if referenced schema is not found
    try {
      return ajv.validate(type, data) as boolean
    } catch {
      return false
    }
  }
  if (execute() === false) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(type, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log(ajv.errorsText(ajv.errors))
    throw Error('expected ok')
  }
}

export function fail<T extends TSchema>(type: T, data: unknown, additional: AnySchema[] = []) {
  const ajv = validator(additional)
  function execute() {
    // required as ajv will throw if referenced schema is not found
    try {
      return ajv.validate(type, data) as boolean
    } catch {
      return false
    }
  }
  if (execute() === true) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(type, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log(ajv.errorsText(ajv.errors))
    throw Error('expected ok')
  }
}
