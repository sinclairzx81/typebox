import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/Ipv4', () => {
  it('Should validate Ipv4 1', () => {
    Assert.IsFalse(Format.IsIpv4('not-a-ipv4'))
  })
  it('Should validate Ipv4 2', () => {
    Assert.IsTrue(Format.IsIpv4('192.168.1.1'))
  })
  it('Should validate Ipv4 3', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.a.1'))
  })
  it('Should validate Ipv4 4', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.1.1.'))
  })
  it('Should validate Ipv4 5', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.1'))
  })
  it('Should validate Ipv4 6', () => {
    Assert.IsFalse(Format.IsIpv4('256.256.256.256'))
  })
  it('Should validate Ipv4 7', () => {
    Assert.IsFalse(Format.IsIpv4('-192.168.1.1'))
  })
  it('Should validate Ipv4 8', () => {
    Assert.IsTrue(Format.IsIpv4('1.2.3.4'))
  })
  it('Should validate Ipv4 9', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.1.1.1'))
  })
  it('Should validate Ipv4 10', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.#.1'))
  })
  it('Should validate Ipv4 11', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.01.001'))
  })
  it('Should validate Ipv4 12', () => {
    Assert.IsTrue(Format.IsIpv4('0.0.0.0'))
  })
  it('Should validate Ipv4 13', () => {
    Assert.IsTrue(Format.IsIpv4('255.255.255.255'))
  })
  it('Should validate Ipv4 14', () => {
    Assert.IsFalse(Format.IsIpv4(''))
  })
  it('Should validate Ipv4 15', () => {
    Assert.IsFalse(Format.IsIpv4('192.168.1.1.1.1'))
  })
})
