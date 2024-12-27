import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/Duration', () => {
  it('Should validate Duration 1', () => {
    Assert.IsFalse(Format.IsDate('not-a-duration'))
  })
  it('Should validate Duration 2', () => {
    Assert.IsTrue(Format.IsDuration('P1Y2M3DT4H5M6S'))
  })
  it('Should validate Duration 3', () => {
    Assert.IsTrue(Format.IsDuration('PT4H5M6S'))
  })
  it('Should validate Duration 4', () => {
    Assert.IsFalse(Format.IsDuration('P-1Y2M3DT4H5M6S'))
  })
  it('Should validate Duration 5', () => {
    Assert.IsFalse(Format.IsDuration('P1Y2M3DT4H5M6'))
  })
})
