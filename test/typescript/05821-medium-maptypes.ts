// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/05821-medium-maptypes/README.md
//
// Implement MapTypes<T, R> which will transform types in object T to different types defined by type R which 
// has the following structure
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution: 
// 
// Note: Changed Date to Null as Date is not supported
// ------------------------------------------------------------------

const { Result } = Type.Script(`

  type MapTypes<T, R extends { mapFrom: any; mapTo: any }> = {
    [K in keyof T]: T[K] extends R['mapFrom']
    ? R extends { mapFrom: T[K] }
    ? R['mapTo']
    : never
    : T[K]
  }

  type StringToNumber = { mapFrom: string; mapTo: number; }
  type StringToNull = { mapFrom: string; mapTo: null; }
  type Result = MapTypes<{ iWillBeNumberOrDate: string }, StringToNull | StringToNumber> //  gives { iWillBeNumberOrDate: number | null; }

`)

type Result = Type.Static<typeof Result>

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('05821-medium-maptypes', () => {
  Assert.IsExtendsMutual<Result, {
      iWillBeNumberOrDate: null | number;
  }>(true)

  Assert.IsEqual(Result, Type.Script(`{
    iWillBeNumberOrDate: null | number;
  }`))
})


