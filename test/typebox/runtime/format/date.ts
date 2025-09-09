import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsDate')

// IsDate Tests (ISO8601 YYYY-MM-DD)
Test('Should IsDate 1', () => {
  Assert.IsTrue(Format.IsDate('2023-01-15')) // Standard valid date
})

Test('Should IsDate 2', () => {
  Assert.IsFalse(Format.IsDate('1900-02-29')) // Leap year (1900 is not a leap year for most systems, but valid for common parsing, let's adjust for strict leap year later if needed)
})

Test('Should IsDate 3', () => {
  Assert.IsTrue(Format.IsDate('2000-02-29')) // Leap year (2000 is a leap year)
})

Test('Should IsDate 4', () => {
  Assert.IsTrue(Format.IsDate('2024-02-29')) // Current/future leap year
})

Test('Should IsDate 5', () => {
  Assert.IsTrue(Format.IsDate('0001-01-01')) // Earliest possible date
})

Test('Should IsDate 6', () => {
  Assert.IsTrue(Format.IsDate('9999-12-31')) // Latest possible date (within typical 4-digit year)
})

Test('Should IsDate 7', () => {
  Assert.IsTrue(Format.IsDate('2023-12-01')) // December, single digit day
})

Test('Should IsDate 8', () => {
  Assert.IsTrue(Format.IsDate('2023-09-30')) // Month with 30 days
})

Test('Should IsDate 9', () => {
  Assert.IsFalse(Format.IsDate('')) // Empty string
})

Test('Should IsDate 10', () => {
  Assert.IsFalse(Format.IsDate('2023-1-1')) // Single digit month and day (invalid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601))
})

Test('Should IsDate 11', () => {
  Assert.IsFalse(Format.IsDate('2023/01/15')) // Wrong separator
})

Test('Should IsDate 12', () => {
  Assert.IsFalse(Format.IsDate('2023-13-01')) // Invalid month (13)
})

Test('Should IsDate 13', () => {
  Assert.IsFalse(Format.IsDate('2023-01-32')) // Invalid day (32)
})

Test('Should IsDate 14', () => {
  Assert.IsFalse(Format.IsDate('2023-02-30')) // Invalid day for February (non-leap year)
})

Test('Should IsDate 15', () => {
  Assert.IsFalse(Format.IsDate('2023-01')) // Missing day
})

Test('Should IsDate 16', () => {
  Assert.IsFalse(Format.IsDate('not-a-date')) // Completely invalid format
})
