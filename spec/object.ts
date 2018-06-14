import { Static, Type } from "../src/typebox"
import { ok, fail }     from "./validate"

const a_number  = () => 1
const a_string  = () => "s"
const a_boolean = () => true
const a_object  = () => ({})
const a_array   = () => []

const type = Type.Object({
  a_number:                    Type.Number(),
  a_string:                    Type.String(),
  a_boolean:                   Type.Boolean(),
  a_object:                    Type.Object({}),
  a_array:                     Type.Array(Type.Any()),
  a_number_enum:               Type.Enum(1, 2, 3),
  a_string_enum:               Type.Enum("yes", "no"),
  a_boolean_enum:              Type.Enum(true, false),
  // literal
  a_number_literal:            Type.Literal(1),
  a_string_literal:            Type.Literal("string"),
  a_boolean_literal:           Type.Literal(false),
  // optional
  a_optional_number:           Type.Optional(Type.Number()),
  a_optional_string:           Type.Optional(Type.String()),
  a_optional_boolean:          Type.Optional(Type.Boolean()),
  a_optional_object:           Type.Optional(Type.Object()),
  a_optional_array:            Type.Optional(Type.Array(Type.Any())),
  a_optional_number_enum:      Type.Optional(Type.Enum(1, 2, 3)),
  a_optional_string_enum:      Type.Optional(Type.Enum("yes", "no")),
  a_optional_boolean_enum:     Type.Optional(Type.Enum(true, false)),
  a_optional_number_literal:   Type.Optional(Type.Literal(1)),
  a_optional_string_literal:   Type.Optional(Type.Literal("string")),
  a_optional_boolean_literal:  Type.Optional(Type.Literal(false)),
})

describe("Object", () => {
  it("should validate object (without optional)", () => {
    ok(type, {
      a_string:          a_string(),
      a_number:          a_number(),
      a_boolean:         a_boolean(),
      a_object:          a_object(),
      a_array:           a_array(),
      a_number_enum:     2,
      a_string_enum:     "yes",
      a_boolean_enum:    false,
      a_number_literal:  1,
      a_string_literal:  "string",
      a_boolean_literal: false,
    })
  })
  it("should validate object (with optional)", () => {
    ok(type, {
      a_string:          a_string(),
      a_number:          a_number(),
      a_boolean:         a_boolean(),
      a_object:          a_object(),
      a_array:           a_array(),
      a_number_enum:     2,
      a_string_enum:     "yes",
      a_boolean_enum:    false,
      a_number_literal:  1,
      a_string_literal:  "string",
      a_boolean_literal: false,

      a_optional_string:          a_string(),
      a_optional_number:          a_number(),
      a_optional_boolean:         a_boolean(),
      a_optional_object:          a_object(),
      a_optional_array:           a_array(),
      a_optional_number_enum:     2,
      a_optional_string_enum:     "yes",
      a_optional_boolean_enum:    false,
      a_optional_number_literal:  1,
      a_optional_string_literal:  "string",
      a_optional_boolean_literal: false,
    })
  })
})
