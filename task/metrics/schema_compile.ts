import * as Schema from 'typebox/schema'

const R = Schema.Compile({
  type: 'object',
  required:['x', 'y', 'z'],
  properties: {
    x:{ type: 'number' },
    y:{ type: 'number' },
    z:{ type: 'number' },
  }
}).Check({ x: 1, y: 2, z: 3})

console.log(R)