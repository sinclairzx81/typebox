import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsDateTime')

// IsDateTime (ISO8601) Tests
Test('Should IsDateTime 1', () => {
  Assert.IsTrue(Format.IsDateTime('2023-01-15T10:30:00Z')) // Full date-time, UTC (Z)
})

Test('Should IsDateTime 2', () => {
  Assert.IsTrue(Format.IsDateTime('2023-01-15T10:30:00.123Z')) // Full date-time, milliseconds, UTC (Z)
})

Test('Should IsDateTime 3', () => {
  Assert.IsTrue(Format.IsDateTime('2023-01-15T10:30:00+01:00')) // Full date-time, positive offset
})

Test('Should IsDateTime 4', () => {
  Assert.IsTrue(Format.IsDateTime('2023-01-15T10:30:00-05:30')) // Full date-time, negative offset
})

Test('Should IsDateTime 5', () => {
  Assert.IsTrue(Format.IsDateTime('2023-01-15T10:30:00.999+00:00')) // Full date-time, milliseconds, zero offset
})

Test('Should IsDateTime 6', () => {
  Assert.IsTrue(Format.IsDateTime('2023-01-15T00:00:00Z')) // Start of day, UTC
})

Test('Should IsDateTime 7', () => {
  Assert.IsTrue(Format.IsDateTime('1999-12-31T23:59:59Z')) // End of year, UTC
})

Test('Should IsDateTime 8', () => {
  Assert.IsFalse(Format.IsDateTime('2023-01-15T10:30:00')) // Date-time without timezone (local time)
})

Test('Should IsDateTime 9', () => {
  Assert.IsFalse(Format.IsDateTime('2023-1-15T10:30:00Z')) // Month single digit (invalid)
})

Test('Should IsDateTime 10', () => {
  Assert.IsFalse(Format.IsDateTime('2023-01-15 10:30:00Z')) // Space instead of T
})

Test('Should IsDateTime 11', () => {
  Assert.IsFalse(Format.IsDateTime('2023-01-15T10:30Z')) // Missing seconds
})

Test('Should IsDateTime 12', () => {
  Assert.IsFalse(Format.IsDateTime('2023-01-15T10:30:00+01')) // Incomplete timezone offset
})

Test('Should IsDateTime 13', () => {
  Assert.IsFalse(Format.IsDateTime('2023-01-15T25:30:00Z')) // Invalid hour
})

Test('Should IsDateTime 14', () => {
  Assert.IsFalse(Format.IsDateTime('2023-13-15T10:30:00Z')) // Invalid month
})

Test('Should IsDateTime 15', () => {
  Assert.IsFalse(Format.IsDateTime('2023-01-32T10:30:00Z')) // Invalid day
})

Test('Should IsDateTime 16', () => {
  Assert.IsFalse(Format.IsDateTime('not-a-date-time')) // Completely invalid string
})
