/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

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

import * as Proc from 'node:child_process'
import * as Path from 'node:path'
import * as Fs from 'node:fs'

const TestSuiteRepository = 'https://github.com/json-schema-org/JSON-Schema-Test-Suite.git'

// ------------------------------------------------------------------
// CloneTestSuite
// ------------------------------------------------------------------
export async function CloneTestSuite(directory: string): Promise<void> {
  Fs.mkdirSync(Path.dirname(directory), { recursive: true })
  const isRepository = Fs.existsSync(Path.join(directory, '.git'))
  if (Fs.existsSync(directory) && !isRepository && Fs.readdirSync(directory).length > 0) {
    throw new Error(`Clone directory is not empty and is not a Git repository: ${directory}`)
  }
  const args = isRepository ? ['-C', directory, 'pull', '--ff-only'] : ['clone', '--depth', '1', TestSuiteRepository, directory]
  const command = isRepository ? 'pull' : 'clone'
  await new Promise<void>((resolve, reject) => {
    const proc = Proc.spawn('git', args, { stdio: 'inherit' })
    proc.once('error', reject)
    proc.once('close', (code, signal) => {
      if (code === 0) resolve()
      else if (signal !== null) reject(new Error(`git ${command} was terminated by signal ${signal}`))
      else reject(new Error(`git ${command} failed with exit code ${code}`))
    })
  })
}
