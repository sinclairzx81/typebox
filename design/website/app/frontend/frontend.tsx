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

import './frontend.css'
import * as React from 'react'
import * as ReactRouter from 'react-router-dom'
import { Docs } from './components/docs/docs.tsx'
import { Home } from './components/home/home.tsx'
import { GithubLink } from './components/icons/github.tsx'
import { LightSwitch } from './components/icons/lightswitch.tsx'


const repositoryUrl = 'https://github.com/sinclairzx81/typebox'


// ------------------------------------------------------------------
// Header
// ------------------------------------------------------------------
function Header() {
  const [isLightMode, setIsLightMode] = React.useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'light'
  })
  // ----------------------------------------------------------------
  // Setup
  // ----------------------------------------------------------------
  React.useEffect(() => { setup() }, [isLightMode])
  function setup() {
    if (isLightMode) {
      document.body.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
    } else {
      document.body.classList.remove('light-mode')
      localStorage.setItem('theme', 'dark')
    }
  }
  // ----------------------------------------------------------------
  // ToggleTheme
  // ----------------------------------------------------------------
  function toggleTheme() {
    setIsLightMode(enabled => !enabled)
  }
  return (
    <div className='header'>
      <div className='logo'>
        <ReactRouter.Link to='/'>TypeBox</ReactRouter.Link>
      </div>
      <nav className='navigation'>
        <ReactRouter.Link to='/docs' className='navigation-link'>Docs</ReactRouter.Link>
        <LightSwitch onClick={toggleTheme} />
        <GithubLink url={repositoryUrl} />
      </nav>
    </div>
  )
}
// ------------------------------------------------------------------
// Body
// ------------------------------------------------------------------
function Body() {
  return (
    <div className='body'>
      <ReactRouter.Routes>
        <ReactRouter.Route path='/' element={<Home />} />
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
  return (
    <ReactRouter.HashRouter>
      <div className='frontend'>
        <Header />
        <Body />
        <Footer />
      </div>
    </ReactRouter.HashRouter>
  )
}
