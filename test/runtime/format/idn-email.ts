import { Assert } from '../assert/index'
import * as Format from '@sinclair/typebox/format'

describe('format/IsIdnEmail', () => {
  it('Should validate IdnEmail 1', () => {
    Assert.IsFalse(Format.IsIdnEmail('not-a-email'))
  })
  it('Should validate IdnEmail 2', () => {
    Assert.IsTrue(Format.IsIdnEmail('test@example.com'))
  })
  it('Should validate IdnEmail 3', () => {
    Assert.IsFalse(Format.IsIdnEmail('test@.com'))
  })
  it('Should validate IdnEmail 4', () => {
    Assert.IsFalse(Format.IsIdnEmail('test@com'))
  })
  it('Should validate IdnEmail 5', () => {
    Assert.IsFalse(Format.IsIdnEmail('test@com.'))
  })
  it('Should validate IdnEmail 6', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name+tag+sorting@example.com'))
  })
  it('Should validate IdnEmail 7', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.co.uk'))
  })
  it('Should validate IdnEmail 8', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@.example.com'))
  })
  it('Should validate IdnEmail 9', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@example..com'))
  })
  it('Should validate IdnEmail 10', () => {
    Assert.IsTrue(Format.IsIdnEmail('user_name@example.com'))
  })
  it('Should validate IdnEmail 11', () => {
    Assert.IsFalse(Format.IsIdnEmail('user@name@example.com'))
  })
  it('Should validate IdnEmail 12', () => {
    Assert.IsTrue(Format.IsIdnEmail('user-name@example.com'))
  })
  it('Should validate IdnEmail 13', () => {
    Assert.IsFalse(Format.IsIdnEmail('user@name@example.com'))
  })
  it('Should validate IdnEmail 14', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.com'))
  })
  it('Should validate IdnEmail 15', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@.example.com'))
  })
  it('Should validate IdnEmail 16', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.com'))
  })
  it('Should validate IdnEmail 17', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@example..com'))
  })
  it('Should validate IdnEmail 18', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.com'))
  })
  it('Should validate IdnEmail 19', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@.example.com'))
  })
  it('Should validate IdnEmail 20', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.com'))
  })
  it('Should validate IdnEmail 21', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@example..com'))
  })
  it('Should validate IdnEmail 22', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.com'))
  })
  it('Should validate IdnEmail 23', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@.example.com'))
  })
  it('Should validate IdnEmail 24', () => {
    Assert.IsTrue(Format.IsIdnEmail('user.name@example.com'))
  })
  it('Should validate IdnEmail 25', () => {
    Assert.IsFalse(Format.IsIdnEmail('user.name@example..com'))
  })
  it('Should validate IdnEmail 26', () => {
    Assert.IsTrue(Format.IsIdnEmail('用户@domain.com'))
  })
  it('Should validate IdnEmail 29', () => {
    Assert.IsTrue(Format.IsIdnEmail('θσερ@εχαμπλε.ψομ'))
  })
  it('Should validate IdnEmail 30', () => {
    Assert.IsTrue(Format.IsIdnEmail('Dörte@Sörensen.example.com'))
  })
})
