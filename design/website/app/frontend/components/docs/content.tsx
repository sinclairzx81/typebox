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

// deno-fmt-ignore-file

import Prism from 'prismjs'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-bash.js'
import * as React from 'react'

// ------------------------------------------------------------------
// Content
// ------------------------------------------------------------------
export interface ContentProperties {
  content: string
}
interface Section {
  id: string
  label: string
}
export function Content(props: ContentProperties) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [sections, setSections] = React.useState<Section[]>([])
  const html = React.useMemo(() => ({ __html: props.content }), [props.content])
  React.useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return
    const container = content.closest<HTMLElement>('.content')
    if (container) container.scrollTop = 0
    Prism.highlightAllUnder(content)
    const headings = [...content.querySelectorAll<HTMLElement>('h2, h3')]
    setSections(headings.map((heading, index) => {
      const id = `docs-section-${index + 1}`
      heading.id = id
      heading.tabIndex = -1
      return { id, label: heading.textContent?.trim() ?? '' }
    }))
  }, [props.content])
  return (
    <div className='content'>
      <div className='content-layout'>
        <div
          ref={contentRef}
          className='markdown'
          dangerouslySetInnerHTML={html}
        />
        {sections.length > 1 && (
          <nav className='table-of-contents' aria-label='On this page'>
            <h2>On this page</h2>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => {
                      event.preventDefault()
                      const heading = contentRef.current?.querySelector<HTMLElement>(`#${section.id}`)
                      const container = contentRef.current?.closest<HTMLElement>('.content')
                      if (heading && container) {
                        const top = heading.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
                        container.scrollTop = Math.max(0, top - 16)
                      }
                      heading?.focus({ preventScroll: true })
                    }}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}