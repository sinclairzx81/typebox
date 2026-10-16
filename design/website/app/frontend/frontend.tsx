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

import './frontend.css'
import * as React from 'react'
import * as ReactRouter from 'react-router-dom'
import { animateThemeProgress, themeProgress } from '../mode.ts'
import { Docs } from './components/docs/docs.tsx'
import { Home } from './components/home/home.tsx'
import { GithubLink } from './components/icons/github.tsx'
import { LightSwitch } from './components/icons/lightswitch.tsx'


const repositoryUrl = 'https://github.com/sinclairzx81/typebox'


// ------------------------------------------------------------------
// Header
// ------------------------------------------------------------------
interface HeaderProperties {
  isLightMode: boolean
  onToggleTheme: () => void
}
function Header({ isLightMode, onToggleTheme }: HeaderProperties) {
  React.useEffect(() => animateThemeProgress(isLightMode ? 1 : 0), [isLightMode])

  function handleThemeKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onToggleTheme()
  }
  return (
    <div className='header'>
      <div className='logo'>
        <ReactRouter.Link to='/'>TypeBox</ReactRouter.Link>
      </div>
      <nav className='navigation'>
        <ReactRouter.Link to='/docs' className='navigation-link'>Docs</ReactRouter.Link>
        <LightSwitch
          isLightMode={isLightMode}
          onMouseDown={onToggleTheme}
          onKeyDown={handleThemeKeyDown}
        />
        <GithubLink url={repositoryUrl} />
      </nav>
    </div>
  )
}
// ------------------------------------------------------------------
// Body
// ------------------------------------------------------------------
function Body({ mode }: { mode: 'light' | 'dark' }) {
  const isHome = ReactRouter.useLocation().pathname === '/'
  return (
    <div className={`body${isHome ? ' body-home' : ''}`}>
      <ReactRouter.Routes>
        <ReactRouter.Route path='/' element={<Home mode={mode} />} />
        <ReactRouter.Route path='/docs' element={<Docs src='manifest.json' />} />
        <ReactRouter.Route path='/docs/:section/:page' element={<Docs src='manifest.json' />} />
      </ReactRouter.Routes>
    </div>
  )
}
// ------------------------------------------------------------------
// Footer
// ------------------------------------------------------------------
function Footer() {
  return (
    <div className='footer'>
      <p>TypeBox {new Date().getFullYear()}</p>
    </div>
  )
}
// ------------------------------------------------------------------
// Frontend
// ------------------------------------------------------------------
export function Frontend() {
  const [isLightMode, setIsLightMode] = React.useState(() => themeProgress.value === 1)

  function toggleTheme() {
    const enabled = !isLightMode
    localStorage.setItem('theme', enabled ? 'light' : 'dark')
    setIsLightMode(enabled)
  }

  return (
    <div className='frontend'>
      <Header isLightMode={isLightMode} onToggleTheme={toggleTheme} />
      <Body mode={isLightMode ? 'light' : 'dark'} />
      <Footer />
    </div>
  )
}
