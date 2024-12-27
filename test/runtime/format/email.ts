import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/Email', () => {
  it('Should validate Email 1', () => {
    Assert.IsFalse(Format.IsEmail('not-a-email'))
  })
  it('Should validate Email 2', () => {
    Assert.IsTrue(Format.IsEmail('test@example.com'))
  })
  it('Should validate Email 3', () => {
    Assert.IsFalse(Format.IsEmail('test@.com'))
  })
  it('Should validate Email 4', () => {
    Assert.IsFalse(Format.IsEmail('test@com'))
  })
  it('Should validate Email 5', () => {
    Assert.IsFalse(Format.IsEmail('test@com.'))
  })
  it('Should validate Email 6', () => {
    Assert.IsTrue(Format.IsEmail('user.name+tag+sorting@example.com'))
  })
  it('Should validate Email 7', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.co.uk'))
  })
  it('Should validate Email 8', () => {
    Assert.IsFalse(Format.IsEmail('user.name@.example.com'))
  })
  it('Should validate Email 9', () => {
    Assert.IsFalse(Format.IsEmail('user.name@example..com'))
  })
  it('Should validate Email 10', () => {
    Assert.IsTrue(Format.IsEmail('user_name@example.com'))
  })
  it('Should validate Email 11', () => {
    Assert.IsFalse(Format.IsEmail('user@name@example.com'))
  })
  it('Should validate Email 12', () => {
    Assert.IsTrue(Format.IsEmail('user-name@example.com'))
  })
  it('Should validate Email 13', () => {
    Assert.IsFalse(Format.IsEmail('user@name@example.com'))
  })
  it('Should validate Email 14', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.com'))
  })
  it('Should validate Email 15', () => {
    Assert.IsFalse(Format.IsEmail('user.name@.example.com'))
  })
  it('Should validate Email 16', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.com'))
  })
  it('Should validate Email 17', () => {
    Assert.IsFalse(Format.IsEmail('user.name@example..com'))
  })
  it('Should validate Email 18', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.com'))
  })
  it('Should validate Email 19', () => {
    Assert.IsFalse(Format.IsEmail('user.name@.example.com'))
  })
  it('Should validate Email 20', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.com'))
  })
  it('Should validate Email 21', () => {
    Assert.IsFalse(Format.IsEmail('user.name@example..com'))
  })
  it('Should validate Email 22', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.com'))
  })
  it('Should validate Email 23', () => {
    Assert.IsFalse(Format.IsEmail('user.name@.example.com'))
  })
  it('Should validate Email 24', () => {
    Assert.IsTrue(Format.IsEmail('user.name@example.com'))
  })
  it('Should validate Email 25', () => {
    Assert.IsFalse(Format.IsEmail('user.name@example..com'))
  })
})
