import { Arguments } from 'typebox/system'
import { Compile } from 'typebox/compile'
import { Value } from 'typebox/value'
import { type TProperties, type TSchema } from 'typebox'

// -------------------------------------------------------------------------
// OK
// -------------------------------------------------------------------------
export function Ok(type: TSchema, value: unknown): void
export function Ok(context: TProperties, type: TSchema, value: unknown): void
export function Ok(...args: unknown[]): void {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value]
  })
  const result_1 = Compile(context, type).Check(value)
  const result_2 = Value.Check(context, type, value)
  const errors = Value.Errors(context, type, value)
  const result_3 = errors.length === 0
  if ((result_1 !== result_2)) throw Error('Compile | Value Check mismatch')
  if ((result_1 !== result_3)) throw Error('Compile | Error Check mismatch')
  if ((result_2 !== result_3)) throw Error('Value | Error Check mismatch')
  if (result_3 === false && errors.length === 0) throw Error('expected at least 1 error')
  if (result_1 === false) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(type, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(value, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log({
      compile: result_1,
      check: result_2,
      errors: result_3
    })
    throw Error('expected ok')
  }
}
// -------------------------------------------------------------------------
// FAIL
// -------------------------------------------------------------------------
export function Fail(type: TSchema, value: unknown): void
export function Fail(context: TProperties, type: TSchema, value: unknown): void
export function Fail(...args: unknown[]): void {
  const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
    3: (context, type, value) => [context, type, value],
    2: (type, value) => [{}, type, value]
  })
  const result_1 = Compile(context, type).Check(value)
  const result_2 = Value.Check(context, type, value)
  const errors = Value.Errors(context, type, value)
  const result_3 = errors.length === 0
  if ((result_1 !== result_2)) throw Error('Compile | Value Check mismatch')
  if ((result_1 !== result_3)) throw Error('Compile | Error Check mismatch')
  if ((result_2 !== result_3)) throw Error('Value | Error Check mismatch')
  if (result_3 === false && errors.length === 0) throw Error('expected at least 1 error')
  if (result_1 === true) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(type, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(value, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log('none')
    throw Error('expected ok')
  }
}
