(function () {
  var main = null;
  var modules = {
      "require": {
          factory: undefined,
          dependencies: [],
          exports: function (args, callback) { return require(args, callback); },
          resolved: true
      }
  };
  function define(id, dependencies, factory) {
      return main = modules[id] = {
          dependencies: dependencies,
          factory: factory,
          exports: {},
          resolved: false
      };
  }
  function resolve(definition) {
      if (definition.resolved === true)
          return;
      definition.resolved = true;
      var dependencies = definition.dependencies.map(function (id) {
          return (id === "exports")
              ? definition.exports
              : (function () {
                  if(modules[id] !== undefined) {
                    resolve(modules[id]);
                    return modules[id].exports;
                  } else return require(id)
              })();
      });
      definition.factory.apply(null, dependencies);
  }
  function collect() {
      Object.keys(modules).map(function (key) { return modules[key]; }).forEach(resolve);
      return (main !== null) 
        ? main.exports
        : undefined
  }

  define("src/reflect", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function reflect(value) {
          if (value === undefined)
              return "undefined";
          if (value === null)
              return "null";
          if (typeof value === "function")
              return "function";
          if (typeof value === "string")
              return "string";
          if (typeof value === "number")
              return "number";
          if (typeof value === "boolean")
              return "boolean";
          if (typeof value === "object") {
              if (value instanceof Array)
                  return "array";
              if (value instanceof Date)
                  return "date";
          }
          return "object";
      }
      exports.reflect = reflect;
  });
  define("src/spec", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function Any() {
          return {
              kind: "any"
          };
      }
      exports.Any = Any;
      function Undefined() {
          return {
              kind: "undefined"
          };
      }
      exports.Undefined = Undefined;
      function Null() {
          return {
              kind: "null"
          };
      }
      exports.Null = Null;
      function Literal(value) {
          if (typeof value !== "string" && typeof value !== "number")
              throw Error("Literal only allows for string or numeric values.");
          return {
              kind: "literal",
              value: value
          };
      }
      exports.Literal = Literal;
      function String() {
          return {
              kind: "string"
          };
      }
      exports.String = String;
      function Number() {
          return {
              kind: "number"
          };
      }
      exports.Number = Number;
      function Boolean() {
          return {
              kind: "boolean"
          };
      }
      exports.Boolean = Boolean;
      function Object(properties) {
          if (properties === void 0) { properties = {}; }
          return {
              kind: "object",
              properties: properties
          };
      }
      exports.Object = Object;
      function Array(type) {
          if (type === void 0) { type = Any(); }
          return {
              kind: "array",
              type: type
          };
      }
      exports.Array = Array;
      function Tuple() {
          var types = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              types[_i] = arguments[_i];
          }
          if (types.length === 0)
              throw Error("Type tuple requires at least one type.");
          return {
              kind: "tuple",
              types: types
          };
      }
      exports.Tuple = Tuple;
      function Union() {
          var types = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              types[_i] = arguments[_i];
          }
          if (types.length === 0)
              throw Error("Type union requires at least one type.");
          return {
              kind: "union",
              types: types
          };
      }
      exports.Union = Union;
  });
  define("src/check", ["require", "exports", "src/reflect"], function (require, exports, reflect_1) {
      "use strict";
      exports.__esModule = true;
      function Ok() {
          return {
              success: true,
              errors: []
          };
      }
      function FailBinding(binding, expect, actual) {
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Type '" + actual + "' is not assignable to type '" + expect + "'",
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function FailRequired(binding, expect, actual) {
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Property of type '" + expect + "' is required",
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function FailLengthMismatch(binding, expect, actual, expect_length, actual_length) {
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Property of type '" + actual + "' with a length " + actual_length + " is invalid. Expect length of " + expect_length,
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function FailUnexpected(binding, expect, actual) {
          var parts = binding.split(".");
          var property = parts[parts.length - 1];
          return {
              success: false,
              errors: [{
                      binding: binding,
                      message: "Property of type '" + actual + "' is not valid for this object",
                      expect: expect,
                      actual: actual
                  }]
          };
      }
      function check_Any(type, name, value) {
          return Ok();
      }
      function check_Undefined(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "undefined")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Null(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "null")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Literal(type, name, value) {
          var actual = reflect_1.reflect(value);
          var expect = reflect_1.reflect(type.value);
          if (actual !== expect) {
              return FailBinding(name, expect, actual);
          }
          else if (type.value !== value) {
              return FailBinding(name, type.value, actual);
          }
          else {
              return Ok();
          }
      }
      function check_String(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "string")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Number(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "number")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Boolean(type, name, value) {
          var kind = reflect_1.reflect(value);
          return (kind !== "boolean")
              ? FailBinding(name, type.kind, kind)
              : Ok();
      }
      function check_Object(type, name, value) {
          var kind = reflect_1.reflect(value);
          if (kind !== "object") {
              return FailBinding(name, type.kind, kind);
          }
          else {
              var results = new Array();
              var unexpected_queue = Object.keys(value).map(function (key) { return ({ key: key, value: value[key] }); });
              while (unexpected_queue.length > 0) {
                  var property = unexpected_queue.shift();
                  if (type.properties[property.key] === undefined) {
                      results.push(FailUnexpected(name + "." + property.key, "undefined", reflect_1.reflect(property.value)));
                  }
              }
              var expected_queue = Object.keys(type.properties).map(function (key) { return ({ key: key, type: type.properties[key] }); });
              while (expected_queue.length > 0) {
                  var property = expected_queue.shift();
                  if (value[property.key] === undefined && property.type.kind !== "undefined") {
                      results.push(FailRequired(name + "." + property.key, property.type.kind, "undefined"));
                  }
                  else {
                      results.push(check_All(property.type, name + "." + property.key, value[property.key]));
                  }
              }
              return results.reduce(function (acc, result) {
                  if (result.errors.length > 0)
                      acc.success = false;
                  for (var i = 0; i < result.errors.length; i++)
                      acc.errors.push(result.errors[i]);
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function check_Array(type, name, value) {
          var kind = reflect_1.reflect(value);
          if (kind !== "array") {
              return FailBinding(name, type.kind, kind);
          }
          else {
              var array = value;
              return array.map(function (item, index) { return check_All(type.type, name + ("[" + index + "]"), item); }).reduce(function (acc, result) {
                  if (result.errors.length > 0) {
                      acc.success = false;
                  }
                  for (var i = 0; i < result.errors.length; i++) {
                      acc.errors.push(result.errors[i]);
                  }
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function check_Tuple(type, name, value) {
          var kind = reflect_1.reflect(value);
          var array = value;
          if (kind !== "array") {
              return FailBinding("name", type.kind, kind);
          }
          else if (array.length !== type.types.length) {
              return FailLengthMismatch(name, type.kind, kind, type.types.length, array.length);
          }
          else {
              return array.map(function (item, index) {
                  return check_All(type.types[index], name + ("[" + index + "]"), item);
              }).reduce(function (acc, c) {
                  if (c.errors.length > 0) {
                      acc.success = false;
                  }
                  for (var i = 0; i < c.errors.length; i++) {
                      acc.errors.push(c.errors[i]);
                  }
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function check_Union(type, name, value) {
          var results = type.types.map(function (type) { return check_All(type, name, value); });
          var failed = results.reduce(function (acc, result) {
              if (result.success === false) {
                  acc += 1;
              }
              return acc;
          }, 0);
          if (failed === type.types.length) {
              var unionkind = type.types.map(function (type) {
                  return type.kind === "literal"
                      ? type.value
                      : type.kind;
              }).join(" | ");
              return FailBinding(name, unionkind, reflect_1.reflect(value));
          }
          else {
              return Ok();
          }
      }
      function check_All(type, name, value) {
          switch (type.kind) {
              case "any": return check_Any(type, name, value);
              case "undefined": return check_Undefined(type, name, value);
              case "null": return check_Null(type, name, value);
              case "literal": return check_Literal(type, name, value);
              case "string": return check_String(type, name, value);
              case "number": return check_Number(type, name, value);
              case "boolean": return check_Boolean(type, name, value);
              case "object": return check_Object(type, name, value);
              case "array": return check_Array(type, name, value);
              case "tuple": return check_Tuple(type, name, value);
              case "union": return check_Union(type, name, value);
              default: throw new Error("unknown type.");
          }
      }
      function check(type, value) {
          return check_All(type, "value", value);
      }
      exports.check = check;
  });
  define("src/schema", ["require", "exports", "src/reflect"], function (require, exports, reflect_2) {
      "use strict";
      exports.__esModule = true;
      function schema_Any(type) {
          return {};
      }
      function schema_Undefined(type) {
          return { "type": "null" };
      }
      function schema_Null(type) {
          return { "type": "null" };
      }
      function schema_Literal(type) {
          var kind = reflect_2.reflect(type.value);
          switch (kind) {
              case "string": return { "type": "string", "pattern": type.value };
              case "number": return { "type": "number", "minimum": type.value, "maximum": type.value };
          }
      }
      function schema_String(type) {
          return { "type": "string" };
      }
      function schema_Number(type) {
          return { "type": "number" };
      }
      function schema_Boolean(type) {
          return { "type": "boolean" };
      }
      function schema_Object(type) {
          var expanded = Object.keys(type.properties).map(function (key) { return ({
              key: key,
              type: type.properties[key]
          }); });
          var properties = expanded
              .reduce(function (acc, c) {
              acc[c.key] = schema_Base(c.type);
              return acc;
          }, {});
          var required = expanded
              .filter(function (property) { return property.type.kind !== "undefined"; })
              .map(function (property) { return property.key; });
          return {
              "type": "object",
              "properties": properties,
              "required": required
          };
      }
      function schema_Array(type) {
          return {
              "type": "array",
              "items": schema_Base(type.type)
          };
      }
      function schema_Tuple(type) {
          var items = type.types.map(function (type) { return schema_Base(type); });
          return {
              "type": "array",
              "items": items,
              "additionalItems": false,
              "minItems": items.length,
              "maxItems": items.length
          };
      }
      function schema_Union(type) {
          var types = type.types.map(function (type) { return schema_Base(type); });
          return {
              "anyOf": types
          };
      }
      function schema_Base(type) {
          switch (type.kind) {
              case "any": return schema_Any(type);
              case "undefined": return schema_Undefined(type);
              case "null": return schema_Null(type);
              case "literal": return schema_Literal(type);
              case "string": return schema_String(type);
              case "number": return schema_Number(type);
              case "boolean": return schema_Boolean(type);
              case "object": return schema_Object(type);
              case "array": return schema_Array(type);
              case "tuple": return schema_Tuple(type);
              case "union": return schema_Union(type);
              default: throw new Error("unknown type.");
          }
      }
      function schema(type) {
          var base = schema_Base(type);
          var schema = {
              "$schema": "http://json-schema.org/draft-04/schema#"
          };
          return Object.keys(base).reduce(function (acc, key) {
              acc[key] = base[key];
              return acc;
          }, schema);
      }
      exports.schema = schema;
  });
  define("src/compare", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function compare(left, right) {
          if (left.kind === "any" || right.kind === "any")
              return true;
          if (left.kind === "string" && right.kind === "string")
              return true;
          if (left.kind === "number" && right.kind === "number")
              return true;
          if (left.kind === "null" && right.kind === "null")
              return true;
          if (left.kind === "undefined" && right.kind === "undefined")
              return true;
          if (left.kind === "boolean" && right.kind === "boolean")
              return true;
          if (left.kind === "literal" && right.kind === "literal")
              return left.value === right.value;
          if (left.kind === "object" && right.kind === "object") {
              var object_left = left;
              var object_right = right;
              var keys = Object.keys(object_left.properties);
              if (keys.length !== Object.keys(object_right.properties).length) {
                  return false;
              }
              for (var i = 0; i < keys.length; i++) {
                  if (object_right.properties[keys[i]] === undefined) {
                      return false;
                  }
              }
              for (var i = 0; i < keys.length; i++) {
                  if (compare(object_left.properties[keys[i]], object_right.properties[keys[i]]) === false) {
                      return false;
                  }
              }
              return true;
          }
          if (left.kind === "array" && right.kind === "array") {
              var array_left = left;
              var array_right = right;
              return compare(array_left.type, array_right.type);
          }
          if (left.kind === "tuple" && right.kind === "tuple") {
              var tuple_left = left;
              var tuple_right = right;
              if (tuple_left.types.length !== tuple_right.types.length)
                  return false;
              for (var i = 0; i < tuple_left.types.length; i++) {
                  if (compare(tuple_left.types[i], tuple_right.types[i]) === false) {
                      return false;
                  }
              }
              return true;
          }
          if (left.kind === "union" && right.kind === "union") {
              var union_left = left;
              var union_right = right;
              if (union_left.types.length === 0 && union_right.types.length === 0) {
                  return true;
              }
          }
          if (left.kind === "union") {
              var union_left = left;
              for (var i = 0; i < union_left.types.length; i++) {
                  if (compare(union_left.types[i], right) === true) {
                      return true;
                  }
              }
          }
          if (right.kind === "union") {
              var union_right = right;
              for (var i = 0; i < union_right.types.length; i++) {
                  if (compare(union_right.types[i], left) === true) {
                      return true;
                  }
              }
          }
          return false;
      }
      exports.compare = compare;
  });
  define("src/infer", ["require", "exports", "src/reflect", "src/compare", "src/spec"], function (require, exports, reflect_3, compare_1, spec) {
      "use strict";
      exports.__esModule = true;
      function infer(value) {
          var kind = reflect_3.reflect(value);
          switch (kind) {
              case "undefined": return spec.Undefined();
              case "null": return spec.Null();
              case "string": return spec.String();
              case "number": return spec.Number();
              case "boolean": return spec.Boolean();
              case "array":
                  var array = value;
                  if (array.length === 0) {
                      return spec.Array(spec.Any());
                  }
                  else {
                      var types = array.reduce(function (acc, value, index) {
                          if (index > 64)
                              return acc;
                          var type = infer(value);
                          var found = false;
                          for (var i = 0; i < acc.length; i++) {
                              if (compare_1.compare(acc[i], type)) {
                                  found = true;
                                  break;
                              }
                          }
                          if (!found) {
                              acc.push(type);
                          }
                          return acc;
                      }, []);
                      return spec.Array((types.length > 1)
                          ? spec.Union.apply(this, types)
                          : types[0]);
                  }
              case "object":
                  return spec.Object(Object.keys(value)
                      .map(function (key) { return ({
                      key: key,
                      type: infer(value[key])
                  }); }).reduce(function (acc, value) {
                      acc[value.key] = value.type;
                      return acc;
                  }, {}));
              default:
                  throw new Error("unsupported type '" + kind + "'");
          }
      }
      exports.infer = infer;
  });
  define("src/generate", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function generate_Any(type) {
          return {};
      }
      function generate_Null(type) {
          return null;
      }
      function generate_Undefined(type) {
          return undefined;
      }
      function generate_Object(type) {
          return Object.keys(type.properties)
              .map(function (key) { return ({ key: key, value: generate(type.properties[key]) }); })
              .reduce(function (acc, value) {
              acc[value.key] = value.value;
              return acc;
          }, {});
      }
      function generate_Array(t) {
          return [
              generate(t.type),
              generate(t.type),
              generate(t.type)
          ];
      }
      function generate_Tuple(t) {
          return t.types.map(function (type) { return generate(type); });
      }
      function generate_Number(t) {
          return 0;
      }
      function generate_String(t) {
          return "string";
      }
      function generate_Boolean(t) {
          return true;
      }
      function generate_Union(t) {
          if (t.types.length === 0) {
              return {};
          }
          else {
              return generate(t.types[0]);
          }
      }
      function generate_Literal(t) {
          return t.value;
      }
      function generate(type) {
          switch (type.kind) {
              case "any": return generate_Any(type);
              case "null": return generate_Null(type);
              case "undefined": return generate_Undefined(type);
              case "object": return generate_Object(type);
              case "array": return generate_Array(type);
              case "tuple": return generate_Tuple(type);
              case "number": return generate_Number(type);
              case "string": return generate_String(type);
              case "boolean": return generate_Boolean(type);
              case "union": return generate_Union(type);
              case "literal": return generate_Literal(type);
              default: throw Error("unknown type.");
          }
      }
      exports.generate = generate;
  });
  define("src/index", ["require", "exports", "src/reflect", "src/check", "src/schema", "src/infer", "src/compare", "src/generate", "src/spec"], function (require, exports, reflect_4, check_1, schema_1, infer_1, compare_2, generate_1, spec_1) {
      "use strict";
      exports.__esModule = true;
      exports.reflect = reflect_4.reflect;
      exports.check = check_1.check;
      exports.schema = schema_1.schema;
      exports.infer = infer_1.infer;
      exports.compare = compare_2.compare;
      exports.generate = generate_1.generate;
      exports.Any = spec_1.Any;
      exports.Undefined = spec_1.Undefined;
      exports.Null = spec_1.Null;
      exports.Literal = spec_1.Literal;
      exports.String = spec_1.String;
      exports.Number = spec_1.Number;
      exports.Boolean = spec_1.Boolean;
      exports.Object = spec_1.Object;
      exports.Array = spec_1.Array;
      exports.Tuple = spec_1.Tuple;
      exports.Union = spec_1.Union;
  });
  define("test/tests/spec", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object({}),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          k: typebox.Union(typebox.Any()),
          l: typebox.Literal(10)
      });
      describe("spec", function () {
          it("Any should conform to specification.", function () {
              assert.deepEqual(typebox.Any(), {
                  kind: "any"
              });
          });
          it("Null should conform to specification.", function () {
              assert.deepEqual(typebox.Null(), {
                  kind: "null"
              });
          });
          it("Undefined should conform to specification.", function () {
              assert.deepEqual(typebox.Undefined(), {
                  kind: "undefined"
              });
          });
          it("Object should conform to specification.", function () {
              assert.deepEqual(complex, {
                  "kind": "object",
                  "properties": {
                      "a": { "kind": "any" },
                      "b": { "kind": "null" },
                      "c": { "kind": "undefined" },
                      "d": { "kind": "object", "properties": {} },
                      "e": { "kind": "array", "type": { "kind": "any" } },
                      "f": { "kind": "tuple", "types": [{ "kind": "any" }] },
                      "g": { "kind": "number" },
                      "h": { "kind": "string" },
                      "i": { "kind": "boolean" },
                      "k": { "kind": "union", "types": [{ "kind": "any" }] },
                      "l": { "kind": "literal", "value": 10 }
                  }
              });
          });
          it("Array should conform to specification.", function () {
              assert.deepEqual(typebox.Array(typebox.Any()), {
                  kind: "array",
                  type: { kind: "any" }
              });
          });
          it("Array should default to type 'any' with zero arguments", function () {
              assert.deepEqual(typebox.Array(typebox.Any()), {
                  kind: "array",
                  type: { kind: "any" }
              });
          });
          it("Tuple should conform to specification.", function () {
              assert.deepEqual(typebox.Tuple(typebox.Any()), {
                  kind: "tuple",
                  types: [{ kind: "any" }]
              });
          });
          it("Tuple should throw on no arguments.", function () {
              var test = typebox.Tuple;
              assert.throws(function () { return test(); });
          });
          it("Number should conform to specification.", function () {
              assert.deepEqual(typebox.Number(), {
                  kind: "number"
              });
          });
          it("String should conform to specification.", function () {
              assert.deepEqual(typebox.String(), {
                  kind: "string"
              });
          });
          it("Boolean should conform to specification.", function () {
              assert.deepEqual(typebox.Boolean(), {
                  kind: "boolean"
              });
          });
          it("Literal should conform to specification.", function () {
              assert.deepEqual(typebox.Literal(1), {
                  kind: "literal",
                  value: 1
              });
          });
          it("Literal should throw on non string or numeric values.", function () {
              var test = typebox.Literal;
              assert.throws(function () { return test({}); });
              assert.throws(function () { return test(true); });
              assert.throws(function () { return test(new Date()); });
              assert.throws(function () { return test([]); });
          });
          it("Union should conform to specification.", function () {
              assert.deepEqual(typebox.Union(typebox.Any()), {
                  kind: "union",
                  types: [{ kind: "any" }]
              });
          });
          it("Union should throw on no arguments.", function () {
              var test = typebox.Union;
              assert.throws(function () { return test(); });
          });
      });
  });
  define("test/tests/compare", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object({}),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          j: typebox.Union(typebox.Any()),
          k: typebox.Literal(10)
      });
      var hyper_complex = typebox.Object({
          a: typebox.Array(typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex))),
          b: typebox.Tuple(typebox.Null(), complex, complex, typebox.Null(), typebox.Array(typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)))),
          c: typebox.Union(typebox.Any(), typebox.Any(), typebox.Any(), typebox.Array(typebox.Any())),
          d: typebox.Array(complex),
          e: typebox.Array(typebox.Array(typebox.Array(typebox.Array(typebox.Array(complex)))))
      });
      describe("compare", function () {
          describe("Any", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Any()), true); });
              it("should compare with Null", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Null()), true); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Undefined()), true); });
              it("should compare with Object", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Object()), true); });
              it("should compare with Array", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Array()), true); });
              it("should compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Tuple(typebox.Any())), true); });
              it("should compare with Number", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Number()), true); });
              it("should compare with String", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.String()), true); });
              it("should compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Boolean()), true); });
              it("should compare with Union", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Union(typebox.String())), true); });
          });
          describe("Null", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Any()), true); });
              it("should compare with Null", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Null()), true); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Union(typebox.String())), false); });
          });
          describe("Undefined", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Undefined()), true); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Union(typebox.String())), false); });
          });
          describe("Object", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Undefined()), false); });
              it("should compare with Object", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Object()), true); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Union(typebox.String())), false); });
              it("should compare with Complex", function () { return assert.equal(typebox.compare(complex, complex), true); }),
                  it("should compare with Hyper Complex", function () { return assert.equal(typebox.compare(hyper_complex, hyper_complex), true); });
          });
          describe("Array", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Object()), false); });
              it("should compare with Array", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Array()), true); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Union(typebox.String())), false); });
              it("should compare with Array<Complex>", function () { return assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(complex)), true); });
              it("should not compare with Array<Complex> to Array<Number>", function () { return assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(typebox.Number())), false); });
              it("should compare with Array<Complex> to Array<Any>", function () { return assert.equal(typebox.compare(typebox.Array(complex), typebox.Array()), true); });
          });
          describe("Tuple", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Array()), false); });
              it("should compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Tuple(typebox.Any())), true); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Union(typebox.String())), false); });
              it("should not compare with tuple of different length", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Number()), typebox.Tuple(typebox.Number(), typebox.Number())), false); });
              it("should compare with tuple of same length", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Number(), typebox.Number()), typebox.Tuple(typebox.Number(), typebox.Number())), true); });
              it("should compare with tuple of same length of Any", function () { return assert.equal(typebox.compare(typebox.Tuple(typebox.Number(), typebox.Number()), typebox.Tuple(typebox.Any(), typebox.Any())), true); });
          });
          describe("Number", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Tuple(typebox.Any())), false); });
              it("should compare with Number", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Number()), true); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Union(typebox.String())), false); });
          });
          describe("String", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Number()), false); });
              it("should compare with String", function () { return assert.equal(typebox.compare(typebox.String(), typebox.String()), true); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Boolean()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Union(typebox.Boolean())), false); });
          });
          describe("Boolean", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.String()), false); });
              it("should compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Boolean()), true); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Union(typebox.String())), false); });
          });
          describe("Union", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Tuple(typebox.Any())), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Boolean()), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Boolean()), false); });
              it("should compare with when both Unions are empty.", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Union(typebox.Any())), true); });
              it("should compare with compatible types #1", function () { return assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(complex)), true); });
              it("should compare with compatible types #2", function () { return assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(typebox.Number(), complex)), true); });
              it("should compare with compatible types #3", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Union(typebox.Number(), complex)), true); });
              it("should compare with compatible types #4", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Array(complex)), typebox.Union(typebox.Array(typebox.Any()))), true); });
          });
      });
  });
  define("test/tests/generate", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object({}),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          k: typebox.Union(typebox.Any()),
          l: typebox.Literal(10)
      });
      describe("generate", function () {
          it("Any should generate a empty object", function () {
              var type = typebox.Any();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "object");
          });
          it("Null should generate a null", function () {
              var type = typebox.Null();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "null");
          });
          it("Undefined should generate a undefined", function () {
              var type = typebox.Undefined();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "undefined");
          });
          it("Object should generate a object", function () {
              var type = typebox.Object();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "object");
          });
          it("Array should generate a array", function () {
              var type = typebox.Array();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "array");
          });
          it("Tuple should generate a array", function () {
              var type = typebox.Tuple(typebox.String());
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "array");
          });
          it("Number should generate a number", function () {
              var type = typebox.Number();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "number");
          });
          it("String should generate a string", function () {
              var type = typebox.String();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "string");
          });
          it("Boolean should generate a boolean", function () {
              var type = typebox.Boolean();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "boolean");
          });
          it("Boolean should generate a boolean", function () {
              var type = typebox.Boolean();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "boolean");
          });
          it("Union should generate the first type", function () {
              var type = typebox.Union(typebox.Number());
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "number");
          });
          it("Complex should generate a object that validates", function () {
              var value = typebox.generate(complex);
              var result = typebox.check(complex, value);
              assert.equal(result.success, true);
          });
      });
  });
  define("test/tests/reflect", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      describe("reflect", function () {
          it("should reflect a undefined", function () { return assert.equal(typebox.reflect(undefined), "undefined"); });
          it("should reflect a null", function () { return assert.equal(typebox.reflect(null), "null"); });
          it("should reflect a function #1", function () { return assert.equal(typebox.reflect(function () { }), "function"); });
          it("should reflect a function #2", function () { return assert.equal(typebox.reflect(function () { }), "function"); });
          it("should reflect a string", function () { return assert.equal(typebox.reflect("hello"), "string"); });
          it("should reflect a number #1", function () { return assert.equal(typebox.reflect(1), "number"); });
          it("should reflect a number #2", function () { return assert.equal(typebox.reflect(NaN), "number"); });
          it("should reflect a boolean", function () { return assert.equal(typebox.reflect(true), "boolean"); });
          it("should reflect a date", function () { return assert.equal(typebox.reflect(new Date()), "date"); });
          it("should reflect an array", function () { return assert.equal(typebox.reflect([]), "array"); });
          it("should reflect an object", function () { return assert.equal(typebox.reflect({}), "object"); });
      });
  });
  define("test/tests/infer", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      describe("infer", function () {
          describe("Object", function () {
              it("should infer a object #1", function () {
                  var type = typebox.infer({});
                  assert.equal(type.kind, "object");
              });
              it("should infer a object #2", function () {
                  var type = typebox.infer({
                      a: "hello",
                      b: 123,
                      c: true,
                      d: [],
                      e: undefined,
                      f: null,
                      g: {}
                  });
                  assert.equal(type.kind, "object");
                  var t = type;
                  assert.equal(t.properties['a'].kind, "string");
                  assert.equal(t.properties['b'].kind, "number");
                  assert.equal(t.properties['c'].kind, "boolean");
                  assert.equal(t.properties['d'].kind, "array");
                  assert.equal(t.properties['e'].kind, "undefined");
                  assert.equal(t.properties['f'].kind, "null");
                  assert.equal(t.properties['g'].kind, "object");
              });
          });
          describe("Array", function () {
              it("an empty array should infer Array<Any>", function () {
                  var type = typebox.infer([]);
                  assert.equal(type.kind, "array");
                  var t = type;
                  assert.equal(t.type.kind, "any");
              });
              it("string elements should infer Array<String>", function () {
                  var type = typebox.infer(["hello"]);
                  assert.equal(type.kind, "array");
                  var t = type;
                  assert.equal(t.type.kind, "string");
              });
              it("numeric elements should infer Array<Number>", function () {
                  var type = typebox.infer([1]);
                  assert.equal(type.kind, "array");
                  var t = type;
                  assert.equal(t.type.kind, "number");
              });
              it("a mixed array should infer a union Array<String | Number>", function () {
                  var type = typebox.infer([1, "hello"]);
                  assert.equal(type.kind, "array");
                  var t = type;
                  assert.equal(t.type.kind, "union");
                  var u = t.type;
                  assert.equal(u.types[0].kind, "number");
                  assert.equal(u.types[1].kind, "string");
              });
          });
          describe("String", function () {
              it("should infer a string", function () {
                  var type = typebox.infer("hello world");
                  assert.equal(type.kind, "string");
              });
          });
          describe("Number", function () {
              it("should infer a number #1", function () {
                  var type = typebox.infer(1);
                  assert.equal(type.kind, "number");
              });
              it("should infer a number #2", function () {
                  var type = typebox.infer(NaN);
                  assert.equal(type.kind, "number");
              });
          });
          describe("Boolean", function () {
              it("should infer a boolean #1", function () {
                  var type = typebox.infer(true);
                  assert.equal(type.kind, "boolean");
              });
              it("should infer a boolean #2", function () {
                  var type = typebox.infer(false);
                  assert.equal(type.kind, "boolean");
              });
          });
          describe("Valid", function () {
              it("should validate against the original value #1", function () {
                  var value = {
                      a: "string",
                      b: 1,
                      c: true,
                      d: false,
                      e: [],
                      f: [{ a: 1 }],
                      g: null,
                      h: undefined,
                      i: {}
                  };
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #2", function () {
                  var value = 1;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #3", function () {
                  var value = "hello";
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #4", function () {
                  var value = [{
                          a: "string",
                          b: 1,
                          c: true,
                          d: false,
                          e: [],
                          f: [{ a: 1 }],
                          g: null,
                          h: undefined,
                          i: {}
                      }];
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #5", function () {
                  var value = true;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #6", function () {
                  var value = false;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #7", function () {
                  var value = {};
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #8", function () {
                  var value = [];
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #9", function () {
                  var value = undefined;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #10", function () {
                  var value = undefined;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #11", function () {
                  var value = null;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
              it("should validate against the original value #12", function () {
                  var value = NaN;
                  var type = typebox.infer(value);
                  var result = typebox.check(type, value);
                  assert.equal(result.success, true);
              });
          });
      });
  });
  define("test/tests/check", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object({}),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          k: typebox.Union(typebox.Any()),
          l: typebox.Literal(10)
      });
      var hyper = typebox.Object({
          a: typebox.Array(typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex))),
          b: typebox.Tuple(typebox.Null(), complex, complex, typebox.Null(), typebox.Array(typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)))),
          c: typebox.Union(typebox.Any(), typebox.Any(), typebox.Any(), typebox.Array()),
          d: typebox.Array(complex),
          e: typebox.Array(typebox.Array(typebox.Array(typebox.Array(typebox.Array(complex)))))
      });
      var complex_instance = typebox.generate(complex);
      var hyper_instance = typebox.generate(hyper);
      describe("check", function () {
          describe("Any", function () {
              it("should validate a null", function () { return assert.equal(typebox.check(typebox.Any(), null).success, true); });
              it("should validate a undefined", function () { return assert.equal(typebox.check(typebox.Any(), undefined).success, true); });
              it("should validate a object", function () { return assert.equal(typebox.check(typebox.Any(), {}).success, true); });
              it("should validate a array", function () { return assert.equal(typebox.check(typebox.Any(), []).success, true); });
              it("should validate a number", function () { return assert.equal(typebox.check(typebox.Any(), 1).success, true); });
              it("should validate a string", function () { return assert.equal(typebox.check(typebox.Any(), "hello").success, true); });
              it("should validate a boolean", function () { return assert.equal(typebox.check(typebox.Any(), true).success, true); });
          });
          describe("Null", function () {
              it("should validate a null", function () { return assert.equal(typebox.check(typebox.Null(), null).success, true); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Null(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Null(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Null(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Null(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Null(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Null(), true).success, false); });
          });
          describe("Undefined", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Undefined(), null).success, false); });
              it("should validate a undefined", function () { return assert.equal(typebox.check(typebox.Undefined(), undefined).success, true); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Undefined(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Undefined(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Undefined(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Undefined(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Undefined(), true).success, false); });
          });
          describe("Object", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Object(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Object(), undefined).success, false); });
              it("should validate a object", function () { return assert.equal(typebox.check(typebox.Object(), {}).success, true); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Object(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Object(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Object(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Object(), true).success, false); });
              it("should not validate for missing properties", function () { return assert.equal(typebox.check(typebox.Object({ name: typebox.String() }), {}).success, false); });
              it("should not validate for extra properties", function () { return assert.equal(typebox.check(typebox.Object({ name: typebox.String() }), { name: "dave", age: 37 }).success, false); });
          });
          describe("Array", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Array(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Array(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Array(), {}).success, false); });
              it("should validate a array", function () { return assert.equal(typebox.check(typebox.Array(), []).success, true); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Array(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Array(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Array(), true).success, false); });
              it("should validate a complex array", function () { return assert.equal(typebox.check(typebox.Array(complex), [complex_instance]).success, true); });
              it("should not validate a hyper array", function () { return assert.equal(typebox.check(typebox.Array(complex), [hyper_instance]).success, false); });
              it("should not validate a mixed array", function () { return assert.equal(typebox.check(typebox.Array(complex), [complex_instance, complex_instance, complex_instance, 1]).success, false); });
          });
          describe("Tuple", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), true).success, false); });
              it("should not validate a [string, number]", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), ["hello", 1]).success, false); });
              it("should not validate a [complex, hyper]", function () { return assert.equal(typebox.check(typebox.Tuple(hyper, complex), [complex_instance, hyper_instance]).success, false); });
              it("should not validate length mismatch", function () { return assert.equal(typebox.check(typebox.Tuple(hyper, complex), [hyper_instance, complex_instance, 1]).success, false); });
              it("should validate a [number, string]", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), [1, "hello"]).success, true); });
              it("should validate a [hyper, complex]", function () { return assert.equal(typebox.check(typebox.Tuple(hyper, complex), [hyper_instance, complex_instance]).success, true); });
          });
          describe("Number", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Number(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Number(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Number(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Number(), []).success, false); });
              it("should validate a number", function () { return assert.equal(typebox.check(typebox.Number(), 1).success, true); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Number(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Number(), true).success, false); });
          });
          describe("String", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.String(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.String(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.String(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.String(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.String(), 1).success, false); });
              it("should validate a string", function () { return assert.equal(typebox.check(typebox.String(), "hello").success, true); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.String(), true).success, false); });
          });
          describe("Boolean", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Boolean(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Boolean(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Boolean(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Boolean(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Boolean(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Boolean(), "hello").success, false); });
              it("should validate a boolean", function () { return assert.equal(typebox.check(typebox.Boolean(), true).success, true); });
          });
          describe("Union(complex, hyper, number, string)", function () {
              it("should validate complex", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), complex_instance).success, true); });
              it("should validate hyper", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), hyper_instance).success, true); });
              it("should validate number", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), 1).success, true); });
              it("should validate string", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), "hello").success, true); });
              it("should not validate empty object", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), {}).success, false); });
              it("should not validate boolean", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), false).success, false); });
              it("should not validate array", function () { return assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), []).success, false); });
          });
          describe("Union(complex, any)", function () {
              it("should validate a null", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), null).success, true); });
              it("should validate a undefined", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), undefined).success, true); });
              it("should validate a object", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), {}).success, true); });
              it("should validate a array", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), []).success, true); });
              it("should validate a number", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), 1).success, true); });
              it("should validate a string", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), "hello").success, true); });
              it("should validate a boolean", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), true).success, true); });
          });
      });
  });
  define("test/index", ["require", "exports", "test/tests/spec", "test/tests/compare", "test/tests/generate", "test/tests/reflect", "test/tests/infer", "test/tests/check"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
  });
  
  return collect(); 
})();