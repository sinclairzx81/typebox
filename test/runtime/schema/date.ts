// ---------------------------------------------------
// No Longer Supported
// ---------------------------------------------------

// import { Type } from '@sinclair/typebox'
// import { Ok, Fail } from './validate'

// ----------------------------------------------------
// These tests are implemented by way of .addKeyword()
// which are configured to use Value.Check()
// ----------------------------------------------------

// describe('compiler-ajv/Date', () => {
//   it('Should not validate number', () => {
//     const T = Type.Date()
//     Fail(T, 1)
//   })
//   it('Should not validate string', () => {
//     const T = Type.Date()
//     Fail(T, 'hello')
//   })
//   it('Should not validate boolean', () => {
//     const T = Type.Date()
//     Fail(T, true)
//   })
//   it('Should not validate array', () => {
//     const T = Type.Date()
//     Fail(T, [1, 2, 3])
//   })
//   it('Should not validate object', () => {
//     const T = Type.Date()
//     Fail(T, { a: 1, b: 2 })
//   })
//   it('Should not validate null', () => {
//     const T = Type.Date()
//     Fail(T, null)
//   })
//   it('Should not validate undefined', () => {
//     const T = Type.Date()
//     Fail(T, undefined)
//   })
//   it('Should validate Date', () => {
//     const T = Type.Date()
//     Ok(T, new Date())
//   })
//   it('Should not validate Date if is invalid', () => {
//     const T = Type.Date()
//     Fail(T, new Date('not-a-valid-date'))
//   })
//   it('Should validate Date minimumTimestamp', () => {
//     const T = Type.Date({ minimumTimestamp: 10 })
//     Fail(T, new Date(9))
//     Ok(T, new Date(10))
//   })
//   it('Should validate Date maximumTimestamp', () => {
//     const T = Type.Date({ maximumTimestamp: 10 })
//     Ok(T, new Date(10))
//     Fail(T, new Date(11))
//   })
//   it('Should validate Date exclusiveMinimumTimestamp', () => {
//     const T = Type.Date({ exclusiveMinimumTimestamp: 10 })
//     Fail(T, new Date(10))
//     Ok(T, new Date(11))
//   })
//   it('Should validate Date exclusiveMaximumTimestamp', () => {
//     const T = Type.Date({ exclusiveMaximumTimestamp: 10 })
//     Ok(T, new Date(9))
//     Fail(T, new Date(10))
//   })
// })
