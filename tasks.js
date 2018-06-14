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

const TYPESCRIPT_SOURCE = "tsc-bundle --project ./src/tsconfig.json"
const TYPESCRIPT_TEST   = "tsc-bundle --project ./spec/tsconfig.json"

//------------------------------------------------------
//  tasks:
//------------------------------------------------------

const clean = async () => {
  await shell("shx rm -rf ./bin")
  await shell("shx rm -rf ./index.js")
  await shell("shx rm -rf ./spec.js")
  await shell("shx rm -rf ./package-lock.json")
  await shell("shx rm -rf ./node_modules")
  
}

const start = async () => {
  await shell("npm install")
  await shell(`${TYPESCRIPT_SOURCE}`)
  await Promise.all([
    shell(`${TYPESCRIPT_SOURCE} --watch > /dev/null`),
    shell("fsrun ./index.js [node index.js]")
  ])
}

const spec = async () => {
  // await shell("npm install")
  await shell(`${TYPESCRIPT_TEST}`)
  await shell("mocha ./spec.js")
}

const lint = async () => {
  await shell("tslint ./src/typebox.ts")
}

const build = async () => {
  await shell("npm install")
  await shell(`${TYPESCRIPT_SOURCE}`)
  await shell(`shx rm   -rf ./bin`)
  await shell(`shx mkdir -p ./bin`)
  await shell(`shx cp ./index.js     ./bin/index.js`)
  await shell(`shx cp ./package.json ./bin/package.json`)
  await shell(`shx cp ./readme.md    ./bin/readme.md`)
  await shell(`shx cp ./license.md   ./bin/license.md`)
}

//------------------------------------------------------
//  cli:
//------------------------------------------------------
cli(process.argv, {
  clean,
  start,
  build,
  spec,
  lint
}).catch(console.log)
