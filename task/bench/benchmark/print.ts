/*--------------------------------------------------------------------------

Tasksmith

The MIT License (MIT)

Copyright (c) 2025 Haydn Paterson (sinclair) 

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

import { BenchmarkResult, PrintOptions, Units } from './common.ts'

function FormatResults(
  benchmark: BenchmarkResult,
  units: Units,
  formatValues = false
): Record<string, Record<string, string>> {
  const { results, iterations } = benchmark
  const formatted: Record<string, Record<string, string>> = {}

  const rawNumeric: Record<string, Record<string, number>> = {}

  // Collect raw values
  for (const [testName, impls] of Object.entries(results)) {
    formatted[testName] = {}
    rawNumeric[testName] = {}

    for (const [implName, elapsed] of Object.entries(impls)) {
      if (typeof elapsed === 'number' && !isNaN(elapsed)) {
        let raw: number
        switch (units) {
          case 'ElapsedTime':
            raw = elapsed
            break
          case 'OperationsPerSecond':
            raw = (iterations * 1000) / elapsed
            break
          case 'OperationsPerMillisecond':
            raw = iterations / elapsed
            break
        }

        rawNumeric[testName][implName] = raw

        const formattedRaw = formatValues
          ? FormatNumber(raw)
          : units === 'ElapsedTime'
            ? raw.toFixed(2)
            : units === 'OperationsPerSecond'
              ? raw.toFixed(0)
              : raw.toFixed(4)

        formatted[testName][implName] = formattedRaw
      } else {
        formatted[testName][implName] = '-'
      }
    }
  }

  // Determine max width
  const allValues = Object.values(formatted).flatMap(row => Object.values(row))
  const numericWidths = allValues.filter(v => v !== '-').map(v => v.length)
  const maxWidth = Math.max(...numericWidths)

  const suffix = units === 'ElapsedTime'
    ? 'ms'
    : units === 'OperationsPerSecond'
      ? 'ops/s'
      : 'ops/ms'

  // Pad and add suffix
  for (const [testName, impls] of Object.entries(formatted)) {
    for (const [implName, value] of Object.entries(impls)) {
      if (value !== '-') {
        const padded = value.padStart(maxWidth)
        formatted[testName][implName] = `${padded} ${suffix}`
      }
    }
  }

  // Return both formatted and raw values for comparison
  return formatted
}

function FormatNumber(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return value.toFixed(0)
}

function PrintTable(
  formattedResults: Record<string, Record<string, string>>,
  rawResults: Record<string, Record<string, number | null>>
): void {
const reset = '\x1b[0m'
const lightYellow = '\x1b[93m'
const lightGreen = '\x1b[92m'
const dim = '\x1b[2m\x1b[34m'  // dim + blue

  const implementations = Array.from(new Set(
    Object.values(formattedResults).flatMap(impls => Object.keys(impls))
  ))

  const header = ['Test', ...implementations]
  const rows: string[][] = [header]

  // Build output rows
  for (const [testName, impls] of Object.entries(formattedResults)) {
    const row = [testName]
    for (const implName of implementations) {
      row.push(impls[implName] ?? '-')
    }
    rows.push(row)
  }

  const colWidths = header.map((_, i) =>
    Math.max(...rows.map(row => row[i].length))
  )
  const pad = (str: string, length: number) => str + ' '.repeat(length - str.length)

  const TL = '┌', TR = '┐', BL = '└', BR = '┘'
  const HL = '─', VL = '│'
  const TJ = '┬', BJ = '┴', LJ = '├', RJ = '┤', CJ = '┼'

  function horizontalLine(left: string, middle: string, right: string): string {
    let line = left
    for (let i = 0; i < colWidths.length; i++) {
      line += HL.repeat(colWidths[i] + 2)
      line += i === colWidths.length - 1 ? right : middle
    }
    return line
  }

  console.log(horizontalLine(TL, TJ, TR))

  const headerLine = header
    .map((cell, i) =>
      ' ' +
      (i === 0 ? cell : lightYellow + cell + reset) +
      pad('', colWidths[i] - cell.length) +
      ' '
    )
    .join(VL)
  console.log(VL + headerLine + VL)

  console.log(horizontalLine(LJ, CJ, RJ))

  for (let i = 1; i < rows.length; i++) {
    const testName = rows[i][0]
    const rawRow = rawResults[testName]
    const fastest = Object.entries(rawRow)
      .filter(([, v]) => typeof v === 'number')
      .sort(([, a], [, b]) => (b! - a!))[0]?.[0]

    const rowLine = rows[i]
      .map((cell, idx) => {
        if (idx === 0) return ' ' + pad(cell, colWidths[idx]) + ' '
        const implName = implementations[idx - 1]
        const isFastest = implName === fastest
        const color =
          cell === '-' ? '' : isFastest ? lightGreen : dim
        return ' ' + color + pad(cell, colWidths[idx]) + reset + ' '
      })
      .join(VL)

    console.log(VL + rowLine + VL)
  }

  console.log(horizontalLine(BL, BJ, BR))
}

export function Print(result: BenchmarkResult, options?: PrintOptions): void {
  const units = options?.units || 'ElapsedTime'
  const formatValues = options?.formatResults ?? false
  const formatted = FormatResults(result, units, formatValues)

  // Also extract raw values for comparison
  const rawResults: Record<string, Record<string, number | null>> = {}
  for (const [testName, impls] of Object.entries(result.results)) {
    rawResults[testName] = {}
    for (const [implName, elapsed] of Object.entries(impls)) {
      if (typeof elapsed === 'number' && !isNaN(elapsed)) {
        let raw: number
        switch (units) {
          case 'ElapsedTime':
            raw = elapsed
            break
          case 'OperationsPerSecond':
            raw = (result.iterations * 1000) / elapsed
            break
          case 'OperationsPerMillisecond':
            raw = result.iterations / elapsed
            break
        }
        rawResults[testName][implName] = raw
      } else {
        rawResults[testName][implName] = null
      }
    }
  }

  PrintTable(formatted, rawResults)
}