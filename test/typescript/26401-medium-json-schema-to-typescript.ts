// ------------------------------------------------------------------
//
// https://github.com/type-challenges/type-challenges/blob/main/questions/26401-medium-json-schema-to-typescript/README.md
//
// Implement the generic type JSONSchema2TS which will return the TypeScript type corresponding to the given JSON schema.
//
// ------------------------------------------------------------------

import Type from 'typebox'

// ------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------
const { ResultA } = Type.Script(`

  type ResultA = {
    type: 'object',
    required: ['x', 'y', 'z'],
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      z: { type: 'number' }
    },
    additionalProperties: false,
  }
`)

type ResultA = Type.Static<typeof ResultA> // <--- meta schema

type ResultB = Type.Static<ResultA>        // <--- inferred schema

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
import * as Assert from '../common/assert.ts'
const Test = Assert.Context('Type.Challenge')

Test('26401-medium-json-schema-to-typescript', () => {
  Assert.IsExtendsMutual<ResultA, {
    type: "object";
    required: ["x", "y", "z"];
    properties: {
      x: {
        type: "number";
      };
      y: {
        type: "number";
      };
      z: {
        type: "number";
      };
    };
    additionalProperties: false;
  }>(true)

  Assert.IsExtendsMutual<ResultB, {
    x: number;
    y: number;
    z: number;
  }>(true)

  Assert.IsEqual(ResultA, Type.Script(`{
    type: "object";
    required: ["x", "y", "z"];
    properties: {
      x: {
        type: "number";
      };
      y: {
        type: "number";
      };
      z: {
        type: "number";
      };
    };
    
    additionalProperties: false;
  }`))

})


