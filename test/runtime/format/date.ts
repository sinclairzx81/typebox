import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/IsDate', () => {
  it('Should validate Date 1', () => {
    Assert.IsFalse(Format.IsDate('not-a-date'))
  })
  it('Should validate Date 2', () => {
    Assert.IsTrue(Format.IsDate('2024-10-10'))
  })
  it('Should validate Date 3', () => {
    Assert.IsFalse(Format.IsDate('2024-13-10'))
  })
  it('Should validate Date 4', () => {
    Assert.IsFalse(Format.IsDate('2024-10-32'))
  })
  it('Should validate Date 5', () => {
    Assert.IsTrue(Format.IsDate('2024-02-29'))
  })
  it('Should validate Date 6', () => {
    Assert.IsTrue(Format.IsDate('2020-02-29'))
  })
  it('Should validate Date 7', () => {
    Assert.IsFalse(Format.IsDate('2024-00-10'))
  })
  it('Should validate Date 8', () => {
    Assert.IsFalse(Format.IsDate('2024-10-00'))
  })
  it('Should validate Date 9', () => {
    Assert.IsFalse(Format.IsDate('2024-10-1'))
  })
  it('Should validate Date 10', () => {
    Assert.IsFalse(Format.IsDate('23-10-10'))
  })
})
