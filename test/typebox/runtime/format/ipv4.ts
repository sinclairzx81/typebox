import { Format } from 'typebox/format'
import { Assert } from 'test'

const Test = Assert.Context('Format.IsIPv4')

Test('Should IsIPv4 1', () => {
  Assert.IsTrue(Format.IsIPv4('192.168.1.1'))
})

Test('Should IsIPv4 2', () => {
  Assert.IsTrue(Format.IsIPv4('127.0.0.1'))
})

Test('Should IsIPv4 3', () => {
  Assert.IsTrue(Format.IsIPv4('0.0.0.0'))
})

Test('Should IsIPv4 4', () => {
  Assert.IsTrue(Format.IsIPv4('255.255.255.255'))
})

Test('Should IsIPv4 5', () => {
  Assert.IsTrue(Format.IsIPv4('0.255.0.255'))
})

Test('Should IsIPv4 6', () => {
  Assert.IsTrue(Format.IsIPv4('1.22.123.254'))
})

Test('Should IsIPv4 7', () => {
  Assert.IsTrue(Format.IsIPv4('10.255.255.255'))
})

Test('Should IsIPv4 8', () => {
  Assert.IsTrue(Format.IsIPv4('8.8.8.8'))
})

Test('Should IsIPv4 9', () => {
  Assert.IsFalse(Format.IsIPv4('192.168.1.1.2'))
})

Test('Should IsIPv4 10', () => {
  Assert.IsFalse(Format.IsIPv4('192.168.1'))
})

Test('Should IsIPv4 11', () => {
  Assert.IsFalse(Format.IsIPv4('256.0.0.0'))
})

Test('Should IsIPv4 12', () => {
  Assert.IsFalse(Format.IsIPv4('192.168.01.1'))
})

Test('Should IsIPv4 13', () => {
  Assert.IsFalse(Format.IsIPv4('1.2.3.foo'))
})

Test('Should IsIPv4 14', () => {
  Assert.IsFalse(Format.IsIPv4('192.168..1'))
})

Test('Should IsIPv4 15', () => {
  Assert.IsFalse(Format.IsIPv4(' 1.2.3.4'))
})

Test('Should IsIPv4 16', () => {
  Assert.IsFalse(Format.IsIPv4('1.2.3.4 '))
})
