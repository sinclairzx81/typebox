import { TypeGuard } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

import { TSchema } from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv, { AnySchema } from 'ajv/dist/2019'

function schemaOf(schemaOf: string, value: unknown, schema: unknown) {
  switch (schemaOf) {
    case 'Constructor':
      return TypeGuard.TConstructor(schema) && Value.Check(schema, value)
    case 'Function':
      return TypeGuard.TFunction(schema) && Value.Check(schema, value)
    case 'Date':
      return TypeGuard.TDate(schema) && Value.Check(schema, value)
    case 'Promise':
      return TypeGuard.TPromise(schema) && Value.Check(schema, value)
    case 'Uint8Array':
      return TypeGuard.TUint8Array(schema) && Value.Check(schema, value)
    case 'Undefined':
      return TypeGuard.TUndefined(schema) && Value.Check(schema, value)
    case 'Void':
      return TypeGuard.TVoid(schema) && Value.Check(schema, value)
    default:
      return false
  }
}

export function createAjv(references: AnySchema[]) {
  return addFormats(new Ajv({}), ['date-time', 'time', 'date', 'email', 'hostname', 'ipv4', 'ipv6', 'uri', 'uri-reference', 'uuid', 'uri-template', 'json-pointer', 'relative-json-pointer', 'regex'])
    .addKeyword({ type: 'object', keyword: 'instanceOf', validate: schemaOf })
    .addKeyword({ type: 'null', keyword: 'typeOf', validate: schemaOf })
    .addKeyword('exclusiveMinimumTimestamp')
    .addKeyword('exclusiveMaximumTimestamp')
    .addKeyword('minimumTimestamp')
    .addKeyword('maximumTimestamp')
    .addKeyword('minByteLength')
    .addKeyword('maxByteLength')
    .addSchema(references)
}

export function Ok<T extends TSchema>(type: T, data: unknown, additional: AnySchema[] = []) {
  const ajv = createAjv(additional)
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

export function Fail<T extends TSchema>(type: T, data: unknown, additional: AnySchema[] = []) {
  const ajv = createAjv(additional)
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
