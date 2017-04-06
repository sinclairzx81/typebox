var typebox = (function () {
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

  define("reflect", ["require", "exports"], function (require, exports) {
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
  define("spec", ["require", "exports", "reflect"], function (require, exports, reflect_1) {
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
  define("compare", ["require", "exports"], function (require, exports) {
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
  define("infer", ["require", "exports", "reflect", "compare", "spec"], function (require, exports, reflect_2, compare_1, spec_1) {
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
  define("generate", ["require", "exports"], function (require, exports) {
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
  define("check", ["require", "exports", "reflect"], function (require, exports, reflect_3) {
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
  define("index", ["require", "exports", "reflect", "infer", "compare", "generate", "check", "spec"], function (require, exports, reflect_4, infer_1, compare_2, generate_1, check_1, spec_2) {
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
  
  return collect(); 
})();