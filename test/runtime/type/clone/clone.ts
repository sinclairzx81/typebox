// --------------------------------------------------------------------
// $id deletion was omitted from 0.26.0 to reduce complexity overhead.
// --------------------------------------------------------------------

// import { Type } from '@sinclair/typebox'
// import { Assert } from '../../assert'

// describe('type/Clone', () => {
//   it('Should retain source type $id for cloned objects', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Object({ x: S, y: S })
//     Assert.equal(T.properties.x.$id, undefined)
//     Assert.equal(T.properties.y.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should retain source type $id when composing objects with cloned arrays', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Function([S], S)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Array', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Array(S)
//     Assert.equal(T.items.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Composite', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Composite([Type.Object({ a: S }), Type.Object({ b: S })])
//     Assert.equal(T.properties.a.$id, undefined)
//     Assert.equal(T.properties.b.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Constructor', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Constructor([S], S)
//     Assert.equal(T.parameters[0].$id, undefined)
//     Assert.equal(T.returns.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Function', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Function([S], S)
//     Assert.equal(T.parameters[0].$id, undefined)
//     Assert.equal(T.returns.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Intersect', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Intersect([S, S])
//     Assert.equal(T.allOf[0].$id, undefined)
//     Assert.equal(T.allOf[1].$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Intersect with unevaluatedProperties', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Intersect([S, S], { unevaluatedProperties: S })
//     // @ts-ignore
//     Assert.equal(T.unevaluatedProperties.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Not', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Not(S, S)
//     Assert.equal(T.allOf[0].not.$id, undefined)
//     Assert.equal(T.allOf[1].$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Object', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Object({ x: S, y: S })
//     Assert.equal(T.properties.x.$id, undefined)
//     Assert.equal(T.properties.y.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for nested Object', () => {
//     const S = Type.String({ $id: 'S' })
//     const N = Type.Object({ s: S }, { $id: 'N' })
//     const T = Type.Object({ x: S, y: S, z: N })
//     Assert.equal(T.properties.x.$id, undefined)
//     Assert.equal(T.properties.y.$id, undefined)
//     Assert.equal(T.properties.z.$id, undefined)
//     Assert.equal(T.properties.z.properties.s.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Object additionalProperties', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Object({}, { additionalProperties: S })
//     // @ts-ignore
//     Assert.equal(T.additionalProperties!.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Promise', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Promise(S)
//     Assert.equal(T.item.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Record', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Record(Type.String(), S)
//     Assert.equal(T.patternProperties['^.*$'].$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Tuple', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Tuple([S, S])
//     Assert.equal(T.items![0]!.$id, undefined)
//     Assert.equal(T.items![1]!.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should remove cloned $id for Union', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Union([S, S])
//     Assert.equal(T.anyOf[0]!.$id, undefined)
//     Assert.equal(T.anyOf[1]!.$id, undefined)
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should retain cloned $id for wrapped Recursive 1', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Object({
//       x: Type.Recursive(
//         (Self) =>
//           Type.Object({
//             self: Type.Optional(Self),
//           }),
//         { $id: 'RecursiveClone' },
//       ),
//     })
//     Assert.equal(T.properties.x.$id, 'RecursiveClone')
//     Assert.equal(S.$id, 'S')
//   })
//   it('Should retain cloned $id for wrapped Recursive 2', () => {
//     const S = Type.String({ $id: 'S' })
//     const T = Type.Tuple([
//       Type.Recursive(
//         (Self) =>
//           Type.Object({
//             self: Type.Optional(Self),
//           }),
//         { $id: 'RecursiveClone' },
//       ),
//     ])
//     Assert.equal(T.items![0].$id, 'RecursiveClone')
//     Assert.equal(S.$id, 'S')
//   })
// })
