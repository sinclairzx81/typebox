import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/Ipv6', () => {
  it('Should validate Ipv6 1', () => {
    Assert.IsFalse(Format.IsIpv6('not-a-ipv6'))
  })
  it('Should validate Ipv6 2', () => {
    Assert.IsTrue(Format.IsIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'))
  })
  it('Should validate Ipv6 3', () => {
    Assert.IsTrue(Format.IsIpv6('2001:db8:85a3::8a2e:370:7334'))
  })
  it('Should validate Ipv6 4', () => {
    Assert.IsFalse(Format.IsIpv6('2001:db8:85a3::8a2e:370:xyz4'))
  })
  it('Should validate Ipv6 5', () => {
    Assert.IsFalse(Format.IsIpv6('2001:db885a3:8a2e:370:7334'))
  })
  it('Should validate Ipv6 6', () => {
    Assert.IsFalse(Format.IsIpv6('2001:db8:85a3:0000:0000:8a2e:0370:7334:1234'))
  })
  it('Should validate Ipv6 7', () => {
    Assert.IsFalse(Format.IsIpv6('2001::db8::85a3::8a2e::370:7334'))
  })
  it('Should validate Ipv6 8', () => {
    Assert.IsTrue(Format.IsIpv6('::192.168.1.1'))
  })
  it('Should validate Ipv6 9', () => {
    Assert.IsTrue(Format.IsIpv6('2001:db8:85a3::'))
  })
  it('Should validate Ipv6 10', () => {
    Assert.IsFalse(Format.IsIpv6('2001:db8:85g3:0000:0000:8a2e:0370:7334'))
  })
  it('Should validate Ipv6 11', () => {
    Assert.IsTrue(Format.IsIpv6('::'))
  })
  it('Should validate Ipv6 12', () => {
    Assert.IsTrue(Format.IsIpv6('0:0:0:0:0:0:0:0'))
  })
  it('Should validate Ipv6 13', () => {
    Assert.IsFalse(Format.IsIpv6('2001:db8:85a3:12345:0000:8a2e:0370:7334'))
  })
  it('Should validate Ipv6 14', () => {
    Assert.IsFalse(Format.IsIpv6('2001:db8:85:zzz:0000:8a2e:0370:7334'))
  })
  it('Should validate Ipv6 15', () => {
    Assert.IsTrue(Format.IsIpv6('2001:db8:85a3:0:0:8a2e:370:7334'))
  })
})
