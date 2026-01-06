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

import './docs.css'

import * as React from 'react'

// ------------------------------------------------------------------
// Capitalize
// ------------------------------------------------------------------
function Capitalize(str: string) {
  return str.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

// ------------------------------------------------------------------
// Search
// ------------------------------------------------------------------
interface SearchProperties {
  pages: string[]
  onSearch: (query: string) => void
}
export function Search(props: SearchProperties) {
  const [query, setQuery] = React.useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    props.onSearch(val)
  }
  return (
    <div className='search'>
      <input
        type='text'
        placeholder='Search'
        value={query}
        onChange={handleChange}
      />
    </div>
  )
}
// ------------------------------------------------------------------
// Menu
// ------------------------------------------------------------------
export interface MenuProperties {
  pages: { [page: string]: string }
  currentPage: string
  onPageClick: (pageUrl: string) => void
}
function stripOrderPrefix(name: string) {
  return name.replace(/^\d+_/, '')
}
function sortPages(pages: string[]) {
  const withOrder: [string, number][] = []
  const withoutOrder: string[] = []
  for (const page of pages) {
    const match = page.match(/^(\d+)_/)
    if (match) {
      withOrder.push([page, parseInt(match[1], 10)])
    } else {
      withoutOrder.push(page)
    }
  }
  withOrder.sort((a, b) => a[1] - b[1])
  return [...withOrder.map(([page]) => page), ...withoutOrder]
}
export function Menu(props: MenuProperties) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [_selectedIndex, setSelectedIndex] = React.useState(0)
  const allPages = Object.keys(props.pages).filter((name) => name !== 'index')
  const sortedPages = sortPages(allPages)
  const withOverviewFirst = sortedPages.includes('overview')
    ? ['overview', ...sortedPages.filter((p) => p !== 'overview')]
    : sortedPages;
  const filteredPages = withOverviewFirst.filter((page) =>
    stripOrderPrefix(page).toLowerCase().includes(searchQuery.toLowerCase())
  );
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (filteredPages.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => {
        const next = (prev + 1) % filteredPages.length;
        props.onPageClick(props.pages[filteredPages[next]]);
        return next
      });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = (prev - 1 + filteredPages.length) % filteredPages.length;
        props.onPageClick(props.pages[filteredPages[next]]);
        return next;
      });
    }
  }
  return (
    <div className='menu' tabIndex={0} onKeyDown={onKeyDown}>
      <Search pages={allPages} onSearch={setSearchQuery} />
      {filteredPages.map((page, index) => (
        <button 
          type='button' 
          key={page} 
          className={props.currentPage === props.pages[page] ? 'active' : ''}
          onMouseDown={() => { 
            setSelectedIndex(index);
            props.onPageClick(props.pages[page])
          }}>
          {Capitalize(stripOrderPrefix(page))}
        </button>
      ))}
    </div>
  );
}