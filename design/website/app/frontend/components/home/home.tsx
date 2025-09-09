/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

// deno-fmt-ignore-file

import './home.css'
import * as React from 'react'
import * as ReactRouter from 'react-router-dom'
import { AnimatedSubHeading } from './heading.tsx'
import { Logo } from './logo.tsx'
function CopyIcon() {
  return (
    <svg
      aria-hidden='true'
      height='16'
      width='16'
      viewBox='0 0 16 16'
      version='1.1'
      data-view-component='true'
      className='octicon octicon-copy'
      fill='currentColor'
    >
      <path d='M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z'></path>
      <path d='M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z'></path>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden='true'
      height='16'
      width='16'
      viewBox='0 0 16 16'
      fill='currentColor'
    >
      <path d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'></path>
    </svg>
  )
}



export function Home() {
  const [copied, setCopied] = React.useState(false);
  const command = 'npm install typebox'
  async function copyCommand () {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
  return (
    <div className='home'>
      <div className='title'>
        <Logo />
        <h1>TypeBox</h1>
        <AnimatedSubHeading
          intervalMs={5000}
          stepDelayMs={20}
          messages={['A Runtime Type System for JavaScript']}
        />
      </div>
      <div className='actions'>
        <div className='install'>
          <span>{'$ npm install typebox'}</span>
          <button onClick={copyCommand} className='copy-btn' aria-label='Copy to clipboard'>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
        <ReactRouter.Link to='/docs' className='documentation'>
          docs
        </ReactRouter.Link>
      </div>
    </div>
  );
}