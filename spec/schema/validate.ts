import Ajv        from 'ajv'
import addFormats from 'ajv-formats'

function setupAjv(): Ajv {
  const ajv = new Ajv()
  ajv.addKeyword('kind')
  ajv.addKeyword('modifier')
  return addFormats(ajv, [
    'date-time', 
    'time', 
    'date', 
    'email',  
    'hostname', 
    'ipv4', 
    'ipv6', 
    'uri', 
    'uri-reference', 
    'uuid',
    'uri-template', 
    'json-pointer', 
    'relative-json-pointer', 
    'regex'
  ])
}

export function ok(type: any, data: any) {
  const ajv = setupAjv()
  const result = ajv.validate(type, data) as boolean
  if (result === false) {
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

export function fail(type: any, data: any) {
  const ajv = setupAjv()
  const result = ajv.validate(type, data) as boolean
  if (result === true) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(type, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    throw Error('expected fail')
  }
}
