import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsTime')

Test('Should Time 1', () => {
  Assert.IsFalse(Format.IsTime('x'))
})

Test('Should Time 2', () => {
  Assert.IsTrue(Format.IsTime('00:00:00', false))
})

Test('Should Time 3', () => {
  Assert.IsTrue(Format.IsTime('23:59:59', false))
})

Test('Should Time 4', () => {
  Assert.IsTrue(Format.IsTime('12:34:56', false))
})

Test('Should Time 5', () => {
  Assert.IsTrue(Format.IsTime('23:59:59.999', false))
})

Test('Should Time 6', () => {
  Assert.IsTrue(Format.IsTime('00:00:00Z'))
})

Test('Should Time 7', () => {
  Assert.IsTrue(Format.IsTime('12:34:56+01:00'))
})

Test('Should Time 8', () => {
  Assert.IsTrue(Format.IsTime('12:34:56-05:30'))
})

Test('Should Time 9', () => {
  Assert.IsTrue(Format.IsTime('23:59:59.123Z'))
})

Test('Should Time 10', () => {
  Assert.IsFalse(Format.IsTime('24:00:00')) // hour out of range
})

Test('Should Time 11', () => {
  Assert.IsFalse(Format.IsTime('12:60:00')) // minute out of range
})

Test('Should Time 12', () => {
  Assert.IsFalse(Format.IsTime('12:34:60')) // second out of range
})

Test('Should Time 13', () => {
  Assert.IsFalse(Format.IsTime('12:34')) // missing seconds
})

Test('Should Time 14', () => {
  Assert.IsFalse(Format.IsTime('12:34:56+24:00')) // tz hour out of range
})

Test('Should Time 15', () => {
  Assert.IsFalse(Format.IsTime('12:34:56+01:60')) // tz minute out of range
})

Test('Should Time 16', () => {
  Assert.IsFalse(Format.IsTime('12:34:56.1234')) // too many ms digits
})
