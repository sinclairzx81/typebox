/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

import * as React from 'react'

// ------------------------------------------------------------------
// TransformString
//
// Levenstein Distance Function
// ------------------------------------------------------------------
type TransformCallback = (step: string) => void
type Operation =
  | { type: 'match' }
  | { type: 'update'; toChar: string }
  | { type: 'delete' }
  | { type: 'insert'; toChar: string }

export function TransformString(
  from: string,
  to: string,
  onStep: TransformCallback,
  delayMs: number = 100,
): { cancel: () => void } {
  const m = from.length
  const n = to.length

  const dp: number[][] = Array.from(
    { length: m + 1 },
    () => Array(n + 1).fill(0),
  )
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (from[i - 1] === to[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1,
        )
      }
    }
  }
  const opsRev: Operation[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (
      i > 0 && j > 0 && from[i - 1] === to[j - 1] &&
      dp[i][j] === dp[i - 1][j - 1]
    ) {
      opsRev.push({ type: 'match' })
      i--
      j--
      continue
    }
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      opsRev.push({ type: 'update', toChar: to[j - 1] })
      i--
      j--
      continue
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      opsRev.push({ type: 'delete' })
      i--
      continue
    }
    if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      opsRev.push({ type: 'insert', toChar: to[j - 1] })
      j--
      continue
    }
    if (i > 0 && j > 0) {
      opsRev.push({ type: 'update', toChar: to[j - 1] })
      i--
      j--
    } else if (i > 0) {
      opsRev.push({ type: 'delete' })
      i--
    } else {
      opsRev.push({ type: 'insert', toChar: to[j - 1] })
      j--
    }
  }
  const operations: Operation[] = opsRev.reverse()
  const current = from.split('')
  let cursor = 0
  const timers: ReturnType<typeof setTimeout>[] = []
  let stepIndex = 0
  const schedule = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay)
    timers.push(id)
  }
  for (const operation of operations) {
    switch (operation.type) {
      case 'match':
        cursor++
        break
      case 'update': {
        const index = cursor
        schedule(() => {
          current[index] = operation.toChar
          onStep(current.join(''))
        }, stepIndex * delayMs)
        cursor++
        stepIndex++
        break
      }
      case 'delete': {
        const index = cursor
        schedule(() => {
          current.splice(index, 1)
          onStep(current.join(''))
        }, stepIndex * delayMs)
        stepIndex++
        break
      }
      case 'insert': {
        const index = cursor
        schedule(() => {
          current.splice(index, 0, operation.toChar)
          onStep(current.join(''))
        }, stepIndex * delayMs)
        cursor++
        stepIndex++
        break
      }
    }
  }

  return {
    cancel: () => timers.forEach(clearTimeout),
  }
}
// ------------------------------------------------------------------
// AnimatedSubHeading
// ------------------------------------------------------------------
type AnimatedSubHeadingProperties = {
  messages: string[]
  intervalMs?: number // time before switching messages
  stepDelayMs?: number // delay between edits
}
export function AnimatedSubHeading(props: AnimatedSubHeadingProperties) {
  const [text, setText] = React.useState(props.messages[0] || '')
  const indexRef = React.useRef(0)
  const transformRef = React.useRef<{ cancel: () => void } | null>(null)
  React.useEffect(() => {
    if (props.messages.length < 2) return
    const intervalId = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % props.messages.length
      transformRef.current?.cancel() // cancel previous transform if still running
      transformRef.current = TransformString(
        props.messages[indexRef.current],
        props.messages[nextIndex],
        setText,
        props.stepDelayMs,
      )
      indexRef.current = nextIndex
    }, props.intervalMs)
    return () => {
      clearInterval(intervalId)
      transformRef.current?.cancel()
    }
  }, [props.messages, props.intervalMs, props.stepDelayMs])

  return <h2>{text}</h2>
}
