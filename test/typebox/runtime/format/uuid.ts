import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsUuid')

Test('Should Uuid 1', () => {
  Assert.IsFalse(Format.IsUuid('x'))
})

Test('Should Uuid 2', () => {
  Assert.IsTrue(Format.IsUuid('123e4567-e89b-12d3-a456-426614174000'))
})

Test('Should Uuid 3', () => {
  Assert.IsTrue(Format.IsUuid('123E4567-E89B-12D3-A456-426614174000')) // uppercase
})

Test('Should Uuid 4', () => {
  Assert.IsTrue(Format.IsUuid('urn:uuid:123e4567-e89b-12d3-a456-426614174000'))
})

Test('Should Uuid 5', () => {
  Assert.IsFalse(Format.IsUuid('123e4567e89b12d3a456426614174000')) // missing dashes
})

Test('Should Uuid 6', () => {
  Assert.IsFalse(Format.IsUuid('123e4567-e89b-12d3-a456-42661417400')) // too short
})

Test('Should Uuid 7', () => {
  Assert.IsFalse(Format.IsUuid('123e4567-e89b-12d3-a456-4266141740000')) // too long
})

Test('Should Uuid 8', () => {
  Assert.IsFalse(Format.IsUuid('g23e4567-e89b-12d3-a456-426614174000')) // invalid char
})

Test('Should Uuid 9', () => {
  Assert.IsFalse(Format.IsUuid('urn:uuid:123e4567e89b12d3a456426614174000')) // urn, missing dashes
})

Test('Should Uuid 10', () => {
  Assert.IsFalse(Format.IsUuid('urn:uuid:123e4567-e89b-12d3-a456-42661417400')) // urn, too short
})

Test('Should Uuid 11', () => {
  Assert.IsFalse(Format.IsUuid('urn:uuid:123e4567-e89b-12d3-a456-4266141740000')) // urn, too long
})

Test('Should Uuid 12', () => {
  Assert.IsFalse(Format.IsUuid('urn:uuid:g23e4567-e89b-12d3-a456-426614174000')) // urn, invalid char
})

Test('Should Uuid 13', () => {
  Assert.IsFalse(Format.IsUuid('')) // empty string
})

Test('Should Uuid 14', () => {
  Assert.IsFalse(Format.IsUuid('123e4567-e89b-12d3-a456-426614174000-')) // trailing dash
})

Test('Should Uuid 15', () => {
  Assert.IsFalse(Format.IsUuid('-123e4567-e89b-12d3-a456-426614174000')) // leading dash
})

Test('Should Uuid 16', () => {
  Assert.IsFalse(Format.IsUuid('urn:uuid:')) // urn, empty uuid
})
