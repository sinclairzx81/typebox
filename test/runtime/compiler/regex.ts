import { Type } from '@sinclair/typebox'
import { Ok, Fail } from './validate'

describe('type/compiler/RegEx', () => {
  it('Should validate numeric value', () => {
    const T = Type.RegEx(/[012345]/)
    Ok(T, '0')
    Ok(T, '1')
    Ok(T, '2')
    Ok(T, '3')
    Ok(T, '4')
    Ok(T, '5')
  })

  it('Should validate true or false string value', () => {
    const T = Type.RegEx(/true|false/)
    Ok(T, 'true')
    Ok(T, 'true')
    Ok(T, 'true')
    Ok(T, 'false')
    Ok(T, 'false')
    Ok(T, 'false')
    Fail(T, '6')
  })

  it('Should not validate failed regex test', () => {
    const T = Type.RegEx(/true|false/)
    Fail(T, 'unknown')
  })

  it('Should pass numeric 5 digit test', () => {
    const T = Type.RegEx(/[\d]{5}/)
    Ok(T, '12345')
  })
})
