import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/IdnHostname', () => {
  it('Should validate Idn Hostname 1', () => {
    Assert.IsFalse(Format.IsIdnHostname('not-a-hostname'))
  })
  it('Should validate Idn Hostname 2', () => {
    Assert.IsTrue(Format.IsIdnHostname('example.com'))
  })
  it('Should validate Idn Hostname 3', () => {
    Assert.IsTrue(Format.IsIdnHostname('sub.example.com'))
  })
  it('Should validate Idn Hostname 4', () => {
    Assert.IsFalse(Format.IsIdnHostname('example..com'))
  })
  it('Should validate Idn Hostname 5', () => {
    Assert.IsFalse(Format.IsIdnHostname('-example.com'))
  })
  it('Should validate Idn Hostname 6', () => {
    Assert.IsFalse(Format.IsIdnHostname('example-.com'))
  })
  it('Should validate Idn Hostname 7', () => {
    Assert.IsTrue(Format.IsIdnHostname('exa-mple.com'))
  })
  it('Should validate Idn Hostname 8', () => {
    Assert.IsFalse(Format.IsIdnHostname('example.com-'))
  })
  it('Should validate Idn Hostname 9', () => {
    Assert.IsTrue(Format.IsIdnHostname('example123.com'))
  })
  it('Should validate Idn Hostname 10', () => {
    Assert.IsFalse(Format.IsIdnHostname('example@com'))
  })
  it('Should validate Idn Hostname 11', () => {
    Assert.IsTrue(Format.IsIdnHostname('example.co.uk'))
  })
  it('Should validate Idn Hostname 12', () => {
    Assert.IsFalse(Format.IsIdnHostname('example..co.uk'))
  })
  it('Should validate Idn Hostname 13', () => {
    Assert.IsTrue(Format.IsIdnHostname('sub-domain.example.com'))
  })
  it('Should validate Idn Hostname 14', () => {
    Assert.IsFalse(Format.IsIdnHostname('example.com/'))
  })
  it('Should validate Idn Hostname 15', () => {
    Assert.IsTrue(Format.IsIdnHostname('θσερ.com'))
  })
  it('Should validate Idn Hostname 16', () => {
    Assert.IsTrue(Format.IsIdnHostname('θσερ.com'))
  })
  it('Should validate Idn Hostname 17', () => {
    Assert.IsTrue(Format.IsIdnHostname('你好.com'))
  })
  it('Should validate Idn Hostname 18', () => {
    Assert.IsTrue(Format.IsIdnHostname('пример.com'))
  })
  it('Should validate Idn Hostname 19', () => {
    Assert.IsTrue(Format.IsIdnHostname('exámple.com'))
  })
  it('Should validate Idn Hostname 20', () => {
    Assert.IsTrue(Format.IsIdnHostname('заказ.com'))
  })
  it('Should validate Idn Hostname 21', () => {
    Assert.IsTrue(Format.IsIdnHostname('монета.рф'))
  })
  it('Should validate Idn Hostname 22', () => {
    Assert.IsTrue(Format.IsIdnHostname('日本.com'))
  })
  it('Should validate Idn Hostname 23', () => {
    Assert.IsTrue(Format.IsIdnHostname('xn--exmple-9xg.com')) // Punycode example
  })
  it('Should validate Idn Hostname 24', () => {
    Assert.IsTrue(Format.IsIdnHostname('café.fr'))
  })
  it('Should validate Idn Hostname 25', () => {
    Assert.IsTrue(Format.IsIdnHostname('ελληνικά.gr'))
  })
  it('Should invalidate Idn Hostname 26', () => {
    Assert.IsFalse(Format.IsIdnHostname('example-.com')) // Invalid: ends with a hyphen
  })
  it('Should invalidate Idn Hostname 27', () => {
    Assert.IsFalse(Format.IsIdnHostname('-example.com')) // Invalid: starts with a hyphen
  })
  it('Should invalidate Idn Hostname 28', () => {
    Assert.IsFalse(Format.IsIdnHostname('example..com')) // Invalid: double dots
  })
  it('Should invalidate Idn Hostname 29', () => {
    Assert.IsFalse(Format.IsIdnHostname('xn--exmple-9xg..com')) // Invalid: double dots
  })
  it('Should invalidate Idn Hostname 30', () => {
    Assert.IsFalse(Format.IsIdnHostname('θσερ..com')) // Invalid: double dots
  })
  it('Should invalidate Idn Hostname 31', () => {
    Assert.IsFalse(Format.IsIdnHostname('test@domain.com')) // Invalid: includes special character `@`
  })
  it('Should invalidate Idn Hostname 32', () => {
    Assert.IsFalse(Format.IsIdnHostname('ex@mple.com')) // Invalid: includes special character `@`
  })
  it('Should invalidate Idn Hostname 33', () => {
    Assert.IsFalse(Format.IsIdnHostname('example.com/')) // Invalid: includes a `/`
  })
  it('Should invalidate Idn Hostname 34', () => {
    Assert.IsFalse(Format.IsIdnHostname('θσερ')) // Invalid: no TLD
  })
  // it('Should invalidate Idn Hostname 35', () => {
  //   Assert.IsFalse(Format.IsIdnHostname('example.☺com'));  // Invalid: contains non-valid character (`☺`)
  // })
})
