import * as Path from 'node:path'
import * as Zlib from 'node:zlib'
import * as Esbuild from 'esbuild'
import * as Task from '../task.ts'

// ------------------------------------------------------------------
// FormatSize
// ------------------------------------------------------------------
function formatSize(size: number): string {
  return `${(size / 1024).toFixed(2)} KB`
}

// ------------------------------------------------------------------
// Metrics
// ------------------------------------------------------------------
export async function metrics(entries: string[]): Promise<void> {
  const target = 'target/metrics'
  await Task.remove(target)
  await Task.createDir(target)
  const results = await Promise.all(entries.map(async (entry) => {
    const filename = Path.basename(entry)
    const [bundle, minified] = await Promise.all([
      Esbuild.build({ entryPoints: [entry], bundle: true, platform: 'browser', write: false, metafile: true }),
      Esbuild.build({ entryPoints: [entry], bundle: true, platform: 'browser', minify: true, write: false, metafile: true })
    ])
    const bundleOutput = bundle.outputFiles[0]
    const minifiedOutput = minified.outputFiles[0]
    if (bundleOutput === undefined || minifiedOutput === undefined) throw new Error(`No bundle output produced for ${entry}`)
    await Task.write(Path.join(target, `${filename}-bundle.js`), bundleOutput.text)
    await Task.write(Path.join(target, `${filename}-minified.js`), minifiedOutput.text)
    await Task.write(Path.join(target, `${filename}-bundle.meta.json`), JSON.stringify(bundle.metafile, null, 2))
    await Task.write(Path.join(target, `${filename}-minified.meta.json`), JSON.stringify(minified.metafile, null, 2))
    return {
      path: entry,
      bundled: formatSize(bundleOutput.contents.length),
      minified: formatSize(minifiedOutput.contents.length),
      gzipped: formatSize(Zlib.gzipSync(minifiedOutput.contents).length)
    }
  }))
  console.table(results)
  console.log('')
  console.log('  visit: https://esbuild.github.io/analyze/ for metafile analysis')
  console.log('')
}
