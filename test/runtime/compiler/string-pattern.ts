import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('compiler/StringPattern', () => {
  //-----------------------------------------------------
  // Regular Expression
  //-----------------------------------------------------
  it('Should validate regular expression 1', () => {
    const T = Type.String({ pattern: /[012345]/.source })
    Ok(T, '0')
    Ok(T, '1')
    Ok(T, '2')
    Ok(T, '3')
    Ok(T, '4')
    Ok(T, '5')
  })
  it('Should validate regular expression 2', () => {
    const T = Type.String({ pattern: /true|false/.source })
    Ok(T, 'true')
    Ok(T, 'true')
    Ok(T, 'true')
    Ok(T, 'false')
    Ok(T, 'false')
    Ok(T, 'false')
    Fail(T, '6')
  })
  it('Should validate regular expression 3', () => {
    const T = Type.String({ pattern: /true|false/.source })
    Fail(T, 'unknown')
  })
  it('Should validate regular expression 4', () => {
    const T = Type.String({ pattern: /[\d]{5}/.source })
    Ok(T, '12345')
  })
  //-----------------------------------------------------
  // Regular Pattern
  //-----------------------------------------------------
  it('Should validate pattern 1', () => {
    const T = Type.String({ pattern: '[012345]' })
    Ok(T, '0')
    Ok(T, '1')
    Ok(T, '2')
    Ok(T, '3')
    Ok(T, '4')
    Ok(T, '5')
  })
  it('Should validate pattern 2', () => {
    const T = Type.String({ pattern: 'true|false' })
    Ok(T, 'true')
    Ok(T, 'true')
    Ok(T, 'true')
    Ok(T, 'false')
    Ok(T, 'false')
    Ok(T, 'false')
    Fail(T, '6')
  })
  it('Should validate pattern 3', () => {
    const T = Type.String({ pattern: 'true|false' })
    Fail(T, 'unknown')
  })
  it('Should validate pattern 4', () => {
    const T = Type.String({ pattern: '[\\d]{5}' })
    Ok(T, '12345')
  })
})
