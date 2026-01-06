/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import Type from 'typebox'

// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export const Date = () => Type.Object({
  [Symbol.toPrimitive]: Type.Never(),
  /** Returns a string representation of a date. The format of the string depends on the locale. */
  toString: Type.Function([], Type.String()),
  /** Returns a date as a string value. */
  toDateString: Type.Function([], Type.String()),
  /** Returns a time as a string value. */
  toTimeString: Type.Function([], Type.String()),
  /** Returns a value as a string value appropriate to the host environment's current locale. */
  toLocaleString: Type.Function([], Type.String()),
  /** Returns a date as a string value appropriate to the host environment's current locale. */
  toLocaleDateString: Type.Function([], Type.String()),
  /** Returns a time as a string value appropriate to the host environment's current locale. */
  toLocaleTimeString: Type.Function([], Type.String()),
  /** Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC. */
  valueOf: Type.Function([], Type.Number()),
  /** Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC. */
  getTime: Type.Function([], Type.Number()),
  /** Gets the year, using local time. */
  getFullYear: Type.Function([], Type.Number()),
  /** Gets the year using Universal Coordinated Time (UTC). */
  getUTCFullYear: Type.Function([], Type.Number()),
  /** Gets the month, using local time. */
  getMonth: Type.Function([], Type.Number()),
  /** Gets the month of a Date object using Universal Coordinated Time (UTC). */
  getUTCMonth: Type.Function([], Type.Number()),
  /** Gets the day-of-the-month, using local time. */
  getDate: Type.Function([], Type.Number()),
  /** Gets the day-of-the-month, using Universal Coordinated Time (UTC). */
  getUTCDate: Type.Function([], Type.Number()),
  /** Gets the day of the week, using local time. */
  getDay: Type.Function([], Type.Number()),
  /** Gets the day of the week using Universal Coordinated Time (UTC). */
  getUTCDay: Type.Function([], Type.Number()),
  /** Gets the hours in a date, using local time. */
  getHours: Type.Function([], Type.Number()),
  /** Gets the hours value in a Date object using Universal Coordinated Time (UTC). */
  getUTCHours: Type.Function([], Type.Number()),
  /** Gets the minutes of a Date object, using local time. */
  getMinutes: Type.Function([], Type.Number()),
  /** Gets the minutes of a Date object using Universal Coordinated Time (UTC). */
  getUTCMinutes: Type.Function([], Type.Number()),
  /** Gets the seconds of a Date object, using local time. */
  getSeconds: Type.Function([], Type.Number()),
  /** Gets the seconds of a Date object using Universal Coordinated Time (UTC). */
  getUTCSeconds: Type.Function([], Type.Number()),
  /** Gets the milliseconds of a Date, using local time. */
  getMilliseconds: Type.Function([], Type.Number()),
  /** Gets the milliseconds of a Date object using Universal Coordinated Time (UTC). */
  getUTCMilliseconds: Type.Function([], Type.Number()),
  /** Gets the difference in minutes between Universal Coordinated Time (UTC) and the time on the local computer. */
  getTimezoneOffset: Type.Function([], Type.Number()),
  /**
   * Sets the date and time value in the Date object.
   * @param time A numeric value representing the number of elapsed milliseconds since midnight, January 1, 1970 GMT.
   */
  setTime: Type.Function([Type.Number()], Type.Number()),
  /**
   * Sets the milliseconds value in the Date object using local time.
   * @param ms A numeric value equal to the millisecond value.
   */
  setMilliseconds: Type.Function([Type.Number()], Type.Number()),
  /**
   * Sets the milliseconds value in the Date object using Universal Coordinated Time (UTC).
   * @param ms A numeric value equal to the millisecond value.
   */
  setUTCMilliseconds: Type.Function([Type.Number()], Type.Number()),
  /**
   * Sets the seconds value in the Date object using local time.
   * @param sec A numeric value equal to the seconds value.
   * @param ms A numeric value equal to the milliseconds value.
   */
  setSeconds: Type.Function([Type.Number(), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the seconds value in the Date object using Universal Coordinated Time (UTC).
   * @param sec A numeric value equal to the seconds value.
   * @param ms A numeric value equal to the milliseconds value.
   */
  setUTCSeconds: Type.Function([Type.Number(), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the minutes value in the Date object using local time.
   * @param min A numeric value equal to the minutes value.
   * @param sec A numeric value equal to the seconds value.
   * @param ms A numeric value equal to the milliseconds value.
   */
  setMinutes: Type.Function([Type.Number(), Type.Optional(Type.Number()), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the minutes value in the Date object using Universal Coordinated Time (UTC).
   * @param min A numeric value equal to the minutes value.
   * @param sec A numeric value equal to the seconds value.
   * @param ms A numeric value equal to the milliseconds value.
   */
  setUTCMinutes: Type.Function([Type.Number(), Type.Optional(Type.Number()), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the hour value in the Date object using local time.
   * @param hours A numeric value equal to the hours value.
   * @param min A numeric value equal to the minutes value.
   * @param sec A numeric value equal to the seconds value.
   * @param ms A numeric value equal to the milliseconds value.
   */
  setHours: Type.Function([Type.Number(), Type.Optional(Type.Number()), Type.Optional(Type.Number()), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the hours value in the Date object using Universal Coordinated Time (UTC).
   * @param hours A numeric value equal to the hours value.
   * @param min A numeric value equal to the minutes value.
   * @param sec A numeric value equal to the seconds value.
   * @param ms A numeric value equal to the milliseconds value.
   */
  setUTCHours: Type.Function([Type.Number(), Type.Optional(Type.Number()), Type.Optional(Type.Number()), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the numeric day-of-the-month value of the Date object using local time.
   * @param date A numeric value equal to the day of the month.
   */
  setDate: Type.Function([Type.Number()], Type.Number()),
  /**
   * Sets the numeric day of the month in the Date object using Universal Coordinated Time (UTC).
   * @param date A numeric value equal to the day of the month.
   */
  setUTCDate: Type.Function([Type.Number()], Type.Number()),
  /**
   * Sets the month value in the Date object using local time.
   * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively.
   * @param date A numeric value representing the day of the month. If this value is not supplied, the value from a call to the getDate method is used.
   */
  setMonth: Type.Function([Type.Number(), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the month value in the Date object using Universal Coordinated Time (UTC).
   * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively.
   * @param date A numeric value representing the day of the month. If it is not supplied, the value from a call to the getUTCDate method is used.
   */
  setUTCMonth: Type.Function([Type.Number(), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the year of the Date object using local time.
   * @param year A numeric value for the year.
   * @param month A zero-based numeric value for the month (0 for January, 11 for December). Must be specified if numDate is specified.
   * @param date A numeric value equal for the day of the month.
   */
  setFullYear: Type.Function([Type.Number(), Type.Optional(Type.Number()), Type.Optional(Type.Number())], Type.Number()),
  /**
   * Sets the year value in the Date object using Universal Coordinated Time (UTC).
   * @param year A numeric value equal to the year.
   * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. Must be supplied if numDate is supplied.
   * @param date A numeric value equal to the day of the month.
   */
  setUTCFullYear: Type.Function([Type.Number(), Type.Optional(Type.Number()), Type.Optional(Type.Number())], Type.Number()),
  /** Returns a date converted to a string using Universal Coordinated Time (UTC). */
  toUTCString: Type.Function([], Type.String()),
  /** Returns a date as a string value in ISO format. */
  toISOString: Type.Function([], Type.String()),
  /** Used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization. */
  toJSON: Type.Function([Type.Optional(Type.String())], Type.String()),
})