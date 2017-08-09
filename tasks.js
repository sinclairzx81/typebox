//------------------------------------------------------
// task helper scripts:
//------------------------------------------------------
const shell = (command) => new Promise((resolve, reject) => {
  const { spawn } = require('child_process')
  const windows = /^win/.test(process.platform)
  console.log(`\x1b[32m${command}\x1b[0m` )
  const ls      = spawn(windows ? 'cmd' : 'sh', [windows ? '/c' : '-c', command] )
  ls.stdout.pipe(process.stdout)
  ls.stderr.pipe(process.stderr)
  ls.on('close', (code) => resolve(code))
})
const watch = (directory, func) => new Promise((resolve, reject) => {
  const fs   = require("fs")
  const path = require("path")
  fs.watch(directory, func)
  const paths = fs.readdirSync(directory).map(n => path.join(directory, n))
  const stats = paths.map(n => ({path: n, stat: fs.statSync(n)}))
  const dirs  = stats.filter(stat => stat.stat.isDirectory())
  return Promise.all([dirs.map(dir => watch(dir.path, func))])
})
const cli = async (args, tasks) => {
  const task = (args.length === 3) ? args[2] : "none"
  const func = (tasks[task]) ? tasks[task] : () => {
    console.log("tasks:")
    Object.keys(tasks).forEach(task => console.log(` - ${task}`))
  }; await func()
}

//------------------------------------------------------
//  constants:
//------------------------------------------------------
const TYPESCRIPT_INDEX = "tsc-bundle ./src/index.ts ./target/index.js --lib es2015,dom --removeComments"
const TYPESCRIPT_TEST  = "tsc-bundle ./test/index.ts ./target/test.js --lib es2015,dom --removeComments"

//------------------------------------------------------
//  tasks:
//------------------------------------------------------
const clean = async () => {
  await shell("shx rm -rf ./node_modules"),
  await shell("shx rm -rf ./target")
}

const install = async () => {
  await shell("npm install shx -g")
  await shell("npm install typescript -g")
  await shell("npm install typescript-bundle -g")
  await shell("npm install fsrun -g")
  await shell("npm install mocha -g")
}

const build = async () => {
  await shell("npm install")
  await shell("shx mkdir -p ./target")
  await shell(`${TYPESCRIPT_INDEX}`)
}

const run = async () => {
  await shell("npm install")
  await shell("shx mkdir -p ./target")
  await shell(`${TYPESCRIPT_TEST}`)
  await Promise.all([
    shell(`${TYPESCRIPT_TEST} --watch > /dev/null`),
    shell("fsrun ./target [mocha target/test]")
  ])
}

//------------------------------------------------------
//  cli:
//------------------------------------------------------
cli(process.argv, {
  install,
  clean,
  build,
  run,
}).catch(console.log)
