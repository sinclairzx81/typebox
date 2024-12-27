import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/IsDateTime', () => {
  it('Should validate DateTime 1', () => {
    Assert.IsFalse(Format.IsDateTime('not-a-date-time'))
  })
  it('Should validate DateTime 2', () => {
    Assert.IsTrue(Format.IsDateTime('2023-10-01T12:00:00Z'))
  })
  it('Should validate DateTime 3', () => {
    Assert.IsTrue(Format.IsDateTime('2023-10-01T12:00:00+01:00'))
  })
  it('Should validate DateTime 4', () => {
    Assert.IsFalse(Format.IsDateTime('2023-10-01'))
  })
  it('Should validate DateTime 5', () => {
    Assert.IsTrue(Format.IsDateTime('2023-10-01T12:00:00'))
  })
})
