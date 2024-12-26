import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/IsHostname', () => {
  it('Should validate Hostname 1', () => {
    Assert.IsFalse(Format.IsHostname('not-a-hostname'))
  })
  it('Should validate Hostname 2', () => {
    Assert.IsTrue(Format.IsHostname('example.com'))
  })
  it('Should validate Hostname 3', () => {
    Assert.IsTrue(Format.IsHostname('sub.example.com'))
  })
  it('Should validate Hostname 4', () => {
    Assert.IsFalse(Format.IsHostname('example..com'))
  })
  it('Should validate Hostname 5', () => {
    Assert.IsFalse(Format.IsHostname('-example.com'))
  })
  it('Should validate Hostname 6', () => {
    Assert.IsFalse(Format.IsHostname('example-.com'))
  })
  it('Should validate Hostname 7', () => {
    Assert.IsTrue(Format.IsHostname('exa-mple.com'))
  })
  it('Should validate Hostname 8', () => {
    Assert.IsFalse(Format.IsHostname('example.com-'))
  })
  it('Should validate Hostname 9', () => {
    Assert.IsTrue(Format.IsHostname('example123.com'))
  })
  it('Should validate Hostname 10', () => {
    Assert.IsFalse(Format.IsHostname('example@com'))
  })
  it('Should validate Hostname 11', () => {
    Assert.IsTrue(Format.IsHostname('example.co.uk'))
  })
  it('Should validate Hostname 12', () => {
    Assert.IsFalse(Format.IsHostname('example..co.uk'))
  })
  it('Should validate Hostname 13', () => {
    Assert.IsTrue(Format.IsHostname('sub-domain.example.com'))
  })
  it('Should validate Hostname 14', () => {
    Assert.IsFalse(Format.IsHostname('example.com/'))
  })
  it('Should validate Hostname 15', () => {
    Assert.IsFalse(Format.IsHostname('xn--d1acufc.xn--p1ai'))
  })
})
