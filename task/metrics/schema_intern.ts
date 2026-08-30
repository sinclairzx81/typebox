import * as Schema from 'typebox/schema'

const R = Schema.Intern({
  type: 'object',
  required:['x', 'y', 'z'],
  properties: {
    x:{ type: 'number' },
    y:{ type: 'number' },
    z:{ type: 'number' },
  }
})

console.log(R)