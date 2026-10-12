/*--------------------------------------------------------------------------

TaskSmith

The MIT License (MIT)

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

import * as Process from 'node:child_process'
import * as Fsp from 'node:fs/promises'
import * as Fs from 'node:fs'
import * as Http from 'node:http'
import * as Os from 'node:os'
import * as Path from 'node:path'

type TaskCallback = (...args: string[]) => unknown | Promise<unknown>
type DirectoryEntry = { path: string; name: string; isDirectory: boolean; isFile: boolean }

const tasks = new Map<string, TaskCallback>()
// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
export function run(name: string, callback: TaskCallback): void {
  tasks.set(name, callback)
}
// ------------------------------------------------------------------
// Execute
// ------------------------------------------------------------------
export async function execute(): Promise<void> {
  const [name, ...args] = process.argv.slice(2)
  if (name === undefined) throw new Error(`Expected task name. Available tasks: ${[...tasks.keys()].join(', ')}`)
  const callback = tasks.get(name)
  if (callback === undefined) throw new Error(`Unknown task '${name}'. Available tasks: ${[...tasks.keys()].join(', ')}`)
  console.time(name)
  try {
    await callback(...args)
  } finally {
    console.timeEnd(name)
  }
}
// ------------------------------------------------------------------
// Shell
// ------------------------------------------------------------------
function parseCommand(command: string): [string, string[]] {
  const tokens: string[] = []
  let token = ''
  let quote: '"' | "'" | undefined
  let started = false
  for (let index = 0; index < command.length; index++) {
    const character = command[index]
    if (character === '\\') {
      const next = command[index + 1]
      if (
        next !== undefined && (
          next === '\\' ||
          next === quote ||
          (quote === undefined && (next === '"' || next === "'" || /\s/.test(next)))
        )
      ) {
        token += next
        index++
      } else {
        token += character
      }
      started = true
      continue
    }
    if (quote !== undefined) {
      if (character === quote) quote = undefined
      else token += character
      started = true
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      started = true
    } else if (/\s/.test(character)) {
      if (started) {
        tokens.push(token)
        token = ''
        started = false
      }
    } else {
      token += character
      started = true
    }
  }
  if (quote !== undefined) throw new Error(`Unterminated ${quote} quote in command: ${command}`)
  if (started) tokens.push(token)
  const [program, ...args] = tokens
  if (program === undefined || program.length === 0) throw new Error('Expected program in command')
  return [program, args]
}
function spawn(program: string, args: string[], cwd: string, shell: boolean, command: string = [program, ...args].join(' ')): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child = Process.spawn(program, args, { cwd, stdio: 'inherit', shell })
    child.once('error', reject)
    child.once('close', (code, signal) => {
      if (code === 0) {
        resolve()
      } else if (signal !== null) {
        reject(new Error(`Command was terminated by signal ${signal}: ${command}`))
      } else {
        reject(new Error(`Command exited with code ${code}: ${command}`))
      }
    })
  })
}
export async function shell(command: string, cwd: string = process.cwd(), displayCommand: string = command): Promise<void> {
  const [program, args] = parseCommand(command)
  await spawn(program, args, cwd, process.platform === 'win32', displayCommand)
}
// ------------------------------------------------------------------
// Tsc
// ------------------------------------------------------------------
export async function tsc(version: string, command: string): Promise<void> {
  await shell(`npm exec --yes --package=${JSON.stringify(`typescript@${version}`)} -- tsc ${command}`)
}
// ------------------------------------------------------------------
// open
// ------------------------------------------------------------------
export async function openBrowser(uri: string): Promise<void> {
  const hasScheme = /^[A-Za-z][A-Za-z\d+.-]*:/.test(uri) && !Path.isAbsolute(uri)
  const url = hasScheme ? new URL(uri) : undefined
  if (url !== undefined && !['file:', 'http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported browser URL protocol: ${url.protocol}`)
  }
  const location = url?.href ?? Path.resolve(uri)
  const [program, args] = process.platform === 'win32' ? ['explorer.exe', [location]] : process.platform === 'darwin' ? ['open', [location]] : process.platform === 'linux' ? ['xdg-open', [location]] : (() => {
    throw new Error(`Unsupported operating system: ${process.platform}`)
  })()
  await spawn(program, args, process.cwd(), false, `${program} ${location}`)
}
// ------------------------------------------------------------------
// ReadDirectory
// ------------------------------------------------------------------
export async function readDirectory(directory: string): Promise<DirectoryEntry[]> {
  const values = await Fsp.readdir(directory, { withFileTypes: true })
  return values.map((value) => ({
    path: Path.join(directory, value.name),
    name: value.name,
    isDirectory: value.isDirectory(),
    isFile: value.isFile()
  }))
}
// ------------------------------------------------------------------
// ReadDirectoryRecursive
// ------------------------------------------------------------------
export async function readDirectoryRecursive(directory: string): Promise<string[]> {
  const result: string[] = []
  for (const entry of await readDirectory(directory)) {
    if (entry.isDirectory) result.push(...await readDirectoryRecursive(entry.path))
    else if (entry.isFile) result.push(entry.path)
  }
  return result
}
// ------------------------------------------------------------------
// Read
// ------------------------------------------------------------------
export async function read(path: string): Promise<string> {
  return await Fsp.readFile(path, 'utf8')
}
// ------------------------------------------------------------------
// CreateDir
// ------------------------------------------------------------------
export async function createDir(path: string): Promise<void> {
  await Fsp.mkdir(path, { recursive: true })
}
// ------------------------------------------------------------------
// Write
// ------------------------------------------------------------------
export async function write(path: string, content: string): Promise<void> {
  await Fsp.mkdir(Path.dirname(path), { recursive: true })
  await Fsp.writeFile(path, content)
}
// ------------------------------------------------------------------
// Remove
// ------------------------------------------------------------------
export async function remove(path: string): Promise<void> {
  await Fsp.rm(path, { recursive: true, force: true })
}
// ------------------------------------------------------------------
// Copy
// ------------------------------------------------------------------
export async function copy(source: string, target: string): Promise<void> {
  await Fsp.mkdir(Path.dirname(target), { recursive: true })
  await Fsp.cp(source, target, { recursive: true, force: true })
}
// ------------------------------------------------------------------
// Serve
// ------------------------------------------------------------------
function contentType(path: string): string {
  switch (Path.extname(path)) {
    case '.css':
      return 'text/css; charset=utf-8'
    case '.html':
      return 'text/html; charset=utf-8'
    case '.ico':
      return 'image/x-icon'
    case '.js':
      return 'text/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.ttf':
      return 'font/ttf'
    default:
      return 'application/octet-stream'
  }
}
type ServerListener = {
  url: string
  closed: Promise<void>
  close(): Promise<void>
}
export async function serve(directory: string, port: number): Promise<ServerListener> {
  const root = Path.resolve(directory)
  const reloadPath = '/__reload'
  const clients = new Set<Http.ServerResponse>()
  const server = Http.createServer((request, response) => {
    let pathname: string
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
    } catch {
      response.writeHead(400).end('Bad request')
      return
    }
    if (pathname === reloadPath) {
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream'
      })
      response.write(': connected\n\n')
      clients.add(response)
      response.on('close', () => clients.delete(response))
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405).end('Method not allowed')
      return
    }
    let filePath = Path.resolve(root, pathname === '/' ? 'index.html' : `.${pathname}`)
    const relativePath = Path.relative(root, filePath)
    if (relativePath.startsWith('..') || Path.isAbsolute(relativePath)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    void (async () => {
      if ((await Fsp.stat(filePath)).isDirectory()) filePath = Path.resolve(filePath, 'index.html')
      let body: Buffer | string = await Fsp.readFile(filePath)
      if (Path.extname(filePath) === '.html') {
        body = body.toString().replace(
          /<\/body>/i,
          `<script>new EventSource('${reloadPath}').onmessage=()=>location.reload()</script></body>`
        )
      }
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': contentType(filePath)
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    })().catch((error: unknown) => {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        response.writeHead(404).end('Not found')
      } else {
        console.error('Static server error:', error)
        response.writeHead(500).end('Internal server error')
      }
    })
  })
  const closed = new Promise<void>((resolveClosed) => server.once('close', resolveClosed))
  let reloadTimer: ReturnType<typeof setTimeout> | undefined
  const watcher = Fs.watch(root, { recursive: true }, () => {
    if (reloadTimer !== undefined) clearTimeout(reloadTimer)
    reloadTimer = setTimeout(() => {
      for (const client of clients) client.write('data: reload\n\n')
    }, 250)
  })
  watcher.on('error', (error) => console.error('Static server watcher error:', error))
  let closePromise: Promise<void> | undefined
  const cleanup = () => {
    if (reloadTimer !== undefined) clearTimeout(reloadTimer)
    watcher.close()
    for (const client of clients) client.end()
    clients.clear()
    process.off('SIGINT', stop)
    process.off('SIGTERM', stop)
  }
  const close = (): Promise<void> => {
    if (closePromise !== undefined) return closePromise
    cleanup()
    closePromise = server.listening
      ? new Promise<void>((resolveClose, rejectClose) => {
        server.close((error) => error === undefined ? resolveClose() : rejectClose(error))
      })
      : closed
    return closePromise
  }
  const stop = () => {
    void close().catch((error: unknown) => console.error('Static server shutdown error:', error))
  }
  try {
    await new Promise<void>((resolveListen, rejectListen) => {
      const onError = (error: Error) => rejectListen(error)
      server.once('error', onError)
      server.listen(port, '0.0.0.0', () => {
        server.off('error', onError)
        server.on('error', (error) => console.error('Static server error:', error))
        resolveListen()
      })
    })
  } catch (error) {
    watcher.close()
    throw error
  }
  server.once('error', (error) => console.error('Static server error:', error))
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  const address = server.address()
  const listeningPort = address !== null && typeof address !== 'string' ? address.port : port
  const url = `http://localhost:${listeningPort}`
  const networkUrls = Object.values(Os.networkInterfaces())
    .flatMap((interfaces) => interfaces ?? [])
    .filter(({ family, internal }) => family === 'IPv4' && !internal)
    .map(({ address }) => `http://${address}:${listeningPort}`)
  console.log(`Serving ${root}:`)
  console.log(`  ${url}`)
  for (const networkUrl of networkUrls) console.log(`  ${networkUrl}`)
  return { url, closed, close }
}
