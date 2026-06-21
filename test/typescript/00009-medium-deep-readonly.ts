// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/00009-medium-deep-readonly/README.md
//
// Implement a generic DeepReadonly<T> which make every parameter of an object - and its sub-objects recursively - readonly.
//
// You can assume that we are only dealing with Objects in this challenge. Arrays, Functions, Classes and so on do not 
// need to be taken into consideration. However, you can still challenge yourself by covering as many different cases 
// as possible.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { Result } = Type.Script(`
  
  type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }

  type X = { 
    x: { 
      a: 1
      b: 'hi'
    }
    y: 'hey'
  }
  type Result = DeepReadonly<X> 

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('00009-medium-deep-readonly', () => {
  Assert.IsExtendsMutual<Result, {
    readonly x: {
      readonly a: 1
      readonly b: 'hi'
    }
    readonly y: 'hey'
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    readonly x: {
      readonly a: 1;
      readonly b: 'hi';
    };
    readonly y: 'hey';
  }`))
})
