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

// --------------------------------------------------------------------------
// IsBetween
// --------------------------------------------------------------------------
function IsBetween(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}
// --------------------------------------------------------------------------
// IsRegionalIndicator
// --------------------------------------------------------------------------
function IsRegionalIndicator(value: number): boolean {
  return IsBetween(value, 0x1F1E6, 0x1F1FF)
}
// --------------------------------------------------------------------------
// IsVariationSelector
// --------------------------------------------------------------------------
function IsVariationSelector(value: number): boolean {
  return IsBetween(value, 0xFE00, 0xFE0F)
}
// --------------------------------------------------------------------------
// IsCombiningMark
// --------------------------------------------------------------------------
function IsCombiningMark(value: number): boolean {
  return (
    IsBetween(value, 0x0300, 0x036F) ||
    IsBetween(value, 0x1AB0, 0x1AFF) ||
    IsBetween(value, 0x1DC0, 0x1DFF) ||
    IsBetween(value, 0xFE20, 0xFE2F)
  )
}
// --------------------------------------------------------------------------
// CodePointLength
// --------------------------------------------------------------------------
function CodePointLength(value: number): number {
  return value > 0xFFFF ? 2 : 1
}
// --------------------------------------------------------------------------
// ConsumeModifiers (helper)
// --------------------------------------------------------------------------
function ConsumeModifiers(value: string, index: number): number {
  while (index < value.length) {
    const point = value.codePointAt(index)!
    if (IsCombiningMark(point) || IsVariationSelector(point)) {
      index += CodePointLength(point)
    } else {
      break
    }
  }
  return index
}
// --------------------------------------------------------------------------
// NextGraphemeClusterIndex
// --------------------------------------------------------------------------
function NextGraphemeClusterIndex(value: string, clusterStart: number): number {
  const startCP = value.codePointAt(clusterStart)!
  let clusterEnd = clusterStart + CodePointLength(startCP)
  // Consume combining marks & variation selectors
  clusterEnd = ConsumeModifiers(value, clusterEnd)
  // Handle multi-ZWJ sequences
  while (clusterEnd < value.length - 1 && value[clusterEnd] === '\u200D') {
    const nextCP = value.codePointAt(clusterEnd + 1)!
    clusterEnd += 1 + CodePointLength(nextCP)
    clusterEnd = ConsumeModifiers(value, clusterEnd)
  }
  // Handle regional indicator pairs (flags)
  if (
    IsRegionalIndicator(startCP) &&
    clusterEnd < value.length &&
    IsRegionalIndicator(value.codePointAt(clusterEnd)!)
  ) {
    clusterEnd += CodePointLength(value.codePointAt(clusterEnd)!)
  }
  return clusterEnd
}
// --------------------------------------------------------------------------
// IsGraphemeCodePoint
// --------------------------------------------------------------------------
function IsGraphemeCodePoint(value: number): boolean {
  return (
    IsBetween(value, 0xD800, 0xDBFF) || // High surrogate
    IsBetween(value, 0x0300, 0x036F) || // Combining diacritical marks
    (value === 0x200D) // Zero-width joiner
  )
}
// --------------------------------------------------------------------------
// GraphemeCount
// --------------------------------------------------------------------------
/** Returns the number of grapheme clusters in a string */
export function GraphemeCount(value: string): number {
  let count = 0
  let index = 0
  while (index < value.length) {
    index = NextGraphemeClusterIndex(value, index)
    count++
  }
  return count
}
// --------------------------------------------------------------------------
// IsMinLength
// --------------------------------------------------------------------------
/** Checks if a string has at least a minimum number of grapheme clusters */
export function IsMinLength(value: string, minLength: number): boolean {
  if (minLength === 0) return true // 0-length
  let count = 0
  let index = 0
  while (index < value.length) {
    index = NextGraphemeClusterIndex(value, index)
    count++
    if (count >= minLength) return true
  }
  return false
}
// --------------------------------------------------------------------------
// IsMaxLength
// --------------------------------------------------------------------------
/** Checks if a string has at most a maximum number of grapheme clusters */
export function IsMaxLength(value: string, maxLength: number): boolean {
  let count = 0
  let index = 0
  while (index < value.length) {
    index = NextGraphemeClusterIndex(value, index)
    count++
    if (count > maxLength) return false
  }
  return true
}
// --------------------------------------------------------------------------
// IsMinLengthFast
// --------------------------------------------------------------------------
/** Fast check for minimum grapheme length, falls back to full check if needed */
export function IsMinLengthFast(value: string, minLength: number): boolean {
  if (minLength === 0) return true // 0-length
  let index = 0
  while (index < value.length) {
    if (IsGraphemeCodePoint(value.charCodeAt(index))) {
      return IsMinLength(value, minLength)
    }
    index++
    if (index >= minLength) return true
  }
  return false
}
// --------------------------------------------------------------------------
// IsMaxLengthFast
// --------------------------------------------------------------------------
/** Fast check for maximum grapheme length, falls back to full check if needed */
export function IsMaxLengthFast(value: string, maxLength: number): boolean {
  let index = 0
  while (index < value.length) {
    if (IsGraphemeCodePoint(value.charCodeAt(index))) {
      return IsMaxLength(value, maxLength)
    }
    index++
    if (index > maxLength) return false
  }
  return true
}
