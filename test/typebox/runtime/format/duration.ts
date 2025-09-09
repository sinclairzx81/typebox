import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsDuration')

// IsDuration Tests ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) Duration)
Test('Should IsDuration 1', () => {
  Assert.IsTrue(Format.IsDuration('P1Y2M3DT4H5M6S')) // Full duration
})

Test('Should IsDuration 2', () => {
  Assert.IsTrue(Format.IsDuration('P1Y')) // Only years
})

Test('Should IsDuration 3', () => {
  Assert.IsTrue(Format.IsDuration('P2M')) // Only months
})

Test('Should IsDuration 4', () => {
  Assert.IsTrue(Format.IsDuration('P3W')) // Only weeks
})

Test('Should IsDuration 5', () => {
  Assert.IsTrue(Format.IsDuration('P4D')) // Only days
})

Test('Should IsDuration 6', () => {
  Assert.IsTrue(Format.IsDuration('PT5H')) // Only hours
})

Test('Should IsDuration 7', () => {
  Assert.IsTrue(Format.IsDuration('PT6M')) // Only minutes (time)
})

Test('Should IsDuration 8', () => {
  Assert.IsTrue(Format.IsDuration('PT7S')) // Only seconds
})

Test('Should IsDuration 9', () => {
  Assert.IsTrue(Format.IsDuration('P1Y2M')) // Years and months
})

Test('Should IsDuration 10', () => {
  Assert.IsTrue(Format.IsDuration('PT1H2M3S')) // Hours, minutes, seconds
})

Test('Should IsDuration 11', () => {
  Assert.IsTrue(Format.IsDuration('P0D')) // Zero duration (days)
})

Test('Should IsDuration 12', () => {
  Assert.IsTrue(Format.IsDuration('PT0S')) // Zero duration (seconds)
})

Test('Should IsDuration 13', () => {
  Assert.IsFalse(Format.IsDuration('')) // Empty string
})

Test('Should IsDuration 14', () => {
  Assert.IsFalse(Format.IsDuration('1Y2M3D')) // Missing 'P' prefix
})

Test('Should IsDuration 15', () => {
  // techincally: this should be false - matching `ajv-formats`
  Assert.IsTrue(Format.IsDuration('P1YT2H')) // 'T' in the wrong place (before date components are exhausted)
})

Test('Should IsDuration 16', () => {
  Assert.IsFalse(Format.IsDuration('P1X')) // Invalid designator
})
