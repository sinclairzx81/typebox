// ---------------------------------------------------
// No Longer Supported
// ---------------------------------------------------
// import { Type } from '@sinclair/typebox'
// import { Ok, Fail } from './validate'
// describe('compiler-ajv/Uint8Array', () => {
//   it('Should not validate number', () => {
//     const T = Type.Uint8Array()
//     Fail(T, 1)
//   })
//   it('Should not validate string', () => {
//     const T = Type.Uint8Array()
//     Fail(T, 'hello')
//   })
//   it('Should not validate boolean', () => {
//     const T = Type.Uint8Array()
//     Fail(T, true)
//   })
//   it('Should not validate array', () => {
//     const T = Type.Uint8Array()
//     Fail(T, [1, 2, 3])
//   })
//   it('Should not validate object', () => {
//     const T = Type.Uint8Array()
//     Fail(T, { a: 1, b: 2 })
//   })
//   it('Should not validate null', () => {
//     const T = Type.Uint8Array()
//     Fail(T, null)
//   })
//   it('Should not validate undefined', () => {
//     const T = Type.Uint8Array()
//     Fail(T, undefined)
//   })
//   it('Should validate Uint8Array', () => {
//     const T = Type.Uint8Array()
//     Ok(T, new Uint8Array(100))
//   })
//   it('Should validate minByteLength', () => {
//     const T = Type.Uint8Array({ minByteLength: 4 })
//     Ok(T, new Uint8Array(4))
//     Fail(T, new Uint8Array(3))
//   })
//   it('Should validate maxByteLength', () => {
//     const T = Type.Uint8Array({ maxByteLength: 4 })
//     Ok(T, new Uint8Array(4))
//     Fail(T, new Uint8Array(5))
//   })
// })
