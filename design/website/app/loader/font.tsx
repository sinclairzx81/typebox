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

import * as React from 'react'

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}
// ------------------------------------------------------------------
// FontLoader
//
// Deno doesn't support ttf font embedding in CSS so we need to load
// another way. This code will load and inject the font then render
// embedded child elements. This is a bit cleaner than having open
// <style> tags embedded in the raw HTML.
//
// ------------------------------------------------------------------
export interface FontLoaderProperties {
  fontName: string
  fontSrc: string
  children?: React.ReactNode
}
export function FontLoader(props: FontLoaderProperties) {
  const [css, setCss] = React.useState<string | null>(null)
  React.useEffect(() => { load() }, [props.fontSrc, props.fontName])
  async function load() {
    const response = await fetch(props.fontSrc)
    const buffer = await response.arrayBuffer()
    const base64 = uint8ToBase64(new Uint8Array(buffer))
    setCss(`@font-face { font-family: '${props.fontName}'; src: url(data:font/ttf;base64,${base64}) format('truetype'); }`)
  }
  if (!css) return null
  return (
    <>
      <style>{css}</style>
      {props.children}
    </>
  )
}