import { TSchema } from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv from 'ajv/dist/2019'


export function validator() {
    return addFormats(new Ajv({
        allowUnionTypes: true
    }), [
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
        .addKeyword('kind')
        .addKeyword('modifier')
}


export function ok<T extends TSchema>(type: T, data: unknown) {
    const ajv = validator()
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

export function fail<T extends TSchema>(type: T, data: unknown) {
    const ajv = validator()
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