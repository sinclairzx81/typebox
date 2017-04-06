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
      exports.reflect = function (value) {
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
      };
  });
  define("src/spec", ["require", "exports", "src/reflect"], function (require, exports, reflect_1) {
      "use strict";
      exports.__esModule = true;
      function Any() {
          return {
              type: "any"
          };
      }
      exports.Any = Any;
      function Null() {
          return {
              type: "null"
          };
      }
      exports.Null = Null;
      function Undefined() {
          return {
              type: "undefined"
          };
      }
      exports.Undefined = Undefined;
      function Object(properties) {
          if (properties === void 0) { properties = {}; }
          return {
              type: "object",
              properties: properties
          };
      }
      exports.Object = Object;
      function Array(items) {
          if (items === void 0) { items = Any(); }
          return {
              type: "array",
              items: items || { type: "any" }
          };
      }
      exports.Array = Array;
      function Tuple() {
          var items = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
          }
          return {
              type: "tuple",
              items: items
          };
      }
      exports.Tuple = Tuple;
      function Number() {
          return {
              type: "number"
          };
      }
      exports.Number = Number;
      function String() {
          return {
              type: "string"
          };
      }
      exports.String = String;
      function Boolean() {
          return {
              type: "boolean"
          };
      }
      exports.Boolean = Boolean;
      function Date() {
          return {
              type: "date"
          };
      }
      exports.Date = Date;
      function Function() {
          return {
              type: "function"
          };
      }
      exports.Function = Function;
      function Union() {
          var items = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
          }
          return {
              type: "union",
              items: items
          };
      }
      exports.Union = Union;
      function Literal(value) {
          var typename = reflect_1.reflect(value);
          if (typename !== "string" && typename !== "number") {
              throw Error("literal can only access string or numeric values.");
          }
          return {
              type: "literal",
              value: value
          };
      }
      exports.Literal = Literal;
  });
  define("src/compare", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function compare(left, right) {
          if (left.type === "any" || right.type === "any")
              return true;
          if (left.type === "string" && right.type === "string")
              return true;
          if (left.type === "number" && right.type === "number")
              return true;
          if (left.type === "null" && right.type === "null")
              return true;
          if (left.type === "undefined" && right.type === "undefined")
              return true;
          if (left.type === "boolean" && right.type === "boolean")
              return true;
          if (left.type === "date" && right.type === "date")
              return true;
          if (left.type === "function" && right.type === "function")
              return true;
          if (left.type === "literal" && right.type === "literal")
              return left.value === right.value;
          if (left.type === "object" && right.type === "object") {
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
          if (left.type === "array" && right.type === "array") {
              var array_left = left;
              var array_right = right;
              return compare(array_left.items, array_right.items);
          }
          if (left.type === "tuple" && right.type === "tuple") {
              var tuple_left = left;
              var tuple_right = right;
              if (tuple_left.items.length !== tuple_right.items.length)
                  return false;
              for (var i = 0; i < tuple_left.items.length; i++) {
                  if (compare(tuple_left.items[i], tuple_right.items[i]) === false) {
                      return false;
                  }
              }
              return true;
          }
          if (left.type === "union" && right.type === "union") {
              var union_left = left;
              var union_right = right;
              if (union_left.items.length === 0 && union_right.items.length === 0) {
                  return true;
              }
          }
          if (left.type === "union") {
              var union_left = left;
              for (var i = 0; i < union_left.items.length; i++) {
                  if (compare(union_left.items[i], right) === true) {
                      return true;
                  }
              }
          }
          if (right.type === "union") {
              var union_right = right;
              for (var i = 0; i < union_right.items.length; i++) {
                  if (compare(union_right.items[i], left) === true) {
                      return true;
                  }
              }
          }
          return false;
      }
      exports.compare = compare;
  });
  define("src/infer", ["require", "exports", "src/reflect", "src/compare", "src/spec"], function (require, exports, reflect_2, compare_1, spec_1) {
      "use strict";
      exports.__esModule = true;
      function infer(value) {
          var typename = reflect_2.reflect(value);
          switch (typename) {
              case "undefined": return spec_1.Undefined();
              case "null": return spec_1.Null();
              case "function": return spec_1.Function();
              case "string": return spec_1.String();
              case "number": return spec_1.Number();
              case "boolean": return spec_1.Boolean();
              case "date": return spec_1.Date();
              case "array":
                  var array = value;
                  if (array.length === 0) {
                      return spec_1.Array(spec_1.Any());
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
                      return spec_1.Array((types.length > 1)
                          ? spec_1.Union.apply(this, types)
                          : types[0]);
                  }
              case "object":
                  return spec_1.Object(Object.keys(value)
                      .map(function (key) { return ({
                      key: key,
                      type: infer(value[key])
                  }); }).reduce(function (acc, value) {
                      acc[value.key] = value.type;
                      return acc;
                  }, {}));
          }
      }
      exports.infer = infer;
  });
  define("src/generate", ["require", "exports"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
      function generate_Any(t) {
          return {};
      }
      function generate_Null(t) {
          return null;
      }
      function generate_Undefined(t) {
          return undefined;
      }
      function generate_Object(t) {
          return Object.keys(t.properties)
              .map(function (key) { return ({ key: key, value: generate(t.properties[key]) }); })
              .reduce(function (acc, value) {
              acc[value.key] = value.value;
              return acc;
          }, {});
      }
      function generate_Array(t) {
          return [
              generate(t.items),
              generate(t.items),
              generate(t.items)
          ];
      }
      function generate_Tuple(t) {
          return t.items.map(function (type) { return generate(type); });
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
      function generate_Date(t) {
          return new Date();
      }
      function generate_Function(t) {
          return function () { };
      }
      function generate_Union(t) {
          if (t.items.length === 0) {
              return {};
          }
          else {
              return generate(t.items[0]);
          }
      }
      function generate_Literal(t) {
          return t.value;
      }
      function generate(t) {
          switch (t.type) {
              case "any": return generate_Any(t);
              case "null": return generate_Null(t);
              case "undefined": return generate_Undefined(t);
              case "object": return generate_Object(t);
              case "array": return generate_Array(t);
              case "tuple": return generate_Tuple(t);
              case "number": return generate_Number(t);
              case "string": return generate_String(t);
              case "boolean": return generate_Boolean(t);
              case "date": return generate_Date(t);
              case "function": return generate_Function(t);
              case "union": return generate_Union(t);
              case "literal": return generate_Literal(t);
              default: throw Error("unknown type.");
          }
      }
      exports.generate = generate;
  });
  define("src/check", ["require", "exports", "src/reflect"], function (require, exports, reflect_3) {
      "use strict";
      exports.__esModule = true;
      function validate_Null(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "null") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not null",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Undefined(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "undefined") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not undefined",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Object(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "object") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not an object",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              var results = [];
              var unexpected_queue = Object.keys(value).map(function (key) { return ({ key: key, value: value[key] }); });
              while (unexpected_queue.length > 0) {
                  var property = unexpected_queue.shift();
                  if (t.properties[property.key] === undefined) {
                      results.push({
                          success: false,
                          errors: [{
                                  message: (t.properties[property.key], name + "." + property.key) + " unexpected.",
                                  expect: 'undefined',
                                  actual: reflect_3.reflect(property.value)
                              }]
                      });
                  }
              }
              var expected_queue = Object.keys(t.properties).map(function (key) { return ({ key: key, type: t.properties[key] }); });
              while (expected_queue.length > 0) {
                  var descriptor = expected_queue.shift();
                  if (value[descriptor.key] === undefined && descriptor.type.type !== "undefined") {
                      results.push({
                          success: false,
                          errors: [{
                                  message: (t.properties[descriptor.key], name + "." + descriptor.key) + " not found.",
                                  expect: "" + descriptor.type.type,
                                  actual: 'undefined'
                              }]
                      });
                  }
                  else {
                      results.push(validate_Any(descriptor.type, name + "." + descriptor.key, value[descriptor.key]));
                  }
              }
              return results.reduce(function (acc, c) {
                  if (c.errors.length > 0)
                      acc.success = false;
                  for (var i = 0; i < c.errors.length; i++)
                      acc.errors.push(c.errors[i]);
                  return acc;
              }, { success: true, errors: [] });
          }
      }
      function validate_Array(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "array") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not an array",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return value.map(function (item, index) {
                  return validate_Any(t.items, name + ("[" + index + "]"), item);
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
      function validate_Tuple(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "array") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not an tuple",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else if (value.length !== t.items.length) {
              return {
                  success: false,
                  errors: [{
                          message: name + " tuple length mismatch",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return value.map(function (item, index) {
                  return validate_Any(t.items[index], name + ("[" + index + "]"), item);
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
      function validate_Number(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "number") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not a number",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_String(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "string") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not a string",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Boolean(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "boolean") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not a boolean",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Date(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "date") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not a date",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Function(t, name, value) {
          var typename = reflect_3.reflect(value);
          if (typename !== "function") {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not a function",
                          expect: t.type,
                          actual: typename
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Union(t, name, value) {
          var results = t.items.map(function (type) { return validate_Any(type, name, value); });
          var failed = results.reduce(function (acc, c) {
              if (c.success === false) {
                  acc += 1;
              }
              return acc;
          }, 0);
          if (failed === t.items.length) {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not " + t.items.map(function (n) { return (n.type === "literal") ? n.value : n.type; }).join(" or ") + ".",
                          expect: "" + t.items.map(function (n) { return n.type; }).join(" | "),
                          actual: reflect_3.reflect(value)
                      }]
              };
          }
          else {
              return { success: true, errors: [] };
          }
      }
      function validate_Literal(t, name, value) {
          var actual = reflect_3.reflect(value);
          var expect = reflect_3.reflect(t.value);
          if (actual !== expect) {
              return {
                  success: false,
                  errors: [{
                          message: name + " is not a " + expect,
                          expect: expect,
                          actual: actual
                      }]
              };
          }
          else if (t.value !== value) {
              return {
                  success: false,
                  errors: [{
                          message: name + " does not equal " + t.value,
                          expect: expect,
                          actual: actual
                      }]
              };
          }
          else {
              return {
                  success: true,
                  errors: []
              };
          }
      }
      function validate_Any(t, name, value) {
          switch (t.type) {
              case "any": return { success: true, errors: [] };
              case "null": return validate_Null(t, name, value);
              case "undefined": return validate_Undefined(t, name, value);
              case "object": return validate_Object(t, name, value);
              case "array": return validate_Array(t, name, value);
              case "tuple": return validate_Tuple(t, name, value);
              case "number": return validate_Number(t, name, value);
              case "string": return validate_String(t, name, value);
              case "boolean": return validate_Boolean(t, name, value);
              case "date": return validate_Date(t, name, value);
              case "function": return validate_Function(t, name, value);
              case "union": return validate_Union(t, name, value);
              case "literal": return validate_Literal(t, name, value);
              default: throw Error("unknown type.");
          }
      }
      function check(t, value) {
          return validate_Any(t, "value", value);
      }
      exports.check = check;
  });
  define("src/index", ["require", "exports", "src/reflect", "src/infer", "src/compare", "src/generate", "src/check", "src/spec"], function (require, exports, reflect_4, infer_1, compare_2, generate_1, check_1, spec_2) {
      "use strict";
      exports.__esModule = true;
      exports.reflect = reflect_4.reflect;
      exports.infer = infer_1.infer;
      exports.compare = compare_2.compare;
      exports.generate = generate_1.generate;
      exports.check = check_1.check;
      exports.Any = spec_2.Any;
      exports.Null = spec_2.Null;
      exports.Undefined = spec_2.Undefined;
      exports.Object = spec_2.Object;
      exports.Array = spec_2.Array;
      exports.Tuple = spec_2.Tuple;
      exports.Number = spec_2.Number;
      exports.String = spec_2.String;
      exports.Boolean = spec_2.Boolean;
      exports.Date = spec_2.Date;
      exports.Function = spec_2.Function;
      exports.Union = spec_2.Union;
      exports.Literal = spec_2.Literal;
  });
  define("test/spec", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
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
          j: typebox.Function(),
          k: typebox.Union(typebox.Any()),
          l: typebox.Literal(10)
      });
      describe("spec", function () {
          it("Any should conform to specification.", function () {
              assert.deepEqual(typebox.Any(), {
                  type: "any"
              });
          });
          it("Null should conform to specification.", function () {
              assert.deepEqual(typebox.Null(), {
                  type: "null"
              });
          });
          it("Undefined should conform to specification.", function () {
              assert.deepEqual(typebox.Undefined(), {
                  type: "undefined"
              });
          });
          it("Object should conform to specification.", function () {
              assert.deepEqual(complex, {
                  "type": "object",
                  "properties": {
                      "a": { "type": "any" },
                      "b": { "type": "null" },
                      "c": { "type": "undefined" },
                      "d": { "type": "object", "properties": {} },
                      "e": { "type": "array", "items": { "type": "any" } },
                      "f": { "type": "tuple", "items": [{ "type": "any" }] },
                      "g": { "type": "number" },
                      "h": { "type": "string" },
                      "i": { "type": "boolean" },
                      "j": { "type": "function" },
                      "k": { "type": "union", "items": [{ "type": "any" }] },
                      "l": { "type": "literal", "value": 10 }
                  }
              });
          });
          it("Array should conform to specification.", function () {
              assert.deepEqual(typebox.Array(typebox.Any()), {
                  type: "array",
                  items: { type: "any" }
              });
          });
          it("Array should default to type 'any' with zero arguments", function () {
              assert.deepEqual(typebox.Array(), {
                  type: "array",
                  items: { type: "any" }
              });
          });
          it("Tuple should conform to specification.", function () {
              assert.deepEqual(typebox.Tuple(typebox.Any()), {
                  type: "tuple",
                  items: [{ type: "any" }]
              });
          });
          it("Number should conform to specification.", function () {
              assert.deepEqual(typebox.Number(), {
                  type: "number"
              });
          });
          it("String should conform to specification.", function () {
              assert.deepEqual(typebox.String(), {
                  type: "string"
              });
          });
          it("Boolean should conform to specification.", function () {
              assert.deepEqual(typebox.Boolean(), {
                  type: "boolean"
              });
          });
          it("Date should conform to specification.", function () {
              assert.deepEqual(typebox.Date(), {
                  type: "date"
              });
          });
          it("Literal should conform to specification.", function () {
              assert.deepEqual(typebox.Literal(1), {
                  type: "literal",
                  value: 1
              });
          });
          it("Literal should throw on non string | numeric types.", function () {
              assert.throws(function () { return typebox.Literal({}); });
              assert.throws(function () { return typebox.Literal([]); });
              assert.throws(function () { return typebox.Literal(true); });
          });
      });
  });
  define("test/compare", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object(),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          j: typebox.Function(),
          k: typebox.Union(typebox.Any()),
          l: typebox.Literal(10)
      });
      var hyper_complex = typebox.Object({
          a: typebox.Array(typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex))),
          b: typebox.Tuple(typebox.Null(), complex, complex, typebox.Null(), typebox.Array(typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)))),
          c: typebox.Union(typebox.Any(), typebox.Any(), typebox.Any(), typebox.Array()),
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
              it("should compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Tuple()), true); });
              it("should compare with Number", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Number()), true); });
              it("should compare with String", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.String()), true); });
              it("should compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Boolean()), true); });
              it("should compare with Date", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Date()), true); });
              it("should compare with Function", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Function()), true); });
              it("should compare with Union", function () { return assert.equal(typebox.compare(typebox.Any(), typebox.Union()), true); });
          });
          describe("Null", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Any()), true); });
              it("should compare with Null", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Null()), true); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Null(), typebox.Union()), false); });
          });
          describe("Undefined", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Undefined()), true); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Undefined(), typebox.Union()), false); });
          });
          describe("Object", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Undefined()), false); });
              it("should compare with Object", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Object()), true); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Object(), typebox.Union()), false); });
              it("should compare with Complex", function () { return assert.equal(typebox.compare(complex, complex), true); }),
                  it("should compare with Hyper Complex", function () { return assert.equal(typebox.compare(hyper_complex, hyper_complex), true); });
          });
          describe("Array", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Object()), false); });
              it("should compare with Array", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Array()), true); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Array(), typebox.Union()), false); });
              it("should compare with Array<Complex>", function () { return assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(complex)), true); });
              it("should not compare with Array<Complex> to Array<Number>", function () { return assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(typebox.Number())), false); });
              it("should compare with Array<Complex> to Array<Any>", function () { return assert.equal(typebox.compare(typebox.Array(complex), typebox.Array()), true); });
          });
          describe("Tuple", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Null()), false); });
              it("should not compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Array()), false); });
              it("should compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Tuple()), true); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Tuple(), typebox.Union()), false); });
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
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Tuple()), false); });
              it("should compare with Number", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Number()), true); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Number(), typebox.Union()), false); });
          });
          describe("String", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Number()), false); });
              it("should compare with String", function () { return assert.equal(typebox.compare(typebox.String(), typebox.String()), true); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.String(), typebox.Union()), false); });
          });
          describe("Boolean", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.String()), false); });
              it("should compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Boolean()), true); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Boolean(), typebox.Union()), false); });
          });
          describe("Date", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Boolean()), false); });
              it("should compare with Date", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Date()), true); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Function()), false); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Date(), typebox.Union()), false); });
          });
          describe("Function", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Date()), false); });
              it("should compare with Function", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Function()), true); });
              it("should not compare with Union", function () { return assert.equal(typebox.compare(typebox.Function(), typebox.Union()), false); });
          });
          describe("Union", function () {
              it("should compare with Any", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Any()), true); });
              it("should not compare with Null", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Null()), false); });
              it("should compare with Undefined", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Undefined()), false); });
              it("should not compare with Object", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Object()), false); });
              it("should not compare with Array", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Array()), false); });
              it("should not compare with Tuple", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Tuple()), false); });
              it("should not compare with Number", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Number()), false); });
              it("should not compare with String", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.String()), false); });
              it("should not compare with Boolean", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Boolean()), false); });
              it("should not compare with Date", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Date()), false); });
              it("should not compare with Function", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Function()), false); });
              it("should compare with when both Unions are empty.", function () { return assert.equal(typebox.compare(typebox.Union(), typebox.Union()), true); });
              it("should not compare with incompatible types #1", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.String())), false); });
              it("should not compare with incompatible types #2", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.Object())), false); });
              it("should not compare with incompatible types #3", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.Union())), false); });
              it("should not compare with incompatible types #4", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.Array())), false); });
              it("should compare with compatible types #1", function () { return assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(complex)), true); });
              it("should compare with compatible types #2", function () { return assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(typebox.Number(), complex)), true); });
              it("should compare with compatible types #3", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Union(typebox.Number(), complex)), true); });
              it("should compare with compatible types #4", function () { return assert.equal(typebox.compare(typebox.Union(typebox.Array(complex)), typebox.Union(typebox.Array(typebox.Any()))), true); });
          });
      });
  });
  define("test/generate", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object(),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          j: typebox.Function(),
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
              var type = typebox.Tuple();
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
          it("Date should generate a date", function () {
              var type = typebox.Date();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "date");
          });
          it("Function should generate a function", function () {
              var type = typebox.Function();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "function");
          });
          it("Union should generate an object if empty.", function () {
              var type = typebox.Union();
              var value = typebox.generate(type);
              assert.equal(typebox.reflect(value), "object");
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
  define("test/reflect", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
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
  define("test/infer", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      describe("infer", function () {
          describe("Object", function () {
              it("should infer a object #1", function () {
                  var type = typebox.infer({});
                  assert.equal(type.type, "object");
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
                  assert.equal(type.type, "object");
                  var t = type;
                  assert.equal(t.properties['a'].type, "string");
                  assert.equal(t.properties['b'].type, "number");
                  assert.equal(t.properties['c'].type, "boolean");
                  assert.equal(t.properties['d'].type, "array");
                  assert.equal(t.properties['e'].type, "undefined");
                  assert.equal(t.properties['f'].type, "null");
                  assert.equal(t.properties['g'].type, "object");
              });
          });
          describe("Array", function () {
              it("an empty array should infer Array<Any>", function () {
                  var type = typebox.infer([]);
                  assert.equal(type.type, "array");
                  var t = type;
                  assert.equal(t.items.type, "any");
              });
              it("string elements should infer Array<String>", function () {
                  var type = typebox.infer(["hello"]);
                  assert.equal(type.type, "array");
                  var t = type;
                  assert.equal(t.items.type, "string");
              });
              it("numeric elements should infer Array<Number>", function () {
                  var type = typebox.infer([1]);
                  assert.equal(type.type, "array");
                  var t = type;
                  assert.equal(t.items.type, "number");
              });
              it("a mixed array should infer a union Array<String | Number>", function () {
                  var type = typebox.infer([1, "hello"]);
                  assert.equal(type.type, "array");
                  var t = type;
                  assert.equal(t.items.type, "union");
                  var u = t.items;
                  assert.equal(u.items[0].type, "number");
                  assert.equal(u.items[1].type, "string");
              });
          });
          describe("String", function () {
              it("should infer a string", function () {
                  var type = typebox.infer("hello world");
                  assert.equal(type.type, "string");
              });
          });
          describe("Number", function () {
              it("should infer a number #1", function () {
                  var type = typebox.infer(1);
                  assert.equal(type.type, "number");
              });
              it("should infer a number #2", function () {
                  var type = typebox.infer(NaN);
                  assert.equal(type.type, "number");
              });
          });
          describe("Boolean", function () {
              it("should infer a boolean #1", function () {
                  var type = typebox.infer(true);
                  assert.equal(type.type, "boolean");
              });
              it("should infer a boolean #2", function () {
                  var type = typebox.infer(false);
                  assert.equal(type.type, "boolean");
              });
          });
          describe("Date", function () {
              it("should infer a date", function () {
                  var type = typebox.infer(new Date());
                  assert.equal(type.type, "date");
              });
          });
          describe("Function", function () {
              it("should infer a function #1", function () {
                  var type = typebox.infer(function () { });
                  assert.equal(type.type, "function");
              });
              it("should infer a function #2", function () {
                  var type = typebox.infer(function () { });
                  assert.equal(type.type, "function");
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
                  var value = new Date();
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
  define("test/check", ["require", "exports", "src/index", "assert"], function (require, exports, typebox, assert) {
      "use strict";
      exports.__esModule = true;
      var complex = typebox.Object({
          a: typebox.Any(),
          b: typebox.Null(),
          c: typebox.Undefined(),
          d: typebox.Object(),
          e: typebox.Array(typebox.Any()),
          f: typebox.Tuple(typebox.Any()),
          g: typebox.Number(),
          h: typebox.String(),
          i: typebox.Boolean(),
          j: typebox.Function(),
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
              it("should validate a date", function () { return assert.equal(typebox.check(typebox.Any(), new Date()).success, true); });
              it("should validate a function", function () { return assert.equal(typebox.check(typebox.Any(), function () { }).success, true); });
          });
          describe("Null", function () {
              it("should validate a null", function () { return assert.equal(typebox.check(typebox.Null(), null).success, true); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Null(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Null(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Null(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Null(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Null(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Null(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Null(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Null(), function () { }).success, false); });
          });
          describe("Undefined", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Undefined(), null).success, false); });
              it("should validate a undefined", function () { return assert.equal(typebox.check(typebox.Undefined(), undefined).success, true); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Undefined(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Undefined(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Undefined(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Undefined(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Undefined(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Undefined(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Undefined(), function () { }).success, false); });
          });
          describe("Object", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Object(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Object(), undefined).success, false); });
              it("should validate a object", function () { return assert.equal(typebox.check(typebox.Object(), {}).success, true); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Object(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Object(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Object(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Object(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Object(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Object(), function () { }).success, false); });
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
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Array(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Array(), function () { }).success, false); });
              it("should validate a complex array", function () { return assert.equal(typebox.check(typebox.Array(complex), [complex_instance]).success, true); });
              it("should not validate a hyper array", function () { return assert.equal(typebox.check(typebox.Array(complex), [hyper_instance]).success, false); });
              it("should not validate a mixed array", function () { return assert.equal(typebox.check(typebox.Array(complex), [complex_instance, complex_instance, complex_instance, 1]).success, false); });
          });
          describe("Tuple:Empty", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Tuple(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Tuple(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Tuple(), {}).success, false); });
              it("should validate a array", function () { return assert.equal(typebox.check(typebox.Tuple(), []).success, true); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Tuple(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Tuple(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Tuple(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Tuple(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Tuple(), function () { }).success, false); });
          });
          describe("Tuple:Elements", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), function () { }).success, false); });
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
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Number(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Number(), function () { }).success, false); });
          });
          describe("String", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.String(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.String(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.String(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.String(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.String(), 1).success, false); });
              it("should validate a string", function () { return assert.equal(typebox.check(typebox.String(), "hello").success, true); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.String(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.String(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.String(), function () { }).success, false); });
          });
          describe("Boolean", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Boolean(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Boolean(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Boolean(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Boolean(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Boolean(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Boolean(), "hello").success, false); });
              it("should validate a boolean", function () { return assert.equal(typebox.check(typebox.Boolean(), true).success, true); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Boolean(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Boolean(), function () { }).success, false); });
          });
          describe("Date", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Date(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Date(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Date(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Date(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Date(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Date(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Date(), true).success, false); });
              it("should validate a date", function () { return assert.equal(typebox.check(typebox.Date(), new Date()).success, true); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Date(), function () { }).success, false); });
          });
          describe("Function", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Function(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Function(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Function(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Function(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Function(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Function(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Function(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Function(), new Date()).success, false); });
              it("should validate a function", function () { return assert.equal(typebox.check(typebox.Function(), function () { }).success, true); });
          });
          describe("Union:Empty", function () {
              it("should not validate a null", function () { return assert.equal(typebox.check(typebox.Union(), null).success, false); });
              it("should not validate a undefined", function () { return assert.equal(typebox.check(typebox.Union(), undefined).success, false); });
              it("should not validate a object", function () { return assert.equal(typebox.check(typebox.Union(), {}).success, false); });
              it("should not validate a array", function () { return assert.equal(typebox.check(typebox.Union(), []).success, false); });
              it("should not validate a number", function () { return assert.equal(typebox.check(typebox.Union(), 1).success, false); });
              it("should not validate a string", function () { return assert.equal(typebox.check(typebox.Union(), "hello").success, false); });
              it("should not validate a boolean", function () { return assert.equal(typebox.check(typebox.Union(), true).success, false); });
              it("should not validate a date", function () { return assert.equal(typebox.check(typebox.Union(), new Date()).success, false); });
              it("should not validate a function", function () { return assert.equal(typebox.check(typebox.Union(), function () { }).success, false); });
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
              it("should validate a date", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), new Date()).success, true); });
              it("should validate a function", function () { return assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), function () { }).success, true); });
          });
      });
  });
  define("test/index", ["require", "exports", "test/spec", "test/compare", "test/generate", "test/reflect", "test/infer", "test/check"], function (require, exports) {
      "use strict";
      exports.__esModule = true;
  });
  
  return collect(); 
})();