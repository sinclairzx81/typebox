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

// deno-fmt-ignore-file
// deno-lint-ignore-file

import './docs.css'
import * as ReactRouter from 'react-router-dom'
import * as React from 'react'

import { Header } from './header.tsx'
import { Content } from './content.tsx'
import { Menu } from './menu.tsx'

// ------------------------------------------------------------------
// Manifest
// ------------------------------------------------------------------
interface Manifest {
  [section: string]: { [page: string]: string }
}
// ------------------------------------------------------------------
// TOP_LEVEL_ORDER
// ------------------------------------------------------------------
const TOP_LEVEL_ORDER = [
  'overview',
  'type',
  'script',
  'value',
  'compile',
  'format',
  'schema',
  'system',
]
// ------------------------------------------------------------------
// Docs
// ------------------------------------------------------------------
interface DocsProperties {
  src: string
  pageOrders?: { [section: string]: string[] } // optional per-section page order
}
export const Docs: React.FC<DocsProperties> = (props: DocsProperties) => {
  const { section: routeSection, page: routePage } = ReactRouter.useParams<
    { section: string; page: string }
  >()
  const navigate = ReactRouter.useNavigate()
  const [manifest, setManifest] = React.useState<Manifest | null>(null)
  const [currentSection, setCurrentSection] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState('')
  const [content, setContent] = React.useState<string>('')
  // ----------------------------------------------------------------
  // Load manifest
  // ----------------------------------------------------------------
  React.useEffect(() => {
    const loadManifest = async () => {
      try {
        const resp = await fetch(props.src)
        const data: Manifest = await resp.json()
        setManifest(data)
        const firstSection = TOP_LEVEL_ORDER.find((s) => s in data) ||
          Object.keys(data)[0]
        const firstPage = data[firstSection]['overview']
        // Initialize section/page from URL or default
        setCurrentSection(routeSection && routeSection in data ? routeSection : firstSection)
        setCurrentPage(
          routePage && data[routeSection || firstSection]?.[routePage]
            ? data[routeSection || firstSection][routePage]
            : firstPage,
        )
      } catch (err) {
        console.error('Failed to load manifest:', err)
      }
    }
    loadManifest()
  }, [props.src, routeSection, routePage])
  // ----------------------------------------------------------------
  // Load Content
  // ----------------------------------------------------------------
  React.useEffect(() => {
    if (!currentPage) return
    const loadContent = async () => {
      try {
        const baseUrl = new URL(props.src, window.location.href)
        const pageUrl = new URL(currentPage, baseUrl)
        const resp = await fetch(pageUrl.toString())
        const html = await resp.text()
        setContent(html)
      } catch (err) {
        setContent(`<p>Error loading ${currentPage}</p>`)
      }
    }
    loadContent()
  }, [currentPage, props.src])
  if (!manifest) return null
  const sections = TOP_LEVEL_ORDER.filter((key) => key in manifest)
  // ----------------------------------------------------------------
  // Events
  // ----------------------------------------------------------------
  function onSectionClick(section: string) {
    const page = manifest ? manifest[section]['overview'] : 'overview'
    setCurrentSection(section)
    setCurrentPage(page)
    navigate(`/docs/${section}/overview`)
  }
  function onSideMenuClick(pageUrl: string, pageName: string) {
    setCurrentPage(pageUrl)
    navigate(`/docs/${currentSection}/${pageName}`)
  }
  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <div className='docs'>

      <Header
        sections={sections}
        currentSection={currentSection}
        onSectionClick={onSectionClick}
      />
      <div className='body'>
        <Menu
          pages={manifest[currentSection]}
          currentPage={currentPage}
          onPageClick={(pageUrl) => {
            const pageName = Object.keys(manifest[currentSection]).find((key) =>
              manifest[currentSection][key] === pageUrl
            ) || 'overview'
            onSideMenuClick(pageUrl, pageName)
          }}
        />
        <Content content={content} />
      </div>

    </div>
  )
}
