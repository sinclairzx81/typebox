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

import { BenchmarkResult, TestResultsRaw } from './common.ts'

// ------------------------------------------------------------------
// Iterations
// ------------------------------------------------------------------
function Iterations(iterations: number, callback: () => void): number {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) callback()
  return performance.now() - start
}
// ------------------------------------------------------------------
// Implementations
// ------------------------------------------------------------------
function Implementations(tests: Record<string, Record<string, () => void>>): string[] {
  const implSet = new Set<string>()
  for (const impls of Object.values(tests)) {
    for (const implName of Object.keys(impls)) {
      implSet.add(implName)
    }
  }
  return Array.from(implSet)
}
// ------------------------------------------------------------------
// PrintTest
// ------------------------------------------------------------------
const encoder = new TextEncoder()
const spinnerFrames = ['|', '/', '-', '\\']
let spinnerIndex = 0

function PrintTest(testName: string): void {
  const spinner = spinnerFrames[spinnerIndex % spinnerFrames.length]
  spinnerIndex++
  const message = `\r\x1b[2K${spinner} Running: ${testName}`
  Deno.stdout.writeSync(encoder.encode(message))
}

function ClearLine(): void {
  const message = `\r\x1b[2K`
  Deno.stdout.writeSync(encoder.encode(message))
}

// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
export function Run(iterations: number, tests: Record<string, Record<string, () => void>>): BenchmarkResult {
  const implementations = Implementations(tests)
  const results: TestResultsRaw = {}
  for (const [testName, impls] of Object.entries(tests)) {
    PrintTest(testName)
    results[testName] = {}
    for (const implName of implementations) {
      const fn = impls[implName]
      if (typeof fn === 'function') {
        results[testName][implName] = Iterations(iterations, fn)
      } else {
        results[testName][implName] = NaN
      }
    }
    ClearLine() // Clear progress line after test completes
  }
  return { iterations, results }
}